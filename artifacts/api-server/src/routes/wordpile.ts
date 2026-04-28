import {
  Router,
  type IRouter,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { getAuth, clerkClient } from "@clerk/express";
import {
  db,
  wordpilePilesTable,
  wordpileWordsTable,
  wordpileDeletionsTable,
  wordpileShortLinksTable,
  type WordpilePileRow,
  type WordpileWordRow,
  type WordpileShortLinkRow,
} from "@workspace/db";
import { and, asc, desc, eq, inArray, lt } from "drizzle-orm";
import { randomBytes } from "node:crypto";

// Tombstone kinds. Kept as a narrow string union and reused in the helper
// below so a typo can't silently insert e.g. kind="words" (plural) and
// quietly fail the lookup later.
type TombstoneKind = "pile" | "word";

// How long a tombstone has to stick around before /sync will sweep it.
//
// Why 90 days?
//   - Tombstones only need to outlast the last device that might still
//     be holding the deleted id in its local cache. Once every active
//     device has confirmed it knows about the deletion (which happens
//     the first time that device hits /sync after the delete), the
//     tombstone has nothing left to protect — its only job was to keep
//     a stale upload from resurrecting the row.
//   - 90 days comfortably covers the worst-case "phone left at the
//     back of a drawer over a long trip" offline window. A device
//     that returns later than that with a stale snapshot will simply
//     re-insert the deleted ids — a graceful failure mode for an edge
//     case rare enough to be worth the table-size win.
//   - On the other end, 90 days keeps the table small enough that even
//     a power user churning thousands of words a year tops out at a
//     few thousand live tombstones at any one moment, which is well
//     within what the (clerkUserId, kind, id) PK index can serve in a
//     single millisecond.
const TOMBSTONE_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;

const router: IRouter = Router();

// ----------------------- types & helpers -----------------------

type Bucket = "unsorted" | "load" | "interior" | "avoid";
const VALID_BUCKETS: readonly Bucket[] = [
  "unsorted",
  "load",
  "interior",
  "avoid",
];
function isBucket(v: unknown): v is Bucket {
  return typeof v === "string" && (VALID_BUCKETS as readonly string[]).includes(v);
}

// Cheap UUID v4-ish guard. We only check shape — Postgres will reject anything
// the driver can't coerce, but rejecting early lets us return 400 instead of
// surfacing a DB error.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function serializeWord(row: WordpileWordRow) {
  return {
    id: row.id,
    pileId: row.pileId,
    word: row.word,
    note: row.note,
    bucket: (isBucket(row.bucket) ? row.bucket : "unsorted") as Bucket,
    saferAlternative: row.saferAlternative,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function serializePile(
  pile: WordpilePileRow,
  words: WordpileWordRow[],
) {
  return {
    id: pile.id,
    name: pile.name,
    createdAt: pile.createdAt.toISOString(),
    updatedAt: pile.updatedAt.toISOString(),
    words: words.map(serializeWord),
  };
}

// Look up all piles + words for a user in two round trips and stitch them.
// We do the stitching in JS rather than a SQL join so the JSON shape stays
// flat — Drizzle's joined-row tuples are awkward to map into nested arrays
// and there's never going to be enough data here to make N+1 a concern.
async function loadSnapshot(clerkUserId: string) {
  const piles = await db
    .select()
    .from(wordpilePilesTable)
    .where(eq(wordpilePilesTable.clerkUserId, clerkUserId))
    .orderBy(asc(wordpilePilesTable.createdAt));
  if (piles.length === 0) return { piles: [] };

  const pileIds = piles.map((p) => p.id);
  const words = await db
    .select()
    .from(wordpileWordsTable)
    .where(inArray(wordpileWordsTable.pileId, pileIds))
    .orderBy(asc(wordpileWordsTable.createdAt));

  const wordsByPile = new Map<string, WordpileWordRow[]>();
  for (const w of words) {
    const list = wordsByPile.get(w.pileId);
    if (list) list.push(w);
    else wordsByPile.set(w.pileId, [w]);
  }
  return {
    piles: piles.map((p) => serializePile(p, wordsByPile.get(p.id) ?? [])),
  };
}

// A "db-like" handle: either the top-level `db` or a transaction `tx`
// passed in via `db.transaction(async (tx) => ...)`. Drizzle gives `db`
// and `tx` *different* TypeScript types (only `db` carries the pool
// `$client`), but their query-builder surface is identical. We keep the
// type structural and narrow to just the methods `recordDeletion` uses
// so the helper accepts either one without an `as any` escape hatch.
type DbLike = Pick<typeof db, "insert" | "delete">;

// Record a tombstone for a pile or word the caller has just deleted.
// The /sync route consults these so a stale device that still has the
// row cached locally cannot resurrect it on its next bootstrap upload.
//
// We delete-then-insert rather than rely on Postgres ON CONFLICT so the
// behaviour is identical against the in-memory test fake (which doesn't
// model upserts) and against the real DB. Re-deleting an already-deleted
// id is rare in practice (the pile would have to exist for the route's
// `findOwnedPile` check to pass), but the bumped `deletedAt` keeps the
// "tombstone newer than incoming.updatedAt" check on /sync correct in
// that edge case too.
//
// Always invoke this inside a `db.transaction(...)` together with the
// row delete itself — otherwise a partial failure (row deleted but
// tombstone insert errored) would leave the door open for /sync to
// later resurrect the row, which is exactly the invariant this table
// exists to protect.
async function recordDeletion(
  exec: DbLike,
  clerkUserId: string,
  kind: TombstoneKind,
  id: string,
): Promise<void> {
  await exec
    .delete(wordpileDeletionsTable)
    .where(
      and(
        eq(wordpileDeletionsTable.clerkUserId, clerkUserId),
        eq(wordpileDeletionsTable.kind, kind),
        eq(wordpileDeletionsTable.id, id),
      ),
    );
  await exec.insert(wordpileDeletionsTable).values({
    clerkUserId,
    kind,
    id,
    deletedAt: new Date(),
  });
}

// Fetch a single pile owned by the caller, or null if missing/not theirs.
// We always check ownership in the WHERE clause rather than fetching first
// then comparing — that keeps the 404 / 403 distinction from leaking.
async function findOwnedPile(
  clerkUserId: string,
  pileId: string,
): Promise<WordpilePileRow | null> {
  if (!isUuid(pileId)) return null;
  const [row] = await db
    .select()
    .from(wordpilePilesTable)
    .where(
      and(
        eq(wordpilePilesTable.id, pileId),
        eq(wordpilePilesTable.clerkUserId, clerkUserId),
      ),
    )
    .limit(1);
  return row ?? null;
}

// ----------------------- auth gate -----------------------

// Attach the resolved Clerk user id (and email, lazily) to the request.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      wordpileUser?: { clerkUserId: string };
    }
  }
}

function withAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.wordpileUser = { clerkUserId };
  next();
}

// ----------------------- routes -----------------------

// /me is the only route that doesn't 401 when signed-out — the client uses
// it to decide whether to enable cloud sync. Returning 200 with
// `isAuthenticated: false` makes that branching one fewer try/catch.
router.get("/me", async (req, res) => {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) {
    res.json({ isAuthenticated: false, userId: null, email: null });
    return;
  }
  let email: string | null = null;
  try {
    const u = await clerkClient.users.getUser(clerkUserId);
    email =
      u.primaryEmailAddress?.emailAddress ??
      u.emailAddresses[0]?.emailAddress ??
      null;
  } catch {
    // Non-fatal — auth is still valid even if we can't resolve the email.
  }
  res.json({ isAuthenticated: true, userId: clerkUserId, email });
});

router.get("/piles", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const snapshot = await loadSnapshot(clerkUserId);
  res.json(snapshot);
});

// Bootstrap merge endpoint. Called once after sign-in with the local
// (anonymous) snapshot. For every incoming pile/word:
//   - if a tombstone exists with deletedAt >= incoming.updatedAt, SKIP
//     (the user deleted this on another device after the client's last
//     known modification — don't resurrect it). For piles, this also
//     skips the entire `words` array under that pile, since those words
//     would otherwise become orphans relative to a missing parent.
//   - else if no row with that id exists for this user, INSERT it
//   - else if the incoming updatedAt is strictly newer, UPDATE
//   - otherwise leave the server row alone
// We do not delete server rows that are missing locally — the user's
// other devices may have piles this device has never seen. The tombstone
// table is what now distinguishes "this device never knew about it"
// (keep the server's row) from "this device's copy is stale and must
// not undo a deletion" (skip the upload).
router.post("/sync", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const body = (req.body ?? {}) as { piles?: unknown };
  const incoming = Array.isArray(body.piles) ? body.piles : [];

  // Lazy garbage collection: drop this user's tombstones that are older
  // than the retention window before we read them. Done on every /sync
  // because:
  //   - it avoids standing up a separate cron / scheduler just for one
  //     table,
  //   - the cost scales with how often the user actually syncs (idle
  //     accounts pay nothing), and
  //   - the same request that benefits from a smaller tombstone table
  //     (a power user mid-session) is the one that pays the cleanup.
  // The sweep is intentionally outside the merge transaction below — a
  // transient DB error losing the sweep is harmless (the next /sync
  // tries again), and decoupling it from the merge keeps the hot path
  // straightforward.
  const cutoff = new Date(Date.now() - TOMBSTONE_RETENTION_MS);
  await db
    .delete(wordpileDeletionsTable)
    .where(
      and(
        eq(wordpileDeletionsTable.clerkUserId, clerkUserId),
        lt(wordpileDeletionsTable.deletedAt, cutoff),
      ),
    );

  // Pull the existing rows once so we can decide insert-vs-update without
  // hammering the DB inside the loop.
  const existingPiles = await db
    .select()
    .from(wordpilePilesTable)
    .where(eq(wordpilePilesTable.clerkUserId, clerkUserId));
  const existingPileById = new Map(existingPiles.map((p) => [p.id, p]));

  const existingPileIds = existingPiles.map((p) => p.id);
  const existingWords =
    existingPileIds.length > 0
      ? await db
          .select()
          .from(wordpileWordsTable)
          .where(inArray(wordpileWordsTable.pileId, existingPileIds))
      : [];
  const existingWordById = new Map(existingWords.map((w) => [w.id, w]));

  // Tombstones for this user, split by kind so the lookup inside the
  // loop is O(1).
  const tombstones = await db
    .select()
    .from(wordpileDeletionsTable)
    .where(eq(wordpileDeletionsTable.clerkUserId, clerkUserId));
  const pileTombstoneAt = new Map<string, Date>();
  const wordTombstoneAt = new Map<string, Date>();
  for (const t of tombstones) {
    if (t.kind === "pile") pileTombstoneAt.set(t.id, t.deletedAt);
    else if (t.kind === "word") wordTombstoneAt.set(t.id, t.deletedAt);
  }

  for (const raw of incoming) {
    if (!raw || typeof raw !== "object") continue;
    const p = raw as Record<string, unknown>;
    if (!isUuid(p.id) || typeof p.name !== "string") continue;

    const incomingUpdated = parseDate(p.updatedAt) ?? new Date();
    const incomingCreated = parseDate(p.createdAt) ?? incomingUpdated;

    // Refuse to resurrect a deleted pile when the client has nothing
    // newer than the deletion. We use `>=` (not `>`) so that a
    // simultaneous tombstone+upload defaults to "delete wins" — the
    // user's most recent intentful action was the delete.
    const pileTomb = pileTombstoneAt.get(p.id);
    if (pileTomb && pileTomb.getTime() >= incomingUpdated.getTime()) {
      continue;
    }

    const existing = existingPileById.get(p.id);

    if (!existing) {
      await db.insert(wordpilePilesTable).values({
        id: p.id,
        clerkUserId,
        name: p.name,
        createdAt: incomingCreated,
        updatedAt: incomingUpdated,
      });
    } else if (incomingUpdated.getTime() > existing.updatedAt.getTime()) {
      await db
        .update(wordpilePilesTable)
        .set({ name: p.name, updatedAt: incomingUpdated })
        .where(eq(wordpilePilesTable.id, p.id));
    }

    // Words. Same shape as above. The pileId on incoming words is trusted
    // because we just verified the pile is owned by the caller (either it
    // was just inserted by this loop or it was in `existingPileById`).
    const wordsRaw = Array.isArray(p.words) ? p.words : [];
    for (const wraw of wordsRaw) {
      if (!wraw || typeof wraw !== "object") continue;
      const w = wraw as Record<string, unknown>;
      if (!isUuid(w.id) || typeof w.word !== "string") continue;

      const wUpdated = parseDate(w.updatedAt) ?? new Date();
      const wCreated = parseDate(w.createdAt) ?? wUpdated;
      const bucket: Bucket = isBucket(w.bucket) ? w.bucket : "unsorted";
      const note = typeof w.note === "string" ? w.note : "";
      const safer =
        typeof w.saferAlternative === "string" ? w.saferAlternative : "";

      const wTomb = wordTombstoneAt.get(w.id);
      if (wTomb && wTomb.getTime() >= wUpdated.getTime()) {
        continue;
      }

      const existingWord = existingWordById.get(w.id);
      if (!existingWord) {
        await db.insert(wordpileWordsTable).values({
          id: w.id,
          pileId: p.id,
          word: w.word,
          note,
          bucket,
          saferAlternative: safer,
          createdAt: wCreated,
          updatedAt: wUpdated,
        });
      } else if (wUpdated.getTime() > existingWord.updatedAt.getTime()) {
        await db
          .update(wordpileWordsTable)
          .set({
            word: w.word,
            note,
            bucket,
            saferAlternative: safer,
            updatedAt: wUpdated,
          })
          .where(eq(wordpileWordsTable.id, w.id));
      }
    }
  }

  const snapshot = await loadSnapshot(clerkUserId);
  res.json(snapshot);
});

router.post("/piles", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const body = (req.body ?? {}) as Record<string, unknown>;
  if (!isUuid(body.id)) {
    res.status(400).json({ error: "id (uuid) is required" });
    return;
  }
  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const createdAt = parseDate(body.createdAt) ?? new Date();
  const updatedAt = parseDate(body.updatedAt) ?? createdAt;

  // Idempotent: if the same id already exists for this user, return it
  // unchanged — saves the client from race-condition edge cases on the
  // first mutation right after sign-in.
  const existing = await findOwnedPile(clerkUserId, body.id);
  if (existing) {
    res.json(serializePile(existing, []));
    return;
  }

  const [inserted] = await db
    .insert(wordpilePilesTable)
    .values({
      id: body.id,
      clerkUserId,
      name: body.name.trim(),
      createdAt,
      updatedAt,
    })
    .returning();

  if (!inserted) {
    res.status(500).json({ error: "Failed to create pile" });
    return;
  }
  res.json(serializePile(inserted, []));
});

router.patch("/piles/:pileId", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const pileId = String(req.params.pileId);
  const pile = await findOwnedPile(clerkUserId, pileId);
  if (!pile) {
    res.status(404).json({ error: "Pile not found" });
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  const updates: Partial<typeof wordpilePilesTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (typeof body.name === "string" && body.name.trim().length > 0) {
    updates.name = body.name.trim();
  }

  const [updated] = await db
    .update(wordpilePilesTable)
    .set(updates)
    .where(eq(wordpilePilesTable.id, pileId))
    .returning();
  if (!updated) {
    res.status(500).json({ error: "Failed to update pile" });
    return;
  }
  res.json(serializePile(updated, []));
});

router.delete("/piles/:pileId", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const pileId = String(req.params.pileId);
  const pile = await findOwnedPile(clerkUserId, pileId);
  if (!pile) {
    res.status(404).json({ error: "Pile not found" });
    return;
  }
  // Run the row delete and the tombstone insert in a single
  // transaction. If either statement fails, both roll back — that
  // keeps the invariant "every deleted pile has a tombstone" intact,
  // which is exactly what /sync relies on to refuse stale-device
  // resurrection. Words cascade via the FK definition.
  await db.transaction(async (tx) => {
    await tx
      .delete(wordpilePilesTable)
      .where(eq(wordpilePilesTable.id, pileId));
    // Pile-level tombstone is sufficient: /sync's outer-loop skip
    // short-circuits the entire incoming `words` array under a
    // tombstoned pile, so cascaded words can't reappear via /sync.
    await recordDeletion(tx, clerkUserId, "pile", pileId);
  });
  res.json({ ok: true });
});

router.post("/piles/:pileId/words", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const pileId = String(req.params.pileId);
  const pile = await findOwnedPile(clerkUserId, pileId);
  if (!pile) {
    res.status(404).json({ error: "Pile not found" });
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  if (!isUuid(body.id)) {
    res.status(400).json({ error: "id (uuid) is required" });
    return;
  }
  if (typeof body.word !== "string" || body.word.trim().length === 0) {
    res.status(400).json({ error: "word is required" });
    return;
  }
  const note = typeof body.note === "string" ? body.note : "";
  const bucket: Bucket = isBucket(body.bucket) ? body.bucket : "unsorted";
  const safer =
    typeof body.saferAlternative === "string" ? body.saferAlternative : "";
  const createdAt = parseDate(body.createdAt) ?? new Date();
  const updatedAt = parseDate(body.updatedAt) ?? createdAt;

  // Idempotent on id, same reasoning as POST /piles.
  const [existing] = await db
    .select()
    .from(wordpileWordsTable)
    .where(eq(wordpileWordsTable.id, body.id))
    .limit(1);
  if (existing && existing.pileId === pileId) {
    res.json(serializeWord(existing));
    return;
  }
  if (existing && existing.pileId !== pileId) {
    res.status(409).json({ error: "Word id already belongs to another pile" });
    return;
  }

  const [inserted] = await db
    .insert(wordpileWordsTable)
    .values({
      id: body.id,
      pileId,
      word: body.word.trim(),
      note,
      bucket,
      saferAlternative: safer,
      createdAt,
      updatedAt,
    })
    .returning();
  if (!inserted) {
    res.status(500).json({ error: "Failed to create word" });
    return;
  }

  // Touch the parent pile so list-order / "recently active" sorts work.
  await db
    .update(wordpilePilesTable)
    .set({ updatedAt: new Date() })
    .where(eq(wordpilePilesTable.id, pileId));

  res.json(serializeWord(inserted));
});

router.patch("/piles/:pileId/words/:wordId", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const pileId = String(req.params.pileId);
  const wordId = String(req.params.wordId);
  const pile = await findOwnedPile(clerkUserId, pileId);
  if (!pile) {
    res.status(404).json({ error: "Pile not found" });
    return;
  }
  if (!isUuid(wordId)) {
    res.status(404).json({ error: "Word not found" });
    return;
  }
  const [existing] = await db
    .select()
    .from(wordpileWordsTable)
    .where(
      and(
        eq(wordpileWordsTable.id, wordId),
        eq(wordpileWordsTable.pileId, pileId),
      ),
    )
    .limit(1);
  if (!existing) {
    res.status(404).json({ error: "Word not found" });
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  const updates: Partial<typeof wordpileWordsTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (typeof body.word === "string" && body.word.trim().length > 0) {
    updates.word = body.word.trim();
  }
  if (typeof body.note === "string") updates.note = body.note;
  if (isBucket(body.bucket)) updates.bucket = body.bucket;
  if (typeof body.saferAlternative === "string") {
    updates.saferAlternative = body.saferAlternative;
  }

  const [updated] = await db
    .update(wordpileWordsTable)
    .set(updates)
    .where(eq(wordpileWordsTable.id, wordId))
    .returning();
  if (!updated) {
    res.status(500).json({ error: "Failed to update word" });
    return;
  }

  await db
    .update(wordpilePilesTable)
    .set({ updatedAt: new Date() })
    .where(eq(wordpilePilesTable.id, pileId));

  res.json(serializeWord(updated));
});

// ----------------------- short-link routes -----------------------
//
// Server-stored short links for share URLs that get too long to paste
// into Signal/SMS/etc. Tradeoffs vs. fragment links are spelled out in
// the schema comment and the editor UI. The four endpoints below are:
//
//   POST   /short-links        (auth)   create + return slug
//   GET    /short-links        (auth)   list mine — for the manage UI
//   GET    /short-links/:slug  (public) resolve — recipients aren't users
//   DELETE /short-links/:slug  (auth)   revoke (owner-only, 404 otherwise)
//
// We keep the encoded payload opaque on the server: same gzip+base64url
// blob the client would have stuffed into the fragment, just stored
// instead of encoded into the URL. The size cap mirrors the client's
// MAX_ENCODED_LENGTH (32KB of base64).

const SHORT_LINK_PAYLOAD_MAX = 32 * 1024;

// ---- Per-user guardrails on POST /short-links ----
//
// The endpoint is auth-gated, but a buggy or malicious client (with a
// valid session) could otherwise create rows in a tight loop until the
// table is unusable. Two cheap caps keep that contained without getting
// in the way of normal use:
//
//   1. MAX_ACTIVE_SHORT_LINKS_PER_USER  — a hard ceiling on how many
//      short links one user can have alive at once. Hitting it returns
//      409 with a message telling the user to revoke old links first.
//      200 is well above any realistic share-link workflow but small
//      enough that even thousands of users can't grow the table beyond
//      the low hundreds of thousands of rows.
//
//   2. SHORT_LINK_RATE_LIMIT_*          — a token-bucket rate limit on
//      create attempts, keyed by Clerk user id. 30 creates/minute is
//      generous for a human (one click every two seconds, sustained
//      for a minute) but well below what a runaway script can do.
//      Exceeding it returns 429 with a Retry-After header so a polite
//      client can back off.
//
// Both limits are tunable in one place here. The bucket lives in this
// process's memory — sufficient because a) the API is small and runs
// behind a single deployment today, and b) a multi-process attacker
// would still hit the per-user row cap as a hard ceiling even if the
// per-process bucket were bypassed.
const MAX_ACTIVE_SHORT_LINKS_PER_USER = 200;
const SHORT_LINK_RATE_LIMIT_CAPACITY = 30;
const SHORT_LINK_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const SHORT_LINK_RATE_LIMIT_REFILL_PER_MS =
  SHORT_LINK_RATE_LIMIT_CAPACITY / SHORT_LINK_RATE_LIMIT_WINDOW_MS;

type RateBucket = { tokens: number; lastRefill: number };
const shortLinkRateBuckets = new Map<string, RateBucket>();

// Try to take one token from the user's bucket. Returns ok=true if the
// caller may proceed; otherwise returns the smallest whole-second
// retry-after that's enough to recover one token. Refill is computed
// lazily on each call so an idle user always finds a full bucket
// without us having to run a background timer.
function consumeShortLinkToken(
  clerkUserId: string,
  now: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  let bucket = shortLinkRateBuckets.get(clerkUserId);
  if (!bucket) {
    bucket = { tokens: SHORT_LINK_RATE_LIMIT_CAPACITY, lastRefill: now };
    shortLinkRateBuckets.set(clerkUserId, bucket);
  } else {
    const elapsed = Math.max(0, now - bucket.lastRefill);
    bucket.tokens = Math.min(
      SHORT_LINK_RATE_LIMIT_CAPACITY,
      bucket.tokens + elapsed * SHORT_LINK_RATE_LIMIT_REFILL_PER_MS,
    );
    bucket.lastRefill = now;
  }
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { ok: true };
  }
  const tokensNeeded = 1 - bucket.tokens;
  const retryAfterMs = Math.ceil(
    tokensNeeded / SHORT_LINK_RATE_LIMIT_REFILL_PER_MS,
  );
  // Round up to whole seconds, with a 1s floor so Retry-After is never
  // "0" (which would invite an immediate retry that's still rate-limited).
  const retryAfterSec = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return { ok: false, retryAfterSec };
}

// Test-only escape hatch: vitest reuses the module instance across `it`
// blocks within a file, so the bucket would otherwise carry state from
// one test into the next. Exported under a clearly-marked name so it
// can't be mistaken for production API.
export function __resetShortLinkRateLimitForTesting(): void {
  shortLinkRateBuckets.clear();
}

// Slug shape: base64url alphabet, fixed length, generated server-side.
// We never accept client-supplied slugs — that keeps slug collisions
// purely a server problem and avoids "guess my friend's slug" attacks.
const SLUG_RE = /^[A-Za-z0-9_-]{8,32}$/;
function isSlug(v: unknown): v is string {
  return typeof v === "string" && SLUG_RE.test(v);
}

function generateSlug(): string {
  // 8 random bytes → 11 base64url characters (no padding). At ~10^19
  // possibilities a single-row collision check is overwhelmingly enough;
  // the create endpoint retries a couple of times anyway.
  return randomBytes(8).toString("base64url");
}

function serializeShortLinkSummary(row: WordpileShortLinkRow) {
  return {
    slug: row.slug,
    pileId: row.pileId,
    pileName: row.pileName,
    payloadLength: row.payload.length,
    createdAt: row.createdAt.toISOString(),
  };
}

router.post("/short-links", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const body = (req.body ?? {}) as Record<string, unknown>;

  // Rate limit first — cheap, in-memory, and shields the validation
  // and DB paths from a tight-loop client even if every request is
  // garbage. Counting failed attempts is intentional: a runaway script
  // sending nonsense payloads is exactly what this guard exists for.
  const rl = consumeShortLinkToken(clerkUserId, Date.now());
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfterSec));
    res.status(429).json({
      error:
        "Too many short links created in a short window. Please try again shortly.",
      retryAfterSeconds: rl.retryAfterSec,
    });
    return;
  }

  if (typeof body.payload !== "string" || body.payload.length === 0) {
    res.status(400).json({ error: "payload is required" });
    return;
  }
  if (body.payload.length > SHORT_LINK_PAYLOAD_MAX) {
    // Mirrors the client-side guard. We refuse here too so a tampered
    // client can't fill the table with multi-MB rows.
    res.status(413).json({
      error: "payload too large",
      maxLength: SHORT_LINK_PAYLOAD_MAX,
    });
    return;
  }
  // Same alphabet check the encoder produces — block obvious garbage
  // up front so the resolve endpoint never has to deal with it.
  if (!/^[A-Za-z0-9_-]+$/.test(body.payload)) {
    res.status(400).json({ error: "payload must be base64url" });
    return;
  }

  // Per-user row cap. We do this after basic validation so a request
  // that would have been a 400 still gets a 400 (no need to hide the
  // shape of the cap behind a malformed-payload mask). The count uses
  // a plain SELECT rather than COUNT(*) so the test fake — which only
  // implements the row-list query surface — works unchanged. The
  // capacity is small (200), so reading the rows is cheap in practice.
  const existing = await db
    .select()
    .from(wordpileShortLinksTable)
    .where(eq(wordpileShortLinksTable.clerkUserId, clerkUserId));
  if (existing.length >= MAX_ACTIVE_SHORT_LINKS_PER_USER) {
    res.status(409).json({
      error: `You already have ${MAX_ACTIVE_SHORT_LINKS_PER_USER} active short links. Revoke some from the manage screen before creating new ones.`,
      maxActiveLinks: MAX_ACTIVE_SHORT_LINKS_PER_USER,
    });
    return;
  }

  const pileId =
    typeof body.pileId === "string" && isUuid(body.pileId) ? body.pileId : null;
  const pileNameRaw =
    typeof body.pileName === "string" ? body.pileName.trim() : "";
  const pileName = pileNameRaw.slice(0, 200);

  // Generate-and-retry on collision. With 8 random bytes, p(collision)
  // for the second insert is ~1 in 10^19 — three tries is comically
  // generous but cheap enough that future-us doesn't have to think
  // about whether the table has grown to a billion rows.
  let inserted: WordpileShortLinkRow | undefined;
  let attempts = 0;
  while (!inserted && attempts < 3) {
    attempts += 1;
    const slug = generateSlug();
    try {
      const [row] = await db
        .insert(wordpileShortLinksTable)
        .values({
          slug,
          clerkUserId,
          pileId,
          pileName,
          payload: body.payload,
          createdAt: new Date(),
        })
        .returning();
      inserted = row;
    } catch (err) {
      // Postgres unique-violation is the only expected failure here.
      // Anything else (DB down, etc.) we let bubble — the test fake
      // throws a synchronous Error with "duplicate key" in the message
      // for PK conflicts so we can match either shape.
      const msg = err instanceof Error ? err.message : String(err);
      if (!/duplicate key|unique constraint|already exists/i.test(msg)) {
        throw err;
      }
    }
  }
  if (!inserted) {
    res.status(500).json({ error: "Failed to allocate short link" });
    return;
  }
  res.status(201).json(serializeShortLinkSummary(inserted));
});

router.get("/short-links", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const rows = await db
    .select()
    .from(wordpileShortLinksTable)
    .where(eq(wordpileShortLinksTable.clerkUserId, clerkUserId))
    .orderBy(desc(wordpileShortLinksTable.createdAt));
  res.json({ links: rows.map(serializeShortLinkSummary) });
});

// Public resolve: no auth check. We deliberately return only the
// payload + the (cosmetic) pileName so the recipient's import preview
// can show "Importing 'Deer Lake' from a shared link". Owner identity
// is never disclosed.
router.get("/short-links/:slug", async (req, res) => {
  const slug = String(req.params.slug);
  if (!isSlug(slug)) {
    res.status(404).json({ error: "Short link not found" });
    return;
  }
  const [row] = await db
    .select()
    .from(wordpileShortLinksTable)
    .where(eq(wordpileShortLinksTable.slug, slug))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Short link not found" });
    return;
  }
  res.json({
    slug: row.slug,
    payload: row.payload,
    pileName: row.pileName,
  });
});

router.delete("/short-links/:slug", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const slug = String(req.params.slug);
  if (!isSlug(slug)) {
    // Same as a missing row — don't leak the distinction between
    // "malformed slug" and "not yours".
    res.status(404).json({ error: "Short link not found" });
    return;
  }
  // Look it up scoped to the caller. We do the ownership check in the
  // WHERE clause so a different user's slug appears identical to a
  // missing slug from the outside.
  const [row] = await db
    .select()
    .from(wordpileShortLinksTable)
    .where(
      and(
        eq(wordpileShortLinksTable.slug, slug),
        eq(wordpileShortLinksTable.clerkUserId, clerkUserId),
      ),
    )
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Short link not found" });
    return;
  }
  await db
    .delete(wordpileShortLinksTable)
    .where(eq(wordpileShortLinksTable.slug, slug));
  res.json({ ok: true });
});

router.delete("/piles/:pileId/words/:wordId", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const pileId = String(req.params.pileId);
  const wordId = String(req.params.wordId);
  const pile = await findOwnedPile(clerkUserId, pileId);
  if (!pile) {
    res.status(404).json({ error: "Pile not found" });
    return;
  }
  if (!isUuid(wordId)) {
    res.json({ ok: true });
    return;
  }
  // Word delete + pile touch + tombstone insert all in one tx — same
  // reasoning as the pile delete: a partial failure that leaves the
  // word gone but no tombstone behind would let stale-device /sync
  // resurrect it on the next bootstrap.
  await db.transaction(async (tx) => {
    await tx
      .delete(wordpileWordsTable)
      .where(
        and(
          eq(wordpileWordsTable.id, wordId),
          eq(wordpileWordsTable.pileId, pileId),
        ),
      );

    await tx
      .update(wordpilePilesTable)
      .set({ updatedAt: new Date() })
      .where(eq(wordpilePilesTable.id, pileId));

    // The parent pile still exists (no pile tombstone), so /sync's
    // outer-loop skip wouldn't catch this — the per-word tombstone is
    // what blocks resurrection.
    await recordDeletion(tx, clerkUserId, "word", wordId);
  });

  res.json({ ok: true });
});

export default router;

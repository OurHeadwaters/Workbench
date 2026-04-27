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
  type WordpilePileRow,
  type WordpileWordRow,
} from "@workspace/db";
import { and, asc, eq, inArray } from "drizzle-orm";

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
//   - if no row with that id exists for this user, INSERT it
//   - if a row exists and the incoming updatedAt is strictly newer, UPDATE
//   - otherwise leave the server row alone
// We do not delete server rows that are missing locally — the user's other
// devices may have piles this device has never seen.
router.post("/sync", withAuth, async (req, res) => {
  const { clerkUserId } = req.wordpileUser!;
  const body = (req.body ?? {}) as { piles?: unknown };
  const incoming = Array.isArray(body.piles) ? body.piles : [];

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

  for (const raw of incoming) {
    if (!raw || typeof raw !== "object") continue;
    const p = raw as Record<string, unknown>;
    if (!isUuid(p.id) || typeof p.name !== "string") continue;

    const incomingUpdated = parseDate(p.updatedAt) ?? new Date();
    const incomingCreated = parseDate(p.createdAt) ?? incomingUpdated;
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
  // Words cascade via the FK definition.
  await db.delete(wordpilePilesTable).where(eq(wordpilePilesTable.id, pileId));
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
  await db
    .delete(wordpileWordsTable)
    .where(
      and(
        eq(wordpileWordsTable.id, wordId),
        eq(wordpileWordsTable.pileId, pileId),
      ),
    );

  await db
    .update(wordpilePilesTable)
    .set({ updatedAt: new Date() })
    .where(eq(wordpilePilesTable.id, pileId));

  res.json({ ok: true });
});

export default router;

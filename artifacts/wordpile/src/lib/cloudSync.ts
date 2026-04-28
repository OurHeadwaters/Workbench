/**
 * cloudSync — bridge between WordpileStore mutations and the
 * /api/wordpile/* REST endpoints.
 *
 * Design constraints:
 *   - The store stays synchronous. Every mutation writes locally first, then
 *     this module enqueues the change for the server in the background.
 *   - When no Clerk user is signed in, every push is a no-op (anonymous mode
 *     keeps using localStorage exactly like before).
 *   - Pushes are queued FIFO. A single in-flight request at a time keeps
 *     server-visible ordering matching the order the user produced the
 *     mutations in (e.g. createPile must reach the server before any
 *     addWord targeting that pile).
 *   - Failures don't break local UX. We surface them through the
 *     subscribable sync-status snapshot so the UI can tell the user when
 *     their change hasn't reached the cloud yet, and we retry on the next
 *     mutation or when the browser fires an `online` event.
 */
import type { CommunityPile, WordEntry, WordpileData } from "@/data/types";

// We assume same-origin: the wordpile bundle and the api-server are reachable
// through the same Replit-managed proxy host, so cookies attach automatically.
// The orval-generated client uses the same `/api` prefix.
const API_PREFIX = "/api/wordpile";

let currentUserId: string | null = null;

export function setCloudUser(userId: string | null) {
  // Whenever the cloud identity changes — sign-in, sign-out, OR a direct
  // account switch (A -> B with no intermediate sign-out) — drop anything
  // still queued or failed for the previous identity. This is a tenant
  // isolation boundary: pending writes from user A's session must never
  // be flushed against user B's account, even though both share the same
  // browser-side queue. Failing to do this would leak A's data into B's
  // server-side state on the next mutation or `online` event.
  //
  // Bumping `syncGeneration` is what makes this race-safe: any flushQueue
  // loop already mid-`await` on user A's request will see the generation
  // change after its `attempt()` resolves and bail without mutating the
  // queue (otherwise a stale `pendingQueue.shift()` could remove user
  // B's freshly enqueued head op instead of A's now-cleared one).
  if (userId !== currentUserId) {
    pendingQueue = [];
    lastErrorAt = null;
    lastSyncedAt = null;
    unsyncedFailures = 0;
    syncGeneration += 1;
    refreshSnapshot();
  }
  currentUserId = userId;
}
export function getCloudUserId(): string | null {
  return currentUserId;
}

// ---------------------------------------------------------------------------
// Wire format helpers — the server uses ISO-8601 timestamps; the local store
// uses millisecond epochs. Convert at the seam, not throughout the app.
// ---------------------------------------------------------------------------

function isoFromMs(ms: number): string {
  return new Date(ms).toISOString();
}
function msFromIso(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : Date.now();
}

interface WireWord {
  id: string;
  pileId: string;
  word: string;
  note: string;
  bucket: WordEntry["bucket"];
  saferAlternative: string;
  createdAt: string;
  updatedAt: string;
}
interface WirePile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  words: WireWord[];
}
interface WireSnapshot {
  piles: WirePile[];
}

function pileToWire(p: CommunityPile): WirePile {
  return {
    id: p.id,
    name: p.name,
    createdAt: isoFromMs(p.createdAt),
    updatedAt: isoFromMs(p.updatedAt),
    words: p.words.map((w) => wordToWire(w, p.id)),
  };
}
function wordToWire(w: WordEntry, pileId: string): WireWord {
  return {
    id: w.id,
    pileId,
    word: w.word,
    note: w.note,
    bucket: w.bucket,
    saferAlternative: w.saferAlternative,
    createdAt: isoFromMs(w.createdAt),
    updatedAt: isoFromMs(w.updatedAt),
  };
}

function wireToPile(p: WirePile): CommunityPile {
  return {
    id: p.id,
    name: p.name,
    createdAt: msFromIso(p.createdAt),
    updatedAt: msFromIso(p.updatedAt),
    words: p.words.map((w) => ({
      id: w.id,
      word: w.word,
      note: w.note ?? "",
      bucket: w.bucket ?? "unsorted",
      saferAlternative: w.saferAlternative ?? "",
      createdAt: msFromIso(w.createdAt),
      updatedAt: msFromIso(w.updatedAt),
    })),
  };
}

export function snapshotFromWire(snap: WireSnapshot): WordpileData {
  const piles: Record<string, CommunityPile> = {};
  const order: string[] = [];
  for (const w of snap.piles) {
    const p = wireToPile(w);
    piles[p.id] = p;
    order.push(p.id);
  }
  return {
    version: 1,
    piles,
    pileOrder: order,
    selectedPileId: order[0] ?? null,
  };
}

export function snapshotToWire(data: WordpileData): WireSnapshot {
  // Walk pileOrder so the upload preserves user-visible ordering — the
  // server doesn't honour it for now (it sorts by createdAt) but it's the
  // right shape if we ever expose ordering server-side.
  const piles = data.pileOrder
    .map((id) => data.piles[id])
    .filter((p): p is CommunityPile => Boolean(p))
    .map(pileToWire);
  return { piles };
}

// ---------------------------------------------------------------------------
// Sync status — observable snapshot for the top-bar pill.
// ---------------------------------------------------------------------------

export type SyncStatus = "idle" | "saving" | "error" | "offline";

export interface SyncSnapshot {
  status: SyncStatus;
  pendingCount: number;
  // Number of mutations that were dropped from the queue because the
  // server returned a non-retryable error (e.g. 409 conflict, 400 bad
  // request). These changes are NOT going to retry on their own — the user
  // needs to do something (refresh, sign out/in) to reconcile. We surface
  // this through the sticky `error` status so the pill never falsely
  // reports "Synced" after a permanent failure.
  unsyncedFailures: number;
  lastSyncedAt: number | null;
  lastErrorAt: number | null;
}

interface QueuedOp {
  method: "POST" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
}

let pendingQueue: QueuedOp[] = [];
let inFlight = false;
let lastSyncedAt: number | null = null;
let lastErrorAt: number | null = null;
let unsyncedFailures = 0;
// Bumped every time the cloud identity changes (sign-in/out/switch). Any
// flushQueue loop that's mid-`await attempt()` checks the generation when
// its request resolves and bails if it changed — that prevents a stale
// `pendingQueue.shift()` from removing a head op that now belongs to a
// different user.
let syncGeneration = 0;
let cachedSyncSnapshot: SyncSnapshot = computeSnapshot();

const statusListeners = new Set<() => void>();

function isOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

function computeSnapshot(): SyncSnapshot {
  let status: SyncStatus = "idle";
  if (inFlight) {
    status = "saving";
  } else if (pendingQueue.length > 0 && isOffline()) {
    status = "offline";
  } else if (pendingQueue.length > 0 && lastErrorAt !== null) {
    // Transient failure: queue still has work that we'll retry on the
    // next mutation or `online` event.
    status = "error";
  } else if (unsyncedFailures > 0) {
    // Sticky failure: the queue is empty but at least one mutation was
    // dropped without server confirmation. Stay in `error` until a
    // bootstrap reconciles the snapshot or the user signs out.
    status = "error";
  }
  return Object.freeze({
    status,
    pendingCount: pendingQueue.length,
    unsyncedFailures,
    lastSyncedAt,
    lastErrorAt,
  });
}

function refreshSnapshot() {
  cachedSyncSnapshot = computeSnapshot();
  for (const l of statusListeners) l();
}

export function getSyncSnapshot(): SyncSnapshot {
  return cachedSyncSnapshot;
}

export function subscribeSyncStatus(listener: () => void): () => void {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

// Browser online/offline events: when connectivity returns, immediately
// retry the queued ops. When it drops, just refresh the pill.
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    refreshSnapshot();
    void flushQueue();
  });
  window.addEventListener("offline", () => {
    refreshSnapshot();
  });
}

// ---------------------------------------------------------------------------
// Queue + flush.
// ---------------------------------------------------------------------------

type AttemptResult = "ok" | "retry" | "drop";

async function attempt(op: QueuedOp): Promise<AttemptResult> {
  if (typeof window === "undefined") return "retry";
  try {
    const res = await fetch(`${API_PREFIX}${op.path}`, {
      method: op.method,
      credentials: "include",
      headers:
        op.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: op.body !== undefined ? JSON.stringify(op.body) : undefined,
    });
    if (res.ok) return "ok";
    // 5xx and 408/429 are transient — retry. Any other 4xx is a permanent
    // client error (e.g. the row was already deleted, or a duplicate id was
    // POSTed because a previous attempt actually succeeded). Drop those so
    // the queue doesn't get stuck looping forever; we still log them.
    // eslint-disable-next-line no-console
    console.warn("[wordpile cloudSync]", op.method, op.path, res.status);
    if (res.status >= 500 || res.status === 408 || res.status === 429) {
      return "retry";
    }
    return "drop";
  } catch (err) {
    // Network error / DNS failure / fetch aborted — always retry.
    // eslint-disable-next-line no-console
    console.warn("[wordpile cloudSync]", op.method, op.path, err);
    return "retry";
  }
}

async function flushQueue({ force = false }: { force?: boolean } = {}): Promise<void> {
  if (inFlight) return;
  if (pendingQueue.length === 0) return;
  // The `force` flag exists so a user-initiated "Retry now" can attempt
  // the queue even when `navigator.onLine` is lying (captive portals,
  // VPN flaps, the browser just hasn't noticed connectivity returned).
  // Background callers — mutations and the `online` event — leave it
  // false so we keep the same "don't waste fetches when we know we're
  // offline" behaviour as before.
  if (!force && isOffline()) {
    refreshSnapshot();
    return;
  }
  // Snapshot the identity generation we're flushing under. If it changes
  // mid-await we abort without mutating the queue — the new generation's
  // own enqueue / setCloudUser kick will handle whatever's there now.
  const gen = syncGeneration;
  inFlight = true;
  refreshSnapshot();
  let bailedForGenChange = false;
  try {
    while (pendingQueue.length > 0 && (force || !isOffline())) {
      const op = pendingQueue[0];
      const result = await attempt(op);
      if (syncGeneration !== gen) {
        // Identity changed (sign-in / sign-out / account switch) while
        // this request was in flight. Whatever the server did with op,
        // it was for the *previous* user. Don't shift, don't mutate
        // counters, don't touch pendingQueue at all — just bail and let
        // the finally block re-kick the loop under the new generation.
        bailedForGenChange = true;
        return;
      }
      if (result === "ok") {
        pendingQueue.shift();
        lastSyncedAt = Date.now();
        lastErrorAt = null;
      } else if (result === "drop") {
        // Permanent failure (4xx). Remove from the queue so it doesn't
        // loop, but bump the sticky failure counter so the pill stays in
        // an error state — the user's local change never made it to the
        // server, and we need to be honest about that.
        pendingQueue.shift();
        unsyncedFailures += 1;
        lastErrorAt = Date.now();
      } else {
        // Transient failure (network / 5xx). Hold the head op and stop.
        // We deliberately do NOT self-kick here — that would tight-loop
        // a flapping server with no backoff. The next mutation or
        // `online` event will retry, which matches the task contract.
        lastErrorAt = Date.now();
        break;
      }
    }
  } finally {
    inFlight = false;
    refreshSnapshot();
    // Only re-kick when we actually need to: an identity change cleared
    // the queue mid-flight and the new generation may have queued work
    // that's now sitting idle (no other code path will pick it up,
    // because the in-flight guard blocked it from running earlier).
    if (bailedForGenChange && pendingQueue.length > 0 && !isOffline()) {
      void flushQueue();
    }
  }
}

function enqueue(op: QueuedOp) {
  if (!currentUserId) return;
  pendingQueue.push(op);
  refreshSnapshot();
  void flushQueue();
}

// User-initiated "Retry now" — hooked up to the sync-status pill when it's
// in the `error` or `offline` state. Three guards before we actually kick
// the queue:
//
//   1. No-op when nothing's queued. The caller (the pill) gates clicks on
//      pending count too, but we double-check here so any future call site
//      gets the same contract.
//   2. No-op when a flush is already in flight. The pill is in `saving`
//      then anyway, so the user can't get here through the UI, but again
//      we keep the guard so the function is safe to call from anywhere.
//   3. We force `flushQueue` past its `navigator.onLine === false`
//      short-circuit. The whole point of this affordance is to override
//      the browser's connectivity guess — if the user knows the network
//      is fine, we should at least try.
export async function retryNow(): Promise<void> {
  if (inFlight) return;
  if (pendingQueue.length === 0) return;
  await flushQueue({ force: true });
}

// ---------------------------------------------------------------------------
// Low-level fetch wrapper for the awaited (non-queued) endpoints — /me and
// /sync. These are explicit setup calls, not optimistic mutations, so they
// stay outside the queue and bubble their result back to the caller.
// ---------------------------------------------------------------------------
async function api<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(`${API_PREFIX}${path}`, {
      method,
      credentials: "include",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn("[wordpile cloudSync]", method, path, res.status);
      return null;
    }
    if (res.status === 204) return null;
    return (await res.json()) as T;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[wordpile cloudSync]", method, path, err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchMe(): Promise<{
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
} | null> {
  return api("GET", "/me");
}

// One-shot bootstrap: send the current local snapshot, receive the merged
// state. Caller is responsible for replacing the in-memory snapshot with
// the result before resuming normal mutations.
//
// Used in two places:
//   1. App.tsx CloudSyncBridge — fires once when the Clerk user resolves.
//   2. The "Try reconcile again" affordance on the sync pill — when a
//      previous mutation was permanently rejected (sticky failure subkind),
//      this is the recovery path the user can trigger themselves without
//      reloading.
//
// On failure we deliberately bump `lastErrorAt` and refresh the snapshot
// so the pill stays in (and re-announces) the error state — without this,
// a failed bootstrap would silently leave the previous timestamp in place,
// hiding the fact that the user just tried to recover and it didn't work.
// Note we don't bump `unsyncedFailures` here: that counter tracks dropped
// queued mutations, not bootstrap attempts, so the sticky-error subkind
// stays exactly the same shape across retries.
export async function bootstrapSync(
  local: WordpileData,
): Promise<WordpileData | null> {
  const result = await api<WireSnapshot>("POST", "/sync", snapshotToWire(local));
  if (!result) {
    lastErrorAt = Date.now();
    refreshSnapshot();
    return null;
  }
  // Treat a successful bootstrap as a "synced" event so the pill reads
  // "Synced" the moment the user signs in, even before they make any
  // mutations. Bootstrap reconciles local + server, which is also our
  // recovery path for sticky failures, so clear the failure counter.
  lastSyncedAt = Date.now();
  lastErrorAt = null;
  unsyncedFailures = 0;
  refreshSnapshot();
  return snapshotFromWire(result);
}

export function pushCreatePile(pile: CommunityPile) {
  enqueue({
    method: "POST",
    path: "/piles",
    body: {
      id: pile.id,
      name: pile.name,
      createdAt: isoFromMs(pile.createdAt),
      updatedAt: isoFromMs(pile.updatedAt),
    },
  });
}

export function pushRenamePile(pileId: string, name: string) {
  enqueue({
    method: "PATCH",
    path: `/piles/${encodeURIComponent(pileId)}`,
    body: { name },
  });
}

export function pushDeletePile(pileId: string) {
  enqueue({
    method: "DELETE",
    path: `/piles/${encodeURIComponent(pileId)}`,
  });
}

export function pushAddWord(pileId: string, word: WordEntry) {
  enqueue({
    method: "POST",
    path: `/piles/${encodeURIComponent(pileId)}/words`,
    body: {
      id: word.id,
      word: word.word,
      note: word.note,
      bucket: word.bucket,
      saferAlternative: word.saferAlternative,
      createdAt: isoFromMs(word.createdAt),
      updatedAt: isoFromMs(word.updatedAt),
    },
  });
}

export function pushUpdateWord(
  pileId: string,
  wordId: string,
  patch: Partial<Pick<WordEntry, "word" | "note" | "bucket" | "saferAlternative">>,
) {
  enqueue({
    method: "PATCH",
    path: `/piles/${encodeURIComponent(pileId)}/words/${encodeURIComponent(wordId)}`,
    body: patch,
  });
}

export function pushDeleteWord(pileId: string, wordId: string) {
  enqueue({
    method: "DELETE",
    path: `/piles/${encodeURIComponent(pileId)}/words/${encodeURIComponent(wordId)}`,
  });
}

/**
 * cloudSync — fire-and-forget bridge between WordpileStore mutations and the
 * /api/wordpile/* REST endpoints.
 *
 * Design constraints:
 *   - The store stays synchronous. Every mutation writes locally first, then
 *     this module pushes the change to the server in the background.
 *   - When no Clerk user is signed in, every push is a no-op (anonymous mode
 *     keeps using localStorage exactly like before).
 *   - Failures are logged but never thrown — a network blip should not break
 *     the local UX. Re-bootstrapping on next sign-in (or page reload) will
 *     reconcile any missed writes via /sync.
 */
import type { CommunityPile, WordEntry, WordpileData } from "@/data/types";

// We assume same-origin: the wordpile bundle and the api-server are reachable
// through the same Replit-managed proxy host, so cookies attach automatically.
// The orval-generated client uses the same `/api` prefix.
const API_PREFIX = "/api/wordpile";

let currentUserId: string | null = null;

export function setCloudUser(userId: string | null) {
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
// Low-level fetch wrapper. Always JSON, always credentials-included. We
// inline this rather than depending on @workspace/api-client-react because:
//   1) react-query semantics aren't useful for fire-and-forget pushes,
//   2) the pushes need to run from outside React (the WordpileStore is a
//      plain module), and adding a hook layer just to invoke them would
//      force every mutation through React's render cycle.
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
      // Don't throw — let the caller decide. We do log so problems aren't
      // invisible during development.
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
export async function bootstrapSync(
  local: WordpileData,
): Promise<WordpileData | null> {
  const result = await api<WireSnapshot>("POST", "/sync", snapshotToWire(local));
  if (!result) return null;
  return snapshotFromWire(result);
}

export function pushCreatePile(pile: CommunityPile) {
  if (!currentUserId) return;
  void api("POST", "/piles", {
    id: pile.id,
    name: pile.name,
    createdAt: isoFromMs(pile.createdAt),
    updatedAt: isoFromMs(pile.updatedAt),
  });
}

export function pushRenamePile(pileId: string, name: string) {
  if (!currentUserId) return;
  void api("PATCH", `/piles/${encodeURIComponent(pileId)}`, { name });
}

export function pushDeletePile(pileId: string) {
  if (!currentUserId) return;
  void api("DELETE", `/piles/${encodeURIComponent(pileId)}`);
}

export function pushAddWord(pileId: string, word: WordEntry) {
  if (!currentUserId) return;
  void api("POST", `/piles/${encodeURIComponent(pileId)}/words`, {
    id: word.id,
    word: word.word,
    note: word.note,
    bucket: word.bucket,
    saferAlternative: word.saferAlternative,
    createdAt: isoFromMs(word.createdAt),
    updatedAt: isoFromMs(word.updatedAt),
  });
}

export function pushUpdateWord(
  pileId: string,
  wordId: string,
  patch: Partial<Pick<WordEntry, "word" | "note" | "bucket" | "saferAlternative">>,
) {
  if (!currentUserId) return;
  void api(
    "PATCH",
    `/piles/${encodeURIComponent(pileId)}/words/${encodeURIComponent(wordId)}`,
    patch,
  );
}

export function pushDeleteWord(pileId: string, wordId: string) {
  if (!currentUserId) return;
  void api(
    "DELETE",
    `/piles/${encodeURIComponent(pileId)}/words/${encodeURIComponent(wordId)}`,
  );
}

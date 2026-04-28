/**
 * WordpileStore — single source of truth for all wordpile data.
 *
 * Storage:
 *   - Anonymous: localStorage at `wordpile:v1`. Source of truth.
 *   - Signed-in: localStorage acts as an offline cache; the server
 *     (/api/wordpile/*) is the source of truth. The app calls
 *     `WordpileStore.replaceAll(...)` once after sign-in with the
 *     server-merged snapshot, then every subsequent mutation does an
 *     optimistic local write followed by a fire-and-forget API push.
 *
 * Mutations stay synchronous so the UI doesn't need to change. The cloud
 * push happens asynchronously in `cloudSync.ts` and never throws.
 */
import {
  BUCKETS,
  EMPTY_DATA,
  type AnyPileImport,
  type Bucket,
  type CommunityPile,
  type PileBundleExport,
  type PileExport,
  type PileExportPayload,
  type PileExportWord,
  type WordEntry,
  type WordpileData,
} from "@/data/types";
import * as cloud from "./cloudSync";

const STORAGE_KEY = "wordpile:v1";
const STORAGE_EVENT = "wordpile:changed";
const DRAFT_KEY_PREFIX = "wordpile:draft:";

type Listener = () => void;

const listeners = new Set<Listener>();

// Cached snapshot — useSyncExternalStore requires getSnapshot() to return
// a stable reference between mutations. We hold onto the last parsed object
// and only reload from localStorage when an external `storage` event fires
// (cross-tab) or when our own mutator runs (which calls `setSnapshot`).
let cachedSnapshot: WordpileData | null = null;

function emit() {
  for (const l of listeners) l();
}

function loadFromStorage(): WordpileData {
  if (typeof window === "undefined") return EMPTY_DATA;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_DATA;
  try {
    const parsed = JSON.parse(raw) as Partial<WordpileData>;
    if (parsed.version !== 1 || !parsed.piles) return EMPTY_DATA;
    return {
      version: 1,
      piles: parsed.piles,
      pileOrder: parsed.pileOrder ?? Object.keys(parsed.piles),
      selectedPileId: parsed.selectedPileId ?? null,
    };
  } catch {
    return EMPTY_DATA;
  }
}

function read(): WordpileData {
  if (cachedSnapshot === null) cachedSnapshot = loadFromStorage();
  return cachedSnapshot;
}

function write(next: WordpileData) {
  cachedSnapshot = next;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  emit();
}

function invalidateAndReload() {
  cachedSnapshot = loadFromStorage();
  emit();
}

function update(mutator: (data: WordpileData) => WordpileData) {
  const current = read();
  const next = mutator(current);
  if (next === current) return current;
  write(next);
  return next;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for ancient browsers — UUID-shaped but not cryptographically
  // strong. The server only checks shape (UUID v4 regex), so this still
  // round-trips. We never expect to hit this path in practice.
  const r = () => Math.floor(Math.random() * 16).toString(16);
  return (
    Array.from({ length: 8 }, r).join("") +
    "-" +
    Array.from({ length: 4 }, r).join("") +
    "-4" +
    Array.from({ length: 3 }, r).join("") +
    "-" +
    ((Math.floor(Math.random() * 4) + 8).toString(16) +
      Array.from({ length: 3 }, r).join("")) +
    "-" +
    Array.from({ length: 12 }, r).join("")
  );
}

export const WordpileStore = {
  // -- Snapshot / subscribe (used by useSyncExternalStore) -------------
  getSnapshot(): WordpileData {
    return read();
  },
  subscribe(l: Listener): () => void {
    listeners.add(l);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) invalidateAndReload();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(STORAGE_EVENT, l);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(STORAGE_EVENT, l);
    };
  },

  // -- Cloud-sync hooks ------------------------------------------------
  // Called by App.tsx once the Clerk user is known. Pass null when signed
  // out — that disables the cloud push side effects without touching
  // anything else.
  setCloudUser(userId: string | null) {
    cloud.setCloudUser(userId);
  },

  // Replace the entire in-memory + cached snapshot. Used after the
  // sign-in /sync bootstrap. Preserves the user's currently-selected pile
  // when possible so they don't lose context across sign-in.
  replaceAll(data: WordpileData) {
    const prevSelected = read().selectedPileId;
    const selectedPileId =
      prevSelected && data.piles[prevSelected]
        ? prevSelected
        : data.selectedPileId;
    write({ ...data, selectedPileId });
  },

  // Re-run the /sync bootstrap with the current local snapshot and swap
  // the in-memory state for the merged result. This is the same recipe
  // App.tsx runs at sign-in, hoisted here so the sync-status pill can
  // expose it as a one-click "Try reconcile again" recovery for the
  // sticky-failure subkind (queue is empty, but at least one mutation
  // was permanently rejected and `unsyncedFailures > 0`). The pill keeps
  // its own UI in-flight state; this method just reports whether the
  // reconciliation reached the server. On failure cloudSync already
  // refreshes its snapshot so the pill stays in error and tells the
  // user to try again.
  async reconcileWithCloud(): Promise<boolean> {
    const merged = await cloud.bootstrapSync(read());
    if (!merged) return false;
    WordpileStore.replaceAll(merged);
    return true;
  },

  // Wipe all local state (used on sign-out so the next anonymous user on
  // this browser doesn't see the previous user's piles in the cache).
  clearLocal() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    cachedSnapshot = EMPTY_DATA;
    emit();
  },

  // -- Pile-level ------------------------------------------------------
  createPile(name: string): CommunityPile {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Community name is required");
    const now = Date.now();
    const pile: CommunityPile = {
      id: newId(),
      name: trimmed,
      createdAt: now,
      updatedAt: now,
      words: [],
    };
    update((data) => ({
      ...data,
      piles: { ...data.piles, [pile.id]: pile },
      pileOrder: [...data.pileOrder, pile.id],
      selectedPileId: pile.id,
    }));
    cloud.pushCreatePile(pile);
    return pile;
  },

  renamePile(pileId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    let didChange = false;
    update((data) => {
      const p = data.piles[pileId];
      if (!p) return data;
      didChange = true;
      return {
        ...data,
        piles: {
          ...data.piles,
          [pileId]: { ...p, name: trimmed, updatedAt: Date.now() },
        },
      };
    });
    if (didChange) cloud.pushRenamePile(pileId, trimmed);
  },

  deletePile(pileId: string) {
    let didDelete = false;
    update((data) => {
      if (!data.piles[pileId]) return data;
      didDelete = true;
      const nextPiles = { ...data.piles };
      delete nextPiles[pileId];
      const nextOrder = data.pileOrder.filter((id) => id !== pileId);
      return {
        ...data,
        piles: nextPiles,
        pileOrder: nextOrder,
        selectedPileId:
          data.selectedPileId === pileId
            ? nextOrder[0] ?? null
            : data.selectedPileId,
      };
    });
    if (didDelete) cloud.pushDeletePile(pileId);
  },

  selectPile(pileId: string | null) {
    // Selection is purely a client-side preference — never synced.
    update((data) => ({ ...data, selectedPileId: pileId }));
  },

  // -- Word-level ------------------------------------------------------
  addWord(
    pileId: string,
    input: { word: string; bucket?: Bucket; note?: string },
  ): WordEntry | null {
    const wordRaw = input.word.trim();
    if (!wordRaw) return null;
    const word = wordRaw.toLowerCase();
    let created: WordEntry | null = null;
    update((data) => {
      const pile = data.piles[pileId];
      if (!pile) return data;
      // Skip duplicates within this pile (case-insensitive on word).
      if (pile.words.some((w) => w.word === word)) return data;
      const now = Date.now();
      const entry: WordEntry = {
        id: newId(),
        word,
        note: (input.note ?? "").trim(),
        bucket: input.bucket ?? "unsorted",
        saferAlternative: "",
        createdAt: now,
        updatedAt: now,
      };
      created = entry;
      return {
        ...data,
        piles: {
          ...data.piles,
          [pileId]: {
            ...pile,
            words: [...pile.words, entry],
            updatedAt: now,
          },
        },
      };
    });
    if (created) cloud.pushAddWord(pileId, created);
    return created;
  },

  updateWord(
    pileId: string,
    wordId: string,
    patch: Partial<Pick<WordEntry, "word" | "note" | "bucket" | "saferAlternative">>,
  ) {
    let didUpdate = false;
    let normalisedWord: string | undefined;
    update((data) => {
      const pile = data.piles[pileId];
      if (!pile) return data;
      const next = pile.words.map((w) => {
        if (w.id !== wordId) return w;
        didUpdate = true;
        if (patch.word !== undefined) {
          normalisedWord = patch.word.trim().toLowerCase();
        }
        return {
          ...w,
          ...patch,
          word: normalisedWord ?? w.word,
          updatedAt: Date.now(),
        };
      });
      if (!didUpdate) return data;
      return {
        ...data,
        piles: {
          ...data.piles,
          [pileId]: { ...pile, words: next, updatedAt: Date.now() },
        },
      };
    });
    if (didUpdate) {
      cloud.pushUpdateWord(pileId, wordId, {
        ...patch,
        ...(normalisedWord !== undefined ? { word: normalisedWord } : {}),
      });
    }
  },

  deleteWord(pileId: string, wordId: string) {
    let didDelete = false;
    update((data) => {
      const pile = data.piles[pileId];
      if (!pile) return data;
      const next = pile.words.filter((w) => w.id !== wordId);
      if (next.length === pile.words.length) return data;
      didDelete = true;
      return {
        ...data,
        piles: {
          ...data.piles,
          [pileId]: {
            ...pile,
            words: next,
            updatedAt: Date.now(),
          },
        },
      };
    });
    if (didDelete) cloud.pushDeleteWord(pileId, wordId);
  },

  moveWord(pileId: string, wordId: string, bucket: Bucket) {
    this.updateWord(pileId, wordId, { bucket });
  },

  // -- Import / export -------------------------------------------------
  serializePile(pileId: string): PileExport | null {
    const pile = read().piles[pileId];
    if (!pile) return null;
    return {
      format: "wordpile-export",
      formatVersion: 1,
      exportedAt: Date.now(),
      pile: pileToPayload(pile),
    };
  },

  /**
   * Serialize every pile (in pileOrder) into a single bundle payload.
   * Each pile carries its own optional draft, so a fresh-device import
   * round-trips identically to a per-pile export of every pile.
   */
  serializeAllPiles(): PileBundleExport {
    const data = read();
    const piles = data.pileOrder
      .map((id) => data.piles[id])
      .filter((p): p is CommunityPile => Boolean(p))
      .map(pileToPayload);
    return {
      format: "wordpile-bundle",
      formatVersion: 1,
      exportedAt: Date.now(),
      piles,
    };
  },

  /**
   * Import a parsed payload. If `mergeIntoPileId` is provided, the words
   * are folded into that pile (case-insensitive de-dupe — existing words
   * win by default). Otherwise a brand-new pile is created using
   * `nameOverride` if given, else the exported name.
   *
   * `useTheirsWords` opts specific overlapping words into "use the
   * incoming version": their `bucket` and `saferAlternative` on the
   * existing entry are replaced with the values from the imported pile.
   * Words not in the set keep their existing classification (the
   * original existing-wins behaviour). New words (not already present)
   * are always added regardless. Word strings are matched
   * case-insensitively.
   *
   * Returns the resulting pile, or null if the target merge pile doesn't
   * exist.
   */
  importPile(
    payload: PileExport,
    options: {
      mergeIntoPileId?: string;
      nameOverride?: string;
      useTheirsWords?: readonly string[];
    } = {},
  ): CommunityPile | null {
    const exportedWords = payload.pile.words.map(normalizeImportWord);
    const now = Date.now();

    if (options.mergeIntoPileId) {
      const targetId = options.mergeIntoPileId;
      const useTheirs = new Set(
        (options.useTheirsWords ?? []).map((w) => w.trim().toLowerCase()),
      );
      let result: CommunityPile | null = null;
      update((data) => {
        const target = data.piles[targetId];
        if (!target) return data;
        // Index incoming words by their normalised key so we can pull
        // the chosen replacement values without scanning the array.
        const incomingByWord = new Map<string, PileExportWord>();
        for (const ew of exportedWords) {
          if (!incomingByWord.has(ew.word)) incomingByWord.set(ew.word, ew);
        }
        const existing = new Set(target.words.map((w) => w.word));
        const updatedWords = target.words.map((w) => {
          if (!useTheirs.has(w.word)) return w;
          const incoming = incomingByWord.get(w.word);
          if (!incoming) return w;
          const bucketChanged = incoming.bucket !== w.bucket;
          const saferChanged =
            (incoming.saferAlternative ?? "") !== (w.saferAlternative ?? "");
          if (!bucketChanged && !saferChanged) return w;
          return {
            ...w,
            bucket: incoming.bucket,
            saferAlternative: incoming.saferAlternative,
            updatedAt: now,
          };
        });
        const additions: WordEntry[] = [];
        for (const ew of exportedWords) {
          if (existing.has(ew.word)) continue;
          existing.add(ew.word);
          additions.push({
            id: newId(),
            word: ew.word,
            bucket: ew.bucket,
            note: ew.note,
            saferAlternative: ew.saferAlternative,
            createdAt: now,
            updatedAt: now,
          });
        }
        const merged: CommunityPile = {
          ...target,
          words: [...updatedWords, ...additions],
          updatedAt: now,
        };
        result = merged;
        return {
          ...data,
          piles: { ...data.piles, [targetId]: merged },
        };
      });
      return result;
    }

    // Create a fresh pile.
    const name = (options.nameOverride ?? payload.pile.name).trim();
    if (!name) return null;
    const seen = new Set<string>();
    const words: WordEntry[] = [];
    for (const ew of exportedWords) {
      if (seen.has(ew.word)) continue;
      seen.add(ew.word);
      words.push({
        id: newId(),
        word: ew.word,
        bucket: ew.bucket,
        note: ew.note,
        saferAlternative: ew.saferAlternative,
        createdAt: now,
        updatedAt: now,
      });
    }
    const pile: CommunityPile = {
      id: newId(),
      name,
      createdAt: now,
      updatedAt: now,
      words,
    };
    update((data) => ({
      ...data,
      piles: { ...data.piles, [pile.id]: pile },
      pileOrder: [...data.pileOrder, pile.id],
      selectedPileId: pile.id,
    }));
    if (
      typeof window !== "undefined" &&
      typeof payload.pile.draft === "string" &&
      payload.pile.draft.trim()
    ) {
      window.localStorage.setItem(DRAFT_KEY_PREFIX + pile.id, payload.pile.draft);
    }
    return pile;
  },

  /**
   * Import every (or a chosen subset of) pile inside a bundle. Each
   * entry can either become a brand-new pile or be merged into an
   * existing one — letting a backup act as a true restore-in-place
   * instead of always producing duplicates.
   *
   * `selectedIndexes` filters which entries (by their position in the
   * bundle) get imported. Omit it to restore everything.
   *
   * `decisions` overrides the per-entry behaviour. Each entry defaults
   * to creating a new pile; pass `{ mode: "merge", pileId }` to fold the
   * entry into an existing pile (case-insensitive de-dupe — existing
   * words win). A merge that targets a missing pile is silently skipped
   * (matching `importPile`'s behaviour).
   *
   * Returns the list of resulting piles (created or merged), in bundle
   * order.
   */
  importBundle(
    payload: PileBundleExport,
    options: {
      selectedIndexes?: number[];
      decisions?: Record<number, BundleEntryDecision>;
    } = {},
  ): CommunityPile[] {
    const wanted =
      options.selectedIndexes !== undefined
        ? new Set(options.selectedIndexes)
        : null;
    const decisions = options.decisions ?? {};
    const results: CommunityPile[] = [];
    payload.piles.forEach((entry, index) => {
      if (wanted && !wanted.has(index)) return;
      const single: PileExport = {
        format: "wordpile-export",
        formatVersion: 1,
        exportedAt: payload.exportedAt,
        pile: entry,
      };
      const decision = decisions[index] ?? { mode: "new" };
      const pile =
        decision.mode === "merge"
          ? WordpileStore.importPile(single, {
              mergeIntoPileId: decision.pileId,
              useTheirsWords: decision.useTheirsWords,
            })
          : WordpileStore.importPile(
              single,
              decision.nameOverride ? { nameOverride: decision.nameOverride } : {},
            );
      if (pile) results.push(pile);
    });
    return results;
  },
};

export type BundleEntryDecision =
  | { mode: "new"; nameOverride?: string }
  | { mode: "merge"; pileId: string; useTheirsWords?: readonly string[] };

/**
 * One row of the merge-conflict diff: an incoming word that already
 * exists in the target pile, with side-by-side bucket / safer-alt so
 * the UI can show what would change if existing-wins didn't apply.
 */
export interface MergeConflictEntry {
  word: string;
  existingBucket: Bucket;
  incomingBucket: Bucket;
  existingSaferAlternative: string;
  incomingSaferAlternative: string;
  bucketDiffers: boolean;
  saferAlternativeDiffers: boolean;
}

/**
 * Summary of what would happen if `incoming` were merged into `target`
 * with the current "existing wins" semantics. Used by the import UI to
 * warn the practitioner before the click — so they can see the overlap
 * count, the reclassification count, and the per-word diff before
 * committing.
 */
export interface MergeConflictSummary {
  totalIncoming: number;
  newCount: number;
  overlapCount: number;
  reclassifiedCount: number;
  conflicts: MergeConflictEntry[];
}

export function computeMergeConflicts(
  incoming: PileExportPayload,
  target: CommunityPile,
): MergeConflictSummary {
  const existing = new Map<string, WordEntry>();
  for (const w of target.words) existing.set(w.word, w);
  const seenIncoming = new Set<string>();
  const conflicts: MergeConflictEntry[] = [];
  let newCount = 0;
  let overlapCount = 0;
  let reclassifiedCount = 0;
  for (const raw of incoming.words) {
    // Defensive: bundle/share payloads come pre-normalised, but a
    // hand-edited file could slip through with mixed casing.
    const norm = normalizeImportWord(raw);
    if (!norm.word || seenIncoming.has(norm.word)) continue;
    seenIncoming.add(norm.word);
    const ex = existing.get(norm.word);
    if (!ex) {
      newCount += 1;
      continue;
    }
    overlapCount += 1;
    const existingSafer = ex.saferAlternative ?? "";
    const incomingSafer = norm.saferAlternative ?? "";
    const bucketDiffers = ex.bucket !== norm.bucket;
    const saferAlternativeDiffers = existingSafer !== incomingSafer;
    if (bucketDiffers || saferAlternativeDiffers) reclassifiedCount += 1;
    conflicts.push({
      word: norm.word,
      existingBucket: ex.bucket,
      incomingBucket: norm.bucket,
      existingSaferAlternative: existingSafer,
      incomingSaferAlternative: incomingSafer,
      bucketDiffers,
      saferAlternativeDiffers,
    });
  }
  return {
    totalIncoming: seenIncoming.size,
    newCount,
    overlapCount,
    reclassifiedCount,
    conflicts,
  };
}

function pileToPayload(pile: CommunityPile): PileExportPayload {
  const draft =
    typeof window !== "undefined"
      ? window.localStorage.getItem(DRAFT_KEY_PREFIX + pile.id) ?? ""
      : "";
  const payload: PileExportPayload = {
    name: pile.name,
    words: pile.words.map((w) => ({
      word: w.word,
      bucket: w.bucket,
      note: w.note,
      saferAlternative: w.saferAlternative,
    })),
  };
  if (draft.trim()) payload.draft = draft;
  return payload;
}

function normalizeImportWord(raw: unknown): PileExportWord {
  const r = (raw ?? {}) as Record<string, unknown>;
  const word = String(r.word ?? "").trim().toLowerCase();
  const bucket = (BUCKETS as readonly string[]).includes(String(r.bucket))
    ? (r.bucket as Bucket)
    : "unsorted";
  const note = typeof r.note === "string" ? r.note : "";
  const saferAlternative =
    typeof r.saferAlternative === "string" ? r.saferAlternative : "";
  return { word, bucket, note, saferAlternative };
}

/**
 * Parse an unknown JSON string and validate that it matches the
 * wordpile export schema. Returns null on any structural problem.
 */
export function parsePileExport(raw: string): PileExport | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  if (obj.format !== "wordpile-export") return null;
  if (obj.formatVersion !== 1) return null;
  const pile = obj.pile as Record<string, unknown> | undefined;
  if (!pile || typeof pile !== "object") return null;
  if (typeof pile.name !== "string" || !pile.name.trim()) return null;
  if (!Array.isArray(pile.words)) return null;
  const words = pile.words.map(normalizeImportWord).filter((w) => w.word);
  return {
    format: "wordpile-export",
    formatVersion: 1,
    exportedAt: typeof obj.exportedAt === "number" ? obj.exportedAt : Date.now(),
    pile: {
      name: pile.name.trim(),
      words,
      draft: typeof pile.draft === "string" ? pile.draft : undefined,
    },
  };
}

/**
 * Parse an unknown JSON string and validate that it matches the bundle
 * (multi-pile backup) schema. Returns null on any structural problem.
 */
export function parsePileBundle(raw: string): PileBundleExport | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  return coerceBundle(parsed);
}

function coerceBundle(parsed: unknown): PileBundleExport | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  if (obj.format !== "wordpile-bundle") return null;
  if (obj.formatVersion !== 1) return null;
  if (!Array.isArray(obj.piles)) return null;
  const piles: PileExportPayload[] = [];
  for (const raw of obj.piles) {
    if (!raw || typeof raw !== "object") continue;
    const p = raw as Record<string, unknown>;
    if (typeof p.name !== "string" || !p.name.trim()) continue;
    if (!Array.isArray(p.words)) continue;
    const words = p.words.map(normalizeImportWord).filter((w) => w.word);
    const entry: PileExportPayload = { name: p.name.trim(), words };
    if (typeof p.draft === "string") entry.draft = p.draft;
    piles.push(entry);
  }
  return {
    format: "wordpile-bundle",
    formatVersion: 1,
    exportedAt: typeof obj.exportedAt === "number" ? obj.exportedAt : Date.now(),
    piles,
  };
}

/**
 * Try to parse a file's contents as either a single-pile export or a
 * multi-pile bundle. Returns a discriminated union so the import UI can
 * branch on the result.
 */
export function parseAnyImport(raw: string): AnyPileImport | null {
  const bundle = parsePileBundle(raw);
  if (bundle) return { kind: "bundle", payload: bundle };
  const single = parsePileExport(raw);
  if (single) return { kind: "pile", payload: single };
  return null;
}

export type WordpileStoreType = typeof WordpileStore;

/**
 * Pick the local pile most likely to be a duplicate of an incoming share
 * payload. The check is intentionally lenient — a case-insensitive name
 * match wins outright; otherwise we look for >80% Jaccard overlap on the
 * word lists. (Word strings are already stored lowercased in both the
 * pile and the export, so the set comparison is a straight equality.)
 *
 * Returns null if nothing crosses the threshold, so the import preview
 * can fall back to its usual "create a new pile" default.
 */
export function findSimilarLocalPile(
  payload: PileExport,
  piles: CommunityPile[],
): { pile: CommunityPile; reason: string } | null {
  if (piles.length === 0) return null;
  const incomingName = payload.pile.name.trim().toLowerCase();
  if (incomingName) {
    const nameMatch = piles.find(
      (p) => p.name.trim().toLowerCase() === incomingName,
    );
    if (nameMatch) {
      return {
        pile: nameMatch,
        reason: `You already have a pile called "${nameMatch.name}". Merging will fold these words in instead of creating a duplicate.`,
      };
    }
  }
  const incomingWords = new Set(payload.pile.words.map((w) => w.word));
  if (incomingWords.size === 0) return null;
  let best: { pile: CommunityPile; jaccard: number } | null = null;
  for (const p of piles) {
    if (p.words.length === 0) continue;
    const local = new Set(p.words.map((w) => w.word));
    let intersection = 0;
    for (const w of incomingWords) if (local.has(w)) intersection++;
    const union = local.size + incomingWords.size - intersection;
    if (union === 0) continue;
    const jaccard = intersection / union;
    if (!best || jaccard > best.jaccard) {
      best = { pile: p, jaccard };
    }
  }
  if (best && best.jaccard > 0.8) {
    const pct = Math.round(best.jaccard * 100);
    return {
      pile: best.pile,
      reason: `This pile shares ${pct}% of its words with "${best.pile.name}". Merging will skip the duplicates.`,
    };
  }
  return null;
}

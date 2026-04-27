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
  EMPTY_DATA,
  type Bucket,
  type CommunityPile,
  type WordEntry,
  type WordpileData,
} from "@/data/types";
import * as cloud from "./cloudSync";

const STORAGE_KEY = "wordpile:v1";
const STORAGE_EVENT = "wordpile:changed";

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
};

export type WordpileStoreType = typeof WordpileStore;

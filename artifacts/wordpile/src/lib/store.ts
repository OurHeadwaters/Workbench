/**
 * WordpileStore — single source of truth for all wordpile data.
 *
 * v1 ships against browser localStorage with a versioned key. This module
 * is the only place that talks to localStorage; swapping the storage
 * backend later (e.g. an authenticated REST client) means rewriting the
 * three private helpers (`read`, `write`, `subscribe`) and nothing else.
 */
import {
  EMPTY_DATA,
  type Bucket,
  type CommunityPile,
  type WordEntry,
  type WordpileData,
} from "@/data/types";

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
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
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
    return pile;
  },

  renamePile(pileId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    update((data) => {
      const p = data.piles[pileId];
      if (!p) return data;
      return {
        ...data,
        piles: {
          ...data.piles,
          [pileId]: { ...p, name: trimmed, updatedAt: Date.now() },
        },
      };
    });
  },

  deletePile(pileId: string) {
    update((data) => {
      if (!data.piles[pileId]) return data;
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
  },

  selectPile(pileId: string | null) {
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
    return created;
  },

  updateWord(
    pileId: string,
    wordId: string,
    patch: Partial<Pick<WordEntry, "word" | "note" | "bucket" | "saferAlternative">>,
  ) {
    update((data) => {
      const pile = data.piles[pileId];
      if (!pile) return data;
      const next = pile.words.map((w) =>
        w.id === wordId
          ? {
              ...w,
              ...patch,
              word: patch.word !== undefined ? patch.word.trim().toLowerCase() : w.word,
              updatedAt: Date.now(),
            }
          : w,
      );
      return {
        ...data,
        piles: {
          ...data.piles,
          [pileId]: { ...pile, words: next, updatedAt: Date.now() },
        },
      };
    });
  },

  deleteWord(pileId: string, wordId: string) {
    update((data) => {
      const pile = data.piles[pileId];
      if (!pile) return data;
      return {
        ...data,
        piles: {
          ...data.piles,
          [pileId]: {
            ...pile,
            words: pile.words.filter((w) => w.id !== wordId),
            updatedAt: Date.now(),
          },
        },
      };
    });
  },

  moveWord(pileId: string, wordId: string, bucket: Bucket) {
    this.updateWord(pileId, wordId, { bucket });
  },
};

export type WordpileStoreType = typeof WordpileStore;

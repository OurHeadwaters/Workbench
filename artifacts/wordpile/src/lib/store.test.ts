import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WordpileStoreType } from "./store";

// Each test imports a fresh copy of the store module so the module-level
// cachedSnapshot/listeners don't leak across tests. The store guards on
// `typeof window` so it runs cleanly in the node test environment.
async function freshStore(): Promise<WordpileStoreType> {
  vi.resetModules();
  const mod = await import("./store");
  return mod.WordpileStore;
}

describe("WordpileStore — snapshot stability", () => {
  let WordpileStore: WordpileStoreType;

  beforeEach(async () => {
    WordpileStore = await freshStore();
  });

  it("returns the same reference across consecutive calls (no mutation)", () => {
    const a = WordpileStore.getSnapshot();
    const b = WordpileStore.getSnapshot();
    expect(a).toBe(b);
  });

  it("returns a new reference after a mutation, then stable again", () => {
    const before = WordpileStore.getSnapshot();
    WordpileStore.createPile("Deer Lake");
    const after = WordpileStore.getSnapshot();
    expect(after).not.toBe(before);
    // Stable until the next mutation.
    expect(WordpileStore.getSnapshot()).toBe(after);
  });

  it("starts with the empty data shape", () => {
    const snap = WordpileStore.getSnapshot();
    expect(snap).toEqual({
      version: 1,
      piles: {},
      pileOrder: [],
      selectedPileId: null,
    });
  });
});

describe("WordpileStore — createPile", () => {
  let WordpileStore: WordpileStoreType;

  beforeEach(async () => {
    WordpileStore = await freshStore();
  });

  it("creates a pile, registers it in pileOrder, and selects it", () => {
    const pile = WordpileStore.createPile("Deer Lake");
    const snap = WordpileStore.getSnapshot();
    expect(snap.piles[pile.id]).toBeDefined();
    expect(snap.piles[pile.id].name).toBe("Deer Lake");
    expect(snap.piles[pile.id].words).toEqual([]);
    expect(snap.pileOrder).toEqual([pile.id]);
    expect(snap.selectedPileId).toBe(pile.id);
  });

  it("trims whitespace from the supplied name", () => {
    const pile = WordpileStore.createPile("   Bearskin Lake   ");
    expect(WordpileStore.getSnapshot().piles[pile.id].name).toBe(
      "Bearskin Lake",
    );
  });

  it("throws when given an empty or whitespace-only name", () => {
    expect(() => WordpileStore.createPile("")).toThrow();
    expect(() => WordpileStore.createPile("   ")).toThrow();
  });

  it("appends additional piles to pileOrder", () => {
    const a = WordpileStore.createPile("Pile A");
    const b = WordpileStore.createPile("Pile B");
    expect(WordpileStore.getSnapshot().pileOrder).toEqual([a.id, b.id]);
  });
});

describe("WordpileStore — addWord", () => {
  let WordpileStore: WordpileStoreType;
  let pileId: string;

  beforeEach(async () => {
    WordpileStore = await freshStore();
    pileId = WordpileStore.createPile("Deer Lake").id;
  });

  it("appends a word with defaults and returns the entry", () => {
    const entry = WordpileStore.addWord(pileId, { word: "Bannock" });
    expect(entry).not.toBeNull();
    expect(entry!.word).toBe("bannock");
    expect(entry!.bucket).toBe("unsorted");
    expect(entry!.note).toBe("");
    expect(entry!.saferAlternative).toBe("");
    const words = WordpileStore.getSnapshot().piles[pileId].words;
    expect(words).toHaveLength(1);
    expect(words[0].id).toBe(entry!.id);
  });

  it("respects an explicit bucket and trimmed note", () => {
    const entry = WordpileStore.addWord(pileId, {
      word: "moose",
      bucket: "load",
      note: "  primary protein  ",
    });
    expect(entry!.bucket).toBe("load");
    expect(entry!.note).toBe("primary protein");
  });

  it("returns null and is a no-op when the word is blank", () => {
    const before = WordpileStore.getSnapshot();
    expect(WordpileStore.addWord(pileId, { word: "   " })).toBeNull();
    expect(WordpileStore.getSnapshot()).toBe(before);
  });

  it("skips duplicates within a pile (case-insensitive)", () => {
    WordpileStore.addWord(pileId, { word: "Bannock" });
    const beforeDup = WordpileStore.getSnapshot();
    const dup = WordpileStore.addWord(pileId, { word: "bannock" });
    expect(dup).toBeNull();
    expect(WordpileStore.getSnapshot()).toBe(beforeDup);
    expect(WordpileStore.getSnapshot().piles[pileId].words).toHaveLength(1);
  });

  it("returns null when the pile does not exist", () => {
    expect(WordpileStore.addWord("missing-id", { word: "fish" })).toBeNull();
  });
});

describe("WordpileStore — moveWord", () => {
  let WordpileStore: WordpileStoreType;
  let pileId: string;
  let wordId: string;

  beforeEach(async () => {
    WordpileStore = await freshStore();
    pileId = WordpileStore.createPile("Deer Lake").id;
    wordId = WordpileStore.addWord(pileId, { word: "bannock" })!.id;
  });

  it("changes the bucket of the targeted word", () => {
    WordpileStore.moveWord(pileId, wordId, "load");
    const word = WordpileStore.getSnapshot().piles[pileId].words.find(
      (w) => w.id === wordId,
    );
    expect(word?.bucket).toBe("load");
  });

  it("does not affect other words in the pile", () => {
    const otherId = WordpileStore.addWord(pileId, { word: "fish" })!.id;
    WordpileStore.moveWord(pileId, wordId, "avoid");
    const words = WordpileStore.getSnapshot().piles[pileId].words;
    expect(words.find((w) => w.id === wordId)?.bucket).toBe("avoid");
    expect(words.find((w) => w.id === otherId)?.bucket).toBe("unsorted");
  });
});

describe("WordpileStore — deleteWord", () => {
  let WordpileStore: WordpileStoreType;
  let pileId: string;

  beforeEach(async () => {
    WordpileStore = await freshStore();
    pileId = WordpileStore.createPile("Deer Lake").id;
  });

  it("removes the targeted word and leaves siblings intact", () => {
    const a = WordpileStore.addWord(pileId, { word: "bannock" })!;
    const b = WordpileStore.addWord(pileId, { word: "fish" })!;
    WordpileStore.deleteWord(pileId, a.id);
    const words = WordpileStore.getSnapshot().piles[pileId].words;
    expect(words.map((w) => w.id)).toEqual([b.id]);
  });

  it("is a no-op when the pile does not exist", () => {
    const before = WordpileStore.getSnapshot();
    WordpileStore.deleteWord("missing-pile", "missing-word");
    expect(WordpileStore.getSnapshot()).toBe(before);
  });

  it("is a no-op when the word does not exist in the pile", () => {
    WordpileStore.addWord(pileId, { word: "bannock" });
    const before = WordpileStore.getSnapshot();
    WordpileStore.deleteWord(pileId, "missing-word");
    // Same word count, even if a fresh snapshot was produced.
    expect(WordpileStore.getSnapshot().piles[pileId].words).toHaveLength(
      before.piles[pileId].words.length,
    );
  });
});

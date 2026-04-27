import { describe, it, expect, beforeEach, vi } from "vitest";
import type {
  AnyPileImport,
  PileBundleExport,
  PileExport,
} from "@/data/types";
import type { WordpileStoreType } from "./store";

// Each test imports a fresh copy of the store module so the module-level
// cachedSnapshot/listeners don't leak across tests. The store guards on
// `typeof window` so it runs cleanly in the node test environment.
async function freshStore(): Promise<{
  WordpileStore: WordpileStoreType;
  parsePileExport: (raw: string) => PileExport | null;
  parsePileBundle: (raw: string) => PileBundleExport | null;
  parseAnyImport: (raw: string) => AnyPileImport | null;
}> {
  vi.resetModules();
  const mod = await import("./store");
  return {
    WordpileStore: mod.WordpileStore,
    parsePileExport: mod.parsePileExport,
    parsePileBundle: mod.parsePileBundle,
    parseAnyImport: mod.parseAnyImport,
  };
}

// Hoisted at module scope so vitest's mock-hoisting picks it up before the
// store module evaluates its `import * as cloud from "./cloudSync"` line.
// Used by the "cloud delete propagation" suite below.
const cloudMocks = vi.hoisted(() => ({
  setCloudUser: vi.fn(),
  pushCreatePile: vi.fn(),
  pushRenamePile: vi.fn(),
  pushDeletePile: vi.fn(),
  pushAddWord: vi.fn(),
  pushUpdateWord: vi.fn(),
  pushDeleteWord: vi.fn(),
}));

describe("WordpileStore — snapshot stability", () => {
  let WordpileStore: WordpileStoreType;

  beforeEach(async () => {
    ({ WordpileStore } = await freshStore());
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
    ({ WordpileStore } = await freshStore());
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
    ({ WordpileStore } = await freshStore());
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
    ({ WordpileStore } = await freshStore());
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
    ({ WordpileStore } = await freshStore());
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

describe("WordpileStore — serializePile / importPile (round-trip)", () => {
  let WordpileStore: WordpileStoreType;

  beforeEach(async () => {
    ({ WordpileStore } = await freshStore());
  });

  it("exports a pile with all word fields, then re-imports as a new pile", () => {
    const source = WordpileStore.createPile("Deer Lake");
    const w1 = WordpileStore.addWord(source.id, { word: "harvest", bucket: "load" })!;
    WordpileStore.updateWord(source.id, w1.id, { note: "primary verb" });
    const w2 = WordpileStore.addWord(source.id, {
      word: "stakeholder",
      bucket: "avoid",
    })!;
    WordpileStore.updateWord(source.id, w2.id, {
      saferAlternative: "community member",
    });
    WordpileStore.addWord(source.id, { word: "elder" });

    const payload = WordpileStore.serializePile(source.id);
    expect(payload).not.toBeNull();
    expect(payload!.format).toBe("wordpile-export");
    expect(payload!.formatVersion).toBe(1);
    expect(payload!.pile.name).toBe("Deer Lake");
    expect(payload!.pile.words).toHaveLength(3);

    const imported = WordpileStore.importPile(payload!, {
      nameOverride: "Deer Lake Copy",
    });
    expect(imported).not.toBeNull();
    expect(imported!.id).not.toBe(source.id);
    expect(imported!.name).toBe("Deer Lake Copy");
    expect(imported!.words).toHaveLength(3);
    const stakeholder = imported!.words.find((w) => w.word === "stakeholder");
    expect(stakeholder?.bucket).toBe("avoid");
    expect(stakeholder?.saferAlternative).toBe("community member");
    const harvest = imported!.words.find((w) => w.word === "harvest");
    expect(harvest?.bucket).toBe("load");
    expect(harvest?.note).toBe("primary verb");
  });

  it("returns null when serializing a missing pile", () => {
    expect(WordpileStore.serializePile("missing")).toBeNull();
  });

  it("merges into an existing pile without duplicating words (existing wins)", () => {
    const target = WordpileStore.createPile("Deer Lake");
    WordpileStore.addWord(target.id, {
      word: "harvest",
      bucket: "load",
      note: "kept",
    });

    const payload: PileExport = {
      format: "wordpile-export",
      formatVersion: 1,
      exportedAt: 0,
      pile: {
        name: "Other Community",
        words: [
          // duplicate by case — should be skipped, original "kept" note preserved.
          { word: "Harvest", bucket: "avoid", note: "overwritten?", saferAlternative: "" },
          { word: "fish", bucket: "load", note: "new", saferAlternative: "" },
        ],
      },
    };
    const result = WordpileStore.importPile(payload, { mergeIntoPileId: target.id });
    expect(result).not.toBeNull();
    expect(result!.id).toBe(target.id);
    expect(result!.words).toHaveLength(2);
    const harvest = result!.words.find((w) => w.word === "harvest");
    expect(harvest?.note).toBe("kept");
    expect(harvest?.bucket).toBe("load");
    const fish = result!.words.find((w) => w.word === "fish");
    expect(fish?.bucket).toBe("load");
    expect(fish?.note).toBe("new");
  });

  it("returns null when merging into a non-existent pile", () => {
    const payload: PileExport = {
      format: "wordpile-export",
      formatVersion: 1,
      exportedAt: 0,
      pile: { name: "x", words: [] },
    };
    expect(
      WordpileStore.importPile(payload, { mergeIntoPileId: "missing" }),
    ).toBeNull();
  });
});

describe("parsePileExport", () => {
  let parsePileExport: (raw: string) => PileExport | null;

  beforeEach(async () => {
    ({ parsePileExport } = await freshStore());
  });

  it("accepts a well-formed export and normalizes word casing", () => {
    const raw = JSON.stringify({
      format: "wordpile-export",
      formatVersion: 1,
      exportedAt: 1700000000000,
      pile: {
        name: "Deer Lake",
        words: [
          { word: "Harvest", bucket: "load", note: "x", saferAlternative: "" },
        ],
      },
    });
    const parsed = parsePileExport(raw);
    expect(parsed).not.toBeNull();
    expect(parsed!.pile.name).toBe("Deer Lake");
    expect(parsed!.pile.words[0].word).toBe("harvest");
  });

  it("rejects non-JSON input", () => {
    expect(parsePileExport("not json")).toBeNull();
  });

  it("rejects payloads with the wrong format marker", () => {
    expect(
      parsePileExport(
        JSON.stringify({ format: "something-else", formatVersion: 1, pile: {} }),
      ),
    ).toBeNull();
  });

  it("rejects payloads missing pile.name or pile.words", () => {
    expect(
      parsePileExport(
        JSON.stringify({
          format: "wordpile-export",
          formatVersion: 1,
          pile: { words: [] },
        }),
      ),
    ).toBeNull();
    expect(
      parsePileExport(
        JSON.stringify({
          format: "wordpile-export",
          formatVersion: 1,
          pile: { name: "x" },
        }),
      ),
    ).toBeNull();
  });

  it("normalizes invalid bucket values to 'unsorted' and drops blank words", () => {
    const raw = JSON.stringify({
      format: "wordpile-export",
      formatVersion: 1,
      pile: {
        name: "x",
        words: [
          { word: "fish", bucket: "garbage" },
          { word: "", bucket: "load" },
          { word: "elder" },
        ],
      },
    });
    const parsed = parsePileExport(raw)!;
    expect(parsed.pile.words.map((w) => w.word)).toEqual(["fish", "elder"]);
    expect(parsed.pile.words[0].bucket).toBe("unsorted");
  });
});

// These tests pin down the behaviour the cross-device delete relies on:
// every successful local delete must also fire a cloud DELETE so the row
// is removed from Postgres and doesn't reappear on the next /sync from
// another device. We mock cloudSync so we can assert what was called
// without standing up a server.
describe("WordpileStore — cloud delete propagation", () => {
  let WordpileStore: WordpileStoreType;

  beforeEach(async () => {
    vi.resetModules();
    for (const fn of Object.values(cloudMocks)) fn.mockClear();
    vi.doMock("./cloudSync", () => cloudMocks);
    const mod = await import("./store");
    WordpileStore = mod.WordpileStore;
  });

  it("calls cloud.pushDeletePile when a pile is removed", () => {
    const pile = WordpileStore.createPile("Deer Lake");
    cloudMocks.pushDeletePile.mockClear();
    WordpileStore.deletePile(pile.id);
    expect(cloudMocks.pushDeletePile).toHaveBeenCalledTimes(1);
    expect(cloudMocks.pushDeletePile).toHaveBeenCalledWith(pile.id);
  });

  it("does not call cloud.pushDeletePile when the pile does not exist", () => {
    WordpileStore.deletePile("nonexistent-pile-id");
    expect(cloudMocks.pushDeletePile).not.toHaveBeenCalled();
  });

  it("calls cloud.pushDeleteWord when a word is removed", () => {
    const pile = WordpileStore.createPile("Deer Lake");
    const word = WordpileStore.addWord(pile.id, { word: "bannock" })!;
    cloudMocks.pushDeleteWord.mockClear();
    WordpileStore.deleteWord(pile.id, word.id);
    expect(cloudMocks.pushDeleteWord).toHaveBeenCalledTimes(1);
    expect(cloudMocks.pushDeleteWord).toHaveBeenCalledWith(pile.id, word.id);
  });

  it("does not call cloud.pushDeleteWord when the word does not exist", () => {
    const pile = WordpileStore.createPile("Deer Lake");
    cloudMocks.pushDeleteWord.mockClear();
    WordpileStore.deleteWord(pile.id, "nonexistent-word-id");
    expect(cloudMocks.pushDeleteWord).not.toHaveBeenCalled();
  });
});

describe("WordpileStore — serializeAllPiles / importBundle (round-trip)", () => {
  let WordpileStore: WordpileStoreType;
  let parsePileBundle: (raw: string) => PileBundleExport | null;
  let parseAnyImport: (raw: string) => AnyPileImport | null;

  // Stub a minimal localStorage so the store's draft handling (gated on
  // `typeof window !== "undefined"`) exercises its real code path inside
  // the node test environment.
  function stubWindow() {
    const store = new Map<string, string>();
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
        setItem: (k: string, v: string) => store.set(k, String(v)),
        removeItem: (k: string) => store.delete(k),
        clear: () => store.clear(),
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    };
  }

  function unstubWindow() {
    delete (globalThis as any).window;
  }

  beforeEach(async () => {
    stubWindow();
    ({ WordpileStore, parsePileBundle, parseAnyImport } = await freshStore());
  });

  it("serializes every pile (in pileOrder) with words and drafts", () => {
    const a = WordpileStore.createPile("Deer Lake");
    WordpileStore.addWord(a.id, { word: "harvest", bucket: "load" });
    const b = WordpileStore.createPile("Bearskin Lake");
    WordpileStore.addWord(b.id, { word: "stakeholder", bucket: "avoid" });
    window.localStorage.setItem(
      "wordpile:draft:" + b.id,
      "Some draft text the practitioner saved.",
    );

    const bundle = WordpileStore.serializeAllPiles();
    expect(bundle.format).toBe("wordpile-bundle");
    expect(bundle.formatVersion).toBe(1);
    expect(bundle.piles).toHaveLength(2);
    expect(bundle.piles[0].name).toBe("Deer Lake");
    expect(bundle.piles[0].words[0].word).toBe("harvest");
    expect(bundle.piles[0].draft).toBeUndefined();
    expect(bundle.piles[1].name).toBe("Bearskin Lake");
    expect(bundle.piles[1].draft).toBe(
      "Some draft text the practitioner saved.",
    );
    unstubWindow();
  });

  it("returns an empty bundle when no piles exist", () => {
    const bundle = WordpileStore.serializeAllPiles();
    expect(bundle.piles).toEqual([]);
  });

  it("round-trips: bundle export → JSON parse → fresh-device import yields identical pile list", async () => {
    // Device 1: build state.
    const a = WordpileStore.createPile("Deer Lake");
    WordpileStore.addWord(a.id, { word: "harvest", bucket: "load" });
    WordpileStore.addWord(a.id, { word: "elder" });
    const b = WordpileStore.createPile("Bearskin Lake");
    WordpileStore.addWord(b.id, { word: "stakeholder", bucket: "avoid" });
    WordpileStore.updateWord(
      b.id,
      WordpileStore.getSnapshot().piles[b.id].words[0].id,
      { saferAlternative: "community member" },
    );
    window.localStorage.setItem(
      "wordpile:draft:" + b.id,
      "Draft prose for Bearskin.",
    );

    const bundle = WordpileStore.serializeAllPiles();
    const json = JSON.stringify(bundle);

    // Device 2: fresh module + cleared storage.
    window.localStorage.clear();
    const fresh = await freshStore();
    const parsed = fresh.parsePileBundle(json);
    expect(parsed).not.toBeNull();
    const created = fresh.WordpileStore.importBundle(parsed!);
    expect(created).toHaveLength(2);

    const snap = fresh.WordpileStore.getSnapshot();
    const names = snap.pileOrder.map((id) => snap.piles[id].name);
    expect(names).toEqual(["Deer Lake", "Bearskin Lake"]);

    const deerLake = created.find((p) => p.name === "Deer Lake")!;
    expect(deerLake.words.map((w) => w.word).sort()).toEqual([
      "elder",
      "harvest",
    ]);

    const bearskin = created.find((p) => p.name === "Bearskin Lake")!;
    const stakeholder = bearskin.words.find((w) => w.word === "stakeholder");
    expect(stakeholder?.bucket).toBe("avoid");
    expect(stakeholder?.saferAlternative).toBe("community member");
    expect(
      window.localStorage.getItem("wordpile:draft:" + bearskin.id),
    ).toBe("Draft prose for Bearskin.");
  });

  it("respects selectedIndexes when importing a subset", () => {
    const bundle: PileBundleExport = {
      format: "wordpile-bundle",
      formatVersion: 1,
      exportedAt: 0,
      piles: [
        { name: "Pile One", words: [] },
        { name: "Pile Two", words: [] },
        { name: "Pile Three", words: [] },
      ],
    };
    const created = WordpileStore.importBundle(bundle, {
      selectedIndexes: [0, 2],
    });
    expect(created.map((p) => p.name)).toEqual(["Pile One", "Pile Three"]);
    const snap = WordpileStore.getSnapshot();
    expect(snap.pileOrder).toHaveLength(2);
  });

  it("imports nothing when an empty selection is supplied", () => {
    const bundle: PileBundleExport = {
      format: "wordpile-bundle",
      formatVersion: 1,
      exportedAt: 0,
      piles: [{ name: "Pile One", words: [] }],
    };
    const created = WordpileStore.importBundle(bundle, { selectedIndexes: [] });
    expect(created).toEqual([]);
    expect(WordpileStore.getSnapshot().pileOrder).toEqual([]);
  });

  it("parseAnyImport detects a bundle vs a single-pile export", () => {
    const bundleRaw = JSON.stringify({
      format: "wordpile-bundle",
      formatVersion: 1,
      exportedAt: 0,
      piles: [{ name: "Deer Lake", words: [{ word: "harvest", bucket: "load" }] }],
    });
    const pileRaw = JSON.stringify({
      format: "wordpile-export",
      formatVersion: 1,
      exportedAt: 0,
      pile: { name: "Deer Lake", words: [{ word: "harvest", bucket: "load" }] },
    });
    expect(parseAnyImport(bundleRaw)?.kind).toBe("bundle");
    expect(parseAnyImport(pileRaw)?.kind).toBe("pile");
    expect(parseAnyImport("garbage")).toBeNull();
  });

  it("parsePileBundle rejects malformed payloads", () => {
    expect(parsePileBundle("not json")).toBeNull();
    expect(
      parsePileBundle(
        JSON.stringify({ format: "wordpile-export", formatVersion: 1, pile: {} }),
      ),
    ).toBeNull();
    expect(
      parsePileBundle(
        JSON.stringify({ format: "wordpile-bundle", formatVersion: 2, piles: [] }),
      ),
    ).toBeNull();
    expect(
      parsePileBundle(
        JSON.stringify({ format: "wordpile-bundle", formatVersion: 1 }),
      ),
    ).toBeNull();
  });

  it("parsePileBundle drops malformed pile entries but keeps the rest", () => {
    const raw = JSON.stringify({
      format: "wordpile-bundle",
      formatVersion: 1,
      exportedAt: 1,
      piles: [
        { name: "Good", words: [{ word: "harvest" }] },
        { name: "", words: [] }, // dropped: blank name
        { name: "No Words" }, // dropped: no words array
        { name: "Also Good", words: [{ word: "elder", bucket: "garbage" }] },
      ],
    });
    const bundle = parsePileBundle(raw)!;
    expect(bundle.piles.map((p) => p.name)).toEqual(["Good", "Also Good"]);
    expect(bundle.piles[1].words[0].bucket).toBe("unsorted");
  });
});

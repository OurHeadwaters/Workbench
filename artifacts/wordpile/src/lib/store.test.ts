import { describe, it, expect, beforeEach, vi } from "vitest";
import type {
  AnyPileImport,
  CommunityPile,
  PileBundleExport,
  PileExport,
  WordEntry,
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
  pushBuildVotes: vi.fn(),
  bootstrapSync: vi.fn(),
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

  it("adopts the incoming bucket / safer-alternative for words listed in useTheirsWords", () => {
    const target = WordpileStore.createPile("Deer Lake");
    const stakeholderId = WordpileStore.addWord(target.id, {
      word: "stakeholder",
      bucket: "avoid",
    })!.id;
    WordpileStore.updateWord(target.id, stakeholderId, {
      saferAlternative: "community member",
    });
    const harvestId = WordpileStore.addWord(target.id, {
      word: "harvest",
      bucket: "load",
    })!.id;
    WordpileStore.updateWord(target.id, harvestId, { note: "primary verb" });

    const payload: PileExport = {
      format: "wordpile-export",
      formatVersion: 1,
      exportedAt: 0,
      pile: {
        name: "Shared",
        words: [
          // Differs in safer-alternative — practitioner picks "use theirs".
          {
            word: "stakeholder",
            bucket: "avoid",
            note: "shared note",
            saferAlternative: "neighbour",
          },
          // Differs in bucket — practitioner does NOT pick "use theirs",
          // so the existing classification (load) must stick.
          { word: "harvest", bucket: "interior", note: "shared", saferAlternative: "" },
          // Brand-new word — always added.
          { word: "fish", bucket: "load", note: "new", saferAlternative: "" },
        ],
      },
    };

    const result = WordpileStore.importPile(payload, {
      mergeIntoPileId: target.id,
      useTheirsWords: ["stakeholder"],
    });
    expect(result).not.toBeNull();
    const stakeholder = result!.words.find((w) => w.word === "stakeholder");
    expect(stakeholder?.bucket).toBe("avoid");
    expect(stakeholder?.saferAlternative).toBe("neighbour");
    // The note on the existing entry is preserved (we don't pull notes
    // across — this matches today's "additions only carry their own
    // metadata" stance).
    const harvest = result!.words.find((w) => w.word === "harvest");
    expect(harvest?.bucket).toBe("load");
    expect(harvest?.note).toBe("primary verb");
    const fish = result!.words.find((w) => w.word === "fish");
    expect(fish?.bucket).toBe("load");
  });

  it("matches useTheirsWords case-insensitively and ignores words that aren't conflicts", () => {
    const target = WordpileStore.createPile("Deer Lake");
    WordpileStore.addWord(target.id, { word: "stakeholder", bucket: "avoid" });

    const payload: PileExport = {
      format: "wordpile-export",
      formatVersion: 1,
      exportedAt: 0,
      pile: {
        name: "Shared",
        words: [
          {
            word: "stakeholder",
            bucket: "interior",
            note: "",
            saferAlternative: "",
          },
        ],
      },
    };
    // Mixed-case / unknown picks must still resolve correctly.
    const result = WordpileStore.importPile(payload, {
      mergeIntoPileId: target.id,
      useTheirsWords: ["Stakeholder", "not-a-real-word"],
    });
    const stakeholder = result!.words.find((w) => w.word === "stakeholder");
    expect(stakeholder?.bucket).toBe("interior");
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

// Build-page votes have to behave like every other mutation: optimistic
// local update + queued cloud push. Plus two flavour-specific things —
// the pile's `updatedAt` must not change (vote activity isn't an edit),
// and the legacy localStorage migration must run once and only once.
describe("WordpileStore — Build-page votes", () => {
  let WordpileStore: WordpileStoreType;

  beforeEach(async () => {
    vi.resetModules();
    for (const fn of Object.values(cloudMocks)) fn.mockClear();
    vi.doMock("./cloudSync", () => cloudMocks);
    const mod = await import("./store");
    WordpileStore = mod.WordpileStore;
  });

  it("createPile starts with an empty vote tally", () => {
    const pile = WordpileStore.createPile("Deer Lake");
    expect(pile.buildVotes).toEqual({
      stacker: 0,
      blocks: 0,
      planks: 0,
      lastChoice: null,
      updatedAt: 0,
    });
  });

  it("castBuildVote increments the chosen variant and queues a cloud push", () => {
    const pile = WordpileStore.createPile("Deer Lake");
    cloudMocks.pushBuildVotes.mockClear();
    WordpileStore.castBuildVote(pile.id, "blocks");
    const updated = WordpileStore.getSnapshot().piles[pile.id];
    expect(updated.buildVotes.blocks).toBe(1);
    expect(updated.buildVotes.stacker).toBe(0);
    expect(updated.buildVotes.planks).toBe(0);
    expect(updated.buildVotes.lastChoice).toBe("blocks");
    expect(updated.buildVotes.updatedAt).toBeGreaterThan(0);
    expect(cloudMocks.pushBuildVotes).toHaveBeenCalledTimes(1);
    expect(cloudMocks.pushBuildVotes).toHaveBeenCalledWith(
      pile.id,
      updated.buildVotes,
    );
  });

  it("castBuildVote does NOT bump the pile's updatedAt", () => {
    const pile = WordpileStore.createPile("Deer Lake");
    const before = WordpileStore.getSnapshot().piles[pile.id].updatedAt;
    WordpileStore.castBuildVote(pile.id, "stacker");
    const after = WordpileStore.getSnapshot().piles[pile.id].updatedAt;
    expect(after).toBe(before);
  });

  it("castBuildVote is a no-op when the pile is unknown", () => {
    WordpileStore.castBuildVote("not-a-real-pile", "stacker");
    expect(cloudMocks.pushBuildVotes).not.toHaveBeenCalled();
  });

  it("adoptLegacyBuildVotes sums onto the current tally and stamps a fresh timestamp", () => {
    const pile = WordpileStore.createPile("Deer Lake");
    // Pre-load some "server already had these" votes by casting once.
    WordpileStore.castBuildVote(pile.id, "stacker");
    cloudMocks.pushBuildVotes.mockClear();
    const tBefore = Date.now();
    WordpileStore.adoptLegacyBuildVotes(pile.id, {
      stacker: 2,
      blocks: 1,
      planks: 0,
      lastChoice: "blocks",
    });
    const updated = WordpileStore.getSnapshot().piles[pile.id];
    expect(updated.buildVotes.stacker).toBe(3);
    expect(updated.buildVotes.blocks).toBe(1);
    expect(updated.buildVotes.planks).toBe(0);
    // Migrating-in choice wins over the previous one.
    expect(updated.buildVotes.lastChoice).toBe("blocks");
    expect(updated.buildVotes.updatedAt).toBeGreaterThanOrEqual(tBefore);
    expect(cloudMocks.pushBuildVotes).toHaveBeenCalledTimes(1);
  });

  it("adoptLegacyBuildVotes is a no-op when there are no legacy votes", () => {
    const pile = WordpileStore.createPile("Deer Lake");
    cloudMocks.pushBuildVotes.mockClear();
    const before = WordpileStore.getSnapshot().piles[pile.id].buildVotes;
    WordpileStore.adoptLegacyBuildVotes(pile.id, {
      stacker: 0,
      blocks: 0,
      planks: 0,
      lastChoice: null,
    });
    const after = WordpileStore.getSnapshot().piles[pile.id].buildVotes;
    // Reference equality — the snapshot wasn't perturbed.
    expect(after).toBe(before);
    expect(cloudMocks.pushBuildVotes).not.toHaveBeenCalled();
  });
});

// `reconcileWithCloud` is the wrapper the sync-status pill calls when the
// queue has drained but at least one mutation was permanently rejected
// (sticky-failure subkind). It POSTs the local snapshot to /sync via
// cloudSync.bootstrapSync and replaces the in-memory state with the
// merged result. We mock cloudSync to keep the test pure.
describe("WordpileStore — reconcileWithCloud", () => {
  let WordpileStore: WordpileStoreType;

  beforeEach(async () => {
    vi.resetModules();
    for (const fn of Object.values(cloudMocks)) fn.mockClear();
    vi.doMock("./cloudSync", () => cloudMocks);
    const mod = await import("./store");
    WordpileStore = mod.WordpileStore;
  });

  it("swaps the in-memory snapshot for the merged server result on success", async () => {
    // Local state the user built up before reconciling.
    const local = WordpileStore.createPile("Local-only");
    expect(WordpileStore.getSnapshot().piles[local.id]).toBeTruthy();

    // Server "wins" with a different pile (e.g. created on another
    // device). bootstrapSync would resolve to that merged snapshot;
    // after reconcileWithCloud the store should mirror it exactly,
    // dropping the local-only id.
    cloudMocks.bootstrapSync.mockResolvedValueOnce({
      version: 1,
      piles: {
        "00000000-0000-4000-8000-000000000aaa": {
          id: "00000000-0000-4000-8000-000000000aaa",
          name: "From the server",
          createdAt: 1,
          updatedAt: 2,
          words: [],
        },
      },
      pileOrder: ["00000000-0000-4000-8000-000000000aaa"],
      selectedPileId: "00000000-0000-4000-8000-000000000aaa",
    });

    const ok = await WordpileStore.reconcileWithCloud();
    expect(ok).toBe(true);
    expect(cloudMocks.bootstrapSync).toHaveBeenCalledTimes(1);
    const next = WordpileStore.getSnapshot();
    expect(next.piles[local.id]).toBeUndefined();
    expect(next.piles["00000000-0000-4000-8000-000000000aaa"]?.name).toBe(
      "From the server",
    );
    expect(next.pileOrder).toEqual(["00000000-0000-4000-8000-000000000aaa"]);
  });

  it("leaves local state untouched when the bootstrap call fails", async () => {
    // The pill needs to know the recovery didn't happen (so it can stay
    // in error and let the user try again). The store must not blank out
    // the user's local data on a failed reconciliation — they'd lose
    // everything they typed since the last successful sync.
    const local = WordpileStore.createPile("Still here");
    const before = WordpileStore.getSnapshot();

    cloudMocks.bootstrapSync.mockResolvedValueOnce(null);
    const ok = await WordpileStore.reconcileWithCloud();
    expect(ok).toBe(false);
    const after = WordpileStore.getSnapshot();
    // Reference equality is enough — the snapshot wasn't replaced.
    expect(after).toBe(before);
    expect(after.piles[local.id]?.name).toBe("Still here");
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

  it("merges a bundle entry into an existing pile when given a per-row decision", () => {
    // Existing on-device state: a "Deer Lake" pile that the practitioner
    // has been editing.
    const existing = WordpileStore.createPile("Deer Lake");
    WordpileStore.addWord(existing.id, {
      word: "harvest",
      bucket: "load",
      note: "kept by user",
    });

    // Backup contains a "Deer Lake" with stale data — same word back in
    // the unsorted bucket plus a brand-new word — and a separate fresh
    // pile that has no on-device counterpart.
    const bundle: PileBundleExport = {
      format: "wordpile-bundle",
      formatVersion: 1,
      exportedAt: 0,
      piles: [
        {
          name: "Deer Lake",
          words: [
            { word: "Harvest", bucket: "unsorted", note: "stale", saferAlternative: "" },
            { word: "elder", bucket: "load", note: "from backup", saferAlternative: "" },
          ],
        },
        { name: "Bearskin Lake", words: [{ word: "fish", bucket: "load", note: "", saferAlternative: "" }] },
      ],
    };

    const result = WordpileStore.importBundle(bundle, {
      decisions: {
        0: { mode: "merge", pileId: existing.id },
        1: { mode: "new" },
      },
    });

    // No duplicate "Deer Lake" pile was created; the existing one is
    // returned in place, and "Bearskin Lake" was created fresh.
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(existing.id);
    expect(result[0].name).toBe("Deer Lake");
    expect(result[1].name).toBe("Bearskin Lake");

    const snap = WordpileStore.getSnapshot();
    const names = snap.pileOrder.map((id) => snap.piles[id].name);
    expect(names).toEqual(["Deer Lake", "Bearskin Lake"]);

    // Existing word kept its load bucket + practitioner's note (existing
    // wins on the case-insensitive match), and the new word came in.
    const merged = snap.piles[existing.id];
    expect(merged.words.map((w) => w.word).sort()).toEqual(["elder", "harvest"]);
    const harvest = merged.words.find((w) => w.word === "harvest");
    expect(harvest?.bucket).toBe("load");
    expect(harvest?.note).toBe("kept by user");
    const elder = merged.words.find((w) => w.word === "elder");
    expect(elder?.bucket).toBe("load");
    expect(elder?.note).toBe("from backup");
  });

  it("forwards per-row useTheirsWords to merging entries so reclassifications can be adopted from the backup", () => {
    const existing = WordpileStore.createPile("Deer Lake");
    WordpileStore.addWord(existing.id, {
      word: "stakeholder",
      bucket: "avoid",
    });

    const bundle: PileBundleExport = {
      format: "wordpile-bundle",
      formatVersion: 1,
      exportedAt: 0,
      piles: [
        {
          name: "Deer Lake",
          words: [
            {
              word: "stakeholder",
              bucket: "interior",
              note: "shared",
              saferAlternative: "",
            },
            { word: "elder", bucket: "load", note: "", saferAlternative: "" },
          ],
        },
      ],
    };

    WordpileStore.importBundle(bundle, {
      decisions: {
        0: {
          mode: "merge",
          pileId: existing.id,
          useTheirsWords: ["stakeholder"],
        },
      },
    });
    const merged = WordpileStore.getSnapshot().piles[existing.id];
    const stakeholder = merged.words.find((w) => w.word === "stakeholder");
    expect(stakeholder?.bucket).toBe("interior");
    const elder = merged.words.find((w) => w.word === "elder");
    expect(elder?.bucket).toBe("load");
  });

  it("skips a merge decision targeting a missing pile but still imports the rest", () => {
    const bundle: PileBundleExport = {
      format: "wordpile-bundle",
      formatVersion: 1,
      exportedAt: 0,
      piles: [
        { name: "Deer Lake", words: [] },
        { name: "Bearskin Lake", words: [] },
      ],
    };
    const result = WordpileStore.importBundle(bundle, {
      decisions: {
        0: { mode: "merge", pileId: "does-not-exist" },
        1: { mode: "new" },
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bearskin Lake");
  });

  it("backup → lose edits → restore-with-merge yields an identical pile list (no duplicates)", () => {
    // Practitioner builds out two piles, takes a backup, then loses
    // some local edits (we simulate that by deleting a word). They then
    // restore the backup with both rows merged into the existing piles.
    const a = WordpileStore.createPile("Deer Lake");
    WordpileStore.addWord(a.id, { word: "harvest", bucket: "load" });
    const elderId = WordpileStore.addWord(a.id, { word: "elder" })!.id;
    const b = WordpileStore.createPile("Bearskin Lake");
    WordpileStore.addWord(b.id, { word: "stakeholder", bucket: "avoid" });

    const bundle = WordpileStore.serializeAllPiles();
    const json = JSON.stringify(bundle);

    // Lose an edit.
    WordpileStore.deleteWord(a.id, elderId);
    expect(
      WordpileStore.getSnapshot().piles[a.id].words.map((w) => w.word).sort(),
    ).toEqual(["harvest"]);

    // Restore in place.
    const parsed = JSON.parse(json) as PileBundleExport;
    WordpileStore.importBundle(parsed, {
      decisions: {
        0: { mode: "merge", pileId: a.id },
        1: { mode: "merge", pileId: b.id },
      },
    });

    const snap = WordpileStore.getSnapshot();
    const names = snap.pileOrder.map((id) => snap.piles[id].name);
    // Still exactly the same two piles — no "Deer Lake (2)" duplicates.
    expect(names).toEqual(["Deer Lake", "Bearskin Lake"]);
    // Deleted word is back.
    expect(snap.piles[a.id].words.map((w) => w.word).sort()).toEqual([
      "elder",
      "harvest",
    ]);
    expect(snap.piles[b.id].words.map((w) => w.word).sort()).toEqual([
      "stakeholder",
    ]);
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

describe("findSimilarLocalPile", () => {
  function makePile(
    id: string,
    name: string,
    words: string[],
  ): CommunityPile {
    const now = 0;
    const wordEntries: WordEntry[] = words.map((w, i) => ({
      id: `${id}-w${i}`,
      word: w.toLowerCase(),
      note: "",
      bucket: "unsorted",
      saferAlternative: "",
      createdAt: now,
      updatedAt: now,
    }));
    return {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      words: wordEntries,
      buildVotes: {
        stacker: 0,
        blocks: 0,
        planks: 0,
        lastChoice: null,
        updatedAt: 0,
      },
    };
  }

  function makePayload(name: string, words: string[]): PileExport {
    return {
      format: "wordpile-export",
      formatVersion: 1,
      exportedAt: 0,
      pile: {
        name,
        words: words.map((w) => ({
          word: w.toLowerCase(),
          bucket: "unsorted",
          note: "",
          saferAlternative: "",
        })),
      },
    };
  }

  it("returns null when there are no local piles", async () => {
    const { findSimilarLocalPile } = await import("./store");
    expect(
      findSimilarLocalPile(makePayload("Deer Lake", ["a", "b"]), []),
    ).toBeNull();
  });

  it("matches by case-insensitive, trimmed name", async () => {
    const { findSimilarLocalPile } = await import("./store");
    const piles = [
      makePile("p1", "Sandy Lake", ["wholly", "different"]),
      makePile("p2", "Deer Lake", ["unrelated"]),
    ];
    const match = findSimilarLocalPile(
      makePayload("  deer lake  ", ["totally", "new", "words"]),
      piles,
    );
    expect(match?.pile.id).toBe("p2");
    expect(match?.reason).toContain("Deer Lake");
  });

  it("matches by >80% Jaccard word overlap when names differ", async () => {
    const { findSimilarLocalPile } = await import("./store");
    const shared = [
      "harvest",
      "elder",
      "moose",
      "river",
      "fire",
      "snow",
      "berry",
      "trap",
      "canoe",
    ];
    const piles = [makePile("p1", "Old Name", shared)];
    // Incoming has all 9 shared words plus 1 new — Jaccard = 9/10 = 0.9.
    const match = findSimilarLocalPile(
      makePayload("New Name", [...shared, "newword"]),
      piles,
    );
    expect(match?.pile.id).toBe("p1");
    expect(match?.reason).toMatch(/90%/);
  });

  it("returns null when overlap is at or below 80%", async () => {
    const { findSimilarLocalPile } = await import("./store");
    const piles = [
      makePile("p1", "Old Name", ["a", "b", "c", "d", "e"]),
    ];
    // Incoming shares 4 of 5; union = 6 → 4/6 ≈ 66.7% < 80.
    const match = findSimilarLocalPile(
      makePayload("New Name", ["a", "b", "c", "d", "x"]),
      piles,
    );
    expect(match).toBeNull();
  });

  it("name match wins even when overlap is low", async () => {
    const { findSimilarLocalPile } = await import("./store");
    const piles = [
      makePile("p1", "Deer Lake", ["only", "two", "words"]),
    ];
    const match = findSimilarLocalPile(
      makePayload("Deer Lake", ["entirely", "different", "vocabulary", "list"]),
      piles,
    );
    expect(match?.pile.id).toBe("p1");
    expect(match?.reason).toContain('"Deer Lake"');
  });

  it("picks the best Jaccard match when multiple piles overlap", async () => {
    const { findSimilarLocalPile } = await import("./store");
    const shared = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const piles = [
      // 10/10 same words, but different name → Jaccard 1.0
      makePile("perfect", "Other", shared),
      // partial overlap
      makePile("partial", "Yet Another", ["a", "b", "z"]),
    ];
    const match = findSimilarLocalPile(makePayload("Brand New", shared), piles);
    expect(match?.pile.id).toBe("perfect");
  });

  it("ignores empty incoming word lists when name doesn't match", async () => {
    const { findSimilarLocalPile } = await import("./store");
    const piles = [makePile("p1", "Old", ["a", "b"])];
    const match = findSimilarLocalPile(makePayload("Fresh", []), piles);
    expect(match).toBeNull();
  });
});

describe("computeMergeConflicts", () => {
  let WordpileStore: WordpileStoreType;
  let computeMergeConflicts: typeof import("./store").computeMergeConflicts;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("./store");
    WordpileStore = mod.WordpileStore;
    computeMergeConflicts = mod.computeMergeConflicts;
  });

  it("counts overlap, new additions, and reclassified words", () => {
    const target = WordpileStore.createPile("Deer Lake");
    WordpileStore.addWord(target.id, { word: "harvest", bucket: "load" });
    WordpileStore.addWord(target.id, { word: "stakeholder", bucket: "avoid" });
    WordpileStore.updateWord(
      target.id,
      WordpileStore.getSnapshot().piles[target.id].words.find(
        (w) => w.word === "stakeholder",
      )!.id,
      { saferAlternative: "community member" },
    );
    const targetPile = WordpileStore.getSnapshot().piles[target.id];

    const summary = computeMergeConflicts(
      {
        name: "Other",
        words: [
          // overlap, same bucket, same safer-alt → not reclassified
          {
            word: "Harvest",
            bucket: "load",
            note: "ignored",
            saferAlternative: "",
          },
          // overlap, different safer-alt → reclassified
          {
            word: "stakeholder",
            bucket: "avoid",
            note: "",
            saferAlternative: "neighbour",
          },
          // brand new
          { word: "elder", bucket: "load", note: "", saferAlternative: "" },
          // duplicate within incoming → counted once
          { word: "elder", bucket: "interior", note: "", saferAlternative: "" },
          // blank → dropped
          { word: "", bucket: "load", note: "", saferAlternative: "" },
        ],
      },
      targetPile,
    );

    expect(summary.totalIncoming).toBe(3);
    expect(summary.newCount).toBe(1);
    expect(summary.overlapCount).toBe(2);
    expect(summary.reclassifiedCount).toBe(1);
    expect(summary.conflicts).toHaveLength(2);
    const harvest = summary.conflicts.find((c) => c.word === "harvest")!;
    expect(harvest.bucketDiffers).toBe(false);
    expect(harvest.saferAlternativeDiffers).toBe(false);
    const stakeholder = summary.conflicts.find(
      (c) => c.word === "stakeholder",
    )!;
    expect(stakeholder.bucketDiffers).toBe(false);
    expect(stakeholder.saferAlternativeDiffers).toBe(true);
    expect(stakeholder.existingSaferAlternative).toBe("community member");
    expect(stakeholder.incomingSaferAlternative).toBe("neighbour");
  });

  it("flags bucket changes as reclassified", () => {
    const target = WordpileStore.createPile("Deer Lake");
    WordpileStore.addWord(target.id, { word: "harvest", bucket: "load" });
    const targetPile = WordpileStore.getSnapshot().piles[target.id];

    const summary = computeMergeConflicts(
      {
        name: "Other",
        words: [
          { word: "harvest", bucket: "avoid", note: "", saferAlternative: "" },
        ],
      },
      targetPile,
    );
    expect(summary.overlapCount).toBe(1);
    expect(summary.reclassifiedCount).toBe(1);
    expect(summary.conflicts[0].bucketDiffers).toBe(true);
    expect(summary.conflicts[0].existingBucket).toBe("load");
    expect(summary.conflicts[0].incomingBucket).toBe("avoid");
  });

  it("returns zero conflicts for an empty target", () => {
    const target = WordpileStore.createPile("Empty");
    const targetPile = WordpileStore.getSnapshot().piles[target.id];
    const summary = computeMergeConflicts(
      {
        name: "Other",
        words: [
          { word: "harvest", bucket: "load", note: "", saferAlternative: "" },
          { word: "elder", bucket: "interior", note: "", saferAlternative: "" },
        ],
      },
      targetPile,
    );
    expect(summary.totalIncoming).toBe(2);
    expect(summary.newCount).toBe(2);
    expect(summary.overlapCount).toBe(0);
    expect(summary.reclassifiedCount).toBe(0);
    expect(summary.conflicts).toEqual([]);
  });
});

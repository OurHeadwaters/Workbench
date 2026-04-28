import { describe, it, expect, beforeEach, vi } from "vitest";

// Each test gets a fresh import of the module so the in-memory mute flag /
// migration flag can't leak across cases. Stub localStorage on the global
// `window` so the helpers' SSR guards pass.

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number) {
    return Array.from(this.map.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
}

async function freshModule() {
  vi.resetModules();
  const storage = new MemoryStorage();
  vi.stubGlobal("window", { localStorage: storage });
  const mod = await import("./buildStats");
  return { mod, storage };
}

describe("buildStats", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns empty stats for an unknown pile", async () => {
    const { mod } = await freshModule();
    expect(mod.readStats("nope")).toEqual(mod.EMPTY_STATS);
  });

  it("round-trips a write/read", async () => {
    const { mod } = await freshModule();
    mod.writeStats("p1", {
      ...mod.EMPTY_STATS,
      runs: 3,
      bestPlaced: 7,
      bestFrame: 2,
      crackCount: 4,
      everStood: true,
      updatedAt: 0,
    });
    const got = mod.readStats("p1");
    expect(got.runs).toBe(3);
    expect(got.bestPlaced).toBe(7);
    expect(got.bestFrame).toBe(2);
    expect(got.crackCount).toBe(4);
    expect(got.everStood).toBe(true);
    expect(got.updatedAt).toBeGreaterThan(0);
  });

  it("resetStats clears the entry", async () => {
    const { mod } = await freshModule();
    mod.writeStats("p1", { ...mod.EMPTY_STATS, runs: 1 });
    mod.resetStats("p1");
    expect(mod.readStats("p1")).toEqual(mod.EMPTY_STATS);
  });

  it("archiveBuildVotes moves per-pile vote keys into the archive", async () => {
    const { mod, storage } = await freshModule();
    storage.setItem(
      "wordpile:build-vote:abc",
      JSON.stringify({ stacker: 5, blocks: 1, planks: 2, lastChoice: "stacker" }),
    );
    storage.setItem(
      "wordpile:build-vote:def",
      JSON.stringify({ stacker: 0, blocks: 3, planks: 0 }),
    );
    storage.setItem("unrelated:key", "x");

    const result = mod.archiveBuildVotes();
    expect(result.migrated).toBe(2);
    expect(result.totals.abc).toEqual({
      stacker: 5,
      blocks: 1,
      planks: 2,
      lastChoice: "stacker",
    });
    expect(result.totals.def).toEqual({
      stacker: 0,
      blocks: 3,
      planks: 0,
      lastChoice: undefined,
    });

    // Originals are gone; the unrelated key is untouched.
    expect(storage.getItem("wordpile:build-vote:abc")).toBeNull();
    expect(storage.getItem("wordpile:build-vote:def")).toBeNull();
    expect(storage.getItem("unrelated:key")).toBe("x");

    // Archive + flag are present.
    const archived = JSON.parse(
      storage.getItem("wordpile:build-vote-archive:v1") ?? "{}",
    );
    expect(Object.keys(archived).sort()).toEqual(["abc", "def"]);
    expect(storage.getItem("wordpile:build-vote-migrated:v1")).toBe("1");
  });

  it("archiveBuildVotes is idempotent — second run is a no-op", async () => {
    const { mod, storage } = await freshModule();
    storage.setItem(
      "wordpile:build-vote:abc",
      JSON.stringify({ stacker: 1, blocks: 0, planks: 0 }),
    );
    mod.archiveBuildVotes();
    // Drop a new vote-style key; the migration flag should keep us from
    // sweeping it again.
    storage.setItem(
      "wordpile:build-vote:zzz",
      JSON.stringify({ stacker: 9, blocks: 0, planks: 0 }),
    );
    const second = mod.archiveBuildVotes();
    expect(second.migrated).toBe(0);
    expect(storage.getItem("wordpile:build-vote:zzz")).not.toBeNull();
    expect(second.totals.abc).toBeDefined();
    expect(second.totals.zzz).toBeUndefined();
  });

  describe("mergeRunIntoStats lifecycle", () => {
    it("returns the baseline unchanged for an idle run", async () => {
      const { mod } = await freshModule();
      const baseline = { ...mod.EMPTY_STATS, runs: 4, crackCount: 7 };
      const next = mod.mergeRunIntoStats(baseline, {
        framePlaced: 0,
        trimPlaced: 0,
        cracks: 0,
        standing: false,
      });
      expect(next.runs).toBe(4);
      expect(next.crackCount).toBe(7);
      expect(next.bestPlaced).toBe(0);
      expect(next.bestFrame).toBe(0);
      expect(next.everStood).toBe(false);
    });

    it("counts a run as +1 the moment any placement or crack happens", async () => {
      const { mod } = await freshModule();
      const baseline = { ...mod.EMPTY_STATS };
      // First placement: runs jumps to 1.
      const after1 = mod.mergeRunIntoStats(baseline, {
        framePlaced: 1,
        trimPlaced: 0,
        cracks: 0,
        standing: false,
      });
      expect(after1.runs).toBe(1);
      expect(after1.bestFrame).toBe(1);
      // Second placement in the same run: still 1, not 2.
      const after2 = mod.mergeRunIntoStats(baseline, {
        framePlaced: 2,
        trimPlaced: 1,
        cracks: 1,
        standing: false,
      });
      expect(after2.runs).toBe(1);
      expect(after2.bestPlaced).toBe(3);
      expect(after2.bestFrame).toBe(2);
      expect(after2.crackCount).toBe(1);
    });

    it("handles many resets in one session: runs and cracks stay monotonic, highs are sticky, everStood latches", async () => {
      const { mod } = await freshModule();

      // Helper that mimics what BuildPage does: call merge with the
      // current run, advance the baseline on Reset, zero the run.
      let baseline: BuildStats = { ...mod.EMPTY_STATS };
      type BuildStats = ReturnType<typeof mod.mergeRunIntoStats>;
      function tick(run: {
        framePlaced: number;
        trimPlaced: number;
        cracks: number;
        standing: boolean;
      }) {
        return mod.mergeRunIntoStats(baseline, run);
      }
      function reset(merged: BuildStats) {
        baseline = { ...merged };
      }

      // --- Run 1: 2 frame, 1 trim, 1 crack, never stands.
      let merged = tick({
        framePlaced: 2,
        trimPlaced: 1,
        cracks: 1,
        standing: false,
      });
      expect(merged.runs).toBe(1);
      expect(merged.bestPlaced).toBe(3);
      expect(merged.bestFrame).toBe(2);
      expect(merged.crackCount).toBe(1);
      expect(merged.everStood).toBe(false);
      reset(merged);

      // --- Idle press of Reset (no activity): nothing should change.
      merged = tick({
        framePlaced: 0,
        trimPlaced: 0,
        cracks: 0,
        standing: false,
      });
      expect(merged).toEqual(baseline);
      reset(merged);

      // --- Run 2: 3 frame, 2 trim, 2 cracks, STANDS.
      merged = tick({
        framePlaced: 3,
        trimPlaced: 2,
        cracks: 2,
        standing: true,
      });
      expect(merged.runs).toBe(2);
      expect(merged.bestPlaced).toBe(5);
      expect(merged.bestFrame).toBe(3);
      expect(merged.crackCount).toBe(3);
      expect(merged.everStood).toBe(true);
      reset(merged);

      // --- Run 3: a smaller, weaker run. Highs must NOT regress, everStood
      // must remain true, but cracks keep accumulating.
      merged = tick({
        framePlaced: 1,
        trimPlaced: 0,
        cracks: 4,
        standing: false,
      });
      expect(merged.runs).toBe(3);
      expect(merged.bestPlaced).toBe(5);
      expect(merged.bestFrame).toBe(3);
      expect(merged.crackCount).toBe(7);
      expect(merged.everStood).toBe(true);
      reset(merged);

      // --- Run 4: idle reset again.
      merged = tick({
        framePlaced: 0,
        trimPlaced: 0,
        cracks: 0,
        standing: false,
      });
      expect(merged.runs).toBe(3);
      expect(merged.crackCount).toBe(7);
      expect(merged.everStood).toBe(true);
    });
  });

  it("archiveBuildVotes survives malformed entries", async () => {
    const { mod, storage } = await freshModule();
    storage.setItem("wordpile:build-vote:bad", "not-json");
    storage.setItem(
      "wordpile:build-vote:ok",
      JSON.stringify({ stacker: 2, blocks: 0, planks: 0 }),
    );
    const result = mod.archiveBuildVotes();
    expect(result.migrated).toBe(1);
    expect(result.totals.ok.stacker).toBe(2);
    expect(result.totals.bad).toBeUndefined();
    // Both keys should still get cleaned up.
    expect(storage.getItem("wordpile:build-vote:bad")).toBeNull();
    expect(storage.getItem("wordpile:build-vote:ok")).toBeNull();
  });
});

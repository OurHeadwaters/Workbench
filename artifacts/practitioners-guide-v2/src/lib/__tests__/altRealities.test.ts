import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import {
  PGV2_ALT_REALITIES_KEY,
  METRICS,
  buildDefaultState,
  loadAltRealityState,
  saveAltRealityState,
  buildAltRealityFromV3,
  addAltReality,
  removeAltReality,
  renameAltReality,
  setAltRow,
  readV3Value,
  readAltValue,
} from "../altRealities";
import { SCENARIOS } from "@/data/scenarios";

/**
 * Operating-framework workspace tests.
 *
 * Covers:
 *   - V4 seed on first load
 *   - localStorage round-trip
 *   - parse-failure / structural-failure fallbacks
 *   - per-row edit + lock toggle
 *   - add / rename / remove tabs
 *   - V3 anchor reads
 */

/**
 * Minimal in-memory localStorage polyfill so the suite can run under
 * the project's `node` vitest environment (no jsdom). Only the methods
 * `altRealities.ts` actually calls are implemented.
 */
function installLocalStoragePolyfill() {
  const store = new Map<string, string>();
  const ls = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, String(v));
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  };
  // The lib does `typeof window !== "undefined" && window.localStorage` checks,
  // so we install a window object that only carries localStorage.
  (globalThis as unknown as { window: { localStorage: typeof ls } }).window = {
    localStorage: ls,
  };
}

beforeAll(() => {
  installLocalStoragePolyfill();
});

beforeEach(() => {
  (globalThis as unknown as { window: { localStorage: Storage } }).window.localStorage.clear();
});

describe("buildDefaultState — V4 seed", () => {
  it("seeds exactly one alt reality, named V4 — Right-priced, marked active", () => {
    const state = buildDefaultState();
    expect(state.realities).toHaveLength(1);
    expect(state.realities[0].name).toContain("V4");
    expect(state.realities[0].name).toContain("Right-priced");
    expect(state.activeId).toBe(state.realities[0].id);
  });

  it("populates every metric row from SCENARIO_V4 with locked=true", () => {
    const state = buildDefaultState();
    const reality = state.realities[0];
    for (const m of METRICS) {
      const row = reality.rows[m.key];
      expect(row).toBeDefined();
      expect(row!.value).toBe(m.fromScenario(SCENARIOS.v4));
      expect(row!.locked).toBe(true);
    }
  });
});

describe("loadAltRealityState — fallbacks", () => {
  it("returns the default seed when localStorage is empty", () => {
    const loaded = loadAltRealityState();
    expect(loaded.realities).toHaveLength(1);
    expect(loaded.realities[0].name).toContain("V4");
  });

  it("returns the default seed when the stored value is malformed JSON", () => {
    window.localStorage.setItem(PGV2_ALT_REALITIES_KEY, "{not json");
    const loaded = loadAltRealityState();
    expect(loaded.realities[0].name).toContain("V4");
  });

  it("returns the default seed when the stored value is structurally invalid", () => {
    window.localStorage.setItem(
      PGV2_ALT_REALITIES_KEY,
      JSON.stringify({ realities: "not an array" }),
    );
    const loaded = loadAltRealityState();
    expect(loaded.realities[0].name).toContain("V4");
  });

  it("returns stored state when valid", () => {
    const saved = buildDefaultState();
    saved.realities[0].name = "My custom turn";
    saveAltRealityState(saved);
    const loaded = loadAltRealityState();
    expect(loaded.realities[0].name).toBe("My custom turn");
  });
});

describe("saveAltRealityState — persistence", () => {
  it("writes JSON under PGV2_ALT_REALITIES_KEY", () => {
    const state = buildDefaultState();
    saveAltRealityState(state);
    const raw = window.localStorage.getItem(PGV2_ALT_REALITIES_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.realities).toHaveLength(1);
  });
});

describe("buildAltRealityFromV3 — fresh tab seeded with V3 anchors", () => {
  it("starts every row at the V3 value, unlocked, so Δ-vs-V3 reads zero everywhere", () => {
    const reality = buildAltRealityFromV3("My new turn");
    expect(reality.name).toBe("My new turn");
    for (const m of METRICS) {
      const row = reality.rows[m.key];
      expect(row).toBeDefined();
      expect(row!.value).toBe(m.fromScenario(SCENARIOS.v3));
      expect(row!.locked).toBe(false);
    }
  });

  it("issues a unique id for each new reality", () => {
    const a = buildAltRealityFromV3("A");
    const b = buildAltRealityFromV3("B");
    expect(a.id).not.toBe(b.id);
  });
});

describe("addAltReality / removeAltReality / renameAltReality", () => {
  it("addAltReality appends a tab and makes it active", () => {
    const start = buildDefaultState();
    const next = addAltReality(start, "Higher fee turn");
    expect(next.realities).toHaveLength(2);
    expect(next.realities[1].name).toBe("Higher fee turn");
    expect(next.activeId).toBe(next.realities[1].id);
  });

  it("removeAltReality drops the tab; activeId falls back to the next reality", () => {
    let state = buildDefaultState();
    state = addAltReality(state, "Second");
    const secondId = state.activeId!;
    state = removeAltReality(state, secondId);
    expect(state.realities).toHaveLength(1);
    expect(state.realities.find((r) => r.id === secondId)).toBeUndefined();
    // Active id falls back to the remaining reality (the V4 seed).
    expect(state.activeId).toBe(state.realities[0].id);
  });

  it("removeAltReality on the last tab leaves activeId=null", () => {
    let state = buildDefaultState();
    const onlyId = state.realities[0].id;
    state = removeAltReality(state, onlyId);
    expect(state.realities).toHaveLength(0);
    expect(state.activeId).toBeNull();
  });

  it("renameAltReality updates the name in place; whitespace-only names are no-ops", () => {
    let state = buildDefaultState();
    const id = state.realities[0].id;
    state = renameAltReality(state, id, "Founder's chosen turn");
    expect(state.realities[0].name).toBe("Founder's chosen turn");
    state = renameAltReality(state, id, "   ");
    expect(state.realities[0].name).toBe("Founder's chosen turn");
  });
});

describe("setAltRow — per-row edit + lock toggle", () => {
  it("updates a row's value without touching its lock", () => {
    let state = buildDefaultState();
    const id = state.realities[0].id;
    state = setAltRow(state, id, "agencyFee", { value: 100000 });
    const row = state.realities[0].rows["agencyFee"];
    expect(row!.value).toBe(100000);
    expect(row!.locked).toBe(true); // V4 seed is locked
  });

  it("toggles lock without touching the value", () => {
    let state = buildDefaultState();
    const id = state.realities[0].id;
    state = setAltRow(state, id, "agencyFee", { locked: false });
    const row = state.realities[0].rows["agencyFee"];
    expect(row!.locked).toBe(false);
    expect(row!.value).toBe(SCENARIOS.v4.contracts.agency.fee);
  });

  it("creates the row from V3 when previously sparse", () => {
    // Hand-craft a sparse reality with no rows persisted.
    const state = {
      realities: [{ id: "x", name: "x", rows: {} }],
      activeId: "x",
    };
    const next = setAltRow(state, "x", "agencyPayroll", { value: 60000 });
    const row = next.realities[0].rows["agencyPayroll"];
    expect(row!.value).toBe(60000);
    expect(row!.locked).toBe(false);
  });

  it("ignores updates to a non-existent reality id", () => {
    let state = buildDefaultState();
    state = setAltRow(state, "nope", "agencyFee", { value: 999999 });
    expect(state.realities[0].rows["agencyFee"]!.value).toBe(
      SCENARIOS.v4.contracts.agency.fee,
    );
  });
});

describe("readV3Value / readAltValue", () => {
  it("readV3Value pulls from SCENARIO_V3", () => {
    expect(readV3Value("agencyFee")).toBe(SCENARIOS.v3.contracts.agency.fee);
    expect(readV3Value("agencyPayroll")).toBe(SCENARIOS.v3.contracts.agency.payrollTotal);
  });

  it("readAltValue returns the row value when present", () => {
    const reality = { id: "x", name: "x", rows: { agencyFee: { value: 99999, locked: false } } };
    expect(readAltValue(reality, "agencyFee")).toBe(99999);
  });

  it("readAltValue falls back to V3 when the row is missing", () => {
    const reality = { id: "x", name: "x", rows: {} };
    expect(readAltValue(reality, "agencyFee")).toBe(SCENARIOS.v3.contracts.agency.fee);
  });
});

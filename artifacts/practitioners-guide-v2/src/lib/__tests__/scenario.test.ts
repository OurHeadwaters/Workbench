import { describe, it, expect } from "vitest";
import { migrateStoredScenario } from "../scenario";
import { DEFAULT_SCENARIO_ID } from "@/data/scenarios";

/**
 * Storage migration contract for ScenarioProvider.
 *
 * After V6 was promoted to the default on 2026-05-02 (hourly subcontract):
 *  - Legacy `v2` choice → migrate to the locked default (V6).
 *  - `v3` choice (workspace anchor) → migrate to the locked default (V6).
 *    V3 is no longer a user-facing toggle target.
 *  - `v4`, `v5`, and `v6` are live ids in the scenario set — pass through
 *    verbatim. (v4 may not be in the toggle but is a valid workspace id.)
 *  - Empty / unknown / malformed → null (provider falls back to default).
 */
describe("migrateStoredScenario — V6 default migration matrix", () => {
  it("migrates a legacy v2 choice to the locked default scenario (V6)", () => {
    expect(migrateStoredScenario("v2")).toBe(DEFAULT_SCENARIO_ID);
    expect(DEFAULT_SCENARIO_ID).toBe("v6");
  });

  it("migrates a v3 choice to the locked default scenario (V6) — V3 is workspace-only", () => {
    expect(migrateStoredScenario("v3")).toBe(DEFAULT_SCENARIO_ID);
    expect(migrateStoredScenario("v3")).toBe("v6");
  });

  it("passes the live toggle ids through verbatim (v4 + v5 + v6)", () => {
    expect(migrateStoredScenario("v4")).toBe("v4");
    expect(migrateStoredScenario("v5")).toBe("v5");
    expect(migrateStoredScenario("v6")).toBe("v6");
  });

  it("returns null for null/missing storage (brand-new visitor)", () => {
    expect(migrateStoredScenario(null)).toBeNull();
  });

  it("returns null for legacy/unknown values (forward-compat with future ids)", () => {
    expect(migrateStoredScenario("v1")).toBeNull();
    expect(migrateStoredScenario("V2")).toBeNull(); // case-sensitive on purpose
    expect(migrateStoredScenario("V3")).toBeNull();
    expect(migrateStoredScenario("V5")).toBeNull();
    expect(migrateStoredScenario("V6")).toBeNull();
    expect(migrateStoredScenario("")).toBeNull();
    expect(migrateStoredScenario("garbage")).toBeNull();
  });
});

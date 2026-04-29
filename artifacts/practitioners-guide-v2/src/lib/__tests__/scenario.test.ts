import { describe, it, expect } from "vitest";
import { migrateStoredScenario } from "../scenario";
import { DEFAULT_SCENARIO_ID } from "@/data/scenarios";

/**
 * Storage migration contract for ScenarioProvider.
 *
 * After V5 was promoted to the default on 2026-04-29 (V3 dropped from the
 * user-facing toggle but retained in SCENARIOS for migration / Compare
 * anchor / alt-realities seed), the migration matrix has to keep existing
 * readers from getting bounced out of the app:
 *  - Legacy `v2` choice → migrate to the locked default (V5).
 *  - `v3` choice (pre-2026-04-29 default) → migrate to the locked default
 *    (V5) so anyone with a persisted V3 choice lands on the current
 *    default rather than a workspace-only id.
 *  - `v4` and `v5` are the live ids surfaced by the toggle — pass through
 *    verbatim.
 *  - Empty / unknown / malformed → null (provider falls back to default).
 */
describe("migrateStoredScenario — V5 default migration matrix", () => {
  it("migrates a legacy v2 choice to the locked default scenario (V5)", () => {
    expect(migrateStoredScenario("v2")).toBe(DEFAULT_SCENARIO_ID);
    expect(DEFAULT_SCENARIO_ID).toBe("v5");
  });

  it("migrates a pre-2026-04-29 v3 choice to the locked default scenario (V5)", () => {
    expect(migrateStoredScenario("v3")).toBe(DEFAULT_SCENARIO_ID);
    expect(migrateStoredScenario("v3")).toBe("v5");
  });

  it("passes the live toggle ids through verbatim (v4 + v5)", () => {
    expect(migrateStoredScenario("v4")).toBe("v4");
    expect(migrateStoredScenario("v5")).toBe("v5");
  });

  it("returns null for null/missing storage (brand-new visitor)", () => {
    expect(migrateStoredScenario(null)).toBeNull();
  });

  it("returns null for legacy/unknown values (forward-compat with future ids)", () => {
    expect(migrateStoredScenario("v1")).toBeNull();
    expect(migrateStoredScenario("v6")).toBeNull();
    expect(migrateStoredScenario("V2")).toBeNull(); // case-sensitive on purpose
    expect(migrateStoredScenario("V3")).toBeNull();
    expect(migrateStoredScenario("V5")).toBeNull();
    expect(migrateStoredScenario("")).toBeNull();
    expect(migrateStoredScenario("garbage")).toBeNull();
  });
});

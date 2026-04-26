import { describe, it, expect } from "vitest";
import { migrateStoredScenario } from "../scenario";
import { DEFAULT_SCENARIO_ID } from "@/data/scenarios";

/**
 * Storage migration contract for ScenarioProvider.
 *
 * After V2 was retired on 2026-04-26, the migration matrix has to keep
 * existing readers from getting bounced out of the app:
 *  - Legacy `v2` choice → migrate to the locked default (V3).
 *  - `v3` and `v4` are the live ids — pass through verbatim.
 *  - Empty / unknown / malformed → null (provider falls back to default).
 */
describe("migrateStoredScenario — V2 retirement migration", () => {
  it("migrates a legacy v2 choice to the locked default scenario (V3)", () => {
    expect(migrateStoredScenario("v2")).toBe(DEFAULT_SCENARIO_ID);
    expect(DEFAULT_SCENARIO_ID).toBe("v3");
  });

  it("passes the live ids through verbatim", () => {
    expect(migrateStoredScenario("v3")).toBe("v3");
    expect(migrateStoredScenario("v4")).toBe("v4");
  });

  it("returns null for null/missing storage (brand-new visitor)", () => {
    expect(migrateStoredScenario(null)).toBeNull();
  });

  it("returns null for legacy/unknown values (forward-compat with future ids)", () => {
    expect(migrateStoredScenario("v1")).toBeNull();
    expect(migrateStoredScenario("v5")).toBeNull();
    expect(migrateStoredScenario("V2")).toBeNull(); // case-sensitive on purpose
    expect(migrateStoredScenario("V3")).toBeNull();
    expect(migrateStoredScenario("")).toBeNull();
    expect(migrateStoredScenario("garbage")).toBeNull();
  });
});

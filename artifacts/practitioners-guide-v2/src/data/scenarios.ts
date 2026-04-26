import type { Scenario, ScenarioId } from "./types";
import { SCENARIO_V3 } from "./v3";
import { SCENARIO_V4 } from "./v4";

/**
 * Live scenario set.
 *
 * V3 is the locked default operating framework. V4 is a real, locked alternative
 * the reader can switch to via the global toggle, AND ships pre-seeded as the
 * first alternative-reality tab on the Compare page so the founder can model
 * variants without changing the global default.
 *
 * V2 (full team, $115k/mo) was retired on 2026-04-26. The history of V2 lives
 * as a "How we got here" milestone note on the Compare page — the data is no
 * longer in the live scenario set.
 */
export const SCENARIOS: Record<ScenarioId, Scenario> = {
  v3: SCENARIO_V3,
  v4: SCENARIO_V4,
};

export const SCENARIO_ORDER: ScenarioId[] = ["v3", "v4"];

export const DEFAULT_SCENARIO_ID: ScenarioId = "v3";

export function getScenario(id: ScenarioId): Scenario {
  return SCENARIOS[id];
}

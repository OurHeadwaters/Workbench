import type { Scenario, ScenarioId } from "./types";
import { SCENARIO_V2 } from "./v2";
import { SCENARIO_V3 } from "./v3";
import { SCENARIO_V4 } from "./v4";

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  v2: SCENARIO_V2,
  v3: SCENARIO_V3,
  v4: SCENARIO_V4,
};

export const SCENARIO_ORDER: ScenarioId[] = ["v2", "v3", "v4"];

export function getScenario(id: ScenarioId): Scenario {
  return SCENARIOS[id];
}

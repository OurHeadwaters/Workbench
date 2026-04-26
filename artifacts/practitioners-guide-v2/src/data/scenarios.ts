import type { Scenario, ScenarioId } from "./types";
import { SCENARIO_V2 } from "./v2";
import { SCENARIO_V3 } from "./v3";

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  v2: SCENARIO_V2,
  v3: SCENARIO_V3,
};

export const SCENARIO_ORDER: ScenarioId[] = ["v2", "v3"];

export function getScenario(id: ScenarioId): Scenario {
  return SCENARIOS[id];
}

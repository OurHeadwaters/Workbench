import type { Scenario, ScenarioId } from "./types";
import { SCENARIO_V3 } from "./v3";
import { SCENARIO_V4 } from "./v4";
import { SCENARIO_V5 } from "./v5";
import { SCENARIO_V6 } from "./v6";
import { SCENARIO_V7 } from "./v7";

/**
 * Live scenario set.
 *
 * V7 is the locked default operating framework as of 2026-05-02 — the
 * updated hourly subcontracting model (Bobbie $175/hr, Tyler $70/hr RFF sub)
 * applied to Northern Band. V6 ($150/hr Bobbie, $70/hr Tyler) is preserved as
 * a historical baseline. V5 ($90k/mo Codetry archetype) is preserved as a
 * further historical baseline. V4 (Right-priced) is the earlier right-priced
 * baseline. V3 (Lean team) is the workspace anchor.
 *
 * The user-facing scenario toggle exposes V7 ("Current"), V6 ("Prior"),
 * and V5 ("Historical") — V3 is not surfaced in the toggle but remains
 * available in SCENARIOS so workspace-level reads (Compare anchor,
 * alt-realities seed) continue to work without regression.
 *
 * V2 (full team, $115k/mo) was retired on 2026-04-26.
 */
export const SCENARIOS: Record<ScenarioId, Scenario> = {
  v3: SCENARIO_V3,
  v4: SCENARIO_V4,
  v5: SCENARIO_V5,
  v6: SCENARIO_V6,
  v7: SCENARIO_V7,
};

/**
 * Scenarios surfaced in the user-facing scenario toggle, in display order.
 * V3 is intentionally not in this list — see the file-level comment.
 */
export const SCENARIO_ORDER: ScenarioId[] = ["v7"];

export const DEFAULT_SCENARIO_ID: ScenarioId = "v7";

export function getScenario(id: ScenarioId): Scenario {
  return SCENARIOS[id];
}

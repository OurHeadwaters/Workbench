import type { Scenario, ScenarioId } from "./types";
import { SCENARIO_V3 } from "./v3";
import { SCENARIO_V4 } from "./v4";
import { SCENARIO_V5 } from "./v5";

/**
 * Live scenario set.
 *
 * V5 is the locked default operating framework as of 2026-04-29 — the
 * Codetry-archetype baseline applied to Deer Lake. V4 (Right-priced) is
 * preserved as the historical right-priced baseline that V5's renegotiation
 * triggers step back up toward; V3 (Lean team) is preserved as a deeper
 * historical baseline.
 *
 * The user-facing scenario toggle exposes V5 ("Current") and V4 ("Prior")
 * — V3 is no longer surfaced in the toggle but remains available in
 * SCENARIOS so that workspace-level reads (Compare anchor, alt-realities
 * seed, persisted ScenarioToggle state) continue to work without
 * regression. The V3 → V4 → V5 lineage is told on the Archetypes page.
 *
 * V2 (full team, $115k/mo) was retired on 2026-04-26. The history of V2 lives
 * as a "How we got here" milestone note on the Compare page — the data is no
 * longer in the live scenario set.
 */
export const SCENARIOS: Record<ScenarioId, Scenario> = {
  v3: SCENARIO_V3,
  v4: SCENARIO_V4,
  v5: SCENARIO_V5,
};

/**
 * Scenarios surfaced in the user-facing scenario toggle, in display order.
 * V3 is intentionally not in this list — see the file-level comment.
 */
export const SCENARIO_ORDER: ScenarioId[] = ["v5", "v4"];

export const DEFAULT_SCENARIO_ID: ScenarioId = "v5";

export function getScenario(id: ScenarioId): Scenario {
  return SCENARIOS[id];
}

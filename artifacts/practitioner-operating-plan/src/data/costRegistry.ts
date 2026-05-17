/**
 * costRegistry.ts
 *
 * Phase cost summary — used by the Cost Review tool and any slides
 * that show the engagement cost breakdown.
 *
 * All values derived from budgetScenarios.ts. Edit there, not here.
 */

import { PHASES, PHASE_COSTS, calcPhaseCost, type PhaseCost } from "@/data/budgetScenarios";

export type { PhaseCost };

/** All four phases with derived cost data. */
export const PHASE_COST_REGISTRY: PhaseCost[] = PHASE_COSTS;

/** Look up a phase cost entry by phase id (e.g. "phase-1"). */
export function getPhaseCost(id: string): PhaseCost | undefined {
  return PHASE_COST_REGISTRY.find((p) => p.phase.id === id);
}

export { PHASES, PHASE_COSTS, calcPhaseCost };

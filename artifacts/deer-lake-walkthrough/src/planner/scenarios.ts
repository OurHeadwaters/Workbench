import type { Anchors } from "./dates";

/**
 * Three named scenarios for the Deer Lake project calendar. Each is a
 * complete set of anchor dates that the planner can snap to. They
 * represent the three honest cases — best, expected, and what-if.
 */

export type ScenarioId = "optimistic" | "realistic" | "slippage";

export type Scenario = {
  id: ScenarioId;
  label: string;
  caption: string;
  anchors: Anchors;
};

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  optimistic: {
    id: "optimistic",
    label: "Optimistic",
    caption:
      "Pilot starts on a handshake. ISC fast-tracks. Doors open fall 2027.",
    anchors: {
      contractOneStart: "2026-04-27",
      coldChainPilotStart: "2026-05-15",
      lfifIntake: "2026-09-15",
      councilDecision: "2026-09-30",
      iscDecision: "2027-03-15",
    },
  },
  realistic: {
    id: "realistic",
    label: "Realistic",
    caption:
      "Standard cycles. LFIF mid-fall 2026. ISC takes nine months. Doors early 2028.",
    anchors: {
      contractOneStart: "2026-04-27",
      coldChainPilotStart: "2026-06-01",
      lfifIntake: "2026-10-15",
      councilDecision: "2026-11-15",
      iscDecision: "2027-07-15",
    },
  },
  slippage: {
    id: "slippage",
    label: "Slippage",
    caption:
      "LFIF intake misses, re-stack for next year. Doors push to early 2029.",
    anchors: {
      contractOneStart: "2026-04-27",
      coldChainPilotStart: "2026-06-15",
      lfifIntake: "2027-10-15",
      councilDecision: "2027-11-15",
      iscDecision: "2028-07-15",
    },
  },
};

export const SCENARIO_ORDER: ScenarioId[] = [
  "optimistic",
  "realistic",
  "slippage",
];

export function scenarioFor(id: ScenarioId): Scenario {
  return SCENARIOS[id];
}

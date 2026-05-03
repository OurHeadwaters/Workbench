import type { Anchors, ScenarioMode } from "./dates";

export type ScenarioId = "optimistic" | "realistic" | "slippage" | "selfFund";

export type Scenario = {
  id: ScenarioId;
  label: string;
  caption: string;
  mode: ScenarioMode;
  anchors: Anchors;
};

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  optimistic: {
    id: "optimistic",
    label: "Optimistic",
    mode: "grants",
    caption: "Pilot starts on a handshake. ISC fast-tracks. Doors open fall 2027.",
    anchors: {
      contractOneStart: "2026-04-27",
      coldChainPilotStart: "2026-05-15",
      lfifIntake: "2026-09-15",
      councilDecision: "2026-09-30",
      iscDecision: "2027-03-15",
      truckLfifIntake: "2026-09-15",
    },
  },
  realistic: {
    id: "realistic",
    label: "Realistic",
    mode: "grants",
    caption: "Standard cycles. LFIF mid-fall 2026. ISC takes nine months. Doors early 2028.",
    anchors: {
      contractOneStart: "2026-04-27",
      coldChainPilotStart: "2026-06-01",
      lfifIntake: "2026-10-15",
      councilDecision: "2026-11-15",
      iscDecision: "2027-07-15",
      truckLfifIntake: "2026-10-15",
    },
  },
  slippage: {
    id: "slippage",
    label: "Slippage",
    mode: "grants",
    caption: "LFIF intake misses, re-stack for next year. Doors push to early 2029.",
    anchors: {
      contractOneStart: "2026-04-27",
      coldChainPilotStart: "2026-06-15",
      lfifIntake: "2027-10-15",
      councilDecision: "2027-11-15",
      iscDecision: "2028-07-15",
      truckLfifIntake: "2027-10-15",
    },
  },
  selfFund: {
    id: "selfFund",
    label: "Self-fund",
    mode: "self-fund",
    caption: "Reserve capital pays for the store. Only grant: the 807 truck. Doors open spring 2027.",
    anchors: {
      contractOneStart: "2026-04-27",
      coldChainPilotStart: "2026-06-01",
      councilDecision: "2026-08-15",
      truckLfifIntake: "2026-10-15",
      lfifIntake: "2026-10-15",
      iscDecision: "2027-07-15",
    },
  },
};

export const SCENARIO_ORDER: ScenarioId[] = [
  "optimistic",
  "realistic",
  "slippage",
  "selfFund",
];

const VALID_SCENARIO_IDS = new Set<ScenarioId>(SCENARIO_ORDER);

export function isScenarioId(value: unknown): value is ScenarioId {
  return typeof value === "string" && VALID_SCENARIO_IDS.has(value as ScenarioId);
}

export function scenarioFor(id: ScenarioId): Scenario {
  return SCENARIOS[id];
}

import {
  type Anchors,
  type ScenarioMode,
  DEFAULT_TRUCK_LFIF_INTAKE,
} from "./dates";
import {
  SCENARIOS,
  isScenarioId,
  type ScenarioId,
} from "./scenarios";

/**
 * localStorage namespace `dlpp:v1` keeps the planner's state local to the
 * device. Bobbie can save the current anchor set as "her version" and
 * pull it back up on the next visit. Quietly tolerant of bad/stale data
 * and of older saved state predating the self-fund mode.
 */
const KEY_SAVED = "dlpp:v1:saved";
const KEY_LAST_SCENARIO = "dlpp:v1:lastScenario";

export type SavedState = {
  scenarioId: ScenarioId | null;
  mode: ScenarioMode;
  anchors: Anchors;
  savedAt: string;
};

function normalizeAnchors(raw: Partial<Anchors> | undefined): Anchors | null {
  if (!raw || typeof raw !== "object") return null;
  if (
    !raw.contractOneStart ||
    !raw.coldChainPilotStart ||
    !raw.lfifIntake ||
    !raw.councilDecision ||
    !raw.iscDecision
  ) {
    return null;
  }
  return {
    contractOneStart: raw.contractOneStart,
    coldChainPilotStart: raw.coldChainPilotStart,
    lfifIntake: raw.lfifIntake,
    councilDecision: raw.councilDecision,
    iscDecision: raw.iscDecision,
    // Older saves don't have truckLfifIntake — fall back to the default
    // Fall-2026 window so the self-fund derive() math still works if the
    // user picks Self-fund after restoring a grants-mode save.
    truckLfifIntake: raw.truckLfifIntake ?? DEFAULT_TRUCK_LFIF_INTAKE,
  };
}

function inferMode(
  rawMode: unknown,
  scenarioId: ScenarioId | null,
): ScenarioMode {
  if (rawMode === "grants" || rawMode === "self-fund") return rawMode;
  // Older saves predate the mode field — infer from the scenarioId.
  if (scenarioId && SCENARIOS[scenarioId]) return SCENARIOS[scenarioId].mode;
  return "grants";
}

export function loadSaved(): SavedState | null {
  try {
    const raw = localStorage.getItem(KEY_SAVED);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    const anchors = normalizeAnchors(parsed?.anchors);
    if (!anchors) return null;
    const scenarioId = isScenarioId(parsed?.scenarioId)
      ? parsed.scenarioId
      : null;
    const mode = inferMode(parsed?.mode, scenarioId);
    return {
      scenarioId,
      mode,
      anchors,
      savedAt: parsed?.savedAt ?? "",
    };
  } catch {
    return null;
  }
}

export function writeSaved(state: SavedState): void {
  try {
    localStorage.setItem(KEY_SAVED, JSON.stringify(state));
  } catch {
    // localStorage unavailable — silently no-op.
  }
}

export function clearSaved(): void {
  try {
    localStorage.removeItem(KEY_SAVED);
  } catch {
    /* no-op */
  }
}

export function loadLastScenario(): ScenarioId | null {
  try {
    const raw = localStorage.getItem(KEY_LAST_SCENARIO);
    return isScenarioId(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeLastScenario(id: ScenarioId): void {
  try {
    localStorage.setItem(KEY_LAST_SCENARIO, id);
  } catch {
    /* no-op */
  }
}

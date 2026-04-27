import type { Anchors } from "./dates";
import type { ScenarioId } from "./scenarios";

/**
 * localStorage namespace `dlpp:v1` keeps the planner's state local to the
 * device. Bobbie can save the current anchor set as "her version" and
 * pull it back up on the next visit. Quietly tolerant of bad/stale data.
 */
const KEY_SAVED = "dlpp:v1:saved";
const KEY_LAST_SCENARIO = "dlpp:v1:lastScenario";

export type SavedState = {
  scenarioId: ScenarioId | null;
  anchors: Anchors;
  savedAt: string;
};

export function loadSaved(): SavedState | null {
  try {
    const raw = localStorage.getItem(KEY_SAVED);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedState;
    if (!parsed?.anchors) return null;
    return parsed;
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
    if (raw === "optimistic" || raw === "realistic" || raw === "slippage") {
      return raw;
    }
    return null;
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

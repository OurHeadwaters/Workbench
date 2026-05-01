import { useState } from "react";
import { derive, addDays, fmtShort, type ScenarioMode } from "./dates";
import { SCENARIOS } from "./scenarios";
import { loadSaved, loadLastScenario } from "./storage";

export type LockDates = {
  preFrame: string;
  preElectrical: string;
  preFinish: string;
  scenarioLabel: string;
  mode: ScenarioMode;
};

/**
 * Read the current planner state from localStorage and derive the three
 * phase-lock gate dates from it.
 *
 * Priority order:
 *   1. loadLastScenario() — updated immediately every time the user
 *      clicks a scenario pill in the planner (writeLastScenario is
 *      called in a useEffect on scenarioId). This is always current
 *      with scenario toggles, even before the user hits Save.
 *   2. loadSaved() — only written when the user explicitly presses Save.
 *      Used as fallback when no named scenario has ever been picked
 *      (e.g. the user landed on the planner, edited anchors directly,
 *      and saved a custom plan).
 *   3. "realistic" — hard default if localStorage has nothing.
 *
 * Returns formatted display strings alongside ISO dates so callers can
 * render either form without re-computing.
 */
export function usePlannerLockDates(): LockDates & {
  preFrameFmt: string;
  preElectricalFmt: string;
  preFinishFmt: string;
} {
  const [dates] = useState(() => {
    let anchors, mode: ScenarioMode, scenarioLabel: string;

    // 1. Last actively-selected named scenario — always tracks toggles.
    const lastId = loadLastScenario();
    if (lastId && SCENARIOS[lastId]) {
      const s = SCENARIOS[lastId];
      anchors = s.anchors;
      mode = s.mode;
      scenarioLabel = s.label;
    } else {
      // 2. Saved state (custom/dirty plan the user explicitly saved).
      const saved = loadSaved();
      if (saved) {
        anchors = saved.anchors;
        mode = saved.mode;
        scenarioLabel =
          saved.scenarioId
            ? (SCENARIOS[saved.scenarioId]?.label ?? "Custom")
            : "Custom";
      } else {
        // 3. Hard default.
        const s = SCENARIOS["realistic"];
        anchors = s.anchors;
        mode = s.mode;
        scenarioLabel = s.label;
      }
    }

    const d = derive(anchors, mode);

    const preFrame = d.buildM1;
    const preElectrical = addDays(d.buildM1, 45);
    const preFinish = d.buildSoftOpen;

    return {
      preFrame,
      preElectrical,
      preFinish,
      preFrameFmt: fmtShort(preFrame),
      preElectricalFmt: fmtShort(preElectrical),
      preFinishFmt: fmtShort(preFinish),
      scenarioLabel,
      mode,
    };
  });

  return dates;
}

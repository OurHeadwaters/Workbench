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

export function usePlannerLockDates(): LockDates & {
  preFrameFmt: string;
  preElectricalFmt: string;
  preFinishFmt: string;
} {
  const [dates] = useState(() => {
    let anchors, mode: ScenarioMode, scenarioLabel: string;

    const lastId = loadLastScenario();
    if (lastId && SCENARIOS[lastId]) {
      const s = SCENARIOS[lastId];
      anchors = s.anchors;
      mode = s.mode;
      scenarioLabel = s.label;
    } else {
      const saved = loadSaved();
      if (saved) {
        anchors = saved.anchors;
        mode = saved.mode;
        scenarioLabel = saved.scenarioId
          ? (SCENARIOS[saved.scenarioId]?.label ?? "Custom")
          : "Custom";
      } else {
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

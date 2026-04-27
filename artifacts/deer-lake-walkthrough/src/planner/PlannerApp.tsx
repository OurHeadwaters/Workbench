import { useEffect, useMemo, useState } from "react";
import { PlannerShell } from "./PlannerShell";
import { TodayCard } from "./TodayCard";
import { ScenarioPicker } from "./ScenarioPicker";
import { PhaseGantt, type GanttBar, type GanttGate } from "./PhaseGantt";
import { DatePegs } from "./DatePegs";
import { KeyDates } from "./KeyDates";
import { OffRamp } from "./OffRamp";
import {
  type AnchorKey,
  type Anchors,
  TODAY,
  addDays,
  derive,
} from "./dates";
import {
  SCENARIOS,
  type ScenarioId,
} from "./scenarios";
import {
  loadLastScenario,
  loadSaved,
  writeLastScenario,
  writeSaved,
} from "./storage";

/**
 * Top-level planner screen. Holds the anchor state, derives every
 * downstream date, builds the two Gantt strips, and wires up the picker
 * + save flow.
 */
export default function PlannerApp() {
  // Initial state — saved version wins, then last-picked scenario, then
  // the realistic default.
  const initial = useMemo(() => {
    const saved = loadSaved();
    if (saved) {
      return {
        anchors: saved.anchors,
        scenarioId: saved.scenarioId,
        savedAt: saved.savedAt,
      };
    }
    const last = loadLastScenario() ?? "realistic";
    return {
      anchors: SCENARIOS[last].anchors,
      scenarioId: last,
      savedAt: null as string | null,
    };
  }, []);

  const [anchors, setAnchors] = useState<Anchors>(initial.anchors);
  const [scenarioId, setScenarioId] = useState<ScenarioId | null>(
    initial.scenarioId,
  );
  const [savedAt, setSavedAt] = useState<string | null>(initial.savedAt);
  const [savedAnchors, setSavedAnchors] = useState<Anchors>(initial.anchors);

  const derived = useMemo(() => derive(anchors), [anchors]);

  const isDirty = useMemo(
    () => JSON.stringify(anchors) !== JSON.stringify(savedAnchors),
    [anchors, savedAnchors],
  );

  useEffect(() => {
    if (scenarioId) writeLastScenario(scenarioId);
  }, [scenarioId]);

  function pickScenario(id: ScenarioId) {
    setScenarioId(id);
    setAnchors(SCENARIOS[id].anchors);
  }

  function updateAnchor(key: AnchorKey, value: string) {
    if (!value) return;
    setAnchors((prev) => ({ ...prev, [key]: value }));
    setScenarioId(null);
  }

  function save() {
    // Real wall-clock so the user sees a true save-time, not a planning
    // baseline. TODAY (the constant) is only for project-calendar math.
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const stamp = `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
    writeSaved({
      scenarioId,
      anchors,
      savedAt: stamp,
    });
    setSavedAt(stamp);
    setSavedAnchors(anchors);
  }

  // Phase 1 range — from contract one start to the funding-secured
  // trigger + a 30-day pad so the trigger pin doesn't sit on the edge.
  const phase1Start = anchors.contractOneStart;
  const phase1End = addDays(derived.fundingSecured, 30);

  const phase1Bars: GanttBar[] = [
    {
      label: "Co-design with community",
      start: anchors.contractOneStart,
      end: derived.fundingSecured,
      tone: "primary",
    },
    {
      label: "Cold-chain pilot (90-day data)",
      start: anchors.coldChainPilotStart,
      end: derived.pilotData90,
      tone: "warm",
    },
    {
      label: "Application prep + letters of intent",
      start: addDays(anchors.contractOneStart, 60),
      end: anchors.lfifIntake,
      tone: "tan",
    },
    {
      label: "NNC enrolment readiness (POS, SKU, baseline)",
      start: addDays(anchors.contractOneStart, 30),
      end: addDays(anchors.lfifIntake, 60),
      tone: "tan",
    },
    {
      label: "Grant decision windows",
      start: anchors.lfifIntake,
      end: derived.fundingSecured,
      tone: "primary",
    },
  ];

  const phase1Gates: GanttGate[] = [
    {
      label: "LFIF intake — file",
      date: anchors.lfifIntake,
      tone: "warm",
    },
    {
      label: "Council commits",
      date: anchors.councilDecision,
      tone: "warm",
    },
    {
      label: "ISC decision",
      date: anchors.iscDecision,
      tone: "primary",
    },
    {
      label: "Funding-secured trigger",
      date: derived.fundingSecured,
      tone: "warm",
    },
  ];

  // Phase 2 range — from build M1 to NNC first claim + 30-day pad.
  const phase2Start = derived.buildM1;
  const phase2End = addDays(derived.nncFirstClaim, 30);

  const phase2Bars: GanttBar[] = [
    {
      label: "Pick building, suppliers, till",
      start: derived.buildM1,
      end: addDays(derived.buildM1, 60),
      tone: "warm",
    },
    {
      label: "Build out inside",
      start: addDays(derived.buildM1, 36),
      end: addDays(derived.buildM1, 150),
      tone: "warm",
    },
    {
      label: "Hire and train first crew",
      start: addDays(derived.buildM1, 60),
      end: addDays(derived.buildM1, 180),
      tone: "primary",
    },
    {
      label: "Soft opening",
      start: derived.buildSoftOpen,
      end: derived.doorsOpen,
      tone: "tan",
    },
    {
      label: "First 90 days",
      start: derived.doorsOpen,
      end: addDays(derived.doorsOpen, 90),
      tone: "primary",
    },
    {
      label: "Handover to Deer Lake manager",
      start: addDays(derived.buildHandover, -30),
      end: derived.buildHandover,
      tone: "tan",
    },
    {
      label: "NNC enrolment + first claim",
      start: derived.nncFiled,
      end: derived.nncFirstClaim,
      tone: "warm",
    },
  ];

  const phase2Gates: GanttGate[] = [
    {
      label: "Doors open",
      date: derived.doorsOpen,
      tone: "warm",
    },
    {
      label: "NNC files",
      date: derived.nncFiled,
      tone: "primary",
    },
  ];

  return (
    <PlannerShell>
      <TodayCard
        doorsOpen={derived.doorsOpen}
        totalMonths={derived.totalMonths}
      />
      <ScenarioPicker
        current={scenarioId}
        onPick={pickScenario}
        onSave={save}
        savedAt={savedAt}
        isDirty={isDirty}
      />
      <PhaseGantt
        title="Phase 1 · Design + pilot + application"
        caption="Contract one. Today through the funding-secured trigger."
        rangeStart={phase1Start}
        rangeEnd={phase1End}
        bars={phase1Bars}
        gates={phase1Gates}
        todayMarker={TODAY}
      />
      <DatePegs anchors={anchors} onChange={updateAnchor} />
      <OffRamp
        councilDecision={anchors.councilDecision}
        fundingSecured={derived.fundingSecured}
      />
      <PhaseGantt
        title="Phase 2 · Build + handover"
        caption="Contract two. Triggered by funding secured. Doors open at month five, handover at month nine, NNC subsidy lands a few months after."
        rangeStart={phase2Start}
        rangeEnd={phase2End}
        bars={phase2Bars}
        gates={phase2Gates}
      />
      <KeyDates d={derived} />
    </PlannerShell>
  );
}

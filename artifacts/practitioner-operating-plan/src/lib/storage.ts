import { useEffect, useState, useCallback } from "react";

import type { MilestoneId, MilestoneState, Phase } from "./phases";
import { PHASE_ORDER } from "./phases";

export const STORAGE_KEY = "pop:v1";
export const STORAGE_VERSION = 2;

// Snapshot model is a faithful migration of the standalone Annual Plan
// Check-in app: portfolio + Watershed ARR + owner take-home + XRP wildcard
// + assumed annual living expenses, captured against the 2026–2037 plan
// curve so the retirement-outlook math keeps working unchanged.
export type Snapshot = {
  id: string;
  createdAt: string; // ISO timestamp
  year: number;
  watershedArr: number;
  ownerTakeHome: number;
  portfolioValue: number;
  xrpBalance: number;
  xrpPriceUsd: number;
  annualLivingExpenses: number;
  notes: string;
};

export type WeekCloseOut = {
  closedAt: string;
  carriedStepIds: string[];
};

export type AppState = {
  version: number;
  doneSteps: Record<string, { doneAt: string }>;
  weekNotes: Record<string, string>;
  weekCloseOuts: Record<string, WeekCloseOut>;
  completedWeeks: Record<string, { completedAt: string }>;
  shiftedWeeks: Record<string, { shiftedTo: number }>;
  snapshots: Snapshot[];
  // Deal-flow phase state. `currentPhase` is the active phase the
  // practitioner is in — it only ever changes from an explicit user
  // action (clicking a phase pill, or accepting the soft nudge).
  // `milestones` is the toggle-set that produces the *suggested* phase,
  // which is offered as a soft nudge but never moves `currentPhase` on
  // its own. `dismissedPhaseSuggestion` records the suggested phase
  // the practitioner said "no, stay where I am" to.
  currentPhase: Phase;
  milestones: MilestoneState;
  dismissedPhaseSuggestion: Phase | null;
};

export const DEFAULT_STATE: AppState = {
  version: STORAGE_VERSION,
  doneSteps: {},
  weekNotes: {},
  weekCloseOuts: {},
  completedWeeks: {},
  shiftedWeeks: {},
  snapshots: [],
  currentPhase: "idea",
  milestones: {},
  dismissedPhaseSuggestion: null,
};

// Migrate a parsed payload of any prior schema version up to STORAGE_VERSION.
// Add new `case` blocks here as the schema evolves.
function migrate(parsed: { version: number } & Record<string, unknown>): AppState {
  let working = parsed;
  // v0 -> v1: introduced weekCloseOuts/completedWeeks/shiftedWeeks/snapshots.
  if (working.version === 0) {
    working = { ...working, version: 1 };
  }
  // v1 -> v2: introduced currentPhase/milestones/dismissedPhaseSuggestion.
  if (working.version === 1) {
    working = {
      ...working,
      version: 2,
      currentPhase: "idea",
      milestones: {},
      dismissedPhaseSuggestion: null,
    };
  }
  // Unknown future version: best-effort — trust and keep known keys.
  const rawPhase = working.currentPhase as Phase | undefined;
  const safePhase: Phase =
    rawPhase && rawPhase in PHASE_ORDER ? rawPhase : "idea";
  return {
    ...DEFAULT_STATE,
    ...working,
    version: STORAGE_VERSION,
    doneSteps: (working.doneSteps as AppState["doneSteps"]) ?? {},
    weekNotes: (working.weekNotes as AppState["weekNotes"]) ?? {},
    weekCloseOuts: (working.weekCloseOuts as AppState["weekCloseOuts"]) ?? {},
    completedWeeks:
      (working.completedWeeks as AppState["completedWeeks"]) ?? {},
    shiftedWeeks: (working.shiftedWeeks as AppState["shiftedWeeks"]) ?? {},
    snapshots: (working.snapshots as AppState["snapshots"]) ?? [],
    currentPhase: safePhase,
    milestones: (working.milestones as MilestoneState) ?? {},
    dismissedPhaseSuggestion:
      (working.dismissedPhaseSuggestion as Phase | null) ?? null,
  };
}

function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.version === "number"
    ) {
      return migrate(parsed);
    }
  } catch {
    // Fall through to default
  }
  return DEFAULT_STATE;
}

function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or serialization error — silently ignore for now.
  }
}

type Listener = (state: AppState) => void;
const listeners = new Set<Listener>();
let currentState: AppState | null = null;

function getState(): AppState {
  if (currentState === null) currentState = loadState();
  return currentState;
}

function setState(next: AppState): void {
  currentState = next;
  saveState(next);
  for (const l of listeners) l(next);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    currentState = loadState();
    for (const l of listeners) l(currentState);
  });
}

export function useAppState(): AppState {
  const [s, setS] = useState<AppState>(() => getState());
  useEffect(() => {
    const listener: Listener = (next) => setS(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return s;
}

export function useAppStateActions() {
  const toggleStepDone = useCallback((stepId: string, done: boolean) => {
    const s = getState();
    const next = { ...s, doneSteps: { ...s.doneSteps } };
    if (done) {
      next.doneSteps[stepId] = { doneAt: new Date().toISOString() };
    } else {
      delete next.doneSteps[stepId];
    }
    setState(next);
  }, []);

  const setWeekNote = useCallback((weekNumber: number, note: string) => {
    const s = getState();
    setState({
      ...s,
      weekNotes: { ...s.weekNotes, [String(weekNumber)]: note },
    });
  }, []);

  // Close-out: stamp the week with a closedAt and freeze the list of
  // unfinished step IDs that should roll forward into next week's day-1.
  const closeWeek = useCallback(
    (weekNumber: number, carriedStepIds: string[]) => {
      const s = getState();
      setState({
        ...s,
        weekCloseOuts: {
          ...s.weekCloseOuts,
          [String(weekNumber)]: {
            closedAt: new Date().toISOString(),
            carriedStepIds,
          },
        },
      });
    },
    [],
  );

  const reopenWeek = useCallback((weekNumber: number) => {
    const s = getState();
    const nextCloseOuts = { ...s.weekCloseOuts };
    delete nextCloseOuts[String(weekNumber)];
    setState({ ...s, weekCloseOuts: nextCloseOuts });
  }, []);

  const completeWeek = useCallback((weekNumber: number) => {
    const s = getState();
    setState({
      ...s,
      completedWeeks: {
        ...s.completedWeeks,
        [String(weekNumber)]: { completedAt: new Date().toISOString() },
      },
    });
  }, []);

  const uncompleteWeek = useCallback((weekNumber: number) => {
    const s = getState();
    const next = { ...s.completedWeeks };
    delete next[String(weekNumber)];
    setState({ ...s, completedWeeks: next });
  }, []);

  // Shift: capture an intent to push this week's plan into a later week.
  // Pure planning aid — does not move step IDs around.
  const shiftWeek = useCallback((weekNumber: number, shiftedTo: number) => {
    const s = getState();
    setState({
      ...s,
      shiftedWeeks: {
        ...s.shiftedWeeks,
        [String(weekNumber)]: { shiftedTo },
      },
    });
  }, []);

  const unshiftWeek = useCallback((weekNumber: number) => {
    const s = getState();
    const next = { ...s.shiftedWeeks };
    delete next[String(weekNumber)];
    setState({ ...s, shiftedWeeks: next });
  }, []);

  const addSnapshot = useCallback(
    (snapshot: Omit<Snapshot, "id" | "createdAt">) => {
      const s = getState();
      const created: Snapshot = {
        ...snapshot,
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
      };
      setState({ ...s, snapshots: [...s.snapshots, created] });
      return created;
    },
    [],
  );

  const deleteSnapshot = useCallback((id: string) => {
    const s = getState();
    setState({ ...s, snapshots: s.snapshots.filter((sn) => sn.id !== id) });
  }, []);

  const resetAll = useCallback(() => {
    setState({ ...DEFAULT_STATE });
  }, []);

  // Set the active phase the practitioner is in. This is the only thing
  // that ever moves the active phase — milestones never move it on
  // their own. Setting it clears any pending dismissal so future
  // suggestions can speak again.
  const setCurrentPhase = useCallback((phase: Phase) => {
    const s = getState();
    setState({
      ...s,
      currentPhase: phase,
      dismissedPhaseSuggestion: null,
    });
  }, []);

  const setMilestone = useCallback(
    (milestoneId: MilestoneId, checked: boolean) => {
      const s = getState();
      const next = { ...s.milestones };
      if (checked) {
        next[milestoneId] = true;
      } else {
        delete next[milestoneId];
      }
      // Toggling milestones invalidates any prior dismissal — the
      // suggested phase may have moved, so let the soft nudge speak
      // again. Crucially, we do *not* touch currentPhase here.
      setState({
        ...s,
        milestones: next,
        dismissedPhaseSuggestion: null,
      });
    },
    [],
  );

  const dismissPhaseSuggestion = useCallback((phase: Phase) => {
    const s = getState();
    setState({ ...s, dismissedPhaseSuggestion: phase });
  }, []);

  return {
    toggleStepDone,
    setWeekNote,
    closeWeek,
    reopenWeek,
    completeWeek,
    uncompleteWeek,
    shiftWeek,
    unshiftWeek,
    addSnapshot,
    deleteSnapshot,
    resetAll,
    setCurrentPhase,
    setMilestone,
    dismissPhaseSuggestion,
  };
}

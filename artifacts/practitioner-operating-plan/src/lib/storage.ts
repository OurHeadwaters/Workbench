import { useEffect, useState, useCallback } from "react";

import type { MilestoneId, MilestoneState, Phase } from "./phases";
import { PHASE_ORDER } from "./phases";

import type { CostReviewMap } from "./costReview";

export const STORAGE_KEY = "pop:v1";
export const STORAGE_VERSION = 6;

// Per-batch bench swap. Keyed by week number string (matching how the
// rest of this slice keys week-scoped state — weekNotes, completedWeeks,
// etc.). Either field may be present alone (e.g., only the standby was
// swapped). The base assignment lives in `data/saltBench.ts`; this slice
// only records *changes* to it. Seat ids are validated at the call site
// against the BENCH map so a stale override referring to a removed seat
// is treated as no override.
export type BenchOverride = {
  primary?: string;
  standby?: string;
};

// "My Three Things" — three editable rows the practitioner commits to
// for today, plus three to move the current phase forward. Stored as
// fixed-length-3 arrays (kept that way by the helpers in
// `lib/threeThings.ts`) so the UI never has to worry about missing
// slots.
export type ThreeThingItem = { text: string; done: boolean };
export type ThreeThingTriple = [
  ThreeThingItem,
  ThreeThingItem,
  ThreeThingItem,
];

// Single slot for the phase-scoped 3. When `phase` no longer matches
// the active currentPhase, the displayed list is treated as empty so
// the practitioner is prompted to set fresh ones for the new phase
// rather than carrying stale items forward across phase boundaries.
export type PhaseThreeSlot = {
  phase: Phase;
  items: ThreeThingTriple;
};

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
  // "My Three Things" — keyed by ISO date so day rollover is automatic
  // (a new day naturally has no entry and starts fresh; previous days
  // are archived in place for the yesterday + weekly views).
  dailyThree: Record<string, ThreeThingTriple>;
  // Week-scoped 3 — three things to move *this week* forward. Keyed by
  // the same week-number string the rest of this slice uses
  // (weekNotes/completedWeeks). Mon→Sun rollover is automatic because
  // a new week's key has no entry and reads as empty.
  weeklyThree: Record<string, ThreeThingTriple>;
  // Phase-scoped 3 lives in a single slot. When the practitioner moves
  // to a different phase, the slot is treated as empty until they set
  // new ones — see lib/threeThings.ts for the readPhaseThree helper.
  phaseThree: PhaseThreeSlot | null;
  // Per-batch bench swaps. Empty by default — when the OM swaps a seat
  // for a specific batch week, an entry lands here keyed by that week
  // number string. See `BenchOverride` above.
  benchOverrides: Record<string, BenchOverride>;
  // Cost Review verdicts, keyed by entry id from data/costRegistry.ts.
  costReview: CostReviewMap;
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
  dailyThree: {},
  weeklyThree: {},
  phaseThree: null,
  benchOverrides: {},
  costReview: {},
};

// Migrate a parsed payload of any prior schema version up to STORAGE_VERSION.
// Add new `case` blocks here as the schema evolves. Exported for the
// migration tests in lib/__tests__.
export function migrate(
  parsed: { version: number } & Record<string, unknown>,
): AppState {
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
  // v2 -> v3: introduced dailyThree + phaseThree (My Three Things).
  if (working.version === 2) {
    working = {
      ...working,
      version: 3,
      dailyThree: {},
      phaseThree: null,
    };
  }
  // v3 -> v4: introduced benchOverrides (per-batch seat swaps).
  if (working.version === 3) {
    working = {
      ...working,
      version: 4,
      benchOverrides: {},
    };
  }
  // v4 -> v5: introduced costReview (Cost Review walkthrough verdicts).
  if (working.version === 4) {
    working = {
      ...working,
      version: 5,
      costReview: {},
    };
  }
  // v5 -> v6: introduced weeklyThree (week-scoped Three Things slot
  // parallel to dailyThree + phaseThree). Only add the new key —
  // never drop existing daily or phase data.
  if (working.version === 5) {
    working = {
      ...working,
      version: 6,
      weeklyThree: {},
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
    dailyThree: (working.dailyThree as AppState["dailyThree"]) ?? {},
    weeklyThree: (working.weeklyThree as AppState["weeklyThree"]) ?? {},
    phaseThree: (working.phaseThree as PhaseThreeSlot | null) ?? null,
    benchOverrides:
      (working.benchOverrides as AppState["benchOverrides"]) ?? {},
    costReview: (working.costReview as CostReviewMap) ?? {},
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

// Internal setter used by lib/costReview to share the listener fan-out.
export function _setStateForCostReview(updater: (s: AppState) => AppState): void {
  setState(updater(getState()));
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

  // --- My Three Things --------------------------------------------------
  // Items always live in length-3 triples; helpers in
  // `lib/threeThings.ts` enforce that on read so callers below can
  // treat slot indexes 0/1/2 as always-present.

  const setDailyThing = useCallback(
    (dateISO: string, idx: number, text: string) => {
      const s = getState();
      const existing = s.dailyThree[dateISO];
      const next: ThreeThingTriple = existing
        ? ([existing[0], existing[1], existing[2]] as ThreeThingTriple)
        : ([
            { text: "", done: false },
            { text: "", done: false },
            { text: "", done: false },
          ] as ThreeThingTriple);
      next[idx] = { ...next[idx], text };
      setState({
        ...s,
        dailyThree: { ...s.dailyThree, [dateISO]: next },
      });
    },
    [],
  );

  const toggleDailyThing = useCallback(
    (dateISO: string, idx: number, done: boolean) => {
      const s = getState();
      const existing = s.dailyThree[dateISO];
      const next: ThreeThingTriple = existing
        ? ([existing[0], existing[1], existing[2]] as ThreeThingTriple)
        : ([
            { text: "", done: false },
            { text: "", done: false },
            { text: "", done: false },
          ] as ThreeThingTriple);
      next[idx] = { ...next[idx], done };
      setState({
        ...s,
        dailyThree: { ...s.dailyThree, [dateISO]: next },
      });
    },
    [],
  );

  // Week-scoped writers — same shape as the daily writers, but keyed
  // by week-number string. A new week's key has no entry and reads
  // empty, which gives us automatic Mon→Sun rollover for free.
  const setWeeklyThing = useCallback(
    (weekKey: string, idx: number, text: string) => {
      const s = getState();
      const existing = s.weeklyThree[weekKey];
      const next: ThreeThingTriple = existing
        ? ([existing[0], existing[1], existing[2]] as ThreeThingTriple)
        : ([
            { text: "", done: false },
            { text: "", done: false },
            { text: "", done: false },
          ] as ThreeThingTriple);
      next[idx] = { ...next[idx], text };
      setState({
        ...s,
        weeklyThree: { ...s.weeklyThree, [weekKey]: next },
      });
    },
    [],
  );

  const toggleWeeklyThing = useCallback(
    (weekKey: string, idx: number, done: boolean) => {
      const s = getState();
      const existing = s.weeklyThree[weekKey];
      const next: ThreeThingTriple = existing
        ? ([existing[0], existing[1], existing[2]] as ThreeThingTriple)
        : ([
            { text: "", done: false },
            { text: "", done: false },
            { text: "", done: false },
          ] as ThreeThingTriple);
      next[idx] = { ...next[idx], done };
      setState({
        ...s,
        weeklyThree: { ...s.weeklyThree, [weekKey]: next },
      });
    },
    [],
  );

  const resetWeeklyThree = useCallback((weekKey: string) => {
    const s = getState();
    setState({
      ...s,
      weeklyThree: {
        ...s.weeklyThree,
        [weekKey]: [
          { text: "", done: false },
          { text: "", done: false },
          { text: "", done: false },
        ],
      },
    });
  }, []);

  // Phase-scoped writers stamp the current phase onto the slot. If the
  // slot was attached to a different phase, it's replaced wholesale —
  // that's how we keep stale phase items from leaking forward.
  const setPhaseThing = useCallback(
    (phase: Phase, idx: number, text: string) => {
      const s = getState();
      const existing =
        s.phaseThree && s.phaseThree.phase === phase
          ? s.phaseThree.items
          : ([
              { text: "", done: false },
              { text: "", done: false },
              { text: "", done: false },
            ] as ThreeThingTriple);
      const next: ThreeThingTriple = [
        existing[0],
        existing[1],
        existing[2],
      ] as ThreeThingTriple;
      next[idx] = { ...next[idx], text };
      setState({ ...s, phaseThree: { phase, items: next } });
    },
    [],
  );

  const togglePhaseThing = useCallback(
    (phase: Phase, idx: number, done: boolean) => {
      const s = getState();
      const existing =
        s.phaseThree && s.phaseThree.phase === phase
          ? s.phaseThree.items
          : ([
              { text: "", done: false },
              { text: "", done: false },
              { text: "", done: false },
            ] as ThreeThingTriple);
      const next: ThreeThingTriple = [
        existing[0],
        existing[1],
        existing[2],
      ] as ThreeThingTriple;
      next[idx] = { ...next[idx], done };
      setState({ ...s, phaseThree: { phase, items: next } });
    },
    [],
  );

  // --- Bench overrides --------------------------------------------------
  // Per-batch swap of the primary or standby seat. Pass `null` to clear
  // that role's override and fall back to the seed roster in
  // `data/saltBench.ts`. When both roles' overrides are cleared, the
  // week's entry is removed entirely so the storage payload doesn't
  // accumulate empty objects.
  const setBenchOverride = useCallback(
    (
      weekNumber: number,
      role: "primary" | "standby",
      seatId: string | null,
    ) => {
      const s = getState();
      const key = String(weekNumber);
      const current = s.benchOverrides[key] ?? {};
      const next: BenchOverride = { ...current };
      if (seatId === null) {
        delete next[role];
      } else {
        next[role] = seatId;
      }
      const nextOverrides = { ...s.benchOverrides };
      if (next.primary === undefined && next.standby === undefined) {
        delete nextOverrides[key];
      } else {
        nextOverrides[key] = next;
      }
      setState({ ...s, benchOverrides: nextOverrides });
    },
    [],
  );

  // "Set fresh ones" — used when the practitioner enters a new phase
  // and accepts the soft prompt to start a new phase-scoped 3.
  const resetPhaseThree = useCallback((phase: Phase) => {
    const s = getState();
    setState({
      ...s,
      phaseThree: {
        phase,
        items: [
          { text: "", done: false },
          { text: "", done: false },
          { text: "", done: false },
        ],
      },
    });
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
    setDailyThing,
    toggleDailyThing,
    setWeeklyThing,
    toggleWeeklyThing,
    resetWeeklyThree,
    setPhaseThing,
    togglePhaseThing,
    resetPhaseThree,
    setBenchOverride,
  };
}

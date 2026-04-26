import type {
  AppState,
  PhaseThreeSlot,
  ThreeThingItem,
  ThreeThingTriple,
} from "./storage";
import type { Phase } from "./phases";
import {
  addDays,
  getCurrentWeekNumber,
  getTodayISO,
  parseISODate,
} from "./dateMath";

// Always return a length-3 triple. Storage may have nothing for a date
// yet (or, defensively, a malformed shorter array from a future bug);
// the UI never sees missing slots.
export function readDailyThree(
  state: AppState,
  dateISO: string,
): ThreeThingTriple {
  const raw = state.dailyThree[dateISO];
  return normalizeTriple(raw);
}

// Returns the phase-scoped triple iff the stored slot belongs to the
// active phase. Otherwise returns an empty triple — the cue for the UI
// to surface the "set new ones" prompt rather than show stale items.
export function readPhaseThree(
  state: AppState,
  activePhase: Phase,
): { items: ThreeThingTriple; matchesActive: boolean } {
  const slot = state.phaseThree;
  if (slot && slot.phase === activePhase) {
    return { items: normalizeTriple(slot.items), matchesActive: true };
  }
  return { items: emptyTriple(), matchesActive: false };
}

// Always return a length-3 triple for the given week key. Mirrors the
// daily/phase readers; the UI never sees missing slots.
export function readWeekThree(
  state: AppState,
  weekKey: string,
): ThreeThingTriple {
  return normalizeTriple(state.weeklyThree[weekKey]);
}

// The week-key for "right now". Stays stable Mon→Sun and rolls over
// automatically when the calendar week advances. Matches the
// `String(weekNumber)` keying used by weekNotes/completedWeeks/etc.
export function currentWeekKey(today: Date = new Date()): string {
  return String(getCurrentWeekNumber(today));
}

export function normalizeTriple(
  raw: ThreeThingTriple | undefined | null,
): ThreeThingTriple {
  if (!raw) return emptyTriple();
  return [
    raw[0] ?? { text: "", done: false },
    raw[1] ?? { text: "", done: false },
    raw[2] ?? { text: "", done: false },
  ];
}

export function emptyTriple(): ThreeThingTriple {
  return [
    { text: "", done: false },
    { text: "", done: false },
    { text: "", done: false },
  ];
}

export function isItemActive(item: ThreeThingItem): boolean {
  return item.text.trim().length > 0;
}

// Count of done items, only counting rows the practitioner actually
// filled in. An empty unchecked row doesn't count against you.
export function countDone(items: ThreeThingTriple): number {
  return items.filter((i) => isItemActive(i) && i.done).length;
}

export function countActive(items: ThreeThingTriple): number {
  return items.filter(isItemActive).length;
}

export type DayStatus = "all" | "partial" | "missed" | "empty";

// Strict semantics so the streak strip means what it reads:
//   empty   = no rows filled in at all
//   missed  = filled in 1+ rows, finished none
//   all     = filled in all 3 rows AND finished all 3
//   partial = anything else (including 1/1, 2/2 — engaged but didn't
//             commit to a full Three)
export function dayStatus(items: ThreeThingTriple): DayStatus {
  const active = countActive(items);
  if (active === 0) return "empty";
  const done = countDone(items);
  if (done === 0) return "missed";
  if (active === 3 && done === 3) return "all";
  return "partial";
}

export type WeekDayEntry = {
  dateISO: string;
  status: DayStatus;
  done: number;
  active: number;
  isToday: boolean;
};

// Last 7 calendar days ending today (inclusive). Read-only summary for
// the streak surface; "today" is included so the day-in-progress shows
// up in the strip.
export function getLastSevenDays(
  state: AppState,
  today: Date = new Date(),
): WeekDayEntry[] {
  const todayISO = getTodayISO(today);
  const out: WeekDayEntry[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const d = addDays(todayISO, -offset);
    const items = readDailyThree(state, d);
    out.push({
      dateISO: d,
      status: dayStatus(items),
      done: countDone(items),
      active: countActive(items),
      isToday: d === todayISO,
    });
  }
  return out;
}

export function yesterdayISO(today: Date = new Date()): string {
  return addDays(getTodayISO(today), -1);
}

// Short label for the day-of-week strip ("M"/"T"/"W"…). Monday-first
// to match the rest of the app, but rendered against the actual past
// 7 days so weekday labels track the real dates.
export function shortWeekdayLabel(dateISO: string): string {
  const d = parseISODate(dateISO);
  const dow = d.getUTCDay(); // 0 = Sun
  return ["S", "M", "T", "W", "T", "F", "S"][dow];
}

// Convenience for the single-slot phase write check used in the UI.
export function phaseSlotMatchesActive(
  slot: PhaseThreeSlot | null,
  activePhase: Phase,
): boolean {
  return !!slot && slot.phase === activePhase;
}

// "Now view" focal-card selector. Returns the next undone slot across
// the three queues, in strict Day → Week → Phase priority. A slot is
// "undone" if its `done` flag is false (regardless of whether the text
// has been typed in yet — empty undone slots become a "what's the next
// thing?" prompt in the UI). Returns null only when every slot in all
// three queues is filled in *and* checked done — i.e. the practitioner
// has actually committed to and completed all 9 things.
export type NextUndoneKind = "day" | "week" | "phase";

export type NextUndone = {
  kind: NextUndoneKind;
  idx: 0 | 1 | 2;
  item: ThreeThingItem;
};

export function getNextUndone(
  daily: ThreeThingTriple,
  weekly: ThreeThingTriple,
  phase: ThreeThingTriple,
): NextUndone | null {
  const queues: Array<{ kind: NextUndoneKind; items: ThreeThingTriple }> = [
    { kind: "day", items: daily },
    { kind: "week", items: weekly },
    { kind: "phase", items: phase },
  ];
  for (const { kind, items } of queues) {
    for (let i = 0; i < 3; i += 1) {
      const item = items[i];
      // A slot counts as "done for the practitioner" only when it has
      // been filled in *and* checked. An empty done slot doesn't make
      // sense, but if it ever happens (legacy data) we treat it as
      // open so the prompt re-asks for input.
      const filled = isItemActive(item);
      const finished = filled && item.done;
      if (!finished) {
        return { kind, idx: i as 0 | 1 | 2, item };
      }
    }
  }
  return null;
}

// Pure helper for the desktop/mobile breakpoint switch on /today.
// Tailwind's `md` breakpoint is 768px; anything below that uses the
// mobile Now view. Exported (and unit-tested) so the same threshold
// is referenceable from non-CSS code paths.
export const MOBILE_BREAKPOINT_PX = 768;

export function isMobileViewport(width: number): boolean {
  return width < MOBILE_BREAKPOINT_PX;
}

import type {
  AppState,
  PhaseThreeSlot,
  ThreeThingItem,
  ThreeThingTriple,
} from "./storage";
import type { Phase } from "./phases";
import { addDays, getTodayISO, parseISODate } from "./dateMath";

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

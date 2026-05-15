/**
 * threeThings.ts — Daily "three things" storage helpers
 *
 * Each day the practitioner can track up to three items (text + done flag).
 * Items are stored per ISO date key. The carry-over helper copies unchecked
 * items from yesterday into today's empty slots in one call.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DailyItem {
  text: string;
  done: boolean;
}

/** Exactly 3 slots; null means the slot is empty. */
export type DayThings = [DailyItem | null, DailyItem | null, DailyItem | null];

// ── Key helpers ───────────────────────────────────────────────────────────────

/** Returns "YYYY-MM-DD" for the given date. */
export function dailyKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return dailyKey(new Date());
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dailyKey(d);
}

// ── Raw storage ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "hwop_daily_things_v1";

function loadAll(): Record<string, DayThings> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, DayThings>;
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, DayThings>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Public API ────────────────────────────────────────────────────────────────

export function loadDayThings(dateKey: string): DayThings {
  const all = loadAll();
  const stored = all[dateKey];
  if (!stored) return [null, null, null];
  // Normalise: ensure exactly 3 slots
  return [stored[0] ?? null, stored[1] ?? null, stored[2] ?? null];
}

export function saveDayThings(dateKey: string, items: DayThings): void {
  const all = loadAll();
  all[dateKey] = items;
  saveAll(all);
}

/** Set (or clear) a single slot for the given day. */
export function setDailyThing(
  dateKey: string,
  slot: 0 | 1 | 2,
  item: DailyItem | null
): void {
  const items = loadDayThings(dateKey);
  items[slot] = item;
  saveDayThings(dateKey, items);
}

/** Return all non-null, unchecked items for a day. */
export function getUncheckedFromDay(dateKey: string): DailyItem[] {
  return loadDayThings(dateKey).filter(
    (item): item is DailyItem => item !== null && !item.done
  );
}

/**
 * Copy up to 3 unchecked items from yesterday into today's empty slots.
 * Returns the slot indices (0–2) that were newly filled, or [] if nothing changed.
 */
export function carryOverFromYesterday(): number[] {
  const unchecked = getUncheckedFromDay(yesterdayKey());
  if (unchecked.length === 0) return [];

  const todayItems = loadDayThings(todayKey());
  const filled: number[] = [];
  let uidx = 0;

  for (let slot = 0; slot < 3 && uidx < unchecked.length; slot++) {
    if (todayItems[slot] === null) {
      todayItems[slot] = { text: unchecked[uidx].text, done: false };
      filled.push(slot);
      uidx++;
    }
  }

  if (filled.length > 0) {
    saveDayThings(todayKey(), todayItems);
  }

  return filled;
}

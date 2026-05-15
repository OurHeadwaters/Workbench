/**
 * threeThings.ts — weekly "three things" storage and rollover logic.
 *
 * Storage layout (localStorage):
 *   hwop_weekly_three_v1 → Record<weekKey, WeeklyThree>
 *
 * Week keys use the ISO 8601 format "YYYY-Wnn", e.g. "2026-W20".
 * Weeks start on Monday (ISO standard).
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WeeklyItem {
  id: string;
  text: string;
  done: boolean;
}

export interface WeeklyThree {
  weekKey: string;
  items: WeeklyItem[];   // max 3 active slots
  createdAt: number;
  updatedAt: number;
  /** Set to true once the practitioner acts on the rollover prompt (carry or dismiss). */
  rolloverDismissed?: boolean;
}

export type WeeklyThreeStore = Record<string, WeeklyThree>;

// ── ISO week helpers (pure — all testable without mocks) ──────────────────────

/**
 * Returns the ISO 8601 { year, week } for a given Date.
 * Week starts on Monday; week 1 is the week containing the year's first Thursday.
 */
export function isoWeekOf(date: Date): { year: number; week: number } {
  // Work in UTC to avoid DST edge-cases.
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7; // Sun → 7, Mon → 1 … Sat → 6
  // Advance to the Thursday of the same ISO week.
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return { year: d.getUTCFullYear(), week };
}

/** Returns the number of ISO weeks in a given year (52 or 53). */
export function lastISOWeekOfYear(year: number): number {
  // Dec 28 is always in the last ISO week of its year.
  return isoWeekOf(new Date(year, 11, 28)).week;
}

/** Formats a year/week pair as "YYYY-Wnn", e.g. "2026-W20". */
export function formatWeekKey(year: number, week: number): string {
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** Returns the ISO week key for today. */
export function currentWeekKey(): string {
  const { year, week } = isoWeekOf(new Date());
  return formatWeekKey(year, week);
}

/**
 * Returns the week key for the week immediately before the given weekKey.
 * Handles year-end rollover (e.g. "2026-W01" → "2025-W52" or "2025-W53").
 * Returns "" if the weekKey is malformed.
 */
export function prevWeekKey(weekKey: string): string {
  const m = weekKey.match(/^(\d{4})-W(\d{2})$/);
  if (!m) return "";
  const year = parseInt(m[1], 10);
  const week = parseInt(m[2], 10);
  if (week > 1) return formatWeekKey(year, week - 1);
  return formatWeekKey(year - 1, lastISOWeekOfYear(year - 1));
}

// ── Rollover logic (pure — takes data directly so it's fully testable) ────────

export interface RolloverPayload {
  /** True when the previous week has unchecked, non-empty items. */
  hasUnfinished: boolean;
  /** The unfinished items from the previous week. */
  unfinished: WeeklyItem[];
  /** The week key those items came from. */
  fromKey: string;
}

/**
 * Pure rollover check — supply the WeeklyThree records directly.
 *
 * @param currentEntry  The current week's record (or null if not yet created).
 * @param prevEntry     The previous week's record (or null if not found).
 * @param fromKey       The previous week's key (used in the returned payload).
 */
export function checkRolloverPure(
  currentEntry: WeeklyThree | null,
  prevEntry: WeeklyThree | null,
  fromKey: string,
): RolloverPayload {
  if (currentEntry?.rolloverDismissed) {
    return { hasUnfinished: false, unfinished: [], fromKey: "" };
  }
  if (!prevEntry) {
    return { hasUnfinished: false, unfinished: [], fromKey };
  }
  const unfinished = prevEntry.items.filter(
    (it) => !it.done && it.text.trim().length > 0,
  );
  return { hasUnfinished: unfinished.length > 0, unfinished, fromKey };
}

/**
 * Merges carried-over items into the current week's items, capped at 3.
 * Carried items are always marked undone. Returns the merged item list.
 */
export function mergeCarryover(
  currentItems: WeeklyItem[],
  carried: WeeklyItem[],
): WeeklyItem[] {
  const existing = currentItems.filter((it) => it.text.trim().length > 0);
  return [...carried.map((it) => ({ ...it, done: false })), ...existing].slice(
    0,
    3,
  );
}

// ── Storage helpers ───────────────────────────────────────────────────────────

const STORAGE_KEY = "hwop_weekly_three_v1";

function loadStore(): WeeklyThreeStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as WeeklyThreeStore;
  } catch {
    return {};
  }
}

function saveStore(store: WeeklyThreeStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Silently ignore storage failures (private browsing, quota exceeded, etc.)
  }
}

/** Reads the WeeklyThree for the given week key, or null if not yet created. */
export function readWeekThree(weekKey: string): WeeklyThree | null {
  return loadStore()[weekKey] ?? null;
}

/** Reads or initialises the WeeklyThree for the given week key. */
export function getOrCreateWeekThree(weekKey: string): WeeklyThree {
  const store = loadStore();
  if (store[weekKey]) return store[weekKey];
  const fresh: WeeklyThree = {
    weekKey,
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  store[weekKey] = fresh;
  saveStore(store);
  return fresh;
}

/** Persists the given WeeklyThree entry (upsert). */
export function writeWeekThree(entry: WeeklyThree): void {
  const store = loadStore();
  store[entry.weekKey] = { ...entry, updatedAt: Date.now() };
  saveStore(store);
}

/**
 * Storage-backed rollover check for the current week.
 * Reads both the current and previous week from localStorage.
 */
export function checkRollover(weekKey: string): RolloverPayload {
  const fromKey = prevWeekKey(weekKey);
  return checkRolloverPure(
    readWeekThree(weekKey),
    fromKey ? readWeekThree(fromKey) : null,
    fromKey,
  );
}
/**
 * Carries the given items into the current week and marks rollover as dismissed.
 * Returns the updated WeeklyThree.
 */
export function carryOverItems(
  weekKey: string,
  items: WeeklyItem[],
): WeeklyThree {
  const current = getOrCreateWeekThree(weekKey);
  const merged = mergeCarryover(current.items, items);
  const next: WeeklyThree = {
    ...current,
    items: merged,
    rolloverDismissed: true,
    updatedAt: Date.now(),
  };
  writeWeekThree(next);
  return next;
}

/**
 * Dismisses the rollover prompt without carrying items over.
 * Returns the updated WeeklyThree.
 */
export function dismissRollover(weekKey: string): WeeklyThree {
  const current = getOrCreateWeekThree(weekKey);
  const next: WeeklyThree = {
    ...current,
    rolloverDismissed: true,
    updatedAt: Date.now(),
  };
  writeWeekThree(next);
  return next;
}

// ── Daily layer (per-calendar-day) ────────────────────────────────────────────

export interface DailyItem {
  text: string;
  done: boolean;
}

export type DayThings = [DailyItem | null, DailyItem | null, DailyItem | null];

const DAY_STORAGE_KEY = "hwop_daily_three_v1";

type DayStore = Record<string, (DailyItem | null)[]>;

function dateToKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadDayStore(): DayStore {
  try {
    const raw = localStorage.getItem(DAY_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as DayStore;
  } catch {
    return {};
  }
}

function saveDayStore(store: DayStore): void {
  try {
    localStorage.setItem(DAY_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage failures
  }
}

/** Returns today's key as "YYYY-MM-DD". */
export function todayKey(): string {
  return dateToKey(new Date());
}

/** Returns yesterday's key as "YYYY-MM-DD". */
export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateToKey(d);
}

/** Loads the three daily items for a given date key. */
export function loadDayThings(key: string): DayThings {
  const store = loadDayStore();
  const raw = store[key] ?? [null, null, null];
  return [raw[0] ?? null, raw[1] ?? null, raw[2] ?? null];
}

/** Sets a single slot for a given date key. */
export function setDailyThing(
  key: string,
  slot: 0 | 1 | 2,
  item: DailyItem | null,
): void {
  const store = loadDayStore();
  const current: (DailyItem | null)[] = store[key] ?? [null, null, null];
  current[slot] = item;
  store[key] = current;
  saveDayStore(store);
}

/** Returns the unchecked, non-empty items from a given day. */
export function getUncheckedFromDay(key: string): DailyItem[] {
  return loadDayThings(key).filter(
    (it): it is DailyItem =>
      it !== null && !it.done && it.text.trim().length > 0,
  );
}

/**
 * Carries unchecked items from yesterday into today's empty slots.
 * Returns the slot indices (0–2) that were filled.
 */
export function carryOverFromYesterday(): number[] {
  const tKey = todayKey();
  const yKey = yesterdayKey();
  const unchecked = getUncheckedFromDay(yKey);
  if (unchecked.length === 0) return [];
  const today = loadDayThings(tKey);
  const filled: number[] = [];
  let ui = 0;
  for (let slot = 0; slot < 3 && ui < unchecked.length; slot++) {
    if (today[slot] === null) {
      setDailyThing(tKey, slot as 0 | 1 | 2, { ...unchecked[ui], done: false });
      filled.push(slot);
      ui++;
    }
  }
  return filled;
}


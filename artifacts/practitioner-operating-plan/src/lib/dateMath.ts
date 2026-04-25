export const YEAR = 2026;
export const WEEK_1_START = "2026-01-05";

const DAY_MS = 24 * 60 * 60 * 1000;

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toISODate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

export function weekStart(weekNumber: number): string {
  return addDays(WEEK_1_START, (weekNumber - 1) * 7);
}

export function weekEnd(weekNumber: number): string {
  return addDays(WEEK_1_START, (weekNumber - 1) * 7 + 6);
}

export function weekRange(weekNumber: number): { start: string; end: string } {
  return { start: weekStart(weekNumber), end: weekEnd(weekNumber) };
}

export function getCurrentWeekNumber(today: Date = new Date()): number {
  const utcToday = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const start = parseISODate(WEEK_1_START).getTime();
  if (utcToday < start) return 1;
  const diffDays = Math.floor((utcToday - start) / DAY_MS);
  const wk = Math.floor(diffDays / 7) + 1;
  return Math.min(52, Math.max(1, wk));
}

export function getTodayISO(today: Date = new Date()): string {
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDayIndexInWeek(
  isoDate: string,
  weekNumber: number,
): number {
  const start = parseISODate(weekStart(weekNumber)).getTime();
  const target = parseISODate(isoDate).getTime();
  return Math.max(0, Math.min(6, Math.round((target - start) / DAY_MS)));
}

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const DAY_SHORT = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function dayNameOf(isoDate: string): string {
  const dow = parseISODate(isoDate).getUTCDay();
  // dow: 0=Sun..6=Sat, we want Monday-first
  const idx = (dow + 6) % 7;
  return DAY_NAMES[idx];
}

export function dayShortOf(isoDate: string): string {
  const dow = parseISODate(isoDate).getUTCDay();
  const idx = (dow + 6) % 7;
  return DAY_SHORT[idx];
}

export function formatLongDate(isoDate: string): string {
  const d = parseISODate(isoDate);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShortDate(isoDate: string): string {
  const d = parseISODate(isoDate);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatWeekRange(weekNumber: number): string {
  const { start, end } = weekRange(weekNumber);
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

export function dateForDayInWeek(
  weekNumber: number,
  dayShort: string,
): string {
  const idx = DAY_SHORT.indexOf(dayShort);
  return addDays(weekStart(weekNumber), Math.max(0, idx));
}

export { addDays, parseISODate, toISODate };

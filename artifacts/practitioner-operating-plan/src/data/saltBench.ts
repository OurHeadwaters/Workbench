/**
 * saltBench.ts
 *
 * Two related but distinct models for the SALT-01 food-handler bench:
 *
 * ── BATCH MODEL (SaltBench slide VI · 02b) ──────────────────────────────────
 * SEATS / BATCHES / Batch / BenchSeat drive the "Last batch" and "Next slot"
 * columns on the SaltBench slide. Edit the BATCHES array when the rotation
 * changes — the slide auto-updates.
 *
 * Role meanings:
 *   primary — leads the batch day (prep, labelling, handoff)
 *   backup  — on-call cover; handles the batch if primary is unavailable
 *
 * ── WEEK OVERRIDE MODEL (Bench Swap tool) ────────────────────────────────────
 * BENCH_ROSTER / ScheduledBenchRole / EffectiveBenchRole support the OM's
 * week-by-week swap tool (/tools/bench/week and /tools/bench/close).
 *
 * The scheduled rotation is a simple round-robin across BENCH_ROSTER.
 * Primary and standby slots are offset by one position so no two people
 * share both slots in the same week.
 *
 * EffectiveBenchRole merges the schedule with any OM-authored BenchOverride
 * stored in localStorage. The `primaryReason` / `standbyReason` fields carry
 * the one-line swap note the OM jotted at override time.
 */

import { loadBenchOverride, type BenchOverride } from "@/lib/storage";

// ══════════════════════════════════════════════════════════════════════════════
//  BATCH MODEL
// ══════════════════════════════════════════════════════════════════════════════

export type BenchRole = "primary" | "backup";

export interface Batch {
  num: number;
  date: string;     // ISO "YYYY-MM-DD"
  primary: string;  // seat name
  backup: string;   // seat name
}

export interface BenchSeat {
  name: string;
  title: string;    // display role / descriptor shown on the slide
}

// ── Roster ────────────────────────────────────────────────────────────────────

export const SEATS: BenchSeat[] = [
  { name: "Marie",  title: "Food Handler" },
  { name: "Jesse",  title: "Food Handler" },
  { name: "Cara",   title: "Food Handler" },
  { name: "Leon",   title: "Food Handler" },
  { name: "Tanya",  title: "Food Handler" },
];

// ── Batches Q1 tail → Q4 2026 ─────────────────────────────────────────────────
// Batch 8 is the last Q1 batch (already completed on most runs of this slide).
// Batches 9–15 are the full Q2–Q4 rotation.

export const BATCHES: Batch[] = [
  { num: 8,  date: "2026-03-25", primary: "Leon",  backup: "Cara"  },
  { num: 9,  date: "2026-04-30", primary: "Marie", backup: "Jesse" },
  { num: 10, date: "2026-06-04", primary: "Tanya", backup: "Leon"  },
  { num: 11, date: "2026-07-09", primary: "Cara",  backup: "Marie" },
  { num: 12, date: "2026-08-13", primary: "Jesse", backup: "Tanya" },
  { num: 13, date: "2026-09-17", primary: "Leon",  backup: "Cara"  },
  { num: 14, date: "2026-10-22", primary: "Marie", backup: "Jesse" },
  { num: 15, date: "2026-11-26", primary: "Tanya", backup: "Leon"  },
];

// ── Batch helpers ─────────────────────────────────────────────────────────────

/**
 * Returns the role of `name` in `batch`, or null if they are not assigned.
 */
export function roleInBatch(batch: Batch, name: string): BenchRole | null {
  if (batch.primary === name) return "primary";
  if (batch.backup === name) return "backup";
  return null;
}

/**
 * The most recent completed batch for `name` as of `today`.
 * "Completed" = batch date is strictly before today.
 * Returns null if the person has no past batch.
 */
export function getLastBatch(
  name: string,
  today: Date = new Date(),
): { batch: Batch; role: BenchRole } | null {
  const todayStr = today.toISOString().slice(0, 10);
  const past = BATCHES.filter((b) => b.date < todayStr && roleInBatch(b, name));
  if (past.length === 0) return null;
  const batch = past[past.length - 1];
  return { batch, role: roleInBatch(batch, name)! };
}

/**
 * The next upcoming batch for `name` as of `today`.
 * "Upcoming" = batch date is on or after today.
 * Returns null if no future batches are assigned.
 */
export function getNextSlot(
  name: string,
  today: Date = new Date(),
): { batch: Batch; role: BenchRole } | null {
  const todayStr = today.toISOString().slice(0, 10);
  const future = BATCHES.filter((b) => b.date >= todayStr && roleInBatch(b, name));
  if (future.length === 0) return null;
  const batch = future[0];
  return { batch, role: roleInBatch(batch, name)! };
}

/**
 * Formats an ISO date string as "Mon D" (e.g. "Apr 30", "Jul 9").
 */
export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

// ══════════════════════════════════════════════════════════════════════════════
//  WEEK OVERRIDE MODEL
// ══════════════════════════════════════════════════════════════════════════════

// ── Roster ────────────────────────────────────────────────────────────────────

export const BENCH_ROSTER = [
  "Marie T.",
  "Sam K.",
  "Jordan L.",
  "Alex B.",
];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ScheduledBenchRole {
  weekId: string;
  primary: string;
  standby: string;
}

/**
 * The roles the OM should treat as authoritative for a given week.
 * When a swap has been applied, `*SwappedFrom` holds the original name and
 * `*Reason` holds the OM's note.
 */
export interface EffectiveBenchRole {
  weekId: string;
  primary: string;
  standby: string;
  primarySwappedFrom?: string;
  standbySwappedFrom?: string;
  primaryReason?: string;
  standbyReason?: string;
}

// ── Week-ID helpers ───────────────────────────────────────────────────────────

/**
 * Returns the ISO week number (1-based) for a given date using the
 * ISO-8601 definition (week containing the first Thursday of the year).
 */
export function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);
}

/** Returns the ISO week year (may differ from calendar year near year boundaries). */
export function isoWeekYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return d.getUTCFullYear();
}

/** Returns the weekId string for a Date, e.g. "2026-W20". */
export function weekIdFromDate(date: Date): string {
  const w = isoWeekNumber(date);
  const y = isoWeekYear(date);
  return `${y}-W${String(w).padStart(2, "0")}`;
}

/** Returns the weekId for today. */
export function currentWeekId(): string {
  return weekIdFromDate(new Date());
}

/**
 * Parse a weekId string ("2026-W20") into { year, week }.
 * Returns null if the string is malformed.
 */
export function parseWeekId(weekId: string): { year: number; week: number } | null {
  const m = weekId.match(/^(\d{4})-W(\d{2})$/);
  if (!m) return null;
  return { year: parseInt(m[1], 10), week: parseInt(m[2], 10) };
}

/**
 * Returns the Monday ISO date string ("YYYY-MM-DD") for the given weekId.
 * Uses the ISO-8601 algorithm: find Jan 4 (always in week 1), then walk to
 * the requested week's Monday.
 */
export function mondayOfWeek(weekId: string): string {
  const parsed = parseWeekId(weekId);
  if (!parsed) return "";
  const { year, week } = parsed;
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Dow = jan4.getUTCDay() || 7;
  const week1Mon = new Date(jan4.getTime() - (jan4Dow - 1) * 86_400_000);
  const targetMon = new Date(week1Mon.getTime() + (week - 1) * 7 * 86_400_000);
  return targetMon.toISOString().slice(0, 10);
}

/** Returns a short human label, e.g. "W20 · May 11–15, 2026". */
export function formatWeekLabel(weekId: string): string {
  const parsed = parseWeekId(weekId);
  if (!parsed) return weekId;
  const monStr = mondayOfWeek(weekId);
  if (!monStr) return weekId;
  const mon = new Date(monStr + "T12:00:00Z");
  const fri = new Date(mon.getTime() + 4 * 86_400_000);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `W${parsed.week} · ${fmt(mon)}–${fmt(fri)}, ${parsed.year}`;
}

/**
 * Returns the weekId for the week before the given one, accounting for
 * year boundaries.
 */
export function prevWeekId(weekId: string): string {
  const monStr = mondayOfWeek(weekId);
  if (!monStr) return weekId;
  const prev = new Date(monStr + "T12:00:00Z");
  prev.setUTCDate(prev.getUTCDate() - 7);
  return weekIdFromDate(prev);
}

/** Returns the weekId for the week after the given one. */
export function nextWeekId(weekId: string): string {
  const monStr = mondayOfWeek(weekId);
  if (!monStr) return weekId;
  const next = new Date(monStr + "T12:00:00Z");
  next.setUTCDate(next.getUTCDate() + 7);
  return weekIdFromDate(next);
}

// ── Rotation logic ────────────────────────────────────────────────────────────

/**
 * Returns the scheduled (pre-override) bench roles for a week.
 *
 * Uses the absolute week ordinal (weeks since a fixed epoch) to drive the
 * round-robin so the schedule is deterministic and survives year rollovers
 * without drift.
 */
export function getScheduledBench(weekId: string): ScheduledBenchRole {
  const parsed = parseWeekId(weekId);
  const n = parsed ? (parsed.year - 2026) * 52 + parsed.week : 0;
  const len = BENCH_ROSTER.length;
  return {
    weekId,
    primary: BENCH_ROSTER[((n % len) + len) % len],
    standby: BENCH_ROSTER[(((n + 1) % len) + len) % len],
  };
}

/**
 * Returns the effective bench role for a week by merging the rotation
 * schedule with any saved BenchOverride.
 *
 * Pass an explicit override to avoid a redundant localStorage read when
 * the caller already has it; omit to load from storage automatically.
 */
export function getEffectiveBench(
  weekId: string,
  override?: BenchOverride | null,
): EffectiveBenchRole {
  const scheduled = getScheduledBench(weekId);
  const ov = override !== undefined ? override : loadBenchOverride(weekId);

  const effective: EffectiveBenchRole = {
    weekId,
    primary: scheduled.primary,
    standby: scheduled.standby,
  };

  if (ov?.primaryName) {
    effective.primarySwappedFrom = scheduled.primary;
    effective.primary = ov.primaryName;
    if (ov.primaryReason?.trim()) effective.primaryReason = ov.primaryReason.trim();
  }

  if (ov?.standbyName) {
    effective.standbySwappedFrom = scheduled.standby;
    effective.standby = ov.standbyName;
    if (ov.standbyReason?.trim()) effective.standbyReason = ov.standbyReason.trim();
  }

  return effective;
}

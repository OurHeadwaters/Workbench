/**
 * saltBench.ts
 *
 * Source-of-truth for the Salt bench rotation Q2–Q4 2026.
 *
 * BATCHES drives every "Last batch" and "Next slot" cell on the
 * SaltBench slide (VI · 02b). Edit this file when the rotation
 * changes — the slide auto-updates.
 *
 * Role meanings:
 *   primary — leads the batch day (prep, labelling, handoff)
 *   backup  — on-call cover; handles the batch if primary is unavailable
 */

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

// ── Helpers ───────────────────────────────────────────────────────────────────

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

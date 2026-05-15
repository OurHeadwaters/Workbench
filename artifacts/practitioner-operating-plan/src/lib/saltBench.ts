/**
 * saltBench.ts
 *
 * Salt batch rotation data and bench-override helpers for the Deer Lake
 * salt cost-centre (SALT-01).
 *
 * Each batch slot defines a scheduled production week with a default
 * primary bench worker and a standby. The OM can post a bench override
 * for any slot; `getEffectiveBatch` merges the default with any stored
 * override so callers never need to know whether a slot was swapped.
 *
 * Storage contract:
 *   Overrides are persisted via `loadBenchOverrides` / `saveBenchOverride`
 *   / `clearBenchOverride` in lib/storage.ts.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BatchSlot {
  /** ISO week number (1–52) */
  isoWeek: number;
  /** Human label shown in UI, e.g. "Batch 3" */
  batchLabel: string;
  /** Printable date range, e.g. "Apr 13–17" */
  dateRange: string;
  /** Default (rotation-scheduled) primary bench worker */
  defaultPrimary: string;
  /** Default (rotation-scheduled) standby bench worker */
  defaultStandby: string;
}

export interface BenchOverride {
  isoWeek: number;
  /** Overridden primary name, if changed */
  primary?: string;
  /** Overridden standby name, if changed */
  standby?: string;
  /** One-line reason the OM noted, e.g. "Marie sick" */
  reason?: string;
  /** ISO timestamp of when the override was saved */
  swappedAt: string;
}

/** A slot with overrides applied — the single shape callers should use */
export interface EffectiveBatch extends BatchSlot {
  /** Resolved primary (override wins if present) */
  primary: string;
  /** Resolved standby (override wins if present) */
  standby: string;
  /** Present only when at least one field was overridden */
  override?: BenchOverride;
}

// ── Q2 2026 batch schedule ────────────────────────────────────────────────────
//
// Pilot Execution phase runs W16–W44 (Apr 13 – Nov 1, 2026).
// Production batches run roughly every 2–3 weeks during the season.
// Names here come from the 807 piecework bench pool.

export const Q2_BATCHES: BatchSlot[] = [
  {
    isoWeek: 16,
    batchLabel: "Batch 1",
    dateRange: "Apr 13–17",
    defaultPrimary: "Marie T.",
    defaultStandby: "Dale R.",
  },
  {
    isoWeek: 19,
    batchLabel: "Batch 2",
    dateRange: "May 4–8",
    defaultPrimary: "Dale R.",
    defaultStandby: "Sandra K.",
  },
  {
    isoWeek: 21,
    batchLabel: "Batch 3",
    dateRange: "May 18–22",
    defaultPrimary: "Sandra K.",
    defaultStandby: "Marie T.",
  },
  {
    isoWeek: 23,
    batchLabel: "Batch 4",
    dateRange: "Jun 1–5",
    defaultPrimary: "Marie T.",
    defaultStandby: "Dale R.",
  },
  {
    isoWeek: 26,
    batchLabel: "Batch 5",
    dateRange: "Jun 22–26",
    defaultPrimary: "Dale R.",
    defaultStandby: "Sandra K.",
  },
  {
    isoWeek: 29,
    batchLabel: "Batch 6",
    dateRange: "Jul 13–17",
    defaultPrimary: "Sandra K.",
    defaultStandby: "Marie T.",
  },
  {
    isoWeek: 32,
    batchLabel: "Batch 7",
    dateRange: "Aug 3–7",
    defaultPrimary: "Marie T.",
    defaultStandby: "Dale R.",
  },
  {
    isoWeek: 35,
    batchLabel: "Batch 8",
    dateRange: "Aug 24–28",
    defaultPrimary: "Dale R.",
    defaultStandby: "Sandra K.",
  },
  {
    isoWeek: 38,
    batchLabel: "Batch 9",
    dateRange: "Sep 14–18",
    defaultPrimary: "Sandra K.",
    defaultStandby: "Marie T.",
  },
  {
    isoWeek: 41,
    batchLabel: "Batch 10",
    dateRange: "Oct 5–9",
    defaultPrimary: "Marie T.",
    defaultStandby: "Dale R.",
  },
  {
    isoWeek: 44,
    batchLabel: "Batch 11",
    dateRange: "Oct 26–30",
    defaultPrimary: "Dale R.",
    defaultStandby: "Sandra K.",
  },
];

// ── Resolver ──────────────────────────────────────────────────────────────────

/**
 * Merges a `BatchSlot` with any stored `BenchOverride` for that week.
 * Returns an `EffectiveBatch` where `primary` and `standby` always reflect
 * the current assignment (defaulting to the rotation schedule when no
 * override exists).
 */
export function getEffectiveBatch(
  slot: BatchSlot,
  overrides: Record<number, BenchOverride>,
): EffectiveBatch {
  const override = overrides[slot.isoWeek];
  return {
    ...slot,
    primary:  override?.primary  ?? slot.defaultPrimary,
    standby:  override?.standby  ?? slot.defaultStandby,
    override: override,
  };
}

/**
 * Returns all batch slots resolved against the given overrides map,
 * sorted by isoWeek ascending.
 */
export function getAllEffectiveBatches(
  overrides: Record<number, BenchOverride>,
): EffectiveBatch[] {
  return [...Q2_BATCHES]
    .sort((a, b) => a.isoWeek - b.isoWeek)
    .map((slot) => getEffectiveBatch(slot, overrides));
}

// ── Batch-override localStorage helpers ───────────────────────────────────────

const KEY_BATCH_OVERRIDES = "hwop_bench_overrides_v1";

/** Load all batch-model overrides keyed by isoWeek. */
export function loadBenchOverrides(): Record<number, BenchOverride> {
  try {
    const raw = localStorage.getItem(KEY_BATCH_OVERRIDES);
    if (!raw) return {};
    return JSON.parse(raw) as Record<number, BenchOverride>;
  } catch {
    return {};
  }
}

function persistBatchOverrides(data: Record<number, BenchOverride>): void {
  localStorage.setItem(KEY_BATCH_OVERRIDES, JSON.stringify(data));
}

/** Save (or overwrite) the batch-model override for a specific ISO week. */
export function saveBatchOverride(override: BenchOverride): void {
  const data = loadBenchOverrides();
  data[override.isoWeek] = override;
  persistBatchOverrides(data);
}

/** Remove the batch-model override for a specific ISO week. */
export function clearBenchOverride(isoWeek: number): void {
  const data = loadBenchOverrides();
  delete data[isoWeek];
  persistBatchOverrides(data);
}

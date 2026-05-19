/**
 * stonemasonOverrides.ts
 *
 * localStorage helpers for Zone 3 income-driver overrides.
 *
 * The founder dials key assumptions (retainer count, engagement count,
 * guild cohort size, rates) and sees the StonemasonRunway and
 * StonemasonPricing slides update live — same pattern as costReview.ts.
 *
 * Storage key: hwop_zone3_overrides_v1
 */

// ── Types ──────────────────────────────────────────────────────────────

export interface Zone3Override {
  key: string;
  defaultValue: number;
  value: number;
  note?: string;
  editedAt: string;
}

export interface Zone3InputDef {
  key: string;
  label: string;
  description: string;
  defaultValue: number;
  /** Display unit label shown after the input */
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  group: "rates" | "year1" | "year2" | "year3";
}

// ── Input definitions ──────────────────────────────────────────────────
//
// These are the driveable assumptions exposed in the Cost Review modal.
// Defaults mirror the midpoints of the ranges in stonemason.ts.

export const ZONE3_INPUTS: Zone3InputDef[] = [
  // ── Global rates ────────────────────────────────────────────
  {
    key: "retainer_rate",
    label: "Stewardship retainer rate",
    description: "Monthly fee per active retained client",
    defaultValue: 400,
    unit: "$/mo",
    min: 0,
    step: 50,
    group: "rates",
  },
  {
    key: "full_launch_fee",
    label: "Full Launch Package fee",
    description: "Per engagement — Discovery + Foundation Build + Training + 30-day support",
    defaultValue: 6_000,
    unit: "$",
    min: 0,
    step: 500,
    group: "rates",
  },
  {
    key: "guild_price_per_person",
    label: "Guild cohort fee",
    description: "Per-person certification cohort price",
    defaultValue: 1_500,
    unit: "$/person",
    min: 0,
    step: 100,
    group: "rates",
  },
  {
    key: "guild_tithe_pct",
    label: "Guild tithe %",
    description: "% of certification fee back to the founding practitioner — for life of certification",
    defaultValue: 8,
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    group: "rates",
  },
  {
    key: "discovery_fee",
    label: "Discovery call fee",
    description: "Per 90-min scoped discovery call",
    defaultValue: 500,
    unit: "$",
    min: 0,
    step: 50,
    group: "rates",
  },

  // ── Year 1 ──────────────────────────────────────────────────
  // Defaults are calibrated to the midpoints of the original planning ranges so that
  // computeIncomeYears(ZONE3_DEFAULTS) approximates the static INCOME_YEARS baseline.
  {
    key: "y1_engagements",
    label: "Engagements — Year 1",
    description: "Number of full practitioner engagements closed",
    defaultValue: 1,
    unit: "count",
    min: 0,
    step: 1,
    group: "year1",
  },
  {
    key: "y1_retainers",
    label: "Retainer clients — Year 1",
    description: "Active stewardship retainer clients by end of year",
    defaultValue: 2,
    unit: "count",
    min: 0,
    step: 1,
    group: "year1",
  },
  {
    key: "y1_guild_cohort",
    label: "Guild cohort size — Year 1",
    description: "People certified in the pilot cohort",
    defaultValue: 5,
    unit: "count",
    min: 0,
    step: 1,
    group: "year1",
  },
  {
    key: "y1_discovery_calls",
    label: "Discovery calls — Year 1",
    description: "Paid discovery calls conducted",
    defaultValue: 7,
    unit: "count",
    min: 0,
    step: 1,
    group: "year1",
  },
  {
    key: "y1_grant",
    label: "Grant + consulting — Year 1",
    description: "Grant positioning and consulting revenue (total for year)",
    defaultValue: 10_000,
    unit: "$",
    min: 0,
    step: 1_000,
    group: "year1",
  },

  // ── Year 2 ──────────────────────────────────────────────────
  {
    key: "y2_engagements",
    label: "Engagements — Year 2",
    description: "New full practitioner engagements",
    defaultValue: 4,
    unit: "count",
    min: 0,
    step: 1,
    group: "year2",
  },
  {
    key: "y2_retainers",
    label: "Retainer clients — Year 2",
    description: "Active stewardship retainers",
    defaultValue: 7,
    unit: "count",
    min: 0,
    step: 1,
    group: "year2",
  },
  {
    key: "y2_guild_cohort",
    label: "Guild cohort size — Year 2",
    description: "People in the Year 2 certification cohort",
    defaultValue: 10,
    unit: "count",
    min: 0,
    step: 1,
    group: "year2",
  },
  {
    key: "y2_grant",
    label: "Grant + consulting — Year 2",
    description: "Grant fees and consulting revenue (total for year)",
    defaultValue: 19_500,
    unit: "$",
    min: 0,
    step: 1_000,
    group: "year2",
  },

  // ── Year 3 ──────────────────────────────────────────────────
  {
    key: "y3_engagements",
    label: "Engagements — Year 3",
    description: "New engagements per year",
    defaultValue: 7,
    unit: "count",
    min: 0,
    step: 1,
    group: "year3",
  },
  {
    key: "y3_retainers",
    label: "Retainer clients — Year 3",
    description: "Active stewardship retainers",
    defaultValue: 13,
    unit: "count",
    min: 0,
    step: 1,
    group: "year3",
  },
  {
    key: "y3_guild_cohort",
    label: "Guild cohort size — Year 3",
    description: "People per cohort per year",
    defaultValue: 16,
    unit: "count",
    min: 0,
    step: 1,
    group: "year3",
  },
  {
    key: "y3_grant",
    label: "Grant + consulting — Year 3",
    description: "Grant fees and consulting revenue (total for year)",
    defaultValue: 32_000,
    unit: "$",
    min: 0,
    step: 1_000,
    group: "year3",
  },
];

// ── Default values map ─────────────────────────────────────────────────

export const ZONE3_DEFAULTS: Record<string, number> = Object.fromEntries(
  ZONE3_INPUTS.map((d) => [d.key, d.defaultValue])
);

// ── Storage ────────────────────────────────────────────────────────────

const STORAGE_KEY = "hwop_zone3_overrides_v1";

type OverrideStore = Record<string, Zone3Override>;

function load(): OverrideStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as OverrideStore;
  } catch {
    return {};
  }
}

function persist(store: OverrideStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Return all overrides as a plain key→value map.
 * Keys not present use their default from ZONE3_DEFAULTS.
 */
export function loadOverrideValues(): Record<string, number> {
  const store = load();
  const result: Record<string, number> = { ...ZONE3_DEFAULTS };
  for (const [k, ov] of Object.entries(store)) {
    result[k] = ov.value;
  }
  return result;
}

/** Return the full override records (for the audit/edits view). */
export function loadOverrides(): Zone3Override[] {
  return Object.values(load()).sort(
    (a, b) => new Date(b.editedAt).getTime() - new Date(a.editedAt).getTime()
  );
}

/** Return the override record for a single key, or null. */
export function loadOverride(key: string): Zone3Override | null {
  return load()[key] ?? null;
}

/** Save (or update) an override for a given key. */
export function saveOverride(key: string, value: number, note?: string): void {
  const def = ZONE3_INPUTS.find((d) => d.key === key);
  const store = load();
  store[key] = {
    key,
    defaultValue: def?.defaultValue ?? value,
    value,
    note: note?.trim() || undefined,
    editedAt: new Date().toISOString(),
  };
  persist(store);
}

/** Remove a single override, restoring the default. */
export function clearOverride(key: string): void {
  const store = load();
  delete store[key];
  persist(store);
}

/** Remove all Zone 3 overrides. */
export function clearAllOverrides(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** True if any overrides are currently stored. */
export function hasAnyOverrides(): boolean {
  return Object.keys(load()).length > 0;
}

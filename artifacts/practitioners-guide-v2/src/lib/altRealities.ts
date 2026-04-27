import { SCENARIOS } from "@/data/scenarios";
import type { Scenario } from "@/data/types";

/**
 * Operating-framework workspace state.
 *
 * V3 is the locked default operating framework — it's read-only on the
 * Compare page and sourced directly from SCENARIO_V3. Everything else is
 * stored in this module: editable "alternative reality" tabs that the
 * founder uses to talk through a turn ("what if the fee landed at $100k?",
 * "what if we added one role?") without having to touch source data.
 *
 * Each row in an alt reality carries:
 *   - value:  the proposed number (defaults to V3's number on first add)
 *   - locked: a per-row commit flag (the founder ticks rows they've decided)
 *
 * The Δ-vs-V3 cell on the page is computed at render time as
 * (alt.value − v3.value); we don't store it.
 *
 * Persistence: localStorage under PGV2_ALT_REALITIES_KEY. Storage is best-effort —
 * if the browser blocks it (private mode, quota), the page still renders with
 * the in-memory defaults.
 *
 * Seeding: on first load (no stored state) the workspace is seeded with V4
 * pre-populated as the first alternative reality, every row locked, since
 * V4's right-priced numbers are the most-talked-about alternative on
 * 2026-04-26 and we want the page to be useful before the reader does
 * anything.
 */

export const PGV2_ALT_REALITIES_KEY = "pgv2.altRealities";

/** Compact key for a metric. Stable across versions; safe to store. */
export type MetricKey =
  | "agencyFee"
  | "agencyTitheMonthly"
  | "agencyPayroll"
  | "agencyCostBasisSep"
  | "agencyMonthlySurplusSep"
  | "agencyCapitalRecoveryMonths"
  | "agency18moRevenue"
  | "agency18moTithe"
  | "agency18moPayroll"
  | "agency18moOverheads"
  | "agency18moSurplusDeployed"
  | "agency18moReserve"
  | "agency18moInnovation"
  | "personalTotal18mo"
  | "personalPerYear";

export type MetricUnit = "money" | "months" | "count";

export interface MetricDef {
  key: MetricKey;
  bucket: string;
  label: string;
  unit: MetricUnit;
  /** Hint to show under the label, optional. */
  hint?: string;
  /** How to read the locked V3 anchor value. */
  fromScenario: (s: Scenario) => number;
}

/**
 * Metric catalogue.
 *
 * Mirrors the headline rows in the founder's spec. Salts / 807 / Brightside
 * aren't included because they're shared (identical across every scenario)
 * — there's no Δ to talk about. Personal cash IS included even though V3
 * and V4 happen to match today, because future alt realities (lifting the
 * lead draw, taking less owner take, etc.) are exactly what this workspace
 * is for.
 */
export const METRICS: MetricDef[] = [
  {
    key: "agencyFee",
    bucket: "Agency — monthly",
    label: "Monthly fee",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.fee,
  },
  {
    key: "agencyTitheMonthly",
    bucket: "Agency — monthly",
    label: "Monthly tithe (10% of fee)",
    unit: "money",
    hint: "Top of waterfall, first claim on revenue",
    fromScenario: (s) => s.contracts.agency.titheMonthly,
  },
  {
    key: "agencyPayroll",
    bucket: "Agency — monthly",
    label: "Monthly payroll",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.payrollTotal,
  },
  {
    key: "agencyCostBasisSep",
    bucket: "Agency — monthly",
    label: "Monthly cost basis (Sep+)",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.costBasisSepOnward,
  },
  {
    key: "agencyMonthlySurplusSep",
    bucket: "Agency — monthly",
    label: "Monthly surplus (Sep+)",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.monthlySurplusSepOnward,
  },
  {
    key: "agencyCapitalRecoveryMonths",
    bucket: "Agency — monthly",
    label: "Capital recovery duration",
    unit: "months",
    hint: "How long the $112k debt stack takes to retire",
    fromScenario: (s) => s.contracts.agency.capitalRecoveryMonths,
  },
  {
    key: "agency18moRevenue",
    bucket: "Agency — 18-month totals",
    label: "Revenue",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.totals18mo.revenue,
  },
  {
    key: "agency18moTithe",
    bucket: "Agency — 18-month totals",
    label: "Tithe — Giving (10% off the top)",
    unit: "money",
    hint: "First claim on revenue, before cost basis or capital recovery",
    fromScenario: (s) => s.contracts.agency.totals18mo.tithe,
  },
  {
    key: "agency18moPayroll",
    bucket: "Agency — 18-month totals",
    label: "Payroll",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.totals18mo.payroll,
  },
  {
    key: "agency18moOverheads",
    bucket: "Agency — 18-month totals",
    label: "Overheads",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.totals18mo.overheads,
  },
  {
    key: "agency18moSurplusDeployed",
    bucket: "Agency — 18-month totals",
    label: "Surplus deployed",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.totals18mo.surplusDeployed,
  },
  {
    key: "agency18moReserve",
    bucket: "Agency — Phase 3 splits",
    label: "Reserve (75%)",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.totals18mo.reserve,
  },
  {
    key: "agency18moInnovation",
    bucket: "Agency — Phase 3 splits",
    label: "Innovation (25%)",
    unit: "money",
    fromScenario: (s) => s.contracts.agency.totals18mo.innovation,
  },
  {
    key: "personalTotal18mo",
    bucket: "Personal cash",
    label: "Total personal cash, 18 mo",
    unit: "money",
    fromScenario: (s) => s.personal.total18mo,
  },
  {
    key: "personalPerYear",
    bucket: "Personal cash",
    label: "Per-year average",
    unit: "money",
    fromScenario: (s) => s.personal.perYear,
  },
];

/** Per-row state inside an alternative reality. */
export interface AltRow {
  value: number;
  locked: boolean;
}

/** A single editable alternative reality tab. */
export interface AltReality {
  id: string;
  name: string;
  /** Free-form one-line description shown under the tab name. */
  note?: string;
  /** Sparse map keyed by MetricKey. Missing keys fall back to V3 value. */
  rows: Partial<Record<MetricKey, AltRow>>;
}

/** The full workspace state persisted in localStorage. */
export interface AltRealityState {
  realities: AltReality[];
  /** Id of the active tab. May be missing if `realities` is empty. */
  activeId: string | null;
}

/**
 * Build the V4-seeded default state. Every metric pulled from SCENARIO_V4,
 * every row locked (V4 is itself a locked scenario; the founder hasn't asked
 * to unlock anything in V4, only to compare against it).
 */
export function buildDefaultState(): AltRealityState {
  const v4 = SCENARIOS.v4;
  const rows: Partial<Record<MetricKey, AltRow>> = {};
  for (const m of METRICS) {
    rows[m.key] = { value: m.fromScenario(v4), locked: true };
  }
  const reality: AltReality = {
    id: "v4-seed",
    name: "V4 — Right-priced",
    note:
      "Same lean roster as V3, fee lifted to $105k/mo so the Sep-onward operating margin (pre-tithe) lands at the 38.6% band.",
    rows,
  };
  return { realities: [reality], activeId: reality.id };
}

/**
 * Load workspace state. Falls back to the V4-seeded default on:
 *  - no stored value
 *  - JSON parse failure
 *  - structurally invalid value (non-array `realities`, missing required
 *    fields, etc.)
 *
 * Unknown metric keys inside row maps are *kept* (forward-compat with future
 * metric additions in older browsers); unknown structural fields are
 * preserved in the in-memory object but the validator won't trip on them.
 */
export function loadAltRealityState(): AltRealityState {
  if (typeof window === "undefined" || !window.localStorage) {
    return buildDefaultState();
  }
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(PGV2_ALT_REALITIES_KEY);
  } catch {
    return buildDefaultState();
  }
  if (raw == null) return buildDefaultState();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return buildDefaultState();
  }
  if (!isAltRealityState(parsed)) return buildDefaultState();
  return parsed;
}

/**
 * Save workspace state. Best-effort: localStorage exceptions (quota,
 * disabled storage) are swallowed — saving must never throw because the
 * Compare page calls this on every keystroke / click.
 */
export function saveAltRealityState(state: AltRealityState): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(PGV2_ALT_REALITIES_KEY, JSON.stringify(state));
  } catch {
    // ignore — see docstring
  }
}

/**
 * Generate a stable id for a new alt reality. Prefix + timestamp +
 * 4-char random suffix is enough collision resistance for a single-user
 * local workspace.
 */
export function newRealityId(): string {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `alt-${Date.now().toString(36)}-${suffix}`;
}

/**
 * Build a fresh alt reality whose rows all start at the V3 anchor values
 * (so Δ-vs-V3 reads as zero everywhere until the founder edits a row).
 * Rows start unlocked — the founder locks each row as they decide it.
 */
export function buildAltRealityFromV3(name: string): AltReality {
  const v3 = SCENARIOS.v3;
  const rows: Partial<Record<MetricKey, AltRow>> = {};
  for (const m of METRICS) {
    rows[m.key] = { value: m.fromScenario(v3), locked: false };
  }
  return {
    id: newRealityId(),
    name,
    rows,
  };
}

/** Read the V3 anchor for a metric — used by the page for the left-hand column and Δ math. */
export function readV3Value(key: MetricKey): number {
  const def = METRICS.find((m) => m.key === key);
  if (!def) throw new Error(`Unknown metric key: ${key}`);
  return def.fromScenario(SCENARIOS.v3);
}

/**
 * Get an alt reality's value for a metric, falling back to V3 if the row
 * was never set (sparse storage). Always returns a finite number.
 */
export function readAltValue(reality: AltReality, key: MetricKey): number {
  const row = reality.rows[key];
  if (row && Number.isFinite(row.value)) return row.value;
  return readV3Value(key);
}

/**
 * Update one row inside one reality. Returns a new state object — callers
 * should pass the new state to React state setters and saveAltRealityState.
 */
export function setAltRow(
  state: AltRealityState,
  realityId: string,
  key: MetricKey,
  patch: Partial<AltRow>,
): AltRealityState {
  return {
    ...state,
    realities: state.realities.map((r) => {
      if (r.id !== realityId) return r;
      const existing = r.rows[key] ?? { value: readV3Value(key), locked: false };
      return {
        ...r,
        rows: { ...r.rows, [key]: { ...existing, ...patch } },
      };
    }),
  };
}

/** Add a new reality to the state and make it active. */
export function addAltReality(state: AltRealityState, name: string): AltRealityState {
  const reality = buildAltRealityFromV3(name);
  return {
    realities: [...state.realities, reality],
    activeId: reality.id,
  };
}

/** Remove a reality. The next reality (or null) becomes active. */
export function removeAltReality(state: AltRealityState, realityId: string): AltRealityState {
  const next = state.realities.filter((r) => r.id !== realityId);
  let activeId = state.activeId;
  if (activeId === realityId) {
    activeId = next[0]?.id ?? null;
  }
  return { realities: next, activeId };
}

/** Rename a reality (no-op if name is empty after trim). */
export function renameAltReality(
  state: AltRealityState,
  realityId: string,
  name: string,
): AltRealityState {
  const trimmed = name.trim();
  if (!trimmed) return state;
  return {
    ...state,
    realities: state.realities.map((r) =>
      r.id === realityId ? { ...r, name: trimmed } : r,
    ),
  };
}

function isAltRealityState(v: unknown): v is AltRealityState {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  if (!Array.isArray(obj.realities)) return false;
  for (const r of obj.realities) {
    if (typeof r !== "object" || r === null) return false;
    const reality = r as Record<string, unknown>;
    if (typeof reality.id !== "string" || typeof reality.name !== "string") return false;
    if (typeof reality.rows !== "object" || reality.rows === null) return false;
  }
  if (obj.activeId !== null && typeof obj.activeId !== "string") return false;
  return true;
}

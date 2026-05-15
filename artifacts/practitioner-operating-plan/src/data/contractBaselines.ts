/**
 * contractBaselines.ts — locked Deer Lake contracted role baselines
 *
 * THIS IS THE SINGLE SOURCE OF TRUTH for per-role pillar allocations.
 *
 * Rules:
 *   - Edit here ONLY through the /contract-terms amendment flow.
 *   - Never edit baseline percents directly in a quarterly report form.
 *   - Each role's pillar percents must sum to exactly 100.
 *   - Adding a role here is a contract amendment — record it in AMENDMENT_LOG.
 *
 * The quarterly HoursByPillar report imports BASELINES as read-only.
 * If a role appears in the quarterly form but not in BASELINES, the report
 * flags it and asks the bookkeeper to amend the contract before filing.
 */

// ── Pillars ───────────────────────────────────────────────────────────────────

export const PILLARS = [
  { id: "cfs",  label: "Community Food Systems",   color: "#2d6a4f" },
  { id: "ops",  label: "Operations & Admin",        color: "#1b4d8e" },
  { id: "gov",  label: "Governance & Reporting",    color: "#6b3fa0" },
  { id: "eng",  label: "Engagement & Development",  color: "#b85a3e" },
] as const;

export type PillarId = typeof PILLARS[number]["id"];

// ── Role baseline type ────────────────────────────────────────────────────────

export interface RoleBaseline {
  /** Stable machine key — must not change once used in filed quarters */
  roleId:        string;
  /** Human-readable label shown in the UI */
  label:         string;
  /** Monthly contracted hours (used to validate quarterly totals) */
  contractedHrsPerMonth: number;
  /** Pillar allocation percents — must sum to 100 */
  pillars: Record<PillarId, number>;
  /** Optional note printed on the quarterly report */
  note?:         string;
}

// ── Contract metadata ─────────────────────────────────────────────────────────

export const CONTRACT_VERSION = "v1.0";
export const CONTRACT_DATE    = "2025-05-01";   // ISO date the baselines were agreed

/**
 * Semantic label shown on every quarterly report so the bookkeeper always
 * knows which contract version the baselines came from.
 */
export const CONTRACT_LABEL = `${CONTRACT_VERSION} · signed ${CONTRACT_DATE}`;

// ── Baselines (one entry per contracted role) ─────────────────────────────────
//
// Pillar percents for each role must sum to exactly 100.
// Adjusting these numbers is a contract amendment — use the /contract-terms page.
//
export const BASELINES: RoleBaseline[] = [
  {
    roleId: "practitioner",
    label: "Practitioner / Lead",
    contractedHrsPerMonth: 120,
    pillars: { cfs: 30, ops: 20, gov: 20, eng: 30 },
    note: "Engagement owner — hours split across all pillars by design.",
  },
  {
    roleId: "ops-manager",
    label: "Operations Manager",
    contractedHrsPerMonth: 160,
    pillars: { cfs: 20, ops: 65, gov: 5, eng: 10 },
    note: "Primary pillar: Operations & Admin (65%). Phone-holder role.",
  },
  {
    roleId: "it-tech",
    label: "IT / Tech",
    contractedHrsPerMonth: 80,
    pillars: { cfs: 20, ops: 55, gov: 15, eng: 10 },
  },
  {
    roleId: "bookkeeper",
    label: "Bookkeeper / Admin",
    contractedHrsPerMonth: 40,
    pillars: { cfs: 5, ops: 40, gov: 40, eng: 15 },
    note: "Primary pillar: Operations & Admin / Governance equally (40% each).",
  },
  {
    roleId: "food-handler",
    label: "Food Handler (embedded at Deer Lake)",
    contractedHrsPerMonth: 160,
    pillars: { cfs: 80, ops: 15, gov: 0, eng: 5 },
    note: "Primary pillar: Community Food Systems (80%). Salt batches, 807 piecework.",
  },
  {
    roleId: "cd-associate",
    label: "CD Associate",
    contractedHrsPerMonth: 80,
    pillars: { cfs: 25, ops: 15, gov: 15, eng: 45 },
    note: "Engagement #2 readiness seat. Primary pillar: Engagement & Development (45%).",
  },
  {
    roleId: "junior-analyst",
    label: "Junior Analyst",
    contractedHrsPerMonth: 60,
    pillars: { cfs: 35, ops: 20, gov: 30, eng: 15 },
    note: "Data, household lookups, fieldwork.",
  },
] as const satisfies RoleBaseline[];

// ── Sanity check (runs at module-load time in dev) ────────────────────────────

if (import.meta.env.DEV) {
  for (const role of BASELINES) {
    const sum = (Object.values(role.pillars) as number[]).reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      throw new Error(
        `[contractBaselines] Role "${role.roleId}" pillar percents sum to ${sum}, expected 100.`,
      );
    }
  }
}

// ── Amendment log ─────────────────────────────────────────────────────────────
//
// Historical record of all deliberate changes to these baselines.
// New entries are prepended (most-recent first) by the /contract-terms page.
// This array is the durable audit trail — it lives in code, not in localStorage,
// so it survives browser clears and is version-controlled.
//
// Pending amendments recorded in the /contract-terms page (localStorage) are
// reflected here only after a practitioner or bookkeeper commits the edit to
// this file.
//
export interface Amendment {
  version:     string;
  date:        string;    // ISO date
  amendedBy:   string;
  reason:      string;
  changes:     string;
}

export const AMENDMENT_LOG: Amendment[] = [
  {
    version:   "v1.0",
    date:      "2025-05-01",
    amendedBy: "Practitioner",
    reason:    "Initial contract baselines — agreed at contract signing.",
    changes:   "First version. Established all seven roles and their pillar allocations.",
  },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getBaseline(roleId: string): RoleBaseline | undefined {
  return BASELINES.find((r) => r.roleId === roleId);
}

export function getPillar(id: PillarId) {
  return PILLARS.find((p) => p.id === id)!;
}

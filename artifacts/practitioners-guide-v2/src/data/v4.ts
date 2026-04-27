import { confirmed, tbd } from "./tags";
import type { RenegotiationTrigger, Scenario } from "./types";
import {
  SHARED_BRIGHTSIDE,
  SHARED_CDP807,
  SHARED_GIVING_DIRECTION,
  SHARED_OVERHEADS_JUN_AUG,
  SHARED_OVERHEADS_JUN_AUG_TOTAL,
  SHARED_OVERHEADS_SEP_ONWARD,
  SHARED_OVERHEADS_SEP_ONWARD_TOTAL,
  SHARED_RESERVE_PURPOSES,
  SHARED_SALTS,
} from "./shared";

/**
 * V4 — Right-priced scenario.
 *
 * STATUS: LOCKED on 2026-04-26. V4 ships in two places: as a real scenario
 * the reader can switch to via the global toggle, AND as the first
 * pre-loaded "alternative reality" tab on the Compare / operating-framework
 * workspace, where the founder can clone it, lock individual rows, and use
 * it as the starting point for new scenarios.
 *
 * 2026-04-27 update — Tithe-shaped giving.
 *   Same restructure as V3: Giving moves from a residual Phase 3 split share
 *   (25% of surplus) to a top-of-waterfall first claim on revenue (10% off
 *   the top). Cascade against the locked $105k fee:
 *     - Tithe: $10,500/mo → $189,000 over 18 months (was $141,778 residual).
 *     - Post-tithe surplus: $32,108/mo Jun–Aug, $30,008/mo Sep onward.
 *     - Capital recovery extends 3 mo → 4 mo (Jun–Sep 2026).
 *     - Brightside Launch Month slips Sep 2026 → Oct 2026.
 *     - Phase 3 shrinks 14 mo → 13 mo (Nov 2026 – Nov 2027).
 *     - Phase 3 split renormalises 50/25/25 → 75/25 Reserve / Innovation.
 *
 *   Operating margin (pre-tithe, the structural "right-priced" metric) is
 *   unchanged at 38.6% Sep onward — fee minus operating cost basis still
 *   lands in the 35–40% target band. The post-tithe surplus margin is
 *   ~28.6%; that's the new headline for "what's actually available for
 *   capital + reserve + innovation after the tithe."
 *
 * The pricing story:
 *   - Same lean 6-role roster as V3 (the locked default). Payroll $52k/mo.
 *   - Fee at $105k/mo so the Sep-onward operating margin lands at ~38.6%
 *     (target band: 35–40%) before the tithe is taken.
 *   - Lead draw stays at $18k/mo for the published 18 months. The
 *     renegotiation triggers below describe how the draw and fee step at
 *     month 12 once Brightside is live and the value-delivered audit lands.
 */

const v4Roster = [
  { role: "Practitioner / Lead", monthlyLoaded: 18000, notes: "Engagement owner; visits Deer Lake ~3 days/mo. Draw steps at the renegotiation triggers below." },
  { role: "IT / Tech", monthlyLoaded: 9500 },
  { role: "Operations Manager (Dryden)", monthlyLoaded: 9500 },
  { role: "Community Development Associate", monthlyLoaded: 7500, notes: "Absorbs field work in lieu of a separate junior analyst" },
  { role: "Food Handler (Dryden depot)", monthlyLoaded: 5000 },
  { role: "Bookkeeper / Admin", monthlyLoaded: 2500 },
];

const v4PayrollTotal = v4Roster.reduce((s, r) => s + r.monthlyLoaded, 0); // 52,000

const v4Fee = 105000;

// Tithe — top of the waterfall. 10% off the top, first claim on revenue.
const v4TithePct = 10;
const v4TitheMonthly = v4Fee * 0.10; // 10,500
const v4Tithe18mo = v4TitheMonthly * 18; // 189,000

const v4CostBasisJunAug = v4PayrollTotal + SHARED_OVERHEADS_JUN_AUG_TOTAL; // 62,392
const v4CostBasisSepOnward = v4PayrollTotal + SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 64,492

// Surplus is post-tithe: fee − tithe − cost basis.
const v4SurplusJunAug = v4Fee - v4TitheMonthly - v4CostBasisJunAug; // 32,108
const v4SurplusSepOnward = v4Fee - v4TitheMonthly - v4CostBasisSepOnward; // 30,008

// Capital recovery: $112,000 against the post-tithe surplus.
//   Months 1–3 (Jun–Aug at $32,108/mo): cumulative $96,324
//   Month 4 (Sep at $30,008/mo): retire remaining $15,676 → ~$14,332 spillover
// → Capital recovery: 4 months (Jun–Sep 2026)
// → Brightside Launch Month slips Sep → Oct 2026
// → Phase 3: 13 mo (Nov 2026 → Nov 2027) at the post-tithe Sep-onward rate.
const v4Phase3Months = 13;
const v4Phase3MonthlySurplus = v4SurplusSepOnward; // 30,008

// Phase 3 split renormalises 50/25/25 → 75/25 Reserve / Innovation
// (the old 25 giving slice goes to Reserve, consistent with the "redirect
// to Reserve war chest" pattern).
const v4ReservePct = 75;
const v4InnovationPct = 25;
const v4ReserveMonthly = v4Phase3MonthlySurplus * 0.75; // 22,506
const v4InnovationMonthly = v4Phase3MonthlySurplus * 0.25; // 7,502

const v4Revenue18mo = v4Fee * 18; // 1,890,000
const v4Payroll18mo = v4PayrollTotal * 18; // 936,000
const v4Overheads18mo = 3 * SHARED_OVERHEADS_JUN_AUG_TOTAL + 15 * SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 218,556
const v4Surplus18mo = v4Revenue18mo - v4Tithe18mo - v4Payroll18mo - v4Overheads18mo;
// = 1,890,000 − 189,000 − 936,000 − 218,556 = 546,444
const v4Reserve18mo = Math.round(v4ReserveMonthly * v4Phase3Months); // 22,506 × 13 = 292,578
const v4Innovation18mo = Math.round(v4InnovationMonthly * v4Phase3Months); // 7,502 × 13 = 97,526

/**
 * Renegotiation triggers — the structured field that makes the renegotiation
 * conversation legible without inventing it from scratch later.
 *
 * Read each as: "at this step, IF (condition) is true with (evidence), the
 * fee steps to feeStepTo and the lead draw steps to drawStepTo."
 */
const v4Triggers: RenegotiationTrigger[] = [
  {
    step: "Month 12 renegotiation",
    condition:
      "Brightside is live (paying customers > 0) AND Karen's tool is in daily use at Headwaters.",
    feeStepTo: 115000,
    drawStepTo: 20000,
    evidenceRequired:
      "Brightside billing dashboard + Karen tool usage log, both reviewed with the buyer at the month-12 sit-down.",
  },
  {
    step: "Month 18 renewal",
    condition:
      "Year-1 value-delivered audit (Task #33) ≥ 18-month cumulative markup AND Trigger 1 fired.",
    feeStepTo: 120000,
    drawStepTo: 22000,
    evidenceRequired:
      "Signed value-delivered audit report, countersigned by buyer's CFO. Markup figure pulled from the locked 18-mo agency totals.",
  },
];

const v4Agency = {
  fee: v4Fee,
  termMonths: 18,
  renegotiateMonth: 12,
  startDate: "June 1, 2026",
  buyerStatus: "TBD (father vs 807 — affects political weight, not the math)",
  feeTag: confirmed(
    "Right-priced against the lean 6-role roster — Sep-onward operating margin (pre-tithe) lands at ~38.6% (target band 35–40%).",
  ),

  roster: v4Roster,
  payrollTotal: v4PayrollTotal,
  rosterTag: confirmed("Same 6-role lean roster as V3 — fee changes, team shape does not."),

  overheadsJunAug: SHARED_OVERHEADS_JUN_AUG,
  overheadsJunAugTotal: SHARED_OVERHEADS_JUN_AUG_TOTAL,
  overheadsSepOnward: SHARED_OVERHEADS_SEP_ONWARD,
  overheadsSepOnwardTotal: SHARED_OVERHEADS_SEP_ONWARD_TOTAL,
  overheadsTag: confirmed("Roster-shaped, not fee-shaped — held identical across every scenario."),

  tithePct: v4TithePct,
  titheMonthly: v4TitheMonthly,
  titheTotal: v4Tithe18mo,

  costBasisJunAug: v4CostBasisJunAug,
  costBasisSepOnward: v4CostBasisSepOnward,
  monthlySurplusJunAug: v4SurplusJunAug,
  monthlySurplusSepOnward: v4SurplusSepOnward,
  costBasisTag: confirmed("Computed from locked roster + fee, post-tithe."),

  capitalRecoveryAmount: 112000,
  capitalRecoveryDescription:
    "$72k outstanding business loan first, then $40k personal infusion from founder's husband, in that order.",
  capitalRecoveryMonths: 4,
  capitalRecoveryStartLabel: "Jun 2026",
  capitalRecoveryEndLabel: "End of Sep 2026 (~$14,332 Sep spillover after recovery completes)",
  capitalRecoveryTag: confirmed("Recovery clears in 4 mo at the post-tithe right-priced surplus (3 mo before tithe; tithe-first adds one month)."),

  brightsideLaunchMonthLabel: "October 2026 (slipped one month from the V4-pre-tithe September target)",
  brightsidePrelaunchSpend: 28000,
  brightsideLaunchSurplus: v4SurplusSepOnward,
  brightsideLaunchRemainder: v4SurplusSepOnward - 28000, // 2,008
  brightsideLaunchTag: confirmed("Oct surplus ($30,008) covers the $28k pre-launch with $2,008 left over for the Reserve / Innovation Phase 3 split."),

  phase3Months: v4Phase3Months,
  phase3MonthlySurplus: v4Phase3MonthlySurplus,
  reservePct: v4ReservePct,
  innovationPct: v4InnovationPct,
  reserveMonthly: v4ReserveMonthly,
  innovationMonthly: v4InnovationMonthly,
  reserveTotal: v4Reserve18mo,
  innovationTotal: v4Innovation18mo,
  phase3Tag: confirmed("13-mo Phase 3 window (Nov 2026 → Nov 2027) at the post-tithe Sep-onward surplus. Split renormalises 50/25/25 → 75/25 Reserve / Innovation."),

  totals18mo: {
    revenue: v4Revenue18mo,
    tithe: v4Tithe18mo,
    payroll: v4Payroll18mo,
    overheads: v4Overheads18mo,
    surplusDeployed: v4Surplus18mo,
    capitalRecovery: 112000,
    brightsidePrelaunch: 28000,
    reserve: v4Reserve18mo,
    innovation: v4Innovation18mo,
    tag: confirmed("Computed from locked fee + roster, with tithe taken first."),
  },

  practitionerSalary18mo: 324000,
  practitionerSalaryTag: confirmed(
    "Lead salary held at $18k/mo × 18 = $324k for the published 18 months. Renegotiation triggers describe the step at month 12.",
  ),

  reservePurposes: SHARED_RESERVE_PURPOSES,
  givingDirection: SHARED_GIVING_DIRECTION,
  renegotiationTriggers: v4Triggers,
};

const v4Personal = {
  agencySalary18mo: 324000,
  brightsideOwnerTake: 37000,
  total18mo: 361000,
  perYear: 240667,
  capitalRecovery: 112000,
  tag: confirmed(
    "Lead draw stays at $18k/mo for the published 18 months. Renegotiation triggers (Contracts page) describe the post-month-12 step.",
  ),
};

export const SCENARIO_V4: Scenario = {
  id: "v4",
  name: "V4 — Right-priced",
  short: "V4",
  tagline: "$105k/mo agency · 6-role team · ~38.6% operating margin · tithe-first",
  description:
    "Right-priced engagement against the same lean 6-role roster as V3. Fee at $105k/mo so the Sep-onward operating margin (pre-tithe) lands in the 35–40% band. Tithe-first deployment: 10% off the top to Giving, then capital recovery (4 mo Jun–Sep 2026), then Brightside launch (October 2026), then 13 months of Reserve / Innovation. Renegotiation triggers describe the month-12 step in the founder's voice — pre-baked, not negotiated from scratch later. Also seeded as the first alternative-reality tab on the Compare page.",
  accent: "#3B2A6E",
  accentSoft: "#E6E1F2",
  accentInk: "#1F1640",
  status: "locked",
  salts: SHARED_SALTS,
  contracts: { cdp807: SHARED_CDP807, agency: v4Agency },
  brightside: SHARED_BRIGHTSIDE,
  personal: v4Personal,
};

export const V4_DEER_LAKE_TRAVEL = tbd(
  "Practitioner visits ~3 days/mo, flight + lodging + per diem still TBD.",
);

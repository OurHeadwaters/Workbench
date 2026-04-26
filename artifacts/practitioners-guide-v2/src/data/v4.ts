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
 * The pricing story:
 *   - Same lean 6-role roster as V3 (the locked default). Payroll $52k/mo.
 *   - Fee lifted from V3's $90k/mo to $105k/mo so the Sep-onward gross
 *     margin lands at ~38.6% (target band: 35–40%).
 *   - Capital recovery clears in the V2-style 3 months (Jun–Aug) because the
 *     surplus is back above the V2 surplus level.
 *   - Brightside Launch Month returns to September 2026 (the October slip in
 *     V3 was a symptom of underpricing, not a structural feature).
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
const v4CostBasisJunAug = v4PayrollTotal + SHARED_OVERHEADS_JUN_AUG_TOTAL; // 62,392
const v4CostBasisSepOnward = v4PayrollTotal + SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 64,492
const v4SurplusJunAug = v4Fee - v4CostBasisJunAug; // 42,608  → 40.6% margin
const v4SurplusSepOnward = v4Fee - v4CostBasisSepOnward; // 40,508 → 38.6% margin

// Capital recovery: $112k / $42,608 ≈ 2.63 mo.
//   Month 1 (Jun): cum 42,608
//   Month 2 (Jul): cum 85,216
//   Month 3 (Aug): cum 127,824 — done; ~$15,824 trickle to splits.

// Phase 3: Oct 2026 onward. 18 mo total − 3 mo cap recovery − 1 mo Brightside
// launch = 14 mo of Phase 3 splits at the post-Sep surplus rate.
const v4Phase3Months = 14;
const v4Phase3MonthlySurplus = v4SurplusSepOnward; // 40,508
const v4ReserveMonthly = v4Phase3MonthlySurplus * 0.5; // 20,254
const v4InnovationMonthly = v4Phase3MonthlySurplus * 0.25; // 10,127
const v4GivingMonthly = v4Phase3MonthlySurplus * 0.25; // 10,127

const v4Revenue18mo = v4Fee * 18; // 1,890,000
const v4Payroll18mo = v4PayrollTotal * 18; // 936,000
const v4Overheads18mo = 3 * SHARED_OVERHEADS_JUN_AUG_TOTAL + 15 * SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 218,556
const v4Surplus18mo = v4Revenue18mo - v4Payroll18mo - v4Overheads18mo;
// = 1,890,000 − 936,000 − 218,556 = 735,444
const v4Reserve18mo = Math.round(v4ReserveMonthly * v4Phase3Months); // 283,556
const v4Innovation18mo = Math.round(v4InnovationMonthly * v4Phase3Months); // 141,778
const v4Giving18mo = Math.round(v4GivingMonthly * v4Phase3Months); // 141,778

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
    "Right-priced against the lean 6-role roster — lifts the Sep-onward gross margin to ~38.6% (target band 35–40%).",
  ),

  roster: v4Roster,
  payrollTotal: v4PayrollTotal,
  rosterTag: confirmed("Same 6-role lean roster as V3 — fee changes, team shape does not."),

  overheadsJunAug: SHARED_OVERHEADS_JUN_AUG,
  overheadsJunAugTotal: SHARED_OVERHEADS_JUN_AUG_TOTAL,
  overheadsSepOnward: SHARED_OVERHEADS_SEP_ONWARD,
  overheadsSepOnwardTotal: SHARED_OVERHEADS_SEP_ONWARD_TOTAL,
  overheadsTag: confirmed("Roster-shaped, not fee-shaped — held identical across every scenario."),

  costBasisJunAug: v4CostBasisJunAug,
  costBasisSepOnward: v4CostBasisSepOnward,
  monthlySurplusJunAug: v4SurplusJunAug,
  monthlySurplusSepOnward: v4SurplusSepOnward,
  costBasisTag: confirmed("Computed from locked roster + fee."),

  capitalRecoveryAmount: 112000,
  capitalRecoveryDescription:
    "$72k outstanding business loan first, then $40k personal infusion from founder's husband, in that order.",
  capitalRecoveryMonths: 3,
  capitalRecoveryStartLabel: "Jun 2026",
  capitalRecoveryEndLabel: "End of Aug 2026 (~$15.8k late-Aug trickle to splits)",
  capitalRecoveryTag: confirmed("Recovery clears in 3 mo at the right-priced surplus."),

  brightsideLaunchMonthLabel: "September 2026",
  brightsidePrelaunchSpend: 28000,
  brightsideLaunchSurplus: v4SurplusSepOnward,
  brightsideLaunchRemainder: v4SurplusSepOnward - 28000, // 12,508
  brightsideLaunchTag: confirmed("Sep surplus ($40,508) covers the $28k pre-launch with $12,508 left over for Reserve / Innovation / Giving."),

  phase3Months: v4Phase3Months,
  phase3MonthlySurplus: v4Phase3MonthlySurplus,
  reservePct: 50,
  innovationPct: 25,
  givingPct: 25,
  reserveMonthly: v4ReserveMonthly,
  innovationMonthly: v4InnovationMonthly,
  givingMonthly: v4GivingMonthly,
  reserveTotal: v4Reserve18mo,
  innovationTotal: v4Innovation18mo,
  givingTotal: v4Giving18mo,
  phase3Tag: confirmed("14-mo Phase 3 window at the post-Sep surplus, sized to the right-priced fee."),

  totals18mo: {
    revenue: v4Revenue18mo,
    payroll: v4Payroll18mo,
    overheads: v4Overheads18mo,
    surplusDeployed: v4Surplus18mo,
    capitalRecovery: 112000,
    brightsidePrelaunch: 28000,
    reserve: v4Reserve18mo,
    innovation: v4Innovation18mo,
    giving: v4Giving18mo,
    tag: confirmed("Computed from locked fee + roster."),
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
  tagline: "$105k/mo agency · 6-role team · ~38.6% margin",
  description:
    "Right-priced engagement against the same lean 6-role roster as V3. Fee lifted to $105k/mo so the Sep-onward gross margin lands in the 35–40% band the founder needs for an 18-month commitment. Capital recovery clears in 3 months (Jun–Aug) and Brightside launch returns to September 2026. Renegotiation triggers describe the month-12 step in the founder's voice — pre-baked, not negotiated from scratch later. Also seeded as the first alternative-reality tab on the Compare page.",
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

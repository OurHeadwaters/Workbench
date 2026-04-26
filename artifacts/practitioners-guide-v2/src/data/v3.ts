import { confirmed, tbd } from "./tags";
import type { Scenario } from "./types";
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
 * V3 — Lean team scenario.
 *
 * STATUS: LOCKED on 2026-04-26. Promoted to the default operating framework
 * on the same day when V2 (full team, $115k/mo) was retired from the live
 * scenario set. The V2 milestone now lives as a "How we got here" note on
 * the Compare / operating-framework page.
 *
 * Roster:
 *   - 6-role roster: Practitioner / Lead, IT / Tech, Operations Manager,
 *     Community Development Associate, Food Handler, Bookkeeper.
 *   - $52k/mo payroll, $90k/mo agency fee.
 *   - Salts and Brightside identical to every other scenario — they describe
 *     the world, not the engagement shape.
 *
 * Capital recovery clears in ~4.1 months, which pushes the Brightside Launch
 * Month from September into October. V4 (right-priced alt reality on the
 * Compare page) shows what happens when the fee is lifted to bring the
 * cadence back to the V2-style 3-month recovery.
 */

const v3Roster = [
  { role: "Practitioner / Lead", monthlyLoaded: 18000, notes: "Engagement owner; visits Deer Lake ~3 days/mo" },
  { role: "IT / Tech", monthlyLoaded: 9500 },
  { role: "Operations Manager (Dryden)", monthlyLoaded: 9500 },
  { role: "Community Development Associate", monthlyLoaded: 7500, notes: "Absorbs field work in lieu of a separate junior analyst" },
  { role: "Food Handler (Dryden depot)", monthlyLoaded: 5000 },
  { role: "Bookkeeper / Admin", monthlyLoaded: 2500, notes: "Handles minimal reporting in lieu of a transparency-stack engineer" },
];

const v3PayrollTotal = v3Roster.reduce((s, r) => s + r.monthlyLoaded, 0); // 52000

const v3Fee = 90000;
const v3CostBasisJunAug = v3PayrollTotal + SHARED_OVERHEADS_JUN_AUG_TOTAL; // 62392
const v3CostBasisSepOnward = v3PayrollTotal + SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 64492
const v3SurplusJunAug = v3Fee - v3CostBasisJunAug; // 27608
const v3SurplusSepOnward = v3Fee - v3CostBasisSepOnward; // 25508

// Capital recovery: 112k / 27608 = 4.06 mo. Spans Jun-Sep + spillover.
//   Months 1-3 (Jun-Aug, $27,608/mo): cumulative $82,824
//   Month 4 (Sep, $25,508): cumulative $108,332 — still short by $3,668
//   Month 5 (Oct): retire remaining $3,668 → ~$21,840 left over for Oct splits
// → Brightside Launch Month shifts from Sept (V2 baseline) into Oct under V3.

// Phase 3: 18 mo total - 4 mo capital recovery - 1 mo Brightside Launch = 13 mo.
const v3Phase3Months = 13;
const v3Phase3MonthlySurplus = v3SurplusSepOnward; // 25508
const v3ReserveMonthly = v3Phase3MonthlySurplus * 0.5; // 12754
const v3InnovationMonthly = v3Phase3MonthlySurplus * 0.25; // 6377
const v3GivingMonthly = v3Phase3MonthlySurplus * 0.25; // 6377

const v3Revenue18mo = v3Fee * 18; // 1,620,000
const v3Payroll18mo = v3PayrollTotal * 18; // 936,000
const v3Overheads18mo = 3 * SHARED_OVERHEADS_JUN_AUG_TOTAL + 15 * SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 218,556
const v3Surplus18mo = v3Revenue18mo - v3Payroll18mo - v3Overheads18mo;
// = 1,620,000 - 936,000 - 218,556 = 465,444
const v3Reserve18mo = Math.round(v3ReserveMonthly * v3Phase3Months);
const v3Innovation18mo = Math.round(v3InnovationMonthly * v3Phase3Months);
const v3Giving18mo = Math.round(v3GivingMonthly * v3Phase3Months);

const v3Agency = {
  fee: v3Fee,
  termMonths: 18,
  renegotiateMonth: 12,
  startDate: "June 1, 2026",
  buyerStatus: "TBD (father vs 807 — affects political weight, not the math)",
  feeTag: confirmed("Locked at $90k/mo against the lean roster's cost basis ($52k payroll + $10.4–12.5k overheads)."),

  roster: v3Roster,
  payrollTotal: v3PayrollTotal,
  rosterTag: confirmed("Locked 6-role lean roster — promoted to the default on 2026-04-26."),

  overheadsJunAug: SHARED_OVERHEADS_JUN_AUG,
  overheadsJunAugTotal: SHARED_OVERHEADS_JUN_AUG_TOTAL,
  overheadsSepOnward: SHARED_OVERHEADS_SEP_ONWARD,
  overheadsSepOnwardTotal: SHARED_OVERHEADS_SEP_ONWARD_TOTAL,
  overheadsTag: confirmed("Roster-shaped, not fee-shaped — held identical across every scenario."),

  costBasisJunAug: v3CostBasisJunAug,
  costBasisSepOnward: v3CostBasisSepOnward,
  monthlySurplusJunAug: v3SurplusJunAug,
  monthlySurplusSepOnward: v3SurplusSepOnward,
  costBasisTag: confirmed("Computed from locked roster + fee."),

  capitalRecoveryAmount: 112000,
  capitalRecoveryDescription:
    "$72k outstanding business loan first, then $40k personal infusion from founder's husband, in that order.",
  capitalRecoveryMonths: 4,
  capitalRecoveryStartLabel: "Jun 2026",
  capitalRecoveryEndLabel: "Early Oct 2026 (~4.1 months at the locked surplus)",
  capitalRecoveryTag: confirmed("Lower surplus extends recovery to ~4.1 mo under the locked $90k fee."),

  brightsideLaunchMonthLabel: "October 2026 (one month past the original September target)",
  brightsidePrelaunchSpend: 28000,
  brightsideLaunchSurplus: v3SurplusSepOnward,
  brightsideLaunchRemainder: -2492,
  brightsideLaunchTag: confirmed("Brightside launch slips one month under V3. October surplus alone (~$25.5k) doesn't cover the $28k pre-launch — the $2.5k overflow comes out of November Reserve / Innovation / Giving."),

  phase3Months: v3Phase3Months,
  phase3MonthlySurplus: v3Phase3MonthlySurplus,
  reservePct: 50,
  innovationPct: 25,
  givingPct: 25,
  reserveMonthly: v3ReserveMonthly,
  innovationMonthly: v3InnovationMonthly,
  givingMonthly: v3GivingMonthly,
  reserveTotal: v3Reserve18mo,
  innovationTotal: v3Innovation18mo,
  givingTotal: v3Giving18mo,
  phase3Tag: confirmed("Phase 3 window is ~13 mo because capital recovery + launch take an extra month under the locked fee."),

  totals18mo: {
    revenue: v3Revenue18mo,
    payroll: v3Payroll18mo,
    overheads: v3Overheads18mo,
    surplusDeployed: v3Surplus18mo,
    capitalRecovery: 112000,
    brightsidePrelaunch: 28000,
    reserve: v3Reserve18mo,
    innovation: v3Innovation18mo,
    giving: v3Giving18mo,
    tag: confirmed("Computed from locked fee + roster."),
  },

  practitionerSalary18mo: 324000,
  practitionerSalaryTag: confirmed("Practitioner salary held at $18k/mo × 18 = $324k for the published 18 months."),

  reservePurposes: SHARED_RESERVE_PURPOSES,
  givingDirection: SHARED_GIVING_DIRECTION,
  renegotiationTriggers: [],
};

const v3Personal = {
  agencySalary18mo: 324000,
  brightsideOwnerTake: 37000,
  total18mo: 361000,
  perYear: 240667,
  capitalRecovery: 112000,
  tag: confirmed("Capital Recovery is debt repayment to lender + family — NOT income."),
};

export const SCENARIO_V3: Scenario = {
  id: "v3",
  name: "V3 — Lean team",
  short: "V3",
  tagline: "$90k/mo agency · 6-role team",
  description:
    "The locked default operating framework. Lean 6-role team, $90k/mo agency fee, V2-style three-phase surplus deployment. Salts and Brightside are scenario-neutral — only the team and the fee move when the engagement shape changes.",
  accent: "#B14A1F",
  accentSoft: "#FBE4D8",
  accentInk: "#5B2510",
  status: "locked",
  salts: SHARED_SALTS,
  contracts: { cdp807: SHARED_CDP807, agency: v3Agency },
  brightside: SHARED_BRIGHTSIDE,
  personal: v3Personal,
};

export const V3_DEER_LAKE_TRAVEL = tbd(
  "Practitioner visits ~3 days/mo, flight + lodging + per diem still TBD.",
);

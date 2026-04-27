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
 * 2026-04-27 update — Tithe-shaped giving.
 *   Giving moved from a residual Phase 3 split share (25% of post-cap-recovery
 *   surplus) to a top-of-waterfall first claim on revenue (10% off the top,
 *   paid first, before cost basis or capital recovery). Dave Ramsey discipline:
 *   the tithe is what you decided, not what was left.
 *
 *   Cascade against the locked $90k fee:
 *     - Tithe: $9,000/mo → $162,000 over 18 months (was $82,901 residual).
 *     - Post-tithe surplus: $18,608/mo Jun–Aug, $16,508/mo Sep onward.
 *     - Capital recovery extends from 4 mo → ~7 mo (Jun–Dec 2026).
 *     - Brightside Launch Month slips from October 2026 → January 2027.
 *     - Phase 3 shrinks from 13 mo → 10 mo (Feb–Nov 2027).
 *     - Phase 3 split renormalises 50/25/25 → 75/25 Reserve / Innovation
 *       (the old 25 giving slice goes to Reserve, consistent with the
 *       existing "redirect to Reserve war chest" pattern).
 *
 * Roster:
 *   - 6-role roster: Practitioner / Lead, IT / Tech, Operations Manager,
 *     Community Development Associate, Food Handler, Bookkeeper.
 *   - $52k/mo payroll, $90k/mo agency fee.
 *   - Salts and Brightside identical to every other scenario — they describe
 *     the world, not the engagement shape.
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

// Tithe — top of the waterfall. 10% off the top, first claim on revenue,
// paid before any cost basis or capital allocation.
const v3TithePct = 10;
const v3TitheMonthly = v3Fee * 0.10; // 9,000
const v3Tithe18mo = v3TitheMonthly * 18; // 162,000

const v3CostBasisJunAug = v3PayrollTotal + SHARED_OVERHEADS_JUN_AUG_TOTAL; // 62,392
const v3CostBasisSepOnward = v3PayrollTotal + SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 64,492

// Surplus is post-tithe: fee − tithe − cost basis.
const v3SurplusJunAug = v3Fee - v3TitheMonthly - v3CostBasisJunAug; // 18,608
const v3SurplusSepOnward = v3Fee - v3TitheMonthly - v3CostBasisSepOnward; // 16,508

// Capital recovery: $112,000 against the post-tithe surplus.
//   Months 1–3 (Jun–Aug at $18,608/mo): cumulative $55,824
//   Month 4 (Sep at $16,508/mo): cumulative $72,332
//   Month 5 (Oct at $16,508/mo): cumulative $88,840
//   Month 6 (Nov at $16,508/mo): cumulative $105,348
//   Month 7 (Dec at $16,508/mo): retire remaining $6,652 → ~$9,856 spillover
// → Capital recovery: 7 months (Jun → early Dec 2026)
// → Brightside Launch Month slips to Jan 2027 (Jan's $16,508 surplus + Dec's
//   ~$9,856 spillover ≈ $26,364, leaving ~$1,636 absorbed by Feb's splits).
// → Phase 3: Feb 2027 → Nov 2027 = 10 months at the post-tithe Sep-onward rate.

const v3Phase3Months = 10;
const v3Phase3MonthlySurplus = v3SurplusSepOnward; // 16,508

// Phase 3 split renormalises to 75/25 — the old 25 giving slice goes to Reserve,
// consistent with the existing "redirect to Reserve war chest" pattern.
const v3ReservePct = 75;
const v3InnovationPct = 25;
const v3ReserveMonthly = v3Phase3MonthlySurplus * 0.75; // 12,381
const v3InnovationMonthly = v3Phase3MonthlySurplus * 0.25; // 4,127

const v3Revenue18mo = v3Fee * 18; // 1,620,000
const v3Payroll18mo = v3PayrollTotal * 18; // 936,000
const v3Overheads18mo = 3 * SHARED_OVERHEADS_JUN_AUG_TOTAL + 15 * SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 218,556
const v3Surplus18mo = v3Revenue18mo - v3Tithe18mo - v3Payroll18mo - v3Overheads18mo;
// = 1,620,000 − 162,000 − 936,000 − 218,556 = 303,444
const v3Reserve18mo = Math.round(v3ReserveMonthly * v3Phase3Months); // 123,810
const v3Innovation18mo = Math.round(v3InnovationMonthly * v3Phase3Months); // 41,270

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

  tithePct: v3TithePct,
  titheMonthly: v3TitheMonthly,
  titheTotal: v3Tithe18mo,

  costBasisJunAug: v3CostBasisJunAug,
  costBasisSepOnward: v3CostBasisSepOnward,
  monthlySurplusJunAug: v3SurplusJunAug,
  monthlySurplusSepOnward: v3SurplusSepOnward,
  costBasisTag: confirmed("Computed from locked roster + fee, post-tithe."),

  capitalRecoveryAmount: 112000,
  capitalRecoveryDescription:
    "$72k outstanding business loan first, then $40k personal infusion from founder's husband, in that order.",
  capitalRecoveryMonths: 7,
  capitalRecoveryStartLabel: "Jun 2026",
  capitalRecoveryEndLabel: "Early Dec 2026 (~6.8 months at the post-tithe surplus, with ~$9,856 December spillover into Brightside Launch)",
  capitalRecoveryTag: confirmed("Tithe-first cuts the monthly surplus, extending recovery from 4 mo to ~7 mo at the locked $90k fee."),

  brightsideLaunchMonthLabel: "January 2027 (slipped three months from the V3-pre-tithe October target)",
  brightsidePrelaunchSpend: 28000,
  brightsideLaunchSurplus: v3SurplusSepOnward,
  brightsideLaunchRemainder: v3SurplusSepOnward - 28000, // -11,492
  brightsideLaunchTag: confirmed("Brightside launch slips to January 2027 with the tithe in place. Jan's $16,508 surplus alone is short of the $28k pre-launch by $11,492; ~$9,856 of that is covered by the late-December capital-recovery spillover, leaving ~$1,636 absorbed by February's Reserve / Innovation splits."),

  phase3Months: v3Phase3Months,
  phase3MonthlySurplus: v3Phase3MonthlySurplus,
  reservePct: v3ReservePct,
  innovationPct: v3InnovationPct,
  reserveMonthly: v3ReserveMonthly,
  innovationMonthly: v3InnovationMonthly,
  reserveTotal: v3Reserve18mo,
  innovationTotal: v3Innovation18mo,
  phase3Tag: confirmed("Phase 3 window shrinks to 10 mo (Feb–Nov 2027) under the tithe-first structure. Split renormalises 50/25/25 → 75/25 Reserve / Innovation; the old 25 giving slice goes to Reserve."),

  totals18mo: {
    revenue: v3Revenue18mo,
    tithe: v3Tithe18mo,
    payroll: v3Payroll18mo,
    overheads: v3Overheads18mo,
    surplusDeployed: v3Surplus18mo,
    capitalRecovery: 112000,
    brightsidePrelaunch: 28000,
    reserve: v3Reserve18mo,
    innovation: v3Innovation18mo,
    tag: confirmed("Computed from locked fee + roster, with tithe taken first."),
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
  tagline: "$90k/mo agency · 6-role team · tithe-first",
  description:
    "The locked default operating framework. Lean 6-role team, $90k/mo agency fee, tithe-first surplus deployment: 10% off the top to Giving, then capital recovery, then Brightside launch, then Reserve / Innovation. Salts and Brightside are scenario-neutral — only the team and the fee move when the engagement shape changes.",
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

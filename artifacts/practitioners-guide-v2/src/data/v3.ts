import { confirmed } from "./tags";
import type { Scenario } from "./types";
import {
  SHARED_BRIGHTSIDE,
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
 * 2026-04-28 update — Deer Lake roster sync.
 *   Roster reshaped to match the canonical Deer Lake team baked into the
 *   Operating Plan one-pager and the Deer Lake Store Plan StaffingModel
 *   slide:
 *     - Practitioner / Lead draw drops $18,000/mo → $14,000/mo (the live
 *       founder draw on the OnePager A · floor cost basis).
 *     - Operations Manager renamed to Hub Coordinator (Dryden) and drops
 *       $9,500/mo → $8,500/mo to match the OnePager line.
 *     - Junior Analyst / Field added at $6,500/mo (the role finalized
 *       alongside the Bookkeeper and Hub Coordinator on 2026-04-28).
 *   Payroll: $52,000/mo (6 roles) → $53,500/mo (7 roles).
 *
 *   Cascade against the locked $90k fee:
 *     - Tithe still $9,000/mo (10% of fee) → $162,000 over 18 months.
 *     - Cost basis: $63,892/mo Jun–Aug, $65,992/mo Sep onward.
 *     - Post-tithe surplus: $17,108/mo Jun–Aug, $15,008/mo Sep onward.
 *     - Capital recovery extends ~7 mo → 8 mo (Jun 2026 → early Jan 2027).
 *     - Brightside Launch Month slips January 2027 → February 2027.
 *     - Phase 3 shrinks 10 mo → 9 mo (Mar 2027 → Nov 2027).
 *     - Phase 3 split unchanged 75/25 Reserve / Innovation.
 *     - Practitioner draw cuts the personal-cash 18-mo total
 *       $324,000 → $252,000 (the founder swallowed a $72k personal-cash
 *       drop to fund the new analyst seat without lifting the locked fee).
 */

const v3Roster = [
  { role: "Practitioner / Lead", monthlyLoaded: 14000, notes: "Engagement owner; visits Deer Lake ~3 days/mo" },
  { role: "Hub Coordinator (Dryden)", monthlyLoaded: 8500, notes: "Phone, depot, day-of fires; Deer Lake distribution" },
  { role: "IT / Tech", monthlyLoaded: 9500, notes: "Technical advisor on call; quarterly software review; checks any code that touches money" },
  { role: "Community Development Associate", monthlyLoaded: 7500 },
  { role: "Food Handler (Dryden depot)", monthlyLoaded: 5000 },
  { role: "Junior Analyst / Field", monthlyLoaded: 6500, notes: "Data, household price lookups, fieldwork" },
  { role: "Bookkeeper / Admin", monthlyLoaded: 2500, notes: "Closes the month; prepares payroll; minimal reporting" },
];

const v3PayrollTotal = v3Roster.reduce((s, r) => s + r.monthlyLoaded, 0); // 53500

const v3Fee = 90000;

// Tithe — top of the waterfall. 10% off the top, first claim on revenue,
// paid before any cost basis or capital allocation.
const v3TithePct = 10;
const v3TitheMonthly = v3Fee * 0.10; // 9,000
const v3Tithe18mo = v3TitheMonthly * 18; // 162,000

const v3CostBasisJunAug = v3PayrollTotal + SHARED_OVERHEADS_JUN_AUG_TOTAL; // 63,892
const v3CostBasisSepOnward = v3PayrollTotal + SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 65,992

// Surplus is post-tithe: fee − tithe − cost basis.
const v3SurplusJunAug = v3Fee - v3TitheMonthly - v3CostBasisJunAug; // 17,108
const v3SurplusSepOnward = v3Fee - v3TitheMonthly - v3CostBasisSepOnward; // 15,008

// Capital recovery: $112,000 against the post-tithe surplus.
//   Months 1–3 (Jun–Aug at $17,108/mo): cumulative $51,324
//   Month 4 (Sep at $15,008/mo): cumulative $66,332
//   Month 5 (Oct at $15,008/mo): cumulative $81,340
//   Month 6 (Nov at $15,008/mo): cumulative $96,348
//   Month 7 (Dec at $15,008/mo): cumulative $111,356 ($644 short)
//   Month 8 (Jan at $15,008/mo): retire remaining $644 → ~$14,364 spillover
// → Capital recovery: 8 months (Jun 2026 → early Jan 2027)
// → Brightside Launch Month slips to Feb 2027 (Jan's $14,364 spillover +
//   Feb's $15,008 surplus ≈ $29,372 covers the $28k pre-launch with
//   ~$1,372 left over for the Reserve / Innovation Phase 3 split).
// → Phase 3: Mar 2027 → Nov 2027 = 9 months at the post-tithe Sep-onward rate.

const v3Phase3Months = 9;
const v3Phase3MonthlySurplus = v3SurplusSepOnward; // 15,008

// Phase 3 split: 75/25 Reserve / Innovation (unchanged from the tithe-first
// renormalisation — the old 25 giving slice consolidated into Reserve).
const v3ReservePct = 75;
const v3InnovationPct = 25;
const v3ReserveMonthly = v3Phase3MonthlySurplus * 0.75; // 11,256
const v3InnovationMonthly = v3Phase3MonthlySurplus * 0.25; // 3,752

const v3Revenue18mo = v3Fee * 18; // 1,620,000
const v3Payroll18mo = v3PayrollTotal * 18; // 963,000
const v3Overheads18mo = 3 * SHARED_OVERHEADS_JUN_AUG_TOTAL + 15 * SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 218,556
const v3Surplus18mo = v3Revenue18mo - v3Tithe18mo - v3Payroll18mo - v3Overheads18mo;
// = 1,620,000 − 162,000 − 963,000 − 218,556 = 276,444
const v3Reserve18mo = Math.round(v3ReserveMonthly * v3Phase3Months); // 11,256 × 9 = 101,304
const v3Innovation18mo = Math.round(v3InnovationMonthly * v3Phase3Months); // 3,752 × 9 = 33,768

const v3Agency = {
  fee: v3Fee,
  termMonths: 18,
  renegotiateMonth: 12,
  startDate: "June 1, 2026",
  buyerStatus: "TBD (band council vs father — affects political weight, not the math)",
  feeTag: confirmed("Locked at $90k/mo against the lean roster's cost basis ($53.5k payroll + $10.4–12.5k overheads)."),

  roster: v3Roster,
  payrollTotal: v3PayrollTotal,
  rosterTag: confirmed("7-role Deer Lake team — synced from the Operating Plan one-pager and Deer Lake StaffingModel slide on 2026-04-28. Adds Junior Analyst / Field, renames Operations Manager → Hub Coordinator, drops Practitioner draw $18k → $14k."),

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
  capitalRecoveryMonths: 8,
  capitalRecoveryStartLabel: "Jun 2026",
  capitalRecoveryEndLabel: "Early Jan 2027 (~7.96 months at the post-tithe surplus, with ~$14,364 January spillover into Brightside Launch)",
  capitalRecoveryTag: confirmed("New roster + tithe-first stretch recovery to ~8 mo at the locked $90k fee. The added Junior Analyst seat and Hub Coordinator step-down net $1,500/mo of cost basis, costing one extra capital-recovery month."),

  brightsideLaunchMonthLabel: "February 2027 (slipped one month from the V3 pre-roster-sync January target to absorb the new analyst seat)",
  brightsidePrelaunchSpend: 28000,
  brightsideLaunchSurplus: v3SurplusSepOnward,
  brightsideLaunchRemainder: v3SurplusSepOnward - 28000, // -12,992
  brightsideLaunchTag: confirmed("Brightside launch lands in February 2027. Feb's $15,008 surplus alone is short of the $28k pre-launch by $12,992; ~$14,364 of that is covered by the late-January capital-recovery spillover, leaving ~$1,372 left over for the Phase 3 splits."),

  phase3Months: v3Phase3Months,
  phase3MonthlySurplus: v3Phase3MonthlySurplus,
  reservePct: v3ReservePct,
  innovationPct: v3InnovationPct,
  reserveMonthly: v3ReserveMonthly,
  innovationMonthly: v3InnovationMonthly,
  reserveTotal: v3Reserve18mo,
  innovationTotal: v3Innovation18mo,
  phase3Tag: confirmed("Phase 3 window shrinks to 9 mo (Mar–Nov 2027) under the new roster. Split unchanged at 75/25 Reserve / Innovation; the old 25 giving slice consolidated into Reserve when Giving moved to a tithe."),

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

  practitionerSalary18mo: v3Roster[0].monthlyLoaded * 18, // 252,000
  practitionerSalaryTag: confirmed("Practitioner draw lowered to $14k/mo (was $18k) to match the canonical Deer Lake roster — $14k × 18 = $252k for the published 18 months."),

  reservePurposes: SHARED_RESERVE_PURPOSES,
  givingDirection: SHARED_GIVING_DIRECTION,
  renegotiationTriggers: [],
};

const v3Personal = {
  agencySalary18mo: v3Roster[0].monthlyLoaded * 18, // 252,000
  brightsideOwnerTake: 37000,
  total18mo: v3Roster[0].monthlyLoaded * 18 + 37000, // 289,000
  perYear: Math.round((v3Roster[0].monthlyLoaded * 18 + 37000) / 1.5), // 192,667
  capitalRecovery: 112000,
  tag: confirmed("Capital Recovery is debt repayment to lender + family — NOT income. Practitioner draw drops from $18k to $14k under the 2026-04-28 Deer Lake roster sync."),
};

export const SCENARIO_V3: Scenario = {
  id: "v3",
  name: "V3 — Lean team",
  short: "V3",
  tagline: "$90k/mo agency · 7-role Deer Lake team · tithe-first",
  description:
    "The locked default operating framework. 7-role Deer Lake team ($53.5k/mo payroll), $90k/mo agency fee, tithe-first surplus deployment: 10% off the top to Giving, then capital recovery, then Brightside launch, then Reserve / Innovation. Salts and Brightside are scenario-neutral — only the team and the fee move when the engagement shape changes.",
  accent: "#B14A1F",
  accentSoft: "#FBE4D8",
  accentInk: "#5B2510",
  status: "locked",
  salts: SHARED_SALTS,
  contracts: { agency: v3Agency },
  brightside: SHARED_BRIGHTSIDE,
  personal: v3Personal,
};


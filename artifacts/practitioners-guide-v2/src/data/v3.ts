import { provisional, tbd } from "./tags";
import type { Scenario } from "./types";
import { SCENARIO_V2 } from "./v2";

/**
 * V3 — Lean team scenario.
 *
 * STATUS: PROVISIONAL until founder locks the exact roster + fee.
 * The shape is confirmed:
 *   - Lean roster (drop two roles)
 *   - Lower agency fee ("$90k/mo or less, need to determine costs first")
 *   - Salts and Brightside identical to V2 (only Community Contracts changes)
 *
 * Default proposal seeded here so the toggle has something to render.
 * Every V3 number tagged `provisional` so it visibly differs from V2's confirmed.
 */

const v3Roster = [
  { role: "Practitioner / Lead", monthlyLoaded: 18000, notes: "Unchanged — engagement owner; visits Deer Lake ~3 days/mo" },
  { role: "IT / Tech", monthlyLoaded: 9500, notes: "Unchanged" },
  { role: "Operations Manager (Dryden)", monthlyLoaded: 9500, notes: "Unchanged" },
  { role: "Community Development Associate", monthlyLoaded: 7500, notes: "Unchanged — absorbs field work previously done by Junior Analyst" },
  { role: "Food Handler (Dryden depot)", monthlyLoaded: 5000, notes: "Unchanged" },
  { role: "Bookkeeper / Admin", monthlyLoaded: 2500, notes: "Unchanged — handles minimal reporting in lieu of Transparency Stack" },
];

const v3PayrollTotal = v3Roster.reduce((s, r) => s + r.monthlyLoaded, 0); // 52000

const v3OverheadsBase = SCENARIO_V2.contracts.agency.overheadsJunAug;
const v3OverheadsJunAugTotal = SCENARIO_V2.contracts.agency.overheadsJunAugTotal;
const v3OverheadsSepOnward = SCENARIO_V2.contracts.agency.overheadsSepOnward;
const v3OverheadsSepOnwardTotal = SCENARIO_V2.contracts.agency.overheadsSepOnwardTotal;

const v3Fee = 90000;
const v3CostBasisJunAug = v3PayrollTotal + v3OverheadsJunAugTotal; // 62392
const v3CostBasisSepOnward = v3PayrollTotal + v3OverheadsSepOnwardTotal; // 64492
const v3SurplusJunAug = v3Fee - v3CostBasisJunAug; // 27608
const v3SurplusSepOnward = v3Fee - v3CostBasisSepOnward; // 25508

// Capital recovery: 112k / 27608 = 4.06 mo. Spans Jun-Sep + spillover.
// Months 1-3 (Jun-Aug, $27,608/mo): cumulative $82,824
// Month 4 (Sep, $25,508): cumulative $108,332 — still short by $3,668
// Month 5 (Oct): retire remaining $3,668 → ~$21,840 left over for Sep/Oct splits
// The Brightside Launch Month must shift OR pre-launch must be funded differently.
// Conservatively: assume capital recovery completes ~Oct, Brightside launch shifts to Oct.
const v3CapitalRecoveryMonths = 4.1;

// Phase 3 surplus base (Sep+ structure). Months remaining for splits:
// 18 mo total - 4 mo capital recovery - 1 mo Brightside Launch = 13 mo of Phase 3 splits
const v3Phase3Months = 13;
const v3Phase3MonthlySurplus = v3SurplusSepOnward; // 25508
const v3ReserveMonthly = v3Phase3MonthlySurplus * 0.5; // 12754
const v3InnovationMonthly = v3Phase3MonthlySurplus * 0.25; // 6377
const v3GivingMonthly = v3Phase3MonthlySurplus * 0.25; // 6377

const v3Revenue18mo = v3Fee * 18; // 1,620,000
const v3Payroll18mo = v3PayrollTotal * 18; // 936,000
// Overheads: 3 mo × Jun-Aug + 15 mo × Sep+
const v3Overheads18mo = 3 * v3OverheadsJunAugTotal + 15 * v3OverheadsSepOnwardTotal; // 31,176 + 187,380 = 218,556
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
  feeTag: provisional("Founder said '$90k/mo or less, need to determine costs first.' Locked once cost basis is reviewed."),

  roster: v3Roster,
  payrollTotal: v3PayrollTotal,
  rosterTag: provisional("Default proposal: drop Transparency Stack Engineer ($8.5k) and Junior Analyst / Field ($6.5k). Awaiting founder's exact roster."),

  overheadsJunAug: v3OverheadsBase,
  overheadsJunAugTotal: v3OverheadsJunAugTotal,
  overheadsSepOnward: v3OverheadsSepOnward,
  overheadsSepOnwardTotal: v3OverheadsSepOnwardTotal,
  overheadsTag: provisional("Held identical to V2 pending leaner-scope review of overhead lines."),

  costBasisJunAug: v3CostBasisJunAug,
  costBasisSepOnward: v3CostBasisSepOnward,
  monthlySurplusJunAug: v3SurplusJunAug,
  monthlySurplusSepOnward: v3SurplusSepOnward,
  costBasisTag: provisional("Computed from provisional roster + fee."),

  capitalRecoveryAmount: 112000,
  capitalRecoveryDescription:
    "$72k outstanding business loan first, then $40k personal infusion from founder's husband, in that order.",
  capitalRecoveryMonths: 4,
  capitalRecoveryStartLabel: "Jun 2026",
  capitalRecoveryEndLabel: "Mid-Oct 2026 (~4 months at provisional surplus)",
  capitalRecoveryTag: provisional("Lower surplus extends recovery from 3 mo (V2) to ~4.1 mo (V3)."),

  brightsideLaunchMonthLabel: "October 2026 (shifted from Sept)",
  brightsidePrelaunchSpend: 28000,
  brightsideLaunchSurplus: v3SurplusSepOnward,
  brightsideLaunchRemainder: -2492,
  brightsideLaunchTag: provisional("Brightside launch slips one month under V3. Even after the slip, October surplus alone (~$25.5k) doesn't cover the $28k pre-launch — overflow comes from November Reserve/Innovation/Giving."),

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
  phase3Tag: provisional("Phase 3 window shrinks (~13 mo vs 14 mo V2) because capital recovery + launch take an extra month."),

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
    tag: provisional("Computed from provisional fee + roster."),
  },

  practitionerSalary18mo: 324000,
  practitionerSalaryTag: provisional("Practitioner salary held at $18k/mo × 18 = $324k. Subject to revision if leaner team also revises the lead role."),

  reservePurposes: SCENARIO_V2.contracts.agency.reservePurposes,
  givingDirection: SCENARIO_V2.contracts.agency.givingDirection,
};

const v3Personal = {
  agencySalary18mo: 324000,
  brightsideOwnerTake: 37000,
  total18mo: 361000,
  perYear: 240667,
  capitalRecovery: 112000,
  tag: provisional("Personal cash unchanged from V2 in default V3 (lead salary held). Drops if founder also lowers Practitioner pay under leaner team."),
};

export const SCENARIO_V3: Scenario = {
  id: "v3",
  name: "V3 — Lean team",
  short: "V3",
  tagline: "Provisional · ~$90k/mo · 6-role team",
  description:
    "Leaner team (drops Transparency Stack Engineer + Junior Analyst), lower agency fee. Provisional until founder confirms exact roster and fee with cost basis in front of them. Salts and Brightside unchanged from V2.",
  accent: "#B14A1F",
  accentSoft: "#FBE4D8",
  accentInk: "#5B2510",
  status: "provisional",
  statusNote:
    "V3 numbers are PROVISIONAL — seeded from a default lean roster ($52k/mo payroll) and a $90k/mo fee placeholder. Awaiting founder's exact lean roster, then the fee can be locked against the resulting cost basis.",
  salts: SCENARIO_V2.salts,
  contracts: { cdp807: SCENARIO_V2.contracts.cdp807, agency: v3Agency },
  brightside: SCENARIO_V2.brightside,
  personal: v3Personal,
};

export const V3_DEER_LAKE_TRAVEL = tbd(
  "Same as V2 — practitioner visits ~3 days/mo, flight + lodging + per diem still TBD.",
);

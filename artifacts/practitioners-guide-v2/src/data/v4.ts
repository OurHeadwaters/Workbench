import { confirmed, tbd } from "./tags";
import type { RenegotiationTrigger, Scenario } from "./types";
import { SCENARIO_V2 } from "./v2";

/**
 * V4 — Right-priced scenario.
 *
 * STATUS: LOCKED on 2026-04-26 (defensible starting set; founder retains the
 * right to retune the published numbers, but the math below is internally
 * consistent against the same lean 6-role roster used in V3).
 *
 * The pricing story:
 *   - Same lean 6-role roster as V3 (drops Transparency Stack Engineer +
 *     Junior Analyst from V2). Payroll $52k/mo.
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
  { role: "IT / Tech", monthlyLoaded: 9500, notes: "Unchanged from V3" },
  { role: "Operations Manager (Dryden)", monthlyLoaded: 9500, notes: "Unchanged from V3" },
  { role: "Community Development Associate", monthlyLoaded: 7500, notes: "Unchanged from V3 — absorbs field work previously done by Junior Analyst" },
  { role: "Food Handler (Dryden depot)", monthlyLoaded: 5000, notes: "Unchanged from V3" },
  { role: "Bookkeeper / Admin", monthlyLoaded: 2500, notes: "Unchanged from V3" },
];

const v4PayrollTotal = v4Roster.reduce((s, r) => s + r.monthlyLoaded, 0); // 52,000

// Overheads: held identical to V2/V3.
const v4OverheadsBase = SCENARIO_V2.contracts.agency.overheadsJunAug;
const v4OverheadsJunAugTotal = SCENARIO_V2.contracts.agency.overheadsJunAugTotal; // 10,392
const v4OverheadsSepOnward = SCENARIO_V2.contracts.agency.overheadsSepOnward;
const v4OverheadsSepOnwardTotal = SCENARIO_V2.contracts.agency.overheadsSepOnwardTotal; // 12,492

const v4Fee = 105000;
const v4CostBasisJunAug = v4PayrollTotal + v4OverheadsJunAugTotal; // 62,392
const v4CostBasisSepOnward = v4PayrollTotal + v4OverheadsSepOnwardTotal; // 64,492
const v4SurplusJunAug = v4Fee - v4CostBasisJunAug; // 42,608  → 40.6% margin
const v4SurplusSepOnward = v4Fee - v4CostBasisSepOnward; // 40,508 → 38.6% margin

// Capital recovery: $112k / $42,608 ≈ 2.63 mo.
//   Month 1 (Jun): cum 42,608
//   Month 2 (Jul): cum 85,216
//   Month 3 (Aug): cum 127,824 — done; ~$15,824 trickle to splits (immaterial,
//   absorbed in the Phase 3 reconciliation just like V2's $824 trickle).

// Phase 3: Oct 2026 onward. 18 mo total − 3 mo cap recovery − 1 mo Brightside
// launch = 14 mo of Phase 3 splits at the post-Sep surplus rate.
const v4Phase3Months = 14;
const v4Phase3MonthlySurplus = v4SurplusSepOnward; // 40,508
const v4ReserveMonthly = v4Phase3MonthlySurplus * 0.5; // 20,254
const v4InnovationMonthly = v4Phase3MonthlySurplus * 0.25; // 10,127
const v4GivingMonthly = v4Phase3MonthlySurplus * 0.25; // 10,127

const v4Revenue18mo = v4Fee * 18; // 1,890,000
const v4Payroll18mo = v4PayrollTotal * 18; // 936,000
const v4Overheads18mo = 3 * v4OverheadsJunAugTotal + 15 * v4OverheadsSepOnwardTotal; // 218,556
const v4Surplus18mo = v4Revenue18mo - v4Payroll18mo - v4Overheads18mo;
// = 1,890,000 − 936,000 − 218,556 = 735,444
const v4Reserve18mo = Math.round(v4ReserveMonthly * v4Phase3Months); // 283,556
const v4Innovation18mo = Math.round(v4InnovationMonthly * v4Phase3Months); // 141,778
const v4Giving18mo = Math.round(v4GivingMonthly * v4Phase3Months); // 141,778

/**
 * Renegotiation triggers — the structured field the task asks for.
 *
 * Read these as: "at this step, IF (condition) is true with (evidence), the
 * fee steps to feeStepTo and the lead draw steps to drawStepTo."
 *
 * Founder retains the right to retune; published here so the renegotiation
 * conversation does not have to be invented from scratch later.
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

  overheadsJunAug: v4OverheadsBase,
  overheadsJunAugTotal: v4OverheadsJunAugTotal,
  overheadsSepOnward: v4OverheadsSepOnward,
  overheadsSepOnwardTotal: v4OverheadsSepOnwardTotal,
  overheadsTag: confirmed("Held identical to V2/V3 — overhead footprint is roster-shaped, not fee-shaped."),

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
  capitalRecoveryTag: confirmed("Recovery clears in 3 mo at the right-priced surplus, returning the V2-style cadence."),

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
  phase3Tag: confirmed("14-mo Phase 3 window at the post-Sep surplus — same shape as V2, sized to the right-priced fee."),

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

  reservePurposes: SCENARIO_V2.contracts.agency.reservePurposes,
  givingDirection: SCENARIO_V2.contracts.agency.givingDirection,
  renegotiationTriggers: v4Triggers,
};

const v4Personal = {
  agencySalary18mo: 324000,
  brightsideOwnerTake: 37000,
  total18mo: 361000,
  perYear: 240667,
  capitalRecovery: 112000,
  tag: confirmed(
    "Personal cash unchanged from V2/V3 baseline — lead draw stays at $18k/mo for the published 18 months. Renegotiation triggers (Contracts page) describe the post-month-12 step.",
  ),
};

export const SCENARIO_V4: Scenario = {
  id: "v4",
  name: "V4 — Right-priced",
  short: "V4",
  tagline: "$105k/mo agency · 6-role team · ~38.6% margin",
  description:
    "Right-priced engagement against the same lean 6-role roster as V3. Fee lifted to $105k/mo so the Sep-onward gross margin lands in the 35–40% band the founder needs for an 18-month commitment. Capital recovery clears in 3 months (Jun–Aug) and Brightside launch returns to September 2026. Renegotiation triggers describe the month-12 step in the founder's voice — pre-baked, not negotiated from scratch later.",
  accent: "#3B2A6E",
  accentSoft: "#E6E1F2",
  accentInk: "#1F1640",
  status: "locked",
  salts: SCENARIO_V2.salts,
  contracts: { cdp807: SCENARIO_V2.contracts.cdp807, agency: v4Agency },
  brightside: SCENARIO_V2.brightside,
  personal: v4Personal,
};

export const V4_DEER_LAKE_TRAVEL = tbd(
  "Same as V2/V3 — practitioner visits ~3 days/mo, flight + lodging + per diem still TBD.",
);

import { confirmed, tbd } from "./tags";
import type { RenegotiationTrigger, Scenario } from "./types";
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
 *   the top).
 *
 * 2026-04-28 update — Northern Band roster sync.
 *   Roster reshaped to match the canonical Northern Band team baked into the
 *   Operating Plan one-pager and the Northern Band Store Plan StaffingModel
 *   slide — the same change applied to V3:
 *     - Practitioner / Lead draw drops $18,000/mo → $14,000/mo (matches the
 *       OnePager A · floor founder draw).
 *     - Operations Manager renamed to Hub Coordinator (Dryden) and drops
 *       $9,500/mo → $8,500/mo.
 *     - Junior Analyst / Field added at $6,500/mo.
 *   Payroll: $52,000/mo (6 roles) → $53,500/mo (7 roles).
 *
 *   Cascade against the locked $105k fee (post-tithe surplus, the $1.5k/mo
 *   payroll step costs ~half a capital-recovery month inside the same 4-mo
 *   bucket; Brightside Launch Month is unchanged at October 2026):
 *     - Tithe: $10,500/mo → $189,000 over 18 months.
 *     - Cost basis: $63,892/mo Jun–Aug, $65,992/mo Sep onward.
 *     - Post-tithe surplus: $30,608/mo Jun–Aug, $28,508/mo Sep onward.
 *     - Capital recovery: still 4 mo (Jun–Sep 2026); Sep spillover trims
 *       from ~$14,332 to ~$8,332 to absorb the larger payroll.
 *     - Brightside Launch Month: October 2026 (unchanged).
 *     - Phase 3: 13 mo (Nov 2026 → Nov 2027) — unchanged.
 *     - Phase 3 split: 75/25 Reserve / Innovation — unchanged.
 *     - Practitioner draw cuts the personal-cash 18-mo total
 *       $324,000 → $252,000 in the published baseline. The renegotiation
 *       triggers below still describe the post-month-12 step.
 *
 *   Operating margin: post-tithe surplus margin is now ~27.2% Sep onward
 *   (was ~28.6% under the lighter roster). Pre-tithe operating margin
 *   moves to ~37.2%, still inside the 35–40% target band.
 *
 *   V4−V3 surplus-deployed invariant preserved: 519,444 − 276,444 = 243,000.
 *
 * The pricing story:
 *   - Same 7-role Northern Band roster as V3 (the locked default). Payroll $53.5k/mo.
 *   - Fee at $105k/mo so the Sep-onward operating margin lands at ~37.2%
 *     (target band: 35–40%) before the tithe is taken.
 *   - Lead draw stays at $14k/mo for the published 18 months. The
 *     renegotiation triggers below describe how the draw and fee step at
 *     month 12 once Brightside is live and the value-delivered audit lands.
 */

const v4Roster = [
  { role: "Practitioner / Lead", monthlyLoaded: 14000, notes: "Engagement owner; visits Northern Band ~3 days/mo. Draw steps at the renegotiation triggers below." },
  { role: "Hub Coordinator (Dryden)", monthlyLoaded: 8500, notes: "Phone, depot, day-of fires; Northern Band distribution" },
  { role: "IT / Tech", monthlyLoaded: 9500, notes: "Technical advisor on call; quarterly software review; checks any code that touches money" },
  { role: "Community Development Associate", monthlyLoaded: 7500 },
  { role: "Food Handler (Dryden depot)", monthlyLoaded: 5000 },
  { role: "Junior Analyst / Field", monthlyLoaded: 6500, notes: "Data, household price lookups, fieldwork" },
  { role: "Bookkeeper / Admin", monthlyLoaded: 2500, notes: "Closes the month; prepares payroll; minimal reporting" },
];

const v4PayrollTotal = v4Roster.reduce((s, r) => s + r.monthlyLoaded, 0); // 53,500

const v4Fee = 105000;

// Tithe — top of the waterfall. 10% off the top, first claim on revenue.
const v4TithePct = 10;
const v4TitheMonthly = v4Fee * 0.10; // 10,500
const v4Tithe18mo = v4TitheMonthly * 18; // 189,000

const v4CostBasisJunAug = v4PayrollTotal + SHARED_OVERHEADS_JUN_AUG_TOTAL; // 63,892
const v4CostBasisSepOnward = v4PayrollTotal + SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 65,992

// Surplus is post-tithe: fee − tithe − cost basis.
const v4SurplusJunAug = v4Fee - v4TitheMonthly - v4CostBasisJunAug; // 30,608
const v4SurplusSepOnward = v4Fee - v4TitheMonthly - v4CostBasisSepOnward; // 28,508

// Capital recovery: $112,000 against the post-tithe surplus.
//   Months 1–3 (Jun–Aug at $30,608/mo): cumulative $91,824
//   Month 4 (Sep at $28,508/mo): retire remaining $20,176 → ~$8,332 spillover
// → Capital recovery: 4 months (Jun–Sep 2026)
// → Brightside Launch Month: Oct 2026 (unchanged)
// → Phase 3: 13 mo (Nov 2026 → Nov 2027) at the post-tithe Sep-onward rate.
const v4Phase3Months = 13;
const v4Phase3MonthlySurplus = v4SurplusSepOnward; // 28,508

// Phase 3 split: 75/25 Reserve / Innovation (unchanged from the tithe-first
// renormalisation — the old 25 giving slice consolidated into Reserve).
const v4ReservePct = 75;
const v4InnovationPct = 25;
const v4ReserveMonthly = v4Phase3MonthlySurplus * 0.75; // 21,381
const v4InnovationMonthly = v4Phase3MonthlySurplus * 0.25; // 7,127

const v4Revenue18mo = v4Fee * 18; // 1,890,000
const v4Payroll18mo = v4PayrollTotal * 18; // 963,000
const v4Overheads18mo = 3 * SHARED_OVERHEADS_JUN_AUG_TOTAL + 15 * SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 218,556
const v4Surplus18mo = v4Revenue18mo - v4Tithe18mo - v4Payroll18mo - v4Overheads18mo;
// = 1,890,000 − 189,000 − 963,000 − 218,556 = 519,444
const v4Reserve18mo = Math.round(v4ReserveMonthly * v4Phase3Months); // 21,381 × 13 = 277,953
const v4Innovation18mo = Math.round(v4InnovationMonthly * v4Phase3Months); // 7,127 × 13 = 92,651

/**
 * Renegotiation triggers — the structured field that makes the renegotiation
 * conversation legible without inventing it from scratch later.
 *
 * Read each as: "at this step, IF (condition) is true with (evidence), the
 * fee steps to feeStepTo and the lead draw steps to drawStepTo."
 *
 * Step-to values are absolute targets agreed in advance, not deltas — so they
 * survive the 2026-04-28 base-draw cut from $18k to $14k unchanged.
 */
const v4Triggers: RenegotiationTrigger[] = [
  {
    step: "Month 12 renegotiation",
    condition:
      "Brightside is live (paying customers > 0) AND Jude's tool is in daily use at Headwaters.",
    feeStepTo: 115000,
    drawStepTo: 20000,
    evidenceRequired:
      "Brightside billing dashboard + Jude tool usage log, both reviewed with the buyer at the month-12 sit-down.",
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
  buyerStatus: "TBD (band council vs father — affects political weight, not the math)",
  feeTag: confirmed(
    "Right-priced against the 7-role Northern Band roster — Sep-onward operating margin (pre-tithe) lands at ~37.2% (target band 35–40%).",
  ),

  roster: v4Roster,
  payrollTotal: v4PayrollTotal,
  rosterTag: confirmed("Same 7-role Northern Band team as V3 — synced from the Operating Plan one-pager and the Northern Band StaffingModel slide on 2026-04-28. Fee changes between V3 and V4; team shape does not."),

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

  familyInfusionRecovery: 0,
  familyInfusionRecoveryTag: confirmed("V4 right-priced kept Capital Recovery undivided ($112k = $72k loan + $40k family infusion paid in order). The split-leg framing was added in V5 to make the front-loading of the family piece visible without changing tax/legal substance — both V4 and V5 are tax-free debt repayment."),
  familyInfusionRecoveryDescription: "",

  teamIncentivesName: "Team incentives (Christmas bonus, perks of employment)",
  teamIncentivesAmount: null,
  teamIncentivesTag: confirmed("Visible-but-TBD line so the planning conversation never silently drops the team-incentives bucket; dollar amount has not been pinned yet."),

  capitalRecoveryAmount: 112000,
  capitalRecoveryDescription:
    "$72k outstanding business loan first, then $40k personal infusion from founder's husband, in that order.",
  capitalRecoveryMonths: 4,
  capitalRecoveryStartLabel: "Jun 2026",
  capitalRecoveryEndLabel: "End of Sep 2026 (~$8,332 Sep spillover after recovery completes — trimmed from the V4-pre-roster-sync ~$14,332 to absorb the larger payroll)",
  capitalRecoveryTag: confirmed("Recovery still clears in 4 mo at the post-tithe right-priced surplus. The added Junior Analyst seat and Hub Coordinator step-down (net $1,500/mo of cost basis) eats ~$6k of Sep spillover but does not push recovery into a fifth month."),

  brightsideLaunchMonthLabel: "October 2026 (unchanged from the V4-pre-roster-sync target — the new payroll fits inside the existing capital-recovery window)",
  brightsidePrelaunchSpend: 28000,
  brightsideLaunchSurplus: v4SurplusSepOnward,
  brightsideLaunchRemainder: v4SurplusSepOnward - 28000, // 508
  brightsideLaunchTag: confirmed("Oct surplus ($28,508) covers the $28k pre-launch with $508 left over for the Reserve / Innovation Phase 3 split."),

  phase3Months: v4Phase3Months,
  phase3MonthlySurplus: v4Phase3MonthlySurplus,
  reservePct: v4ReservePct,
  innovationPct: v4InnovationPct,
  reserveMonthly: v4ReserveMonthly,
  innovationMonthly: v4InnovationMonthly,
  reserveTotal: v4Reserve18mo,
  innovationTotal: v4Innovation18mo,
  phase3Tag: confirmed("13-mo Phase 3 window (Nov 2026 → Nov 2027) at the post-tithe Sep-onward surplus. Split unchanged at 75/25 Reserve / Innovation."),

  totals18mo: {
    revenue: v4Revenue18mo,
    tithe: v4Tithe18mo,
    payroll: v4Payroll18mo,
    overheads: v4Overheads18mo,
    surplusDeployed: v4Surplus18mo,
    familyInfusionRecovery: 0,
    capitalRecovery: 112000,
    brightsidePrelaunch: 28000,
    reserve: v4Reserve18mo,
    innovation: v4Innovation18mo,
    tag: confirmed("Computed from locked fee + roster, with tithe taken first."),
  },

  practitionerSalary18mo: v4Roster[0].monthlyLoaded * 18, // 252,000
  practitionerSalaryTag: confirmed(
    "Lead salary held at $14k/mo × 18 = $252k for the published 18 months, matching the canonical Northern Band roster. Renegotiation triggers describe the step at month 12.",
  ),

  reservePurposes: SHARED_RESERVE_PURPOSES,
  givingDirection: SHARED_GIVING_DIRECTION,
  renegotiationTriggers: v4Triggers,
};

const v4Personal = {
  agencySalary18mo: v4Roster[0].monthlyLoaded * 18, // 252,000
  brightsideOwnerTake: SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 31,000 (post-tithe-first revision 2026-04-29)
  total18mo: v4Roster[0].monthlyLoaded * 18 + SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 283,000
  perYear: Math.round(
    (v4Roster[0].monthlyLoaded * 18 + SHARED_BRIGHTSIDE.surplusDeployment.ownerTake) / 1.5,
  ), // 188,667
  capitalRecovery: 112000,
  tag: confirmed(
    "Lead draw stays at $14k/mo for the published 18 months under the 2026-04-28 Northern Band roster sync. V4 personal-cash matches V3 personal-cash; the V4 advantage shows up in surplus deployment, not personal income. Brightside owner take dropped from $37k to $31k under the 2026-04-29 tithe-first revision. Renegotiation triggers (Contracts page) describe the post-month-12 step.",
  ),
};

export const SCENARIO_V4: Scenario = {
  id: "v4",
  name: "V4 — Right-priced",
  short: "V4",
  tagline: "$105k/mo agency · 7-role Northern Band team · ~37.2% operating margin · tithe-first",
  description:
    "Right-priced engagement against the same 7-role Northern Band roster as V3. Fee at $105k/mo so the Sep-onward operating margin (pre-tithe) lands in the 35–40% band. Tithe-first deployment: 10% off the top to Giving, then capital recovery (4 mo Jun–Sep 2026), then Brightside launch (October 2026), then 13 months of Reserve / Innovation. Renegotiation triggers describe the month-12 step in the founder's voice — pre-baked, not negotiated from scratch later. Also seeded as the first alternative-reality tab on the Compare page.",
  accent: "#3B2A6E",
  accentSoft: "#E6E1F2",
  accentInk: "#1F1640",
  status: "locked",
  salts: SHARED_SALTS,
  contracts: { agency: v4Agency },
  brightside: SHARED_BRIGHTSIDE,
  personal: v4Personal,
};

export const V4_DEER_LAKE_TRAVEL = tbd(
  "Practitioner visits ~3 days/mo, flight + lodging + per diem still TBD.",
);

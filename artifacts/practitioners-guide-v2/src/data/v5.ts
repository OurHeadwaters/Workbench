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
 * V5 — Codetry archetype, applied to Deer Lake.
 *
 * STATUS: LOCKED on 2026-04-29. V5 is the new default operating framework
 * — the rest of the guide reads from V5. V4 (Right-priced) and V3 (Lean
 * team) are preserved as historical baselines so the workspace can still
 * tell the story of how the model evolved.
 *
 * The model split.
 *   The old V3/V4 line carried the assumption that every Codetry engagement
 *   looked the same shape: one $90k–$105k/mo agency-style fee with a
 *   ~7-role team and an 18-month-anchored cost basis. As we mapped out the
 *   first non-Deer Lake engagements, that assumption broke — the
 *   Software/Sales archetype (e.g. Karen's tool, Brightside SaaS, future
 *   licensed software products) doesn't carry the same boots-on-the-ground
 *   payroll, and Deer Lake's economics don't translate cleanly to a SaaS
 *   P&L. So as of 2026-04-29 we now carry two project archetypes:
 *
 *     - Codetry archetype — community engagement with a lead practitioner
 *       on the ground, a small team, a 12-month engagement window, and a
 *       signing-bonus line up front to compensate the lead for the
 *       discontinuity-of-income risk of stepping into the engagement. V5
 *       is the canonical Codetry-archetype scenario, applied to Deer
 *       Lake.
 *
 *     - Software/Sales archetype — leveraged software/services revenue,
 *       no signing bonus (profit-share carries the equivalent value), no
 *       12-month engagement window. Brightside is the canonical example;
 *       Karen's tool is the next one. The Software/Sales archetype is
 *       described on the Archetypes page; it does not carry a numbered
 *       scenario in this workspace because its economics are book-kept
 *       inside the existing Brightside scenario.
 *
 *   See the Archetypes page for the long-form explainer.
 *
 * V5 vs V4 — what changed.
 *   - Engagement window: 18 mo → 12 mo. Codetry-archetype engagements run
 *     a fixed 12-month book before either renewing or stepping to the
 *     next phase, instead of being baked into an 18-month total at the
 *     start.
 *   - Roster: 7 roles → 4 roles on Day 1. Codetry archetype is
 *     intentionally leaner on the ground than the V3/V4 7-role roster.
 *     The IT/Tech, Community Development, and Junior Analyst seats
 *     from the V4 roster are NOT removed from the planning surface —
 *     they are deferred and gated against the month-12 renegotiation
 *     triggers below. They reappear (or get reassigned to the
 *     Software/Sales archetype) once a trigger fires; until then
 *     they're not on the Day-1 cost basis.
 *   - Lead draw: $14k/mo → $18k/mo. The Codetry archetype lead is the
 *     primary engagement owner and carries the discontinuity-of-income
 *     risk; the draw moves up to match.
 *   - Signing bonus: NEW — $40,000 in month 1 (with month-2 spillover).
 *     The bonus retires the founder's husband's family infusion in full
 *     up front, so capital recovery shrinks from $112k to $72k (loan
 *     only).
 *   - Surplus waterfall: Tithe → Wages → SIGNING BONUS (new) → Capital
 *     Recovery → Reserve / Innovation. Brightside Launch Month phase is
 *     dropped from the agency waterfall — Brightside's ~$28k pre-launch
 *     is funded out of the Innovation bucket once the engagement is
 *     deployed.
 *   - Renegotiation triggers: reset to the $90k baseline. The V4 triggers
 *     described stepping a $105k right-priced fee up further; V5 starts
 *     at $90k and the same triggers describe stepping back up toward
 *     right-priced once the value-delivered audit lands.
 *   - Team incentives: NEW visible-but-TBD line. Christmas bonus, perks
 *     of employment etc. surface as a named row even though the dollar
 *     amount has not been pinned yet.
 *
 * The numbers (computed below):
 *   Roster (4 roles): Lead $18,000 + Ops & Food (Dryden) $13,500 +
 *     Code Reviewer $9,500 + Bookkeeper $2,500 = $43,500/mo.
 *   Fee: $90,000/mo × 12 = $1,080,000.
 *   Tithe: $9,000/mo × 12 = $108,000 (10% of revenue, off the top).
 *   Cost basis: $43,500 + $10,392 = $53,892/mo Jun–Aug;
 *               $43,500 + $12,492 = $55,992/mo Sep onward.
 *   Post-tithe surplus: $27,108/mo Jun–Aug; $25,008/mo Sep onward.
 *   Surplus waterfall (12 months total = $306,396):
 *     - Signing bonus: $40,000
 *         Month 1 (Jun, $27,108) covers $27,108 of bonus; remaining
 *         $12,892 spills into month 2 (Jul, $27,108), leaving $14,216
 *         toward capital recovery.
 *     - Capital recovery: $72,000 (loan only — family infusion was paid
 *       via the signing bonus)
 *         Aug ($27,108): cum cap recovery = $14,216 + $27,108 = $41,324
 *         Sep ($25,008): cum = $66,332
 *         Oct ($25,008): need $5,668 — completes recovery, leaves
 *         $19,340 spillover into the Reserve / Innovation phase.
 *     - Phase 3 (Reserve / Innovation, 75/25): $194,396
 *         Nov 2026 → May 2027 (7 months) at $25,008/mo = $175,056,
 *         plus $19,340 Oct spillover.
 *         Reserve: $145,797 (≈ 75%)
 *         Innovation: $48,599 (≈ 25%)
 */

const v5Roster = [
  {
    role: "Practitioner / Lead",
    monthlyLoaded: 18000,
    notes:
      "Engagement owner; visits Deer Lake ~3 days/mo. Carries the discontinuity-of-income risk of starting the engagement; signing bonus retires the family-infusion piece of that risk in full up front. Draw steps at the renegotiation triggers below.",
  },
  {
    role: "Operations & Food (Dryden)",
    monthlyLoaded: 13500,
    notes:
      "Phone, depot, day-of fires, food handling at the Dryden depot, Deer Lake distribution. Combines the V3/V4 Hub Coordinator and Food Handler seats into a single ops-and-food role.",
  },
  {
    role: "Code Reviewer",
    monthlyLoaded: 9500,
    notes:
      "Technical advisor on call; quarterly software review; checks any code that touches money. Carried inside the Codetry-archetype roster because Deer Lake's checkout uses Codetry-built software end-to-end.",
  },
  {
    role: "Bookkeeper / Admin",
    monthlyLoaded: 2500,
    notes:
      "Closes the month; prepares payroll; minimal reporting.",
  },
];

const v5PayrollTotal = v5Roster.reduce((s, r) => s + r.monthlyLoaded, 0); // 43,500

const v5Fee = 90000;
const v5TermMonths = 12;

// Tithe — top of the waterfall. 10% off the top, first claim on revenue.
const v5TithePct = 10;
const v5TitheMonthly = v5Fee * 0.10; // 9,000
const v5TitheTotal = v5TitheMonthly * v5TermMonths; // 108,000

const v5CostBasisJunAug = v5PayrollTotal + SHARED_OVERHEADS_JUN_AUG_TOTAL; // 53,892
const v5CostBasisSepOnward = v5PayrollTotal + SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 55,992

// Post-tithe monthly surplus.
const v5SurplusJunAug = v5Fee - v5TitheMonthly - v5CostBasisJunAug; // 27,108
const v5SurplusSepOnward = v5Fee - v5TitheMonthly - v5CostBasisSepOnward; // 25,008

// Signing bonus — NEW V5 surplus-waterfall line, between Wages and Capital
// Recovery. $40,000 paid in month 1 (with month-2 spillover). Retires the
// founder's husband's family infusion in full up front, so capital recovery
// shrinks from $112k to $72k (loan only).
const v5SigningBonus = 40000;

// Capital recovery — loan only ($72k); the family infusion was paid via the
// signing bonus.
const v5CapitalRecovery = 72000;

// 12-month totals.
const v5RevenueTotal = v5Fee * v5TermMonths; // 1,080,000
const v5PayrollTotalWindow = v5PayrollTotal * v5TermMonths; // 522,000
// 3 months Jun–Aug + 9 months Sep–May at the SHARED overhead rates.
const v5OverheadsTotal =
  3 * SHARED_OVERHEADS_JUN_AUG_TOTAL + 9 * SHARED_OVERHEADS_SEP_ONWARD_TOTAL; // 31,176 + 112,428 = 143,604
const v5SurplusDeployed =
  v5RevenueTotal - v5TitheTotal - v5PayrollTotalWindow - v5OverheadsTotal;
// = 1,080,000 − 108,000 − 522,000 − 143,604 = 306,396

// Phase 3 budget — what's left after the signing bonus and capital recovery.
const v5Phase3Budget =
  v5SurplusDeployed - v5SigningBonus - v5CapitalRecovery; // 194,396

// Phase 3 starts Nov 2026 (after capital recovery completes early in Oct).
// The Oct overshoot ($19,340) sits inside the Phase 3 budget too, which is
// why Phase 3 totals come out larger than (months × monthly).
const v5Phase3Months = 7; // Nov 2026 → May 2027
const v5Phase3MonthlySurplus = v5SurplusSepOnward; // 25,008

// Phase 3 split: 75/25 Reserve / Innovation. Same shape as V3/V4.
const v5ReservePct = 75;
const v5InnovationPct = 25;
const v5ReserveMonthly = Math.round(v5Phase3MonthlySurplus * 0.75); // 18,756
const v5InnovationMonthly = Math.round(v5Phase3MonthlySurplus * 0.25); // 6,252
// Totals computed against the Phase 3 budget (so the Oct spillover is
// distributed across Reserve / Innovation in the same 75/25 ratio).
const v5ReserveTotal = Math.round(v5Phase3Budget * 0.75); // 145,797
const v5InnovationTotal = v5Phase3Budget - v5ReserveTotal; // 48,599

/**
 * Renegotiation triggers — reset to the $90k baseline. The V4 triggers
 * described stepping a $105k right-priced fee up to $115k/$120k; V5 starts
 * at $90k and the same triggers describe stepping back up toward the
 * right-priced range once the value-delivered audit lands.
 */
const v5Triggers: RenegotiationTrigger[] = [
  {
    step: "Month 12 renegotiation",
    condition:
      "Brightside is live (paying customers > 0) AND the Software/Sales-archetype products in flight (Karen's tool, etc.) are in daily use at Headwaters.",
    feeStepTo: 105000,
    drawStepTo: 22000,
    evidenceRequired:
      "Brightside billing dashboard + Karen tool usage log + month-12 sit-down with the buyer. Note the step-to is the V4 right-priced fee — V5 starts $15k below right-priced and the renegotiation steps the engagement up once the work is demonstrably landing.",
  },
  {
    step: "Month 18 renewal (Year-2 option)",
    condition:
      "Year-1 value-delivered audit (Task #33) ≥ 12-month cumulative markup AND Trigger 1 fired.",
    feeStepTo: 115000,
    drawStepTo: 24000,
    evidenceRequired:
      "Signed value-delivered audit report, countersigned by buyer's CFO. Markup figure pulled from the locked V5 12-month agency totals.",
  },
];

const v5Agency = {
  fee: v5Fee,
  termMonths: v5TermMonths,
  renegotiateMonth: 12,
  startDate: "June 1, 2026",
  buyerStatus: "TBD (band council vs father — affects political weight, not the math)",
  feeTag: confirmed(
    "$90k/mo Codetry-archetype baseline against the 4-role Day-1 team. Sits $15k/mo below the V4 right-priced fee — the gap is closed at the month-12 renegotiation triggers (see below).",
  ),

  roster: v5Roster,
  payrollTotal: v5PayrollTotal,
  rosterTag: confirmed(
    "Codetry-archetype Day-1 team — leaner than the V3/V4 7-role roster. The IT/Tech, Community Development, and Junior Analyst seats from the V4 roster are NOT removed from the planning surface; they are deferred and gated against the month-12 renegotiation triggers, and reappear (or get reassigned to the Software/Sales archetype) once a trigger fires.",
  ),

  overheadsJunAug: SHARED_OVERHEADS_JUN_AUG,
  overheadsJunAugTotal: SHARED_OVERHEADS_JUN_AUG_TOTAL,
  overheadsSepOnward: SHARED_OVERHEADS_SEP_ONWARD,
  overheadsSepOnwardTotal: SHARED_OVERHEADS_SEP_ONWARD_TOTAL,
  overheadsTag: confirmed("Roster-shaped, not fee-shaped — held identical across every scenario."),

  tithePct: v5TithePct,
  titheMonthly: v5TitheMonthly,
  titheTotal: v5TitheTotal,

  signingBonus: v5SigningBonus,
  signingBonusTag: confirmed(
    "Codetry-archetype signing bonus — $40,000 paid in month 1 (with $12,892 spillover into month 2 at the post-tithe surplus rate). Retires the founder's husband's family infusion in full up front, so capital recovery shrinks from $112k (V4) to $72k (V5, loan only).",
  ),
  signingBonusDescription:
    "Signing bonus compensates the lead for the discontinuity-of-income risk of starting a community engagement. For Deer Lake the bonus is sized to retire the family infusion ($40,000) in full up front — paid in month 1, with month-2 spillover at the post-tithe surplus rate.",

  teamIncentivesName: "Team incentives (Christmas bonus, perks of employment)",
  teamIncentivesAmount: null,
  teamIncentivesTag: confirmed(
    "Visible-but-TBD line so the planning conversation never silently drops the team-incentives bucket; dollar amount has not been pinned yet.",
  ),

  costBasisJunAug: v5CostBasisJunAug,
  costBasisSepOnward: v5CostBasisSepOnward,
  monthlySurplusJunAug: v5SurplusJunAug,
  monthlySurplusSepOnward: v5SurplusSepOnward,
  costBasisTag: confirmed("Computed from locked roster + fee, post-tithe."),

  capitalRecoveryAmount: v5CapitalRecovery,
  capitalRecoveryDescription:
    "$72k outstanding business loan only. The $40k family infusion (founder's husband) is paid via the signing bonus in month 1, not via this line.",
  capitalRecoveryMonths: 5,
  capitalRecoveryStartLabel: "Aug 2026 (after the signing bonus completes mid-July)",
  capitalRecoveryEndLabel:
    "Early Oct 2026 (~$19,340 Oct spillover into the Reserve / Innovation phase)",
  capitalRecoveryTag: confirmed(
    "Loan-only recovery at the post-tithe surplus. Starts in month 3 once the signing bonus completes spillover into month 2; clears in Oct 2026 with $19,340 of Oct spillover into Phase 3.",
  ),

  brightsideLaunchMonthLabel:
    "(none — V5 omits the dedicated Brightside Launch Month phase from the agency waterfall; Brightside's ~$28k pre-launch is funded out of the Innovation bucket once Phase 3 is deployed)",
  brightsidePrelaunchSpend: 0,
  brightsideLaunchSurplus: 0,
  brightsideLaunchRemainder: 0,
  brightsideLaunchTag: confirmed(
    "V5 omits the dedicated Brightside Launch Month phase. The ~$28k Brightside pre-launch is funded from the Innovation bucket inside Phase 3, not from a carved-out launch-month surplus.",
  ),

  phase3Months: v5Phase3Months,
  phase3MonthlySurplus: v5Phase3MonthlySurplus,
  reservePct: v5ReservePct,
  innovationPct: v5InnovationPct,
  reserveMonthly: v5ReserveMonthly,
  innovationMonthly: v5InnovationMonthly,
  reserveTotal: v5ReserveTotal,
  innovationTotal: v5InnovationTotal,
  phase3Tag: confirmed(
    "7-mo Phase 3 window (Nov 2026 → May 2027) at the post-tithe Sep-onward surplus, plus the Oct capital-recovery spillover. Split unchanged at 75/25 Reserve / Innovation.",
  ),

  totals18mo: {
    revenue: v5RevenueTotal,
    tithe: v5TitheTotal,
    payroll: v5PayrollTotalWindow,
    overheads: v5OverheadsTotal,
    surplusDeployed: v5SurplusDeployed,
    signingBonus: v5SigningBonus,
    capitalRecovery: v5CapitalRecovery,
    brightsidePrelaunch: 0,
    reserve: v5ReserveTotal,
    innovation: v5InnovationTotal,
    tag: confirmed(
      "Computed from locked fee + roster, with tithe taken first and the signing bonus paid second. Engagement window is 12 months (V5), not 18 months (V3/V4).",
    ),
  },

  practitionerSalary18mo: v5Roster[0].monthlyLoaded * v5TermMonths, // 216,000
  practitionerSalaryTag: confirmed(
    "Lead draw lifted to $18k/mo for the published 12 months under the Codetry-archetype split — the lead carries the discontinuity-of-income risk of starting the engagement. Renegotiation triggers (Contracts page) describe the post-month-12 step.",
  ),

  reservePurposes: SHARED_RESERVE_PURPOSES,
  givingDirection: SHARED_GIVING_DIRECTION,
  renegotiationTriggers: v5Triggers,
};

const v5Personal = {
  agencySalary18mo: v5Roster[0].monthlyLoaded * v5TermMonths, // 216,000
  brightsideOwnerTake: SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 31,000 (post-tithe Brightside)
  total18mo:
    v5Roster[0].monthlyLoaded * v5TermMonths +
    SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 247,000
  perYear: Math.round(
    (v5Roster[0].monthlyLoaded * v5TermMonths +
      SHARED_BRIGHTSIDE.surplusDeployment.ownerTake) /
      (v5TermMonths / 12),
  ), // 247,000
  capitalRecovery: v5CapitalRecovery,
  tag: confirmed(
    "Lead draw at $18k/mo × 12 = $216k for the published 12 months under the Codetry-archetype split. Brightside owner-take is post-tithe ($31k vs $37k under the pre-2026-04-29 model).",
  ),
};

export const SCENARIO_V5: Scenario = {
  id: "v5",
  name: "V5 — Codetry archetype (Deer Lake)",
  short: "V5",
  tagline:
    "$90k/mo agency · 4-role Day-1 team · 12-month engagement · $40k signing bonus · tithe-first",
  description:
    "Codetry-archetype baseline applied to Deer Lake. Lean 4-role Day-1 team ($43.5k/mo payroll), $90k/mo agency fee, 12-month engagement window. Surplus waterfall: tithe → wages → signing bonus → capital recovery → Reserve / Innovation. Signing bonus ($40k m1) retires the family infusion in full up front; capital recovery shrinks to the $72k loan-only piece. Renegotiation triggers reset to the $90k baseline — they describe stepping the fee back up toward the V4 right-priced range once the value-delivered audit lands.",
  accent: "#1F5B3F",
  accentSoft: "#DDF0E5",
  accentInk: "#0F2E20",
  status: "locked",
  salts: SHARED_SALTS,
  contracts: { agency: v5Agency },
  brightside: SHARED_BRIGHTSIDE,
  personal: v5Personal,
};

export const V5_DEER_LAKE_TRAVEL = tbd(
  "Practitioner visits ~3 days/mo, flight + lodging + per diem still TBD.",
);

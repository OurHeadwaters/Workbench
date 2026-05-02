import { confirmed, tbd } from "./tags";
import type { RenegotiationTrigger, Scenario } from "./types";
import {
  SHARED_BRIGHTSIDE,
  SHARED_GIVING_DIRECTION,
  SHARED_RESERVE_PURPOSES,
  SHARED_SALTS,
} from "./shared";

/**
 * V6 — Hourly subcontracting model, applied to Deer Lake.
 *
 * STATUS: LOCKED on 2026-05-02. V6 is the new default operating framework.
 * V5 (Codetry archetype, $90k/mo agency fee) is preserved as a historical
 * baseline. V3 remains the workspace anchor.
 *
 * What changed from V5.
 *   V5 carried a $90,000/mo flat agency fee against a 4-role Day-1 team with
 *   a $43,500/mo payroll. V6 replaces the flat agency fee with an hourly
 *   subcontracting structure:
 *
 *     - Bobbie bills at $150/hr, nets $80/hr (the $70 delta funds Tyler's
 *       subcontract pass-through directly — client sees two line items).
 *     - Tyler (RFF — boots on the ground for distribution at Sioux Lookout
 *       and Deer Lake) bills at $70/hr.
 *     - Both work 40 hr/wk. Monthly billing basis: 4 wk × 40 hr = 160 hr/mo.
 *
 *   This is a two-person lean structure, not an agency fee. Bobbie's $12,800/mo
 *   draw IS the income — there is no agency surplus waterfall to speak of beyond
 *   what remains after Tyler, tithe, and lean overheads. The overhead footprint
 *   shrinks dramatically because the client pays the tech stack and there is no
 *   aggregation-hub rent.
 *
 * Structure.
 *   Phase 1 — Trial / Planning (8 weeks, 40 hr/wk, Bobbie solo):
 *     $25,000 flat fee. Intentionally below Bobbie's cost at full hours
 *     (8 wk × 40 hr × $80 = $25,600 draw vs $22,500 post-tithe revenue).
 *     The $3,100 gap is the entry price — a bounded, below-cost trial is the
 *     deliberate opening posture. Hardware (computer + server, ~$3k–$4k) is
 *     deferred until an ongoing commitment is confirmed.
 *
 *   Phase 2 — Full engagement (12 months, Jun 2026 – May 2027):
 *     Bobbie + Tyler, 160 hr/mo each. $35,200/mo total billed to client.
 *     Tithe 10% off the top, then Bobbie draw, Tyler sub, lean overheads.
 *     Monthly surplus: $6,388/mo (Jun–Aug, before life supports) →
 *     reduced Sep onward if life-supports overhead applies (see note).
 *     Surplus waterfall: TBD — not enough history to lock Reserve / Innovation
 *     split; capital recovery may be handled outside the engagement cash flow.
 *
 * Overheads (V6 — lean footprint; client pays the tech stack).
 *   Space (small, not the full hub): $500/mo
 *   Insurance + petty cash:          $500/mo
 *   Accountant ($1,500/yr ÷ 12):     $125/mo
 *   Legal ($2,000/yr ÷ 12):          $167/mo
 *   Total:                            $1,292/mo
 *
 *   Note: The V5 shared-overhead block (hub $3,000, tooling $2,500, buffer $2,400,
 *   tech ops $2,200, life supports $2,100 Sep onward) does NOT apply to V6 — those
 *   overheads were sized for a $90k/mo engagement. V6 uses only the lean subset above.
 *
 *   Code review + IT: one-time cost (a few weeks, ~$2k–$5k total), rolled under
 *   Tyler's subcontractor line when Deer Lake engagement is confirmed. Not a monthly
 *   overhead line.
 *
 * The numbers (computed below):
 *   Phase 1: $25,000 flat · 10% tithe ($2,500) · post-tithe $22,500
 *            Bobbie cost 8 × 40 × $80 = $25,600 → runs $3,100 below cost (intentional)
 *
 *   Phase 2 monthly (160 hr/mo each):
 *     Bobbie billed:  160 × $150 = $24,000
 *     Tyler billed:   160 × $70  = $11,200
 *     Total billed:               $35,200
 *     Tithe (10%):                 $3,520
 *     Bobbie draw (160 × $80):    $12,800
 *     Tyler sub:                  $11,200
 *     Overheads:                   $1,292
 *     Monthly surplus:             $6,388
 *
 *   Phase 2 × 12 months:
 *     Revenue:    $35,200 × 12 = $422,400
 *     Tithe:       $3,520 × 12 =  $42,240
 *     Bobbie draw:$12,800 × 12 = $153,600
 *     Tyler sub:  $11,200 × 12 = $134,400
 *     Overheads:   $1,292 × 12 =  $15,504
 *     Surplus:     $6,388 × 12 =  $76,656 (waterfall TBD)
 *
 *   Full project (Phase 1 + Phase 2): $447,400 total revenue
 */

// ── Phase 2 rates ─────────────────────────────────────────────────────────────

const v6HoursPerMonth = 160; // 40 hr/wk × 4 wk billing basis

const v6BobbieRate = 150;   // billed to client
const v6TylerRate  = 70;    // billed to client / paid to Tyler
const v6BobbieNet  = 80;    // Bobbie nets (billed minus Tyler-funded delta)

const v6BobbieMonthlyBilled = v6HoursPerMonth * v6BobbieRate; // 24,000
const v6TylerMonthlyBilled  = v6HoursPerMonth * v6TylerRate;  // 11,200
const v6TotalMonthlyBilled  = v6BobbieMonthlyBilled + v6TylerMonthlyBilled; // 35,200

const v6TithePct     = 10;
const v6TitheMonthly = v6TotalMonthlyBilled * 0.10; // 3,520

const v6BobbieDrawMonthly = v6HoursPerMonth * v6BobbieNet; // 12,800
const v6TylerCostMonthly  = v6TylerMonthlyBilled;          // 11,200

// V6 lean overheads
const v6OverheadsMonthly = 1292; // space $500 + insurance/petty $500 + acct $125 + legal $167

const v6MonthlySurplus =
  v6TotalMonthlyBilled - v6TitheMonthly - v6BobbieDrawMonthly - v6TylerCostMonthly - v6OverheadsMonthly;
// 35,200 - 3,520 - 12,800 - 11,200 - 1,292 = 6,388

// ── Phase 2 × 12 months ───────────────────────────────────────────────────────

const v6TermMonths   = 12;
const v6Phase2Revenue  = v6TotalMonthlyBilled * v6TermMonths; // 422,400
const v6Phase2Tithe    = v6TitheMonthly * v6TermMonths;       // 42,240
const v6Phase2Bobbie   = v6BobbieDrawMonthly * v6TermMonths;  // 153,600
const v6Phase2Tyler    = v6TylerCostMonthly  * v6TermMonths;  // 134,400
const v6Phase2Overhead = v6OverheadsMonthly  * v6TermMonths;  // 15,504
const v6Phase2Surplus  = v6MonthlySurplus    * v6TermMonths;  // 76,656

// ── Phase 1 ───────────────────────────────────────────────────────────────────

const v6Phase1Flat      = 25000;
const v6Phase1Tithe     = v6Phase1Flat * 0.10; // 2,500
const v6Phase1PostTithe = v6Phase1Flat - v6Phase1Tithe; // 22,500
// Bobbie cost at full hours: 8 wk × 40 hr × $80 = $25,600 → -$3,100 vs post-tithe

// ── Full project ──────────────────────────────────────────────────────────────

const v6TotalRevenue = v6Phase1Flat + v6Phase2Revenue; // 447,400
const v6TotalTithe   = v6Phase1Tithe + v6Phase2Tithe;  // 44,740

// ── Renegotiation triggers ────────────────────────────────────────────────────

const v6Triggers: RenegotiationTrigger[] = [
  {
    step: "Month 12 renegotiation",
    condition:
      "Deer Lake store is operational, food is flowing, Tyler's role is established, and Bobbie's planning capacity is demonstrably landing value above the hourly cost.",
    feeStepTo: 0, // not a flat fee — rate steps, not a fee
    drawStepTo: 0, // placeholder; real step is Bobbie rate → $175/hr or scope expansion
    evidenceRequired:
      "Month-12 value-delivered audit: store throughput vs baseline, Tyler hours vs budget, any scope creep or additional communities served. Flip to confirmed rate-step once audit is signed.",
  },
];

// ── Agency object (adapts the AgencyScenario interface) ───────────────────────
// V6 is hourly, not a flat agency fee. Fee field = monthly billed total;
// roster represents Bobbie (lead) + Tyler (sub) as the two-person team.
// Fields that don't apply to V6 (family infusion, capital recovery, phase3,
// Brightside launch month) are set to zero / empty with explanatory tags.

const v6Agency = {
  fee: v6TotalMonthlyBilled, // 35,200 — monthly billed total (not a flat agency fee)
  termMonths: v6TermMonths,
  renegotiateMonth: 12,
  startDate: "June 1, 2026",
  buyerStatus: "TBD (band council vs father — affects political weight, not the math)",
  feeTag: confirmed(
    "Hourly structure: Bobbie 160 hr/mo × $150 = $24,000 + Tyler 160 hr/mo × $70 = $11,200. Total monthly billed $35,200. Client sees two line items. Bobbie nets $80/hr; Tyler's $70/hr is a direct pass-through subcontract.",
  ),

  roster: [
    {
      role: "Practitioner / Lead (Bobbie)",
      monthlyLoaded: v6BobbieDrawMonthly, // 12,800 net draw
      notes:
        "160 hr/mo × $150 billed, $80 net draw. Engagement owner; visits Deer Lake as needed. The $70/hr delta funds Tyler's subcontract directly.",
    },
    {
      role: "Distribution (Tyler — RFF subcontract)",
      monthlyLoaded: v6TylerCostMonthly, // 11,200
      notes:
        "160 hr/mo × $70. Boots on the ground for distribution at Sioux Lookout and Deer Lake. Billed to client, paid to Tyler as a pass-through subcontract. Code review + IT setup rolled under this line as a one-time cost when Deer Lake engagement is confirmed.",
    },
  ],
  payrollTotal: v6BobbieDrawMonthly + v6TylerCostMonthly, // 24,000 combined draws
  rosterTag: confirmed(
    "Two-person lean structure: Bobbie (lead, $12,800/mo net draw) + Tyler (sub, $11,200/mo pass-through). Client pays tech stack — no separate tooling overhead. Code/IT is a one-time cost under Tyler's line.",
  ),

  overheadsJunAug: [
    { name: "Space (small, not full hub)", monthly: 500, notes: "Lean footprint — not the aggregation hub" },
    { name: "Insurance + petty cash", monthly: 500, notes: "Combined line" },
    { name: "Accountant ($1,500/yr ÷ 12)", monthly: 125, notes: "Year-end only" },
    { name: "Legal ($2,000/yr ÷ 12)", monthly: 167, notes: "" },
  ],
  overheadsJunAugTotal: v6OverheadsMonthly, // 1,292
  overheadsSepOnward: [
    { name: "Space (small, not full hub)", monthly: 500, notes: "Lean footprint — not the aggregation hub" },
    { name: "Insurance + petty cash", monthly: 500, notes: "Combined line" },
    { name: "Accountant ($1,500/yr ÷ 12)", monthly: 125, notes: "Year-end only" },
    { name: "Legal ($2,000/yr ÷ 12)", monthly: 167, notes: "" },
  ],
  overheadsSepOnwardTotal: v6OverheadsMonthly, // 1,292 — life supports not in V6 overhead
  overheadsTag: confirmed(
    "Lean footprint: client pays tech stack, no aggregation-hub rent. $1,292/mo: space $500 + insurance/petty $500 + accountant $125 + legal $167.",
  ),

  tithePct: v6TithePct,
  titheMonthly: v6TitheMonthly, // 3,520
  titheTotal: v6Phase2Tithe,    // 42,240 (Phase 2 only)

  familyInfusionRecovery: 0,
  familyInfusionRecoveryTag: confirmed(
    "V6 carries no family-infusion recovery line. Capital recovery (if applicable) is handled separately from the engagement cash flow — the monthly surplus at V6 rates is not sized to retire a $112k debt stack inside 12 months.",
  ),
  familyInfusionRecoveryDescription: "",

  teamIncentivesName: "Tyler subcontract incentives / code-IT one-time",
  teamIncentivesAmount: null,
  teamIncentivesTag: tbd(
    "Code review + IT setup is a one-time cost (~$2k–$5k) rolled under Tyler's line when Deer Lake is confirmed. Hardware (computer + server ~$3k–$4k) deferred until ongoing commitment. Exact amounts TBD.",
  ),

  costBasisJunAug: v6TitheMonthly + v6BobbieDrawMonthly + v6TylerCostMonthly + v6OverheadsMonthly, // 28,812
  costBasisSepOnward: v6TitheMonthly + v6BobbieDrawMonthly + v6TylerCostMonthly + v6OverheadsMonthly, // 28,812
  monthlySurplusJunAug: v6MonthlySurplus,    // 6,388
  monthlySurplusSepOnward: v6MonthlySurplus, // 6,388 (same — lean OH doesn't step up)
  costBasisTag: confirmed(
    "Tithe $3,520 + Bobbie draw $12,800 + Tyler sub $11,200 + overheads $1,292 = $28,812/mo. Monthly surplus $6,388.",
  ),

  capitalRecoveryAmount: 0,
  capitalRecoveryDescription:
    "V6 does not carry a capital recovery line inside the engagement waterfall. At $6,388/mo surplus, the $112k debt stack would take ~14.6 months to clear — outside the 12-month window. Capital recovery is handled separately from the engagement cash flow. Waterfall is TBD.",
  capitalRecoveryMonths: 0,
  capitalRecoveryStartLabel: "N/A",
  capitalRecoveryEndLabel: "N/A",
  capitalRecoveryTag: tbd(
    "Capital recovery not carried in V6 engagement waterfall. Surplus waterfall allocation (Reserve / Innovation / other) is TBD pending month-6 review.",
  ),

  brightsideLaunchMonthLabel:
    "(none — V6 does not carry a Brightside Launch Month phase; Brightside pre-launch funded from Innovation if applicable)",
  brightsidePrelaunchSpend: 0,
  brightsideLaunchSurplus: 0,
  brightsideLaunchRemainder: 0,
  brightsideLaunchTag: confirmed(
    "V6 omits the Brightside Launch Month phase — same as V5.",
  ),

  phase3Months: 0,
  phase3MonthlySurplus: v6MonthlySurplus, // 6,388 — shown for reference
  reservePct: 0,
  innovationPct: 0,
  reserveMonthly: 0,
  innovationMonthly: 0,
  reserveTotal: 0,
  innovationTotal: 0,
  phase3Tag: tbd(
    "Surplus waterfall allocation TBD. 12-month surplus at $6,388/mo = $76,656. Split between Reserve / Innovation / capital recovery will be locked at or before month-6 review.",
  ),

  totals18mo: {
    revenue: v6Phase2Revenue,    // 422,400 (Phase 2 only — Phase 1 $25k shown separately)
    tithe: v6Phase2Tithe,        // 42,240
    payroll: v6Phase2Bobbie,     // 153,600 (Bobbie net draw)
    overheads: v6Phase2Overhead + v6Phase2Tyler, // 134,400 Tyler + 15,504 OH = 149,904
    surplusDeployed: v6Phase2Surplus, // 76,656
    familyInfusionRecovery: 0,
    capitalRecovery: 0,
    brightsidePrelaunch: 0,
    reserve: 0,
    innovation: 0,
    tag: tbd(
      "Phase 2 × 12 months. Revenue $422,400 · tithe $42,240 · Bobbie draw $153,600 · Tyler sub $134,400 · overheads $15,504 · surplus $76,656. Waterfall allocation TBD. Phase 1 ($25,000 flat trial) not included here.",
    ),
  },

  practitionerSalary18mo: v6Phase2Bobbie, // 153,600 — Bobbie net draw Phase 2 only
  practitionerSalaryTag: confirmed(
    "Bobbie net draw: 160 hr/mo × $80/hr × 12 months = $153,600. This is the practitioner's income from the engagement. The $150/hr billed rate less the $70/hr Tyler pass-through leaves $80/hr net.",
  ),

  reservePurposes: SHARED_RESERVE_PURPOSES,
  givingDirection: SHARED_GIVING_DIRECTION,
  renegotiationTriggers: v6Triggers,
};

const v6Personal = {
  agencySalary18mo: v6Phase2Bobbie, // 153,600
  brightsideOwnerTake: SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 31,000
  total18mo: v6Phase2Bobbie + SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 184,600
  perYear: v6Phase2Bobbie + SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 184,600 (12-mo window)
  capitalRecovery: 0,
  tag: tbd(
    "Bobbie draw $153,600 (Phase 2 × 12 mo) + Brightside owner take $31,000. Capital recovery not carried in V6 engagement waterfall — handled separately. Phase 1 trial revenue ($25k) not counted here.",
  ),
};

export const SCENARIO_V6: Scenario = {
  id: "v6",
  name: "V6 — Hourly subcontract (Deer Lake)",
  short: "V6",
  tagline:
    "$150/hr Bobbie · $70/hr Tyler (RFF sub) · 160 hr/mo each · lean overheads · surplus waterfall TBD",
  description:
    "Hourly subcontracting model applied to Deer Lake. Bobbie bills $150/hr (nets $80/hr), Tyler bills $70/hr as a pass-through subcontract for distribution at Sioux Lookout and Deer Lake — both 40 hr/wk. Phase 1: $25,000 flat 8-week trial (intentionally below cost — entry price). Phase 2: $35,200/mo billed, $6,388/mo surplus after tithe + draws + lean overheads. Surplus waterfall TBD. V5 ($90k/mo agency) preserved as historical baseline.",
  accent: "#3A5F8A",
  accentSoft: "#DDE8F5",
  accentInk: "#1A2E44",
  status: "locked",
  salts: SHARED_SALTS,
  contracts: { agency: v6Agency },
  brightside: SHARED_BRIGHTSIDE,
  personal: v6Personal,
};

export const V6_PHASE1 = {
  flatFee: v6Phase1Flat,          // 25,000
  tithe: v6Phase1Tithe,           // 2,500
  postTithe: v6Phase1PostTithe,   // 22,500
  bobbieCost: 25600,              // 8 wk × 40 hr × $80 — exceeds post-tithe by $3,100
  netVsCost: -3100,               // intentional below-cost entry price
  weeks: 8,
  hoursPerWeek: 40,
  description:
    "8-week trial at $25,000 flat. Bobbie solo, 40 hr/wk. Intentionally below Bobbie's cost at full hours ($25,600 draw vs $22,500 post-tithe). The $3,100 gap is the deliberate entry price for a bounded, below-cost trial. Hardware (computer + server ~$3k–$4k) deferred until ongoing commitment confirmed.",
};

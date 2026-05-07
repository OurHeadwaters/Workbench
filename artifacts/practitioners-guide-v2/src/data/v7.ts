import { confirmed, provisional, tbd } from "./tags";
import type { RenegotiationTrigger, Scenario } from "./types";
import {
  SHARED_BRIGHTSIDE,
  SHARED_GIVING_DIRECTION,
  SHARED_RESERVE_PURPOSES,
  SHARED_SALTS,
} from "./shared";

/**
 * V7 — Updated rate structure applied to Northern Band.
 *
 * STATUS: LOCKED on 2026-05-02. V7 is the new default operating framework,
 * replacing V6. V6 (Bobbie $150/hr, Tyler $70/hr) is preserved as a
 * historical baseline. V5 ($90k/mo Codetry archetype) is preserved as a
 * further historical baseline. V3 remains the workspace anchor.
 *
 * What changed from V6.
 *   V6 carried Bobbie at $150/hr billed ($80/hr net). V7 steps the rate
 *   to the market-rate for this calibre of integrated work:
 *
 *     - Bobbie bills at $175/hr, nets $105/hr (the $70 delta still funds
 *       Tyler's subcontract pass-through — client sees two line items).
 *     - Tyler (RFF — boots on the ground for distribution at Sioux Lookout
 *       and Northern Band) bills at $70/hr (unchanged).
 *     - Both work 40 hr/wk. Monthly billing basis: 4 wk × 40 hr = 160 hr/mo.
 *
 *   Rationale. Bobbie's work bundles community development strategy,
 *   full-stack software development, northern food systems expertise, and
 *   financial modelling — each of which commands $100–$150/hr in Ontario
 *   individually. A southern consulting firm for an engagement of this scope
 *   and specificity would run $200–$400/hr for the lead. $175/hr is the
 *   right entry rate for a proven first engagement.
 *
 * Structure.
 *   Phase 1 — Trial / Planning (8 weeks, 40 hr/wk, Bobbie solo):
 *     $25,000 flat fee. Intentionally below Bobbie's cost at full hours
 *     (8 wk × 40 hr × $105 = $33,600 draw vs $22,500 post-tithe revenue).
 *     The $11,100 gap is the entry price — a bounded, below-cost trial is the
 *     deliberate opening posture. Hardware (computer + server, ~$3k–$4k) is
 *     deferred until an ongoing commitment is confirmed.
 *
 *   Phase 2 — Full engagement (12 months, Jun 2026 – May 2027):
 *     Bobbie + Tyler, 160 hr/mo each. $39,200/mo total billed to client.
 *     Tithe 10% off the top, then Bobbie draw, Tyler sub, lean overheads.
 *     Monthly surplus: $5,988/mo.
 *     Surplus waterfall: TBD — not enough history to lock Reserve / Innovation
 *     split; capital recovery may be handled outside the engagement cash flow.
 *
 * Overheads (V7 — same lean footprint as V6; client pays the tech stack).
 *   Space (small, not the full hub): $500/mo
 *   Insurance + petty cash:          $500/mo
 *   Accountant ($1,500/yr ÷ 12):     $125/mo
 *   Legal ($2,000/yr ÷ 12):          $167/mo
 *   Total:                            $1,292/mo
 *
 * The numbers (computed below):
 *   Phase 1: $25,000 flat fee.
 *            Bobbie cost at full hours: 8 × 40 × $105 = $33,600 → $8,600 below the flat fee (intentional entry gap)
 *
 *   Phase 2 monthly (160 hr/mo each):
 *     Bobbie billed:  160 × $175 = $28,000
 *     Tyler billed:   160 × $70  = $11,200
 *     Total billed:               $39,200
 *     Bobbie draw (160 × $105):   $16,800  ← what the business pays Bobbie
 *     Tyler sub:                  $11,200
 *     Overheads:                   $1,292
 *     Business surplus:            $9,908   (no tithe deducted — tithe is personal)
 *
 *   Bobbie's personal tithe (separate from business P&L):
 *     During debt attack: 10% × $4,000 take-home = $400/mo
 *     Steady-state:       10% × $16,800 draw      = $1,680/mo
 *
 *   Phase 2 × 12 months:
 *     Revenue:    $39,200 × 12 = $470,400
 *     Bobbie draw:$16,800 × 12 = $201,600  (tithe is personal — not deducted here)
 *     Tyler sub:  $11,200 × 12 = $134,400
 *     Overheads:   $1,292 × 12 =  $15,504
 *     Surplus:     $9,908 × 12 = $118,896  (business surplus; waterfall TBD)
 *
 *   Full project (Phase 1 + Phase 2): $495,400 total revenue
 */

// ── Phase 2 rates ─────────────────────────────────────────────────────────────

const v7HoursPerMonth = 160; // 40 hr/wk × 4 wk billing basis

const v7BobbieRate = 175;   // billed to client
const v7TylerRate  = 70;    // billed to client / paid to Tyler
const v7BobbieNet  = 105;   // Bobbie nets (billed minus Tyler-funded delta)

const v7BobbieMonthlyBilled = v7HoursPerMonth * v7BobbieRate; // 28,000
const v7TylerMonthlyBilled  = v7HoursPerMonth * v7TylerRate;  // 11,200
const v7TotalMonthlyBilled  = v7BobbieMonthlyBilled + v7TylerMonthlyBilled; // 39,200

const v7BobbieDrawMonthly = v7HoursPerMonth * v7BobbieNet; // 16,800
const v7TylerCostMonthly  = v7TylerMonthlyBilled;          // 11,200

const v7TithePct     = 10;
// Tithe is first claim on practitioner DRAWINGS only — not on business revenue.
// Rule (permanent): Bobbie tithes 10% of what she draws, not 10% of what the client pays.
const v7TitheMonthly = v7BobbieDrawMonthly * 0.10; // 1,680  (10% × $16,800 draw)

// V7 lean overheads (same as V6 — client pays the tech stack)
const v7OverheadsMonthly = 1292; // space $500 + insurance/petty $500 + acct $125 + legal $167

// Business surplus: tithe is personal (comes from Bobbie's draw), so NOT a business deduction.
const v7MonthlySurplus =
  v7TotalMonthlyBilled - v7BobbieDrawMonthly - v7TylerCostMonthly - v7OverheadsMonthly;
// 39,200 - 16,800 - 11,200 - 1,292 = 9,908

// ── Phase 2 × 12 months ───────────────────────────────────────────────────────

const v7TermMonths   = 12;
const v7Phase2Revenue  = v7TotalMonthlyBilled * v7TermMonths; // 470,400
const v7Phase2Tithe    = v7TitheMonthly * v7TermMonths;       // 20,160  (1,680 × 12 — on draw, not revenue)
const v7Phase2Bobbie   = v7BobbieDrawMonthly * v7TermMonths;  // 201,600
const v7Phase2Tyler    = v7TylerCostMonthly  * v7TermMonths;  // 134,400
const v7Phase2Overhead = v7OverheadsMonthly  * v7TermMonths;  // 15,504
const v7Phase2Surplus  = v7MonthlySurplus    * v7TermMonths;  // 118,896  (9,908 × 12)

// ── Phase 1 ───────────────────────────────────────────────────────────────────

const v7Phase1Flat      = 25000;
const v7Phase1Tithe     = v7Phase1Flat * 0.10; // 2,500
const v7Phase1PostTithe = v7Phase1Flat - v7Phase1Tithe; // 22,500
// Bobbie cost at full hours: 8 wk × 40 hr × $105 = $33,600 → -$11,100 vs post-tithe

// ── Full project ──────────────────────────────────────────────────────────────

const v7TotalRevenue = v7Phase1Flat + v7Phase2Revenue; // 495,400
const v7TotalTithe   = v7Phase1Tithe + v7Phase2Tithe;  // 22,660  (2,500 + 20,160)

// ── Renegotiation triggers ────────────────────────────────────────────────────

const v7Triggers: RenegotiationTrigger[] = [
  {
    step: "Month 12 renegotiation",
    condition:
      "Northern Band store is operational, food is flowing, Tyler's role is established, and Bobbie's planning capacity is demonstrably landing value above the hourly cost.",
    feeStepTo: 0, // not a flat fee — rate steps, not a fee
    drawStepTo: 0, // placeholder; real step is Bobbie rate → $200/hr or scope expansion
    evidenceRequired:
      "Month-12 value-delivered audit: store throughput vs baseline, Tyler hours vs budget, any scope creep or additional communities served. Flip to confirmed rate-step once audit is signed.",
  },
];

// ── Agency object (adapts the AgencyScenario interface) ───────────────────────

const v7Agency = {
  fee: v7TotalMonthlyBilled, // 39,200 — monthly billed total (not a flat agency fee)
  termMonths: v7TermMonths,
  renegotiateMonth: 12,
  startDate: "June 1, 2026",
  buyerStatus: "TBD (band council vs father — affects political weight, not the math)",
  feeTag: provisional(
    "Rates confirmed: $175/hr lead · $70/hr support (Ship Manifest). Monthly billed total depends on hours agreed — scenario projects 160 hr/mo each. Contract not yet signed.",
  ),

  roster: [
    {
      role: "Practitioner / Lead (Bobbie)",
      monthlyLoaded: v7BobbieDrawMonthly, // 16,800 net draw
      notes:
        "160 hr/mo × $175 billed, $105 net draw. Engagement owner; visits Northern Band as needed. The $70/hr delta funds Tyler's subcontract directly.",
    },
    {
      role: "Distribution (Tyler — RFF subcontract)",
      monthlyLoaded: v7TylerCostMonthly, // 11,200
      notes:
        "160 hr/mo × $70. Boots on the ground for distribution at Sioux Lookout and Northern Band. Billed to client, paid to Tyler as a pass-through subcontract. Code review + IT setup rolled under this line as a one-time cost when Northern Band engagement is confirmed.",
    },
  ],
  payrollTotal: v7BobbieDrawMonthly + v7TylerCostMonthly, // 28,000 combined draws
  rosterTag: provisional(
    "Rates confirmed: Bobbie $175/hr lead, Tyler $70/hr support (Ship Manifest). Two-person lean structure is the working model. Hours split and contract terms TBD until a contract is signed.",
  ),

  overheadsJunAug: [
    { name: "Space (small, not full hub)", monthly: 500, notes: "Lean footprint — not the aggregation hub" },
    { name: "Insurance + petty cash", monthly: 500, notes: "Combined line" },
    { name: "Accountant ($1,500/yr ÷ 12)", monthly: 125, notes: "Year-end only" },
    { name: "Legal ($2,000/yr ÷ 12)", monthly: 167, notes: "" },
  ],
  overheadsJunAugTotal: v7OverheadsMonthly, // 1,292
  overheadsSepOnward: [
    { name: "Space (small, not full hub)", monthly: 500, notes: "Lean footprint — not the aggregation hub" },
    { name: "Insurance + petty cash", monthly: 500, notes: "Combined line" },
    { name: "Accountant ($1,500/yr ÷ 12)", monthly: 125, notes: "Year-end only" },
    { name: "Legal ($2,000/yr ÷ 12)", monthly: 167, notes: "" },
  ],
  overheadsSepOnwardTotal: v7OverheadsMonthly, // 1,292
  overheadsTag: confirmed(
    "Lean footprint: client pays tech stack, no aggregation-hub rent. $1,292/mo: space $500 + insurance/petty $500 + accountant $125 + legal $167.",
  ),

  tithePct: v7TithePct,
  titheMonthly: v7TitheMonthly, // 1,680  (10% × $16,800 draw; steady-state)
  titheTotal: v7Phase2Tithe,    // 20,160 (1,680 × 12 mo — personal, not a business deduction)

  familyInfusionRecovery: 0,
  familyInfusionRecoveryTag: confirmed(
    "V7 carries no family-infusion recovery line. Capital recovery (if applicable) is handled separately from the engagement cash flow.",
  ),
  familyInfusionRecoveryDescription: "",

  teamIncentivesName: "Tyler subcontract incentives / code-IT one-time",
  teamIncentivesAmount: null,
  teamIncentivesTag: tbd(
    "Code review + IT setup is a one-time cost (~$2k–$5k) rolled under Tyler's line when Northern Band is confirmed. Hardware (computer + server ~$3k–$4k) deferred until ongoing commitment. Exact amounts TBD.",
  ),

  costBasisJunAug: v7BobbieDrawMonthly + v7TylerCostMonthly + v7OverheadsMonthly, // 29,292  (no business tithe)
  costBasisSepOnward: v7BobbieDrawMonthly + v7TylerCostMonthly + v7OverheadsMonthly, // 29,292
  monthlySurplusJunAug: v7MonthlySurplus,    // 9,908
  monthlySurplusSepOnward: v7MonthlySurplus, // 9,908
  costBasisTag: provisional(
    "Rates confirmed ($175/hr lead · $70/hr support), but monthly billing totals are scenario projections that depend on hours agreed. All derived numbers become real when a contract is signed.",
  ),

  capitalRecoveryAmount: 0,
  capitalRecoveryDescription:
    "V7 does not carry a capital recovery line inside the engagement waterfall. Waterfall is TBD pending month-6 review.",
  capitalRecoveryMonths: 0,
  capitalRecoveryStartLabel: "N/A",
  capitalRecoveryEndLabel: "N/A",
  capitalRecoveryTag: tbd(
    "Capital recovery not carried in V7 engagement waterfall. Surplus waterfall allocation (Reserve / Innovation / other) is TBD pending month-6 review.",
  ),

  brightsideLaunchMonthLabel:
    "(none — V7 does not carry a Brightside Launch Month phase; Brightside pre-launch funded from Innovation if applicable)",
  brightsidePrelaunchSpend: 0,
  brightsideLaunchSurplus: 0,
  brightsideLaunchRemainder: 0,
  brightsideLaunchTag: confirmed(
    "V7 omits the Brightside Launch Month phase — same as V6.",
  ),

  phase3Months: 0,
  phase3MonthlySurplus: v7MonthlySurplus, // 5,988 — shown for reference
  reservePct: 0,
  innovationPct: 0,
  reserveMonthly: 0,
  innovationMonthly: 0,
  reserveTotal: 0,
  innovationTotal: 0,
  phase3Tag: tbd(
    "Surplus waterfall allocation TBD. 12-month business surplus at $9,908/mo = $118,896. Practitioner tithe ($1,680/mo personal) separate. Split between Reserve / Innovation / capital recovery will be locked at or before month-6 review.",
  ),

  totals18mo: {
    revenue: v7Phase2Revenue,    // 470,400 (Phase 2 only — Phase 1 $25k shown separately)
    tithe: v7Phase2Tithe,        // 20,160  (1,680/mo × 12 — tithe on practitioner draw, not revenue)
    payroll: v7Phase2Bobbie,     // 201,600 (Bobbie gross draw; net of tithe = 181,440)
    overheads: v7Phase2Overhead + v7Phase2Tyler, // 134,400 Tyler + 15,504 OH = 149,904
    surplusDeployed: v7Phase2Surplus, // 118,896  (9,908/mo × 12)
    familyInfusionRecovery: 0,
    capitalRecovery: 0,
    brightsidePrelaunch: 0,
    reserve: 0,
    innovation: 0,
    tag: tbd(
      "Phase 2 × 12 months. Revenue $470,400 · Bobbie draw $201,600 (tithe $20,160 personal) · Tyler sub $134,400 · overheads $15,504 · business surplus $118,896. Tithe is first claim on practitioner draw, not a business deduction. Waterfall allocation TBD. Phase 1 ($25,000 flat trial) not included here.",
    ),
  },

  practitionerSalary18mo: v7Phase2Bobbie, // 201,600 — Bobbie net draw Phase 2 only
  practitionerSalaryTag: confirmed(
    "Bobbie gross draw: 160 hr/mo × $105/hr × 12 months = $201,600. Practitioner tithe (10% of draw = $1,680/mo = $20,160/yr) is first claim on the draw — personal obligation, not a business deduction. Net after tithe: $181,440.",
  ),

  reservePurposes: SHARED_RESERVE_PURPOSES,
  givingDirection: SHARED_GIVING_DIRECTION,
  renegotiationTriggers: v7Triggers,
};

const v7Personal = {
  agencySalary18mo: v7Phase2Bobbie, // 201,600
  brightsideOwnerTake: SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 31,000
  total18mo: v7Phase2Bobbie + SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 232,600
  perYear: v7Phase2Bobbie + SHARED_BRIGHTSIDE.surplusDeployment.ownerTake, // 232,600 (12-mo window)
  capitalRecovery: 0,
  tag: tbd(
    "Bobbie draw $201,600 (Phase 2 × 12 mo) + Brightside owner take $31,000. Capital recovery not carried in V7 engagement waterfall — handled separately. Phase 1 trial revenue ($25k) not counted here.",
  ),
};

export const SCENARIO_V7: Scenario = {
  id: "v7",
  name: "V7 — Northern Band rate scenario",
  short: "V7",
  tagline:
    "Rate scenario applied to Northern Band · $175/hr lead · $70/hr support · trial-first · contract not yet signed",
  description:
    "Northern Band rate scenario. Rates are confirmed: $175/hr lead (Bobbie) · $70/hr support (Tyler, RFF sub). The two-person lean structure is the working model. Monthly billing totals and surplus projections are scenario outputs that depend on hours agreed — they become real when a contract is signed. Phase 1: bounded 8-week trial at a flat $25,000 — intentionally below full cost as an entry posture. Phase 2 waterfall TBD pending a signed contract.",
  accent: "#3A5F8A",
  accentSoft: "#DDE8F5",
  accentInk: "#1A2E44",
  status: "provisional",
  statusNote:
    "Rates are confirmed: $175/hr lead · $70/hr support (Ship Manifest). Monthly billing totals and surplus projections are scenario outputs — they depend on hours agreed and become real when a contract is signed. The only other confirmed number is the $12,000 portal fee.",
  salts: SHARED_SALTS,
  contracts: { agency: v7Agency },
  brightside: SHARED_BRIGHTSIDE,
  personal: v7Personal,
};

export const V7_PHASE1 = {
  flatFee: v7Phase1Flat,          // 25,000
  tithe: v7Phase1Tithe,           // 2,500
  postTithe: v7Phase1PostTithe,   // 22,500
  bobbieCost: 33600,              // 8 wk × 40 hr × $105 — exceeds post-tithe by $11,100
  netVsCost: -11100,              // intentional below-cost entry price
  weeks: 8,
  hoursPerWeek: 40,
  description:
    "8-week trial at $25,000 flat. Bobbie solo, 40 hr/wk. Intentionally below Bobbie's cost at full hours ($33,600 draw vs $22,500 post-tithe). The $11,100 gap is the deliberate entry price for a bounded, below-cost trial. Hardware (computer + server ~$3k–$4k) deferred until ongoing commitment confirmed.",
};


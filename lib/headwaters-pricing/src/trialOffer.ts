/**
 * Headwaters Step 0 paid-trial offer — single source of truth.
 *
 * The "$40,000 flat / eight weeks / solo practitioner / money back if we
 * don't deliver" offer is stated identically in four places:
 *   - Deer Lake walkthrough Ask section          (Step 0 call-out)
 *   - Deer Lake walkthrough WhatHeadwatersDelivers (in/out-of-trial framing)
 *   - Deer Lake Store deck RisksAsk slide        (Step 0 card)
 *   - Practitioner Operating Plan one-pager      (bordered call-out)
 *   - Practitioner Operating Plan payback memo §7 (refund clause)
 *
 * Every surface above imports the exported strings/arrays below and
 * renders them verbatim — wrapping markup may differ (slide, sheet,
 * legal memo) but the actual fee, payment schedule, acceptance
 * criteria, refund mechanic, and framing language must read identically
 * on every printed copy. A drift between two surfaces is exactly the
 * failure mode the lockedTrialOffer guard test (in
 * `artifacts/practitioner-operating-plan/src/data/__tests__/`) is built
 * to catch — this module exists so a single edit here flows through to
 * every consumer with no manual sync.
 *
 * Numeric constants are exported alongside the prose so guard tests can
 * reconcile the strings against the numbers ($40,000 ≡ TRIAL_FEE_USD,
 * "fourteen (14) calendar days" ≡ TRIAL_REFUND_INVOCATION_DAYS, etc.).
 */

export const TRIAL_FEE_USD = 40_000;
export const TRIAL_INSTALLMENT_USD = 20_000;
export const TRIAL_DURATION_WEEKS = 8;
export const TRIAL_REFUND_INVOCATION_DAYS = 14;
export const TRIAL_REFUND_PAYMENT_DAYS = 30;
export const TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA = 2;

/**
 * Day count from signing day to the week-eight review meeting. 8 weeks
 * × 7 days = 56. Quoted verbatim ("fifty-six (56) calendar days from
 * signing day") in the canonical week-8 timeline entry below and on
 * every surface that prints the timeline. Reconciles to
 * `TRIAL_DURATION_WEEKS` so a guard test catches drift.
 */
export const TRIAL_WEEK_8_REVIEW_DAY = TRIAL_DURATION_WEEKS * 7;

/**
 * One-line pitch headline used as the first line of the call-out on
 * every surface (Ask.tsx, RisksAsk.tsx, OnePager.tsx, PaybackMemo §7
 * Verbatim block).
 */
export const TRIAL_HEADLINE =
  "$40,000 flat. Eight weeks. Solo practitioner. Money back if we don't deliver.";

/**
 * Section eyebrow used on the Step 0 call-out across all surfaces.
 * Capitalisation/style varies by surface (mono-uppercase on the
 * walkthrough, mono-uppercase on the slide, mono-uppercase on the
 * one-pager) but the literal text reads the same.
 */
export const TRIAL_EYEBROW = "Step 0 · Try us for eight weeks";

/**
 * Fee + installment description. Quoted verbatim under the "How much"
 * label on every surface.
 */
export const TRIAL_FEE_LINE =
  "$40,000 flat for eight weeks, paid $20,000 on signing and $20,000 at the start of week four.";

/**
 * What the contractor and band do not have to commit during the trial.
 * Quoted verbatim alongside the fee line on every surface.
 */
export const TRIAL_NO_TEAM_LINE =
  "No team hired. No day-one bridge required.";

/**
 * Description of the duration + the week-eight review meeting that
 * gates conversion to Step 1. Quoted under the "How long" label.
 */
export const TRIAL_HOW_LONG_LINE =
  "Eight weeks from signing. The week-eight review meeting is where the contractor judges the four acceptance criteria below and decides whether to convert into Step 1, invoke the refund, or convert to a service credit.";

/**
 * The four acceptance criteria the practitioner delivers solo in the
 * eight-week window. Each entry is exactly one sentence and is quoted
 * verbatim — every surface (call-out card, printable sheet, legal
 * §7) renders the same four strings in the same order.
 *
 * Drift was the original failure mode here (Ask.tsx had a paraphrase,
 * PaybackMemo §7 added contractual qualifiers like "council motion"
 * and "lane plan, ninety-day pilot duration") so the canonical version
 * below merges the marketing-readable headline and the contractually-
 * specific qualifiers into one sentence per criterion. Long enough to
 * be enforceable, short enough to print on a slide.
 */
export const TRIAL_ACCEPTANCE_CRITERIA: readonly string[] = [
  "Steering committee seated and charter signed — three council members, two community members named, terms of reference adopted by council motion.",
  "Six-month co-design plan adopted by the steering committee — store layout, opening hours, and pricing principles documented and accepted in committee minutes.",
  "Cold-chain pilot scope agreed in writing with the existing store — lane plan, ninety-day pilot duration, and operational hand-offs signed by both parties, ready to launch.",
  "Year-one budget and cash plan handed to council in writing — Step 1 cost basis, $90,000-a-month bill, ~$181,000 day-one bridge ask, and the 35% reinvestment line.",
] as const;

/**
 * The refund mechanic, written as a single quoted paragraph. Every
 * surface that names the refund quotes this exact string. The numbers
 * embedded in the prose ($40,000, thirty (30), fourteen (14)) reconcile
 * to the numeric constants above.
 */
export const TRIAL_REFUND_MECHANIC =
  "At the week-eight review meeting the contractor judges the four criteria above. If two or more are not met, Headwaters refunds the full $40,000 within thirty (30) calendar days. The contractor invokes the refund in writing within fourteen (14) calendar days of the review; an invocation made later than that is out of time and the trial is deemed accepted. Contractor's option: convert the $40,000 to a service credit of equal value applied against the first invoice of Step 1 instead.";

/**
 * The "Step 0 is the on-ramp" framing line that closes every Step 0
 * call-out. Reframes the trial against Step 1 (the $90,000-a-month
 * full-stack engagement) and the worst-case / best-case outcomes for
 * the band.
 */
export const TRIAL_FRAMING_LINE =
  "Step 0 is the on-ramp to Step 1, not a replacement. The team hiring, the cold-chain pilot itself, the software build, the staff training, and the day-one CAPEX all sit inside Step 1 ($90,000-a-month full-stack agency engagement), not the trial. Worst case for the band: eight weeks of paid solo work, four written deliverables in hand, full refund issued. Best case: at week eight Step 1 converts on the same paper.";

/**
 * "What survives a refund" paragraph used in the legal §7 of the
 * payback memo and (in shortened form) referenced from the framing
 * line above. The band keeps everything produced during the eight
 * weeks even if the cash is returned.
 */
export const TRIAL_WHAT_SURVIVES_REFUND =
  "Whatever has been delivered to the band during the eight weeks (steering committee minutes, co-design plan, cold-chain pilot scope, year-one budget) stays with the band at no further charge. The refund is not contingent on returning, redacting, or unlearning any of those deliverables — the band keeps what was produced with the cash that was returned.";

/**
 * "Conversion to Step 1" paragraph used in the legal §7. Names the
 * Step 1 engagement explicitly so the trial-to-engagement hand-off is
 * unambiguous.
 */
export const TRIAL_CONVERSION_TO_STEP_1 =
  "If the contractor accepts the trial deliverables at the week-eight review and elects to proceed, the trial closes and Step 1 of the Deer Lake engagement opens on the same paper — the $90,000-a-month full-stack agency engagement described in the Practitioner Operating Plan and the Deer Lake Walkthrough. The $40,000 trial fee is not credited against the Step 1 monthly fee; the trial bought planning and preparation, Step 1 buys the build.";

/**
 * Convenience: the four labelled "How much / How long / What you get /
 * How to get your money back" blocks the one-pager renders as a 2x2
 * grid. Exported as a structure so the one-pager can map over it
 * instead of hand-wiring four cells.
 */
export interface TrialOfferQuadrant {
  id: "howMuch" | "howLong" | "whatYouGet" | "howToGetMoneyBack";
  label: string;
  body: string;
}

export const TRIAL_OFFER_QUADRANTS: readonly TrialOfferQuadrant[] = [
  {
    id: "howMuch",
    label: "How much",
    body: `${TRIAL_FEE_LINE} ${TRIAL_NO_TEAM_LINE}`,
  },
  {
    id: "howLong",
    label: "How long",
    body: TRIAL_HOW_LONG_LINE,
  },
  {
    id: "whatYouGet",
    label: "What you get (solo, by the practitioner)",
    body: TRIAL_ACCEPTANCE_CRITERIA.map(
      (criterion, i) => `${i + 1}) ${criterion}`,
    ).join(" "),
  },
  {
    id: "howToGetMoneyBack",
    label: "How to get your money back",
    body: TRIAL_REFUND_MECHANIC,
  },
] as const;

/**
 * One row of the canonical eight-week trial schedule. The schedule
 * sequences the four §7 acceptance criteria into the eight-week window
 * — naming the deliverable(s) in flight that week, the meeting(s) that
 * week, and the gating decision (if any). Each criterion is delivered
 * in a specific week so the contractor knows when each one is in play
 * (criterion index → week mapping below).
 *
 * The same array is rendered on every surface that publishes the
 * timeline (the Deer Lake Walkthrough Ask section and the Practitioner
 * Operating Plan one-pager today) so a single edit here moves the
 * timeline on every printed copy. Drift is the failure mode the
 * lockedTrialOffer guard test is built to catch.
 */
export interface TrialTimelineWeek {
  /** 1-indexed week number (1 through TRIAL_DURATION_WEEKS). */
  week: number;
  /**
   * Day window from signing day, e.g. "Days 1–7", "Days 50–56".
   * Always inclusive on both ends; week N covers days
   * `((N-1)*7)+1` through `N*7`.
   */
  windowLabel: string;
  /**
   * Short headline for the week — what the week is about, in five to
   * eight words. Renders as the row title on every surface.
   */
  focus: string;
  /**
   * One-sentence prose describing the deliverable(s) in flight that
   * week. May reference more than one of the four §7 acceptance
   * criteria when criteria are being prepared in parallel.
   */
  deliverables: string;
  /**
   * One-sentence prose listing the meetings on the calendar that week
   * — council motions, steering committee sittings, community input
   * sessions, existing-store cold-chain conversations, and the week-8
   * review with the contractor.
   */
  meetings: string;
  /**
   * The gating decision in play that week, written as a single
   * sentence — or null when the week has no formal gate. The first
   * gating decision (council motion, week 2) is the trial's earliest
   * off-ramp; the last (week-8 review, week 8) is the conversion gate
   * to Step 1.
   */
  gatingDecision: string | null;
  /**
   * Index into `TRIAL_ACCEPTANCE_CRITERIA` (0..3) when this week is
   * the one in which a §7 acceptance criterion is delivered, or null
   * when the week is preparation only. Each criterion is mapped to
   * exactly one week; the four mappings cover all four criteria.
   */
  acceptanceCriterionDelivered: 0 | 1 | 2 | 3 | null;
}

export const TRIAL_TIMELINE: readonly TrialTimelineWeek[] = [
  {
    week: 1,
    windowLabel: "Days 1–7",
    focus: "Signing & kickoff",
    deliverables:
      "Steering committee terms-of-reference drafted. Council motion text drafted. First existing-store visit logged.",
    meetings:
      "Signing meeting with the contractor on day 1. Pre-meet with the band CEO and the practitioner. Intro call with the existing-store manager.",
    gatingDecision:
      "Council motion to enter the design phase tabled for the week-2 council meeting (text drafted this week).",
    acceptanceCriterionDelivered: null,
  },
  {
    week: 2,
    windowLabel: "Days 8–14",
    focus: "Council motion · steering members named",
    deliverables:
      "Steering members named (three council, two community). Charter draft circulated to all five. Cold-chain pilot scoping notes #1.",
    meetings:
      "Band council meeting (motion read for adoption). Sit-downs with the two community-side candidates. Cold-chain scoping call with the existing-store manager.",
    gatingDecision:
      "Council passes the design-phase motion. Without this the trial is paused: the second installment is not invoiced and the refund clock starts at the week-8 review on whatever was delivered.",
    acceptanceCriterionDelivered: null,
  },
  {
    week: 3,
    windowLabel: "Days 15–21",
    focus: "Steering committee seated · charter signed",
    deliverables:
      "Steering committee charter signed by all five members at the first steering meeting — terms of reference adopted by council motion.",
    meetings:
      "Steering committee meeting #1 (kickoff and charter signing). Cold-chain site walk at the existing store.",
    gatingDecision: "Charter signed → §7 criterion #1 delivered.",
    acceptanceCriterionDelivered: 0,
  },
  {
    week: 4,
    windowLabel: "Days 22–28",
    focus: "Mid-trial · co-design first read · second installment due",
    deliverables:
      "First draft of the six-month co-design plan (store layout, opening hours, pricing principles). Cold-chain MOU draft to the existing store.",
    meetings:
      "Steering committee meeting #2 (first read of the co-design plan). Community input session #1 (open community meeting). Existing-store MOU draft review.",
    gatingDecision:
      "Second $20,000 installment invoiced at the start of the week.",
    acceptanceCriterionDelivered: null,
  },
  {
    week: 5,
    windowLabel: "Days 29–35",
    focus: "Community input · MOU red-line · budget skeleton",
    deliverables:
      "Co-design plan revised against community input. Cold-chain MOU red-lined by the existing store. Year-one budget skeleton drafted with the bookkeeper.",
    meetings:
      "Community input session #2. Existing-store MOU red-line meeting. Bookkeeper sit-down on the year-one budget shape.",
    gatingDecision: null,
    acceptanceCriterionDelivered: null,
  },
  {
    week: 6,
    windowLabel: "Days 36–42",
    focus: "Co-design plan adopted",
    deliverables:
      "Six-month co-design plan adopted in steering committee minutes. Cold-chain MOU near-final.",
    meetings:
      "Steering committee meeting #3 (vote to adopt the co-design plan). Existing-store MOU near-final review.",
    gatingDecision:
      "Steering committee adopts the co-design plan → §7 criterion #2 delivered.",
    acceptanceCriterionDelivered: 1,
  },
  {
    week: 7,
    windowLabel: "Days 43–49",
    focus: "Cold-chain pilot scope MOU signed",
    deliverables:
      "Cold-chain pilot MOU signed by Headwaters and the existing store — lane plan, ninety-day pilot duration, operational hand-offs. Year-one budget draft to council finance pre-read.",
    meetings:
      "MOU signing meeting at the existing store. Council finance pre-read.",
    gatingDecision:
      "MOU signed → §7 criterion #3 delivered. Booking confirmation sent for the week-8 review meeting (day 56).",
    acceptanceCriterionDelivered: 2,
  },
  {
    week: 8,
    windowLabel: "Days 50–56",
    focus: "Year-one budget to council · week-eight review (day 56)",
    deliverables:
      "Year-one budget and cash plan handed to council in writing — Step 1 cost basis, $90,000-a-month bill, ~$181,000 day-one bridge ask, 35% reinvestment line.",
    meetings:
      "Council session for the budget hand-off. The week-eight review meeting with the contractor — fifty-six (56) calendar days from signing day — at which the contractor judges all four §7 acceptance criteria and elects: convert to Step 1, invoke the refund (within fourteen (14) calendar days of this meeting), or convert the $40,000 to a service credit against the first Step 1 invoice.",
    gatingDecision:
      "Week-eight review decision. Refund-invocation deadline runs from this meeting; an invocation made later than fourteen (14) calendar days is out of time and the trial is deemed accepted.",
    acceptanceCriterionDelivered: 3,
  },
] as const;

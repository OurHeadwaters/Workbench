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
  "Year-one budget and cash plan handed to council in writing — Step 1 cost basis at $29,000/month Headwaters fee (fixed), plus gas card and insurance at cost.",
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
 * call-out. Reframes the trial against Step 1 (the $29,000-a-month
 * Headwaters engagement — Practitioner, Distribution Lead, IT/Assistant)
 * and the worst-case / best-case outcomes for the band.
 */
export const TRIAL_FRAMING_LINE =
  "Step 0 is the on-ramp to Step 1, not a replacement. The cold-chain pilot itself, the software build, and the staff training all sit inside Step 1 ($29,000-a-month Headwaters engagement — Practitioner, Distribution Lead, IT/Assistant), not the trial. Worst case for the band: eight weeks of paid solo work, four written deliverables in hand, full refund issued. Best case: at week eight Step 1 converts on the same paper.";

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
  "If the contractor accepts the trial deliverables at the week-eight review and elects to proceed, the trial closes and Step 1 of the Deer Lake engagement opens on the same paper — the $29,000-a-month Headwaters engagement (Practitioner, Distribution Lead, IT/Assistant) described in the Deer Lake Walkthrough. The $40,000 trial fee is not credited against the Step 1 monthly fee; the trial bought planning and preparation, Step 1 buys the build.";

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

/**
 * Locale code for the canonical English copy of the schedule (the
 * `TRIAL_TIMELINE` array below). Quoted on every surface that prints
 * the bilingual schedule so the column / row label is sourced from
 * the canonical lib rather than hand-typed twice.
 */
export const TRIAL_TIMELINE_LOCALE_EN = "English (plain language)";

/**
 * Locale code for the Anishininiimowin (Oji-Cree, Severn dialect)
 * draft below. The dialect spoken at Deer Lake First Nation is the
 * Severn variety of Oji-Cree (Anishininiimowin), so the column /
 * row label calls out the dialect explicitly rather than using the
 * generic "Oji-Cree" umbrella term.
 */
export const TRIAL_TIMELINE_LOCALE_OJ =
  "Anishininiimowin (Oji-Cree · Severn)";

/**
 * Visible status banner the bilingual surfaces print above the
 * Anishininiimowin column. The English schedule has been through
 * editorial review and is print-ready; the Oji-Cree column is a
 * working draft from this engagement and needs an Anishininiimowin-
 * speaking elder reviewer to verify (and almost certainly revise)
 * the wording before any printed copy goes to Deer Lake elders.
 *
 * This is the same disclaimer the broader walkthrough deck Oji-Cree
 * pass (the existing "Translate the deck into Oji-Cree" project task)
 * is expected to land — the schedule rides on the same convention so
 * the elder reviewer touches every surface in one pass and replaces
 * the draft strings here when the verified versions are ready.
 */
export const TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER =
  "Anishininiimowin draft — written alongside the English schedule, awaiting review by an Anishininiimowin-speaking elder before this side of the sheet is printed for Deer Lake elders. Read the English column as the authoritative version until the verified Oji-Cree pass lands.";

/**
 * Translation row paralleling `TrialTimelineWeek` for non-English
 * locales. Only the four prose fields the elder reviewer will revise
 * — `focus`, `deliverables`, `meetings`, `gatingDecision` — live
 * here. The `week` number ties each row back to its English row
 * (`TrialTimelineWeek.week`); shared structural fields (week index,
 * `windowLabel` day window, `acceptanceCriterionDelivered` index)
 * stay on the English schedule and are reused by every locale so the
 * surface markup never has to fork the layout per locale.
 *
 * `gatingDecision` follows the same null-vs-string convention as the
 * English entry — if the English week has no formal gate, the
 * translated row is `null` too (the lockedTrialOffer guard test
 * asserts this).
 */
export interface TrialTimelineWeekTranslation {
  /** 1-indexed week number; mirrors `TrialTimelineWeek.week`. */
  week: number;
  /** Translated focus headline (parallels `TrialTimelineWeek.focus`). */
  focus: string;
  /** Translated deliverables sentence (parallels `.deliverables`). */
  deliverables: string;
  /** Translated meetings sentence (parallels `.meetings`). */
  meetings: string;
  /**
   * Translated gating-decision sentence (parallels `.gatingDecision`).
   * `null` whenever the English entry's `gatingDecision` is `null`,
   * so the bilingual row collapses cleanly on every surface.
   */
  gatingDecision: string | null;
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
      "Year-one budget and cash plan handed to council in writing — Step 1 cost basis at $29,000/month Headwaters fee (fixed), plus gas card and insurance at cost.",
    meetings:
      "Council session for the budget hand-off. The week-eight review meeting with the contractor — fifty-six (56) calendar days from signing day — at which the contractor judges all four §7 acceptance criteria and elects: convert to Step 1, invoke the refund (within fourteen (14) calendar days of this meeting), or convert the $40,000 to a service credit against the first Step 1 invoice.",
    gatingDecision:
      "Week-eight review decision. Refund-invocation deadline runs from this meeting; an invocation made later than fourteen (14) calendar days is out of time and the trial is deemed accepted.",
    acceptanceCriterionDelivered: 3,
  },
] as const;

/**
 * Anishininiimowin (Oji-Cree, Severn dialect) draft of `TRIAL_TIMELINE`.
 *
 * STATUS: WORKING DRAFT. Written alongside the English schedule by
 * the practitioner team; not elder-reviewed yet. Every surface that
 * prints this column also prints `TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER`
 * above it, so a reader cannot mistake the draft for the verified
 * version. The broader Oji-Cree pass on the walkthrough deck and the
 * one-pager (the existing "Translate the deck into Oji-Cree" project
 * task) is the home for the elder verification — when that lands,
 * the verified strings replace the drafts here in place, and the
 * disclaimer is dropped.
 *
 * The week numbers below match `TRIAL_TIMELINE` 1:1 (week 1..8) so
 * the bilingual surfaces can render the two arrays in parallel
 * without per-week lookups, and the `gatingDecision` field is `null`
 * exactly when the English row's `gatingDecision` is `null` (week 5)
 * so the bilingual row collapses cleanly. Both invariants are
 * asserted by the lockedTrialOffer guard test.
 *
 * Style notes for the elder reviewer:
 *   - Romanised orthography (not syllabics) so the printed sheet
 *     stays single-column without a font swap; switch to syllabics
 *     in a follow-up if Deer Lake elders prefer.
 *   - Plain language over loan translations; English borrowings
 *     ("MOU", "Step 1", "$40,000", "$90,000", "Headwaters") are
 *     left in English as code-switches, the way they are spoken in
 *     practice in the community.
 *   - One short sentence per field where possible — the printable
 *     one-pager runs the bilingual rows tight against each other
 *     and a long Oji-Cree paragraph breaks the row layout.
 */
/**
 * Anishininiimowin (Oji-Cree, Severn dialect) draft of the §7
 * contractual prose — the headline, the fee line, the
 * "how long / what gates the conversion" line, the four
 * acceptance criteria, the refund mechanic, and the framing line.
 *
 * STATUS: WORKING DRAFT, identical posture to the timeline drafts
 * below. Not elder-reviewed yet. Every surface that prints these
 * strings also prints `TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER` (the
 * same banner the schedule uses) above the bilingual block, so a
 * reader cannot mistake the draft for the verified version.
 *
 * Style notes for the elder reviewer (mirror the timeline drafts so
 * a single elder-review pass touches both blocks):
 *   - Romanised orthography (not syllabics) so the printed sheet
 *     stays single-column without a font swap; switch to syllabics
 *     in a follow-up if Deer Lake elders prefer.
 *   - Plain language over loan translations; English borrowings
 *     ("Step 1", "$40,000", "$90,000", "$181,000", "$20,000",
 *     "Headwaters", "35%", "MOU", "CAPEX") are left in English as
 *     code-switches, the way they are spoken in practice in the
 *     community.
 *   - One short sentence per field where possible — the printable
 *     one-pager and the slide both run the bilingual blocks tight
 *     against each other and a long Oji-Cree paragraph breaks the
 *     row layout.
 *
 * The four-criteria array (`TRIAL_ACCEPTANCE_CRITERIA_OJICREE`)
 * mirrors `TRIAL_ACCEPTANCE_CRITERIA` index-for-index (entry 0 is the
 * Oji-Cree of English entry 0, entry 1 is the Oji-Cree of entry 1,
 * etc.), the same pattern `TRIAL_TIMELINE_OJICREE` uses for the
 * timeline rows. Length is asserted to equal the English array by
 * the lockedTrialOffer guard test, and each entry is asserted
 * distinct from its English counterpart so a paste-instead-of-
 * translate regression is caught.
 */
export const TRIAL_HEADLINE_OJICREE =
  "$40,000 wewenig. Nishwaaso-anama'e-giizhig. Niigaanibatood eta. Azhe-miinigewin gishpin gegoo gaa-debinasinog.";

export const TRIAL_FEE_LINE_OJICREE =
  "$40,000 wewenig nishwaaso-anama'e-giizhigak onji, $20,000 gii-mazinaakidewin ozhibii'igewing miinawaa $20,000 niiwin-anama'e-giizhig maajitaag.";

export const TRIAL_HOW_LONG_LINE_OJICREE =
  "Nishwaaso-anama'e-giizhig ozhibii'igewing onji. Nishwaaso-anama'e-giizhigak waabamigewi-mawanjiidiwining niigaanibatood obawaadagonan iniw newin ozhitoogaadeg waabandang, miinawaa onaakoniged ji-Step 1 izhaag, gemaa azhe-miinigewin ji-andawendaagwadowin, gemaa-go anokiitaadiwi-zhooniyaa ji-meshkwajiwaag.";

/**
 * Translation row paralleling one entry of `TRIAL_ACCEPTANCE_CRITERIA`.
 * `index` ties each row back to its English row (0..3); `text` carries
 * the Oji-Cree draft. Same shape posture as `TrialTimelineWeekTranslation`
 * — translated prose lives here, structural fields stay on the canonical
 * (English) array.
 */
export interface TrialAcceptanceCriterionTranslation {
  /** Index into `TRIAL_ACCEPTANCE_CRITERIA` (0..3); mirrors order. */
  index: 0 | 1 | 2 | 3;
  /** Translated criterion (parallels `TRIAL_ACCEPTANCE_CRITERIA[index]`). */
  text: string;
}

export const TRIAL_ACCEPTANCE_CRITERIA_OJICREE: readonly TrialAcceptanceCriterionTranslation[] = [
  {
    index: 0,
    text: "Niigaani-mawanjiidiwin gii-mawanjiisawag miinawaa onaakonigewi-mazina'igan gii-ozhibii'igaade — niso onaakonigewikamigong, niizh anishinabewinjig gii-wiindamaagaadewag, o-onaakonigewiniwaa gii-debibinigaadeg onaakonigewikamig-onaakonigewining.",
  },
  {
    index: 1,
    text: "Ningotwaaso-giizis ozhitoowin gii-debibinige niigaani-mawanjiidiwining — adaawewigamig-onaakonigewin, baagininangewi-giizhigak, gaganoonidiwi-zhooniyaa-onaakonigewin gii-ozhibii'igaadewan miinawaa gii-debibinigaadewan mazina'iganang.",
  },
  {
    index: 2,
    text: "Dakaayaa-bimibatoo gojitoowi-onaakonigewin gii-debibinige mazina'igan-onji adaawewigamigong — biminizha'igewi-ozhitoowin, zhaangaaso-midaaso giizhigak gojitoowi-pebakaan, miikaadenamodag wewenig gii-ozhibii'igaadewan, ji-maajitaag wii-ayaag.",
  },
  {
    index: 3,
    text: "Nitam-bibooni-zhooniyaa miinawaa zhooniyaa-ozhitoowin gii-miinaa onaakonigewikamigong mazina'igan-onji — Step 1 zhooniyaa-onji, $29,000-aabita-giizis-mazina'igan Headwaters (wewenig), miinawaa gaandeg-bimiwidoowin gaa-dibaakonigaadeg.",
  },
] as const;

export const TRIAL_REFUND_MECHANIC_OJICREE =
  "Nishwaaso-anama'e-giizhigak waabamigewi-mawanjiidiwining niigaanibatood obawaadagonan iniw newin ozhitoogaadeg waabandang. Gishpin niizh gemaa nawaj gaa-debinasinog, Headwaters da-azhe-miinigewag kakina $40,000 nisimidana (30) giizhigak biindig. Niigaanibatood mazina'igan-onji da-andawenjigeg azhe-miinigewin newin-midaaso (14) giizhigak waabamigewin onji; gishpin nawaj-ishkwaaj nokiijiged, gegaa zaagiwe-aniin miinawaa gojitoowin gii-debibinige onaakoniged. Niigaanibatood gii-ondinigewin: $40,000 ji-meshkwajiwaag anokiitaadiwi-zhooniyaa ezhi-aapiitendaag Step 1 nitam-mazina'igan onji.";

export const TRIAL_FRAMING_LINE_OJICREE =
  "Step 0 igo Step 1 onji maajitaawin, gaawiin meshkwadoonigewin. Dakaayaa-bimibatoo gojitoowin, mazinaategiziwin-ozhitoowin, miinawaa anokii-gikinoo'amaadiwin kakina Step 1 biindig ($29,000-aabita-giizis Headwaters anokiichigewin — Niigaanibatood, Biminizha'igewi-niigaan, IT/Ombibishkigozid), gaawiin gojitoowin biindig. Maaji-ezhiwebak onaakonigewikamig onji: nishwaaso-anama'e-giizhig diba'amaagewi-niigaanibatood eta-anokiit, newin ozhitoogaadeg ozhibii'igaadeg, kakina azhe-miinigewin gii-azhe-miinigaade. Onishishi-ezhiwebak: nishwaaso-anama'e-giizhigak Step 1 da-meshkwajiwa'iwemagad mii dash naasab mazina'igan-onji.";

export const TRIAL_TIMELINE_OJICREE: readonly TrialTimelineWeekTranslation[] = [
  {
    week: 1,
    focus: "Ozhibii'igewin miinawaa maajitaawin",
    deliverables:
      "Niigaanibatoojig o-onaakonigewiniwaa ozhibii'igaade. Onaakonigewi-mazina'igan ozhibii'igaade ji-bagidiniwaad onaakonigewikamigong. Nitam gii-izhaad noongom adaawewigamigong gii-mazinaabii'igaade.",
    meetings:
      "Nitamigiizhigak: ozhibii'igewi-mawanjiidiwin Headwaters miinawaa onaakonigewikamig. Niigaanibatood miinawaa anishinaabe-okimaakaan gii-mawanjiidiwag jiibwaa. Adaawewigamigong-niigaanibatood gii-giigidotaagod biindig-giigidowin onji.",
    gatingDecision:
      "Onaakonigewin ji-maajitaad odazhitoowin gii-ozhibii'igaade noongom-anama'e-giizhigak; ji-bagidiniwaad niizh-anama'e-giizhigak onaakonigewikamigong.",
  },
  {
    week: 2,
    focus: "Onaakonigewin · niigaanibatoojig wiindamaagewag",
    deliverables:
      "Niigaanibatoojig wiindamaagewag — niso onaakonigewikamigong, niizh anishinabewinjig. O-onaakonigewiniwaa ozhibii'igaade naanan-niigaanibatoojig ji-aabajitoowaad. Dakaayaa-bimibatoo gii-giigidoo-aade nitam.",
    meetings:
      "Onaakonigewikamig-mawanjiidiwin (onaakonigewin gii-anaamikinige). Niizh anishinaabe-niigaanibatoojig gii-aabichinaadiwag bedosed. Adaawewigamigong-niigaanibatood gii-giigidotaagod dakaayaa-bimibatoo onji.",
    gatingDecision:
      "Onaakonigewikamig dazhi-bagidinige onaakonigewin. Gaawiin dash, gegoo da-noogishkaag: niso-mazina'igan zhooniyaa gaawiin da-andawenjigesinoog, miinawaa nishwaaso-anama'e-giizhigak waabamigewin onji ge-andawenjigaadeg azhe-miinigewin.",
  },
  {
    week: 3,
    focus: "Niigaani-mawanjiidiwin gii-mawanjiisawag · onaakonigewi-mazina'igan gii-ozhibii'igaade",
    deliverables:
      "Niigaani-mawanjiidiwining onaakonigewi-mazina'igan gii-ozhibii'igaade naanan-niigaanibatoojig nitam-mawanjiidiwaad — o-onaakonigewiniwaa wewenisidoonig onaakonigewikamigong.",
    meetings:
      "Niigaani-mawanjiidiwin nitam (maajitaag miinawaa onaakonigewi-mazina'igan ozhibii'igaade). Adaawewigamigong gii-bimose dakaayaa-gajigewin onji.",
    gatingDecision:
      "Onaakonigewi-mazina'igan ozhibii'igaade → §7 ozhitoogaade #1 gii-debibinige.",
  },
  {
    week: 4,
    focus: "Aabita-gojitoowin · ningotwaaso-giizis-ozhitoowin nitam-noondaagewin · niizh-zhooniyaa da-andawendaagwad",
    deliverables:
      "Nitam ozhitoogaade ningotwaaso-giizis-ozhitoowin (adaawewigamig-onaakonigewin, baagininangewi-giizhigak, gaganoonidiwi-zhooniyaa). Dakaayaa-bimibatoo MOU gii-ozhibii'igaade adaawewigamigong.",
    meetings:
      "Niigaani-mawanjiidiwin niizh (nitam-noondaagewin ozhitoowin onji). Anishinaabe-mawanjiidiwin nitam (anokiitaadiwi-mawanjiidiwin). Adaawewigamigong MOU dazhindamoog.",
    gatingDecision:
      "Niizh-$20,000 zhooniyaa da-mazinaakidewin majinjiwa'amaazod aabita-gojitoowining.",
  },
  {
    week: 5,
    focus: "Anishinaabe-noondaagewin · MOU-zhakwii'igewin · zhooniyaa-mazina'igan-maajitaawin",
    deliverables:
      "Ozhitoowin gii-naagajitamaagaadeg anishinaabe-noondaagewin onji. Dakaayaa-bimibatoo MOU gii-zhakwii'igaade adaawewigamigong. Nitam-bibooni-zhooniyaa-mazina'igan gii-maajitaagaade zhooniyaa-bizindaad omawanjiidaan.",
    meetings:
      "Anishinaabe-mawanjiidiwin niizh. Adaawewigamig-MOU zhakwii'igewi-mawanjiidiwin. Zhooniyaa-bizindaad omawanjiidaan ji-ozhitoowaad nitam-bibooni-zhooniyaa.",
    gatingDecision: null,
  },
  {
    week: 6,
    focus: "Ningotwaaso-giizis-ozhitoowin gii-debibinige",
    deliverables:
      "Ningotwaaso-giizis-ozhitoowin gii-debibinige niigaani-mawanjiidiwining mazina'iganang. Dakaayaa-bimibatoo MOU besho jiibwaagaade.",
    meetings:
      "Niigaani-mawanjiidiwin niso (debibinigewin onji ozhitoowin). Adaawewigamigong MOU besho jiibwaagaade dazhindamoog.",
    gatingDecision:
      "Niigaani-mawanjiidiwin obizindamaagonan ozhitoowin → §7 ozhitoogaade #2 gii-debibinige.",
  },
  {
    week: 7,
    focus: "Dakaayaa-bimibatoo gojitoowi-MOU gii-ozhibii'igaade",
    deliverables:
      "Dakaayaa-bimibatoo MOU gii-ozhibii'igaade Headwaters miinawaa adaawewigamig — biminizha'igewi-ozhitoowin, zhaangaaso-midaaso-giizhigak gojitoowin-pebakaan, miikaadenamodag gegoo. Nitam-bibooni-zhooniyaa-mazina'igan ozhibii'igaade onaakonigewikamig-zhooniyaa-bizindamoodag onji.",
    meetings:
      "MOU-ozhibii'igewi-mawanjiidiwin adaawewigamigong. Onaakonigewikamig-zhooniyaa-bizindamoodag pre-read.",
    gatingDecision:
      "MOU gii-ozhibii'igaade → §7 ozhitoogaade #3 gii-debibinige. Mazina'igan biidaabamod nishwaaso-anama'e-giizhigak waabamigewin (giizhig 56) gii-azhe-andigaade.",
  },
  {
    week: 8,
    focus: "Bibooni-zhooniyaa onaakonigewikamigong · nishwaaso-anama'e-giizhigak waabamigewin (giizhig 56)",
    deliverables:
      "Nitam-bibooni-zhooniyaa miinawaa zhooniyaa-ozhitoowin gii-miinaa onaakonigewikamigong mazina'igan-onji — Step 1 zhooniyaa-onji, $29,000-aabita-giizis-mazina'igan Headwaters (wewenig), miinawaa gaandeg-bimiwidoowin gaa-dibaakonigaadeg.",
    meetings:
      "Onaakonigewikamigong-mawanjiidiwin zhooniyaa onji. Nishwaaso-anama'e-giizhigak waabamigewi-mawanjiidiwin niigaanibatood — zhaangaaso-midaaso-ningotwaaso giizhigak ozhibii'igewin onji — niigaanibatood obawaadagonan iniw newin §7 ozhitoogaadeg, ji-Step 1 izhaag, gemaa azhe-miinigewin gawaadabamigaazod (newin-midaaso giizhigak ishkwaaj waabamigewin), gemaa-go ji-meshkwajiwaadag $40,000 ji-zhooniyaa-bagidiniwagang Step 1 nitam-mazina'igan onji.",
    gatingDecision:
      "Nishwaaso-anama'e-giizhigak waabamigewin onaakonigewin. Azhe-miinigewi-andawendaagwadowin majiidoo waabamigewin onji; newin-midaaso giizhigak ishkwaaj eta da-andawendaagwad — gawiin dash, gojitoowin gii-debibinige.",
  },
] as const;

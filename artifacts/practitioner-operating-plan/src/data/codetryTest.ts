// Codetry Test — applying handbook §4.2 ("Test the name by trying to rename it")
// to the canonical names settled by Task #232 across the three financial
// artifacts. Each entry walks the rename trial: candidate, what would
// have to change downstream, verdict.
//
// Verdicts:
//   "load-bearing" — rename forces real structural change. Leave the name.
//   "decorative"   — rename changes nothing material. Either propose a
//                    cleaner name, or rewrite the surroundings so the
//                    name actually carries weight.
//   "drift"        — the team has already slipped to a different word
//                    in some surface. Decide whether to put the canonical
//                    name back or to follow the new word everywhere.
//
// AUDIT ONLY. No production renames are wired into anything by this file.
//
// CADENCE — the audit is a recurring posture (handbook §4.3), not a
// one-shot snapshot. `lastReviewed` is the ISO date the practitioner
// last walked the whole sheet end to end. The Year page surfaces it as
// a quarterly ritual; the audit page reads it into the header eyebrow.
// Bump this value any time entries are added, removed, or re-trialed.
//
// ADDING A NEW ENTRY — when a new canonical name lands (a new registry
// id, a new slide title, a new shared vocabulary), append a new entry
// to the right artifact group with: name, livesAt (every surface it
// appears on), renameCandidate (what you tried to rename it to),
// whatWouldChange (the structural cost of accepting the rename),
// wouldTypeCheck + typeCheckNote (handbook §2.4 — would the renamed
// model still satisfy a type-driven schema?), bothStatesVerdict +
// bothStatesNote (constellation principles.both-states — does the one
// word hold both a slow side and a fast side?), and a verdict. Bump
// `lastReviewed` in the same commit.
//
// TYPE-CHECKER COLUMN (handbook §2.4) — for each rename trial, also
// record whether a type-driven model of the same shape would pass
// after the rename. The §2.4 case ("drift the type checker can't see")
// is the entry where wouldTypeCheck === "yes" — the rename is
// structurally invisible to a compiler, so only the codetry test
// catches it. "no" means a typed model would also flag the rename
// (rare — usually a fold or a shape change is involved). "n-a" is for
// meta entries that don't trial a single rename (cross-artifact name
// collisions, deliberate metaphor reuse).
//
// BOTH-STATES COLUMN (constellation principles.both-states) — the
// second principle filed in the codetry working-doc this pass. When a
// system has both a slow side (always-on practice) and a fast side
// (active event), the name has to do both jobs in one word, or the
// system will forks into two systems with two cultures. The exemplar
// is The Standby, which holds the always-on shelf (preparation,
// standby stock, the watch as a posture) and the active event (a
// call, the active rung, the debrief). For each entry, score:
//   "holds-both" — one word does both jobs (slow + fast).
//   "forks"      — the name has a slow/fast split that the team has
//                  let drift into two words; the system is forking.
//   "n-a"        — single-state name with no slow/fast duality to
//                  test (a role, a tier, a bucket, a corridor, a
//                  meta cross-artifact entry, etc.). saltbox-only
//                  names live here so the principle doesn't penalize
//                  them. (Future candidates if any of these grow a
//                  fast-side counterpart: "harvest" as both season
//                  and event, "shift" as both rota and handover.)

export const lastReviewed = "2026-04-28";

export type Verdict = "load-bearing" | "decorative" | "drift";

/**
 * Per handbook §2.4 ("Different from type-driven design"): would a
 * type-driven model of the same shape still pass after the trial
 * rename? "yes" is the §2.4 case — drift the type checker can't see.
 */
export type TypeCheckOutcome = "yes" | "no" | "n-a";

/**
 * Per constellation principles.both-states: does the one word hold
 * both a slow (always-on) side and a fast (active event) side?
 *   "holds-both" — one word does both jobs.
 *   "forks"      — name has a slow/fast split letting it drift apart.
 *   "n-a"        — single-state name, no slow/fast duality to test.
 */
export type BothStatesVerdict = "holds-both" | "forks" | "n-a";

export type CodetryTestEntry = {
  name: string;
  /** Where the canonical name lives — registry id, file path, slide title, etc. */
  livesAt: string;
  /** The rename we trialed against the name. */
  renameCandidate: string;
  /** What would actually have to change if we accepted that rename. */
  whatWouldChange: string;
  verdict: Verdict;
  /** Would a type-driven model of the same shape still pass after the rename? See §2.4. */
  wouldTypeCheck: TypeCheckOutcome;
  /** One-line gloss on the type-checker outcome — what a typed schema would or wouldn't see. */
  typeCheckNote: string;
  /**
   * Per constellation principles.both-states: does this one word do
   * both jobs (slow side AND fast side) in one umbrella term?
   */
  bothStatesVerdict: BothStatesVerdict;
  /** One-line gloss on the both-states reading — what the slow and fast sides are, or why this entry has no slow/fast duality. */
  bothStatesNote: string;
  /** Verdict-specific note. For drift: where the slipped word appears + recommendation. */
  followUp?: string;
};

export type CodetryTestGroup = {
  artifact: string;
  /** One-line orientation for the reader on what this artifact's vocabulary load-bears. */
  framing: string;
  entries: CodetryTestEntry[];
};

// AUDIT NOTE — Standby-leaks-into-Gate bug class (Task #473)
// =========================================================
// The "Constellation-wide primitives" group below is a *curated audit*
// over the canonical names registered in the constellation manifest's
// `constellationWidePrimitives`. It is not auto-generated from the
// manifest, and its prose is per-primitive: each entry's
// `whatWouldChange`, `bothStatesNote`, etc. are written for that one
// primitive specifically. The Standby's "first such primitive"
// framing in the group `framing` field, and its `bothStatesNote`
// language about being "the exemplar of the both-states principle",
// are Standby-only and would not generalize to The Gate. When adding a
// Gate entry to this group, the group `framing` field will need a
// rewrite that names both primitives without inheriting Standby's
// "first" framing, and The Gate gets its own entry with its own
// `whatWouldChange` (about the both-sides / massity-vs-bright-side
// duality, not slow-vs-fast) and its own audit narrative — never a
// templated copy of The Standby's. See
// artifacts/codetry-handbook/data/foundingExamples.ts for the
// per-primitive content-layer pattern that the chapter generator now
// uses to keep Standby's prose from leaking onto The Gate.
export const codetryTest: CodetryTestGroup[] = [
  {
    artifact: "Constellation-wide primitives",
    framing:
      "Names that aren't owned by any single artifact — the constellation reads them across every zone. The Standby is the first such primitive, and the both-states principle (principles.both-states) was filed in the constellation manifest alongside it. This group is where holds-both verdicts live; the financial artifacts below are saltbox-principle work and score n-a on the both-states column.",
    entries: [
      {
        name: "The Standby",
        livesAt:
          "constellation.json constellationWidePrimitives.the-standby (hosted Zone 3, read by every zone) · each zone's `standby` field (Saltbox household checklist · Bright Side facility checklist · Headwaters standby budget envelopes · etc.) · /codetry working-doc under principles.both-states",
        renameCandidate:
          "The Common Pantry (slow side only) · The Watch (fast side only) · split into 'the Pantry' (slow) + 'the Call' (fast)",
        whatWouldChange:
          "The Standby holds the always-on shelf (preparation, standby stock, the watch as a posture) AND the active event (a call, the active rung, the debrief) under one umbrella, on a four-rung severity ladder (advisory / standby / active / standdown). Renaming to 'The Common Pantry' loses the active call; renaming to 'The Watch' loses the slow shelf; splitting into 'the Pantry' (slow) + 'the Call' (fast) — both single-state names already rejected on paper in the constellation manifest's `rejectedAlternatives` — produces two systems with two cultures: one for the always-on side, one for the event side. The four-rung ladder (advisory → standby → active → standdown) only stays one ladder because the umbrella stays one word; split the word and you split the ladder. Every zone's `standby` reading depends on the same vocabulary travelling with it.",
        verdict: "load-bearing",
        wouldTypeCheck: "n-a",
        typeCheckNote:
          "No schema yet — per the constellation manifest, the Standby is naming-and-filing only this pass; no calls/watches/debriefs UI is built. The type system has nothing to read. The codetry test (and the both-states column below) is the only thing that catches the slow/fast fork before it happens.",
        bothStatesVerdict: "holds-both",
        bothStatesNote:
          "The exemplar of the both-states principle and the reason the principle was filed. One word does both jobs: the slow side (always-on preparation, standby stock, the watch as a posture, the standby rung sleeved in) and the fast side (a call, the active rung, the debrief, the standdown). The constellation manifest's `rejectedAlternatives` records the two single-state forks that were tried and turned down — 'The Common Pantry' (holds the slow side beautifully but can't hold a fire call or a payment-systems outage without straining the metaphor) and 'The Watch' (holds the active-monitoring posture but can't hold the slow shelf without bending into a permanent vigil). Each survives inside the umbrella as a sub-noun (Pantry as the food/supply sub-shelf; Watch as the active-monitoring sub-noun) — sub-nouns, not replacements.",
      },
    ],
  },
  {
    artifact: "Practitioner Operating Plan",
    framing:
      "The financial workbench. Names here have to hold up under the cost-review modal, the live registry, and a chief reading the printed one-pager.",
    entries: [
      {
        name: "Practitioner",
        livesAt:
          "src/pages/slides/TheSixPeople.tsx (Role 01) · costRegistry.ts people.* prefix · Codetry Practitioner's Handbook title · Practitioner Operating Plan deck title",
        renameCandidate: "Founder · Operator · Lead",
        whatWouldChange:
          "The role binds to a named discipline (Codetry) — 'practitioner' means someone who carries a practice. 'Founder' loses the discipline binding and turns the role into a company-origin story. 'Operator' implies running infrastructure, not installing a practice. 'Lead' severs the link to the handbook and to the cross-reserve travel logic ('the practitioner — not a Deer Lake grad — travels reserve to reserve to install Codetry'). A rename here forces a rewrite of the handbook spine, the cross-reserve travel argument, and the staffing slide's whole 'discipline-keeper' framing.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "The role is a string label on a record in the staffing table. Renaming it 'Founder' produces an identical type signature; the compiler has nothing to say about which word the discipline travels under.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Single-state name — a role, not a slow/fast pair. No second job for the umbrella to hold; no fork risk to test.",
      },
      {
        name: "floor · recommended · scale (fee tiers)",
        livesAt:
          "costRegistry.ts ask.floor / ask.recommended / ask.scale · slides/SecondAnchorScenarios.tsx · Deer Lake FinancialsRole and RisksAsk panels",
        renameCandidate: "minimum · target · maximum (or low · mid · high)",
        whatWouldChange:
          "'Floor' is the walk-away number, not just the smallest. 'Minimum' implies a baseline you accept; 'floor' implies one you stand on and turn from. 'Recommended' carries an implied standard of care — what we'd advise a council to pick — where 'target' is just an aim. 'Scale' implies what the system reaches at full utilization (Pilot #2 + concurrent reserves), where 'maximum' implies a cap. The names hold a structural shape (walk-away · standard-of-care · growth-state) the ordinal labels would flatten.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "The `ask` record carries three numeric fields whatever the keys are called. Renaming `floor` → `minimum` is a key rename, not a shape change — the type stays valid and a type-driven model would say 'still legal'.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Three-state ordinal (walk-away → standard-of-care → growth-state), not a slow/fast duality. Each tier holds one job; no umbrella name has to do double duty.",
      },
      {
        name: "bridge (~$181k day-one ask)",
        livesAt:
          "costRegistry.ts bridge.b.headline · slides/Closing.tsx · Deer Lake RisksAsk and FinancialsRole",
        renameCandidate: "loan · line of credit · startup capital",
        whatWouldChange:
          "'Bridge' specifies a temporary span across a known gap that closes by itself (the 60-day ISC pay cycle). 'Loan' invites questions about interest, repayment terms, default triggers — none of which apply. 'Line of credit' implies revolving capital. 'Startup capital' implies it never gets paid back. The whole 'M2 trough on the 60-day ISC pay cycle' explanation only lands because 'bridge' already carries 'span across a self-closing gap.'",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "A labelled dollar figure stays a labelled dollar figure. The type system can't tell whether the council reads 'bridge' as a self-closing span or 'loan' as a debt instrument.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Single-state name — a temporary span across one known gap, not a slow/fast pair. No always-on shelf alongside an active event for the umbrella to hold.",
      },
      {
        name: "discipline-keeper retainer",
        livesAt:
          "costRegistry.ts crossReserve.retainer.annual · slides/PathToScale.tsx · slides/ThreeRevenueLayers.tsx · Deer Lake FirstReserveThenTheNext",
        renameCandidate: "maintenance retainer · support contract · ongoing fee",
        whatWouldChange:
          "'Discipline-keeper' specifies what the retainer actually buys: a person actively keeping the Codetry practice in place at a deployed reserve, with quarterly architecture review and code review on money-touching merges. 'Support contract' implies reactive break-fix; 'maintenance retainer' implies keeping software running; 'ongoing fee' is shapeless. A rename quietly drops the proactive cadence and lets the retainer collapse into a help-desk line item.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "The retainer is a numeric annual figure with a string label. The schema doesn't notice when 'discipline-keeper' becomes 'support' — the contract's posture has changed; its shape hasn't.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Single-state name — a continuous annual retainer with a quarterly cadence baked in, not a slow-shelf-plus-fast-event pair. The cadence is one job, not two.",
      },
      {
        name: "reinvestment + four buckets (Tech CAPEX, Tooling subs, Training & R&D, Pilot reserve)",
        livesAt:
          "costRegistry.ts reinvest.* prefix · slides/ServicePartner.tsx · OnePager 'reinvestment markup' line",
        renameCandidate: "profit margin · overhead · four 'categories'",
        whatWouldChange:
          "'Reinvestment' commits the 35% markup to specific destinations rather than leaving it as free profit. 'Profit margin' would let the 35% go anywhere. The four 'buckets' inherit the Headwaters bucket discipline directly — envelopes you can only pour from, never summon water into. Renaming 'buckets' to 'categories' would let the UI quietly suggest balances can grow by clicking, and would let the markup be silently redirected. 'Pilot reserve' carries 'a reserve that accumulates until Pilot #2 is funded'; 'savings account' or 'growth fund' wouldn't carry the staged-release rule.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "Four named numeric buckets remain four named numeric buckets. The rename to 'categories' is purely lexical — the schema would accept it, but the bucket-discipline (pour from, never summon into) lives in the noun, not the type.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Buckets are spatial categories, not a slow/fast temporal pair. The pour-from-only discipline is one job (the discipline applies whether the bucket is filling or being drawn from); no fast-side event counterpart.",
      },
      {
        name: "cross-reserve install",
        livesAt:
          "costRegistry.ts crossReserve.* prefix · @workspace/cross-reserve-defaults · slides/PathToScale.tsx · Deer Lake FirstReserveThenTheNext",
        renameCandidate: "deployment · rollout · expansion",
        whatWouldChange:
          "'Install' carries 'discrete, repeatable, finite event with a beginning and an end' — that's why a 12-week / 30-on-site / 24-remote shape can be a constant in the codebase rather than a project plan. 'Deployment' invites a longer rollout phase. 'Rollout' invites scope creep ('when does the rollout end?'). 'Expansion' invites a budget without an end-state. 'Cross-reserve' specifies the geography (practitioner travels reserve to reserve, not band to band, not community to community) which the per-reserve install pricing depends on.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "The install is a duration-and-cost record with the same fields whether we call it install, deployment, rollout, or expansion. A typed model can't see that 'install' is finite and 'rollout' is open-ended.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Discrete event by definition (12 weeks, finite, with a beginning and an end) — the always-on counterpart is the *retainer* that follows it, which is a separate name. The install word itself only does the fast-side job, on purpose; no umbrella to fork.",
      },
      {
        name: "Hub Operator",
        livesAt:
          "src/pages/slides/StaffingModel.tsx (Deer Lake) · src/pages/slides/TheSixPeople.tsx · OnePager Operations Manager + Food Handler lines · costRegistry.ts ADR (Floor scenario block comment)",
        renameCandidate: "warehouse worker · logistics coordinator · Dryden hand",
        whatWouldChange:
          "'Hub' is the noun that makes the role coherent — the role operates the Dryden aggregation hub. Without 'hub' the duties (salt + piecework + Deer Lake order coordination + phone) read as an unrelated list. 'Warehouse worker' loses the operating-system-level coordination. 'Logistics coordinator' loses the on-the-floor batching. 'Dryden hand' loses both. The fold (Hub Operator absorbs the V2 Food Handler + Operations Manager roles) only makes sense because the hub is the single thing being operated.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "The role is a row in the staffing table; relabelling it 'warehouse worker' produces an identical row. The shape only changes when the fold itself is reversed (one row split into two) — which is a different rename than the one trialed here.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Single-role name — a person operating one hub, on the same shift posture every day. No always-on-shelf-plus-active-event split inside the role for an umbrella name to hold.",
        followUp:
          "Resolved (Task #254, 2026-04). The earlier drift verdict came from two surfaces speaking different words for the same work: the slides (TheSixPeople in this deck, StaffingModel in the Deer Lake deck) call it 'Hub Operator' at $8.5k loaded — a V3 fold of V2's Food Handler + Operations Manager — while the OnePager A·floor table keeps Operations Manager ($8.5k) and Food Handler ($5k) as separate cost-basis lines. Decision: keep separate-with-explanation. The slides carry the lean-roster narrative (where the noun does structural work — operates the hub); the printed OnePager has to give the contractor's CFO an auditable $/line breakdown at the floor. All three surfaces now carry cross-reference notes pointing at the others (TheSixPeople → OnePager + ADR, Deer Lake StaffingModel → OnePager, OnePager OM + Food Handler rows → slide). The registry contract is recorded as a block comment in costRegistry.ts at the Floor scenario (A) section: Hub Operator (folded) == budget.a.opsManager + budget.a.foodHandler. A·floor cost basis ($48,200) is unchanged; rows stay separate in the registry, fold only at presentation time. The ADR also flags a separate registry/print drift to clean up later: budget.a.opsManager carries $9,500 in the registry but the OnePager still prints $8,500 — out of scope for this fold ADR, belongs to a future OnePager hardcoded-numbers reconciliation pass.",
      },
      {
        name: "Layer One · Layer Two · Layer Three",
        livesAt:
          "src/pages/slides/ThreeRevenueLayers.tsx · Deer Lake ServicePartner three-layers panel",
        renameCandidate: "Tier One · Tier Two · Tier Three (or just 'Software · Tech Stack · Training')",
        whatWouldChange:
          "'Layer' carries 'stacked, simultaneous, no layer is the whole revenue' — a Deer Lake contract gets the entire stack, not a tier choice. 'Tier' would imply a hierarchy of preference and silently invite the reader to pick one. The Layer-as-noun is load-bearing. The numbering (One · Two · Three) is decorative on top — the names 'Software · Tech Stack at Markup · Training & cross-reserve install' carry the meaning by themselves. Worth flagging the live collision with 'Tier 2' subscriptions ($300–800/mo SMB / band-office) — a Tier-2 sub is not a Layer-Two layer, and the audit page is the right place to name that.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "Three labelled numeric revenue lines stay three labelled numeric revenue lines. A typed model would read 'Layer' and 'Tier' as the same shape, and miss that one means stacked-and-simultaneous and the other means pick-one.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Stacked simultaneous layers — all three are always-on at the same time for a Deer Lake contract. No fast-side event counterpart inside the Layer name; this is a saltbox-principle name about shape, not a both-states name about timing.",
        followUp:
          "Drift risk to watch: 'Tier 2' (subscription rung in the Pilot #2 model) and 'Layer Two' (tech stack at markup) live in the same financial vocabulary. Decision: leave the Layer/Tier distinction explicit in the cost registry and any future shared glossary, so a reader holding both decks doesn't quietly fuse them.",
      },
      {
        name: "Y1 cash gap",
        livesAt:
          "src/lib/budgetMath.ts useSecondAnchorScenarios · slides/YearOnePicture.tsx · slides/SecondAnchorScenarios.tsx (whole slide is built on closing 'the gap')",
        renameCandidate: "Y1 shortfall · Y1 deficit · Year-1 loss",
        whatWouldChange:
          "'Gap' implies something that can be closed by a specific intervention (a second anchor, a different ramp, a tier-2 portfolio). 'Shortfall' or 'deficit' implies an accounting hole that needs to be plugged with capital. 'Loss' is final. The entire Second-Anchor-Scenarios slide depends on the gap being a closeable structural distance — it offers three concrete shapes (single install · install + retainer · tier-2 stack) for closing it. Rename to 'shortfall' and the whole slide reads as 'three ways to plug the hole', losing the structural-distance framing.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "The gap is a number computed from other numbers. Renaming it 'shortfall' or 'deficit' produces an identical numeric field — the type checker is indifferent between 'distance to close' and 'hole to plug'.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "A computed distance, not a slow/fast pair. The Y1 picture has one state (the gap exists or it's been closed); no always-on shelf alongside an active event for an umbrella name to hold.",
      },
      {
        name: "cost review · cost registry",
        livesAt:
          "src/data/costRegistry.ts (1329-line single source of truth) · src/components/CostReviewModal.tsx · status field per-entry: pending review / approved / edited",
        renameCandidate: "budget review · line-item editor · financial settings",
        whatWouldChange:
          "'Cost review' carries 'every dollar figure the practitioner must approve, with status tracking per entry.' 'Budget review' loses the approval primitive. 'Line-item editor' loses the workflow. 'Cost registry' carries 'lookup-by-id, cross-linked to slides, single source of truth' — that's why slides can import a cost id and resolveCost() against the live state, and why the registry is the place council edits land first. 'Budget table' or 'data file' would lose both the lookup pattern and the cross-link guarantee.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "The registry is a Map<id, Entry> with a per-entry status enum. Calling it a 'budget table' yields the same shape and the same lookup-by-id; the words 'review' and 'registry' do work the type system never sees.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "A workflow + a dictionary, not a slow/fast pair. The registry (always-on lookup) and the review modal (active editing session) already share one vocabulary cleanly — the review reads and writes registry entries directly. No umbrella name has to span them; both are 'cost'.",
      },
    ],
  },
  {
    artifact: "Deer Lake Store — Operational Plan",
    framing:
      "The receiving-band deck. Reads many of the same names through Deer Lake's eyes — the verdicts above stay; what's new here is one drift the slide-vs-slide audit caught.",
    entries: [
      {
        name: "family-run refrigerated route",
        livesAt:
          "src/pages/slides/FinancialsRole.tsx ('The freight') · src/pages/slides/StaffingModel.tsx ('the family-run refrigerated truck already operating Thunder Bay → Sioux Lookout → Dryden every two weeks')",
        renameCandidate: "third-party logistics · regional carrier · freight provider",
        whatWouldChange:
          "Three structural constraints in one phrase. 'Family-run' specifies a known operator, not a contracted service — a relationship the band can read directly. 'Refrigerated' is the cold-chain spec. 'Route' specifies a fixed, scheduled corridor (Thunder Bay → Sioux Lookout → Dryden, every two weeks) on the same corridor Deer Lake's truck already uses. 'Third-party logistics' would lose all three. The entire 'nobody flies in to run the store' staffing argument depends on the freight being on the existing corridor with the known operator.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "This phrase is narrative copy on a slide — there's no type behind it at all. The type system has nothing to say; the codetry test is the only thing that catches the rename.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "A continuous corridor service running on a fixed bi-weekly schedule — one ongoing arrangement, not a slow shelf plus an active event. (If freight ever becomes part of The Standby's active call vocabulary — a 'freight call' when the corridor is disrupted — that fast-side reading lives inside The Standby, not inside this name.)",
      },
      {
        name: "the band runs the store / Headwaters delivers the operating system",
        livesAt:
          "src/pages/slides/StaffingModel.tsx ('Whose store this is') · src/pages/slides/FinancialsRole.tsx ('Who runs it · what Headwaters charges')",
        renameCandidate: "Headwaters operates the store · Headwaters runs Deer Lake operations",
        whatWouldChange:
          "The word 'runs' is doing the load-bearing work. 'The band runs the store' = hiring, scheduling, day-to-day decisions, ownership all sit with the band. 'Headwaters delivers the operating system' = software, training, transparency stack, monthly visits — a delivered thing, not a delivered headcount. Renaming to 'Headwaters operates the store' would silently put a Headwaters person on the floor and break the 'no flown-in embed' constraint that runs through the whole staffing model.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "Slide copy again — no schema to check. A typed model of the staffing table would not notice that the rename quietly inserts a Headwaters embed where the constraint is no embed.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Two clauses, two parties, one ongoing arrangement — both sides are always-on, no fast-side event counterpart. The slow/fast principle doesn't apply; the constraint this name holds is who-does-what, not when.",
      },
      {
        name: "pods, not roles",
        livesAt:
          "src/pages/slides/StaffingModel.tsx (PODS, NOT ROLES card · CASUAL LOCAL POD card · 'cross-trained pods' in RisksAsk row 06)",
        renameCandidate: "cross-functional team · multi-skilled staff · the crew",
        whatWouldChange:
          "'Pods' carries 'small, self-covering, interchangeable groups' — the design constraint is that when two people don't show up on a Tuesday, the store still opens. 'Roles' would lock individuals to job titles (and Tuesday's gap to a single absent person). 'Cross-functional team' is corporate-speak that loses the cover-each-other constraint. The whole 'hunting season, funerals, hockey tournaments' calendar-that-bends argument depends on pods, not roles, being the actual structure.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "PODS and ROLES are both card titles in JSX. The type system reads them as identical strings; the cover-each-other constraint lives entirely in the noun.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Always-on roster shape — pods are how the store stays open every day. No fast-side event counterpart inside the pod name itself. (If the store ever has to declare a Standby active rung, the pod that responds is doing The Standby's fast-side work; the both-states reading lives there, not here.)",
      },
    ],
  },
  {
    artifact: "Headwaters Books",
    framing:
      "The bookkeeper-facing ledger. Vocabulary here has to interoperate with the cost registry without quietly forking it.",
    entries: [
      {
        name: "Cost Centres",
        livesAt:
          "src/pages/CostCentres.tsx ('Agency tracking divisions and reporting units') · src/pages/Dashboard.tsx (Cost Centre Summary card) · API CostCentre entity",
        renameCandidate: "Departments · Divisions · Business units",
        whatWouldChange:
          "'Cost Centre' is a working bookkeeping term — a named bucket that costs land in for tracking and reporting. 'Department' implies an org-chart hierarchy. 'Division' implies a P&L unit. 'Business unit' implies independence. The Headwaters Books ledger is shaped around tracking-where-the-cost-actually-fell, not around reporting-up-an-org. The name lines up with what the bookkeeper actually does.",
        verdict: "load-bearing",
        wouldTypeCheck: "yes",
        typeCheckNote:
          "The entity has the same fields whether the class is called CostCentre, Department, or BusinessUnit. A type-driven schema would accept the rename; the org-chart-vs-bucket distinction is the part the type can't see.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "A bookkeeping bucket — costs land here continuously as they're booked, one ongoing posture. No always-on-shelf-plus-active-event split inside the name.",
      },
      {
        name: "cost centre vs. cost registry (cross-artifact name collision)",
        livesAt:
          "Headwaters Books: 'Cost Centres' (bookkeeping buckets, server-backed) · Practitioner Operating Plan: 'cost registry' (canonical figures the practitioner approves, browser storage)",
        renameCandidate: "(no rename — call out the collision)",
        whatWouldChange:
          "Two distinct primitives both named with the word 'cost'. 'Cost centre' = a tracking bucket on the books (where a real expense landed). 'Cost registry' = the source-of-truth dictionary of figures (what we plan to pay, with status). Different shapes, different storage layers, different audiences. Each name is load-bearing in its own context — neither needs to change. The risk is forward-looking: today the two artifacts don't cross-reference each other, so no current surface uses the wrong word. The moment they do (e.g. a future bridge that posts approved registry figures into Cost Centres), a reader holding both will silently fuse them.",
        verdict: "load-bearing",
        wouldTypeCheck: "n-a",
        typeCheckNote:
          "No rename trialed — this entry flags a cross-artifact name collision, not a single candidate rename. Each primitive's type already lives in its own artifact's schema.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Meta entry — a cross-artifact name collision, not a slow/fast test. Both 'cost' primitives are single-state on their own (a bucket; a dictionary); the collision is about scope and audience, not about an umbrella that has to hold two timing modes.",
        followUp:
          "Drift risk to watch (not active today). When the two artifacts start cross-referencing each other, the convention is the long forms — 'Practitioner cost-registry entry' and 'Headwaters Books cost centre' — never the bare word 'cost'. Glossary now landed at /practitioner-operating-plan/constellation.json under the new 'glossary' key (term: 'cost (financial primitives across artifacts)'); it spells out both primitives' shapes, storage layers, audiences, and the long-form convention. The convention is on paper before the first use site needs it; revisit when the first cross-artifact wiring lands.",
      },
      {
        name: "Headwaters (the agency name)",
        livesAt:
          "src/pages/Home.tsx ('Headwaters Food Systems Agency') · CostCentre default parentEntity 'Headwaters' · constellation.json zone 1 (also 'Headwaters' — the XRPL stablecoin envelope app)",
        renameCandidate: "(no rename — flag the constellation collision)",
        whatWouldChange:
          "'Headwaters' is doing double duty: in zone 1 it names the household-balance-as-source-of-the-watershed envelope app; in the agency / books context it names the practitioner's operating company. Both readings carry the source-of-the-watershed metaphor (everything downstream depends on the source flowing), so they aren't in conflict — they're the same metaphor at two scales. Worth flagging in the constellation manifest so a reader doesn't think one name was sloppily reused.",
        verdict: "load-bearing",
        wouldTypeCheck: "n-a",
        typeCheckNote:
          "No rename trialed — this entry calls out a deliberate metaphor reuse across the constellation. Two different runtime entities legitimately share one word; nothing for a type checker to flag.",
        bothStatesVerdict: "n-a",
        bothStatesNote:
          "Meta entry — deliberate metaphor reuse across the constellation, not a slow/fast test. Both Headwaters readings are continuous (the agency runs; the envelope app runs) — neither carries an event counterpart inside the name.",
        followUp:
          "Constellation note already half-acknowledges this in zone 1's `formerNames` field. Recommend: add a short explainer to constellation.json at the agency layer ('Headwaters · the agency that builds the constellation, named for the same upstream-source metaphor as zone 1') so a reader sees both readings on purpose.",
      },
    ],
  },
];

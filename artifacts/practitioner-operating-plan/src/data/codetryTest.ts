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

export type Verdict = "load-bearing" | "decorative" | "drift";

export type CodetryTestEntry = {
  name: string;
  /** Where the canonical name lives — registry id, file path, slide title, etc. */
  livesAt: string;
  /** The rename we trialed against the name. */
  renameCandidate: string;
  /** What would actually have to change if we accepted that rename. */
  whatWouldChange: string;
  verdict: Verdict;
  /** Verdict-specific note. For drift: where the slipped word appears + recommendation. */
  followUp?: string;
};

export type CodetryTestGroup = {
  artifact: string;
  /** One-line orientation for the reader on what this artifact's vocabulary load-bears. */
  framing: string;
  entries: CodetryTestEntry[];
};

export const codetryTest: CodetryTestGroup[] = [
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
      },
      {
        name: "floor · recommended · scale (fee tiers)",
        livesAt:
          "costRegistry.ts ask.floor / ask.recommended / ask.scale · slides/SecondAnchorScenarios.tsx · Deer Lake FinancialsRole and RisksAsk panels",
        renameCandidate: "minimum · target · maximum (or low · mid · high)",
        whatWouldChange:
          "'Floor' is the walk-away number, not just the smallest. 'Minimum' implies a baseline you accept; 'floor' implies one you stand on and turn from. 'Recommended' carries an implied standard of care — what we'd advise a council to pick — where 'target' is just an aim. 'Scale' implies what the system reaches at full utilization (Pilot #2 + concurrent reserves), where 'maximum' implies a cap. The names hold a structural shape (walk-away · standard-of-care · growth-state) the ordinal labels would flatten.",
        verdict: "load-bearing",
      },
      {
        name: "bridge (~$181k day-one ask)",
        livesAt:
          "costRegistry.ts bridge.b.headline · slides/Closing.tsx · Deer Lake RisksAsk and FinancialsRole",
        renameCandidate: "loan · line of credit · startup capital",
        whatWouldChange:
          "'Bridge' specifies a temporary span across a known gap that closes by itself (the 60-day ISC pay cycle). 'Loan' invites questions about interest, repayment terms, default triggers — none of which apply. 'Line of credit' implies revolving capital. 'Startup capital' implies it never gets paid back. The whole 'M2 trough on the 60-day ISC pay cycle' explanation only lands because 'bridge' already carries 'span across a self-closing gap.'",
        verdict: "load-bearing",
      },
      {
        name: "discipline-keeper retainer",
        livesAt:
          "costRegistry.ts crossReserve.retainer.annual · slides/PathToScale.tsx · slides/ThreeRevenueLayers.tsx · Deer Lake FirstReserveThenTheNext",
        renameCandidate: "maintenance retainer · support contract · ongoing fee",
        whatWouldChange:
          "'Discipline-keeper' specifies what the retainer actually buys: a person actively keeping the Codetry practice in place at a deployed reserve, with quarterly architecture review and code review on money-touching merges. 'Support contract' implies reactive break-fix; 'maintenance retainer' implies keeping software running; 'ongoing fee' is shapeless. A rename quietly drops the proactive cadence and lets the retainer collapse into a help-desk line item.",
        verdict: "load-bearing",
      },
      {
        name: "reinvestment + four buckets (Tech CAPEX, Tooling subs, Training & R&D, Pilot reserve)",
        livesAt:
          "costRegistry.ts reinvest.* prefix · slides/ServicePartner.tsx · OnePager 'reinvestment markup' line",
        renameCandidate: "profit margin · overhead · four 'categories'",
        whatWouldChange:
          "'Reinvestment' commits the 35% markup to specific destinations rather than leaving it as free profit. 'Profit margin' would let the 35% go anywhere. The four 'buckets' inherit the Headwaters bucket discipline directly — envelopes you can only pour from, never summon water into. Renaming 'buckets' to 'categories' would let the UI quietly suggest balances can grow by clicking, and would let the markup be silently redirected. 'Pilot reserve' carries 'a reserve that accumulates until Pilot #2 is funded'; 'savings account' or 'growth fund' wouldn't carry the staged-release rule.",
        verdict: "load-bearing",
      },
      {
        name: "cross-reserve install",
        livesAt:
          "costRegistry.ts crossReserve.* prefix · @workspace/cross-reserve-defaults · slides/PathToScale.tsx · Deer Lake FirstReserveThenTheNext",
        renameCandidate: "deployment · rollout · expansion",
        whatWouldChange:
          "'Install' carries 'discrete, repeatable, finite event with a beginning and an end' — that's why a 12-week / 30-on-site / 24-remote shape can be a constant in the codebase rather than a project plan. 'Deployment' invites a longer rollout phase. 'Rollout' invites scope creep ('when does the rollout end?'). 'Expansion' invites a budget without an end-state. 'Cross-reserve' specifies the geography (practitioner travels reserve to reserve, not band to band, not community to community) which the per-reserve install pricing depends on.",
        verdict: "load-bearing",
      },
      {
        name: "Hub Operator",
        livesAt:
          "src/pages/slides/StaffingModel.tsx (Deer Lake) · src/pages/slides/TheSixPeople.tsx · OnePager Operations Manager + Food Handler lines · costRegistry.ts ADR (Floor scenario block comment)",
        renameCandidate: "warehouse worker · logistics coordinator · Dryden hand",
        whatWouldChange:
          "'Hub' is the noun that makes the role coherent — the role operates the Dryden aggregation hub. Without 'hub' the duties (salt + piecework + Deer Lake order coordination + phone) read as an unrelated list. 'Warehouse worker' loses the operating-system-level coordination. 'Logistics coordinator' loses the on-the-floor batching. 'Dryden hand' loses both. The fold (Hub Operator absorbs the V2 Food Handler + Operations Manager roles) only makes sense because the hub is the single thing being operated.",
        verdict: "load-bearing",
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
      },
      {
        name: "cost review · cost registry",
        livesAt:
          "src/data/costRegistry.ts (1329-line single source of truth) · src/components/CostReviewModal.tsx · status field per-entry: pending review / approved / edited",
        renameCandidate: "budget review · line-item editor · financial settings",
        whatWouldChange:
          "'Cost review' carries 'every dollar figure the practitioner must approve, with status tracking per entry.' 'Budget review' loses the approval primitive. 'Line-item editor' loses the workflow. 'Cost registry' carries 'lookup-by-id, cross-linked to slides, single source of truth' — that's why slides can import a cost id and resolveCost() against the live state, and why the registry is the place council edits land first. 'Budget table' or 'data file' would lose both the lookup pattern and the cross-link guarantee.",
        verdict: "load-bearing",
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
      },
      {
        name: "the band runs the store / Headwaters delivers the operating system",
        livesAt:
          "src/pages/slides/StaffingModel.tsx ('Whose store this is') · src/pages/slides/FinancialsRole.tsx ('Who runs it · what Headwaters charges')",
        renameCandidate: "Headwaters operates the store · Headwaters runs Deer Lake operations",
        whatWouldChange:
          "The word 'runs' is doing the load-bearing work. 'The band runs the store' = hiring, scheduling, day-to-day decisions, ownership all sit with the band. 'Headwaters delivers the operating system' = software, training, transparency stack, monthly visits — a delivered thing, not a delivered headcount. Renaming to 'Headwaters operates the store' would silently put a Headwaters person on the floor and break the 'no flown-in embed' constraint that runs through the whole staffing model.",
        verdict: "load-bearing",
      },
      {
        name: "pods, not roles",
        livesAt:
          "src/pages/slides/StaffingModel.tsx (PODS, NOT ROLES card · CASUAL LOCAL POD card · 'cross-trained pods' in RisksAsk row 06)",
        renameCandidate: "cross-functional team · multi-skilled staff · the crew",
        whatWouldChange:
          "'Pods' carries 'small, self-covering, interchangeable groups' — the design constraint is that when two people don't show up on a Tuesday, the store still opens. 'Roles' would lock individuals to job titles (and Tuesday's gap to a single absent person). 'Cross-functional team' is corporate-speak that loses the cover-each-other constraint. The whole 'hunting season, funerals, hockey tournaments' calendar-that-bends argument depends on pods, not roles, being the actual structure.",
        verdict: "load-bearing",
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
      },
      {
        name: "cost centre vs. cost registry (cross-artifact name collision)",
        livesAt:
          "Headwaters Books: 'Cost Centres' (bookkeeping buckets, server-backed) · Practitioner Operating Plan: 'cost registry' (canonical figures the practitioner approves, browser storage)",
        renameCandidate: "(no rename — call out the collision)",
        whatWouldChange:
          "Two distinct primitives both named with the word 'cost'. 'Cost centre' = a tracking bucket on the books (where a real expense landed). 'Cost registry' = the source-of-truth dictionary of figures (what we plan to pay, with status). Different shapes, different storage layers, different audiences. Each name is load-bearing in its own context — neither needs to change. The risk is forward-looking: today the two artifacts don't cross-reference each other, so no current surface uses the wrong word. The moment they do (e.g. a future bridge that posts approved registry figures into Cost Centres), a reader holding both will silently fuse them.",
        verdict: "load-bearing",
        followUp:
          "Drift risk to watch (not active today). When the two artifacts start cross-referencing each other, the convention should be the long forms — 'Practitioner cost-registry entry' and 'Headwaters Books cost centre' — never the bare word 'cost'. Add a glossary entry to constellation.json (or a shared vocabulary doc) before any wiring crosses the artifact boundary, so the convention is on paper before the first use site needs it.",
      },
      {
        name: "Headwaters (the agency name)",
        livesAt:
          "src/pages/Home.tsx ('Headwaters Food Systems Agency') · CostCentre default parentEntity 'Headwaters' · constellation.json zone 1 (also 'Headwaters' — the XRPL stablecoin envelope app)",
        renameCandidate: "(no rename — flag the constellation collision)",
        whatWouldChange:
          "'Headwaters' is doing double duty: in zone 1 it names the household-balance-as-source-of-the-watershed envelope app; in the agency / books context it names the practitioner's operating company. Both readings carry the source-of-the-watershed metaphor (everything downstream depends on the source flowing), so they aren't in conflict — they're the same metaphor at two scales. Worth flagging in the constellation manifest so a reader doesn't think one name was sloppily reused.",
        verdict: "load-bearing",
        followUp:
          "Constellation note already half-acknowledges this in zone 1's `formerNames` field. Recommend: add a short explainer to constellation.json at the agency layer ('Headwaters · the agency that builds the constellation, named for the same upstream-source metaphor as zone 1') so a reader sees both readings on purpose.",
      },
    ],
  },
];

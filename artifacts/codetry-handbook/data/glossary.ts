export type GlossarySection = "formal" | "appendix" | "flagged";

export interface GlossaryEntry {
  term: string;
  chapter: string;
  definition: string;
  section: GlossarySection;
  group?: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: "Activated state",
    chapter: "Ch4",
    definition:
      "One of the two operational states of The Standby. The infrastructure is the same as the resting state; only the valve position changes. In activated state: open call, deployed stock, live rosters in motion. The name holds across both states.",
    section: "formal",
  },
  {
    term: "Both-sides",
    chapter: "Ch4",
    definition:
      "A test for naming a primitive that faces two contexts simultaneously. Does the umbrella name hold from the bright side and from the massity side? If the name privileges one context, the membrane becomes a wall. Same word, different room.",
    section: "formal",
  },
  {
    term: "Both-states",
    chapter: "Ch4",
    definition:
      "A test for naming a primitive that moves between tempos. Does the umbrella name hold in the resting state and in the activated state? If the name bends to fit only one tempo, the system will eventually fork into two systems with two cultures. Same word, different rung.",
    section: "formal",
  },
  {
    term: "Bright side",
    chapter: "Ch4",
    definition:
      "The community's own dialect — the words a community uses with itself in its own kitchens, meetings, and ledgers. Neighbour. Channel. The books. Standby stock. The watch. Neither informal nor incorrect. Simply a different room. The name originates in dementia care practice: an effective support person cannot hold massity's frame of reality and do the work simultaneously. Not because that side is better, but because certain things are only visible from inside it.",
    section: "formal",
  },
  {
    term: "Centralized disruption",
    chapter: "Ch4",
    definition:
      "The class of event that activates The Standby: conditions that temporarily remove or degrade a shared infrastructure the whole constellation depends on. Examples: drought, fire, smoke, flood, ice, power failure, water outage, freight disruption, payment system failure, pandemic, evacuation, postponed AGM, key-person-down. Named as a class so the constellation can distinguish a Standby call from a household-level crisis handled inside Zone 0.",
    section: "formal",
  },
  {
    term: "Codetry",
    chapter: "Ch3 origin, Ch4 vocabulary",
    definition:
      "The practice of building software whose primary load-bearing material is metaphor. The naming is the architecture; the code is the medium that makes the metaphor real, clickable, and runnable. The unit of care is the name: the chosen noun carries the constraint, and the schema, the UI, and the verbs of the app follow from it. Rename a primitive — Buckets to Categories, Practitioner to Founder — and the structure quietly changes shape underneath the name. (Ch3 states the definition in full; this entry formalises it in the vocabulary. \u201cCodetry disciplines\u201d is the collective descriptor for the named practices — constellation, primitives, principles — that codetry runs on; it is not a separate entry.)",
    section: "formal",
  },
  {
    term: "Constellation",
    chapter: "Ch4",
    definition:
      "The full set of economic systems a community runs together. Not a network (which implies optional connection) and not an organization (which implies a single structure). A constellation: distinct systems, gravitationally related, each doing its own job.",
    section: "formal",
  },
  {
    term: "Drift",
    chapter: "Ch3 / Ch4",
    definition:
      "The failure that occurs when a community's load-bearing noun is translated — even into a cleaner, more general, or more reusable noun — without the community's recognition or consent. Drift is not announced as a loss; each move feels like cleanup, like progress, like professionalism. The codetry-test exists because drift is invisible to the type checker and obvious to the person who handed you the word. (Codetry-test is the informal name for the discipline's ongoing verification posture — when in doubt, check against the human who gave you the word, not against the literature or the model; it is not a separate named procedure.)",
    section: "formal",
  },
  {
    term: "The Gate",
    chapter: "Ch4",
    definition:
      "The primitive that holds the community's own language (bright side) and institutional language (massity) as two simultaneous sides of one membrane. It decides what crosses, logs every substitution, and refuses to translate what has no honest equivalent. The constellation's second non-zone primitive. Full eight-word vocabulary: see Appendix I.",
    section: "formal",
  },
  {
    term: "Knowledge creep / Language drift",
    chapter: "Ch3 / Ch4",
    definition:
      "Two named failure modes that together constitute drift in practice. Knowledge creep: a word a person used in a kitchen ends up, three meetings later, as a different word in a deck — the concept stays but the noun wanders. Language drift: the books becomes the ledger becomes the financial management module — the noun is swapped for a cleaner, more general one and the original word is no longer in the room. Neither announces itself as a loss.",
    section: "formal",
  },
  {
    term: "Massity",
    chapter: "Ch4",
    definition:
      "Mass-society dialect — the language a regulator, banker, funder, or lawyer will accept. Resident. Bank account. Financial statements. Inventory reserves. Compliance officer. Neither dialect is wrong inside its own context. Each is unfit currency in the other's.",
    section: "formal",
  },
  {
    term: "Practitioner",
    chapter: "Ch1–Ch5, Ch4 vocabulary",
    definition:
      "A person practicing codetry within a community: listening for the noun the community already uses, refusing to translate it into something cleaner, and verifying against the person who handed them the word rather than against the literature, the model, or their own better idea. A posture, not a role specification. The practitioner's exit is handover, not compound. (Practitioner's workbench: the practitioner's own named tool — the place where the week is planned, the costs are walked, and the work is kept honest against what was said it would be. The rename from \u201cfounder's dashboard\u201d to \u201cpractitioner's workbench\u201d is itself a codetry move; practitioner's workbench is a sub-entry, not a standalone primitive.)",
    section: "formal",
  },
  {
    term: "Primitive",
    chapter: "Ch4",
    definition:
      "A named system inside the constellation that does a specific, irreducible job. Each primitive has a name chosen to hold across every context in which it appears — zones, seasons, personnel, tempo.",
    section: "formal",
  },
  {
    term: "Refused",
    chapter: "Ch4",
    definition:
      "A Gate outcome for source-side language that has no honest equivalent in the target dialect. The word does not cross. The document notes the gap. Protecting the word is more important than completing the translation. Refused is a first-class outcome — not a failure, not a footnote.",
    section: "formal",
  },
  {
    term: "Resting state",
    chapter: "Ch4",
    definition:
      "One of the two operational states of The Standby. In resting state: always-on preparation — stocked shelves, current contact trees, regular test-starts, the watch reading morning advisories. The infrastructure is the same as the activated state; only the valve position changes.",
    section: "formal",
  },
  {
    term: "The Standby",
    chapter: "Ch4",
    definition:
      "The primitive that holds emergency preparedness and emergency response as one system. In its resting state: always-on practice, stocked shelves, current contact trees, regular test-starts. In its activated state: open call, deployed stock, live rosters. One infrastructure, two states, one name. The constellation's first non-zone primitive. Full six-word vocabulary: see Appendix I.",
    section: "formal",
  },
  {
    term: "Zone",
    chapter: "Ch4",
    definition:
      "A domain of practice inside the constellation. Six zones, numbered by proximity to the household: Zone 0 — household; Zone 1 - Eave — your circle (invite), identity layer: Lodge; Zone 2 — practitioner's workbench (operating plan, contracted work); Zone 3 — community exchange (807 co-op, board-governed); Zone 4 — Community Hall (voluntary informal association, Nursery / Fodder / Fallow, graduation gate to Zone 3); Zone 5 — The Margin / Shallows (open public, Eave-optional, anonymous DID). Primitives are hosted in zones but read by all zones. Full zone flow: Zone 5 wild idea → Zone 4 informal shaping → Zone 3 approval + contract → Zone 2 paid execution → Zone 3 operation → Zone 4 collective benefit → Path A return drift to Zone 5.",
    section: "formal",
  },

  {
    term: "A call",
    chapter: "Ch4 body / App I",
    definition:
      "A specific active event within The Standby's activated state. An open call triggers roster deployment and stock release; the system runs in active until the call stands down.",
    section: "appendix",
    group: "The Standby",
  },
  {
    term: "The debrief",
    chapter: "Ch4 body / App I",
    definition:
      "After-action synthesis conducted once a call stands down. The mechanism by which the Standby learns from each activated event.",
    section: "appendix",
    group: "The Standby",
  },
  {
    term: "Standby stock",
    chapter: "Ch4 body / App I",
    definition:
      "The always-on reserves maintained during resting state. The physical/material sub-shelf of the Standby primitive; also survives as a sub-shelf noun inside the umbrella alongside The Common Pantry and The Watch.",
    section: "appendix",
    group: "The Standby",
  },
  {
    term: "The watch",
    chapter: "Ch4 body / App I",
    definition:
      "The active-monitoring posture during resting state: reading the morning advisory, keeping contact trees current, running generator test-starts. Also named as a rejected umbrella name for The Standby (too fast-side-only to hold the slow shelf).",
    section: "appendix",
    group: "The Standby",
  },
  {
    term: "Lodge",
    chapter: "Ch4 / §5.9",
    definition:
      "The confirmed name for the Zone 1 household identity layer. A Lodge identity is what a household holds below the Eave: a name the circle recognises, without disclosure to Zone 3+. Entry is by invitation and passphrase. Private — not public, not institutional. Earned by invitation — not enrolled, not registered. Held by a group with shared values, revocable by the keeper of the door. The rename test was run against Membership, Profile, and Household ID; all three cracked. Lodge is load-bearing.",
    section: "formal",
  },
  {
    term: "Nursery",
    chapter: "Ch4 — Zone 4 formation model",
    definition:
      "The Zone 4 sub-shelf for new cooperative ideas in earliest formation — no history, no scar tissue, open slate. A Nursery idea has not yet been through the world.",
    section: "appendix",
    group: "Zone 4 Formation",
  },
  {
    term: "Fodder",
    chapter: "Ch4 — Zone 4 formation model",
    definition:
      "The Zone 4 sub-shelf for Zone 3 ideas returned for reworking. Carries history and scar tissue; distinct from Nursery. Named honestly so the difference between a new idea and a returned one is never flattened. A Fodder idea has already survived one round of the world.",
    section: "appendix",
    group: "Zone 4 Formation",
  },
  {
    term: "Fallow",
    chapter: "Ch4 — Zone 4 formation model",
    definition:
      "The Zone 4 sub-shelf for ideas resting between attempts, not formally demoted. Fallow ground still has life in it; fallow is not failure.",
    section: "appendix",
    group: "Zone 4 Formation",
  },
  {
    term: "Graduation gate",
    chapter: "Ch4 — Zone 4 formation model",
    definition:
      "The moment a Zone 4 cooperative idea becomes a fully formed, actionable pilot handed to the Zone 3 producer board for a vote per 807's bylaws. Graduating means surviving one full cycle without 807 eating the risk. The board votes only at graduation — not during formation.",
    section: "appendix",
    group: "Zone 4 Formation",
  },
  {
    term: "Economic floor mechanism",
    chapter: "Ch4 — Zone 4 formation model",
    definition:
      "807 frames Zone 4 ideas in massity dialect → writes grants → grants fund Zone 2 workbenches of the people doing Zone 4 formation work → strengthened Zone 2 capacity → better Zone 4 output → Zone 3 graduation → Zone 3 surplus eventually funds Zone 2 directly. Without a funded Zone 2 layer, Zone 4 stagnates.",
    section: "appendix",
    group: "Zone 4 Formation",
  },
  {
    term: "Dead backwater",
    chapter: "Ch4 — Zone 5",
    definition:
      "Named failure mode for Zone 5 (The Shallows): the feed goes quiet, tip flow drops to zero, no new DIDs wading in. Prevention is Zone 3 and Zone 4's job, not Zone 5's.",
    section: "appendix",
    group: "Zone 5",
  },
  {
    term: "A calm membrane",
    chapter: "App II",
    definition:
      "The governing metaphor for The Gate: selectively permeable, alive, not a wall and not an open door. Describes how the Gate holds bright side and massity simultaneously without collapsing into either.",
    section: "appendix",
    group: "The Gate",
  },
  {
    term: "A category",
    chapter: "App II",
    definition:
      "The domain a mapping belongs to, used to organize the Gate's ledger of registered correspondences.",
    section: "appendix",
    group: "The Gate",
  },
  {
    term: "A mapping",
    chapter: "App II",
    definition:
      "A registered correspondence between a bright-side term and its massity equivalent. The foundational record in the Gate's ledger.",
    section: "appendix",
    group: "The Gate",
  },
  {
    term: "A substitution",
    chapter: "App II",
    definition:
      "One applied instance of a mapping: the act of replacing a term from one side with its mapped equivalent for a specific document or context.",
    section: "appendix",
    group: "The Gate",
  },
  {
    term: "A translation",
    chapter: "App II",
    definition:
      "The auditable record of what crossed the Gate and what changed in the crossing.",
    section: "appendix",
    group: "The Gate",
  },
];

export const SECTION_LABELS: Record<GlossarySection, string> = {
  formal: "Formal Vocabulary",
  appendix: "Appendix Sub-Terms",
  flagged: "Flagged — Pending Definition",
};

export const SECTION_ORDER: GlossarySection[] = [
  "formal",
  "appendix",
  "flagged",
];

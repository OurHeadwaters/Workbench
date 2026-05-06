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
    term: "Constellation",
    chapter: "Ch4",
    definition:
      "The full set of economic systems a community runs together. Not a network (which implies optional connection) and not an organization (which implies a single structure). A constellation: distinct systems, gravitationally related, each doing its own job.",
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
    term: "Massity",
    chapter: "Ch4",
    definition:
      "Mass-society dialect — the language a regulator, banker, funder, or lawyer will accept. Resident. Bank account. Financial statements. Inventory reserves. Compliance officer. Neither dialect is wrong inside its own context. Each is unfit currency in the other's.",
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
      "A domain of practice inside the constellation: household, finance, knowledge, emergency preparedness, land, and public. Primitives are hosted in zones but read by all zones.",
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

  {
    term: "Codetry",
    chapter: "Ch3",
    definition:
      `Defined in Ch3: \u201cthe practice of building software whose primary load-bearing material is metaphor. The naming is the architecture; the code is the medium that makes the metaphor real, clickable, and runnable.\u201d Pending formal vocabulary entry in Ch4.`,
    section: "flagged",
  },
  {
    term: "Codetry disciplines",
    chapter: "Ch1",
    definition:
      `Appears in Ch1: \u201cthe codetry disciplines that hold community institutions together when the external systems fail.\u201d Treated as a plural implying a set of named practices. No enumeration or formal definition provided.`,
    section: "flagged",
  },
  {
    term: "Codetry-test",
    chapter: "Ch3 / Ch4",
    definition:
      `Used in Ch3: \u201cthe codetry-test exists because that slip is invisible to the type checker and obvious to the person who handed you the word.\u201d Referenced as a named check, but the test itself has no standalone definition or procedure.`,
    section: "flagged",
  },
  {
    term: "Cockpit",
    chapter: "Ch2",
    definition:
      `Used in Ch2 to describe the two-person operating structure for the community store: \u201cTwo people on the cockpit.\u201d Appears to mean the minimal operational crew plus the software layer beneath them. Used multiple times as a named concept but never formally defined.`,
    section: "flagged",
  },
  {
    term: "Drift",
    chapter: "Ch3 / Ch4",
    definition:
      `Named as a key failure mode in Ch3: \u201ctranslation away from that noun \u2014 even into a cleaner, more general, more reusable noun \u2014 is treated as drift, not as cleanup.\u201d Central to the discipline's argument but lacking a standalone formal definition.`,
    section: "flagged",
  },
  {
    term: "Knowledge creep / Language drift",
    chapter: "Ch3",
    definition:
      `Two distinct failure modes named in Ch3. Knowledge creep: \u201ca word a person used in a kitchen ends up, three meetings later, as a different word in a deck.\u201d Language drift: \u201cthe books becomes the ledger becomes the financial management module.\u201d Both used as named phenomena without formal entries.`,
    section: "flagged",
  },
  {
    term: "Literate programming",
    chapter: "Ch1 / Ch3",
    definition:
      `Used in Ch1 as a horizon concept (\u201cliterate programming is only the first small sail\u201d) and defined briefly in Ch3 in comparison to codetry: \u201cLiterate programming makes the reasoning the source. Codetry makes the metaphor the source.\u201d No standalone formal definition given.`,
    section: "flagged",
  },
  {
    term: "Practitioner / Practitioner's workbench",
    chapter: "Ch1 / Ch2 / Ch3 / Ch5",
    definition:
      `Practitioner is used from Ch1 onward and Ch5 explicitly notes it is \u201ctreated as already established from Ch1\u2013Ch3.\u201d The practitioner's workbench is named in Ch3 as the rename of \u201cfounder's dashboard.\u201d Neither receives a formal vocabulary entry.`,
    section: "flagged",
  },
  {
    term: "The Siphon",
    chapter: "Ch4",
    definition:
      `Appears in Ch4 \u00a7The name changes the tool: \u201cThe Siphon is the bill that leaves before you see the money.\u201d Used as a named structural concept within Headwaters' envelope-budget vocabulary, but not in the formal vocabulary list.`,
    section: "flagged",
  },
  {
    term: "The Stuck Board",
    chapter: "Ch4",
    definition:
      `Named in Ch4 \u00a7The name changes the tool: \u201cThe Stuck Board: the name is the spec. Things get stuck; the board surfaces them with owner-tags and last-touch timestamps.\u201d Treated as a codetry worked example but has no vocabulary entry.`,
    section: "flagged",
  },
  {
    term: "Zone 0 / Zone 1 / Zone 5",
    chapter: "Ch1 / Ch4",
    definition:
      "Ch1 uses Zone 0, Zone 1, and Zone 5 as named identifiers before Zone is defined in Ch4. The Ch4 vocabulary defines Zone as a concept but does not enumerate which domains correspond to which zone numbers or explain the numbering scheme.",
    section: "flagged",
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

/**
 * @workspace/codetry-public
 *
 * The single source of truth for Codetry strategic data.
 * Both the Practitioners Guide (full internal view) and the Ship site
 * (public window) import from here. One source. Two views.
 *
 * When this file changes, both sites update automatically.
 * Updating this file is the only maintenance step required.
 *
 * What's in here:
 *   - CODETRY_DESTINATION / CODETRY_DESTINATION_PUBLIC
 *   - CODETRY_FILTER_QUESTIONS (internal + public versions of each)
 *   - CODETRY_ENGAGEMENTS (full records; isPublic flags which surface publicly)
 *   - PROVEN_ITEMS / NEEDS_PROOF_ITEMS (internal accounting)
 *
 * What stays in the Practitioners Guide only:
 *   - Financial details, margin percentages, pricing architecture
 *   - The "honest accounting" display logic
 *   - Internal strategy notes beyond what's in statusNote
 */

// ─── Destination ──────────────────────────────────────────────────────────────

export const CODETRY_DESTINATION = {
  p1: "Codetry is building toward communities that own their economic infrastructure — the records, the tools, the methodology — in a form that cannot be extracted by consultants, captured by funders, or lost in a personnel change.",
  p2: "The long-game is a trust layer: a ledger of real community economic activity — provable, auditable, portable — that backs grants, supply chain partnerships, and eventually inter-community trade without requiring an outside institution to validate it. Blockchain is not the product. It is the architecture that makes the ledger community-owned instead of consultant-held.",
  p3: "Every engagement is a proof point. Every tool built is a brick. The 20-year window opened when the first community store ran its first day on a legible system with a named ledger. We are in the early innings of something most people will not understand for another decade.",
};

export const CODETRY_DESTINATION_PUBLIC = {
  p1: "Codetry is building toward communities that own their economic infrastructure — the records, the tools, the methodology — in a form that cannot be extracted by consultants, captured by funders, or lost in a personnel change.",
  p2: "The long-game is a ledger of real community economic activity — provable, auditable, portable — that backs grants, supply chain partnerships, and eventually inter-community trade without requiring an outside institution to validate it.",
  p3: "Every engagement is a proof point. Every tool built is a brick. This is not a pitch. It is where the work is actually pointed.",
};

// ─── Filter questions ─────────────────────────────────────────────────────────

export interface FilterQuestion {
  n: string;
  internal: string;
  public: string;
  internalNote: string;
  publicNote: string;
}

export const CODETRY_FILTER_QUESTIONS: FilterQuestion[] = [
  {
    n: "1",
    internal: "Does it prove the model in a new context?",
    public: "Does this engagement produce evidence, not just a deliverable?",
    internalNote:
      "New community, new sector, new region. Replication with evidence is how the model gains credibility it can't buy.",
    publicNote:
      "Evidence that outlasts the engagement — documented results a community can hand to the next funder, partner, or leadership team.",
  },
  {
    n: "2",
    internal: "Does it build or train a practitioner?",
    public: "Does this leave someone behind who can maintain what was built?",
    internalNote:
      "Grows the network of people who can run the Codetry discipline independently — without the founder in the room.",
    publicNote:
      "The test of any engagement: when Headwaters steps back, is the system still running? Is someone local holding the knowledge?",
  },
  {
    n: "3",
    internal: "Does it improve the tools or discipline itself?",
    public: "Does this make the next engagement sharper than the last?",
    internalNote:
      "Handbook refinement, new Codetry tools, better constellation models, improved gate logs. Practice that makes the next engagement faster and sharper.",
    publicNote:
      "The tools improve with every engagement. What was built for the first community becomes the foundation the second community starts from.",
  },
  {
    n: "4",
    internal: "Does it build a record that backs future work?",
    public: "Does this produce documentation the community owns permanently?",
    internalNote:
      "Financial proof, demand data, grant applications, supply chain evidence. The ledger grows with every piece of documented economic activity.",
    publicNote:
      "Not a report that goes in a drawer. A record — financial, operational, auditable — the community can use to back the next grant, partnership, or leadership transition.",
  },
  {
    n: "5",
    internal: "Does it advance the trust layer?",
    public: "Does this move toward a system no outside institution controls?",
    internalNote:
      "Portable records, auditable economic history, community-owned data infrastructure. The long infrastructure play — each step toward a ledger no outside institution controls.",
    publicNote:
      "The long play: economic records that belong to the community — not to the consultant who compiled them or the funder who required them.",
  },
];

// ─── Engagement log ───────────────────────────────────────────────────────────

export type ProofStatus = "proven" | "in-progress" | "needs-proof";
export type EngagementType = "paid" | "unpaid" | "in-development";

export interface CodetryEngagement {
  name: string;
  type: EngagementType;
  objectives: string[];
  codetryValue: string;
  publicSummary: string;
  status: ProofStatus;
  statusNote: string;
  isPublic: boolean;
}

export const CODETRY_ENGAGEMENTS: CodetryEngagement[] = [
  {
    name: "Northern Band — Agency Contract (V4–V7)",
    type: "paid",
    objectives: ["1", "3", "4"],
    status: "proven",
    isPublic: true,
    codetryValue:
      "The founding engagement. Proved the model works — a community can own and operate a food system built with Codetry tools and hand it over without losing institutional memory.",
    publicSummary:
      "The founding engagement. A community food system — built, named, and handed over so the community could run it themselves. The ledger, the tools, and the institutional memory stayed with the band.",
    statusNote:
      "Proved the community store model produces a legible operating system. Naming discipline reduced handover friction. Financial records are community-held. This is the first brick.",
  },
  {
    name: "Deer Lake First Nation — Phase 1",
    type: "paid",
    objectives: ["1", "4"],
    status: "in-progress",
    isPublic: true,
    codetryValue:
      "The replication test. Can Codetry run in a second community without rebuilding from scratch? Deer Lake Phase 2 data becomes the first piece of auditable supply chain evidence.",
    publicSummary:
      "The replication test. Building the same model in a new community context — with the January 2027 winter road as the supply chain unlock that makes the economics real.",
    statusNote:
      "Proving the model replicates in a new community context. Phase 2 data (demand, financial) is what backs the 807 supply chain grant applications. The proof point is the January 2027 winter road.",
  },
  {
    name: "807 Food Co-operative — Supply Chain",
    type: "paid",
    objectives: ["1", "4", "5"],
    status: "in-progress",
    isPublic: true,
    codetryValue:
      "Builds the record that outlasts any individual engagement. NWO producer → 807 → community store is a documented supply chain. That documentation is the first piece of the trust layer.",
    publicSummary:
      "NWO producers → 807 aggregation → First Nations communities. Building the documented supply chain that backs grant applications and makes community food sovereignty possible at scale.",
    statusNote:
      "The supply chain connection between NWO producers and First Nations communities. The aggregation layer is the infrastructure that makes Deer Lake work. Grant applications June 2026.",
  },
  {
    name: "Codetry Handbook — How a Community Runs Its Own Economy",
    type: "in-development",
    objectives: ["2", "3"],
    status: "in-progress",
    isPublic: true,
    codetryValue:
      "Codifies the discipline so another practitioner can run it without the founder in the room. The handbook is what turns Codetry from a practice into a replicable methodology.",
    publicSummary:
      "The practitioner manual — codifying the Codetry discipline so another community or practitioner can run it without needing to start from scratch.",
    statusNote:
      "Needs a second practitioner to run an engagement from the handbook alone before this proof column changes. That test is the milestone.",
  },
  {
    name: "Brightside RT-LTC — SaaS Tool",
    type: "in-development",
    objectives: ["3", "4"],
    status: "needs-proof",
    isPublic: false,
    codetryValue:
      "Proves Codetry can produce tools that outlast any individual contract — software that communities or service providers can own and run independently.",
    publicSummary:
      "A software tool built alongside the agency practice — proving that Codetry methodology produces technology communities can own and operate independently.",
    statusNote:
      "Proof comes when a second buyer signs on without the engagement relationship as the reason.",
  },
  {
    name: "Headwaters Print Marketing Suite",
    type: "unpaid",
    objectives: ["2", "3"],
    status: "proven",
    isPublic: false,
    codetryValue:
      "Test of the principle: unpaid work with clear objective value improves the tools and trains the practitioner. The Deer Lake packet took a fraction of the time because this ground had been walked.",
    publicSummary:
      "Design and print tools built to support community outreach — the same tools that produced the Deer Lake outreach packet in a fraction of the time.",
    statusNote:
      "Practice and tooling. All of this feeds back into future paid engagements as a faster, better starting point.",
  },
  {
    name: "Practitioners Guide V2 — operating manual",
    type: "unpaid",
    objectives: ["2", "3", "4"],
    status: "in-progress",
    isPublic: false,
    codetryValue:
      "This is the field manual and the record simultaneously. Every page is evidence of the discipline running on itself — Codetry applied to Codetry.",
    publicSummary:
      "The operating manual for the practice itself — updated in real time as the work changes. The same document that powers this public window.",
    statusNote:
      "The operating ledger for the practice itself. Proves the principle that a practitioner can maintain strategic coherence across 20-30 years of work if the framework is legible and updated in real time.",
  },
  {
    name: "xbuckets — Household Finance on XRPL",
    type: "in-development",
    objectives: ["3", "5"],
    status: "in-progress",
    isPublic: false,
    codetryValue:
      "Zone 0 trust layer proof: a household can own and operate their own financial records without a bank as the intermediary. Non-custodial by construction — the server holds no keys and cannot move funds. The architecture that makes community-owned finance infrastructure possible at the household level.",
    publicSummary:
      "A household budgeting tool built on community-owned infrastructure — non-custodial by design, so the household holds their own financial records without a bank as the gatekeeper.",
    statusNote:
      "Working mainnet PWA on XRPL. Non-custodial architecture is genuine. Credit union and IG institutional interfaces are real skins with no live institutional API behind them yet — the architecture is the proof point, not the partnership. Proof advances when a second household runs on it independently.",
  },
  {
    name: "Saltbox — Personal Disability Tool",
    type: "in-development",
    objectives: ["3"],
    status: "in-progress",
    isPublic: false,
    codetryValue:
      "Zone 0 individual proof: the user, the developer, and the proof are the same person. A custom homeschool companion built by a parent with inattentive ADHD for her own household — homeschooling a neurodivergent child. No other project in the constellation has this property. Proves the individual disability tool model at the most foundational level before it is offered to anyone else.",
    publicSummary:
      "A custom homeschool companion built for a neurodivergent family — designed from the inside by the person using it, not prescribed from the outside.",
    statusNote:
      "Active development, in use in Bobbie's household. The proof point is structural: user = developer = proof. Proof of concept for the individual support tool service line. Proof advances when the methodology is adapted for a second person's disability profile.",
  },
  {
    name: "NWO Regional Abattoir — Operations Tool",
    type: "in-development",
    objectives: ["1", "3", "4"],
    status: "in-progress",
    isPublic: false,
    codetryValue:
      "Zone 4 (Regen Revolution) proof: a regional abattoir in Northwestern Ontario can run full processing pipeline operations — single-animal traceability, yield estimation, farmer portal — on a single-operator platform without a technical team. Food systems infrastructure that serves the same NWO supply chain the 807 engagement is building.",
    publicSummary:
      "Processing pipeline operations for a regional abattoir — built so a small team can track every animal from booking to pickup with full yield accounting and farmer self-serve access.",
    statusNote:
      "Built and working in dev. Not yet deployed to production. Notification delivery is the one unbuilt piece of the core loop. Pilot deployment timing is an open decision. Proof comes when the operator runs a real season on it.",
  },
  {
    name: "Rootstock — Headwaters Platform Licensing",
    type: "in-development",
    objectives: ["2", "3", "5"],
    status: "needs-proof",
    isPublic: false,
    codetryValue:
      "The commercialization layer. Proves Codetry tools can scale beyond 807 as a licensed platform. 807 is the proof case Rootstock sells — the 2025 fiscal year is the live reference. The tenant seam is built; the second tenant does not yet exist. Proof comes when a second co-op signs on without the founder-as-proof-case dynamic.",
    publicSummary:
      "The platform that licenses the co-op operating tools Codetry built for 807 to other co-operatives — so the next co-op starts from a proven foundation, not a blank page.",
    statusNote:
      "Pilot-ready. Name locked: Rootstock. Proof comes when a second co-op tenant signs on independently.",
  },
];

// ─── Honest accounting (internal) ─────────────────────────────────────────────

export const PROVEN_ITEMS = [
  "The community store model produces a legible operating system a community can own.",
  "The naming discipline reduces handover friction — the next person can read what was built.",
  "Kitchen table methodology produces systems the operator recognises as theirs.",
  "One practitioner can hold the system the way ten used to, with the right tools.",
  "Unpaid practice work feeds directly back into paid engagement quality.",
];

export const NEEDS_PROOF_ITEMS = [
  "The model replicates in a second community without the founder managing both — Deer Lake is the test.",
  "A second practitioner can run an engagement from the handbook alone, without the founder in the room.",
  "The trust layer (the ledger) has standalone value beyond the engagement that produced it.",
  "Codetry tools produce revenue independent of any single client relationship.",
  "The supply chain documentation (807 + Deer Lake) constitutes evidence that backs a grant without additional narrative from the practitioner.",
  "The individual disability tool model works for someone other than the practitioner — Saltbox proves it for one household; a second person's profile is the test.",
  "The platform licensing model (Rootstock) attracts a second co-op tenant without the founder-as-proof-case as the reason.",
  "The household finance trust layer (xbuckets) serves a second household independently — the non-custodial architecture is proved; the network effect is not.",
];

// ─── Objective label map (shared) ─────────────────────────────────────────────

export const OBJECTIVE_LABELS: Record<string, string> = {
  "1": "Proves model",
  "2": "Builds practitioner",
  "3": "Improves tools",
  "4": "Builds record",
  "5": "Trust layer",
};

export const OBJECTIVE_LABELS_PUBLIC: Record<string, string> = {
  "1": "Produces evidence",
  "2": "Leaves capacity behind",
  "3": "Sharpens the tools",
  "4": "Community-owned record",
  "5": "Advances the trust layer",
};

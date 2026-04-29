// Plan B · trigger conditions, reframed pitch, outreach circles,
// the 807 work split, and the runway timeline.
//
// The funder slots live in a sibling file (`planBFunders.ts`) so the
// data source for that section can be swapped for a feed from the
// grants-finder artifact later without touching anything in this file
// or in the Plan B page beyond a single named import.
//
// Every item below carries a `confidence` discriminator. A `seed` item
// MUST name the specific intel that would flip it (so the page reads
// as a list of explicit asks, not a vague "to-sharpen" sketch). A
// `confirmed` item MUST point at the file in `docs/partnerships/` that
// grounds it (so an advisor can audit the briefing without a verbal
// preamble). The only way to flip a flag is to drop the matching intel
// in `docs/partnerships/` and edit this file in the same pass.

export type Confidence =
  | {
      kind: "seed";
      /**
       * Specific intel that would let this item flip to `confirmed`.
       * Name the file (e.g. `docs/partnerships/ifna.md`) and the fact
       * that file would carry. Avoid generic "needs sign-off" — the
       * point of this field is to make the next intel ask mechanical.
       */
      needs: string;
    }
  | {
      kind: "confirmed";
      /**
       * Pointer to the file in `docs/partnerships/` (or a dated note
       * in such a file) that grounds the wording above.
       */
      source: string;
    };

// ---------------------------------------------------------------------------
// 1 · Trigger conditions
// ---------------------------------------------------------------------------

export type TriggerCondition = {
  /** Short label for the trigger (used as a heading on the page). */
  label: string;
  /** What signal in the world flips Plan A → Plan B. */
  signal: string;
  /** Decision date in plain English (e.g. "2026-06-15", "end of Q3"). */
  decisionDate: string;
  /** What the practitioner does the moment this trigger fires. */
  thenDo: string;
  confidence: Confidence;
};

export const triggerConditions: TriggerCondition[] = [
  {
    label: "Hard no from Deer Lake council",
    signal:
      "Council passes a BCR (or sends written notice) declining the $90k/mo full-stack engagement, the $35k Layer-1 software-only contract, or both.",
    decisionDate: "Same day the BCR / written notice lands.",
    thenDo:
      "Stand down the Deer Lake-specific bridge ask, freeze Pilot #1 spend, and open Plan B at §3 Outreach — start with the IFNA cluster the same week.",
    confidence: {
      kind: "seed",
      needs:
        "Practitioner sign-off that the response sequence (freeze Pilot #1 spend → IFNA outreach the same week) is the actual playbook, not the executor's default. The date itself is reactive (BCR-day) so needs no separate confirm.",
    },
  },
  {
    label: "Stall past the soft decision date",
    signal:
      "No BCR, no signed contract, and no scheduled council date by the agreed-on soft decision date — i.e. the practitioner is still chasing a meeting, not a signature.",
    decisionDate: "2026-06-15 (soft date; revise once council calendar confirms).",
    thenDo:
      "Send a one-paragraph 'I'm pivoting capacity' note through the existing Deer Lake channel, then begin the IFNA-cluster outreach in §3 without waiting for a reply.",
    confidence: {
      kind: "seed",
      needs:
        "2026-06-15 is the executor's read of a reasonable soft date; needs the practitioner-confirmed date the Deer Lake council calendar is actually pointed at. Drop the confirmed date (and the meeting/call it anchors to) into `docs/partnerships/deer-lake.md`.",
    },
  },
  {
    label: "Stall past the hard decision date",
    signal:
      "Soft date passed, no contract, no concrete next council date on the calendar, and the bridge runway has burned past the M2 trough projection.",
    decisionDate: "2026-07-31 (hard date; non-negotiable in the runway model).",
    thenDo:
      "Treat Deer Lake as paused (not killed). Move all team capacity onto Plan B. Submit the LFIF follow-on (§5) the same week, and schedule the first NAN economic development call.",
    confidence: {
      kind: "seed",
      needs:
        "2026-07-31 is derived from the runway model's M2 trough, not from a practitioner-confirmed walk-away point. Confirm (or revise) the date in `docs/partnerships/deer-lake.md` and reconcile against the Pilot #1 cost basis.",
    },
  },
  {
    label: "Bridge capital does not land",
    signal:
      "Day-one bridge funding (~$181k recommended scenario) is not committed by the funder/financier listed in the runway plan, even if Deer Lake is otherwise on track.",
    decisionDate: "2026-05-30 (one-month buffer before the soft Deer Lake date).",
    thenDo:
      "Drop to the $48k cost-basis floor (Scenario A), defer the Senior Engineer #2 / Outreach / Trainer hires, and use the protected runway to work Plan B outreach in parallel with Deer Lake.",
    confidence: {
      kind: "seed",
      needs:
        "The trigger reads as if a specific bridge funder is identified, but `docs/partnerships/bridge-financier.md` does not exist yet. Either name the funder/financier (and their decision calendar) or rewrite the trigger as 'no bridge committed by any source by 2026-05-30'.",
    },
  },
  {
    label: "Practitioner-side burnout signal",
    signal:
      "Two consecutive weekly close-outs report the non-negotiables (kids' time, sleep, partner time) breached because of Deer Lake-specific firefighting.",
    decisionDate: "End of the second flagged week.",
    thenDo:
      "Hold the Deer Lake conversation at status quo (no new commitments), open Plan B's §3 Outreach in parallel, and use Plan B's slower cadence to break the sole-customer dependency before a third week breaches.",
    confidence: {
      kind: "seed",
      needs:
        "The two-week threshold is the executor's default. Needs practitioner confirmation that two consecutive flagged weeks is the trigger, not one (earlier intervention) or three (longer rope). Note the chosen threshold in `docs/partnerships/practitioner-non-negotiables.md`.",
    },
  },
];

// ---------------------------------------------------------------------------
// 2 · Reframed pitch — store-in-a-box for any small northern community
// ---------------------------------------------------------------------------

export const reframedPitch: { paragraphs: string[]; confidence: Confidence } = {
  paragraphs: [
    "Headwaters builds the operating system for a small northern community store, end-to-end: the freight rigging, the POS configuration, the procurement dashboard a council can read, the household-level pricing the membership can check, and the back-office (bookkeeping, payroll, CRA) that keeps it all in compliance. The store itself is the band's. The infrastructure that runs it ships in a box, comes pre-tuned to the corridor the community already uses, and is staffed locally from day one — Headwaters' people are not flown in to live there.",
    "What the community gets in year one: a working store on a corridor that already moves food (Thunder Bay → Sioux Lookout → Dryden, plus a winter-road or air-freight lane to the reserve); a procurement dashboard that shows where every dollar went, and what was saved against the previous baseline; household-level pricing visible to members in their own portal; and a paid trial period for the local hire the council picks to operate the hub. What the community does not get: a consultant on retainer with no exit, a brand refresh, a deck for investors, or any service the community could already do for itself.",
    "What it costs: a Layer-1 software-only contract starts at $35,000/year and gives the council the dashboards, the POS configuration, and the back-office tooling. A full-stack engagement (recommended for a community standing up a store from scratch) is $90,000/month for twelve months, reviewed at month six, with a 35% reinvestment markup that funds the next reserve's install. Travel and freight pass through at cost — never marked up. The full pricing model, the cost basis line by line, and the year-one value-delivered audit template are public on the Practitioner Operating Plan one-pager — there is nothing about how the money moves that the council cannot see before signing.",
  ],
  confidence: {
    kind: "seed",
    needs:
      "Three paragraphs were drafted from the Deer Lake one-pager's vocabulary. Has never been read cold by anyone outside Headwaters. Needs: walk it past one tribal-council procurement officer (or economic-development director) and note the read in `docs/partnerships/<org>.md` — what they understood, what they tripped on, what they asked next. Flip to confirmed only after at least one such read is on file.",
  },
};

// ---------------------------------------------------------------------------
// 3 · Outreach concentric circles
// ---------------------------------------------------------------------------

export type OutreachCircle = {
  id: "warm" | "warm-mid" | "mid" | "cold-mid" | "cold";
  label: string;
  description: string;
};

export const outreachCircles: OutreachCircle[] = [
  {
    id: "warm",
    label: "Circle 1 · Warm — IFNA cluster",
    description:
      "Independent First Nations Alliance member communities (already adjacent to the corridor; warmest first call because the freight, the language, and the operating context are already shared).",
  },
  {
    id: "warm-mid",
    label: "Circle 2 · Warm-mid — neighbouring tribal councils",
    description:
      "Shibogama, Windigo, Keewaytinook Okimakanak — tribal councils whose member communities sit on the same supply corridor, with established economic-development arms that take cold calls professionally.",
  },
  {
    id: "mid",
    label: "Circle 3 · Mid — NAN economic development",
    description:
      "Nishnawbe Aski Nation's economic-development apparatus and the regional development corporations that work alongside it — slower-moving but the right venue for a corridor-wide store-in-a-box conversation.",
  },
  {
    id: "cold-mid",
    label: "Circle 4 · Cold-mid — SLFNHA / Sioux Lookout-area bands",
    description:
      "Sioux Lookout First Nations Health Authority and the bands clustered around Sioux Lookout — health-authority lens on procurement and food access opens a different door than the economic-development one.",
  },
  {
    id: "cold",
    label: "Circle 5 · Cold — Treaty 3 / Dryden-area",
    description:
      "Treaty 3 communities and the Dryden-area First Nations not on the IFNA / NAN axis. Coldest call but geographically closest to the existing hub, which is its own argument once a real conversation opens.",
  },
];

export type OutreachTarget = {
  /** Rank within the full 1..N list, warmest first. */
  rank: number;
  circle: OutreachCircle["id"];
  /** Org / cluster name as it would appear on a contact list. */
  name: string;
  /** Why this org specifically — one line. */
  whyThem: string;
  /** What angle to lead the first call with — one line. */
  leadWith: string;
  confidence: Confidence;
};

export const outreachTargets: OutreachTarget[] = [
  {
    rank: 1,
    circle: "warm",
    name: "Independent First Nations Alliance (IFNA) cluster — opening call",
    whyThem:
      "Member communities sit on the same Thunder Bay → Sioux Lookout → Dryden corridor that already moves food for Deer Lake; the operational template carries over with the smallest delta.",
    leadWith:
      "Same freight, same winter-road lane, same POS — different store, different council. 30 minutes to walk through the procurement dashboard and the price-visibility piece.",
    confidence: {
      kind: "seed",
      needs:
        "No `docs/partnerships/ifna.md` yet. Needs: name of the current ED or corporate-services lead, last touch date (any), and a one-line read on whether the cluster's economic-development arm is the right entry point or whether to go directly to a single member band's council. Without that, this is a generic 'IFNA is warm' line.",
    },
  },
  {
    rank: 2,
    circle: "warm",
    name: "IFNA member community — second-store candidate",
    whyThem:
      "If a single IFNA community is closer to standing up a store than the cluster's economic-development arm is, lead with that community's council directly rather than through the alliance.",
    leadWith:
      "What you'd be inheriting if you said yes: a store that already works one corridor over. Here's the year-one value-delivered audit from that store.",
    confidence: {
      kind: "seed",
      needs:
        "Currently a placeholder ('whichever IFNA member is closest to a store'). Needs the specific community name (and council contact) the practitioner would call first if going band-direct rather than alliance-direct. Drop into `docs/partnerships/ifna.md` under a 'second-store candidate' subhead, or into a per-community file.",
    },
  },
  {
    rank: 3,
    circle: "warm-mid",
    name: "Shibogama First Nations Council",
    whyThem:
      "Established economic-development capacity; member communities along the same airline corridor (Wasaya / Bearskin) the cross-reserve corridor pricing is already wired for.",
    leadWith:
      "Cross-reserve corridor pricing is public and pass-through — nothing marked up on the freight. Here's what the year-one sticker looks like for a community on your member list.",
    confidence: {
      kind: "seed",
      needs:
        "No `docs/partnerships/shibogama.md` yet. Needs: ED / economic-development lead's name, current strategic priorities (so 'corridor pricing' lands as their issue, not ours), and any prior contact between Headwaters and Shibogama. The 'whyThem' is structurally true; the call won't happen without a named person to call.",
    },
  },
  {
    rank: 4,
    circle: "warm-mid",
    name: "Windigo First Nations Council",
    whyThem:
      "Member communities span the Sioux Lookout / Pickle Lake catchment — multi-community engagement is realistic, which makes the store-in-a-box template land more cleanly than a single bilateral.",
    leadWith:
      "One install, then the next — the same software, the same POS, the same back-office. The second community pays an install fee, not a software-rebuild fee.",
    confidence: {
      kind: "seed",
      needs:
        "No `docs/partnerships/windigo.md` yet. Needs: contact for the economic-development arm, plus a read on whether 'multi-community' is a current Windigo priority or an outsider's projection. The pitch reframes Windigo's structure as a feature; if it isn't actually how Windigo operates, the lead-with line backfires.",
    },
  },
  {
    rank: 5,
    circle: "warm-mid",
    name: "Keewaytinook Okimakanak (KO) Tribal Council",
    whyThem:
      "Long-standing operational sophistication (KO Telehealth, KORI, K-Net) means the council recognizes infrastructure-as-public-good language out of the box; the procurement dashboard and the data-room argument land on a sympathetic ear.",
    leadWith:
      "You already operate community infrastructure at scale. Here is the procurement and price-visibility layer the store would inherit; KORI's data hygiene is the closest analogue.",
    confidence: {
      kind: "seed",
      needs:
        "No `docs/partnerships/keewaytinook-okimakanak.md` yet. Needs: contact at KO economic development (not K-Net / KORI directly — wrong door), plus confirmation that food-systems work is currently in their portfolio rather than telehealth/connectivity-only. The KORI analogy works only if the KO contact actually thinks of it that way.",
    },
  },
  {
    rank: 6,
    circle: "mid",
    name: "Nishnawbe Aski Nation (NAN) — Economic Development",
    whyThem:
      "Regional umbrella; the right venue for a corridor-wide pitch (rather than a single-band one) and the right place to surface a co-pitched grant application with multiple member communities.",
    leadWith:
      "Not pitching a single store — pitching a corridor template that the next community on your list inherits with a 12-week install and a one-time travel pass-through. Here's the receiving-band cost sheet.",
    confidence: {
      kind: "seed",
      needs:
        "No `docs/partnerships/nan-economic-development.md` yet. Needs: NAN economic-development director name, current corridor-scale priorities for NAN (the 'corridor template' framing has to match what NAN is already trying to fund), and any prior submission/application Headwaters has on file with NAN. Without a named director and a corridor priority on record, this is a polite cold-call to a regional umbrella.",
    },
  },
  {
    rank: 7,
    circle: "cold-mid",
    name: "Sioux Lookout First Nations Health Authority (SLFNHA)",
    whyThem:
      "Health-authority lens on food access and procurement — different door, same building. SLFNHA's catchment overlaps the IFNA / NAN territories already on the list, which means a yes here unlocks introductions, not just one pilot.",
    leadWith:
      "Procurement transparency for food access — what the council and the membership can see about what the store buys and from whom. The store is the vehicle; the dashboard is the deliverable.",
    confidence: {
      kind: "seed",
      needs:
        "No `docs/partnerships/slfnha.md` yet. Needs: a contact in SLFNHA's food-security or population-health portfolio (the 'health authority lens' only opens if pitched into the right portfolio — Approaches & Wholistic Health vs. clinical services is the key distinction), and any current SLFNHA initiative on food procurement to anchor the pitch to.",
    },
  },
  {
    rank: 8,
    circle: "cold-mid",
    name: "Sioux Lookout-area bands (off the IFNA / NAN axis)",
    whyThem:
      "Geographic proximity to Dryden hub means freight and travel pass-throughs are minimized — sharpest cost story on the corridor, even with a colder relationship at the start.",
    leadWith:
      "Cheapest install on the corridor, because the freight is already coming through Dryden weekly. Here is the receiving-band cost sheet with travel pass-throughs filled in for your community.",
    confidence: {
      kind: "seed",
      needs:
        "Currently a category, not a target. Needs: actual community names (with council contacts) — Lac Seul, Wabigoon, Eagle Lake, etc. — and a yes/no on whether each is already in the IFNA/NAN axis (and so already covered above). Drop into per-community files in `docs/partnerships/` so this circle resolves to specific calls, not a category.",
    },
  },
  {
    rank: 9,
    circle: "cold",
    name: "Treaty 3 — Grand Council secretariat",
    whyThem:
      "Coldest call on the list but geographically closest to Dryden; if the grand council can route the introduction to a member community already considering a store, the cold-call latency disappears.",
    leadWith:
      "We're already operating on the corridor. If any Treaty 3 member is in the early stages of a store conversation, here's a 15-minute briefing and a year-one cost sheet.",
    confidence: {
      kind: "seed",
      needs:
        "No `docs/partnerships/treaty-3.md` yet. Needs: Grand Council secretariat contact (Kenora-based), and a read on whether routing-to-member is a service the secretariat actually does for outside service providers, or whether the door has to open community-by-community. The 'route the introduction' angle assumes a function that may not exist.",
    },
  },
  {
    rank: 10,
    circle: "cold",
    name: "Dryden-area First Nations not on the IFNA / NAN axis",
    whyThem:
      "Closest to the hub physically; off the existing relationship maps. The right place to test whether the store-in-a-box pitch reads cold to a council that has not been in the corridor's prior conversations.",
    leadWith:
      "Local. The freight already moves past you weekly. Here's what a council pack would look like before you decide whether to say yes to a scoping call.",
    confidence: {
      kind: "seed",
      needs:
        "Same as rank 8 — currently a category. Needs: named communities (Wabauskang, Wabigoon Lake Ojibway, Eagle Lake, etc., minus any that turn out to be on the IFNA/NAN axis) with council contacts. The cold-call argument only works if there's a real community to call.",
    },
  },
];

// ---------------------------------------------------------------------------
// 4 · The 807 work split — grant-shaped vs co-pitch vs revenue-only
// ---------------------------------------------------------------------------

export type WorkSplitBucketId = "grant-shaped" | "co-pitch" | "revenue-only";

export type WorkSplitBucket = {
  id: WorkSplitBucketId;
  label: string;
  description: string;
};

export const workSplitBuckets: WorkSplitBucket[] = [
  {
    id: "grant-shaped",
    label: "Grant-shaped",
    description:
      "Workstreams whose natural funding mechanism is a grant — community infrastructure, capacity-building, food-systems work that funders already underwrite. Plan B routes the runway through these.",
  },
  {
    id: "co-pitch",
    label: "Co-pitch with a band",
    description:
      "Workstreams that need a band partner as proponent for the funding to make sense — the band signs the application, Headwaters is the service partner. Plan B sequences these once outreach has produced one warm partner.",
  },
  {
    id: "revenue-only",
    label: "Revenue-only",
    description:
      "Workstreams that have to pay their own way through earned revenue (subscriptions, sales, licensing). Plan B does not slow these down to chase grants for them — the grant overhead would eat the margin.",
  },
];

export type WorkSplitItem = {
  name: string;
  bucket: WorkSplitBucketId;
  /** Why it sits in this bucket — one sentence. */
  rationale: string;
  /** Path to the artifact that hosts this work, if one exists in the monorepo. */
  artifactPath?: string;
  /**
   * If `artifactPath` points at a separate artifact (different preview
   * path), set this true so the page renders an absolute URL rather
   * than a wouter `<Link>` (wouter would treat it as an in-app route).
   */
  external?: boolean;
  confidence: Confidence;
};

export const workSplitItems: WorkSplitItem[] = [
  // Grant-shaped
  {
    name: "807 Co-op infrastructure (Z3)",
    bucket: "grant-shaped",
    rationale:
      "Cold storage, hub equipment, distribution rigging — the asset class LFIF and ICBF were built for. The multi-tenant seam means a grant here funds a template, not a one-off.",
    artifactPath: "/headwaters-books/standby",
    external: true,
    confidence: {
      kind: "seed",
      needs:
        "Bucket is structurally right (LFIF/ICBF underwrite this asset class). Needs: confirmation from the co-op board that they're willing to be the proponent on a follow-on application, and which of LFIF or ICBF gets first attempt. Note in `docs/partnerships/807-coop.md`.",
    },
  },
  {
    name: "Food Hub on Wheels",
    bucket: "grant-shaped",
    rationale:
      "Mobile aggregation / distribution layer — fits LFIF and FedNor CEDP envelopes; the equipment is depreciable and the operating story is community-economic-development standard.",
    confidence: {
      kind: "seed",
      needs:
        "Bucket assignment is the executor's read. Needs: confirmation that Food Hub on Wheels is currently active (vs. backlogged behind Pilot #1) and whether the equipment lives with Headwaters or with a band partner — the latter would push it into co-pitch instead.",
    },
  },
  {
    name: "Jar recycling loop",
    bucket: "grant-shaped",
    rationale:
      "Circular-economy and waste-diversion programs at the federal and Northern-Ontario level both fund this shape of project; it ties into the food-systems story without competing with the store revenue line.",
    confidence: {
      kind: "seed",
      needs:
        "Bucket is plausible but the program names are not nailed (which Northern-Ontario waste-diversion stream specifically?). Needs: practitioner read on whether jar recycling is grant-shaped now or a deferred experiment, plus the actual program name if pursuing.",
    },
  },
  {
    name: "Workshops & training cohorts",
    bucket: "grant-shaped",
    rationale:
      "Wage-subsidy and capacity-building grants (NOHFC People & Talent, federal training streams) cover this directly; not a revenue line for Headwaters and shouldn't be re-imagined as one.",
    confidence: {
      kind: "seed",
      needs:
        "Bucket is right; the warning ('shouldn't be re-imagined as a revenue line') is the executor's editorial. Needs: practitioner sign-off that the workshops aren't currently being scoped as paid (which would flip the bucket to revenue-only).",
    },
  },

  // Co-pitch with a band
  {
    name: "Cross-reserve corridor template",
    bucket: "co-pitch",
    rationale:
      "Funding the corridor as community-economic infrastructure requires a band as proponent — Headwaters signs as service partner. The template's economics make the strongest case once at least one band is co-applicant.",
    artifactPath: "/practitioner-operating-plan/lease-tooling",
    external: true,
    confidence: {
      kind: "seed",
      needs:
        "Bucket is correct in principle. Needs: which band is the realistic first co-pitch proponent (ties back to §3 outreach — circles 1–2 are the pool) and whether any prior conversations have surfaced co-pitch interest. Note the candidate in `docs/partnerships/<band>.md`.",
    },
  },
  {
    name: "The Standby (Z3 constellation-wide primitive)",
    bucket: "co-pitch",
    rationale:
      "Disaster-preparedness and community-resilience funders only sign with a band or co-op as proponent. The vocabulary is built; the application has to come through a community of record.",
    artifactPath: "/headwaters-books/standby",
    external: true,
    confidence: {
      kind: "seed",
      needs:
        "Bucket is right. Needs: which funder envelope specifically (federal disaster prep? PEP-style provincial? Indigenous-specific resilience funds?), and whether the 807 Co-op or another band is the natural proponent. Without the funder named, the application doesn't have a calendar.",
    },
  },
  {
    name: "Constellation manifest (cross-zone naming infrastructure)",
    bucket: "co-pitch",
    rationale:
      "Open-knowledge / Indigenous-data-governance grants exist for exactly this shape of work, but they require a community partner — the constellation only reads as legitimate infrastructure when a band signs alongside.",
    artifactPath: "/codetry-handbook",
    external: true,
    confidence: {
      kind: "seed",
      needs:
        "Bucket is plausible. Needs: an actual funder candidate in the Indigenous-data-governance space (NRC's IPK? OCAP-aligned program?) and a read on whether the constellation work is grant-ready now or still a research artifact. If still research, the bucket may be 'no funding sought yet' rather than co-pitch.",
    },
  },

  // Revenue-only
  {
    name: "Wordpile",
    bucket: "revenue-only",
    rationale:
      "Consumer / classroom tool — the right funding model is subscription / licensing revenue. Grant overhead would eat the margin on a small-ticket SaaS.",
    artifactPath: "/wordpile",
    external: true,
    confidence: {
      kind: "seed",
      needs:
        "Bucket is the executor's structural read. Needs: practitioner confirmation that Wordpile is staying solo-revenue rather than being repackaged as a classroom-licensed product (which could open EdTech grant doors). Quick yes/no in `docs/partnerships/wordpile.md` or the Wordpile artifact's own notes.",
    },
  },
  {
    name: "Headwaters Books",
    bucket: "revenue-only",
    rationale:
      "Bookkeeping front-end with a Clerk-gated ledger surface — pays its way through agency engagements. Treating it as grant-shaped would distort the product roadmap.",
    artifactPath: "/headwaters-books",
    external: true,
    confidence: {
      kind: "seed",
      needs:
        "Bucket is the executor's read. Needs: practitioner sign-off that Books stays a paid-engagement tool rather than being offered as community infrastructure (which would shift the bucket). The 'distort the roadmap' line is opinion until confirmed.",
    },
  },
  {
    name: "Northern Food Systems Research Library",
    bucket: "revenue-only",
    rationale:
      "Tokenized contributor share-links and the curator workflow can be sold as a service to other regional food-systems networks; grant funding would slow the product loop down without improving the deliverable.",
    artifactPath: "/library",
    external: true,
    confidence: {
      kind: "seed",
      needs:
        "Bucket assignment is debatable — research libraries are a classic grant target (federal NFS, Indigenous Food Sovereignty Initiative). Needs: practitioner read on whether the library is being commercialized (revenue-only) or community-infrastructure (grant-shaped or co-pitch). This may be the most mis-bucketed item in §4.",
    },
  },
  {
    name: "Codetry Practitioner's Handbook",
    bucket: "revenue-only",
    rationale:
      "Reader / handbook surface — earns through consulting engagements that reference it and through licensing the practice. Grant funding doesn't fit a handbook.",
    artifactPath: "/codetry-handbook",
    external: true,
    confidence: {
      kind: "seed",
      needs:
        "Bucket is plausible. Needs: practitioner sign-off that the handbook is consulting-leverage (not a stand-alone product) and that translation work (the Oji-Cree pass) is funded out of consulting margin rather than treated as a separate grant-shaped translation project.",
    },
  },
];

// ---------------------------------------------------------------------------
// 6 · Runway & decision dates timeline
// (paired with §1 trigger conditions — same dates, paired with the
// concrete action the practitioner takes on each)
// ---------------------------------------------------------------------------

export type TimelineMilestone = {
  /** Date in plain English — ISO-style preferred where known. */
  date: string;
  /** Short label for the milestone. */
  label: string;
  /** What the practitioner does on this date. */
  action: string;
  /** Optional pointer to the trigger this milestone pairs with. */
  triggerLabel?: string;
  confidence: Confidence;
};

export const timelineMilestones: TimelineMilestone[] = [
  {
    date: "2026-05-30",
    label: "Bridge-capital go/no-go",
    action:
      "Confirm bridge ($181k recommended scenario) is committed in writing. If not, drop to Scenario A floor and start Plan B outreach in parallel — do not wait for Deer Lake.",
    triggerLabel: "Bridge capital does not land",
    confidence: {
      kind: "seed",
      needs:
        "Mirror of §1 trigger 'Bridge capital does not land' — same date, same dependency on the bridge funder being named. Flip both together once `docs/partnerships/bridge-financier.md` exists.",
    },
  },
  {
    date: "2026-06-15",
    label: "Soft Deer Lake decision date",
    action:
      "If no signed contract and no concrete next council date by today, send the 'pivoting capacity' note and begin outreach batch 1 to the IFNA cluster (§3 ranks 1–2) the same week.",
    triggerLabel: "Stall past the soft decision date",
    confidence: {
      kind: "seed",
      needs:
        "Mirror of §1 trigger 'Stall past the soft decision date' — same source-of-truth gap. Confirm the date in `docs/partnerships/deer-lake.md` against the actual council calendar and flip both together.",
    },
  },
  {
    date: "2026-06-30",
    label: "LFIF follow-on submission",
    action:
      "Submit the Local Food Infrastructure Fund follow-on for the 807 Co-op infrastructure layer (§5, slot 1). Independent of the Deer Lake outcome — the application stands on its own.",
    confidence: {
      kind: "seed",
      needs:
        "2026-06-30 is the executor's pencil date. Needs: actual LFIF intake calendar for 2026 (the most recent round may have closed or shifted), confirmation that the 807 Co-op board agrees to be on the application, and any feedback from the prior LFIF submission to incorporate. Pull the calendar into `docs/partnerships/funders.md` (LFIF section).",
    },
  },
  {
    date: "2026-07-15",
    label: "Outreach batch 2",
    action:
      "Schedule first calls with Shibogama / Windigo / KO (§3 ranks 3–5). One call per week; same scoping pitch each time so the comparison stays apples-to-apples.",
    confidence: {
      kind: "seed",
      needs:
        "Date is a placeholder ('two weeks after the soft Deer Lake decision'). Needs: confirmed contacts for the three tribal councils (see §3 ranks 3–5 seed reasons) — without those, this milestone is a calendar entry without a phone number to dial.",
    },
  },
  {
    date: "2026-07-31",
    label: "Hard Deer Lake decision date",
    action:
      "Treat Deer Lake as paused (not killed). Move all team capacity onto Plan B. Schedule the first NAN economic-development call (§3 rank 6) and submit the FedNor CEDP application (§5, slot 2).",
    triggerLabel: "Stall past the hard decision date",
    confidence: {
      kind: "seed",
      needs:
        "Mirror of §1 trigger 'Stall past the hard decision date' — same dependency on practitioner confirmation that 2026-07-31 is the actual walk-away point. Also depends on §3 rank 6 (NAN contact) being named for the action to be executable.",
    },
  },
  {
    date: "2026-08-30",
    label: "Plan B outreach review",
    action:
      "Two-warm / one-mid review: how many circles 1–3 produced a real scoping call? If zero, escalate to circles 4–5 (§3 ranks 7–10) and book a call with Co-operatives First about the second-co-op fork.",
    confidence: {
      kind: "seed",
      needs:
        "The 'two-warm / one-mid' threshold is the executor's read of a reasonable Plan-B-is-working bar. Needs: practitioner-confirmed success criterion (one signed scoping engagement? two? a verbal yes from any council?) and a Co-operatives First contact name to make the escalation step real.",
    },
  },
  {
    date: "2026-09-30",
    label: "Q3 close — pilot #2 candidate named",
    action:
      "By the Q3 weekly close-out, the candidate-reserve scoring sheet (separate task) names a single Pilot #2 candidate from the §3 outreach. If still unnamed, the runway model is re-cut and the team is sized to floor.",
    confidence: {
      kind: "seed",
      needs:
        "Depends on the candidate-reserve scoring sheet existing (separate task #485-adjacent — see project task list). Once that sheet is built, this milestone can flip to confirmed because the gating is mechanical (sheet exists → scoring possible by Q3).",
    },
  },
];

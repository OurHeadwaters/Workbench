/**
 * Why Northern Stores Fail — shared failure-modes catalog.
 *
 * Single source of truth used by:
 *   - the Research Library synthesis page
 *   - the Deer Lake Store deck "Why current stores fail" slides
 *
 * Each failure mode has:
 *   - id            (stable kebab-case identifier)
 *   - shortName     (one-or-two-word label)
 *   - title         (1-line headline)
 *   - theme         (one of the four groupings)
 *   - summary       (one-liner)
 *   - evidence      (longer paragraph, what the research actually says)
 *   - figures       (headline numbers with labels)
 *   - sources       (library entries + upstream references)
 *
 * Each source has:
 *   - libraryFilename  (matches `originalFilename` on a row in `library_entries`)
 *   - libraryTitle     (display title used as a fallback if the entry isn't found)
 *   - upstream         (optional: the academic / government source the entry cites)
 */

export type FailureModeTheme =
  | "market-structure"
  | "supply-chain"
  | "operations"
  | "producer-financing";

export interface FailureModeFigure {
  /** The number itself, formatted for display (e.g. "$1.6M / yr"). */
  value: string;
  /** What the number is — short label shown under the value. */
  label: string;
}

export interface FailureModeSource {
  /**
   * The `originalFilename` value of a library entry on disk in `attached_assets/`.
   * The library page resolves this to a real entry id and links to /entries/:id.
   * Use null for upstream-only references that aren't surfaced as their own
   * library entries (e.g. the Northern Food Strategy is cited inside other
   * documents, not held as its own file).
   */
  libraryFilename: string | null;
  /** Display title — used in the "Sources:" footer line and as fallback. */
  libraryTitle: string;
  /** Optional upstream academic / government reference embedded inside the entry. */
  upstream?: string;
}

/**
 * The set of "voices" a phenomenon can be named in. Each voice is one of the
 * industries / vantage points that has its own vocabulary for the same
 * underlying thing. Kept fixed and small so the drift map is comparable across
 * failure modes — and so an absence in any column is visible.
 */
export type FailureModeVoice =
  | "community"
  | "federal"
  | "logistics"
  | "academic"
  | "distributor"
  | "producer"
  | "retailer";

export interface FailureModeVoiceMeta {
  id: FailureModeVoice;
  /** Short label rendered in the drift-map row, e.g. "Federal program". */
  label: string;
  /** One-line plain-language description of this voice. */
  description: string;
}

export const FAILURE_MODE_VOICES: FailureModeVoiceMeta[] = [
  {
    id: "community",
    label: "Community",
    description: "What people in Deer Lake (and other fly-in towns) actually call it.",
  },
  {
    id: "federal",
    label: "Federal program",
    description:
      "What program auditors at NNC, ESDC, CFIA, or Statistics Canada call it.",
  },
  {
    id: "logistics",
    label: "Logistics / freight",
    description: "What carriers and dispatchers call it on the corridor.",
  },
  {
    id: "academic",
    label: "Academic",
    description:
      "What feasibility studies, value-chain researchers, and co-op scholars call it.",
  },
  {
    id: "distributor",
    label: "Distributor",
    description: "What aggregators and wholesalers call it on the order side.",
  },
  {
    id: "producer",
    label: "Producer",
    description: "What small farms, harvesters, and makers call it.",
  },
  {
    id: "retailer",
    label: "Retailer",
    description: "What chain-grocery operators call it inside the trade.",
  },
];

/**
 * One row of a failure mode's drift map: the noun a single voice uses for the
 * phenomenon. `name === null` is a first-class value meaning "no name yet" —
 * an absence we want visible, not hidden.
 */
export interface FailureModeName {
  voice: FailureModeVoice;
  /** The noun this voice uses, or null if no name exists in the source material. */
  name: string | null;
  /** Optional 0-based index into the failure mode's `sources` array. */
  sourceRef?: number;
}

export interface FailureMode {
  id: string;
  shortName: string;
  title: string;
  theme: FailureModeTheme;
  /**
   * Plain-language one-liner. Short sentences, common words, no insider
   * jargon — written so a Deer Lake band-council reader can hear it once
   * and follow it. Both the deck and the library catalog view render this.
   * The longer `evidence` field below keeps the research voice for citation
   * footers; this field is the spoken-voice version.
   */
  summary: string;
  /**
   * One-line consequence sentence in the deck's "action + result" shape:
   * the `shortName` is the headline (what's happening); `shortResult` is
   * the result line (so what does that mean). Used by the Deer Lake deck's
   * Why-Stores-Fail slides where every other body card on the deck is
   * roughly one to two lines. The Research Library does NOT render this
   * field — it keeps using the longer `summary` + `evidence` pair.
   */
  shortResult: string;
  evidence: string;
  figures: FailureModeFigure[];
  sources: FailureModeSource[];
  /**
   * Drift map: the noun each industry voice uses for this same phenomenon.
   * One entry per voice in `FAILURE_MODE_VOICES`. Voices where no name exists
   * in the cited source material are present with `name: null` so the absence
   * is visible — both blanks ("no community name", "no industry name") are
   * findings in their own right.
   */
  names: FailureModeName[];
}

export interface FailureModeThemeMeta {
  id: FailureModeTheme;
  label: string;
  /** Plain-language summary of why this group of failure modes matters together. */
  description: string;
  /** Slide section number used in the Deer Lake deck (e.g. "01a", "01b", "01c"). */
  slideSectionLabel: string;
  /** Slide accent headline used as the slide's title. */
  slideHeadline: string;
  /** Slide italic / accent suffix to the headline. */
  slideHeadlineAccent: string;
}

export const FAILURE_MODE_THEMES: FailureModeThemeMeta[] = [
  {
    id: "market-structure",
    label: "Market structure & ownership",
    description:
      "Who owns the store, who decides what's on the shelf, and where the money goes after the sale.",
    slideSectionLabel: "01a",
    slideHeadline: "Why current stores fail —",
    slideHeadlineAccent: "market structure & ownership.",
  },
  {
    id: "supply-chain",
    label: "Supply chain & logistics",
    description:
      "How food actually gets to the community — and where the route, the truck, or the cold-chain breaks.",
    slideSectionLabel: "01b",
    slideHeadline: "Why current stores fail —",
    slideHeadlineAccent: "supply chain & operations.",
  },
  {
    id: "operations",
    label: "Operational economics",
    description:
      "Day-to-day store economics: staffing, shrink, basket size, and the processing infrastructure the north doesn't have.",
    slideSectionLabel: "01b",
    slideHeadline: "Why current stores fail —",
    slideHeadlineAccent: "supply chain & operations.",
  },
  {
    id: "producer-financing",
    label: "Producer & financing side",
    description:
      "What stops small producers and resilient value chains from forming in the first place.",
    slideSectionLabel: "01c",
    slideHeadline: "Why current stores fail —",
    slideHeadlineAccent: "producer & financing side.",
  },
];

export const FAILURE_MODES: FailureMode[] = [
  // ────────────────────────────────────────────────────────────────────
  // Market structure & ownership
  // ────────────────────────────────────────────────────────────────────
  {
    id: "one-store-monopoly",
    shortName: "Only one store in town",
    title: "Most fly-in towns have only one grocery store",
    theme: "market-structure",
    summary:
      "Most fly-in towns in Ontario have only one grocery store — the most of any province. With no other store nearby, that one store can set whatever price, hours, and shelf it likes.",
    shortResult:
      "87% of Ontario fly-in towns have one store. So that store sets the price, the hours, and the shelf with no challenge.",
    evidence:
      "Across Ontario's fly-in First Nations, 87% of communities are served by a single grocery operator — overwhelmingly the North West Company's Northern Store or a Northern-supplied co-op. Without a competing store, families have no fallback when prices climb, fresh stock runs out, or the shelf mix drifts away from what they actually eat. This is the structural problem every other failure mode below sits on top of: in a one-store town, the operator never has to compete on price, freshness, or trust.",
    figures: [
      { value: "87%", label: "Ontario fly-in communities with only one store" },
    ],
    sources: [
      {
        libraryFilename: "FINALPilotResearchReportDucharmeNelson_1777036795393.pdf",
        libraryTitle: "Final Pilot Research Report — Ducharme & Nelson",
        upstream: "Ontario First Nations grocery-access survey",
      },
      {
        libraryFilename:
          "Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034364227.txt",
        libraryTitle: "Building a NWO Food Hub Network — project overview",
      },
    ],
    names: [
      { voice: "community", name: "the store" },
      { voice: "federal", name: "single-eligible-retailer community", sourceRef: 0 },
      { voice: "logistics", name: null },
      { voice: "academic", name: "monopoly retail concentration", sourceRef: 0 },
      { voice: "distributor", name: null },
      { voice: "producer", name: null },
      { voice: "retailer", name: "captive market" },
    ],
  },
  {
    id: "subsidy-capture",
    shortName: "Most of the help money stays with the store",
    title: "Most of the federal grocery help money never reaches the shelf",
    theme: "market-structure",
    summary:
      "Ottawa pays the store to keep food prices down. In one-store towns, only 58¢ of each dollar reaches the shelf. The store keeps the other 42¢. With a second, community-owned store, that climbs to 84¢.",
    shortResult:
      "Today only 58¢ of every Nutrition North dollar reaches the shelf. Add a second community-owned store and pass-through climbs to 84¢.",
    evidence:
      "Nutrition North Canada is paid directly to retailers, not households, on the assumption that retailers will pass it through as lower shelf prices. In practice, in single-store communities the pass-through rate sits around 58¢ on the dollar — with the remaining 42¢ absorbed by the retailer as margin. The North West Company, which operates the dominant Northern Store chain, receives more than half of the total $144.8M annual federal Nutrition North spend. There is no public per-store accounting, so families cannot see what was subsidised or by how much. Adding a second, community-owned store has been shown to push pass-through up to roughly 84¢ on the dollar — about 26¢ more per dollar reaching the shelf — because the dominant operator now has to compete.",
    figures: [
      { value: "58¢", label: "Of every $1 of federal grocery help that reaches the shelf today" },
      { value: "84¢", label: "Pass-through once a second community-owned store exists" },
      { value: "$144.8M", label: "Annual federal grocery help budget" },
      { value: ">50%", label: "Of that budget captured by North West Co. alone" },
    ],
    sources: [
      {
        libraryFilename: "FINALPilotResearchReportDucharmeNelson_1777036795393.pdf",
        libraryTitle: "Final Pilot Research Report — Ducharme & Nelson",
        upstream: "Federal grocery help program data; AANDC retailer reports",
      },
      {
        libraryFilename:
          "Pasted-Local-Food-Infrastructure-Fund-Final-Project-Report-Com_1777035717477.txt",
        libraryTitle: "LFIF — Final Project Report",
      },
    ],
    names: [
      { voice: "community", name: null },
      { voice: "federal", name: "retailer pass-through gap", sourceRef: 0 },
      { voice: "logistics", name: null },
      { voice: "academic", name: "subsidy incidence", sourceRef: 0 },
      { voice: "distributor", name: null },
      { voice: "producer", name: null },
      { voice: "retailer", name: "margin retention" },
    ],
  },
  {
    id: "capital-leakage",
    shortName: "Money leaves the community",
    title: "The store is owned outside, and the money leaves with it",
    theme: "market-structure",
    summary:
      "About $1.6M leaves Deer Lake on groceries every year. Some goes to the current store's outside owners. Some pays for fly-out trips to Winnipeg. None of it stays in town.",
    shortResult:
      "About $1.6M of grocery spend leaves Deer Lake every year. Owned outside, the profit and the payroll fly south.",
    evidence:
      "Existing northern stores are owned and capitalised from outside the community: profit, payroll for non-local managers, and management fees all flow south. For Deer Lake specifically, an estimated $1.6M of grocery spending leaves the community each year — split between the existing store's owners and Winnipeg trips families take to escape monopoly pricing. USDA and Sustain Ontario local-food multiplier studies put the local recirculation effect of community-owned food retail at 1.4–2.6×: every dollar that stays inside the community generates an additional 40¢–$1.60 of local activity. The community-side critique is plainer: people describe the existing operator as feeling 'more like a Walmart — different clientele' than a local store.",
    figures: [
      { value: "~$1.6M / yr", label: "Deer Lake grocery $ leaving the community" },
      { value: "1.4–2.6×", label: "Local-food multiplier for community-owned retail" },
    ],
    sources: [
      {
        libraryFilename: "FINALPilotResearchReportDucharmeNelson_1777036795393.pdf",
        libraryTitle: "Final Pilot Research Report — Ducharme & Nelson",
        upstream: "Sustain Ontario / Temiskaming local-food multiplier study; USDA local-food intermediary studies",
      },
      {
        libraryFilename:
          "Pasted-Local-Food-Infrastructure-Fund-Final-Project-Report-Com_1777035717477.txt",
        libraryTitle: "LFIF — Final Project Report",
      },
    ],
    names: [
      { voice: "community", name: "money flying south" },
      { voice: "federal", name: null },
      { voice: "logistics", name: null },
      { voice: "academic", name: "local-food multiplier leakage", sourceRef: 0 },
      { voice: "distributor", name: null },
      { voice: "producer", name: null },
      { voice: "retailer", name: "intercompany remittance" },
    ],
  },
  {
    id: "no-community-equity",
    shortName: "The community has no say",
    title: "The community doesn't own the store and has no say in how it runs",
    theme: "market-structure",
    summary:
      "The town does not own the store. Nobody from here sits on its board. People here have no say in prices, hours, or what gets stocked. A community-owned co-op fixes that.",
    shortResult:
      "No board seats for residents. So nobody here decides on prices, hours, or what's on the shelf — a multi-stakeholder co-op flips that.",
    evidence:
      "In a conventional outside-owned store, the community cannot vote on pricing, hiring, sourcing, or which producers get shelf space — there is no governance body that includes residents. The Multi-stakeholder Co-operative bylaw guidelines on file describe what's missing: a board structure with seats reserved for shopper-members, worker-members, and producer-members, so decisions about hours, mix, and reinvestment happen with the community in the room. Arctic Co-operatives Ltd's 32 northern stores and Mistissini's Meechum store (serving a Cree community of ~4,000 people) both run on this multi-stakeholder co-op model — proof the structure works at northern scale.",
    figures: [
      { value: "32", label: "Community-owned stores Arctic Co-operatives Ltd already runs" },
      { value: "~4,000", label: "People served by Mistissini's Meechum co-op" },
    ],
    sources: [
      {
        libraryFilename:
          "Pasted-Guidelines-and-Sample-Bylaw-Language-for-Multi-stakehol_1777035050884.txt",
        libraryTitle: "Multi-stakeholder co-op — bylaw guidelines & sample language",
      },
      {
        libraryFilename: "Towards_a_Feasible_Cooperative_1777036795401.pdf",
        libraryTitle: "Towards a Feasible Cooperative",
      },
      {
        libraryFilename:
          "Pasted--Business-Plan-807-Food-Co-op-Inc-Dryden-ON-January-202_1777034303575.txt",
        libraryTitle: "Business Plan — Dryden corridor food co-op",
      },
    ],
    names: [
      { voice: "community", name: "no say in the store" },
      { voice: "federal", name: null },
      { voice: "logistics", name: null },
      { voice: "academic", name: "absence of multi-stakeholder governance", sourceRef: 1 },
      { voice: "distributor", name: null },
      { voice: "producer", name: "no producer-member seat", sourceRef: 0 },
      { voice: "retailer", name: "outside-owned banner store" },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // Supply chain & logistics
  // ────────────────────────────────────────────────────────────────────
  {
    id: "distribution-cost-per-km",
    shortName: "Every kilometre costs more up here",
    title: "Every kilometre costs more up here than a southern budget expects",
    theme: "supply-chain",
    summary:
      "By law, one driver can only drive 13 hours a day. Fridge trucks up north cost much more per mile than down south. Every kilometre costs more than a southern spreadsheet expects.",
    shortResult:
      "One driver, 13 hours a day. Long northern legs force overnight stops, so refrigerated freight costs more per mile than a southern budget expects.",
    evidence:
      "The Supply Chain Resilience Analysis on file works the cost-per-mile and driver-hours math for Northwestern Ontario freight: federal hours-of-service rules (Transport Canada / FMCSA-aligned) cap a single driver at 13 hours of driving in a 14-hour duty window, which forces overnight stops on long northern legs. Combined with low backhaul fill rates, refrigerated cost per loaded mile in the region runs materially higher than the southern Ontario corridor — and that delta lands directly in the shelf price. A store that doesn't internalise the math ends up under-pricing freight, then squeezing it back out of fresh-produce shrink and overtime.",
    figures: [
      { value: "13 h / day", label: "Single-driver hours-of-service ceiling" },
      { value: "14 h", label: "Maximum on-duty window per driver per day" },
    ],
    sources: [
      {
        libraryFilename:
          "Pasted-Supply-Chain-Resilience-Analysis-Overview-Key-Outcomes-_1777034738054.txt",
        libraryTitle: "Supply Chain Resilience Analysis — overview & key outcomes",
        upstream: "Transport Canada hours-of-service regulations",
      },
      {
        libraryFilename: "Supply_Chain_Resilience_Analysis_Overview__1777039682790.docx",
        libraryTitle: "Supply Chain Resilience Analysis (overview)",
      },
      {
        libraryFilename: "ERB_Distribution_1777039307114.docx",
        libraryTitle: "Erb Distribution — 2023 reference",
      },
    ],
    names: [
      { voice: "community", name: null },
      { voice: "federal", name: "hours-of-service ceiling", sourceRef: 0 },
      { voice: "logistics", name: "long northern leg", sourceRef: 0 },
      { voice: "academic", name: "high cost-per-loaded-mile", sourceRef: 0 },
      { voice: "distributor", name: "cold-chain freight premium", sourceRef: 2 },
      { voice: "producer", name: null },
      { voice: "retailer", name: "freight burden in landed cost" },
    ],
  },
  {
    id: "single-trailer-fragility",
    shortName: "One truck. One breakdown empties the shelf.",
    title: "One refrigerated truck — one breakdown empties the shelf",
    theme: "supply-chain",
    summary:
      "Right now one refrigerated trailer carries the town's fresh food. If it breaks down, the produce aisle stays empty for a week. There is no backup truck.",
    shortResult:
      "One reefer carries the week's fresh food. Lose it once and the produce aisle stays empty for a week — no backup on the corridor.",
    evidence:
      "The LFIF (Local Food Infrastructure Fund) Final Project Report and the Erb Group cold-chain notes describe the current model: a single 11×7 refrigerated trailer running fresh inbound on the corridor, with no second reefer to fall back on. One mechanical failure, one driver illness, or one weather event removes the entire week's fresh delivery. Cold-chain gaps then cascade: produce that does arrive has used its window in transit and shrinks fast on the shelf. The Deer Lake plan explicitly addresses this by running two trucks on different schedules so a single breakdown can't stop everything.",
    figures: [
      { value: "1 reefer", label: "Trailer the corridor currently depends on" },
      { value: "11×7", label: "Trailer footprint specified in the LFIF pilot" },
    ],
    sources: [
      {
        libraryFilename:
          "Pasted-Local-Food-Infrastructure-Fund-Final-Project-Report-Com_1777035717477.txt",
        libraryTitle: "LFIF — Final Project Report",
      },
      {
        libraryFilename: "ERB_Distribution_1777039307114.docx",
        libraryTitle: "Erb Distribution — 2023 reference",
      },
      {
        libraryFilename:
          "Pasted-Supply-Chain-Resilience-Analysis-Overview-Key-Outcomes-_1777034738054.txt",
        libraryTitle: "Supply Chain Resilience Analysis — overview & key outcomes",
      },
    ],
    names: [
      { voice: "community", name: "the produce truck didn't come" },
      { voice: "federal", name: null },
      { voice: "logistics", name: "single-asset corridor", sourceRef: 0 },
      { voice: "academic", name: "single point of failure", sourceRef: 2 },
      { voice: "distributor", name: "single-reefer dependency", sourceRef: 1 },
      { voice: "producer", name: null },
      { voice: "retailer", name: "no redundant inbound lane" },
    ],
  },
  {
    id: "no-backhaul",
    shortName: "Trucks come back empty, so every load costs more",
    title: "Trucks come up full and go back empty, which lifts the shelf price",
    theme: "supply-chain",
    summary:
      "Trucks come up full and go back empty. The store has to pay for the empty drive home, which lifts the shelf price.",
    shortResult:
      "Backhaul fill rate is 0%. So the loaded trip pays for the empty return — and the shelf price absorbs both directions.",
    evidence:
      "The Food Flow Feasibility Study and the NFDN (Northern Fresh Distribution Network) round-table notes both flag the same problem: there is no aggregator coordinating southbound freight, so reefers leave the community empty. Every loaded mile northbound therefore has to absorb both the inbound and the empty-return cost, which inflates the per-case landed cost on the shelf. A shared aggregation layer — picking up local fish, value-added product, or even regional cross-haul on the way back — would cut effective freight cost without changing a single truck or driver. Wallace Center's values-based supply chain work names this 'soft infrastructure' as one of the missing attributes of resilient value chains.",
    figures: [
      { value: "0%", label: "Backhaul fill rate on the current corridor" },
    ],
    sources: [
      {
        libraryFilename: "Food_Flow_Feas_Study_Final_NOT_FOR_CIRC_1777039682790.pdf",
        libraryTitle: "Food Flow Feasibility Study (NOT FOR CIRCULATION)",
      },
      {
        libraryFilename:
          "Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034479412.txt",
        libraryTitle: "NWO Food Hub Network — project narrative (revised)",
        upstream: "Wallace Center, Values-Based Supply Chains framework",
      },
    ],
    names: [
      { voice: "community", name: null },
      { voice: "federal", name: null },
      { voice: "logistics", name: "deadhead miles", sourceRef: 0 },
      { voice: "academic", name: "asymmetric freight flow", sourceRef: 1 },
      { voice: "distributor", name: "0% backhaul fill", sourceRef: 0 },
      { voice: "producer", name: "no southbound aggregation", sourceRef: 1 },
      { voice: "retailer", name: "round-trip cost on inbound" },
    ],
  },
  {
    id: "soft-infrastructure-gap",
    shortName: "Nobody is coordinating the trucks",
    title: "Local trucks and cold storage exist, but nobody is coordinating them",
    theme: "supply-chain",
    summary:
      "Local dairies, co-ops, and small aggregators already have trucks and cold storage sitting half-used. What's missing is one person tying them together so a northern store can use all of them.",
    shortResult:
      "Trucks, dairies, and aggregators sit half-used in the region. With no coordinator tying them together, a new store defaults to one big-box distributor.",
    evidence:
      "Wallace Center's Values-Based Supply Chains framework names five attributes of resilient regional value chains; one of the most consistently missing in the north is the 'soft infrastructure' — the aggregator/coordinator role that connects existing physical assets together. The Northern Food Strategy and the Forge / Fledge regional gap assessments echo this: the trucks, the dairies, the kitchens, and the aggregators all exist in Northwestern Ontario, but they aren't coordinated into a single supply lane any individual store can rely on. Lock City Dairies already runs reefer freight across the region; the Dryden corridor co-op and Superior Seasons already aggregate small producers. A new northern store today has to negotiate each of those relationships separately — most don't, and default to a single big-box distributor instead.",
    figures: [],
    sources: [
      {
        libraryFilename: "Report_from_Lock_City_Dairies_Inc._1777036795402.xlsx",
        libraryTitle: "Lock City Dairies — report",
      },
      {
        libraryFilename:
          "Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034364227.txt",
        libraryTitle: "Building a NWO Food Hub Network — project overview",
        upstream:
          "Wallace Center Values-Based Supply Chains; Northern Food Strategy; Forge / Fledge regional gap assessments",
      },
      {
        libraryFilename:
          "Pasted--Business-Plan-807-Food-Co-op-Inc-Dryden-ON-January-202_1777034303575.txt",
        libraryTitle: "Business Plan — Dryden corridor food co-op",
      },
    ],
    names: [
      { voice: "community", name: null },
      { voice: "federal", name: null },
      { voice: "logistics", name: "uncoordinated regional assets", sourceRef: 1 },
      { voice: "academic", name: "missing soft infrastructure", sourceRef: 1 },
      { voice: "distributor", name: "no aggregator layer", sourceRef: 2 },
      { voice: "producer", name: "no value-chain coordinator", sourceRef: 1 },
      { voice: "retailer", name: "default to single distributor" },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // Operational economics
  // ────────────────────────────────────────────────────────────────────
  {
    id: "thin-staffing-single-driver",
    shortName: "One driver. No backup.",
    title: "One driver and a three-person crew — no backup if anyone is out",
    theme: "operations",
    summary:
      "The nearest co-op runs the route with three people and one driver. If anyone is sick, or the road closes, the delivery is missed. There is no backup.",
    shortResult:
      "Three people, one driver running the corridor. Anyone sick or off the road and the delivery is missed — no second crew to absorb it.",
    evidence:
      "The Dryden corridor co-op's business plan documents the operating reality on the existing northern corridor: a 3-person team running aggregation, retail, and the truck. Hours-of-service rules cap the single driver at 13 hours of driving per day, so any disruption (illness, weather, mechanical) instantly becomes a missed delivery. Conventional northern stores stack the same risk — a fly-in community with one store, one operator, and one inbound lane has no built-in redundancy. The Deer Lake plan explicitly mitigates this by joining a family-run refrigerated route already running the corridor and adding a second truck on a separate schedule, so no single absence stops the store.",
    figures: [
      { value: "3", label: "Person team running the corridor co-op's operation" },
      { value: "13 h / day", label: "Hours-of-service ceiling per driver" },
    ],
    sources: [
      {
        libraryFilename:
          "Pasted--Business-Plan-807-Food-Co-op-Inc-Dryden-ON-January-202_1777034303575.txt",
        libraryTitle: "Business Plan — Dryden corridor food co-op",
      },
      {
        libraryFilename:
          "Pasted-Supply-Chain-Resilience-Analysis-Overview-Key-Outcomes-_1777034738054.txt",
        libraryTitle: "Supply Chain Resilience Analysis — overview & key outcomes",
        upstream: "Transport Canada hours-of-service regulations",
      },
    ],
    names: [
      { voice: "community", name: "if the driver is sick" },
      { voice: "federal", name: "single-driver hours-of-service ceiling", sourceRef: 1 },
      { voice: "logistics", name: "no relief driver", sourceRef: 0 },
      { voice: "academic", name: "operational fragility" },
      { voice: "distributor", name: null },
      { voice: "producer", name: null },
      { voice: "retailer", name: "no backup crew" },
    ],
  },
  {
    id: "shrink-and-stockouts",
    shortName: "Food spoils. Shelves go empty.",
    title: "The order cycle doesn't match the road or the plane, so food spoils and shelves go empty",
    theme: "operations",
    summary:
      "Down south, stores re-order food almost every day. Up here, the road or the plane only comes every week or two. So stores over-order, things spoil, and then the shelves go bare.",
    shortResult:
      "Reorder logic assumes daily delivery. Up here, road or plane comes weekly. So stores over-order, food spoils, then the shelf runs bare mid-month.",
    evidence:
      "The Food Flow Feasibility Study and the LFIF pilot note that shrink and stock-outs in northern stores are not principally a quality problem with the produce — they are a cadence problem with the order cycle. Standard southern reorder logic assumes near-daily replenishment, which doesn't exist on a winter-road or air-freight schedule. The result is over-ordering ahead of a road closure (driving spoilage), then long mid-month stock-outs of perishables. Deer Lake's plan addresses this with a curated, fly-in-cadence-aware shelf mix and a two-lane supply chain (winter-road truck + air freight) so the cycle and the route match.",
    figures: [],
    sources: [
      {
        libraryFilename: "Food_Flow_Feas_Study_Final_NOT_FOR_CIRC_1777039682790.pdf",
        libraryTitle: "Food Flow Feasibility Study (NOT FOR CIRCULATION)",
      },
      {
        libraryFilename:
          "Pasted-Local-Food-Infrastructure-Fund-Final-Project-Report-Com_1777035717477.txt",
        libraryTitle: "LFIF — Final Project Report",
      },
      {
        libraryFilename: "ENGLISH_Distributor_Guide_(2)_1777039787270.pdf",
        libraryTitle: "Distributor Guide (English)",
      },
    ],
    names: [
      { voice: "community", name: "the shelf goes bare" },
      { voice: "federal", name: null },
      { voice: "logistics", name: "winter-road order cadence", sourceRef: 1 },
      { voice: "academic", name: "order-cycle / route mismatch", sourceRef: 0 },
      { voice: "distributor", name: "over-order then spoilage", sourceRef: 2 },
      { voice: "producer", name: null },
      { voice: "retailer", name: "shrink and stock-outs" },
    ],
  },
  {
    id: "cost-of-living-gap",
    shortName: "Food up here costs much more",
    title: "Food up here costs almost twice what it does down south",
    theme: "operations",
    summary:
      "Feeding a family of four costs about $1,680 a month here. The same food is $1,000 down south. Families buy less, so the store says 'we can't drop prices, our volume is too low.'",
    shortResult:
      "Family of four: $1,680/mo up here vs $1,000/mo down south. Smaller baskets justify fatter margins, which locks the high price in.",
    evidence:
      "Feeding a family of four runs about $1,680/month in fly-in northern Ontario, compared with about $1,000/month for the same basket in southern Ontario — a ~$680/month gap. Households respond rationally: smaller baskets, more single-item trips, more substitution to shelf-stable / processed items, and — when they can — a fly-out trip to Winnipeg every few months. From the operator's seat, the resulting low average basket and high product churn become the justification for keeping margins fat ('we can't afford to discount, our volume is too low'), which then locks in the high prices that suppressed the basket in the first place. A community-owned model breaks the loop because the surplus comes back to the same households.",
    figures: [
      { value: "$1,680 / mo", label: "Family-of-four grocery cost in fly-in north" },
      { value: "$1,000 / mo", label: "Same basket in southern Ontario" },
      { value: "$680 / mo", label: "The structural gap, per household" },
    ],
    sources: [
      {
        libraryFilename: "FINALPilotResearchReportDucharmeNelson_1777036795393.pdf",
        libraryTitle: "Final Pilot Research Report — Ducharme & Nelson",
        upstream: "Statistics Canada Northern Food Basket; Nutrition North price reports",
      },
      {
        libraryFilename: "GrowingLocalFoodLiteracy-Tipsheet_1777040118385.pdf",
        libraryTitle: "Growing Local Food Literacy — Tipsheet",
      },
    ],
    names: [
      { voice: "community", name: "the price up here" },
      { voice: "federal", name: "Northern Food Basket gap", sourceRef: 0 },
      { voice: "logistics", name: null },
      { voice: "academic", name: "cost-of-living differential", sourceRef: 0 },
      { voice: "distributor", name: null },
      { voice: "producer", name: null },
      { voice: "retailer", name: "low average basket size" },
    ],
  },
  {
    id: "haccp-processing-gap",
    shortName: "No certified place to cut and pack local food",
    title: "No certified plant to cut, cook, or pack local food in the region",
    theme: "operations",
    summary:
      "There is no certified food-processing plant in the region. So anything packaged or pre-made has to be made down south and trucked back up. Local food never makes it onto the shelf.",
    shortResult:
      "No HACCP plant in the region. So anything packaged or pre-made gets processed down south and trucked back up — local product never reaches the shelf.",
    evidence:
      "The HACCP Business Case Report (June 2023 draft) makes the structural argument: without HACCP-certified processing infrastructure inside Northwestern Ontario, any value-added or shelf-stable product — fish, meat, baked goods, prepared meals — has to be processed in southern facilities and trucked back in. That permanently locks in import dependence, kills the local-producer route to wholesale shelves, and pushes northern stores toward national-brand processed inventory. The same gap is why a northern store's frozen aisle, even when 'local' product is in season, ends up stocked with southern-processed equivalents.",
    figures: [],
    sources: [
      {
        libraryFilename:
          "2023_06_02_DRAFT_OUTLINE_OF_HACCP_BUSINESS_CASE_REPORT_1777036795370.pdf",
        libraryTitle: "HACCP Business Case Report (Draft Outline, 2023-06-02)",
        upstream: "Canadian Food Inspection Agency HACCP framework",
      },
      {
        libraryFilename: "Eat_the_Fish__1777039787271.docx",
        libraryTitle: "Eat the Fish — initiative notes",
      },
    ],
    names: [
      { voice: "community", name: null },
      { voice: "federal", name: "no HACCP-certified facility", sourceRef: 0 },
      { voice: "logistics", name: null },
      { voice: "academic", name: "processing infrastructure gap", sourceRef: 0 },
      { voice: "distributor", name: null },
      { voice: "producer", name: "no certified cut-and-pack floor", sourceRef: 1 },
      { voice: "retailer", name: "import-only frozen aisle" },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // Producer & financing side
  // ────────────────────────────────────────────────────────────────────
  {
    id: "producers-blocked-from-wholesale",
    shortName: "Small farms and harvesters can't sell to the store",
    title: "Small farms and harvesters can't supply enough on their own to get on the shelf",
    theme: "producer-financing",
    summary:
      "One small farmer or harvester can't supply the steady volume a big store needs. Without someone to gather their goods together, they never get a chance on the shelf.",
    shortResult:
      "One small farmer can't supply the volume a store needs each week. With no aggregator to gather them together, regional product never reaches the shelf.",
    evidence:
      "The NWO Food Hub Network proposal and Sustain Ontario's value-chain work both make the same observation: a small producer can grow excellent product and still never get onto an institutional or chain-grocery shelf, because the buyer needs one truck, one invoice, one liability cover, and a consistent weekly volume that's larger than any single producer can supply. The aggregator layer — picking up from a dozen small producers, consolidating, and presenting a single sell-sheet — is what unlocks shelf space. Existing northern stores buy from national distributors specifically because that aggregator role doesn't exist locally; building it (which the Dryden corridor co-op and Superior Seasons partially already do) is what would let regional product compete.",
    figures: [],
    sources: [
      {
        libraryFilename:
          "Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034364227.txt",
        libraryTitle: "Building a NWO Food Hub Network — project overview",
        upstream: "Sustain Ontario, value-chain coordinator briefs",
      },
      {
        libraryFilename:
          "Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034479412.txt",
        libraryTitle: "NWO Food Hub Network — project narrative (revised)",
      },
      {
        libraryFilename: "Onbaording_New_Suppliers_1777039787269.docx",
        libraryTitle: "Onboarding New Suppliers",
      },
    ],
    names: [
      { voice: "community", name: null },
      { voice: "federal", name: null },
      { voice: "logistics", name: null },
      { voice: "academic", name: "missing aggregator layer", sourceRef: 0 },
      { voice: "distributor", name: "below minimum order quantity", sourceRef: 2 },
      { voice: "producer", name: "shut out of wholesale", sourceRef: 0 },
      { voice: "retailer", name: "one truck, one invoice rule", sourceRef: 0 },
    ],
  },
  {
    id: "capital-access-gap",
    shortName: "Small producers can't get a loan",
    title: "Small producers can't get the slow, low-cost loans they need to grow",
    theme: "producer-financing",
    summary:
      "Small producers need slow, low-cost loans to grow. Banks call the north too risky. Grants pay for buildings, not for day-to-day cash. So the money never reaches them.",
    shortResult:
      "Banks call the north too risky. Grants cover buildings, not day-to-day cash. So the patient capital producers actually need never lands.",
    evidence:
      "Wallace Center's Values-Based Supply Chains framework names five attributes of resilient regional value chains; on northern food systems, the attribute most consistently missing is patient, mission-aligned capital — both for producers (cold storage, processing equipment, working capital for seasonal builds) and for the coordinator/aggregator layer that connects them to retail. Conventional commercial lenders price the north's risk premium too high, federal grants cover capex but not the working capital to keep a producer running between sales, and there's no community-rooted intermediary that bridges the two. The Towards a Feasible Cooperative analysis on file works the same problem from the co-op governance side: a multi-stakeholder co-op can hold and recycle capital inside the community in a way an outside-owned store structurally cannot.",
    figures: [
      { value: "5", label: "Wallace Center attributes of a resilient value chain" },
      { value: "1 missing", label: "Patient, mission-aligned capital — most absent in the north" },
    ],
    sources: [
      {
        libraryFilename:
          "Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034479412.txt",
        libraryTitle: "NWO Food Hub Network — project narrative (revised)",
        upstream: "Wallace Center, Values-Based Supply Chains framework (5 attributes)",
      },
      {
        libraryFilename: "Towards_a_Feasible_Cooperative_1777036795401.pdf",
        libraryTitle: "Towards a Feasible Cooperative",
      },
      {
        libraryFilename:
          "Pasted-Local-Food-Infrastructure-Fund-Final-Project-Report-Com_1777035717477.txt",
        libraryTitle: "LFIF — Final Project Report",
      },
    ],
    names: [
      { voice: "community", name: "the bank says no" },
      { voice: "federal", name: "capex-only program coverage", sourceRef: 2 },
      { voice: "logistics", name: null },
      { voice: "academic", name: "patient-capital gap", sourceRef: 0 },
      { voice: "distributor", name: null },
      { voice: "producer", name: "no working-capital line", sourceRef: 1 },
      { voice: "retailer", name: null },
    ],
  },
  {
    id: "people-trap",
    shortName: "Managers paid a cut of sales — so growth doesn't stay here",
    title: "When managers get paid a cut of sales, growth feeds them, not the town",
    theme: "producer-financing",
    summary:
      "When managers get paid a cut of the store's revenue, growth feeds them, not the town. Deer Lake instead pays a fixed monthly fee with a clear cap, so more money stays here.",
    shortResult:
      "Revenue-share contracts feed the operator, not the town. Deer Lake reverses it: a fixed $69.7k/mo cost basis with a capped 35% reinvestment line.",
    evidence:
      "The practitioner operating plan deck on file identifies a recurring failure mode it calls 'PeopleTrap': compensation arrangements based on a percentage of contract revenue (rather than a defined cost-basis with a capped, transparent reinvestment line) silently consume any operating surplus. Applied to a northern store, this shows up as commission-style vendor-management contracts and revenue-share manager agreements that make growth in store revenue feel good for the operator but leave nothing to reinvest in shelf price, inventory depth, or local hiring. The Deer Lake plan deliberately reverses this: the operations & technology partner is paid a defined $69.7k/mo cost basis with a capped 35% reinvestment line — so when the store does better, more dollars stay in the community rather than the operator's percentage.",
    figures: [
      { value: "$69.7k / mo", label: "Defined cost basis (Deer Lake reversal)" },
      { value: "35%", label: "Capped reinvestment line — visible to community" },
    ],
    sources: [
      {
        libraryFilename: null,
        libraryTitle: "Practitioner Operating Plan — PeopleTrap analysis",
        upstream: "Practitioner Operating Plan deck (this project)",
      },
      {
        libraryFilename: "Towards_a_Feasible_Cooperative_1777036795401.pdf",
        libraryTitle: "Towards a Feasible Cooperative",
      },
      {
        libraryFilename:
          "Pasted-Guidelines-and-Sample-Bylaw-Language-for-Multi-stakehol_1777035050884.txt",
        libraryTitle: "Multi-stakeholder co-op — bylaw guidelines & sample language",
      },
    ],
    names: [
      { voice: "community", name: null },
      { voice: "federal", name: null },
      { voice: "logistics", name: null },
      { voice: "academic", name: "PeopleTrap (revenue-share capture)", sourceRef: 0 },
      { voice: "distributor", name: null },
      { voice: "producer", name: null },
      { voice: "retailer", name: "revenue-share management contract", sourceRef: 0 },
    ],
  },
];

// ────────────────────────────────────────────────────────────────────
// Cross-industry phenomena
// ────────────────────────────────────────────────────────────────────

/**
 * A `Phenomenon` is the structural object that sits *underneath* several
 * data points published by industries that don't talk to each other. The
 * 0% backhaul fill rate (Transport Canada), the 58¢-on-the-dollar subsidy
 * pass-through (federal program audit), the 1.4–2.6× local-food multiplier
 * (academic), the ~$1.6M/yr Deer Lake grocery leakage (community
 * economics), and the empty return legs on existing reefer routes
 * (distributor schedules) are five separate published findings — but they
 * are five views of one object: empty trucks going home with money that
 * should have stayed in Deer Lake.
 *
 * The phenomenon's canonical title is the *community* noun, because it's
 * the community who has been described from the outside and never given
 * the right to name what is happening to them.
 *
 * Each data point points at the failure mode + the specific source within
 * that failure mode where it lives, so the phenomena layer composes on
 * top of the existing drift-map data without duplicating it.
 */
export interface PhenomenonDataPoint {
  /** Which industry voice published this data point. */
  voice: FailureModeVoice;
  /** What that industry calls this thing in its own vocabulary. */
  industryName: string;
  /** The number or finding that voice publishes. */
  figure: FailureModeFigure;
  /** The failure mode + index into its `sources` array where this came from. */
  sourceRef: { failureModeId: string; sourceIndex: number };
}

export interface Phenomenon {
  id: string;
  /** The Deer Lake / community noun for this phenomenon — the canonical title. */
  communityName: string;
  /** Plain-language one-liner: what the phenomenon actually is. */
  summary: string;
  /**
   * One sentence explaining why nobody has noticed: each industry has
   * published its own data point in its own vocabulary, but no one has
   * linked them — so no one has named the underlying object.
   */
  unownedBecause: string;
  /** Side-by-side data points from each industry that describes the same thing. */
  dataPoints: PhenomenonDataPoint[];
  /** IDs of failure modes this phenomenon cuts across. */
  failureModeRefs: string[];
}

export const PHENOMENA: Phenomenon[] = [
  {
    id: "empty-truck-going-home",
    communityName: "the empty truck going home",
    summary:
      "Trucks come up loaded with our groceries, drop everything at the store, and roll back south empty. The money that should buy something on the way home — local fish, value-added product, payroll for someone here — leaves on that empty truck instead.",
    unownedBecause:
      "Transport Canada owns the backhaul number, federal grocery-help auditors own the pass-through number, academics own the local-multiplier number, and community economists own the leakage figure — none of those four desks talks to the other three, so no one has noticed they are five readings of the same empty trailer.",
    dataPoints: [
      {
        voice: "logistics",
        industryName: "deadhead miles / 0% backhaul fill",
        figure: { value: "0%", label: "Backhaul fill rate on the current corridor" },
        sourceRef: { failureModeId: "no-backhaul", sourceIndex: 0 },
      },
      {
        voice: "federal",
        industryName: "retailer pass-through gap",
        figure: { value: "58¢", label: "Of every $1 of grocery help that reaches the shelf" },
        sourceRef: { failureModeId: "subsidy-capture", sourceIndex: 0 },
      },
      {
        voice: "academic",
        industryName: "local-food multiplier leakage",
        figure: { value: "1.4–2.6×", label: "Local-food multiplier when retail is community-owned" },
        sourceRef: { failureModeId: "capital-leakage", sourceIndex: 0 },
      },
      {
        voice: "community",
        industryName: "money flying south",
        figure: { value: "~$1.6M / yr", label: "Deer Lake grocery $ leaving the community" },
        sourceRef: { failureModeId: "capital-leakage", sourceIndex: 0 },
      },
      {
        voice: "distributor",
        industryName: "no southbound aggregation",
        figure: { value: "1 direction", label: "Loaded north, empty south on existing reefer routes" },
        sourceRef: { failureModeId: "no-backhaul", sourceIndex: 1 },
      },
    ],
    failureModeRefs: ["no-backhaul", "subsidy-capture", "capital-leakage"],
  },
  {
    id: "shelf-goes-bare-when-road-closes",
    communityName: "when the road closes, the shelf goes bare",
    summary:
      "One refrigerated truck, one driver who can only legally drive 13 hours a day, one road in. When any of those three pieces is interrupted, the produce aisle empties — and stays empty for a week — because the order cycle was built for a southern store with daily deliveries.",
    unownedBecause:
      "Transport Canada owns the driver-hours rule, the federal infrastructure fund owns the single-trailer architecture, southern distributors own the reorder logic — and the community owns the empty shelf. Each piece is named by a different industry, so the cascade that produces the empty shelf has never been written down as one phenomenon.",
    dataPoints: [
      {
        voice: "federal",
        industryName: "hours-of-service ceiling",
        figure: { value: "13 h / day", label: "Single-driver legal driving ceiling" },
        sourceRef: { failureModeId: "distribution-cost-per-km", sourceIndex: 0 },
      },
      {
        voice: "logistics",
        industryName: "single-asset corridor",
        figure: { value: "1 reefer", label: "Trailer the corridor currently depends on" },
        sourceRef: { failureModeId: "single-trailer-fragility", sourceIndex: 0 },
      },
      {
        voice: "distributor",
        industryName: "winter-road order cadence mismatch",
        figure: { value: "1–2 wk", label: "Gap between deliveries on winter-road / air freight" },
        sourceRef: { failureModeId: "shrink-and-stockouts", sourceIndex: 2 },
      },
      {
        voice: "academic",
        industryName: "order-cycle / route mismatch",
        figure: { value: "over → bare", label: "Over-order ahead of closure, then mid-month stock-out" },
        sourceRef: { failureModeId: "shrink-and-stockouts", sourceIndex: 0 },
      },
      {
        voice: "community",
        industryName: "the produce truck didn't come",
        figure: { value: "1 wk", label: "How long the produce aisle stays empty after a missed run" },
        sourceRef: { failureModeId: "single-trailer-fragility", sourceIndex: 0 },
      },
    ],
    failureModeRefs: [
      "distribution-cost-per-km",
      "single-trailer-fragility",
      "shrink-and-stockouts",
    ],
  },
  {
    id: "pay-the-store-to-keep-us-captive",
    communityName: "we pay the store to keep us captive",
    summary:
      "There is one store. Federal money is paid to that store to lower prices, but the store keeps almost half of it. Families buy smaller baskets because prices are high, and the store points at those small baskets to justify keeping prices high. The federal cheque, the high price, and the small basket are the same loop — and the loop only stays closed because there is no second store.",
    unownedBecause:
      "Statistics Canada owns the Northern Food Basket number, the federal grocery-help program owns the pass-through audit, academic retail researchers own the monopoly-concentration figure, and Deer Lake households own the actual receipt at the till — but no published study has put the four numbers on the same page and shown them as one closed loop.",
    dataPoints: [
      {
        voice: "federal",
        industryName: "single-eligible-retailer community",
        figure: { value: "87%", label: "Ontario fly-in communities served by one store" },
        sourceRef: { failureModeId: "one-store-monopoly", sourceIndex: 0 },
      },
      {
        voice: "federal",
        industryName: "retailer pass-through gap",
        figure: { value: "58¢ → 84¢", label: "Pass-through today vs with a second community-owned store" },
        sourceRef: { failureModeId: "subsidy-capture", sourceIndex: 0 },
      },
      {
        voice: "federal",
        industryName: "Northern Food Basket gap",
        figure: { value: "$680 / mo", label: "Family-of-four grocery cost gap vs southern Ontario" },
        sourceRef: { failureModeId: "cost-of-living-gap", sourceIndex: 0 },
      },
      {
        voice: "academic",
        industryName: "monopoly retail concentration",
        figure: { value: ">50%", label: "Of federal grocery-help spend captured by a single chain" },
        sourceRef: { failureModeId: "subsidy-capture", sourceIndex: 0 },
      },
      {
        voice: "retailer",
        industryName: "low average basket size",
        figure: { value: "low → fat", label: "Small baskets used to justify keeping margins high" },
        sourceRef: { failureModeId: "cost-of-living-gap", sourceIndex: 0 },
      },
      {
        voice: "community",
        industryName: "the store",
        figure: { value: "1 store", label: "Number of options families have in town" },
        sourceRef: { failureModeId: "one-store-monopoly", sourceIndex: 0 },
      },
    ],
    failureModeRefs: ["one-store-monopoly", "subsidy-capture", "cost-of-living-gap"],
  },
];

/**
 * Resolve a phenomenon data point's `sourceRef` to the underlying failure
 * mode + library source. Returns null if the failure mode or source index
 * is missing — callers should treat that as a seed-data bug.
 */
export function resolvePhenomenonSource(
  dp: PhenomenonDataPoint,
  modes: FailureMode[] = FAILURE_MODES,
): { mode: FailureMode; source: FailureModeSource } | null {
  const mode = modes.find((m) => m.id === dp.sourceRef.failureModeId);
  if (!mode) return null;
  const source = mode.sources[dp.sourceRef.sourceIndex];
  if (!source) return null;
  return { mode, source };
}

/** Phenomena that cut across a given failure mode. */
export function phenomenaForFailureMode(
  failureModeId: string,
  phenomena: Phenomenon[] = PHENOMENA,
): Phenomenon[] {
  return phenomena.filter((p) => p.failureModeRefs.includes(failureModeId));
}

/** Failure modes that a phenomenon cuts across, in catalog order. */
export function failureModesForPhenomenon(
  phenomenon: Phenomenon,
  modes: FailureMode[] = FAILURE_MODES,
): FailureMode[] {
  const set = new Set(phenomenon.failureModeRefs);
  return modes.filter((m) => set.has(m.id));
}

/** Working counter-examples to balance the synthesis. */
export interface CounterExample {
  name: string;
  detail: string;
}

export const COUNTER_EXAMPLES: CounterExample[] = [
  {
    name: "Arctic Co-operatives Ltd.",
    detail:
      "Already operates 32 community-owned stores across the north on a multi-stakeholder co-op model.",
  },
  {
    name: "Mistissini Meechum",
    detail:
      "Cree-owned community store serving roughly 4,000 people — a working northern multi-stakeholder model.",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Reverse codetry test on the academic sources we cite
// ──────────────────────────────────────────────────────────────────────
//
// The codetry §4.2 rename test, run in reverse on a citation:
//   1. Take a passage as the academic / government source originally writes it.
//   2. Substitute the academic noun with the community noun.
//   3. Ask whether the recommendation still parses and what changes.
//
// Where the recommendation no longer parses, or where renaming surfaces an
// absent actor the academic frame had quietly assumed away, that drift is a
// finding back to the research community in its own right. This block holds
// the seed data; the /reverse-test page in the library renders it.

export interface ReverseSubstitution {
  /** The phrase as it appears in the original academic source. */
  academicNoun: string;
  /** The phrase a Deer Lake reader would actually use for the same thing. */
  communityNoun: string;
}

export interface ReverseTestSourceRef {
  /**
   * id of the FailureMode whose `sources` list cites this entry — gives the
   * reverse test a back-link into the catalog so a reader can see what the
   * source was originally invoked to support.
   */
  failureModeId: string;
  /**
   * `originalFilename` of a library entry on disk. The /reverse-test page
   * resolves this to a real library entry id and links to /entries/:id, so a
   * reader can verify the substitution against the underlying file.
   */
  libraryFilename: string | null;
  /** Display title — used in the source line and as fallback if no entry id. */
  libraryTitle: string;
  /** Optional upstream academic / government reference embedded in the entry. */
  upstream?: string;
}

export interface ReverseTest {
  /** Stable kebab-case identifier. */
  id: string;
  /**
   * Short headline framing the noun-swap, in the form
   * "'<academic phrase>' → '<community phrase>'".
   */
  title: string;
  /** Pointer back to the source being reverse-tested. */
  sourceRef: ReverseTestSourceRef;
  /** The passage in the academic source's own register. */
  originalPassage: string;
  /** The same passage with the community nouns substituted in. */
  renamedPassage: string;
  /**
   * Paragraph explaining what changes when you rename — does the
   * recommendation still parse, does an absent actor become obvious, does
   * a policy lever evaporate?
   */
  finding: string;
  /**
   * One-sentence version of the finding — surfaced in the scan-list at the
   * top of the page so all reverse tests are skimmable without opening each.
   */
  oneSentenceFinding: string;
  /** Word-pair substitutions that produced the renamed passage. */
  substitutions: ReverseSubstitution[];
}

export const REVERSE_TESTS: ReverseTest[] = [
  {
    id: "backhaul-asset-utilization",
    title:
      "“Asset utilization inefficiency in northern logistics corridors” → “the empty truck going home with our grocery money”",
    sourceRef: {
      failureModeId: "no-backhaul",
      libraryFilename:
        "Pasted-Supply-Chain-Resilience-Analysis-Overview-Key-Outcomes-_1777034738054.txt",
      libraryTitle: "Supply Chain Resilience Analysis — overview & key outcomes",
      upstream: "Transport Canada hours-of-service regulations",
    },
    originalPassage:
      "Asset utilization inefficiency in northern logistics corridors imposes elevated per-loaded-mile costs on inbound refrigerated freight. Optimization of backhaul fill rates through inter-modal coordination and third-party aggregation is identified as a primary lever for cost reduction across the regional food system.",
    renamedPassage:
      "The empty truck going home with our grocery money costs us more per case on the way up — the loaded trip has to pay for both directions. The fix is to put something on the truck for the ride back: fish, finished goods, anything. To make that happen on a regular schedule, somebody local has to be paid to call the producers and the truck operator every week.",
    finding:
      "Two things change when you swap the nouns. First, “inter-modal coordination” stops parsing. There is no rail or barge alternative on a fly-in corridor — “intermodal” is a southern Ontario word, and the recommendation literally does not apply here. The academic frame inherited the lever from a southern logistics literature it didn't bother to localise. Second, the absent actor becomes obvious: “third-party aggregation” is doing the work of hiding a person. The renamed passage forces a salary line into view — somebody, locally, paid, making the southbound calls every week. The original quietly assumed that role into existence.",
    oneSentenceFinding:
      "Renaming surfaces a recommendation that doesn't apply (“inter-modal coordination” has no referent on a fly-in corridor) and an absent actor the original assumed into existence (the person paid to make the southbound calls).",
    substitutions: [
      {
        academicNoun: "asset utilization inefficiency in northern logistics corridors",
        communityNoun: "the empty truck going home with our grocery money",
      },
      {
        academicNoun: "inter-modal coordination",
        communityNoun: "(no equivalent — there is no road or rail alternative)",
      },
      {
        academicNoun: "third-party aggregation",
        communityNoun: "one person, paid, to call the producers and the truck every week",
      },
    ],
  },
  {
    id: "subsidy-pass-through",
    title:
      "“Retailer pass-through optimization” → “how much of the help money actually reaches the shelf”",
    sourceRef: {
      failureModeId: "subsidy-capture",
      libraryFilename: "FINALPilotResearchReportDucharmeNelson_1777036795393.pdf",
      libraryTitle: "Final Pilot Research Report — Ducharme & Nelson",
      upstream: "Federal grocery help program data; AANDC retailer reports",
    },
    originalPassage:
      "Retailer pass-through of the Nutrition North Canada subsidy remains a key area for ongoing policy optimization. Enhanced retailer reporting requirements, audit transparency, and store-level disaggregation of subsidy receipt would strengthen program evaluation and accountability.",
    renamedPassage:
      "How much of the help money actually reaches the shelf is something the families paying for groceries cannot see today. In one-store towns, only 58¢ of each dollar makes it to the shelf — the store keeps the other 42¢. Better reports about the 42¢ would not change it. A second store would.",
    finding:
      "Renaming preserves the recommendation — “enhanced reporting and audit transparency” — but strips it of its claim to be a fix. Reporting describes the leak more clearly; it does not close it. The rename also surfaces the missing actor the original avoided naming: a competitor. With one store in town, the operator has no reason to pass the subsidy through, no matter how thoroughly the receipt is audited. The academic frame stays inside policy levers (reporting, audit, disaggregation) because the structural recommendation — “introduce a competing community-owned store” — sits outside what a federal program can hand out as a tool. The drift here isn't dishonesty; it's the genre forcing the recommendation toward what the program can do, not what would actually move the 42¢.",
    oneSentenceFinding:
      "Renaming surfaces the missing actor — a competing community-owned store — and shows the paper's audit-and-disclosure recommendations don't move the 42¢ that never reaches the shelf.",
    substitutions: [
      {
        academicNoun: "retailer pass-through optimization",
        communityNoun: "how much of the help money actually reaches the shelf",
      },
      {
        academicNoun: "enhanced retailer reporting requirements",
        communityNoun: "better reports about a 42¢ leak that nobody is making the store close",
      },
      {
        academicNoun: "program evaluation and accountability",
        communityNoun: "audits that confirm what families already know — the price is too high",
      },
    ],
  },
  {
    id: "soft-infrastructure-attribute",
    title:
      "“Soft infrastructure attribute of resilient value chains” → “one person, paid, to make the calls”",
    sourceRef: {
      failureModeId: "soft-infrastructure-gap",
      libraryFilename:
        "Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034364227.txt",
      libraryTitle: "Building a NWO Food Hub Network — project overview",
      upstream:
        "Wallace Center, Values-Based Supply Chains framework (5 attributes)",
    },
    originalPassage:
      "Resilient regional value chains exhibit five attributes; in Northwestern Ontario, the most consistently absent is the soft infrastructure layer performing aggregator-coordinator functions across producers, distributors, and retail outlets. Capacity-building investments targeting this attribute are recommended.",
    renamedPassage:
      "What the region's food chain is missing is one person, paid, whose job every week is to call the dairy in Sault Ste. Marie, the truck on the corridor, and the store in Deer Lake, and tie them together. Nobody is paid to do that today, so it doesn't get done.",
    finding:
      "The recommendation survives the rename — investing in this role really is the right answer — but the rename does the thing the framework quietly avoided: it names a salary. “Capacity-building investments targeting the soft infrastructure attribute” absorbs a person into a budget line, and budget lines get cut without anyone noticing the work has stopped. “One person, paid, to make the calls” makes the cut visible. It also forces the next question — paid by whom, on what cycle, when the founding grant runs out? — which the framework leaves to an unnamed funder. The academic noun was true; it was just expensive in what it left implicit.",
    oneSentenceFinding:
      "Renaming makes the salary visible — and forces the question the framework leaves unanswered: who pays the person to make the calls when the founding grant runs out?",
    substitutions: [
      {
        academicNoun: "soft infrastructure layer",
        communityNoun: "one person, paid, to make the calls",
      },
      {
        academicNoun: "aggregator-coordinator functions",
        communityNoun: "phoning the dairy, the truck, and the store every week",
      },
      {
        academicNoun: "capacity-building investments targeting this attribute",
        communityNoun:
          "a salary line for that one person, with a named funder past year one",
      },
    ],
  },
];

/** Convenience: failure modes grouped by theme, in display order. */
export function failureModesByTheme(): Record<FailureModeTheme, FailureMode[]> {
  const out: Record<FailureModeTheme, FailureMode[]> = {
    "market-structure": [],
    "supply-chain": [],
    operations: [],
    "producer-financing": [],
  };
  for (const mode of FAILURE_MODES) {
    out[mode.theme].push(mode);
  }
  return out;
}

/** Short, comma-joined list of source titles for a slide footer line. */
export function sourcesFooterLine(modes: FailureMode[]): string {
  const seen = new Set<string>();
  const titles: string[] = [];
  for (const mode of modes) {
    for (const src of mode.sources) {
      const label = shortSourceLabel(src);
      if (!seen.has(label)) {
        seen.add(label);
        titles.push(label);
      }
    }
  }
  return titles.join(" · ");
}

/**
 * True if this failure mode has no community-voice name in its drift map —
 * i.e. the phenomenon is one the community can't see or discuss in its own
 * vocabulary yet. Treated as a finding in its own right.
 */
export function isMissingCommunityName(mode: FailureMode): boolean {
  const row = mode.names.find((n) => n.voice === "community");
  return !row || row.name === null;
}

/**
 * True if this failure mode has no industry-voice name at all — i.e. every
 * non-community voice (federal, logistics, academic, distributor, producer,
 * retailer) is "no name yet". These are phenomena research has missed
 * entirely.
 */
export function isMissingIndustryName(mode: FailureMode): boolean {
  return mode.names
    .filter((n) => n.voice !== "community")
    .every((n) => n.name === null);
}

/** Two drift-gap totals computed across all failure modes. */
export function driftGapTotals(modes: FailureMode[] = FAILURE_MODES): {
  missingCommunityName: number;
  missingIndustryName: number;
  total: number;
} {
  return {
    missingCommunityName: modes.filter(isMissingCommunityName).length,
    missingIndustryName: modes.filter(isMissingIndustryName).length,
    total: modes.length,
  };
}

function shortSourceLabel(src: FailureModeSource): string {
  if (src.upstream) return src.upstream.split(",")[0]!.split(";")[0]!.trim();
  return src.libraryTitle
    .replace(/\s+\(.*?\)\s*$/, "")
    .replace(/^Pasted\s*[-—]\s*/i, "")
    .replace(/^Final Pilot Research Report\s*[-—]\s*/i, "Ducharme & Nelson pilot")
    .trim();
}

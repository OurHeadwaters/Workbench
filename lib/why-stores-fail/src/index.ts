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

export interface FailureMode {
  id: string;
  shortName: string;
  title: string;
  theme: FailureModeTheme;
  summary: string;
  evidence: string;
  figures: FailureModeFigure[];
  sources: FailureModeSource[];
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
    shortName: "One-store monopoly",
    title: "One-store monopoly in fly-in communities",
    theme: "market-structure",
    summary:
      "87% of Ontario fly-in communities have only one grocery store — the highest rate of any province. With no second store, prices, hours, and shelf mix all go uncontested.",
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
  },
  {
    id: "subsidy-capture",
    shortName: "Subsidy capture",
    title: "Nutrition North subsidy capture & opaque pass-through",
    theme: "market-structure",
    summary:
      "When there's only one store, just 58¢ of every Nutrition North dollar reaches the shelf — the other 42¢ stays with the operator. The North West Company alone takes more than half of the $144.8M federal Nutrition North budget each year.",
    evidence:
      "Nutrition North Canada is paid directly to retailers, not households, on the assumption that retailers will pass it through as lower shelf prices. In practice, in single-store communities the pass-through rate sits around 58¢ on the dollar — with the remaining 42¢ absorbed by the retailer as margin. The North West Company, which operates the dominant Northern Store chain, receives more than half of the total $144.8M annual federal Nutrition North spend. There is no public per-store accounting, so families cannot see what was subsidised or by how much. Adding a second, community-owned store has been shown to push pass-through up to roughly 84¢ on the dollar — about 26¢ more per dollar reaching the shelf — because the dominant operator now has to compete.",
    figures: [
      { value: "58¢", label: "Of every Nutrition North $1 that reaches the shelf today" },
      { value: "84¢", label: "Pass-through once a second community-owned store exists" },
      { value: "$144.8M", label: "Annual federal Nutrition North budget" },
      { value: ">50%", label: "Of that budget captured by North West Co. alone" },
    ],
    sources: [
      {
        libraryFilename: "FINALPilotResearchReportDucharmeNelson_1777036795393.pdf",
        libraryTitle: "Final Pilot Research Report — Ducharme & Nelson",
        upstream: "Nutrition North Canada program data; AANDC retailer reports",
      },
      {
        libraryFilename:
          "Pasted-Local-Food-Infrastructure-Fund-Final-Project-Report-Com_1777035717477.txt",
        libraryTitle: "LFIF — Final Project Report",
      },
    ],
  },
  {
    id: "capital-leakage",
    shortName: "Capital leakage",
    title: "Absentee ownership & capital leakage",
    theme: "market-structure",
    summary:
      "About $1.6M / year in grocery spending leaves Deer Lake — either banked by the current store's outside owners or spent on fly-out trips to Winnipeg. None of it recirculates locally. A community member's plain-language version of the same problem: 'more like a Walmart' than a community store.",
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
  },
  {
    id: "no-community-equity",
    shortName: "No community equity",
    title: "No community equity or governance voice",
    theme: "market-structure",
    summary:
      "The community has no ownership, no board seat, and no formal say in how the store is run. Multi-stakeholder co-op governance — the proven northern alternative — solves exactly this gap.",
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
        libraryTitle: "Business Plan — 807 Food Co-op Inc.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // Supply chain & logistics
  // ────────────────────────────────────────────────────────────────────
  {
    id: "distribution-cost-per-km",
    shortName: "Cost per km at northern scale",
    title: "Distribution cost per kilometre at northern scale",
    theme: "supply-chain",
    summary:
      "Federal hours-of-service rules cap a single-driver truck at 13 hours of driving per day, and refrigerated cost-per-mile in the north runs well above the southern Ontario benchmark. Every kilometre is more expensive than it looks on a southern spreadsheet.",
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
  },
  {
    id: "single-trailer-fragility",
    shortName: "Single-trailer fragility",
    title: "Single-mode / single-trailer fragility & cold-chain gaps",
    theme: "supply-chain",
    summary:
      "When the entire community's fresh food rides on one 11×7 reefer trailer (or one weekly air-freight slot), one breakdown empties the produce aisle for a week. The LFIF pilot and the Erb cold-chain references both make this risk explicit.",
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
  },
  {
    id: "no-backhaul",
    shortName: "No backhaul economics",
    title: "Empty trucks one way — no backhaul economics",
    theme: "supply-chain",
    summary:
      "Trucks run loaded north and empty south. With no return load, the entire round-trip cost has to be recovered from one direction, which inflates the inbound shelf price.",
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
  },
  {
    id: "soft-infrastructure-gap",
    shortName: "Soft infrastructure gap",
    title: "Underused regional infrastructure — the 'soft infrastructure' gap",
    theme: "supply-chain",
    summary:
      "Lock City Dairies, the 807 Food Co-op, and Superior Seasons already have trucks, cold storage, and producer relationships sitting partially idle. What's missing is the coordination layer that would let one northern store plug into all three at once.",
    evidence:
      "Wallace Center's Values-Based Supply Chains framework names five attributes of resilient regional value chains; one of the most consistently missing in the north is the 'soft infrastructure' — the aggregator/coordinator role that connects existing physical assets together. The Northern Food Strategy and the Forge / Fledge regional gap assessments echo this: the trucks, the dairies, the kitchens, and the aggregators all exist in Northwestern Ontario, but they aren't coordinated into a single supply lane any individual store can rely on. Lock City Dairies already runs reefer freight across the region; the 807 co-op and Superior Seasons already aggregate small producers. A new northern store today has to negotiate each of those relationships separately — most don't, and default to a single big-box distributor instead.",
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
        libraryTitle: "Business Plan — 807 Food Co-op Inc.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // Operational economics
  // ────────────────────────────────────────────────────────────────────
  {
    id: "thin-staffing-single-driver",
    shortName: "Thin staffing & single-driver risk",
    title: "Thin staffing and single-driver risk",
    theme: "operations",
    summary:
      "The 807 Food Co-op runs the existing Thunder Bay → Dryden lane with a 3-person team. One driver, one route, one hours-of-service ceiling — and no slack when someone is sick or the road closes.",
    evidence:
      "The 807 business plan documents the operating reality on the existing northern corridor: a 3-person team running aggregation, retail, and the truck. Hours-of-service rules cap the single driver at 13 hours of driving per day, so any disruption (illness, weather, mechanical) instantly becomes a missed delivery. Conventional northern stores stack the same risk — a fly-in community with one store, one operator, and one inbound lane has no built-in redundancy. The Deer Lake plan explicitly mitigates this with a second truck on a separate schedule and a rotational fly-in staffing model so no single absence stops the store.",
    figures: [
      { value: "3", label: "Person team running 807's existing operation" },
      { value: "13 h / day", label: "Hours-of-service ceiling per driver" },
    ],
    sources: [
      {
        libraryFilename:
          "Pasted--Business-Plan-807-Food-Co-op-Inc-Dryden-ON-January-202_1777034303575.txt",
        libraryTitle: "Business Plan — 807 Food Co-op Inc.",
      },
      {
        libraryFilename:
          "Pasted-Supply-Chain-Resilience-Analysis-Overview-Key-Outcomes-_1777034738054.txt",
        libraryTitle: "Supply Chain Resilience Analysis — overview & key outcomes",
        upstream: "Transport Canada hours-of-service regulations",
      },
    ],
  },
  {
    id: "shrink-and-stockouts",
    shortName: "Shrink & stock-outs",
    title: "Shrink, spoilage, and stock-outs from southern order cycles",
    theme: "operations",
    summary:
      "Conventional retail order cycles (daily / weekly southern cadence) collide with fly-in reality (one road window per fortnight; one weekly air-freight slot). The result is over-ordered shrink one week and bare shelves the next.",
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
  },
  {
    id: "cost-of-living-gap",
    shortName: "Cost-of-living gap",
    title: "Cost-of-living gap suppresses basket size",
    theme: "operations",
    summary:
      "Feeding a family of four costs about $1,680/month in fly-in northern Ontario versus about $1,000/month in southern Ontario. That gap structurally suppresses basket size, which then hides operator margin behind 'low volume.'",
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
  },
  {
    id: "haccp-processing-gap",
    shortName: "HACCP / processing gap",
    title: "HACCP & processing infrastructure gap",
    theme: "operations",
    summary:
      "Without HACCP-certified processing in the region, value-added and shelf-stable production has to happen south. That guarantees a steady inbound stream of imported processed food and forecloses a domestic alternative.",
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
  },

  // ────────────────────────────────────────────────────────────────────
  // Producer & financing side
  // ────────────────────────────────────────────────────────────────────
  {
    id: "producers-blocked-from-wholesale",
    shortName: "Producers blocked from wholesale",
    title: "Small producers blocked from institutional / wholesale buyers",
    theme: "producer-financing",
    summary:
      "Small producers can't meet the volume, packaging, and consolidated-invoice requirements of an institutional buyer alone. Without an aggregator, they never make it onto the shelf at all.",
    evidence:
      "The NWO Food Hub Network proposal and Sustain Ontario's value-chain work both make the same observation: a small producer can grow excellent product and still never get onto an institutional or chain-grocery shelf, because the buyer needs one truck, one invoice, one liability cover, and a consistent weekly volume that's larger than any single producer can supply. The aggregator layer — picking up from a dozen small producers, consolidating, and presenting a single sell-sheet — is what unlocks shelf space. Existing northern stores buy from national distributors specifically because that aggregator role doesn't exist locally; building it (which 807 and Superior Seasons partially already do) is what would let regional product compete.",
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
  },
  {
    id: "capital-access-gap",
    shortName: "Capital access gap",
    title: "Capital access gap — the missing 5th attribute",
    theme: "producer-financing",
    summary:
      "Wallace Center identifies five attributes of resilient values-based supply chains. The one consistently missing in the north is patient, mission-aligned capital — not because it doesn't exist, but because it's not routed to northern producers.",
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
  },
  {
    id: "people-trap",
    shortName: "PeopleTrap compensation",
    title: "%-on-contract compensation traps the reinvestment line",
    theme: "producer-financing",
    summary:
      "Paying managers, vendors, or store operators on a percentage of revenue (rather than a defined cost-basis + capped reinvestment) consumes the line item the community needs for reinvestment — the same structural failure the practitioner deck calls 'PeopleTrap.'",
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
  },
];

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

function shortSourceLabel(src: FailureModeSource): string {
  if (src.upstream) return src.upstream.split(",")[0]!.split(";")[0]!.trim();
  return src.libraryTitle
    .replace(/\s+\(.*?\)\s*$/, "")
    .replace(/^Pasted\s*[-—]\s*/i, "")
    .replace(/^Final Pilot Research Report\s*[-—]\s*/i, "Ducharme & Nelson pilot")
    .trim();
}

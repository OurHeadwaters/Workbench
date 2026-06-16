export interface ZoneTool {
  name: string;
  tagline: string;
  url: string;
  inRepo: boolean;
  zoneAddress?: string;
  status?: "live" | "planned";
}

export interface ZoneCorner {
  id: string;
  name: string;
  tagline: string;
  url: string;
  note: string;
}

export interface ZoneData {
  number: number;
  name: string;
  slug: string;
  terrain: string;
  targetDomain: string;
  flowsTo: string | null;
  metaphor: string;
  goodTimesDesc: string;
  standbyDesc: string;
  gateName: string;
  gateDesc: string;
  rootLabel: string;
  fruitLabel: string;
  color: string;
  tools: ZoneTool[];
  corner?: ZoneCorner;
}

// ─────────────────────────────────────────────────────────────────────────────
// ZONES
// Tool lists match .local/constellation-map.md exactly.
// To add a new tool: drop it into the right zone's `tools` array here and it
// surfaces automatically on /constellation and the zone map.
// ─────────────────────────────────────────────────────────────────────────────

export const ZONES: ZoneData[] = [
  // ── Zone 0 — Saltbox · The Hearth ──────────────────────────────────────────
  // "Live, raise family, homeschool, household sovereignty."
  {
    number: 0,
    name: "Saltbox",
    slug: "saltbox",
    terrain: "The Hearth · Home Center",
    targetDomain: "saltboxhomes.ca",
    flowsTo: "Kitchen Table",
    metaphor: "Where families keep what they need before winter comes.",
    goodTimesDesc:
      "Household sorted. Kit checked. Roles assigned. Everything in its place — quiet competence on the shelf.",
    standbyDesc:
      "Standby is active. Roles are live. The saltbox is open and the household is ready to move.",
    gateName: "Standby Protocol",
    gateDesc:
      "Everyday → Heads Up → Standby. The three-step status ladder that moves a household from normal days to active readiness without panic.",
    rootLabel: "Stocked",
    fruitLabel: "Ready",
    color: "#7A4E2D",
    tools: [
      // Z0–A is referenced by MapPage quiz (household:normal highlight)
      {
        name: "Saltbox / Homeschool",
        tagline: "Zone 0 hub — homeschool tools, North Star planner, Story Forge",
        url: "https://salt-box.replit.app",
        inRepo: false,
        zoneAddress: "Z0–A",
        status: "live",
      },
      {
        name: "Goodbye Kit",
        tagline: "Family lifecycle instrument — estate and end-of-life record",
        url: "https://ourheadwaters.ca/goodbye/",
        inRepo: true,
        zoneAddress: "Z0–B",
        status: "planned",
      },
      {
        name: "Hearth",
        tagline: "Creative household frontend",
        url: "https://creative-hub-xbucketsapp.replit.app",
        inRepo: false,
        zoneAddress: "Z0–C",
        status: "live",
      },
      {
        name: "Mama Support Brigade",
        tagline: "Support network for mothers",
        url: "https://mom-support-hub.replit.app",
        inRepo: false,
        zoneAddress: "Z0–D",
        status: "live",
      },
      {
        name: "Bright Side",
        tagline: "Health support layer",
        url: "https://health-support-hub.replit.app",
        inRepo: false,
        zoneAddress: "Z0–E",
        status: "live",
      },
      {
        name: "The Gate",
        tagline: "Foundational membrane / access control doctrine tool",
        url: "https://legacy-gatekeeper.replit.app",
        inRepo: false,
        zoneAddress: "Z0–F",
        status: "live",
      },
    ],
  },

  // ── Zone 1 — Kitchen Table · The Spring ──────────────────────────────────
  // "Budget every hat; plan income and lifestyle."
  {
    number: 1,
    name: "Kitchen Table",
    slug: "kitchen-table",
    terrain: "The Spring · Daily Tools",
    targetDomain: "parrsjars.com",
    flowsTo: "Workbench",
    metaphor: "Where names are held and trust is recognized — the root system that connects everything above ground.",
    goodTimesDesc:
      "Money tools running. Bucket flows visible. The income plan is open and the household knows where it stands.",
    standbyDesc:
      "Income active. Eave flows are moving. The kitchen table is the operating centre of the household economy.",
    gateName: "The Passphrase Gate",
    gateDesc:
      "A scrypt-derived passphrase that lives only on your device. No server holds your identity — The Table is local.",
    rootLabel: "Rooted",
    fruitLabel: "Recognized",
    color: "#1f3d2e",
    tools: [
      {
        name: "The Arc",
        tagline: "Community Money Machines, monthly bucket flows, Eave Flows, Kitchen Table reports",
        url: "https://ourheadwaters.ca/arc/",
        inRepo: true,
        zoneAddress: "Z1–A",
        status: "planned",
      },
      {
        name: "Headwaters Books",
        tagline: "Bookkeeping layer",
        url: "https://parrsjars.ca/headwaters-books/",
        inRepo: true,
        zoneAddress: "Z1–B",
        status: "live",
      },
      {
        name: "North Star",
        tagline: "Income and lifestyle planning",
        url: "https://salt-box.replit.app/north-star/",
        inRepo: true,
        zoneAddress: "Z1–C",
        status: "live",
      },
      {
        name: "The Eave",
        tagline: "Eave flow tracker",
        url: "https://salt-box.replit.app/eave/",
        inRepo: false,
        zoneAddress: "Z1–D",
        status: "live",
      },
      {
        name: "Channel Every Drop",
        tagline: "Budgeting video content",
        url: "https://x-buckets-vision.replit.app/xbuckets-video/",
        inRepo: false,
        zoneAddress: "Z1–E",
        status: "live",
      },
    ],
  },

  // ── Zone 2 — Workbench · The Worn Path ───────────────────────────────────
  // "Work in exchange for money — contracts and production."
  {
    number: 2,
    name: "Workbench",
    slug: "workbench",
    terrain: "The Worn Path · Trail",
    targetDomain: "parrsjars.ca",
    flowsTo: "Greenhouse",
    metaphor: "Where practitioners work. Every tool a practitioner reaches for is in this zone.",
    goodTimesDesc:
      "Planning season. Strategy on the workbench, research in the library, the operating plan open. The work is ordered.",
    standbyDesc:
      "Execution season. Clients are active, invoices moving. The workbench is clear and the tools are hot.",
    gateName: "The Practitioner Gate",
    gateDesc:
      "The five Codetry filter questions — every engagement must clear all five before the workbench opens.",
    rootLabel: "Planning",
    fruitLabel: "Delivering",
    color: "#1A5FA8",
    tools: [
      {
        name: "Parr's Jars",
        tagline: "Food production business and contracts",
        url: "https://parrsjars.com",
        inRepo: false,
        zoneAddress: "Z2–A",
        status: "live",
      },
      {
        name: "Bobbie Parr Studio",
        tagline: "Design and studio work",
        url: "https://parrsjars.com/studio/",
        inRepo: false,
        zoneAddress: "Z2–B",
        status: "live",
      },
      {
        name: "Meeting Companion",
        tagline: "Client meeting tool",
        url: "https://parrsjars.com/meeting-companion/",
        inRepo: false,
        zoneAddress: "Z2–C",
        status: "live",
      },
      {
        name: "Thomas Hauling",
        tagline: "Hauling services white-label",
        url: "https://summer-camper-rental.replit.app/thomas-hauling/",
        inRepo: false,
        zoneAddress: "Z2–D",
        status: "live",
      },
      {
        name: "807 Food Coop",
        tagline: "Co-op storefront",
        url: "https://front-and-back-of-house.replit.app/807-shop/",
        inRepo: false,
        zoneAddress: "Z2–E",
        status: "live",
      },
      {
        name: "Dryden Web",
        tagline: "Local web services",
        url: "https://front-and-back-of-house.replit.app/dryden-web/",
        inRepo: false,
        zoneAddress: "Z2–F",
        status: "live",
      },
      {
        name: "Hinterland & Co.",
        tagline: "Northern goods",
        url: "https://front-and-back-of-house.replit.app/hinterland/",
        inRepo: false,
        zoneAddress: "Z2–G",
        status: "live",
      },
    ],
  },

  // ── Zone 3 — Greenhouse · The Member Circle ───────────────────────────────
  // "Belong, pool, mutual aid, funding access."
  {
    number: 3,
    name: "Greenhouse",
    slug: "greenhouse",
    terrain: "The Member Circle · Greenhouse",
    targetDomain: "ourcommunitybenefits.com",
    flowsTo: "The Clearing",
    metaphor: "Where the network goes when something is moving — advisory, watching the horizon.",
    goodTimesDesc:
      "Advisory. The status ladder is quiet. Pilots watching. No signal yet.",
    standbyDesc:
      "Active. The standby ladder is live. Pilots are assigned and decisions are moving up the chain.",
    gateName: "The Signal",
    gateDesc:
      "Active → Advisory → Standby → Stand-down. The four-step operational status ladder for pilots in the network.",
    rootLabel: "Watching",
    fruitLabel: "Active",
    color: "#3D4A5C",
    tools: [
      {
        name: "807 Community Benefits",
        tagline: "White-label org layer — member plans and Helping Hands",
        url: "https://community-knowledge-hub.replit.app",
        inRepo: false,
        zoneAddress: "Z3–A",
        status: "live",
      },
      {
        name: "Grants Finder",
        tagline: "Grant discovery for members",
        url: "https://community-knowledge-hub.replit.app/grants/",
        inRepo: false,
        zoneAddress: "Z3–B",
        status: "live",
      },
      {
        name: "Market Mosaic",
        tagline: "Community market layer",
        url: "https://community-knowledge-hub.replit.app/market/",
        inRepo: false,
        zoneAddress: "Z3–C",
        status: "live",
      },
      {
        name: "Standby Supplies",
        tagline: "Emergency supply coordination",
        url: "https://community-knowledge-hub.replit.app/standby/",
        inRepo: false,
        zoneAddress: "Z3–D",
        status: "live",
      },
      {
        name: "807 Garden",
        tagline: "Community garden tool",
        url: "https://community-knowledge-hub.replit.app/807-garden/",
        inRepo: false,
        zoneAddress: "Z3–E",
        status: "live",
      },
    ],
  },

  // ── Zone 4 — The Clearing · The Market Square ─────────────────────────────
  // "Exchange, self-develop, discuss, broadcast."
  {
    number: 4,
    name: "The Clearing",
    slug: "clearing",
    terrain: "The Market Square · Public Gathering",
    targetDomain: "thestompingpaths.com",
    flowsTo: "Edge",
    metaphor: "Where the community decides together — the hall is always set before the vote.",
    goodTimesDesc:
      "Deliberation. The hall is set up. Evidence on the table, research in the library, no decision yet required.",
    standbyDesc:
      "Session active. Decisions are being made. The hall is open and the community is present.",
    gateName: "The Vote",
    gateDesc:
      "Community formation requires voluntary association and a board decision — no shortcut through Zone 4.",
    rootLabel: "Deliberating",
    fruitLabel: "Deciding",
    color: "#0F766E",
    tools: [
      {
        name: "The Clearing (public landing)",
        tagline: "Public front door — zone map, division finder, origin story",
        url: "https://ourheadwaters.ca/",
        inRepo: true,
        zoneAddress: "Z4–A",
        status: "planned",
      },
      {
        name: "The Stomping Paths",
        tagline: "Zone 4 hub — market access, podcast, practitioner intake",
        url: "https://thestompingpaths.com",
        inRepo: false,
        zoneAddress: "Z4–B",
        status: "live",
      },
      {
        name: "Survival Podcast",
        tagline: "Audio broadcast",
        url: "https://thestompingpaths.com/episodes",
        inRepo: false,
        zoneAddress: "Z4–C",
        status: "live",
      },
      {
        name: "Practitioner Intake",
        tagline: "Onboarding for new practitioners",
        url: "https://thestompingpaths.com/practitioners",
        inRepo: false,
        zoneAddress: "Z4–D",
        status: "live",
      },
      {
        name: "Headwaters Kits",
        tagline: "Purchasable doctrine kits",
        url: "https://our-headwaters.replit.app/kits/",
        inRepo: false,
        zoneAddress: "Z4–E",
        status: "live",
      },
      {
        name: "Headwaters Card Deck",
        tagline: "Card deck tool",
        url: "https://our-headwaters.replit.app/cards/",
        inRepo: false,
        zoneAddress: "Z4–F",
        status: "live",
      },
      {
        name: "Headwaters Learning",
        tagline: "Learning hub",
        url: "https://parrsjars.ca/headwaters-learning/",
        inRepo: true,
        zoneAddress: "Z4–G",
        status: "live",
      },
      // Z2/Z4 referenced by MapPage quiz (community:normal highlight)
      {
        name: "Research Library",
        tagline: "Northern food systems research — evidence for grants and governance",
        url: "https://parrsjars.ca/library/",
        inRepo: true,
        zoneAddress: "Z2/Z4",
        status: "live",
      },
    ],
  },

  // ── Zone 5 — The Edge · Studio & Long View ────────────────────────────────
  // "Create new things — design, blockchain, fringe builds, the long view."
  {
    number: 5,
    name: "Edge",
    slug: "edge",
    terrain: "The Edge · Studio & Long View",
    targetDomain: "codetry.ca",
    flowsTo: null,
    metaphor: "Where the community's work meets the world — public, open, and moving.",
    goodTimesDesc:
      "Quiet. The work is being done inside. The Edge is the horizon — reachable when ready.",
    standbyDesc:
      "Public. The door is open. Massive Zone 5 attention can feed the household watershed directly.",
    gateName: "The Proposal",
    gateDesc:
      "No algorithm. No self-promotion. The Edge is public presence earned by the work, not manufactured by it.",
    rootLabel: "Horizon",
    fruitLabel: "Public",
    color: "#5B3E8C",
    tools: [
      {
        name: "Codetry",
        tagline: "Zone 5 hub — Forge, Discover, Blueprints",
        url: "https://codetry.ca",
        inRepo: true,
        zoneAddress: "Z5–A",
        status: "live",
      },
      {
        name: "XRPL Studio",
        tagline: "XRPL testnet tooling",
        url: "https://xrpl-p-2-p.replit.app/xrpl-studio",
        inRepo: false,
        zoneAddress: "Z5–B",
        status: "live",
      },
      {
        name: "Dam Days",
        tagline: "Community-facing public channel — no algorithm, flag-to-hide only",
        url: "https://xrpl-p-2-p.replit.app/dam-days",
        inRepo: false,
        zoneAddress: "Z5–C",
        status: "live",
      },
      {
        name: "Slim Evey",
        tagline: "Edge studio project",
        url: "https://xrpl-p-2-p.replit.app/slim-evey",
        inRepo: false,
        zoneAddress: "Z5–D",
        status: "live",
      },
      {
        name: "Black Hole Studio",
        tagline: "Kids / homeschool creative layer",
        url: "https://black-hole-studio.replit.app",
        inRepo: false,
        zoneAddress: "Z5–E",
        status: "live",
      },
      {
        name: "Story Forge",
        tagline: "Long-view story creation",
        url: "https://salt-box.replit.app/story-forge/",
        inRepo: false,
        zoneAddress: "Z5–F",
        status: "live",
      },
    ],
  },
];

// ── The Aquifer · The Water Table ─────────────────────────────────────────────
// "Runs itself, stores, moves, orients. Hidden infrastructure everything depends on."
// number: 6 is a sentinel value — Aquifer is not a numbered user-facing zone.
export const AQUIFER_ZONE: ZoneData = {
  number: 6,
  name: "The Aquifer",
  slug: "aquifer",
  terrain: "The Water Table · Hidden Infrastructure",
  targetDomain: "ourheadwaters.ca",
  flowsTo: null,
  metaphor: "Runs itself, stores, moves, orients. Hidden infrastructure everything depends on.",
  goodTimesDesc:
    "Silent infrastructure. Auth is stable, machines are running, eave flows moving without a hand on the wheel.",
  standbyDesc:
    "All systems active. The Aquifer routes everything the standby network needs — no manual intervention required.",
  gateName: "The Root",
  gateDesc:
    "The Aquifer is not a zone you enter — it's what makes every other zone possible. It surfaces through the tools.",
  rootLabel: "Running",
  fruitLabel: "Flowing",
  color: "#2D5A7B",
  tools: [
    {
      name: "API Server",
      tagline: "Express 5 backend — auth, machines, eave flows, kits, helping hands",
      url: "https://ourheadwaters.ca/api",
      inRepo: true,
      zoneAddress: "AQ–A",
      status: "live",
    },
    {
      name: "The Arc",
      tagline: "Private steward portal — money tools (Z1) and living map (Aquifer)",
      url: "https://ourheadwaters.ca/arc/",
      inRepo: true,
      zoneAddress: "AQ–B",
      status: "planned",
    },
    {
      name: "The Compass",
      tagline: "Orientation — zone vocabulary and doctrine cards",
      url: "https://ourheadwaters.ca/compass/",
      inRepo: true,
      zoneAddress: "AQ–C",
      status: "planned",
    },
    {
      name: "The Logic",
      tagline: "Foundational reference document",
      url: "https://ourheadwaters.ca/logic/",
      inRepo: true,
      zoneAddress: "AQ–D",
      status: "planned",
    },
    {
      name: "Print Suite",
      tagline: "Cross-zone print production utility",
      url: "https://ourheadwaters.ca/suite/",
      inRepo: true,
      zoneAddress: "AQ–E",
      status: "planned",
    },
  ],
};

// ── In-repo artifact index ────────────────────────────────────────────────────
// Canonical list of every in-repo artifact, matched to .local/constellation-map.md
// "In-repo artifact index" section. This is the single source of truth for the
// /constellation page's artifact table — do not duplicate it elsewhere.
export const IN_REPO_ARTIFACT_INDEX: Array<{
  previewPath: string;
  artifactDir: string;
  zoneHome: string;
  status: "live" | "planned";
}> = [
  { previewPath: "/",                     artifactDir: "artifacts/headwaters",         zoneHome: "Z4 Clearing (public front door)", status: "planned" },
  { previewPath: "/arc/",                 artifactDir: "artifacts/arc",                zoneHome: "Aquifer / Z1 money tools",        status: "planned" },
  { previewPath: "/api",                  artifactDir: "artifacts/api-server",         zoneHome: "Aquifer (backend)",               status: "live"    },
  { previewPath: "/compass/",             artifactDir: "artifacts/compass",            zoneHome: "Aquifer",                         status: "planned" },
  { previewPath: "/logic/",              artifactDir: "artifacts/the-logic",           zoneHome: "Aquifer",                         status: "planned" },
  { previewPath: "/suite/",              artifactDir: "artifacts/print-suite",         zoneHome: "Aquifer",                         status: "planned" },
  { previewPath: "/goodbye/",            artifactDir: "artifacts/goodbye-kit",         zoneHome: "Z0 (kit) / Z4 (market face)",     status: "planned" },
  { previewPath: "/north-star/",         artifactDir: "artifacts/north-star",          zoneHome: "Z1 (planning) / Z2 (workbench)",  status: "live"    },
  { previewPath: "/headwaters-books/",   artifactDir: "artifacts/headwaters-books",    zoneHome: "Z1",                              status: "live"    },
  { previewPath: "/print-marketing/",    artifactDir: "artifacts/print-marketing",     zoneHome: "Z2",                              status: "live"    },
  { previewPath: "/library/",            artifactDir: "artifacts/library",             zoneHome: "Z2 / Z4",                         status: "live"    },
  { previewPath: "/headwaters-learning/",artifactDir: "artifacts/field-guide-finance", zoneHome: "Z4",                              status: "live"    },
  { previewPath: "/codetry-handbook/",   artifactDir: "artifacts/codetry-handbook",    zoneHome: "Z0",                              status: "live"    },
];

export const MAP_URL = "/map";
export const LEGEND_URL = "/legend";
export const CONSTELLATION_URL = "/constellation";

export interface CrossingGate {
  key: string;
  name: string;
  from: ZoneData["number"];
  to: ZoneData["number"];
  desc: string;
}

export const CROSSING_GATES: Record<string, CrossingGate> = {
  g_z0_z1: {
    key: "g_z0_z1",
    name: "The Eave Overhang",
    from: 0,
    to: 1,
    desc: "Household (Z0) to Mutual Aid (Z1). Social capital originates here. Any crossing requires explicit consent and ceremony.",
  },
  g_z1_z2: {
    key: "g_z1_z2",
    name: "The Workbench Gate",
    from: 1,
    to: 2,
    desc: "Moving from social/experiential capital (Z1) into operational/contracted work (Z2). Conversion to financial capital beyond this point must pass a conscious gate decision.",
  },
};

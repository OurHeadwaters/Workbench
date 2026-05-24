export interface ZoneTool {
  name: string;
  tagline: string;
  url: string;
  inThisProject: boolean;
  zoneAddress?: string;
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

export const ZONES: ZoneData[] = [
  {
    number: 0,
    name: "The Saltbox",
    slug: "saltbox",
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
      {
        name: "Saltbox",
        tagline: "Household readiness — roles, kit, and standby status",
        url: "/gather/",
        inThisProject: true,
        zoneAddress: "Z0–A",
      },
      {
        name: "The Handbook",
        tagline: "How a community runs its own economy — offline-first reader",
        url: "/codetry-handbook/",
        inThisProject: true,
        zoneAddress: "Z0–B",
      },
      {
        name: "xbuckets (XRPL)",
        tagline: "Non-custodial community wallet and trust layer",
        url: "https://xbucketsapp.replit.app",
        inThisProject: false,
        zoneAddress: "Z0–C",
      },
      {
        name: "Saltbox (External)",
        tagline: "Household readiness — external deployment at salt-box.replit.app",
        url: "https://salt-box.replit.app",
        inThisProject: false,
        zoneAddress: "Z0–D",
      },
    ],
  },
  {
    number: 1,
    name: "The Lodge",
    slug: "lodge",
    metaphor: "Where names are held and trust is recognized — the root system that connects everything above ground.",
    goodTimesDesc:
      "Credentials quiet, identities stable. The Lodge is the unseen foundation — names on record, passphrase in hand.",
    standbyDesc:
      "Identity active. The passphrase is the key. The Lodge proves who you are to any zone that asks.",
    gateName: "The Passphrase Gate",
    gateDesc:
      "A scrypt-derived passphrase that lives only on your device. No server holds your identity — the Lodge is local.",
    rootLabel: "Rooted",
    fruitLabel: "Recognized",
    color: "#1f3d2e",
    tools: [
      {
        name: "Village Board Sandbox",
        tagline: "60-family local community sandbox — pull-only, no algorithm",
        url: "/sandbox/",
        inThisProject: true,
        zoneAddress: "Z1–A",
      },
      {
        name: "XRPL Design Hub",
        tagline: "Trust layer design — XRPL wallet UX, passphrase architecture, identity patterns",
        url: "https://xrpl-design-hub.replit.app",
        inThisProject: false,
        zoneAddress: "Z1–B",
      },
    ],
  },
  {
    number: 2,
    name: "The Bench",
    slug: "bench",
    metaphor: "Where practitioners work. Every tool a practitioner reaches for is in this zone.",
    goodTimesDesc:
      "Planning season. Strategy on the bench, research in the library, the operating plan open. The work is ordered.",
    standbyDesc:
      "Execution season. Clients are active, invoices moving. The bench is clear and the tools are hot.",
    gateName: "The Practitioner Gate",
    gateDesc:
      "The five Codetry filter questions — every engagement must clear all five before the bench opens.",
    rootLabel: "Planning",
    fruitLabel: "Delivering",
    color: "#1A5FA8",
    tools: [
      {
        name: "North Star",
        tagline: "Daily household planning — zones, guide, weekly rhythm",
        url: "/north-star/",
        inThisProject: true,
        zoneAddress: "Z2–A",
      },
      {
        name: "Field Guide Finance",
        tagline: "Premium practitioner finance course",
        url: "/field-guide-finance/",
        inThisProject: true,
        zoneAddress: "Z2–B",
      },
      {
        name: "Practitioner's Guide",
        tagline: "Financial cockpit — money, contracts, scenarios, debt attack",
        url: "/practitioners-guide-v2/",
        inThisProject: true,
        zoneAddress: "Z2–C",
      },
      {
        name: "The Operating Plan",
        tagline: "Daily bench — morning debrief, week plan, year overview",
        url: "/practitioner-operating-plan/",
        inThisProject: true,
        zoneAddress: "Z2–D",
      },
      {
        name: "Print Marketing Suite",
        tagline: "Posters, flyers, one-pagers — print-ready community assets",
        url: "/print-marketing/",
        inThisProject: true,
        zoneAddress: "Z2–E",
      },
      {
        name: "Headwaters Books",
        tagline: "Agency ledger — daily books, community labour, reconciliation",
        url: "/headwaters-books/",
        inThisProject: true,
        zoneAddress: "Z2–F",
      },
      {
        name: "Research Library",
        tagline: "Northern food systems research — evidence for grants and supply chain arguments",
        url: "/library/",
        inThisProject: true,
        zoneAddress: "Z2/Z4",
      },
    ],
  },
  {
    number: 3,
    name: "The Standby",
    slug: "standby",
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
        name: "The Standby Dashboard",
        tagline: "Z3 pilot dashboard — status ladder and call composer (inside Headwaters Books)",
        url: "/headwaters-books/standby",
        inThisProject: true,
        zoneAddress: "Z3–A",
      },
    ],
  },
  {
    number: 4,
    name: "Community Hall",
    slug: "community-hall",
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
    corner: {
      id: "village-corner",
      name: "Village Corner",
      tagline: "The co-op layer — Village Board & community formation",
      url: "/sandbox/",
      note: "Community formation and governance. The Village Board is seated here.",
    },
    tools: [
      {
        name: "Research Library",
        tagline: "Northern food systems evidence — backs every governance argument",
        url: "/library/",
        inThisProject: true,
        zoneAddress: "Z2/Z4",
      },
      {
        name: "NWO Regional Abattoir (CCM)",
        tagline: "Community Hall pilot — single-animal traceability",
        url: "#",
        inThisProject: false,
        zoneAddress: "Z4–A",
      },
      {
        name: "Village Corner — Village Board",
        tagline: "Co-op governance layer — 60-family pull-only community board",
        url: "/sandbox/",
        inThisProject: true,
        zoneAddress: "Z4–VC",
      },
      {
        name: "Community Knowledge Hub",
        tagline: "Shared knowledge base — community research, policy, and decision records",
        url: "https://community-knowledge-hub.replit.app",
        inThisProject: false,
        zoneAddress: "Z4–B",
      },
    ],
  },
  {
    number: 5,
    name: "The Wild",
    slug: "wild",
    metaphor: "Where the community's work meets the world — public, open, and moving.",
    goodTimesDesc:
      "Quiet. The work is being done inside. The Wild is the horizon — reachable when ready.",
    standbyDesc:
      "Public. The door is open. Massive Zone 5 attention can feed the household watershed directly.",
    gateName: "The Proposal",
    gateDesc:
      "No algorithm. No self-promotion. The Wild is public presence earned by the work, not manufactured by it.",
    rootLabel: "Horizon",
    fruitLabel: "Public",
    color: "#5B3E8C",
    corner: {
      id: "crypto-corner",
      name: "Crypto Corner",
      tagline: "The Headwaters ship is docked here — XRPL gateway",
      url: "/crypto-castle/",
      note: "The ship is docked. This is where the Headwaters XRPL layer meets the community.",
    },
    tools: [
      {
        name: "Codetry Ship",
        tagline: "The public window — services, bio, case studies, economy",
        url: "/",
        inThisProject: true,
        zoneAddress: "Z5–A",
      },
      {
        name: "Dam Days",
        tagline: "Community-facing public channel — no algorithm, flag-to-hide only",
        url: "#",
        inThisProject: false,
        zoneAddress: "Z5–B",
      },
      {
        name: "Crypto Corner — Crypto Castle",
        tagline: "The docking point for the Headwaters ship — XRPL layer",
        url: "/crypto-castle/",
        inThisProject: true,
        zoneAddress: "Z5–CC",
      },
    ],
  },
];

export const MAP_URL = "/map";
export const COMPASS_URL = "/compass";

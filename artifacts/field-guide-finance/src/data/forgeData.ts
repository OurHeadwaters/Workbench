export type ElementId = "fire" | "water" | "earth" | "air" | "aether";

export interface Element {
  id: ElementId;
  name: string;
  emoji: string;
  pillar: string;
  blockchainClaim: string;
  color: string;
  glowColor: string;
  factionName: string;
  factionDesc: string;
  ecosystems: string[];
}

export const ELEMENTS: Element[] = [
  {
    id: "fire",
    name: "Fire",
    emoji: "🔥",
    pillar: "Energy",
    blockchainClaim: "Consensus cost, validator distribution, PoW/PoS trade-offs",
    color: "#FF6B2B",
    glowColor: "rgba(255,107,43,0.4)",
    factionName: "The Igniters",
    factionDesc: "Energy must be spent to earn trust. Proof-of-Work is not waste — it is proof.",
    ecosystems: ["Bitcoin", "Ethereum (PoW era)", "Kadena"],
  },
  {
    id: "water",
    name: "Water",
    emoji: "💧",
    pillar: "Distribution",
    blockchainClaim: "Liquidity, bridging, state-channel resilience",
    color: "#7B2FBE",
    glowColor: "rgba(123,47,190,0.4)",
    factionName: "The Tides",
    factionDesc: "Value that cannot flow cannot feed. Channels, bridges, and liquidity pools are the rivers of the network.",
    ecosystems: ["XRP", "Stellar", "Uniswap", "Lightning Network"],
  },
  {
    id: "earth",
    name: "Earth",
    emoji: "🪨",
    pillar: "Persistence",
    blockchainClaim: "Data persistence, Merkle integrity, ledger immutability",
    color: "#5C3D2E",
    glowColor: "rgba(92,61,46,0.4)",
    factionName: "The Anchors",
    factionDesc: "What cannot be changed cannot be argued. Roots hold when storms come.",
    ecosystems: ["Filecoin", "Arweave", "IPFS", "Bitcoin (UTXO set)"],
  },
  {
    id: "air",
    name: "Air",
    emoji: "💨",
    pillar: "Communications",
    blockchainClaim: "Messaging, oracles, L2 execution environments",
    color: "#00B4D8",
    glowColor: "rgba(0,180,216,0.4)",
    factionName: "The Relays",
    factionDesc: "Signal without noise. Oracles carry truth from the real world into the chain — when they fail, so does the system.",
    ecosystems: ["Chainlink", "Optimism", "Arbitrum", "Wormhole"],
  },
  {
    id: "aether",
    name: "Aether",
    emoji: "✨",
    pillar: "Governance",
    blockchainClaim: "DAO structures, composability, coordination",
    color: "#C9A84C",
    glowColor: "rgba(201,168,76,0.4)",
    factionName: "The Weavers",
    factionDesc: "Composability is governance at the protocol layer. Aether binds elements without controlling them.",
    ecosystems: ["Ethereum (DeFi)", "Cosmos", "Polkadot", "MakerDAO"],
  },
];

export const ELEMENT_MAP = Object.fromEntries(
  ELEMENTS.map((e) => [e.id, e])
) as Record<ElementId, Element>;

export interface ForgeModule {
  id: string;
  title: string;
  pillar: string;
  principle: string;
  conceptName: string;
  lessonBody: string;
  startingNodes: Array<{ id: string; elementId: ElementId; x: number; y: number }>;
  startingConnections: Array<{ fromId: string; toId: string }>;
}

export const FORGE_MODULES: ForgeModule[] = [
  {
    id: "mod-1",
    title: "Module 1 — Validator Distribution",
    pillar: "Fire / Energy",
    principle: "Consensus cost is not waste — it is the price of trustless agreement.",
    conceptName: "Consensus Cost & Validator Distribution",
    lessonBody: `## What You're Building

A validator network is not just a list of computers running software. It is a distribution of energy commitments — each node spending real resources to participate in consensus.

**The preparedness parallel:** In a community resilience plan, energy sources should never be concentrated in one location. A single generator that everyone depends on is a single point of failure. Distributed energy = distributed trust.

## The Core Risk Pattern

When validator stake or hash rate concentrates in fewer than three nodes, you get:
- **51% attack surface** — a majority actor can rewrite recent history
- **Geographic concentration risk** — a single jurisdiction can shut down the network
- **Energy concentration risk** — a spike in energy cost can knock out the whole set

## Your Build Challenge

Start with two Fire nodes. Connect them to each other. Submit to The Reckoning and observe what it finds. Then add an Earth node as a persistence anchor and reconnect. See how the structural assessment changes.

> "A network with one dominant validator is not a network. It is a server with extra steps." — Headwaters field notes`,
    startingNodes: [
      { id: "sn-1", elementId: "fire", x: 200, y: 180 },
      { id: "sn-2", elementId: "fire", x: 420, y: 180 },
    ],
    startingConnections: [{ fromId: "sn-1", toId: "sn-2" }],
  },
  {
    id: "mod-2",
    title: "Module 2 — Liquidity Channels",
    pillar: "Water / Distribution",
    principle: "Value that cannot flow cannot feed — channels must have redundant paths.",
    conceptName: "Liquidity & Bridging",
    lessonBody: `## What You're Building

A liquidity channel is a committed path for value to travel between two parties. State channels (like the Lightning Network) lock funds into a bilateral agreement that settles on-chain only when the channel closes.

**The preparedness parallel:** Water distribution in a remote community requires redundant pipes. If one route is cut, another route carries the supply. Single-path liquidity is a single-point-of-failure water system.

## The Core Risk Pattern

When a Water node has only one connection and no alternate path:
- **Liquidity bottleneck** — all traffic routes through one channel
- **Bridge dependency** — if the bridge fails, the entire sub-network is isolated
- **Capital lock risk** — funds are stranded until the single channel closes

## Your Build Challenge

Place a Water node connected to a single Fire node. Submit to The Reckoning. It will flag a liquidity gap. Then add a second Water node with an alternate path to an Air node. Observe how redundancy changes the structural assessment.

> "One pipe is infrastructure. Two pipes is resilience." — Headwaters field notes`,
    startingNodes: [
      { id: "sn-1", elementId: "water", x: 300, y: 200 },
      { id: "sn-2", elementId: "fire", x: 480, y: 130 },
    ],
    startingConnections: [{ fromId: "sn-1", toId: "sn-2" }],
  },
  {
    id: "mod-3",
    title: "Module 3 — Merkle Integrity",
    pillar: "Earth / Persistence",
    principle: "What cannot be changed cannot be argued — root hashes are the anchor of truth.",
    conceptName: "Merkle Integrity & Ledger Immutability",
    lessonBody: `## What You're Building

A Merkle tree hashes data in layers. Each parent hash is derived from its children. Change any leaf, and every hash up to the root changes — making tampering detectable from the root alone.

**The preparedness parallel:** A root cellar inventory that can never be falsified. Every jar, every date, every count recorded in a chain where altering one record invalidates all records above it. The root is the truth anchor.

## The Core Risk Pattern

When a persistence layer (Earth node) has no connection to a validation layer (Fire node):
- **Orphaned persistence** — data is stored but not verified by consensus
- **No integrity guarantee** — the record exists but nothing is checking it
- **Weak anchor** — the root hash has no witnesses

## Your Build Challenge

Place an Earth node alone. Submit to The Reckoning — it will find no connections, no witnesses. Then connect it to a Fire node (validator witness) and an Air node (oracle feed). See how anchoring changes the structural picture.

> "A record that no one verifies is not a record. It is a note." — Headwaters field notes`,
    startingNodes: [
      { id: "sn-1", elementId: "earth", x: 300, y: 220 },
    ],
    startingConnections: [],
  },
];

export interface FactionRivalry {
  elements: [ElementId, ElementId];
  tension: string;
  factionVoice: string;
}

export const FACTION_RIVALRIES: FactionRivalry[] = [
  {
    elements: ["fire", "water"],
    tension: "Energy concentration vs. liquidity distribution",
    factionVoice: "The Igniters say: 'Proof-of-work is security through expenditure.' The Tides say: 'Security without flow is a fortress with no gate — impressive, useless.'",
  },
  {
    elements: ["fire", "earth"],
    tension: "Consensus speed vs. persistence cost",
    factionVoice: "The Igniters want fast finality. The Anchors want deep immutability. They are both right and both annoying about it.",
  },
  {
    elements: ["water", "earth"],
    tension: "Liquidity vs. permanence",
    factionVoice: "The Tides say assets must flow. The Anchors say records must stay. The compromise is a bridge with a ledger.",
  },
  {
    elements: ["air", "fire"],
    tension: "Oracle input vs. validator trust",
    factionVoice: "The Relays bring data from outside. The Igniters distrust anything they can't verify themselves. This is why oracle design is a political problem, not a technical one.",
  },
  {
    elements: ["aether", "fire"],
    tension: "Governance composability vs. consensus purity",
    factionVoice: "The Weavers want every protocol to snap together. The Igniters say composability is attack surface. They are having this argument in every Layer 2 Discord server right now.",
  },
  {
    elements: ["aether", "water"],
    tension: "DAO coordination vs. liquidity incentives",
    factionVoice: "The Weavers propose governance votes. The Tides vote with their liquidity. Token-weighted voting is Water winning the Aether argument by showing up with a bigger bucket.",
  },
  {
    elements: ["earth", "air"],
    tension: "Immutability vs. oracle freshness",
    factionVoice: "The Anchors locked the record. The Relays need to update it. This is the oracle problem: how do you feed a truth into a system that is allergic to change?",
  },
  {
    elements: ["aether", "earth"],
    tension: "Composability vs. stability",
    factionVoice: "The Weavers want everything to connect. The Anchors want nothing to move. The Weavers eventually win, and then something breaks, and then the Anchors say 'we told you.'",
  },
];

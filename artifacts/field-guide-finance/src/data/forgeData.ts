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
    title: "Module 1 — Mining & Consensus",
    pillar: "Fire / Energy",
    principle: "Miners compete to verify the ledger — cutting out governments and banks from centralizing our value exchange.",
    conceptName: "How the Ledger Stays Honest",
    lessonBody: `## What Cryptocurrency Actually Is

Cryptocurrency is a string of letters and numbers that cannot be counterfeited — like a serial number on cash. These secret codes can be exchanged with another person through a decentralized ledger.

**Miners** compete to verify this ledger and create new coins. They work together to keep the books up to date and verified — cutting out governments and banks from centralizing our value exchange. Miners also bring new money into existence. Some coins are limited (Bitcoin caps at 21 million); some are limitless.

## Proof-of-Work vs. Proof-of-Stake

- **Proof-of-Work (PoW):** Miners spend real energy solving cryptographic puzzles. The expenditure is the proof of honesty. Bitcoin runs on PoW.
- **Proof-of-Stake (PoS):** Validators lock up ("stake") coins as collateral instead of spending energy. Ethereum moved to PoS in 2022.
- **The trade-off:** PoW is energy-intensive but deeply battle-tested. PoS is efficient but concentrates influence with large holders.

## The Preparedness Parallel

A community resilience plan should never concentrate its energy sources in one location. A single generator everyone depends on is a single point of failure. Distributed energy = distributed trust. The same logic applies to validator networks: the more nodes, the more jurisdictions, the harder it is for any single actor to capture the ledger.

## Your Build Challenge

Start with two Fire nodes already connected. Submit to The Reckoning — observe what it finds about concentration risk. Then add a third Fire node and an Earth node as a persistence anchor. See how distributing validators changes the structural assessment.

> "Miners compete to verify this ledger and create new coins — working together to keep the books up to date and verified; cutting out the govnt/banks from centralizing our value exchange." — Dryden community crypto session`,
    startingNodes: [
      { id: "sn-1", elementId: "fire", x: 200, y: 180 },
      { id: "sn-2", elementId: "fire", x: 420, y: 180 },
    ],
    startingConnections: [{ fromId: "sn-1", toId: "sn-2" }],
  },
  {
    id: "mod-2",
    title: "Module 2 — Getting on the Blockchain",
    pillar: "Water / Distribution",
    principle: "Avoid exchanges. Send to a private wallet. Keep your eggs in many baskets.",
    conceptName: "Onboarding & Exchange Risk",
    lessonBody: `## We Don't Own Crypto — We Hold Keys

A critical distinction: we don't "own" cryptocurrency the way we own a physical object. We have a list of numbers (a private key) that accesses a code on the blockchain. Whoever holds the key holds the crypto. This is why custody matters.

## The Shakepay Onboard Path

The recommended path for getting onto the blockchain as a beginner:

1. **EMT (Interac e-Transfer)** → Shakepay account — simple, familiar, Canadian
2. **Shakepay** → purchase Bitcoin or Ethereum
3. **Send immediately to your private wallet** — do not leave funds on the exchange

**The critical step is getting off the exchange.** Exchanges are useful onramps, but they hold your keys. If the exchange is hacked, frozen, or goes bankrupt, your funds are at risk.

## Exchange Risks

- **KYC requirements** — Exchanges (Coinbase, Bittru, Wealthsimple) require identity verification. More regulations will follow.
- **Tax implications** — You must claim earnings when converting back to fiat or buying gold/silver.
- **Custody risk** — The exchange controls your keys, not you.
- **Single liquidity path** — Relying on one exchange creates a single point of failure for your value flow.

## The Preparedness Parallel

Water distribution in a remote community requires redundant pipes. If one route is cut, another carries the supply. A single exchange relationship is a single-path water system — one freeze, one hack, one regulatory action, and flow stops entirely.

## Your Build Challenge

A Water node (your exchange) is already connected to a single Fire node (the blockchain). Submit to The Reckoning — it will flag the single-path dependency. Then add a second Water node (a private wallet path) with a direct connection. Observe how redundancy changes the structural picture.

> "Keep your eggs in many baskets." — Dryden community crypto session`,
    startingNodes: [
      { id: "sn-1", elementId: "water", x: 300, y: 200 },
      { id: "sn-2", elementId: "fire", x: 480, y: 130 },
    ],
    startingConnections: [{ fromId: "sn-1", toId: "sn-2" }],
  },
  {
    id: "mod-3",
    title: "Module 3 — Self-Custody",
    pillar: "Earth / Persistence",
    principle: "Not your keys, not your crypto.",
    conceptName: "Hardware Wallets & Cold Storage",
    lessonBody: `## The Fundamental Rule

**Not your keys, not your crypto.** This is the most important principle in the entire field. If someone else holds your private keys — an exchange, a custodian, a friend — they hold your crypto, not you. There is no recourse if they fail.

## Software vs. Hardware Wallets

| | Software Wallet | Hardware Wallet |
|---|---|---|
| **What it is** | App on your phone or computer | Physical device (Ledger, Trezor) that stores keys offline |
| **Convenience** | High — always with you | Moderate — requires the device to sign transactions |
| **Risk** | Device can be hacked or lost | Resistant to remote attacks; must be physically compromised |
| **Best for** | Small, everyday amounts | Long-term storage, larger holdings |

**The principle:** Convenient and portable but dependent on electricity and connected devices. Hardware is more difficult to confiscate and more resistant to remote attack — a sound means of exchange for self-sufficient communities.

## Cold Storage as Resilience Architecture

Cold storage means keeping private keys completely offline — never exposed to the internet. A hardware wallet in a secure location is cold storage. This is the root cellar of the crypto world: stable, offline, hard to access by outsiders.

## The Preparedness Parallel

An Earth node is persistence — a record that cannot be changed. Cold storage is your ledger anchor. But an isolated Earth node (a private wallet with no connection to a verification layer) has no witnesses. The Reckoning will find it: persistence without verification has no integrity guarantee.

## Your Build Challenge

An Earth node is pre-placed alone — representing a cold wallet with no connections. Submit to The Reckoning and read what it finds. Then connect it to a Fire node (the blockchain consensus layer) and an Air node (an oracle or verification signal). Watch how anchoring changes the structural assessment.

> "Not your keys; not your crypto." — Dryden community crypto session`,
    startingNodes: [
      { id: "sn-1", elementId: "earth", x: 300, y: 220 },
    ],
    startingConnections: [],
  },
  {
    id: "mod-4",
    title: "Module 4 — Scam Architecture",
    pillar: "Air / Communications",
    principle: "Bad information travels fast. Verify every signal through multiple channels before acting.",
    conceptName: "How Scams Travel & How to Spot Them",
    lessonBody: `## How Bad Information Spreads

Scams exploit the same channels that carry legitimate information — email, social media, search results, app stores. The attack surface is communications itself.

## The Major Scam Vectors

**Phishing (Email & Web)**
Emails that look like they're from services you use — requesting a password reset, asking you to confirm account details. Phishing websites replicate real sites pixel-for-pixel. They appear as sponsored results in search engines. Rule: Triple-check authenticity. Contact the company through their official website directly — not through any link in the email.

**Impersonation**
Con-artists create social media accounts nearly identical to real people. They wait until the person posts, then reply with a "free giveaway" from the fake account. Never participate in free giveaways. If you get a strange request from someone in your network, verify through a second channel (call them, text separately).

**Malware Clipboard Attacks**
When sending Bitcoin, always triple-check the address you're pasting. Some malware silently replaces clipboard contents — so the address you copied gets swapped for the hacker's address. Once confirmed on-chain, the transaction cannot be reversed. There is no undo.

**Fake Exchanges & Scam Coins**
Fake exchanges offer competitive prices to lure users in. Scam coins (altcoins) feature flashy websites and inflated community metrics to create fear-of-missing-out. They pump, then dump. Beware of any coin using "Bitcoin" in its name to imply a relationship that doesn't exist.

**The Classic Patterns (Never Do These)**
- Ponzi / pyramid schemes promising guaranteed returns
- Ransomware — pay a professional to remove it, not the ransom
- Meeting in person with strangers to exchange bitcoin
- Responding to money-transfer requests from unknown senders

## The Preparedness Parallel

An Air node carries signal — but not all signal is clean. A communications network without verification is just a noise channel. The Reckoning checks whether your Air nodes have witnesses: unverified oracle feeds are warnings, not facts.

## Your Build Challenge

An Air node (the communications layer) is already connected to a Fire node (a validator that can verify its signal). Submit to The Reckoning — observe the clean result. Then disconnect the Fire node to orphan the Air node. See what The Reckoning flags when signal has no verification anchor.

> "If you're not positive about putting your money there, don't." — Dryden community crypto session`,
    startingNodes: [
      { id: "sn-1", elementId: "air", x: 300, y: 200 },
      { id: "sn-2", elementId: "fire", x: 480, y: 140 },
    ],
    startingConnections: [{ fromId: "sn-1", toId: "sn-2" }],
  },
  {
    id: "mod-5",
    title: "Module 5 — Sovereignty & Community Infrastructure",
    pillar: "Aether / Governance",
    principle: "Our fear of technology is really a fear of empowerment. We now have the ability to design the reality we live in.",
    conceptName: "CBDC Resistance & Community-Owned Exchange",
    lessonBody: `## Why This Matters for Communities Like Ours

Cryptocurrency is not primarily about getting rich. The long-term benefit is having an asset that cannot be taken — a store of value outside the banking system, beyond the reach of centralized monetary control.

**Three reasons a northern community should understand this:**
1. **Hedge against inflation** — A devaluing dollar supports new need for Central Bank Digital Currency (CBDC). Holding decentralized assets is one option against currency debasement.
2. **CBDC resistance** — A CBDC is government-issued digital currency with programmable controls. Mass adoption of decentralized currency combats the conditions that make CBDC adoption feel inevitable.
3. **Peer-to-peer exchange** — Crypto enables direct value transfer between community members without bank infrastructure. The Dryden session explored this directly: what if neighbours could EMT each other without banks entirely?

## The Satoshi Origin

Thirteen years ago, a person or group using the name **Satoshi Nakamoto** released a paper describing a new software system called Bitcoin. Nobody knows who this entity was — but this gift of technology has, as one way of putting it, "taken the shackles off humanity." The bigger challenge is convincing people they don't need the shackles.

## Crypto as a Tool (Three Functions)

- **Store of value** — holds purchasing power over time
- **Means of exchange** — transfers value between parties
- **Unit of account** — measures the price of other goods

This is what today's session is actually about: the practical applications of peer-to-peer exchange — not trading, not speculation, not getting rich.

## Privacy Coins & The Regulatory Horizon

Privacy coins (Monero, ARRR, Ghost) add cryptographic anonymity to transactions. Exchanges are already doing KYC (Know Your Customer) verification, and more regulations will follow. Understanding privacy tools now — before they become harder to access — is part of community preparedness.

## Your Build Challenge

An Aether node (governance/coordination layer) is pre-connected to a Fire node (consensus) and a Water node (distribution). This is the community infrastructure pattern: coordination that rests on real consensus and real value flow. Submit to The Reckoning to confirm stability. Then remove the Fire node and observe what happens to a governance layer without consensus beneath it.

> "Our fear of technology is really a fear of empowerment. We now have the ability to design the reality we live in and we have to step up to that occasion." — Douglas Rushkoff, Author of *Life Inc.* (quoted at the Dryden community crypto session)`,
    startingNodes: [
      { id: "sn-1", elementId: "aether", x: 300, y: 220 },
      { id: "sn-2", elementId: "fire", x: 160, y: 130 },
      { id: "sn-3", elementId: "water", x: 440, y: 130 },
    ],
    startingConnections: [
      { fromId: "sn-1", toId: "sn-2" },
      { fromId: "sn-1", toId: "sn-3" },
    ],
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

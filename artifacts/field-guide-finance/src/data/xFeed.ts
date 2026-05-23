import type { ElementId } from "@/data/forgeData";

export interface XPost {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  body: string;
  timestamp: string;
  factionTag: ElementId;
  provocationPrompt: string;
}

// TODO: swap for X API — replace `fetchPosts()` implementation below with a real
// API call to GET /2/tweets/search/recent or a streaming endpoint, keeping the
// same XPost shape. The rest of the app reads only from this function.

const MOCK_POSTS: XPost[] = [
  {
    id: "katz-001",
    handle: "@joelkatz",
    displayName: "Joel Katz",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=joelkatz&backgroundColor=7B2FBE",
    body: "XRP Ledger has been processing 1,500 TPS for years with sub-5-second finality and no mining rewards. The energy debate is a distraction from the throughput reality.",
    timestamp: "2025-05-20T14:32:00Z",
    factionTag: "water",
    provocationPrompt: "Is throughput a valid substitute for decentralisation? Where does The Tides' case break down?",
  },
  {
    id: "katz-002",
    handle: "@joelkatz",
    displayName: "Joel Katz",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=joelkatz&backgroundColor=7B2FBE",
    body: "Bridges introduce trust assumptions. Wrapping an asset to move it across chains means someone, somewhere, is holding the IOU. Liquidity that flows through a single custodian is not liquidity — it is credit.",
    timestamp: "2025-05-21T09:14:00Z",
    factionTag: "water",
    provocationPrompt: "Is native interoperability possible without any trust bridge? What would The Anchors say?",
  },
  {
    id: "katz-003",
    handle: "@joelkatz",
    displayName: "Joel Katz",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=joelkatz&backgroundColor=7B2FBE",
    body: "Consensus without an energy cost is not free — the cost moves to identity and reputation. Proof-of-stake replaces energy with economic stake. Neither is free. Choose your poison honestly.",
    timestamp: "2025-05-22T11:58:00Z",
    factionTag: "water",
    provocationPrompt: "Which cost is more honest — energy spend or economic lock-up? The Igniters have a position.",
  },
  {
    id: "vitalik-001",
    handle: "@VitalikButerin",
    displayName: "Vitalik Buterin",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=vitalikbuterin&backgroundColor=C9A84C",
    body: "The real scalability problem is not transactions per second. It is state growth. A chain that processes 10,000 TPS but grows its state by 1 TB/year has a long-term centralisation problem baked in.",
    timestamp: "2025-05-19T18:05:00Z",
    factionTag: "aether",
    provocationPrompt: "State bloat is an Anchors problem wrapped in a Weavers shell. How do you govern pruning without changing the immutability guarantee?",
  },
  {
    id: "vitalik-002",
    handle: "@VitalikButerin",
    displayName: "Vitalik Buterin",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=vitalikbuterin&backgroundColor=C9A84C",
    body: "Composability is how you get the most out of a trust layer you already paid to build. If two protocols can't talk to each other, you haven't built a financial system — you've built two expensive databases.",
    timestamp: "2025-05-20T21:22:00Z",
    factionTag: "aether",
    provocationPrompt: "Does composability amplify attack surface proportionally? The Igniters say yes. Defend or rebut.",
  },
  {
    id: "vitalik-003",
    handle: "@VitalikButerin",
    displayName: "Vitalik Buterin",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=vitalikbuterin&backgroundColor=C9A84C",
    body: "Token-weighted governance is a reasonable starting point, not an endpoint. One-token-one-vote with no participation threshold means a well-capitalized minority can set the rules for everyone.",
    timestamp: "2025-05-22T16:40:00Z",
    factionTag: "aether",
    provocationPrompt: "What is the Weavers' governance model that doesn't collapse into plutocracy? Is it structurally possible?",
  },
  {
    id: "carter-001",
    handle: "@nic__carter",
    displayName: "Nic Carter",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=niccarter&backgroundColor=FF6B2B",
    body: "Proof-of-work is the only consensus mechanism that doesn't require you to trust the initial distribution of tokens. Everything else starts with someone deciding who gets the first stake. That's not neutral.",
    timestamp: "2025-05-18T10:10:00Z",
    factionTag: "fire",
    provocationPrompt: "Is the initial PoW miner distribution actually more neutral, or just opaque? The Weavers are watching.",
  },
  {
    id: "carter-002",
    handle: "@nic__carter",
    displayName: "Nic Carter",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=niccarter&backgroundColor=FF6B2B",
    body: "Bitcoin's energy use is a feature, not a bug. It anchors the network in physical reality. A chain that can be run on a Raspberry Pi has the security profile of a chain that can be run on a Raspberry Pi.",
    timestamp: "2025-05-21T13:55:00Z",
    factionTag: "fire",
    provocationPrompt: "Does physical energy cost scale as a security guarantee, or does it eventually become a liability? The Relays have thoughts.",
  },
  {
    id: "stark-001",
    handle: "@starkness",
    displayName: "Elizabeth Stark",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=elizabethstark&backgroundColor=00B4D8",
    body: "The Lightning Network doesn't ask Bitcoin to change. It builds routing on top of what Bitcoin does best — final settlement. L2 is not a workaround. It is the design.",
    timestamp: "2025-05-19T08:30:00Z",
    factionTag: "air",
    provocationPrompt: "L2 routing as a Relays pattern: what happens when a node on the route goes offline? The Tides want to know about the liquidity lock.",
  },
  {
    id: "stark-002",
    handle: "@starkness",
    displayName: "Elizabeth Stark",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=elizabethstark&backgroundColor=00B4D8",
    body: "Payment channels are a social contract enforced by cryptography. The two parties agree, lock funds, transact at speed, and settle when they're done. That's not a hack — that's protocol design.",
    timestamp: "2025-05-22T07:45:00Z",
    factionTag: "air",
    provocationPrompt: "If channel settlement is the truth layer, what is the threat model when the base chain is congested during closure? The Anchors want the answer on-chain.",
  },
  {
    id: "stark-003",
    handle: "@starkness",
    displayName: "Elizabeth Stark",
    avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=elizabethstark&backgroundColor=00B4D8",
    body: "Routing in Lightning is still an open problem. Finding a path that has sufficient liquidity in the right direction at the right time is a hard graph problem. We're solving it. But let's be honest about where we are.",
    timestamp: "2025-05-23T06:00:00Z",
    factionTag: "air",
    provocationPrompt: "An unsolved routing problem at the L2 layer: is that an Air failure or an Earth coordination gap?",
  },
];

export function fetchPosts(): XPost[] {
  // TODO: swap for X API — make a real fetch here and return XPost[]
  return MOCK_POSTS;
}

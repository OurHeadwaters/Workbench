export const SMITH_HECKLES = [
  "Smith asked who owns Bitcoin. I told him: everyone and no one. He filed a complaint.",
  "Smith wants to know which king is in charge of the ledger. Still waiting for my answer.",
  "Smith said decentralization sounds like a lot of people refusing to listen. He's not wrong.",
  "Smith drafted a regulation. I told him the network doesn't accept paper. He drafted another.",
  "Smith asked what happens when Bitcoin breaks. I said that's like asking what happens when math breaks.",
  "Smith wants a CEO for Ethereum. I told him Vitalik left the building. He filed a grievance.",
  "Smith believes everything good should have a governor. The blockchain respectfully disagrees.",
  "Smith tried to ban private keys. The keys were unavailable for comment.",
  "Smith asked if crypto is safe. I said: from who?",
  "Smith wants a refund on the immutable ledger.",
  "Smith submitted a Freedom of Information request for the genesis block. Still processing.",
  "Smith says you should ask permission before sending money across borders. Satoshi said nothing.",
];

export interface SaladinAnecdote {
  heading: string;
  pillarKey: string;
  body: string;
  lesson: string;
}

export const SALADIN_ANECDOTES: SaladinAnecdote[] = [
  {
    heading: "Passage Without Permission",
    pillarKey: "fire",
    body: "When Saladin secured the trade routes from Damascus to Cairo, he did not ask the merchants for permission to open the roads. He simply removed the barriers — the bandits, the tolls, the checkpoints. Within a season, caravans moved freely across three kingdoms. No treaty. No licence. Just the removal of friction.",
    lesson: "Proof-of-work does the same thing to value transfer. It doesn't ask the bank for permission to settle. It removes the checkpoint.",
  },
  {
    heading: "The Open Well",
    pillarKey: "water",
    body: "Saladin ordered wells dug along every major road through the Levant — not for his army alone, but for any traveller. His engineers said it was wasteful. He said a road no one trusts is a road no one uses. The wells were never locked.",
    lesson: "Liquidity pools work on this logic. The protocol provides the well. The rule is: anyone can drink, anyone can add water. Trust comes from the openness, not from the guard.",
  },
  {
    heading: "The Foundation Stone",
    pillarKey: "earth",
    body: "Before any tower was raised, Saladin's engineers spent months on the foundation — clearing rubble, cutting bedrock, setting courses of stone that no one would ever see. The Citadel of Cairo took twelve years and survived eight hundred. The visible part is nothing without the work beneath it.",
    lesson: "Consensus mechanisms are the foundation course. Nobody sees the Byzantine fault tolerance working. They only notice when it isn't there.",
  },
  {
    heading: "The Messenger's Oath",
    pillarKey: "air",
    body: "Saladin's diplomatic dispatches crossed enemy lines regularly during the Crusades. The messengers carried no weapons. Their protection was the oath: harm the messenger and your own messages stop moving. The entire system ran on the credibility of the protocol, not the strength of any single carrier.",
    lesson: "Oracle integrity runs on the same oath. The node doesn't need to trust the other node. Both need the protocol to keep delivering. Break the messenger, break the market.",
  },
  {
    heading: "The Council at Jerusalem",
    pillarKey: "aether",
    body: "After retaking Jerusalem in 1187, Saladin convened a council that included his generals, the city's scholars, and representatives of the Christian population he had just defeated. He did not rule by decree alone — he ruled by building enough distributed legitimacy that his governance outlasted him. The city held for nearly a century.",
    lesson: "On-chain governance works exactly like this, or fails exactly like this. A chain whose rules can be changed by one faction, one company, one Saladin — is not governing. It is being governed.",
  },
];

export type ForgePage = "forge" | "modules" | "great-hall" | "library" | "progress" | "faction" | "battle-feed" | "shallows";

export const PAGE_TIPS: Record<ForgePage, string[]> = {
  faction: [
    "Your faction is your lens. The same blockchain looks different to an Igniter than a Weaver. Pick honestly.",
    "Smith chose Earth faction. For the stability, he said. Then he asked who regulates the stability.",
    "There is no wrong faction. There is only the question you're trying to answer.",
  ],
  modules: [
    "Each module ends in The Forge. The lesson is the map. The canvas is the territory.",
    "Smith thinks modules should have a certification. I told him the Reckoning is the certification. He asked who accredits the Reckoning.",
    "Saladin didn't study war from books alone. He studied war by fighting it. Enter the module. Build the thing.",
  ],
  forge: SMITH_HECKLES.slice(0, 3),
  "great-hall": [
    "The rivalries in this hall are not bugs. Fire and Water genuinely cannot both win. That is the design.",
    "Smith asked which faction is correct. I told him they're all correct in different scenarios. He asked for a tiebreaker. I gave him the trilemma.",
    "A blockchain that resolves every rivalry has made a choice. Find the choice. That's the architecture.",
  ],
  library: [
    "Everything in this library you built. That makes it yours in a way a certificate never could.",
    "Smith audited my library. Found nothing to regulate. Left disappointed.",
    "A named pattern is a transferable idea. Name it precisely enough that someone else could reproduce it.",
  ],
  progress: [
    "Progress here means patterns named, modules completed, builds submitted. Not points. Not badges.",
    "Smith checks his progress daily. He has zero patterns named. He says the system is broken.",
    "The chain doesn't care how long you studied. It cares whether the build is structurally sound.",
  ],
  "battle-feed": [
    "These are the real arguments. Not cleaned up for a textbook. Smith is in here somewhere — he posts as @AnchorMaximalist.",
    "The Forge teaches you the elements. The Battle Feed shows you how people actually fight with them.",
    "A provocation is worth more than a position paper. It forces you to locate your actual belief.",
  ],
  shallows: [
    "The Shallows is where ideas drift before they're fully formed. This is the honest place.",
    "Smith never checks The Shallows. He says unfinished ideas are a liability. That's the tell.",
    "Zone 5 thinking: what if the thing you're building doesn't need permission to exist?",
  ],
};

export function getSmithHeckle(seed?: number): string {
  const idx = seed !== undefined
    ? seed % SMITH_HECKLES.length
    : Math.floor(Math.random() * SMITH_HECKLES.length);
  return SMITH_HECKLES[idx];
}

export function getSaladinAnecdote(pillarKey: string): SaladinAnecdote | null {
  return SALADIN_ANECDOTES.find((a) => a.pillarKey === pillarKey) ?? null;
}

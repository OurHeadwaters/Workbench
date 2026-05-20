import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const T = {
  bg:     "#1f3d2e",
  paper:  "#f4ede0",
  text:   "#2a2520",
  muted:  "#7a7a6e",
  rule:   "rgba(200,191,167,0.35)",
  accent: "#b85a3e",
  teal:   "#1F5446",
  slate:  "#4B6070",
  gold:   "#8B6914",
};

interface Point { label: string; body: string }
interface Block { title: string; badge: string; color: string; points: Point[] }

const BLOCKS: Block[] = [
  {
    title: "The catalog demo — what's built and proven",
    badge: "MAY 2026 · DEMO PROOF",
    color: T.teal,
    points: [
      {
        label: "20+ curriculum paths, mapped and working",
        body: "The Saltbox catalog demo covers more than 20 distinct Gather Round curriculum paths — not hypothetical content, but real GR material organized and navigable inside the app. A family can browse by subject, age, season, and learning style without touching a download link or a folder. This is the demo that makes the pitch real.",
      },
      {
        label: "7 real GR covers in the catalog",
        body: "Seven actual Gather Round curriculum unit covers are visible in the demo catalog — Africa, Botany, Beekeeping, Farming + Food, and others. They're not placeholders. They show exactly what a Legacy Pass family would see when they open their library: the actual books they've already paid for, organized and ready without file management.",
      },
      {
        label: "What the demo proves",
        body: "The demo answers the question Rebecca will ask before she asks it: 'Does this actually work for our content?' Yes. The organization is artistry-first — by subject and theme, not by file type or date. The content depth is real. The infrastructure (offline sync, device handoff) is live. The demo is not a mockup; it's a working product running on actual GR catalog material.",
      },
      {
        label: "The artistry-first organization principle",
        body: "GR curriculum is organized around themes and seasons, not subjects and grades. The Saltbox catalog respects that. Families navigate by the story of what they're studying — Africa leads to culture leads to language leads to cooking. That path is a curriculum arc, not a folder structure. The demo shows this working.",
      },
    ],
  },
  {
    title: "Three partnership vectors — May 2026 framing",
    badge: "PARTNERSHIP VECTORS",
    color: T.slate,
    points: [
      {
        label: "Vector A — Tech Retainer",
        body: "Headwaters builds and maintains the Saltbox platform as Gather Round's official offline content delivery layer. GR pays a monthly or annual tech retainer for access, support, and continued development. Year 1 is endorsement-level (low fee or pilot rate). Year 2 moves to a formal retainer. This is the lowest-friction entry point — it asks GR to pay for something they'd otherwise need to build or hire for.",
      },
      {
        label: "Vector B — Co-brand",
        body: "Saltbox becomes 'Gather Round Offline Library' or similar — a co-branded product offered as an add-on to the Legacy Pass or as a premium upgrade. GR controls the brand; Headwaters runs the platform. Revenue share model: GR takes the customer relationship, Headwaters takes a per-user or percentage fee. This is the middle path — more revenue potential than a retainer, more GR involvement than pure tech.",
      },
      {
        label: "Vector C — Acquisition",
        body: "Gather Round acquires Saltbox outright, or acquires the GR-specific instance of it. Headwaters builds to a proof point — adoption, retention, user stories — and then sells the platform or licenses it exclusively to GR. Year 3 territory. This is the highest-value exit for Headwaters but requires 2 years of demonstrated performance first. Don't lead with this. Know it's possible.",
      },
      {
        label: "Sequencing — how the vectors layer",
        body: "Start with Vector A framing: tech retainer, low friction, one decision. If the relationship deepens, the co-brand conversation opens naturally. If GR wants to own the capability rather than license it, Vector C is the off-ramp. The three vectors aren't competing options — they're a progression. Year 1: endorsement. Year 2: retainer or co-brand. Year 3: acquisition or deep partnership.",
      },
    ],
  },
  {
    title: "Revenue model by year",
    badge: "YEAR-BY-YEAR",
    color: T.accent,
    points: [
      {
        label: "Year 1 — Endorsement",
        body: "GR endorses Saltbox to their Legacy Pass community. Saltbox is offered free to all Legacy Pass holders for Year 1. Headwaters earns a flat pilot fee (propose $2,500/quarter, $10,000/year) or nothing — the goal is adoption data and user stories, not revenue. The founding cohort is the credential. Year 1 is seeding, not selling.",
      },
      {
        label: "Year 2 — Retainer",
        body: "With adoption data in hand, the conversation moves to a formal tech retainer. Headwaters proposes a per-verified-user annual fee ($8–$12/user/year) or a flat retainer based on the pilot size. Conservative case: 3,750 users at $8 = $30,000/year. Mid case: 6,000 users at $10 = $60,000/year. The retainer is the first real recurring revenue from the GR relationship.",
      },
      {
        label: "Year 3 — Acquisition or Deep Partnership",
        body: "By Year 3, Saltbox has adoption data, user stories, and a proven delivery model. GR can acquire the platform (negotiated price), enter a co-brand agreement, or continue the retainer at scale. The acquisition conversation is triggered by GR wanting to own the capability rather than license it. Headwaters is ready for any of the three outcomes.",
      },
      {
        label: "What this isn't",
        body: "This is not a subscription pitch to families. Families pay nothing extra — ever. The revenue model lives entirely between Headwaters and Gather Round. This matters for how the partnership is framed to the GR community: 'Saltbox is a gift to Legacy Pass holders' is true and sustainable because the platform is funded by the institutional relationship, not family wallets.",
      },
    ],
  },
  {
    title: "The compound content graph",
    badge: "CONTENT DEPTH",
    color: T.gold,
    points: [
      {
        label: "Africa → Botany → Beekeeping → Farming + Food",
        body: "These four Gather Round units form a content arc — they're not separate topics, they're a sequence. Africa introduces geography and culture. Botany builds on that with plant life and growing systems. Beekeeping connects to ecology and food production. Farming + Food closes the loop on where food comes from and how communities sustain themselves. A family can follow this arc across an entire year without ever leaving the GR catalog.",
      },
      {
        label: "What this shows about the catalog",
        body: "GR doesn't teach in isolated units. The curriculum is designed as a living map — subjects connect to each other, build on each other, and reinforce each other over time. Saltbox's organization mirrors this: not 'here are all your PDFs' but 'here is where you are in the arc and what comes next.' That's a fundamentally different experience than a download folder.",
      },
      {
        label: "Why this matters for the pitch",
        body: "Rebecca built a curriculum that's meant to be experienced as a whole, not downloaded one piece at a time. The manual download model fragments that experience — families end up with disconnected files instead of a coherent curriculum journey. Saltbox restores the arc. When you show Rebecca the compound content graph in the demo, you're showing her that you understand what she built.",
      },
      {
        label: "The infrastructure depth point",
        body: "The compound graph also demonstrates infrastructure credibility: to map 20+ paths and show how 7 units connect and compound, Saltbox had to understand the GR catalog well enough to build a navigation layer on top of it. This isn't a scraper or a generic file manager. It's a tool that knows GR's curriculum.",
      },
    ],
  },
  {
    title: "The Canadian mom register — how to open the conversation",
    badge: "CONVERSATION SCRIPT",
    color: T.teal,
    points: [
      {
        label: "Why register matters",
        body: "Rebecca Spooner is a Canadian mom running a homeschool curriculum business from Georgia. She knows what it's like to be the Canadian in an American market — building something real without institutional support, making it work on trust and community rather than funding. That's your register. Don't pitch to her like a founder. Talk to her like someone who gets it.",
      },
      {
        label: "Opening line — peer-to-peer, not founder-to-founder",
        body: "'I'm a homeschooling mother, Legacy Pass member, and community development practitioner based in Wabigoon, Ontario.' Three facts. No pitch. No product. Just standing. She now knows: you're a customer (Legacy Pass member), you're a peer (homeschooling mother), and you have professional context (practitioner). Everything else follows from that.",
      },
      {
        label: "The problem in one sentence",
        body: "'The single-download model creates real friction — families spend more time managing files than using them, especially in rural areas where signal is unreliable.' This is what a Legacy Pass holder actually experiences, stated without jargon. She doesn't need to be convinced the problem is real. She already knows. Your job is to name it so she nods before she reads the next line.",
      },
      {
        label: "The ask — small and specific",
        body: "'Would a 20-minute call make sense?' Not a proposal. Not a partnership pitch. Not a demo deck. A 20-minute call. The ask is proportional to what you're asking her to believe at this point — which is nothing more than: 'this person might have something worth five minutes of conversation.' Make the ask easy to say yes to.",
      },
      {
        label: "What not to say in the first exchange",
        body: "Do not mention blockchain, NFTs, XRPL, or Mighty Networks by name. Do not reference her hiring post. Do not frame this as a business proposition. Do not send a pitch deck, a feature list, or a revenue model. The first exchange is a door. All the content — the demo, the credential architecture, the revenue path — comes on the call, when she's already said yes.",
      },
      {
        label: "After she responds — what to bring to the call",
        body: "When she agrees to a call: open with the compound content graph demo (Africa → Botany → Beekeeping → Farming + Food). Show the catalog demo with 7 real GR covers. Let her see that you understand her curriculum. Then show the offline delivery — a family loading their library without internet. Then show the QR handoff. Only after all that, if she asks how verification works, explain the credential architecture in plain language. The demo does the work. The tech is the answer to her questions, not the pitch.",
      },
    ],
  },
  {
    title: "What this is",
    badge: "THE OPPORTUNITY",
    color: T.teal,
    points: [
      {
        label: "Gather Round Legacy Pass",
        body: "Gather Round is a Christian homeschool curriculum company founded in 2019 by Rebecca Spooner — homeschool mom of five, second-generation homeschooler, now building a significant multi-product business. The Legacy Pass is a one-time lifetime purchase that unlocks the full curriculum library plus all future releases. Delivery is entirely download-based. Families manage hundreds of PDFs manually across devices — download from the website, sort into folders, repeat. That's friction every single week, for every family.",
      },
      {
        label: "They have an app — and it doesn't solve this",
        body: "Gather Round launched their own app in April 2025, built on Mighty Networks (a white-label community platform). The app is a strong community tool: forums, live class replays, discussion, podcasts. It does not and cannot manage the Legacy Pass content library. Mighty Networks has no offline access, no native file downloads, and no local content storage — these are confirmed platform-level limitations, not gaps they're planning to close. Legacy Pass families still go to the website to download files. The app doesn't change that.",
      },
      {
        label: "The identity layer — blockchain membership token",
        body: "A Legacy Pass holder's ownership is verified via a blockchain membership token. Saltbox reads that token without calling back to Gather Round's server. The pass travels with the family — not with a download link. This is the technical core that makes the partnership real rather than just a referral arrangement.",
      },
      {
        label: "Why this matters to Headwaters",
        body: "Saltbox already needs to exist for the Codetry model to reach homeschooling communities in the north. If Gather Round families become early users, Saltbox gains a proven customer base, a credibility story, and a revenue path — before a single NAN community is formally onboarded.",
      },
    ],
  },
  {
    title: "Know their stack before you walk in",
    badge: "TECH INTELLIGENCE",
    color: T.gold,
    points: [
      {
        label: "Their app is Mighty Networks — a community platform",
        body: "The Gather Round app (launched April 2025, on iOS and Android) is a white-label build on Mighty Networks, formerly MightyBell. Mighty Networks is excellent at what it does: community discussion, live event replays, courses, podcasts. It powers thousands of online communities. It is not a content delivery or file management platform — and it was never designed to be. This distinction is the foundation of your pitch.",
      },
      {
        label: "Mighty Networks cannot go offline — ever",
        body: "This is a confirmed, permanent, platform-level limitation: Mighty Networks requires an active internet connection for all content access. No offline mode. No content caching. No local storage. Every member of the Gather Round community using their app — including every Legacy Pass holder — loses access the moment they lose signal. For a curriculum used by families in rural areas, in trucks, at the kitchen table with spotty wifi, this is a real daily problem.",
      },
      {
        label: "Mighty Networks cannot handle file downloads",
        body: "The Legacy Pass is a library of PDFs, printables, and curriculum files. Mighty Networks has no native mechanism to download files to a device for offline use — members can view course content online but cannot save it locally through the app. Legacy Pass families are still going to the Gather Round website, downloading files manually, and organizing them in their own folder systems. The app does not change this at all.",
      },
      {
        label: "The Data Entry Clerk is bridging Shopify to Mighty Networks by hand",
        body: "Gather Round sells through Shopify. Their community and courses live in Mighty Networks. These are two separate systems with no native integration that handles membership tiers, Legacy Pass verification, or enrollment sync automatically. The Data Entry and Software Implementation Clerk role exists to move data between them manually — importing purchases, migrating memberships, updating enrollment lists. Saltbox doesn't compete with Mighty Networks. It fills what Mighty Networks cannot touch.",
      },
      {
        label: "How to say this in the email",
        body: "You don't need to name-drop Mighty Networks or reveal how much you know. Say it simply: 'I noticed your app focuses on community and live learning — which it does really well. I've been building a companion tool for the offline curriculum side: local-first, device-synced, works without internet. For Legacy Pass families especially, I think it fills a gap your current setup doesn't cover.' That's all. It shows you've looked, you respect what they've built, and you're offering something that fits alongside it.",
      },
    ],
  },
  {
    title: "Three revenue paths",
    badge: "ROI OPTIONS",
    color: T.slate,
    points: [
      {
        label: "Option A — Freemium + licensing",
        body: "Saltbox is free for verified Gather Round Legacy Pass holders. Headwaters earns a per-verified-user licensing fee from Gather Round — paid quarterly. Low friction for families. Gather Round retains the billing relationship. Headwaters scales revenue with adoption without charging families directly.",
      },
      {
        label: "Option B — Bundle",
        body: "Gather Round bundles Saltbox access as a premium add-on at Legacy Pass renewal or as a standalone upgrade. Families pay Gather Round a higher price; Headwaters receives a revenue share. This positions Saltbox as an official Gather Round product — not a third-party integration.",
      },
      {
        label: "Option C — Concierge",
        body: "Headwaters charges families directly for a one-time setup + ongoing support subscription. $97–$197 setup, $12–$19/month. This path requires no Gather Round partnership at all — it works with any content the family already owns. Slower to scale but highest margin and full independence.",
      },
      {
        label: "Recommended starting posture",
        body: "Begin with Option A framing when you contact Gather Round — it asks least of them and removes the 'charging families more' objection. Keep Option C in your back pocket as the fallback that proves the model doesn't depend on their cooperation.",
      },
      {
        label: "Year one free — is this wise for the long game?",
        body: "Yes. Here's the logic: Saltbox is Zone 0 in the Codetry model — the household layer. Without household penetration, the entire zone economy has no foundation to build on. Free year one is not charity; it's seeding. You need families using Saltbox before any of the higher zones have anything to compound. Gather Round gives you 100,000 qualified households you could not otherwise reach. The membership token is the identity anchor — once a family has it, their curriculum library, schedule, and device handoff history are all tied to it. That's not a relationship you lose when a subscription lapses. The risk of charging too early is near-zero uptake, no identity layer, and no foundation for Zones 1–5. The risk of free year one is a year of building with real users and real evidence. One nuance: frame it as 'included for founding Legacy Pass families in the pilot year' — not 'free forever.' The founding cohort is the credential; the scarcity is real.",
      },
    ],
  },
  {
    title: "Option A · Financial model",
    badge: "YOUR NUMBER AT 75%",
    color: T.accent,
    points: [
      {
        label: "What we know about the market",
        body: "Gather Round serves 100,000+ families across 70+ countries. The Legacy Pass is a one-time lifetime purchase, capped at an undisclosed number — sold in limited windows, potentially never returning. Premium lifetime products in markets this size typically represent 5–12% of total customers. That puts the total Legacy Pass pool at roughly 5,000–12,000 holders. There is no public confirmation of the exact number. These projections use an honest range.",
      },
      {
        label: "You already have one data point — you",
        body: "You're a Legacy Pass holder. That means your demo is built on real content you already own. Your outreach email can open with 'As a Legacy Pass holder myself, I've been building a tool for this exact problem.' That one sentence changes the entire credibility dynamic. It's not a cold pitch from a developer. It's a customer who built a solution to their own problem and is offering to share it.",
      },
      {
        label: "The licensing fee assumption",
        body: "Option A: Gather Round pays Headwaters a per-verified-user annual licensing fee — Saltbox is free to Legacy Pass families, Gather Round carries the cost as a platform improvement. A reasonable B2B platform licensing fee for this use case is $8–$15/user/year. This reflects reduced support burden, improved Legacy Pass retention, and enhanced value for future pass sales. It's less than one support email per user resolved per year at any reasonable support cost.",
      },
      {
        label: "The projection at 75% — conservative",
        body: "Pool: 5,000 Legacy Pass holders. 75% adoption: 3,750 users. At $8/user/year: $30,000/year ($7,500/quarter). At $12/user/year: $45,000/year ($11,250/quarter). This is the floor. It assumes the smallest plausible Legacy Pass pool and a mid-range licensing rate. For a solo practitioner operation, $30–45K/year in recurring quarterly licensing revenue is a meaningful, defensible baseline.",
      },
      {
        label: "The projection at 75% — mid",
        body: "Pool: 8,000 Legacy Pass holders. 75% adoption: 6,000 users. At $8/user/year: $48,000/year ($12,000/quarter). At $12/user/year: $72,000/year ($18,000/quarter). This is the most likely range given a 100,000-family customer base and a well-received premium lifetime product. $48–72K/year in recurring revenue, with no per-family billing relationship to manage.",
      },
      {
        label: "The projection at 75% — optimistic",
        body: "Pool: 12,000 Legacy Pass holders. 75% adoption: 9,000 users. At $12/user/year: $108,000/year ($27,000/quarter). At $15/user/year: $135,000/year ($33,750/quarter). This requires a larger Legacy Pass pool and a higher licensing rate — both defensible given the demonstrated value. $108–135K/year puts this in the range of a funded product line, not a side project. This number is what you're building toward, not what you negotiate on day one.",
      },
      {
        label: "What to negotiate first",
        body: "Don't open with the per-user rate. Open with the problem and the demo. If she wants to move forward, propose a pilot: 500 families, flat $2,500/quarter pilot fee, 90-day trial. That's $10,000/year at a fraction of the eventual rate — low enough she says yes without a budget fight, high enough to prove commercial intent on both sides. After 90 days, you have adoption data to justify the full per-user rate.",
      },
    ],
  },
  {
    title: "Three-track roadmap",
    badge: "WHAT TO BUILD AND WHEN",
    color: T.gold,
    points: [
      {
        label: "Track 1 — Core product polish (Weeks 1–2)",
        body: "Offline content delivery, device sync, folder-free organisation. This is what makes Saltbox worth pitching. A demo that shows a family loading curriculum content on an iPad without internet — no folder management — is the whole argument. Build this first regardless of whether Gather Round says yes.",
      },
      {
        label: "Track 2 — Proof of concept (Weeks 2–4) · COMPLETE",
        body: "Blockchain membership token for Legacy Pass verification — built. The credential flow is live: families enter a blockchain wallet address, Saltbox verifies the membership token on the public ledger directly (no server call, no API key), and Founding Family status is granted and stored locally. A simulation mode exists for demo runs before real tokens are in the wild. QR device-to-device handoff is also built: a full offline curriculum transfer — all children, all files, all schedules — bundled and moved to a second device by scanning a QR code. One-time use, auto-deletes on claim. Both of these can be demonstrated right now.",
      },
      {
        label: "Track 3 — Make contact (Weeks 3–4, parallel)",
        body: "Research Gather Round's leadership — likely a small family-owned operation, founder-led. Find the right contact (not a support inbox). Prepare a one-page pitch: the problem you solve for their customers, the credential architecture, one revenue option to react to. The goal of the first contact is a 20-minute call, not a signed agreement.",
      },
      {
        label: "What a successful 4-week sprint looks like",
        body: "You have a working demo. You have 3 user stories from real families. You have sent one warm, specific outreach message to one real person at Gather Round. You are in conversation — not waiting on a decision. Everything else is optional.",
      },
    ],
  },
  {
    title: "Risks and honest limits",
    badge: "WHAT COULD GO WRONG",
    color: T.accent,
    points: [
      {
        label: "Gather Round may not be interested",
        body: "They may see a third-party app as a distraction, a liability, or a brand dilution risk. Their customer relationship is valuable to them. If they say no, Option C still works — and the blockchain membership token architecture makes Saltbox interoperable with any other content provider who wants it.",
      },
      {
        label: "Membership token language — calibrate it carefully",
        body: "In any family-facing communication, call it a 'membership token,' 'verified pass,' or 'digital credential.' Never say 'NFT' to a homeschool family — the word carries speculative-asset associations that will derail the conversation. 'Blockchain' is fine if the context is 'we use a secure public ledger to confirm your pass, no account needed' — it's an explanation, not a selling point. The back-end detail is irrelevant. What matters to families: it's private, it's permanent, and it works offline.",
      },
      {
        label: "Saltbox requires real technical investment",
        body: "Offline sync, credential verification, and content delivery across platforms is not a weekend project. The 4-week sprint above assumes focused part-time development — probably Tyler's time. Scope against the Codetry Phase 2 timeline before committing.",
      },
      {
        label: "Don't let this crowd out Phase 1",
        body: "The Deer Lake Phase 1 engagement is the ground truth. Saltbox and Gather Round are a parallel track — a legitimate one — but not a replacement for the work that funds the operation. Timebox the exploration so it doesn't bleed into your core deliverables.",
      },
    ],
  },
  {
    title: "First action",
    badge: "YOUR NEXT MOVE",
    color: T.teal,
    points: [
      {
        label: "The one thing to do this week",
        body: "Write one paragraph that describes the Legacy Pass download problem in plain language — from the family's perspective, not from a product pitch. Read it to someone who homeschools. If they say 'yes, exactly' — you have your opening line for the Gather Round email.",
      },
      {
        label: "The email is not a pitch",
        body: "It is a problem statement followed by a question. Something like: 'I've been building a local-first app for homeschooling families and noticed Legacy Pass holders spend a lot of time managing files. Would it make sense to show you what I've built and see if it's useful to your customers?' That's it. Two sentences. One ask.",
      },
      {
        label: "Do not pitch the NFT in the first email",
        body: "Lead with the problem. Lead with the family experience. If you get a call, bring the credential architecture as the answer to 'how does that work?' — not as the opening hook.",
      },
    ],
  },
  {
    title: "She's building the team — we build the tools",
    badge: "LIVE INTELLIGENCE · MAY 2026",
    color: T.teal,
    points: [
      {
        label: "Who you're pitching — Rebecca Spooner",
        body: "Founder and CEO. Homeschool mom of five, second-generation homeschooler, married to an RCMP officer, based in Winterville, Georgia. She built Gather Round from scratch in 2019 and has taken no outside funding. She describes herself as 'surviving on coffee and Jesus.' She is a Canadian in the American homeschool market — and she knows what it's like to build something real from the ground up without institutional support. That's common ground. Don't waste it on a generic cold pitch.",
      },
      {
        label: "What the hiring post tells us",
        body: "Gather Round is actively hiring a 'Data Entry and Software Implementation Clerk' to handle course, subscription, membership, and enrollment data migrations. The role description — 80 wpm typing, file import/export, copy/paste between systems — is a manual workaround for a missing tech stack. Specifically: someone to bridge Shopify (sales) and Mighty Networks (community) by hand, because there's no automated integration between the two systems. They are paying a person to do what software should do automatically. This confirms they are mid-migration, the problem is live, and the timing is real.",
      },
      {
        label: "Do not lead with job replacement",
        body: "Pitching 'I could save you from hiring 2–3 people' creates anxiety in a founder who's already mid-process. She has momentum. Stalling a hire she's already committed to feels like a threat, not an opportunity — even if you're right. The people-first, community-driven nature of Gather Round's brand makes this doubly risky. Do not open with subtraction.",
      },
      {
        label: "The right pitch — compound the human value",
        body: "What to actually say: 'You're building a team to run your new offerings. I can build the platform before your new hires start — so they walk in on day one with working infrastructure instead of a data migration project. Your clerk becomes a Platform Administrator. Your team's time goes to relationships and growth rather than spreadsheets and file imports. The system compounds: each person you hire becomes more effective, not more dependent on manual process.' This is the Codetry model stated plainly. It's also true.",
      },
      {
        label: "Blockchain membership — hold for the second conversation",
        body: "The flexibility angle is real and compelling: a blockchain-anchored membership platform means she can add token-based tiers, transferable passes, alumni credentials, or resale-protected content — without rebuilding from scratch when her offerings evolve. But surface this after she says yes to the base build. Lead with the problem her clerk will solve. Offer the blockchain architecture as 'why this doesn't hit a ceiling the way a Kajabi or Teachable build does.' It's the answer to a question she'll ask once she's already bought in, not the hook that gets her there.",
      },
      {
        label: "The full hiring picture — 11 open positions",
        body: "Gather Round is not making one or two hires. They have 11 open roles: Video Editor, Customer Experience Specialist, Education Sales Coordinator, Media Buyer, Administrative Assistant, Designer (Promotional), Illustrator, Online Academy Teacher, Warehouse Labourer, Writer, and Data Entry & Software Implementation Clerk. This is a company in full-scale build mode — standing up new revenue streams, content delivery, and operations all at once. The timing is not incidental.",
      },
      {
        label: "Roles the platform directly reduces",
        body: "Data Entry & Software Implementation Clerk — this role exists entirely because they lack the right tooling. A working membership + content sync platform eliminates 80–90% of its stated scope. Administrative Assistant — automated enrollment, membership status management, and communications routing cuts admin overhead significantly. One person can carry what they're currently sizing for two or three. These two alone represent the core ROI argument.",
      },
      {
        label: "Roles the platform amplifies",
        body: "Customer Experience Specialist — a self-service member portal, automated order status, and a knowledge base let one CX person carry 3x the ticket volume without burning out. Education Sales Coordinator — automated enrollment funnels and a sales tracking dashboard mean the coordinator spends time on relationships, not manual follow-up. Online Academy Teacher — the course delivery platform is the infrastructure the teacher needs; better tooling means more students per teacher without adding more teachers.",
      },
      {
        label: "Roles with no honest tech angle",
        body: "Warehouse Labourer — physical fulfilment, no tech play. Illustrator and Designer (Promotional) — creative work, not reduceable by platform. Video Editor — same. Writer — content management tools help marginally but don't replace the creative function. Media Buyer — analytics tooling can sharpen their work but a platform build doesn't change the headcount equation here. Be honest about which roles you touch and which you don't.",
      },
      {
        label: "What this adds up to — internal framing only",
        body: "A well-built membership and content platform plausibly touches 5 of the 11 roles — directly reducing 2, meaningfully amplifying 3. That is a strong ROI case for you to hold internally. It is not the opening line. The pitch to her remains: your team arrives to working infrastructure instead of a backlog. She will do the math on headcount herself, in her own time, with her own numbers.",
      },
    ],
  },
  {
    title: "What exists right now — May 19, 2026",
    badge: "BUILT TODAY",
    color: T.gold,
    points: [
      {
        label: "Device-to-device QR handoff",
        body: "A family can now transfer their entire Saltbox setup — all children, all curriculum files (PDFs, audio, images), all schedules — to a second device by scanning a QR code. The app bundles everything into a compressed archive, generates a one-time QR code, and the second device claims it in one tap. The transfer auto-deletes after claim and expires in 15 minutes. No cloud account. No email. No login. This is the demo that makes the offline promise concrete. A second parent, a grandparent, a co-op leader — anyone who needs the same library gets it in under a minute.",
      },
      {
        label: "Legacy Pass membership token verification",
        body: "The credential flow is live. In Settings → 'Gather Round Legacy Pass,' a family enters their blockchain wallet address. Saltbox checks the public ledger directly — no Saltbox server call, no API key — and if the membership token is present, Founding Family status is granted and stored locally. A simulation mode (one environment variable) runs the full flow before any real tokens exist, which means you can demo this to Rebecca before she has issued a single token to anyone. Her only setup step is creating one blockchain wallet.",
      },
      {
        label: "Evidence Package — printable",
        body: "A print-ready one-pager for the tester pilot. Left side: a 5-step demo flow and technical proof summary for the person running the session. Right side: a live demo QR code and three family story boxes — editable, saved to localStorage — for capturing friction-reduction accounts after families have used it. After 3–5 tester sessions, this document becomes the evidence you bring to the second Gather Round conversation.",
      },
      {
        label: "First-contact pitch document — printable",
        body: "A print-ready pitch page for the first conversation with Rebecca. Covers the customer problem in plain language, what Saltbox does, the credential architecture in one paragraph, the ask (20-minute call), and one revenue option. The sender fields — name, contact, personal note — are editable inline and save to localStorage so the document is personalised before printing. No export step.",
      },
      {
        label: "What's still needed before going live",
        body: "On Gather Round's side: create a blockchain wallet (Xaman app, ~$15 CAD in reserve), decide how to handle existing Legacy Pass holders (a claim campaign or batch mint), and issue test tokens to 3–5 pilot families. On Saltbox's side: deploy to a stable public URL (one-click, already ready), set one environment variable to Gather Round's real wallet address, confirm the token category with GR. Realistic timeline from 'she says yes' to '5 families have it working': 3–4 weeks, gated almost entirely on GR's pace.",
      },
    ],
  },
  {
    title: "When she asks how it works",
    badge: "TECH COACHING SHEET",
    color: T.slate,
    points: [
      {
        label: "If she asks: 'What is a blockchain wallet?'",
        body: "A blockchain wallet is like a digital key ring. It doesn't hold money — it holds credentials. When Gather Round creates a wallet, they get a public address (a long string of letters and numbers) that can issue membership tokens to families. You configure Saltbox with that address once. After that, any family whose wallet contains a Gather Round token is automatically verified. No database to maintain. No passwords to reset. No account the family can lose access to.",
      },
      {
        label: "If she asks: 'Do families need to buy cryptocurrency?'",
        body: "No. The token lives in a free wallet app (Xaman, available on iOS and Android). Families receive the token from Gather Round — they don't purchase it. There's no transaction cost to claim it. The blockchain is just the ledger that records who holds what. Families never see a crypto exchange, never buy anything, never provide payment information to anyone.",
      },
      {
        label: "If she asks: 'What if a family loses their wallet?'",
        body: "The wallet app stores a 12-word recovery phrase. If a phone is lost, the family reinstalls the wallet app, enters their phrase, and their token is back. It's similar to recovering a password manager. Gather Round doesn't need to re-issue anything. This is the key advantage over a download link or a login: the credential belongs to the family, not to a server that can go down or a link that expires.",
      },
      {
        label: "If she asks: 'Is this secure?'",
        body: "More secure than a download link. A download link can be forwarded, screenshotted, or scraped. A blockchain membership token can only be used by the wallet that holds it — and the wallet is protected by the family's 12-word phrase, which Gather Round never sees. Saltbox doesn't call back to any Gather Round server when it verifies — it reads the public ledger directly, the same way you'd look up a public record. There's nothing for a hacker to steal from Gather Round's side.",
      },
      {
        label: "If she asks: 'What does Gather Round actually have to do?'",
        body: "One time: create a blockchain wallet using the Xaman app (~15 minutes, ~$15 CAD reserve). Tell Saltbox the wallet address (one environment variable). Decide how to issue tokens to existing Legacy Pass holders — options are a self-serve claim flow or a batch issuance. That's the entire technical lift. After that, every new Legacy Pass sale can include token issuance automatically. Nothing else changes on Gather Round's side — no new infrastructure, no new subscriptions, no new vendors.",
      },
      {
        label: "If she asks: 'What does it cost Gather Round?'",
        body: "The wallet reserve (~$15 CAD, one time). Saltbox handles everything else — verification, storage, offline delivery. If you're discussing Option A (licensing), Gather Round pays Headwaters a per-verified-user annual fee; families pay nothing extra. The licensing fee is the only recurring cost to Gather Round, and it's offset by Legacy Pass retention improvement, reduced support load, and enhanced value for future pass sales.",
      },
    ],
  },
  {
    title: "After she says yes",
    badge: "GO-LIVE CHECKLIST",
    color: T.teal,
    points: [
      {
        label: "Gather Round's four steps (her side)",
        body: "1. Create a blockchain wallet — Xaman app, iOS or Android, ~15 minutes, ~$15 CAD reserve. 2. Share the public wallet address with Saltbox (one message or email). 3. Issue test tokens to 3–5 pilot families — this can be done manually in the Xaman app for the pilot. 4. Announce the pilot to the Legacy Pass community via newsletter when ready. Steps 1–3 can happen in the same week. Step 4 comes after the pilot proves the flow.",
      },
      {
        label: "Saltbox's four steps (your side)",
        body: "1. Deploy Saltbox to a stable public URL — one-click deploy, already ready to go. 2. Set the wallet address environment variable to Gather Round's real address. 3. Confirm the token category number with GR (currently set to 1 in the code — just needs verification). 4. Add a short 'how to get a blockchain wallet' guide inside the verification page before wider rollout — not needed for the pilot, but needed before the newsletter goes out. Steps 1–3 take under an hour.",
      },
      {
        label: "The pilot shape",
        body: "Three to five families who already hold a Legacy Pass. They install Saltbox, enter their wallet address, receive Founding Family status, load their curriculum, and try the QR handoff to a second device. After two weeks, each family writes or records one paragraph about what changed. That paragraph is your evidence. The pilot proves the flow is reliable before you ask Rebecca to announce it to the full community.",
      },
      {
        label: "What 'success' looks like at 30 days",
        body: "Five families have used Saltbox without a support request. At least three have stories worth publishing. The QR handoff has been used at least once by a real family (not just in testing). The credential verification has worked on at least two different device types. Gather Round has seen the evidence package. The conversation has moved from 'is this real?' to 'how do we roll it out?'",
      },
    ],
  },
];

function EmailDraft() {
  const emailParas = [
    "Hi Rebecca,",
    "I'm a homeschooling mother, Legacy Pass member, and community development practitioner based in Wabigoon, Ontario — and over the past few years I've been building a local-first app for myself and the other mothers in our local Gather Round group to manage our curriculum files offline.",
    "What I keep seeing across these families is a quiet but recurring stress: the single-download model creates real friction. A lot of households either spend more time managing files than using them, or quietly avoid local storage altogether and carry the low-grade anxiety of not actually having what they need when they need it — especially in rural areas where signal is unreliable.",
    "I'd love to show you what I've built and hear whether it might be useful to your community. If it seems like a fit, would a 20-minute call make sense?",
    "Bobbie",
  ];

  const notes = [
    {
      label: "What's doing the work here",
      body: "Three lines establish standing before you ask for anything: homeschooling mother (peer), Legacy Pass member (customer), community development practitioner (professional). The problem is named without naming the product — she can nod along before being asked anything. 'Our local Gather Round group' signals this isn't abstract; you're describing what you've actually watched. The ask is specific (a 20-minute call) and gated ('if it seems like a fit') — it gives her an easy out and makes yes feel low-stakes.",
    },
    {
      label: "What to leave out of the first email",
      body: "Do not mention blockchain, membership tokens, or any credential architecture. Do not reference Mighty Networks by name. Do not mention her hiring post. Do not frame this as a business proposition — you're a customer who built something and wants to know if it's useful. The product, the tech, and the partnership framing all come later, on the call, when she asks.",
    },
    {
      label: "When to send it",
      body: "After you have a working demo — even a rough one. The email opens a conversation; the demo is what makes the call worth taking. Don't send it cold and promise something you can't show yet. Tuesday or Wednesday morning before 10 AM EST performs best for founder cold outreach. Find her direct email — not the support inbox.",
    },
  ];

  return (
    <div style={{
      borderRadius: 10,
      border: `1px solid ${T.rule}`,
      overflow: "hidden",
      marginBottom: 14,
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 16px",
        backgroundColor: T.teal,
        display: "flex",
        alignItems: "baseline",
        gap: 10,
      }}>
        <span style={{
          fontSize: 9, fontWeight: 900, letterSpacing: "0.22em",
          textTransform: "uppercase" as const, color: "#fff",
        }}>FIRST CONTACT · DRAFT</span>
        <span style={{
          fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600,
          fontFamily: "var(--font-display, Georgia, serif)",
        }}>The email to Rebecca</span>
      </div>

      {/* Subject */}
      <div style={{
        padding: "10px 16px",
        backgroundColor: T.paper,
        borderBottom: `1px solid ${T.rule}`,
        display: "flex",
        gap: 10,
        alignItems: "baseline",
      }}>
        <span style={{
          fontSize: 9, fontWeight: 900, letterSpacing: "0.16em",
          textTransform: "uppercase" as const, color: T.muted,
          flexShrink: 0,
        }}>Subject</span>
        <span style={{ fontSize: 13, color: T.text, fontWeight: 600, lineHeight: 1.4 }}>
          A file management problem I keep running into with Legacy Pass families
        </span>
      </div>

      {/* Email body */}
      <div style={{
        padding: "20px 22px",
        backgroundColor: "#faf7f1",
        borderBottom: `1px solid ${T.rule}`,
      }}>
        {emailParas.map((para, i) => (
          <p key={i} style={{
            fontSize: 14,
            color: T.text,
            lineHeight: 1.8,
            margin: i < emailParas.length - 1 ? "0 0 14px" : "0",
            fontFamily: "var(--font-body, Inter, sans-serif)",
          }}>
            {para}
          </p>
        ))}
      </div>

      {/* Commentary */}
      <div style={{ backgroundColor: T.paper }}>
        {notes.map((n, i) => (
          <div key={n.label} style={{
            padding: "14px 16px",
            borderBottom: i < notes.length - 1 ? `1px solid ${T.rule}` : "none",
            display: "flex",
            gap: 12,
          }}>
            <div style={{
              width: 3, borderRadius: 2, backgroundColor: T.teal,
              flexShrink: 0, alignSelf: "stretch", minHeight: 16,
            }} />
            <div>
              <p style={{
                fontSize: 10, fontWeight: 900, letterSpacing: "0.14em",
                textTransform: "uppercase" as const, color: T.teal, margin: "0 0 5px",
              }}>{n.label}</p>
              <p style={{ fontSize: 13, color: T.text, lineHeight: 1.65, margin: 0 }}>
                {n.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Block({ b }: { b: Block }) {
  return (
    <div style={{
      borderRadius: 10,
      border: `1px solid ${T.rule}`,
      overflow: "hidden",
      marginBottom: 14,
    }}>
      <div style={{
        padding: "10px 16px",
        backgroundColor: b.color,
        display: "flex",
        alignItems: "baseline",
        gap: 10,
      }}>
        <span style={{
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.22em",
          textTransform: "uppercase" as const,
          color: "#fff",
        }}>
          {b.badge}
        </span>
        <span style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.75)",
          fontWeight: 600,
          fontFamily: "var(--font-display, Georgia, serif)",
        }}>
          {b.title}
        </span>
      </div>
      <div style={{ backgroundColor: T.paper }}>
        {b.points.map((p, i) => (
          <div
            key={p.label}
            style={{
              padding: "14px 16px",
              borderBottom: i < b.points.length - 1 ? `1px solid ${T.rule}` : "none",
              display: "flex",
              gap: 12,
            }}
          >
            <div style={{
              width: 3,
              borderRadius: 2,
              backgroundColor: b.color,
              flexShrink: 0,
              alignSelf: "stretch",
              minHeight: 16,
            }} />
            <div>
              <p style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: b.color,
                margin: "0 0 5px",
              }}>
                {p.label}
              </p>
              <p style={{
                fontSize: 13,
                color: T.text,
                lineHeight: 1.65,
                margin: 0,
              }}>
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SaltboxGatherRound() {
  const [, navigate] = useLocation();

  return (
    <div style={{
      maxWidth: 660,
      margin: "0 auto",
      padding: "28px 16px 64px",
      fontFamily: "var(--font-body, Inter, sans-serif)",
    }}>

      {/* Back */}
      <button
        onClick={() => navigate(`${BASE}/`)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11,
          color: T.muted,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: 20,
        }}
      >
        ← Lobby
      </button>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: T.slate,
          margin: "0 0 8px",
        }}>
          Saltbox × Gather Round · Partnership & ROI Strategy
        </p>
        <h1 style={{
          fontSize: 28,
          fontWeight: 600,
          lineHeight: 1.2,
          color: T.paper,
          fontFamily: "var(--font-display, Georgia, serif)",
          margin: "0 0 10px",
        }}>
          The Offline Curriculum Easy Button
        </h1>
        <p style={{
          fontSize: 13,
          color: T.muted,
          lineHeight: 1.6,
          margin: 0,
          maxWidth: 520,
        }}>
          Saltbox solves the download management problem for Gather Round Legacy Pass families.
          This brief covers the partnership case, three revenue paths, a four-week roadmap,
          and what honest risk looks like.
        </p>
      </div>

      {/* KPI strip */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
        marginBottom: 24,
      }}>
        {[
          { label: "Revenue options", value: "3", note: "Freemium · Bundle · Concierge" },
          { label: "Roadmap tracks", value: "3", note: "Polish · Proof · Contact" },
          { label: "Sprint target", value: "4 wk", note: "Demo + user stories + outreach" },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              backgroundColor: "rgba(244,237,224,0.07)",
              border: `1px solid ${T.rule}`,
              borderRadius: 8,
              padding: "12px 14px",
            }}
          >
            <p style={{ fontSize: 22, fontWeight: 700, color: T.paper, margin: "0 0 2px", lineHeight: 1 }}>
              {k.value}
            </p>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", color: T.slate, margin: "0 0 3px" }}>
              {k.label}
            </p>
            <p style={{ fontSize: 10, color: T.muted, margin: 0, lineHeight: 1.4 }}>
              {k.note}
            </p>
          </div>
        ))}
      </div>

      {/* Content blocks — EmailDraft sits between First action and Live Intelligence */}
      {BLOCKS.slice(0, 7).map((b) => <Block key={b.badge} b={b} />)}
      <EmailDraft />
      {BLOCKS.slice(7).map((b) => <Block key={b.badge} b={b} />)}

      {/* Footer note */}
      <div style={{
        marginTop: 28,
        padding: "14px 16px",
        borderRadius: 8,
        backgroundColor: "rgba(75,96,112,0.12)",
        border: `1px solid rgba(75,96,112,0.25)`,
      }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: "0 0 8px" }}>
          <strong style={{ color: T.slate }}>Prepared for Saily / Saltbox Operating Plan.</strong>{" "}
          This brief is a strategic planning document — not a pitch deck. Use it to think through the
          opportunity before committing development time. Cross-reference with the{" "}
          <a href="/practitioners-guide-v2/sarge" style={{ color: T.slate }}>Sarge HQ</a> operational view
          and the{" "}
          <a href={`${BASE}/deer-lake-roadmap`} style={{ color: T.slate }}>Deer Lake Roadmap</a>{" "}
          to ensure the sprint timeline fits within Phase 1 capacity.
        </p>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: T.slate }}>Related reference</strong>{" "}—{" "}
          <button
            onClick={() => navigate(`${BASE}/constellation-session`)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, color: T.slate, textDecoration: "underline" }}
          >
            Constellation Session
          </button>
          {" "}has zone-model status and locked architectural decisions — including where Saltbox (Zone 0) sits within the full Codetry constellation and what's proven vs. still open.
        </p>
      </div>

    </div>
  );
}

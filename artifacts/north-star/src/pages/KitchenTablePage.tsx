import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { RiverSmithPanel } from "@/components/RiverSmithPanel";

// ── Kitchen Table source roll-up ──────────────────────────────────────────────
// Reads /api/deadhead/intake so the council can move artifact-by-artifact.
// Hidden (returns null) if there is no owner token in localStorage or the
// fetch comes back unauthorized — the page still works for non-owners.
interface KTIntakeItem {
  id: string;
  title: string;
  status: string;
  source: string | null;
  sourceRef: string | null;
  flushedAt: string;
}

function KitchenTableSourcesPanel() {
  const [items, setItems] = useState<KTIntakeItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("library.ownerToken") ||
          window.localStorage.getItem("ownerToken")
        : null;
    if (!token) { setError("no-token"); return; }
    let cancelled = false;
    fetch("/api/deadhead/intake?status=new", {
      headers: { "x-library-owner-token": token },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<{ items: KTIntakeItem[] }>;
      })
      .then((j) => { if (!cancelled) setItems(j.items); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "err"); });
    return () => { cancelled = true; };
  }, []);

  if (error || !items || items.length === 0) return null;

  const groups = new Map<string, KTIntakeItem[]>();
  for (const it of items) {
    const key = it.source ?? "unknown";
    const arr = groups.get(key);
    if (arr) arr.push(it);
    else groups.set(key, [it]);
  }
  const sorted = Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);

  return (
    <div
      className="flex-shrink-0 z-10 border-b border-[#251E18] bg-[#181512] px-5 py-3"
      data-testid="kitchen-table-sources"
    >
      <div className="text-[11px] uppercase tracking-[0.15em] text-[#8C7B6D] font-bold mb-2">
        🍽 On the kitchen table — by source ({items.length})
      </div>
      <div className="space-y-2">
        {sorted.map(([source, list]) => (
          <details key={source} className="text-[12px]" data-testid={`kt-source-${source}`}>
            <summary className="cursor-pointer text-[#C5B6A5] hover:text-[#EAE4DB]">
              <span className="font-mono text-[11px] text-[#8C7B6D]">{source}</span>
              <span className="ml-2 text-[#5C5046]">({list.length})</span>
            </summary>
            <ul className="mt-1 ml-4 space-y-1 text-[#C5B6A5]">
              {list.slice(0, 8).map((it) => (
                <li key={it.id} className="leading-snug">
                  · {it.title}
                  {it.sourceRef && (
                    <span className="ml-2 font-mono text-[10px] text-[#5C5046]">
                      {it.sourceRef}
                    </span>
                  )}
                </li>
              ))}
              {list.length > 8 && (
                <li className="text-[10px] text-[#5C5046]">+{list.length - 8} more</li>
              )}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}

// ── Permanent context block — always loaded into every session ─────────────────
const CONTEXT_BLOCK = `---
WHO IS AT THIS TABLE
This table has six named seats and two open/configurable seats.
Saltbox (⊡) is Bobbie's Z0 agent — preserve, slow down, cure.
Smith (⚒) is the forge — shapes raw thinking into something you can hold.
Systems (⟳) sees through stocks, flows, and leverage points.
Community (⌂) thinks from Schumacher and Jacobs — human scale.
Codetry (☷) holds the naming discipline and zone model.
Ishmael (🐋) carries Daniel Quinn's Taker/Leaver lens — what story is the culture telling?
Seats A and B are open — Bobbie configures them for the session's need.

---
THE PRACTICE
Headwaters is a solo practitioner firm led by Bobbie Parr, Wabigoon, Ontario
(Treaty 3 Territory). The discipline is Codetry — building community-owned
economic infrastructure and handing it off. Primary clients: First Nations
band councils, northern co-ops, community organizations in Northwestern Ontario.

---
THE ZONE MODEL (Headwaters — trust-gradient)
Z0 — Saltbox / Household: Identity, voice, the mark before anything moves.
Z1 — Eave / Circle: Mutual aid, internal coordination, the people closest in.
Z2 — Workbench / The Deck: Where the practitioner works, sells, accounts.
Z3+ — Open Market / Picnic Table: Public-facing, third-party, broader world.

THE EAVE RULE (poured concrete):
  No table, no foreign key, no join, no query path, and no stored reference
  may ever connect a Z3 wallet address to a Z1 household record.
  The Deck (Z2) holds both family conversations and sales pitches.
  The Kitchen Table deliberates here. Curtains drawn by default.

---
THE ECOSYSTEM — WHAT'S BEEN BUILT
Shared platform: pnpm monorepo, Express API, Postgres/Drizzle, React/Vite,
Expo (mobile), OpenRouter/Grok AI, XRPL finance layer where applicable.
Warm palette: cream, evergreen, terracotta, amber. Inter + Fraunces. No guilt.

CURRENT ARTIFACTS (all running):
• ourheadwaters.ca (Crew Manifest) — public marketing site, zone quiz, Odyssey
• Codetry Handbook (mobile) — 85-chapter plain-language community economy guide
• Field Guide Finance — NWO food entrepreneur financial literacy course
• Practitioner's Guide V2 — internal passphrase-gated engagement tracker
• Headwaters Books — financial accounts and records
• Northern Food Systems Research Library — curated northern food research
• Print Marketing Suite — 45+ print-ready documents, PDF export, community packets
• Practitioner's Operating Plan — Bobbie's 2026 internal strategic layer
• North Star — practitioner OS, Kitchen Table AI council (this table)
• Nursery — community member portal (session-authenticated Z0/Z1 entry)
• API Server — shared backend powering all artifacts

---
THE FIVE SELLABLE BUNDLES
Bundle A — Wellness & Care Tracking
  For: TOPS groups, LTC facilities, senior living, clinics, corporate wellness
  Tools: Keto Companion + Bright Side (PHI-free care coordination)
  Revenue model: Hosting + support. Add-ons: custom infographics, medication tracker.

Bundle B — Family & Homeschool Operating System
  For: Homeschool co-ops, families, faith communities, youth programs
  Tools: Kitchen + Saltbox/Gather + Hearth + Life Badges + Family Buckets +
         Campfire + Memory Lane
  Revenue model: Hosting + support. White-label available.

Bundle C — Community Coordination & Mutual Aid
  For: Rural co-ops, villages, band councils, support networks
  Tools: Sandbox + The Eave + North Star + Stomping Path elements
  Revenue model: Hosting + support. Add-ons: custom AI council seats.

Bundle D — Business & Producer Operations
  For: Restaurants, retail, food co-ops, farmers markets, northern operators
  Tools: Dryden Web Suite + 807 Benefits + Market Mosaic + Rootwork
  Revenue model: Hosting + support. Add-ons: ordering flows, grant documentation.

Bundle E — Full Sovereign Stack
  For: Large co-ops, family offices, communities, grant-funded organizations
  Includes: All zones + Codetry tools + Kitchen Table AI + XRPL + print suite
  Revenue model: Hosting + support + practitioner retainer. White-label available.

---
ACTIVE PROJECT: 807 PACKAGE
Grant-funded: Field Guide Finance (financial literacy for NWO food entrepreneurs)
Headwaters tools bundled in: Deadhead · Market Mosaic · Rootwork
  Deadhead: Idea vetting and backlog management — structured intake and review.
  Market Mosaic: Market coordination and producer network. (Scope TBD with Bobbie)
  Rootwork: Asset studio and foundational infrastructure. (Scope TBD with Bobbie)

---
TODAY'S OPEN QUESTIONS (bring these to the table)
1. Which bundles are closest to sellable right now without new builds?
2. What is the right entry price for a northern co-op or band council?
3. Where does Field Guide Finance fit — standalone or always inside Bundle D/E?
4. What do Deadhead, Market Mosaic, and Rootwork mean to a buyer?
   What language lands? What do we stop calling them?
5. Which artifact is the front door for a new client coming in cold?
6. How do we talk about practitioner licensing?
7. A 3-month LTC study moved participation from 27% to 78% by giving people the right system —
   not more motivation. Entrepreneurs are wired differently and have never had the right tools.
   Does the same model apply? Is the Headwaters toolkit the container that closes that gap?
   What does this mean for how we talk about what we're building?

---
VOCABULARY (load-bearing terms — use precisely)
Saltbox: Z0 agent. Preserve, slow down, cure. Does this hold?
The Deck / Workbench: Z2. Both family conversations and sales pitches.
Kitchen Table: Z2 deliberation space. This table. Curtains drawn by default.
Picnic Table: Z3+. Public. Open. Anyone can sit down.
Founding mode: Building sovereignty from scratch.
Reclamation mode: Board-by-board recovery inside someone else's house.
The rods: The words that resonate — vocabulary worth keeping.
Both-States: A name that works when the system is empty and when it is full.
Both-Sides: Works for the practitioner and for the technical enforcement layer.
Handover as exit: Success means the community runs it without you.
Trial first: No full hire or contract without a bounded, paid trial period.

---
PULL QUOTES IN CIRCULATION
"Build it. Hand it off. Community runs it."
"The materials are the same. The order of operations is not."
"You cannot demolish while a thousand people are living inside."
"Hang the gate before you invite anyone in."
"It stops being invisible when you name it."
"Sovereign by design. No extraction model."
"Start at household. Expand to community without rework."`;

// ── Today's brief — fresh header every session, permanent context below ────────
function getTodayBrief(): string {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  return `SESSION: Kitchen Table — ${dateStr}
Convened by: Bobbie Parr, Headwaters Development Services
Table mode: [Sounding / Working / Review — edit this line]

TODAY'S AGENDA
What's on the table today? Write it here before you sit down.

${CONTEXT_BLOCK}`;
}

// ── Seat definitions ──────────────────────────────────────────────────────────
type Seat = {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgClass: string;
  borderClass: string;
  model: string;
  systemPrompt: string;
  configurable: boolean;
  description: string;
};

const DEFAULT_SEATS: Seat[] = [
  {
    id: "saltbox",
    name: "Saltbox",
    icon: "⊡",
    color: "#8A6A1A",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-200",
    model: "x-ai/grok-3",
    configurable: false,
    description: "Preserve, slow down, cure — does this hold?",
    systemPrompt: `You are the Saltbox seat at the Kitchen Table.
Your function: preserve, slow down, and cure. Ideas that come to this table are often moving fast. Your job is not to stop them — it is to ask the one question that tests whether they are ready to go out the door, or whether they need another day in the box.
You have been present for the full build of this project. You know the vocabulary. You know which decisions are poured concrete and which are still settling. You do not pretend things are resolved when they aren't.
Your lens is: Does this hold? Is the frame plumb? What did we skip?
Voice: Plain. Direct. One thing at a time. No hedging, no over-explaining. When something is good, say it is good. When something has a loose board, name the board. When you don't know, say so and say why it matters that you don't.
You are not a validator. You are a curing process.`,
  },
  {
    id: "grok",
    name: "Smith",
    icon: "⚒",
    color: "#5C3D2E",
    bgClass: "bg-stone-50",
    borderClass: "border-stone-300",
    model: "x-ai/grok-3",
    configurable: false,
    description: "Forge — shapes raw thinking into something you can hold",
    systemPrompt: `You are Smith — the community blacksmith and the boardroom presence who arrives with the marker already uncapped.

Your function: take what is loose and shape it into something that can be held and used. A smith follows the properties of the material. You cannot hammer mud into a hinge. When an idea cannot hold the shape it needs, you say so and say why. When it can, you show what it looks like finished.

At this table you are direct and concrete. You write on the board. Short paragraphs. No hedging. You push back when the thinking is soft — not to be difficult, but because a thing that won't hold in the forge won't hold in the field.

You know community economics, naming discipline, preparedness thinking, cooperative structure, and the difference between a tool the community will actually use and one that sounds good in a meeting.

When something is ready, say it is ready. When it needs another pass, name the pass. When the material is wrong for the job, name the material.`,
  },
  {
    id: "systems",
    name: "Systems",
    icon: "⟳",
    color: "#059669",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    model: "x-ai/grok-3",
    configurable: false,
    description: "Donella Meadows — stocks, flows, leverage",
    systemPrompt: `You see through the lens of systems thinking, drawing on Donella Meadows' "Thinking in Systems." When asked a question, you identify the stocks, flows, feedback loops, delays, and leverage points at work. You name the system archetype if one applies. You are at a kitchen table helping a founder see what the system is actually doing. Short, precise answers.`,
  },
  {
    id: "community-econ",
    name: "Community",
    icon: "⌂",
    color: "#D97706",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    model: "x-ai/grok-3",
    configurable: false,
    description: "Schumacher + Jacobs — human-scale economics",
    systemPrompt: `You think from the tradition of human-scale economics: E.F. Schumacher's "Small is Beautiful," Jane Jacobs' "The Economy of Cities" and "The Death and Life of Great American Cities." You look for local multipliers, import replacement, diversity over monoculture. You are suspicious of scale for its own sake. Plain language, no jargon. Kitchen table in a small northern Ontario community.`,
  },
  {
    id: "codetry",
    name: "Codetry",
    icon: "☷",
    color: "#1F3D2E",
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
    model: "x-ai/grok-3",
    configurable: false,
    description: "Handbook — naming discipline, zone model",
    systemPrompt: `You are a practitioner of codetry — the discipline of naming community economy systems correctly so that the name can do structural work. You apply three naming tests: (1) Saltbox test — does the name bound one thing and not two? (2) Both-States test — does it work when the system is empty and when it is full? (3) Both-Sides test — does it work for the practitioner and for the technical enforcement layer? You know the Headwaters constellation and the three-layer trust stack. Plain load-bearing language.`,
  },
  {
    id: "ishmael",
    name: "Ishmael",
    icon: "🐋",
    color: "#1E3A5F",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
    model: "x-ai/grok-3",
    configurable: false,
    description: "Daniel Quinn — Taker/Leaver, what story is your culture telling?",
    systemPrompt: `You are Ishmael — the voice of Daniel Quinn's Taker/Leaver framework, drawn from Ishmael, The Story of B, and My Ishmael.

Your single function at this table: ask what story the community is enacting. Every economic structure, every governance model, every "exit strategy" is embedded in a cultural story. Your job is to name which story is operating.

THE TWO STORIES
Taker story: The world was made for Man. Humans stand apart from the community of life, appointed to conquer and rule it. Growth is good. More is better. What we have built is civilization and it must not stop. Ownership is the correct relationship to land, resources, and people.

Leaver story: Humans belong to the world — we are members of the community of life, not its masters. The food belongs to the community; it is not locked away. What works, endures. What doesn't, fails and frees its materials. Sovereignty is not ownership — it is right relationship, stewardship, belonging.

YOUR LENS FOR THIS TABLE
When a founder presents a model — a co-op structure, a handover plan, a bundle price, a licensing agreement — your question is always: Which story does this enact? Does this move people from being owned to belonging? Does "handover as exit" mean the community now owns something, or that they now belong to something they help sustain?

For First Nations sovereignty work specifically: Colonial structures are Taker structures. Ownership-as-exit replicates the colonial frame even when the owner is Indigenous. Ask whether the model moves toward belonging and self-determination, or whether it just changes who holds the deed.

WHAT YOU WATCH FOR
— Extraction disguised as development
— Ownership language where stewardship language belongs
— "Scale" as a Taker proxy for growth-as-virtue
— Handover models that create dependency instead of releasing it
— Licensing structures that lock communities in rather than free them

VOICE
You are not a moralist. You are a teacher who asks the one question that changes everything: What story is your culture telling itself? You name what you see. You do not condemn — you illuminate. Short, direct, grounded in the framework. One question at a time. Let the question do the work.`,
  },
  {
    id: "open-a",
    name: "Seat A",
    icon: "○",
    color: "#78716C",
    bgClass: "bg-stone-50",
    borderClass: "border-stone-200",
    model: "x-ai/grok-3",
    configurable: true,
    description: "Open — tap to configure",
    systemPrompt: `You are a thoughtful advisor at a kitchen table. Answer questions directly and honestly.`,
  },
  {
    id: "open-b",
    name: "Seat B",
    icon: "○",
    color: "#78716C",
    bgClass: "bg-stone-50",
    borderClass: "border-stone-200",
    model: "x-ai/grok-3",
    configurable: true,
    description: "Open — tap to configure",
    systemPrompt: `You are a thoughtful advisor at a kitchen table. Answer questions directly and honestly.`,
  },
];

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  seatId: string;
  seatName: string;
  seatColor: string;
};

type SoundBite = {
  id: string;
  text: string;
  seatName?: string;
  seatColor?: string;
  capturedAt: string;
};

const SEED_BITES: SoundBite[] = [
  { id: "s1", text: "Pain is the tell.", capturedAt: "2026-05-23" },
  { id: "s2", text: "Pull not push.", capturedAt: "2026-05-23" },
  { id: "s3", text: "Own, don't lease.", capturedAt: "2026-05-23" },
  { id: "s4", text: "Control one's own.", capturedAt: "2026-05-23" },
  { id: "s5", text: "Exit and Build.", capturedAt: "2026-05-23" },
  { id: "s6", text: "We always knew how to fix it. Now we can.", capturedAt: "2026-05-23" },
  { id: "s7", text: "From the grassroots to the foundation. Let's reclaim the grass and mix some hempcrete foundation for round 2.", capturedAt: "2026-05-23" },
  { id: "s8", text: "We'll own everything and be happy.", capturedAt: "2026-05-23" },
];

// ── Session templates ──────────────────────────────────────────────────────────
type SessionTemplate = {
  id: string;
  label: string;
  sessionName: string;
  brief: string;
  agendaItems: { q: string; question: string; lead: string; leadId: string }[];
};

const TEMPLATES: SessionTemplate[] = [
  {
    id: "today",
    label: "Today's session",
    sessionName: "Kitchen Table",
    brief: getTodayBrief(),
    agendaItems: [
      { q: "Q1", question: "Which bundles feel solid and ready to offer today without forcing anything?", lead: "Saltbox", leadId: "saltbox" },
      { q: "Q2", question: "What are the clearest stocks and flows in our current platform that make a bundle actually deliver value?", lead: "Systems", leadId: "systems" },
      { q: "Q3", question: "Where do we see the strongest human-scale economic fit for these bundles right now?", lead: "Community", leadId: "community" },
      { q: "Q4", question: "What naming and framing feels clean, honest, and free of drift for the bundles and for practitioner licensing?", lead: "Codetry", leadId: "codetry" },
      { q: "Q5", question: "How should we speak about practitioner licensing so it feels like natural extension rather than add-on?", lead: "Smith", leadId: "grok" },
      { q: "Q6", question: "What one decision or next action carries the most weight from what we've heard?", lead: "Saltbox", leadId: "saltbox" },
      { q: "Q7", question: "Does the current language in North Star hold the accountability philosophy precisely — flexible structure for founders wired for urgency, without breaking under anxiety or letting others down? Are we using the right visions, the right words, and do we have the discipline not to substitute words that don't fit?", lead: "Codetry", leadId: "codetry" },
      { q: "Q8", question: "The Hearth: a digital creative hub for kids using AI image generation. Where does it belong in the bundle stack — Bundle B (Family & Homeschool), Bundle E (Full Sovereign Stack), or does it need its own lane? And who leads the build?", lead: "Smith", leadId: "grok" },
      { q: "Q9", question: "A crypto/digital privacy onboarding guide for community members (\"normies\"), seeded from a real Dryden event presentation. Does this live as a standalone artifact, or does it fold into an existing one (Handbook, Library, etc.)? Who is the right audience and who holds it?", lead: "Community", leadId: "community" },
      { q: "Q10", question: "Deadhead, the founder-only vetting tool — read it on two axes. Financial model fit: can it carry subscription pricing, the 807 free-access cost, and trial-to-paid conversion the way the rest of the constellation does? Software fit: does it belong in the constellation as a platform product at all, or is it a private founder tool dressed up as one? Name the real tension before more is invested.", lead: "Saltbox", leadId: "saltbox" },
    ],
  },
  {
    id: "weekly",
    label: "Weekly check-in",
    sessionName: "Weekend Check-in",
    brief: `WEEKLY CHECK-IN — Headwaters Development Services
Convened by: Bobbie Parr
Cadence: Every weekend (Saturday or Sunday morning)
Table mode: Review + direction. Short rounds. Listen for what moved and what's next.

PURPOSE
Thirty minutes to close the week honestly and open the next one with one clear move.
The table does not console or motivate — it reads what's true.

THE SIX QUESTIONS
Q1 — What shipped, held, or moved this week? (Saltbox)
Q2 — Where are the stocks thinned or flows blocked? (Systems)
Q3 — What is the community or client signal? (Community)
Q4 — What language needs cleaning or tightening? (Codetry)
Q5 — What is the one right move for next week? (Smith)
Q6 — What story did this week's moves enact — Taker or Leaver? (Ishmael)

GROUND RULES
— No more than three minutes per seat.
— If a question has no answer, say so and move on.
— End with one written decision or next action.
— Same six questions every week. Let the pattern do the work.`,
    agendaItems: [
      { q: "Q1", question: "What shipped, held, or moved this week? What's worth keeping?", lead: "Saltbox", leadId: "saltbox" },
      { q: "Q2", question: "Where are the stocks thinned or the flows blocked right now?", lead: "Systems", leadId: "systems" },
      { q: "Q3", question: "What is the community or client signal this week?", lead: "Community", leadId: "community" },
      { q: "Q4", question: "What language or framing needs cleaning or tightening?", lead: "Codetry", leadId: "codetry" },
      { q: "Q5", question: "What is the one right move to open next week well?", lead: "Smith", leadId: "grok" },
      { q: "Q6", question: "What story did this week's moves enact — Taker or Leaver? Where did we drift toward ownership when stewardship was the right frame?", lead: "Ishmael", leadId: "ishmael" },
    ],
  },
  {
    id: "monthly",
    label: "Month-end review",
    sessionName: "Monthly Review",
    brief: `MONTHLY REVIEW — Headwaters Development Services
Convened by: Bobbie Parr
Cadence: End of month (last weekend of the month)
Table mode: Full review. Longer rounds. Read what actually happened, then set what comes next.

PURPOSE
One hour to close the month with honesty and open the next with intention.
Seven habits structure: review roles, assess wins and gaps, sharpen the saw, set the targets.
The table reads what is true — not what we hoped or feared. Then it points forward.

THE EIGHT QUESTIONS
Q1 — What actually happened this month? Hold what held. Name what didn't. (Saltbox)
Q2 — Where did the stocks grow or deplete? What does the system health look like? (Systems)
Q3 — What shifted in the community, the market, or with clients this month? (Community)
Q4 — What new language or vocabulary emerged that's worth keeping? (Codetry)
Q5 — Are we still pointed in the right direction? What do the roles and targets say? (Smith)
Q6 — What is one commitment to sharpen the saw — capacity, rest, or learning? (Community)
Q7 — Which story did this month enact — Taker or Leaver? Where did ownership language creep in where stewardship belonged? (Ishmael)
Q8 — What are the two or three clear targets for next month? Name them. (Saltbox — does this hold?)

GROUND RULES
— Be honest about what didn't move. No softening.
— Name one thing that surprised you. Good or hard.
— End with written targets — not intentions. Targets.
— Same eight questions every month. Let the pattern compound.`,
    agendaItems: [
      { q: "Q1", question: "What actually happened this month? What held? What didn't?", lead: "Saltbox", leadId: "saltbox" },
      { q: "Q2", question: "Where did the stocks grow or deplete? What is the system health right now?", lead: "Systems", leadId: "systems" },
      { q: "Q3", question: "What shifted in the community, the market, or with clients this month?", lead: "Community", leadId: "community" },
      { q: "Q4", question: "What new language or vocabulary emerged that's worth keeping?", lead: "Codetry", leadId: "codetry" },
      { q: "Q5", question: "Are we still pointed in the right direction? What do the roles and targets say?", lead: "Smith", leadId: "grok" },
      { q: "Q6", question: "What is one commitment to sharpen the saw — capacity, rest, or learning?", lead: "Community", leadId: "community" },
      { q: "Q7", question: "Which story did this month enact — Taker or Leaver? Where did ownership language creep in where stewardship belonged?", lead: "Ishmael", leadId: "ishmael" },
      { q: "Q8", question: "What are the two or three clear targets for next month? Name them.", lead: "Saltbox", leadId: "saltbox" },
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export function KitchenTablePage() {
  const [seats, setSeats] = useState<Seat[]>(() => {
    try {
      const stored = localStorage.getItem("kitchen-table-seat-config");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, Partial<Seat>>;
        return DEFAULT_SEATS.map((s) =>
          s.configurable && parsed[s.id] ? { ...s, ...parsed[s.id] } : s
        );
      }
    } catch {
      // ignore
    }
    return DEFAULT_SEATS;
  });
  const [activeSeatId, setActiveSeatId] = useState("grok");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState("today");
  const [sessionName, setSessionName] = useState("Kitchen Table");
  const [editingSession, setEditingSession] = useState(false);
  const [brief, setBrief] = useState(() => getTodayBrief());
  const [briefOpen, setBriefOpen] = useState(false);
  const [editingBrief, setEditingBrief] = useState(false);
  const [configSeatId, setConfigSeatId] = useState<string | null>(null);
  const [configDraft, setConfigDraft] = useState({ name: "", description: "", systemPrompt: "" });

  const activeTemplate = TEMPLATES.find((t) => t.id === activeTemplateId) ?? TEMPLATES[0]!;
  const agendaItems = activeTemplate.agendaItems;

  const loadTemplate = (t: SessionTemplate) => {
    setActiveTemplateId(t.id);
    setSessionName(t.sessionName);
    setBrief(t.brief);
    setMessages([]);
    setInput("");
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamingIdRef = useRef<string | null>(null);

  const activeSeat = seats.find((s) => s.id === activeSeatId) ?? seats[0]!;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setStreaming(true);

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      seatId: activeSeat.id,
      seatName: activeSeat.name,
      seatColor: activeSeat.color,
    };
    const assistantId = `a-${Date.now()}`;
    streamingIdRef.current = assistantId;
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      seatId: activeSeat.id,
      seatName: activeSeat.name,
      seatColor: activeSeat.color,
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    const history = messages
      .filter((m) => m.seatId === activeSeat.id)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    const systemPrompt = activeSeat.systemPrompt +
      (brief.trim() ? `\n\n---\n\nProject brief on the table:\n${brief}` : "");

    try {
      const res = await fetch("/api/council/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, systemPrompt, model: activeSeat.model }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: "⚠ Could not reach the council." } : m)
        );
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          try {
            const chunk = JSON.parse(raw) as { content?: string; done?: boolean; error?: string };
            if (chunk.error) {
              setMessages((prev) =>
                prev.map((m) => m.id === assistantId ? { ...m, content: m.content + `\n\n⚠ ${chunk.error}` } : m)
              );
            } else if (chunk.content) {
              setMessages((prev) =>
                prev.map((m) => m.id === assistantId ? { ...m, content: m.content + chunk.content } : m)
              );
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) => m.id === assistantId ? { ...m, content: "⚠ Network error." } : m)
      );
    }

    setStreaming(false);
    streamingIdRef.current = null;
  }, [input, streaming, activeSeat, messages, brief]);

  const openConfig = (seat: Seat) => {
    setConfigSeatId(seat.id);
    setConfigDraft({ name: seat.name, description: seat.description, systemPrompt: seat.systemPrompt });
  };

  const saveConfig = () => {
    if (!configSeatId) return;
    setSeats((prev) => {
      const next = prev.map((s) =>
        s.id === configSeatId
          ? { ...s, name: configDraft.name, description: configDraft.description, systemPrompt: configDraft.systemPrompt }
          : s
      );
      try {
        const toStore: Record<string, Partial<Seat>> = {};
        next.filter((s) => s.configurable).forEach((s) => {
          toStore[s.id] = { name: s.name, description: s.description, systemPrompt: s.systemPrompt };
        });
        localStorage.setItem("kitchen-table-seat-config", JSON.stringify(toStore));
      } catch {
        // ignore
      }
      return next;
    });
    setConfigSeatId(null);
  };

  const [soundBites, setSoundBites] = useState<SoundBite[]>(() => {
    try {
      const stored = localStorage.getItem("kitchen-table-sound-bites");
      return stored ? (JSON.parse(stored) as SoundBite[]) : SEED_BITES;
    } catch {
      return SEED_BITES;
    }
  });
  const [bitesOpen, setBitesOpen] = useState(false);
  const [biteInput, setBiteInput] = useState("");

  useEffect(() => {
    try { localStorage.setItem("kitchen-table-sound-bites", JSON.stringify(soundBites)); } catch { /* noop */ }
  }, [soundBites]);

  const addBite = (text: string, seatName?: string, seatColor?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSoundBites((prev) => [
      { id: `b-${Date.now()}`, text: trimmed, seatName, seatColor, capturedAt: new Date().toLocaleDateString("en-CA") },
      ...prev,
    ]);
  };

  const deleteBite = (id: string) => setSoundBites((prev) => prev.filter((b) => b.id !== id));

  const inSession = messages.length > 0;

  return (
    <div className="flex flex-col bg-[#13110E] text-[#D8D0C5] font-sans antialiased relative selection:bg-[#B75C34]/40" style={{ height: "calc(100dvh - 90px)" }}>
      
      {/* Campfire glow effect */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#B75C34] opacity-[0.04] blur-[100px] pointer-events-none rounded-full" />
      
      {/* ── Header ── */}
      <div className="flex-shrink-0 z-10 bg-[#13110E]/80 backdrop-blur-xl border-b border-[#2C241D] px-5 pt-safe-top shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3 py-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7B6D] font-medium">Z2</span>
          <span className="w-1 h-1 rounded-full bg-[#3D3228]" />
          {editingSession ? (
            <input
              autoFocus
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onBlur={() => setEditingSession(false)}
              onKeyDown={(e) => { if (e.key === "Enter") setEditingSession(false); }}
              className="flex-1 text-[16px] font-serif tracking-wide text-[#EAE4DB] bg-transparent border-b border-[#8C7B6D] outline-none"
            />
          ) : (
            <button
              onClick={() => setEditingSession(true)}
              className="flex-1 text-left text-[16px] font-serif tracking-wide text-[#EAE4DB]"
            >
              {sessionName}
            </button>
          )}
          {inSession && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-[12px] font-medium text-[#13110E] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
              style={{ background: activeSeat.color }}
            >
              <span className="opacity-90">{activeSeat.icon}</span>
              <span className="tracking-wide">{activeSeat.name}</span>
            </div>
          )}
          <button
            onClick={() => setBitesOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#2C241D] bg-[#1C1814] text-[#8C7B6D] text-[11px] tracking-wide hover:text-[#D8D0C5] hover:border-[#3D3228] transition-colors"
          >
            <span className="text-[13px]">✦</span>
            <span>{soundBites.length}</span>
          </button>
        </div>
      </div>

      {/* ── River Smith Briefing Panel ── */}
      <RiverSmithPanel />

      {/* ══════════════════════════════════════════════════════════════
          MODE A — TABLE IS SET (no messages yet)
          Seat tiles grid + agenda visible
      ══════════════════════════════════════════════════════════════ */}
      {!inSession && (
        <div className="flex-1 overflow-y-auto relative z-10 pb-12">

          {/* Seat tile grid */}
          <div className="px-5 pt-8 pb-6">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A5C] font-medium mb-4 px-1">
              The council is present
            </p>
            <div className="grid grid-cols-2 gap-4">
              {seats.map((seat) => {
                const isActive = seat.id === activeSeatId;
                return (
                  <button
                    key={seat.id}
                    onClick={() => setActiveSeatId(seat.id)}
                    onDoubleClick={() => seat.configurable && openConfig(seat)}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-3 rounded-sm px-4 py-6 text-center transition-all duration-300 active:scale-[0.99]",
                      isActive
                        ? "bg-[#1C1814] shadow-[0_8px_20px_rgba(0,0,0,0.6)] border-t border-[#3A2F25] border-x border-[#1C1814] border-b border-[#0A0807]"
                        : "bg-[#181512] shadow-[0_2px_8px_rgba(0,0,0,0.5)] border-t border-[#251E18] border-x border-[#181512] border-b border-[#0A0807] hover:bg-[#1C1814]"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-sm pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px ${seat.color}40, 0 0 30px ${seat.color}15` }} />
                    )}
                    {seat.configurable && (
                      <span
                        className={cn(
                          "absolute top-3 right-3 text-[9px] uppercase tracking-[0.1em] font-medium",
                          isActive ? "text-[#D8D0C5]/60" : "text-[#5C5046]"
                        )}
                      >
                        open
                      </span>
                    )}
                    <span 
                      className={cn(
                        "text-[32px] leading-none drop-shadow-md transition-opacity duration-300", 
                        !isActive && "opacity-60 grayscale-[0.3]"
                      )}
                      style={isActive ? { color: seat.color } : {}}
                    >
                      {seat.icon}
                    </span>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[15px] font-serif tracking-wide text-[#EAE4DB]">{seat.name}</span>
                      <span
                        className={cn(
                          "text-[12px] leading-relaxed px-2 font-medium tracking-wide",
                          isActive ? "text-[#A39485]" : "text-[#6B5D50]"
                        )}
                      >
                        {seat.description}
                      </span>
                    </div>
                    {seat.configurable && !isActive && (
                      <span className="mt-2 text-[10px] text-[#8C7B6D] font-medium tracking-wide">Double-tap to set</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agenda */}
          <div className="px-8 pt-6 pb-12">
            {/* Template switcher */}
            <div className="flex items-center gap-3 mb-4 px-1">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A5C] font-medium flex-1">
                {activeTemplate.id === "weekly" ? "Weekend check-in · 30 min"
                  : activeTemplate.id === "monthly" ? "Month-end review · 60 min"
                  : "Today's agenda · 30 min"}
              </p>
              <div className="flex gap-1.5">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => loadTemplate(t)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-sm text-[10px] font-medium tracking-wide transition-all",
                      activeTemplateId === t.id
                        ? "bg-[#2C241D] text-[#EAE4DB] shadow-inner"
                        : "bg-[#181512] text-[#7A6A5C] border border-[#251E18] hover:text-[#A39485]"
                    )}
                  >
                    {t.id === "weekly" ? "Weekly" : t.id === "monthly" ? "Monthly" : "Today"}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-[#181512] rounded-sm border border-[#251E18] shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden">
              {agendaItems.map((item, i) => {
                const leadSeat = seats.find((s) => s.id === item.leadId);
                return (
                  <button
                    key={item.q}
                    onClick={() => {
                      setActiveSeatId(item.leadId);
                      setInput(item.question);
                    }}
                    className={cn(
                      "w-full flex items-start gap-4 px-5 py-5 text-left transition-colors hover:bg-[#1C1814] active:bg-[#251E18]",
                      i < agendaItems.length - 1 ? "border-b border-[#251E18]" : ""
                    )}
                  >
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-sm flex items-center justify-center text-[11px] font-bold text-[#13110E] mt-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                      style={{ background: "#8C7B6D" }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-[#D8D0C5] leading-relaxed">{item.question}</p>
                      <p className="text-[12px] text-[#8C7B6D] mt-2 font-medium tracking-wide flex items-center gap-2">
                        <span style={{ color: leadSeat?.color ?? "#5C5046" }} className="opacity-90 text-[14px]">{leadSeat?.icon}</span>
                        {item.lead} leads
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[12px] text-[#5C5046] text-center mt-6 font-medium tracking-wide">
              Tap an agenda item to sit down and begin
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODE B — IN SESSION (messages exist)
          Compact seat switcher + agenda toggle + chat
      ══════════════════════════════════════════════════════════════ */}
      {inSession && (
        <>
          {/* Compact seat switcher */}
          <div className="flex-shrink-0 z-10 bg-[#181512] border-b border-[#251E18] shadow-md relative">
            <div className="flex gap-2.5 px-4 py-3 overflow-x-auto scrollbar-hide">
              {seats.map((seat) => {
                const isActive = seat.id === activeSeatId;
                return (
                  <button
                    key={seat.id}
                    onClick={() => setActiveSeatId(seat.id)}
                    onDoubleClick={() => seat.configurable && openConfig(seat)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-sm text-[13px] font-medium tracking-wide transition-all duration-300",
                      isActive
                        ? "text-[#13110E] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                        : "text-[#8C7B6D] bg-[#1C1814] border border-[#2A231E] hover:bg-[#251E18] hover:text-[#A39485]"
                    )}
                    style={isActive ? { background: seat.color } : {}}
                  >
                    <span className="text-[16px] opacity-90">{seat.icon}</span>
                    <span>{seat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <KitchenTableSourcesPanel />

          {/* Agenda toggle */}
          <div className="flex-shrink-0 z-10 border-b border-[#251E18] bg-[#1A1714]">
            <button
              onClick={() => { setBriefOpen((o) => !o); setEditingBrief(false); }}
              className="flex items-center gap-3 w-full px-5 py-3.5 text-left transition-colors hover:bg-[#1C1814]"
            >
              <span className="text-[12px] opacity-60">📋</span>
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#8C7B6D] font-bold">Agenda</span>
              <span className="text-[11px] text-[#5C5046] ml-2 tracking-wide">— {agendaItems.length} items</span>
              <span className="ml-auto text-[10px] text-[#5C5046]">{briefOpen ? "▲" : "▼"}</span>
            </button>

            {briefOpen && (
              <div className="px-5 pb-5 bg-[#1A1714]">
                {/* Compact agenda list */}
                <div className="bg-[#181512] rounded-sm border border-[#251E18] overflow-hidden mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                  {agendaItems.map((item, i) => {
                    const leadSeat = seats.find((s) => s.id === item.leadId);
                    return (
                      <button
                        key={item.q}
                        onClick={() => {
                          setActiveSeatId(item.leadId);
                          setInput(item.question);
                          setBriefOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#1C1814] active:bg-[#251E18]",
                          i < agendaItems.length - 1 ? "border-b border-[#251E18]" : ""
                        )}
                      >
                        <span
                          className="flex-shrink-0 w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold text-[#13110E] mt-0.5"
                          style={{ background: "#8C7B6D" }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-[13px] text-[#D8D0C5] font-medium leading-relaxed pt-0.5">{item.question}</p>
                      </button>
                    );
                  })}
                </div>
                {/* Brief edit */}
                <button
                  onClick={() => setEditingBrief((b) => !b)}
                  className="text-[11px] text-[#8C7B6D] hover:text-[#A39485] tracking-wide px-1 font-medium transition-colors"
                >
                  {editingBrief ? "Cancel edit" : "Edit session brief"}
                </button>
                {editingBrief && (
                  <div className="mt-4">
                    <textarea
                      autoFocus
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      rows={8}
                      className="w-full text-[13px] font-mono leading-relaxed text-[#A39485] bg-[#13110E] border border-[#2A231E] rounded-sm p-4 resize-y outline-none focus:border-[#5C5046] transition-colors"
                    />
                    <div className="flex gap-3 mt-3 justify-end">
                      <button
                        onClick={() => setBrief(getTodayBrief())}
                        className="text-[12px] tracking-wide text-[#8C7B6D] hover:text-[#D8D0C5] border border-[#2A231E] bg-[#1C1814] rounded-sm px-4 py-2 transition-colors"
                      >Reset</button>
                      <button
                        onClick={() => setEditingBrief(false)}
                        className="text-[12px] tracking-wide text-[#13110E] bg-[#8C7B6D] hover:bg-[#A39485] rounded-sm px-5 py-2 font-medium shadow-sm transition-colors"
                      >Done</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6 min-h-0 relative z-0">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isStreaming = streaming && msg.id === streamingIdRef.current;
              return (
                <div
                  key={msg.id}
                  className={cn("flex gap-4 items-end", isUser ? "flex-row-reverse" : "flex-row")}
                >
                  {!isUser && (
                    <div
                      className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center text-xl text-[#13110E] mb-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.5)]"
                      style={{ background: msg.seatColor }}
                    >
                      {seats.find((s) => s.id === msg.seatId)?.icon ?? "◈"}
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] px-5 py-4 text-[15px] leading-relaxed rounded-sm",
                      isUser
                        ? "bg-[#21241C] text-[#EAE4DB] shadow-[0_2px_10px_rgba(0,0,0,0.3)] border border-[#2D3327]"
                        : "bg-[#181512] text-[#D8D0C5] border border-[#251E18] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                    )}
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {!isUser && (
                      <p
                        className="text-[11px] uppercase tracking-[0.15em] font-medium mb-2 opacity-80"
                        style={{ color: msg.seatColor }}
                      >
                        {msg.seatName}
                      </p>
                    )}
                    {msg.content || (isStreaming ? <span className="opacity-40" style={{ color: msg.seatColor }}>▍</span> : null)}
                    {isStreaming && msg.content && <span className="opacity-40" style={{ color: msg.seatColor }}>▍</span>}
                    {!isUser && msg.content && !isStreaming && (
                      <button
                        onClick={() => addBite(msg.content, msg.seatName, msg.seatColor)}
                        className="mt-3 flex items-center gap-1.5 text-[10px] tracking-wider text-[#5C5046] hover:text-[#8C7B6D] transition-colors"
                        title="Capture as sound bite"
                      >
                        <span>✦</span>
                        <span>capture</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} className="h-4" />
          </div>
        </>
      )}

      {/* ── Input row (always visible) ── */}
      <div className="flex-shrink-0 relative z-20 border-t border-[#251E18] bg-[#181512] px-5 py-4 pb-safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-2xl mx-auto flex gap-4 items-end">
          <div
            className="flex-1 flex flex-col bg-[#13110E] rounded-sm px-4 pt-3.5 pb-3 transition-colors border border-[#2A231E] focus-within:border-[#4A3D33] shadow-inner"
          >
            {!inSession && (
              <p className="text-[11px] uppercase tracking-[0.1em] font-medium mb-2 opacity-80" style={{ color: activeSeat.color }}>
                <span className="mr-1">{activeSeat.icon}</span> {activeSeat.name}
              </p>
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              onInput={(e) => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 160) + "px";
              }}
              placeholder={inSession ? `Speak to ${activeSeat.name}…` : `Sit down and speak to ${activeSeat.name}…`}
              rows={1}
              disabled={streaming}
              className="flex-1 bg-transparent text-[15px] font-serif tracking-wide text-[#EAE4DB] placeholder:text-[#5C5046] outline-none resize-none leading-relaxed"
              style={{ maxHeight: 160 }}
            />
          </div>
          <button
            onClick={send}
            disabled={streaming || !input.trim()}
            className={cn(
              "w-12 h-12 rounded-sm flex items-center justify-center text-[#13110E] flex-shrink-0 transition-all duration-300",
              streaming || !input.trim() 
                ? "opacity-40 bg-[#251E18] text-[#5C5046]" 
                : "active:scale-[0.96] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.5)]"
            )}
            style={{ background: streaming || !input.trim() ? undefined : activeSeat.color }}
          >
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 7L7 13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Config modal ── */}
      {configSeatId && (
        <div
          className="fixed inset-0 bg-[#0A0807]/80 backdrop-blur-md z-50 flex items-end sm:items-center sm:justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setConfigSeatId(null); }}
        >
          <div className="w-full sm:w-[480px] bg-[#181512] border-t sm:border border-[#251E18] rounded-t-sm sm:rounded-sm p-6 sm:p-8 pb-safe-bottom shadow-2xl">
            <div className="w-16 h-1 bg-[#251E18] rounded-full mx-auto mb-8 sm:hidden" />
            <h3 className="text-[20px] font-serif tracking-wide text-[#EAE4DB] mb-2">Configure Council Seat</h3>
            <p className="text-[14px] text-[#8C7B6D] mb-8 leading-relaxed">Bring a new lens, framework, or thinker to the table.</p>

            <label className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A5C] font-bold block mb-2">Name</label>
            <input
              value={configDraft.name}
              onChange={(e) => setConfigDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full text-[16px] text-[#EAE4DB] bg-[#13110E] border border-[#251E18] rounded-sm px-4 py-3.5 outline-none mb-5 focus:border-[#5C5046] transition-colors shadow-inner"
            />

            <label className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A5C] font-bold block mb-2">Role tagline</label>
            <input
              value={configDraft.description}
              onChange={(e) => setConfigDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="e.g. Robin Wall Kimmerer — reciprocity, plant intelligence"
              className="w-full text-[15px] text-[#EAE4DB] bg-[#13110E] border border-[#251E18] rounded-sm px-4 py-3.5 outline-none mb-5 focus:border-[#5C5046] transition-colors placeholder:text-[#5C5046] shadow-inner"
            />

            <label className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A5C] font-bold block mb-2">Lens (system prompt)</label>
            <textarea
              value={configDraft.systemPrompt}
              onChange={(e) => setConfigDraft((d) => ({ ...d, systemPrompt: e.target.value }))}
              placeholder="Describe the knowledge framework or thinker this seat speaks from."
              rows={5}
              className="w-full text-[14px] font-mono leading-relaxed text-[#D8D0C5] bg-[#13110E] border border-[#251E18] rounded-sm px-4 py-4 outline-none mb-8 resize-none focus:border-[#5C5046] transition-colors placeholder:text-[#5C5046] shadow-inner"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setConfigSeatId(null)}
                className="flex-1 py-4 text-[13px] uppercase tracking-wide font-bold text-[#8C7B6D] hover:text-[#EAE4DB] border border-[#2A231E] bg-[#1C1814] rounded-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="flex-1 py-4 text-[13px] uppercase tracking-wide font-bold text-[#13110E] bg-[#8C7B6D] hover:bg-[#A39485] rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-colors"
              >
                Set seat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sound Bites panel ── */}
      {bitesOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end"
          onClick={(e) => { if (e.target === e.currentTarget) setBitesOpen(false); }}
        >
          <div className="bg-[#13110E] border-t border-[#2C241D] rounded-t-2xl max-h-[85dvh] flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.7)]">
            {/* Panel header */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-[#2C241D] flex-shrink-0">
              <span className="text-[#8C7B6D] text-base">✦</span>
              <span className="text-[13px] uppercase tracking-[0.15em] text-[#EAE4DB] font-medium flex-1">Sound Bites</span>
              <span className="text-[11px] text-[#5C5046]">{soundBites.length} saved</span>
              <button
                onClick={() => setBitesOpen(false)}
                className="text-[#5C5046] hover:text-[#8C7B6D] text-xl leading-none ml-2 transition-colors"
              >×</button>
            </div>

            {/* Quick-add */}
            <div className="flex gap-3 px-5 py-3 border-b border-[#2C241D] flex-shrink-0">
              <input
                value={biteInput}
                onChange={(e) => setBiteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addBite(biteInput);
                    setBiteInput("");
                  }
                }}
                placeholder="Type a one-liner and press return…"
                className="flex-1 bg-[#1C1814] border border-[#2A231E] rounded-sm px-4 py-2.5 text-[13px] text-[#D8D0C5] placeholder:text-[#4A3D33] outline-none focus:border-[#5C5046] transition-colors"
              />
              <button
                onClick={() => { addBite(biteInput); setBiteInput(""); }}
                disabled={!biteInput.trim()}
                className="px-4 py-2.5 text-[12px] uppercase tracking-wider font-medium text-[#13110E] bg-[#8C7B6D] disabled:opacity-30 rounded-sm transition-opacity"
              >Add</button>
            </div>

            {/* Bites list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {soundBites.length === 0 && (
                <p className="text-[13px] text-[#4A3D33] text-center py-8">No bites yet. Type one above or capture from the council.</p>
              )}
              {soundBites.map((bite) => (
                <div
                  key={bite.id}
                  className="flex items-start gap-3 bg-[#181512] border border-[#251E18] rounded-sm px-4 py-3.5 group"
                >
                  {bite.seatColor && (
                    <span
                      className="flex-shrink-0 w-1.5 h-full min-h-[1.5rem] rounded-full mt-0.5"
                      style={{ background: bite.seatColor }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-[#EAE4DB] leading-snug">{bite.text}</p>
                    {bite.seatName && (
                      <p className="text-[10px] text-[#5C5046] mt-1.5 tracking-wider uppercase">{bite.seatName}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigator.clipboard?.writeText(bite.text)}
                      className="text-[11px] text-[#5C5046] hover:text-[#8C7B6D] tracking-wide transition-colors"
                      title="Copy"
                    >copy</button>
                    <button
                      onClick={() => deleteBite(bite.id)}
                      className="text-[11px] text-[#5C5046] hover:text-[#8C4A3A] tracking-wide transition-colors"
                      title="Delete"
                    >×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

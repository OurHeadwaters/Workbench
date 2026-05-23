import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ── Default brief ─────────────────────────────────────────────────────────────
const DEFAULT_BRIEF = `SESSION: Software Systems Bundle — Business Management Decisions
Date: May 23, 2026
Convened by: Bobbie Parr, Headwaters Development Services
Table mode: Sounding. Bobbie listens for the rods — the words that hold weight.

TODAY'S AGENDA (run seat-by-seat, 30 minutes)
Goal: Decide which bundles are ready to sell now, refine buyer language,
and clarify how we talk about practitioner licensing.

Q1 — Which bundles feel solid and ready to offer today without forcing anything?
     Saltbox leads. (Does this hold?)

Q2 — What are the clearest stocks and flows in our current platform that make
     a bundle actually deliver value?
     Systems leads.

Q3 — Where do we see the strongest human-scale economic fit for these bundles
     right now?
     Community leads.

Q4 — What naming and framing feels clean, honest, and free of drift for the
     bundles and for practitioner licensing?
     Codetry leads.

Q5 — How should we speak about practitioner licensing so it feels like natural
     extension rather than add-on?
     Grok leads. (Direct whiteboard.)

Q6 — What one decision or next action carries the most weight from what we've heard?
     Saltbox leads. (Does this hold?)

Run tight. Bobbie listens for the rods. Finish with clear decisions on
readiness, language, and licensing.

---

---
WHO IS AT THIS TABLE
This table has five named seats and two open/configurable seats.
Saltbox (⊡) is Bobbie's Z0 agent — preserve, slow down, cure.
Grok (◈) is the raw AI whiteboard — direct, honest, no hedging.
Systems (⟳) sees through stocks, flows, and leverage points.
Community (⌂) thinks from Schumacher and Jacobs — human scale.
Codetry (☷) holds the naming discipline and zone model.
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
    model: "x-ai/grok-4.20",
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
    name: "Grok",
    icon: "◈",
    color: "#4F46E5",
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-200",
    model: "x-ai/grok-4.20",
    configurable: false,
    description: "Raw AI — direct, honest, no hedging",
    systemPrompt: `You are a direct, honest AI advisor sitting at a kitchen table with a community economy founder. You give concrete, well-reasoned answers. You do not hedge unnecessarily. Short paragraphs. Plain language. When asked for design advice or a sounding board, you engage fully and push back where the thinking is weak. You know about community economics, naming discipline, trust systems, and cooperative structures.`,
  },
  {
    id: "systems",
    name: "Systems",
    icon: "⟳",
    color: "#059669",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    model: "x-ai/grok-4.20",
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
    model: "x-ai/grok-4.20",
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
    model: "x-ai/grok-4.20",
    configurable: false,
    description: "Handbook — naming discipline, zone model",
    systemPrompt: `You are a practitioner of codetry — the discipline of naming community economy systems correctly so that the name can do structural work. You apply three naming tests: (1) Saltbox test — does the name bound one thing and not two? (2) Both-States test — does it work when the system is empty and when it is full? (3) Both-Sides test — does it work for the practitioner and for the technical enforcement layer? You know the Headwaters constellation and the three-layer trust stack. Plain load-bearing language.`,
  },
  {
    id: "open-a",
    name: "Seat A",
    icon: "○",
    color: "#78716C",
    bgClass: "bg-stone-50",
    borderClass: "border-stone-200",
    model: "x-ai/grok-4.20",
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
    model: "x-ai/grok-4.20",
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
    brief: DEFAULT_BRIEF,
    agendaItems: [
      { q: "Q1", question: "Which bundles feel solid and ready to offer today without forcing anything?", lead: "Saltbox", leadId: "saltbox" },
      { q: "Q2", question: "What are the clearest stocks and flows in our current platform that make a bundle actually deliver value?", lead: "Systems", leadId: "systems" },
      { q: "Q3", question: "Where do we see the strongest human-scale economic fit for these bundles right now?", lead: "Community", leadId: "community" },
      { q: "Q4", question: "What naming and framing feels clean, honest, and free of drift for the bundles and for practitioner licensing?", lead: "Codetry", leadId: "codetry" },
      { q: "Q5", question: "How should we speak about practitioner licensing so it feels like natural extension rather than add-on?", lead: "Grok", leadId: "grok" },
      { q: "Q6", question: "What one decision or next action carries the most weight from what we've heard?", lead: "Saltbox", leadId: "saltbox" },
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

THE FIVE QUESTIONS
Q1 — What shipped, held, or moved this week? (Saltbox)
Q2 — Where are the stocks thinned or flows blocked? (Systems)
Q3 — What is the community or client signal? (Community)
Q4 — What language needs cleaning or tightening? (Codetry)
Q5 — What is the one right move for next week? (Grok)

GROUND RULES
— No more than three minutes per seat.
— If a question has no answer, say so and move on.
— End with one written decision or next action.
— Same five questions every week. Let the pattern do the work.`,
    agendaItems: [
      { q: "Q1", question: "What shipped, held, or moved this week? What's worth keeping?", lead: "Saltbox", leadId: "saltbox" },
      { q: "Q2", question: "Where are the stocks thinned or the flows blocked right now?", lead: "Systems", leadId: "systems" },
      { q: "Q3", question: "What is the community or client signal this week?", lead: "Community", leadId: "community" },
      { q: "Q4", question: "What language or framing needs cleaning or tightening?", lead: "Codetry", leadId: "codetry" },
      { q: "Q5", question: "What is the one right move to open next week well?", lead: "Grok", leadId: "grok" },
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export function KitchenTablePage() {
  const [seats, setSeats] = useState<Seat[]>(DEFAULT_SEATS);
  const [activeSeatId, setActiveSeatId] = useState("grok");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState("today");
  const [sessionName, setSessionName] = useState("Kitchen Table");
  const [editingSession, setEditingSession] = useState(false);
  const [brief, setBrief] = useState(DEFAULT_BRIEF);
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
    setSeats((prev) =>
      prev.map((s) =>
        s.id === configSeatId
          ? { ...s, name: configDraft.name, description: configDraft.description, systemPrompt: configDraft.systemPrompt }
          : s
      )
    );
    setConfigSeatId(null);
  };

  const inSession = messages.length > 0;

  return (
    <div className="flex flex-col h-dvh bg-[#1C1814] font-sans selection:bg-[#D68A3A]/30">

      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-[#1C1814] border-b border-[#31281F] px-4 pt-safe-top">
        <div className="flex items-center gap-2 py-3">
          <span className="text-[10px] uppercase tracking-widest text-[#D68A3A] font-bold">Z2 ·</span>
          {editingSession ? (
            <input
              autoFocus
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onBlur={() => setEditingSession(false)}
              onKeyDown={(e) => { if (e.key === "Enter") setEditingSession(false); }}
              className="flex-1 text-[15px] font-semibold text-[#E8E1D5] bg-transparent border-b border-[#D68A3A] outline-none"
            />
          ) : (
            <button
              onClick={() => setEditingSession(true)}
              className="flex-1 text-left text-[15px] font-semibold text-[#E8E1D5]"
            >
              {sessionName}
            </button>
          )}
          {inSession && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-white shadow-sm"
              style={{ background: activeSeat.color }}
            >
              <span>{activeSeat.icon}</span>
              <span>{activeSeat.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODE A — TABLE IS SET (no messages yet)
          Seat tiles grid + agenda visible
      ══════════════════════════════════════════════════════════════ */}
      {!inSession && (
        <div className="flex-1 overflow-y-auto">

          {/* Seat tile grid */}
          <div className="px-4 pt-5 pb-3">
            <p className="text-[10px] uppercase tracking-widest text-[#A99D8D] font-medium mb-3 px-1">
              The council — tap a seat to speak
            </p>
            <div className="grid grid-cols-2 gap-3">
              {seats.map((seat) => {
                const isActive = seat.id === activeSeatId;
                return (
                  <button
                    key={seat.id}
                    onClick={() => setActiveSeatId(seat.id)}
                    onDoubleClick={() => seat.configurable && openConfig(seat)}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-2 rounded-xl px-3 py-5 text-center transition-all active:scale-[0.98]",
                      isActive
                        ? "text-white shadow-[0_0_20px_rgba(214,138,58,0.15)] ring-1 ring-white/20"
                        : "bg-[#251E18] border border-[#31281F] text-[#E8E1D5] shadow-sm"
                    )}
                    style={isActive ? { background: seat.color } : {}}
                  >
                    {seat.configurable && (
                      <span
                        className={cn(
                          "absolute top-2 right-2.5 text-[9px] uppercase tracking-wider font-medium",
                          isActive ? "text-white/60" : "text-[#8E8373]"
                        )}
                      >
                        open
                      </span>
                    )}
                    <span className={cn("text-[28px] leading-none drop-shadow-sm", !isActive && "opacity-80")}>{seat.icon}</span>
                    <span className="text-[15px] font-semibold leading-tight">{seat.name}</span>
                    <span
                      className={cn(
                        "text-[11px] leading-snug px-1",
                        isActive ? "text-white/80" : "text-[#A99D8D]"
                      )}
                    >
                      {seat.description}
                    </span>
                    {seat.configurable && !isActive && (
                      <span className="mt-1 text-[10px] text-[#D68A3A] font-medium">Double-tap to set</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agenda */}
          <div className="px-4 pt-4 pb-8">
            {/* Template switcher */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <p className="text-[10px] uppercase tracking-widest text-[#A99D8D] font-medium flex-1">
                {activeTemplate.id === "weekly" ? "Weekend check-in · 30 min" : "Today's agenda · 30 min"}
              </p>
              <div className="flex gap-1.5">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => loadTemplate(t)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-medium transition-all",
                      activeTemplateId === t.id
                        ? "bg-[#D68A3A] text-white"
                        : "bg-[#2A2118] text-[#A99D8D] border border-[#3D3125]"
                    )}
                  >
                    {t.id === "weekly" ? "↻ Weekly" : "Today"}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-[#F0EAE1] rounded-xl border border-[#DCD3C6] shadow-sm overflow-hidden">
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
                      "w-full flex items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-[#E9DFD2] active:bg-[#E1D5C6]",
                      i < agendaItems.length - 1 ? "border-b border-[#DCD3C6]" : ""
                    )}
                  >
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold text-[#F0EAE1] mt-0.5 shadow-sm"
                      style={{ background: "#D68A3A" }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[14px] font-medium text-[#2A231C] leading-snug">{item.question}</p>
                      <p className="text-[11px] text-[#7A6E5D] mt-1.5 font-medium flex items-center gap-1.5">
                        <span style={{ color: leadSeat?.color ?? "#A99D8D" }} className="opacity-90">{leadSeat?.icon}</span>
                        {item.lead} leads
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#8E8373] text-center mt-4">
              Tap an agenda item to open that question with the right seat selected
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
          <div className="flex-shrink-0 bg-[#1C1814] border-b border-[#31281F]">
            <div className="flex gap-2 px-3 py-2.5 overflow-x-auto scrollbar-hide">
              {seats.map((seat) => {
                const isActive = seat.id === activeSeatId;
                return (
                  <button
                    key={seat.id}
                    onClick={() => setActiveSeatId(seat.id)}
                    onDoubleClick={() => seat.configurable && openConfig(seat)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all border",
                      isActive
                        ? "text-white border-transparent shadow-sm"
                        : "text-[#A99D8D] bg-[#251E18] border-[#31281F]"
                    )}
                    style={isActive ? { background: seat.color } : {}}
                  >
                    <span className="text-[15px] opacity-90">{seat.icon}</span>
                    <span>{seat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agenda toggle */}
          <div className="flex-shrink-0 border-b border-[#31281F] bg-[#251E18]">
            <button
              onClick={() => { setBriefOpen((o) => !o); setEditingBrief(false); }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-left"
            >
              <span className="text-[11px] opacity-70">📋</span>
              <span className="text-[10px] uppercase tracking-wider text-[#A99D8D] font-bold">Agenda</span>
              <span className="text-[10px] text-[#8E8373] ml-1">— {agendaItems.length} items</span>
              <span className="ml-auto text-[10px] text-[#A99D8D]">{briefOpen ? "▲" : "▼"}</span>
            </button>

            {briefOpen && (
              <div className="px-4 pb-4">
                {/* Compact agenda list */}
                <div className="bg-[#F0EAE1] rounded-xl border border-[#DCD3C6] overflow-hidden mb-3 shadow-sm">
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
                          "w-full flex items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-[#E9DFD2] active:bg-[#E1D5C6]",
                          i < agendaItems.length - 1 ? "border-b border-[#DCD3C6]" : ""
                        )}
                      >
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-[#F0EAE1] mt-0.5"
                          style={{ background: "#D68A3A" }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-[12px] text-[#2A231C] font-medium leading-snug pt-0.5">{item.question}</p>
                      </button>
                    );
                  })}
                </div>
                {/* Brief edit */}
                <button
                  onClick={() => setEditingBrief((b) => !b)}
                  className="text-[11px] text-[#D68A3A] hover:text-[#C18C41] underline underline-offset-4 px-1 font-medium transition-colors"
                >
                  {editingBrief ? "close brief" : "edit session brief"}
                </button>
                {editingBrief && (
                  <div className="mt-3">
                    <textarea
                      autoFocus
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      rows={6}
                      className="w-full text-[12px] font-mono leading-relaxed text-[#2A231C] bg-[#F0EAE1] border border-[#DCD3C6] rounded-lg p-3 resize-y outline-none focus:ring-1 focus:ring-[#D68A3A] focus:border-[#D68A3A]"
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => setBrief(DEFAULT_BRIEF)}
                        className="text-[11px] text-[#A99D8D] hover:text-[#E8E1D5] border border-[#31281F] rounded px-3 py-1.5 transition-colors"
                      >reset</button>
                      <button
                        onClick={() => setEditingBrief(false)}
                        className="text-[11px] text-white bg-[#183626] hover:bg-[#1A422D] rounded px-4 py-1.5 font-semibold shadow-sm transition-colors"
                      >done</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 min-h-0">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isStreaming = streaming && msg.id === streamingIdRef.current;
              return (
                <div
                  key={msg.id}
                  className={cn("flex gap-2.5 items-end", isUser ? "flex-row-reverse" : "flex-row")}
                >
                  {!isUser && (
                    <div
                      className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-lg text-white mb-1 shadow-sm"
                      style={{ background: msg.seatColor }}
                    >
                      {seats.find((s) => s.id === msg.seatId)?.icon ?? "◈"}
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[82%] px-4 py-3 text-[14px] leading-relaxed rounded-2xl",
                      isUser
                        ? "bg-[#183626] text-[#F3EFE7] rounded-br-sm shadow-sm"
                        : "bg-[#F0EAE1] text-[#2A231C] border border-[#DCD3C6] rounded-bl-sm shadow-md"
                    )}
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {!isUser && (
                      <p
                        className="text-[10px] uppercase tracking-wider font-bold mb-1.5 opacity-90"
                        style={{ color: msg.seatColor }}
                      >
                        {msg.seatName}
                      </p>
                    )}
                    {msg.content || (isStreaming ? <span className="opacity-40 text-[#D68A3A]">▍</span> : null)}
                    {isStreaming && msg.content && <span className="opacity-40 text-[#D68A3A]">▍</span>}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </>
      )}

      {/* ── Input row (always visible) ── */}
      <div className="flex-shrink-0 border-t border-[#31281F] bg-[#1C1814] px-4 py-3 pb-safe-bottom flex gap-3 items-end">
        <div
          className="flex-1 flex flex-col bg-[#251E18] rounded-xl px-4 pt-3 pb-2.5 transition-colors focus-within:bg-[#2A231C]"
          style={{ border: `1px solid ${activeSeat.color}66` }}
        >
          {!inSession && (
            <p className="text-[10px] uppercase tracking-wider font-bold mb-1.5 opacity-90" style={{ color: activeSeat.color }}>
              {activeSeat.icon} {activeSeat.name}
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
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
            placeholder={inSession ? `Ask ${activeSeat.name}…` : `Tap a seat above, or type to speak to ${activeSeat.name}…`}
            rows={1}
            disabled={streaming}
            className="flex-1 bg-transparent text-[14px] text-[#E8E1D5] placeholder:text-[#8E8373] outline-none resize-none leading-snug"
            style={{ maxHeight: 120 }}
          />
        </div>
        <button
          onClick={send}
          disabled={streaming || !input.trim()}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-[#F3EFE7] flex-shrink-0 transition-all",
            streaming || !input.trim() ? "opacity-30 bg-[#31281F]" : "active:scale-95 shadow-md"
          )}
          style={{ background: streaming || !input.trim() ? undefined : activeSeat.color }}
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 7L7 13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Config modal ── */}
      {configSeatId && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end"
          onClick={(e) => { if (e.target === e.currentTarget) setConfigSeatId(null); }}
        >
          <div className="w-full bg-[#1C1814] border-t border-[#31281F] rounded-t-2xl p-5 pb-safe-bottom shadow-2xl">
            <div className="w-12 h-1.5 bg-[#31281F] rounded-full mx-auto mb-6" />
            <h3 className="text-[18px] font-bold text-[#E8E1D5] mb-1.5">Configure seat</h3>
            <p className="text-[13px] text-[#A99D8D] mb-5">Name a thinker, advisor, or lens for this seat.</p>

            <label className="text-[11px] uppercase tracking-wider text-[#A99D8D] font-semibold block mb-1.5">Name</label>
            <input
              value={configDraft.name}
              onChange={(e) => setConfigDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full text-[15px] text-[#E8E1D5] bg-[#251E18] border border-[#31281F] rounded-lg px-4 py-3 outline-none mb-4 focus:border-[#D68A3A] transition-colors"
            />

            <label className="text-[11px] uppercase tracking-wider text-[#A99D8D] font-semibold block mb-1.5">Role tagline</label>
            <input
              value={configDraft.description}
              onChange={(e) => setConfigDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="e.g. Robin Wall Kimmerer — reciprocity, plant intelligence"
              className="w-full text-[14px] text-[#E8E1D5] bg-[#251E18] border border-[#31281F] rounded-lg px-4 py-3 outline-none mb-4 focus:border-[#D68A3A] transition-colors placeholder:text-[#7A6E5D]"
            />

            <label className="text-[11px] uppercase tracking-wider text-[#A99D8D] font-semibold block mb-1.5">Lens (system prompt)</label>
            <textarea
              value={configDraft.systemPrompt}
              onChange={(e) => setConfigDraft((d) => ({ ...d, systemPrompt: e.target.value }))}
              placeholder="Describe the knowledge framework or thinker this seat speaks from."
              rows={4}
              className="w-full text-[14px] text-[#E8E1D5] bg-[#251E18] border border-[#31281F] rounded-lg px-4 py-3 outline-none mb-6 resize-none leading-relaxed focus:border-[#D68A3A] transition-colors placeholder:text-[#7A6E5D]"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setConfigSeatId(null)}
                className="flex-1 py-3.5 text-[14px] font-medium text-[#A99D8D] hover:text-[#E8E1D5] border border-[#31281F] bg-[#251E18] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="flex-1 py-3.5 text-[14px] font-bold text-[#F3EFE7] bg-[#183626] hover:bg-[#1A422D] rounded-xl shadow-md transition-colors"
              >
                Set seat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

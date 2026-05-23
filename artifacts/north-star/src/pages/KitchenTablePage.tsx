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

// ── Agenda items (shown on table in AGM view) ─────────────────────────────────
const AGENDA_ITEMS = [
  { q: "Q1", question: "Which bundles feel solid and ready to offer today without forcing anything?", lead: "Saltbox", leadId: "saltbox" },
  { q: "Q2", question: "What are the clearest stocks and flows in our current platform that make a bundle actually deliver value?", lead: "Systems", leadId: "systems" },
  { q: "Q3", question: "Where do we see the strongest human-scale economic fit for these bundles right now?", lead: "Community", leadId: "community" },
  { q: "Q4", question: "What naming and framing feels clean, honest, and free of drift for the bundles and for practitioner licensing?", lead: "Codetry", leadId: "codetry" },
  { q: "Q5", question: "How should we speak about practitioner licensing so it feels like natural extension rather than add-on?", lead: "Grok", leadId: "grok" },
  { q: "Q6", question: "What one decision or next action carries the most weight from what we've heard?", lead: "Saltbox", leadId: "saltbox" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export function KitchenTablePage() {
  const [seats, setSeats] = useState<Seat[]>(DEFAULT_SEATS);
  const [activeSeatId, setActiveSeatId] = useState("grok");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionName, setSessionName] = useState("Kitchen Table");
  const [editingSession, setEditingSession] = useState(false);
  const [brief, setBrief] = useState(DEFAULT_BRIEF);
  const [briefOpen, setBriefOpen] = useState(false);
  const [editingBrief, setEditingBrief] = useState(false);
  const [configSeatId, setConfigSeatId] = useState<string | null>(null);
  const [configDraft, setConfigDraft] = useState({ name: "", description: "", systemPrompt: "" });

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
    <div className="flex flex-col h-dvh bg-[#FAFAF9]">

      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-white border-b border-[#E7E5E4] px-4 pt-safe-top">
        <div className="flex items-center gap-2 py-3">
          <span className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-medium">Z2 ·</span>
          {editingSession ? (
            <input
              autoFocus
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onBlur={() => setEditingSession(false)}
              onKeyDown={(e) => { if (e.key === "Enter") setEditingSession(false); }}
              className="flex-1 text-[15px] font-semibold text-[#1C1917] bg-transparent border-b border-[#8A6A1A] outline-none"
            />
          ) : (
            <button
              onClick={() => setEditingSession(true)}
              className="flex-1 text-left text-[15px] font-semibold text-[#1C1917]"
            >
              {sessionName}
            </button>
          )}
          {inSession && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-white"
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
          <div className="px-3 pt-4 pb-2">
            <p className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-medium mb-3 px-1">
              The council — tap a seat to speak
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {seats.map((seat) => {
                const isActive = seat.id === activeSeatId;
                return (
                  <button
                    key={seat.id}
                    onClick={() => setActiveSeatId(seat.id)}
                    onDoubleClick={() => seat.configurable && openConfig(seat)}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-4 text-center transition-all active:scale-[0.97]",
                      isActive
                        ? "text-white shadow-md"
                        : "bg-white border border-[#E7E5E4] text-[#1C1917] shadow-sm"
                    )}
                    style={isActive ? { background: seat.color } : {}}
                  >
                    {seat.configurable && (
                      <span
                        className={cn(
                          "absolute top-2 right-2.5 text-[9px] uppercase tracking-wider font-medium",
                          isActive ? "text-white/60" : "text-[#C4B5A0]"
                        )}
                      >
                        open
                      </span>
                    )}
                    <span className="text-2xl leading-none">{seat.icon}</span>
                    <span className="text-[14px] font-semibold leading-tight">{seat.name}</span>
                    <span
                      className={cn(
                        "text-[10px] leading-snug px-1",
                        isActive ? "text-white/75" : "text-[#A8A29E]"
                      )}
                    >
                      {seat.description}
                    </span>
                    {seat.configurable && !isActive && (
                      <span className="mt-0.5 text-[10px] text-[#C8923A] font-medium">Double-tap to set</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agenda */}
          <div className="px-3 pt-3 pb-6">
            <p className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-medium mb-3 px-1">
              Today's agenda · 30 min
            </p>
            <div className="bg-white rounded-2xl border border-[#E7E5E4] shadow-sm overflow-hidden">
              {AGENDA_ITEMS.map((item, i) => {
                const leadSeat = seats.find((s) => s.id === item.leadId);
                return (
                  <button
                    key={item.q}
                    onClick={() => {
                      setActiveSeatId(item.leadId);
                      setInput(item.question);
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors active:bg-[#F5F0E8]",
                      i < AGENDA_ITEMS.length - 1 ? "border-b border-[#F5F0E8]" : ""
                    )}
                  >
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                      style={{ background: leadSeat?.color ?? "#A8A29E" }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#1C1917] leading-snug">{item.question}</p>
                      <p className="text-[10px] text-[#A8A29E] mt-1">
                        {leadSeat?.icon} {item.lead} leads
                      </p>
                    </div>
                    <svg className="flex-shrink-0 mt-1 opacity-30" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M4 2L8 6L4 10" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-[#C4B5A0] text-center mt-3">
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
          <div className="flex-shrink-0 bg-white border-b border-[#E7E5E4]">
            <div className="flex gap-2 px-3 py-2 overflow-x-auto scrollbar-hide">
              {seats.map((seat) => {
                const isActive = seat.id === activeSeatId;
                return (
                  <button
                    key={seat.id}
                    onClick={() => setActiveSeatId(seat.id)}
                    onDoubleClick={() => seat.configurable && openConfig(seat)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all border",
                      isActive
                        ? "text-white border-transparent shadow-sm"
                        : "text-[#57534E] bg-[#F5F0E8] border-[#E7E5E4]"
                    )}
                    style={isActive ? { background: seat.color } : {}}
                  >
                    <span className="text-[15px]">{seat.icon}</span>
                    <span>{seat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agenda toggle */}
          <div className="flex-shrink-0 border-b border-[#E7E5E4] bg-[#FEFCF8]">
            <button
              onClick={() => { setBriefOpen((o) => !o); setEditingBrief(false); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left"
            >
              <span className="text-[11px]">📋</span>
              <span className="text-[10px] uppercase tracking-wider text-[#A8A29E] font-medium">Agenda</span>
              <span className="text-[9px] text-[#C4B5A0] ml-1">— {AGENDA_ITEMS.length} items</span>
              <span className="ml-auto text-[10px] text-[#A8A29E]">{briefOpen ? "▲" : "▼"}</span>
            </button>

            {briefOpen && (
              <div className="px-3 pb-3">
                {/* Compact agenda list */}
                <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden mb-2">
                  {AGENDA_ITEMS.map((item, i) => {
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
                          "w-full flex items-start gap-2.5 px-3 py-2.5 text-left transition-colors active:bg-[#F5F0E8]",
                          i < AGENDA_ITEMS.length - 1 ? "border-b border-[#F5F0E8]" : ""
                        )}
                      >
                        <span
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white mt-0.5"
                          style={{ background: leadSeat?.color ?? "#A8A29E" }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-[11px] text-[#44403C] leading-snug">{item.question}</p>
                      </button>
                    );
                  })}
                </div>
                {/* Brief edit */}
                <button
                  onClick={() => setEditingBrief((b) => !b)}
                  className="text-[10px] text-[#A8A29E] underline underline-offset-2 px-1"
                >
                  {editingBrief ? "close brief" : "edit session brief"}
                </button>
                {editingBrief && (
                  <div className="mt-2">
                    <textarea
                      autoFocus
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      rows={6}
                      className="w-full text-[11px] font-mono leading-relaxed text-[#44403C] bg-white border border-[#E7E5E4] rounded-lg p-3 resize-y outline-none focus:border-[#8A6A1A]/40"
                    />
                    <div className="flex gap-2 mt-1.5 justify-end">
                      <button
                        onClick={() => setBrief(DEFAULT_BRIEF)}
                        className="text-[10px] text-[#78716C] border border-[#E7E5E4] rounded px-2.5 py-1"
                      >reset</button>
                      <button
                        onClick={() => setEditingBrief(false)}
                        className="text-[10px] text-white bg-[#1F3D2E] rounded px-3 py-1 font-medium"
                      >done</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isStreaming = streaming && msg.id === streamingIdRef.current;
              return (
                <div
                  key={msg.id}
                  className={cn("flex gap-2 items-end", isUser ? "flex-row-reverse" : "flex-row")}
                >
                  {!isUser && (
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm text-white mb-0.5"
                      style={{ background: msg.seatColor }}
                    >
                      {seats.find((s) => s.id === msg.seatId)?.icon ?? "◈"}
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[78%] px-4 py-3 text-[13px] leading-relaxed rounded-2xl",
                      isUser
                        ? "bg-[#1F3D2E] text-[#F4EDE0] rounded-br-sm"
                        : "bg-white border border-[#E7E5E4] text-[#1C1917] rounded-bl-sm shadow-sm"
                    )}
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {!isUser && (
                      <p
                        className="text-[10px] uppercase tracking-wider font-semibold mb-1.5"
                        style={{ color: msg.seatColor }}
                      >
                        {msg.seatName}
                      </p>
                    )}
                    {msg.content || (isStreaming ? <span className="opacity-30">▍</span> : null)}
                    {isStreaming && msg.content && <span className="opacity-30">▍</span>}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </>
      )}

      {/* ── Input row (always visible) ── */}
      <div className="flex-shrink-0 border-t border-[#E7E5E4] bg-white px-3 py-2.5 pb-safe-bottom flex gap-2 items-end">
        <div
          className="flex-1 flex flex-col bg-[#F5F0E8] rounded-2xl px-3.5 pt-2.5 pb-2"
          style={{ border: `1.5px solid ${activeSeat.color}44` }}
        >
          {!inSession && (
            <p className="text-[9px] uppercase tracking-wider font-semibold mb-1" style={{ color: activeSeat.color }}>
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
            className="flex-1 bg-transparent text-[13px] text-[#1C1917] placeholder:text-[#A8A29E] outline-none resize-none leading-snug"
            style={{ maxHeight: 120 }}
          />
        </div>
        <button
          onClick={send}
          disabled={streaming || !input.trim()}
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-all",
            streaming || !input.trim() ? "opacity-25" : "active:scale-95"
          )}
          style={{ background: streaming || !input.trim() ? "#C4B5A0" : activeSeat.color }}
        >
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 7L7 13M1 7H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Config modal ── */}
      {configSeatId && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={(e) => { if (e.target === e.currentTarget) setConfigSeatId(null); }}
        >
          <div className="w-full bg-[#FAFAF9] rounded-t-3xl p-5 pb-safe-bottom">
            <div className="w-10 h-1 bg-[#E7E5E4] rounded-full mx-auto mb-5" />
            <h3 className="text-[16px] font-semibold text-[#1C1917] mb-1">Configure seat</h3>
            <p className="text-[11px] text-[#A8A29E] mb-4">Name a thinker, advisor, or lens for this seat.</p>

            <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] block mb-1">Name</label>
            <input
              value={configDraft.name}
              onChange={(e) => setConfigDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full text-[14px] text-[#1C1917] bg-white border border-[#E7E5E4] rounded-xl px-3 py-2.5 outline-none mb-3 focus:border-[#8A6A1A]/50"
            />

            <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] block mb-1">Role tagline</label>
            <input
              value={configDraft.description}
              onChange={(e) => setConfigDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="e.g. Robin Wall Kimmerer — reciprocity, plant intelligence"
              className="w-full text-[13px] text-[#1C1917] bg-white border border-[#E7E5E4] rounded-xl px-3 py-2.5 outline-none mb-3 focus:border-[#8A6A1A]/50"
            />

            <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] block mb-1">Lens (system prompt)</label>
            <textarea
              value={configDraft.systemPrompt}
              onChange={(e) => setConfigDraft((d) => ({ ...d, systemPrompt: e.target.value }))}
              placeholder="Describe the knowledge framework or thinker this seat speaks from."
              rows={4}
              className="w-full text-[12px] text-[#1C1917] bg-white border border-[#E7E5E4] rounded-xl px-3 py-2.5 outline-none mb-4 resize-none leading-relaxed focus:border-[#8A6A1A]/50"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setConfigSeatId(null)}
                className="flex-1 py-3 text-[13px] text-[#78716C] border border-[#E7E5E4] rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="flex-1 py-3 text-[13px] text-white bg-[#1F3D2E] rounded-2xl font-semibold"
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

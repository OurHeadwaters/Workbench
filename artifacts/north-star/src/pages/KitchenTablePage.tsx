import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ── Default brief ─────────────────────────────────────────────────────────────
const DEFAULT_BRIEF = `PROJECT: The Stomping Path + Codetry Platform Suite
Last updated: May 22, 2026
Session: Round Table build day — Zone Bubble Map, Lifestyle Map, Codetry
Digital Sovereignty Map, constitutional framework poured.

---
WHAT THIS IS
Two connected platforms in a pnpm monorepo:
1. THE STOMPING PATH (survival-podcast) — A homestead sovereignty platform.
   Rugged/earthy. Auth-gated. Permaculture zone framework. Community, podcast,
   learning tracks, expert council.
2. CODETRY — A digital self-reliance agency site. Builds community-owned
   software for food co-ops, First Nations, rural hubs. No auth required.
   Forge aesthetic (dark green, amber, ember particles).
Shared: Express API server, Postgres/Drizzle database, OpenAI gpt-4o-mini.

---
THE CONSTITUTIONAL FRAMEWORK (Three Layers)
Layer 1 — Naming (vocabulary):
  Saltbox, Eave, Workbench, Compost — constellation/tool names

Layer 2 — Trust-Gradient Spine (LOAD-BEARING, governs all schema):
  Z0 Dwelling/Household → Z1 Circle → Z2 Home Range →
  Z3 Community → Z4 Trade → Z5 Wild

Layer 3 — Practitioner Energy (display only):
  Dual labels: "Household / Afloat", "Home Range / Build now", etc.

THE EAVE RULE (poured concrete, non-negotiable):
  The Eave is the hard structural seam between Zone 1 (Circle — private
  household identity) and Zone 3 (Community — XRPL wallet, above-board
  organizational identity).
  No table, no foreign key, no join, no query path, and no stored reference
  may ever connect a Zone 3 wallet address to a Zone 1 household record.
  Any feature that would create such a path must be refused or redesigned.

THE KITCHEN TABLE sits in Zone 2 (Home Range / Workbench).
  It is the deliberation space where ideas are worked before they cross gates.
  The Saltbox seat lives here. Curtains drawn by default.

---
THE ZONE FRAMEWORK (TSP — 6 zones)
Z0 — The Self: mindset, money, personal sovereignty
Z1 — The Home: food storage, preparedness, basic resilience
Z2 — The Garden: permaculture, food production, small livestock
Z3 — The Homestead: livestock, off-grid systems, alternative energy
Z4 — The Forest: hunting, foraging, bushcraft, wildcrafting
Z5 — The Wild: grid-down, wilderness survival, contingency
Gate ceremonies between each zone. Skip prohibitions: Z1 cannot jump
to Z3, Z4, or Z5. Z2 cannot jump to Z5. These are architectural rules,
not suggestions.
Gatekeeper is a personal cap (resolved, Round Table May 2026).

---
WHAT'S BEEN BUILT (as of this session)
TSP:
- Lifestyle Map: 7-question Mad Libs → AI zone placement → interactive map
  with primary/secondary zone, rationale, surrender mode, visited zones
- Zone Bubble Map: SVG interactive map, all 6 zones, gate ceremonies, skip
  prohibitions, Eave overhang, zone progress arcs from listening history,
  episode navigation from zone/gate clicks
- Fireside Freedom Podcast: RSS feed, 7 crew members in Expert Council
- Gord Bird mascot: shared @workspace/gord-bird package, all routes
CODETRY:
- Digital Sovereignty Map (/discover): same onboarding pattern adapted for
  communities. 6 stages (Dependent → Sovereign). AI recommends Zone Assessment
  / Hub Implementation / Regional Platform. localStorage persistence, no auth.
- "Find your zone" CTA in nav and home hero
NOT BUILT YET:
- North Star Guide (/north-star/ route) — referenced in docs, not in codebase
- constellation.json — does not exist
- docs/codetry/ — does not exist
- The Kitchen Table UI (built in separate project — this one)
- Five unwritten chapters: literal hempcrete, youth, headwaters people,
  women's chapter, tradesperson on-ramp

---
OPEN TENSIONS
1. Eave naming collision — "Eave" now names the constitutional seam (Layer 2).
   The Z1 income/sovereignty constellation needs a new name.
   STATUS: Unresolved.
2. Saltbox disambiguation — Saltbox is a constellation (tool) inside Zone 0,
   not a zone label. Also now a seat name at this table.
   STATUS: Functional, not formally documented.
3. Headwaters / Watershed label collisions — both used across layers.
   STATUS: Flagged, not resolved.
4. Z4/Z5 gate ceremonies on the live TSP site — the bubble map prototype has
   them, the live survival-podcast ZoneBubbleMap component may not.
   STATUS: Check before building on.
5. Practitioner Intake Tool (Task #544) — brain dump → zone placement →
   push to TSP. In progress, waiting for input.
   STATUS: Blocked.

---
VOCABULARY (quick reference)
Founding mode: Building sovereignty from scratch
Reclamation mode: Board-by-board recovery inside someone else's house
The grindstone: The builder — hands full, eyes on the material
The oil: The person handling the outside world so the grindstone can work
The frame: Zone 0 household unit — what you're enclosing, who's inside
Hempcrete: The naming/vocabulary practice — fills, insulates, breathes
Windows: Intentional openings — you choose where light enters
The gate: The Eave — privacy boundary, household interior vs. outside
The giraffe: The regulatory apparatus — sees over the fence, can't enter
                without crossing the trigger threshold

---
PULL QUOTES IN CIRCULATION
"The materials are the same. The order of operations is not."
"You cannot demolish while a thousand people are living inside."
"That engine does not grind without the oil."
"Hang the gate before you invite anyone in."
"It stops being invisible when you name it."
"No one is interjecting while you work. Do the next thing."`;


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

  return (
    <div className="flex flex-col h-dvh bg-[#FAFAF9] pb-[72px]">

      {/* ── Header ── */}
      <div className="flex-shrink-0 border-b border-[#E7E5E4] bg-white px-4 pt-safe-top">
        <div className="flex items-center gap-2 py-3">
          <span className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-medium">
            Zone 0 ·
          </span>
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
              className="flex-1 text-left text-[15px] font-semibold text-[#1C1917] border-b border-dashed border-[#C8923A]/40"
            >
              {sessionName}
            </button>
          )}
          <span className="text-[11px] text-[#A8A29E]">
            {activeSeat.icon} {activeSeat.name}
          </span>
        </div>
      </div>

      {/* ── Seat chips ── */}
      <div className="flex-shrink-0 border-b border-[#E7E5E4] bg-white">
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide">
          {seats.map((seat) => {
            const isActive = seat.id === activeSeatId;
            return (
              <button
                key={seat.id}
                onClick={() => setActiveSeatId(seat.id)}
                onDoubleClick={() => seat.configurable && openConfig(seat)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                  isActive
                    ? "text-white border-transparent shadow-sm"
                    : "text-[#57534E] bg-[#F5F0E8] border-[#E7E5E4] hover:border-[#C8923A]/40"
                )}
                style={isActive ? { background: seat.color, borderColor: seat.color } : {}}
              >
                <span>{seat.icon}</span>
                <span>{seat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Brief ── */}
      <div className="flex-shrink-0 border-b border-[#E7E5E4] bg-[#FEFCF8]">
        <button
          onClick={() => { setBriefOpen((o) => !o); setEditingBrief(false); }}
          className="flex items-center gap-2 w-full px-4 py-2 text-left"
        >
          <span className="text-[11px]">📄</span>
          <span className="text-[10px] uppercase tracking-wider text-[#A8A29E] font-medium">
            Brief on the table
          </span>
          <span className="text-[9px] text-[#C4B5A0] ml-1">— read by every seat</span>
          <span className="ml-auto text-[10px] text-[#A8A29E]">{briefOpen ? "▲" : "▼"}</span>
        </button>

        {briefOpen && (
          <div className="px-4 pb-3">
            {editingBrief ? (
              <div>
                <textarea
                  autoFocus
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={8}
                  className="w-full text-[11px] font-mono leading-relaxed text-[#44403C] bg-white border border-[#E7E5E4] rounded-lg p-3 resize-y outline-none focus:border-[#8A6A1A]/40"
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => setBrief(DEFAULT_BRIEF)}
                    className="text-[10px] text-[#78716C] border border-[#E7E5E4] rounded px-2.5 py-1"
                  >
                    reset
                  </button>
                  <button
                    onClick={() => setEditingBrief(false)}
                    className="text-[10px] text-white bg-[#1F3D2E] rounded px-3 py-1 font-medium"
                  >
                    done
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditingBrief(true)}
                className="w-full text-left text-[10px] font-mono leading-relaxed text-[#78716C] bg-[#FFFEF9] border border-dashed border-[#E7E5E4] rounded-lg p-3 max-h-32 overflow-y-auto"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {brief}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Chat messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F5F0E8] flex items-center justify-center text-2xl opacity-60">
              ⌂
            </div>
            <div>
              <p className="text-sm font-semibold text-[#44403C]">The table is set.</p>
              <p className="text-xs text-[#A8A29E] mt-1">
                Select a seat and say what's on your mind.
              </p>
            </div>
            <div className="mt-2 px-4 py-3 rounded-xl bg-[#F5F0E8] max-w-xs">
              <p className="text-[11px] text-[#78716C] leading-relaxed">
                Each seat reads the brief before responding. Tap the brief bar above to view or edit it.
              </p>
            </div>
          </div>
        )}

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
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white mb-0.5"
                  style={{ background: msg.seatColor }}
                >
                  {seats.find((s) => s.id === msg.seatId)?.icon ?? "◈"}
                </div>
              )}
              <div
                className={cn(
                  "max-w-[78%] px-3.5 py-2.5 text-[13px] leading-relaxed rounded-2xl",
                  isUser
                    ? "bg-[#1F3D2E] text-[#F4EDE0] rounded-br-sm"
                    : "bg-white border border-[#E7E5E4] text-[#1C1917] rounded-bl-sm shadow-sm"
                )}
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {!isUser && (
                  <p
                    className="text-[9px] uppercase tracking-wider font-semibold mb-1"
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

      {/* ── Input row ── */}
      <div className="flex-shrink-0 border-t border-[#E7E5E4] bg-white px-3 py-2.5 flex gap-2 items-end">
        <div
          className="flex-1 flex items-end bg-[#F5F0E8] rounded-2xl px-3.5 py-2"
          style={{ border: `1.5px solid ${activeSeat.color}33` }}
        >
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
              el.style.height = Math.min(el.scrollHeight, 100) + "px";
            }}
            placeholder={`Ask ${activeSeat.name}…`}
            rows={1}
            disabled={streaming}
            className="flex-1 bg-transparent text-[13px] text-[#1C1917] placeholder:text-[#A8A29E] outline-none resize-none leading-snug"
            style={{ maxHeight: 100 }}
          />
        </div>
        <button
          onClick={send}
          disabled={streaming || !input.trim()}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-all",
            streaming || !input.trim() ? "opacity-30" : "hover:opacity-90 active:scale-95"
          )}
          style={{ background: streaming || !input.trim() ? "#C4B5A0" : activeSeat.color }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 7L7 13M1 7H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Config modal ── */}
      {configSeatId && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end"
          onClick={(e) => { if (e.target === e.currentTarget) setConfigSeatId(null); }}
        >
          <div className="w-full bg-[#FAFAF9] rounded-t-2xl p-5 pb-safe-bottom">
            <div className="w-10 h-1 bg-[#E7E5E4] rounded-full mx-auto mb-5" />
            <h3 className="text-[15px] font-semibold text-[#1C1917] mb-4">Configure seat</h3>

            <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] block mb-1">Name</label>
            <input
              value={configDraft.name}
              onChange={(e) => setConfigDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full text-[13px] text-[#1C1917] bg-white border border-[#E7E5E4] rounded-lg px-3 py-2 outline-none mb-3 focus:border-[#8A6A1A]/50"
            />

            <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] block mb-1">Description</label>
            <input
              value={configDraft.description}
              onChange={(e) => setConfigDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="e.g. Robin Wall Kimmerer — reciprocity, plant intelligence"
              className="w-full text-[13px] text-[#1C1917] bg-white border border-[#E7E5E4] rounded-lg px-3 py-2 outline-none mb-3 focus:border-[#8A6A1A]/50"
            />

            <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] block mb-1">Lens (system prompt)</label>
            <textarea
              value={configDraft.systemPrompt}
              onChange={(e) => setConfigDraft((d) => ({ ...d, systemPrompt: e.target.value }))}
              placeholder="Describe the knowledge framework or thinker this seat speaks from."
              rows={5}
              className="w-full text-[12px] text-[#1C1917] bg-white border border-[#E7E5E4] rounded-lg px-3 py-2 outline-none mb-4 resize-none leading-relaxed focus:border-[#8A6A1A]/50"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setConfigSeatId(null)}
                className="flex-1 py-2.5 text-[13px] text-[#78716C] border border-[#E7E5E4] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="flex-1 py-2.5 text-[13px] text-white bg-[#1F3D2E] rounded-xl font-medium"
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

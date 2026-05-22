import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ── Default brief ─────────────────────────────────────────────────────────────
const DEFAULT_BRIEF = `PROJECT — Codetry
Community economy operating system for Headwaters / ourheadwaters.ca.
Practitioner: Bobbie Parr, Wabigoon ON. Status: naming discipline phase.

ZONE MODEL
Z0 Saltbox — household substrate; the most private layer; where posture is grown.
Z1 Circle — members / trust layer; passage via the Eave (not a cap ceremony).
Z2 Workbench — practitioners layer; passage via cap gate (Practitioner / Steward / Observer).
Z3 Community — public interface; passage via Representative / Neighbour / Gatekeeper gate.
Prohibition: Z1 → Z3 direct crossing is blocked.

THREE-LAYER TRUST STACK
1. Posture substrate — the Standby (liturgy, not curriculum; six-word vocabulary; four-rung ladder: advisory / standby / active / standdown).
2. Cap ceremony — gate ritual; declaration of posture; the moment of becoming.
3. Blockchain enforcement — the chain witnesses the opening and (via Debrief receipt) the standing down.

CURTAINS
The household's deliberation boundary. Drawn = private, kitchen table only, nothing passes the Eave. Open = ready to share with the Circle. Opening the curtains is the pre-Eave declaration.

VOCABULARY
cap / hat: the role declaration artefact (name under review — may not be strong enough to carry identity + posture + cryptographic authority simultaneously).
the Standby: posture substrate — grows the capacity to declare a cap without choosing from a menu.
the Eave: Z0 → Z1 passage.
the Debrief: the standing-down ritual; should write a cryptographic receipt back to the membrane.
curtains: household deliberation boundary.

OPEN TENSIONS (six)
1. Key custody primitive at Z0 — what is the household jar equivalent for Saltbox practice?
2. Emergency override — what is the higher-friction path when the Z1 → Z3 prohibition meets genuine emergency?
3. Debrief as on-chain receipt — how does the chain see that the cycle closed, not just opened?
4. Cap ceremony + wallet UX — how do you preserve ritual when a screen interrupts it?
5. Gatekeeper cap — personal cap or Workbench-only function? Still unresolved.
6. "Cap" as a noun — does it hold the weight of identity, posture, and cryptographic authority simultaneously?`;

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

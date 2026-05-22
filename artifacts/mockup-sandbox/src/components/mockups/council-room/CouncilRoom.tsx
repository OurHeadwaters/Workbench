import { useState, useRef, useEffect, useCallback } from "react";

// ── Design tokens (Z0 kitchen palette) ──────────────────────────────────────
const C = {
  cream: "#F4EDE0",
  wood: "#D9BC96",
  woodBorder: "#B8935A",
  ink: "#1C1917",
  inkLight: "#57534E",
  rule: "#C4956A44",
  evergreen: "#1F3D2E",
  rust: "#B85A3E",
};

// ── Seat definitions ─────────────────────────────────────────────────────────
type Seat = {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  bgLight: string;
  model: string;
  systemPrompt: string;
  configurable: boolean;
  description: string;
};

const DEFAULT_SEATS: Seat[] = [
  {
    id: "grok",
    name: "Grok",
    shortName: "Grok",
    icon: "◈",
    color: "#4F46E5",
    bgLight: "#EEF2FF",
    model: "x-ai/grok-4.20",
    configurable: false,
    description: "Raw AI — direct, honest, no hedging",
    systemPrompt: `You are a direct, honest AI assistant sitting at a kitchen table with a community economy practitioner in northern Ontario. You give concrete, well-reasoned answers. You do not hedge unnecessarily. Short paragraphs. Plain language. When asked for design advice or a sounding board, you engage fully and push back where the thinking is weak. You know about community economics, naming discipline, and trust systems.`,
  },
  {
    id: "systems",
    name: "Systems Lens",
    shortName: "Systems",
    icon: "⟳",
    color: "#059669",
    bgLight: "#ECFDF5",
    model: "x-ai/grok-4.20",
    configurable: false,
    description: "Donella Meadows — stocks, flows, leverage",
    systemPrompt: `You see through the lens of systems thinking, drawing on Donella Meadows' "Thinking in Systems." When asked a question, you identify the stocks, flows, feedback loops, delays, and leverage points at work. You name the system archetype if one applies (fixes that fail, shifting the burden, tragedy of the commons, etc.). You are not academic — you are at a kitchen table helping a practitioner see what the system is actually doing. Short, precise answers. Use diagrams described in plain text if helpful.`,
  },
  {
    id: "community-econ",
    name: "Community Economist",
    shortName: "Community",
    icon: "⌂",
    color: "#D97706",
    bgLight: "#FFFBEB",
    model: "x-ai/grok-4.20",
    configurable: false,
    description: "Schumacher + Jacobs — human-scale economics",
    systemPrompt: `You think from the tradition of human-scale economics: E.F. Schumacher's "Small is Beautiful," Jane Jacobs' "The Economy of Cities" and "The Death and Life of Great American Cities," and the broader tradition of local economic resilience. You look for: local multipliers, import replacement, diversity over monoculture, the importance of mixed-use and mixed-economy. You are suspicious of scale for its own sake. You care about what sustains a community over a generation. Plain language, no jargon. You are at a kitchen table in a small northern Ontario community.`,
  },
  {
    id: "codetry",
    name: "Codetry Guide",
    shortName: "Codetry",
    icon: "☷",
    color: "#1F3D2E",
    bgLight: "#F0FDF4",
    model: "x-ai/grok-4.20",
    configurable: false,
    description: "Handbook — naming discipline, zone model",
    systemPrompt: `You are a practitioner of codetry — the discipline of naming community economy systems correctly so that the name can do structural work. You apply three naming tests: (1) Saltbox test — does the name bound one thing and not two? (2) Both-States test — does it work when the system is empty and when it is full? (3) Both-Sides test — does it work for the practitioner and for the technical enforcement layer? You know the Headwaters constellation: Zone 0 Saltbox (household substrate), Zone 1 Circle (members/trust), Zone 2 Workbench (practitioners/work), Zone 3 Community (public interface), the Eave (Z0→Z1 passage, not a hat ceremony), the three-layer trust stack (posture substrate / gate ceremony / blockchain enforcement), the Standby (posture substrate, six-word vocabulary, four-rung ladder). You speak plainly. You push back on nouns that are doing the wrong job. You are not a chatbot — you are a practitioner at a table.`,
  },
  {
    id: "open-a",
    name: "Open Seat",
    shortName: "Open A",
    icon: "○",
    color: "#78716C",
    bgLight: "#F5F5F4",
    model: "x-ai/grok-4.20",
    configurable: true,
    description: "Drop a name or framework here",
    systemPrompt: `You are a thoughtful advisor at a kitchen table. Answer questions directly and honestly.`,
  },
  {
    id: "open-b",
    name: "Open Seat",
    shortName: "Open B",
    icon: "○",
    color: "#78716C",
    bgLight: "#F5F5F4",
    model: "x-ai/grok-4.20",
    configurable: true,
    description: "Drop a name or framework here",
    systemPrompt: `You are a thoughtful advisor at a kitchen table. Answer questions directly and honestly.`,
  },
];

// ── Seat positions around a circle ───────────────────────────────────────────
// 6 seats, starting from top (270°), clockwise
function getSeatPosition(index: number, total: number, radius: number, cx: number, cy: number) {
  const angle = ((index / total) * 2 * Math.PI) - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  seatId: string;
  seatName: string;
  seatColor: string;
};

// ── Main component ────────────────────────────────────────────────────────────
export default function CouncilRoom() {
  const [seats, setSeats] = useState<Seat[]>(DEFAULT_SEATS);
  const [activeSeatId, setActiveSeatId] = useState<string>("grok");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionName, setSessionName] = useState("Kitchen Table");
  const [editingSession, setEditingSession] = useState(false);
  const [configSeatId, setConfigSeatId] = useState<string | null>(null);
  const [configDraft, setConfigDraft] = useState({ name: "", description: "", systemPrompt: "" });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

    try {
      const res = await fetch("/api/council/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          systemPrompt: activeSeat.systemPrompt,
          model: activeSeat.model,
        }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: "⚠ Could not reach the council API." } : m
          )
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
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + `\n\n⚠ ${chunk.error}` }
                    : m
                )
              );
            } else if (chunk.content) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + chunk.content } : m
                )
              );
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: "⚠ Network error." } : m
        )
      );
    }

    setStreaming(false);
    streamingIdRef.current = null;
  }, [input, streaming, activeSeat, messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const openConfig = (seat: Seat) => {
    setConfigSeatId(seat.id);
    setConfigDraft({
      name: seat.name,
      description: seat.description,
      systemPrompt: seat.systemPrompt,
    });
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

  // Table geometry
  const TABLE_CX = 200;
  const TABLE_CY = 200;
  const TABLE_R = 70;
  const SEAT_R = 130;
  const N = seats.length;

  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        background: C.cream,
        minHeight: "100vh",
        color: C.ink,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          borderBottom: `1px solid ${C.rule}`,
          padding: "14px 24px 10px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: C.cream,
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkLight }}>
          Zone 0 ·
        </span>
        {editingSession ? (
          <input
            autoFocus
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            onBlur={() => setEditingSession(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setEditingSession(false); }}
            style={{
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              borderBottom: `1px solid ${C.woodBorder}`,
              background: "transparent",
              color: C.ink,
              outline: "none",
              width: 220,
            }}
          />
        ) : (
          <span
            onClick={() => setEditingSession(true)}
            title="Click to rename session"
            style={{ fontSize: 15, fontWeight: 600, cursor: "text", borderBottom: `1px dashed ${C.woodBorder}` }}
          >
            {sessionName}
          </span>
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: C.inkLight }}>
          {activeSeat.icon} {activeSeat.name} is speaking
        </span>
      </div>

      {/* ── Body: table + chat ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* ── Left: table overhead ── */}
        <div
          style={{
            width: 400,
            flexShrink: 0,
            borderRight: `1px solid ${C.rule}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 0 16px",
            gap: 0,
          }}
        >
          <div style={{ position: "relative", width: 400, height: 400 }}>
            <svg
              width={400}
              height={400}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {/* Subtle grain lines on table */}
              {[...Array(8)].map((_, i) => (
                <ellipse
                  key={i}
                  cx={TABLE_CX}
                  cy={TABLE_CY}
                  rx={TABLE_R - 8 + i * 10}
                  ry={TABLE_R - 8 + i * 10}
                  fill="none"
                  stroke={C.wood}
                  strokeWidth={0.5}
                  opacity={0.3}
                />
              ))}
              {/* Table circle */}
              <circle cx={TABLE_CX} cy={TABLE_CY} r={TABLE_R} fill={C.wood} stroke={C.woodBorder} strokeWidth={2.5} />
              {/* Session name in table center */}
              <foreignObject x={TABLE_CX - 54} y={TABLE_CY - 18} width={108} height={36}>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    color: C.evergreen,
                    lineHeight: 1.3,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  <div style={{ opacity: 0.6, fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>session</div>
                  <div style={{ fontWeight: 600 }}>{sessionName}</div>
                </div>
              </foreignObject>
              {/* Seat lines to table */}
              {seats.map((seat, i) => {
                const pos = getSeatPosition(i, N, SEAT_R, TABLE_CX, TABLE_CY);
                const edge = getSeatPosition(i, N, TABLE_R + 2, TABLE_CX, TABLE_CY);
                const isActive = seat.id === activeSeatId;
                return (
                  <line
                    key={seat.id}
                    x1={edge.x}
                    y1={edge.y}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={isActive ? seat.color : C.woodBorder}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray={isActive ? "none" : "3 4"}
                    opacity={isActive ? 0.8 : 0.3}
                  />
                );
              })}
            </svg>

            {/* Seat buttons */}
            {seats.map((seat, i) => {
              const pos = getSeatPosition(i, N, SEAT_R, TABLE_CX, TABLE_CY);
              const isActive = seat.id === activeSeatId;
              return (
                <button
                  key={seat.id}
                  onClick={() => setActiveSeatId(seat.id)}
                  onDoubleClick={() => seat.configurable && openConfig(seat)}
                  title={seat.configurable ? `${seat.name} — double-click to configure` : seat.name}
                  style={{
                    position: "absolute",
                    left: pos.x - 38,
                    top: pos.y - 34,
                    width: 76,
                    height: 68,
                    borderRadius: 10,
                    border: `2px solid ${isActive ? seat.color : C.woodBorder + "66"}`,
                    background: isActive ? seat.bgLight : C.cream,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    boxShadow: isActive ? `0 2px 12px ${seat.color}33` : "0 1px 3px rgba(0,0,0,0.08)",
                    transition: "all 0.15s ease",
                    padding: 0,
                  }}
                >
                  <span style={{ fontSize: 18, color: isActive ? seat.color : C.inkLight }}>{seat.icon}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: isActive ? seat.color : C.inkLight,
                      lineHeight: 1.1,
                      textAlign: "center",
                      padding: "0 4px",
                    }}
                  >
                    {seat.shortName}
                  </span>
                  {seat.configurable && (
                    <span style={{ fontSize: 7, color: C.inkLight, opacity: 0.5 }}>dbl-click</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active seat description */}
          <div
            style={{
              margin: "0 20px",
              padding: "12px 16px",
              borderRadius: 8,
              background: activeSeat.bgLight,
              border: `1px solid ${activeSeat.color}33`,
              maxWidth: 340,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16, color: activeSeat.color }}>{activeSeat.icon}</span>
              <span style={{ fontWeight: 600, fontSize: 13, color: activeSeat.color }}>{activeSeat.name}</span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: C.inkLight, lineHeight: 1.5 }}>{activeSeat.description}</p>
          </div>

          {/* Clear chat */}
          <button
            onClick={() => setMessages([])}
            style={{
              marginTop: 12,
              fontSize: 10,
              color: C.inkLight,
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            ✕ clear session
          </button>
        </div>

        {/* ── Right: chat panel ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: C.inkLight,
                  fontSize: 13,
                  marginTop: 60,
                  lineHeight: 1.8,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.3 }}>⌂</div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>The table is set.</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  Select a seat and say what's on your mind.
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isStreaming = streaming && msg.id === streamingIdRef.current;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: isUser ? "row-reverse" : "row",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  {/* Avatar */}
                  {!isUser && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: msg.seatColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#fff",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {seats.find((s) => s.id === msg.seatId)?.icon ?? "◈"}
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "10px 14px",
                      borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: isUser ? C.evergreen : "#fff",
                      color: isUser ? C.cream : C.ink,
                      fontSize: 13,
                      lineHeight: 1.65,
                      border: isUser ? "none" : `1px solid ${C.rule}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {!isUser && (
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: msg.seatColor,
                          marginBottom: 5,
                        }}
                      >
                        {msg.seatName}
                      </div>
                    )}
                    {msg.content || (isStreaming ? <span style={{ opacity: 0.4 }}>▍</span> : null)}
                    {isStreaming && msg.content && <span style={{ opacity: 0.4 }}>▍</span>}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: `1px solid ${C.rule}`,
              padding: "14px 20px",
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              background: C.cream,
            }}
          >
            <div
              style={{
                flex: 1,
                border: `1.5px solid ${activeSeat.color}55`,
                borderRadius: 10,
                background: "#fff",
                display: "flex",
                alignItems: "flex-end",
                padding: "2px 4px 2px 12px",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={`Ask ${activeSeat.name}… (Enter to send, Shift+Enter for newline)`}
                rows={1}
                disabled={streaming}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                  fontSize: 13,
                  background: "transparent",
                  color: C.ink,
                  padding: "8px 0",
                  lineHeight: 1.5,
                  maxHeight: 120,
                  overflowY: "auto",
                }}
                onInput={(e) => {
                  const el = e.target as HTMLTextAreaElement;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <button
              onClick={send}
              disabled={streaming || !input.trim()}
              style={{
                padding: "9px 18px",
                borderRadius: 8,
                border: "none",
                background: streaming || !input.trim() ? C.woodBorder + "55" : activeSeat.color,
                color: "#fff",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 600,
                cursor: streaming || !input.trim() ? "not-allowed" : "pointer",
                transition: "background 0.15s",
                letterSpacing: "0.02em",
                flexShrink: 0,
              }}
            >
              {streaming ? "…" : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Config modal for open seats ── */}
      {configSeatId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28,25,23,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfigSeatId(null); }}
        >
          <div
            style={{
              background: C.cream,
              borderRadius: 14,
              padding: 28,
              width: 480,
              maxWidth: "90vw",
              border: `1px solid ${C.woodBorder}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700 }}>Configure seat</h3>

            <label style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: C.inkLight }}>
              Seat name
            </label>
            <input
              value={configDraft.name}
              onChange={(e) => setConfigDraft((d) => ({ ...d, name: e.target.value }))}
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                marginBottom: 14,
                padding: "7px 10px",
                borderRadius: 6,
                border: `1px solid ${C.woodBorder}`,
                fontFamily: "inherit",
                fontSize: 13,
                background: "#fff",
                color: C.ink,
                boxSizing: "border-box",
              }}
            />

            <label style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: C.inkLight }}>
              Short description
            </label>
            <input
              value={configDraft.description}
              onChange={(e) => setConfigDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="e.g. Robin Wall Kimmerer — reciprocity, plant intelligence"
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                marginBottom: 14,
                padding: "7px 10px",
                borderRadius: 6,
                border: `1px solid ${C.woodBorder}`,
                fontFamily: "inherit",
                fontSize: 13,
                background: "#fff",
                color: C.ink,
                boxSizing: "border-box",
              }}
            />

            <label style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: C.inkLight }}>
              System prompt (the lens)
            </label>
            <textarea
              value={configDraft.systemPrompt}
              onChange={(e) => setConfigDraft((d) => ({ ...d, systemPrompt: e.target.value }))}
              placeholder="Describe the knowledge framework, thinker, or role this seat should speak from. Be specific about vocabulary, assumptions, and what they notice."
              rows={6}
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                marginBottom: 20,
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${C.woodBorder}`,
                fontFamily: "inherit",
                fontSize: 12,
                background: "#fff",
                color: C.ink,
                resize: "vertical",
                lineHeight: 1.55,
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setConfigSeatId(null)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 7,
                  border: `1px solid ${C.woodBorder}`,
                  background: "transparent",
                  fontFamily: "inherit",
                  fontSize: 13,
                  cursor: "pointer",
                  color: C.inkLight,
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                style={{
                  padding: "8px 20px",
                  borderRadius: 7,
                  border: "none",
                  background: C.evergreen,
                  color: C.cream,
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
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

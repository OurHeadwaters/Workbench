import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "gord";
  content: string;
}

interface Bottle {
  date: string;
  message: string;
}

const OPENING_QUIP =
  "Well, look who wandered in. Gord's on board — what's rattling around in that head of yours?";

const BOTTLES_KEY = "gordUniverseBottles";
const HISTORY_KEY = "gordConversationHistory";
const HISTORY_LIMIT = 20;

function loadHistory(): Message[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]") as Message[];
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(messages.slice(-HISTORY_LIMIT)),
  );
}

const FINGERPRINT_KEY = "gordFingerprint";

function getOrCreateFingerprint(): string {
  const existing = localStorage.getItem(FINGERPRINT_KEY);
  if (existing) return existing;
  const fp = crypto.randomUUID();
  localStorage.setItem(FINGERPRINT_KEY, fp);
  return fp;
}

function loadBottles(): Bottle[] {
  try {
    return JSON.parse(localStorage.getItem(BOTTLES_KEY) ?? "[]") as Bottle[];
  } catch {
    return [];
  }
}

function saveBottle(message: string): string {
  const date = new Date().toLocaleString();
  const bottles = loadBottles();
  bottles.unshift({ date, message });
  localStorage.setItem(BOTTLES_KEY, JSON.stringify(bottles));
  return date;
}

async function syncBottlesFromServer(): Promise<void> {
  try {
    const fp = getOrCreateFingerprint();
    const res = await fetch(`/api/gord/bottles?fp=${encodeURIComponent(fp)}`);
    if (!res.ok) return;
    const data = (await res.json()) as { bottles?: Bottle[] };
    const serverBottles = data.bottles ?? [];
    if (serverBottles.length === 0) return;
    const local = loadBottles();
    const localMessages = new Set(local.map((b) => b.message));
    const merged = [
      ...local,
      ...serverBottles.filter((b) => !localMessages.has(b.message)),
    ];
    merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    localStorage.setItem(BOTTLES_KEY, JSON.stringify(merged));
  } catch {
    // silent — server sync is best-effort
  }
}

async function pushBottleToServer(message: string, date: string): Promise<void> {
  try {
    const fp = getOrCreateFingerprint();
    await fetch("/api/gord/bottles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fp, message, date }),
    });
  } catch {
    // silent — server sync is best-effort
  }
}

export function GordWidget() {
  const [open, setOpen] = useState(false);
  const [showBottles, setShowBottles] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadHistory();
    return saved.length > 0 ? saved : [{ role: "gord", content: OPENING_QUIP }];
  });
  const [input, setInput] = useState("");
  const [isBottle, setIsBottle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  function handleOpen() {
    setOpen((v) => !v);
    setShowBottles(false);
    void syncBottlesFromServer();
  }

  function handleClearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    setMessages([{ role: "gord", content: OPENING_QUIP }]);
  }

  async function handleViewBottles() {
    await syncBottlesFromServer();
    setBottles(loadBottles());
    setShowBottles((v) => !v);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");

    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    if (isBottle) {
      const date = saveBottle(text);
      void pushBottleToServer(text, date);
      setIsBottle(false);
      setMessages([
        ...nextMessages,
        {
          role: "gord",
          content:
            "🌊 Message cast into the current. Gord will carry it to the Universe Map.",
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const history = nextMessages
        .slice(0, -1)
        .map((m) => ({
          role: m.role === "gord" ? "assistant" : "user",
          content: m.content,
        }));

      const res = await fetch("/api/gord/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      const reply = data.reply ?? data.error ?? "Gord lost his train of thought.";
      setMessages([...nextMessages, { role: "gord", content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "gord", content: "Gord's radio went dark. Check your connection." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 0,
            width: 320,
            background: "rgba(0,0,0,0.96)",
            border: "1px solid #92400e",
            borderRadius: 24,
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #78350f, #064e3b)",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <img src="/gord.svg" alt="Gord" style={{ width: 28, height: 28, verticalAlign: "middle", display: "inline-block" }} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#fef3c7", fontSize: 15 }}>
                Gord
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#fcd34d" }}>
                "Gord's on board"
              </p>
            </div>
          </div>

          {showBottles ? (
            <div style={{ flex: 1, overflowY: "auto", maxHeight: 256, padding: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ color: "#fcd34d", fontWeight: 600, fontSize: 13 }}>
                  🌊 Messages in Bottles
                </span>
                <button
                  onClick={() => setShowBottles(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  ← Back
                </button>
              </div>
              {bottles.length === 0 ? (
                <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                  No bottles yet. Check "Cast as Message in a Bottle" before sending.
                </p>
              ) : (
                bottles.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#1c1917",
                      border: "1px solid #44403c",
                      borderRadius: 12,
                      padding: "8px 12px",
                      marginBottom: 8,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 11, color: "#78716c" }}>{b.date}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#d6d3d1" }}>
                      {b.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div
              style={{
                height: 256,
                overflowY: "auto",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={
                    m.role === "user"
                      ? { textAlign: "right" }
                      : {
                          background: "#451a03",
                          border: "1px solid #92400e",
                          borderRadius: 14,
                          padding: "8px 12px",
                        }
                  }
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: m.role === "user" ? "#7dd3fc" : "#fef3c7",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    background: "#451a03",
                    border: "1px solid #92400e",
                    borderRadius: 14,
                    padding: "8px 12px",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#fcd34d" }}>Gord's thinking…</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid #44403c",
              background: "#0c0a09",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={isBottle}
                onChange={(e) => setIsBottle(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#f59e0b" }}
              />
              <span style={{ fontSize: 12, color: "#fcd34d" }}>
                🌊 Cast as Message in a Bottle
              </span>
            </label>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Talk to Gord..."
              style={{
                width: "100%",
                background: "#1c1917",
                border: "1px solid #78350f",
                borderRadius: 20,
                padding: "8px 16px",
                fontSize: 13,
                color: "#e7e5e4",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 16px",
              background: "rgba(0,0,0,0.8)",
              borderTop: "1px solid #44403c",
            }}
          >
            <button
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { role: "gord", content: "A tip? Respect. Keeps this old bird flying." },
                ]);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#fbbf24",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ⚡ Tip Gord
            </button>
            <button
              onClick={() => void handleViewBottles()}
              style={{
                background: "none",
                border: "none",
                color: "#34d399",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              📜 View Bottles
            </button>
            <button
              onClick={handleClearHistory}
              style={{
                background: "none",
                border: "none",
                color: "#f87171",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              🔄 Start fresh
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleOpen}
        title="Chat with Gord"
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: "linear-gradient(135deg, #92400e, #065f46)",
          border: "3px solid #78350f",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          const bird = e.currentTarget.querySelector(".gord-bird") as HTMLElement | null;
          if (bird) bird.style.transform = "rotate(12deg)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          const bird = e.currentTarget.querySelector(".gord-bird") as HTMLElement | null;
          if (bird) bird.style.transform = "rotate(0deg)";
        }}
      >
        <span style={{ fontSize: 28 }}>🌿</span>
        <img
          className="gord-bird"
          src="/gord.svg"
          alt="Gord"
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 36,
            height: 36,
            transition: "transform 0.3s",
            display: "block",
          }}
        />
      </button>
    </div>
  );
}

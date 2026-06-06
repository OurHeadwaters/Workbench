import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "gord";
  content: string;
}

interface Bottle {
  date: string;
  message: string;
}

interface KitDraft {
  title: string;
  description?: string;
  intendedAudience?: string;
  priceCents?: number;
  contentOutline?: Record<string, unknown>;
}

interface CodetryFlag {
  category: string;
  flag: string;
  reason: string;
}

interface CodetryResult {
  passed: boolean;
  flags: CodetryFlag[];
  summary: string;
}

interface KitBuilderResult {
  kitId: string;
  codetryResult: CodetryResult;
  draftSaved: boolean;
}

type Mode = "chat" | "kitBuilder";

const OPENING_QUIP =
  "Well, look who wandered in. Gord's on board — what's rattling around in that head of yours?";

const KIT_BUILDER_OPENING =
  "Kit builder mode. Let's get this idea out of your head and into the world. What's the kit about — give me the one-sentence version.";

const BOTTLES_KEY = "gordUniverseBottles";
const HISTORY_KEY = "gordConversationHistory";
const KIT_HISTORY_KEY = "gordKitBuilderHistory";
const HISTORY_LIMIT = 20;

function loadHistory(key: string): Message[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as Message[];
  } catch {
    return [];
  }
}

function saveHistory(key: string, messages: Message[]) {
  localStorage.setItem(key, JSON.stringify(messages.slice(-HISTORY_LIMIT)));
}

const FINGERPRINT_KEY = "gordFingerprint";

/**
 * Reads the Headwaters library owner token from localStorage.
 * North Star stores it under "library.ownerToken" (set by SettingsPage);
 * some artifacts use the bare "ownerToken" key.
 * Returns headers for owner-gated kit builder API calls.
 */
function getKitOwnerHeaders(): Record<string, string> {
  const token =
    localStorage.getItem("library.ownerToken") ||
    localStorage.getItem("ownerToken") ||
    "";
  if (!token) return {};
  return { "x-library-owner-token": token };
}

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

interface GordWidgetProps {
  founderMode?: boolean;
}

export function GordWidget({ founderMode = false }: GordWidgetProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [showBottles, setShowBottles] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadHistory(HISTORY_KEY);
    return saved.length > 0 ? saved : [{ role: "gord", content: OPENING_QUIP }];
  });
  const [kitMessages, setKitMessages] = useState<Message[]>(() => {
    const saved = loadHistory(KIT_HISTORY_KEY);
    return saved.length > 0 ? saved : [{ role: "gord", content: KIT_BUILDER_OPENING }];
  });
  const [input, setInput] = useState("");
  const [isBottle, setIsBottle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [kitResult, setKitResult] = useState<KitBuilderResult | null>(null);
  const [showCodetry, setShowCodetry] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishResult, setPublishResult] = useState<{ ok: boolean; message: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = mode === "kitBuilder" ? kitMessages : messages;

  useEffect(() => {
    saveHistory(HISTORY_KEY, messages);
  }, [messages]);

  useEffect(() => {
    saveHistory(KIT_HISTORY_KEY, kitMessages);
  }, [kitMessages]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages, open]);

  function handleOpen() {
    setOpen((v) => !v);
    setShowBottles(false);
    void syncBottlesFromServer();
  }

  function handleClearHistory() {
    if (mode === "kitBuilder") {
      localStorage.removeItem(KIT_HISTORY_KEY);
      setKitMessages([{ role: "gord", content: KIT_BUILDER_OPENING }]);
      setKitResult(null);
      setShowCodetry(false);
      setPublishResult(null);
    } else {
      localStorage.removeItem(HISTORY_KEY);
      setMessages([{ role: "gord", content: OPENING_QUIP }]);
    }
  }

  function enterKitBuilder() {
    setMode("kitBuilder");
    setShowBottles(false);
    setKitResult(null);
    setShowCodetry(false);
    setPublishResult(null);
  }

  function exitKitBuilder() {
    setMode("chat");
    setShowBottles(false);
  }

  async function handleViewBottles() {
    await syncBottlesFromServer();
    setBottles(loadBottles());
    setShowBottles((v) => !v);
  }

  async function handlePublish() {
    if (!kitResult?.kitId) return;
    setPublishLoading(true);
    try {
      const res = await fetch(`/api/kits/${kitResult.kitId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getKitOwnerHeaders() },
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; kit?: { stripeCheckoutUrl?: string } };
      if (data.ok) {
        const url = data.kit?.stripeCheckoutUrl;
        setPublishResult({
          ok: true,
          message: url
            ? `Published! Stripe checkout: ${url}`
            : "Published! Kit is now live.",
        });
      } else {
        setPublishResult({ ok: false, message: data.error ?? "Publish failed." });
      }
    } catch {
      setPublishResult({ ok: false, message: "Network error during publish." });
    } finally {
      setPublishLoading(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");

    if (mode === "kitBuilder") {
      const userMsg: Message = { role: "user", content: text };
      const nextMessages = [...kitMessages, userMsg];
      setKitMessages(nextMessages);
      setLoading(true);

      try {
        const history = nextMessages.slice(0, -1).map((m) => ({
          role: m.role === "gord" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        }));

        const pageContext = typeof window !== "undefined" ? window.location.href : undefined;

        const res = await fetch("/api/kits/gord/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getKitOwnerHeaders() },
          body: JSON.stringify({ message: text, history, pageContext }),
        });

        const data = (await res.json()) as { reply?: string; error?: string };
        const reply = data.reply ?? data.error ?? "Gord lost his train of thought.";

        const allMessages = [...nextMessages, { role: "gord" as const, content: reply }];
        setKitMessages(allMessages);

        const jsonMatch = reply.match(/```json\n?([\s\S]*?)```/);
        if (jsonMatch?.[1]) {
          try {
            const draft = JSON.parse(jsonMatch[1]) as KitDraft;
            if (draft.title) {
              const allHistory = allMessages.map((m) => ({
                role: m.role === "gord" ? ("assistant" as const) : ("user" as const),
                content: m.content,
              }));

              const saveRes = await fetch("/api/kits/gord-draft", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...getKitOwnerHeaders() },
                body: JSON.stringify({ messages: allHistory, pageContext }),
              });

              const saveData = (await saveRes.json()) as {
                kitId?: string;
                codetryResult?: CodetryResult;
                draftSaved?: boolean;
              };

              if (saveData.draftSaved && saveData.kitId && saveData.codetryResult) {
                setKitResult({
                  kitId: saveData.kitId,
                  codetryResult: saveData.codetryResult,
                  draftSaved: true,
                });
                setShowCodetry(true);
              }
            }
          } catch {
            // not a valid draft JSON yet — keep going
          }
        }
      } catch {
        setKitMessages([
          ...nextMessages,
          { role: "gord", content: "Gord's radio went dark. Check your connection." },
        ]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal chat mode
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

  const isKitMode = mode === "kitBuilder";
  const headerBg = isKitMode
    ? "linear-gradient(to right, #1e3a5f, #064e3b)"
    : "linear-gradient(to right, #78350f, #064e3b)";

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 0,
            width: 340,
            background: "rgba(0,0,0,0.96)",
            border: isKitMode ? "1px solid #1e40af" : "1px solid #92400e",
            borderRadius: 24,
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: headerBg,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <img
              src="/gord.svg"
              alt="Gord"
              style={{ width: 28, height: 28, verticalAlign: "middle", display: "inline-block" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, color: "#fef3c7", fontSize: 15 }}>
                {isKitMode ? "Gord — Kit Builder" : "Gord"}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#fcd34d" }}>
                {isKitMode ? "Brain dump → published kit" : '"Gord\'s on board"'}
              </p>
            </div>
            {isKitMode && (
              <button
                onClick={exitKitBuilder}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontSize: 11,
                  padding: "2px 6px",
                }}
              >
                ← Chat
              </button>
            )}
          </div>

          {/* Codetry filter result panel */}
          {isKitMode && showCodetry && kitResult && (
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #1e40af",
                borderRadius: 0,
                padding: "12px 16px",
                borderTop: "none",
                borderBottom: "1px solid #1e3a5f",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ color: "#93c5fd", fontWeight: 600, fontSize: 13 }}>
                  🔍 Codetry Filter
                </span>
                <button
                  onClick={() => setShowCodetry(false)}
                  style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 11 }}
                >
                  hide
                </button>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: kitResult.codetryResult.passed ? "#4ade80" : "#fbbf24" }}>
                {kitResult.codetryResult.passed ? "✓ Passed" : "⚠ Flags to note"} — {kitResult.codetryResult.summary}
              </p>
              {kitResult.codetryResult.flags.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  {kitResult.codetryResult.flags.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#1e1b4b",
                        borderRadius: 8,
                        padding: "6px 10px",
                        marginBottom: 4,
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: "#fbbf24", fontWeight: 600 }}>{f.flag}</span>
                      <p style={{ margin: "2px 0 0", color: "#c4b5fd", fontSize: 11 }}>{f.reason}</p>
                    </div>
                  ))}
                </div>
              )}
              {publishResult ? (
                <p style={{ margin: 0, fontSize: 12, color: publishResult.ok ? "#4ade80" : "#f87171" }}>
                  {publishResult.ok ? "✓ " : "✗ "}{publishResult.message}
                </p>
              ) : (
                <button
                  onClick={() => void handlePublish()}
                  disabled={publishLoading}
                  style={{
                    width: "100%",
                    background: publishLoading ? "#374151" : "#1d4ed8",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 0",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: publishLoading ? "wait" : "pointer",
                  }}
                >
                  {publishLoading ? "Publishing…" : kitResult.codetryResult.flags.length > 0 ? "Publish anyway →" : "Publish kit →"}
                </button>
              )}
            </div>
          )}

          {/* Message area */}
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
              {activeMessages.map((m, i) => (
                <div
                  key={i}
                  style={
                    m.role === "user"
                      ? { textAlign: "right" }
                      : {
                          background: isKitMode ? "#1e3a5f" : "#451a03",
                          border: isKitMode ? "1px solid #1e40af" : "1px solid #92400e",
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
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    background: isKitMode ? "#1e3a5f" : "#451a03",
                    border: isKitMode ? "1px solid #1e40af" : "1px solid #92400e",
                    borderRadius: 14,
                    padding: "8px 12px",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#fcd34d" }}>
                    {isKitMode ? "Gord's building the draft…" : "Gord's thinking…"}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input area */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid #44403c",
              background: "#0c0a09",
            }}
          >
            {!isKitMode && (
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
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isKitMode ? "Describe your kit idea…" : "Talk to Gord..."}
              style={{
                width: "100%",
                background: "#1c1917",
                border: isKitMode ? "1px solid #1e40af" : "1px solid #78350f",
                borderRadius: 20,
                padding: "8px 16px",
                fontSize: 13,
                color: "#e7e5e4",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Footer actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              padding: "8px 16px",
              background: "rgba(0,0,0,0.8)",
              borderTop: "1px solid #44403c",
              gap: 4,
            }}
          >
            {!isKitMode && (
              <>
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
                {founderMode && (
                  <button
                    onClick={enterKitBuilder}
                    style={{
                      background: "none",
                      border: "1px solid #1e40af",
                      borderRadius: 8,
                      color: "#93c5fd",
                      cursor: "pointer",
                      fontSize: 12,
                      padding: "2px 8px",
                    }}
                  >
                    ＋ Add a Kit
                  </button>
                )}
              </>
            )}
            {isKitMode && (
              <>
                {kitResult && (
                  <button
                    onClick={() => setShowCodetry((v) => !v)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#93c5fd",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    🔍 Codetry
                  </button>
                )}
              </>
            )}
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
        title={founderMode ? "Chat with Gord / Build a Kit" : "Chat with Gord"}
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
        {founderMode && (
          <span
            style={{
              position: "absolute",
              top: -6,
              left: -6,
              background: "#1d4ed8",
              borderRadius: "50%",
              width: 18,
              height: 18,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ＋
          </span>
        )}
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

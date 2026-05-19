/**
 * EveningDump.tsx — full-screen evening brain dump
 *
 * Phone-friendly, no structure, no limits. Just a big open textarea.
 * Autosaves to localStorage keyed by today's date: `evening-dump-YYYY-MM-DD`
 * A "Done — close my brain" button saves and returns to lobby.
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { toLocalISODate } from "@/data/plan2026";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function eveningDumpKey(isoDate: string): string {
  return `evening-dump-${isoDate}`;
}

export function loadEveningDump(isoDate: string): string {
  try { return localStorage.getItem(eveningDumpKey(isoDate)) ?? ""; } catch { return ""; }
}

function saveEveningDump(isoDate: string, text: string): void {
  try { localStorage.setItem(eveningDumpKey(isoDate), text); } catch { /* noop */ }
}

/** Returns the most recent evening dump {isoDate, text} or null. */
export function getMostRecentEveningDump(): { isoDate: string; text: string } | null {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("evening-dump-")) keys.push(k);
    }
    if (keys.length === 0) return null;
    keys.sort().reverse();
    const mostRecent = keys[0];
    const isoDate = mostRecent.replace("evening-dump-", "");
    const text = localStorage.getItem(mostRecent) ?? "";
    if (!text.trim()) return null;
    return { isoDate, text };
  } catch { return null; }
}

const T = {
  bg:     "#1f3d2e",
  paper:  "#f4ede0",
  text:   "#2a2520",
  muted:  "#7a7a6e",
  rule:   "rgba(200,191,167,0.35)",
  accent: "#b85a3e",
};

export default function EveningDump() {
  const [, navigate] = useLocation();
  const today = toLocalISODate(new Date());
  const [text, setText] = useState(() => loadEveningDump(today));
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const todayLabel = new Date().toLocaleDateString("en-CA", {
    weekday: "long", month: "long", day: "numeric",
  });

  function handleChange(val: string) {
    setText(val);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveEveningDump(today, val);
      setSaved(true);
    }, 600);
  }

  function handleDone() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveEveningDump(today, text);
    navigate(`${BASE}/`);
  }

  useEffect(() => {
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: T.bg,
        display: "flex",
        flexDirection: "column",
        padding: "env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-left, 0)",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px 12px",
          flexShrink: 0,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.4)",
              margin: "0 0 3px",
            }}
          >
            Evening Dump — {todayLabel}
          </p>
          <p style={{ fontSize: 12, color: "rgba(244,237,224,0.55)", margin: 0, lineHeight: 1.4 }}>
            Say everything. Nothing is too small.
          </p>
        </div>
        {saved && text.trim() !== "" && (
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.35)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Saved
          </span>
        )}
      </div>

      {/* Textarea — takes all remaining space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 16px" }}>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={
            "What's on your mind from today?\n\nWhat moved? What didn't? What's still sitting in the back of your head?\n\nWrite it all down. You can talk about Deer Lake, 807, Tyler, the farmers market, the board, the money, the kids — anything. This is for you."
          }
          style={{
            flex: 1,
            width: "100%",
            minHeight: 260,
            boxSizing: "border-box",
            background: "rgba(244,237,224,0.05)",
            border: "1.5px solid rgba(244,237,224,0.12)",
            borderRadius: 10,
            padding: "18px 16px",
            fontSize: 17,
            fontFamily: "var(--font-body)",
            color: T.paper,
            lineHeight: 1.7,
            resize: "none",
            outline: "none",
            caretColor: T.accent,
          }}
        />
      </div>

      {/* Bottom area — done button */}
      <div
        style={{
          padding: "16px 16px 28px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <button
          onClick={handleDone}
          style={{
            width: "100%",
            padding: "16px 20px",
            background: T.accent,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.01em",
          }}
        >
          Done — close my brain
        </button>
        <button
          onClick={() => navigate(`${BASE}/`)}
          style={{
            width: "100%",
            padding: "12px 20px",
            background: "transparent",
            color: "rgba(244,237,224,0.4)",
            border: "1px solid rgba(244,237,224,0.12)",
            borderRadius: 10,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Back to lobby (keeps what you wrote)
        </button>
      </div>
    </div>
  );
}

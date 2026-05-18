import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  PLAN_2026,
  getTodayWeek,
  getTodayDay,
  PHASE_COLORS,
  formatDateRange,
  toLocalISODate,
  type Week,
  type Day,
  type ActionType,
} from "@/data/plan2026";
import { getOrCreateWeekThree } from "@/lib/threeThings";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const T = {
  bg:     "#1f3d2e",
  paper:  "#f4ede0",
  text:   "#2a2520",
  muted:  "#7a7a6e",
  rule:   "rgba(200,191,167,0.35)",
  accent: "#b85a3e",
  teal:   "#1F5446",
  blue:   "#1A5FA8",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLastWorkingDay(): { week: Week; day: Day; isoDate: string } | null {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun, 1=Mon … 6=Sat
  let daysBack = 1;
  if (dow === 0) daysBack = 2;  // Sun → Fri
  if (dow === 1) daysBack = 3;  // Mon → Fri

  const d = new Date(today);
  d.setDate(today.getDate() - daysBack);
  const isoDate = toLocalISODate(d);

  for (const week of PLAN_2026) {
    for (const day of week.days) {
      if (day.isoDate === isoDate) return { week, day, isoDate };
    }
  }
  return null;
}

function debriefKey(isoDate: string) {
  return `debrief-note-${isoDate}`;
}

function loadNote(isoDate: string): string {
  try { return localStorage.getItem(debriefKey(isoDate)) ?? ""; } catch { return ""; }
}

function saveNote(isoDate: string, text: string) {
  try { localStorage.setItem(debriefKey(isoDate), text); } catch { /* noop */ }
}

function formatDay(isoDate: string) {
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });
}

const ACTION_LABELS: Record<ActionType, string> = {
  "copy-ai-prompt": "AI Prompt",
  "copy-replit-task-brief": "Replit Task",
};

// ─── CopyChip ─────────────────────────────────────────────────────────────────

function CopyChip({ content, type }: { content: string; type: ActionType }) {
  const [copied, setCopied] = useState(false);
  function handle() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handle}
      style={{
        fontSize: 10,
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        padding: "3px 9px",
        borderRadius: 4,
        border: "1.5px solid rgba(184,90,62,0.3)",
        background: copied ? "rgba(31,61,46,0.08)" : "rgba(184,90,62,0.07)",
        color: copied ? T.teal : T.accent,
        cursor: "pointer",
      }}
    >
      {copied ? "Copied" : ACTION_LABELS[type]}
    </button>
  );
}

// ─── YesterdayPanel ───────────────────────────────────────────────────────────

function YesterdayPanel({ week, day, isoDate }: { week: Week; day: Day; isoDate: string }) {
  const phaseColors = PHASE_COLORS[week.phase];

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.rule}` }}>
      <div style={{ padding: "10px 16px", backgroundColor: phaseColors.bg, display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: phaseColors.text }}>
          {week.phase}
        </span>
        <span style={{ fontSize: 11, color: phaseColors.text, opacity: 0.75 }}>
          Week {week.isoWeek} · {week.theme}
        </span>
      </div>
      <div style={{ backgroundColor: T.paper }}>
        <div style={{ padding: "10px 16px 4px", borderBottom: `1px solid ${T.rule}` }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: T.muted }}>
            {formatDay(isoDate)} · {day.steps.length} task{day.steps.length !== 1 ? "s" : ""} scheduled
          </p>
        </div>
        {day.steps.length === 0 ? (
          <div style={{ padding: "16px 16px", fontSize: 12, color: T.muted, fontStyle: "italic" }}>
            No tasks were scheduled for this day.
          </div>
        ) : (
          day.steps.map((step, i) => (
            <div
              key={i}
              style={{
                padding: "13px 16px",
                borderBottom: i < day.steps.length - 1 ? `1px solid ${T.rule}` : "none",
                display: "flex",
                gap: 12,
              }}
            >
              <div style={{ width: 3, flexShrink: 0, borderRadius: 2, backgroundColor: T.teal, alignSelf: "stretch", minHeight: 16 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.45 }}>
                  {step.title}
                </p>
                {step.detail && (
                  <p style={{ margin: "0 0 6px", fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                    {step.detail}
                  </p>
                )}
                {step.actions && step.actions.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                    {step.actions.map((a, j) => (
                      <CopyChip key={j} content={a.content} type={a.type} />
                    ))}
                  </div>
                )}
                {step.link && (
                  <a
                    href={step.link.path}
                    style={{ fontSize: 11, fontWeight: 700, color: T.accent, textDecoration: "none" }}
                  >
                    {step.link.label} →
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── NotesPanel ───────────────────────────────────────────────────────────────

function NotesPanel({ isoDate }: { isoDate: string }) {
  const [text, setText] = useState(() => loadNote(isoDate));
  const saveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(val: string) {
    setText(val);
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => saveNote(isoDate, val), 500);
  }

  const saved = text.trim() !== "" && text === loadNote(isoDate);

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.rule}` }}>
      <div style={{ padding: "10px 16px", backgroundColor: T.accent, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#fff" }}>
          Debrief Note — {formatDay(isoDate)}
        </span>
        {saved && (
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            Saved
          </span>
        )}
      </div>
      <div style={{ backgroundColor: T.paper, padding: "14px 16px" }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: T.muted, lineHeight: 1.55 }}>
          What actually happened? What shifted? What do you need to carry into today? Write freely — this is for you.
        </p>
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={"Yesterday's wins...\nWhat got dropped or deferred...\nWhat I need to carry into today...\nAnything that felt off..."}
          rows={7}
          style={{
            width: "100%",
            background: "rgba(31,61,46,0.03)",
            border: `1.5px solid ${T.rule}`,
            borderRadius: 6,
            padding: "12px 14px",
            fontSize: 13,
            fontFamily: "var(--font-body)",
            color: T.text,
            lineHeight: 1.65,
            resize: "vertical" as const,
            outline: "none",
            boxSizing: "border-box" as const,
          }}
        />
        {text.trim() === "" && (
          <p style={{ margin: "6px 0 0", fontSize: 11, color: T.muted, fontStyle: "italic" }}>
            Notes save automatically as you type. Each day's note is kept separately.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── ThisWeekThree ────────────────────────────────────────────────────────────

function ThisWeekThree() {
  const weekKey = (() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(d.setDate(diff));
    return `week-${toLocalISODate(mon)}`;
  })();

  const entry = getOrCreateWeekThree(weekKey);
  const items = entry.items.filter((it) => it.text.trim() !== "");
  const done = items.filter((it) => it.done).length;

  if (items.length === 0) {
    return (
      <div style={{ borderRadius: 10, border: `1px solid ${T.rule}`, overflow: "hidden" }}>
        <div style={{ padding: "10px 16px", backgroundColor: T.teal }}>
          <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#fff" }}>
            This Week's 3
          </span>
        </div>
        <div style={{ backgroundColor: T.paper, padding: "14px 16px" }}>
          <p style={{ margin: 0, fontSize: 12, color: T.muted, fontStyle: "italic" }}>
            No priorities set yet this week. <a href={`${BASE}/plan/today`} style={{ color: T.accent, fontWeight: 700, textDecoration: "none" }}>Set them now →</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 10, border: `1px solid ${T.rule}`, overflow: "hidden" }}>
      <div style={{ padding: "10px 16px", backgroundColor: T.teal, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#fff" }}>
          This Week's 3
        </span>
        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: done === items.length ? "#a8f0c0" : "rgba(255,255,255,0.6)" }}>
          {done}/{items.length} done
        </span>
      </div>
      <div style={{ backgroundColor: T.paper }}>
        {items.map((it, i) => (
          <div
            key={it.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 16px",
              borderBottom: i < items.length - 1 ? `1px solid ${T.rule}` : "none",
            }}
          >
            <div style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              border: `1.5px solid ${it.done ? T.teal : "rgba(31,61,46,0.28)"}`,
              background: it.done ? T.teal : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {it.done && (
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5 3.5-4" stroke="#f4ede0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: it.done ? T.muted : T.text, textDecoration: it.done ? "line-through" : "none" }}>
              {it.text}
            </span>
          </div>
        ))}
        <div style={{ padding: "8px 16px", borderTop: `1px solid ${T.rule}` }}>
          <a href={`${BASE}/plan/today`} style={{ fontSize: 11, fontWeight: 700, color: T.accent, textDecoration: "none" }}>
            Update priorities →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── ForwardPanel ─────────────────────────────────────────────────────────────

function ForwardPanel() {
  const todayResult = getTodayDay();
  const todayWeek   = getTodayWeek();
  const [, navigate] = useLocation();

  const todayLabel = new Date().toLocaleDateString("en-CA", {
    weekday: "long", month: "long", day: "numeric",
  });

  const taskCount = todayResult?.day.steps.length ?? 0;

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.rule}` }}>
      <div style={{ padding: "10px 16px", backgroundColor: T.bg }}>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#f4ede0" }}>
          Now — {todayLabel}
        </span>
      </div>
      <div style={{ backgroundColor: T.paper, padding: "14px 16px", display: "flex", flexDirection: "column" as const, gap: 10 }}>
        {todayWeek && (
          <p style={{ margin: 0, fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
            <strong style={{ color: T.text }}>Week {todayWeek.isoWeek} — {todayWeek.theme}</strong>
            {" · "}{formatDateRange(todayWeek)}
          </p>
        )}
        <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.55 }}>
          {taskCount > 0
            ? `${taskCount} task${taskCount !== 1 ? "s" : ""} scheduled for today.`
            : "No tasks scheduled for today in the plan."}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
          <button
            onClick={() => navigate(`${BASE}/plan/today`)}
            style={{
              padding: "8px 16px",
              background: T.teal,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Open Today's Tasks →
          </button>
          <button
            onClick={() => navigate(`${BASE}/plan`)}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: T.muted,
              border: `1.5px solid ${T.rule}`,
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Year Overview
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DailyDebrief() {
  const yesterday = getLastWorkingDay();

  const todayLabel = new Date().toLocaleDateString("en-CA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 64px" }}>

      <div style={{ marginBottom: 20 }}>
        <a
          href={BASE + "/"}
          style={{ fontSize: 11, fontWeight: 700, color: T.muted, textDecoration: "none", letterSpacing: "0.08em" }}
        >
          ← Back to Operating Plan
        </a>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 8px" }}>
          Morning Debrief
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: 30,
          fontWeight: 600,
          lineHeight: 1.2,
          color: T.paper,
          margin: "0 0 10px",
        }}>
          {todayLabel}
        </h1>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
          Start here every morning. Review what was on the plan yesterday, write your debrief note, check your week priorities, then move into today.
        </p>
      </div>

      {/* Yesterday's plan */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 10px" }}>
          What Was on the Plan Yesterday
        </p>
        {yesterday ? (
          <YesterdayPanel week={yesterday.week} day={yesterday.day} isoDate={yesterday.isoDate} />
        ) : (
          <div style={{
            padding: "16px 18px", borderRadius: 10, border: `1px solid ${T.rule}`,
            backgroundColor: "rgba(255,255,255,0.03)",
          }}>
            <p style={{ margin: 0, fontSize: 13, color: T.muted, fontStyle: "italic" }}>
              Yesterday's date isn't in the 2026 plan — nothing to show. The debrief note below still works.
            </p>
          </div>
        )}
      </div>

      {/* Debrief note */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 10px" }}>
          Your Note
        </p>
        <NotesPanel isoDate={yesterday?.isoDate ?? toLocalISODate(new Date())} />
      </div>

      {/* This Week's 3 */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 10px" }}>
          Week Priorities
        </p>
        <ThisWeekThree />
      </div>

      {/* Forward */}
      <div style={{ marginBottom: 0 }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 10px" }}>
          Into Today
        </p>
        <ForwardPanel />
      </div>

    </div>
  );
}

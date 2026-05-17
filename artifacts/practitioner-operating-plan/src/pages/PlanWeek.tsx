import { useLocation, useRoute } from "wouter";
import { useState } from "react";
import {
  PLAN_2026,
  PHASE_COLORS,
  formatDateRange,
  getTodayWeek,
  toLocalISODate,
  type Week,
  type Day,
  type Step,
  type ActionType,
} from "@/data/plan2026";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const ACTION_LABELS: Record<ActionType, string> = {
  "copy-ai-prompt": "Copy AI Prompt",
  "copy-replit-task-brief": "Copy Replit Task",
};

const ACTION_COLORS: Record<ActionType, { bg: string; text: string; border: string }> = {
  "copy-ai-prompt": { bg: "rgba(184,90,62,0.08)", text: "#b85a3e", border: "rgba(184,90,62,0.25)" },
  "copy-replit-task-brief": { bg: "rgba(31,61,46,0.08)", text: "#1f3d2e", border: "rgba(31,61,46,0.22)" },
};

function CopyButton({ content, label, type }: { content: string; label: string; type: ActionType }) {
  const [copied, setCopied] = useState(false);
  const colors = ACTION_COLORS[type];

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  return (
    <button
      onClick={handleCopy}
      title={ACTION_LABELS[type]}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: copied ? "rgba(31,61,46,0.12)" : colors.bg,
        color: copied ? "#1f3d2e" : colors.text,
        border: `1px solid ${copied ? "rgba(31,61,46,0.3)" : colors.border}`,
        borderRadius: 4,
        padding: "3px 8px",
        fontSize: 10,
        fontFamily: "IBM Plex Mono, monospace",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {copied ? (
        <>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <rect x="4" y="1" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1 4v7a1 1 0 001 1h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

function StepCard({ step, isToday }: { step: Step; isToday: boolean }) {
  return (
    <div
      style={{
        background: isToday ? "rgba(184,90,62,0.04)" : "#fff",
        border: `1px solid ${isToday ? "rgba(184,90,62,0.18)" : "rgba(31,61,46,0.09)"}`,
        borderRadius: 7,
        padding: "10px 12px",
        marginBottom: 6,
      }}
    >
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#2a2520", lineHeight: 1.4, marginBottom: step.detail || step.actions?.length ? 5 : 0 }}>
        {step.title}
      </div>
      {step.detail && (
        <div style={{ fontSize: 11.5, color: "#5a5a50", lineHeight: 1.5, marginBottom: step.link || step.actions?.length ? 7 : 0 }}>
          {step.detail}
        </div>
      )}
      {step.link && (
        <div style={{ marginBottom: step.actions?.length ? 7 : 0 }}>
          <a
            href={`${BASE}${step.link.path}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              fontFamily: "IBM Plex Mono, monospace",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#b85a3e",
              textDecoration: "none",
              background: "rgba(184,90,62,0.07)",
              border: "1px solid rgba(184,90,62,0.22)",
              borderRadius: 4,
              padding: "3px 8px",
            }}
          >
            ↗ {step.link.label}
          </a>
        </div>
      )}
      {step.actions && step.actions.length > 0 && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
          {step.actions.map((action, i) => (
            <CopyButton key={i} content={action.content} label={action.label} type={action.type} />
          ))}
        </div>
      )}
    </div>
  );
}

function DayColumn({ day, label, isToday }: { day: Day; label: string; isToday: boolean }) {
  const date = new Date(day.isoDate + "T12:00:00");
  const dateStr = date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: isToday ? "rgba(31,61,46,0.035)" : "transparent",
        border: isToday ? "1.5px solid rgba(184,90,62,0.25)" : "1.5px solid transparent",
        borderRadius: 10,
        padding: "12px 10px",
      }}
    >
      {/* Day header */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isToday ? "#b85a3e" : "#7a7a6e",
            }}
          >
            {label}
          </span>
          {isToday && (
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 8,
                fontWeight: 700,
                background: "#b85a3e",
                color: "#fff",
                padding: "1px 5px",
                borderRadius: 3,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Today
            </span>
          )}
        </div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "#9a9a8e", letterSpacing: "0.05em" }}>
          {dateStr}
        </div>
      </div>

      {/* Steps */}
      {day.steps.map((step, i) => (
        <StepCard key={i} step={step} isToday={isToday} />
      ))}
    </div>
  );
}

export default function PlanWeek() {
  const [, navigate] = useLocation();
  const [, params] = useRoute(`${BASE}/plan/week/:n`);
  const weekNum = params?.n ? parseInt(params.n, 10) : null;

  const week: Week | undefined = weekNum != null
    ? PLAN_2026.find((w) => w.isoWeek === weekNum)
    : undefined;

  const todayWeek = getTodayWeek();
  const today = toLocalISODate(new Date());

  if (!week) {
    return (
      <div style={{ minHeight: "100vh", background: "#f4ede0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#7a7a6e", marginBottom: 12 }}>Week not found.</div>
          <button onClick={() => navigate(`${BASE}/plan`)} style={{ background: "#1f3d2e", color: "#f4ede0", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 12 }}>
            Back to Year View
          </button>
        </div>
      </div>
    );
  }

  const colors = PHASE_COLORS[week.phase];
  const prevWeek = PLAN_2026.find((w) => w.isoWeek === week.isoWeek - 1);
  const nextWeek = PLAN_2026.find((w) => w.isoWeek === week.isoWeek + 1);
  const isCurrentWeek = todayWeek?.isoWeek === week.isoWeek;

  return (
    <div style={{ minHeight: "100vh", background: "#f4ede0", fontFamily: "IBM Plex Sans, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1f3d2e", padding: "18px 24px 14px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <button
              onClick={() => navigate(`${BASE}/plan`)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "rgba(244,237,224,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0 }}
            >
              ← Year
            </button>
            <span style={{ color: "rgba(244,237,224,0.25)", fontSize: 10 }}>/</span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "rgba(244,237,224,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Week {week.isoWeek}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              {/* Phase badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(244,237,224,0.08)", border: `1px solid ${colors.bg}`, borderRadius: 4, padding: "2px 8px", marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors.dot === "#1f3d2e" ? "#a3c4a8" : colors.dot }} />
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700, color: "rgba(244,237,224,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {week.phase}
                </span>
              </div>

              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 20, fontWeight: 700, color: "#f4ede0", lineHeight: 1.2, marginBottom: 3 }}>
                {week.theme}
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "rgba(244,237,224,0.5)", letterSpacing: "0.06em" }}>
                W{week.isoWeek} · {formatDateRange(week)}
                {isCurrentWeek && (
                  <span style={{ marginLeft: 8, background: "#b85a3e", color: "#fff", padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Current Week
                  </span>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => navigate(`${BASE}/plan/today`)}
                style={{ background: "#b85a3e", color: "#f4ede0", border: "none", borderRadius: 6, padding: "7px 14px", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Today
              </button>
              {prevWeek && (
                <button
                  onClick={() => navigate(`${BASE}/plan/week/${prevWeek.isoWeek}`)}
                  style={{ background: "rgba(244,237,224,0.1)", color: "rgba(244,237,224,0.8)", border: "1px solid rgba(244,237,224,0.2)", borderRadius: 6, padding: "7px 12px", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, cursor: "pointer" }}
                >
                  ← W{prevWeek.isoWeek}
                </button>
              )}
              {nextWeek && (
                <button
                  onClick={() => navigate(`${BASE}/plan/week/${nextWeek.isoWeek}`)}
                  style={{ background: "rgba(244,237,224,0.1)", color: "rgba(244,237,224,0.8)", border: "1px solid rgba(244,237,224,0.2)", borderRadius: 6, padding: "7px 12px", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, cursor: "pointer" }}
                >
                  W{nextWeek.isoWeek} →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Week grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px 48px" }}>
        {/* Horizontal scroll on narrow viewports; 5-column flex on wide */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", minWidth: 600 }}>
            {week.days.map((day, i) => {
              const isToday = day.isoDate === today;
              return (
                <DayColumn
                  key={day.isoDate}
                  day={day}
                  label={DAY_LABELS[i] ?? `Day ${i + 1}`}
                  isToday={isToday}
                />
              );
            })}
          </div>
        </div>

        {/* Action key */}
        <div style={{ marginTop: 24, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {(Object.entries(ACTION_COLORS) as [ActionType, typeof ACTION_COLORS[ActionType]][]).map(([type, colors]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: colors.bg, border: `1px solid ${colors.border}` }} />
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "#7a7a6e", letterSpacing: "0.06em" }}>
                {ACTION_LABELS[type]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

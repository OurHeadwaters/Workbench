import { useLocation } from "wouter";
import { useState, useCallback } from "react";
import {
  getTodayDay,
  getTodayWeek,
  PHASE_COLORS,
  formatDateRange,
  type ActionType,
  type Step,
} from "@/data/plan2026";
import NowView from "@/components/NowView";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const ACTION_LABELS: Record<ActionType, string> = {
  "copy-ai-prompt": "Copy AI Prompt",
  "copy-replit-task-brief": "Copy Replit Task",
};

const ACTION_COLORS: Record<ActionType, { bg: string; text: string; border: string }> = {
  "copy-ai-prompt": { bg: "rgba(184,90,62,0.08)", text: "#b85a3e", border: "rgba(184,90,62,0.3)" },
  "copy-replit-task-brief": { bg: "rgba(31,61,46,0.08)", text: "#1f3d2e", border: "rgba(31,61,46,0.25)" },
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
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: copied ? "rgba(31,61,46,0.1)" : colors.bg,
        color: copied ? "#1f3d2e" : colors.text,
        border: `1.5px solid ${copied ? "rgba(31,61,46,0.3)" : colors.border}`,
        borderRadius: 5,
        padding: "5px 12px",
        fontSize: 11,
        fontFamily: "IBM Plex Mono, monospace",
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <rect x="4" y="1" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1 4v7a1 1 0 001 1h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

function BigStepCard({ step, index }: { step: Step; index: number }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid rgba(31,61,46,0.10)",
        borderRadius: 10,
        padding: "18px 20px",
        marginBottom: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Step number */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#1f3d2e",
            color: "#f4ede0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {index + 1}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1f3d2e", lineHeight: 1.4, marginBottom: step.detail || step.actions?.length ? 7 : 0 }}>
            {step.title}
          </div>
          {step.detail && (
            <div style={{ fontSize: 13, color: "#4a4a40", lineHeight: 1.6, marginBottom: step.actions?.length ? 12 : 0 }}>
              {step.detail}
            </div>
          )}
          {step.actions && step.actions.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {step.actions.map((action, i) => (
                <CopyButton key={i} content={action.content} label={action.label} type={action.type} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlanToday() {
  const [, navigate] = useLocation();

  const result = getTodayDay();
  const todayWeek = getTodayWeek();

  const today = new Date();
  const todayFormatted = today.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!result || !todayWeek) {
    return (
      <div style={{ minHeight: "100vh", background: "#f4ede0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "IBM Plex Sans, system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 32 }}>
          <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1f3d2e", marginBottom: 10 }}>
            No plan for today
          </div>
          <div style={{ fontSize: 13, color: "#7a7a6e", lineHeight: 1.6, marginBottom: 20 }}>
            {todayFormatted} is outside the 2026 plan window.
          </div>
          <button
            onClick={() => navigate(`${BASE}/plan`)}
            style={{ background: "#1f3d2e", color: "#f4ede0", border: "none", borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontSize: 13, fontFamily: "IBM Plex Mono, monospace", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            View Full Year
          </button>
        </div>
      </div>
    );
  }

  const { week, day, weekendMode } = result;
  const colors = PHASE_COLORS[week.phase];
  const dayIndex = week.days.findIndex((d) => d.isoDate === day.isoDate);
  const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const dayLabel = DAY_LABELS[dayIndex] ?? "Today";

  const weekendBanner = weekendMode === "saturday"
    ? "Saturday — showing Friday's plan. Rest today."
    : weekendMode === "sunday"
    ? "Sunday — showing Monday's plan. Rest today."
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f4ede0", fontFamily: "IBM Plex Sans, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1f3d2e", padding: "20px 24px 16px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => navigate(`${BASE}/plan`)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "rgba(244,237,224,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0 }}
            >
              Year
            </button>
            <span style={{ color: "rgba(244,237,224,0.25)", fontSize: 10 }}>/</span>
            <button
              onClick={() => navigate(`${BASE}/plan/week/${week.isoWeek}`)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "rgba(244,237,224,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0 }}
            >
              Week {week.isoWeek}
            </button>
            <span style={{ color: "rgba(244,237,224,0.25)", fontSize: 10 }}>/</span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "rgba(244,237,224,0.75)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Today
            </span>
          </div>

          {/* Phase + week info */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(244,237,224,0.08)",
                border: "1px solid rgba(244,237,224,0.12)",
                borderRadius: 4,
                padding: "2px 8px",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors.dot === "#1f3d2e" ? "#a3c4a8" : colors.dot }} />
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700, color: "rgba(244,237,224,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {week.phase}
              </span>
            </div>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "rgba(244,237,224,0.4)", letterSpacing: "0.06em" }}>
              W{week.isoWeek} · {formatDateRange(week)}
            </span>
          </div>

          {/* Date headline */}
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, fontWeight: 700, color: "#b85a3e", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {dayLabel}
            </span>
          </div>
          <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 24, fontWeight: 700, color: "#f4ede0", lineHeight: 1.15, marginBottom: 4 }}>
            {today.toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}
          </div>
          <div style={{ fontSize: 13, color: "rgba(244,237,224,0.55)", lineHeight: 1.45 }}>
            {week.theme}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px 60px" }}>
        {weekendBanner && (
          <div style={{
            background: "rgba(184,90,62,0.07)",
            border: "1px solid rgba(184,90,62,0.2)",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 20,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 11,
            color: "#b85a3e",
            letterSpacing: "0.06em",
          }}>
            {weekendBanner}
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <NowView />
        </div>

        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7a7a6e", marginBottom: 14 }}>
          {weekendMode ? `${dayLabel}'s Steps` : "Today's Steps"} · {day.steps.length} item{day.steps.length !== 1 ? "s" : ""}
        </div>

        {day.steps.map((step, i) => (
          <BigStepCard key={i} step={step} index={i} />
        ))}

        {/* Week context */}
        <div style={{ marginTop: 32, borderTop: "1px solid rgba(31,61,46,0.10)", paddingTop: 20 }}>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7a7a6e", marginBottom: 14 }}>
            This Week
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {week.days.map((d, i) => {
              const isToday = d.isoDate === day.isoDate;
              const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri"];
              const dDate = new Date(d.isoDate + "T12:00:00");
              return (
                <div
                  key={d.isoDate}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "baseline",
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: isToday ? "rgba(184,90,62,0.06)" : "transparent",
                    border: isToday ? "1px solid rgba(184,90,62,0.18)" : "1px solid transparent",
                  }}
                >
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 700, color: isToday ? "#b85a3e" : "#9a9a8e", letterSpacing: "0.1em", width: 28, flexShrink: 0 }}>
                    {DAY_SHORT[i]}
                  </span>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "#9a9a8e", width: 52, flexShrink: 0 }}>
                    {dDate.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {d.steps.map((s, si) => (
                      <div key={si} style={{ fontSize: 12, color: isToday ? "#2a2520" : "#6a6a60", fontWeight: isToday ? 600 : 400, lineHeight: 1.5, display: "flex", alignItems: "baseline", gap: 5 }}>
                        <span style={{ fontSize: 9, color: isToday ? "#b85a3e" : "#b0a898", flexShrink: 0, marginTop: 1 }}>▸</span>
                        <span style={{ wordBreak: "break-word" }}>{s.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => navigate(`${BASE}/plan/week/${week.isoWeek}`)}
              style={{ background: "transparent", border: "1.5px solid rgba(31,61,46,0.18)", borderRadius: 6, padding: "8px 16px", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1f3d2e", cursor: "pointer" }}
            >
              Open Week View →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

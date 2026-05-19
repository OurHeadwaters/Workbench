import { useLocation, useRoute } from "wouter";
import { useState, useCallback } from "react";
import {
  PLAN_2026,
  PHASE_COLORS,
  formatDateRange,
  getTodayWeek,
  toLocalISODate,
  type Week,
  type Step,
  type StepCategory,
  type ActionType,
} from "@/data/plan2026";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const ACTION_LABELS: Record<ActionType, string> = {
  "copy-ai-prompt": "Copy AI Prompt",
  "copy-replit-task-brief": "Copy Replit Task",
};

const ACTION_COLORS: Record<ActionType, { bg: string; text: string; border: string }> = {
  "copy-ai-prompt": { bg: "rgba(184,90,62,0.08)", text: "#b85a3e", border: "rgba(184,90,62,0.25)" },
  "copy-replit-task-brief": { bg: "rgba(31,61,46,0.08)", text: "#1f3d2e", border: "rgba(31,61,46,0.22)" },
};

// ─── Category config ──────────────────────────────────────────────────────────

interface CategoryConfig {
  label: string;
  color: string;
  dot: string;
  bg: string;
}

const CATEGORIES: Record<StepCategory, CategoryConfig> = {
  proposals:    { label: "Proposals Out",          color: "#b85a3e", dot: "#b85a3e", bg: "rgba(184,90,62,0.07)" },
  print:        { label: "Print & Physical",        color: "#7A4E2D", dot: "#7A4E2D", bg: "rgba(122,78,45,0.07)" },
  relationship: { label: "Relationship Moves",      color: "#1F5446", dot: "#1F5446", bg: "rgba(31,84,70,0.07)" },
  admin:        { label: "Admin & Board",           color: "#3D4A5C", dot: "#3D4A5C", bg: "rgba(61,74,92,0.07)" },
  build:        { label: "Build",                   color: "#1A5FA8", dot: "#1A5FA8", bg: "rgba(26,95,168,0.07)" },
};

const CATEGORY_ORDER: StepCategory[] = ["proposals", "print", "relationship", "admin", "build"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Step check-off + notes storage ──────────────────────────────────────────

const STEP_STATE_KEY = "hwop_week_step_state_v1";

interface StepState { done: boolean; note: string }
type StepStateStore = Record<string, StepState>;

function stepStateId(isoDate: string, title: string): string {
  return `${isoDate}::${title}`;
}

function loadStepStateStore(): StepStateStore {
  try {
    const raw = localStorage.getItem(STEP_STATE_KEY);
    return raw ? (JSON.parse(raw) as StepStateStore) : {};
  } catch { return {}; }
}

function saveStepStateStore(store: StepStateStore): void {
  try { localStorage.setItem(STEP_STATE_KEY, JSON.stringify(store)); } catch { /* noop */ }
}

function readStepState(isoDate: string, title: string): StepState {
  const store = loadStepStateStore();
  return store[stepStateId(isoDate, title)] ?? { done: false, note: "" };
}

function writeStepState(isoDate: string, title: string, update: Partial<StepState>): void {
  const store = loadStepStateStore();
  const id = stepStateId(isoDate, title);
  store[id] = { ...readStepState(isoDate, title), ...update };
  saveStepStateStore(store);
}

// ─── Step card ────────────────────────────────────────────────────────────────

interface StepWithMeta extends Step {
  isoDate: string;
  dayLabel: string;
}

function StepCard({ step }: { step: StepWithMeta }) {
  const today = toLocalISODate(new Date());
  const isToday = step.isoDate === today;
  const date = new Date(step.isoDate + "T12:00:00");
  const dateStr = date.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });

  const initial = readStepState(step.isoDate, step.title);
  const [done, setDone] = useState(initial.done);
  const [note, setNote] = useState(initial.note);
  const [noteOpen, setNoteOpen] = useState(!!initial.note);

  const toggleDone = useCallback(() => {
    setDone((prev) => {
      const next = !prev;
      writeStepState(step.isoDate, step.title, { done: next });
      return next;
    });
  }, [step.isoDate, step.title]);

  const handleNoteChange = useCallback((val: string) => {
    setNote(val);
    writeStepState(step.isoDate, step.title, { note: val });
  }, [step.isoDate, step.title]);

  return (
    <div
      style={{
        background: done ? "rgba(31,61,46,0.04)" : isToday ? "rgba(184,90,62,0.04)" : "#fff",
        border: `1px solid ${done ? "rgba(31,61,46,0.15)" : isToday ? "rgba(184,90,62,0.20)" : "rgba(31,61,46,0.09)"}`,
        borderRadius: 7,
        padding: "11px 13px",
        marginBottom: 6,
        opacity: done ? 0.65 : 1,
        transition: "opacity 0.15s, background 0.15s",
      }}
    >
      {/* Day label + check-off row */}
      <div style={{ marginBottom: 5, display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isToday ? "#b85a3e" : "#9a9a8e",
            }}
          >
            {dateStr}
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
        {/* Check-off button */}
        <button
          onClick={toggleDone}
          title={done ? "Mark undone" : "Mark done"}
          style={{
            flexShrink: 0,
            width: 18,
            height: 18,
            borderRadius: 4,
            border: `1.5px solid ${done ? "#1f3d2e" : "rgba(31,61,46,0.25)"}`,
            background: done ? "#1f3d2e" : "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {done && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#f4ede0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: done ? "#7a7a6e" : "#2a2520", lineHeight: 1.4, marginBottom: step.detail || step.actions?.length ? 5 : 0, textDecoration: done ? "line-through" : "none" }}>
        {step.title}
      </div>
      {!done && step.detail && (
        <div style={{ fontSize: 11.5, color: "#5a5a50", lineHeight: 1.5, marginBottom: step.link || step.actions?.length ? 7 : 0 }}>
          {step.detail}
        </div>
      )}
      {!done && step.link && (
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
      {!done && step.actions && step.actions.length > 0 && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
          {step.actions.map((action, i) => (
            <CopyButton key={i} content={action.content} label={action.label} type={action.type} />
          ))}
        </div>
      )}

      {/* Quick note area */}
      <div style={{ marginTop: 7 }}>
        {noteOpen ? (
          <textarea
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Quick note…"
            rows={2}
            style={{
              width: "100%",
              boxSizing: "border-box",
              fontSize: 11,
              fontFamily: "IBM Plex Sans, system-ui, sans-serif",
              color: "#2a2520",
              background: "rgba(31,61,46,0.04)",
              border: "1px solid rgba(31,61,46,0.14)",
              borderRadius: 5,
              padding: "6px 8px",
              resize: "vertical",
              outline: "none",
            }}
          />
        ) : (
          <button
            onClick={() => setNoteOpen(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 9,
              color: "#9a9a8e",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            + note
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Category column ──────────────────────────────────────────────────────────

function CategoryColumn({ cat, steps }: { cat: StepCategory; steps: StepWithMeta[] }) {
  const config = CATEGORIES[cat];

  if (steps.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          minWidth: 0,
          background: "rgba(31,61,46,0.02)",
          border: "1.5px solid rgba(31,61,46,0.07)",
          borderRadius: 10,
          padding: "12px 10px",
          opacity: 0.5,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: config.dot }} />
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: config.color,
              }}
            >
              {config.label}
            </span>
          </div>
        </div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "#9a9a8e", fontStyle: "italic" }}>
          Nothing this week
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: config.bg,
        border: `1.5px solid ${config.color}22`,
        borderRadius: 10,
        padding: "12px 10px",
      }}
    >
      {/* Category header */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: config.dot }} />
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: config.color,
            }}
          >
            {config.label}
          </span>
        </div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "#9a9a8e", letterSpacing: "0.05em", paddingLeft: 13 }}>
          {steps.length} item{steps.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Steps */}
      {steps.map((step, i) => (
        <StepCard key={i} step={step} />
      ))}
    </div>
  );
}

// ─── Build category map from week data ────────────────────────────────────────

function buildCategoryMap(week: Week): Record<StepCategory, StepWithMeta[]> {
  const map: Record<StepCategory, StepWithMeta[]> = {
    proposals: [],
    print: [],
    relationship: [],
    admin: [],
    build: [],
  };

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  week.days.forEach((day, di) => {
    day.steps.forEach((step) => {
      const cat: StepCategory = step.category ?? "admin";
      map[cat].push({ ...step, isoDate: day.isoDate, dayLabel: dayNames[di] ?? `Day ${di + 1}` });
    });
  });

  return map;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlanWeek() {
  const [, navigate] = useLocation();
  const [, params] = useRoute(`${BASE}/plan/week/:n`);
  const weekNum = params?.n ? parseInt(params.n, 10) : null;

  const week: Week | undefined = weekNum != null
    ? PLAN_2026.find((w) => w.isoWeek === weekNum)
    : undefined;

  const todayWeek = getTodayWeek();

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

  const categoryMap = buildCategoryMap(week);
  const activeCategories = CATEGORY_ORDER.filter((cat) => categoryMap[cat].length > 0);
  const emptyCategories = CATEGORY_ORDER.filter((cat) => categoryMap[cat].length === 0);

  // Day of week labels (secondary, shown at bottom)
  const today = toLocalISODate(new Date());

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

      {/* Category grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px 16px" }}>

        {/* Label */}
        <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a7a6e" }}>
            This week by category
          </div>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "#9a9a8e", letterSpacing: "0.08em" }}>
            {week.days.reduce((n, d) => n + d.steps.length, 0)} total items across {activeCategories.length} categor{activeCategories.length !== 1 ? "ies" : "y"}
          </div>
        </div>

        {/* Active categories — horizontal scroll on narrow viewports */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", minWidth: activeCategories.length * 220 }}>
            {activeCategories.map((cat) => (
              <CategoryColumn key={cat} cat={cat} steps={categoryMap[cat]} />
            ))}
          </div>
        </div>

        {/* Empty categories — compact row */}
        {emptyCategories.length > 0 && (
          <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {emptyCategories.map((cat) => {
              const config = CATEGORIES[cat];
              return (
                <div
                  key={cat}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 10px",
                    borderRadius: 5,
                    border: "1px solid rgba(31,61,46,0.08)",
                    background: "rgba(31,61,46,0.02)",
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: config.dot, opacity: 0.35 }} />
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "#9a9a8e", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {config.label}
                  </span>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "#c0c0b8" }}>
                    — nothing this week
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Day-of-week secondary reference */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a7a6e", marginBottom: 10 }}>
            By day
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "flex", gap: 6, minWidth: 500 }}>
              {week.days.map((day, di) => {
                const isToday = day.isoDate === today;
                const date = new Date(day.isoDate + "T12:00:00");
                const dateStr = date.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
                const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];
                return (
                  <div
                    key={day.isoDate}
                    style={{
                      flex: 1,
                      minWidth: 80,
                      background: isToday ? "rgba(184,90,62,0.05)" : "rgba(31,61,46,0.03)",
                      border: `1px solid ${isToday ? "rgba(184,90,62,0.22)" : "rgba(31,61,46,0.08)"}`,
                      borderRadius: 7,
                      padding: "8px 10px",
                    }}
                  >
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isToday ? "#b85a3e" : "#7a7a6e", marginBottom: 3 }}>
                      {dayNames[di]} {isToday && "· Today"}
                    </div>
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 8, color: "#9a9a8e", marginBottom: 5 }}>
                      {dateStr}
                    </div>
                    {day.steps.length === 0 ? (
                      <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 8, color: "#c0c0b8", fontStyle: "italic" }}>—</div>
                    ) : (
                      day.steps.map((step, si) => {
                        const config = step.category ? CATEGORIES[step.category] : CATEGORIES.admin;
                        return (
                          <div
                            key={si}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 4,
                              marginBottom: 3,
                            }}
                          >
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: config.dot, flexShrink: 0, marginTop: 3 }} />
                            <div style={{ fontSize: 10, color: "#3a3a30", lineHeight: 1.35 }}>
                              {step.title}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import {
  getTodayWeek,
  getTodayDay,
  formatDateRange,
  PHASE_COLORS,
  PLAN_2026,
} from "@/data/plan2026";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ─── Design tokens (matches index.css) ───────────────────────────────────────

const T = {
  bg:      "#1f3d2e",
  paper:   "#f4ede0",
  text:    "#2a2520",
  muted:   "#7a7a6e",
  rule:    "rgba(200,191,167,0.35)",
  accent:  "#b85a3e",
} as const;

// ─── Section colours ──────────────────────────────────────────────────────────

const SEC = {
  today:   { header: "#b85a3e", label: "TODAY",          note: "Open this first" },
  week:    { header: "#7A4E2D", label: "THIS WEEK",       note: "Weekly rhythm" },
  year:    { header: "#1f3d2e", label: "THE YEAR",        note: "2026 full plan" },
  money:   { header: "#1A5FA8", label: "MONEY",           note: "Salt, costs, and numbers" },
  hiring:  { header: "#3D4A5C", label: "HIRING & TOOLS",  note: "Templates, scripts, and trackers" },
  ref:     { header: "#5B3E8C", label: "REFERENCE",       note: "One-pager and full deck" },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToolRow { label: string; sub: string; detail: string; path: string; accent: string }
interface ToolSection { sec: typeof SEC[keyof typeof SEC]; tools: ToolRow[] }

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS: ToolSection[] = [
  {
    sec: SEC.today,
    tools: [
      { label: "Today's Tasks", sub: "Step-by-step for today's date", detail: "Every task scheduled for today with AI prompts ready to copy.", path: `${BASE}/plan/today`, accent: "#b85a3e" },
    ],
  },
  {
    sec: SEC.week,
    tools: [
      { label: "Week Plan",       sub: "Full week — Mon through Fri",              detail: "All five days. Copy AI prompts, jump to any day.",                            path: `${BASE}/plan/week/CURRENT`, accent: "#7A4E2D" },
      { label: "Week Close-Out",  sub: "Printable audit record for the bookkeeper", detail: "Food handler bench and swap reasons. Cmd+P to save as PDF.",                  path: `${BASE}/tools/bench/close`,  accent: "#7A4E2D" },
      { label: "Bench Swap",      sub: "Override food-handler coverage",            detail: "Swap primary or standby for any week. Reason is logged for the bookkeeper.", path: `${BASE}/tools/bench/week`,   accent: "#7A4E2D" },
    ],
  },
  {
    sec: SEC.year,
    tools: [
      { label: "Year Overview", sub: "All 52 weeks — Foundation → Pilot Execution → Year-End Audit", detail: "The full 2026 operating plan. Three phases. Every week has a theme and tasks.", path: `${BASE}/plan`, accent: "#1f3d2e" },
    ],
  },
  {
    sec: SEC.money,
    tools: [
      { label: "Salt Monthly Close",   sub: "File this month's Salt revenue and expenses", detail: "One filing per month. Stamps an immutable record. The one-pager reads this automatically.", path: `${BASE}/tools/salt-close`,   accent: "#1A5FA8" },
      { label: "Salt Yearly Summary",  sub: "Full-year Salt P&L",                           detail: "All months filed so far. Net vs baseline. Sparkline trend.",                               path: `${BASE}/tools/salt-yearly`,  accent: "#1A5FA8" },
      { label: "Cost Review",          sub: "Override any planning baseline number",         detail: "Review every Scenario B cost line. Override, add notes, export for board conversations.", path: `${BASE}/tools/cost-review`,  accent: "#1A5FA8" },
      { label: "Hours by Pillar",      sub: "Time allocation across the practice",           detail: "See how contracted hours split across each practice pillar.",                             path: `${BASE}/hours`,              accent: "#1A5FA8" },
    ],
  },
  {
    sec: SEC.hiring,
    tools: [
      { label: "Hiring Templates",          sub: "Job postings, onboarding checklists",               detail: "Print-ready hiring materials for every role in the plan.",                                                                  path: `${BASE}/hiring-templates`,               accent: "#3D4A5C" },
      { label: "Reference Call — Standard", sub: "8 questions · 3 calls minimum",                     detail: "One-page printable script for any hired role. Listening cues and flag legend included.",                                    path: `${BASE}/tools/reference-call`,           accent: "#3D4A5C" },
      { label: "Reference Call — Handyman", sub: "Child-safety extended · C5 is the key question",    detail: "6 standard + 5 child-safety questions. Hesitation is a no on C2, C3, and C5.",                                             path: `${BASE}/tools/reference-call-handyman`,  accent: "#b85a3e" },
      { label: "Candidate Tracker",         sub: "Log candidates across all roles",                   detail: "Track every candidate: role, status, notes, reference call results.",                                                       path: `${BASE}/tools/candidate-tracker`,        accent: "#3D4A5C" },
      { label: "Contract Terms",            sub: "Locked Deer Lake role baselines",                   detail: "Amendment log, contracted hours, and rate baselines. Edit only through the amendment flow.",                                 path: `${BASE}/contract-terms`,                 accent: "#3D4A5C" },
    ],
  },
  {
    sec: SEC.ref,
    tools: [
      { label: "One-Pager",       sub: "Printable engagement summary",      detail: "Single-page snapshot: team, budget scenario, and Salt numbers.",         path: `${BASE}/one-pager`, accent: "#5B3E8C" },
      { label: "Full Slide Deck", sub: "Complete practitioner presentation", detail: "All slides — prologue through closing. For council presentations.",       path: `${BASE}/deck`,      accent: "#5B3E8C" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNearestWeek() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const exact = getTodayWeek();
  if (exact) return { week: exact, isWeekend: false };
  const past = [...PLAN_2026].reverse().find((w) => w.days[0].isoDate <= todayStr);
  return past ? { week: past, isWeekend: true } : null;
}

// ─── Tool row ─────────────────────────────────────────────────────────────────

function Row({ tool }: { tool: ToolRow }) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  const href = tool.path.includes("CURRENT")
    ? tool.path.replace("CURRENT", String(getTodayWeek()?.isoWeek ?? 1))
    : tool.path;

  return (
    <div style={{ borderBottom: `1px solid ${T.rule}` }} className="last-no-border">
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ width: 3, alignSelf: "stretch", borderRadius: 2, backgroundColor: tool.accent, minHeight: 16, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: tool.accent, flexShrink: 0 }}>
            {tool.label}
          </span>
          {!open && (
            <span style={{ fontSize: 11, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {tool.sub}
            </span>
          )}
        </div>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0, opacity: 0.4, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <path d="M3 5l3.5 3.5L10 5" stroke={T.muted} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 16px 14px 29px", display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: tool.accent, margin: 0 }}>{tool.sub}</p>
          <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>{tool.detail}</p>
          <button
            onClick={() => navigate(href)}
            style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, color: tool.accent, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Open →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ s }: { s: ToolSection }) {
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.rule}` }}>
      <div style={{ padding: "10px 16px", backgroundColor: s.sec.header, display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: "#fff" }}>
          {s.sec.label}
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
          {s.sec.note}
        </span>
      </div>
      <div style={{ backgroundColor: T.paper }}>
        {s.tools.map((t, i) => (
          <div key={t.label} style={i === s.tools.length - 1 ? {} : { borderBottom: `1px solid ${T.rule}` }}>
            <Row tool={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function LobbyPage() {
  const todayResult  = getTodayDay();
  const nearest      = getNearestWeek();
  const todayWeek    = nearest?.week;
  const isWeekend    = nearest?.isWeekend ?? false;
  const phase        = todayWeek?.phase;
  const phaseColors  = phase ? PHASE_COLORS[phase] : null;
  const currentWeek  = todayWeek?.isoWeek ?? "—";
  const dateRange    = todayWeek ? formatDateRange(todayWeek) : "—";

  const todayLabel = new Date().toLocaleDateString("en-CA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "28px 16px 56px", display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Header */}
      <div style={{ marginBottom: 4 }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>
          Daily Bench — Practitioner's Operating Plan
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2, color: T.paper, fontFamily: "var(--font-display)", margin: 0 }}>
          {todayLabel}
        </h1>
      </div>

      {/* Phase banner */}
      {todayWeek && phaseColors && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
          borderRadius: 8, backgroundColor: phaseColors.bg, flexWrap: "wrap",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: phaseColors.dot, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", color: phaseColors.text }}>
            {phase}
          </span>
          <span style={{ fontSize: 11, color: phaseColors.text, opacity: 0.75 }}>
            Week {currentWeek} of {PLAN_2026.length} · {dateRange}
          </span>
          {!isWeekend && (
            <>
              <span style={{ fontSize: 11, color: phaseColors.text, opacity: 0.5 }}>·</span>
              <span style={{ fontSize: 11, color: phaseColors.text, opacity: 0.75 }}>
                {todayResult
                  ? `${todayResult.day.steps.length} task${todayResult.day.steps.length !== 1 ? "s" : ""} today`
                  : "No tasks scheduled today"}
              </span>
            </>
          )}
          {isWeekend && (
            <span style={{ fontSize: 11, color: phaseColors.text, opacity: 0.75 }}>· Weekend — tasks resume Monday</span>
          )}
          <a
            href={`${BASE}/plan/today`}
            style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: phaseColors.text, textDecoration: "none" }}
          >
            Start today ↗
          </a>
        </div>
      )}

      {/* Sections */}
      {SECTIONS.map((s) => <Section key={s.sec.label} s={s} />)}

      {/* Numbers flag */}
      <div style={{ padding: "10px 14px", borderRadius: 8, backgroundColor: "rgba(184,90,62,0.1)", borderLeft: `3px solid ${T.accent}` }}>
        <p style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: T.accent, marginBottom: 4 }}>
          Numbers check
        </p>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          Half-load ramp scenario still shows practitioner at <strong style={{ color: T.text }}>$150/hr</strong> — the shared ledger now has <strong style={{ color: T.text }}>$175/hr</strong> as the current rate.
          If the ramp rate has changed, update <code style={{ fontSize: 10 }}>HALF_LOAD_LINES.practitioner</code> in <code style={{ fontSize: 10 }}>budgetScenarios.ts</code>.
        </p>
      </div>

    </div>
  );
}

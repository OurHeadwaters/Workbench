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
  deer:    { header: "#1F5446", label: "DEER LAKE DOCS",  note: "Coaching docs for founder conversations" },
  saltbox:       { header: "#4B6070", label: "SALTBOX × GATHER ROUND", note: "Partnership & ROI strategy brief" },
  constellation: { header: "#2C4A35", label: "CONSTELLATION",          note: "Strategic decisions and zone-model status" },
  guide:         { header: "#2D5A7B", label: "PRACTITIONER'S GUIDE",   note: "Strategic tools from the guide" },
  ship:    { header: "#4A3728", label: "CODETRY SHIP",    note: "Internal workbench and SOW" },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToolRow { label: string; sub: string; detail: string; path: string; accent: string }
interface ToolSection { sec: typeof SEC[keyof typeof SEC]; tools: ToolRow[] }

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS: ToolSection[] = [
  {
    sec: SEC.today,
    tools: [
      { label: "Morning Debrief",  sub: "Start here — review yesterday, write your note, move into today", detail: "Yesterday's plan, a personal notes field saved by date, your week priorities, and quick links into today. Open this first every morning.", path: `${BASE}/debrief`,      accent: "#b85a3e" },
      { label: "Today's Tasks",    sub: "Step-by-step for today's date",                                   detail: "Every task scheduled for today with AI prompts ready to copy.",                                                                  path: `${BASE}/plan/today`, accent: "#b85a3e" },
    ],
  },
  {
    sec: SEC.week,
    tools: [
      { label: "Week Plan", sub: "Full week — Mon through Fri", detail: "All five days. Copy AI prompts, jump to any day.", path: `${BASE}/plan/week/CURRENT`, accent: "#7A4E2D" },
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
      { label: "Cost Review",          sub: "Override any phase cost baseline",              detail: "Review phase fees, override any line, attach notes. Export for funder conversations.", path: `${BASE}/tools/cost-review`,  accent: "#1A5FA8" },
      { label: "Rate Breakdown",       sub: "Why $175/hr is a composite rate",               detail: "Roles filled, market equivalents, scope shares, blended rate, and what is deliberately hired out or subcontracted.", path: `${BASE}/rate-breakdown`,     accent: "#1A5FA8" },
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
  {
    sec: SEC.deer,
    tools: [
      { label: "Chief Brief",               sub: "Plain-language proposal for the Chief — print-ready", detail: "Short, emotionally direct, no jargon. The 807 co-op precedent, rising-tide framing, youth economics angle, the 8-week ask. One read. Print and hand it over.", path: `${BASE}/deer-lake-chief-brief`,    accent: "#b85a3e" },
      { label: "Responding to Exclusivity", sub: "Talking points for the exclusivity conversation",    detail: "Step-by-step founder coaching doc: acknowledge the ask, offer something real, hold the line. Includes the one-liner to say out loud.", path: `${BASE}/deer-lake-talking-points`, accent: "#1F5446" },
      { label: "How the Model Spreads",     sub: "Replication roadmap + financial projections",        detail: "Phase 1 → Phase 2 → Constellation. What carries forward, what each community customizes, and the full financial picture by phase.", path: `${BASE}/deer-lake-roadmap`,         accent: "#1F5446" },
    ],
  },
  {
    sec: SEC.saltbox,
    tools: [
      {
        label: "Saltbox × Gather Round Brief",
        sub: "Partnership case, revenue paths, and 4-week roadmap",
        detail: "Gather Round Legacy Pass families spend real time managing downloads. Saltbox solves it via local-first delivery and an XRPL NFT identity layer. Covers three revenue options (Freemium, Bundle, Concierge), the three-track sprint roadmap, and first-email language for reaching out to Gather Round.",
        path: `${BASE}/saltbox-gather-round`,
        accent: "#4B6070",
      },
    ],
  },
  {
    sec: SEC.constellation,
    tools: [
      {
        label: "Constellation Session",
        sub: "Zone map, locked decisions, and architectural patterns from May 16",
        detail: "Seven locked decisions from the May 16 constellation session — Zone 4 renamed to Community Hall, Lodge as Zone 1 identity layer, Watershed disambiguation, and more. Zone map with proof status across all five zones. The 'regulated weight stays with the institution' architectural pattern. Two open decisions still yours to answer.",
        path: `${BASE}/constellation-session`,
        accent: "#2C4A35",
      },
    ],
  },
  {
    sec: SEC.guide,
    tools: [
      { label: "Dashboard",        sub: "Current state summary across all active scenarios",      detail: "High-level snapshot of where the practitioner stands — active scenarios, bucket status, and financial position at a glance.",                     path: `/practitioners-guide-v2/dashboard`,       accent: "#2D5A7B" },
      { label: "Session Handoff",  sub: "Generate AI context for session continuity",             detail: "Creates a context prompt you can paste into a new AI session so it picks up exactly where you left off — no re-explaining needed.",              path: `/practitioners-guide-v2/session-handoff`,  accent: "#2D5A7B" },
      { label: "Strategic Ledger", sub: "Log of strategic decisions and pivots",                  detail: "A running record of every major strategic call — what was decided, when, and why. Useful for debriefs and accountability.",                        path: `/practitioners-guide-v2/strategic-ledger`, accent: "#2D5A7B" },
      { label: "Debt Attack",      sub: "Aggressive debt reduction planner",                      detail: "Financial coaching tool for mapping the fastest path out of personal or business debt — ordered payoff, surplus allocation, and milestones.",      path: `/practitioners-guide-v2/debt-attack`,      accent: "#2D5A7B" },
      { label: "What Next",        sub: "Strategic planning for the next phase",                  detail: "A structured coaching doc for thinking through the next major move — what's available, what's required, and what the decision actually is.",       path: `/practitioners-guide-v2/what-next`,        accent: "#2D5A7B" },
      { label: "Annual Check-In",  sub: "Structured yearly review",                               detail: "A guided annual review process for practitioners — what worked, what didn't, what the model learned, and what changes going into the next year.",  path: `/practitioners-guide-v2/year/check-in`,    accent: "#2D5A7B" },
      { label: "Workflow Map",     sub: "Step-by-step practitioner workflow visualization",       detail: "A visual walkthrough of the full practitioner process from intake to handoff — useful for orientation and for explaining the model to others.",    path: `/practitioners-guide-v2/workflow`,          accent: "#2D5A7B" },
      { label: "Replication",      sub: "Guidelines for replicating the model across communities", detail: "The internal playbook for taking what works in one community and applying it to the next — what transfers, what must be rebuilt, what to watch.", path: `/practitioners-guide-v2/replication`,       accent: "#2D5A7B" },
      { label: "Sarge HQ",         sub: "Mobile-focused operational control interface",           detail: "A compact, mobile-optimized hub for real-time operational decisions when you're on-site or in the field.",                                          path: `/practitioners-guide-v2/sarge`,             accent: "#2D5A7B" },
    ],
  },
  {
    sec: SEC.ship,
    tools: [
      { label: "Workbench",         sub: "Internal operator dashboard and tool hub",              detail: "Central hub linking to all internal workspace tools — Research Library, Books, Handbook, Rootwork, Grants Finder — in one place.",  path: `/workbench`,  accent: "#4A3728" },
      { label: "Statement of Work", sub: "Formal, printable engagement terms document",           detail: "The locked SOW outlining hourly engagement terms ($175/hr) and scope. Printable. For use when a formal agreement is needed before the contract.",  path: `/sow`,        accent: "#4A3728" },
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

function isExternalArtifactPath(path: string): boolean {
  if (!BASE) return path.startsWith("/practitioners-guide-v2") || path.startsWith("/workbench") || path.startsWith("/sow");
  return !path.startsWith(BASE + "/") && path !== BASE;
}

function openPath(href: string, navigate: (to: string) => void) {
  if (isExternalArtifactPath(href)) {
    window.location.href = href;
  } else {
    navigate(href);
  }
}

function Row({ tool }: { tool: ToolRow }) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  const href = tool.path.includes("CURRENT")
    ? tool.path.replace("CURRENT", String(getTodayWeek()?.isoWeek ?? 1))
    : tool.path;

  const external = isExternalArtifactPath(href);

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
          {external ? (
            <a
              href={href}
              style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, color: tool.accent, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "none" }}
            >
              Open →
            </a>
          ) : (
          <button
            onClick={() => openPath(href, navigate)}
            style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, color: tool.accent, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Open →
          </button>
          )}
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

// ─── Search filter ────────────────────────────────────────────────────────────

function filterSections(query: string): ToolSection[] {
  const q = query.trim().toLowerCase();
  if (!q) return SECTIONS;
  return SECTIONS.flatMap((s) => {
    const tools = s.tools.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.sub.toLowerCase().includes(q) ||
        t.detail.toLowerCase().includes(q),
    );
    return tools.length ? [{ ...s, tools }] : [];
  });
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

  const [query, setQuery] = useState("");
  const filtered = filterSections(query);

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

      {/* Search */}
      <div style={{ position: "relative" }}>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.45 }}
        >
          <circle cx="6" cy="6" r="4.25" stroke={T.paper} strokeWidth="1.5" />
          <path d="M9.5 9.5L12 12" stroke={T.paper} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="Search coaching docs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 12px 10px 34px",
            fontSize: 12, color: T.paper,
            background: "rgba(255,255,255,0.08)",
            border: `1px solid rgba(200,191,167,0.25)`,
            borderRadius: 8,
            outline: "none",
          }}
        />
      </div>

      {/* Sections */}
      {filtered.length > 0
        ? filtered.map((s) => <Section key={s.sec.label} s={s} />)
        : (
          <div style={{
            padding: "32px 16px", textAlign: "center",
            borderRadius: 10, border: `1px solid ${T.rule}`,
            background: "rgba(255,255,255,0.04)",
          }}>
            <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
              No results for <strong style={{ color: T.paper }}>"{query}"</strong>
            </p>
          </div>
        )
      }


    </div>
  );
}

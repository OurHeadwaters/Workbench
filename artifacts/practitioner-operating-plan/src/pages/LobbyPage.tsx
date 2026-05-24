import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { NeighbourhoodBadge } from "@workspace/zone-store";
import {
  getTodayWeek,
  getTodayDay,
  formatDateRange,
  PHASE_COLORS,
  PLAN_2026,
  toLocalISODate,
} from "@/data/plan2026";
import { getMostRecentEveningDump } from "./EveningDump";
import { setDailyThing, todayKey, loadDayThings } from "@/lib/threeThings";
import { SessionStore, type SessionEntry } from "@/lib/sessionStore";

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
  clients: { header: "#3D5C48", label: "CLIENTS",         note: "Who we're working with and where each stands" },
  hiring:  { header: "#3D4A5C", label: "SUBCONTRACTOR LIST",  note: "Partner organizations, templates, and trackers" },
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
      { label: "Evening Dump",     sub: "Brain dump before you close the day — phone-friendly, no structure", detail: "Full-screen, open text area. No fields, no limits. Write whatever's on your mind about today's work. Saves automatically. Opens the morning brief thread for tomorrow.", path: `${BASE}/debrief/evening`, accent: "#b85a3e" },
      { label: "Today's Tasks",    sub: "Step-by-step for today's date",                                   detail: "Every task scheduled for today with AI prompts ready to copy.",                                                                  path: `${BASE}/plan/today`, accent: "#b85a3e" },
    ],
  },
  {
    sec: SEC.week,
    tools: [
      { label: "Week Plan", sub: "Full week — by category: Proposals, Print, Relationships, Admin, Build", detail: "All five working tracks. See the whole week by category — what's in each lane, what day it falls on.", path: `${BASE}/plan/week/CURRENT`, accent: "#7A4E2D" },
    ],
  },
  {
    sec: SEC.year,
    tools: [
      { label: "Year Overview", sub: "All phases — Pursuit → Pivot → Operating Season", detail: "The full 2026 plan. Three phases anchored to real milestones: Deer Lake proposal, 807 computing runway, AGM, Tyler's cold storage, and farmers market / print delivery.", path: `${BASE}/plan`, accent: "#1f3d2e" },
    ],
  },
  {
    sec: SEC.clients,
    tools: [
      {
        label: "Client Roster",
        sub: "All five clients — status, what's active, and quick links",
        detail: "One-page view of everyone Bobbie is working with: GMPH ($72k pre-paid, stepping-back), 807 Food Co-op (revenue floor + Wild Bites), Gather Round × Saltbox (outreach, demo ready), Deer Lake (anchor proposal), and NAN (pipeline, waiting on Deer Lake). Each card shows status badge, what's active now, and a link to the full brief.",
        path: `${BASE}/clients`,
        accent: "#3D5C48",
      },
      {
        label: "GMPH — G.M. Pepin Holdings",
        sub: "Active · $72k pre-paid · stepping-back engagement",
        detail: "Gilles Pepin, three-phase stepping-back plan: Discover → Run → Step Back. Phase 1 Discovery at $28k. Voice-note-first working method. Weekly written brief from Bobbie. The two-of-you framing from the May 2026 brief.",
        path: `${BASE}/gmph`,
        accent: "#3D4A5C",
      },
      {
        label: "807 Food Co-op / Wild Bites",
        sub: "Active · $12k computing runway · Wild Bites product line live",
        detail: "Community-owned supply chain co-op and the revenue floor for the Pursuit phase. Wild Bites is the active branded product line: 2,000 roll labels + 200 foil pouches ordered April 2026. 807 is also the proof case named in the Deer Lake Chief Brief.",
        path: `${BASE}/eight-oh-seven`,
        accent: "#1A5FA8",
      },
      {
        label: "Gather Round × Saltbox",
        sub: "Outreach · catalog demo live · three partnership vectors",
        detail: "20+ curriculum paths mapped, 7 real GR covers in the demo. Three partnership vectors: A — Tech Retainer, B — Co-brand, C — Acquisition. Revenue model by year. Canadian mom register conversation script ready. First contact not yet sent.",
        path: `${BASE}/saltbox-gather-round`,
        accent: "#4B6070",
      },
      {
        label: "Deer Lake First Nation",
        sub: "Anchor · Chief Brief delivered · 8-week trial framing active",
        detail: "The anchor community engagement and the proof case for the constellation model. Chief Brief in hand. AGM board approval on path. Soft decision deadline June 15. Every future community proposal references Deer Lake as the foundation.",
        path: `${BASE}/deer-lake-chief-brief`,
        accent: "#1F5446",
      },
      {
        label: "NAN — Nishnawbe Aski Nation",
        sub: "Pipeline · first outreach not yet sent · 49 communities",
        detail: "Represents 49 First Nation communities across Treaty 9 and 5. The right conversation happens after Deer Lake is contracted. Outreach note is drafted. Research task: identify correct NAN contact for community economic development before sending anything.",
        path: `${BASE}/nan`,
        accent: "#5B3E8C",
      },
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
      { label: "Rockfront Family Farm",         sub: "Partner organization",  detail: "Subcontractor partner.",  path: "#", accent: "#3D4A5C" },
      { label: "Superior Seasons",              sub: "Partner organization",  detail: "Subcontractor partner.",  path: "#", accent: "#3D4A5C" },
      { label: "807 Food Co-op",                sub: "Partner organization",  detail: "Subcontractor partner.",  path: "#", accent: "#3D4A5C" },
      { label: "GMPH",                          sub: "Partner organization",  detail: "Subcontractor partner.",  path: "#", accent: "#3D4A5C" },
      { label: "Ontario Co-operatives Association", sub: "Partner organization", detail: "Subcontractor partner.", path: "#", accent: "#3D4A5C" },
      { label: "Walls Farm",                    sub: "Partner organization",  detail: "Subcontractor partner.",  path: "#", accent: "#3D4A5C" },
      { label: "Zurbriggs Farm",                sub: "Partner organization",  detail: "Subcontractor partner.",  path: "#", accent: "#3D4A5C" },
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

// ─── Pattern-matched framing ──────────────────────────────────────────────────

function deriveFraming(text: string): string[] {
  const lower = text.toLowerCase();
  const notes: string[] = [];

  if (lower.includes("deer lake") || lower.includes("chief") || lower.includes("council")) {
    notes.push("Deer Lake is on your mind — that's the anchor deal. Protect time today to move it one concrete step forward.");
  }
  if (lower.includes("807") || lower.includes("computing") || lower.includes("saltbox")) {
    notes.push("807 is your active revenue floor. Whatever else is uncertain, that relationship needs consistent attention.");
  }
  if (lower.includes("tyler") || lower.includes("cold storage")) {
    notes.push("The cold storage thread is alive in your head — Tyler needs a clear next step from you, not just good intentions.");
  }
  if (lower.includes("print") || lower.includes("farmers market") || lower.includes("signage") || lower.includes("flyer")) {
    notes.push("Physical work is in the mix. Print and farmers market tasks have real deadlines — don't let them slide to the end of the week.");
  }
  if (lower.includes("agm") || lower.includes("board") || lower.includes("meeting")) {
    notes.push("Board and governance is on your radar. Those relationships need care, not just task management — make sure there's a human moment in there.");
  }
  if (lower.includes("gather round") || lower.includes("pace") || lower.includes("nan")) {
    notes.push("Pipeline relationships are in your head. Keep outreach brief and direct — the goal is one response, not a perfect pitch.");
  }
  if (lower.includes("tired") || lower.includes("sleep") || lower.includes("exhausted") || lower.includes("stressed")) {
    notes.push("You mentioned being tired or stressed. The non-negotiables are: kids, sleep, partner time. If any of those are slipping, that's the first thing to fix — not the proposals.");
  }

  // Generic fallback if nothing matched
  if (notes.length === 0) {
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 20) {
      notes.push("You had a lot on your mind last night. The fact that you wrote it down means you can let go of it now — it's captured.");
    } else {
      notes.push("Short dump last night. Sometimes the most important thing is just getting it out. What's the one thing that would make today feel complete?");
    }
  }

  return notes.slice(0, 3);
}

function formatDumpDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  const todayIso = toLocalISODate(new Date());
  if (isoDate === todayIso) return "today";
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  if (isoDate === toLocalISODate(yesterdayDate)) return "last night";
  return d.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });
}

// ─── Yesterday Close Block ────────────────────────────────────────────────────

function YesterdayCloseBlock({ entry }: { entry: SessionEntry }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        background: "rgba(31,61,46,0.06)",
        border: "1px solid rgba(31,61,46,0.14)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 7,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#1F5446",
        }}
      >
        Last night you left off
      </p>
      {entry.whatMoved && (
        <div>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted }}>What moved </span>
          <span style={{ fontSize: 12, color: T.text, lineHeight: 1.55, display: "block", marginTop: 1 }}>{entry.whatMoved}</span>
        </div>
      )}
      {entry.openThreads && (
        <div>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted }}>Open threads </span>
          <span style={{ fontSize: 12, color: T.text, lineHeight: 1.55, display: "block", marginTop: 1 }}>{entry.openThreads}</span>
        </div>
      )}
      {entry.firstMove && (
        <div>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1F5446" }}>First move today </span>
          <span style={{ fontSize: 12, color: T.text, fontWeight: 600, lineHeight: 1.55, display: "block", marginTop: 1 }}>{entry.firstMove}</span>
        </div>
      )}
    </div>
  );
}

// ─── Work Achieved Panel ──────────────────────────────────────────────────────

function WorkAchievedPanel() {
  const [entry, setEntry] = useState<SessionEntry | null>(null);
  const [newItem, setNewItem] = useState("");
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEntry(SessionStore.getToday());
  }, []);

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const text = newItem.trim();
    if (!text) return;
    SessionStore.addAchieved(text);
    setEntry(SessionStore.getToday());
    setNewItem("");
    setAdding(false);
  }

  function handleRemove(i: number) {
    SessionStore.removeAchieved(i);
    setEntry(SessionStore.getToday());
  }

  const achieved = entry?.achieved ?? [];

  return (
    <div
      style={{
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid rgba(184,90,62,0.3)`,
        background: "rgba(184,90,62,0.07)",
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          background: "rgba(184,90,62,0.2)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: T.paper,
            }}
          >
            TODAY SO FAR
          </span>
          <span style={{ fontSize: 10, color: "rgba(244,237,224,0.6)", fontWeight: 500 }}>
            what got done
          </span>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(244,237,224,0.75)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            letterSpacing: "0.08em",
          }}
        >
          + add item
        </button>
      </div>

      <div style={{ padding: "12px 16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {achieved.length === 0 && !adding && (
          <p style={{ margin: 0, fontSize: 12, color: "rgba(244,237,224,0.45)", fontStyle: "italic", lineHeight: 1.6 }}>
            Nothing logged yet. Hit "+ add item" to mark your first win of the day.
          </p>
        )}

        {achieved.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ color: T.accent, fontSize: 12, flexShrink: 0, marginTop: 2, lineHeight: 1 }}>✓</span>
            <span style={{ flex: 1, fontSize: 12, color: T.paper, lineHeight: 1.6 }}>{item}</span>
            <button
              onClick={() => handleRemove(i)}
              title="Remove"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: "rgba(244,237,224,0.3)",
                fontSize: 13,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        ))}

        {adding && (
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 6, marginTop: achieved.length ? 4 : 0 }}>
            <input
              ref={inputRef}
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="What did you just finish?"
              style={{
                flex: 1,
                padding: "8px 10px",
                fontSize: 12,
                fontFamily: "var(--font-body)",
                color: T.text,
                background: T.paper,
                border: `1.5px solid ${T.rule}`,
                borderRadius: 6,
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                background: T.accent,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Log it
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setNewItem(""); }}
              style={{
                padding: "8px 10px",
                background: "rgba(244,237,224,0.1)",
                color: "rgba(244,237,224,0.6)",
                border: "none",
                borderRadius: 6,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Session Close Modal ──────────────────────────────────────────────────────

function SessionCloseModal({ onClose }: { onClose: () => void }) {
  const [whatMoved, setWhatMoved] = useState("");
  const [openThreads, setOpenThreads] = useState("");
  const [firstMove, setFirstMove] = useState("");
  const [saved, setSaved] = useState(false);

  const existing = SessionStore.getToday();
  useEffect(() => {
    if (existing) {
      setWhatMoved(existing.whatMoved);
      setOpenThreads(existing.openThreads);
      setFirstMove(existing.firstMove);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    SessionStore.saveClose({ whatMoved, openThreads, firstMove });
    setSaved(true);
    setTimeout(onClose, 1400);
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 11px",
    fontSize: 12,
    fontFamily: "var(--font-body)",
    color: T.text,
    background: "rgba(31,61,46,0.04)",
    border: `1.5px solid ${T.rule}`,
    borderRadius: 6,
    outline: "none",
    resize: "vertical",
    lineHeight: 1.55,
    minHeight: 68,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: T.muted,
    display: "block",
    marginBottom: 5,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(20,36,26,0.72)",
        backdropFilter: "blur(3px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: T.paper,
          borderRadius: "14px 14px 0 0",
          padding: "24px 20px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: T.accent }}>
              END OF SESSION
            </span>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
              Close the loop. Three fields. Under a minute.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, fontSize: 20, lineHeight: 1, padding: "0 0 0 12px" }}
          >
            ×
          </button>
        </div>

        {saved ? (
          <div
            style={{
              padding: "16px",
              background: "rgba(31,84,70,0.08)",
              border: "1px solid rgba(31,84,70,0.2)",
              borderRadius: 8,
              fontSize: 13,
              color: "#1F5446",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Saved. Tomorrow's brief will pick this up.
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>What moved today</label>
              <textarea
                value={whatMoved}
                onChange={(e) => setWhatMoved(e.target.value)}
                placeholder="The things that actually shifted — decisions made, things sent, people talked to…"
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Open threads</label>
              <textarea
                value={openThreads}
                onChange={(e) => setOpenThreads(e.target.value)}
                placeholder="What's unresolved, waiting on someone, or quietly nagging at you…"
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>First move tomorrow</label>
              <textarea
                value={firstMove}
                onChange={(e) => setFirstMove(e.target.value)}
                placeholder="The one thing you'll do before you open email or look at your phone…"
                style={{ ...fieldStyle, minHeight: 52 }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "11px 20px",
                background: T.accent,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              Save and close the day →
            </button>

            <p style={{ margin: 0, fontSize: 10, color: T.muted, lineHeight: 1.6, textAlign: "center" }}>
              This close-out feeds tomorrow's strategy framing — keeping the OPA as the live record of business thinking, not a separate notebook.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Morning Brief Card ───────────────────────────────────────────────────────

function MorningBriefCard() {
  const [, navigate] = useLocation();
  const [morningNote, setMorningNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const dump = getMostRecentEveningDump();
  const yesterdayClose = SessionStore.getYesterday();

  function handleMorningNote(e: React.FormEvent) {
    e.preventDefault();
    const text = morningNote.trim();
    if (!text) return;
    // Pre-seed today's evening dump key with the morning note
    const today = toLocalISODate(new Date());
    try {
      const existing = localStorage.getItem(`evening-dump-${today}`) ?? "";
      const combined = existing
        ? `${existing}\n\n[Morning — ${new Date().toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" })}]: ${text}`
        : `[Morning]: ${text}`;
      localStorage.setItem(`evening-dump-${today}`, combined);
    } catch { /* noop */ }
    // Also seed the first available slot in today's Three Things
    try {
      const key = todayKey();
      const slots = loadDayThings(key);
      const emptySlot = ([0, 1, 2] as const).find((i) => slots[i] === null);
      if (emptySlot !== undefined) {
        setDailyThing(key, emptySlot, { text, done: false });
      }
    } catch { /* noop */ }
    setSubmitted(true);
    setMorningNote("");
  }

  // No dump yet — show the habit nudge
  if (!dump) {
    return (
      <div
        style={{
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${T.rule}`,
        }}
      >
        <div
          style={{
            padding: "10px 16px",
            backgroundColor: "rgba(184,90,62,0.18)",
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: T.paper }}>
            YOUR THREAD
          </span>
          <span style={{ fontSize: 10, color: "rgba(244,237,224,0.6)", fontWeight: 500 }}>
            morning brief
          </span>
        </div>
        <div style={{ backgroundColor: T.paper, padding: "16px 16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
          {yesterdayClose && (yesterdayClose.whatMoved || yesterdayClose.openThreads || yesterdayClose.firstMove) && (
            <YesterdayCloseBlock entry={yesterdayClose} />
          )}
          <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.6 }}>
            No evening dump yet. Tonight, before you close the laptop, spend 5 minutes writing what's on your mind. Tomorrow morning it'll be waiting here.
          </p>
          <button
            onClick={() => navigate(`${BASE}/debrief/evening`)}
            style={{
              alignSelf: "flex-start",
              padding: "8px 14px",
              background: T.accent,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.03em",
            }}
          >
            Start tonight's dump →
          </button>
        </div>
      </div>
    );
  }

  const framingNotes = deriveFraming(dump.text);
  const dumpLabel = formatDumpDate(dump.isoDate);

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.rule}` }}>
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: "rgba(184,90,62,0.22)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: T.paper }}>
            YOUR THREAD
          </span>
          <span style={{ fontSize: 10, color: "rgba(244,237,224,0.6)", fontWeight: 500 }}>
            from {dumpLabel}
          </span>
        </div>
        <button
          onClick={() => navigate(`${BASE}/debrief/evening`)}
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(244,237,224,0.55)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Add to tonight's dump →
        </button>
      </div>

      <div style={{ backgroundColor: T.paper, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Yesterday's session close — subtle context block */}
        {yesterdayClose && (yesterdayClose.whatMoved || yesterdayClose.openThreads || yesterdayClose.firstMove) && (
          <YesterdayCloseBlock entry={yesterdayClose} />
        )}

        {/* The user's own words */}
        <div
          style={{
            borderLeft: `3px solid ${T.accent}`,
            paddingLeft: 12,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: T.text,
              lineHeight: 1.7,
              fontStyle: "italic",
              whiteSpace: "pre-line",
              maxHeight: 160,
              overflow: "hidden",
            }}
          >
            {dump.text.length > 480
              ? dump.text.slice(0, 480).trimEnd() + "…"
              : dump.text}
          </p>
        </div>

        {/* Framing observations */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: T.muted,
            }}
          >
            What I'm noticing about this
          </p>
          {framingNotes.map((note, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: T.accent,
                  flexShrink: 0,
                  marginTop: 6,
                }}
              />
              <p style={{ margin: 0, fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                {note}
              </p>
            </div>
          ))}
        </div>

        {/* Morning check-in prompt */}
        {!submitted ? (
          <form onSubmit={handleMorningNote} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: T.muted,
              }}
            >
              Where's your head at after a good sleep?
            </label>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                value={morningNote}
                onChange={(e) => setMorningNote(e.target.value)}
                placeholder="One line — redirect, confirm, or add something…"
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  color: T.text,
                  background: "rgba(31,61,46,0.04)",
                  border: `1.5px solid ${T.rule}`,
                  borderRadius: 6,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "9px 14px",
                  background: T.accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Lock it in
              </button>
            </div>
          </form>
        ) : (
          <div
            style={{
              padding: "10px 12px",
              background: "rgba(31,84,70,0.07)",
              border: "1px solid rgba(31,84,70,0.18)",
              borderRadius: 6,
              fontSize: 12,
              color: "#1F5446",
              fontWeight: 600,
            }}
          >
            Good. That's your starting point for the day.{" "}
            <button
              onClick={() => navigate(`${BASE}/plan/today`)}
              style={{ fontWeight: 700, color: "#1F5446", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", fontSize: 12 }}
            >
              See today's tasks →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Machine State Panel ──────────────────────────────────────────────────────

type MachineStateKey = "Empty" | "Building" | "Stable" | "Strong";

const MACHINE_STATE_KEY = "hwop_machine_state_v1";

const MACHINE_STATES: Record<
  MachineStateKey,
  { color: string; bg: string; border: string; description: string; rules: string[] }
> = {
  Empty: {
    color: "#b85a3e",
    bg: "rgba(184,90,62,0.08)",
    border: "rgba(184,90,62,0.25)",
    description: "Bucket 1 is funded. Buckets 2, 3, and 4 have nothing.",
    rules: [
      "All surplus above Cost Basis goes to Reserve (Bucket 2) until it reaches three months of operating costs.",
      "No Reinvestment spending.",
      "No Eave Flow.",
      "No exceptions. The machine is not strong enough to give anything away yet.",
    ],
  },
  Building: {
    color: "#1A5FA8",
    bg: "rgba(26,95,168,0.08)",
    border: "rgba(26,95,168,0.22)",
    description: "Reserve (Bucket 2) is between one and six months of operating costs.",
    rules: [
      "Continue filling Reserve to the six-month target.",
      "Reinvestment (Bucket 3) may receive up to 10% of surplus while Reserve is building — but only for investments that demonstrably increase future Cost Basis income.",
      "No Eave Flow.",
    ],
  },
  Stable: {
    color: "#1F5446",
    bg: "rgba(31,84,70,0.08)",
    border: "rgba(31,84,70,0.22)",
    description: "Bucket 2 is at six months. Bucket 1 is covered. Bucket 3 is active.",
    rules: [
      "Reserve is maintained. Any draw on Reserve triggers an immediate return-to-building protocol.",
      "Reinvestment runs at the agreed community percentage.",
      "Eave Flow (Bucket 4) activates only after Reinvestment is funded.",
    ],
  },
  Strong: {
    color: "#3D4A5C",
    bg: "rgba(61,74,92,0.08)",
    border: "rgba(61,74,92,0.22)",
    description: "All four buckets are funded. Reserve is at six months. Reinvestment is compounding. Eave Flow is active.",
    rules: [
      "The machine is now producing honey. The overflow is real.",
      "Eave Flow goes outward — to replication, to allied watersheds, to the seventh generation.",
      "The community begins the governance process to define the next generation of institutions.",
      "The machine is documented and prepared to be replicated.",
    ],
  },
};

const STATE_ORDER: MachineStateKey[] = ["Empty", "Building", "Stable", "Strong"];

function loadMachineState(): MachineStateKey {
  try {
    const raw = localStorage.getItem(MACHINE_STATE_KEY);
    if (raw && STATE_ORDER.includes(raw as MachineStateKey)) return raw as MachineStateKey;
  } catch { /* noop */ }
  return "Empty";
}

function saveMachineState(state: MachineStateKey): void {
  try { localStorage.setItem(MACHINE_STATE_KEY, state); } catch { /* noop */ }
}

function MachineStatePanel() {
  const [state, setState] = useState<MachineStateKey>(() => loadMachineState());
  const [picking, setPicking] = useState(false);

  const cfg = MACHINE_STATES[state];

  function handlePick(s: MachineStateKey) {
    setState(s);
    saveMachineState(s);
    setPicking(false);
  }

  return (
    <div
      style={{
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${cfg.border}`,
        background: cfg.bg,
      }}
    >
      {/* Header row */}
      <div
        style={{
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${cfg.border}`,
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: T.muted,
            }}
          >
            Machine State
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: cfg.color,
              background: `${cfg.bg}`,
              border: `1.5px solid ${cfg.border}`,
              borderRadius: 5,
              padding: "2px 8px",
            }}
          >
            {state}
          </span>
        </div>
        <button
          onClick={() => setPicking((v) => !v)}
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T.muted,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            letterSpacing: "0.06em",
          }}
        >
          {picking ? "cancel" : "change state"}
        </button>
      </div>

      {/* State picker */}
      {picking && (
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "10px 16px",
            borderBottom: `1px solid ${cfg.border}`,
            flexWrap: "wrap",
          }}
        >
          {STATE_ORDER.map((s) => {
            const c = MACHINE_STATES[s];
            const active = s === state;
            return (
              <button
                key={s}
                onClick={() => handlePick(s)}
                style={{
                  padding: "5px 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: active ? "#fff" : c.color,
                  background: active ? c.color : "transparent",
                  border: `1.5px solid ${c.border}`,
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}

      {/* Description + rules */}
      <div style={{ padding: "12px 16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: cfg.color,
            fontStyle: "italic",
            lineHeight: 1.5,
          }}
        >
          {cfg.description}
        </p>
        <ul
          style={{
            margin: 0,
            paddingLeft: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {cfg.rules.map((rule, i) => (
            <li
              key={i}
              style={{
                fontSize: 11,
                color: T.text,
                lineHeight: 1.6,
              }}
            >
              {rule}
            </li>
          ))}
        </ul>
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

  const [query, setQuery] = useState("");
  const filtered = filterSections(query);
  const [showClose, setShowClose] = useState(false);

  const todayLabel = new Date().toLocaleDateString("en-CA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // Force re-render once on mount so MorningBriefCard reads fresh localStorage
  const [, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "28px 16px 56px", display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
      <div aria-hidden className="pointer-events-none od-topo" style={{ position: "absolute", inset: 0, opacity: 0.07, pointerEvents: "none" }} />

      {/* Session Close Modal */}
      {showClose && <SessionCloseModal onClose={() => setShowClose(false)} />}

      {/* Header */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
          <div className="hw-label hw-label--cream">
            Daily Bench — Practitioner's Operating Plan
          </div>
          <NeighbourhoodBadge zoneId={2} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2, color: T.paper, fontFamily: "var(--font-display)", margin: 0 }}>
          {todayLabel}
        </h1>
      </div>

      {/* Work Achieved panel — very top, always visible */}
      {!query && <WorkAchievedPanel />}

      {/* Morning brief card */}
      {!query && <MorningBriefCard />}

      {/* Phase banner */}
      {!query && todayWeek && phaseColors && (
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

      {/* End of session trigger */}
      {!query && (
        <button
          onClick={() => setShowClose(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "11px 16px",
            background: "rgba(255,255,255,0.05)",
            border: `1px solid rgba(200,191,167,0.2)`,
            borderRadius: 8,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(244,237,224,0.7)", letterSpacing: "0.04em" }}>
            End of session →
          </span>
          <span style={{ fontSize: 10, color: "rgba(244,237,224,0.35)" }}>
            log wins · open threads · first move tomorrow
          </span>
        </button>
      )}

      {/* Machine State */}
      {!query && <MachineStatePanel />}

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

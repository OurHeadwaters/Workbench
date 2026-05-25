import { useState } from "react";
import { useLocation } from "wouter";
import {
  getTodayWeek,
} from "@/data/plan2026";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const T = {
  bg:     "#1f3d2e",
  paper:  "#f4ede0",
  text:   "#2a2520",
  muted:  "#7a7a6e",
  rule:   "rgba(200,191,167,0.35)",
  accent: "#b85a3e",
} as const;

const SEC = {
  today:         { header: "#b85a3e", label: "TODAY",                  note: "Start here" },
  week:          { header: "#7A4E2D", label: "THIS WEEK",              note: "Weekly rhythm" },
  year:          { header: "#1f3d2e", label: "THE YEAR",               note: "2026 full plan" },
  money:         { header: "#1A5FA8", label: "MONEY",                  note: "Salt, costs, numbers" },
  clients:       { header: "#3D5C48", label: "CLIENTS",                note: "Who we're working with" },
  deer:          { header: "#1F5446", label: "DEER LAKE",              note: "Anchor deal — June 15" },
  hiring:        { header: "#3D4A5C", label: "PARTNERS & HIRING",      note: "Subcontractors, templates, trackers" },
  constellation: { header: "#2C4A35", label: "CONSTELLATION",          note: "Strategic decisions" },
  ref:           { header: "#5B3E8C", label: "REFERENCE",              note: "One-pager and full deck" },
  window:        { header: "#4B6070", label: "HEADWATERS WINDOW",      note: "Public transparency portal (Z3)" },
} as const;

interface ToolRow { label: string; sub: string; detail: string; path: string; accent: string }
interface ToolSection { sec: typeof SEC[keyof typeof SEC]; tools: ToolRow[] }

const SECTIONS: ToolSection[] = [
  {
    sec: SEC.today,
    tools: [
      { label: "Morning Debrief",  sub: "Review yesterday · write your note · move into today",  detail: "Yesterday's plan, a personal notes field saved by date, your week priorities, and quick links into today. Open this first every morning.", path: `${BASE}/debrief`, accent: "#b85a3e" },
      { label: "Evening Dump",     sub: "Brain dump before you close — phone-friendly",           detail: "Full-screen open text. No fields, no limits. Saves automatically.", path: `${BASE}/debrief/evening`, accent: "#b85a3e" },
      { label: "Today's Tasks",    sub: "Step-by-step for today's date",                         detail: "Every task scheduled for today with AI prompts ready to copy.", path: `${BASE}/cockpit/tasks`, accent: "#b85a3e" },
    ],
  },
  {
    sec: SEC.week,
    tools: [
      { label: "Week Plan", sub: "Full week — by category", detail: "All five working tracks: Proposals, Print, Relationships, Admin, Build.", path: `${BASE}/cockpit/week`, accent: "#7A4E2D" },
    ],
  },
  {
    sec: SEC.year,
    tools: [
      { label: "Year Overview", sub: "All phases — Pursuit → Pivot → Operating Season", detail: "The full 2026 plan anchored to Deer Lake proposal, 807 runway, AGM, Tyler's cold storage, farmers market.", path: `${BASE}/cockpit/year`, accent: "#1f3d2e" },
    ],
  },
  {
    sec: SEC.clients,
    tools: [
      { label: "Client Roster",           sub: "All five clients — status and quick links",      detail: "GMPH, 807 Food Co-op, Gather Round × Saltbox, Deer Lake, NAN. Status badge and what's active.",        path: `${BASE}/cockpit/clients`,    accent: "#3D5C48" },
      { label: "GMPH",                    sub: "Active · $72k pre-paid · stepping-back",         detail: "Gilles Pepin. Three-phase plan: Discover → Run → Step Back. Phase 1 Discovery at $28k.",                path: `${BASE}/cockpit/gmph`,       accent: "#3D5C48" },
      { label: "807 Food Co-op",          sub: "Active · $12k runway · Wild Bites live",         detail: "Community-owned supply chain co-op. Wild Bites active. Proof case in the Chief Brief.",                  path: `${BASE}/cockpit/807`,        accent: "#1A5FA8" },
      { label: "Gather Round × Saltbox",  sub: "Outreach · catalog demo live",                   detail: "20+ curriculum paths, 7 real GR covers, three revenue options. First contact not yet sent.",             path: `${BASE}/cockpit/saltbox`,    accent: "#4B6070" },
      { label: "Deer Lake First Nation",  sub: "Anchor · Chief Brief delivered · June 15",       detail: "The anchor engagement and proof case. AGM board approval on path.",                                       path: `${BASE}/cockpit/deer-lake`,  accent: "#1F5446" },
      { label: "NAN — Nishnawbe Aski",    sub: "Pipeline · 49 communities",                      detail: "Treaty 9 and 5. Right conversation happens after Deer Lake contracts.",                                   path: `${BASE}/cockpit/nan`,        accent: "#5B3E8C" },
    ],
  },
  {
    sec: SEC.deer,
    tools: [
      { label: "Chief Brief",               sub: "Plain-language proposal — print-ready",          detail: "Short, emotionally direct, no jargon. The 807 precedent, rising-tide framing, youth economics, the 6–8 week ask.", path: `${BASE}/cockpit/deer-lake-brief`,        accent: "#b85a3e" },
      { label: "Responding to Exclusivity", sub: "Talking points for the exclusivity conversation", detail: "Step-by-step founder coaching: acknowledge the ask, offer something real, hold the line.",                         path: `${BASE}/cockpit/deer-lake-talking`,      accent: "#1F5446" },
      { label: "How the Model Spreads",     sub: "Replication roadmap + financials",               detail: "Phase 1 → Phase 2 → Constellation. What carries, what each community customises, full financial spread.",           path: `${BASE}/cockpit/deer-lake-roadmap`,     accent: "#1F5446" },
    ],
  },
  {
    sec: SEC.money,
    tools: [
      { label: "Salt Monthly Close",  sub: "File this month's Salt revenue and expenses", detail: "One filing per month. Stamps an immutable record. The one-pager reads this.",   path: `${BASE}/cockpit/salt-close`,   accent: "#1A5FA8" },
      { label: "Salt Yearly Summary", sub: "Full-year Salt P&L",                          detail: "All months filed so far. Net vs baseline. Sparkline trend.",                    path: `${BASE}/cockpit/salt-yearly`,  accent: "#1A5FA8" },
      { label: "Cost Review",         sub: "Override any phase cost baseline",            detail: "Review phase fees, override any line, attach notes.",                            path: `${BASE}/cockpit/cost-review`,  accent: "#1A5FA8" },
      { label: "Rate Breakdown",      sub: "Why $175/hr is a composite rate",             detail: "Roles filled, market equivalents, scope shares, blended rate.",                  path: `${BASE}/cockpit/rate-breakdown`, accent: "#1A5FA8" },
    ],
  },
  {
    sec: SEC.hiring,
    tools: [
      { label: "Hiring Templates",          sub: "Job postings, onboarding checklists",         detail: "Print-ready hiring materials for every role in the plan.",                                    path: `${BASE}/cockpit/hiring`,            accent: "#3D4A5C" },
      { label: "Reference Call — Standard", sub: "8 questions · 3 calls minimum",               detail: "One-page printable script for any hired role.",                                               path: `${BASE}/cockpit/reference-call`,    accent: "#3D4A5C" },
      { label: "Reference Call — Handyman", sub: "Child-safety extended · C5 is the key",       detail: "6 standard + 5 child-safety questions. Hesitation is a no on C2, C3, C5.",                  path: `${BASE}/cockpit/reference-handyman`, accent: "#b85a3e" },
      { label: "Candidate Tracker",         sub: "Log candidates across all roles",             detail: "Track every candidate: role, status, notes, reference results.",                              path: `${BASE}/cockpit/candidates`,        accent: "#3D4A5C" },
      { label: "Contract Terms",            sub: "Locked Deer Lake role baselines",             detail: "Amendment log, contracted hours, rate baselines.",                                            path: `${BASE}/cockpit/contract-terms`,    accent: "#3D4A5C" },
      { label: "Bench — Week",              sub: "Weekly 4-person depot bench rotation",        detail: "SIN, banking, WSIB compliance. Auto-updating roster.",                                        path: `${BASE}/cockpit/bench-week`,        accent: "#3D4A5C" },
    ],
  },
  {
    sec: SEC.constellation,
    tools: [
      { label: "Constellation Session", sub: "Zone map · locked decisions · May 16 2026", detail: "Seven locked decisions — Zone 4 renamed, Lodge as Z1 identity layer, Watershed disambiguation. Two open decisions.", path: `${BASE}/cockpit/constellation`, accent: "#2C4A35" },
    ],
  },
  {
    sec: SEC.ref,
    tools: [
      { label: "One-Pager",       sub: "Printable engagement summary",      detail: "Single-page snapshot: team, budget scenario, Salt numbers.",    path: `${BASE}/cockpit/one-pager`, accent: "#5B3E8C" },
      { label: "Full Slide Deck", sub: "Complete practitioner presentation", detail: "All slides — prologue through closing. For council presentations.", path: `${BASE}/cockpit/deck`,      accent: "#5B3E8C" },
    ],
  },
  {
    sec: SEC.window,
    tools: [
      { label: "Headwaters Window", sub: "Public transparency portal — Z3 only", detail: "The controlled Eave Flow leak. What the world sees: the offer, the model, the kit. No Z1 data crosses this line.", path: `${BASE}/window`, accent: "#4B6070" },
    ],
  },
];

function filterSections(query: string): ToolSection[] {
  const q = query.trim().toLowerCase();
  if (!q) return SECTIONS;
  return SECTIONS.flatMap((s) => {
    const tools = s.tools.filter(
      (t) => t.label.toLowerCase().includes(q) || t.sub.toLowerCase().includes(q) || t.detail.toLowerCase().includes(q),
    );
    return tools.length ? [{ ...s, tools }] : [];
  });
}

function isExternal(path: string): boolean {
  return path.startsWith("http") || (!path.startsWith(BASE + "/") && path !== BASE && !path.startsWith(BASE));
}

function Row({ tool }: { tool: ToolRow }) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  const href = tool.path.includes("CURRENT")
    ? tool.path.replace("CURRENT", String(getTodayWeek()?.isoWeek ?? 1))
    : tool.path;

  const external = isExternal(href);

  return (
    <div style={{ borderBottom: `1px solid ${T.rule}` }} className="last-no-border">
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
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
            <a href={href} style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, color: tool.accent, textDecoration: "none" }}>
              Open →
            </a>
          ) : (
            <button onClick={() => navigate(href.replace(BASE, "") || "/")} style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, color: tool.accent, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Open →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SectionBlock({ s }: { s: ToolSection }) {
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

export function CockpitPage() {
  const [query, setQuery] = useState("");
  const visible = filterSections(query);

  return (
    <div className="min-h-dvh pb-28" style={{ backgroundColor: T.bg }}>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: T.paper, margin: 0, lineHeight: 1.2 }}>
          Cockpit
        </h1>
        <p style={{ fontSize: 12, color: "rgba(244,237,224,0.6)", marginTop: 4 }}>
          Every tool. One place. Z2 layer — client and business work.
        </p>

        <div className="mt-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(200,191,167,0.3)",
              backgroundColor: "rgba(244,237,224,0.1)",
              color: T.paper,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
      </div>

      <div className="px-4 pb-8 max-w-lg mx-auto space-y-3">
        {visible.length === 0 ? (
          <p style={{ color: "rgba(244,237,224,0.5)", fontSize: 13, textAlign: "center", paddingTop: 32 }}>
            No tools match "{query}"
          </p>
        ) : (
          visible.map((s) => <SectionBlock key={s.sec.label} s={s} />)
        )}
      </div>
    </div>
  );
}

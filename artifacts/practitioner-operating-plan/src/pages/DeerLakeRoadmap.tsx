import { useLocation } from "wouter";
import {
  PHASE1_FLAT_FEE,
  PHASE1_HOURS_PER_WEEK,
  PHASE1_WEEKS_MIN,
  PHASE1_WEEKS_MAX,
  PHASE1_TITHE,
  PHASE1_TITHE_PCT,
  PHASE1_POST_TITHE,
  PHASE1_BOBBIE_COST_MIN,
  PHASE1_BOBBIE_COST_MAX,
  PHASE1_GAP_MAX,
  TOTAL_MONTHLY_BILLED,
  BOBBIE_DRAW_MONTHLY,
  TYLER_COST_MONTHLY,
  OVERHEADS_MONTHLY,
  MONTHLY_SURPLUS,
  ANNUAL_SURPLUS,
  TERM_MONTHS,
  MILESTONE_BRIDGE_DEADLINE,
  MILESTONE_HARD_DECISION,
  MILESTONE_807_TARGET,
  MILESTONE_SCENARIO_A_FLOOR,
  fmtDollar,
  fmtMonthly,
  fmtAnnual,
  fmtApproxAnnual,
  fmtMilestoneDate,
} from "@/data/v7";

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
  purple: "#5B3E8C",
};

// ─── Financial data ──────────────────────────────────────────────────────────

const FINANCIALS = [
  {
    phase: "Phase 1 — Deer Lake",
    color: T.teal,
    rows: [
      { label: `Flat fee (${PHASE1_WEEKS_MIN}–${PHASE1_WEEKS_MAX} week trial)`, value: fmtDollar(PHASE1_FLAT_FEE) },
      { label: "Practitioner hours", value: `${PHASE1_HOURS_PER_WEEK} hrs/wk · ${PHASE1_WEEKS_MIN}–${PHASE1_WEEKS_MAX} wks` },
      { label: `Tithe (${PHASE1_TITHE_PCT}%)`, value: fmtDollar(PHASE1_TITHE) },
      { label: "Post-tithe revenue", value: fmtDollar(PHASE1_POST_TITHE) },
      { label: `Practitioner draw (${PHASE1_WEEKS_MIN} wks — break-even)`, value: fmtDollar(PHASE1_BOBBIE_COST_MIN) },
      { label: `Practitioner draw (${PHASE1_WEEKS_MAX} wks — max gap)`, value: fmtDollar(PHASE1_BOBBIE_COST_MAX) },
      { label: "Intentional gap (at maximum duration)", value: fmtDollar(PHASE1_GAP_MAX) },
    ],
    note: "Trial closes when all 4 criteria are delivered — as early as week 6 (break-even) or at most week 8 (−$8,400 intentional gap). Establishes trust, produces documentation, seeds Phase 2.",
  },
  {
    phase: "Phase 2 — Full Engagement",
    color: T.blue,
    rows: [
      { label: "Monthly billed (Deer Lake)", value: fmtMonthly(TOTAL_MONTHLY_BILLED) },
      { label: "Practitioner draw", value: fmtMonthly(BOBBIE_DRAW_MONTHLY) },
      { label: "Distribution subcontract", value: fmtMonthly(TYLER_COST_MONTHLY) },
      { label: "Lean overheads", value: fmtMonthly(OVERHEADS_MONTHLY) },
      { label: "Monthly surplus", value: fmtMonthly(MONTHLY_SURPLUS) },
      { label: `Annual surplus (Phase 2)`, value: fmtAnnual(ANNUAL_SURPLUS) },
    ],
    note: "Full engagement rate: $175/hr blended composite. Tyler at $70/hr distribution subcontract.",
  },
  {
    phase: "Phase 3+ — Constellation",
    color: T.purple,
    rows: [
      { label: "Second community engagement", value: `~${fmtMonthly(TOTAL_MONTHLY_BILLED)}` },
      { label: "Combined annual billings (2 communities)", value: `~${fmtAnnual(TOTAL_MONTHLY_BILLED * TERM_MONTHS * 2)}` },
      { label: "Network surplus (est.)", value: fmtApproxAnnual(ANNUAL_SURPLUS * 2) },
      { label: "807 co-op supply activation", value: `Targeting ${MILESTONE_807_TARGET}` },
      { label: "Hard decision date (Plan B trigger)", value: fmtMilestoneDate(MILESTONE_HARD_DECISION) },
    ],
    note: "Economics flip when the store proves it pays for itself. Each added community increases grant eligibility, supply leverage, and policy surface area.",
  },
];

// ─── Phase progression ───────────────────────────────────────────────────────

interface PhaseItem {
  phase: string;
  subtitle: string;
  color: string;
  carries: string[];
  customizes: string[];
  gains: string[];
}

const PHASES: PhaseItem[] = [
  {
    phase: "Phase 1",
    subtitle: "Deer Lake as anchor community",
    color: T.teal,
    carries: [],
    customizes: [
      "Discovery audit scoped to local infrastructure gaps",
      "Hiring plan built from community capacity",
      "Grant roadmap matched to northern funding landscape",
    ],
    gains: [
      "Operations guide (the first one — built from scratch)",
      "Hiring plan template usable by all future communities",
      "Proof of concept that the model works on the ground",
      "Anchor community status — written into the model permanently",
    ],
  },
  {
    phase: "Phase 2",
    subtitle: "Second community joins, learns from Phase 1",
    color: T.blue,
    carries: [
      "Full operating system (Codetry tools, pricing model, supply chain contacts)",
      "Hiring templates and reference call scripts",
      "Phase 1 operations guide as a training document",
      "Tithe structure and surplus reinvestment logic",
    ],
    customizes: [
      "Local discovery audit (new community, new gaps)",
      "Staffing mix matched to community capacity",
      "Grant priorities aligned to their funders",
    ],
    gains: [
      "Pattern established — one community is a pilot, two is a proof",
      "Deer Lake documentation becomes training material (authorship credit)",
      "Combined buying power on the 807 co-op supply line",
      "Shared grant eligibility for network-wide applications",
    ],
  },
  {
    phase: "Phase 3+",
    subtitle: "Constellation expands — each community adds to the whole",
    color: T.purple,
    carries: [
      "Proven operating system refined by two deployments",
      "Benchmarked financial model with real surplus data",
      "Cross-community hiring and reference network",
      "807 co-op supply relationship at scale",
    ],
    customizes: [
      "Each community adapts the model to their economic context",
      "Local pricing and staffing calibrated to their labour market",
      "Community-specific grant roadmap",
    ],
    gains: [
      "Regional policy leverage — governments partner with constellations",
      "Funder competition — networks attract capital that single communities don't",
      "Resilience — if one site struggles, the network holds",
      "Deer Lake as the recognized origin point of a regional movement",
    ],
  },
];

// ─── What carries forward ────────────────────────────────────────────────────

const CARRIES = [
  { label: "Operating system", detail: "Codetry tools, pricing architecture, documentation framework" },
  { label: "Tithe logic", detail: "10% of gross fee funds the shared model — every community contributes" },
  { label: "Hiring templates", detail: "Reference call scripts, job postings, onboarding checklists" },
  { label: "Supply chain contacts", detail: "807 co-op relationships, vendor agreements, logistics playbook" },
  { label: "Financial benchmarks", detail: "Real surplus data from Phase 1 and Phase 2 — not projections" },
  { label: "Authorship credit", detail: "Deer Lake is named in all materials as the community that built the foundation" },
];

// ─── Components ──────────────────────────────────────────────────────────────

function PrintButton() {
  return (
    <button
      className="no-print"
      onClick={() => window.print()}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 7,
        border: `1px solid ${T.rule}`,
        backgroundColor: "rgba(255,255,255,0.06)",
        color: T.muted,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
      Print / Save as PDF
    </button>
  );
}

function FinancialCard({ data }: { data: typeof FINANCIALS[0] }) {
  return (
    <div className="print-card" style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.rule}` }}>
      <div style={{ padding: "10px 16px", backgroundColor: data.color }}>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#fff" }}>
          {data.phase}
        </span>
      </div>
      <div style={{ backgroundColor: T.paper }}>
        {data.rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
              padding: "9px 16px",
              borderBottom: i < data.rows.length - 1 ? `1px solid ${T.rule}` : "none",
            }}
          >
            <span style={{ fontSize: 12, color: T.muted }}>{r.label}</span>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color: r.value.startsWith("−") ? T.accent : T.text,
              whiteSpace: "nowrap" as const,
            }}>
              {r.value}
            </span>
          </div>
        ))}
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${T.rule}`, backgroundColor: "rgba(0,0,0,0.02)" }}>
          <p style={{ margin: 0, fontSize: 11, color: T.muted, lineHeight: 1.6, fontStyle: "italic" }}>
            {data.note}
          </p>
        </div>
      </div>
    </div>
  );
}

function PhaseCard({ p, index }: { p: PhaseItem; index: number }) {
  return (
    <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", flexShrink: 0, width: 32 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          backgroundColor: p.color, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 900, flexShrink: 0,
        }}>
          {index + 1}
        </div>
        {index < PHASES.length - 1 && (
          <div style={{ flex: 1, width: 2, backgroundColor: T.rule, marginTop: 4 }} />
        )}
      </div>
      <div style={{ paddingLeft: 14, paddingBottom: index < PHASES.length - 1 ? 24 : 0, flex: 1 }}>
        <div style={{ marginBottom: 10 }}>
          <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: p.color }}>
            {p.phase}
          </p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, fontFamily: "var(--font-display)", color: T.paper, lineHeight: 1.3 }}>
            {p.subtitle}
          </p>
        </div>

        {p.carries.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.muted }}>
              Carries forward from previous
            </p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {p.carries.map((c) => (
                <li key={c} style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, marginBottom: 2 }}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: p.color }}>
            What this community customizes
          </p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {p.customizes.map((c) => (
              <li key={c} style={{ fontSize: 12, color: T.text, lineHeight: 1.6, marginBottom: 2 }}>{c}</li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: p.color }}>
            What the network gains
          </p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {p.gains.map((g) => (
              <li key={g} style={{ fontSize: 12, color: T.text, lineHeight: 1.6, marginBottom: 2 }}>{g}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DeerLakeRoadmap() {
  const [, navigate] = useLocation();

  return (
    <div className="print-root" style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 64px" }}>

      <div className="no-print" style={{ marginBottom: 20 }}>
        <a
          href={BASE + "/"}
          style={{ fontSize: 11, fontWeight: 700, color: T.muted, textDecoration: "none", letterSpacing: "0.08em" }}
        >
          ← Back to Operating Plan
        </a>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" as const }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 8px" }}>
              Deer Lake — Replication Roadmap
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              fontWeight: 600,
              lineHeight: 1.2,
              color: T.paper,
              margin: "0 0 10px",
            }}>
              How the Model Spreads
            </h1>
          </div>
          <PrintButton />
        </div>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
          Deer Lake seeds a model designed to travel. This document shows the progression from anchor community to regional constellation — what carries forward, what each community builds fresh, and what the whole network earns with each addition.
        </p>
      </div>

      {/* Phase progression */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: T.muted }}>
            Phase Progression
          </span>
        </div>
        <div style={{ padding: "20px 20px 16px", borderRadius: 10, border: `1px solid ${T.rule}`, backgroundColor: "rgba(255,255,255,0.03)" }}>
          {PHASES.map((p, i) => (
            <PhaseCard key={p.phase} p={p} index={i} />
          ))}
        </div>
      </div>

      {/* What always carries forward */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: T.muted }}>
            What Always Travels With the Model
          </span>
        </div>
        <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.rule}` }}>
          <div style={{ padding: "10px 16px", backgroundColor: T.teal }}>
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#fff" }}>
              CORE CARRY-FORWARD — COMMUNITY TO COMMUNITY
            </span>
          </div>
          <div style={{ backgroundColor: T.paper }}>
            {CARRIES.map((c, i) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: i < CARRIES.length - 1 ? `1px solid ${T.rule}` : "none",
                }}
              >
                <div style={{ width: 3, flexShrink: 0, borderRadius: 2, backgroundColor: T.teal, alignSelf: "stretch", minHeight: 16 }} />
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 800, color: T.teal, letterSpacing: "0.04em" }}>{c.label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: T.muted, lineHeight: 1.55 }}>{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial projections */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: T.muted }}>
            Financial Projections by Phase
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
          {FINANCIALS.map((f) => (
            <FinancialCard key={f.phase} data={f} />
          ))}
        </div>

        {/* Milestone callout */}
        <div style={{
          marginTop: 14,
          padding: "14px 18px",
          borderRadius: 10,
          backgroundColor: "rgba(26,95,168,0.12)",
          border: `1px solid rgba(26,95,168,0.3)`,
        }}>
          <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: T.blue }}>
            Key Milestones
          </p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li style={{ fontSize: 12, color: T.paper, lineHeight: 1.7 }}>
              <strong>{fmtMilestoneDate(MILESTONE_BRIDGE_DEADLINE)}</strong> — Bridge capital floor: {fmtDollar(MILESTONE_SCENARIO_A_FLOOR)}/month cost basis if no bridge lands
            </li>
            <li style={{ fontSize: 12, color: T.paper, lineHeight: 1.7 }}>
              <strong>{fmtMilestoneDate(MILESTONE_HARD_DECISION)}</strong> — Hard decision date: if Northern Band hasn't signed, shift to Plan B cluster outreach
            </li>
            <li style={{ fontSize: 12, color: T.paper, lineHeight: 1.7 }}>
              <strong>{MILESTONE_807_TARGET} target</strong> — 807 Food Co-operative supply line activates; Phase 3 economics flip
            </li>
          </ul>
        </div>
      </div>

      {/* See also */}
      <div className="no-print" style={{
        padding: "16px 20px",
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.04)",
        border: `1px solid ${T.rule}`,
      }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 6px" }}>
          See Also
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}>
          <a href={`${BASE}/deer-lake-talking-points`} style={{ fontSize: 12, fontWeight: 700, color: T.accent, textDecoration: "none" }}>
            Responding to the Exclusivity Ask →
          </a>
          <span style={{ color: T.rule, fontSize: 12 }}>|</span>
          <a href={`${BASE}/tools/cost-review`} style={{ fontSize: 12, fontWeight: 700, color: T.accent, textDecoration: "none" }}>
            Cost Review →
          </a>
          <span style={{ color: T.rule, fontSize: 12 }}>|</span>
          <a href={`${BASE}/rate-breakdown`} style={{ fontSize: 12, fontWeight: 700, color: T.accent, textDecoration: "none" }}>
            Rate Breakdown →
          </a>
          <span style={{ color: T.rule, fontSize: 12 }}>|</span>
          <button
            onClick={() => navigate(`${BASE}/constellation-session`)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#5B3E8C", textDecoration: "none", fontFamily: "inherit" }}
          >
            Constellation Session →
          </button>
        </div>
      </div>

    </div>
  );
}

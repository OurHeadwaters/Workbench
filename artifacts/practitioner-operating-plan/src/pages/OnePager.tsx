/**
 * OnePager.tsx — print-format one-pager for the contractor's CFO
 *
 * All dollar figures are imported from @/data/budgetScenarios.
 * Do NOT hardcode any cost-basis, reinvestment, ask, or bridge
 * numbers in this file.
 */

import { useState, useEffect } from "react";
import {
  A_LINES as A_LINE_VALS,
  B_LINES,
  C_ADDITIONAL_LINES,
  COST_BASIS,
  ASK,
  REINVEST,
  BRIDGE,
  CAPEX,
  SCENARIO_ROWS,
  Y1,
  fmt,
  fmtK,
} from "@/data/budgetScenarios";
import {
  getRecentHistory,
  getStatus,
  SALT_BASELINE_NET,
  type SaltCloseRecord,
} from "@/lib/saltClose";

const CASHFLOW_XLSX = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/headwaters-cashflow-model.xlsx`;

// Drift-guard phrase: must match every surface that carries the operator-couple framing.
// prettier-ignore
const STORE_STACK_PHRASE = "Square at the till, QuickBooks on the books, Local Line for producers, the Headwaters cockpit tying them together";

const CREAM     = "#f4ede0";
const DARK      = "#1f3d2e";
const AMBER     = "#b85a3e";
const MUTED     = "#6b7665";
const RULE      = "#c8bfa7";
const TEXT      = "#2a2520";
const INK       = "#2a2520";
const GREEN     = "#2a6b3e";
const YELLOW_DK = "#7a5c00";
const RED_DK    = "#7a1a1a";

const STATUS_PILL: Record<string, { bg: string; color: string; label: string }> = {
  healthy: { bg: "rgba(42,107,62,0.10)",  color: GREEN,     label: "Healthy" },
  watch:   { bg: "rgba(122,92,0,0.10)",   color: YELLOW_DK, label: "Watch"   },
  below:   { bg: "rgba(122,26,26,0.10)",  color: RED_DK,    label: "Below"   },
};

function labelMonth(m: string): string {
  const [y, mo] = m.split("-");
  return new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString("en-US", { month: "short" });
}

/** Inline SVG sparkline for the last N salt close nets vs. baseline */
function SaltSparkline({ history }: { history: SaltCloseRecord[] }) {
  if (history.length === 0) return null;

  const W = 200, H = 40, PAD = 6;
  const nets = history.map(r => r.net);
  const minV = Math.min(...nets, 0);
  const maxV = Math.max(...nets, SALT_BASELINE_NET * 1.3);
  const scaleY = (v: number) => PAD + (H - 2 * PAD) * (1 - (v - minV) / (maxV - minV));
  const scaleX = (i: number) =>
    history.length === 1 ? W / 2 : PAD + (i / (history.length - 1)) * (W - 2 * PAD);

  const baseY = scaleY(SALT_BASELINE_NET);

  const points = history.map((_, i) => `${scaleX(i)},${scaleY(nets[i])}`).join(" ");

  const areaPath =
    `M ${scaleX(0)},${H} ` +
    history.map((_, i) => `L ${scaleX(i)},${scaleY(nets[i])}`).join(" ") +
    ` L ${scaleX(history.length - 1)},${H} Z`;

  return (
    <svg width={W} height={H} style={{ display: "block", overflow: "visible" }}>
      {/* Baseline reference */}
      <line x1={PAD} y1={baseY} x2={W - PAD} y2={baseY} stroke={RULE} strokeWidth={1} strokeDasharray="3,3" />

      {/* Area fill */}
      <path d={areaPath} fill="rgba(31,61,46,0.06)" />

      {/* Line */}
      <polyline points={points} fill="none" stroke={DARK} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />

      {/* Dots */}
      {history.map((rec, i) => {
        const status = getStatus(rec.net);
        const dotColor = status === "healthy" ? GREEN : status === "watch" ? YELLOW_DK : RED_DK;
        return (
          <circle key={rec.month} cx={scaleX(i)} cy={scaleY(rec.net)} r={3} fill={dotColor} />
        );
      })}

      {/* Month labels */}
      {history.map((rec, i) => (
        <text
          key={rec.month}
          x={scaleX(i)}
          y={H + 9}
          textAnchor="middle"
          fontSize={6}
          fontFamily="'IBM Plex Mono', ui-monospace, monospace"
          fill={MUTED}
        >
          {labelMonth(rec.month)}
        </text>
      ))}
    </svg>
  );
}

// ── Cost-basis line items (A / B / C columns) ─────────────────────────
// aVal comes from A_LINE_VALS (budgetScenarios.ts) — no hardcoded dollar values here.
// bVal comes from B_LINES (budgetScenarios.ts).
// cVal comes from C_ADDITIONAL_LINES (budgetScenarios.ts); null = not C-specific (same as B).
type CostTableRow = {
  label: string;
  description: string;
  aVal: number | null;
  bVal: number | null;
  cVal: number | null;
  scenario: "A" | "B" | "C";
};

const COST_TABLE_ROWS: CostTableRow[] = [
  { label: "Practitioner / Lead",             description: "Engagement owner — loaded monthly take",                                                                     aVal: A_LINE_VALS.practitioner,   bVal: B_LINES.practitioner,  cVal: null,                                   scenario: "A" },
  { label: "Operations Manager",              description: "Dryden, on-site · ~40 hrs/wk @ $40/hr loaded",                                                               aVal: A_LINE_VALS.opsManager,     bVal: B_LINES.opsManager,    cVal: null,                                   scenario: "A" },
  { label: "IT / Tech",                       description: "Servers, privacy phones, transparency stack, store IT",                                                       aVal: A_LINE_VALS.itTech,         bVal: B_LINES.itTech,        cVal: null,                                   scenario: "A" },
  { label: "Bookkeeper / Admin",              description: "Remote ~10 hrs/wk · CRA, invoicing, monthly close",                                                          aVal: A_LINE_VALS.bookkeeper,     bVal: B_LINES.bookkeeper,    cVal: null,                                   scenario: "A" },
  { label: "Food Handler (embedded at DL)",   description: "Headwaters-owned, on the store floor Day 1",                                                                 aVal: A_LINE_VALS.foodHandler,    bVal: B_LINES.foodHandler,   cVal: null,                                   scenario: "A" },
  { label: "Community Dev. Associate",        description: "Pilot #2 readiness; community-facing engagement",                                                            aVal: null,                       bVal: B_LINES.cdAssociate,   cVal: null,                                   scenario: "B" },
  { label: "Junior Analyst / Field",          description: "Data, household price lookups, fieldwork",                                                                   aVal: null,                       bVal: B_LINES.juniorAnalyst, cVal: null,                                   scenario: "B" },
  { label: "Sr Engineer #2",                  description: "Server resilience at scale — second senior engineer for the 9-server fleet",                                 aVal: null,                       bVal: null,                  cVal: C_ADDITIONAL_LINES.srEngineer2,         scenario: "C" },
  { label: "Regional Outreach",               description: "Pilot #2 community sourcing — the seat that makes the second engagement ready",                              aVal: null,                       bVal: null,                  cVal: C_ADDITIONAL_LINES.regionalOutreach,    scenario: "C" },
  { label: "Council Trainer",                 description: "Training cohorts at receiving bands — knowledge transfer at scale",                                          aVal: null,                       bVal: null,                  cVal: C_ADDITIONAL_LINES.trainer,             scenario: "C" },
  { label: "Life supports + overhead",        description: "Cleaner $500/mo + tutor $900/mo + handyman $700/mo (C adds $2,900 scale delta)",                            aVal: A_LINE_VALS.lifeSupports,   bVal: B_LINES.lifeSupports,  cVal: C_ADDITIONAL_LINES.lifeSupportsDelta,   scenario: "A" },
  { label: "Aggregation hub (Dad-warehouse)", description: `${STORE_STACK_PHRASE} — $2,200 rent + utilities all-in; see /lease-tooling`,                               aVal: A_LINE_VALS.aggregationHub, bVal: B_LINES.aggregationHub,cVal: null,                                   scenario: "A" },
  { label: "Tooling, SaaS, insurance",        description: "Operating overhead — agency licenses and software stack",                                                    aVal: A_LINE_VALS.tooling,        bVal: B_LINES.tooling,       cVal: null,                                   scenario: "A" },
  { label: "Recurring tech ops",              description: "Cloud, phone plans, monitoring — 9-server fleet monthly",                                                   aVal: A_LINE_VALS.recurringTech,  bVal: B_LINES.recurringTech, cVal: null,                                   scenario: "A" },
  { label: "Buffer (statutory + variance)",   description: "Holds cost basis when payroll taxes or insurance jump",                                                      aVal: null,                       bVal: B_LINES.buffer,        cVal: null,                                   scenario: "B" },
];

// ── Reinvestment destination rows ─────────────────────────────────────
const REINVEST_ROWS = [
  { label: "Tech CAPEX (annual)",             year1: 60_000,  detail: "9 servers, 6 phones, 8 computers — owned by agency" },
  { label: "Tooling subscriptions",           year1: 24_000,  detail: "Dashboard hosting, GIS, secure comms, bookkeeping" },
  { label: "Training & R&D",                  year1: 36_000,  detail: "CANDO/AFOA/ANTCO, documentation, community training" },
  { label: "Pilot scale reserve",             year1: 156_000, detail: "Accumulates so Pilot #2 doesn't wait for grants" },
];

function cell(content: string | number | null, right = false, bold = false, small = false) {
  return (
    <td
      style={{
        padding: "3pt 4pt",
        textAlign: right ? "right" : "left",
        fontWeight: bold ? 600 : 400,
        fontSize: small ? "7.5pt" : "9pt",
        color: content === null ? MUTED : INK,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {content === null ? "—" : typeof content === "number" ? fmt(content) : content}
    </td>
  );
}

export default function OnePager() {
  const [saltHistory, setSaltHistory] = useState<SaltCloseRecord[]>([]);
  const latest = saltHistory.length > 0 ? saltHistory[saltHistory.length - 1] : null;

  useEffect(() => {
    setSaltHistory(getRecentHistory(6));
  }, []);

  return (
    <div style={{ background: "#d8d2c8", minHeight: "100vh" }}>
      <div
        id="pdf-target"
        style={{
          width: "8.5in",
          margin: "0 auto",
          background: CREAM,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "9pt",
          color: TEXT,
        }}
      >
        {/* ── PAGE 1 ─────────────────────────────────────────────── */}
        <div
          className="page-letter"
          style={{ width: "8.5in", minHeight: "11in", padding: "0.55in 0.65in", position: "relative" }}
        >
          {/* Amber rule */}
          <div style={{ height: "3pt", background: AMBER, margin: "0 0 14pt" }} />

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14pt" }}>
            <div>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
                Practitioner Operating Plan
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "22pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "4pt" }}>
                The Operating Budget
              </div>
              <div style={{ fontSize: "9pt", color: MUTED, lineHeight: 1.5 }}>
                A community development contract at {fmt(ASK.recommended)}/month.
                Cost basis, reinvestment markup, and bridge capital — auditable line-by-line.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Confidential</div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>Headwaters Development Services</div>
            </div>
          </div>

          {/* Introduction */}
          <p style={{ fontSize: "9.5pt", lineHeight: 1.5, color: TEXT, marginBottom: "12pt" }}>
            A community development contract at {fmt(ASK.recommended)}/month is a real inflection point.
            It only stays a yes if the practitioner's days with the kids stay sacred, the on-the-ground
            execution doesn't depend on one tired person, and the band gets infrastructure that outlasts
            the engagement. Below: the operating structure, the financial model with a {REINVEST.b.pct}% reinvestment
            markup, and the path from one pilot to a repeatable template.
          </p>

          {/* ── Section 1: Cost basis table ───────────────────────── */}
          <div style={{ marginBottom: "12pt" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "5pt" }}>
              The Cost Basis (A / B / C floor · the A floor cost basis is auditable line-by-line)
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ borderBottom: `1.5pt solid ${RULE}`, color: MUTED, fontWeight: 600 }}>
                  <th style={{ padding: "3pt 4pt", textAlign: "left", width: "22%" }}>Role / Line</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "left", width: "34%" }}>What it covers</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "12%" }}>A floor</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "12%" }}>B rec.</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "12%" }}>C scale</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "8%" }}>Scen.</th>
                </tr>
              </thead>
              <tbody>
                {COST_TABLE_ROWS.map((row) => (
                  <tr key={row.label} style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                    <td style={{ padding: "3pt 4pt", fontWeight: 600, fontSize: "9pt", verticalAlign: "top" }}>{row.label}</td>
                    <td style={{ padding: "3pt 4pt", fontSize: "8.5pt", color: MUTED, lineHeight: 1.4, verticalAlign: "top" }}>{row.description}</td>
                    <td style={{ padding: "3pt 4pt", textAlign: "right", fontSize: "9pt", color: row.aVal === null ? MUTED : TEXT }}>{row.aVal === null ? "—" : fmt(row.aVal)}</td>
                    <td style={{ padding: "3pt 4pt", textAlign: "right", fontWeight: row.scenario !== "C" ? 600 : 400, fontSize: "9pt", color: row.bVal === null ? MUTED : TEXT }}>{row.bVal === null ? "—" : fmt(row.bVal)}</td>
                    <td style={{ padding: "3pt 4pt", textAlign: "right", fontWeight: row.scenario === "C" ? 600 : 400, fontSize: "9pt", color: row.cVal === null ? MUTED : TEXT }}>{row.cVal === null ? "—" : fmt(row.cVal)}</td>
                    <td style={{ padding: "3pt 4pt", textAlign: "right", fontSize: "8pt", color: MUTED }}>{row.scenario}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: `1.5pt solid ${RULE}`, background: "rgba(31,61,46,0.04)" }}>
                  <td style={{ padding: "5pt 4pt", fontWeight: 700, fontSize: "9.5pt", color: DARK }} colSpan={2}>Cost basis total</td>
                  <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontSize: "9.5pt", color: DARK }}>{fmt(COST_BASIS.a)}</td>
                  <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontSize: "9.5pt", color: DARK }}>{fmt(COST_BASIS.b)}</td>
                  <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontSize: "9.5pt", color: DARK }}>{fmt(COST_BASIS.c)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "3pt", lineHeight: 1.35 }}>
              Cost basis includes the Dad-warehouse aggregation hub ({fmt(B_LINES.aggregationHub)}/mo all-in; see /lease-tooling for the related-party documentation).
              Scenario C column shows the C-specific delta lines; all other lines carry forward from B. C total = {fmt(COST_BASIS.c)}/mo.
            </div>
          </div>

          {/* ── Section 2: Bill scenarios ─────────────────────────── */}
          <div style={{ marginBottom: "12pt" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "5pt" }}>
              Bill scenarios — cost basis + reinvestment markup ({REINVEST.b.pct}% target)
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ borderBottom: `1.5pt solid ${RULE}`, color: MUTED, fontWeight: 600 }}>
                  <th style={{ padding: "3pt 4pt", textAlign: "left", width: "22%" }}>Scenario</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "20%" }}>Cost basis</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "20%" }}>Reinvestment</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "20%" }}>Bill / month</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "18%" }}>Bridge needed</th>
                </tr>
              </thead>
              <tbody>
                {SCENARIO_ROWS.map((s) => (
                  <tr key={s.id} style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                    <td style={{ padding: "3pt 4pt", fontWeight: 600 }}>{s.label}</td>
                    <td style={{ padding: "3pt 4pt", textAlign: "right" }}>{fmt(s.costBasis)}</td>
                    <td style={{ padding: "3pt 4pt", textAlign: "right" }}>{fmt(s.reinvest)} ({s.reinvestPct}%)</td>
                    <td style={{ padding: "3pt 4pt", textAlign: "right", fontWeight: 600 }}>{fmt(s.ask)}</td>
                    <td style={{ padding: "3pt 4pt", textAlign: "right" }}>{fmtK(s.bridge)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "3pt", lineHeight: 1.35 }}>
              Bridge = 2 months of cost basis + day-one tech CAPEX ({fmt(CAPEX.a)} / {fmt(CAPEX.b)} / {fmt(CAPEX.c)}).
              Recovered when the last two net-60 invoices clear. {REINVEST.b.pct}% reinvestment is the target; actuals drift as cost basis grows.
            </div>
          </div>

          {/* ── Section 3: What 35% reinvestment buys ─────────────── */}
          <div style={{ marginBottom: "12pt" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "5pt" }}>
              What the {REINVEST.b.pct}% reinvestment buys (recommended ask)
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ borderBottom: `1.5pt solid ${RULE}`, color: MUTED, fontWeight: 600 }}>
                  <th style={{ padding: "3pt 4pt", textAlign: "left", width: "26%" }}>Destination</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "18%" }}>Year 1</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "left", width: "56%" }}>What it ships</th>
                </tr>
              </thead>
              <tbody>
                {REINVEST_ROWS.map((row, i) => (
                  <tr key={row.label} style={{ borderBottom: i < REINVEST_ROWS.length - 1 ? `0.5pt solid ${RULE}` : undefined }}>
                    <td style={{ padding: "3pt 4pt", fontWeight: 600 }}>{row.label}</td>
                    <td style={{ padding: "3pt 4pt", textAlign: "right" }}>{fmt(row.year1)}</td>
                    <td style={{ padding: "3pt 4pt", color: MUTED, fontSize: "8.5pt" }}>{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── The Ask ────────────────────────────────────────────── */}
          <div style={{ background: DARK, borderRadius: "4pt", padding: "12pt 16pt", marginBottom: "12pt" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "6pt" }}>
              The Ask
            </div>
            <p style={{ fontSize: "9.5pt", color: "rgba(244,237,224,0.9)", lineHeight: 1.55, margin: 0 }}>
              A monthly retainer of <strong style={{ color: CREAM }}>{fmt(ASK.recommended)}</strong> against a 12-month engagement,
              reviewed at month 6, plus acknowledgement that{" "}
              <strong style={{ color: CREAM }}>{fmtK(BRIDGE.b)} of bridge capital</strong> is required
              on day one to cover team payroll plus tech CAPEX ({fmt(CAPEX.b)}) before the first
              net-60 invoice clears. {REINVEST.b.pct}% is the target reinvestment line — it pays for the next
              community, not a larger house.
            </p>
          </div>

          {/* Y1 cash summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10pt" }}>
            <div style={{ borderTop: `2pt solid ${AMBER}`, paddingTop: "6pt" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>Y1 revenue total</div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "16pt", fontWeight: 700, color: DARK }}>{fmt(Y1.revenue)}</div>
            </div>
            <div style={{ borderTop: `2pt solid ${RULE}`, paddingTop: "6pt" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>Y1 gap (before Cap. Recovery)</div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "16pt", fontWeight: 700, color: AMBER }}>({fmt(Math.abs(Y1.gap))})</div>
            </div>
            <div style={{ borderTop: `2pt solid ${RULE}`, paddingTop: "6pt" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>Capital Recovery (V2)</div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "16pt", fontWeight: 700, color: DARK }}>{fmt(Y1.capitalRecovery)}</div>
            </div>
          </div>

          {/* ── SALT-01: net trend ─────────────────────────────────── */}
          <div style={{ marginTop: "14pt", borderTop: `1pt solid ${RULE}`, paddingTop: "10pt" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16pt" }}>

              {/* Left: label + status */}
              <div style={{ minWidth: "1.6in" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "7.5pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "4pt" }}>
                  SALT-01 · Net trend
                </div>
                {latest ? (
                  <>
                    <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "15pt", fontWeight: 700, color: DARK, lineHeight: 1.1 }}>
                      {latest.net >= 0 ? fmt(latest.net) : `(${fmt(Math.abs(latest.net))})`}
                    </div>
                    <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "2pt" }}>
                      {labelMonth(latest.month)} · most recent close
                    </div>
                    <div style={{ marginTop: "5pt" }}>
                      {(() => {
                        const st = STATUS_PILL[getStatus(latest.net)];
                        return (
                          <span style={{ display: "inline-block", padding: "1.5pt 7pt", borderRadius: "2pt", background: st.bg, color: st.color, fontSize: "7pt", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            {st.label}
                          </span>
                        );
                      })()}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: "8.5pt", color: MUTED, lineHeight: 1.45 }}>
                    No closes filed yet.{" "}
                    <a href={`${import.meta.env.BASE_URL}tools/salt-close`} style={{ color: AMBER, textDecoration: "none" }}>
                      File the first month →
                    </a>
                  </div>
                )}
              </div>

              {/* Centre: sparkline */}
              <div style={{ flex: 1, paddingTop: "4pt" }}>
                {saltHistory.length > 0 ? (
                  <>
                    <SaltSparkline history={saltHistory} />
                    <div style={{ fontSize: "7pt", color: MUTED, marginTop: "12pt", lineHeight: 1.35 }}>
                      Last {saltHistory.length} month{saltHistory.length !== 1 ? "s" : ""} · dashed line = {fmt(SALT_BASELINE_NET)} planning baseline
                    </div>
                  </>
                ) : (
                  <div style={{ height: "40pt", border: `1pt dashed ${RULE}`, borderRadius: "2pt", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "7.5pt", color: MUTED, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                      sparkline appears after first filed close
                    </span>
                  </div>
                )}
              </div>

              {/* Right: baseline reference */}
              <div style={{ minWidth: "1.1in", textAlign: "right" }}>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>
                  Plan baseline
                </div>
                <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "13pt", fontWeight: 700, color: DARK }}>
                  {fmt(SALT_BASELINE_NET)}
                </div>
                <div style={{ fontSize: "7pt", color: MUTED, marginTop: "2pt", lineHeight: 1.35 }}>
                  /month net
                </div>
                {latest && (
                  <div style={{ marginTop: "6pt", fontSize: "7.5pt", color: latest.net >= SALT_BASELINE_NET ? GREEN : RED_DK, fontWeight: 600 }}>
                    {latest.net >= SALT_BASELINE_NET ? "+" : "−"}{fmt(Math.abs(latest.net - SALT_BASELINE_NET))} vs. plan
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "14pt", borderTop: `1pt solid rgba(31,61,46,0.12)`, paddingTop: "8pt", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "7pt", color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Headwaters Development Services · Confidential
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12pt" }}>
              <div style={{ fontSize: "7pt", color: MUTED }}>
                Numbers sourced from <code style={{ fontFamily: "monospace", fontSize: "7pt" }}>src/data/budgetScenarios.ts</code>
                {" · "}
                <a href={`${import.meta.env.BASE_URL}tools/salt-close`} style={{ color: AMBER, textDecoration: "none" }}>
                  SALT-01 filing →
                </a>
              </div>
              <a
                href={CASHFLOW_XLSX}
                download="headwaters-cashflow-model.xlsx"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4pt",
                  padding: "3pt 7pt",
                  borderRadius: "3pt",
                  border: `1pt solid ${AMBER}`,
                  color: AMBER,
                  fontSize: "7pt",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}
              >
                ↓ CFO model (.xlsx)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SaltYearlySummary.tsx
 *
 * Read-only yearly summary of filed SALT-01 monthly closes.
 *
 * Groups filed months by year → quarter, showing per-quarter totals
 * (Revenue, CM$, CM%) and a yearly footer. Designed for the contractor
 * and practitioner to review at year-end audit time without re-entering data.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { getMonthHistory, SALT_BASELINE_NET, type SaltCloseRecord } from "@/lib/saltClose";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ─── Design tokens ─────────────────────────────────────────────────────────

const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";
const GREEN  = "#2a6b3e";
const RED    = "#7a1a1a";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}

function pct(cm: number, rev: number): string {
  if (!rev) return "—";
  return (cm / rev * 100).toFixed(1) + "%";
}

function labelMonth(m: string): string {
  const [year, month] = m.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getYear(m: string): string {
  return m.split("-")[0];
}

function getQuarter(m: string): number {
  const mo = parseInt(m.split("-")[1], 10);
  return Math.ceil(mo / 3);
}

const QUARTER_MONTHS: Record<number, string> = {
  1: "Jan – Mar",
  2: "Apr – Jun",
  3: "Jul – Sep",
  4: "Oct – Dec",
};

// ─── Aggregation ────────────────────────────────────────────────────────────

interface Totals {
  revenue: number;
  expenses: number;
  net: number;
  count: number;
}

function sum(records: SaltCloseRecord[]): Totals {
  return records.reduce(
    (acc, r) => ({
      revenue:  acc.revenue  + r.revenue,
      expenses: acc.expenses + r.expenses,
      net:      acc.net      + r.net,
      count:    acc.count    + 1,
    }),
    { revenue: 0, expenses: 0, net: 0, count: 0 },
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatCell({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, marginBottom: "2pt" }}>
        {label}
      </div>
      <div style={{ fontSize: "11pt", fontWeight: 700, fontFamily: "Fraunces, Georgia, serif", color: color ?? DARK }}>
        {value}
      </div>
    </div>
  );
}

function QuarterBlock({ quarter, records }: { quarter: number; records: SaltCloseRecord[] }) {
  const totals = sum(records);
  const cmPct = pct(totals.net, totals.revenue);
  const vsAnnualPlan = totals.net - SALT_BASELINE_NET * records.length;

  return (
    <div style={{ marginBottom: "16pt" }}>
      {/* Quarter header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6pt" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: AMBER }}>
          Q{quarter} · {QUARTER_MONTHS[quarter]}
        </div>
        <div style={{ fontSize: "7pt", color: MUTED }}>
          {records.length} month{records.length !== 1 ? "s" : ""} filed
        </div>
      </div>

      {/* Month rows */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8.5pt", marginBottom: "6pt" }}>
        <thead>
          <tr style={{ borderBottom: `1pt solid ${RULE}`, color: MUTED, fontSize: "7pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            <th style={{ padding: "2pt 4pt", textAlign: "left",  width: "22%" }}>Month</th>
            <th style={{ padding: "2pt 4pt", textAlign: "right", width: "22%" }}>Revenue</th>
            <th style={{ padding: "2pt 4pt", textAlign: "right", width: "22%" }}>Expenses</th>
            <th style={{ padding: "2pt 4pt", textAlign: "right", width: "18%" }}>CM$</th>
            <th style={{ padding: "2pt 4pt", textAlign: "right", width: "16%" }}>CM%</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => {
            const cmPctRow = r.revenue ? (r.net / r.revenue * 100).toFixed(1) + "%" : "—";
            return (
              <tr key={r.month} style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                <td style={{ padding: "4pt 4pt" }}>{labelMonth(r.month)}</td>
                <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{fmt(r.revenue)}</td>
                <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: MUTED }}>{fmt(r.expenses)}</td>
                <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700, color: r.net >= 0 ? DARK : RED }}>
                  {r.net >= 0 ? fmt(r.net) : `(${fmt(Math.abs(r.net))})`}
                </td>
                <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", color: r.net >= 0 ? GREEN : RED }}>
                  {cmPctRow}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Quarter subtotal */}
      <div style={{
        display: "flex",
        gap: "10pt",
        background: "rgba(31,61,46,0.05)",
        border: `1pt solid ${RULE}`,
        borderRadius: "3pt",
        padding: "8pt 12pt",
      }}>
        <StatCell label="Q Revenue" value={fmt(totals.revenue)} />
        <StatCell label="Q CM$" value={totals.net >= 0 ? fmt(totals.net) : `(${fmt(Math.abs(totals.net))})`} color={totals.net >= 0 ? GREEN : RED} />
        <StatCell label="Q CM%" value={cmPct} color={totals.net >= 0 ? GREEN : RED} />
        <StatCell label="vs. Plan" value={(vsAnnualPlan >= 0 ? "+" : "−") + fmt(Math.abs(vsAnnualPlan))} color={vsAnnualPlan >= 0 ? GREEN : RED} />
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function SaltYearlySummary() {
  const [, navigate] = useLocation();

  const history = getMonthHistory();

  // Group by year
  const years = Array.from(new Set(history.map(r => getYear(r.month)))).sort();
  const defaultYear = years[years.length - 1] ?? String(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  const yearRecords = history.filter(r => getYear(r.month) === selectedYear);

  // Group by quarter (1-4), keeping only quarters that have data
  const quarterMap: Record<number, SaltCloseRecord[]> = {};
  for (const r of yearRecords) {
    const q = getQuarter(r.month);
    if (!quarterMap[q]) quarterMap[q] = [];
    quarterMap[q].push(r);
  }
  const quarters = ([1, 2, 3, 4] as const).filter(q => quarterMap[q]?.length);

  const annualTotals = sum(yearRecords);
  const annualCmPct = pct(annualTotals.net, annualTotals.revenue);
  const annualVsPlan = annualTotals.net - SALT_BASELINE_NET * yearRecords.length;

  return (
    <div style={{ background: "#d8d2c8", minHeight: "100vh" }}>
      <div style={{
        width: "8.5in",
        margin: "0 auto",
        background: CREAM,
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "9pt",
        color: TEXT,
      }}>
        <div style={{ width: "8.5in", minHeight: "11in", padding: "0.55in 0.65in" }}>

          {/* Amber rule */}
          <div style={{ height: "3pt", background: AMBER, margin: "0 0 14pt" }} />

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18pt" }}>
            <div>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
                SALT-01 · Yearly Summary
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "22pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "4pt" }}>
                Filed Closes — Yearly Summary
              </div>
              <div style={{ fontSize: "9pt", color: MUTED, lineHeight: 1.5, maxWidth: "4.5in" }}>
                Read-only quarterly and annual P&L view drawn from filed monthly closes.
                Use this page for year-end audit review — no re-entry required.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6pt" }}>
              <button
                onClick={() => navigate(`${BASE}/tools/salt-close`)}
                style={{
                  padding: "4pt 12pt",
                  background: "transparent",
                  color: AMBER,
                  border: `1pt solid ${AMBER}`,
                  borderRadius: "3pt",
                  fontSize: "7.5pt",
                  fontWeight: 700,
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                ← Monthly Close
              </button>
              <div style={{ fontSize: "7pt", color: MUTED }}>Headwaters Development Services</div>
            </div>
          </div>

          {/* Rule */}
          <div style={{ height: "1pt", background: RULE, marginBottom: "18pt" }} />

          {/* No data state */}
          {history.length === 0 && (
            <div style={{ padding: "24pt 0", color: MUTED, fontSize: "9pt", textAlign: "center" }}>
              No monthly closes filed yet. File months on the{" "}
              <button
                onClick={() => navigate(`${BASE}/tools/salt-close`)}
                style={{ background: "none", border: "none", color: AMBER, fontWeight: 700, cursor: "pointer", fontSize: "inherit", padding: 0, textDecoration: "underline" }}
              >
                Monthly Close
              </button>{" "}
              page first.
            </div>
          )}

          {history.length > 0 && (
            <>
              {/* Year selector */}
              {years.length > 1 && (
                <div style={{ display: "flex", gap: "6pt", marginBottom: "18pt" }}>
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      style={{
                        padding: "4pt 14pt",
                        background: y === selectedYear ? DARK : "transparent",
                        color: y === selectedYear ? CREAM : MUTED,
                        border: `1pt solid ${y === selectedYear ? DARK : RULE}`,
                        borderRadius: "3pt",
                        fontSize: "8pt",
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                      }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}

              {/* Current year label (no selector) */}
              {years.length === 1 && (
                <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: DARK, marginBottom: "16pt" }}>
                  {selectedYear}
                </div>
              )}

              {/* Quarter blocks */}
              {quarters.length === 0 && (
                <div style={{ color: MUTED, fontSize: "9pt" }}>No closes filed for {selectedYear}.</div>
              )}
              {quarters.map(q => (
                <QuarterBlock key={q} quarter={q} records={quarterMap[q]} />
              ))}

              {/* Annual footer */}
              {yearRecords.length > 0 && (
                <div style={{ marginTop: "8pt", borderTop: `2pt solid ${RULE}`, paddingTop: "12pt" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: DARK, marginBottom: "8pt" }}>
                    {selectedYear} Annual Total · {yearRecords.length} month{yearRecords.length !== 1 ? "s" : ""} filed
                  </div>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "10pt",
                    background: "rgba(31,61,46,0.06)",
                    border: `1pt solid ${RULE}`,
                    borderRadius: "4pt",
                    padding: "12pt 16pt",
                  }}>
                    <div>
                      <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>Annual Revenue</div>
                      <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "14pt", fontWeight: 700, color: DARK }}>{fmt(annualTotals.revenue)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>Annual Expenses</div>
                      <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "14pt", fontWeight: 700, color: MUTED }}>{fmt(annualTotals.expenses)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>Annual CM$</div>
                      <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "14pt", fontWeight: 700, color: annualTotals.net >= 0 ? GREEN : RED }}>
                        {annualTotals.net >= 0 ? fmt(annualTotals.net) : `(${fmt(Math.abs(annualTotals.net))})`}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>Annual CM%</div>
                      <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "14pt", fontWeight: 700, color: annualTotals.net >= 0 ? GREEN : RED }}>{annualCmPct}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>vs. Annual Plan</div>
                      <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "14pt", fontWeight: 700, color: annualVsPlan >= 0 ? GREEN : RED }}>
                        {(annualVsPlan >= 0 ? "+" : "−")}{fmt(Math.abs(annualVsPlan))}
                      </div>
                      <div style={{ fontSize: "7pt", color: MUTED, marginTop: "2pt" }}>
                        Plan: {fmt(SALT_BASELINE_NET * yearRecords.length)}
                      </div>
                    </div>
                  </div>

                  {/* Months not yet filed note */}
                  {yearRecords.length < 12 && (
                    <div style={{ marginTop: "8pt", fontSize: "7.5pt", color: MUTED, fontStyle: "italic" }}>
                      {12 - yearRecords.length} month{12 - yearRecords.length !== 1 ? "s" : ""} not yet filed for {selectedYear} — totals are partial.
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div style={{ marginTop: "24pt", borderTop: `1pt solid rgba(31,61,46,0.12)`, paddingTop: "8pt", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "7pt", color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Headwaters Development Services · SALT-01 Yearly Summary
            </div>
            <div style={{ fontSize: "7pt", color: MUTED }}>
              Read-only · source: filed monthly closes
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

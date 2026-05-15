/**
 * SaltMonthlyClose.tsx
 *
 * Bookkeeper filing tool for the SALT-01 cost-centre monthly close.
 *
 * Each submission stamps an immutable per-month record in localStorage
 * (keyed by the Month field). Prior months are never overwritten — only
 * the record for the selected month is updated on re-submit.
 *
 * Reset clears ALL history and returns the one-pager block to baseline.
 */

import { useState, useEffect } from "react";
import {
  saveMonthClose,
  getMonthHistory,
  resetAllCloses,
  getStatus,
  SALT_BASELINE_NET,
  type SaltCloseRecord,
} from "@/lib/saltClose";

const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";
const GREEN  = "#2a6b3e";
const YELLOW = "#7a5c00";
const RED    = "#7a1a1a";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  healthy: { bg: "rgba(42,107,62,0.10)", color: GREEN,  label: "Healthy" },
  watch:   { bg: "rgba(122,92,0,0.10)",  color: YELLOW, label: "Watch"   },
  below:   { bg: "rgba(122,26,26,0.10)", color: RED,    label: "Below"   },
};

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function labelMonth(m: string): string {
  const [year, month] = m.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function currentMonthStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function SaltMonthlyClose() {
  const [month,    setMonth]    = useState(currentMonthStr());
  const [revenue,  setRevenue]  = useState("");
  const [expenses, setExpenses] = useState("");
  const [note,     setNote]     = useState("");
  const [history,  setHistory]  = useState<SaltCloseRecord[]>([]);
  const [saved,    setSaved]    = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setHistory(getMonthHistory());
  }, []);

  const net = (parseFloat(revenue) || 0) - (parseFloat(expenses) || 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!month || !revenue) return;
    saveMonthClose(month, parseFloat(revenue) || 0, parseFloat(expenses) || 0, note);
    setHistory(getMonthHistory());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setNote("");
  }

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetAllCloses();
    setHistory([]);
    setConfirmReset(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "5pt 8pt",
    border: `1pt solid ${RULE}`,
    borderRadius: "3pt",
    fontSize: "9pt",
    fontFamily: "Inter, system-ui, sans-serif",
    color: TEXT,
    background: "#fff",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "7pt",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: "3pt",
  };

  return (
    <div style={{ background: "#d8d2c8", minHeight: "100vh" }}>
      <div
        style={{
          width: "8.5in",
          margin: "0 auto",
          background: CREAM,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "9pt",
          color: TEXT,
        }}
      >
        <div style={{ width: "8.5in", minHeight: "11in", padding: "0.55in 0.65in" }}>

          {/* Amber rule */}
          <div style={{ height: "3pt", background: AMBER, margin: "0 0 14pt" }} />

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18pt" }}>
            <div>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
                SALT-01 · Monthly Close
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "22pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "4pt" }}>
                Salt Cost-Centre Filing
              </div>
              <div style={{ fontSize: "9pt", color: MUTED, lineHeight: 1.5, maxWidth: "4.5in" }}>
                File each month's salt revenue and direct expenses. Each submission
                stamps an immutable record keyed by month — prior months are never
                overwritten. The one-pager reads this history automatically.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Bookkeeper</div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>Headwaters Development Services</div>
            </div>
          </div>

          {/* Rule */}
          <div style={{ height: "1pt", background: RULE, marginBottom: "18pt" }} />

          {/* Filing form */}
          <div style={{ marginBottom: "20pt" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "12pt" }}>
              File a month
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12pt", marginBottom: "12pt" }}>
                <div>
                  <label style={labelStyle}>Month</label>
                  <input
                    type="month"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Salt Revenue ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 3200"
                    value={revenue}
                    onChange={e => setRevenue(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Direct Expenses ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 1100"
                    value={expenses}
                    onChange={e => setExpenses(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12pt", marginBottom: "12pt", alignItems: "end" }}>
                <div>
                  <label style={labelStyle}>Note (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. low inventory mid-month; back orders resolved"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Net preview */}
                {revenue && (
                  <div style={{ padding: "5pt 8pt", background: "rgba(31,61,46,0.05)", border: `1pt solid ${RULE}`, borderRadius: "3pt" }}>
                    <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: "2pt" }}>
                      Net preview
                    </div>
                    <div style={{ fontSize: "13pt", fontWeight: 700, color: net >= 0 ? DARK : RED, fontFamily: "Fraunces, Georgia, serif" }}>
                      {net >= 0 ? fmt(net) : `(${fmt(Math.abs(net))})`}
                    </div>
                    <div style={{ fontSize: "7.5pt", color: MUTED }}>
                      vs. {fmt(SALT_BASELINE_NET)} baseline
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10pt", alignItems: "center" }}>
                <button
                  type="submit"
                  style={{
                    padding: "6pt 18pt",
                    background: AMBER,
                    color: CREAM,
                    border: "none",
                    borderRadius: "3pt",
                    fontSize: "8pt",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                  }}
                >
                  {saved ? "Filed ✓" : "File this month"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: "6pt 14pt",
                    background: "transparent",
                    color: confirmReset ? RED : MUTED,
                    border: `1pt solid ${confirmReset ? RED : RULE}`,
                    borderRadius: "3pt",
                    fontSize: "8pt",
                    fontWeight: confirmReset ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {confirmReset ? "Confirm reset — clears all history" : "Reset all"}
                </button>
                {confirmReset && (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    style={{ fontSize: "8pt", color: MUTED, background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* History table */}
          <div style={{ marginBottom: "18pt" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "8pt" }}>
              Filed months ({history.length})
            </div>

            {history.length === 0 ? (
              <div style={{ padding: "14pt 0", color: MUTED, fontSize: "9pt" }}>
                No months filed yet. Use the form above to record the first close.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt" }}>
                <thead>
                  <tr style={{ borderBottom: `1.5pt solid ${RULE}`, color: MUTED, fontWeight: 600, fontSize: "7.5pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    <th style={{ padding: "3pt 4pt", textAlign: "left", width: "13%" }}>Month</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "right", width: "15%" }}>Revenue</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "right", width: "15%" }}>Expenses</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "right", width: "14%" }}>Net</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "right", width: "12%" }}>vs. Plan</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "center", width: "11%" }}>Status</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "left", width: "20%" }}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map((rec) => {
                    const st = STATUS_STYLES[getStatus(rec.net)];
                    const delta = rec.net - SALT_BASELINE_NET;
                    return (
                      <tr key={rec.month} style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                        <td style={{ padding: "4pt 4pt", fontWeight: 600 }}>{labelMonth(rec.month)}</td>
                        <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", tabularNums: true } as React.CSSProperties}>{fmt(rec.revenue)}</td>
                        <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{fmt(rec.expenses)}</td>
                        <td style={{ padding: "4pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: rec.net >= 0 ? DARK : RED }}>
                          {rec.net >= 0 ? fmt(rec.net) : `(${fmt(Math.abs(rec.net))})`}
                        </td>
                        <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", color: delta >= 0 ? GREEN : RED }}>
                          {delta >= 0 ? "+" : "−"}{fmt(Math.abs(delta))}
                        </td>
                        <td style={{ padding: "4pt 4pt", textAlign: "center" }}>
                          <span style={{ display: "inline-block", padding: "1pt 6pt", borderRadius: "2pt", background: st.bg, color: st.color, fontSize: "7pt", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding: "4pt 4pt", color: MUTED, fontSize: "8pt" }}>{rec.note ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Planning reference */}
          <div style={{ background: "rgba(31,61,46,0.05)", border: `1pt solid ${RULE}`, borderRadius: "3pt", padding: "10pt 14pt" }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "6pt" }}>
              Planning reference — SALT-01
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10pt" }}>
              {[
                { label: "Baseline net / month", value: fmt(SALT_BASELINE_NET), detail: "Planning assumption net after direct costs" },
                { label: "Watch threshold", value: fmt(Math.round(SALT_BASELINE_NET * 0.7)), detail: "70 % of baseline — trigger a note" },
                { label: "Below threshold", value: `< ${fmt(Math.round(SALT_BASELINE_NET * 0.7))}`, detail: "Below 70 % — flag on the one-pager" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: "2pt" }}>{s.label}</div>
                  <div style={{ fontSize: "12pt", fontWeight: 700, color: DARK, fontFamily: "Fraunces, Georgia, serif", marginBottom: "2pt" }}>{s.value}</div>
                  <div style={{ fontSize: "8pt", color: MUTED, lineHeight: 1.4 }}>{s.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "18pt", borderTop: `1pt solid rgba(31,61,46,0.12)`, paddingTop: "8pt", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "7pt", color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Headwaters Development Services · SALT-01 Monthly Close
            </div>
            <div style={{ fontSize: "7pt", color: MUTED }}>
              History stored locally — export via one-pager print
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

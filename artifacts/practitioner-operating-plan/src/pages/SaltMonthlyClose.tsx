/**
 * SaltMonthlyClose.tsx
 *
 * Bookkeeper filing tool for the SALT-01 cost-centre monthly close.
 *
 * Flow:
 *  1. Paste Square / Shopify / Cash export text into the Paste Import panel.
 *     Switch sources with the toggle; each source is tracked independently.
 *  2. Click Parse → preview rows → Apply all or Apply diff only.
 *     "Apply diff only" is only enabled when a snapshot for the SAME month
 *     already exists — changing the Month field automatically scopes to a
 *     fresh slate, preventing cross-month diff contamination.
 *  3. Applying pre-fills the Salt Revenue field.
 *  4. File the month — stamps an immutable per-month record in localStorage.
 *
 * Snapshot scoping (Task #91):
 *   Keys include the close month: `...:snapshot:<source>:<YYYY-MM>`.
 *   Switching months returns null from loadSnapshot, so the diff column
 *   and Apply diff only button are automatically dormant until the
 *   bookkeeper applies a first baseline for that month.
 *
 * Delta annotations (Task #90):
 *   Hidden in print via print:hidden — the printed close shows only the
 *   resulting numbers, not the diff trail.
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  saveMonthClose,
  getMonthHistory,
  resetAllCloses,
  getStatus,
  SALT_BASELINE_NET,
  buildCSV,
  parseImportedJSON,
  mergeCloses,
  replaceCloses,
  type SaltCloseRecord,
} from "@/lib/saltClose";
import {
  computePriorChain,
  channelMonthMetrics,
  autoPrevQuarterUnder,
} from "@/lib/saltRollup";
import { currentQuarterId } from "@/lib/storage";
import {
  parsePaste,
  loadSnapshot,
  saveSnapshot,
  clearAllSnapshots,
  diffRows,
  SOURCE_META,
  SOURCE_LABELS,
  type ImportSource,
  type SnapshotRow,
  type AppliedSnapshot,
} from "@/lib/saltImports";

// ─── Design tokens ────────────────────────────────────────────────────────────

const CREAM        = "#f4ede0";
const DARK         = "#1f3d2e";
const AMBER        = "#b85a3e";
const MUTED        = "#6b7665";
const RULE         = "#c8bfa7";
const TEXT         = "#2a2520";
const GREEN        = "#2a6b3e";
const YELLOW       = "#7a5c00";
const RED          = "#7a1a1a";
const DELTA_POS_BG = "rgba(42,107,62,0.10)";
const DELTA_NEG_BG = "rgba(122,26,26,0.10)";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  healthy: { bg: "rgba(42,107,62,0.10)", color: GREEN,  label: "Healthy" },
  watch:   { bg: "rgba(122,92,0,0.10)",  color: YELLOW, label: "Watch"   },
  below:   { bg: "rgba(122,26,26,0.10)", color: RED,    label: "Below"   },
};

// ─── Formatting helpers ───────────────────────────────────────────────────────

function fmt(n: number): string {
  return "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}

function fmtDelta(n: number): string {
  const sign = n >= 0 ? "+" : "−";
  return `${sign}${fmt(n)}`;
}

function fmtExact(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

// ─── Shared input styles ──────────────────────────────────────────────────────

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

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ─── PastePanel component ─────────────────────────────────────────────────────

const SOURCES: ImportSource[] = ["square", "shopify", "cash"];

type ImportMode = "merge" | "replace";

interface PastePanelProps {
  month: string;
  onApply: (total: number) => void;
}

function PastePanel({ month, onApply }: PastePanelProps) {
  const [source,    setSource]    = useState<ImportSource>("square");
  const [pasteText, setPasteText] = useState("");
  const [parsed,    setParsed]    = useState<SnapshotRow[] | null>(null);
  const [snapshot,  setSnapshot]  = useState<AppliedSnapshot | null>(null);
  const [applied,   setApplied]   = useState<"all" | "diff" | null>(null);

  // Reload snapshot whenever month or source changes.
  useEffect(() => {
    setSnapshot(loadSnapshot(source, month));
    setParsed(null);
    setPasteText("");
    setApplied(null);
  }, [source, month]);

  function handleParse() {
    const rows = parsePaste(pasteText);
    setParsed(rows);
    setApplied(null);
  }

  function handleApplyAll() {
    if (!parsed) return;
    saveSnapshot(source, month, parsed);
    setSnapshot(loadSnapshot(source, month));
    const total = parsed.reduce((s, r) => s + r.amount, 0);
    onApply(total);
    setApplied("all");
  }

  function handleApplyDiff() {
    if (!parsed || !snapshot) return;
    const newRows = diffRows(parsed, snapshot);
    const combined = [...snapshot.rows, ...newRows];
    saveSnapshot(source, month, combined);
    setSnapshot(loadSnapshot(source, month));
    const delta = newRows.reduce((s, r) => s + r.amount, 0);
    onApply((snapshot.total ?? 0) + delta);
    setApplied("diff");
  }

  const meta         = SOURCE_META[source];
  const newRows      = parsed ? diffRows(parsed, snapshot) : [];
  const parsedTotal  = parsed ? parsed.reduce((s, r) => s + r.amount, 0) : 0;
  const deltaTotal   = newRows.reduce((s, r) => s + r.amount, 0);
  const canDiff      = !!snapshot && !!parsed && newRows.length > 0;

  return (
    <div style={{ marginBottom: "20pt", border: `1pt solid ${RULE}`, borderRadius: "4pt", padding: "14pt 16pt", background: "rgba(31,61,46,0.03)" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "12pt" }}>
        Channel import
      </div>

      {/* Source selector */}
      <div style={{ display: "flex", gap: "8pt", marginBottom: "10pt", alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ ...labelStyle, marginBottom: 0 }}>Source</span>
        {SOURCES.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => setSource(src)}
            style={{
              padding: "3pt 10pt",
              fontSize: "8pt",
              fontWeight: source === src ? 700 : 400,
              background: source === src ? AMBER : "transparent",
              color: source === src ? CREAM : MUTED,
              border: `1pt solid ${source === src ? AMBER : RULE}`,
              borderRadius: "3pt",
              cursor: "pointer",
            }}
          >
            {SOURCE_LABELS[src]}
          </button>
        ))}

        {/* Snapshot badge */}
        {snapshot && (
          <span style={{ marginLeft: "auto", fontSize: "7.5pt", color: GREEN, background: "rgba(42,107,62,0.08)", border: `1pt solid rgba(42,107,62,0.25)`, borderRadius: "3pt", padding: "2pt 8pt" }}>
            Snapshot: {fmtExact(snapshot.total)} · {snapshot.rows.length} row{snapshot.rows.length !== 1 ? "s" : ""} · {labelMonth(snapshot.month)}
          </span>
        )}
      </div>

      {/* Source hint */}
      <div style={{ fontSize: "7pt", color: MUTED, lineHeight: 1.4, marginBottom: "8pt" }}>
        {meta.hint}
      </div>

      {/* Paste area */}
      <div style={{ marginBottom: "10pt" }}>
        <label style={labelStyle}>Paste {meta.label} export (TSV / CSV)</label>
        <textarea
          value={pasteText}
          onChange={(e) => { setPasteText(e.target.value); setParsed(null); setApplied(null); }}
          placeholder={meta.placeholder}
          rows={source === "cash" ? 2 : 5}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "7.5pt" }}
        />
      </div>

      {/* Parse button */}
      <div style={{ display: "flex", gap: "8pt", alignItems: "center", marginBottom: "10pt" }}>
        <button
          type="button"
          onClick={handleParse}
          disabled={!pasteText.trim()}
          style={{
            padding: "4pt 14pt",
            background: DARK,
            color: CREAM,
            border: "none",
            borderRadius: "3pt",
            fontSize: "8pt",
            fontWeight: 600,
            cursor: pasteText.trim() ? "pointer" : "not-allowed",
            opacity: pasteText.trim() ? 1 : 0.45,
          }}
        >
          Parse
        </button>
        {pasteText.trim() && !parsed && (
          <span style={{ fontSize: "7.5pt", color: MUTED }}>Click Parse to preview rows and diff.</span>
        )}
      </div>

      {/* Parsed preview + diff */}
      {parsed !== null && (
        <div style={{ marginBottom: "10pt" }}>
          {parsed.length === 0 ? (
            <div style={{ fontSize: "8pt", color: RED, padding: "6pt 0" }}>
              No numeric amounts found in the pasted text. Check the format and try again.
            </div>
          ) : (
            <>
              {/* Summary strip */}
              <div style={{ display: "flex", gap: "14pt", marginBottom: "8pt", padding: "6pt 10pt", background: "rgba(31,61,46,0.06)", borderRadius: "3pt", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED }}>Parsed total</div>
                  <div style={{ fontSize: "11pt", fontWeight: 700, color: DARK, fontFamily: "Fraunces, Georgia, serif" }}>{fmtExact(parsedTotal)}</div>
                  <div style={{ fontSize: "7pt", color: MUTED }}>{parsed.length} row{parsed.length !== 1 ? "s" : ""}</div>
                </div>

                {snapshot && (
                  <>
                    <div style={{ width: "1pt", background: RULE, alignSelf: "stretch" }} />
                    <div>
                      <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED }}>Prior snapshot</div>
                      <div style={{ fontSize: "11pt", fontWeight: 700, color: MUTED, fontFamily: "Fraunces, Georgia, serif" }}>{fmtExact(snapshot.total)}</div>
                      <div style={{ fontSize: "7pt", color: MUTED }}>{snapshot.rows.length} row{snapshot.rows.length !== 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ width: "1pt", background: RULE, alignSelf: "stretch" }} />
                    <div>
                      <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: newRows.length > 0 ? GREEN : MUTED }}>
                        Δ new rows
                      </div>
                      <div style={{
                        fontSize: "11pt",
                        fontWeight: 700,
                        fontFamily: "Fraunces, Georgia, serif",
                        color: newRows.length > 0 ? GREEN : MUTED,
                        background: newRows.length > 0 ? DELTA_POS_BG : "transparent",
                        padding: newRows.length > 0 ? "0 4pt" : "0",
                        borderRadius: "2pt",
                      }}>
                        {newRows.length > 0 ? fmtDelta(deltaTotal) : "—"}
                      </div>
                      <div style={{ fontSize: "7pt", color: newRows.length > 0 ? GREEN : MUTED }}>
                        {newRows.length} new row{newRows.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Row table (first 10) */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "7.5pt", marginBottom: "8pt" }}>
                <thead>
                  <tr style={{ borderBottom: `1pt solid ${RULE}`, color: MUTED, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    <th style={{ padding: "2pt 4pt", textAlign: "left", width: "60%" }}>Row</th>
                    <th style={{ padding: "2pt 4pt", textAlign: "right", width: "20%" }}>Amount</th>
                    <th style={{ padding: "2pt 4pt", textAlign: "center", width: "20%" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.slice(0, 10).map((row) => {
                    const isNew = snapshot ? !snapshot.rows.some((s) => s.id === row.id) : true;
                    return (
                      <tr key={row.id} style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                        <td style={{ padding: "2pt 4pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: TEXT, maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {row.raw}
                        </td>
                        <td style={{ padding: "2pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                          {fmtExact(row.amount)}
                        </td>
                        <td style={{ padding: "2pt 4pt", textAlign: "center" }}>
                          {snapshot ? (
                            <span style={{
                              display: "inline-block",
                              padding: "1pt 6pt",
                              borderRadius: "2pt",
                              fontSize: "7pt",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              background: isNew ? DELTA_POS_BG : "rgba(31,61,46,0.05)",
                              color: isNew ? GREEN : MUTED,
                            }}>
                              {isNew ? "new" : "seen"}
                            </span>
                          ) : (
                            <span style={{ color: MUTED, fontSize: "7pt" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {parsed.length > 10 && (
                <div style={{ fontSize: "7.5pt", color: MUTED, marginBottom: "8pt" }}>
                  + {parsed.length - 10} more row{parsed.length - 10 !== 1 ? "s" : ""} not shown
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "8pt", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleApplyAll}
                  style={{
                    padding: "5pt 14pt",
                    background: AMBER,
                    color: CREAM,
                    border: "none",
                    borderRadius: "3pt",
                    fontSize: "8pt",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {applied === "all" ? "Applied ✓" : "Apply all"}
                </button>

                <button
                  type="button"
                  onClick={handleApplyDiff}
                  disabled={!canDiff}
                  title={
                    !snapshot
                      ? "No snapshot for this month yet — use Apply all first"
                      : newRows.length === 0
                      ? "No new rows found vs the snapshot"
                      : `Apply ${newRows.length} new row${newRows.length !== 1 ? "s" : ""} (${fmtDelta(deltaTotal)})`
                  }
                  style={{
                    padding: "5pt 14pt",
                    background: canDiff ? DARK : "transparent",
                    color: canDiff ? CREAM : MUTED,
                    border: `1pt solid ${canDiff ? DARK : RULE}`,
                    borderRadius: "3pt",
                    fontSize: "8pt",
                    fontWeight: canDiff ? 600 : 400,
                    cursor: canDiff ? "pointer" : "not-allowed",
                    opacity: canDiff ? 1 : 0.55,
                  }}
                >
                  {applied === "diff" ? "Diff applied ✓" : "Apply diff only"}
                </button>

                {!snapshot && parsed.length > 0 && (
                  <span style={{ fontSize: "7.5pt", color: MUTED }}>
                    No snapshot for {labelMonth(month)} yet — "Apply diff only" becomes available after the first apply.
                  </span>
                )}
                {snapshot && newRows.length === 0 && parsed.length > 0 && (
                  <span style={{ fontSize: "7.5pt", color: MUTED }}>
                    All rows already in the snapshot — nothing new to diff.
                  </span>
                )}
              </div>

              {/* Delta annotation strip (shown after a diff apply) */}
              {applied === "diff" && deltaTotal !== 0 && (
                <div className="print:hidden" style={{ marginTop: "8pt", padding: "5pt 9pt", borderRadius: "3pt", background: deltaTotal >= 0 ? DELTA_POS_BG : DELTA_NEG_BG, display: "inline-block", fontSize: "7.5pt", fontWeight: 700, color: deltaTotal >= 0 ? GREEN : RED, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                  Δ {fmtDelta(deltaTotal)} applied to {SOURCE_LABELS[source]}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SaltMonthlyClose() {
  const [, navigate] = useLocation();

  const [month,        setMonth]        = useState(currentMonthStr());
  const [revenue,      setRevenue]      = useState("");
  const [expenses,     setExpenses]     = useState("");
  const [note,         setNote]         = useState("");
  const [history,      setHistory]      = useState<SaltCloseRecord[]>([]);
  const [saved,        setSaved]        = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [fromImport,   setFromImport]   = useState(false);

  useEffect(() => {
    setHistory(getMonthHistory());
  }, []);

  // ── Export / Import state ──────────────────────────────────────────────────
  const [pendingImport, setPendingImport] = useState<SaltCloseRecord[] | null>(null);
  const [importError,   setImportError]   = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // ── Export / Import handlers ───────────────────────────────────────────────
  function handleDownloadCSV() {
    if (history.length === 0) return;
    const csv = buildCSV(history);
    triggerDownload(csv, "text/csv", `salt-closes-${currentMonthStr()}.csv`);
  }

  function handleDownloadJSON() {
    if (history.length === 0) return;
    const json = JSON.stringify(history, null, 2);
    triggerDownload(json, "application/json", `salt-closes-${currentMonthStr()}.json`);
  }

  function triggerDownload(content: string, mime: string, filename: string) {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    setImportError(null);
    importInputRef.current?.click();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        const records = parseImportedJSON(parsed);
        setPendingImport(records);
        setImportError(null);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Could not read the file.");
        setPendingImport(null);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleConfirmImport(mode: ImportMode) {
    if (!pendingImport) return;
    if (mode === "merge") {
      mergeCloses(pendingImport);
    } else {
      replaceCloses(pendingImport);
    }
    setHistory(getMonthHistory());
    setPendingImport(null);
  }

  // ── Filing form ────────────────────────────────────────────────────────────
  const net = (parseFloat(revenue) || 0) - (parseFloat(expenses) || 0);

  const curQId          = currentQuarterId();
  const priorChain      = computePriorChain(history, curQId);
  const priorMetrics    = channelMonthMetrics(priorChain);
  const prevQtrUnder    = autoPrevQuarterUnder(history, curQId, SALT_BASELINE_NET);
  const priorComplete   = priorChain.length === 3;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!month || !revenue) return;
    // Capture applied channel snapshots at filing time for the per-channel CSV export
    const channelData: SaltCloseRecord["channels"] = {};
    for (const src of SOURCES) {
      const applied = channels[src].applied;
      if (applied && applied.net !== 0) {
        channelData[src] = {
          grossSales: applied.grossSales,
          refunds: applied.refunds,
          net: applied.net,
        };
      }
    }
    saveMonthClose(
      month,
      parseFloat(revenue) || 0,
      parseFloat(expenses) || 0,
      note,
      Object.keys(channelData).length > 0 ? channelData : undefined,
    );
    setHistory(getMonthHistory());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setNote("");
    setFromImport(false);
  }

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetAllCloses();
    clearAllSnapshots(month);
    setHistory([]);
    setConfirmReset(false);
    setRevenue("");
    setFromImport(false);
  }

  /** Pre-fill the revenue field from a paste-import apply. */
  function handleImportApply(total: number) {
    setRevenue(total.toFixed(2));
    setFromImport(true);
  }

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
                Paste Square / Shopify / Cash totals into the channel import panel,
                apply the diff, then file the month. Snapshots are scoped to the
                selected month — changing months always starts fresh.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Bookkeeper</div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>Headwaters Development Services</div>
            </div>
          </div>

          {/* Rule */}
          <div style={{ height: "1pt", background: RULE, marginBottom: "18pt" }} />

          {/* Channel import panel (screen-only) */}
          <div className="print:hidden">
            <PastePanel month={month} onApply={handleImportApply} />
          </div>

          {/* ── Filing form ─────────────────────────────────────────────────── */}
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
                    onChange={e => { setMonth(e.target.value); setFromImport(false); }}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Salt Revenue ($)
                    {fromImport && (
                      <span className="print:hidden" style={{ marginLeft: "5pt", fontWeight: 400, color: GREEN, letterSpacing: 0, textTransform: "none" }}>
                        ← from import
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 3200"
                    value={revenue}
                    onChange={e => { setRevenue(e.target.value); setFromImport(false); }}
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
                  {confirmReset ? "Confirm reset — clears history + snapshots" : "Reset all"}
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

          {/* ── Filed months history ──────────────────────────────────────── */}
          <div style={{ marginBottom: "18pt" }}>
            {/* Hidden file input for JSON import */}
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: "none" }}
              onChange={handleImportFile}
            />

            {/* Section header + action buttons */}
            <div className="print:hidden" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8pt", flexWrap: "wrap", gap: "6pt" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER }}>
                Filed months ({history.length})
              </div>
              <div style={{ display: "flex", gap: "6pt", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  disabled={history.length === 0}
                  title="Download history as a spreadsheet-ready CSV"
                  style={{
                    padding: "3pt 10pt",
                    background: history.length > 0 ? DARK : RULE,
                    color: CREAM,
                    border: "none",
                    borderRadius: "3pt",
                    fontSize: "7.5pt",
                    fontWeight: 700,
                    cursor: history.length > 0 ? "pointer" : "default",
                    letterSpacing: "0.03em",
                  }}
                >
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  disabled={history.length === 0}
                  title="Download history as a JSON backup"
                  style={{
                    padding: "3pt 10pt",
                    background: "transparent",
                    color: history.length > 0 ? DARK : MUTED,
                    border: `1pt solid ${history.length > 0 ? RULE : RULE}`,
                    borderRadius: "3pt",
                    fontSize: "7.5pt",
                    fontWeight: 600,
                    cursor: history.length > 0 ? "pointer" : "default",
                    letterSpacing: "0.03em",
                  }}
                >
                  Download JSON
                </button>
                <button
                  type="button"
                  onClick={handleImportClick}
                  title="Restore history from a previously exported JSON file"
                  style={{
                    padding: "3pt 10pt",
                    background: "transparent",
                    color: AMBER,
                    border: `1pt solid ${AMBER}`,
                    borderRadius: "3pt",
                    fontSize: "7.5pt",
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "0.03em",
                  }}
                >
                  Import JSON
                </button>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => navigate(`${BASE}/tools/salt-yearly`)}
                    style={{
                      background: "transparent",
                      border: `1pt solid ${AMBER}`,
                      color: AMBER,
                      borderRadius: "3pt",
                      padding: "3pt 10pt",
                      fontSize: "7.5pt",
                      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Yearly summary →
                  </button>
                )}
              </div>
            </div>

            {/* Print-only heading (no buttons) */}
            <div className="hidden print:block" style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "8pt" }}>
              Filed months ({history.length})
            </div>
            </div>

            {/* Import error */}
            {importError && (
              <div style={{ marginBottom: "8pt", padding: "6pt 10pt", background: "rgba(122,26,26,0.08)", border: `1pt solid ${RED}`, borderRadius: "3pt", fontSize: "8pt", color: RED }}>
                Import failed: {importError}
              </div>
            )}

            {/* Merge / Replace prompt */}
            {pendingImport && (
              <div style={{ marginBottom: "10pt", padding: "10pt 14pt", background: "rgba(184,90,62,0.08)", border: `1pt solid ${AMBER}`, borderRadius: "4pt" }}>
                <div style={{ fontSize: "8pt", fontWeight: 700, color: DARK, marginBottom: "6pt" }}>
                  Import {pendingImport.length} record{pendingImport.length !== 1 ? "s" : ""} — how would you like to proceed?
                </div>
                <div style={{ fontSize: "7.5pt", color: MUTED, marginBottom: "10pt", lineHeight: 1.5 }}>
                  <strong>Merge</strong> adds only months not already present, leaving existing records untouched.{" "}
                  <strong>Replace</strong> overwrites all history with the imported file.
                </div>
                <div style={{ display: "flex", gap: "8pt" }}>
                  <button
                    type="button"
                    onClick={() => handleConfirmImport("merge")}
                    style={{
                      padding: "4pt 14pt",
                      background: DARK,
                      color: CREAM,
                      border: "none",
                      borderRadius: "3pt",
                      fontSize: "7.5pt",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Merge
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmImport("replace")}
                    style={{
                      padding: "4pt 14pt",
                      background: AMBER,
                      color: CREAM,
                      border: "none",
                      borderRadius: "3pt",
                      fontSize: "7.5pt",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Replace all
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingImport(null)}
                    style={{
                      padding: "4pt 10pt",
                      background: "transparent",
                      color: MUTED,
                      border: `1pt solid ${RULE}`,
                      borderRadius: "3pt",
                      fontSize: "7.5pt",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {history.length === 0 ? (
              <div style={{ padding: "14pt 0", color: MUTED, fontSize: "9pt" }}>
                No months filed yet. Use the form above to record the first close.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt" }}>
                <thead>
                  <tr style={{ borderBottom: `1.5pt solid ${RULE}`, color: MUTED, fontWeight: 600, fontSize: "7.5pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    <th style={{ padding: "3pt 4pt", textAlign: "left",   width: "13%" }}>Month</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "right",  width: "15%" }}>Revenue</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "right",  width: "15%" }}>Expenses</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "right",  width: "14%" }}>Net</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "right",  width: "12%" }}>vs. Plan</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "center", width: "11%" }}>Status</th>
                    <th style={{ padding: "3pt 4pt", textAlign: "left",   width: "20%" }}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map((rec) => {
                    const st = STATUS_STYLES[getStatus(rec.net)];
                    const delta = rec.net - SALT_BASELINE_NET;
                    return (
                      <tr key={rec.month} style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                        <td style={{ padding: "4pt 4pt", fontWeight: 600 }}>{labelMonth(rec.month)}</td>
                        <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" } as React.CSSProperties}>{fmt(rec.revenue)}</td>
                        <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{fmt(rec.expenses)}</td>
                        <td style={{ padding: "4pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: rec.net >= 0 ? DARK : RED }}>
                          {rec.net >= 0 ? fmt(rec.net) : `(${fmt(Math.abs(rec.net))})`}
                        </td>
                        <td style={{ padding: "4pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", color: delta >= 0 ? GREEN : RED }}>
                          {fmtDelta(delta)}
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

          {/* ── Rule 02 prior-quarter status ────────────────────────────────── */}
          <div style={{ marginBottom: "14pt", border: `1pt solid ${prevQtrUnder ? "#7a1a1a" : priorComplete ? "#2a6b3e" : RULE}`, borderRadius: "3pt", padding: "10pt 14pt", background: prevQtrUnder ? "rgba(122,26,26,0.05)" : priorComplete ? "rgba(42,107,62,0.05)" : "rgba(31,61,46,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8pt" }}>
              <div>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "4pt" }}>
                  Rule 02 — Prior-quarter revenue signal
                </div>
                <div style={{ fontSize: "9pt", color: TEXT, lineHeight: 1.5 }}>
                  {!priorComplete
                    ? `Prior quarter incomplete — ${priorChain.length} of 3 months filed. Cannot determine trigger.`
                    : prevQtrUnder
                    ? `Prior quarter net ${fmtExact(priorMetrics.totalNet)} is below the quarterly floor ${fmtExact(SALT_BASELINE_NET * 3)}. Wholesale reprice / drop trigger is active.`
                    : `Prior quarter net ${fmtExact(priorMetrics.totalNet)} meets the quarterly floor ${fmtExact(SALT_BASELINE_NET * 3)}. Trigger clear.`
                  }
                </div>
              </div>
              <span style={{
                display: "inline-block",
                padding: "2pt 10pt",
                borderRadius: "3pt",
                fontSize: "7pt",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: !priorComplete ? "rgba(31,61,46,0.06)" : prevQtrUnder ? "rgba(122,26,26,0.10)" : "rgba(42,107,62,0.10)",
                color: !priorComplete ? MUTED : prevQtrUnder ? RED : GREEN,
              }}>
                {!priorComplete ? "incomplete" : prevQtrUnder ? "triggered" : "clear"}
              </span>
            </div>
          </div>

          {/* ── Planning reference ─────────────────────────────────────────── */}
          <div style={{ background: "rgba(31,61,46,0.05)", border: `1pt solid ${RULE}`, borderRadius: "3pt", padding: "10pt 14pt" }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "6pt" }}>
              Planning reference — SALT-01
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10pt" }}>
              {[
                { label: "Baseline net / month", value: fmt(SALT_BASELINE_NET), detail: "Planning assumption net after direct costs" },
                { label: "Watch threshold",       value: fmt(Math.round(SALT_BASELINE_NET * 0.7)), detail: "70 % of baseline — trigger a note" },
                { label: "Below threshold",       value: `< ${fmt(Math.round(SALT_BASELINE_NET * 0.7))}`, detail: "Below 70 % — flag on the one-pager" },
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
              History stored locally — use Download CSV / JSON to back up or audit
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

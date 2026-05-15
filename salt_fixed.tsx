/**
 * SaltMonthlyClose.tsx
 *
 * Bookkeeper filing tool for the SALT-01 cost-centre monthly close.
 *
 * Flow:
 *  1. Paste Square / Shopify / Cash export text into the per-channel cards.
 *     Each source card is independent; parse → preview → Apply or Apply diff only.
 *  2. Applying pre-fills the Salt Revenue field (sum of channel nets).
 *  3. File the month — stamps an immutable per-month record in localStorage.
 *
 * Snapshot scoping (Task #91):
 *   Keys include the close month: `...:snapshot:<source>:<YYYY-MM>`.
 *   Switching months returns null from loadSnapshot, so the diff column
 *   and Apply diff only button are automatically dormant until the
 *   bookkeeper applies a first baseline for that month.
 *
 * Delta annotations:
 *  - Appear on channel-table net cells immediately after an apply.
 *  - Persist for the session (cleared only when a new apply lands for
 *    that source, or the page is hard-refreshed).
 *  - Hidden in print via print:hidden — the printed close shows only the
 *    resulting numbers, not the diff trail.
 *
 * Column-rename guard (CSV pastes only):
 *  - When the bookkeeper pastes a full CSV export (Square/Shopify), the
 *    parser checks if the critical column header changed from last month's
 *    persisted baseline. If it did, a blocking ConfirmRenameModal fires
 *    before the parsed result is shown and Apply is allowed.
 *  - The bookkeeper can accept the swap (optionally persisting the new
 *    header as the new baseline) or cancel the import entirely.
 *  - Text-summary pastes (non-CSV) are unaffected and continue to work
 *    as before with no column-rename prompt.
 *
 * Reset clears ALL history and returns the one-pager block to baseline.
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
  clearAllSnapshots,
  SOURCE_META,
  parseImport,
  rememberHeader,
  autoSeedBaseline,
  looksLikeCSV,
  parseSquare,
  parseShopify,
  parseCash,
  loadSnapshot,
  type ImportSource,
  type ParsedTotals,
  type SourceKey,
  type ParseResult,
  type ColumnAlert,
  type AppliedSnapshot,
  type SnapshotRow,
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
const DELTA_FLASH  = "rgba(184,90,62,0.10)";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  healthy: { bg: "rgba(42,107,62,0.10)",  color: GREEN,  label: "Healthy" },
  watch:   { bg: "rgba(122,92,0,0.10)",   color: YELLOW, label: "Watch"   },
  below:   { bg: "rgba(122,26,26,0.10)",  color: RED,    label: "Below"   },
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

// ─── Per-source channel state ─────────────────────────────────────────────────

/**
 * Session-level summary snapshot for a channel card apply.
 * Distinct from saltImports AppliedSnapshot (which is month-scoped and row-based).
 */
interface ChannelSnapshot {
  source: ImportSource;
  grossSales: number;
  refunds: number;
  net: number;
  appliedAt: string;
}

interface ChannelState {
  pasteText: string;
  parsed: ParsedTotals | null;
  parseError: string | null;
  applied: ChannelSnapshot | null;
  delta: number | null;
  flashRow: boolean;
}

type ChannelMap = Record<ImportSource, ChannelState>;

const SOURCES: ImportSource[] = ["square", "shopify", "cash"];

function makeInitialChannel(_source: ImportSource): ChannelState {
  return { pasteText: "", parsed: null, parseError: null, applied: null, delta: null, flashRow: false };
}

function runParser(source: ImportSource, text: string): ParsedTotals | null {
  if (source === "square")  return parseSquare(text);
  if (source === "shopify") return parseShopify(text);
  if (source === "cash")    return parseCash(text);
  return null;
}

// ─── Column-rename confirmation modal ─────────────────────────────────────────

interface ConfirmRenameProps {
  alerts: ColumnAlert[];
  result: ParseResult;
  onConfirm: (remember: boolean) => void;
  onCancel: () => void;
}

function ConfirmRenameModal({ alerts, result, onConfirm, onCancel }: ConfirmRenameProps) {
  const [remember, setRemember] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(31,61,46,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: CREAM,
          border: `2pt solid ${AMBER}`,
          borderRadius: "5pt",
          padding: "22pt 24pt",
          maxWidth: "480pt",
          width: "90vw",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "9pt",
          color: TEXT,
          boxShadow: "0 8pt 32pt rgba(31,61,46,0.25)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10pt", marginBottom: "14pt" }}>
          <div style={{ fontSize: "18pt", lineHeight: 1, color: AMBER, flexShrink: 0 }}>⚠</div>
          <div>
            <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "14pt", fontWeight: 700, color: DARK, lineHeight: 1.15, marginBottom: "4pt" }}>
              Column header changed — confirm before applying
            </div>
            <div style={{ fontSize: "8.5pt", color: MUTED, lineHeight: 1.5 }}>
              {result.sourceLabel} resolved a critical column to a header that differs
              from what was used last month. Confirm the swap is intentional before
              the parsed value is shown and Apply is allowed.
            </div>
          </div>
        </div>

        {/* Alert rows */}
        <div style={{ border: `1pt solid ${RULE}`, borderRadius: "3pt", overflow: "hidden", marginBottom: "12pt" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(31,61,46,0.06)", borderBottom: `1pt solid ${RULE}`, padding: "4pt 8pt", fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED }}>
            <span>Column</span>
            <span>Previously used</span>
            <span>Now resolves to</span>
          </div>
          {alerts.map((alert) => (
            <div key={`${alert.source}-${alert.field}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "7pt 8pt", borderBottom: `0.5pt solid ${RULE}`, alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, color: DARK, fontSize: "8.5pt" }}>{alert.fieldLabel}</div>
                <div style={{ fontSize: "7.5pt", color: MUTED }}>{alert.sourceLabel}</div>
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", color: MUTED, background: "rgba(122,26,26,0.07)", padding: "2pt 5pt", borderRadius: "2pt", display: "inline-block", textDecoration: "line-through", width: "fit-content" }}>
                {alert.previousHeader}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", color: GREEN, background: "rgba(42,107,62,0.08)", padding: "2pt 5pt", borderRadius: "2pt", display: "inline-block", width: "fit-content" }}>
                {alert.resolvedHeader}
              </div>
            </div>
          ))}
        </div>

        {/* Parsed value preview */}
        {result.criticalValue !== null && (
          <div style={{ background: "rgba(31,61,46,0.05)", border: `1pt solid ${RULE}`, borderRadius: "3pt", padding: "8pt 10pt", marginBottom: "14pt", display: "flex", gap: "14pt", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: "2pt" }}>Value to apply</div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "15pt", fontWeight: 700, color: DARK }}>{fmt(result.criticalValue)}</div>
            </div>
            <div style={{ fontSize: "8pt", color: MUTED, lineHeight: 1.5 }}>
              Sum of {result.rowCount} row{result.rowCount !== 1 ? "s" : ""} using{" "}
              <span style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: GREEN }}>{alerts[0]?.resolvedHeader}</span>
            </div>
          </div>
        )}

        {/* Remember checkbox */}
        <label style={{ display: "flex", alignItems: "center", gap: "7pt", cursor: "pointer", marginBottom: "16pt", padding: "8pt 10pt", background: remember ? "rgba(42,107,62,0.06)" : "transparent", border: `1pt solid ${remember ? "rgba(42,107,62,0.3)" : RULE}`, borderRadius: "3pt", transition: "background 0.15s" }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            style={{ accentColor: GREEN, width: "12pt", height: "12pt", cursor: "pointer" }}
          />
          <div>
            <div style={{ fontSize: "8.5pt", fontWeight: 700, color: DARK }}>Remember this header for next month</div>
            <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "1pt" }}>Updates the baseline so this prompt only fires on actual changes going forward.</div>
          </div>
        </label>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8pt", justifyContent: "flex-end" }}>
          <button type="button" onClick={onCancel} style={{ padding: "6pt 16pt", background: "transparent", color: MUTED, border: `1pt solid ${RULE}`, borderRadius: "3pt", fontSize: "8pt", fontWeight: 600, cursor: "pointer" }}>
            Cancel import
          </button>
          <button type="button" onClick={() => onConfirm(remember)} style={{ padding: "6pt 18pt", background: AMBER, color: CREAM, border: "none", borderRadius: "3pt", fontSize: "8pt", fontWeight: 700, cursor: "pointer" }}>
            Accept swap &amp; continue
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PasteCard component ──────────────────────────────────────────────────────

interface PasteCardProps {
  source: ImportSource;
  state: ChannelState;
  onPasteChange: (text: string) => void;
  onParse: () => void;
  onApply: (diffOnly: boolean) => void;
  onClear: () => void;
}

function PasteCard({ source, state, onPasteChange, onParse, onApply, onClear }: PasteCardProps) {
  const meta = SOURCE_META[source];
  const { parsed, applied, parseError } = state;

  const prevNet   = applied?.net ?? null;
  const parsedNet = parsed?.net ?? null;
  const diffNet   = prevNet !== null && parsedNet !== null ? parsedNet - prevNet : null;

  const hasChange = diffNet !== null && Math.round(diffNet) !== 0;
  const isNew = applied === null && parsedNet !== null;

  return (
    <div style={{ border: `1pt solid ${RULE}`, borderRadius: "4pt", padding: "10pt 12pt", background: "#fff", display: "flex", flexDirection: "column", gap: "8pt" }}>
      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "7.5pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: AMBER }}>
          {meta.label}
        </div>
        {applied && (
          <div style={{ fontSize: "7pt", color: MUTED }}>
            Last applied: {new Date(applied.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · net {applied.net < 0 ? `(${fmt(applied.net)})` : fmt(applied.net)}
          </div>
        )}
      </div>

      {/* Hint */}
      <div style={{ fontSize: "7pt", color: MUTED, lineHeight: 1.4 }}>{meta.hint}</div>

      {/* Textarea */}
      <textarea
        value={state.pasteText}
        onChange={e => onPasteChange(e.target.value)}
        placeholder={meta.placeholder}
        rows={source === "cash" ? 2 : 4}
        style={{ width: "100%", padding: "5pt 7pt", border: `1pt solid ${RULE}`, borderRadius: "3pt", fontSize: "7.5pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: TEXT, background: CREAM, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
      />

      {/* Parse error */}
      {parseError && (
        <div style={{ fontSize: "7.5pt", color: RED }}>{parseError}</div>
      )}

      {/* Parsed preview + diff */}
      {parsed && (
        <div style={{ background: "rgba(31,61,46,0.04)", border: `1pt solid ${RULE}`, borderRadius: "3pt", padding: "6pt 9pt", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4pt 10pt" }}>
          <PreviewCell label="Gross" value={fmt(parsed.grossSales)} />
          <PreviewCell label="Refunds" value={parsed.refunds !== 0 ? `(${fmt(parsed.refunds)})` : "—"} />
          <PreviewCell
            label="Net"
            value={parsed.net < 0 ? `(${fmt(parsed.net)})` : fmt(parsed.net)}
            extra={
              diffNet !== null ? (
                <span style={{ marginLeft: "4pt", fontSize: "7pt", fontWeight: 700, color: diffNet >= 0 ? GREEN : RED, background: diffNet >= 0 ? DELTA_POS_BG : DELTA_NEG_BG, padding: "0pt 3pt", borderRadius: "2pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                  Δ {fmtDelta(diffNet)}
                </span>
              ) : isNew ? (
                <span style={{ marginLeft: "4pt", fontSize: "7pt", fontWeight: 700, color: AMBER, background: "rgba(184,90,62,0.10)", padding: "0pt 3pt", borderRadius: "2pt" }}>
                  new
                </span>
              ) : null
            }
          />
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "6pt", flexWrap: "wrap" }}>
        {!parsed && (
          <button
            type="button"
            onClick={onParse}
            disabled={!state.pasteText.trim()}
            style={{ padding: "4pt 11pt", background: state.pasteText.trim() ? DARK : RULE, color: CREAM, border: "none", borderRadius: "3pt", fontSize: "7.5pt", fontWeight: 700, cursor: state.pasteText.trim() ? "pointer" : "default", letterSpacing: "0.03em" }}
          >
            Parse
          </button>
        )}

        {parsed && (
          <>
            {hasChange && (
              <button
                type="button"
                onClick={() => onApply(true)}
                style={{ padding: "4pt 11pt", background: AMBER, color: CREAM, border: "none", borderRadius: "3pt", fontSize: "7.5pt", fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em" }}
              >
                Apply diff only
              </button>
            )}
            <button
              type="button"
              onClick={() => onApply(false)}
              style={{ padding: "4pt 11pt", background: DARK, color: CREAM, border: "none", borderRadius: "3pt", fontSize: "7.5pt", fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em" }}
            >
              {isNew ? "Apply" : (hasChange ? "Apply all" : "Apply (no change)")}
            </button>
            <button
              type="button"
              onClick={onClear}
              style={{ padding: "4pt 8pt", background: "transparent", color: MUTED, border: `1pt solid ${RULE}`, borderRadius: "3pt", fontSize: "7.5pt", cursor: "pointer" }}
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PreviewCell({ label, value, extra }: { label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, marginBottom: "1pt" }}>
        {label}
      </div>
      <div style={{ fontSize: "8.5pt", fontWeight: 700, color: DARK, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
        {value}
        {extra}
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

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

// ─── Main page ────────────────────────────────────────────────────────────────

type ImportMode = "merge" | "replace";

/**
 * Pending rename: holds everything needed to complete a parse after the
 * bookkeeper confirms the column-header swap in the modal.
 */
interface PendingRename {
  source: ImportSource;
  renameResult: ParseResult;
  parsedTotals: ParsedTotals;
}

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
  const [pendingRename, setPendingRename] = useState<PendingRename | null>(null);
  const [channels, setChannels] = useState<ChannelMap>(() => Object.fromEntries(SOURCES.map(src => [src, makeInitialChannel(src)])) as ChannelMap);
  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [pendingImport, setPendingImport] = useState<SaltCloseRecord[] | null>(null);
  const [importError,   setImportError]   = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setHistory(getMonthHistory()); }, []);
  const channelTotals = SOURCES.map(src => ({ source: src, label: SOURCE_META[src].label, grossSales: channels[src].applied?.grossSales ?? 0, refunds: channels[src].applied?.refunds ?? 0, net: channels[src].applied?.net ?? 0, delta: channels[src].delta, flashRow: channels[src].flashRow }));
  const hasAnyApplied = SOURCES.some(src => channels[src].applied !== null);
  const totalNet = channelTotals.reduce((s, r) => s + r.net, 0);
  useEffect(() => { if (!hasAnyApplied) return; const total = channelTotals.reduce((s, r) => s + r.net, 0); if (total > 0) { setRevenue(total.toFixed(2)); setFromImport(false); } }, [channels]);
  function handlePasteChange(source: ImportSource, text: string) { setChannels(prev => ({ ...prev, [source]: { ...prev[source], pasteText: text, parsed: null, parseError: null } })); }
  function handleParse(source: ImportSource) { const text = channels[source].pasteText; const result = runParser(source, text); if (!result) { setChannels(prev => ({ ...prev, [source]: { ...prev[source], parseError: "Couldn't extract a dollar amount" } })); return; } if ((source === "square" || source === "shopify") && looksLikeCSV(text)) { const csvResult = parseImport(source as SourceKey, text); if (csvResult.alerts.length > 0) { setPendingRename({ source, renameResult: csvResult, parsedTotals: result }); return; } autoSeedBaseline(csvResult); } setChannels(prev => ({ ...prev, [source]: { ...prev[source], parsed: result, parseError: null } })); }
  function handleConfirmRename(remember: boolean) { if (!pendingRename) return; const { source, renameResult, parsedTotals } = pendingRename; if (remember) { for (const alert of renameResult.alerts) { rememberHeader(alert.source, alert.field, alert.resolvedHeader); } } autoSeedBaseline(renameResult); setChannels(prev => ({ ...prev, [source]: { ...prev[source], parsed: parsedTotals, parseError: null } })); setPendingRename(null); }
  function handleCancelRename() { if (pendingRename) { setChannels(prev => ({ ...prev, [pendingRename.source]: { ...prev[pendingRename.source], pasteText: "", parsed: null, parseError: null } })); } setPendingRename(null); }
  function handleApply(source: ImportSource, diffOnly: boolean) { const parsed = channels[source].parsed; if (!parsed) return; const prior = channels[source].applied; const delta = prior !== null ? parsed.net - prior.net : null; if (diffOnly && prior !== null && delta !== null && Math.round(delta) === 0) return; const snap = { source, grossSales: parsed.grossSales, refunds: parsed.refunds, net: parsed.net, appliedAt: new Date().toISOString() }; if (flashTimers.current[source]) clearTimeout(flashTimers.current[source]); setChannels(prev => ({ ...prev, [source]: { ...prev[source], applied: snap, parsed: null, pasteText: "", parseError: null, delta, flashRow: true } })); flashTimers.current[source] = setTimeout(() => { setChannels(prev => ({ ...prev, [source]: { ...prev[source], flashRow: false } })); }, 2000); }
  function handleClear(source: ImportSource) { setChannels(prev => ({ ...prev, [source]: { ...prev[source], pasteText: "", parsed: null, parseError: null } })); }
  function handleDownloadCSV() { if (history.length === 0) return; triggerDownload(buildCSV(history), "text/csv", `salt-closes-${currentMonthStr()}.csv`); }
  function handleDownloadJSON() { if (history.length === 0) return; triggerDownload(JSON.stringify(history, null, 2), "application/json", `salt-closes-${currentMonthStr()}.json`); }
  function triggerDownload(content: string, mime: string, filename: string) { const blob = new Blob([content], { type: mime }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }
  function handleImportClick() { setImportError(null); importInputRef.current?.click(); }
  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { try { const parsed = JSON.parse(ev.target?.result as string); setPendingImport(parseImportedJSON(parsed)); setImportError(null); } catch (err) { setImportError("Could not read the file."); setPendingImport(null); } }; reader.readAsText(file); e.target.value = ""; }
  function handleConfirmImport(mode: ImportMode) { if (!pendingImport) return; if (mode === "merge") { mergeCloses(pendingImport); } else { replaceCloses(pendingImport); } setHistory(getMonthHistory()); setPendingImport(null); }
  const net = (parseFloat(revenue) || 0) - (parseFloat(expenses) || 0);
  const curQId = currentQuarterId();
  const priorChain = computePriorChain(history, curQId);
  const priorMetrics = channelMonthMetrics(priorChain);
  const prevQtrUnder = autoPrevQuarterUnder(history, curQId, SALT_BASELINE_NET);
  const priorComplete = priorChain.length === 3;
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); if (!month || !revenue) return; const channelData: any = {}; for (const src of SOURCES) { const applied = channels[src].applied; if (applied && applied.net !== 0) { channelData[src] = { grossSales: applied.grossSales, refunds: applied.refunds, net: applied.net }; } } saveMonthClose(month, parseFloat(revenue) || 0, parseFloat(expenses) || 0, note, Object.keys(channelData).length > 0 ? channelData : undefined); setHistory(getMonthHistory()); setSaved(true); setTimeout(() => setSaved(false), 2500); setNote(""); setFromImport(false); }
  function handleReset() { if (!confirmReset) { setConfirmReset(true); return; } resetAllCloses(); clearAllSnapshots(month); setHistory([]); setConfirmReset(false); setRevenue(""); setFromImport(false); }
  return ( <> 
      </div>
    </>
  );
}
          </div> </div> </div> </div> </> ); }

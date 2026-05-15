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

  // ── Filing form state ──────────────────────────────────────────────────────
  const [month,        setMonth]        = useState(currentMonthStr());
  const [revenue,      setRevenue]      = useState("");
  const [expenses,     setExpenses]     = useState("");
  const [note,         setNote]         = useState("");
  const [history,      setHistory]      = useState<SaltCloseRecord[]>([]);
  const [saved,        setSaved]        = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [fromImport,   setFromImport]   = useState(false);

  // ── Column-rename blocking state ───────────────────────────────────────────
  const [pendingRename, setPendingRename] = useState<PendingRename | null>(null);

  // ── Channel import state ───────────────────────────────────────────────────
  const [channels, setChannels] = useState<ChannelMap>(() =>
    Object.fromEntries(SOURCES.map(src => [src, makeInitialChannel(src)])) as ChannelMap
  );
  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // ── Export / Import state ──────────────────────────────────────────────────
  const [pendingImport, setPendingImport] = useState<SaltCloseRecord[] | null>(null);
  const [importError,   setImportError]   = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(getMonthHistory());
  }, []);

  // ── Derived channel totals ─────────────────────────────────────────────────
  const channelTotals = SOURCES.map(src => ({
    source:     src,
    label:      SOURCE_META[src].label,
    grossSales: channels[src].applied?.grossSales ?? 0,
    refunds:    channels[src].applied?.refunds ?? 0,
    net:        channels[src].applied?.net ?? 0,
    delta:      channels[src].delta,
    flashRow:   channels[src].flashRow,
  }));
  const hasAnyApplied = SOURCES.some(src => channels[src].applied !== null);
  const totalNet = channelTotals.reduce((s, r) => s + r.net, 0);

  // Sync channel net total into the revenue field whenever any apply lands
  useEffect(() => {
    if (!hasAnyApplied) return;
    const total = channelTotals.reduce((s, r) => s + r.net, 0);
    if (total > 0) {
      setRevenue(total.toFixed(2));
      setFromImport(false);
    }
  }, [channels]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Channel handlers ───────────────────────────────────────────────────────

  function handlePasteChange(source: ImportSource, text: string) {
    setChannels(prev => ({
      ...prev,
      [source]: { ...prev[source], pasteText: text, parsed: null, parseError: null },
    }));
  }

  /**
   * Parse the paste text for a channel card.
   *
   * If the paste looks like a full CSV export (≥2 commas on the first line)
   * AND the source supports CSV column-rename detection (square/shopify),
   * we run parseImport alongside the text parser. If parseImport fires a
   * ColumnAlert, the result is held in pendingRename and the user must
   * confirm the header swap before the parsed preview is shown.
   */
  function handleParse(source: ImportSource) {
    const text = channels[source].pasteText;
    const result = runParser(source, text);
    if (!result) {
      setChannels(prev => ({
        ...prev,
        [source]: { ...prev[source], parseError: "Couldn't extract a dollar amount — check the pasted text." },
      }));
      return;
    }

    if ((source === "square" || source === "shopify") && looksLikeCSV(text)) {
      const csvResult = parseImport(source as SourceKey, text);
      if (csvResult.alerts.length > 0) {
        setPendingRename({ source, renameResult: csvResult, parsedTotals: result });
        return;
      }
      autoSeedBaseline(csvResult);
    }

    setChannels(prev => ({
      ...prev,
      [source]: { ...prev[source], parsed: result, parseError: null },
    }));
  }

  function handleConfirmRename(remember: boolean) {
    if (!pendingRename) return;
    const { source, renameResult, parsedTotals } = pendingRename;
    if (remember) {
      for (const alert of renameResult.alerts) {
        rememberHeader(alert.source, alert.field, alert.resolvedHeader);
      }
    }
    autoSeedBaseline(renameResult);
    setChannels(prev => ({
      ...prev,
      [source]: { ...prev[source], parsed: parsedTotals, parseError: null },
    }));
    setPendingRename(null);
  }

  function handleCancelRename() {
    if (pendingRename) {
      setChannels(prev => ({
        ...prev,
        [pendingRename.source]: { ...prev[pendingRename.source], pasteText: "", parsed: null, parseError: null },
      }));
    }
    setPendingRename(null);
  }

  function handleApply(source: ImportSource, diffOnly: boolean) {
    const parsed = channels[source].parsed;
    if (!parsed) return;
    const prior = channels[source].applied;
    const delta = prior !== null ? parsed.net - prior.net : null;

    if (diffOnly && prior !== null && delta !== null && Math.round(delta) === 0) return;

    const snap: ChannelSnapshot = {
      source,
      grossSales: parsed.grossSales,
      refunds:    parsed.refunds,
      net:        parsed.net,
      appliedAt:  new Date().toISOString(),
    };

    if (flashTimers.current[source]) clearTimeout(flashTimers.current[source]);

    setChannels(prev => ({
      ...prev,
      [source]: { ...prev[source], applied: snap, parsed: null, pasteText: "", parseError: null, delta, flashRow: true },
    }));

    flashTimers.current[source] = setTimeout(() => {
      setChannels(prev => ({
        ...prev,
        [source]: { ...prev[source], flashRow: false },
      }));
    }, 2000);
  }

  function handleClear(source: ImportSource) {
    setChannels(prev => ({
      ...prev,
      [source]: { ...prev[source], pasteText: "", parsed: null, parseError: null },
    }));
  }

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

  const curQId        = currentQuarterId();
  const priorChain    = computePriorChain(history, curQId);
  const priorMetrics  = channelMonthMetrics(priorChain);
  const prevQtrUnder  = autoPrevQuarterUnder(history, curQId, SALT_BASELINE_NET);
  const priorComplete = priorChain.length === 3;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!month || !revenue) return;
    const channelData: SaltCloseRecord["channels"] = {};
    for (const src of SOURCES) {
      const applied = loadSnapshot(src, month);
      if (applied && applied.total !== 0) {
        const grossSales = applied.rows.filter((r: SnapshotRow) => r.amount > 0).reduce((s: number, r: SnapshotRow) => s + r.amount, 0);
        const refunds    = applied.rows.filter((r: SnapshotRow) => r.amount < 0).reduce((s: number, r: SnapshotRow) => s + r.amount, 0);
        channelData[src] = {
          grossSales,
          refunds,
          net: applied.total,
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

  return (
    <>
      {/* Blocking column-rename confirmation modal */}
      {pendingRename && (
        <ConfirmRenameModal
          alerts={pendingRename.renameResult.alerts}
          result={pendingRename.renameResult}
          onConfirm={handleConfirmRename}
          onCancel={handleCancelRename}
        />
      )}

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
                  Paste Square / Shopify / cash totals into the channel cards, apply the
                  diff, then file the month. Δ annotations on the channel table show
                  exactly what moved so you can spot-check before filing.
                  Snapshots are scoped to the selected month — changing months always starts fresh.
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Bookkeeper</div>
                <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>Headwaters Development Services</div>
              </div>
            </div>

            {/* Rule */}
            <div style={{ height: "1pt", background: RULE, marginBottom: "18pt" }} />

            {/* ── Channel Import (screen-only) ────────────────────────────── */}
            <div className="print:hidden" style={{ marginBottom: "20pt" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "10pt" }}>
                Channel import
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10pt" }}>
                {SOURCES.map(src => (
                  <PasteCard
                    key={src}
                    source={src}
                    state={channels[src]}
                    onPasteChange={text => handlePasteChange(src, text)}
                    onParse={() => handleParse(src)}
                    onApply={(diffOnly) => handleApply(src, diffOnly)}
                    onClear={() => handleClear(src)}
                  />
                ))}
              </div>
            </div>

            {/* ── Channel Summary Table ─────────────────────────────────────── */}
            {hasAnyApplied && (
              <div style={{ marginBottom: "18pt" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "8pt" }}>
                  Channel summary — applied this session
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt" }}>
                  <thead>
                    <tr style={{ borderBottom: `1.5pt solid ${RULE}`, color: MUTED, fontWeight: 600, fontSize: "7.5pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "25%" }}>Channel</th>
                      <th style={{ padding: "3pt 4pt", textAlign: "right", width: "22%" }}>Gross</th>
                      <th style={{ padding: "3pt 4pt", textAlign: "right", width: "20%" }}>Refunds</th>
                      <th style={{ padding: "3pt 4pt", textAlign: "right", width: "20%" }}>Net</th>
                      <th className="print:hidden" style={{ padding: "3pt 4pt", textAlign: "right", width: "13%" }}>Δ vs prior</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelTotals.map(row => {
                      const hasDelta = row.delta !== null && Math.round(row.delta) !== 0;
                      const rowBg = row.flashRow ? DELTA_FLASH : "transparent";
                      return (
                        <tr key={row.source} style={{ borderBottom: `0.5pt solid ${RULE}`, background: rowBg, transition: "background 0.4s ease" }}>
                          <td style={{ padding: "5pt 4pt", fontWeight: 600 }}>{SOURCE_META[row.source].label}</td>
                          <td style={{ padding: "5pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                            {row.grossSales !== 0 ? fmt(row.grossSales) : "—"}
                          </td>
                          <td style={{ padding: "5pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: row.refunds !== 0 ? RED : MUTED }}>
                            {row.refunds !== 0 ? `(${fmt(row.refunds)})` : "—"}
                          </td>
                          <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: row.net >= 0 ? DARK : RED }}>
                            {row.net !== 0 ? (row.net < 0 ? `(${fmt(row.net)})` : fmt(row.net)) : "—"}
                          </td>
                          <td className="print:hidden" style={{ padding: "5pt 4pt", textAlign: "right" }}>
                            {hasDelta && row.delta !== null ? (
                              <span style={{ display: "inline-block", padding: "1pt 5pt", borderRadius: "2pt", background: row.delta >= 0 ? DELTA_POS_BG : DELTA_NEG_BG, color: row.delta >= 0 ? GREEN : RED, fontSize: "7.5pt", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.04em" }}>
                                {fmtDelta(row.delta)}
                              </span>
                            ) : row.delta === 0 ? (
                              <span style={{ fontSize: "7.5pt", color: MUTED }}>no change</span>
                            ) : (
                              <span style={{ fontSize: "7.5pt", color: MUTED }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Total row */}
                    <tr style={{ borderTop: `1.5pt solid ${RULE}`, background: "rgba(31,61,46,0.04)" }}>
                      <td style={{ padding: "5pt 4pt", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", letterSpacing: "0.06em", textTransform: "uppercase", color: DARK }}>Total</td>
                      <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                        {fmt(channelTotals.reduce((s, r) => s + r.grossSales, 0))}
                      </td>
                      <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: RED }}>
                        {channelTotals.some(r => r.refunds !== 0)
                          ? `(${fmt(channelTotals.reduce((s, r) => s + Math.abs(r.refunds), 0))})`
                          : "—"}
                      </td>
                      <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: totalNet >= 0 ? GREEN : RED }}>
                        {totalNet < 0 ? `(${fmt(totalNet)})` : fmt(totalNet)}
                      </td>
                      <td className="print:hidden" style={{ padding: "5pt 4pt" }} />
                    </tr>
                  </tbody>
                </table>
                <div className="print:hidden" style={{ marginTop: "6pt", fontSize: "7pt", color: MUTED, fontStyle: "italic" }}>
                  Δ column shows net change from the prior snapshot for each channel.
                  Hidden in print — the filed record shows only the resulting numbers.
                </div>
              </div>
            )}

            {/* Rule */}
            <div style={{ height: "1pt", background: RULE, marginBottom: "18pt" }} />

            {/* ── Filing form ───────────────────────────────────────────────── */}
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
                      {(hasAnyApplied || fromImport) && (
                        <span className="print:hidden" style={{ marginLeft: "5pt", fontWeight: 400, color: GREEN, letterSpacing: 0, textTransform: "none" }}>
                          ← from channels
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
                    <label style={labelStyle}>Salt Expenses ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 1800"
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

                  {revenue && (
                    <div style={{ padding: "5pt 8pt", background: "rgba(31,61,46,0.05)", border: `1pt solid ${RULE}`, borderRadius: "3pt" }}>
                      <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: "2pt" }}>Net preview</div>
                      <div style={{ fontSize: "13pt", fontWeight: 700, color: net >= 0 ? DARK : RED, fontFamily: "Fraunces, Georgia, serif" }}>
                        {net >= 0 ? fmt(net) : `(${fmt(Math.abs(net))})`}
                      </div>
                      <div style={{ fontSize: "7.5pt", color: MUTED }}>vs. {fmt(SALT_BASELINE_NET)} baseline</div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10pt", alignItems: "center" }}>
                  <button
                    type="submit"
                    style={{ padding: "6pt 18pt", background: AMBER, color: CREAM, border: "none", borderRadius: "3pt", fontSize: "8pt", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer" }}
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
                      border: `1pt solid ${RULE}`,
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

              {/* Print-only heading */}
              <div className="hidden print:block" style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "8pt" }}>
                Filed months ({history.length})
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
                      style={{ padding: "4pt 14pt", background: DARK, color: CREAM, border: "none", borderRadius: "3pt", fontSize: "7.5pt", fontWeight: 700, cursor: "pointer" }}
                    >
                      Merge
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmImport("replace")}
                      style={{ padding: "4pt 14pt", background: AMBER, color: CREAM, border: "none", borderRadius: "3pt", fontSize: "7.5pt", fontWeight: 700, cursor: "pointer" }}
                    >
                      Replace all
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingImport(null)}
                      style={{ padding: "4pt 10pt", background: "transparent", color: MUTED, border: `1pt solid ${RULE}`, borderRadius: "3pt", fontSize: "7.5pt", cursor: "pointer" }}
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
    </>
  );
}

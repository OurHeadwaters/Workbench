/**
 * SaltMonthlyClose.tsx
 *
 * Bookkeeper filing tool for the SALT-01 cost-centre monthly close.
 *
 * Flow:
 *  1. Paste Square / Shopify / Cash export text into the Channel Import cards.
 *     Each card shows a "Δ vs last applied" diff before you commit.
 *  2. Click "Apply diff only" (or "Apply") to push those numbers into the
 *     channel table. The channel rows then display a Δ annotation so the
 *     bookkeeper can spot-check the change without scrolling back up.
 *  3. The channel total auto-fills the revenue field in the filing form.
 *  4. File the month — stamps an immutable per-month record in localStorage.
 *
 * Delta annotations:
 *  - Appear on channel-table net cells immediately after an apply.
 *  - Persist for the session (cleared only when a new apply lands for
 *    that source, or the page is hard-refreshed).
 *  - Hidden in print via print:hidden — the printed close shows only the
 *    resulting numbers, not the diff trail.
 */

import { useState, useEffect, useRef } from "react";
import {
  saveMonthClose,
  getMonthHistory,
  resetAllCloses,
  getStatus,
  SALT_BASELINE_NET,
  type SaltCloseRecord,
} from "@/lib/saltClose";
import {
  parseSquare,
  parseShopify,
  parseCash,
  loadSnapshot,
  saveSnapshot,
  SOURCE_META,
  type ImportSource,
  type ParsedTotals,
  type AppliedSnapshot,
} from "@/lib/saltImports";

// ─── Design tokens ────────────────────────────────────────────────────────────

const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";
const GREEN  = "#2a6b3e";
const YELLOW = "#7a5c00";
const RED    = "#7a1a1a";
const DELTA_POS_BG = "rgba(42,107,62,0.10)";
const DELTA_NEG_BG = "rgba(122,26,26,0.10)";
const DELTA_FLASH  = "rgba(184,90,62,0.12)";

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

interface ChannelState {
  pasteText: string;
  parsed: ParsedTotals | null;
  parseError: string | null;
  applied: AppliedSnapshot | null; // the last-applied snapshot (persisted)
  delta: number | null;             // session-only: net change from last apply
  flashRow: boolean;                // transient highlight
}

type ChannelMap = Record<ImportSource, ChannelState>;

const SOURCES: ImportSource[] = ["square", "shopify", "cash"];

function makeInitialChannel(source: ImportSource): ChannelState {
  return {
    pasteText: "",
    parsed: null,
    parseError: null,
    applied: loadSnapshot(source),
    delta: null,
    flashRow: false,
  };
}

function runParser(source: ImportSource, text: string): ParsedTotals | null {
  if (source === "square")  return parseSquare(text);
  if (source === "shopify") return parseShopify(text);
  if (source === "cash")    return parseCash(text);
  return null;
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

  const prevNet  = applied?.net ?? null;
  const parsedNet = parsed?.net ?? null;
  const diffNet  = prevNet !== null && parsedNet !== null ? parsedNet - prevNet : null;

  const hasChange = diffNet !== null && Math.round(diffNet) !== 0;
  const isNew = applied === null && parsedNet !== null;

  return (
    <div style={{
      border: `1pt solid ${RULE}`,
      borderRadius: "4pt",
      padding: "10pt 12pt",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: "8pt",
    }}>
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
        style={{
          width: "100%",
          padding: "5pt 7pt",
          border: `1pt solid ${RULE}`,
          borderRadius: "3pt",
          fontSize: "7.5pt",
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          color: TEXT,
          background: CREAM,
          boxSizing: "border-box",
          resize: "vertical",
          lineHeight: 1.5,
        }}
      />

      {/* Parse error */}
      {parseError && (
        <div style={{ fontSize: "7.5pt", color: RED }}>{parseError}</div>
      )}

      {/* Parsed preview + diff */}
      {parsed && (
        <div style={{
          background: "rgba(31,61,46,0.04)",
          border: `1pt solid ${RULE}`,
          borderRadius: "3pt",
          padding: "6pt 9pt",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "4pt 10pt",
        }}>
          <PreviewCell label="Gross" value={fmt(parsed.grossSales)} />
          <PreviewCell label="Refunds" value={parsed.refunds !== 0 ? `(${fmt(parsed.refunds)})` : "—"} />
          <PreviewCell
            label="Net"
            value={parsed.net < 0 ? `(${fmt(parsed.net)})` : fmt(parsed.net)}
            extra={
              diffNet !== null ? (
                <span style={{
                  marginLeft: "4pt",
                  fontSize: "7pt",
                  fontWeight: 700,
                  color: diffNet >= 0 ? GREEN : RED,
                  background: diffNet >= 0 ? DELTA_POS_BG : DELTA_NEG_BG,
                  padding: "0pt 3pt",
                  borderRadius: "2pt",
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}>
                  Δ {fmtDelta(diffNet)}
                </span>
              ) : isNew ? (
                <span style={{
                  marginLeft: "4pt",
                  fontSize: "7pt",
                  fontWeight: 700,
                  color: AMBER,
                  background: "rgba(184,90,62,0.10)",
                  padding: "0pt 3pt",
                  borderRadius: "2pt",
                }}>
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
            style={{
              padding: "4pt 11pt",
              background: state.pasteText.trim() ? DARK : RULE,
              color: CREAM,
              border: "none",
              borderRadius: "3pt",
              fontSize: "7.5pt",
              fontWeight: 700,
              cursor: state.pasteText.trim() ? "pointer" : "default",
              letterSpacing: "0.03em",
            }}
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
                style={{
                  padding: "4pt 11pt",
                  background: AMBER,
                  color: CREAM,
                  border: "none",
                  borderRadius: "3pt",
                  fontSize: "7.5pt",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                }}
              >
                Apply diff only
              </button>
            )}
            <button
              type="button"
              onClick={() => onApply(false)}
              style={{
                padding: "4pt 11pt",
                background: DARK,
                color: CREAM,
                border: "none",
                borderRadius: "3pt",
                fontSize: "7.5pt",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.03em",
              }}
            >
              {isNew ? "Apply" : (hasChange ? "Apply all" : "Apply (no change)")}
            </button>
            <button
              type="button"
              onClick={onClear}
              style={{
                padding: "4pt 8pt",
                background: "transparent",
                color: MUTED,
                border: `1pt solid ${RULE}`,
                borderRadius: "3pt",
                fontSize: "7.5pt",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PreviewCell({
  label, value, extra,
}: {
  label: string;
  value: string;
  extra?: React.ReactNode;
}) {
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

// ─── Main page ────────────────────────────────────────────────────────────────

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

export default function SaltMonthlyClose() {
  // ── Filing form state ──────────────────────────────────────────────────────
  const [month,    setMonth]    = useState(currentMonthStr());
  const [revenue,  setRevenue]  = useState("");
  const [expenses, setExpenses] = useState("");
  const [note,     setNote]     = useState("");
  const [history,  setHistory]  = useState<SaltCloseRecord[]>([]);
  const [saved,    setSaved]    = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // ── Channel import state ───────────────────────────────────────────────────
  const [channels, setChannels] = useState<ChannelMap>(() =>
    Object.fromEntries(SOURCES.map(s => [s, makeInitialChannel(s)])) as ChannelMap,
  );

  // Flash timer refs — one per source
  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    setHistory(getMonthHistory());
    return () => {
      Object.values(flashTimers.current).forEach(clearTimeout);
    };
  }, []);

  // ── Derived channel totals ─────────────────────────────────────────────────
  const channelTotals = SOURCES.map(src => ({
    source: src,
    label: SOURCE_META[src].label,
    grossSales: channels[src].applied?.grossSales ?? 0,
    refunds: channels[src].applied?.refunds ?? 0,
    net: channels[src].applied?.net ?? 0,
    delta: channels[src].delta,
    flashRow: channels[src].flashRow,
  }));

  const totalNet = channelTotals.reduce((s, r) => s + r.net, 0);
  const hasAnyApplied = channelTotals.some(r => r.net !== 0);

  // ── Sync channel total into revenue field ──────────────────────────────────
  useEffect(() => {
    if (hasAnyApplied) {
      setRevenue(totalNet > 0 ? String(Math.round(totalNet)) : "");
    }
  }, [totalNet, hasAnyApplied]);

  // ── Channel handlers ───────────────────────────────────────────────────────
  function handlePasteChange(source: ImportSource, text: string) {
    setChannels(prev => ({
      ...prev,
      [source]: { ...prev[source], pasteText: text, parsed: null, parseError: null },
    }));
  }

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
    setChannels(prev => ({
      ...prev,
      [source]: { ...prev[source], parsed: result, parseError: null },
    }));
  }

  function handleApply(source: ImportSource, diffOnly: boolean) {
    const parsed = channels[source].parsed;
    if (!parsed) return;

    const prior = channels[source].applied;
    const delta = prior !== null ? parsed.net - prior.net : null;

    // "Apply diff only" is a no-op when there is no change vs. the prior snapshot.
    // Both UI (button visibility) and this guard enforce the invariant.
    if (diffOnly && prior !== null && delta !== null && Math.round(delta) === 0) return;

    const snap: AppliedSnapshot = {
      source,
      grossSales: parsed.grossSales,
      refunds: parsed.refunds,
      net: parsed.net,
      appliedAt: new Date().toISOString(),
    };
    saveSnapshot(snap);

    // Clear any existing flash timer for this source
    if (flashTimers.current[source]) clearTimeout(flashTimers.current[source]);

    setChannels(prev => ({
      ...prev,
      [source]: {
        ...prev[source],
        applied: snap,
        parsed: null,
        pasteText: "",
        parseError: null,
        delta,
        flashRow: true,
      },
    }));

    // Remove the flash highlight after 2 s, but keep the delta annotation
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

  // ── Filing form handlers ───────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
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
                SALT-01 · Monthly Close
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "22pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "4pt" }}>
                Salt Cost-Centre Filing
              </div>
              <div style={{ fontSize: "9pt", color: MUTED, lineHeight: 1.5, maxWidth: "4.5in" }}>
                Paste Square / Shopify / cash totals into the channel cards, apply the
                diff, then file the month. Δ annotations on the channel table show
                exactly what moved so you can spot-check before filing.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Bookkeeper</div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>Headwaters Development Services</div>
            </div>
          </div>

          {/* Rule */}
          <div style={{ height: "1pt", background: RULE, marginBottom: "18pt" }} />

          {/* ── Channel Import (screen-only) ─────────────────────────────── */}
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
                    {/* Delta column: print-hidden */}
                    <th className="print:hidden" style={{ padding: "3pt 4pt", textAlign: "right", width: "13%" }}>Δ vs prior</th>
                  </tr>
                </thead>
                <tbody>
                  {channelTotals.map(row => {
                    const hasDelta = row.delta !== null && Math.round(row.delta) !== 0;
                    const rowBg = row.flashRow ? DELTA_FLASH : "transparent";
                    return (
                      <tr
                        key={row.source}
                        style={{
                          borderBottom: `0.5pt solid ${RULE}`,
                          background: rowBg,
                          transition: "background 0.4s ease",
                        }}
                      >
                        <td style={{ padding: "5pt 4pt", fontWeight: 600 }}>
                          {SOURCE_META[row.source].label}
                        </td>
                        <td style={{ padding: "5pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                          {row.grossSales !== 0 ? fmt(row.grossSales) : "—"}
                        </td>
                        <td style={{ padding: "5pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: row.refunds !== 0 ? RED : MUTED }}>
                          {row.refunds !== 0 ? `(${fmt(row.refunds)})` : "—"}
                        </td>
                        <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: row.net >= 0 ? DARK : RED }}>
                          {row.net !== 0 ? (row.net < 0 ? `(${fmt(row.net)})` : fmt(row.net)) : "—"}
                        </td>
                        {/* ── Delta annotation: print:hidden ── */}
                        <td className="print:hidden" style={{ padding: "5pt 4pt", textAlign: "right" }}>
                          {hasDelta && row.delta !== null ? (
                            <span style={{
                              display: "inline-block",
                              padding: "1pt 5pt",
                              borderRadius: "2pt",
                              background: row.delta >= 0 ? DELTA_POS_BG : DELTA_NEG_BG,
                              color: row.delta >= 0 ? GREEN : RED,
                              fontSize: "7.5pt",
                              fontWeight: 700,
                              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                              letterSpacing: "0.04em",
                            }}>
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
                    <td style={{ padding: "5pt 4pt", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", letterSpacing: "0.06em", textTransform: "uppercase", color: DARK }}>
                      Total
                    </td>
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
                    onChange={e => setMonth(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Salt Revenue ($)
                    {hasAnyApplied && (
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

          {/* ── Filed months history ──────────────────────────────────────── */}
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

          {/* ── Planning reference ────────────────────────────────────────── */}
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
              History stored locally — export via one-pager print
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

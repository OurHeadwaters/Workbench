/**
 * CandidateTracker.tsx
 *
 * Live-fill candidate tracker for the practitioner.
 * Up to 4 candidates side-by-side. All data is held in React state —
 * nothing is persisted between sessions, so print or screenshot when done.
 *
 * Print via Cmd/Ctrl + P to capture the current state.
 */

import React, { useState, useCallback } from "react";

const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";
const GREEN  = "#2d6a3f";
const RED    = "#b03030";

const DECISION_OPTIONS = ["—", "Advance", "Paid trial", "Hold", "No"] as const;
type Decision = (typeof DECISION_OPTIONS)[number];

const DECISION_COLOR: Record<Decision, string> = {
  "—":          MUTED,
  "Advance":    GREEN,
  "Paid trial": "#1a5fa0",
  "Hold":       "#9a6e1a",
  "No":         RED,
};

interface Candidate {
  name: string;
  role: string;
  sourceChannel: string;
  screeningDate: string;
  ref1: string;
  ref1Date: string;
  ref1Result: string;
  ref2: string;
  ref2Date: string;
  ref2Result: string;
  ref3: string;
  ref3Date: string;
  ref3Result: string;
  paidTrialStart: string;
  paidTrialEnd: string;
  paidTrialResult: string;
  decision: Decision;
  notes: string;
}

function blank(): Candidate {
  return {
    name: "",
    role: "",
    sourceChannel: "",
    screeningDate: "",
    ref1: "",
    ref1Date: "",
    ref1Result: "",
    ref2: "",
    ref2Date: "",
    ref2Result: "",
    ref3: "",
    ref3Date: "",
    ref3Result: "",
    paidTrialStart: "",
    paidTrialEnd: "",
    paidTrialResult: "",
    decision: "—",
    notes: "",
  };
}

const SOURCE_CHANNELS = [
  "—",
  "Personal referral",
  "Band Council",
  "Indeed",
  "Facebook",
  "Word of mouth",
  "Previous contractor",
  "Community posting",
  "Other",
];

const REF_RESULTS = ["—", "All green", "Green / 1 yellow", "Green / 1 red", "Multiple yellow", "Red — disqualified"];
const REF_RESULT_COLOR: Record<string, string> = {
  "—":                  MUTED,
  "All green":          GREEN,
  "Green / 1 yellow":   "#9a6e1a",
  "Green / 1 red":      "#c06030",
  "Multiple yellow":    "#9a6e1a",
  "Red — disqualified": RED,
};

const TRIAL_RESULTS = ["—", "Strong pass", "Pass", "Marginal", "Fail"];
const TRIAL_RESULT_COLOR: Record<string, string> = {
  "—":        MUTED,
  "Strong pass": GREEN,
  "Pass":     "#2d6a3f",
  "Marginal": "#9a6e1a",
  "Fail":     RED,
};

interface FieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

function Field({ value, onChange, placeholder, multiline }: FieldProps) {
  const base: React.CSSProperties = {
    width: "100%",
    background: "rgba(31,61,46,0.04)",
    border: `0.5pt solid ${RULE}`,
    borderRadius: "2pt",
    padding: "3pt 4pt",
    fontSize: "8.5pt",
    color: TEXT,
    fontFamily: "Inter, system-ui, sans-serif",
    resize: "none" as const,
    outline: "none",
    lineHeight: 1.4,
  };
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={base}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={base}
    />
  );
}

interface SelectProps {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  colorMap?: Record<string, string>;
}

function Select({ value, options, onChange, colorMap }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%",
        background: "rgba(31,61,46,0.04)",
        border: `0.5pt solid ${RULE}`,
        borderRadius: "2pt",
        padding: "3pt 4pt",
        fontSize: "8.5pt",
        color: colorMap ? (colorMap[value] ?? TEXT) : TEXT,
        fontFamily: "Inter, system-ui, sans-serif",
        fontWeight: colorMap ? 600 : 400,
        outline: "none",
        cursor: "pointer",
      }}
    >
      {options.map(o => (
        <option key={o} value={o} style={{ color: colorMap ? (colorMap[o] ?? TEXT) : TEXT, fontWeight: 600 }}>
          {o}
        </option>
      ))}
    </select>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "6.5pt",
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: AMBER,
      marginBottom: "4pt",
      marginTop: "8pt",
      borderTop: `1pt solid ${RULE}`,
      paddingTop: "6pt",
    }}>
      {children}
    </div>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "7.5pt",
      color: MUTED,
      fontWeight: 600,
      marginBottom: "2pt",
      letterSpacing: "0.04em",
    }}>
      {children}
    </div>
  );
}

export default function CandidateTracker() {
  const [candidates, setCandidates] = useState<Candidate[]>([blank(), blank(), blank()]);
  const [activeCols, setActiveCols] = useState(3);

  const update = useCallback((i: number, field: keyof Candidate, val: string) => {
    setCandidates(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }, []);

  const addCandidate = () => {
    if (candidates.length < 4) {
      setCandidates(prev => [...prev, blank()]);
      setActiveCols(candidates.length + 1);
    }
  };

  const removeCandidate = (i: number) => {
    setCandidates(prev => prev.filter((_, idx) => idx !== i));
    setActiveCols(prev => Math.max(1, prev - 1));
  };

  const colWidth = `${Math.floor(100 / activeCols)}%`;

  return (
    <div style={{ background: "#d8d2c8", minHeight: "100vh" }}>
      <div
        style={{
          width: "11in",
          margin: "0 auto",
          background: CREAM,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "9pt",
          color: TEXT,
        }}
      >
        <div style={{ width: "11in", minHeight: "8.5in", padding: "0.45in 0.55in", position: "relative" }}>

          {/* Amber rule */}
          <div style={{ height: "3pt", background: AMBER, margin: "0 0 11pt" }} />

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12pt" }}>
            <div>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
                Practitioner Operating Plan — Hiring Tools
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "20pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "3pt" }}>
                Candidate Tracker
              </div>
              <div style={{ fontSize: "8.5pt", color: MUTED, lineHeight: 1.45, maxWidth: "5in" }}>
                Fill in live during screening and reference calls. Up to 4 candidates side-by-side.
                Print (Cmd/Ctrl + P) to save state — data is not persisted between sessions.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6pt" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Confidential</div>
                <div style={{ fontSize: "8pt", color: MUTED }}>Headwaters Development Services</div>
              </div>
              {candidates.length < 4 && (
                <button
                  onClick={addCandidate}
                  className="no-print"
                  style={{
                    fontSize: "8pt",
                    fontWeight: 600,
                    color: AMBER,
                    border: `1pt solid ${AMBER}`,
                    borderRadius: "3pt",
                    padding: "4pt 10pt",
                    background: "transparent",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}
                >
                  + Add candidate ({candidates.length}/4)
                </button>
              )}
            </div>
          </div>

          {/* Tracker table */}
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "1.1in" }} />
              {candidates.map((_, i) => (
                <col key={i} style={{ width: colWidth }} />
              ))}
            </colgroup>

            {/* ── Identity block ── */}
            <thead>
              <tr>
                <td style={{ padding: "4pt 6pt 4pt 0", verticalAlign: "bottom" }}>
                  <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, borderTop: `2pt solid ${AMBER}`, paddingTop: "6pt" }}>
                    Identity
                  </div>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "4pt 5pt", verticalAlign: "bottom", borderTop: `2pt solid ${RULE}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2pt" }}>
                      <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>
                        Candidate {i + 1}
                      </div>
                      {candidates.length > 1 && (
                        <button
                          onClick={() => removeCandidate(i)}
                          className="no-print"
                          style={{ fontSize: "7pt", color: MUTED, border: "none", background: "none", cursor: "pointer", padding: "0 2pt" }}
                          title="Remove"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Name */}
              <tr style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                <td style={{ padding: "4pt 6pt 4pt 0", verticalAlign: "top" }}>
                  <RowLabel>Full name</RowLabel>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "4pt 5pt", verticalAlign: "top" }}>
                    <Field value={c.name} onChange={v => update(i, "name", v)} placeholder="First Last" />
                  </td>
                ))}
              </tr>

              {/* Role */}
              <tr style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                <td style={{ padding: "4pt 6pt 4pt 0", verticalAlign: "top" }}>
                  <RowLabel>Role applying for</RowLabel>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "4pt 5pt", verticalAlign: "top" }}>
                    <Field value={c.role} onChange={v => update(i, "role", v)} placeholder="e.g. Handyman-Housekeeper" />
                  </td>
                ))}
              </tr>

              {/* Source */}
              <tr style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                <td style={{ padding: "4pt 6pt 4pt 0", verticalAlign: "top" }}>
                  <RowLabel>Source channel</RowLabel>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "4pt 5pt", verticalAlign: "top" }}>
                    <Select
                      value={c.sourceChannel || "—"}
                      options={SOURCE_CHANNELS}
                      onChange={v => update(i, "sourceChannel", v)}
                    />
                  </td>
                ))}
              </tr>

              {/* Screening date */}
              <tr style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                <td style={{ padding: "4pt 6pt 4pt 0", verticalAlign: "top" }}>
                  <RowLabel>Screening date</RowLabel>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "4pt 5pt", verticalAlign: "top" }}>
                    <Field value={c.screeningDate} onChange={v => update(i, "screeningDate", v)} placeholder="YYYY-MM-DD" />
                  </td>
                ))}
              </tr>

              {/* ── Reference calls block ── */}
              <tr>
                <td colSpan={candidates.length + 1} style={{ padding: "0" }}>
                  <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, borderTop: `2pt solid ${AMBER}`, paddingTop: "6pt", marginTop: "6pt", marginBottom: "2pt" }}>
                    Reference Calls (3 required)
                  </div>
                </td>
              </tr>

              {([1, 2, 3] as const).map(n => {
                const refKey = `ref${n}` as "ref1" | "ref2" | "ref3";
                const dateKey = `ref${n}Date` as "ref1Date" | "ref2Date" | "ref3Date";
                const resultKey = `ref${n}Result` as "ref1Result" | "ref2Result" | "ref3Result";
                return (
                  <React.Fragment key={`ref-block-${n}`}>
                    <tr style={{ borderBottom: `0.5pt solid rgba(200,191,167,0.4)` }}>
                      <td style={{ padding: "3pt 6pt 3pt 0", verticalAlign: "top" }}>
                        <RowLabel>Ref {n} — name</RowLabel>
                      </td>
                      {candidates.map((c, i) => (
                        <td key={i} style={{ padding: "3pt 5pt", verticalAlign: "top" }}>
                          <Field value={c[refKey]} onChange={v => update(i, refKey, v)} placeholder="Name / relationship" />
                        </td>
                      ))}
                    </tr>
                    <tr key={`ref${n}-date`} style={{ borderBottom: `0.5pt solid rgba(200,191,167,0.4)` }}>
                      <td style={{ padding: "3pt 6pt 3pt 0", verticalAlign: "top" }}>
                        <RowLabel>Ref {n} — date called</RowLabel>
                      </td>
                      {candidates.map((c, i) => (
                        <td key={i} style={{ padding: "3pt 5pt", verticalAlign: "top" }}>
                          <Field value={c[dateKey]} onChange={v => update(i, dateKey, v)} placeholder="YYYY-MM-DD" />
                        </td>
                      ))}
                    </tr>
                    <tr key={`ref${n}-result`} style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                      <td style={{ padding: "3pt 6pt 3pt 0", verticalAlign: "top" }}>
                        <RowLabel>Ref {n} — result</RowLabel>
                      </td>
                      {candidates.map((c, i) => (
                        <td key={i} style={{ padding: "3pt 5pt", verticalAlign: "top" }}>
                          <Select
                            value={c[resultKey] || "—"}
                            options={REF_RESULTS}
                            onChange={v => update(i, resultKey, v)}
                            colorMap={REF_RESULT_COLOR}
                          />
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                );
              })}

              {/* ── Paid trial block ── */}
              <tr>
                <td colSpan={candidates.length + 1} style={{ padding: "0" }}>
                  <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, borderTop: `2pt solid ${AMBER}`, paddingTop: "6pt", marginTop: "6pt", marginBottom: "2pt" }}>
                    Paid Trial
                  </div>
                </td>
              </tr>

              <tr style={{ borderBottom: `0.5pt solid rgba(200,191,167,0.4)` }}>
                <td style={{ padding: "3pt 6pt 3pt 0", verticalAlign: "top" }}>
                  <RowLabel>Trial start</RowLabel>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "3pt 5pt", verticalAlign: "top" }}>
                    <Field value={c.paidTrialStart} onChange={v => update(i, "paidTrialStart", v)} placeholder="YYYY-MM-DD" />
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: `0.5pt solid rgba(200,191,167,0.4)` }}>
                <td style={{ padding: "3pt 6pt 3pt 0", verticalAlign: "top" }}>
                  <RowLabel>Trial end</RowLabel>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "3pt 5pt", verticalAlign: "top" }}>
                    <Field value={c.paidTrialEnd} onChange={v => update(i, "paidTrialEnd", v)} placeholder="YYYY-MM-DD" />
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                <td style={{ padding: "3pt 6pt 3pt 0", verticalAlign: "top" }}>
                  <RowLabel>Trial result</RowLabel>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "3pt 5pt", verticalAlign: "top" }}>
                    <Select
                      value={c.paidTrialResult || "—"}
                      options={TRIAL_RESULTS}
                      onChange={v => update(i, "paidTrialResult", v)}
                      colorMap={TRIAL_RESULT_COLOR}
                    />
                  </td>
                ))}
              </tr>

              {/* ── Decision ── */}
              <tr>
                <td colSpan={candidates.length + 1} style={{ padding: "0" }}>
                  <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, borderTop: `2pt solid ${AMBER}`, paddingTop: "6pt", marginTop: "6pt", marginBottom: "2pt" }}>
                    Decision
                  </div>
                </td>
              </tr>

              <tr style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                <td style={{ padding: "4pt 6pt 4pt 0", verticalAlign: "top" }}>
                  <RowLabel>Final decision</RowLabel>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "4pt 5pt", verticalAlign: "top" }}>
                    <Select
                      value={c.decision}
                      options={DECISION_OPTIONS}
                      onChange={v => update(i, "decision", v as Decision)}
                      colorMap={DECISION_COLOR}
                    />
                  </td>
                ))}
              </tr>

              {/* ── Notes ── */}
              <tr>
                <td colSpan={candidates.length + 1} style={{ padding: "0" }}>
                  <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, borderTop: `2pt solid ${AMBER}`, paddingTop: "6pt", marginTop: "6pt", marginBottom: "2pt" }}>
                    Notes
                  </div>
                </td>
              </tr>

              <tr>
                <td style={{ padding: "4pt 6pt 4pt 0", verticalAlign: "top" }}>
                  <RowLabel>Running notes</RowLabel>
                  <div style={{ fontSize: "7pt", color: MUTED, lineHeight: 1.3, marginTop: "2pt" }}>
                    Anything from screening, ref calls, or trial not captured above
                  </div>
                </td>
                {candidates.map((c, i) => (
                  <td key={i} style={{ padding: "4pt 5pt", verticalAlign: "top" }}>
                    <Field
                      value={c.notes}
                      onChange={v => update(i, "notes", v)}
                      placeholder="Free-form notes…"
                      multiline
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Summary bar — decision highlight */}
          <div style={{ marginTop: "14pt", display: "flex", gap: "8pt" }}>
            {candidates.map((c, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderTop: `2pt solid ${DECISION_COLOR[c.decision]}`,
                  paddingTop: "5pt",
                }}
              >
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: "2pt" }}>
                  {c.name || `Candidate ${i + 1}`}
                </div>
                <div style={{ fontSize: "10pt", fontWeight: 700, color: DECISION_COLOR[c.decision] }}>
                  {c.decision}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: "12pt", borderTop: `1pt solid rgba(31,61,46,0.12)`, paddingTop: "6pt", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "7pt", color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Headwaters Development Services · Confidential · Candidate Tracker
            </div>
            <div style={{ fontSize: "7pt", color: MUTED }}>
              Reference scripts at /tools/reference-call and /tools/reference-call-handyman
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          input, select, textarea {
            border: 0.5pt solid #c8bfa7 !important;
            background: transparent !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

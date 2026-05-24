import { useState, useEffect, useCallback } from "react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const INK = "#1a1a1a";
const MUTED = "#6b7280";
const LAKE = "#1A5FA8";
const RUST = "#b04a2a";
const GOLD = "#d4a017";
const STORAGE_KEY = "mmr-template-v1";

const BUCKET_COLORS = [EVERGREEN, LAKE, "#B45309", "#6d28d9"];
const BUCKET_NAMES = ["1 — Cost Basis", "2 — Reserve", "3 — Reinvestment", "4 — Eave Flow"];

interface IncomeStream {
  name: string;
  amount: string;
  reliability: "recurring" | "one-time" | "";
}

interface BucketMovement {
  bucket: string;
  amount: string;
  reason: string;
}

interface ReinvestmentItem {
  description: string;
  amount: string;
  ownership: string;
}

interface EaveFlowItem {
  recipient: string;
  amount: string;
  reason: string;
}

interface Flag {
  description: string;
  type: "attention" | "decision" | "governance" | "";
}

interface ReportState {
  community: string;
  quarter: string;
  year: string;
  reportedBy: string;
  reportDate: string;

  openingBalances: { bucket: string; balance: string }[];

  incomeTotal: string;
  incomeStreams: IncomeStream[];
  incomeNotes: string;

  bucketMovements: BucketMovement[];
  bucketMovementNotes: string;

  costBasisAgreed: string;
  costBasisActual: string;
  costBasisVariance: string;
  costBasisExplanation: string;

  reserveBalance: string;
  reserveMonths: string;
  reserveTrajectory: string;
  reserveReplenishmentActive: boolean;
  reserveNotes: string;

  reinvestmentItems: ReinvestmentItem[];
  reinvestmentHeld: string;
  reinvestmentNotes: string;

  eaveFlowActive: boolean;
  eaveFlowItems: EaveFlowItem[];
  eaveFlowNotes: string;

  closingBalances: { bucket: string; balance: string }[];

  flags: Flag[];
  flagsNotes: string;
}

function defaultState(): ReportState {
  return {
    community: "",
    quarter: "Q1",
    year: new Date().getFullYear().toString(),
    reportedBy: "",
    reportDate: "",

    openingBalances: BUCKET_NAMES.map((b) => ({ bucket: b, balance: "" })),

    incomeTotal: "",
    incomeStreams: [
      { name: "", amount: "", reliability: "" },
      { name: "", amount: "", reliability: "" },
      { name: "", amount: "", reliability: "" },
    ],
    incomeNotes: "",

    bucketMovements: BUCKET_NAMES.map((b) => ({ bucket: b, amount: "", reason: "" })),
    bucketMovementNotes: "",

    costBasisAgreed: "",
    costBasisActual: "",
    costBasisVariance: "",
    costBasisExplanation: "",

    reserveBalance: "",
    reserveMonths: "",
    reserveTrajectory: "",
    reserveReplenishmentActive: false,
    reserveNotes: "",

    reinvestmentItems: [
      { description: "", amount: "", ownership: "" },
      { description: "", amount: "", ownership: "" },
    ],
    reinvestmentHeld: "",
    reinvestmentNotes: "",

    eaveFlowActive: false,
    eaveFlowItems: [
      { recipient: "", amount: "", reason: "" },
    ],
    eaveFlowNotes: "",

    closingBalances: BUCKET_NAMES.map((b) => ({ bucket: b, balance: "" })),

    flags: [
      { description: "", type: "" },
      { description: "", type: "" },
    ],
    flagsNotes: "",
  };
}

const sectionTitles = [
  "Opening Balances",
  "Income Received",
  "Bucket Movements",
  "Cost Basis Reconciliation",
  "Reserve Position",
  "Reinvestment Activity",
  "Eave Flow Activity",
  "Closing Balances",
  "Flags",
];

const sectionColors = [EVERGREEN, LAKE, LAKE, RUST, LAKE, "#B45309", "#6d28d9", EVERGREEN, RUST];

function SectionHeader({ n, title, color }: { n: number; title: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.75rem",
        borderBottom: `2px solid ${color}`,
        paddingBottom: "0.4rem",
      }}
    >
      <span
        style={{
          background: color,
          color: "#fff",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "0.72rem",
          borderRadius: "50%",
          width: "1.6rem",
          height: "1.6rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          letterSpacing: "0",
        }}
      >
        {n}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "0.95rem",
          fontWeight: 700,
          color: color,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  border: `1px solid rgba(31,61,46,0.25)`,
  borderRadius: 4,
  padding: "0.3rem 0.5rem",
  fontFamily: "var(--font-sans)",
  fontSize: "0.8rem",
  color: INK,
  background: "#fdfaf5",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.68rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: MUTED,
  display: "block",
  marginBottom: "0.2rem",
};

const textareaStyle: React.CSSProperties = {
  ...fieldStyle,
  resize: "vertical",
  minHeight: "3rem",
};

const sectionCard: React.CSSProperties = {
  background: "#fff",
  border: `1px solid rgba(31,61,46,0.13)`,
  borderRadius: 6,
  padding: "1rem 1.1rem",
  marginBottom: "0.85rem",
  breakInside: "avoid",
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        style={fieldStyle}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        rows={rows}
        style={{ ...textareaStyle, minHeight: `${rows * 1.5}rem` }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...fieldStyle }}>
        <option value="">— select —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function AddRow({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="no-print"
      style={{
        background: "transparent",
        border: `1px dashed rgba(31,61,46,0.35)`,
        borderRadius: 4,
        color: EVERGREEN,
        fontFamily: "var(--font-sans)",
        fontSize: "0.74rem",
        cursor: "pointer",
        padding: "0.25rem 0.6rem",
        marginTop: "0.4rem",
      }}
    >
      + {label}
    </button>
  );
}

export default function MoneyMachineReport() {
  const [report, setReport] = useState<ReportState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultState(), ...JSON.parse(stored) };
    } catch {}
    return defaultState();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
    } catch {}
  }, [report]);

  function set<K extends keyof ReportState>(key: K, value: ReportState[K]) {
    setReport((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    if (!window.confirm("Clear all entries and start a fresh report?")) return;
    setReport(defaultState());
    localStorage.removeItem(STORAGE_KEY);
  }

  const buildPlainText = useCallback(() => {
    const r = report;
    const lines: string[] = [];
    lines.push("QUARTERLY MONEY MACHINE REPORT");
    lines.push("================================");
    lines.push(`Community: ${r.community}`);
    lines.push(`Quarter: ${r.quarter} ${r.year}`);
    lines.push(`Reported by: ${r.reportedBy}`);
    lines.push(`Report date: ${r.reportDate}`);
    lines.push("");
    lines.push("SECTION 1 — OPENING BALANCES");
    r.openingBalances.forEach((b) => lines.push(`  Bucket ${b.bucket}: ${b.balance}`));
    lines.push("");
    lines.push("SECTION 2 — INCOME RECEIVED");
    lines.push(`  Total income: ${r.incomeTotal}`);
    r.incomeStreams.filter(s => s.name).forEach((s) =>
      lines.push(`  ${s.name}: ${s.amount} (${s.reliability || "—"})`)
    );
    if (r.incomeNotes) lines.push(`  Notes: ${r.incomeNotes}`);
    lines.push("");
    lines.push("SECTION 3 — BUCKET MOVEMENTS");
    r.bucketMovements.filter(m => m.amount || m.reason).forEach((m) =>
      lines.push(`  Bucket ${m.bucket}: ${m.amount} — ${m.reason}`)
    );
    if (r.bucketMovementNotes) lines.push(`  Notes: ${r.bucketMovementNotes}`);
    lines.push("");
    lines.push("SECTION 4 — COST BASIS RECONCILIATION");
    lines.push(`  Agreed Cost Basis: ${r.costBasisAgreed}`);
    lines.push(`  Actual Spend: ${r.costBasisActual}`);
    lines.push(`  Variance: ${r.costBasisVariance}`);
    if (r.costBasisExplanation) lines.push(`  Explanation: ${r.costBasisExplanation}`);
    lines.push("");
    lines.push("SECTION 5 — RESERVE POSITION");
    lines.push(`  Reserve balance: ${r.reserveBalance}`);
    lines.push(`  Months of coverage: ${r.reserveMonths}`);
    lines.push(`  Trajectory: ${r.reserveTrajectory}`);
    lines.push(`  Replenishment plan active: ${r.reserveReplenishmentActive ? "Yes" : "No"}`);
    if (r.reserveNotes) lines.push(`  Notes: ${r.reserveNotes}`);
    lines.push("");
    lines.push("SECTION 6 — REINVESTMENT ACTIVITY");
    r.reinvestmentItems.filter(i => i.description).forEach((i) =>
      lines.push(`  ${i.description}: ${i.amount} → ${i.ownership}`)
    );
    if (r.reinvestmentHeld) lines.push(`  Held (why): ${r.reinvestmentHeld}`);
    if (r.reinvestmentNotes) lines.push(`  Notes: ${r.reinvestmentNotes}`);
    lines.push("");
    lines.push("SECTION 7 — EAVE FLOW ACTIVITY");
    lines.push(`  Eave Flow active: ${r.eaveFlowActive ? "Yes" : "No"}`);
    if (r.eaveFlowActive) {
      r.eaveFlowItems.filter(i => i.recipient).forEach((i) =>
        lines.push(`  ${i.recipient}: ${i.amount} — ${i.reason}`)
      );
    }
    if (r.eaveFlowNotes) lines.push(`  Notes: ${r.eaveFlowNotes}`);
    lines.push("");
    lines.push("SECTION 8 — CLOSING BALANCES");
    r.closingBalances.forEach((b) => lines.push(`  Bucket ${b.bucket}: ${b.balance}`));
    lines.push("");
    lines.push("SECTION 9 — FLAGS");
    r.flags.filter(f => f.description).forEach((f) =>
      lines.push(`  [${f.type || "—"}] ${f.description}`)
    );
    if (r.flagsNotes) lines.push(`  Notes: ${r.flagsNotes}`);
    return lines.join("\n");
  }, [report]);

  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename={`money-machine-report-${report.quarter}-${report.year}.pdf`}
        onCopyPlainText={buildPlainText}
      />

      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "1rem 1rem 3rem",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.25rem",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
          className="no-print"
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: EVERGREEN,
                margin: "0 0 0.2rem",
              }}
            >
              Quarterly Money Machine Report
            </h1>
            <p style={{ fontSize: "0.78rem", color: MUTED, margin: 0 }}>
              Fill in each section, then print or download as PDF. Your answers are saved automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "transparent",
              border: `1px solid ${RUST}`,
              color: RUST,
              borderRadius: 4,
              padding: "0.3rem 0.8rem",
              fontSize: "0.76rem",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              flexShrink: 0,
            }}
          >
            ↺ Clear & start over
          </button>
        </div>

        <div id="pdf-target">
          {/* ── Document header (prints) ───────────────────────────────── */}
          <div
            style={{
              background: EVERGREEN,
              borderRadius: 6,
              padding: "0.9rem 1.1rem",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(244,237,224,0.55)",
                }}
              >
                Headwaters · Community Money Machine
              </span>
              <span
                style={{
                  width: "1.5rem",
                  height: "1px",
                  background: GOLD,
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(244,237,224,0.55)",
                }}
              >
                Governance Rules · Part 6
              </span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.45rem",
                fontWeight: 700,
                color: CREAM,
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Quarterly Money Machine Report
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              {[
                {
                  label: "Community",
                  value: report.community,
                  set: (v: string) => set("community", v),
                  placeholder: "Community name",
                },
                {
                  label: "Quarter",
                  value: report.quarter,
                  set: (v: string) => set("quarter", v),
                  isSelect: true,
                  options: ["Q1 (Jan–Mar)", "Q2 (Apr–Jun)", "Q3 (Jul–Sep)", "Q4 (Oct–Dec)"],
                },
                {
                  label: "Year",
                  value: report.year,
                  set: (v: string) => set("year", v),
                  placeholder: "e.g. 2026",
                },
                {
                  label: "Reported by",
                  value: report.reportedBy,
                  set: (v: string) => set("reportedBy", v),
                  placeholder: "Name / role",
                },
                {
                  label: "Report date",
                  value: report.reportDate,
                  set: (v: string) => set("reportDate", v),
                  placeholder: "e.g. 2026-07-15",
                },
              ].map((f) => (
                <div key={f.label}>
                  <label
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(244,237,224,0.6)",
                      display: "block",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {f.label}
                  </label>
                  {f.isSelect ? (
                    <select
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      style={{
                        ...fieldStyle,
                        background: "rgba(255,255,255,0.1)",
                        color: CREAM,
                        border: "1px solid rgba(244,237,224,0.3)",
                        width: "100%",
                      }}
                    >
                      {f.options!.map((o) => (
                        <option key={o} value={o.split(" ")[0]} style={{ color: INK, background: "#fff" }}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      placeholder={f.placeholder}
                      style={{
                        ...fieldStyle,
                        background: "rgba(255,255,255,0.1)",
                        color: CREAM,
                        border: "1px solid rgba(244,237,224,0.3)",
                        width: "100%",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 1: Opening Balances ───────────────────────────── */}
          <div style={sectionCard}>
            <SectionHeader n={1} title={sectionTitles[0]} color={sectionColors[0]} />
            <p style={{ fontSize: "0.76rem", color: MUTED, margin: "0 0 0.75rem" }}>
              Each bucket's balance at the start of the quarter.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.6rem" }}>
              {report.openingBalances.map((b, i) => (
                <div key={b.bucket}>
                  <label
                    style={{
                      ...labelStyle,
                      color: BUCKET_COLORS[i],
                    }}
                  >
                    Bucket {b.bucket}
                  </label>
                  <input
                    type="text"
                    value={b.balance}
                    onChange={(e) => {
                      const next = [...report.openingBalances];
                      next[i] = { ...next[i], balance: e.target.value };
                      set("openingBalances", next);
                    }}
                    placeholder="$ amount"
                    style={fieldStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 2: Income Received ────────────────────────────── */}
          <div style={sectionCard}>
            <SectionHeader n={2} title={sectionTitles[1]} color={sectionColors[1]} />
            <p style={{ fontSize: "0.76rem", color: MUTED, margin: "0 0 0.75rem" }}>
              Total income received this quarter, broken down by stream. Mark each stream as recurring or one-time.
            </p>

            <div style={{ marginBottom: "0.75rem" }}>
              <Field
                label="Total income received"
                value={report.incomeTotal}
                onChange={(v) => set("incomeTotal", v)}
                placeholder="$ total for the quarter"
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr>
                    {["Income stream / source", "Amount ($)", "Recurring or one-time"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "0.25rem 0.4rem",
                          borderBottom: `1px solid rgba(31,61,46,0.2)`,
                          ...labelStyle,
                          display: "table-cell",
                          marginBottom: 0,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.incomeStreams.map((s, i) => (
                    <tr key={i}>
                      <td style={{ padding: "0.25rem 0.4rem 0.25rem 0" }}>
                        <input
                          type="text"
                          value={s.name}
                          onChange={(e) => {
                            const next = [...report.incomeStreams];
                            next[i] = { ...next[i], name: e.target.value };
                            set("incomeStreams", next);
                          }}
                          placeholder="e.g. Market sales"
                          style={{ ...fieldStyle }}
                        />
                      </td>
                      <td style={{ padding: "0.25rem 0.4rem" }}>
                        <input
                          type="text"
                          value={s.amount}
                          onChange={(e) => {
                            const next = [...report.incomeStreams];
                            next[i] = { ...next[i], amount: e.target.value };
                            set("incomeStreams", next);
                          }}
                          placeholder="$"
                          style={{ ...fieldStyle }}
                        />
                      </td>
                      <td style={{ padding: "0.25rem 0 0.25rem 0.4rem" }}>
                        <select
                          value={s.reliability}
                          onChange={(e) => {
                            const next = [...report.incomeStreams];
                            next[i] = { ...next[i], reliability: e.target.value as IncomeStream["reliability"] };
                            set("incomeStreams", next);
                          }}
                          style={{ ...fieldStyle }}
                        >
                          <option value="">— select —</option>
                          <option value="recurring">Recurring</option>
                          <option value="one-time">One-time</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AddRow
              label="Add income stream"
              onClick={() =>
                set("incomeStreams", [
                  ...report.incomeStreams,
                  { name: "", amount: "", reliability: "" },
                ])
              }
            />

            <div style={{ marginTop: "0.75rem" }}>
              <TextArea
                label="Additional notes"
                value={report.incomeNotes}
                onChange={(v) => set("incomeNotes", v)}
                placeholder="Anything unusual about income this quarter?"
              />
            </div>
          </div>

          {/* ── Section 3: Bucket Movements ───────────────────────────── */}
          <div style={sectionCard}>
            <SectionHeader n={3} title={sectionTitles[2]} color={sectionColors[2]} />
            <p style={{ fontSize: "0.76rem", color: MUTED, margin: "0 0 0.75rem" }}>
              How much moved into each bucket this quarter and why.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr>
                    {["Bucket", "Amount moved in ($)", "Reason / notes"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "0.25rem 0.4rem",
                          borderBottom: `1px solid rgba(31,61,46,0.2)`,
                          ...labelStyle,
                          display: "table-cell",
                          marginBottom: 0,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.bucketMovements.map((m, i) => (
                    <tr key={i}>
                      <td style={{ padding: "0.25rem 0.4rem 0.25rem 0", whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: BUCKET_COLORS[i],
                          }}
                        >
                          {m.bucket}
                        </span>
                      </td>
                      <td style={{ padding: "0.25rem 0.4rem" }}>
                        <input
                          type="text"
                          value={m.amount}
                          onChange={(e) => {
                            const next = [...report.bucketMovements];
                            next[i] = { ...next[i], amount: e.target.value };
                            set("bucketMovements", next);
                          }}
                          placeholder="$"
                          style={{ ...fieldStyle }}
                        />
                      </td>
                      <td style={{ padding: "0.25rem 0 0.25rem 0.4rem" }}>
                        <input
                          type="text"
                          value={m.reason}
                          onChange={(e) => {
                            const next = [...report.bucketMovements];
                            next[i] = { ...next[i], reason: e.target.value };
                            set("bucketMovements", next);
                          }}
                          placeholder="Why did this amount move here?"
                          style={{ ...fieldStyle }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <TextArea
                label="Additional notes"
                value={report.bucketMovementNotes}
                onChange={(v) => set("bucketMovementNotes", v)}
                placeholder="Any movement that needs extra context?"
              />
            </div>
          </div>

          {/* ── Section 4: Cost Basis Reconciliation ─────────────────── */}
          <div style={sectionCard}>
            <SectionHeader n={4} title={sectionTitles[3]} color={sectionColors[3]} />
            <p style={{ fontSize: "0.76rem", color: MUTED, margin: "0 0 0.75rem" }}>
              Actual spend this quarter compared to the agreed Cost Basis. Any variance must be explained.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <Field
                label="Agreed monthly Cost Basis"
                value={report.costBasisAgreed}
                onChange={(v) => set("costBasisAgreed", v)}
                placeholder="$ per month"
              />
              <Field
                label="Actual spend (quarterly total)"
                value={report.costBasisActual}
                onChange={(v) => set("costBasisActual", v)}
                placeholder="$ actual"
              />
              <Field
                label="Variance (+ over / – under)"
                value={report.costBasisVariance}
                onChange={(v) => set("costBasisVariance", v)}
                placeholder="$ variance"
              />
            </div>

            <TextArea
              label="Variance explanation"
              value={report.costBasisExplanation}
              onChange={(v) => set("costBasisExplanation", v)}
              placeholder="If there is a variance, explain it plainly here. If on track, write 'On track — no variance.'"
              rows={3}
            />
          </div>

          {/* ── Section 5: Reserve Position ───────────────────────────── */}
          <div style={sectionCard}>
            <SectionHeader n={5} title={sectionTitles[4]} color={sectionColors[4]} />
            <p style={{ fontSize: "0.76rem", color: MUTED, margin: "0 0 0.75rem" }}>
              Current Reserve balance, months of coverage, and trajectory. If a replenishment plan is active, note it.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <Field
                label="Reserve balance (end of quarter)"
                value={report.reserveBalance}
                onChange={(v) => set("reserveBalance", v)}
                placeholder="$ balance"
              />
              <Field
                label="Months of operating coverage"
                value={report.reserveMonths}
                onChange={(v) => set("reserveMonths", v)}
                placeholder="e.g. 2.4 months"
              />
              <div>
                <label style={labelStyle}>Trajectory</label>
                <select
                  value={report.reserveTrajectory}
                  onChange={(e) => set("reserveTrajectory", e.target.value)}
                  style={fieldStyle}
                >
                  <option value="">— select —</option>
                  <option value="building">Building (increasing)</option>
                  <option value="stable">Stable (holding)</option>
                  <option value="declining">Declining (decreasing)</option>
                  <option value="post-draw">Post-draw (replenishing)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <input
                type="checkbox"
                id="replenishment-active"
                checked={report.reserveReplenishmentActive}
                onChange={(e) => set("reserveReplenishmentActive", e.target.checked)}
                style={{ width: "1rem", height: "1rem", accentColor: LAKE, cursor: "pointer" }}
              />
              <label
                htmlFor="replenishment-active"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  color: INK,
                  cursor: "pointer",
                }}
              >
                A Reserve replenishment plan is currently active (prior draw not yet restored)
              </label>
            </div>

            <TextArea
              label="Reserve notes"
              value={report.reserveNotes}
              onChange={(v) => set("reserveNotes", v)}
              placeholder="Any notes on Reserve health, draws, or recovery actions?"
            />
          </div>

          {/* ── Section 6: Reinvestment Activity ─────────────────────── */}
          <div style={sectionCard}>
            <SectionHeader n={6} title={sectionTitles[5]} color={sectionColors[5]} />
            <p style={{ fontSize: "0.76rem", color: MUTED, margin: "0 0 0.75rem" }}>
              What Reinvestment funds were spent, and what ownership increase each spend produced. If funds were held, explain why.
            </p>

            <div style={{ overflowX: "auto", marginBottom: "0.6rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr>
                    {["Description of spend", "Amount ($)", "Ownership increase produced"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "0.25rem 0.4rem",
                          borderBottom: `1px solid rgba(31,61,46,0.2)`,
                          ...labelStyle,
                          display: "table-cell",
                          marginBottom: 0,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.reinvestmentItems.map((item, i) => (
                    <tr key={i}>
                      <td style={{ padding: "0.25rem 0.4rem 0.25rem 0" }}>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const next = [...report.reinvestmentItems];
                            next[i] = { ...next[i], description: e.target.value };
                            set("reinvestmentItems", next);
                          }}
                          placeholder="What was purchased / funded?"
                          style={{ ...fieldStyle }}
                        />
                      </td>
                      <td style={{ padding: "0.25rem 0.4rem" }}>
                        <input
                          type="text"
                          value={item.amount}
                          onChange={(e) => {
                            const next = [...report.reinvestmentItems];
                            next[i] = { ...next[i], amount: e.target.value };
                            set("reinvestmentItems", next);
                          }}
                          placeholder="$"
                          style={{ ...fieldStyle }}
                        />
                      </td>
                      <td style={{ padding: "0.25rem 0 0.25rem 0.4rem" }}>
                        <input
                          type="text"
                          value={item.ownership}
                          onChange={(e) => {
                            const next = [...report.reinvestmentItems];
                            next[i] = { ...next[i], ownership: e.target.value };
                            set("reinvestmentItems", next);
                          }}
                          placeholder="What does the community now own?"
                          style={{ ...fieldStyle }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AddRow
              label="Add reinvestment item"
              onClick={() =>
                set("reinvestmentItems", [
                  ...report.reinvestmentItems,
                  { description: "", amount: "", ownership: "" },
                ])
              }
            />

            <div style={{ marginTop: "0.75rem" }}>
              <TextArea
                label="Funds held (explain why, if applicable)"
                value={report.reinvestmentHeld}
                onChange={(v) => set("reinvestmentHeld", v)}
                placeholder="If Reinvestment funds were held rather than spent, explain why here."
              />
            </div>

            <div style={{ marginTop: "0.5rem" }}>
              <TextArea
                label="Additional notes"
                value={report.reinvestmentNotes}
                onChange={(v) => set("reinvestmentNotes", v)}
                placeholder="Any other context on Reinvestment this quarter?"
              />
            </div>
          </div>

          {/* ── Section 7: Eave Flow Activity ────────────────────────── */}
          <div style={sectionCard}>
            <SectionHeader n={7} title={sectionTitles[6]} color={sectionColors[6]} />
            <p style={{ fontSize: "0.76rem", color: MUTED, margin: "0 0 0.75rem" }}>
              If Eave Flow is active, record where overflow went and why. If not active, confirm conditions not yet met.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <input
                type="checkbox"
                id="eave-flow-active"
                checked={report.eaveFlowActive}
                onChange={(e) => set("eaveFlowActive", e.target.checked)}
                style={{ width: "1rem", height: "1rem", accentColor: "#6d28d9", cursor: "pointer" }}
              />
              <label
                htmlFor="eave-flow-active"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  color: INK,
                  cursor: "pointer",
                }}
              >
                Eave Flow was active this quarter (Buckets 1–3 are funded and Reserve is full)
              </label>
            </div>

            {report.eaveFlowActive && (
              <>
                <div style={{ overflowX: "auto", marginBottom: "0.6rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                    <thead>
                      <tr>
                        {["Recipient", "Amount ($)", "Reason / mandate"].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: "left",
                              padding: "0.25rem 0.4rem",
                              borderBottom: `1px solid rgba(31,61,46,0.2)`,
                              ...labelStyle,
                              display: "table-cell",
                              marginBottom: 0,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.eaveFlowItems.map((item, i) => (
                        <tr key={i}>
                          <td style={{ padding: "0.25rem 0.4rem 0.25rem 0" }}>
                            <input
                              type="text"
                              value={item.recipient}
                              onChange={(e) => {
                                const next = [...report.eaveFlowItems];
                                next[i] = { ...next[i], recipient: e.target.value };
                                set("eaveFlowItems", next);
                              }}
                              placeholder="Who received the flow?"
                              style={{ ...fieldStyle }}
                            />
                          </td>
                          <td style={{ padding: "0.25rem 0.4rem" }}>
                            <input
                              type="text"
                              value={item.amount}
                              onChange={(e) => {
                                const next = [...report.eaveFlowItems];
                                next[i] = { ...next[i], amount: e.target.value };
                                set("eaveFlowItems", next);
                              }}
                              placeholder="$"
                              style={{ ...fieldStyle }}
                            />
                          </td>
                          <td style={{ padding: "0.25rem 0 0.25rem 0.4rem" }}>
                            <input
                              type="text"
                              value={item.reason}
                              onChange={(e) => {
                                const next = [...report.eaveFlowItems];
                                next[i] = { ...next[i], reason: e.target.value };
                                set("eaveFlowItems", next);
                              }}
                              placeholder="Approved direction and reason"
                              style={{ ...fieldStyle }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <AddRow
                  label="Add Eave Flow recipient"
                  onClick={() =>
                    set("eaveFlowItems", [
                      ...report.eaveFlowItems,
                      { recipient: "", amount: "", reason: "" },
                    ])
                  }
                />
              </>
            )}

            {!report.eaveFlowActive && (
              <div
                style={{
                  background: "rgba(109,40,217,0.06)",
                  border: "1px solid rgba(109,40,217,0.15)",
                  borderRadius: 4,
                  padding: "0.5rem 0.7rem",
                  fontSize: "0.76rem",
                  color: "#6d28d9",
                  marginBottom: "0.5rem",
                }}
              >
                Not active — Eave Flow does not begin until Buckets 1–3 are funded and the Reserve is at six months.
              </div>
            )}

            <div style={{ marginTop: "0.5rem" }}>
              <TextArea
                label="Notes"
                value={report.eaveFlowNotes}
                onChange={(v) => set("eaveFlowNotes", v)}
                placeholder="Any context on Eave Flow conditions or recipient decisions?"
              />
            </div>
          </div>

          {/* ── Section 8: Closing Balances ───────────────────────────── */}
          <div style={sectionCard}>
            <SectionHeader n={8} title={sectionTitles[7]} color={sectionColors[7]} />
            <p style={{ fontSize: "0.76rem", color: MUTED, margin: "0 0 0.75rem" }}>
              Each bucket's balance at the end of the quarter.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.6rem" }}>
              {report.closingBalances.map((b, i) => (
                <div key={b.bucket}>
                  <label
                    style={{
                      ...labelStyle,
                      color: BUCKET_COLORS[i],
                    }}
                  >
                    Bucket {b.bucket}
                  </label>
                  <input
                    type="text"
                    value={b.balance}
                    onChange={(e) => {
                      const next = [...report.closingBalances];
                      next[i] = { ...next[i], balance: e.target.value };
                      set("closingBalances", next);
                    }}
                    placeholder="$ amount"
                    style={fieldStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 9: Flags ──────────────────────────────────────── */}
          <div style={sectionCard}>
            <SectionHeader n={9} title={sectionTitles[8]} color={sectionColors[8]} />
            <p style={{ fontSize: "0.76rem", color: MUTED, margin: "0 0 0.75rem" }}>
              Anything that doesn't look right, anything that needs a table decision, and any governance log items the full community should know about.
            </p>

            <div style={{ overflowX: "auto", marginBottom: "0.6rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr>
                    {["Flag description", "Type"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "0.25rem 0.4rem",
                          borderBottom: `1px solid rgba(31,61,46,0.2)`,
                          ...labelStyle,
                          display: "table-cell",
                          marginBottom: 0,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.flags.map((flag, i) => (
                    <tr key={i}>
                      <td style={{ padding: "0.25rem 0.4rem 0.25rem 0", width: "70%" }}>
                        <input
                          type="text"
                          value={flag.description}
                          onChange={(e) => {
                            const next = [...report.flags];
                            next[i] = { ...next[i], description: e.target.value };
                            set("flags", next);
                          }}
                          placeholder="Describe the flag plainly"
                          style={{ ...fieldStyle }}
                        />
                      </td>
                      <td style={{ padding: "0.25rem 0 0.25rem 0.4rem" }}>
                        <select
                          value={flag.type}
                          onChange={(e) => {
                            const next = [...report.flags];
                            next[i] = { ...next[i], type: e.target.value as Flag["type"] };
                            set("flags", next);
                          }}
                          style={{ ...fieldStyle }}
                        >
                          <option value="">— select —</option>
                          <option value="attention">Needs attention</option>
                          <option value="decision">Table decision required</option>
                          <option value="governance">Governance log item</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AddRow
              label="Add flag"
              onClick={() =>
                set("flags", [...report.flags, { description: "", type: "" }])
              }
            />

            <div style={{ marginTop: "0.75rem" }}>
              <TextArea
                label="Additional context"
                value={report.flagsNotes}
                onChange={(v) => set("flagsNotes", v)}
                placeholder="Any further context on flags, or summary of governance log decisions made this quarter?"
                rows={3}
              />
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────────────── */}
          <div
            style={{
              borderTop: `2px solid ${EVERGREEN}`,
              paddingTop: "0.65rem",
              marginTop: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.65rem",
                color: MUTED,
                margin: 0,
                maxWidth: "55%",
              }}
            >
              This report follows the format defined in Part 6 of the Community Money Machine Governance Rules (Version 1, anchored May 2026). It states what happened — it does not editorialize.
            </p>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.72rem",
                  color: EVERGREEN,
                  margin: "0 0 0.15rem",
                  fontWeight: 700,
                }}
              >
                Headwaters · Community Money Machine
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, margin: 0 }}>
                Produced by: {report.reportedBy || "_______________"} · {report.reportDate || "_______________"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

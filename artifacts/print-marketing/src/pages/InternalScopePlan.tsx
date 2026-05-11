import { useState, useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { PrintNav } from "../components/PrintNav";

// ─── Default assumptions ──────────────────────────────────────────────────────

const DEFAULT_CONFIG = {
  hourlyRate: 175,
  hoursPerDay: 7,
  phase2: {
    remoteMonths: 4,
    remoteDaysPerMonth: 18,
    siteVisits: 4,
    daysPerVisit: 3,
    travelCostPerVisit: 900,
    proposedFeeMin: 52_000,
    proposedFeeMax: 60_000,
  },
  phase3: {
    remoteMonths: 3,
    remoteDaysPerMonth: 10,
    siteVisits: 2,
    daysPerVisit: 3,
    travelCostPerVisit: 900,
    proposedFeeMin: 24_000,
    proposedFeeMax: 30_000,
  },
  phase4: {
    remoteMonths: 6,
    remoteDaysPerMonth: 9,
    siteVisits: 2,
    daysPerVisit: 2,
    travelCostPerVisit: 900,
    proposedFeeMin: 18_000,
    proposedFeeMax: 22_000,
  },
  staffing: {
    estimatedHoursPerMonth: 12,
    contractorHourlyRate: 65,
    monthsCoveredInPhase2: 4,
  },
};

type Config = typeof DEFAULT_CONFIG;

// ─── Passphrase — change this to update the PIN ───────────────────────────────
const PASSPHRASE = "headwaters2026";
const SESSION_KEY = "internal-scope-plan-unlocked";

// ─── Snapshot persistence (sessionStorage only) ───────────────────────────────

type Snapshot = { name: string; cfg: Config };
const SNAPSHOTS_KEY = "hw-scope-snapshots";

function readSnapshots(): Snapshot[] {
  try {
    const raw = sessionStorage.getItem(SNAPSHOTS_KEY);
    return raw ? (JSON.parse(raw) as Snapshot[]) : [];
  } catch {
    return [];
  }
}

function writeSnapshots(snaps: Snapshot[]): void {
  sessionStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snaps));
}

// ─── Derived calculations ─────────────────────────────────────────────────────

function phaseCalc(
  phase: {
    remoteMonths: number;
    remoteDaysPerMonth: number;
    siteVisits: number;
    daysPerVisit: number;
    travelCostPerVisit: number;
    proposedFeeMin: number;
    proposedFeeMax: number;
  },
  hoursPerDay: number,
  hourlyRate: number,
) {
  const remoteDays = phase.remoteMonths * phase.remoteDaysPerMonth;
  const onsiteDays = phase.siteVisits * phase.daysPerVisit;
  const totalDays = remoteDays + onsiteDays;
  const laborCost = totalDays * hoursPerDay * hourlyRate;
  const travelCost = phase.siteVisits * phase.travelCostPerVisit;
  const totalCost = laborCost + travelCost;
  const marginAtMin = ((phase.proposedFeeMin - totalCost) / phase.proposedFeeMin) * 100;
  const marginAtMax = ((phase.proposedFeeMax - totalCost) / phase.proposedFeeMax) * 100;
  return { remoteDays, onsiteDays, totalDays, laborCost, travelCost, totalCost, marginAtMin, marginAtMax };
}

function deriveAll(cfg: Config) {
  const p2 = phaseCalc(cfg.phase2, cfg.hoursPerDay, cfg.hourlyRate);
  const p3 = phaseCalc(cfg.phase3, cfg.hoursPerDay, cfg.hourlyRate);
  const p4 = phaseCalc(cfg.phase4, cfg.hoursPerDay, cfg.hourlyRate);
  const staffMonthlyCost = cfg.staffing.estimatedHoursPerMonth * cfg.staffing.contractorHourlyRate;
  const staffPhase2Total = staffMonthlyCost * cfg.staffing.monthsCoveredInPhase2;
  const p2FullCost = p2.totalCost + staffPhase2Total;
  const p2MarginAtMin = ((cfg.phase2.proposedFeeMin - p2FullCost) / cfg.phase2.proposedFeeMin) * 100;
  const p2MarginAtMax = ((cfg.phase2.proposedFeeMax - p2FullCost) / cfg.phase2.proposedFeeMax) * 100;
  // ─── Phase 2–4 rollup ────────────────────────────────────────────────────
  const rollupTotalDays = p2.totalDays + p3.totalDays + p4.totalDays;
  const rollupLaborCost = p2.laborCost + p3.laborCost + p4.laborCost;
  const rollupTravelCost = p2.travelCost + p3.travelCost + p4.travelCost;
  const rollupTotalCost = p2FullCost + p3.totalCost + p4.totalCost;
  const rollupFeeMin = cfg.phase2.proposedFeeMin + cfg.phase3.proposedFeeMin + cfg.phase4.proposedFeeMin;
  const rollupFeeMax = cfg.phase2.proposedFeeMax + cfg.phase3.proposedFeeMax + cfg.phase4.proposedFeeMax;
  const rollupMarginAtMin = ((rollupFeeMin - rollupTotalCost) / rollupFeeMin) * 100;
  const rollupMarginAtMax = ((rollupFeeMax - rollupTotalCost) / rollupFeeMax) * 100;
  return {
    p2, p3, p4, staffMonthlyCost, staffPhase2Total, p2FullCost, p2MarginAtMin, p2MarginAtMax,
    rollupTotalDays, rollupLaborCost, rollupTravelCost, rollupTotalCost,
    rollupFeeMin, rollupFeeMax, rollupMarginAtMin, rollupMarginAtMax,
  };
}

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

function pct(n: number): string {
  return n.toFixed(0) + "%";
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: "#faf8f4",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  pageBreakAfter: "always",
  breakAfter: "page",
};

const LABEL: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.58rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "rgba(31,61,46,0.45)",
  marginBottom: "0.1rem",
};

const MUTED: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.72rem",
  color: "var(--muted)",
  lineHeight: 1.55,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DataRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      borderBottom: "1px solid rgba(31,61,46,0.08)",
      paddingBottom: "0.055in",
      marginBottom: "0.055in",
      gap: "0.5in",
    }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)" }}>{label}</span>
      <span style={{
        fontFamily: "var(--font-serif)",
        fontSize: accent ? "0.88rem" : "0.78rem",
        fontWeight: accent ? 700 : 500,
        color: accent ? "var(--evergreen)" : "var(--ink)",
        whiteSpace: "nowrap",
      }}>{value}</span>
    </div>
  );
}

function FeeBlock({ min, max, marginMin, marginMax, marginNote }: {
  min: number; max: number; marginMin: number; marginMax: number; marginNote?: string;
}) {
  return (
    <div style={{
      background: "var(--evergreen)",
      borderRadius: 6,
      padding: "0.18in 0.24in",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0.3in",
    }}>
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.04rem" }}>
          Proposed fee to client
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1 }}>
          {fmt(min)} – {fmt(max)}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", marginTop: "0.03rem" }}>CAD · excl. HST</p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.04rem" }}>
          Gross margin
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>
          {pct(marginMin)} – {pct(marginMax)}
        </p>
        {marginNote && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", marginTop: "0.03rem" }}>{marginNote}</p>
        )}
      </div>
    </div>
  );
}

function PhaseSection({
  phaseLabel, subtitle, description,
  remoteDays, remoteMonths, remoteDaysPerMonth,
  onsiteDays, siteVisits, daysPerVisit, travelCostPerVisit,
  totalDays, laborCost, travelCost,
  extraCostLabel, extraCostValue,
  totalCost, feeMin, feeMax, marginMin, marginMax, marginNote,
  notes, pageNum,
  hoursPerDay, hourlyRate,
}: {
  phaseLabel: string; subtitle: string; description: string;
  remoteDays: number; remoteMonths: number; remoteDaysPerMonth: number;
  onsiteDays: number; siteVisits: number; daysPerVisit: number; travelCostPerVisit: number;
  totalDays: number; laborCost: number; travelCost: number;
  extraCostLabel?: string; extraCostValue?: number;
  totalCost: number; feeMin: number; feeMax: number;
  marginMin: number; marginMax: number; marginNote?: string;
  notes?: string[]; pageNum: string;
  hoursPerDay: number; hourlyRate: number;
}) {
  return (
    <div style={PAGE}>
      <div style={{ background: "#2c1810", padding: "0.1in 0.7in", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,180,130,0.75)" }}>
          Internal · Confidential · Not for distribution
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,180,130,0.5)" }}>
          Headwaters Development Services
        </p>
      </div>

      <div style={{ background: "var(--evergreen)", padding: "0.38in 0.7in 0.32in", flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "0.1rem" }}>
          {phaseLabel}
        </p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "0.1rem" }}>
          {subtitle}
        </h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(244,237,224,0.7)", lineHeight: 1.55, maxWidth: "5.6in" }}>
          {description}
        </p>
      </div>

      <div style={{ flex: 1, padding: "0.36in 0.7in 0.3in", display: "flex", flexDirection: "column", gap: "0.28in" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3in" }}>
          <div>
            <p style={{ ...LABEL, marginBottom: "0.12in" }}>Time commitment</p>
            <DataRow label={`Remote (${remoteMonths} mo × ${remoteDaysPerMonth} days/mo)`} value={`${remoteDays} days`} />
            <DataRow label={`On-site (${siteVisits} visits × ${daysPerVisit} days)`} value={`${onsiteDays} days`} />
            <DataRow label="Total Headwaters days" value={`${totalDays} days`} accent />
            <p style={{ ...MUTED, marginTop: "0.1in" }}>
              {`${totalDays} days × ${hoursPerDay} hrs = ${(totalDays * hoursPerDay).toLocaleString()} billable hours`}
            </p>
          </div>

          <div>
            <p style={{ ...LABEL, marginBottom: "0.12in" }}>Cost to deliver</p>
            <DataRow label={`Labour (${totalDays} days × ${hoursPerDay} hrs × ${fmt(hourlyRate)}/hr)`} value={fmt(laborCost)} />
            <DataRow label={`Travel (${siteVisits} visits × ${fmt(travelCostPerVisit)})`} value={fmt(travelCost)} />
            {extraCostLabel && extraCostValue !== undefined && (
              <DataRow label={extraCostLabel} value={fmt(extraCostValue)} />
            )}
            <DataRow label="Total cost to deliver" value={fmt(totalCost)} accent />
          </div>
        </div>

        <FeeBlock min={feeMin} max={feeMax} marginMin={marginMin} marginMax={marginMax} marginNote={marginNote} />

        {notes && notes.length > 0 && (
          <div style={{ background: "rgba(184,90,62,0.06)", borderLeft: "3px solid rgba(184,90,62,0.35)", padding: "0.14in 0.2in", borderRadius: "0 4px 4px 0" }}>
            <p style={{ ...LABEL, marginBottom: "0.08in" }}>Notes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.07in" }}>
              {notes.map((note, i) => <p key={i} style={MUTED}>{note}</p>)}
            </div>
          </div>
        )}

        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.1)", paddingTop: "0.15in" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Internal — not for distribution
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{pageNum}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Assumptions sidebar ──────────────────────────────────────────────────────

function NumInput({
  label, value, onChange, min, step, prefix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  prefix?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(31,61,46,0.5)", fontFamily: "var(--font-sans)" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid rgba(31,61,46,0.18)", borderRadius: 4, overflow: "hidden" }}>
        {prefix && (
          <span style={{ padding: "4px 6px", fontSize: 12, color: "rgba(31,61,46,0.45)", fontFamily: "var(--font-sans)", borderRight: "1px solid rgba(31,61,46,0.12)" }}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          min={min ?? 0}
          step={step ?? 1}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "5px 8px",
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            color: "var(--ink)",
            background: "transparent",
            width: "100%",
          }}
        />
      </div>
    </label>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{
        fontSize: 9,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--evergreen)",
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        marginBottom: 10,
        paddingBottom: 5,
        borderBottom: "1px solid rgba(31,61,46,0.12)",
      }}>
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function SnapshotPanel({
  cfg,
  snapshots,
  onSave,
  onLoad,
  onDelete,
}: {
  cfg: Config;
  snapshots: Snapshot[];
  onSave: (name: string) => void;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}) {
  const [naming, setNaming] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [selected, setSelected] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const btnBase: CSSProperties = {
    border: "none",
    borderRadius: 4,
    padding: "5px 10px",
    fontSize: 10,
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700,
  };

  const handleSave = () => {
    const name = nameValue.trim();
    if (!name) return;
    onSave(name);
    setNaming(false);
    setNameValue("");
    setSelected(name);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{
        fontSize: 9,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--evergreen)",
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        marginBottom: 10,
        paddingBottom: 5,
        borderBottom: "1px solid rgba(31,61,46,0.12)",
      }}>
        Scenarios
      </p>

      {/* Load / delete row */}
      {snapshots.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            style={{
              flex: 1,
              border: "1px solid rgba(31,61,46,0.18)",
              borderRadius: 4,
              padding: "5px 7px",
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              color: selected ? "var(--ink)" : "rgba(31,61,46,0.4)",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="">Load a scenario…</option>
            {snapshots.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
          <button
            disabled={!selected}
            onClick={() => { if (selected) onLoad(selected); }}
            title="Load selected scenario"
            style={{
              ...btnBase,
              background: selected ? "var(--evergreen)" : "rgba(31,61,46,0.08)",
              color: selected ? "var(--cream)" : "rgba(31,61,46,0.3)",
              cursor: selected ? "pointer" : "default",
            }}
          >
            Load
          </button>
          <button
            disabled={!selected}
            onClick={() => {
              if (!selected) return;
              onDelete(selected);
              setSelected("");
            }}
            title="Delete selected scenario"
            style={{
              ...btnBase,
              background: selected ? "rgba(184,90,62,0.1)" : "rgba(31,61,46,0.05)",
              color: selected ? "var(--rust)" : "rgba(31,61,46,0.25)",
              border: `1px solid ${selected ? "rgba(184,90,62,0.25)" : "transparent"}`,
              cursor: selected ? "pointer" : "default",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Save row */}
      {naming ? (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            placeholder="e.g. conservative"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") { setNaming(false); setNameValue(""); }
            }}
            style={{
              flex: 1,
              border: "1px solid rgba(31,61,46,0.3)",
              borderRadius: 4,
              padding: "5px 8px",
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              color: "var(--ink)",
              outline: "none",
            }}
          />
          <button
            onClick={handleSave}
            style={{ ...btnBase, background: "var(--evergreen)", color: "var(--cream)" }}
          >
            Save
          </button>
          <button
            onClick={() => { setNaming(false); setNameValue(""); }}
            style={{ ...btnBase, background: "rgba(31,61,46,0.07)", color: "rgba(31,61,46,0.5)" }}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setNaming(true); setTimeout(() => inputRef.current?.focus(), 0); }}
          style={{
            ...btnBase,
            width: "100%",
            background: "rgba(31,61,46,0.07)",
            color: "var(--evergreen)",
            padding: "7px 10px",
            textAlign: "center",
          }}
        >
          + Save current as snapshot
        </button>
      )}

      {snapshots.length === 0 && !naming && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "rgba(31,61,46,0.4)", marginTop: 6, lineHeight: 1.5 }}>
          No snapshots yet. Save one to compare scenarios.
        </p>
      )}
    </div>
  );
}

function AssumptionsSidebar({
  cfg, onChange, onReset, open, onToggle,
  snapshots, onSaveSnapshot, onLoadSnapshot, onDeleteSnapshot,
}: {
  cfg: Config;
  onChange: (patch: Partial<Config> | ((prev: Config) => Config)) => void;
  onReset: () => void;
  open: boolean;
  onToggle: () => void;
  snapshots: Snapshot[];
  onSaveSnapshot: (name: string) => void;
  onLoadSnapshot: (name: string) => void;
  onDeleteSnapshot: (name: string) => void;
}) {
  const setPhase = (
    phase: "phase2" | "phase3" | "phase4",
    key: string,
    value: number,
  ) => {
    onChange((prev) => ({
      ...prev,
      [phase]: { ...prev[phase], [key]: value },
    }));
  };

  const setStaffing = (key: string, value: number) => {
    onChange((prev) => ({
      ...prev,
      staffing: { ...prev.staffing, [key]: value },
    }));
  };

  return (
    <>
      {/* Toggle button — always visible, no-print */}
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          top: 80,
          right: open ? 304 : 0,
          zIndex: 200,
          background: "var(--evergreen)",
          color: "var(--cream)",
          border: "none",
          borderRadius: open ? "6px 0 0 6px" : "6px 0 0 6px",
          padding: "10px 12px",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          display: "flex",
          alignItems: "center",
          gap: 6,
          boxShadow: "-2px 2px 8px rgba(0,0,0,0.15)",
          transition: "right 0.25s ease",
        }}
        className="no-print"
        aria-label="Toggle assumption editor"
      >
        {open ? "✕ Close" : "⚙ Assumptions"}
      </button>

      {/* Sidebar panel */}
      <div
        className="no-print"
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : -304,
          width: 304,
          height: "100vh",
          background: "#faf8f4",
          borderLeft: "1px solid rgba(31,61,46,0.14)",
          boxShadow: open ? "-4px 0 20px rgba(0,0,0,0.10)" : "none",
          zIndex: 100,
          overflowY: "auto",
          transition: "right 0.25s ease",
          padding: "20px 18px 40px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, color: "var(--evergreen)" }}>
            Edit Assumptions
          </p>
          <button
            onClick={onReset}
            style={{
              background: "rgba(184,90,62,0.1)",
              border: "1px solid rgba(184,90,62,0.25)",
              borderRadius: 4,
              padding: "4px 10px",
              fontSize: 10,
              fontFamily: "var(--font-sans)",
              color: "var(--rust)",
              cursor: "pointer",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Reset
          </button>
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(31,61,46,0.5)", lineHeight: 1.5, marginBottom: 20 }}>
          Changes apply instantly. Not saved between sessions.
        </p>

        <SnapshotPanel
          cfg={cfg}
          snapshots={snapshots}
          onSave={onSaveSnapshot}
          onLoad={onLoadSnapshot}
          onDelete={onDeleteSnapshot}
        />

        <SidebarSection title="Global">
          <NumInput label="Hourly rate (CAD/hr)" value={cfg.hourlyRate} prefix="$"
            onChange={(v) => onChange((p) => ({ ...p, hourlyRate: v }))} min={1} />
          <NumInput label="Working hours / day" value={cfg.hoursPerDay}
            onChange={(v) => onChange((p) => ({ ...p, hoursPerDay: v }))} min={1} step={0.5} />
        </SidebarSection>

        <SidebarSection title="Phase 2 — The Build">
          <NumInput label="Remote months" value={cfg.phase2.remoteMonths}
            onChange={(v) => setPhase("phase2", "remoteMonths", v)} min={1} />
          <NumInput label="Days / month (remote)" value={cfg.phase2.remoteDaysPerMonth}
            onChange={(v) => setPhase("phase2", "remoteDaysPerMonth", v)} min={1} />
          <NumInput label="Site visits" value={cfg.phase2.siteVisits}
            onChange={(v) => setPhase("phase2", "siteVisits", v)} min={0} />
          <NumInput label="Days / visit" value={cfg.phase2.daysPerVisit}
            onChange={(v) => setPhase("phase2", "daysPerVisit", v)} min={1} />
          <NumInput label="Travel cost / visit (CAD)" value={cfg.phase2.travelCostPerVisit} prefix="$"
            onChange={(v) => setPhase("phase2", "travelCostPerVisit", v)} min={0} />
          <NumInput label="Proposed fee — min (CAD)" value={cfg.phase2.proposedFeeMin} prefix="$"
            onChange={(v) => setPhase("phase2", "proposedFeeMin", v)} min={0} step={500} />
          <NumInput label="Proposed fee — max (CAD)" value={cfg.phase2.proposedFeeMax} prefix="$"
            onChange={(v) => setPhase("phase2", "proposedFeeMax", v)} min={0} step={500} />
        </SidebarSection>

        <SidebarSection title="Phase 3 — Winter Payoff">
          <NumInput label="Remote months" value={cfg.phase3.remoteMonths}
            onChange={(v) => setPhase("phase3", "remoteMonths", v)} min={1} />
          <NumInput label="Days / month (remote)" value={cfg.phase3.remoteDaysPerMonth}
            onChange={(v) => setPhase("phase3", "remoteDaysPerMonth", v)} min={1} />
          <NumInput label="Site visits" value={cfg.phase3.siteVisits}
            onChange={(v) => setPhase("phase3", "siteVisits", v)} min={0} />
          <NumInput label="Days / visit" value={cfg.phase3.daysPerVisit}
            onChange={(v) => setPhase("phase3", "daysPerVisit", v)} min={1} />
          <NumInput label="Travel cost / visit (CAD)" value={cfg.phase3.travelCostPerVisit} prefix="$"
            onChange={(v) => setPhase("phase3", "travelCostPerVisit", v)} min={0} />
          <NumInput label="Proposed fee — min (CAD)" value={cfg.phase3.proposedFeeMin} prefix="$"
            onChange={(v) => setPhase("phase3", "proposedFeeMin", v)} min={0} step={500} />
          <NumInput label="Proposed fee — max (CAD)" value={cfg.phase3.proposedFeeMax} prefix="$"
            onChange={(v) => setPhase("phase3", "proposedFeeMax", v)} min={0} step={500} />
        </SidebarSection>

        <SidebarSection title="Phase 4 — Handoff & Pilot #2 Bridge">
          <NumInput label="Remote months" value={cfg.phase4.remoteMonths}
            onChange={(v) => setPhase("phase4", "remoteMonths", v)} min={1} />
          <NumInput label="Days / month (remote)" value={cfg.phase4.remoteDaysPerMonth}
            onChange={(v) => setPhase("phase4", "remoteDaysPerMonth", v)} min={1} />
          <NumInput label="Site visits" value={cfg.phase4.siteVisits}
            onChange={(v) => setPhase("phase4", "siteVisits", v)} min={0} />
          <NumInput label="Days / visit" value={cfg.phase4.daysPerVisit}
            onChange={(v) => setPhase("phase4", "daysPerVisit", v)} min={1} />
          <NumInput label="Travel cost / visit (CAD)" value={cfg.phase4.travelCostPerVisit} prefix="$"
            onChange={(v) => setPhase("phase4", "travelCostPerVisit", v)} min={0} />
          <NumInput label="Proposed fee — min (CAD)" value={cfg.phase4.proposedFeeMin} prefix="$"
            onChange={(v) => setPhase("phase4", "proposedFeeMin", v)} min={0} step={500} />
          <NumInput label="Proposed fee — max (CAD)" value={cfg.phase4.proposedFeeMax} prefix="$"
            onChange={(v) => setPhase("phase4", "proposedFeeMax", v)} min={0} step={500} />
        </SidebarSection>

        <SidebarSection title="Staffing — IT / Bookkeeping">
          <NumInput label="Hours / month" value={cfg.staffing.estimatedHoursPerMonth}
            onChange={(v) => setStaffing("estimatedHoursPerMonth", v)} min={1} />
          <NumInput label="Contractor rate (CAD/hr)" value={cfg.staffing.contractorHourlyRate} prefix="$"
            onChange={(v) => setStaffing("contractorHourlyRate", v)} min={1} />
          <NumInput label="Months covered in Phase 2" value={cfg.staffing.monthsCoveredInPhase2}
            onChange={(v) => setStaffing("monthsCoveredInPhase2", v)} min={1} />
        </SidebarSection>
      </div>
    </>
  );
}

// ─── Passphrase gate ──────────────────────────────────────────────────────────

function PassphraseGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === PASSPHRASE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setValue("");
    }
  }

  const GATE_WRAP: CSSProperties = {
    minHeight: "100vh",
    background: "var(--evergreen)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const GATE_CARD: CSSProperties = {
    background: "#faf8f4",
    borderRadius: 10,
    padding: "2.5rem 3rem",
    width: "min(22rem, 90vw)",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
  };

  return (
    <div style={GATE_WRAP}>
      <div style={GATE_CARD}>
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(31,61,46,0.45)", marginBottom: "0.3rem" }}>
            Headwaters Development Services
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 900, color: "var(--evergreen)", lineHeight: 1.1, marginBottom: "0.4rem" }}>
            Internal — Confidential
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.55 }}>
            Enter the passphrase to view this document.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input
            type="password"
            autoFocus
            autoComplete="off"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Passphrase"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              padding: "0.55rem 0.75rem",
              borderRadius: 5,
              border: error ? "1.5px solid #b85a3e" : "1.5px solid rgba(31,61,46,0.2)",
              outline: "none",
              color: "var(--ink)",
              background: "#fff",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          {error && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "#b85a3e" }}>
              Incorrect passphrase. Try again.
            </p>
          )}
          <button
            type="submit"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "var(--evergreen)",
              color: "var(--cream)",
              border: "none",
              borderRadius: 5,
              padding: "0.6rem 1rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function InternalScopePlan() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );
  const [cfg, setCfg] = useState<Config>(DEFAULT_CONFIG);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => readSnapshots());
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;

  const handleChange = useCallback((patch: Partial<Config> | ((prev: Config) => Config)) => {
    setCfg((prev) => typeof patch === "function" ? patch(prev) : { ...prev, ...patch });
  }, []);

  const handleReset = useCallback(() => setCfg(DEFAULT_CONFIG), []);

  const handleSaveSnapshot = useCallback((name: string) => {
    const currentCfg = cfgRef.current;
    setSnapshots((prev) => {
      const updated = [...prev.filter((s) => s.name !== name), { name, cfg: currentCfg }];
      writeSnapshots(updated);
      return updated;
    });
  }, []);

  const handleLoadSnapshot = useCallback((name: string) => {
    setSnapshots((prev) => {
      const snap = prev.find((s) => s.name === name);
      if (snap) setCfg(snap.cfg);
      return prev;
    });
  }, []);

  const handleDeleteSnapshot = useCallback((name: string) => {
    setSnapshots((prev) => {
      const updated = prev.filter((s) => s.name !== name);
      writeSnapshots(updated);
      return updated;
    });
  }, []);

  if (!unlocked) {
    return <PassphraseGate onUnlock={() => setUnlocked(true)} />;
  }

  const {
    p2, p3, p4, staffMonthlyCost, staffPhase2Total, p2FullCost, p2MarginAtMin, p2MarginAtMax,
    rollupTotalDays, rollupLaborCost, rollupTravelCost, rollupTotalCost,
    rollupFeeMin, rollupFeeMax, rollupMarginAtMin, rollupMarginAtMax,
  } = deriveAll(cfg);

  function buildPlainText(): string {
    return [
      "HEADWATERS DEVELOPMENT SERVICES",
      "INTERNAL — CONFIDENTIAL",
      "Scope & Staffing Plan: Phases 2, 3, and 4",
      "Deer Lake First Nation · May 2026",
      "",
      "This document is for Bobbie's internal use only. It shows the real cost of delivery,",
      "staffing needs, and the pricing rationale that justifies what goes on the invoice.",
      "Not for distribution.",
      "",
      "═══════════════════════════════════",
      "PHASE 2 — THE BUILD",
      "═══════════════════════════════════",
      `Duration: ${cfg.phase2.remoteMonths} months remote + ${cfg.phase2.siteVisits} site visits × ${cfg.phase2.daysPerVisit} days`,
      "",
      "Time commitment:",
      `  Remote: ${p2.remoteDays} days (${cfg.phase2.remoteDaysPerMonth} days/month × ${cfg.phase2.remoteMonths} months)`,
      `  On-site: ${p2.onsiteDays} days (${cfg.phase2.siteVisits} visits × ${cfg.phase2.daysPerVisit} days)`,
      `  Total: ${p2.totalDays} days`,
      "",
      "Cost to deliver:",
      `  Labour: ${fmt(p2.laborCost)} (${p2.totalDays} days × ${cfg.hoursPerDay} hrs × ${fmt(cfg.hourlyRate)}/hr)`,
      `  Travel: ${fmt(p2.travelCost)} (${cfg.phase2.siteVisits} visits × ${fmt(cfg.phase2.travelCostPerVisit)})`,
      `  IT/Bookkeeping hire (${cfg.staffing.monthsCoveredInPhase2} months): ${fmt(staffPhase2Total)}`,
      `  TOTAL COST: ${fmt(p2FullCost)}`,
      "",
      `Proposed fee: ${fmt(cfg.phase2.proposedFeeMin)} – ${fmt(cfg.phase2.proposedFeeMax)}`,
      `Margin range: ${pct(p2MarginAtMin)} – ${pct(p2MarginAtMax)} (incl. hire absorption)`,
      "",
      "Note: IT/bookkeeping hire cost is absorbed into Phase 2 pricing.",
      "",
      "═══════════════════════════════════",
      "PHASE 3 — WINTER PAYOFF",
      "═══════════════════════════════════",
      `Duration: ${cfg.phase3.remoteMonths} months remote + ${cfg.phase3.siteVisits} site visits × ${cfg.phase3.daysPerVisit} days`,
      "",
      "Time commitment:",
      `  Remote: ${p3.remoteDays} days`,
      `  On-site: ${p3.onsiteDays} days`,
      `  Total: ${p3.totalDays} days`,
      "",
      "Cost to deliver:",
      `  Labour: ${fmt(p3.laborCost)}`,
      `  Travel: ${fmt(p3.travelCost)}`,
      `  TOTAL COST: ${fmt(p3.totalCost)}`,
      "",
      `Proposed fee: ${fmt(cfg.phase3.proposedFeeMin)} – ${fmt(cfg.phase3.proposedFeeMax)}`,
      `Margin range: ${pct(p3.marginAtMin)} – ${pct(p3.marginAtMax)}`,
      "",
      "═══════════════════════════════════",
      "PHASE 4 — HANDOFF & PILOT #2 BRIDGE",
      "═══════════════════════════════════",
      `Duration: ${cfg.phase4.remoteMonths} months at ~50% capacity + ${cfg.phase4.siteVisits} site visits × ${cfg.phase4.daysPerVisit} days`,
      "",
      "Time commitment:",
      `  Remote: ${p4.remoteDays} days`,
      `  On-site: ${p4.onsiteDays} days`,
      `  Total: ${p4.totalDays} days`,
      "",
      "Cost to deliver:",
      `  Labour: ${fmt(p4.laborCost)}`,
      `  Travel: ${fmt(p4.travelCost)}`,
      `  TOTAL COST: ${fmt(p4.totalCost)}`,
      "",
      `Proposed fee: ${fmt(cfg.phase4.proposedFeeMin)} – ${fmt(cfg.phase4.proposedFeeMax)}`,
      `Margin range: ${pct(p4.marginAtMin)} – ${pct(p4.marginAtMax)}`,
      "",
      "═══════════════════════════════════",
      "STAFFING — IT / BOOKKEEPING HIRE",
      "═══════════════════════════════════",
      "Role: Part-time IT/bookkeeping contractor",
      `Estimated hours/month: ${cfg.staffing.estimatedHoursPerMonth} hrs`,
      `Rate: ${fmt(cfg.staffing.contractorHourlyRate)}/hr`,
      `Monthly cost: ${fmt(staffMonthlyCost)}`,
      `Phase 2 total (${cfg.staffing.monthsCoveredInPhase2} months): ${fmt(staffPhase2Total)}`,
      "",
      "What this protects against:",
      "  · Domains & passwords — credentials owned by the community, not a departing consultant",
      "  · Comms — email accounts, distribution lists, and shared inboxes stay operational",
      "  · HST & government reporting — remittances filed correctly and on time from day one",
      "",
      "How it's priced: absorbed into Phase 2 fee. Not a separate line item on the invoice.",
      "",
      "═══════════════════════════════════",
      "PHASES 2–4 ROLLUP SUMMARY",
      "═══════════════════════════════════",
      "",
      "Phase-by-phase:",
      `  Phase 2 — The Build:     ${p2.totalDays} days · cost ${fmt(p2FullCost)} (incl. IT hire) · fee ${fmt(cfg.phase2.proposedFeeMin)}–${fmt(cfg.phase2.proposedFeeMax)} · margin ${pct(p2MarginAtMin)}–${pct(p2MarginAtMax)}`,
      `  Phase 3 — Winter Payoff: ${p3.totalDays} days · cost ${fmt(p3.totalCost)} · fee ${fmt(cfg.phase3.proposedFeeMin)}–${fmt(cfg.phase3.proposedFeeMax)} · margin ${pct(p3.marginAtMin)}–${pct(p3.marginAtMax)}`,
      `  Phase 4 — Handoff:       ${p4.totalDays} days · cost ${fmt(p4.totalCost)} · fee ${fmt(cfg.phase4.proposedFeeMin)}–${fmt(cfg.phase4.proposedFeeMax)} · margin ${pct(p4.marginAtMin)}–${pct(p4.marginAtMax)}`,
      "",
      "Totals:",
      `  Total Headwaters days committed: ${rollupTotalDays} days`,
      `  Total labour cost: ${fmt(rollupLaborCost)}`,
      `  Total travel cost: ${fmt(rollupTravelCost)}`,
      `  IT/Bookkeeping hire (${cfg.staffing.monthsCoveredInPhase2} months, absorbed into Phase 2): ${fmt(staffPhase2Total)}`,
      `  TOTAL COST TO DELIVER: ${fmt(rollupTotalCost)}`,
      "",
      `  Total proposed fee: ${fmt(rollupFeeMin)} – ${fmt(rollupFeeMax)} CAD excl. HST`,
      `  BLENDED GROSS MARGIN: ${pct(rollupMarginAtMin)} – ${pct(rollupMarginAtMax)} (incl. hire absorption)`,
    ].join("\n");
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <AssumptionsSidebar
        cfg={cfg}
        onChange={handleChange}
        onReset={handleReset}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        snapshots={snapshots}
        onSaveSnapshot={handleSaveSnapshot}
        onLoadSnapshot={handleLoadSnapshot}
        onDeleteSnapshot={handleDeleteSnapshot}
      />

      <PrintNav
        targetId="pdf-target"
        filename="headwaters-internal-scope-plan.pdf"
        onCopyPlainText={buildPlainText}
      />

      <div id="pdf-target" style={{ background: "#ccc9c0" }}>

        {/* ── COVER ── */}
        <div style={{ ...PAGE, background: "var(--evergreen)" }}>
          <div style={{ background: "#2c1810", padding: "0.12in 0.7in", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,180,130,0.85)", fontWeight: 700 }}>
              ⚑ Internal · Confidential · Not for distribution
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", color: "rgba(244,180,130,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              May 2026
            </p>
          </div>

          <div style={{ flex: 1, padding: "0.9in 0.7in 0.6in", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.18in", marginBottom: "0.5in" }}>
                <div style={{ width: "0.55in", height: 3, background: "var(--rust)" }} />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,237,224,0.45)" }}>
                  Headwaters Development Services
                </p>
              </div>

              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3.8rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.0, letterSpacing: "-0.025em", marginBottom: "0.28in" }}>
                Internal Scope<br />&amp; Staffing Plan
              </h1>

              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.88rem", color: "rgba(244,237,224,0.65)", lineHeight: 1.65, maxWidth: "4.8in", marginBottom: "0.22in" }}>
                The back-of-house numbers for Phases 2, 3, and 4 of the Deer Lake First Nation community store engagement. This is the document Bobbie negotiates from — not the client-facing pitch.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.18in", maxWidth: "5.5in", marginTop: "0.5in" }}>
                {[
                  { label: "Phase 2 fee range", value: `${fmt(cfg.phase2.proposedFeeMin)}–${fmt(cfg.phase2.proposedFeeMax)}` },
                  { label: "Phase 3 fee range", value: `${fmt(cfg.phase3.proposedFeeMin)}–${fmt(cfg.phase3.proposedFeeMax)}` },
                  { label: "Phase 4 fee range", value: `${fmt(cfg.phase4.proposedFeeMin)}–${fmt(cfg.phase4.proposedFeeMax)}` },
                ].map((item) => (
                  <div key={item.label} style={{ borderTop: "2px solid var(--rust)", paddingTop: "0.14in" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.45)", marginBottom: "0.06rem" }}>
                      {item.label}
                    </p>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.1 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ borderTop: "1px solid rgba(244,237,224,0.12)", paddingTop: "0.2in", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "rgba(244,237,224,0.45)", marginBottom: "0.04rem" }}>bobbie@ourheadwaters.ca</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "rgba(244,237,224,0.35)" }}>ourheadwaters.ca</p>
                </div>
                <div style={{ background: "rgba(244,237,224,0.08)", border: "1px solid rgba(244,237,224,0.15)", borderRadius: 4, padding: "0.1in 0.18in" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.4)", marginBottom: "0.03rem" }}>
                    Hourly rate used
                  </p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", fontWeight: 700, color: "rgba(244,237,224,0.7)" }}>
                    {fmt(cfg.hourlyRate)}/hr
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "100%", height: "0.12in", flexShrink: 0, background: "var(--rust)" }} />
        </div>

        {/* ── PHASE 2 ── */}
        <PhaseSection
          phaseLabel="Phase 2 · The Build · 4 months"
          subtitle="The store opens. We make sure it works."
          description={`Full-time remote presence (${cfg.phase2.remoteMonths} months) plus ${cfg.phase2.siteVisits} site visits of ${cfg.phase2.daysPerVisit} days each. Operator couple is hired and in place. Supply chain is live. Headwaters is on the ground once a month catching problems early. IT/bookkeeping hire is stood up and absorbed into this phase's fee.`}
          remoteDays={p2.remoteDays}
          remoteMonths={cfg.phase2.remoteMonths}
          remoteDaysPerMonth={cfg.phase2.remoteDaysPerMonth}
          onsiteDays={p2.onsiteDays}
          siteVisits={cfg.phase2.siteVisits}
          daysPerVisit={cfg.phase2.daysPerVisit}
          travelCostPerVisit={cfg.phase2.travelCostPerVisit}
          totalDays={p2.totalDays}
          laborCost={p2.laborCost}
          travelCost={p2.travelCost}
          extraCostLabel={`IT/bookkeeping hire (${cfg.staffing.monthsCoveredInPhase2} months × ${fmt(staffMonthlyCost)}/mo)`}
          extraCostValue={staffPhase2Total}
          totalCost={p2FullCost}
          feeMin={cfg.phase2.proposedFeeMin}
          feeMax={cfg.phase2.proposedFeeMax}
          marginMin={p2MarginAtMin}
          marginMax={p2MarginAtMax}
          marginNote="incl. hire absorption"
          hoursPerDay={cfg.hoursPerDay}
          hourlyRate={cfg.hourlyRate}
          notes={[
            "Summer freight runs by air — margins will be tight and that's planned for. The store is proving it can operate, not proving it can profit. Numbers improve when winter roads open.",
            "IT/bookkeeping hire is not a separate line on the client invoice. It's baked into the Phase 2 fee. This protects Bobbie's time and keeps the client from nickel-and-diming the admin function.",
            "Phase 2 fee is confirmed at the end of Phase 1 once actual scope and staffing needs are clear. The range above is the negotiating window.",
          ]}
          pageNum="2 of 6"
        />

        {/* ── PHASE 3 ── */}
        <PhaseSection
          phaseLabel="Phase 3 · Winter Payoff · 3 months"
          subtitle="Winter roads open. The economics flip."
          description={`Lighter presence — ${cfg.phase3.remoteMonths} months remote at roughly ${cfg.phase3.remoteDaysPerMonth} days/month, plus ${cfg.phase3.siteVisits} site visits of ${cfg.phase3.daysPerVisit} days each. Bulk truck delivery replaces air freight. Cost per item drops. The goal is to lock in the lower-cost supply chain and produce a clean financial record the band can use with funders.`}
          remoteDays={p3.remoteDays}
          remoteMonths={cfg.phase3.remoteMonths}
          remoteDaysPerMonth={cfg.phase3.remoteDaysPerMonth}
          onsiteDays={p3.onsiteDays}
          siteVisits={cfg.phase3.siteVisits}
          daysPerVisit={cfg.phase3.daysPerVisit}
          travelCostPerVisit={cfg.phase3.travelCostPerVisit}
          totalDays={p3.totalDays}
          laborCost={p3.laborCost}
          travelCost={p3.travelCost}
          totalCost={p3.totalCost}
          feeMin={cfg.phase3.proposedFeeMin}
          feeMax={cfg.phase3.proposedFeeMax}
          marginMin={p3.marginAtMin}
          marginMax={p3.marginAtMax}
          hoursPerDay={cfg.hoursPerDay}
          hourlyRate={cfg.hourlyRate}
          notes={[
            "Phase 3 scope is discussed after Phase 2 — the operating rhythm of the store determines what level of support is actually needed.",
            "Deliverable: a clean financial record showing what the store earns in its first winter. This is the document that makes future grant applications credible.",
            "IT/bookkeeping hire is already in place from Phase 2 — no additional absorption needed here. The contractor continues independently.",
          ]}
          pageNum="3 of 6"
        />

        {/* ── PHASE 4 ── */}
        <PhaseSection
          phaseLabel="Phase 4 · Handoff & Pilot #2 Bridge · 6 months"
          subtitle="50% capacity. Community owns it. Pilot #2 is named."
          description={`${cfg.phase4.remoteMonths} months at roughly ${cfg.phase4.remoteDaysPerMonth} days/month — 50% of a standard working month. Community engagement, Codetry handoff, feast/celebration, and documentation of everything needed to run Pilot #2 without starting from scratch. ${cfg.phase4.siteVisits} site visits of ${cfg.phase4.daysPerVisit} days (shorter, handoff-focused).`}
          remoteDays={p4.remoteDays}
          remoteMonths={cfg.phase4.remoteMonths}
          remoteDaysPerMonth={cfg.phase4.remoteDaysPerMonth}
          onsiteDays={p4.onsiteDays}
          siteVisits={cfg.phase4.siteVisits}
          daysPerVisit={cfg.phase4.daysPerVisit}
          travelCostPerVisit={cfg.phase4.travelCostPerVisit}
          totalDays={p4.totalDays}
          laborCost={p4.laborCost}
          travelCost={p4.travelCost}
          totalCost={p4.totalCost}
          feeMin={cfg.phase4.proposedFeeMin}
          feeMax={cfg.phase4.proposedFeeMax}
          marginMin={p4.marginAtMin}
          marginMax={p4.marginAtMax}
          hoursPerDay={cfg.hoursPerDay}
          hourlyRate={cfg.hourlyRate}
          notes={[
            "The feast/celebration visit is one of the two on-site trips. It's not fluff — it's the community recognition moment that closes the loop and makes the next pilot possible.",
            "Codetry handoff includes everything in a format the community owns outright. No ongoing login, no subscription, no dependency on Headwaters to keep it running.",
            "By end of Phase 4, Pilot #2 should have a named candidate community, not just a waitlist. The scoring sheet from the reserve list drives this.",
          ]}
          pageNum="4 of 6"
        />

        {/* ── STAFFING ── */}
        <div style={PAGE}>
          <div style={{ background: "#2c1810", padding: "0.1in 0.7in", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,180,130,0.75)" }}>
              Internal · Confidential · Not for distribution
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,180,130,0.5)" }}>
              Headwaters Development Services
            </p>
          </div>

          <div style={{ background: "var(--rust)", padding: "0.38in 0.7in 0.32in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "0.1rem" }}>
              Staffing — IT / Bookkeeping Hire
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "0.1rem" }}>
              The hire that protects<br />everything else.
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.55, maxWidth: "5.6in" }}>
              A part-time IT/bookkeeping contractor — not a full-time employee, not a big-firm accountant. Someone reliable who knows government reporting and can keep the digital infrastructure out of Bobbie's hands.
            </p>
          </div>

          <div style={{ flex: 1, padding: "0.36in 0.7in 0.3in", display: "flex", flexDirection: "column", gap: "0.28in" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3in" }}>
              <div>
                <p style={{ ...LABEL, marginBottom: "0.14in" }}>What the role covers</p>
                {[
                  { head: "Domains & passwords", body: "Digital credentials are owned by the community from day one — not Bobbie's personal accounts. If someone leaves, nothing breaks." },
                  { head: "Comms infrastructure", body: "Email accounts, distribution lists, shared inboxes. The store's communication stack stays operational and community-controlled." },
                  { head: "HST & government reporting", body: "Remittances filed correctly and on time from the moment the store opens. No scrambling at year-end. No penalties for a late filing." },
                ].map((item) => (
                  <div key={item.head} style={{ borderTop: "1px solid rgba(31,61,46,0.1)", paddingTop: "0.12in", marginBottom: "0.14in" }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>{item.head}</p>
                    <p style={MUTED}>{item.body}</p>
                  </div>
                ))}
              </div>

              <div>
                <p style={{ ...LABEL, marginBottom: "0.14in" }}>Cost breakdown</p>
                <DataRow label="Hours per month" value={`${cfg.staffing.estimatedHoursPerMonth} hrs`} />
                <DataRow label="Contractor rate" value={`${fmt(cfg.staffing.contractorHourlyRate)}/hr`} />
                <DataRow label="Monthly cost" value={fmt(staffMonthlyCost)} />
                <DataRow label={`Phase 2 total (${cfg.staffing.monthsCoveredInPhase2} months)`} value={fmt(staffPhase2Total)} accent />

                <div style={{ background: "rgba(184,90,62,0.08)", borderLeft: "3px solid var(--rust)", padding: "0.13in 0.16in", borderRadius: "0 4px 4px 0", marginTop: "0.18in" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.08rem" }}>
                    How it's priced
                  </p>
                  <p style={MUTED}>
                    Absorbed into the Phase 2 fee. It does not appear as a separate line item on the client invoice. The client is paying for the whole Phase 2 engagement — the hire is Headwaters' cost of delivery.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(31,61,46,0.04)", borderRadius: 6, padding: "0.2in 0.26in" }}>
              <p style={{ ...LABEL, marginBottom: "0.12in" }}>Why this protects Bobbie</p>
              <p style={MUTED}>
                Without this hire, Bobbie becomes the de facto IT person and bookkeeper — fielding password resets, chasing receipts, and explaining HST to a band administrator at 11pm. That's not what the engagement is for. The hire creates a clean boundary: Headwaters handles strategy and operations, the contractor handles compliance and infrastructure. Both are accountable. Neither is doing the other's job.
              </p>
            </div>

            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.1)", paddingTop: "0.15in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Internal — not for distribution
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>5 of 6</p>
            </div>

          </div>
        </div>

        {/* ── ROLLUP SUMMARY ── */}
        <div style={PAGE}>
          <div style={{ background: "#2c1810", padding: "0.1in 0.7in", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,180,130,0.75)" }}>
              Internal · Confidential · Not for distribution
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,180,130,0.5)" }}>
              Headwaters Development Services
            </p>
          </div>

          <div style={{ background: "var(--evergreen)", padding: "0.38in 0.7in 0.32in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "0.1rem" }}>
              Phases 2–4 · Full Engagement Summary
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "0.1rem" }}>
              The whole picture,<br />in one place.
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(244,237,224,0.7)", lineHeight: 1.55, maxWidth: "5.6in" }}>
              Total days committed, total cost to deliver, and the blended margin across the full multi-year engagement. This is the number Bobbie walks into a multi-year negotiation with.
            </p>
          </div>

          <div style={{ flex: 1, padding: "0.36in 0.7in 0.3in", display: "flex", flexDirection: "column", gap: "0.28in" }}>

            {/* Phase-by-phase table */}
            <div>
              <p style={{ ...LABEL, marginBottom: "0.14in" }}>Phase-by-phase breakdown</p>

              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1.6in 0.9in 1fr 1fr 0.9in",
                gap: "0 0.12in",
                paddingBottom: "0.07in",
                borderBottom: "2px solid rgba(31,61,46,0.15)",
                marginBottom: "0.04in",
              }}>
                {["Phase", "Days", "Cost to deliver", "Proposed fee", "Margin"].map((h) => (
                  <p key={h} style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(31,61,46,0.4)" }}>{h}</p>
                ))}
              </div>

              {/* Phase rows */}
              {[
                {
                  label: "Phase 2 — The Build",
                  days: p2.totalDays,
                  cost: p2FullCost,
                  feeMin: cfg.phase2.proposedFeeMin,
                  feeMax: cfg.phase2.proposedFeeMax,
                  marginMin: p2MarginAtMin,
                  marginMax: p2MarginAtMax,
                  note: "incl. IT/bookkeeping hire",
                },
                {
                  label: "Phase 3 — Winter Payoff",
                  days: p3.totalDays,
                  cost: p3.totalCost,
                  feeMin: cfg.phase3.proposedFeeMin,
                  feeMax: cfg.phase3.proposedFeeMax,
                  marginMin: p3.marginAtMin,
                  marginMax: p3.marginAtMax,
                },
                {
                  label: "Phase 4 — Handoff",
                  days: p4.totalDays,
                  cost: p4.totalCost,
                  feeMin: cfg.phase4.proposedFeeMin,
                  feeMax: cfg.phase4.proposedFeeMax,
                  marginMin: p4.marginAtMin,
                  marginMax: p4.marginAtMax,
                },
              ].map((row) => (
                <div key={row.label} style={{
                  display: "grid",
                  gridTemplateColumns: "1.6in 0.9in 1fr 1fr 0.9in",
                  gap: "0 0.12in",
                  alignItems: "baseline",
                  borderBottom: "1px solid rgba(31,61,46,0.07)",
                  padding: "0.065in 0",
                }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.73rem", color: "var(--ink)", fontWeight: 600 }}>{row.label}</p>
                    {row.note && <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "var(--muted)" }}>{row.note}</p>}
                  </div>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.78rem", color: "var(--ink)" }}>{row.days} days</p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.78rem", color: "var(--ink)" }}>{fmt(row.cost)}</p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.78rem", color: "var(--ink)" }}>{fmt(row.feeMin)} – {fmt(row.feeMax)}</p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.78rem", color: "var(--ink)" }}>{pct(row.marginMin)}–{pct(row.marginMax)}</p>
                </div>
              ))}

              {/* Totals row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1.6in 0.9in 1fr 1fr 0.9in",
                gap: "0 0.12in",
                alignItems: "baseline",
                borderTop: "2px solid var(--evergreen)",
                paddingTop: "0.1in",
                marginTop: "0.04in",
              }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 700, color: "var(--evergreen)" }}>Total (Phases 2–4)</p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)" }}>{rollupTotalDays} days</p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)" }}>{fmt(rollupTotalCost)}</p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)" }}>{fmt(rollupFeeMin)} – {fmt(rollupFeeMax)}</p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)" }}>{pct(rollupMarginAtMin)}–{pct(rollupMarginAtMax)}</p>
              </div>
            </div>

            {/* Cost structure callout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.2in" }}>
              {[
                { label: "Total labour cost", value: fmt(rollupLaborCost), note: `${rollupTotalDays} days × ${cfg.hoursPerDay} hrs × ${fmt(cfg.hourlyRate)}/hr` },
                { label: "Total travel cost", value: fmt(rollupTravelCost), note: `${cfg.phase2.siteVisits + cfg.phase3.siteVisits + cfg.phase4.siteVisits} site visits across all phases` },
                { label: "IT/bookkeeping hire", value: fmt(staffPhase2Total), note: `${cfg.staffing.monthsCoveredInPhase2} months · absorbed into Phase 2` },
              ].map((item) => (
                <div key={item.label} style={{ borderTop: "2px solid rgba(31,61,46,0.15)", paddingTop: "0.12in" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(31,61,46,0.4)", marginBottom: "0.04rem" }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.1, marginBottom: "0.04rem" }}>
                    {item.value}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "var(--muted)" }}>{item.note}</p>
                </div>
              ))}
            </div>

            {/* Blended margin block */}
            <div style={{
              background: "var(--evergreen)",
              borderRadius: 6,
              padding: "0.18in 0.24in",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.3in",
            }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.04rem" }}>
                  Total engagement fee (Phases 2–4)
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1 }}>
                  {fmt(rollupFeeMin)} – {fmt(rollupFeeMax)}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", marginTop: "0.03rem" }}>CAD · excl. HST · sum of all three phases</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.04rem" }}>
                  Blended gross margin
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>
                  {pct(rollupMarginAtMin)} – {pct(rollupMarginAtMax)}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", marginTop: "0.03rem" }}>across all phases incl. hire absorption</p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.1)", paddingTop: "0.15in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Internal — not for distribution
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>6 of 6</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

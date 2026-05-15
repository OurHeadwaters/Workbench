/**
 * HoursByPillar.tsx — Quarterly hours-by-pillar tracking with Hard Rule 02 enforcement
 *
 * Merged from:
 *   Task #68 — Quarter history + automatic Hard Rule 02 (two-quarter pause trigger)
 *   Task #69 — Per-role per-pillar inputs locked to contractBaselines.ts
 *
 * Flow:
 *   1. Bookkeeper fills in actual hours per role per pillar for the draft quarter.
 *   2. Pillar allocations are locked to contractBaselines.ts — read-only here.
 *   3. Drift from the contracted baseline % is flagged per cell automatically.
 *   4. "Lock this quarter" saves an immutable snapshot (pillar hours + totals) and clears the draft.
 *   5. Hard Rule 02 fires when the last two snapshots are both under the aggregate baseline.
 *   6. Roles not in the contract baseline are flagged and block locking.
 *
 * Baselines live in: src/data/contractBaselines.ts
 * To amend baselines: /contract-terms
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "wouter";
import {
  loadSnapshots,
  loadDraft,
  saveDraft,
  appendSnapshot,
  deleteSnapshot,
  clearDraft,
  isTwoQuarterTriggerFired,
  isUnderBaseline,
  nextQuarterId,
  formatQuarterLabel,
  currentQuarterId,
  type QuarterSnapshot,
  type QuarterDraft,
  type RoleEntry,
} from "@/lib/storage";
import {
  BASELINES,
  PILLARS,
  CONTRACT_LABEL,
  CONTRACT_VERSION,
  getBaseline,
  type PillarId,
} from "@/data/contractBaselines";

// ── Design tokens ─────────────────────────────────────────────────────────────
const CREAM = "#f4ede0";
const DARK  = "#1f3d2e";
const AMBER = "#b85a3e";
const GREEN = "#2d6a4f";
const MUTED = "#6b7665";
const RULE  = "#c8bfa7";
const TEXT  = "#2a2520";
const BG    = "#d8d2c8";
const MONO  = "'IBM Plex Mono', ui-monospace, monospace";
const SERIF = "Fraunces, Georgia, serif";
const SANS  = "Inter, system-ui, sans-serif";

// ── Shared table styles ────────────────────────────────────────────────────────
const TH: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  color: MUTED,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  padding: "6px 12px",
  textAlign: "left",
  borderBottom: `1px solid ${RULE}`,
};
const TD: React.CSSProperties = {
  padding: "8px 12px",
  fontFamily: SANS,
  fontSize: 13,
  color: TEXT,
};

// ── Default role list seeded from the contract baselines ──────────────────────
//
// baselineHrs = contractedHrsPerMonth × 3 (one quarter ≈ 3 months)
//
function makeDefaultRoles(): RoleEntry[] {
  return BASELINES.map((r) => ({
    roleId:      r.roleId,
    label:       r.label,
    baselineHrs: r.contractedHrsPerMonth * 3,
    actualHrs:   0,
  }));
}

function makeDraftFromPrev(prevId: string, prevRoles: RoleEntry[]): QuarterDraft {
  const newId = nextQuarterId(prevId);
  return {
    id:    newId,
    label: formatQuarterLabel(newId),
    roles: prevRoles.map((r) => ({ ...r, actualHrs: 0, pillars: undefined })),
  };
}

function makeInitialDraft(): QuarterDraft {
  const id = currentQuarterId();
  return { id, label: formatQuarterLabel(id), roles: makeDefaultRoles() };
}

// ── Pillar-input helpers ───────────────────────────────────────────────────────

type PillarInputs = Record<string, Record<PillarId, string>>;

function blankPillarInputs(): PillarInputs {
  return Object.fromEntries(
    BASELINES.map((r) => [r.roleId, { cfs: "", ops: "", gov: "", eng: "" }])
  );
}

function pillarInputsFromRoles(roles: RoleEntry[]): PillarInputs {
  const result: PillarInputs = {};
  for (const role of roles) {
    if (role.pillars) {
      result[role.roleId] = {
        cfs: role.pillars["cfs"] > 0 ? String(role.pillars["cfs"]) : "",
        ops: role.pillars["ops"] > 0 ? String(role.pillars["ops"]) : "",
        gov: role.pillars["gov"] > 0 ? String(role.pillars["gov"]) : "",
        eng: role.pillars["eng"] > 0 ? String(role.pillars["eng"]) : "",
      };
    } else {
      result[role.roleId] = { cfs: "", ops: "", gov: "", eng: "" };
    }
  }
  return result;
}

function totalFromInputs(inputs: Record<PillarId, string>): number {
  return PILLARS.reduce((sum, p) => {
    const v = parseFloat(inputs[p.id] ?? "");
    return sum + (isNaN(v) ? 0 : v);
  }, 0);
}

function pillarPct(inputs: Record<PillarId, string>, pillarId: PillarId): number | null {
  const total = totalFromInputs(inputs);
  if (total === 0) return null;
  const v = parseFloat(inputs[pillarId] ?? "");
  if (isNaN(v)) return null;
  return Math.round((v / total) * 100);
}

function driftPp(
  inputs: Record<PillarId, string>,
  baselinePct: number,
  pillarId: PillarId
): number | null {
  const actual = pillarPct(inputs, pillarId);
  if (actual === null) return null;
  return actual - baselinePct;
}

function fmtDrift(d: number | null): string {
  if (d === null) return "—";
  if (d === 0) return "on target";
  return (d > 0 ? "+" : "") + d + "pp";
}

function driftColor(d: number | null): string {
  if (d === null) return MUTED;
  const abs = Math.abs(d);
  if (abs <= 5)  return GREEN;
  if (abs <= 15) return "#b07d2e";
  return AMBER;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ContractBanner() {
  return (
    <div
      style={{
        background: DARK,
        color: CREAM,
        borderRadius: 8,
        padding: "12px 18px",
        fontFamily: MONO,
        fontSize: 11,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      <span style={{ opacity: 0.6 }}>Contracted baselines locked to</span>
      <span style={{ fontWeight: 700, letterSpacing: "0.08em" }}>{CONTRACT_LABEL}</span>
      <span style={{ opacity: 0.6, flex: 1 }}>
        · Read-only here ·{" "}
        <Link
          href="/contract-terms"
          style={{ color: "#a8d5b5", textDecoration: "underline", cursor: "pointer" }}
        >
          Amend contract terms
        </Link>
      </span>
    </div>
  );
}

function TriggerBanner() {
  return (
    <div
      style={{
        background: "#4a0e0e",
        color: "#fde8e0",
        borderLeft: `4px solid ${AMBER}`,
        padding: "14px 20px",
        borderRadius: 6,
        fontFamily: SANS,
        fontSize: 14,
        lineHeight: 1.6,
        marginBottom: 24,
      }}
    >
      <strong style={{ fontFamily: SERIF, fontSize: 16, display: "block", marginBottom: 4 }}>
        Hard Rule 02 — Pause Trigger Fired
      </strong>
      Two consecutive quarters have come in under the contracted baseline. Per
      the engagement contract, a formal pause review is required before the next
      quarter begins. This banner cannot be dismissed — resolve the review first.
    </div>
  );
}

function PillarLegend() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
      {PILLARS.map((p) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color }} />
          <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: "0.1em" }}>
            {p.id.toUpperCase()} — {p.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function VariancePill({ actual, baseline }: { actual: number; baseline: number }) {
  const delta = actual - baseline;
  const pct   = baseline > 0 ? Math.round((delta / baseline) * 100) : 0;
  const under = delta < 0;
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 11,
        padding: "2px 7px",
        borderRadius: 4,
        background: under ? "#fde8e0" : "#e0f2e8",
        color: under ? AMBER : GREEN,
        whiteSpace: "nowrap",
      }}
    >
      {under ? "−" : "+"}
      {Math.abs(pct)}%&nbsp;({delta >= 0 ? "+" : ""}
      {delta.toFixed(1)} hrs)
    </span>
  );
}

// ── Snapshot history row ───────────────────────────────────────────────────────

interface SnapshotRowProps {
  snapshot: QuarterSnapshot;
  onDelete: (id: string) => void;
  isLatest: boolean;
}

function SnapshotRow({ snapshot, onDelete, isLatest }: SnapshotRowProps) {
  const [expanded, setExpanded] = useState(false);
  const under        = isUnderBaseline(snapshot);
  const totalActual  = snapshot.roles.reduce((s, r) => s + r.actualHrs,   0);
  const totalBaseline = snapshot.roles.reduce((s, r) => s + r.baselineHrs, 0);
  const delta        = totalActual - totalBaseline;
  const pct          = totalBaseline > 0 ? Math.round((delta / totalBaseline) * 100) : 0;

  return (
    <div
      style={{
        background: CREAM,
        border: `1px solid ${under ? "#e8b8a8" : RULE}`,
        borderLeft: `3px solid ${under ? AMBER : GREEN}`,
        borderRadius: 6,
        marginBottom: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          cursor: "pointer",
        }}
        onClick={() => setExpanded((x) => !x)}
      >
        <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: DARK, minWidth: 80 }}>
          {snapshot.label}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            padding: "2px 7px",
            borderRadius: 4,
            background: under ? "#fde8e0" : "#e0f2e8",
            color: under ? AMBER : GREEN,
          }}
        >
          {under ? "UNDER" : "MET"}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: MUTED, flex: 1 }}>
          {totalActual.toLocaleString()} / {totalBaseline.toLocaleString()} hrs total
          &nbsp;({delta >= 0 ? "+" : ""}
          {pct}%)
        </span>
        {isLatest && (
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: MUTED,
              padding: "1px 6px",
              border: `1px solid ${RULE}`,
              borderRadius: 3,
            }}
          >
            latest
          </span>
        )}
        <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
          Locked {new Date(snapshot.lockedAt).toLocaleDateString("en-CA")}
        </span>
        <span style={{ color: MUTED, fontSize: 14 }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div style={{ padding: "0 16px 14px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={TH}>Role</th>
                <th style={{ ...TH, textAlign: "right" }}>Baseline hrs</th>
                <th style={{ ...TH, textAlign: "right" }}>Actual hrs</th>
                {PILLARS.map((p) => (
                  <th
                    key={p.id}
                    style={{ ...TH, textAlign: "right", color: p.color }}
                  >
                    {p.id.toUpperCase()}
                  </th>
                ))}
                <th style={{ ...TH, textAlign: "right" }}>Variance</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.roles.map((r) => (
                <tr key={r.roleId} style={{ borderBottom: `1px solid ${RULE}` }}>
                  <td style={TD}>{r.label}</td>
                  <td style={{ ...TD, textAlign: "right", fontFamily: MONO }}>
                    {r.baselineHrs.toLocaleString()}
                  </td>
                  <td
                    style={{
                      ...TD,
                      textAlign: "right",
                      fontFamily: MONO,
                      color: r.actualHrs < r.baselineHrs ? AMBER : GREEN,
                    }}
                  >
                    {r.actualHrs.toLocaleString()}
                  </td>
                  {PILLARS.map((p) => {
                    const hrs = r.pillars?.[p.id];
                    return (
                      <td
                        key={p.id}
                        style={{ ...TD, textAlign: "right", fontFamily: MONO, fontSize: 11 }}
                      >
                        {hrs !== undefined && hrs > 0 ? hrs.toFixed(1) : "—"}
                      </td>
                    );
                  })}
                  <td style={{ ...TD, textAlign: "right" }}>
                    <VariancePill actual={r.actualHrs} baseline={r.baselineHrs} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete snapshot for ${snapshot.label}? This cannot be undone.`)) {
                  onDelete(snapshot.id);
                }
              }}
              style={{
                background: "transparent",
                border: `1px solid #e8b8a8`,
                color: AMBER,
                fontFamily: MONO,
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Delete snapshot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Trend strip ────────────────────────────────────────────────────────────────

function TrendStrip({ snapshots }: { snapshots: QuarterSnapshot[] }) {
  if (snapshots.length === 0) return null;
  const maxActual = Math.max(
    ...snapshots.map((s) => s.roles.reduce((sum, r) => sum + r.actualHrs, 0))
  );
  return (
    <div
      style={{
        background: CREAM,
        border: `1px solid ${RULE}`,
        borderRadius: 6,
        padding: "14px 16px",
        marginBottom: 10,
      }}
    >
      <p
        style={{
          fontFamily: MONO,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: MUTED,
          margin: "0 0 10px",
        }}
      >
        Total hours vs baseline — last {snapshots.length} quarter
        {snapshots.length !== 1 ? "s" : ""}
      </p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 60 }}>
        {snapshots.map((s) => {
          const total    = s.roles.reduce((sum, r) => sum + r.actualHrs,   0);
          const baseline = s.roles.reduce((sum, r) => sum + r.baselineHrs, 0);
          const under    = total < baseline;
          const heightPct = maxActual > 0 ? Math.max(4, (total / maxActual) * 100) : 4;
          return (
            <div
              key={s.id}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}
            >
              <span style={{ fontFamily: MONO, fontSize: 10, color: under ? AMBER : GREEN }}>
                {total.toLocaleString()}
              </span>
              <div
                style={{
                  width: "100%",
                  height: `${heightPct}%`,
                  background: under ? "#e8b8a8" : "#a8d8b8",
                  borderRadius: "3px 3px 0 0",
                  minHeight: 4,
                }}
              />
              <span style={{ fontFamily: MONO, fontSize: 9, color: MUTED }}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HoursByPillar() {
  const [snapshots, setSnapshots] = useState<QuarterSnapshot[]>([]);
  const [draft, setDraft]         = useState<QuarterDraft | null>(null);
  const [pillarInputs, setPillarInputs] = useState<PillarInputs>(blankPillarInputs);

  // Load from storage on mount
  useEffect(() => {
    setSnapshots(loadSnapshots());
    const saved = loadDraft();
    if (saved) {
      setDraft(saved);
      setPillarInputs(pillarInputsFromRoles(saved.roles));
    } else {
      const initial = makeInitialDraft();
      setDraft(initial);
      setPillarInputs(blankPillarInputs());
    }
  }, []);

  // Persist draft whenever it changes
  useEffect(() => {
    if (draft) saveDraft(draft);
  }, [draft]);

  const triggerFired = isTwoQuarterTriggerFired(snapshots);

  // ── Prev-Q status (informational) ────────────────────────────────────────────
  const prevSnapshot = useMemo(() => {
    if (snapshots.length === 0) return null;
    return [...snapshots].sort(
      (a, b) => new Date(b.lockedAt).getTime() - new Date(a.lockedAt).getTime()
    )[0];
  }, [snapshots]);
  const prevUnder = prevSnapshot ? isUnderBaseline(prevSnapshot) : false;

  // ── Pillar input change ───────────────────────────────────────────────────────
  const handlePillarChange = useCallback(
    (roleId: string, pillarId: PillarId, value: string) => {
      setPillarInputs((prev) => {
        const updated = {
          ...prev,
          [roleId]: { ...(prev[roleId] ?? {}), [pillarId]: value },
        };
        // Sync actual hours on the draft
        setDraft((d) => {
          if (!d) return d;
          const total = totalFromInputs(updated[roleId] ?? {});
          const pillarNums: Record<string, number> = {};
          for (const p of PILLARS) {
            const v = parseFloat(updated[roleId]?.[p.id] ?? "");
            pillarNums[p.id] = isNaN(v) ? 0 : v;
          }
          return {
            ...d,
            roles: d.roles.map((r) =>
              r.roleId === roleId ? { ...r, actualHrs: total, pillars: pillarNums } : r
            ),
          };
        });
        return updated;
      });
    },
    []
  );

  const handleDraftLabelChange = useCallback((value: string) => {
    setDraft((prev) => (prev ? { ...prev, label: value } : prev));
  }, []);

  // ── Draft aggregate totals ────────────────────────────────────────────────────
  const draftTotalActual   = draft?.roles.reduce((s, r) => s + r.actualHrs,   0) ?? 0;
  const draftTotalBaseline = draft?.roles.reduce((s, r) => s + r.baselineHrs, 0) ?? 0;
  const draftUnder         = draftTotalActual > 0 && draftTotalActual < draftTotalBaseline;

  // Unknown roles: roles in the draft that are NOT in contractBaselines
  const unknownRoles = useMemo(
    () => (draft?.roles ?? []).filter((r) => !getBaseline(r.roleId)),
    [draft]
  );

  // ── Lock draft → snapshot ────────────────────────────────────────────────────
  const handleLock = useCallback(() => {
    if (!draft) return;
    if (draftTotalActual === 0) {
      alert("All actual hours are zero. Enter the actual hours before locking this quarter.");
      return;
    }
    if (unknownRoles.length > 0) {
      alert(
        `${unknownRoles.length} role(s) are not in the contract baseline. ` +
        "Resolve them on the Contract Terms page before locking."
      );
      return;
    }
    // Build snapshot — each role carries its pillar breakdown
    const snapshot: QuarterSnapshot = {
      id:       draft.id,
      label:    draft.label,
      lockedAt: new Date().toISOString(),
      roles:    draft.roles.map((r) => {
        const pIn = pillarInputs[r.roleId] ?? {};
        const pillarNums: Record<string, number> = {};
        for (const p of PILLARS) {
          const v = parseFloat(pIn[p.id] ?? "");
          pillarNums[p.id] = isNaN(v) ? 0 : v;
        }
        return { ...r, pillars: pillarNums };
      }),
    };
    appendSnapshot(snapshot);
    setSnapshots(loadSnapshots());
    clearDraft();
    setDraft(null);
    setPillarInputs(blankPillarInputs());
  }, [draft, draftTotalActual, unknownRoles, pillarInputs]);

  // ── Start new quarter ─────────────────────────────────────────────────────────
  const handleNewQuarter = useCallback(() => {
    const sorted = [...snapshots].sort(
      (a, b) => new Date(a.lockedAt).getTime() - new Date(b.lockedAt).getTime()
    );
    const last    = sorted[sorted.length - 1];
    const newDraft = last
      ? makeDraftFromPrev(last.id, last.roles)
      : makeInitialDraft();
    setDraft(newDraft);
    setPillarInputs(blankPillarInputs());
  }, [snapshots]);

  // ── Delete snapshot ───────────────────────────────────────────────────────────
  const handleDelete = useCallback((id: string) => {
    deleteSnapshot(id);
    setSnapshots(loadSnapshots());
  }, []);

  // ── Sort snapshots newest first ───────────────────────────────────────────────
  const sortedSnapshots = useMemo(
    () => [...snapshots].sort((a, b) => new Date(b.lockedAt).getTime() - new Date(a.lockedAt).getTime()),
    [snapshots]
  );
  const latestId = sortedSnapshots[0]?.id;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: SANS, color: TEXT }}>
      <div style={{ maxWidth: 1050, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <Link
            href="/"
            style={{ fontFamily: MONO, fontSize: 11, color: MUTED, textDecoration: "none", letterSpacing: "0.12em" }}
          >
            ← DECK
          </Link>
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.22em",
            color: MUTED,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Quarterly report
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: DARK, marginBottom: 4, lineHeight: 1.2 }}>
          Hours by Pillar
        </h1>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 24, maxWidth: 640 }}>
          Enter actual hours per role per pillar. Baseline allocations are locked to the contract
          and shown read-only. Hard Rule 02 fires automatically from saved history — no manual checkbox required.
        </p>

        <ContractBanner />

        {/* Hard Rule 02 banner */}
        {triggerFired && <TriggerBanner />}

        {/* ── Draft editor ──────────────────────────────────────────────────── */}
        {draft ? (
          <section
            style={{
              background: CREAM,
              border: `1px solid ${RULE}`,
              borderRadius: 8,
              marginBottom: 32,
              overflow: "hidden",
            }}
          >
            {/* Section header */}
            <div
              style={{
                padding: "16px 20px 14px",
                borderBottom: `1px solid ${RULE}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: MUTED,
                  background: "#e8e0d0",
                  padding: "2px 8px",
                  borderRadius: 3,
                }}
              >
                Draft
              </span>
              <input
                value={draft.label}
                onChange={(e) => handleDraftLabelChange(e.target.value)}
                style={{
                  fontFamily: SERIF,
                  fontSize: 18,
                  fontWeight: 600,
                  color: DARK,
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px dashed ${RULE}`,
                  outline: "none",
                  padding: "0 2px",
                  minWidth: 100,
                }}
              />
              {prevSnapshot && (
                <span style={{ fontFamily: MONO, fontSize: 11, color: prevUnder ? AMBER : GREEN, marginLeft: "auto" }}>
                  Prev Q ({prevSnapshot.label}):&nbsp;
                  <strong>{prevUnder ? "UNDER baseline" : "met baseline"}</strong>
                  &nbsp;— auto-derived
                </span>
              )}
            </div>

            {/* Pillar legend */}
            <div style={{ padding: "14px 20px 0" }}>
              <PillarLegend />
            </div>

            {/* Unknown-role warning */}
            {unknownRoles.length > 0 && (
              <div
                style={{
                  margin: "0 20px 14px",
                  padding: "10px 14px",
                  background: "#fff3cd",
                  border: "1px solid #ffc107",
                  borderRadius: 6,
                  fontFamily: MONO,
                  fontSize: 11,
                  color: "#7c5700",
                }}
              >
                <strong>⚠ {unknownRoles.length} role(s) not in the contract baseline:</strong>{" "}
                {unknownRoles.map((r) => r.roleId).join(", ")}.{" "}
                <Link href="/contract-terms" style={{ color: AMBER, fontWeight: 700 }}>
                  Add them on the Contract Terms page
                </Link>{" "}
                before locking.
              </div>
            )}

            {/* Role × Pillar table */}
            <div style={{ overflowX: "auto", padding: "0 0 8px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr style={{ background: DARK, color: CREAM }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        fontFamily: MONO,
                        fontSize: 10,
                        letterSpacing: "0.15em",
                        fontWeight: 600,
                        minWidth: 190,
                      }}
                    >
                      ROLE
                    </th>
                    {PILLARS.map((p) => (
                      <th
                        key={p.id}
                        style={{
                          textAlign: "center",
                          padding: "10px 8px",
                          fontFamily: MONO,
                          fontSize: 9,
                          letterSpacing: "0.15em",
                          borderLeft: "1px solid rgba(255,255,255,0.12)",
                          minWidth: 100,
                        }}
                      >
                        <span style={{ color: p.color, filter: "brightness(1.6)" }}>
                          {p.id.toUpperCase()}
                        </span>
                        <br />
                        <span style={{ opacity: 0.7, fontSize: 8 }}>hrs · drift</span>
                      </th>
                    ))}
                    <th
                      style={{
                        textAlign: "right",
                        padding: "10px 14px",
                        fontFamily: MONO,
                        fontSize: 9,
                        letterSpacing: "0.15em",
                        borderLeft: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      TOTAL HRS
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "10px 14px",
                        fontFamily: MONO,
                        fontSize: 9,
                        letterSpacing: "0.15em",
                        borderLeft: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      VARIANCE
                    </th>
                  </tr>
                  {/* Contracted baseline % row */}
                  <tr style={{ background: "#e8e2d4", borderBottom: `1px solid ${RULE}` }}>
                    <td
                      style={{
                        padding: "4px 14px",
                        fontFamily: MONO,
                        fontSize: 9,
                        color: MUTED,
                        letterSpacing: "0.12em",
                      }}
                    >
                      ↳ contracted baseline %
                    </td>
                    {PILLARS.map((p) => (
                      <td
                        key={p.id}
                        style={{
                          textAlign: "center",
                          padding: "4px 8px",
                          fontFamily: MONO,
                          fontSize: 9,
                          color: MUTED,
                          borderLeft: `1px solid ${RULE}`,
                        }}
                      >
                        (per role)
                      </td>
                    ))}
                    <td colSpan={2} />
                  </tr>
                </thead>
                <tbody>
                  {draft.roles.map((role, i) => {
                    const baseline = getBaseline(role.roleId);
                    const pIn      = pillarInputs[role.roleId] ?? { cfs: "", ops: "", gov: "", eng: "" };
                    const total    = totalFromInputs(pIn);
                    const rowBg    = i % 2 === 0 ? CREAM : "#ede8dc";
                    const under    = total > 0 && total < role.baselineHrs;

                    return (
                      <tr key={role.roleId} style={{ background: rowBg }}>
                        {/* Role label */}
                        <td style={{ padding: "10px 14px", verticalAlign: "middle" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: DARK }}>{role.label}</div>
                          {baseline?.note && (
                            <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{baseline.note}</div>
                          )}
                          <div style={{ fontFamily: MONO, fontSize: 9, color: MUTED, marginTop: 3, letterSpacing: "0.08em" }}>
                            contracted: {baseline ? `${baseline.contractedHrsPerMonth} hrs/mo · ~${role.baselineHrs} hrs/qtr` : `~${role.baselineHrs} hrs/qtr`}
                          </div>
                        </td>

                        {/* Per-pillar input + drift */}
                        {PILLARS.map((p) => {
                          const bPct   = baseline?.pillars[p.id as PillarId] ?? null;
                          const d      = baseline
                            ? driftPp(pIn, baseline.pillars[p.id as PillarId], p.id as PillarId)
                            : null;
                          return (
                            <td
                              key={p.id}
                              style={{
                                borderLeft: `1px solid ${RULE}`,
                                padding: "8px",
                                verticalAlign: "middle",
                                minWidth: 100,
                              }}
                            >
                              {bPct !== null && (
                                <div
                                  style={{
                                    fontFamily: MONO,
                                    fontSize: 9,
                                    color: p.color,
                                    marginBottom: 4,
                                    letterSpacing: "0.06em",
                                  }}
                                  title="Contracted baseline — read-only"
                                >
                                  baseline {bPct}%
                                </div>
                              )}
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={pIn[p.id as PillarId]}
                                onChange={(e) =>
                                  handlePillarChange(role.roleId, p.id as PillarId, e.target.value)
                                }
                                placeholder="hrs"
                                style={{
                                  width: 60,
                                  fontFamily: MONO,
                                  fontSize: 12,
                                  padding: "4px 6px",
                                  border: `1px solid ${RULE}`,
                                  borderRadius: 3,
                                  background: "#fff",
                                  color: DARK,
                                }}
                              />
                              <div style={{ fontFamily: MONO, fontSize: 9, marginTop: 3, color: driftColor(d) }}>
                                {pillarPct(pIn, p.id as PillarId) !== null
                                  ? `actual ${pillarPct(pIn, p.id as PillarId)}%`
                                  : "—"}
                                {" · "}
                                {fmtDrift(d)}
                              </div>
                            </td>
                          );
                        })}

                        {/* Total */}
                        <td
                          style={{
                            textAlign: "right",
                            padding: "10px 14px",
                            fontFamily: MONO,
                            fontSize: 12,
                            borderLeft: `1px solid ${RULE}`,
                            color: total > 0 ? (under ? AMBER : DARK) : MUTED,
                            fontWeight: total > 0 ? 700 : 400,
                            verticalAlign: "middle",
                          }}
                        >
                          {total > 0 ? total.toFixed(1) : "—"}
                          {total > 0 && (
                            <div style={{ fontSize: 9, fontWeight: 400, color: MUTED, marginTop: 2 }}>
                              ctrd ~{role.baselineHrs}
                            </div>
                          )}
                        </td>

                        {/* Variance */}
                        <td style={{ ...TD, textAlign: "right", borderLeft: `1px solid ${RULE}`, verticalAlign: "middle" }}>
                          {total > 0 ? (
                            <VariancePill actual={total} baseline={role.baselineHrs} />
                          ) : (
                            <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: `2px solid ${RULE}`, background: "#e8e2d4" }}>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontFamily: MONO,
                        fontSize: 11,
                        color: MUTED,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Total
                    </td>
                    {PILLARS.map((p) => (
                      <td key={p.id} style={{ borderLeft: `1px solid ${RULE}` }} />
                    ))}
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        fontFamily: MONO,
                        fontSize: 13,
                        color: draftUnder ? AMBER : TEXT,
                        fontWeight: 600,
                        borderLeft: `1px solid ${RULE}`,
                      }}
                    >
                      {draftTotalActual > 0 ? draftTotalActual.toFixed(1) : "—"}
                      {draftTotalBaseline > 0 && (
                        <div style={{ fontSize: 9, fontWeight: 400, color: MUTED, marginTop: 2 }}>
                          ctrd ~{draftTotalBaseline}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", borderLeft: `1px solid ${RULE}` }}>
                      {draftTotalActual > 0 ? (
                        <VariancePill actual={draftTotalActual} baseline={draftTotalBaseline} />
                      ) : (
                        <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>—</span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Actions */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: `1px solid ${RULE}`,
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {draftUnder && (
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: AMBER,
                    marginRight: "auto",
                  }}
                >
                  ⚠ This quarter is under baseline
                  {prevUnder ? " — and the previous was too." : "."}
                </span>
              )}
              <button
                onClick={handleLock}
                disabled={draftTotalActual === 0 || unknownRoles.length > 0}
                style={{
                  background: draftTotalActual > 0 && unknownRoles.length === 0 ? DARK : "#c8bfa7",
                  color: CREAM,
                  border: "none",
                  fontFamily: MONO,
                  fontSize: 12,
                  padding: "8px 18px",
                  borderRadius: 5,
                  cursor: draftTotalActual > 0 && unknownRoles.length === 0 ? "pointer" : "not-allowed",
                  letterSpacing: "0.04em",
                  fontWeight: 700,
                }}
              >
                Lock this quarter
              </button>
            </div>
          </section>
        ) : (
          /* No draft — show "start new quarter" prompt */
          <section
            style={{
              background: CREAM,
              border: `1px dashed ${RULE}`,
              borderRadius: 8,
              padding: "28px 24px",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            <p style={{ margin: "0 0 14px", fontFamily: SERIF, fontSize: 16, color: DARK }}>
              Quarter locked — ready for the next one.
            </p>
            <button
              onClick={handleNewQuarter}
              style={{
                background: DARK,
                color: CREAM,
                border: "none",
                fontFamily: MONO,
                fontSize: 12,
                padding: "10px 22px",
                borderRadius: 5,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              Start new quarter
            </button>
          </section>
        )}

        {/* ── Contracted baseline reference (collapsible) ────────────────────── */}
        <details style={{ marginBottom: 32 }}>
          <summary
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: MUTED,
              letterSpacing: "0.12em",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            CONTRACTED BASELINE SUMMARY (read-only)
          </summary>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <table
              style={{
                borderCollapse: "collapse",
                fontSize: 12,
                fontFamily: MONO,
                background: CREAM,
                borderRadius: 6,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <thead>
                <tr style={{ background: "#2a2520", color: CREAM }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 9, letterSpacing: "0.14em" }}>
                    ROLE
                  </th>
                  {PILLARS.map((p) => (
                    <th
                      key={p.id}
                      style={{
                        padding: "8px 12px",
                        textAlign: "right",
                        fontSize: 9,
                        letterSpacing: "0.14em",
                        color: p.color,
                        filter: "brightness(1.6)",
                      }}
                    >
                      {p.id.toUpperCase()} %
                    </th>
                  ))}
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 9, letterSpacing: "0.14em" }}>
                    CONTRACT
                  </th>
                </tr>
              </thead>
              <tbody>
                {BASELINES.map((role, i) => (
                  <tr key={role.roleId} style={{ background: i % 2 === 0 ? CREAM : "#ede8dc" }}>
                    <td style={{ padding: "8px 12px", color: DARK, fontWeight: 600 }}>{role.label}</td>
                    {PILLARS.map((p) => (
                      <td
                        key={p.id}
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          color: role.pillars[p.id as PillarId] > 0 ? DARK : MUTED,
                        }}
                      >
                        {role.pillars[p.id as PillarId]}%
                      </td>
                    ))}
                    <td style={{ padding: "8px 12px", textAlign: "right", color: MUTED, fontSize: 10 }}>
                      {CONTRACT_LABEL}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        {/* ── History ──────────────────────────────────────────────────────── */}
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginBottom: 14,
              borderBottom: `1px solid ${RULE}`,
              paddingBottom: 10,
            }}
          >
            <h2
              style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: DARK, margin: 0 }}
            >
              Quarter history
            </h2>
            <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
              {snapshots.length} snapshot{snapshots.length !== 1 ? "s" : ""}
            </span>
            {snapshots.length >= 2 && (
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: MONO,
                  fontSize: 11,
                  color: triggerFired ? AMBER : GREEN,
                  fontWeight: triggerFired ? 700 : 400,
                }}
              >
                Rule 02: {triggerFired ? "TRIGGERED" : "clear"}
              </span>
            )}
          </div>

          {sortedSnapshots.length === 0 ? (
            <p style={{ fontFamily: SANS, fontSize: 13, color: MUTED, textAlign: "center" }}>
              No locked quarters yet. Fill in the draft above and click "Lock this quarter."
            </p>
          ) : (
            <>
              <TrendStrip
                snapshots={[...snapshots].sort(
                  (a, b) => new Date(a.lockedAt).getTime() - new Date(b.lockedAt).getTime()
                )}
              />
              <div style={{ marginTop: 14 }}>
                {sortedSnapshots.map((s) => (
                  <SnapshotRow
                    key={s.id}
                    snapshot={s}
                    onDelete={handleDelete}
                    isLatest={s.id === latestId}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

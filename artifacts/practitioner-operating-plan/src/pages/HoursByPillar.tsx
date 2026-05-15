/**
 * HoursByPillar.tsx — Quarterly hours tracking with automatic Hard Rule 02 enforcement
 *
 * Flow:
 *   1. Bookkeeper fills in actual hours per role for the current draft quarter.
 *   2. "Lock this quarter" saves an immutable snapshot and clears the draft.
 *   3. "Start new quarter" seeds a fresh draft from the locked snapshot's baselines,
 *      and auto-derives whether the previous quarter was under — no manual checkbox.
 *   4. Hard Rule 02 fires automatically when the last two snapshots are both under
 *      baseline; a persistent banner appears and cannot be dismissed.
 *
 * Colour palette and type scale follow the existing HiringTemplates / OnePager pages.
 */

import { useState, useEffect, useCallback } from "react";
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

// ── Design tokens (matches the rest of the app) ──────────────────────────────
const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const GREEN  = "#2d6a4f";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";
const BG     = "#d8d2c8";
const MONO   = "'IBM Plex Mono', ui-monospace, monospace";
const SERIF  = "Fraunces, Georgia, serif";
const SANS   = "Inter, system-ui, sans-serif";

// ── Contracted baseline roles ─────────────────────────────────────────────────
//
// Hours are per quarter (≈ 13 weeks).  These match the contracted engagement
// structure from the budget deck.  The bookkeeper can adjust baselines per
// quarter if the contract changes — but the default seeds from these values.
//
const DEFAULT_ROLES: Omit<RoleEntry, "actualHrs">[] = [
  { roleId: "practitioner",  label: "Practitioner / Lead",            baselineHrs: 520 },
  { roleId: "ops-manager",   label: "Operations Manager",             baselineHrs: 520 },
  { roleId: "it-tech",       label: "IT / Tech",                      baselineHrs: 390 },
  { roleId: "bookkeeper",    label: "Bookkeeper / Admin",              baselineHrs: 130 },
  { roleId: "food-handler",  label: "Food Handler (Deer Lake)",        baselineHrs: 520 },
  { roleId: "cd-associate",  label: "CD Associate",                    baselineHrs: 390 },
  { roleId: "jr-analyst",    label: "Junior Analyst",                  baselineHrs: 260 },
];

function makeDefaultRoles(): RoleEntry[] {
  return DEFAULT_ROLES.map((r) => ({ ...r, actualHrs: 0 }));
}

function makeDraftFromPrev(prevId: string, prevRoles: RoleEntry[]): QuarterDraft {
  const newId = nextQuarterId(prevId);
  return {
    id: newId,
    label: formatQuarterLabel(newId),
    roles: prevRoles.map((r) => ({ ...r, actualHrs: 0 })),
  };
}

function makeInitialDraft(): QuarterDraft {
  const id = currentQuarterId();
  return { id, label: formatQuarterLabel(id), roles: makeDefaultRoles() };
}

// ── Sub-components ────────────────────────────────────────────────────────────

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
      {delta} hrs)
    </span>
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

// ── Role row in the draft editor ──────────────────────────────────────────────

interface RoleRowEditorProps {
  entry: RoleEntry;
  onChange: (roleId: string, field: "actualHrs" | "baselineHrs", value: number) => void;
}

function RoleRowEditor({ entry, onChange }: RoleRowEditorProps) {
  const under = entry.actualHrs < entry.baselineHrs;
  return (
    <tr style={{ borderBottom: `1px solid ${RULE}` }}>
      <td style={{ padding: "10px 12px", fontFamily: SANS, fontSize: 13, color: TEXT }}>
        {entry.label}
      </td>
      <td style={{ padding: "10px 12px", textAlign: "right" }}>
        <input
          type="number"
          min={0}
          value={entry.baselineHrs}
          onChange={(e) =>
            onChange(entry.roleId, "baselineHrs", Math.max(0, Number(e.target.value)))
          }
          style={{
            width: 72,
            fontFamily: MONO,
            fontSize: 13,
            textAlign: "right",
            background: "transparent",
            border: `1px solid ${RULE}`,
            borderRadius: 4,
            padding: "3px 6px",
            color: TEXT,
          }}
        />
      </td>
      <td style={{ padding: "10px 12px", textAlign: "right" }}>
        <input
          type="number"
          min={0}
          value={entry.actualHrs === 0 ? "" : entry.actualHrs}
          placeholder="0"
          onChange={(e) =>
            onChange(entry.roleId, "actualHrs", Math.max(0, Number(e.target.value)))
          }
          style={{
            width: 72,
            fontFamily: MONO,
            fontSize: 13,
            textAlign: "right",
            background: under ? "#fff7f5" : "#f8fdf9",
            border: `1px solid ${under ? "#e8b8a8" : "#a8d8b8"}`,
            borderRadius: 4,
            padding: "3px 6px",
            color: TEXT,
          }}
        />
      </td>
      <td style={{ padding: "10px 12px", textAlign: "right" }}>
        {entry.actualHrs > 0 ? (
          <VariancePill actual={entry.actualHrs} baseline={entry.baselineHrs} />
        ) : (
          <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>—</span>
        )}
      </td>
    </tr>
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
  const under     = isUnderBaseline(snapshot);
  const totalActual   = snapshot.roles.reduce((s, r) => s + r.actualHrs,   0);
  const totalBaseline = snapshot.roles.reduce((s, r) => s + r.baselineHrs, 0);
  const delta     = totalActual - totalBaseline;
  const pct       = totalBaseline > 0 ? Math.round((delta / totalBaseline) * 100) : 0;

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
        <span
          style={{
            fontFamily: SERIF,
            fontSize: 15,
            fontWeight: 600,
            color: DARK,
            minWidth: 80,
          }}
        >
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

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HoursByPillar() {
  const [snapshots, setSnapshots] = useState<QuarterSnapshot[]>([]);
  const [draft, setDraft]         = useState<QuarterDraft | null>(null);

  // Load from storage on mount
  useEffect(() => {
    setSnapshots(loadSnapshots());
    const saved = loadDraft();
    setDraft(saved ?? makeInitialDraft());
  }, []);

  // Persist draft whenever it changes
  useEffect(() => {
    if (draft) saveDraft(draft);
  }, [draft]);

  const triggerFired = isTwoQuarterTriggerFired(snapshots);

  // ── Draft editing ────────────────────────────────────────────────────────────

  const handleRoleChange = useCallback(
    (roleId: string, field: "actualHrs" | "baselineHrs", value: number) => {
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          roles: prev.roles.map((r) =>
            r.roleId === roleId ? { ...r, [field]: value } : r
          ),
        };
      });
    },
    []
  );

  const handleDraftLabelChange = useCallback((value: string) => {
    setDraft((prev) => (prev ? { ...prev, label: value } : prev));
  }, []);

  // ── Lock draft → snapshot ────────────────────────────────────────────────────

  const handleLock = useCallback(() => {
    if (!draft) return;
    const totalActual = draft.roles.reduce((s, r) => s + r.actualHrs, 0);
    if (totalActual === 0) {
      alert(
        "All actual hours are zero. Enter the actual hours before locking this quarter."
      );
      return;
    }
    const snapshot: QuarterSnapshot = {
      id:       draft.id,
      label:    draft.label,
      lockedAt: new Date().toISOString(),
      roles:    draft.roles,
    };
    appendSnapshot(snapshot);
    const updated = loadSnapshots();
    setSnapshots(updated);
    clearDraft();
    setDraft(null);
  }, [draft]);

  // ── Start new quarter ─────────────────────────────────────────────────────────

  const handleNewQuarter = useCallback(() => {
    const sorted = [...snapshots].sort(
      (a, b) => new Date(a.lockedAt).getTime() - new Date(b.lockedAt).getTime()
    );
    const last = sorted[sorted.length - 1];
    const newDraft = last
      ? makeDraftFromPrev(last.id, last.roles)
      : makeInitialDraft();
    setDraft(newDraft);
  }, [snapshots]);

  // ── Delete snapshot ───────────────────────────────────────────────────────────

  const handleDelete = useCallback((id: string) => {
    deleteSnapshot(id);
    setSnapshots(loadSnapshots());
  }, []);

  // ── Sort snapshots for display (newest first) ────────────────────────────────
  const sortedSnapshots = [...snapshots].sort(
    (a, b) => new Date(b.lockedAt).getTime() - new Date(a.lockedAt).getTime()
  );
  const latestId = sortedSnapshots[0]?.id;

  // ── Derive prev-Q status for the draft (for informational display only) ──────
  const prevSnapshot =
    snapshots.length > 0
      ? [...snapshots].sort(
          (a, b) =>
            new Date(b.lockedAt).getTime() - new Date(a.lockedAt).getTime()
        )[0]
      : null;
  const prevUnder = prevSnapshot ? isUnderBaseline(prevSnapshot) : false;

  // ── Draft totals ──────────────────────────────────────────────────────────────
  const draftTotalActual   = draft?.roles.reduce((s, r) => s + r.actualHrs,   0) ?? 0;
  const draftTotalBaseline = draft?.roles.reduce((s, r) => s + r.baselineHrs, 0) ?? 0;
  const draftUnder         = draftTotalActual > 0 && draftTotalActual < draftTotalBaseline;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: SANS,
        color: TEXT,
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: 28,
              fontWeight: 700,
              color: DARK,
              margin: 0,
            }}
          >
            Hours by Pillar
          </h1>
          <p style={{ margin: "6px 0 0", color: MUTED, fontSize: 13 }}>
            Quarterly hours tracking · Hard Rule 02 enforced automatically from saved history
          </p>
        </div>

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
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: prevUnder ? AMBER : GREEN,
                    marginLeft: "auto",
                  }}
                >
                  Prev Q ({prevSnapshot.label}):&nbsp;
                  <strong>{prevUnder ? "UNDER baseline" : "met baseline"}</strong>
                  &nbsp;— auto-derived
                </span>
              )}
            </div>

            {/* Role table */}
            <div style={{ padding: "0 0 8px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={TH}>Role</th>
                    <th style={{ ...TH, textAlign: "right" }}>Baseline hrs</th>
                    <th style={{ ...TH, textAlign: "right" }}>Actual hrs</th>
                    <th style={{ ...TH, textAlign: "right" }}>Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.roles.map((r) => (
                    <RoleRowEditor key={r.roleId} entry={r} onChange={handleRoleChange} />
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: `2px solid ${RULE}` }}>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontFamily: MONO,
                        fontSize: 12,
                        color: MUTED,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontFamily: MONO,
                        fontSize: 13,
                        color: TEXT,
                      }}
                    >
                      {draftTotalBaseline.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontFamily: MONO,
                        fontSize: 13,
                        color: draftUnder ? AMBER : TEXT,
                        fontWeight: 600,
                      }}
                    >
                      {draftTotalActual.toLocaleString()}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                      {draftTotalActual > 0 ? (
                        <VariancePill
                          actual={draftTotalActual}
                          baseline={draftTotalBaseline}
                        />
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
                flexWrap: "wrap",
              }}
            >
              {draftUnder && (
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: AMBER,
                    alignSelf: "center",
                    marginRight: "auto",
                  }}
                >
                  ⚠ This quarter is under baseline
                  {prevUnder ? " — and the previous was too." : "."}
                </span>
              )}
              <button
                onClick={handleLock}
                style={{
                  background: DARK,
                  color: CREAM,
                  border: "none",
                  fontFamily: MONO,
                  fontSize: 12,
                  padding: "8px 18px",
                  borderRadius: 5,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
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
              style={{
                fontFamily: SERIF,
                fontSize: 18,
                fontWeight: 600,
                color: DARK,
                margin: 0,
              }}
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
              {/* Trend mini-chart */}
              <TrendStrip snapshots={[...snapshots].sort(
                (a, b) =>
                  new Date(a.lockedAt).getTime() - new Date(b.lockedAt).getTime()
              )} />

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

// ── Trend strip (small bar chart showing total-hours trend) ────────────────────

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
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          height: 60,
        }}
      >
        {snapshots.map((s) => {
          const total    = s.roles.reduce((sum, r) => sum + r.actualHrs,   0);
          const baseline = s.roles.reduce((sum, r) => sum + r.baselineHrs, 0);
          const under    = total < baseline;
          const heightPct = maxActual > 0 ? Math.max(4, (total / maxActual) * 100) : 4;
          return (
            <div
              key={s.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                flex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: under ? AMBER : GREEN,
                }}
              >
                {total.toLocaleString()}
              </span>
              <div
                style={{
                  width: "100%",
                  height: `${heightPct}%`,
                  background: under ? "#e8b8a8" : "#a8d8b8",
                  borderRadius: "3px 3px 0 0",
                  minHeight: 4,
                  position: "relative",
                }}
              />
              <span style={{ fontFamily: MONO, fontSize: 9, color: MUTED }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

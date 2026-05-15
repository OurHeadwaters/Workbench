/**
 * ContractTerms.tsx — Deliberate contract-terms amendment page
 *
 * Route: /contract-terms
 *
 * What it does:
 *   - Shows the current contracted baselines (read-only display).
 *   - Shows the full amendment history from contractBaselines.ts.
 *   - Provides an "Amend" form that records who is making the change,
 *     when, and why — with a clear explanation of what changes.
 *   - Pending amendments (not yet committed to the data file) are stored
 *     in localStorage and shown with a "pending — commit to code" badge.
 *   - The page explicitly blocks casual editing: it forces the user to
 *     fill in name, reason, and a description of changes before saving.
 *
 * IMPORTANT: This page records a PENDING amendment locally.
 * To make a baseline change permanent, the practitioner or developer must
 * apply the numeric changes to src/data/contractBaselines.ts and add
 * the amendment entry to AMENDMENT_LOG.
 */

import { useState } from "react";
import { Link } from "wouter";
import {
  BASELINES,
  PILLARS,
  CONTRACT_LABEL,
  CONTRACT_VERSION,
  CONTRACT_DATE,
  AMENDMENT_LOG,
  type PillarId,
  type Amendment,
} from "@/data/contractBaselines";

// ── Design tokens ─────────────────────────────────────────────────────────────

const CREAM = "#f4ede0";
const DARK  = "#1f3d2e";
const AMBER = "#b85a3e";
const MUTED = "#6b7665";
const RULE  = "#c8bfa7";
const TEXT  = "#2a2520";
const BG    = "#d8d2c8";
const GREEN = "#2d6a4f";
const MONO  = "'IBM Plex Mono', ui-monospace, monospace";
const SERIF = "Fraunces, Georgia, serif";
const SANS  = "Inter, system-ui, sans-serif";

// ── LocalStorage helpers ──────────────────────────────────────────────────────

const LS_PENDING_KEY = "hwop.contract-terms.pending-amendments";

interface PendingAmendment extends Amendment {
  pendingId: string;  // client-generated UUID-ish
  createdAt: string;
}

function loadPending(): PendingAmendment[] {
  try {
    const raw = localStorage.getItem(LS_PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function savePending(items: PendingAmendment[]) {
  try {
    localStorage.setItem(LS_PENDING_KEY, JSON.stringify(items));
  } catch {}
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.22em",
        color: MUTED,
        textTransform: "uppercase",
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: `1px solid ${RULE}`,
      }}
    >
      {children}
    </div>
  );
}

function AmendmentCard({
  amendment,
  isPending,
  onDismiss,
}: {
  amendment: Amendment | PendingAmendment;
  isPending?: boolean;
  onDismiss?: () => void;
}) {
  return (
    <div
      style={{
        background: isPending ? "#fff8e7" : CREAM,
        border: `1px solid ${isPending ? "#ffc107" : RULE}`,
        borderRadius: 6,
        padding: "12px 16px",
        marginBottom: 10,
        position: "relative",
      }}
    >
      {isPending && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "#7c5700",
            background: "#ffeaa0",
            border: "1px solid #ffc107",
            borderRadius: 3,
            padding: "2px 7px",
          }}
        >
          PENDING — commit to code
        </div>
      )}
      <div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: DARK }}>
          {amendment.version}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>{amendment.date}</span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>
          amended by: <strong style={{ color: DARK }}>{amendment.amendedBy}</strong>
        </span>
      </div>
      <p style={{ marginTop: 6, fontSize: 13, color: TEXT }}>{amendment.reason}</p>
      <p
        style={{
          marginTop: 4,
          fontSize: 11,
          color: MUTED,
          fontFamily: MONO,
          lineHeight: 1.5,
        }}
      >
        Changes: {amendment.changes}
      </p>
      {isPending && onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            marginTop: 10,
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.12em",
            color: AMBER,
            background: "transparent",
            border: `1px solid ${AMBER}`,
            borderRadius: 3,
            padding: "3px 10px",
            cursor: "pointer",
          }}
        >
          DISMISS
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ContractTerms() {
  const [pending, setPending] = useState<PendingAmendment[]>(() => loadPending());
  const [showAmendForm, setShowAmendForm] = useState(false);

  // Form state
  const [amendedBy, setAmendedBy] = useState("");
  const [reason, setReason]       = useState("");
  const [changes, setChanges]     = useState("");
  const [formError, setFormError] = useState("");
  const [saved, setSaved]         = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amendedBy.trim()) { setFormError("Name is required."); return; }
    if (!reason.trim())    { setFormError("Reason is required."); return; }
    if (!changes.trim())   { setFormError("Description of changes is required."); return; }

    const amendment: PendingAmendment = {
      pendingId:  genId(),
      version:    `v${CONTRACT_VERSION.replace("v", "")}-pending`,
      date:       todayIso(),
      amendedBy:  amendedBy.trim(),
      reason:     reason.trim(),
      changes:    changes.trim(),
      createdAt:  new Date().toISOString(),
    };

    const updated = [amendment, ...pending];
    savePending(updated);
    setPending(updated);

    setAmendedBy("");
    setReason("");
    setChanges("");
    setFormError("");
    setShowAmendForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  function dismissPending(pendingId: string) {
    const updated = pending.filter((p) => p.pendingId !== pendingId);
    savePending(updated);
    setPending(updated);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: SANS,
        color: TEXT,
        padding: "32px 24px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {/* Nav */}
      <div style={{ marginBottom: 8, display: "flex", gap: 16 }}>
        <Link
          href="/"
          style={{ fontFamily: MONO, fontSize: 11, color: MUTED, textDecoration: "none", letterSpacing: "0.12em" }}
        >
          ← DECK
        </Link>
        <Link
          href="/hours"
          style={{ fontFamily: MONO, fontSize: 11, color: MUTED, textDecoration: "none", letterSpacing: "0.12em" }}
        >
          ← HOURS REPORT
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
        Contract administration
      </div>
      <h1
        style={{
          fontFamily: SERIF,
          fontSize: 28,
          fontWeight: 600,
          color: DARK,
          marginBottom: 4,
          lineHeight: 1.2,
        }}
      >
        Contract Terms
      </h1>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 24, maxWidth: 580 }}>
        The locked per-role pillar baselines. Changing these is a deliberate contract amendment
        — every change is recorded with name, date, and reason.
      </p>

      {/* Current contract metadata */}
      <div
        style={{
          background: DARK,
          color: CREAM,
          borderRadius: 8,
          padding: "14px 18px",
          fontFamily: MONO,
          fontSize: 11,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <div>
          <span style={{ opacity: 0.55, marginRight: 6 }}>Version</span>
          <strong>{CONTRACT_VERSION}</strong>
        </div>
        <div>
          <span style={{ opacity: 0.55, marginRight: 6 }}>Signed</span>
          <strong>{CONTRACT_DATE}</strong>
        </div>
        <div>
          <span style={{ opacity: 0.55, marginRight: 6 }}>Roles</span>
          <strong>{BASELINES.length}</strong>
        </div>
        <div>
          <span style={{ opacity: 0.55, marginRight: 6 }}>Pillars</span>
          <strong>{PILLARS.length}</strong>
        </div>
        <div style={{ flex: 1, textAlign: "right", opacity: 0.6 }}>
          {CONTRACT_LABEL}
        </div>
      </div>

      {/* Current baselines table */}
      <section style={{ marginBottom: 36 }}>
        <SectionHeading>Current contracted baselines (read-only)</SectionHeading>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "collapse",
              fontSize: 12,
              width: "100%",
              background: CREAM,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#2a2520", color: CREAM }}>
                <th style={{ padding: "9px 14px", textAlign: "left", fontFamily: MONO, fontSize: 9, letterSpacing: "0.14em", minWidth: 180 }}>
                  ROLE
                </th>
                <th style={{ padding: "9px 12px", textAlign: "right", fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em" }}>
                  HRS/MO
                </th>
                {PILLARS.map((p) => (
                  <th
                    key={p.id}
                    style={{
                      padding: "9px 12px",
                      textAlign: "right",
                      fontFamily: MONO,
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      color: p.color,
                      filter: "brightness(1.6)",
                    }}
                  >
                    {p.id.toUpperCase()} %
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BASELINES.map((role, i) => (
                <tr key={role.roleId} style={{ background: i % 2 === 0 ? CREAM : "#ede8dc" }}>
                  <td style={{ padding: "9px 14px" }}>
                    <div style={{ fontWeight: 600, color: DARK }}>{role.label}</div>
                    {role.note && (
                      <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>{role.note}</div>
                    )}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: MONO, color: DARK }}>
                    {role.contractedHrsPerMonth}
                  </td>
                  {PILLARS.map((p) => {
                    const val = role.pillars[p.id as PillarId];
                    return (
                      <td
                        key={p.id}
                        style={{
                          padding: "9px 12px",
                          textAlign: "right",
                          fontFamily: MONO,
                          color: val > 0 ? DARK : MUTED,
                          fontWeight: val >= 40 ? 700 : 400,
                        }}
                      >
                        {val}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          style={{
            marginTop: 10,
            fontFamily: MONO,
            fontSize: 10,
            color: MUTED,
            lineHeight: 1.6,
          }}
        >
          These percentages are locked in{" "}
          <code
            style={{
              background: "#e8e2d4",
              padding: "1px 5px",
              borderRadius: 3,
              fontSize: 10,
            }}
          >
            src/data/contractBaselines.ts
          </code>
          . To change any number, record an amendment below, then apply the numeric change
          to the code file and add the amendment entry to{" "}
          <code style={{ background: "#e8e2d4", padding: "1px 5px", borderRadius: 3, fontSize: 10 }}>
            AMENDMENT_LOG
          </code>{" "}
          in the same file.
        </p>
      </section>

      {/* Pending amendments */}
      {pending.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <SectionHeading>Pending amendments ({pending.length}) — commit to code to take effect</SectionHeading>
          {pending.map((p) => (
            <AmendmentCard
              key={p.pendingId}
              amendment={p}
              isPending
              onDismiss={() => dismissPending(p.pendingId)}
            />
          ))}
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: 6,
              padding: "10px 14px",
              fontFamily: MONO,
              fontSize: 11,
              color: "#7c5700",
              lineHeight: 1.6,
            }}
          >
            ⚠ These amendments are recorded locally but the baseline numbers are NOT yet changed.
            Open{" "}
            <code style={{ background: "#ffeaa0", padding: "1px 4px" }}>
              src/data/contractBaselines.ts
            </code>
            , update the relevant role's <code>pillars</code> object, bump{" "}
            <code>CONTRACT_VERSION</code>, and prepend the entry to <code>AMENDMENT_LOG</code>.
          </div>
        </section>
      )}

      {/* Committed amendment log */}
      <section style={{ marginBottom: 36 }}>
        <SectionHeading>
          Amendment log — {AMENDMENT_LOG.length} committed{" "}
          {AMENDMENT_LOG.length === 1 ? "entry" : "entries"}
        </SectionHeading>
        {AMENDMENT_LOG.map((a, i) => (
          <AmendmentCard key={i} amendment={a} />
        ))}
      </section>

      {/* Amend action */}
      <section>
        <SectionHeading>Record a new amendment</SectionHeading>

        {!showAmendForm ? (
          <div>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>
              Use this form to record the intent and reason for a baseline change. After saving,
              apply the numeric changes to the code file to take effect.
            </p>
            <button
              onClick={() => setShowAmendForm(true)}
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.14em",
                padding: "10px 22px",
                background: AMBER,
                color: CREAM,
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              AMEND CONTRACT TERMS
            </button>
            {saved && (
              <span
                style={{
                  marginLeft: 16,
                  fontFamily: MONO,
                  fontSize: 11,
                  color: GREEN,
                  letterSpacing: "0.1em",
                }}
              >
                ✓ Amendment recorded — now apply it to the code file.
              </span>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: CREAM,
              border: `1px solid ${RULE}`,
              borderRadius: 8,
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: 5,
                padding: "10px 14px",
                fontFamily: MONO,
                fontSize: 11,
                color: "#7c5700",
                marginBottom: 18,
                lineHeight: 1.6,
              }}
            >
              This is a deliberate contract action. Fill in who is making the change, why, and
              what specifically is changing. This record cannot be deleted once committed to the
              code file.
            </div>

            {formError && (
              <p style={{ color: AMBER, fontFamily: MONO, fontSize: 11, marginBottom: 14 }}>
                ✕ {formError}
              </p>
            )}

            <label
              style={{
                display: "block",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.14em",
                color: MUTED,
                marginBottom: 4,
              }}
            >
              NAME *
            </label>
            <input
              type="text"
              value={amendedBy}
              onChange={(e) => setAmendedBy(e.target.value)}
              placeholder="e.g. Practitioner, Bobbie Parr"
              style={{
                width: "100%",
                fontFamily: SANS,
                fontSize: 13,
                padding: "8px 10px",
                border: `1px solid ${RULE}`,
                borderRadius: 4,
                background: "#fff",
                color: DARK,
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                display: "block",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.14em",
                color: MUTED,
                marginBottom: 4,
              }}
            >
              REASON FOR AMENDMENT *
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Ops Manager scope narrowed after month-3 review"
              style={{
                width: "100%",
                fontFamily: SANS,
                fontSize: 13,
                padding: "8px 10px",
                border: `1px solid ${RULE}`,
                borderRadius: 4,
                background: "#fff",
                color: DARK,
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                display: "block",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.14em",
                color: MUTED,
                marginBottom: 4,
              }}
            >
              DESCRIPTION OF CHANGES *
            </label>
            <textarea
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
              placeholder="e.g. Ops Manager: OPS% reduced from 65 to 55, CFS% increased from 20 to 30. All other roles unchanged."
              rows={4}
              style={{
                width: "100%",
                fontFamily: SANS,
                fontSize: 13,
                padding: "8px 10px",
                border: `1px solid ${RULE}`,
                borderRadius: 4,
                background: "#fff",
                color: DARK,
                marginBottom: 20,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  padding: "10px 22px",
                  background: DARK,
                  color: CREAM,
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                RECORD AMENDMENT
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAmendForm(false);
                  setFormError("");
                  setAmendedBy("");
                  setReason("");
                  setChanges("");
                }}
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  padding: "10px 16px",
                  background: "transparent",
                  color: MUTED,
                  border: `1px solid ${RULE}`,
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Footer */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 20,
          borderTop: `1px solid ${RULE}`,
          fontFamily: MONO,
          fontSize: 10,
          color: MUTED,
          lineHeight: 1.7,
        }}
      >
        Contract terms are enforced in the{" "}
        <Link href="/hours" style={{ color: AMBER }}>
          Hours by Pillar
        </Link>{" "}
        quarterly report. Filed quarters are immutable — a past quarter cannot be retroactively
        re-filed under a new contract version.
      </div>
    </div>
  );
}

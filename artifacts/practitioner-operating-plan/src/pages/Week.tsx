/**
 * Week.tsx — Salt Bench · Weekly Swap Tool
 *
 * The OM uses this page to:
 *   1. See who is scheduled as primary / standby for any given ISO week.
 *   2. Swap either role by entering a replacement name and an optional
 *      one-line reason (e.g. "Marie sick", "on vacation").
 *   3. Clear an override to revert to the rotation schedule.
 *
 * Overrides persist in localStorage and survive page reloads.
 * The reason renders inline as "swapped from <name> — <reason>" so the
 * audit trail is meaningful weeks later.
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  getEffectiveBench,
  getScheduledBench,
  currentWeekId,
  prevWeekId,
  nextWeekId,
  formatWeekLabel,
  BENCH_ROSTER,
  type EffectiveBenchRole,
} from "@/data/saltBench";
import {
  loadBenchOverride,
  saveBenchOverride,
  deleteBenchOverride,
  type BenchOverride,
} from "@/lib/storage";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Design tokens (matches print-format pages in this app) ───────────────────
const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";
const GREEN  = "#2a6b3e";

// ── BenchRoleCard ─────────────────────────────────────────────────────────────

interface BenchRoleCardProps {
  role: "primary" | "standby";
  effective: EffectiveBenchRole;
  onSave: (name: string, reason: string) => void;
  onClear: () => void;
}

function BenchRoleCard({ role, effective, onSave, onClear }: BenchRoleCardProps) {
  const isSwapped = role === "primary"
    ? !!effective.primarySwappedFrom
    : !!effective.standbySwappedFrom;

  const currentName  = role === "primary" ? effective.primary  : effective.standby;
  const originalName = role === "primary" ? effective.primarySwappedFrom  : effective.standbySwappedFrom;
  const savedReason  = role === "primary" ? effective.primaryReason : effective.standbyReason;

  const [editing, setEditing]     = useState(false);
  const [nameVal, setNameVal]     = useState("");
  const [reasonVal, setReasonVal] = useState("");

  function openSwap() {
    setNameVal(isSwapped ? currentName : "");
    setReasonVal(savedReason ?? "");
    setEditing(true);
  }

  function handleSave() {
    const name = nameVal.trim();
    if (!name) return;
    onSave(name, reasonVal.trim());
    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
  }

  const roleLabel = role === "primary" ? "Primary" : "Standby";

  return (
    <div style={{
      background: "#fff",
      border: `1pt solid ${RULE}`,
      borderRadius: "5pt",
      padding: "14pt 16pt",
      flex: 1,
    }}>
      {/* Role badge */}
      <div style={{
        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        fontSize: "7pt",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: AMBER,
        marginBottom: "6pt",
      }}>
        {roleLabel}
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "Fraunces, Georgia, serif",
        fontSize: "18pt",
        fontWeight: 700,
        color: DARK,
        lineHeight: 1.1,
        marginBottom: "4pt",
      }}>
        {currentName}
      </div>

      {/* Swap annotation */}
      {isSwapped && originalName && (
        <div style={{
          fontSize: "8pt",
          color: MUTED,
          marginBottom: "10pt",
          display: "flex",
          alignItems: "baseline",
          gap: "4pt",
          flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            fontSize: "6.5pt",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: AMBER,
            background: "rgba(184,90,62,0.10)",
            padding: "1pt 5pt",
            borderRadius: "2pt",
          }}>
            swapped
          </span>
          <span style={{ color: MUTED }}>
            from {originalName}
            {savedReason ? (
              <> &mdash; <em style={{ color: TEXT }}>{savedReason}</em></>
            ) : null}
          </span>
        </div>
      )}

      {!isSwapped && <div style={{ marginBottom: "10pt" }} />}

      {/* Inline swap form */}
      {editing ? (
        <div style={{
          background: "rgba(31,61,46,0.04)",
          border: `1pt solid ${RULE}`,
          borderRadius: "4pt",
          padding: "10pt 12pt",
          display: "flex",
          flexDirection: "column",
          gap: "8pt",
        }}>
          {/* Name field */}
          <div>
            <label style={{
              display: "block",
              fontSize: "7pt",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "3pt",
            }}>
              Replacement name
            </label>
            <input
              type="text"
              value={nameVal}
              onChange={e => setNameVal(e.target.value)}
              placeholder="e.g. Jordan L."
              list={`bench-roster-${role}`}
              autoFocus
              style={{
                width: "100%",
                padding: "5pt 8pt",
                border: `1pt solid ${RULE}`,
                borderRadius: "3pt",
                fontSize: "9pt",
                fontFamily: "Inter, system-ui, sans-serif",
                color: TEXT,
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
            <datalist id={`bench-roster-${role}`}>
              {BENCH_ROSTER.map(n => <option key={n} value={n} />)}
            </datalist>
          </div>

          {/* Reason field */}
          <div>
            <label style={{
              display: "block",
              fontSize: "7pt",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "3pt",
            }}>
              Reason <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — one line)</span>
            </label>
            <input
              type="text"
              value={reasonVal}
              onChange={e => setReasonVal(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
              placeholder="e.g. Marie sick"
              maxLength={120}
              style={{
                width: "100%",
                padding: "5pt 8pt",
                border: `1pt solid ${RULE}`,
                borderRadius: "3pt",
                fontSize: "9pt",
                fontFamily: "Inter, system-ui, sans-serif",
                color: TEXT,
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "6pt" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={!nameVal.trim()}
              style={{
                padding: "4pt 12pt",
                background: nameVal.trim() ? DARK : RULE,
                color: CREAM,
                border: "none",
                borderRadius: "3pt",
                fontSize: "7.5pt",
                fontWeight: 700,
                cursor: nameVal.trim() ? "pointer" : "default",
                letterSpacing: "0.04em",
              }}
            >
              Save swap
            </button>
            <button
              type="button"
              onClick={handleCancel}
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
      ) : (
        <div style={{ display: "flex", gap: "6pt", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={openSwap}
            style={{
              padding: "4pt 11pt",
              background: isSwapped ? "rgba(184,90,62,0.10)" : DARK,
              color: isSwapped ? AMBER : CREAM,
              border: isSwapped ? `1pt solid rgba(184,90,62,0.35)` : "none",
              borderRadius: "3pt",
              fontSize: "7.5pt",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            {isSwapped ? "Edit swap" : "Swap"}
          </button>
          {isSwapped && (
            <button
              type="button"
              onClick={onClear}
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
              Clear swap
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Week() {
  const [, navigate] = useLocation();
  const [weekId, setWeekId]         = useState(currentWeekId);
  const [override, setOverride]     = useState<BenchOverride | null>(null);
  const [effective, setEffective]   = useState<EffectiveBenchRole>(() =>
    getEffectiveBench(currentWeekId()),
  );
  const [saved, setSaved]           = useState(false);

  useEffect(() => {
    const ov = loadBenchOverride(weekId);
    setOverride(ov);
    setEffective(getEffectiveBench(weekId, ov));
  }, [weekId]);

  function refreshEffective(updated: BenchOverride | null) {
    setOverride(updated);
    setEffective(getEffectiveBench(weekId, updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSavePrimary(name: string, reason: string) {
    const existing = loadBenchOverride(weekId);
    const next: BenchOverride = {
      weekId,
      primaryName: name,
      primaryReason: reason || undefined,
      standbyName: existing?.standbyName,
      standbyReason: existing?.standbyReason,
      overriddenAt: new Date().toISOString(),
    };
    saveBenchOverride(next);
    refreshEffective(next);
  }

  function handleClearPrimary() {
    const existing = loadBenchOverride(weekId);
    if (!existing) return;
    if (!existing.standbyName) {
      deleteBenchOverride(weekId);
      refreshEffective(null);
    } else {
      const next: BenchOverride = {
        ...existing,
        primaryName: undefined,
        primaryReason: undefined,
        overriddenAt: new Date().toISOString(),
      };
      saveBenchOverride(next);
      refreshEffective(next);
    }
  }

  function handleSaveStandby(name: string, reason: string) {
    const existing = loadBenchOverride(weekId);
    const next: BenchOverride = {
      weekId,
      primaryName: existing?.primaryName,
      primaryReason: existing?.primaryReason,
      standbyName: name,
      standbyReason: reason || undefined,
      overriddenAt: new Date().toISOString(),
    };
    saveBenchOverride(next);
    refreshEffective(next);
  }

  function handleClearStandby() {
    const existing = loadBenchOverride(weekId);
    if (!existing) return;
    if (!existing.primaryName) {
      deleteBenchOverride(weekId);
      refreshEffective(null);
    } else {
      const next: BenchOverride = {
        ...existing,
        standbyName: undefined,
        standbyReason: undefined,
        overriddenAt: new Date().toISOString(),
      };
      saveBenchOverride(next);
      refreshEffective(next);
    }
  }

  const scheduled = getScheduledBench(weekId);
  const hasAnySwap = !!effective.primarySwappedFrom || !!effective.standbySwappedFrom;
  const isCurrentWeek = weekId === currentWeekId();

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
              <div style={{
                fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: AMBER, marginBottom: "3pt",
              }}>
                SALT-01 · Bench · Weekly Swap
              </div>
              <div style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "22pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "4pt",
              }}>
                Bench Swap
              </div>
              <div style={{ fontSize: "9pt", color: MUTED, lineHeight: 1.5, maxWidth: "4.5in" }}>
                Review the scheduled food-handler bench and swap either role when
                coverage changes. Add a one-line reason so the close-out is legible
                weeks later.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>
                Operations Manager
              </div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>
                Headwaters Development Services
              </div>
              {saved && (
                <div style={{
                  marginTop: "6pt",
                  fontSize: "7.5pt",
                  fontWeight: 700,
                  color: GREEN,
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  letterSpacing: "0.06em",
                }}>
                  ✓ Saved
                </div>
              )}
            </div>
          </div>

          {/* Rule */}
          <div style={{ height: "1pt", background: RULE, marginBottom: "18pt" }} />

          {/* Week nav */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10pt",
            marginBottom: "18pt",
          }}>
            <button
              type="button"
              onClick={() => setWeekId(prevWeekId(weekId))}
              style={{
                padding: "4pt 10pt",
                background: "transparent",
                color: MUTED,
                border: `1pt solid ${RULE}`,
                borderRadius: "3pt",
                fontSize: "7.5pt",
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                letterSpacing: "0.06em",
              }}
            >
              ← Prev
            </button>

            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: "10pt",
                fontWeight: 700,
                color: DARK,
                letterSpacing: "0.06em",
              }}>
                {formatWeekLabel(weekId)}
              </div>
              {isCurrentWeek && (
                <div style={{
                  fontSize: "7pt",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: GREEN,
                  marginTop: "2pt",
                }}>
                  Current week
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setWeekId(nextWeekId(weekId))}
              style={{
                padding: "4pt 10pt",
                background: "transparent",
                color: MUTED,
                border: `1pt solid ${RULE}`,
                borderRadius: "3pt",
                fontSize: "7.5pt",
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                letterSpacing: "0.06em",
              }}
            >
              Next →
            </button>

            {!isCurrentWeek && (
              <button
                type="button"
                onClick={() => setWeekId(currentWeekId())}
                style={{
                  padding: "4pt 10pt",
                  background: DARK,
                  color: CREAM,
                  border: "none",
                  borderRadius: "3pt",
                  fontSize: "7.5pt",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                Today
              </button>
            )}
          </div>

          {/* Role cards */}
          <div style={{ display: "flex", gap: "14pt", marginBottom: "18pt" }}>
            <BenchRoleCard
              role="primary"
              effective={effective}
              onSave={handleSavePrimary}
              onClear={handleClearPrimary}
            />
            <BenchRoleCard
              role="standby"
              effective={effective}
              onSave={handleSaveStandby}
              onClear={handleClearStandby}
            />
          </div>

          {/* Swap summary */}
          {hasAnySwap && (
            <div style={{
              background: "rgba(184,90,62,0.06)",
              border: `1pt solid rgba(184,90,62,0.25)`,
              borderRadius: "4pt",
              padding: "10pt 14pt",
              marginBottom: "18pt",
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: "7pt",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: AMBER,
                marginBottom: "7pt",
              }}>
                Swap summary — {formatWeekLabel(weekId)}
              </div>
              {effective.primarySwappedFrom && (
                <div style={{ fontSize: "8.5pt", color: TEXT, marginBottom: "4pt" }}>
                  <strong>Primary:</strong>{" "}
                  {effective.primarySwappedFrom} → {effective.primary}
                  {effective.primaryReason && (
                    <> &mdash; <em style={{ color: MUTED }}>{effective.primaryReason}</em></>
                  )}
                </div>
              )}
              {effective.standbySwappedFrom && (
                <div style={{ fontSize: "8.5pt", color: TEXT }}>
                  <strong>Standby:</strong>{" "}
                  {effective.standbySwappedFrom} → {effective.standby}
                  {effective.standbyReason && (
                    <> &mdash; <em style={{ color: MUTED }}>{effective.standbyReason}</em></>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Scheduled rotation note */}
          <div style={{
            background: "rgba(31,61,46,0.04)",
            border: `1pt solid ${RULE}`,
            borderRadius: "4pt",
            padding: "10pt 14pt",
            marginBottom: "22pt",
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: "7pt",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "6pt",
            }}>
              Scheduled rotation (before any overrides)
            </div>
            <div style={{ display: "flex", gap: "24pt" }}>
              <div>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: "1pt" }}>Primary</div>
                <div style={{ fontSize: "10pt", color: DARK, fontWeight: 600 }}>{scheduled.primary}</div>
              </div>
              <div>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: "1pt" }}>Standby</div>
                <div style={{ fontSize: "10pt", color: DARK, fontWeight: 600 }}>{scheduled.standby}</div>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div style={{ display: "flex", gap: "10pt", alignItems: "center" }}>
            <a
              href={`${BASE}/tools`}
              style={{ fontSize: "8pt", color: MUTED, textDecoration: "none" }}
            >
              ← Tools index
            </a>
            <span style={{ color: RULE }}>·</span>
            <a
              href={`${BASE}/tools/bench/close`}
              style={{ fontSize: "8pt", color: AMBER, fontWeight: 600, textDecoration: "none" }}
            >
              Week close-out →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * WeekCloseOut.tsx — Salt Bench · Week Close-Out View
 *
 * A printable audit record for a single ISO week showing:
 *   - The effective primary and standby roles (after any swaps)
 *   - For swapped roles: "swapped from <original> — <reason>"
 *
 * Intended for the bookkeeper who reviews close-outs weeks later and needs
 * to understand why a name differs from the rotation schedule.
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
  mondayOfWeek,
  type EffectiveBenchRole,
} from "@/data/saltBench";
import { loadBenchOverride, type BenchOverride } from "@/lib/storage";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Design tokens ────────────────────────────────────────────────────────────
const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";

// ── RoleRow ──────────────────────────────────────────────────────────────────

function RoleRow({
  roleLabel,
  name,
  swappedFrom,
  reason,
}: {
  roleLabel: string;
  name: string;
  swappedFrom?: string;
  reason?: string;
}) {
  const isSwapped = !!swappedFrom;

  return (
    <tr style={{ borderBottom: `0.5pt solid ${RULE}` }}>
      <td style={{
        padding: "7pt 6pt",
        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        fontSize: "7pt",
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: MUTED,
        width: "18%",
        verticalAlign: "top",
      }}>
        {roleLabel}
      </td>
      <td style={{ padding: "7pt 6pt", verticalAlign: "top", width: "28%" }}>
        <span style={{ fontSize: "10pt", fontWeight: 700, color: DARK }}>
          {name}
        </span>
      </td>
      <td style={{ padding: "7pt 6pt", verticalAlign: "top" }}>
        {isSwapped && swappedFrom ? (
          <span style={{ fontSize: "8.5pt", color: MUTED }}>
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
              marginRight: "5pt",
            }}>
              swapped
            </span>
            from {swappedFrom}
            {reason ? (
              <> &mdash; <em style={{ color: TEXT }}>{reason}</em></>
            ) : null}
          </span>
        ) : (
          <span style={{
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            fontSize: "6.5pt",
            letterSpacing: "0.1em",
            color: "rgba(107,118,101,0.45)",
          }}>
            scheduled
          </span>
        )}
      </td>
    </tr>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function WeekCloseOut() {
  const [, navigate] = useLocation();
  const [weekId, setWeekId]       = useState(currentWeekId);
  const [override, setOverride]   = useState<BenchOverride | null>(null);
  const [effective, setEffective] = useState<EffectiveBenchRole>(() =>
    getEffectiveBench(currentWeekId()),
  );

  useEffect(() => {
    const ov = loadBenchOverride(weekId);
    setOverride(ov);
    setEffective(getEffectiveBench(weekId, ov));
  }, [weekId]);

  const scheduled = getScheduledBench(weekId);
  const hasAnySwap = !!effective.primarySwappedFrom || !!effective.standbySwappedFrom;
  const isCurrentWeek = weekId === currentWeekId();
  const weekLabel = formatWeekLabel(weekId);
  const monStr = mondayOfWeek(weekId);
  const monDate = monStr
    ? new Date(monStr + "T12:00:00Z").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
      })
    : "";

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
                SALT-01 · Bench · Week Close-Out
              </div>
              <div style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "22pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "4pt",
              }}>
                Week Close-Out
              </div>
              <div style={{ fontSize: "9pt", color: MUTED, lineHeight: 1.5, maxWidth: "4.5in" }}>
                Effective bench roles for the selected week. Swapped roles show
                the original scheduled name and the reason the OM entered at
                swap time.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>
                Bookkeeper / OM
              </div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>
                Headwaters Development Services
              </div>
              <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "4pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.06em" }}>
                Printed {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Rule */}
          <div style={{ height: "1pt", background: RULE, marginBottom: "18pt" }} />

          {/* Week nav — screen only */}
          <div className="print:hidden" style={{
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
                {weekLabel}
              </div>
              {isCurrentWeek && (
                <div style={{
                  fontSize: "7pt",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#2a6b3e",
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

          {/* Week heading (visible in print) */}
          <div style={{ marginBottom: "14pt" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: "8pt",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: AMBER,
              marginBottom: "3pt",
            }}>
              {weekLabel}
            </div>
            {monDate && (
              <div style={{ fontSize: "8pt", color: MUTED }}>{monDate} (Monday)</div>
            )}
            {hasAnySwap && (
              <div style={{
                marginTop: "5pt",
                display: "inline-flex",
                alignItems: "center",
                gap: "4pt",
                fontSize: "7.5pt",
                fontWeight: 700,
                color: AMBER,
                background: "rgba(184,90,62,0.08)",
                border: `0.75pt solid rgba(184,90,62,0.30)`,
                borderRadius: "3pt",
                padding: "2pt 7pt",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {[effective.primarySwappedFrom, effective.standbySwappedFrom].filter(Boolean).length === 2
                  ? "2 swaps this week"
                  : "1 swap this week"}
              </div>
            )}
          </div>

          {/* Bench roles table */}
          <div style={{ marginBottom: "18pt" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: "7.5pt",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: AMBER,
              marginBottom: "8pt",
            }}>
              Effective bench — {weekLabel}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt" }}>
              <thead>
                <tr style={{
                  borderBottom: `1.5pt solid ${RULE}`,
                  color: MUTED,
                  fontWeight: 600,
                  fontSize: "7pt",
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}>
                  <th style={{ padding: "3pt 6pt", textAlign: "left" }}>Role</th>
                  <th style={{ padding: "3pt 6pt", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "3pt 6pt", textAlign: "left" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                <RoleRow
                  roleLabel="Primary"
                  name={effective.primary}
                  swappedFrom={effective.primarySwappedFrom}
                  reason={effective.primaryReason}
                />
                <RoleRow
                  roleLabel="Standby"
                  name={effective.standby}
                  swappedFrom={effective.standbySwappedFrom}
                  reason={effective.standbyReason}
                />
              </tbody>
            </table>
          </div>

          {/* Scheduled rotation reference */}
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
              Rotation schedule (before overrides)
            </div>
            <div style={{ display: "flex", gap: "24pt" }}>
              <div>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: "1pt" }}>Primary</div>
                <div style={{
                  fontSize: "9.5pt",
                  color: effective.primarySwappedFrom ? MUTED : DARK,
                  fontWeight: 600,
                  textDecoration: effective.primarySwappedFrom ? "line-through" : "none",
                  textDecorationColor: AMBER,
                }}>
                  {scheduled.primary}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: "1pt" }}>Standby</div>
                <div style={{
                  fontSize: "9.5pt",
                  color: effective.standbySwappedFrom ? MUTED : DARK,
                  fontWeight: 600,
                  textDecoration: effective.standbySwappedFrom ? "line-through" : "none",
                  textDecorationColor: AMBER,
                }}>
                  {scheduled.standby}
                </div>
              </div>
            </div>
          </div>

          {/* Override metadata (screen only) */}
          {override && (
            <div className="print:hidden" style={{
              background: "rgba(107,118,101,0.06)",
              border: `1pt solid ${RULE}`,
              borderRadius: "4pt",
              padding: "8pt 12pt",
              marginBottom: "18pt",
              fontSize: "7.5pt",
              color: MUTED,
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              letterSpacing: "0.04em",
            }}>
              Override saved {new Date(override.overriddenAt).toLocaleString("en-US", {
                month: "short", day: "numeric", year: "numeric",
                hour: "numeric", minute: "2-digit",
              })}
            </div>
          )}

          {/* Navigation links */}
          <div className="print:hidden" style={{ display: "flex", gap: "10pt", alignItems: "center" }}>
            <a
              href={`${BASE}/tools/bench/week`}
              style={{ fontSize: "8pt", color: AMBER, fontWeight: 600, textDecoration: "none" }}
            >
              ← Bench swap
            </a>
            <span style={{ color: RULE }}>·</span>
            <a
              href={`${BASE}/tools`}
              style={{ fontSize: "8pt", color: MUTED, textDecoration: "none" }}
            >
              Tools index
            </a>
            <span style={{ color: RULE }}>·</span>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                background: "transparent",
                border: `1pt solid ${RULE}`,
                borderRadius: "3pt",
                padding: "3pt 9pt",
                fontSize: "8pt",
                color: MUTED,
                cursor: "pointer",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Print / Save PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

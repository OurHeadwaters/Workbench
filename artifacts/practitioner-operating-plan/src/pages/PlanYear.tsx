import { useLocation } from "wouter";
import { useState, useEffect, useCallback } from "react";
import {
  PLAN_2026,
  PHASE_ORDER,
  PHASE_COLORS,
  formatDateRange,
  getTodayWeek,
  type Phase,
} from "@/data/plan2026";
import { Q2_BATCHES } from "@/lib/saltBench";
import { loadBenchOverrides, clearBenchOverride, type BenchOverride } from "@/lib/storage";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const PHASE_WEEK_RANGES: Record<Phase, string> = {
  Foundation: "W1–W15",
  "Pilot Execution": "W16–W44",
  "Year-End Audit": "W45–W52",
};

// ── Bench Swap Audit Panel ─────────────────────────────────────────────────────

/** Extracts the numeric ISO week from a "YYYY-Wnn" key, e.g. "2026-W20" → 20. */
function weekIdToNumber(weekId: string): number | null {
  const m = weekId.match(/-W(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}

function BenchSwapAudit() {
  const [overrides, setOverrides] = useState<BenchOverride[]>([]);

  const refresh = useCallback(() => {
    setOverrides(loadBenchOverrides());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleRestore(weekId: string) {
    clearBenchOverride(weekId);
    refresh();
  }

  const activeSwaps = overrides.filter(
    (ov) => ov.primaryName !== undefined || ov.standbyName !== undefined,
  );

  if (activeSwaps.length === 0) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid rgba(184,90,62,0.22)",
        borderRadius: 10,
        padding: "20px 24px",
        marginBottom: 32,
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#b85a3e",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#b85a3e",
          }}
        >
          Active Bench Swaps — {new Date().getFullYear()}
        </span>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10,
            color: "#9a9a8e",
            letterSpacing: "0.08em",
          }}
        >
          {activeSwaps.length} swap{activeSwaps.length !== 1 ? "s" : ""} this year
        </span>
      </div>

      {/* Swap rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {overrides.map((ov) => {
          const wkNum = weekIdToNumber(ov.weekId);
          const batch = wkNum !== null
            ? Q2_BATCHES.find((b) => b.isoWeek === wkNum)
            : undefined;
          const swappedDate = ov.overriddenAt
            ? new Date(ov.overriddenAt).toLocaleDateString("en-CA", {
                month: "short",
                day: "numeric",
              })
            : null;

          return (
            <div
              key={ov.weekId}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                background: "rgba(244,237,224,0.55)",
                border: "1px solid rgba(184,90,62,0.12)",
                borderRadius: 7,
                padding: "10px 14px",
                flexWrap: "wrap",
              }}
            >
              {/* Week identity */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#b85a3e",
                      marginBottom: 2,
                    }}
                  >
                    {ov.weekId}{batch ? ` · ${batch.batchLabel}` : ""}
                  </div>
                  {batch && (
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: 9,
                        color: "#9a9a8e",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {batch.dateRange}
                    </div>
                  )}
                </div>

                {/* Swap details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
                  {ov.primaryName && batch && (
                    <SwapLine
                      role="Primary"
                      from={batch.defaultPrimary}
                      to={ov.primaryName}
                    />
                  )}
                  {ov.standbyName && batch && (
                    <SwapLine
                      role="Standby"
                      from={batch.defaultStandby}
                      to={ov.standbyName}
                    />
                  )}
                  {(ov.primaryReason || ov.standbyReason) && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#5a5a50",
                        fontStyle: "italic",
                        marginTop: 1,
                      }}
                    >
                      "{ov.primaryReason ?? ov.standbyReason}"
                    </div>
                  )}
                  {savedDate && (
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: 9,
                        color: "#b0a898",
                        letterSpacing: "0.04em",
                        marginTop: 1,
                      }}
                    >
                      Swapped {savedDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Restore button */}
              <button
                onClick={() => handleRestore(ov.weekId)}
                style={{
                  flexShrink: 0,
                  alignSelf: "center",
                  background: "transparent",
                  color: "#7a7a6e",
                  border: "1px solid rgba(31,61,46,0.2)",
                  borderRadius: 5,
                  padding: "5px 12px",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.12s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(31,61,46,0.07)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1f3d2e";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(31,61,46,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#7a7a6e";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(31,61,46,0.2)";
                }}
              >
                Restore
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SwapLine({
  role,
  from,
  to,
}: {
  role: string;
  from: string;
  to: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        fontSize: 11,
      }}
    >
      <span
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#9a9a8e",
          minWidth: 44,
        }}
      >
        {role}
      </span>
      <span style={{ color: "#7a7a6e", textDecoration: "line-through" }}>
        {from}
      </span>
      <span style={{ color: "#9a9a8e", fontSize: 10 }}>→</span>
      <span style={{ color: "#2a2520", fontWeight: 600 }}>{to}</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PlanYear() {
  const [, navigate] = useLocation();
  const todayWeek = getTodayWeek();

  const grouped = PHASE_ORDER.map((phase) => ({
    phase,
    weeks: PLAN_2026.filter((w) => w.phase === phase),
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4ede0",
        fontFamily: "IBM Plex Sans, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ background: "#1f3d2e", padding: "20px 28px 16px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#b85a3e",
                  marginBottom: 4,
                }}
              >
                Practitioner Operating Plan
              </div>
              <div
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#f4ede0",
                  lineHeight: 1.15,
                }}
              >
                2026 — Week by Week
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => navigate(`${BASE}/plan/today`)}
                style={{
                  background: "#b85a3e",
                  color: "#f4ede0",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Today
              </button>
              {todayWeek && (
                <button
                  onClick={() =>
                    navigate(`${BASE}/plan/week/${todayWeek.isoWeek}`)
                  }
                  style={{
                    background: "rgba(244,237,224,0.12)",
                    color: "#f4ede0",
                    border: "1px solid rgba(244,237,224,0.25)",
                    borderRadius: 6,
                    padding: "8px 16px",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  This Week
                </button>
              )}
            </div>
          </div>

          {/* Phase legend */}
          <div
            style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}
          >
            {PHASE_ORDER.map((phase) => (
              <div
                key={phase}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      PHASE_COLORS[phase].dot === "#1f3d2e"
                        ? "#a3c4a8"
                        : PHASE_COLORS[phase].dot,
                  }}
                />
                <span
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 10,
                    color: "rgba(244,237,224,0.65)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {phase} · {PHASE_WEEK_RANGES[phase]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}
      >
        {/* Bench Swap Audit Panel — hidden when no active swaps */}
        <BenchSwapAudit />

        {grouped.map(({ phase, weeks }) => {
          const colors = PHASE_COLORS[phase];
          return (
            <div key={phase} style={{ marginBottom: 36 }}>
              {/* Phase header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: colors.dot,
                  }}
                />
                <span
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: colors.text,
                  }}
                >
                  {phase}
                </span>
                <span
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 10,
                    color: "#7a7a6e",
                    letterSpacing: "0.1em",
                  }}
                >
                  {PHASE_WEEK_RANGES[phase]}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: colors.bg,
                    marginLeft: 4,
                  }}
                />
              </div>

              {/* Week grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 8,
                }}
              >
                {weeks.map((week) => {
                  const isToday = todayWeek?.isoWeek === week.isoWeek;
                  return (
                    <button
                      key={week.isoWeek}
                      onClick={() =>
                        navigate(`${BASE}/plan/week/${week.isoWeek}`)
                      }
                      style={{
                        background: isToday ? "#1f3d2e" : "#fff",
                        border: isToday
                          ? "2px solid #b85a3e"
                          : "1.5px solid rgba(31,61,46,0.10)",
                        borderRadius: 8,
                        padding: "10px 12px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "box-shadow 0.12s, transform 0.12s",
                        boxShadow: isToday
                          ? "0 2px 12px rgba(184,90,62,0.18)"
                          : "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.boxShadow =
                          "0 3px 10px rgba(31,61,46,0.14)";
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.boxShadow = isToday
                          ? "0 2px 12px rgba(184,90,62,0.18)"
                          : "0 1px 3px rgba(0,0,0,0.05)";
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.transform = "none";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "IBM Plex Mono, monospace",
                            fontSize: 10,
                            fontWeight: 700,
                            color: isToday ? "#b85a3e" : "#7a7a6e",
                            letterSpacing: "0.15em",
                          }}
                        >
                          W{week.isoWeek}
                        </span>
                        {isToday && (
                          <span
                            style={{
                              fontFamily: "IBM Plex Mono, monospace",
                              fontSize: 9,
                              fontWeight: 700,
                              background: "#b85a3e",
                              color: "#fff",
                              padding: "1px 5px",
                              borderRadius: 3,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                            }}
                          >
                            NOW
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: isToday ? "#f4ede0" : "#2a2520",
                          lineHeight: 1.35,
                          marginBottom: 4,
                        }}
                      >
                        {week.theme}
                      </div>
                      <div
                        style={{
                          fontFamily: "IBM Plex Mono, monospace",
                          fontSize: 9,
                          color: isToday
                            ? "rgba(244,237,224,0.5)"
                            : "#9a9a8e",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {formatDateRange(week)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

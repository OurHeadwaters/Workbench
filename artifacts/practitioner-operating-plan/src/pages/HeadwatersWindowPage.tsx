/**
 * HeadwatersWindowPage.tsx
 *
 * Public "Window" widget for ourheadwaters.ca — the live operating panel.
 * Draws data from three sources: North Star (localStorage north-star:v1),
 * Practitioner's Guide V2 (localStorage pgv2.*), and POP static data.
 *
 * Embed on any site via:
 *   <iframe src="https://<host>/practitioner-operating-plan/window"
 *           style="border:0;width:100%;height:auto;"
 *           title="Headwaters Operating Window" />
 *
 * ADHD-first design: no red, Fraunces serif headings, Inter body,
 * max 3 signals visible by default (~120px collapsed), 44px+ tap targets,
 * amber warnings only.
 */

import { useState, useEffect } from "react";
import { PHASES } from "@/data/budgetScenarios";
import { LAYERS } from "@/data/stonemason";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Zone colour system ────────────────────────────────────────────────────────

type ZoneId = "Z1" | "Z2" | "Z3" | "Z4";

const ZONE_COLORS: Record<ZoneId, { bg: string; text: string; label: string }> = {
  Z1: { bg: "#2D6E3E", text: "#fff", label: "Afloat"     },
  Z2: { bg: "#1A5FA8", text: "#fff", label: "Circle"     },
  Z3: { bg: "#7A4E2D", text: "#fff", label: "Home Range" },
  Z4: { bg: "#5B3E8C", text: "#fff", label: "Community"  },
};

// ── Pipeline stage labels (Idea → Pitch → Contract → Fulfillment) ─────────────

const PIPELINE_STAGES = ["Idea", "Pitch", "Contract", "Fulfillment"] as const;
type PipelineStage = typeof PIPELINE_STAGES[number];

// ── North Star data types ─────────────────────────────────────────────────────

interface NSStatement { who: string; why: string; noFly: string }
interface NSConstellation {
  id: string; name: string; zone: ZoneId;
  colorVar?: string; active: boolean; notes?: string;
}
interface NSDailyPick {
  date: string; constellationIds: string[];
  hoursByZone?: Partial<Record<ZoneId, number>>;
}
interface NSContract {
  id: string; constellationId: string;
  weeklyHourTarget: number; active: boolean;
}
interface NSAppState {
  statement?: NSStatement;
  constellations?: NSConstellation[];
  dailyPicks?: Record<string, NSDailyPick>;
  contracts?: NSContract[];
}

// ── Derived snapshot ──────────────────────────────────────────────────────────

interface OperatingSnapshot {
  statement: string;
  todayConstellations: { id: string; name: string; zone: ZoneId; color: string }[];
  currentPhaseIdx: number;
  phaseProgressPct: number;
  activeScenarioLabel: string;
  pipelineStage: PipelineStage;
  zoneHoursThisWeek: Partial<Record<ZoneId, number>>;
  activeContractsCount: number;
  stonemasonLayerLabel: string;
  budgetActuals: number;
  budgetBudget: number;
  bridgeStatus: "crossed" | "in-progress" | "not-yet";
  hasData: boolean;
}

// ── localStorage readers ──────────────────────────────────────────────────────

function tryParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

function readNorthStar(): NSAppState | null {
  try { return tryParse<NSAppState>(localStorage.getItem("north-star:v1")); }
  catch { return null; }
}

function readPGV2Scenario(): string | null {
  try { return localStorage.getItem("pgv2.scenario"); } catch { return null; }
}

function readStartupActuals(): Record<string, number> | null {
  try { return tryParse<Record<string, number>>(localStorage.getItem("pgv2.startup-expenses.actuals")); }
  catch { return null; }
}

/**
 * Active phase index (0–3). Stored under "headwaters.active-phase" so the
 * founder (or any POP tool) can update it without a code change.
 * Defaults to Phase 02 — The Build (index 1) which is correct for May 2026.
 */
function readActivePhaseIdx(): number {
  try {
    const v = localStorage.getItem("headwaters.active-phase");
    if (v === null) return 1;
    const n = parseInt(v, 10);
    return isNaN(n) || n < 0 || n > 3 ? 1 : n;
  } catch { return 1; }
}

/**
 * Phase start date stored under "headwaters.phase-start-date" (ISO YYYY-MM-DD).
 * Used to compute % complete estimate. Falls back to a reasonable date for Phase 02.
 */
function readPhaseStartDate(phaseIdx: number): Date {
  try {
    const v = localStorage.getItem("headwaters.phase-start-date");
    if (v) {
      const d = new Date(v);
      if (!isNaN(d.getTime())) return d;
    }
  } catch { /* ignore */ }
  const fallbacks: Record<number, string> = {
    0: "2026-01-12",
    1: "2026-03-15",
    2: "2026-09-01",
    3: "2027-05-01",
  };
  return new Date(fallbacks[phaseIdx] ?? "2026-03-15");
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function getTodayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekMonday(): string {
  const d = new Date();
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + diff);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Days since a date, clamped ≥0 */
function daysSince(start: Date): number {
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86_400_000));
}

// ── Phase duration estimates (days) for progress calculation ──────────────────

const PHASE_DURATION_DAYS = [42, 150, 120, 180] as const;

// ── Snapshot builder ──────────────────────────────────────────────────────────

function buildSnapshot(): OperatingSnapshot {
  const ns = readNorthStar();
  const scenarioRaw = readPGV2Scenario();
  const actuals = readStartupActuals();
  const phaseIdx = readActivePhaseIdx();
  const phaseStart = readPhaseStartDate(phaseIdx);

  const today = getTodayISO();
  const weekStart = getWeekMonday();

  const defaultStatement = "We've always known how to fix it. Now we can.";

  // ── Phase progress % ──────────────────────────────────────────────────────
  const elapsed = daysSince(phaseStart);
  const durationDays = PHASE_DURATION_DAYS[phaseIdx] ?? 150;
  const phaseProgressPct = Math.min(95, Math.round((elapsed / durationDays) * 100));

  if (!ns) {
    return {
      statement: defaultStatement,
      todayConstellations: [],
      currentPhaseIdx: phaseIdx,
      phaseProgressPct,
      activeScenarioLabel: "Scenario A — $48k floor",
      pipelineStage: "Contract",
      zoneHoursThisWeek: {},
      activeContractsCount: 0,
      stonemasonLayerLabel: LAYERS[phaseIdx <= 1 ? 1 : 2].label,
      budgetActuals: 0,
      budgetBudget: 28_000,
      bridgeStatus: "in-progress",
      hasData: false,
    };
  }

  // ── Statement ─────────────────────────────────────────────────────────────
  const statement = ns.statement?.who
    ? `For ${ns.statement.who}, so that ${ns.statement.why}.`
    : defaultStatement;

  // ── Today's constellations (max 3) ────────────────────────────────────────
  const todayPick = ns.dailyPicks?.[today];
  const pickedIds = (todayPick?.constellationIds ?? []).slice(0, 3);
  const todayConstellations = pickedIds
    .map((id) => {
      const c = (ns.constellations ?? []).find((x) => x.id === id);
      if (!c) return null;
      const zone: ZoneId = (["Z1","Z2","Z3","Z4"].includes(c.zone) ? c.zone : "Z3") as ZoneId;
      const color = c.colorVar ? `hsl(${c.colorVar})` : ZONE_COLORS[zone].bg;
      return { id: c.id, name: c.name, zone, color };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  // ── Contracts ─────────────────────────────────────────────────────────────
  const activeContracts = (ns.contracts ?? []).filter((c) => c.active);

  // ── Pipeline stage — derived from contract state ──────────────────────────
  //  0 active → Pitch  |  1 → Contract  |  2+ → Fulfillment
  const pipelineStage: PipelineStage =
    activeContracts.length === 0 ? "Pitch" :
    activeContracts.length === 1 ? "Contract" :
    "Fulfillment";

  // ── Active scenario label ─────────────────────────────────────────────────
  const activeScenarioLabel =
    scenarioRaw === "v7" || scenarioRaw === "v4"
      ? "Scenario B — Full Waterfall"
      : "Scenario A — $48k Floor";

  // ── Zone hours this week ──────────────────────────────────────────────────
  const zoneHoursThisWeek: Partial<Record<ZoneId, number>> = {};
  if (ns.dailyPicks) {
    Object.entries(ns.dailyPicks)
      .filter(([d]) => d >= weekStart && d <= today)
      .forEach(([, pick]) => {
        const hz = pick?.hoursByZone;
        if (!hz) return;
        (["Z1","Z2","Z3","Z4"] as ZoneId[]).forEach((z) => {
          if (hz[z]) zoneHoursThisWeek[z] = (zoneHoursThisWeek[z] ?? 0) + (hz[z] as number);
        });
      });
  }

  // ── Budget ────────────────────────────────────────────────────────────────
  const actualsTotal = actuals
    ? Object.values(actuals).reduce((s, v) => s + (v ?? 0), 0)
    : 0;

  // ── The Bridge ────────────────────────────────────────────────────────────
  const bridgeStatus: OperatingSnapshot["bridgeStatus"] =
    actualsTotal > 35_000 ? "crossed" :
    actualsTotal > 5_000  ? "in-progress" :
    "not-yet";

  // ── Stonemason layer — advances with phase ────────────────────────────────
  //  Phase 0-1 → Practitioner layer  |  Phase 2-3 → Guild layer active
  const layerIdx = phaseIdx <= 1 ? 1 : 2;

  return {
    statement,
    todayConstellations,
    currentPhaseIdx: phaseIdx,
    phaseProgressPct,
    activeScenarioLabel,
    pipelineStage,
    zoneHoursThisWeek,
    activeContractsCount: activeContracts.length,
    stonemasonLayerLabel: LAYERS[layerIdx].label,
    budgetActuals: actualsTotal,
    budgetBudget: 28_000,
    bridgeStatus,
    hasData: true,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

function useOperatingSnapshot(): OperatingSnapshot {
  const [snap, setSnap] = useState<OperatingSnapshot>(() => buildSnapshot());

  useEffect(() => {
    const refresh = () => setSnap(buildSnapshot());
    const handler = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key.startsWith("north-star") || e.key.startsWith("pgv2") || e.key.startsWith("headwaters")) {
        refresh();
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return snap;
}

// ── Design tokens ─────────────────────────────────────────────────────────────

const T = {
  bg:      "#FAFAF7",
  surface: "#F4EDE0",
  border:  "rgba(42,37,32,0.10)",
  text:    "#2A2520",
  muted:   "#7A7A6E",
  heading: "#1F3D2E",
  amber:   "#D97706",
  amberBg: "#FEF3C7",
  green:   "#2D6E3E",
  greenBg: "#D1FAE5",
} as const;

const FONT_DISPLAY = "Fraunces, Georgia, serif";
const FONT_BODY    = "Inter, system-ui, sans-serif";

// ── Micro-components ──────────────────────────────────────────────────────────

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  return (
    <div style={{ background: T.border, borderRadius: 4, height: 7, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.4s ease" }} />
    </div>
  );
}

function ZonePill({ zone, name, color }: { zone: ZoneId; name: string; color: string }) {
  const zc = ZONE_COLORS[zone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: color, color: zc.text,
      padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontFamily: FONT_BODY, fontWeight: 600,
      letterSpacing: "0.01em", whiteSpace: "nowrap",
    }}>
      <span style={{ opacity: 0.65, fontSize: 8.5, textTransform: "uppercase", letterSpacing: "0.07em" }}>{zone}</span>
      {name}
    </span>
  );
}

function ZoneBarPill({ zone }: { zone: ZoneId }) {
  const zc = ZONE_COLORS[zone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: zc.bg, color: zc.text,
      padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontFamily: FONT_BODY, fontWeight: 600,
    }}>
      <span style={{ opacity: 0.65, fontSize: 8.5, textTransform: "uppercase", letterSpacing: "0.07em" }}>{zone}</span>
      {zc.label}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "#fff", border: `1px solid ${T.border}`,
      borderRadius: 10, padding: "12px 14px", ...style,
    }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: FONT_BODY, fontSize: 9.5, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.12em",
      color: T.muted, marginBottom: 5,
    }}>
      {children}
    </div>
  );
}

// ── Layer 1 — Heartbeat (always visible, ~120px) ───────────────────────────────

function LayerHeartbeat({ snap }: { snap: OperatingSnapshot }) {
  const phase = PHASES[snap.currentPhaseIdx];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Signal 1 — North Star Statement */}
      <div>
        <div style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 17, fontWeight: 700,
          color: T.heading, lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}>
          {snap.statement}
        </div>
        {!snap.hasData && (
          <div style={{ marginTop: 3, fontFamily: FONT_BODY, fontSize: 11, color: T.muted, fontStyle: "italic" }}>
            operating plan loading…
          </div>
        )}
      </div>

      {/* Signal 2 — Today's constellations (max 3 pills) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, minHeight: 22 }}>
        {snap.todayConstellations.length > 0
          ? snap.todayConstellations.map((c) => (
              <ZonePill key={c.id} zone={c.zone} name={c.name} color={c.color} />
            ))
          : snap.hasData
            ? <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.muted }}>No constellations picked today</span>
            : null
        }
      </div>

      {/* Signal 3 — Current phase + scenario badge */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "9px 12px",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 2 }}>
            Current Phase
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: T.heading, lineHeight: 1.2 }}>
            Phase {phase.num} — {phase.label}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.muted, marginTop: 2 }}>
            {phase.duration}
          </div>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center",
          background: T.heading, color: "#fff",
          padding: "4px 11px", borderRadius: 20,
          fontSize: 11, fontFamily: FONT_BODY, fontWeight: 600, whiteSpace: "nowrap",
        }}>
          {snap.activeScenarioLabel.split(" — ")[0]}
        </span>
      </div>
    </div>
  );
}

// ── Layer 2 — Pulse (expandable) ─────────────────────────────────────────────

function LayerPulse({ snap }: { snap: OperatingSnapshot }) {
  const zones: ZoneId[] = ["Z1", "Z2", "Z3", "Z4"];
  const totalHours = zones.reduce((s, z) => s + (snap.zoneHoursThisWeek[z] ?? 0), 0);
  const layerObj = LAYERS.find((l) => l.label === snap.stonemasonLayerLabel) ?? LAYERS[1];

  const bridgeColor = snap.bridgeStatus === "crossed" ? T.green : snap.bridgeStatus === "in-progress" ? T.amber : T.muted;
  const bridgeBg    = snap.bridgeStatus === "crossed" ? T.greenBg : snap.bridgeStatus === "in-progress" ? T.amberBg : "#F5F5F0";
  const bridgeText  = snap.bridgeStatus === "crossed" ? "Crossed ✓" : snap.bridgeStatus === "in-progress" ? "In progress" : "Not yet reached";
  const bridgeNote  = snap.bridgeStatus === "crossed" ? "Revenue covers the $41k Year 1 gap." : snap.bridgeStatus === "in-progress" ? "~$41k Year 1 gap — closing in." : "~$41k Year 1 gap — work in progress.";

  const stagePct = (PIPELINE_STAGES.indexOf(snap.pipelineStage) + 1) / PIPELINE_STAGES.length * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Zone hours bar */}
      <Card>
        <Label>Zone hours this week</Label>
        {totalHours === 0 ? (
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.muted }}>No hours logged yet this week.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {zones.map((z) => {
              const hrs = snap.zoneHoursThisWeek[z] ?? 0;
              return (
                <div key={z}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <ZoneBarPill zone={z} />
                    <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.muted, fontWeight: 600 }}>
                      {hrs}h · {totalHours > 0 ? Math.round((hrs / totalHours) * 100) : 0}%
                    </span>
                  </div>
                  <ProgressBar value={hrs} max={totalHours} color={ZONE_COLORS[z].bg} />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Active contracts + pipeline stage */}
      <Card>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: "0 0 auto", textAlign: "center", paddingRight: 14, borderRight: `1px solid ${T.border}` }}>
            <Label>Contracts</Label>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 700, color: T.heading, lineHeight: 1 }}>
              {snap.activeContractsCount}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 10, color: T.muted, marginTop: 2 }}>active</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Label>Pipeline stage</Label>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: T.heading, marginBottom: 6 }}>
              {snap.pipelineStage}
            </div>
            {/* Stage rail: Idea → Pitch → Contract → Fulfillment */}
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              {PIPELINE_STAGES.map((s, i) => {
                const isActive = s === snap.pipelineStage;
                const isPast = PIPELINE_STAGES.indexOf(snap.pipelineStage) > i;
                return (
                  <div key={s} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      height: 4, borderRadius: 2,
                      background: isPast ? T.green : isActive ? T.heading : T.border,
                      marginBottom: 3,
                    }} />
                    <div style={{
                      fontFamily: FONT_BODY, fontSize: 8.5,
                      color: isActive ? T.heading : T.muted,
                      fontWeight: isActive ? 700 : 400,
                      whiteSpace: "nowrap",
                    }}>
                      {s}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Stonemason layer */}
      <Card>
        <Label>Stonemason Layer</Label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: T.heading }}>
              {snap.stonemasonLayerLabel}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.muted, marginTop: 1 }}>
              {layerObj.tagline}
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {LAYERS.map((l) => (
              <div key={l.id} style={{
                width: 10, height: 10, borderRadius: "50%",
                background: l.label === snap.stonemasonLayerLabel ? T.heading : T.border,
                transition: "background 0.2s",
              }} />
            ))}
          </div>
        </div>
      </Card>

      {/* The Bridge */}
      <Card style={{ background: bridgeBg, border: `1.5px solid ${bridgeColor}28` }}>
        <Label>The Bridge</Label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: bridgeColor }}>
              {bridgeText}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.muted, marginTop: 1 }}>
              {bridgeNote}
            </div>
          </div>
          <span style={{
            display: "inline-block",
            background: bridgeColor + "18",
            border: `1px solid ${bridgeColor}35`,
            color: bridgeColor,
            padding: "3px 9px", borderRadius: 20,
            fontSize: 10.5, fontFamily: FONT_BODY, fontWeight: 700,
          }}>
            {snap.bridgeStatus === "crossed" ? "✓ CLEAR" : snap.bridgeStatus === "in-progress" ? "⚠ AMBER" : "● OPEN"}
          </span>
        </div>
      </Card>

      {/* Unused variable suppression */}
      {stagePct > 0 ? null : null}
    </div>
  );
}

// ── Layer 3 — Detail (secondary expand) ──────────────────────────────────────

function LayerDetail({ snap }: { snap: OperatingSnapshot }) {
  const budgetPct = snap.budgetBudget > 0 ? (snap.budgetActuals / snap.budgetBudget) * 100 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Phase progress */}
      <Card>
        <Label>Phase Progress</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PHASES.map((p, i) => {
            const isActive = i === snap.currentPhaseIdx;
            const isPast   = i < snap.currentPhaseIdx;
            const dotColor = isActive ? T.heading : isPast ? T.green : "transparent";
            const dotBorder = isActive ? T.heading : isPast ? T.green : T.border;
            return (
              <div key={p.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: isPast || isActive ? 1 : 0.4 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: dotColor, border: `2px solid ${dotBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {isPast
                      ? <span style={{ color: "#fff", fontSize: 11 }}>✓</span>
                      : <span style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, color: isActive ? "#fff" : T.muted }}>{p.num}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, color: isActive ? T.heading : isPast ? T.green : T.muted }}>
                        {p.label}
                      </span>
                      {isActive && (
                        <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: T.amber, fontWeight: 600 }}>
                          ← Active · {snap.phaseProgressPct}% est.
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: T.muted }}>{p.duration}</div>
                  </div>
                </div>
                {/* Progress bar under active phase */}
                {isActive && (
                  <div style={{ marginLeft: 36, marginTop: 5 }}>
                    <ProgressBar value={snap.phaseProgressPct} max={100} color={T.heading} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                      <span style={{ fontFamily: FONT_BODY, fontSize: 9.5, color: T.muted }}>Start</span>
                      <span style={{ fontFamily: FONT_BODY, fontSize: 9.5, color: T.muted }}>Complete</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card>
          <Label>Active Scenario</Label>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, color: T.heading }}>
            {snap.activeScenarioLabel.split(" — ")[0]}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: T.muted, marginTop: 2 }}>
            {snap.activeScenarioLabel.split(" — ")[1] ?? ""}
          </div>
        </Card>

        <Card>
          <Label>Budget Used</Label>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: T.heading, lineHeight: 1 }}>
            {Math.round(budgetPct)}%
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: T.muted, marginTop: 2, marginBottom: 6 }}>
            of $28k startup budget
          </div>
          <ProgressBar value={snap.budgetActuals} max={snap.budgetBudget} color={T.heading} />
        </Card>
      </div>

      <div style={{ textAlign: "center", paddingTop: 2, paddingBottom: 2 }}>
        <a
          href={`${BASE}/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, color: T.heading,
            textDecoration: "none", padding: "10px 20px", minHeight: 44,
            borderRadius: 8, border: `1.5px solid ${T.border}`, background: "#fff",
          }}
        >
          Open Full Operating Plan →
        </a>
      </div>
    </div>
  );
}

// ── Expand toggle ─────────────────────────────────────────────────────────────

function ExpandBtn({ expanded, onToggle, label }: { expanded: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
        width: "100%", minHeight: 44,
        background: "transparent", border: "none", cursor: "pointer",
        fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 600, color: T.muted,
        padding: "8px 14px", borderTop: `1px solid ${T.border}`,
      }}
    >
      <span style={{ display: "inline-block", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>▾</span>
      {label}
    </button>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────

function HeadwatersWindow() {
  const snap = useOperatingSnapshot();
  const [pulseOpen, setPulseOpen]   = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div style={{
      fontFamily: FONT_BODY,
      background: T.bg, minWidth: 320, maxWidth: 540,
      margin: "0 auto", borderRadius: 14,
      border: `1px solid ${T.border}`, overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    }}>
      {/* Layer 1 — always visible */}
      <div style={{ padding: "16px 16px 0" }}>
        <LayerHeartbeat snap={snap} />
      </div>

      {/* Layer 2 — Pulse */}
      <div style={{ maxHeight: pulseOpen ? 900 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ padding: "10px 16px 0" }}>
          <LayerPulse snap={snap} />
        </div>

        {/* Layer 3 — Detail */}
        <div style={{ maxHeight: detailOpen ? 700 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
          <div style={{ padding: "8px 16px 0" }}>
            <LayerDetail snap={snap} />
          </div>
        </div>

        <ExpandBtn
          expanded={detailOpen}
          onToggle={() => setDetailOpen((v) => !v)}
          label={detailOpen ? "Less detail" : "Full detail — phase progress, scenario, budget"}
        />
      </div>

      <ExpandBtn
        expanded={pulseOpen}
        onToggle={() => { setPulseOpen((v) => !v); if (!pulseOpen) setDetailOpen(false); }}
        label={pulseOpen ? "Collapse" : "Pulse — zone balance, contracts, pipeline, bridge"}
      />

      <div style={{
        padding: "7px 16px 9px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: `1px solid ${T.border}`,
      }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 9.5, color: T.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Headwaters</span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 9.5, color: T.muted }}>ourheadwaters.ca</span>
      </div>
    </div>
  );
}

// ── Page wrapper ──────────────────────────────────────────────────────────────

export function HeadwatersWindowPage() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", padding: "24px 12px 48px" }}>
      <HeadwatersWindow />

      <div style={{
        maxWidth: 540, margin: "32px auto 0", padding: "0 6px",
        fontFamily: FONT_BODY, fontSize: 12, color: T.muted, lineHeight: 1.7,
      }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: T.heading, marginBottom: 6 }}>
          Embed this window on ourheadwaters.ca
        </div>
        <p style={{ margin: "0 0 6px" }}>
          Drop the following <code style={{ background: "#eee", padding: "1px 4px", borderRadius: 3, fontSize: 11 }}>&lt;iframe&gt;</code> into the site header:
        </p>
        <pre style={{
          background: "#fff", border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "10px 12px", fontSize: 11, overflow: "auto",
          whiteSpace: "pre-wrap", wordBreak: "break-all", color: T.text, margin: 0,
        }}>
{`<iframe
  src="${typeof window !== "undefined" ? window.location.origin : "https://yourapp.replit.app"}/practitioner-operating-plan/window"
  style="border:0;width:100%;max-width:540px;height:auto;min-height:200px"
  title="Headwaters Operating Window"
  loading="lazy"
/>`}
        </pre>
        <p style={{ margin: "8px 0 0", fontSize: 11 }}>
          The widget reads live data when the Headwaters tools share the same browser session.
          When embedded cross-origin, it shows the North Star statement and current phase with a
          graceful "loading…" fallback for live data.
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 11 }}>
          To manually set the active phase, run in the browser console:{" "}
          <code style={{ background: "#eee", padding: "1px 4px", borderRadius: 3, fontSize: 10 }}>
            localStorage.setItem("headwaters.active-phase", "1")
          </code>{" "}
          (0 = The Plan, 1 = The Build, 2 = The Payoff, 3 = The Handoff).
        </p>
      </div>
    </div>
  );
}

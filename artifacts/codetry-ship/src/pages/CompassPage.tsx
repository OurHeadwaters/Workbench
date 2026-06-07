import { useState, useEffect, useRef } from "react";
import { ZONES } from "@/data/zones";
import type { ZoneData, ZoneCorner } from "@/data/zones";

/* ─── Constants ─────────────────────────────────────────────────────────── */

const CREAM = "#f0e8d8";
const PARCHMENT = "#e8ddc8";
const FOREST = "#1f3d2e";
const MUTED = "#7a7a6e";
const INK = "#2a2520";
const STANDBY_AMBER = "#b85a3e";
const RULE = "rgba(180,160,120,0.4)";

/* ─── Quiz types & logic ─────────────────────────────────────────────────── */

type WhoAnswer = "household" | "practitioner" | "community" | null;
type SituationAnswer = "normal" | "standby" | null;

interface QuizState {
  who: WhoAnswer;
  situation: SituationAnswer;
  skipped: boolean;
}

function resolveHighlightedZones(quiz: QuizState): number[] {
  if (quiz.skipped || quiz.who === null || quiz.situation === null) return [];
  const base: Record<NonNullable<WhoAnswer>, number[]> = {
    household: [0],
    practitioner: [2],
    community: [4],
  };
  const zones = [...base[quiz.who]];
  if (quiz.situation === "standby") zones.push(3);
  return zones;
}

const QUIZ_STORAGE_KEY = "headwaters_compass_quiz";
const STANDBY_STORAGE_KEY = "headwaters_compass_standby";
const MODE_STORAGE_KEY = "headwaters_compass_mode";

function loadSavedQuiz(): QuizState | null {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizState;
  } catch { return null; }
}

function saveQuiz(quiz: QuizState) {
  try { localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quiz)); } catch { /**/ }
}

function loadSavedStandby(): boolean {
  try { return localStorage.getItem(STANDBY_STORAGE_KEY) === "1"; }
  catch { return false; }
}

function saveStandby(v: boolean) {
  try { localStorage.setItem(STANDBY_STORAGE_KEY, v ? "1" : "0"); } catch { /**/ }
}

/* ─── Derive corners from ZONES data ────────────────────────────────────── */

interface CornerWithZone extends ZoneCorner {
  zoneNumber: number;
  zoneColor: string;
  svgX: number;
  svgY: number;
}

/* SVG positions for each corner landmark */
const CORNER_SVG_POS: Record<string, [number, number]> = {
  "village-corner": [660, 162],
  "crypto-corner": [668, 408],
};

function buildCorners(): CornerWithZone[] {
  return ZONES.flatMap((z) =>
    z.corner
      ? [{
          ...z.corner,
          zoneNumber: z.number,
          zoneColor: z.color,
          svgX: CORNER_SVG_POS[z.corner.id]?.[0] ?? 0,
          svgY: CORNER_SVG_POS[z.corner.id]?.[1] ?? 0,
        }]
      : []
  );
}

/* ─── SVG map geometry ───────────────────────────────────────────────────── */

const SVG_W = 800;
const SVG_H = 500;

const ZONE_SHAPES: Record<number, string> = {
  0: "M 0,0 L 265,0 L 260,14 L 263,245 L 0,250 Z",
  1: "M 0,250 L 263,245 L 258,500 L 0,500 Z",
  2: "M 260,14 L 265,0 L 535,0 L 538,10 L 540,245 L 263,245 Z",
  3: "M 263,245 L 540,245 L 536,500 L 258,500 Z",
  4: "M 538,10 L 535,0 L 800,0 L 800,250 L 540,245 Z",
  5: "M 540,245 L 800,250 L 800,500 L 536,500 Z",
};

const ZONE_CENTRES: Record<number, [number, number]> = {
  0: [127, 122],
  1: [127, 373],
  2: [397, 118],
  3: [397, 373],
  4: [665, 118],
  5: [665, 373],
};

const TRAIL_PATHS = [
  { id: "t-0-1", d: "M 130,248 Q 108,262 130,270 Q 152,278 130,292" },
  { id: "t-2-3", d: "M 397,248 Q 375,262 397,270 Q 419,278 397,292" },
  { id: "t-4-5", d: "M 670,248 Q 648,262 670,270 Q 692,278 670,292" },
  { id: "t-0-2", d: "M 213,80 Q 237,72 262,80" },
  { id: "t-1-3", d: "M 213,420 Q 237,412 262,420" },
  { id: "t-2-4", d: "M 487,80 Q 511,72 538,80" },
  { id: "t-3-5", d: "M 487,420 Q 511,412 538,420" },
];

/* ─── Selection type ─────────────────────────────────────────────────────── */

type SelectionId = number | string;

/* ─── Zone detail panel content ─────────────────────────────────────────── */

interface PanelContent {
  title: string;
  subtitle: string;
  metaphor?: string;
  desc: string;
  color: string;
  tools: { name: string; tagline: string; url: string; external?: boolean }[];
  cornerNote?: string;
  gateName?: string;
  gateDesc?: string;
}

function buildPanelContent(
  id: SelectionId,
  standby: boolean,
  corners: CornerWithZone[]
): PanelContent | null {
  if (typeof id === "number") {
    const z = ZONES.find((z) => z.number === id);
    if (!z) return null;
    return {
      title: `Z${z.number} — ${z.name}`,
      subtitle: `Zone ${z.number}`,
      metaphor: z.metaphor,
      desc: standby ? z.standbyDesc : z.goodTimesDesc,
      color: z.color,
      tools: z.tools.map((t) => ({
        name: t.name,
        tagline: t.tagline,
        url: t.url,
        external: !t.url.startsWith("/") && t.url !== "#",
      })),
      cornerNote: z.corner
        ? `${z.corner.name} is here — ${z.corner.note}`
        : undefined,
      gateName: z.gateName,
      gateDesc: z.gateDesc,
    };
  }
  const corner = corners.find((c) => c.id === id);
  if (!corner) return null;
  const z = ZONES.find((z) => z.number === corner.zoneNumber)!;
  return {
    title: corner.name,
    subtitle: `Inside Z${z.number} — ${z.name}`,
    desc: corner.note,
    color: corner.zoneColor,
    tools: [{ name: corner.name, tagline: corner.tagline, url: corner.url }],
    cornerNote:
      corner.id === "crypto-corner"
        ? "The Headwaters ship is docked here."
        : undefined,
  };
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center",
        border: `1px solid ${RULE}`, borderRadius: 999,
        background: "rgba(255,253,248,0.7)", padding: 3,
      }}
      role="group"
      aria-label="Toggle map mode"
    >
      <button
        type="button"
        onClick={() => onChange(false)}
        style={{
          padding: "4px 14px", borderRadius: 999, border: "none", cursor: "pointer",
          fontFamily: "monospace", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          background: !value ? FOREST : "transparent",
          color: !value ? CREAM : MUTED, transition: "all 0.15s",
        }}
      >
        Good Times
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        style={{
          padding: "4px 14px", borderRadius: 999, border: "none", cursor: "pointer",
          fontFamily: "monospace", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          background: value ? STANDBY_AMBER : "transparent",
          color: value ? "#fff" : MUTED, transition: "all 0.15s",
        }}
      >
        Standby
      </button>
    </div>
  );
}

function DetailPanel({
  selectionId,
  standby,
  corners,
  onClose,
}: {
  selectionId: SelectionId;
  standby: boolean;
  corners: CornerWithZone[];
  onClose: () => void;
}) {
  const content = buildPanelContent(selectionId, standby, corners);
  if (!content) return null;

  return (
    <div
      style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: "min(340px, 90vw)",
        background: "rgba(245,239,228,0.97)",
        borderLeft: `2px solid ${content.color}44`,
        backdropFilter: "blur(8px)",
        overflowY: "auto", zIndex: 10,
        display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ background: content.color, padding: "18px 18px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>
              {content.subtitle}
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>
              {content.title}
            </div>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Close panel"
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, cursor: "pointer", color: "#fff", fontFamily: "monospace", fontSize: 11, fontWeight: 700, padding: "4px 9px", flexShrink: 0, marginTop: 2 }}
          >✕</button>
        </div>
        {content.metaphor && (
          <p style={{ margin: "10px 0 0", fontSize: 12, color: "rgba(255,255,255,0.7)", fontStyle: "italic", lineHeight: 1.5 }}>
            {content.metaphor}
          </p>
        )}
      </div>

      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: standby ? "rgba(184,90,62,0.07)" : "rgba(31,61,46,0.05)", borderRadius: 8, padding: "10px 12px", border: `1px solid ${standby ? "rgba(184,90,62,0.2)" : "rgba(31,61,46,0.1)"}` }}>
          <div style={{ fontFamily: "monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: standby ? STANDBY_AMBER : FOREST, marginBottom: 5 }}>
            {standby ? "Standby" : "Good Times"}
          </div>
          <p style={{ margin: 0, fontSize: 12, color: INK, lineHeight: 1.6 }}>{content.desc}</p>
        </div>

        {content.cornerNote && (
          <div style={{ background: "rgba(91,62,140,0.07)", borderRadius: 8, padding: "9px 12px", border: "1px solid rgba(91,62,140,0.2)", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, lineHeight: 1.2, flexShrink: 0 }}>⛵</span>
            <p style={{ margin: 0, fontSize: 11, color: "#5B3E8C", lineHeight: 1.5, fontStyle: "italic" }}>{content.cornerNote}</p>
          </div>
        )}

        {content.tools.length > 0 && (
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 7 }}>
              Tools in this zone
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {content.tools.map((tool) => {
                const disabled = tool.url === "#";
                return (
                  <a
                    key={tool.name}
                    href={disabled ? undefined : tool.url}
                    target={tool.external ? "_blank" : undefined}
                    rel={tool.external ? "noopener noreferrer" : undefined}
                    style={{ display: "block", padding: "9px 12px", borderRadius: 7, border: `1px solid ${RULE}`, background: "rgba(255,253,248,0.85)", textDecoration: "none", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1 }}
                    onClick={disabled ? (e) => e.preventDefault() : undefined}
                  >
                    <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: content.color, marginBottom: 2 }}>
                      {tool.name}{tool.external && <span style={{ color: MUTED, marginLeft: 4 }}>↗</span>}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{tool.tagline}</div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {content.gateName && (
          <div style={{ borderRadius: 7, border: `1px dashed rgba(180,160,120,0.6)`, padding: "9px 12px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: content.color, marginBottom: 4 }}>
              Gate → {content.gateName}
            </div>
            <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{content.gateDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Quiz overlay ───────────────────────────────────────────────────────── */

function QuizOverlay({ quiz, onComplete, onSkip }: { quiz: QuizState; onComplete: (next: QuizState) => void; onSkip: () => void }) {
  const [who, setWho] = useState<WhoAnswer>(quiz.who);
  const [situation, setSituation] = useState<SituationAnswer>(quiz.situation);

  const WHO_OPTIONS: { value: WhoAnswer; label: string; sub: string }[] = [
    { value: "household", label: "A household", sub: "Family, individual, or home unit" },
    { value: "practitioner", label: "A practitioner", sub: "Self-employed, contractor, or agency" },
    { value: "community", label: "A board or community", sub: "Governance, hall, or collective" },
  ];
  const SIT_OPTIONS: { value: SituationAnswer; label: string; sub: string }[] = [
    { value: "normal", label: "Normal period", sub: "Everyday life — nothing urgent moving" },
    { value: "standby", label: "Active standby", sub: "Something is moving — the network is watching" },
  ];

  function chip(label: string, sub: string, selected: boolean, color: string, onClick: () => void) {
    return (
      <button
        key={label} type="button" onClick={onClick}
        style={{ flex: "1 1 140px", minWidth: 0, padding: "10px 13px", borderRadius: 8, border: selected ? `1.5px solid ${color}` : `1px solid ${RULE}`, background: selected ? `${color}14` : "rgba(255,253,248,0.85)", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
      >
        <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: selected ? color : INK, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.4 }}>{sub}</div>
      </button>
    );
  }

  function handleSituation(v: SituationAnswer) {
    setSituation(v);
    setTimeout(() => { if (who !== null) onComplete({ who, situation: v, skipped: false }); }, 200);
  }

  return (
    <div
      style={{ position: "absolute", inset: 0, background: "rgba(32,28,22,0.55)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onSkip(); }}
    >
      <div
        style={{ background: "#f4ede0", borderRadius: 12, padding: "22px 22px 18px", maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: FOREST }}>Find your zone</div>
          <button type="button" onClick={onSkip} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, textDecoration: "underline", textDecorationStyle: "dotted" as const }}>
            Skip — browse all zones
          </button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: INK, fontWeight: 600, lineHeight: 1.4 }}>Who are you?</p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const }}>
            {WHO_OPTIONS.map((o) => chip(o.label, o.sub, who === o.value, FOREST, () => setWho(o.value)))}
          </div>
        </div>
        {who !== null && (
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: INK, fontWeight: 600, lineHeight: 1.4 }}>What's your current situation?</p>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const }}>
              {SIT_OPTIONS.map((o) => chip(o.label, o.sub, situation === o.value, o.value === "standby" ? STANDBY_AMBER : FOREST, () => handleSituation(o.value)))}
            </div>
          </div>
        )}
        <p style={{ margin: "14px 0 0", fontSize: 10, color: MUTED, lineHeight: 1.5 }}>Tap a zone on the compass to explore its tools — or use this to highlight your starting territory.</p>
      </div>
    </div>
  );
}

/* ─── Mobile zone card list ──────────────────────────────────────────────── */

function MobileZoneList({ standby, highlightedZones, corners, onSelect }: { standby: boolean; highlightedZones: number[]; corners: CornerWithZone[]; onSelect: (id: SelectionId) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {ZONES.map((zone) => {
        const highlighted = highlightedZones.includes(zone.number);
        const corner = corners.find((c) => c.zoneNumber === zone.number);
        return (
          <button
            key={zone.number} type="button" onClick={() => onSelect(zone.number)}
            style={{ display: "block", width: "100%", borderRadius: 10, border: highlighted ? `2px solid ${zone.color}` : `1px solid ${RULE}`, overflow: "hidden", background: highlighted ? `${zone.color}08` : "#faf7f2", cursor: "pointer", textAlign: "left", transition: "border 0.2s, box-shadow 0.2s", boxShadow: highlighted ? `0 0 0 3px ${zone.color}22` : "none" }}
          >
            <div style={{ background: zone.color, padding: "11px 15px 9px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.18)", fontFamily: "monospace", fontSize: 11, fontWeight: 900, color: "#fff", flexShrink: 0 }}>{zone.number}</span>
                <div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{zone.name}</div>
                  {corner && <div style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", marginTop: 1 }}>⚓ {corner.name}</div>}
                </div>
              </div>
            </div>
            <div style={{ padding: "9px 15px 11px" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#4a4035", lineHeight: 1.55 }}>{standby ? zone.standbyDesc : zone.goodTimesDesc}</p>
              {corner && (
                <div style={{ marginTop: 7, display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ fontSize: 13 }}>{corner.id === "crypto-corner" ? "⛵" : "🏛"}</span>
                  <a href={corner.url} style={{ fontSize: 11, color: zone.color, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em" }} onClick={(e) => e.stopPropagation()}>
                    {corner.name} →
                  </a>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─── SVG map ────────────────────────────────────────────────────────────── */

function CompassSVG({
  standby, highlightedZones, selectedId, pulsingZones, corners,
  onSelectZone, onSelectCorner,
}: {
  standby: boolean;
  highlightedZones: number[];
  selectedId: SelectionId | null;
  pulsingZones: number[];
  corners: CornerWithZone[];
  onSelectZone: (n: number) => void;
  onSelectCorner: (id: string) => void;
}) {
  const quizActive = highlightedZones.length > 0;

  function zoneOpacity(n: number) {
    if (!quizActive) return 1;
    return highlightedZones.includes(n) ? 1 : 0.4;
  }

  function zoneFill(zone: ZoneData) { return zone.color + "38"; }

  function zoneStroke(zone: ZoneData) {
    if (selectedId === zone.number) return zone.color;
    if (highlightedZones.includes(zone.number)) return zone.color + "cc";
    return zone.color + "66";
  }

  function zoneStrokeWidth(zone: ZoneData) {
    if (selectedId === zone.number) return 2.5;
    if (highlightedZones.includes(zone.number)) return 1.8;
    return 1;
  }

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: "block", borderRadius: "4px 4px 0 0" }} aria-label="Headwaters Compass — spatial zone map" role="img">
      <defs>
        <pattern id="parchment-dots" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="none" />
          <circle cx="1" cy="1" r="0.45" fill="rgba(160,130,80,0.18)" />
          <circle cx="4" cy="4" r="0.35" fill="rgba(160,130,80,0.12)" />
        </pattern>
        <pattern id="standby-hatch" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(30)">
          <line x1="0" y1="0" x2="0" y2="10" stroke={STANDBY_AMBER} strokeWidth="0.8" strokeOpacity="0.14" />
        </pattern>
        <filter id="zone-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Pulse animation keyframes via CSS */}
        <style>{`
          @keyframes zone-pulse-ring {
            0%   { stroke-opacity: 0.7; stroke-width: 4; }
            60%  { stroke-opacity: 0.15; stroke-width: 14; }
            100% { stroke-opacity: 0; stroke-width: 20; }
          }
          .zone-pulse { animation: zone-pulse-ring 1.2s ease-out forwards; }
        `}</style>
      </defs>

      <rect width={SVG_W} height={SVG_H} fill={PARCHMENT} />
      <rect width={SVG_W} height={SVG_H} fill="url(#parchment-dots)" />
      {standby && <rect width={SVG_W} height={SVG_H} fill="url(#standby-hatch)" />}

      {/* Zone territories */}
      {ZONES.map((zone) => (
        <g key={zone.number} style={{ cursor: "pointer" }} onClick={() => onSelectZone(zone.number)} opacity={zoneOpacity(zone.number)}>
          <path d={ZONE_SHAPES[zone.number]} fill={zoneFill(zone)} stroke={zoneStroke(zone)} strokeWidth={zoneStrokeWidth(zone)} strokeLinejoin="round" style={{ transition: "fill 0.2s, stroke 0.2s, opacity 0.2s" }} />
          {highlightedZones.includes(zone.number) && (
            <path d={ZONE_SHAPES[zone.number]} fill="none" stroke={zone.color} strokeWidth={4} strokeLinejoin="round" opacity={0.18} filter="url(#zone-glow)" />
          )}
        </g>
      ))}

      {/* Post-quiz pulse rings — animate on highlighted zone centres */}
      {pulsingZones.map((n) => {
        const [cx, cy] = ZONE_CENTRES[n];
        const zone = ZONES.find((z) => z.number === n)!;
        return (
          <circle
            key={`pulse-${n}`}
            cx={cx} cy={cy}
            r={60}
            fill="none"
            stroke={zone.color}
            className="zone-pulse"
            style={{ pointerEvents: "none" }}
          />
        );
      })}

      {/* Stomping trails */}
      {TRAIL_PATHS.map((trail) => (
        <path key={trail.id} d={trail.d} fill="none" stroke={INK} strokeWidth={1.4} strokeDasharray="4 4" strokeLinecap="round" opacity={0.28} />
      ))}

      {/* Crypto trail */}
      <path d="M 665,375 Q 672,390 668,408" fill="none" stroke="#5B3E8C" strokeWidth={1.8} strokeDasharray="5 3" strokeLinecap="round" opacity={0.55} />
      {[380, 390, 400].map((y, i) => (
        <circle key={i} cx={666 + (i % 2 === 0 ? 2 : -2)} cy={y} r={1.5} fill="#5B3E8C" opacity={0.4} />
      ))}

      {/* Village trail */}
      <path d="M 662,120 Q 668,140 660,162" fill="none" stroke="#0F766E" strokeWidth={1.8} strokeDasharray="5 3" strokeLinecap="round" opacity={0.55} />

      {/* Zone labels */}
      {ZONES.map((zone) => {
        const [cx, cy] = ZONE_CENTRES[zone.number];
        return (
          <g key={`label-${zone.number}`} style={{ pointerEvents: "none" }}>
            <circle cx={cx} cy={cy - 22} r={11} fill={zone.color} opacity={0.85} />
            <text x={cx} y={cy - 17} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily="monospace">{zone.number}</text>
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={zone.color} fontFamily="Georgia, serif" opacity={0.92}>{zone.name}</text>
            <text x={cx} y={cy + 18} textAnchor="middle" fontSize="8.5" fill={zone.color} fontFamily="monospace" opacity={0.7} letterSpacing="0.08em">{zone.rootLabel.toUpperCase()}</text>
          </g>
        );
      })}

      {/* Corner landmarks — derived from zones.ts */}
      {corners.map((corner) => {
        const icon = corner.id === "crypto-corner" ? "⛵" : "🏛";
        const label = corner.id === "crypto-corner" ? ["CRYPTO", "CORNER"] : ["VILLAGE", "CORNER"];
        const selected = selectedId === corner.id;
        return (
          <g key={corner.id} style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onSelectCorner(corner.id); }}>
            <circle cx={corner.svgX} cy={corner.svgY} r={17} fill={corner.zoneColor} opacity={selected ? 0.95 : 0.75} stroke="#fff" strokeWidth={1.5} />
            <text x={corner.svgX} y={corner.svgY + 6} textAnchor="middle" fontSize="14" fill="#fff">{icon}</text>
            <text x={corner.svgX} y={corner.svgY + 28} textAnchor="middle" fontSize="8" fontWeight="800" fill={corner.zoneColor} fontFamily="monospace" letterSpacing="0.05em">{label[0]}</text>
            <text x={corner.svgX} y={corner.svgY + 38} textAnchor="middle" fontSize="8" fontWeight="800" fill={corner.zoneColor} fontFamily="monospace" letterSpacing="0.05em">{label[1]}</text>
          </g>
        );
      })}

      {/* Compass rose */}
      <g transform="translate(40,460)" opacity={0.35} style={{ pointerEvents: "none" }}>
        <circle cx={0} cy={0} r={14} fill="none" stroke={INK} strokeWidth={0.8} />
        <line x1={0} y1={-14} x2={0} y2={14} stroke={INK} strokeWidth={0.8} />
        <line x1={-14} y1={0} x2={14} y2={0} stroke={INK} strokeWidth={0.8} />
        <text x={0} y={-17} textAnchor="middle" fontSize="7" fill={INK} fontFamily="monospace" fontWeight="700">N</text>
      </g>

      {/* Standby badges */}
      {standby && ZONES.map((zone) => {
        const [cx, cy] = ZONE_CENTRES[zone.number];
        return (
          <g key={`standby-${zone.number}`} style={{ pointerEvents: "none" }}>
            <rect x={cx - 22} y={cy + 25} width={44} height={14} rx={7} fill={STANDBY_AMBER} opacity={0.82} />
            <text x={cx} y={cy + 35} textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff" fontFamily="monospace" letterSpacing="0.12em">STANDBY</text>
          </g>
        );
      })}

      <text x={SVG_W / 2} y={SVG_H - 8} textAnchor="middle" fontSize="8" fill={INK} fontFamily="monospace" opacity={0.22} letterSpacing="0.18em">
        HEADWATERS COMPASS — SIX ZONES · TWO CORNERS · ONE NEIGHBOURHOOD
      </text>
    </svg>
  );
}

/* ─── Zone-aware next steps ──────────────────────────────────────────────── */

interface NextStep {
  label: string;
  href: string;
  desc: string;
  external?: boolean;
}

const NEXT_STEPS: Record<string, NextStep[]> = {
  household: [
    {
      label: "Set up your Saltbox",
      href: "/gather/",
      desc: "Your household readiness kit — roles, checklist, and standby status.",
    },
    {
      label: "The Handbook",
      href: "/codetry-handbook/",
      desc: "How a community runs its own economy — offline-first reading.",
    },
    {
      label: "Begin the Odyssey",
      href: "/odyssey",
      desc: "The Arc: language, discipline, and practice for a practitioner household.",
    },
  ],
  practitioner: [
    {
      label: "Practitioner's Guide",
      href: "/practitioners-guide-v2/",
      desc: "Your financial cockpit — money, contracts, scenarios, and debt attack.",
    },
    {
      label: "The Operating Plan",
      href: "/practitioner-operating-plan/",
      desc: "Daily bench — morning debrief, week plan, year overview.",
    },
    {
      label: "Research Library",
      href: "/library/",
      desc: "Northern food systems evidence to back your practice.",
    },
  ],
  community: [
    {
      label: "Research Library",
      href: "/library/",
      desc: "Northern food systems evidence for grants and governance arguments.",
    },
    {
      label: "Village Corner — Village Board",
      href: "/sandbox/",
      desc: "The co-op governance layer — 60-family community board.",
    },
    {
      label: "The Handbook",
      href: "/codetry-handbook/",
      desc: "How the community economy runs — foundational reading for boards.",
    },
  ],
};

const ZONE_LABEL: Record<string, string> = {
  household: "Zone 0 — your kitchen table",
  practitioner: "Zone 2 — your working bench",
  community: "Zone 4 — Community Hall",
};

const ZONE_COLOUR: Record<string, string> = {
  household: "#7A4E2D",
  practitioner: "#1A5FA8",
  community: "#0F766E",
};

function ZoneNextSteps({
  who,
  standby,
}: {
  who: "household" | "practitioner" | "community";
  standby: boolean;
}) {
  const steps = NEXT_STEPS[who] ?? [];
  const color = ZONE_COLOUR[who] ?? FOREST;
  const zoneLabel = ZONE_LABEL[who] ?? "";

  return (
    <div
      style={{
        marginTop: 16,
        padding: "16px 18px",
        borderRadius: 8,
        background: `${color}08`,
        border: `1px solid ${color}25`,
        maxWidth: 600,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
          flexWrap: "wrap" as const,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color,
              marginBottom: 2,
            }}
          >
            What's next for you
          </div>
          <div
            style={{
              fontSize: 12,
              color: MUTED,
              fontStyle: "italic",
            }}
          >
            {zoneLabel}
            {standby && (
              <span style={{ color: STANDBY_AMBER, marginLeft: 6 }}>
                · Standby mode
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {steps.map((step) => (
          <a
            key={step.label}
            href={step.href}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              padding: "9px 12px",
              borderRadius: 6,
              border: `1px solid ${color}20`,
              background: "rgba(255,253,248,0.85)",
              textDecoration: "none",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = `${color}0c`;
              (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}45`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,253,248,0.85)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}20`;
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 800,
                color,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              →
            </span>
            <div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  color,
                  marginBottom: 2,
                  letterSpacing: "0.06em",
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: MUTED,
                  lineHeight: 1.45,
                }}
              >
                {step.desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── Mode tab bar ───────────────────────────────────────────────────────── */

type CompassMode = "map" | "registry";

function loadSavedMode(): CompassMode {
  try {
    const v = localStorage.getItem(MODE_STORAGE_KEY);
    if (v === "registry") return "registry";
  } catch { /**/ }
  return "map";
}

function saveMode(m: CompassMode) {
  try { localStorage.setItem(MODE_STORAGE_KEY, m); } catch { /**/ }
}

function ModeTabBar({ mode, onChange }: { mode: CompassMode; onChange: (m: CompassMode) => void }) {
  const tabs: { id: CompassMode; label: string }[] = [
    { id: "map", label: "Map" },
    { id: "registry", label: "Registry" },
  ];
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center",
        border: `1px solid ${RULE}`, borderRadius: 999,
        background: "rgba(255,253,248,0.7)", padding: 3,
      }}
      role="tablist"
      aria-label="Compass view mode"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={mode === tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: "4px 16px", borderRadius: 999, border: "none", cursor: "pointer",
            fontFamily: "monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            background: mode === tab.id ? FOREST : "transparent",
            color: mode === tab.id ? CREAM : MUTED,
            transition: "all 0.15s",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Registry view ──────────────────────────────────────────────────────── */

function RegistryView() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const zonesWithTools = ZONES.map((zone) => {
    const tools = zone.tools.filter((t) => {
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        (t.zoneAddress ?? "").toLowerCase().includes(q)
      );
    });
    return { zone, tools };
  }).filter(({ tools }) => tools.length > 0 || !q);

  const totalTools = ZONES.reduce((n, z) => n + z.tools.length, 0);

  return (
    <div>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <span style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          fontSize: 14, opacity: 0.45, pointerEvents: "none",
        }}>🔍</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${totalTools} tools across ${ZONES.length} zones…`}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 14px 10px 38px",
            borderRadius: 8, border: `1px solid ${RULE}`,
            background: "rgba(255,253,248,0.9)",
            fontFamily: "monospace", fontSize: 12, color: INK,
            outline: "none",
          }}
        />
        {query && (
          <button
            type="button" onClick={() => setQuery("")}
            aria-label="Clear search"
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "monospace", fontSize: 11, color: MUTED, padding: "2px 6px",
            }}
          >✕</button>
        )}
      </div>

      {/* Zone groups */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {zonesWithTools.map(({ zone, tools }) => {
          const visibleTools = q ? tools : zone.tools;
          if (visibleTools.length === 0) return null;
          return (
            <div key={zone.number}>
              {/* Zone header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                marginBottom: 10, paddingBottom: 8,
                borderBottom: `2px solid ${zone.color}30`,
              }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 26, height: 26, borderRadius: "50%",
                  background: zone.color, flexShrink: 0,
                  fontFamily: "monospace", fontSize: 11, fontWeight: 900, color: "#fff",
                }}>{zone.number}</span>
                <div>
                  <span style={{
                    fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700,
                    color: zone.color,
                  }}>{zone.name}</span>
                  <span style={{
                    fontFamily: "monospace", fontSize: 9, color: MUTED,
                    marginLeft: 8, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}>
                    {visibleTools.length} tool{visibleTools.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Tool cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {visibleTools.map((tool) => {
                  const isComingSoon = tool.url === "#";
                  const isExternal = !tool.inThisProject;
                  return (
                    <div
                      key={`${zone.number}-${tool.name}`}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 12px", borderRadius: 8,
                        border: `1px solid ${RULE}`,
                        background: isComingSoon ? "rgba(255,253,248,0.5)" : "rgba(255,253,248,0.9)",
                        opacity: isComingSoon ? 0.55 : 1,
                        flexWrap: "wrap" as const,
                      }}
                    >
                      {/* Zone address badge */}
                      {tool.zoneAddress && (
                        <span style={{
                          fontFamily: "monospace", fontSize: 8, fontWeight: 800,
                          letterSpacing: "0.12em", color: zone.color,
                          background: `${zone.color}14`,
                          border: `1px solid ${zone.color}30`,
                          borderRadius: 4, padding: "2px 6px", flexShrink: 0,
                          whiteSpace: "nowrap" as const,
                        }}>
                          {tool.zoneAddress}
                        </span>
                      )}

                      {/* Name + tagline */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                          color: INK, marginBottom: 1,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                        }}>
                          {tool.name}
                        </div>
                        <div style={{
                          fontSize: 11, color: MUTED, lineHeight: 1.4,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                        }}>
                          {tool.tagline}
                        </div>
                      </div>

                      {/* Status + link */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        {isExternal && (
                          <span style={{
                            fontFamily: "monospace", fontSize: 8, fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: "#0F766E", background: "rgba(15,118,110,0.08)",
                            border: "1px solid rgba(15,118,110,0.2)",
                            borderRadius: 4, padding: "2px 6px",
                          }}>External</span>
                        )}
                        {isComingSoon ? (
                          <span style={{
                            fontFamily: "monospace", fontSize: 8, fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: MUTED, background: `${RULE}`,
                            border: `1px solid ${RULE}`,
                            borderRadius: 4, padding: "2px 6px",
                          }}>Soon</span>
                        ) : (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 3,
                              padding: "5px 12px", borderRadius: 5,
                              background: zone.color, color: "#fff",
                              fontFamily: "monospace", fontSize: 9, fontWeight: 700,
                              letterSpacing: "0.12em", textTransform: "uppercase",
                              textDecoration: "none",
                              whiteSpace: "nowrap" as const,
                            }}
                          >
                            Open {isExternal && <span style={{ fontSize: 10 }}>↗</span>}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {q && zonesWithTools.every(({ tools }) => tools.length === 0) && (
          <div style={{
            textAlign: "center" as const, padding: "40px 16px",
            fontFamily: "monospace", fontSize: 12, color: MUTED,
          }}>
            No tools match "{query}" — try a different term.
          </div>
        )}
      </div>

      {/* Registry footer */}
      <div style={{
        marginTop: 24, paddingTop: 14, borderTop: `1px solid ${RULE}`,
        fontFamily: "monospace", fontSize: 9, color: MUTED,
        letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        {totalTools} tools · {ZONES.length} zones · Switch to Map view to see spatial layout
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

export function CompassPage() {
  const CORNERS = buildCorners();
  const savedQuiz = loadSavedQuiz();

  const [mode, setMode] = useState<CompassMode>(loadSavedMode);
  const [standby, setStandby] = useState(loadSavedStandby);
  const [quiz, setQuiz] = useState<QuizState>(savedQuiz ?? { who: null, situation: null, skipped: false });
  const [showQuiz, setShowQuiz] = useState(!savedQuiz);
  const [selectedId, setSelectedId] = useState<SelectionId | null>(null);
  const [pulsingZones, setPulsingZones] = useState<number[]>([]);
  const [useNarrow, setUseNarrow] = useState(false);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleModeChange(m: CompassMode) {
    setMode(m);
    saveMode(m);
  }

  useEffect(() => {
    function check() { setUseNarrow(window.innerWidth < 640); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const highlightedZones = resolveHighlightedZones(quiz);

  function triggerPulse(zones: number[]) {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    setPulsingZones(zones);
    pulseTimerRef.current = setTimeout(() => setPulsingZones([]), 1400);
  }

  function handleStandbyChange(v: boolean) {
    setStandby(v);
    saveStandby(v);
  }

  function handleQuizComplete(next: QuizState) {
    setQuiz(next);
    saveQuiz(next);
    setShowQuiz(false);
    const zones = resolveHighlightedZones(next);
    if (zones.length > 0) {
      setSelectedId(zones[0]);
      triggerPulse(zones);
      try { localStorage.setItem("compassResult", String(zones[0])); } catch { /**/ }
    }
    if (next.situation === "standby") handleStandbyChange(true);
    else if (next.situation === "normal") handleStandbyChange(false);
  }

  function handleQuizSkip() {
    const skipped: QuizState = { who: null, situation: null, skipped: true };
    setQuiz(skipped);
    saveQuiz(skipped);
    setShowQuiz(false);
  }

  function handleSelectZone(n: number) {
    setSelectedId((prev) => (prev === n ? null : n));
  }

  function handleSelectCorner(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleReset() {
    try {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
      localStorage.removeItem("compassResult");
    } catch { /**/ }
    setQuiz({ who: null, situation: null, skipped: false });
    setShowQuiz(true);
    setSelectedId(null);
    setPulsingZones([]);
  }

  return (
    <main style={{ minHeight: "100dvh", background: CREAM, color: INK }}>
      <div aria-hidden className="od-topo pointer-events-none" style={{ position: "fixed", inset: 0, opacity: 0.045, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "36px 16px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>
            Headwaters · Spatial Wayfinding
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 700, color: FOREST, lineHeight: 1.15, margin: "0 0 6px" }}>
                The Compass
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: MUTED, lineHeight: 1.6, maxWidth: 520 }}>
                Six zones. Two corners. One neighbourhood. Tap any zone or landmark to see its tools and meaning.
              </p>
              <div style={{ marginTop: 12, padding: "9px 13px", borderRadius: 7, background: "rgba(31,61,46,0.055)", border: "1px solid rgba(31,61,46,0.12)", maxWidth: 520 }}>
                <div style={{ fontFamily: "monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: FOREST, marginBottom: 5 }}>
                  In the watershed
                </div>
                <p style={{ margin: 0, fontSize: 11, color: INK, lineHeight: 1.65 }}>
                  Each zone is terrain in the same watershed described on the{" "}
                  <a href="/map" style={{ color: FOREST, textDecoration: "underline", textDecorationStyle: "dotted" }}>Map</a>.
                  {" "}Zones 0–5 run from hearthside to horizon:{" "}
                  {ZONES.map((z, i) => (
                    <span key={z.number}>
                      <span style={{ color: z.color, fontWeight: 700 }}>Z{z.number}</span>
                      {" "}<span style={{ color: MUTED }}>{z.terrain}</span>
                      {i < ZONES.length - 1 ? " · " : "."}
                    </span>
                  ))}
                  {" "}The Compass and the Map read the same ground.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const, flexShrink: 0 }}>
              <ModeTabBar mode={mode} onChange={handleModeChange} />
              {mode === "map" && (
                <>
                  <ToggleSwitch value={standby} onChange={handleStandbyChange} />
                  <button type="button" onClick={() => setShowQuiz(true)}
                    style={{ background: "none", border: `1px solid rgba(31,61,46,0.25)`, borderRadius: 6, cursor: "pointer", fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: FOREST, padding: "5px 12px" }}>
                    Find my zone
                  </button>
                  {quiz.who !== null && !quiz.skipped && (
                    <button type="button" onClick={handleReset}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, textDecoration: "underline", textDecorationStyle: "dotted" as const, padding: 0 }}>
                      Reset
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quiz result chip */}
          {!showQuiz && quiz.who !== null && !quiz.skipped && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, padding: "5px 12px", borderRadius: 999, background: `${FOREST}12`, border: `1px solid ${FOREST}30`, fontFamily: "monospace", fontSize: 10, color: FOREST, fontWeight: 700, letterSpacing: "0.1em" }}>
              <span style={{ opacity: 0.7 }}>Your zone:</span>
              <strong>Zone {highlightedZones.join(" + Zone ")}</strong>
              {quiz.situation === "standby" && <span style={{ color: STANDBY_AMBER, marginLeft: 2 }}>· Standby active</span>}
            </div>
          )}

          {/* Zone-aware next steps */}
          {!showQuiz && quiz.who !== null && !quiz.skipped && (
            <ZoneNextSteps who={quiz.who} standby={quiz.situation === "standby"} />
          )}
        </div>

        {mode === "registry" ? (
          <RegistryView />
        ) : useNarrow ? (
          /* Mobile: card list */
          <div>
            <div style={{ background: "#faf5ec", borderRadius: 8, padding: "10px 14px", marginBottom: 14, border: `1px solid ${RULE}`, fontSize: 11, color: MUTED, fontStyle: "italic" }}>
              Tap a zone to see its tools and description.
            </div>
            {/* Mobile detail panel */}
            {selectedId !== null && (() => {
              const content = buildPanelContent(selectedId, standby, CORNERS);
              if (!content) return null;
              return (
                <div style={{ borderRadius: 10, border: `2px solid ${content.color}`, marginBottom: 16, overflow: "hidden" }}>
                  <div style={{ background: content.color, padding: "12px 15px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>{content.subtitle}</div>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>{content.title}</div>
                    </div>
                    <button type="button" onClick={() => setSelectedId(null)} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 5, cursor: "pointer", color: "#fff", fontFamily: "monospace", fontSize: 11, fontWeight: 700, padding: "3px 8px" }}>✕</button>
                  </div>
                  <div style={{ padding: "12px 14px", background: "#faf7f2", display: "flex", flexDirection: "column", gap: 10 }}>
                    {content.metaphor && <p style={{ margin: 0, fontSize: 12, color: MUTED, fontStyle: "italic", lineHeight: 1.5 }}>{content.metaphor}</p>}
                    <p style={{ margin: 0, fontSize: 12, color: INK, lineHeight: 1.6 }}>{content.desc}</p>
                    {content.cornerNote && <p style={{ margin: 0, fontSize: 11, color: "#5B3E8C", fontStyle: "italic" }}>⛵ {content.cornerNote}</p>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {content.tools.map((tool) => (
                        <a key={tool.name} href={tool.url === "#" ? undefined : tool.url} target={tool.external ? "_blank" : undefined} rel={tool.external ? "noopener noreferrer" : undefined}
                          style={{ display: "block", padding: "8px 11px", borderRadius: 6, border: `1px solid ${RULE}`, background: "rgba(255,253,248,0.9)", textDecoration: "none", opacity: tool.url === "#" ? 0.5 : 1 }}
                          onClick={tool.url === "#" ? (e) => e.preventDefault() : undefined}>
                          <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: content.color }}>{tool.name}</div>
                          <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{tool.tagline}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
            <MobileZoneList standby={standby} highlightedZones={highlightedZones} corners={CORNERS} onSelect={(id) => setSelectedId((prev) => prev === id ? null : id)} />
          </div>
        ) : (
          /* Desktop: SVG map */
          <div style={{ position: "relative", borderRadius: 10, border: `1.5px solid rgba(180,150,100,0.45)`, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)" }}>
            <CompassSVG
              standby={standby}
              highlightedZones={highlightedZones}
              selectedId={selectedId}
              pulsingZones={pulsingZones}
              corners={CORNERS}
              onSelectZone={handleSelectZone}
              onSelectCorner={handleSelectCorner}
            />
            {selectedId !== null && (
              <DetailPanel selectionId={selectedId} standby={standby} corners={CORNERS} onClose={() => setSelectedId(null)} />
            )}
            {showQuiz && (
              <QuizOverlay quiz={quiz} onComplete={handleQuizComplete} onSkip={handleQuizSkip} />
            )}
            {/* Legend bar */}
            <div style={{ background: "rgba(240,232,216,0.96)", borderTop: `1px solid rgba(180,150,100,0.3)`, padding: "8px 14px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>Legend:</span>
              {ZONES.map((z) => (
                <button key={z.number} type="button" onClick={() => handleSelectZone(z.number)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: z.color, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontFamily: "monospace", fontSize: 8, color: z.color, fontWeight: 700, letterSpacing: "0.08em" }}>Z{z.number} {z.name}</span>
                </button>
              ))}
              <span style={{ fontFamily: "monospace", fontSize: 8, color: MUTED, marginLeft: "auto" }}>⛵ Crypto Corner &nbsp;·&nbsp; 🏛 Village Corner</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 28, paddingTop: 18, borderTop: `1px solid ${RULE}`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.5 }}>
            The Compass shows the six zones of the Headwaters neighbourhood. The original list view is at{" "}
            <a href="/map" style={{ color: FOREST, textDecoration: "underline" }}>/map</a>.
          </p>
          <a href="/odyssey" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 6, background: FOREST, color: CREAM, fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", flexShrink: 0 }}>
            Begin the Odyssey →
          </a>
        </div>
      </div>
    </main>
  );
}

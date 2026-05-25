import React, { useState } from "react";

/* ─── constants ──────────────────────────────────────────────────────────── */
const CX = 178, CY = 118;   // SVG map centre
const VW = 360, VH = 236;   // SVG viewBox

const BG   = "#0b1812";
const CARD = "rgba(11,24,18,0.92)";

/* ─── zone definitions ───────────────────────────────────────────────────── */
const ZONES = [
  { id: "z5", r: 155, name: "THE RIDGE",    line1: "Far horizon.",           line2: "Wild country.",              color: "#8a9882", sw: 1.2,  kit: "The Arc"         },
  { id: "z4", r: 120, name: "THE MARKET",   line1: "Where your community",    line2: "meets and trades.",          color: "#c8a830", sw: 1.4,  kit: "Economy Kit"     },
  { id: "z3", r: 90,  name: "THE CLEARING", line1: "You're building",         line2: "this right now.",            color: "#9060cc", sw: 1.6,  kit: "North Star"      },
  { id: "z2", r: 62,  name: "THE TRAIL",    line1: "Steady work.",            line2: "You've walked it before.",   color: "#3a90c8", sw: 1.8,  kit: "Field Guide"     },
  { id: "z1", r: 37,  name: "THE YARD",     line1: "What you tend",           line2: "every single day.",          color: "#3ab07a", sw: 2.0,  kit: "Family Kit"      },
  { id: "z0", r: 16,  name: "THE HEARTH",   line1: "Where the",               line2: "fire starts.",               color: "#d4843c", sw: 0,    kit: "Fracture Kit"    },
] as const;

type ZoneId = typeof ZONES[number]["id"];

/* ─── layer definitions ──────────────────────────────────────────────────── */
const LAYERS = [
  { id: 0, label: "THE LAND",  sub: "The shape of the ground. Six zones from your hearth to the horizon." },
  { id: 1, label: "THE PATHS", sub: "The worn routes. Where people walk when they stop following the map." },
  { id: 2, label: "THE PIPES", sub: "What runs underneath. The pressure canner seals value under pressure — holds it without rotting." },
  { id: 3, label: "THE FIRE",  sub: "Everything lit. The full territory revealed. Someone found fire." },
] as const;

type LayerId = 0 | 1 | 2 | 3;

/* ─── stomping paths (hand-drawn worn routes between zones) ──────────────── */
// Each path goes FROM one zone boundary TO another in a specific direction
// All paths are cubic bezier curves — organic, not ruler-straight
const STOMP_PATHS: { d: string; label: string }[] = [
  // Hearth → Yard, heading East — the daily walk from bed to work
  { d: `M ${CX + 16} ${CY} C ${CX + 24} ${CY - 4} ${CX + 29} ${CY - 3} ${CX + 37} ${CY}`, label: "Hearth to Yard" },
  // Yard → Trail, heading SE — the trail to the field
  { d: `M ${CX + 26} ${CY + 26} C ${CX + 34} ${CY + 34} ${CX + 40} ${CY + 40} ${CX + 44} ${CY + 44}`, label: "Yard to Trail" },
  // Trail → Clearing, heading SW — the path to the build site
  { d: `M ${CX - 44} ${CY + 44} C ${CX - 52} ${CY + 54} ${CX - 56} ${CY + 58} ${CX - 64} ${CY + 64}`, label: "Trail to Clearing" },
  // Clearing → Market, heading North — the community route
  { d: `M ${CX} ${CY - 90} C ${CX + 4} ${CY - 100} ${CX + 2} ${CY - 108} ${CX} ${CY - 120}`, label: "Clearing to Market" },
  // Shortcut: Hearth → Trail heading NW — the shortcut people actually take
  { d: `M ${CX - 11} ${CY - 11} C ${CX - 22} ${CY - 22} ${CX - 36} ${CY - 36} ${CX - 44} ${CY - 44}`, label: "Shortcut NW" },
  // Long connection: Yard → Market, heading NE — the ambition line
  { d: `M ${CX + 26} ${CY - 26} C ${CX + 52} ${CY - 60} ${CX + 70} ${CY - 80} ${CX + 85} ${CY - 85}`, label: "Yard to Market NE" },
];

/* ─── pressure canner network (pipes layer — the decentralised ledger) ───── */
const PIPE_NODES: [number, number][] = [
  [CX - 90, CY - 70], [CX + 92, CY - 68], [CX + 130, CY + 20],
  [CX + 85,  CY + 90], [CX - 88, CY + 88], [CX - 128, CY + 18],
  [CX,       CY - 40], [CX - 36, CY + 10], [CX + 38,  CY + 10],
  [CX - 20,  CY + 38], [CX + 20, CY - 36], [CX + 68,  CY - 42],
  [CX - 70,  CY + 44],
];

const PIPE_EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],   // outer ring
  [0,6],[1,6],[1,11],[2,11],[2,8],[3,8], // outer to mid
  [3,9],[4,9],[4,12],[5,12],[5,7],[0,7], // mid connections
  [6,10],[7,8],[8,9],[9,12],[12,7],      // inner web
  [6,11],[10,8],[10,11],
];

/* ─── helpers ────────────────────────────────────────────────────────────── */
function ptOnCircle(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ─── component ──────────────────────────────────────────────────────────── */
export default function HomeBlueprint() {
  const [layer, setLayer]         = useState<LayerId>(0);
  const [active, setActive]       = useState<ZoneId | null>(null);

  const activeZone = ZONES.find(z => z.id === active) ?? null;
  const isFire     = layer === 3;
  const showPaths  = layer >= 1;
  const showPipes  = layer >= 2;

  function handleZoneClick(id: ZoneId) {
    setActive(prev => prev === id ? null : id);
  }

  /* glow opacity ramps up toward fire layer */
  function glowOpacity(base: number) {
    return base + layer * 0.06;
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: BG,
      display: "flex", flexDirection: "column",
      fontFamily: "Inter, system-ui, sans-serif",
      overflow: "hidden",
      WebkitFontSmoothing: "antialiased",
    }}>

      {/* ── MAP AREA ─────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>

        {/* Background fire glow when fire layer active */}
        {isFire && (
          <div style={{
            position: "absolute",
            left: `calc(${CX / VW * 100}% - 120px)`,
            top: `calc(${CY / VH * 100}% - 120px)`,
            width: 240, height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,132,60,0.22) 0%, transparent 70%)",
            pointerEvents: "none",
            animation: "pulse 3s ease-in-out infinite",
          }} />
        )}

        {/* ── SVG MAP ─────────────────────────────────────────────────────── */}
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          style={{ width: "100%", height: "100%", display: "block" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="hearth-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#d4843c" stopOpacity="0.9" />
              <stop offset="60%"  stopColor="#c4783a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#c4783a" stopOpacity="0" />
            </radialGradient>
            <filter id="glow-soft">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-fire">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── PIPES LAYER (pressure canner / decentralised ledger) ── */}
          {showPipes && (
            <g opacity={isFire ? 0.55 : 0.28} filter={isFire ? "url(#glow-soft)" : undefined}>
              {PIPE_EDGES.map(([a, b], i) => {
                const [ax, ay] = PIPE_NODES[a];
                const [bx, by] = PIPE_NODES[b];
                return (
                  <line key={i}
                    x1={ax} y1={ay} x2={bx} y2={by}
                    stroke="#00c8b0" strokeWidth={0.6}
                    strokeDasharray="2,3"
                  />
                );
              })}
              {PIPE_NODES.map(([nx, ny], i) => (
                <circle key={i} cx={nx} cy={ny} r={1.8}
                  fill="#00c8b0" opacity={0.7} />
              ))}
            </g>
          )}

          {/* ── ZONE RINGS (outermost first so centre renders on top) ── */}
          {ZONES.map(z => {
            const isActive  = active === z.id;
            const fireBoost = isFire ? 1.6 : 1;
            const sw        = z.sw;

            if (z.id === "z0") {
              /* Hearth: filled amber disc */
              return (
                <g key={z.id}
                  onClick={() => handleZoneClick(z.id)}
                  style={{ cursor: "pointer" }}>
                  {/* outer glow halo */}
                  <circle cx={CX} cy={CY} r={z.r * 2.4}
                    fill="url(#hearth-glow)"
                    opacity={glowOpacity(0.5) * (isFire ? 1.8 : 1)}
                  />
                  <circle cx={CX} cy={CY} r={z.r}
                    fill={z.color}
                    filter={isFire ? "url(#glow-fire)" : "url(#glow-soft)"}
                    opacity={isActive ? 1 : 0.92}
                  />
                  {isActive && (
                    <circle cx={CX} cy={CY} r={z.r + 4}
                      fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.6}
                      strokeDasharray="3,3"
                    />
                  )}
                </g>
              );
            }

            return (
              <g key={z.id}
                onClick={() => handleZoneClick(z.id)}
                style={{ cursor: "pointer" }}>
                {/* invisible hit area */}
                <circle cx={CX} cy={CY} r={z.r + sw / 2 + 8}
                  fill="none" stroke="transparent" strokeWidth={20} />
                {/* zone ring */}
                <circle cx={CX} cy={CY} r={z.r}
                  fill="none"
                  stroke={z.color}
                  strokeWidth={isActive ? sw * 2.5 * fireBoost : sw * fireBoost}
                  opacity={isActive ? 0.95 : glowOpacity(0.35)}
                  filter={isActive || isFire ? "url(#glow-soft)" : undefined}
                />
                {/* zone label — small, at top of ring */}
                {!active && (
                  <text
                    x={CX} y={CY - z.r - 4}
                    textAnchor="middle"
                    fill={z.color}
                    fontSize={5.5}
                    fontWeight={700}
                    letterSpacing="0.12em"
                    opacity={isFire ? 0.9 : 0.55}
                  >
                    {z.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── STOMPING PATHS (worn human routes between zones) ── */}
          {showPaths && STOMP_PATHS.map((p, i) => (
            <path key={i} d={p.d}
              fill="none"
              stroke="#d4843c"
              strokeWidth={1.2}
              strokeDasharray="4,3.5"
              opacity={isFire ? 0.75 : 0.42}
              filter={isFire ? "url(#glow-soft)" : undefined}
            />
          ))}

          {/* ── COMPASS DOT ─────────────────────────────────────── */}
          <text x={VW - 8} y={VH - 6}
            textAnchor="end"
            fill="rgba(255,255,255,0.12)"
            fontSize={5}
            letterSpacing="0.1em"
            fontWeight={600}
          >CHANNEL EVERY DROP</text>
        </svg>

        {/* ── ACTIVE ZONE INFO CARD (right side in landscape) ─────────────── */}
        {activeZone && (
          <div style={{
            position: "absolute",
            top: "50%", right: 16,
            transform: "translateY(-50%)",
            width: "min(38vw, 160px)",
            background: CARD,
            border: `1px solid ${activeZone.color}55`,
            borderLeft: `3px solid ${activeZone.color}`,
            borderRadius: 6,
            padding: "14px 12px",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{
              fontSize: "clamp(14px, 3.5vw, 20px)",
              fontWeight: 900,
              color: activeZone.color,
              lineHeight: 1.1,
              marginBottom: 8,
              letterSpacing: "0.06em",
            }}>
              {activeZone.name}
            </div>
            <div style={{
              fontSize: "clamp(11px, 2.5vw, 14px)",
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.55,
              marginBottom: 10,
            }}>
              {activeZone.line1}<br />{activeZone.line2}
            </div>
            <div style={{
              fontSize: "clamp(9px, 2vw, 11px)",
              color: activeZone.color,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.8,
            }}>
              {activeZone.kit}
            </div>
            <button
              onClick={() => setActive(null)}
              style={{
                position: "absolute", top: 6, right: 8,
                background: "none", border: "none",
                color: "rgba(255,255,255,0.3)",
                fontSize: 14, cursor: "pointer", lineHeight: 1,
                padding: 2,
              }}
            >×</button>
          </div>
        )}

        {/* ── LAYER LABEL (top left) ───────────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 10, left: 12,
          pointerEvents: "none",
        }}>
          <div style={{
            fontSize: "clamp(16px, 4vw, 22px)",
            fontWeight: 900,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.06em",
            lineHeight: 1,
          }}>
            {LAYERS[layer].label}
          </div>
          <div style={{
            fontSize: "clamp(9px, 2vw, 11px)",
            color: "rgba(255,255,255,0.38)",
            marginTop: 4,
            maxWidth: "45vw",
            lineHeight: 1.4,
          }}>
            {LAYERS[layer].sub}
          </div>
        </div>
      </div>

      {/* ── LAYER TAB BAR ───────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(0,0,0,0.4)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {LAYERS.map(l => {
          const active = layer === l.id;
          const colors = ["#8a9882", "#d4843c", "#00c8b0", "#f0a050"] as const;
          return (
            <button
              key={l.id}
              onClick={() => setLayer(l.id as LayerId)}
              style={{
                flex: 1,
                padding: "11px 4px",
                background: active ? `${colors[l.id]}18` : "transparent",
                border: "none",
                borderTop: active ? `2px solid ${colors[l.id]}` : "2px solid transparent",
                cursor: "pointer",
                color: active ? colors[l.id] : "rgba(255,255,255,0.3)",
                fontSize: "clamp(8px, 2.2vw, 11px)",
                fontWeight: active ? 800 : 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "all 0.2s",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      {/* ── pulse animation ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

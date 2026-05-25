import React, { useState, useRef } from "react";

/* ─── constants ──────────────────────────────────────────────────────────── */
const CX = 178, CY = 118;
const VW = 360, VH = 236;
const BG   = "#0b1812";
const CARD = "#0f2018";

/* ─── zone definitions ───────────────────────────────────────────────────── */
const ZONES = [
  {
    id: "z5", r: 155, name: "THE RIDGE",    color: "#8a9882", sw: 1.2,
    line1: "Far horizon.", line2: "Wild country.",
    headline: "You can see it. You're not there yet.",
    body: "The Ridge is what you're building toward — the long game, the open territory. Not wild because it's dangerous. Wild because it hasn't been shaped yet.",
    maps: ["The Arc — steward registration, sovereign", "Lightning / V4V — ambient value stream", "Aquifer — the concept beneath all of it", "Regen Revolution — far horizon framing"],
  },
  {
    id: "z4", r: 120, name: "THE MARKET",   color: "#c8a830", sw: 1.4,
    line1: "Where your community", line2: "meets and trades.",
    headline: "This is where the community comes together.",
    body: "The Market is the zone where individual households connect into something collective. Not charity. Not extraction. Exchange — with memory.",
    maps: ["Economy Kit", "Community Economy Kit", "Research Library", "807 Benefits — 20% passive stream", "Co-op Partnerships", "Community Hall (zone name for the building)"],
  },
  {
    id: "z3", r: 90,  name: "THE CLEARING", color: "#9060cc", sw: 1.6,
    line1: "You're building", line2: "this right now.",
    headline: "The active construction site.",
    body: "The Clearing is where the work is happening today. Not planned, not finished — live. If you hear hammering, it's coming from here.",
    maps: ["North Star — the unified practitioner front door", "Codetry Handbook", "HH Frontend + Full API ✅", "P2P Engine — lateral value flow ✅", "Practitioner Operating Plan", "Codetry Ship — crew manifest"],
  },
  {
    id: "z2", r: 62,  name: "THE TRAIL",    color: "#3a90c8", sw: 1.8,
    line1: "Steady work.", line2: "You've walked it before.",
    headline: "The paid contracts. The known ground.",
    body: "The Trail is where you earn. You've walked it enough times that your feet know the path. This is the consulting layer — bounded scope, relationship-driven, $175/hr.",
    maps: ["Deer Lake Phase 1 — ⚡ June 15", "Helping Hands On-Ramp", "Field Guide Finance — M1–6 ✅", "Sole Prop Bench — invoicing, closeouts", "Codetry Ship /sow — printable SOW"],
  },
  {
    id: "z1", r: 37,  name: "THE YARD",     color: "#3ab07a", sw: 2.0,
    line1: "What you tend", line2: "every single day.",
    headline: "What you reach for every morning.",
    body: "The Yard is the daily rhythm. You tend this without thinking about it. This is the household economy in motion — the bucket system, the food co-op, the homeschool rhythm.",
    maps: ["Bucket System — self-custody, Xaman, RLUSD", "Family Kit", "Homeschool Kit + Gather Round integration", "xBuckets — Watershed App", "807 Food Co-op — local food loop"],
  },
  {
    id: "z0", r: 16,  name: "THE HEARTH",   color: "#d4843c", sw: 0,
    line1: "Where the", line2: "fire starts.",
    headline: "This is your kitchen table.",
    body: "Everything radiates from here. If the Hearth is broken, nothing in the outer zones holds. The Salt Box is the system that protects and tends this room.",
    maps: ["Salt Box — the core system", "Fracture Kit — board by board rebuild", "Rebuild Kit — new life on a stable floor", "Shattered Kit — for when Z0 never existed", "Key Custody — who holds the door", "Magic — Board 1, the ground rod of identity"],
  },
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

/* Navigation order: Hearth → Ridge */
const NAV_ORDER: ZoneId[] = ["z0","z1","z2","z3","z4","z5"];

/* ─── stomping paths ─────────────────────────────────────────────────────── */
const STOMP_PATHS = [
  `M ${CX + 16} ${CY} C ${CX + 24} ${CY - 4} ${CX + 29} ${CY - 3} ${CX + 37} ${CY}`,
  `M ${CX + 26} ${CY + 26} C ${CX + 34} ${CY + 34} ${CX + 40} ${CY + 40} ${CX + 44} ${CY + 44}`,
  `M ${CX - 44} ${CY + 44} C ${CX - 52} ${CY + 54} ${CX - 56} ${CY + 58} ${CX - 64} ${CY + 64}`,
  `M ${CX} ${CY - 90} C ${CX + 4} ${CY - 100} ${CX + 2} ${CY - 108} ${CX} ${CY - 120}`,
  `M ${CX - 11} ${CY - 11} C ${CX - 22} ${CY - 22} ${CX - 36} ${CY - 36} ${CX - 44} ${CY - 44}`,
  `M ${CX + 26} ${CY - 26} C ${CX + 52} ${CY - 60} ${CX + 70} ${CY - 80} ${CX + 85} ${CY - 85}`,
];

/* ─── pressure canner network ────────────────────────────────────────────── */
const NODES: [number, number][] = [
  [CX-90,CY-70],[CX+92,CY-68],[CX+130,CY+20],[CX+85,CY+90],[CX-88,CY+88],
  [CX-128,CY+18],[CX,CY-40],[CX-36,CY+10],[CX+38,CY+10],[CX-20,CY+38],
  [CX+20,CY-36],[CX+68,CY-42],[CX-70,CY+44],
];
const EDGES: [number,number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],
  [0,6],[1,6],[1,11],[2,11],[2,8],[3,8],[3,9],[4,9],[4,12],[5,12],[5,7],[0,7],
  [6,10],[7,8],[8,9],[9,12],[12,7],[6,11],[10,8],[10,11],
];

/* ─── tab colours ────────────────────────────────────────────────────────── */
const TAB_COLORS = ["#8a9882","#d4843c","#00c8b0","#f0a050"] as const;

/* ─── component ──────────────────────────────────────────────────────────── */
export default function HomeBlueprint() {
  const [layer,  setLayer]  = useState<LayerId>(0);
  const [active, setActive] = useState<ZoneId | null>(null);

  const activeZone  = ZONES.find(z => z.id === active) ?? null;
  const isFire      = layer === 3;
  const showPaths   = layer >= 1;
  const showPipes   = layer >= 2;

  const touchX = useRef<number>(0);

  function tap(id: ZoneId) { setActive(prev => prev === id ? null : id); }
  function close()          { setActive(null); }

  function navigate(dir: 1 | -1) {
    if (!active) return;
    const idx = NAV_ORDER.indexOf(active);
    const next = NAV_ORDER[idx + dir];
    if (next) setActive(next);
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

        {/* Hearth glow behind everything when fire active */}
        {isFire && (
          <div style={{
            position: "absolute",
            left: `calc(${CX/VW*100}% - 110px)`, top: `calc(${CY/VH*100}% - 110px)`,
            width: 220, height: 220, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,132,60,0.24) 0%, transparent 70%)",
            pointerEvents: "none",
            animation: "pulse 3s ease-in-out infinite",
          }} />
        )}

        {/* ── SVG MAP ───────────────────────────────────────────────────── */}
        <svg viewBox={`0 0 ${VW} ${VH}`}
          style={{ width: "100%", height: "100%", display: "block" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="hg" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#d4843c" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#c4783a" stopOpacity="0" />
            </radialGradient>
            <filter id="gs"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="gf"><feGaussianBlur stdDeviation="4"   result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Pipes */}
          {showPipes && (
            <g opacity={isFire ? 0.55 : 0.28} filter={isFire ? "url(#gs)" : undefined}>
              {EDGES.map(([a,b],i) => (
                <line key={i}
                  x1={NODES[a][0]} y1={NODES[a][1]}
                  x2={NODES[b][0]} y2={NODES[b][1]}
                  stroke="#00c8b0" strokeWidth={0.6} strokeDasharray="2,3"
                />
              ))}
              {NODES.map(([nx,ny],i) => (
                <circle key={i} cx={nx} cy={ny} r={1.8} fill="#00c8b0" opacity={0.7} />
              ))}
            </g>
          )}

          {/* Zone rings — outermost first */}
          {ZONES.map(z => {
            const isActive = active === z.id;
            const boost    = isFire ? 1.6 : 1;

            if (z.id === "z0") return (
              <g key={z.id} onClick={() => tap(z.id)} style={{ cursor: "pointer" }}>
                <circle cx={CX} cy={CY} r={z.r * 2.8} fill="url(#hg)"
                  opacity={(0.5 + layer * 0.06) * (isFire ? 1.8 : 1)} />
                <circle cx={CX} cy={CY} r={z.r} fill={z.color}
                  filter={isFire ? "url(#gf)" : "url(#gs)"}
                  opacity={isActive ? 1 : 0.92} />
                {isActive && (
                  <circle cx={CX} cy={CY} r={z.r + 5}
                    fill="none" stroke="#fff" strokeWidth={1} opacity={0.5}
                    strokeDasharray="3,3" />
                )}
              </g>
            );

            return (
              <g key={z.id} onClick={() => tap(z.id)} style={{ cursor: "pointer" }}>
                <circle cx={CX} cy={CY} r={z.r}
                  fill="none" stroke="transparent" strokeWidth={22} />
                <circle cx={CX} cy={CY} r={z.r}
                  fill="none"
                  stroke={z.color}
                  strokeWidth={isActive ? z.sw * 2.8 * boost : z.sw * boost}
                  opacity={isActive ? 0.95 : 0.35 + layer * 0.06}
                  filter={isActive || isFire ? "url(#gs)" : undefined}
                />
                {!active && (
                  <g>
                    <rect
                      x={CX - z.name.length * 2.9} y={CY - z.r - 12}
                      width={z.name.length * 5.8} height={10}
                      rx={3} fill="#0b1812" opacity={0.72}
                    />
                    <text x={CX} y={CY - z.r - 5}
                      textAnchor="middle" fill={z.color}
                      fontSize={7.5} fontWeight={800} letterSpacing="0.1em"
                      opacity={isFire ? 1 : 0.9}>
                      {z.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Stomping paths */}
          {showPaths && STOMP_PATHS.map((d, i) => (
            <path key={i} d={d} fill="none"
              stroke="#d4843c" strokeWidth={1.2} strokeDasharray="4,3.5"
              opacity={isFire ? 0.75 : 0.42}
              filter={isFire ? "url(#gs)" : undefined}
            />
          ))}

          <text x={VW-8} y={VH-6} textAnchor="end"
            fill="rgba(255,255,255,0.1)" fontSize={5} letterSpacing="0.1em" fontWeight={600}>
            CHANNEL EVERY DROP
          </text>
        </svg>

        {/* ── PRINT LINK top-right ────────────────────────────────────── */}
        <a
          href="blueprint/print"
          style={{
            position: "absolute", top: 12, right: 14,
            fontSize: 10, fontFamily: "Inter, sans-serif",
            fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            textDecoration: "none",
            padding: "4px 8px",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 4,
          }}
        >
          ⎙ Print
        </a>

        {/* ── LAYER LABEL top-left ────────────────────────────────────── */}
        {!active && (
          <div style={{ position: "absolute", top: 12, left: 14, pointerEvents: "none" }}>
            <div style={{
              fontSize: "clamp(18px, 5vw, 26px)", fontWeight: 900,
              color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em", lineHeight: 1,
            }}>{LAYERS[layer].label}</div>
            <div style={{
              fontSize: "clamp(10px, 2.5vw, 13px)",
              color: "rgba(255,255,255,0.6)", marginTop: 5,
              maxWidth: "55vw", lineHeight: 1.45,
            }}>{LAYERS[layer].sub}</div>
          </div>
        )}

        {/* ── BOTTOM SHEET OVERLAY ──────────────────────────────────────── */}
        {activeZone && (
          <>
            {/* dim scrim */}
            <div
              onClick={close}
              style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.52)",
                backdropFilter: "blur(2px)",
              }}
            />

            {/* sheet */}
            <div
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: CARD,
                borderTop: `2px solid ${activeZone.color}`,
                borderRadius: "16px 16px 0 0",
                padding: "20px 20px 28px",
                maxHeight: "62%",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }}
              onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 44) navigate(dx < 0 ? 1 : -1);
              }}
            >
              {/* drag handle */}
              <div style={{
                width: 36, height: 4, borderRadius: 2,
                background: "rgba(255,255,255,0.15)",
                margin: "-8px auto 14px",
              }} />

              {/* nav row: arrows + dots */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 12,
              }}>
                <button
                  onClick={() => navigate(-1)}
                  disabled={NAV_ORDER.indexOf(active!) === 0}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: NAV_ORDER.indexOf(active!) === 0
                      ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
                    fontSize: 22, lineHeight: 1, padding: "0 4px",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >‹</button>

                {/* position dots */}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {NAV_ORDER.map(id => {
                    const z = ZONES.find(z => z.id === id)!;
                    const isCurrent = id === active;
                    return (
                      <div key={id} onClick={() => setActive(id as ZoneId)}
                        style={{
                          width: isCurrent ? 20 : 6,
                          height: 6, borderRadius: 3,
                          background: isCurrent ? z.color : "rgba(255,255,255,0.2)",
                          transition: "all 0.2s", cursor: "pointer",
                        }}
                      />
                    );
                  })}
                </div>

                <button
                  onClick={() => navigate(1)}
                  disabled={NAV_ORDER.indexOf(active!) === NAV_ORDER.length - 1}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: NAV_ORDER.indexOf(active!) === NAV_ORDER.length - 1
                      ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
                    fontSize: 22, lineHeight: 1, padding: "0 4px",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >›</button>
              </div>

              {/* zone name */}
              <div style={{
                fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900,
                color: activeZone.color, letterSpacing: "0.04em",
                lineHeight: 1.05, marginBottom: 6,
              }}>
                {activeZone.name}
              </div>

              {/* headline */}
              <div style={{
                fontSize: "clamp(13px, 3.5vw, 17px)", fontWeight: 700,
                color: "rgba(255,255,255,0.9)", marginBottom: 10, lineHeight: 1.3,
              }}>
                {activeZone.headline}
              </div>

              {/* body */}
              <div style={{
                fontSize: "clamp(12px, 3vw, 15px)",
                color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 16,
              }}>
                {activeZone.body}
              </div>

              {/* divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 14 }} />

              {/* maps list */}
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", color: activeZone.color,
                opacity: 0.7, marginBottom: 10,
              }}>
                WHAT MAPS HERE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeZone.maps.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: activeZone.color, marginTop: 5, flexShrink: 0,
                    }} />
                    <div style={{
                      fontSize: "clamp(12px, 3vw, 14px)",
                      color: "rgba(255,255,255,0.75)", lineHeight: 1.45,
                    }}>
                      {item}
                    </div>
                  </div>
                ))}
              </div>

              {/* close */}
              <button onClick={close} style={{
                position: "absolute", top: 16, right: 16,
                background: "rgba(255,255,255,0.08)",
                border: "none", borderRadius: "50%",
                width: 28, height: 28, cursor: "pointer",
                color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: "28px",
                textAlign: "center", padding: 0,
                WebkitTapHighlightColor: "transparent",
              }}>×</button>
            </div>
          </>
        )}
      </div>

      {/* ── LAYER TAB BAR ────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(0,0,0,0.45)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        flexShrink: 0,
      }}>
        {LAYERS.map(l => {
          const isActive = layer === l.id;
          const c = TAB_COLORS[l.id];
          return (
            <button key={l.id} onClick={() => setLayer(l.id as LayerId)} style={{
              flex: 1, padding: "12px 4px",
              background: isActive ? `${c}18` : "transparent",
              border: "none",
              borderTop: isActive ? `2px solid ${c}` : "2px solid transparent",
              cursor: "pointer",
              color: isActive ? c : "rgba(255,255,255,0.5)",
              fontSize: "clamp(8px, 2.2vw, 11px)", fontWeight: isActive ? 800 : 500,
              letterSpacing: "0.1em", textTransform: "uppercase",
              transition: "all 0.18s",
              WebkitTapHighlightColor: "transparent",
            }}>
              {l.label}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity:.6; transform:scale(1); }
          50%      { opacity:1;  transform:scale(1.08); }
        }
      `}</style>
    </div>
  );
}

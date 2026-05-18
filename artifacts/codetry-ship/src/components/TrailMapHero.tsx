/**
 * TrailMapHero — illustrated SVG boreal trail map for the Odyssey.
 *
 * Five phase zones rendered as organic terrain bands. A winding cream
 * trail connects five interactive phase markers. Pine silhouettes,
 * a headwaters river, and hand-drawn aesthetic throughout.
 *
 * Props:
 *   currentPhase — 0 = none, 1–5 = active (glows that marker)
 *   onPhaseClick — called with phase number when a marker is clicked
 */

interface TrailMapHeroProps {
  currentPhase?: number;
  onPhaseClick?: (phase: number) => void;
  className?: string;
}

/* ── Phase data ─────────────────────────────────────────────────────────── */

const PHASES = [
  { n: 1, label: "The Saltbox",   season: "Early spring",   trail: "#b85a3e" },
  { n: 2, label: "Both-States",   season: "Late spring",    trail: "#d4a017" },
  { n: 3, label: "Both-Sides",    season: "High summer",    trail: "#2e8b4e" },
  { n: 4, label: "The Standby",   season: "Autumn",         trail: "#c97c2e" },
  { n: 5, label: "The Gate",      season: "First snow",     trail: "#7ab3cc" },
];

/* ── Trail path + phase marker coordinates ─────────────────────────────── */
// Trail winds from bottom-centre to top-right through each phase zone.

const TRAIL_PATH =
  "M 194 470 C 155 445, 165 425, 178 408 C 191 391, 220 375, 128 322 C 36 269, 118 268, 130 238 C 142 208, 215 215, 218 192 C 221 169, 200 165, 178 136 C 156 107, 196 95, 196 80 C 196 65, 218 58, 232 46";

const PHASE_MARKERS = [
  { n: 1, cx: 178, cy: 408, labelX: 198,  labelY: 408, anchor: "start"  },
  { n: 2, cx: 130, cy: 295, labelX: 150,  labelY: 295, anchor: "start"  },
  { n: 3, cx: 218, cy: 192, labelX: 198,  labelY: 192, anchor: "end"    },
  { n: 4, cx: 178, cy: 136, labelX: 158,  labelY: 136, anchor: "end"    },
  { n: 5, cx: 232, cy:  46, labelX: 212,  labelY:  46, anchor: "end"    },
];

/* ── Pine tree helper (small triangular silhouettes) ────────────────────── */

function Pine({ x, y, h, opacity = 0.7 }: { x: number; y: number; h: number; opacity?: number }) {
  const w = h * 0.45;
  const trunk = h * 0.12;
  return (
    <g opacity={opacity}>
      <polygon
        points={`${x},${y - h} ${x - w},${y - trunk} ${x + w},${y - trunk}`}
        fill="#1f3d2e"
      />
      <polygon
        points={`${x},${y - h * 0.62} ${x - w * 0.85},${y} ${x + w * 0.85},${y}`}
        fill="#1a3628"
      />
      <rect x={x - 2} y={y} width={4} height={trunk * 1.5} fill="#2d1a0a" />
    </g>
  );
}

/* ── Woodcut phase icons ─────────────────────────────────────────────────── */

function PhaseIcon({ n, cx, cy, r }: { n: number; cx: number; cy: number; r: number }) {
  const s = r * 0.5;
  if (n === 1) return (
    <g transform={`translate(${cx},${cy})`}>
      <path d={`M0,${-s} C${-s},${-s*0.2} ${-s},${s*0.4} 0,${s} C${s},${s*0.4} ${s},${-s*0.2} 0,${-s}Z`}
        fill="rgba(244,237,224,0.7)" />
    </g>
  );
  if (n === 2) return (
    <g transform={`translate(${cx},${cy})`} fill="none" stroke="rgba(244,237,224,0.7)" strokeWidth="1.4">
      <circle cx={-s*0.4} cy={0} r={s*0.65} />
      <circle cx={ s*0.4} cy={0} r={s*0.65} />
    </g>
  );
  if (n === 3) return (
    <g transform={`translate(${cx},${cy})`} stroke="rgba(244,237,224,0.7)" strokeWidth="1.5" strokeLinecap="round">
      <line x1={0} y1={-s} x2={0} y2={-s*0.1} />
      <line x1={0} y1={-s*0.1} x2={-s*0.8} y2={s*0.9} />
      <line x1={0} y1={-s*0.1} x2={ s*0.8} y2={s*0.9} />
    </g>
  );
  if (n === 4) return (
    <g transform={`translate(${cx},${cy})`}>
      <path d={`M${-s*0.7},${-s*0.3} L${s*0.7},${-s*0.3} L${s*0.5},${s*0.7} L${-s*0.5},${s*0.7} Z`}
        fill="none" stroke="rgba(244,237,224,0.7)" strokeWidth="1.4" />
      <line x1={0} y1={-s} x2={0} y2={-s*0.3} stroke="rgba(244,237,224,0.7)" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
  if (n === 5) return (
    <g transform={`translate(${cx},${cy})`} stroke="rgba(244,237,224,0.7)" strokeWidth="1.4" strokeLinecap="round">
      <line x1={-s} y1={0} x2={s} y2={0} />
      <line x1={-s} y1={-s*0.55} x2={s} y2={-s*0.55} />
      <line x1={-s} y1={ s*0.55} x2={s*0.3} y2={ s*0.55} />
    </g>
  );
  return null;
}

/* ── Main component ──────────────────────────────────────────────────────── */

export function TrailMapHero({ currentPhase = 0, onPhaseClick, className = "" }: TrailMapHeroProps) {
  return (
    <div
      className={`relative w-full select-none ${className}`}
      style={{ background: "#0d1d15" }}
      data-testid="trail-map-hero"
    >
      <svg
        viewBox="0 0 390 510"
        width="100%"
        style={{ display: "block", maxHeight: 560 }}
        aria-label="Odyssey trail map — five phases from The Saltbox to The Gate"
        role="img"
      >
        <defs>
          {/* Trail glow filter */}
          <filter id="trail-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Active phase glow */}
          <filter id="marker-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Atmospheric haze */}
          <radialGradient id="atmos" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1f3d2e" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#0a1610" stopOpacity="0.6" />
          </radialGradient>
          {/* Zone 1 - earth/saltbox */}
          <linearGradient id="zone1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d2010" />
            <stop offset="100%" stopColor="#271308" />
          </linearGradient>
          {/* Zone 2 - cedar forest */}
          <linearGradient id="zone2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b3d24" />
            <stop offset="100%" stopColor="#152e1b" />
          </linearGradient>
          {/* Zone 3 - meadow */}
          <linearGradient id="zone3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#254d2e" />
            <stop offset="100%" stopColor="#1d3d24" />
          </linearGradient>
          {/* Zone 4 - autumn */}
          <linearGradient id="zone4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f2710" />
            <stop offset="100%" stopColor="#2e1c0a" />
          </linearGradient>
          {/* Zone 5 - winter */}
          <linearGradient id="zone5" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c2e3e" />
            <stop offset="100%" stopColor="#162436" />
          </linearGradient>
        </defs>

        {/* ── Sky background ── */}
        <rect width="390" height="510" fill="#0d1d15" />
        {/* Stars (small dots) */}
        {[
          [32,18],[88,8],[155,22],[222,10],[298,16],[344,6],[370,28],
          [14,40],[60,44],[112,36],[182,48],[254,38],[320,28],[358,42],
        ].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r={0.8} fill="rgba(244,237,224,0.5)" />
        ))}

        {/* ── Terrain zone 5 — Winter / The Gate ── */}
        <path
          d="M 0 0 L 390 0 L 390 130
             C 360 118, 330 128, 300 120
             C 270 112, 240 125, 210 118
             C 180 111, 150 122, 120 115
             C  90 108,  60 120,  30 112
             L   0 105 Z"
          fill="url(#zone5)"
        />

        {/* ── Terrain zone 4 — Autumn / The Standby ── */}
        <path
          d="M 0 108
             C  30 115,  60 123,  90 116
             C 120 109, 150 122, 180 115
             C 210 108, 240 120, 270 113
             C 300 106, 330 120, 360 114
             L 390 108 L 390 225
             C 360 215, 330 224, 300 216
             C 270 208, 240 222, 210 215
             C 180 208, 150 220, 120 213
             C  90 206,  60 218,  30 212
             L   0 218 Z"
          fill="url(#zone4)"
        />

        {/* ── Terrain zone 3 — Meadow / Both-Sides ── */}
        <path
          d="M 0 220
             C  30 213,  60 222,  90 215
             C 120 208, 150 220, 180 213
             C 210 206, 240 218, 270 212
             C 300 206, 330 218, 360 212
             L 390 216 L 390 320
             C 360 310, 330 320, 300 312
             C 270 304, 240 318, 210 311
             C 180 304, 150 316, 120 309
             C  90 302,  60 314,  30 308
             L   0 312 Z"
          fill="url(#zone3)"
        />

        {/* ── Terrain zone 2 — Cedar forest / Both-States ── */}
        <path
          d="M 0 314
             C  30 308,  60 318,  90 311
             C 120 304, 150 315, 180 308
             C 210 301, 240 314, 270 307
             C 300 300, 330 312, 360 306
             L 390 310 L 390 405
             C 360 395, 330 406, 300 398
             C 270 390, 240 402, 210 395
             C 180 388, 150 400, 120 393
             C  90 386,  60 398,  30 392
             L   0 396 Z"
          fill="url(#zone2)"
        />

        {/* ── Terrain zone 1 — Bare earth / The Saltbox ── */}
        <path
          d="M 0 398
             C  30 392,  60 402,  90 395
             C 120 388, 150 400, 180 393
             C 210 386, 240 398, 270 391
             C 300 384, 330 396, 360 390
             L 390 394 L 390 510 L 0 510 Z"
          fill="url(#zone1)"
        />

        {/* ── Atmospheric vignette ── */}
        <rect width="390" height="510" fill="url(#atmos)" />

        {/* ── Pine silhouettes ── */}
        {/* Zone 1 trees */}
        <Pine x={50}  y={480} h={55} opacity={0.55} />
        <Pine x={82}  y={490} h={40} opacity={0.45} />
        <Pine x={320} y={475} h={60} opacity={0.55} />
        <Pine x={352} y={487} h={42} opacity={0.50} />
        <Pine x={285} y={492} h={35} opacity={0.40} />

        {/* Zone 2 trees */}
        <Pine x={35}  y={390} h={50} opacity={0.60} />
        <Pine x={62}  y={398} h={38} opacity={0.55} />
        <Pine x={310} y={388} h={54} opacity={0.65} />
        <Pine x={345} y={395} h={38} opacity={0.55} />
        <Pine x={365} y={400} h={30} opacity={0.45} />

        {/* Zone 3 trees */}
        <Pine x={28}  y={305} h={48} opacity={0.65} />
        <Pine x={55}  y={312} h={36} opacity={0.58} />
        <Pine x={322} y={300} h={52} opacity={0.68} />
        <Pine x={356} y={308} h={38} opacity={0.58} />

        {/* Zone 4 trees */}
        <Pine x={38}  y={216} h={44} opacity={0.60} />
        <Pine x={66}  y={222} h={34} opacity={0.52} />
        <Pine x={315} y={210} h={48} opacity={0.65} />
        <Pine x={350} y={218} h={36} opacity={0.55} />

        {/* Zone 5 trees */}
        <Pine x={42}  y={116} h={40} opacity={0.55} />
        <Pine x={72}  y={122} h={30} opacity={0.48} />
        <Pine x={305} y={110} h={44} opacity={0.58} />
        <Pine x={338} y={118} h={32} opacity={0.50} />
        <Pine x={362} y={125} h={26} opacity={0.42} />

        {/* ── Headwaters river — top left ── */}
        <path
          d="M 0 52 C 18 45, 35 58, 55 50 C 72 43, 85 54, 100 48 C 115 42, 128 52, 142 46"
          fill="none"
          stroke="rgba(100,160,200,0.4)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 0 62 C 18 55, 35 68, 55 60 C 72 53, 85 64, 100 58 C 115 52, 128 62, 142 56"
          fill="none"
          stroke="rgba(100,160,200,0.22)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ── Main trail — shadow then cream ── */}
        <path
          d={TRAIL_PATH}
          fill="none"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={TRAIL_PATH}
          fill="none"
          stroke="#f4ede0"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#trail-glow)"
          strokeDasharray="0"
        />

        {/* ── Zone label bands (subtle) ── */}
        {[
          { y: 50,  label: "ZONE 5 · FIRST SNOW",  col: "rgba(122,179,204,0.28)" },
          { y: 160, label: "ZONE 4 · AUTUMN",       col: "rgba(201,124,46,0.28)" },
          { y: 260, label: "ZONE 3 · HIGH SUMMER",  col: "rgba(46,142,78,0.22)" },
          { y: 355, label: "ZONE 2 · LATE SPRING",  col: "rgba(31,61,46,0.22)" },
          { y: 450, label: "ZONE 1 · EARLY SPRING", col: "rgba(184,90,62,0.22)" },
        ].map(({ y, label, col }) => (
          <text
            key={label}
            x="10"
            y={y}
            fontFamily="'JetBrains Mono', 'Courier New', monospace"
            fontSize="6.5"
            letterSpacing="0.18em"
            fill={col}
          >
            {label}
          </text>
        ))}

        {/* ── Phase markers ── */}
        {PHASE_MARKERS.map((m) => {
          const isActive = currentPhase === m.n;
          const phase    = PHASES[m.n - 1];
          const r        = 14;
          return (
            <g
              key={m.n}
              role="button"
              aria-label={`Phase ${m.n}: ${phase.label}`}
              tabIndex={0}
              style={{ cursor: "pointer" }}
              onClick={() => onPhaseClick?.(m.n)}
              onKeyDown={(e) => e.key === "Enter" && onPhaseClick?.(m.n)}
              filter={isActive ? "url(#marker-glow)" : undefined}
            >
              {/* Outer ring (active glow) */}
              {isActive && (
                <circle
                  cx={m.cx} cy={m.cy} r={r + 5}
                  fill="none"
                  stroke={phase.trail}
                  strokeWidth="1.5"
                  opacity={0.55}
                />
              )}
              {/* Dark fill circle */}
              <circle
                cx={m.cx} cy={m.cy} r={r}
                fill={isActive ? "#1f3d2e" : "#0d1d15"}
                stroke={isActive ? phase.trail : "rgba(244,237,224,0.45)"}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {/* Phase icon */}
              <PhaseIcon n={m.n} cx={m.cx} cy={m.cy} r={r} />
              {/* Phase number badge */}
              <text
                x={m.cx}
                y={m.cy + r + 9}
                textAnchor="middle"
                fontFamily="'JetBrains Mono', 'Courier New', monospace"
                fontSize="7"
                letterSpacing="0.12em"
                fill={isActive ? phase.trail : "rgba(244,237,224,0.5)"}
              >
                {String(m.n).padStart(2, "0")}
              </text>
              {/* Phase name (right or left of marker) */}
              <text
                x={m.labelX + (m.anchor === "start" ? 8 : -8)}
                y={m.cy - 4}
                textAnchor={m.anchor as "start" | "end"}
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="10"
                fontStyle="italic"
                fill={isActive ? "#f4ede0" : "rgba(244,237,224,0.62)"}
              >
                {phase.label}
              </text>
              <text
                x={m.labelX + (m.anchor === "start" ? 8 : -8)}
                y={m.cy + 8}
                textAnchor={m.anchor as "start" | "end"}
                fontFamily="'JetBrains Mono', 'Courier New', monospace"
                fontSize="6.5"
                letterSpacing="0.14em"
                fill={isActive ? "rgba(212,160,23,0.85)" : "rgba(244,237,224,0.32)"}
              >
                {phase.season.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* ── Map legend ── */}
        <g transform="translate(10, 490)">
          <circle cx={5} cy={0} r={3.5} fill="none" stroke="rgba(244,237,224,0.4)" strokeWidth="1.2" />
          <text x={13} y={4} fontFamily="'JetBrains Mono', 'Courier New', monospace" fontSize="7"
            fill="rgba(244,237,224,0.28)" letterSpacing="0.12em">
            PHASE MARKER
          </text>
          <line x1={80} y1={0} x2={100} y2={0} stroke="rgba(244,237,224,0.35)" strokeWidth="1.5" strokeLinecap="round" />
          <text x={105} y={4} fontFamily="'JetBrains Mono', 'Courier New', monospace" fontSize="7"
            fill="rgba(244,237,224,0.28)" letterSpacing="0.12em">
            TRAIL
          </text>
        </g>

        {/* ── Map title & sub ── */}
        <text
          x="385" y="494"
          textAnchor="end"
          fontFamily="Georgia, serif"
          fontSize="9"
          fontStyle="italic"
          fill="rgba(244,237,224,0.25)"
        >
          Headwaters Odyssey · 5 Phases · 20 Stations
        </text>
      </svg>
    </div>
  );
}

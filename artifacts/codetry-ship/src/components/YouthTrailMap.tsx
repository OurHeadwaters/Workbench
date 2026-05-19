/**
 * YouthTrailMap — boreal trail map for the Youth Odyssey (StoryPage).
 *
 * 4 phases, 8 stations. Warmer amber palette vs. the practitioner map.
 * The trail starts at the hearth (Your Kitchen, bottom) and winds up
 * through community fire (Your People), rocky terrain (The Hard Thing),
 * and opens into a river crossing at dawn (The Crossing, top).
 *
 * Props:
 *   currentPhase — 1–4 glows that marker, 0 = none
 *   onPhaseClick — called with phase number when a marker is tapped
 */

interface YouthTrailMapProps {
  currentPhase?: number;
  onPhaseClick?: (phase: number) => void;
  className?: string;
}

/* ── Phase data ─────────────────────────────────────────────────────────── */

const PHASES = [
  { n: 1, label: "Your Kitchen",   note: "Where what you know lives",      accent: "#c97c2e" },
  { n: 2, label: "Your People",    note: "The ones who shaped you",         accent: "#d4a017" },
  { n: 3, label: "The Hard Thing", note: "What was called a weakness",      accent: "#b85a3e" },
  { n: 4, label: "The Crossing",   note: "What doesn't need permission",    accent: "#7ab3cc" },
];

/* ── Trail path (4-phase winding, bottom-right → top-left) ──────────────── */

const TRAIL_PATH =
  "M 260 440 C 230 420, 210 405, 195 385 C 180 365, 200 345, 175 315 C 150 285, 120 280, 140 248 C 160 216, 210 220, 205 192 C 200 164, 160 155, 150 128 C 140 101, 165 78, 175 55";

/* ── Marker positions along the trail ──────────────────────────────────── */

const MARKERS = [
  { n: 1, cx: 195, cy: 385, labelX: 215, labelY: 385, anchor: "start" as const },
  { n: 2, cx: 145, cy: 278, labelX: 165, labelY: 278, anchor: "start" as const },
  { n: 3, cx: 205, cy: 192, labelX: 185, labelY: 192, anchor: "end"   as const },
  { n: 4, cx: 175, cy:  55, labelX: 155, labelY:  55, anchor: "end"   as const },
];

/* ── Pine helper ─────────────────────────────────────────────────────────── */

function Pine({ x, y, h, opacity = 0.65 }: { x: number; y: number; h: number; opacity?: number }) {
  const w = h * 0.44;
  const t = h * 0.14;
  return (
    <g opacity={opacity}>
      <polygon
        points={`${x},${y - h} ${x - w},${y - t} ${x + w},${y - t}`}
        fill="#1f3d2e"
      />
      <polygon
        points={`${x},${y - h * 0.6} ${x - w * 0.82},${y} ${x + w * 0.82},${y}`}
        fill="#182f22"
      />
      <rect x={x - 2} y={y} width={4} height={t * 1.4} fill="#2a1608" />
    </g>
  );
}

/* ── Phase-specific woodcut icons ────────────────────────────────────────── */

function YouthIcon({ n, cx, cy, r }: { n: number; cx: number; cy: number; r: number }) {
  const s = r * 0.48;
  const c = "rgba(244,237,224,0.72)";

  if (n === 1) return (
    /* Hearth / fire */
    <g transform={`translate(${cx},${cy})`}>
      <path
        d={`M0,${s*0.8} C${-s*0.7},${s*0.2} ${-s*0.4},${-s*0.6} 0,${-s} C${s*0.4},${-s*0.6} ${s*0.7},${s*0.2} 0,${s*0.8}Z`}
        fill={c}
      />
      <ellipse cx={0} cy={s*0.8} rx={s*0.6} ry={s*0.2} fill={c} opacity={0.4} />
    </g>
  );

  if (n === 2) return (
    /* Three figures side by side */
    <g transform={`translate(${cx},${cy})`} fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round">
      <line x1={-s*0.72} y1={-s*0.5} x2={-s*0.72} y2={s*0.6} />
      <circle cx={-s*0.72} cy={-s*0.8} r={s*0.28} />
      <line x1={0}        y1={-s*0.5} x2={0}        y2={s*0.6} />
      <circle cx={0}       cy={-s*0.8} r={s*0.28} />
      <line x1={s*0.72}  y1={-s*0.5} x2={s*0.72}  y2={s*0.6} />
      <circle cx={s*0.72}  cy={-s*0.8} r={s*0.28} />
    </g>
  );

  if (n === 3) return (
    /* Mountain peak with crack */
    <g transform={`translate(${cx},${cy})`} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={`${-s},${s*0.7} 0,${-s} ${s},${s*0.7}`} />
      <polyline points={`0,${-s} ${s*0.2},${-s*0.1} ${-s*0.1},${s*0.35}`} opacity={0.55} />
    </g>
  );

  if (n === 4) return (
    /* River crossing / horizon lines */
    <g transform={`translate(${cx},${cy})`} stroke={c} strokeWidth="1.4" strokeLinecap="round">
      <path d={`M${-s},${s*0.1} C${-s*0.4},${-s*0.1} ${s*0.4},${s*0.3} ${s},${s*0.1}`} fill="none" />
      <path d={`M${-s*0.7},${s*0.55} C${-s*0.3},${s*0.35} ${s*0.3},${s*0.75} ${s*0.7},${s*0.55}`} fill="none" />
      <line x1={0} y1={-s} x2={0} y2={-s*0.25} />
      {/* Sun arc */}
      <path d={`M${-s*0.5},${-s*0.4} A${s*0.5},${s*0.5} 0 0 1 ${s*0.5},${-s*0.4}`} fill="none" opacity={0.65} />
    </g>
  );

  return null;
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function YouthTrailMap({ currentPhase = 0, onPhaseClick, className = "" }: YouthTrailMapProps) {
  return (
    <div
      className={`relative w-full select-none ${className}`}
      style={{ background: "#0d1d15" }}
      data-testid="youth-trail-map"
    >
      <svg
        viewBox="0 0 390 480"
        width="100%"
        style={{ display: "block", maxHeight: 520 }}
        aria-label="Youth Odyssey trail map — four phases from Your Kitchen to The Crossing"
        role="img"
      >
        <defs>
          <filter id="yt-trail-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="yt-marker-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="yt-fire-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="yt-atmos" cx="50%" cy="40%" r="68%">
            <stop offset="0%" stopColor="#1f3d2e" stopOpacity="0" />
            <stop offset="100%" stopColor="#08120e" stopOpacity="0.65" />
          </radialGradient>
          {/* Zone gradients — warm amber → cool water */}
          <linearGradient id="yt-z1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2010" />
            <stop offset="100%" stopColor="#2c1608" />
          </linearGradient>
          <linearGradient id="yt-z2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3d20" />
            <stop offset="100%" stopColor="#162e18" />
          </linearGradient>
          <linearGradient id="yt-z3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e2010" />
            <stop offset="100%" stopColor="#221808" />
          </linearGradient>
          <linearGradient id="yt-z4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2e42" />
            <stop offset="100%" stopColor="#162438" />
          </linearGradient>
          {/* Fire glow radial — behind campfire */}
          <radialGradient id="yt-fire-bg" cx="37%" cy="72%" r="18%">
            <stop offset="0%" stopColor="#d4a017" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#d4a017" stopOpacity="0" />
          </radialGradient>
          {/* Dawn glow — top of map */}
          <radialGradient id="yt-dawn" cx="45%" cy="5%" r="35%">
            <stop offset="0%" stopColor="#c97c2e" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c97c2e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Background ── */}
        <rect width="390" height="480" fill="#0d1d15" />

        {/* Stars */}
        {[
          [28,14],[75,8],[138,18],[205,7],[272,14],[332,6],[362,22],
          [12,36],[58,30],[108,42],[168,28],[235,35],[300,22],[350,38],
          [20,58],[82,52],[160,60],[240,46],[318,54],[370,50],
        ].map(([sx,sy],i) => (
          <circle key={i} cx={sx} cy={sy} r={0.75} fill="rgba(244,237,224,0.45)" />
        ))}

        {/* Dawn glow at top */}
        <rect width="390" height="480" fill="url(#yt-dawn)" />

        {/* ── Terrain zone 4 — The Crossing (water/sky, top) ── */}
        <path
          d="M 0 0 L 390 0 L 390 122
             C 355 112, 320 124, 285 116 C 250 108, 215 122, 180 114
             C 145 106, 110 118,  75 112 C  40 106,  20 116,   0 110 Z"
          fill="url(#yt-z4)"
        />

        {/* ── Terrain zone 3 — The Hard Thing (rock/slope, upper-mid) ── */}
        <path
          d="M 0 113
             C  20 120,  40 110,  75 116 C 110 122, 145 110, 180 118
             C 215 126, 250 112, 285 120 C 320 128, 355 114, 390 122
             L 390 248
             C 355 238, 320 250, 285 242 C 250 234, 215 248, 180 240
             C 145 232, 110 244,  75 238 C  40 232,  20 242,   0 236 Z"
          fill="url(#yt-z3)"
        />

        {/* ── Terrain zone 2 — Your People (deep forest, mid) ── */}
        <path
          d="M 0 238
             C  20 246,  40 236,  75 242 C 110 248, 145 236, 180 244
             C 215 252, 250 238, 285 246 C 320 254, 355 240, 390 248
             L 390 360
             C 355 350, 320 362, 285 354 C 250 346, 215 360, 180 352
             C 145 344, 110 356,  75 350 C  40 344,  20 354,   0 348 Z"
          fill="url(#yt-z2)"
        />

        {/* ── Terrain zone 1 — Your Kitchen (earth/hearth, bottom) ── */}
        <path
          d="M 0 350
             C  20 358,  40 348,  75 354 C 110 360, 145 348, 180 356
             C 215 364, 250 350, 285 358 C 320 366, 355 352, 390 360
             L 390 480 L 0 480 Z"
          fill="url(#yt-z1)"
        />

        {/* ── Atmosphere vignette ── */}
        <rect width="390" height="480" fill="url(#yt-atmos)" />

        {/* ── Fire glow (zone 2) ── */}
        <rect width="390" height="480" fill="url(#yt-fire-bg)" />

        {/* ── Pine silhouettes ── */}
        {/* Zone 1 - Kitchen / earth */}
        <Pine x={45}  y={462} h={52} opacity={0.52} />
        <Pine x={78}  y={472} h={38} opacity={0.44} />
        <Pine x={325} y={460} h={56} opacity={0.56} />
        <Pine x={358} y={470} h={40} opacity={0.46} />
        <Pine x={295} y={475} h={32} opacity={0.38} />

        {/* Zone 2 - People / cedar forest */}
        <Pine x={30}  y={352} h={48} opacity={0.62} />
        <Pine x={62}  y={360} h={36} opacity={0.56} />
        <Pine x={88}  y={355} h={28} opacity={0.46} />
        <Pine x={308} y={350} h={52} opacity={0.66} />
        <Pine x={342} y={358} h={38} opacity={0.56} />
        <Pine x={370} y={362} h={28} opacity={0.44} />

        {/* Zone 3 - Hard Thing / rocky */}
        <Pine x={22}  y={242} h={44} opacity={0.55} />
        <Pine x={50}  y={250} h={34} opacity={0.48} />
        <Pine x={316} y={238} h={48} opacity={0.60} />
        <Pine x={352} y={246} h={34} opacity={0.52} />

        {/* Zone 4 - Crossing / water edge */}
        <Pine x={35}  y={118} h={38} opacity={0.50} />
        <Pine x={62}  y={124} h={28} opacity={0.42} />
        <Pine x={320} y={114} h={42} opacity={0.55} />
        <Pine x={355} y={122} h={30} opacity={0.46} />

        {/* ── Campfire glow dot (zone 2, left side) ── */}
        <circle cx={144} cy={278} r={10} fill="#d4a017" opacity={0.08} filter="url(#yt-fire-glow)" />
        <circle cx={144} cy={278} r={3.5} fill="#d4a017" opacity={0.45} />

        {/* ── River / water at top (The Crossing zone) ── */}
        <path
          d="M 0 68 C 25 60, 50 72, 80 64 C 110 56, 140 68, 170 62 C 200 56, 230 66, 255 60"
          fill="none" stroke="rgba(122,179,204,0.38)" strokeWidth="3.5" strokeLinecap="round"
        />
        <path
          d="M 0 80 C 25 72, 50 84, 80 76 C 110 68, 140 80, 170 74 C 200 68, 230 78, 255 72"
          fill="none" stroke="rgba(122,179,204,0.20)" strokeWidth="2" strokeLinecap="round"
        />

        {/* ── Trail — shadow + cream ── */}
        <path
          d={TRAIL_PATH}
          fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="5"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d={TRAIL_PATH}
          fill="none" stroke="#f4ede0" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          filter="url(#yt-trail-glow)"
        />

        {/* ── Zone label bands ── */}
        {[
          { y:  44, label: "ZONE 4 · THE CROSSING",   col: "rgba(122,179,204,0.28)" },
          { y: 170, label: "ZONE 3 · THE HARD THING", col: "rgba(184,90,62,0.28)"   },
          { y: 272, label: "ZONE 2 · YOUR PEOPLE",    col: "rgba(212,160,23,0.26)"  },
          { y: 380, label: "ZONE 1 · YOUR KITCHEN",   col: "rgba(201,124,46,0.28)"  },
        ].map(({ y, label, col }) => (
          <text
            key={label} x="10" y={y}
            fontFamily="'JetBrains Mono', 'Courier New', monospace"
            fontSize="6.5" letterSpacing="0.18em" fill={col}
          >
            {label}
          </text>
        ))}

        {/* ── Phase markers ── */}
        {MARKERS.map((m) => {
          const phase    = PHASES[m.n - 1];
          const isActive = currentPhase === m.n;
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
              filter={isActive ? "url(#yt-marker-glow)" : undefined}
            >
              {isActive && (
                <circle cx={m.cx} cy={m.cy} r={r + 5}
                  fill="none" stroke={phase.accent} strokeWidth="1.5" opacity={0.55} />
              )}
              <circle cx={m.cx} cy={m.cy} r={r}
                fill={isActive ? "#1f3d2e" : "#0d1d15"}
                stroke={isActive ? phase.accent : "rgba(244,237,224,0.42)"}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <YouthIcon n={m.n} cx={m.cx} cy={m.cy} r={r} />
              {/* Phase number */}
              <text
                x={m.cx} y={m.cy + r + 9}
                textAnchor="middle"
                fontFamily="'JetBrains Mono', 'Courier New', monospace"
                fontSize="7" letterSpacing="0.12em"
                fill={isActive ? phase.accent : "rgba(244,237,224,0.45)"}
              >
                {String(m.n).padStart(2, "0")}
              </text>
              {/* Phase label */}
              <text
                x={m.labelX + (m.anchor === "start" ? 8 : -8)}
                y={m.cy - 3}
                textAnchor={m.anchor}
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="10" fontStyle="italic"
                fill={isActive ? "#f4ede0" : "rgba(244,237,224,0.60)"}
              >
                {phase.label}
              </text>
              <text
                x={m.labelX + (m.anchor === "start" ? 8 : -8)}
                y={m.cy + 9}
                textAnchor={m.anchor}
                fontFamily="'JetBrains Mono', 'Courier New', monospace"
                fontSize="6" letterSpacing="0.13em"
                fill={isActive ? "rgba(212,160,23,0.82)" : "rgba(244,237,224,0.28)"}
              >
                2 STATIONS
              </text>
            </g>
          );
        })}

        {/* ── Start Here cue — anchored near Phase 1 / Your Kitchen (bottom) ── */}
        <g transform="translate(260,440)">
          <text
            x={0} y={16}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', 'Courier New', monospace"
            fontSize="7.5" letterSpacing="0.16em"
            fill="rgba(201,124,46,0.82)"
          >
            START HERE ↓
          </text>
        </g>

        {/* ── Legend ── */}
        <g transform="translate(10,462)">
          <circle cx={5} cy={0} r={3.5} fill="none" stroke="rgba(244,237,224,0.38)" strokeWidth="1.2" />
          <text x={13} y={4} fontFamily="'JetBrains Mono', 'Courier New', monospace"
            fontSize="7" fill="rgba(244,237,224,0.25)" letterSpacing="0.12em">PHASE MARKER</text>
          <line x1={82} y1={0} x2={102} y2={0}
            stroke="rgba(244,237,224,0.32)" strokeWidth="1.5" strokeLinecap="round" />
          <text x={107} y={4} fontFamily="'JetBrains Mono', 'Courier New', monospace"
            fontSize="7" fill="rgba(244,237,224,0.25)" letterSpacing="0.12em">TRAIL</text>
        </g>
        <text x="385" y="473" textAnchor="end"
          fontFamily="Georgia, serif" fontSize="9" fontStyle="italic"
          fill="rgba(244,237,224,0.22)">
          Youth Odyssey · 4 Phases · 8 Stations
        </text>
      </svg>
    </div>
  );
}

import { useState } from "react";

const CREAM = "#f4ede0";

interface RingDef {
  number: number;
  name: string;
  color: string;
  outerR: number;
  innerR: number;
  plainLabel: string;
  plainDesc: string;
}

const RINGS: RingDef[] = [
  {
    number: 5,
    name: "The Wild",
    color: "#5B3E8C",
    outerR: 240,
    innerR: 200,
    plainLabel: "beyond the community",
    plainDesc:
      "The world outside — where resources come from and relationships reach the horizon.",
  },
  {
    number: 4,
    name: "Community Hall",
    color: "#0F766E",
    outerR: 200,
    innerR: 160,
    plainLabel: "public gathering space",
    plainDesc:
      "Where the community meets, decides together, and newcomers find the door.",
  },
  {
    number: 3,
    name: "The Standby",
    color: "#3D4A5C",
    outerR: 160,
    innerR: 120,
    plainLabel: "wider support circle",
    plainDesc:
      "People ready when called — not daily, but reliable when something is moving.",
  },
  {
    number: 2,
    name: "The Bench",
    color: "#1A5FA8",
    outerR: 120,
    innerR: 80,
    plainLabel: "working neighbourhood",
    plainDesc:
      "Where you show up regularly — local producers, traders, and organizers.",
  },
  {
    number: 1,
    name: "The Lodge",
    color: "#1f3d2e",
    outerR: 80,
    innerR: 40,
    plainLabel: "your inner circle",
    plainDesc:
      "The people you'd call in a storm — neighbours and close allies.",
  },
  {
    number: 0,
    name: "The Saltbox",
    color: "#7A4E2D",
    outerR: 40,
    innerR: 0,
    plainLabel: "kitchen table",
    plainDesc:
      "Where decisions are made before you need them. Home, family, inner trust.",
  },
];

const CX = 250;
const CY = 250;

/* Labels: plain label is primary (larger serif, full white),
   zone number + name is secondary (small monospace, muted). */
function RingLabel({ ring }: { ring: RingDef }) {
  const topOfRingAtNoon = CY - ring.outerR;
  const ringHeight = ring.outerR - ring.innerR;

  if (ring.innerR === 0) {
    /* Zone 0 — centre circle (r=40, tight space) */
    return (
      <>
        <text
          x={CX} y={CY - 7}
          textAnchor="middle"
          style={{ fontFamily: "Georgia, serif", fontSize: 9.5, fontWeight: 700, fill: "#fff" }}
          pointerEvents="none"
        >
          {ring.plainLabel}
        </text>
        <text
          x={CX} y={CY + 6}
          textAnchor="middle"
          style={{ fontFamily: "monospace", fontSize: 7, fill: "rgba(255,255,255,0.58)", letterSpacing: "0.1em" }}
          pointerEvents="none"
        >
          Z{ring.number} — {ring.name}
        </text>
      </>
    );
  }

  const labelY = topOfRingAtNoon + ringHeight * 0.22;

  return (
    <>
      <text
        x={CX} y={labelY}
        textAnchor="middle"
        style={{ fontFamily: "Georgia, serif", fontSize: 11, fontWeight: 700, fill: "#fff" }}
        pointerEvents="none"
      >
        {ring.plainLabel}
      </text>
      <text
        x={CX} y={labelY + 14}
        textAnchor="middle"
        style={{ fontFamily: "monospace", fontSize: 7.5, fill: "rgba(255,255,255,0.52)", letterSpacing: "0.12em" }}
        pointerEvents="none"
      >
        Z{ring.number} — {ring.name}
      </text>
    </>
  );
}

export default function WatershedMap() {
  /* hovered: set by mouse enter/leave */
  const [hovered, setHovered] = useState<number | null>(null);
  /* pinned: set by click/tap or keyboard; clears if same ring clicked again */
  const [pinned, setPinned] = useState<number | null>(null);

  /* The description panel shows pinned first, falls back to hovered */
  const displayed = pinned ?? hovered;
  const displayedRing = displayed !== null
    ? RINGS.find((r) => r.number === displayed) ?? null
    : null;

  function handleClick(n: number) {
    setPinned((prev) => (prev === n ? null : n));
  }

  function handleKey(n: number, e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(n);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "0 auto 4px" }}>
      <svg
        viewBox="0 0 500 500"
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Watershed zone map — concentric circles from kitchen table outward"
        role="img"
      >
        <rect width={500} height={500} fill={CREAM} />

        {RINGS.map((ring) => {
          const isCenter = ring.innerR === 0;
          const isActive = displayed === ring.number;

          return (
            <g
              key={ring.number}
              onClick={() => handleClick(ring.number)}
              onMouseEnter={() => setHovered(ring.number)}
              onMouseLeave={() => setHovered(null)}
              onKeyDown={(e) => handleKey(ring.number, e)}
              tabIndex={0}
              role="button"
              aria-pressed={pinned === ring.number}
              aria-label={`Zone ${ring.number}: ${ring.plainLabel} — ${ring.name}. ${ring.plainDesc}`}
              style={{ cursor: "pointer", outline: "none" }}
            >
              {isCenter ? (
                <circle
                  cx={CX} cy={CY} r={ring.outerR}
                  fill={ring.color}
                  opacity={isActive ? 1 : 0.88}
                  style={{ transition: "opacity 0.15s" }}
                />
              ) : (
                <>
                  <circle
                    cx={CX} cy={CY} r={ring.outerR}
                    fill={ring.color}
                    clipPath={`url(#clip-${ring.number})`}
                    opacity={isActive ? 1 : 0.88}
                    style={{ transition: "opacity 0.15s" }}
                  />
                  <defs>
                    <clipPath id={`clip-${ring.number}`}>
                      <path
                        d={`M 0 0 H 500 V 500 H 0 Z M ${CX} ${CY} m -${ring.innerR} 0 a ${ring.innerR} ${ring.innerR} 0 1 0 ${ring.innerR * 2} 0 a ${ring.innerR} ${ring.innerR} 0 1 0 -${ring.innerR * 2} 0`}
                        fillRule="evenodd"
                      />
                    </clipPath>
                  </defs>
                </>
              )}

              {/* Border ring — brighter when active */}
              <circle
                cx={CX} cy={CY} r={ring.outerR}
                fill="none"
                stroke={isActive ? "rgba(255,255,255,0.75)" : CREAM}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{ transition: "stroke 0.15s, stroke-width 0.15s" }}
              />

              {/* Focus ring for keyboard users */}
              {pinned === ring.number && (
                <circle
                  cx={CX} cy={CY} r={ring.outerR - 2}
                  fill="none"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth={3}
                  strokeDasharray="6 4"
                  style={{ pointerEvents: "none" }}
                />
              )}

              <RingLabel ring={ring} />
            </g>
          );
        })}

        <circle cx={CX} cy={CY} r={238} fill="none" stroke={CREAM} strokeWidth={2} />

        <g style={{ pointerEvents: "none" }}>
          <text
            x={CX} y={490}
            textAnchor="middle"
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              fill: "rgba(90,70,50,0.5)",
              letterSpacing: "0.14em",
            }}
          >
            HOVER · TAP · OR USE KEYBOARD TO EXPLORE ZONES
          </text>
        </g>
      </svg>

      {/* Description panel — shown on hover or tap/click */}
      <div
        style={{
          minHeight: 72,
          padding: "12px 16px",
          borderRadius: "0 0 8px 8px",
          background: displayedRing ? displayedRing.color : "rgba(90,70,50,0.06)",
          border: displayedRing
            ? `1px solid ${displayedRing.color}`
            : "1px solid rgba(90,70,50,0.12)",
          borderTop: "none",
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        {displayedRing ? (
          <>
            <p
              style={{
                margin: "0 0 3px",
                fontFamily: "Georgia, serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {displayedRing.plainLabel}
            </p>
            <p
              style={{
                margin: "0 0 6px",
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.58)",
              }}
            >
              Zone {displayedRing.number} — {displayedRing.name}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {displayedRing.plainDesc}
            </p>
            {pinned !== null && (
              <button
                type="button"
                onClick={() => setPinned(null)}
                style={{
                  marginTop: 8,
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 4,
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  padding: "3px 10px",
                }}
              >
                Close ✕
              </button>
            )}
          </>
        ) : (
          <p
            style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(90,70,50,0.35)",
            }}
          >
            Hover or tap any zone ring to learn more
          </p>
        )}
      </div>
    </div>
  );
}

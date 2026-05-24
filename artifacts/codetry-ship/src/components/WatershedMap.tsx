const CREAM = "#f4ede0";

interface RingDef {
  number: number;
  name: string;
  terrain: string;
  color: string;
  outerR: number;
  innerR: number;
}

const RINGS: RingDef[] = [
  { number: 5, name: "The Wild",        terrain: "The Ridge",    color: "#5B3E8C", outerR: 240, innerR: 200 },
  { number: 4, name: "Community Hall",  terrain: "The Square",   color: "#0F766E", outerR: 200, innerR: 160 },
  { number: 3, name: "The Standby",     terrain: "The Clearing", color: "#3D4A5C", outerR: 160, innerR: 120 },
  { number: 2, name: "The Bench",       terrain: "The Trail",    color: "#1A5FA8", outerR: 120, innerR: 80  },
  { number: 1, name: "The Lodge",       terrain: "The Spring",   color: "#1f3d2e", outerR: 80,  innerR: 40  },
  { number: 0, name: "The Saltbox",     terrain: "The Hearth",   color: "#7A4E2D", outerR: 40,  innerR: 0   },
];

const CX = 250;
const CY = 250;

function scrollToZone(n: number) {
  const el = document.getElementById(`zone-${n}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function RingLabel({ ring }: { ring: RingDef }) {
  const midR = ring.innerR === 0 ? 0 : (ring.outerR + ring.innerR) / 2;
  const topOfRingAtNoon = CY - ring.outerR;
  const ringHeight = ring.outerR - ring.innerR;

  if (ring.innerR === 0) {
    return (
      <>
        <text
          x={CX}
          y={CY - 10}
          textAnchor="middle"
          style={{ fontFamily: "monospace", fontSize: 8, fontWeight: 800, fill: "rgba(255,255,255,0.65)", letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          Z{ring.number}
        </text>
        <text
          x={CX}
          y={CY + 4}
          textAnchor="middle"
          style={{ fontFamily: "Georgia, serif", fontSize: 10, fontWeight: 700, fill: "#fff" }}
        >
          {ring.name}
        </text>
        <text
          x={CX}
          y={CY + 15}
          textAnchor="middle"
          style={{ fontFamily: "monospace", fontSize: 7.5, fill: "rgba(255,255,255,0.65)", letterSpacing: "0.1em" }}
        >
          {ring.terrain}
        </text>
      </>
    );
  }

  const labelY = topOfRingAtNoon + ringHeight * 0.18;

  return (
    <>
      <text
        x={CX}
        y={labelY}
        textAnchor="middle"
        style={{ fontFamily: "monospace", fontSize: 7.5, fontWeight: 800, fill: "rgba(255,255,255,0.6)", letterSpacing: "0.18em" }}
      >
        Z{ring.number}
      </text>
      <text
        x={CX}
        y={labelY + 12}
        textAnchor="middle"
        style={{ fontFamily: "Georgia, serif", fontSize: 10.5, fontWeight: 700, fill: "#fff" }}
      >
        {ring.name}
      </text>
      <text
        x={CX}
        y={labelY + 23}
        textAnchor="middle"
        style={{ fontFamily: "monospace", fontSize: 7.5, fill: "rgba(255,255,255,0.62)", letterSpacing: "0.08em" }}
      >
        {ring.terrain}
      </text>
    </>
  );
}

export default function WatershedMap() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto 4px",
      }}
    >
      <svg
        viewBox="0 0 500 500"
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Watershed zone map — concentric circles radiating from the hearth"
        role="img"
      >
        <rect width={500} height={500} fill={CREAM} />

        {RINGS.map((ring) => {
          const isCenter = ring.innerR === 0;
          return (
            <g
              key={ring.number}
              onClick={() => scrollToZone(ring.number)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`Zone ${ring.number}: ${ring.name}`}
            >
              {isCenter ? (
                <circle cx={CX} cy={CY} r={ring.outerR} fill={ring.color} />
              ) : (
                <>
                  <circle
                    cx={CX}
                    cy={CY}
                    r={ring.outerR}
                    fill={ring.color}
                    clipPath={`url(#clip-${ring.number})`}
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

              <circle
                cx={CX}
                cy={CY}
                r={ring.outerR}
                fill="none"
                stroke={CREAM}
                strokeWidth={1.5}
              />

              <RingLabel ring={ring} />
            </g>
          );
        })}

        <circle
          cx={CX}
          cy={CY}
          r={238}
          fill="none"
          stroke={CREAM}
          strokeWidth={2}
        />

        <g style={{ pointerEvents: "none" }}>
          <text
            x={CX}
            y={490}
            textAnchor="middle"
            style={{ fontFamily: "monospace", fontSize: 8, fill: "rgba(90,70,50,0.5)", letterSpacing: "0.14em" }}
          >
            CLICK ANY RING TO JUMP TO THAT ZONE ↓
          </text>
        </g>
      </svg>
    </div>
  );
}

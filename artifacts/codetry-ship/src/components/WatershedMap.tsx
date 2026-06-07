import { useState, useEffect } from "react";

const CREAM = "#f4ede0";

interface RingDef {
  number: number;
  name: string;
  color: string;
  outerR: number;
  innerR: number;
  plainLabel: string;
  plainDesc: string;
  practiceNote: string;
  icon: string;
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
    practiceNote:
      "A regional wholesaler you order from once a season, or a policy network you send reports to.",
    icon: "🌊",
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
    practiceNote:
      "The open market night every third Thursday, or the town meeting where the co-op budget is ratified.",
    icon: "🏛️",
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
    practiceNote:
      "The electrician who clears their schedule when the lodge calls, or the credit union that moves quickly in a crunch.",
    icon: "🤝",
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
    practiceNote:
      "Your regular market vendor, the mechanic you call first, the accountant who knows your season.",
    icon: "👥",
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
    practiceNote:
      "The neighbour with the generator, or the co-founder who takes the hard call at 11 pm.",
    icon: "🔥",
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
    practiceNote:
      "The household kit checked before freeze-up, or the family meeting that sets the roles before the season starts.",
    icon: "🏠",
  },
];

const CX = 250;
const CY = 250;

/* Zone index for animation delay — zone 0 animates first, zone 5 last */
function animDelay(zoneNumber: number) {
  return zoneNumber * 90;
}

/* Labels: plain label is primary (larger serif, full white),
   zone number + name is secondary (small monospace, muted).
   Inline icon is aria-hidden, added before the plain label. */
function RingLabel({ ring }: { ring: RingDef }) {
  const topOfRingAtNoon = CY - ring.outerR;
  const ringHeight = ring.outerR - ring.innerR;

  if (ring.innerR === 0) {
    /* Zone 0 — centre circle (r=40, tight space) */
    return (
      <>
        <text
          x={CX} y={CY - 8}
          textAnchor="middle"
          aria-hidden="true"
          style={{ fontSize: 10, fill: "#fff" }}
          pointerEvents="none"
        >
          {ring.icon}
        </text>
        <text
          x={CX} y={CY + 5}
          textAnchor="middle"
          style={{ fontFamily: "Georgia, serif", fontSize: 8, fontWeight: 700, fill: "#fff" }}
          pointerEvents="none"
        >
          {ring.plainLabel}
        </text>
        <text
          x={CX} y={CY + 15}
          textAnchor="middle"
          style={{ fontFamily: "monospace", fontSize: 6, fill: "rgba(255,255,255,0.52)", letterSpacing: "0.08em" }}
          pointerEvents="none"
        >
          Z{ring.number} — {ring.name}
        </text>
      </>
    );
  }

  /* Narrow inner rings (Z1, Z2): tighter sizes for legibility at phone width */
  const isNarrow = ringHeight <= 40;
  const primarySize = isNarrow ? 9.5 : 11;
  const secondarySize = isNarrow ? 6 : 7.5;
  const iconSize = isNarrow ? 8 : 10;
  const iconY = topOfRingAtNoon + ringHeight * 0.18;
  const labelY = topOfRingAtNoon + ringHeight * (isNarrow ? 0.44 : 0.36);
  const secondaryY = labelY + (isNarrow ? 10 : 13);

  return (
    <>
      <text
        x={CX} y={iconY}
        textAnchor="middle"
        aria-hidden="true"
        style={{ fontSize: iconSize, fill: "#fff" }}
        pointerEvents="none"
      >
        {ring.icon}
      </text>
      <text
        x={CX} y={labelY}
        textAnchor="middle"
        style={{ fontFamily: "Georgia, serif", fontSize: primarySize, fontWeight: 700, fill: "#fff" }}
        pointerEvents="none"
      >
        {ring.plainLabel}
      </text>
      <text
        x={CX} y={secondaryY}
        textAnchor="middle"
        style={{ fontFamily: "monospace", fontSize: secondarySize, fill: "rgba(255,255,255,0.50)", letterSpacing: "0.10em" }}
        pointerEvents="none"
      >
        Z{ring.number} — {ring.name}
      </text>
    </>
  );
}

/* Determine the initial pinned zone from URL (?zone=N) or localStorage */
function resolveInitialZone(): number | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const qz = params.get("zone");
    if (qz !== null) {
      const n = parseInt(qz, 10);
      if (!isNaN(n) && n >= 0 && n <= 5) return n;
    }
    const ls = localStorage.getItem("compassResult");
    if (ls !== null) {
      const n = parseInt(ls, 10);
      if (!isNaN(n) && n >= 0 && n <= 5) return n;
    }
  } catch {
    /* SSR / private-mode guard */
  }
  return null;
}

function hasCompassResult(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("zone") !== null) return true;
    return localStorage.getItem("compassResult") !== null;
  } catch {
    return false;
  }
}

export default function WatershedMap() {
  const [mounted, setMounted] = useState(false);
  /* hovered: set by mouse enter/leave */
  const [hovered, setHovered] = useState<number | null>(null);
  /* pinned: set by click/tap or keyboard; clears if same ring clicked again */
  const [pinned, setPinned] = useState<number | null>(null);
  /* compass: whether the initial pin came from Compass/URL */
  const [isCompassPin, setIsCompassPin] = useState(false);
  /* share popover */
  const [shareOpen, setShareOpen] = useState(false);
  const [shareNote, setShareNote] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = resolveInitialZone();
    if (initial !== null) {
      setPinned(initial);
      setIsCompassPin(hasCompassResult());
    }
  }, []);

  /* The description panel shows pinned first, falls back to hovered */
  const displayed = pinned ?? hovered;
  const displayedRing = displayed !== null
    ? RINGS.find((r) => r.number === displayed) ?? null
    : null;

  function handleClick(n: number) {
    setPinned((prev) => {
      if (prev === n) return null;
      setIsCompassPin(false);
      return n;
    });
  }

  function handleKey(n: number, e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(n);
    }
  }

  function handleShareOpen() {
    setShareOpen(true);
    setShareNote("");
    setShareCopied(false);
  }

  function handleShareCopy() {
    const base = `${window.location.origin}${window.location.pathname}?zone=${pinned}`;
    const url = shareNote.trim()
      ? `${base}&note=${encodeURIComponent(shareNote.trim())}`
      : base;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => {
        setShareCopied(false);
        setShareOpen(false);
        setShareNote("");
      }, 1800);
    }).catch(() => {
      /* fallback */
    });
  }

  function handleShareCancel() {
    setShareOpen(false);
    setShareNote("");
    setShareCopied(false);
  }

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "0 auto 4px" }}>
      <style>{`
        @keyframes wsRingIn {
          from { opacity: 0; transform: scale(0.72); transform-origin: 250px 250px; }
          to   { opacity: 1; transform: scale(1);    transform-origin: 250px 250px; }
        }
        @keyframes wsCompassPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        @keyframes wsGlowPulse {
          0%,100% { r: 0; opacity: 0; }
          50%      { opacity: 0.18; }
        }
      `}</style>

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
          const isPinned = pinned === ring.number;
          const isCompassZone = isPinned && isCompassPin;

          /* Animation: each ring scales in from centre, staggered by zone number */
          const ringStyle: React.CSSProperties = mounted
            ? {
                animation: `wsRingIn 400ms ease-out both`,
                animationDelay: `${animDelay(ring.number)}ms`,
                cursor: "pointer",
                outline: "none",
                transformOrigin: `${CX}px ${CY}px`,
                transform: isActive ? "scale(1.015)" : "scale(1)",
                transition: "transform 150ms ease",
              }
            : { cursor: "pointer", outline: "none" };

          return (
            <g
              key={ring.number}
              onClick={() => handleClick(ring.number)}
              onMouseEnter={() => setHovered(ring.number)}
              onMouseLeave={() => setHovered(null)}
              onKeyDown={(e) => handleKey(ring.number, e)}
              tabIndex={0}
              role="button"
              aria-pressed={isPinned}
              aria-label={`Zone ${ring.number}: ${ring.plainLabel} — ${ring.name}. ${ring.plainDesc}`}
              style={ringStyle}
            >
              {/* Soft glow behind active ring */}
              {isActive && !isCenter && (
                <circle
                  cx={CX} cy={CY} r={ring.outerR + 8}
                  fill={ring.color}
                  opacity={0.14}
                  style={{ pointerEvents: "none" }}
                />
              )}
              {isActive && isCenter && (
                <circle
                  cx={CX} cy={CY} r={ring.outerR + 8}
                  fill={ring.color}
                  opacity={0.14}
                  style={{ pointerEvents: "none" }}
                />
              )}

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

              {/* Compass result — pulsing dashed ring */}
              {isCompassZone && (
                <circle
                  cx={CX} cy={CY} r={ring.outerR - 2}
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  style={{
                    pointerEvents: "none",
                    animation: "wsCompassPulse 1.8s ease-in-out infinite",
                  }}
                />
              )}

              {/* Standard pinned focus ring */}
              {isPinned && !isCompassZone && (
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
            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Georgia, serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                  flex: 1,
                }}
              >
                {displayedRing.icon} {displayedRing.plainLabel}
              </p>
              {pinned === displayedRing.number && isCompassPin && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.22)",
                    fontFamily: "monospace",
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#fff",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  You are here
                </span>
              )}
            </div>

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
                margin: "0 0 5px",
                fontSize: 12,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {displayedRing.plainDesc}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.6)",
                fontStyle: "italic",
              }}
            >
              {displayedRing.practiceNote}
            </p>

            {/* Action row */}
            {pinned !== null && (
              <div style={{ marginTop: 10 }}>
                {!shareOpen ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={handleShareOpen}
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        borderRadius: 4,
                        color: "rgba(255,255,255,0.9)",
                        fontFamily: "monospace",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        padding: "3px 10px",
                        transition: "background 0.15s",
                      }}
                    >
                      Share this zone
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPinned(null); setIsCompassPin(false); }}
                      style={{
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        borderRadius: 4,
                        color: "rgba(255,255,255,0.65)",
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
                  </div>
                ) : (
                  <div
                    style={{
                      background: "rgba(0,0,0,0.18)",
                      border: "1px solid rgba(255,255,255,0.20)",
                      borderRadius: 7,
                      padding: "10px 12px",
                    }}
                  >
                    <label
                      htmlFor="ws-share-note"
                      style={{
                        display: "block",
                        fontFamily: "monospace",
                        fontSize: 8,
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.55)",
                        marginBottom: 6,
                      }}
                    >
                      Add a personal note (optional)
                    </label>
                    <textarea
                      id="ws-share-note"
                      value={shareNote}
                      onChange={(e) => setShareNote(e.target.value.slice(0, 120))}
                      placeholder="I thought of you when I saw this zone…"
                      rows={2}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        resize: "none",
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.22)",
                        borderRadius: 4,
                        color: "rgba(255,255,255,0.9)",
                        fontFamily: "Georgia, serif",
                        fontSize: 12,
                        lineHeight: 1.45,
                        padding: "6px 8px",
                        outline: "none",
                        marginBottom: 4,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 8,
                          color: shareNote.length >= 110
                            ? "rgba(255,200,100,0.85)"
                            : "rgba(255,255,255,0.38)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {shareNote.length} / 120
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={handleShareCopy}
                        style={{
                          background: shareCopied ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.18)",
                          border: "1px solid rgba(255,255,255,0.28)",
                          borderRadius: 4,
                          color: "rgba(255,255,255,0.92)",
                          fontFamily: "monospace",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          padding: "4px 12px",
                          transition: "background 0.15s",
                          flex: 1,
                        }}
                      >
                        {shareCopied ? "Link copied ✓" : "Copy link"}
                      </button>
                      <button
                        type="button"
                        onClick={handleShareCancel}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.16)",
                          borderRadius: 4,
                          color: "rgba(255,255,255,0.55)",
                          fontFamily: "monospace",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          padding: "4px 10px",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

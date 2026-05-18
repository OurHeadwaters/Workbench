/**
 * TrailSignPost — physical wooden trailhead sign stack.
 *
 * One big header board at top, then individual pointer signs below —
 * one per path label and one per phase — like a real carved trailhead.
 */

/* ── Path data ──────────────────────────────────────────────────────────── */

const ODYSSEY_PHASES = [
  { label: "Phase 01", name: "Read Your Community" },
  { label: "Phase 02", name: "Name Your Model" },
  { label: "Phase 03", name: "Make Your First Agreement" },
  { label: "Phase 04", name: "Build the Floor" },
  { label: "Phase 05", name: "Hold the Line" },
];

const YOUTH_PHASES = [
  { label: "Phase 01", name: "Your Kitchen" },
  { label: "Phase 02", name: "Your People" },
  { label: "Phase 03", name: "The Hard Thing" },
  { label: "Phase 04", name: "The Crossing" },
];

/* ── Colours ────────────────────────────────────────────────────────────── */
const POST         = "#3d2314";
const HEADER_BG    = "#2a1508";   /* darkest — top panel                  */
const ODYSSEY_BG   = "#5c3317";   /* primary Odyssey sign                 */
const ODYSSEY_SM   = "#4d2b12";   /* small Odyssey phase signs            */
const YOUTH_BG     = "#7a4b28";   /* primary Youth sign                   */
const YOUTH_SM     = "#6a3e20";   /* small Youth phase signs              */
const CREAM        = "#f4ede0";
const DIM          = "rgba(244,237,224,0.48)";
const GOLD         = "rgba(212,160,23,0.82)";

/* ── Sub-components ─────────────────────────────────────────────────────── */

/** Vertical post segment */
function Post({ h }: { h: number }) {
  return <div style={{ width: 18, height: h, background: POST, flexShrink: 0 }} />;
}

/** The big header board — no arrow, rectangular, sits above the fork */
function HeaderBoard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <div
        style={{
          background: HEADER_BG,
          padding: "13px 26px 13px 22px",
          color: CREAM,
          fontFamily: "var(--font-serif, Georgia, serif)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.25), 2px 0 6px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </div>
      {/* post column on right — aligns with left-pointing signs below */}
      <div style={{ width: 18, background: POST, flexShrink: 0 }} />
    </div>
  );
}

/** A left-pointing sign (Odyssey direction) */
function LeftSign({
  bg,
  arrowH,
  arrowW,
  href,
  children,
  minW,
}: {
  bg: string;
  arrowH: number;
  arrowW: number;
  href: string;
  children: React.ReactNode;
  minW?: number;
}) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "stretch",
        textDecoration: "none",
        opacity: 1,
      }}
      className="transition-opacity hover:opacity-80"
    >
      {/* Arrow tip */}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: `${arrowH}px solid transparent`,
          borderBottom: `${arrowH}px solid transparent`,
          borderRight: `${arrowW}px solid ${bg}`,
          flexShrink: 0,
          alignSelf: "center",
        }}
      />
      {/* Sign body */}
      <div
        style={{
          background: bg,
          padding: `${arrowH * 0.45}px 18px ${arrowH * 0.45}px 14px`,
          minWidth: minW,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}
      >
        {children}
      </div>
      {/* Post column */}
      <div style={{ width: 18, background: POST, flexShrink: 0 }} />
    </a>
  );
}

/** A right-pointing sign (Youth direction) */
function RightSign({
  bg,
  arrowH,
  arrowW,
  href,
  children,
  minW,
}: {
  bg: string;
  arrowH: number;
  arrowW: number;
  href: string;
  children: React.ReactNode;
  minW?: number;
}) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "stretch",
        textDecoration: "none",
      }}
      className="transition-opacity hover:opacity-80"
    >
      {/* Post column */}
      <div style={{ width: 18, background: POST, flexShrink: 0 }} />
      {/* Sign body */}
      <div
        style={{
          background: bg,
          padding: `${arrowH * 0.45}px 14px ${arrowH * 0.45}px 18px`,
          minWidth: minW,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}
      >
        {children}
      </div>
      {/* Arrow tip */}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: `${arrowH}px solid transparent`,
          borderBottom: `${arrowH}px solid transparent`,
          borderLeft: `${arrowW}px solid ${bg}`,
          flexShrink: 0,
          alignSelf: "center",
        }}
      />
    </a>
  );
}

/* ── Main export ────────────────────────────────────────────────────────── */

interface TrailSignPostProps {
  mode?: "fork" | "odyssey" | "youth";
  compact?: boolean;
}

export function TrailSignPost({ mode = "fork", compact = false }: TrailSignPostProps) {
  const showOdyssey = mode === "fork" || mode === "odyssey";
  const showYouth   = mode === "fork" || mode === "youth";
  const showHeader  = mode === "fork";

  return (
    <div
      className="flex flex-col items-start select-none"
      aria-label="Trail fork — The Odyssey and The Youth Odyssey"
      data-testid="trail-sign-post"
    >
      {/* Post cap */}
      <div
        style={{
          width: 18,
          height: 10,
          background: POST,
          borderRadius: "3px 3px 0 0",
          marginLeft: 0,
        }}
      />

      {/* Short post before header */}
      <Post h={10} />

      {/* ── Big header board ── */}
      {showHeader && (
        <>
          <HeaderBoard>Headwaters Trails</HeaderBoard>
          <Post h={10} />
        </>
      )}

      {/* ══════════════════════ ODYSSEY PATH ══ */}
      {showOdyssey && (
        <>
          {/* Primary Odyssey sign */}
          <LeftSign bg={ODYSSEY_BG} arrowH={28} arrowW={16} href="/odyssey" minW={210}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: DIM,
                marginBottom: 3,
              }}
            >
              For practitioners
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                color: CREAM,
              }}
            >
              The Odyssey
            </span>
          </LeftSign>

          {/* Small phase pointer signs — gap post between each */}
          {!compact && ODYSSEY_PHASES.map((p, i) => (
            <div key={p.name} style={{ display: "contents" }}>
              <Post h={4} />
              <LeftSign
                bg={i % 2 === 0 ? ODYSSEY_SM : "#432610"}
                arrowH={17}
                arrowW={11}
                href="/odyssey"
                minW={210}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: GOLD,
                      flexShrink: 0,
                    }}
                  >
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: CREAM,
                      opacity: 0.88,
                    }}
                  >
                    {p.name}
                  </span>
                </div>
              </LeftSign>
            </div>
          ))}

          <Post h={compact ? 10 : 14} />
        </>
      )}

      {/* ══════════════════════ YOUTH PATH ══ */}
      {showYouth && (
        <>
          {/* Primary Youth sign */}
          <RightSign bg={YOUTH_BG} arrowH={28} arrowW={16} href="/story" minW={220}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: DIM,
                marginBottom: 3,
              }}
            >
              For curious young people
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                color: CREAM,
              }}
            >
              The Youth Odyssey
            </span>
          </RightSign>

          {/* Small phase pointer signs — gap post between each */}
          {!compact && YOUTH_PHASES.map((p, i) => (
            <div key={p.name} style={{ display: "contents" }}>
              <Post h={4} />
              <RightSign
                bg={i % 2 === 0 ? YOUTH_SM : "#5a3418"}
                arrowH={17}
                arrowW={11}
                href="/story"
                minW={220}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: GOLD,
                      flexShrink: 0,
                    }}
                  >
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: CREAM,
                      opacity: 0.88,
                    }}
                  >
                    {p.name}
                  </span>
                </div>
              </RightSign>
            </div>
          ))}
        </>
      )}

      {/* Post base */}
      <Post h={28} />
      <div
        style={{
          width: 28,
          height: 8,
          background: POST,
          borderRadius: "0 0 4px 4px",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

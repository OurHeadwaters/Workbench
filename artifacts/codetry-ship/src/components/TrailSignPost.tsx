/**
 * TrailSignPost — physical wooden direction signs on a post.
 *
 * Shows the fork between The Odyssey (practitioner path) and
 * The Youth Odyssey (story-writing journey for youth), with phase
 * names on each sign so curious visitors know what awaits.
 */

interface TrailSignPostProps {
  /** "fork" shows both paths. "odyssey" or "youth" shows only one. */
  mode?: "fork" | "odyssey" | "youth";
  /** Compact hides phase lists to save vertical space */
  compact?: boolean;
}

const ODYSSEY_PHASES = [
  "Read Your Community",
  "Name Your Model",
  "Make Your First Agreement",
  "Build the Floor",
  "Hold the Line",
];

const YOUTH_PHASES = [
  "Your Kitchen",
  "Your People",
  "The Hard Thing",
  "The Crossing",
];

/* ── Shared styles ──────────────────────────────────────────────────────── */
const POST_COLOR   = "#3d2314";
const SIGN_DARK    = "#5c3317";   /* Odyssey — darker, elder-worn */
const SIGN_WARM    = "#7a4b28";   /* Youth  — warmer, more golden */
const SIGN_TEXT    = "#f4ede0";
const LABEL_COLOR  = "rgba(244,237,224,0.52)";

const signBase: React.CSSProperties = {
  position: "relative",
  display: "inline-flex",
  flexDirection: "column",
  padding: "10px 22px 10px 18px",
  color: SIGN_TEXT,
  fontFamily: "inherit",
  zIndex: 1,
};

export function TrailSignPost({ mode = "fork", compact = false }: TrailSignPostProps) {
  const showOdyssey = mode === "fork" || mode === "odyssey";
  const showYouth   = mode === "fork" || mode === "youth";

  return (
    <div
      className="flex flex-col items-center select-none"
      style={{ gap: 0 }}
      aria-label="Trail fork — The Odyssey and The Youth Odyssey"
      data-testid="trail-sign-post"
    >
      {/* Post cap */}
      <div style={{ width: 18, height: 10, background: POST_COLOR, borderRadius: "3px 3px 0 0" }} />

      {/* ── Odyssey sign (left-pointing) ── */}
      {showOdyssey && (
        <>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            {/* Arrow point on left */}
            <div style={{
              width: 0, height: 0,
              borderTop: "32px solid transparent",
              borderBottom: "32px solid transparent",
              borderRight: `18px solid ${SIGN_DARK}`,
              flexShrink: 0,
              alignSelf: "center",
            }} />
            <a
              href="/odyssey"
              style={{
                ...signBase,
                background: SIGN_DARK,
                textDecoration: "none",
                minWidth: compact ? 160 : 220,
                cursor: "pointer",
              }}
              className="transition-opacity hover:opacity-85"
            >
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "8.5px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: LABEL_COLOR,
                  marginBottom: 3,
                }}
              >
                For practitioners
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: 17,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.15,
                  color: SIGN_TEXT,
                }}
              >
                The Odyssey
              </span>
              {!compact && (
                <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none" }}>
                  {ODYSSEY_PHASES.map((p) => (
                    <li
                      key={p}
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "7px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: LABEL_COLOR,
                        lineHeight: 1.7,
                      }}
                    >
                      · {p}
                    </li>
                  ))}
                </ul>
              )}
            </a>
            {/* Post between signs */}
            <div style={{ width: 18, background: POST_COLOR, flexShrink: 0 }} />
          </div>
          {/* Short post between signs */}
          <div style={{ width: 18, height: 12, background: POST_COLOR }} />
        </>
      )}

      {/* ── Youth Odyssey sign (right-pointing) ── */}
      {showYouth && (
        <>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            {/* Post on left */}
            <div style={{ width: 18, background: POST_COLOR, flexShrink: 0 }} />
            <a
              href="/story"
              style={{
                ...signBase,
                background: SIGN_WARM,
                textDecoration: "none",
                minWidth: compact ? 170 : 230,
                cursor: "pointer",
              }}
              className="transition-opacity hover:opacity-85"
            >
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "8.5px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: LABEL_COLOR,
                  marginBottom: 3,
                }}
              >
                For curious young people
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: 17,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.15,
                  color: SIGN_TEXT,
                }}
              >
                The Youth Odyssey
              </span>
              {!compact && (
                <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none" }}>
                  {YOUTH_PHASES.map((p) => (
                    <li
                      key={p}
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "7px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: LABEL_COLOR,
                        lineHeight: 1.7,
                      }}
                    >
                      · {p}
                    </li>
                  ))}
                </ul>
              )}
            </a>
            {/* Arrow point on right */}
            <div style={{
              width: 0, height: 0,
              borderTop: "32px solid transparent",
              borderBottom: "32px solid transparent",
              borderLeft: `18px solid ${SIGN_WARM}`,
              flexShrink: 0,
              alignSelf: "center",
            }} />
          </div>
        </>
      )}

      {/* Post base */}
      <div style={{ width: 18, height: 28, background: POST_COLOR }} />
      <div style={{ width: 28, height: 8, background: POST_COLOR, borderRadius: "0 0 4px 4px", opacity: 0.7 }} />
    </div>
  );
}

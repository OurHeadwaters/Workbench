import { Link } from "wouter";

function PrintNav() {
  return (
    <div className="no-print screen-nav">
      <Link href="/">← Back to suite</Link>
      <button className="btn-print" onClick={() => window.print()}>
        🖨 Print this page
      </button>
    </div>
  );
}

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#2b2116";

// ── The canonical Headwaters mark ─────────────────────────────────────────────
// A wordmark with a vertical evergreen rule on the left and a rust rule accent.

function HwMark({
  size = "full",
  bg = "light",
}: {
  size?: "full" | "compact" | "icon";
  bg?: "light" | "dark" | "rust";
}) {
  const bgColor =
    bg === "dark" ? EVERGREEN : bg === "rust" ? RUST : "white";
  const textColor =
    bg === "light" ? EVERGREEN : CREAM;
  const subColor =
    bg === "light" ? MUTED : "rgba(244,237,224,0.6)";
  const ruleColor =
    bg === "light" ? RUST : bg === "rust" ? "rgba(255,255,255,0.5)" : RUST;
  const borderColor =
    bg === "light" ? "rgba(31,61,46,0.12)" : "transparent";

  if (size === "icon") {
    return (
      <div
        style={{
          width: 64,
          height: 64,
          background: bgColor,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${borderColor}`,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            fontWeight: 900,
            color: textColor,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          H
        </span>
      </div>
    );
  }

  if (size === "compact") {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.55rem",
          background: bgColor,
          padding: "0.6rem 0.9rem",
          borderRadius: 6,
          border: `1px solid ${borderColor}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 3,
            height: "1.4rem",
            background: ruleColor,
            borderRadius: 2,
            flexShrink: 0,
          }}
        />
        <div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: textColor,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Headwaters
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.42rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: subColor,
              lineHeight: 1,
              marginTop: "0.12rem",
            }}
          >
            Development Services
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        background: bgColor,
        padding: "1rem 1.4rem",
        borderRadius: 8,
        border: `1px solid ${borderColor}`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 4,
          height: "2.2rem",
          background: ruleColor,
          borderRadius: 2,
          flexShrink: 0,
        }}
      />
      <div>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.55rem",
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
          }}
        >
          Headwaters
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: subColor,
            lineHeight: 1,
            marginTop: "0.25rem",
          }}
        >
          Development Services
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: MUTED,
          marginBottom: "0.75rem",
          borderBottom: "1px solid rgba(31,61,46,0.1)",
          paddingBottom: "0.4rem",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function Swatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div
        style={{
          width: 40,
          height: 40,
          background: hex,
          borderRadius: 6,
          border: "1px solid rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}
      />
      <div>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: INK,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.7rem",
            color: MUTED,
          }}
        >
          {hex}
        </p>
      </div>
    </div>
  );
}

export default function LogoFormats() {
  return (
    <>
      <PrintNav />
      <div
        style={{
          minHeight: "100vh",
          background: "#ece6db",
          padding: "2.5rem 1.5rem 4rem",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "0.3rem",
            }}
          >
            Headwaters · Brand marks
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2rem",
              fontWeight: 700,
              color: EVERGREEN,
              marginBottom: "0.2rem",
            }}
          >
            Logo formats
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              color: MUTED,
              marginBottom: "2.5rem",
              lineHeight: 1.6,
            }}
          >
            All marks use the same type, rule, and colour palette.
            Use the full wordmark wherever space allows; compact for
            tight contexts; icon for avatars and favicons.
          </p>

          {/* Full wordmark */}
          <Section title="Full wordmark — on light, dark, and rust">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.25rem",
                alignItems: "flex-start",
              }}
            >
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.4rem" }}>Light background</p>
                <HwMark size="full" bg="light" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.4rem" }}>Dark / Evergreen</p>
                <HwMark size="full" bg="dark" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.4rem" }}>Rust accent</p>
                <HwMark size="full" bg="rust" />
              </div>
            </div>
          </Section>

          {/* Compact */}
          <Section title="Compact wordmark — header bars, footers, small print">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.4rem" }}>Light</p>
                <HwMark size="compact" bg="light" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.4rem" }}>Dark</p>
                <HwMark size="compact" bg="dark" />
              </div>
            </div>
          </Section>

          {/* Icon mark */}
          <Section title="Icon mark — avatars, favicons, Square profile, app badges">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center" }}>
              {(["light", "dark", "rust"] as const).map((bg) => (
                <div key={bg}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.4rem", textTransform: "capitalize" }}>{bg}</p>
                  <HwMark size="icon" bg={bg} />
                </div>
              ))}
              {/* Sizes */}
              {[48, 32, 24].map((px) => (
                <div key={px} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                  <div
                    style={{
                      width: px,
                      height: px,
                      background: EVERGREEN,
                      borderRadius: Math.round(px * 0.15),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: px * 0.6,
                        fontWeight: 900,
                        color: CREAM,
                        lineHeight: 1,
                      }}
                    >
                      H
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: MUTED }}>{px}px</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Brand palette */}
          <Section title="Brand palette">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
              {[
                { hex: EVERGREEN, name: "Evergreen" },
                { hex: "#2e5c44", name: "Evergreen mid" },
                { hex: "#4a7c61", name: "Evergreen light" },
                { hex: RUST, name: "Rust" },
                { hex: "#d4866a", name: "Rust light" },
                { hex: CREAM, name: "Cream" },
                { hex: "#2b2116", name: "Ink" },
                { hex: MUTED, name: "Muted" },
              ].map((s) => (
                <Swatch key={s.hex} {...s} />
              ))}
            </div>
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.2rem" }}>Serif — Fraunces (headings, wordmark, pull quotes)</p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 700, color: EVERGREEN, lineHeight: 1 }}>
                  Aa Bb Cc — Headwaters
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.2rem" }}>Sans-serif — Inter (body, labels, UI)</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", color: INK, lineHeight: 1.4 }}>
                  Aa Bb Cc — Development Services · Dryden, Ontario
                </p>
              </div>
            </div>
          </Section>

          {/* Usage notes */}
          <div
            style={{
              background: "white",
              borderRadius: 8,
              border: "1px solid rgba(31,61,46,0.12)",
              padding: "1.1rem 1.3rem",
              fontSize: "0.82rem",
              color: MUTED,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: EVERGREEN, display: "block", marginBottom: "0.4rem" }}>
              Usage notes
            </strong>
            <ul style={{ paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <li>Always keep clear space around the mark equal to the cap-height of the wordmark.</li>
              <li>Do not stretch, outline, or recolour outside the palette above.</li>
              <li>For Square: use the dark icon mark (64 × 64 px, evergreen background) as your profile photo. Business name: <strong style={{ color: INK }}>Headwaters Development Services</strong>.</li>
              <li>For email signatures: use the compact wordmark on light.</li>
              <li>For print: embed the full wordmark at 300 dpi minimum.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

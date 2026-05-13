import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#2b2116";

// ── Eagle & ring mark ─────────────────────────────────────────────────────────

function EagleMark({
  bg = "light",
  size = 120,
}: {
  bg?: "light" | "dark" | "rust";
  size?: number;
}) {
  const bgColor = bg === "dark" ? EVERGREEN : bg === "rust" ? RUST : "white";
  const borderColor =
    bg === "light" ? "rgba(31,61,46,0.12)" : "transparent";

  return (
    <div
      style={{
        width: size + 32,
        height: size + 32,
        background: bgColor,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${borderColor}`,
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="85" stroke="#C47A3A" strokeWidth="4.5" fill="none" opacity="0.82"/>
        <g transform="translate(100,95)">
          <g transform="scale(1.1)" fill="#2A3D2E">
            <ellipse cx="0" cy="4" rx="11" ry="8"/>
            <ellipse cx="11" cy="-4" rx="7" ry="6" fill="#EDE9E0"/>
            <path d="M16,-3 L23,0 L16,2 Z" fill="#C47A3A"/>
            <path d="M-10,5 L-26,12 L-26,5 L-16,0 Z" fill="#EDE9E0"/>
            <path d="M-2,0 C-20,-24 -56,-32 -70,-20 C-56,-15 -32,-7 -10,4 Z"/>
            <path d="M2,0 C20,-24 56,-32 70,-20 C56,-15 32,-7 10,4 Z"/>
            <path d="M-68,-21 L-73,-27 M-62,-24 L-66,-31 M-56,-26 L-59,-33 M-50,-27 L-52,-34" stroke="#2A3D2E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M68,-21 L73,-27 M62,-24 L66,-31 M56,-26 L59,-33 M50,-27 L52,-34" stroke="#2A3D2E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3,11 L1,20 M6,12 L7,21 M9,11 L12,19" stroke="#2A3D2E" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        </g>
        <path d="M52,172 L57,159 L62,169 L67,154 L72,162 L78,148 L83,161 L89,145 L95,158 L100,141 L106,158 L111,145 L117,161 L122,148 L128,162 L134,154 L139,169 L143,159 L148,172 Z" fill="#2A3D2E" opacity="0.22"/>
      </svg>
    </div>
  );
}

// ── The canonical Headwaters wordmark ──────────────────────────────────────────

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
      <PrintNav targetId="pdf-target" filename="headwaters-logo-formats.pdf" />
      <div
        id="pdf-target"
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

          {/* Eagle & ring mark */}
          <Section title="Eagle & ring mark — on light, dark, and rust">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.25rem",
                alignItems: "flex-start",
              }}
            >
              {(["light", "dark", "rust"] as const).map((bg) => (
                <div key={bg}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.4rem" }}>
                    {bg === "light" ? "Light background" : bg === "dark" ? "Dark / Evergreen" : "Rust accent"}
                  </p>
                  <EagleMark bg={bg} size={120} />
                </div>
              ))}
            </div>
          </Section>

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

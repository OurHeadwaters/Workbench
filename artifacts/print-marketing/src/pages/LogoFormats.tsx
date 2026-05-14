import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#2b2116";

// ── SVG download helpers ───────────────────────────────────────────────────────
function downloadSvg(filename: string, svgContent: string) {
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function buildEagleSvg(bg: "light" | "dark" | "rust"): string {
  const bgColor = bg === "dark" ? "#1f3d2e" : bg === "rust" ? "#b85a3e" : "#ffffff";
  const fill    = bg === "light" ? "#1f3d2e" : "#f4ede0";
  const beak    = bg === "rust"  ? "rgba(255,255,255,0.8)"  : "#C47A3A";
  const plumage = bg === "light" ? "#EDE9E0" : "rgba(244,237,224,0.85)";
  return `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="65" r="52" fill="#C47A3A"/>
  <path d="M 100,64 C 85,58 65,50 43,42 C 29,37 14,34 7,36 C 17,43 37,49 61,59 C 76,65 90,68 100,70 Z" fill="${fill}"/>
  <path d="M 100,64 C 115,58 135,50 157,42 C 171,37 186,34 193,36 C 183,43 163,49 139,59 C 124,65 110,68 100,70 Z" fill="${fill}"/>
  <ellipse cx="100" cy="69" rx="9" ry="8" fill="${fill}"/>
  <ellipse cx="100" cy="54" rx="7" ry="8" fill="${fill}"/>
  <ellipse cx="101" cy="52" rx="5" ry="5.5" fill="${plumage}"/>
  <path d="M 105,53 L 114,56 L 105,59 Z" fill="${beak}"/>
  <path d="M 94,76 L 91,89 M 100,77 L 100,90 M 106,76 L 109,89" stroke="${fill}" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M 10,37 L 3,28 M 18,34 L 12,25 M 27,31 L 22,22" stroke="${fill}" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M 190,37 L 197,28 M 182,34 L 188,25 M 173,31 L 178,22" stroke="${fill}" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M 30,178 L 34,165 L 39,174 L 44,159 L 50,168 L 57,154 L 64,166 L 71,151 L 78,163 L 86,148 L 93,160 L 100,145 L 107,160 L 114,148 L 121,163 L 129,151 L 136,166 L 143,154 L 150,168 L 156,159 L 161,174 L 166,165 L 170,178 Z" fill="${fill}" opacity="0.20"/>
</svg>`;
}

const DL_BTN: React.CSSProperties = {
  display: "inline-block",
  marginTop: "0.4rem",
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: "0.62rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: "#1f3d2e",
  background: "rgba(31,61,46,0.07)",
  borderRadius: 4,
  padding: "0.22em 0.55em",
  cursor: "pointer",
  border: "none",
};

// ── Eagle mark (sunset disc) ──────────────────────────────────────────────────
// Filled warm amber disc behind eagle — no outer ring, transparent SVG background.

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
  const eagleFill = bg === "light" ? "#1f3d2e" : CREAM;
  const beakFill  = bg === "rust"  ? "rgba(255,255,255,0.8)" : "#C47A3A";
  const plumage   = bg === "light" ? "#EDE9E0" : "rgba(244,237,224,0.85)";
  const treeFill  = bg === "light" ? "#1f3d2e" : CREAM;

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
        {/* Sunset disc — warm amber, behind the eagle */}
        <circle cx="100" cy="65" r="52" fill="#C47A3A"/>

        {/* Eagle silhouette */}
        {/* Left wing */}
        <path d="M 100,64 C 85,58 65,50 43,42 C 29,37 14,34 7,36 C 17,43 37,49 61,59 C 76,65 90,68 100,70 Z"
              fill={eagleFill}/>
        {/* Right wing */}
        <path d="M 100,64 C 115,58 135,50 157,42 C 171,37 186,34 193,36 C 183,43 163,49 139,59 C 124,65 110,68 100,70 Z"
              fill={eagleFill}/>
        {/* Body */}
        <ellipse cx="100" cy="69" rx="9" ry="8" fill={eagleFill}/>
        {/* Head/neck */}
        <ellipse cx="100" cy="54" rx="7" ry="8" fill={eagleFill}/>
        {/* White head plumage */}
        <ellipse cx="101" cy="52" rx="5" ry="5.5" fill={plumage}/>
        {/* Beak */}
        <path d="M 105,53 L 114,56 L 105,59 Z" fill={beakFill}/>
        {/* Tail feathers */}
        <path d="M 94,76 L 91,89 M 100,77 L 100,90 M 106,76 L 109,89"
              stroke={eagleFill} strokeWidth="2" strokeLinecap="round"/>
        {/* Left wingtip primaries */}
        <path d="M 10,37 L 3,28 M 18,34 L 12,25 M 27,31 L 22,22"
              stroke={eagleFill} strokeWidth="2" strokeLinecap="round"/>
        {/* Right wingtip primaries */}
        <path d="M 190,37 L 197,28 M 182,34 L 188,25 M 173,31 L 178,22"
              stroke={eagleFill} strokeWidth="2" strokeLinecap="round"/>

        {/* Treeline */}
        <path d="M 30,178 L 34,165 L 39,174 L 44,159 L 50,168 L 57,154 L 64,166 L 71,151 L 78,163 L 86,148 L 93,160 L 100,145 L 107,160 L 114,148 L 121,163 L 129,151 L 136,166 L 143,154 L 150,168 L 156,159 L 161,174 L 166,165 L 170,178 Z"
              fill={treeFill} opacity="0.20"/>
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

          {/* Eagle mark */}
          <Section title="Eagle mark — sunset disc (light, dark, rust)">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.25rem",
                alignItems: "flex-start",
              }}
            >
              {(["light", "dark", "rust"] as const).map((bg) => (
                <div key={bg} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginBottom: "0.4rem" }}>
                    {bg === "light" ? "Light background" : bg === "dark" ? "Dark / Evergreen" : "Rust accent"}
                  </p>
                  <EagleMark bg={bg} size={120} />
                  <button
                    onClick={() => downloadSvg(`headwaters-eagle-mark-${bg}.svg`, buildEagleSvg(bg))}
                    style={DL_BTN}
                  >↓ SVG</button>
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
            <a
              href={`${import.meta.env.BASE_URL}headwaters-logo.svg`}
              download="headwaters-logo.svg"
              style={{ ...DL_BTN, marginTop: "0.75rem" }}
            >↓ SVG — full wordmark</a>
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

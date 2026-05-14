import { Link } from "wouter";

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
  const bgColor   = bg === "dark" ? "#1f3d2e" : bg === "rust" ? "#b85a3e" : "#ffffff";
  const fill      = bg === "light" ? "#1f3d2e" : "#f4ede0";
  const beak      = bg === "rust"  ? "rgba(255,255,255,0.8)"  : "#C47A3A";
  const plumage   = bg === "light" ? "#EDE9E0" : "rgba(244,237,224,0.85)";
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


const DL_LINK_STYLE: React.CSSProperties = {
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
  textDecoration: "none",
};

// ── Eagle mark SVG (sunset disc) ──────────────────────────────────────────────
// Filled warm amber disc behind eagle — no outer ring, transparent SVG background.
function EagleMark({ size = 100, bg = "light" }: { size?: number; bg?: "light" | "dark" | "rust" }) {
  const bgColor   = bg === "dark" ? "#1f3d2e" : bg === "rust" ? "#b85a3e" : "white";
  const border    = bg === "light" ? "1px solid rgba(31,61,46,0.12)" : "none";
  const fill      = bg === "light" ? "#1f3d2e" : "#f4ede0";
  const beak      = bg === "rust"  ? "rgba(255,255,255,0.8)"  : "#C47A3A";
  const plumage   = bg === "light" ? "#EDE9E0" : "rgba(244,237,224,0.85)";
  return (
    <div style={{ width: size + 24, height: size + 24, background: bgColor, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="65" r="52" fill="#C47A3A"/>
        <path d="M 100,64 C 85,58 65,50 43,42 C 29,37 14,34 7,36 C 17,43 37,49 61,59 C 76,65 90,68 100,70 Z" fill={fill}/>
        <path d="M 100,64 C 115,58 135,50 157,42 C 171,37 186,34 193,36 C 183,43 163,49 139,59 C 124,65 110,68 100,70 Z" fill={fill}/>
        <ellipse cx="100" cy="69" rx="9" ry="8" fill={fill}/>
        <ellipse cx="100" cy="54" rx="7" ry="8" fill={fill}/>
        <ellipse cx="101" cy="52" rx="5" ry="5.5" fill={plumage}/>
        <path d="M 105,53 L 114,56 L 105,59 Z" fill={beak}/>
        <path d="M 94,76 L 91,89 M 100,77 L 100,90 M 106,76 L 109,89" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
        <path d="M 10,37 L 3,28 M 18,34 L 12,25 M 27,31 L 22,22" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
        <path d="M 190,37 L 197,28 M 182,34 L 188,25 M 173,31 L 178,22" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
        <path d="M 30,178 L 34,165 L 39,174 L 44,159 L 50,168 L 57,154 L 64,166 L 71,151 L 78,163 L 86,148 L 93,160 L 100,145 L 107,160 L 114,148 L 121,163 L 129,151 L 136,166 L 143,154 L 150,168 L 156,159 L 161,174 L 166,165 L 170,178 Z" fill={fill} opacity="0.20"/>
      </svg>
    </div>
  );
}

// ── Canonical brand tokens ────────────────────────────────────────────────────
const EVERGREEN       = "#1f3d2e";
const EVERGREEN_MID   = "#2e5c44";
const EVERGREEN_LIGHT = "#4a7c61";
const RUST            = "#b85a3e";
const RUST_LIGHT      = "#d4866a";
const BLUE            = "#1B5E8A";
const BLUE_SOFT       = "#e8f0f7";
const CREAM           = "#f4ede0";
const CREAM_DARK      = "#ebe2d0";
const INK             = "#2b2116";
const MUTED           = "#6b7665";

// ── Small layout helpers ──────────────────────────────────────────────────────
function Rule() {
  return <div style={{ height: 1, background: `rgba(31,61,46,0.12)`, margin: "2.5rem 0" }} />;
}

function SectionHead({ label }: { label: string }) {
  return (
    <div style={{
      display: "inline-block",
      background: EVERGREEN,
      color: CREAM,
      borderRadius: 3,
      padding: "0.28em 0.55em",
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: "0.72rem",
      fontWeight: 800,
      letterSpacing: "0.13em",
      textTransform: "uppercase",
      lineHeight: 1.1,
      marginBottom: "1.25rem",
    }}>
      {label}
    </div>
  );
}

// ── Wordmark component ────────────────────────────────────────────────────────
function HwMark({ size = "full", bg = "light" }: {
  size?: "full" | "compact" | "icon";
  bg?: "light" | "dark" | "rust";
}) {
  const bgColor   = bg === "dark" ? EVERGREEN : bg === "rust" ? RUST : "white";
  const textColor = bg === "light" ? EVERGREEN : CREAM;
  const subColor  = bg === "light" ? MUTED : "rgba(244,237,224,0.6)";
  const ruleColor = bg === "light" ? RUST : bg === "rust" ? "rgba(255,255,255,0.45)" : RUST;
  const border    = bg === "light" ? `1px solid rgba(31,61,46,0.12)` : "none";

  if (size === "icon") {
    return (
      <div style={{ width: 64, height: 64, background: bgColor, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border, flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 900, color: textColor, lineHeight: 1, letterSpacing: "-0.04em" }}>H</span>
      </div>
    );
  }

  if (size === "compact") {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", background: bgColor, padding: "0.6rem 0.9rem", borderRadius: 6, border, flexShrink: 0 }}>
        <div style={{ width: 3, height: "1.4rem", background: ruleColor, borderRadius: 2, flexShrink: 0 }} />
        <div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontWeight: 700, color: textColor, lineHeight: 1.1, letterSpacing: "-0.01em" }}>Headwaters</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.42rem", letterSpacing: "0.18em", textTransform: "uppercase", color: subColor, lineHeight: 1, marginTop: "0.12rem" }}>Development Services</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: bgColor, padding: "1rem 1.4rem", borderRadius: 8, border, flexShrink: 0 }}>
      <div style={{ width: 4, height: "2.2rem", background: ruleColor, borderRadius: 2, flexShrink: 0 }} />
      <div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.55rem", fontWeight: 700, color: textColor, lineHeight: 1.05, letterSpacing: "-0.015em" }}>Headwaters</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: subColor, lineHeight: 1, marginTop: "0.25rem" }}>Development Services</p>
      </div>
    </div>
  );
}

// ── Colour swatch ─────────────────────────────────────────────────────────────
function Swatch({ hex, name, note }: { hex: string; name: string; note?: string }) {
  const isLight = ["#f4ede0", "#ebe2d0", "#e8f0f7"].includes(hex);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ width: "100%", aspectRatio: "2/1", background: hex, borderRadius: 6, border: isLight ? "1px solid rgba(0,0,0,0.08)" : "none" }} />
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 600, color: INK }}>{name}</p>
        <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.68rem", color: MUTED }}>{hex}</p>
        {note && <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: MUTED, marginTop: "0.15rem", lineHeight: 1.4 }}>{note}</p>}
      </div>
    </div>
  );
}

// ── Section label demo ────────────────────────────────────────────────────────
function LabelDemo({ bg, label, name, usage }: { bg: string; label: string; name: string; usage: string }) {
  const isLight = bg === CREAM;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <div style={{
        display: "inline-block",
        background: bg,
        color: isLight ? EVERGREEN : CREAM,
        borderRadius: 3,
        padding: "0.28em 0.55em",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "0.72rem",
        fontWeight: 800,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        lineHeight: 1.1,
        border: isLight ? `1px solid rgba(31,61,46,0.2)` : "none",
      }}>
        {label}
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 600, color: INK }}>{name}</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: MUTED, lineHeight: 1.4, marginTop: "0.1rem" }}>{usage}</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BrandingKit() {
  return (
    <div style={{ minHeight: "100vh", background: CREAM }}>

      {/* Nav */}
      <div style={{ background: CREAM_DARK, borderBottom: `1px solid rgba(31,61,46,0.12)`, padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: EVERGREEN, textDecoration: "none", fontWeight: 500 }}>← Back to suite</Link>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: MUTED, letterSpacing: "0.06em" }}>Brand reference — not for print</p>
      </div>

      {/* Header */}
      <div style={{ background: EVERGREEN, padding: "3rem 2rem 2.75rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.4rem" }}>
            Headwaters Development Services
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.8rem", fontWeight: 700, color: CREAM, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.6rem" }}>
            Brand Kit
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", color: "rgba(244,237,224,0.75)", maxWidth: 540, lineHeight: 1.65 }}>
            The single source of truth for Headwaters marks, colours, type, and section labels. Use this as your reference before producing any materials.
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* ── Marks ───────────────────────────────────────────────────────────── */}
        <SectionHead label="Marks" />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: MUTED, marginBottom: "1.75rem", lineHeight: 1.6 }}>
          Three formats, three colourways. Use the full wordmark wherever space allows. Compact for headers, footers, and email signatures. Icon only for avatars and favicons.
        </p>

        {/* Eagle mark — revised */}
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: "0.5rem" }}>Eagle mark</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: MUTED, marginBottom: "0.9rem", lineHeight: 1.6 }}>
          The community circle is an open bowl arc — a horizon, a nest, a gathering. The eagle sits at and rises from the gap. Rust arc for warmth; Evergreen eagle for land and strength.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          {(["light", "dark", "rust"] as const).map(bg => (
            <div key={bg} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: MUTED, marginBottom: "0.35rem", textTransform: "capitalize" }}>{bg === "light" ? "Light" : bg === "dark" ? "Evergreen" : "Rust"}</p>
              <EagleMark size={100} bg={bg} />
              <button
                onClick={() => downloadSvg(`headwaters-eagle-mark-${bg}.svg`, buildEagleSvg(bg))}
                style={DL_LINK_STYLE}
              >↓ SVG</button>
            </div>
          ))}
          {/* Small sizes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", justifyContent: "flex-end" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: MUTED }}>Scale</p>
            {[64, 48, 32].map(px => (
              <div key={px} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                <EagleMark size={px - 8} bg="light" />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: MUTED }}>{px}px</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(31,61,46,0.06)", borderRadius: 6, padding: "0.75rem 1rem", marginBottom: "2rem", fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: MUTED, lineHeight: 1.65 }}>
          <strong style={{ color: EVERGREEN }}>What changed:</strong> The ring is now an open arc (270°, 90° gap at top). The eagle breaks above the arc line rather than floating inside a closed bullseye. The shape reads as gathering and rising — not targeting.
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Full wordmark</p>
          <a
            href={`${import.meta.env.BASE_URL}headwaters-logo.svg`}
            download="headwaters-logo.svg"
            style={DL_LINK_STYLE}
          >↓ SVG</a>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
          {(["light", "dark", "rust"] as const).map(bg => (
            <div key={bg}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: MUTED, marginBottom: "0.35rem", textTransform: "capitalize" }}>{bg === "light" ? "Light" : bg === "dark" ? "Evergreen" : "Rust"}</p>
              <HwMark size="full" bg={bg} />
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: "0.75rem" }}>Compact wordmark</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
          {(["light", "dark"] as const).map(bg => (
            <div key={bg}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: MUTED, marginBottom: "0.35rem", textTransform: "capitalize" }}>{bg === "light" ? "Light" : "Evergreen"}</p>
              <HwMark size="compact" bg={bg} />
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: "0.75rem" }}>Icon mark</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "flex-end", marginBottom: "0.5rem" }}>
          {(["light", "dark", "rust"] as const).map(bg => (
            <div key={bg}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: MUTED, marginBottom: "0.35rem", textTransform: "capitalize" }}>{bg === "light" ? "Light" : bg === "dark" ? "Evergreen" : "Rust"}</p>
              <HwMark size="icon" bg={bg} />
            </div>
          ))}
          {[48, 32, 24].map(px => (
            <div key={px} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: px, height: px, background: EVERGREEN, borderRadius: Math.round(px * 0.15), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: px * 0.6, fontWeight: 900, color: CREAM, lineHeight: 1 }}>H</span>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: MUTED }}>{px}px</p>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(31,61,46,0.06)", borderRadius: 6, padding: "0.85rem 1.1rem", marginTop: "1.25rem", fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: MUTED, lineHeight: 1.65 }}>
          <strong style={{ color: EVERGREEN }}>Rules:</strong> Always keep clear space equal to the cap-height of the wordmark. Do not stretch, outline, or recolour outside the palette. For Square: dark icon mark, 64 × 64 px. For email: compact on light. For print: full wordmark at 300 dpi minimum.
        </div>

        <Rule />

        {/* ── Palette ─────────────────────────────────────────────────────────── */}
        <SectionHead label="Colour Palette" />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: MUTED, marginBottom: "1.75rem", lineHeight: 1.6 }}>
          Oat paper and deep evergreen are the anchors. Rust adds warmth and urgency. Lake Blue is for institutional or co-op contexts. Never pure white; never pure black.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1.25rem 1rem", marginBottom: "0.5rem" }}>
          <Swatch hex={EVERGREEN}       name="Evergreen"       note="Primary — headers, marks, dark bands" />
          <Swatch hex={EVERGREEN_MID}   name="Evergreen mid"   note="Hover states, mid-tone surfaces" />
          <Swatch hex={EVERGREEN_LIGHT} name="Evergreen light" note="Icons, decorative accents" />
          <Swatch hex={RUST}            name="Rust"            note="Accent — warmth, urgency, Parr's Jars" />
          <Swatch hex={RUST_LIGHT}      name="Rust light"      note="Pull quotes, italic emphasis" />
          <Swatch hex={BLUE}            name="Lake Blue"       note="Co-op, institutional, data contexts" />
          <Swatch hex={BLUE_SOFT}       name="Blue soft"       note="Blue callout backgrounds" />
          <Swatch hex={CREAM}           name="Cream"           note="Primary background — all surfaces" />
          <Swatch hex={CREAM_DARK}      name="Cream dark"      note="Sidebar, nav, secondary surfaces" />
          <Swatch hex={INK}             name="Ink"             note="Body text — not pure black" />
          <Swatch hex={MUTED}           name="Muted"           note="Labels, captions, meta text" />
        </div>

        <Rule />

        {/* ── Typography ──────────────────────────────────────────────────────── */}
        <SectionHead label="Typography" />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: MUTED, marginBottom: "1.75rem", lineHeight: 1.6 }}>
          Two fonts only. Fraunces is expressive, optical-size aware, and slightly wild — it carries the editorial voice. Inter is neutral and precise — it handles everything functional.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <div style={{ borderLeft: `3px solid ${RUST}`, paddingLeft: "1.25rem" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: "0.5rem" }}>Fraunces — headings, wordmark, pull quotes</p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.6rem", fontWeight: 700, color: EVERGREEN, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              Heading One
            </p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.55rem", fontWeight: 700, color: EVERGREEN, lineHeight: 1.1, letterSpacing: "-0.01em", marginTop: "0.3rem" }}>
              Section Heading
            </p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 600, color: INK, lineHeight: 1.3, marginTop: "0.3rem" }}>
              Subheading — third level
            </p>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1rem", color: MUTED, lineHeight: 1.5, marginTop: "0.3rem" }}>
              Italic Fraunces is used for pull quotes and emphasis — restrained, not decorative.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: MUTED, marginTop: "0.6rem" }}>
              Google Fonts · <span style={{ fontFamily: "var(--font-mono, monospace)" }}>family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,400</span>
            </p>
          </div>

          <div style={{ borderLeft: `3px solid ${EVERGREEN}`, paddingLeft: "1.25rem" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: "0.5rem" }}>Inter — body, labels, UI, data</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 400, color: INK, lineHeight: 1.65, maxWidth: 540 }}>
              Body text runs at 400 weight, 1rem, line-height 1.6–1.7. This is the workhorse — meeting notes, field descriptions, rates, addresses, everything that needs to be read quickly and trusted.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 600, color: INK, marginTop: "0.5rem" }}>
              600 weight for labels and UI elements.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 800, color: EVERGREEN, letterSpacing: "0.04em", marginTop: "0.3rem" }}>
              800 weight for section labels and utility caps.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: MUTED, marginTop: "0.6rem" }}>
              Google Fonts · <span style={{ fontFamily: "var(--font-mono, monospace)" }}>family=Inter:wght@400;500;600;700;800</span>
            </p>
          </div>
        </div>

        <Rule />

        {/* ── Section labels ──────────────────────────────────────────────────── */}
        <SectionHead label="Section Labels" />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: MUTED, marginBottom: "1.75rem", lineHeight: 1.6 }}>
          The filled-bar label is the Headwaters way of naming a section — used on print pieces, digital artifacts, and anywhere a category needs to feel like a posted sign. Inter 800, all-caps, 0.13em tracking, 3px radius. Choose the colour by context.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <LabelDemo bg={EVERGREEN} label="Evergreen" name="Default" usage="Section names, general categories, most print pieces." />
          <LabelDemo bg={RUST}     label="Rust"      name="Rust"    usage="Action items, warmth, Parr's Jars, community contexts." />
          <LabelDemo bg={BLUE}     label="Lake Blue" name="Blue"    usage="Co-op, institutional, grant, or data-heavy contexts." />
          <LabelDemo bg={CREAM}    label="Cream"     name="Cream"   usage="Labels on dark (evergreen/rust) backgrounds only." />
        </div>

        <div style={{ background: "rgba(31,61,46,0.06)", borderRadius: 6, padding: "0.85rem 1.1rem", fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: MUTED, lineHeight: 1.65 }}>
          <strong style={{ color: EVERGREEN }}>CSS:</strong> Use <code style={{ fontFamily: "var(--font-mono, monospace)", background: "rgba(0,0,0,0.06)", padding: "0.05em 0.3em", borderRadius: 3 }}>.hw-label</code> (evergreen), <code style={{ fontFamily: "var(--font-mono, monospace)", background: "rgba(0,0,0,0.06)", padding: "0.05em 0.3em", borderRadius: 3 }}>.hw-label--rust</code>, <code style={{ fontFamily: "var(--font-mono, monospace)", background: "rgba(0,0,0,0.06)", padding: "0.05em 0.3em", borderRadius: 3 }}>.hw-label--blue</code>, <code style={{ fontFamily: "var(--font-mono, monospace)", background: "rgba(0,0,0,0.06)", padding: "0.05em 0.3em", borderRadius: 3 }}>.hw-label--cream</code>. Available in all web artifacts.
        </div>

        <Rule />

        {/* ── Photography ─────────────────────────────────────────────────────── */}
        <SectionHead label="Photography" />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: MUTED, marginBottom: "1.75rem", lineHeight: 1.6 }}>
          Field photography from Northwestern Ontario. Use for hero banners, slide decks, and print covers. Source files at 1920×1080 and 2400×900 are in <code style={{ fontFamily: "var(--font-mono, monospace)", background: "rgba(0,0,0,0.06)", padding: "0.05em 0.3em", borderRadius: 3, fontSize: "0.78rem" }}>shared/hero-images/</code> in the project root.
        </p>

        {[
          {
            file: `${import.meta.env.BASE_URL}hero-images/eagle-sky-1-1920x1080.jpg`,
            label: "Eagle silhouette — blue sky, 1920×1080",
            note: "Primary hero. Deep blue sky, clean silhouette. Best for slide covers and website hero banners.",
            size: "1920×1080",
          },
          {
            file: `${import.meta.env.BASE_URL}hero-images/eagle-sky-2-2400x900.jpg`,
            label: "Eagle sky pair — banner crop, 2400×900",
            note: "Banner ratio. Works across the full width of a printed page or wide web header.",
            size: "2400×900",
          },
          {
            file: `${import.meta.env.BASE_URL}hero-images/eagle-flight-1920x1080.jpg`,
            label: "Eagle in flight — landscape, 1920×1080",
            note: "Full-wingspan shot. Strong for print covers; pair with a dark overlay for text legibility.",
            size: "1920×1080",
          },
          {
            file: `${import.meta.env.BASE_URL}hero-images/eagle-pair-2400x900.jpg`,
            label: "Eagle pair — wide crop, 2400×900",
            note: "Second banner crop. Good for secondary hero positions and email headers.",
            size: "2400×900",
          },
        ].map(({ file, label, note, size }) => (
          <div key={file} style={{ marginBottom: "1.75rem" }}>
            <div style={{ width: "100%", aspectRatio: "16/5", background: CREAM_DARK, borderRadius: 6, overflow: "hidden", marginBottom: "0.6rem", border: `1px solid rgba(31,61,46,0.1)` }}>
              <img
                src={file}
                alt={label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 600, color: INK, marginBottom: "0.15rem" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: MUTED, lineHeight: 1.5 }}>{note}</p>
              </div>
              <a
                href={file}
                download
                style={{ flexShrink: 0, fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, color: EVERGREEN, background: "rgba(31,61,46,0.08)", borderRadius: 4, padding: "0.3em 0.65em", textDecoration: "none", letterSpacing: "0.03em", whiteSpace: "nowrap" }}
              >
                ↓ {size}
              </a>
            </div>
          </div>
        ))}

        <div style={{ background: "rgba(31,61,46,0.06)", borderRadius: 6, padding: "0.85rem 1.1rem", fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: MUTED, lineHeight: 1.65, marginBottom: "0.5rem" }}>
          <strong style={{ color: EVERGREEN }}>Usage rules:</strong> Always credit the photographer when known. Overlay text needs a semi-transparent dark band or blur — never place white text directly on a sky photo without a contrast layer. Do not crop in a way that removes the horizon line; it anchors the sense of place.
        </div>

        <Rule />

        {/* ── Voice ───────────────────────────────────────────────────────────── */}
        <SectionHead label="Voice" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {[
            { title: "Plain language", body: "Write for the person reading it, not for the funder reviewing it. If a band councillor in Deer Lake can't follow it in one pass, rewrite it." },
            { title: "Specific over general", body: "\"$175/hr, 8-week trial\" beats \"flexible engagement model\". \"Dryden, Ontario\" beats \"rural Northwestern Ontario\". Specifics are credible." },
            { title: "Calm confidence", body: "No exclamation marks. No urgency theatre. The work is serious — the writing should feel the same. Direct sentences. Active voice." },
            { title: "Community first", body: "Headwaters is a coordinator, not the hero. The community's name comes before ours. Their language leads; our language translates at the gate." },
          ].map(({ title, body }) => (
            <div key={title} style={{ borderLeft: `2px solid rgba(31,61,46,0.18)`, paddingLeft: "0.85rem" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem", fontWeight: 700, color: EVERGREEN, marginBottom: "0.25rem" }}>{title}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: INK, lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>

        <Rule />

        {/* ── Contact block ────────────────────────────────────────────────────── */}
        <div style={{ background: EVERGREEN, borderRadius: 8, padding: "1.5rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 700, color: CREAM, marginBottom: "0.3rem" }}>Headwaters Development Services</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(244,237,224,0.7)", lineHeight: 1.6 }}>
              bobbie@ourheadwaters.ca · 807 220 3654<br />
              ourheadwaters.ca · Dryden, Ontario · Treaty 3 Territory
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "rgba(244,237,224,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Last updated {new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

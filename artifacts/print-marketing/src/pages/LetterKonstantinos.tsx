import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#1a1a1a";

const base = import.meta.env.BASE_URL;

const DATE = "June 29, 2026";

function buildPlainText(): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
    "",
    DATE,
    "",
    "To the team at Konstantino's,",
    "",
    "My name is Bobbie Parr. I'm a web developer based in Wabigoon working with small businesses across the Dryden area. I build custom websites and digital tools — practical ones, sized for how a local business actually runs.",
    "",
    "I've put together a working demo site for Konstantino's: a full public-facing site with your menu, your story, community programs, add-ons, and an ordering window.",
    "",
    "I'm offering it to you at no upfront cost. Here's the arrangement:",
    "",
    "· The site is yours to use, maintained and hosted for $40/month",
    "· In exchange, I ask that if you're happy with the work, you mention it to other business owners in Dryden who might benefit — and make a direct introduction when the opportunity comes up",
    "· For any client who signs on as a result of your referral, I'll send you $75 cash or a credit toward your account",
    "",
    "There's no pressure and no long contract. If it's not a fit, no harm done.",
    "",
    "If you'd like to see the full demo or talk it over, I'm reachable at bobbie@ourheadwaters.ca or 807 220 3654.",
    "",
    "Thanks for the work you do for Dryden.",
    "",
    "Bobbie Parr",
    "Headwaters Development Services",
    "Wabigoon, Ontario — Treaty 3 Territory",
    "",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
  ].join("\n");
}

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: CREAM,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontFamily: "Inter, system-ui, sans-serif",
  color: INK,
};

export function LetterKonstantinosPage() {
  return (
    <div className="page-letter" style={PAGE}>

      {/* Letterhead band */}
      <div style={{
        background: EVERGREEN,
        padding: "0.42in 0.65in 0.36in",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.18in" }}>
          <img
            src={`${base}eagle-mark.svg`}
            alt="Headwaters"
            style={{ width: "0.6in", height: "0.5in", objectFit: "contain", opacity: 0.92, flexShrink: 0 }}
          />
          <div>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
              Headwaters
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.52rem", color: "rgba(244,237,224,0.6)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Development Services
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.7)", margin: 0, lineHeight: 1.6 }}>ourheadwaters.ca</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.7)", margin: 0, lineHeight: 1.6 }}>bobbie@ourheadwaters.ca</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.7)", margin: 0, lineHeight: 1.6 }}>807 220 3654</p>
        </div>
      </div>

      {/* Rust rule */}
      <div style={{ height: "0.06in", background: RUST, flexShrink: 0 }} />

      {/* Letter body */}
      <div style={{ flex: 1, padding: "0.52in 0.75in 0.4in", display: "flex", flexDirection: "column" }}>

        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: MUTED, marginBottom: "0.38in" }}>
          {DATE}
        </p>

        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", fontWeight: 600, color: EVERGREEN, marginBottom: "0.28in", lineHeight: 1.4 }}>
          To the team at Konstantino's,
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.2in", flex: 1 }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            My name is Bobbie Parr. I'm a web developer based in Wabigoon working with small businesses across the Dryden area. I build custom websites and digital tools — practical ones, sized for how a local business actually runs.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            I've put together a working demo site for Konstantino's: a full public-facing site with your menu, your story, community programs, add-ons, and an ordering window.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            I'm offering it to you at no upfront cost. Here's the arrangement:
          </p>

          {/* Terms block */}
          <div style={{ background: "rgba(31,61,46,0.05)", borderLeft: `3px solid ${RUST}`, padding: "0.22in 0.28in", borderRadius: "0 4px 4px 0", display: "flex", flexDirection: "column", gap: "0.12in" }}>
            {[
              { bullet: "·", text: "The site is yours to use, maintained and hosted for $40/month" },
              { bullet: "·", text: "In exchange, I ask that if you're happy with the work, you mention it to other business owners in Dryden who might benefit — and make a direct introduction when the opportunity comes up" },
              { bullet: "·", text: "For any client who signs on as a result of your referral, I'll send you $75 cash or a credit toward your account" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.15in" }}>
                <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", color: RUST, lineHeight: 1.7, flexShrink: 0 }}>{item.bullet}</span>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            There's no pressure and no long contract. If it's not a fit, no harm done.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            If you'd like to see the full demo or talk it over, I'm reachable at <span style={{ color: EVERGREEN, fontWeight: 600 }}>bobbie@ourheadwaters.ca</span> or <span style={{ color: EVERGREEN, fontWeight: 600 }}>807 220 3654</span>.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            Thanks for the work you do for Dryden.
          </p>
        </div>

        {/* Signature block */}
        <div style={{ marginTop: "0.38in" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: INK, marginBottom: "0.55in", lineHeight: 1.7 }}>
            Sincerely,
          </p>
          <div style={{ width: "2.2in", height: 1, background: "rgba(31,61,46,0.25)", marginBottom: "0.1in" }} />
          <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", fontWeight: 700, color: EVERGREEN, margin: 0, lineHeight: 1.3 }}>
            Bobbie Parr
          </p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.72rem", color: MUTED, margin: "0.06in 0 0", lineHeight: 1.5 }}>
            Headwaters Development Services<br />
            Wabigoon, Ontario — Treaty 3 Territory
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: EVERGREEN,
        padding: "0.18in 0.65in",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.3in",
        flexShrink: 0,
      }}>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.7)", margin: 0, letterSpacing: "0.06em" }}>ourheadwaters.ca</p>
        <span style={{ color: "rgba(244,237,224,0.35)", fontSize: "0.5rem" }}>·</span>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.7)", margin: 0, letterSpacing: "0.06em" }}>bobbie@ourheadwaters.ca</p>
        <span style={{ color: "rgba(244,237,224,0.35)", fontSize: "0.5rem" }}>·</span>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.7)", margin: 0, letterSpacing: "0.06em" }}>807 220 3654</p>
      </div>
    </div>
  );
}

export default function LetterKonstantinos() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-letter-konstantinos.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <LetterKonstantinosPage />
      </div>
    </>
  );
}

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
    "Hey!",
    "",
    "I've been working on something and thought of you right away — so I built you a demo.",
    "",
    "It's a full Hinterland & Co. website: your products, the Glow Room, your story, and a \"Find Us\" section. Handmade in Dryden feel, all the way through.",
    "",
    "Here's what I'm thinking — I'd love to give it to you free in exchange for something simple. If you like it and someone asks who built your site, just tell them. And if they're serious, introduce us. If they sign on, I'll throw $75 your way (or knock it off your bill if you ever want upgrades).",
    "",
    "To keep it running I'd ask for $40/month for hosting and upkeep — that's it. No big commitment, cancel anytime.",
    "",
    "I'm trying to grow this locally and I can't think of a better place to start than someone who already gets what I'm doing. Let me know what you think — happy to grab a coffee and walk through it.",
    "",
    "Bobbie",
    "Headwaters Development Services",
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

export function LetterHinterlandPage() {
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

        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: EVERGREEN, marginBottom: "0.28in", lineHeight: 1.4 }}>
          Hey!
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.2in", flex: 1 }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", lineHeight: 1.75, color: INK, margin: 0 }}>
            I've been working on something and thought of you right away — so I built you a demo.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", lineHeight: 1.75, color: INK, margin: 0 }}>
            It's a full Hinterland &amp; Co. website: your products, the Glow Room, your story, and a "Find Us" section. Handmade-in-Dryden feel, all the way through.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", lineHeight: 1.75, color: INK, margin: 0 }}>
            Here's what I'm thinking — I'd love to give it to you free in exchange for something simple. If you like it and someone asks who built your site, just tell them. And if they're serious, introduce us. If they sign on, I'll throw{" "}
            <span style={{ color: EVERGREEN, fontWeight: 600 }}>$75 your way</span> (or knock it off your bill if you ever want upgrades).
          </p>

          {/* Terms note */}
          <div style={{ background: "rgba(31,61,46,0.05)", borderLeft: `3px solid ${RUST}`, padding: "0.18in 0.24in", borderRadius: "0 4px 4px 0" }}>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
              To keep it running I'd ask for <span style={{ color: EVERGREEN, fontWeight: 600 }}>$40/month</span> for hosting and upkeep — that's it. No big commitment, cancel anytime.
            </p>
          </div>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", lineHeight: 1.75, color: INK, margin: 0 }}>
            I'm trying to grow this locally and I can't think of a better place to start than someone who already gets what I'm doing.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", lineHeight: 1.75, color: INK, margin: 0 }}>
            Let me know what you think — happy to grab a coffee and walk through it.
          </p>
        </div>

        {/* Signature */}
        <div style={{ marginTop: "0.45in" }}>
          <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", fontWeight: 700, color: EVERGREEN, margin: 0, lineHeight: 1.3 }}>
            Bobbie
          </p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.72rem", color: MUTED, margin: "0.06in 0 0", lineHeight: 1.5 }}>
            Headwaters Development Services<br />
            Wabigoon, Ontario
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

export default function LetterHinterland() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-letter-hinterland.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <LetterHinterlandPage />
      </div>
    </>
  );
}

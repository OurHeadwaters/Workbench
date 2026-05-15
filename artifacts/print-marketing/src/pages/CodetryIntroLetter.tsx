import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#1a1a1a";

const base = import.meta.env.BASE_URL;

function buildPlainText(): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
    "",
    "May 15, 2026",
    "",
    "To the Leadership of Nishnawbe Aski Nation,",
    "",
    "My name is Bobbie Parr. I'm a community development practitioner based in Dryden, Ontario — Treaty 3 Territory — and I'm writing to introduce Headwaters Development Services and a piece of work I think is worth your attention.",
    "",
    "For the past several years I've been building community economic infrastructure in northern Ontario: co-op platforms, community store feasibility plans, and the operational systems that make those stores actually run after the consultant leaves. I'm the founder of Parr's Jars — a circular-economy food business — and a founding board member of the 807 Food Co-operative, which is working to move locally sourced food from producers in the northwest into First Nations communities that have historically had no access to it.",
    "",
    "I hold a degree in Recreation Management from the University of Manitoba with a minor in Indigenous Studies. That background shapes how I work: I came into this field because I believe community wellbeing is inseparable from economic self-determination, and the study of Indigenous governance and self-determination gave me language and grounding I couldn't have gotten anywhere else. I'm not a consultant who parachutes in, delivers a report, and disappears. I sit at the table, learn what the community already knows, and build something the community owns — not the funder, not me.",
    "",
    "The reason I'm writing to NAN specifically is Codetry.",
    "",
    "Codetry is a discipline I've developed for building community-owned economic tools — community stores, co-op platforms, and the software that runs them — using a trial-first model that keeps costs honest and gives communities a way out at every stage. Nothing is locked in. Everything built stays with the community. The engagement is bounded: clear scope, flat fee, defined deliverables, and a handoff built into the design from day one.",
    "",
    "I've enclosed three documents with this letter: a Partnership and Funding Brief that explains what Codetry is and what I'm asking for; a one-pager on economic development for your reference; and a Pilot Proposal Outline showing how a first engagement with a NAN member community would run.",
    "",
    "I'd welcome a conversation. The work is ready to go — I'm looking for the right community to do it with.",
    "",
    "Respectfully,",
    "",
    "Bobbie Parr",
    "Headwaters Development Services",
    "Dryden, Ontario — Treaty 3 Territory",
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

export default function CodetryIntroLetter() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-codetry-intro-letter.pdf"
        onCopyPlainText={buildPlainText}
      />

      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
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
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.7)", margin: 0, lineHeight: 1.6 }}>
                ourheadwaters.ca
              </p>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.7)", margin: 0, lineHeight: 1.6 }}>
                bobbie@ourheadwaters.ca
              </p>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.7)", margin: 0, lineHeight: 1.6 }}>
                807 220 3654
              </p>
            </div>
          </div>

          {/* Rust rule */}
          <div style={{ height: "0.06in", background: RUST, flexShrink: 0 }} />

          {/* Letter body */}
          <div style={{ flex: 1, padding: "0.52in 0.75in 0.4in", display: "flex", flexDirection: "column" }}>

            {/* Date */}
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: MUTED, marginBottom: "0.38in" }}>
              May 15, 2026
            </p>

            {/* Salutation */}
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", fontWeight: 600, color: EVERGREEN, marginBottom: "0.28in", lineHeight: 1.4 }}>
              To the Leadership of Nishnawbe Aski Nation,
            </p>

            {/* Body paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2in", flex: 1 }}>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
                My name is Bobbie Parr. I'm a community development practitioner based in Dryden, Ontario — Treaty 3 Territory — and I'm writing to introduce Headwaters Development Services and a piece of work I think is worth your attention.
              </p>

              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
                For the past several years I've been building community economic infrastructure in northern Ontario: co-op platforms, community store feasibility plans, and the operational systems that make those stores actually run after the consultant leaves. I'm the founder of Parr's Jars — a circular-economy food business — and a founding board member of the 807 Food Co-operative, which is working to move locally sourced food from producers in the northwest into First Nations communities that have historically had no access to it.
              </p>

              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
                I hold a degree in Recreation Management from the University of Manitoba with a minor in Indigenous Studies. That background shapes how I work: I came into this field because I believe community wellbeing is inseparable from economic self-determination, and the study of Indigenous governance and self-determination gave me language and grounding I couldn't have gotten anywhere else. I'm not a consultant who parachutes in, delivers a report, and disappears. I sit at the table, learn what the community already knows, and build something the community owns — not the funder, not me.
              </p>

              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
                The reason I'm writing to NAN specifically is Codetry.
              </p>

              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
                Codetry is a discipline I've developed for building community-owned economic tools — community stores, co-op platforms, and the software that runs them — using a trial-first model that keeps costs honest and gives communities a way out at every stage. Nothing is locked in. Everything built stays with the community. The engagement is bounded: clear scope, flat fee, defined deliverables, and a handoff built into the design from day one.
              </p>

              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
                I've enclosed three documents with this letter: a Partnership and Funding Brief that explains what Codetry is and what I'm asking for; a one-pager on economic development for your reference; and a Pilot Proposal Outline showing how a first engagement with a NAN member community would run.
              </p>

              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
                I'd welcome a conversation. The work is ready to go — I'm looking for the right community to do it with.
              </p>
            </div>

            {/* Signature block */}
            <div style={{ marginTop: "0.38in" }}>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: INK, marginBottom: "0.55in", lineHeight: 1.7 }}>
                Respectfully,
              </p>

              {/* Signature line */}
              <div style={{ width: "2.2in", height: 1, background: "rgba(31,61,46,0.25)", marginBottom: "0.1in" }} />

              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", fontWeight: 700, color: EVERGREEN, margin: 0, lineHeight: 1.3 }}>
                Bobbie Parr
              </p>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.72rem", color: MUTED, margin: "0.06in 0 0", lineHeight: 1.5 }}>
                Headwaters Development Services<br />
                Dryden, Ontario — Treaty 3 Territory
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
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.7)", margin: 0, letterSpacing: "0.06em" }}>
              ourheadwaters.ca
            </p>
            <span style={{ color: "rgba(244,237,224,0.35)", fontSize: "0.5rem" }}>·</span>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.7)", margin: 0, letterSpacing: "0.06em" }}>
              bobbie@ourheadwaters.ca
            </p>
            <span style={{ color: "rgba(244,237,224,0.35)", fontSize: "0.5rem" }}>·</span>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.7)", margin: 0, letterSpacing: "0.06em" }}>
              807 220 3654
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

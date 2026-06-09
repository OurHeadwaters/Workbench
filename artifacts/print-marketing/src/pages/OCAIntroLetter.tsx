import type { CSSProperties } from "react";
import { useSearch } from "wouter";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#1a1a1a";

const base = import.meta.env.BASE_URL;

function buildPlainText(org: string): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
    "",
    "June 9, 2026",
    "",
    `To the Leadership of ${org},`,
    "",
    `My name is Bobbie Parr. I'm a community development practitioner based in Wabigoon, Ontario — Treaty 3 Territory — and I'm writing to introduce Headwaters Development Services and work I believe is directly relevant to what ${org} is building.`,
    "",
    "For the past several years I've been building economic infrastructure for northern communities: co-op platforms, community store feasibility plans, and the operational systems that make those stores actually run after the consultant leaves. I'm the founder of Parr's Jars — a circular-economy food business — and a founding board member of the 807 Food Co-operative, which moves locally sourced food from producers in the northwest into First Nations communities that have historically had no access to it.",
    "",
    "I hold a Community Development degree from the University of Manitoba with a minor in Indigenous Studies. That background shapes how I work: I believe co-operative wellbeing is inseparable from economic self-determination, and every system I build is designed to stay with the organization — not the funder, not me.",
    "",
    `The reason I'm reaching out to ${org} specifically is a suite of digital platforms I've built for co-operative and community food systems.`,
    "",
    "Headwaters has developed three interconnected tools — Market Mosaic, 807 Benefits, and Grants Finder — built solo using AI-assisted development. The cost of building was a fraction of a traditional software team. The result: production-grade platforms already deployed and running. I'm now working with the Ontario Co-operatives Association to explore how these tools can be offered to Ontario co-ops through a CDP-funded initiative — making the infrastructure available provincially at a price point that actually works for community organizations.",
    "",
    "The engagement model is straightforward: I work alongside your organization, learn what you already know, and build something you own outright. Nothing is locked in. Scope is defined up front, fees are flat, and the handoff is built into the design from day one.",
    "",
    `I've enclosed materials with this letter: a Partnership and Funding Brief that explains the platform suite and what I'm proposing; a CDP Grant Narrative showing the provincial funding case; and a Capability Statement for your reference.`,
    "",
    `I'd welcome a conversation. The work is ready — and ${org} is exactly the kind of organization I'm hoping to do it with.`,
    "",
    "Respectfully,",
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

export function OCAIntroLetterPage({ org = "your co-operative" }: { org?: string }) {
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
          June 9, 2026
        </p>

        {/* Salutation */}
        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", fontWeight: 600, color: EVERGREEN, marginBottom: "0.28in", lineHeight: 1.4 }}>
          To the Leadership of {org},
        </p>

        {/* Body paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2in", flex: 1 }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            My name is Bobbie Parr. I'm a community development practitioner based in Wabigoon, Ontario — Treaty 3 Territory — and I'm writing to introduce Headwaters Development Services and work I believe is directly relevant to what {org} is building.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            For the past several years I've been building economic infrastructure for northern communities: co-op platforms, community store feasibility plans, and the operational systems that make those stores actually run after the consultant leaves. I'm the founder of Parr's Jars — a circular-economy food business — and a founding board member of the 807 Food Co-operative, which moves locally sourced food from producers in the northwest into First Nations communities that have historically had no access to it.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            I hold a Community Development degree from the University of Manitoba with a minor in Indigenous Studies. That background shapes how I work: I believe co-operative wellbeing is inseparable from economic self-determination, and every system I build is designed to stay with the organization — not the funder, not me.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            The reason I'm reaching out to {org} specifically is a suite of digital platforms I've built for co-operative and community food systems.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            Headwaters has developed three interconnected tools — Market Mosaic, 807 Benefits, and Grants Finder — built solo using AI-assisted development. The cost of building was a fraction of a traditional software team. The result: production-grade platforms already deployed and running. I'm now working with the Ontario Co-operatives Association to explore how these tools can be offered to Ontario co-ops through a CDP-funded initiative — making the infrastructure available provincially at a price point that actually works for community organizations.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            The engagement model is straightforward: I work alongside your organization, learn what you already know, and build something you own outright. Nothing is locked in. Scope is defined up front, fees are flat, and the handoff is built into the design from day one.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            I've enclosed materials with this letter: a Partnership and Funding Brief that explains the platform suite and what I'm proposing; a CDP Grant Narrative showing the provincial funding case; and a Capability Statement for your reference.
          </p>

          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: INK, margin: 0 }}>
            I'd welcome a conversation. The work is ready — and {org} is exactly the kind of organization I'm hoping to do it with.
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
  );
}

export default function OCAIntroLetter() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const org = params.get("org") || params.get("community") || "your co-operative";

  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-oca-intro-letter.pdf"
        onCopyPlainText={() => buildPlainText(org)}
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <OCAIntroLetterPage org={org} />
      </div>
    </>
  );
}

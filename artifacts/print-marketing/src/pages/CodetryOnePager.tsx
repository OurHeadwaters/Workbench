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
    "Economic Development One-Pager — Codetry",
    "May 2026",
    "",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
    "",
    "---",
    "",
    "THE PROBLEM WITH HOW NORTHERN COMMUNITIES GET SERVED",
    "",
    "Most economic development work in remote northern communities follows the same pattern: a consultant comes in, writes a report, collects a fee, and leaves. The community gets a document. The consultant gets paid. The problem stays.",
    "",
    "The tools don't stay. The knowledge doesn't stay. The infrastructure doesn't stay.",
    "",
    "Headwaters does it differently.",
    "",
    "---",
    "",
    "WHAT WE BUILD",
    "",
    "Community Stores",
    "From feasibility study to opening day. Governance structure, supply chain, staffing and training, band-council handoff. Six phases. Plain-language deliverables. Open numbers at every step.",
    "",
    "Co-op Platforms",
    "Member portals that track shares, equity, and governance — built for remote and northern communities. You own the platform outright. No licensing fees. No ongoing dependency.",
    "",
    "Food System Infrastructure",
    "Market coordination, bulk buying, preservation programs, and Standby supply planning. Connecting First Nations communities in Dryden and surrounding areas to the 807 Food Co-operative supply network.",
    "",
    "Custom Software",
    "Purpose-built tools that speak the community's language. Ordering, inventory, reporting. Built to last, not to impress a funder.",
    "",
    "---",
    "",
    "HOW WE WORK",
    "",
    "Trial-first. Bounded scope. Transparent pricing.",
    "",
    "The usual first step is a six-week planning phase at $28,000 flat — or a shorter trial engagement at $175/hr. Stop at any point. No retainer. No long commitment. If the fit is right, it continues. If not, you leave with something useful.",
    "",
    "Every deliverable is named before the engagement starts. Every dollar is accounted for. Nothing is built that the community can't run independently.",
    "",
    "---",
    "",
    "WHO WE WORK WITH",
    "",
    "Band councils, First Nations businesses, Indigenous economic development offices, Métis communities, and northern co-ops — anyone building something real for their people.",
    "",
    "Current and recent work includes the Deer Lake First Nation community store pilot, the 807 Food Co-operative membership platform, and community store feasibility planning in Dryden and surrounding areas.",
    "",
    "---",
    "",
    "Bobbie Parr · Headwaters Development Services",
    "Dryden, Ontario — Treaty 3 Territory",
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

const services = [
  {
    title: "Community Stores",
    desc: "From feasibility study to opening day. Governance structure, supply chain, staffing and training, band-council handoff. Six phases. Plain-language deliverables. Open numbers at every step.",
  },
  {
    title: "Co-op Platforms",
    desc: "Member portals that track shares, equity, and governance — built for remote and northern communities. You own the platform outright. No licensing fees.",
  },
  {
    title: "Food System Infrastructure",
    desc: "Market coordination, bulk buying, preservation programs, and Standby supply planning. Connecting First Nations communities to the 807 Food Co-operative supply network.",
  },
  {
    title: "Custom Software",
    desc: "Purpose-built tools that speak the community's language. Ordering, inventory, reporting. Built to last, not to impress a funder.",
  },
];

export function CodetryOnePagerPage() {
  return (
    <div className="page-letter" style={PAGE}>

          {/* Header band */}
          <div style={{
            background: EVERGREEN,
            padding: "0.38in 0.65in 0.34in",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.14in", marginBottom: "0.14in" }}>
                <img
                  src={`${base}eagle-mark.svg`}
                  alt="Headwaters"
                  style={{ width: "0.45in", height: "0.37in", objectFit: "contain", opacity: 0.9, flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.82rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15 }}>Headwaters</p>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.44rem", color: "rgba(244,237,224,0.55)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Development Services</p>
                </div>
              </div>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.55rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
                Economic Development<br />
                <span style={{ fontWeight: 400, fontStyle: "italic" }}>for northern communities</span>
              </h1>
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.5)", margin: 0, flexShrink: 0 }}>
              May 15, 2026
            </p>
          </div>

          {/* Rust rule */}
          <div style={{ height: "0.055in", background: RUST, flexShrink: 0 }} />

          {/* Body */}
          <div style={{ flex: 1, padding: "0.38in 0.65in 0.3in", display: "flex", flexDirection: "column", gap: "0.3in" }}>

            {/* Problem statement */}
            <section>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.1in" }}>
                The problem with how northern communities get served
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.2in" }}>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", lineHeight: 1.65, color: INK, margin: 0 }}>
                  Most economic development work in remote northern communities follows the same pattern: a consultant comes in, writes a report, collects a fee, and leaves. The community gets a document. The consultant gets paid. The problem stays.
                </p>
                <div style={{ borderLeft: `3px solid ${RUST}`, paddingLeft: "0.18in" }}>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", fontStyle: "italic", color: EVERGREEN, lineHeight: 1.5, margin: 0 }}>
                    "The tools don't stay. The knowledge doesn't stay. The infrastructure doesn't stay. Headwaters does it differently."
                  </p>
                </div>
              </div>
            </section>

            <div style={{ height: 1, background: "rgba(31,61,46,0.12)" }} />

            {/* What we build */}
            <section>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.14in" }}>
                What we build
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.18in" }}>
                {services.map((s) => (
                  <div key={s.title} style={{ background: "white", border: "1px solid rgba(31,61,46,0.1)", borderRadius: 5, padding: "0.18in 0.2in" }}>
                    <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.82rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.07in" }}>
                      {s.title}
                    </p>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.71rem", color: MUTED, margin: 0, lineHeight: 1.58 }}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ height: 1, background: "rgba(31,61,46,0.12)" }} />

            {/* How we work + Who we work with */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3in" }}>
              <section>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.1in" }}>
                  How we work
                </p>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", fontWeight: 700, color: EVERGREEN, marginBottom: "0.1in", lineHeight: 1.3 }}>
                  Trial-first. Bounded scope. Transparent pricing.
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.74rem", lineHeight: 1.65, color: INK, marginBottom: "0.1in" }}>
                  The usual first step is a six-week planning phase at $28,000 flat — or a shorter trial engagement at $175/hr. Stop at any point. No retainer. No long commitment.
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.74rem", lineHeight: 1.65, color: INK }}>
                  Every deliverable is named before the engagement starts. Every dollar is accounted for. Nothing is built that the community can't run independently.
                </p>
              </section>
              <section>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.1in" }}>
                  Who we work with
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.74rem", lineHeight: 1.65, color: INK, marginBottom: "0.12in" }}>
                  Band councils, First Nations businesses, Indigenous economic development offices, Métis communities, and northern co-ops — anyone building something real for their people.
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.74rem", lineHeight: 1.65, color: MUTED }}>
                  Current and recent work includes the Deer Lake First Nation community store pilot, the 807 Food Co-operative membership platform, and community store feasibility planning in Dryden and surrounding areas.
                </p>
              </section>
            </div>

            <div style={{ flex: 1 }} />

            {/* About Bobbie */}
            <div style={{ background: "rgba(31,61,46,0.05)", border: "1px solid rgba(31,61,46,0.12)", borderRadius: 5, padding: "0.2in 0.25in" }}>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.78rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.06in" }}>
                Bobbie Parr — Lead Practitioner
              </p>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.7rem", lineHeight: 1.6, color: MUTED, margin: 0 }}>
                Recreation Management degree from the University of Manitoba, minor in Indigenous Studies. Founder of Parr's Jars. Founding board member, 807 Food Co-operative. Based in Dryden, Ontario — Treaty 3 Territory. Not a parachute consultant.
              </p>
            </div>

          </div>

          {/* Footer */}
          <div style={{
            background: EVERGREEN,
            padding: "0.18in 0.65in",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.7rem", fontWeight: 600, color: CREAM, margin: 0 }}>
              Headwaters Development Services · Dryden, Ontario
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.65)", margin: 0, letterSpacing: "0.04em" }}>
              ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654
            </p>
          </div>

    </div>
  );
}

export default function CodetryOnePager() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-codetry-economic-development.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <CodetryOnePagerPage />
      </div>
    </>
  );
}

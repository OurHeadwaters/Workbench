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
    "Partnership & Funding Brief — Codetry Aboriginal Outreach",
    "May 2026",
    "",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
    "",
    "---",
    "",
    "WHAT CODETRY IS",
    "",
    "Codetry is a trial-first discipline for building community-owned economic infrastructure. It was developed out of real engagements in northern Ontario — community stores, co-op platforms, and the software that keeps them running after the consultant leaves.",
    "",
    "The core principle: nothing gets built unless the community can own it outright. Every engagement is bounded — clear scope, flat fee, defined deliverables — and a handoff is built in from day one. Communities can stop at any point. Everything built stays with them.",
    "",
    "THE WORKING CONSTELLATION",
    "",
    "Each Codetry engagement assembles a small, defined team — a Working Constellation — with clear roles and no hidden capacity:",
    "",
    "→ Lead Practitioner — Bobbie Parr, Dryden, ON. Scope design, governance, handoff.",
    "→ Codetry Developer — builds the tools the community will own. Platform work, software, integrations.",
    "→ Community Coordinator — a person hired from or near the community who handles receiving, reporting, and local knowledge transfer.",
    "→ Supply Chain Partner — the 807 Food Co-operative and its network of northern Ontario producers, where food system infrastructure is part of the engagement.",
    "→ Codetry Trainer — the person who teaches the community coordinator to run the Codetry tools independently, so the knowledge stays local.",
    "",
    "Every role has a named budget line. No overhead fiction.",
    "",
    "---",
    "",
    "THE ASK",
    "",
    "Headwaters is looking for a NAN member community — or a NAN-facilitated introduction to one — that wants to run a community store pilot using the Codetry model. The first engagement is a six-week planning phase at $28,000 flat. No retainer. No follow-on obligation. The community walks away with a complete plan and a named next step. Whether they proceed from there is entirely their decision.",
    "",
    "If NAN is interested in exploring this as a model for multiple communities — a regional rollout using the same constellation infrastructure — Headwaters is ready to talk about what that looks like.",
    "",
    "The work is ready. We are looking for the right table to sit at.",
    "",
    "---",
    "",
    "Headwaters Development Services · Dryden, Ontario — Treaty 3 Territory",
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

const constellationRoles = [
  {
    role: "Lead Practitioner",
    name: "Bobbie Parr, Dryden ON",
    desc: "Scope design, governance architecture, and handoff. Responsible for the overall engagement and the plan the community owns.",
  },
  {
    role: "Codetry Developer",
    name: "Tools & platforms",
    desc: "Builds the software the community will own outright — ordering, inventory, membership, and reporting tools built to run without a contractor in the room.",
  },
  {
    role: "Community Coordinator",
    name: "Hired locally",
    desc: "A person from or near the community. Handles day-to-day receiving, distribution, and reporting. This role is the knowledge anchor — everything transfers through them.",
  },
  {
    role: "Supply Chain Partner",
    name: "807 Food Co-operative",
    desc: "Northern Ontario producers and distribution infrastructure. The 807 network brings real product from Dryden and surrounding areas to communities that couldn't access it before.",
  },
  {
    role: "Codetry Trainer",
    name: "Knowledge transfer",
    desc: "Trains the community coordinator to run the tools independently. The trainer's job is to make themselves unnecessary. Local knowledge stays local.",
  },
];

export function CodetryFundingBriefPage() {
  return (
    <div className="page-letter" style={PAGE}>

          {/* Header band */}
          <div style={{
            background: EVERGREEN,
            padding: "0.42in 0.65in 0.38in",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.14in", marginBottom: "0.16in" }}>
                <img
                  src={`${base}eagle-mark.svg`}
                  alt="Headwaters"
                  style={{ width: "0.48in", height: "0.4in", objectFit: "contain", opacity: 0.9, flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15 }}>Headwaters</p>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.46rem", color: "rgba(244,237,224,0.55)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Development Services</p>
                </div>
              </div>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", margin: "0 0 0.08in" }}>
                Partnership & Funding Brief
              </p>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.65rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
                Codetry Aboriginal Outreach<br />
                <span style={{ fontWeight: 400, fontStyle: "italic", fontSize: "1.3rem" }}>A proposal for NAN member communities</span>
              </h1>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", margin: 0 }}>May 15, 2026</p>
            </div>
          </div>

          {/* Rust rule */}
          <div style={{ height: "0.055in", background: RUST, flexShrink: 0 }} />

          {/* Two-column body */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>

            {/* Left column */}
            <div style={{ padding: "0.42in 0.38in 0.32in 0.65in", borderRight: "1px solid rgba(31,61,46,0.12)", display: "flex", flexDirection: "column", gap: "0.32in" }}>

              {/* What Codetry Is */}
              <section>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.12in" }}>
                  What Codetry Is
                </p>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: EVERGREEN, lineHeight: 1.25, marginBottom: "0.16in", letterSpacing: "-0.01em" }}>
                  A trial-first discipline for building community-owned economic infrastructure.
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.68, color: INK, marginBottom: "0.14in" }}>
                  Codetry was developed out of real engagements in northern Ontario — community stores, co-op platforms, and the software that keeps them running after the consultant leaves.
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.68, color: INK }}>
                  The core principle: nothing gets built unless the community can own it outright. Every engagement is bounded — clear scope, flat fee, defined deliverables — and a handoff is built in from day one. Communities can stop at any point. Everything built stays with them.
                </p>
              </section>

              {/* The Ask */}
              <section>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.12in" }}>
                  The Ask
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.68, color: INK, marginBottom: "0.14in" }}>
                  Headwaters is looking for a NAN member community — or a NAN-facilitated introduction to one — that wants to run a community store pilot using the Codetry model. The first engagement is a six-week planning phase at $28,000 flat. No retainer. No follow-on obligation. The community walks away with a complete plan and a named next step. Whether they proceed is entirely their decision.
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.68, color: INK }}>
                  If NAN is interested in this as a model for multiple communities — a regional rollout using the same constellation infrastructure — Headwaters is ready to talk about what that looks like.
                </p>
              </section>

              {/* Fee block */}
              <div style={{ background: EVERGREEN, borderRadius: 5, padding: "0.22in 0.28in", marginTop: "auto" }}>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.06in" }}>
                  Phase 1 fee
                </p>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: CREAM, margin: "0 0 0.04in", lineHeight: 1 }}>
                  $28,000
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.68rem", color: "rgba(244,237,224,0.72)", margin: 0, lineHeight: 1.5 }}>
                  6-week engagement · flat fee · no retainer<br />
                  Everything built stays with your community.
                </p>
              </div>

            </div>

            {/* Right column — The Working Constellation */}
            <div style={{ padding: "0.42in 0.65in 0.32in 0.38in", display: "flex", flexDirection: "column", gap: "0.22in" }}>

              <div>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.12in" }}>
                  The Working Constellation
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.74rem", lineHeight: 1.6, color: MUTED, marginBottom: "0.18in" }}>
                  Each Codetry engagement assembles a small, defined team with clear roles and no hidden capacity. Every role has a named budget line.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.18in" }}>
                {constellationRoles.map((item, i) => (
                  <div key={i} style={{ borderLeft: `3px solid ${i === 0 ? RUST : "rgba(31,61,46,0.2)"}`, paddingLeft: "0.16in" }}>
                    <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.78rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.02in" }}>
                      {item.role}
                    </p>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: RUST, margin: "0 0 0.05in", fontWeight: 600, letterSpacing: "0.04em" }}>
                      {item.name}
                    </p>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.68rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

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
              Headwaters Development Services · Dryden, Ontario — Treaty 3 Territory
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.65)", margin: 0, letterSpacing: "0.04em" }}>
              ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654
            </p>
          </div>

    </div>
  );
}

export default function CodetryFundingBrief() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-codetry-funding-brief.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <CodetryFundingBriefPage />
      </div>
    </>
  );
}

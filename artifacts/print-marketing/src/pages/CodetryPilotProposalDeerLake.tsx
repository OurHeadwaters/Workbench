import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#1a1a1a";

const base = import.meta.env.BASE_URL;

const COMMUNITY = "Deer Lake First Nation";
const COMMUNITY_SHORT = "Deer Lake";

function buildPlainText(): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "Codetry Community Store — Pilot Proposal Outline",
    "May 2026",
    "",
    `Prepared for: ${COMMUNITY}`,
    "Submitted by: Bobbie Parr, Headwaters Development Services",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
    "",
    "---",
    "",
    "OVERVIEW",
    "",
    `This document outlines the four-phase structure for a Codetry community store pilot in ${COMMUNITY}. The model is trial-first: ${COMMUNITY_SHORT} can stop at any point, and everything built stays with the community. Specific details, timelines, and pricing are confirmed once ${COMMUNITY_SHORT} decides to move forward.`,
    "",
    `${COMMUNITY_SHORT} has existing infrastructure — including the hotel — that gives this pilot a head start most communities don't have. The plan uses what's already running to gather real demand data from day one, rotates supply through existing channels while the permanent line is built, and uses the pilot year to write the grants that fund the 807 Food Co-operative supply line into ${COMMUNITY_SHORT} in 2027.`,
    "",
    "---",
    "",
    "PHASE 1 — THE PLAN (6 weeks · $28,000 flat)",
    "",
    "We listen. We audit what's already there. Leadership sees the plan and decides what happens next.",
    "",
    `What ${COMMUNITY_SHORT} walks away with:`,
    "→ An audit of existing infrastructure — the hotel and any other active supply points — and what demand data they already hold",
    "→ A clear plan for what to sell and where it comes from in year one, built on real numbers not estimates",
    "→ A clear picture of who does what and how decisions get made",
    "→ A day-to-day operations guide — orders, pricing, cash",
    `→ A hiring plan: Headwaters finds candidates, writes job descriptions, and maps training needs — the contractor and ${COMMUNITY_SHORT}'s band council decide who gets hired`,
    "→ A grant-writing roadmap: which funders to approach, what the 807 Food Co-operative supply line application needs, and what financial records Phase 2 must produce to support the 2027 build",
    "",
    `You can stop at the end of Phase 1. Everything built stays with ${COMMUNITY_SHORT}.`,
    "",
    "---",
    "",
    "PHASE 2 — THE BUILD (4–6 months)",
    "",
    "Real operations begin. Demand data gets collected. Grants get written.",
    "",
    `→ Use the hotel and existing supply points to run first operations — track what moves, what's missing, what ${COMMUNITY_SHORT} actually needs`,
    "→ Rotate supply through channels that are already working while the permanent supply line is being built",
    "→ Grant applications drafted and submitted: 807 Food Co-operative supply line into Deer Lake, targeting 2027 activation",
    `→ Community Coordinator hired and oriented — ideally a ${COMMUNITY_SHORT} community member`,
    "→ Codetry tools configured: ordering, inventory, and reporting software set up and tested",
    "→ A full season of real demand data documented — the financial record that backs the grant",
    "",
    "This phase ends with a real operating season behind it, active grant applications in motion, and a product list built from what the community actually used.",
    "",
    "---",
    "",
    "PHASE 3 — THE PAYOFF (First full operating season · 807 supply line in 2027)",
    "",
    "Bulk supply arrives. The economics flip. The store shows it can pay for itself.",
    "",
    "→ 807 Food Co-operative supply line activated — locally sourced food moving directly into Deer Lake at bulk pricing",
    "→ Regular delivery schedule established via winter road or summer route",
    `→ ${COMMUNITY_SHORT} store generates its first clean financial record on the permanent supply model`,
    "→ Community feedback integrated into product mix",
    `→ ${COMMUNITY_SHORT} band council receives first financial summary: cost, earnings, what the next year looks like`,
    "",
    "---",
    "",
    "PHASE 4 — THE HANDOFF (The community ownership year)",
    "",
    `Headwaters steps back. ${COMMUNITY_SHORT} steps forward.`,
    "",
    `→ A local person is trained in the Codetry tools — ordering, pricing, inventory — so ${COMMUNITY_SHORT} owns that knowledge, not just the store`,
    `→ Community engagement deepens: feedback sessions, local sourcing conversations, ${COMMUNITY_SHORT}'s longer-term food vision takes shape`,
    `→ A formal handoff moment marks the transition from Headwaters-supported to ${COMMUNITY_SHORT}-run`,
    "→ Headwaters documents everything: what worked, what it costs, what it earns, and what comes next",
    `→ A clean record for funders and a clear path to Pilot #2 — the next community that learns from what ${COMMUNITY_SHORT} built`,
    "",
    `Phase 1 built the plan. Phase 2 ran real operations and wrote the grants. Phase 3 brought the 807 supply line in. Phase 4 makes it ${COMMUNITY_SHORT}'s.`,
    "",
    "---",
    "",
    "COMMUNITY OWNERSHIP",
    "",
    `The goal of the Codetry model is not a store that Headwaters runs. It is a store ${COMMUNITY_SHORT} owns — the tools, the knowledge, the supply relationships, and the financial records.`,
    "",
    `At the end of Phase 4, ${COMMUNITY_SHORT} should be able to run the store, train the next coordinator, place orders independently through the 807 network, and report to funders and band council without any outside support. That is the measure of success.`,
    "",
    "---",
    "",
    "NEXT STEPS",
    "",
    `If ${COMMUNITY_SHORT} wants to explore this pilot, the next step is a conversation — no commitment, no cost. Bobbie Parr can come to the community or meet by video call. From there, if there is a fit, we define the Phase 1 scope together.`,
    "",
    "Bobbie Parr · Headwaters Development Services",
    "Wabigoon, Ontario — Treaty 3 Territory",
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

const phases = [
  {
    num: "01",
    label: "The Plan",
    duration: "6 weeks · $28,000 flat",
    headline: "We listen. We audit what's already there. Leadership sees the plan and decides what happens next.",
    deliverables: [
      `An audit of existing infrastructure — the hotel and any active supply points — and what demand data they already hold`,
      "A clear plan for what to sell and where it comes from, built on real numbers not estimates",
      "A clear picture of who does what and how decisions get made",
      "A day-to-day operations guide — orders, pricing, cash",
      `A hiring plan: Headwaters finds candidates, writes job descriptions — ${COMMUNITY_SHORT}'s band council decides who gets hired`,
      "A grant-writing roadmap: which funders to approach, what the 807 supply line application needs, what Phase 2 must produce",
    ],
    note: `You can stop at the end of Phase 1. Everything built stays with ${COMMUNITY_SHORT}.`,
  },
  {
    num: "02",
    label: "The Build",
    duration: "4–6 months",
    headline: "Real operations begin. Demand data gets collected. Grants get written.",
    deliverables: [
      `Use the hotel and existing supply points to run first operations — track what moves, what's missing, what ${COMMUNITY_SHORT} actually needs`,
      "Rotate supply through channels already working while the permanent supply line is built",
      "Grant applications drafted and submitted: 807 Food Co-operative supply line into Deer Lake, targeting 2027",
      `Community Coordinator hired and oriented — ideally a ${COMMUNITY_SHORT} community member`,
      "Codetry tools configured: ordering, inventory, reporting — set up and tested",
      "A full season of real demand data documented — the financial record that backs the grant",
    ],
    note: "This phase ends with a real operating season behind it, active grant applications in motion, and a product list built from what the community actually used.",
  },
  {
    num: "03",
    label: "The Payoff",
    duration: "First full season · 807 supply line in 2027",
    headline: "Bulk supply arrives. The economics flip. The store shows it can pay for itself.",
    deliverables: [
      "807 Food Co-operative supply line activated — locally sourced food moving directly into Deer Lake at bulk pricing",
      "Regular delivery schedule established via winter road or summer route",
      `${COMMUNITY_SHORT} store generates its first clean financial record on the permanent supply model`,
      `${COMMUNITY_SHORT} band council receives first financial summary: cost, earnings, what the next year looks like`,
    ],
    note: null,
  },
  {
    num: "04",
    label: "The Handoff",
    duration: "The community ownership year",
    headline: `Headwaters steps back. ${COMMUNITY_SHORT} steps forward.`,
    deliverables: [
      `A local person is trained in the Codetry tools — ordering, pricing, inventory — so ${COMMUNITY_SHORT} owns that knowledge, not just the store`,
      `Community engagement deepens: feedback sessions, local sourcing conversations, ${COMMUNITY_SHORT}'s longer-term food vision takes shape`,
      `A formal handoff moment marks the transition from Headwaters-supported to ${COMMUNITY_SHORT}-run`,
      "Headwaters documents everything: what worked, what it costs, what it earns, and what comes next",
      `A clean record for funders and a clear path to Pilot #2 — the next community that learns from what ${COMMUNITY_SHORT} built`,
    ],
    note: `Phase 1 built the plan. Phase 2 ran real operations and wrote the grants. Phase 3 brought the 807 supply line in. Phase 4 makes it ${COMMUNITY_SHORT}'s.`,
  },
];

export function CodetryPilotProposalDeerLakePage() {
  return (
        <div className="page-letter" style={PAGE}>

          {/* Letterhead band */}
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
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.52rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", margin: "0 0 0.07in" }}>
                Pilot Proposal Outline
              </p>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
                Codetry Community Store<br />
                <span style={{ fontWeight: 400, fontStyle: "italic", fontSize: "1.2rem" }}>for {COMMUNITY}</span>
              </h1>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", margin: "0 0 0.04in" }}>Submitted by</p>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.65rem", color: CREAM, fontWeight: 600, margin: "0 0 0.04in" }}>Bobbie Parr</p>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", margin: 0 }}>May 15, 2026</p>
            </div>
          </div>

          {/* Rust rule */}
          <div style={{ height: "0.055in", background: RUST, flexShrink: 0 }} />

          {/* Overview band */}
          <div style={{ background: "rgba(31,61,46,0.05)", padding: "0.18in 0.65in", borderBottom: "1px solid rgba(31,61,46,0.1)", flexShrink: 0 }}>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.74rem", lineHeight: 1.65, color: INK, margin: 0 }}>
              {COMMUNITY_SHORT} has existing infrastructure — including the hotel — that gives this pilot a head start most communities don't have. The plan uses what's already running to gather real demand data from day one, rotates supply through existing channels while the permanent line is built, and uses the pilot year to write the grants that fund the 807 Food Co-operative supply line into {COMMUNITY_SHORT} in 2027.
            </p>
          </div>

          {/* Phase timeline */}
          <div style={{ flex: 1, padding: "0.22in 0.65in 0.22in", display: "flex", flexDirection: "column", gap: "0.15in" }}>

            {phases.map((phase, i) => (
              <div key={phase.num} style={{
                display: "grid",
                gridTemplateColumns: "0.65in 1fr",
                gap: "0.22in",
                borderTop: i > 0 ? "1px solid rgba(31,61,46,0.1)" : "none",
                paddingTop: i > 0 ? "0.15in" : 0,
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingTop: "0.02in" }}>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.5rem", fontWeight: 900, color: i === 0 ? RUST : "rgba(31,61,46,0.2)", margin: 0, lineHeight: 1 }}>
                    {phase.num}
                  </p>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", color: i === 0 ? RUST : MUTED, margin: "0.04in 0 0", fontWeight: 600 }}>
                    {phase.label}
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.4in", marginBottom: "0.07in", flexWrap: "wrap" }}>
                    <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.85rem", fontWeight: 700, color: EVERGREEN, margin: 0, lineHeight: 1.3 }}>
                      {phase.headline}
                    </p>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", color: MUTED, margin: 0, flexShrink: 0, letterSpacing: "0.04em" }}>
                      {phase.duration}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: phase.deliverables.length > 4 ? "1fr 1fr" : "1fr", gap: "0.04in 0.28in" }}>
                    {phase.deliverables.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: "0.1in", alignItems: "flex-start" }}>
                        <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.7rem", color: RUST, flexShrink: 0, marginTop: "0.01in" }}>→</span>
                        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.66rem", color: MUTED, margin: 0, lineHeight: 1.45 }}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  {phase.note && (
                    <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.7rem", fontStyle: "italic", color: EVERGREEN, margin: "0.08in 0 0", lineHeight: 1.45 }}>
                      {phase.note}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div style={{ flex: 1 }} />

            {/* Community Ownership */}
            <div style={{ background: EVERGREEN, borderRadius: 5, padding: "0.2in 0.28in", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25in" }}>
              <div>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.08in" }}>
                  Community Ownership
                </p>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.35 }}>
                  The goal is not a store that Headwaters runs. It is a store {COMMUNITY_SHORT} owns.
                </p>
              </div>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.71rem", color: "rgba(244,237,224,0.75)", margin: 0, lineHeight: 1.6 }}>
                At the end of Phase 4, {COMMUNITY_SHORT} should be able to run the store, train the next coordinator, place orders independently through the 807 network, and report to funders and band council without any outside support. That is the measure of success.
              </p>
            </div>

            {/* Next steps */}
            <div style={{ borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.14in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: RUST, marginBottom: "0.04in" }}>
                  Next steps
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.72rem", color: INK, lineHeight: 1.55, margin: 0 }}>
                  A conversation — no commitment, no cost. Bobbie can come to {COMMUNITY_SHORT} or meet by video call.<br />
                  From there, if there is a fit, we define the Phase 1 scope together.
                </p>
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
              Headwaters Development Services · Wabigoon, Ontario — Treaty 3 Territory
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.65)", margin: 0, letterSpacing: "0.04em" }}>
              ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654
            </p>
          </div>

        </div>
  );
}

export default function CodetryPilotProposalDeerLake() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-codetry-pilot-proposal-deer-lake.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <CodetryPilotProposalDeerLakePage />
      </div>
    </>
  );
}

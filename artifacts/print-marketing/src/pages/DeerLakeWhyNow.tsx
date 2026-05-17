import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#1a1a1a";
const LAKE = "#1B5E8A";

const base = import.meta.env.BASE_URL;

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

const assets = [
  {
    label: "The hotel",
    body: "An operating kitchen with weekly food needs is the anchor customer for Phase 1. Most communities start from zero. Deer Lake starts with a real demand signal.",
  },
  {
    label: "Existing supply access",
    body: "Air supply through existing operators is already running. Phase 2 uses that channel while the permanent supply line is being built — no gap in service.",
  },
  {
    label: "Band governance capacity",
    body: "Chief and Council, economic development infrastructure, and the ability to hire and manage a Community Coordinator. The governance is already in place.",
  },
  {
    label: "Winter road access",
    body: "The supply chain unlock. Bulk truck delivery via winter road in January 2027 is what makes the economics flip. Everything in 2026 is preparation for that moment.",
  },
];

const flowSteps = [
  { label: "NWO Producers", sub: "Dryden region — Rockfront and other 807 member producers" },
  { label: "807 Food Co-operative", sub: "Aggregation, cold storage, and bulk pricing" },
  { label: "Winter road delivery", sub: "January 2027 — bulk truck, not air freight" },
  { label: "Deer Lake Community Store", sub: "Affordable food owned and run by the community" },
];

const timeline = [
  {
    phase: "01",
    label: "The Plan",
    period: "Summer 2026",
    duration: "6 weeks · $28,000",
    note: "What to sell, who does what, the grant roadmap",
    active: true,
  },
  {
    phase: "02",
    label: "The Build",
    period: "Fall / Winter 2026",
    duration: "4–6 months",
    note: "Hotel anchors demand data. Grants submitted.",
    active: false,
  },
  {
    phase: "03",
    label: "The Payoff",
    period: "January 2027",
    duration: "Winter road activated",
    note: "807 supply line. Economics flip.",
    active: false,
  },
  {
    phase: "04",
    label: "The Handoff",
    period: "2027 – 2028",
    duration: "Community ownership year",
    note: "Deer Lake runs it. Headwaters steps back.",
    active: false,
  },
];

export function DeerLakeWhyNowPage() {
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.14in", marginBottom: "0.16in" }}>
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
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.54rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", margin: "0 0 0.08in" }}>
            Why Deer Lake. Why Now.
          </p>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.6rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            Deer Lake has what most communities<br />
            <span style={{ fontWeight: 400, fontStyle: "italic" }}>don't have when this work begins.</span>
          </h1>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", margin: 0 }}>May 2026</p>
        </div>
      </div>

      {/* Rust rule */}
      <div style={{ height: "0.055in", background: RUST, flexShrink: 0 }} />

      {/* Main body */}
      <div style={{ flex: 1, padding: "0.28in 0.65in 0.22in", display: "flex", flexDirection: "column", gap: "0.22in" }}>

        {/* Top two columns: Assets + Supply chain */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.38in" }}>

          {/* Left: What's already in place */}
          <div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.14in" }}>
              What's already in place
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.15in" }}>
              {assets.map((a) => (
                <div key={a.label} style={{ borderLeft: "3px solid rgba(31,61,46,0.2)", paddingLeft: "0.15in" }}>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.82rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.04in", lineHeight: 1.2 }}>
                    {a.label}
                  </p>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.68rem", color: MUTED, margin: 0, lineHeight: 1.52 }}>
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Supply chain flow */}
          <div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.14in" }}>
              The supply chain story
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.7rem", lineHeight: 1.58, color: INK, marginBottom: "0.16in" }}>
              The 807 Food Co-operative is building a permanent supply line from producers in Northwestern Ontario into First Nations communities. Deer Lake is exactly the community this line was designed to reach.
            </p>

            {/* Flow diagram */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {flowSteps.map((step, i) => (
                <div key={step.label}>
                  <div style={{
                    background: i === 2 ? LAKE : i === 3 ? EVERGREEN : "rgba(31,61,46,0.06)",
                    border: `1px solid ${i === 2 ? LAKE : i === 3 ? EVERGREEN : "rgba(31,61,46,0.14)"}`,
                    borderRadius: i === 0 ? "4px 4px 0 0" : i === flowSteps.length - 1 ? "0 0 4px 4px" : 0,
                    padding: "0.1in 0.16in",
                  }}>
                    <p style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: i >= 2 ? CREAM : EVERGREEN,
                      margin: "0 0 0.02in",
                      lineHeight: 1.2,
                    }}>
                      {step.label}
                    </p>
                    <p style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "0.6rem",
                      color: i >= 2 ? "rgba(244,237,224,0.7)" : MUTED,
                      margin: 0,
                      lineHeight: 1.4,
                    }}>
                      {step.sub}
                    </p>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", height: "0.18in", alignItems: "center" }}>
                      <div style={{ width: 1, height: "100%", background: "rgba(31,61,46,0.2)" }} />
                      <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.8rem", color: RUST, position: "absolute" }}>↓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.64rem", fontStyle: "italic", color: MUTED, lineHeight: 1.5, marginTop: "0.12in" }}>
              Grant applications for this supply line are being submitted June 15, 2026. The demand data gathered in Phase 2 is what backs those applications.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(31,61,46,0.12)", flexShrink: 0 }} />

        {/* The urgency statement */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.32in", alignItems: "center" }}>
          <div style={{ background: RUST, borderRadius: 5, padding: "0.2in 0.24in" }}>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "0.06in" }}>
              The deadline
            </p>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "white", margin: 0, lineHeight: 1.2 }}>
              January 2027<br />winter road.
            </p>
          </div>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.65, color: INK, margin: 0 }}>
            The winter road is the supply chain unlock — the moment when bulk delivery replaces air freight and the economics of a community store become real. To get there, Phase 1 needs to begin in summer 2026. The demand data gathered in Phase 2 is what backs the grant applications due June 15. Miss the summer start, and the January 2027 window moves to 2028.
          </p>
        </div>

        {/* Timeline strip */}
        <div style={{ background: "rgba(31,61,46,0.04)", border: "1px solid rgba(31,61,46,0.1)", borderRadius: 5, padding: "0.18in 0.22in" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.52rem", letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, marginBottom: "0.14in" }}>
            The path from here
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.1in" }}>
            {timeline.map((t, i) => (
              <div key={t.phase} style={{
                borderTop: `3px solid ${t.active ? RUST : "rgba(31,61,46,0.2)"}`,
                paddingTop: "0.1in",
                position: "relative",
              }}>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.1rem", fontWeight: 900, color: t.active ? RUST : "rgba(31,61,46,0.18)", margin: "0 0 0.02in", lineHeight: 1 }}>
                  {t.phase}
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.54rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.active ? EVERGREEN : MUTED, margin: "0 0 0.03in" }}>
                  {t.label}
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: t.active ? RUST : MUTED, margin: "0 0 0.04in", fontWeight: t.active ? 600 : 400 }}>
                  {t.period}
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", color: "rgba(31,61,46,0.4)", margin: "0 0 0.04in" }}>
                  {t.duration}
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: MUTED, margin: 0, lineHeight: 1.45 }}>
                  {t.note}
                </p>
                {i < timeline.length - 1 && (
                  <span style={{ position: "absolute", right: "-0.1in", top: "0.1in", fontFamily: "Fraunces, Georgia, serif", fontSize: "0.9rem", color: "rgba(31,61,46,0.2)" }}>→</span>
                )}
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
          Headwaters Development Services · Wabigoon, Ontario — Treaty 3 Territory
        </p>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.65)", margin: 0, letterSpacing: "0.04em" }}>
          ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654
        </p>
      </div>

    </div>
  );
}

export default function DeerLakeWhyNow() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-deer-lake-why-now.pdf"
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <DeerLakeWhyNowPage />
      </div>
    </>
  );
}

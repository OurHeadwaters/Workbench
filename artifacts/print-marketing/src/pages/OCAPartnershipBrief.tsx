import type { CSSProperties } from "react";
import { useLocation } from "wouter";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#1a1a1a";

const base = import.meta.env.BASE_URL;

function useOrgName(): string {
  const [location] = useLocation();
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  return params.get("org") || params.get("community") || "";
}

function buildPlainText(orgName?: string): string {
  const addressee = orgName ? orgName : "Ontario Co-operative Association";
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    `Partnership Brief — Ontario Co-operatives & CDP`,
    "June 2026",
    "",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
    "",
    "---",
    "",
    "PREPARED FOR",
    addressee,
    "",
    "---",
    "",
    "WHAT THE PLATFORM SUITE IS",
    "",
    "Headwaters has built a suite of three interconnected digital platforms for community and co-operative food systems — Market Mosaic, 807 Benefits, and Grants Finder. Each was built solo using AI-assisted development, which means the cost of building was a fraction of what a traditional software team would have charged. The result: production-grade tools that are already deployed and running.",
    "",
    "These platforms are not prototypes. They are live infrastructure — built for northern and Indigenous communities in Ontario, and now ready to license to co-operatives and umbrella organizations at provincial scale.",
    "",
    "THE TWO-TIER MODEL",
    "",
    "Tier 1 — Consulting Engagement",
    "For organizations that want a practitioner at the table. Six-week planning engagement at $28,000 flat. No retainer, no long commitment. Scope design, governance architecture, and handoff.",
    "",
    "Tier 2 — Platform License",
    "For organizations that want to run the tools themselves. Annual license fee + development retainer. OCA acts as operator. Member co-ops access Market Mosaic, 807 Benefits, and Grants Finder under the OCA umbrella — no per-co-op software build required.",
    "",
    "---",
    "",
    "THE CDP PROOF POINT",
    "",
    "In 2024, Headwaters received $20,000 through the CDP (Co-operative Development Program) to build the 807 Benefits platform for a single co-op. That engagement produced a full-featured member benefits platform — built solo, in weeks, at a fraction of normal cost.",
    "",
    "The ask now: take that same platform to provincial scale. One CDP investment funds the infrastructure that serves every OCA member co-op, not just one.",
    "",
    "---",
    "",
    "THE PROPOSED PARTNERSHIP",
    "",
    "OCA as Operating Partner — OCA holds the platform license, sets the member pricing, and manages co-op onboarding. Headwaters provides the technical layer and ongoing development retainer.",
    "",
    "What this means for OCA members: access to Market Mosaic (member markets and local food logistics), 807 Benefits (member rewards and equity tracking), and Grants Finder (funding intelligence for northern co-ops) — all under a single OCA agreement.",
    "",
    "---",
    "",
    "THE ASK",
    "",
    "A meeting. Fifteen minutes to show you what's running and what provincial scale looks like in practice. If it fits, we talk about what a formal OCA operating partnership looks like. If it doesn't fit, you've lost fifteen minutes.",
    "",
    "The work is ready. We are looking for the right table to sit at.",
    "",
    "---",
    "",
    "Headwaters Development Services · Wabigoon, Ontario — Treaty 3 Territory",
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

const platformItems = [
  {
    name: "Market Mosaic",
    desc: "Member market coordination, local food listings, and producer-to-buyer logistics for northern communities.",
  },
  {
    name: "807 Benefits",
    desc: "Member rewards and equity tracking platform — built for co-ops that want to run a member benefits program without a full tech team.",
  },
  {
    name: "Grants Finder",
    desc: "Funding intelligence curated for northern and Indigenous co-operatives — surfaces active grants, deadlines, and eligibility notes.",
  },
];

export function OCAPartnershipBriefPage({ orgName }: { orgName?: string }) {
  const addressee = orgName || "Ontario Co-operative Association";

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
            Partnership Brief — Ontario Co-operatives &amp; CDP
          </p>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.65rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            Provincial Platform Licensing<br />
            <span style={{ fontWeight: 400, fontStyle: "italic", fontSize: "1.3rem" }}>A proposal for {addressee}</span>
          </h1>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", margin: 0 }}>June 2026</p>
        </div>
      </div>

      {/* Rust rule */}
      <div style={{ height: "0.055in", background: RUST, flexShrink: 0 }} />

      {/* Two-column body */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>

        {/* Left column */}
        <div style={{ padding: "0.42in 0.38in 0.32in 0.65in", borderRight: "1px solid rgba(31,61,46,0.12)", display: "flex", flexDirection: "column", gap: "0.32in" }}>

          {/* What the platform suite is */}
          <section>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.12in" }}>
              What We've Built
            </p>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: EVERGREEN, lineHeight: 1.25, marginBottom: "0.16in", letterSpacing: "-0.01em" }}>
              Three platforms. Already deployed. Ready to license at provincial scale.
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.68, color: INK, marginBottom: "0.18in" }}>
              Headwaters built Market Mosaic, 807 Benefits, and Grants Finder using AI-assisted solo development — which means production-grade tools at a fraction of traditional software costs. These are live and running. Not proposals.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.14in" }}>
              {platformItems.map((p, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${i === 0 ? RUST : "rgba(31,61,46,0.2)"}`, paddingLeft: "0.16in" }}>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.78rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.04in" }}>{p.name}</p>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.68rem", color: MUTED, margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CDP proof point */}
          <section>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.12in" }}>
              The CDP Proof Point
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.68, color: INK, marginBottom: "0.12in" }}>
              In 2024, Headwaters received $20,000 through CDP to build 807 Benefits for a single co-op. That engagement produced a full-featured member platform — built solo, in weeks, at a fraction of normal cost.
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.68, color: INK }}>
              The ask now: one CDP investment at provincial scale funds infrastructure every OCA member co-op can access — not just one.
            </p>
          </section>

          {/* Fee block */}
          <div style={{ background: EVERGREEN, borderRadius: 5, padding: "0.22in 0.28in", marginTop: "auto" }}>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.06in" }}>
              Two paths to engage
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.12in" }}>
              <div>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", fontWeight: 700, color: CREAM, margin: "0 0 0.03in", lineHeight: 1.1 }}>$28,000 flat</p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.72)", margin: 0 }}>Consulting engagement · 6 weeks · scope + plan + handoff</p>
              </div>
              <div style={{ height: 1, background: "rgba(244,237,224,0.15)" }} />
              <div>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", fontWeight: 700, color: CREAM, margin: "0 0 0.03in", lineHeight: 1.1 }}>Annual license + retainer</p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.72)", margin: 0 }}>Platform licensing · OCA as operator · all three platforms</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right column */}
        <div style={{ padding: "0.42in 0.65in 0.32in 0.38in", display: "flex", flexDirection: "column", gap: "0.28in" }}>

          <div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.12in" }}>
              The Proposed Partnership
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.74rem", lineHeight: 1.6, color: MUTED, marginBottom: "0.18in" }}>
              OCA holds the platform license, sets member pricing, and manages co-op onboarding. Headwaters provides the technical layer and ongoing development retainer.
            </p>
          </div>

          {/* Partnership structure items */}
          {[
            {
              role: "OCA as Operating Partner",
              detail: "OCA Agreement covers all member co-ops — no per-co-op software build or procurement required.",
            },
            {
              role: "Member Co-ops",
              detail: "Access Market Mosaic, 807 Benefits, and Grants Finder under the OCA umbrella. Governed by your existing member agreements.",
            },
            {
              role: "Headwaters",
              detail: "Technical infrastructure, ongoing development retainer, and practitioner support for deployment and onboarding.",
            },
            {
              role: "CDP Funding Bridge",
              detail: "$75–100k grant covers platform hardening, OCA onboarding infrastructure, and the first-year retainer — so member co-ops access the tools at no upfront cost.",
            },
          ].map((item, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${i === 0 ? RUST : "rgba(31,61,46,0.2)"}`, paddingLeft: "0.16in" }}>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.78rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.04in" }}>{item.role}</p>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.68rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>{item.detail}</p>
            </div>
          ))}

          {/* The ask */}
          <section style={{ marginTop: "auto" }}>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.12in" }}>
              The Ask
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.68, color: INK, marginBottom: "0.12in" }}>
              A meeting. Fifteen minutes to show what's running and what provincial scale looks like in practice.
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.68, color: INK }}>
              If it fits, we talk about what a formal OCA operating partnership looks like. The work is ready. We are looking for the right table.
            </p>
          </section>

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

export default function OCAPartnershipBrief() {
  const orgName = useOrgName();

  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-oca-partnership-brief.pdf"
        onCopyPlainText={() => buildPlainText(orgName)}
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <OCAPartnershipBriefPage orgName={orgName} />
      </div>
    </>
  );
}

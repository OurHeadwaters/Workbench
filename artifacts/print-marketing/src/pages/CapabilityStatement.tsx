import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

export default function CapabilityStatement() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-capability-statement.pdf"
        pdfApiPath="/api/pdf/capability-statement.pdf"
      />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: 0, overflow: "hidden", background: "var(--cream)", minHeight: "11in" }}
      >
        <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ background: "var(--evergreen)", padding: "0.5in 0.65in 0.4in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.15rem" }}>
              Headwaters Development Services
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.8rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.05, marginBottom: "0.15rem", letterSpacing: "-0.02em" }}>
              Capability Statement
            </h1>
            <div style={{ width: "1.5in", height: 2, background: "var(--rust)", margin: "0.2rem 0 0.3rem" }} />
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem", fontStyle: "italic", color: "rgba(244,237,224,0.8)", lineHeight: 1.5, maxWidth: "5in" }}>
              Practitioner-built tools for northern communities. Shipped, not proposed.
            </p>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.38in 0.65in 0.25in", display: "flex", flexDirection: "column", gap: "0.28in" }}>

            {/* Who we are */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.12rem" }}>
                Who we are
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.83rem", color: "var(--ink)", lineHeight: 1.6 }}>
                Headwaters is a Northwestern Ontario practice led by Bobbie Parr — a community development practitioner, founder of Parr's Jars, and founding board member of the 807 Food Co-op. Headwaters builds operational plans, digital platforms, and custom internal tools for band councils and community organizations in northern Ontario. The work is plain-language, dollar-honest, and designed to run without a consultant in the room.
              </p>
            </section>

            {/* Services */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.16rem" }}>
                Core services
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.25in" }}>
                {[
                  {
                    num: "01",
                    title: "Community Store Planning",
                    desc: "Full feasibility to day-one operations — governance structures, supply chain, staffing and training, financing, and band-council handoff. Six phases, plain language, open numbers.",
                  },
                  {
                    num: "02",
                    title: "Co-op Membership Platforms",
                    desc: "Custom web platforms for community-owned co-ops — member registration, producer onboarding, board admin, AGM tools. Governance-first. You own the platform outright.",
                  },
                  {
                    num: "03",
                    title: "Custom Internal Tools",
                    desc: "Purpose-built software for band councils and community organizations — replacing paper and spreadsheet workflows with tools your team actually uses.",
                  },
                ].map((s) => (
                  <div key={s.num} style={{ borderTop: "2px solid var(--rust)", paddingTop: "0.18in" }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--rust)", marginBottom: "0.05rem" }}>{s.num}</p>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.1rem" }}>{s.title}</h2>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.73rem", color: "var(--muted)", lineHeight: 1.55 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Case studies */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.16rem" }}>
                Selected work
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.22in" }}>
                {[
                  {
                    title: "Parr's Jars — Rebrand",
                    type: "Brand identity",
                    problem: "Original brand couldn't carry both a preserves business and a development consulting practice.",
                    outcome: "Dual-identity brand system — wordmarks, colour system, copy architecture, and parrsjars.ca — that works for a market table and a band council office.",
                  },
                  {
                    title: "807 Food Co-op — Membership Platform",
                    type: "Platform delivery · Founding board",
                    problem: "Founding board needed a working platform — member registration, equity tracking, governance tooling — before the co-op could open to members.",
                    outcome: "Full member portal, producer onboarding, board admin panel, and AGM tools. Platform ready for June launch. Board owns it outright — no licensing fees.",
                  },
                ].map((cs) => (
                  <div
                    key={cs.title}
                    style={{ background: "white", border: "1px solid rgba(31,61,46,0.12)", borderRadius: 5, padding: "0.18in 0.2in" }}
                  >
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.06rem" }}>{cs.type}</p>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.1rem" }}>{cs.title}</h3>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.71rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "0.08rem" }}>
                      <strong style={{ color: "var(--ink)" }}>Problem:</strong> {cs.problem}
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.71rem", color: "var(--muted)", lineHeight: 1.5 }}>
                      <strong style={{ color: "var(--ink)" }}>Outcome:</strong> {cs.outcome}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Rate */}
            <div style={{ background: "var(--rust)", borderRadius: 5, padding: "0.22in 0.3in", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", marginBottom: "0.06rem" }}>
                  Engagement terms
                </p>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "0.1rem" }}>
                  Trial period, not a contract
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                  The usual first step is a six-week bounded scope at $175/hr. Stop at any point. No retainer, no long commitment. If the fit is right, it continues. If not, you leave with something useful.
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "rgba(255,255,255,0.6)", marginTop: "0.06rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  All rates CAD · excludes HST
                </p>
              </div>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$175</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>per hour</p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div style={{ padding: "0.25in 0.65in 0.35in", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(31,61,46,0.12)" }}>
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>Headwaters Development Services</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)" }}>Bobbie Parr · practitioner · Dryden, Ontario</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)" }}>bobbie@ourheadwaters.ca</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)" }}>ourheadwaters.ca</p>
              </div>
              <QRCodeStamp />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

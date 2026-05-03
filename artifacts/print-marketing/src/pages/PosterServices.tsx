import { Link } from "wouter";

function PrintNav() {
  return (
    <div className="no-print screen-nav">
      <Link href="/">← Back to suite</Link>
      <button className="btn-print" onClick={() => window.print()}>
        🖨 Print this page
      </button>
    </div>
  );
}

const services = [
  {
    num: "01",
    title: "Community Store Planning",
    desc: "From feasibility to day-one operations — governance structures, inventory systems, community ownership models, and band-council alignment. We've done it. We can help you do it.",
    bullets: ["Feasibility & funding strategy", "Store layout & supply chain", "Staff hiring & training plans", "Point-of-sale & bookkeeping setup"],
  },
  {
    num: "02",
    title: "Co-op Membership Platforms",
    desc: "Custom web platforms that let communities manage member shares, track equity, and run transparent governance — built for the realities of remote and Indigenous communities.",
    bullets: ["Member registration & equity tracking", "Governance portals", "Plain-language financial reporting", "Mobile-friendly, works on slow connections"],
  },
  {
    num: "03",
    title: "Custom Internal Tools",
    desc: "Bespoke software for band councils, health authorities, and community organizations — replacing paper and spreadsheet workflows with systems that actually fit the way your team works.",
    bullets: ["Intake & case management systems", "Financial reporting dashboards", "Document management & workflows", "Integration with existing systems"],
  },
];

export default function PosterServices() {
  return (
    <>
      <PrintNav />
      <div className="print-page" style={{ padding: 0, overflow: "hidden", background: "var(--cream)", minHeight: "11in" }}>
        <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

          {/* Header block */}
          <div style={{ background: "var(--evergreen)", padding: "0.5in 0.65in 0.4in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.15rem" }}>
              Headwaters Development Services
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3.2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.05, marginBottom: "0.15rem", letterSpacing: "-0.02em" }}>
              Building Capacity<br />in Northern Communities
            </h1>
            <div style={{ width: "2in", height: 2, background: "var(--rust)", margin: "0.2rem 0 0.3rem" }} />
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(244,237,224,0.8)", lineHeight: 1.5, maxWidth: "5.5in" }}>
              We partner with band councils, Indigenous businesses, and northern contractors to design systems, software, and strategies that work — and keep working.
            </p>
          </div>

          {/* Services */}
          <div style={{ flex: 1, padding: "0.4in 0.65in 0.3in", display: "flex", flexDirection: "column", gap: "0.28in" }}>
            {services.map((s) => (
              <div key={s.num} style={{ display: "grid", gridTemplateColumns: "0.4in 1fr", gap: "0.3in", alignItems: "start" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 900, color: "var(--rust)", lineHeight: 1, paddingTop: "0.05rem" }}>
                  {s.num}
                </div>
                <div>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.15rem" }}>{s.title}</h2>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.55, marginBottom: "0.2rem" }}>{s.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.2rem 0.5rem" }}>
                    {s.bullets.map((b) => (
                      <span key={b} style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--ink)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <span style={{ color: "var(--rust)", fontWeight: 700 }}>·</span>{b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trial offer callout */}
          <div style={{ margin: "0 0.65in", background: "var(--rust)", borderRadius: 6, padding: "0.3in 0.4in", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: "0.1rem" }}>
                Pilot Program
              </p>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 700, color: "white", marginBottom: "0.15rem" }}>
                $25,000 · 8-Week Engagement
              </h3>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                Structured eight-week engagement to scope, design, and deliver the first phase of your project. No long-term commitment required. Includes discovery, delivery, and a handoff document your team can act on immediately.
              </p>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$175</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>per hour<br />thereafter</p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "0.3in 0.65in 0.4in", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.05rem" }}>Headwaters Development Services</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }}>headwatersdevelopment.ca</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }}>hello@headwatersdevelopment.ca</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "rgba(107,118,101,0.65)" }}>Dryden, Ontario</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

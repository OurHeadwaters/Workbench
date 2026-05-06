import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const StoreSvg = () => (
  <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <rect x="20" y="55" width="120" height="65" rx="3" fill="none" stroke="var(--evergreen)" strokeWidth="2.5"/>
    <rect x="60" y="80" width="40" height="40" rx="2" fill="var(--rust)" opacity="0.18"/>
    <rect x="67" y="87" width="26" height="33" rx="1" fill="var(--rust)" opacity="0.35"/>
    <path d="M10 55 L30 20 L130 20 L150 55" fill="none" stroke="var(--evergreen)" strokeWidth="2.5" strokeLinejoin="round"/>
    <rect x="30" y="20" width="100" height="35" rx="0" fill="var(--rust)" opacity="0.12"/>
    <rect x="25" y="63" width="28" height="22" rx="2" fill="none" stroke="var(--evergreen)" strokeWidth="1.8"/>
    <rect x="107" y="63" width="28" height="22" rx="2" fill="none" stroke="var(--evergreen)" strokeWidth="1.8"/>
    <line x1="80" y1="55" x2="80" y2="20" stroke="var(--rust)" strokeWidth="1.5" opacity="0.5"/>
    <circle cx="80" cy="38" r="6" fill="var(--rust)" opacity="0.6"/>
    <line x1="10" y1="120" x2="150" y2="120" stroke="var(--evergreen)" strokeWidth="2"/>
    <rect x="38" y="30" width="35" height="12" rx="2" fill="var(--rust)" opacity="0.25"/>
    <rect x="87" y="30" width="35" height="12" rx="2" fill="var(--rust)" opacity="0.25"/>
  </svg>
);

const PlatformSvg = () => (
  <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <circle cx="80" cy="65" r="22" fill="none" stroke="var(--evergreen)" strokeWidth="2.5"/>
    <circle cx="80" cy="65" r="8" fill="var(--rust)" opacity="0.55"/>
    <circle cx="30" cy="30" r="14" fill="none" stroke="var(--evergreen)" strokeWidth="2"/>
    <circle cx="30" cy="30" r="5" fill="var(--rust)" opacity="0.4"/>
    <circle cx="130" cy="30" r="14" fill="none" stroke="var(--evergreen)" strokeWidth="2"/>
    <circle cx="130" cy="30" r="5" fill="var(--rust)" opacity="0.4"/>
    <circle cx="30" cy="100" r="14" fill="none" stroke="var(--evergreen)" strokeWidth="2"/>
    <circle cx="30" cy="100" r="5" fill="var(--rust)" opacity="0.4"/>
    <circle cx="130" cy="100" r="14" fill="none" stroke="var(--evergreen)" strokeWidth="2"/>
    <circle cx="130" cy="100" r="5" fill="var(--rust)" opacity="0.4"/>
    <line x1="44" y1="36" x2="60" y2="52" stroke="var(--evergreen)" strokeWidth="1.5" opacity="0.6"/>
    <line x1="116" y1="36" x2="100" y2="52" stroke="var(--evergreen)" strokeWidth="1.5" opacity="0.6"/>
    <line x1="44" y1="94" x2="60" y2="78" stroke="var(--evergreen)" strokeWidth="1.5" opacity="0.6"/>
    <line x1="116" y1="94" x2="100" y2="78" stroke="var(--evergreen)" strokeWidth="1.5" opacity="0.6"/>
    <circle cx="80" cy="20" r="10" fill="none" stroke="var(--rust)" strokeWidth="1.8" opacity="0.5"/>
    <circle cx="80" cy="110" r="10" fill="none" stroke="var(--rust)" strokeWidth="1.8" opacity="0.5"/>
    <line x1="80" y1="30" x2="80" y2="43" stroke="var(--rust)" strokeWidth="1.5" opacity="0.5"/>
    <line x1="80" y1="87" x2="80" y2="100" stroke="var(--rust)" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

const ToolsSvg = () => (
  <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <rect x="18" y="22" width="124" height="86" rx="6" fill="none" stroke="var(--evergreen)" strokeWidth="2.5"/>
    <rect x="18" y="22" width="124" height="20" rx="6" fill="var(--evergreen)" opacity="0.12"/>
    <circle cx="31" cy="32" r="3.5" fill="var(--rust)" opacity="0.7"/>
    <circle cx="44" cy="32" r="3.5" fill="var(--rust)" opacity="0.4"/>
    <circle cx="57" cy="32" r="3.5" fill="var(--evergreen)" opacity="0.35"/>
    <rect x="30" y="55" width="28" height="4" rx="2" fill="var(--rust)" opacity="0.55"/>
    <rect x="30" y="65" width="42" height="4" rx="2" fill="var(--evergreen)" opacity="0.4"/>
    <rect x="30" y="75" width="20" height="4" rx="2" fill="var(--rust)" opacity="0.3"/>
    <rect x="30" y="85" width="35" height="4" rx="2" fill="var(--evergreen)" opacity="0.4"/>
    <rect x="30" y="95" width="25" height="4" rx="2" fill="var(--rust)" opacity="0.25"/>
    <rect x="90" y="52" width="42" height="48" rx="4" fill="var(--rust)" fillOpacity="0.1" stroke="var(--rust)" strokeWidth="1.5" strokeOpacity="0.4"/>
    <rect x="97" y="62" width="28" height="3.5" rx="1.5" fill="var(--rust)" opacity="0.5"/>
    <rect x="97" y="70" width="22" height="3.5" rx="1.5" fill="var(--evergreen)" opacity="0.45"/>
    <rect x="97" y="78" width="26" height="3.5" rx="1.5" fill="var(--rust)" opacity="0.35"/>
    <rect x="97" y="86" width="18" height="3.5" rx="1.5" fill="var(--evergreen)" opacity="0.4"/>
  </svg>
);

const serviceImages = [StoreSvg, PlatformSvg, ToolsSvg];

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
      <PrintNav targetId="pdf-target" filename="headwaters-poster-services.pdf" />
      <div id="pdf-target" className="print-page page-letter" style={{ padding: 0, overflow: "hidden", background: "var(--cream)", minHeight: "11in" }}>
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
            {services.map((s, i) => {
              const Img = serviceImages[i];
              return (
                <div key={s.num} style={{ display: "grid", gridTemplateColumns: "0.4in 1fr 1.55in", gap: "0.3in", alignItems: "center" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 900, color: "var(--rust)", lineHeight: 1, paddingTop: "0.05rem", alignSelf: "start" }}>
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
                  <div style={{ width: "1.55in", height: "1.15in", opacity: 0.85 }}>
                    <Img />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trial offer callout */}
          <div style={{ margin: "0 0.65in", background: "var(--rust)", borderRadius: 6, padding: "0.3in 0.4in", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: "0.1rem" }}>
                Pilot Program
              </p>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 700, color: "white", marginBottom: "0.15rem" }}>
                $25,000 · 6-Week Engagement
              </h3>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                Structured six-week engagement to scope, design, and deliver the first phase of your project. No long-term commitment required. Includes discovery, delivery, and a handoff document your team can act on immediately.
              </p>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$175</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>per hour<br />thereafter</p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "0.3in 0.65in 0.4in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.05rem" }}>Headwaters Development Services</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }}>ourheadwaters.ca</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }}>bobbie@ourheadwaters.ca</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "rgba(107,118,101,0.65)" }}>Dryden, Ontario</p>
              </div>
              <QRCodeStamp />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

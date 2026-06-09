import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#2b2116";

function buildPlainText(): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "CDP Grant Application Narrative",
    "June 2026",
    "",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
    "",
    "---",
    "",
    "1. EXECUTIVE SUMMARY",
    "",
    "Headwaters Development Services is requesting $75,000–$100,000 from the Co-operative Development Program (CDP) to bring a suite of three production-ready digital platforms — Market Mosaic, 807 Benefits, and Grants Finder — to provincial scale through a partnership with the Ontario Co-operative Association (OCA). These platforms were built at a fraction of traditional software costs using AI-assisted solo development, and are already deployed and running. This grant funds the transition from a single-co-op deployment to province-wide OCA-operated infrastructure.",
    "",
    "---",
    "",
    "2. THE PROBLEM",
    "",
    "Ontario co-operatives — particularly those in northern and remote communities — face three compounding barriers: they cannot afford bespoke software, they cannot access funding intelligence efficiently, and they cannot coordinate local food systems without expensive intermediaries. Each co-op faces these problems independently, rebuilding solutions from scratch or going without.",
    "",
    "The result: duplicated cost, missed grants, and food systems that depend on individual heroics instead of shared infrastructure.",
    "",
    "---",
    "",
    "3. THE SOLUTION — PLATFORM SUITE ALREADY DEPLOYED",
    "",
    "Headwaters has already built the solution. Three platforms are running:",
    "",
    "Market Mosaic — member market coordination, local food listings, and producer-to-buyer logistics. Built for northern communities where geography fragments supply chains.",
    "",
    "807 Benefits — member rewards and equity tracking. Built for co-ops that want to run a member benefits program without a full tech team. CDP-funded in 2024 for a single co-op.",
    "",
    "Grants Finder — funding intelligence curated for northern and Indigenous co-operatives. Surfaces active grants, deadlines, and eligibility notes.",
    "",
    "All three platforms are production-grade. None are prototypes.",
    "",
    "---",
    "",
    "4. PROOF OF EFFICIENCY — SOLO BUILDER + AI, CDP PRECEDENT",
    "",
    "In 2024, Headwaters received $20,000 through CDP to build 807 Benefits for a single co-op. The engagement delivered a full-featured member platform in weeks, at a cost that would typically fund only an initial design sprint with a traditional software team.",
    "",
    "That efficiency was not an anomaly. It is the methodology: AI-assisted solo development, practitioner-led scope design, and community-first handoff architecture. The result is tools that cost less to build and more to the community, because they are built to run without a consultant in the room.",
    "",
    "This grant asks CDP to scale that proof point — not to fund a new experiment, but to bring a proven model to every OCA member co-op.",
    "",
    "---",
    "",
    "5. PROPOSED STRUCTURE — OCA AS OPERATOR",
    "",
    "OCA holds the platform license and acts as the operating partner. Member co-ops access Market Mosaic, 807 Benefits, and Grants Finder under the OCA umbrella — governed by existing member agreements, with no per-co-op software procurement required.",
    "",
    "Headwaters provides the technical infrastructure layer and an ongoing development retainer under OCA's direction.",
    "",
    "This model means one CDP investment in infrastructure — not dozens of per-co-op grants for the same thing.",
    "",
    "---",
    "",
    "6. REQUESTED FUNDING & OUTCOMES",
    "",
    "Requested: $75,000–$100,000",
    "",
    "Deliverables:",
    "— Platform hardening and OCA onboarding infrastructure (Market Mosaic, 807 Benefits, Grants Finder configured for multi-co-op operation under OCA)",
    "— OCA staff training and documentation package",
    "— First-year development retainer to support co-op onboarding",
    "— Pilot cohort of 5–10 OCA member co-ops live on the platform suite",
    "— Public-facing case study and replication guide",
    "",
    "Outcome: OCA member co-ops have access to shared digital infrastructure for the first time — food system coordination, member benefits, and grant intelligence — at no individual co-op software cost.",
    "",
    "---",
    "",
    "7. NEXT STEPS — DEMO + PILOT",
    "",
    "Headwaters is ready to demonstrate all three platforms in a live session. The proposed next step is a 30-minute demo with OCA and CDP staff, followed by a formal pilot agreement and grant application.",
    "",
    "No new software needs to be built to start. The infrastructure is ready.",
    "",
    "---",
    "",
    "Headwaters Development Services · Wabigoon, Ontario — Treaty 3 Territory",
    "Bobbie Parr · practitioner · bobbie@ourheadwaters.ca · 807 220 3654",
    "ourheadwaters.ca",
  ].join("\n");
}

const sections = [
  {
    num: "1",
    title: "Executive Summary",
    content: (
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7 }}>
        Headwaters Development Services is requesting $75,000–$100,000 from CDP to bring three production-ready digital platforms — <strong>Market Mosaic, 807 Benefits,</strong> and <strong>Grants Finder</strong> — to provincial scale through a partnership with the Ontario Co-operative Association (OCA). These platforms are already deployed and running, built at a fraction of traditional software costs using AI-assisted solo development. This grant funds the transition from a single-co-op deployment to province-wide OCA-operated infrastructure.
      </p>
    ),
  },
  {
    num: "2",
    title: "The Problem",
    content: (
      <>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7, marginBottom: "0.1in" }}>
          Ontario co-operatives — particularly those in northern and remote communities — face three compounding barriers: they cannot afford bespoke software, they cannot access funding intelligence efficiently, and they cannot coordinate local food systems without expensive intermediaries.
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7 }}>
          Each co-op faces these problems independently, rebuilding solutions from scratch or going without. The result: duplicated cost, missed grants, and food systems that depend on individual heroics instead of shared infrastructure.
        </p>
      </>
    ),
  },
  {
    num: "3",
    title: "The Solution — Platform Suite Already Deployed",
    content: (
      <>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7, marginBottom: "0.14in" }}>
          Headwaters has already built the solution. Three platforms are running:
        </p>
        {[
          { name: "Market Mosaic", desc: "Member market coordination, local food listings, and producer-to-buyer logistics — built for northern communities where geography fragments supply chains." },
          { name: "807 Benefits", desc: "Member rewards and equity tracking — built for co-ops that want to run a member benefits program without a full tech team. CDP-funded in 2024 for a single co-op." },
          { name: "Grants Finder", desc: "Funding intelligence curated for northern and Indigenous co-operatives — surfaces active grants, deadlines, and eligibility notes." },
        ].map((p) => (
          <div key={p.name} style={{ display: "grid", gridTemplateColumns: "1.2in 1fr", gap: "0.1in", marginBottom: "0.1in" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 600, color: EVERGREEN, margin: 0 }}>{p.name}</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.76rem", color: MUTED, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    num: "4",
    title: "Proof of Efficiency — Solo Builder + AI, CDP Precedent",
    content: (
      <>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7, marginBottom: "0.1in" }}>
          In 2024, Headwaters received $20,000 through CDP to build 807 Benefits for a single co-op. The engagement delivered a full-featured member platform in weeks — at a cost that would typically fund only an initial design sprint with a traditional software team.
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7 }}>
          That efficiency is the methodology: AI-assisted solo development, practitioner-led scope design, and community-first handoff architecture. This grant asks CDP to scale that proof point — not to fund a new experiment, but to bring a proven model to every OCA member co-op.
        </p>
      </>
    ),
  },
];

const rightSections = [
  {
    num: "5",
    title: "Proposed Structure — OCA as Operator",
    content: (
      <>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7, marginBottom: "0.1in" }}>
          OCA holds the platform license and acts as the operating partner. Member co-ops access Market Mosaic, 807 Benefits, and Grants Finder under the OCA umbrella — governed by existing member agreements, with no per-co-op software procurement required.
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7 }}>
          Headwaters provides the technical infrastructure layer and ongoing development retainer under OCA's direction. One CDP investment in infrastructure — not dozens of per-co-op grants for the same thing.
        </p>
      </>
    ),
  },
  {
    num: "6",
    title: "Requested Funding & Outcomes",
    content: (
      <>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7, marginBottom: "0.12in" }}>
          <strong>Requested: $75,000–$100,000</strong>
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: RUST, marginBottom: "0.08in" }}>
          Deliverables
        </p>
        {[
          "Platform hardening and OCA onboarding infrastructure — Market Mosaic, 807 Benefits, Grants Finder configured for multi-co-op operation under OCA",
          "OCA staff training and documentation package",
          "First-year development retainer to support co-op onboarding",
          "Pilot cohort of 5–10 OCA member co-ops live on the platform suite",
          "Public-facing case study and replication guide",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "0.1in", marginBottom: "0.07in" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.78rem", color: RUST, flexShrink: 0, marginTop: "0.01in" }}>—</span>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: MUTED, lineHeight: 1.55, margin: 0 }}>{item}</p>
          </div>
        ))}
        <div style={{ marginTop: "0.14in", background: "rgba(31,61,46,0.05)", border: "1px solid rgba(31,61,46,0.12)", borderRadius: 4, padding: "0.12in 0.16in" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: EVERGREEN, lineHeight: 1.6, margin: 0 }}>
            <strong>Outcome:</strong> OCA member co-ops have access to shared digital infrastructure — food system coordination, member benefits, and grant intelligence — at no individual co-op software cost.
          </p>
        </div>
      </>
    ),
  },
  {
    num: "7",
    title: "Next Steps — Demo + Pilot",
    content: (
      <>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7, marginBottom: "0.1in" }}>
          Headwaters is ready to demonstrate all three platforms in a live session. The proposed next step is a 30-minute demo with OCA and CDP staff, followed by a formal pilot agreement and grant application.
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.7 }}>
          No new software needs to be built to start. The infrastructure is ready.
        </p>
      </>
    ),
  },
];

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "0.28in" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.14in", marginBottom: "0.1in" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 700, color: RUST, flexShrink: 0 }}>
          {num}.
        </span>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", fontWeight: 700, color: EVERGREEN, lineHeight: 1.3, margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ paddingLeft: "0.3in" }}>
        {children}
      </div>
    </section>
  );
}

export function CDPGrantNarrativePage() {
  return (
    <div
      className="print-page page-letter"
      style={{ padding: 0, overflow: "hidden", background: CREAM, minHeight: "11in" }}
    >
      <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

        {/* Header band */}
        <div style={{
          background: EVERGREEN,
          padding: "0.35in 0.65in 0.3in",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "0.5in",
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "0.08in" }}>
              Development Services
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, color: CREAM, lineHeight: 1, letterSpacing: "-0.015em" }}>
              Headwaters
            </h1>
            <div style={{ width: "0.7in", height: 2, background: RUST, margin: "0.1in 0 0.07in" }} />
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.58rem", fontStyle: "italic", color: "rgba(244,237,224,0.65)" }}>
              CDP Grant Application Narrative — June 2026
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {["bobbie@ourheadwaters.ca", "807 220 3654 · text preferred", "ourheadwaters.ca", "Wabigoon, Ontario"].map((line) => (
              <p key={line} style={{ fontFamily: "var(--font-sans)", fontSize: "0.55rem", color: "rgba(244,237,224,0.65)", lineHeight: 1.7, letterSpacing: "0.01em" }}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Memo header block */}
        <div style={{ flex: 1, padding: "0.38in 0.65in 0.25in", display: "flex", flexDirection: "column" }}>

          <div style={{ borderLeft: `3px solid ${RUST}`, paddingLeft: "0.18in", marginBottom: "0.3in" }}>
            {[
              { label: "To", value: "Co-operative Development Program (CDP) · Agriculture and Agri-Food Canada" },
              { label: "From", value: "Headwaters Development Services · Bobbie Parr, Practitioner" },
              { label: "Via", value: "Ontario Co-operative Association (OCA), proposed operating partner" },
              { label: "Date", value: "June 2026" },
              { label: "Re", value: "Provincial Platform Licensing — Market Mosaic, 807 Benefits, Grants Finder · $75,000–$100,000 ask" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "0.6in 1fr", gap: "0.1in", marginBottom: "0.07in" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED, paddingTop: "0.01in" }}>
                  {label}:
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: INK, lineHeight: 1.5, fontWeight: label === "Re" ? 600 : 400 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(31,61,46,0.15)", marginBottom: "0.3in" }} />

          {/* Two-column sections */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.38in" }}>
            <div>
              {sections.map((s) => (
                <Section key={s.num} num={s.num} title={s.title}>
                  {s.content}
                </Section>
              ))}
            </div>
            <div>
              {rightSections.map((s) => (
                <Section key={s.num} num={s.num} title={s.title}>
                  {s.content}
                </Section>
              ))}
            </div>
          </div>

          {/* Prepared by */}
          <div style={{ marginTop: "auto" }}>
            <div style={{ height: 1, background: "rgba(31,61,46,0.15)", marginBottom: "0.2in" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: "0.05rem" }}>
                  Prepared by
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 600, color: EVERGREEN, marginBottom: "0.02rem" }}>
                  Bobbie Parr
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.06em", color: MUTED }}>
                  Practitioner · Headwaters Development Services
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: MUTED, marginTop: "0.02rem" }}>
                  Wabigoon, Ontario — Treaty 3 Territory
                </p>
              </div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.62rem", fontStyle: "italic", color: MUTED }}>
                ourheadwaters.ca
              </p>
            </div>
          </div>
        </div>

        {/* Footer rule */}
        <div style={{ height: "0.12in", background: EVERGREEN, flexShrink: 0 }} />
      </div>
    </div>
  );
}

export default function CDPGrantNarrative() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-cdp-grant-narrative.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <CDPGrantNarrativePage />
      </div>
    </>
  );
}

import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";
import { LetterPageStage } from "../components/LetterPageStage";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const GOLD = "#d4a017";
const INK = "#2b2116";
const MUTED = "#5f6d60";

const PAGE: CSSProperties = {
  width: "8.5in",
  height: "11in",
  background: CREAM,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontFamily: "var(--font-sans)",
  color: INK,
};

const offers = [
  {
    number: "01",
    title: "Governance\nContinuity",
    audience: "Co-ops & organizations",
    status: "Available first conversation",
    desc: "A bounded operating layer for the knowledge a board, manager, or community team needs to carry forward: roles, decisions, working practices, and the handoff.",
    outputs: ["One useful operating layer", "Named ownership and handoff path", "Exportable working record"],
    accent: RUST,
  },
  {
    number: "02",
    title: "Care Continuity",
    audience: "Family Team Plan",
    status: "Emerging / pilot",
    desc: "A practical shared plan for a family and its care team. The work keeps responsibilities, context, uncertainty, and next steps visible without replacing human judgment.",
    outputs: ["Shared care context", "Clear roles and next steps", "Family-controlled record"],
    accent: GOLD,
  },
  {
    number: "03",
    title: "Sovereign Ops",
    audience: "AI continuity",
    status: "Roadmap / pilot",
    desc: "A continuity layer for organizations working with AI: source meaning remains visible, people remain responsible, and the organization keeps its vocabulary and way out.",
    outputs: ["Bounded AI working layer", "Human review points", "Ownership and export path"],
    accent: "#557c68",
  },
];

function buildPlainText(): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "Continuity Offers — Fall 2026 planning copy",
    "",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca",
    "",
    "BUILD CONTINUITY THAT SURVIVES CHANGE",
    "",
    "Headwaters helps organizations preserve operating knowledge, human authority, and practical capacity through bounded, handoff-ready digital work.",
    "",
    "THREE FIRST-CONVERSATION OFFERS",
    "",
    "01 · GOVERNANCE CONTINUITY — CO-OPS & ORGANIZATIONS",
    "A bounded operating layer for the knowledge a board, manager, or community team needs to carry forward: roles, decisions, working practices, and the handoff.",
    "Outputs: one useful operating layer; named ownership and handoff path; exportable working record.",
    "",
    "02 · CARE CONTINUITY / FAMILY TEAM PLAN — EMERGING / PILOT",
    "A practical shared plan for a family and its care team. Responsibilities, context, uncertainty, and next steps stay visible without replacing human judgment.",
    "Outputs: shared care context; clear roles and next steps; family-controlled record.",
    "",
    "03 · SOVEREIGN OPS — AI CONTINUITY · ROADMAP / PILOT",
    "A continuity layer for organizations working with AI: source meaning remains visible, people remain responsible, and the organization keeps its vocabulary and way out.",
    "Outputs: bounded AI working layer; human review points; ownership and export path.",
    "",
    "TWO SEPARATE ANNUAL ENGAGEMENTS — WORKING POLICY",
    "Year 1: $20,000 CAD for Codetry plus the base build using the current strategic plan.",
    "Year 2: a separate $20,000 CAD engagement for an additional layer plus a new annual strategic plan supporting board and training implementation.",
    "The normal $6,000 annual operating fee is waived only during a qualifying active annual engagement; it is $0 during that period and is not added to Year 2.",
    "Proposed grant-supported project work only; no award, sponsorship, or unrestricted operating revenue is implied.",
    "Expanded care pilots, regulated workflows, integrations, migrations, research, and sensitive data are scoped separately.",
    "",
    "THE WORKING BOUNDARY",
    "AI prepares; people remain responsible. Source meaning and uncertainty stay visible. Organizations retain their vocabulary, ownership, export path, and ability to leave.",
    "",
    "SAFE NEXT STEP",
    "Request a budgetary scope conversation at bobbie@ourheadwaters.ca. This is a starting conversation, not a commitment.",
    "",
    "Headwaters Development Services · Northern Ontario",
    "Planning copy for fall 2026 conversations; no deadline implied.",
  ].join("\n");
}

function OfferCard({ offer }: { offer: (typeof offers)[number] }) {
  return (
    <article
      data-testid={`card-offer-${offer.number}`}
      style={{
        background: "#fbf7ef",
        border: "1px solid rgba(31,61,46,0.17)",
        borderTop: `0.09in solid ${offer.accent}`,
        padding: "0.18in 0.18in 0.16in",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.08in", marginBottom: "0.1in" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: offer.accent, letterSpacing: "0.12em", fontWeight: 600 }}>{offer.number}</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED, textAlign: "right" }}>{offer.status}</span>
      </div>
      <h2 style={{ fontFamily: "var(--font-serif)", whiteSpace: "pre-line", fontSize: "1.08rem", lineHeight: 1.03, color: EVERGREEN, margin: "0 0 0.06in", letterSpacing: "-0.015em" }}>
        {offer.title}
      </h2>
      <p style={{ fontSize: "0.57rem", letterSpacing: "0.06em", textTransform: "uppercase", color: offer.accent, fontWeight: 600, margin: "0 0 0.13in" }}>
        {offer.audience}
      </p>
      <p style={{ fontSize: "0.66rem", lineHeight: 1.48, color: INK, margin: "0 0 0.13in" }}>
        {offer.desc}
      </p>
      <div style={{ borderTop: "1px solid rgba(31,61,46,0.14)", paddingTop: "0.1in", marginTop: "auto" }}>
        <p style={{ fontSize: "0.5rem", letterSpacing: "0.11em", textTransform: "uppercase", color: MUTED, margin: "0 0 0.06in", fontWeight: 600 }}>A first build can leave you with</p>
        <ul style={{ listStyle: "none", display: "grid", gap: "0.045in", margin: 0, padding: 0 }}>
          {offer.outputs.map((output) => (
            <li key={output} style={{ fontSize: "0.59rem", lineHeight: 1.3, color: INK, paddingLeft: "0.13in", position: "relative" }}>
              <span aria-hidden style={{ position: "absolute", left: 0, color: offer.accent }}>—</span>
              {output}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function ContinuityOffersPage() {
  return (
    <div className="page-letter" style={PAGE}>
      <header style={{ background: EVERGREEN, color: CREAM, padding: "0.34in 0.58in 0.27in", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.25in" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.12in", marginBottom: "0.16in" }}>
              <img src={`${import.meta.env.BASE_URL}eagle-mark.svg`} alt="Headwaters" style={{ width: "0.42in", height: "0.34in", objectFit: "contain", opacity: 0.9 }} />
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.76rem", fontWeight: 700, margin: 0, lineHeight: 1.05 }}>Headwaters</p>
                <p style={{ fontSize: "0.41rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,237,224,0.58)", margin: 0 }}>Development Services</p>
              </div>
            </div>
            <p style={{ fontSize: "0.51rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,237,224,0.62)", margin: "0 0 0.07in" }}>First conversations · planning copy</p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.66rem", lineHeight: 1.02, letterSpacing: "-0.02em", margin: 0, maxWidth: "5.1in" }}>
              Build continuity<br />
              <span style={{ fontWeight: 400, fontStyle: "italic", color: "rgba(244,237,224,0.76)" }}>that survives change.</span>
            </h1>
          </div>
          <div style={{ textAlign: "right", paddingTop: "0.04in", flexShrink: 0 }}>
            <p style={{ fontSize: "0.53rem", letterSpacing: "0.09em", textTransform: "uppercase", color: GOLD, margin: 0 }}>Fall 2026</p>
            <p style={{ fontSize: "0.51rem", color: "rgba(244,237,224,0.54)", margin: "0.05in 0 0" }}>No deadline implied</p>
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.77rem", lineHeight: 1.3, color: "rgba(244,237,224,0.78)", margin: "0.19in 0 0", maxWidth: "6.55in" }}>
          Bounded, handoff-ready digital work for organizations preserving operating knowledge, human authority, and practical capacity.
        </p>
      </header>
      <div style={{ height: "0.055in", background: RUST, flexShrink: 0 }} />

      <main style={{ flex: 1, padding: "0.28in 0.58in 0.2in", display: "flex", flexDirection: "column", gap: "0.18in" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.2in" }}>
          <div>
            <p style={{ fontSize: "0.52rem", letterSpacing: "0.15em", textTransform: "uppercase", color: RUST, fontWeight: 600, margin: "0 0 0.04in" }}>Three offers, one working boundary</p>
            <p style={{ fontFamily: "var(--font-serif)", color: EVERGREEN, fontSize: "0.95rem", lineHeight: 1.15, margin: 0 }}>Start with one useful layer. Keep the meaning and the way out.</p>
          </div>
          <p style={{ fontSize: "0.55rem", color: MUTED, lineHeight: 1.35, textAlign: "right", maxWidth: "1.75in", margin: 0 }}>For a first scope conversation, not a promise of product readiness.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.13in", flex: "0 0 3.08in" }}>
          {offers.map((offer) => <OfferCard key={offer.number} offer={offer} />)}
        </div>

        <section style={{ background: EVERGREEN, color: CREAM, padding: "0.2in 0.23in 0.18in", display: "grid", gridTemplateColumns: "1.03fr 1.27fr", gap: "0.26in", alignItems: "center" }}>
          <div>
             <p style={{ fontSize: "0.52rem", letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, margin: "0 0 0.07in", fontWeight: 600 }}>Two separate annual engagements · working policy</p>
            <div style={{ display: "flex", gap: "0.18in", alignItems: "baseline", flexWrap: "wrap" }}>
               <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", lineHeight: 1, margin: 0 }}>Year 1 · $20,000</p>
               <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", lineHeight: 1, margin: 0 }}>Year 2 · $20,000</p>
            </div>
             <p style={{ fontSize: "0.49rem", lineHeight: 1.36, color: "rgba(244,237,224,0.72)", margin: "0.08in 0 0" }}>Year 1: Codetry + base build using the current strategic plan. Year 2: separate additional layer + new annual strategic plan for board and training implementation.</p>
          </div>
          <div style={{ borderLeft: "1px solid rgba(244,237,224,0.24)", paddingLeft: "0.22in" }}>
             <p style={{ fontSize: "0.59rem", lineHeight: 1.4, margin: 0 }}>Normal $6,000 operating fee → $0 only during a qualifying active annual engagement; not added to Year 2.</p>
             <p style={{ fontSize: "0.48rem", lineHeight: 1.35, color: "rgba(244,237,224,0.7)", margin: "0.07in 0 0" }}>Proposed grant-supported project work. No award, sponsorship, or unrestricted operating revenue implied.</p>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.7rem", lineHeight: 1.35, color: "rgba(244,237,224,0.77)", margin: "0.09in 0 0" }}>AI prepares; people remain responsible.</p>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.22in", borderTop: "1px solid rgba(31,61,46,0.15)", paddingTop: "0.16in" }}>
          <div>
            <p style={{ fontSize: "0.51rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, fontWeight: 600, margin: "0 0 0.06in" }}>The working boundary</p>
            <p style={{ fontSize: "0.63rem", lineHeight: 1.48, margin: 0 }}>Source meaning and uncertainty stay visible. Organizations retain their vocabulary, ownership, export path, and ability to leave.</p>
          </div>
          <div style={{ borderLeft: `0.04in solid ${GOLD}`, paddingLeft: "0.16in" }}>
            <p style={{ fontSize: "0.51rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, fontWeight: 600, margin: "0 0 0.06in" }}>Safe next step</p>
            <p style={{ fontSize: "0.63rem", lineHeight: 1.48, margin: 0 }}>Request a budgetary scope conversation at <a data-testid="link-continuity-contact" href="mailto:bobbie@ourheadwaters.ca" style={{ color: EVERGREEN, fontWeight: 700 }}>bobbie@ourheadwaters.ca</a>. A starting conversation, not a commitment.</p>
          </div>
        </section>
      </main>

      <footer style={{ background: "rgba(31,61,46,0.08)", borderTop: "1px solid rgba(31,61,46,0.13)", padding: "0.13in 0.58in", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.2in" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.66rem", fontWeight: 600, color: EVERGREEN, margin: 0 }}>Headwaters Development Services · Northern Ontario</p>
        <p style={{ fontSize: "0.52rem", color: MUTED, margin: 0 }}>ourheadwaters.ca · bobbie@ourheadwaters.ca</p>
      </footer>
    </div>
  );
}

export default function ContinuityOffers() {
  return (
    <>
      <PrintNav targetId="continuity-offers-pdf" filename="headwaters-continuity-offers.pdf" onCopyPlainText={buildPlainText} />
      <LetterPageStage>
        <div id="continuity-offers-pdf" className="letter-page-stage__content">
        <ContinuityOffersPage />
        </div>
      </LetterPageStage>
    </>
  );
}
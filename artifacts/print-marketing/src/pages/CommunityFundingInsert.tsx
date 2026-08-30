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

function buildPlainText(): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "Community Funding Insert — Bounded First Implementation",
    "Fall 2026 planning copy · no deadline implied",
    "",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca",
    "",
    "A CLEAR STARTING POINT FOR A BOARD OR FUNDING CONVERSATION",
    "",
    "For an eligible nonprofit, co-op, or community organization, Headwaters proposes a bounded first implementation: create one useful operating layer, transfer the working knowledge, and leave the organization better prepared for its next funding cycle.",
    "",
    "STARTING BUDGET",
    "$20,000 CAD",
    "Non-binding starting estimate for one bounded first implementation. Final scope and price are confirmed together before work begins.",
    "",
    "INDICATIVE STAGES",
    "1 · Align — confirm the practical problem, people responsible, and a useful first boundary.",
    "2 · Map — make current knowledge, vocabulary, decisions, and uncertainty visible.",
    "3 · Build — create one handoff-ready digital operating layer with the organization.",
    "4 · Handoff — document ownership, export path, care of the work, and the next decision.",
    "",
    "EXPECTED OUTPUTS",
    "One useful operating layer for a bounded operational need.",
    "Plain-language documentation of roles, decisions, working practices, and known uncertainty.",
    "A named ownership and handoff path.",
    "An exportable working record and a clear next-step decision.",
    "",
    "CUSTOMER RESPONSIBILITIES",
    "Name a decision-maker and a small working group; provide access to relevant existing materials; make timely decisions; review drafts; confirm what should and should not be retained; and receive the handoff.",
    "",
    "HEADWATERS RESPONSIBILITIES",
    "Facilitate scope and working sessions; surface source meaning and uncertainty; design and build the bounded operating layer; document the work; make human review points explicit; and support a practical handoff.",
    "",
    "EXCLUDED OR SCOPED SEPARATELY",
    "Expanded care pilots, regulated workflows, integrations, migrations, research, and sensitive data. Ongoing operations, additional operating layers, and work beyond the agreed boundary require a separate scope.",
    "",
    "HUMAN AUTHORITY & PRIVACY",
    "AI may prepare or organize material; people remain responsible for decisions. Source meaning and uncertainty stay visible. The organization retains its vocabulary, ownership, export path, and ability to leave. Sensitive information is not assumed to be in scope.",
    "",
    "DISCLAIMER",
    "This is a non-binding starting estimate. It does not guarantee funding, eligibility, an award, or a particular result. Eligibility and allowable costs depend on the relevant program and the organization’s own confirmation.",
    "",
    "SAFE NEXT STEP",
    "Take this page to a board or funding conversation, then request a budgetary scope conversation at bobbie@ourheadwaters.ca.",
    "Headwaters Development Services · Northern Ontario",
  ].join("\n");
}

function Bullet({ children, color = RUST }: { children: string; color?: string }) {
  return (
    <li style={{ position: "relative", listStyle: "none", paddingLeft: "0.14in", fontSize: "0.6rem", lineHeight: 1.38, marginBottom: "0.045in" }}>
      <span aria-hidden style={{ position: "absolute", left: 0, color }}>—</span>
      {children}
    </li>
  );
}

function SectionHeading({ children }: { children: string }) {
  return <p style={{ fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, fontWeight: 700, margin: "0 0 0.065in" }}>{children}</p>;
}

export function CommunityFundingInsertPage() {
  return (
    <div className="page-letter" style={PAGE}>
      <header style={{ background: EVERGREEN, color: CREAM, padding: "0.3in 0.58in 0.23in", display: "flex", justifyContent: "space-between", gap: "0.28in", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.12in", marginBottom: "0.13in" }}>
            <img src={`${import.meta.env.BASE_URL}eagle-mark.svg`} alt="Headwaters" style={{ width: "0.4in", height: "0.33in", objectFit: "contain", opacity: 0.9 }} />
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.74rem", fontWeight: 700, margin: 0, lineHeight: 1.05 }}>Headwaters</p>
              <p style={{ fontSize: "0.4rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,237,224,0.58)", margin: 0 }}>Development Services</p>
            </div>
          </div>
          <p style={{ fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,237,224,0.62)", margin: "0 0 0.06in" }}>Grant / board-ready planning insert</p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.48rem", lineHeight: 1.03, letterSpacing: "-0.02em", margin: 0 }}>
            A bounded first<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "rgba(244,237,224,0.78)" }}>implementation.</span>
          </h1>
        </div>
        <div style={{ background: GOLD, color: EVERGREEN, padding: "0.14in 0.17in 0.13in", minWidth: "1.62in", alignSelf: "flex-start", marginTop: "0.04in" }}>
          <p style={{ fontSize: "0.47rem", letterSpacing: "0.13em", textTransform: "uppercase", fontWeight: 700, margin: 0 }}>Starting budget</p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.32rem", lineHeight: 1, margin: "0.08in 0 0.03in" }}>$20,000</p>
          <p style={{ fontSize: "0.47rem", margin: 0 }}>CAD · non-binding estimate</p>
        </div>
      </header>
      <div style={{ height: "0.055in", background: RUST, flexShrink: 0 }} />

      <main style={{ flex: 1, padding: "0.25in 0.58in 0.18in", display: "flex", flexDirection: "column", gap: "0.16in" }}>
        <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "0.22in", borderBottom: "1px solid rgba(31,61,46,0.16)", paddingBottom: "0.16in" }}>
          <div>
            <SectionHeading>What this funds</SectionHeading>
            <p style={{ fontFamily: "var(--font-serif)", color: EVERGREEN, fontSize: "0.91rem", lineHeight: 1.18, margin: 0 }}>One useful operating layer that helps an organization carry knowledge forward.</p>
          </div>
          <p style={{ fontSize: "0.61rem", lineHeight: 1.47, color: INK, margin: 0 }}>For an eligible nonprofit, co-op, or community organization: a practical first implementation that leaves the organization better prepared for the next funding cycle.</p>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.28in", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15in", paddingRight: "0.2in", borderRight: "1px solid rgba(31,61,46,0.14)" }}>
            <section>
              <SectionHeading>Indicative stages</SectionHeading>
              <ol style={{ margin: 0, padding: 0, display: "grid", gap: "0.07in" }}>
                {[
                  ["01", "Align", "Confirm the practical problem, people responsible, and a useful first boundary."],
                  ["02", "Map", "Make current knowledge, vocabulary, decisions, and uncertainty visible."],
                  ["03", "Build", "Create one handoff-ready digital operating layer with the organization."],
                  ["04", "Handoff", "Document ownership, export path, care of the work, and the next decision."],
                ].map(([num, title, desc]) => (
                  <li key={num} style={{ listStyle: "none", display: "grid", gridTemplateColumns: "0.28in 1fr", gap: "0.08in", alignItems: "start" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: RUST, paddingTop: "0.01in" }}>{num}</span>
                    <span style={{ fontSize: "0.61rem", lineHeight: 1.36 }}><strong style={{ color: EVERGREEN }}>{title}.</strong> {desc}</span>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <SectionHeading>Expected outputs</SectionHeading>
              <ul style={{ margin: 0, padding: 0 }}>
                <Bullet>One useful operating layer for a bounded operational need.</Bullet>
                <Bullet>Plain-language documentation of roles, decisions, working practices, and known uncertainty.</Bullet>
                <Bullet>Named ownership and handoff path.</Bullet>
                <Bullet>Exportable working record and a clear next-step decision.</Bullet>
              </ul>
            </section>
            <section style={{ background: "rgba(31,61,46,0.07)", borderLeft: `0.04in solid ${GOLD}`, padding: "0.12in 0.14in" }}>
              <SectionHeading>Take to the table</SectionHeading>
              <p style={{ fontSize: "0.62rem", lineHeight: 1.42, margin: 0 }}>“We are asking for a bounded first implementation at a starting budget of $20,000 CAD. It will create one useful operating layer, name who owns it, and leave us with an exportable handoff.”</p>
            </section>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.14in" }}>
            <section>
              <SectionHeading>Customer responsibilities</SectionHeading>
              <p style={{ fontSize: "0.61rem", lineHeight: 1.43, margin: 0 }}>Name a decision-maker and small working group; provide access to relevant existing materials; make timely decisions; review drafts; confirm what should and should not be retained; and receive the handoff.</p>
            </section>
            <section>
              <SectionHeading>Headwaters responsibilities</SectionHeading>
              <p style={{ fontSize: "0.61rem", lineHeight: 1.43, margin: 0 }}>Facilitate scope and working sessions; surface source meaning and uncertainty; design and build the bounded layer; document the work; make human review points explicit; and support a practical handoff.</p>
            </section>
            <section>
              <SectionHeading>Excluded or scoped separately</SectionHeading>
              <ul style={{ margin: 0, padding: 0 }}>
                <Bullet color={MUTED}>Expanded care pilots, regulated workflows, integrations, migrations, research, and sensitive data.</Bullet>
                <Bullet color={MUTED}>Ongoing operations, additional operating layers, and work beyond the agreed boundary.</Bullet>
              </ul>
            </section>
            <section style={{ borderTop: "1px solid rgba(31,61,46,0.14)", paddingTop: "0.12in" }}>
              <SectionHeading>Human authority & privacy</SectionHeading>
              <p style={{ fontSize: "0.61rem", lineHeight: 1.43, margin: 0 }}>AI may prepare or organize material; people remain responsible for decisions. Source meaning and uncertainty stay visible. The organization retains its vocabulary, ownership, export path, and ability to leave. Sensitive information is not assumed to be in scope.</p>
            </section>
          </div>
        </div>

        <section style={{ background: EVERGREEN, color: CREAM, padding: "0.14in 0.18in", display: "grid", gridTemplateColumns: "1.32fr 0.68fr", gap: "0.22in", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.53rem", lineHeight: 1.4, margin: 0, color: "rgba(244,237,224,0.81)" }}><strong style={{ color: GOLD }}>Disclaimer.</strong> This is a non-binding starting estimate. It does not guarantee funding, eligibility, an award, or a particular result. Eligibility and allowable costs depend on the relevant program and the organization’s own confirmation.</p>
          </div>
          <div style={{ borderLeft: "1px solid rgba(244,237,224,0.28)", paddingLeft: "0.17in" }}>
            <p style={{ fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, margin: "0 0 0.04in", fontWeight: 700 }}>Safe next step</p>
            <p style={{ fontSize: "0.61rem", lineHeight: 1.35, margin: 0 }}>Request a budgetary scope conversation at <a data-testid="link-funding-contact" href="mailto:bobbie@ourheadwaters.ca" style={{ color: CREAM, fontWeight: 700 }}>bobbie@ourheadwaters.ca</a>.</p>
          </div>
        </section>
      </main>

      <footer style={{ background: "rgba(31,61,46,0.08)", borderTop: "1px solid rgba(31,61,46,0.13)", padding: "0.12in 0.58in", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.2in" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.64rem", fontWeight: 600, color: EVERGREEN, margin: 0 }}>Headwaters Development Services · Northern Ontario</p>
        <p style={{ fontSize: "0.5rem", color: MUTED, margin: 0 }}>ourheadwaters.ca · bobbie@ourheadwaters.ca</p>
      </footer>
    </div>
  );
}

export default function CommunityFundingInsert() {
  return (
    <>
      <PrintNav targetId="community-funding-insert-pdf" filename="headwaters-community-funding-insert.pdf" onCopyPlainText={buildPlainText} />
      <LetterPageStage>
        <div id="community-funding-insert-pdf" className="letter-page-stage__content">
          <CommunityFundingInsertPage />
        </div>
      </LetterPageStage>
    </>
  );
}
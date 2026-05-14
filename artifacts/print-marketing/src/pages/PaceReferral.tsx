import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const base = import.meta.env.BASE_URL;

function buildPlainText(): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "For small businesses, non-profits, and community enterprises in NWO",
    "",
    "---",
    "",
    "IS THIS YOU?",
    "",
    "Are you managing an entire operation where everything goes through you — and you're burning out?",
    "Are you in love with your work, but your blind spots are eating you alive?",
    "Are you in desperate need of automation but can't find the time to set up a system?",
    "",
    "Headwaters works with small businesses, non-profits, co-ops, and community enterprises across Northwestern Ontario. Food systems are a particular strength, but the work is business-building — operations, systems, planning, and the things that keep falling through the cracks.",
    "",
    "Or maybe you just need one thing done: a grant application written, a business plan roughed out, a funding argument put on paper. Short 1–2 week engagements are available for small businesses and non-profits at a fraction of the cost of a full engagement.",
    "",
    "You don't need another report. You need work you can actually use.",
    "",
    "---",
    "",
    "THE ENGAGEMENT",
    "",
    "Phase 1 — $28,000 · 6–8 weeks · fixed fee",
    "",
    "A bounded scope of work with a real deliverable at the end. The fee is fixed — if the engagement runs closer to six weeks, the invoice comes down.",
    "",
    "What you walk away with:",
    "→ A supply chain map — where the food comes from, what it costs, what the freight realities actually are",
    "→ An operations manual — day-one procedures, ordering cycles, pricing, cash handling",
    "→ A handoff package — band council presentation, operator walkthrough, everything in a format the community owns outright",
    "→ A financing structure — year-one budget, grant matches, co-op or band-council options, every number open and editable",
    "",
    "You can stop at the end of Phase 1. Everything built stays with you.",
    "",
    "Short engagements — 1–2 weeks · fixed fee · for small businesses and non-profits",
    "",
    "Grant applications, business plans, funding arguments, operational documents. Priced to the scope. Payment is due on delivery — not contingent on grant approval.",
    "",
    "If upfront cost is a barrier, ask PACE about bridge financing for small engagements.",
    "",
    "---",
    "",
    "WHO DOES THIS WORK",
    "",
    "Bobbie Parr is a Northwestern Ontario practitioner, founder of Parr's Jars, and a founding board member of the 807 Food Co-op. Headwaters Development Services builds operational plans, digital platforms, and custom tools for northern communities and food businesses. The work is dollar-honest and designed to run without a consultant in the room.",
    "",
    "Based in Dryden, Ontario. Working across Northwestern Ontario.",
    "",
    "---",
    "",
    "TO GET STARTED",
    "",
    "Send a message — a sentence or two about what you're trying to build is enough.",
    "",
    "bobbie@ourheadwaters.ca",
    "ourheadwaters.ca",
    "",
    "All fees CAD · excludes HST",
  ].join("\n");
}

export default function PaceReferral() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-pace-referral.pdf"
        onCopyPlainText={buildPlainText}
      />

      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: 0, overflow: "hidden", background: "var(--cream)", minHeight: "11in" }}
      >
        <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ background: "var(--evergreen)", padding: "0.48in 0.65in 0.38in", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.22in", marginBottom: "0.22in" }}>
              <img src={`${base}eagle-mark.svg`} alt="Headwaters logo" style={{ width: "0.6in", height: "0.5in", objectFit: "contain", flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", lineHeight: 1.3 }}>
                  Headwaters Development Services
                </p>
              </div>
            </div>

            <div style={{ width: "0.5in", height: 3, background: "var(--rust)", marginBottom: "0.18in" }} />

            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "0.16in" }}>
              Building a business<br />in Northwestern Ontario?
            </h1>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", fontStyle: "italic", color: "rgba(244,237,224,0.78)", lineHeight: 1.55, maxWidth: "5.2in" }}>
              For small businesses, non-profits, co-ops, and community enterprises across NWO — a practitioner who knows the north and stays until it works. Food systems are a particular strength.
            </p>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.38in 0.65in 0.28in", display: "flex", flexDirection: "column", gap: "0.3in" }}>

            {/* Is this you */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.1in" }}>
                Is this you?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.07in", marginBottom: "0.14in" }}>
                {[
                  "Are you managing an entire operation where everything goes through you — and you're burning out?",
                  "Are you in love with your work, but your blind spots are eating you alive?",
                  "Are you in desperate need of automation but can't find the time to set up a system?",
                ].map((q) => (
                  <div key={q} style={{ display: "flex", gap: "0.12in", alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", color: "var(--rust)", flexShrink: 0, lineHeight: 1.5 }}>→</span>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", color: "var(--evergreen)", fontWeight: 600, lineHeight: 1.5 }}>{q}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.83rem", color: "var(--ink)", lineHeight: 1.62, maxWidth: "6in" }}>
                Headwaters works with small businesses, non-profits, co-ops, and community enterprises across NWO. Food systems are a particular strength, but the work is business-building — operations, systems, planning, and the things that keep falling through the cracks. Short 1–2 week engagements available for when you just need <em>one thing done</em>.
              </p>
            </section>

            {/* The engagement */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.12in" }}>
                The engagement
              </p>

              {/* Fee block */}
              <div style={{ background: "var(--evergreen)", borderRadius: 5, padding: "0.2in 0.28in", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.18in" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.04rem" }}>
                    Phase 1
                  </p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 700, color: "white", lineHeight: 1.2 }}>
                    Fixed fee · defined scope · real deliverable at the end
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "rgba(244,237,224,0.72)", marginTop: "0.05rem" }}>
                    6–8 weeks · shorter engagement = reduced invoice · stop at any point
                  </p>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0, marginLeft: "0.3in" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$28,000</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", color: "rgba(244,237,224,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>CAD · excl. HST</p>
                </div>
              </div>

              {/* Deliverables */}
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.1in" }}>
                What you walk away with
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.4in" }}>
                {[
                  {
                    title: "Supply chain map",
                    body: "Where the food comes from, what it costs, what the freight realities actually are — no assumptions about what ships from the south.",
                  },
                  {
                    title: "Operations manual",
                    body: "Day-one procedures, ordering cycles, pricing, cash handling. Written for the person doing the job, not for a consultant.",
                  },
                  {
                    title: "Handoff package",
                    body: "Band council presentation, operator walkthrough, and everything documented in a format the community owns outright — no ongoing relationship required to use it.",
                  },
                  {
                    title: "Financing structure",
                    body: "Year-one budget, grant matches, co-op or band-council options. Every number open and editable — nothing locked in a proprietary model.",
                  },
                ].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: "0.12in", alignItems: "flex-start", borderBottom: "1px solid rgba(31,61,46,0.1)", paddingBottom: "0.12in", marginBottom: "0.1in" }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem", color: "var(--rust)", lineHeight: 1.2, flexShrink: 0, marginTop: "0.02rem" }}>→</span>
                    <div>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.03rem" }}>{item.title}</p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.52 }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Short engagement */}
            <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.22in", alignItems: "start" }}>
              <div style={{ background: "rgba(184,90,62,0.07)", borderRadius: 5, padding: "0.15in 0.2in", borderTop: "2px solid var(--rust)" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.06rem" }}>
                  Short engagement · 1–2 weeks
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.84rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.06rem" }}>
                  For small businesses &amp; non-profits
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.55 }}>
                  Grant applications, business plans, funding arguments, operational documents. Fixed fee, priced to scope. A fraction of the cost of a full engagement.
                </p>
              </div>
              <div style={{ background: "rgba(31,61,46,0.05)", borderRadius: 5, padding: "0.15in 0.2in", borderTop: "2px solid rgba(31,61,46,0.2)" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.06rem" }}>
                  Grant writing &amp; funding support
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.84rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.06rem" }}>
                  Paid on delivery
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.55 }}>
                  Payment is due on delivery — not contingent on grant approval. If upfront cost is a barrier, ask PACE about bridge financing for small engagements.
                </p>
              </div>
            </section>

            {/* Who does this work */}
            <section style={{ background: "rgba(31,61,46,0.05)", borderRadius: 5, padding: "0.18in 0.22in", borderLeft: "3px solid var(--rust)" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.09in" }}>
                Who does this work
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.83rem", color: "var(--ink)", lineHeight: 1.6 }}>
                <strong>Bobbie Parr</strong> is a Northwestern Ontario practitioner, founder of Parr's Jars, and a founding board member of the 807 Food Co-op. Headwaters Development Services builds operational plans, digital platforms, and custom tools for northern communities and food businesses. Based in Dryden — working across Northwestern Ontario. The work is dollar-honest and designed to run without a consultant in the room.
              </p>
            </section>

          </div>

          {/* Footer / CTA */}
          <div style={{ background: "var(--rust)", padding: "0.22in 0.65in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "0.05rem" }}>
                To get started — send a message
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "white" }}>
                bobbie@ourheadwaters.ca
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.75)" }}>
                ourheadwaters.ca
              </p>
            </div>
            <QRCodeStamp />
          </div>

        </div>
      </div>
    </>
  );
}

import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const phases = [
  {
    num: "01",
    name: "Discovery",
    deliverable: "Community interview notes, assets audit, site assessment summary. What the band already has and what is missing — in plain language, no assumptions.",
  },
  {
    num: "02",
    name: "Supply Chain Mapping",
    deliverable: "807 supplier directory built from scratch. Freight routing, seasonal availability windows, minimum order realities. No assumptions about what comes from the south.",
  },
  {
    num: "03",
    name: "Staffing & Training Plan",
    deliverable: "Local hire plan, plain-language role definitions, 30-day training timeline. Written for the person doing the job, not for the person who hired the consultant.",
  },
  {
    num: "04",
    name: "Financing Structure",
    deliverable: "Band council financing options, grant matching against the 807 grants index, co-op structure options with open financial model. Every number is visible and editable.",
  },
  {
    num: "05",
    name: "Operations Manual",
    deliverable: "Day-one procedures, daily close, weekly inventory cycle, monthly reconciliation. Built so operators can run it without a consultant in the room.",
  },
  {
    num: "06",
    name: "Handoff",
    deliverable: "Band council presentation. Operator walkthrough. Everything handed off in a format the community owns — no login required, no ongoing relationship required.",
  },
];

function buildPlainText(): string {
  const phaseLines = phases.map(
    (ph) => `${ph.num} — ${ph.name}\n${ph.deliverable}`
  ).join("\n\n");

  const included = [
    "All six phases completed in sequence",
    "Weekly plain-language progress notes",
    "Open financial model — every number visible and editable",
    "807 supplier directory and grants index",
    "Band council presentation ready to deliver",
    "Operations manual the community owns outright",
  ].map((item) => `✓ ${item}`).join("\n");

  const notIncluded = [
    "A report that sits on a shelf",
    "A proposal that needs another proposal to proceed",
    "A template from a southern consulting firm",
    "Contingent on an ongoing retainer to keep working",
    "Software that requires a login to access your own data",
  ].map((item) => `× ${item}`).join("\n");

  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "Northern Community Store Engagement",
    "Scope of work and rate sheet. Six phases. Plain language. Open numbers.",
    "",
    "---",
    "",
    "RATES",
    "",
    "Capacity-building engagement: $28,000 flat",
    "6–8 week engagement · all six phases · full handoff package. No long-term commitment required.",
    "",
    "Shorter engagement — 1–2 weeks · fixed fee",
    "For smaller asks with a big impact. Priced to scope. Payment due on delivery.",
    "",
    "---",
    "",
    "THE SIX PHASES — IN ORDER",
    "",
    phaseLines,
    "",
    "---",
    "",
    "WHAT IS INCLUDED",
    "",
    included,
    "",
    "WHAT THIS IS NOT",
    "",
    notIncluded,
    "",
    "---",
    "",
    "\"We don't hide our numbers; we deliver on them.\" Every engagement starts with the real figures — margin per unit, volume required to reach viability, what the operator needs to live on while the store gets on its feet. Dollar-honest, before anything else is honest.",
    "",
    "---",
    "",
    "Headwaters Development Services",
    "Northwestern Ontario · ourheadwaters.ca",
    "bobbie@ourheadwaters.ca",
  ].join("\n");
}

export default function ScopeRateSheet() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-scope-rate-sheet.pdf"
        pdfApiPath="/api/pdf/scope-rate-sheet.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: 0, overflow: "hidden", background: "var(--cream)", minHeight: "11in" }}
      >
        <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ background: "var(--evergreen)", padding: "0.45in 0.65in 0.35in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.12rem" }}>
              Headwaters Development Services
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.05, marginBottom: "0.12rem", letterSpacing: "-0.02em" }}>
              Northern Community Store Engagement
            </h1>
            <div style={{ width: "1.5in", height: 2, background: "var(--rust)", margin: "0.18rem 0 0.25rem" }} />
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontStyle: "italic", color: "rgba(244,237,224,0.82)", lineHeight: 1.5, maxWidth: "5.5in" }}>
              Scope of work and rate sheet. Six phases. Plain language. Open numbers.
            </p>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.35in 0.65in 0.25in", display: "flex", flexDirection: "column", gap: "0.25in" }}>

            {/* Rate block */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.2in" }}>
              <div style={{ background: "var(--evergreen)", borderRadius: 6, padding: "0.22in 0.28in" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.1rem" }}>
                  Capacity-building engagement
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1, marginBottom: "0.05rem" }}>
                  $28,000
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "rgba(244,237,224,0.75)", lineHeight: 1.5 }}>
                  6–8 week engagement · all six phases · full handoff package. No long-term commitment required.
                </p>
              </div>
              <div style={{ background: "white", border: "1.5px solid rgba(31,61,46,0.15)", borderRadius: 6, padding: "0.22in 0.28in" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.1rem" }}>
                  Shorter engagement · 1–2 weeks
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 900, color: "var(--ink)", lineHeight: 1, marginBottom: "0.05rem" }}>
                  Fixed fee
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  For smaller asks with a big impact — underserved communities prioritized. Priced to scope. Payment due on delivery.
                </p>
              </div>
            </div>

            {/* Six phases */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.14rem" }}>
                The six phases — in order
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.09in" }}>
                {phases.map((ph) => (
                  <div key={ph.num} style={{ display: "grid", gridTemplateColumns: "0.38in 1.1in 1fr", gap: "0.12in", alignItems: "baseline" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: 700, color: "var(--rust)", margin: 0 }}>
                      {ph.num}
                    </p>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.78rem", fontWeight: 600, color: "var(--evergreen)", margin: 0 }}>
                      {ph.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.45, margin: 0 }}>
                      {ph.deliverable}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* What this is not */}
            <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.2in" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.1rem" }}>
                  What is included
                </p>
                {[
                  "All six phases completed in sequence",
                  "Weekly plain-language progress notes",
                  "Open financial model — every number visible and editable",
                  "807 supplier directory and grants index",
                  "Band council presentation ready to deliver",
                  "Operations manual the community owns outright",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.1in", alignItems: "flex-start", marginBottom: "0.06in" }}>
                    <span style={{ color: "var(--evergreen)", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0, lineHeight: 1.45 }}>✓</span>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--ink)", lineHeight: 1.45, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.1rem" }}>
                  What this is not
                </p>
                {[
                  "A report that sits on a shelf",
                  "A proposal that needs another proposal to proceed",
                  "A template from a southern consulting firm",
                  "Contingent on an ongoing retainer to keep working",
                  "Software that requires a login to access your own data",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.1in", alignItems: "flex-start", marginBottom: "0.06in" }}>
                    <span style={{ color: "var(--rust)", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0, lineHeight: 1.45 }}>×</span>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.45, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Dollar-honest note */}
            <div style={{ background: "rgba(184,90,62,0.08)", borderLeft: "3px solid var(--rust)", padding: "0.15in 0.2in", borderRadius: "0 4px 4px 0" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.8rem", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
                "We don't hide our numbers; we deliver on them." Every engagement starts with the real figures — margin per unit, volume required to reach viability, what the operator needs to live on while the store gets on its feet. Dollar-honest, before anything else is honest.
              </p>
            </div>

            {/* Footer contact */}
            <div style={{ marginTop: "auto", paddingTop: "0.15in", borderTop: "1px solid rgba(31,61,46,0.15)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.06rem" }}>
                  Headwaters Development Services
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)", lineHeight: 1.6 }}>
                  Northwestern Ontario · ourheadwaters.ca
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  bobbie@ourheadwaters.ca
                </p>
              </div>
              <QRCodeStamp url="https://ourheadwaters.ca" size={52} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

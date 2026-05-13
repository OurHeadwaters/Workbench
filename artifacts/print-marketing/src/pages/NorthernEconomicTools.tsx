import { PrintNav } from "../components/PrintNav";

const base = import.meta.env.BASE_URL;

function buildPlainText(): string {
  return [
    "TOOLS AND TRAINING FOR NORTHERN ECONOMIC SYSTEMS",
    "A working document — Headwaters Development Services",
    "Last updated: May 2026",
    "",
    "---",
    "",
    "NOTE: This is a thinking tool, not a final deliverable. It captures a hunch",
    "about how the Codetry workflow discipline maps onto reserve labour pools and",
    "community work-share arrangements. Use it to start a conversation, not end one.",
    "",
    "---",
    "",
    "THE PRINCIPLE",
    "",
    "Codetry is a workflow discipline, not a software product.",
    "It has five rules:",
    "",
    "1. Trial first. Never hire or contract without a bounded, paid trial period.",
    "2. Bounded scope. Every engagement has a defined deliverable and a stop date.",
    "3. Transparent pricing. The cost stack is visible at the kitchen table, not just the cap table.",
    "4. Local practitioner. The person doing the work lives with the consequences.",
    "5. Handover as exit. Success means the community runs the work without you. Not compound — handover.",
    "",
    "These rules were developed for consulting engagements (one practitioner, one client),",
    "but the logic applies anywhere a community needs to coordinate labour and account for it honestly.",
    "",
    "---",
    "",
    "THE APPLICATION: RESERVE HELPING HANDS",
    "",
    "Many northern reserves operate informal labour pools — seasonal workers,",
    "band-employed helpers, elders who know the work, youth who need the hours.",
    "The problem is never a shortage of people. The problems are:",
    "",
    "→ No trial period. Someone is hired cold and it either works or it doesn't.",
    "→ No bounded scope. Tasks expand, accountability blurs, no one knows when done is done.",
    "→ Hidden cost stacks. Band resources get consumed without a clear record.",
    "→ No handover. Institutional knowledge lives in one person's head and leaves when they do.",
    "",
    "Codetry addresses all four directly:",
    "",
    "TRIAL FIRST → A two-week paid trial for any new role, including seasonal.",
    "   The community sees the work, the worker sees the expectations. Both sides opt in.",
    "",
    "BOUNDED SCOPE → Every task assigned has a clear deliverable and a check-in date.",
    "   'Fix the generator' becomes 'generator running and documented by Friday.'",
    "",
    "TRANSPARENT PRICING → Hours, materials, and community costs are tracked",
    "   and visible in a format the band manager and the household both understand.",
    "",
    "HANDOVER AS EXIT → Every training session ends with: who knows this now?",
    "   Who is next? What gets written down so the knowledge stays?",
    "",
    "---",
    "",
    "WORKED EXAMPLE: SEASONAL FOOD STORE CREW",
    "",
    "A remote community is opening a food store. They have four interested workers",
    "but no hiring history and a tight grant budget.",
    "",
    "Old model: Hire all four. Figure it out as you go. Two work out, two don't.",
    "Half the budget gone before you know who the team is.",
    "",
    "Codetry model:",
    "",
    "Week 1–2: All four do a bounded paid trial. Same wage, same tasks, clear deliverables.",
    "   At the end of two weeks: the band manager and the practitioner",
    "   name who continues and why. Criteria visible beforehand, not invented after.",
    "",
    "Week 3+: The two or three who continue get role-specific training.",
    "   Each training module ends with a written record — what was taught,",
    "   what the worker can now do without supervision, who checks them.",
    "",
    "Month 3: One worker is designated the 'knowledge holder' for each system.",
    "   The practitioner's job is to make themselves unnecessary.",
    "",
    "Budget impact: Trial wages are lower than full hire. You spend less in weeks 1–2",
    "and invest more in months 2–3 on the workers who are actually staying.",
    "Grant reporting is easier because you have records at every stage.",
    "",
    "---",
    "",
    "WHERE THIS GENERALIZES",
    "",
    "The same logic applies wherever northern communities are managing:",
    "",
    "→ Seasonal maintenance crews (roads, buildings, equipment)",
    "→ Community harvest and processing operations",
    "→ Band office administrative work (reception, records, reporting)",
    "→ Youth employment programs (summer crews, NOHFC-funded positions)",
    "→ Elder knowledge documentation projects",
    "→ Contractor oversight (making sure outside contractors are actually training locals)",
    "",
    "In every case, the gap is not people or funding. The gap is a workflow discipline",
    "that accounts for labour honestly, builds local knowledge, and has a plan",
    "for what happens when the funded period ends.",
    "",
    "---",
    "",
    "TOOLS THIS DOCUMENT POINTS TOWARD",
    "",
    "If this hunch is right, the following tools would be useful:",
    "",
    "1. A trial-period template — two pages max. What's the task, what does done look like,",
    "   what's the wage, when do we decide. Fillable, not a bureaucratic form.",
    "",
    "2. A task card system — physical or digital. One card per task.",
    "   Front: what, by when, who checks. Back: what was learned.",
    "",
    "3. A knowledge inventory — one page per role.",
    "   Rows: skill / who holds it / who is being trained / written down?",
    "",
    "4. A cost-stack one-pager — for grant reporting and band council transparency.",
    "   Hours, materials, community overhead. Readable at the kitchen table.",
    "",
    "5. A handover checklist — for when the practitioner or funded position ends.",
    "   What systems run, who runs them, where is the documentation.",
    "",
    "None of these tools need to be software. A binder and a laminator",
    "will carry a small community store for years.",
    "",
    "---",
    "",
    "NEXT STEPS (OPEN QUESTIONS)",
    "",
    "→ Is there a community willing to run a trial of the trial-period model?",
    "→ What does NOHFC / Canada Summer Jobs require for documentation?",
    "   Could the trial-period template satisfy their reporting requirements?",
    "→ Is there a band manager or EDC director who wants to co-develop this?",
    "→ What's the fee model for this kind of engagement?",
    "   (Probably a short engagement — 2 weeks, deliver the binder, train the manager.)",
    "",
    "---",
    "",
    "Headwaters Development Services · ourheadwaters.ca · May 2026",
    "This document is a working draft. Share it. Mark it up. Push back on it.",
  ].join("\n");
}

const sectionLabel: React.CSSProperties = {
  display: "inline-block",
  background: "var(--evergreen)",
  color: "var(--cream)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.62rem",
  fontWeight: 800,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
  padding: "0.045in 0.13in",
  borderRadius: 3,
  marginBottom: "0.18in",
};

const rustLabel: React.CSSProperties = {
  ...sectionLabel,
  background: "var(--rust)",
};

const body: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "0.85rem",
  color: "var(--ink)",
  lineHeight: 1.7,
  maxWidth: "6.2in",
};

const ruleRow: React.CSSProperties = {
  display: "flex",
  gap: "0.14in",
  alignItems: "flex-start",
  marginBottom: "0.08in",
};

const arrow: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "0.85rem",
  color: "var(--rust)",
  flexShrink: 0,
  lineHeight: 1.7,
};

export default function NorthernEconomicTools() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "var(--font-sans)" }}>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-northern-economic-tools.pdf"
        onCopyPlainText={buildPlainText}
      />

      {/* Page */}
      <div id="pdf-target" style={{ maxWidth: "8.5in", margin: "2rem auto", background: "white", boxShadow: "0 2px 24px rgba(0,0,0,0.10)", minHeight: "11in", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ background: "var(--evergreen)", padding: "0.55in 0.65in 0.45in", display: "flex", flexDirection: "column", gap: "0.14in" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.18in", marginBottom: "0.1in" }}>
            <img src={`${base}eagle-mark.svg`} alt="Headwaters" style={{ width: 52, height: 42, objectFit: "contain" }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.7)" }}>
              Headwaters Development Services
            </p>
          </div>
          <div style={{ width: "0.5in", height: 3, background: "var(--rust)", marginBottom: "0.1in" }} />
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.1in" }}>
            Tools and Training<br />for Northern Economic Systems
          </h1>
          <div style={{ display: "flex", gap: "0.5in", alignItems: "flex-start" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(244,237,224,0.72)", lineHeight: 1.55, maxWidth: "4.8in" }}>
              A working document. Captures a hunch about how the Codetry workflow discipline maps onto reserve labour pools and community work-share arrangements. Share it. Mark it up. Push back on it.
            </p>
            <div style={{ flexShrink: 0, background: "rgba(244,237,224,0.12)", border: "1px solid rgba(244,237,224,0.2)", borderRadius: 4, padding: "0.1in 0.18in", textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.04in" }}>Status</p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: "var(--cream)", fontWeight: 600 }}>Working draft</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(244,237,224,0.6)", marginTop: "0.04in" }}>May 2026</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "0.45in 0.65in 0.4in", display: "flex", flexDirection: "column", gap: "0.35in" }}>

          {/* Principle */}
          <section>
            <div style={sectionLabel}>The Principle</div>
            <p style={body}>
              Codetry is a workflow discipline, not a software product. It has five rules that govern how work gets started, scoped, priced, staffed, and finished:
            </p>
            <div style={{ marginTop: "0.14in", display: "flex", flexDirection: "column", gap: "0.06in" }}>
              {[
                ["Trial first.", "Never hire or contract without a bounded, paid trial period."],
                ["Bounded scope.", "Every engagement has a defined deliverable and a stop date."],
                ["Transparent pricing.", "The cost stack is visible at the kitchen table, not just the cap table."],
                ["Local practitioner.", "The person doing the work lives with the consequences."],
                ["Handover as exit.", "Success means the community runs the work without you. Not compound — handover."],
              ].map(([label, text]) => (
                <div key={label} style={ruleRow}>
                  <span style={arrow}>→</span>
                  <p style={{ ...body, margin: 0 }}><strong style={{ color: "var(--evergreen)" }}>{label}</strong> {text}</p>
                </div>
              ))}
            </div>
            <p style={{ ...body, marginTop: "0.14in", fontStyle: "italic", color: "rgba(31,61,46,0.65)", fontSize: "0.8rem" }}>
              These rules were developed for consulting engagements, but the logic applies anywhere a community needs to coordinate labour and account for it honestly.
            </p>
          </section>

          {/* Application */}
          <section>
            <div style={sectionLabel}>The Application: Reserve Helping Hands</div>
            <p style={body}>
              Many northern reserves operate informal labour pools — seasonal workers, band-employed helpers, elders who know the work, youth who need the hours. The problem is never a shortage of people. The problems are:
            </p>
            <div style={{ marginTop: "0.14in", display: "flex", flexDirection: "column", gap: "0.06in", marginBottom: "0.18in" }}>
              {[
                "No trial period. Someone is hired cold and it either works or it doesn't.",
                "No bounded scope. Tasks expand, accountability blurs, no one knows when done is done.",
                "Hidden cost stacks. Band resources get consumed without a clear record.",
                "No handover. Institutional knowledge lives in one person's head and leaves when they do.",
              ].map((text) => (
                <div key={text} style={ruleRow}>
                  <span style={arrow}>→</span>
                  <p style={{ ...body, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
            <p style={{ ...body, marginBottom: "0.1in" }}>Codetry addresses all four directly:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.15in" }}>
              {[
                ["Trial first", "A two-week paid trial for any new role, including seasonal. The community sees the work. The worker sees the expectations. Both sides opt in."],
                ["Bounded scope", "Every task has a clear deliverable and a check-in date. \u201cFix the generator\u201d becomes \u201cgenerator running and documented by Friday.\u201d"],
                ["Transparent pricing", "Hours, materials, and community costs are tracked in a format the band manager and the household both understand."],
                ["Handover as exit", "Every training session ends with: who knows this now? Who is next? What gets written down so the knowledge stays?"],
              ].map(([label, text]) => (
                <div key={label} style={{ background: "rgba(31,61,46,0.05)", borderRadius: 4, padding: "0.12in 0.15in", borderLeft: "3px solid var(--rust)" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.05in" }}>{label}</p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.81rem", color: "var(--ink)", lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Worked Example */}
          <section>
            <div style={rustLabel}>Worked Example: Seasonal Food Store Crew</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.18in" }}>
              <div style={{ background: "rgba(184,90,62,0.07)", borderRadius: 4, padding: "0.14in 0.16in" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.08in" }}>Old model</p>
                <p style={{ ...body, fontSize: "0.81rem" }}>
                  Hire all four. Figure it out as you go. Two work out, two don't. Half the budget gone before you know who the team is.
                </p>
              </div>
              <div style={{ background: "rgba(31,61,46,0.06)", borderRadius: 4, padding: "0.14in 0.16in" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--evergreen)", marginBottom: "0.08in" }}>Codetry model</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.06in" }}>
                  {[
                    ["Weeks 1–2", "All four do a bounded paid trial. Same wage, same tasks, clear deliverables. At end of two weeks, who continues — and why — is named using criteria set beforehand."],
                    ["Weeks 3+", "Role-specific training. Each module ends with a written record: what was taught, what the worker can do without supervision, who checks them."],
                    ["Month 3", "One worker is the 'knowledge holder' per system. The practitioner's job is to make themselves unnecessary."],
                  ].map(([phase, text]) => (
                    <div key={phase}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: 700, color: "var(--evergreen)", letterSpacing: "0.05em" }}>{phase}</p>
                      <p style={{ ...body, fontSize: "0.79rem", margin: 0 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p style={{ ...body, fontSize: "0.79rem", marginTop: "0.12in", fontStyle: "italic", color: "rgba(31,61,46,0.65)" }}>
              Budget impact: Trial wages are lower than full hire. You spend less in weeks 1–2 and invest more in months 2–3 on the workers who are actually staying. Grant reporting is easier because you have records at every stage.
            </p>
          </section>

          {/* Where it generalizes */}
          <section>
            <div style={sectionLabel}>Where This Generalizes</div>
            <p style={{ ...body, marginBottom: "0.12in" }}>The same logic applies wherever northern communities are managing:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.04in 0.3in" }}>
              {[
                "Seasonal maintenance crews (roads, buildings, equipment)",
                "Community harvest and processing operations",
                "Band office administrative work",
                "Youth employment programs (summer crews, NOHFC positions)",
                "Elder knowledge documentation projects",
                "Contractor oversight — ensuring outside contractors train locals",
              ].map((item) => (
                <div key={item} style={ruleRow}>
                  <span style={arrow}>→</span>
                  <p style={{ ...body, margin: 0, fontSize: "0.81rem" }}>{item}</p>
                </div>
              ))}
            </div>
            <p style={{ ...body, marginTop: "0.14in", fontWeight: 600, color: "var(--evergreen)" }}>
              In every case, the gap is not people or funding. The gap is a workflow discipline that accounts for labour honestly, builds local knowledge, and has a plan for what happens when the funded period ends.
            </p>
          </section>

          {/* Tools it points toward */}
          <section>
            <div style={sectionLabel}>Tools This Document Points Toward</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.1in 0.3in" }}>
              {[
                ["Trial-period template", "Two pages max. What's the task, what does done look like, what's the wage, when do we decide. Fillable, not a bureaucratic form."],
                ["Task card system", "Physical or digital. One card per task. Front: what, by when, who checks. Back: what was learned."],
                ["Knowledge inventory", "One page per role. Rows: skill / who holds it / who is being trained / written down?"],
                ["Cost-stack one-pager", "For grant reporting and band council transparency. Hours, materials, community overhead. Readable at the kitchen table."],
                ["Handover checklist", "For when the practitioner or funded position ends. What systems run, who runs them, where is the documentation."],
              ].map(([label, text]) => (
                <div key={label} style={{ display: "flex", gap: "0.1in", alignItems: "flex-start" }}>
                  <span style={arrow}>→</span>
                  <p style={{ ...body, margin: 0, fontSize: "0.81rem" }}><strong>{label}</strong> — {text}</p>
                </div>
              ))}
            </div>
            <p style={{ ...body, marginTop: "0.14in", fontStyle: "italic", color: "rgba(31,61,46,0.6)", fontSize: "0.78rem" }}>
              None of these tools need to be software. A binder and a laminator will carry a small community store for years.
            </p>
          </section>

          {/* Open questions */}
          <section style={{ borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.25in" }}>
            <div style={rustLabel}>Open Questions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.06in" }}>
              {[
                "Is there a community willing to run a trial of the trial-period model?",
                "What does NOHFC / Canada Summer Jobs require for documentation? Could the trial-period template satisfy their reporting requirements?",
                "Is there a band manager or EDC director who wants to co-develop this?",
                "What's the fee model? (Probably a short engagement — 2 weeks, deliver the binder, train the manager.)",
              ].map((q) => (
                <div key={q} style={ruleRow}>
                  <span style={arrow}>→</span>
                  <p style={{ ...body, margin: 0, fontSize: "0.81rem" }}>{q}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div style={{ background: "var(--evergreen)", padding: "0.18in 0.65in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(244,237,224,0.7)" }}>
            Headwaters Development Services · ourheadwaters.ca
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.7rem", fontStyle: "italic", color: "rgba(244,237,224,0.55)" }}>
            Working draft · May 2026 · Share it. Mark it up.
          </p>
        </div>
      </div>
    </div>
  );
}

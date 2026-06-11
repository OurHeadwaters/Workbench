import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlternaGrantProposal() {
  return (
    <>
      <style>{`
        @media print {
          aside,
          header,
          [data-deadhead-drop],
          [data-gord-widget],
          .no-print {
            display: none !important;
          }
          body, html { background: white !important; margin: 0 !important; }
          main { padding: 0 !important; overflow: visible !important; }
          .flex.flex-col.md\\:flex-row { display: block !important; }
          .proposal-wrap {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
          @page { size: letter portrait; margin: 0.65in; }
          h1 { font-size: 13pt !important; margin-bottom: 1pt !important; line-height: 1.2 !important; }
          h2 { font-size: 10pt !important; margin-top: 7pt !important; margin-bottom: 2pt !important; border-bottom: 0.5pt solid #ccc; padding-bottom: 1pt !important; }
          h3 { font-size: 9pt !important; margin-bottom: 1pt !important; margin-top: 4pt !important; }
          p, li, td, th { font-size: 8pt !important; line-height: 1.3 !important; }
          table { font-size: 7.5pt !important; }
          .section-gap { margin-bottom: 4pt !important; }
          ul { margin: 1pt 0 2pt 0 !important; padding-left: 12pt !important; }
          li { margin-bottom: 0.5pt !important; }
          .letterhead-row { font-size: 7.5pt !important; }
          td, th { padding: 1pt 3pt !important; }
          .pb-letterhead { padding-bottom: 3pt !important; margin-bottom: 3pt !important; }
        }
      `}</style>

      <div className="no-print mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Alterna Financial Inclusion Grant — Full Proposal</span>
            {" "}· Due June 26, 2026 · $20,000 requested
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submit to{" "}
            <a href="mailto:community.grants@alterna.ca" className="underline hover:text-primary">
              community.grants@alterna.ca
            </a>
          </p>
        </div>
        <Button onClick={() => window.print()} variant="outline" size="sm" className="gap-2 shrink-0">
          <Printer className="h-4 w-4" />
          Print / Export PDF
        </Button>
      </div>

      <div className="proposal-wrap max-w-4xl mx-auto bg-white dark:bg-card text-foreground rounded-xl shadow-md border border-border/60 p-8 sm:p-12">

        {/* Letterhead */}
        <div className="border-b-2 border-primary pb-letterhead pb-3 mb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground leading-tight">
                807 Food Co-operative &amp; Hub
              </h1>
              <p className="text-sm text-muted-foreground">Dryden, Ontario · 807foodcoop.ca</p>
            </div>
            <div className="text-right text-sm text-muted-foreground letterhead-row">
              <p>[Date]</p>
              <p>community.grants@alterna.ca</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-0.5">Submitted to</p>
            <p className="font-medium text-foreground text-sm">Alterna Savings — Financial Inclusion Granting Program</p>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4 text-sm letterhead-row">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Project</p>
              <p className="font-semibold text-xs leading-tight">Codetry Plain-Language Decision-Support Tool for Rural Producers</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount Requested</p>
              <p className="font-semibold">$20,000</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Lead Contact</p>
              <p className="font-semibold">Sarah Lovenuk</p>
            </div>
          </div>
        </div>

        {/* Executive Summary + Measurable Outcomes */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">Executive Summary</h2>
          <p className="text-sm leading-relaxed">
            The 807 Food Co-operative &amp; Hub requests $20,000 from Alterna Savings' Financial Inclusion Granting Program to build and pilot a plain-language <strong>codetry</strong> decision-support tool — an interactive digital experience that translates co-op membership economics into everyday language for rural producers and member-owners in Northwestern Ontario. The 807 region spans ~475,000 km² with limited banking infrastructure and a population where English is frequently a second language; many members engage with the co-op without understanding member equity, patronage returns, or collective purchasing. The codetry approach pairs a practitioner directly with members to build plain-language explanations from lived language, then integrates them into tools members already use. Alterna's $20,000 funds the full project; co-op staff time and volunteer hours add $3,000 in-kind ($23,000 total). The finished tool will be released open-source for any Ontario food co-op to adopt.
          </p>

          <h3 className="font-semibold text-sm text-foreground mt-2 mb-1">Measurable Outcomes</h3>
          <ul className="text-sm text-muted-foreground list-disc pl-5">
            <li>≥ 50 members complete the codetry module during the Jan–Feb 2027 pilot</li>
            <li>≥ 10-point average increase in self-assessed financial confidence (pre/post survey, 0–100 scale)</li>
            <li>≥ 3 Ontario co-ops or food hubs adopt the open-source release within 12 months of launch</li>
            <li>≥ 10 qualified Alterna Savings referrals generated through the post-module member prompt</li>
            <li>Final impact report delivered to Alterna by March 31, 2027</li>
          </ul>
        </section>

        {/* Section 1: Detailed Budget */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">1. Detailed Budget</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-2 py-1 font-semibold border border-border/50 w-1/4">Line Item</th>
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Sub-Item / Rationale</th>
                  <th className="text-right px-2 py-1 font-semibold border border-border/50 whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-primary/5">
                  <td className="px-2 py-1 font-semibold border border-border/50 align-top" rowSpan={4}>
                    1. Plain-Language Content Development
                  </td>
                  <td className="px-2 py-1 border border-border/50">Plain-language practitioner — 30 hrs × $90/hr (drafts, plain-language audit, accessibility review)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$2,700</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Co-op financial educator — 10 hrs × $75/hr (accuracy review, member-facing framing)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$750</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Translation &amp; cultural adaptation — Ojibwe &amp; French, 15 hrs × $90/hr</td>
                  <td className="px-2 py-1 text-right border border-border/50">$1,350</td>
                </tr>
                <tr className="bg-muted/30 font-medium">
                  <td className="px-2 py-1 border border-border/50">Line 1 subtotal</td>
                  <td className="px-2 py-1 text-right border border-border/50">$4,800</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="px-2 py-1 font-semibold border border-border/50 align-top" rowSpan={5}>
                    2. Technical Build &amp; Integration
                  </td>
                  <td className="px-2 py-1 border border-border/50">Developer — interactive module build, 60 hrs × $95/hr (UI, quiz logic, progress tracking)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$5,700</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Platform integration &amp; accessibility testing — 15 hrs × $80/hr (WCAG 2.1 AA, mobile-first)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$1,200</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Open-source packaging &amp; documentation — 10 hrs × $75/hr (README, install guide)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$750</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Pilot-period hosting &amp; testing infrastructure (cloud, staging environment)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$750</td>
                </tr>
                <tr className="bg-muted/30 font-medium">
                  <td className="px-2 py-1 border border-border/50">Line 2 subtotal</td>
                  <td className="px-2 py-1 text-right border border-border/50">$8,400</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="px-2 py-1 font-semibold border border-border/50 align-top" rowSpan={6}>
                    3. Pilot Program &amp; Evaluation
                  </td>
                  <td className="px-2 py-1 border border-border/50">Session facilitator — 3 in-person sessions, 12 hrs × $70/hr (facilitation + debrief)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$840</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Survey design &amp; analysis — 20 hrs × $65/hr (pre/post assessment, outcome measurement)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$1,300</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Participant honoraria — 50 members × $15 (incentive for completing pre/post surveys)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$750</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Printed materials (plain-language handouts, word bank cards)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$500</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Facilitator travel to remote pilot sites (mileage, accommodation)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$410</td>
                </tr>
                <tr className="bg-muted/30 font-medium">
                  <td className="px-2 py-1 border border-border/50">Line 3 subtotal</td>
                  <td className="px-2 py-1 text-right border border-border/50">$3,800</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="px-2 py-1 font-semibold border border-border/50 align-top" rowSpan={4}>
                    4. Reporting &amp; Dissemination
                  </td>
                  <td className="px-2 py-1 border border-border/50">Final impact report — 20 hrs × $65/hr (narrative, metrics, lessons-learned)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$1,300</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Open-source launch &amp; sector outreach (conference presentation, co-op network comms)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$800</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50">Contingency — 4.5% of project total (unforeseen translation needs, accessibility fixes)</td>
                  <td className="px-2 py-1 text-right border border-border/50">$900</td>
                </tr>
                <tr className="bg-muted/30 font-medium">
                  <td className="px-2 py-1 border border-border/50">Line 4 subtotal</td>
                  <td className="px-2 py-1 text-right border border-border/50">$3,000</td>
                </tr>
                <tr className="bg-primary/20">
                  <td className="px-2 py-1 font-bold border border-border/50" colSpan={2}>Total Grant Request (Alterna Savings)</td>
                  <td className="px-2 py-1 text-right font-bold border border-border/50">$20,000</td>
                </tr>
                <tr className="bg-muted/40 text-muted-foreground">
                  <td className="px-2 py-1 text-xs border border-border/50" colSpan={2}>
                    Co-op in-kind (staff coordination, server infrastructure, board volunteer hours) — not requested from Alterna
                  </td>
                  <td className="px-2 py-1 text-right text-xs border border-border/50">$3,000</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-2 py-1 font-semibold text-sm border border-border/50" colSpan={2}>Total Project Value</td>
                  <td className="px-2 py-1 text-right font-semibold text-sm border border-border/50">$23,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            All rates are consistent with Northwestern Ontario non-profit contractor norms. Contingency (4.5%) is drawn only with documented justification in the final report. <span className="font-medium">Application line correspondence:</span> Line 1 = "1:1 codetry tooling sessions" ($5,250 app); Line 2 = "Design, Development &amp; integration" ($7,000); Line 3 = "Member testing &amp; survey sessions" ($1,750 + expanded pilot scope); Line 4 = "Impact reporting, Maintenance &amp; Board Handover" ($3,500). Total $20,000 unchanged.
          </p>
        </section>

        {/* Project Timeline */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">Project Timeline (Nov 2026 – Mar 2027)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-2 py-1 font-semibold border border-border/50 whitespace-nowrap">Month</th>
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Milestone</th>
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Key Deliverable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border border-border/50 font-medium">Nov 2026</td>
                  <td className="px-2 py-1 border border-border/50">Kick-off &amp; codetry content development</td>
                  <td className="px-2 py-1 border border-border/50">Member language sessions; word bank drafted; Alterna language workshop</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-2 py-1 border border-border/50 font-medium">Dec 2026</td>
                  <td className="px-2 py-1 border border-border/50">Technical build</td>
                  <td className="px-2 py-1 border border-border/50">Interactive module built; platform integrated; WCAG 2.1 AA testing complete</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50 font-medium">Jan 2027</td>
                  <td className="px-2 py-1 border border-border/50">Pilot sessions</td>
                  <td className="px-2 py-1 border border-border/50">3 facilitated sessions with ≥50 members; pre/post surveys administered</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-2 py-1 border border-border/50 font-medium">Feb 2027</td>
                  <td className="px-2 py-1 border border-border/50">Evaluation &amp; revisions</td>
                  <td className="px-2 py-1 border border-border/50">Survey analysis; content and UX revisions; open-source repo prepared</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50 font-medium">Mar 2027</td>
                  <td className="px-2 py-1 border border-border/50">Open-source release &amp; final report</td>
                  <td className="px-2 py-1 border border-border/50">Tool published GitHub (MIT licence); final impact report delivered to Alterna</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Alterna Employee Participation */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">
            2. Alterna Employee Participation Opportunities
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Opportunity</th>
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Format &amp; Timing</th>
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Value to Alterna</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border border-border/50 font-medium">Codetry Language Workshop</td>
                  <td className="px-2 py-1 border border-border/50">Half-day (virtual or in-person), Nov 2026</td>
                  <td className="px-2 py-1 border border-border/50">Frontline staff input shapes the word bank; credited in tool interface and final report</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-2 py-1 border border-border/50 font-medium">Harvest Market Volunteer Table</td>
                  <td className="px-2 py-1 border border-border/50">Co-op fall market, Dryden (Sept–Oct annually)</td>
                  <td className="px-2 py-1 border border-border/50">Direct member touchpoints in a geography with limited branch access; co-branded materials</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50 font-medium">AGM Observer &amp; Presentation Slot</td>
                  <td className="px-2 py-1 border border-border/50">5–7 min slot at 807 Co-op AGM</td>
                  <td className="px-2 py-1 border border-border/50">Introduce tool to member-owners at peak financial engagement; optional financial inclusion message</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Replication */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">3. Replication and Regional Impact</h2>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-0.5">
            <li><span className="font-medium text-foreground">Open-source release (MIT, within 30 days of pilot conclusion).</span> Full tool — content modules, word bank, quiz framework, translation templates, platform integration code — published on GitHub with a zero-to-running guide for non-technical co-op administrators.</li>
            <li><span className="font-medium text-foreground">Ontario rural food co-op template.</span> Early conversations underway with co-ops in Georgian Bay, Guelph, and Ottawa Valley. An implementation guide will map modules to common member onboarding milestones so any co-op can customize without rebuilding.</li>
            <li><span className="font-medium text-foreground">Phase 2 via FedNor CEDD.</span> We intend to apply to FedNor's next intake to fund Oji-Cree video modules, three additional Northern Ontario food hub partnerships, and regional train-the-facilitator sessions. Alterna's early investment strengthens that application.</li>
          </ul>
        </section>

        {/* Section 4: Partnership Longevity */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">4. Partnership Longevity Opportunities</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Structure</th>
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border border-border/50 font-medium whitespace-nowrap">Annual Literacy Month Event</td>
                  <td className="px-2 py-1 border border-border/50">Each November — co-branded hybrid event (Dryden + livestream): refreshed codetry tool run, Alterna presentation, open Q&amp;A on co-op finance and savings.</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-2 py-1 border border-border/50 font-medium whitespace-nowrap">Newsletter &amp; Onboarding</td>
                  <td className="px-2 py-1 border border-border/50">Standing quarterly newsletter column on financial inclusion resources; Alterna featured in new-member onboarding flow as recommended financial services partner.</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50 font-medium whitespace-nowrap">Member Referral Pathway</td>
                  <td className="px-2 py-1 border border-border/50">Members completing the codetry module receive a prompt connecting credit union values to co-operative ownership, with direct Alterna contact information and any available partnership codes.</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-2 py-1 border border-border/50 font-medium whitespace-nowrap">Co-Branded Sector Visibility</td>
                  <td className="px-2 py-1 border border-border/50">Alterna logo on tool interface, pilot handouts, GitHub README, and media coverage. Joint pitch to Co-operatives and Mutuals Canada and Ontario Co-operative Association.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Additional Context */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">5. Additional Context</h2>
          <p className="text-sm leading-relaxed">
            807 Co-op serves ~475,000 km² of Northwestern Ontario including dozens of remote First Nations communities. The codetry tool is built mobile-first with offline modules — a basic access requirement, not a design preference. ~30% of active members speak Ojibwe, Oji-Cree, or French as a primary language; the tool targets Grade 6–8 reading level with full translation modules. It integrates directly into the existing 807foodcoop.ca member platform, eliminating separate account creation and dramatically reducing adoption risk. The platform continues after the grant period ends; Alterna's $20,000 funds content, piloting, and open-source release — not infrastructure that disappears. We cannot proceed without the full amount: the 807 Co-op has no surplus for contractor fees. This grant is the sole enabler, and the tool is highly replicable once built.
          </p>
        </section>

        {/* Closing */}
        <div className="border-t border-border/60 pt-3 mt-3">
          <p className="text-xs text-muted-foreground mb-2">
            We are grateful to Alterna Savings for the opportunity to advance to the full proposal stage. Additional supporting materials — member surveys, platform usage data, or partner references — are available on request.
          </p>
          <div className="text-sm">
            <p className="font-semibold text-foreground">Sarah Lovenuk</p>
            <p className="text-muted-foreground text-xs">Secretary, Board Member · 807 Food Co-operative &amp; Hub · Dryden, Ontario · info@blackbarnfarms.ca · (807) 620-5916</p>
          </div>
        </div>

      </div>
    </>
  );
}

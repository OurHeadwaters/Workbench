import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlternaGrantProposalSubmit() {
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
          h2 { font-size: 10pt !important; margin-top: 6pt !important; margin-bottom: 2pt !important; border-bottom: 0.5pt solid #ccc; padding-bottom: 1pt !important; }
          h3 { font-size: 9pt !important; margin-bottom: 1pt !important; margin-top: 3pt !important; }
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
            <span className="font-medium text-foreground">Alterna Financial Inclusion Grant — 3-Page Submission Draft</span>
            {" "}· Due June 26, 2026 · $20,000 requested
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            This is the condensed submission version. See the{" "}
            <a href="/print-marketing/alterna-grant-proposal" className="underline hover:text-primary">
              full internal reference
            </a>{" "}
            for complete budget line items and tables.
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
              <p>June 10, 2026</p>
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

        {/* Executive Summary */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">Executive Summary</h2>
          <p className="text-sm leading-relaxed">
            The 807 Food Co-operative &amp; Hub requests $20,000 from Alterna Savings' Financial Inclusion Granting Program to build and pilot a literate code map that supports co-op members by ensuring that local economic development opportunities are delivered in the everyday language of rural producers and member-owners in Northwestern Ontario. This project will be the first to underpin the cutting edge blockchain development software (codetry), rooted in financial inclusion. The 807 region spans ~475,000 km² with limited business opportunities and a population where jargon is not understood or accepted; many members engage with the co-op without understanding terminology used in the banking and grant sector, limited their opportunity for necessary support programs. The codetry approach pairs a practitioner directly with members to build plain-language explanations from lived language, then integrates them into tools members already use. Alterna's $20,000 funds the full project; co-op staff time and volunteer hours add $3,000 in-kind ($23,000 total). The finished tool will be released open-source for any Ontario food co-op to adopt.
          </p>

          <h3 className="font-semibold text-sm text-foreground mt-2 mb-1">Measurable Outcomes</h3>
          <ul className="text-sm text-muted-foreground list-disc pl-5">
            <li>≥ 50 regional businesses complete the codetry module during the Jan–Feb 2027 pilot</li>
            <li>≥ 10-point average increase in self-assessed financial confidence (pre/post survey, 0–100 scale)</li>
            <li>≥ 3 Ontario co-ops or food hubs adopt the open-source release within 12 months of launch</li>
            <li>≥ 10 qualified Alterna Savings referrals generated through the post-module member prompt</li>
            <li>Final impact report delivered to Alterna by March 31, 2027</li>
          </ul>
        </section>

        {/* Budget Summary */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">1. Budget Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Line</th>
                  <th className="text-left px-2 py-1 font-semibold border border-border/50">Category</th>
                  <th className="text-right px-2 py-1 font-semibold border border-border/50 whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border border-border/50 font-medium">1</td>
                  <td className="px-2 py-1 border border-border/50">Plain-Language Content Development — in-person business sessions, board mapping research, online personality mapping (Sarah, practitioner, 31 hrs × $135), outreach coordinator (18 hrs × $70)</td>
                  <td className="px-2 py-1 text-right border border-border/50 font-medium">$5,445</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-2 py-1 border border-border/50 font-medium">2</td>
                  <td className="px-2 py-1 border border-border/50">Technical Build &amp; Integration — interactive module, automated onboarding tool, platform integration, open-source packaging (Sarah, developer, 30 hrs × $135); hosting &amp; testing infrastructure ($65)</td>
                  <td className="px-2 py-1 text-right border border-border/50 font-medium">$4,115</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border border-border/50 font-medium">3</td>
                  <td className="px-2 py-1 border border-border/50">Pilot Program &amp; Evaluation — facilitation &amp; debrief (12 hrs × $135), survey design &amp; analysis (8 hrs × $135), participant honoraria (50 businesses × $50), printed materials, facilitator travel</td>
                  <td className="px-2 py-1 text-right border border-border/50 font-medium">$7,200</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-2 py-1 border border-border/50 font-medium">4</td>
                  <td className="px-2 py-1 border border-border/50">Reporting &amp; Dissemination — final impact report (8 hrs × $135), open-source launch &amp; sector outreach (16 hrs × $135)</td>
                  <td className="px-2 py-1 text-right border border-border/50 font-medium">$3,240</td>
                </tr>
                <tr className="bg-primary/20">
                  <td className="px-2 py-1 font-bold border border-border/50" colSpan={2}>Total Grant Request (Alterna Savings)</td>
                  <td className="px-2 py-1 text-right font-bold border border-border/50">$20,000</td>
                </tr>
                <tr className="bg-muted/40 text-muted-foreground">
                  <td className="px-2 py-1 text-xs border border-border/50" colSpan={2}>Co-op in-kind (staff coordination, server infrastructure, board volunteer hours)</td>
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
            All rates reflect Northwestern Ontario non-profit contractor norms. Sarah Lovenuk (lead practitioner and developer) bills at $135/hr across all labour lines. Full itemized breakdown available on request.
          </p>
        </section>

        {/* Timeline */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">2. Project Timeline (Nov 2026 – Mar 2027)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Nov 2026</strong> — Kick-off; member language sessions; word bank drafted; Alterna language workshop. &nbsp;
            <strong className="text-foreground">Dec 2026</strong> — Interactive module built; platform integrated; WCAG 2.1 AA testing complete. &nbsp;
            <strong className="text-foreground">Jan 2027</strong> — 3 facilitated pilot sessions with ≥50 regional businesses; pre/post surveys administered. &nbsp;
            <strong className="text-foreground">Feb 2027</strong> — Survey analysis; content and UX revisions; open-source repo prepared. &nbsp;
            <strong className="text-foreground">Mar 2027</strong> — Tool published on GitHub (MIT licence); final impact report delivered to Alterna.
          </p>
        </section>

        {/* Alterna Employee Participation */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">3. Alterna Employee Participation Opportunities</h2>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-0.5">
            <li><span className="font-medium text-foreground">Codetry Language Workshop (Nov 2026).</span> Half-day virtual or in-person session: frontline Alterna staff input shapes the plain-language word bank and is credited in the tool interface and final report.</li>
            <li><span className="font-medium text-foreground">Harvest Market Volunteer Table.</span> Co-op fall market in Dryden — direct member touchpoints in a geography with limited branch access; co-branded materials provided.</li>
            <li><span className="font-medium text-foreground">AGM Observer &amp; Presentation Slot.</span> 5–7 minute slot at the 807 Co-op AGM to introduce the tool to member-owners at peak financial engagement.</li>
          </ul>
        </section>

        {/* Replication + Partnership */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">4. Replication, Regional Impact &amp; Partnership Longevity</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-1.5">
            The finished tool — content modules, word bank, quiz framework, and platform integration code — will be published on GitHub (MIT licence) within 30 days of pilot conclusion, with a zero-to-running guide for non-technical co-op administrators. Active partnerships with the <strong className="text-foreground">Ontario Co-operatives Association, The Co-operators, NOHFC, Innovation Centre, and PACE</strong> will support regional adoption. An implementation guide maps modules to common member onboarding milestones so any co-op can customize without rebuilding. We intend to apply to FedNor's next CEDD intake to fund Oji-Cree video modules and three additional Northern Ontario food hub partnerships; Alterna's early investment strengthens that application.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            On an ongoing basis, Alterna is featured in the <strong className="text-foreground">new-member onboarding flow</strong> and a quarterly newsletter column on financial inclusion resources. Members completing the codetry module receive a prompt connecting credit union values to co-operative ownership with direct Alterna contact information. As the codetry platform matures, Headwaters is developing <strong className="text-foreground">complementary plain-language budgeting tools</strong> for rural families and member-owners — we see Alterna as a natural payment and financial services partner, connecting members to credit union products at the moment they're making household financial decisions. This grant lays the groundwork for that deeper integration.
          </p>
        </section>

        {/* Additional Context */}
        <section className="section-gap mb-3">
          <h2 className="font-serif text-lg font-bold text-foreground mb-1.5">5. Additional Context</h2>
          <p className="text-sm leading-relaxed">
            807 Co-op serves ~475,000 km² of Northwestern Ontario including dozens of remote First Nations communities. The codetry tool is built mobile-first with offline modules — a basic access requirement, not a design preference. It integrates directly into the existing 807foodcoop.ca member platform, eliminating separate account creation and dramatically reducing adoption risk. The platform continues after the grant period ends; Alterna's $20,000 funds content, piloting, and open-source release — not infrastructure that disappears. We cannot proceed without the full amount: the 807 Co-op has no surplus for contractor fees. This grant is the sole enabler, and the tool is highly replicable once built.
          </p>
        </section>

        {/* Closing */}
        <div className="border-t border-border/60 pt-3 mt-3">
          <p className="text-xs text-muted-foreground mb-2">
            We are grateful to Alterna Savings for the opportunity to advance to the full proposal stage. Additional supporting materials — member surveys, platform usage data, full itemized budget, or partner references — are available on request.
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

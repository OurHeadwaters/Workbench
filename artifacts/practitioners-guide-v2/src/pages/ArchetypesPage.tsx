/**
 * ArchetypesPage — Codetry vs Software/Sales archetype explainer.
 *
 * PROGRESSIVE DISCLOSURE PATTERN (see docs/design/progressive-disclosure.md):
 *   - Archetype bucket headings with 1-line decision signals: always visible.
 *   - Full narrative, V3→V4→V5 lineage table, shared discipline list: collapsed by default.
 */

import { Link } from "wouter";
import { ArrowLeft, Home } from "lucide-react";
import { useScenario } from "@/lib/scenario";
import { money } from "@/lib/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ACCENT = "#1F5B3F";
const ACCENT_SOFT = "#DDF0E5";
const ACCENT_INK = "#0F2E20";
const ACCENT_BLUE = "#3458A8";

export function ArchetypesPage() {
  const { scenario } = useScenario();
  const a = scenario.contracts.agency;
  const bs = scenario.brightside.surplusDeployment;

  return (
    <div className="space-y-6" data-testid="page-archetypes">
      <header>
        <p
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: ACCENT_INK }}
        >
          Project archetypes · how the model splits
        </p>
        <h1
          className="mt-2 text-3xl font-semibold"
          style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
        >
          Codetry vs Software / Sales — two archetypes, one operating discipline.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
          As of 2026-05-02 the model carries <strong>two project archetypes</strong>. The
          tithe-first surplus discipline and the no-owner-take-from-agency stance are held
          identical across both. Expand each card for the full narrative.
        </p>
      </header>

      {/* ── Archetype cards — always visible decision signals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Codetry archetype */}
        <div
          className="rounded-xl border border-card-border bg-card overflow-hidden"
          style={{ borderTopColor: ACCENT, borderTopWidth: "4px" }}
        >
          <div className="p-4">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
              Codetry archetype
            </p>
            <p
              className="mt-1 text-xl font-semibold"
              style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
            >
              {money(a.fee)}/mo · {a.termMonths}-mo engagement · {a.roster.length}-role team
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Lead draw</p>
                <p className="font-semibold">{money(a.roster[0].monthlyLoaded)}/mo</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payroll</p>
                <p className="font-semibold">{money(a.payrollTotal)}/mo</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cap Recovery</p>
                <p className="font-semibold">
                  {money(a.familyInfusionRecovery + a.capitalRecoveryAmount)} total
                </p>
              </div>
            </div>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem
              value="codetry-detail"
              className="border-t border-card-border border-b-0"
            >
              <AccordionTrigger className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
                Full narrative
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <div className="space-y-3 text-sm leading-relaxed">
                  <p>
                    <strong>Shape.</strong> Community engagement with a lead practitioner on the
                    ground, a small team, and a fixed engagement window (typically 12 months). When
                    the founder has personally guaranteed family capital into the business, Capital
                    Recovery is split into two visible legs so the family piece can be retired up
                    front without disguising the substance.
                  </p>
                  <p>
                    <strong>Canonical example — V7 (current).</strong> Deer Lake. Bobbie bills{" "}
                    {money(a.roster[0].monthlyLoaded + 11200)}/mo total (160 hr × $175) + Tyler{" "}
                    {money(a.roster[1]?.monthlyLoaded ?? 11200)}/mo (160 hr × $70 pass-through
                    subcontract). Total billed: {money(a.fee)}/mo × {a.termMonths} months.
                    Bobbie nets {money(a.roster[0].monthlyLoaded)}/mo ($105/hr).
                    Lean overheads {money(a.overheadsJunAugTotal)}/mo (space + insurance +
                    accountant + legal — client pays tech stack). Monthly surplus{" "}
                    {money(a.monthlySurplusJunAug)}; 12-month surplus{" "}
                    {money(a.totals18mo.surplusDeployed)}. Waterfall TBD.
                  </p>
                  <p>
                    <strong>V5 (prior baseline — $90k/mo Codetry archetype).</strong> The V5
                    model carried a $90k/mo flat agency fee against a 4-role Day-1 team
                    ($43.5k/mo payroll), with Capital Recovery split into a $40k family-infusion
                    leg (month 1) and $72k business-loan leg (Aug → Oct), and a Phase 3
                    Reserve / Innovation 75/25 split. V5 is preserved as a historical baseline.
                    V7 is the current operating plan.
                  </p>
                  <p>
                    <strong>Business P&amp;L (V7).</strong> Revenue {money(a.fee)}/mo
                    → Tyler sub ({money(a.roster[1]?.monthlyLoaded ?? 11200)}/mo) → overheads (
                    {money(a.overheadsJunAugTotal)}/mo) → Bobbie draw ({money(a.roster[0].monthlyLoaded)}
                    /mo) → business surplus ({money(a.monthlySurplusJunAug)}/mo). Surplus waterfall
                    allocation TBD at month-6 review.{" "}
                    <strong>Practitioner tithe:</strong> {money(a.titheMonthly)}/mo = 10% of
                    Bobbie's draw — personal first claim on drawings, not a business deduction.
                  </p>
                  <p>
                    <strong>What sits underneath the engagement — operator couple + software.</strong>{" "}
                    What the buyer is getting on the ground at the store is a two-person operator
                    couple — Sam &amp; Jess on the cockpit — brought in and paid by the contractor.
                    Square at the till, QuickBooks on the books, Local Line for producers, the
                    Headwaters cockpit tying them together. On the buyer's payroll, not the{" "}
                    {money(a.fee)}/mo billing. Tyler (RFF) handles distribution at Sioux Lookout
                    and Deer Lake. Code review + IT setup is a one-time cost (~$2k–$5k) rolled
                    under Tyler's subcontract line when the engagement is confirmed.
                  </p>
                  <p>
                    <strong>Phase 1 trial.</strong> $25,000 flat · 8 weeks · Bobbie solo ·
                    40 hr/wk. Intentionally below Bobbie's cost at full hours ($33,600 draw
                    vs $25,000 flat fee). The $8,600 gap is the entry price for a
                    bounded, below-cost trial. Hardware (computer + server ~$3k–$4k) deferred
                    until ongoing commitment is confirmed.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Software / Sales archetype */}
        <div
          className="rounded-xl border border-card-border bg-card overflow-hidden"
          style={{ borderTopColor: ACCENT_BLUE, borderTopWidth: "4px" }}
        >
          <div className="p-4">
            <p
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: ACCENT_BLUE }}
            >
              Software / Sales archetype
            </p>
            <p
              className="mt-1 text-xl font-semibold"
              style={{ fontFamily: "var(--app-font-serif)", color: "#1A2E60" }}
            >
              {money(bs.revenue)} target · {money(bs.ownerTake)} owner take
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Tithe</p>
                <p className="font-semibold">{money(bs.tithe)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cost basis</p>
                <p className="font-semibold">{money(bs.cost)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Surplus</p>
                <p className="font-semibold">{money(bs.surplus)}</p>
              </div>
            </div>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem
              value="software-detail"
              className="border-t border-card-border border-b-0"
            >
              <AccordionTrigger className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
                Full narrative
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <div className="space-y-3 text-sm leading-relaxed">
                  <p>
                    <strong>Shape.</strong> Leveraged software / services revenue. No fixed
                    engagement window, no on-the-ground roster, no family-infusion stack to retire
                    — profit-share carries the founder's compensation directly, so the
                    Codetry-archetype Capital Recovery legs don't apply.
                  </p>
                  <p>
                    <strong>Canonical example.</strong> Brightside (Recreation Therapy SaaS for
                    LTC). Founder builds, founder sells. {money(bs.revenue)} cumulative revenue
                    target; tithe-first ({bs.tithePct}% off the top, {money(bs.tithe)}); cost
                    basis {money(bs.cost)}; post-tithe surplus {money(bs.surplus)}, split{" "}
                    {bs.ownerTakePct}/{bs.retainedPct} owner take / retained (
                    {money(bs.ownerTake)} owner take). Karen's tool is the next instance of this
                    archetype.
                  </p>
                  <p>
                    <strong>Surplus waterfall.</strong> Tithe (10% off the top, first claim) →
                    Cost basis → 50/50 owner take / reinvestment. There is no signing bonus, no
                    capital recovery line, and no community-engagement payroll book-kept against
                    this archetype. Owner take here is the founder's only profit-share line across
                    all three buckets.
                  </p>
                  <p>
                    <strong>Where it lives in this guide.</strong> The Software/Sales archetype
                    does not carry a numbered V-scenario in the workspace because its economics
                    are book-kept inside the existing Brightside scenario. The numbered scenarios
                    (V3, V4, V5) all describe Codetry-archetype variations applied to Deer Lake.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* ── Shared discipline + lineage — collapsed ── */}
      <Accordion type="multiple" className="space-y-3">

        <AccordionItem
          value="shared"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: ACCENT, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">
                What's held identical across both archetypes
              </span>
              <span className="text-xs text-muted-foreground">
                Tithe-first · no owner take from agency · capital recovery is NOT income
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
              <li>
                <strong>Tithe-first drawing discipline.</strong> 10% of practitioner draw — first
                claim on drawings, not on revenue. The tithe is what was decided, not what was left.
                Personal obligation on Bobbie's draw; not a business expense or a revenue deduction.
              </li>
              <li>
                <strong>No ongoing owner take from agency surplus.</strong> The Codetry archetype's
                agency line never funds a profit share for the founder. Owner take exists only on
                the Software/Sales archetype.
              </li>
              <li>
                <strong>Capital recovery is NOT income, in either presentation.</strong> Whether
                the $112k debt stack is shown as one undivided line (V3/V4) or as two visible legs
                (V5: $40k family-infusion m1 + $72k bank-loan Aug→Oct), it's tax-free debt
                repayment to creditors. Nothing lands on the founder's personal T1; nothing is
                deductible to the business.
              </li>
              <li>
                <strong>Tags and dates.</strong> Every figure ships with a "confirmed" or "TBD"
                tag with the date the founder locked it. Both archetypes obey this rule.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="lineage"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: ACCENT, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">V3 → V4 → V5 → V6 → V7 — the lineage</span>
              <span className="text-xs text-muted-foreground">
                V7 is the locked default · $175/hr Bobbie + $70/hr Tyler · 160 hr/mo · $39,200/mo billed
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="archetypes-lineage-table">
                <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-card-border">
                    <th className="py-2 pr-4 text-left font-medium">Scenario</th>
                    <th className="py-2 pr-4 text-left font-medium">Status</th>
                    <th className="py-2 pr-4 text-left font-medium">Fee × term</th>
                    <th className="py-2 pr-4 text-left font-medium">Roster</th>
                    <th className="py-2 pr-4 text-left font-medium">Lead draw</th>
                    <th className="py-2 pr-4 text-left font-medium">Cap recovery — family (m1)</th>
                    <th className="py-2 pr-4 text-left font-medium">Cap recovery — loan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-card-border">
                    <td className="py-2 pr-4 font-medium">V3 — Lean team</td>
                    <td className="py-2 pr-4 text-muted-foreground">Workspace anchor</td>
                    <td className="py-2 pr-4 num">$90k × 18 mo</td>
                    <td className="py-2 pr-4 num">7 roles</td>
                    <td className="py-2 pr-4 num">$14k/mo</td>
                    <td className="py-2 pr-4 num">—</td>
                    <td className="py-2 pr-4 num">$112k</td>
                  </tr>
                  <tr className="border-b border-card-border">
                    <td className="py-2 pr-4 font-medium">V4 — Right-priced</td>
                    <td className="py-2 pr-4 text-muted-foreground">Historical baseline</td>
                    <td className="py-2 pr-4 num">$105k × 18 mo</td>
                    <td className="py-2 pr-4 num">7 roles</td>
                    <td className="py-2 pr-4 num">$14k/mo</td>
                    <td className="py-2 pr-4 num">—</td>
                    <td className="py-2 pr-4 num">$112k</td>
                  </tr>
                  <tr className="border-b border-card-border">
                    <td className="py-2 pr-4 font-medium">V5 — Codetry archetype</td>
                    <td className="py-2 pr-4 text-muted-foreground">Historical baseline</td>
                    <td className="py-2 pr-4 num">$90k × 12 mo</td>
                    <td className="py-2 pr-4 num">4 roles</td>
                    <td className="py-2 pr-4 num">$18k/mo draw</td>
                    <td className="py-2 pr-4 num">$40k m1</td>
                    <td className="py-2 pr-4 num">$72k (loan only)</td>
                  </tr>
                  <tr className="border-b border-card-border">
                    <td className="py-2 pr-4 font-medium">V6 — Hourly subcontract</td>
                    <td className="py-2 pr-4 text-muted-foreground">Historical baseline</td>
                    <td className="py-2 pr-4 num">$35,200/mo × 12 mo</td>
                    <td className="py-2 pr-4 num">2 (Bobbie + Tyler)</td>
                    <td className="py-2 pr-4 num">$12,800/mo net</td>
                    <td className="py-2 pr-4 num">—</td>
                    <td className="py-2 pr-4 num">TBD</td>
                  </tr>
                  <tr className="font-semibold" style={{ background: ACCENT_SOFT, color: ACCENT_INK }}>
                    <td className="py-2 pr-4">V7 — Updated rates (current)</td>
                    <td className="py-2 pr-4">Locked default</td>
                    <td className="py-2 pr-4 num">$39,200/mo × 12 mo</td>
                    <td className="py-2 pr-4 num">2 (Bobbie + Tyler)</td>
                    <td className="py-2 pr-4 num">$16,800/mo net</td>
                    <td className="py-2 pr-4 num">—</td>
                    <td className="py-2 pr-4 num">TBD</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              V3 is preserved as the workspace anchor so persisted scratch realities stay valid.
              V5 is preserved as a historical baseline ($90k/mo Codetry archetype). V6 is
              preserved as a historical baseline ($150/hr Bobbie). V7 (updated rates, $175/hr)
              is the current single source of truth — the guide reads from V7 only.
            </p>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <div className="flex items-center justify-between pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          data-testid="link-back-index"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Index
        </Link>
        <Link
          href="/contracts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          data-testid="link-to-contracts"
        >
          <Home className="h-4 w-4" />
          See V7 on the Contracts page
        </Link>
      </div>
    </div>
  );
}

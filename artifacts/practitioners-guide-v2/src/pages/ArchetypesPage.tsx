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
          As of 2026-04-29 the model carries <strong>two project archetypes</strong>. The
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
                    <strong>Canonical example.</strong> Deer Lake (V5). {money(a.fee)}/mo agency
                    fee × {a.termMonths} months against a {a.roster.length}-role Day-1 team (
                    {money(a.payrollTotal)}/mo loaded payroll). Capital Recovery{" "}
                    {money(a.familyInfusionRecovery + a.capitalRecoveryAmount)} total, shown as
                    two legs: {money(a.familyInfusionRecovery)} family-infusion leg in month 1 and{" "}
                    {money(a.capitalRecoveryAmount)} business-loan leg Aug → Oct. Phase 3{" "}
                    {money(a.totals18mo.reserve + a.totals18mo.innovation)} split{" "}
                    {a.reservePct}/{a.innovationPct} Reserve / Innovation.
                  </p>
                  <p>
                    <strong>Surplus waterfall.</strong> Tithe (10% off the top, first claim) →
                    Wages → Capital Recovery — family infusion → Capital Recovery — business loan →
                    Reserve / Innovation. The Brightside Launch Month phase is dropped from the
                    agency waterfall — Brightside's pre-launch is funded out of the Innovation
                    bucket once Phase 3 is deployed.
                  </p>
                  <p>
                    <strong>Why front-load the family infusion.</strong> The founder's husband put
                    $40k of family capital into the business. Retiring that obligation in month 1
                    gives the family stack its closure early, lets the business carry only the
                    bank-loan leg through Aug → Oct, and makes the personal-guarantee piece visible
                    as a discrete sibling line. Both legs are tax-free debt repayment — money flows
                    business → husband or business → bank, never through the founder personally.
                    NOT compensation, NOT income, NOT a deductible expense.
                  </p>
                  <p>
                    <strong>What sits underneath the team — operator couple + software.</strong>{" "}
                    The Codetry roster is what the buyer is paying for; what they're getting, on
                    the ground at the store, is a two-person operator couple — Sam &amp; Jess on
                    the cockpit — brought in and paid by the contractor. Square at the till,
                    QuickBooks on the books, Local Line for producers, the Headwaters cockpit tying
                    them together. On the buyer's payroll, not the {money(a.payrollTotal)}/mo
                    Codetry payroll. That's the shape that makes a cost-plus-35% structure fit
                    inside a community's world at this size.
                  </p>
                  <p>
                    <strong>Deferred roles (gated, not deleted).</strong> The V4 7-role roster
                    carried <em>IT/Tech</em>, <em>Community Development Associate</em>, and{" "}
                    <em>Junior Analyst / Field</em> seats that V5 leaves off the Day-1 cost basis.
                    They're deferred and gated against the month-12 renegotiation triggers — when a
                    trigger fires, the engagement steps back up toward the V4 right-priced fee and
                    these seats reappear.
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
                <strong>Tithe-first surplus discipline.</strong> 10% off the top of revenue, first
                claim, before cost basis or any capital allocation. The tithe is what was decided,
                not what was left.
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
              <span className="font-semibold text-sm">V3 → V4 → V5 — the lineage</span>
              <span className="text-xs text-muted-foreground">
                V5 is the locked default · $90k × 12 mo · 4-role · $18k lead draw
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
                  <tr className="font-semibold" style={{ background: ACCENT_SOFT, color: ACCENT_INK }}>
                    <td className="py-2 pr-4">V5 — Codetry archetype (current)</td>
                    <td className="py-2 pr-4">Locked default</td>
                    <td className="py-2 pr-4 num">$90k × 12 mo</td>
                    <td className="py-2 pr-4 num">4 roles</td>
                    <td className="py-2 pr-4 num">$18k/mo</td>
                    <td className="py-2 pr-4 num">$40k m1</td>
                    <td className="py-2 pr-4 num">$72k (loan only)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              V3 is preserved as the workspace anchor so persisted scratch realities stay valid;
              the rest of the guide reads from V5. The Operating Framework page lets you toggle
              V5 ↔ V4 to compare the published default to the right-priced baseline.
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
          See V5 on the Contracts page
        </Link>
      </div>
    </div>
  );
}

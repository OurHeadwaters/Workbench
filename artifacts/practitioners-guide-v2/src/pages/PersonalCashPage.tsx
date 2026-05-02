/**
 * PersonalCashPage — business P&L waterfall + practitioner drawings.
 *
 * Layout (revised 2026-05-02):
 *   1. Monthly business P&L waterfall (always visible):
 *      Revenue → COGS (subcontractors) → Gross Profit → Overhead
 *      → Tithe → Practitioner Drawings → Profit Margin
 *   2. KPI cards: Practitioner Drawings · Profit Margin · Overhead · COGS
 *   3. Accordion: Practitioner annual cash (draw × 12 + Brightside + tax)
 *   4. Footnotes
 */

import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { MoneyKpi } from "@/components/MoneyKpi";
import { FootnoteList } from "@/components/FootnoteList";
import { PERSONAL_CASH_FOOTNOTES } from "@/data/footnotes";
import { money } from "@/lib/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { tbd } from "@/data/tags";

export function PersonalCashPage() {
  const { scenario } = useScenario();
  const p = scenario.personal;
  const a = scenario.contracts.agency;
  const bs = scenario.brightside.surplusDeployment;
  const leadDraw     = a.roster[0].monthlyLoaded;          // 16,800
  const tylerSub     = a.roster[1]?.monthlyLoaded ?? 0;    // 11,200
  const overhead     = a.overheadsJunAugTotal;              // 1,292
  const tithe        = a.titheMonthly;                      // 3,920
  const profitMargin = a.monthlySurplusJunAug;              // 5,988
  const grossProfit  = a.fee - tylerSub;                    // 28,000

  return (
    <div className="space-y-6" data-testid="page-personal-cash">
      <ProvisionalBanner />

      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Business P&L · Practitioner drawings
        </p>
        <h1
          className="mt-2 text-3xl font-semibold"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Where every dollar goes, in plain English.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          Monthly business waterfall — revenue through to profit margin — plus Bobbie's
          practitioner drawings and personal cash across all sources.
        </p>
      </header>

      {/* ── Monthly P&L waterfall — always visible ── */}
      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-card-border">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Monthly business P&L
          </p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {/* Revenue */}
            <tr className="border-b border-card-border">
              <td className="px-4 py-3 font-medium">Revenue</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                Bobbie {money(a.roster[0].monthlyLoaded + tylerSub)} + Tyler {money(tylerSub)} billed to client
              </td>
              <td className="px-4 py-3 text-right num font-semibold">
                {money(a.fee)}
              </td>
            </tr>

            {/* COGS */}
            <tr className="border-b border-card-border text-muted-foreground">
              <td className="px-4 py-3">
                <span className="text-rose-600 mr-1">−</span>
                COGS — subcontractors
              </td>
              <td className="px-4 py-3 text-xs">
                Tyler RFF · 160 hr × $70 · direct pass-through
              </td>
              <td className="px-4 py-3 text-right num text-rose-600">
                ({money(tylerSub)})
              </td>
            </tr>

            {/* Gross Profit */}
            <tr className="border-b border-card-border bg-muted/30">
              <td className="px-4 py-3 font-medium">Gross profit</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {Math.round((grossProfit / a.fee) * 100)}% gross margin
              </td>
              <td className="px-4 py-3 text-right num font-semibold">
                {money(grossProfit)}
              </td>
            </tr>

            {/* Overhead */}
            <tr className="border-b border-card-border text-muted-foreground">
              <td className="px-4 py-3">
                <span className="text-rose-600 mr-1">−</span>
                Overhead
              </td>
              <td className="px-4 py-3 text-xs">
                Space $500 · insurance/petty $500 · accountant $125 · legal $167
              </td>
              <td className="px-4 py-3 text-right num text-rose-600">
                ({money(overhead)})
              </td>
            </tr>

            {/* Tithe */}
            <tr className="border-b border-card-border text-muted-foreground">
              <td className="px-4 py-3">
                <span className="text-rose-600 mr-1">−</span>
                Tithe ({a.tithePct}% of revenue)
              </td>
              <td className="px-4 py-3 text-xs">First claim — giving direction</td>
              <td className="px-4 py-3 text-right num text-rose-600">
                ({money(tithe)})
              </td>
            </tr>

            {/* Practitioner drawings */}
            <tr className="border-b border-card-border text-muted-foreground">
              <td className="px-4 py-3">
                <span className="text-rose-600 mr-1">−</span>
                Practitioner drawings
              </td>
              <td className="px-4 py-3 text-xs">
                Bobbie · 160 hr × $105 net · owner pay
              </td>
              <td className="px-4 py-3 text-right num text-rose-600">
                ({money(leadDraw)})
              </td>
            </tr>

            {/* Profit margin */}
            <tr className="bg-muted/30">
              <td className="px-4 py-3 font-semibold">Profit margin</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {Math.round((profitMargin / a.fee) * 100)}% net margin · surplus waterfall TBD
              </td>
              <td className="px-4 py-3 text-right num font-semibold text-emerald-700">
                {money(profitMargin)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label="Practitioner drawings"
          value={leadDraw}
          tag={a.costBasisTag}
          hint={`${money(p.agencySalary18mo)} over ${a.termMonths} mo`}
          testId="kpi-personal-agency"
        />
        <MoneyKpi
          label="Profit margin"
          value={profitMargin}
          tag={a.costBasisTag}
          hint={`${Math.round((profitMargin / a.fee) * 100)}% net · ${money(profitMargin * a.termMonths)} over ${a.termMonths} mo`}
          tone="positive"
          testId="kpi-personal-total"
        />
        <MoneyKpi
          label="Overhead"
          value={overhead}
          tag={a.overheadsTag}
          hint="space · insurance · accountant · legal"
          testId="kpi-personal-per-year"
        />
        <MoneyKpi
          label="COGS — subcontractors"
          value={tylerSub}
          tag={a.rosterTag}
          hint="Tyler RFF pass-through · 160 hr × $70"
          testId="kpi-personal-brightside"
        />
      </div>

      {/* ── Practitioner annual cash — accordion ── */}
      <Accordion type="multiple" defaultValue={["drawings"]} className="space-y-3">

        <AccordionItem
          value="drawings"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Practitioner drawings — annual personal cash</span>
              <span className="text-xs text-muted-foreground">
                {money(p.total18mo)} total · tax allocation TBD
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-card-border">
                  <td className="py-2 pr-4 font-medium">Practitioner drawings ({a.termMonths} mo)</td>
                  <td className="py-2 pr-4 text-right num">{money(p.agencySalary18mo)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {money(leadDraw)}/mo × {a.termMonths} mo
                  </td>
                </tr>
                <tr className="border-b border-card-border">
                  <td className="py-2 pr-4 font-medium">
                    Brightside owner take
                  </td>
                  <td className="py-2 pr-4 text-right num">~{money(p.brightsideOwnerTake)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {bs.ownerTakePct}% of {money(bs.surplus)} post-tithe surplus
                  </td>
                </tr>
                <tr className="border-b border-card-border font-semibold">
                  <td className="py-2 pr-4">Total personal cash, {a.termMonths} months</td>
                  <td className="py-2 pr-4 text-right num">~{money(p.total18mo)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    ~{money(p.perYear)} / yr
                  </td>
                </tr>
                <tr className="border-b border-card-border text-muted-foreground">
                  <td className="py-2 pr-4 italic">Tax allocation to save</td>
                  <td className="py-2 pr-4 text-right num italic">TBD</td>
                  <td className="py-2 pr-4 text-xs italic">
                    Set aside from draw monthly — income tax + CPP (self-employed)
                  </td>
                </tr>
                <tr className="text-muted-foreground">
                  <td className="py-2 pr-4 italic">Net personal (after tax)</td>
                  <td className="py-2 pr-4 text-right num italic">TBD</td>
                  <td className="py-2 pr-4 text-xs italic">
                    Locks when tax allocation is confirmed
                  </td>
                </tr>
              </tbody>
            </table>
            {p.capitalRecovery > 0 && (
              <div className="mt-3 pt-3 border-t border-dashed border-card-border">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="text-muted-foreground" data-testid="row-personal-family-infusion-recovery">
                      <td className="py-2 pr-4 italic">Capital Recovery — debt repayment</td>
                      <td className="py-2 pr-4 text-right num italic">({money(p.capitalRecovery)})</td>
                      <td className="py-2 pr-4 text-xs italic">
                        Debt repayment — NOT income; flows business → creditor
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-2 text-xs text-muted-foreground">
                  Capital Recovery flows business → creditor and never lands in the founder's personal accounts. Not counted in the personal cash total.
                </p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <FootnoteList notes={PERSONAL_CASH_FOOTNOTES} />
    </div>
  );
}

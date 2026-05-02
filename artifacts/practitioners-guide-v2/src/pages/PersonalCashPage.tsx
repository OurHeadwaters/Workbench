/**
 * PersonalCashPage — founder's total personal cash, all sources.
 *
 * PROGRESSIVE DISCLOSURE PATTERN (see docs/design/progressive-disclosure.md):
 *   - Bucket heading + KPI grid: always visible.
 *   - Full breakdown table and footnotes: collapsed by default.
 *   - Decision signals at a glance: 4 KPI cards (agency salary, Brightside take, total, per-year).
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

export function PersonalCashPage() {
  const { scenario } = useScenario();
  const p = scenario.personal;
  const a = scenario.contracts.agency;
  const bs = scenario.brightside.surplusDeployment;
  const leadDraw = a.roster[0].monthlyLoaded;

  return (
    <div className="space-y-6" data-testid="page-personal-cash">
      <ProvisionalBanner />

      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Personal cash transparency
        </p>
        <h1
          className="mt-2 text-3xl font-semibold"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          The founder's total personal cash, all sources, in one place.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          Across the {a.termMonths}-month engagement window: agency practitioner salary plus
          Brightside owner take. Capital Recovery is shown separately and explicitly flagged as
          debt repayment — NOT income.
        </p>
      </header>

      {/* ── KPI Grid — always visible ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label={`Agency salary (${a.termMonths} mo)`}
          value={p.agencySalary18mo}
          tag={p.tag}
          hint={`${money(leadDraw)}/mo × ${a.termMonths}`}
          testId="kpi-personal-agency"
        />
        <MoneyKpi
          label="Brightside owner take"
          value={p.brightsideOwnerTake}
          tag={p.tag}
          hint={`${bs.ownerTakePct}% of ${money(bs.surplus)} post-tithe surplus`}
          testId="kpi-personal-brightside"
        />
        <MoneyKpi
          label={`Total personal cash, ${a.termMonths} mo`}
          value={p.total18mo}
          tag={p.tag}
          tone="positive"
          testId="kpi-personal-total"
        />
        <MoneyKpi
          label="Per-year average"
          value={p.perYear}
          tag={p.tag}
          tone="positive"
          testId="kpi-personal-per-year"
        />
      </div>

      {/* ── Detail — collapsed by default ── */}
      <Accordion type="multiple" className="space-y-3">

        <AccordionItem
          value="breakdown"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Full breakdown</span>
              <span className="text-xs text-muted-foreground">
                {money(leadDraw)}/mo draw · Brightside {money(p.brightsideOwnerTake)} owner take
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-card-border">
                  <td className="py-2 pr-4 font-medium">Agency practitioner salary</td>
                  <td className="py-2 pr-4 text-right num">{money(p.agencySalary18mo)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {money(leadDraw)}/mo × {a.termMonths} mo
                  </td>
                </tr>
                <tr className="border-b border-card-border">
                  <td className="py-2 pr-4 font-medium">
                    Brightside owner take (at {money(bs.revenue)} revenue target)
                  </td>
                  <td className="py-2 pr-4 text-right num">~{money(p.brightsideOwnerTake)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {bs.ownerTakePct}% of {money(bs.surplus)} post-tithe Brightside surplus
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 pr-4">Total personal cash, {a.termMonths} months</td>
                  <td className="py-2 pr-4 text-right num">~{money(p.total18mo)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    ~{money(p.perYear)} / yr
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="pt-3">
                    <div className="border-t border-dashed border-card-border" />
                  </td>
                </tr>
                {a.familyInfusionRecovery > 0 ? (
                  <tr
                    className="text-muted-foreground"
                    data-testid="row-personal-family-infusion-recovery"
                  >
                    <td className="py-2 pr-4 italic">
                      Capital Recovery — family infusion (m1, business → husband)
                    </td>
                    <td className="py-2 pr-4 text-right num italic">
                      ({money(a.familyInfusionRecovery)})
                    </td>
                    <td className="py-2 pr-4 text-xs italic">
                      Tax-free debt repayment to founder's husband — bypasses founder personally;
                      NOT income
                    </td>
                  </tr>
                ) : null}
                <tr className="text-muted-foreground">
                  <td className="py-2 pr-4 italic">
                    {a.familyInfusionRecovery > 0
                      ? "Capital Recovery — business loan (Aug → Oct, business → bank)"
                      : "Capital Recovery (retired in the first months of the engagement)"}
                  </td>
                  <td className="py-2 pr-4 text-right num italic">
                    ({money(p.capitalRecovery)})
                  </td>
                  <td className="py-2 pr-4 text-xs italic">
                    Debt repayment to{" "}
                    {a.familyInfusionRecovery > 0 ? "bank" : "lender + family"} — NOT income
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted-foreground">
              Both Capital Recovery legs are tax-free debt repayment that flow business → creditor
              and never land in the founder's personal accounts. Neither leg appears on the personal
              income total.
            </p>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <FootnoteList notes={PERSONAL_CASH_FOOTNOTES} />
    </div>
  );
}

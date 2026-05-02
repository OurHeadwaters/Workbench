/**
 * PersonalCashPage — business P&L waterfall + practitioner drawings.
 *
 * Layout (revised 2026-05-02):
 *   1. Monthly business P&L waterfall (always visible):
 *      Revenue → COGS → Gross Profit → Overhead → Gross draw → Business surplus
 *      NOTE: Tithe is NOT a business deduction — personal, first claim on draw.
 *   2. Debt-attack draw allocation: where the $16,800 gross draw goes
 *      ($4,000 take-home · $400 tithe · $12,400 → debt)
 *   3. KPI cards: Personal take-home · Business surplus · Overhead · COGS
 *   4. Accordion: Annual personal cash (draw breakdown + Brightside + tax)
 *   5. Footnotes
 *
 * Debt-attack constants (hard-coded — not in scenario model):
 *   Personal take-home: $2,000 bi-weekly = $4,000/mo
 *   Tithe:              10% of take-home = $400/mo
 *   To debt:            $16,800 − $4,000 − $400 = $12,400/mo
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

// ── Debt-attack personal constants (until $40k + $72k debts are cleared) ──────
const DA_TAKE_HOME_MO = 4_000;   // $2,000 bi-weekly — personal spending
const DA_TITHE_MO     = 400;     // 10% of take-home — first claim on drawings
// DA_TO_DEBT_MO computed from draw below

export function PersonalCashPage() {
  const { scenario } = useScenario();
  const p = scenario.personal;
  const a = scenario.contracts.agency;
  const bs = scenario.brightside.surplusDeployment;
  const leadDraw    = a.roster[0].monthlyLoaded;          // 16,800 — gross draw from business
  const tylerSub    = a.roster[1]?.monthlyLoaded ?? 0;    // 11,200
  const overhead    = a.overheadsJunAugTotal;              // 1,292
  const surplus     = a.monthlySurplusJunAug;              // 9,908 — business surplus (no business tithe)
  const grossProfit = a.fee - tylerSub;                    // 28,000

  const DA_TO_DEBT_MO = leadDraw - DA_TAKE_HOME_MO - DA_TITHE_MO; // 12,400

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
          Business waterfall first — then where the gross draw splits during
          the debt attack ($2,000 bi-weekly take-home · tithe · debt repayment).
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
                Bobbie {money(leadDraw + tylerSub)} + Tyler {money(tylerSub)} billed to client
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

            {/* Gross draw — business transaction */}
            <tr className="border-b border-card-border text-muted-foreground">
              <td className="px-4 py-3">
                <span className="text-rose-600 mr-1">−</span>
                <span>Gross draw to Bobbie</span>
              </td>
              <td className="px-4 py-3 text-xs">
                160 hr × $105 net · see draw allocation below
              </td>
              <td className="px-4 py-3 text-right num text-rose-600">
                ({money(leadDraw)})
              </td>
            </tr>

            {/* Business surplus */}
            <tr className="bg-muted/30">
              <td className="px-4 py-3 font-semibold">Business surplus</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {Math.round((surplus / a.fee) * 100)}% net margin · all goes to debt
              </td>
              <td className="px-4 py-3 text-right num font-semibold text-emerald-700">
                {money(surplus)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Draw allocation — debt attack ── */}
      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-card-border flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Draw allocation · debt attack mode
          </p>
          <span
            className="text-[9px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded-full font-bold"
            style={{ background: "#fef3c7", color: "#92400e" }}
          >
            Until debt-free
          </span>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-card-border">
              <td className="px-4 py-3 font-medium">Gross draw received</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">from business</td>
              <td className="px-4 py-3 text-right num font-semibold">{money(leadDraw)}</td>
            </tr>
            <tr className="border-b border-card-border text-muted-foreground">
              <td className="px-4 py-3">
                <span className="text-rose-600 mr-1">−</span>
                Tithe (10% of take-home · first claim)
              </td>
              <td className="px-4 py-3 text-xs">personal · on drawings only · not business expense</td>
              <td className="px-4 py-3 text-right num text-rose-600">({money(DA_TITHE_MO)})</td>
            </tr>
            <tr className="border-b border-card-border text-muted-foreground">
              <td className="px-4 py-3">
                <span className="text-rose-600 mr-1">−</span>
                Personal take-home
              </td>
              <td className="px-4 py-3 text-xs">$2,000 bi-weekly · living expenses</td>
              <td className="px-4 py-3 text-right num text-rose-600">({money(DA_TAKE_HOME_MO)})</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 font-semibold">From draw → debt repayment</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                draw − tithe − take-home · plus {money(surplus)}/mo business surplus
              </td>
              <td className="px-4 py-3 text-right num font-semibold text-emerald-700">
                {money(DA_TO_DEBT_MO)}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          className="px-4 py-3 border-t border-card-border flex items-center justify-between"
          style={{ background: "hsl(var(--muted)/0.4)" }}
        >
          <span className="text-xs text-muted-foreground">
            Total stacked toward debt per month
          </span>
          <span className="text-sm font-bold tabular-nums" style={{ color: "#92400e" }}>
            {money(DA_TO_DEBT_MO + surplus)}
          </span>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label="Personal take-home"
          value={DA_TAKE_HOME_MO}
          tag={a.costBasisTag}
          hint="$2,000 bi-weekly · debt attack · steady-state TBD"
          testId="kpi-personal-agency"
        />
        <MoneyKpi
          label="Business surplus"
          value={surplus}
          tag={a.costBasisTag}
          hint={`${Math.round((surplus / a.fee) * 100)}% net · ${money(surplus * a.termMonths)} over ${a.termMonths} mo`}
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
              <span className="font-semibold text-sm">Gross draw — annual allocation</span>
              <span className="text-xs text-muted-foreground">
                {money(p.agencySalary18mo)} gross · debt attack breakdown
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-card-border">
                  <td className="py-2 pr-4 font-medium">Gross draw ({a.termMonths} mo)</td>
                  <td className="py-2 pr-4 text-right num">{money(p.agencySalary18mo)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {money(leadDraw)}/mo × {a.termMonths} mo
                  </td>
                </tr>
                <tr className="border-b border-card-border text-muted-foreground">
                  <td className="py-2 pr-4 italic">
                    − Tithe ({a.tithePct}% of take-home · first claim)
                  </td>
                  <td className="py-2 pr-4 text-right num italic">({money(DA_TITHE_MO * a.termMonths)})</td>
                  <td className="py-2 pr-4 text-xs italic">
                    {money(DA_TITHE_MO)}/mo · personal giving
                  </td>
                </tr>
                <tr className="border-b border-card-border text-muted-foreground">
                  <td className="py-2 pr-4 italic">
                    − Personal take-home ($2k bi-weekly)
                  </td>
                  <td className="py-2 pr-4 text-right num italic">({money(DA_TAKE_HOME_MO * a.termMonths)})</td>
                  <td className="py-2 pr-4 text-xs italic">
                    {money(DA_TAKE_HOME_MO)}/mo · living expenses
                  </td>
                </tr>
                <tr className="border-b border-card-border text-muted-foreground">
                  <td className="py-2 pr-4 italic">
                    → Debt repayment (from draw)
                  </td>
                  <td className="py-2 pr-4 text-right num italic">{money(DA_TO_DEBT_MO * a.termMonths)}</td>
                  <td className="py-2 pr-4 text-xs italic">
                    {money(DA_TO_DEBT_MO)}/mo → $40k + $72k
                  </td>
                </tr>
                <tr className="border-b border-card-border">
                  <td className="py-2 pr-4 font-medium">
                    Brightside owner take
                  </td>
                  <td className="py-2 pr-4 text-right num">~{money(p.brightsideOwnerTake)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {bs.ownerTakePct}% of Brightside surplus
                  </td>
                </tr>
                <tr className="border-b border-card-border text-muted-foreground">
                  <td className="py-2 pr-4 italic">Tax allocation to save</td>
                  <td className="py-2 pr-4 text-right num italic">TBD</td>
                  <td className="py-2 pr-4 text-xs italic">
                    Income tax + CPP (self-employed) — set aside monthly
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
                        Flows business → creditor · NOT income
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <FootnoteList notes={PERSONAL_CASH_FOOTNOTES} />
    </div>
  );
}

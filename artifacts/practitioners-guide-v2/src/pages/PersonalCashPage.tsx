/**
 * PersonalCashPage — business P&L waterfall + practitioner drawings.
 *
 * Layout:
 *   1. Monthly business P&L waterfall (debt-attack mode):
 *      Revenue → COGS → Gross Profit → Overhead → Draw (DA: $4k only) → Business surplus
 *      NOTE: Tithe is NOT a business deduction — personal, first claim on draw.
 *   2. Draw allocation: where the $4,000 draw goes (tithe · take-home)
 *   3. KPI cards: Personal take-home · Business surplus · Overhead · COGS
 *   4. Accordion: Annual personal cash breakdown
 *   5. Footnotes
 *
 * Debt-attack constants (hard-coded — practitioner decision, not a contract term):
 *   Draw from business: $4,000/mo — only draw taken during debt attack
 *   Tithe:             10% of draw = $400/mo (first claim on drawings)
 *   Personal take-home: $4,000 − $400 = $3,600/mo ($1,800 bi-weekly)
 *   Forgone draw:       $16,800 contractual draw − $4,000 = $12,800 stays in business surplus
 *   Business surplus:   $39,200 − $11,200 − $1,292 − $4,000 = $22,708/mo → all to debt
 */

import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { MoneyKpi } from "@/components/MoneyKpi";
import { money } from "@/lib/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ── Debt-attack personal constants (until capital buffer + debt cleared) ───────
const DA_DRAW_MO      = 4_000;  // only draw taken from business — rest forgone to surplus
const DA_TITHE_MO     = 400;    // 10% of draw — first claim on drawings, personal obligation
const DA_TAKE_HOME_MO = DA_DRAW_MO - DA_TITHE_MO; // 3,600 — actual spending money

export function PersonalCashPage() {
  const { scenario } = useScenario();
  const p = scenario.personal;
  const a = scenario.contracts.agency;
  const bs = scenario.brightside.surplusDeployment;

  const tylerSub    = a.roster[1]?.monthlyLoaded ?? 0;  // 11,200 — Tyler pass-through
  const overhead    = a.overheadsJunAugTotal;            // 1,292
  const grossProfit = a.fee - tylerSub;                  // 28,000

  // Debt-attack business surplus — uses actual DA draw, not full contractual draw
  const daBusinessSurplus =
    a.fee - tylerSub - overhead - DA_DRAW_MO; // 39,200 − 11,200 − 1,292 − 4,000 = 22,708

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
          Debt-attack mode: Bobbie draws only $4,000/mo from the business — the
          rest is forgone and stays as business surplus, all of which goes to
          debt. Tithe ($400) is first claim on the draw; take-home is $3,600.
        </p>
      </header>

      {/* ── Monthly P&L waterfall — debt-attack mode ── */}
      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-card-border flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Monthly business P&L — debt attack
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
            {/* Revenue */}
            <tr className="border-b border-card-border">
              <td className="px-4 py-3 font-medium">Revenue</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                Bobbie {money(a.fee - tylerSub)} + Tyler {money(tylerSub)} billed to client
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

            {/* Draw — debt-attack only: $4,000 not $16,800 */}
            <tr className="border-b border-card-border text-muted-foreground">
              <td className="px-4 py-3">
                <span className="text-rose-600 mr-1">−</span>
                <span>Draw to Bobbie</span>
              </td>
              <td className="px-4 py-3 text-xs">
                debt-attack draw only · contractual rate is $16,800/mo · $12,800 forgone to surplus
              </td>
              <td className="px-4 py-3 text-right num text-rose-600">
                ({money(DA_DRAW_MO)})
              </td>
            </tr>

            {/* Business surplus */}
            <tr className="bg-muted/30">
              <td className="px-4 py-3 font-semibold">Business surplus</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {Math.round((daBusinessSurplus / a.fee) * 100)}% net margin · all goes to debt
              </td>
              <td className="px-4 py-3 text-right num font-semibold text-emerald-700">
                {money(daBusinessSurplus)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Draw allocation ── */}
      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-card-border flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Draw allocation
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
              <td className="px-4 py-3 font-medium">Draw received</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">from business · only amount taken</td>
              <td className="px-4 py-3 text-right num font-semibold">{money(DA_DRAW_MO)}</td>
            </tr>
            <tr className="border-b border-card-border text-muted-foreground">
              <td className="px-4 py-3">
                <span className="text-rose-600 mr-1">−</span>
                Tithe (10% · first claim)
              </td>
              <td className="px-4 py-3 text-xs">personal · on drawings only · not a business expense</td>
              <td className="px-4 py-3 text-right num text-rose-600">({money(DA_TITHE_MO)})</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 font-semibold">Personal take-home</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">$1,800 bi-weekly · living expenses · draw fully consumed</td>
              <td className="px-4 py-3 text-right num font-semibold">{money(DA_TAKE_HOME_MO)}</td>
            </tr>
          </tbody>
        </table>
        <div
          className="px-4 py-3 border-t border-card-border flex items-center justify-between"
          style={{ background: "hsl(var(--muted)/0.4)" }}
        >
          <span className="text-xs text-muted-foreground">
            Total stacked toward debt per month (business surplus only)
          </span>
          <span className="text-sm font-bold tabular-nums" style={{ color: "#92400e" }}>
            {money(daBusinessSurplus)}
          </span>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label="Personal take-home"
          value={DA_TAKE_HOME_MO}
          tag={a.costBasisTag}
          hint="$1,800 bi-weekly · after $400 tithe · debt attack"
          testId="kpi-personal-agency"
        />
        <MoneyKpi
          label="Business surplus → debt"
          value={daBusinessSurplus}
          tag={a.costBasisTag}
          hint={`${Math.round((daBusinessSurplus / a.fee) * 100)}% net · ${money(daBusinessSurplus * a.termMonths)} over ${a.termMonths} mo`}
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
              <span className="font-semibold text-sm">Draw — annual (debt-attack basis)</span>
              <span className="text-xs text-muted-foreground">
                {money(DA_DRAW_MO * a.termMonths)} drawn · {money(daBusinessSurplus * a.termMonths)} surplus to debt
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-card-border">
                  <td className="py-2 pr-4 font-medium">Draw from business ({a.termMonths} mo)</td>
                  <td className="py-2 pr-4 text-right num">{money(DA_DRAW_MO * a.termMonths)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {money(DA_DRAW_MO)}/mo · contractual rate {money(a.roster[0].monthlyLoaded)}/mo forgone
                  </td>
                </tr>
                <tr className="border-b border-card-border text-muted-foreground">
                  <td className="py-2 pr-4 italic">
                    − Tithe ({a.tithePct}% of draw · first claim)
                  </td>
                  <td className="py-2 pr-4 text-right num italic">({money(DA_TITHE_MO * a.termMonths)})</td>
                  <td className="py-2 pr-4 text-xs italic">
                    {money(DA_TITHE_MO)}/mo · personal giving
                  </td>
                </tr>
                <tr className="border-b border-card-border">
                  <td className="py-2 pr-4 font-medium">Personal take-home ({a.termMonths} mo)</td>
                  <td className="py-2 pr-4 text-right num">{money(DA_TAKE_HOME_MO * a.termMonths)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {money(DA_TAKE_HOME_MO)}/mo · draw fully consumed by tithe + living
                  </td>
                </tr>
                <tr className="border-b border-card-border">
                  <td className="py-2 pr-4 font-medium">
                    Business surplus to debt ({a.termMonths} mo)
                  </td>
                  <td className="py-2 pr-4 text-right num text-emerald-700">{money(daBusinessSurplus * a.termMonths)}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {money(daBusinessSurplus)}/mo · entire business surplus → $40k + $72k
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

    </div>
  );
}

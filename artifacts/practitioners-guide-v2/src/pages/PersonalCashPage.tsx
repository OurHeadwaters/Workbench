import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { SectionCard } from "@/components/SectionCard";
import { MoneyKpi } from "@/components/MoneyKpi";
import { FootnoteList } from "@/components/FootnoteList";
import { PERSONAL_CASH_FOOTNOTES } from "@/data/footnotes";
import { money } from "@/lib/format";

export function PersonalCashPage() {
  const { scenario } = useScenario();
  const p = scenario.personal;

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
          Across the 18-month window: agency practitioner salary plus Brightside owner take.
          Capital Recovery is shown separately and explicitly flagged as debt repayment to lender
          and family — NOT income.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label="Agency salary (18 mo)"
          value={p.agencySalary18mo}
          tag={p.tag}
          hint="$14k/mo × 18"
          testId="kpi-personal-agency"
        />
        <MoneyKpi
          label="Brightside owner take"
          value={p.brightsideOwnerTake}
          tag={p.tag}
          hint="50% of $74k surplus"
          testId="kpi-personal-brightside"
        />
        <MoneyKpi
          label="Total personal cash, 18 mo"
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

      <SectionCard title="The breakdown" tag={p.tag}>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-card-border">
              <td className="py-2 pr-4 font-medium">Agency practitioner salary</td>
              <td className="py-2 pr-4 text-right num">{money(p.agencySalary18mo)}</td>
              <td className="py-2 pr-4 text-xs text-muted-foreground">$14k/mo × 18 mo</td>
            </tr>
            <tr className="border-b border-card-border">
              <td className="py-2 pr-4 font-medium">Brightside owner take (at $120k revenue target)</td>
              <td className="py-2 pr-4 text-right num">~{money(p.brightsideOwnerTake)}</td>
              <td className="py-2 pr-4 text-xs text-muted-foreground">50% of ~$74k Brightside surplus</td>
            </tr>
            <tr className="font-semibold">
              <td className="py-2 pr-4">Total personal cash, 18 months</td>
              <td className="py-2 pr-4 text-right num">~{money(p.total18mo)}</td>
              <td className="py-2 pr-4 text-xs text-muted-foreground">~{money(p.perYear)} / yr</td>
            </tr>
            <tr>
              <td colSpan={3} className="pt-3"><div className="border-t border-dashed border-card-border" /></td>
            </tr>
            <tr className="text-muted-foreground">
              <td className="py-2 pr-4 italic">Capital Recovery (Phase 1, retired in the first months of the engagement)</td>
              <td className="py-2 pr-4 text-right num italic">({money(p.capitalRecovery)})</td>
              <td className="py-2 pr-4 text-xs italic">Debt repayment to lender + family — NOT income</td>
            </tr>
          </tbody>
        </table>
      </SectionCard>

      <FootnoteList notes={PERSONAL_CASH_FOOTNOTES} />
    </div>
  );
}

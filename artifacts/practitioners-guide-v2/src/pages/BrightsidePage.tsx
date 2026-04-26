import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { SectionCard } from "@/components/SectionCard";
import { MoneyKpi } from "@/components/MoneyKpi";
import { FootnoteList } from "@/components/FootnoteList";
import { BRIGHTSIDE_FOOTNOTES } from "@/data/footnotes";
import { BUCKETS } from "@/data/buckets";
import { money, pct } from "@/lib/format";

export function BrightsidePage() {
  const { scenario } = useScenario();
  const bs = scenario.brightside;
  const b = BUCKETS.brightside;

  return (
    <div className="space-y-6" data-testid="page-brightside">
      <ProvisionalBanner />

      <header>
        <p
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: b.accent }}
        >
          {b.name} · Brightside RT-LTC
        </p>
        <h1
          className="mt-2 text-3xl font-semibold"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Recreation Therapy software for Long-Term Care.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          Mobile-first SaaS. Founder builds, founder sells. No incremental headcount beyond the
          contract engineer. Hardware is BYOD on customer-owned tablets — no separate SKU.
          Home-care market shelved with a clear reactivation criterion.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label="18-mo revenue target"
          value={bs.revenueTarget.cumulative18mo}
          tag={bs.revenueTarget.tag}
          accent={b.accent}
          hint={`Exit ARR ~${money(bs.revenueTarget.exitArr)}`}
          testId="kpi-brightside-revenue"
        />
        <MoneyKpi
          label="18-mo cost basis"
          value={bs.costBasis.total18mo}
          tag={bs.costBasis.tag}
          tone="muted"
          accent={b.accent}
          hint={`${money(bs.costBasis.prelaunchTotal)} one-time + ${money(bs.costBasis.recurringMonthlyTotal)}/mo recurring`}
          testId="kpi-brightside-cost"
        />
        <MoneyKpi
          label="Surplus over 18 mo"
          value={bs.surplusDeployment.surplus}
          tag={bs.surplusDeployment.tag}
          tone="positive"
          accent={b.accent}
          testId="kpi-brightside-surplus"
        />
        <MoneyKpi
          label="Owner take (50%)"
          value={bs.surplusDeployment.ownerTake}
          tag={bs.surplusDeployment.tag}
          tone="positive"
          accent={b.accent}
          hint="Founder's only profit-share line"
          testId="kpi-brightside-owner-take"
        />
      </div>

      <SectionCard
        title="Product framing"
        tag={bs.product.tag}
        accent={b.accent}
      >
        <p className="text-sm">{bs.product.description}</p>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Row label="Customer scope" value={bs.product.customerScope} />
          <Row label="Home-care services" value={bs.product.homecareStatus} />
        </dl>
      </SectionCard>

      <SectionCard
        title="Pricing model"
        tag={bs.pricing.tag}
        accent={b.accent}
      >
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr className="border-b border-card-border">
              <th className="py-2 pr-4 font-medium">Component</th>
              <th className="py-2 pr-4 font-medium text-right num">$</th>
              <th className="py-2 pr-4 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            <PriceRow
              name={`Tier 1 (${bs.pricing.tier1.threshold})`}
              amount={bs.pricing.tier1.monthly}
              suffix="/ mo per facility"
              note="Small / standard facility"
            />
            <PriceRow
              name={`Tier 2 (${bs.pricing.tier2.threshold})`}
              amount={bs.pricing.tier2.monthly}
              suffix="/ mo per facility"
              note="Larger facility"
            />
            <PriceRow
              name="Per-resident overage"
              amount={bs.pricing.perResidentOverage}
              suffix="/ resident / mo"
              note="Above the 60-resident threshold"
            />
            <PriceRow
              name="Setup fee"
              amount={bs.pricing.setupFee}
              suffix="one-time"
              note="Data migration + initial config"
            />
            <PriceRow
              name="Training engagement"
              amount={bs.pricing.trainingPerFacility}
              suffix="per facility"
              note="Single-day workshop"
            />
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">
          Chain / multi-facility pricing is explicit upside, NOT in baseline. A regional operator (5–50 facilities) could 2–3x the surplus.
        </p>
      </SectionCard>

      <SectionCard
        title="Build & sell model"
        tag={bs.buildModel.tag}
        accent={b.accent}
      >
        <p className="text-sm">{bs.buildModel.description}</p>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Row label="Founder time cash cost" value={`${money(bs.buildModel.founderTimeCashCost)} (already paid via $18k/mo agency salary)`} />
          <Row label="Pre-launch engineer cap" value={money(bs.buildModel.prelaunchEngineerCap)} />
          <Row label="Pre-launch payment month" value={bs.buildModel.prelaunchPaymentMonth} />
        </dl>
      </SectionCard>

      <SectionCard
        title="18-month revenue target"
        tag={bs.revenueTarget.tag}
        accent={b.accent}
      >
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Row label="Cumulative revenue target" value={money(bs.revenueTarget.cumulative18mo)} />
          <Row label="Exit ARR" value={`~${money(bs.revenueTarget.exitArr)}`} />
          <Row label="Customer ramp" value={bs.revenueTarget.customerRamp} />
          <Row label="Mix assumption" value={bs.revenueTarget.mixAssumption} />
          <Row label="Revenue starts" value={bs.revenueTarget.revenueStartWindow} />
        </dl>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title={`Pre-launch one-time · ${money(bs.costBasis.prelaunchTotal)}`}
          subtitle="All paid in Brightside Launch Month — funded from agency surplus."
          tag={bs.costBasis.tag}
          accent={b.accent}
        >
          <table className="w-full text-sm">
            <tbody>
              {bs.costBasis.prelaunchOneTime.map((line) => (
                <tr key={line.name} className="border-b border-card-border align-top">
                  <td className="py-1.5 pr-4">
                    <div className="font-medium">{line.name}</div>
                    <div className="text-xs text-muted-foreground">{line.notes}</div>
                  </td>
                  <td className="py-1.5 pr-4 text-right num">{money(line.amount)}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-1.5 pr-4">Total pre-launch one-time</td>
                <td className="py-1.5 pr-4 text-right num">{money(bs.costBasis.prelaunchTotal)}</td>
              </tr>
            </tbody>
          </table>
        </SectionCard>

        <SectionCard
          title={`Recurring monthly · ${money(bs.costBasis.recurringMonthlyTotal)}/mo`}
          subtitle="Post-launch — Oct 2026 onward, 14 months."
          tag={bs.costBasis.tag}
          accent={b.accent}
        >
          <table className="w-full text-sm">
            <tbody>
              {bs.costBasis.recurringMonthly.map((line) => (
                <tr key={line.name} className="border-b border-card-border align-top">
                  <td className="py-1.5 pr-4">
                    <div className="font-medium">{line.name}</div>
                    <div className="text-xs text-muted-foreground">{line.notes}</div>
                  </td>
                  <td className="py-1.5 pr-4 text-right num">{money(line.amount)}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-1.5 pr-4">Subtotal recurring</td>
                <td className="py-1.5 pr-4 text-right num">{money(bs.costBasis.recurringMonthlyTotal)}/mo</td>
              </tr>
            </tbody>
          </table>
        </SectionCard>
      </div>

      <SectionCard
        title="Surplus deployment — 50/50 default split"
        tag={bs.surplusDeployment.tag}
        accent={b.accent}
      >
        <table className="w-full text-sm">
          <tbody>
            <PLRow label="Revenue (target)" value={bs.surplusDeployment.revenue} />
            <PLRow label="Cost basis" value={-bs.surplusDeployment.cost} />
            <PLRow label="Surplus" value={bs.surplusDeployment.surplus} bold tone="positive" />
            <tr><td colSpan={2} className="pt-3"><div className="border-t border-dashed border-card-border" /></td></tr>
            <PLRow
              label={`Retained in Brightside (${pct(bs.surplusDeployment.retainedPct)})`}
              value={bs.surplusDeployment.retained}
              tone="muted"
            />
            <PLRow
              label={`Owner take (${pct(bs.surplusDeployment.ownerTakePct)}) — founder's only profit-share line`}
              value={bs.surplusDeployment.ownerTake}
              tone="positive"
            />
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">
          Founder retains discretion to shift the split toward retained if Brightside requires capital reinvestment to scale (e.g. chain-deal win, dedicated team) — captured as "balance shifts to brightside agency work."
        </p>
      </SectionCard>

      <SectionCard
        title="Downside coverage"
        subtitle={`Source: ${bs.downsideCoverage.sourceBucket}`}
        tag={bs.downsideCoverage.tag}
        accent={b.accent}
      >
        <p className="text-sm text-muted-foreground">
          If Brightside revenue undershoots and cannot cover its own cost basis, the source bucket
          absorbs the shortfall. Clean accounting framing: <strong className="text-foreground">Brightside IS the innovation investment.</strong>
        </p>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <Row label="Source bucket size" value={money(bs.downsideCoverage.sourceAmount)} />
          <Row label="Maximum exposure" value={money(bs.downsideCoverage.maxExposure)} />
          <Row label="Coverage ratio" value={`~${pct(bs.downsideCoverage.coveragePct)} of source`} />
        </dl>
      </SectionCard>

      <FootnoteList notes={BRIGHTSIDE_FOOTNOTES} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground sm:text-right">{value}</dd>
    </>
  );
}

function PriceRow({ name, amount, suffix, note }: { name: string; amount: number; suffix: string; note: string }) {
  return (
    <tr className="border-b border-card-border align-top">
      <td className="py-2 pr-4 font-medium">{name}</td>
      <td className="py-2 pr-4 text-right num whitespace-nowrap">
        {money(amount)} <span className="text-xs text-muted-foreground font-normal">{suffix}</span>
      </td>
      <td className="py-2 pr-4 text-xs text-muted-foreground">{note}</td>
    </tr>
  );
}

function PLRow({ label, value, bold, tone }: { label: string; value: number; bold?: boolean; tone?: "positive" | "muted" }) {
  const cls = [
    "py-1.5 num text-right",
    bold ? "font-semibold" : "",
    tone === "positive"
      ? "text-[hsl(167_60%_22%)]"
      : tone === "muted"
        ? "text-muted-foreground"
        : "text-foreground",
  ].join(" ");
  const sign = value < 0 ? "(" : "";
  const close = value < 0 ? ")" : "";
  return (
    <tr className="border-b border-card-border">
      <td className={`py-1.5 pr-4 ${bold ? "font-semibold" : ""}`}>{label}</td>
      <td className={cls}>{sign}{money(Math.abs(value))}{close}</td>
    </tr>
  );
}

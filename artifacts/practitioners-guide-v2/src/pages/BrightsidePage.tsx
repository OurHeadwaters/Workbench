/**
 * BrightsidePage — Software / Hardware / Training bucket.
 *
 * PROGRESSIVE DISCLOSURE PATTERN (see docs/design/progressive-disclosure.md):
 *   - Bucket heading + status: always visible.
 *   - Product detail, pricing table, cost breakdown, surplus deployment: collapsed by default.
 *
 * HONEST STATUS: "Pre-revenue"
 *   The $120k cumulative revenue figure is a modelling scenario, not a plan.
 *   No LTC pilot site has committed. No first sales cycle has closed.
 *   This section replaces the fake target with framing questions around
 *   first pilot commitment and the real cost-to-revenue path.
 */

import { Link } from "wouter";
import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { MoneyKpi } from "@/components/MoneyKpi";
import { BUCKETS } from "@/data/buckets";
import { money, pct } from "@/lib/format";
import { buildBrightsideLedger } from "@/data/brightsideLedger";
import { ExportLedgerButtons } from "@/components/ExportLedgerButtons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle } from "lucide-react";

export function BrightsidePage() {
  const { scenario } = useScenario();
  const bs = scenario.brightside;
  const b = BUCKETS.brightside;

  return (
    <div className="space-y-6" data-testid="page-brightside">
      <ProvisionalBanner />

      {/* ── Back to dashboard ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: b.accent }}
          >
            {b.name} · Brightside RT-LTC
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <h1
              className="text-3xl font-semibold"
              style={{ fontFamily: "var(--app-font-serif)" }}
            >
              Recreation Therapy software for Long-Term Care.
            </h1>
            <StatusBadge status="pre-revenue" label="Pre-revenue" />
          </div>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            Mobile-first SaaS. Founder builds, founder sells. No incremental headcount beyond
            the contract engineer. The pricing model and cost basis are confirmed — but no LTC
            site has committed to a pilot yet. Revenue is a modelling scenario, not a plan.
          </p>
        </div>
        <ExportLedgerButtons
          buildLedger={() => buildBrightsideLedger(scenario)}
          testIdPrefix="brightside"
        />
      </header>

      {/* ── Framing questions — pre-revenue stage ── */}
      <div
        className="rounded-xl border border-blue-200 bg-blue-50 p-4"
        data-testid="brightside-framing-questions"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-blue-900">
              Questions that determine whether {money(bs.surplusDeployment.revenue)} is achievable
            </p>
            <p className="text-xs text-blue-700">
              The {money(bs.surplusDeployment.revenue)} cumulative revenue figure is a modelling
              input — what the math needs to be true to produce the surplus shown below.
              None of these conditions are met yet.
            </p>
            <div className="space-y-2 text-blue-800">
              <FramingQuestion
                q="What would a pilot LTC site actually commit to?"
                context={`A signed pilot at Tier 1 ($${bs.pricing.tier1.monthly}/mo) + setup ($${bs.pricing.setupFee}) is the first real revenue event. What does a yes from an LTC administrator look like, and what do they need to see before signing?`}
              />
              <FramingQuestion
                q="What is the real cost to get to first revenue?"
                context={`The pre-launch one-time spend is ${money(bs.costBasis.prelaunchTotal)} (engineer cap ${money(bs.buildModel.prelaunchEngineerCap)} + PHIPA/PIPEDA audit $5k + legal $3k). First revenue window: ${bs.revenueTarget.revenueStartWindow}. What milestones gate payment of each cost line?`}
              />
              <FramingQuestion
                q="What is the minimum customer count to break even on recurring costs?"
                context={`Recurring monthly cost is ${money(bs.costBasis.recurringMonthlyTotal)}/mo. At ${money(bs.pricing.tier1.monthly)}/mo per Tier 1 facility, that's ${Math.ceil(bs.costBasis.recurringMonthlyTotal / bs.pricing.tier1.monthly)} facilities to cover recurring costs. How long does the first sales cycle take?`}
              />
              <FramingQuestion
                q="What does the 22-facility ramp actually require?"
                context={`The model assumes 0 → ~22 LTC facilities over 18 months. What are the real barriers — PHIPA compliance, facility IT procurement cycles, staff training capacity? Build the honest ramp before counting on the revenue.`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Grid — modelling figures, clearly labelled ── */}
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.15em]">
        Modelling scenario — numbers lock when a pilot site commits
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label="18-mo revenue scenario"
          value={bs.revenueTarget.cumulative18mo}
          tag={bs.revenueTarget.tag}
          accent={b.accent}
          hint={`Exit ARR ~${money(bs.revenueTarget.exitArr)} — not yet pursued`}
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
          label="Surplus (if scenario lands)"
          value={bs.surplusDeployment.surplus}
          tag={bs.surplusDeployment.tag}
          tone="positive"
          accent={b.accent}
          testId="kpi-brightside-surplus"
        />
        <MoneyKpi
          label="Owner take 50% (scenario)"
          value={bs.surplusDeployment.ownerTake}
          tag={bs.surplusDeployment.tag}
          tone="positive"
          accent={b.accent}
          hint="Founder's only profit-share line — pre-revenue"
          testId="kpi-brightside-owner-take"
        />
      </div>

      {/* ── Detail sections — collapsed by default ── */}
      <Accordion type="multiple" className="space-y-3">

        <AccordionItem
          value="product"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Product framing</span>
              <span className="text-xs text-muted-foreground">
                {bs.product.customerScope} · home-care {bs.product.homecareStatus.includes("shelved") ? "shelved" : "active"}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-sm">{bs.product.description}</p>
            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Row label="Customer scope" value={bs.product.customerScope} />
              <Row label="Home-care services" value={bs.product.homecareStatus} />
            </dl>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="pricing"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Pricing model</span>
              <span className="text-xs text-muted-foreground">
                Tier 1 {money(bs.pricing.tier1.monthly)}/mo · Tier 2 {money(bs.pricing.tier2.monthly)}/mo per facility
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
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
              Chain / multi-facility pricing is explicit upside, NOT in baseline. A regional
              operator (5–50 facilities) could 2–3x the surplus.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="build-model"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Build &amp; sell model</span>
              <span className="text-xs text-muted-foreground">
                Pre-launch engineer cap {money(bs.buildModel.prelaunchEngineerCap)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-sm">{bs.buildModel.description}</p>
            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Row label="Founder time cash cost" value={`${money(bs.buildModel.founderTimeCashCost)} (already paid via agency salary)`} />
              <Row label="Pre-launch engineer cap" value={money(bs.buildModel.prelaunchEngineerCap)} />
              <Row label="Pre-launch payment month" value={bs.buildModel.prelaunchPaymentMonth} />
            </dl>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="revenue-target"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">18-month revenue scenario</span>
              <span className="text-xs text-muted-foreground">
                {money(bs.revenueTarget.cumulative18mo)} cumulative scenario · exit ARR ~{money(bs.revenueTarget.exitArr)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-3">
              This is a modelling scenario showing what needs to be true for the surplus math to work —
              not a committed plan. No pilot site has signed. Revenue starts: {bs.revenueTarget.revenueStartWindow}.
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Row label="Cumulative revenue scenario" value={money(bs.revenueTarget.cumulative18mo)} />
              <Row label="Exit ARR scenario" value={`~${money(bs.revenueTarget.exitArr)}`} />
              <Row label="Customer ramp assumed" value={bs.revenueTarget.customerRamp} />
              <Row label="Mix assumption" value={bs.revenueTarget.mixAssumption} />
              <Row label="Revenue starts" value={bs.revenueTarget.revenueStartWindow} />
            </dl>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="cost-basis"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Cost basis</span>
              <span className="text-xs text-muted-foreground">
                {money(bs.costBasis.prelaunchTotal)} one-time + {money(bs.costBasis.recurringMonthlyTotal)}/mo recurring
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Pre-launch one-time · {money(bs.costBasis.prelaunchTotal)}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Funded from the Innovation bucket in Phase 3 (V5 — no dedicated Brightside Launch Month).
                </p>
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
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Recurring monthly · {money(bs.costBasis.recurringMonthlyTotal)}/mo
                </p>
                <p className="text-xs text-muted-foreground mb-2">Post-launch — Oct 2026 onward, 14 months.</p>
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
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="surplus"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">
                Surplus deployment — tithe-first, then {bs.surplusDeployment.retainedPct}/{bs.surplusDeployment.ownerTakePct} split
              </span>
              <span className="text-xs text-muted-foreground">
                Owner take {money(bs.surplusDeployment.ownerTake)} (scenario)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-3">
              Brightside mirrors the agency-line tithe-first discipline: 10% off the top to Giving,
              then cost basis, then a 50/50 split on what's left. These numbers apply if the
              revenue scenario lands — they are not locked actuals.
            </p>
            <table className="w-full text-sm">
              <tbody>
                <PLRow label="Revenue (scenario)" value={bs.surplusDeployment.revenue} />
                <PLRow
                  label={`Tithe — Giving (${pct(bs.surplusDeployment.tithePct)} off the top, first claim)`}
                  value={-bs.surplusDeployment.tithe}
                />
                <PLRow
                  label="Revenue net of tithe"
                  value={bs.surplusDeployment.revenueAfterTithe}
                  tone="muted"
                />
                <PLRow label="Cost basis" value={-bs.surplusDeployment.cost} />
                <PLRow label="Surplus (scenario)" value={bs.surplusDeployment.surplus} bold tone="positive" />
                <tr>
                  <td colSpan={2} className="pt-3">
                    <div className="border-t border-dashed border-card-border" />
                  </td>
                </tr>
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
              Founder retains discretion to shift the split toward retained if Brightside requires
              capital reinvestment to scale. The tithe is taken from gross revenue — not a
              discretionary line.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="downside"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Downside coverage</span>
              <span className="text-xs text-muted-foreground">
                Source: {bs.downsideCoverage.sourceBucket} · ~{pct(bs.downsideCoverage.coveragePct)} coverage
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-3">
              If Brightside revenue undershoots and cannot cover its own cost basis, the source
              bucket absorbs the shortfall.{" "}
              <strong className="text-foreground">Brightside IS the innovation investment.</strong>
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <Row label="Source bucket size" value={money(bs.downsideCoverage.sourceAmount)} />
              <Row label="Maximum exposure" value={money(bs.downsideCoverage.maxExposure)} />
              <Row label="Coverage ratio" value={`~${pct(bs.downsideCoverage.coveragePct)} of source`} />
            </dl>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

    </div>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: "at-steady-state" | "modelling" | "pre-revenue";
  label: string;
}) {
  const styles: Record<string, string> = {
    "at-steady-state": "bg-emerald-50 text-emerald-800 border border-emerald-200",
    modelling: "bg-amber-50 text-amber-800 border border-amber-200",
    "pre-revenue": "bg-blue-50 text-blue-800 border border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {label}
    </span>
  );
}

function FramingQuestion({ q, context }: { q: string; context: string }) {
  return (
    <div className="space-y-0.5">
      <p className="font-medium text-blue-900">→ {q}</p>
      <p className="text-xs text-blue-700 leading-relaxed pl-3">{context}</p>
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

function PriceRow({
  name,
  amount,
  suffix,
  note,
}: {
  name: string;
  amount: number;
  suffix: string;
  note: string;
}) {
  return (
    <tr className="border-b border-card-border align-top">
      <td className="py-2 pr-4 font-medium">{name}</td>
      <td className="py-2 pr-4 text-right num whitespace-nowrap">
        {money(amount)}{" "}
        <span className="text-xs text-muted-foreground font-normal">{suffix}</span>
      </td>
      <td className="py-2 pr-4 text-xs text-muted-foreground">{note}</td>
    </tr>
  );
}

function PLRow({
  label,
  value,
  bold,
  tone,
}: {
  label: string;
  value: number;
  bold?: boolean;
  tone?: "positive" | "muted";
}) {
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
      <td className={cls}>
        {sign}
        {money(Math.abs(value))}
        {close}
      </td>
    </tr>
  );
}

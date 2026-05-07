/**
 * ContractsPage — Community Contracts bucket.
 *
 * PROGRESSIVE DISCLOSURE PATTERN (see docs/design/progressive-disclosure.md):
 *   - Bucket heading + KPI grid: always visible.
 *   - All detail (roster table, overheads, surplus phases, renegotiation triggers): collapsed by default.
 *   - 807 Grants → Benefits Plan: named action item, always visible in the Contracts bucket.
 */

import type { ReactNode } from "react";
import { Link } from "wouter";
import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { SectionCard } from "@/components/SectionCard";
import { MoneyKpi } from "@/components/MoneyKpi";
import { ConfirmedTag } from "@/components/ConfirmedTag";
import { Num } from "@/components/Num";
import { FootnoteList } from "@/components/FootnoteList";
import { AGENCY_FOOTNOTES } from "@/data/footnotes";
import { BUCKETS } from "@/data/buckets";
import { money, pct } from "@/lib/format";
import { confirmed, tbd, type SourceTag } from "@/data/tags";
import { buildContractsLedger } from "@/data/contractsLedger";
import { ExportLedgerButtons } from "@/components/ExportLedgerButtons";
import { ReinvestmentBucketsInteractive } from "@/components/ReinvestmentBucketsInteractive";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Gift, AlertCircle, ArrowLeft } from "lucide-react";

export function ContractsPage() {
  const { scenario } = useScenario();
  const a = scenario.contracts.agency;
  const b = BUCKETS.contracts;

  const hasFamilyInfusionRecovery = a.familyInfusionRecovery > 0;
  const hasBrightsideLaunchPhase = a.brightsidePrelaunchSpend > 0;

  // Tithe is personal (first claim on practitioner draw), not a business waterfall step.
  const waterfallDescription = [
    "wages",
    hasFamilyInfusionRecovery ? "capital recovery — family infusion" : null,
    hasFamilyInfusionRecovery ? "capital recovery — business loan" : "capital recovery",
    hasBrightsideLaunchPhase ? "Brightside launch" : null,
    "Reserve / Innovation",
  ]
    .filter(Boolean)
    .join(" → ");

  const phaseBlocks: { key: string; node: ReactNode }[] = [];
  let phaseIndex = 0;


  if (hasFamilyInfusionRecovery) {
    phaseBlocks.push({
      key: "capital-recovery-family",
      node: (
        <PhaseBlock
          key="capital-recovery-family"
          index={phaseIndex++}
          title={`Capital Recovery — family infusion · ${money(a.familyInfusionRecovery)} (paid in month 1, with month-2 spillover)`}
          tag={a.familyInfusionRecoveryTag}
          accent={b.accent}
        >
          <p className="text-sm text-muted-foreground">{a.familyInfusionRecoveryDescription}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Tax-free return of principal to the founder's husband. Money flows business →
            husband, bypassing the founder's personal accounts. NOT compensation, NOT income, NOT
            a deductible expense.
          </p>
        </PhaseBlock>
      ),
    });
  }

  phaseBlocks.push({
    key: "capital-recovery",
    node: (
      <PhaseBlock
        key="capital-recovery"
        index={phaseIndex++}
        title={`${hasFamilyInfusionRecovery ? "Capital Recovery — business loan" : "Capital Recovery"} · ${a.capitalRecoveryStartLabel} → ${a.capitalRecoveryEndLabel}`}
        tag={a.capitalRecoveryTag}
        accent={b.accent}
      >
        <p className="text-sm text-muted-foreground">
          {hasFamilyInfusionRecovery
            ? `Business surplus from August onward retires the ${money(a.capitalRecoveryAmount)} bank-loan leg. `
            : `All business surplus retires the ${money(a.capitalRecoveryAmount)} debt stack. `}
          {a.capitalRecoveryDescription}{" "}
          <strong className="text-foreground">~{a.capitalRecoveryMonths} months</strong> at this
          scenario's monthly business surplus.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Booked as <strong>"Capital Recovery"</strong> — distinct line, separate from
          compensation, separate from owner draw. NOT new income to the founder.
        </p>
      </PhaseBlock>
    ),
  });

  if (hasBrightsideLaunchPhase) {
    phaseBlocks.push({
      key: "brightside-launch",
      node: (
        <PhaseBlock
          key="brightside-launch"
          index={phaseIndex++}
          title={`Brightside Launch Month · ${a.brightsideLaunchMonthLabel}`}
          tag={a.brightsideLaunchTag}
          accent={b.accent}
        >
          <p className="text-sm text-muted-foreground">
            The agency surplus this month funds Brightside's pre-launch one-time costs
            in a single concentrated month: {money(a.brightsidePrelaunchSpend)}.
          </p>
          <p className="mt-2 text-sm">
            Surplus available: <strong>{money(a.brightsideLaunchSurplus)}</strong> · Pre-launch
            spend: <strong>{money(a.brightsidePrelaunchSpend)}</strong> · Remainder:{" "}
            <strong
              className={
                a.brightsideLaunchRemainder >= 0 ? "text-[hsl(167_60%_22%)]" : "text-destructive"
              }
            >
              {money(a.brightsideLaunchRemainder)}
            </strong>
            {a.brightsideLaunchRemainder >= 0
              ? ` splits ${a.reservePct}/${a.innovationPct}`
              : " — overrun comes out of next month's splits"}
            .
          </p>
        </PhaseBlock>
      ),
    });
  }

  phaseBlocks.push({
    key: "phase-3",
    node: (
      <PhaseBlock
        key="phase-3"
        index={phaseIndex++}
        title={`Reserve / Innovation split (${a.reservePct}/${a.innovationPct}) · ${a.phase3Months} months`}
        tag={a.phase3Tag}
        accent={b.accent}
      >
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr className="border-b border-card-border">
              <th className="py-1.5 font-medium">Bucket</th>
              <th className="py-1.5 font-medium text-right num">%</th>
              <th className="py-1.5 font-medium text-right num">$/mo</th>
              <th className="py-1.5 font-medium text-right num">Total over Phase 3</th>
            </tr>
          </thead>
          <tbody>
            <SplitRow
              label="Reserve"
              pctVal={a.reservePct}
              monthly={a.reserveMonthly}
              total={a.reserveTotal}
            />
            <SplitRow
              label="Innovation / R&D"
              pctVal={a.innovationPct}
              monthly={a.innovationMonthly}
              total={a.innovationTotal}
            />
          </tbody>
        </table>
        <p className="mt-2 text-xs text-muted-foreground">
          Renormalised from 50/25/25 → {a.reservePct}/{a.innovationPct} when Giving moved to a
          tithe-first claim.
          {hasBrightsideLaunchPhase
            ? null
            : " V5 routes Brightside's pre-launch spend through this Innovation bucket — no dedicated Brightside Launch Month in the V5 waterfall."}
        </p>
      </PhaseBlock>
    ),
  });

  return (
    <div className="space-y-8" data-testid="page-contracts">
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
            {b.name} · {money(a.fee)}/mo agency engagement
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <h1
              className="text-3xl font-semibold"
              style={{ fontFamily: "var(--app-font-serif)" }}
            >
              One agency line, one waterfall, every dollar accounted for.
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              Contract not yet signed
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              Rates set · $175/hr lead · $70/hr support
            </span>
          </div>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            <Num tag={a.feeTag}>{money(a.fee)}</Num>/mo starting {a.startDate} against the{" "}
            {a.roster.length}-role Northern Band team (
            <Num tag={a.rosterTag}>{money(a.payrollTotal)}</Num>/mo payroll). Surplus waterfall:{" "}
            {waterfallDescription}. The Ship Manifest publishes a trial-first hourly engagement
            model; these rates and that structure are what the guide models.
          </p>
        </div>
        <ExportLedgerButtons
          buildLedger={() => buildContractsLedger(scenario)}
          testIdPrefix="contracts"
        />
      </header>

      {/* ── How the fee is derived ── */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-900 mb-1">
          How this engagement works — trial-first, hourly
        </p>
        <p className="text-xs text-blue-800 leading-relaxed">
          The Ship Manifest offer is trial-first and hourly: six weeks, bounded scope, no retainer.
          The figures below model a <em>full engagement</em> at confirmed rates
          ($175/hr lead · $70/hr support) against the Northern Band roster — they show what the math
          looks like if a contract lands and runs. None of this is locked until a contract is signed.
          Treat the monthly-fee line as a scenario derived from projected hours, not a quoted retainer.
        </p>
      </div>

      {/* ── KPI Grid — always visible ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label="Monthly fee (scenario)"
          value={a.fee}
          unit="/mo"
          tag={a.feeTag}
          accent={b.accent}
          testId="kpi-agency-fee"
        />
        <MoneyKpi
          label="Cost basis (Sep+)"
          value={a.costBasisSepOnward}
          unit="/mo"
          tag={a.costBasisTag}
          tone="muted"
          accent={b.accent}
          hint={`Jun–Aug: ${money(a.costBasisJunAug)}/mo`}
          testId="kpi-agency-cost-basis"
        />
        <MoneyKpi
          label="Business surplus (Sep+)"
          value={a.monthlySurplusSepOnward}
          unit="/mo"
          tag={a.costBasisTag}
          accent={b.accent}
          hint={`Jun–Aug: ${money(a.monthlySurplusJunAug)}/mo · tithe is personal, not deducted here`}
          testId="kpi-agency-surplus"
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label={`${a.termMonths}-mo surplus deployed`}
          value={a.totals18mo.surplusDeployed}
          tag={a.totals18mo.tag}
          tone="positive"
          accent={b.accent}
          hint={
            hasFamilyInfusionRecovery
              ? "Capital Recovery (family m1 + loan Aug→Oct) + Reserve / Innovation"
              : "Capital recovery + Brightside + Reserve / Innovation"
          }
          testId="kpi-agency-18mo"
        />
        {hasFamilyInfusionRecovery ? (
          <MoneyKpi
            label="Capital Recovery — family infusion"
            value={a.familyInfusionRecovery}
            tag={a.familyInfusionRecoveryTag}
            accent={b.accent}
            hint="Paid in month 1 — tax-free debt repayment (NOT income)"
            testId="kpi-agency-family-infusion-recovery"
          />
        ) : null}
      </div>

      {/* ── 807 Grants Action Item ── */}
      <div
        className="rounded-xl border border-orange-200 bg-orange-50 p-4"
        data-testid="contracts-807-grants-action"
      >
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-md grid place-items-center flex-shrink-0 bg-orange-100 text-orange-700 mt-0.5">
            <Gift className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-orange-900">
                Action Item: Get 807 to apply for grants → benefits plan build-out
              </p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                Open · Practitioner owns this
              </span>
            </div>
            <p className="text-xs text-orange-800 mt-1.5 leading-relaxed">
              Facilitate 807 Co-op applying for grants (LFIF, FedNor CEDP, or equivalent
              benefits-plan stream) to fund a team benefits plan build-out. 807 must be the
              proponent. This removes the benefits cost from the agency fee waterfall entirely.
              <strong className="text-orange-900"> Status: open — grant not yet identified or submitted.</strong>
            </p>
            <div className="mt-2 text-xs text-orange-700 grid grid-cols-3 gap-2">
              <div>
                <p className="font-semibold">Owner</p>
                <p>Practitioner (you)</p>
              </div>
              <div>
                <p className="font-semibold">Proponent</p>
                <p>807 Co-op board</p>
              </div>
              <div>
                <p className="font-semibold">Grant applied</p>
                <p className="italic text-orange-600">Not yet identified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AGENCY ENGAGEMENT ── */}
      <div id="agency" className="scroll-mt-24">
        <h2
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "var(--app-font-serif)", color: b.accentInk }}
        >
          {money(a.fee)}/mo agency engagement
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {a.termMonths}-month engagement starting {a.startDate}, renegotiated at month{" "}
          {a.renegotiateMonth}. Buyer: {a.buyerStatus}.
        </p>

        <Accordion type="multiple" className="space-y-3">

          {/* Renegotiation Triggers */}
          {a.renegotiationTriggers.length > 0 && (
            <AccordionItem
              value="renegotiation-triggers"
              className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
              style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-baseline gap-3 text-left">
                  <span className="font-semibold text-sm">
                    Pre-baked renegotiation triggers · {a.renegotiationTriggers.length}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Month {a.renegotiateMonth} step → {money(a.renegotiationTriggers[0]?.feeStepTo ?? 0)}/mo
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Step changes the contract takes at the renegotiation point — pre-baked so the
                  founder is not negotiating from scratch at month {a.renegotiateMonth}.
                </p>
                <div className="overflow-x-auto -mx-2 px-2">
                  <table className="w-full text-sm min-w-[640px]" data-testid="renegotiation-triggers-table">
                    <thead className="text-left text-muted-foreground">
                      <tr className="border-b border-card-border">
                        <th className="py-2 pr-4 font-medium">Step</th>
                        <th className="py-2 pr-4 font-medium">Condition</th>
                        <th className="py-2 pr-4 font-medium text-right num">Fee → $/mo</th>
                        <th className="py-2 pr-4 font-medium text-right num">Lead draw → $/mo</th>
                        <th className="py-2 pr-4 font-medium">Evidence required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.renegotiationTriggers.map((t) => (
                        <tr
                          key={t.step}
                          className="border-b border-card-border align-top"
                          data-testid={`renegotiation-trigger-${t.step.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                        >
                          <td className="py-2 pr-4 font-medium">{t.step}</td>
                          <td className="py-2 pr-4 text-muted-foreground">{t.condition}</td>
                          <td className="py-2 pr-4 text-right num font-medium">
                            <Num tag={a.feeTag}>{money(t.feeStepTo)}</Num>
                          </td>
                          <td className="py-2 pr-4 text-right num font-medium">
                            <Num tag={a.practitionerSalaryTag}>{money(t.drawStepTo)}</Num>
                          </td>
                          <td className="py-2 pr-4 text-xs text-muted-foreground">{t.evidenceRequired}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Triggers describe what the contract <strong>steps to</strong> when conditions are
                  met — not folded into the published {a.termMonths}-month totals. Published numbers
                  reflect the base fee ({money(a.fee)}/mo) and lead draw (
                  {money(a.roster[0].monthlyLoaded)}/mo) for all {a.termMonths} months.
                </p>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Team Roster */}
          <AccordionItem
            value="team-roster"
            className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
            style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-baseline gap-3 text-left">
                <span className="font-semibold text-sm">
                  Team roster — {money(a.payrollTotal)}/mo payroll
                </span>
                <span className="text-xs text-muted-foreground">
                  {a.roster.length} roles · lead draw {money(a.roster[0].monthlyLoaded)}/mo
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ConfirmedTag tag={a.rosterTag} className="mb-3" />
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-sm min-w-[520px]">
                  <thead className="text-left text-muted-foreground">
                    <tr className="border-b border-card-border">
                      <th className="py-2 pr-4 font-medium">Role</th>
                      <th className="py-2 pr-4 font-medium text-right num">$/mo loaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.roster.map((r) => (
                      <tr
                        key={r.role}
                        className="border-b border-card-border align-top"
                        data-testid={`roster-${r.role.toLowerCase().replace(/[^a-z]/g, "-")}`}
                      >
                        <td className="py-2 pr-4">
                          <div className="font-medium">{r.role}</div>
                          {r.notes ? (
                            <div className="text-xs text-muted-foreground mt-0.5">{r.notes}</div>
                          ) : null}
                        </td>
                        <td className="py-2 pr-4 text-right num">
                          <Num tag={a.rosterTag}>{money(r.monthlyLoaded)}</Num>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td className="py-2 pr-4">Payroll subtotal</td>
                      <td className="py-2 pr-4 text-right num">
                        <Num tag={a.rosterTag}>{money(a.payrollTotal)}</Num>
                      </td>
                    </tr>
                    <tr className="text-muted-foreground" data-testid="row-team-incentives">
                      <td className="py-2 pr-4">
                        <div className="font-medium">{a.teamIncentivesName}</div>
                        <div className="text-xs">
                          Visible-but-TBD line — surfaced so the team-incentives bucket stays in
                          the conversation; dollar amount not yet pinned.
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-right num">
                        {a.teamIncentivesAmount === null ? (
                          <ConfirmedTag tag={a.teamIncentivesTag} />
                        ) : (
                          <Num tag={a.teamIncentivesTag}>{money(a.teamIncentivesAmount)}</Num>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 rounded-md bg-muted/40 text-xs text-muted-foreground space-y-2">
                <p>
                  <strong className="text-foreground">Underneath this team — operator couple on the cockpit.</strong>{" "}
                  Sam &amp; Jess, brought in and paid by the contractor (same setup as the band's
                  hotel). Square at the till, QuickBooks on the books, Local Line for producers,
                  the Headwaters cockpit tying them together. On the buyer's payroll, not the{" "}
                  {money(a.payrollTotal)}/mo Codetry line. The Code Reviewer seat keeps this stack
                  honest — quarterly software review, every code path that touches money.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Overheads */}
          <AccordionItem
            value="overheads"
            className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
            style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-baseline gap-3 text-left">
                <span className="font-semibold text-sm">Overheads</span>
                <span className="text-xs text-muted-foreground">
                  Jun–Aug {money(a.overheadsJunAugTotal)}/mo · Sep+ {money(a.overheadsSepOnwardTotal)}/mo
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ConfirmedTag tag={a.overheadsTag} className="mb-3" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <OverheadCard
                  title={`Jun–Aug 2026 · ${money(a.overheadsJunAugTotal)}/mo`}
                  rows={a.overheadsJunAug}
                  total={a.overheadsJunAugTotal}
                  tag={a.overheadsTag}
                  travelTbd={tbd("Practitioner visits ~3 days/mo")}
                />
                <OverheadCard
                  title={`Sep 2026 onward · ${money(a.overheadsSepOnwardTotal)}/mo`}
                  rows={a.overheadsSepOnward}
                  total={a.overheadsSepOnwardTotal}
                  tag={a.overheadsTag}
                  travelTbd={tbd("Practitioner visits ~3 days/mo")}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Surplus Deployment */}
          <AccordionItem
            value="surplus-deployment"
            className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
            style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-baseline gap-3 text-left">
                <span className="font-semibold text-sm">
                  Surplus deployment — {money(a.totals18mo.surplusDeployed)} over {a.termMonths} mo
                </span>
                <span className="text-xs text-muted-foreground">{waterfallDescription}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground mb-3">
                Business surplus waterfall (strict order): {waterfallDescription}. Practitioner tithe ({a.tithePct}% of draw = {money(a.titheMonthly)}/mo) is a personal first claim on Bobbie's draw — settled before the surplus waterfall runs.
              </p>
              <div className="space-y-4">{phaseBlocks.map((p) => p.node)}</div>
            </AccordionContent>
          </AccordionItem>

          {/* Reserve purposes */}
          <AccordionItem
            value="reserve-giving"
            className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
            style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-baseline gap-3 text-left">
                <span className="font-semibold text-sm">Reserve purposes &amp; giving direction</span>
                <span className="text-xs text-muted-foreground">
                  {a.reservePurposes.length} reserve purposes
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Reserve — purpose</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-muted-foreground">
                    {a.reservePurposes.map((p, i) => (
                      <li key={i}><span className="text-foreground">{p}</span></li>
                    ))}
                  </ol>
                  <p className="mt-3 text-xs text-muted-foreground italic">
                    Reserve is not a buffer against bad months — it is a named deployment target.
                    These are the only purposes the Reserve bucket is pointed at.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-2">Giving — direction</p>
                  <p className="text-muted-foreground leading-relaxed">{a.givingDirection}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Reinvestment interactive */}
          <AccordionItem
            value="reinvestment"
            className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
            style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-semibold text-sm">Reinvestment buckets — interactive</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ReinvestmentBucketsInteractive accent={b.accent} accentInk={b.accentInk} />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>

      <FootnoteList notes={AGENCY_FOOTNOTES} />
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function PhaseBlock({
  index,
  title,
  tag,
  accent,
  children,
}: {
  index: number;
  title: string;
  tag: SourceTag;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="h-7 w-7 rounded-full grid place-items-center text-xs font-bold text-white flex-shrink-0"
          style={{ backgroundColor: accent }}
        >
          {index + 1}
        </div>
        <div className="flex-1 w-px bg-card-border mt-2" />
      </div>
      <div className="flex-1 pb-4">
        <p className="text-sm font-semibold mb-1">{title}</p>
        <ConfirmedTag tag={tag} className="mb-2" />
        {children}
      </div>
    </div>
  );
}

function OverheadCard({
  title,
  rows,
  total,
  tag,
  travelTbd,
}: {
  title: string;
  rows: Array<{ name: string; monthly: number | null; notes?: string }>;
  total: number;
  tag: SourceTag;
  travelTbd: SourceTag;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-2">{title}</p>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-card-border align-top">
              <td className="py-1.5 pr-4">
                <div className="font-medium text-sm">{r.name}</div>
                {r.notes ? (
                  <div className="text-xs text-muted-foreground">{r.notes}</div>
                ) : null}
              </td>
              <td className="py-1.5 text-right num text-sm">
                {r.monthly === null ? (
                  <span className="text-muted-foreground italic text-xs">TBD</span>
                ) : (
                  <Num tag={tag}>{money(r.monthly)}</Num>
                )}
              </td>
            </tr>
          ))}
          <tr className="border-b border-card-border align-top">
            <td className="py-1.5 pr-4">
              <div className="text-sm">Travel (practitioner)</div>
              <div className="text-xs text-muted-foreground">~3 days/mo, TBD</div>
            </td>
            <td className="py-1.5 text-right num text-sm">
              <ConfirmedTag tag={travelTbd} />
            </td>
          </tr>
          <tr className="font-semibold">
            <td className="py-1.5 pr-4 text-sm">Subtotal</td>
            <td className="py-1.5 text-right num text-sm">
              <Num tag={tag}>{money(total)}</Num>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SplitRow({
  label,
  pctVal,
  monthly,
  total,
}: {
  label: string;
  pctVal: number;
  monthly: number;
  total: number;
}) {
  return (
    <tr className="border-b border-card-border">
      <td className="py-1.5 pr-4 font-medium">{label}</td>
      <td className="py-1.5 pr-4 text-right num">{pctVal}%</td>
      <td className="py-1.5 pr-4 text-right num">{money(monthly)}</td>
      <td className="py-1.5 text-right num">{money(total)}</td>
    </tr>
  );
}

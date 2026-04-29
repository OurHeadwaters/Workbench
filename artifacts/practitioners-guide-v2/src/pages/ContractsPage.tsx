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
import { tbd, type SourceTag } from "@/data/tags";
import { buildContractsLedger } from "@/data/contractsLedger";
import { ExportLedgerButtons } from "@/components/ExportLedgerButtons";
import { ReinvestmentBucketsInteractive } from "@/components/ReinvestmentBucketsInteractive";

export function ContractsPage() {
  const { scenario } = useScenario();
  const a = scenario.contracts.agency;
  const b = BUCKETS.contracts;

  return (
    <div className="space-y-8" data-testid="page-contracts">
      <ProvisionalBanner />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: b.accent }}
          >
            {b.name} · {money(a.fee)}/mo agency engagement
          </p>
          <h1
            className="mt-2 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            One agency line, one waterfall, every dollar accounted for.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            <Num tag={a.feeTag}>{money(a.fee)}</Num>/mo agency engagement starting {a.startDate}{" "}
            against the 7-role Deer Lake team (<Num tag={a.rosterTag}>{money(a.payrollTotal)}</Num>/mo
            payroll). Surplus deployment is tithe-first:{" "}
            <Num tag={a.feeTag}>{pct(a.tithePct)}</Num> of revenue
            (<Num tag={a.feeTag}>{money(a.titheMonthly)}</Num>/mo) goes to Giving off the top, then
            capital recovery, then Brightside launch, then Reserve / Innovation.
          </p>
        </div>
        <ExportLedgerButtons
          buildLedger={() => buildContractsLedger(scenario)}
          testIdPrefix="contracts"
        />
      </header>

      {/* ============ AGENCY ENGAGEMENT ============ */}
      <div id="agency" className="scroll-mt-24">
        <h2
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--app-font-serif)", color: b.accentInk }}
        >
          {money(a.fee)}/mo agency engagement
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {a.termMonths}-month engagement starting {a.startDate}, renegotiated at month {a.renegotiateMonth}. Buyer: {a.buyerStatus}.
        </p>

        {a.renegotiationTriggers.length > 0 ? (
          <div className="mb-6">
            <SectionCard
              title={`Pre-baked renegotiation triggers · ${a.renegotiationTriggers.length}`}
              subtitle={`Step changes the contract takes at the renegotiation point — pre-baked so the founder is not negotiating from scratch at month ${a.renegotiateMonth}. Each row names the condition, the evidence required, and the fee + lead-draw step.`}
              tag={a.feeTag}
              accent={b.accent}
            >
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
                Triggers describe what the contract <strong>steps to</strong> when the condition is met — they are not folded into the published 18-month totals on this page. Published numbers reflect the base fee ({money(a.fee)}/mo) and lead draw ({money(a.roster[0].monthlyLoaded)}/mo) for all {a.termMonths} months.
              </p>
            </SectionCard>
          </div>
        ) : null}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <MoneyKpi
            label="Monthly fee"
            value={a.fee}
            unit="/mo"
            tag={a.feeTag}
            accent={b.accent}
            testId="kpi-agency-fee"
          />
          <MoneyKpi
            label={`Tithe (${pct(a.tithePct)}, off the top)`}
            value={a.titheMonthly}
            unit="/mo"
            tag={a.feeTag}
            accent={b.accent}
            hint={`First claim on revenue · 18-mo total ${money(a.titheTotal)}`}
            testId="kpi-agency-tithe"
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
            label="Post-tithe surplus (Sep+)"
            value={a.monthlySurplusSepOnward}
            unit="/mo"
            tag={a.costBasisTag}
            accent={b.accent}
            hint={`Jun–Aug: ${money(a.monthlySurplusJunAug)}/mo`}
            testId="kpi-agency-surplus"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MoneyKpi
            label="18-mo surplus deployed"
            value={a.totals18mo.surplusDeployed}
            tag={a.totals18mo.tag}
            tone="positive"
            accent={b.accent}
            hint="Capital recovery + Brightside + Reserve / Innovation, after the tithe"
            testId="kpi-agency-18mo"
          />
        </div>

        <SectionCard
          title={`Team roster — ${money(a.payrollTotal)}/mo payroll`}
          tag={a.rosterTag}
          accent={b.accent}
        >
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
                  <tr key={r.role} className="border-b border-card-border align-top" data-testid={`roster-${r.role.toLowerCase().replace(/[^a-z]/g, "-")}`}>
                    <td className="py-2 pr-4">
                      <div className="font-medium">{r.role}</div>
                      {r.notes ? <div className="text-xs text-muted-foreground mt-0.5">{r.notes}</div> : null}
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
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <OverheadCard
            title={`Overheads — Jun–Aug 2026 · ${money(a.overheadsJunAugTotal)}/mo`}
            rows={a.overheadsJunAug}
            total={a.overheadsJunAugTotal}
            tag={a.overheadsTag}
            accent={b.accent}
            travelTbd={tbd("Practitioner visits ~3 days/mo")}
          />
          <OverheadCard
            title={`Overheads — Sep 2026 onward · ${money(a.overheadsSepOnwardTotal)}/mo`}
            rows={a.overheadsSepOnward}
            total={a.overheadsSepOnwardTotal}
            tag={a.overheadsTag}
            accent={b.accent}
            travelTbd={tbd("Practitioner visits ~3 days/mo")}
          />
        </div>

        <div className="mt-6">
          <SectionCard
            title="Surplus deployment — tithe first, then three phases"
            subtitle={`Strict order: Tithe (${pct(a.tithePct)} off the top) → capital recovery → Brightside launch → Reserve / Innovation. Giving is what you decided, not what was left.`}
            tag={a.totals18mo.tag}
            accent={b.accent}
          >
            <div className="space-y-4">
              <PhaseBlock
                index={0}
                title={`Tithe · ${pct(a.tithePct)} of revenue, off the top`}
                tag={a.feeTag}
                accent={b.accent}
              >
                <p className="text-sm text-muted-foreground">
                  Giving is the first claim on revenue, paid before cost basis or any capital allocation. <strong className="text-foreground">{money(a.titheMonthly)}/mo</strong> for {a.termMonths} months = <strong className="text-foreground">{money(a.titheTotal)}</strong> over the engagement.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Dave Ramsey discipline: the tithe is what you decided, not what was left. Locked the moment the fee is locked — capital recovery, Brightside, and Reserve / Innovation absorb the cost of that decision.
                </p>
              </PhaseBlock>

              <PhaseBlock
                index={1}
                title={`Capital Recovery (pure) · ${a.capitalRecoveryStartLabel} → ${a.capitalRecoveryEndLabel}`}
                tag={a.capitalRecoveryTag}
                accent={b.accent}
              >
                <p className="text-sm text-muted-foreground">
                  All post-tithe agency surplus retires the {money(a.capitalRecoveryAmount)} debt stack. {a.capitalRecoveryDescription} <strong className="text-foreground">~{a.capitalRecoveryMonths} months</strong> at this scenario's post-tithe monthly surplus.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Booked as <strong>"Capital Recovery"</strong> — distinct line, separate from compensation, separate from owner draw. NOT new income to the founder.
                </p>
              </PhaseBlock>

              <PhaseBlock
                index={2}
                title={`Brightside Launch Month · ${a.brightsideLaunchMonthLabel}`}
                tag={a.brightsideLaunchTag}
                accent={b.accent}
              >
                <p className="text-sm text-muted-foreground">
                  The post-tithe agency surplus this month funds Brightside's pre-launch one-time costs in a single concentrated month: {money(a.brightsidePrelaunchSpend)}.
                </p>
                <p className="mt-2 text-sm">
                  Surplus available: <strong>{money(a.brightsideLaunchSurplus)}</strong> · Pre-launch spend: <strong>{money(a.brightsidePrelaunchSpend)}</strong> · Remainder: <strong className={a.brightsideLaunchRemainder >= 0 ? "text-[hsl(167_60%_22%)]" : "text-destructive"}>{money(a.brightsideLaunchRemainder)}</strong>
                  {a.brightsideLaunchRemainder >= 0 ? ` splits ${a.reservePct}/${a.innovationPct}` : " — overrun comes out of next month's splits"}.
                </p>
              </PhaseBlock>

              <PhaseBlock
                index={3}
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
                    <SplitRow label="Reserve" pctVal={a.reservePct} monthly={a.reserveMonthly} total={a.reserveTotal} />
                    <SplitRow label="Innovation / R&D" pctVal={a.innovationPct} monthly={a.innovationMonthly} total={a.innovationTotal} />
                  </tbody>
                </table>
                <p className="mt-2 text-xs text-muted-foreground">
                  Renormalised from 50/25/25 → {a.reservePct}/{a.innovationPct} when Giving moved to a tithe-first claim — the old 25 giving slice consolidated into Reserve. Founder retains explicit option to shift more toward Innovation when it suits.
                </p>
              </PhaseBlock>
            </div>
          </SectionCard>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Reserve — purpose" accent={b.accent}>
            <ol className="list-decimal pl-5 text-sm space-y-1.5 text-muted-foreground">
              {a.reservePurposes.map((p, i) => (
                <li key={i}><span className="text-foreground">{p}</span></li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-muted-foreground italic">
              Naming note. <em>Reserve</em> here is the agency P&L line — a 75% hold-back of post-tithe surplus that funds the next reserve / next pilot. It is a different object from the codetry-handbook's <em>Reservoir</em> (the household stablecoin wallet that holds RLUSD between rainfall and channelling into buckets). The household wallet is downstream of the household's own income, not of this agency's surplus.
            </p>
          </SectionCard>
          <SectionCard title="Giving — directional intent (where the tithe goes)" accent={b.accent}>
            <p className="text-sm text-muted-foreground">{a.givingDirection}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Tithe rate: <strong className="text-foreground">{pct(a.tithePct)} of revenue</strong> · Locked monthly: <strong className="text-foreground">{money(a.titheMonthly)}</strong> · 18-mo total: <strong className="text-foreground">{money(a.titheTotal)}</strong>
            </p>
          </SectionCard>
        </div>

        <div className="mt-6">
          <ReinvestmentBucketsInteractive accent={b.accent} accentInk={b.accentInk} />
        </div>

        <div className="mt-4">
          <SectionCard
            title="18-month engagement totals"
            subtitle={`${a.startDate} → ~Nov 2027`}
            tag={a.totals18mo.tag}
            accent={b.accent}
          >
            <table className="w-full text-sm">
              <tbody>
                <PLRow label={`Revenue (${money(a.fee)} × ${a.termMonths})`} value={a.totals18mo.revenue} bold />
                <PLRow label={`Tithe — Giving (${pct(a.tithePct)} off the top, first claim)`} value={-a.totals18mo.tithe} />
                <PLRow label={`Payroll (${money(a.payrollTotal)} × ${a.termMonths})`} value={-a.totals18mo.payroll} />
                <PLRow label="Overheads (3 mo Jun–Aug + 15 mo Sep+)" value={-a.totals18mo.overheads} />
                <PLRow label="Total surplus deployed (post-tithe)" value={a.totals18mo.surplusDeployed} bold tone="positive" />
                <tr><td colSpan={2} className="pt-3"><div className="border-t border-dashed border-card-border" /></td></tr>
                <PLRow label="↳ Capital Recovery (Phase 1)" value={a.totals18mo.capitalRecovery} tone="muted" />
                <PLRow label="↳ Brightside one-time pre-launch (Phase 2)" value={a.totals18mo.brightsidePrelaunch} tone="muted" />
                <PLRow label="↳ Reserve (Phase 3)" value={a.totals18mo.reserve} tone="muted" />
                <PLRow label="↳ Innovation / R&D (Phase 3)" value={a.totals18mo.innovation} tone="muted" />
              </tbody>
            </table>
          </SectionCard>
        </div>

        <div className="mt-4">
          <SectionCard
            title="Personal compensation footing"
            subtitle="Transparency block — only personal cash from this bucket."
            tag={a.practitionerSalaryTag}
            accent={b.accent}
          >
            <p className="text-sm">
              <strong>Practitioner salary across {a.termMonths} months from the agency engagement:</strong>{" "}
              <span className="num font-semibold">{money(a.practitionerSalary18mo)}</span>{" "}
              <span className="text-muted-foreground">(= {money(a.practitionerSalary18mo / 1.5)}/yr).</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              No ongoing owner take from the agency surplus, no profit-share, no dividend from the agency line. Capital Recovery (Phase 1) returns existing obligations to lender and family; not characterized as compensation. Brightside owner take is the founder's only profit-share line — see Brightside.
            </p>
          </SectionCard>
        </div>

        <FootnoteList title="Agency footnotes" notes={AGENCY_FOOTNOTES} />
      </div>
    </div>
  );
}

function PhaseBlock({
  index,
  title,
  tag,
  accent,
  children,
}: {
  index: number;
  title: string;
  tag?: SourceTag;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg border-l-4 bg-card/60 px-4 py-3"
      style={{ borderColor: accent }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
        <h4 className="font-semibold text-foreground">
          <span className="font-mono text-xs text-muted-foreground mr-2">PHASE {index}</span>
          {title}
        </h4>
        {tag ? <ConfirmedTag tag={tag} /> : null}
      </div>
      {children}
    </div>
  );
}

function OverheadCard({
  title,
  rows,
  total,
  tag,
  accent,
  travelTbd,
}: {
  title: string;
  rows: { name: string; monthly: number | null; notes?: string; startsSeptember?: boolean }[];
  total: number;
  tag: SourceTag;
  accent: string;
  travelTbd: SourceTag;
}) {
  return (
    <SectionCard title={title} tag={tag} accent={accent}>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-card-border align-top">
              <td className="py-1.5 pr-4">
                <div className="font-medium">{r.name}</div>
                {r.notes ? <div className="text-xs text-muted-foreground">{r.notes}</div> : null}
              </td>
              <td className="py-1.5 pr-4 text-right num">
                {r.monthly === null ? <ConfirmedTag tag={travelTbd} /> : money(r.monthly)}
              </td>
            </tr>
          ))}
          <tr className="font-semibold">
            <td className="py-1.5 pr-4">Subtotal</td>
            <td className="py-1.5 pr-4 text-right num">{money(total)}</td>
          </tr>
        </tbody>
      </table>
    </SectionCard>
  );
}

function PLRow({
  label,
  value,
  bold,
  tone,
  tag,
}: {
  label: string;
  value: number;
  bold?: boolean;
  tone?: "positive" | "muted";
  tag?: SourceTag;
}) {
  const cls = [
    "py-1.5 num",
    bold ? "font-semibold" : "",
    tone === "positive"
      ? "text-[hsl(167_60%_22%)]"
      : tone === "muted"
        ? "text-muted-foreground"
        : "text-foreground",
  ].join(" ");
  const sign = value < 0 ? "(" : "";
  const close = value < 0 ? ")" : "";
  const formatted = `${sign}${money(Math.abs(value))}${close}`;
  return (
    <tr className="border-b border-card-border">
      <td className={`py-1.5 pr-4 ${bold ? "font-semibold" : ""}`}>{label}</td>
      <td className={`${cls} text-right`}>
        <Num tag={tag}>{formatted}</Num>
      </td>
    </tr>
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
      <td className="py-1.5 pr-4 text-right num">{pct(pctVal)}</td>
      <td className="py-1.5 pr-4 text-right num">{money(monthly)}</td>
      <td className="py-1.5 pr-4 text-right num">{money(total)}</td>
    </tr>
  );
}

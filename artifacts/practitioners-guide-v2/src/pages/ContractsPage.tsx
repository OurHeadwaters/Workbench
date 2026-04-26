import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { SectionCard } from "@/components/SectionCard";
import { MoneyKpi } from "@/components/MoneyKpi";
import { ConfirmedTag } from "@/components/ConfirmedTag";
import { Num } from "@/components/Num";
import { FootnoteList } from "@/components/FootnoteList";
import { CDP807_FOOTNOTES, AGENCY_FOOTNOTES } from "@/data/footnotes";
import { BUCKETS } from "@/data/buckets";
import { money, pct } from "@/lib/format";
import { tbd, type SourceTag } from "@/data/tags";
import { buildContractsLedger } from "@/data/contractsLedger";
import { ExportLedgerButtons } from "@/components/ExportLedgerButtons";

export function ContractsPage() {
  const { scenario } = useScenario();
  const cdp = scenario.contracts.cdp807;
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
            {b.name} · two sub-lines
          </p>
          <h1
            className="mt-2 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Real money in flight, plus the agency aspiration.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            Sub-line 1 is the 807 CDP grant — a real receivable,{" "}
            <Num tag={cdp.scoping.tag}>$0</Num> cash collected so far. Sub-line 2 is the{" "}
            <Num tag={a.feeTag}>{money(a.fee)}</Num>/mo agency engagement starting {a.startDate}, with
            a strict three-phase surplus deployment: capital recovery first, Brightside launch second,
            then Reserve / Innovation / Giving.
          </p>
        </div>
        <ExportLedgerButtons
          buildLedger={() => buildContractsLedger(scenario)}
          testIdPrefix="contracts"
        />
      </header>

      {/* ============ 807 CDP ============ */}
      <div id="cdp807" className="scroll-mt-24">
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ fontFamily: "var(--app-font-serif)", color: b.accentInk }}
        >
          Sub-line 1 · 807 CDP grant
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MoneyKpi
            label="Bill to 807"
            value={cdp.scoping.billTo807}
            tag={cdp.scoping.tag}
            accent={b.accent}
            hint={`$24k scoped − $2k local discount`}
            testId="kpi-cdp-bill"
          />
          <MoneyKpi
            label="Cash received"
            value={cdp.scoping.cashReceivedToDate}
            tag={cdp.scoping.tag}
            tone="muted"
            accent={b.accent}
            hint="Invoice lands at completion (end of year)"
            testId="kpi-cdp-cash"
          />
          <MoneyKpi
            label="Cost to deliver"
            value={cdp.costToDeliver.replitHosting}
            tag={cdp.costToDeliver.tag}
            accent={b.accent}
            hint="Replit hosting only"
            testId="kpi-cdp-cost"
          />
          <MoneyKpi
            label="Net cash to Headwaters"
            value={cdp.pAndL.netCash}
            tag={cdp.pAndL.tag}
            tone="positive"
            accent={b.accent}
            testId="kpi-cdp-net"
          />
        </div>

        <SectionCard
          title="Scope & funding structure"
          tag={cdp.scoping.tag}
          accent={b.accent}
        >
          <table className="w-full text-sm">
            <tbody>
              <PLRow label="Original work scoped" value={cdp.scoping.originalScope} tag={cdp.scoping.tag} />
              <PLRow label="Local discount Headwaters extending" value={cdp.scoping.localDiscount} tone="muted" tag={cdp.scoping.tag} />
              <PLRow label="Bill to 807" value={cdp.scoping.billTo807} bold tag={cdp.scoping.tag} />
              <tr><td colSpan={2} className="pt-3"><div className="border-t border-dashed border-card-border" /></td></tr>
              <tr className="border-b border-card-border">
                <td className="py-1.5 pr-4 text-muted-foreground">807's funding sources</td>
                <td className="py-1.5 pr-4 text-right text-muted-foreground">
                  <Num tag={cdp.scoping.tag}>{money(cdp.scoping.confirmedGrant + cdp.scoping.boardVoted)}</Num>
                </td>
              </tr>
              <PLRow label="↳ Confirmed grant in hand" value={cdp.scoping.confirmedGrant} tone="muted" tag={cdp.scoping.tag} />
              <PLRow label="↳ Board-voted to cover remainder (board in deficit)" value={cdp.scoping.boardVoted} tone="muted" tag={cdp.scoping.tag} />
              <tr><td colSpan={2} className="pt-3"><div className="border-t border-dashed border-card-border" /></td></tr>
              <PLRow label="Cash received to date" value={cdp.scoping.cashReceivedToDate} bold tone="muted" tag={cdp.scoping.tag} />
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            Cash treatment in V2: bank the full <Num tag={cdp.scoping.tag}>{money(cdp.scoping.billTo807)}</Num> as a non-interest-bearing receivable. The <Num tag={cdp.scoping.tag}>{money(cdp.scoping.boardVoted)}</Num> at-risk piece is a footnote, not a haircut on the headline number.
          </p>
        </SectionCard>

        <div className="mt-4">
          <SectionCard
            title="807 CDP P&L (cash, when collected)"
            tag={cdp.pAndL.tag}
            accent={b.accent}
          >
            <table className="w-full text-sm">
              <tbody>
                <PLRow label="Revenue (receivable collected)" value={cdp.pAndL.revenue} tag={cdp.pAndL.tag} />
                <PLRow label="Replit hosting" value={-cdp.pAndL.replitHosting} tag={cdp.pAndL.tag} />
                <PLRow label="Net cash to Headwaters" value={cdp.pAndL.netCash} bold tone="positive" tag={cdp.pAndL.tag} />
              </tbody>
            </table>
          </SectionCard>
        </div>

        <div className="mt-4">
          <SectionCard
            title="Structured option (working concept)"
            subtitle="Founder still shaping. V2 captures it as proposed, not as committed."
            tag={cdp.structuredOption.tag}
            accent={b.accent}
          >
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  Upfront from 807:{" "}
                  <Num tag={cdp.structuredOption.tag}>{money(cdp.structuredOption.upfront807)}</Num>
                </strong>{" "}
                — covers Headwaters' development costs, paid up front, takes Replit hosting cost off
                Headwaters' books.
              </li>
              <li>
                Then: revenue-share back to Headwaters until the{" "}
                <Num tag={cdp.structuredOption.tag}>{money(cdp.structuredOption.cap)}</Num> invoice is
                paid up. Two revenue sources contemplated:
                <ol className="list-decimal pl-6 mt-1 space-y-1">
                  {cdp.structuredOption.revenueShareSources.map((src) => (
                    <li key={src}>{src}</li>
                  ))}
                </ol>
              </li>
              <li>
                Cap: revenue-share continues until the{" "}
                <Num tag={cdp.structuredOption.tag}>{money(cdp.structuredOption.cap)}</Num>{" "}
                receivable is retired. Then it stops.
              </li>
              <li>
                Status: <strong className="text-foreground">{cdp.structuredOption.status}</strong>.
              </li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Dog-treat estimate:{" "}
              <Num tag={cdp.structuredOption.tag}>
                ${cdp.structuredOption.dogTreatUnitCostLow}–${cdp.structuredOption.dogTreatUnitCostHigh}/unit
              </Num>{" "}
              production cost. Headwaters takes a share of the profit margin on each unit.
            </p>
          </SectionCard>
        </div>

        <FootnoteList title="807 CDP footnotes" notes={CDP807_FOOTNOTES} />
      </div>

      {/* ============ AGENCY ASPIRATION ============ */}
      <div id="agency" className="scroll-mt-24 pt-4">
        <h2
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--app-font-serif)", color: b.accentInk }}
        >
          Sub-line 2 · {money(a.fee)}/mo agency aspiration
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MoneyKpi
            label="Monthly fee"
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
            label="Monthly surplus (Sep+)"
            value={a.monthlySurplusSepOnward}
            unit="/mo"
            tag={a.costBasisTag}
            accent={b.accent}
            hint={`Jun–Aug: ${money(a.monthlySurplusJunAug)}/mo`}
            testId="kpi-agency-surplus"
          />
          <MoneyKpi
            label="18-mo surplus deployed"
            value={a.totals18mo.surplusDeployed}
            tag={a.totals18mo.tag}
            tone="positive"
            accent={b.accent}
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
            title="Surplus deployment — three phases"
            subtitle="Strict order: capital recovery → Brightside launch → Reserve / Innovation / Giving."
            tag={a.totals18mo.tag}
            accent={b.accent}
          >
            <div className="space-y-4">
              <PhaseBlock
                index={1}
                title={`Capital Recovery (pure) · ${a.capitalRecoveryStartLabel} → ${a.capitalRecoveryEndLabel}`}
                tag={a.capitalRecoveryTag}
                accent={b.accent}
              >
                <p className="text-sm text-muted-foreground">
                  All agency surplus retires the {money(a.capitalRecoveryAmount)} debt stack. {a.capitalRecoveryDescription} <strong className="text-foreground">~{a.capitalRecoveryMonths} months</strong> at this scenario's monthly surplus.
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
                  The agency surplus this month funds Brightside's pre-launch one-time costs in a single concentrated month: {money(a.brightsidePrelaunchSpend)}.
                </p>
                <p className="mt-2 text-sm">
                  Surplus available: <strong>{money(a.brightsideLaunchSurplus)}</strong> · Pre-launch spend: <strong>{money(a.brightsidePrelaunchSpend)}</strong> · Remainder: <strong className={a.brightsideLaunchRemainder >= 0 ? "text-[hsl(167_60%_22%)]" : "text-destructive"}>{money(a.brightsideLaunchRemainder)}</strong>
                  {a.brightsideLaunchRemainder >= 0 ? " splits 50/25/25" : " — overrun comes out of next month's splits"}.
                </p>
              </PhaseBlock>

              <PhaseBlock
                index={3}
                title={`Reserve-heavy split (50/25/25) · ${a.phase3Months} months`}
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
                    <SplitRow label="Giving" pctVal={a.givingPct} monthly={a.givingMonthly} total={a.givingTotal} />
                  </tbody>
                </table>
                <p className="mt-2 text-xs text-muted-foreground">
                  Founder retains explicit option to shift more toward Innovation when it suits.
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
          </SectionCard>
          <SectionCard title="Giving — directional intent" accent={b.accent}>
            <p className="text-sm text-muted-foreground">{a.givingDirection}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Giving as % of contract value: <strong className="text-foreground">{pct((a.givingTotal / a.totals18mo.revenue) * 100, 1)}</strong>
            </p>
          </SectionCard>
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
                <PLRow label={`Payroll (${money(a.payrollTotal)} × ${a.termMonths})`} value={-a.totals18mo.payroll} />
                <PLRow label="Overheads (3 mo Jun–Aug + 15 mo Sep+)" value={-a.totals18mo.overheads} />
                <PLRow label="Total surplus deployed" value={a.totals18mo.surplusDeployed} bold tone="positive" />
                <tr><td colSpan={2} className="pt-3"><div className="border-t border-dashed border-card-border" /></td></tr>
                <PLRow label="↳ Capital Recovery (Phase 1)" value={a.totals18mo.capitalRecovery} tone="muted" />
                <PLRow label="↳ Brightside one-time pre-launch (Phase 2)" value={a.totals18mo.brightsidePrelaunch} tone="muted" />
                <PLRow label="↳ Reserve (Phase 3)" value={a.totals18mo.reserve} tone="muted" />
                <PLRow label="↳ Innovation / R&D (Phase 3)" value={a.totals18mo.innovation} tone="muted" />
                <PLRow label="↳ Giving (Phase 3)" value={a.totals18mo.giving} tone="muted" />
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
}: {
  label: string;
  value: number;
  bold?: boolean;
  tone?: "positive" | "muted";
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
  return (
    <tr className="border-b border-card-border">
      <td className={`py-1.5 pr-4 ${bold ? "font-semibold" : ""}`}>{label}</td>
      <td className={`${cls} text-right`}>
        {sign}{money(Math.abs(value))}{close}
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

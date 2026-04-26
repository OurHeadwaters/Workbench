import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { SectionCard } from "@/components/SectionCard";
import { MoneyKpi } from "@/components/MoneyKpi";
import { Num } from "@/components/Num";
import { FootnoteList } from "@/components/FootnoteList";
import { SALTS_FOOTNOTES } from "@/data/footnotes";
import { BUCKETS } from "@/data/buckets";
import { money, num } from "@/lib/format";
import { buildSaltLedger } from "@/data/saltLedger";
import { ExportLedgerButtons } from "@/components/ExportLedgerButtons";
import type { SourceTag } from "@/data/tags";

export function SaltsPage() {
  const { scenario } = useScenario();
  const s = scenario.salts;
  const b = BUCKETS.salts;

  return (
    <div className="space-y-6" data-testid="page-salts">
      <ProvisionalBanner />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: b.accent }}
          >
            {b.name} · {b.tagline}
          </p>
          <h1
            className="mt-2 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Sustainable on family hands.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            One blended per-jar COGS today (founder will break out per-blend later). Four channels,
            1,190 jars/yr steady state, $1,298/yr net. The economic story is honest only when you
            carry the shadow-labour line.
          </p>
        </div>
        <ExportLedgerButtons
          buildLedger={() => buildSaltLedger(scenario)}
          testIdPrefix="salts"
        />
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label="Per-jar COGS"
          value={s.perJarCogs.total}
          tag={s.perJarCogs.tag}
          accent={b.accent}
          testId="kpi-cogs"
        />
        <MoneyKpi
          label="Annual revenue"
          value={s.pAndL.revenue}
          tag={s.pAndL.tag}
          accent={b.accent}
          hint={`${num(s.channelTotals.jars)} jars/yr`}
          testId="kpi-revenue"
        />
        <MoneyKpi
          label="Net cash / yr"
          value={s.pAndL.netCash}
          tag={s.pAndL.tag}
          tone="positive"
          accent={b.accent}
          testId="kpi-net-cash"
        />
        <MoneyKpi
          label="Net after shadow labour"
          value={s.shadowLabour.adjustedNet}
          tag={s.shadowLabour.tag}
          tone="muted"
          accent={b.accent}
          hint={`~${s.shadowLabour.annualHours} hrs unpaid · $${s.shadowLabour.benchHourly}/hr bench`}
          testId="kpi-net-economic"
        />
      </div>

      <SectionCard
        title="Per-jar build cost"
        subtitle="Blended average across four blends — break per-blend when ready."
        tag={s.perJarCogs.tag}
        accent={b.accent}
      >
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr className="border-b border-card-border">
              <th className="py-2 pr-4 font-medium">Component</th>
              <th className="py-2 pr-4 font-medium text-right num">Cost / jar</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-card-border">
              <td className="py-2 pr-4">Raw salt input (avg, 4 blends)</td>
              <td className="py-2 pr-4 text-right num">
                <Num tag={s.perJarCogs.tag}>{money(s.perJarCogs.rawSalt, 2)}</Num>
              </td>
            </tr>
            <tr className="border-b border-card-border">
              <td className="py-2 pr-4">Jar (lid included)</td>
              <td className="py-2 pr-4 text-right num">
                <Num tag={s.perJarCogs.tag}>{money(s.perJarCogs.jar, 2)}</Num>
              </td>
            </tr>
            <tr className="border-b border-card-border">
              <td className="py-2 pr-4">Label + sticker + packaging</td>
              <td className="py-2 pr-4 text-right num">
                <Num tag={s.perJarCogs.tag}>{money(s.perJarCogs.label, 2)}</Num>
              </td>
            </tr>
            <tr className="font-semibold">
              <td className="py-2 pr-4">Per-jar COGS</td>
              <td className="py-2 pr-4 text-right num">
                <Num tag={s.perJarCogs.tag}>{money(s.perJarCogs.total, 2)}</Num>
              </td>
            </tr>
          </tbody>
        </table>
      </SectionCard>

      <SectionCard
        title="Channel volumes, pricing & margin"
        subtitle="Annual, steady-state. Wholesale baseline reflects 9-case backlog from existing accounts."
        tag={s.channelTotals.tag}
        accent={b.accent}
      >
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-card-border">
                <th className="py-2 pr-4 font-medium">Channel</th>
                <th className="py-2 pr-4 font-medium text-right num">Jars/yr</th>
                <th className="py-2 pr-4 font-medium text-right num">Price</th>
                <th className="py-2 pr-4 font-medium text-right num">Revenue</th>
                <th className="py-2 pr-4 font-medium text-right num">COGS</th>
                <th className="py-2 pr-4 font-medium text-right num">Gross margin</th>
              </tr>
            </thead>
            <tbody>
              {s.channels.map((c) => (
                <tr
                  key={c.name}
                  className="border-b border-card-border align-top"
                  data-testid={`channel-${c.name.toLowerCase().replace(/[^a-z]/g, "-")}`}
                >
                  <td className="py-2 pr-4">
                    <div className="font-medium">{c.name}</div>
                    {c.notes ? (
                      <div className="text-xs text-muted-foreground mt-0.5">{c.notes}</div>
                    ) : null}
                  </td>
                  <td className="py-2 pr-4 text-right num"><Num tag={s.channelTotals.tag}>{num(c.jars)}</Num></td>
                  <td className="py-2 pr-4 text-right num"><Num tag={s.channelTotals.tag}>{money(c.pricePerJar, 2)}</Num></td>
                  <td className="py-2 pr-4 text-right num"><Num tag={s.channelTotals.tag}>{money(c.revenue)}</Num></td>
                  <td className="py-2 pr-4 text-right num"><Num tag={s.channelTotals.tag}>{money(c.cogs)}</Num></td>
                  <td className="py-2 pr-4 text-right num font-medium"><Num tag={s.channelTotals.tag}>{money(c.grossMargin)}</Num></td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-2 pr-4">TOTAL salt</td>
                <td className="py-2 pr-4 text-right num"><Num tag={s.channelTotals.tag}>{num(s.channelTotals.jars)}</Num></td>
                <td className="py-2 pr-4 text-right">—</td>
                <td className="py-2 pr-4 text-right num"><Num tag={s.channelTotals.tag}>{money(s.channelTotals.revenue)}</Num></td>
                <td className="py-2 pr-4 text-right num"><Num tag={s.channelTotals.tag}>{money(s.channelTotals.cogs)}</Num></td>
                <td className="py-2 pr-4 text-right num"><Num tag={s.channelTotals.tag}>{money(s.channelTotals.grossMargin)}</Num></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Wholesale and Corporate priced at $8.50/jar. Markets at $12/jar. DTC and Custom labels:
          channels exist but inactive in steady-state.
        </p>
      </SectionCard>

      <SectionCard
        title="Operating costs"
        tag={s.operating.tag}
        accent={b.accent}
      >
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Row label="Batch cadence" value={s.operating.batchCadence} />
          <Row label="Batch labour" value={s.operating.batchLabour} />
          <Row label="Freight (wholesale & corporate)" value={s.operating.freight} />
          <Row
            label="Markets — craft"
            value={`${money(s.operating.marketsCraftAnnual)} (4 events × $150)`}
            tag={s.operating.tag}
          />
          <Row
            label="Markets — farmers"
            value={`${money(s.operating.marketsFarmersAnnual)} (15 wks × $30)`}
            tag={s.operating.tag}
          />
          <Row
            label="Markets overhead total"
            value={money(s.operating.marketsOverheadTotal)}
            tag={s.operating.tag}
          />
          <Row
            label={`Subscriptions (${s.operating.subscriptionsAllocationPct}% allocation of $500/mo)`}
            value={money(s.operating.subscriptionsAnnual)}
            tag={s.operating.tag}
          />
        </dl>
      </SectionCard>

      <SectionCard
        title="Salts P&L summary (cash, annual)"
        tag={s.pAndL.tag}
        accent={b.accent}
      >
        <table className="w-full text-sm">
          <tbody>
            <PLRow label="Revenue" value={s.pAndL.revenue} tag={s.pAndL.tag} />
            <PLRow label="COGS" value={-s.pAndL.cogs} tag={s.pAndL.tag} />
            <PLRow label="Markets overhead" value={-s.pAndL.marketsOverhead} tag={s.pAndL.tag} />
            <PLRow label="Subscriptions (30% allocation)" value={-s.pAndL.subscriptions} tag={s.pAndL.tag} />
            <PLRow label="Net cash" value={s.pAndL.netCash} bold tone="positive" tag={s.pAndL.tag} />
            <tr>
              <td colSpan={2} className="pt-3">
                <div className="border-t border-dashed border-card-border" />
              </td>
            </tr>
            <PLRow
              label={`Shadow labour (~${s.shadowLabour.annualHours} hrs × $${s.shadowLabour.benchHourly})`}
              value={-s.shadowLabour.annualCost}
              tone="muted"
              tag={s.shadowLabour.tag}
            />
            <PLRow
              label="Net economic (after shadow labour)"
              value={s.shadowLabour.adjustedNet}
              bold
              tone="muted"
              tag={s.shadowLabour.tag}
            />
          </tbody>
        </table>
      </SectionCard>

      <SectionCard
        title="Markets context — maple syrup (separate line)"
        subtitle="NOT counted in salt revenue. Listed for markets context only."
        tag={s.mapleSyrup.tag}
        accent={b.accent}
      >
        <p className="text-sm text-muted-foreground">
          <Num tag={s.mapleSyrup.tag}>{s.mapleSyrup.cases}</Num> cases/yr ×{" "}
          <Num tag={s.mapleSyrup.tag}>{s.mapleSyrup.bottlesPerCase}</Num> bottles ×{" "}
          <Num tag={s.mapleSyrup.tag}>${s.mapleSyrup.marginPerBottle}</Num> margin ={" "}
          <strong className="text-foreground">
            <Num tag={s.mapleSyrup.tag}>{money(s.mapleSyrup.annualMargin)}/yr</Num>
          </strong>
          . Sells out early; volume pivot from 8 → 12 cases is doable with staff.
        </p>
      </SectionCard>

      <FootnoteList notes={SALTS_FOOTNOTES} />
    </div>
  );
}

function Row({ label, value, tag }: { label: string; value: string; tag?: SourceTag }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground sm:text-right num">
        {tag ? <Num tag={tag}>{value}</Num> : value}
      </dd>
    </>
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

/**
 * SaltsPage — Parr's Jars salt bucket.
 *
 * PROGRESSIVE DISCLOSURE PATTERN (see docs/design/progressive-disclosure.md):
 *   - Bucket heading + KPI grid: always visible.
 *   - Per-jar cost breakdown, channel volume table, operating costs, P&L, maple syrup: collapsed.
 *   - Decision signals at a glance: 4 KPI cards (per-jar cost, revenue, net cash, net after shadow labour).
 */

import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { MoneyKpi } from "@/components/MoneyKpi";
import { Num } from "@/components/Num";
import { FootnoteList } from "@/components/FootnoteList";
import { SALTS_FOOTNOTES } from "@/data/footnotes";
import { BUCKETS } from "@/data/buckets";
import { money, num } from "@/lib/format";
import { buildSaltLedger } from "@/data/saltLedger";
import { ExportLedgerButtons } from "@/components/ExportLedgerButtons";
import type { SourceTag } from "@/data/tags";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
            One blended per-jar cost. Four channels, 1,190 jars/yr steady state, $1,298/yr net.
            The economic story is honest only when you carry the shadow-labour line.
          </p>
        </div>
        <ExportLedgerButtons
          buildLedger={() => buildSaltLedger(scenario)}
          testIdPrefix="salts"
        />
      </header>

      {/* ── KPI Grid — always visible ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MoneyKpi
          label="Per-jar cost"
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

      {/* ── Detail sections — collapsed by default ── */}
      <Accordion type="multiple" className="space-y-3">

        <AccordionItem
          value="per-jar-cost"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Per-jar build cost</span>
              <span className="text-xs text-muted-foreground">
                {money(s.perJarCogs.total, 2)} blended · break per-blend when ready
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-3">
              Blended average across four blends — break per-blend when ready.
            </p>
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
                  <td className="py-2 pr-4">Per-jar cost</td>
                  <td className="py-2 pr-4 text-right num">
                    <Num tag={s.perJarCogs.tag}>{money(s.perJarCogs.total, 2)}</Num>
                  </td>
                </tr>
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="channels"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Channel volumes, pricing &amp; margin</span>
              <span className="text-xs text-muted-foreground">
                {num(s.channelTotals.jars)} jars · {money(s.channelTotals.grossMargin)} gross margin
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-3">
              Annual, steady-state. Wholesale baseline reflects 9-case backlog from existing accounts.
            </p>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b border-card-border">
                    <th className="py-2 pr-4 font-medium">Channel</th>
                    <th className="py-2 pr-4 font-medium text-right num">Jars/yr</th>
                    <th className="py-2 pr-4 font-medium text-right num">Price</th>
                    <th className="py-2 pr-4 font-medium text-right num">Revenue</th>
                    <th className="py-2 pr-4 font-medium text-right num">Per-jar cost</th>
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
                      <td className="py-2 pr-4 text-right num">
                        <Num tag={s.channelTotals.tag}>{num(c.jars)}</Num>
                      </td>
                      <td className="py-2 pr-4 text-right num">
                        <Num tag={s.channelTotals.tag}>{money(c.pricePerJar, 2)}</Num>
                      </td>
                      <td className="py-2 pr-4 text-right num">
                        <Num tag={s.channelTotals.tag}>{money(c.revenue)}</Num>
                      </td>
                      <td className="py-2 pr-4 text-right num">
                        <Num tag={s.channelTotals.tag}>{money(c.cogs)}</Num>
                      </td>
                      <td className="py-2 pr-4 text-right num font-medium">
                        <Num tag={s.channelTotals.tag}>{money(c.grossMargin)}</Num>
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="py-2 pr-4">TOTAL salt</td>
                    <td className="py-2 pr-4 text-right num">
                      <Num tag={s.channelTotals.tag}>{num(s.channelTotals.jars)}</Num>
                    </td>
                    <td className="py-2 pr-4 text-right">—</td>
                    <td className="py-2 pr-4 text-right num">
                      <Num tag={s.channelTotals.tag}>{money(s.channelTotals.revenue)}</Num>
                    </td>
                    <td className="py-2 pr-4 text-right num">
                      <Num tag={s.channelTotals.tag}>{money(s.channelTotals.cogs)}</Num>
                    </td>
                    <td className="py-2 pr-4 text-right num">
                      <Num tag={s.channelTotals.tag}>{money(s.channelTotals.grossMargin)}</Num>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Wholesale and Corporate priced at $8.50/jar. Markets at $12/jar. DTC and Custom
              labels: channels exist but inactive in steady-state.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="operating-costs"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Operating costs</span>
              <span className="text-xs text-muted-foreground">
                Markets {money(s.operating.marketsOverheadTotal)} · Subscriptions {money(s.operating.subscriptionsAnnual)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Row label="Batch cadence" value={s.operating.batchCadence} />
              <Row label="Batch labour" value={s.operating.batchLabour} />
              <Row label="Freight (wholesale &amp; corporate)" value={s.operating.freight} />
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="pl"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Salts P&amp;L summary (cash, annual)</span>
              <span className="text-xs text-muted-foreground">
                Net {money(s.pAndL.netCash)} · shadow-adj {money(s.shadowLabour.adjustedNet)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <table className="w-full text-sm">
              <tbody>
                <PLRow label="Revenue" value={s.pAndL.revenue} tag={s.pAndL.tag} />
                <PLRow label="Per-jar cost" value={-s.pAndL.cogs} tag={s.pAndL.tag} />
                <PLRow label="Markets overhead" value={-s.pAndL.marketsOverhead} tag={s.pAndL.tag} />
                <PLRow
                  label="Subscriptions (30% allocation)"
                  value={-s.pAndL.subscriptions}
                  tag={s.pAndL.tag}
                />
                <PLRow
                  label="Net cash"
                  value={s.pAndL.netCash}
                  bold
                  tone="positive"
                  tag={s.pAndL.tag}
                />
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="maple-syrup"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: b.accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Markets context — maple syrup</span>
              <span className="text-xs text-muted-foreground">
                {money(s.mapleSyrup.annualMargin)}/yr · NOT in salt revenue
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-2">
              NOT counted in salt revenue. Listed for markets context only.
            </p>
            <p className="text-sm text-muted-foreground">
              <Num tag={s.mapleSyrup.tag}>{s.mapleSyrup.cases}</Num> cases/yr ×{" "}
              <Num tag={s.mapleSyrup.tag}>{s.mapleSyrup.bottlesPerCase}</Num> bottles ×{" "}
              <Num tag={s.mapleSyrup.tag}>${s.mapleSyrup.marginPerBottle}</Num> margin ={" "}
              <strong className="text-foreground">
                <Num tag={s.mapleSyrup.tag}>{money(s.mapleSyrup.annualMargin)}/yr</Num>
              </strong>
              . Sells out early; volume pivot from 8 → 12 cases is doable with staff.
            </p>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

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

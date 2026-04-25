import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "headwaters-salt-monthly-close-v1";

type ChannelKey = "wholesale" | "customLabels" | "dtcBatch" | "markets";

const CHANNELS: { key: ChannelKey; code: string; label: string; cmFloor: number | null }[] = [
  { key: "wholesale", code: "4400.10", label: "Wholesale", cmFloor: 50 },
  { key: "customLabels", code: "4400.20", label: "Custom labels", cmFloor: 60 },
  { key: "dtcBatch", code: "4400.30", label: "DTC batch", cmFloor: 30 },
  { key: "markets", code: "4400.40", label: "Markets (PR)", cmFloor: null },
];

type ChannelLine = {
  revenue: number;
  cogs: number;
  freight: number;
  packaging: number;
};

type QuarterlyRollup = {
  // Sum of the prior months in the same quarter (0–2 months, depending on
  // where in the quarter we are). Bookkeeper carries these forward from the
  // earlier filed monthly close reports.
  priorRevenue: number;
  priorCmDollars: number;
  // Set from the *prior quarter's* filed report — not from memory — so the
  // two-quarters-in-a-row check can't be silently skipped. Mirrors the
  // pattern the hours-by-pillar template uses.
  prevQuarterUnder: boolean;
};

type State = {
  month: string;
  monthInQuarter: 1 | 2 | 3;
  preparedBy: string;
  preparedOn: string;
  channels: Record<ChannelKey, ChannelLine>;
  quarterly: Record<ChannelKey, QuarterlyRollup>;
  omHours: number;
  omRate: number;
  casualHours: number;
  casualRate: number;
  depotAllocation: number;
  notes: string;
};

const EMPTY_LINE: ChannelLine = {
  revenue: 0,
  cogs: 0,
  freight: 0,
  packaging: 0,
};

const EMPTY_ROLLUP: QuarterlyRollup = {
  priorRevenue: 0,
  priorCmDollars: 0,
  prevQuarterUnder: false,
};

const DEFAULT_STATE: State = {
  month: "",
  monthInQuarter: 3,
  preparedBy: "",
  preparedOn: "",
  channels: {
    wholesale: { ...EMPTY_LINE },
    customLabels: { ...EMPTY_LINE },
    dtcBatch: { ...EMPTY_LINE },
    markets: { ...EMPTY_LINE },
  },
  quarterly: {
    wholesale: { ...EMPTY_ROLLUP },
    customLabels: { ...EMPTY_ROLLUP },
    dtcBatch: { ...EMPTY_ROLLUP },
    markets: { ...EMPTY_ROLLUP },
  },
  omHours: 0,
  omRate: 53,
  casualHours: 0,
  casualRate: 25,
  depotAllocation: 300,
  notes: "",
};

const OM_HOURS_CAP = 12;

function loadState(): State {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_STATE;
    const channels = CHANNELS.reduce((acc, c) => {
      const src = parsed?.channels?.[c.key] ?? {};
      acc[c.key] = {
        revenue: numOr0(src.revenue),
        cogs: numOr0(src.cogs),
        freight: numOr0(src.freight),
        packaging: numOr0(src.packaging),
      };
      return acc;
    }, {} as Record<ChannelKey, ChannelLine>);
    const quarterly = CHANNELS.reduce((acc, c) => {
      const src = parsed?.quarterly?.[c.key] ?? {};
      acc[c.key] = {
        priorRevenue: numOr0(src.priorRevenue),
        priorCmDollars: Number.isFinite(Number(src.priorCmDollars))
          ? Number(src.priorCmDollars)
          : 0,
        prevQuarterUnder: Boolean(src.prevQuarterUnder),
      };
      return acc;
    }, {} as Record<ChannelKey, QuarterlyRollup>);
    const monthInQuarter = clampMonthInQuarter(parsed.monthInQuarter);
    return {
      month: String(parsed.month ?? ""),
      monthInQuarter,
      preparedBy: String(parsed.preparedBy ?? ""),
      preparedOn: String(parsed.preparedOn ?? ""),
      channels,
      quarterly,
      omHours: numOr0(parsed.omHours),
      omRate: Number.isFinite(Number(parsed.omRate)) ? Number(parsed.omRate) : 53,
      casualHours: numOr0(parsed.casualHours),
      casualRate: Number.isFinite(Number(parsed.casualRate)) ? Number(parsed.casualRate) : 25,
      depotAllocation: Number.isFinite(Number(parsed.depotAllocation))
        ? Number(parsed.depotAllocation)
        : 300,
      notes: String(parsed.notes ?? ""),
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function clampMonthInQuarter(v: unknown): 1 | 2 | 3 {
  const n = Number(v);
  if (n === 1) return 1;
  if (n === 2) return 2;
  return 3;
}

function numOr0(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(0)}%`;
}

export default function SaltMonthlyClose() {
  const [state, setState] = useState<State>(() => loadState());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / privacy-mode failures
    }
  }, [state]);

  const updateChannel = (key: ChannelKey, patch: Partial<ChannelLine>) => {
    setState((prev) => ({
      ...prev,
      channels: { ...prev.channels, [key]: { ...prev.channels[key], ...patch } },
    }));
  };

  const updateQuarterly = (key: ChannelKey, patch: Partial<QuarterlyRollup>) => {
    setState((prev) => ({
      ...prev,
      quarterly: { ...prev.quarterly, [key]: { ...prev.quarterly[key], ...patch } },
    }));
  };

  const reset = () => setState(DEFAULT_STATE);
  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  // Monthly totals — what posts to the agency P&L this month.
  const totals = useMemo(() => {
    const rev = CHANNELS.reduce((s, c) => s + state.channels[c.key].revenue, 0);
    const cogs = CHANNELS.reduce((s, c) => s + state.channels[c.key].cogs, 0);
    const freight = CHANNELS.reduce((s, c) => s + state.channels[c.key].freight, 0);
    const pack = CHANNELS.reduce((s, c) => s + state.channels[c.key].packaging, 0);
    const variable = cogs + freight + pack;
    const labour = state.omHours * state.omRate + state.casualHours * state.casualRate;
    const depot = state.depotAllocation;
    const net = rev - variable - labour - depot;
    return { rev, cogs, freight, pack, variable, labour, depot, net };
  }, [state]);

  // Per-channel monthly CM (before labour & depot — same definition as the slide).
  const channelMetrics = useMemo(() => {
    return CHANNELS.map((c) => {
      const line = state.channels[c.key];
      const variable = line.cogs + line.freight + line.packaging;
      const cmDollars = line.revenue - variable;
      const cmPct = line.revenue > 0 ? (cmDollars / line.revenue) * 100 : 0;
      const belowFloor =
        c.cmFloor !== null && line.revenue > 0 && cmPct < c.cmFloor;
      return { channel: c, line, variable, cmDollars, cmPct, belowFloor };
    });
  }, [state.channels]);

  // Per-channel quarter-to-date CM, computed as
  //   (this month CM$ + prior months in this quarter CM$)
  //   / (this month revenue + prior months revenue).
  // The "Reprice / drop" trigger only fires when the QTD CM% is under floor
  // AND the prior quarter's filed report was also under — i.e. two quarters
  // in a row, exactly as the Salt P&L slide says.
  const quarterlyMetrics = useMemo(() => {
    return channelMetrics.map((m) => {
      const roll = state.quarterly[m.channel.key];
      const qtdRevenue = m.line.revenue + roll.priorRevenue;
      const qtdCmDollars = m.cmDollars + roll.priorCmDollars;
      const qtdCmPct = qtdRevenue > 0 ? (qtdCmDollars / qtdRevenue) * 100 : 0;
      const isQuarterEnd = state.monthInQuarter === 3;
      const qtdBelowFloor =
        m.channel.cmFloor !== null && qtdRevenue > 0 && qtdCmPct < m.channel.cmFloor;
      const triggersReprice =
        isQuarterEnd && qtdBelowFloor && roll.prevQuarterUnder;
      return { ...m, qtdRevenue, qtdCmDollars, qtdCmPct, qtdBelowFloor, triggersReprice };
    });
  }, [channelMetrics, state.quarterly, state.monthInQuarter]);

  const omOverCap = state.omHours > OM_HOURS_CAP;
  const wholesale = quarterlyMetrics.find((m) => m.channel.key === "wholesale");
  const wholesaleReprice = Boolean(wholesale?.triggersReprice);
  const wholesaleQtdWatch = Boolean(
    wholesale?.qtdBelowFloor && state.monthInQuarter === 3 && !wholesaleReprice,
  );

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[5pt] print:mb-[6pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Headwaters · Cost-centre SALT-01 · monthly close
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold print:text-[15pt]">
              The bookkeeper&rsquo;s monthly reconciliation into channel-level CM.
            </h1>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>Filed Thursday of batch week</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              Slide VI · 03 reconciles to here
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665] max-w-[60%]">
            Enter the month&rsquo;s actuals against the SALT-01 chart of
            accounts. Monthly CM%, labour, depot allocation and the
            OM-hours-cap (Rule 01) calculate live. The wholesale reprice /
            drop trigger is{" "}
            <span className="font-semibold">quarterly</span>: it only fires at
            the end of a quarter when QTD CM% is under floor and last quarter
            was under too.
          </div>
          <div className="flex gap-[6pt]">
            <a
              href={`${import.meta.env.BASE_URL}salt-coa`}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#1f3d2e] hover:bg-[#ebe2d0]"
            >
              Open chart of accounts
            </a>
            <button
              type="button"
              onClick={reset}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#6b7665] hover:bg-[#ebe2d0]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
            >
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-[8pt] mb-[10pt] text-[9pt] print:gap-[6pt] print:mb-[6pt]">
          <FieldBlock label="Month" hint="e.g. Jan 2026">
            <input
              type="text"
              value={state.month}
              onChange={(e) => setState((s) => ({ ...s, month: e.target.value }))}
              placeholder="MMM YYYY"
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            />
          </FieldBlock>
          <FieldBlock label="Month in quarter" hint="1, 2 or 3">
            <select
              value={state.monthInQuarter}
              onChange={(e) =>
                setState((s) => ({ ...s, monthInQuarter: clampMonthInQuarter(e.target.value) }))
              }
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            >
              <option value={1}>Month 1 of quarter</option>
              <option value={2}>Month 2 of quarter</option>
              <option value={3}>Month 3 (quarter close)</option>
            </select>
          </FieldBlock>
          <FieldBlock label="Prepared by" hint="Bookkeeper">
            <input
              type="text"
              value={state.preparedBy}
              onChange={(e) => setState((s) => ({ ...s, preparedBy: e.target.value }))}
              placeholder="Name"
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            />
          </FieldBlock>
          <FieldBlock label="Prepared on" hint="Date filed">
            <input
              type="text"
              value={state.preparedOn}
              onChange={(e) => setState((s) => ({ ...s, preparedOn: e.target.value }))}
              placeholder="YYYY-MM-DD"
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            />
          </FieldBlock>
        </div>

        <table
          className="w-full text-[9pt] border-collapse mb-[8pt] print:text-[8.5pt]"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold align-bottom">
              <th className="py-[4pt] pr-[3pt] w-[18%]">Channel · code</th>
              <th className="py-[4pt] px-[2pt] w-[12%] text-right">
                Revenue
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  4400.x
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[10%] text-right">
                COGS
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  5100
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[10%] text-right">
                Freight
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  5200
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[10%] text-right">
                Packaging
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  5300
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[10%] text-right">
                CM $
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  rev − vars
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[8%] text-right">
                CM %
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  vs floor
                </div>
              </th>
              <th className="py-[4pt] pl-[2pt] w-[22%] text-left">Monthly status</th>
            </tr>
          </thead>
          <tbody className="text-[#2a2520] align-top">
            {channelMetrics.map(({ channel, line, cmDollars, cmPct, belowFloor }) => (
              <tr
                key={channel.key}
                className="border-b border-[#e3dac4]"
                style={{
                  background: belowFloor ? "#fbeed1" : "transparent",
                }}
              >
                <td className="py-[4pt] pr-[3pt]">
                  <div className="font-semibold text-[#1f3d2e] leading-tight">
                    {channel.label}
                  </div>
                  <div className="font-mono text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
                    {channel.code}
                    {channel.cmFloor !== null && ` · floor ${channel.cmFloor}%`}
                  </div>
                </td>
                <td className="py-[4pt] px-[2pt] text-right">
                  <NumberInput
                    value={line.revenue}
                    onChange={(v) => updateChannel(channel.key, { revenue: v })}
                    prefix="$"
                  />
                </td>
                <td className="py-[4pt] px-[2pt] text-right">
                  <NumberInput
                    value={line.cogs}
                    onChange={(v) => updateChannel(channel.key, { cogs: v })}
                    prefix="$"
                  />
                </td>
                <td className="py-[4pt] px-[2pt] text-right">
                  <NumberInput
                    value={line.freight}
                    onChange={(v) => updateChannel(channel.key, { freight: v })}
                    prefix="$"
                  />
                </td>
                <td className="py-[4pt] px-[2pt] text-right">
                  <NumberInput
                    value={line.packaging}
                    onChange={(v) => updateChannel(channel.key, { packaging: v })}
                    prefix="$"
                  />
                </td>
                <td className="py-[4pt] px-[2pt] text-right font-mono font-semibold text-[#1f3d2e]">
                  {line.revenue > 0 ? fmt(cmDollars) : "—"}
                </td>
                <td
                  className="py-[4pt] px-[2pt] text-right font-semibold"
                  style={{
                    color: line.revenue === 0
                      ? "#6b7665"
                      : belowFloor
                      ? "#a07a18"
                      : "#1f3d2e",
                  }}
                >
                  {line.revenue > 0 ? fmtPct(cmPct) : "—"}
                </td>
                <td className="py-[4pt] pl-[2pt] text-left text-[8.5pt] font-semibold print:text-[8pt]">
                  {belowFloor ? (
                    <span className="text-[#a07a18]">
                      Under floor — feeds quarterly
                    </span>
                  ) : line.revenue > 0 ? (
                    <span className="text-[#1f3d2e]">OK</span>
                  ) : (
                    <span className="text-[#6b7665] font-normal">—</span>
                  )}
                </td>
              </tr>
            ))}
            <tr className="border-b-2 border-[#1f3d2e] bg-[#ebe2d0]">
              <td className="py-[5pt] pr-[3pt] font-display text-[10.5pt] text-[#1f3d2e] font-semibold print:text-[10pt]">
                Salt line · this month
              </td>
              <td className="py-[5pt] px-[2pt] text-right font-mono font-semibold text-[#1f3d2e]">
                {fmt(totals.rev)}
              </td>
              <td className="py-[5pt] px-[2pt] text-right font-mono text-[#1f3d2e]">
                {fmt(totals.cogs)}
              </td>
              <td className="py-[5pt] px-[2pt] text-right font-mono text-[#1f3d2e]">
                {fmt(totals.freight)}
              </td>
              <td className="py-[5pt] px-[2pt] text-right font-mono text-[#1f3d2e]">
                {fmt(totals.pack)}
              </td>
              <td
                colSpan={3}
                className="py-[5pt] px-[2pt] text-right font-mono text-[#6b7665] text-[8.5pt] italic print:text-[8pt]"
              >
                Variable cost {fmt(totals.variable)} · before labour & depot
              </td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-[10pt] mb-[10pt] print:gap-[6pt] print:mb-[6pt]">
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[5pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold mb-[5pt] print:text-[7pt] print:mb-[3pt]">
              Allocated labour · 5400
            </div>
            <div className="space-y-[4pt] text-[9pt] print:text-[8.5pt]">
              <LabourRow
                label="OM hours this month"
                hint={`Cap ${OM_HOURS_CAP} hrs/mo (Rule 01)`}
                value={state.omHours}
                onChange={(v) => setState((s) => ({ ...s, omHours: v }))}
                rateValue={state.omRate}
                onRateChange={(v) => setState((s) => ({ ...s, omRate: v }))}
                flag={omOverCap ? "Over cap" : null}
              />
              <LabourRow
                label="Casual bench hours"
                hint="Loaded rate from depot bench"
                value={state.casualHours}
                onChange={(v) => setState((s) => ({ ...s, casualHours: v }))}
                rateValue={state.casualRate}
                onRateChange={(v) => setState((s) => ({ ...s, casualRate: v }))}
                flag={null}
              />
              <div className="flex items-baseline justify-between pt-[4pt] border-t border-[#e3dac4]">
                <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] print:text-[7pt]">
                  Labour total to 5400
                </div>
                <div className="font-display text-[13pt] text-[#1f3d2e] font-semibold print:text-[11pt]">
                  {fmt(totals.labour)}
                </div>
              </div>
            </div>
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[5pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold mb-[5pt] print:text-[7pt] print:mb-[3pt]">
              Depot allocation · 5500
            </div>
            <div className="text-[9pt] text-[#2a2520] leading-[1.4] mb-[5pt] print:text-[8.5pt]">
              Default $300 / mo (10% of $3,000 / mo facility line). Override
              only if year-end review of the hours-by-pillar reports stepped
              the allocation up.
            </div>
            <div className="flex items-baseline justify-between pt-[4pt] border-t border-[#e3dac4]">
              <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] print:text-[7pt]">
                Posted to 5500
              </div>
              <div className="inline-flex items-baseline gap-[3pt]">
                <span className="font-mono text-[8pt] text-[#6b7665] print:text-[7.5pt]">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={50}
                  value={Number.isFinite(state.depotAllocation) ? state.depotAllocation : 0}
                  onChange={(e) => setState((s) => ({ ...s, depotAllocation: numOr0(e.target.value) }))}
                  className="w-[60pt] bg-transparent text-right font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0 print:text-[11pt]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-[10pt] print:mb-[6pt]">
          <div className="flex items-baseline justify-between mb-[4pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold print:text-[7.5pt]">
              Quarter-to-date rollup (Rule 02 reprice / drop trigger)
            </div>
            <div className="text-[8pt] text-[#6b7665] print:text-[7.5pt]">
              QTD CM% = (this month CM$ + prior months in quarter CM$) ÷ (this month rev + prior rev).
              Trigger fires only at month 3, when QTD &lt; floor and prev quarter was also under.
            </div>
          </div>
          <table
            className="w-full text-[9pt] border-collapse print:text-[8.5pt]"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold align-bottom">
                <th className="py-[4pt] pr-[3pt] w-[18%]">Channel</th>
                <th className="py-[4pt] px-[2pt] w-[14%] text-right">
                  Prior months rev
                  <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                    this quarter
                  </div>
                </th>
                <th className="py-[4pt] px-[2pt] w-[14%] text-right">
                  Prior months CM $
                  <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                    this quarter
                  </div>
                </th>
                <th className="py-[4pt] px-[2pt] w-[12%] text-right">
                  QTD CM %
                  <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                    incl. this month
                  </div>
                </th>
                <th className="py-[4pt] px-[2pt] w-[14%] text-center">
                  Prev quarter
                  <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                    under floor?
                  </div>
                </th>
                <th className="py-[4pt] pl-[2pt] w-[28%] text-left">Quarterly status</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520] align-top">
              {quarterlyMetrics.map((m) => {
                const roll = state.quarterly[m.channel.key];
                const isQuarterEnd = state.monthInQuarter === 3;
                const noFloor = m.channel.cmFloor === null;
                return (
                  <tr
                    key={m.channel.key}
                    className="border-b border-[#e3dac4]"
                    style={{
                      background: m.triggersReprice
                        ? "#f7d7c9"
                        : isQuarterEnd && m.qtdBelowFloor
                        ? "#fbeed1"
                        : "transparent",
                    }}
                  >
                    <td className="py-[4pt] pr-[3pt]">
                      <div className="font-semibold text-[#1f3d2e] leading-tight">
                        {m.channel.label}
                      </div>
                      <div className="font-mono text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
                        {noFloor ? "no floor (PR)" : `floor ${m.channel.cmFloor}%`}
                      </div>
                    </td>
                    <td className="py-[4pt] px-[2pt] text-right">
                      <NumberInput
                        value={roll.priorRevenue}
                        onChange={(v) => updateQuarterly(m.channel.key, { priorRevenue: v })}
                        prefix="$"
                      />
                    </td>
                    <td className="py-[4pt] px-[2pt] text-right">
                      <NumberInput
                        value={roll.priorCmDollars}
                        onChange={(v) => updateQuarterly(m.channel.key, { priorCmDollars: v })}
                        prefix="$"
                        allowNegative
                      />
                    </td>
                    <td
                      className="py-[4pt] px-[2pt] text-right font-semibold"
                      style={{
                        color: m.qtdRevenue === 0
                          ? "#6b7665"
                          : m.qtdBelowFloor
                          ? "#b85a3e"
                          : "#1f3d2e",
                      }}
                    >
                      {m.qtdRevenue > 0 ? fmtPct(m.qtdCmPct) : "—"}
                    </td>
                    <td className="py-[4pt] px-[2pt] text-center">
                      <label className="inline-flex items-center justify-center cursor-pointer print:cursor-auto">
                        <input
                          type="checkbox"
                          checked={roll.prevQuarterUnder}
                          disabled={noFloor}
                          onChange={(e) =>
                            updateQuarterly(m.channel.key, { prevQuarterUnder: e.target.checked })
                          }
                          className="print-hide w-[12pt] h-[12pt] accent-[#1f3d2e] disabled:opacity-30"
                        />
                        <span
                          aria-hidden
                          className="hidden print:inline-flex w-[10pt] h-[10pt] border border-[#1f3d2e] items-center justify-center"
                        >
                          {roll.prevQuarterUnder && (
                            <span className="font-mono text-[8pt] leading-none">✓</span>
                          )}
                        </span>
                      </label>
                    </td>
                    <td className="py-[4pt] pl-[2pt] text-left text-[8.5pt] font-semibold print:text-[8pt]">
                      {noFloor ? (
                        <span className="text-[#6b7665] font-normal">PR · no trigger</span>
                      ) : m.triggersReprice ? (
                        <span className="text-[#b85a3e]">Reprice / drop</span>
                      ) : isQuarterEnd && m.qtdBelowFloor ? (
                        <span className="text-[#a07a18]">QTD under — flag prev Q box for next Q</span>
                      ) : !isQuarterEnd ? (
                        <span className="text-[#6b7665] font-normal">
                          QTD calculates; trigger fires at month 3
                        </span>
                      ) : m.qtdRevenue > 0 ? (
                        <span className="text-[#1f3d2e]">OK · at or above floor</span>
                      ) : (
                        <span className="text-[#6b7665] font-normal">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10pt] mb-[10pt] print:gap-[6pt] print:mb-[6pt]">
          <div
            className="rounded-[3pt] p-[10pt] print:p-[6pt]"
            style={{ background: "#1f3d2e", color: "#f4ede0" }}
          >
            <div
              className="font-mono uppercase tracking-[0.2em] text-[8pt] font-semibold mb-[3pt] print:text-[7pt] print:mb-[1pt]"
              style={{ color: "#e9c8a8" }}
            >
              Net contribution to 8400
            </div>
            <div className="font-display text-[24pt] leading-tight font-semibold print:text-[18pt]">
              {fmt(totals.net)}
            </div>
            <div className="text-[8.5pt] mt-[3pt] leading-[1.4] print:text-[8pt] print:leading-[1.3]">
              Revenue {fmt(totals.rev)} − variable {fmt(totals.variable)} −
              labour {fmt(totals.labour)} − depot {fmt(totals.depot)}. Posts as
              a single line to the agency P&amp;L.
            </div>
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[10pt] print:p-[6pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold mb-[3pt] print:text-[7pt] print:mb-[1pt]">
              Status this close
            </div>
            <div className="font-display text-[14pt] text-[#1f3d2e] font-semibold leading-tight print:text-[12pt]">
              {wholesaleReprice
                ? "Reprice / drop wholesale"
                : omOverCap
                ? "Cancel next batch — OM over cap"
                : wholesaleQtdWatch
                ? "Watch — wholesale QTD under floor"
                : totals.rev > 0
                ? "Hard rules hold"
                : "—"}
            </div>
            <ul className="text-[8.5pt] text-[#2a2520] mt-[4pt] space-y-[2pt] leading-[1.4] print:text-[8pt] print:leading-[1.3] list-disc list-inside">
              <li>
                Rule 01 · OM salt hours{" "}
                <span className="font-mono">{state.omHours.toFixed(1)} / {OM_HOURS_CAP}</span>{" "}
                {omOverCap ? "— next batch cancelled, not absorbed." : "— within monthly cap."}
              </li>
              <li>
                Rule 02 · wholesale QTD CM%{" "}
                <span className="font-mono">
                  {wholesale && wholesale.qtdRevenue > 0
                    ? fmtPct(wholesale.qtdCmPct)
                    : "—"}
                </span>{" "}
                {wholesaleReprice
                  ? "— second quarter under 50%, channel repriced or dropped."
                  : state.monthInQuarter < 3
                  ? "— quarter still in progress; trigger evaluates at month 3."
                  : wholesaleQtdWatch
                  ? "— this quarter under 50%; if the prev-Q box gets ticked from this report next quarter and QTD is under again, the channel cuts."
                  : "— at or above floor."}
              </li>
              <li>
                Quarterly hours-by-pillar share rolls up from these OM hours —{" "}
                <a
                  href={`${import.meta.env.BASE_URL}hours`}
                  className="underline decoration-[#b85a3e] decoration-1 underline-offset-2 print:no-underline"
                >
                  see /hours
                </a>
                .
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-[8pt] print:mb-[5pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[7.5pt] print:mb-[2pt]">
            Bookkeeper&rsquo;s notes
          </div>
          <textarea
            value={state.notes}
            onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
            rows={3}
            placeholder="Anything the OM or contractor needs to know about this month — supplier price changes, slipped batches, freight surprises."
            className="w-full bg-transparent text-[9pt] text-[#2a2520] border border-[#c8bfa7] rounded-[2pt] p-[5pt] focus:outline-none focus:border-[#1f3d2e] print:text-[8.5pt] print:border-[#c8bfa7]"
          />
        </div>

        <div className="border-t border-[#c8bfa7] mt-[8pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:mt-[5pt] print:pt-[3pt] print:text-[6.5pt]">
          <div>
            Source: SALT-01 chart of accounts · slide VI · 03 (Salt P&amp;L line)
          </div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters · SALT-01 monthly close
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldBlock({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold print:text-[6.5pt]">
        {label}
      </div>
      {children}
      {hint && (
        <div className="text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
          {hint}
        </div>
      )}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  allowNegative = false,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  allowNegative?: boolean;
}) {
  return (
    <div className="inline-flex items-baseline justify-end gap-[1pt] w-full">
      {prefix && (
        <span className="font-mono text-[8pt] text-[#6b7665] print:text-[7.5pt]">
          {prefix}
        </span>
      )}
      <input
        type="number"
        inputMode="decimal"
        min={allowNegative ? undefined : 0}
        step={1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (!Number.isFinite(next)) return onChange(0);
          if (!allowNegative && next < 0) return onChange(0);
          onChange(next);
        }}
        className="w-full bg-transparent text-right font-mono text-[9pt] text-[#1f3d2e] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
      />
      {suffix && (
        <span className="font-mono text-[8pt] text-[#6b7665] print:text-[7.5pt]">
          {suffix}
        </span>
      )}
    </div>
  );
}

function LabourRow({
  label,
  hint,
  value,
  onChange,
  rateValue,
  onRateChange,
  flag,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  rateValue: number;
  onRateChange: (v: number) => void;
  flag: string | null;
}) {
  const total = value * rateValue;
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-[6pt] items-baseline">
      <div>
        <div className="font-semibold text-[#1f3d2e]">{label}</div>
        {hint && (
          <div className="text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
            {hint}
          </div>
        )}
      </div>
      <div className="inline-flex items-baseline gap-[3pt]">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={0.5}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(numOr0(e.target.value))}
          className="w-[40pt] bg-transparent text-right font-mono text-[9pt] text-[#1f3d2e] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
        />
        <span className="font-mono text-[7.5pt] text-[#6b7665] print:text-[7pt]">hrs</span>
      </div>
      <div className="inline-flex items-baseline gap-[3pt]">
        <span className="font-mono text-[7.5pt] text-[#6b7665] print:text-[7pt]">@ $</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={1}
          value={Number.isFinite(rateValue) ? rateValue : 0}
          onChange={(e) => onRateChange(numOr0(e.target.value))}
          className="w-[34pt] bg-transparent text-right font-mono text-[9pt] text-[#1f3d2e] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
        />
        <span className="font-mono text-[7.5pt] text-[#6b7665] print:text-[7pt]">/hr</span>
      </div>
      <div
        className="font-mono font-semibold text-right min-w-[44pt]"
        style={{ color: flag ? "#b85a3e" : "#1f3d2e" }}
      >
        {fmt(total)}
        {flag && (
          <div className="text-[7.5pt] font-semibold text-[#b85a3e] print:text-[7pt]">
            {flag}
          </div>
        )}
      </div>
    </div>
  );
}

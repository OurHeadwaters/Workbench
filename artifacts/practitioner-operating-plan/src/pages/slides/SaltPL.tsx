type ChannelRow = {
  name: string;
  rev: number;
  cogsPct: number;
  freightPct: number;
  packPct: number;
  laborShare: number;
  note: string;
};

const channels: ChannelRow[] = [
  {
    name: "Wholesale (12 retail accts)",
    rev: 72000,
    cogsPct: 22,
    freightPct: 5,
    packPct: 2,
    laborShare: 5500,
    note: "Volume + low pick cost. Anchor of the line.",
  },
  {
    name: "Custom labels (events, ~6/yr)",
    rev: 20000,
    cogsPct: 18,
    freightPct: 4,
    packPct: 3,
    laborShare: 1800,
    note: "Premium pricing, paid up front, deposit clears before run.",
  },
  {
    name: "DTC batch (~80 orders/mo)",
    rev: 14000,
    cogsPct: 25,
    freightPct: 12,
    packPct: 6,
    laborShare: 2900,
    note: "Highest pick/pack & freight per unit. Batch-only kept it viable.",
  },
  {
    name: "Markets (PR, 2–3/yr)",
    rev: 2000,
    cogsPct: 30,
    freightPct: 0,
    packPct: 5,
    laborShare: 300,
    note: "PR / cost-recovery — counted as marketing spend, not contribution.",
  },
];

const channelCm = (c: ChannelRow) => {
  const variable = (c.rev * (c.cogsPct + c.freightPct + c.packPct)) / 100;
  return c.rev - variable - c.laborShare;
};
const channelCmPct = (c: ChannelRow) => (channelCm(c) / c.rev) * 100;

const fmt = (n: number) => "$" + n.toLocaleString("en-US");
const fmtK = (n: number) => "$" + Math.round(n / 1000) + "k";

const totalRev = channels.reduce((s, c) => s + c.rev, 0);
const totalCogs = channels.reduce((s, c) => s + (c.rev * c.cogsPct) / 100, 0);
const totalFreight = channels.reduce(
  (s, c) => s + (c.rev * c.freightPct) / 100,
  0,
);
const totalPack = channels.reduce((s, c) => s + (c.rev * c.packPct) / 100, 0);
const totalLabor = channels.reduce((s, c) => s + c.laborShare, 0);
const depotAlloc = 3600; // ~10% of $3,000/mo facility line, annualised
const totalCost = totalCogs + totalFreight + totalPack + totalLabor + depotAlloc;
const netContribution = totalRev - totalCost;

export default function SaltPL() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VI · 06 — Salt P&amp;L line
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              ~{fmtK(netContribution)} a year, sitting next to the contract.
              <span className="italic font-normal text-accent"> Wholesale carries it; DTC pays for itself; markets are PR.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            The salt line is its own cost-centre on the bookkeeper's chart of
            accounts.{" "}
            <span className="text-primary font-semibold">
              Labor is allocated, not absorbed. Depot rent is allocated, not
              absorbed. Net contribution is what shows up in the agency P&amp;L.
            </span>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[1.2vw] mb-[1.5vh]"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.6vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold">
              Annual P&amp;L by channel
            </div>
            <div className="font-mono text-[0.75vw] text-muted">
              CM % = (revenue − COGS − freight − packaging − allocated labour) ÷ revenue · before depot allocation
            </div>
          </div>
          <table
            className="w-full text-[0.85vw] font-body"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="text-left text-muted font-mono uppercase tracking-[0.16em] text-[0.7vw]">
                <th className="py-[0.4vh] pr-[0.6vw] w-[26%]">Channel</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[10%]">Revenue</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[8%]">COGS</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[9%]">Freight</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[9%]">Packaging</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[10%]">Labor share</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[8%]">CM %</th>
                <th className="py-[0.4vh] text-muted text-[0.72vw] w-[20%]">Note</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c) => (
                <tr
                  key={c.name}
                  className="border-t"
                  style={{ borderColor: "var(--slide-rule)" }}
                >
                  <td className="py-[0.45vh] pr-[0.6vw] font-semibold text-text">
                    {c.name}
                  </td>
                  <td className="py-[0.45vh] pr-[0.6vw] text-right font-mono text-text">
                    {fmt(c.rev)}
                  </td>
                  <td className="py-[0.45vh] pr-[0.6vw] text-right font-mono text-muted">
                    {c.cogsPct}%
                  </td>
                  <td className="py-[0.45vh] pr-[0.6vw] text-right font-mono text-muted">
                    {c.freightPct}%
                  </td>
                  <td className="py-[0.45vh] pr-[0.6vw] text-right font-mono text-muted">
                    {c.packPct}%
                  </td>
                  <td className="py-[0.45vh] pr-[0.6vw] text-right font-mono text-text">
                    {fmt(c.laborShare)}
                  </td>
                  <td
                    className="py-[0.45vh] pr-[0.6vw] text-right font-mono font-semibold"
                    style={{ color: "var(--slide-accent)" }}
                  >
                    {channelCmPct(c).toFixed(0)}%
                  </td>
                  <td className="py-[0.45vh] text-muted text-[0.78vw] leading-[1.3]">
                    {c.note}
                  </td>
                </tr>
              ))}
              <tr
                className="border-t-2"
                style={{ borderColor: "var(--slide-primary)" }}
              >
                <td className="py-[0.55vh] pr-[0.6vw] font-display text-primary font-semibold text-[0.95vw]">
                  Salt line · annual
                </td>
                <td className="py-[0.55vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[0.95vw] font-mono">
                  {fmt(totalRev)}
                </td>
                <td colSpan={4} className="py-[0.55vh] pr-[0.6vw] text-right font-mono text-text text-[0.8vw]">
                  Variable cost {fmt(Math.round(totalCogs + totalFreight + totalPack))} · Labor {fmt(totalLabor)} · Depot allocation {fmt(depotAlloc)}
                </td>
                <td colSpan={2} className="py-[0.55vh] text-right font-display text-primary font-semibold text-[0.95vw] font-mono">
                  Net {fmt(Math.round(netContribution))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.2vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.4vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold mb-[0.8vh]">
              Where it sits in the agency P&amp;L
            </div>
            <div className="font-body text-[0.95vw] text-text leading-[1.5]">
              Recommended ask is <span className="font-semibold text-primary">$90k/mo · ~$1.08M/yr</span>{" "}
              of community-development revenue. The salt line adds{" "}
              <span className="font-semibold text-primary">~{fmtK(netContribution)} of net</span>{" "}
              on top — roughly{" "}
              <span className="font-semibold text-primary">
                {((netContribution / 1080000) * 100).toFixed(1)}%
              </span>{" "}
              of agency revenue. Material enough to fund a depot bench rotation;
              small enough that no quarter is salt-dependent.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.4vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold mb-[0.8vh]"
              style={{ color: "#e9c8a8" }}
            >
              What the net actually covers
            </div>
            <div className="font-body text-[0.95vw] leading-[1.5]">
              The ~{fmtK(netContribution)}/yr net funds the casual-labour bench
              that keeps Rule 01 enforceable — roughly{" "}
              <span className="font-semibold">$15k/yr in pre-vetted depot
              labour</span>{" "}
              plus the residual flowing into the agency reinvestment line. The
              salt line pays for the option not to need the founder's hands.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.4vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold mb-[0.8vh]">
              When this line gets cut
            </div>
            <div className="font-body text-[0.95vw] text-text leading-[1.5]">
              Two automatic triggers — same as Rule 02's quarterly check.{" "}
              <span className="font-semibold text-primary">If wholesale CM
              drops below 50%</span>{" "}
              two quarters running, the channel is repriced or dropped.{" "}
              <span className="font-semibold text-primary">If the salt line
              ever pulls OM hours past the 12-hr/month cap</span>, the next
              batch is cancelled, not absorbed.
            </div>
          </div>
        </div>

        <div className="mt-[1.2vh] font-body text-[0.78vw] text-muted leading-[1.35]">
          Numbers above are the planning baseline — actuals get reconciled
          monthly into the agency books under cost-centre{" "}
          <span className="font-mono text-text">SALT-01</span>. The bookkeeper
          publishes the channel-level CM in the same quarterly hours-by-pillar
          report that enforces Rule 02.
        </div>
      </div>
    </div>
  );
}

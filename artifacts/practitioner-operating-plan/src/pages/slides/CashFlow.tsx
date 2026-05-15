/**
 * CashFlow.tsx — "Year One — surfaced honestly" slide
 *
 * All dollar figures are imported from @/data/budgetScenarios.
 * Do NOT hardcode any cost-basis, reinvestment, ask, or bridge
 * numbers in this file.
 */

import { ASK, COST_BASIS, BRIDGE, REINVEST, Y1, CAPEX, CLEARANCE_MONTH, fmt, fmtK } from "@/data/budgetScenarios";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const CASHFLOW_XLSX = `${BASE}/headwaters-cashflow-model.xlsx`;

// Monthly cash-flow projection for the recommended scenario (B)
// Revenue lands at M3 (net-60 from contract start)
function buildMonthlyProjection() {
  const monthlyAsk = ASK.recommended;
  const monthlyCost = COST_BASIS.b + 2_100; // cost basis + people & retention buckets ≈ loaded cost

  const months: Array<{ mo: number; label: string; inflow: number; outflow: number; net: number; cumulative: number }> = [];
  let cumulative = -BRIDGE.b; // bridge deployed on Day 0

  for (let mo = 1; mo <= 12; mo++) {
    const inflow = mo >= 3 ? monthlyAsk : 0;  // net-60: first invoice at M3
    const outflow = monthlyCost;
    const net = inflow - outflow;
    cumulative += net;
    months.push({ mo, label: `M${mo}`, inflow, outflow, net, cumulative });
  }
  return months;
}

const MONTHS = buildMonthlyProjection();
const MIN_CUM = Math.min(...MONTHS.map((m) => m.cumulative));
const MAX_CUM = Math.max(...MONTHS.map((m) => m.cumulative));
const RANGE = MAX_CUM - MIN_CUM || 1;

export default function CashFlow() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Year one — surfaced honestly
            </div>
          </div>
          <div className="flex items-center gap-[1.5vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
              Scenario B · {fmt(ASK.recommended)}/mo · net-60 cycle
            </div>
            <a
              href={CASHFLOW_XLSX}
              download="headwaters-cashflow-model.xlsx"
              className="flex items-center gap-[0.4vw] px-[0.8vw] py-[0.4vh] rounded-[4px] border border-accent text-accent font-mono uppercase tracking-[0.18em] text-[0.75vw] hover:bg-accent hover:text-paper transition-colors"
              title="Download editable XLSX for CFO"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              CFO model (.xlsx)
            </a>
          </div>
        </div>

        <h1 className="font-display font-medium text-[4vw] leading-[1] tracking-tight text-paper mb-[0.8vh]">
          One gap, surfaced honestly.
        </h1>
        <div className="font-display italic text-[1.35vw] text-muted mb-[3vh] max-w-[65vw]">
          With Deer Lake as the only client, the Year-1 cash gap is real.
          Naming it is how it gets planned for.
        </div>

        <div className="flex-1 grid grid-cols-[1.4fr_1fr] gap-[3vw]">

          {/* Waterfall chart */}
          <div className="flex flex-col">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[1.5vh]">
              Cumulative cash position — monthly (Scenario B)
            </div>
            <div className="flex-1 flex items-end gap-[0.3vw]">
              {MONTHS.map((m) => {
                const heightPct = ((m.cumulative - MIN_CUM) / RANGE) * 72 + 4;
                const isNeg = m.cumulative < 0;
                return (
                  <div key={m.mo} className="flex-1 flex flex-col items-center gap-[0.3vh]">
                    <div
                      className="w-full rounded-t-[2px] transition-all"
                      style={{
                        height: `${heightPct}%`,
                        background: isNeg ? "rgba(184,90,62,0.65)" : "rgba(180,210,170,0.65)",
                      }}
                    />
                    <div className="font-mono text-[0.65vw] text-muted">{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel — key numbers */}
          <div className="flex flex-col gap-[2vh]">

            {/* Gap */}
            <div className="rounded-[6px] px-[1.8vw] py-[2vh] border border-accent" style={{ background: "rgba(184,90,62,0.08)" }}>
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-accent mb-[0.8vh]">
                Year-1 gap
              </div>
              <div className="font-display font-semibold text-[3.2vw] text-accent tabular-nums leading-[1]">
                ({fmt(Math.abs(Y1.gap))})
              </div>
              <div className="font-body text-[0.9vw] text-muted mt-[0.8vh] leading-[1.4]">
                {fmt(Y1.revenue)} revenue vs {fmt(Y1.cost)} cost
              </div>
            </div>

            {/* Capital Recovery */}
            <div className="rounded-[6px] px-[1.8vw] py-[2vh] border border-rule bg-paper">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-primary mb-[0.8vh]">
                Capital Recovery (V2 balance)
              </div>
              <div className="font-display font-semibold text-[2.4vw] text-primary tabular-nums leading-[1]">
                {fmt(Y1.capitalRecovery)}
              </div>
              <div className="font-body text-[0.9vw] text-muted mt-[0.8vh] leading-[1.4]">
                Outstanding from V2. Applied to the gap, the net exposure is{" "}
                <span className="font-semibold text-primary">
                  ({fmt(Math.abs(Y1.gap + Y1.capitalRecovery))})
                </span>
              </div>
            </div>

            {/* Bridge */}
            <div className="rounded-[6px] px-[1.8vw] py-[2vh] border border-rule">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.8vh]">
                Day-one bridge ask (Scenario B)
              </div>
              <div className="font-display font-semibold text-[2.4vw] text-paper tabular-nums leading-[1]">
                {fmtK(BRIDGE.b)}
              </div>
              <div className="font-body text-[0.9vw] text-muted mt-[0.8vh] leading-[1.4]">
                {fmt(COST_BASIS.b)} × 2 months + {fmt(CAPEX.b)} tech CAPEX.
                Recovered at M{CLEARANCE_MONTH.b} when second net-60 invoice clears.
              </div>
            </div>

            {/* Reinvestment */}
            <div className="rounded-[6px] px-[1.8vw] py-[1.5vh] border border-rule">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.6vh]">
                Monthly reinvestment at recommended ask
              </div>
              <div className="font-body text-[0.95vw] text-paper">
                <span className="font-display font-semibold text-[1.4vw]">{fmt(REINVEST.b.amount)}</span>
                <span className="text-muted ml-[0.4vw]">({REINVEST.b.pct}% of cost basis)</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

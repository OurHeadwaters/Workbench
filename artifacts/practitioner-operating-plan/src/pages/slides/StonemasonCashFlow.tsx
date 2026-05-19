/**
 * StonemasonCashFlow.tsx — Debt/cash-flow guidance + Deadhead live context
 */

import { CASHFLOW_PRIORITIES, DEADHEAD_MONTHLY, DEADHEAD_ANNUAL, GUILD_TITHE_PCT } from "@/data/stonemason";

export default function StonemasonCashFlow() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        <div className="flex items-center gap-[1vw] mb-[2vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Zone 3 Cash Flow &amp; Debt Guidance
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.8vw] leading-[1.05] tracking-tight text-paper mb-[1.2vh]">
          Pay yourself first. Build the floor. Retire the debt.
        </h1>
        <div className="font-display italic text-[1.2vw] text-muted mb-[3vh] max-w-[68vw]">
          Zone 3 income is sequenced — not pooled. Each stream has a job before it becomes operating cash.
        </div>

        <div className="grid grid-cols-2 gap-[3vw] flex-1 min-h-0">

          {/* Cash-flow priorities */}
          <div className="flex flex-col gap-[1.2vh]">
            <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted">
              Cash-flow priorities — in order
            </div>
            {CASHFLOW_PRIORITIES.map((p) => (
              <div key={p.order} className="flex items-start gap-[1.4vw] border border-rule rounded-[6px] px-[1.4vw] py-[1.4vh]">
                <div
                  className="font-display font-bold text-[2.4vw] tabular-nums leading-[1] shrink-0 w-[3vw] text-center"
                  style={{ color: "var(--slide-accent)" }}
                >
                  {p.order}
                </div>
                <div>
                  <div className="font-display font-semibold text-[1vw] text-paper mb-[0.3vh]">{p.label}</div>
                  <div className="font-body text-[0.8vw] text-muted leading-[1.5]">{p.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Deadhead SaaS + tithe context */}
          <div className="flex flex-col gap-[1.8vh]">
            <div>
              <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted mb-[0.8vh]">
                Deadhead SaaS — subscription income is proven
              </div>
              <div className="border border-rule rounded-[6px] px-[1.6vw] py-[1.6vh] flex flex-col gap-[0.8vh]">
                <div className="font-body text-[0.85vw] text-muted leading-[1.5]">
                  The platform already charges ${DEADHEAD_MONTHLY}/mo (${DEADHEAD_ANNUAL}/yr) with a 14-day free trial via Square.
                  This is not a concept — it is live revenue infrastructure. Every practitioner engagement that converts to a stewardship retainer
                  runs on the same billing model.
                </div>
              </div>
            </div>

            <div>
              <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted mb-[0.8vh]">
                Guild tithe — long-term insurance
              </div>
              <div className="border border-rule rounded-[6px] px-[1.6vw] py-[1.6vh] flex flex-col gap-[0.8vh]">
                <div className="font-display font-semibold text-[3vw] text-accent tabular-nums leading-[1]">
                  {GUILD_TITHE_PCT}%
                  <span className="font-body font-normal text-[0.9vw] text-muted"> for life</span>
                </div>
                <div className="font-body text-[0.82vw] text-muted leading-[1.5]">
                  Every Guild certification generates an 8% tithe back to the founding practitioner for as long as that certification
                  is active. Ten certified practitioners at $1,500/person = $1,200 per cohort — compounding quietly in the background.
                </div>
              </div>
            </div>

            <div className="border border-rule rounded-[6px] px-[1.6vw] py-[1.4vh] bg-paper/5">
              <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw] text-muted mb-[0.5vh]">
                On debt reduction
              </div>
              <div className="font-body text-[0.82vw] text-muted leading-[1.5]">
                Grant income is not operating income. Route it first to the operating LOC and any founder
                loans. Once debt is cleared, grants flow into runway extension — not into lifestyle.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

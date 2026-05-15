/**
 * CaseForRate.tsx — "Three revenue layers / case for the rate" slide
 *
 * All dollar figures are imported from @/data/budgetScenarios.
 * Do NOT hardcode any cost-basis, reinvestment, ask, or bridge
 * numbers in this file.
 */

import { ASK, COST_BASIS, REINVEST, Y1, fmt, fmtK } from "@/data/budgetScenarios";

// Layer 1 software-only contract (the signed today number)
const LAYER1_MONTHLY = 35_000;
const LAYER1_ANNUAL = LAYER1_MONTHLY * 12;

// Cross-reserve corridor (from @workspace/cross-reserve-corridor constants)
const INSTALL_REVENUE_PER_RESERVE = 148_500;
const RETAINER_ANNUAL = 30_000;
const TRAVEL_EXAMPLE = 22_500;

export default function CaseForRate() {
  const upgradeAsk = ASK.recommended;
  const upgradeAnnual = upgradeAsk * 12;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Three revenue layers — the case for the rate
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            {fmt(upgradeAsk)}/mo upgrade · {fmt(COST_BASIS.b)}/mo cost basis · {REINVEST.b.pct}% reinvestment
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.8vw] leading-[1] tracking-tight text-paper mb-[0.8vh]">
          Three layers. One ask.
        </h1>
        <div className="font-display italic text-[1.3vw] text-muted mb-[3vh] max-w-[65vw]">
          Layer 1 is the contract signed today. Layer 2 and 3 are what the recommended ask unlocks —
          managed services, cross-reserve installs, and the reinvestment that makes it repeatable.
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[2vw]">

          {/* Layer 1 */}
          <div className="border border-rule rounded-[6px] px-[1.8vw] py-[2.5vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.75vw] text-muted mb-[1vh]">Layer 1 · Signed today</div>
            <div className="font-display text-[1.6vw] font-semibold text-paper mb-[0.5vh]">Software-only contract</div>
            <div className="font-display text-[2.8vw] font-semibold text-accent tabular-nums leading-[1] mb-[1.5vh]">
              {fmt(LAYER1_MONTHLY)}<span className="text-[0.9vw] text-muted font-normal font-body">/mo</span>
            </div>
            <div className="font-body text-[0.9vw] text-muted leading-[1.45] flex-1">
              License, ongoing dev, practitioner advisory, monthly visit, Dryden Hub coordination,
              three training cohorts. Software owned by the band, reused across every band that adopts it.
            </div>
            <div className="mt-[1.5vh] pt-[1.5vh] border-t border-rule font-mono text-[0.75vw] text-muted tabular-nums">
              Annual: {fmt(LAYER1_ANNUAL)}
            </div>
          </div>

          {/* Layer 2 */}
          <div className="border border-rule rounded-[6px] px-[1.8vw] py-[2.5vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.75vw] text-muted mb-[1vh]">Layer 2 · Upgrade ask</div>
            <div className="font-display text-[1.6vw] font-semibold text-paper mb-[0.5vh]">Full-stack agency engagement</div>
            <div className="font-display text-[2.8vw] font-semibold text-paper tabular-nums leading-[1] mb-[1.5vh]">
              {fmt(upgradeAsk)}<span className="text-[0.9vw] text-muted font-normal font-body">/mo</span>
            </div>
            <div className="font-body text-[0.9vw] text-muted leading-[1.45] flex-1">
              Absorbs and replaces Layer 1. Adds managed services fee, tech-stack ops, and the
              reinvestment line ({fmt(REINVEST.b.amount)}/mo · {REINVEST.b.pct}% of cost basis)
              that seeds Pilot #2 without waiting for grants.
            </div>
            <div className="mt-[1.5vh] pt-[1.5vh] border-t border-rule font-mono text-[0.75vw] text-muted tabular-nums">
              Annual: {fmt(upgradeAnnual)} · Cost basis: {fmt(COST_BASIS.b)}/mo
            </div>
          </div>

          {/* Layer 3 */}
          <div className="border border-rule rounded-[6px] px-[1.8vw] py-[2.5vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.75vw] text-muted mb-[1vh]">Layer 3 · Cross-reserve</div>
            <div className="font-display text-[1.6vw] font-semibold text-paper mb-[0.5vh]">Install + retainer</div>
            <div className="font-display text-[2.8vw] font-semibold text-paper tabular-nums leading-[1] mb-[1.5vh]">
              {fmtK(INSTALL_REVENUE_PER_RESERVE)}<span className="text-[0.9vw] text-muted font-normal font-body"> install</span>
            </div>
            <div className="font-body text-[0.9vw] text-muted leading-[1.45] flex-1">
              12-week install at a receiving reserve: {fmt(INSTALL_REVENUE_PER_RESERVE)} fee +{" "}
              {fmt(TRAVEL_EXAMPLE)} travel pass-through + {fmt(RETAINER_ANNUAL)}/yr retainer.
              The practitioner is the trainer, not a Deer Lake grad.
            </div>
            <div className="mt-[1.5vh] pt-[1.5vh] border-t border-rule font-mono text-[0.75vw] text-muted tabular-nums">
              Retainer: {fmt(RETAINER_ANNUAL)}/yr · Travel billed at cost
            </div>
          </div>

        </div>

        {/* Revenue reconciliation footer */}
        <div className="mt-[2vh] pt-[1.5vh] border-t border-rule grid grid-cols-[1fr_auto] gap-[2vw] items-center">
          <div className="font-body text-[0.85vw] text-muted leading-[1.45]">
            Y1 revenue total ({fmt(Y1.revenue)}) = Layer-1 contract ({fmt(LAYER1_ANNUAL)}) + tech-stack fee + 807 CDP grant + Salts net cash.
            The {fmt(upgradeAsk)}/mo upgrade ask absorbs / replaces the Layer-1 line.
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] text-muted mb-[0.3vh]">Y1 revenue total</div>
            <div className="font-display font-semibold text-[2vw] text-paper tabular-nums">{fmt(Y1.revenue)}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

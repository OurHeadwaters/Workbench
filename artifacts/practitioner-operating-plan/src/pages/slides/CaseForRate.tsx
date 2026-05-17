/**
 * CaseForRate.tsx — Case for the $175/hr rate
 */

import { PRACTITIONER_RATE, fmt } from "@/data/budgetScenarios";

const LAYER1_MONTHLY = 35_000;
const LAYER1_ANNUAL = LAYER1_MONTHLY * 12;
const PHASE1_FEE = 28_000;

export default function CaseForRate() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-center gap-[1vw] mb-[2vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            The case for the rate
          </div>
        </div>

        <h1 className="font-display font-medium text-[4vw] leading-[1] tracking-tight text-paper mb-[1.5vh]">
          {fmt(PRACTITIONER_RATE)}/hr is not the cost.<br />It is the baseline.
        </h1>
        <div className="font-display italic text-[1.35vw] text-muted mb-[4vh] max-w-[65vw]">
          Phase-based pricing means you pay for outcomes, not hours. The rate is the floor — the phases are priced on what they deliver.
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[2vw]">
          <div className="rounded-[6px] border border-rule px-[1.8vw] py-[2vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw] text-muted">Phase 1 — The Plan</div>
            <div className="font-display font-semibold text-[2.8vw] text-paper tabular-nums leading-[1]">{fmt(PHASE1_FEE)}</div>
            <div className="font-body text-[0.82vw] text-muted leading-[1.45]">
              6 weeks. Full discovery, operations guide, hiring plan, grant roadmap. Stop here if you want — everything stays with the community.
            </div>
          </div>
          <div className="rounded-[6px] border border-accent px-[1.8vw] py-[2vh] flex flex-col gap-[1vh]" style={{ background: "rgba(184,90,62,0.07)" }}>
            <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw] text-accent">Layer 1 — Software</div>
            <div className="font-display font-semibold text-[2.8vw] text-accent tabular-nums leading-[1]">{fmt(LAYER1_MONTHLY)}/mo</div>
            <div className="font-body text-[0.82vw] text-muted leading-[1.45]">
              Signed Layer 1 contract — {fmt(LAYER1_ANNUAL)}/yr. The platform that runs under the pilot.
            </div>
          </div>
          <div className="rounded-[6px] border border-rule px-[1.8vw] py-[2vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw] text-muted">Value delivered</div>
            <div className="font-display font-semibold text-[2.8vw] text-paper tabular-nums leading-[1]">10×</div>
            <div className="font-body text-[0.82vw] text-muted leading-[1.45]">
              Each practitioner hour produces roughly 10× the output of a single billed hour. Phase pricing reflects that — not hourly consulting.
            </div>
          </div>
        </div>

        <div className="mt-[2vh] pt-[1.5vh] border-t border-rule font-display italic text-[1vw] text-muted">
          "We don't hide our numbers; we deliver on them." Every engagement starts with real figures — margin per unit, volume required to reach viability, what the operator needs to live on. Dollar-honest, before anything else is honest.
        </div>
      </div>
    </div>
  );
}

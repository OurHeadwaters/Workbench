/**
 * Budget.tsx — Phase pricing slide (stub — awaiting new deck content)
 *
 * The old A/B/C monthly team budget has been replaced with phase-based pricing.
 * This slide will be rebuilt to show the four-phase engagement model.
 */

import { PHASES, PHASE_COSTS, fmt, fmtK } from "@/data/budgetScenarios";

export default function Budget() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-center gap-[1vw] mb-[2vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Engagement pricing — four phases
          </div>
        </div>
        <h1 className="font-display font-medium text-[4vw] leading-[1] tracking-tight text-paper mb-[3vh]">
          Phase-based. Fixed fees. Open numbers.
        </h1>
        <div className="flex-1 grid grid-cols-2 gap-[2vw]">
          {PHASE_COSTS.map((pc) => (
            <div key={pc.phase.id} className="rounded-[6px] border border-rule px-[1.8vw] py-[1.8vh] flex flex-col gap-[0.8vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] text-accent">
                Phase {pc.phase.num} — {pc.phase.label}
              </div>
              <div className="font-display font-semibold text-[2.2vw] text-paper tabular-nums leading-[1]">
                {pc.feeDisplay}
              </div>
              <div className="font-body text-[0.82vw] text-muted leading-[1.45]">{pc.phase.duration}</div>
              <div className="font-body text-[0.78vw] text-muted leading-[1.4] mt-[0.4vh]">{pc.phase.headline}</div>
              <div className="mt-auto pt-[0.8vh] border-t border-rule font-mono text-[0.68vw] text-muted">
                Cost to deliver: {fmt(pc.totalCost)} · Labour: {fmt(pc.laborCost)} · Travel: {fmt(pc.travelCost)}
                {pc.subCost > 0 && ` · Subcontract: ${fmt(pc.subCost)}`}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[2vh] pt-[1.5vh] border-t border-rule font-mono text-[0.75vw] text-muted">
          Full engagement: {fmt(PHASES.reduce((s, p) => s + (p.feeFlat ?? p.feeMin ?? 0), 0))}–{fmt(PHASES.reduce((s, p) => s + (p.feeFlat ?? p.feeMax ?? 0), 0))} · $175/hr practitioner baseline · {PHASES.reduce((s, p) => s + p.practDays, 0)} practitioner days total
        </div>
      </div>
    </div>
  );
}

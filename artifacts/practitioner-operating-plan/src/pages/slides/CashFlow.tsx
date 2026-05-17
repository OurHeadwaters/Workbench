/**
 * CashFlow.tsx — Phase revenue timeline slide
 */

import { PHASES, PHASE_COSTS, fmt } from "@/data/budgetScenarios";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function CashFlow() {
  const totalFeeMin = PHASES.reduce((s, p) => s + (p.feeFlat ?? p.feeMin ?? 0), 0);
  const totalFeeMax = PHASES.reduce((s, p) => s + (p.feeFlat ?? p.feeMax ?? 0), 0);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Revenue timeline — four phases
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            $175/hr · phase-based · stop-at-any-point
          </div>
        </div>

        <h1 className="font-display font-medium text-[4vw] leading-[1] tracking-tight text-paper mb-[0.8vh]">
          One phase at a time.
        </h1>
        <div className="font-display italic text-[1.35vw] text-muted mb-[3vh] max-w-[65vw]">
          Each phase is a standalone deliverable. The community can stop at any point — everything built stays with them.
        </div>

        <div className="flex-1 flex flex-col gap-[1.5vh]">
          {PHASE_COSTS.map((pc, i) => {
            const feeMin = pc.phase.feeFlat ?? pc.phase.feeMin ?? 0;
            const feeMax = pc.phase.feeFlat ?? pc.phase.feeMax ?? 0;
            const barPct = Math.round((feeMin / totalFeeMax) * 100);
            return (
              <div key={pc.phase.id} className="flex items-center gap-[2vw]">
                <div className="w-[6vw] shrink-0 text-right">
                  <div className="font-mono text-[0.75vw] text-accent font-semibold">Phase {pc.phase.num}</div>
                  <div className="font-mono text-[0.65vw] text-muted">{pc.phase.label}</div>
                </div>
                <div className="flex-1 relative h-[4.5vh] rounded-[4px] overflow-hidden" style={{ background: "rgba(200,191,167,0.15)" }}>
                  <div className="absolute inset-y-0 left-0 rounded-[4px]"
                    style={{ width: `${barPct}%`, background: i === 0 ? "rgba(184,90,62,0.7)" : "rgba(31,61,46,0.5)" }} />
                  <div className="absolute inset-0 flex items-center px-[1vw] justify-between">
                    <span className="font-body text-[0.8vw] text-paper font-medium">{pc.phase.headline}</span>
                    <span className="font-display font-semibold text-[1vw] text-paper tabular-nums shrink-0 ml-[1vw]">
                      {pc.feeDisplay}
                    </span>
                  </div>
                </div>
                <div className="w-[8vw] shrink-0 font-mono text-[0.65vw] text-muted text-right leading-[1.4]">
                  {pc.phase.duration}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-[2vh] pt-[1.5vh] border-t border-rule grid grid-cols-3 gap-[2vw]">
          <div>
            <div className="font-mono uppercase tracking-[0.14em] text-[0.65vw] text-muted mb-[0.3vh]">Full engagement range</div>
            <div className="font-display font-semibold text-[1.6vw] text-paper">{fmt(totalFeeMin)}–{fmt(totalFeeMax)}</div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-[0.14em] text-[0.65vw] text-muted mb-[0.3vh]">Practitioner days</div>
            <div className="font-display font-semibold text-[1.6vw] text-paper">{PHASES.reduce((s, p) => s + p.practDays, 0)} days</div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-[0.14em] text-[0.65vw] text-muted mb-[0.3vh]">Distribution ops via</div>
            <div className="font-display font-semibold text-[1.6vw] text-paper">807 Co-op · 2027</div>
          </div>
        </div>
      </div>
    </div>
  );
}

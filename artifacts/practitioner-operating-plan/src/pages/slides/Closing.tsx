/**
 * Closing.tsx — Deck closing slide
 */

import { PHASES, fmt } from "@/data/budgetScenarios";

export default function Closing() {
  const phase1 = PHASES[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col justify-between text-paper">

        <div className="flex items-center gap-[1vw]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Next steps
          </div>
        </div>

        <div>
          <h1 className="font-display font-medium text-[5.5vw] leading-[1] tracking-tight text-paper mb-[2vh]">
            Phase 1 starts the conversation.<br />
            <span className="text-accent">{fmt(phase1.feeFlat!)}. 6 weeks. You keep everything.</span>
          </h1>
          <div className="font-display italic text-[1.6vw] text-muted max-w-[60vw]">
            No long-term commitment required. Everything built in Phase 1 stays with the community — the plan, the numbers, the contacts.
            At the end of six weeks, leadership decides what happens next.
          </div>
        </div>

        <div className="grid grid-cols-4 gap-[2vw]">
          {PHASES.map((p) => (
            <div key={p.id} className="border border-rule rounded-[6px] px-[1.4vw] py-[1.4vh]">
              <div className="font-mono uppercase tracking-[0.16em] text-[0.68vw] text-accent mb-[0.6vh]">
                Phase {p.num}
              </div>
              <div className="font-display font-semibold text-[1.2vw] text-paper mb-[0.4vh]">{p.label}</div>
              <div className="font-body text-[0.75vw] text-muted leading-[1.4]">{p.duration}</div>
              <div className="font-display font-semibold text-[1vw] text-paper mt-[0.8vh] tabular-nums">
                {p.feeFlat ? fmt(p.feeFlat) : `${fmt(p.feeMin!)}–${fmt(p.feeMax!)}`}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="font-display font-semibold text-[1.6vw] text-paper mb-[0.4vh]">Headwaters Development Services</div>
            <div className="font-mono text-[0.8vw] text-muted">Wabigoon, Ontario — Treaty 3 Territory</div>
            <div className="font-mono text-[0.8vw] text-muted">ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654</div>
          </div>
          <div className="font-display italic text-[1.1vw] text-muted text-right max-w-[30vw]">
            "The goal is not a store that Headwaters runs.<br />
            It is a store the community owns."
          </div>
        </div>

      </div>
    </div>
  );
}

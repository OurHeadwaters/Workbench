/**
 * SecondAnchorScenarios.tsx — Second anchor / Pilot #2 timing scenarios
 */

import { fmt } from "@/data/budgetScenarios";

const PHASE1_FEE = 28_000;
const INSTALL_REVENUE = 148_500;
const RETAINER_ANNUAL = 30_000;

interface TimingScenario {
  label: string;
  landMonth: number;
  note: string;
  y1Revenue: number;
}

const SCENARIOS: TimingScenario[] = [
  { label: "Early — Month 4",  landMonth: 4,  note: "Pilot #2 signed while Deer Lake Phase 1 is still running", y1Revenue: PHASE1_FEE + 35_000 * 12 + (INSTALL_REVENUE * 9 / 12) },
  { label: "Mid — Month 7",   landMonth: 7,  note: "Phase 2 operational at Deer Lake, Pilot #2 Phase 1 begins", y1Revenue: PHASE1_FEE + 35_000 * 12 + (INSTALL_REVENUE * 6 / 12) },
  { label: "Late — Month 10", landMonth: 10, note: "Deer Lake fully running, Pilot #2 starts Q4",              y1Revenue: PHASE1_FEE + 35_000 * 12 + (INSTALL_REVENUE * 3 / 12) },
];

export default function SecondAnchorScenarios() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-center gap-[1vw] mb-[2vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Pilot #2 — timing scenarios
          </div>
        </div>

        <h1 className="font-display font-medium text-[4vw] leading-[1] tracking-tight text-paper mb-[1.5vh]">
          When does the second anchor land?
        </h1>
        <div className="font-display italic text-[1.35vw] text-muted mb-[4vh] max-w-[65vw]">
          The Deer Lake pilot creates the template. The question is which community picks it up first and when.
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[2vw]">
          {SCENARIOS.map((s, i) => (
            <div key={s.label} className="rounded-[6px] border px-[1.8vw] py-[2vh] flex flex-col gap-[1.2vh]"
              style={{ borderColor: i === 1 ? "var(--slide-accent)" : "var(--slide-rule)", background: i === 1 ? "rgba(184,90,62,0.07)" : "transparent" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw]"
                style={{ color: i === 1 ? "var(--slide-accent)" : "var(--slide-muted)" }}>
                {i === 1 ? "Most likely" : i === 0 ? "Optimistic" : "Conservative"}
              </div>
              <div className="font-display font-semibold text-[1.3vw] text-paper">{s.label}</div>
              <div className="font-display font-semibold text-[2.4vw] text-paper tabular-nums leading-[1]">
                {fmt(s.y1Revenue)}
              </div>
              <div className="font-mono uppercase tracking-[0.1em] text-[0.65vw] text-muted">Year 1 total revenue</div>
              <div className="font-body text-[0.8vw] text-muted leading-[1.4] mt-[0.5vh]">{s.note}</div>
              <div className="mt-auto pt-[0.8vh] border-t font-mono text-[0.65vw] text-muted"
                style={{ borderColor: "var(--slide-rule)" }}>
                Retainer adds {fmt(RETAINER_ANNUAL)}/yr from Year 2
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

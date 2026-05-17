/**
 * PathToScale.tsx — Path to Pilot #2 and beyond
 */

import { fmt } from "@/data/budgetScenarios";

const PHASE1_FEE = 28_000;
const INSTALL_REVENUE_PER_RESERVE = 148_500;
const RETAINER_ANNUAL = 30_000;

const years = [
  { label: "Year 1", amount: PHASE1_FEE * 1 + 35_000 * 12, note: "Deer Lake Phase 1 + Layer 1 software contract" },
  { label: "Year 2", amount: 35_000 * 12 + INSTALL_REVENUE_PER_RESERVE, note: "Deer Lake running + Pilot #2 Phase 1" },
  { label: "Year 3", amount: 35_000 * 12 + INSTALL_REVENUE_PER_RESERVE * 2 + RETAINER_ANNUAL, note: "Two pilots running + Deer Lake retainer" },
];

const maxAmount = Math.max(...years.map((y) => y.amount));

export default function PathToScale() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-center gap-[1vw] mb-[2vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Path to scale — Pilot #2 and beyond
          </div>
        </div>

        <h1 className="font-display font-medium text-[4vw] leading-[1] tracking-tight text-paper mb-[1.5vh]">
          One pilot proves the model.<br />The model replicates.
        </h1>
        <div className="font-display italic text-[1.35vw] text-muted mb-[4vh] max-w-[65vw]">
          Deer Lake is Pilot #1. The documentation, the supply relationships, the financial records — all of it becomes the template for the next community.
        </div>

        <div className="flex-1 flex items-end gap-[4vw] pb-[2vh]">
          {years.map((y) => {
            const heightPct = (y.amount / maxAmount) * 70;
            return (
              <div key={y.label} className="flex-1 flex flex-col items-center gap-[1vh]">
                <div className="font-display font-semibold text-[1.4vw] text-paper tabular-nums">{fmt(y.amount)}</div>
                <div className="w-full rounded-t-[4px] transition-all" style={{ height: `${heightPct}vh`, background: "rgba(180,210,170,0.5)" }} />
                <div className="text-center">
                  <div className="font-display font-semibold text-[1.1vw] text-paper">{y.label}</div>
                  <div className="font-body text-[0.78vw] text-muted leading-[1.4]">{y.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-[1vh] pt-[1.5vh] border-t border-rule font-body text-[0.85vw] text-muted leading-[1.5]">
          Each community that runs the model generates the financial record that funds the next one. 807 Food Co-operative supply line activates in 2027 — bulk pricing changes the economics permanently.
        </div>
      </div>
    </div>
  );
}

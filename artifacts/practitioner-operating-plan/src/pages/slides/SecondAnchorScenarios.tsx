import { Y1, fmt, fmtK, ASK } from "@/data/budgetScenarios";

const INSTALL_REVENUE = 148_500;
const RETAINER_ANNUAL = 30_000;
const INSTALL_WEEKS   = 12;

interface TimingScenario {
  landMonth: number;
  installInflow: number;
  retainerMonths: number;
  retainerInflow: number;
  totalInflow: number;
  closesGap: boolean;
}

function buildTiming(): TimingScenario[] {
  const gap = Math.abs(Y1.gap);
  return [3, 6, 9].map((landMonth) => {
    const installCompletedInY1 = landMonth + INSTALL_WEEKS / 4 <= 12;
    const installInflow = installCompletedInY1 ? INSTALL_REVENUE : Math.max(0, (12 - landMonth) / (INSTALL_WEEKS / 4)) * INSTALL_REVENUE;
    const retainerMonths = installCompletedInY1 ? Math.max(0, 12 - (landMonth + INSTALL_WEEKS / 4)) : 0;
    const retainerInflow = (RETAINER_ANNUAL / 12) * retainerMonths;
    const totalInflow = installInflow + retainerInflow;
    return { landMonth, installInflow, retainerMonths, retainerInflow, totalInflow, closesGap: totalInflow >= gap };
  });
}

export default function SecondAnchorScenarios() {
  const timing = buildTiming();
  const gap = Math.abs(Y1.gap);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">Closing the Y1 gap</div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">Second anchor — cross-reserve install</div>
        </div>
        <h1 className="font-display font-medium text-[4vw] leading-[1] tracking-tight text-paper mb-[1vh]">
          The second anchor closes the gap.
        </h1>
        <div className="font-display italic text-[1.35vw] text-muted mb-[3vh]">
          A single cross-reserve install lands before M9 and the Year-1 gap disappears.
          Gap to close: {fmt(gap)}.
        </div>
        <div className="grid grid-cols-3 gap-[2vw] flex-1">
          {timing.map((t) => (
            <div
              key={t.landMonth}
              className="rounded-[6px] px-[1.8vw] py-[2vh] flex flex-col"
              style={{
                border: t.closesGap ? "1px solid var(--slide-accent)" : "1px solid var(--color-rule)",
                background: t.closesGap ? "rgba(184,90,62,0.08)" : "transparent",
              }}
            >
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[1vh]">
                Install lands M{t.landMonth}
              </div>
              <div className="font-display text-[2.2vw] font-semibold text-paper tabular-nums mb-[0.5vh]">
                {fmt(t.totalInflow)}
              </div>
              <div className="font-body text-[0.85vw] text-muted leading-[1.45] flex-1">
                Install: {fmt(t.installInflow)}<br />
                Retainer: {fmt(t.retainerInflow)} ({t.retainerMonths} mo)<br />
                Surplus: {t.totalInflow >= gap ? `+${fmt(t.totalInflow - gap)}` : `(${fmt(gap - t.totalInflow)}) short`}
              </div>
              {t.closesGap && (
                <div className="mt-[1vh] font-mono uppercase tracking-[0.18em] text-[0.7vw] text-accent">
                  ✓ Gap closed
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-[2vh] pt-[1.5vh] border-t border-rule font-body text-[0.85vw] text-muted leading-[1.45]">
          Past M9, the {INSTALL_WEEKS}-week install can't complete inside Y1; install revenue starts to spill into Y2.
          This slide closes the gap question — it does not pick which reserve the second anchor is
          (see Pilot #2 candidate-scoring), nor redo the Y2/Y3 path-to-scale headlines.
        </div>
      </div>
    </div>
  );
}

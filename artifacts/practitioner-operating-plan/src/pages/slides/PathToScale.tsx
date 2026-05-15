import { ASK, fmt } from "@/data/budgetScenarios";

const INSTALL_REVENUE_PER_RESERVE = 148_500;
const RETAINER_ANNUAL = 30_000;
const INSTALLS_Y2 = 2;
const INSTALLS_Y3 = 2;

const y1 = ASK.recommended * 12;
const y2 = ASK.recommended * 12 + INSTALLS_Y2 * (INSTALL_REVENUE_PER_RESERVE + RETAINER_ANNUAL);
const y3 = ASK.recommended * 12 + INSTALLS_Y3 * (INSTALL_REVENUE_PER_RESERVE + RETAINER_ANNUAL) + INSTALLS_Y2 * RETAINER_ANNUAL * 2;

export default function PathToScale() {
  const bars = [
    { label: "Year 1", amount: y1,  note: "Deer Lake · practitioner bedding in" },
    { label: "Year 2", amount: y2,  note: `Deer Lake + ${INSTALLS_Y2} cross-reserve installs` },
    { label: "Year 3", amount: y3,  note: `Deer Lake + ${INSTALLS_Y2 + INSTALLS_Y3} installs + retainers compounding` },
  ];
  const max = Math.max(...bars.map((b) => b.amount));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">Path to scale</div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            {fmt(ASK.recommended)}/mo recommended ask · cross-reserve compounding
          </div>
        </div>
        <h1 className="font-display font-medium text-[4.2vw] leading-[1] tracking-tight text-paper mb-[1vh]">
          Three years. Many reserves.
        </h1>
        <div className="font-display italic text-[1.35vw] text-muted mb-[4vh]">
          The Deer Lake contract is the foundation. Every cross-reserve install adds a retainer that compounds.
          The practitioner is the trainer, not a Deer Lake grad.
        </div>
        <div className="flex-1 flex items-end gap-[4vw] pb-[3vh]">
          {bars.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-start gap-[1.5vh]">
              <div className="font-display font-semibold text-[2.2vw] text-paper tabular-nums">{fmt(b.amount)}</div>
              <div
                className="w-full rounded-t-[4px]"
                style={{
                  height: `${(b.amount / max) * 55}vh`,
                  background: "linear-gradient(180deg, rgba(184,90,62,0.8) 0%, rgba(184,90,62,0.4) 100%)",
                }}
              />
              <div>
                <div className="font-mono uppercase tracking-[0.18em] text-[0.8vw] text-muted">{b.label}</div>
                <div className="font-body text-[0.85vw] text-muted mt-[0.3vh]">{b.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

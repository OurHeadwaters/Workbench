export default function PilotDeerLake() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VII · 01 — Why Deer Lake is Pilot #1
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Not a one-off contract.
              <span className="italic font-normal text-accent"> The first instance of a model.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            "Pilot" means every system we build for Deer Lake is built to be
            replicable, documented, and handed over —{" "}
            <span className="text-primary font-semibold">to the band first, and to the next reserve next.</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold mb-[1vh]">
              The right scale
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
              ~870 people. Real, but legible.
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.5] flex-1">
              Big enough that the numbers matter (a $1.6–2.0M/yr grocery
              economy, a band administration with real governance, an existing
              council with a procurement track record). Small enough that one
              practitioner with one structured team can be present, named, and
              accountable to every household.
            </div>
            <div
              className="mt-[1vh] pt-[0.8vh] border-t font-mono text-[0.82vw] text-muted"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Goldilocks for proving the model.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold mb-[1vh]">
              A council ready for transparency
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
              They've named the problem.
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.5] flex-1">
              Deer Lake council has been clear about the incumbent grocery
              reality and the leakage of subsidy dollars. They want public
              prices, public margins, and public delivery numbers — the exact
              transparency stack we're building. The political will is already
              there; we're shipping the tools to act on it.
            </div>
            <div
              className="mt-[1vh] pt-[0.8vh] border-t font-mono text-[0.82vw] text-muted"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Demand-side ready. Supply-side is the build.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.9vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              A practitioner with skin in the game
            </div>
            <div className="font-display text-[1.7vw] leading-tight font-medium mb-[1vh]">
              And the structural plan to deliver.
            </div>
            <div className="font-body text-[1.05vw] leading-[1.5] opacity-95 flex-1">
              The Operating Plan in Parts I–V is the structure. The team is
              named, the budget is costed, the cash bridge is real, the hiring
              runbook is written, and the accountability is auditable. The
              practitioner isn't a stranger flying in for a quarter — this is
              a multi-year commitment with the kids, the calendar, and the
              business model all designed to support it.
            </div>
            <div
              className="mt-[1vh] pt-[0.8vh] border-t font-mono text-[0.82vw]"
              style={{ borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }}
            >
              The plan is the proof.
            </div>
          </div>
        </div>

        <div
          className="mt-[1.5vh] pt-[1.2vh] border-t font-display italic text-[1.4vw] text-muted leading-[1.4] max-w-[80vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          Deer Lake gets everything they deserve — fully resourced, fully
          transparent, fully accountable. And the work we do for them becomes
          the playbook the next reserve doesn't have to invent from scratch.
        </div>
      </div>
    </div>
  );
}

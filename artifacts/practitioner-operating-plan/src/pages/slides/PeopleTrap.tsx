export default function PeopleTrap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · People &amp; Retention · 05 — The trap to avoid
            </div>
            <h2
              className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              The %-on-contract-value trap.
              <span className="italic font-normal text-accent"> Named here so a future board doesn't reinvent it.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.05vw] text-muted leading-[1.4]">
            Every well-meaning hire memo eventually proposes it.{" "}
            <span className="text-primary font-semibold">
              Whoever brought the contract gets X% of its value.
            </span>{" "}
            It sounds fair. It is not.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.4vw] min-h-0">
          <div
            className="col-span-1 rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.9vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              The trap
            </div>
            <div className="font-display text-[1.6vw] leading-tight font-medium mb-[1.2vh]">
              "X% of the contract value goes to whoever sourced it."
            </div>
            <div className="font-body text-[1vw] leading-[1.5] opacity-95">
              5% of $1.08M is $54k a year, indefinitely, for one person, for
              one signature. Compounded across multiple contracts, it
              swallows the reinvestment line in two years.
            </div>
          </div>

          <div
            className="col-span-1 rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold mb-[1vh]">
              What it does to the work
            </div>
            <div className="space-y-[1vh] font-body text-[1vw] text-text leading-[1.45]">
              <div className="flex gap-[0.7vw]">
                <div className="text-accent font-semibold w-[1vw] shrink-0">→</div>
                <div>
                  Contract delivery becomes someone else's problem the
                  moment the ink dries.
                </div>
              </div>
              <div className="flex gap-[0.7vw]">
                <div className="text-accent font-semibold w-[1vw] shrink-0">→</div>
                <div>
                  Renewal pressure tilts toward bigger contracts, not
                  better-fit ones.
                </div>
              </div>
              <div className="flex gap-[0.7vw]">
                <div className="text-accent font-semibold w-[1vw] shrink-0">→</div>
                <div>
                  Crew resents the line on the P&amp;L that funds someone
                  else's house.
                </div>
              </div>
              <div className="flex gap-[0.7vw]">
                <div className="text-accent font-semibold w-[1vw] shrink-0">→</div>
                <div>
                  Reinvestment line evaporates first. Pilot #2 can't fund
                  itself.
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-span-1 rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold mb-[1vh]">
              What we use instead
            </div>
            <div className="space-y-[1vh] font-body text-[1vw] text-text leading-[1.45]">
              <div className="flex gap-[0.7vw]">
                <div className="text-accent font-semibold w-[1vw] shrink-0">✓</div>
                <div>
                  <span className="font-semibold text-primary">Origination credit, named publicly.</span>{" "}
                  The story is told; the cheque is not signed.
                </div>
              </div>
              <div className="flex gap-[0.7vw]">
                <div className="text-accent font-semibold w-[1vw] shrink-0">✓</div>
                <div>
                  <span className="font-semibold text-primary">Crew-wide profit share</span> on
                  the surplus the contract actually produces, after delivery.
                </div>
              </div>
              <div className="flex gap-[0.7vw]">
                <div className="text-accent font-semibold w-[1vw] shrink-0">✓</div>
                <div>
                  <span className="font-semibold text-primary">Outcome milestone bonuses</span>{" "}
                  paid against named, audited results — not signatures.
                </div>
              </div>
            </div>
            <div
              className="mt-auto pt-[1.2vh] border-t font-mono uppercase tracking-[0.18em] text-[0.78vw] text-muted"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Reward the outcome. Never the signature.
            </div>
          </div>
        </div>

        <div
          className="mt-[2vh] pt-[1.2vh] border-t font-display italic text-[1.2vw] text-muted leading-[1.4] max-w-[80vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          If a future hire memo or a well-meaning board member proposes
          %-on-contract,{" "}
          <span className="text-primary font-semibold not-italic">
            point them at this slide first.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Budget() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              II · Budget — three contract sizes
            </div>
            <h2
              className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              The team fits.
              <span className="italic font-normal text-accent"> Take-home and reinvestment do too.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
              Reading the table
            </div>
            <div className="font-body text-[1.1vw] text-text leading-[1.4]">
              Each row reconciles to the contract size on the left:
              <span className="font-mono"> team + take-home + reinvest = total</span>.
              No hand-wavy math.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[2vw] mb-[2vh]"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1vh]">
            Team baseline · all five roles loaded
          </div>
          <div className="grid grid-cols-6 gap-[1vw] font-body text-[1.05vw] text-text">
            <div className="flex flex-col"><div className="text-muted text-[0.9vw] uppercase tracking-[0.18em]">Ops Mgr</div><div className="font-display text-[1.6vw] text-primary font-medium">$7,000</div></div>
            <div className="flex flex-col"><div className="text-muted text-[0.9vw] uppercase tracking-[0.18em]">Bookkeeper</div><div className="font-display text-[1.6vw] text-primary font-medium">$1,700</div></div>
            <div className="flex flex-col"><div className="text-muted text-[0.9vw] uppercase tracking-[0.18em]">Cleaner</div><div className="font-display text-[1.6vw] text-primary font-medium">$500</div></div>
            <div className="flex flex-col"><div className="text-muted text-[0.9vw] uppercase tracking-[0.18em]">Tutor</div><div className="font-display text-[1.6vw] text-primary font-medium">$900</div></div>
            <div className="flex flex-col"><div className="text-muted text-[0.9vw] uppercase tracking-[0.18em]">Handyman</div><div className="font-display text-[1.6vw] text-primary font-medium">$700</div></div>
            <div className="flex flex-col border-l pl-[1vw]" style={{ borderColor: "var(--slide-rule)" }}>
              <div className="text-accent text-[0.9vw] uppercase tracking-[0.18em] font-semibold">Sub-total</div>
              <div className="font-display text-[1.8vw] text-primary font-semibold">$10,800</div>
            </div>
          </div>
          <div className="mt-[1vh] font-body text-[0.95vw] text-muted leading-[1.35]">
            Rounded up to <span className="font-semibold text-primary">$11,000</span> in the scenarios below to absorb statutory costs and small variances.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
              Scenario A
            </div>
            <div className="font-display text-[3vw] text-primary font-semibold leading-none mb-[1.5vh]">
              $20,000
            </div>
            <div className="space-y-[1vh] font-body text-[1.1vw] text-text flex-1">
              <div className="flex justify-between"><span>Team</span><span className="font-semibold">$11,000</span></div>
              <div className="flex justify-between"><span>Take-home</span><span className="font-semibold">$7,000</span></div>
              <div className="flex justify-between"><span>Agency reinvest</span><span className="font-semibold">$2,000</span></div>
            </div>
            <div
              className="mt-[1vh] pt-[1vh] border-t font-mono text-[0.95vw] text-muted"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              The honest floor. Works, but no slack.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col relative"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="absolute top-[-1.2vh] right-[1vw] font-mono uppercase tracking-[0.22em] text-[0.85vw] px-[0.7vw] py-[0.3vh] rounded-[0.2vw]"
              style={{ background: "var(--slide-accent)", color: "var(--slide-bg)" }}
            >
              Recommended ask
            </div>
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.95vw] mb-[0.5vh]"
              style={{ color: "#e9c8a8" }}
            >
              Scenario B
            </div>
            <div
              className="font-display text-[3vw] font-semibold leading-none mb-[1.5vh]"
              style={{ color: "#e9c8a8" }}
            >
              $25,000
            </div>
            <div className="space-y-[1vh] font-body text-[1.1vw] flex-1 opacity-95">
              <div className="flex justify-between"><span>Team</span><span className="font-semibold">$11,000</span></div>
              <div className="flex justify-between"><span>Take-home</span><span className="font-semibold">$9,000</span></div>
              <div className="flex justify-between"><span>Agency reinvest</span><span className="font-semibold">$5,000</span></div>
            </div>
            <div
              className="mt-[1vh] pt-[1vh] border-t font-mono text-[0.95vw] opacity-80"
              style={{ borderColor: "rgba(244,237,224,0.3)" }}
            >
              Sustainable. Builds the next contract from the inside.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
              Scenario C
            </div>
            <div className="font-display text-[3vw] text-primary font-semibold leading-none mb-[1.5vh]">
              $30,000
            </div>
            <div className="space-y-[1vh] font-body text-[1.1vw] text-text flex-1">
              <div className="flex justify-between"><span>Team</span><span className="font-semibold">$11,000</span></div>
              <div className="flex justify-between"><span>Take-home</span><span className="font-semibold">$11,000</span></div>
              <div className="flex justify-between"><span>Agency reinvest</span><span className="font-semibold">$8,000</span></div>
            </div>
            <div
              className="mt-[1vh] pt-[1vh] border-t font-mono text-[0.95vw] text-muted"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Funds a second hire and the next pitch.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

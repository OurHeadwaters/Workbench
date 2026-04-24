export default function GreatWeek() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(184,90,62,0.08) 0%, transparent 55%)",
        }}
      />
      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] grid grid-cols-12 gap-[3vw]">
        <div className="col-span-5 flex flex-col justify-between">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              I · 04 — A great week looks like
            </div>
            <h2
              className="font-display text-[3.6vw] leading-[1.02] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              I want to know it
              <span className="italic font-normal text-accent"> when I'm in it.</span>
            </h2>
          </div>
          <div
            className="font-body text-[1.2vw] leading-[1.45] text-muted border-l pl-[1.4vw]"
            style={{ borderColor: "var(--slide-accent)" }}
          >
            The best test of the whole structure isn't a quarterly report. It's
            whether, on a Friday afternoon in February, I can honestly say the
            week was good.
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Reading my own words back to me.
          </div>
        </div>

        <div className="col-span-7 flex flex-col justify-center">
          <div
            className="font-display italic text-[2.2vw] leading-[1.35] text-text mb-[2.5vh]"
            style={{ textWrap: "pretty" }}
          >
            "The boys had me in the morning. I wasn't checking the phone while
            they ate. The 11 o'clock told me there was nothing on fire I had to
            touch. I did real work between school drop-off and dinner, the
            actual work I was hired for — not triage. Dinner was already done.
            I read for an hour after the kids went down. Saturday I didn't open
            the laptop."
          </div>

          <div
            className="grid grid-cols-3 gap-[1.4vw] mt-[2vh] pt-[2.5vh] border-t"
            style={{ borderColor: "var(--slide-rule)" }}
          >
            <div>
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent mb-[0.5vh]">
                Test 1
              </div>
              <div className="font-display text-[1.4vw] text-primary font-medium leading-tight">
                Was I present at 8am?
              </div>
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent mb-[0.5vh]">
                Test 2
              </div>
              <div className="font-display text-[1.4vw] text-primary font-medium leading-tight">
                Did I do the actual work — not triage?
              </div>
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent mb-[0.5vh]">
                Test 3
              </div>
              <div className="font-display text-[1.4vw] text-primary font-medium leading-tight">
                Was I done at the end?
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

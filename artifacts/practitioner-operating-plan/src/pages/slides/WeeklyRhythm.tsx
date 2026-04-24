export default function WeeklyRhythm() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              I · 03 — Weekly rhythm
            </div>
            <h2 className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium">
              Two check-ins a day.
              <span className="italic font-normal text-accent"> One optional weekend block.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[30vw] font-body text-[1.15vw] text-muted leading-[1.4]">
            The 11am / 4pm cadence is borrowed from the 807 coordinator
            structure — but with a real on-site manager in Dryden, not me
            holding the radio.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[1.4vw] min-h-0">
          <div
            className="col-span-7 rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.24em] text-[1.05vw] text-accent font-semibold mb-[1.5vh]">
              The two daily check-ins
            </div>

            <div className="grid grid-cols-2 gap-[1.4vw] flex-1">
              <div className="flex flex-col">
                <div className="font-display text-[2.4vw] leading-tight text-primary font-medium mb-[0.5vh]">
                  11:00
                </div>
                <div className="font-mono uppercase tracking-[0.18em] text-[0.95vw] text-accent mb-[1.2vh]">
                  Morning hand-off
                </div>
                <div className="font-body text-[1.1vw] text-text leading-[1.45]">
                  Ops manager calls. 12 minutes. What broke overnight, what's
                  going out today, what needs a decision from me before 4. I
                  decide; they execute.
                </div>
              </div>

              <div className="flex flex-col">
                <div className="font-display text-[2.4vw] leading-tight text-primary font-medium mb-[0.5vh]">
                  16:00
                </div>
                <div className="font-mono uppercase tracking-[0.18em] text-[0.95vw] text-accent mb-[1.2vh]">
                  Close of day
                </div>
                <div className="font-body text-[1.1vw] text-text leading-[1.45]">
                  Same call, reversed. What landed, what didn't, what tomorrow
                  has to start with. Phone goes down at 4:15 — they hold the
                  evening, not me.
                </div>
              </div>
            </div>

            <div
              className="mt-[2vh] pt-[1.5vh] border-t font-body text-[1.05vw] text-muted leading-[1.4]"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Anything outside those windows is either real emergency or it
              waits. The team knows the difference.
            </div>
          </div>

          <div className="col-span-5 flex flex-col gap-[1.4vw]">
            <div
              className="rounded-[0.4vw] p-[1.6vw] flex-1 flex flex-col"
              style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.95vw] mb-[1vh]"
                style={{ color: "#e9c8a8" }}
              >
                Mon → Fri
              </div>
              <div className="font-display text-[1.7vw] leading-tight font-medium mb-[1vh]">
                The work week.
              </div>
              <div className="font-body text-[1.05vw] leading-[1.45] opacity-90">
                Mornings with the boys, work block, two check-ins, dinner ready,
                evenings off. Five reps. Boring on purpose.
              </div>
            </div>

            <div
              className="rounded-[0.4vw] p-[1.6vw] flex-1 flex flex-col"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent mb-[1vh]">
                Sat / Sun
              </div>
              <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
                Mostly off — by default.
              </div>
              <div className="font-body text-[1.05vw] text-text leading-[1.45]">
                One <span className="text-primary font-semibold">optional</span>{" "}
                4–8 hour deep-work block. Earned, not scheduled. Most weeks I
                won't take it, and that's the point.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

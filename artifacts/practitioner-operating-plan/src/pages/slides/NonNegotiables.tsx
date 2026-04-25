export default function NonNegotiables() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              III · 01 — The non-negotiables
            </div>
            <h2 className="font-display text-[4.2vw] leading-[1] tracking-tight text-primary font-medium">
              Five things I do not move.
              <span className="italic font-normal text-accent"> Everything else flexes.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[30vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              The bar
            </div>
            <div className="font-body text-[1.2vw] text-primary leading-[1.4]">
              If a week breaks more than one of these, the structure has failed,
              not me.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-5 gap-[1.2vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.5vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">
              01 · MORNINGS
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1.2vh]">
              Phone-free until 10am.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              No screens, no inbox. The day starts in the kitchen, not in the
              cloud.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.5vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">
              02 · 7–10am
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1.2vh]">
              The kids own me.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              Schoolwork, daily living, late breakfast. Three real hours, not
              fragments stolen between meetings.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.5vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">
              03 · WORK BLOCK
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1.2vh]">
              10:30 to 4 / 6.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              Nose-down. The window flexes by season but starts on time and
              ends when it ends — no creep.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.5vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">
              04 · DINNER
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1.2vh]">
              Already prepared.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              Decided in the morning, prepped before close-of-day. The 5 o'clock
              hour is for the boys, not for the fridge.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.5vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">
              05 · WEEKENDS
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1.2vh]">
              Mostly off.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              One <span className="text-primary font-semibold">optional</span>{" "}
              4–8 hour deep-work block, taken when the week needs it. Default
              is no.
            </div>
          </div>
        </div>

        <div
          className="mt-[3vh] rounded-[0.4vw] px-[2vw] py-[1.5vh] font-body text-[1.2vw] leading-[1.4] text-bg"
          style={{ background: "var(--slide-primary)" }}
        >
          <span className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-80 mr-[1vw]">
            Rule
          </span>
          The team exists so these stay true on a bad week, not just a good one.
        </div>
      </div>
    </div>
  );
}

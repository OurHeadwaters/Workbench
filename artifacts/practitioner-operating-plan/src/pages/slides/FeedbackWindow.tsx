export default function FeedbackWindow() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute -left-[10vw] -top-[8vh] w-[42vw] h-[42vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.18)" }}
      />
      <div
        className="absolute right-[-6vw] bottom-[-8vh] w-[32vw] h-[32vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.05)" }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[6vh] flex flex-col justify-between">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-85">
              IV · 05 — The next two weeks
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-65">
            Mon Apr 27 → ~Sun May 10 / Mon May 11, 2026
          </div>
        </div>

        <div className="max-w-[82vw]">
          <h1
            className="font-display text-[4.6vw] leading-[1.02] tracking-tight font-medium mb-[2.2vh]"
            style={{ textWrap: "balance" }}
          >
            Two weeks to read it.
            <span className="block italic font-normal" style={{ color: "#e9c8a8" }}>
              Then we name the deal.
            </span>
          </h1>
          <div
            className="font-body text-[1.35vw] leading-[1.5] opacity-90 max-w-[68vw] border-l pl-[1.4vw]"
            style={{ borderColor: "#e9c8a8" }}
          >
            The deck travels with you up to Deer Lake. Read it on the road,
            push back on anything that's wrong or soft, and only then sign —
            in the form on the previous slide, or in whatever shape these two
            weeks reshape it into.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[1.4vw]">
          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "rgba(244,237,224,0.08)" }}
          >
            <div className="flex items-baseline gap-[0.8vw] mb-[1vh]">
              <div
                className="font-mono font-semibold text-[1.1vw]"
                style={{ color: "#e9c8a8" }}
              >
                01
              </div>
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] opacity-80">
                Week 1 · Apr 27 → May 3
              </div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight font-medium mb-[1vh]">
              Read &amp; react on the road.
            </div>
            <div className="font-body text-[1.05vw] leading-[1.5] opacity-90">
              Read the deck on the trip. Mark anything that's wrong, soft, or
              missing. No reply needed yet — let it sit.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "rgba(244,237,224,0.08)" }}
          >
            <div className="flex items-baseline gap-[0.8vw] mb-[1vh]">
              <div
                className="font-mono font-semibold text-[1.1vw]"
                style={{ color: "#e9c8a8" }}
              >
                02
              </div>
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] opacity-80">
                Week 2 · May 4 → May 10
              </div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight font-medium mb-[1vh]">
              Talk it through.
            </div>
            <div className="font-body text-[1.05vw] leading-[1.5] opacity-90">
              One unhurried conversation — phone, or in person on the way back.
              Walk the edits, the rate, the bridge, and the team line by line.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "#e9c8a8", color: "var(--slide-primary)" }}
          >
            <div className="flex items-baseline gap-[0.8vw] mb-[1vh]">
              <div className="font-mono font-semibold text-[1.1vw]">03</div>
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] opacity-80">
                Closing day · ~Sun May 10 / Mon May 11
              </div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight font-medium mb-[1vh]">
              Name the deal at the kitchen table.
            </div>
            <div className="font-body text-[1.05vw] leading-[1.5] opacity-90">
              When you're back home from Deer Lake, the deal gets named — in
              the form on the previous slide, or whatever shape the two weeks
              reshape it into.
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-[2vw]">
          <div className="max-w-[58vw]">
            <div
              className="h-[1px] mb-[1.6vh] w-[16vw]"
              style={{ background: "rgba(244,237,224,0.45)" }}
            />
            <div
              className="font-display italic text-[1.5vw] leading-[1.35] opacity-95"
              style={{ textWrap: "balance" }}
            >
              I'm not grinding for the next two weeks — I'm slow-improving the
              plan and the tools. Guided execution work (postings, reference
              scripts, the onboarding pack, the rest) only starts the day we
              name the deal.
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono uppercase tracking-[0.25em] text-[0.95vw] opacity-70 mb-[0.6vh]">
              No pressure. No clock.
            </div>
            <div
              className="font-display text-[1.4vw] leading-tight"
              style={{ color: "#e9c8a8" }}
            >
              You set the pace.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

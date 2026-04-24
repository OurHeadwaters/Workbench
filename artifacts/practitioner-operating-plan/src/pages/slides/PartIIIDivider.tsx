export default function PartIIIDivider() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute right-[-10vw] top-[-10vh] w-[44vw] h-[44vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.04)" }}
      />
      <div
        className="absolute left-[10vw] bottom-[6vh] w-[16vw] h-[16vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.18)" }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-80">
              Part III · Hiring runbook
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-60">
            One page per role · Source · Screen · Trial · Walk away
          </div>
        </div>

        <div className="max-w-[80vw]">
          <div
            className="font-display italic font-light text-[14vw] leading-[0.85] mb-[2vh]"
            style={{ color: "#e9c8a8" }}
          >
            III.
          </div>
          <h1
            className="font-display text-[6vw] leading-[1] tracking-tight font-medium"
            style={{ textWrap: "balance" }}
          >
            How to actually
            <span className="italic font-normal opacity-90"> find each of them.</span>
          </h1>
          <div className="mt-[3vh] font-body text-[1.7vw] leading-[1.4] opacity-85 max-w-[60vw]">
            The budget is theoretical until five real people are doing the work.
            For each role: where to look in and around Dryden, what to ask, what
            a paid trial looks like, what to walk away from.
          </div>
        </div>

        <div
          className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-65 self-end"
        >
          Ops Manager → Bookkeeper → Housecleaner → Tutor → Handyman
        </div>
      </div>
    </div>
  );
}

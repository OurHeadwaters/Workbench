export default function PhasePitchOpener() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute right-[-10vw] top-[-8vh] w-[50vw] h-[50vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.2)" }}
      />
      <div
        className="absolute left-[5vw] bottom-[6vh] w-[14vw] h-[14vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.05)" }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-80">
              Phase 02 · Pitch
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-60">
            Idea → Pitch → Contract → Fulfillment → Impact
          </div>
        </div>

        <div className="max-w-[80vw]">
          <div
            className="font-mono uppercase tracking-[0.28em] text-[1vw] opacity-70 mb-[1.5vh]"
            style={{ color: "#e9c8a8" }}
          >
            Where you are
          </div>
          <h1
            className="font-display text-[7vw] leading-[1] tracking-tight font-medium"
            style={{ textWrap: "balance" }}
          >
            Make the case.
            <span className="block italic font-normal opacity-90">
              Hand the deck over.
            </span>
          </h1>
          <div className="mt-[3vh] font-body text-[1.7vw] leading-[1.4] opacity-85 max-w-[62vw]">
            Argue the rate and the team in plain language, then put the deck in
            the contractor's hands and stop selling.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[3vw] items-end">
          <div>
            <div
              className="font-mono uppercase tracking-[0.28em] text-[0.95vw] opacity-65 mb-[0.6vh]"
              style={{ color: "#e9c8a8" }}
            >
              What's next from here
            </div>
            <div className="font-body text-[1.3vw] leading-[1.4] opacity-90">
              For Dad divider · Case for the rate · Case for the team · Naming
              the deal
            </div>
          </div>
          <div className="text-right font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-65">
            Then → Contract
          </div>
        </div>
      </div>
    </div>
  );
}

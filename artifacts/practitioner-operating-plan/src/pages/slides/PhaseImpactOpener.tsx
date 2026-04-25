export default function PhaseImpactOpener() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute right-[-8vw] top-[-6vh] w-[45vw] h-[45vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.18)" }}
      />
      <div
        className="absolute left-[5vw] bottom-[6vh] w-[16vw] h-[16vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.06)" }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-80">
              Phase 05 · Impact
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
            Prove it.
            <span className="block italic font-normal opacity-90">
              Then template it.
            </span>
          </h1>
          <div className="mt-[3vh] font-body text-[1.7vw] leading-[1.4] opacity-85 max-w-[62vw]">
            Deer Lake earns it first. Every reserve that needs this next
            inherits the playbook the practitioner builds while doing it.
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
              Part V divider · Why Deer Lake · The six-module template · The
              path to scale
            </div>
          </div>
          <div className="text-right font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-65">
            Loop → Idea (next deal)
          </div>
        </div>
      </div>
    </div>
  );
}

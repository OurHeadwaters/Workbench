export default function PartPeopleDivider() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute right-[-12vw] top-[-8vh] w-[46vw] h-[46vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.04)" }}
      />
      <div
        className="absolute left-[8vw] bottom-[8vh] w-[18vw] h-[18vw] rounded-full"
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
              Part V · People &amp; Retention
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-60">
            How I keep a 10-year crew in a cost-of-living crisis
          </div>
        </div>

        <div className="max-w-[80vw]">
          <div
            className="font-display italic font-light text-[14vw] leading-[0.85] mb-[2vh]"
            style={{ color: "#e9c8a8" }}
          >
            V·c
          </div>
          <h1
            className="font-display text-[5.6vw] leading-[1] tracking-tight font-medium"
            style={{ textWrap: "balance" }}
          >
            Capable people follow whichever bone you give them.
            <span className="block italic font-normal opacity-90">
              So I'm careful which one I throw.
            </span>
          </h1>
          <div className="mt-[3vh] font-body text-[1.6vw] leading-[1.4] opacity-85 max-w-[68vw]">
            In a cost-of-living crisis, wage bumps don't keep good crews —{" "}
            <span className="not-italic font-semibold" style={{ color: "#e9c8a8" }}>
              direct attack on the cost of living does.
            </span>{" "}
            Below is the comp design that makes the 10-year stay the obvious
            choice — and the upside layer that deliberately doesn't behave
            like a sales commission.
          </div>
        </div>

        <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-65 self-end">
          Principles → 7-bucket waterfall → Upside layer → Trap to avoid → Sizing → Three commitments
        </div>
      </div>
    </div>
  );
}

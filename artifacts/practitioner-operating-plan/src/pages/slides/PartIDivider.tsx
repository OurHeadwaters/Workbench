export default function PartIDivider() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute -right-[10vw] -bottom-[10vw] w-[55vw] h-[55vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.04)" }}
      />
      <div
        className="absolute right-[6vw] top-[6vh] w-[14vw] h-[14vw] rounded-full"
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
              Part I · Private voice
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-60">
            For the practitioner only
          </div>
        </div>

        <div className="max-w-[80vw]">
          <div
            className="font-display italic font-light text-[14vw] leading-[0.85] mb-[2vh]"
            style={{ color: "#e9c8a8" }}
          >
            I.
          </div>
          <h1
            className="font-display text-[6vw] leading-[1] tracking-tight font-medium"
            style={{ textWrap: "balance" }}
          >
            The life I'm
            <span className="italic font-normal opacity-90"> building.</span>
          </h1>
          <div className="mt-[3vh] font-body text-[1.7vw] leading-[1.4] opacity-85 max-w-[60vw]">
            What a yes has to look like, day by day, to still be a yes after
            month nine.
          </div>
        </div>

        <div
          className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-65 self-end"
        >
          Non-negotiables → Daily rhythm → Weekly rhythm → A great week
        </div>
      </div>
    </div>
  );
}

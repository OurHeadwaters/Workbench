export default function PartIVDivider() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute right-[-12vw] top-[-8vh] w-[50vw] h-[50vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.18)" }}
      />
      <div
        className="absolute left-[8vw] bottom-[8vh] w-[14vw] h-[14vw] rounded-full"
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
              Part IV · Contractor voice
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-60">
            For Dad — and for anyone deploying capital
          </div>
        </div>

        <div className="max-w-[80vw]">
          <div
            className="font-display italic font-light text-[14vw] leading-[0.85] mb-[2vh]"
            style={{ color: "#e9c8a8" }}
          >
            IV.
          </div>
          <h1
            className="font-display text-[6vw] leading-[1] tracking-tight font-medium"
            style={{ textWrap: "balance" }}
          >
            Why this rate
            <span className="italic font-normal opacity-90"> is the right rate.</span>
          </h1>
          <div className="mt-[3vh] font-body text-[1.7vw] leading-[1.4] opacity-85 max-w-[60vw]">
            "Don't short-change yourself." This is what not short-changing looks
            like — costed, structured, and accountable.
          </div>
        </div>

        <div
          className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-65 self-end"
        >
          The rate → The team → The value → The deal
        </div>
      </div>
    </div>
  );
}

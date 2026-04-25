export default function PartVIDivider() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute right-[-8vw] top-[-12vh] w-[46vw] h-[46vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.05)" }}
      />
      <div
        className="absolute left-[6vw] bottom-[6vh] w-[18vw] h-[18vw] rounded-full"
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
              Part VI · Operating voice
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-60">
            For me, the team, and Dad — same answer
          </div>
        </div>

        <div className="max-w-[80vw]">
          <div
            className="font-display italic font-light text-[14vw] leading-[0.85] mb-[2vh]"
            style={{ color: "#e9c8a8" }}
          >
            VI.
          </div>
          <h1
            className="font-display text-[5.6vw] leading-[1] tracking-tight font-medium"
            style={{ textWrap: "balance" }}
          >
            What stays, what changes,
            <span className="block italic font-normal opacity-90">
              where my hands go.
            </span>
          </h1>
          <div className="mt-[3vh] font-body text-[1.6vw] leading-[1.4] opacity-85 max-w-[68vw]">
            Headwaters is the parent now. The salt line and the studio
            existed before that yes. This is the honest answer to whether they
            still belong —{" "}
            <span className="not-italic font-semibold" style={{ color: "#e9c8a8" }}>
              and, if so, in what shape.
            </span>
          </div>
        </div>

        <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-65 self-end">
          Salt under Headwaters → Design under Headwaters → Two hard rules
        </div>
      </div>
    </div>
  );
}

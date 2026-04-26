export default function Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "var(--slide-primary)" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(244,237,224,0.08) 0%, rgba(31,61,46,0) 55%), linear-gradient(170deg, rgba(31,61,46,0) 0%, rgba(10,28,20,0.55) 100%)",
        }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between text-bg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.28em] text-[1.05vw] opacity-85">
              Mission anchor · 05
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-70">
            Closing · April 2026
          </div>
        </div>

        <div className="max-w-[78vw]">
          <div className="font-mono uppercase tracking-[0.32em] text-[1vw] opacity-75 mb-[2.5vh]">
            What this work is for
          </div>
          <div className="font-display text-[3.2vw] leading-[1.15] mb-[6vh]" style={{ textWrap: "balance" }}>
            Total and complete <span className="italic" style={{ color: "#e9c8a8" }}>operational flexibility</span> for each and every reserve in Canada — with a lens into how it works.
          </div>

          <div
            className="h-[1px] mb-[4vh] w-[24vw]"
            style={{ background: "rgba(244,237,224,0.45)" }}
          />

          <h1
            className="font-display font-medium text-[6.8vw] leading-[0.98] tracking-tight"
            style={{ textWrap: "balance" }}
          >
            We always knew how to fix it.
            <span className="block italic font-normal mt-[1vh]" style={{ color: "#e9c8a8" }}>
              Now we can.
            </span>
          </h1>
        </div>

        <div className="flex items-end justify-between">
          <div className="max-w-[44vw]">
            <div className="font-body text-[1.25vw] leading-[1.5] opacity-85">
              Value is not in material goods. Value is in the resources the earth provides. The system has to honour that — not optimize around it.
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] opacity-75 mb-[1vh]">
              Founder
            </div>
            <div className="font-display italic text-[1.6vw] opacity-95">
              April 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

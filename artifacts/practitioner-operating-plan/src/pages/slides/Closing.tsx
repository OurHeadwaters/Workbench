export default function Closing() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute -right-[10vw] -top-[10vh] w-[45vw] h-[45vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.18)" }}
      />
      <div
        className="absolute -left-[6vw] bottom-[-8vh] w-[35vw] h-[35vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.05)" }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-85">
              IV · 04 — Naming the deal
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-65">
            In the language we agreed on
          </div>
        </div>

        <div className="max-w-[80vw]">
          <h1
            className="font-display text-[5.6vw] leading-[1.02] tracking-tight font-medium mb-[3vh]"
            style={{ textWrap: "balance" }}
          >
            No free lunches.
            <span className="block italic font-normal" style={{ color: "#e9c8a8" }}>
              Capital deployed properly.
            </span>
            <span className="block">Value out the other end.</span>
          </h1>

          <div
            className="font-body text-[1.55vw] leading-[1.55] opacity-95 max-w-[68vw] border-l pl-[1.6vw]"
            style={{ borderColor: "#e9c8a8" }}
          >
            $25,000 a month, twelve-month engagement, reviewed at month six.
            Funds the team that delivers the work, keeps me in the field long
            enough to actually do the job, and seeds the agency the next
            contract will live inside.
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="max-w-[58vw]">
            <div
              className="h-[1px] mb-[2vh] w-[18vw]"
              style={{ background: "rgba(244,237,224,0.45)" }}
            />
            <div
              className="font-display italic text-[1.85vw] leading-[1.35] opacity-95"
              style={{ textWrap: "balance" }}
            >
              "Don't short-change yourself." This is what not short-changing
              looks like — costed, structured, and accountable.
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] opacity-70 mb-[0.8vh]">
              For the contractor
            </div>
            <div className="font-display text-[1.9vw] leading-tight">
              Practitioner Operating Plan
              <div className="font-body font-light text-[1.05vw] opacity-80 mt-[0.4vh]">
                v1 · Spring 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

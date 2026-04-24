const base = import.meta.env.BASE_URL;

export default function Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <img
        src={`${base}hero-morning-desk.png`}
        crossOrigin="anonymous"
        alt="Early morning desk with coffee and journal, winter dawn through the window"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(95deg, rgba(31,61,46,0.93) 0%, rgba(31,61,46,0.82) 38%, rgba(31,61,46,0.45) 68%, rgba(31,61,46,0.10) 100%)",
        }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between text-bg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "var(--slide-accent)" }}
            />
            <div className="font-mono uppercase tracking-[0.25em] text-[1.1vw] opacity-90">
              Practitioner Operating Plan
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-80">
            Working draft · Spring 2026
          </div>
        </div>

        <div className="max-w-[78vw]">
          <div className="font-mono uppercase tracking-[0.3em] text-[1.2vw] opacity-80 mb-[2vh]">
            Two voices · one deck — the practitioner, then the contractor
          </div>
          <h1
            className="font-display font-medium text-[7vw] leading-[0.96] tracking-tight"
            style={{ textWrap: "balance" }}
          >
            Saying yes
            <span className="block italic font-normal" style={{ color: "#e9c8a8" }}>
              without breaking what matters.
            </span>
          </h1>
          <div className="mt-[3vh] font-display italic text-[2.2vw] opacity-95">
            The team, the budget, and the days that hold this contract together.
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="max-w-[44vw]">
            <div
              className="h-[1px] mb-[2vh] w-[18vw]"
              style={{ background: "rgba(244,237,224,0.5)" }}
            />
            <div className="font-body text-[1.4vw] leading-[1.5] opacity-95">
              The contract only works if the days with the kids stay sacred and
              the work doesn't sit on one phone, one inbox, one tired person.
              This is what that costs — and what it builds.
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.25em] text-[1.1vw] opacity-75 mb-[1vh]">
              Audience
            </div>
            <div className="font-display text-[1.7vw] leading-tight">
              Me. My team. My dad.
              <div className="font-body font-light text-[1.05vw] opacity-80 mt-[0.4vh]">
                In that order.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

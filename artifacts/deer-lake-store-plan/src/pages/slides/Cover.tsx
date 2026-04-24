const base = import.meta.env.BASE_URL;

export default function Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <img
        src={`${base}hero-boreal.png`}
        crossOrigin="anonymous"
        alt="Northern Ontario boreal landscape"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(31,61,46,0.92) 0%, rgba(31,61,46,0.78) 42%, rgba(31,61,46,0.35) 70%, rgba(31,61,46,0.10) 100%)",
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
              807 Food Co-operative Inc.
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-80">
            Operating Partner Proposal · Spring 2026
          </div>
        </div>

        <div className="max-w-[78vw]">
          <div className="font-mono uppercase tracking-[0.3em] text-[1.2vw] opacity-80 mb-[2vh]">
            Deer Lake First Nation, Treaty 5 · Northwestern Ontario
          </div>
          <h1
            className="font-display font-medium text-[7.4vw] leading-[0.95] tracking-tight"
            style={{ textWrap: "balance" }}
          >
            Deer Lake Community
            <span className="block italic font-normal" style={{ color: "#e9c8a8" }}>
              General Store
            </span>
          </h1>
          <div className="mt-[3vh] font-display italic text-[2.4vw] opacity-95">
            Operational plan for the contractor + band council
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="max-w-[42vw]">
            <div
              className="h-[1px] mb-[2vh] w-[18vw]"
              style={{ background: "rgba(244,237,224,0.5)" }}
            />
            <div className="font-body text-[1.45vw] leading-[1.5] opacity-95">
              Less leakage. More local capacity. A store the community
              recognises as theirs from day one.
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.25em] text-[1.1vw] opacity-75 mb-[1vh]">
              Prepared for
            </div>
            <div className="font-display text-[1.8vw] leading-tight">
              The Operating Partner
              <div className="font-body font-light text-[1.1vw] opacity-80 mt-[0.4vh]">
                Deer Lake, Ontario
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BASE = import.meta.env.BASE_URL;

export default function Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <img
        src={`${BASE}hero-morning-desk.png`}
        crossOrigin="anonymous"
        alt="Early morning desk with coffee and journal"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(95deg, rgba(31,61,46,0.96) 0%, rgba(31,61,46,0.88) 42%, rgba(31,61,46,0.55) 72%, rgba(31,61,46,0.18) 100%)" }}
      />
      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between text-paper">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div className="w-[1.4vw] h-[1.4vw] rounded-full" style={{ background: "var(--slide-accent)" }} />
            <div className="font-mono uppercase tracking-[0.25em] text-[1.1vw] opacity-90">
              Practitioner Operating Plan · V3
            </div>
          </div>
        </div>
        <div>
          <div className="font-display font-medium text-[6.5vw] leading-[0.93] tracking-tight mb-[3vh]" style={{ textWrap: "balance" }}>
            The operating plan<br />
            <span className="italic" style={{ color: "#e9c8a8" }}>that makes the yes sustainable.</span>
          </div>
          <div className="font-body text-[1.35vw] leading-[1.5] opacity-95 max-w-[44vw]">
            Six locked numbers. One Year-1 cash gap, surfaced honestly.
            The thesis, the lean roster, the three revenue layers, and the mission this work is for.
          </div>
        </div>
      </div>
    </div>
  );
}

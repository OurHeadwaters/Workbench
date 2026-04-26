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
            "linear-gradient(95deg, rgba(31,61,46,0.96) 0%, rgba(31,61,46,0.88) 42%, rgba(31,61,46,0.55) 72%, rgba(31,61,46,0.18) 100%)",
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
              Practitioner Operating Plan · Foundation V3
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-80">
            April 2026 · Six numbers locked
          </div>
        </div>

        <div className="max-w-[80vw]">
          <div className="font-mono uppercase tracking-[0.3em] text-[1.2vw] opacity-80 mb-[2vh]">
            Headwaters is a product company
          </div>
          <h1
            className="font-display font-medium text-[6.6vw] leading-[0.96] tracking-tight"
            style={{ textWrap: "balance" }}
          >
            Headwaters builds.
            <span className="block italic font-normal" style={{ color: "#e9c8a8" }}>
              The band runs.
            </span>
          </h1>
          <div className="mt-[3vh] font-display italic text-[2.1vw] opacity-95 max-w-[60vw]">
            A product company for Northern Indigenous food systems. Software, tech stack, training — tested in the conditions they ship into, owned by the bands that adopt them.
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="max-w-[44vw]">
            <div
              className="h-[1px] mb-[2vh] w-[18vw]"
              style={{ background: "rgba(244,237,224,0.5)" }}
            />
            <div className="font-body text-[1.35vw] leading-[1.5] opacity-95">
              Six locked numbers. One Year-1 cash gap, surfaced honestly. The thesis, the lean roster, the three revenue layers, and the mission this work is for.
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] opacity-75 mb-[1vh]">
              Closing line
            </div>
            <div className="font-display italic text-[1.9vw] leading-tight" style={{ color: "#e9c8a8" }}>
              "We always knew how to fix it.
              <div className="mt-[0.4vh]">Now we can."</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  ETHOS_HEADLINE,
  ETHOS_BODY,
  ETHOS_INSTRUMENTS,
} from "@/data/ethosContent";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function EthosSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg flex flex-col">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col">

        {/* ── Eyebrow ── */}
        <div className="flex items-center gap-[1vw] mb-[3vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            What Headwaters is
          </div>
        </div>

        {/* ── Headline ── */}
        <h1
          className="font-display font-medium leading-[0.95] tracking-tight text-paper mb-[2.5vh]"
          style={{ fontSize: "5.8vw", textWrap: "balance" } as React.CSSProperties}
        >
          {ETHOS_HEADLINE}
        </h1>

        {/* ── Two-column body ── */}
        <div className="grid grid-cols-2 gap-[3vw] flex-1 min-h-0">

          {/* Left col — voice paragraphs */}
          <div className="flex flex-col justify-start gap-[1.8vh] pr-[1vw]">
            {ETHOS_BODY.map((p, i) => (
              <p
                key={i}
                className="font-body leading-[1.55] text-paper"
                style={{
                  fontSize: "1.15vw",
                  opacity: i === 0 ? 1 : 0.82,
                  fontStyle: i === 0 ? "normal" : "normal",
                }}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Right col — instruments list */}
          <div className="flex flex-col">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.9vw] text-muted mb-[1.5vh]">
              The instruments
            </div>
            <div className="flex flex-col gap-[1.2vh]">
              {ETHOS_INSTRUMENTS.map((inst) => (
                <div
                  key={inst.name}
                  className="border-l-[3px] border-primary pl-[1.2vw]"
                >
                  <div className="font-body font-semibold text-paper" style={{ fontSize: "1.05vw" }}>
                    {inst.name}
                  </div>
                  <div className="font-body text-muted leading-[1.4]" style={{ fontSize: "0.9vw" }}>
                    {inst.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div
          className="mt-[2vh] pt-[1.5vh] flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(244,237,224,0.12)" }}
        >
          <div className="font-body text-muted" style={{ fontSize: "0.85vw" }}>
            Headwaters Development Services · Treaty 3 Territory
          </div>
          <div className="font-mono text-muted" style={{ fontSize: "0.82vw" }}>
            read or share at{" "}
            <span className="text-paper opacity-70">{BASE}/ethos</span>
          </div>
        </div>

      </div>
    </div>
  );
}

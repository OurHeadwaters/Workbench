const BASE = import.meta.env.BASE_URL;

export default function Prologue() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "var(--slide-primary)" }}>
      <img
        src={`${BASE}eagle-prologue.png`}
        crossOrigin="anonymous"
        alt="A bald eagle soaring against a pale boreal sky"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 35%" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(31,61,46,0.10) 0%, rgba(31,61,46,0.05) 38%, rgba(31,61,46,0.55) 62%, rgba(31,61,46,0.95) 100%)" }}
      />
      <div className="relative z-10 w-full h-full px-[7vw] py-[6vh] flex flex-col justify-between text-paper">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div className="w-[1.4vw] h-[1.4vw] rounded-full" style={{ background: "#e9c8a8" }} />
            <div className="font-mono uppercase tracking-[0.28em] text-[1.05vw] opacity-90">
              Prologue — The eagle answered
            </div>
          </div>
        </div>
        <div>
          <div className="font-display font-medium text-[6vw] leading-[0.95] tracking-tight mb-[3vh]" style={{ textWrap: "balance" }}>
            We've always known<br />
            <span className="italic" style={{ color: "#e9c8a8" }}>how to fix it.</span>
          </div>
          <div className="font-body text-[1.4vw] leading-[1.55] opacity-85 max-w-[55vw]">
            The eagle doesn't ask permission to fly. It lifts because that's what it does.
            This plan is built the same way — not waiting for the system to agree,
            starting with what the community already knows.
          </div>
        </div>
      </div>
    </div>
  );
}

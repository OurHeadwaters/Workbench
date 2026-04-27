const base = import.meta.env.BASE_URL;

export default function Prologue() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)" }}
    >
      <img
        src={`${base}eagle-prologue.png`}
        crossOrigin="anonymous"
        alt="A bald eagle soaring against a pale boreal sky, a quiet circular flight arc traced behind it"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 35%" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(31,61,46,0.10) 0%, rgba(31,61,46,0.05) 38%, rgba(31,61,46,0.55) 62%, rgba(31,61,46,0.95) 100%)",
        }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[6vh] flex flex-col justify-between text-bg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.28em] text-[1.05vw] opacity-90">
              Prologue · The eagle answered
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-75">
            Is this the right direction?
          </div>
        </div>

        <div className="max-w-[72vw] mx-auto w-full text-center">
          <div className="font-display text-[2.05vw] leading-[1.55] opacity-95 space-y-[1.6vh]" style={{ textWrap: "balance" }}>
            <p>
              I was writing this plan out on my deck, watching nature. I asked myself a question:{" "}
              <span className="italic" style={{ color: "#e9c8a8" }}>is this the right direction?</span>
            </p>
            <p>
              At that moment an eagle appeared above me. I said, "well hello!" He came down low and slowly stayed above me.
            </p>
            <p>
              I asked the question again, this time to him:{" "}
              <span className="italic" style={{ color: "#e9c8a8" }}>is this the right direction?</span>
            </p>
            <p>
              He flew in a slow circle. Then he flew out of sight.
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="max-w-[44vw]">
            <div
              className="h-[1px] mb-[1.6vh] w-[14vw]"
              style={{ background: "rgba(244,237,224,0.5)" }}
            />
            <div
              className="font-display italic text-[1.6vw] leading-[1.3]"
              style={{ color: "#e9c8a8" }}
            >
              The story that sealed Headwaters' fate.
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.25em] text-[0.95vw] opacity-70">
              Continue → Cover
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

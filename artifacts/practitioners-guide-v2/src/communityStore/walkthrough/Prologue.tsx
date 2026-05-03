import { useCallback } from "react";
import { ChevronDown } from "lucide-react";

const base = import.meta.env.BASE_URL;

export default function Prologue() {
  const handleContinue = useCallback(() => {
    const target = document.getElementById("cs-what-it-is");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      id="cs-prologue"
      aria-label="Prologue — The eagle answered"
      data-testid="cs-eagle-prologue"
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{ background: "var(--cs-primary)" }}
    >
      <img
        src={`${base}eagle-prologue.png`}
        alt="A bald eagle soaring against a pale boreal sky"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 30%" }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,46,38,0.20) 0%, rgba(20,46,38,0.05) 38%, rgba(20,46,38,0.55) 64%, rgba(20,46,38,0.96) 100%)",
        }}
      />
      <div
        className="relative z-10 flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-7 pt-14 sm:pt-16 pb-10 sm:pb-12"
        style={{ color: "var(--cs-bg)" }}
      >
        <div
          className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] opacity-90"
          style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--cs-accent)" }}
          />
          <span>Prologue · The eagle answered</span>
        </div>

        <div
          className="text-[19px] sm:text-[21px] leading-[1.6] space-y-4"
          style={{ textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}
        >
          <p>
            I was writing this plan out on my deck, watching nature. I asked
            myself a question:{" "}
            <span className="italic" style={{ color: "var(--cs-accent)" }}>
              is this the right direction?
            </span>
          </p>
          <p>
            At that moment an eagle appeared above me. I said, "well hello!"
            He came down low and stayed above me.
          </p>
          <p>
            I asked again, this time to him:{" "}
            <span className="italic" style={{ color: "var(--cs-accent)" }}>
              is this the right direction?
            </span>
          </p>
          <p>He flew in a slow circle. Then he flew out of sight.</p>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="h-px w-16" style={{ background: "rgba(244,237,224,0.5)" }} />
          <div
            className="italic text-[15px] text-center"
            style={{ color: "var(--cs-accent)", fontFamily: "'Fraunces', Georgia, serif" }}
          >
            The story that sealed the partnership's fate.
          </div>
          <button
            type="button"
            onClick={handleContinue}
            data-testid="cs-prologue-continue"
            aria-label="Continue past the prologue"
            className="group mt-2 inline-flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.22em] opacity-85 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/40 rounded px-3 py-2"
            style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
          >
            <span>Continue</span>
            <ChevronDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

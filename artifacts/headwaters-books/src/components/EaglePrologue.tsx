import { useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface EaglePrologueProps {
  continueId: string;
}

const base = import.meta.env.BASE_URL;

export function EaglePrologue({ continueId }: EaglePrologueProps) {
  const handleContinue = useCallback(() => {
    const target = document.getElementById(continueId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [continueId]);

  return (
    <section
      aria-label="Prologue — The eagle answered"
      data-testid="eagle-prologue"
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: "hsl(160 40% 12%)" }}
    >
      <img
        src={`${base}eagle-prologue.png`}
        alt="A bald eagle soaring against a pale boreal sky, a quiet circular flight arc traced behind it"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 30%" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,42,32,0.20) 0%, rgba(20,42,32,0.10) 38%, rgba(20,42,32,0.55) 64%, rgba(20,42,32,0.96) 100%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full px-6 sm:px-10 py-12 sm:py-16 text-white">
        <div className="flex items-center justify-between text-xs sm:text-sm uppercase tracking-[0.28em] opacity-85">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: "#e9c8a8" }}
            />
            <span>Prologue · The eagle answered</span>
          </div>
          <span className="hidden sm:inline opacity-75">Is this the right direction?</span>
        </div>

        <div className="text-center mt-12 sm:mt-0">
          <div
            className="space-y-5 text-lg sm:text-xl md:text-2xl leading-relaxed opacity-95"
            style={{ fontFamily: "var(--app-font-serif)", textWrap: "balance" }}
          >
            <p>
              I was drafting this plan standing out on my deck, observing nature, and I asked myself:{" "}
              <span className="italic" style={{ color: "#e9c8a8" }}>
                is this the right direction?
              </span>
            </p>
            <p>
              At that moment an eagle appeared overhead. I said, "well hello!" — and he lowered with force, and slowly stayed above me.
            </p>
            <p>
              I asked again, this time to him:{" "}
              <span className="italic" style={{ color: "#e9c8a8" }}>
                is this the right direction?
              </span>
            </p>
            <p>He soared in a circle formation, then flew out of sight.</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 mt-12 sm:mt-0">
          <div
            className="h-px w-24"
            style={{ backgroundColor: "rgba(255,255,255,0.45)" }}
          />
          <div
            className="italic text-base sm:text-lg text-center"
            style={{ fontFamily: "var(--app-font-serif)", color: "#e9c8a8" }}
          >
            The story that sealed Headwaters' fate.
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="group mt-4 inline-flex flex-col items-center gap-1 text-xs uppercase tracking-[0.28em] opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/40 rounded px-3 py-2"
            data-testid="prologue-continue"
            aria-label="Continue past the prologue"
          >
            <span>Continue</span>
            <ChevronDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

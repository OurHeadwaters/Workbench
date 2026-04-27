import { useCallback } from "react";
import { ChevronDown } from "lucide-react";

const base = import.meta.env.BASE_URL;

/**
 * Prologue — full-bleed eagle, four short stanzas, no chrome interruption.
 * Sits ABOVE the AppShell so the eagle owns the first viewport; once the
 * contractor taps "Continue" (or scrolls), the sticky header appears and
 * the document begins.
 *
 * Mirrors the v2 Practitioner's Guide EaglePrologue pattern: dark
 * gradient over a warm boreal photograph, narrative copy floating in
 * white serif, italic caption + Continue ⌄ at the bottom.
 */
export default function Prologue() {
  const handleContinue = useCallback(() => {
    const target = document.getElementById("what-it-is");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <section
      id="prologue"
      aria-label="Prologue — The eagle answered"
      data-testid="eagle-prologue"
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{ background: "var(--color-primary)" }}
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
            "linear-gradient(180deg, rgba(20,46,38,0.20) 0%, rgba(20,46,38,0.05) 38%, rgba(20,46,38,0.55) 64%, rgba(20,46,38,0.96) 100%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-7 pt-14 sm:pt-16 pb-10 sm:pb-12 text-[var(--color-bg)]">
        <div
          className="flex items-center gap-2 mono text-[10.5px] uppercase tracking-[0.22em] opacity-90"
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
          <span>Prologue · The eagle answered</span>
        </div>

        <div
          className="serif text-[19px] sm:text-[21px] leading-[1.6] space-y-4"
          style={{ textWrap: "balance" }}
        >
          <p>
            I was writing this plan out on my deck, watching nature. I asked
            myself a question:{" "}
            <span className="italic" style={{ color: "var(--color-accent)" }}>
              is this the right direction?
            </span>
          </p>
          <p>
            At that moment an eagle appeared above me. I said, "well hello!"
            He came down low and stayed above me.
          </p>
          <p>
            I asked again, this time to him:{" "}
            <span className="italic" style={{ color: "var(--color-accent)" }}>
              is this the right direction?
            </span>
          </p>
          <p>He flew in a slow circle. Then he flew out of sight.</p>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div
            className="h-px w-16"
            style={{ background: "rgba(244,237,224,0.5)" }}
          />
          <div
            className="serif italic text-[15px] text-center"
            style={{ color: "var(--color-accent)" }}
          >
            The story that sealed Headwaters' fate.
          </div>
          <button
            type="button"
            onClick={handleContinue}
            data-testid="prologue-continue"
            aria-label="Continue past the prologue"
            className="group mt-2 inline-flex flex-col items-center gap-1 mono text-[10px] uppercase tracking-[0.22em] opacity-85 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/40 rounded px-3 py-2"
          >
            <span>Continue</span>
            <ChevronDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

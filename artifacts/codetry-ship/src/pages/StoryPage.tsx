import { useState } from "react";
import { TrailArtGallery } from "@/components/TrailArtGallery";
import { TrailSignPost } from "@/components/TrailSignPost";

/* ── Youth path data (from youthPath.ts source) ────────────────────────── */

const YOUTH_PHASES = [
  { n: 1, label: "Your Kitchen",   desc: "Where what you already know lives" },
  { n: 2, label: "Your People",    desc: "The ones who shaped you without trying" },
  { n: 3, label: "The Hard Thing", desc: "What was called a weakness" },
  { n: 4, label: "The Crossing",   desc: "What doesn't need permission to begin" },
];

const YOUTH_STATIONS = [
  {
    ordinal: 1, phase: 1,
    name: "The Watcher",
    subtitle: "Someone in your life who teaches without a word",
    excerpt: "She had just shown them how to stay. You look until you stop looking. And then you see.",
    sourceTale: "The Elder Who Sat at the Creek",
  },
  {
    ordinal: 2, phase: 1,
    name: "The Rings",
    subtitle: "Something handed to you before you understood its weight",
    excerpt: "I didn't know, he said. But you did it anyway.",
    sourceTale: "The Boy Who Counted the Rings",
  },
  {
    ordinal: 3, phase: 2,
    name: "The Button",
    subtitle: "A small move that connected you to something real",
    excerpt: "She pressed it. Nothing happened. Four days later, Margaret Swain called her.",
    sourceTale: "The Button She Almost Didn't Press",
  },
  {
    ordinal: 4, phase: 2,
    name: "The Word",
    subtitle: "A name from home that the outside world doesn't have",
    excerpt: "How her people said home in a way that held the river, the season, a grandmother's name, and a specific kind of light all at once.",
    sourceTale: "The Girl Who Waited for the Eagle",
  },
  {
    ordinal: 5, phase: 3,
    name: "The Readiness",
    subtitle: "What was called a weakness is a kind of equipment",
    excerpt: "A heart worn on the outside is not a weakness. It is a kind of readiness.",
    sourceTale: "The Girl Who Never Knew",
  },
  {
    ordinal: 6, phase: 3,
    name: "The Current",
    subtitle: "The thing you were built for vs. the tree you were told to climb",
    excerpt: "The freedom was never up the tree. The child took a stone home without knowing why.",
    sourceTale: "The Fish Who Stopped Trying to Climb",
  },
  {
    ordinal: 7, phase: 4,
    name: "The Green",
    subtitle: "The aliveness that doesn't wait for permission",
    excerpt: "She had stopped waiting for the season to change. She walked outside anyway.",
    sourceTale: "The Girl Who Stopped Waiting for Spring",
  },
  {
    ordinal: 8, phase: 4,
    name: "The Return",
    subtitle: "What empty hands make possible that full ones can't",
    excerpt: "He came back with nothing anyone could see — and found that was exactly what had been needed.",
    sourceTale: "The Man Who Came Back with Empty Hands",
  },
];

/* ── Page ──────────────────────────────────────────────────────────────── */

export function StoryPage() {
  const [openStation, setOpenStation] = useState<number | null>(null);

  return (
    <main
      className="min-h-screen"
      style={{ background: "#fdf8f0" }}
    >
      {/* ══════════════════════════════════════════════ HERO ══ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "58vw", maxHeight: 560 }}
      >
        <img
          src="/story/hero-banner.png"
          alt="A warm boreal forest trail at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(18,38,28,0.5) 0%, rgba(31,61,46,0.28) 40%, rgba(18,38,28,0.78) 100%)",
          }}
        />

        <div
          className="relative z-10 flex flex-col justify-end h-full px-6 sm:px-10 pb-10 pt-20"
          style={{ minHeight: "inherit" }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-5">
            <a
              href="/"
              className="font-mono text-[8px] uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              style={{ color: "rgba(212,160,23,0.55)" }}
            >
              ourheadwaters.ca
            </a>
            <span className="font-mono text-[8px]" style={{ color: "rgba(212,160,23,0.28)" }}>/</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: "rgba(212,160,23,0.55)" }}>
              The Youth Odyssey
            </span>
          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.32em] mb-3" style={{ color: "rgba(212,160,23,0.88)" }}>
            A Headwaters Journey
          </p>
          <h1
            className="font-serif leading-[1.1] mb-3"
            style={{
              color: "#f4ede0",
              fontSize: "clamp(2rem, 6vw, 3.4rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 16px rgba(0,0,0,0.35)",
            }}
          >
            The Youth Odyssey
          </h1>
          <p
            className="font-serif italic mb-4"
            style={{
              color: "rgba(244,237,224,0.72)",
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              maxWidth: "38ch",
            }}
          >
            4 phases · 8 stations · your own story at the end.
          </p>

          {/* Age track pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Ages 6–10", note: "caregiver-led" },
              { label: "Ages 10–14", note: "independent" },
              { label: "Ages 14–18", note: "full depth" },
            ].map(({ label, note }) => (
              <span
                key={label}
                className="font-mono text-[8px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(244,237,224,0.12)",
                  border: "1px solid rgba(244,237,224,0.22)",
                  color: "rgba(244,237,224,0.6)",
                }}
              >
                {label} · {note}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ TRAIL FORK — WHERE ARE YOU? ══ */}
      <section
        className="py-10 px-6 sm:px-10 flex flex-col items-center"
        style={{ background: "rgba(31,61,46,0.03)", borderBottom: "1px solid rgba(31,61,46,0.08)" }}
      >
        <p
          className="font-mono text-[8.5px] uppercase tracking-[0.28em] mb-6 text-center"
          style={{ color: "rgba(31,61,46,0.38)" }}
        >
          You are here
        </p>
        <TrailSignPost mode="fork" />
        <p
          className="font-serif italic text-center mt-6 max-w-sm"
          style={{ color: "rgba(31,61,46,0.45)", fontSize: "13.5px", lineHeight: 1.65 }}
        >
          Two paths leave the same trailhead. The Youth Odyssey is for the ones
          who don't yet have a community to build — but have something worth
          carrying into one.
        </p>
      </section>

      {/* ══════════════════════════════════ SOPHIE'S WATERCOLOUR ══ */}
      <TrailArtGallery />

      {/* ══════════════════════════════════════════ TRAIL MAP ══ */}
      <section className="max-w-[44rem] mx-auto px-6 sm:px-8 py-14">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-1 h-px" style={{ background: "rgba(31,61,46,0.12)" }} />
          <p className="font-mono text-[8.5px] uppercase tracking-[0.26em]" style={{ color: "rgba(31,61,46,0.35)" }}>
            The Trail
          </p>
          <div className="flex-1 h-px" style={{ background: "rgba(31,61,46,0.12)" }} />
        </div>

        {YOUTH_PHASES.map((phase) => {
          const stations = YOUTH_STATIONS.filter((s) => s.phase === phase.n);
          return (
            <div key={phase.n} className="mb-14" data-testid={`youth-phase-${phase.n}`}>
              {/* Phase header */}
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className="font-mono text-[8px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(184,90,62,0.65)" }}
                >
                  Phase {String(phase.n).padStart(2, "0")}
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(31,61,46,0.08)" }} />
              </div>
              <h2
                className="font-serif mb-1"
                style={{
                  fontSize: "clamp(1.45rem, 4.5vw, 2rem)",
                  color: "#1f3d2e",
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {phase.label}
              </h2>
              <p
                className="font-serif italic mb-6"
                style={{ color: "rgba(31,61,46,0.5)", fontSize: "14px", lineHeight: 1.6 }}
              >
                {phase.desc}
              </p>

              {/* Station cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stations.map((station) => {
                  const isOpen = openStation === station.ordinal;
                  return (
                    <button
                      key={station.ordinal}
                      onClick={() => setOpenStation(isOpen ? null : station.ordinal)}
                      className="text-left rounded-xl transition-all"
                      style={{
                        background: isOpen ? "rgba(31,61,46,0.07)" : "rgba(31,61,46,0.04)",
                        border: isOpen
                          ? "1px solid rgba(31,61,46,0.18)"
                          : "1px solid rgba(31,61,46,0.09)",
                        padding: "18px 20px",
                        cursor: "pointer",
                      }}
                      data-testid={`youth-station-${station.ordinal}`}
                      aria-expanded={isOpen}
                    >
                      {/* Station number */}
                      <span
                        className="font-mono text-[7.5px] uppercase tracking-[0.24em] block mb-2"
                        style={{ color: "rgba(184,90,62,0.55)" }}
                      >
                        Station {String(station.ordinal).padStart(2, "0")}
                      </span>

                      {/* Station name */}
                      <p
                        className="font-serif mb-1"
                        style={{
                          fontSize: "clamp(1.1rem, 3.5vw, 1.3rem)",
                          color: "#1f3d2e",
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.2,
                        }}
                      >
                        {station.name}
                      </p>

                      {/* Subtitle */}
                      <p
                        className="font-serif italic"
                        style={{ fontSize: "13px", color: "rgba(31,61,46,0.55)", lineHeight: 1.55 }}
                      >
                        {station.subtitle}
                      </p>

                      {/* Expandable excerpt */}
                      {isOpen && (
                        <div className="mt-4">
                          <div
                            className="h-px mb-3"
                            style={{ background: "rgba(31,61,46,0.1)" }}
                          />
                          <p
                            className="font-serif italic"
                            style={{
                              fontSize: "14px",
                              color: "#2a3d34",
                              lineHeight: 1.72,
                              fontStyle: "italic",
                            }}
                          >
                            "{station.excerpt}"
                          </p>
                          <p
                            className="font-mono text-[7.5px] uppercase tracking-[0.18em] mt-2"
                            style={{ color: "rgba(31,61,46,0.38)" }}
                          >
                            From: {station.sourceTale}
                          </p>
                        </div>
                      )}

                      {/* Tap hint */}
                      {!isOpen && (
                        <p
                          className="font-mono text-[7px] uppercase tracking-[0.18em] mt-3"
                          style={{ color: "rgba(31,61,46,0.28)" }}
                        >
                          Tap to read a fragment →
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ════════════════════════════════════════ ARTIST SUBMIT ══ */}
      <section
        className="max-w-[44rem] mx-auto px-6 sm:px-8 pb-6"
        id="submit-art-story"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(31,61,46,0.10)" }}
        >
          <div
            className="px-6 py-4"
            style={{ background: "rgba(31,61,46,0.04)", borderBottom: "1px solid rgba(31,61,46,0.08)" }}
          >
            <p className="font-mono text-[8.5px] uppercase tracking-[0.24em]" style={{ color: "rgba(31,61,46,0.38)" }}>
              Pebbles left on the trail
            </p>
          </div>
          <div className="px-6 py-7">
            <p
              className="font-serif mb-2"
              style={{
                color: "#1f3d2e",
                fontSize: "clamp(1rem, 3vw, 1.1rem)",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              Are you an artist from a community this trail passes through?
            </p>
            <p
              className="font-serif mb-5"
              style={{ color: "rgba(31,61,46,0.6)", fontSize: "clamp(0.9rem, 2.4vw, 1rem)", lineHeight: 1.75 }}
            >
              Any medium. Any format. When your work is here, people on the trail can tip
              you using community tokens.
            </p>
            <a
              href="mailto:bobbie@ourheadwaters.ca?subject=Youth%20Odyssey%20Art%20Submission"
              className="inline-flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.2em] transition-opacity hover:opacity-75"
              style={{ color: "#b85a3e" }}
            >
              Submit your work → bobbie@ourheadwaters.ca
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ ODYSSEY CTA ══ */}
      <section className="max-w-[44rem] mx-auto px-6 sm:px-8 text-center pb-20">
        <div className="h-px w-16 mx-auto mb-8" style={{ background: "rgba(31,61,46,0.14)" }} />
        <p
          className="font-mono text-[8.5px] uppercase tracking-[0.3em] mb-3"
          style={{ color: "rgba(31,61,46,0.35)" }}
        >
          Ready for the practitioner path?
        </p>
        <p
          className="font-serif italic mb-6"
          style={{
            color: "#1f3d2e",
            fontSize: "clamp(1rem, 3vw, 1.2rem)",
            lineHeight: 1.6,
          }}
        >
          The Odyssey is the same journey for people who are already
          building — 5 phases, 20 stations, at your own pace.
        </p>
        <a
          href="/odyssey"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] px-6 py-3 rounded-sm transition-all hover:opacity-85"
          style={{ background: "#1f3d2e", color: "#f4ede0" }}
        >
          Begin the Odyssey →
        </a>
      </section>
    </main>
  );
}

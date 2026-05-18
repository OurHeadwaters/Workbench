import { useState } from "react";

/* ── Chapter data ──────────────────────────────────────────────────────── */

const CHAPTERS = [
  {
    n: "01",
    title: "The Saltbox",
    season: "Early spring · bare ground just visible",
    image: "/odyssey/artists/sophie-tree-watercolor.jpg",
    imageAlt: "Looking up through the branches — watercolour by Sophie",
    imageArtist: "Sophie",
    imageLocation: "Sioux Lookout, Ontario",
    imageNation: "Anishinaabe",
    isRealArtist: true,
    body: [
      "Before you can build anything new, you have to see what is already there.",
      "In the old days, people kept a saltbox near the fire — a small wooden box where the salt lived. Not much. But enough. You always knew exactly what you had.",
      "The Headwaters community starts every journey this way. Before any plans, before any meetings, they walk around and name what they find. The food already growing. The skills already living in people's hands. The work already happening, quietly, without anyone calling it work.",
      "This is the saltbox. You can't cook without knowing what's in it.",
    ],
    reflection: "What's already in your community's saltbox?",
  },
  {
    n: "02",
    title: "Both-States",
    season: "Late winter · ice still holding, water moving underneath",
    image: "/story/chapter-river.png",
    imageAlt: "A river frozen on top and flowing underneath — watercolour illustration",
    imageArtist: "Illustration",
    imageLocation: undefined,
    imageNation: undefined,
    isRealArtist: false,
    body: [
      "A river in Northwestern Ontario does something strange in spring. It is frozen and flowing at the same time.",
      "Under the ice, water is rushing. On top, everything looks still and quiet. If you only look at the surface, you might think nothing is moving. If you only look underneath, you miss the weight of what is holding it back.",
      "A community is like this too. Old ways and new ways, living together. Some things moving fast under the surface. Some things frozen in place, waiting for the right season to let go.",
      "At the Headwaters, they say: before you try to break the ice, make sure you understand the current underneath.",
    ],
    reflection: "What is frozen in your community? What is moving underneath?",
  },
  {
    n: "03",
    title: "Both-Sides",
    season: "Spring break-up · both banks bare",
    image: "/story/chapter-saltbox.png",
    imageAlt: "Hands holding a small saltbox with seeds and dried herbs",
    imageArtist: "Illustration",
    imageLocation: undefined,
    imageNation: undefined,
    isRealArtist: false,
    body: [
      "Every river has two banks.",
      "On one side, people fish with nets. On the other side, people fish with lines. Neither is wrong. They have been fishing that way for longer than anyone can remember, and both ways feed people.",
      "The hardest thing about building something together is learning to stand on both banks — not just yours. To understand why people do things the way they do, what they are depending on, what they are protecting.",
      "At the Headwaters, they say: never draw the map until you have stood on both sides.",
    ],
    reflection: "Who stands on the other side of your river?",
  },
  {
    n: "04",
    title: "The Standby",
    season: "Midsummer · long days, time to prepare",
    image: "/story/chapter-river.png",
    imageAlt: "A calm summer river with green banks",
    imageArtist: "Illustration",
    imageLocation: undefined,
    imageNation: undefined,
    isRealArtist: false,
    body: [
      "A wise trapper does not wait for the rabbit to pass by to set the snare. They set it before.",
      "Readiness is built in the quiet seasons — when the river is low, when there is time to think, when the work is not urgent yet. That is the only time you can do it right.",
      "At the Headwaters, this is called the standby. It is the food put away before winter. The plan written down before the crisis. The relationship kept warm before you need it.",
      "You cannot scramble your way into being ready. You have to build it slowly, when things are calm.",
    ],
    reflection: "What work are you doing now that will matter when things get hard?",
  },
  {
    n: "05",
    title: "The Gate",
    season: "Early autumn · harvest before the freeze",
    image: "/story/chapter-gate.png",
    imageAlt: "A wooden gate at the edge of the forest, open, with golden light pouring through",
    imageArtist: "Illustration",
    imageLocation: undefined,
    imageNation: undefined,
    isRealArtist: false,
    body: [
      "The best thing you can build is something you can give away.",
      "A gate swings open for the next person. That is what it is for — not to keep people out, but to let them in, and then to hand them the key so they can do the same.",
      "At the end of the Headwaters journey, the worker does not hoard what they have learned. They write it down, carefully, so the next person can walk in and keep going without starting from the beginning.",
      "This is how a community builds a world that lasts longer than any one person in it.",
    ],
    reflection: "What are you building that someone else can carry forward?",
  },
];

/* ── Page ──────────────────────────────────────────────────────────────── */

export function StoryPage() {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [tipOpen, setTipOpen] = useState<number | null>(null);

  return (
    <main
      className="min-h-screen"
      style={{ background: "#fdf8f0", fontFamily: "var(--font-serif, Georgia, serif)" }}
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
              "linear-gradient(160deg, rgba(18,38,28,0.55) 0%, rgba(31,61,46,0.30) 40%, rgba(18,38,28,0.72) 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col justify-end h-full px-6 sm:px-10 pb-10 pt-20" style={{ minHeight: "inherit" }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-5">
            <a
              href="/"
              className="font-mono text-[8px] uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              style={{ color: "rgba(212,160,23,0.55)" }}
            >
              ourheadwaters.ca
            </a>
            <span className="font-mono text-[8px]" style={{ color: "rgba(212,160,23,0.28)" }}>
              /
            </span>
            <span
              className="font-mono text-[8px] uppercase tracking-[0.2em]"
              style={{ color: "rgba(212,160,23,0.55)" }}
            >
              The Story
            </span>
          </div>

          <p
            className="font-mono text-[9px] uppercase tracking-[0.32em] mb-3"
            style={{ color: "rgba(212,160,23,0.88)" }}
          >
            A Headwaters Story
          </p>
          <h1
            className="font-serif leading-[1.1] mb-3"
            style={{
              color: "#f4ede0",
              fontSize: "clamp(2rem, 6vw, 3.6rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 16px rgba(0,0,0,0.35)",
            }}
          >
            How a Community
            <br />
            Builds Its Own World
          </h1>
          <p
            className="font-serif italic"
            style={{
              color: "rgba(244,237,224,0.72)",
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              maxWidth: "36ch",
            }}
          >
            Five chapters from the headwaters of everything.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════ CHAPTER NAV ══ */}
      <nav
        className="sticky top-0 z-20 flex items-center gap-1 px-6 sm:px-10 py-3 overflow-x-auto"
        style={{
          background: "rgba(253,248,240,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(31,61,46,0.10)",
        }}
        aria-label="Chapter navigation"
      >
        {CHAPTERS.map((ch, i) => (
          <a
            key={ch.n}
            href={`#chapter-${ch.n}`}
            onClick={() => setActiveChapter(i)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
            style={{
              background: activeChapter === i ? "rgba(31,61,46,0.10)" : "transparent",
              border: "1px solid rgba(31,61,46,0.12)",
            }}
          >
            <span
              className="font-mono text-[8px] uppercase tracking-[0.18em]"
              style={{ color: "rgba(31,61,46,0.45)" }}
            >
              {ch.n}
            </span>
            <span
              className="font-serif text-[13px]"
              style={{ color: "#1f3d2e" }}
            >
              {ch.title}
            </span>
          </a>
        ))}
      </nav>

      {/* ══════════════════════════════════════════ CHAPTERS ══ */}
      <div className="max-w-[42rem] mx-auto px-6 sm:px-8 py-12 space-y-24">
        {CHAPTERS.map((ch, i) => (
          <article
            key={ch.n}
            id={`chapter-${ch.n}`}
            className="scroll-mt-16"
            data-testid={`story-chapter-${ch.n}`}
          >
            {/* Chapter number ghost */}
            <div
              className="font-serif font-bold select-none pointer-events-none leading-none mb-2"
              style={{
                fontSize: "clamp(5rem, 18vw, 9rem)",
                color: "rgba(31,61,46,0.06)",
                letterSpacing: "-0.04em",
                marginLeft: "-0.05em",
                lineHeight: 0.9,
              }}
            >
              {ch.n}
            </div>

            {/* Season */}
            <p
              className="font-mono text-[8.5px] uppercase tracking-[0.26em] mb-2 -mt-2"
              style={{ color: "rgba(184,90,62,0.65)" }}
            >
              {ch.season}
            </p>

            {/* Title */}
            <h2
              className="font-serif mb-6"
              style={{
                fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                color: "#1f3d2e",
                fontWeight: 500,
                letterSpacing: "-0.015em",
                lineHeight: 1.15,
              }}
            >
              {ch.title}
            </h2>

            {/* Illustration */}
            <div
              className="rounded-2xl overflow-hidden mb-8 relative shadow-sm"
              style={{ border: "1px solid rgba(31,61,46,0.08)" }}
            >
              <img
                src={ch.image}
                alt={ch.imageAlt}
                className="w-full object-cover"
                style={{ maxHeight: 340, objectPosition: "center 30%" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12"
                style={{
                  background:
                    "linear-gradient(to top, rgba(18,38,28,0.82) 0%, transparent 100%)",
                }}
              >
                <div className="flex items-end justify-between gap-2 flex-wrap">
                  <div>
                    <p
                      className="font-serif text-[13px] italic leading-snug"
                      style={{ color: "#f4ede0" }}
                    >
                      {ch.imageAlt}
                    </p>
                    <p
                      className="font-mono text-[8px] uppercase tracking-[0.2em] mt-0.5"
                      style={{ color: "rgba(212,160,23,0.88)" }}
                    >
                      {ch.imageArtist}
                      {ch.imageLocation ? ` · ${ch.imageLocation}` : ""}
                      {ch.imageNation ? ` · ${ch.imageNation}` : ""}
                    </p>
                  </div>

                  {ch.isRealArtist && (
                    <button
                      onClick={() => setTipOpen(tipOpen === i ? null : i)}
                      className="font-mono text-[8px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-sm transition-all"
                      style={{
                        background:
                          tipOpen === i
                            ? "rgba(212,160,23,0.30)"
                            : "rgba(212,160,23,0.14)",
                        color: "rgba(244,237,224,0.88)",
                        border: "1px solid rgba(212,160,23,0.32)",
                      }}
                    >
                      ✦ Tip {ch.imageArtist}
                    </button>
                  )}
                </div>

                {tipOpen === i && ch.isRealArtist && (
                  <div
                    className="mt-2 px-3 py-2.5 rounded-sm"
                    style={{
                      background: "rgba(18,38,28,0.85)",
                      border: "1px solid rgba(212,160,23,0.20)",
                    }}
                  >
                    <p
                      className="font-serif text-[13px] italic mb-1"
                      style={{ color: "#f4ede0" }}
                    >
                      XRPL community token tipping is coming with the community
                      economic engine launch.
                    </p>
                    <p
                      className="font-mono text-[7.5px] uppercase tracking-[0.16em]"
                      style={{ color: "rgba(212,160,23,0.55)" }}
                    >
                      Each band issues its own token · tips go directly to artists
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Story prose */}
            <div className="space-y-4 mb-8">
              {ch.body.map((para, pi) => (
                <p
                  key={pi}
                  style={{
                    color: "#2a3d34",
                    fontSize: "clamp(1rem, 2.8vw, 1.1rem)",
                    lineHeight: 1.8,
                    fontFamily: "var(--font-serif, Georgia, serif)",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Reflection question */}
            <div
              className="rounded-xl px-6 py-5"
              style={{
                background: "rgba(31,61,46,0.05)",
                borderLeft: "3px solid rgba(212,160,23,0.6)",
              }}
            >
              <p
                className="font-mono text-[8px] uppercase tracking-[0.24em] mb-2"
                style={{ color: "rgba(184,90,62,0.7)" }}
              >
                Reflect
              </p>
              <p
                className="font-serif italic"
                style={{
                  color: "#1f3d2e",
                  fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                  lineHeight: 1.65,
                }}
              >
                {ch.reflection}
              </p>
            </div>

            {/* Chapter divider (not after last) */}
            {i < CHAPTERS.length - 1 && (
              <div
                className="flex items-center gap-3 mt-16"
                style={{ color: "rgba(31,61,46,0.20)" }}
              >
                <div className="flex-1 h-px" style={{ background: "rgba(31,61,46,0.14)" }} />
                <span className="font-mono text-[9px] tracking-[0.3em]">✦</span>
                <div className="flex-1 h-px" style={{ background: "rgba(31,61,46,0.14)" }} />
              </div>
            )}
          </article>
        ))}

        {/* ══════════════════════════════ COMMUNITY ART CTA ══ */}
        <section
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(31,61,46,0.10)" }}
          id="submit-art-story"
        >
          <div
            className="px-6 py-5"
            style={{ background: "rgba(31,61,46,0.04)", borderBottom: "1px solid rgba(31,61,46,0.08)" }}
          >
            <p
              className="font-mono text-[8.5px] uppercase tracking-[0.24em]"
              style={{ color: "rgba(31,61,46,0.4)" }}
            >
              Pebbles left on the trail
            </p>
          </div>
          <div className="px-6 py-7">
            <p
              className="font-serif mb-2"
              style={{
                color: "#1f3d2e",
                fontSize: "clamp(1rem, 3vw, 1.15rem)",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              Are you an artist from a community this story passes through?
            </p>
            <p
              className="font-serif mb-5"
              style={{
                color: "rgba(31,61,46,0.62)",
                fontSize: "clamp(0.9rem, 2.4vw, 1rem)",
                lineHeight: 1.75,
              }}
            >
              If this landscape is yours — if you have lived at the headwaters — we want your
              work here. Any medium. Any format. When it is here, people on the trail can tip
              you directly using community tokens.
            </p>
            <a
              href="mailto:bobbie@ourheadwaters.ca?subject=Story%20Art%20Submission"
              className="inline-flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.2em] transition-opacity hover:opacity-75"
              style={{ color: "#b85a3e" }}
            >
              Submit your work → bobbie@ourheadwaters.ca
            </a>
            <p
              className="font-mono text-[8px] uppercase tracking-[0.14em] mt-3 leading-[1.8]"
              style={{ color: "rgba(31,61,46,0.35)" }}
            >
              Include: your name · your community · a title if you have one · your XRPL address for tips (optional)
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════ ODYSSEY CTA ══ */}
        <section className="text-center pb-8">
          <div
            className="h-px w-16 mx-auto mb-8"
            style={{ background: "rgba(31,61,46,0.18)" }}
          />
          <p
            className="font-mono text-[8.5px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "rgba(31,61,46,0.38)" }}
          >
            Ready to begin
          </p>
          <p
            className="font-serif italic mb-6"
            style={{
              color: "#1f3d2e",
              fontSize: "clamp(1.05rem, 3vw, 1.3rem)",
              lineHeight: 1.55,
            }}
          >
            The story is for everyone. The Odyssey is for you — a self-directed
            journey through the same five phases, at your own pace.
          </p>
          <a
            href="/odyssey"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] px-6 py-3 rounded-sm transition-all hover:opacity-85"
            style={{
              background: "#1f3d2e",
              color: "#f4ede0",
              border: "none",
            }}
          >
            Begin the Odyssey →
          </a>
        </section>
      </div>
    </main>
  );
}

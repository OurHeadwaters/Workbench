const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

interface ToolCard {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  displayPath: string;
  accent: string;
  accentFg: string;
  testId: string;
}

const TOOLS: ToolCard[] = [
  {
    eyebrow: "Knowledge commons",
    title: "Research Library",
    description:
      "Curated food systems research, producer contacts, and policy documents for northern communities — open and searchable.",
    href: "/library/",
    displayPath: "/library/",
    accent: "hsl(145 36% 22%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-library",
  },
  {
    eyebrow: "Practitioner's guide",
    title: "Community Store Guide",
    description:
      "Step-by-step operational guide for building a community-owned store — site selection, co-op structure, financing, and day-one operations.",
    href: "/practitioners-guide-v2/",
    displayPath: "/guide/",
    accent: "hsl(14 64% 36%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-guide",
  },
  {
    eyebrow: "Plain-language handbook",
    title: "How a Community Runs Its Own Economy",
    description:
      "A plain-language handbook explaining how community economics actually works — written for band members, not consultants.",
    href: "/codetry-handbook/",
    displayPath: "/handbook/",
    accent: "hsl(30 40% 50%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-handbook",
  },
  {
    eyebrow: "Open financial records",
    title: "Headwaters Books",
    description:
      "What a community store's finances actually look like — open records the band can read, the daily close operators run, and the month-end pack for council.",
    href: "/headwaters-books/",
    displayPath: "/books/",
    accent: "hsl(145 28% 30%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-books",
  },
  {
    eyebrow: "Print & marketing",
    title: "Print Marketing Suite",
    description:
      "Ready-to-print posters, flyers, and signage for store openings and community events — designed for the team on the ground.",
    href: "/print-marketing/",
    displayPath: "/print/",
    accent: "hsl(14 50% 44%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-print",
  },
];

export function LandingPage() {
  return (
    <main
      className="min-h-screen w-full"
      style={{ background: "hsl(38 36% 94%)", color: "hsl(145 28% 14%)" }}
      data-testid="landing-page"
    >
      {/* ── hero ── */}
      <section
        className="relative overflow-hidden px-6 sm:px-10 pt-16 pb-14"
        style={{ background: "hsl(145 36% 18%)", color: "hsl(38 36% 96%)" }}
        data-testid="landing-hero"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: "hsl(38 36% 94%)" }}
        />
        <div className="relative mx-auto max-w-[52rem]">
          <div
            className="mb-7 inline-block rounded-sm px-3 py-2"
            style={{ background: "hsla(38, 36%, 94%, 0.92)" }}
            data-testid="landing-logo-badge"
          >
            <img
              src={`${import.meta.env.BASE_URL}headwaters-logo.svg`}
              alt="Headwaters — Northwestern Ontario"
              className="block w-full max-w-[260px]"
            />
          </div>

          <h1
            className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-3"
            data-testid="landing-title"
          >
            Community tools for<br className="hidden sm:block" /> northern Ontario.
          </h1>
          <p
            className="font-serif text-lg italic mb-8 opacity-75"
            data-testid="landing-tagline"
          >
            Practitioner-built resources for communities running their own economy.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="#tools"
              className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "hsl(var(--accent))", color: "hsl(38 36% 96%)" }}
              data-testid="landing-cta-tools"
            >
              Browse the tools ↓
            </a>
            <a
              href={`${BASE}/home`}
              className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] border transition-opacity hover:opacity-90"
              style={{ borderColor: "hsla(38, 36%, 96%, 0.55)", color: "hsl(38 36% 96%)" }}
              data-testid="landing-cta-work"
            >
              About the project →
            </a>
          </div>
        </div>
      </section>

      {/* ── tools directory ── */}
      <section
        id="tools"
        className="mx-auto max-w-[52rem] px-6 sm:px-8 py-14 sm:py-16"
        data-testid="landing-tools"
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
          style={{ color: "hsl(14 64% 36%)" }}
        >
          tools & resources
        </p>
        <h2
          className="font-serif text-3xl tracking-tight mb-2"
          data-testid="tools-heading"
        >
          Everything at ourheadwaters.ca
        </h2>
        <p
          className="font-serif text-[15px] leading-[1.6] mb-10"
          style={{ color: "hsl(145 12% 36%)" }}
        >
          Each tool below is live and in use — not a demo, not a proposal.
          Click any card to open it directly.
        </p>

        <div className="space-y-3" data-testid="tools-list">
          {TOOLS.map((tool) => (
            <a
              key={tool.testId}
              href={tool.href}
              className="group block rounded-md border overflow-hidden transition-opacity hover:opacity-90"
              style={{ borderColor: "hsl(145 14% 78%)" }}
              data-testid={tool.testId}
            >
              {/* coloured header strip */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ background: tool.accent, color: tool.accentFg }}
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] opacity-75 mb-0.5">
                    {tool.eyebrow}
                  </p>
                  <p className="font-serif text-lg sm:text-xl leading-tight font-medium">
                    {tool.title}
                  </p>
                </div>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-70 shrink-0 ml-6 hidden sm:block"
                  aria-hidden
                >
                  Open →
                </span>
              </div>

              {/* description + url */}
              <div
                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                style={{ background: "hsl(38 32% 97%)" }}
              >
                <p
                  className="font-serif text-[14px] leading-[1.55]"
                  style={{ color: "hsl(145 12% 36%)" }}
                >
                  {tool.description}
                </p>
                <p
                  className="font-mono text-[10px] tracking-[0.14em] shrink-0 sm:ml-8"
                  style={{ color: tool.accent, opacity: 0.8 }}
                >
                  ourheadwaters.ca{tool.displayPath}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── divider ── */}
      <hr
        className="mx-auto max-w-[52rem] px-6 sm:px-8"
        style={{ borderColor: "hsl(145 14% 78%)" }}
      />

      {/* ── about / contact strip ── */}
      <section
        className="mx-auto max-w-[52rem] px-6 sm:px-8 py-12 sm:py-14"
        data-testid="landing-about"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
              style={{ color: "hsl(14 64% 36%)" }}
            >
              about headwaters
            </p>
            <p className="font-serif text-[15px] leading-[1.65]" style={{ color: "hsl(145 12% 36%)" }}>
              Headwaters builds software and operational tools for northern communities
              in Northwestern Ontario. Every tool here is live and in use by real
              communities — not demos, not proposals.
            </p>
          </div>
          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
              style={{ color: "hsl(14 64% 36%)" }}
            >
              start a conversation
            </p>
            <p
              className="font-serif text-[15px] leading-[1.65] mb-5"
              style={{ color: "hsl(145 12% 36%)" }}
            >
              Tell us what your community is trying to build. That is enough to start.
              Bobbie will write back — no sales pitch, no proposal deck.
            </p>
            <a
              href={`${BASE}/home#conversation`}
              className="inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "hsl(14 64% 36%)", color: "hsl(38 36% 96%)" }}
              data-testid="landing-contact-cta"
            >
              Get in touch →
            </a>
          </div>
        </div>
      </section>

      {/* ── footer ── */}
      <footer
        className="border-t px-6 py-6 text-center"
        style={{ borderColor: "hsl(145 14% 78%)" }}
        data-testid="landing-footer"
      >
        <p
          className="font-mono text-[9px] uppercase tracking-[0.22em]"
          style={{ color: "hsl(145 12% 36%)", opacity: 0.6 }}
        >
          Headwaters · Dryden, Ontario · ourheadwaters.ca
        </p>
      </footer>
    </main>
  );
}

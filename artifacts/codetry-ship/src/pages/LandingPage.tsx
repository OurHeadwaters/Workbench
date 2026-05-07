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
  external?: boolean;
}

interface ComingSoonCard {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  testId: string;
}

const TOOLS: ToolCard[] = [
  {
    eyebrow: "Practitioner workspace · Operations",
    title: "Saltbox",
    description:
      "A practitioner's home base — tasks, contacts, and notes in one calm workspace. Built for people who run things.",
    href: "https://salt-box.replit.app/",
    displayPath: "salt-box.replit.app",
    accent: "hsl(145 36% 22%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-saltbox",
    external: true,
  },
  {
    eyebrow: "Operations · For entrepreneurs",
    title: "Rootwork",
    description:
      "A calm command center for builders who can't sit still. Private and self-hosted — drop in the chaos, find what you need in seconds.",
    href: "https://community-knowledge-hub.replit.app/studio/",
    displayPath: "community-knowledge-hub.replit.app",
    accent: "hsl(155 28% 28%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-rootwork",
    external: true,
  },
  {
    eyebrow: "Journalling · Public and private",
    title: "Dam Days",
    description:
      "A journal that knows what to keep — and what to share. Public entries, private pages, one place.",
    href: "https://conversation-log.replit.app/",
    displayPath: "conversation-log.replit.app",
    accent: "hsl(30 40% 50%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-damdays",
    external: true,
  },
  {
    eyebrow: "Knowledge commons · Northern food systems",
    title: "Research Library",
    description:
      "Curated food systems research, producer contacts, and policy documents for northern communities — open and searchable.",
    href: "/library/",
    displayPath: "/library/",
    accent: "hsl(145 28% 30%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-library",
  },
  {
    eyebrow: "Grants · Northern communities",
    title: "Grants Finder",
    description:
      "Every funding source for northern and Indigenous communities — grants, programs, and deadlines in one searchable index.",
    href: "https://community-knowledge-hub.replit.app/infographics/grants-finder.html",
    displayPath: "community-knowledge-hub.replit.app",
    accent: "hsl(14 64% 36%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-grants",
    external: true,
  },
  {
    eyebrow: "Health · Long-term care",
    title: "Bright Side",
    description:
      "Recreation therapy companion for long-term care homes — activity planning, resident engagement, and documentation built for the people on the floor.",
    href: "https://health-support-hub.replit.app/",
    displayPath: "health-support-hub.replit.app",
    accent: "hsl(155 22% 34%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-brightside",
    external: true,
  },
  {
    eyebrow: "Market intelligence · Northern food systems",
    title: "Market Mosaic",
    description:
      "An interactive snapshot of northern food markets — who's buying, what they need, and where the gaps are.",
    href: "https://community-knowledge-hub.replit.app/infographics/market-mosaic.html",
    displayPath: "community-knowledge-hub.replit.app",
    accent: "hsl(145 36% 18%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-market-mosaic",
    external: true,
  },
  {
    eyebrow: "Supply chain · Northern communities",
    title: "Standby Supplies",
    description:
      "A ready reference for sourcing food and supplies when the usual options fall through — northern supply chain and emergency sourcing.",
    href: "https://community-knowledge-hub.replit.app/infographics/standby-supplies.html",
    displayPath: "community-knowledge-hub.replit.app",
    accent: "hsl(14 50% 44%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-standby-supplies",
    external: true,
  },
  {
    eyebrow: "Personal finance · Headwaters",
    title: "Headwaters Finance",
    description:
      "A personal finance tool built for fast-moving people — maps where money goes for people who move faster than any folder system.",
    href: "https://x-buckets-vision.replit.app/",
    displayPath: "x-buckets-vision.replit.app",
    accent: "hsl(30 45% 44%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "tool-finance",
    external: true,
  },
];

const COMING_SOON: ComingSoonCard[] = [
  {
    eyebrow: "Community store · Launching soon",
    title: "Community Store Guide",
    description:
      "Site selection, co-op structure, band financing, and day-one operations — a plain-language guide for building a community-owned store.",
    accent: "hsl(14 64% 36%)",
    testId: "tool-store-soon",
  },
  {
    eyebrow: "Co-op membership · Coming soon",
    title: "Co-op Membership Platform",
    description:
      "Membership and governance tools for community-owned co-ops — pending a vote from the pilot community before public launch.",
    accent: "hsl(145 28% 30%)",
    testId: "tool-coop-soon",
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
              {...(tool.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
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

              {/* description */}
              <div
                className="px-5 py-4"
                style={{ background: "hsl(38 32% 97%)" }}
              >
                <p
                  className="font-serif text-[14px] leading-[1.55]"
                  style={{ color: "hsl(145 12% 36%)" }}
                >
                  {tool.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* ── coming soon ── */}
        {COMING_SOON.length > 0 && (
          <div className="mt-8 space-y-3" data-testid="tools-coming-soon">
            <p
              className="font-mono text-[9px] uppercase tracking-[0.28em] mb-4"
              style={{ color: "hsl(145 12% 36%)", opacity: 0.55 }}
            >
              In progress
            </p>
            {COMING_SOON.map((card) => (
              <div
                key={card.testId}
                className="rounded-md border overflow-hidden opacity-60"
                style={{ borderColor: "hsl(145 14% 78%)" }}
                data-testid={card.testId}
              >
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ background: card.accent, color: "hsl(38 36% 96%)" }}
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] opacity-75 mb-0.5">
                      {card.eyebrow}
                    </p>
                    <p className="font-serif text-lg sm:text-xl leading-tight font-medium">
                      {card.title}
                    </p>
                  </div>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 shrink-0 ml-6 hidden sm:block"
                    aria-hidden
                  >
                    Coming soon
                  </span>
                </div>
                <div
                  className="px-5 py-4"
                  style={{ background: "hsl(38 32% 97%)" }}
                >
                  <p
                    className="font-serif text-[14px] leading-[1.55]"
                    style={{ color: "hsl(145 12% 36%)" }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
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

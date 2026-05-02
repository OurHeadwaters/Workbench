export function HomePage() {
  return (
    <main className="home-page min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[52rem] px-6 sm:px-8 py-16 sm:py-24">

        {/* ── header ── */}
        <header className="space-y-4" data-testid="home-header">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
            data-testid="home-eyebrow"
          >
            headwaters · northwestern ontario
          </p>
          <h1
            className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight"
            data-testid="home-title"
          >
            Food systems planning<br className="hidden sm:block" /> for northern communities.
          </h1>
          <p
            className="font-serif text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: "hsl(var(--muted-foreground))" }}
            data-testid="home-tagline"
          >
            Headwaters is a single-practitioner consultancy based in Dryden,
            Ontario. The work is operational: store plans, food hub design,
            community economic development — written in plain language, dollar-honest,
            and built to run without an outside consultant on retainer.
          </p>
        </header>

        <hr
          className="my-12 sm:my-16"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        {/* ── the work ── */}
        <section data-testid="home-work">
          <div className="flex items-baseline justify-between gap-3 mb-6">
            <h2
              className="font-serif text-2xl tracking-tight"
              data-testid="work-heading"
            >
              The work
            </h2>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--accent))" }}
            >
              shipped · running · readable
            </p>
          </div>

          <div className="space-y-3" data-testid="work-cards">
            <ComingSoonCard
              eyebrow="Community store · Launching soon"
              title="Building the store — a community economic guide"
              description="What it takes to stand up a community-owned store in northwestern Ontario: the 807 supply chain, local hire and training, band council financing, co-op structure, and day-one operations. Plain language, open numbers."
              testId="work-card-store"
            />
            <ComingSoonCard
              eyebrow="Co-op membership · Coming soon"
              title="Co-op Membership Platform"
              description="A membership and governance platform for community-owned co-ops in the 807. Pending a vote from the pilot community before public launch."
              testId="work-card-coop"
            />
            <WorkCard
              eyebrow="Northern food systems · Knowledge commons"
              title="Northern Food Systems Research Library"
              description="A curated, searchable library of food systems research, producer contacts, and community case studies for northern and Indigenous communities. Open for contributors."
              href="/library/"
              testId="work-card-library"
            />
            <DemoCard
              eyebrow="Community ledger · Headwaters Books"
              title="Open books — what a community store's finances look like"
              description="A live demo of the bookkeeping tool: open records the band can read, the daily close the operators run each night, and the month-end pack the bookkeeper hands council. Sample data, no login."
              href="/headwaters-books/demo"
              testId="work-card-books-demo"
            />
            <WorkCard
              eyebrow="Grants · Northern communities"
              title="Grants Finder"
              description="A searchable index of funding available to northern and Indigenous communities — grants, programs, and deadlines in one place."
              href="https://community-knowledge-hub.replit.app/grants/"
              external
              testId="work-card-grants"
            />
            <WorkCard
              eyebrow="Personal finance · Headwaters"
              title="Headwaters Finance"
              description="Your money has been free-ranging. A personal finance tool that maps where money goes, built for people who move faster than any folder system."
              href="https://x-buckets-vision.replit.app/"
              external
              testId="work-card-finance"
            />
            <WorkCard
              eyebrow="Operations · For entrepreneurs"
              title="Rootwork"
              description="A calm command center for builders who can't sit still. Private and self-hosted — your notes stay yours. Drop in the chaos, find what you need in seconds."
              href="https://community-knowledge-hub.replit.app/studio/"
              external
              testId="work-card-rootwork"
            />
            <WorkCard
              eyebrow="Health · Long-term care"
              title="Bright Side"
              description="A recreation therapy companion for LTC homes — activity planning, resident engagement, and documentation built for the people on the floor."
              href="https://health-support-hub.replit.app/"
              external
              testId="work-card-brightside"
            />
            <WorkCard
              eyebrow="Journalling · Public and private"
              title="Dam Days"
              description="A journal that knows what to keep to yourself and what to share. Public entries, private pages, one place."
              href="https://conversation-log.replit.app/"
              external
              testId="work-card-damdays"
            />
          </div>
        </section>

        <hr
          className="my-12 sm:my-16"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        {/* ── engage ── */}
        <section data-testid="home-engage">
          <div className="flex items-baseline justify-between gap-3 mb-5">
            <h2
              className="font-serif text-2xl tracking-tight"
              data-testid="engage-heading"
            >
              How to start
            </h2>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--accent))" }}
            >
              no ceremony required
            </p>
          </div>

          <div className="space-y-4 font-serif text-[15px] leading-[1.6]" data-testid="engage-body">
            <p>
              The usual first step is a trial period: a bounded scope of work
              at an hourly rate, no retainer, no long commitment. If the fit
              is right, it continues. If not, you leave with something useful
              and no obligation to keep going.
            </p>
            <p>
              Reach out by email with a sentence or two about your community
              and what you are trying to build. That is enough to start.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6" data-testid="engage-actions">
            <a
              href="mailto:bobbie@ourheadwaters.ca"
              className="inline-flex items-center justify-center px-6 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-opacity hover:opacity-90"
              style={{
                background: "hsl(var(--accent))",
                color: "hsl(var(--background))",
              }}
              data-testid="engage-email-btn"
            >
              bobbie@ourheadwaters.ca
            </a>
            <a
              href="bio"
              className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-70"
              style={{ color: "hsl(var(--muted-foreground))" }}
              data-testid="engage-bio-link"
            >
              Rate card and full bio →
            </a>
          </div>
        </section>

        {/* ── footer ── */}
        <footer
          className="mt-20 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="home-footer"
        >
          <p className="signoff">— bobbie parr · headwaters · dryden, ontario</p>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {new Date().getFullYear()}
          </p>
        </footer>

      </div>
    </main>
  );
}

interface DemoCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  testId: string;
}

function DemoCard({ eyebrow, title, description, href, testId }: DemoCardProps) {
  return (
    <a
      href={href}
      className="block rounded-md border bg-card p-5 sm:p-6 transition-colors hover:border-accent"
      style={{ borderColor: "hsl(var(--card-border))" }}
      data-testid={testId}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2"
        style={{ color: "hsl(var(--accent))" }}
      >
        {eyebrow}
      </p>
      <p className="font-serif text-[17px] font-medium tracking-tight mb-2">
        {title}
      </p>
      <p
        className="font-serif text-[14px] leading-[1.55]"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {description}
      </p>
      <p
        className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color: "hsl(var(--accent))" }}
      >
        View demo →
      </p>
    </a>
  );
}

interface ComingSoonCardProps {
  eyebrow: string;
  title: string;
  description: string;
  testId: string;
}

function ComingSoonCard({ eyebrow, title, description, testId }: ComingSoonCardProps) {
  return (
    <div
      className="block rounded-md border bg-card p-5 sm:p-6 opacity-75"
      style={{ borderColor: "hsl(var(--card-border))", borderStyle: "dashed" }}
      data-testid={testId}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2"
        style={{ color: "hsl(var(--accent))" }}
      >
        {eyebrow}
      </p>
      <p className="font-serif text-[17px] font-medium tracking-tight mb-2">
        {title}
      </p>
      <p
        className="font-serif text-[14px] leading-[1.55]"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {description}
      </p>
    </div>
  );
}

interface WorkCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  testId: string;
  external?: boolean;
}

function WorkCard({ eyebrow, title, description, href, testId, external }: WorkCardProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="block rounded-md border bg-card p-5 sm:p-6 transition-colors hover:border-accent"
      style={{ borderColor: "hsl(var(--card-border))" }}
      data-testid={testId}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2"
        style={{ color: "hsl(var(--accent))" }}
      >
        {eyebrow}
      </p>
      <p className="font-serif text-[17px] font-medium tracking-tight mb-2">
        {title}
      </p>
      <p
        className="font-serif text-[14px] leading-[1.55]"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {description}
      </p>
    </a>
  );
}

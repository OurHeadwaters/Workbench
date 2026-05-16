export function WorkPage() {
  return (
    <main className="work-page min-h-screen w-full bg-background text-foreground">

      {/* ── hero ── */}
      <section
        className="relative overflow-hidden px-6 sm:px-10 pt-16 pb-14"
        style={{ background: "hsl(145 36% 18%)", color: "hsl(38 36% 96%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-10"
          style={{ background: "hsl(38 36% 94%)" }}
        />
        <div className="relative mx-auto max-w-[52rem]">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4 opacity-70">
            headwaters · selected work
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-3">
            Case studies
          </h1>
          <p className="font-serif text-lg italic mb-0 opacity-75">
            One community client. One origin story. What the problem was, what was built, what they left with.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[52rem] px-6 sm:px-8 py-12 space-y-14">

        {/* ── Case Study 1: Parr's Jars ── */}
        <article data-testid="case-study-parrs-jars">
          <div
            className="rounded-md px-5 py-4 mb-5 relative overflow-hidden"
            style={{ background: "hsl(14 64% 36%)", color: "hsl(38 36% 96%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: "hsl(38 36% 94%)" }}
            />
            <div className="relative flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] mb-1.5 opacity-70">
                  Origin story · The dual-identity problem every northern practitioner faces
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">
                  Parr's Jars — what it takes to hold two identities without losing either one
                </h2>
              </div>
              <img
                src={`${import.meta.env.BASE_URL}thumb-rootwork.png`}
                alt="Parr's Jars brand identity preview"
                className="hidden sm:block shrink-0 rounded object-cover"
                style={{ width: 110, height: 74, opacity: 0.88 }}
              />
            </div>
          </div>

          {/* summary blurb */}
          <p className="font-serif text-[15px] leading-[1.65] mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Most northern practitioners carry two identities at once — the community-facing work, and the funding-facing work. The language that works at a farmers market table does not work in a band council resolution, and trying to run both under one name muddies both signals. This is the problem Bobbie solved for Parr&rsquo;s Jars, and it is the same problem her clients bring to Headwaters.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-8">
            <section>
              <BlockLabel>The problem</BlockLabel>
              <p className="font-serif text-[15px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
                Parr's Jars started as a small-batch preserves business out of the bush near Dryden, Ontario — smoked salts, maple syrup, seasonal jars. The brand worked for one line of business. Then the practice expanded into software and community development consulting under the same name, and the original brand couldn't carry both. A jar of salt and a band council engagement plan don't speak the same visual language, and trying to make one logo serve both was muddying both signals.
              </p>
            </section>

            <section>
              <BlockLabel>What was built</BlockLabel>
              <p className="font-serif text-[15px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
                A full visual rebrand across both lines of business — a dual-identity system where Parr's Jars and Headwaters Development Services could coexist without either one diluting the other. New wordmarks, a unified colour system (Evergreen, Rust, Cream, Ink), copy architecture that works for a market table and a band council office, and a site structure that lets the two identities live side by side without feeling like two unrelated companies stapled together.
              </p>
            </section>
          </div>

          <div
            className="mt-6 rounded-md border px-5 py-4"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          >
            <BlockLabel>What the client left with</BlockLabel>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-3">
              {[
                "Dual-identity brand system that works for both lines of business",
                "Print-ready wordmarks in light, dark, and rust colourways",
                "parrsjars.ca — a live site reflecting the updated brand",
                "Copy architecture written for two distinct audiences",
                "Market display materials, business cards, and letterhead",
                "Colour and type system documented for future use",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="font-mono text-[11px] mt-[3px] shrink-0" style={{ color: "hsl(14 64% 36%)" }}>→</span>
                  <span className="font-serif text-[14px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <a
              href="https://parrsjars.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(14 64% 36%)" }}
            >
              parrsjars.ca →
            </a>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}>live site</span>
          </div>
        </article>

        <hr style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── Case Study 2: 807 Food Co-op ── */}
        <article data-testid="case-study-807-food-coop">
          <div
            className="rounded-md px-5 py-4 mb-5 relative overflow-hidden"
            style={{ background: "hsl(145 36% 22%)", color: "hsl(38 36% 96%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: "hsl(38 36% 94%)" }}
            />
            <div className="relative flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] mb-1.5 opacity-70">
                  Community client · Platform delivery · Founding board
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">
                  807 Food Co-op — working platform in 8 weeks, $0 in licensing fees, board owns it outright
                </h2>
              </div>
              <img
                src={`${import.meta.env.BASE_URL}thumb-coop.png`}
                alt="807 Food Co-op membership platform preview"
                className="hidden sm:block shrink-0 rounded object-cover"
                style={{ width: 110, height: 74, opacity: 0.88 }}
              />
            </div>
          </div>

          {/* summary blurb */}
          <p className="font-serif text-[15px] leading-[1.65] mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
            The founding board of a new Northwestern Ontario food co-op needed a working platform before their launch — not a proposal, not a prototype. Member registration, equity tracking, producer onboarding, board administration, and AGM tooling, all built in 8 weeks alongside the bylaws, and handed off so the board owns it outright with no ongoing licensing fees.
          </p>
          <div
            className="flex flex-wrap gap-3 mb-8"
          >
            {[
              { label: "Timeline", value: "8 weeks, Phase 1 to working platform" },
              { label: "Members ready", value: "40+ household registrations at launch" },
              { label: "Licensing fees", value: "$0 ongoing — board owns it outright" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-md border px-4 py-3 flex-1 min-w-[180px]"
                style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] mb-1" style={{ color: "hsl(145 36% 30%)" }}>{label}</p>
                <p className="font-serif text-[15px] font-medium leading-tight">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-8">
            <section>
              <BlockLabel>The problem</BlockLabel>
              <p className="font-serif text-[15px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
                The founding board of a new Northwestern Ontario food co-op needed more than a set of bylaws — they needed a working platform before their launch. Member registration, equity tracking, producer onboarding, board administration, and AGM tooling all had to exist before the co-op could open to members. Nothing off the shelf fit the governance model, and building it in the open was a condition from the start — the board needed to see it working at every stage, not receive a finished product at the end.
              </p>
            </section>

            <section>
              <BlockLabel>Role</BlockLabel>
              <p className="font-serif text-[15px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
                Founding board member and platform builder. This is an unusual dual role — the platform was built by someone who also sits at the governance table, which meant the tooling stayed close to the real decisions being made. Platform architecture, member flows, and governance wiring were designed alongside the bylaws rather than after them.
              </p>
              <p className="font-serif text-[14px] italic mt-3 leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.8 }}>
                Note: the co-op is pre-launch pending a board vote before June. The platform is live for internal use; public launch and domain migration to 807foodcoop.ca are pending.
              </p>
            </section>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="rounded-md border px-5 py-4"
              style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
            >
              <BlockLabel>What was built</BlockLabel>
              <ul className="mt-3 space-y-2">
                {[
                  "Member portal — household and producer views with role-based access",
                  "Producer onboarding flow — application to listing, no email back-and-forth",
                  "Board admin panel — AGM, meeting minutes, cashflow tracking",
                  "AGM tools — voting, quorum tracking, member records",
                  "Governance rules wired directly into the platform flow",
                  "Plain-language admin documentation for non-technical staff",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="font-mono text-[11px] mt-[3px] shrink-0" style={{ color: "hsl(145 36% 30%)" }}>→</span>
                    <span className="font-serif text-[13.5px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-md border px-5 py-4"
              style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
            >
              <BlockLabel>What the board left with</BlockLabel>
              <ul className="mt-3 space-y-2">
                {[
                  "A working platform the board owns outright — no licensing fees",
                  "Member registration system ready for the first cohort",
                  "Governance tooling that follows their bylaws, not a generic template",
                  "Admin documentation written for their staff, not developers",
                  "A platform ready for domain migration when the board votes to launch",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="font-mono text-[11px] mt-[3px] shrink-0" style={{ color: "hsl(145 36% 30%)" }}>→</span>
                    <span className="font-serif text-[13.5px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <a
              href="https://community-knowledge-hub.replit.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(145 36% 30%)" }}
            >
              Platform preview →
            </a>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}>live · internal use · pre-launch</span>
          </div>
        </article>

        <hr style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── Placeholder for additional case studies ── */}
        <div
          className="rounded-md border px-6 py-5"
          style={{ borderColor: "hsl(var(--card-border))", borderStyle: "dashed", background: "hsl(var(--card))", opacity: 0.65 }}
          data-testid="case-study-placeholder"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            More case studies in progress
          </p>
          <p className="font-serif text-[15px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
            Additional community engagements will be documented here as they complete — community store plans, co-op builds, and custom tools.
          </p>
        </div>

        <hr style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── CTA ── */}
        <section className="pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3" style={{ color: "hsl(var(--accent))" }}>
            start a conversation
          </p>
          <p className="font-serif text-[15px] leading-[1.6] mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            If what you are trying to build looks anything like these, reach out. A sentence or two about your community and what you are planning is enough to start.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href={`${import.meta.env.BASE_URL}`}
              className="inline-flex items-center gap-2 rounded-sm px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
            >
              Start a conversation (short form) →
            </a>
            <a
              href="https://community-knowledge-hub.replit.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              See how the 807 platform was built →
            </a>
            <a
              href={`${import.meta.env.BASE_URL}services`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              See what the work looks like →
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[10px] uppercase tracking-[0.26em] mb-3"
      style={{ color: "hsl(var(--accent))" }}
    >
      {children}
    </p>
  );
}

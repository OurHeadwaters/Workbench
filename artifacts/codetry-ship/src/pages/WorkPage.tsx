export function WorkPage() {
  return (
    <main className="work-page min-h-screen w-full bg-background text-foreground">

      {/* ── hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#1f3d2e", color: "#f4ede0" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("${import.meta.env.BASE_URL}odyssey/hempcrete-texture.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.10,
            mixBlendMode: "multiply",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 od-topo" style={{ opacity: 0.10 }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(10,22,14,0.4) 100%)" }}
        />
        <div className="relative z-10 mx-auto max-w-[38rem] px-6 sm:px-8 pt-12 pb-14 text-center">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-5"
            style={{ color: "rgba(212,160,23,0.8)" }}
          >
            headwaters · selected work
          </p>
          <h1
            className="font-serif leading-[1.12] tracking-tight mb-4"
            style={{ fontSize: "clamp(1.8rem, 6vw, 2.6rem)" }}
          >
            Case studies
          </h1>
          <p
            className="font-serif italic"
            style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)", color: "rgba(244,237,224,0.72)", lineHeight: 1.55 }}
          >
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
                  Community client · Platform delivery · Ongoing engagement
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">
                  807 Food Co-operative — purpose-built for a northern food system, board-owned, no licensing fees
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
            The 807 Food Co-operative has been running since 2021, testing a wide range of platforms — OFN, LFM, Local Line, Square — looking for something that fits a northern food system. The current stack causes friction among members. Headwaters is building a purpose-built replacement: tools designed for how this co-op actually operates, in the language the community already uses, owned by the board outright.
          </p>
          <div
            className="flex flex-wrap gap-3 mb-8"
          >
            {[
              { label: "Active since", value: "2021 — four years of real-world operation" },
              { label: "Members", value: "40+ households registered" },
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
                Running a food co-op in Northwestern Ontario means working against compounding barriers: limited producer capacity, a small consumer market spread across a vast geography, rural communities that can't access fresh supply without absorbing costly distribution margins, and no clear way to connect community supply lines sustainably. The 807 Co-op spent four years testing the off-the-shelf options. Each platform — OFN, LFM, Local Line, Square — arrived with its own language, its own logic, and a training curve built for someone else's context. Contractors recommended what worked for them. The board kept adapting to the software. That's the problem Headwaters is solving: build the tools inside out, in the language the community already uses, and hand them off so the board can run them without outside help.
              </p>
            </section>

            <section>
              <BlockLabel>Role</BlockLabel>
              <p className="font-serif text-[15px] leading-[1.6]" style={{ color: "hsl(var(--muted-foreground))" }}>
                Founding board member and ongoing platform builder. Headwaters has been inside this co-op since 2021 — not as a consultant parachuting in with a recommendation, but as someone sitting at the governance table building what the board actually needs. The next platform is being built the same way: from the inside out, starting with how the co-op already operates, not with what an existing tool can offer.
              </p>
            </section>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="rounded-md border px-5 py-4"
              style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
            >
              <BlockLabel>What was built — and what's coming</BlockLabel>
              <ul className="mt-3 space-y-2">
                {[
                  "Member portal — household and producer views with role-based access",
                  "Producer onboarding flow — application to listing, no email back-and-forth",
                  "Board admin panel — AGM, meeting minutes, cashflow tracking",
                  "Governance rules wired directly into the platform flow",
                  "Snap to Shelf — producer listing tool built for farmers, not tech teams",
                  "Meeting Builder — structured meeting tooling for board and member meetings",
                  "Distribution line tooling — connecting rural supply to community demand",
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
              <BlockLabel>What the board owns</BlockLabel>
              <ul className="mt-3 space-y-2">
                {[
                  "A platform built for their operation — not adapted from someone else's",
                  "Member registration and equity tracking running since launch",
                  "Governance tooling that follows their bylaws, not a generic template",
                  "Admin documentation written for their staff, not developers",
                  "No licensing fees, no dependency on a vendor deciding to change their pricing",
                  "A build process that stays inside the community's own language and logic",
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

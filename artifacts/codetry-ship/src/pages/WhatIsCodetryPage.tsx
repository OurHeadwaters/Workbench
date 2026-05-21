export function WhatIsCodetryPage() {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

  return (
    <main className="min-h-screen w-full bg-background text-foreground">

      {/* ── hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#1f3d2e", color: "#f4ede0" }}
        data-testid="codetry-hero"
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
          style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(10,22,14,0.45) 100%)" }}
        />

        <div className="relative z-10 mx-auto max-w-[38rem] px-6 sm:px-8 pt-14 pb-16 text-center">
          <div className="flex justify-center mb-7">
            <img
              src={`${import.meta.env.BASE_URL}eagle-mark.svg`}
              alt="Headwaters — Northwestern Ontario"
              style={{ height: 60, width: "auto", objectFit: "contain", filter: "brightness(1.08)" }}
            />
          </div>

          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4"
            style={{ color: "rgba(212,160,23,0.8)" }}
            data-testid="codetry-eyebrow"
          >
            what is codetry?
          </p>

          <h1
            className="font-serif leading-[1.12] tracking-tight mb-6"
            style={{ fontSize: "clamp(2rem, 7vw, 3rem)", color: "#f4ede0" }}
            data-testid="codetry-title"
          >
            Two sides.<br />
            One model.
          </h1>

          <p
            className="font-serif leading-[1.6] mb-8"
            style={{ fontSize: "clamp(0.95rem, 2.8vw, 1.1rem)", color: "rgba(244,237,224,0.80)" }}
            data-testid="codetry-lede"
          >
            Codetry is the discipline that makes community ownership possible — locally proven on reserves
            and in northern Ontario towns, and replicable anywhere a practitioner is willing to do the work.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
            <a
              href={`${base}/sign-on`}
              className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "#b85a3e", color: "#f4ede0" }}
              data-testid="codetry-cta-primary"
            >
              Sign on →
            </a>
            <a
              href={`${base}/`}
              className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{
                background: "transparent",
                border: "1px solid rgba(244,237,224,0.22)",
                color: "rgba(244,237,224,0.72)",
              }}
              data-testid="codetry-cta-home"
            >
              Start a conversation →
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[48rem] px-6 sm:px-8 pt-14 pb-20">

        {/* ── two sides ── */}
        <section data-testid="codetry-two-sides">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-5"
            style={{ color: "hsl(var(--accent))" }}
          >
            the two sides
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">

            {/* Side 1 — local roots */}
            <div
              className="rounded-md border p-6"
              style={{ borderColor: "hsl(145 36% 22%)", background: "hsl(var(--card))" }}
              data-testid="codetry-side-local"
            >
              <div
                className="inline-block rounded-sm px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] mb-4"
                style={{ background: "hsl(145 36% 22%)", color: "hsl(38 36% 96%)" }}
              >
                Local proof of concept
              </div>
              <h2 className="font-serif text-xl font-medium tracking-tight mb-3">
                Headwaters
              </h2>
              <p
                className="font-serif text-[14.5px] leading-[1.6]"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                The practice that runs in Northwestern Ontario. Real stores on reserves.
                Real co-op numbers. Real freight relationships. A full small-community
                economy — store, accounts, training, and governance — built and handed off
                so the community runs it without an outside consultant on retainer.
              </p>
            </div>

            {/* Side 2 — global pattern */}
            <div
              className="rounded-md border p-6"
              style={{ borderColor: "hsl(14 64% 36%)", background: "hsl(var(--card))" }}
              data-testid="codetry-side-global"
            >
              <div
                className="inline-block rounded-sm px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] mb-4"
                style={{ background: "hsl(14 64% 36%)", color: "hsl(38 36% 96%)" }}
              >
                Replicable global pattern
              </div>
              <h2 className="font-serif text-xl font-medium tracking-tight mb-3">
                Codetry
              </h2>
              <p
                className="font-serif text-[14.5px] leading-[1.6]"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                The discipline behind the practice. A method for building and handing over
                systems that communities own outright — operator fee, standby model,
                mutual-credit accounting. Any practitioner anywhere can apply it. The
                local context changes; the method doesn't.
              </p>
            </div>
          </div>
        </section>

        <hr className="my-12 sm:my-14" style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── local proof ── */}
        <section className="mb-14" data-testid="codetry-local-proof">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4"
            style={{ color: "hsl(var(--accent))" }}
          >
            local roots — 807 food co-op · dryden, ontario
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl tracking-tight mb-4">
            What a working proof looks like
          </h2>

          <p
            className="font-serif text-[15.5px] leading-[1.65] mb-5"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            The 807 Food Co-op is the reserve-and-northern-community version of this model
            running in real life. Member governance. Local ownership. Food sovereignty on the
            land. Every number is open — sales, margins, freight cost, what goes back into
            the community versus what gets kept by the operator.
          </p>

          <div
            className="rounded-md border-l-4 pl-6 py-4 space-y-3"
            style={{ borderColor: "hsl(145 36% 22%)" }}
          >
            {[
              { label: "Structure", value: "Co-operative — member-owned, not investor-owned" },
              { label: "Geography", value: "Northwestern Ontario reserves and remote communities" },
              { label: "Operator relationship", value: "Flat operating fee; no equity stake, no royalty" },
              { label: "Handoff standard", value: "Community runs it without a consultant in the room" },
              { label: "Accounts", value: "Open books — every dollar tracked and shared with members" },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span
                  className="font-mono text-[9.5px] uppercase tracking-[0.18em] shrink-0"
                  style={{ color: "hsl(var(--accent))", minWidth: "10rem" }}
                >
                  {label}
                </span>
                <span
                  className="font-serif text-[14px] leading-[1.5]"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-12 sm:my-14" style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── global pattern ── */}
        <section className="mb-14" data-testid="codetry-global-pattern">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4"
            style={{ color: "hsl(14 64% 36%)" }}
          >
            global pattern — what travels
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl tracking-tight mb-4">
            The parts that can move anywhere
          </h2>

          <p
            className="font-serif text-[15.5px] leading-[1.65] mb-8"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            The Ontario setting is local. The method is not. These are the pieces any practitioner
            can pick up and apply — whether the community is on a reserve, in a rural town, or
            somewhere else entirely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Operator fee",
                body: "A flat, transparent fee paid to the practitioner for ongoing standby support — no equity, no ownership, no lock-in. The community always holds the keys.",
              },
              {
                label: "Standby model",
                body: "The practitioner remains available as a resource but is not in the room running things. The system is designed from day one so the community can operate it without external dependency.",
              },
              {
                label: "Mutual-credit accounting",
                body: "A local exchange mechanism that lets community members transact without needing outside currency — reducing cash leakage and building internal economic resilience.",
              },
            ].map(({ label, body }) => (
              <div
                key={label}
                className="rounded-md border p-5"
                style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
              >
                <p
                  className="font-mono text-[9.5px] uppercase tracking-[0.18em] mb-3"
                  style={{ color: "hsl(14 64% 36%)" }}
                >
                  {label}
                </p>
                <p
                  className="font-serif text-[13.5px] leading-[1.58]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-12 sm:my-14" style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── how it works ── */}
        <section className="mb-14" data-testid="codetry-how-it-works">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4"
            style={{ color: "hsl(var(--accent))" }}
          >
            how it works
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl tracking-tight mb-8">
            Build it. Hand it off.<br />
            <span style={{ color: "#b85a3e" }}>Community runs it.</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                n: "1",
                head: "A practitioner builds in the open",
                body: "Every decision is named. Every number is shared. The community knows exactly what is being built before they are asked to come aboard.",
              },
              {
                n: "2",
                head: "The system is designed to be handed off",
                body: "From scope to handoff, the goal is a community that can run the economy without anyone outside the room. No retainer. No dependency. No lock-in.",
              },
              {
                n: "3",
                head: "The operator remains on standby",
                body: "After handoff, the practitioner is available at a flat fee — not running the show, but reachable when something unusual comes up. The community decides if and when to call.",
              },
              {
                n: "4",
                head: "Other practitioners replicate the pattern",
                body: "The Headwaters case documents every step so a practitioner in a different country can follow the same method with their own community. The local proof becomes the global template.",
              },
            ].map(({ n, head, body }) => (
              <div
                key={n}
                className="flex gap-5 rounded-md border px-5 py-5"
                style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
              >
                <div
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-semibold mt-0.5"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                >
                  {n}
                </div>
                <div>
                  <p className="font-serif text-[15px] font-medium tracking-tight mb-1.5">{head}</p>
                  <p
                    className="font-serif text-[13.5px] leading-[1.58]"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-12 sm:my-14" style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── Odyssey → Codetry bridge ── */}
        <section className="mb-14" data-testid="codetry-odyssey-bridge">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4"
            style={{ color: "hsl(var(--accent))" }}
          >
            the practitioner path
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl tracking-tight mb-4">
            The Odyssey trains you.<br />
            <span style={{ color: "#b85a3e" }}>Codetry builds what you need.</span>
          </h2>

          <p
            className="font-serif text-[15.5px] leading-[1.65] mb-8"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            The Headwaters Odyssey — 4 phases, 8 stations — trains practitioners to map
            a community economy: who holds value, who bears cost, what needs to be built.
            When a practitioner completes it, they know exactly what their community is
            missing. Codetry is how they get it built.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Brochure site",
                price: "$800 – $1,500",
                body: "A clean public front door. Your store, your co-op, your service — named and findable. 2–3 weeks, handed off.",
              },
              {
                label: "Local directory",
                price: "$2,000 – $4,500",
                body: "A member registry, business directory, or resource map for your community. Searchable, maintained by the community itself. 4–8 weeks.",
              },
              {
                label: "Custom tooling",
                price: "$5,000+",
                body: "The full economy operating system — accounts, governance, exchange, standby dashboard. Built to the community's spec and handed off clean. 6–12 weeks.",
              },
            ].map(({ label, price, body }) => (
              <div
                key={label}
                className="rounded-md border p-5"
                style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
              >
                <p
                  className="font-mono text-[9.5px] uppercase tracking-[0.18em] mb-1"
                  style={{ color: "hsl(14 64% 36%)" }}
                >
                  {label}
                </p>
                <p
                  className="font-mono text-[13px] font-semibold mb-3"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {price}
                </p>
                <p
                  className="font-serif text-[13.5px] leading-[1.58]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>

          <a
            href={`${base}/odyssey`}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
            style={{ color: "hsl(var(--accent))" }}
            data-testid="codetry-odyssey-link"
          >
            Start the Odyssey →
          </a>
        </section>

        <hr className="my-12 sm:my-14" style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── CTA ── */}
        <section data-testid="codetry-cta-section">
          <div
            className="rounded-md p-8 sm:p-10 text-center"
            style={{ background: "#1f3d2e", color: "#f4ede0" }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4"
              style={{ color: "rgba(212,160,23,0.8)" }}
            >
              headwaters · northwestern ontario
            </p>
            <h2
              className="font-serif text-2xl sm:text-3xl tracking-tight mb-4"
              style={{ color: "#f4ede0" }}
            >
              Start a conversation
            </h2>
            <p
              className="font-serif text-[15px] leading-[1.6] mb-8 mx-auto"
              style={{ maxWidth: "34rem", color: "rgba(244,237,224,0.75)" }}
            >
              If this model reads right for your community, the next step is a short message.
              No pitch, no deck. Just a plain account of what you&rsquo;re trying to build
              and who you&rsquo;re building it with.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`${base}/sign-on`}
                className="inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
                style={{ background: "#b85a3e", color: "#f4ede0" }}
                data-testid="codetry-final-sign-on"
              >
                Sign on →
              </a>
              <a
                href={`${base}/#conversation`}
                className="inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
                style={{
                  border: "1px solid rgba(244,237,224,0.25)",
                  color: "rgba(244,237,224,0.75)",
                }}
                data-testid="codetry-final-conversation"
              >
                Send a short note →
              </a>
            </div>
          </div>
        </section>

        {/* ── footer ── */}
        <footer
          className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">— headwaters · dryden, ontario</p>
          <div className="flex items-center gap-5">
            <a
              href={`${base}/services`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              The Work
            </a>
            <a
              href={`${base}/sign-on`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Sign On
            </a>
            <a
              href={`${base}/privacy`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Privacy
            </a>
            <a
              href="https://codetry.ca"
              className="font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-80"
              style={{ color: "hsl(var(--accent))" }}
              data-testid="codetry-canonical-url"
            >
              codetry.ca
            </a>
          </div>
        </footer>

      </div>
    </main>
  );
}

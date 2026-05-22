import { Link } from "wouter";

export function TipPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[38rem] px-6 sm:px-8 py-16 sm:py-24">

        <header className="space-y-5">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            codetry · tip
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            Coming soon.
          </h1>
        </header>

        <section className="mt-8 sm:mt-10 space-y-5">
          <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            The tip system is being built. When it&rsquo;s live, sending
            community credits to someone who helped you will take about ten
            seconds — no forms, no delays, no pending confirmation on their end.
          </p>
          <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            Someone gave you useful knowledge. A recipe, a route, a contact.
            Soon you&rsquo;ll be able to send something back.
          </p>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] pt-2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Not open yet
          </p>
        </section>

        <div className="mt-10">
          <Link
            href="/economy"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--accent))" }}
          >
            ← Back to the Economy
          </Link>
        </div>

        <footer
          className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">headwaters · codetry · {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}

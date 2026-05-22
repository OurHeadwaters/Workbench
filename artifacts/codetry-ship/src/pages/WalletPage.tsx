import { Link } from "wouter";


export function WalletPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[44rem] px-6 sm:px-8 py-16 sm:py-24">

        <header className="space-y-5">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            codetry · your wallet
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            Coming soon.
          </h1>
        </header>

        <section className="mt-8 sm:mt-10 space-y-5">
          <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            The wallet is being built. When it&rsquo;s ready, this is where
            you&rsquo;ll see your balance, track every transaction, and move
            credits to the people and merchants around you.
          </p>
          <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            No bank required. No expiry. Just a record of real value exchanged
            inside the community.
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
          <a
            href="/privacy"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Privacy
          </a>
        </footer>
      </div>
    </main>
  );
}

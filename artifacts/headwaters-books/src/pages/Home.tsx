import { Link } from "wouter";
import { SignedIn, SignedOut } from "@/lib/clerkGates";
import { Button } from "@/components/ui/button";
import { EaglePrologue } from "@/components/EaglePrologue";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EaglePrologue continueId="home-after-prologue" />
      <header id="home-after-prologue" className="w-full p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Headwaters" className="w-8 h-8 text-primary" />
          <span className="font-serif font-bold text-xl text-foreground">Headwaters</span>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log in</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign up</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button>Go to Ledger</Button>
            </Link>
          </SignedIn>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
          We've always known how to fix it, now we can.
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          The working ledger for the Headwaters agency. Grounded, careful, and paper-aware.
        </p>
        
        <SignedOut>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14">Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14">Sign In</Button>
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 h-14">Open the books</Button>
          </Link>
        </SignedIn>
      </main>

      <footer className="p-6 text-center text-sm text-muted-foreground border-t border-border mt-auto space-y-2">
        {/*
          AUDIT NOTE — Standby-leaks-into-Gate bug class (Task #473, #475, #489).
          The footer links the constellation-wide-primitive surfaces
          this app ships. Two primitives are registered in the manifest
          and each has its own per-primitive page on its own route —
          the Standby pilot dashboard at /standby (with its
          advisory/standby/active/standdown ladder + call composer),
          and the Gate shell at /gate (with its
          draft/under-review/cleared/refused ladder + outbound link to
          the runnable surface at legacy-gatekeeper.replit.app). Each
          link names its primitive explicitly — do NOT collapse them
          into a single generic "non-zone primitives" link that would
          inherit one primitive's framing for both. If a third sibling
          primitive earns a surface, add it as its own line here with
          its own naming.
        */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/standby">
            <span className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline cursor-pointer">
              The Standby — Z3 pilot dashboard
            </span>
          </Link>
          <span className="text-muted-foreground/40" aria-hidden>·</span>
          <Link href="/gate">
            <span className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline cursor-pointer">
              The Gate — Z3 shell
            </span>
          </Link>
        </div>
        <div>&copy; {new Date().getFullYear()} Headwaters Food Systems Agency.</div>
      </footer>
    </div>
  );
}

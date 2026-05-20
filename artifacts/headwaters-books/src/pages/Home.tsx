import { Link } from "wouter";
import { SignedIn, SignedOut } from "@/lib/clerkGates";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EaglePrologue } from "@/components/EaglePrologue";
import { NeighbourhoodBadge } from "@/components/NeighbourhoodBadge";
import {
  LayoutDashboard,
  HandHelping,
  GitMerge,
  ShieldCheck,
  RadioTower,
  BookOpen,
  ArrowRight,
  Receipt,
  TrendingUp,
  ListTodo,
  Wallet,
  Award,
  FileText,
} from "lucide-react";

const FEATURE_CARDS = [
  {
    icon: LayoutDashboard,
    label: "The Ledger",
    heading: "Books, every day",
    body: "The daily working ledger for the Headwaters agency — submissions from food handlers, receipt review, accounts, cost centres, and a live P&L. Paper-aware from the start.",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/submissions", label: "Submissions" },
      { href: "/receipts", label: "Receipts queue" },
    ],
    accent: "evergreen",
  },
  {
    icon: HandHelping,
    label: "Helping Hands",
    heading: "Community labour, tracked",
    body: "The task board for agency work — post tasks, assign them, mark them done, and watch earnings flow into member envelopes. Skills and credentials attached to every contributor.",
    links: [
      { href: "/helping-hands", label: "Task board" },
      { href: "/helping-hands/earnings", label: "Earnings" },
      { href: "/helping-hands/badges", label: "Skill directory" },
    ],
    accent: "rust",
  },
  {
    icon: GitMerge,
    label: "Reconciliation",
    heading: "Month-end, without the pain",
    body: "Statement reconciliation with a clean accountant-handoff package — everything signed off in one place so the numbers the agency reports are numbers anyone can verify.",
    links: [
      { href: "/reconciliation", label: "Reconciliation" },
      { href: "/accountant-handoff", label: "Handoff package" },
      { href: "/pnl", label: "Reports" },
    ],
    accent: "moss",
  },
  {
    icon: ShieldCheck,
    label: "The Gate",
    heading: "Bright-side ↔ the systems ledger",
    body: "The substitution ledger that tracks every time a community-side actor replaces a systems product or service with a local alternative — and what that shift is worth.",
    links: [{ href: "/gate", label: "Open the Gate" }],
    accent: "gold",
  },
  {
    icon: RadioTower,
    label: "The Standby",
    heading: "Z3 pilot dashboard",
    body: "Active, advisory, standby, stand-down — the operational status ladder for pilots in the network, with a call composer for communicating decisions up the chain.",
    links: [{ href: "/standby", label: "Open Standby" }],
    accent: "charcoal",
  },
];

const accentStyles: Record<string, { border: string; icon: string; label: string }> = {
  evergreen: {
    border: "border-[hsl(145_36%_22%/0.25)] hover:border-[hsl(145_36%_22%/0.55)]",
    icon: "bg-[hsl(145_36%_22%/0.08)] text-[hsl(145_36%_22%)]",
    label: "text-[hsl(145_36%_28%)]",
  },
  rust: {
    border: "border-[hsl(14_64%_36%/0.25)] hover:border-[hsl(14_64%_36%/0.55)]",
    icon: "bg-[hsl(14_64%_36%/0.08)] text-[hsl(14_64%_36%)]",
    label: "text-[hsl(14_64%_30%)]",
  },
  moss: {
    border: "border-[hsl(145_36%_30%/0.25)] hover:border-[hsl(145_36%_30%/0.55)]",
    icon: "bg-[hsl(145_36%_30%/0.08)] text-[hsl(145_36%_30%)]",
    label: "text-[hsl(145_36%_24%)]",
  },
  gold: {
    border: "border-[hsl(44_85%_40%/0.30)] hover:border-[hsl(44_85%_40%/0.60)]",
    icon: "bg-[hsl(44_85%_40%/0.10)] text-[hsl(44_75%_32%)]",
    label: "text-[hsl(44_75%_28%)]",
  },
  charcoal: {
    border: "border-[hsl(145_8%_40%/0.22)] hover:border-[hsl(145_8%_40%/0.50)]",
    icon: "bg-[hsl(145_8%_40%/0.08)] text-[hsl(145_8%_28%)]",
    label: "text-[hsl(145_8%_28%)]",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EaglePrologue continueId="home-after-prologue" />

      {/* Nav */}
      <header
        id="home-after-prologue"
        className="w-full px-6 py-5 flex items-center justify-between border-b border-border bg-background/80 sticky top-0 z-20 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2.5">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="Headwaters"
            className="w-7 h-7"
          />
          <span className="font-serif font-bold text-lg text-foreground">Headwaters</span>
        </div>
        <NeighbourhoodBadge zoneId={2} />
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Log in
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="sm">Sign in to access</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="sm">Open the books</Button>
            </Link>
          </SignedIn>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28 max-w-4xl mx-auto w-full">
        <div aria-hidden className="pointer-events-none absolute inset-0 od-topo" style={{ opacity: 0.07 }} />
        <div className="hw-label mb-4">Headwaters Books</div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight" style={{ textWrap: "balance" }}>
          We've always known how to fix it, now we can.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          The working ledger for the Headwaters Food Systems Agency — daily books, community
          labour tracking, reconciliation, and two operational primitives built for the
          network.
        </p>
        <SignedOut>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base">
                Sign in to access
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 h-12 text-base text-muted-foreground"
              >
                View demo
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Access is by invitation — agency staff, food handlers, and board members only.
          </p>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <Button size="lg" className="px-8 h-12 text-base">
              Open the books <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </SignedIn>
      </section>

      {/* Who it's for */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-8">
        <div className="od-trail-rule" aria-hidden />
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {[
            { icon: BookOpen, label: "Agency bookkeepers" },
            { icon: Receipt, label: "Food handlers" },
            { icon: TrendingUp, label: "Ops managers" },
            { icon: FileText, label: "Board" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary/50" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-20">
        <div className="od-trail-rule" aria-hidden />
        <div className="mb-10 text-center">
          <div className="hw-label mb-3">What's inside</div>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
            Five tools, one economy
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Full access requires a sign-in. Here's what agency staff and food handlers work
            with every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURE_CARDS.map((card) => {
            const s = accentStyles[card.accent];
            return (
              <Card
                key={card.label}
                className={`od-card transition-all duration-200 bg-card ${s.border}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-2.5 shrink-0 ${s.icon}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] mb-1 ${s.label}`}>
                        {card.label}
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-foreground leading-snug">
                        {card.heading}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
                  <SignedIn>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {card.links.map((l) => (
                        <Link key={l.href} href={l.href}>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-2 cursor-pointer">
                            {l.label} <ArrowRight className="w-3 h-3" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {card.links.map((l) => (
                        <span
                          key={l.href}
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground/60"
                        >
                          {l.label} <ShieldCheck className="w-3 h-3" />
                        </span>
                      ))}
                    </div>
                  </SignedOut>
                </CardContent>
              </Card>
            );
          })}

          {/* Helping Hands sub-features highlight */}
          <Card className="od-card transition-all duration-200 bg-card/60 border-border/40 md:col-span-2">
            <CardContent className="p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Inside Helping Hands
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: ListTodo, label: "Task board", desc: "Open tasks, assigned, done" },
                  { icon: Wallet, label: "My earnings", desc: "Per-member envelope view" },
                  { icon: Award, label: "Skill directory", desc: "Credentials across the network" },
                  { icon: HandHelping, label: "Partnership portal", desc: "Merchant connections" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <Icon className="w-4 h-4 text-[hsl(14_64%_36%)]" />
                    <div className="text-sm font-medium text-foreground">{label}</div>
                    <div className="text-xs text-muted-foreground leading-snug">{desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Access note */}
        <SignedOut>
          <div className="mt-10 rounded-xl border border-border bg-muted/30 px-6 py-5 flex flex-col sm:flex-row items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-medium text-foreground">Full access requires a sign-in</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                The books are for agency staff, food handlers, and board — not public. If you've
                been added, sign in below.
              </p>
            </div>
            <Link href="/sign-in">
              <Button className="shrink-0 w-full sm:w-auto">Sign in to access</Button>
            </Link>
          </div>
        </SignedOut>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto space-y-2"
        id="home-footer"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/standby">
            <span className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline cursor-pointer">
              The Standby — Z3 pilot dashboard
            </span>
          </Link>
          <span className="text-muted-foreground/40" aria-hidden>·</span>
          <Link href="/gate">
            <span className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline cursor-pointer">
              The Gate — bright-side ↔ the systems ledger
            </span>
          </Link>
          <span className="text-muted-foreground/40" aria-hidden>·</span>
          <Link href="/read">
            <span className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline cursor-pointer">
              Read the draft manuscript
            </span>
          </Link>
        </div>
        <div>&copy; {new Date().getFullYear()} Headwaters Food Systems Agency.</div>
        <div>
          <a
            href="/headwaters-books/privacy"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Privacy policy
          </a>
        </div>
      </footer>
    </div>
  );
}

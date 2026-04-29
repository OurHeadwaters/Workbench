import { Link } from "wouter";
import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { ConfirmedTag } from "@/components/ConfirmedTag";
import { BUCKETS } from "@/data/buckets";
import { money } from "@/lib/format";
import { Salad, Handshake, Cpu, Wallet, GitCompareArrows, ArrowRight, Repeat } from "lucide-react";

export function IndexPage() {
  const { scenario } = useScenario();
  const a = scenario.contracts.agency;

  const buckets = [
    {
      ...BUCKETS.salts,
      href: "/salts",
      icon: Salad,
      headline: money(scenario.salts.pAndL.netCash),
      headlineLabel: "net cash / yr",
      blurb:
        "Parr's Jars salt: 4 channels, $5.50 per-jar cost, 1,190 jars/yr steady state. Sustainable on family hands; shadow labour ~$858/yr would tip the line if it became paid.",
      tag: scenario.salts.pAndL.tag,
    },
    {
      ...BUCKETS.contracts,
      href: "/contracts",
      icon: Handshake,
      headline: money(a.totals18mo.surplusDeployed),
      headlineLabel: "18-mo surplus deployed",
      blurb: `${money(a.fee)}/mo agency engagement over ${a.termMonths} months against the 7-role Deer Lake team. No ongoing owner take from agency surplus — Giving (10% off the top, tithe-first), then capital recovery, then Brightside launch, then Reserve / Innovation.`,
      tag: a.totals18mo.tag,
    },
    {
      ...BUCKETS.brightside,
      href: "/brightside",
      icon: Cpu,
      headline: money(scenario.brightside.surplusDeployment.surplus),
      headlineLabel: "18-mo surplus (50/50 split)",
      blurb:
        "Recreation Therapy SaaS for LTC. Founder builds, founder sells. $28k pre-launch funded by agency surplus. Owner take is the founder's only profit-share line.",
      tag: scenario.brightside.surplusDeployment.tag,
    },
  ];

  return (
    <div className="space-y-8" data-testid="page-index">
      <ProvisionalBanner />

      <header id="index-after-prologue" className="scroll-mt-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Practitioner's Guide
        </p>
        <h1
          className="mt-2 text-3xl sm:text-4xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Three coloured buckets, every dollar locked line by line.
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-3xl leading-relaxed">
          A working source of truth, organized the way the founder thinks: Salts (Parr's Jars),
          Community Contracts (agency engagement), and Software / Hardware / Training (Brightside).
          Every figure carries a "confirmed" tag with the date the founder locked it. V1 (the slides
          deck) stays untouched as a reference; V3 is the locked default operating framework.
        </p>
        <div
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ backgroundColor: scenario.accentSoft, color: scenario.accentInk }}
        >
          Reading: <strong>{scenario.name}</strong> — {scenario.tagline}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {buckets.map((b) => {
          const Icon = b.icon;
          return (
            <Link
              key={b.id}
              href={b.href}
              className="group rounded-xl border border-card-border bg-card p-5 hover:shadow-md transition-shadow flex flex-col"
              style={{ borderTopColor: b.accent, borderTopWidth: "4px" }}
              data-testid={`bucket-card-${b.id}`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-9 w-9 rounded-md grid place-items-center"
                  style={{ backgroundColor: b.accentSoft, color: b.accentInk }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {b.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{b.tagline}</p>
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <p
                  className="text-2xl font-semibold num"
                  style={{ fontFamily: "var(--app-font-serif)", color: b.accentInk }}
                >
                  {b.headline}
                </p>
                <p className="text-xs text-muted-foreground">{b.headlineLabel}</p>
              </div>
              <ConfirmedTag tag={b.tag} className="mt-2" />
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                {b.blurb}
              </p>
              <p
                className="mt-4 text-sm font-medium inline-flex items-center gap-1"
                style={{ color: b.accentInk }}
              >
                Open bucket <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/personal-cash"
          className="rounded-xl border border-card-border bg-card p-5 hover:shadow-md transition-shadow"
          data-testid="card-personal-cash"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-md grid place-items-center bg-muted text-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Personal cash transparency</p>
              <p className="text-xs text-muted-foreground">All sources, 18 months, in one place</p>
            </div>
          </div>
          <p
            className="mt-4 text-2xl font-semibold num"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {money(scenario.personal.total18mo)}
            <span className="text-sm text-muted-foreground font-normal ml-2">
              over 18 mo · ~{money(scenario.personal.perYear)}/yr
            </span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Agency salary + Brightside owner take. Capital Recovery shown separately as debt repayment, NOT income.
          </p>
        </Link>

        <Link
          href="/compare"
          className="rounded-xl border border-card-border bg-card p-5 hover:shadow-md transition-shadow"
          data-testid="card-compare"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-md grid place-items-center bg-muted text-foreground">
              <GitCompareArrows className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Operating framework workspace</p>
              <p className="text-xs text-muted-foreground">
                V3 anchored on the left · alternative realities on tabs to the right
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            V3 is the locked default — same numbers as the rest of the guide. To the right, V4 is
            pre-loaded as the first alternative reality and you can add new ones, edit each row,
            lock what you've decided, and read the Δ-vs-V3 cell live as you talk a turn out.
          </p>
        </Link>
      </section>

      <section>
        <Link
          href="/replication"
          className="block rounded-xl border border-card-border bg-card p-5 hover:shadow-md transition-shadow"
          style={{ borderTopColor: "#3B2A6E", borderTopWidth: "4px" }}
          data-testid="card-replication"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="h-9 w-9 rounded-md grid place-items-center"
              style={{ backgroundColor: "#E6E1F2", color: "#1F1640" }}
            >
              <Repeat className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Replication — taking the engagement to the next community</p>
              <p className="text-xs text-muted-foreground">What travels · what swaps · the positioning narrative</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The model written down: the role roster, the fee → margin formula, the pre-baked
            renegotiation triggers, the year-end value-delivered audit, and the positioning
            narrative — alongside the things that swap per community (capital recovery, local
            stable force, travel cadence, capex). V4 is the worked example.
          </p>
        </Link>
      </section>
    </div>
  );
}

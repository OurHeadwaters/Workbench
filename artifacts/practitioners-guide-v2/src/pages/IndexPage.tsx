import { Link } from "wouter";
import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { ConfirmedTag } from "@/components/ConfirmedTag";
import { BUCKETS } from "@/data/buckets";
import { money } from "@/lib/format";
import { Salad, Handshake, Cpu, Wallet, GitCompareArrows, ArrowRight } from "lucide-react";

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
        "Parr's Jars salt: 4 channels, $5.50 per-jar COGS, 1,190 jars/yr steady state. Sustainable on family hands; shadow labour ~$858/yr would tip the line if it became paid.",
      tag: scenario.salts.pAndL.tag,
    },
    {
      ...BUCKETS.contracts,
      href: "/contracts",
      icon: Handshake,
      headline: money(a.totals18mo.surplusDeployed),
      headlineLabel: "18-mo surplus deployed",
      blurb: `807 CDP grant ($22k receivable, $1.5k cost) and ${money(a.fee)}/mo agency aspiration over ${a.termMonths} months. No ongoing owner take from agency surplus — capital recovery, then Brightside launch, then Reserve / Innovation / Giving.`,
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

      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Practitioner's Guide V2
        </p>
        <h1
          className="mt-2 text-3xl sm:text-4xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Three coloured buckets, every dollar locked line by line.
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-3xl leading-relaxed">
          A working source of truth, organized the way the founder thinks: Salts (Parr's Jars),
          Community Contracts (807 CDP + agency), and Software / Hardware / Training (Brightside).
          Every figure carries a "confirmed" tag with the date the founder locked it. V1 (the slides
          deck) stays untouched as a reference.
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
              <p className="text-sm font-semibold">Compare V2 ↔ V3</p>
              <p className="text-xs text-muted-foreground">
                Same numbers, two realities, side by side
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Salts net, agency surplus, Brightside owner take, personal cash — V2 (full team) vs V3
            (lean team) at a glance, so you can talk out which turn to make.
          </p>
        </Link>
      </section>
    </div>
  );
}

/**
 * IndexPage — Practitioner's Guide dashboard.
 *
 * PROGRESSIVE DISCLOSURE DESIGN RULE (applied here and on every internal page):
 *   - Big, clear bucket headings are ALWAYS visible — never collapsed.
 *   - All operational detail lives inside accordions / dropdowns — collapsed by default.
 *   - Each bucket shows only 1–3 "decision signals" at a glance without expanding:
 *     a status badge, a key number, or a next action.
 *   - NEVER show walls of text or tables at the top level.
 *
 * This rule applies to all internal tools (Practitioner's Guide, Operating Plan,
 * Ship Manifest, Library, Handbook internal views). It does NOT apply to
 * public-facing or client-facing content (Deer Lake deck, handbook public pages).
 *
 * See docs/design/progressive-disclosure.md for the canonical rule reference.
 */

import { Link } from "wouter";
import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { ConfirmedTag } from "@/components/ConfirmedTag";
import { BUCKETS } from "@/data/buckets";
import { money } from "@/lib/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Salad,
  Handshake,
  Cpu,
  Wallet,
  GitCompareArrows,
  ArrowRight,
  Repeat,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Gift,
  ChevronRight,
} from "lucide-react";

// ─── Pipeline status badges ──────────────────────────────────────────────────

function StatusBadge({
  status,
  label,
}: {
  status: "confirmed" | "active" | "next" | "open-action" | "plan-b";
  label: string;
}) {
  const styles: Record<string, string> = {
    confirmed:
      "bg-emerald-50 text-emerald-800 border border-emerald-200",
    active:
      "bg-blue-50 text-blue-800 border border-blue-200",
    next:
      "bg-amber-50 text-amber-800 border border-amber-200",
    "open-action":
      "bg-orange-50 text-orange-800 border border-orange-200",
    "plan-b":
      "bg-slate-100 text-slate-700 border border-slate-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {label}
    </span>
  );
}

// ─── Pipeline card ────────────────────────────────────────────────────────────

function PipelineCard({
  icon: Icon,
  title,
  signal,
  signalLabel,
  badge,
  summary,
  detail,
  accentColor,
  testId,
}: {
  icon: typeof Target;
  title: string;
  signal: string;
  signalLabel: string;
  badge: React.ReactNode;
  summary: string;
  detail: React.ReactNode;
  accentColor: string;
  testId?: string;
}) {
  return (
    <div
      className="rounded-xl border border-card-border bg-card overflow-hidden"
      style={{ borderTopColor: accentColor, borderTopWidth: "4px" }}
      data-testid={testId}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="h-8 w-8 rounded-md grid place-items-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: accentColor + "22", color: accentColor }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold">{title}</p>
              {badge}
            </div>
            <p
              className="text-xl font-semibold num mt-1"
              style={{ fontFamily: "var(--app-font-serif)", color: accentColor }}
            >
              {signal}
              <span className="text-xs font-normal text-muted-foreground ml-1.5">
                {signalLabel}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      </div>
      {detail && (
        <Accordion type="single" collapsible>
          <AccordionItem value="detail" className="border-t border-card-border border-b-0">
            <AccordionTrigger className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
              Show detail
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0">
              {detail}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

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
        "Parr's Jars salt: 4 channels, $5.50 per-jar cost, 1,190 jars/yr steady state. Sustainable on family hands.",
      tag: scenario.salts.pAndL.tag,
    },
    {
      ...BUCKETS.contracts,
      href: "/contracts",
      icon: Handshake,
      headline: money(a.totals18mo.surplusDeployed),
      headlineLabel: `${a.termMonths}-mo surplus deployed`,
      blurb: `${money(a.fee)}/mo agency · ${a.roster.length}-role team · tithe-first waterfall. Capital recovery then Reserve / Innovation.`,
      tag: a.totals18mo.tag,
    },
    {
      ...BUCKETS.brightside,
      href: "/brightside",
      icon: Cpu,
      headline: money(scenario.brightside.surplusDeployment.surplus),
      headlineLabel: "post-tithe surplus (50/50 split)",
      blurb:
        "Recreation Therapy SaaS for LTC. Founder builds, founder sells. Owner take is the founder's only profit-share line.",
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
          A working source of truth organized the way the founder thinks: Salts (Parr's Jars),
          Community Contracts, and Software / Hardware / Training (Brightside). Every figure
          carries a confirmed tag with the date the founder locked it. V6 (hourly subcontract,
          Deer Lake) is the locked default.{" "}
          <Link
            href="/archetypes"
            className="underline hover:text-foreground"
            data-testid="link-archetypes-from-index"
          >
            Archetypes page
          </Link>{" "}
          for the V3 → V4 → V5 → V6 lineage.
        </p>
        <div
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ backgroundColor: scenario.accentSoft, color: scenario.accentInk }}
        >
          Reading: <strong>{scenario.name}</strong> — {scenario.tagline}
        </div>
      </header>

      {/* ============ PIPELINE ============ */}
      <section>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Active Pipeline
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Real numbers locked as of 2026-04-29. Decision signals only — expand each card for detail.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* 807 Portal */}
          <PipelineCard
            icon={CheckCircle2}
            title="807 Portal Development"
            signal="$12,000"
            signalLabel="portal fee (confirmed)"
            badge={<StatusBadge status="confirmed" label="Confirmed" />}
            summary="Majority allocated to development fees. This is confirmed revenue — the bridge that opens the trial window."
            accentColor="#1F5B3F"
            testId="pipeline-807-portal"
            detail={
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">What it is:</strong> 807 Co-op portal
                  development fee. Confirmed revenue item — not a projection.
                </p>
                <p>
                  <strong className="text-foreground">Allocation:</strong> Majority to development
                  fees. Exact split tracked in the contracts ledger.
                </p>
                <p>
                  <strong className="text-foreground">Role in the waterfall:</strong> This is the
                  bridge revenue that opens the 6-week trial window toward the $25k target.
                </p>
              </div>
            }
          />

          {/* $25k Trial Target */}
          <PipelineCard
            icon={Target}
            title="Trial Target"
            signal="$25,000"
            signalLabel="in the next 6 weeks"
            badge={<StatusBadge status="active" label="Active pursuit" />}
            summary="6-week window to hit $25k — the bridge to Deer Lake store distribution. Primary client is Deer Lake."
            accentColor="#1A5FA8"
            testId="pipeline-trial-target"
            detail={
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Target:</strong> $25,000 confirmed in the
                  next 6 weeks.
                </p>
                <p>
                  <strong className="text-foreground">Primary client:</strong> Deer Lake. Store
                  distribution is the next phase if this trial lands.
                </p>
                <p>
                  <strong className="text-foreground">What success unlocks:</strong> Deer Lake
                  store distribution engagement at the full $90k/mo V5 rate.
                </p>
                <p>
                  <strong className="text-foreground">If this doesn't land:</strong> Plan B fires.
                  See the Plan B card below — alternate pilot community search is active, not a
                  fallback hope.
                </p>
              </div>
            }
          />

          {/* Deer Lake Store Distribution */}
          <PipelineCard
            icon={MapPin}
            title="Deer Lake — Store Distribution"
            signal="Next phase"
            signalLabel="if trial lands"
            badge={<StatusBadge status="next" label="Gated on trial" />}
            summary="Hourly subcontract: Bobbie $150/hr + Tyler $70/hr RFF sub, 160 hr/mo each. $35,200/mo total billed. Unlocks when the $25k trial target closes."
            accentColor="#7A4E2D"
            testId="pipeline-deer-lake"
            detail={
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Engagement shape:</strong> Bobbie{" "}
                  {a.roster[0].monthlyLoaded > 0 ? `${money(a.roster[0].monthlyLoaded)}/mo net draw` : ""} (160 hr × $150 billed, $80 net) +
                  Tyler {money(a.roster[1]?.monthlyLoaded ?? 11200)}/mo sub (160 hr × $70 pass-through).
                  Total billed: {money(a.fee)}/mo. Monthly surplus: {money(a.monthlySurplusJunAug)}.
                </p>
                <p>
                  <strong className="text-foreground">Gate condition:</strong> $25k trial target
                  closes within the 6-week window.
                </p>
                <p>
                  <strong className="text-foreground">Start date target:</strong> {a.startDate}.
                </p>
                <p>
                  <strong className="text-foreground">Buyer:</strong> {a.buyerStatus}. Affects
                  political weight, not the math.
                </p>
                <Link
                  href="/contracts"
                  className="inline-flex items-center gap-1 text-xs font-medium underline hover:text-foreground mt-1"
                >
                  Full V5 contracts detail <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            }
          />

          {/* 807 Grants — Benefits Plan (Action Item) */}
          <PipelineCard
            icon={Gift}
            title="807 Grants → Benefits Plan Build-out"
            signal="Open action"
            signalLabel="practitioner owns this"
            badge={<StatusBadge status="open-action" label="Action item" />}
            summary="Get 807 to apply for grants to fund a benefits plan build-out. Owner: practitioner. Status: open. Log the grant name here once identified."
            accentColor="#7A2E12"
            testId="pipeline-807-grants"
            detail={
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Action:</strong> Practitioner to facilitate
                  807 Co-op applying for grants that would fund a benefits plan build-out for the
                  team. This is not a future hope — it is a named, open action item the
                  practitioner owns.
                </p>
                <p>
                  <strong className="text-foreground">Owner:</strong> Practitioner (you).
                </p>
                <p>
                  <strong className="text-foreground">Status:</strong> Open — not yet submitted.
                </p>
                <p>
                  <strong className="text-foreground">Next step:</strong> Identify the grant
                  program (LFIF, FedNor CEDP, or equivalent benefits-plan stream) and log it here.
                  The 807 Co-op board must be the proponent.
                </p>
                <p>
                  <strong className="text-foreground">Why here:</strong> A team benefits plan is a
                  named bucket in the V5 operating plan (team incentives, visible-but-TBD line on
                  the Contracts page). Getting 807 to fund it via grants removes the cost from the
                  agency fee waterfall entirely.
                </p>
              </div>
            }
          />
        </div>
      </section>

      {/* ============ PLAN B ============ */}
      <section>
        <div
          className="rounded-xl border border-card-border bg-card overflow-hidden"
          style={{ borderTopColor: "#64748B", borderTopWidth: "4px" }}
          data-testid="bucket-plan-b"
        >
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-md grid place-items-center flex-shrink-0 bg-slate-100 text-slate-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">Plan B — Alternate Pilot Clients</p>
                  <StatusBadge status="plan-b" label="Contingency" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  If Deer Lake doesn't materialize, actively search for alternate pilot community
                  clients. This is a named, visible bucket — not a footnote. The trigger is clear,
                  the outreach list is built, and the reframed pitch is ready.
                </p>
              </div>
            </div>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="planb" className="border-t border-card-border border-b-0">
              <AccordionTrigger className="px-5 py-2 text-xs text-muted-foreground hover:text-foreground">
                Trigger conditions, outreach circles, and the reframed pitch
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pt-0">
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">When Plan B fires</p>
                    <ul className="space-y-1 text-muted-foreground list-disc pl-4">
                      <li>
                        <strong className="text-foreground">Hard no:</strong> Council passes a BCR
                        (or written notice) declining the hourly engagement ($35,200/mo billed) or
                        the $25k trial. Act same day.
                      </li>
                      <li>
                        <strong className="text-foreground">Stall past soft date:</strong> No BCR,
                        no signed contract, no scheduled council date by 2026-06-15. Send a
                        one-paragraph "pivoting capacity" note and begin IFNA-cluster outreach
                        without waiting for a reply.
                      </li>
                      <li>
                        <strong className="text-foreground">Hard deadline:</strong> 2026-07-31.
                        Non-negotiable in the runway model. If no contract, move all team capacity
                        to Plan B outreach.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      Outreach order (warmest first)
                    </p>
                    <ol className="space-y-1 text-muted-foreground list-decimal pl-4">
                      <li>IFNA cluster — same corridor, same freight, closest operational delta</li>
                      <li>Shibogama, Windigo, Keewaytinook Okimakanak — warm-mid tribal councils</li>
                      <li>NAN economic development — corridor-wide pitch venue</li>
                      <li>SLFNHA — health-authority lens on food access</li>
                      <li>Treaty 3 / Dryden-area bands — geographically closest, coldest start</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">The reframed pitch</p>
                    <p className="text-muted-foreground leading-relaxed">
                      "Store-in-a-box for any small northern community." Same freight corridor,
                      same POS, same back-office. The community gets: a working store on a corridor
                      that already moves food; a procurement dashboard the council can read;
                      household-level pricing visible to members; a paid trial for the local hire.
                      Full pricing is public — nothing the council can't see before signing.
                    </p>
                  </div>
                  <Link
                    href="/replication"
                    className="inline-flex items-center gap-1 text-xs font-medium underline hover:text-foreground"
                  >
                    Replication page — the full model <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* ============ THREE BUCKETS ============ */}
      <section>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          The Three Buckets
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Every dollar accounted for. Click into a bucket for the full locked ledger.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <p className="text-sm font-semibold text-foreground truncate">{b.name}</p>
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
                  Open bucket{" "}
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============ UTILITIES ============ */}
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
              <p className="text-xs text-muted-foreground">All sources, engagement window, in one place</p>
            </div>
          </div>
          <p
            className="mt-4 text-2xl font-semibold num"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {money(scenario.personal.total18mo)}
            <span className="text-sm text-muted-foreground font-normal ml-2">
              over {a.termMonths} mo · ~{money(scenario.personal.perYear)}/yr
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
                V3 anchored · alternative realities on tabs
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            V3 is the workspace anchor. V4 (right-priced) is pre-loaded as the first alternative
            reality — edit rows, lock decisions, read the Δ-vs-V3 cell live. V5 (Codetry archetype)
            is the published default.
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
              <p className="text-sm font-semibold">
                Replication — taking the engagement to the next community
              </p>
              <p className="text-xs text-muted-foreground">
                What travels · what swaps · the positioning narrative
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The model written down: the role roster, the fee → margin formula, the pre-baked
            renegotiation triggers, the year-end value-delivered audit, and the positioning
            narrative — alongside the things that swap per community. V5 (Deer Lake, Codetry
            archetype) is the worked example.
          </p>
        </Link>
      </section>
    </div>
  );
}

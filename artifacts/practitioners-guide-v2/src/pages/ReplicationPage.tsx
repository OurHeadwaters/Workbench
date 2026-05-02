/**
 * ReplicationPage — names the engagement model so it can be carried to a
 * second community without rebuilding the proposal each time.
 *
 * PROGRESSIVE DISCLOSURE PATTERN (see docs/design/progressive-disclosure.md):
 *   - Page heading + Travels / Swaps two-column grid: always visible.
 *     These are the decision signals — the buyer conversation in two columns.
 *   - Positioning narrative, literate-programming framing, operating rhythm,
 *     how-to-use instructions: collapsed by default (detail on demand).
 *   - The Plan B trigger section (from the Index page) is also summarised on
 *     this page as a collapsed section — same content, different home.
 */

import { useScenario } from "@/lib/scenario";
import { ConfirmedTag } from "@/components/ConfirmedTag";
import { money, pct } from "@/lib/format";
import { confirmed } from "@/data/tags";
import {
  Compass,
  Repeat,
  Settings2,
  Quote,
  ArrowRight,
  BookOpen,
  Clock,
  ScrollText,
} from "lucide-react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ReplicationPage() {
  const { scenario, scenarioId, setScenarioId } = useScenario();
  const a = scenario.contracts.agency;
  const accent = scenario.accent;
  const accentSoft = scenario.accentSoft;
  const accentInk = scenario.accentInk;

  const operatingMarginPct = ((a.fee - a.costBasisSepOnward) / a.fee) * 100;

  return (
    <div className="space-y-6" data-testid="page-replication">
      <header className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
          style={{ backgroundColor: accentSoft, color: accentInk }}
        >
          <Repeat className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Replication
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            The same engagement, in another community.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            The shape of the engagement travels. The community-specific levers
            swap. Two columns below name both — with the active scenario as the worked
            example so the model is read off real numbers, not abstractions.
            Expand the sections below for the full positioning narrative, operating rhythm,
            and how-to-use guide.
          </p>
          <div
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: accentSoft, color: accentInk }}
          >
            Worked example: <strong>{scenario.name}</strong> — {scenario.tagline}
            {scenarioId !== "v4" ? (
              <button
                type="button"
                onClick={() => setScenarioId("v4")}
                className="ml-2 underline opacity-80 hover:opacity-100"
                data-testid="replication-switch-to-v4"
              >
                switch to V4
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* ── TRAVELS / SWAPS — always visible ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* TRAVELS */}
        <div
          className="rounded-xl border bg-card p-5"
          style={{ borderTopColor: accent, borderTopWidth: "4px", borderColor: "hsl(var(--card-border))" }}
          data-testid="replication-travels-card"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="h-9 w-9 rounded-md grid place-items-center"
              style={{ backgroundColor: accentSoft, color: accentInk }}
            >
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Travels across communities</p>
              <p className="text-xs text-muted-foreground">Same shape every time</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            <TravelItem
              title={`The ${a.roster.length}-role roster shape`}
              body={`${a.roster.map((r) => r.role).join(", ")}. ${money(a.payrollTotal)}/mo loaded payroll in the worked example. Roles are the same; loaded rates flex with the labour market in the new community.`}
            />
            <TravelItem
              title="Two-person operator couple on the cockpit, on the buyer's books"
              body="Underneath the Codetry roster above, sitting on the buyer's payroll: a two-person operator couple — brought in and paid by the contractor, same setup as a band's hotel — running Square at the till, QuickBooks on the books, Local Line for producers, the Headwaters cockpit tying them together. The couple changes per community; the shape (two operators + that software stack) does not. It's what keeps the cost-plus-35% structure small enough to fit inside a buyer's world."
            />
            <TravelItem
              title="Fee → margin formula"
              body={`Fee is set so the post-Sep operating margin (pre-tithe) lands at 35–40% against the same roster. In the worked example: ${money(a.fee)}/mo fee against ${money(a.costBasisSepOnward)}/mo cost basis = ${pct(operatingMarginPct, 1)} margin. The tithe (10% off the top) is a separate discipline above the surplus waterfall.`}
            />
            <TravelItem
              title="Three-phase surplus deployment"
              body="Practitioner tithe (10% of draw, first claim on drawings) first — this is personal, not a revenue deduction. Capital recovery second. Launch one tool that pays for itself third. Reserve / Innovation (75/25) fourth. Order is non-negotiable — Giving is what you decided, not what was left, and the discipline is what makes the war chest real."
            />
            <TravelItem
              title="Pre-baked renegotiation triggers"
              body={`Step changes are named at signing, not invented later. In the worked example: ${a.renegotiationTriggers.length} triggers describe how fee and lead draw step at month 12 / month 18 once Brightside-equivalent tooling and the value-delivered audit land.`}
            />
            <TravelItem
              title="Year-end value-delivered audit"
              body="Bookkeeper-runnable template (Task #33). Compares 18-month markup against named outcomes for the buyer. Triggers fire from this audit's signed report, not from vibes."
            />
            <TravelItem
              title="Positioning narrative"
              body={`"You're paying me for the team you don't have to hire, and for the fact that I'll name things in a way that removes work instead of adding it." Verbatim, every conversation.`}
            />
          </ul>
        </div>

        {/* SWAPS */}
        <div
          className="rounded-xl border bg-card p-5"
          style={{ borderTopColor: accent, borderTopWidth: "4px", borderColor: "hsl(var(--card-border))" }}
          data-testid="replication-swaps-card"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="h-9 w-9 rounded-md grid place-items-center"
              style={{ backgroundColor: accentSoft, color: accentInk }}
            >
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Swap per community</p>
              <p className="text-xs text-muted-foreground">Bespoke each time</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            <SwapItem
              title="Community name + buyer"
              workedExample={`Deer Lake First Nation; buyer is ${a.buyerStatus}.`}
              swapNote="In Pilot #2: replace with the new community's name and the political weight of the buyer (band council, regional service org, contractor's CFO)."
            />
            <SwapItem
              title="Capital-recovery amount"
              workedExample={`${money(a.capitalRecoveryAmount)} — ${a.capitalRecoveryDescription}`}
              swapNote="Pilot #2 has its own debt stack (or none). Recompute: months at the locked surplus to retire it. Shifts the Brightside-equivalent launch month if recovery slips past August."
            />
            <SwapItem
              title="The local stable force the engagement designs around"
              workedExample="Headwaters' aggregation hub at Dad's warehouse + Parr's Jars salt cadence — the engagement designs the contract around what's already running, not against it."
              swapNote="In a regen-ag chokepoint engagement: the storage facility, the co-op, the existing distribution leg. In an Indigenous-services contract: the band's existing program staff and the room they already hold."
            />
            <SwapItem
              title="Travel cadence + per-diem"
              workedExample="Practitioner visits ~3 days/mo; flight + lodging + per diem still TBD on this engagement."
              swapNote="Drive vs fly, hotel vs billet, week-long sprints vs day visits. Locks against the buyer's distance and the lead's domestic constraints."
            />
            <SwapItem
              title="Capex line items"
              workedExample="Aggregation hub rent, tooling / SaaS, recurring tech ops, life supports. ~$10k–$12k/mo overhead in the worked example."
              swapNote="Pilot #2 may share some line items (SaaS) and not others (no aggregation hub if there's no salt). Re-cost from the local labour and rent market."
            />
            <SwapItem
              title="Tool-that-pays-for-itself (Phase 2 launch)"
              workedExample="Brightside RT-LTC SaaS — $28k pre-launch, $120k 18-mo revenue target."
              swapNote='Different community, different tool. The shape — "one thing the founder builds and sells alongside the agency engagement, funded by the agency surplus in a single concentrated month" — stays. The product itself is bespoke per founder × community pair.'
            />
          </ul>
        </div>
      </section>

      {/* ── Confirmation tag ── */}
      <div
        className="rounded-lg border px-4 py-3 text-xs"
        style={{ borderColor: accent, backgroundColor: accentSoft, color: accentInk }}
      >
        <ConfirmedTag tag={confirmed("Replication model locked alongside V4.")} className="mr-2" />
        The replication chapter is the model written down — it does not introduce a new sales site or pricing calculator. Per-community parameter calculators live in the operating-plan slides.
      </div>

      {/* ── Detail sections — collapsed by default ── */}
      <Accordion type="multiple" className="space-y-3">

        {/* Positioning narrative */}
        <AccordionItem
          value="positioning"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-start gap-3 text-left">
              <Quote className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <div>
                <span className="font-semibold text-sm">Positioning — why the price is the price</span>
                <span className="text-xs text-muted-foreground ml-2">Read verbatim before any number is named</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-5 pt-0">
            <div
              className="text-base leading-relaxed"
              style={{ fontFamily: "var(--app-font-serif)", color: "hsl(var(--foreground))" }}
            >
              <p>
                You're paying me for the team you don't have to hire, and for the
                fact that I'll name things in a way that <em>removes</em> work
                instead of adding it.
              </p>
              <p className="mt-3">
                Three things land at the same time here: community-development
                training, an instinct to design around the stable forces in a
                place, and literate-programming tools that let one person hold a
                system the way ten used to.
              </p>
              <p className="mt-3">
                That intersection is rare, and the price reflects it.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Said plainly: it's a 35–40% operating margin (pre-tithe) against a{" "}
                {a.roster.length}-role team I run end to end — 10% off the top
                goes to Giving (tithe-first, before anything else), the rest is
                recovered capital, one tool that pays for itself, and a Reserve /
                Innovation split the value-delivered audit defends each year.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                And underneath that team, on the buyer's books: a two-person
                operator couple — Sam &amp; Jess on the cockpit — sitting on
                Square at the till, QuickBooks on the books, Local Line for
                producers, the Headwaters cockpit tying them together. That's
                what keeps the buyer's payroll line small enough that this
                cost-plus-35% structure actually fits inside their world.
              </p>
            </div>
            <ConfirmedTag
              tag={confirmed("Locked positioning narrative — drafted with the founder, kept under five sentences so it fits in any conversation.")}
              className="mt-3"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Literate programming */}
        <AccordionItem
          value="literate-programming"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-start gap-3 text-left">
              <BookOpen className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <div>
                <span className="font-semibold text-sm">
                  Literate programming is back — and Codetry is what closes the gap
                </span>
                <span className="text-xs text-muted-foreground ml-2">3 challenges, 1 human-shaped answer</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-5 pt-0">
            <div
              className="flex-1 min-w-0 space-y-5 text-base leading-relaxed"
              style={{ fontFamily: "var(--app-font-serif)", color: "hsl(var(--foreground))" }}
            >
              <p>
                Literate programming is back — modern tools let one person hold
                a system the way ten used to — and AI codegen has made
                fluent-looking code cheap, which quietly moved the bottleneck
                from typing to judgment.
              </p>

              <div className="space-y-4">
                <Challenge
                  n="01"
                  title="Judgment doesn't go away — it relocates."
                  body="The tools wrote the boilerplate. They didn't decide what to build, what to call it, what to leave out, or what to refuse. Prompt engineering, validation, and architecture are still human work, and they're harder now because the output looks polished even when it's wrong. The practitioner is the one carrying that judgment — paid by name to make the calls, not just the keystrokes."
                  accentInk={accentInk}
                  accentSoft={accentSoft}
                />
                <Challenge
                  n="02"
                  title="Fluent isn't the same as legible."
                  body="Ship enough generated code without owning it and you end up with a system nobody — including the author — can read. The practitioner's deliverable can't be that. It has to be legible to the band council, the contractor's CFO, and the next practitioner who picks it up. That readership is a forcing function: if the band can't follow what the system does and what it cost, it isn't done."
                  accentInk={accentInk}
                  accentSoft={accentSoft}
                />
                <Challenge
                  n="03"
                  title="Not every project needs this depth."
                  body="A weekend script doesn't need a literate-programming practice around it; an 18-month engagement that touches a community's food system does. Contract size, defined scope, and the year-end value-delivered audit are what keep the depth proportional to the stakes. Small jobs stay small. The practitioner model only shows up where the legibility is worth paying for."
                  accentInk={accentInk}
                  accentSoft={accentSoft}
                />
              </div>

              <p
                className="text-sm text-muted-foreground border-t pt-4"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <strong className="text-foreground">Honest caveat:</strong>{" "}
                Codetry doesn't <em>solve</em> the judgment problem. It
                relocates it onto a named, accountable, paid person — which is
                the version of the problem a band council, a contractor, and a
                bookkeeper can actually act on.
              </p>
            </div>
            <ConfirmedTag
              tag={confirmed("Framing locked April 2026 — three challenges named, with the practitioner as the human-shaped answer to each.")}
              className="mt-3"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Operating rhythm */}
        <AccordionItem
          value="operating-rhythm"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-start gap-3 text-left">
              <Clock className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <div>
                <span className="font-semibold text-sm">Operating rhythm — when to start the next conversation</span>
                <span className="text-xs text-muted-foreground ml-2">
                  Day-1 open → Day-90 trigger → Day-180 Pilot #2 signed
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-5 pt-0">
            <div className="space-y-5">
              <p className="text-xs text-muted-foreground">
                Day-90 audited proof point is the trigger that opens Pilot #2 outbound — not a
                hypothesis. Mirrors the SellTimingOutbound slide in the Practitioner Operating Plan
                deck and the Day-1/90/180 milestone strip on the Deer Lake Store deck.
              </p>
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
                data-testid="operating-rhythm-timeline"
              >
                <Milestone
                  label="Day-1"
                  kicker="Open"
                  body="Deer Lake store opens. Working POS, working freight lane, working transparency stack — the system is running before any second-reserve conversation begins."
                  accentInk={accentInk}
                  accentSoft={accentSoft}
                />
                <Milestone
                  label="Day-90"
                  kicker="Trigger fires"
                  body="First audited value-delivered number, signed by the band's bookkeeper. Reference call ready. This is the trigger that opens outbound to a 3–5 named-prospect bench — not before, not later."
                  accentInk={accentInk}
                  accentSoft={accentSoft}
                  isTrigger
                />
                <Milestone
                  label="Day-180"
                  kicker="Pilot #2 signed"
                  body="Pilot #2 lands as a paid engagement, not a written deliverable that preceded the sale. The case study writes itself out of the work — the way Deer Lake did."
                  accentInk={accentInk}
                  accentSoft={accentSoft}
                />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Three ways this rhythm can break — name them out loud
                </p>
                <ul className="space-y-3 text-sm" data-testid="operating-rhythm-failures">
                  <FailureMode
                    letter="A"
                    title="Selling before the proof point."
                    body="Outbound that opens before Day-90 has nothing to point at except a thesis. The receiving band hears a pitch, not a precedent — the V2 mistake, replayed."
                    accentInk={accentInk}
                    accentSoft={accentSoft}
                  />
                  <FailureMode
                    letter="B"
                    title="Waiting for Pilot #2 to finish writing."
                    body="Treating Pilot #2 as a written deliverable that has to land before the sale inverts the order. Pilot #2 is the sale. The case study comes out of the paid engagement, not in front of it."
                    accentInk={accentInk}
                    accentSoft={accentSoft}
                  />
                  <FailureMode
                    letter="C"
                    title="Tinkering without a buyer in the loop."
                    body="Open-ended polishing of the system between Day-90 and an undated Pilot #2 burns the trigger. If outbound isn't named on Day-90, the audit becomes décor instead of a sales asset."
                    accentInk={accentInk}
                    accentSoft={accentSoft}
                  />
                </ul>
              </div>

              <p
                className="text-xs text-muted-foreground border-t pt-4"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <strong className="text-foreground">Queued, not authored here:</strong>{" "}
                the named-prospect list, the Day-90 audit template, and the outreach kit
                are tracked as their own work. This callout is the timing call — the
                assets are downstream of it. Building any of those <em>before</em> Day-90
                would invert the failure modes above.
              </p>
            </div>
            <ConfirmedTag
              tag={confirmed("Sell-timing call locked April 2026 — Day-90 audited proof point is the trigger.")}
              className="mt-3"
            />
          </AccordionContent>
        </AccordionItem>

        {/* How to use this page */}
        <AccordionItem
          value="how-to-use"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: accent, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-semibold text-sm">How to use this page in a Pilot #2 conversation</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-5 pt-0">
            <ol className="list-decimal pl-5 text-sm space-y-2 text-muted-foreground">
              <li>
                Open this page <strong>with V4 active</strong> on the toggle. The
                worked example reads cleanly off the page so you don't have to
                paraphrase numbers from memory.
              </li>
              <li>
                Walk the buyer through the <strong>"Travels"</strong> column first
                — the shape they're buying. This is the same conversation every
                time.
              </li>
              <li>
                Then walk through the <strong>"Swap per community"</strong> column
                and fill each swap in front of them, on a notepad. The conversation
                is bespoke, not the engagement.
              </li>
              <li>
                Read the <strong>positioning narrative</strong> verbatim before any
                money is named. The price is then a deduction from a position, not
                a number to argue down.
              </li>
              <li>
                Close on the renegotiation triggers — they prove the engagement is
                designed to pay more later if it earns more later, which is what
                buyers want to hear about an 18-month commitment.
              </li>
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">
              Companion artifacts:{" "}
              <Link href="/contracts" className="underline hover:text-foreground" data-testid="link-contracts-from-replication">
                Contracts page <ArrowRight className="inline h-3 w-3" />
              </Link>{" "}
              and{" "}
              <Link href="/compare" className="underline hover:text-foreground" data-testid="link-compare-from-replication">
                Operating framework workspace <ArrowRight className="inline h-3 w-3" />
              </Link>.
            </p>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* ── Next page link ── */}
      <Link
        href="/codetry"
        className="block rounded-lg border border-card-border bg-card hover:shadow-md transition-shadow p-4"
        style={{ borderTopColor: "#3B2A6E", borderTopWidth: "4px" }}
        data-testid="replication-next-codetry"
      >
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-md grid place-items-center flex-shrink-0"
            style={{ backgroundColor: "#E6E1F2", color: "#1F1640" }}
          >
            <ScrollText className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Next
            </p>
            <p className="text-sm font-semibold text-foreground mt-0.5">
              How this guide is named — the codetry test, the drift map, and the audit's worked examples
            </p>
          </div>
          <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        </div>
      </Link>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Challenge({
  n,
  title,
  body,
  accentInk,
  accentSoft,
}: {
  n: string;
  title: string;
  body: string;
  accentInk: string;
  accentSoft: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 inline-flex h-7 w-9 items-center justify-center rounded-md text-xs font-semibold tracking-wider flex-shrink-0"
        style={{ backgroundColor: accentSoft, color: accentInk }}
        aria-hidden
      >
        {n}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-base font-semibold text-foreground"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          {title}
        </p>
        <p className="mt-1 text-[0.95rem] text-muted-foreground leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}

function Milestone({
  label,
  kicker,
  body,
  accentInk,
  accentSoft,
  isTrigger,
}: {
  label: string;
  kicker: string;
  body: string;
  accentInk: string;
  accentSoft: string;
  isTrigger?: boolean;
}) {
  return (
    <div
      className="rounded-md border p-3"
      style={{
        borderColor: isTrigger ? accentInk : "hsl(var(--card-border))",
        borderTopWidth: isTrigger ? "3px" : "1px",
        backgroundColor: isTrigger ? accentSoft : "hsl(var(--card))",
      }}
    >
      <div className="flex items-baseline justify-between mb-1">
        <p
          className="text-base font-semibold text-foreground"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          {label}
        </p>
        <span
          className="text-[0.65rem] uppercase tracking-wider font-medium"
          style={{ color: isTrigger ? accentInk : "hsl(var(--muted-foreground))" }}
        >
          {kicker}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function FailureMode({
  letter,
  title,
  body,
  accentInk,
  accentSoft,
}: {
  letter: string;
  title: string;
  body: string;
  accentInk: string;
  accentSoft: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold flex-shrink-0"
        style={{ backgroundColor: accentSoft, color: accentInk }}
        aria-hidden
      >
        {letter}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-muted-foreground mt-0.5 leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

function TravelItem({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex gap-2.5">
      <span
        className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 flex-shrink-0"
        aria-hidden
      />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-muted-foreground mt-0.5">{body}</p>
      </div>
    </li>
  );
}

function SwapItem({
  title,
  workedExample,
  swapNote,
}: {
  title: string;
  workedExample: string;
  swapNote: string;
}) {
  return (
    <li className="rounded-md border border-card-border bg-card/60 p-3">
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">
        Worked example
      </p>
      <p className="text-muted-foreground mt-0.5">{workedExample}</p>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">
        Swap per community
      </p>
      <p className="text-muted-foreground mt-0.5">{swapNote}</p>
    </li>
  );
}

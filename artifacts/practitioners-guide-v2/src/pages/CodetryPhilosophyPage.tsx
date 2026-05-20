/**
 * CodetryPhilosophyPage — the founding document.
 *
 * Covers:
 *   1. Codetry is architecture (the first-order claim)
 *   2. The community practitioner lens (who it's for and why)
 *   3. Literate programming — resonance and divergence (the Knuth section)
 *   4. Kitchen table talk (the methodology)
 *   5. The controlled burn (error transparency as philosophy)
 *   6. The two-register principle (formal + informal, always both)
 *
 * The page is itself written in the Codetry two-register format:
 * each section states the formal claim, then restates it in kitchen table language.
 */

import { Link } from "wouter";
import {
  Flame,
  ArrowLeft,
  ArrowRight,
  Users,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  Layers,
  ScrollText,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ACCENT = "#7A3E1A";
const ACCENT_SOFT = "#FDF3E8";
const ACCENT_INK = "#4A1F08";

// ─── Shared pull-quote block ──────────────────────────────────────────────────

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-md border-l-4 px-4 py-3 text-base leading-relaxed"
      style={{
        borderLeftColor: ACCENT,
        backgroundColor: ACCENT_SOFT,
        color: ACCENT_INK,
        fontFamily: "var(--app-font-serif)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Kitchen table register ───────────────────────────────────────────────────

function KitchenTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed px-4 py-3 space-y-1" style={{ borderColor: ACCENT + "60" }}>
      <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: ACCENT }}>
        Kitchen table
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed italic">
        {children}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CodetryPhilosophyPage() {
  return (
    <div className="space-y-6" data-testid="page-codetry-philosophy">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      {/* ── Page header ── */}
      <header className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
          style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
        >
          <Flame className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Codetry — the founding document
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Codetry is architecture.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            A discipline for building legible operating systems with and for community groups —
            not a variant of existing practice, but a method that grew from a different root.
            Proven on reserves and in northern communities. Built to replicate in any decentralized community where the same conditions hold.
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
          >
            Reading: the philosophy behind the naming discipline and the handbook
          </div>
        </div>
      </header>

      {/* ── Sections ── */}
      <Accordion type="multiple" defaultValue={["architecture"]} className="space-y-3">

        {/* 1. Codetry is architecture */}
        <AccordionItem
          value="architecture"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-architecture"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <Layers className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">Codetry is architecture</span>
              <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
              >
                The first-order claim
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <PullQuote>
                The names in a system are its architecture. A rename is a re-spec, not a copy edit.
              </PullQuote>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Codetry is not a style guide, a documentation convention, or a naming standard.
                It is a discipline for building operating systems that can be read, maintained,
                and handed over by the people who depend on them — without the original builder
                in the room.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The claim is structural: the names a system uses are the decisions the system
                encodes. Change a name and you change the model. This means that naming is not
                a finishing step — it is a design act, with the same consequences as choosing
                a data structure or a process boundary. Codetry makes that act explicit,
                auditable, and protected.
              </p>
              <KitchenTable>
                Think of it like the wiring in a house. Before the hemcrete goes in, the
                electrician runs conduit. Where the conduit goes is the architecture — not décor.
                Once the walls are up, you don't move the conduit. Codetry names are conduit:
                you decide where they run before you build around them, and then you leave
                them alone unless you're prepared to open the walls.
              </KitchenTable>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Community practitioner lens */}
        <AccordionItem
          value="community-lens"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-community-lens"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <Users className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">The community practitioner lens</span>
              <span className="text-xs text-muted-foreground">Who Codetry is for and why that changes everything</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Codetry emerged from the practice of building operational software for community
                enterprises — food hubs, co-operatives, Indigenous economic development bodies,
                community stores. The work was built and tested on reserves and in northern
                communities: that is the origin and the ongoing priority. The discipline
                itself is geography-agnostic — it travels to any decentralized community
                that inherits and operates systems that were never designed for it.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The software assumes an HR department. The accounting assumes a CFO. The dashboard
                assumes someone who knows what a KPI is. None of these assumptions hold at a band
                council table, a market vendor's booth, or a volunteer-run cooperative board meeting.
                Codetry is the overlay — the discipline for building legibility into systems that
                were designed for someone else's organisation.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is the root divergence from every prior discipline in this space. Codetry is
                not improving systems designed for technical practitioners. It is building legibility
                into systems that were designed with the wrong practitioner in mind — and making that
                legibility durable enough to survive a change in personnel, a change in software,
                or a decade of growth.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The design horizon is not a fiscal year. It is not a decade. The Haudenosaunee
                Great Law of Peace names it plainly: every decision carries a consequence for the
                seventh generation — roughly 175 years forward. A community system built on names
                the community owns, in language the community recognises, is the only kind of system
                that has any chance of being readable at that horizon. Codetry is not an ambition
                for permanence. It is a standard of honesty about what the work is actually for.
              </p>
              <KitchenTable>
                Nobody at a band council table is asking for a SaaS dashboard with KPI tiles.
                They're asking: can we see where the money went? Can the next person who sits in
                this chair read what we built? Can we hand this over without losing a year's worth
                of institutional memory — and can the person two generations from now still find
                the thread? Codetry is the answer to that question — written in a language the
                chair recognises, and built to stay legible after the chair has changed hands
                more times than anyone in the room can count.
              </KitchenTable>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Literate programming — the Knuth section */}
        <AccordionItem
          value="literate-programming"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-literate-programming"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <BookOpen className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">Literate programming — the resonance and the divergence</span>
              <span className="text-xs text-muted-foreground">Donald Knuth · 1984</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Donald Knuth's literate programming (1984) proposes that code should be written
                primarily for human readers — weaving formal specification with informal explanation,
                saying things twice: once precisely, once in plain language. The resonance with
                Codetry is real and arrived at independently.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                But the divergence is sharper than the resonance, and naming it clearly matters:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-card-border">
                      <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-4 w-1/3">Dimension</th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-4 w-1/3">Literate programming</th>
                      <th className="text-left text-xs font-medium py-2" style={{ color: ACCENT_INK }}>Codetry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-foreground align-top">Audience</td>
                      <td className="py-3 pr-4 text-muted-foreground align-top">Programmers explaining code to programmers</td>
                      <td className="py-3 align-top" style={{ color: ACCENT_INK }}>Community practitioners: people operating systems that were not designed for them</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-foreground align-top">Informal register</td>
                      <td className="py-3 pr-4 text-muted-foreground align-top">Plain prose — documentation alongside code</td>
                      <td className="py-3 align-top" style={{ color: ACCENT_INK }}>Kitchen table talk — metaphor as a structural tool, not decoration. The metaphor is load-bearing.</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-foreground align-top">Why informal matters</td>
                      <td className="py-3 pr-4 text-muted-foreground align-top">Comprehension: another programmer can understand the intent</td>
                      <td className="py-3 align-top" style={{ color: ACCENT_INK }}>Drift prevention: the shared metaphor is what both parties return to when language starts to blur</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-foreground align-top">Errors</td>
                      <td className="py-3 pr-4 text-muted-foreground align-top">Notes the shame culture. Does not resolve it.</td>
                      <td className="py-3 align-top" style={{ color: ACCENT_INK }}>Makes error transparency a founding principle — the controlled burn is the methodology</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-foreground align-top">The architecture claim</td>
                      <td className="py-3 pr-4 text-muted-foreground align-top">Names what code does</td>
                      <td className="py-3 align-top" style={{ color: ACCENT_INK }}>Names ARE the spec. A rename is a re-spec. The name is the decision.</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-foreground align-top">What it overlays</td>
                      <td className="py-3 pr-4 text-muted-foreground align-top">Systems designed for programmers — improving what fits</td>
                      <td className="py-3 align-top" style={{ color: ACCENT_INK }}>Systems NOT designed for community groups — building legibility into what was built for someone else</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <KitchenTable>
                Knuth is renovating a house that was built for its owner. Codetry is making a
                house liveable for a tenant who inherited it from someone else entirely — with
                none of the original blueprints, and a lease that says they're responsible for
                maintenance. That's a different job. It requires a different discipline.
              </KitchenTable>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Kitchen table talk */}
        <AccordionItem
          value="kitchen-table"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-kitchen-table"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <MessageSquare className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">Kitchen table talk</span>
              <span className="text-xs text-muted-foreground">The methodology · formal to metaphor to anchor</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kitchen table talk is Codetry's working methodology for bridging the formal
                framework and the lived experience of the people who operate it. It is not
                a metaphor for informal conversation — it is a structured practice with a
                specific sequence and a specific purpose.
              </p>
              <PullQuote>
                You start with the formal template — the wiring that has to go in before the
                hemcrete is laid. Then you talk around it like you're at the kitchen table.
              </PullQuote>
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">The protocol</p>
                <ol className="space-y-4">
                  {[
                    {
                      n: "1",
                      head: "Fill in the formal framework",
                      body: "The Codetry framework is the electrician's conduit — the essentials that must be wired in before the walls go up. Scope, roles, decision rights, financial model, what success looks like. This is the formal layer: precise, named, load-bearing.",
                    },
                    {
                      n: "2",
                      head: "Ask questions in kitchen table register",
                      body: "The practitioner (or an AI working with the practitioner) asks questions that would make sense at a kitchen table — conversational, grounded, specific to the person's actual situation. Not a questionnaire. A conversation.",
                    },
                    {
                      n: "3",
                      head: "Respond in metaphor",
                      body: "The practitioner responds in metaphor. Not because metaphor is decorative — because the right metaphor establishes a shared theme that both parties can navigate by. This is the anchor. It is not a summary of the formal layer; it is the compass heading beneath it.",
                    },
                    {
                      n: "4",
                      head: "Reiterate and redirect",
                      body: "The practitioner (or AI) reiterates what has been connected so far: what the formal layer says, what the metaphor reveals, where they align and where there is tension. The practitioner redirects as needed — correcting the model before it hardens.",
                    },
                    {
                      n: "5",
                      head: "Use imagery when lines blur",
                      body: "When communication starts to drift — when the language gets vague, when a noun starts doing two jobs, when the model and the reality begin to separate — return to imagery connected to the metaphor. Not as a reminder. As a compass heading.",
                    },
                    {
                      n: "6",
                      head: "Audit throughout",
                      body: "Codetry audit tools are available at every stage: the drift map, the rename protocol, the codetry test. The audit is not a finishing step. It is a continuous practice, built into the methodology from the first conversation.",
                    },
                  ].map(({ n, head, body }) => (
                    <li key={n} className="flex items-start gap-3">
                      <span
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
                      >
                        {n}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{head}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <KitchenTable>
                You don't start by asking what the system needs to do. You start by asking what
                the land looks like. What grows here. What's been tried before and what burned.
                Once you have that picture, the formal requirements write themselves — because
                now both of you are looking at the same map.
              </KitchenTable>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 5. The controlled burn */}
        <AccordionItem
          value="controlled-burn"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-controlled-burn"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">The controlled burn</span>
              <span className="text-xs text-muted-foreground">Error transparency as founding discipline</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Knuth observed that programmers are afraid to show their errors — that the shame
                culture around visible mistakes forces drift toward "cleaner" territories, producing
                shallow systems that look tidy and break quietly. He named the problem. Codetry
                resolves it.
              </p>
              <PullQuote>
                Watch the mistakes. Watch the burns. The grass that grows after a controlled burn
                is the grass that regenerates the field.
              </PullQuote>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Codetry treats error transparency as a founding principle — not an operational
                inconvenience. Showing what doesn't work, naming it precisely, recording it in
                the audit, making it visible to the next maintainer: this is not a sign of
                shallow code. It is how depth is maintained.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A system that only shows the green parts is a system nobody can maintain. When
                the failure modes are hidden, the next practitioner inherits a lie — a model
                that looks complete and turns out to be built on uninspected root systems.
                The controlled burn discloses the root. It clears the accumulated growth that
                would otherwise feed an uncontrolled fire. It is a practice of care, not of failure.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In practice this means: errors are named, not smoothed over. Tests that fail are
                recorded, not deleted. Drift that is caught is audited, not quietly corrected and
                forgotten. The audit table carries rows that say "this was wrong" alongside rows
                that say "this was considered and kept." Both are data. Both are architecture.
              </p>
              <KitchenTable>
                A prescribed burn looks scary because there's fire. But the people who know
                this land know that the fire is the medicine — it takes out the deadwood, it
                opens the cones, it puts the nutrients back in the soil. The practitioner who
                shows you the errors is not the one who broke the system. They're the one who's
                been tending it.
              </KitchenTable>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 6. The two-register principle */}
        <AccordionItem
          value="two-register"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-two-register"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <ScrollText className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">The two-register principle</span>
              <span className="text-xs text-muted-foreground">Formal then kitchen table · always both</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every Codetry document has two layers. The formal layer states what the system
                does, precisely named, with no ambiguity about what each term carries. The
                kitchen table layer states what it means — in the language of the person
                who operates it, grounded in the metaphor established at the start of the
                working relationship.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The formal layer is what the system runs on. It is the conduit, the spec,
                the architecture. The kitchen table layer is the test of whether the formal
                layer is complete: if you cannot explain the system at a kitchen table — to
                someone who was not in the room when it was built — then the formal layer has
                a gap. The informal explanation does not simplify the system. It reveals where
                the system still has unexplained assumptions.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is the Knuth resonance made explicit: saying things twice is not
                redundancy. It is the discipline of checking that what is written formally is
                actually understood. In Codetry, "understood" means understood by the person
                who will maintain this system in five years, who may not be technical, who may
                not know the original context, but who needs to be able to read what was built
                and explain it to the people who depend on it.
              </p>
              <KitchenTable>
                If you can say it at the kitchen table and it still sounds true, the formal
                layer is solid. If the kitchen table version sounds like a different thing
                than the formal version, one of them is wrong — and it's usually the formal
                version that's drifted.
              </KitchenTable>
              <div
                className="rounded-md border px-4 py-3 text-sm space-y-2"
                style={{ borderColor: ACCENT + "50", backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
              >
                <p className="font-semibold">Where to go next</p>
                <ul className="space-y-1.5 text-[0.9rem]">
                  <li>
                    <Link
                      href="/codetry"
                      className="underline decoration-dotted underline-offset-2 hover:no-underline font-medium"
                      style={{ color: ACCENT_INK }}
                      data-testid="link-to-naming-discipline"
                    >
                      How this guide is named
                    </Link>
                    {" "}— the naming discipline applied to this specific guide: the audit table,
                    drift symptoms, protected names, and worked examples.
                  </li>
                  <li>
                    The kitchen table conversation tool and codetry audit workflow are being
                    built into the handbook as a guided sequence — available from the Companion
                    Tools section on the home screen.
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* ── Footer nav ── */}
      <nav
        className="flex items-center justify-between gap-4 pt-4 border-t border-card-border"
        aria-label="Page navigation"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          data-testid="philosophy-nav-home"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/codetry"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          data-testid="philosophy-nav-discipline"
        >
          How this guide is named
          <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>
    </div>
  );
}

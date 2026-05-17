/**
 * EngagementPricingPage — how Headwaters prices a Codetry community engagement.
 *
 * PROGRESSIVE DISCLOSURE PATTERN (see docs/design/progressive-disclosure.md):
 *   - Key billing signals always visible at top level.
 *   - All methodology detail inside accordions, collapsed by default.
 */

import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";
import { EditableSection } from "@/components/EditableSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ACCENT = "#1F5B3F";
const ACCENT_SOFT = "#DDF0E5";
const ACCENT_INK = "#0F2E20";

export function EngagementPricingPage() {
  return (
    <div className="space-y-6" data-testid="page-engagement-pricing">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      <header>
        <p
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: ACCENT_INK }}
        >
          Engagement pricing · how we build the number
        </p>
        <h1
          className="mt-2 text-3xl font-semibold"
          style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
        >
          Flat-fee phases. No hourly billing. Fees confirmed as scope becomes clear.
        </h1>
        <PageIntro>
          Every Codetry community engagement is priced as a sequence of flat-fee phases. The methodology
          below is the durable logic behind the number — not a calculator, but the thinking that produces
          one. Expand each section for the full rationale.
        </PageIntro>
      </header>

      {/* ── Always-visible signals ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl border bg-card p-4"
          style={{ borderTopColor: ACCENT, borderTopWidth: "4px" }}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Labour rate
          </p>
          <p
            className="mt-1 text-2xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
          >
            $175 / hr
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Lead practitioner · confirmed · CAD excl. HST
          </p>
        </div>

        <div
          className="rounded-xl border bg-card p-4"
          style={{ borderTopColor: ACCENT, borderTopWidth: "4px" }}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Billing structure
          </p>
          <p
            className="mt-1 text-2xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
          >
            Flat fee · per phase
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            No hourly billing to the client — ever
          </p>
        </div>

        <div
          className="rounded-xl border bg-card p-4"
          style={{ borderTopColor: ACCENT, borderTopWidth: "4px" }}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Margin target
          </p>
          <p
            className="mt-1 text-2xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
          >
            35 – 50 %
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Gross margin · fee minus cost-to-deliver
          </p>
        </div>
      </div>

      {/* ── Detail accordions ── */}
      <Accordion type="multiple" className="space-y-3">

        {/* 1 — Rate & billing model */}
        <AccordionItem
          value="rate"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: ACCENT, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Rate &amp; billing model</span>
              <span className="text-xs text-muted-foreground">
                $175/hr labour → flat phase fee · no hourly clock for the client
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <EditableSection id="ep.rate-billing-model" label="Rate & billing model">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>Why flat-fee phases, not hourly billing.</strong> The client's budget
                certainty matters more than the practitioner's hourly flexibility. A flat fee
                for a defined phase gives the community a number they can take to band council
                or a funder — they're not watching a clock. It also protects the practitioner:
                once the scope is clear, there's no incentive to pad hours and no exposure to
                scope creep cutting into margin.
              </p>
              <p>
                <strong>How the rate converts to a phase fee.</strong> The labour component of
                each phase is built from first principles:
              </p>
              <div
                className="rounded-lg p-3 font-mono text-xs leading-loose"
                style={{ background: ACCENT_SOFT, color: ACCENT_INK }}
              >
                Labour cost = (remote months × remote days/month + site visits × days/visit)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× hours/day × $175/hr<br />
                <br />
                Fee = Labour cost + Travel cost + any absorbed subcontractor cost + margin
              </div>
              <p>
                The fee is then rounded to a clean number and confirmed with the client at the
                close of the preceding phase. The client sees a flat number; the practitioner
                holds the model internally.
              </p>
              <p>
                <strong>The no-hourly-billing rule.</strong> The $175/hr rate is the internal
                pricing input — never the invoice line. The invoice always reads &ldquo;[phase name]
                flat fee — [amount].&rdquo; This is a deliberate protection: First Nations communities
                have been burned by consultants billing open-ended hours against unclear scope.
                A flat fee signals that the practitioner has thought the work through and is
                accountable to a number.
              </p>
            </div>
            </EditableSection>
          </AccordionContent>
        </AccordionItem>

        {/* 2 — Phase structure */}
        <AccordionItem
          value="phase-structure"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: ACCENT, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Phase structure</span>
              <span className="text-xs text-muted-foreground">
                Fees confirmed phase-by-phase as scope becomes clear
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <EditableSection id="ep.phase-structure" label="Phase structure">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>Why fees aren't quoted upfront for every phase.</strong> In a multi-year
                community engagement, the honest answer is that you don't know what Phase 3 costs
                until Phase 2 is complete. The store's operating rhythm, staffing stability, and
                supply-chain complexity are unknowns at the start. Quoting a full-engagement price
                upfront would mean inflating the later phases to cover risk you haven't measured yet
                — or being caught below cost when reality lands differently than expected.
              </p>
              <p>
                <strong>What "scope confirmed at end of Phase N" means in practice.</strong> By the
                final weeks of each phase, the practitioner has direct observation of what the next
                phase will require: how many site visits, how much remote support, what staffing
                support is still needed. That's when the next phase fee is proposed and agreed —
                not speculatively, but from evidence.
              </p>
              <p>
                <strong>How this reads to the client.</strong> Phase 1 is always fully priced and
                confirmed upfront — it's the entry point, and the community needs a number to
                approve. Subsequent phases are described by their shape and rationale in the pitch
                deck, without a dollar figure. The conversation about those fees happens after the
                community has seen what the practitioner delivered in Phase 1.
              </p>
              <p>
                <strong>What this requires of the practitioner.</strong> Discipline to hold the
                methodology — not adjust the model to justify a preferred fee, but to let the
                actual days and costs produce the number. The model is the protection; the
                practitioner's job is to not override it.
              </p>
            </div>
            </EditableSection>
          </AccordionContent>
        </AccordionItem>

        {/* 3 — Site visits */}
        <AccordionItem
          value="site-visits"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: ACCENT, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Site visits &amp; travel</span>
              <span className="text-xs text-muted-foreground">
                ~$900/visit default · on-the-ground days billed in the phase fee
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <EditableSection id="ep.site-visits" label="Site visits & travel">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>How visits are counted.</strong> Each site visit is counted as a block:
                the number of days on the ground (typically 2–3 per visit for a remote community).
                Travel days are folded into the visit count — a day of travel is a day the
                practitioner is not available for other work, and the fee reflects that.
              </p>
              <p>
                <strong>Travel cost assumption.</strong> A default of ~$900 per visit covers
                return charter or scheduled air from a regional hub, one night's accommodation
                if needed, and ground transport. This is the planning assumption — actual costs
                are tracked against it. If a phase runs significantly over on travel, that's
                a signal to revisit the visit frequency, not to pass a surprise invoice to the
                community.
              </p>
              <p>
                <strong>How travel feeds into cost-to-deliver.</strong> Travel cost is a direct
                line in the phase cost model alongside labour:
              </p>
              <div
                className="rounded-lg p-3 font-mono text-xs leading-loose"
                style={{ background: ACCENT_SOFT, color: ACCENT_INK }}
              >
                Travel cost = site visits × $900 (default)<br />
                Cost-to-deliver = Labour cost + Travel cost (+ staffing absorption if applicable)
              </div>
              <p>
                <strong>Remote work vs. on-the-ground work.</strong> Most of the day-count in a
                phase is remote — strategy, documentation, sourcing coordination, vendor calls.
                The site visits are reserved for moments where presence matters: store opening
                week, a critical staffing decision, a community presentation. Keeping visits
                purposeful keeps travel costs in line and preserves the practitioner's capacity.
              </p>
            </div>
            </EditableSection>
          </AccordionContent>
        </AccordionItem>

        {/* 4 — Staffing absorption */}
        <AccordionItem
          value="staffing"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: ACCENT, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Staffing absorption</span>
              <span className="text-xs text-muted-foreground">
                IT / bookkeeping contractor · absorbed into the fee · not invoiced separately
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <EditableSection id="ep.staffing-absorption" label="Staffing absorption">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>What the role covers.</strong> In the build phase of a community store
                engagement, there is a class of compliance and infrastructure work that must
                happen but doesn't belong in the lead practitioner's day: domain and password
                management, HST filing, government reporting setup, bookkeeping system
                configuration. This is handled by a part-time subcontractor — roughly 10–12
                hours per month for the first four months of the engagement.
              </p>
              <p>
                <strong>Why it's absorbed, not invoiced separately.</strong> Two reasons. First,
                presenting the community with a separate "administration fee" for work they
                can't easily evaluate creates friction and erodes trust in the fee structure.
                Second, the cost is small and predictable enough (~$3,100 for a standard
                build phase) that it can be absorbed into the phase fee without distorting
                the margin picture. The community pays one flat number; the practitioner
                manages the subcontractor relationship.
              </p>
              <p>
                <strong>What it protects the practitioner from.</strong> Without a clear
                boundary here, the lead practitioner becomes the de facto IT person: fielding
                password reset requests, chasing receipts, running payroll on behalf of the
                community. That work is real, but it's not strategy — and doing it at $175/hr
                is a poor use of either the practitioner's time or the client's money. The
                subcontractor holds that boundary.
              </p>
              <p>
                <strong>How it appears in the cost model.</strong> The staffing cost is added
                to the phase's cost-to-deliver before the fee and margin are calculated.
                It is shown as a distinct line in the internal model so the margin calculation
                is honest — the fee is covering it, and the margin percentage reflects that.
              </p>
            </div>
            </EditableSection>
          </AccordionContent>
        </AccordionItem>

        {/* 5 — Margin & floor */}
        <AccordionItem
          value="margin"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: ACCENT, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Margin &amp; the floor</span>
              <span className="text-xs text-muted-foreground">
                35–50% target · no phase priced below cost · margin is the honest check
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <EditableSection id="ep.margin-floor" label="Margin & the floor">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>How gross margin is calculated.</strong>
              </p>
              <div
                className="rounded-lg p-3 font-mono text-xs leading-loose"
                style={{ background: ACCENT_SOFT, color: ACCENT_INK }}
              >
                Gross margin % = (Fee − Cost-to-deliver) ÷ Fee × 100<br />
                <br />
                Cost-to-deliver = Labour cost + Travel cost + absorbed staffing
              </div>
              <p>
                The margin percentage is not a profit target — it's a check on whether the
                fee makes sense. A phase with a 10% margin means the practitioner is working
                at near-cost; a phase with a 60% margin means the scope estimate was probably
                too thin. The 35–50% band is the range where the fee is honest and the
                practitioner has enough buffer to absorb minor scope drift without going
                under water.
              </p>
              <p>
                <strong>The floor: no phase priced below cost.</strong> This is a hard rule,
                not a target. If the model produces a margin below zero at the floor fee,
                the scope needs to be renegotiated — not the model. Pricing below cost to
                win the work is a solvency problem deferred, not a relationship built.
                The one legitimate exception is a deliberate below-cost entry phase (e.g.
                a short discovery engagement where the practitioner accepts a thin margin
                to establish the relationship), and even then it should be named as such,
                not disguised.
              </p>
              <p>
                <strong>What a healthy margin actually protects.</strong> Overhead that
                doesn't show in the phase model: the time to write the proposal, the
                follow-up calls that don't bill, the admin between phases, the risk that
                one visit runs a day longer than planned. These aren't billable, but they're
                real costs. Margin is what absorbs them without eroding the practitioner's
                draw.
              </p>
              <p>
                <strong>Fee ranges, not point estimates.</strong> The internal model
                produces a fee range (e.g. $52k–$60k) that reflects a conservative scope
                estimate at the floor and a comfortable scope estimate at the ceiling.
                The fee confirmed with the client lands somewhere in that range based on
                the specific context of the engagement. The range is never shared with
                the client — they see one number.
              </p>
            </div>
            </EditableSection>
          </AccordionContent>
        </AccordionItem>

        {/* 6 — Funding pathways */}
        <AccordionItem
          value="funding-pathways"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftColor: ACCENT, borderLeftWidth: "3px" }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-baseline gap-3 text-left">
              <span className="font-semibold text-sm">Funding pathways</span>
              <span className="text-xs text-muted-foreground">
                Rate never changes · many engagements qualify for federal or provincial funding
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <EditableSection id="ep.funding-pathways" label="Funding pathways">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>The rate doesn't change based on who funds it.</strong> Whether a community
                pays at cost, is partially supported by a capacity fund, or qualifies for a federal
                program, the $175/hr rate stays the same. The funding pathway changes what the
                community's net expenditure looks like — it doesn't change the work or the fee.
                The metaphor: "The work doesn't change based on who funds it. The rate is the rate.
                What we do at the start is figure out the best pathway to get there."
              </p>
              <p>
                <strong>Phase 01 as the entry point.</strong> The planning phase is always fully
                priced upfront — from $28,000 — giving the community a confirmed flat number they
                can take to band council or a funder before any further commitment. That number is
                real and bounded. It's the right place to start the funding conversation because the
                scope is defined and the ask is specific.
              </p>
              <p>
                <strong>Federal and provincial programs that commonly apply.</strong> Many community
                store and economic development engagements qualify — fully or partially — through:
              </p>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>
                  <strong>ISC</strong> (Indigenous Services Canada) — community capacity and
                  economic development streams
                </li>
                <li>
                  <strong>FEDNOR</strong> — Northern Ontario economic development funding for
                  community and business infrastructure
                </li>
                <li>
                  <strong>NOHFC</strong> (Northern Ontario Heritage Fund Corporation) — business
                  and community investment programs
                </li>
                <li>
                  Tribal council capacity funds and community-specific program envelopes
                </li>
              </ul>
              <p>
                Finding the right pathway is a shared first conversation — not something the
                practitioner solves alone, and not a prerequisite before the engagement can start.
                If grant timing doesn't align, the engagement still pays for itself at client cost.
              </p>
              <p>
                <strong>Grants are upside, not the baseline.</strong> The engagement is priced to
                make sense without any external funding. When a grant aligns, it reduces the
                community's net expenditure — sometimes dramatically. As proof of what focused
                grant foresight work can return: in 2025, that work converted into{" "}
                <strong>$233,000 in community revenue</strong>. That's not a typical result,
                but it illustrates the leverage when timing and eligibility line up.
              </p>
            </div>
            </EditableSection>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          data-testid="link-back-index"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Index
        </Link>
      </div>
    </div>
  );
}

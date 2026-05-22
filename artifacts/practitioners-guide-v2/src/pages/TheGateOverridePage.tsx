/**
 * TheGateOverridePage — Emergency Override Protocol
 *
 * Defines the higher-friction override path for The Gate's absolute prohibition.
 * Covers:
 *   1. Qualifying conditions (what counts as an emergency)
 *   2. Friction design (broken-glass model — allowed but announcing)
 *   3. Invoker and witness rules
 *   4. Chain record fields (every field recorded at invocation)
 *   5. Unclosed override default (what happens when debrief is never filed)
 *
 * Design note: "out of scope" = digital implementation. This page is the
 * specification — the chain record fields are listed here so they can be
 * implemented in a subsequent task.
 */

import { Link } from "wouter";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  Users,
  FileText,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Fingerprint,
  Hash,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Palette ──────────────────────────────────────────────────────────────────

const A = "#8B1A1A";
const A_SOFT = "#FDF0F0";
const A_INK = "#3D0A0A";
const A_MID = "rgba(139,26,26,0.12)";
const A_BORDER = "rgba(139,26,26,0.25)";

// ─── Local primitives ─────────────────────────────────────────────────────────

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-black uppercase tracking-[0.25em] mb-1"
      style={{ color: A }}
    >
      {children}
    </p>
  );
}

function RuleCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof AlertTriangle;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg border p-4 space-y-2"
      style={{ borderColor: A_BORDER, backgroundColor: A_SOFT }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 flex-shrink-0" style={{ color: A }} />
        <p className="text-xs font-black uppercase tracking-[0.15em]" style={{ color: A_INK }}>
          {label}
        </p>
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground pl-6">
        {children}
      </div>
    </div>
  );
}

function ChainField({
  name,
  type,
  required,
  description,
}: {
  name: string;
  type: string;
  required: boolean;
  description: string;
}) {
  return (
    <div className="flex gap-3 py-2.5 border-b last:border-0" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="flex-shrink-0 mt-0.5">
        {required ? (
          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: A }} />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-muted-foreground/40" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold" style={{ color: A_INK }}>{name}</span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: A_MID, color: A }}
          >
            {type}
          </span>
          {!required && (
            <span className="text-[10px] text-muted-foreground/60 italic">conditional</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-md border-l-4 px-4 py-3 text-sm leading-relaxed"
      style={{
        borderLeftColor: A,
        backgroundColor: A_SOFT,
        color: A_INK,
        fontFamily: "var(--app-font-serif)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TheGateOverridePage() {
  return (
    <div className="space-y-8 max-w-2xl" data-testid="page-the-gate-override">

      {/* Back */}
      <Link
        href="/codetry-philosophy"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-link"
      >
        <ArrowLeft className="h-3 w-3" />
        Codetry — the discipline
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <SectionEyebrow>The Gate · Emergency Override Protocol</SectionEyebrow>
        <h1
          className="text-3xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)", color: A_INK }}
        >
          The rule holds.<br />The override proves it.
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Absolute prohibition becomes dangerous rigidity when fire, medical emergency,
          or neighbour-helping-neighbour situations arise. The override is not an exception
          that dissolves the rule — it is a louder receipt that the rule held. The chain
          records that this was an override, not a crossing.
        </p>
        <div
          className="rounded-md px-4 py-3 text-xs leading-relaxed border"
          style={{ borderColor: A_BORDER, backgroundColor: A_MID, color: A_INK }}
        >
          <span className="font-bold">Scope note.</span>{" "}
          This document specifies the design: qualifying conditions, friction, invoker
          rules, chain record fields, and unclosed-override defaults. Digital implementation
          of the chain record is a separate task.
        </div>
      </header>

      {/* ── Section 1: Qualifying conditions ───────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <SectionEyebrow>Section 1 — Qualifying Conditions</SectionEyebrow>
          <h2 className="text-lg font-semibold" style={{ color: A_INK }}>
            What counts as an emergency
          </h2>
        </div>

        <PullQuote>
          The test: would the person invoking be comfortable reading the reason aloud
          to the community?
        </PullQuote>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Three canonical emergency types qualify. Anything outside these three categories
          is not an emergency — it is a convenience that should travel the normal path,
          or a gap in the normal path that should be repaired.
        </p>

        <Accordion type="multiple" className="space-y-2">
          <AccordionItem value="fire" className="rounded-lg border overflow-hidden" style={{ borderColor: A_BORDER }}>
            <AccordionTrigger
              className="px-4 py-3 hover:no-underline hover:bg-black/[0.02]"
              style={{ color: A_INK }}
            >
              <div className="flex items-center gap-2 text-left">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" style={{ color: A }} />
                <span className="font-semibold text-sm">Type A — Fire, flood, or structural emergency</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-2" style={{ backgroundColor: A_SOFT }}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Immediate physical threat to a dwelling, person, or shared infrastructure.
                The emergency services definition applies: a situation requiring action within
                minutes, not hours.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold" style={{ color: A_INK }}>Qualifies:</span>{" "}
                fire in the building, burst pipe threatening adjacent units, structural collapse
                risk, loss of heat in sub-zero conditions with a vulnerable occupant.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold" style={{ color: A_INK }}>Does not qualify:</span>{" "}
                a slow leak discovered during routine maintenance, a heating outage in mild
                weather, a structural concern that has existed for weeks.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medical" className="rounded-lg border overflow-hidden" style={{ borderColor: A_BORDER }}>
            <AccordionTrigger
              className="px-4 py-3 hover:no-underline hover:bg-black/[0.02]"
              style={{ color: A_INK }}
            >
              <div className="flex items-center gap-2 text-left">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" style={{ color: A }} />
                <span className="font-semibold text-sm">Type B — Medical emergency</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-2" style={{ backgroundColor: A_SOFT }}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A person's health or life is at immediate risk and normal care pathways
                are unavailable or too slow. The community's duty of neighbour applies.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold" style={{ color: A_INK }}>Qualifies:</span>{" "}
                unconscious person discovered in a common area, a neighbour reporting
                chest pain with no family present, a wellness check where the person
                is unresponsive.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold" style={{ color: A_INK }}>Does not qualify:</span>{" "}
                accompanying someone to a scheduled appointment, managing a chronic
                condition that has a normal care coordinator.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="neighbour" className="rounded-lg border overflow-hidden" style={{ borderColor: A_BORDER }}>
            <AccordionTrigger
              className="px-4 py-3 hover:no-underline hover:bg-black/[0.02]"
              style={{ color: A_INK }}
            >
              <div className="flex items-center gap-2 text-left">
                <Users className="h-4 w-4 flex-shrink-0" style={{ color: A }} />
                <span className="font-semibold text-sm">Type C — Neighbour-helping-neighbour</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-2" style={{ backgroundColor: A_SOFT }}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A situation where the refusal to act would constitute abandonment — not
                inconvenience. The community covenant, not personal preference, drives
                the invocation.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold" style={{ color: A_INK }}>Qualifies:</span>{" "}
                retrieving a child left unattended in a dangerous situation, covering
                a shift when a neighbour has a confirmed family crisis and no substitute
                is reachable, temporarily securing a unit after a break-in when the
                resident cannot be reached.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold" style={{ color: A_INK }}>Does not qualify:</span>{" "}
                doing a favour because it is faster, covering a shift because a neighbour
                simply forgot, accessing a unit because someone thinks it would be helpful.
                Convenience is not community duty.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── Section 2: Friction design ─────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <SectionEyebrow>Section 2 — Friction Design</SectionEyebrow>
          <h2 className="text-lg font-semibold" style={{ color: A_INK }}>
            The broken-glass model
          </h2>
        </div>

        <PullQuote>
          The override is allowed, but it announces itself. Breaking the glass is not
          a failure — but the alarm goes off, and it cannot be un-rung.
        </PullQuote>

        <p className="text-sm text-muted-foreground leading-relaxed">
          The override path must be measurably harder than the normal path, not as
          punishment, but because friction is the proof that the normal path was
          genuinely unavailable. If the override were easy, every preference becomes
          an emergency.
        </p>

        <div className="space-y-3">
          <RuleCard icon={FileText} label="Required stated reason — before action">
            The invoker must state the qualifying emergency type (A, B, or C) and a
            plain-language reason before the override is invoked. The reason is recorded
            to the chain at invocation, not after. Post-hoc justification is not an override
            — it is a cover story.
          </RuleCard>

          <RuleCard icon={Eye} label="Automatic community visibility">
            Every override is immediately visible to the community steward (or designated
            backup steward) as a pending record. It cannot be hidden, withdrawn, or marked
            routine. The visibility is the alarm — it cannot be disabled at invocation time.
          </RuleCard>

          <RuleCard icon={Clock} label="Debrief window: 48 hours">
            The invoker has 48 hours to file the debrief receipt. The debrief is not a
            formality — it is the second half of the override. An override without a
            debrief is structurally incomplete. See Section 5 for what happens when the
            window closes unfiled.
          </RuleCard>

          <RuleCard icon={AlertTriangle} label="No silent closure">
            The chain never self-closes an override. Only a filed debrief receipt, reviewed
            and acknowledged by the community steward, closes the record. The steward's
            acknowledgement is a required field on the debrief — not an optional step.
          </RuleCard>
        </div>
      </section>

      {/* ── Section 3: Invoker and witness rules ───────────────────────────── */}
      <section className="space-y-4">
        <div>
          <SectionEyebrow>Section 3 — Invoker &amp; Witness Rules</SectionEyebrow>
          <h2 className="text-lg font-semibold" style={{ color: A_INK }}>
            Who can invoke, and under what conditions
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          The override is not open to everyone at all times. Eligibility is based on
          household role and backup designation. The witness requirement exists because
          a solo invocation carries higher re-examination risk — not because it is
          inherently wrong, but because memory is unreliable under stress.
        </p>

        <div className="space-y-3">
          <RuleCard icon={Fingerprint} label="Eligible invokers (in priority order)">
            <ol className="space-y-1.5 list-none">
              <li><span className="font-semibold" style={{ color: A_INK }}>1.</span> The household member on record for the unit or role.</li>
              <li><span className="font-semibold" style={{ color: A_INK }}>2.</span> A designated backup — named in writing by the household member, on file with the community steward.</li>
              <li><span className="font-semibold" style={{ color: A_INK }}>3.</span> Any community member acting as a neighbour-witness — only for Type C emergencies, and only when the household member and backup are both unreachable. The neighbour-witness invokes on behalf of, not instead of.</li>
            </ol>
          </RuleCard>

          <RuleCard icon={Users} label="Witness requirement">
            A second person present (physically or reachable by voice) at the moment of
            invocation is strongly preferred. When a witness is present, their cap reference
            is recorded to the chain alongside the invoker's.
            <p className="mt-2">
              When no witness is available (solo override), the override is still valid —
              but the debrief requirement is elevated: the invoker must provide a
              step-by-step account of the situation, and the community steward must
              conduct a brief check-in within 24 hours of the debrief filing.
            </p>
          </RuleCard>
        </div>

        <div
          className="rounded-md border px-4 py-3 text-xs leading-relaxed"
          style={{ borderColor: A_BORDER, color: A_INK, backgroundColor: A_MID }}
        >
          <span className="font-bold">Solo override flag.</span>{" "}
          The chain records whether the override was solo or witnessed as a boolean
          field (<span className="font-mono">witnessed: true | false</span>). This flag
          is read by the debrief system to set the elevated check-in requirement automatically
          — the steward does not have to remember to check.
        </div>
      </section>

      {/* ── Section 4: Chain record fields ─────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <SectionEyebrow>Section 4 — Chain Record Fields</SectionEyebrow>
          <h2 className="text-lg font-semibold" style={{ color: A_INK }}>
            Every field recorded at invocation
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          These are the fields the chain records the moment an override is invoked.
          All required fields must be present before the override is accepted — a
          partial record is rejected, not queued. Optional fields become required
          when their condition is met (e.g. <span className="font-mono text-xs">witness_cap_ref</span>{" "}
          is required when <span className="font-mono text-xs">witnessed: true</span>).
        </p>

        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: A_BORDER }}
        >
          <div
            className="px-4 py-2.5 flex items-center gap-2"
            style={{ backgroundColor: A }}
          >
            <Hash className="h-3.5 w-3.5 text-white/80" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
              override_record
            </span>
          </div>
          <div className="px-4 divide-y divide-black/5">
            <ChainField
              name="record_id"
              type="uuid"
              required={true}
              description="System-generated. Unique identifier for this override record. Used to link the debrief receipt to the invocation."
            />
            <ChainField
              name="invoked_at"
              type="timestamptz"
              required={true}
              description="Exact timestamp of invocation. Set by the chain at acceptance, not supplied by the invoker. Cannot be backdated."
            />
            <ChainField
              name="invoker_cap_ref"
              type="string"
              required={true}
              description="The cap reference (community identity token) of the person invoking the override. Must match an eligible invoker on record."
            />
            <ChainField
              name="emergency_type"
              type="enum: A | B | C"
              required={true}
              description="The qualifying emergency type declared by the invoker: A (fire/flood/structural), B (medical), or C (neighbour-helping-neighbour)."
            />
            <ChainField
              name="stated_reason"
              type="text"
              required={true}
              description="Plain-language reason stated by the invoker before action. Minimum 10 words. The community-aloud test: the invoker should be willing to read this aloud at a debrief."
            />
            <ChainField
              name="witnessed"
              type="boolean"
              required={true}
              description="Whether a second person was present or reachable at invocation. true = standard debrief; false = solo override, elevated debrief required."
            />
            <ChainField
              name="witness_cap_ref"
              type="string"
              required={false}
              description="Required when witnessed: true. The cap reference of the witness. Must be a community member on record. Absent when witnessed: false — field is null, not omitted."
            />
            <ChainField
              name="record_flag"
              type="enum: routine | override"
              required={true}
              description="Always 'override' for records created via this path. The flag distinguishes override records from routine records in all queries and audits. Cannot be changed after creation."
            />
            <ChainField
              name="debrief_status"
              type="enum: pending | filed | overdue | escalated"
              required={true}
              description="Set to 'pending' at invocation. Transitions to 'filed' when the debrief receipt is submitted and acknowledged. Transitions to 'overdue' at T+48h if not filed. Transitions to 'escalated' per Section 5."
            />
            <ChainField
              name="debrief_due_at"
              type="timestamptz"
              required={true}
              description="Set to invoked_at + 48 hours. The chain computes this automatically. Displayed to the invoker at invocation as a visible countdown."
            />
          </div>
        </div>
      </section>

      {/* ── Section 5: Unclosed override default ───────────────────────────── */}
      <section className="space-y-4">
        <div>
          <SectionEyebrow>Section 5 — Unclosed Override Default</SectionEyebrow>
          <h2 className="text-lg font-semibold" style={{ color: A_INK }}>
            What happens when the debrief is never filed
          </h2>
        </div>

        <PullQuote>
          The chain never self-closes. An unclosed override is visible to the community
          until it is resolved — there is no expiry that makes it disappear.
        </PullQuote>

        <p className="text-sm text-muted-foreground leading-relaxed">
          The 48-hour window is not a deadline after which the override passes. It is
          a trigger for escalation. Silence is not consent.
        </p>

        <div className="space-y-3">
          <div
            className="rounded-lg overflow-hidden border"
            style={{ borderColor: A_BORDER }}
          >
            <div
              className="px-4 py-2 text-xs font-black uppercase tracking-[0.18em]"
              style={{ backgroundColor: A_MID, color: A }}
            >
              Escalation timeline
            </div>
            <div className="divide-y divide-black/[0.06] text-sm">
              {[
                {
                  time: "T + 0h",
                  status: "Pending",
                  action: "Override invoked. Debrief countdown begins. Community steward notified automatically.",
                },
                {
                  time: "T + 24h",
                  status: "Reminder",
                  action: "Invoker receives a reminder that the debrief is due in 24 hours. For solo overrides, the steward check-in is also due within this window.",
                },
                {
                  time: "T + 48h",
                  status: "Overdue",
                  action: "debrief_status transitions to 'overdue'. The override record surfaces in the community steward's overdue queue. The invoker can no longer file a standard debrief — they must file an extended debrief explaining the delay.",
                },
                {
                  time: "T + 72h",
                  status: "Escalated",
                  action: "debrief_status transitions to 'escalated'. The record is flagged in the community-visible audit log. The steward is required to initiate a direct conversation with the invoker within 24 hours of escalation.",
                },
                {
                  time: "T + 96h",
                  status: "Open — steward resolution required",
                  action: "If still unfiled, the steward files a steward-originated resolution record on behalf of the override. This record notes that the invoker did not file and documents what the steward was able to determine independently. The override is marked resolved-by-steward, not closed-by-invoker.",
                },
              ].map(({ time, status, action }) => (
                <div key={time} className="px-4 py-3 flex gap-3">
                  <div className="flex-shrink-0 w-16">
                    <span
                      className="font-mono text-[11px] font-bold"
                      style={{ color: A }}
                    >
                      {time}
                    </span>
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: A_INK }}
                    >
                      {status}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="rounded-md border px-4 py-3 space-y-1.5 text-xs leading-relaxed"
          style={{ borderColor: A_BORDER, backgroundColor: A_SOFT, color: A_INK }}
        >
          <p className="font-bold">Why the steward-originated resolution exists.</p>
          <p className="text-muted-foreground leading-relaxed">
            An override with no record closure is worse than a failed override — it is an
            invisible gap in the chain. The steward resolution is not a punishment; it is
            the chain insisting on completeness. The record will always show who closed it
            and how, so the community can assess the situation accurately.
          </p>
        </div>

        <div
          className="rounded-md border px-4 py-3 text-xs leading-relaxed"
          style={{ borderColor: A_BORDER, backgroundColor: A_MID, color: A_INK }}
        >
          <span className="font-bold">Out of scope here:</span>{" "}
          The debrief receipt itself — its fields, trigger, and cycle link — is specified
          in a separate task. The fields above (<span className="font-mono">debrief_status</span>,{" "}
          <span className="font-mono">debrief_due_at</span>) are placeholders that the
          debrief system will write into.
        </div>
      </section>

      {/* Footer nav */}
      <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <Link
          href="/codetry-philosophy"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Codetry — the discipline
        </Link>
        <span style={{ color: A }} className="font-medium">
          The Gate · Emergency Override
        </span>
      </div>

    </div>
  );
}

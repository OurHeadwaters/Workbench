import { Reveal } from "@/components/Reveal";
import { Card, PageFrame } from "../components/PageFrame";

/**
 * Contract renewal & turnover mechanics. The "handover, on purpose"
 * deliverables a departing party owes the incoming one. What triggers
 * renewal vs renegotiation vs walking away. Aligns with the cockpit
 * handover module concept (Task #520).
 */

const DELIVERABLES = [
  {
    name: "Operating manual · current",
    body: "The how-to. Updated within the last 90 days, with the last edit visible. Covers every function on the roles page.",
  },
  {
    name: "Runbook · current",
    body: "The when-things-go-wrong. Updated after any incident. Covers cooler failure, POS down, double-booking, no-show, missed deposit, supply gap.",
  },
  {
    name: "Encoded knowledge",
    body: "Anything that lives in someone's head — preferred suppliers, problem customers, seasonal rhythms, the wifi password — written down, shared.",
  },
  {
    name: "Paid overlap period",
    body: "Outgoing party stays on payroll for 30 days after handover, on call only, paid for actual hours worked. The incoming party has someone to ask.",
  },
  {
    name: "Bench attestation",
    body: "Outgoing party signs off that the bench-is-real milestones (page 02) actually held. If they didn't, the function does not transfer; the contract extends.",
  },
];

const PATHS = [
  {
    id: "renew",
    label: "Renew",
    intro: "Contract continues on the same terms",
    bg: "rgba(59,110,74,0.12)",
    border: "rgba(59,110,74,0.30)",
    triggers: [
      "Indicators (page 07) all green or trending green for 2 quarters",
      "All Y-stage milestones for the period landed on time or with a one-cycle delay",
      "No reds on the burnout protocol that triggered contractor on-call",
      "Both sides willing in writing",
    ],
  },
  {
    id: "renegotiate",
    label: "Renegotiate",
    intro: "Contract continues with adjusted scope or fee",
    bg: "rgba(184,143,62,0.14)",
    border: "rgba(184,143,62,0.30)",
    triggers: [
      "Milestones partially met — the function isn't where the plan says it should be",
      "The outside contractor's role grew or shrank vs. plan",
      "Fee step-down didn't track the ownership migration",
      "Either side wants to add or drop a function",
    ],
  },
  {
    id: "walk",
    label: "Walk away",
    intro: "Contract ends; band runs the operation alone or with a different contractor",
    bg: "rgba(156,42,28,0.10)",
    border: "rgba(156,42,28,0.30)",
    triggers: [
      "Indicators show repeated red and the response ladder didn't recover them",
      "Bench-is-real attestation is failed — too many functions still depend on the contractor",
      "Conflict of values that the steering committee can't resolve",
      "Band decides the operation is ready to run without the contractor",
    ],
  },
];

export default function Renewal() {
  return (
    <PageFrame
      eyebrow="05 · Renewal & turnover"
      title="Handover, on purpose."
      italic="Not at the resignation."
      standfirst={
        <>
          When a contract ends, when a couple leaves, when a function moves
          from contractor to band — the same five deliverables are owed by
          the outgoing party to the incoming one. The cockpit's handover
          module (cockpit · /cockpit) is the live surface where these
          deliverables are kept current quarter by quarter.
        </>
      }
    >
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--color-paper)",
          borderColor: "var(--color-rule)",
        }}
      >
        <header
          className="px-4 py-3 border-b"
          style={{
            background: "var(--color-primary)",
            borderColor: "var(--color-rule)",
          }}
        >
          <div
            className="mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "var(--color-accent)" }}
          >
            Owed by the outgoing party
          </div>
          <div
            className="serif text-[18px] font-semibold mt-0.5"
            style={{ color: "var(--color-bg)" }}
          >
            The five deliverables
          </div>
        </header>
        <ol className="list-none pl-0 divide-y" style={{ borderColor: "var(--color-rule)" }}>
          {DELIVERABLES.map((d, i) => (
            <li
              key={d.name}
              className="p-4 flex gap-3"
            >
              <span
                className="mono text-[16px] tabular-nums shrink-0 leading-none pt-1"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div
                  className="serif text-[16px] font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {d.name}
                </div>
                <div
                  className="serif text-[14.5px] leading-[1.5] mt-1"
                  style={{ color: "var(--color-text)" }}
                >
                  {d.body}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Card
        tag="The decision · three doors"
        head="Renew, renegotiate, or walk away"
        body="At the end of every contract period, the steering committee, the contractor, and the operator couples sit together and answer one question: which door are we walking through? The triggers below are the tests that pick the door."
      />

      {PATHS.map((p) => (
        <article
          key={p.id}
          className="rounded-xl border overflow-hidden"
          style={{ background: p.bg, borderColor: p.border }}
        >
          <header className="px-4 py-3">
            <div
              className="mono text-[10.5px] uppercase tracking-[0.18em]"
              style={{ color: "var(--color-muted)" }}
            >
              Door
            </div>
            <div
              className="serif text-[20px] font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {p.label}
            </div>
            <div
              className="serif text-[14px] leading-[1.45] mt-0.5"
              style={{ color: "var(--color-text)" }}
            >
              {p.intro}
            </div>
          </header>
          <div className="px-4 pb-4">
            <div
              className="mono text-[10px] uppercase tracking-[0.18em] mb-1.5"
              style={{ color: "var(--color-accent-warm)" }}
            >
              Triggers
            </div>
            <ul className="list-none pl-0 space-y-1.5">
              {p.triggers.map((t) => (
                <li
                  key={t}
                  className="text-[14px] leading-[1.5] flex gap-2"
                  style={{ color: "var(--color-text)" }}
                >
                  <span
                    aria-hidden
                    style={{ color: "var(--color-accent-warm)" }}
                  >
                    ·
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}

      <Reveal label="When somebody just leaves">
        <p>
          The five deliverables apply on every departure, not just at
          contract end. A couple resigns, a pod member moves, the contractor
          loses an engagement — the deliverables are the same.
        </p>
        <p>
          The cockpit's handover surface holds the operating manual and
          runbook current as a matter of course, so an unplanned departure
          doesn't catch anyone unprepared. The paid overlap period exists
          even on resignation; it's funded out of the contractor's monthly
          fee, not asked for in the moment.
        </p>
      </Reveal>

      <Reveal label="Walking away is a real option, on purpose">
        <p>
          A handover that has no walk-away door isn't a handover; it's a
          dependency dressed up as one. The third door above is a real door.
          The point of the bench-is-real milestones, the indicators, and the
          burnout protocol is to make sure the band can take it when it's the
          right one.
        </p>
        <p>
          The Phase Planner at /deer-lake-walkthrough/planner shows the
          contractor what walking away looks like at each phase boundary.
          Same logic at the contract boundary.
        </p>
      </Reveal>
    </PageFrame>
  );
}

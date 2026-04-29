import { Reveal } from "@/components/Reveal";
import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_ACCEPTANCE_CRITERIA_OJICREE,
  TRIAL_EYEBROW,
  TRIAL_FEE_LINE,
  TRIAL_FEE_LINE_OJICREE,
  TRIAL_FRAMING_LINE,
  TRIAL_FRAMING_LINE_OJICREE,
  TRIAL_HEADLINE,
  TRIAL_HEADLINE_OJICREE,
  TRIAL_NO_TEAM_LINE,
  TRIAL_REFUND_MECHANIC,
  TRIAL_REFUND_MECHANIC_OJICREE,
  TRIAL_TIMELINE,
  TRIAL_TIMELINE_LOCALE_EN,
  TRIAL_TIMELINE_LOCALE_OJ,
  TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER,
  TRIAL_TIMELINE_OJICREE,
  TRIAL_WEEK_8_REVIEW_DAY,
} from "@workspace/headwaters-pricing";

/**
 * The ask. Five small steps compressed to three top-level bullets — a
 * council motion + steering committee, a six-month co-design + ninety-
 * day cold-chain pilot, and a November 2026 decide-together. The
 * granular five-step list lives in the first Reveal, and the
 * money/locked-numbers reveal stays exactly as before so the
 * lockedNumbers test continues to pass.
 *
 * Step 0 (the eight-week paid trial call-out above the three steps) is
 * rendered from the canonical strings exported by
 * `@workspace/headwaters-pricing` — `TRIAL_HEADLINE`, `TRIAL_FEE_LINE`,
 * `TRIAL_NO_TEAM_LINE`, `TRIAL_ACCEPTANCE_CRITERIA`,
 * `TRIAL_REFUND_MECHANIC`, and `TRIAL_FRAMING_LINE` — so the offer
 * reads identically here, on the Deer Lake Store deck's RisksAsk
 * slide, on the printable one-pager, and in §7 of the payback memo.
 * Edit those constants, not the prose below.
 *
 * Editorial lock: see Reveal.tsx.
 */
export default function Ask() {
  const steps = [
    {
      head: "Council motion + steering committee",
      body:
        "Pass a council motion to enter a one-year design phase. Form a steering committee — three council members, two community members.",
    },
    {
      head: "Six months of co-design + a ninety-day cold-chain pilot",
      body:
        "Co-design the store with the community over six months. Pilot the cold-chain truck with the existing store for ninety days.",
    },
    {
      head: "Decide together by November 2026",
      body:
        "At year end, the band decides whether to commit to building. Real off-ramp at every step before this.",
    },
  ];

  return (
    <section
      id="ask"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--color-accent-warm)" }}
        >
          The ask
        </div>
        <h2
          className="serif font-medium text-[34px] leading-[1.1]"
          style={{ color: "var(--color-primary)", textWrap: "balance" }}
        >
          Three small steps.
          <span
            className="italic font-normal block mt-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            A real off-ramp at every one.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          Not a yes or no on a $4M store today. A small first step that
          anyone can walk back from.
        </p>

        <div
          className="mt-7 rounded-xl border-2 p-5"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-accent-warm)",
          }}
        >
          <div
            className="mono text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            {TRIAL_EYEBROW}
          </div>
          <div
            className="serif text-[20px] leading-[1.25] font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {TRIAL_HEADLINE}
          </div>
          <div
            className="serif text-[15.5px] leading-[1.3] font-medium italic mt-1"
            style={{ color: "var(--color-muted)" }}
            lang="oj"
          >
            {TRIAL_HEADLINE_OJICREE}
          </div>
          <div
            className="mt-3 rounded-md border px-3 py-2 text-[12.5px] leading-[1.45] italic"
            style={{
              borderColor: "var(--color-rule)",
              background: "var(--color-bg)",
              color: "var(--color-muted)",
            }}
          >
            {TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER}
          </div>
          <p
            className="serif text-[15.5px] leading-[1.5] mt-3"
            style={{ color: "var(--color-text)" }}
          >
            <span className="font-semibold">How much.</span>{" "}
            <span className="mono text-[10px] uppercase tracking-[0.18em] mr-1" style={{ color: "var(--color-muted)" }}>
              {TRIAL_TIMELINE_LOCALE_EN}
            </span>
            {TRIAL_FEE_LINE} {TRIAL_NO_TEAM_LINE}
          </p>
          <p
            className="serif text-[14.5px] leading-[1.45] mt-1 italic"
            style={{ color: "var(--color-muted)" }}
            lang="oj"
          >
            <span className="mono text-[10px] not-italic uppercase tracking-[0.18em] mr-1">
              {TRIAL_TIMELINE_LOCALE_OJ}
            </span>
            {TRIAL_FEE_LINE_OJICREE}
          </p>
          <p
            className="serif text-[15.5px] leading-[1.5] mt-2"
            style={{ color: "var(--color-text)" }}
          >
            <span className="font-semibold">
              What you get in eight weeks (solo, by the practitioner):
            </span>
          </p>
          <ol
            className="serif text-[15px] leading-[1.5] mt-1 list-decimal pl-5"
            style={{ color: "var(--color-text)" }}
          >
            {TRIAL_ACCEPTANCE_CRITERIA.map((criterion, i) => {
              const ojiCriterion = TRIAL_ACCEPTANCE_CRITERIA_OJICREE.find(
                (c) => c.index === i,
              );
              return (
                <li key={criterion}>
                  <div>{criterion}</div>
                  {ojiCriterion ? (
                    <div
                      className="serif text-[14px] leading-[1.45] italic mt-0.5"
                      style={{ color: "var(--color-muted)" }}
                      lang="oj"
                    >
                      {ojiCriterion.text}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <p
            className="serif text-[15.5px] leading-[1.5] mt-3"
            style={{ color: "var(--color-text)" }}
          >
            <span className="font-semibold">Money back.</span>{" "}
            {TRIAL_REFUND_MECHANIC}
          </p>
          <p
            className="serif text-[14.5px] leading-[1.45] mt-1 italic"
            style={{ color: "var(--color-muted)" }}
            lang="oj"
          >
            {TRIAL_REFUND_MECHANIC_OJICREE}
          </p>
          <p
            className="serif text-[14.5px] leading-[1.45] mt-3 italic"
            style={{ color: "var(--color-muted)" }}
          >
            {TRIAL_FRAMING_LINE}
          </p>
          <p
            className="serif text-[13.5px] leading-[1.45] mt-1 italic"
            style={{ color: "var(--color-muted)" }}
            lang="oj"
          >
            {TRIAL_FRAMING_LINE_OJICREE}
          </p>
        </div>

        <div
          className="mt-5 rounded-xl border p-5"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-rule)",
          }}
        >
          <div
            className="mono text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Eight weeks, week by week
          </div>
          <div
            className="serif text-[17px] leading-[1.3] font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            What the practitioner is doing each week.
          </div>
          <p
            className="serif text-[14.5px] leading-[1.45] mt-2"
            style={{ color: "var(--color-muted)" }}
          >
            Four written things from the trial, spread across eight
            weeks. Review meeting lands day {TRIAL_WEEK_8_REVIEW_DAY}.
          </p>
          <div
            className="mt-3 rounded-md border px-3 py-2 text-[12.5px] leading-[1.45] italic"
            style={{
              borderColor: "var(--color-rule)",
              background: "var(--color-bg)",
              color: "var(--color-muted)",
            }}
          >
            {TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER}
          </div>
          <ol className="mt-3 space-y-2 list-none pl-0">
            {TRIAL_TIMELINE.map((week) => {
              const acIndex = week.acceptanceCriterionDelivered;
              const delivers = acIndex !== null;
              const ojiWeek = TRIAL_TIMELINE_OJICREE.find(
                (w) => w.week === week.week,
              );
              return (
                <li
                  key={week.week}
                  className="rounded-lg p-3 border"
                  style={{
                    background: delivers
                      ? "rgba(184,90,62,0.06)"
                      : "var(--color-bg)",
                    borderColor: delivers
                      ? "var(--color-accent-warm)"
                      : "var(--color-rule)",
                  }}
                >
                  <div className="flex items-baseline gap-3">
                    <div
                      className="mono text-[12px] tabular-nums shrink-0 uppercase tracking-[0.18em]"
                      style={{ color: "var(--color-accent-warm)" }}
                    >
                      W{week.week} · {week.windowLabel}
                    </div>
                    <div className="flex-1">
                      <div
                        className="serif text-[14.5px] leading-[1.3] font-semibold"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {week.focus}
                      </div>
                      {ojiWeek ? (
                        <div
                          className="serif text-[13.5px] leading-[1.3] font-medium italic mt-0.5"
                          style={{ color: "var(--color-muted)" }}
                          lang="oj"
                        >
                          {ojiWeek.focus}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                    <div>
                      <div
                        className="mono text-[9.5px] uppercase tracking-[0.18em] mb-0.5"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {TRIAL_TIMELINE_LOCALE_EN}
                      </div>
                      <div
                        className="serif text-[13.5px] leading-[1.45]"
                        style={{ color: "var(--color-text)" }}
                      >
                        <span className="font-semibold">Deliverables.</span>{" "}
                        {week.deliverables}
                      </div>
                      <div
                        className="serif text-[13.5px] leading-[1.45] mt-1"
                        style={{ color: "var(--color-text)" }}
                      >
                        <span className="font-semibold">Meetings.</span>{" "}
                        {week.meetings}
                      </div>
                      {week.gatingDecision ? (
                        <div
                          className="serif text-[13.5px] leading-[1.45] mt-1"
                          style={{ color: "var(--color-text)" }}
                        >
                          <span className="font-semibold">
                            Gating decision.
                          </span>{" "}
                          {week.gatingDecision}
                        </div>
                      ) : null}
                    </div>
                    {ojiWeek ? (
                      <div lang="oj">
                        <div
                          className="mono text-[9.5px] uppercase tracking-[0.18em] mb-0.5"
                          style={{ color: "var(--color-muted)" }}
                        >
                          {TRIAL_TIMELINE_LOCALE_OJ}
                        </div>
                        <div
                          className="serif text-[13.5px] leading-[1.45] italic"
                          style={{ color: "var(--color-muted)" }}
                        >
                          <span className="font-semibold not-italic">
                            Deliverables.
                          </span>{" "}
                          {ojiWeek.deliverables}
                        </div>
                        <div
                          className="serif text-[13.5px] leading-[1.45] mt-1 italic"
                          style={{ color: "var(--color-muted)" }}
                        >
                          <span className="font-semibold not-italic">
                            Meetings.
                          </span>{" "}
                          {ojiWeek.meetings}
                        </div>
                        {ojiWeek.gatingDecision ? (
                          <div
                            className="serif text-[13.5px] leading-[1.45] mt-1 italic"
                            style={{ color: "var(--color-muted)" }}
                          >
                            <span className="font-semibold not-italic">
                              Gating decision.
                            </span>{" "}
                            {ojiWeek.gatingDecision}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  {delivers ? (
                    <div
                      className="mono text-[11px] uppercase tracking-[0.18em] mt-2"
                      style={{ color: "var(--color-accent-warm)" }}
                    >
                      §7 acceptance criterion #{(acIndex ?? 0) + 1} delivered:{" "}
                      <span className="normal-case tracking-normal italic">
                        {TRIAL_ACCEPTANCE_CRITERIA[acIndex ?? 0]}
                      </span>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        <ol className="mt-7 space-y-3 list-none pl-0">
          {steps.map((step, i) => (
            <li
              key={step.head}
              className="flex gap-4 rounded-xl p-4 border"
              style={{
                background: "var(--color-paper)",
                borderColor: "var(--color-rule)",
              }}
            >
              <div
                className="mono text-[18px] tabular-nums shrink-0 leading-none pt-0.5"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <div
                  className="serif text-[17px] leading-[1.3] font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {step.head}
                </div>
                <div
                  className="serif text-[15px] leading-[1.45] mt-1.5"
                  style={{ color: "var(--color-text)" }}
                >
                  {step.body}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-3">
          <Reveal label="The five-step version, broken out">
            <ol className="space-y-2 list-decimal pl-5">
              <li>
                Pass a council motion to enter a one-year design phase with
                Headwaters.
              </li>
              <li>
                Form a steering committee — three council members, two
                community members.
              </li>
              <li>Co-design the store with the community over six months.</li>
              <li>
                Pilot the cold-chain truck with the existing store for ninety
                days.
              </li>
              <li>
                Decide together by November 2026 whether to commit to
                building.
              </li>
            </ol>
          </Reveal>

          <Reveal label="What this first year costs">
            <p>
              <span className="font-semibold">$1,080,000 over twelve months</span>{" "}
              — $90,000 a month for Headwaters. Covers the seven-person
              team, the cold-chain pilot, the software build, staff
              training, and the year-end audit.
            </p>
            <p>
              No grants in hand. Paid from band reserves — the planner
              shows the path. Most spending lands near the end, against
              the cold-chain pilot. Walk away after step three and the
              band keeps the truck route, the software, and the bill
              stops.
            </p>
          </Reveal>

          <Reveal label="What the band gets back, and how soon">
            <p>
              <span className="font-semibold">About $125,000 to $200,000 of grocery margin stays in Deer Lake the first year.</span>{" "}
              Money flying south today at 58¢ on the dollar. The new
              store sells 30 to 40 percent of Deer Lake's $1.6–2.0M
              grocery spend in year one, keeping 26¢ more of every
              dollar than the current store (84¢ on the shelf, not
              58¢).
            </p>
            <p>
              Plus <span className="font-semibold">17 to 20 jobs for Deer
              Lake people</span> grow into the store over two years.
              Both numbers come from the store-plan financial model —
              no new claims, just the math arranged so council can see
              it.
            </p>
          </Reveal>

          <Reveal label="What stays even if Deer Lake walks away" variant="ink">
            <p>The cold-chain truck route — built, tested, available to other communities.</p>
            <p>The open-records software — Deer Lake keeps full ownership.</p>
            <p>Whatever pricing data was published — already in the public record.</p>
            <p>Whatever staff training happened — those skills stay in Deer Lake.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

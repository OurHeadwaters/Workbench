import { Reveal } from "@/components/Reveal";
import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_ACCEPTANCE_CRITERIA_OJICREE,
  TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER,
} from "@workspace/headwaters-pricing";

/**
 * What Headwaters delivers — the seller-side surface the contractor
 * needs in order to sell the engagement to the chief. Three line items
 * with a Reveal apiece pointing at the shipped artifact backing each
 * one. Same shape as Ask.tsx (eyebrow + headline + 3 bullet cards +
 * Reveals).
 *
 * The "what's inside the eight-week trial · what isn't" framing block
 * above the three line items names the four trial deliverables by
 * their headline (the verbatim first half of each
 * `TRIAL_ACCEPTANCE_CRITERIA` entry from `@workspace/headwaters-pricing`).
 * Reading the headlines from the canonical array keeps this surface in
 * lockstep with the formal Step 0 call-out on Ask.tsx, the slide on
 * RisksAsk.tsx, the printable one-pager, and the §7 refund clause.
 *
 * Editorial lock: see Reveal.tsx.
 */
export default function WhatHeadwatersDelivers() {
  const lines = [
    {
      tag: "Line 1 · The store's operating system",
      head: "Till, books, open-records software.",
      body:
        "The cashier's screen, the daily close, the public price page, the household lookup — built once, owned by the band.",
    },
    {
      tag: "Line 2 · The way the food gets here",
      head: "Cold-chain plan, truck route, ninety-day pilot.",
      body:
        "Three lanes (truck on the road, winter-road truck, plane), planned route by route, tested before the store opens.",
    },
    {
      tag: "Line 3 · The people, trained",
      head: "Staff training, written guide, steering committee.",
      body:
        "Everyone learns every job. The band runs from a written guide, not from memory. A community board sits over the work.",
    },
  ];

  return (
    <section
      id="what-headwaters-delivers"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--color-accent-warm)" }}
        >
          What Headwaters delivers
        </div>
        <h2
          className="serif font-medium text-[34px] leading-[1.1]"
          style={{ color: "var(--color-primary)", textWrap: "balance" }}
        >
          Three line items.
          <span
            className="italic font-normal block mt-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            One contract. One team that gets it done.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          Two people run the floor. Square, QuickBooks, and Local
          Line do the back end. Doors stay open, truck stays on time,
          money comes home fast.
        </p>

        <div
          className="mt-6 rounded-xl border p-4"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-rule)",
          }}
        >
          <div
            className="mono text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Trial vs. Step 1
          </div>
          <p
            className="serif text-[15px] leading-[1.5]"
            style={{ color: "var(--color-text)" }}
          >
            <span className="font-semibold">Trial · eight weeks.</span>{" "}
            Practitioner alone. No team. Four written things land:
            steering committee, co-design plan, cold-chain pilot
            scope, year-one budget.
          </p>
          <p
            className="serif text-[15px] leading-[1.5] mt-2"
            style={{ color: "var(--color-text)" }}
          >
            <span className="font-semibold">Step 1 · $90,000 a
            month.</span> Full team — seven people, cold-chain pilot,
            software, training, day-one gear. Below: what Step 1
            buys.
          </p>
        </div>

        <ol className="mt-7 space-y-3 list-none pl-0">
          {lines.map((line, i) => (
            <li
              key={line.tag}
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
                  className="mono text-[10px] uppercase tracking-[0.18em] mb-1"
                  style={{ color: "var(--color-accent-warm)" }}
                >
                  {line.tag}
                </div>
                <div
                  className="serif text-[18px] leading-[1.3] font-medium"
                  style={{ color: "var(--color-primary)" }}
                >
                  {line.head}
                </div>
                <div
                  className="serif text-[15.5px] leading-[1.45] mt-1.5"
                  style={{ color: "var(--color-text)" }}
                >
                  {line.body}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/*
          Line 1's old Reveal lived here ("Proof for line 1 — the operating
          system already exists"). It was removed in task #526: the
          bookkeeping proof now has its own dedicated section
          (BookkeepingProof.tsx) immediately below this one, with three
          live in-page embeds of the actual Headwaters Books screens.
          Lines 2 and 3 keep their Reveals because their proof still
          lives outside this artifact.
        */}
        <div className="mt-8 space-y-3">
          <Reveal label="The four trial deliverables, in full">
            <p>
              The full contractual wording of the four §7 acceptance
              criteria — what the contractor signs off on at the
              week-eight review meeting.
            </p>
            <p className="text-[12.5px] italic text-muted mt-2">
              {TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER}
            </p>
            <ol
              className="list-decimal pl-5 space-y-2 mt-2"
            >
              {TRIAL_ACCEPTANCE_CRITERIA.map((criterion, i) => {
                const ojiCriterion = TRIAL_ACCEPTANCE_CRITERIA_OJICREE.find(
                  (c) => c.index === i,
                );
                return (
                  <li key={criterion}>
                    <div>{criterion}</div>
                    {ojiCriterion ? (
                      <div className="italic text-[13.5px] mt-1" lang="oj">
                        {ojiCriterion.text}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal label="Proof for line 2 — the cold-chain plan is already drawn">
            <p>
              The route is already planned: Thunder Bay → Sioux Lookout →
              Dryden, then a winter-road truck Dryden → Deer Lake, with plane
              backup April through November. The "How groceries get here"
              section below has the lane-by-lane detail.
            </p>
            <p>
              The Phase Planner at{" "}
              <span className="font-semibold">/deer-lake-walkthrough/planner</span>{" "}
              lets the contractor flip between the self-fund and grant-funded
              scenarios live, with the cold-chain pilot back-loaded so the
              band can walk away after step three with the route built.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "var(--color-muted)" }}
            >
              Open in another tab ·{" "}
              <a
                href="/deer-lake-walkthrough/planner"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                /deer-lake-walkthrough/planner
              </a>{" "}
              ·{" "}
              <a
                href="/deer-lake-store-plan/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                /deer-lake-store-plan
              </a>
            </p>
          </Reveal>

          <Reveal label="Proof for line 3 — the training is already written down" variant="ink">
            <p>
              The codetry handbook is the written method behind how
              Headwaters trains. Seven parts, every chapter readable on a
              phone — the same handbook the band staff will work from in
              their training materials.
            </p>
            <p>
              The Practitioner's Guide is the reference Bobbie's own
              practitioners work from — contracts ledger, archetypes,
              personal-cash discipline. It's the bench the Deer Lake training
              gets staffed from.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "rgba(244,237,224,0.7)" }}
            >
              Open in another tab ·{" "}
              <a
                href="/codetry-handbook/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                /codetry-handbook
              </a>{" "}
              ·{" "}
              <a
                href="/practitioners-guide-v2/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                /practitioners-guide-v2
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";

/**
 * What Headwaters delivers — the seller-side surface the contractor
 * needs in order to sell the engagement to the chief. Three line items
 * with a Reveal apiece pointing at the shipped artifact backing each
 * one. Same shape as Ask.tsx (eyebrow + headline + 3 bullet cards +
 * Reveals).
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
            One contract. One team that ships.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          What the band is actually buying — built so a two-person operator
          couple, sitting on top of Square, QuickBooks, and Local Line, keeps
          the payroll line small, the doors open long hours with limited
          disruption, the truck on time, and the dollars-back-to-band
          arriving fast. Each line below is a real deliverable, not a
          promise — open the proof beneath each one.
        </p>

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
              phone, the same plain voice the band staff will see in their
              training materials.
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

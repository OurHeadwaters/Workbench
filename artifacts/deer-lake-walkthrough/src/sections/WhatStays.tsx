import { Reveal } from "@/components/Reveal";

/**
 * What stays with Deer Lake when Headwaters hands off. The handoff line
 * is the whole pitch of the partnership: not a service contract, a
 * graduation.
 */
export default function WhatStays() {
  return (
    <div
      className="min-h-full w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-24 pb-32 flex flex-col">
      <div
        className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
        style={{ color: "var(--color-accent-warm)" }}
      >
        What stays with Deer Lake
      </div>
      <h2
        className="serif font-medium text-[34px] leading-[1.1]"
        style={{ color: "var(--color-primary)", textWrap: "balance" }}
      >
        Headwaters hands off.
        <span
          className="italic font-normal block mt-2"
          style={{ color: "var(--color-accent-warm)" }}
        >
          The store keeps running.
        </span>
      </h2>

      <p
        className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
        style={{ color: "var(--color-text)" }}
      >
        We charge a monthly fee for software, training, and a team that
        shows up. We take no cut of the groceries. Three things stay with
        Deer Lake forever — even after our contract ends.
      </p>

      <div className="mt-7 space-y-3">
        {[
          {
            head: "The public price page",
            tag: "Live by month 3 · used by month 6",
            body:
              "Anyone in Deer Lake can see what the store paid, what it sells at, and what it keeps. Line by line.",
          },
          {
            head: "The household price lookup",
            tag: "Live by month 9",
            body:
              "Each family sees what they spent this month vs. the baseline. The federal help shows up clearly.",
          },
          {
            head: "The written guide for running the store",
            tag: "Written down as we go",
            body:
              "How to run, hire, keep books, use the open-records system. The band runs from the guide, not from memory.",
          },
        ].map((item) => (
          <div
            key={item.head}
            className="rounded-2xl p-5 border"
            style={{
              background: "var(--color-paper)",
              borderColor: "var(--color-rule)",
            }}
          >
            <div
              className="serif text-[19px] leading-[1.3] font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {item.head}
            </div>
            <div
              className="mono text-[10.5px] uppercase tracking-[0.18em] mt-1.5 mb-2"
              style={{ color: "var(--color-accent-warm)" }}
            >
              {item.tag}
            </div>
            <div
              className="serif text-[16px] leading-[1.5]"
              style={{ color: "var(--color-text)" }}
            >
              {item.body}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <Reveal label="The year-end value-delivered audit">
          <p>
            An outside reviewer checks our work once a year against what we
            charged. <span className="font-semibold">If what we delivered
            to Deer Lake is worth less than what we charged, we credit the
            difference back against next year's contract.</span> In writing.
          </p>
          <p>
            Five things we have to deliver: money saved, staff time saved,
            open-records tools used, local skill built up, and the year-end
            review itself.
          </p>
        </Reveal>

        <Reveal label="What Headwaters is paid for" variant="ink">
          <p>
            Headwaters delivers three things — the software (built by us,
            owned by the band), the tools we resell at a published markup,
            and the training programs.
          </p>
          <p>
            The monthly fee covers all three. We take{" "}
            <span className="font-semibold">no cut of the groceries</span>.
            The store's grocery margin stays in Deer Lake.
          </p>
        </Reveal>
      </div>
      </div>
    </div>
  );
}

import { Reveal } from "@/components/Reveal";

/**
 * What the store is, in plain words. Vision-led: a single line, then the
 * supporting context. The big numbers wait until the recap; what lives
 * here is the picture of the place.
 */
export default function WhatItIs() {
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
        What it is
      </div>
      <h2
        className="serif font-medium text-[34px] leading-[1.1] mb-2"
        style={{ color: "var(--color-primary)", textWrap: "balance" }}
      >
        A second grocery store in Deer Lake.
        <span className="italic font-normal block mt-2" style={{ color: "var(--color-accent-warm)" }}>
          Owned by the band. Built for the long winters.
        </span>
      </h2>

      <p
        className="serif text-[19px] leading-[1.55] mt-6 max-w-md"
        style={{ color: "var(--color-text)" }}
      >
        Headwaters delivers the operating system — the till, the books, the
        cold-chain plan, the open-records tools. The band hires and runs
        everyone inside. The grocery margin stays in Deer Lake.
      </p>

      <p
        className="serif italic text-[18px] leading-[1.55] mt-5 max-w-md"
        style={{ color: "var(--color-muted)" }}
      >
        Not an experiment. Arctic Co-ops runs 32 stores like this up north.
        The Mistissini Meechum store has been doing it for years.
      </p>

      <div className="mt-10 space-y-3">
        <Reveal label="Why community-owned matters">
          <p>
            With one store in town, most of the federal grocery help stays
            with the store. Of every dollar, only 58¢ reaches the shelf.
          </p>
          <p>
            With a community-owned store, that number climbs to 84¢. The
            other 26¢ doesn't disappear — it shows up as lower prices, paid
            jobs, and a board the community sits on.
          </p>
          <p
            className="mono text-[13px] uppercase tracking-[0.16em] mt-2"
            style={{ color: "var(--color-muted)" }}
          >
            Source · Arctic Co-operatives published margin disclosures, 2024
          </p>
        </Reveal>

        <Reveal label="Who already does this up north">
          <p>
            <span className="font-semibold">Arctic Co-operatives.</span> 32
            community-owned stores, ~4,000 households served, year after year.
          </p>
          <p>
            <span className="font-semibold">Mistissini Meechum store.</span> A
            Cree community of similar size to Deer Lake. Their store has been
            community-owned since 1979.
          </p>
        </Reveal>
      </div>
      </div>
    </div>
  );
}

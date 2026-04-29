import { Reveal } from "@/components/Reveal";

/**
 * What the store is, in plain words.
 *
 * Editorial lock (see Reveal.tsx): three top-level bullet cards
 * visible above the fold; everything longer sits behind a tap.
 */
export default function WhatItIs() {
  const bullets = [
    {
      tag: "Owned by the band",
      body: "The band owns it. Gilles hires the couple and runs the floor, with locals pitching in.",
    },
    {
      tag: "Built for long winters",
      body: "Cold-chain truck route, calendar that bends, till that runs offline.",
    },
    {
      tag: "Margin stays in Deer Lake",
      body: "The grocery margin doesn't fly south. It funds jobs and lower prices here.",
    },
  ];

  return (
    <section
      id="what-it-is"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
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
          <span
            className="italic font-normal block mt-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Owned by the band. Built for the long winters.
          </span>
        </h2>

        <div className="mt-7 space-y-3">
          {bullets.map((b) => (
            <div
              key={b.tag}
              className="rounded-xl p-4 border"
              style={{
                background: "var(--color-paper)",
                borderColor: "var(--color-rule)",
              }}
            >
              <div
                className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1.5"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {b.tag}
              </div>
              <div
                className="serif text-[16px] leading-[1.45]"
                style={{ color: "var(--color-text)" }}
              >
                {b.body}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
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
            <p
              className="serif italic text-[15px] mt-2"
              style={{ color: "var(--color-muted)" }}
            >
              Not an experiment. The shape is proven. Deer Lake's version is
              what's new.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";

/**
 * The ask. Five small steps compressed to three top-level bullets — a
 * council motion + steering committee, a six-month co-design + ninety-
 * day cold-chain pilot, and a November 2026 decide-together. The
 * granular five-step list lives in the first Reveal, and the
 * money/locked-numbers reveal stays exactly as before so the
 * lockedNumbers test continues to pass.
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
        "At the end of the year, the band decides whether to commit to building. A real off-ramp at every step before this one.",
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
              — that's $90,000 a month for the Headwaters engagement,
              the locked rate from the Practitioners Guide. It covers the
              seven-person team doing the design work, running the
              cold-chain pilot, building the open-records software,
              training Deer Lake staff, and producing the year-end audit.
              No grants are in hand at this point — the most likely
              source is band reserve capital, the same path the planner
              walks through in its self-fund mode. The spend is
              back-loaded against the cold-chain pilot, so the band can
              walk away after step three with a working delivery route
              and the open-records tools, and the bill stops there. For
              the dated picture — council vote on reserves, truck still
              going through LFIF via the 807 partnership — flip the
              planner to its self-fund scenario.
            </p>
          </Reveal>

          <Reveal label="What the band gets back, and how soon">
            <p>
              <span className="font-semibold">About $125,000 to $200,000 of grocery margin stays in Deer Lake the first year.</span>{" "}
              That's the money that today flies south at 58¢ on the dollar:
              the new store sells 30 to 40 percent of Deer Lake's
              $1.6–2.0M grocery spend in year one, and keeps 26¢ more
              of every dollar than the current store does (84¢ on the
              shelf, not 58¢).
            </p>
            <p>
              Plus <span className="font-semibold">17 to 20 jobs for Deer
              Lake people</span> grow into the store over two years.
              Both numbers come straight from the financial model in
              the store-plan deck — no new claims, just the math
              arranged so the council can see it.
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

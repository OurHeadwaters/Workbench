import { Reveal } from "@/components/Reveal";

/**
 * The ask. Five steps. Big list, easy to point at in the band council
 * meeting. Money lives behind a tap because the moment isn't about the
 * dollars — it's about whether the band wants to do this.
 */
export default function Ask() {
  const steps = [
    "Pass a council motion to enter a one-year design phase with Headwaters.",
    "Form a steering committee — three council members, two community members.",
    "Co-design the store with the community over six months.",
    "Pilot the cold-chain truck with the existing store for ninety days.",
    "Decide together by November 2026 whether to commit to building.",
  ];

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
        The ask
      </div>
      <h2
        className="serif font-medium text-[34px] leading-[1.1]"
        style={{ color: "var(--color-primary)", textWrap: "balance" }}
      >
        Five steps.
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
            key={i}
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
            <div
              className="serif text-[17px] leading-[1.45]"
              style={{ color: "var(--color-text)" }}
            >
              {step}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-3">
        <Reveal label="What this first year costs">
          <p>
            <span className="font-semibold">$420,000 over twelve months.</span>{" "}
            Covers design work, the cold-chain pilot, the open-records
            software, training, and the year-end audit.
          </p>
          <p>
            <span className="font-semibold">$240,000 we already have funding for</span>{" "}
            from Indigenous Services Canada and the Local Food
            Infrastructure Fund.
          </p>
          <p>
            <span className="font-semibold">$180,000 from the band</span> —
            mostly back-loaded against the cold-chain pilot, so the band
            can walk away after step three with a working delivery route
            and the open-records tools.
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
    </div>
  );
}

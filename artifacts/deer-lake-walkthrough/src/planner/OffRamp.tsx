import { fmtMonthYear } from "./dates";

/**
 * The off-ramp callout. The council's real decision moment is the
 * council-decision date — by then the band has 90 days of pilot data,
 * the design work, and the application package. The decision is not
 * "build the store," it's "commit to filing the application package."
 */
export function OffRamp({
  councilDecision,
  fundingSecured,
}: {
  councilDecision: string;
  fundingSecured: string;
}) {
  return (
    <section className="w-full" style={{ background: "var(--color-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 py-8">
        <div
          className="rounded-2xl p-6 border-l-[6px]"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-bg)",
            borderColor: "var(--color-accent-warm)",
          }}
        >
          <div
            className="mono text-[10px] uppercase tracking-[0.22em] mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            The decision moment
          </div>
          <h2
            className="serif text-[24px] leading-[1.15] font-medium"
            style={{ color: "var(--color-bg)", textWrap: "balance" }}
          >
            {fmtMonthYear(councilDecision)} council decision gate.
          </h2>
          <p className="serif text-[15px] leading-[1.55] mt-4 opacity-90">
            By this date the band has 90 days of pilot data, the design
            work, and the application package in hand. The decision is
            not <em>build the store</em>. It is <em>commit to filing
            the application package</em>.
          </p>
          <p className="serif text-[15px] leading-[1.55] mt-3 opacity-90">
            Contract two then activates on the funding-secured trigger
            in {fmtMonthYear(fundingSecured)} — not before.
          </p>
        </div>
      </div>
    </section>
  );
}

import { fmtMonthYear, type ScenarioMode } from "./dates";

export function OffRamp({
  mode, councilDecision, fundingSecured, truckLfifIntake,
}: {
  mode: ScenarioMode; councilDecision: string; fundingSecured: string; truckLfifIntake: string;
}) {
  return (
    <section className="w-full" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 py-8">
        <div className="rounded-2xl p-6 border-l-[6px]"
          style={{ background: "var(--cs-primary)", color: "var(--cs-bg)", borderColor: "var(--cs-accent-warm)" }}
          data-testid="offramp">
          <div className="mono text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent)" }}>
            The decision moment
          </div>
          <h2 className="serif text-[24px] leading-[1.15] font-medium" style={{ color: "var(--cs-bg)", textWrap: "balance" } as React.CSSProperties}>
            {fmtMonthYear(councilDecision)} council decision gate.
          </h2>
          {mode === "self-fund" ? (
            <>
              <p className="serif text-[15px] leading-[1.55] mt-4 opacity-90">
                The decision is not <em>file the application package</em>. It is <em>spend reserve capital now</em> for an earlier doors-open.
                By this date the community has 90 days of pilot data and the design work in hand — no federal cycle to wait on.
              </p>
              <p className="serif text-[15px] leading-[1.55] mt-3 opacity-90">
                Contract two activates on the funding-secured trigger in {fmtMonthYear(fundingSecured)}.
                The 807-partnership LFIF for the ice-road truck still files in {fmtMonthYear(truckLfifIntake)} — but it gates only the vehicle, not the store.
              </p>
            </>
          ) : (
            <>
              <p className="serif text-[15px] leading-[1.55] mt-4 opacity-90">
                By this date the community has 90 days of pilot data, the design work, and the application package in hand.
                The decision is not <em>build the store</em>. It is <em>commit to filing the application package</em>.
              </p>
              <p className="serif text-[15px] leading-[1.55] mt-3 opacity-90">
                Contract two then activates on the funding-secured trigger in {fmtMonthYear(fundingSecured)} — not before.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

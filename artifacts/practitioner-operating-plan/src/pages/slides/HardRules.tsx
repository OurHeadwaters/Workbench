export default function HardRules() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VI · 08 — Two hard rules
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Two rules that govern both.
              <span className="italic font-normal text-accent"> Non-negotiable. Checked quarterly.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            Salt and internal design only earn their place under Headwaters
            if they live inside these two rules.{" "}
            <span className="text-primary font-semibold">
              The day either rule starts bending is the day the answer
              changes.
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.9vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              Rule 01
            </div>
            <div className="font-display text-[2vw] leading-tight font-medium mb-[1.2vh]">
              The founder's hands stay off jars and tables.
              <span className="block italic font-normal opacity-90 mt-[0.4vh]">
                Forever.
              </span>
            </div>
            <div className="font-body text-[1.05vw] leading-[1.5] opacity-95 mb-[1.5vh]">
              Not in a busy week, not for a holiday push, not because
              someone called in sick. No packing, no labeling, no booth
              setup, no market drives. The whole point of Part II's team
              and Part III's runbook was to put those hours somewhere
              else — inside the engagements, inside Part I's calendar,
              inside the kids' actual childhood.
            </div>
            <div
              className="mt-auto pt-[1.2vh] border-t"
              style={{ borderColor: "rgba(244,237,224,0.3)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold mb-[0.5vh]"
                style={{ color: "#e9c8a8" }}
              >
                What enforces it
              </div>
              <div className="font-body text-[0.95vw] leading-[1.45] opacity-95">
                The named 4-person depot bench (Part VI · 02b) and its
                A→B→C→D rotation are the mechanism — populated by week 6 of
                the OM&rsquo;s start, costed at $15k/yr in SALT-01-LBR. If the
                bench can&rsquo;t run a batch, the batch slips on the
                T-7/T-3/T-0 path. The rule never falls to the founder&rsquo;s
                hands as the fallback.
              </div>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold mb-[1vh]">
              Rule 02
            </div>
            <div className="font-display text-[2vw] leading-tight text-primary font-medium mb-[1.2vh]">
              Deer Lake gets first call on the shared team.
              <span className="block italic font-normal text-accent mt-[0.4vh]">
                Salt and internal design fill white space, never compete for it.
              </span>
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.5] mb-[1.5vh]">
              The ops manager's calendar is sequenced contract-first.
              Salt batches, depot stress tests, and internal design sprints
              get scheduled into the gaps the contract leaves —{" "}
              <span className="font-semibold text-primary">
                never at the cost of an aggregation run, a price audit, or
                a council deliverable.
              </span>{" "}
              The same applies to the bookkeeper, the IT/Tech, and
              every shared resource the agency funds.
            </div>

            <div
              className="mt-auto pt-[1.2vh] border-t"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.6vh]">
                Quarterly check
              </div>
              <div className="font-body text-[0.95vw] text-text leading-[1.45]">
                The bookkeeper produces an{" "}
                <span className="font-semibold text-primary">hours-by-pillar report</span>{" "}
                every quarter — Deer Lake, salt, internal design, agency
                back-office — for every shared role. If Deer Lake's share
                of any shared person's hours drops below the contracted
                baseline two quarters in a row, salt and internal design
                pause until the ratio is restored.
              </div>
              <div className="mt-[0.8vh] font-mono uppercase tracking-[0.18em] text-[0.72vw] text-muted">
                Fillable templates → <a href="/hours" className="underline decoration-dotted underline-offset-2 text-text">/hours</a> · <a href="/salt-coa" className="underline decoration-dotted underline-offset-2 text-text">/salt-coa</a> · <a href="/salt-monthly-close" className="underline decoration-dotted underline-offset-2 text-text">/salt-monthly-close</a>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-[1.8vh] pt-[1.2vh] border-t font-display italic text-[1.3vw] text-muted leading-[1.4] max-w-[80vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          Headwaters is the parent.{" "}
          <span className="text-primary font-semibold not-italic">
            Salt and design are tributaries —
          </span>{" "}
          they only run when the main channel is full.
        </div>
      </div>
    </div>
  );
}

import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_FEE_LINE,
  TRIAL_HEADLINE,
  TRIAL_NO_TEAM_LINE,
  TRIAL_REFUND_MECHANIC,
} from "@workspace/headwaters-pricing";

/**
 * Risks & Ask slide. The right-hand "Naming the deal" panel includes a
 * highlighted Step 0 card sitting above the existing "deal in plain
 * words" block. The Step 0 card is rendered from the canonical strings
 * exported by `@workspace/headwaters-pricing` (`TRIAL_HEADLINE`,
 * `TRIAL_FEE_LINE`, `TRIAL_NO_TEAM_LINE`, `TRIAL_ACCEPTANCE_CRITERIA`,
 * `TRIAL_REFUND_MECHANIC`) so the offer reads identically here, in
 * Ask.tsx on the walkthrough deck, on the printable one-pager, and in
 * §7 of the payback memo. Edit those constants, not the prose below.
 *
 * The "deal in plain words" panel below still hardcodes the locked
 * Step 1 numbers ($90,000/month, $69,700/month, ~$181,000 bridge,
 * Indigenous Services Canada 60-day cycle, $22,000 807 receivable
 * precedent) — those are guarded by the deck's lockedNumbers test and
 * are intentionally not part of the trial-offer source-of-truth.
 */
export default function RisksAsk() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            What could go wrong, and what we're asking
          </div>
          <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
            What could go wrong, and how we handle it.
            <span className="italic font-normal text-accent"> What we're asking from you.</span>
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[2vw] min-h-0">
          <div className="col-span-7 rounded-[0.4vw] p-[2vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="flex items-baseline justify-between gap-[1.5vw] mb-[1.4vh]">
              <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted min-w-0 flex-1">
                The seven things most likely to go wrong, and how we would handle each one
              </div>
              <div className="font-mono text-[1vw] text-muted shrink-0">Full list at the back</div>
            </div>

            <div className="grid grid-cols-12 gap-x-[1.2vw] gap-y-[1vh] font-body text-[0.95vw] leading-[1.4]">
              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">01</div>
              <div className="col-span-5 text-primary font-semibold">Internet goes down</div>
              <div className="col-span-6 text-muted">Till works offline · paper backup if needed · catches up weekly</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">02</div>
              <div className="col-span-5 text-primary font-semibold">Deliveries held up at season change</div>
              <div className="col-span-6 text-muted">Extra shelf inventory · planes booked ahead to fill the gap</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">03</div>
              <div className="col-span-5 text-primary font-semibold">Suppliers won't sell small orders</div>
              <div className="col-span-6 text-muted">Dryden hub pools orders with other stores on the route</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">04</div>
              <div className="col-span-5 text-primary font-semibold">Current store fights back on price</div>
              <div className="col-span-6 text-muted">Community ownership is something they can never copy. That's our edge.</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">05</div>
              <div className="col-span-5 text-primary font-semibold">Disagreements inside the band</div>
              <div className="col-span-6 text-muted">Council member on oversight from day one · everything open and on the record</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">06</div>
              <div className="col-span-5 text-primary font-semibold">People don't show up. Hunting, funerals, weather.</div>
              <div className="col-span-6 text-muted">Software runs the back end · everyone trained on every job · schedule bends around community life</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">07</div>
              <div className="col-span-5 text-primary font-semibold">Food spoils, or someone gets hurt</div>
              <div className="col-span-6 text-muted">Written cold-chain rules · spoilage logged not absorbed · full insurance</div>
            </div>
          </div>

          <div className="col-span-5 rounded-[0.4vw] px-[1.6vw] py-[1.4vw] flex flex-col" style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] mb-[0.6vh]" style={{ color: "#e9c8a8" }}>
              Naming the deal
            </div>
            <div className="font-display text-[1.7vw] leading-tight font-medium mb-[1vh]">
              One conversation. An honest opinion. An introduction when you're ready.
            </div>

            <div className="space-y-[0.5vh] font-body text-[0.85vw] leading-[1.35] opacity-95">
              <div className="flex gap-[0.6vw]">
                <div className="font-mono text-[0.85vw] pt-[0.1vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>One hour with the contractor. In person if possible. No slides.</div>
              </div>
              <div className="flex gap-[0.6vw]">
                <div className="font-mono text-[0.85vw] pt-[0.1vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>A straight answer on where this plan is right and where it's wrong.</div>
              </div>
              <div className="flex gap-[0.6vw]">
                <div className="font-mono text-[0.85vw] pt-[0.1vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>An introduction to the band council when the contractor says the time is right.</div>
              </div>
            </div>

            <div className="mt-[1vh] rounded-[0.3vw] px-[0.9vw] py-[0.8vh]" style={{ background: "rgba(233,200,168,0.18)", border: "1px solid rgba(233,200,168,0.55)" }}>
              <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] mb-[0.3vh]" style={{ color: "#e9c8a8" }}>
                Step 0 · Try us for eight weeks · the on-ramp
              </div>
              <div className="font-body text-[0.82vw] leading-[1.35] opacity-95">
                <span className="font-semibold">{TRIAL_HEADLINE}</span>{" "}
                {TRIAL_FEE_LINE} {TRIAL_NO_TEAM_LINE}{" "}
                <span className="font-semibold">
                  Solo deliverables in eight weeks:
                </span>
                <ol className="list-decimal pl-[1.4vw] mt-[0.3vh] mb-[0.3vh] space-y-[0.15vh]">
                  {TRIAL_ACCEPTANCE_CRITERIA.map((criterion) => (
                    <li key={criterion}>{criterion}</li>
                  ))}
                </ol>
                <span className="font-semibold">Refund:</span>{" "}
                {TRIAL_REFUND_MECHANIC}
              </div>
            </div>

            <div className="mt-[1vh] rounded-[0.3vw] px-[0.9vw] py-[0.8vh]" style={{ background: "rgba(244,237,224,0.08)" }}>
              <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] mb-[0.3vh]" style={{ color: "#e9c8a8" }}>
                The deal, in plain words
              </div>
              <div className="font-body text-[0.82vw] leading-[1.35] opacity-95">
                Step 0 above is the on-ramp. <span className="font-semibold">Step 1 is the full engagement: we bill $90,000 a month. Costs us $69,700 a month.</span> Replaces today's $35,000-a-month software-only contract. Now with the full team and accountability. We put 35% of what you pay back into the store. Outside reviewer every year. Day-one ask: <span className="font-semibold">about $181,000 in gap money</span> to cover team payroll and day-one equipment until the first band invoice clears. Indigenous Services Canada (the federal department that pays the band) takes about 60 days. Council picks the plan. Written payback promise on file from last time, $22,000.
              </div>
            </div>

            <div className="mt-[1vh] pt-[0.8vh] border-t" style={{ borderColor: "rgba(244,237,224,0.25)" }}>
              <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] opacity-70 mb-[0.3vh]">
                Five things we have to deliver
              </div>
              <div className="font-body text-[0.78vw] leading-[1.35] opacity-90">
                Money saved. Staff time saved. Open-records tools used. Local skill built. Year-end review. <span className="opacity-80">Worth less than what we charged? We credit the difference back. In writing.</span>
              </div>
              <div className="font-body text-[0.75vw] leading-[1.35] opacity-75 mt-[0.4vh]">
                Not asking for: cash up front · a piece of the band's ownership · an agreement that locks the store into buying only from us.
              </div>
              <div className="font-display italic text-[0.82vw] mt-[0.6vh]" style={{ color: "#e9c8a8" }}>
                — Headwaters. The work is paid for. The value comes back. Deer Lake earns it. Then every reserve does.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

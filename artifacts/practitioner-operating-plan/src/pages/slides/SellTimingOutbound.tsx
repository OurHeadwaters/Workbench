export default function SellTimingOutbound() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        {/* Header eyebrows — same shape as PathToScale / SecondAnchorScenarios so a
            reader walking the deck doesn't notice this slide is the new one. */}
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Sell-timing · when Pilot #2 outbound starts
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Day-90 audited proof point is the trigger
          </div>
        </div>

        <h1
          className="font-display font-medium text-[3.6vw] leading-[0.98] tracking-tight text-primary mb-[1vh]"
          style={{ textWrap: "balance" }}
        >
          Outbound starts at Day-90. Not before. Not after Pilot #2 finishes writing.
        </h1>
        <div className="font-display italic text-[1.4vw] text-muted mb-[2.5vh] max-w-[78vw]">
          Day-1 ships the working store. Day-90 produces the first audited value-delivered
          number and a live reference call. That number is the trigger to open 3–5
          named-prospect conversations — not a press release. Pilot #2 lands as a
          <em> paid engagement</em> on Day-180, the way Deer Lake did, not as a written
          deliverable authored before the sale.
        </div>

        {/* Day-1 / Day-90 / Day-180 timeline strip — same milestone vocabulary as
            the Deer Lake Store deck's FirstReserveThenTheNext strip and the
            Replication page's operating-rhythm callout, on purpose. */}
        <div className="bg-paper rounded-[6px] px-[2vw] py-[1.4vh] mb-[2vh]">
          <div className="flex items-baseline justify-between mb-[1vh]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.9vw] text-primary font-semibold">
              The timing spine — three milestones, in order
            </div>
            <div className="font-mono text-[0.85vw] text-muted">
              Same milestone vocabulary across all three docs
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[1.5vw]">
            {/* Day-1 */}
            <div className="border-t-[2px] border-rule pt-[0.8vh]">
              <div className="flex items-baseline justify-between mb-[0.3vh]">
                <div className="font-display text-[1.5vw] font-semibold text-primary">
                  Day-1
                </div>
                <div className="font-mono text-[0.78vw] text-muted uppercase tracking-[0.18em]">
                  Open
                </div>
              </div>
              <div className="font-body text-[1vw] text-text leading-[1.4]">
                Deer Lake store opens. Working POS, working freight lane, working
                transparency stack — not a pitch deck.
              </div>
            </div>
            {/* Day-90 — accent border, this is the trigger */}
            <div
              className="border-t-[2px] pt-[0.8vh]"
              style={{ borderColor: "var(--slide-accent)" }}
            >
              <div className="flex items-baseline justify-between mb-[0.3vh]">
                <div className="font-display text-[1.5vw] font-semibold text-primary">
                  Day-90
                </div>
                <div
                  className="font-mono text-[0.78vw] uppercase tracking-[0.18em]"
                  style={{ color: "var(--slide-accent)" }}
                >
                  Trigger fires
                </div>
              </div>
              <div className="font-body text-[1vw] text-text leading-[1.4]">
                First audited value-delivered number, signed by the band's bookkeeper.
                Reference call ready.{" "}
                <strong>Outbound to 3–5 named reserves opens this week.</strong>
              </div>
            </div>
            {/* Day-180 */}
            <div className="border-t-[2px] border-rule pt-[0.8vh]">
              <div className="flex items-baseline justify-between mb-[0.3vh]">
                <div className="font-display text-[1.5vw] font-semibold text-primary">
                  Day-180
                </div>
                <div className="font-mono text-[0.78vw] text-muted uppercase tracking-[0.18em]">
                  Pilot #2 signed
                </div>
              </div>
              <div className="font-body text-[1vw] text-text leading-[1.4]">
                Pilot #2 signed as a paid engagement. The case study writes itself out
                of the work, not the other way around.
              </div>
            </div>
          </div>
        </div>

        {/* Three failure modes — the calls this slide is making against. */}
        <div className="grid grid-cols-3 gap-[1.4vw] flex-1 mb-[1.5vh]">
          <div className="bg-paper px-[1.4vw] py-[1.6vh] flex flex-col rounded-[6px] border-l-[3px] border-rule">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.78vw] text-muted mb-[0.6vh] font-semibold">
              Failure mode · A
            </div>
            <div className="font-display text-[1.4vw] leading-[1.1] text-primary mb-[1vh] font-medium">
              Sell before the proof point.
            </div>
            <div className="font-body text-[0.98vw] text-text leading-[1.45]">
              Outbound that opens before Day-90 has nothing to point at except a thesis.
              The receiving band hears a pitch, not a precedent. We've been here
              before — it's the V2 mistake, replayed.
            </div>
          </div>

          <div className="bg-paper px-[1.4vw] py-[1.6vh] flex flex-col rounded-[6px] border-l-[3px] border-rule">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.78vw] text-muted mb-[0.6vh] font-semibold">
              Failure mode · B
            </div>
            <div className="font-display text-[1.4vw] leading-[1.1] text-primary mb-[1vh] font-medium">
              Wait for Pilot #2 to finish writing.
            </div>
            <div className="font-body text-[0.98vw] text-text leading-[1.45]">
              Treating Pilot #2 as a written deliverable that has to land before the
              sale inverts the order. Pilot #2 <em>is</em> the sale. The case study
              comes out of the paid engagement, not in front of it.
            </div>
          </div>

          <div className="bg-paper px-[1.4vw] py-[1.6vh] flex flex-col rounded-[6px] border-l-[3px] border-rule">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.78vw] text-muted mb-[0.6vh] font-semibold">
              Failure mode · C
            </div>
            <div className="font-display text-[1.4vw] leading-[1.1] text-primary mb-[1vh] font-medium">
              Tinker without a buyer in the loop.
            </div>
            <div className="font-body text-[0.98vw] text-text leading-[1.45]">
              Open-ended polishing of the system between Day-90 and an undated Pilot #2
              burns the trigger. If outbound isn't named on Day-90, the audit becomes
              décor instead of a sales asset.
            </div>
          </div>
        </div>

        {/* Bottom row — the outbound shape (left) + what's queued for separate work (right) */}
        <div className="bg-paper rounded-[6px] px-[1.6vw] py-[1.2vh] grid grid-cols-12 gap-[1.2vw]">
          <div
            className="col-span-7 border-l-[3px] pl-[1.2vw]"
            style={{ borderColor: "var(--slide-accent)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent mb-[0.4vh] font-semibold">
              The outbound shape — 3 to 5 named reserves
            </div>
            <div className="font-body text-[0.98vw] text-text leading-[1.45]">
              Not a posted page, not a press release. A short bench of 3–5 named reserves
              carried into Day-90 by the practitioner — each one with a known contractor
              relationship, a known band-council door, and a candidate-scoring sheet that
              was filled in <em>before</em> the trigger fires. Outbound on Day-90 is one
              phone call per prospect, with the audited number in hand.
            </div>
          </div>
          <div className="col-span-5">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.8vw] text-muted mb-[0.4vh] font-semibold">
              Queued for separate work
            </div>
            <div className="font-body text-[0.9vw] text-muted leading-[1.4]">
              The named-prospect list, the Day-90 audit template, and the outreach kit
              are queued as their own tracked tasks — this slide is the <em>timing</em>{" "}
              call, not the assets. Building those first would invert the failure modes
              above.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

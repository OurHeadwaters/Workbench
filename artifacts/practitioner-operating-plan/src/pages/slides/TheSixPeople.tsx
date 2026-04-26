export default function TheSixPeople() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              The lean roster · 02
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Where V2 had eight, V3 has six
          </div>
        </div>

        <h1 className="font-display font-medium text-[4.4vw] leading-[0.98] tracking-tight text-primary mb-[1vh]" style={{ textWrap: "balance" }}>
          The six people.
        </h1>
        <div className="font-display italic text-[1.55vw] text-muted mb-[3vh] max-w-[68vw]">
          Same work as V2, but no double-payment. Food Handler and Ops Manager fold into the Hub Operator. Housecleaner, Handyman, and Tutor are not Headwaters' to staff. Recurring people: <span className="text-primary font-semibold not-italic">$33,000/mo</span>. Variable amortized: <span className="text-primary font-semibold not-italic">$2,625/mo</span>.
        </div>

        <div className="grid grid-cols-3 gap-[1.6vw] flex-1">
          <div className="bg-paper border-t-[3px] border-primary px-[1.5vw] py-[2vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[0.6vh]">
              01 · Founder
            </div>
            <div className="font-display text-[1.85vw] leading-[1.05] text-primary mb-[0.8vh]">
              Practitioner
            </div>
            <div className="font-display text-[2.4vw] font-semibold text-accent leading-[1] mb-[1vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $18,000<span className="text-[1.1vw] text-muted font-normal"> /mo</span>
            </div>
            <div className="font-body text-[1.15vw] leading-[1.45] text-text">
              Build, advisory, monthly Deer Lake visit. Carries the relationship and the codebase.
            </div>
          </div>

          <div className="bg-paper border-t-[3px] border-primary px-[1.5vw] py-[2vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[0.6vh]">
              02 · Remote
            </div>
            <div className="font-display text-[1.85vw] leading-[1.05] text-primary mb-[0.8vh]">
              Bookkeeper, part-time
            </div>
            <div className="font-display text-[2.4vw] font-semibold text-accent leading-[1] mb-[1vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $2,500<span className="text-[1.1vw] text-muted font-normal"> /mo</span>
            </div>
            <div className="font-body text-[1.15vw] leading-[1.45] text-text">
              Numbers stay clean without a full hire. Reconciliation, monthly close, payroll prep.
            </div>
          </div>

          <div className="bg-paper border-t-[3px] border-primary px-[1.5vw] py-[2vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[0.6vh]">
              03 · Dryden
            </div>
            <div className="font-display text-[1.85vw] leading-[1.05] text-primary mb-[0.8vh]">
              Hub Operator
            </div>
            <div className="font-display text-[2.4vw] font-semibold text-accent leading-[1] mb-[1vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $8,500<span className="text-[1.1vw] text-muted font-normal"> /mo loaded</span>
            </div>
            <div className="font-body text-[1.15vw] leading-[1.45] text-text">
              Salt + piecework + Deer Lake coordination + phone. The role that absorbs Food Handler and Ops Manager from V2.
            </div>
          </div>

          <div className="bg-paper border-t-[3px] border-accent px-[1.5vw] py-[2vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[0.6vh]">
              04 · Retainer
            </div>
            <div className="font-display text-[1.85vw] leading-[1.05] text-primary mb-[0.8vh]">
              Technical advisor
            </div>
            <div className="font-display text-[2.4vw] font-semibold text-accent leading-[1] mb-[1vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $2,500<span className="text-[1.1vw] text-muted font-normal"> /mo</span>
            </div>
            <div className="font-body text-[1.15vw] leading-[1.45] text-text">
              Quarterly architecture review, on-call for emergencies, code review on money-touching merges. Hedge against solo-developer risk.
            </div>
          </div>

          <div className="bg-paper border-t-[3px] border-accent px-[1.5vw] py-[2vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[0.6vh]">
              05 · Retainer + per-cohort
            </div>
            <div className="font-display text-[1.85vw] leading-[1.05] text-primary mb-[0.8vh]">
              Training partner
            </div>
            <div className="font-display text-[2.4vw] font-semibold text-accent leading-[1] mb-[1vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $1,500<span className="text-[1.1vw] text-muted font-normal"> /mo + $5,500/cohort</span>
            </div>
            <div className="font-body text-[1.15vw] leading-[1.45] text-text">
              Indigenous educator voice. Three cohorts a year. Successor is local — train-the-trainer is the design, not a stretch goal.
            </div>
          </div>

          <div className="bg-paper border-t-[3px] border-accent px-[1.5vw] py-[2vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[0.6vh]">
              06 · Deer Lake
            </div>
            <div className="font-display text-[1.85vw] leading-[1.05] text-primary mb-[0.8vh]">
              Casual local pod
            </div>
            <div className="font-display text-[2.4vw] font-semibold text-accent leading-[1] mb-[1vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $15,000<span className="text-[1.1vw] text-muted font-normal"> /yr</span>
            </div>
            <div className="font-body text-[1.15vw] leading-[1.45] text-text">
              Sized above bare labor math. Employment + community-goodwill envelope: market days, food at events, headroom for extra hands.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

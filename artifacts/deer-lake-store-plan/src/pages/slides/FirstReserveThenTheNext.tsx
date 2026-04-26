export default function FirstReserveThenTheNext() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            What this is the start of
          </div>
          <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
            First reserve.
            <span className="italic font-normal text-accent"> Then the next.</span>
          </h2>
        </div>

        <div
          className="rounded-[0.4vw] p-[2.4vw] mb-[2.5vh]"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div
            className="font-mono uppercase tracking-[0.22em] text-[1.05vw] mb-[1.2vh]"
            style={{ color: "#e9c8a8" }}
          >
            The premise
          </div>
          <div className="font-display italic text-[2.1vw] leading-[1.25]">
            Northern reserves need infrastructure as materially good as anything in the south, built on the foundation that's actually there, with materials and methods that fit it.
            <span className="not-italic font-medium"> Not less. Different.</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.6vw] min-h-0 mb-[2vh]">
          <div className="rounded-[0.4vw] p-[1.8vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">THE SOFTWARE</div>
            <div className="font-display text-[1.65vw] leading-tight text-primary font-medium mb-[1vh]">
              Built once. Owned by the band that bought it. Reusable on the next reserve.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              The till, the price dashboard, the household lookup, the offline-first stack, the bookkeeping pipeline. Source code and data sit with the band that ordered it. The next community gets a working system on day one — not a slide deck.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.8vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">THE TRAINING</div>
            <div className="font-display text-[1.65vw] leading-tight text-primary font-medium mb-[1vh]">
              The practitioner travels reserve to reserve. Deer Lake grads steward Deer Lake.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              The practitioner is the cross-reserve discipline-keeper — the one who shows up at reserve #2, #3, #4 to install Codetry until it's the norm there. Deer Lake graduates are the local stewards of <em>their own</em> store's discipline; they don't get sent on the road. An Indigenous education partner co-runs every install. The next reserve doesn't start from scratch — they start from what worked here, adapted to who they are.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.8vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">THE TRANSPARENCY STACK</div>
            <div className="font-display text-[1.65vw] leading-tight text-primary font-medium mb-[1vh]">
              The patterns travel. The audit clause travels.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              Public price dashboard, household lookup, year-end value-delivered audit with the forward-credit clause. The shape of "you can see what we charged and what we delivered" is the part the next council can hold us to from day one.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] px-[2vw] py-[1.6vh] grid grid-cols-12 gap-[2vw] items-baseline"
          style={{ background: "var(--slide-paper)", borderLeft: "0.4vw solid var(--slide-accent)" }}
        >
          <div className="col-span-4 font-mono uppercase tracking-[0.22em] text-[1.05vw] text-accent">
            What it means in dollars
          </div>
          <div className="col-span-8 font-body text-[1.15vw] text-primary leading-[1.45]">
            <span className="font-semibold">Software is reusable; the practitioner's install is paid premium.</span> The receiving reserve pays <span className="font-semibold">$3,500/on-site day · $1,800/remote day · $30k/yr discipline-keeper retainer</span>. A typical 12-week install (~30 on-site + ~24 remote) lands at <span className="font-semibold">~$148.5k per reserve</span>, plus the recurring retainer. <span className="text-muted">Travel, lodging, and food are passed through to the receiving reserve at cost — not part of the fee.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

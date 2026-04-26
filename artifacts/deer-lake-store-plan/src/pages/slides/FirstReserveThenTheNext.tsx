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

        <div className="grid grid-cols-12 gap-[1.2vw]">
          <div
            className="col-span-7 rounded-[0.4vw] px-[1.6vw] py-[1.3vh]"
            style={{ background: "var(--slide-paper)", borderLeft: "0.4vw solid var(--slide-accent)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent mb-[0.5vh]">
              Practitioner revenue · per install
            </div>
            <div className="font-body text-[1vw] text-primary leading-[1.4]">
              <span className="font-semibold">Software is reusable; the install is paid premium.</span> Receiving reserve pays <span className="font-semibold">$3,500/on-site day · $1,800/remote day · $30k/yr retainer</span>. A 12-week install (~30 on-site + ~24 remote) lands at <span className="font-semibold">~$148.5k per reserve</span>, plus the recurring retainer. <span className="text-muted">Travel, lodging, food are passed through at cost — not in the fee.</span>
            </div>
          </div>

          <div
            className="col-span-5 rounded-[0.4vw] px-[1.4vw] py-[1.3vh]"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="flex items-baseline justify-between mb-[0.4vh]"
              style={{ color: "#e9c8a8" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw]">
                Reserve #2 · Y1 all-in
              </div>
              <div
                className="font-display text-[1.6vw] font-medium"
                style={{ color: "var(--slide-bg)", fontVariantNumeric: "tabular-nums" }}
              >
                ~$201,000
              </div>
            </div>
            <div className="font-body text-[0.95vw] leading-[1.35] mb-[0.3vh]" style={{ color: "var(--slide-bg)" }}>
              <span className="font-semibold">$148.5k install</span> + <span className="font-semibold">~$22.5k travel pass-through</span><sup className="text-[0.7em]">*</sup> + <span className="font-semibold">$30k Y1 retainer</span>.
            </div>
            <div className="font-body text-[0.78vw] leading-[1.3]" style={{ color: "#e9c8a8" }}>
              <sup>*</sup> Planning estimate · Deer Lake corridor: ~$1,000/return × 12 wks + $250/night × 30 + $100/day × 30. Replace with your corridor's own cost.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

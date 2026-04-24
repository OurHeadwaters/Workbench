export default function RisksAsk() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            06 · What could go wrong, and what we're asking
          </div>
          <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
            What could go wrong, and how we handle it.
            <span className="italic font-normal text-accent"> What we're asking from you.</span>
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[2vw] min-h-0">
          <div className="col-span-7 rounded-[0.4vw] p-[2vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="flex items-baseline justify-between mb-[1.4vh]">
              <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted">
                The six things most likely to go wrong — and how we'd handle each one
              </div>
              <div className="font-mono text-[1vw] text-muted">Full list at the back</div>
            </div>

            <div className="grid grid-cols-12 gap-x-[1.2vw] gap-y-[1.2vh] font-body text-[1vw] leading-[1.4]">
              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">01</div>
              <div className="col-span-5 text-primary font-semibold">Internet goes down</div>
              <div className="col-span-6 text-muted">The till keeps working offline · paper backup if it has to · catches up automatically every week</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">02</div>
              <div className="col-span-5 text-primary font-semibold">Deliveries get held up when the season changes</div>
              <div className="col-span-6 text-muted">Extra inventory on the shelf to ride it out · planes booked in advance to fill the gap</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">03</div>
              <div className="col-span-5 text-primary font-semibold">Suppliers won't sell us small enough orders</div>
              <div className="col-span-6 text-muted">807 pools the order with other stores on the route, so the supplier sees a big enough number to ship</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">04</div>
              <div className="col-span-5 text-primary font-semibold">The current store fights back on price</div>
              <div className="col-span-6 text-muted">A store the community owns is something the current store can never copy — that's our edge</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">05</div>
              <div className="col-span-5 text-primary font-semibold">Disagreements inside the band about how the store is run</div>
              <div className="col-span-6 text-muted">A band council member sits on the store's oversight from day one · everything is open and on the record</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">06</div>
              <div className="col-span-5 text-primary font-semibold">Food spoils, or someone gets hurt in band housing</div>
              <div className="col-span-6 text-muted">Written rules for keeping food cold, top to bottom · full insurance that covers the people staying in band housing</div>
            </div>
          </div>

          <div className="col-span-5 rounded-[0.4vw] p-[2vw] flex flex-col" style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}>
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] mb-[1vh]" style={{ color: "#e9c8a8" }}>
              What we're asking
            </div>
            <div className="font-display text-[2.2vw] leading-tight font-medium mb-[2vh]">
              One conversation. An honest opinion. An introduction when you're ready.
            </div>

            <div className="space-y-[1.4vh] font-body text-[1.05vw] leading-[1.45] opacity-95">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>An hour with the contractor, in person if possible — no slides, just a conversation.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>A straight answer on where this plan is right and where it's wrong.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>An introduction to the band council when the contractor decides the time is right — never before.</div>
              </div>
            </div>

            <div className="mt-auto pt-[2vh] border-t" style={{ borderColor: "rgba(244,237,224,0.25)" }}>
              <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-70 mb-[0.5vh]">
                What we are not asking for
              </div>
              <div className="font-body text-[1.1vw] leading-[1.45] opacity-85">
                No cash up front. No piece of the band's ownership. No promise to use only us as a supplier. No commitment from the band before the contractor is ready.
              </div>
              <div className="font-display italic text-[1.1vw] mt-[1.4vh]" style={{ color: "#e9c8a8" }}>
                — 807 Food Co-operative Inc.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

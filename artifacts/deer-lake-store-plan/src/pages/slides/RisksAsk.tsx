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
            <div className="flex items-baseline justify-between mb-[1.4vh]">
              <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted">
                The seven things most likely to go wrong, and how we would handle each one
              </div>
              <div className="font-mono text-[1vw] text-muted">Full list at the back</div>
            </div>

            <div className="grid grid-cols-12 gap-x-[1.2vw] gap-y-[1vh] font-body text-[0.95vw] leading-[1.4]">
              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">01</div>
              <div className="col-span-5 text-primary font-semibold">Internet goes down</div>
              <div className="col-span-6 text-muted">The till keeps working offline · paper backup if it has to · catches up automatically every week</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">02</div>
              <div className="col-span-5 text-primary font-semibold">Deliveries get held up when the season changes</div>
              <div className="col-span-6 text-muted">Extra inventory on the shelf to ride it out · planes booked in advance to fill the gap</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">03</div>
              <div className="col-span-5 text-primary font-semibold">Suppliers won't sell us small enough orders</div>
              <div className="col-span-6 text-muted">The Dryden hub pools the order with other stores on the same route, so the supplier sees a number big enough to ship</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">04</div>
              <div className="col-span-5 text-primary font-semibold">The current store fights back on price</div>
              <div className="col-span-6 text-muted">A store the community owns is something the current store can never copy. That is our edge.</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">05</div>
              <div className="col-span-5 text-primary font-semibold">Disagreements inside the band about how the store is run</div>
              <div className="col-span-6 text-muted">A band council member sits on the store's oversight from day one · everything is open and on the record</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">06</div>
              <div className="col-span-5 text-primary font-semibold">People do not show up. Hunting season, funerals, weather.</div>
              <div className="col-span-6 text-muted">The store is built around that · software runs the back end · everyone is trained on every job so they can cover each other · the schedule bends around community life by default</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.05vw] pt-[0.2vh]">07</div>
              <div className="col-span-5 text-primary font-semibold">Food spoils, or someone gets hurt</div>
              <div className="col-span-6 text-muted">Written rules for keeping food cold, top to bottom · spoilage logged not absorbed · full insurance covers staff and the building</div>
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
                <div>One hour with the contractor. In person if possible. No slides. Just a conversation.</div>
              </div>
              <div className="flex gap-[0.6vw]">
                <div className="font-mono text-[0.85vw] pt-[0.1vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>A straight answer on where this plan is right and where it is wrong.</div>
              </div>
              <div className="flex gap-[0.6vw]">
                <div className="font-mono text-[0.85vw] pt-[0.1vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>An introduction to the band council when the contractor decides the time is right. Never before.</div>
              </div>
            </div>

            <div className="mt-[1vh] rounded-[0.3vw] px-[0.9vw] py-[0.8vh]" style={{ background: "rgba(244,237,224,0.08)" }}>
              <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] mb-[0.3vh]" style={{ color: "#e9c8a8" }}>
                The deal, in plain words
              </div>
              <div className="font-body text-[0.82vw] leading-[1.35] opacity-95">
                Recommended plan: <span className="font-semibold">we bill $90,000 a month. It costs us $69,700 a month.</span> This is for the full Headwaters team. It replaces today's $35,000-a-month software-only contract. Same client. Same software. With the full team and accountability around it. We put 35% of what you pay back into building the store. An outside reviewer checks this every year. Day-one ask: <span className="font-semibold">about $181,000 in money to cover the gap</span>. The gap is the team payroll and the day-one equipment we buy, before the first invoice from the band gets paid. (Indigenous Services Canada, the federal department that pays the band, takes about 60 days to pay each invoice.) Which plan to pick and how big the gap money is, that is up to the council. We have a written payback promise on file from last time, for $22,000.
              </div>
            </div>

            <div className="mt-[1vh] pt-[0.8vh] border-t" style={{ borderColor: "rgba(244,237,224,0.25)" }}>
              <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] opacity-70 mb-[0.3vh]">
                Five things we have to deliver
              </div>
              <div className="font-body text-[0.78vw] leading-[1.35] opacity-90">
                Money saved on buying. Time saved for band staff. Open-records tools delivered and used. Local skill built up. Year-end check by an outside reviewer. <span className="opacity-80">If what we delivered is worth less than what we charged, we credit the difference back. In writing.</span>
              </div>
              <div className="font-body text-[0.75vw] leading-[1.35] opacity-75 mt-[0.4vh]">
                We are not asking for: cash up front. A piece of the band's ownership. Supplier exclusivity.
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

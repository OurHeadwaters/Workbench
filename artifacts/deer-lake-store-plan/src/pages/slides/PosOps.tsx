export default function PosOps() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              The first morning
            </div>
            <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
              Walk in on your first morning.
              <span className="italic font-normal text-accent block mt-[0.4vh]">Use the till without any training.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              See it for yourself
            </div>
            <div className="font-body text-[1.1vw] text-primary leading-[1.4]">
              A working copy of the till sits beside this deck. You can press the buttons yourself.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[2vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[2.4vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[1vh]">
              The till. Set up for Deer Lake.
            </div>
            <div className="font-display text-[1.9vw] leading-tight text-primary font-medium mb-[2vh]">
              Big buttons on a touchscreen. Nothing hidden in menus. No business words.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.15vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">Works when the internet drops.</span> The till keeps taking sales. Catches up later.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">Bank, till, and price changes are locked to named people.</span> No one else can change them.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">End of day prints one clean slip.</span> Goes straight into the books. No box of receipts.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">The till tells the manager when to reorder.</span> Uses the next truck's date.</div>
              </div>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[2.4vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] opacity-80 mb-[1vh]">
              Honest pricing
            </div>
            <div className="font-display text-[1.9vw] leading-tight font-medium mb-[2vh]">
              The federal grocery help shows up on the price tag. The shipping cost is printed where you can see it.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.15vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">Shipping is added by the system, by category.</span> The cashier never does it at the till.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">Items without help money show shipping on the tag.</span> People see what they pay for, and why.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">The federal grocery help claim builds itself</span> from daily sales. Sent once a month.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">Spoiled food is logged.</span> Truck breakdown or freezer failure. The loss is never hidden.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">One manager screen.</span> Shows what's on the shelf, what's on the next truck, what to reorder today.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

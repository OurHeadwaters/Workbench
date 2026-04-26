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
              Walk on the job your first morning.
              <span className="italic font-normal text-accent block mt-[0.4vh]">Figure out the till without training.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              See it for yourself
            </div>
            <div className="font-body text-[1.1vw] text-primary leading-[1.4]">
              A working version of the till sits beside this deck — you can press the buttons yourself and see what a Deer Lake cashier would see on day one.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[2vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[2.4vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[1vh]">
              The till — set up for Deer Lake
            </div>
            <div className="font-display text-[1.9vw] leading-tight text-primary font-medium mb-[2vh]">
              Big buttons on a touchscreen. Nothing hidden in menus. No business words.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.15vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">Works when the internet drops.</span> Deer Lake's connection cuts out almost every day. The till keeps ringing sales and catches up later — no waiting around.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">Bank, till settings and price changes are locked to named people.</span> Nobody without the right job can touch them — not even by accident, not even if they're standing right at the till.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">End of day prints one clean slip.</span> The bookkeeper drops it straight into the books — no shoebox of receipts, no late-night reconciling, no guesswork.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">Pay-day tabs for community members</span> can be turned on, but only after the band council writes a clear policy on how it works and who qualifies.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">The till tells the manager when to reorder</span> based on when the next truck is coming, so we never order at the wrong time.</div>
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
              The federal grocery subsidy actually shows up on the price tag. Freight cost is printed where you can see it.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.15vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">Freight cost is added to the price automatically by category</span> when items go into the system, not by the cashier at the till. Every milk carton has the same rule applied; nobody has to remember it.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">For items that don't qualify for the subsidy, the shelf tag prints what the freight cost was.</span> The community sees exactly what they're paying for and why.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">The Nutrition North subsidy claim builds itself</span> from the daily sales — a manager checks it weekly and sends it monthly. Books are ready for review at any time.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">If food spoils, it gets logged.</span> Whether the truck broke down or the freezer failed, the problem gets written down — not quietly absorbed.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">One screen for the manager</span>, built by Headwaters with the Deer Lake store's name on it: what's on the shelf, what's on the next truck, what to reorder today. Same transparency stack as the public price dashboard and the household lookup — one set of records, one source of truth.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
              A working copy of the till sits beside this deck. You can press the buttons yourself. You will see what a Deer Lake cashier would see on day one.
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
                <div><span className="font-semibold">Works when the internet drops.</span> Deer Lake's internet stops working almost every day. The till keeps taking sales. It catches up later. No one has to wait.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">Bank settings, till settings, and price changes are locked to named people.</span> Anyone else can not change them. Not by accident. Not even if they are standing right at the till.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">End of day prints one clean slip.</span> The bookkeeper puts it straight into the books. No box of receipts. No late nights checking numbers. No guessing.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">Pay-day tabs for community members</span> can be turned on. But only after the band council writes a clear rule on how it works and who can use it.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div><span className="font-semibold">The till tells the manager when to reorder.</span> It uses the next truck's date. We never order at the wrong time.</div>
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
              The federal grocery help money shows up on the price tag. The shipping cost is printed where you can see it.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.15vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">The shipping cost is added to the price by the system, by category, when items are loaded in.</span> The cashier never has to do this at the till. Every milk carton uses the same rule. Nobody has to remember it.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">For items that do not qualify for the help money, the shelf tag prints the shipping cost.</span> The community sees what they are paying for, and why.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">The federal grocery help money claim builds itself</span> from the daily sales. A manager checks it once a week. The store sends it once a month. The books are ready for review any time.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">If food spoils, the system writes it down.</span> Truck breakdown or freezer failure. Both get recorded. The loss is never quietly hidden in the numbers.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div><span className="font-semibold">One screen for the manager</span>, built by Headwaters with the Deer Lake store's name on it. It shows what is on the shelf, what is on the next truck, and what to reorder today. Same open-records system as the public price page and the household lookup. One set of records. One place to look.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

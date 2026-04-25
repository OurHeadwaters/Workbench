export default function StaffingModel() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              03 · Who works the store
            </div>
            <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
              Trained people fly in to start.
              <span className="italic font-normal text-accent"> Deer Lake takes over by month 12.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[34vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              The biggest thing that could go wrong
            </div>
            <div className="font-body text-[1.25vw] text-primary leading-[1.35]">
              Northern stores collapse when they assume local staff can run a brand-new operation from day one. Deer Lake doesn't have to figure that out alone — we bring trained people who've done it before.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[1.4vw] mb-[2vh] flex items-center justify-between gap-[2vw]"
          style={{ background: "var(--slide-paper)", borderLeft: "0.4vw solid var(--slide-accent)" }}
        >
          <div className="shrink-0">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[0.4vh]">
              Day-1 Headwaters embed
            </div>
            <div className="font-display text-[1.5vw] leading-tight text-primary font-medium">
              Food Handler · on the floor from the day the store opens
            </div>
          </div>
          <div className="font-body text-[1vw] text-text leading-[1.45] max-w-[52vw]">
            One Headwaters-owned <span className="text-primary font-semibold">Food Handler</span> is
            embedded at the store from Day 1: salt-line kitchen handling on
            batch days, 807-branded piecework, kitchen + equipment tidy, shop
            and office cleanup, and food/supplies inventory. They aren't part
            of the rotation above — they're a permanent agency role at the
            store, paid out of the practitioner budget rather than the store
            P&amp;L, so the band's grocery margin isn't carrying that line.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-[1.4vw] min-h-0 mb-[2.5vh]">
          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">01 · HOW IT'S SET UP</div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              4 weeks on, 2 weeks home
            </div>
            <div className="font-body text-[1vw] text-muted leading-[1.45]">
              The band provides housing for the people who fly in — that's what makes the job attractive enough to fill. No extra cost to the store; the housing the band already has becomes the reason staff say yes.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">02 · WHY PEOPLE TAKE THE JOB</div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              Good money, rent covered
            </div>
            <div className="font-body text-[1vw] text-muted leading-[1.45]">
              Same setup as Australian mining-town work that always fills its jobs. A worker doing $25/hr × 60 hr/wk × 9 rotations earns about <span className="text-primary font-semibold">$54k with rent paid for</span>.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">03 · HANDING IT OVER</div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              The mix flips during year one
            </div>
            <div className="font-body text-[1vw] text-muted leading-[1.45]">
              Month 1: about 80% from out of town, 20% from Deer Lake. Month 12: about 20% from out of town, 80% from Deer Lake. Training local staff starts in month 2 and never stops.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">04 · WHY IT WORKS</div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              Trained people on day one, local managers by year-end
            </div>
            <div className="font-body text-[1vw] text-muted leading-[1.45]">
              The person flying in <span className="text-primary font-semibold">is</span> the trainer. The person from Deer Lake <span className="text-primary font-semibold">is</span> the future manager. The current store's "hire local and hope" approach is exactly what doesn't work.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[2vw]"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div className="flex items-center justify-between mb-[1.4vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] opacity-80">
              First 12 months · the handover from out-of-town to local staff
            </div>
            <div className="font-mono text-[1.05vw] opacity-70">
              <span style={{ color: "#e9c8a8" }}>■</span> Flown in from out of town · <span className="opacity-80">■</span> Hired in Deer Lake
            </div>
          </div>
          <div className="grid grid-cols-12 gap-[0.8vw] items-end h-[12vh]">
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "80%", background: "#e9c8a8" }} /><div style={{ height: "20%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M1</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "78%", background: "#e9c8a8" }} /><div style={{ height: "22%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M2</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "72%", background: "#e9c8a8" }} /><div style={{ height: "28%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M3</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "65%", background: "#e9c8a8" }} /><div style={{ height: "35%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M4</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "58%", background: "#e9c8a8" }} /><div style={{ height: "42%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M5</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "52%", background: "#e9c8a8" }} /><div style={{ height: "48%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M6</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "46%", background: "#e9c8a8" }} /><div style={{ height: "54%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M7</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "40%", background: "#e9c8a8" }} /><div style={{ height: "60%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M8</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "34%", background: "#e9c8a8" }} /><div style={{ height: "66%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M9</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "28%", background: "#e9c8a8" }} /><div style={{ height: "72%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M10</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "24%", background: "#e9c8a8" }} /><div style={{ height: "76%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M11</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "20%", background: "#e9c8a8" }} /><div style={{ height: "80%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M12</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

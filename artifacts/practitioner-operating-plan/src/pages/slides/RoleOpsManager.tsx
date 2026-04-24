export default function RoleOpsManager() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              II · Role 01 — Operations Manager
            </div>
            <h2
              className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              The phone-holder.
              <span className="italic font-normal text-accent"> The time-protector.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
              Location
            </div>
            <div className="font-display text-[1.7vw] text-primary leading-tight font-medium">
              Dryden, on-site
            </div>
            <div className="font-body text-[1.05vw] text-muted mt-[0.5vh] leading-[1.4]">
              Dual-purpose: 807 ops + Deer Lake aggregation &amp; distribution.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[1.4vw] min-h-0">
          <div
            className="col-span-7 rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1vw] text-accent font-semibold mb-[1.5vh]">
              What this takes off my plate
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.2vw] leading-[1.45] text-text">
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  The phone. Driver questions, supplier confirmations, the small
                  fires — none of it routes to me first.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  Dryden depot: receiving, sorting, loading. The hands the
                  schedule runs through.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  The 11am / 4pm hand-offs. They prepare the call; I show up
                  and decide.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  Coverage when I'm with the kids, on the ice, or off the grid.
                  Single point of failure → none.
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-5 flex flex-col gap-[1.2vw]">
            <div
              className="rounded-[0.4vw] p-[1.6vw]"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
                Hours
              </div>
              <div className="font-display text-[2.6vw] text-primary font-medium leading-none">
                40 / week
              </div>
              <div className="font-body text-[1.05vw] text-muted mt-[0.6vh] leading-[1.4]">
                On-site Mon–Fri. Banked weekend coverage on rotation.
              </div>
            </div>

            <div
              className="rounded-[0.4vw] p-[1.6vw]"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
                Rate
              </div>
              <div className="font-display text-[2.6vw] text-primary font-medium leading-none">
                $40 / hr
              </div>
              <div className="font-body text-[1.05vw] text-muted mt-[0.6vh] leading-[1.4]">
                Inside my own benchmark: $25 buys low-skill, $35–$45 buys
                capable. We pay $40 to actually attract real.
              </div>
            </div>

            <div
              className="rounded-[0.4vw] p-[1.6vw]"
              style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.95vw] mb-[0.5vh]"
                style={{ color: "#e9c8a8" }}
              >
                Monthly
              </div>
              <div className="font-display text-[2.8vw] font-medium leading-none">
                ~$7,000
              </div>
              <div className="font-body text-[1.05vw] mt-[0.6vh] leading-[1.4] opacity-85">
                The single most expensive line. Everything else only works
                because this one does.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

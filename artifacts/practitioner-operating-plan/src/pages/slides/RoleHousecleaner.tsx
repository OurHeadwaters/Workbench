export default function RoleHousecleaner() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              II · Role 03 — Housecleaner
            </div>
            <h2
              className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              The mess reset.
              <span className="italic font-normal text-accent"> Off the parent, on the schedule.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
              Cadence
            </div>
            <div className="font-display text-[1.7vw] text-primary leading-tight font-medium">
              Weekly · Tuesdays
            </div>
            <div className="font-body text-[1.05vw] text-muted mt-[0.5vh] leading-[1.4]">
              Mid-week reset so the house is in shape on the days that matter
              most.
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
                  Floors, bathrooms, kitchen deep-clean. The work that
                  compounds when ignored.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  The Sunday-evening "everything's a disaster" spiral that
                  steals Monday's morning.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  The mental load of remembering what hasn't been cleaned
                  this week.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  The shame-loop that says I should be doing this myself.
                  This is a structural fix, not a luxury.
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
                4 / week
              </div>
              <div className="font-body text-[1.05vw] text-muted mt-[0.6vh] leading-[1.4]">
                One half-day. In and out by lunch.
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
                $30 / hr
              </div>
              <div className="font-body text-[1.05vw] text-muted mt-[0.6vh] leading-[1.4]">
                A modest premium over the $25 floor — buys reliability and the
                same person every week.
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
                ~$500
              </div>
              <div className="font-body text-[1.05vw] mt-[0.6vh] leading-[1.4] opacity-85">
                The cheapest line on the budget. Disproportionate return on the
                weekly mood.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

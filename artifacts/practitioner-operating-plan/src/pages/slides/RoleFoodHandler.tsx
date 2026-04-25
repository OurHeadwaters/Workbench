import { useCostValue } from "../../lib/costReview";
import { CostReviewButton } from "../../components/CostReviewButton";

export default function RoleFoodHandler() {
  const rate = useCostValue("rate.foodHandler");
  const monthly = useCostValue("role.monthly.foodHandler");
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              II · Role 03 — Food Handler (embedded at the Deer Lake store)
            </div>
            <h2
              className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Salt batches, 807 piecework, store kitchen.
              <span className="italic font-normal text-accent"> One pair of hands holds the floor.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
              Where they sit
            </div>
            <div className="font-display text-[1.7vw] text-primary leading-tight font-medium">
              Headwaters-owned · Day 1 at the store
            </div>
            <div className="font-body text-[1.05vw] text-muted mt-[0.5vh] leading-[1.4]">
              Paid out of the practitioner budget — not the store P&amp;L —
              so the band's grocery margin doesn't carry the line.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[1.4vw] min-h-0">
          <div
            className="col-span-7 rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1vw] text-accent font-semibold mb-[1.5vh]">
              What this takes off everyone else's plate
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.2vw] leading-[1.45] text-text">
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  Salt-line kitchen handling on batch days. Everyone pitches in
                  on the run, but the prep, the cleanup, and the readiness
                  belong to one person.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  807-branded piecework. Consistent output, SKU-tagged,
                  packed for the depot pickup window.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  Kitchen + equipment tidy and minor maintenance. The store
                  doesn't slide because nobody owns the dish pit.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  Shop and office cleanup — the same day every week. The
                  fly-in staff don't lose a shift to mopping.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  Food and supplies inventory. The first person to notice
                  what's running low, before it shows up in a stockout.
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
                Full-time
              </div>
              <div className="font-body text-[1.05vw] text-muted mt-[0.6vh] leading-[1.4]">
                On the store floor most days. Heavier on batch days, lighter
                on quiet weeks — but always present.
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
                ~${rate} / hr
              </div>
              <div className="font-body text-[1.05vw] text-muted mt-[0.6vh] leading-[1.4]">
                Loaded. Sits between the housecleaner rate and the ops manager
                rate — kitchen and cleaning hands with reliability built in.
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
                ~${monthly.toLocaleString("en-US")}
              </div>
              <div className="font-body text-[1.05vw] mt-[0.6vh] leading-[1.4] opacity-85">
                Absorbs the statutory buffer at the floor scenario and again
                at scale. The line that keeps the store from quietly drifting
                into "everyone cleans, nobody cleans."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

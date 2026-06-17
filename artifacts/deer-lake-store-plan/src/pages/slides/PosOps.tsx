export default function PosOps() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              04 · Day-1 operations
            </div>
            <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
              Walk on the job your first morning.
              <span className="italic font-normal text-accent block mt-[0.4vh]">
                Get the gist without training.
              </span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              Companion mockup
            </div>
            <div className="font-body text-[1.1vw] text-primary leading-[1.4]">
              A clickable big-button POS sits beside this deck on the canvas. The contractor and
              council see the day-1 staff experience, not just hear it described.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[2vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[2.4vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[1vh]">
              Square for Retail · configuration
            </div>
            <div className="font-display text-[1.9vw] leading-tight text-primary font-medium mb-[2vh]">
              Big-tile UI on a touchscreen tablet. No menu hunting. No jargon.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.15vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div>
                  <span className="font-semibold">Offline mode mandatory.</span> Deer Lake's
                  satellite / microwave links drop daily — sales must continue, then sync.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div>
                  <span className="font-semibold">Cashier permission tiers.</span> Voids, refunds,
                  and price overrides require a manager PIN — out of the cashier's primary flow.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div>
                  <span className="font-semibold">End-of-day cash float reconciliation.</span>{" "}
                  Printed Z-tape goes straight into the band's books — not a black box.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div>
                  <span className="font-semibold">Optional community account / pay-period tab</span>{" "}
                  system. Real demand exists; written band-council policy required before turning it
                  on.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.1vw] pt-[0.3vh] shrink-0">→</div>
                <div>
                  <span className="font-semibold">Reorder triggers</span> cued to the 807 truck
                  cadence — not against it. The schedule is the operating spine.
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[2.4vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] opacity-80 mb-[1vh]">
              Pricing · subsidies · transparency
            </div>
            <div className="font-display text-[1.9vw] leading-tight font-medium mb-[2vh]">
              Subsidies pass through to the shelf. Freight cost stays visible.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.15vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  →
                </div>
                <div>
                  <span className="font-semibold">Category-level freight markup</span> automated in
                  the POS. Nutrition North-eligible vs ineligible split is applied at item ingest,
                  not at the till.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  →
                </div>
                <div>
                  <span className="font-semibold">Shelf tags show the freight line.</span> Ineligible
                  items disclose the freight cost transparently — community sees what's being charged
                  and why.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  →
                </div>
                <div>
                  <span className="font-semibold">NN claim file</span> generated automatically from
                  the daily sales report. Reviewed weekly, submitted monthly. Audit-ready by default.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  →
                </div>
                <div>
                  <span className="font-semibold">Cold-chain incident logging</span> built into the
                  platform. Spoilage events recorded against the truck or the freezer, not absorbed
                  silently.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono text-[1.1vw] pt-[0.3vh] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  →
                </div>
                <div>
                  <span className="font-semibold">One-screen ops view</span> on 807's
                  white-labelled platform: what's in stock, what's on the next truck, what reorders
                  today.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

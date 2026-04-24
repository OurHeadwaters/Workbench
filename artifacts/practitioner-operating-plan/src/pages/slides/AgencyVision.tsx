export default function AgencyVision() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 80%, rgba(31,61,46,0.08) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              III · Agency vision
            </div>
            <h2
              className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              This contract is the foundation.
              <span className="italic font-normal text-accent block">
                Everything else is built on top of it.
              </span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.15vw] text-muted leading-[1.4]">
            The team I assemble for Deer Lake is the team that takes the next
            contract — and the one after that.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.6vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1vw] text-accent font-semibold mb-[1vh]">
              Months 1–6
            </div>
            <div className="font-display text-[2vw] leading-tight text-primary font-medium mb-[1.5vh]">
              Stand the structure up.
            </div>
            <div className="font-body text-[1.1vw] text-text leading-[1.5]">
              Hire the ops manager. Hire the bookkeeper. Land the schedule.
              Deliver the first six months of Deer Lake without anything
              touching the kids' mornings.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1vw] text-accent font-semibold mb-[1vh]">
              Months 6–12
            </div>
            <div className="font-display text-[2vw] leading-tight text-primary font-medium mb-[1.5vh]">
              Prove it on a second community.
            </div>
            <div className="font-body text-[1.1vw] text-text leading-[1.5]">
              Same Dryden depot, same coordinator infrastructure, second band
              council. The marginal cost of the second contract is the
              practitioner's time only — the back office is already paid for.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[1vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              Year 2 → 3
            </div>
            <div className="font-display text-[2vw] leading-tight font-medium mb-[1.5vh]">
              A small consultancy, not a one-person hustle.
            </div>
            <div className="font-body text-[1.1vw] leading-[1.5] opacity-95">
              2–3 northern community contracts running concurrently. A
              practitioner who does the work, not a bottleneck who does
              everything. The agency is the deliverable; the contracts are how
              it pays for itself.
            </div>
          </div>
        </div>

        <div
          className="mt-[3vh] pt-[2.5vh] border-t font-display italic text-[1.65vw] text-muted leading-[1.4] max-w-[80vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          The point isn't that this contract is the prize. The point is that
          everything it pays for outlasts it.
        </div>
      </div>
    </div>
  );
}

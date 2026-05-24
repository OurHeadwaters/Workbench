export function StompingPath() {
  return (
    <section
      className="mb-14"
      data-testid="codetry-stomping-path"
      aria-labelledby="stomping-path-heading"
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4"
        style={{ color: "hsl(var(--accent))" }}
      >
        the stomping path
      </p>

      <h2
        id="stomping-path-heading"
        className="font-serif text-2xl sm:text-3xl tracking-tight mb-4"
      >
        The trail most of you walked<br />
        <span style={{ color: "#b85a3e" }}>to get to this table.</span>
      </h2>

      <p
        className="font-serif text-[15.5px] leading-[1.65] mb-10"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        About 75% of the practitioners here came through the same three stages.
        There has never been language on this page that named the trail you walked.
        Here it is.
      </p>

      <div className="space-y-4 mb-10">

        {/* Stage 1 */}
        <div
          className="rounded-md border px-6 py-5"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          data-testid="stomping-path-stage-1"
        >
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] rounded-sm px-2 py-1"
              style={{ background: "hsl(0 40% 30%)", color: "hsl(0 0% 92%)" }}
            >
              Stage 1
            </span>
            <p className="font-serif text-[15px] font-medium tracking-tight">
              The Doom Crowd
            </p>
          </div>
          <p
            className="font-serif text-[14px] leading-[1.6]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Fear-based. Conspiratorial. Loud about the extraction — and right about it.
            The diagnosis was correct. The extraction is real. The central banking system
            does extract wealth from communities. The people in Stage 1 are not wrong about
            what is happening to them. They are wrong about the exit. The prescription is
            more fear, more awareness, stockpiling for collapse. No community building.
            No generative plan.
          </p>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em] mt-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            The ceiling: awareness without agency.
          </p>
        </div>

        {/* Stage 2 */}
        <div
          className="rounded-md border px-6 py-5"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          data-testid="stomping-path-stage-2"
        >
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] rounded-sm px-2 py-1"
              style={{ background: "hsl(38 45% 30%)", color: "hsl(38 36% 96%)" }}
            >
              Stage 2
            </span>
            <p className="font-serif text-[15px] font-medium tracking-tight">
              The Ron Paul Pivot — and the Ramsey parallel trail
            </p>
          </div>
          <p
            className="font-serif text-[14px] leading-[1.6] mb-3"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Same diagnosis: the Fed extracts wealth, dependency is engineered, the state
            cannot save you. Different prescription: opt out. Own hard assets. Build
            sovereignty at the household level. End the dependency chain yourself.
            Ramsey comes in from a different angle — consumer debt instead of gold —
            but lands in the same place: plug the household leak before you build anything.
          </p>
          <p
            className="font-serif text-[14px] leading-[1.6]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            You did real work to get here. The hard money instincts, the budget discipline,
            the distrust of outside institutions, the desire to hand something forward to
            your children — all of that maps directly to what happens at the kitchen table.
            None of it is wasted ground.
          </p>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em] mt-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            The ceiling: Paul stops at the household. Ramsey stops at the household.
          </p>
        </div>

        {/* The gap */}
        <div
          className="rounded-md border-l-4 px-6 py-5"
          style={{ borderLeftColor: "#d4a017", background: "rgba(212,160,23,0.06)", border: "1px solid rgba(212,160,23,0.20)" }}
          data-testid="stomping-path-gap"
        >
          <p
            className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
            style={{ color: "#d4a017" }}
          >
            The gap
          </p>
          <p
            className="font-serif text-[15px] leading-[1.65]"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Paul says <em>own your household.</em>{" "}
            Ramsey teaches you to stop the household leak. Both are right as far as they go.
            Neither asks the next question: where does the surplus actually go, and who owns
            the community it flows through? The wealth that stays in the household still leaks
            out through the local economy if the community institutions are not owned.
            Individual sovereignty is the floor, not the ceiling.
          </p>
        </div>

        {/* Stage 3 */}
        <div
          className="rounded-md border px-6 py-5"
          style={{ borderColor: "hsl(145 36% 22%)", background: "hsl(145 36% 10% / 0.5)" }}
          data-testid="stomping-path-stage-3"
        >
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] rounded-sm px-2 py-1"
              style={{ background: "hsl(145 36% 22%)", color: "hsl(38 36% 96%)" }}
            >
              Stage 3
            </span>
            <p className="font-serif text-[15px] font-medium tracking-tight">
              The Headwaters Kitchen Table — where you are now
            </p>
          </div>
          <p
            className="font-serif text-[14px] leading-[1.6] mb-3"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Taking the household sovereignty principles and scaling them outward — to community
            institutions, collective ownership, co-ops, local economies, and seven-generation
            stewardship. The river flows from headwaters to community. It does not flow back
            to extraction.
          </p>
          <p
            className="font-serif text-[14px] leading-[1.6]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            You arrive carrying a household that is not leaking, an understanding of the
            extraction mechanics, a desire to hand something forward, and a community to
            build with — not just a household to protect. The Headwaters tools are what
            gets added here. The practitioner's operating plan. The cost basis discipline.
            The reinvestment buckets. The community economy architecture.
          </p>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em] mt-3"
            style={{ color: "hsl(145 36% 55%)" }}
          >
            The work: build what the household sovereignty movement never got to.
            Not charity — ownership.
          </p>
        </div>
      </div>

      <p
        className="font-serif text-[14px] italic leading-[1.6]"
        style={{ color: "hsl(var(--muted-foreground))", opacity: 0.7 }}
      >
        The trail is named. The kitchen table is real. The next question is what we build
        from here.
      </p>
    </section>
  );
}

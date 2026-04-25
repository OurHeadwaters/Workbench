export default function OneSaaSAtATime() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              IV · 03 — One SaaS at a time
            </div>
            <h2
              className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              One product gets the launch.
              <span className="italic font-normal text-accent"> The others wait their turn.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.05vw] text-muted leading-[1.4]">
            Two SaaS launches in parallel halves the speed of each and
            doubles the loose-end load. The bet is paved one lane at a
            time.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.95vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              Now · The bet
            </div>
            <div className="font-display text-[1.9vw] leading-tight font-medium mb-[1.2vh]">
              Bright Side.
            </div>
            <div className="font-body text-[1.05vw] leading-[1.5] opacity-95 flex-1">
              Community tier built and demoed at the next conference.
              Enthusiast tier as the recurring line. Facility tier as the
              first contract. One codebase, one team, one product page,
              one pricing page. Everything else inside Headwaters either
              feeds this launch or stays out of the way of it.
            </div>
            <div
              className="mt-[1.5vh] pt-[1.2vh] border-t font-mono uppercase tracking-[0.2em] text-[0.78vw] opacity-80"
              style={{ borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }}
            >
              The launch · this year
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1vh]">
              Named-target only
            </div>
            <div className="font-display text-[1.9vw] leading-tight text-primary font-medium mb-[1.2vh]">
              Headwaters Finance — Credit Union.
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.5] flex-1">
              On the map. Not built. Not pitched. Activated only when a
              warm introduction lands — never as a cold push, never as a
              second concurrent product launch. If a credit-union
              relationship comes in the door warm and aligned, Bright
              Side's Enthusiast tier carries the household-finance
              feature set first; the credit-union conversation moves
              second.
            </div>
            <div
              className="mt-[1.5vh] pt-[1.2vh] border-t font-mono uppercase tracking-[0.2em] text-[0.78vw] text-muted"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              When it goes warm · not before
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1vh]">
              Community marketing · not a product
            </div>
            <div className="font-display text-[1.9vw] leading-tight text-primary font-medium mb-[1.2vh]">
              The Enthusiast tier.
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.5] flex-1">
              Treat the Enthusiast tier as the marketing surface for the
              Community tier — content, events, the conference talk, the
              power-user community — not as a second product launch with
              its own roadmap and team. Same product, same codebase,
              louder use cases. Stops the founder from spinning up a
              parallel SaaS when what's needed is one good launch.
            </div>
            <div
              className="mt-[1.5vh] pt-[1.2vh] border-t font-mono uppercase tracking-[0.2em] text-[0.78vw] text-muted"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Loud the product · don't fork it
            </div>
          </div>
        </div>

        <div
          className="mt-[2vh] pt-[1.5vh] border-t font-display italic text-[1.25vw] text-muted leading-[1.4] max-w-[82vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          One SaaS at a time isn't an austerity measure. It's how the
          highway gets paved instead of a network of half-graded shoulders.
        </div>
      </div>
    </div>
  );
}

export default function DesignUnderHeadwaters() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VIII · 08 — Where design fits
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Design goes internal.
              <span className="italic font-normal text-accent"> Studio intake closes; the Transparency Stack is the new product.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            Bobbie Parr Studio paid the bills before Headwaters. Under
            Headwaters its job is different —{" "}
            <span className="text-primary font-semibold">
              the same craft, pointed inward at the engagements the agency
              ships, not outward at a client list.
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[1vh]">
              The shift
            </div>
            <div className="font-display text-[1.9vw] leading-tight text-primary font-medium mb-[1.5vh]">
              Outside studio intake closes.
            </div>
            <div className="font-body text-[1.1vw] text-text leading-[1.5] mb-[1.5vh]">
              No new outside-client engagements. No new RFPs. No new "can
              you do a quick site for a friend." Existing studio retainers
              run to their natural end and are not renewed.
            </div>
            <div className="font-display text-[1.5vw] leading-tight text-primary font-medium mb-[0.8vh]">
              Design becomes the in-house Transparency Stack.
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.5] flex-1">
              The same craft — UX, product, identity, plain-language
              writing — gets pointed at the public price dashboard, the
              council pack, the household lookup, the band data room, the
              POS configuration. Design ships{" "}
              <span className="font-semibold text-primary">
                inside community-development engagements
              </span>{" "}
              (Deer Lake first, Pilot #2 next), not as a separate invoice.
            </div>
            <div
              className="mt-[1.5vh] pt-[1vh] border-t font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              The studio is no longer a lead funnel. It's a portfolio.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.95vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              Two carve-outs — both narrow, both intentional
            </div>
            <div className="font-display text-[1.9vw] leading-tight font-medium mb-[1.5vh]">
              Where outside design still earns a yes.
            </div>

            <div className="space-y-[1.6vh] flex-1">
              <div>
                <div
                  className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold mb-[0.5vh]"
                  style={{ color: "#e9c8a8" }}
                >
                  Carve-out A
                </div>
                <div className="font-display text-[1.4vw] leading-tight font-medium mb-[0.5vh]">
                  Mission-aligned regional work that is really Pilot #2 in disguise.
                </div>
                <div className="font-body text-[1vw] leading-[1.5] opacity-95">
                  A First Nation, co-op, or Northern community organization
                  that wants help on a piece of the Transparency Stack —
                  procurement dashboard, council pack, household-level
                  pricing — and that could plausibly become the second full
                  engagement. We take it through the agency, not the
                  studio, and we book it as scoping work toward the next
                  pilot.
                </div>
              </div>

              <div
                className="pt-[1.2vh] border-t"
                style={{ borderColor: "rgba(244,237,224,0.3)" }}
              >
                <div
                  className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold mb-[0.5vh]"
                  style={{ color: "#e9c8a8" }}
                >
                  Carve-out B
                </div>
                <div className="font-display text-[1.4vw] leading-tight font-medium mb-[0.5vh]">
                  The studio site stays live as portfolio, not as a funnel.
                </div>
                <div className="font-body text-[1vw] leading-[1.5] opacity-95">
                  bobbieparr.studio keeps showing the work — it's evidence
                  the practitioner can actually do this, which matters to a
                  band council reading the deck. Contact form goes to a
                  polite redirect explaining the studio is closed to new
                  outside intake; legitimate Carve-out A inquiries route to
                  the Headwaters address.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

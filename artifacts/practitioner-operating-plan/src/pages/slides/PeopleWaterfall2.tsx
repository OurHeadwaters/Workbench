type Bucket = {
  n: string;
  title: string;
  blurb: string;
  examples: string[];
  accent?: boolean;
};

const buckets: Bucket[] = [
  {
    n: "05",
    title: "Appreciation",
    blurb:
      "The small things that signal you matter, paid quietly and on schedule. Cheap to fund; expensive to skip.",
    examples: [
      "Monthly crew meal · ~$500/yr gear allowance · paid birthday off",
      "Named spot bonuses ($100–$500) for visible-good-judgment moments",
      "Family inclusion: kids welcome at the depot meal, partners on the holiday card",
    ],
  },
  {
    n: "06",
    title: "Growth",
    blurb:
      "Buy them more skill than the wage strictly needs. Compound returns on judgment, and the only honest answer to 'why stay'.",
    examples: [
      "Tuition / certifications (Indigenous-services, food-safe, accounting, technical)",
      "Mentorship time — paid hours with a senior outside the agency",
    ],
  },
  {
    n: "07",
    title: "Variable upside — gated by surplus",
    blurb:
      "Conditional, capped, and shared. Not how anyone makes rent. Detailed on the next slide so it doesn't get confused with sales commission.",
    examples: [
      "Crew-wide tenure-weighted profit share · outcome milestone bonuses",
      "Discretionary judgment bonus · capped commission only for genuinely commercial roles",
      "Capped at ~8–12% of any individual's annual comp in a good year. Zero in a flat year.",
    ],
    accent: true,
  },
];

export default function PeopleWaterfall2() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · People &amp; Retention · 03 — The 7-bucket waterfall (2 of 2)
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Bottom of the waterfall.
              <span className="italic font-normal text-accent"> The variable layer comes last on purpose.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw] font-body text-[0.95vw] text-muted leading-[1.4]">
            01–04 are the floor: cost-of-living covered, life events
            caught, milestones rewarded.{" "}
            <span className="text-primary font-semibold">
              05–07 sit on top of a solid base —
            </span>{" "}
            never instead of one.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.2vw] min-h-0">
          {buckets.map((b) => (
            <div
              key={b.n}
              className="rounded-[0.4vw] p-[1.4vw] flex flex-col"
              style={
                b.accent
                  ? { background: "var(--slide-primary)", color: "var(--slide-bg)" }
                  : { background: "var(--slide-paper)" }
              }
            >
              <div className="flex items-baseline gap-[0.7vw] mb-[0.8vh]">
                <div
                  className="font-mono text-[0.95vw] font-semibold"
                  style={
                    b.accent
                      ? { color: "#e9c8a8" }
                      : { color: "var(--slide-accent)" }
                  }
                >
                  {b.n}
                </div>
                <div
                  className="font-display text-[1.45vw] leading-tight font-medium"
                  style={b.accent ? undefined : { color: "var(--slide-primary)" }}
                >
                  {b.title}
                </div>
              </div>
              <div
                className="font-body text-[0.95vw] leading-[1.4] mb-[1vh]"
                style={b.accent ? { opacity: 0.95 } : { color: "var(--slide-text)" }}
              >
                {b.blurb}
              </div>
              <div
                className="mt-auto pt-[0.8vh] border-t space-y-[0.45vh] font-body text-[0.85vw] leading-[1.35]"
                style={
                  b.accent
                    ? { borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }
                    : { borderColor: "var(--slide-rule)", color: "var(--slide-muted)" }
                }
              >
                {b.examples.map((ex, i) => (
                  <div key={i} className="flex gap-[0.5vw]">
                    <div className="shrink-0">→</div>
                    <div>{ex}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-[1.2vh] pt-[1vh] border-t font-display italic text-[1.15vw] text-muted leading-[1.4] max-w-[80vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          Variable pay isn't bad —{" "}
          <span className="text-primary font-semibold not-italic">
            it's bad as the load-bearing line.
          </span>{" "}
          The next slide names what to use instead of a sales commission.
        </div>
      </div>
    </div>
  );
}

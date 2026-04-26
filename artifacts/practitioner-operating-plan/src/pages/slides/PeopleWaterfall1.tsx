type Bucket = {
  n: string;
  title: string;
  blurb: string;
  examples: string[];
  accent?: boolean;
};

const buckets: Bucket[] = [
  {
    n: "01",
    title: "Base wages — fully loaded",
    blurb:
      "Loaded with employer-side burden (CPP, EI, EHT, WSIB, vacation accrual). Always quoted loaded so the cheque and the felt-cost are the same number.",
    examples: [
      "OM $9.5k/mo loaded · IT/Tech $9.5k/mo loaded · Practitioner $13–20k/mo across scenarios",
      "Annual review on a fixed date (see Commitments) — never on request, never as ransom",
    ],
    accent: true,
  },
  {
    n: "02",
    title: "Cost-of-living offset",
    blurb:
      "The biggest felt-value lever in a remote north. Direct attack on the household line items the wage never quite catches.",
    examples: [
      "Grocery share at the Deer Lake store · fuel/vehicle allowance · winter heat share · phone/data plan",
      "Headwaters food-handler advantage: grocery share costs us less than its felt value lands",
    ],
  },
  {
    n: "03",
    title: "Resilience",
    blurb:
      "What catches the household on the week the parent gets sick or the truck dies. Predictability beats magnitude.",
    examples: [
      "HSA $1.5–2.5k/yr/person · sick bank · family / community leave",
      "Mental-health stipend (counsellor sessions, no questions asked)",
    ],
  },
  {
    n: "04",
    title: "Retention milestones",
    blurb:
      "The reasons to be here at year three, year five, year ten — not just year one. Step-up structure rewards staying, not arriving.",
    examples: [
      "RRSP match steps up at year 1 / 3 / 5 · anniversary cash at 1 / 3 / 5 / 10",
      "Sabbatical bank · equipment transfer (laptop, phone, tools) at year 3",
    ],
  },
];

export default function PeopleWaterfall1() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · People &amp; Retention · 02 — The 7-bucket waterfall (1 of 2)
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Top of the waterfall.
              <span className="italic font-normal text-accent"> Cover the cost of their life before you reward anything else.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw] font-body text-[0.95vw] text-muted leading-[1.4]">
            Buckets fall in priority order. Each bucket only earns its
            place when the one above it is paid.{" "}
            <span className="text-primary font-semibold">
              No one reaches for the variable bone to make rent.
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.2vw] min-h-0">
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
              <div className="flex items-baseline gap-[0.8vw] mb-[0.8vh]">
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
                  className="font-display text-[1.5vw] leading-tight font-medium"
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
          className="mt-[1.2vh] font-body text-[0.85vw] text-muted leading-[1.4]"
        >
          Continued on the next slide:{" "}
          <span className="font-semibold text-primary">
            05 Appreciation · 06 Growth · 07 Variable upside (gated by surplus)
          </span>
          . Sizing per scenario follows.
        </div>
      </div>
    </div>
  );
}

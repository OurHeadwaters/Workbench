import {
  REINVESTMENT_BUCKETS,
  formatBucketAmountY1,
} from "@workspace/headwaters-pricing";

type Layer = {
  label: string;
  headline: string;
  detail: string;
};

type StaysItem = {
  label: string;
  amount: string;
  detail: string;
};

type ReinvestBucket = {
  label: string;
  amount: string;
  detail: string;
};

type AccountabilityMeasure = {
  label: string;
  detail: string;
};

// Sourced from @workspace/headwaters-pricing so the four bucket amounts
// stay locked to the Practitioner one-pager's "What the 35% reinvestment
// buys" table. Edit the amounts/labels there, not here.
const reinvestBuckets: ReinvestBucket[] = REINVESTMENT_BUCKETS.map((b) => ({
  label: b.label,
  amount: formatBucketAmountY1(b.year1Amount),
  detail: b.shortDescription,
}));

const accountabilityMeasures: AccountabilityMeasure[] = [
  { label: "Money saved on buying", detail: "compared to what the current store charges" },
  { label: "Time saved for band staff", detail: "hours saved from doing reorders, closing, and reporting by hand" },
  { label: "Open-records tools delivered and used", detail: "public price page and household lookup are live and being used" },
  { label: "Local skill built up", detail: "named band staff trained to run each part of the system on their own" },
  { label: "Year-end check on what we delivered", detail: "outside reviewer · pay-back-the-difference clause in writing" },
];

const productLayers: Layer[] = [
  {
    label: "Software",
    headline: "Built by Headwaters. Owned by the band.",
    detail:
      "Till, price page, household lookup, offline mode, bookkeeping. Deer Lake owns the code and the data.",
  },
  {
    label: "Tools, bundled and resold",
    headline: "Tested up north. Bundled together.",
    detail:
      "We resell tools we've tested up here. Markup sits in the open. No hidden charge in the monthly fee.",
  },
  {
    label: "Training programs",
    headline: "Band staff learn to run the system.",
    detail:
      "Headwaters specialist with an Indigenous education partner. The store keeps working after we leave.",
  },
];

const staysItems: StaysItem[] = [
  {
    label: "Public price page",
    amount: "Live by month 3 · used by month 6",
    detail:
      "Anyone in Deer Lake can see what the store paid, what it sells at, and what it keeps. Line by line.",
  },
  {
    label: "Household price lookup",
    amount: "Live by month 9",
    detail:
      "Each family sees what they spent this month vs. the baseline. The federal help shows up clearly.",
  },
  {
    label: "The written guide for running the store",
    amount: "Written down as we go",
    detail:
      "How to run, hire, keep books, use the open-records system. The band runs from the guide, not from memory.",
  },
  {
    label: "Year-end check on what we delivered",
    amount: "Outside reviewer · pay-back-the-difference clause",
    detail:
      "If what we delivered is worth less than what we charged, we credit the difference back. In writing.",
  },
];

export default function ServicePartner() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[3.5vh] flex flex-col">
        <div className="mb-[1.4vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.6vh]">
            What Headwaters delivers · we charge our cost plus a 35% top-up that we put back into the store
          </div>
          <h2 className="font-display text-[3vw] leading-[1] tracking-tight text-primary font-medium">
            Three things the band buys.
            <span className="italic font-normal text-accent"> One of them stays.</span>
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-[1.4vw] mb-[1.4vh]" style={{ height: "44vh" }}>
          <div className="col-span-5 rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.92vw] text-accent font-semibold mb-[0.5vh]">THE THREE THINGS WE DELIVER</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] text-muted mb-[1vh]">
              What the monthly fee pays for
            </div>

            <div className="space-y-[1vh] flex-1 min-h-0">
              {productLayers.map((l) => (
                <div key={l.label}>
                  <div className="font-mono uppercase tracking-[0.18em] text-[0.82vw] text-accent mb-[0.2vh]">
                    {l.label}
                  </div>
                  <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight mb-[0.3vh]">
                    {l.headline}
                  </div>
                  <div className="font-body text-[0.78vw] text-text leading-[1.4]">
                    {l.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-7 rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.92vw] text-accent font-semibold mb-[0.5vh]">WHAT STAYS WITH DEER LAKE</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] text-muted mb-[1vh]">
              Owned by the band · we sign it over when we leave · written down on paper
            </div>

            <div className="grid grid-cols-2 gap-[0.9vw] flex-1 min-h-0">
              {staysItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[0.3vw] p-[0.9vw] flex flex-col"
                  style={{ background: "rgba(31,61,46,0.05)" }}
                >
                  <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight mb-[0.3vh]">
                    {item.label}
                  </div>
                  <div className="font-mono uppercase tracking-[0.12em] text-[0.7vw] text-accent mb-[0.4vh]">
                    {item.amount}
                  </div>
                  <div className="font-body text-[0.8vw] text-text leading-[1.4]">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[0.4vw] p-[1.4vw] grid grid-cols-12 gap-[1.4vw]" style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}>
          <div className="col-span-5">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] mb-[0.4vh]" style={{ color: "#e9c8a8" }}>
              How Headwaters charges · the full team · what the 35% put back in pays for
            </div>
            <div className="font-body text-[0.85vw] leading-[1.4] mb-[0.6vh] opacity-95">
              It costs us <span className="font-semibold">$69,700 a month</span>. We add <span className="font-semibold">$24,300 a month (35%)</span> back into the store. Total <span className="font-semibold">about $94,000 a month</span>. <span className="opacity-85">Council picks the plan: floor $60,000 → recommended $90,000 → scale $125,000. Replaces today's $35,000-a-month software-only contract.</span>
            </div>
            <div className="grid grid-cols-2 gap-x-[0.8vw] gap-y-[0.3vh] font-body text-[0.72vw] leading-[1.35] opacity-90" style={{ fontVariantNumeric: "tabular-nums" }}>
              {reinvestBuckets.map((b) => (
                <div key={b.label}>
                  <span className="font-semibold">{b.label} {b.amount}.</span> {b.detail}
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-7">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] mb-[0.4vh]" style={{ color: "#e9c8a8" }}>
              Five things we have to deliver · pay-back-the-difference clause
            </div>
            <div className="grid grid-cols-5 gap-[0.6vw] mb-[0.5vh]">
              {accountabilityMeasures.map((m, i) => (
                <div key={m.label} className="rounded-[0.2vw] px-[0.5vw] py-[0.4vh]" style={{ background: "rgba(244,237,224,0.08)" }}>
                  <div className="font-mono text-[0.65vw] opacity-70 mb-[0.15vh]" style={{ color: "#e9c8a8" }}>0{i + 1}</div>
                  <div className="font-body text-[0.72vw] leading-[1.3] font-semibold">{m.label}</div>
                  <div className="font-body text-[0.68vw] leading-[1.3] opacity-80 mt-[0.1vh]">{m.detail}</div>
                </div>
              ))}
            </div>
            <div className="font-body text-[0.78vw] leading-[1.4] opacity-90">
              An outside reviewer checks our work once a year against what we charged. <span className="font-semibold">If what we delivered to Deer Lake is worth less than what we charged, we credit the difference back against next year's contract. In writing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Measure = {
  num: string;
  title: string;
  metric: string;
  detail: string;
  cadence: string;
};

const measures: Measure[] = [
  {
    num: "01",
    title: "Procurement savings delivered",
    metric: "$ saved vs. incumbent baseline",
    detail:
      "Cost reductions on supply, freight, and fuel measured against the price the band was paying before we started — line-item, sourced, and signed off by the band's own bookkeeper.",
    cadence: "Reported quarterly · year-end audit",
  },
  {
    num: "02",
    title: "Time returned to band staff",
    metric: "Hours / month not spent on what we now run",
    detail:
      "The ops manager runs supply, the bookkeeper runs CRA, the IT/Tech runs the dashboard. Band administration gets those hours back for governance, programs, and council priorities.",
    cadence: "Tracked monthly",
  },
  {
    num: "03",
    title: "Transparency tooling shipped & adopted",
    metric: "Live dashboards · trained council members · household lookups",
    detail:
      "Public price dashboard live by M3. Council members trained to query it independently by M6. Household-level grocery price lookup running by M9. Adoption — not just shipping — is the metric.",
    cadence: "Milestone-tracked, M3 / M6 / M9",
  },
  {
    num: "04",
    title: "Capacity built locally",
    metric: "Community members trained, paid, certified",
    detail:
      "Headcount of Deer Lake band members who came through the engagement employed, trained, and credentialed — and a path for them to take over what we built when we hand the keys back.",
    cadence: "Reviewed at month 6 and month 12",
  },
  {
    num: "05",
    title: "Year-end value-delivered audit",
    metric: "$ saved + $ tooling + $ capacity vs. the 35% markup",
    detail:
      "A third-party review against the markup. If the value delivered to Deer Lake doesn't beat the reinvestment we charged for, we credit the difference forward to next year's contract — automatically, in writing.",
    cadence: "Annual · independent",
  },
];

export default function Accountability() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · Net-positive accountability
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Every dollar of markup,
              <span className="italic font-normal text-accent"> earned in measurable savings.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            The 35% is upfront. The receipts are public. Five measures, one
            annual audit, and a forward-credit clause if we don't beat the
            markup. <span className="text-primary font-semibold">Win-win-win or it doesn't run.</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.2vw] min-h-0">
          {measures.slice(0, 3).map((m) => (
            <MeasureCard key={m.num} m={m} dark={false} />
          ))}
        </div>
        <div className="mt-[1.2vh] grid grid-cols-3 gap-[1.2vw] min-h-0" style={{ flex: "0.95" }}>
          {measures.slice(3, 4).map((m) => (
            <MeasureCard key={m.num} m={m} dark={false} />
          ))}
          <div className="col-span-2">
            <MeasureCard m={measures[4]} dark={true} />
          </div>
        </div>

        <div className="mt-[1vh] font-display italic text-[1.05vw] text-muted leading-[1.35] border-l-2 pl-[1vw]"
          style={{ borderColor: "var(--slide-accent)" }}
        >
          The markup is upfront. The{" "}
          <span className="text-primary font-semibold not-italic">
            value-delivered audit is the receipt.
          </span>{" "}
          Hold me to it in the numbers as we operate.
        </div>
      </div>
    </div>
  );
}

function MeasureCard({ m, dark }: { m: Measure; dark: boolean }) {
  return (
    <div
      className="rounded-[0.4vw] p-[1.2vw] flex flex-col h-full"
      style={
        dark
          ? { background: "var(--slide-primary)", color: "var(--slide-bg)" }
          : { background: "var(--slide-paper)" }
      }
    >
      <div className="flex items-baseline justify-between mb-[0.6vh]">
        <div
          className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold"
          style={dark ? { color: "#e9c8a8" } : { color: "var(--slide-accent)" }}
        >
          {m.num}
        </div>
        <div
          className="font-mono uppercase tracking-[0.18em] text-[0.7vw]"
          style={dark ? { color: "#e9c8a8", opacity: 0.85 } : { color: "var(--slide-muted)" }}
        >
          {m.cadence}
        </div>
      </div>
      <div
        className="font-display text-[1.3vw] leading-tight font-medium mb-[0.6vh]"
        style={dark ? { color: "#f4ede0" } : { color: "var(--slide-primary)" }}
      >
        {m.title}
      </div>
      <div
        className="font-mono text-[0.82vw] mb-[0.8vh] leading-[1.3]"
        style={dark ? { color: "#e9c8a8" } : { color: "var(--slide-accent)" }}
      >
        {m.metric}
      </div>
      <div
        className="font-body text-[0.92vw] leading-[1.45] flex-1"
        style={dark ? { opacity: 0.95 } : {}}
      >
        {m.detail}
      </div>
    </div>
  );
}

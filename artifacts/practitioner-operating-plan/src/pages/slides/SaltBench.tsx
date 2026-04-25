type BenchMember = {
  name: string;
  base: string;
  background: string;
  windows: string;
  lastBatch: string;
  next: string;
};

const bench: BenchMember[] = [
  {
    name: "Marie T.",
    base: "Dryden — 7 min from depot",
    background:
      "Retired shift lead, Robin's Donuts (12 yrs); 4 yrs prior on the Cargill-Hagar packing line. References checked Mar 2026.",
    windows: "Days only · Mon–Thu · no winter driving past 3pm",
    lastBatch: "Mar 26 · pick + pack",
    next: "Apr 30 · primary",
  },
  {
    name: "Devin A.",
    base: "Wabigoon — 22 min",
    background:
      "Second-shift welder at the mill (5 yrs). Picks up casual hours for kids' hockey costs. Two written references from foremen.",
    windows: "Evenings 5–9pm · all-day Sat · no Sunday",
    lastBatch: "Feb 27 · pack only",
    next: "May 28 · primary",
  },
  {
    name: "Jess W.",
    base: "Sioux Lookout — 45 min",
    background:
      "Confederation College business student (year 2). Reliable, fast, takes the manifest seriously. Winter-weighted because school slows Nov–Apr.",
    windows: "Sat + Sun all day Nov–Apr · evenings May–Oct",
    lastBatch: "Jan 30 · pick + pack",
    next: "Jun 25 · primary",
  },
  {
    name: "Roger S.",
    base: "Eagle River — 30 min",
    background:
      "Semi-retired Manitoulin freight loader (18 yrs). Knows the dock cold; doubles as the freight-day backup. Flexible most days.",
    windows: "Flexible · prefers 8am starts · no overnight calls",
    lastBatch: "Apr 24 · standby (paid)",
    next: "Apr 30 · backup",
  },
];

type CostLine = {
  label: string;
  amount: number;
  note: string;
};

const costLines: CostLine[] = [
  { label: "Direct picking & packing", amount: 6360, note: "12 batches × 16 hrs × $30 + 4% allowance" },
  { label: "Channel-allocated overflow", amount: 4140, note: "Q4 holiday surge + custom-label runs past 16 hrs" },
  { label: "Standby + cancellation pay", amount: 1200, note: "1 standby shift / quarter × 4 hrs × $30" },
  { label: "Quarterly refresher training", amount: 1600, note: "SOP + food-safe + batch dry-run with OM" },
  { label: "Replacement screening", amount: 800, note: "~1 seat replaced / yr · paid trial + ref calls" },
  { label: "Mileage pool + WSIB premium", amount: 900, note: "Sioux Lookout / Eagle River drives + Rate Group 957" },
];

const total = costLines.reduce((s, l) => s + l.amount, 0);

const fmt = (n: number) => "$" + n.toLocaleString("en-US");
const fmtK = (n: number) => "$" + Math.round(n / 1000) + "k";

export default function SaltBench() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[3vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[1.4vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[0.8vh]">
              VI · 02b — The depot casual-labour bench
            </div>
            <h2
              className="font-display text-[2.8vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Four names, in rotation.
              <span className="italic font-normal text-accent"> No one person carries the line — and the founder is not on the list.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            The runbook reads &ldquo;OM pulls from the depot bench.&rdquo;{" "}
            <span className="text-primary font-semibold">
              This is the bench. Sized at {fmtK(total)}/yr in the salt P&amp;L,
              rotated so no seat is load-bearing, and with a written drop
              path for the week everyone is unavailable.
            </span>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[1vw] mb-[1.1vh]"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.4vh] gap-[1vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold shrink-0">
              Seed roster · Apr 2026 · base rate{" "}
              <span className="text-primary">$30/hr</span> all seats
            </div>
            <div className="font-mono text-[0.68vw] text-muted text-right">
              Contact info, SIN-on-file, banking &amp; WSIB clearance live in{" "}
              <span className="text-text">depot-bench-roster.xlsx</span> · owner: OM · never on this slide
            </div>
          </div>
          <table className="w-full text-[0.82vw] font-body" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr className="text-left text-muted font-mono uppercase tracking-[0.16em] text-[0.68vw]">
                <th className="py-[0.3vh] pr-[0.6vw] w-[12%]">Bench</th>
                <th className="py-[0.3vh] pr-[0.6vw] w-[16%]">Base</th>
                <th className="py-[0.3vh] pr-[0.6vw] w-[34%]">Background &amp; vetting</th>
                <th className="py-[0.3vh] pr-[0.6vw] w-[20%]">Availability</th>
                <th className="py-[0.3vh] pr-[0.6vw] w-[9%]">Last batch</th>
                <th className="py-[0.3vh] pr-[0.6vw] w-[9%] text-accent">Next slot</th>
              </tr>
            </thead>
            <tbody>
              {bench.map((b) => (
                <tr
                  key={b.name}
                  className="border-t align-top"
                  style={{ borderColor: "var(--slide-rule)" }}
                >
                  <td className="py-[0.4vh] pr-[0.6vw] font-display font-semibold text-primary">
                    {b.name}
                  </td>
                  <td className="py-[0.4vh] pr-[0.6vw] font-mono text-text text-[0.74vw] leading-[1.3]">
                    {b.base}
                  </td>
                  <td className="py-[0.4vh] pr-[0.6vw] text-text leading-[1.35]">
                    {b.background}
                  </td>
                  <td className="py-[0.4vh] pr-[0.6vw] text-muted leading-[1.35]">
                    {b.windows}
                  </td>
                  <td className="py-[0.4vh] pr-[0.6vw] font-mono text-text text-[0.74vw] leading-[1.3]">
                    {b.lastBatch}
                  </td>
                  <td className="py-[0.4vh] pr-[0.6vw] font-mono font-semibold text-accent text-[0.78vw] leading-[1.3]">
                    {b.next}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="rounded-[0.4vw] px-[1vw] py-[0.7vh] mb-[1vh] flex items-baseline gap-[1vw]"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div
            className="font-mono uppercase tracking-[0.22em] text-[0.74vw] font-semibold shrink-0"
            style={{ color: "#e9c8a8" }}
          >
            Rotation policy
          </div>
          <div className="font-body text-[0.82vw] leading-[1.4]">
            One primary + one paid standby per batch, rotated{" "}
            <span className="font-mono font-semibold" style={{ color: "#e9c8a8" }}>
              A → B → C → D
            </span>{" "}
            through the year — each seat works ~3 batches/yr, no bench member
            works two in a row, standby is paid even when the batch ships
            without calling on them. That&rsquo;s what keeps Saturday a real
            option for them.
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[0.95vw] mb-[1vh]"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.5vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.76vw] text-accent font-semibold">
              Bench cost · {fmt(total)}/yr · cost-centre SALT-01-LBR
            </div>
            <div className="font-mono text-[0.7vw] text-muted">
              ties to the {fmtK(total)} line in the salt P&amp;L · $10.5k allocated to channels · $4.5k bench overhead
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-[1.5vw]">
            {[costLines.slice(0, 3), costLines.slice(3, 6)].map((col, ci) => (
              <table
                key={ci}
                className="w-full text-[0.78vw] font-body"
                style={{ borderCollapse: "collapse" }}
              >
                <tbody>
                  {col.map((l) => (
                    <tr
                      key={l.label}
                      className="border-t"
                      style={{ borderColor: "var(--slide-rule)" }}
                    >
                      <td className="py-[0.22vh] pr-[0.4vw] text-text font-semibold w-[40%] align-top">
                        {l.label}
                      </td>
                      <td className="py-[0.22vh] pr-[0.4vw] text-right font-mono text-text w-[18%] align-top">
                        {fmt(l.amount)}
                      </td>
                      <td className="py-[0.22vh] text-muted text-[0.7vw] leading-[1.25] align-top">
                        {l.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
          <div
            className="mt-[0.4vh] pt-[0.4vh] border-t-2 flex items-baseline justify-between"
            style={{ borderColor: "var(--slide-primary)" }}
          >
            <div className="font-display text-primary font-semibold text-[0.88vw]">
              Bench total · {fmt(total)}/yr
            </div>
            <div className="font-mono text-[0.7vw] text-muted italic">
              audited at the same quarterly hours-by-pillar review that enforces Rules 01 &amp; 02
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[0.95vw] flex flex-col overflow-hidden"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.74vw] text-accent font-semibold mb-[0.4vh]">
              How the OM adds a name
            </div>
            <div className="space-y-[0.3vh] font-body text-[0.76vw] text-text leading-[1.3]">
              <Step n="1">
                Source from the same channels as the OM hire — Dryden &amp; District
                Chamber board, Confederation College alumni list, mill / freight
                yard referrals, the Co-op corkboard.
              </Step>
              <Step n="2">
                Screening checklist: lifted 20 lbs repeatedly, comfortable on
                their feet 4 hrs, two work references contacted by phone, no
                food-handling complaints on file.
              </Step>
              <Step n="3">
                Paid trial: one half-batch (~4 hrs) at full rate, OM watches.
                Yes/no decided that day. No &ldquo;we&rsquo;ll see how the next one goes.&rdquo;
              </Step>
              <Step n="4">
                Yes → into the next open standby slot. No → paid out clean,
                no second try.
              </Step>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[0.95vw] flex flex-col overflow-hidden"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.74vw] text-accent font-semibold mb-[0.4vh]">
              Paperwork — once, then never again
            </div>
            <div className="space-y-[0.3vh] font-body text-[0.76vw] text-text leading-[1.3]">
              <Step n="T4A">
                Independent contractor; T4A issued in Feb of the following
                year for cumulative payments &gt; $500. Bookkeeper owns the
                slip run.
              </Step>
              <Step n="WSIB">
                Each bench member provides a current WSIB clearance certificate
                (renewed annually); the depot is registered under{" "}
                <span className="font-mono">Rate Group 957</span> as a backstop.
              </Step>
              <Step n="SOP">
                Signed jar-handling &amp; food-safe SOP on file before first
                paid hour. Kept in the OM&rsquo;s binder, scanned to the
                shared drive.
              </Step>
              <Step n="Pay">
                Bi-weekly direct deposit (Plooto). 14-day terms — never &ldquo;next
                month with the salt P&amp;L&rdquo;. The bench is paid before
                the line is closed.
              </Step>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[0.95vw] flex flex-col overflow-hidden"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.74vw] font-semibold mb-[0.4vh]"
              style={{ color: "#e9c8a8" }}
            >
              When the whole bench is unavailable
            </div>
            <div className="font-body italic text-[0.74vw] leading-[1.3] mb-[0.4vh]" style={{ color: "#e9c8a8" }}>
              The &ldquo;batch slips&rdquo; path — written down so it isn&rsquo;t a judgement call at 7am Tuesday:
            </div>
            <div className="space-y-[0.3vh] font-body text-[0.76vw] leading-[1.3]">
              <Step n="T-7" inverted>
                OM confirms primary + standby by Mon. If both out, OM works
                the rotation list once before declaring a slip.
              </Step>
              <Step n="T-3" inverted>
                Still no coverage by Wed prior — OM triggers the slip. No
                escalation to the founder. No &ldquo;just this once.&rdquo;
              </Step>
              <Step n="T-0" inverted>
                Wholesale ships from the 6-week buffer · custom labels get the
                one-batch delay note (deposit honoured) · DTC gets the pre-drafted
                Klaviyo &ldquo;ships [next cycle]&rdquo; email.
              </Step>
              <Step n="T+7" inverted>
                Post-mortem at the next weekly: one-off, or does the bench
                need a 5th seat? If the second, screening starts that week.
              </Step>
            </div>
          </div>
        </div>

        <div
          className="mt-[0.7vh] pt-[0.5vh] border-t font-body text-[0.72vw] text-muted leading-[1.3]"
          style={{ borderColor: "var(--slide-rule)" }}
        >
          The bench is{" "}
          <span className="text-primary font-semibold">a hiring deliverable, not a slogan</span>{" "}
          — populated by week 6 of the OM&rsquo;s start, refreshed as people&rsquo;s
          lives change. Names above are the seed roster drafted Apr 2026; the
          seats are real, the policy is real, the cost is on the books.
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  inverted,
  children,
}: {
  n: string;
  inverted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-[0.6vw]">
      <div
        className="font-mono font-semibold w-[2.4vw] shrink-0 text-[0.78vw] pt-[0.1vh]"
        style={{ color: inverted ? "#e9c8a8" : "var(--slide-accent)" }}
      >
        {n}
      </div>
      <div>{children}</div>
    </div>
  );
}

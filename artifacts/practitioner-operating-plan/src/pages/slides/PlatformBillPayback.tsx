type AuditRow = {
  label: string;
  sub: string;
  amount: string;
  emphasis?: boolean;
};

const auditRows: AuditRow[] = [
  {
    label: "Stream 1 · Business Development & Financial Support",
    sub: "The CDP-contractor stream from the 807 grant proposal — ~12 months of platform build (transparency stack, member-facing storefront, ops back end), financial systems, and business planning. Originally a $20,000 grant line.",
    amount: "incl.",
  },
  {
    label: "Stream 2 · Marketing & Promotion (absorbed)",
    sub: "The creative/marketing-contractor stream from the same grant. Original contractor backed out — Headwaters absorbed: marketing strategy, member-facing creative, outreach materials, storefront copy. Originally a separate $20,000 grant line.",
    amount: "incl.",
    emphasis: true,
  },
  {
    label: "Replit hosting (project-to-date)",
    sub: "Actuals — own line so the receipt is visible. Continues at roughly the same rate while the platform stays live.",
    amount: "~$500+",
  },
];

export default function PlatformBillPayback() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[1.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[0.8vh]">
              II · The $22k already spent — how we get paid back
            </div>
            <h2
              className="font-display text-[2.6vw] leading-[1.05] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Headwaters is owed{" "}
              <span className="font-mono font-semibold">$22,000</span> for the
              full 807 grant scope — both streams, delivered.
              <span className="italic font-normal text-accent">
                {" "}
                Here&rsquo;s how that gets paid without putting 807 in a hole.
              </span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.5vh]">
              Reading the math
            </div>
            <div className="font-body text-[0.95vw] text-text leading-[1.4]">
              The original grant budgeted{" "}
              <span className="font-mono font-semibold">$40,000</span> across two
              contractors. The marketing contractor backed out; Headwaters
              delivered both streams for{" "}
              <span className="font-mono font-semibold">$22,000</span> total. The
              board doesn&rsquo;t have $22k on hand, so we{" "}
              <span className="font-semibold text-primary">
                tie payback to triggers
              </span>{" "}
              — whichever lands first — and we wait until paying us doesn&rsquo;t
              squeeze cash flow.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] px-[1.2vw] py-[0.9vw] mb-[1.2vh]"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.4vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.82vw] text-accent font-semibold">
              What the $22k bought · audit (full grant deliverable scope)
            </div>
            <div className="font-mono text-[0.75vw] text-muted">
              ▼ named honestly, not buried in a footnote
            </div>
          </div>
          <table
            className="w-full text-[0.88vw] font-body"
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              {auditRows.map((r) => (
                <tr
                  key={r.label}
                  className="border-t"
                  style={{
                    borderColor: "var(--slide-rule)",
                    background: r.emphasis ? "rgba(31,61,46,0.04)" : "transparent",
                  }}
                >
                  <td className="py-[0.4vh] pr-[0.8vw] text-text align-top w-[28%]">
                    <div className="font-semibold leading-[1.25]">{r.label}</div>
                  </td>
                  <td className="py-[0.4vh] pr-[0.8vw] text-muted text-[0.78vw] leading-[1.35] align-top">
                    {r.sub}
                  </td>
                  <td className="py-[0.4vh] text-right font-mono font-semibold text-primary w-[12%] align-top">
                    {r.amount}
                  </td>
                </tr>
              ))}
              <tr
                className="border-t-2"
                style={{ borderColor: "var(--slide-primary)" }}
              >
                <td
                  className="py-[0.5vh] pr-[0.8vw] font-display text-primary font-semibold text-[0.95vw] align-top"
                >
                  Total owed to Headwaters
                </td>
                <td className="py-[0.5vh] pr-[0.8vw] text-text text-[0.78vw] leading-[1.35] align-top">
                  Full grant deliverable scope, both streams.{" "}
                  <span className="font-semibold text-primary">
                    ~$40k of original grant scope, delivered for $22k
                  </span>{" "}
                  when the other contractor backed out.
                </td>
                <td className="py-[0.5vh] text-right font-display text-primary font-semibold text-[0.95vw] align-top">
                  ~$22,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-[1.2vw] flex-1 min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.1vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.4vh]">
              Trigger A · Deficit clears
            </div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              807&rsquo;s operating deficit is gone — or substantially reduced
              with solid forward projections.
            </div>
            <div className="font-body text-[0.95vw] text-text leading-[1.45] flex-1">
              Once paying us doesn&rsquo;t squeeze working capital, payback runs
              as a <span className="font-semibold">flat monthly draw</span> —
              size and term agreed by the board with the bookkeeper, sized so
              the line never threatens an operating month. Targeted at{" "}
              <span className="font-mono font-semibold">~$1k–$1.5k / mo</span>{" "}
              over 12–24 months once the trigger is met.
            </div>
            <div
              className="mt-[1vh] pt-[0.7vh] border-t font-mono text-[0.78vw] text-muted leading-[1.35]"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Bookkeeper signs off each quarter that the draw is still safe.
              If it stops being safe, it pauses. No exceptions.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.1vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.4vh]">
              Trigger B · New revenue comes online
            </div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              The platform&rsquo;s new revenue streams start producing — payback
              comes out of the new dollars, never base operations.
            </div>
            <div className="font-body text-[0.95vw] text-text leading-[1.45] flex-1">
              <span className="font-semibold">10% of new platform-enabled revenue</span>{" "}
              flows to Headwaters until the $22k is cleared. Defined sources:
              dog treat sales, memberships, &ldquo;other&rdquo; new lines the
              platform and the absorbed marketing work unlock. Existing
              wholesale, custom-label, market, and grant income is{" "}
              <span className="font-semibold">explicitly excluded</span>.
            </div>
            <div
              className="mt-[1vh] pt-[0.7vh] border-t font-mono text-[0.78vw] text-muted leading-[1.35]"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              The faster the new lines grow, the faster the bill clears —
              and we share the upside with the work that earned it.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.1vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold mb-[0.4vh]"
              style={{ color: "#e9c8a8" }}
            >
              What we are not asking for
            </div>
            <div
              className="font-display text-[1.55vw] leading-tight font-medium mb-[1vh]"
              style={{ color: "#f4ede0" }}
            >
              No cash up front. No debt taken on by 807. No draw on existing
              operations until one trigger is met.
            </div>
            <div className="font-body text-[0.95vw] leading-[1.45] opacity-95 flex-1">
              Whichever trigger lands first starts the clock — the other one
              becomes irrelevant. Until then, the bill sits on Headwaters&rsquo;
              books, not on 807&rsquo;s. Replit hosting continues to bill in the
              meantime; that line is added to the balance and paid back the
              same way.
            </div>
            <div
              className="mt-[1vh] pt-[0.7vh] border-t font-mono text-[0.78vw] leading-[1.35]"
              style={{ borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }}
            >
              A deal the board can say yes to in good conscience — not a bill
              that becomes a problem.
            </div>
          </div>
        </div>

        <div className="mt-[1vh] font-body text-[0.82vw] text-muted leading-[1.35]">
          The $22k is an{" "}
          <span className="text-text">honest number named honestly</span> — a
          year of build that already shipped, the marketing-and-promotion
          stream the other contractor was supposed to deliver and didn&rsquo;t,
          and the hosting that keeps it all live. The repayment structure is
          deliberately patient: Headwaters waits until either the deficit
          clears or the platform&rsquo;s own new revenue earns the money, then
          takes its share from{" "}
          <span className="text-primary font-semibold">
            the upside the work created
          </span>{" "}
          rather than from the operations the co-op needs to survive.{" "}
          <span className="text-text">
            Once the 807 board says yes, this slide becomes a signed
            memorandum — see the{" "}
            <a
              href="/payback-memo"
              className="underline decoration-dotted underline-offset-2 text-primary"
            >
              /payback-memo
            </a>{" "}
            working draft.
          </span>
        </div>
      </div>
    </div>
  );
}

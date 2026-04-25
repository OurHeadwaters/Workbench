type Day = {
  day: string;
  hours: string;
  block: string;
  who: string;
  drop: string;
};

const week: Day[] = [
  {
    day: "Mon",
    hours: "2 hrs OM",
    block: "Receive & stage",
    who: "Ops manager pulls salt, jars, lids, labels from depot shelves into the staging bay. Confirms wholesale POs against the standing 6-week buffer.",
    drop: "If a Deer Lake aggregation truck is inbound: salt staging slips to Tue. No founder backfill.",
  },
  {
    day: "Tue",
    hours: "3 hrs OM + 6 hrs casual",
    block: "Pick wholesale & custom labels",
    who: "Casual labour (1 person, pre-vetted from depot bench) picks the 12 wholesale POs and the month's custom-label run. OM does QA on labels.",
    drop: "Wholesale ships regardless — the retail accounts already have the date. Custom labels ship regardless — they're paid up front.",
  },
  {
    day: "Wed",
    hours: "3 hrs OM + 8 hrs casual",
    block: "Pack DTC batch",
    who: "Casual labour packs the ~80 DTC orders that accumulated over the prior 4 weeks. OM prints the manifest, runs the batch through the QA checklist.",
    drop: "If Deer Lake takes the bay Wed: DTC batch slips by exactly one week. Customers get an automated 'your batch ships [date]' email — already drafted in Klaviyo.",
  },
  {
    day: "Thu",
    hours: "2 hrs OM",
    block: "Label & manifest",
    who: "OM runs Shippo labels for the full batch (wholesale, custom, DTC) and books the Friday pickup. Bookkeeper closes the salt cost-centre for the month.",
    drop: "Never drops — labels happen even if pickup slides; pickup just rebooks for Mon.",
  },
  {
    day: "Fri",
    hours: "2 hrs OM",
    block: "Ship & close",
    who: "Manitoulin freight + Canada Post pickup at the depot dock. OM logs tracking, files the month's salt P&L line for the bookkeeper.",
    drop: "If freight is weather-cancelled: ships Mon. Customers notified by automated email; no founder phone calls.",
  },
];

type Channel = {
  name: string;
  inv: string;
  cadence: string;
  promise: string;
};

const channels: Channel[] = [
  {
    name: "Wholesale",
    inv: "6-week buffer at depot",
    cadence: "Monthly batch, on the date already on the retail PO calendar.",
    promise: "Never stocks-out. If a batch slips, ships from the buffer first.",
  },
  {
    name: "Custom labels",
    inv: "Built-to-order, paid up front",
    cadence: "Slotted into the same monthly run; lead time disclosed at order (3–5 weeks).",
    promise: "Ships in the next monthly batch after the deposit clears. Never expedited.",
  },
  {
    name: "DTC batch",
    inv: "Zero standing stock",
    cadence: "One batch per month. Orders accumulate; the storefront says so.",
    promise: "'Ships in the next batch' — date shown at checkout. No '2-day' promise, ever.",
  },
];

export default function SaltRunbook() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VI · 02 — Salt runbook
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              One batch a month, through the same depot.
              <span className="italic font-normal text-accent"> Founder's hands never on a jar.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            The salt line is a depot line, not a side hustle.{" "}
            <span className="text-primary font-semibold">
              Cadence is monthly. Inventory rules differ by channel. The week
              of the batch is mapped, day by day, around the contract.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[1.2vw] mb-[1.8vh]">
          {channels.map((c) => (
            <div
              key={c.name}
              className="rounded-[0.4vw] p-[1.2vw]"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.5vh]">
                Channel · {c.name}
              </div>
              <div className="font-display text-[1.1vw] text-primary font-semibold leading-tight mb-[0.6vh]">
                {c.inv}
              </div>
              <div className="font-body text-[0.85vw] text-text leading-[1.4] mb-[0.6vh]">
                {c.cadence}
              </div>
              <div
                className="font-mono uppercase tracking-[0.18em] text-[0.7vw] text-muted pt-[0.5vh] border-t leading-[1.35]"
                style={{ borderColor: "var(--slide-rule)" }}
              >
                Promise: {c.promise}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex-1 rounded-[0.4vw] p-[1.2vw] flex flex-col min-h-0"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.8vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold">
              The week of the batch · last week of each month
            </div>
            <div className="font-mono text-[0.75vw] text-muted">
              ~12 hrs ops manager + ~16 hrs casual labour, total
            </div>
          </div>
          <table
            className="w-full text-[0.85vw] font-body"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="text-left text-muted font-mono uppercase tracking-[0.16em] text-[0.7vw]">
                <th className="py-[0.4vh] pr-[0.6vw] w-[7%]">Day</th>
                <th className="py-[0.4vh] pr-[0.6vw] w-[14%]">Hours</th>
                <th className="py-[0.4vh] pr-[0.6vw] w-[18%]">Block</th>
                <th className="py-[0.4vh] pr-[0.6vw] w-[36%]">Who does what</th>
                <th className="py-[0.4vh] pr-[0.6vw] w-[25%] text-accent">If Deer Lake lands the same week</th>
              </tr>
            </thead>
            <tbody>
              {week.map((d) => (
                <tr
                  key={d.day}
                  className="border-t align-top"
                  style={{ borderColor: "var(--slide-rule)" }}
                >
                  <td className="py-[0.6vh] pr-[0.6vw] font-mono font-semibold text-primary">
                    {d.day}
                  </td>
                  <td className="py-[0.6vh] pr-[0.6vw] font-mono text-text">
                    {d.hours}
                  </td>
                  <td className="py-[0.6vh] pr-[0.6vw] font-display font-semibold text-primary leading-tight">
                    {d.block}
                  </td>
                  <td className="py-[0.6vh] pr-[0.6vw] text-text leading-[1.4]">
                    {d.who}
                  </td>
                  <td className="py-[0.6vh] pr-[0.6vw] text-muted leading-[1.4] italic">
                    {d.drop}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="mt-[1.5vh] pt-[1.2vh] border-t grid grid-cols-3 gap-[1.4vw]"
          style={{ borderColor: "var(--slide-rule)" }}
        >
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.5vh]">
              Returns & damage
            </div>
            <div className="font-body text-[0.9vw] text-text leading-[1.4]">
              100% of returns route to the depot, never to the founder. RMA
              window 14 days. Damaged-in-transit replacements ship in the{" "}
              <span className="font-semibold text-primary">next monthly batch</span>{" "}
              — never expedited, never hand-packed off-cycle.
            </div>
          </div>
          <div
            className="rounded-[0.4vw] p-[1vw]"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold mb-[0.5vh]"
              style={{ color: "#e9c8a8" }}
            >
              Rule 01 enforced
            </div>
            <div className="font-body text-[0.9vw] leading-[1.4]">
              No step in this runbook reads "founder packs". If casual labour
              calls in sick, the OM pulls from the depot bench. If the bench
              is empty,{" "}
              <span className="font-semibold">the batch slips</span> — it
              never falls back to the founder's hands.
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.5vh]">
              Rule 02 enforced
            </div>
            <div className="font-body text-[0.9vw] text-text leading-[1.4]">
              The OM's calendar is sequenced contract-first. The salt week is
              pre-blocked as the{" "}
              <span className="font-semibold text-primary">last</span> week of
              each month precisely because aggregation runs cluster mid-month
              — and the drop-rules above are the explicit fallback when the
              two collide.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

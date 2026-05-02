import { Reveal } from "@/components/Reveal";

/**
 * Who works the store. Three top-level bullets carry the four-part
 * cost-control story: a two-person operator couple, sitting on top of
 * serious software, keeps the payroll line small, the doors open long
 * hours with limited disruption, the food on the truck on time, and
 * the band's grocery margin coming home fast. The five-item "things
 * that hold it together" list and the five-role "who from Headwaters
 * touches it" list both live behind a tap, untouched.
 *
 * Editorial lock: see Reveal.tsx.
 */
export default function WhoWorks() {
  const bullets = [
    {
      tag: "Bullet 1 · A two-person operator couple",
      body:
        "Sam & Jess on the cockpit. Brought in and paid by the contractor — same setup as the band's hotel. Two on payroll, not a row of managers. Only way the math works at this size.",
    },
    {
      tag: "Bullet 2 · Serious software underneath them",
      body:
        "Square at the till, QuickBooks on the books, Local Line for producers, the Headwaters cockpit tying them together. Doors stay open through hunting season and bad weather. Truck leaves Dryden loaded even when one operator is out.",
    },
    {
      tag: "Bullet 3 · Margin comes home in year one",
      body:
        "About $125k–$200k of grocery margin stays in Deer Lake the first year — money that today flies south at 58¢ on the dollar. Four full-time roles — two contractor, two Headwaters — plus a band casual pool of 15+ people getting paid hours each week.",
    },
  ];

  return (
    <section
      id="who-works"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--color-accent-warm)" }}
        >
          Who works the store
        </div>
        <h2
          className="serif font-medium text-[34px] leading-[1.1]"
          style={{ color: "var(--color-primary)", textWrap: "balance" }}
        >
          Built to keep working
          <span
            className="italic font-normal block mt-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            when people don't show up.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          Two people on the cockpit. Software underneath. Payroll
          stays small. Doors stay open when somebody can't make it
          in. Truck arrives loaded. Margin comes home fast.
        </p>

        <div className="mt-7 space-y-3">
          {bullets.map((b) => (
            <div
              key={b.tag}
              className="rounded-xl p-4 border"
              style={{
                background: "var(--color-paper)",
                borderColor: "var(--color-rule)",
              }}
            >
              <div
                className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1.5"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {b.tag}
              </div>
              <div
                className="serif text-[15.5px] leading-[1.45]"
                style={{ color: "var(--color-text)" }}
              >
                {b.body}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <Reveal label="The five things that hold it together">
            <ul className="space-y-3 list-none pl-0">
              <li>
                <div className="font-semibold">Everyone learns every job.</div>
                Till, cooler, stockroom, daily books. If two people don't show
                up Tuesday, the store still opens.
              </li>
              <li>
                <div className="font-semibold">Local on-call group.</div>
                Paid by the job, called in for big restock days and market
                tables. The work stays local.
              </li>
              <li>
                <div className="font-semibold">Software covers the gaps.</div>
                Reordering, closing the day, tracking shipments. The till
                works without internet.
              </li>
              <li>
                <div className="font-semibold">Open shifts go to whoever picks them up.</div>
                The board lists each open shift and what it pays. People pick
                what fits their week.
              </li>
              <li>
                <div className="font-semibold">A calendar that bends.</div>
                Hunting season. Funerals. Hockey tournaments. Treaty days.
                Hours bend around community life.
              </li>
            </ul>
          </Reveal>

          <Reveal label="Who from Headwaters touches it" variant="ink">
            <p className="text-[13px] italic mb-2" style={{ color: "rgba(244,237,224,0.55)" }}>
              Trial: practitioner alone. Tyler and IT come in when food is moving.
            </p>
            <ul className="space-y-2 list-none pl-0">
              <li>
                <span className="font-semibold">Practitioner (Bobbie).</span>{" "}
                Builds and maintains the software. The only Headwaters role during the trial.
              </li>
              <li>
                <span className="font-semibold">Distribution Lead (Tyler).</span>{" "}
                Handles Thunder Bay → Deer Lake distribution in person. Runs the 1-ton truck and trailer.
              </li>
              <li>
                <span className="font-semibold">IT/Assistant.</span>{" "}
                Domains, passwords, bookkeeping, troubleshooting. Tyler's on-the-ground support and the practitioner's IT backup.
              </li>
            </ul>
          </Reveal>

          <Reveal label="Employment at full run">
            <p>
              <span className="font-semibold">Four full-time roles:</span>{" "}
              contractor couple (on the contractor's payroll), Headwaters Practitioner (invoiced as an independent consultant), and Distribution Lead Tyler (invoiced through Tyler's own business — Tyler + his helper, not a Headwaters payroll position). No Ontario employer obligations on the Headwaters side.
            </p>
            <p>
              A <span className="font-semibold">band casual pool of 15+ people</span> getting paid hours each week — restocks, market tables, open shifts. The work stays local and flexible.
            </p>
            <p>
              Band employment grows from the casual pool up. None of the Headwaters roles are permanent band positions.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";

/**
 * Who works the store. Three top-level bullets carry the design rule
 * that lets a northern store survive — pods, software, a calendar that
 * bends. The five-item "things that hold it together" list and the
 * five-role "who from Headwaters touches it" list both live behind a
 * tap, untouched.
 *
 * Editorial lock: see Reveal.tsx.
 */
export default function WhoWorks() {
  const bullets = [
    {
      tag: "Bullet 1 · Everyone learns every job",
      body:
        "Till, cooler, stockroom, daily books. If two people don't show up Tuesday, the store still opens.",
    },
    {
      tag: "Bullet 2 · Software covers the gaps",
      body:
        "Reordering, closing the day, tracking shipments. The till works without internet.",
    },
    {
      tag: "Bullet 3 · A calendar that bends",
      body:
        "Hunting season, funerals, hockey tournaments, treaty days. Hours bend around community life.",
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
          The band runs the floor. Headwaters delivers the operating system.
          Nobody flies in to run the till.
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
            <ul className="space-y-2 list-none pl-0">
              <li>
                <span className="font-semibold">Headwaters specialist.</span>{" "}
                Builds the software. Visits Deer Lake monthly.
              </li>
              <li>
                <span className="font-semibold">Dryden hub worker.</span>{" "}
                Handles Deer Lake orders and the phone.
              </li>
              <li>
                <span className="font-semibold">Bookkeeper, remote.</span>{" "}
                Closes the month. Prepares payroll.
              </li>
              <li>
                <span className="font-semibold">Technical advisor on call.</span>{" "}
                Reviews the software quarterly. Checks any code that touches
                money.
              </li>
              <li>
                <span className="font-semibold">Training partner.</span> An
                Indigenous educator. Trains the trainers from day one.
              </li>
            </ul>
          </Reveal>

          <Reveal label="Jobs at full run">
            <p>
              The store grows into{" "}
              <span className="font-semibold">17 to 20 jobs for Deer Lake
              people</span> over two years.
            </p>
            <p>
              None of those jobs are Headwaters jobs. They all belong to the
              band.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

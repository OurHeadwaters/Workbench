import { Reveal } from "@/components/Reveal";

/**
 * Why this team. The credibility wall the contractor needs in order to
 * defend the engagement price to the chief. The argument is simple:
 * open the work in another tab and read it for yourself. Three bullets
 * point at three shipped deliverables; Reveals open onto more.
 *
 * The proof is shipped artifacts, not biography. See task #514.
 */
export default function WhyThisTeam() {
  const claims: Array<{
    tag: string;
    head: string;
    body: string;
    links: string[];
  }> = [
    {
      tag: "Claim 1 · We've already written this plan",
      head: "The Deer Lake operating plan exists.",
      body:
        "Not a proposal — a real operational plan, dollar-honest, slide by slide. Read it before the meeting.",
      links: ["/deer-lake-store-plan/", "/practitioner-operating-plan/"],
    },
    {
      tag: "Claim 2 · We've already built the software",
      head: "The bookkeeping system is live.",
      body:
        "The same patterns used for the Deer Lake till. Open it in another tab — the work isn't theoretical.",
      links: ["/headwaters-books/", "/library/"],
    },
    {
      tag: "Claim 3 · We work with northern communities, not at them",
      head: "The method is written down.",
      body:
        "Headwaters has a practice with a name — codetry — and a handbook anyone can read. Seven parts, plain voice, no jargon.",
      links: ["/codetry-handbook/"],
    },
  ];

  return (
    <section
      id="why-this-team"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--color-accent-warm)" }}
        >
          Why this team
        </div>
        <h2
          className="serif font-medium text-[34px] leading-[1.1]"
          style={{ color: "var(--color-primary)", textWrap: "balance" }}
        >
          Open the work.
          <span
            className="italic font-normal block mt-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Read it for yourself.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          Don't take a pitch. Take three links. Each one opens in another
          tab and shows real work already shipped for northern food systems.
        </p>

        {/*
          Hotel-as-precedent callout. The strongest credibility lever the
          contractor has with the chief is the chief's own past decision —
          the operator-couple model is already running at the band's hotel
          under the same contractor. Headwaters is the store-specialist sub
          the contractor brings in for the harder asset.
        */}
        <div
          className="mt-7 rounded-2xl border-2 p-5"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-accent-warm)",
          }}
        >
          <div
            className="mono text-[10.5px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Hotel precedent · already running
          </div>
          <h3
            className="serif text-[22px] leading-[1.2] font-semibold"
            style={{ color: "var(--color-primary)", textWrap: "balance" }}
          >
            You've proved this model at the hotel.
          </h3>
          <p
            className="serif text-[15.5px] leading-[1.5] mt-3"
            style={{ color: "var(--color-text)" }}
          >
            Same setup as the band's hotel today. Contractor brings
            the couple. Band pays the contractor. The building works.
          </p>
          <p
            className="serif text-[15.5px] leading-[1.5] mt-3"
            style={{ color: "var(--color-text)" }}
          >
            The store is harder — fresh food, faster turnover. That's
            why the contractor brings Headwaters in. Same setup, new
            food side.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          {claims.map((c) => (
            <div
              key={c.tag}
              className="rounded-xl p-4 border-l-4"
              style={{
                background: "var(--color-paper)",
                borderColor: "var(--color-accent-warm)",
              }}
            >
              <div
                className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1.5"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {c.tag}
              </div>
              <div
                className="serif text-[18px] leading-[1.3] font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                {c.head}
              </div>
              <div
                className="serif text-[15.5px] leading-[1.45] mt-1.5"
                style={{ color: "var(--color-text)" }}
              >
                {c.body}
              </div>
              <div
                className="mono text-[10.5px] uppercase tracking-[0.16em] mt-3"
                style={{ color: "var(--color-muted)" }}
              >
                Open in another tab ·{" "}
                {c.links.map((href, i) => (
                  <span key={href}>
                    {i > 0 ? " · " : ""}
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:no-underline"
                      style={{ color: "var(--color-accent-warm)" }}
                    >
                      {href}
                    </a>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/*
          Practitioner Operating Plan one-pager — promoted out of the
          accordion into a prominent callout. Copy leads with the
          one-pager's own $60k+/month inflection-point framing; the
          Deer Lake Store deck is kept as a companion sub-block.
        */}
        <div className="mt-10">
          <div
            className="rounded-2xl p-6 border-2"
            style={{
              background: "var(--color-paper)",
              borderColor: "var(--color-accent-warm)",
            }}
          >
            <div
              className="mono text-[11px] uppercase tracking-[0.22em] mb-2"
              style={{ color: "var(--color-accent-warm)" }}
            >
              The artifact to open · Practitioner Operating Plan
            </div>
            <h3
              className="serif text-[24px] leading-[1.15] font-semibold"
              style={{ color: "var(--color-primary)", textWrap: "balance" }}
            >
              $60,000 a month or more is real money. Here's where it
              goes.
            </h3>
            <p
              className="serif text-[16px] leading-[1.5] mt-3"
              style={{ color: "var(--color-text)" }}
            >
              The one-pager lists every cost: practitioner, operations
              manager, IT, bookkeeper, a Headwaters food-safety person
              on-site from day one, overhead, and the Dryden food hub.
            </p>
            <p
              className="serif text-[16px] leading-[1.5] mt-3"
              style={{ color: "var(--color-text)" }}
            >
              Three monthly prices:
              <span className="font-semibold"> $60k</span> floor,
              <span className="font-semibold"> $90k</span> recommended
              (the rate this walkthrough uses),
              <span className="font-semibold"> $125k</span> once a
              second store is running.
            </p>
            <div
              className="mono text-[11px] uppercase tracking-[0.18em] mt-4"
              style={{ color: "var(--color-muted)" }}
            >
              Open the one-pager ·{" "}
              <a
                href="/practitioner-operating-plan/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                /practitioner-operating-plan
              </a>
            </div>

            <div
              className="mt-5 pt-4 border-t"
              style={{ borderColor: "var(--color-rule)" }}
            >
              <div
                className="mono text-[11px] uppercase tracking-[0.22em] mb-1.5"
                style={{ color: "var(--color-accent-warm)" }}
              >
                Companion deck · Deer Lake Store Operational Plan
              </div>
              <p
                className="serif text-[15px] leading-[1.5]"
                style={{ color: "var(--color-text)" }}
              >
                The slides the steering committee reads at the table.
                Cost lines, staffing, the financial model, the
                phasing.
              </p>
              <div
                className="mono text-[11px] uppercase tracking-[0.18em] mt-3"
                style={{ color: "var(--color-muted)" }}
              >
                Open the deck ·{" "}
                <a
                  href="/deer-lake-store-plan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:no-underline"
                  style={{ color: "var(--color-accent-warm)" }}
                >
                  /deer-lake-store-plan
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Reveal label="What's inside the software">
            <p>
              <span className="font-semibold">Headwaters Books.</span> The
              bookkeeping the agency uses for its own books — same patterns
              the Deer Lake till will use.
            </p>
            <p>
              <span className="font-semibold">Northern Food Systems
              Research Library.</span> A working library on northern food
              systems — already shipped.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "var(--color-muted)" }}
            >
              Open in another tab ·{" "}
              <a
                href="/headwaters-books/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                /headwaters-books
              </a>{" "}
              ·{" "}
              <a
                href="/library/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                /library
              </a>
            </p>
          </Reveal>

          <Reveal label="What's inside the method" variant="ink">
            <p>
              The codetry handbook — <span className="italic">Headwaters:
              How a Community Runs Its Own Economy</span>. Seven parts,
              plain grade-9 English. Read it on a phone.
            </p>
            <p>
              Same method used at the kitchen table in Dryden, Deer Lake,
              anywhere Headwaters works. Not a slide deck — a practice.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "rgba(244,237,224,0.7)" }}
            >
              Open in another tab ·{" "}
              <a
                href="/codetry-handbook/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                /codetry-handbook
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

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
  const claims = [
    {
      tag: "Claim 1 · We've already written this plan",
      head: "The Deer Lake operating plan exists.",
      body:
        "Not a proposal — a real operational plan, dollar-honest, slide by slide. Read it before the meeting.",
      links: "/deer-lake-store-plan · /practitioner-operating-plan",
    },
    {
      tag: "Claim 2 · We've already built the software",
      head: "The bookkeeping system is live.",
      body:
        "The same patterns used for the Deer Lake till. Open it in another tab — the work isn't theoretical.",
      links: "/headwaters-books · /library",
    },
    {
      tag: "Claim 3 · We work with northern communities, not at them",
      head: "The method is written down.",
      body:
        "Headwaters has a practice with a name — codetry — and a handbook anyone can read. Seven parts, plain voice, no jargon.",
      links: "/codetry-handbook",
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
                Open in another tab · {c.links}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <Reveal label="What's inside the operating plan">
            <p>
              The Deer Lake Store Operational Plan is a slides deck — the
              same one the band steering committee would read at the table.
              Cost lines, staffing, the financial model, the
              first-reserve-then-the-next phasing.
            </p>
            <p>
              The Practitioner Operating Plan one-pager carries the locked
              cost basis: the $90,000-a-month engagement total broken down
              line by line, including the Headwaters-owned Food Handler role
              embedded at the store from day one.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "var(--color-muted)" }}
            >
              Open in another tab · /deer-lake-store-plan ·
              /practitioner-operating-plan
            </p>
          </Reveal>

          <Reveal label="What's inside the software">
            <p>
              <span className="font-semibold">Headwaters Books.</span> The
              bookkeeping front-end the agency uses for its own books —
              same patterns the Deer Lake till and daily-close slip will use.
            </p>
            <p>
              <span className="font-semibold">Northern Food Systems
              Research Library.</span> A working research library for food
              systems work in the north — already shipped, already populated.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "var(--color-muted)" }}
            >
              Open in another tab · /headwaters-books · /library
            </p>
          </Reveal>

          <Reveal label="What's inside the method" variant="ink">
            <p>
              The codetry handbook is titled <span className="italic">
              Headwaters: How a Community Runs Its Own Economy</span>.
              Seven parts. Plain grade-9 voice, locked by an automated check
              on every commit. The reading level is the discipline.
            </p>
            <p>
              The same method is what gets used at the kitchen table in
              Dryden, in Deer Lake, and at any northern community Headwaters
              works with. Not a deck. A practice.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "rgba(244,237,224,0.7)" }}
            >
              Open in another tab · /codetry-handbook
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

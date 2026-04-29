/**
 * BookkeepingProof — three live, in-page mini-demos of the Headwaters
 * Books surface the band would actually use. Each card embeds a
 * chrome-free preview from the Headwaters Books artifact:
 *
 *   1. Open-records ledger — what the band and the public can see.
 *   2. Daily close         — what the operator couple does at end-of-day.
 *   3. Month-end pack      — what the bookkeeper hands the band council.
 *
 * The previews load inside this section as iframes so the bookkeeping
 * story is felt without the contractor or a councillor leaving the
 * walkthrough. Sample data is clearly badged on every embed so the
 * demo numbers are never confused for the band's real numbers. See
 * task #526.
 */
const EMBEDS: Array<{
  id: string;
  tag: string;
  head: string;
  caption: string;
  src: string;
}> = [
  {
    id: "open-records",
    tag: "Embed 1 · Open-records ledger",
    head: "What the band sees, any time.",
    caption:
      "Running totals, recent postings, by cost centre. No login. The chief and council can open this on a phone.",
    src: "/headwaters-books/embed/open-records",
  },
  {
    id: "daily-close",
    tag: "Embed 2 · Daily close",
    head: "Five minutes at end-of-day.",
    caption:
      "The operator couple counts the drawer, drops the deposit, and kicks anything tricky to the bookkeeper for the next morning.",
    src: "/headwaters-books/embed/daily-close",
  },
  {
    id: "month-end",
    tag: "Embed 3 · Month-end pack",
    head: "What council reads at the monthly meeting.",
    caption:
      "Cost-centre P&L on top, top variances below, sign-off line at the foot. Built to be the council pack, not a screenshot of a dashboard.",
    src: "/headwaters-books/embed/month-end",
  },
];

export default function BookkeepingProof() {
  return (
    <section
      id="bookkeeping-proof"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--color-accent-warm)" }}
        >
          The books, in the page
        </div>
        <h2
          className="serif font-medium text-[34px] leading-[1.1]"
          style={{ color: "var(--color-primary)", textWrap: "balance" }}
        >
          Don't take a claim.
          <span
            className="italic font-normal block mt-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Look at the books.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          Three screens from the Headwaters Books surface the band would
          run on, loaded right here in the page. Sample numbers, real
          screens. Scroll inside any embed to read it the way an operator
          would.
        </p>

        <div className="mt-7 space-y-5">
          {EMBEDS.map((e) => (
            <article
              key={e.id}
              data-testid={`bookkeeping-embed-${e.id}`}
              className="rounded-2xl overflow-hidden border"
              style={{
                background: "var(--color-paper)",
                borderColor: "var(--color-rule)",
              }}
            >
              <header className="px-5 pt-4 pb-3">
                <div
                  className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1"
                  style={{ color: "var(--color-accent-warm)" }}
                >
                  {e.tag}
                </div>
                <div
                  className="serif text-[18px] leading-[1.3] font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {e.head}
                </div>
                <div
                  className="serif text-[14.5px] leading-[1.45] mt-1.5"
                  style={{ color: "var(--color-text)" }}
                >
                  {e.caption}
                </div>
              </header>
              <div
                className="border-t"
                style={{ borderColor: "var(--color-rule)" }}
              >
                <iframe
                  src={e.src}
                  title={e.head}
                  loading="lazy"
                  className="block w-full bg-white h-[520px] sm:h-[640px]"
                  style={{ border: 0 }}
                />
              </div>
            </article>
          ))}
        </div>

        <p
          className="mono text-[12px] uppercase tracking-[0.16em] mt-6"
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
          </a>
        </p>
      </div>
    </section>
  );
}

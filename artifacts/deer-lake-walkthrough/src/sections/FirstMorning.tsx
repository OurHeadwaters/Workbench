import { Reveal } from "@/components/Reveal";

/**
 * The first morning. Anchors the abstract software talk in a single
 * concrete moment: a cashier walks in, and the till just works.
 */
export default function FirstMorning() {
  return (
    <section
      id="first-morning"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
      <div
        className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
        style={{ color: "var(--color-accent-warm)" }}
      >
        The first morning
      </div>
      <h2
        className="serif font-medium text-[34px] leading-[1.1]"
        style={{ color: "var(--color-primary)", textWrap: "balance" }}
      >
        Walk in on your first morning.
        <span
          className="italic font-normal block mt-2"
          style={{ color: "var(--color-accent-warm)" }}
        >
          Use the till without any training.
        </span>
      </h2>

      <p
        className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
        style={{ color: "var(--color-text)" }}
      >
        Big buttons on a touchscreen. Nothing hidden in menus. No business
        words. The first cashier learns it in twenty minutes.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3">
        {[
          ["Works offline", "Drops the internet? Till keeps taking sales. Catches up later."],
          ["End-of-day in one slip", "Prints clean. Goes straight into the books."],
          ["Locked changes", "Bank, till, and price changes are tied to named people."],
          ["Reorder reminders", "The till tells the manager when the next truck date hits."],
        ].map(([head, body]) => (
          <div
            key={head}
            className="rounded-xl p-4 border"
            style={{
              background: "var(--color-paper)",
              borderColor: "var(--color-rule)",
            }}
          >
            <div
              className="mono text-[10px] uppercase tracking-[0.18em] mb-1.5"
              style={{ color: "var(--color-accent-warm)" }}
            >
              {head}
            </div>
            <div
              className="serif text-[14.5px] leading-[1.4]"
              style={{ color: "var(--color-text)" }}
            >
              {body}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <Reveal label="Honest pricing on every tag" variant="ink">
          <p>
            Shipping is added by the system, by category — the cashier
            never does it at the till.
          </p>
          <p>
            Items without help money show their shipping on the tag. People
            see what they pay for, and why.
          </p>
          <p>
            The federal grocery help claim builds itself from daily sales,
            sent once a month. Spoiled food is logged, not absorbed.
          </p>
        </Reveal>

        <Reveal label="The manager screen, in one sentence">
          <p>
            One screen tells the manager what's on the shelf, what's on the
            next truck, and what to reorder today. No spreadsheets, no
            phone calls south.
          </p>
        </Reveal>
      </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";
import { ROUTES } from "@/lib/paths";
import { useRoute } from "@/lib/route";

/**
 * The first morning. Three top-level bullets — works offline, end-of-day
 * in one slip, locked changes. The fourth (reorder reminders) and the
 * grocery-help / honest-pricing detail move into Reveals.
 *
 * Editorial lock: see Reveal.tsx.
 */
export default function FirstMorning() {
  const { navigate } = useRoute();
  const bullets = [
    {
      tag: "Works offline",
      body:
        "Drops the internet? Till keeps taking sales. Catches up later.",
    },
    {
      tag: "End-of-day in one slip",
      body: "Prints clean. Goes straight into the books. No spreadsheet.",
    },
    {
      tag: "Locked changes",
      body:
        "Bank, till, and price changes are tied to a named person. Nothing moves anonymously.",
    },
  ];

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
          Big buttons. Nothing hidden in menus. No business words. The
          operator couple opens the till in twenty minutes — and the
          doors stay open the next day even if one of them is at a
          funeral, because the software does the back end.
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
          <Reveal label="Reorder reminders, in one screen">
            <p>
              The till tells the manager when the next truck date hits.
              One screen tells the manager what's on the shelf, what's on
              the next truck, and what to reorder today.
            </p>
            <p>No spreadsheets, no phone calls south.</p>
          </Reveal>

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
        </div>

        <div
          className="mt-8 rounded-xl p-5 border-2"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-accent-warm)",
          }}
        >
          <div
            className="mono text-[10.5px] uppercase tracking-[0.20em] mb-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Click through it yourself
          </div>
          <div
            className="serif text-[18px] leading-[1.35] font-medium mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            See the operator-couple cockpit on top of your 40&times;80 box.
          </div>
          <p
            className="serif text-[14.5px] leading-[1.5] mb-4"
            style={{ color: "var(--color-text)" }}
          >
            Four screens. The floor plan. The morning home screen. A till
            you can actually press the buttons on. And the line between
            what the operators can do and what stays locked to the band.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.cockpit)}
            data-testid="firstmorning-open-cockpit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[14px] transition-transform hover:-translate-y-[1px]"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-bg)",
            }}
          >
            Open the cockpit mockup →
          </button>
        </div>
      </div>
    </section>
  );
}

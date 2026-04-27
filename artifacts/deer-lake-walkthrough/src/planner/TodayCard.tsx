import { TODAY, fmtShort } from "./dates";

/**
 * The opening card. States today plainly, then the load-bearing federal
 * date the whole calendar hangs off. Sets context before the user touches
 * anything.
 */
export function TodayCard({ doorsOpen, totalMonths }: { doorsOpen: string; totalMonths: number }) {
  return (
    <section
      className="w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-10 pb-6">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--color-accent-warm)" }}
        >
          Where we stand
        </div>
        <h1
          className="serif font-medium text-[30px] leading-[1.15]"
          style={{ color: "var(--color-primary)", textWrap: "balance" }}
        >
          Today is {fmtShort(TODAY)}.
          <span
            className="italic font-normal block mt-2 text-[24px]"
            style={{ color: "var(--color-accent-warm)" }}
          >
            LFIF intake opens this fall.
          </span>
        </h1>

        <div
          className="mt-6 grid grid-cols-2 gap-3"
        >
          <div
            className="rounded-xl p-4 border"
            style={{
              background: "var(--color-paper)",
              borderColor: "var(--color-rule)",
            }}
          >
            <p
              className="mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "var(--color-muted)" }}
            >
              Doors open
            </p>
            <p
              className="serif text-[18px] font-semibold mt-1.5"
              style={{ color: "var(--color-primary)" }}
              data-testid="today-doors-open"
            >
              {fmtShort(doorsOpen)}
            </p>
          </div>
          <div
            className="rounded-xl p-4 border"
            style={{
              background: "var(--color-paper)",
              borderColor: "var(--color-rule)",
            }}
          >
            <p
              className="mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "var(--color-muted)" }}
            >
              Total project
            </p>
            <p
              className="serif text-[18px] font-semibold mt-1.5"
              style={{ color: "var(--color-primary)" }}
              data-testid="today-total-months"
            >
              {totalMonths.toFixed(1)} mo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

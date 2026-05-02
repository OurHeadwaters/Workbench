import { ROUTES } from "@/lib/paths";
import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_TIMELINE,
  TRIAL_TIMELINE_LOCALE_EN,
  TRIAL_TIMELINE_LOCALE_OJ,
  TRIAL_TIMELINE_OJICREE,
  TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER,
  TRIAL_WEEK_8_REVIEW_DAY,
} from "@workspace/headwaters-pricing";

/**
 * Printable check-in sheet for the eight-week paid trial.
 *
 * One sheet per week — print all eight or print a single one.
 * Each sheet fits on a single A4/letter page in portrait orientation when
 * printed from a browser (File → Print, or Cmd/Ctrl-P). The on-screen
 * header and the "Print" button are hidden in the print stylesheet via
 * the `print:hidden` Tailwind utility.
 *
 * The page is accessible from the Ask section of the walkthrough and from
 * /deer-lake-walkthrough/checkin-sheets directly.
 */
export default function CheckinSheets() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg)" }}
    >
      {/* On-screen controls — hidden when printing */}
      <div
        className="print:hidden sticky top-0 z-10 border-b px-6 py-3 flex items-center justify-between gap-4"
        style={{
          background: "var(--color-paper)",
          borderColor: "var(--color-rule)",
        }}
      >
        <div>
          <div
            className="mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Eight-week trial
          </div>
          <div
            className="serif text-[16px] font-semibold leading-tight mt-0.5"
            style={{ color: "var(--color-primary)" }}
          >
            Check-in sheets — all eight weeks
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={ROUTES.walkthrough + "#ask"}
            className="mono text-[10.5px] uppercase tracking-[0.16em] underline underline-offset-2"
            style={{ color: "var(--color-muted)" }}
          >
            ← Back to walkthrough
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            data-testid="print-checkin-sheets"
            className="mono text-[10.5px] uppercase tracking-[0.18em] rounded-lg px-4 py-2 border"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-bg)",
              borderColor: "var(--color-primary)",
            }}
          >
            Print / save as PDF
          </button>
        </div>
      </div>

      {/* Print notice — hidden on screen */}
      <div
        className="hidden print:block text-[9px] text-center py-1"
        style={{ color: "#888" }}
      >
        Headwaters eight-week paid trial · Check-in sheets
      </div>

      {/* Oji-Cree draft disclaimer */}
      <div
        className="print:hidden mx-auto max-w-2xl px-6 pt-4 pb-0"
      >
        <p
          className="serif text-[12.5px] leading-[1.45] italic rounded-md border px-3 py-2"
          style={{
            borderColor: "var(--color-rule)",
            background: "var(--color-paper)",
            color: "var(--color-muted)",
          }}
        >
          {TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER}
        </p>
      </div>

      {/* Eight week sheets */}
      <div className="mx-auto max-w-2xl px-6 pt-6 pb-12 space-y-8 print:space-y-0 print:px-0 print:pt-0 print:pb-0 print:max-w-none">
        {TRIAL_TIMELINE.map((week) => {
          const acIndex = week.acceptanceCriterionDelivered;
          const delivers = acIndex !== null;
          const ojiWeek = TRIAL_TIMELINE_OJICREE.find(
            (w) => w.week === week.week,
          );

          return (
            <div
              key={week.week}
              data-testid={`checkin-sheet-week-${week.week}`}
              className="rounded-2xl border p-6 print:rounded-none print:border-0 print:border-t print:p-6 print:break-after-page"
              style={{
                background: "var(--color-paper)",
                borderColor: "var(--color-rule)",
              }}
            >
              {/* Sheet header */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div
                    className="mono text-[10px] uppercase tracking-[0.22em] mb-1"
                    style={{ color: "var(--color-accent-warm)" }}
                  >
                    Headwaters trial · Check-in sheet
                  </div>
                  <div
                    className="serif text-[22px] leading-[1.15] font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Week {week.week} of {TRIAL_TIMELINE.length} —{" "}
                    {week.windowLabel}
                  </div>
                  <div
                    className="serif text-[16px] leading-[1.3] font-medium italic mt-1"
                    style={{ color: "var(--color-accent-warm)" }}
                  >
                    {week.focus}
                  </div>
                  {ojiWeek && (
                    <div
                      className="serif text-[14px] leading-[1.3] italic mt-0.5"
                      style={{ color: "var(--color-muted)" }}
                      lang="oj"
                    >
                      {ojiWeek.focus}
                    </div>
                  )}
                </div>

                {/* Completion checkbox — for printing */}
                <div className="shrink-0 text-right">
                  <div
                    className="mono text-[9.5px] uppercase tracking-[0.18em] mb-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Signed off
                  </div>
                  <div
                    className="w-10 h-10 rounded border-2 print:border-[1.5px]"
                    style={{ borderColor: "var(--color-rule)" }}
                    aria-label="Sign-off checkbox (print and tick)"
                  />
                </div>
              </div>

              {/* Deliverables / meetings / gating decision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* English column */}
                <div>
                  <div
                    className="mono text-[9px] uppercase tracking-[0.2em] mb-1"
                    style={{ color: "var(--color-accent-warm)" }}
                  >
                    {TRIAL_TIMELINE_LOCALE_EN}
                  </div>
                  <div
                    className="serif text-[13.5px] leading-[1.5]"
                    style={{ color: "var(--color-text)" }}
                  >
                    <span className="font-semibold">Deliverables.</span>{" "}
                    {week.deliverables}
                  </div>
                  <div
                    className="serif text-[13.5px] leading-[1.5] mt-2"
                    style={{ color: "var(--color-text)" }}
                  >
                    <span className="font-semibold">Meetings.</span>{" "}
                    {week.meetings}
                  </div>
                  {week.gatingDecision && (
                    <div
                      className="serif text-[13.5px] leading-[1.5] mt-2"
                      style={{ color: "var(--color-text)" }}
                    >
                      <span className="font-semibold">Gating decision.</span>{" "}
                      {week.gatingDecision}
                    </div>
                  )}
                </div>

                {/* Oji-Cree column */}
                {ojiWeek && (
                  <div lang="oj">
                    <div
                      className="mono text-[9px] uppercase tracking-[0.2em] mb-1"
                      style={{ color: "var(--color-accent-warm)" }}
                    >
                      {TRIAL_TIMELINE_LOCALE_OJ}
                    </div>
                    <div
                      className="serif text-[13.5px] leading-[1.5] italic"
                      style={{ color: "var(--color-muted)" }}
                    >
                      <span className="font-semibold not-italic">
                        Deliverables.
                      </span>{" "}
                      {ojiWeek.deliverables}
                    </div>
                    <div
                      className="serif text-[13.5px] leading-[1.5] mt-2 italic"
                      style={{ color: "var(--color-muted)" }}
                    >
                      <span className="font-semibold not-italic">
                        Meetings.
                      </span>{" "}
                      {ojiWeek.meetings}
                    </div>
                    {ojiWeek.gatingDecision && (
                      <div
                        className="serif text-[13.5px] leading-[1.5] mt-2 italic"
                        style={{ color: "var(--color-muted)" }}
                      >
                        <span className="font-semibold not-italic">
                          Gating decision.
                        </span>{" "}
                        {ojiWeek.gatingDecision}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* §7 acceptance criterion badge */}
              {delivers && (
                <div
                  className="mt-4 rounded-lg border-l-4 px-3 py-2"
                  style={{
                    borderColor: "var(--color-accent-warm)",
                    background: "rgba(184,90,62,0.06)",
                  }}
                >
                  <div
                    className="mono text-[9.5px] uppercase tracking-[0.18em] mb-0.5"
                    style={{ color: "var(--color-accent-warm)" }}
                  >
                    §7 acceptance criterion #{(acIndex ?? 0) + 1} delivered
                    this week
                  </div>
                  <div
                    className="serif text-[13px] leading-[1.45] italic"
                    style={{ color: "var(--color-text)" }}
                  >
                    {TRIAL_ACCEPTANCE_CRITERIA[acIndex ?? 0]}
                  </div>
                </div>
              )}

              {/* Notes field */}
              <div className="mt-5">
                <div
                  className="mono text-[9.5px] uppercase tracking-[0.18em] mb-1.5"
                  style={{ color: "var(--color-muted)" }}
                >
                  Notes from this week's check-in
                </div>
                <div
                  className="rounded-lg border h-24 print:h-28"
                  style={{ borderColor: "var(--color-rule)" }}
                  aria-label="Notes field (write here during the check-in)"
                />
              </div>

              {/* Week-8 special block */}
              {week.week === TRIAL_TIMELINE.length && (
                <div
                  className="mt-5 rounded-xl border-2 p-4"
                  style={{
                    borderColor: "var(--color-accent-warm)",
                    background: "rgba(184,90,62,0.04)",
                  }}
                >
                  <div
                    className="mono text-[9.5px] uppercase tracking-[0.2em] mb-1"
                    style={{ color: "var(--color-accent-warm)" }}
                  >
                    Week-eight review — day {TRIAL_WEEK_8_REVIEW_DAY}
                  </div>
                  <div
                    className="serif text-[13px] leading-[1.5]"
                    style={{ color: "var(--color-text)" }}
                  >
                    The contractor judges all four §7 acceptance criteria at
                    this meeting and elects: convert to Step 1, invoke the
                    refund (in writing within fourteen days), or convert the
                    $40,000 to a Step 1 service credit. Use the printable
                    refund-invocation letter if the refund is invoked.
                  </div>
                  <div className="mt-2">
                    <a
                      href="/practitioners-guide-v2/refund-invocation-letter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono text-[10px] uppercase tracking-[0.16em] underline underline-offset-2 print:hidden"
                      style={{ color: "var(--color-accent-warm)" }}
                    >
                      Open refund-invocation letter →
                    </a>
                  </div>
                  <div
                    className="hidden print:block mono text-[10px] uppercase tracking-[0.16em] mt-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Refund-invocation letter: /practitioners-guide-v2/refund-invocation-letter
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

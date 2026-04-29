import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_DURATION_WEEKS,
  TRIAL_FEE_USD,
  TRIAL_HEADLINE,
  TRIAL_REFUND_INVOCATION_DAYS,
  TRIAL_TIMELINE,
  TRIAL_WEEK_8_REVIEW_DAY,
} from "@workspace/headwaters-pricing";

const STATUS_QUESTIONS: readonly string[] = [
  "Were the named deliverables in hand by the end of this week?",
  "Were the named meetings held on the calendar this week?",
  "Are we still on track to the week-eight review?",
];

const fmtMoney = (n: number) =>
  `$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

export default function CheckInSheets() {
  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="checkin-screen">
      <div className="print-hide checkin-toolbar">
        <div className="checkin-toolbar-copy">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[2pt]">
            Practitioner Operating Plan · Eight-week check-in sheets
          </div>
          <div className="text-[10pt] text-[#2a2520] leading-[1.4]">
            Eight one-page sheets — one per trial week — pre-printed with
            that week&rsquo;s deliverables, meetings, and gate from{" "}
            <span className="font-mono">TRIAL_TIMELINE</span>. Print the
            bundle once at signing; the contractor signs one sheet at the
            end of each weekly check-in. By the week-eight review the
            §7 acceptance judgement is paper-backed by eight signed sheets.
          </div>
        </div>
        <button
          type="button"
          onClick={onPrint}
          className="font-mono uppercase tracking-[0.16em] text-[9pt] px-[10pt] py-[6pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0] whitespace-nowrap self-start"
        >
          Print all eight sheets
        </button>
      </div>

      {TRIAL_TIMELINE.map((week, idx) => {
        const isLast = idx === TRIAL_TIMELINE.length - 1;
        const acIndex = week.acceptanceCriterionDelivered;
        const delivers = acIndex !== null;
        const isReviewWeek = week.week === TRIAL_DURATION_WEEKS;

        return (
          <article
            key={week.week}
            className="checkin-sheet"
            style={{
              pageBreakAfter: isLast ? "auto" : "always",
              breakAfter: isLast ? "auto" : "page",
            }}
          >
            <header className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[12pt]">
              <div>
                <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt]">
                  Eight-week trial · weekly check-in sheet
                </div>
                <h1 className="font-display text-[22pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold">
                  Week {week.week} of {TRIAL_DURATION_WEEKS}
                  <span className="text-[#b85a3e]"> · </span>
                  {week.focus}
                </h1>
                <div className="font-mono uppercase tracking-[0.18em] text-[8pt] text-[#6b7665] mt-[3pt]">
                  {week.windowLabel} from signing day
                </div>
              </div>
              <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
                Sheet {week.week} / {TRIAL_DURATION_WEEKS}
                <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
                  {fmtMoney(TRIAL_FEE_USD)} · 8 wks
                </div>
              </div>
            </header>

            <div className="text-[8.5pt] text-[#6b7665] leading-[1.4] mb-[10pt] italic">
              {TRIAL_HEADLINE} Edits to the deliverables, meetings, or gate
              below come from{" "}
              <span className="font-mono not-italic">TRIAL_TIMELINE</span> in{" "}
              <span className="font-mono not-italic">@workspace/headwaters-pricing</span>{" "}
              — re-print the bundle if anything moves.
            </div>

            <section className="mb-[10pt]">
              <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]">
                What is in flight this week
              </div>
              <div className="grid grid-cols-2 gap-[12pt] text-[10pt] leading-[1.45] text-[#2a2520]">
                <div>
                  <div className="font-semibold text-[#1f3d2e] mb-[3pt]">
                    Deliverables
                  </div>
                  <div>{week.deliverables}</div>
                </div>
                <div>
                  <div className="font-semibold text-[#1f3d2e] mb-[3pt]">
                    Meetings on the calendar
                  </div>
                  <div>{week.meetings}</div>
                </div>
              </div>
            </section>

            <section
              className="mb-[10pt] p-[10pt] rounded-[3pt]"
              style={{
                border: "1.25pt solid #b85a3e",
                background: delivers || week.gatingDecision ? "#f7ecdc" : "#faf6ec",
              }}
            >
              <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]">
                Gate this week
              </div>
              <div className="text-[10pt] leading-[1.45] text-[#2a2520]">
                {week.gatingDecision ?? (
                  <span className="italic text-[#6b7665]">
                    No formal gate this week — preparation continues toward
                    the next gating decision.
                  </span>
                )}
              </div>
              {delivers ? (
                <div className="mt-[6pt] pt-[6pt] border-t border-[#c8bfa7] text-[10pt] leading-[1.45] text-[#2a2520]">
                  <span className="font-semibold text-[#b85a3e]">
                    §7 acceptance criterion #{(acIndex ?? 0) + 1} delivered this week:
                  </span>{" "}
                  <span className="italic">
                    {TRIAL_ACCEPTANCE_CRITERIA[acIndex ?? 0]}
                  </span>
                </div>
              ) : null}
              {isReviewWeek ? (
                <div className="mt-[6pt] pt-[6pt] border-t border-[#c8bfa7] text-[9pt] leading-[1.4] text-[#2a2520]">
                  <span className="font-semibold text-[#b85a3e]">
                    Week-eight review (day {TRIAL_WEEK_8_REVIEW_DAY}):
                  </span>{" "}
                  the contractor judges all four §7 acceptance criteria and
                  elects to convert to Step 1, invoke the refund (within{" "}
                  {TRIAL_REFUND_INVOCATION_DAYS} calendar days of this
                  meeting), or convert the {fmtMoney(TRIAL_FEE_USD)} to a
                  service credit against the first Step 1 invoice.
                </div>
              ) : null}
            </section>

            <section className="mb-[10pt]">
              <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]">
                Contractor check-in · circle yes / no
              </div>
              <table
                className="w-full text-[10pt] border-collapse"
                style={{ tableLayout: "fixed" }}
              >
                <tbody className="text-[#2a2520] align-top">
                  {STATUS_QUESTIONS.map((q, qIdx) => (
                    <tr
                      key={qIdx}
                      className={
                        qIdx === STATUS_QUESTIONS.length - 1
                          ? undefined
                          : "border-b border-[#e3dac4]"
                      }
                    >
                      <td className="py-[6pt] pr-[6pt]">{q}</td>
                      <td
                        className="py-[6pt] text-right font-mono uppercase tracking-[0.16em] text-[9pt] text-[#1f3d2e]"
                        style={{ width: "26%" }}
                      >
                        Yes ◯ &nbsp; No ◯
                      </td>
                    </tr>
                  ))}
                  {delivers ? (
                    <tr className="border-t border-[#c8bfa7]">
                      <td className="py-[6pt] pr-[6pt]">
                        Is §7 acceptance criterion #{(acIndex ?? 0) + 1}{" "}
                        delivered to the contractor&rsquo;s satisfaction?
                      </td>
                      <td
                        className="py-[6pt] text-right font-mono uppercase tracking-[0.16em] text-[9pt] text-[#1f3d2e]"
                        style={{ width: "26%" }}
                      >
                        Yes ◯ &nbsp; No ◯
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </section>

            <section className="mb-[14pt]">
              <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]">
                Notes from the check-in
              </div>
              <div
                className="rounded-[3pt]"
                style={{
                  border: "0.75pt solid #c8bfa7",
                  background: "#faf6ec",
                  height: "1.6in",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 22pt, #e3dac4 22pt, #e3dac4 22.5pt)",
                  backgroundPosition: "0 16pt",
                }}
              />
            </section>

            <section className="border-t border-[#c8bfa7] pt-[10pt]">
              <div className="grid grid-cols-2 gap-[24pt]">
                <div>
                  <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#6b7665] mb-[14pt]">
                    Contractor signature
                  </div>
                  <div className="border-b border-[#1f3d2e] mb-[3pt]" style={{ height: "0.4in" }} />
                  <div className="grid grid-cols-2 gap-[8pt] text-[8pt] font-mono uppercase tracking-[0.16em] text-[#6b7665]">
                    <div>Name (printed)</div>
                    <div className="text-right">Date</div>
                  </div>
                  <div className="grid grid-cols-2 gap-[8pt] mt-[6pt]">
                    <div className="border-b border-[#1f3d2e]" style={{ height: "0.3in" }} />
                    <div className="border-b border-[#1f3d2e]" style={{ height: "0.3in" }} />
                  </div>
                </div>
                <div>
                  <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#6b7665] mb-[14pt]">
                    Practitioner signature
                  </div>
                  <div className="border-b border-[#1f3d2e] mb-[3pt]" style={{ height: "0.4in" }} />
                  <div className="grid grid-cols-2 gap-[8pt] text-[8pt] font-mono uppercase tracking-[0.16em] text-[#6b7665]">
                    <div>Name (printed)</div>
                    <div className="text-right">Date</div>
                  </div>
                  <div className="grid grid-cols-2 gap-[8pt] mt-[6pt]">
                    <div className="border-b border-[#1f3d2e]" style={{ height: "0.3in" }} />
                    <div className="border-b border-[#1f3d2e]" style={{ height: "0.3in" }} />
                  </div>
                </div>
              </div>
            </section>

            <footer className="mt-[10pt] pt-[6pt] border-t border-[#c8bfa7] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
              <div>
                Sheet {week.week} of {TRIAL_DURATION_WEEKS} · keep all eight
                signed sheets for the week-eight review file.
              </div>
              <div className="text-[#1f3d2e] font-semibold">
                Practitioner Operating Plan · Trial check-in
              </div>
            </footer>
          </article>
        );
      })}
    </div>
  );
}

import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_TIMELINE,
  TRIAL_TIMELINE_LOCALE_EN,
  TRIAL_TIMELINE_LOCALE_OJ,
  TRIAL_TIMELINE_OJICREE,
  TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER,
  TRIAL_WEEK_8_REVIEW_DAY,
} from "@workspace/headwaters-pricing";

export default function CheckinSheets({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--cs-bg)" }}>
      <div className="print:hidden sticky top-0 z-10 border-b px-6 py-3 flex items-center justify-between gap-4" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Eight-week trial</div>
          <div className="text-[16px] font-semibold leading-tight mt-0.5" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>Check-in sheets — all eight weeks</div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="text-[10.5px] uppercase tracking-[0.16em] underline underline-offset-2" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>← Back to walkthrough</button>
          <button type="button" onClick={() => window.print()} data-testid="cs-print-checkin-sheets" className="text-[10.5px] uppercase tracking-[0.18em] rounded-lg px-4 py-2 border" style={{ background: "var(--cs-primary)", color: "var(--cs-bg)", borderColor: "var(--cs-primary)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Print / save as PDF</button>
        </div>
      </div>

      <div className="print:hidden mx-auto max-w-2xl px-6 pt-4 pb-0">
        <p className="text-[12.5px] leading-[1.45] italic rounded-md border px-3 py-2" style={{ borderColor: "var(--cs-rule)", background: "var(--cs-paper)", color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}>{TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER}</p>
      </div>

      <div className="mx-auto max-w-2xl px-6 pt-6 pb-12 space-y-8 print:space-y-0 print:px-0 print:pt-0 print:pb-0 print:max-w-none">
        {TRIAL_TIMELINE.map((week) => {
          const acIndex = week.acceptanceCriterionDelivered;
          const delivers = acIndex !== null;
          const ojiWeek = TRIAL_TIMELINE_OJICREE.find((w) => w.week === week.week);
          return (
            <div key={week.week} data-testid={`cs-checkin-sheet-week-${week.week}`} className="rounded-2xl border p-6 print:rounded-none print:border-0 print:border-t print:p-6 print:break-after-page" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Eight-week trial · Check-in sheet</div>
                  <div className="text-[22px] leading-[1.15] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>Week {week.week} of {TRIAL_TIMELINE.length} — {week.windowLabel}</div>
                  <div className="text-[16px] leading-[1.3] font-medium italic mt-1" style={{ color: "var(--cs-accent-warm)", fontFamily: "'Fraunces', Georgia, serif" }}>{week.focus}</div>
                  {ojiWeek && <div className="text-[14px] leading-[1.3] italic mt-0.5" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }} lang="oj">{ojiWeek.focus}</div>}
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[9.5px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Signed off</div>
                  <div className="w-10 h-10 rounded border-2 print:border-[1.5px]" style={{ borderColor: "var(--cs-rule)" }} aria-label="Sign-off checkbox (print and tick)" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{TRIAL_TIMELINE_LOCALE_EN}</div>
                  <div className="text-[13.5px] leading-[1.5]" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold">Deliverables.</span> {week.deliverables}</div>
                  <div className="text-[13.5px] leading-[1.5] mt-2" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold">Meetings.</span> {week.meetings}</div>
                  {week.gatingDecision && <div className="text-[13.5px] leading-[1.5] mt-2" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold">Gating decision.</span> {week.gatingDecision}</div>}
                </div>
                {ojiWeek && (
                  <div lang="oj">
                    <div className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{TRIAL_TIMELINE_LOCALE_OJ}</div>
                    <div className="text-[13.5px] leading-[1.5] italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold not-italic">Deliverables.</span> {ojiWeek.deliverables}</div>
                    <div className="text-[13.5px] leading-[1.5] mt-2 italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold not-italic">Meetings.</span> {ojiWeek.meetings}</div>
                    {ojiWeek.gatingDecision && <div className="text-[13.5px] leading-[1.5] mt-2 italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold not-italic">Gating decision.</span> {ojiWeek.gatingDecision}</div>}
                  </div>
                )}
              </div>

              {delivers && (
                <div className="mt-4 rounded-lg border-l-4 px-3 py-2" style={{ borderColor: "var(--cs-accent-warm)", background: "rgba(184,90,62,0.06)" }}>
                  <div className="text-[9.5px] uppercase tracking-[0.18em] mb-0.5" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>§7 acceptance criterion #{(acIndex ?? 0) + 1} delivered this week</div>
                  <div className="text-[13px] leading-[1.45] italic" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{TRIAL_ACCEPTANCE_CRITERIA[acIndex ?? 0]}</div>
                </div>
              )}

              <div className="mt-5">
                <div className="text-[9.5px] uppercase tracking-[0.18em] mb-1.5" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Notes from this week's check-in</div>
                <div className="rounded-lg border h-24 print:h-28" style={{ borderColor: "var(--cs-rule)" }} aria-label="Notes field" />
              </div>

              {week.week === TRIAL_TIMELINE.length && (
                <div className="mt-5 rounded-xl border-2 p-4" style={{ borderColor: "var(--cs-accent-warm)", background: "rgba(184,90,62,0.04)" }}>
                  <div className="text-[9.5px] uppercase tracking-[0.2em] mb-1" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Week-eight review — day {TRIAL_WEEK_8_REVIEW_DAY}</div>
                  <div className="text-[13px] leading-[1.5]" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>The contractor judges all four §7 acceptance criteria at this meeting and elects: convert to Stage 2, invoke the refund (in writing within fourteen days), or convert the $25,000 to a Stage 2 service credit.</div>
                  <div className="mt-2">
                    <a href="/practitioners-guide-v2/refund-invocation-letter" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.16em] underline underline-offset-2 print:hidden" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Open refund-invocation letter →</a>
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

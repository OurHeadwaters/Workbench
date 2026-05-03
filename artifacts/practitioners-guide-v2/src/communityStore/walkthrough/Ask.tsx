import { Reveal } from "../plannerReveal";
import { useTrialWeekMarks } from "../planner/trialWeekMarks";
import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_ACCEPTANCE_CRITERIA_OJICREE,
  TRIAL_EYEBROW,
  TRIAL_FEE_LINE,
  TRIAL_FEE_LINE_OJICREE,
  TRIAL_FRAMING_LINE,
  TRIAL_FRAMING_LINE_OJICREE,
  TRIAL_HEADLINE,
  TRIAL_HEADLINE_OJICREE,
  TRIAL_NO_TEAM_LINE,
  TRIAL_REFUND_MECHANIC,
  TRIAL_REFUND_MECHANIC_OJICREE,
  TRIAL_TIMELINE,
  TRIAL_TIMELINE_LOCALE_EN,
  TRIAL_TIMELINE_LOCALE_OJ,
  TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER,
  TRIAL_TIMELINE_OJICREE,
  TRIAL_WEEK_8_REVIEW_DAY,
} from "@workspace/headwaters-pricing";

export default function Ask({ onOpenPlanner }: { onOpenPlanner: () => void }) {
  const { isMarked, toggleMark } = useTrialWeekMarks();

  const steps = [
    { head: "Council motion + steering committee", body: "Pass a council motion to enter a one-year design phase. Form a steering committee — three council members, two community members." },
    { head: "Six months of co-design + a ninety-day cold-chain pilot", body: "Co-design the store with the community over six months. Pilot the cold-chain truck with the existing store for ninety days." },
    { head: "Decide together by the end of year one", body: "At year end, the band decides whether to commit to building. Real off-ramp at every step before this." },
  ];

  return (
    <section id="cs-ask" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>The ask</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          Three small steps.
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>A real off-ramp at every one.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>Not a yes or no on a $4M store today. A small first step that anyone can walk back from.</p>

        {/* Trial call-out */}
        <div className="mt-7 rounded-xl border-2 p-5" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-accent-warm)" }}>
          <div className="text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{TRIAL_EYEBROW}</div>
          <div className="text-[20px] leading-[1.25] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{TRIAL_HEADLINE}</div>
          <div className="text-[15.5px] leading-[1.3] font-medium italic mt-1" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }} lang="oj">{TRIAL_HEADLINE_OJICREE}</div>
          <div className="mt-3 rounded-md border px-3 py-2 text-[12.5px] leading-[1.45] italic" style={{ borderColor: "var(--cs-rule)", background: "var(--cs-bg)", color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}>{TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER}</div>
          <p className="text-[15.5px] leading-[1.5] mt-3" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>
            <span className="font-semibold">How much.</span>{" "}
            <span className="text-[10px] uppercase tracking-[0.18em] mr-1" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{TRIAL_TIMELINE_LOCALE_EN}</span>
            {TRIAL_FEE_LINE} {TRIAL_NO_TEAM_LINE}
          </p>
          <p className="text-[14.5px] leading-[1.45] mt-1 italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }} lang="oj">
            <span className="text-[10px] not-italic uppercase tracking-[0.18em] mr-1" style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{TRIAL_TIMELINE_LOCALE_OJ}</span>
            {TRIAL_FEE_LINE_OJICREE}
          </p>
          <p className="text-[15.5px] leading-[1.5] mt-2" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>
            <span className="font-semibold">What you get in eight weeks (solo, by the practitioner):</span>
          </p>
          <ol className="text-[15px] leading-[1.5] mt-1 list-decimal pl-5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>
            {TRIAL_ACCEPTANCE_CRITERIA.map((criterion, i) => {
              const ojiCriterion = TRIAL_ACCEPTANCE_CRITERIA_OJICREE.find((c) => c.index === i);
              return (
                <li key={criterion}>
                  <div>{criterion}</div>
                  {ojiCriterion ? <div className="text-[14px] leading-[1.45] italic mt-0.5" style={{ color: "var(--cs-muted)" }} lang="oj">{ojiCriterion.text}</div> : null}
                </li>
              );
            })}
          </ol>
          <p className="text-[15.5px] leading-[1.5] mt-3" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>
            <span className="font-semibold">Money back.</span> {TRIAL_REFUND_MECHANIC}
          </p>
          <p className="text-[14.5px] leading-[1.45] mt-1 italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }} lang="oj">{TRIAL_REFUND_MECHANIC_OJICREE}</p>
          <p className="text-[14.5px] leading-[1.45] mt-3 italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}>{TRIAL_FRAMING_LINE}</p>
          <p className="text-[13.5px] leading-[1.45] mt-1 italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }} lang="oj">{TRIAL_FRAMING_LINE_OJICREE}</p>
        </div>

        {/* Week-by-week timeline */}
        <div className="mt-5 rounded-xl border p-5" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
          <div className="text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Eight weeks, week by week</div>
          <div className="text-[17px] leading-[1.3] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>What the practitioner is doing each week.</div>
          <p className="text-[14.5px] leading-[1.45] mt-2" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}>Four written things from the trial, spread across eight weeks. Review meeting lands day {TRIAL_WEEK_8_REVIEW_DAY}.</p>
          <div className="mt-3 rounded-md border px-3 py-2 text-[12.5px] leading-[1.45] italic" style={{ borderColor: "var(--cs-rule)", background: "var(--cs-bg)", color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}>{TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER}</div>
          <ol className="mt-3 space-y-2 list-none pl-0">
            {TRIAL_TIMELINE.map((week) => {
              const acIndex = week.acceptanceCriterionDelivered;
              const delivers = acIndex !== null;
              const ojiWeek = TRIAL_TIMELINE_OJICREE.find((w) => w.week === week.week);
              const marked = isMarked(week.week);
              return (
                <li key={week.week} className="rounded-lg p-3 border" style={{ background: marked ? "rgba(80,120,80,0.07)" : delivers ? "rgba(184,90,62,0.06)" : "var(--cs-bg)", borderColor: marked ? "rgba(80,140,80,0.45)" : delivers ? "var(--cs-accent-warm)" : "var(--cs-rule)" }}>
                  <div className="flex items-baseline gap-3">
                    <div className="text-[12px] tabular-nums shrink-0 uppercase tracking-[0.18em]" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>W{week.week} · {week.windowLabel}</div>
                    <div className="flex-1">
                      <div className="text-[14.5px] leading-[1.3] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{week.focus}</div>
                      {ojiWeek ? <div className="text-[13.5px] leading-[1.3] font-medium italic mt-0.5" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }} lang="oj">{ojiWeek.focus}</div> : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                    <div>
                      <div className="text-[9.5px] uppercase tracking-[0.18em] mb-0.5" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{TRIAL_TIMELINE_LOCALE_EN}</div>
                      <div className="text-[13.5px] leading-[1.45]" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold">Deliverables.</span> {week.deliverables}</div>
                      <div className="text-[13.5px] leading-[1.45] mt-1" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold">Meetings.</span> {week.meetings}</div>
                      {week.gatingDecision ? <div className="text-[13.5px] leading-[1.45] mt-1" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold">Gating decision.</span> {week.gatingDecision}</div> : null}
                    </div>
                    {ojiWeek ? (
                      <div lang="oj">
                        <div className="text-[9.5px] uppercase tracking-[0.18em] mb-0.5" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{TRIAL_TIMELINE_LOCALE_OJ}</div>
                        <div className="text-[13.5px] leading-[1.45] italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold not-italic">Deliverables.</span> {ojiWeek.deliverables}</div>
                        <div className="text-[13.5px] leading-[1.45] mt-1 italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold not-italic">Meetings.</span> {ojiWeek.meetings}</div>
                        {ojiWeek.gatingDecision ? <div className="text-[13.5px] leading-[1.45] mt-1 italic" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold not-italic">Gating decision.</span> {ojiWeek.gatingDecision}</div> : null}
                      </div>
                    ) : null}
                  </div>
                  {delivers ? (
                    <div className="text-[11px] uppercase tracking-[0.18em] mt-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                      §7 acceptance criterion #{(acIndex ?? 0) + 1} delivered:{" "}
                      <span className="normal-case tracking-normal italic" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>{TRIAL_ACCEPTANCE_CRITERIA[acIndex ?? 0]}</span>
                    </div>
                  ) : null}
                  <button type="button" onClick={() => toggleMark(week.week)} data-testid={`cs-week-mark-${week.week}`} aria-pressed={marked} className="mt-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] border transition-colors" style={{ background: marked ? "rgba(80,140,80,0.12)" : "transparent", borderColor: marked ? "rgba(80,140,80,0.4)" : "var(--cs-rule)", color: marked ? "rgba(60,120,60,0.9)" : "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                    {marked ? "✓ Done" : "Mark done"}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={onOpenPlanner} className="text-[11px] uppercase tracking-[0.16em] underline underline-offset-2 hover:no-underline" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Open the phase planner →</button>
          </div>
        </div>

        <ol className="mt-7 space-y-3 list-none pl-0">
          {steps.map((step, i) => (
            <li key={step.head} className="flex gap-4 rounded-xl p-4 border" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
              <div className="text-[18px] tabular-nums shrink-0 leading-none pt-0.5" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{String(i + 1).padStart(2, "0")}</div>
              <div className="flex-1">
                <div className="text-[17px] leading-[1.3] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{step.head}</div>
                <div className="text-[15px] leading-[1.45] mt-1.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{step.body}</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-3">
          <Reveal label="The five-step version, broken out">
            <ol className="space-y-2 list-decimal pl-5">
              <li>Pass a council motion to enter a one-year design phase with Headwaters.</li>
              <li>Form a steering committee — three council members, two community members.</li>
              <li>Co-design the store with the community over six months.</li>
              <li>Pilot the cold-chain truck with the existing store for ninety days.</li>
              <li>Decide together by year end whether to commit to building.</li>
            </ol>
          </Reveal>
          <Reveal label="What this costs, by stage">
            <p><span className="font-semibold">Stage 1 — planning trial: $25,000 flat.</span> Eight weeks · $175/hr billed rate · practitioner solo. No team hired. The flat fee is intentionally below full-cost — a bounded entry price so the band can walk away before committing.</p>
            <p><span className="font-semibold">Stage 2 — distribution live: $39,200/month.</span> Practitioner $175/hr + distribution lead $70/hr, 160 hr/mo each. Distribution lead subcontracted — client sees two line items. No employer payroll obligations on either party — both invoice through their own businesses. Gas card and insurance billed at cost on top. You bring the operator couple on your own payroll.</p>
            <p>No grants in hand. Paid from band reserves — the planner shows the path. Most spending lands near the end, against the cold-chain pilot. Walk away after the trial and the band keeps the four written deliverables. Walk away after the cold-chain pilot and the band keeps the route, the software, and the bill stops.</p>
          </Reveal>
          <Reveal label="What the band gets back, and how soon">
            <p><span className="font-semibold">About $125,000 to $200,000 of grocery margin stays in the community the first year.</span> Money flying south today at 58¢ on the dollar. The new store sells 30 to 40 percent of the community's grocery spend in year one, keeping 26¢ more of every dollar than the current store.</p>
            <p>Plus <span className="font-semibold">four full-time roles</span> — contractor couple plus Headwaters practitioner and distribution lead — and a band casual pool of 15+ people getting paid hours each week.</p>
          </Reveal>
          <Reveal label="What stays even if the community walks away" variant="ink">
            <p>The cold-chain truck route — built, tested, available to other communities.</p>
            <p>The open-records software — the band keeps full ownership.</p>
            <p>Whatever pricing data was published — already in the public record.</p>
            <p>Whatever staff training happened — those skills stay in the community.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

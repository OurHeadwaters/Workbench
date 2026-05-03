import { Reveal } from "../plannerReveal";
import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_ACCEPTANCE_CRITERIA_OJICREE,
  TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER,
} from "@workspace/headwaters-pricing";

export default function WhatTheTeamDelivers() {
  const lines = [
    { tag: "Line 1 · The store's operating system", head: "Till, books, open-records software.", body: "The cashier's screen, the daily close, the public price page, the household lookup — built once, owned by the band." },
    { tag: "Line 2 · The way the food gets here", head: "Cold-chain plan, truck route, ninety-day pilot.", body: "Three lanes (truck on the road, winter-road truck, plane), planned route by route, tested before the store opens. Requires a 1-ton truck — budget line in the plan as either a used purchase or contractor lease to the practice team." },
    { tag: "Line 3 · The people, trained", head: "Staff training, written guide, steering committee.", body: "Everyone learns every job. The band runs from a written guide, not from memory. A community board sits over the work." },
  ];

  return (
    <section id="cs-what-headwaters-delivers" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>What the practice team delivers</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          Three line items.
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>One contract. One team that gets it done.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>Two people run the floor. Square, QuickBooks, and Local Line do the back end. Doors stay open, truck stays on time, money comes home fast.</p>

        <div className="mt-6 rounded-xl border p-4" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
          <div className="text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Trial vs. Stage 2</div>
          <p className="text-[15px] leading-[1.5]" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold">Trial · eight weeks.</span> Practitioner alone. No team. Four written things land: steering committee, co-design plan, cold-chain pilot scope, year-one budget.</p>
          <p className="text-[15px] leading-[1.5] mt-2" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold">Stage 2 · $39,200/month.</span> Food is moving. The distribution lead (subcontracted, invoiced through their own business) joins the practitioner. Cold-chain pilot, software, training, day-one gear.</p>
        </div>

        <div className="mt-5 rounded-xl border-2 p-5" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-accent-warm)" }}>
          <div className="text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Cost · What you pay / What you bring</div>
          <dl className="space-y-3">
            <div>
              <dt className="text-[14px] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>What do I pay?</dt>
              <dd className="text-[14.5px] leading-[1.5] mt-0.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}><span className="font-semibold">Stage 1 — planning trial: $25,000 flat</span> (8 weeks · $175/hr billed rate · practitioner solo · below cost — entry price). <span className="font-semibold">Stage 2 — distribution live: $39,200/month</span> — practitioner $175/hr + distribution lead $70/hr, 160 hr/mo each. Plus gas card at cost and insurance on top.</dd>
            </div>
            <div>
              <dt className="text-[14px] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>Who does that cover?</dt>
              <dd className="text-[14.5px] leading-[1.5] mt-0.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>Trial (Stage 1): practitioner solo at $175/hr billed · no team hired. Stage 2: practitioner $175/hr + distribution lead's company subcontracted $70/hr · 160 hr/mo each. No employer payroll obligations. Your operator couple stays on your payroll.</dd>
            </div>
            <div>
              <dt className="text-[14px] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>What do I bring?</dt>
              <dd className="text-[14.5px] leading-[1.5] mt-0.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>The 1-ton truck. Your operator couple on the floor, on your payroll.</dd>
            </div>
          </dl>
        </div>

        <ol className="mt-7 space-y-3 list-none pl-0">
          {lines.map((line, i) => (
            <li key={line.tag} className="flex gap-4 rounded-xl p-4 border" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
              <div className="text-[18px] tabular-nums shrink-0 leading-none pt-0.5" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{String(i + 1).padStart(2, "0")}</div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{line.tag}</div>
                <div className="text-[18px] leading-[1.3] font-medium" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{line.head}</div>
                <div className="text-[15.5px] leading-[1.45] mt-1.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{line.body}</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-3">
          <Reveal label="The four trial deliverables, in full">
            <p>The full contractual wording of the four §7 acceptance criteria — what the contractor signs off on at the week-eight review meeting.</p>
            <p className="text-[12.5px] italic mt-2" style={{ color: "var(--cs-muted)", fontFamily: "'Fraunces', Georgia, serif" }}>{TRIAL_TIMELINE_OJ_REVIEW_DISCLAIMER}</p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              {TRIAL_ACCEPTANCE_CRITERIA.map((criterion, i) => {
                const ojiCriterion = TRIAL_ACCEPTANCE_CRITERIA_OJICREE.find((c) => c.index === i);
                return (
                  <li key={criterion}>
                    <div>{criterion}</div>
                    {ojiCriterion ? <div className="italic text-[13.5px] mt-1" lang="oj">{ojiCriterion.text}</div> : null}
                  </li>
                );
              })}
            </ol>
          </Reveal>
          <Reveal label="Proof for line 2 — the cold-chain plan is already drawn">
            <p>The route is already planned: Thunder Bay → Sioux Lookout → Dryden, then a winter-road truck Dryden → community, with plane backup April through November. The cold-chain section above has the lane-by-lane detail.</p>
            <p>The Phase Planner lets the contractor flip between the self-fund and grant-funded scenarios live, with the cold-chain pilot back-loaded so the band can walk away after step three with the route built.</p>
          </Reveal>
          <Reveal label="Proof for line 3 — the training is already written down" variant="ink">
            <p>The codetry handbook is the written method behind how the practice team trains. Seven parts, every chapter readable on a phone — the same handbook the band staff will work from in their training materials.</p>
            <p>The Practitioner's Guide is the reference the practitioner works from — contracts ledger, archetypes, personal-cash discipline.</p>
            <p className="text-[12px] uppercase tracking-[0.16em] mt-2" style={{ color: "rgba(244,237,224,0.7)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
              Open in another tab ·{" "}
              <a href="/codetry-handbook/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:no-underline" style={{ color: "rgba(244,237,224,0.95)" }}>/codetry-handbook</a>{" "}·{" "}
              <a href="/practitioners-guide-v2/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:no-underline" style={{ color: "rgba(244,237,224,0.95)" }}>/practitioners-guide-v2</a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

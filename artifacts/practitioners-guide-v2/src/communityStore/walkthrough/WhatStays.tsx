import { Reveal } from "../plannerReveal";

export default function WhatStays() {
  const items = [
    { head: "The public price page", tag: "Live by month 3 · used by month 6", body: "Anyone in the community can see what the store paid, what it sells at, and what it keeps. Line by line." },
    { head: "The household price lookup", tag: "Live by month 9", body: "Each family sees what they spent this month vs the baseline. The federal help shows up clearly." },
    { head: "The written guide for running the store", tag: "Written down as we go", body: "How to run, hire, keep books, use the open-records system. The band runs from the guide, not from memory." },
  ];

  return (
    <section id="cs-what-stays" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>What stays with the community</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          The practice team hands off.
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>The store keeps running.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>Three things stay with the community forever — even after our contract ends.</p>
        <div className="mt-7 space-y-3">
          {items.map((item) => (
            <div key={item.head} className="rounded-2xl p-5 border" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
              <div className="text-[19px] leading-[1.3] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{item.head}</div>
              <div className="text-[10.5px] uppercase tracking-[0.18em] mt-1.5 mb-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{item.tag}</div>
              <div className="text-[15.5px] leading-[1.5]" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{item.body}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <Reveal label="The year-end value-delivered audit">
            <p>An outside reviewer checks our work once a year against what we charged. <span className="font-semibold">If we delivered less than we charged, we credit the difference against next year's contract.</span> In writing.</p>
            <p>Five things we have to deliver: money saved, staff time saved, open-records tools used, local skill built up, and the review itself.</p>
          </Reveal>
          <Reveal label="What the practice team is paid for" variant="ink">
            <p>We charge a monthly fee for software, training, and a team that shows up. We take no cut of the groceries — the margin stays in the community.</p>
            <p>The fee covers three things: the software (built by us, owned by the band), tools we resell to the band with a markup we publish openly, and the training programs.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

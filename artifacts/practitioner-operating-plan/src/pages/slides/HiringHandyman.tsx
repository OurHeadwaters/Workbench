export default function HiringHandyman() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4.5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
              III · Hiring 05 — Handyman-Housekeeper combo
            </div>
            <h2
              className="font-display text-[3.1vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Slowest hire on the plan.
              <span className="italic font-normal text-accent"> Child-safety first. Always.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div
              className="inline-block font-mono uppercase tracking-[0.22em] text-[0.85vw] text-bg px-[0.7vw] py-[0.3vh] rounded-[0.2vw] mb-[0.8vh]"
              style={{ background: "var(--slide-accent)" }}
            >
              Referrals only · Never an open posting
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.4]">
              No Facebook ad, no Kijiji listing. The wrong person responds to
              open postings for this role.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[1.4vw] mb-[1.4vh]"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div className="flex items-baseline justify-between mb-[1vh]">
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.9vw] font-semibold"
              style={{ color: "#e9c8a8" }}
            >
              Child-safety vetting protocol — non-negotiable
            </div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.8vw] opacity-60">
              Run in this order. Skip nothing.
            </div>
          </div>
          <div className="grid grid-cols-5 gap-[1vw] font-body text-[0.9vw] leading-[1.4]">
            <VetStep n="1" title="Vulnerable Sector Check">
              Current, ≤ 6 months old. Reimbursed by us. No VSC, no trial.
            </VetStep>
            <VetStep n="2" title="3 references, called personally">
              Two professional, one personal who has seen them around their own
              kids. Ask: <i>"Would you leave them in a room alone with your
              children?"</i> Hesitation is a no.
            </VetStep>
            <VetStep n="3" title="Days 1–90 · never alone with the kids">
              Another adult always present in the house. No solo childcare. No
              "just for ten minutes."
            </VetStep>
            <VetStep n="4" title="Months 3–6 · earned brief windows">
              Only after consistent comfort from the kids. 5–10 min only.
              Re-evaluate weekly.
            </VetStep>
            <VetStep n="5" title="Open conversation with the kids">
              Standing offer: <i>"Anything weird, anything that makes you
              uncomfortable — you tell me. You will never be in trouble for
              telling me."</i>
            </VetStep>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Where to source — referrals only">
            <Row>The contractors you already trust — electrician, plumber, the guy who plowed last winter. Ask who they'd send to <i>their</i> mother's house.</Row>
            <Row>The Dryden trades school instructor — name the best graduate of the last three years.</Row>
            <Row>The kids' teachers, the priest, an elder. People who know who's good with kids and who isn't.</Row>
            <Row>Never an open Facebook post. Never an open Kijiji listing. Never "first applicant in."</Row>
          </Section>

          <Section title="Screening + paid trial">
            <Row><b>Ask.</b> Tell me about kids in your life. Frustrating kid behaviour — how do you handle it? When have you made a kid uncomfortable without meaning to?</Row>
            <Row><b>Week 1 paid trial.</b> Outside-only work. Eaves, snow, storm windows. Parent home throughout.</Row>
            <Row><b>Week 2 paid trial.</b> Indoor work only when parent is home and kids are in the next room. No exceptions.</Row>
            <Row><b>Decision.</b> End of week 2. Both weeks paid at $30/hr regardless of outcome.</Row>
          </Section>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Walk away if…" tone="danger">
            <Row>Reluctance, deflection, or "is that really necessary?" about the Vulnerable Sector Check.</Row>
            <Row>Volunteers as <i>"great with kids"</i> before being asked. Brings unsolicited gifts for the kids early.</Row>
            <Row>Conversation drifts to the kids' schedules, their school, when they're home alone.</Row>
            <Row>Pushes for solo time with the kids. Any version of "I can watch them while you run out."</Row>
            <Row>Charm in front of you that doesn't match what the kids quietly report.</Row>
            <Row>Any reference hesitates, dodges, or "doesn't want to get into it."</Row>
          </Section>

          <Section title="30 / 60 / 90 — slower than the other roles">
            <Row><b>Day 30.</b> Small jobs done well. The vetting protocol is in force without negotiation.</Row>
            <Row><b>Day 60.</b> Kids comfortable. Parent still always present indoors. Any kid hesitation triggers a reset.</Row>
            <Row><b>Day 90.</b> First real re-evaluation. Either earn a small amount of extended trust (5–10 min unsupervised), or end the engagement cleanly. <i>"It didn't fit"</i> is a complete sentence.</Row>
            <Row><b>Annual.</b> Re-run the Vulnerable Sector Check every 12 months for as long as the role exists.</Row>
          </Section>
        </div>
      </div>
    </div>
  );
}

function VetStep({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-[0.4vw] mb-[0.5vh]">
        <div
          className="font-display font-medium text-[1.6vw] leading-none"
          style={{ color: "#e9c8a8" }}
        >
          {n}
        </div>
        <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] opacity-90">
          {title}
        </div>
      </div>
      <div className="opacity-90">{children}</div>
    </div>
  );
}

function Section({
  title,
  tone,
  children,
}: {
  title: string;
  tone?: "danger";
  children: React.ReactNode;
}) {
  const isDanger = tone === "danger";
  return (
    <div
      className="rounded-[0.4vw] p-[1.2vw] flex flex-col"
      style={{ background: "var(--slide-paper)" }}
    >
      <div
        className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold mb-[0.9vh]"
        style={{ color: isDanger ? "var(--slide-primary)" : "var(--slide-accent)" }}
      >
        {title}
      </div>
      <div className="space-y-[0.7vh] font-body text-[0.95vw] leading-[1.4] text-text">
        {children}
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-[0.7vw]">
      <div className="text-accent font-semibold w-[0.9vw] shrink-0">→</div>
      <div>{children}</div>
    </div>
  );
}

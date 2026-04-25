import { useCostValue } from "../../lib/costReview";
import { CostReviewButton } from "../../components/CostReviewButton";

export default function HiringHousecleaner() {
  const rate = useCostValue("rate.housecleaner");
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[5vw] py-[4.5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
              V · Hiring 05 — Housecleaner
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Hire the same person.
              <span className="italic font-normal text-accent"> Same day, every week.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.4vh]">
              Target hire
            </div>
            <div className="font-display text-[1.4vw] text-primary leading-tight font-medium">
              2–3 weeks to start
            </div>
            <div className="font-body text-[0.95vw] text-muted mt-[0.4vh] leading-[1.4]">
              Word-of-mouth in Dryden moves fast.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Where to source — referrals first, listings second">
            <Row><b>Highest yield:</b> ask three other working parents in town. One name will come up twice — start there.</Row>
            <Row>Facebook groups: <span className="font-mono">Dryden Buy &amp; Sell</span>, <span className="font-mono">Dryden Help Wanted</span>. Kijiji Dryden as a backup.</Row>
            <Row>Bulletin boards: Dryden Co-op, Robin's Donuts, the rec centre, the library.</Row>
            <Row>Independent operators in town first. They show up. Franchise crews rotate staff and quality slips.</Row>
            <Row>If individuals don't pan out within two weeks: Molly Maid Northwestern Ontario as a paid backstop while the search continues.</Row>
          </Section>

          <Section title="Screening questions">
            <Row>Which day of the week works for you year-round? Same day every week is the deal.</Row>
            <Row>Do you bring your own supplies, or use what's on hand?</Row>
            <Row>If I gave you 90 minutes in the kitchen alone, walk me through what you'd do, in order.</Row>
            <Row>What's your no-show / late policy? When did you last miss a job and how did you handle it?</Row>
            <Row>Comfortable with a dog in the house and kids underfoot some weeks? Liability insurance — yes / no?</Row>
          </Section>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Paid trial structure — 2 weekly visits">
            <Row><b>Visit 1.</b> Standard scope, parent home and visible. Walk-through at start, walk-through at end.</Row>
            <Row><b>Visit 2.</b> Same scope, parent home but unobtrusive. Note: same person, same time, same approach?</Row>
            <Row><b>Decision.</b> End of visit 2. Hire on the spot or pay out and try the next candidate.</Row>
            <Row>Both visits paid at ${rate}/hr. No "free first clean" — that signals the wrong relationship from day one.</Row>
          </Section>

          <Section title="Walk away if…" tone="danger">
            <Row>Wants cash only with no receipt. The bookkeeper needs paper.</Row>
            <Row>Brings a different person each visit. The point is one person who learns the house.</Row>
            <Row>Won't commit to a regular weekday. "We'll figure it out each week" doesn't survive winter.</Row>
            <Row>On the phone for chunks of the visit. The clock is the clock.</Row>
            <Row>Can't give one local reference. In a town this size, that's information.</Row>
          </Section>
        </div>

        <ThirtySixtyNinety
          d30="Same person, same day, same scope. The parent stops thinking about it on a Sunday night."
          d60="Notices the small things — low soap, cracked tile, a bulb out — and texts before it becomes a job."
          d90="'Is the house clean' is no longer something on anyone's mental checklist. It just is."
        />
      </div>
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

function ThirtySixtyNinety({
  d30,
  d60,
  d90,
}: {
  d30: string;
  d60: string;
  d90: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-[1.2vw]">
      <DayCard label="Day 30" body={d30} />
      <DayCard label="Day 60" body={d60} />
      <DayCard label="Day 90" body={d90} accent />
    </div>
  );
}

function DayCard({
  label,
  body,
  accent,
}: {
  label: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-[0.4vw] p-[1.1vw]"
      style={
        accent
          ? { background: "var(--slide-primary)", color: "var(--slide-bg)" }
          : { background: "var(--slide-paper)" }
      }
    >
      <div
        className="font-mono uppercase tracking-[0.22em] text-[0.8vw] mb-[0.3vh]"
        style={{ color: accent ? "#e9c8a8" : "var(--slide-muted)" }}
      >
        {label}
      </div>
      <div
        className="font-body text-[0.95vw] leading-[1.4]"
        style={accent ? { opacity: 0.9 } : undefined}
      >
        {body}
      </div>
    </div>
  );
}

import { useCostValue } from "../../lib/costReview";
import { CostReviewButton } from "../../components/CostReviewButton";

export default function HiringTutor() {
  const rate = useCostValue("rate.tutor");
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[5vw] py-[4.5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
              V · Hiring 06 — Tutor
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Year-round commitment.
              <span className="italic font-normal text-accent"> The kids vote at the end.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.4vh]">
              Target hire
            </div>
            <div className="font-display text-[1.4vw] text-primary leading-tight font-medium">
              Locked in by Oct 1
            </div>
            <div className="font-body text-[0.95vw] text-muted mt-[0.4vh] leading-[1.4]">
              In place before the dark months hit.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Where to source — northern Ontario education channels">
            <Row>Lakehead University Faculty of Education student job board (Thunder Bay) — B.Ed candidates eager for paid hours.</Row>
            <Row>Confederation College Education Assistant program — Dryden and Sioux Lookout campuses.</Row>
            <Row>Keewatin-Patricia District School Board: phone the board office, ask for the substitute teacher coordinator and the names they trust.</Row>
            <Row>Dryden retired-teacher network — the local Retired Teachers of Ontario chapter and the church bulletins.</Row>
            <Row>Ontario College of Teachers public register — filter by region, then check current OCT standing.</Row>
            <Row>Ask the kids' current classroom teachers: "Who would you trust with my three?" Names will repeat.</Row>
          </Section>

          <Section title="Screening questions">
            <Row>OCT-registered, B.Ed candidate, or experienced EA — which, and how recent?</Row>
            <Row>How do you teach a kid who refuses to read? Walk me through your first three sessions.</Row>
            <Row>K, Grade 2, and Grade 4 in the same room for 90 minutes — workable? Show me the plan.</Row>
            <Row>Year-round commitment with ~10 hrs/wk Nov–Apr, ~2 hrs/wk May–Sept. Does the summer drop work for you financially?</Row>
            <Row>Vulnerable Sector Check on file or willing to obtain one (paid by us) before the trial starts?</Row>
          </Section>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Paid trial structure — 4 sessions over 2 weeks">
            <Row><b>Sessions 1–2.</b> Parent in the room. Baseline assessment for each kid in math and reading.</Row>
            <Row><b>Session 3.</b> Parent observes from the next room. Tutor leads end-to-end.</Row>
            <Row><b>Session 4.</b> Parent out of the house. Lesson plan shared in advance, notes sent after.</Row>
            <Row><b>Decision.</b> Two inputs: the lesson plans and notes <i>and</i> the kids' honest read on whether they want this person back.</Row>
            <Row>4 sessions paid at ${rate}/hr regardless. Vulnerable Sector Check reimbursed on hire.</Row>
          </Section>

          <Section title="Walk away if…" tone="danger">
            <Row>No interest in the kids as people — only in the curriculum.</Row>
            <Row>Lecture-style with a 6-year-old. Phone visible during a session.</Row>
            <Row>Won't share a lesson plan in advance or notes after.</Row>
            <Row>No Vulnerable Sector Check and won't get one. Non-negotiable.</Row>
            <Row>Any of the kids consistently say they don't want them back. Their read counts.</Row>
          </Section>
        </div>

        <ThirtySixtyNinety
          d30="Kids show up willingly. Baseline math and reading assessment in hand for each kid."
          d60="Measurable progression — math facts up a level, reading level up a band — documented, not assumed."
          d90="The 7–10am window runs without parental intervention. The guilt-loop is replaced with evidence."
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

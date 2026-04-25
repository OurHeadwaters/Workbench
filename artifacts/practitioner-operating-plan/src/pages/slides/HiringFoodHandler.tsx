import { CostReviewButton } from "../../components/CostReviewButton";

export default function HiringFoodHandler() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[5vw] py-[4.5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
              III · Hiring 04 — Food Handler (at the Deer Lake store)
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Hire from Deer Lake.
              <span className="italic font-normal text-accent"> Same person, every shift.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.4vh]">
              Target hire
            </div>
            <div className="font-display text-[1.4vw] text-primary leading-tight font-medium">
              In place by store opening
            </div>
            <div className="font-body text-[0.95vw] text-muted mt-[0.4vh] leading-[1.4]">
              The food handler is on the floor Day 1 — recruit during the
              fit-out, not after.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Where to source — Deer Lake first, always">
            <Row><b>Highest yield:</b> the band office — ask the housing coordinator and the school cook who in town wants steady, in-town work with kitchen experience.</Row>
            <Row>The depot casual bench (SaltBench): four people are already vetted on salt batches; one of them may want to step up.</Row>
            <Row>Community board at the band office and the existing store. Posted notice in plain language: hours, rate, what the day looks like.</Row>
            <Row>Word-of-mouth through the council. Small town — the right name comes up by the second conversation.</Row>
            <Row>Back-up only: out-of-town hire on the same fly-in rotation as the store staff. Not the goal.</Row>
          </Section>

          <Section title="Screening questions">
            <Row>Walk me through cleaning a kitchen at end of shift. What goes first, what gets missed when you're tired?</Row>
            <Row>Have you handled food at scale — a feast, a school program, a fish fry? Tell me about the last big run.</Row>
            <Row>Salt batch days are loud and physical for half a day, then back to store ops. Comfortable with that rhythm year-round?</Row>
            <Row>Inventory eyes: tell me a time you noticed something was about to run out before anyone else flagged it.</Row>
            <Row>Food-safe certification — yes, in progress, or willing to take it in the first 30 days (we pay for it)?</Row>
          </Section>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Paid trial structure — one batch day, one quiet day">
            <Row><b>Visit 1.</b> Salt batch day. Shadow then run the kitchen-side prep. The OM and the practitioner are present.</Row>
            <Row><b>Visit 2.</b> Quiet store day. Cleaning, stocking, inventory walk, kitchen reset. Note: do they self-direct or wait to be told?</Row>
            <Row><b>Decision.</b> End of visit 2. Hire on the spot or pay out and bring in the next candidate from the bench.</Row>
            <Row>Both visits paid at the going hourly rate. No "trial shifts for free" — that's not how the agency operates.</Row>
          </Section>

          <Section title="Walk away if…" tone="danger">
            <Row>Won't take food-safe certification. Non-negotiable for a Headwaters-owned line at a band store.</Row>
            <Row>Treats cleaning as someone else's job. The role is kitchen <em>and</em> shop tidy, in the same shift.</Row>
            <Row>Can't commit to the regular schedule. Drift on the food handler line shows up in the store as drift everywhere.</Row>
            <Row>Doesn't want to be at the store every shift — wants remote / piecework only. Wrong role for them.</Row>
            <Row>Pattern of conflict with the depot bench from prior salt runs. The salt batches need calm hands.</Row>
          </Section>
        </div>

        <ThirtySixtyNinety
          d30="On the floor Day 1. Salt batch days running smoothly on the kitchen side. Kitchen and shop tidy schedule visibly held."
          d60="Inventory call-outs land before stockouts. 807-branded piecework output is consistent and SKU-tagged for the depot."
          d90="The store kitchen and shop don't show up on the OM's worry list anymore. The food handler is a quiet, dependable line in the weekly rhythm."
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

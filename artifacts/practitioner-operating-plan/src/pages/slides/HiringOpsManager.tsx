import { useCostValue } from "../../lib/costReview";
import { useBudgetTotals } from "../../lib/budgetMath";
import { CostReviewButton } from "../../components/CostReviewButton";

export default function HiringOpsManager() {
  const omRate = useCostValue("rate.opsManager");
  const benchRate = useCostValue("rate.benchSeat");
  const { saltBenchAnnual } = useBudgetTotals();
  const fmtKYr = (n: number) =>
    "$" + (n / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "k";
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[5vw] py-[4.5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
              V · Hiring 01 — Operations Manager
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Find the phone-holder.
              <span className="italic font-normal text-accent"> Hire for judgment, not résumé.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.4vh]">
              Target hire
            </div>
            <div className="font-display text-[1.4vw] text-primary leading-tight font-medium">
              4–6 weeks to start
            </div>
            <div className="font-body text-[0.95vw] text-muted mt-[0.4vh] leading-[1.4]">
              Paid trial weeks 5–6. Solo by week 7.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Where to source — in & around Dryden">
            <Row>Dryden &amp; District Chamber of Commerce job board; Job Bank Northwestern Ontario.</Row>
            <Row>Confederation College (Dryden &amp; Sioux Lookout) — alumni and grad lists for business / supply chain.</Row>
            <Row>Facebook groups: <span className="font-mono">Dryden Jobs</span>, <span className="font-mono">Dryden Buy &amp; Sell</span>, <span className="font-mono">Kenora Jobs</span>.</Row>
            <Row>Referrals from existing northern logistics outfits — Wasaya freight, Bearskin, North Star Air dispatchers know who's good.</Row>
            <Row>Posters at the Dryden Co-op, Robin's, Lake View Inn, and the Petro pass — old-school reach.</Row>
          </Section>

          <Section title="Screening questions">
            <Row>Walk me through coordinating drivers and suppliers when half the destinations have no cell coverage.</Row>
            <Row>A barge is late by 36 hours and the community's grocery shelf is half-empty. What do you do in the next two hours?</Row>
            <Row>What does "owning the phone" mean to you when the ops lead is off-grid for 48 hours?</Row>
            <Row>Last time you made a $5k judgment call without checking with anyone first — what was it?</Row>
            <Row>Comfort level: Sheets, QuickBooks, Slack, a basic dispatch tracker. Be specific.</Row>
          </Section>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Paid trial structure — 2 weeks at full rate">
            <Row><b>Week 1 · Shadow.</b> 5 days alongside me. They take notes, I take calls. End-of-day debrief.</Row>
            <Row><b>Week 2 · Phone in their hand.</b> They run 11am / 4pm hand-offs. I'm reachable but not first.</Row>
            <Row><b>Decision day.</b> Friday of week 2. If yes, full role starts Monday. If no, paid out and parted clean.</Row>
            <Row>Both weeks paid at ${omRate}/hr regardless of outcome. The trial is the interview.</Row>
          </Section>

          <Section title="Walk away if…" tone="danger">
            <Row>"I'll learn the software as I go" with no specifics.</Row>
            <Row>Speaks badly about a previous employer or a community in the first hour.</Row>
            <Row>Won't drive Highway 17 or 502 in winter. The job is mostly winter.</Row>
            <Row>Can't name a single supplier or driver they've actually worked with.</Row>
            <Row>Wants the role mostly remote. The depot is the job.</Row>
          </Section>
        </div>

        <ThirtySixtyNinety
          d30="Knows every driver and supplier by name. Runs the 11/4 hand-offs without me on the call."
          d60="Owns depot rhythm. Flags problems 24 hours before they reach me."
          d90="I can be off-grid 3 days and the operation doesn't notice."
        />

        <div
          className="mt-[1.2vh] rounded-[0.4vw] px-[1.1vw] py-[0.9vh] flex items-stretch gap-[1vw]"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div className="shrink-0 flex flex-col justify-center min-w-[11vw] max-w-[14vw]">
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.74vw] font-semibold"
              style={{ color: "#e9c8a8" }}
            >
              + Plus the depot bench
            </div>
            <div className="font-display text-[1.25vw] leading-tight font-medium mt-[0.2vh]">
              OM&rsquo;s second hire — by week 6.
            </div>
            <div
              className="font-mono uppercase tracking-[0.18em] text-[0.66vw] mt-[0.4vh]"
              style={{ color: "#e9c8a8" }}
            >
              Cost-centre · SALT-01-LBR
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-[0.8vw] items-stretch">
            <BenchStat
              label="Headcount"
              value="4 seats"
              note="Casual / contracted · T4A · not employees · A→B→C→D rotation."
            />
            <BenchStat
              label="Hours · Rate"
              value={
                <>
                  ~150 hrs/seat/yr
                  <span className="block font-mono text-[0.95vw] mt-[0.15vh] opacity-90">
                    ×4 = ~600 hrs/yr · @ ${benchRate}/hr
                  </span>
                </>
              }
              note="Direct picking + Q4 overflow + paid standby. OM caps at 12 hrs/mo on the line."
            />
            <BenchStat
              label="Reconciles to"
              value={
                <>
                  {fmtKYr(saltBenchAnnual)} / yr
                  <span className="block font-mono text-[0.78vw] mt-[0.15vh] opacity-90">
                    {fmtKYr(saltBenchAnnual * 0.7)} channel-alloc · {fmtKYr(saltBenchAnnual * 0.3)} overhead
                  </span>
                </>
              }
              note="Same $15k line on SaltBench, the salt P&L, and the salt callout on Budget."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BenchStat({
  label,
  value,
  note,
}: {
  label: string;
  value: React.ReactNode;
  note: string;
}) {
  return (
    <div
      className="rounded-[0.3vw] px-[0.75vw] py-[0.45vh] flex flex-col"
      style={{ background: "rgba(244,237,224,0.08)" }}
    >
      <div
        className="font-mono uppercase tracking-[0.22em] text-[0.66vw] font-semibold"
        style={{ color: "#e9c8a8" }}
      >
        {label}
      </div>
      <div className="font-display text-[1.15vw] font-medium leading-tight mt-[0.15vh]">
        {value}
      </div>
      <div
        className="font-body text-[0.72vw] leading-[1.25] mt-[0.3vh]"
        style={{ opacity: 0.85 }}
      >
        {note}
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

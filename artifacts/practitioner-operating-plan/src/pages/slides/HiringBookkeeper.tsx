import { useCostValue } from "../../lib/costReview";
import { CostReviewButton } from "../../components/CostReviewButton";

export default function HiringBookkeeper() {
  const rate = useCostValue("rate.bookkeeper");
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[5vw] py-[4.5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
              V · Hiring 02 — Bookkeeper / Agency Admin
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Find someone CRA-fluent.
              <span className="italic font-normal text-accent"> Remote is fine. Vague is not.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.4vh]">
              Target hire
            </div>
            <div className="font-display text-[1.4vw] text-primary leading-tight font-medium">
              3–4 weeks to start
            </div>
            <div className="font-body text-[0.95vw] text-muted mt-[0.4vh] leading-[1.4]">
              First HST cycle is the real interview.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Where to source — Dryden first, remote second">
            <Row>CPB Canada directory (Certified Professional Bookkeepers) — filter by Ontario, then by small-business clients.</Row>
            <Row>Dryden &amp; District Chamber of Commerce: ask which firm or individual the local trades and contractors actually use.</Row>
            <Row>Northwestern Ontario CPA practitioners — many have a junior bookkeeper they hire out. Phone, don't email.</Row>
            <Row>Indeed / LinkedIn: <span className="font-mono">"freelance bookkeeper"</span> + <span className="font-mono">"Northwestern Ontario"</span> or <span className="font-mono">"remote Canada"</span>.</Row>
            <Row>Last resort: a virtual firm (Bench, Belay, Wagepoint partners). Convenient; expensive; less continuity.</Row>
          </Section>

          <Section title="Screening questions">
            <Row>Walk me through reconciling one month for a small Canadian consultancy with mixed cash + contract income.</Row>
            <Row>HST on services delivered to a First Nation on-reserve — what are the rules and what's the documentation?</Row>
            <Row>Turnaround commitment on a contractor invoice once it lands in your inbox?</Row>
            <Row>Do you carry E&amp;O insurance? Will you sign an NDA covering client community names and contract amounts?</Row>
            <Row>Worst accounting mistake you've ever caught — what was it and how did you find it?</Row>
          </Section>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Paid trial structure — 1 month at full rate">
            <Row><b>Scope.</b> Reconcile the prior 90 days. Build the month-end report template. File one HST cycle end-to-end.</Row>
            <Row><b>Cadence.</b> Weekly 30-min check-in. They send a Friday status note before the call.</Row>
            <Row><b>Decision day.</b> Day 30. If the books reconcile clean and the HST filed on time, the engagement continues. Otherwise paid out and ended.</Row>
            <Row>Paid at ${rate}/hr against a fixed scope cap so there's no incentive to drag.</Row>
          </Section>

          <Section title="Walk away if…" tone="danger">
            <Row>No CPB or CPA designation <i>and</i> no provable client list with at least one reference.</Row>
            <Row>Vague about a current CRA filing — payroll, HST, or T-slip — they handle today.</Row>
            <Row>Won't sign an NDA. Won't name a single tool they're fluent in.</Row>
            <Row>"I do everything in spreadsheets, no software." Fine for one client. Not for an agency.</Row>
            <Row>Quotes a flat retainer without asking what's in scope. They'll under-deliver to make the math work.</Row>
          </Section>
        </div>

        <ThirtySixtyNinety
          d30="Books reconciled to current month. All open invoices and receivables in one tracker."
          d60="Month-end reports land by the 5th. Cashflow forecast 60 days out, refreshed weekly."
          d90="HST and payroll filed on time without me touching them. Year-end is no longer something I worry about."
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

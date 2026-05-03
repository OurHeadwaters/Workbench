import { Reveal } from "../../../communityStore/plannerReveal";
import { Card, PageFrame } from "../components/PageFrame";

interface LeadingIndicator { id: string; name: string; question: string; store: string; hotel: string; good: string; cracking: string; owner: string; }

const INDICATORS: LeadingIndicator[] = [
  { id: "backup", name: "Hours-without-backup", question: "How many days this quarter ran on a single qualified person?", store: "Counted by the schedule. Cooler, till, ordering all checked.", hotel: "Counted by the schedule. Front desk and housekeeping checked.", good: "≤ 5 days / quarter / function", cracking: "≥ 12 days / quarter / function", owner: "Operator on shift logs daily; manager rolls up quarterly." },
  { id: "rotation", name: "Days-since-rotation", question: "When did each operator last swap a heavy function for a lighter one?", store: "Each operator: last till-heavy week swapped with ordering / back office.", hotel: "Each operator: last front-desk-heavy week swapped with admin / supplies.", good: "≤ 60 days for everyone", cracking: "Anyone over 90 days", owner: "Couple tracks for themselves; community liaison reviews monthly." },
  { id: "errors", name: "Error-rate-on-money", question: "How often did money go wrong this quarter?", store: "Voids over $20, float-off-by, deposit mismatch, count by month.", hotel: "Refunds, deposit mismatch, double-charge, count by month.", good: "≤ 1 / month", cracking: "≥ 4 / month, or any single error > $200", owner: "Bookkeeper logs monthly; reviewer signs the quarterly roll-up." },
  { id: "milestones", name: "Training-milestones-hit", question: "How many bench-is-real milestones (page 02) actually landed this quarter?", store: "Count of functions that advanced an ownership stage.", hotel: "Same — count of functions that advanced an ownership stage.", good: "≥ 1 / quarter", cracking: "0 milestones for 2 consecutive quarters", owner: "Hotel / store manager attests; steering committee ratifies." },
  { id: "complaints", name: "Complaint trend", question: "Are people complaining more, less, or about new things?", store: "Sticky-note jar at the till. Counted weekly, trended quarterly.", hotel: "Guest book + booking channel reviews, counted weekly, trended quarterly.", good: "Flat or down vs. last quarter", cracking: "Up two quarters in a row", owner: "Operator + community liaison, jointly." },
  { id: "calendar", name: "Calendar that bends", question: "Did the operation actually flex around community life this quarter?", store: "Funerals covered without the store closing. Hunting season schedule honoured.", hotel: "Council bookings honoured. Elders' gatherings prioritised.", good: "Every named event covered without escalation", cracking: "Any community event the operation refused or fumbled", owner: "Community liaison narrates; steering committee logs." },
];

export default function Indicators() {
  return (
    <PageFrame
      eyebrow="07 · How we know it's working"
      title="Six indicators."
      italic="Leading, not lagging."
      standfirst={<>Revenue is a lagging indicator — by the time it cracks, the slab is already gone. These six are leading. The band reads them every quarter.</>}
    >
      {INDICATORS.map((ind) => (
        <article key={ind.id} className="rounded-xl border overflow-hidden" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
          <header className="p-4">
            <div className="text-[10.5px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Indicator</div>
            <div className="text-[18px] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{ind.name}</div>
            <div className="italic text-[14.5px] leading-[1.45] mt-1" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{ind.question}</div>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 border-t" style={{ borderColor: "var(--cs-rule)" }}>
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Store · how it's measured</div>
              <div className="text-[13.5px] leading-[1.45]" style={{ color: "var(--cs-text)" }}>{ind.store}</div>
            </div>
            <div className="p-4 border-t sm:border-t-0 sm:border-l" style={{ borderColor: "var(--cs-rule)" }}>
              <div className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Hotel · how it's measured</div>
              <div className="text-[13.5px] leading-[1.45]" style={{ color: "var(--cs-text)" }}>{ind.hotel}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t" style={{ borderColor: "var(--cs-rule)" }}>
            <div className="p-3" style={{ background: "rgba(59,110,74,0.10)" }}>
              <div className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "#3b6e4a", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Holding</div>
              <div className="text-[14px] font-semibold leading-tight" style={{ color: "#22532f", fontFamily: "'Fraunces', Georgia, serif", fontVariantNumeric: "tabular-nums" }}>{ind.good}</div>
            </div>
            <div className="p-3" style={{ background: "rgba(156,42,28,0.08)" }}>
              <div className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "#9c2a1c", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Cracking</div>
              <div className="text-[14px] font-semibold leading-tight" style={{ color: "#7a1f15", fontFamily: "'Fraunces', Georgia, serif", fontVariantNumeric: "tabular-nums" }}>{ind.cracking}</div>
            </div>
          </div>
          <div className="px-4 py-3 border-t" style={{ borderColor: "var(--cs-rule)", background: "var(--cs-bg)" }}>
            <div className="text-[10px] uppercase tracking-[0.18em] mb-0.5" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Owner</div>
            <div className="text-[14px] leading-[1.45]" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{ind.owner}</div>
          </div>
        </article>
      ))}

      <Card tag="The cadence" head="Once a quarter. Same hour. Same room." body="Steering committee meets the operator couples every quarter, reads the six indicators in one sitting, names which ones are green / yellow / red, and decides what changes." />

      <Reveal label="Why these six and not revenue">
        <p>Revenue is the result. By the time it falls, the indicators on this page have already gone red for several quarters.</p>
        <p>A store or hotel that holds green on these six and still loses revenue has a different problem — a market or season problem, not a sustainability one.</p>
      </Reveal>

      <Reveal label="What the dashboard looks like in practice">
        <p>A single page, printed and pinned in the back office. Six rows. Three columns: last quarter, this quarter, next-quarter target.</p>
        <p>The community liaison brings it to council in the open part of the meeting. No one needs a spreadsheet to read it.</p>
      </Reveal>
    </PageFrame>
  );
}

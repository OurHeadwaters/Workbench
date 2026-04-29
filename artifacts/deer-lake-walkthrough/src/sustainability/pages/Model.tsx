import { Reveal } from "@/components/Reveal";
import { Card, PageFrame } from "../components/PageFrame";

/**
 * Unified model overview. One picture: store and hotel side by side,
 * shared mechanisms in the middle, operation-specific bits on the
 * outside. The point is to make clear that the playbook is the *one*
 * sustainability model, applied to both buildings.
 */

interface Row {
  label: string;
  shared: string;
  store: string;
  hotel: string;
}

const ROWS: Row[] = [
  {
    label: "Roles framework",
    shared: "Six critical functions, two named humans behind each one",
    store: "Till, ordering, cooler, daily close, cleaning, community liaison",
    hotel: "Front desk, housekeeping, breakfast, bookings, maintenance, community liaison",
  },
  {
    label: "Training pipeline",
    shared: "Outside contractor → operator couple → band staff, on milestones not dates",
    store: "Cross-train through one full retail season before couple owns it",
    hotel: "Cross-train through one full event-season cycle before couple owns it",
  },
  {
    label: "Handover cadence",
    shared: "Quarterly check-ins, milestone-triggered ownership migration",
    store: "Operator couple owns line items as cross-training milestones land",
    hotel: "Same cadence, different milestones",
  },
  {
    label: "Tooling continuity",
    shared: "Square + QuickBooks stay; the operating system around them is what survives",
    store: "Square POS, daily close, public price page, household lookup",
    hotel: "Square Bookings + Square POS for breakfast/store; QuickBooks back office",
  },
  {
    label: "Burnout protocol",
    shared: "Same four leading indicators, same response ladder, same ownership",
    store: "Hours / days-without-backup / customer complaints / money errors",
    hotel: "Same four indicators, plus turn-over count and double-booking rate",
  },
  {
    label: "Indicators",
    shared: "Quarterly leading-indicator dashboard, owner-reviewed",
    store: "Indicators owned by store manager, reviewed by band council",
    hotel: "Indicators owned by hotel manager, reviewed by band council",
  },
];

export default function Model() {
  return (
    <PageFrame
      eyebrow="01 · One model · two buildings"
      title="Same playbook."
      italic="Different buildings."
      standfirst={
        <>
          The store and the hotel are not separate systems. They share the same
          six mechanisms underneath; what changes is which job each mechanism
          gets pointed at. The band runs both from one document so a lesson
          learned in one building lands in the other within a week, not a year.
        </>
      }
    >
      <div className="space-y-3">
        {ROWS.map((row) => (
          <Card
            key={row.label}
            tag={row.label}
            head={row.shared}
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1"
            >
              <div
                className="rounded-md p-3"
                style={{
                  background: "rgba(31,61,46,0.06)",
                  border: "1px solid var(--color-rule)",
                }}
              >
                <div
                  className="mono text-[10px] uppercase tracking-[0.18em] mb-1"
                  style={{ color: "var(--color-accent-warm)" }}
                >
                  Store
                </div>
                <div className="text-[14px] leading-[1.45]">{row.store}</div>
              </div>
              <div
                className="rounded-md p-3"
                style={{
                  background: "rgba(31,61,46,0.06)",
                  border: "1px solid var(--color-rule)",
                }}
              >
                <div
                  className="mono text-[10px] uppercase tracking-[0.18em] mb-1"
                  style={{ color: "var(--color-accent-warm)" }}
                >
                  Hotel
                </div>
                <div className="text-[14px] leading-[1.45]">{row.hotel}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Reveal label="Why one model and not two">
        <p>
          A second model means a second runbook, a second training program, a
          second set of indicators, a second contractor. It also means a
          lesson learned in the store doesn't reach the hotel and a lesson
          learned in the hotel doesn't reach the store.
        </p>
        <p>
          The shared layer is what makes this affordable. The band staffs
          one bench that can move between buildings. The contractor runs one
          handover, not two. The chief reads one quarterly review, not two.
        </p>
      </Reveal>

      <Reveal label="What is genuinely different per building">
        <p>
          The store sells perishable groceries on a margin. Cold-chain breaks
          show up as spoilage and as customer trust. The bench needs cooler
          and freezer ownership specifically.
        </p>
        <p>
          The hotel sells overnight stays and a small breakfast service.
          Cleanliness, double-bookings, and turn-over time are the failure
          modes. The bench needs housekeeping and front-desk ownership
          specifically.
        </p>
        <p>
          Same six functions in both. The job each function does is different.
        </p>
      </Reveal>
    </PageFrame>
  );
}

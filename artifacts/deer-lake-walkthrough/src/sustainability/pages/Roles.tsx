import { Reveal } from "@/components/Reveal";
import { HonestyNote, PageFrame } from "../components/PageFrame";

/**
 * Roles & bench depth. For every critical function: the function, the
 * primary owner role, the named-bench requirement (at least one
 * cross-trained backup), and the cross-training milestone that proves
 * the bench is real. Same structure for store and hotel.
 */

interface Func {
  id: string;
  function: string;
  storeOwner: string;
  storeBench: string;
  storeMilestone: string;
  hotelOwner: string;
  hotelBench: string;
  hotelMilestone: string;
}

const FUNCTIONS: Func[] = [
  {
    id: "front",
    function: "Front-of-house operator",
    storeOwner: "Operator on shift",
    storeBench: "On-call pod (paid by the job)",
    storeMilestone: "Two pod members close the day solo, twice each, no contractor in the room",
    hotelOwner: "Couple at front desk",
    hotelBench: "One trained band relief per couple",
    hotelMilestone: "Relief check-ins one full weekend, no double-booking, no missed deposit",
  },
  {
    id: "money",
    function: "Money & bookkeeping",
    storeOwner: "Bookkeeper · remote",
    storeBench: "Band-side bookkeeper trainee",
    storeMilestone: "Trainee closes one full month with reviewer override only on exceptions",
    hotelOwner: "Bookkeeper · remote",
    hotelBench: "Same band-side trainee, one bench across both buildings",
    hotelMilestone: "Trainee closes one full month including occupancy reconciliation",
  },
  {
    id: "ordering",
    function: "Ordering & supply",
    storeOwner: "Dryden hub worker",
    storeBench: "On-call pod member trained on the order screen",
    storeMilestone: "One full season of weekly orders placed by band staff with hub on review only",
    hotelOwner: "Hotel manager",
    hotelBench: "Cross-trained store-side ordering pod member",
    hotelMilestone: "Linens & supplies cycle owned end-to-end for one quarter",
  },
  {
    id: "scheduling",
    function: "Scheduling & shift coverage",
    storeOwner: "Operator on shift",
    storeBench: "On-call pod self-claims open shifts",
    storeMilestone: "Three open weeks in a row covered without contractor or operator brokering",
    hotelOwner: "Couple at front desk",
    hotelBench: "Band relief covers one full rest week per quarter",
    hotelMilestone: "Couple takes a paid week off and the hotel runs",
  },
  {
    id: "maintenance",
    function: "Maintenance & physical plant",
    storeOwner: "Operator on shift",
    storeBench: "Named band-side handyperson on retainer",
    storeMilestone: "Cooler, freezer, and POS hardware all serviced once without flying anyone in",
    hotelOwner: "Hotel manager",
    hotelBench: "Same retainer handyperson",
    hotelMilestone: "One full furnace and one full plumbing fix, on the day, no contractor on a plane",
  },
  {
    id: "liaison",
    function: "Community liaison",
    storeOwner: "Operator from the community",
    storeBench: "Steering-committee member, rotating",
    storeMilestone: "One funeral week, one hunting season, one treaty days week handled with the calendar that bends",
    hotelOwner: "Same operator if local; band-appointed if not",
    hotelBench: "Steering-committee member, rotating",
    hotelMilestone: "One council booking, one elders' gathering, one outside-contractor stay all handled with no community escalation",
  },
];

export default function Roles() {
  return (
    <PageFrame
      eyebrow="02 · Roles & bench depth"
      title="No single point of failure."
      italic="Two named humans behind every job."
      standfirst={
        <>
          Six critical functions in each building. For each one: a primary
          owner, a named backup who has actually done the job, and a milestone
          — not a date — that proves the backup is real. The bench is real
          when somebody other than the primary has run the function alone.
        </>
      }
    >
      {/*
        Who employs whom — across all six functions. The contractor is
        already the band's operator at the hotel and carries the operating
        payroll there; the same model extends to the store. Headwaters is
        the store-specialist sub the contractor brings in.
      */}
      <aside
        className="rounded-xl border-2 p-4"
        style={{
          background: "var(--color-paper)",
          borderColor: "var(--color-accent-warm)",
        }}
      >
        <div
          className="mono text-[10.5px] uppercase tracking-[0.20em] mb-2"
          style={{ color: "var(--color-accent-warm)" }}
        >
          Who employs whom · across all six functions
        </div>
        <ul
          className="space-y-2 text-[14.5px] leading-[1.45] list-none pl-0"
          style={{ color: "var(--color-text)" }}
        >
          <li>
            <span className="font-semibold">
              Operator couple, on-call pod, named bench:
            </span>{" "}
            on the contractor's payroll — same model already running the
            band's hotel today.
          </li>
          <li>
            <span className="font-semibold">
              Practitioner, Distribution Lead, IT/Assistant:
            </span>{" "}
            on Headwaters' payroll — Practitioner (software), Distribution Lead Tyler (Thunder Bay → Deer Lake, in person), IT/Assistant (bookkeeping, domains, Tyler's support). Engaged when food is flowing.
          </li>
          <li>
            <span className="font-semibold">
              Community liaison, council oversight:
            </span>{" "}
            band, no payroll change.
          </li>
        </ul>
      </aside>

      {FUNCTIONS.map((f) => (
        <article
          key={f.id}
          className="rounded-xl border overflow-hidden"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-rule)",
          }}
        >
          <header
            className="px-4 py-3 border-b"
            style={{
              background: "var(--color-primary)",
              borderColor: "var(--color-rule)",
            }}
          >
            <div
              className="mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              Function
            </div>
            <div
              className="serif text-[18px] font-semibold mt-0.5"
              style={{ color: "var(--color-bg)" }}
            >
              {f.function}
            </div>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <BuildingBlock
              label="Store"
              owner={f.storeOwner}
              bench={f.storeBench}
              milestone={f.storeMilestone}
            />
            <div
              className="border-t sm:border-t-0 sm:border-l"
              style={{ borderColor: "var(--color-rule)" }}
            >
              <BuildingBlock
                label="Hotel"
                owner={f.hotelOwner}
                bench={f.hotelBench}
                milestone={f.hotelMilestone}
              />
            </div>
          </div>
        </article>
      ))}

      <Reveal label="What 'the bench is real' means">
        <p>
          A name on a roster is not a bench. A person who has actually closed
          the day, run the cooler check, or covered the front desk for a full
          shift, alone, twice — that is a bench. The milestone column is what
          we check, not who is named.
        </p>
        <p>
          Until the milestone is met, the function still depends on its
          primary. The handover plan in the next section migrates ownership
          based on those milestones, not on the calendar.
        </p>
      </Reveal>

      <HonestyNote>
        The hotel rows assume one couple and one named relief, which is the
        shape we expect from the conversations so far. The actual bench at the
        hotel today, the actual relief shifts the current couple has covered,
        and the actual handyperson on retainer are unknown to us; the band
        fills those names in here directly.
      </HonestyNote>
    </PageFrame>
  );
}

function BuildingBlock({
  label,
  owner,
  bench,
  milestone,
}: {
  label: string;
  owner: string;
  bench: string;
  milestone: string;
}) {
  return (
    <div className="p-4">
      <div
        className="mono text-[10.5px] uppercase tracking-[0.18em] mb-2"
        style={{ color: "var(--color-accent-warm)" }}
      >
        {label}
      </div>
      <dl className="space-y-2 text-[14.5px] leading-[1.45]">
        <div>
          <dt
            className="mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--color-muted)" }}
          >
            Primary owner
          </dt>
          <dd
            className="serif font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            {owner}
          </dd>
        </div>
        <div>
          <dt
            className="mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--color-muted)" }}
          >
            Named bench
          </dt>
          <dd style={{ color: "var(--color-text)" }}>{bench}</dd>
        </div>
        <div>
          <dt
            className="mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--color-muted)" }}
          >
            Bench-is-real milestone
          </dt>
          <dd
            className="italic"
            style={{ color: "var(--color-text)" }}
          >
            {milestone}
          </dd>
        </div>
      </dl>
    </div>
  );
}

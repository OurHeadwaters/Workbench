import { Reveal } from "../../../communityStore/plannerReveal";
import { HonestyNote, PageFrame } from "../components/PageFrame";

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
  { id: "front", function: "Front-of-house operator", storeOwner: "Operator on shift", storeBench: "On-call pod (paid by the job)", storeMilestone: "Two pod members close the day solo, twice each, no contractor in the room", hotelOwner: "Couple at front desk", hotelBench: "One trained band relief per couple", hotelMilestone: "Relief checks in one full weekend, no double-booking, no missed deposit" },
  { id: "money", function: "Money & bookkeeping", storeOwner: "Bookkeeper · remote", storeBench: "Band-side bookkeeper trainee", storeMilestone: "Trainee closes one full month with reviewer override only on exceptions", hotelOwner: "Bookkeeper · remote", hotelBench: "Same band-side trainee, one bench across both buildings", hotelMilestone: "Trainee closes one full month including occupancy reconciliation" },
  { id: "ordering", function: "Ordering & supply", storeOwner: "Distribution hub worker", storeBench: "On-call pod member trained on the order screen", storeMilestone: "One full season of weekly orders placed by band staff with hub on review only", hotelOwner: "Hotel manager", hotelBench: "Cross-trained store-side ordering pod member", hotelMilestone: "Linens & supplies cycle owned end-to-end for one quarter" },
  { id: "scheduling", function: "Scheduling & shift coverage", storeOwner: "Operator on shift", storeBench: "On-call pod self-claims open shifts", storeMilestone: "Three open weeks in a row covered without contractor or operator brokering", hotelOwner: "Couple at front desk", hotelBench: "Band relief covers one full rest week per quarter", hotelMilestone: "Couple takes a paid week off and the hotel runs" },
  { id: "maintenance", function: "Maintenance & physical plant", storeOwner: "Operator on shift", storeBench: "Named band-side handyperson on retainer", storeMilestone: "Cooler, freezer, and POS hardware all serviced once without flying anyone in", hotelOwner: "Hotel manager", hotelBench: "Same retainer handyperson", hotelMilestone: "One full furnace and one full plumbing fix, on the day, no contractor on a plane" },
  { id: "liaison", function: "Community liaison", storeOwner: "Operator from the community", storeBench: "Steering-committee member, rotating", storeMilestone: "One funeral week, one hunting season, one treaty days week handled with the calendar that bends", hotelOwner: "Same operator if local; band-appointed if not", hotelBench: "Steering-committee member, rotating", hotelMilestone: "One council booking, one elders' gathering, one outside-contractor stay all handled with no community escalation" },
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
          — not a date — that proves the backup is real.
        </>
      }
    >
      <aside className="rounded-xl border-2 p-4" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-accent-warm)" }}>
        <div className="text-[10.5px] uppercase tracking-[0.20em] mb-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Who employs whom · across all six functions</div>
        <ul className="space-y-2 text-[14.5px] leading-[1.45] list-none pl-0" style={{ color: "var(--cs-text)" }}>
          <li><span className="font-semibold">Operator couple, on-call pod, named bench:</span> on the contractor's payroll — same model already running the band's hotel today.</li>
          <li><span className="font-semibold">Practitioner, Distribution Lead, IT/Assistant:</span> on the practice team's payroll. Practitioner (software), Distribution Lead (Thunder Bay → community, in person), IT/Assistant (bookkeeping, domains, distribution support). Engaged when food is flowing.</li>
          <li><span className="font-semibold">Community liaison, council oversight:</span> band, no payroll change.</li>
        </ul>
      </aside>

      {FUNCTIONS.map((f) => (
        <article key={f.id} className="rounded-xl border overflow-hidden" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
          <header className="px-4 py-3 border-b" style={{ background: "var(--cs-primary)", borderColor: "var(--cs-rule)" }}>
            <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--cs-accent)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Function</div>
            <div className="text-[18px] font-semibold mt-0.5" style={{ color: "var(--cs-bg)", fontFamily: "'Fraunces', Georgia, serif" }}>{f.function}</div>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <BuildingBlock label="Store" owner={f.storeOwner} bench={f.storeBench} milestone={f.storeMilestone} />
            <div className="border-t sm:border-t-0 sm:border-l" style={{ borderColor: "var(--cs-rule)" }}>
              <BuildingBlock label="Hotel" owner={f.hotelOwner} bench={f.hotelBench} milestone={f.hotelMilestone} />
            </div>
          </div>
        </article>
      ))}

      <Reveal label="What 'the bench is real' means">
        <p>A name on a roster is not a bench. A person who has actually closed the day, run the cooler check, or covered the front desk for a full shift, alone, twice — that is a bench.</p>
        <p>Until the milestone is met, the function still depends on its primary.</p>
      </Reveal>

      <HonestyNote>
        The hotel rows assume one couple and one named relief. The actual bench at the hotel today, the actual relief shifts, and the actual handyperson on retainer are unknown to us; the band fills those names in here directly.
      </HonestyNote>
    </PageFrame>
  );
}

function BuildingBlock({ label, owner, bench, milestone }: { label: string; owner: string; bench: string; milestone: string }) {
  return (
    <div className="p-4">
      <div className="text-[10.5px] uppercase tracking-[0.18em] mb-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{label}</div>
      <dl className="space-y-2 text-[14.5px] leading-[1.45]">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Primary owner</dt>
          <dd className="font-medium" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{owner}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Named bench</dt>
          <dd style={{ color: "var(--cs-text)" }}>{bench}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Bench-is-real milestone</dt>
          <dd className="italic" style={{ color: "var(--cs-text)" }}>{milestone}</dd>
        </div>
      </dl>
    </div>
  );
}

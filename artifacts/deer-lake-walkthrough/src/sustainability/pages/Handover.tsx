import { Reveal } from "@/components/Reveal";
import { PageFrame } from "../components/PageFrame";

/**
 * The centerpiece page. Year-by-year handover plan ("the band takes
 * the wheel"). For each function, ownership migrates outside contractor
 * → operator couple → band staff. Triggers are milestones, not dates.
 *
 * Visual: a three-column "ladder" per function — Y1 / Y2 / Y3, each
 * cell showing who owns it that year and what milestone advances it.
 */

type Owner = "contractor" | "couple" | "band";

interface YearCell {
  owner: Owner;
  trigger: string;
}

interface Migration {
  function: string;
  y1: YearCell;
  y2: YearCell;
  y3: YearCell;
}

const STORE: Migration[] = [
  {
    function: "Daily close",
    y1: { owner: "contractor", trigger: "Couple shadows for 90 days" },
    y2: { owner: "couple", trigger: "Couple closes solo for 30 consecutive days" },
    y3: { owner: "band", trigger: "Two pod members each close 10 days unsupervised" },
  },
  {
    function: "Ordering",
    y1: { owner: "contractor", trigger: "Couple co-orders one full season" },
    y2: { owner: "couple", trigger: "Couple owns ordering one season, hub on review only" },
    y3: { owner: "band", trigger: "Pod orderer runs one season; hub off the loop" },
  },
  {
    function: "Cooler & spoilage",
    y1: { owner: "contractor", trigger: "Couple logs temps daily for 60 days" },
    y2: { owner: "couple", trigger: "Couple owns one quarter without contractor visit" },
    y3: { owner: "band", trigger: "Pod runs a full month including a deep clean" },
  },
  {
    function: "Books & payroll",
    y1: { owner: "contractor", trigger: "Bookkeeper runs everything; trainee shadows" },
    y2: { owner: "couple", trigger: "Trainee closes one full month with reviewer override" },
    y3: { owner: "band", trigger: "Trainee closes a quarter; reviewer signs only on exception" },
  },
  {
    function: "Hiring & schedule",
    y1: { owner: "contractor", trigger: "Couple co-runs 2 hires; templates handed over" },
    y2: { owner: "couple", trigger: "Couple owns hiring; community liaison sits in" },
    y3: { owner: "band", trigger: "Steering committee approves; couple advisory only" },
  },
];

const HOTEL: Migration[] = [
  {
    function: "Bookings & front desk",
    y1: { owner: "contractor", trigger: "System set up; couple owns daily front desk" },
    y2: { owner: "couple", trigger: "Couple owns one event-season cycle solo" },
    y3: { owner: "band", trigger: "Relief covers one full week; couple takes leave; no slip" },
  },
  {
    function: "Housekeeping",
    y1: { owner: "contractor", trigger: "Standards written; couple manages the line" },
    y2: { owner: "couple", trigger: "Couple owns hiring; turn-over time hits target" },
    y3: { owner: "band", trigger: "Lead housekeeper from the band runs the line; couple advisory" },
  },
  {
    function: "Bookkeeping",
    y1: { owner: "contractor", trigger: "Same remote bookkeeper as store; trainee shadows" },
    y2: { owner: "couple", trigger: "Trainee closes month including occupancy reconciliation" },
    y3: { owner: "band", trigger: "Trainee closes quarter; reviewer signs only on exception" },
  },
  {
    function: "Maintenance",
    y1: { owner: "contractor", trigger: "Hand over manual; retainer handyperson named" },
    y2: { owner: "couple", trigger: "One full furnace season managed locally" },
    y3: { owner: "band", trigger: "Annual systems review run by the band's retainer" },
  },
  {
    function: "Community use",
    y1: { owner: "contractor", trigger: "Booking-priority rules ratified by council" },
    y2: { owner: "couple", trigger: "Couple manages council & elder bookings under those rules" },
    y3: { owner: "band", trigger: "Steering committee owns scheduling priority" },
  },
];

export default function Handover() {
  return (
    <PageFrame
      eyebrow="03 · Band takes the wheel"
      title="Year by year."
      italic="Triggered by milestones, not dates."
      standfirst={
        <>
          Every function starts with the outside contractor. Each function
          moves to the operator couple when a specific milestone lands. Each
          function moves to band staff when the next one lands. Years 1, 2, 3
          are the order — the season the milestone happens in is the trigger.
        </>
      }
    >
      <Legend />

      <BuildingHandover label="Store" rows={STORE} />
      <BuildingHandover label="Hotel" rows={HOTEL} />

      <Reveal label="Why milestones, not dates">
        <p>
          Calendar dates lie. A year written on a contract is a year that the
          band signs up to lose if a function isn't actually ready. A
          milestone makes the readiness visible: "the bench has done the job
          alone, this many times, without contractor help" is a thing
          everybody can see and nobody can fudge.
        </p>
        <p>
          The Y1 / Y2 / Y3 framing is the order in which we expect the
          milestones to land. If a season is short or a season is missed,
          the function waits one cycle. The band doesn't take the wheel
          before the bench is real.
        </p>
      </Reveal>

      <Reveal label="What this contract should say">
        <p>
          The contract names the milestones, not the dates. The contractor's
          fee steps down as ownership migrates: the higher-touch functions
          (Y1) are billed at a higher rate, and the rate falls each time a
          function moves to the band.
        </p>
        <p>
          By the end of Y3, the contractor's monthly fee is small enough that
          the band can decide to renew or walk away on operations alone, with
          no functional dependency.
        </p>
      </Reveal>
    </PageFrame>
  );
}

const OWNER_STYLE: Record<Owner, { label: string; bg: string; ink: string }> = {
  contractor: {
    label: "Contractor",
    bg: "rgba(184,90,62,0.18)",
    ink: "#7e3a25",
  },
  couple: {
    label: "Couple",
    bg: "rgba(31,61,46,0.10)",
    ink: "var(--color-primary)",
  },
  band: {
    label: "Band",
    bg: "rgba(59,110,74,0.18)",
    ink: "#1f3d2e",
  },
};

function Legend() {
  return (
    <div
      className="rounded-xl p-3 border flex flex-wrap items-center gap-2 text-[12px]"
      style={{
        background: "var(--color-paper)",
        borderColor: "var(--color-rule)",
      }}
    >
      <span
        className="mono text-[10px] uppercase tracking-[0.18em] mr-1"
        style={{ color: "var(--color-muted)" }}
      >
        Who owns it
      </span>
      {(Object.keys(OWNER_STYLE) as Owner[]).map((o) => (
        <span
          key={o}
          className="mono text-[10.5px] uppercase tracking-[0.16em] px-2 py-1 rounded-md"
          style={{
            background: OWNER_STYLE[o].bg,
            color: OWNER_STYLE[o].ink,
          }}
        >
          {OWNER_STYLE[o].label}
        </span>
      ))}
    </div>
  );
}

function BuildingHandover({
  label,
  rows,
}: {
  label: string;
  rows: Migration[];
}) {
  return (
    <section
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
          Building
        </div>
        <div
          className="serif text-[20px] font-semibold"
          style={{ color: "var(--color-bg)" }}
        >
          {label}
        </div>
      </header>
      <div className="divide-y" style={{ borderColor: "var(--color-rule)" }}>
        {rows.map((m) => (
          <div key={m.function} className="p-4">
            <div
              className="serif text-[16px] font-semibold mb-2"
              style={{ color: "var(--color-primary)" }}
            >
              {m.function}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(["y1", "y2", "y3"] as const).map((y, idx) => {
                const cell = m[y];
                return (
                  <div
                    key={y}
                    className="rounded-md p-3"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-rule)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className="mono text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: "var(--color-muted)" }}
                      >
                        Year {idx + 1}
                      </span>
                      <span
                        className="mono text-[10px] uppercase tracking-[0.16em] px-1.5 py-0.5 rounded"
                        style={{
                          background: OWNER_STYLE[cell.owner].bg,
                          color: OWNER_STYLE[cell.owner].ink,
                        }}
                      >
                        {OWNER_STYLE[cell.owner].label}
                      </span>
                    </div>
                    <div
                      className="text-[13.5px] leading-[1.4]"
                      style={{ color: "var(--color-text)" }}
                    >
                      {cell.trigger}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

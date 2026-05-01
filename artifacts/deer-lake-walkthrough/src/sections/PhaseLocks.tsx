import { Reveal } from "@/components/Reveal";
import { ROUTES } from "@/lib/paths";
import { usePlannerLockDates } from "@/planner/usePlannerLockDates";

/**
 * Phase locks — the literal lock schedule the contractor can hand to
 * their CFO. ReworkRisk above sells "secured planning" as a posture
 * (we lock the brief phase by phase). This section converts the
 * posture into a deliverable: which decisions get locked at which
 * construction phase, who signs them, and which already-shipped
 * artifact carries the proof.
 *
 * Each card now shows the live lock-by date sourced from the Phase
 * Planner (same localStorage state, same derive() math). Flip the
 * scenario in the planner and the dates update here on next visit.
 *
 * Three phase cards above the fold (Pre-frame, Pre-electrical,
 * Pre-finish), each with a Reveal carrying the literal checklist,
 * the signer ledger, the link out to the proof artifact, and a
 * plain-language slip-consequence paragraph.
 */
export default function PhaseLocks() {
  const lockDates = usePlannerLockDates();

  const phases = [
    {
      tag: "Phase 1 · Pre-frame",
      head: "Before the walls go up.",
      lockFmt: lockDates.preFrameFmt,
      body: "Floor plan, cold-chain footprint, role design. Locked together — so the door is wide enough for the freezer, and the freezer is sized for the truck.",
    },
    {
      tag: "Phase 2 · Pre-electrical",
      head: "Before the conduit gets pulled.",
      lockFmt: lockDates.preElectricalFmt,
      body: "Till position, back-of-house placement, public-records hardware. Locked before the electrician decides where the outlets live.",
    },
    {
      tag: "Phase 3 · Pre-finish",
      head: "Before the sign goes on the building.",
      lockFmt: lockDates.preFinishFmt,
      body: "Signage, public price page, opening-day staffing. Locked before opening week — so day one isn't the day the band first sees the price list.",
    },
  ];

  return (
    <section
      id="phase-locks"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--color-accent-warm)" }}
        >
          What gets locked, and when
        </div>
        <h2
          className="serif font-medium text-[34px] leading-[1.1]"
          style={{ color: "var(--color-primary)", textWrap: "balance" }}
        >
          Three locks.
          <span
            className="italic font-normal block mt-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            One build, done once.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          The contractor's CFO can point at this schedule and see
          exactly which decisions get settled before each phase of the
          build — and which already-shipped artifact carries the
          signed-off proof.
        </p>

        <p
          className="mono text-[11px] uppercase tracking-[0.18em] mt-4"
          style={{ color: "var(--color-muted)" }}
        >
          Dates from the{" "}
          <a
            href={ROUTES.planner}
            className="underline underline-offset-2 hover:no-underline"
            style={{ color: "var(--color-accent-warm)" }}
          >
            build calendar
          </a>
          {" "}·{" "}{lockDates.scenarioLabel} scenario
        </p>

        <ol className="mt-5 space-y-3 list-none pl-0">
          {phases.map((phase, i) => (
            <li
              key={phase.tag}
              className="flex gap-4 rounded-xl p-4 border-l-4"
              style={{
                background: "var(--color-paper)",
                borderColor: "var(--color-accent-warm)",
              }}
            >
              <div
                className="mono text-[18px] tabular-nums shrink-0 leading-none pt-0.5"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <div
                    className="mono text-[10.5px] uppercase tracking-[0.18em]"
                    style={{ color: "var(--color-accent-warm)" }}
                  >
                    {phase.tag}
                  </div>
                  <div
                    className="mono text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded"
                    style={{
                      background: "color-mix(in srgb, var(--color-accent-warm) 12%, transparent)",
                      color: "var(--color-accent-warm)",
                    }}
                  >
                    Lock by {phase.lockFmt}
                  </div>
                </div>
                <div
                  className="serif text-[18px] leading-[1.3] font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {phase.head}
                </div>
                <div
                  className="serif text-[15.5px] leading-[1.45] mt-1.5"
                  style={{ color: "var(--color-text)" }}
                >
                  {phase.body}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-3">
          <Reveal label="Phase 1 · Pre-frame — what gets locked, who signs, where the proof lives">
            <p>
              <span className="font-semibold">Lock by:</span>{" "}
              <span
                className="mono text-[12px]"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {lockDates.preFrameFmt}
              </span>
              {" "}— the day construction begins ({lockDates.scenarioLabel}{" "}
              scenario
              {lockDates.mode === "self-fund" ? ", reserve-funded" : ", grant-funded"}).
              Dates move when you flip the scenario in the{" "}
              <a
                href={ROUTES.planner}
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                build calendar
              </a>.
            </p>
            <p>
              <span className="font-semibold">Locked at this gate:</span>{" "}
              the store's floor plan, the cold-chain footprint
              (freezer dimensions, dock height, receiving aisle), and
              the role design (which two people stand on the floor,
              which roles flex around them).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Floor plan — door widths, aisle widths, public-records counter.</li>
              <li>Cold-chain footprint — freezer + cooler dimensions, dock placement, receiving aisle.</li>
              <li>Role design — operator-couple seats, flex roles, food-safety presence on day one.</li>
            </ul>
            <p>
              <span className="font-semibold">Signed by:</span>{" "}
              Chief (ratifies), Headwaters practitioner (owns the
              brief), contractor's site foreman (acknowledges and
              builds to it).
            </p>
            <p
              style={{
                borderLeft: "3px solid var(--color-accent-warm)",
                paddingLeft: "0.75rem",
                opacity: 0.85,
              }}
            >
              <span className="font-semibold">If this gate slips:</span>{" "}
              framing begins on an unlocked floor plan. The freezer
              may not fit through the door that gets built. Catching
              that mid-frame means cutting and re-framing — a cost the
              contractor absorbs in change-order negotiations with the
              band, and a delay that pushes every downstream gate.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "var(--color-muted)" }}
            >
              Proof · operating plan{" "}
              <a
                href="/practitioners-guide-v2/workbench"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                /practitioners-guide-v2/workbench
              </a>{" "}
              · cockpit{" "}
              <a
                href={ROUTES.cockpitFloor}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                /cockpit/floor
              </a>{" "}
              ·{" "}
              <a
                href="#cold-chain"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                cold-chain section
              </a>{" "}
              ·{" "}
              <a
                href="#who-works"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                who-works section
              </a>
            </p>
          </Reveal>

          <Reveal label="Phase 2 · Pre-electrical — what gets locked, who signs, where the proof lives">
            <p>
              <span className="font-semibold">Lock by:</span>{" "}
              <span
                className="mono text-[12px]"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {lockDates.preElectricalFmt}
              </span>
              {" "}— 45 days into the build, before the electrical sub
              pulls conduit ({lockDates.scenarioLabel} scenario).
            </p>
            <p>
              <span className="font-semibold">Locked at this gate:</span>{" "}
              till + back-of-house placement, and the public-records
              hardware that sits behind the open-records software.
              Done before the electrician runs conduit — so outlets,
              data drops, and counter heights match the actual
              workflow, not the architect's guess.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Till station — exact position, counter height, customer-facing screen.</li>
              <li>Back-of-house — receiving desk, manager workstation, cold-chain readout.</li>
              <li>Public-records hardware — open-records terminal, daily-close station, household-lookup screen.</li>
            </ul>
            <p>
              <span className="font-semibold">Signed by:</span>{" "}
              Headwaters practitioner (owns the brief), contractor's
              electrical sub (acknowledges and pulls to it), operator
              couple (walks the position before sign-off).
            </p>
            <p
              style={{
                borderLeft: "3px solid var(--color-accent-warm)",
                paddingLeft: "0.75rem",
                opacity: 0.85,
              }}
            >
              <span className="font-semibold">If this gate slips:</span>{" "}
              the electrician makes their best guess on outlet placement.
              The till ends up 30 cm from where the operator couple
              needs it, the cold-chain readout has no data drop, and
              the open-records terminal is on the wrong wall. Retrofitting
              after drywall means cutting, patching, and re-inspecting —
              delays and costs that compound into the soft-opening window.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "var(--color-muted)" }}
            >
              Proof ·{" "}
              <a
                href={ROUTES.cockpitTill}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                /cockpit/till
              </a>{" "}
              ·{" "}
              <a
                href="/headwaters-books/embed/open-records"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                open-records screen
              </a>{" "}
              ·{" "}
              <a
                href={ROUTES.cockpitLocks}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-warm)" }}
              >
                /cockpit/locks
              </a>
            </p>
          </Reveal>

          <Reveal label="Phase 3 · Pre-finish — what gets locked, who signs, where the proof lives" variant="ink">
            <p>
              <span className="font-semibold">Lock by:</span>{" "}
              <span
                className="mono text-[12px]"
                style={{ color: "rgba(244,237,224,0.9)" }}
              >
                {lockDates.preFinishFmt}
              </span>
              {" "}— the soft-opening date, 30 days before doors open
              ({lockDates.scenarioLabel} scenario).
            </p>
            <p>
              <span className="font-semibold">Locked at this gate:</span>{" "}
              the signage on the building, the public price page the
              band can read before day one, and the opening-day
              staffing schedule. Done before the painter starts and
              the sign-maker quotes — so the band sees the prices
              before the doors open, not after.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Signage — exterior name, hours panel, food-safety contact.</li>
              <li>Public price page — every SKU, every price, readable on a phone.</li>
              <li>Opening-day staffing — operator couple + Headwaters food-safety person, hour by hour.</li>
            </ul>
            <p>
              <span className="font-semibold">Signed by:</span>{" "}
              Chief (ratifies the public face), Headwaters
              practitioner (owns the brief and the price page),
              operator couple (commits to the opening-day schedule).
            </p>
            <p
              style={{
                borderLeft: "3px solid rgba(244,237,224,0.5)",
                paddingLeft: "0.75rem",
                opacity: 0.85,
              }}
            >
              <span className="font-semibold">If this gate slips:</span>{" "}
              the band sees the price list on day one — simultaneously
              with the community. The opening-day staffing schedule
              goes unsigned, so the operator couple shows up without a
              confirmed roster. The sign-maker quotes on an unfinished
              brief, adding a change-order round. Each slip here is
              visible to the whole community on opening morning.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "rgba(244,237,224,0.7)" }}
            >
              Proof · operating plan{" "}
              <a
                href="/practitioners-guide-v2/workbench"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                /practitioners-guide-v2/workbench
              </a>{" "}
              · price page{" "}
              <a
                href="/headwaters-books/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                /headwaters-books
              </a>{" "}
              · cockpit{" "}
              <a
                href={ROUTES.cockpitHome}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                /cockpit/home
              </a>{" "}
              ·{" "}
              <a
                href="#first-morning"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                first-morning section
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

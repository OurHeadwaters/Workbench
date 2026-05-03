import { Reveal } from "../plannerReveal";
import { usePlannerLockDates } from "../planner/usePlannerLockDates";
import { PHASE_LOCKS } from "../phase-locks-data";

export default function PhaseLocks({ onOpenPlanner }: { onOpenPlanner: () => void }) {
  const lockDates = usePlannerLockDates();
  const lockFmts = [lockDates.preFrameFmt, lockDates.preElectricalFmt, lockDates.preFinishFmt];
  const phases = PHASE_LOCKS.map((phase, i) => ({ ...phase, lockFmt: lockFmts[i] }));

  return (
    <section id="cs-phase-locks" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>What gets locked, and when</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          Three locks.
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>One build, done once.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>The contractor's CFO can point at this schedule and see exactly which decisions get settled before each phase of the build — and which already-shipped artifact carries the signed-off proof.</p>
        <p className="text-[11px] uppercase tracking-[0.18em] mt-4" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
          Dates from the{" "}
          <button type="button" onClick={onOpenPlanner} className="underline underline-offset-2 hover:no-underline" style={{ color: "var(--cs-accent-warm)" }}>build calendar</button>
          {" "}·{" "}{lockDates.scenarioLabel} scenario
        </p>

        <ol className="mt-5 space-y-3 list-none pl-0">
          {phases.map((phase) => (
            <li key={phase.tag} className="flex gap-4 rounded-xl p-4 border-l-4" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-accent-warm)" }}>
              <div className="text-[18px] tabular-nums shrink-0 leading-none pt-0.5" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{phase.number}</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <div className="text-[10.5px] uppercase tracking-[0.18em]" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{phase.tag}</div>
                  <div className="text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded" style={{ background: "color-mix(in srgb, var(--cs-accent-warm) 12%, transparent)", color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Lock by {phase.lockFmt}</div>
                </div>
                <div className="text-[18px] leading-[1.3] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{phase.headline}</div>
                <div className="text-[15.5px] leading-[1.45] mt-1.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{phase.summary}</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <button type="button" onClick={onOpenPlanner} data-testid="cs-phase-locks-open-planner" className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] rounded-lg px-4 py-2.5 border transition-opacity hover:opacity-80" style={{ background: "var(--cs-primary)", color: "var(--cs-bg)", borderColor: "var(--cs-primary)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
            Open the build calendar →
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <Reveal label="Phase 1 · Pre-frame — what gets locked, who signs, where the proof lives">
            <p><span className="font-semibold">Lock by:</span> <span className="text-[12px]" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{lockDates.preFrameFmt}</span> — the day construction begins.</p>
            <p><span className="font-semibold">Locked at this gate:</span> the store's floor plan, the cold-chain footprint (freezer dimensions, dock height, receiving aisle), and the role design.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Floor plan — door widths, aisle widths, public-records counter.</li>
              <li>Cold-chain footprint — freezer + cooler dimensions, dock placement, receiving aisle.</li>
              <li>Role design — operator-couple seats, flex roles, food-safety presence on day one.</li>
            </ul>
            <p><span className="font-semibold">Signed by:</span> Chief (ratifies), Headwaters practitioner (owns the brief), contractor's site foreman (acknowledges and builds to it).</p>
            <p style={{ borderLeft: "3px solid var(--cs-accent-warm)", paddingLeft: "0.75rem", opacity: 0.85 }}><span className="font-semibold">If this gate slips:</span> framing begins on an unlocked floor plan. The freezer may not fit through the door that gets built.</p>
          </Reveal>

          <Reveal label="Phase 2 · Pre-electrical — what gets locked, who signs, where the proof lives">
            <p><span className="font-semibold">Lock by:</span> <span className="text-[12px]" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{lockDates.preElectricalFmt}</span> — 45 days into the build, before the electrical sub pulls conduit.</p>
            <p><span className="font-semibold">Locked at this gate:</span> till + back-of-house placement, and the public-records hardware. Done before the electrician runs conduit.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Till station — exact position, counter height, customer-facing screen.</li>
              <li>Back-of-house — receiving desk, manager workstation, cold-chain readout.</li>
              <li>Public-records hardware — open-records terminal, daily-close station, household-lookup screen.</li>
            </ul>
            <p><span className="font-semibold">Signed by:</span> Headwaters practitioner (owns the brief), contractor's electrical sub (acknowledges and pulls to it), operator couple (walks the position before sign-off).</p>
            <p style={{ borderLeft: "3px solid var(--cs-accent-warm)", paddingLeft: "0.75rem", opacity: 0.85 }}><span className="font-semibold">If this gate slips:</span> the electrician makes their best guess on outlet placement.</p>
          </Reveal>

          <Reveal label="Phase 3 · Pre-finish — what gets locked, who signs, where the proof lives" variant="ink">
            <p><span className="font-semibold">Lock by:</span> <span className="text-[12px]" style={{ color: "rgba(244,237,224,0.9)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{lockDates.preFinishFmt}</span> — the soft-opening date, 30 days before doors open.</p>
            <p><span className="font-semibold">Locked at this gate:</span> the signage on the building, the public price page the band can read before day one, and the opening-day staffing schedule.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Signage — exterior name, hours panel, food-safety contact.</li>
              <li>Public price page — every SKU, every price, readable on a phone.</li>
              <li>Opening-day staffing — operator couple + practitioner food-safety person, hour by hour.</li>
            </ul>
            <p><span className="font-semibold">Signed by:</span> Chief (ratifies the public face), Headwaters practitioner (owns the brief and the price page), operator couple (commits to the opening-day schedule).</p>
            <p style={{ borderLeft: "3px solid rgba(244,237,224,0.5)", paddingLeft: "0.75rem", opacity: 0.85 }}><span className="font-semibold">If this gate slips:</span> the band sees the price list on day one — simultaneously with the community.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

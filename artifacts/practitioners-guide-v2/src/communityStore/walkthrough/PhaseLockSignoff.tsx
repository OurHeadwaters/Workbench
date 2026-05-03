import { PHASE_LOCKS, SIGNOFF_COLUMNS } from "../phase-locks-data";

function UnderlineLine() {
  return <div className="flex-1 border-b" style={{ borderColor: "var(--cs-rule)" }} />;
}

function SignoffRow({ role }: { role: string }) {
  return (
    <div className="rounded-lg border px-3 py-2.5 print:rounded-none print:border-0 print:border-t print:px-0 print:py-2" style={{ borderColor: "var(--cs-rule)", background: "var(--cs-paper)" }}>
      <div className="text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{role}</div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex items-end gap-2">
          <span className="text-[9px] uppercase tracking-[0.18em] shrink-0 pb-0.5" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Initials</span>
          <UnderlineLine />
        </div>
        <div className="flex items-end gap-2">
          <span className="text-[9px] uppercase tracking-[0.18em] shrink-0 pb-0.5" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Date</span>
          <UnderlineLine />
        </div>
      </div>
    </div>
  );
}

export default function PhaseLockSignoff({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--cs-bg)" }}>
      <div className="print:hidden sticky top-0 z-10 border-b px-6 py-3 flex items-center justify-between gap-4" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Community store · Phase locks</div>
          <div className="text-[16px] font-semibold leading-tight mt-0.5" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>Sign-off sheet</div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="text-[10.5px] uppercase tracking-[0.16em] underline underline-offset-2" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>← Back to walkthrough</button>
          <button type="button" onClick={() => window.print()} data-testid="cs-print-phase-lock-signoff" className="text-[10.5px] uppercase tracking-[0.18em] rounded-lg px-4 py-2 border" style={{ background: "var(--cs-primary)", color: "var(--cs-bg)", borderColor: "var(--cs-primary)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Print / save as PDF</button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 pt-6 pb-12 print:max-w-none print:px-0 print:pt-0 print:pb-0">
        <div className="print:hidden mb-6">
          <h1 className="text-[28px] font-medium leading-[1.1]" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>
            Three locks.{" "}
            <span className="italic font-normal" style={{ color: "var(--cs-accent-warm)" }}>One build, done once.</span>
          </h1>
          <p className="text-[15px] leading-[1.5] mt-3 max-w-lg" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>One section per construction phase. Print, walk it onto the build site, and initial each phase when the decisions are settled. Signed copies go to the Chief's office, the Headwaters practitioner, and the contractor's file.</p>
        </div>

        <div className="space-y-6 print:space-y-4">
          {PHASE_LOCKS.map((phase) => (
            <div key={phase.number} className="rounded-2xl border p-5 print:rounded-none print:border-0 print:border-t print:p-0 print:pt-3" style={{ borderColor: "var(--cs-rule)", background: "var(--cs-paper)" }}>
              <div className="flex items-start gap-4 mb-3">
                <div className="text-[22px] tabular-nums shrink-0 leading-none pt-0.5 font-light" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{phase.number}</div>
                <div>
                  <div className="text-[9.5px] uppercase tracking-[0.2em] mb-0.5" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{phase.tag}</div>
                  <div className="text-[17px] font-semibold leading-[1.2]" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{phase.headline}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Decisions locked at this gate</div>
                  <ul className="space-y-1.5 pl-0 list-none">
                    {phase.decisions.map((d, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[9px] shrink-0 mt-[3px]" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>·</span>
                        <span className="text-[12.5px] leading-[1.45]" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Initials + date</div>
                  <div className="space-y-2">
                    {SIGNOFF_COLUMNS.map((role) => <SignoffRow key={role} role={role} />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media print { @page { margin: 1.8cm 1.8cm 1.5cm 1.8cm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
    </div>
  );
}

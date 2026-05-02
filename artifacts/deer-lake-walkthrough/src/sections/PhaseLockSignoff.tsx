import { PHASE_LOCKS, SIGNOFF_COLUMNS } from "@/lib/phase-locks-data";
import { ROUTES } from "@/lib/paths";

/**
 * Printable one-page phase-lock sign-off sheet.
 *
 * One section per construction phase. Each section lists the literal
 * decisions being locked and provides a fixed set of blank initials +
 * date rows — Chief, Headwaters practitioner, Contractor foreman —
 * so the Chief and contractor can physically initial on-site.
 *
 * Phase data is imported from @/lib/phase-locks-data (single source of
 * truth shared with PhaseLocks.tsx) so decisions never drift.
 *
 * Mirrors the visual language of Recap and CheckinSheets. Renders
 * cleanly to A4/Letter via the browser print dialog — no clipping.
 * On-screen header (nav + Print button) is hidden in the print
 * stylesheet via `print:hidden`.
 */

function UnderlineLine() {
  return (
    <div
      className="flex-1 border-b"
      style={{ borderColor: "var(--color-rule)" }}
    />
  );
}

function SignoffRow({ role }: { role: string }) {
  return (
    <div
      className="rounded-lg border px-3 py-2.5 print:rounded-none print:border-0 print:border-t print:px-0 print:py-2"
      style={{
        borderColor: "var(--color-rule)",
        background: "var(--color-paper)",
      }}
    >
      <div
        className="serif text-[12.5px] font-semibold mb-1.5"
        style={{ color: "var(--color-primary)" }}
      >
        {role}
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        {/* Initials line */}
        <div className="flex items-end gap-2">
          <span
            className="mono text-[9px] uppercase tracking-[0.18em] shrink-0 pb-0.5"
            style={{ color: "var(--color-muted)" }}
          >
            Initials
          </span>
          <UnderlineLine />
        </div>
        {/* Date line */}
        <div className="flex items-end gap-2">
          <span
            className="mono text-[9px] uppercase tracking-[0.18em] shrink-0 pb-0.5"
            style={{ color: "var(--color-muted)" }}
          >
            Date
          </span>
          <UnderlineLine />
        </div>
      </div>
    </div>
  );
}

export default function PhaseLockSignoff() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* On-screen nav bar — hidden when printing */}
      <div
        className="print:hidden sticky top-0 z-10 border-b px-6 py-3 flex items-center justify-between gap-4"
        style={{
          background: "var(--color-paper)",
          borderColor: "var(--color-rule)",
        }}
      >
        <div>
          <div
            className="mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Community store · Phase locks
          </div>
          <div
            className="serif text-[16px] font-semibold leading-tight mt-0.5"
            style={{ color: "var(--color-primary)" }}
          >
            Sign-off sheet
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={ROUTES.walkthrough + "#phase-locks"}
            className="mono text-[10.5px] uppercase tracking-[0.16em] underline underline-offset-2"
            style={{ color: "var(--color-muted)" }}
          >
            ← Back to walkthrough
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            data-testid="print-phase-lock-signoff"
            className="mono text-[10.5px] uppercase tracking-[0.18em] rounded-lg px-4 py-2 border"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-bg)",
              borderColor: "var(--color-primary)",
            }}
          >
            Print / save as PDF
          </button>
        </div>
      </div>

      {/* Print-only page header */}
      <div
        className="hidden print:flex items-baseline justify-between pb-3 border-b mb-4"
        style={{ borderColor: "var(--color-rule)" }}
      >
        <div>
          <div
            className="mono text-[8px] uppercase tracking-[0.22em]"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Headwaters · Phase-lock sign-off sheet
          </div>
          <div
            className="serif text-[17px] font-semibold leading-tight mt-0.5"
            style={{ color: "var(--color-primary)" }}
          >
            Three locks. One build, done once.
          </div>
        </div>
        <div
          className="mono text-[8px] uppercase tracking-[0.16em] text-right"
          style={{ color: "var(--color-muted)" }}
        >
          Confidential · Community
          <br />
          Date:{" "}
          {new Date().toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-2xl px-6 pt-6 pb-12 print:max-w-none print:px-0 print:pt-0 print:pb-0">

        {/* On-screen document header */}
        <div className="print:hidden mb-6">
          <div
            className="mono text-[11px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            What gets locked, and when
          </div>
          <h1
            className="serif font-medium text-[28px] leading-[1.1]"
            style={{ color: "var(--color-primary)" }}
          >
            Three locks.{" "}
            <span
              className="italic font-normal"
              style={{ color: "var(--color-accent-warm)" }}
            >
              One build, done once.
            </span>
          </h1>
          <p
            className="serif text-[15px] leading-[1.5] mt-3 max-w-lg"
            style={{ color: "var(--color-text)" }}
          >
            One section per construction phase. Print, walk it onto the
            build site, and initial each phase when the decisions are
            settled. Signed copies go to the Chief's office, the
            Headwaters practitioner, and the contractor's file.
          </p>
        </div>

        {/* Phase sections */}
        <div className="space-y-6 print:space-y-4">
          {PHASE_LOCKS.map((phase) => (
            <div
              key={phase.number}
              className="rounded-2xl border p-5 print:rounded-none print:border-0 print:border-t print:p-0 print:pt-3"
              style={{
                borderColor: "var(--color-rule)",
                background: "var(--color-paper)",
              }}
            >
              {/* Phase header */}
              <div className="flex items-start gap-4 mb-3">
                <div
                  className="mono text-[22px] tabular-nums shrink-0 leading-none pt-0.5 font-light"
                  style={{ color: "var(--color-accent-warm)" }}
                >
                  {phase.number}
                </div>
                <div>
                  <div
                    className="mono text-[9.5px] uppercase tracking-[0.2em] mb-0.5"
                    style={{ color: "var(--color-accent-warm)" }}
                  >
                    {phase.tag}
                  </div>
                  <div
                    className="serif text-[17px] font-semibold leading-[1.2]"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {phase.headline}
                  </div>
                </div>
              </div>

              {/* Two-column: decisions + fixed sign-off rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4">

                {/* Decisions locked */}
                <div>
                  <div
                    className="mono text-[9px] uppercase tracking-[0.2em] mb-2"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Decisions locked at this gate
                  </div>
                  <ul className="space-y-1.5 pl-0 list-none">
                    {phase.decisions.map((d, i) => (
                      <li key={i} className="flex gap-2">
                        <span
                          className="mono text-[9px] shrink-0 mt-[3px]"
                          style={{ color: "var(--color-accent-warm)" }}
                        >
                          ·
                        </span>
                        <span
                          className="serif text-[12.5px] leading-[1.45]"
                          style={{ color: "var(--color-text)" }}
                        >
                          {d}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fixed sign-off rows: Chief · Headwaters practitioner · Contractor foreman */}
                <div>
                  <div
                    className="mono text-[9px] uppercase tracking-[0.2em] mb-2"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Initials + date
                  </div>
                  <div className="space-y-2">
                    {SIGNOFF_COLUMNS.map((role) => (
                      <SignoffRow key={role} role={role} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-8 pt-4 border-t print:mt-4"
          style={{ borderColor: "var(--color-rule)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
            <div>
              <div
                className="mono text-[9px] uppercase tracking-[0.2em] mb-1"
                style={{ color: "var(--color-muted)" }}
              >
                Document
              </div>
              <p
                className="serif text-[12px] leading-[1.5]"
                style={{ color: "var(--color-text)" }}
              >
                Headwaters food-systems pilot.
                Signed copies to: Chief's office, Headwaters practitioner,
                contractor file.
              </p>
              <p
                className="serif text-[11px] leading-[1.4] mt-1 print:hidden"
                style={{ color: "var(--color-muted)" }}
              >
                Source:{" "}
                <a
                  href={ROUTES.walkthrough + "#phase-locks"}
                  className="underline underline-offset-2"
                  style={{ color: "var(--color-accent-warm)" }}
                >
                  {ROUTES.walkthrough}#phase-locks
                </a>
              </p>
              <p
                className="hidden print:block serif text-[11px] leading-[1.4] mt-1"
                style={{ color: "var(--color-muted)" }}
              >
                Source: {ROUTES.walkthrough}#phase-locks
              </p>
            </div>
            <div>
              <div
                className="mono text-[9px] uppercase tracking-[0.2em] mb-1"
                style={{ color: "var(--color-muted)" }}
              >
                Witness (optional)
              </div>
              <div className="space-y-3">
                {(["Name", "Initials", "Date"] as const).map((label) => (
                  <div key={label} className="flex items-end gap-2">
                    <span
                      className="mono text-[9px] uppercase tracking-[0.18em] shrink-0 pb-0.5"
                      style={{ color: "var(--color-muted)", minWidth: "3rem" }}
                    >
                      {label}
                    </span>
                    <UnderlineLine />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 1.8cm 1.8cm 1.5cm 1.8cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

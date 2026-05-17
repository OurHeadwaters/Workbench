/**
 * RateBreakdown.tsx — Why $175/hr is a composite rate
 *
 * Shows the roles the founder fills under a single rate,
 * computes the blended market equivalent, and names what
 * is deliberately hired out or subcontracted.
 *
 * Data source: PRACTITIONER_RATE_COMPOSITE from @workspace/codetry-public
 * Rate itself: unchanged — PRACTITIONER_RATES.lead = 175
 */

import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { PRACTITIONER_RATE_COMPOSITE } from "@workspace/codetry-public";

const ACCENT      = "#1f3d2e";
const ACCENT_SOFT = "#e8f0ec";
const ACCENT_INK  = "#1a2e22";
const RUST        = "#b85a3e";
const RUST_SOFT   = "#fdf0ec";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

function fmtPct(n: number) {
  return Math.round(n * 100) + "%";
}

export default function RateBreakdown() {
  const { filledRoles, hiredOut, subcontracted, billedRate } = PRACTITIONER_RATE_COMPOSITE;

  const blendedEquivalent = filledRoles.reduce(
    (sum, r) => sum + r.marketRate * r.scopeShare,
    0,
  );

  const premium = billedRate - blendedEquivalent;

  return (
    <div className="min-h-screen bg-paper text-text">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        <Link
          href={`${BASE}/`}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Dashboard
        </Link>

        {/* ── Header ── */}
        <header className="space-y-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-[0.18em]"
            style={{ backgroundColor: ACCENT, color: "#f4ede0" }}
          >
            Rate transparency
          </div>
          <h1
            className="text-3xl font-semibold leading-tight"
            style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
          >
            Why {fmt(billedRate)}/hr is a composite rate
          </h1>
          <p className="text-sm text-muted leading-relaxed max-w-2xl">
            The {fmt(billedRate)}/hr lead rate is not a single-discipline hourly. At founder stage,
            one person carries the roles that a mature practice separates into distinct people.
            This breakdown shows what sits inside that number — and what is deliberately
            hired out or subcontracted.
          </p>
        </header>

        {/* ── Role stack table ── */}
        <section className="space-y-3">
          <h2
            className="text-xs font-medium uppercase tracking-[0.2em] text-muted"
          >
            Roles filled under {fmt(billedRate)}/hr
          </h2>

          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: ACCENT + "30" }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em]"
              style={{ backgroundColor: ACCENT, color: "#f4ede0" }}
            >
              <span>Role</span>
              <span className="text-right">Market rate</span>
              <span className="text-right">Scope share</span>
              <span className="text-right">Contribution</span>
            </div>

            {/* Rows */}
            {filledRoles.map((row, i) => {
              const contribution = row.marketRate * row.scopeShare;
              const isLast = i === filledRoles.length - 1;
              return (
                <div
                  key={row.role}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 items-start"
                  style={{
                    borderBottom: isLast ? "none" : `1px solid ${ACCENT}20`,
                    backgroundColor: i % 2 === 0 ? ACCENT_SOFT + "60" : "transparent",
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: ACCENT_INK }}>
                      {row.role}
                    </p>
                    <p className="text-xs text-muted leading-relaxed mt-0.5">
                      {row.description}
                    </p>
                  </div>
                  <div className="text-sm font-mono tabular-nums text-right pt-0.5" style={{ color: ACCENT_INK }}>
                    {fmt(row.marketRate)}/hr
                  </div>
                  <div className="text-sm font-mono tabular-nums text-right pt-0.5 text-muted">
                    {fmtPct(row.scopeShare)}
                  </div>
                  <div
                    className="text-sm font-semibold font-mono tabular-nums text-right pt-0.5"
                    style={{ color: ACCENT }}
                  >
                    {fmt(contribution)}/hr
                  </div>
                </div>
              );
            })}

            {/* Blended total row */}
            <div
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 items-center border-t"
              style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT_SOFT }}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em]" style={{ color: ACCENT_INK }}>
                  Market blended equivalent
                </p>
                <p className="text-xs text-muted mt-0.5">
                  What hiring each role separately would cost at scope-weighted rates.
                </p>
              </div>
              <span />
              <span />
              <div
                className="text-base font-bold font-mono tabular-nums text-right"
                style={{ color: ACCENT_INK }}
              >
                {fmt(blendedEquivalent)}/hr
              </div>
            </div>
          </div>
        </section>

        {/* ── Callout: $175/hr vs blended ── */}
        <section>
          <div
            className="rounded-xl border p-5 space-y-3"
            style={{ borderColor: RUST + "40", backgroundColor: RUST_SOFT }}
          >
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: RUST }}>
                  Billed rate
                </p>
                <p
                  className="text-3xl font-bold tabular-nums mt-1"
                  style={{ fontFamily: "var(--app-font-serif)", color: RUST }}
                >
                  {fmt(billedRate)}/hr
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: RUST }}>
                  vs. market blended
                </p>
                <p
                  className="text-3xl font-bold tabular-nums mt-1"
                  style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
                >
                  {fmt(blendedEquivalent)}/hr
                </p>
              </div>
            </div>
            <div
              className="border-t pt-3 text-sm leading-relaxed"
              style={{ borderColor: RUST + "30", color: RUST }}
            >
              <span className="font-semibold">
                The {fmt(billedRate)}/hr rate is {fmt(premium)}/hr above the raw blended equivalent.
              </span>{" "}
              That margin covers coordination overhead, continuity of institutional knowledge, and the guarantee
              that one accountable person shows up across all four of these functions — no management layer required.
              If those roles separated into distinct hires, the coordination cost alone would exceed the gap.
            </div>
          </div>
        </section>

        {/* ── What is externalized ── */}
        <section className="space-y-4">
          <h2
            className="text-xs font-medium uppercase tracking-[0.2em] text-muted"
          >
            What is deliberately externalized
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hired out */}
            <div
              className="rounded-xl border bg-paper p-5 space-y-3"
              style={{ borderTopWidth: "3px", borderTopColor: ACCENT }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: ACCENT }}>
                Hired out
              </p>
              <p className="text-xs text-muted leading-relaxed">
                These roles are not inside the {fmt(billedRate)}/hr — they are filled by separate people,
                hired or contracted through community channels.
              </p>
              <ul className="space-y-3">
                {hiredOut.map((item) => (
                  <li key={item.role} className="space-y-0.5">
                    <p className="text-sm font-semibold" style={{ color: ACCENT_INK }}>
                      {item.role}
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      {item.note}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subcontracted */}
            <div
              className="rounded-xl border bg-paper p-5 space-y-3"
              style={{ borderTopWidth: "3px", borderTopColor: RUST }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: RUST }}>
                Subcontracted
              </p>
              <p className="text-xs text-muted leading-relaxed">
                These are billed separately at their own rates — not buried inside {fmt(billedRate)}/hr.
                Costs are disclosed in each phase budget.
              </p>
              <ul className="space-y-3">
                {subcontracted.map((item) => (
                  <li key={item.role} className="space-y-0.5">
                    <p className="text-sm font-semibold" style={{ color: ACCENT_INK }}>
                      {item.role}
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      {item.note}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Footer note ── */}
        <div
          className="rounded-lg border px-4 py-3 text-xs text-muted leading-relaxed"
          style={{ borderColor: ACCENT + "30" }}
        >
          <span className="font-medium text-text">Model maturity milestone: </span>
          The {fmt(billedRate)}/hr rate reflects founder-stage compression of roles.
          The model's maturity milestone is when those roles begin to separate into distinct people —
          a developer on retainer, a part-time bookkeeper, an IT contractor — and the lead rate
          drops to reflect strategic engagement work only. That separation is a sign of health,
          not overhead.
        </div>

      </div>
    </div>
  );
}

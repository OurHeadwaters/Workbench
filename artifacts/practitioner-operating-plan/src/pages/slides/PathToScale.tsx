import {
  CROSS_RESERVE_ONSITE_DAYS,
  CROSS_RESERVE_REMOTE_DAYS,
  getLiveCostValue,
  resolveCost,
} from "../../lib/budgetMath";
import { useAppState } from "../../lib/storage";
import { formatCostValue } from "../../data/costRegistry";

// Resolve a derived registry total (one of the `getLiveCostValue`
// switch arms) for a known id. We throw rather than fall back to a
// default — every id used on this slide is meant to be live-bound, so
// a null result means budgetMath drifted away from the registry and
// the slide should fail loudly in dev instead of silently rendering
// stale numbers.
function liveDerived(state: ReturnType<typeof useAppState>, id: string): number {
  const v = getLiveCostValue(state, id);
  if (v == null) {
    throw new Error(
      `PathToScale: no live derivation for cost id "${id}". ` +
        `Add a case in budgetMath.ts:getLiveCostValue or remove the binding.`,
    );
  }
  return v;
}

function compactDollars(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    // 2 decimals when under 10M (e.g. $1.08M), 1 decimal otherwise.
    const digits = m < 10 ? 2 : 1;
    return `$${m.toFixed(digits)}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}k`;
  }
  return `$${Math.round(value)}`;
}

function exactDollars(value: number): string {
  return "$" + Math.round(value).toLocaleString("en-US");
}

export default function PathToScale() {
  // One subscription to live state, then resolve every figure through
  // the same store so the slide cannot drift from a registry edit:
  //   - Editable inputs (ask.recommended, retainer) → resolveCost,
  //     which honours edited values from the cost-review modal.
  //   - Derived totals (pathToScale.*, crossReserve.year*.revenue,
  //     crossReserve.installRevenue.perReserve) → getLiveCostValue,
  //     which composes them from the same edited inputs.
  const state = useAppState();

  const askRecommendedMonthly = resolveCost(state, "ask.recommended");
  const retainerAnnual = resolveCost(state, "crossReserve.retainer.annual");

  const y1 = liveDerived(state, "pathToScale.year1");
  const y2 = liveDerived(state, "pathToScale.year2");
  const y3 = liveDerived(state, "pathToScale.year3");
  const crossY2 = liveDerived(state, "crossReserve.year2.revenue");
  const crossY3 = liveDerived(state, "crossReserve.year3.revenue");
  const installPer = liveDerived(state, "crossReserve.installRevenue.perReserve");
  // Travel pass-through (~$22.5k for a typical 12-week fly-in install).
  // Receiving reserves reimburse this at cost, so it is *not* in
  // crossReserve.year2/3.revenue or in the Y2/Y3 totals above. Surfaced
  // explicitly so a council reading this slide alone has a defensible
  // budget number for the install trip.
  const travelPassthroughPerInstall = resolveCost(
    state,
    "crossReserve.travelPassthrough.example",
  );

  // Y1 is by definition the Deer Lake-only line (askReco × 12 — see
  // costRegistry pathToScale.year1 context), so reusing it as the
  // Deer Lake portion in Y2 / Y3 keeps a single source of truth even
  // if future edits change how that derivation is computed.
  const deerLake = y1;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Path to scale · 05
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Y1 → Y2 → Y3 · numbers a CFO can trace
          </div>
        </div>

        <h1
          className="font-display font-medium text-[4.4vw] leading-[0.98] tracking-tight text-primary mb-[1vh]"
          style={{ textWrap: "balance" }}
        >
          One Deer Lake contract. Cross-reserve installs stack on top.
        </h1>
        <div className="font-display italic text-[1.55vw] text-muted mb-[3vh] max-w-[72vw]">
          Year 2 and Year 3 are not "more Deer Lakes." They are the same {compactDollars(deerLake)} Deer Lake
          contract holding steady, with premium cross-reserve installs and compounding discipline-keeper
          retainers earning on top.
        </div>

        <div className="grid grid-cols-3 gap-[1.8vw] flex-1">
          {/* Year 1 — Deer Lake only */}
          <div className="bg-paper px-[1.8vw] py-[2.5vh] flex flex-col rounded-[6px]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-primary mb-[0.8vh] font-semibold">
              Year 1 · Deer Lake only
            </div>
            <div className="font-display text-[1.7vw] leading-[1.1] text-primary mb-[1.5vh]">
              Practitioner beds in Deer Lake. No cross-reserve revenue yet.
            </div>
            <div
              className="font-display font-semibold text-[3.6vw] text-primary leading-[1] mb-[0.4vh]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {compactDollars(y1)}
            </div>
            <div
              className="font-mono text-[1vw] text-muted mb-[2vh]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {exactDollars(y1)} /yr
            </div>
            <div className="mt-auto border-t border-dashed border-rule pt-[1.2vh] space-y-[0.6vh]">
              <div className="flex items-baseline justify-between">
                <span className="font-body text-[1.05vw] text-text">Deer Lake recurring contract</span>
                <span
                  className="font-display text-[1.25vw] text-primary"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {exactDollars(deerLake)}
                </span>
              </div>
              <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
                ask.recommended × 12 — locked.
              </div>
            </div>
          </div>

          {/* Year 2 — Deer Lake + 2 cross-reserve installs */}
          <div className="bg-paper px-[1.8vw] py-[2.5vh] flex flex-col rounded-[6px] border-t-[3px] border-accent">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-accent mb-[0.8vh] font-semibold">
              Year 2 · + 2 reserve installs
            </div>
            <div className="font-display text-[1.7vw] leading-[1.1] text-primary mb-[1.5vh]">
              Practitioner travels to install the discipline at two new reserves.
            </div>
            <div
              className="font-display font-semibold text-[3.6vw] text-accent leading-[1] mb-[0.4vh]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {compactDollars(y2)}
            </div>
            <div
              className="font-mono text-[1vw] text-muted mb-[2vh]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {exactDollars(y2)} /yr
            </div>
            <div className="mt-auto border-t border-dashed border-rule pt-[1.2vh] space-y-[0.6vh]">
              <div className="flex items-baseline justify-between">
                <span className="font-body text-[1.05vw] text-text">Deer Lake recurring contract</span>
                <span
                  className="font-display text-[1.25vw] text-primary"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {exactDollars(deerLake)}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-body text-[1.05vw] text-text">
                  + Cross-reserve <span className="text-muted text-[0.9vw]">(2 installs + 2 retainers)</span>
                </span>
                <span
                  className="font-display text-[1.25vw] text-accent"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {exactDollars(crossY2)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-rule pt-[0.8vh] mt-[0.4vh]">
                <span className="font-body font-semibold text-[1.1vw] text-primary">= Year 2 total</span>
                <span
                  className="font-display font-semibold text-[1.4vw] text-primary"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {exactDollars(y2)}
                </span>
              </div>
              <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
                2 × {exactDollars(installPer)} install + 2 × {exactDollars(retainerAnnual)} first-year retainer.
              </div>
              <div className="flex items-baseline justify-between text-muted">
                <span className="font-body text-[0.9vw] italic">
                  + 2 × {exactDollars(travelPassthroughPerInstall)} travel pass-through, billed at cost
                </span>
                <span className="font-mono text-[0.78vw] uppercase tracking-[0.16em]">
                  not in fee
                </span>
              </div>
            </div>
          </div>

          {/* Year 3 — Deer Lake + compounding retainers */}
          <div className="bg-paper px-[1.8vw] py-[2.5vh] flex flex-col rounded-[6px]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-primary mb-[0.8vh] font-semibold">
              Year 3 · retainers compound
            </div>
            <div className="font-display text-[1.7vw] leading-[1.1] text-primary mb-[1.5vh]">
              Two more installs. The Y2 retainers carry. Four reserves now pay annually.
            </div>
            <div
              className="font-display font-semibold text-[3.6vw] text-primary leading-[1] mb-[0.4vh]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {compactDollars(y3)}
            </div>
            <div
              className="font-mono text-[1vw] text-muted mb-[2vh]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {exactDollars(y3)} /yr
            </div>
            <div className="mt-auto border-t border-dashed border-rule pt-[1.2vh] space-y-[0.6vh]">
              <div className="flex items-baseline justify-between">
                <span className="font-body text-[1.05vw] text-text">Deer Lake recurring contract</span>
                <span
                  className="font-display text-[1.25vw] text-primary"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {exactDollars(deerLake)}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-body text-[1.05vw] text-text">
                  + Cross-reserve <span className="text-muted text-[0.9vw]">(2 installs + 4 retainers)</span>
                </span>
                <span
                  className="font-display text-[1.25vw] text-primary"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {exactDollars(crossY3)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-rule pt-[0.8vh] mt-[0.4vh]">
                <span className="font-body font-semibold text-[1.1vw] text-primary">= Year 3 total</span>
                <span
                  className="font-display font-semibold text-[1.4vw] text-primary"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {exactDollars(y3)}
                </span>
              </div>
              <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
                2 × {exactDollars(installPer)} install + 4 × {exactDollars(retainerAnnual)} active retainer.
              </div>
              <div className="flex items-baseline justify-between text-muted">
                <span className="font-body text-[0.9vw] italic">
                  + 2 × {exactDollars(travelPassthroughPerInstall)} travel pass-through, billed at cost
                </span>
                <span className="font-mono text-[0.78vw] uppercase tracking-[0.16em]">
                  not in fee
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[2.5vh] flex items-center justify-between border-t border-rule pt-[1.5vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted">
            Live-bound · edit any input in the cost-review modal and these numbers move
          </div>
          <div className="font-body text-[1.05vw] text-text">
            Deer Lake = ask.recommended ({formatCostValue(askRecommendedMonthly, "$/mo")}) × 12 ·
            install = {CROSS_RESERVE_ONSITE_DAYS} on-site + {CROSS_RESERVE_REMOTE_DAYS} remote days · retainer {exactDollars(retainerAnnual)}/yr
          </div>
        </div>
      </div>
    </div>
  );
}

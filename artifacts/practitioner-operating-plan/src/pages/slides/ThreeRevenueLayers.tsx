import { resolveCost, getLiveCostValue } from "../../lib/budgetMath";
import { useAppState } from "../../lib/storage";
import type { AppState } from "../../lib/storage";
import { formatPlanningK, formatCompactK } from "../../lib/formatPlanning";

// Same liveDerived helper pattern as PathToScale: any id we read from
// getLiveCostValue here is meant to be live-bound. We no longer throw
// on a null — that took the whole sibling Deer Lake deck down with a
// blank/white screen. Instead we log loudly to the dev console and
// return NaN so the formatters below print a visible "TBD" placeholder.
// The per-slide error boundary in App.tsx catches anything else.
function liveDerived(state: AppState, id: string): number {
  const v = getLiveCostValue(state, id);
  if (v == null) {
    console.error(
      `[ThreeRevenueLayers] no live derivation for cost id "${id}". ` +
        `Add a case in budgetMath.ts:getLiveCostValue or remove the binding. ` +
        `Rendering "TBD" in its place.`,
    );
    return Number.NaN;
  }
  return v;
}

// `$3,500`, `$30,000` — exact dollars with comma grouping. Used for the
// raw day rates and retainer where the slide narrative quotes the
// precise number a receiving-reserve council will see on an invoice.
function formatDollars(value: number): string {
  if (!Number.isFinite(value)) return "TBD";
  return "$" + Math.round(value).toLocaleString("en-US");
}

// Wrap the shared planning formatters so a NaN sentinel from a missing
// live binding renders as "TBD" instead of "~$NaNk".
function safePlanningK(value: number): string {
  return Number.isFinite(value) ? formatPlanningK(value) : "TBD";
}

function safeCompactK(value: number): string {
  return Number.isFinite(value) ? formatCompactK(value) : "TBD";
}

export default function ThreeRevenueLayers() {
  // One subscription to live state — every cross-reserve dollar
  // figure on this slide flows from it. Editing any of these entries
  // in the cost-review modal updates the slide live (and the matching
  // numbers on the Deer Lake store deck's "First reserve, then the
  // next" slide, which reads the same registry via the workspace dep).
  const state = useAppState();

  // Layer-1 software contract — single source of truth in costRegistry.
  // monthly is editable in the cost-review modal; annualised is derived
  // (monthly × 12) so the two figures cannot drift on this slide.
  const layer1Monthly = resolveCost(state, "contract.layer1.software.monthly");
  const layer1Annual = liveDerived(state, "contract.layer1.software.annual");
  // Recommended-ask upgrade — read live so the "absorbs Layer 1" line
  // moves if the cost-review modal edits ask.recommended.
  const askRecommendedMonthly = resolveCost(state, "ask.recommended");
  const askRecommendedAnnual = askRecommendedMonthly * 12;

  const onsiteDayRate = resolveCost(state, "crossReserve.dayRate.onsite");
  const remoteDayRate = resolveCost(state, "crossReserve.dayRate.remote");
  const retainerAnnual = resolveCost(state, "crossReserve.retainer.annual");
  const installPerReserve = liveDerived(
    state,
    "crossReserve.installRevenue.perReserve",
  );
  const travelPassthrough = liveDerived(
    state,
    "crossReserve.travelPassthrough.example",
  );
  const y1StickerPrice = liveDerived(state, "crossReserve.year1.stickerPrice");

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Three revenue layers · 03
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            The product, sold three ways
          </div>
        </div>

        <h1 className="font-display font-medium text-[4.4vw] leading-[0.98] tracking-tight text-primary mb-[1vh]" style={{ textWrap: "balance" }}>
          Headwaters is a product company.
        </h1>
        <div className="font-display italic text-[1.55vw] text-muted mb-[3vh] max-w-[70vw]">
          One company, three revenue layers. The software is the spine. The tech stack scales with every band added. The training programs travel.
        </div>

        <div className="grid grid-cols-3 gap-[1.8vw] flex-1">
          <div className="bg-paper px-[1.8vw] py-[2.5vh] flex flex-col rounded-[6px]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-primary mb-[0.8vh] font-semibold">
              Layer One · Software
            </div>
            <div className="font-display text-[2.1vw] leading-[1.05] text-primary mb-[1.5vh]">
              Deer Lake recurring contract
            </div>
            <div className="font-display font-semibold text-[3vw] text-primary leading-[1] mb-[0.4vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatDollars(layer1Annual)}
            </div>
            <div className="font-mono text-[1vw] text-muted mb-[2vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              /yr · {formatDollars(layer1Monthly)}/mo · Layer 1 software-only · signed today
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text mb-[1.5vh]">
              Bundled deliverable: license, ongoing dev, practitioner advisory, monthly visit, Dryden Hub coordination, three training cohorts.
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text">
              <span className="text-primary font-semibold">Software is owned by the band</span> and reused across every band that adopts it.
            </div>
            <div className="font-body text-[0.9vw] leading-[1.45] text-muted mt-[0.8vh] italic">
              <span className="text-primary not-italic font-semibold">Upgrade ask on the V3 cost basis: <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatDollars(askRecommendedMonthly)}/mo (~${(askRecommendedAnnual / 1_000_000).toFixed(2)}M/yr)</span> full-stack agency engagement</span> — absorbs / replaces this Layer-1 contract, doesn't stack on top of it. See the Deer Lake deck's <span className="not-italic">Service Partner</span> / <span className="not-italic">Risks &amp; Ask</span> for the upgraded-tier rationale.
            </div>
          </div>

          <div className="bg-paper px-[1.8vw] py-[2.5vh] flex flex-col rounded-[6px] border-t-[3px] border-accent">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-accent mb-[0.8vh] font-semibold">
              Layer Two · Tech Stack at Markup
            </div>
            <div className="font-display text-[2.1vw] leading-[1.05] text-primary mb-[1.5vh]">
              Hybrid pricing, tiered hardware
            </div>
            <div className="font-display font-semibold text-[3vw] text-accent leading-[1] mb-[0.4vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $4,800
            </div>
            <div className="font-mono text-[1vw] text-muted mb-[2vh]">
              /yr Y1 · recurring fee only · scales hard with bands
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text mb-[1.5vh]">
              $400/mo managed-services fee. Pass-through SaaS billed at cost; tiered hardware kit (3 / 6 / 12 devices, scales with team) billed at cost when issued — both excluded from the headline.
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text">
              <span className="text-primary font-semibold">Loss is baked into the kit pricing.</span> Stuff gets lent and goes missing — the system honours that, not the other way around.
            </div>
          </div>

          <div className="bg-paper px-[1.8vw] py-[2.5vh] flex flex-col rounded-[6px]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-primary mb-[0.8vh] font-semibold">
              Layer Three · Training & cross-reserve install
            </div>
            <div className="font-display text-[2.1vw] leading-[1.05] text-primary mb-[1.5vh]">
              In-Deer-Lake cohorts + premium installs at the next reserves
            </div>
            <div className="font-display font-semibold text-[3vw] text-primary leading-[1] mb-[0.4vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $5,500
            </div>
            <div className="font-mono text-[1vw] text-muted mb-[1.5vh]">
              /cohort · 3/yr in Deer Lake bundle · curriculum partner on retainer
            </div>
            <div className="font-body text-[1.15vw] leading-[1.45] text-text mb-[1.2vh]">
              <span className="text-primary font-semibold">Cross-reserve install (premium):</span> the practitioner — not a Deer Lake grad — travels reserve to reserve to install the Codetry discipline. Receiving reserve pays{" "}
              <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatDollars(onsiteDayRate)}/on-site day · {formatDollars(remoteDayRate)}/remote day · {formatDollars(retainerAnnual)}/yr discipline-keeper retainer
              </span>
              . Travel, lodging, food are passed through at cost.
            </div>
            <div className="font-body text-[1.15vw] leading-[1.5] text-text">
              <span className="text-primary font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
                {safePlanningK(installPerReserve)} per new reserve install + {safeCompactK(retainerAnnual)}/yr ongoing.
              </span>{" "}
              Receiving reserve's Y1 sticker — install +{" "}
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {safePlanningK(travelPassthrough)}
              </span>{" "}
              travel pass-through + retainer — lands at{" "}
              <span className="text-primary font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
                {safePlanningK(y1StickerPrice)} all-in
              </span>{" "}
              (see "First reserve, then the next" in the store plan). Successor is local <em>to each receiving reserve</em> — Deer Lake grads steward Deer Lake; they don't get sent on the road.
            </div>
          </div>
        </div>

        <div className="mt-[2.5vh] flex items-center justify-between border-t border-rule pt-[1.5vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted">
            Carry-over from V2
          </div>
          <div className="font-body text-[1.05vw] text-muted">
            Salts $1,298/yr net · 807 CDP grant $20,500 one-time when collected
          </div>
        </div>
      </div>
    </div>
  );
}

import { resolveCost, getLiveCostValue } from "../../lib/budgetMath";
import { useAppState } from "../../lib/storage";
import type { AppState } from "../../lib/storage";

// Same liveDerived helper pattern as PathToScale: any id we read from
// getLiveCostValue here is meant to be live-bound, so a null result
// means budgetMath drifted away from the registry — fail loudly in dev
// instead of silently rendering a zero.
function liveDerived(state: AppState, id: string): number {
  const v = getLiveCostValue(state, id);
  if (v == null) {
    throw new Error(
      `ThreeRevenueLayers: no live derivation for cost id "${id}". ` +
        `Add a case in budgetMath.ts:getLiveCostValue or remove the binding.`,
    );
  }
  return v;
}

// `$3,500`, `$30,000` — exact dollars with comma grouping. Used for the
// raw day rates and retainer where the slide narrative quotes the
// precise number a receiving-reserve council will see on an invoice.
function formatDollars(value: number): string {
  return "$" + Math.round(value).toLocaleString("en-US");
}

// `~$148.5k` / `~$22.5k` / `~$201k` — planning round-UP to the nearest
// $500, then displayed as a "kibi" string with one decimal when needed.
// Mirrors the original hand-typed planning literals on this slide:
//   • install fee $148,200 → ceil to 148,500 → "~$148.5k"
//   • travel pass-through $22,500 → already round, → "~$22.5k"
//   • Y1 sticker $200,700 → ceil to 201,000 → "~$201k"
// Round-up (not round-nearest) keeps the planning estimate
// conservative when a band council reads it cold — they never see a
// number lower than the live math would actually deliver. If any of the
// underlying day rates / travel components / retainer move, the label
// follows.
function formatPlanningK(value: number): string {
  const rounded = Math.ceil(value / 500) * 500;
  const k = rounded / 1000;
  const formatted = Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1);
  return `~$${formatted}k`;
}

// `$30k` — round-nearest-1k for the shorthand "$30k/yr ongoing" mention
// of the recurring retainer. No ~ prefix because the retainer is a
// single editable line, not a derivation.
function formatCompactK(value: number): string {
  const k = Math.round(value / 1000);
  return `$${k}k`;
}

export default function ThreeRevenueLayers() {
  // One subscription to live state — every cross-reserve dollar
  // figure on this slide flows from it. Editing any of these entries
  // in the cost-review modal updates the slide live (and the matching
  // numbers on the Deer Lake store deck's "First reserve, then the
  // next" slide, which reads the same registry via the workspace dep).
  const state = useAppState();

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
              $420,000
            </div>
            <div className="font-mono text-[1vw] text-muted mb-[2vh]">
              /yr · $35,000/mo · locked
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text mb-[1.5vh]">
              Bundled deliverable: license, ongoing dev, practitioner advisory, monthly visit, Dryden Hub coordination, three training cohorts.
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text">
              <span className="text-primary font-semibold">Software is owned by the band</span> and reused across every band that adopts it.
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
              ~$5,000
            </div>
            <div className="font-mono text-[1vw] text-muted mb-[2vh]">
              /yr Y1 · scales hard with bands
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text mb-[1.5vh]">
              Pass-through SaaS at cost + tiered hardware kit (3 / 6 / 12 devices, scales with team) + $400/mo managed-services fee.
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
                {formatPlanningK(installPerReserve)} per new reserve install + {formatCompactK(retainerAnnual)}/yr ongoing.
              </span>{" "}
              Receiving reserve's Y1 sticker — install +{" "}
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatPlanningK(travelPassthrough)}
              </span>{" "}
              travel pass-through + retainer — lands at{" "}
              <span className="text-primary font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatPlanningK(y1StickerPrice)} all-in
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

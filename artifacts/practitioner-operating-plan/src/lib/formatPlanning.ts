// Planning-number formatters shared between any surface that quotes a
// cross-reserve dollar headline (the live ThreeRevenueLayers slide and
// the printable OnePager). Centralising them keeps the two surfaces
// from drifting apart on rounding behaviour, and means a single edit
// here flows through to both wherever a "~$148.5k install" / "~$22.5k
// travel" / "~$201k Y1 all-in" / "$30k retainer" planning literal
// renders.

// `~$148.5k` / `~$22.5k` / `~$201k` — planning round-UP to the nearest
// $500, then displayed as a "kibi" string with one decimal when needed.
// Mirrors the original hand-typed planning literals on the slides:
//   • install fee $148,200 → ceil to 148,500 → "~$148.5k"
//   • travel pass-through $22,500 → already round → "~$22.5k"
//   • Y1 sticker $200,700 → ceil to 201,000 → "~$201k"
// Round-up (not round-nearest) keeps the planning estimate
// conservative when a band council reads it cold — they never see a
// number lower than the live math would actually deliver. If any of
// the underlying day rates / travel components / retainer move, the
// label follows.
export function formatPlanningK(value: number): string {
  const rounded = Math.ceil(value / 500) * 500;
  const k = rounded / 1000;
  const formatted = Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1);
  return `~$${formatted}k`;
}

// `$30k` — round-nearest-1k for the shorthand "$30k/yr ongoing" mention
// of the recurring retainer. No ~ prefix because the retainer is a
// single editable line, not a derivation.
export function formatCompactK(value: number): string {
  const k = Math.round(value / 1000);
  return `$${k}k`;
}

// `~$201,000` — the long-form variant of `formatPlanningK`, used by the
// printable OnePager's big-number headline where the layout has space
// for the comma-grouped dollar amount instead of the "k" shorthand.
// Same round-UP-to-the-nearest-$500 rule as `formatPlanningK` so the
// two displays of the same underlying number can never disagree:
//   • Y1 sticker $200,700 → ceil to 201,000 → "~$201,000"
//   • install fee $148,200 → ceil to 148,500 → "~$148,500"
export function formatPlanningDollars(value: number): string {
  const rounded = Math.ceil(value / 500) * 500;
  return `~$${rounded.toLocaleString("en-US")}`;
}

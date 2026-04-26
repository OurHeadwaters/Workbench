/**
 * Cross-reserve install & travel-corridor planning defaults.
 *
 * Single source of truth used by:
 *   - the Practitioner Operating Plan cost registry (`crossReserve.*`
 *     entries in artifacts/practitioner-operating-plan/src/data/costRegistry.ts),
 *     where each value is wrapped with full provenance, derivation
 *     context, and the slide(s) it surfaces on.
 *   - the same artifact's `budgetMath.ts`, which uses
 *     `install.{weeks,onsiteDays,remoteDays}` as the day-count constants
 *     that drive every cross-reserve derivation
 *     (`crossReserve.installRevenue.perReserve`,
 *     `crossReserve.year2.revenue`, `crossReserve.year3.revenue`, the
 *     three `crossReserve.travelPassthrough.*` worked examples).
 *   - the Deer Lake Store deck "First reserve, then the next" slide,
 *     which seeds its receiving-reserve calculator with these as the
 *     starting numbers a candidate band council can edit live, and
 *     reads the same `install.*` and `dayRate.*` constants for the
 *     slide-body copy ("$3,500/on-site day · $1,800/remote day · …
 *     12-week install (~30 on-site + ~24 remote)").
 *
 * Both sides previously hardcoded these values in two places, with the
 * cost registry context strings explicitly naming themselves as the
 * source of truth — this package closes that gap so a single edit
 * here flows through to both surfaces on the next build, with no
 * manual sync.
 *
 * Values:
 *   - dayRate.onsite            — premium-but-defensible practitioner
 *     day rate charged for every day the practitioner is on the
 *     receiving reserve installing the discipline. Travel/lodging/food
 *     are pass-through, not in this rate.
 *   - dayRate.remote            — pre-install scoping, curriculum
 *     adaptation, and post-install discipline check-ins done from
 *     home. Lower than the on-site rate because the practitioner
 *     isn't away from Deer Lake.
 *   - install.weeks             — total install length, weeks. Drives
 *     the per-week travel pass-through (one return flight per week).
 *   - install.onsiteDays        — on-site days the practitioner spends
 *     at the receiving reserve. Also the count of lodging nights and
 *     food per-diem days in the travel pass-through examples, and the
 *     on-site day-count behind the install-revenue derivation.
 *   - install.remoteDays        — remote prep + follow-up days done
 *     from home, billed at the lower remote day rate; the remote
 *     day-count behind the install-revenue derivation.
 *   - installRevenuePerReserve  — computed here from
 *     install.onsiteDays × dayRate.onsite +
 *     install.remoteDays × dayRate.remote (= $148,200 at the current
 *     defaults). Editing any of those four inputs flows through
 *     automatically. The slide quotes this as the practitioner's
 *     headline install fee to a receiving reserve, on top of which
 *     travel pass-through is billed at cost and the annual retainer
 *     kicks in.
 *   - retainerAnnual            — discipline-keeper retainer per active
 *     reserve, recurring while the practitioner remains the discipline
 *     owner there.
 *   - travel.flightPerWeek      — Wasaya / Bearskin round-trip per
 *     install week (one return flight per week of the typical install).
 *   - travel.lodgingPerNight    — northern guesthouse / band-house /
 *     contractor-camp nightly rate, charged per on-site night.
 *   - travel.foodPerOnsiteDay   — northern food cost per on-site day.
 *
 * Travel values are Deer-Lake-corridor planning estimates; a receiving
 * band council can edit them in the slide's calculator to model their
 * own corridor without touching the source numbers.
 */

export interface CrossReserveInstallShape {
  /** Total install length in weeks (drives per-week travel pass-through). */
  weeks: number;
  /** On-site days at the receiving reserve (also lodging-nights + food-days). */
  onsiteDays: number;
  /** Remote prep + follow-up days done from home, billed at remote day rate. */
  remoteDays: number;
}

export interface CrossReserveTravelDefaults {
  /** Round-trip flight per install week (planning estimate, $). */
  flightPerWeek: number;
  /** Lodging per on-site night (planning estimate, $). */
  lodgingPerNight: number;
  /** Food per on-site day (planning estimate, $). */
  foodPerOnsiteDay: number;
}

export interface CrossReserveDayRateDefaults {
  /** Practitioner on-site install day rate ($/day). */
  onsite: number;
  /** Practitioner remote prep + follow-up day rate ($/day). */
  remote: number;
}

export interface CrossReserveDefaults {
  /** Practitioner day rates (on-site vs. remote). */
  dayRate: CrossReserveDayRateDefaults;
  /** Typical install shape — drives every cross-reserve derivation. */
  install: CrossReserveInstallShape;
  /**
   * Practitioner install revenue per receiving reserve, $/yr. Derived
   * from `install.onsiteDays × dayRate.onsite + install.remoteDays ×
   * dayRate.remote` — see `CROSS_RESERVE_DEFAULTS`.
   */
  installRevenuePerReserve: number;
  /** Discipline-keeper retainer per active reserve, $/yr. */
  retainerAnnual: number;
  /** Travel pass-through corridor defaults (Deer Lake → fly-in reserve). */
  travel: CrossReserveTravelDefaults;
}

const DAY_RATE: CrossReserveDayRateDefaults = {
  onsite: 3_500,
  remote: 1_800,
};

const INSTALL: CrossReserveInstallShape = {
  weeks: 12,
  onsiteDays: 30,
  remoteDays: 24,
};

export const CROSS_RESERVE_DEFAULTS: CrossReserveDefaults = {
  dayRate: DAY_RATE,
  install: INSTALL,
  installRevenuePerReserve:
    INSTALL.onsiteDays * DAY_RATE.onsite +
    INSTALL.remoteDays * DAY_RATE.remote,
  retainerAnnual: 30_000,
  travel: {
    flightPerWeek: 1_000,
    lodgingPerNight: 250,
    foodPerOnsiteDay: 100,
  },
};

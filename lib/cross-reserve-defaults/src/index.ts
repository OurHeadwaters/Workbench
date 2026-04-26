/**
 * Cross-reserve install & travel-corridor planning defaults.
 *
 * Single source of truth used by:
 *   - the Practitioner Operating Plan cost registry (`crossReserve.*`
 *     entries in artifacts/practitioner-operating-plan/src/data/costRegistry.ts),
 *     where each value is wrapped with full provenance, derivation
 *     context, and the slide(s) it surfaces on.
 *   - the Deer Lake Store deck "First reserve, then the next" slide,
 *     which seeds its receiving-reserve calculator with these as the
 *     starting numbers a candidate band council can edit live.
 *
 * Both sides previously hardcoded these values in two places, with the
 * cost registry context strings explicitly naming themselves as the
 * source of truth — this package closes that gap so a single edit
 * here flows through to both surfaces on the next build, with no
 * manual sync.
 *
 * Values:
 *   - installRevenuePerReserve  — derived in the registry as
 *     30 on-site days × $3,500 + 24 remote days × $1,800 = $148,200.
 *     The slide quotes this as the practitioner's headline install fee
 *     to a receiving reserve, on top of which travel pass-through is
 *     billed at cost and the annual retainer kicks in.
 *   - retainerAnnual            — discipline-keeper retainer per active
 *     reserve, recurring while the practitioner remains the discipline
 *     owner there.
 *   - travel.flightPerWeek      — Wasaya / Bearskin round-trip per
 *     install week (one return flight per week of a typical 12-week
 *     install).
 *   - travel.lodgingPerNight    — northern guesthouse / band-house /
 *     contractor-camp nightly rate, charged per on-site night.
 *   - travel.foodPerOnsiteDay   — northern food cost per on-site day.
 *
 * Travel values are Deer-Lake-corridor planning estimates; a receiving
 * band council can edit them in the slide's calculator to model their
 * own corridor without touching the source numbers.
 */

export interface CrossReserveTravelDefaults {
  /** Round-trip flight per install week (planning estimate, $). */
  flightPerWeek: number;
  /** Lodging per on-site night (planning estimate, $). */
  lodgingPerNight: number;
  /** Food per on-site day (planning estimate, $). */
  foodPerOnsiteDay: number;
}

export interface CrossReserveDefaults {
  /** Practitioner install revenue per receiving reserve, $/yr. */
  installRevenuePerReserve: number;
  /** Discipline-keeper retainer per active reserve, $/yr. */
  retainerAnnual: number;
  /** Travel pass-through corridor defaults (Deer Lake → fly-in reserve). */
  travel: CrossReserveTravelDefaults;
}

export const CROSS_RESERVE_DEFAULTS: CrossReserveDefaults = {
  installRevenuePerReserve: 148_200,
  retainerAnnual: 30_000,
  travel: {
    flightPerWeek: 1_000,
    lodgingPerNight: 250,
    foodPerOnsiteDay: 100,
  },
};

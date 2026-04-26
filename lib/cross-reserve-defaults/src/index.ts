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
 *   - dayRate.onsite            — premium-but-defensible practitioner
 *     day rate charged for every day the practitioner is on the
 *     receiving reserve installing the discipline. Travel/lodging/food
 *     are pass-through, not in this rate.
 *   - dayRate.remote            — pre-install scoping, curriculum
 *     adaptation, and post-install discipline check-ins done from
 *     home. Lower than the on-site rate because the practitioner
 *     isn't away from Deer Lake.
 *   - typicalInstall.onsiteDays — on-site day count assumed for the
 *     headline 12-week install. Drives the install-revenue derivation.
 *   - typicalInstall.remoteDays — remote prep + follow-up day count
 *     assumed for the same headline install.
 *   - installRevenuePerReserve  — computed here from
 *     typicalInstall.onsiteDays × dayRate.onsite +
 *     typicalInstall.remoteDays × dayRate.remote (= $148,200 at the
 *     current defaults). Editing any of those four inputs flows
 *     through automatically. The slide quotes this as the
 *     practitioner's headline install fee to a receiving reserve, on
 *     top of which travel pass-through is billed at cost and the
 *     annual retainer kicks in.
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

export interface CrossReserveDayRateDefaults {
  /** Practitioner on-site install day rate ($/day). */
  onsite: number;
  /** Practitioner remote prep + follow-up day rate ($/day). */
  remote: number;
}

export interface CrossReserveTypicalInstallDefaults {
  /** On-site days assumed for the headline 12-week install. */
  onsiteDays: number;
  /** Remote prep + follow-up days assumed for the same install. */
  remoteDays: number;
}

export interface CrossReserveDefaults {
  /** Practitioner day rates (on-site vs. remote). */
  dayRate: CrossReserveDayRateDefaults;
  /** Day-count assumptions for the headline 12-week install. */
  typicalInstall: CrossReserveTypicalInstallDefaults;
  /**
   * Practitioner install revenue per receiving reserve, $/yr. Derived
   * from `dayRate` × `typicalInstall` — see `CROSS_RESERVE_DEFAULTS`.
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

const TYPICAL_INSTALL: CrossReserveTypicalInstallDefaults = {
  onsiteDays: 30,
  remoteDays: 24,
};

export const CROSS_RESERVE_DEFAULTS: CrossReserveDefaults = {
  dayRate: DAY_RATE,
  typicalInstall: TYPICAL_INSTALL,
  installRevenuePerReserve:
    TYPICAL_INSTALL.onsiteDays * DAY_RATE.onsite +
    TYPICAL_INSTALL.remoteDays * DAY_RATE.remote,
  retainerAnnual: 30_000,
  travel: {
    flightPerWeek: 1_000,
    lodgingPerNight: 250,
    foodPerOnsiteDay: 100,
  },
};

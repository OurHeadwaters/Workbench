/**
 * Cross-reserve install corridor — single source of truth for the
 * receiving-reserve travel pass-through and install shape.
 *
 * Two decks consume these constants and must never drift out of sync:
 *   - artifacts/practitioner-operating-plan/src/data/costRegistry.ts
 *     reads them as the `defaultValue` for every `crossReserve.travel.*`,
 *     `crossReserve.dayRate.*`, `crossReserve.retainer.annual`, and the
 *     derived install/sticker totals (`crossReserve.installRevenue.perReserve`,
 *     `crossReserve.travel.totalPerInstall`, `crossReserve.year1.stickerPrice`).
 *   - artifacts/practitioner-operating-plan/src/lib/budgetMath.ts uses
 *     the install-shape day counts (12 weeks / 30 on-site / 24 remote) for
 *     every cross-reserve derivation and Y2/Y3 stack.
 *   - artifacts/deer-lake-store-plan/src/pages/slides/FirstReserveThenTheNext.tsx
 *     reads `CORRIDOR_DEFAULTS`, `CORRIDOR_INSTALL_FEE_HEADLINE`, and
 *     `CORRIDOR_ANNUAL_RETAINER` for its receiving-reserve corridor
 *     calculator and share-link defaults.
 *
 * Edit a number in this file and both decks update together. Adding a
 * local copy back into either deck is caught by
 * `artifacts/deer-lake-store-plan/scripts/check-corridor-defaults.ts`,
 * which runs as part of the slide-validation step on every build.
 */

/**
 * Travel pass-through defaults for the fly-in scheduled (Bearskin /
 * Wasaya) corridor — the middle-of-the-road planning case. A receiving
 * reserve replaces these with their own corridor's actual numbers via
 * the slide-12 calculator or the cost-review modal.
 */
export const CORRIDOR_TRAVEL_DEFAULTS = {
  /** Round-trip flight per install week, CAD. */
  flightPerReturn: 1000,
  /**
   * Lodging per on-site night (northern guesthouse / band-house /
   * contractor camp), CAD.
   */
  lodgingPerNight: 250,
  /** Food per on-site day at Northern Store pricing, CAD. */
  foodPerDay: 100,
} as const;

/**
 * Implicit shape of a typical 12-week practitioner install. One
 * round-trip flight per week, 30 on-site days (= 30 lodging nights),
 * plus 24 remote prep / follow-up days that do not incur travel.
 */
export const CORRIDOR_INSTALL_SHAPE = {
  installWeeks: 12,
  onsiteDays: 30,
  remoteDays: 24,
} as const;

/** Premium day rates for the practitioner's touring install discipline, CAD. */
export const CORRIDOR_DAY_RATES = {
  onsitePerDay: 3500,
  remotePerDay: 1800,
} as const;

/** Annual discipline-keeper retainer per active reserve, CAD. */
export const CORRIDOR_ANNUAL_RETAINER = 30_000;

/**
 * Bundle the slide-12 calculator reads as its `DEFAULTS` literal —
 * travel + install shape inputs the receiving reserve can edit live.
 */
export const CORRIDOR_DEFAULTS = {
  flightPerReturn: CORRIDOR_TRAVEL_DEFAULTS.flightPerReturn,
  lodgingPerNight: CORRIDOR_TRAVEL_DEFAULTS.lodgingPerNight,
  foodPerDay: CORRIDOR_TRAVEL_DEFAULTS.foodPerDay,
  installWeeks: CORRIDOR_INSTALL_SHAPE.installWeeks,
  onsiteDays: CORRIDOR_INSTALL_SHAPE.onsiteDays,
} as const;

/**
 * Travel pass-through total for a default 12-week install, CAD.
 * Computed: 12 × $1,000 + 30 × $250 + 30 × $100 = $22,500.
 */
export const CORRIDOR_TRAVEL_TOTAL_DEFAULT: number =
  CORRIDOR_INSTALL_SHAPE.installWeeks * CORRIDOR_TRAVEL_DEFAULTS.flightPerReturn +
  CORRIDOR_INSTALL_SHAPE.onsiteDays * CORRIDOR_TRAVEL_DEFAULTS.lodgingPerNight +
  CORRIDOR_INSTALL_SHAPE.onsiteDays * CORRIDOR_TRAVEL_DEFAULTS.foodPerDay;

/**
 * Install fee per reserve at default day-rate × shape, CAD.
 * Exact: 30 × $3,500 + 24 × $1,800 = $148,200. The slide and the
 * Path-to-Scale headline planning copy round this up to the nearest
 * $500 ($148,500) — that rounded value is `CORRIDOR_INSTALL_FEE_HEADLINE`.
 */
export const CORRIDOR_INSTALL_REVENUE_EXACT: number =
  CORRIDOR_INSTALL_SHAPE.onsiteDays * CORRIDOR_DAY_RATES.onsitePerDay +
  CORRIDOR_INSTALL_SHAPE.remoteDays * CORRIDOR_DAY_RATES.remotePerDay;

/**
 * Headline planning number used in the deck copy ("$148.5k per
 * reserve"). Rounded up to the nearest $500.
 */
export const CORRIDOR_INSTALL_FEE_HEADLINE: number =
  Math.ceil(CORRIDOR_INSTALL_REVENUE_EXACT / 500) * 500;

/**
 * Receiving-reserve Y1 all-in sticker price at defaults, CAD.
 * Install fee (headline rounded) + travel pass-through + Y1 retainer.
 * Default: $148,500 + $22,500 + $30,000 = $201,000.
 */
export const CORRIDOR_Y1_ALL_IN_DEFAULT: number =
  CORRIDOR_INSTALL_FEE_HEADLINE + CORRIDOR_TRAVEL_TOTAL_DEFAULT + CORRIDOR_ANNUAL_RETAINER;

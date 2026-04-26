/**
 * Headwaters pricing — reinvestment-bucket single source of truth.
 *
 * The 35% reinvestment markup baked into every Headwaters operating-fee
 * tier (floor / recommended / scale) flows into four buckets, listed
 * below with their Year-1 dollar amounts.
 *
 * Used by:
 *   - the Deer Lake Store deck "What Headwaters delivers" slide
 *     (`ServicePartner.tsx` · the `reinvestBuckets` card grid that
 *     surfaces under the "$24.3k/mo (35%) reinvestment" headline).
 *   - the Practitioner Operating Plan one-pager (`OnePager.tsx` · the
 *     "What the 35% reinvestment buys" table).
 *
 * Both surfaces previously hardcoded these four bucket amounts as
 * literal strings in two places, with the integration test in
 * `artifacts/deer-lake-store-plan/src/__tests__/lockedNumbers.test.ts`
 * (task #248) catching drift after the fact. This module is the single
 * source of truth so a single edit here flows through to both surfaces
 * on the next build, with no manual sync.
 *
 * Locked invariant: the four `year1Amount` values sum to ≈ $292k/yr,
 * which rounds to the $24.3k/mo × 12 = $291.6k/yr reinvestment headline
 * quoted on the ServicePartner slide. The deer-lake deck's lockedNumbers
 * test asserts both the sum and that headline.
 */

export type ReinvestmentBucketId =
  | "techCapex"
  | "toolingSubs"
  | "trainingRnD"
  | "pilotReserve";

export interface ReinvestmentBucket {
  /** Stable machine id for cross-surface lookup. */
  id: ReinvestmentBucketId;
  /**
   * Short label used on the slide-deck card
   * (e.g. "Tech CAPEX", "Tooling subs", "Pilot reserve").
   */
  label: string;
  /**
   * Long-form label used in printable / table contexts where the column
   * is wide enough to spell things out (e.g. "Tooling subscriptions",
   * "Pilot #2 reserve").
   */
  longLabel: string;
  /** Year-1 dollar amount in USD/CAD-equivalent (e.g. 60_000). */
  year1Amount: number;
  /**
   * Short, slide-card-sized description of what this bucket ships
   * (rendered on the Deer Lake deck's ServicePartner slide).
   */
  shortDescription: string;
  /**
   * Longer description with concrete unit counts where applicable
   * (rendered in the Practitioner one-pager table). Defaults to
   * `shortDescription` when no extra detail is needed.
   */
  longDescription: string;
}

export const REINVESTMENT_BUCKETS: readonly ReinvestmentBucket[] = [
  {
    id: "techCapex",
    label: "Tech CAPEX",
    longLabel: "Tech CAPEX",
    year1Amount: 60_000,
    shortDescription:
      "self-hosted servers, privacy phones, work computers, networking",
    longDescription:
      "9 self-hosted servers, 6 privacy phones, 8 work computers, networking",
  },
  {
    id: "toolingSubs",
    label: "Tooling subs",
    longLabel: "Tooling subscriptions",
    year1Amount: 24_000,
    shortDescription:
      "transparency dashboard hosting, GIS, secure comms, payroll",
    longDescription:
      "Transparency dashboard hosting, GIS, secure comms, project ops, payroll",
  },
  {
    id: "trainingRnD",
    label: "Training & R&D",
    longLabel: "Training & R&D",
    year1Amount: 36_000,
    shortDescription:
      "Indigenous-services certifications, conferences, playbook hours",
    longDescription:
      "Indigenous-services certifications, conferences, documented playbook hours",
  },
  {
    id: "pilotReserve",
    label: "Pilot reserve",
    longLabel: "Pilot #2 reserve",
    year1Amount: 172_000,
    shortDescription:
      "held in a separate account; seeds the next reserve so they don't wait for grants",
    longDescription:
      "Held in a separate account; seeds the next reserve so they don't wait for grants",
  },
];

/**
 * Sum of every bucket's `year1Amount`. At the current defaults this is
 * $292,000/yr, which rounds to the $24.3k/mo × 12 = $291.6k/yr headline
 * quoted on the Deer Lake deck's ServicePartner slide.
 */
export const REINVESTMENT_TOTAL_YEAR1: number = REINVESTMENT_BUCKETS.reduce(
  (acc, bucket) => acc + bucket.year1Amount,
  0,
);

/**
 * Format a Year-1 reinvestment-bucket amount as the "~$60k" short string
 * used in both decks. (e.g. 60_000 → "~$60k", 172_000 → "~$172k".)
 */
export function formatBucketAmount(year1Amount: number): string {
  const k = Math.round(year1Amount / 1_000);
  return `~$${k}k`;
}

/**
 * Slide-deck variant of `formatBucketAmount` that appends the " Y1"
 * suffix used on the ServicePartner card grid (e.g. "~$60k Y1").
 */
export function formatBucketAmountY1(year1Amount: number): string {
  return `${formatBucketAmount(year1Amount)} Y1`;
}

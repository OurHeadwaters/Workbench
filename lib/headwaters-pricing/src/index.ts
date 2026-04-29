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
   * (e.g. "Computers and phones", "Software subscriptions",
   * "Saved for the next reserve"). Written in plain language for the
   * read-aloud audit (see `docs/read-aloud-audit.md` row 11.5) — the
   * old internal-accounting labels ("Tech CAPEX", "Tooling subs") were
   * rewritten so a Deer Lake reader recognises what each bucket buys
   * without translating the jargon.
   */
  label: string;
  /**
   * Long-form label used in printable / table contexts where the column
   * is wide enough to spell things out. With the plain-language rewrite
   * the short and long labels are now identical for every bucket — the
   * field is kept on the type so future buckets can still distinguish
   * the two if needed (e.g. an abbreviation that needs a fuller form
   * in the printed table).
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
    label: "Computers and phones",
    longLabel: "Computers and phones",
    year1Amount: 60_000,
    shortDescription:
      "servers we run ourselves, secure phones, work laptops, networking gear",
    longDescription:
      "9 servers we run ourselves, 6 secure phones, 8 work laptops, plus the networking gear that ties them together",
  },
  {
    id: "toolingSubs",
    label: "Software subscriptions",
    longLabel: "Software subscriptions",
    year1Amount: 24_000,
    shortDescription:
      "open-records dashboard hosting, mapping, secure messaging, payroll",
    longDescription:
      "Open-records dashboard hosting, mapping, secure messaging, project tracker, payroll",
  },
  {
    id: "trainingRnD",
    label: "Training and the written guide",
    longLabel: "Training and the written guide",
    year1Amount: 36_000,
    shortDescription:
      "Indigenous-services certifications, conferences, hours spent writing the guide",
    longDescription:
      "Indigenous-services certifications, conferences, hours spent writing the guide for running the store",
  },
  {
    id: "pilotReserve",
    label: "Saved for the next reserve",
    longLabel: "Saved for the next reserve",
    year1Amount: 172_000,
    shortDescription:
      "kept in its own account so the next reserve can start without waiting for a grant",
    longDescription:
      "Kept in its own account so the next reserve can start without waiting for a grant",
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

/**
 * Headwaters Step 0 paid-trial offer — single source of truth for the
 * "$40,000 flat / eight weeks / solo practitioner / money back if we
 * don't deliver" call-out quoted on the walkthrough deck, the store-
 * plan deck, the printable one-pager, and §7 of the payback memo. See
 * `trialOffer.ts` for the full export surface and the rationale for
 * each canonical string.
 */
export * from "./trialOffer.js";

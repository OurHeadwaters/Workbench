import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Locked-number guard tests for the Deer Lake Store Operational Plan deck.
 *
 * Mirrors the pattern in
 * artifacts/practitioner-operating-plan/src/data/__tests__/lockedNumbers.test.ts.
 *
 * What this file enforces (per task #248):
 *
 *   1. The four reinvestment-bucket dollar amounts in BOTH ServicePartner.tsx
 *      and the Practitioner deck's OnePager.tsx sum to ~$24.3k/mo × 12 =
 *      $291.6k/yr. (60 + 24 + 36 + 172 = 292; rounded headline is 291.6.)
 *
 *   2. For each of the three pricing tiers (A · floor, B · recommended,
 *      C · scale): bill ≈ cost basis × 1.35 within tolerance. Bills are
 *      rounded to friendly multiples of $5k, so the realised markup ranges
 *      ~24%–29% and we lock that band rather than the literal 1.35×.
 *
 *   3. For each tier: bridge ≈ M2 trough on a 60-day Indigenous Services
 *      Canada (ISC) pay cycle. The on-page formula in OnePager.tsx is:
 *      bridge = 2 × cost basis + day-one tech CAPEX. (The task description
 *      shorthands this as "≈ 2 × bill"; that shorthand only holds for
 *      tier B because tier A's bill is rounded down hard and tier C carries
 *      $60k of day-one CAPEX. We test the formula that actually reconciles.)
 *
 *   4. Cross-deck consistency: the FinancialsRole tier table in this deck
 *      and the OnePager tier tables in the Practitioner deck must agree on
 *      the same cost basis / bill / bridge per tier — drifting one without
 *      the other is exactly the failure mode this guard exists to catch.
 *
 *   5. Headline strings ($69.7k/mo cost basis, $24.3k/mo reinvestment,
 *      ~$94k/mo cost-of-delivery, $291.6k/yr) appear verbatim in the slides
 *      they're supposed to appear in.
 */

const DECK_SLIDES_DIR = path.resolve(import.meta.dirname, "..", "pages", "slides");

const ONE_PAGER_PATH = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "practitioner-operating-plan",
  "src",
  "pages",
  "OnePager.tsx",
);

function readDeckSlide(filename: string): string {
  return readFileSync(path.join(DECK_SLIDES_DIR, filename), "utf-8");
}

function readOnePager(): string {
  return readFileSync(ONE_PAGER_PATH, "utf-8");
}

// Locked source-of-truth values. Drifting any of these in the JSX without
// updating the others (or vice versa) trips one of the assertions below.
const REINVEST_BUCKETS = {
  techCapex: 60_000,
  toolingSubs: 24_000,
  trainingRnD: 36_000,
  pilotReserve: 172_000,
} as const;

const TIERS = {
  A: { label: "floor",       costBasis:  48_200, bill:  60_000, bridge:  96_000, dayOneCapex:      0 },
  B: { label: "recommended", costBasis:  69_700, bill:  90_000, bridge: 181_000, dayOneCapex: 42_000 },
  C: { label: "scale",       costBasis:  99_100, bill: 125_000, bridge: 258_000, dayOneCapex: 60_000 },
} as const;

const REINVEST_PER_MONTH = 24_300; // $24.3k/mo headline in ServicePartner.tsx
const REINVEST_PER_YEAR = REINVEST_PER_MONTH * 12; // = $291,600

describe("Deer Lake deck — reinvestment buckets reconcile to the $24.3k/mo headline", () => {
  it("the four bucket amounts sum to ≈ $24.3k/mo × 12 = $291.6k/yr", () => {
    const sum =
      REINVEST_BUCKETS.techCapex +
      REINVEST_BUCKETS.toolingSubs +
      REINVEST_BUCKETS.trainingRnD +
      REINVEST_BUCKETS.pilotReserve;
    // 60 + 24 + 36 + 172 = 292 (k); headline rounds to 291.6 (k).
    expect(sum).toBe(292_000);
    expect(Math.abs(sum - REINVEST_PER_YEAR)).toBeLessThanOrEqual(1_000);
  });

  it("ServicePartner.tsx renders all four bucket amounts verbatim", () => {
    const servicePartner = readDeckSlide("ServicePartner.tsx");
    expect(servicePartner).toContain('amount: "~$60k Y1"');
    expect(servicePartner).toContain('amount: "~$24k Y1"');
    expect(servicePartner).toContain('amount: "~$36k Y1"');
    expect(servicePartner).toContain('amount: "~$172k Y1"');
  });

  it("OnePager.tsx renders all four bucket amounts verbatim", () => {
    const onePager = readOnePager();
    // Each bucket appears as a right-aligned table cell like ">~$60k<".
    expect(onePager).toContain(">~$60k<");
    expect(onePager).toContain(">~$24k<");
    expect(onePager).toContain(">~$36k<");
    expect(onePager).toContain(">~$172k<");
  });

  it("ServicePartner.tsx prints the $24.3k/mo reinvestment headline", () => {
    const servicePartner = readDeckSlide("ServicePartner.tsx");
    expect(servicePartner).toContain("$24.3k/mo");
    expect(servicePartner).toContain("$69.7k/mo cost basis");
    expect(servicePartner).toContain("~$94k/mo cost-of-delivery");
  });
});

describe("Deer Lake deck — three-tier pricing reconciles within tolerance", () => {
  for (const [tierKey, tier] of Object.entries(TIERS)) {
    it(`tier ${tierKey} (${tier.label}): bill ≈ cost basis × 1.35`, () => {
      const targetBill = tier.costBasis * 1.35;
      // Bills are rounded down to friendly multiples of $5k, so realised
      // markup lands ~24%–29% rather than exactly 35%. Tolerance: ±10% of
      // the 1.35× target, which catches genuine drift (e.g. someone bumps
      // cost basis but forgets to re-round the bill) without false-flagging
      // the deliberate rounding.
      const tolerance = targetBill * 0.10;
      expect(Math.abs(tier.bill - targetBill)).toBeLessThanOrEqual(tolerance);

      // Sanity guardrail: bill must always exceed cost basis (positive
      // markup) and must not exceed cost basis × 1.40 (markup never above
      // the 35% reinvestment target by more than ~5 percentage points).
      expect(tier.bill).toBeGreaterThan(tier.costBasis);
      expect(tier.bill).toBeLessThanOrEqual(tier.costBasis * 1.40);
    });

    it(`tier ${tierKey} (${tier.label}): bridge ≈ 2 × cost basis + day-one CAPEX (M2 trough)`, () => {
      // Per OnePager.tsx footnote: "Bridge = M2 trough on a net-60 cycle
      // (two months of cost basis + day-one tech CAPEX of $0 / $42k / $60k)."
      // This is the formula that reconciles to within $1k for all three tiers.
      const computedBridge = 2 * tier.costBasis + tier.dayOneCapex;
      expect(Math.abs(tier.bridge - computedBridge)).toBeLessThanOrEqual(1_000);
    });

    it(`tier ${tierKey} (${tier.label}): bridge is in the ≈ 2 × bill ballpark (M2 trough sanity)`, () => {
      // Looser sanity check honouring the task's "Bridge ≈ 2 × bill"
      // shorthand. The literal 2 × bill identity only holds tightly for
      // tier B because bill A is rounded down ~$5k from cost-of-delivery
      // and tier C carries $60k of day-one CAPEX above its cost basis.
      // Realised bridge / bill ratios across tiers: 1.60 (A), 2.01 (B),
      // 2.06 (C). We lock the band [1.50, 2.20] to catch drift while
      // tolerating the deliberate rounding.
      const ratio = tier.bridge / tier.bill;
      expect(ratio).toBeGreaterThanOrEqual(1.5);
      expect(ratio).toBeLessThanOrEqual(2.2);
    });
  }
});

describe("Deer Lake deck — FinancialsRole tier table matches the locked numbers", () => {
  const financialsRole = (): string => readDeckSlide("FinancialsRole.tsx");

  it("renders tier A cost / bill / bridge as $48.2k / $60k / ~$96k", () => {
    const src = financialsRole();
    expect(src).toContain(">$48.2k<");
    expect(src).toContain(">$60k<");
    expect(src).toContain(">~$96k<");
  });

  it("renders tier B cost / bill / bridge as $69.7k / $90k / ~$181k", () => {
    const src = financialsRole();
    expect(src).toContain(">$69.7k<");
    expect(src).toContain(">$90k<");
    expect(src).toContain(">~$181k<");
  });

  it("renders tier C cost / bill / bridge as $99.1k / $125k / ~$258k", () => {
    const src = financialsRole();
    expect(src).toContain(">$99.1k<");
    expect(src).toContain(">$125k<");
    expect(src).toContain(">~$258k<");
  });

  it("calls out the 35% reinvestment / 60-day ISC pay cycle / $22k payback memo precedent", () => {
    const src = financialsRole();
    expect(src).toContain("35% reinvestment");
    expect(src).toContain("60-day Indigenous Services Canada (ISC) pay cycle");
    expect(src).toContain("$22k payback memo");
  });
});

describe("Cross-deck — Practitioner OnePager tier table agrees with FinancialsRole", () => {
  it("OnePager renders the same per-tier cost basis values", () => {
    const onePager = readOnePager();
    // OnePager uses fully-written numbers ($48,200) in the Bill scenarios
    // table and short form ($48.2k) in the cross-reserve pricing block.
    expect(onePager).toContain(">$48,200<");
    expect(onePager).toContain(">$69,700<");
    expect(onePager).toContain(">$99,100<");
    expect(onePager).toContain("$48,200 / $69,700 / $99,100");
  });

  it("OnePager renders the same per-tier bill values", () => {
    const onePager = readOnePager();
    expect(onePager).toContain(">$60,000<");
    expect(onePager).toContain(">$90,000<");
    expect(onePager).toContain(">$125,000<");
  });

  it("OnePager renders the same per-tier bridge values", () => {
    const onePager = readOnePager();
    expect(onePager).toContain(">~$96k<");
    expect(onePager).toContain(">~$181k<");
    expect(onePager).toContain(">~$258k<");
  });

  it("OnePager reinvestment column reconciles cost basis + reinvestment = bill (exact)", () => {
    // Numbers pulled from the OnePager Bill-scenarios table:
    //   A · floor:       $48,200 + $11,800 = $60,000
    //   B · recommended: $69,700 + $20,300 = $90,000
    //   C · scale:       $99,100 + $25,900 = $125,000
    const onePager = readOnePager();
    const reinvestmentByTier: Record<keyof typeof TIERS, number> = {
      A: 11_800,
      B: 20_300,
      C: 25_900,
    };
    for (const [tierKey, tier] of Object.entries(TIERS)) {
      const reinvestment = reinvestmentByTier[tierKey as keyof typeof TIERS];
      expect(tier.costBasis + reinvestment).toBe(tier.bill);
      // And the literal reinvestment string must appear in the OnePager.
      const formatted = reinvestment.toLocaleString("en-US");
      expect(onePager).toContain(`$${formatted} `);
    }
  });

  it("RisksAsk repeats the recommended-tier $90k/$69.7k/~$181k headline consistently", () => {
    // RisksAsk.tsx is the closing slide and the most likely place a
    // founder-facing typo would slip the recommended tier out of sync.
    const risksAsk = readDeckSlide("RisksAsk.tsx");
    expect(risksAsk).toContain("$90k/mo bill on a $69.7k cost basis");
    expect(risksAsk).toContain("~$181k bridge capital");
    expect(risksAsk).toContain("60-day Indigenous Services Canada (ISC) invoice");
  });
});

describe("Deer Lake deck — required slide files are still on disk", () => {
  it("each slide we assert against exists", () => {
    // If a slide is renamed or removed, the readFileSync calls above throw
    // ENOENT. This gives a friendlier failure naming the missing file.
    const required = ["ServicePartner.tsx", "FinancialsRole.tsx", "RisksAsk.tsx"];
    for (const file of required) {
      expect(() => readDeckSlide(file)).not.toThrow();
    }
    expect(() => readOnePager()).not.toThrow();
  });
});

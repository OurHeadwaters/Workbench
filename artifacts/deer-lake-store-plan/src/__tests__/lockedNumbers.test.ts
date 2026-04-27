import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  REINVESTMENT_BUCKETS,
  REINVESTMENT_TOTAL_YEAR1,
  formatBucketAmount,
  formatBucketAmountY1,
} from "@workspace/headwaters-pricing";

/**
 * Locked-number guard tests for the Deer Lake Store Operational Plan deck.
 *
 * Mirrors the pattern in
 * artifacts/practitioner-operating-plan/src/data/__tests__/lockedNumbers.test.ts.
 *
 * What this file enforces (per task #248, simplified by task #252):
 *
 *   1. The four reinvestment-bucket dollar amounts come from a single
 *      shared module (`@workspace/headwaters-pricing`) and sum to
 *      ≈ $24.3k/mo × 12 = $291.6k/yr. ServicePartner.tsx and OnePager.tsx
 *      both render from that module instead of from local literals — so
 *      these tests now check the shared values directly and confirm the
 *      rendered strings derived from them still appear in both surfaces.
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

const TIERS = {
  A: { label: "floor",       costBasis:  48_200, bill:  60_000, bridge:  96_000, dayOneCapex:      0 },
  B: { label: "recommended", costBasis:  69_700, bill:  90_000, bridge: 181_000, dayOneCapex: 42_000 },
  C: { label: "scale",       costBasis:  99_100, bill: 125_000, bridge: 258_000, dayOneCapex: 60_000 },
} as const;

const REINVEST_PER_MONTH = 24_300; // $24.3k/mo headline in ServicePartner.tsx
const REINVEST_PER_YEAR = REINVEST_PER_MONTH * 12; // = $291,600

describe("Headwaters reinvestment-bucket source-of-truth", () => {
  it("exposes exactly four buckets with stable ids", () => {
    const ids = REINVESTMENT_BUCKETS.map((b) => b.id);
    expect(ids).toEqual(["techCapex", "toolingSubs", "trainingRnD", "pilotReserve"]);
  });

  it("the shared total reconciles to the $24.3k/mo × 12 = $291.6k/yr headline", () => {
    // 60 + 24 + 36 + 172 = 292 (k); headline rounds to 291.6 (k).
    expect(REINVESTMENT_TOTAL_YEAR1).toBe(292_000);
    expect(Math.abs(REINVESTMENT_TOTAL_YEAR1 - REINVEST_PER_YEAR)).toBeLessThanOrEqual(1_000);
  });

  it("ServicePartner.tsx imports from the shared module (not local literals)", () => {
    const servicePartner = readDeckSlide("ServicePartner.tsx");
    expect(servicePartner).toContain('from "@workspace/headwaters-pricing"');
    expect(servicePartner).toContain("REINVESTMENT_BUCKETS");
    // Drift guard: the previously-hardcoded "amount: " literals must not
    // be reintroduced — they were exactly the failure mode this refactor
    // closes. Old code carried lines like `amount: "~$60k Y1"`.
    for (const bucket of REINVESTMENT_BUCKETS) {
      const formatted = formatBucketAmountY1(bucket.year1Amount);
      expect(servicePartner).not.toContain(`amount: "${formatted}"`);
    }
  });

  it("OnePager.tsx imports from the shared module (not local literals)", () => {
    const onePager = readOnePager();
    expect(onePager).toContain('from "@workspace/headwaters-pricing"');
    expect(onePager).toContain("REINVESTMENT_BUCKETS");
    // The previously-hardcoded long labels must no longer appear as raw
    // JSX literals — drift was only possible because they were typed twice.
    expect(onePager).not.toContain('font-semibold">Tech CAPEX</td>');
    expect(onePager).not.toContain('font-semibold">Tooling subscriptions</td>');
    // Same guard for the right-aligned amount cells (e.g. ">~$60k<").
    for (const bucket of REINVESTMENT_BUCKETS) {
      const formatted = formatBucketAmount(bucket.year1Amount);
      expect(onePager).not.toContain(`text-right">${formatted}</td>`);
    }
  });

  it("ServicePartner.tsx prints the $24,300/mo reinvestment headline", () => {
    // Phrasing was rewritten for ESL readability (Task #275) and again for
    // read-aloud plain language (Task #284 — the equation-style sentence
    // became a three-sentence block). The locked numbers themselves must
    // still appear so this test catches numeric drift.
    const servicePartner = readDeckSlide("ServicePartner.tsx");
    expect(servicePartner).toContain("$24,300 a month");
    expect(servicePartner).toContain("$69,700 a month");
    expect(servicePartner).toContain("about $94,000 a month");
    // 35% is the reinvestment percentage anchor. Asserted without the
    // surrounding parenthetical so this guard survives sentence-form
    // rewrites of the headline.
    expect(servicePartner).toContain("35%");
  });

  it("formatBucketAmount produces the '~$Nk' shape both surfaces use", () => {
    expect(formatBucketAmount(60_000)).toBe("~$60k");
    expect(formatBucketAmount(172_000)).toBe("~$172k");
    expect(formatBucketAmountY1(60_000)).toBe("~$60k Y1");
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
    // Phrasing was rewritten for ESL readability (Task #275); the locked
    // anchors (35% reinvestment, ~60-day ISC pay cycle, $22k payback memo
    // precedent) must still appear in the new prose.
    const src = financialsRole();
    expect(src).toContain("35% of what you pay back into building the store");
    expect(src).toContain("Indigenous Services Canada");
    expect(src).toContain("60 days");
    expect(src).toContain("$22,000");
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
    // Phrasing was rewritten for ESL readability (Task #275); the locked
    // recommended-tier numbers ($90k bill, $69.7k cost basis, ~$181k bridge
    // on a 60-day ISC pay cycle) must still appear in the new prose.
    const risksAsk = readDeckSlide("RisksAsk.tsx");
    expect(risksAsk).toContain("$90,000 a month");
    expect(risksAsk).toContain("$69,700 a month");
    expect(risksAsk).toContain("about $181,000");
    expect(risksAsk).toContain("Indigenous Services Canada");
    expect(risksAsk).toContain("60 days");
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

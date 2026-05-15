/**
 * End-to-end tests for the SALT-01 close-out aggregation.
 *
 * Covers aggregateMonth() with realistic combined fixtures (Square, Shopify,
 * Shippo, Timesheet), the DTC double-count regression, saveMonthClose() math,
 * history helpers, and getStatus() thresholds.
 */

import { beforeEach, describe, expect, it } from "vitest";
import {
  SALT_BASELINE_NET,
  aggregateMonth,
  getLatestClose,
  getMonthHistory,
  getRecentHistory,
  getStatus,
  resetAllCloses,
  saveMonthClose,
  type ParsedRow,
} from "../saltClose";

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// January 2026 fixtures — realistic one-month salt run
//
//   markets:   30 jars at craft fair + farmers market (Square) + 4 hrs labour
//   dtc:       5 Shopify orders (product + shipping collected) + 5 Shippo labels
//              + 2 hrs packing labour
//   wholesale: 50-jar bulk order (Square)
//
// Expected per-channel:
//   markets:   rev=360  exp=249.50  net=110.50
//   dtc:       rev=217.50  exp=138.50  net=79.00
//   wholesale: rev=425  exp=290  net=135
//   TOTAL:     rev=1002.50  exp=678  net=324.50
// ---------------------------------------------------------------------------

const JAN: ParsedRow[] = [
  // markets
  { source: "square",    channel: "markets",   revenue: 360,   cogs: 165,  freight: 0,    packaging: 12.5, labor: 0    },
  { source: "timesheet", channel: "markets",   revenue: 0,     cogs: 0,    freight: 0,    packaging: 0,    labor: 72   },
  // dtc
  { source: "shopify",   channel: "dtc",       revenue: 175,   shippingCollected: 42.5, cogs: 71.5, freight: 0, packaging: 0, labor: 0 },
  { source: "shippo",    channel: "dtc",       revenue: 0,     cogs: 0,    freight: 31,   packaging: 0,    labor: 0    },
  { source: "timesheet", channel: "dtc",       revenue: 0,     cogs: 0,    freight: 0,    packaging: 0,    labor: 36   },
  // wholesale
  { source: "square",    channel: "wholesale", revenue: 425,   cogs: 275,  freight: 0,    packaging: 15,   labor: 0    },
];

describe("aggregateMonth — January combined fixtures", () => {
  it("produces three channels sorted alphabetically", () => {
    const { channels } = aggregateMonth(JAN);
    expect(channels.map((c) => c.channel)).toEqual(["dtc", "markets", "wholesale"]);
  });

  it("markets: revenue=$360, cogs=$165, freight=$0, packaging=$12.50, labor=$72", () => {
    const m = aggregateMonth(JAN).channels.find((c) => c.channel === "markets")!;
    expect(m.revenue).toBeCloseTo(360, 2);
    expect(m.cogs).toBeCloseTo(165, 2);
    expect(m.freight).toBe(0);
    expect(m.packaging).toBeCloseTo(12.5, 2);
    expect(m.labor).toBeCloseTo(72, 2);
  });

  it("dtc: revenue=$217.50 (product + shipping collected), cogs=$71.50, freight=$31, labor=$36", () => {
    const d = aggregateMonth(JAN).channels.find((c) => c.channel === "dtc")!;
    expect(d.revenue).toBeCloseTo(217.5, 2);   // $175 + $42.50
    expect(d.cogs).toBeCloseTo(71.5, 2);
    expect(d.freight).toBeCloseTo(31, 2);
    expect(d.labor).toBeCloseTo(36, 2);
  });

  it("wholesale: revenue=$425, cogs=$275, packaging=$15", () => {
    const w = aggregateMonth(JAN).channels.find((c) => c.channel === "wholesale")!;
    expect(w.revenue).toBeCloseTo(425, 2);
    expect(w.cogs).toBeCloseTo(275, 2);
    expect(w.packaging).toBeCloseTo(15, 2);
  });

  it("each channel: expenses = cogs + freight + packaging + labor", () => {
    for (const c of aggregateMonth(JAN).channels) {
      expect(c.expenses).toBeCloseTo(c.cogs + c.freight + c.packaging + c.labor, 2);
    }
  });

  it("each channel: net = revenue − expenses", () => {
    for (const c of aggregateMonth(JAN).channels) {
      expect(c.net).toBeCloseTo(c.revenue - c.expenses, 2);
    }
  });

  it("cross-channel totals: rev=$1,002.50, exp=$678, net=$324.50", () => {
    const { totalRevenue, totalExpenses, totalNet } = aggregateMonth(JAN);
    expect(totalRevenue).toBeCloseTo(1002.5, 2);
    expect(totalExpenses).toBeCloseTo(678, 2);
    expect(totalNet).toBeCloseTo(324.5, 2);
    expect(totalRevenue - totalExpenses).toBeCloseTo(totalNet, 2);
  });
});

// ---------------------------------------------------------------------------
// REGRESSION: DTC double-count — Shopify shipping-collected + Shippo label
//
// A DTC order appears in two source rows. If shippingCollected were also
// added to freight expense, the channel would double-count that amount.
// ---------------------------------------------------------------------------

describe("REGRESSION — DTC freight not double-counted", () => {
  const shopifyRow: ParsedRow = {
    source: "shopify", channel: "dtc",
    revenue: 35, shippingCollected: 8.5,
    cogs: 11, freight: 0, packaging: 0, labor: 0,
  };
  const shippoRow: ParsedRow = {
    source: "shippo", channel: "dtc",
    revenue: 0, cogs: 0, freight: 6.2, packaging: 0, labor: 0,
  };

  it("shippingCollected ($8.50) lands in revenue, not freight", () => {
    const dtc = aggregateMonth([shopifyRow, shippoRow]).channels[0];
    expect(dtc.revenue).toBeCloseTo(35 + 8.5, 2);
    expect(dtc.freight).toBeCloseTo(6.2, 2);
  });

  it("freight = Shippo label cost only ($6.20), not $6.20 + $8.50", () => {
    const dtc = aggregateMonth([shopifyRow, shippoRow]).channels[0];
    expect(dtc.freight).not.toBeCloseTo(6.2 + 8.5, 2);
    expect(dtc.freight).toBeCloseTo(6.2, 2);
  });

  it("expenses are not inflated by shippingCollected", () => {
    const dtc = aggregateMonth([shopifyRow, shippoRow]).channels[0];
    expect(dtc.expenses).toBeCloseTo(11 + 6.2, 2);          // correct
    expect(dtc.expenses).not.toBeCloseTo(11 + 6.2 + 8.5, 2); // double-count bug
  });

  it("net = (product + shippingCollected) − (cogs + freight)", () => {
    const dtc = aggregateMonth([shopifyRow, shippoRow]).channels[0];
    expect(dtc.net).toBeCloseTo((35 + 8.5) - (11 + 6.2), 2);
  });
});

// ---------------------------------------------------------------------------
// saveMonthClose — net math
// ---------------------------------------------------------------------------

describe("saveMonthClose — net math", () => {
  it("net = revenue − expenses", () => {
    const rec = saveMonthClose("2026-01", 3_200, 1_100);
    expect(rec.net).toBe(2_100);
  });

  it("net is negative when expenses exceed revenue", () => {
    const rec = saveMonthClose("2026-01", 800, 1_050);
    expect(rec.net).toBe(-250);
  });

  it("note is trimmed; blank note is stored as undefined", () => {
    expect(saveMonthClose("2026-01", 1_800, 600, "  hello  ").note).toBe("hello");
    resetAllCloses();
    expect(saveMonthClose("2026-02", 1_800, 600, "   ").note).toBeUndefined();
  });

  it("returned record matches persisted record", () => {
    const rec = saveMonthClose("2026-01", 2_400.75, 987.25);
    const [stored] = getMonthHistory();
    expect(stored.revenue).toBe(rec.revenue);
    expect(stored.expenses).toBe(rec.expenses);
    expect(stored.net).toBe(rec.net);
  });
});

// ---------------------------------------------------------------------------
// Overwrite idempotency — filing the same month twice
// ---------------------------------------------------------------------------

describe("saveMonthClose — overwrite idempotency", () => {
  it("filing the same month twice keeps exactly one record with updated values", () => {
    saveMonthClose("2026-01", 3_000, 900);
    saveMonthClose("2026-01", 3_200, 1_100, "corrected");
    const history = getMonthHistory();
    expect(history).toHaveLength(1);
    expect(history[0].revenue).toBe(3_200);
    expect(history[0].net).toBe(2_100);
    expect(history[0].note).toBe("corrected");
  });

  it("overwriting Jan does not affect Feb", () => {
    saveMonthClose("2026-01", 3_000, 900);
    saveMonthClose("2026-02", 3_100, 950);
    saveMonthClose("2026-01", 3_200, 1_100);
    const history = getMonthHistory();
    expect(history).toHaveLength(2);
    expect(history.find((r) => r.month === "2026-02")!.revenue).toBe(3_100);
  });
});

// ---------------------------------------------------------------------------
// History helpers
// ---------------------------------------------------------------------------

describe("getMonthHistory", () => {
  it("returns [] before any closes are filed", () => {
    expect(getMonthHistory()).toEqual([]);
  });

  it("sorts records oldest-first regardless of filing order", () => {
    saveMonthClose("2026-03", 2_000, 700);
    saveMonthClose("2026-01", 1_800, 600);
    saveMonthClose("2026-02", 2_100, 750);
    expect(getMonthHistory().map((r) => r.month)).toEqual(["2026-01", "2026-02", "2026-03"]);
  });
});

describe("getLatestClose", () => {
  it("returns null with no history", () => {
    expect(getLatestClose()).toBeNull();
  });

  it("returns the most recent month regardless of filing order", () => {
    saveMonthClose("2026-01", 1_800, 600);
    saveMonthClose("2026-03", 2_200, 800);
    saveMonthClose("2026-02", 2_000, 700);
    expect(getLatestClose()?.month).toBe("2026-03");
  });
});

describe("getRecentHistory", () => {
  it("returns the last N months oldest-first; defaults to 6", () => {
    for (let m = 1; m <= 8; m++) {
      saveMonthClose(`2026-${String(m).padStart(2, "0")}`, 1_800, 600);
    }
    expect(getRecentHistory(3).map((r) => r.month)).toEqual(["2026-06", "2026-07", "2026-08"]);
    expect(getRecentHistory()).toHaveLength(6);
  });
});

describe("resetAllCloses", () => {
  it("empties history and allows fresh filing", () => {
    saveMonthClose("2026-01", 1_800, 600);
    resetAllCloses();
    expect(getMonthHistory()).toEqual([]);
    saveMonthClose("2026-03", 2_200, 800);
    expect(getMonthHistory()).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// getStatus — threshold math
// ---------------------------------------------------------------------------

describe("getStatus — thresholds", () => {
  it("healthy at or above $1,800 (SALT_BASELINE_NET)", () => {
    expect(getStatus(1_800)).toBe("healthy");
    expect(getStatus(2_500)).toBe("healthy");
  });

  it("watch between 70% and 100% of baseline ($1,260 – $1,799.99)", () => {
    expect(getStatus(1_260)).toBe("watch");
    expect(getStatus(1_500)).toBe("watch");
    expect(getStatus(SALT_BASELINE_NET - 0.01)).toBe("watch");
  });

  it("below under 70% of baseline", () => {
    expect(getStatus(1_259.99)).toBe("below");
    expect(getStatus(0)).toBe("below");
    expect(getStatus(-100)).toBe("below");
  });

  it("boundary: watch threshold is exactly 70% of SALT_BASELINE_NET", () => {
    const threshold = SALT_BASELINE_NET * 0.7;
    expect(getStatus(threshold)).toBe("watch");
    expect(getStatus(threshold - 0.01)).toBe("below");
  });
});

// ---------------------------------------------------------------------------
// Full round-trip: aggregateMonth → saveMonthClose → getMonthHistory
// ---------------------------------------------------------------------------

describe("full round-trip — aggregate then file", () => {
  it("filing aggregated January totals stores the correct net", () => {
    const { totalRevenue, totalExpenses, totalNet } = aggregateMonth(JAN);
    const rec = saveMonthClose("2026-01", totalRevenue, totalExpenses, "Jan close");
    expect(rec.revenue).toBeCloseTo(1002.5, 2);
    expect(rec.net).toBeCloseTo(totalNet, 2);
    expect(rec.net).toBeCloseTo(324.5, 2);
    const [stored] = getMonthHistory();
    expect(stored.month).toBe("2026-01");
    expect(stored.net).toBeCloseTo(324.5, 2);
  });

  it("January net ($324.50) is below the watch threshold → status 'below'", () => {
    const { totalNet } = aggregateMonth(JAN);
    expect(getStatus(totalNet)).toBe("below");
  });

  it("filing two months with distinct aggregations preserves both records in order", () => {
    // Feb fixture: net ≈ $1,599 → watch band
    // markets: rev=600 exp=385 net=215
    // dtc:     rev=505 exp=216 net=289
    // wholesale: rev=2,500 exp=1,405 net=1,095
    const FEB: ParsedRow[] = [
      { source: "square",    channel: "markets",   revenue: 600,   cogs: 275,  freight: 0,  packaging: 20, labor: 0  },
      { source: "timesheet", channel: "markets",   revenue: 0,     cogs: 0,    freight: 0,  packaging: 0,  labor: 90 },
      { source: "shopify",   channel: "dtc",       revenue: 420,   shippingCollected: 85, cogs: 154, freight: 0, packaging: 0, labor: 0 },
      { source: "shippo",    channel: "dtc",       revenue: 0,     cogs: 0,    freight: 62, packaging: 0,  labor: 0  },
      { source: "square",    channel: "wholesale", revenue: 2_500, cogs: 1_375, freight: 0, packaging: 30, labor: 0  },
    ];
    const janAgg = aggregateMonth(JAN);
    const febAgg = aggregateMonth(FEB);
    saveMonthClose("2026-01", janAgg.totalRevenue, janAgg.totalExpenses);
    saveMonthClose("2026-02", febAgg.totalRevenue, febAgg.totalExpenses);

    const history = getMonthHistory();
    expect(history).toHaveLength(2);
    expect(history[0].month).toBe("2026-01");
    expect(history[1].month).toBe("2026-02");
    expect(history[1].net).toBeCloseTo(febAgg.totalNet, 2);
    expect(getStatus(history[1].net)).toBe("watch");
  });
});

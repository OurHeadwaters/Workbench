import { describe, it, expect } from "vitest";
import {
  parseShippoExport,
  parseShopifyExport,
  parseSquareExport,
  parseTimesheet,
  type SkuMapping,
} from "../saltImports";

// ───────────────────────────────────────────────────────────────────────
// Shared fixtures
// ───────────────────────────────────────────────────────────────────────

const SKU_MAP: SkuMapping[] = [
  { sku: "SALT-WS-100", channel: "wholesale" },
  { sku: "SALT-CL-", channel: "customLabels" },
  { sku: "SALT-MK-*", channel: "markets" },
  { sku: "SALT-DTC-001", channel: "dtcBatch" },
];

// ───────────────────────────────────────────────────────────────────────
// Square
// ───────────────────────────────────────────────────────────────────────

describe("parseSquareExport", () => {
  it("prefers Net Sales over Gross Sales when both are present", () => {
    const csv = [
      "Item,SKU,Qty,Gross Sales,Net Sales,Cost of Goods Sold",
      'Wholesale Pack,SALT-WS-100,10,"$1,500.00","$1,200.00",$600.00',
    ].join("\n");
    const out = parseSquareExport(csv, SKU_MAP);
    expect(out.matchedColumns.find((c) => c.label === "Revenue")?.header).toBe(
      "Net Sales",
    );
    expect(out.byChannel.wholesale.revenue).toBe(1200);
    expect(out.byChannel.wholesale.cogs).toBe(600);
  });

  it("uses Gross Sales only when Net Sales is absent", () => {
    const csv = [
      "Item,SKU,Qty,Gross Sales,Cost of Goods Sold",
      'Wholesale Pack,SALT-WS-100,10,"$1,500.00",$600.00',
    ].join("\n");
    const out = parseSquareExport(csv, SKU_MAP);
    expect(out.matchedColumns.find((c) => c.label === "Revenue")?.header).toBe(
      "Gross Sales",
    );
    expect(out.byChannel.wholesale.revenue).toBe(1500);
  });

  it("routes SKU prefix matches (SALT-CL-) to custom labels", () => {
    const csv = [
      "Item,SKU,Net Sales,Cost of Goods Sold",
      "Cabin Co Label,SALT-CL-CABIN,$300.00,$120.00",
      "Lodge Label,SALT-CL-LODGE,$200.00,$80.00",
    ].join("\n");
    const out = parseSquareExport(csv, SKU_MAP);
    expect(out.byChannel.customLabels.revenue).toBe(500);
    expect(out.byChannel.customLabels.cogs).toBe(200);
    expect(out.unmapped).toEqual([]);
  });

  it("routes SKU wildcard prefix matches (SALT-MK-*) to markets", () => {
    const csv = [
      "Item,SKU,Net Sales",
      "Powwow Bag,SALT-MK-PWW,$80.00",
      "Fall Fair Bag,SALT-MK-FF,$60.00",
    ].join("\n");
    const out = parseSquareExport(csv, SKU_MAP);
    expect(out.byChannel.markets.revenue).toBe(140);
    expect(out.unmapped).toEqual([]);
  });

  it("falls back to the default channel for unmapped SKUs and surfaces them", () => {
    const csv = [
      "Item,SKU,Net Sales",
      "Mystery Item,SALT-???-001,$50.00",
      "Another,SALT-???-002,$25.00",
    ].join("\n");
    const out = parseSquareExport(csv, SKU_MAP, "wholesale");
    expect(out.byChannel.wholesale.revenue).toBe(75);
    expect(out.unmapped).toEqual([
      { sku: "SALT-???-001", rows: 1, revenue: 50 },
      { sku: "SALT-???-002", rows: 1, revenue: 25 },
    ]);
  });

  it("handles accounting-style negatives like ($45.00) (refunds)", () => {
    const csv = [
      "Item,SKU,Net Sales,Cost of Goods Sold",
      'Sale,SALT-WS-100,"$1,000.00",$400.00',
      "Refund,SALT-WS-100,($45.00),($18.00)",
    ].join("\n");
    const out = parseSquareExport(csv, SKU_MAP);
    expect(out.byChannel.wholesale.revenue).toBe(955);
    expect(out.byChannel.wholesale.cogs).toBe(382);
  });

  it("multiplies Item Cost (per-unit) by Qty when COGS resolves to Item Cost", () => {
    // Only "Item Cost" present (no COGS / Cost of Goods Sold), so the
    // parser must pick it up via the cogs candidate list AND multiply by Qty.
    const csv = [
      "Item,SKU,Qty,Net Sales,Item Cost",
      'Wholesale Pack,SALT-WS-100,10,"$1,200.00",$60.00',
    ].join("\n");
    const out = parseSquareExport(csv, SKU_MAP);
    expect(out.byChannel.wholesale.cogs).toBe(600);
  });

  it("warns when expected columns are missing", () => {
    const csv = ["Item,Qty", "Mystery,10"].join("\n");
    const out = parseSquareExport(csv, SKU_MAP);
    expect(out.warnings.some((w) => /No revenue column/.test(w))).toBe(true);
    expect(out.warnings.some((w) => /No SKU column/.test(w))).toBe(true);
    expect(out.warnings.some((w) => /No COGS column/.test(w))).toBe(true);
  });

  it("returns a friendly warning when nothing is pasted", () => {
    const out = parseSquareExport("", SKU_MAP);
    expect(out.rowCount).toBe(0);
    expect(out.warnings).toEqual([
      "Nothing to parse — paste a CSV or TSV with a header row.",
    ]);
  });
});

// ───────────────────────────────────────────────────────────────────────
// Shopify
// ───────────────────────────────────────────────────────────────────────

describe("parseShopifyExport", () => {
  it("dedupes per-order shipping when only the first row carries it", () => {
    const csv = [
      "Name,Lineitem sku,Lineitem price,Lineitem quantity,Shipping",
      "#1001,SALT-DTC-001,30.00,1,12.50",
      "#1001,SALT-DTC-001,30.00,2,",
      "#1002,SALT-DTC-001,30.00,1,15.00",
    ].join("\n");
    const out = parseShopifyExport(csv, SKU_MAP);
    // Order 1001: 30 + 60 = 90, Order 1002: 30 → 120 total revenue
    expect(out.byChannel.dtcBatch.revenue).toBe(120);
    // Shipping: 12.50 (from #1001 row 1) + 15.00 (#1002) = 27.50
    expect(out.byChannel.dtcBatch.freight).toBe(27.5);
  });

  it("does not double-count shipping when a later row repeats a non-zero shipping value", () => {
    // Shopify exports sometimes put a refund-flagged first row at 0 and the
    // real shipping shows up on the next row. We should count the FIRST
    // non-zero shipping value and ignore subsequent ones for that order.
    const csv = [
      "Name,Lineitem sku,Lineitem price,Lineitem quantity,Shipping",
      "#2001,SALT-DTC-001,40.00,1,0",
      "#2001,SALT-DTC-001,40.00,1,10.00",
      "#2001,SALT-DTC-001,40.00,1,10.00",
    ].join("\n");
    const out = parseShopifyExport(csv, SKU_MAP);
    expect(out.byChannel.dtcBatch.freight).toBe(10);
  });

  it("attributes order-level shipping to the channel of the order's first line", () => {
    // First line is custom-labels (SALT-CL-), shipping should go to
    // customLabels.freight even though later lines are DTC.
    const csv = [
      "Name,Lineitem sku,Lineitem price,Lineitem quantity,Shipping",
      "#3001,SALT-CL-CABIN,50.00,1,8.00",
      "#3001,SALT-DTC-001,30.00,1,",
    ].join("\n");
    const out = parseShopifyExport(csv, SKU_MAP);
    expect(out.byChannel.customLabels.freight).toBe(8);
    expect(out.byChannel.dtcBatch.freight).toBe(0);
  });

  it("nets discounts and refunds against line-item revenue", () => {
    const csv = [
      "Name,Lineitem sku,Lineitem price,Lineitem quantity,Lineitem discount,Refunded Amount",
      "#4001,SALT-DTC-001,100.00,1,10.00,5.00",
    ].join("\n");
    const out = parseShopifyExport(csv, SKU_MAP);
    expect(out.byChannel.dtcBatch.revenue).toBe(85);
  });

  it("attributes unmapped SKUs to the default channel and lists them as unmapped", () => {
    const csv = [
      "Name,Lineitem sku,Lineitem price,Lineitem quantity",
      "#5001,UNKNOWN-001,25.00,2",
    ].join("\n");
    const out = parseShopifyExport(csv, SKU_MAP, "dtcBatch");
    expect(out.byChannel.dtcBatch.revenue).toBe(50);
    expect(out.unmapped).toEqual([{ sku: "UNKNOWN-001", rows: 1, revenue: 50 }]);
  });

  it("warns when line-item cost and shipping columns are missing", () => {
    const csv = [
      "Name,Lineitem sku,Lineitem price,Lineitem quantity",
      "#6001,SALT-DTC-001,30.00,1",
    ].join("\n");
    const out = parseShopifyExport(csv, SKU_MAP);
    expect(out.warnings.some((w) => /line-item cost column/.test(w))).toBe(true);
    expect(out.warnings.some((w) => /No shipping column/.test(w))).toBe(true);
  });

  it("imports per-line COGS when Lineitem cost is present (multiplied by qty)", () => {
    const csv = [
      "Name,Lineitem sku,Lineitem price,Lineitem quantity,Lineitem cost",
      "#7001,SALT-DTC-001,30.00,3,12.00",
    ].join("\n");
    const out = parseShopifyExport(csv, SKU_MAP);
    expect(out.byChannel.dtcBatch.revenue).toBe(90);
    expect(out.byChannel.dtcBatch.cogs).toBe(36);
  });
});

// ───────────────────────────────────────────────────────────────────────
// Shippo
// ───────────────────────────────────────────────────────────────────────

describe("parseShippoExport", () => {
  it("uses an explicit Channel column when present", () => {
    const csv = [
      "Channel,Reference 1,Cost,Insurance Cost,Packaging Cost",
      "Wholesale,SALT-WS-100,$25.00,$2.00,$1.00",
      "DTC,SALT-DTC-001,$12.50,$0,$0.50",
      "Markets,SALT-MK-PWW,$8.00,$0,$0",
    ].join("\n");
    const out = parseShippoExport(csv, SKU_MAP);
    // wholesale: cost 25 + insurance 2 = 27 freight, packaging 1
    expect(out.byChannel.wholesale.freight).toBe(27);
    expect(out.byChannel.wholesale.packaging).toBe(1);
    // dtcBatch: cost 12.50, packaging 0.50
    expect(out.byChannel.dtcBatch.freight).toBe(12.5);
    expect(out.byChannel.dtcBatch.packaging).toBe(0.5);
    // markets
    expect(out.byChannel.markets.freight).toBe(8);
  });

  it("falls back to Reference column lookup against the SKU map when Channel is empty", () => {
    const csv = [
      "Channel,Reference 1,Cost",
      ",SALT-CL-CABIN,$15.00",
      ",SALT-WS-100,$22.00",
    ].join("\n");
    const out = parseShippoExport(csv, SKU_MAP);
    expect(out.byChannel.customLabels.freight).toBe(15);
    expect(out.byChannel.wholesale.freight).toBe(22);
  });

  it("attributes unmapped References to the default channel and surfaces them", () => {
    const csv = [
      "Reference 1,Cost",
      "ORDER-9999,$11.00",
    ].join("\n");
    const out = parseShippoExport(csv, SKU_MAP, "dtcBatch");
    expect(out.byChannel.dtcBatch.freight).toBe(11);
    expect(out.unmapped).toEqual([{ sku: "ORDER-9999", rows: 1, revenue: 11 }]);
  });

  it("warns and routes everything to default when neither Channel nor Reference is present", () => {
    const csv = [
      "Tracking,Cost",
      "1Z999,$9.00",
      "1Z998,$7.00",
    ].join("\n");
    const out = parseShippoExport(csv, SKU_MAP, "dtcBatch");
    expect(out.byChannel.dtcBatch.freight).toBe(16);
    expect(
      out.warnings.some((w) => /No Channel or Reference column/.test(w)),
    ).toBe(true);
  });

  it("warns when no cost column is found", () => {
    const csv = ["Channel,Reference 1", "Wholesale,SALT-WS-100"].join("\n");
    const out = parseShippoExport(csv, SKU_MAP);
    expect(out.warnings.some((w) => /No cost column/.test(w))).toBe(true);
    expect(out.rowCount).toBe(0);
  });

  it("recognises numeric channel codes (4400.10 etc.)", () => {
    const csv = [
      "Channel,Cost",
      "4400.10,$5.00",
      "4400.20,$6.00",
      "4400.30,$7.00",
      "4400.40,$8.00",
    ].join("\n");
    const out = parseShippoExport(csv, SKU_MAP);
    expect(out.byChannel.wholesale.freight).toBe(5);
    expect(out.byChannel.customLabels.freight).toBe(6);
    expect(out.byChannel.dtcBatch.freight).toBe(7);
    expect(out.byChannel.markets.freight).toBe(8);
  });
});

// ───────────────────────────────────────────────────────────────────────
// Timesheet
// ───────────────────────────────────────────────────────────────────────

describe("parseTimesheet", () => {
  it("sums an Hours column with no cost-code filter", () => {
    const csv = ["Date,Hours", "2026-04-01,8", "2026-04-02,6.5"].join("\n");
    const out = parseTimesheet(csv);
    expect(out.hours).toBe(14.5);
    expect(out.rowCount).toBe(2);
    expect(out.warnings.some((w) => /No cost-code column/.test(w))).toBe(true);
  });

  it("filters non-SALT rows when a Cost Code column is present", () => {
    const csv = [
      "Date,Hours,Cost Code",
      "2026-04-01,8,SALT-01",
      "2026-04-02,4,Other",
      "2026-04-03,2,salt",
    ].join("\n");
    const out = parseTimesheet(csv);
    expect(out.hours).toBe(10);
    expect(out.rowCount).toBe(2);
    expect(
      out.warnings.some((w) => /1 non-SALT row filtered out/.test(w)),
    ).toBe(true);
  });

  it("falls back to summing bare numeric tokens when there's no Hours column", () => {
    const csv = "8\n6.5\n4\n";
    const out = parseTimesheet(csv);
    expect(out.hours).toBe(18.5);
    expect(out.rowCount).toBe(3);
    expect(
      out.warnings.some((w) => /Summed bare numeric tokens/.test(w)),
    ).toBe(true);
  });

  it("handles bare numbers separated by commas/whitespace/semicolons", () => {
    const csv = "8, 6.5; 4\n2";
    const out = parseTimesheet(csv);
    expect(out.hours).toBe(20.5);
    expect(out.rowCount).toBe(4);
  });

  it("warns when the input is empty or unparseable", () => {
    expect(parseTimesheet("").warnings).toEqual(["Nothing to parse."]);
    const out = parseTimesheet("alpha\nbeta\n");
    expect(out.hours).toBe(0);
    expect(out.warnings.some((w) => /Couldn't find/.test(w))).toBe(true);
  });
});

/**
 * Shared "Deer Lake demo" sample dataset for the three public embed
 * routes (/embed/open-records, /embed/daily-close, /embed/month-end).
 *
 * Hand-tuned to tell one coherent week-and-month story for the
 * walkthrough's bookkeeping proof: a small store with a few sales
 * days, some spoilage, payroll, a bank deposit, and a clean
 * month-end. No PII, no live numbers, no real bank data.
 *
 * Keep this file small and obviously demo-flavored. Every screen
 * built on this data wears a "Sample · Deer Lake demo" badge so a
 * councillor reading the walkthrough never confuses these numbers
 * for the real ones.
 */

export type SampleAccountType =
  | "revenue"
  | "cost_of_goods"
  | "expense"
  | "asset"
  | "liability";

export interface SampleAccount {
  code: string;
  name: string;
  type: SampleAccountType;
}

export interface SampleCostCentre {
  code: string;
  name: string;
  blurb: string;
}

export interface SampleTransaction {
  /** ISO date, e.g. "2026-04-21" */
  date: string;
  description: string;
  /** Cost centre code, e.g. "DL-STORE" */
  costCentreCode: string;
  /** Account code, e.g. "4000" */
  accountCode: string;
  /** Positive = revenue/inflow, negative = cost/outflow, in CAD */
  amount: number;
  /** Marker the operator couple sets at end-of-day. */
  source: "till" | "bank" | "payroll" | "ap" | "adjust";
}

export interface SampleVariance {
  costCentreCode: string;
  line: string;
  budgeted: number;
  actual: number;
  note: string;
}

export interface SampleDataset {
  /** Display label that appears on every embed screen. */
  brand: string;
  /** Period the demo describes, e.g. "April 2026". */
  period: string;
  /** Closing day for the daily-close embed, e.g. "Tuesday, April 28, 2026". */
  closingDay: string;
  accounts: SampleAccount[];
  costCentres: SampleCostCentre[];
  transactions: SampleTransaction[];
  /** End-of-day cash drawer numbers for the daily-close embed. */
  dailyClose: {
    openingFloat: number;
    cashSales: number;
    cashRefunds: number;
    expectedDrawer: number;
    countedDrawer: number;
    depositToBank: number;
    floatRetained: number;
    /** Items the operator couple kicks to the bookkeeper. */
    kickedToBookkeeper: Array<{ note: string; amount: number }>;
  };
  /** Variances surfaced on the month-end pack. */
  variances: SampleVariance[];
  /** Sign-off line at the foot of the month-end pack. */
  signOff: {
    preparedBy: string;
    presentedTo: string;
    line: string;
  };
}

export const SAMPLE: SampleDataset = {
  brand: "Sample · Deer Lake demo",
  period: "April 2026",
  closingDay: "Tuesday, April 28, 2026",

  accounts: [
    { code: "4000", name: "Grocery sales", type: "revenue" },
    { code: "4100", name: "Produce sales", type: "revenue" },
    { code: "5000", name: "Cost of goods sold", type: "cost_of_goods" },
    { code: "5100", name: "Spoilage & shrink", type: "cost_of_goods" },
    { code: "6100", name: "Payroll", type: "expense" },
    { code: "6200", name: "Freight in", type: "expense" },
    { code: "6300", name: "Utilities", type: "expense" },
    { code: "1010", name: "Operating bank", type: "asset" },
    { code: "1020", name: "Cash drawer", type: "asset" },
  ],

  costCentres: [
    {
      code: "DL-STORE",
      name: "Deer Lake store",
      blurb: "Day-to-day grocery store operations.",
    },
    {
      code: "DL-COLD",
      name: "Cold-chain route",
      blurb: "Truck route Thunder Bay → Sioux Lookout → Dryden → Deer Lake.",
    },
    {
      code: "DL-TRAIN",
      name: "Staff training",
      blurb: "Weekly cross-training and food-handler certification.",
    },
  ],

  transactions: [
    // Week 1
    { date: "2026-04-06", description: "Opening sales · Monday", costCentreCode: "DL-STORE", accountCode: "4000", amount: 4_820.15, source: "till" },
    { date: "2026-04-06", description: "Bank deposit · Monday close", costCentreCode: "DL-STORE", accountCode: "1010", amount: 4_500.00, source: "bank" },
    { date: "2026-04-07", description: "Produce delivery · cost", costCentreCode: "DL-STORE", accountCode: "5000", amount: -2_140.00, source: "ap" },
    { date: "2026-04-08", description: "Spoiled milk write-off", costCentreCode: "DL-STORE", accountCode: "5100", amount: -86.40, source: "adjust" },
    { date: "2026-04-10", description: "Friday sales", costCentreCode: "DL-STORE", accountCode: "4000", amount: 6_310.55, source: "till" },
    // Week 2
    { date: "2026-04-13", description: "Cold-chain freight · winter road", costCentreCode: "DL-COLD", accountCode: "6200", amount: -1_280.00, source: "ap" },
    { date: "2026-04-15", description: "Bi-weekly payroll", costCentreCode: "DL-STORE", accountCode: "6100", amount: -7_840.00, source: "payroll" },
    { date: "2026-04-15", description: "Trainer pay · cross-training day", costCentreCode: "DL-TRAIN", accountCode: "6100", amount: -640.00, source: "payroll" },
    { date: "2026-04-17", description: "Friday sales", costCentreCode: "DL-STORE", accountCode: "4000", amount: 5_980.40, source: "till" },
    // Week 3
    { date: "2026-04-20", description: "Produce sales · weekend", costCentreCode: "DL-STORE", accountCode: "4100", amount: 1_240.20, source: "till" },
    { date: "2026-04-22", description: "Hydro bill", costCentreCode: "DL-STORE", accountCode: "6300", amount: -612.18, source: "ap" },
    { date: "2026-04-24", description: "Friday sales", costCentreCode: "DL-STORE", accountCode: "4000", amount: 6_104.85, source: "till" },
    // Week 4 — closing day
    { date: "2026-04-27", description: "Monday sales", costCentreCode: "DL-STORE", accountCode: "4000", amount: 4_410.65, source: "till" },
    { date: "2026-04-28", description: "Tuesday sales", costCentreCode: "DL-STORE", accountCode: "4000", amount: 5_220.30, source: "till" },
    { date: "2026-04-28", description: "Bank deposit · Tuesday close", costCentreCode: "DL-STORE", accountCode: "1010", amount: 5_000.00, source: "bank" },
  ],

  dailyClose: {
    openingFloat: 300.00,
    cashSales: 5_220.30,
    cashRefunds: -18.45,
    expectedDrawer: 5_501.85,
    countedDrawer: 5_499.10,
    depositToBank: 5_000.00,
    floatRetained: 300.00,
    kickedToBookkeeper: [
      { note: "Wholesaler invoice — needs PO match before posting", amount: -1_864.20 },
      { note: "Customer card chargeback — review next morning", amount: -42.10 },
    ],
  },

  variances: [
    {
      costCentreCode: "DL-STORE",
      line: "Spoilage & shrink",
      budgeted: -150.00,
      actual: -86.40,
      note: "Cooler held temp through the weekend; under budget.",
    },
    {
      costCentreCode: "DL-COLD",
      line: "Cold-chain freight",
      budgeted: -1_000.00,
      actual: -1_280.00,
      note: "One extra winter-road run; planned overrun.",
    },
    {
      costCentreCode: "DL-TRAIN",
      line: "Trainer pay",
      budgeted: -800.00,
      actual: -640.00,
      note: "One trainer shift moved to next month.",
    },
  ],

  signOff: {
    preparedBy: "Headwaters bookkeeper",
    presentedTo: "Deer Lake Band Council",
    line: "Reviewed and signed by the band's appointed reviewer at the monthly council meeting.",
  },
};

/** CAD currency formatter shared across the embeds. */
export function formatCAD(n: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n);
}

/** Sum a subset of transactions. */
export function sumAmounts(rows: SampleTransaction[]): number {
  return rows.reduce((acc, r) => acc + r.amount, 0);
}

/** Group totals by cost-centre code, signed (revenue minus costs). */
export function netByCostCentre(
  rows: SampleTransaction[],
): Array<{ costCentreCode: string; revenue: number; costs: number; net: number }> {
  const map = new Map<string, { revenue: number; costs: number }>();
  for (const r of rows) {
    const slot = map.get(r.costCentreCode) ?? { revenue: 0, costs: 0 };
    if (r.source === "bank") {
      // bank-deposit lines are cash movements, not P&L
      map.set(r.costCentreCode, slot);
      continue;
    }
    if (r.amount >= 0) slot.revenue += r.amount;
    else slot.costs += r.amount;
    map.set(r.costCentreCode, slot);
  }
  return Array.from(map.entries()).map(([costCentreCode, v]) => ({
    costCentreCode,
    revenue: v.revenue,
    costs: v.costs,
    net: v.revenue + v.costs,
  }));
}

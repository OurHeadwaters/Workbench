export type StatusTag = "confirmed" | "estimated" | "pending-qb";

export interface LineItem {
  description: string;
  amount: number | null;
  sourceOrNote: string;
  status: StatusTag;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  items: LineItem[];
}

export const ownerReconciliationSections: Section[] = [
  {
    id: "went-in",
    title: "What went in — Parrs Jars sole proprietor era (pre-Nov 2024)",
    subtitle:
      "Capital and costs contributed by the owner before Headwaters (Ontario Corp) took over operations.",
    items: [
      {
        description: "Line of credit — total charges (chart of accounts)",
        amount: 26337.0,
        sourceOrNote: "Chart of accounts — estimated pending QuickBooks Transaction Detail by Account export",
        status: "estimated",
      },
      {
        description: "Personal funds advanced outside line of credit",
        amount: null,
        sourceOrNote: "Pending QB export — Balance Sheet Oct 31, 2024",
        status: "pending-qb",
      },
      {
        description: "Equipment contributed (pre-transfer fair-market value)",
        amount: null,
        sourceOrNote: "Pending QB export — Balance Sheet Oct 31, 2024",
        status: "pending-qb",
      },
      {
        description: "Owner time / sweat equity (not monetised in books)",
        amount: null,
        sourceOrNote: "Not recorded — memo item only",
        status: "estimated",
      },
      {
        description: "P&L net loss — sole-prop operating period",
        amount: null,
        sourceOrNote: "Pending QB export — P&L sole-prop period",
        status: "pending-qb",
      },
    ],
  },
  {
    id: "came-out",
    title: "What came back out — Invoice #001056 (807 Food Co-op purchase)",
    subtitle:
      "Equipment sold to the co-op. Invoice #001056 paid in full June 19, 2025 via bank draft.",
    items: [
      {
        description: "Trailer (main unit)",
        amount: 17950.0,
        sourceOrNote: "Invoice #001056 — line 1 · paid June 19, 2025 bank draft",
        status: "confirmed",
      },
      {
        description: "Trailer upgrades",
        amount: 9995.0,
        sourceOrNote: "Invoice #001056 — line 2 · NOTE: received but not yet delivered — liability to co-op (see Outstanding section)",
        status: "confirmed",
      },
      {
        description: "Canning supplies",
        amount: 2500.0,
        sourceOrNote: "Invoice #001056 — line 3 · paid June 19, 2025 bank draft",
        status: "confirmed",
      },
      {
        description: "HST collected on invoice",
        amount: 3957.85,
        sourceOrNote: "Invoice #001056 — 13% HST on $30,445 subtotal",
        status: "confirmed",
      },
      {
        description: "Invoice #001056 — total received",
        amount: 34402.85,
        sourceOrNote: "Paid in full June 19, 2025 · bank draft",
        status: "confirmed",
      },
    ],
  },
  {
    id: "outstanding",
    title: "Outstanding / in-dispute",
    subtitle:
      "Items not yet settled or still requiring QuickBooks confirmation before the net figure is final.",
    items: [
      {
        description: "Trailer upgrades — received but not yet delivered to the co-op",
        amount: 9995.0,
        sourceOrNote: "Flagged as liability: goods paid for but delivery pending. Co-op holds a claim on this amount until delivered.",
        status: "confirmed",
      },
      {
        description: "Net co-op owes owner (excluding pending QB items)",
        amount: null,
        sourceOrNote: "Cannot be calculated until pending QB exports fill in sole-prop line-of-credit and P&L totals",
        status: "pending-qb",
      },
      {
        description: "Customer balance — 807 Food Co-op (any prior receivable)",
        amount: null,
        sourceOrNote: "Pending QB export — Customer Balance Detail for 807 Food Co-op",
        status: "pending-qb",
      },
      {
        description: "HST remittance / refund owing to CRA for sole-prop period",
        amount: null,
        sourceOrNote: "Pending QB export — P&L sole-prop period",
        status: "pending-qb",
      },
    ],
  },
];

export interface QuickBooksReport {
  id: string;
  name: string;
  dateRange: string;
  purpose: string;
}

export const quickBooksReportsNeeded: QuickBooksReport[] = [
  {
    id: "qb-1",
    name: "Balance Sheet",
    dateRange: "As of Oct 31, 2024",
    purpose:
      "Confirms personal funds advanced, equipment value, and any other assets / liabilities at the point of transition to the co-op.",
  },
  {
    id: "qb-2",
    name: "Transaction Detail by Account",
    dateRange: "Sole-prop operating period (full history to Oct 31, 2024)",
    purpose:
      "Verifies the exact line-of-credit draw total (~$26,337 estimated) and catches any charges not yet reconciled.",
  },
  {
    id: "qb-3",
    name: "Profit & Loss",
    dateRange: "Sole-prop period (full history to Oct 31, 2024)",
    purpose:
      "Establishes the net operating result of Parrs Jars before transition, and identifies any HST refund or remittance owing to CRA.",
  },
  {
    id: "qb-4",
    name: "Customer Balance Detail — 807 Food Co-op",
    dateRange: "All dates",
    purpose:
      "Shows any prior receivables or credits the co-op held before Invoice #001056 was issued, which may reduce the net owed figure.",
  },
];

export const INVOICE_GROSS_RECEIVED = 34402.85;
export const INVOICE_HST = 3957.85;
export const INVOICE_UPGRADE_LIABILITY = 9995.0;
export const NET_CASH_AFTER_LIABILITIES =
  INVOICE_GROSS_RECEIVED - INVOICE_HST - INVOICE_UPGRADE_LIABILITY;
export const CONFIRMED_OUT_TOTAL = INVOICE_GROSS_RECEIVED;
export const ESTIMATED_IN_TOTAL = 26337.0;

export interface ChangelogEntry {
  date: string;
  description: string;
}

export const changelogEntries: ChangelogEntry[] = [
  {
    date: "2026-05-03",
    description:
      "Invoice #001056 confirmed paid — status updated from Estimated to Confirmed across all four line items (trailer, upgrades, canning supplies, HST). Payment had been received June 19, 2025 via bank draft; now recorded as Confirmed in the reconciliation.",
  },
  {
    date: "2026-05-03",
    description:
      "Trailer upgrades ($9,995) flagged as outstanding liability — goods paid for on Invoice #001056 but not yet delivered to the co-op. Added to Outstanding / in-dispute section.",
  },
  {
    date: "2026-05-03",
    description:
      "Summary callout added showing net cash applied to owner reimbursement ($20,450.00) after HST and upgrade liability deductions.",
  },
  {
    date: "2026-05-03",
    description:
      "Initial reconciliation page created. Line-of-credit total (~$26,337) marked Estimated pending Transaction Detail by Account export from QuickBooks. Personal funds advanced, equipment value, and P&L loss remain Pending QB.",
  },
];

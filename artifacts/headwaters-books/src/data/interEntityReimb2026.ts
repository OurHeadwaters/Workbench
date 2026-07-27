// ── Inter-entity reimbursement — Sole Prop → Headwaters Ontario Corp, 2026 ─────
// Invoice REPLIT-DIGITAL-REIMB-2026-001 · Dated 27 July 2026
// Period: 17 April 2026 – 26 June 2026
//
// Source of truth: Alterna Savings credit-card statements (CAD figures).
// USD Replit invoices used for reference only.
// Model matches ownerReconciliation.ts so future months can be added here.

export type ReimbStatus = "confirmed" | "estimated" | "pending";

// ── Invoice constants ──────────────────────────────────────────────────────────

export const INVOICE_NUMBER = "REPLIT-DIGITAL-REIMB-2026-001";
export const INVOICE_DATE = "2026-07-27";
export const INVOICE_PERIOD = "17 April 2026 – 26 June 2026";

export const REPLIT_PRINCIPAL = 20_163.05;
export const REPLIT_FX_FEES = 479.27;
export const REPLIT_SUBTOTAL = REPLIT_PRINCIPAL + REPLIT_FX_FEES; // 20,642.32

export const GODADDY_DOMAINS = 419.0;
export const RUNWAY_ML = 129.92;
export const X_CORP_DEV = 30.0;
export const OTHER_DIGITAL = 275.16;
export const OTHER_DIGITAL_SUBTOTAL =
  GODADDY_DOMAINS + RUNWAY_ML + X_CORP_DEV + OTHER_DIGITAL; // 854.08

export const INVOICE_TOTAL = REPLIT_SUBTOTAL + OTHER_DIGITAL_SUBTOTAL; // 21,496.40

// ── Invoice line-item groups ───────────────────────────────────────────────────

export interface InvoiceLineItem {
  description: string;
  amount: number;
  note: string;
  status: ReimbStatus;
}

export interface InvoiceGroup {
  id: string;
  title: string;
  subtitle: string;
  items: InvoiceLineItem[];
  subtotal: number;
}

export const invoiceGroups: InvoiceGroup[] = [
  {
    id: "replit",
    title: "Replit Development Platform",
    subtitle:
      'All "REPLIT, INC. REPLIT.COM CA" lines + matching "FOREIGN TRANSACTION FEE \u2013 MERCHANDISE" lines \u2014 Apr 17 \u2013 Jun 26 2026',
    items: [
      {
        description: "Replit principal charges",
        amount: REPLIT_PRINCIPAL,
        note:
          "116 charges from Alterna statements — Apr–Jun 2026. CAD card amounts are source of truth, not USD Replit invoices (RZSJOV- series).",
        status: "confirmed",
      },
      {
        description: "Replit-related foreign transaction fees",
        amount: REPLIT_FX_FEES,
        note:
          'All "FOREIGN TRANSACTION FEE \u2013 MERCHANDISE" lines tied to the Replit periods. FX fees travel with the underlying expense.',
        status: "confirmed",
      },
    ],
    subtotal: REPLIT_SUBTOTAL,
  },
  {
    id: "other-digital",
    title: "Other Digital Tooling & Domains",
    subtitle: "Remaining Apr–Jun 2026 corporate digital development costs after removing sole-prop items",
    items: [
      {
        description: "GoDaddy domains",
        amount: GODADDY_DOMAINS,
        note: "Multiple domain-related charges — approx. figure pending final statement reconciliation.",
        status: "estimated",
      },
      {
        description: "Runway ML — AI tooling",
        amount: RUNWAY_ML,
        note: "Explicitly corporate — AI/ML tooling for Corp projects.",
        status: "confirmed",
      },
      {
        description: "X Corp / about.x.com developer tools",
        amount: X_CORP_DEV,
        note: "Developer-tier subscription used for Corp digital infrastructure.",
        status: "confirmed",
      },
      {
        description: "Other clear digital infrastructure / tooling",
        amount: OTHER_DIGITAL,
        note:
          "Remaining digital charges after Square, Apple, and all physical/food items removed. Approx. figure pending final review.",
        status: "estimated",
      },
    ],
    subtotal: OTHER_DIGITAL_SUBTOTAL,
  },
];

// ── Entity flow strip ──────────────────────────────────────────────────────────

export interface FlowStep {
  id: string;
  label: string;
  sublabel?: string;
}

export const entityFlowSteps: FlowStep[] = [
  { id: "card", label: "Personal card charged", sublabel: "Alterna Savings LOC — sole prop" },
  { id: "sole-prop", label: "Sole prop books", sublabel: "Expense recorded / clearing entry" },
  { id: "invoice", label: "Invoice REPLIT-DIGITAL-REIMB-2026-001", sublabel: "$21,496.40 CAD · 27 Jul 2026" },
  { id: "corp", label: "Corp books", sublabel: "Dr Software Dev Expense · Cr Due to Sole Prop" },
  { id: "corp-loc", label: "Corp LOC repays sole prop", sublabel: "Corporate LOC clears the invoice" },
  { id: "personal-loc", label: "Personal LOC retired", sublabel: "Inter-entity balance zeroed" },
];

// ── Corp vs. Sole Prop classification table ────────────────────────────────────

export type ClassificationEntity = "corp" | "sole-prop";

export interface ClassificationRow {
  category: string;
  amount: number | null;
  amountNote?: string;
  entity: ClassificationEntity;
  reason: string;
  status: ReimbStatus;
}

export const classificationRows: ClassificationRow[] = [
  {
    category: "Replit principal charges",
    amount: REPLIT_PRINCIPAL,
    entity: "corp",
    reason: "Digital development platform — exclusively Corp projects",
    status: "confirmed",
  },
  {
    category: "Replit FX fees",
    amount: REPLIT_FX_FEES,
    entity: "corp",
    reason: "FX fees travel with the underlying Corp expense",
    status: "confirmed",
  },
  {
    category: "GoDaddy domains",
    amount: GODADDY_DOMAINS,
    amountNote: "~",
    entity: "corp",
    reason: "Corporate domain registrations for Corp projects",
    status: "estimated",
  },
  {
    category: "Runway ML (AI tooling)",
    amount: RUNWAY_ML,
    entity: "corp",
    reason: "Explicitly Corp — AI/ML tooling for Corp digital development",
    status: "confirmed",
  },
  {
    category: "X Corp / developer tools",
    amount: X_CORP_DEV,
    entity: "corp",
    reason: "Developer-tier subscription — Corp digital infrastructure",
    status: "confirmed",
  },
  {
    category: "Other digital infrastructure",
    amount: OTHER_DIGITAL,
    amountNote: "~",
    entity: "corp",
    reason: "Remaining digital charges after sole-prop items removed",
    status: "estimated",
  },
  {
    category: "Square (Square Paid Services)",
    amount: null,
    entity: "sole-prop",
    reason: "Explicitly sole-prop activity — not invoiced to Corp",
    status: "confirmed",
  },
  {
    category: "Apple.com / App Store / iCloud",
    amount: null,
    entity: "sole-prop",
    reason: "Recurring personal/business subscriptions belonging to sole prop",
    status: "confirmed",
  },
  {
    category: "Food-related, jars, physical supplies, Uline, Vistaprint physical",
    amount: null,
    entity: "sole-prop",
    reason: "Explicitly excluded — not digital development costs",
    status: "confirmed",
  },
];

// ── Journal entries ────────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  entity: "sole-prop" | "corp";
  label: string;
  description: string;
  lines: { side: "debit" | "credit"; account: string; amount: number | string }[];
  note: string;
}

export const journalEntries: JournalEntry[] = [
  {
    id: "sole-prop-entry",
    entity: "sole-prop",
    label: "Sole Proprietorship — on invoice",
    description: "Record the receivable from Corp when invoice is issued",
    lines: [
      { side: "debit", account: "Due from Corporation (A/R Intercompany)", amount: INVOICE_TOTAL },
      { side: "credit", account: "Expense Clearing / Credit-card liability", amount: INVOICE_TOTAL },
    ],
    note:
      "Or reduce the original expense accounts if costs were temporarily coded to sole prop. Either way, the net effect is a receivable owed by Corp to sole prop.",
  },
  {
    id: "corp-entry",
    entity: "corp",
    label: "Headwaters Ontario Corp — on invoice",
    description: "Record the payable to sole prop when invoice is received",
    lines: [
      { side: "debit", account: "Software Development / Digital Tools Expense", amount: INVOICE_TOTAL },
      { side: "credit", account: "Due to Sole Proprietor (A/P Intercompany)", amount: INVOICE_TOTAL },
    ],
    note:
      "All amounts are CAD (from the card statements). This clears when the corporate LOC pays the sole prop.",
  },
  {
    id: "clearing-entry",
    entity: "corp",
    label: "Clearing entry — when Corp pays",
    description: "Clear the intercompany balances on both sides when Corp LOC settles",
    lines: [
      { side: "debit", account: "Due to Sole Proprietor (A/P Intercompany)", amount: INVOICE_TOTAL },
      { side: "credit", account: "Cash / Bank (Corp LOC disbursement)", amount: INVOICE_TOTAL },
    ],
    note: "Simultaneously, sole prop: Dr Cash / Cr Due from Corporation — both intercompany balances zero out.",
  },
];

// ── Sole-prop Jan–Jul 2026 cleanup checklist ──────────────────────────────────

export type ChecklistStatus = "confirmed" | "pending" | "not-started";

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
  status: ChecklistStatus;
}

export const solePropCleanupChecklist: ChecklistItem[] = [
  {
    id: "apr-jun-replit",
    title: "Apr–Jun 2026 Replit + digital costs",
    detail: `Confirmed: $${INVOICE_TOTAL.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD — covered by Invoice REPLIT-DIGITAL-REIMB-2026-001`,
    status: "confirmed",
  },
  {
    id: "jul-2026",
    title: "Jul 2026 statement",
    detail:
      "Not yet available. When the Jul 2026 Alterna statement is in hand, apply the same method: pull all REPLIT.COM, GoDaddy, Runway, X Corp lines and total CAD charges. Issue a supplemental invoice or add as a second line group.",
    status: "pending",
  },
  {
    id: "jan-mar-2026",
    title: "Jan–Mar 2026 statements (if applicable)",
    detail:
      "Confirm whether digital development costs were incurred on the sole-prop card before Apr 17, 2026. If yes, apply the same extraction method and extend the invoice period.",
    status: "pending",
  },
  {
    id: "bank-reconstruction",
    title: "Bank account mixing reconstruction",
    detail:
      "The sole-prop bank account switched to Corp during this period. This is a separate task — not covered by this invoice, which addresses only the Alterna credit-card digital development costs.",
    status: "not-started",
  },
  {
    id: "square-apple-sole-prop",
    title: "Square, Apple, physical supply items",
    detail:
      "Confirmed as sole-prop costs — excluded from this invoice. Record in sole-prop books as operating expenses.",
    status: "confirmed",
  },
];

// ── QuickBooks to-do ───────────────────────────────────────────────────────────

export interface QBReport2026 {
  id: string;
  name: string;
  dateRange: string;
  purpose: string;
}

export const qbReports2026: QBReport2026[] = [
  {
    id: "qb-2026-1",
    name: "Transaction Detail by Account",
    dateRange: "Jan 1 – Jul 31, 2026 (sole prop books)",
    purpose:
      "Verify all sole-prop credit-card transactions are coded; confirm no Corp digital costs remain mis-coded to sole prop after the intercompany invoice clears.",
  },
  {
    id: "qb-2026-2",
    name: "Profit & Loss",
    dateRange: "Jan 1 – Jul 31, 2026 (sole prop + Corp separately)",
    purpose:
      "Confirm the digital development expense lands in Corp books, not sole-prop P&L, after the intercompany entry posts.",
  },
  {
    id: "qb-2026-3",
    name: "Credit Card Reconciliation — Alterna",
    dateRange: "Apr 17 – Jun 26, 2026",
    purpose:
      "Match every line in this invoice against the Alterna statement to confirm no charges were missed or double-counted.",
  },
  {
    id: "qb-2026-4",
    name: "Open A/R — Due from Corporation (sole prop)",
    dateRange: "As of invoice date, 27 Jul 2026",
    purpose:
      "Confirm $21,496.40 shows as an open receivable in sole-prop books until the Corp LOC payment clears it.",
  },
  {
    id: "qb-2026-5",
    name: "Open A/P — Due to Sole Proprietor (Corp)",
    dateRange: "As of invoice date, 27 Jul 2026",
    purpose:
      "Confirm $21,496.40 shows as an open payable in Corp books until the Corp LOC disbursement clears it.",
  },
];

// ── Bookkeeper notes ───────────────────────────────────────────────────────────

export interface BookkeeperNote {
  id: string;
  heading: string;
  body: string;
}

export const bookkeeperNotes: BookkeeperNote[] = [
  {
    id: "cad-source-of-truth",
    heading: "CAD card amounts are the source of truth",
    body:
      "Use the CAD amounts from the Alterna Savings credit-card statements — not the USD Replit invoices (RZSJOV- series). The USD invoices are for reference only; the card CAD figures are what actually hit the sole-prop books.",
  },
  {
    id: "fx-fees-travel",
    heading: "FX fees travel with the underlying expense",
    body:
      "Foreign transaction fees on the Alterna card are legitimate business costs and belong to the same expense category as the charge they relate to. They are included in the Replit subtotal and in this invoice.",
  },
  {
    id: "future-months",
    heading: "Jul 2026 and earlier months — same method",
    body:
      "When additional statements are available, apply the same extraction: pull all REPLIT.COM, GoDaddy, Runway ML, X Corp, and other clear digital lines; total the CAD amounts; issue a supplemental invoice or extend the period. Do not use USD Replit invoice amounts.",
  },
  {
    id: "bank-mixing-separate",
    heading: "Bank account mixing is a separate reconstruction task",
    body:
      "The sole-prop bank account switched to Corp during this period. That reconstruction is tracked separately and is NOT covered by Invoice REPLIT-DIGITAL-REIMB-2026-001, which addresses only the Alterna credit-card digital development costs.",
  },
  {
    id: "distinct-from-reconciliation",
    heading: "Distinct from the existing Owner Reconciliation page",
    body:
      "The existing Reconciliation page covers the pre-Nov 2024 Parrs Jars equipment era (sole prop → 807 Food Co-op invoices). This page covers the Apr–Jun 2026 digital development costs paid on the personal card on behalf of Corp. The two are separate inter-entity situations with different instruments.",
  },
];

// ── Execution tracker ──────────────────────────────────────────────────────────
// Three phases: corp cleanup → LOC + invoice → sole prop bridge.
// Update statuses here as each step completes.

export type ExecStatus = "done" | "in-progress" | "pending" | "blocked";

export interface ExecStep {
  id: string;
  label: string;
  detail: string;
  status: ExecStatus;
  date?: string;       // ISO date when completed, e.g. "2026-07-31"
  amount?: number;     // if a dollar amount is relevant to the step
  amountNote?: string; // qualifier like "minimum estimate"
}

export interface ExecPhase {
  id: string;
  phase: string;
  title: string;
  steps: ExecStep[];
}

export const executionTracker: ExecPhase[] = [
  {
    id: "corp-cleanup",
    phase: "Phase 1",
    title: "Corp account — confirm what's still in there",
    steps: [
      {
        id: "corp-statement",
        label: "Obtain Headwaters Ontario Corp bank statement",
        detail:
          "Full statement from Jul 2025 to now. Need to confirm exactly what went in (Invoice #001057 proceeds + any others) and what remains after the May 7 $12,757.14 transfer back to the Parrs Jars account.",
        status: "pending",
      },
      {
        id: "corp-balance-confirm",
        label: "Confirm remaining sole-prop balance in corp",
        detail:
          "Current estimate: $17,967 in (Invoice #001057) − $12,757.14 already transferred back = $5,209.86 minimum still in corp. Could be $7,695.86 if Invoice #001062 ($2,486) also landed there. Corp bank statement will confirm.",
        status: "pending",
        amount: 5_209.86,
        amountNote: "min. estimate — ",
      },
      {
        id: "corp-transfer-back",
        label: "Transfer remaining sole-prop funds out of corp",
        detail:
          "Transfer the confirmed balance from the Headwaters Ontario Corp account to Bobbie's personal account. Corp books: Dr Shareholder Contributed Capital / Cr Cash. This is a return of the capital contribution — not a dividend or salary.",
        status: "pending",
      },
    ],
  },
  {
    id: "loc-invoice",
    phase: "Phase 2",
    title: "LOC approval + invoice settlement",
    steps: [
      {
        id: "invoice-drafted",
        label: "Invoice REPLIT-DIGITAL-REIMB-2026-001 drafted",
        detail:
          "$21,496.40 CAD — Apr 17 – Jun 26 2026. Digital development costs (Replit, GoDaddy, Runway ML, X Corp) paid on the sole-prop Alterna card on behalf of the Corp.",
        status: "done",
        date: "2026-07-27",
        amount: 21_496.40,
      },
      {
        id: "loc-applied",
        label: "Corporate LOC application submitted",
        detail:
          "Application in progress with lender. LOC will fund corp operations and settle the reimbursement invoice. Confirm lender and application date when known.",
        status: "in-progress",
      },
      {
        id: "loc-approved",
        label: "Corporate LOC approved",
        detail:
          "Once approved, draw is authorized. Corp books on draw: Dr Cash / Cr Line of Credit. Record the approved limit and draw terms.",
        status: "pending",
      },
      {
        id: "loc-drawn",
        label: "Corp draws on LOC",
        detail:
          "Draw amount to cover Invoice REPLIT-DIGITAL-REIMB-2026-001 ($21,496.40) plus operating float. Corp account now has cash to settle the payable.",
        status: "pending",
      },
      {
        id: "invoice-paid",
        label: "Corp pays Invoice REPLIT-DIGITAL-REIMB-2026-001",
        detail:
          "$21,496.40 transferred from corp account to Bobbie's personal account (or new sole-prop account if already open). Corp: Dr Due to Sole Proprietor / Cr Cash. Sole prop: Dr Cash / Cr Due from Corporation. Both intercompany balances zero out.",
        status: "pending",
        amount: 21_496.40,
      },
      {
        id: "interco-zeroed",
        label: "Intercompany balances confirmed at $0",
        detail:
          "Bookkeeper confirms: $0 in Due from Corporation (sole-prop A/R) and $0 in Due to Sole Proprietor (corp A/P). Personal LOC that carried the digital costs is now retired.",
        status: "pending",
      },
    ],
  },
  {
    id: "sole-prop-bridge",
    phase: "Phase 3",
    title: "Sole prop account transition",
    steps: [
      {
        id: "alterna-last-day",
        label: "Alterna account 446570 — last day Jul 31, 2026",
        detail:
          "No transactions to be put through this account after July 31. Confirm current balance and transfer any remaining float to personal account.",
        status: "in-progress",
      },
      {
        id: "jul-statement",
        label: "Final July 2026 Alterna statement obtained",
        detail:
          "Get the closing statement for the full month of July. Reconcile to zero or to the transferred-out balance. Bookkeeper needs this to close the bank account in the sole-prop books.",
        status: "pending",
      },
      {
        id: "personal-bridge-tracking",
        label: "Sole-prop transactions tracked through personal account",
        detail:
          "Aug 1 onward: log every sole-prop income and expense going through the personal account — date, vendor/customer, amount, category. A running note or spreadsheet is enough. Bookkeeper needs this list to code entries correctly without hunting through mixed personal statements.",
        status: "pending",
      },
      {
        id: "new-account-opened",
        label: "New dedicated sole-prop account opened",
        detail:
          "Date TBD. Once open, route all new sole-prop activity here immediately. Confirm account details (institution, account number) and record opening balance.",
        status: "pending",
      },
      {
        id: "cutover-entry",
        label: "Cutover journal entry recorded",
        detail:
          "Bookkeeper records the clean cutover: Dr New Sole-Prop Bank / Cr Personal Account (for any float transferred in). Opening balance of new account confirmed and reconciled.",
        status: "pending",
      },
    ],
  },
];

// ── Change log ─────────────────────────────────────────────────────────────────

export interface ReimbChangelogEntry {
  date: string;
  description: string;
}

export const reimbChangelogEntries: ReimbChangelogEntry[] = [
  {
    date: "2026-07-27",
    description:
      "Invoice REPLIT-DIGITAL-REIMB-2026-001 created. Amounts confirmed from two rounds of analysis of Alterna Savings credit-card statements (Apr 17 – Jun 26 2026). Replit principal $20,163.05 + FX fees $479.27 + other digital $854.08 = total $21,496.40 CAD. GoDaddy (~$419) and Other digital (~$275.16) marked Estimated pending final statement reconciliation.",
  },
  {
    date: "2026-07-27",
    description:
      "Corp vs. sole-prop classification confirmed: Square, Apple/App Store/iCloud, and all physical/food items stay with sole prop and are excluded from this invoice. Digital development costs (Replit, GoDaddy, Runway ML, X Corp) are Corp's share.",
  },
  {
    date: "2026-07-27",
    description:
      "Bookkeeper journal entries documented for both sides (sole prop: Dr Due from Corp / Cr Expense Clearing; Corp: Dr Software Dev Expense / Cr Due to Sole Prop). Clearing entry when Corp LOC pays also documented.",
  },
  {
    date: "2026-07-27",
    description:
      "Page created in Headwaters Books under owner/bookkeeper roles. Jul 2026 and Jan–Mar 2026 statements noted as pending — not yet available. Bank account mixing reconstruction noted as a separate task.",
  },
];

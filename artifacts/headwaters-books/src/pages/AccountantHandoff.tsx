/**
 * AccountantHandoff — Clean one-page brief for the bookkeeper and accountant.
 *
 * Organized by ENTITY and TAX YEAR, not by the owner's internal timeline.
 * Answers the three questions every accountant asks first:
 *   1. Who was the legal vendor? (Parrs Jars sole prop — all four invoices)
 *   2. What tax year does each transaction land in?
 *   3. What do I need to do with it?
 *
 * Print button at the top — hand this to the bookkeeper / accountant as a PDF.
 * The reconciliation page has the full internal detail; this page has the handoff brief.
 */

import { Printer, AlertTriangle, CheckSquare, Building2, User, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ── Constants pulled from the reconciliation source of truth ─────────────────
// Hardcoded here so the page is self-contained for printing.

const ENTITIES = {
  soleProp: {
    name: "Parrs Jars",
    type: "Sole Proprietorship",
    owner: "Bobbie (personal)",
    period: "Full history — active until ~Nov 2024 transition",
    note: "Owned all equipment listed below. All four invoices issued under this entity. Income from sales is Bobbie's personal income (T1), not corporate income.",
  },
  corp: {
    name: "Headwaters Ontario Corp",
    type: "Ontario Corporation",
    owner: "Bobbie (director/shareholder)",
    period: "Incorporated ~Nov 2024 — ongoing",
    note: "Successor operating entity. Did NOT own the equipment sold. Invoices #001057, #001062, #001066 proceeds landed in this account — recorded as Bobbie's capital contribution (see §4).",
  },
  buyer: {
    name: "807 Food Co-op",
    type: "Ontario Co-operative",
    note: "Buyer on all four invoices. Different entity from both Parrs Jars and Headwaters. Not related to the entity transition.",
  },
};

const INVOICES = [
  {
    id: "#001056",
    issued: "~Jun 2025",
    paid: "Jun 19, 2025",
    paymentMethod: "Bank draft",
    taxYear: 2025,
    items: [
      { description: "Trailer (main unit)", amount: 17_950.00, note: "Income — recognized" },
      { description: "Trailer upgrades", amount: 9_995.00, note: "LIABILITY — paid but not yet delivered to co-op. Do not recognize as income until delivered or settled." },
      { description: "Canning supplies", amount: 2_500.00, note: "Income — recognized" },
    ],
    subtotal: 30_445.00,
    hst: 3_957.85,
    total: 34_402.85,
    proceedsLanded: "Confirm which account (Parrs Jars personal or Headwaters corp)",
    proceedsLandedStatus: "pending" as const,
    recognizableIncome: 20_450.00, // subtotal minus the $9,995 upgrade liability
    recognizableNote: "Excludes $9,995 upgrades (liability until delivered)",
  },
  {
    id: "#001057",
    issued: "Jul 2, 2025",
    paid: "Jul 2025",
    paymentMethod: "Co-op payment",
    taxYear: 2025,
    items: [
      { description: "Grow beds", amount: null, note: "" },
      { description: "Light panels", amount: null, note: "" },
      { description: "Freeze dryer", amount: null, note: "" },
    ],
    subtotal: 15_900.00,
    hst: 2_067.00,
    total: 17_967.00,
    proceedsLanded: "Headwaters Ontario Corp bank account",
    proceedsLandedStatus: "confirmed" as const,
    recognizableIncome: 15_900.00,
    recognizableNote: "Full subtotal is income",
  },
  {
    id: "#001062",
    issued: "Mar 12, 2026",
    paid: "Mar 2026",
    paymentMethod: "Co-op payment",
    taxYear: 2026,
    items: [
      { description: "Kitchen tables & chairs", amount: null, note: "" },
      { description: "Coolers", amount: null, note: "" },
      { description: "Dehydrator", amount: null, note: "" },
    ],
    subtotal: 2_200.00,
    hst: 286.00,
    total: 2_486.00,
    proceedsLanded: "Headwaters Ontario Corp bank account",
    proceedsLandedStatus: "confirmed" as const,
    recognizableIncome: 2_200.00,
    recognizableNote: "Full subtotal is income",
  },
  {
    id: "#001066",
    issued: "Mar 27, 2026",
    paid: "Mar 2026",
    paymentMethod: "Co-op payment",
    taxYear: 2026,
    items: [
      { description: "Final shelving / supply cabinet", amount: null, note: "" },
    ],
    subtotal: 450.00,
    hst: 58.50,
    total: 508.50,
    proceedsLanded: "Headwaters Ontario Corp bank account",
    proceedsLandedStatus: "confirmed" as const,
    recognizableIncome: 450.00,
    recognizableNote: "Full subtotal is income",
  },
];

// ── Tax year summaries ────────────────────────────────────────────────────────

const TAX_YEAR_2025 = {
  invoices: ["#001056", "#001057"],
  grossReceived: 34_402.85 + 17_967.00,     // 52,369.85
  hstCollected: 3_957.85 + 2_067.00,         // 6,024.85
  netSubtotals: 20_450.00 + 15_900.00,       // 36,350.00  (001056 net of $9,995 upgrade liability)
  upgradeNote: "Invoice #001056 trailer upgrades ($9,995) excluded from income until delivered.",
};

const TAX_YEAR_2026 = {
  invoices: ["#001062", "#001066"],
  grossReceived: 2_486.00 + 508.50,          // 2,994.50
  hstCollected: 286.00 + 58.50,              // 344.50
  netSubtotals: 2_200.00 + 450.00,           // 2,650.00
  upgradeNote: null,
};

// Capital contribution — invoices that landed in the corp account
const CORP_CAPITAL_CONTRIBUTION = 17_967.00 + 2_486.00 + 508.50; // 20,961.50

// ── Formatters ────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

// ── Sub-components ────────────────────────────────────────────────────────────

function EntityCard({
  entity,
  color,
  icon: Icon,
}: {
  entity: { name: string; type: string; owner?: string; period?: string; note: string };
  color: string;
  icon: typeof User;
}) {
  return (
    <div
      className="rounded-xl border p-5 flex-1"
      style={{ borderColor: color + "44", background: color + "08" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4" style={{ color }} />
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] font-bold" style={{ color }}>
          {entity.type}
        </p>
      </div>
      <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-serif, serif)" }}>
        {entity.name}
      </p>
      {entity.owner && (
        <p className="text-xs text-muted-foreground mt-0.5">{entity.owner}</p>
      )}
      {entity.period && (
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{entity.period}</p>
      )}
      <p className="text-xs text-muted-foreground mt-3 leading-relaxed border-t border-border pt-3">
        {entity.note}
      </p>
    </div>
  );
}

function InvoiceBlock({ inv }: { inv: typeof INVOICES[number] }) {
  const yearColor = inv.taxYear === 2025 ? "#1d4ed8" : "#7c3aed";
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center px-4 py-3 bg-muted/40 border-b border-border">
        <p className="text-sm font-mono font-bold">{inv.id}</p>
        <p className="text-xs text-muted-foreground">
          Issued {inv.issued} · Paid {inv.paid} · {inv.paymentMethod}
        </p>
        <Badge
          className="text-[10px] font-mono"
          style={{
            backgroundColor: yearColor + "18",
            color: yearColor,
            border: `1px solid ${yearColor}44`,
          }}
        >
          {inv.taxYear} T1
        </Badge>
      </div>
      <div className="px-4 py-3 space-y-1.5">
        {inv.items.map((item) => (
          <div key={item.description} className="grid grid-cols-[1fr_auto] gap-4 items-start">
            <div>
              <span className="text-sm">{item.description}</span>
              {item.note && (
                <span className="ml-2 text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  {item.note.split(" —")[0]}
                </span>
              )}
            </div>
            <span className="text-sm font-mono tabular-nums text-muted-foreground">
              {item.amount ? fmt(item.amount) : "—"}
            </span>
          </div>
        ))}
        <div className="border-t border-border pt-2 mt-2 space-y-0.5">
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="text-xs text-muted-foreground">Subtotal (pre-HST)</span>
            <span className="text-xs font-mono tabular-nums">{fmt(inv.subtotal)}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="text-xs text-muted-foreground">HST 13%</span>
            <span className="text-xs font-mono tabular-nums">({fmt(inv.hst)})</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4 font-semibold border-t border-border pt-1">
            <span className="text-sm">Total received</span>
            <span className="text-sm font-mono tabular-nums">{fmt(inv.total)}</span>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-md px-3 py-2 bg-muted/60">
          <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground shrink-0 mt-0.5">
            Proceeds landed in:
          </p>
          <p
            className={`text-xs font-medium leading-relaxed ${inv.proceedsLandedStatus === "pending" ? "text-amber-700" : "text-foreground"}`}
          >
            {inv.proceedsLanded}
          </p>
        </div>
        {inv.recognizableNote && (
          <div className="mt-2 flex items-start gap-2 rounded-md px-3 py-2 bg-emerald-50 border border-emerald-200">
            <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald-700 shrink-0 mt-0.5">
              Recognizable income:
            </p>
            <p className="text-xs font-semibold text-emerald-800">
              {fmt(inv.recognizableIncome)} — {inv.recognizableNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AccountantHandoff() {
  return (
    <div className="space-y-8 pb-16 print:pb-4 max-w-4xl">

      {/* Header */}
      <div className="flex justify-between items-start print:hidden">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Accountant &amp; Bookkeeper Handoff
          </p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif, serif)" }}>
            Parrs Jars → Headwaters Ontario Corp
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Entity transition brief and asset sale summary. All four invoices were issued by Parrs Jars (sole
            proprietorship) — income is Bobbie's personal income (T1), not corporate income. Read §4 for the
            intercorporate complication on the three later invoices.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="flex items-center gap-2 shrink-0"
        >
          <Printer className="w-4 h-4" />
          Print / PDF
        </Button>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif, serif)" }}>
          Accountant &amp; Bookkeeper Handoff — Headwaters Books
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Parrs Jars (sole prop) → Headwaters Ontario Corp entity transition · Asset sales to 807 Food Co-op
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Printed {new Date().toLocaleDateString("en-CA")}</p>
      </div>

      {/* § 1 — The entities */}
      <section>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          § 1 — The entities — who is who
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <EntityCard entity={ENTITIES.soleProp} color="#16a34a" icon={User} />
          <div className="flex items-center justify-center text-muted-foreground print:hidden">
            <ArrowRight className="h-5 w-5" />
          </div>
          <EntityCard entity={ENTITIES.corp} color="#2563eb" icon={Building2} />
        </div>
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-1">
            The buyer — separate from both
          </p>
          <p className="text-sm font-semibold">{ENTITIES.buyer.name} <span className="font-normal text-muted-foreground">— {ENTITIES.buyer.type}</span></p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ENTITIES.buyer.note}</p>
        </div>
      </section>

      {/* § 2 — All four invoices */}
      <section>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          § 2 — The four asset sale invoices · Parrs Jars → 807 Food Co-op
        </p>
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-xs text-blue-800 leading-relaxed">
            <strong>All four invoices were issued by Parrs Jars (sole proprietorship).</strong> The assets were
            purchased and owned during the sole proprietor era. The entity transition to Headwaters Ontario Corp
            does not change the vendor on these invoices or the income attribution.
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INVOICES.map((inv) => (
            <InvoiceBlock key={inv.id} inv={inv} />
          ))}
        </div>
      </section>

      {/* § 3 — Tax year summary */}
      <section>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          § 3 — Summary by tax year · all amounts in CAD
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { year: 2025, data: TAX_YEAR_2025, color: "#1d4ed8" },
            { year: 2026, data: TAX_YEAR_2026, color: "#7c3aed" },
          ].map(({ year, data, color }) => (
            <div
              key={year}
              className="rounded-xl border p-5"
              style={{ borderColor: color + "44", background: color + "08" }}
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-3"
                style={{ color }}
              >
                {year} Personal T1 · Bobbie
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoices</span>
                  <span className="font-mono">{data.invoices.join(" + ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross received</span>
                  <span className="font-mono tabular-nums">{fmt(data.grossReceived)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HST collected (not income)</span>
                  <span className="font-mono tabular-nums text-muted-foreground">
                    ({fmt(data.hstCollected)})
                  </span>
                </div>
                <div
                  className="flex justify-between border-t pt-1.5 font-semibold"
                  style={{ borderColor: color + "33" }}
                >
                  <span>Net recognizable income</span>
                  <span className="font-mono tabular-nums" style={{ color }}>
                    {fmt(data.netSubtotals)}
                  </span>
                </div>
              </div>
              {data.upgradeNote && (
                <p className="text-[10px] text-amber-700 bg-amber-50 rounded px-2 py-1.5 mt-3 leading-relaxed">
                  ⚠ {data.upgradeNote}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-900 mb-1">
            Trailer upgrades liability — $9,995 — do not recognize as income yet
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Invoice #001056 included $9,995 for trailer upgrades that were paid by 807 Food Co-op but
            not yet delivered. This amount is a liability (obligation to deliver or refund) until it resolves.
            Until then it is not recognizable income. When delivered, it becomes income in the year of delivery.
            When refunded, it nets to zero. Accountant to advise on treatment.
          </p>
        </div>
      </section>

      {/* § 4 — Intercorporate complication */}
      <section>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          § 4 — The intercorporate complication · proceeds in the wrong account
        </p>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-4">
          <p className="text-sm font-semibold text-blue-900">
            Invoices #001057, #001062, and #001066 — total {fmt(CORP_CAPITAL_CONTRIBUTION)} — landed in the
            Headwaters Ontario Corp bank account, not in Bobbie's personal account.
          </p>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Why this matters:</strong> The income belongs to Bobbie personally (Parrs Jars sole prop invoices).
              But the cash went into the corporate account. This creates an intercorporate bookkeeping entry.
            </p>
            <p>
              <strong>Decision recorded:</strong> The {fmt(CORP_CAPITAL_CONTRIBUTION)} is treated as Bobbie's
              capital contribution to Headwaters Ontario Corp — not as a shareholder loan (no repayment obligation).
            </p>
            <div className="rounded-md bg-white/60 border border-blue-200 p-3 font-mono text-xs space-y-1">
              <p className="text-blue-600 font-semibold">In Headwaters corporate books (T2):</p>
              <p>Dr. Cash / Bank .............. {fmt(CORP_CAPITAL_CONTRIBUTION)}</p>
              <p>  Cr. Shareholder Contributed Capital ... {fmt(CORP_CAPITAL_CONTRIBUTION)}</p>
            </div>
            <p className="text-xs">
              <strong>On Bobbie's T1:</strong> Report the full invoice income regardless of which account received it.
              The capital contribution to the corp is a use of personal funds — it does not reduce personal income.
              Confirm with accountant.
            </p>
          </div>
        </div>
      </section>

      {/* § 5 — Action checklist */}
      <section>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          § 5 — Action checklist · organized by professional
        </p>

        {/* Bookkeeper */}
        <div className="rounded-xl border border-border bg-card p-5 mb-4">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-emerald-600" />
            For the bookkeeper
          </p>
          <ul className="space-y-2.5">
            {[
              "Pull four QuickBooks reports (see §6 below): Balance Sheet as of Oct 31 2024, Transaction Detail by Account (full sole-prop history), P&L sole-prop period, Customer Balance Detail — 807 Food Co-op.",
              "In Parrs Jars sole-prop books: record disposition of each asset sold. Confirm cost basis of each item from the asset list. Cost basis minus sale price = gain/loss for T1.",
              "Invoice #001056 — confirm which bank account received the $34,402.85 bank draft. If it went to the Headwaters corporate account, record it as a second capital contribution from Bobbie.",
              `In Headwaters corporate books: record Bobbie's capital contribution of ${fmt(CORP_CAPITAL_CONTRIBUTION)} (Invoices #001057, #001062, #001066 proceeds). Dr Cash, Cr Shareholder Contributed Capital.`,
              "Record $9,995 trailer upgrades as a liability in Parrs Jars books until delivered to 807 Food Co-op or refunded. Do not recognize as income.",
              "Confirm HST remittance on all four invoices under Parrs Jars HST account. Total HST collected: " + fmt(3_957.85 + 2_067.00 + 286.00 + 58.50) + ". Confirm CRA remittance matches.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded border border-border flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Accountant — T1 */}
        <div className="rounded-xl border border-border bg-card p-5 mb-4">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-blue-600" />
            For the accountant — Personal T1 (Bobbie)
          </p>
          <ul className="space-y-2.5">
            {[
              `2025 T1: Report income from Invoice #001056 (paid Jun 19, 2025) and Invoice #001057 (Jul 2025). Net recognizable income ${fmt(TAX_YEAR_2025.netSubtotals)} (excludes $9,995 upgrade liability and HST). Advise on income vs. capital gain treatment per asset type.`,
              `2026 T1: Report income from Invoices #001062 and #001066 (both Mar 2026). Net income ${fmt(TAX_YEAR_2026.netSubtotals)} (excludes HST). Advise on treatment.`,
              "Trailer upgrades ($9,995): advise on the year of recognition — income in the year delivered to the co-op, or in the year of settlement if refunded instead.",
              `Capital contribution of ${fmt(CORP_CAPITAL_CONTRIBUTION)} to Headwaters Ontario Corp: confirm this does not reduce T1 income. The contribution is a use of personal funds, not a deduction.`,
              "Personal income tax on 2025-2026 invoice net proceeds estimated at ~$6,100. File/amend T1 for applicable years. Confirm with actual 2025 amounts and cost basis.",
              "Confirm Parrs Jars HST registration and remittance status for all four invoice periods. If HST refund is owing from the sole-prop operating period, identify and claim.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded border border-border flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Accountant — T2 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-purple-600" />
            For the accountant — Corporate T2 (Headwaters Ontario Corp)
          </p>
          <ul className="space-y-2.5">
            {[
              `Record Bobbie's shareholder capital contribution of ${fmt(CORP_CAPITAL_CONTRIBUTION)} for the three invoices whose proceeds landed in the corporate account. This is NOT corporate revenue — it is equity capital.`,
              "If Invoice #001056 proceeds also landed in the Headwaters corporate account, record an additional capital contribution for that amount minus HST (confirm with bookkeeper).",
              "Confirm no corporate income (T2 revenue) is recorded for any of the four Parrs Jars invoices — these are personal transactions that happened to pass through the corporate account.",
              "Confirm Headwaters Ontario Corp HST registration number and whether the corp is on the hook for any HST from these transactions (it should not be — Parrs Jars was the invoicing entity).",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded border border-border flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* § 6 — QuickBooks exports needed */}
      <section>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          § 6 — QuickBooks exports the bookkeeper must pull
        </p>
        <div className="space-y-3">
          {[
            {
              n: 1,
              name: "Balance Sheet",
              range: "As of Oct 31, 2024",
              purpose: "Confirms what Parrs Jars owned (equipment, assets) and what it owed (LOC, personal funds advanced) at the exact point of transition to the corporation.",
            },
            {
              n: 2,
              name: "Transaction Detail by Account",
              range: "Full sole-prop history to Oct 31, 2024",
              purpose: "Verifies the exact line-of-credit draw total (~$26,337 estimated) and the cost basis of assets later sold. Every asset listed on the invoices should have a purchase entry in this report.",
            },
            {
              n: 3,
              name: "Profit & Loss",
              range: "Full sole-prop period to Oct 31, 2024",
              purpose: "Establishes the net operating result of Parrs Jars. Identifies any HST refund or remittance owing to CRA for the sole-prop period. Also determines whether prior operating losses can offset the equipment sale income.",
            },
            {
              n: 4,
              name: "Customer Balance Detail — 807 Food Co-op",
              range: "All dates",
              purpose: "Confirms the outstanding balance (if any) the co-op had before Invoice #001056. Any prior credits or payments may affect the net owed figure. Also confirms whether the trailer upgrades ($9,995) are recorded as a receivable from the co-op.",
            },
          ].map((r) => (
            <div key={r.n} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/20">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {r.n}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {r.name}{" "}
                  <span className="font-normal text-muted-foreground font-mono text-xs">— {r.range}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.purpose}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground italic px-1">
            In QuickBooks: Reports → Custom Reports → set date range → Export as Excel or PDF → share with bookkeeper and accountant.
          </p>
        </div>
      </section>

      {/* § 7 — Filed returns & outcomes */}
      <section>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          § 7 — Filed returns &amp; outcomes · prepared by J.P. Butler, CPA · signed Jun 12, 2026
        </p>

        {/* Filed-by banner */}
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">All 2025 returns filed</p>
            <p className="text-xs text-emerald-800 mt-0.5">
              Prepared without audit from information supplied by the taxpayer · J.P. Butler, CPA · Electronic filer Y9686 · Document control Y968625FPB7ZH
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Personal T1 */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-blue-700">
              Personal T1 · Bobbie Parr · 2025
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800/70">Total income (line 15000)</span>
                <span className="font-mono tabular-nums text-blue-900">$15,281.74</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800/70">Taxable income (line 26000)</span>
                <span className="font-mono tabular-nums text-blue-900">$15,281.74</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800/70">Federal non-ref. credits</span>
                <span className="font-mono tabular-nums text-blue-900">$2,350.89</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2 font-semibold">
                <span className="text-blue-900">Refund (line 48400)</span>
                <span className="font-mono tabular-nums text-emerald-700">$519.38</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-blue-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Filed electronically · T183 signed
            </div>
          </div>

          {/* HST */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-amber-700">
              HST Return · Parrs Jars · Jan–Dec 2025
            </p>
            <p className="text-[10px] font-mono text-amber-700/70">BN: 730101334 RT 0001</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-800/70">Sales &amp; other revenue (101)</span>
                <span className="font-mono tabular-nums text-amber-900">$55,875.41</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800/70">HST collected (103)</span>
                <span className="font-mono tabular-nums text-amber-900">$6,024.85</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800/70">ITCs claimed (106)</span>
                <span className="font-mono tabular-nums text-amber-900">($964.24)</span>
              </div>
              <div className="flex justify-between border-t border-amber-200 pt-2 font-semibold">
                <span className="text-amber-900">Net tax owing (109)</span>
                <span className="font-mono tabular-nums text-red-700">$5,060.61</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              Remittance of $5,060.61 required
            </div>
          </div>

          {/* Corp T2 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-600">
              Corporate T2 · Headwaters Ontario Corp · 2025
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600/70">Corporate revenue</span>
                <span className="font-mono tabular-nums text-slate-700">NIL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600/70">Corporate expenses</span>
                <span className="font-mono tabular-nums text-slate-700">NIL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600/70">Net income</span>
                <span className="font-mono tabular-nums text-slate-700">NIL</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                <span className="text-slate-700">Tax owing</span>
                <span className="font-mono tabular-nums text-slate-700">$0.00</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Corp was incorporated ~Nov 2024 and carried no operating activity in 2025. Invoice proceeds received were
              recorded as Bobbie's shareholder capital contribution — not corporate revenue.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              NIL return — no tax owing
            </div>
          </div>
        </div>

        {/* Parrs Jars 2025 income summary from TB */}
        <div className="mt-4 rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Parrs Jars 2025 year-end · from accountant's trial balance (TB)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {[
              { label: "Operating revenue", value: "($9,530.41)", note: "net of adj." },
              { label: "Gain on disposal of PPE", value: "($20,253.01)", note: "equipment sold to 807" },
              { label: "Total expenses", value: "$26,137.90", note: "after adj." },
              { label: "Net income / (loss)", value: "($3,645.50)", note: "final", highlight: true },
            ].map((r) => (
              <div key={r.label} className={`rounded-md p-3 ${r.highlight ? "bg-primary/5 border border-primary/20" : "bg-muted/40"}`}>
                <p className="text-[10px] text-muted-foreground leading-tight">{r.label}</p>
                <p className={`text-base font-mono font-semibold mt-1 ${r.highlight ? "text-primary" : ""}`}>{r.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{r.note}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 italic">
            Note: Operating revenue reflects winding-down activity only (sales $9,530 + lease income nil).
            The $20,253 gain on disposal is the net gain from equipment sold to 807 Food Co-op per the accountant's
            adjusting entries. Net loss of $(3,645.50) flows to Bobbie's T1 as sole proprietor income — consistent
            with the $15,281.74 total income reported on the filed T1 (other personal income made up the balance).
          </p>
        </div>
      </section>

      {/* Footer note */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 leading-relaxed">
        <strong>2025 filings complete.</strong> T1 (refund $519.38) and HST return ($5,060.61 owing) filed by
        J.P. Butler, CPA on Jun 12, 2026. Corporate T2 for Headwaters Ontario Corp: NIL — no tax owing.
        Parrs Jars 2025 year-end shows a net loss of $(3,645.50) after accountant's adjustments.
        HST remittance of $5,060.61 to CRA remains outstanding — confirm payment date.
      </div>
    </div>
  );
}

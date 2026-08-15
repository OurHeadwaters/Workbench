/**
 * Invoice 807-RTO-2026-001
 * 807 Food Co-operative Inc. (Treasurer: Bobbie Parr) → Crooked Arrow
 *
 * Two charges on one invoice:
 *   1. Annual membership fee — $50.00/year (required to access 807 equipment)
 *   2. Rent-to-own agreement — commercial equipment package ($7,000 asset value)
 *      $125/month × 24 months = $3,000.00 total
 *      Prepaid in full upfront → equipment transfers to Crooked Arrow unconditionally
 *      at end of term (no further payment, no conditions).
 *
 * HST NOTE:
 *   Confirm with 807's accountant whether 807 Food Co-operative is registered
 *   for HST and whether the membership fee / RTO payments are taxable supplies.
 *   If HST applies: $3,050 × 13% = $396.50 additional. This invoice shows
 *   amounts before HST; a checkbox below flags whether to include it.
 *
 * NUMBERING: See InvoicePJEquip2026001.tsx header for full convention.
 *   Next 807 invoice: 807-RTO-2026-002 (or 807-MEM-2026-001 for membership-only renewal)
 */

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric",
  });

// ── Constants ─────────────────────────────────────────────────────────────────

const INVOICE_NUMBER       = "807-RTO-2026-001";
const INVOICE_DATE         = "2026-08-15";

const MEMBERSHIP_FEE       = 50.00;
const RTO_MONTHLY          = 125.00;
const RTO_MONTHS           = 24;
const RTO_TOTAL            = RTO_MONTHLY * RTO_MONTHS;          // $3,000.00
const INVOICE_SUBTOTAL     = MEMBERSHIP_FEE + RTO_TOTAL;        // $3,050.00
const HST_RATE             = 0.13;
const HST_AMOUNT           = INVOICE_SUBTOTAL * HST_RATE;       // $396.50
const INVOICE_TOTAL        = INVOICE_SUBTOTAL + HST_AMOUNT;     // $3,446.50

const EQUIPMENT_ASSET_VALUE = 7_000.00;

const EQUIPMENT_ITEMS = [
  { name: "Commercial Mixer",          estimatedValue: 2_500 },
  { name: "Commercial Vacuum Sealer",  estimatedValue: 2_000 },
  { name: "8-foot Steel Table",        estimatedValue: 2_500 },
];

const FROM = {
  org:       "807 Food Co-operative Inc.",
  treasurer: "Bobbie Parr, Treasurer",
  address:   "Dryden, Ontario",
};

const TO = {
  name:    "Crooked Arrow",
  attn:    "",    // Fill in before printing
  address: "",   // Fill in before printing
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Invoice807RTO2026001() {
  return (
    <div className="max-w-3xl mx-auto pb-16 print:pb-0">

      {/* Print button */}
      <div className="flex justify-end mb-6 print:hidden">
        <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-2">
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden print:border-black print:rounded-none shadow-sm print:shadow-none">

        {/* Header band */}
        <div className="bg-primary px-8 py-6 print:bg-white print:border-b print:border-black">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary-foreground/70 print:text-black/50 mb-1">
                Invoice · Membership + Rent-to-Own Agreement
              </p>
              <p className="text-2xl font-bold font-mono text-primary-foreground print:text-black">
                {INVOICE_NUMBER}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary-foreground print:text-black">{FROM.org}</p>
              <p className="text-xs text-primary-foreground/80 print:text-black/60 mt-0.5">{FROM.treasurer}</p>
            </div>
          </div>
        </div>

        {/* From / To / Meta */}
        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-border print:border-black/20">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">From</p>
            <p className="text-sm font-bold">{FROM.org}</p>
            <p className="text-sm text-muted-foreground">{FROM.treasurer}</p>
            <p className="text-sm text-muted-foreground mt-1">{FROM.address}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">Bill To</p>
            <p className="text-sm font-bold">{TO.name}</p>
            {TO.attn && <p className="text-xs text-muted-foreground">Attn: {TO.attn}</p>}
            {TO.address
              ? <p className="text-xs text-muted-foreground mt-1">{TO.address}</p>
              : <p className="text-xs text-amber-600 mt-1 print:hidden">⚠ Fill in address before printing</p>
            }
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Invoice date</p>
              <p className="text-sm font-medium">{fmtDate(INVOICE_DATE)}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Membership year</p>
              <p className="text-sm font-medium">August 2026 – August 2027</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">RTO term</p>
              <p className="text-sm font-medium">24 months · August 2026 – July 2028</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-8 py-4 border-b border-border print:border-black/20 bg-muted/20 print:bg-transparent">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Re: 807 Food Co-operative membership and equipment rent-to-own.</strong>{" "}
            Membership in 807 Food Co-operative Inc. is required to access the equipment described below.
            The rent-to-own agreement transfers full ownership of the equipment package to Crooked Arrow
            upon receipt of the full {RTO_MONTHS}-month prepayment of {fmt(RTO_TOTAL)}. No additional
            payments are required after that point. Equipment value as listed below is {fmt(EQUIPMENT_ASSET_VALUE)}.
            Crooked Arrow takes possession on execution of this agreement and full payment receipt.
          </p>
        </div>

        {/* Equipment list */}
        <div className="px-8 pt-5 pb-3 border-b border-border print:border-black/20">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Equipment covered by this agreement
          </p>
          <div className="space-y-2">
            {EQUIPMENT_ITEMS.map((eq, i) => (
              <div key={i} className="flex justify-between items-baseline text-xs">
                <span className="text-foreground">{eq.name}</span>
                <span className="font-mono text-muted-foreground tabular-nums">Est. value {fmt(eq.estimatedValue)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-baseline text-xs mt-3 pt-2 border-t border-dashed border-border/50 print:border-black/10">
            <span className="font-semibold text-foreground">Total asset value (for reference only)</span>
            <span className="font-mono font-semibold tabular-nums">{fmt(EQUIPMENT_ASSET_VALUE)}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Asset values are estimates. Title transfers unconditionally on full RTO payment — no residual purchase price.
          </p>
        </div>

        {/* Line items */}
        <div className="px-8 pt-4 pb-0">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-1 border-b border-border print:border-black/20">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Description</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground text-center">Calc.</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground text-right">Amount (CAD)</p>
          </div>

          {/* Membership */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 py-2.5 border-b border-dashed border-border/50 print:border-black/10">
            <div>
              <p className="text-xs text-foreground font-medium">Annual membership fee</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                807 Food Co-operative Inc. — Year 1 (Aug 2026 – Aug 2027).
                Renewable annually at $50/year.
              </p>
            </div>
            <p className="text-xs font-mono text-muted-foreground text-center pt-0.5">1 year</p>
            <p className="text-sm font-mono tabular-nums text-right shrink-0 pt-0.5">{fmt(MEMBERSHIP_FEE)}</p>
          </div>

          {/* RTO */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 py-2.5">
            <div>
              <p className="text-xs text-foreground font-medium">Rent-to-own — commercial equipment package</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Commercial Mixer, Commercial Vacuum Sealer, 8-ft Steel Table.
                {" "}{RTO_MONTHS} months prepaid at {fmt(RTO_MONTHLY)}/month.
                Full ownership transfers to Crooked Arrow on receipt of {fmt(RTO_TOTAL)} — no residual.
                Crooked Arrow takes possession immediately. 807 retains no claim after payment is received.
              </p>
            </div>
            <p className="text-xs font-mono text-muted-foreground text-center pt-0.5">
              {RTO_MONTHS} × {fmt(RTO_MONTHLY)}
            </p>
            <p className="text-sm font-mono tabular-nums text-right shrink-0 pt-0.5">{fmt(RTO_TOTAL)}</p>
          </div>
        </div>

        {/* Subtotal */}
        <div className="px-8 py-3 border-t border-border print:border-black/20 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono tabular-nums">{fmt(INVOICE_SUBTOTAL)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">HST (13 % — Ontario)</span>
            <span className="font-mono tabular-nums">{fmt(HST_AMOUNT)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="px-8 py-5 flex items-center justify-between bg-primary/5 print:bg-white print:border-t print:border-black">
          <div>
            <p className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-serif, serif)" }}>
              Total Amount Due
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Membership {fmt(MEMBERSHIP_FEE)} + RTO {fmt(RTO_TOTAL)} + HST {fmt(HST_AMOUNT)}
            </p>
          </div>
          <p className="text-3xl font-bold font-mono tabular-nums text-primary print:text-black">
            {fmt(INVOICE_TOTAL)}
          </p>
        </div>

        {/* Ownership transfer clause */}
        <div className="px-8 py-5 border-t border-border print:border-black/20 bg-muted/10 print:bg-transparent">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Ownership transfer clause
          </p>
          <p className="text-xs text-foreground leading-relaxed">
            Upon receipt of <strong>{fmt(RTO_TOTAL)}</strong> (the full {RTO_MONTHS}-month prepayment),
            807 Food Co-operative Inc. transfers full and unconditional title to the equipment package
            described above to Crooked Arrow. No further payments, conditions, or obligations attach
            to the equipment after the transfer date. 807 Food Co-operative Inc. warrants that it
            holds clear title to the equipment free of encumbrances at time of transfer.
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Transfer date: on or before <strong>August 1, 2028</strong> (end of {RTO_MONTHS}-month term),
            or immediately if full payment is received upfront on invoice date.
          </p>
        </div>

        {/* Payment */}
        <div className="px-8 py-5 border-t border-border print:border-black/20 space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Payment instructions</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Option A — Lump sum (recommended):</strong> Pay{" "}
            <strong className="text-foreground">{fmt(INVOICE_TOTAL)}</strong> today. Equipment title transfers immediately. E-transfer or cheque payable to
            807 Food Co-operative Inc. Reference: <span className="font-mono">{INVOICE_NUMBER}</span>.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Option B — Monthly:</strong> Membership {fmt(MEMBERSHIP_FEE)}{" "}
            due today; equipment payments of {fmt(RTO_MONTHLY)}/month for {RTO_MONTHS} months beginning
            September 1, 2026. Title transfers at month 24 upon final payment.
          </p>
        </div>

        {/* Signature block */}
        <div className="px-8 py-6 border-t border-border print:border-black/20 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">
              807 Food Co-operative Inc. — Treasurer
            </p>
            <div className="border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Bobbie Parr, Treasurer · 807 Food Co-op</p>
            <div className="mt-3 border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Date</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Crooked Arrow — Authorized representative
            </p>
            <div className="border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Name &amp; title</p>
            <div className="mt-3 border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Date</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-3 bg-muted/30 print:bg-transparent border-t border-border print:border-black/20">
          <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
            807 Food Co-operative Inc. · Treasurer: Bobbie Parr · Dryden, Ontario · Invoice {INVOICE_NUMBER}
          </p>
        </div>
      </div>

      {/* Notes — screen only */}
      <div className="mt-6 space-y-2 print:hidden">
        <p className="text-xs text-muted-foreground">
          <strong>Fill in before printing:</strong> Crooked Arrow's address and authorized representative name.
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>HST:</strong> 13% confirmed applicable. HST {fmt(HST_AMOUNT)} included in total {fmt(INVOICE_TOTAL)}.
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Upfront vs. monthly:</strong> If Crooked Arrow pays {fmt(INVOICE_TOTAL)} today, title transfers
          immediately — no need to track monthly payments. Strongly recommend Option A to keep this clean.
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Next 807 invoice:</strong> 807-RTO-2026-002 or 807-MEM-2027-001 for the year-2 membership renewal.
        </p>
      </div>
    </div>
  );
}

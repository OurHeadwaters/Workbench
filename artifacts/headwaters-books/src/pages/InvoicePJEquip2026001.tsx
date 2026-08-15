/**
 * Invoice PJ-EQUIP-2026-001
 * Parrs Jars (Bobbie Parr, sole proprietor) → Crooked Arrow
 * Equipment sale — commercial kitchen assets. Clean sale, no ongoing obligations.
 *
 * INVOICE NUMBERING CONVENTION
 * ─────────────────────────────────────────────────────────────────────────────
 *  PJ-[CATEGORY]-[YYYY]-[###]   Parrs Jars sole proprietorship
 *  HOC-[CATEGORY]-[YYYY]-[###]  Headwaters Ontario Corp (1001047300 Ontario Inc.)
 *  807-[CATEGORY]-[YYYY]-[###]  807 Food Co-operative Inc. (Treasurer signing)
 *
 *  Categories in use:
 *    EQUIP  — Equipment / asset sale
 *    REIMB  — Reimbursement / intercompany pass-through
 *    SVC    — Services rendered
 *    RTO    — Rent-to-own agreement
 *    MEM    — Membership fee
 *
 *  Next PJ invoice:      PJ-EQUIP-2026-002 (or PJ-SVC-2026-001 for a service invoice)
 *  Next HOC invoice:     HOC-REIMB-2026-003 (continuing from REPLIT-DIGITAL-REIMB-2026-002)
 *  Next 807 invoice:     807-RTO-2026-002
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * HST NOTE: Equipment sale by an HST registrant is a taxable supply.
 * HST (13 % Ontario) is charged on the $5,000 sale price = $650.00.
 * Total due: $5,650.00 CAD.
 * Confirm with J.P. Butler, CPA if any item qualifies for a different tax code.
 */

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

// ── Invoice constants ─────────────────────────────────────────────────────────

const INVOICE_NUMBER  = "PJ-EQUIP-2026-001";
const INVOICE_DATE    = "2026-08-15";
const PAYMENT_TERMS   = "Due upon receipt — e-transfer or cheque";

const SALE_PRICE      = 5_000.00;
const HST_RATE        = 0.13;
const HST_AMOUNT      = SALE_PRICE * HST_RATE;   // $650.00
const INVOICE_TOTAL   = SALE_PRICE + HST_AMOUNT;  // $5,650.00

const FROM = {
  name:       "Bobbie Parr",
  tradeName:  "Parrs Jars",
  entityType: "Sole Proprietorship",
  address1:   "817 Muski Bay Road, PO Box 50",
  city:       "Wabigoon, ON  P0V 2W0",
  hstNumber:  "730101334 RT 0001",
};

const TO = {
  name:    "Crooked Arrow",
  attn:    "",           // Fill in contact name before printing
  address: "",          // Fill in address before printing
};

const LINE_ITEMS = [
  {
    description: "Commercial dishwasher with chemical supply system and XL pump",
    qty: 1,
    amount: null, // itemised amounts TBD — total is fixed at $5,000
  },
  {
    description: "Racks and shelving unit",
    qty: 1,
    amount: null,
  },
  {
    description: "Commercial sinks",
    qty: 1,
    amount: null,
  },
  {
    description: "Health unit compliance installation — handwashing station, signage, and consumable supply",
    qty: 1,
    amount: null,
  },
  {
    description: "6-burner gas stove with commercial hood",
    qty: 1,
    amount: null,
  },
];

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric",
  });

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InvoicePJEquip2026001() {
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
                Invoice · Equipment Sale
              </p>
              <p className="text-2xl font-bold font-mono text-primary-foreground print:text-black">
                {INVOICE_NUMBER}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary-foreground print:text-black">{FROM.tradeName}</p>
              <p className="text-xs text-primary-foreground/80 print:text-black/60 mt-0.5">{FROM.entityType}</p>
            </div>
          </div>
        </div>

        {/* From / To / Meta */}
        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-border print:border-black/20">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">From</p>
            <p className="text-sm font-bold">{FROM.name}</p>
            <p className="text-sm text-muted-foreground">{FROM.tradeName} ({FROM.entityType})</p>
            <p className="text-sm text-muted-foreground mt-1">{FROM.address1}</p>
            <p className="text-sm text-muted-foreground">{FROM.city}</p>
            <p className="text-xs font-mono text-muted-foreground mt-2">HST: {FROM.hstNumber}</p>
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
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Payment terms</p>
              <p className="text-sm font-medium">{PAYMENT_TERMS}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Sale type</p>
              <p className="text-sm font-medium">As-is, final sale — no warranties</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-8 py-4 border-b border-border print:border-black/20 bg-muted/20 print:bg-transparent">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Re: Sale of commercial kitchen equipment.</strong>{" "}
            Parrs Jars (Bobbie Parr, sole proprietor) sells the following items to Crooked Arrow
            as a lump-sum, as-is sale. Equipment was purchased and used in a licensed commercial
            kitchen operation in Wabigoon, Ontario. All items are in working order at time of sale.
            Buyer accepts responsibility for transportation, installation, and any applicable
            local health unit re-inspection at the new premises. Title passes on full payment.
          </p>
        </div>

        {/* Line items */}
        <div className="px-8 pt-4 pb-0">
          <div className="grid grid-cols-[1fr_auto] gap-4 pb-1 border-b border-border print:border-black/20">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Item description</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground text-right">Amount (CAD)</p>
          </div>

          {LINE_ITEMS.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] gap-4 py-2 border-b border-dashed border-border/50 print:border-black/10 last:border-0">
              <p className="text-xs text-foreground leading-relaxed pr-4">{item.description}</p>
              <p className="text-sm font-mono tabular-nums text-right shrink-0 pt-0.5 text-muted-foreground">—</p>
            </div>
          ))}

          {/* Lump sum note */}
          <div className="mt-2 mb-4 px-3 py-2 bg-muted/30 rounded text-xs text-muted-foreground">
            Items above sold as a single equipment package. Individual item values are not separately itemised.
          </div>
        </div>

        {/* Totals */}
        <div className="px-8 py-4 border-t border-border print:border-black/20 space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Equipment package — subtotal</p>
            <p className="text-sm font-mono tabular-nums">{fmt(SALE_PRICE)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">HST (13 % — Ontario)</p>
            <p className="text-sm font-mono tabular-nums">{fmt(HST_AMOUNT)}</p>
          </div>
        </div>

        {/* Total */}
        <div className="px-8 py-5 flex items-center justify-between bg-primary/5 print:bg-white print:border-t print:border-black">
          <div>
            <p className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-serif, serif)" }}>
              Total Amount Due
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Equipment {fmt(SALE_PRICE)} + HST {fmt(HST_AMOUNT)}
            </p>
          </div>
          <p className="text-3xl font-bold font-mono tabular-nums text-primary print:text-black">
            {fmt(INVOICE_TOTAL)}
          </p>
        </div>

        {/* Payment instructions */}
        <div className="px-8 py-5 border-t border-border print:border-black/20 space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Payment instructions</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Payment of <strong className="text-foreground">{fmt(INVOICE_TOTAL)} CAD</strong> is due upon receipt.
            E-transfer to <strong className="text-foreground">bobbie@ourheadwaters.ca</strong> or cheque payable to
            Bobbie Parr. Reference invoice number <span className="font-mono">{INVOICE_NUMBER}</span>.
            Equipment remains property of Parrs Jars until payment is received in full.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">HST collected</strong> under Parrs Jars HST account {FROM.hstNumber}{" "}
            and will be remitted with the next applicable CRA reporting period.
          </p>
        </div>

        {/* Signature block */}
        <div className="px-8 py-6 border-t border-border print:border-black/20 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">Vendor (seller)</p>
            <div className="border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Bobbie Parr · {FROM.tradeName}</p>
            <div className="mt-3 border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Date</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">Buyer (Crooked Arrow)</p>
            <div className="border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Authorized representative</p>
            <div className="mt-3 border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Date</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-3 bg-muted/30 print:bg-transparent border-t border-border print:border-black/20">
          <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
            {FROM.name} · {FROM.tradeName} ({FROM.entityType}) · HST {FROM.hstNumber} ·{" "}
            {FROM.address1}, {FROM.city} · Invoice {INVOICE_NUMBER}
          </p>
        </div>
      </div>

      {/* Notes — screen only */}
      <div className="mt-6 space-y-2 print:hidden">
        <p className="text-xs text-muted-foreground">
          <strong>Fill in before printing:</strong> Crooked Arrow's mailing address and contact name (Bill To section above).
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>HST:</strong> Equipment sale by an HST registrant is a taxable supply at 13 % (Ontario).
          If Crooked Arrow is also HST-registered, they can claim the input tax credit. Confirm with J.P. Butler, CPA.
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Next invoice:</strong> PJ-EQUIP-2026-002 or PJ-SVC-2026-001 depending on type. See numbering convention in file header.
        </p>
      </div>
    </div>
  );
}

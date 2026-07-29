/**
 * Invoice REPLIT-DIGITAL-REIMB-2026-002
 * Parrs Jars (Bobbie Parr, sole proprietor) → Headwaters Ontario Corp
 * Supplemental invoice — Jul 2026 digital charges (Jun 27 – Jul 31 2026)
 *
 * PENDING: Replace placeholder zeros in interEntityReimb2026.ts with confirmed
 * CAD amounts from the final July 2026 Alterna Savings statement, then
 * update status fields from "pending" to "confirmed".
 *
 * Standalone print-optimized view. Hit Print / Save as PDF to generate the document.
 */

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import {
  INVOICE_NUMBER_002,
  INVOICE_DATE_002,
  INVOICE_PERIOD_002,
  INVOICE_TOTAL_002,
  REPLIT_SUBTOTAL_002,
  OTHER_DIGITAL_SUBTOTAL_002,
  REPLIT_PRINCIPAL_002,
  REPLIT_FX_FEES_002,
  GODADDY_DOMAINS_002,
  RUNWAY_ML_002,
  X_CORP_DEV_002,
  OTHER_DIGITAL_002,
} from "@/data/interEntityReimb2026";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const isPending = (n: number) => n === 0;
const fmtOrPending = (n: number) => (isPending(n) ? "TBD" : fmt(n));

// ── Invoice data ──────────────────────────────────────────────────────────────

const FROM = {
  name: "Bobbie Parr",
  tradeName: "Parrs Jars",
  entityType: "Sole Proprietorship",
  address1: "817 Muski Bay Road, PO Box 50",
  city: "Wabigoon, ON  P0V 2W0",
  hstNumber: "730101334 RT 0001",
};

const TO = {
  name: "Headwaters Ontario Corp",
  corpNumber: "1001047300 Ontario Inc.",
  attn: "Bobbie Parr, Director",
};

const LINE_ITEMS = [
  {
    group: "Replit Development Platform",
    desc: "Replit principal charges — Jun 27 – Jul 31 2026 (CAD card amounts from Alterna Savings statements)",
    amount: REPLIT_PRINCIPAL_002,
  },
  {
    group: "Replit Development Platform",
    desc: "Foreign transaction fees — Replit-related FX fees on Alterna Savings credit card (travel with underlying Corp expense)",
    amount: REPLIT_FX_FEES_002,
  },
  {
    group: "Other Digital Tooling & Domains",
    desc: "GoDaddy — domain registrations for Corp projects",
    amount: GODADDY_DOMAINS_002,
  },
  {
    group: "Other Digital Tooling & Domains",
    desc: "Runway ML — AI/ML tooling for Corp digital development",
    amount: RUNWAY_ML_002,
  },
  {
    group: "Other Digital Tooling & Domains",
    desc: "X Corp / about.x.com — developer-tier subscription for Corp digital infrastructure",
    amount: X_CORP_DEV_002,
  },
  {
    group: "Other Digital Tooling & Domains",
    desc: "Other clear digital infrastructure / tooling (remaining digital charges after sole-prop items removed)",
    amount: OTHER_DIGITAL_002,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InvoiceReimb2026002() {
  const [, setLocation] = useLocation();
  const allPending = INVOICE_TOTAL_002 === 0;

  return (
    <div className="max-w-3xl mx-auto pb-16 print:pb-0">

      {/* Back link + Print button — hidden in print */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/inter-entity-reimbursement")}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          2026 Reimbursement
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>

      {/* Pending banner */}
      {allPending && (
        <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 print:hidden">
          <p className="text-sm font-semibold text-amber-900">Amounts pending</p>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            Open <code className="font-mono bg-amber-100 px-1 rounded">interEntityReimb2026.ts</code> and
            replace the placeholder zeros with confirmed CAD totals from the final July 2026 Alterna
            Savings statement. Update each <code className="font-mono bg-amber-100 px-1 rounded">status</code> field
            from <code className="font-mono bg-amber-100 px-1 rounded">"pending"</code> to{" "}
            <code className="font-mono bg-amber-100 px-1 rounded">"confirmed"</code> as each line is
            verified, then set the Jul 2026 checklist item to confirmed on the planning page.
          </p>
        </div>
      )}

      {/* Invoice card */}
      <div className="border border-border rounded-xl overflow-hidden print:border-black print:rounded-none shadow-sm print:shadow-none">

        {/* Header band */}
        <div className="bg-primary px-8 py-6 print:bg-white print:border-b print:border-black">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary-foreground/70 print:text-black/50 mb-1">
                Invoice · Supplemental
              </p>
              <p className="text-2xl font-bold font-mono text-primary-foreground print:text-black">
                {INVOICE_NUMBER_002}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary-foreground print:text-black">
                {FROM.tradeName}
              </p>
              <p className="text-xs text-primary-foreground/80 print:text-black/60 mt-0.5">
                {FROM.entityType}
              </p>
            </div>
          </div>
        </div>

        {/* From / To / Meta */}
        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-border print:border-black/20">
          {/* From */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">
              From
            </p>
            <p className="text-sm font-bold">{FROM.name}</p>
            <p className="text-sm text-muted-foreground">{FROM.tradeName} ({FROM.entityType})</p>
            <p className="text-sm text-muted-foreground mt-1">{FROM.address1}</p>
            <p className="text-sm text-muted-foreground">{FROM.city}</p>
            <p className="text-xs font-mono text-muted-foreground mt-2">
              HST: {FROM.hstNumber}
            </p>
          </div>

          {/* To */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Bill To
            </p>
            <p className="text-sm font-bold">{TO.name}</p>
            <p className="text-xs text-muted-foreground">{TO.corpNumber}</p>
            <p className="text-xs text-muted-foreground mt-1">Attn: {TO.attn}</p>
          </div>

          {/* Meta */}
          <div className="space-y-2">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Invoice date
              </p>
              <p className="text-sm font-medium">{fmtDate(INVOICE_DATE_002)}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Period covered
              </p>
              <p className="text-sm font-medium">{INVOICE_PERIOD_002}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Payment terms
              </p>
              <p className="text-sm font-medium">Due upon receipt (pending Corp LOC)</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Follows
              </p>
              <p className="text-sm font-medium font-mono">REPLIT-DIGITAL-REIMB-2026-001</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-8 py-4 border-b border-border print:border-black/20 bg-muted/20 print:bg-transparent">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Re: Supplemental reimbursement of digital development costs — Jul 2026.</strong>{" "}
            Costs listed below were paid by Bobbie Parr personally on the sole-proprietorship
            Alterna Savings credit card on behalf of Headwaters Ontario Corp during the period{" "}
            {INVOICE_PERIOD_002}. This invoice covers the July 2026 Alterna statement period
            following Invoice REPLIT-DIGITAL-REIMB-2026-001 (Apr 17 – Jun 26 2026). All amounts
            are in Canadian dollars (CAD) sourced from the Alterna Savings credit-card statements.
            These costs relate exclusively to software development platforms, domains, AI tooling,
            and related digital infrastructure used for the Corporation's projects. No HST is charged
            on this reimbursement invoice — costs were incurred as a pass-through and are not a
            supply of services by the sole proprietor.
          </p>
        </div>

        {/* Line items */}
        <div className="px-8 pt-4 pb-0">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto] gap-4 pb-1 border-b border-border print:border-black/20">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Description
            </p>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground text-right">
              Amount (CAD)
            </p>
          </div>

          {/* Group: Replit */}
          <div className="mt-3 mb-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-primary font-semibold">
              Replit Development Platform
            </p>
          </div>
          {LINE_ITEMS.filter((l) => l.group === "Replit Development Platform").map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] gap-4 py-1.5 border-b border-dashed border-border/50 print:border-black/10 last:border-0">
              <p className="text-xs text-foreground leading-relaxed pr-4">{item.desc}</p>
              <p className={`text-sm font-mono tabular-nums text-right shrink-0 pt-0.5 ${isPending(item.amount) ? "text-muted-foreground italic" : ""}`}>
                {fmtOrPending(item.amount)}
              </p>
            </div>
          ))}
          <div className="grid grid-cols-[1fr_auto] gap-4 py-2 border-b border-border print:border-black/20 bg-muted/30 -mx-8 px-8 mt-1">
            <p className="text-xs font-semibold text-muted-foreground">Subtotal — Replit</p>
            <p className={`text-sm font-mono font-semibold tabular-nums text-right ${isPending(REPLIT_SUBTOTAL_002) ? "text-muted-foreground italic" : ""}`}>
              {fmtOrPending(REPLIT_SUBTOTAL_002)}
            </p>
          </div>

          {/* Group: Other digital */}
          <div className="mt-4 mb-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-primary font-semibold">
              Other Digital Tooling &amp; Domains
            </p>
          </div>
          {LINE_ITEMS.filter((l) => l.group === "Other Digital Tooling & Domains").map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] gap-4 py-1.5 border-b border-dashed border-border/50 print:border-black/10 last:border-0">
              <div className="pr-4">
                <p className="text-xs text-foreground leading-relaxed">{item.desc}</p>
              </div>
              <p className={`text-sm font-mono tabular-nums text-right shrink-0 pt-0.5 ${isPending(item.amount) ? "text-muted-foreground italic" : ""}`}>
                {fmtOrPending(item.amount)}
              </p>
            </div>
          ))}
          <div className="grid grid-cols-[1fr_auto] gap-4 py-2 border-b border-border print:border-black/20 bg-muted/30 -mx-8 px-8 mt-1">
            <p className="text-xs font-semibold text-muted-foreground">Subtotal — Other digital</p>
            <p className={`text-sm font-mono font-semibold tabular-nums text-right ${isPending(OTHER_DIGITAL_SUBTOTAL_002) ? "text-muted-foreground italic" : ""}`}>
              {fmtOrPending(OTHER_DIGITAL_SUBTOTAL_002)}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="px-8 py-5 flex items-center justify-between bg-primary/5 print:bg-white print:border-t print:border-black">
          <div>
            <p className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-serif, serif)" }}>
              Total Amount Due
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {allPending
                ? "Pending — amounts TBD from July 2026 Alterna statement"
                : `Replit (${fmt(REPLIT_SUBTOTAL_002)}) + Other digital (${fmt(OTHER_DIGITAL_SUBTOTAL_002)}) · No HST`}
            </p>
          </div>
          <p className={`text-3xl font-bold font-mono tabular-nums print:text-black ${allPending ? "text-amber-700 italic" : "text-primary"}`}>
            {fmtOrPending(INVOICE_TOTAL_002)}
          </p>
        </div>

        {/* Payment instructions */}
        <div className="px-8 py-5 border-t border-border print:border-black/20 space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Payment instructions
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Payment is due upon receipt. This invoice will be settled when the Headwaters Ontario Corp
            line of credit is approved and drawn. Corp to transfer{" "}
            <strong className="text-foreground">[confirmed total] CAD</strong> to Bobbie Parr's
            personal account (or new dedicated sole-prop account once opened). Reference:{" "}
            <span className="font-mono">{INVOICE_NUMBER_002}</span>.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Journal entries on payment:</strong> Corp — Dr Due to Sole
            Proprietor / Cr Cash. Sole prop — Dr Cash / Cr Due from Corporation. Both intercompany
            balances zero out.
          </p>
        </div>

        {/* Signature block */}
        <div className="px-8 py-6 border-t border-border print:border-black/20 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Authorized by (sole proprietor)
            </p>
            <div className="border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Bobbie Parr · {FROM.tradeName}</p>
            <div className="mt-3 border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Date</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Received by (Corporation)
            </p>
            <div className="border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Headwaters Ontario Corp</p>
            <div className="mt-3 border-b border-foreground/30 print:border-black/40 w-56 mb-1" />
            <p className="text-xs text-muted-foreground">Date</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-3 bg-muted/30 print:bg-transparent border-t border-border print:border-black/20">
          <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
            {FROM.name} · {FROM.tradeName} ({FROM.entityType}) · HST {FROM.hstNumber} ·{" "}
            {FROM.address1}, {FROM.city} · Invoice {INVOICE_NUMBER_002}
          </p>
        </div>
      </div>

      {/* Notes below the invoice — screen only */}
      <div className="mt-6 space-y-2 print:hidden">
        {allPending && (
          <p className="text-xs text-amber-800 font-medium">
            <strong>Action required:</strong> All line items are pending. Edit{" "}
            <code className="font-mono bg-muted px-1 rounded">interEntityReimb2026.ts</code> constants
            (REPLIT_PRINCIPAL_002, REPLIT_FX_FEES_002, GODADDY_DOMAINS_002, RUNWAY_ML_002,
            X_CORP_DEV_002, OTHER_DIGITAL_002) with confirmed CAD amounts from the July 2026 Alterna
            Savings statement. Update status fields to "confirmed" and set jul-2026 checklist item to
            "confirmed" on the planning page.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Supplemental to Invoice REPLIT-DIGITAL-REIMB-2026-001 ($21,496.40 CAD · Apr 17 – Jun 26 2026).
          Same method: CAD card amounts from Alterna statements are the source of truth, not USD Replit invoices.
        </p>
        <p className="text-xs text-muted-foreground">
          This invoice is a reimbursement pass-through — no HST is applicable. Confirm with J.P. Butler, CPA
          before filing.
        </p>
      </div>
    </div>
  );
}

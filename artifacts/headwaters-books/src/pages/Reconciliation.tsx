import { useState } from "react";
import {
  ownerReconciliationSections,
  quickBooksReportsNeeded,
  changelogEntries,
  INVOICE_GROSS_RECEIVED,
  INVOICE_HST,
  INVOICE_UPGRADE_LIABILITY,
  NET_CASH_AFTER_LIABILITIES,
  ESTIMATED_IN_TOTAL,
  type StatusTag,
} from "@/data/ownerReconciliation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, AlertTriangle, FileText, Printer, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const fmt = (val: number | null) =>
  val === null
    ? "—"
    : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(val);

function StatusBadge({ status }: { status: StatusTag }) {
  if (status === "confirmed") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 border text-xs font-medium">
        Confirmed
      </Badge>
    );
  }
  if (status === "estimated") {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 border text-xs font-medium">
        Estimated
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-300 border text-xs font-medium">
      Pending QB
    </Badge>
  );
}

function ReconciliationSection({
  section,
}: {
  section: (typeof ownerReconciliationSections)[number];
}) {
  const total = section.items.reduce((sum, item) => sum + (item.amount ?? 0), 0);

  return (
    <Card className="print:shadow-none print:border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif">{section.title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{section.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-border overflow-hidden rounded-b-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="text-right w-[15%]">Amount</TableHead>
                <TableHead className="w-[35%]">Source / Notes</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.items.map((item, i) => {
                const isTotal = item.description.toLowerCase().includes("total") && item.amount !== null && i === section.items.length - 1;
                return (
                  <TableRow
                    key={i}
                    className={
                      isTotal
                        ? "bg-muted/30 font-semibold border-t-2 border-border"
                        : item.status === "pending-qb"
                        ? "opacity-70 italic"
                        : ""
                    }
                  >
                    <TableCell className={`text-sm ${isTotal ? "font-semibold" : ""}`}>
                      {item.description}
                    </TableCell>
                    <TableCell className={`text-right font-mono text-sm ${isTotal ? "font-semibold" : ""}`}>
                      {fmt(item.amount)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground leading-relaxed">
                      {item.sourceOrNote}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {total > 0 && section.id !== "came-out" && (
                <TableRow className="bg-muted/20 font-semibold border-t border-border">
                  <TableCell className="text-sm font-semibold">Section subtotal (confirmed + estimated)</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">{fmt(total)}</TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Reconciliation() {
  const [qbOpen, setQbOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);

  const conservativeNet = NET_CASH_AFTER_LIABILITIES - ESTIMATED_IN_TOTAL;
  const conservativeOwed = conservativeNet < 0;

  return (
    <div className="space-y-8 pb-16 print:pb-4">
      {/* Print button — hidden in print */}
      <div className="flex justify-between items-start print:hidden">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Owner Reconciliation</h1>
          <p className="text-muted-foreground mt-2">
            Sole proprietor era (Parrs Jars, pre-Nov 2024) vs. 807 Food Co-op transition.
            Real numbers confirmed through Invoice #001056; remaining rows pending QuickBooks export.
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
        <h1 className="text-2xl font-serif font-bold">Owner Reconciliation — Headwaters Books</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Parrs Jars (sole proprietorship, pre-Nov 2024) → 807 Food Co-op transition
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Printed {new Date().toLocaleDateString("en-CA")}</p>
      </div>

      {/* Summary callout */}
      <Alert className="border-primary/30 bg-primary/5 print:border-border">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <AlertDescription className="space-y-3">
          <div>
            <p className="font-semibold text-foreground mb-2">
              Current best estimate — partial, pending QuickBooks confirmation
            </p>

            {/* Step 1: what the invoice actually paid */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Step 1 — What the invoice paid (confirmed)
            </p>
            <div className="text-sm space-y-0.5 mb-3">
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground pl-3">Gross received — Invoice #001056, June 19, 2025 (bank draft)</span>
                <span className="font-mono font-medium text-foreground tabular-nums">{fmt(INVOICE_GROSS_RECEIVED)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground pl-3">Less: HST collected — must be remitted to CRA (13%)</span>
                <span className="font-mono font-medium text-muted-foreground tabular-nums">({fmt(INVOICE_HST)})</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground pl-3">Less: trailer upgrades — paid but not yet delivered (liability to co-op)</span>
                <span className="font-mono font-medium text-muted-foreground tabular-nums">({fmt(INVOICE_UPGRADE_LIABILITY)})</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-primary/20 pt-1 mt-1">
                <span className="font-medium text-foreground pl-3">Net cash applied to owner reimbursement (confirmed)</span>
                <span className="font-mono font-semibold text-foreground tabular-nums">{fmt(NET_CASH_AFTER_LIABILITIES)}</span>
              </div>
            </div>

            {/* Step 2: vs. what went in */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Step 2 — Less what the owner put in (estimated — pending QB)
            </p>
            <div className="text-sm space-y-0.5 mb-3">
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground pl-3">Estimated line-of-credit total (unconfirmed — see Transaction Detail by Account)</span>
                <span className="font-mono font-medium text-muted-foreground tabular-nums">({fmt(ESTIMATED_IN_TOTAL)})</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground pl-3">Personal funds advanced, equipment, P&amp;L loss</span>
                <span className="font-mono text-muted-foreground tabular-nums italic">pending QB</span>
              </div>
            </div>

            {/* Conservative net */}
            <div className="flex justify-between items-baseline border-t-2 border-primary/30 pt-2">
              <span className="font-semibold text-foreground">
                Preliminary net — LOC only, excluding other pending QB items
              </span>
              <span className={`font-mono font-bold tabular-nums text-base ${conservativeOwed ? "text-destructive" : "text-emerald-700"}`}>
                {conservativeOwed ? `(${fmt(Math.abs(conservativeNet))}) owed to owner` : `${fmt(conservativeNet)} surplus`}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed border-t border-primary/10 pt-2">
            <strong>Do not rely on this estimate for decisions.</strong> The figures above exclude personal funds
            advanced, equipment value at transition, operating P&amp;L loss, any prior 807 Food Co-op receivable,
            and the HST remittance/refund position — all pending the four QuickBooks exports listed below.
            The trailer-upgrade liability ({fmt(INVOICE_UPGRADE_LIABILITY)}) also resolves on delivery.
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Confirmed — verified from source document
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Estimated — best guess, not yet verified in QB
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" /> Pending QB — figure must come from QuickBooks export
            </span>
          </div>
        </AlertDescription>
      </Alert>

      {/* Three sections */}
      {ownerReconciliationSections.map((section) => (
        <ReconciliationSection key={section.id} section={section} />
      ))}

      {/* QuickBooks exports needed — collapsible */}
      <Collapsible open={qbOpen} onOpenChange={setQbOpen} className="print:block">
        <Card className="print:shadow-none">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg print:cursor-default print:pointer-events-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base">QuickBooks exports needed</CardTitle>
                    <CardDescription className="text-sm">
                      Four reports the bookkeeper must pull before this reconciliation is complete
                    </CardDescription>
                  </div>
                </div>
                <span className="print:hidden">
                  {qbOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="border-t border-border pt-4 space-y-4">
                {quickBooksReportsNeeded.map((report, i) => (
                  <div
                    key={report.id}
                    className="flex items-start gap-4 p-3 rounded-md border border-border bg-muted/20"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm text-foreground">
                        {report.name}{" "}
                        <span className="font-normal text-muted-foreground">— {report.dateRange}</span>
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{report.purpose}</p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2 italic">
                  In QuickBooks: Reports → Custom Reports → paste date range → Export as Excel or PDF → share with bookkeeper.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
          {/* Always visible in print */}
          <div className="hidden print:block">
            <CardContent className="pt-0">
              <div className="border-t border-border pt-4 space-y-3">
                {quickBooksReportsNeeded.map((report, i) => (
                  <div key={report.id} className="flex items-start gap-3">
                    <span className="font-semibold text-sm">{i + 1}.</span>
                    <div>
                      <span className="font-medium text-sm">{report.name}</span>
                      <span className="text-sm text-muted-foreground"> — {report.dateRange}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{report.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </Collapsible>
      {/* Change history — collapsible */}
      <Collapsible open={changelogOpen} onOpenChange={setChangelogOpen} className="print:block">
        <Card className="print:shadow-none">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg print:cursor-default print:pointer-events-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base">Change history</CardTitle>
                    <CardDescription className="text-sm">
                      Audit trail of what changed and when — {changelogEntries.length} entries
                    </CardDescription>
                  </div>
                </div>
                <span className="print:hidden">
                  {changelogOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent className="print:hidden">
            <CardContent className="pt-0">
              <div className="border-t border-border pt-4 space-y-3">
                {changelogEntries.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-3 rounded-md border border-border bg-muted/20"
                  >
                    <time
                      dateTime={entry.date}
                      className="shrink-0 font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded mt-0.5 whitespace-nowrap"
                    >
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <p className="text-sm text-foreground leading-relaxed">{entry.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
          {/* Always visible in print */}
          <div className="hidden print:block">
            <CardContent className="pt-0">
              <div className="border-t border-border pt-4 space-y-3">
                {changelogEntries.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <time
                      dateTime={entry.date}
                      className="shrink-0 font-mono text-xs font-semibold whitespace-nowrap mt-0.5"
                    >
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <p className="text-xs text-foreground leading-relaxed">{entry.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </Collapsible>
    </div>
  );
}

/**
 * InterEntityReimb2026 — Sole Prop → Headwaters Ontario Corp reimbursement, 2026.
 *
 * Invoice REPLIT-DIGITAL-REIMB-2026-001 · Dated 27 July 2026
 * Period: 17 April 2026 – 26 June 2026
 * Total: $21,496.40 CAD
 *
 * This is a reference/planning page — no database transactions are created here.
 * It is a distinct situation from the existing Reconciliation (pre-Nov 2024 Parrs Jars era).
 */

import { useState } from "react";
import {
  INVOICE_NUMBER,
  INVOICE_DATE,
  INVOICE_PERIOD,
  INVOICE_TOTAL,
  REPLIT_SUBTOTAL,
  OTHER_DIGITAL_SUBTOTAL,
  invoiceGroups,
  entityFlowSteps,
  classificationRows,
  journalEntries,
  solePropCleanupChecklist,
  qbReports2026,
  bookkeeperNotes,
  reimbChangelogEntries,
  executionTracker,
  corpAccountFlowItems,
  corpAccountNetBalance,
  corpAccountBalanceMeta,
  CORP_ACCT_CONFIRMED_OUTFLOWS,
  type ReimbStatus,
  type ChecklistStatus,
  type ExecStatus,
  type CorpAccountFlowItem,
} from "@/data/interEntityReimb2026";
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
import {
  ChevronDown,
  ChevronRight,
  Printer,
  FileText,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

// ── Formatters ─────────────────────────────────────────────────────────────────

const fmt = (val: number | null) =>
  val === null
    ? "—"
    : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(val);

// ── StatusBadge — matches Reconciliation page style ──────────────────────────

function StatusBadge({ status }: { status: ReimbStatus }) {
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
      Pending
    </Badge>
  );
}

function ChecklistBadge({ status }: { status: ChecklistStatus }) {
  if (status === "confirmed") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 border text-xs font-medium">
        Confirmed
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 border text-xs font-medium">
        Pending
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-slate-300 border text-xs font-medium">
      Not started
    </Badge>
  );
}

// ── Execution tracker ─────────────────────────────────────────────────────────

const EXEC_STATUS_CONFIG: Record<ExecStatus, {
  icon: typeof CheckCircle2;
  label: string;
  iconClass: string;
  rowClass: string;
  badgeClass: string;
}> = {
  done: {
    icon: CheckCircle2,
    label: "Done",
    iconClass: "text-emerald-600",
    rowClass: "bg-emerald-50/50 border-emerald-100",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  "in-progress": {
    icon: Loader2,
    label: "In progress",
    iconClass: "text-blue-500",
    rowClass: "bg-blue-50/50 border-blue-100",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  pending: {
    icon: Circle,
    label: "Pending",
    iconClass: "text-slate-300",
    rowClass: "bg-muted/20 border-border",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
  },
  blocked: {
    icon: AlertCircle,
    label: "Blocked",
    iconClass: "text-red-500",
    rowClass: "bg-red-50/50 border-red-100",
    badgeClass: "bg-red-100 text-red-800 border-red-200",
  },
};

function ExecStatusBadge({ status }: { status: ExecStatus }) {
  const cfg = EXEC_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${cfg.badgeClass}`}>
      {status === "in-progress" && <cfg.icon className={`h-2.5 w-2.5 ${cfg.iconClass} animate-spin`} />}
      {cfg.label}
    </span>
  );
}

function ExecutionTracker() {
  const totalSteps = executionTracker.flatMap((p) => p.steps).length;
  const doneSteps = executionTracker.flatMap((p) => p.steps).filter((s) => s.status === "done").length;
  const inProgressSteps = executionTracker.flatMap((p) => p.steps).filter((s) => s.status === "in-progress").length;
  const pct = Math.round((doneSteps / totalSteps) * 100);

  return (
    <Card className="print:shadow-none border-primary/20">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Execution tracker · live status
            </p>
            <CardTitle className="text-lg font-serif">Corp cleanup → LOC → new account</CardTitle>
            <CardDescription className="text-sm mt-1">
              {doneSteps} of {totalSteps} steps complete · {inProgressSteps} in progress
            </CardDescription>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-3xl font-mono font-bold text-primary">{pct}%</p>
            <p className="text-[10px] text-muted-foreground">complete</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {executionTracker.map((phase) => {
          const phaseDone = phase.steps.filter((s) => s.status === "done").length;
          return (
            <div key={phase.id}>
              {/* Phase header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {phase.phase}
                </span>
                <p className="text-sm font-semibold text-foreground">{phase.title}</p>
                <span className="ml-auto text-[10px] text-muted-foreground font-mono shrink-0">
                  {phaseDone}/{phase.steps.length}
                </span>
              </div>

              {/* Steps */}
              <div className="space-y-2 pl-1">
                {phase.steps.map((step, i) => {
                  const cfg = EXEC_STATUS_CONFIG[step.status];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 rounded-lg border px-3 py-3 ${cfg.rowClass}`}
                    >
                      {/* Step number / icon */}
                      <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
                        <Icon
                          className={`h-4 w-4 ${cfg.iconClass} ${step.status === "in-progress" ? "animate-spin" : ""}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <p className={`text-sm font-medium leading-tight ${step.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {step.label}
                          </p>
                          <ExecStatusBadge status={step.status} />
                          {step.amount !== undefined && (
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {step.amountNote ?? ""}{fmt(step.amount)}
                            </span>
                          )}
                          {step.date && (
                            <span className="text-[10px] font-mono text-emerald-700">
                              {new Date(step.date + "T00:00:00").toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <p className="text-[10px] text-muted-foreground italic border-t border-border pt-3">
          To update a step: edit the <code className="font-mono">status</code> field in{" "}
          <code className="font-mono">interEntityReimb2026.ts → executionTracker</code> and set{" "}
          <code className="font-mono">date</code> when completed.
        </p>
      </CardContent>
    </Card>
  );
}

// ── Corp account sole-prop balance ────────────────────────────────────────────

function CorpAccountBalancePanel() {
  const inflows = corpAccountFlowItems.filter((i) => i.direction === "inflow");
  const outflows = corpAccountFlowItems.filter((i) => i.direction === "outflow");

  const confirmedOutflowTotal = CORP_ACCT_CONFIRMED_OUTFLOWS;
  const allInflowsPending = inflows.every((i) => i.amount === null);
  const netIsKnown = corpAccountNetBalance !== null;

  function FlowRow({ item }: { item: CorpAccountFlowItem }) {
    const isInflow = item.direction === "inflow";
    return (
      <TableRow>
        <TableCell className="text-sm leading-snug">{item.description}</TableCell>
        <TableCell className="text-right font-mono text-sm tabular-nums">
          {item.amount !== null ? (
            <span className={isInflow ? "text-emerald-700 font-semibold" : "text-foreground"}>
              {isInflow ? "+" : "−"}{item.amountNote ?? ""}{fmt(item.amount)}
            </span>
          ) : (
            <span className="text-muted-foreground italic text-xs">pending</span>
          )}
        </TableCell>
        <TableCell>
          <StatusBadge status={item.status} />
        </TableCell>
        <TableCell className="text-xs text-muted-foreground leading-relaxed max-w-[260px]">
          {item.note}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Card className="print:shadow-none border-amber-200 bg-amber-50/30">
      <CardHeader className="pb-3 border-b border-amber-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-700 mb-1">
              Alterna Savings · Account {corpAccountBalanceMeta.accountNumber} · {corpAccountBalanceMeta.legalOwner}
            </p>
            <CardTitle className="text-xl font-serif text-foreground">
              Sole-prop funds inside the corp account
            </CardTitle>
            <CardDescription className="text-sm mt-1 leading-relaxed max-w-2xl">
              {corpAccountBalanceMeta.economicOwnerNote}
            </CardDescription>
          </div>
          <div className="shrink-0 text-right">
            {netIsKnown ? (
              <>
                <p className="text-3xl font-mono font-bold text-primary tabular-nums">
                  {fmt(corpAccountNetBalance)}
                </p>
                <p className="text-[10px] text-muted-foreground">net owed to Bobbie</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-mono font-bold text-amber-700 tabular-nums">TBD</p>
                <p className="text-[10px] text-amber-700/80">pending reconciliation</p>
              </>
            )}
          </div>
        </div>

        {/* Status callout */}
        <div className="mt-3 rounded-md bg-amber-100/60 border border-amber-200 px-3 py-2 text-xs text-amber-900 leading-relaxed">
          <span className="font-semibold">Status: </span>
          {corpAccountBalanceMeta.statusNote}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Inflows */}
        <div className="border-b border-amber-100">
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 border text-xs font-medium hover:bg-emerald-100">
              Sole-prop inflows to corp account
            </Badge>
            {allInflowsPending && (
              <span className="text-[10px] text-muted-foreground italic">
                — awaiting bookkeeper statement split
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50/60">
                  <TableHead className="w-[38%]">Description</TableHead>
                  <TableHead className="text-right w-[14%]">Amount (CAD)</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[38%]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inflows.map((item) => (
                  <FlowRow key={item.id} item={item} />
                ))}
                <TableRow className="bg-emerald-50 border-t-2 border-emerald-200 font-semibold">
                  <TableCell className="text-sm font-semibold">Total sole-prop inflows</TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums text-muted-foreground italic">
                    pending
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Outflows */}
        <div className="border-b border-amber-100">
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <Badge className="bg-rose-100 text-rose-800 border-rose-200 border text-xs font-medium hover:bg-rose-100">
              Sole-prop outflows already paid from corp account
            </Badge>
            <span className="text-[10px] text-muted-foreground italic">
              — reduce the amount corp owes back
            </span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-rose-50/60">
                  <TableHead className="w-[38%]">Description</TableHead>
                  <TableHead className="text-right w-[14%]">Amount (CAD)</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[38%]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outflows.map((item) => (
                  <FlowRow key={item.id} item={item} />
                ))}
                <TableRow className="bg-rose-50 border-t-2 border-rose-200 font-semibold">
                  <TableCell className="text-sm font-semibold">
                    Total confirmed outflows
                    <span className="font-normal text-muted-foreground ml-1 text-xs">(others pending)</span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums">
                    −{fmt(confirmedOutflowTotal)}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Net balance */}
        <div className="flex items-start justify-between gap-4 px-4 py-4 bg-amber-50/60 border-t border-amber-200">
          <div>
            <p className="font-bold text-base text-foreground font-serif">
              Net sole-prop balance — corp owes back to Bobbie
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xl">
              Inflows (pending) minus confirmed outflows (
              {fmt(confirmedOutflowTotal)}). Full net cannot be computed until the bookkeeper
              splits the Jan–Jun 2026 Alterna statements. Settlement mechanism:{" "}
              Invoice {corpAccountBalanceMeta.settlementInstrument} (
              {fmt(corpAccountBalanceMeta.settlementInstrumentAmount)}).
            </p>
          </div>
          <div className="text-right shrink-0">
            {netIsKnown ? (
              <p className="font-mono text-2xl font-bold text-primary tabular-nums">
                {fmt(corpAccountNetBalance)}
              </p>
            ) : (
              <div>
                <p className="font-mono text-xl font-bold text-amber-700 tabular-nums">TBD</p>
                <p className="text-[10px] text-amber-700/80 mt-0.5">
                  Confirmed outflows: {fmt(confirmedOutflowTotal)}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground italic px-4 pb-3 pt-1">
          To update figures: edit <code className="font-mono">corpAccountFlowItems</code> in{" "}
          <code className="font-mono">interEntityReimb2026.ts</code> and set{" "}
          <code className="font-mono">amount</code> values as the bookkeeper reconciles each line.
          Set <code className="font-mono">corpAccountNetBalance</code> to the final computed total
          once all figures are confirmed.
        </p>
      </CardContent>
    </Card>
  );
}

// ── (a) Invoice block ──────────────────────────────────────────────────────────

function InvoiceBlock() {
  return (
    <Card className="print:shadow-none print:border-border">
      {/* Invoice header */}
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Invoice
            </p>
            <CardTitle className="text-xl font-serif">{INVOICE_NUMBER}</CardTitle>
            <CardDescription className="mt-1">
              Date:{" "}
              {new Date(INVOICE_DATE + "T00:00:00").toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              · Period: {INVOICE_PERIOD} · Due: Upon receipt
            </CardDescription>
          </div>
          <div className="text-left sm:text-right shrink-0 space-y-1">
            <p className="text-xs text-muted-foreground">
              <strong>From:</strong> [Sole Proprietor Legal Name]
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>To:</strong> Headwaters Ontario Corp
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          Reimbursement of digital development and tooling costs paid on the sole-proprietorship
          Alterna Savings credit card on behalf of the Corporation during the period {INVOICE_PERIOD}.
          These costs relate exclusively to software development platforms, domains, AI tooling, and
          related digital infrastructure used for the Corporation's projects.
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {invoiceGroups.map((group) => (
          <div key={group.id} className="border-b border-border last:border-b-0">
            <div className="px-4 pt-4 pb-2">
              <p className="text-sm font-semibold text-foreground">{group.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{group.subtitle}</p>
            </div>
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-[40%]">Description</TableHead>
                    <TableHead className="text-right w-[15%]">Amount (CAD)</TableHead>
                    <TableHead className="w-[35%]">Notes</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm">{item.description}</TableCell>
                      <TableCell className="text-right font-mono text-sm tabular-nums">
                        {fmt(item.amount)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground leading-relaxed">
                        {item.note}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/30 font-semibold border-t-2 border-border">
                    <TableCell className="text-sm font-semibold">
                      Subtotal — {group.title}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold tabular-nums">
                      {fmt(group.subtotal)}
                    </TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ))}

        {/* Grand total */}
        <div className="flex items-center justify-between px-4 py-4 bg-primary/5 border-t-2 border-primary/20">
          <div>
            <p className="font-bold text-base text-foreground font-serif">
              TOTAL AMOUNT DUE — Invoice {INVOICE_NUMBER}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Replit ({fmt(REPLIT_SUBTOTAL)}) + Other digital ({fmt(OTHER_DIGITAL_SUBTOTAL)})
            </p>
          </div>
          <p className="font-mono text-2xl font-bold text-primary tabular-nums">
            {fmt(INVOICE_TOTAL)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── (c) Entity flow strip ──────────────────────────────────────────────────────

function EntityFlowStrip() {
  return (
    <Card className="print:shadow-none print:border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Entity flow — how the money moves</CardTitle>
        <CardDescription className="text-sm">
          From personal card through both sets of books and back
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-start gap-y-3 gap-x-0">
          {entityFlowSteps.map((step, i) => (
            <div key={step.id} className="flex items-start gap-0">
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-lg px-3 py-2 text-center min-w-[120px] max-w-[160px] border ${
                    step.id === "invoice"
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted/50 border-border"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold leading-tight ${
                      step.id === "invoice" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.sublabel && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                      {step.sublabel}
                    </p>
                  )}
                </div>
              </div>
              {i < entityFlowSteps.length - 1 && (
                <div className="flex items-center self-center px-1.5">
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── (d) Corp vs. sole-prop classification table ────────────────────────────────

function ClassificationTable() {
  const corpRows = classificationRows.filter((r) => r.entity === "corp");
  const solePropRows = classificationRows.filter((r) => r.entity === "sole-prop");

  return (
    <Card className="print:shadow-none print:border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-serif">Corp vs. Sole Prop — charge classification</CardTitle>
        <CardDescription className="text-sm">
          Which Apr–Jun 2026 card charges go to the Corp (digital dev) and which stay with the sole prop
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Corp section */}
        <div className="border-t border-border">
          <div className="px-4 pt-3 pb-1">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 border text-xs font-medium hover:bg-blue-100">
              Corporation — invoiced back
            </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[30%]">Category</TableHead>
                <TableHead className="text-right w-[15%]">Amount (CAD)</TableHead>
                <TableHead className="w-[45%]">Reason</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {corpRows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{row.category}</TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums">
                    {row.amount !== null
                      ? `${row.amountNote ?? ""}${fmt(row.amount)}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground leading-relaxed">
                    {row.reason}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-blue-50 font-semibold border-t-2 border-blue-200">
                <TableCell className="text-sm font-semibold">Corp total (invoiced)</TableCell>
                <TableCell className="text-right font-mono text-sm font-semibold tabular-nums">
                  {fmt(INVOICE_TOTAL)}
                </TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Sole prop section */}
        <div className="border-t border-border">
          <div className="px-4 pt-3 pb-1">
            <Badge className="bg-slate-100 text-slate-700 border-slate-300 border text-xs font-medium hover:bg-slate-100">
              Sole Proprietorship — stays with sole prop
            </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[30%]">Category</TableHead>
                <TableHead className="text-right w-[15%]">Amount</TableHead>
                <TableHead className="w-[45%]">Reason</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solePropRows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{row.category}</TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums text-muted-foreground">
                    Not invoiced
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground leading-relaxed">
                    {row.reason}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ── (e) Bookkeeper journal entries ────────────────────────────────────────────

function JournalEntriesPanel() {
  const solePropEntry = journalEntries.find((e) => e.entity === "sole-prop")!;
  const corpEntry = journalEntries.find((e) => e.id === "corp-entry")!;
  const clearingEntry = journalEntries.find((e) => e.id === "clearing-entry")!;

  function EntryCard({ entry }: { entry: typeof journalEntries[number] }) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground">
            {entry.entity === "sole-prop" ? "Sole Proprietorship" : "Headwaters Ontario Corp"}
          </p>
          <p className="font-semibold text-sm text-foreground mt-0.5">{entry.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{entry.description}</p>
        </div>
        <div className="rounded-md bg-card border border-border px-3 py-2 font-mono text-xs space-y-1">
          {entry.lines.map((line, i) => (
            <div key={i} className="flex justify-between items-baseline gap-4">
              <span
                className={`${
                  line.side === "debit" ? "font-semibold text-foreground" : "pl-6 text-muted-foreground"
                }`}
              >
                {line.side === "debit" ? "Dr" : "Cr"} {line.account}
              </span>
              <span className="tabular-nums shrink-0">
                {typeof line.amount === "number" ? fmt(line.amount) : line.amount}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{entry.note}</p>
      </div>
    );
  }

  return (
    <Card className="print:shadow-none print:border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-serif">Bookkeeper journal entries</CardTitle>
        <CardDescription className="text-sm">
          Double-entry on both sides of the invoice, plus the clearing entry when Corp pays
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EntryCard entry={solePropEntry} />
          <EntryCard entry={corpEntry} />
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Clearing entry — when Corp LOC pays
          </p>
          <EntryCard entry={clearingEntry} />
        </div>
      </CardContent>
    </Card>
  );
}

// ── (f) Sole-prop Jan–Jul 2026 cleanup checklist ──────────────────────────────

function CleanupChecklist() {
  return (
    <Card className="print:shadow-none print:border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-serif">Sole-prop Jan–Jul 2026 cleanup checklist</CardTitle>
        <CardDescription className="text-sm">
          Status of each month/topic in the sole-prop cleanup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {solePropCleanupChecklist.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-md border border-border bg-muted/20"
          >
            <div className="mt-0.5 shrink-0">
              <ChecklistBadge status={item.status} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── (g) Collapsible QB reports ────────────────────────────────────────────────

function QBReportsCollapsible({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="print:block">
      <Card className="print:shadow-none">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg print:cursor-default print:pointer-events-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">QuickBooks to-do</CardTitle>
                  <CardDescription className="text-sm">
                    Reports needed to close the Jan–Jul 2026 period — {qbReports2026.length} items
                  </CardDescription>
                </div>
              </div>
              <span className="print:hidden">
                {open ? (
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
            <div className="border-t border-border pt-4 space-y-3">
              {qbReports2026.map((report, i) => (
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
                In QuickBooks: Reports → Custom Reports → paste date range → Export as Excel or PDF →
                share with bookkeeper.
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
        {/* Always visible in print */}
        <div className="hidden print:block">
          <CardContent className="pt-0">
            <div className="border-t border-border pt-4 space-y-3">
              {qbReports2026.map((report, i) => (
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
  );
}

// ── (h) Bookkeeper notes callout ──────────────────────────────────────────────

function BookkeeperNotesCallout() {
  return (
    <Alert className="border-blue-200 bg-blue-50 print:border-border print:bg-transparent">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="space-y-3 mt-1">
        <p className="font-semibold text-blue-900">Bookkeeper key rules</p>
        <div className="space-y-3">
          {bookkeeperNotes.map((note) => (
            <div key={note.id}>
              <p className="text-sm font-medium text-blue-900">{note.heading}</p>
              <p className="text-xs text-blue-800 leading-relaxed mt-0.5">{note.body}</p>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// ── (i) Change log ────────────────────────────────────────────────────────────

function ChangeLog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="print:block">
      <Card className="print:shadow-none">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg print:cursor-default print:pointer-events-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">Change history</CardTitle>
                  <CardDescription className="text-sm">
                    Audit trail of what changed and when — {reimbChangelogEntries.length} entries
                  </CardDescription>
                </div>
              </div>
              <span className="print:hidden">
                {open ? (
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
              {reimbChangelogEntries.map((entry, i) => (
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
              {reimbChangelogEntries.map((entry, i) => (
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
  );
}

// ── Invoice index strip ────────────────────────────────────────────────────────

function InvoiceIndexStrip() {
  const [, setLocation] = useLocation();
  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      {/* Invoice 001 */}
      <button
        onClick={() => setLocation("/invoice/reimb-2026-001")}
        className="flex items-center gap-3 flex-1 min-w-[220px] rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-left hover:bg-emerald-100 transition-colors"
      >
        <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-mono font-semibold text-emerald-900 truncate">
            REPLIT-DIGITAL-REIMB-2026-001
          </p>
          <p className="text-[11px] text-emerald-800 mt-0.5">
            Apr 17 – Jun 26 2026 · $21,496.40 CAD · Confirmed
          </p>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-auto" />
      </button>

      {/* Invoice 002 */}
      <button
        onClick={() => setLocation("/invoice/reimb-2026-002")}
        className="flex items-center gap-3 flex-1 min-w-[220px] rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left hover:bg-amber-100 transition-colors"
      >
        <FileText className="w-4 h-4 text-amber-700 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-mono font-semibold text-amber-900 truncate">
            REPLIT-DIGITAL-REIMB-2026-002
          </p>
          <p className="text-[11px] text-amber-800 mt-0.5">
            Jun 27 – Jul 31 2026 · Amounts pending — Jul statement needed
          </p>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-auto" />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function InterEntityReimb2026() {
  const [qbOpen, setQbOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);

  return (
    <div className="space-y-8 pb-16 print:pb-4">
      {/* (a) Page header with Print button — hidden in print */}
      <div className="flex justify-between items-start print:hidden">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Sole Prop → Corp · Inter-entity reimbursement
          </p>
          <h1 className="text-3xl font-serif font-bold text-foreground">2026 Reimbursement</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Invoice {INVOICE_NUMBER} · {INVOICE_PERIOD} · Digital development costs paid on the
            sole-prop Alterna card on behalf of Headwaters Ontario Corp.
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

      {/* Invoice index strip */}
      <InvoiceIndexStrip />

      {/* Print-only header */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-serif font-bold">
          2026 Reimbursement — Headwaters Books
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Invoice {INVOICE_NUMBER} · Sole Proprietorship → Headwaters Ontario Corp · {INVOICE_PERIOD}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Printed {new Date().toLocaleDateString("en-CA")}
        </p>
      </div>

      {/* Execution tracker */}
      <ExecutionTracker />

      {/* Corp account sole-prop balance */}
      <CorpAccountBalancePanel />

      {/* (b) Invoice block */}
      <InvoiceBlock />

      {/* (c) Entity flow strip */}
      <EntityFlowStrip />

      {/* (d) Corp vs. sole-prop classification table */}
      <ClassificationTable />

      {/* (e) Bookkeeper journal entries */}
      <JournalEntriesPanel />

      {/* (f) Sole-prop Jan–Jul 2026 cleanup checklist */}
      <CleanupChecklist />

      {/* (g) QuickBooks to-do — collapsible */}
      <QBReportsCollapsible open={qbOpen} onOpenChange={setQbOpen} />

      {/* (h) Bookkeeper notes callout */}
      <BookkeeperNotesCallout />

      {/* (i) Change log — collapsible */}
      <ChangeLog open={changelogOpen} onOpenChange={setChangelogOpen} />
    </div>
  );
}

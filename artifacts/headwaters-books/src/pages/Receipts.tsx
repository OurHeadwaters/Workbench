import { useState } from "react";
import {
  useGetUnclearedReceipts,
  useGetReconciliationSummary,
  useToggleTransactionCleared,
  getGetUnclearedReceiptsQueryKey,
  getGetBookkeeperDashboardQueryKey,
  getGetReconciliationSummaryQueryKey,
  getGetUnclearedReceiptsUrl,
} from "@workspace/api-client-react";
import type { UnclearedReceiptItem } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Loader2,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Download,
  BarChart2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

function ReceiptRow({
  item,
  onToggle,
  isToggling,
}: {
  item: UnclearedReceiptItem;
  onToggle: () => void;
  isToggling: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={onToggle}
          disabled={isToggling}
          className="shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          title="Mark as cleared"
          data-testid={`clear-toggle-${item.id}`}
        >
          {isToggling ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : item.cleared ? (
            <CheckCircle2 className="w-5 h-5 text-primary" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={() => setExpanded(v => !v)}
          className="flex-1 text-left flex items-center gap-2 min-w-0"
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{item.description}</p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-muted-foreground font-mono">
                {format(new Date(item.postedDate), "MMM d, yyyy")}
              </span>
              {item.reference && (
                <span className="text-xs text-muted-foreground">ref: {item.reference}</span>
              )}
              {item.attachmentCount > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  {item.attachmentCount} attachment{item.attachmentCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </button>

        <div className="shrink-0 text-right">
          <p className="text-sm font-mono font-medium">{fmt(item.totalDebit)}</p>
          <p className="text-xs text-muted-foreground">{item.lines.length} lines</p>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border bg-muted/20 px-4 py-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left pb-1 font-medium">Account</th>
                <th className="text-left pb-1 font-medium">Tax Code</th>
                <th className="text-left pb-1 font-medium">Cost Centre</th>
                <th className="text-right pb-1 font-medium">Debit</th>
                <th className="text-right pb-1 font-medium">Credit</th>
              </tr>
            </thead>
            <tbody>
              {item.lines.map(line => (
                <tr key={line.id} className="border-t border-border/40">
                  <td className="py-1">
                    <span className="font-mono text-muted-foreground">{line.accountCode}</span>
                    {" "}
                    <span className="text-foreground">{line.accountName}</span>
                  </td>
                  <td className="py-1">
                    {line.taxCode ? (
                      <Badge variant="outline" className="text-[10px] font-mono px-1 py-0">
                        {line.taxCode}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-1 text-muted-foreground">{line.costCentreCode ?? "—"}</td>
                  <td className="py-1 text-right font-mono tabular-nums">
                    {line.debit > 0 ? fmt(line.debit) : "—"}
                  </td>
                  <td className="py-1 text-right font-mono tabular-nums">
                    {line.credit > 0 ? fmt(line.credit) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReconciliationPanel({ from, to }: { from: string; to: string }) {
  const params = {
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  };
  const { data, isLoading } = useGetReconciliationSummary(
    Object.keys(params).length > 0 ? params : undefined,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.accounts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No transactions in this period.
      </p>
    );
  }

  const { accounts, totals } = data;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left pb-2 font-medium">Account</th>
            <th className="text-right pb-2 font-medium text-primary">Cleared Dr</th>
            <th className="text-right pb-2 font-medium text-primary">Cleared Cr</th>
            <th className="text-right pb-2 font-medium text-amber-600 dark:text-amber-400">Uncleared Dr</th>
            <th className="text-right pb-2 font-medium text-amber-600 dark:text-amber-400">Uncleared Cr</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(row => (
            <tr key={row.accountCode} className="border-t border-border/40">
              <td className="py-1.5">
                <span className="font-mono text-muted-foreground">{row.accountCode}</span>
                {" "}
                <span>{row.accountName}</span>
                {row.accountType && (
                  <span className="ml-1.5 text-[10px] text-muted-foreground">({row.accountType})</span>
                )}
              </td>
              <td className="py-1.5 text-right font-mono tabular-nums text-primary">
                {row.clearedDebit > 0 ? fmt(row.clearedDebit) : "—"}
              </td>
              <td className="py-1.5 text-right font-mono tabular-nums text-primary">
                {row.clearedCredit > 0 ? fmt(row.clearedCredit) : "—"}
              </td>
              <td className="py-1.5 text-right font-mono tabular-nums text-amber-600 dark:text-amber-400">
                {row.unclearedDebit > 0 ? fmt(row.unclearedDebit) : "—"}
              </td>
              <td className="py-1.5 text-right font-mono tabular-nums text-amber-600 dark:text-amber-400">
                {row.unclearedCredit > 0 ? fmt(row.unclearedCredit) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border font-semibold text-sm">
            <td className="pt-2">Totals</td>
            <td className="pt-2 text-right font-mono tabular-nums text-primary">
              {fmt(totals.clearedDebit)}
            </td>
            <td className="pt-2 text-right font-mono tabular-nums text-primary">
              {fmt(totals.clearedCredit)}
            </td>
            <td className="pt-2 text-right font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {fmt(totals.unclearedDebit)}
            </td>
            <td className="pt-2 text-right font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {fmt(totals.unclearedCredit)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default function Receipts() {
  const queryClient = useQueryClient();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showReconciliation, setShowReconciliation] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const dateParams = {
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  };
  const hasDateFilter = Boolean(from || to);

  const { data, isLoading } = useGetUnclearedReceipts(
    hasDateFilter ? dateParams : undefined,
  );
  const toggleCleared = useToggleTransactionCleared();

  const handleToggle = (item: UnclearedReceiptItem) => {
    const newCleared = !item.cleared;
    setTogglingIds(prev => new Set(prev).add(item.id));
    toggleCleared.mutate(
      { id: item.id, data: { cleared: newCleared } },
      {
        onSuccess: () => {
          toast.success(newCleared ? "Marked as cleared" : "Marked as uncleared");
          queryClient.invalidateQueries({
            queryKey: getGetUnclearedReceiptsQueryKey(hasDateFilter ? dateParams : undefined),
          });
          queryClient.invalidateQueries({ queryKey: getGetBookkeeperDashboardQueryKey() });
          queryClient.invalidateQueries({
            queryKey: getGetReconciliationSummaryQueryKey(hasDateFilter ? dateParams : undefined),
          });
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to update");
        },
        onSettled: () => {
          setTogglingIds(prev => {
            const next = new Set(prev);
            next.delete(item.id);
            return next;
          });
        },
      },
    );
  };

  const handleExportCsv = () => {
    const url = getGetUnclearedReceiptsUrl(hasDateFilter ? dateParams : undefined)
      .replace("/receipts/uncleared", "/receipts/uncleared/csv");
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const clearDateFilter = () => {
    setFrom("");
    setTo("");
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Reconciliation
            </p>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Receipts Queue</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Posted transactions not yet cleared against a bank statement.
          </p>
        </div>
        {!isLoading && (
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{total}</p>
            <p className="text-xs text-muted-foreground">uncleared</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <Label htmlFor="date-from" className="text-xs text-muted-foreground">From</Label>
            <Input
              id="date-from"
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="h-8 text-sm w-36"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="date-to" className="text-xs text-muted-foreground">To</Label>
            <Input
              id="date-to"
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="h-8 text-sm w-36"
            />
          </div>
          {hasDateFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDateFilter}
              className="h-8 px-2 text-muted-foreground"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReconciliation(v => !v)}
            className="h-8 gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            {showReconciliation ? "Hide" : "Show"} Summary
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-8 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {showReconciliation && (
        <div className="border border-border rounded-xl p-4 bg-card">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            Reconciliation Summary
            {hasDateFilter && (
              <span className="text-xs text-muted-foreground font-normal">
                {from && to ? `${from} → ${to}` : from ? `from ${from}` : `to ${to}`}
              </span>
            )}
          </h2>
          <ReconciliationPanel from={from} to={to} />
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-xl">
          <CheckCircle2 className="w-10 h-10 text-primary mb-3" />
          <p className="font-medium text-foreground">All caught up</p>
          <p className="text-sm text-muted-foreground mt-1">
            {hasDateFilter
              ? "No uncleared transactions in this date range."
              : "Every posted transaction has been cleared."}
          </p>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Click the circle to mark a transaction as cleared. Expand rows to inspect lines and tax codes.
          </p>
          {items.map(item => (
            <ReceiptRow
              key={item.id}
              item={item}
              onToggle={() => handleToggle(item)}
              isToggling={togglingIds.has(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

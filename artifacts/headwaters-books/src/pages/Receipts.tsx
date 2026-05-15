import { useState } from "react";
import { 
  useGetUnclearedReceipts,
  useToggleTransactionCleared,
  getGetUnclearedReceiptsQueryKey,
  getGetBookkeeperDashboardQueryKey,
} from "@workspace/api-client-react";
import type { UnclearedReceiptItem } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  CheckCircle2, Circle, Loader2, ClipboardCheck, ChevronDown, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function Receipts() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetUnclearedReceipts();
  const toggleCleared = useToggleTransactionCleared();
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const handleToggle = (item: UnclearedReceiptItem) => {
    const newCleared = !item.cleared;
    setTogglingIds(prev => new Set(prev).add(item.id));
    toggleCleared.mutate(
      { id: item.id, data: { cleared: newCleared } },
      {
        onSuccess: () => {
          toast.success(newCleared ? "Marked as cleared" : "Marked as uncleared");
          queryClient.invalidateQueries({ queryKey: getGetUnclearedReceiptsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetBookkeeperDashboardQueryKey() });
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
            Every posted transaction has been cleared.
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

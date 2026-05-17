import { useGetMyHhEarnings, useGetHhBand } from "@workspace/api-client-react";
import { Loader2, Coins, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function HHEarnings() {
  const { data: band } = useGetHhBand();
  const { data, isLoading } = useGetMyHhEarnings();
  const tokenCode = band?.communityTokenCode ?? "HWBAND";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const d = data!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">My earnings</h1>
        <p className="text-muted-foreground mt-1">Every payment you've received, recorded on XRPL and owned by you.</p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs text-muted-foreground mb-1">Total in {tokenCode}</p>
          <p className="text-3xl font-bold text-foreground">{parseFloat(d.totalToken).toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-0.5">community tokens</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs text-muted-foreground mb-1">Total in XRP</p>
          <p className="text-3xl font-bold text-foreground">{parseFloat(d.totalXrp).toFixed(4)}</p>
          <p className="text-sm text-muted-foreground mt-0.5">XRP</p>
        </div>
      </div>

      {/* DID note */}
      <div className="bg-muted/40 border border-border rounded-lg p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Your record, your property.</strong>{" "}
        This payment history is tied to your XRPL identity (DID). It travels with you — if you work with another band using Helping Hands, your full track record comes with you.
      </div>

      {/* Earnings list */}
      {d.earnings.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No earnings yet. Claim a task to get started.</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          {d.earnings.map((e, i, arr) => (
            <div key={e.id} className={`flex items-center gap-4 p-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{e.taskTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(e.earnedAt), "MMM d, yyyy")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-foreground">
                  {parseFloat(e.amount).toFixed(e.currency === "xrp" ? 4 : 2)}
                </p>
                <Badge className={`text-[10px] ${e.currency === "xrp" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"} border-0`}>
                  {e.currency === "xrp" ? "XRP" : tokenCode}
                </Badge>
              </div>
              {e.xrplTxHash && (
                <a
                  href={`https://livenet.xrpl.org/transactions/${e.xrplTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground shrink-0"
                  title="View on XRPL"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

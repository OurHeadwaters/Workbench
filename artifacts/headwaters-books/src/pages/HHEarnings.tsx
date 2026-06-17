import { useGetMyHhEarnings, useGetHhBand } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Loader2, Coins, ExternalLink, HelpCircle, Key, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";

interface WalletData {
  walletType: string;
  xrplAddress?: string | null;
  tokenBalance: string;
  walletRevealed: boolean;
}

export default function HHEarnings() {
  const { data: band } = useGetHhBand();
  const { data, isLoading } = useGetMyHhEarnings();
  const { data: wallet } = useQuery<WalletData>({
    queryKey: ["hh-wallet-reveal"],
    queryFn: () => customFetch<WalletData>("/helping-hands/my/wallet", {}),
    staleTime: 60_000,
  });
  const tokenCode = band?.communityTokenCode ?? "HWBAND";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const d = data!;
  const isCustodial = !wallet || wallet.walletType === "custodial";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">My earnings</h1>
        <p className="text-muted-foreground mt-1">Every payment you've received, recorded on XRPL and owned by you.</p>
      </div>

      {isCustodial && wallet?.walletRevealed && (
        <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <div className="flex items-start gap-2.5">
            <Key className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900">Your wallet is custodial</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Headwaters holds your keys. Move to self-custody to own your funds directly.
              </p>
            </div>
          </div>
          <Link href="/helping-hands/wallet/claim" className="shrink-0">
            <Button size="sm" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100 whitespace-nowrap">
              Claim wallet
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Inline "What is this?" explainer — always visible */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
        <HelpCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-amber-900">
          <strong>What is this?</strong>{" "}
          These are community credits, not bank dollars — but they're real value you own completely.
          They don't expire and you can spend them at participating stores in your community, or tip them to other members.
        </p>
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
              {e.xrplTxHash && !e.xrplTxHash.startsWith("SIM_") && !e.xrplTxHash.startsWith("ERR_") && (
                <a
                  href={
                    band?.xrplNetwork === "mainnet"
                      ? `https://livenet.xrpl.org/transactions/${e.xrplTxHash}`
                      : `https://testnet.xrpl.org/transactions/${e.xrplTxHash}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground shrink-0"
                  title={`View on XRPL ${band?.xrplNetwork ?? "testnet"}`}
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

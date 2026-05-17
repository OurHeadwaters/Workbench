import { Loader2, Store, ExternalLink, ArrowLeft } from "lucide-react";
import { customFetch } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { format } from "date-fns";

interface Transaction {
  id: string;
  envelopeId: string;
  merchantId: string;
  merchantName: string;
  amount: string;
  currency: string;
  note: string;
  xrplTxHash: string | null;
  spentAt: string;
}

interface Envelope {
  id: string;
  label: string;
  icon: string;
  currency: string;
  monthlyBudget: string;
  spentThisMonth: string;
}

export default function HHEnvelopeHistory() {
  const params = useParams<{ id: string }>();
  const envelopeId = params.id;

  const { data: envelope } = useQuery<Envelope>({
    queryKey: ["hh-envelope", envelopeId],
    queryFn: () =>
      customFetch<Envelope[]>("/helping-hands/my/envelopes", {}).then(
        (list) => list.find((e) => e.id === envelopeId) ?? Promise.reject(new Error("Envelope not found")),
      ),
    enabled: Boolean(envelopeId),
  });

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["hh-envelope-txns", envelopeId],
    queryFn: () =>
      customFetch<Transaction[]>(`/helping-hands/my/envelopes/${envelopeId}/transactions`, {}),
    enabled: Boolean(envelopeId),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/helping-hands/envelopes">
          <button className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to envelopes
          </button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          {envelope ? `${envelope.label} history` : "Spending history"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Every purchase made from this envelope, recorded on XRPL.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Store className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No purchases yet.</p>
          <p className="text-sm mt-1">When you spend from this envelope at a store, transactions will appear here.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          {transactions.map((txn, i, arr) => (
            <div
              key={txn.id}
              className={`flex items-center gap-4 p-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Store className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{txn.merchantName}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(txn.spentAt), "MMM d, yyyy · h:mm a")}
                  {txn.note ? ` · ${txn.note}` : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-foreground">
                  {parseFloat(txn.amount).toFixed(txn.currency === "xrp" ? 6 : 2)}
                </p>
                <p className="text-xs text-muted-foreground">{txn.currency === "xrp" ? "XRP" : "tokens"}</p>
              </div>
              {txn.xrplTxHash && !txn.xrplTxHash.startsWith("SIM_") && (
                <a
                  href={`https://livenet.xrpl.org/transactions/${txn.xrplTxHash}`}
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

      {/* Summary */}
      {transactions.length > 0 && (
        <div className="bg-muted/40 border border-border rounded-lg p-4 text-sm text-muted-foreground flex items-center justify-between">
          <span>{transactions.length} transaction{transactions.length !== 1 ? "s" : ""}</span>
          <span className="font-semibold text-foreground">
            Total spent:{" "}
            {transactions
              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
              .toFixed(transactions[0]?.currency === "xrp" ? 6 : 2)}{" "}
            {transactions[0]?.currency === "xrp" ? "XRP" : "tokens"}
          </span>
        </div>
      )}
    </div>
  );
}

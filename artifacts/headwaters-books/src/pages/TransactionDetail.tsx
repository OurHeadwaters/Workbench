import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  useGetTransaction, 
  useVoidTransaction,
  getGetTransactionQueryKey,
  getListTransactionsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function TransactionDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [voidReason, setVoidReason] = useState("");
  const [isVoidDialogOpen, setIsVoidDialogOpen] = useState(false);
  
  const { data: txn, isLoading } = useGetTransaction(id, { 
    query: { enabled: !!id, queryKey: getGetTransactionQueryKey(id) } 
  });
  
  const voidTxn = useVoidTransaction();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  const handleVoid = () => {
    if (voidReason.length < 3) return;
    
    voidTxn.mutate({
      data: { reason: voidReason },
      id
    }, {
      onSuccess: () => {
        toast.success("Transaction voided successfully");
        setIsVoidDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetTransactionQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to void transaction");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!txn) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Transaction not found.
      </div>
    );
  }

  const isVoided = txn.status === "voided";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/transactions">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold text-foreground">Journal Entry</h1>
              <Badge variant={isVoided ? "outline" : "default"} className={isVoided ? "text-destructive border-destructive" : "bg-primary"}>
                {txn.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">{txn.id}</p>
          </div>
        </div>

        {!isVoided && (
          <Dialog open={isVoidDialogOpen} onOpenChange={setIsVoidDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" data-testid="action-void">
                Void Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Void Transaction</DialogTitle>
                <DialogDescription>
                  This will write a reversing journal entry to cancel out this transaction. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Reason for voiding</Label>
                  <Input 
                    placeholder="e.g. Posted in error, wrong amount..."
                    value={voidReason}
                    onChange={(e) => setVoidReason(e.target.value)}
                    data-testid="input-void-reason"
                  />
                  <p className="text-xs text-muted-foreground">Required (min 3 characters)</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsVoidDialogOpen(false)}>Cancel</Button>
                <Button 
                  variant="destructive" 
                  onClick={handleVoid}
                  disabled={voidReason.length < 3 || voidTxn.isPending}
                  data-testid="action-confirm-void"
                >
                  {voidTxn.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Confirm Void
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Date</div>
                <div className="font-medium">{format(new Date(txn.postedDate), 'MMMM d, yyyy')}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Reference</div>
                <div className="font-medium">{txn.reference || '-'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground mb-1">Description</div>
                <div className="font-medium">{txn.description}</div>
              </div>
            </div>
            
            {isVoided && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-destructive">Voided Entry</h4>
                    <p className="text-sm text-destructive/80 mt-1">Reason: {txn.voidedReason}</p>
                    {txn.reversesTransactionId && (
                      <p className="text-sm mt-2">
                        <Link href={`/transactions/${txn.reversesTransactionId}`} className="underline font-medium hover:text-destructive">
                          View Reversing Entry
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Created By</div>
              <div className="font-medium">{txn.createdByEmail}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Created At</div>
              <div className="font-medium">{format(new Date(txn.createdAt), 'MMM d, yyyy h:mm a')}</div>
            </div>
            {txn.sourceSubmissionId && (
              <div>
                <div className="text-muted-foreground mb-1">Source</div>
                <Badge variant="secondary">Receipt Submission</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Lines</CardTitle>
          <div className="text-sm font-mono bg-muted px-3 py-1 rounded-md flex gap-4">
            <span>Debit: {formatCurrency(txn.totalDebit)}</span>
            <span>Credit: {formatCurrency(txn.totalCredit)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Cost Centre</TableHead>
                  <TableHead>Memo</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txn.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <div className="font-medium">{line.accountCode}</div>
                      <div className="text-xs text-muted-foreground">{line.accountName}</div>
                    </TableCell>
                    <TableCell>{line.costCentreCode || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{line.memo || '-'}</TableCell>
                    <TableCell className="text-right">{line.debit > 0 ? formatCurrency(line.debit) : '-'}</TableCell>
                    <TableCell className="text-right">{line.credit > 0 ? formatCurrency(line.credit) : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { 
  useEngagement, useChangeEngagementState, useCreateMilestone, 
  useCreateChangeOrder, useCreateHandoff, useCreateInvoice,
  useApproveInvoice, useRecordPayment, usePostPostingRequest, useReconcilePayment, EngagementState
} from "@/hooks/use-engagements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { 
  Loader2, ArrowLeft, ShieldAlert, FileText, CheckCircle2, 
  CreditCard, GitCommit, FileClock, Check, Building2,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (cents: number | null) => {
  if (cents == null) return "—";
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
};

export default function EngagementDetail({ params }: { params: Record<string, string | undefined> }) {
  const { id } = params;
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const tenantId = searchParams.get("tenant") || "";
  const { toast } = useToast();

  const { data: engagement, isLoading, isError, error } = useEngagement(id!, tenantId);
  const changeState = useChangeEngagementState();
  const createInvoice = useCreateInvoice();
  const approveInvoice = useApproveInvoice();
  const recordPayment = useRecordPayment();
  const createMilestone = useCreateMilestone();
  const createChangeOrder = useCreateChangeOrder();
  const createHandoff = useCreateHandoff();
  const postPostingRequest = usePostPostingRequest();
  const reconcilePayment = useReconcilePayment();

  const [approvalInvoiceId, setApprovalInvoiceId] = useState<string | null>(null);
  const [revAccount, setRevAccount] = useState("");
  const [recAccount, setRecAccount] = useState("");

  const [paymentInvoiceId, setPaymentInvoiceId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentRecAccount, setPaymentRecAccount] = useState("1000");

  const [postingReqId, setPostingReqId] = useState<string | null>(null);
  const [postDate, setPostDate] = useState(new Date().toISOString().split('T')[0]);
  const [postRef, setPostRef] = useState("");

  const handleStateChange = (state: EngagementState) => {
    changeState.mutate({ id: id!, tenantId, state }, {
      onSuccess: () => {
        toast({ title: "State updated", description: `Engagement is now ${state.replace('_', ' ')}` });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Cannot change state", description: err.message });
      }
    });
  };

  const submitApproveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalInvoiceId || !revAccount || !recAccount) return;
    approveInvoice.mutate({
      engagementId: id!,
      invoiceId: approvalInvoiceId,
      tenantId,
      revenueAccountCode: revAccount,
      receivableAccountCode: recAccount
    }, {
      onSuccess: () => {
        toast({ title: "Invoice approved", description: "Ready for payment." });
        setApprovalInvoiceId(null);
        setRevAccount("");
        setRecAccount("");
      },
      onError: (err) => toast({ variant: "destructive", title: "Approval failed", description: err.message })
    });
  };

  const handleCreateDraftInvoice = () => {
    if (!engagement) return;
    createInvoice.mutate({
      id: id!,
      tenantId,
      amountCents: engagement.quoteAmountCents || 0
    }, {
      onSuccess: () => toast({ title: "Invoice drafted", description: "Review before approving." }),
      onError: (err) => toast({ variant: "destructive", title: "Failed to draft invoice", description: err.message })
    });
  };

  const submitRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInvoiceId || !paymentAmount || !paymentRef || !paymentDate || !paymentRecAccount) return;
    recordPayment.mutate({
      engagementId: id!,
      invoiceId: paymentInvoiceId,
      tenantId,
      amountCents: Math.round(parseFloat(paymentAmount) * 100),
      reference: paymentRef,
      receivedAt: new Date(paymentDate).toISOString(),
      receivingAccountCode: paymentRecAccount,
    }, {
      onSuccess: () => {
        toast({ title: "Payment recorded" });
        setPaymentInvoiceId(null);
        setPaymentAmount("");
        setPaymentRef("");
      },
      onError: (err) => toast({ variant: "destructive", title: "Payment failed", description: err.message })
    });
  };

  const submitPostingRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postingReqId || !postDate) return;
    postPostingRequest.mutate({
      engagementId: id!,
      postingRequestId: postingReqId,
      tenantId,
      postedDate: postDate,
      reference: postRef || undefined
    }, {
      onSuccess: () => {
        toast({ title: "Transaction posted" });
        setPostingReqId(null);
        setPostRef("");
      },
      onError: (err) => toast({ variant: "destructive", title: "Posting failed", description: err.message })
    });
  };

  const handleReconcilePayment = (paymentId: string) => {
    reconcilePayment.mutate({
      engagementId: id!,
      paymentId,
      tenantId
    }, {
      onSuccess: () => toast({ title: "Payment reconciled" }),
      onError: (err) => toast({ variant: "destructive", title: "Reconciliation failed", description: err.message })
    });
  };

  const handleAddMilestone = () => {
    const title = prompt("Milestone title:");
    if (!title) return;
    const amountStr = prompt("Amount in dollars (optional):");
    const amountCents = amountStr ? Math.round(parseFloat(amountStr) * 100) : undefined;
    createMilestone.mutate({ id: id!, tenantId, title, amountCents }, {
      onSuccess: () => toast({ title: "Milestone added" }),
      onError: (err) => toast({ variant: "destructive", title: "Failed to add milestone", description: err.message })
    });
  };

  const handleAddChangeOrder = () => {
    const description = prompt("Change order description:");
    if (!description) return;
    const amountStr = prompt("Amount in dollars:");
    if (!amountStr) return;
    const amountCents = Math.round(parseFloat(amountStr) * 100);
    createChangeOrder.mutate({ id: id!, tenantId, description, amountCents }, {
      onSuccess: () => toast({ title: "Change order added" }),
      onError: (err) => toast({ variant: "destructive", title: "Failed to add change order", description: err.message })
    });
  };

  const handleAddHandoff = () => {
    createHandoff.mutate({ id: id!, tenantId, acceptanceCriteria: { basic: true } }, {
      onSuccess: () => toast({ title: "Handoff created" }),
      onError: (err) => toast({ variant: "destructive", title: "Failed to create handoff", description: err.message })
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !engagement) {
    return (
      <Card className="border-destructive bg-destructive/5 max-w-2xl mx-auto mt-12">
        <CardContent className="pt-6 text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium">Failed to load engagement</p>
          <p className="text-sm text-destructive/80 mt-1">{(error as Error)?.message || "Not found"}</p>
          <Button variant="outline" className="mt-6" onClick={() => setLocation("/engagements")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
        </CardContent>
      </Card>
    );
  }

  const stateColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    active: "bg-primary/10 text-primary",
    handoff_pending: "bg-amber-100 text-amber-800",
    accepted: "bg-green-100 text-green-800",
    closed: "bg-slate-100 text-slate-800",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <Link href="/engagements" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Engagements
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-serif font-bold text-foreground">{engagement.title}</h1>
              <Badge className={stateColors[engagement.state]} variant="outline">
                {engagement.state.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {engagement.organization.legalName}</span>
              {engagement.costCentreCode && (
                <>
                  <span>•</span>
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{engagement.costCentreCode}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Agreement Value</div>
            <div className="text-2xl font-bold font-mono text-foreground">{formatCurrency(engagement.quoteAmountCents)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs">
          <Badge variant={engagement.integration.status === 'enabled' ? 'default' : engagement.integration.status === 'suspended' ? 'destructive' : 'secondary'} className="rounded-sm">
            Z3 Adapter: {engagement.integration.status.toUpperCase()}
          </Badge>
          {engagement.integration.status === 'enabled' && engagement.integration.allowedEventTypes.length > 0 && (
            <span className="text-muted-foreground font-mono">
              Listening for: {engagement.integration.allowedEventTypes.join(', ')}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        {engagement.state === 'draft' && (
          <Button onClick={() => handleStateChange("active")} variant="default" disabled={changeState.isPending}>
            {changeState.isPending && changeState.variables?.state === "active" ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <CheckCircle2 className="w-4 h-4 mr-2"/>}
            Activate Engagement
          </Button>
        )}
        {engagement.state === 'active' && (
          <>
            <Button onClick={() => handleStateChange("handoff_pending")} variant="default" disabled={changeState.isPending}>
              Request Handoff
            </Button>
            <Button onClick={handleAddHandoff} variant="outline" disabled={createHandoff.isPending}>
              Add Handoff Criteria
            </Button>
          </>
        )}
        {engagement.state === 'handoff_pending' && (
          <Button onClick={() => handleStateChange("accepted")} variant="default" disabled={changeState.isPending}>
            Accept Handoff
          </Button>
        )}
        {(engagement.state === 'accepted' || engagement.state === 'active') && (
          <Button onClick={() => handleStateChange("closed")} variant="secondary" disabled={changeState.isPending}>
            Close Engagement
          </Button>
        )}
        {['draft', 'active'].includes(engagement.state) && (
          <Button onClick={() => handleStateChange("cancelled")} variant="outline" className="text-destructive hover:bg-destructive/10" disabled={changeState.isPending}>
            Cancel
          </Button>
        )}
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="bg-card border w-full justify-start overflow-x-auto h-auto p-1">
          <TabsTrigger value="invoices" className="py-2"><CreditCard className="w-4 h-4 mr-2" /> Billing</TabsTrigger>
          <TabsTrigger value="scopes" className="py-2"><FileText className="w-4 h-4 mr-2" /> Scopes</TabsTrigger>
          <TabsTrigger value="milestones" className="py-2"><CheckCircle2 className="w-4 h-4 mr-2" /> Milestones</TabsTrigger>
          <TabsTrigger value="changes" className="py-2"><GitCommit className="w-4 h-4 mr-2" /> Change Orders</TabsTrigger>
          <TabsTrigger value="timeline" className="py-2"><FileClock className="w-4 h-4 mr-2" /> Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-semibold">Invoices & Payments</h3>
            <Button size="sm" onClick={handleCreateDraftInvoice} disabled={createInvoice.isPending}>
              Draft Full Invoice
            </Button>
          </div>
          
          {engagement.invoices.length === 0 ? (
            <Card className="border-dashed bg-card/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>No invoices drafted yet.</p>
              </CardContent>
            </Card>
          ) : (
            engagement.invoices.map((inv) => {
              const invoicePayments = engagement.payments.filter(p => p.invoiceId === inv.id);
              const postingReq = engagement.postingRequests.find(pr => pr.invoiceId === inv.id);
              
              return (
                <Card key={inv.id}>
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-base font-mono">INV-{inv.id.slice(0, 8).toUpperCase()}</CardTitle>
                        <Badge variant={inv.status === 'approved' ? 'default' : 'secondary'}>{inv.status}</Badge>
                        {postingReq && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={postingReq.status === 'posted' ? "border-green-500 text-green-700" : postingReq.status === 'manual_review' ? "border-red-500 text-red-700" : "border-amber-500 text-amber-700"}>
                              Posting: {postingReq.status.replace('_', ' ')}
                            </Badge>
                            {postingReq.status !== 'posted' && (
                              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setPostingReqId(postingReq.id)}>Post Ledger</Button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-lg">{formatCurrency(inv.amountCents)}</div>
                    </div>
                  </CardHeader>
                  {invoicePayments.length > 0 && (
                    <div className="px-6 py-4 border-b space-y-3 bg-card">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payments</h4>
                      <div className="space-y-2">
                        {invoicePayments.map(payment => {
                          const payReq = engagement.postingRequests.find(pr => pr.paymentId === payment.id);
                          return (
                            <div key={payment.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{formatCurrency(payment.amountCents)}</span>
                                <span className="text-muted-foreground">Ref: {payment.reference}</span>
                                <span className="text-muted-foreground text-xs">{format(new Date(payment.receivedAt), 'MMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {payReq && (
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`text-[10px] ${payReq.status === 'posted' ? "border-green-500 text-green-700" : payReq.status === 'manual_review' ? "border-red-500 text-red-700" : "border-amber-500 text-amber-700"}`}>
                                      Posting: {payReq.status.replace('_', ' ')}
                                    </Badge>
                                    {payReq.status !== 'posted' && (
                                      <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => setPostingReqId(payReq.id)}>Post</Button>
                                    )}
                                  </div>
                                )}
                                {payment.reconciledAt ? (
                                  <Badge variant="secondary" className="text-[10px]">Reconciled</Badge>
                                ) : payReq?.status === 'posted' ? (
                                  <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => handleReconcilePayment(payment.id)}>Reconcile</Button>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <CardFooter className="pt-4 flex justify-end gap-2 bg-card">
                    {inv.status === 'draft' && (
                      <Button size="sm" onClick={() => setApprovalInvoiceId(inv.id)} disabled={approveInvoice.isPending}>
                        Approve for Accounting
                      </Button>
                    )}
                    {inv.status === 'approved' && (
                      <Button size="sm" variant="outline" onClick={() => {
                        setPaymentInvoiceId(inv.id);
                        setPaymentAmount((inv.amountCents / 100).toString());
                      }} disabled={recordPayment.isPending}>
                        Record Payment
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="scopes" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-semibold mb-4">Scope Versions</h3>
              <div className="space-y-4">
                {engagement.scopes.map((s) => (
                  <Card key={s.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Scope Version {s.version}</CardTitle>
                        <Badge variant={s.status === 'accepted' ? 'default' : 'secondary'}>{s.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto max-h-60 border">
                        {JSON.stringify(s.terms, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {engagement.handoffs && engagement.handoffs.length > 0 && (
              <div>
                <h3 className="text-lg font-serif font-semibold mb-4">Handoffs</h3>
                <div className="space-y-4">
                  {engagement.handoffs.map((h) => (
                    <Card key={h.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Handoff Delivery</CardTitle>
                          <Badge variant={h.status === 'accepted' ? 'default' : h.status === 'rejected' ? 'destructive' : 'secondary'}>{h.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm font-medium mb-2">Acceptance Criteria:</div>
                        <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto border">
                          {JSON.stringify(h.acceptanceCriteria, null, 2)}
                        </pre>
                        {h.responseNote && (
                          <div className="mt-4 text-sm bg-accent/50 p-3 rounded-md">
                            <span className="font-semibold block mb-1">Response Note:</span>
                            {h.responseNote}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-semibold">Milestones</h3>
            <Button size="sm" onClick={handleAddMilestone} disabled={createMilestone.isPending}>
              Add Milestone
            </Button>
          </div>
          {engagement.milestones.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
               No milestones mapped for this engagement.
             </div>
          ) : (
            <div className="space-y-4">
              {engagement.milestones.map((m) => (
                <Card key={m.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{m.title}</div>
                      {m.dueAt && <div className="text-xs text-muted-foreground mt-1">Due: {format(new Date(m.dueAt), 'MMM d, yyyy')}</div>}
                    </div>
                    <div className="flex items-center gap-4">
                      {m.amountCents && <div className="font-mono text-sm">{formatCurrency(m.amountCents)}</div>}
                      <Badge variant="outline">{m.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="changes" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-semibold">Change Orders</h3>
            <Button size="sm" onClick={handleAddChangeOrder} disabled={createChangeOrder.isPending}>
              Add Change Order
            </Button>
          </div>
          {engagement.changeOrders.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
               No change orders registered.
             </div>
          ) : (
            <div className="space-y-4">
              {engagement.changeOrders.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-foreground">{c.description}</p>
                      <Badge variant="outline" className="ml-4 shrink-0">{c.status}</Badge>
                    </div>
                    <div className="mt-2 text-sm font-mono text-muted-foreground">{formatCurrency(c.amountCents)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border">
                {engagement.timeline.map((event, i) => (
                  <div key={event.id} className="relative">
                    <span className="absolute -left-[30px] top-1 w-[11px] h-[11px] rounded-full bg-card border-2 border-primary z-10" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{event.action}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(event.createdAt), 'MMM d, yyyy HH:mm')}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono">by {event.actorType}: {event.actorReference}</div>
                      {event.payload && Object.keys(event.payload).length > 0 && (
                        <div className="mt-2 text-xs font-mono bg-muted p-2 rounded border text-muted-foreground overflow-auto">
                          {JSON.stringify(event.payload)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      <Dialog open={!!approvalInvoiceId} onOpenChange={(open) => !open && setApprovalInvoiceId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Invoice for Accounting</DialogTitle>
            <DialogDescription>
              Assign the proper ledger accounts for revenue and receivables to post this invoice.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitApproveInvoice} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Revenue Account Code</Label>
              <Input 
                value={revAccount} 
                onChange={(e) => setRevAccount(e.target.value)} 
                placeholder="E.g. 4000" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Receivable Account Code</Label>
              <Input 
                value={recAccount} 
                onChange={(e) => setRecAccount(e.target.value)} 
                placeholder="E.g. 1200" 
                required 
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={approveInvoice.isPending}>
                {approveInvoice.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Approve Invoice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!paymentInvoiceId} onOpenChange={(open) => !open && setPaymentInvoiceId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Log a received payment against this invoice.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRecordPayment} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Amount ($)</Label>
              <Input 
                type="number" 
                step="0.01" 
                min="0.01"
                value={paymentAmount} 
                onChange={(e) => setPaymentAmount(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Reference</Label>
              <Input 
                value={paymentRef} 
                onChange={(e) => setPaymentRef(e.target.value)} 
                placeholder="E.g. Wire transfer ref, Cheque number" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Date Received</Label>
              <Input 
                type="date" 
                value={paymentDate} 
                onChange={(e) => setPaymentDate(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Receiving asset account</Label>
              <Input
                value={paymentRecAccount}
                onChange={(e) => setPaymentRecAccount(e.target.value)}
                placeholder="Enter the active bank or clearing account code"
                required
                data-testid="input-payment-account"
              />
              <p className="text-xs text-muted-foreground">
                This must be an active debit-normal asset account in Headwaters Books.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={recordPayment.isPending}>
                {recordPayment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!postingReqId} onOpenChange={(open) => !open && setPostingReqId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post Ledger Transaction</DialogTitle>
            <DialogDescription>
              Execute the accounting transaction for this approved request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitPostingRequest} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Posted Date</Label>
              <Input 
                type="date" 
                value={postDate} 
                onChange={(e) => setPostDate(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Ledger Reference (Optional)</Label>
              <Input 
                value={postRef} 
                onChange={(e) => setPostRef(e.target.value)} 
                placeholder="E.g. Bank statement desc" 
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={postPostingRequest.isPending}>
                {postPostingRequest.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Post to Ledger
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

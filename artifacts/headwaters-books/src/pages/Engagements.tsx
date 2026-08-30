import { useState } from "react";
import { useEngagements, EngagementWithOrg, useConvertQuote, useOutbox, useRetryOutbox } from "@/hooks/use-engagements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, ArrowRight, ShieldCheck, Clock, RefreshCw, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (cents: number | null) => {
  if (cents == null) return "—";
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
};

export default function Engagements() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialTenant = searchParams.get("tenant") || "";
  
  const [tenantId, setTenantId] = useState(initialTenant);
  const [inputTenant, setInputTenant] = useState(initialTenant);
  const { toast } = useToast();

  const { data: engagements, isLoading, isError, error } = useEngagements(tenantId);
  const { data: outbox, isLoading: isOutboxLoading } = useOutbox(tenantId);
  
  const convertQuote = useConvertQuote();
  const retryOutbox = useRetryOutbox();

  const [quoteId, setQuoteId] = useState("");
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  const handleTenantChange = (e: React.FormEvent) => {
    e.preventDefault();
    setTenantId(inputTenant);
    setLocation(`/engagements?tenant=${encodeURIComponent(inputTenant)}`);
  };

  const handleConvertQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteId || !tenantId) return;
    
    convertQuote.mutate({
      tenantId,
      quoteRequestId: quoteId,
    }, {
      onSuccess: () => {
        toast({ title: "Quote converted", description: "Engagement created successfully." });
        setIsConvertOpen(false);
        setQuoteId("");
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Failed to convert quote", description: err.message });
      }
    });
  };

  const handleRetryOutbox = (id: string) => {
    retryOutbox.mutate({ id, tenantId }, {
      onSuccess: () => toast({ title: "Retrying delivery..." }),
      onError: (err) => toast({ variant: "destructive", title: "Retry failed", description: err.message })
    });
  };

  const stateColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    active: "bg-primary/10 text-primary",
    handoff_pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    closed: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Engagements</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            The commercial control room. Manage scope, human approvals, and delivery evidence exactly as they occur.
          </p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <form onSubmit={handleTenantChange} className="flex items-center gap-2">
            <div className="flex flex-col">
              <Input 
                value={inputTenant} 
                onChange={(e) => setInputTenant(e.target.value)} 
                placeholder="Cross-system key..." 
                className="w-48 bg-card"
                data-testid="input-tenant-id"
              />
              <span className="text-[10px] text-muted-foreground mt-1">Must be the agreed immutable key</span>
            </div>
            <Button type="submit" variant="secondary" className="self-start" data-testid="button-load-tenant">Load</Button>
          </form>
          
          <Dialog open={isConvertOpen} onOpenChange={setIsConvertOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-convert-quote" className="self-start mt-1"><Plus className="w-4 h-4 mr-2" /> Convert Quote</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convert Quote to Engagement</DialogTitle>
                <DialogDescription>
                  Converts an approved quote into an active engagement ledger.
                  The tenant ID must be the agreed immutable cross-system key.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleConvertQuote} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="quoteId">Quote Request ID</Label>
                  <Input id="quoteId" value={quoteId} onChange={e => setQuoteId(e.target.value)} placeholder="uuid..." required data-testid="input-quote-id" />
                </div>
                <p className="text-sm text-muted-foreground">
                  The engagement title, amount, and initial scope are copied from the
                  accepted quote. They cannot be replaced during conversion.
                </p>
                <DialogFooter>
                  <Button type="submit" disabled={convertQuote.isPending} data-testid="button-submit-conversion">
                    {convertQuote.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Convert
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="bg-card border w-fit">
          <TabsTrigger value="list" className="px-6">Engagements</TabsTrigger>
          <TabsTrigger value="outbox" className="px-6 flex items-center gap-2">
            <Send className="w-4 h-4" /> 
            Integration Outbox
            {outbox && outbox.some(o => o.status === 'failed') && (
              <span className="flex h-2 w-2 rounded-full bg-destructive ml-1"></span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6 space-y-6">
          {!tenantId ? (
            <Card className="bg-card shadow-sm border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ShieldCheck className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <CardTitle className="mb-2">Enter a Tenant ID</CardTitle>
                <CardDescription className="max-w-md">
                  Load an engagement by entering the agreed immutable cross-system key. Do not use local slugs.
                </CardDescription>
              </CardContent>
            </Card>
          ) : isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6 text-center">
            <ShieldCheck className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium">Failed to load engagements</p>
            <p className="text-sm text-destructive/80 mt-1">{(error as Error)?.message || "Unknown error"}</p>
          </CardContent>
        </Card>
      ) : !engagements || engagements.length === 0 ? (
        <Card className="bg-card shadow-sm border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <CardTitle className="mb-2">No engagements found</CardTitle>
            <CardDescription className="max-w-md">
              There are no engagements for the tenant <span className="font-mono bg-muted px-1 py-0.5 rounded">{tenantId}</span>.
              Engagements begin their life as a converted Quote Request.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {engagements.map((e: EngagementWithOrg) => (
            <Link key={e.id} href={`/engagements/${e.id}?tenant=${encodeURIComponent(tenantId)}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group hover-elevate">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif font-bold text-lg truncate group-hover:text-primary transition-colors">
                          {e.title}
                        </h3>
                        <Badge className={stateColors[e.state] || "bg-muted text-muted-foreground"} variant="outline">
                          {e.state.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{e.organization.legalName}</span>
                        {e.costCentreCode && (
                          <>
                            <span className="text-border">•</span>
                            <span className="font-mono text-xs text-muted-foreground/70">{e.costCentreCode}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-right shrink-0">
                      <div className="hidden sm:block">
                        <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Total Value</div>
                        <div className="font-medium text-foreground">{formatCurrency(e.quoteAmountCents)}</div>
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Created</div>
                        <div className="text-foreground">{format(new Date(e.createdAt), 'MMM d, yyyy')}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
        </TabsContent>

        <TabsContent value="outbox" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Outbox</CardTitle>
              <CardDescription>Messages pending delivery to external systems.</CardDescription>
            </CardHeader>
            <CardContent>
              {isOutboxLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : !outbox || outbox.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  No pending or failed messages in outbox.
                </div>
              ) : (
                <div className="space-y-4">
                  {outbox.map(item => (
                    <div key={item.id} className="flex items-start justify-between p-4 border rounded-md bg-card">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={item.status === 'failed' ? 'destructive' : item.status === 'sent' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                          <span className="font-mono text-sm font-medium">{item.eventType}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Dest: {item.destination} • Attempts: {item.attempts}</div>
                        {item.lastError && (
                          <div className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" /> {item.lastError}
                          </div>
                        )}
                      </div>
                      {item.status === 'failed' && (
                        <Button variant="outline" size="sm" onClick={() => handleRetryOutbox(item.id)} disabled={retryOutbox.isPending}>
                          <RefreshCw className={`w-4 h-4 mr-2 ${retryOutbox.isPending ? 'animate-spin' : ''}`} />
                          Retry
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

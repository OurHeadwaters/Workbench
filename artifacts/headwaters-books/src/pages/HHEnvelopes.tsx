import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Wallet, ShoppingCart, Fuel, BookOpen, Pill, PiggyBank, Pencil, Trash2, Store, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "wouter";
import { customFetch } from "@workspace/api-client-react";
import { useQuery, useMutation } from "@tanstack/react-query";

const ICON_MAP: Record<string, React.ReactNode> = {
  "shopping-cart": <ShoppingCart className="w-4 h-4" />,
  fuel: <Fuel className="w-4 h-4" />,
  book: <BookOpen className="w-4 h-4" />,
  pill: <Pill className="w-4 h-4" />,
  savings: <PiggyBank className="w-4 h-4" />,
  wallet: <Wallet className="w-4 h-4" />,
};

const ICON_OPTIONS = [
  { key: "shopping-cart", label: "Groceries" },
  { key: "fuel", label: "Fuel" },
  { key: "book", label: "School" },
  { key: "pill", label: "Medicine" },
  { key: "savings", label: "Savings" },
  { key: "wallet", label: "Other" },
];

interface Envelope {
  id: string;
  label: string;
  icon: string;
  currency: string;
  monthlyBudget: string;
  spentThisMonth: string;
}

interface Merchant {
  id: string;
  name: string;
  category: string;
}

interface HealthData {
  score: number;
  tier: string;
  message: string;
  savingsRate: string;
  discipline: string;
  totalBudget: string;
  totalSpent: string;
}

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  return customFetch<T>(path, opts ?? {});
}

function pct(spent: string, budget: string): number {
  const b = parseFloat(budget);
  if (b <= 0) return 0;
  return Math.min((parseFloat(spent) / b) * 100, 100);
}

function barColor(p: number): string {
  if (p >= 90) return "bg-red-500";
  if (p >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}

function tierColor(tier: string): string {
  switch (tier) {
    case "strong": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "steady": return "bg-blue-100 text-blue-800 border-blue-200";
    case "building": return "bg-amber-100 text-amber-800 border-amber-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function HHEnvelopes() {
  const qc = useQueryClient();

  const [showNew, setShowNew] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showSpend, setShowSpend] = useState<string | null>(null);

  const [newLabel, setNewLabel] = useState("");
  const [newIcon, setNewIcon] = useState("wallet");
  const [newBudget, setNewBudget] = useState("");
  const [newCurrency, setNewCurrency] = useState<"token" | "xrp">("token");

  const [spendMerchant, setSpendMerchant] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [spendNote, setSpendNote] = useState("");

  const envelopesKey = ["hh-envelopes"];
  const healthKey = ["hh-health"];
  const merchantsKey = ["hh-merchants"];

  const { data: envelopes = [], isLoading } = useQuery<Envelope[]>({
    queryKey: envelopesKey,
    queryFn: () => apiFetch("/helping-hands/my/envelopes"),
  });

  const { data: health } = useQuery<HealthData>({
    queryKey: healthKey,
    queryFn: () => apiFetch("/helping-hands/my/health"),
  });

  const { data: merchants = [] } = useQuery<Merchant[]>({
    queryKey: merchantsKey,
    queryFn: () => apiFetch("/helping-hands/merchants"),
    enabled: showSpend !== null,
  });

  const createEnvelope = useMutation({
    mutationFn: (body: { label: string; icon: string; monthlyBudget: string; currency: string }) =>
      apiFetch<Envelope>("/helping-hands/my/envelopes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: envelopesKey });
      qc.invalidateQueries({ queryKey: healthKey });
      toast.success("Envelope created");
      setShowNew(false);
      setNewLabel(""); setNewIcon("wallet"); setNewBudget(""); setNewCurrency("token");
    },
    onError: (e: Error) => toast.error(e.message || "Could not create envelope"),
  });

  const updateEnvelope = useMutation({
    mutationFn: ({ id, ...body }: { id: string; label?: string; icon?: string; monthlyBudget?: string }) =>
      apiFetch<Envelope>(`/helping-hands/my/envelopes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: envelopesKey });
      qc.invalidateQueries({ queryKey: healthKey });
      toast.success("Envelope updated");
      setEditId(null);
    },
    onError: (e: Error) => toast.error(e.message || "Could not update"),
  });

  const deleteEnvelope = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/helping-hands/my/envelopes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: envelopesKey });
      qc.invalidateQueries({ queryKey: healthKey });
      toast.success("Envelope removed");
    },
    onError: (e: Error) => toast.error(e.message || "Could not delete"),
  });

  const spendFromEnvelope = useMutation({
    mutationFn: ({ id, ...body }: { id: string; merchantId: string; amount: string; note: string }) =>
      apiFetch<{ amount: string; currency: string; merchantName: string }>(
        `/helping-hands/my/envelopes/${id}/spend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      ),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: envelopesKey });
      qc.invalidateQueries({ queryKey: healthKey });
      toast.success(`Paid ${data.amount} ${data.currency === "xrp" ? "XRP" : "tokens"} to ${data.merchantName}`);
      setShowSpend(null);
      setSpendMerchant(""); setSpendAmount(""); setSpendNote("");
    },
    onError: (e: Error) => toast.error(e.message || "Payment failed"),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim() || !newBudget) return;
    createEnvelope.mutate({ label: newLabel.trim(), icon: newIcon, monthlyBudget: newBudget, currency: newCurrency });
  }

  function handleSpend(envelopeId: string, e: React.FormEvent) {
    e.preventDefault();
    if (!spendMerchant || !spendAmount) return;
    spendFromEnvelope.mutate({ id: envelopeId, merchantId: spendMerchant, amount: spendAmount, note: spendNote });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">My Envelopes</h1>
          <p className="text-muted-foreground mt-1">
            Allocate your earnings into named budget categories and spend them at participating stores.
          </p>
        </div>
        <Button onClick={() => setShowNew(true)} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" /> New envelope
        </Button>
      </div>

      {/* Inline "What is this?" explainer — always visible */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
        <HelpCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-amber-900">
          <strong>Is this real money?</strong>{" "}
          Yes — community credits are real value you own outright. They don't expire, they're not points.
          Split them into envelopes (like groceries or fuel) and spend them at stores your band has approved.
        </p>
      </div>

      {/* Health score */}
      {health && (
        <div className={`rounded-lg border p-5 ${tierColor(health.tier)}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-base">Financial health</p>
            <span className="text-2xl font-bold">{health.score}<span className="text-base font-normal">/100</span></span>
          </div>
          <p className="text-sm mb-3">{health.message}</p>
          <div className="flex flex-wrap gap-4 text-xs font-medium opacity-80">
            <span>Savings rate: {health.savingsRate}%</span>
            <span>On-budget: {health.discipline}%</span>
            <span>Spent: {parseFloat(health.totalSpent).toFixed(2)} / {parseFloat(health.totalBudget).toFixed(2)} tokens</span>
          </div>
        </div>
      )}

      {/* New envelope form */}
      {showNew && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold text-foreground">Create an envelope</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <input
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                placeholder="e.g. Groceries"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Monthly budget</label>
              <input
                type="number"
                min="0"
                step="any"
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                placeholder="e.g. 200"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Currency</label>
            <div className="flex gap-2">
              {(["token", "xrp"] as const).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setNewCurrency(c)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                    newCurrency === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {c === "token" ? "Community tokens" : "XRP"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setNewIcon(opt.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    newIcon === opt.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {ICON_MAP[opt.key] ?? <Wallet className="w-4 h-4" />}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => { setShowNew(false); setNewLabel(""); setNewIcon("wallet"); setNewBudget(""); setNewCurrency("token"); }}>Cancel</Button>
            <Button type="submit" disabled={createEnvelope.isPending}>
              {createEnvelope.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      )}

      {/* Envelope list */}
      {envelopes.length === 0 && !showNew ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-medium">No envelopes yet.</p>
          <p className="text-sm mt-1">Create your first one to start budgeting your earnings.</p>
          <Button variant="outline" className="mt-4" onClick={() => setShowNew(true)}>
            <Plus className="w-4 h-4 mr-1" /> Create an envelope
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {envelopes.map((env) => {
            const p = pct(env.spentThisMonth, env.monthlyBudget);
            const isEditing = editId === env.id;
            const isSpending = showSpend === env.id;

            return (
              <div key={env.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        {ICON_MAP[env.icon] ?? <Wallet className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{env.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {parseFloat(env.spentThisMonth).toFixed(2)} / {parseFloat(env.monthlyBudget).toFixed(2)} tokens this month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditId(isEditing ? null : env.id)}
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Remove the "${env.label}" envelope?`)) deleteEnvelope.mutate(env.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Budget bar */}
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor(p)}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-muted-foreground">{p.toFixed(0)}% used</span>
                    {p >= 90 && (
                      <Badge className="text-[10px] bg-red-100 text-red-800 border-0 h-4">Near limit</Badge>
                    )}
                  </div>
                </div>

                {/* Edit form */}
                {isEditing && (
                  <div className="border-t border-border p-4 bg-muted/30 space-y-3">
                    <EditEnvelopeForm
                      envelope={env}
                      onSave={(data) => updateEnvelope.mutate({ id: env.id, ...data })}
                      onCancel={() => setEditId(null)}
                      isPending={updateEnvelope.isPending}
                    />
                  </div>
                )}

                {/* Spend form */}
                {isSpending && (
                  <div className="border-t border-border p-4 bg-muted/30 space-y-3">
                    <p className="text-sm font-medium text-foreground">Pay at a store</p>
                    <form onSubmit={(e) => handleSpend(env.id, e)} className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Store</label>
                        <select
                          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                          value={spendMerchant}
                          onChange={(e) => setSpendMerchant(e.target.value)}
                          required
                        >
                          <option value="">Select a store…</option>
                          {merchants.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                        {merchants.length === 0 && (
                          <p className="text-xs text-muted-foreground mt-1">No participating stores registered yet. Ask your band admin to add one.</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Amount (tokens)</label>
                          <input
                            type="number"
                            min="0.01"
                            step="any"
                            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                            placeholder="0.00"
                            value={spendAmount}
                            onChange={(e) => setSpendAmount(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Note (optional)</label>
                          <input
                            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                            placeholder="e.g. weekly groceries"
                            value={spendNote}
                            onChange={(e) => setSpendNote(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" size="sm" onClick={() => setShowSpend(null)}>Cancel</Button>
                        <Button type="submit" size="sm" disabled={spendFromEnvelope.isPending}>
                          {spendFromEnvelope.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Pay now"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Action bar */}
                {!isEditing && !isSpending && (
                  <div className="border-t border-border px-5 py-3 flex items-center justify-between">
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      onClick={() => {
                        setShowSpend(env.id);
                        setSpendMerchant(""); setSpendAmount(""); setSpendNote("");
                      }}
                    >
                      <Store className="w-3.5 h-3.5" /> Spend at a store
                    </button>
                    <Link href={`/helping-hands/envelopes/${env.id}/history`}>
                      <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        History <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Healthy patterns guidance */}
      <div className="bg-muted/40 border border-border rounded-lg p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Healthy patterns:</strong> Most families feel stable when 10–15% goes to savings,
        roughly 30–35% to food, and the rest spread across fuel, school, and medicine.
        Your envelopes will gently flag when a category runs over so you can rebalance — no lectures.
      </div>
    </div>
  );
}

function EditEnvelopeForm({
  envelope,
  onSave,
  onCancel,
  isPending,
}: {
  envelope: Envelope;
  onSave: (data: { label?: string; icon?: string; monthlyBudget?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [label, setLabel] = useState(envelope.label);
  const [icon, setIcon] = useState(envelope.icon);
  const [budget, setBudget] = useState(parseFloat(envelope.monthlyBudget).toFixed(2));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ label, icon, monthlyBudget: budget });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
          <input
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Monthly budget</label>
          <input
            type="number"
            min="0"
            step="any"
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {ICON_OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt.key}
            onClick={() => setIcon(opt.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-colors ${
              icon === opt.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {ICON_MAP[opt.key] ?? <Wallet className="w-3 h-3" />}
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
}

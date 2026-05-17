import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Store, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useGetBookkeeperMe } from "@workspace/api-client-react";
import { customFetch } from "@workspace/api-client-react";
import { useQuery, useMutation } from "@tanstack/react-query";

const CATEGORIES = [
  { value: "grocery", label: "Grocery" },
  { value: "fuel", label: "Fuel" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "school", label: "School" },
  { value: "general", label: "General" },
];

interface Merchant {
  id: string;
  name: string;
  description: string;
  category: string;
  merchantWallet: string;
  isActive: boolean;
  createdAt: string;
}

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  return customFetch<T>(path, opts ?? {});
}

function categoryBadge(cat: string) {
  const colors: Record<string, string> = {
    grocery: "bg-emerald-100 text-emerald-800",
    fuel: "bg-amber-100 text-amber-800",
    pharmacy: "bg-blue-100 text-blue-800",
    school: "bg-purple-100 text-purple-800",
    general: "bg-slate-100 text-slate-700",
  };
  return (
    <Badge className={`${colors[cat] ?? colors.general} border-0 text-xs capitalize`}>
      {cat}
    </Badge>
  );
}

export default function HHMerchants() {
  const qc = useQueryClient();
  const { data: me } = useGetBookkeeperMe();
  const isAdmin = me?.role === "owner" || me?.role === "ops_manager";

  const [showNew, setShowNew] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [wallet, setWallet] = useState("");

  const merchantsKey = ["hh-merchants-admin"];

  const { data: merchants = [], isLoading } = useQuery<Merchant[]>({
    queryKey: merchantsKey,
    queryFn: () =>
      apiFetch(isAdmin ? "/helping-hands/merchants?includeInactive=true" : "/helping-hands/merchants"),
    enabled: me !== undefined,
  });

  const createMerchant = useMutation({
    mutationFn: (body: { name: string; description: string; category: string; merchantWallet: string }) =>
      apiFetch<Merchant>("/helping-hands/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: merchantsKey });
      toast.success("Store registered");
      setShowNew(false);
      setName(""); setDescription(""); setCategory("general"); setWallet("");
    },
    onError: (e: Error) => toast.error(e.message || "Could not register store"),
  });

  const updateMerchant = useMutation({
    mutationFn: ({ id, ...body }: Partial<Merchant> & { id: string }) =>
      apiFetch<Merchant>(`/helping-hands/merchants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: merchantsKey });
      toast.success("Store updated");
      setEditId(null);
    },
    onError: (e: Error) => toast.error(e.message || "Could not update"),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !wallet.trim()) return;
    createMerchant.mutate({ name: name.trim(), description, category, merchantWallet: wallet.trim() });
  }

  function toggleActive(m: Merchant) {
    updateMerchant.mutate({ id: m.id, isActive: !m.isActive });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Participating Stores</h1>
          <p className="text-muted-foreground mt-1">These stores accept community tokens via your envelopes.</p>
        </div>
        {merchants.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No stores registered yet.</p>
        ) : (
          <div className="space-y-3">
            {merchants.map((m) => (
              <div key={m.id} className="bg-card border border-border rounded-lg p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{m.name}</p>
                  {m.description && <p className="text-sm text-muted-foreground mt-0.5">{m.description}</p>}
                </div>
                {categoryBadge(m.category)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Merchant Registry</h1>
          <p className="text-muted-foreground mt-1">
            Register the reserve stores and services that accept community tokens at checkout.
          </p>
        </div>
        <Button onClick={() => setShowNew(true)} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" /> Add store
        </Button>
      </div>

      {/* New merchant form */}
      {showNew && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold text-foreground">Register a store</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Store name</label>
              <input
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                placeholder="e.g. Deer Lake General Store"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description (optional)</label>
            <input
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
              placeholder="Brief description of the store"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">XRPL wallet address</label>
            <input
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background font-mono"
              placeholder="r… (merchant's XRPL address)"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Payments from member envelopes go directly to this address on XRPL.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button type="submit" disabled={createMerchant.isPending}>
              {createMerchant.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register"}
            </Button>
          </div>
        </form>
      )}

      {/* Merchant list */}
      {merchants.length === 0 && !showNew ? (
        <div className="text-center py-16 text-muted-foreground">
          <Store className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No stores registered yet.</p>
          <p className="text-sm mt-1">Add a reserve store to let members spend their envelopes there.</p>
          <Button variant="outline" className="mt-4" onClick={() => setShowNew(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add the first store
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {merchants.map((m) => {
            const isEditing = editId === m.id;
            return (
              <div
                key={m.id}
                className={`bg-card border rounded-lg overflow-hidden ${m.isActive ? "border-border" : "border-border opacity-60"}`}
              >
                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-foreground">{m.name}</p>
                      {categoryBadge(m.category)}
                      {!m.isActive && <Badge className="text-xs bg-slate-100 text-slate-500 border-0">Inactive</Badge>}
                    </div>
                    {m.description && <p className="text-sm text-muted-foreground">{m.description}</p>}
                    <p className="text-xs text-muted-foreground mt-1 font-mono truncate">{m.merchantWallet}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => setEditId(isEditing ? null : m.id)}
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-7 w-7 p-0 ${m.isActive ? "text-emerald-600" : "text-muted-foreground"}`}
                      onClick={() => toggleActive(m)}
                      title={m.isActive ? "Deactivate" : "Activate"}
                      disabled={updateMerchant.isPending}
                    >
                      {m.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {isEditing && (
                  <EditMerchantForm
                    merchant={m}
                    onSave={(data) => updateMerchant.mutate({ id: m.id, ...data })}
                    onCancel={() => setEditId(null)}
                    isPending={updateMerchant.isPending}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Partnership portal link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <strong className="text-blue-900">Partnership portal</strong>
        <p className="text-blue-800 mt-1">
          Credit unions and Investors Group reps can view anonymised savings and reliability data
          (with member consent) to assess loan and RRSP product eligibility.
        </p>
        <Link
          href="/helping-hands/partnership"
          className="inline-block mt-2 text-blue-700 underline text-xs"
        >
          View partnership data →
        </Link>
      </div>
    </div>
  );
}

function EditMerchantForm({
  merchant,
  onSave,
  onCancel,
  isPending,
}: {
  merchant: Merchant;
  onSave: (data: Partial<Merchant>) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(merchant.name);
  const [description, setDescription] = useState(merchant.description);
  const [category, setCategory] = useState(merchant.category);
  const [wallet, setWallet] = useState(merchant.merchantWallet);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ name, description, category, merchantWallet: wallet });
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-muted/30 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
          <input
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Category</label>
          <select
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Description</label>
        <input
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">XRPL wallet</label>
        <input
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background font-mono"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

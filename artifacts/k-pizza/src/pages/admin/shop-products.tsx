import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Trash2, Loader2, Plus } from "lucide-react";
import {
  useListCoopProducers,
  useListCoopProducts,
  getListCoopProductsQueryKey,
  useCreateCoopProduct,
  useUpdateCoopProduct,
  useDeleteCoopProduct,
  type CoopProduct,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["Alliums", "Root Vegetables", "Greens", "Herbs", "Grains", "Preserves", "Dairy", "Meat", "Baked Goods", "Other"];

const EMPTY_DRAFT = {
  producerId: "",
  name: "",
  description: "",
  unit: "",
  priceCents: "",
  photoUrl: "",
  category: "Other",
};

export default function AdminShopProducts() {
  const qc = useQueryClient();
  const { data: producers } = useListCoopProducers();
  const { data: products, isLoading } = useListCoopProducts();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListCoopProductsQueryKey() });
  const create = useCreateCoopProduct({ mutation: { onSuccess: invalidate } });
  const update = useUpdateCoopProduct({ mutation: { onSuccess: invalidate } });
  const del = useDeleteCoopProduct({ mutation: { onSuccess: invalidate } });

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [showAdd, setShowAdd] = useState(false);
  const [filterProducer, setFilterProducer] = useState<string>("all");

  if (isLoading || !products) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  function addProduct() {
    if (!draft.name.trim() || !draft.producerId) return;
    const price = Math.round(parseFloat(draft.priceCents || "0") * 100);
    create.mutate({
      data: {
        producerId: Number(draft.producerId),
        name: draft.name.trim(),
        description: draft.description.trim(),
        unit: draft.unit.trim(),
        priceCents: price,
        photoUrl: draft.photoUrl.trim(),
        category: draft.category,
        available: true,
        sortOrder: products?.length ?? 0,
      },
    });
    setDraft(EMPTY_DRAFT);
    setShowAdd(false);
  }

  const filtered = filterProducer === "all" ? products : products.filter(p => String(p.producerId) === filterProducer);
  const producerName = (id: number) => producers?.find(p => p.id === id)?.name ?? `Producer #${id}`;

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-4xl font-serif mb-2 flex items-center gap-3"><ShoppingBag /> 807 Shop Products</h2>
          <p className="text-muted-foreground max-w-2xl">
            Manage the products available on the 807 Food Coop storefront. Products appear under their producer's story section.
          </p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {showAdd && (
        <Card className="border-2 border-dashed border-primary/40 bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-serif text-xl">New Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Producer</Label>
                <Select value={draft.producerId} onValueChange={(v) => setDraft({ ...draft, producerId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select producer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(producers ?? []).map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Product Name</Label>
                <Input placeholder="Heirloom Garlic — Music" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Unit</Label>
                <Input placeholder="3-bulb bag" value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Price ($)</Label>
                <Input type="number" step="0.01" placeholder="8.50" value={draft.priceCents} onChange={(e) => setDraft({ ...draft, priceCents: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Photo URL</Label>
                <Input placeholder="https://..." value={draft.photoUrl} onChange={(e) => setDraft({ ...draft, photoUrl: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea rows={2} placeholder="What it is, how it was grown, when it was harvested..." value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={addProduct} disabled={create.isPending || !draft.name.trim() || !draft.producerId}>
                {create.isPending ? <Loader2 className="animate-spin mr-2" size={14} /> : null}Save Product
              </Button>
              <Button variant="outline" onClick={() => { setShowAdd(false); setDraft(EMPTY_DRAFT); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Label className="text-sm text-muted-foreground shrink-0">Filter by producer:</Label>
        <Select value={filterProducer} onValueChange={setFilterProducer}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All producers</SelectItem>
            {(producers ?? []).map(p => (
              <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-md">
          <ShoppingBag className="mx-auto mb-3 opacity-40" size={48} />
          <p>No products yet. Add the first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              producerName={producerName(product.producerId)}
              producers={producers ?? []}
              onSave={(patch) => update.mutate({ id: product.id, data: { ...product, ...patch } })}
              onDelete={() => del.mutate({ id: product.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product, producerName, producers, onSave, onDelete
}: {
  product: CoopProduct;
  producerName: string;
  producers: Array<{ id: number; name: string }>;
  onSave: (p: Partial<CoopProduct>) => void;
  onDelete: () => void;
}) {
  const [local, setLocal] = useState(product);
  const [open, setOpen] = useState(false);
  const dirty = JSON.stringify(local) !== JSON.stringify(product);
  const priceDisplay = `$${(product.priceCents / 100).toFixed(2)}`;

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground">{producerName} · {product.unit} · {priceDisplay}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Switch checked={local.available} onCheckedChange={(v) => { setLocal({ ...local, available: v }); onSave({ available: v }); }} />
            <Label className="text-[10px]">In stock</Label>
            <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>{open ? "Close" : "Edit"}</Button>
            <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 size={14} /></Button>
          </div>
        </div>

        {open && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Producer</Label>
                <Select value={String(local.producerId)} onValueChange={(v) => setLocal({ ...local, producerId: Number(v) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {producers.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</Label>
                <Input value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} />
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Unit</Label>
                <Input value={local.unit} onChange={(e) => setLocal({ ...local, unit: e.target.value })} />
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Price (cents)</Label>
                <Input type="number" value={local.priceCents} onChange={(e) => setLocal({ ...local, priceCents: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select value={local.category} onValueChange={(v) => setLocal({ ...local, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Photo URL</Label>
                <Input value={local.photoUrl} onChange={(e) => setLocal({ ...local, photoUrl: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</Label>
                <Textarea rows={2} value={local.description} onChange={(e) => setLocal({ ...local, description: e.target.value })} />
              </div>
            </div>
            {dirty && <Button size="sm" onClick={() => onSave(local)}>Save Changes</Button>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

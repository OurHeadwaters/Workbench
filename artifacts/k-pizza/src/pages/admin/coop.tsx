import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Leaf,
  Trash2,
  Loader2,
  Plus,
  Sparkles,
  Link2,
  Copy,
  Check,
  X,
  RefreshCw,
  Boxes,
} from "lucide-react";
import {
  useListCoopCrate,
  getListCoopCrateQueryKey,
  useCreateCoopCrateItem,
  useUpdateCoopCrateItem,
  useDeleteCoopCrateItem,
  useListCoopProducts,
  useClearCoopCrate,
  type CoopCrateItem,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

const SUGGESTION_HINTS: Record<string, { dish: string; price: string }> = {
  "garlic scapes": { dish: "Garlic Scape Pesto White Pie — scape pesto, fresh mozz, lemon zest", price: "$19.95" },
  "garlic": { dish: "Roasted Garlic Flatbread — roast whole heads in oil, spread on house dough with goat cheese and fresh herbs", price: "$14.00" },
  "rhubarb": { dish: "Strawberry-Rhubarb Dessert Calzone — ricotta, brown sugar, cinnamon", price: "$10.95" },
  "asparagus": { dish: "Asparagus & Ricotta Pie — shaved asparagus, lemon ricotta, chili oil", price: "$21.95" },
  "spinach": { dish: "Spring Greens & Feta Slice — wilted spinach, feta, red onion", price: "$5.50/slice" },
  "basil": { dish: "Local-Basil Margherita — heirloom tomato sauce, hand-torn basil", price: "$18.95" },
  "tomato": { dish: "Heirloom Tomato & Burrata Slice — sea salt, basil oil", price: "$6.50/slice" },
  "tomatoes": { dish: "Heirloom Tomato & Burrata Slice — sea salt, basil oil", price: "$6.50/slice" },
  "kale": { dish: "Crispy Kale & Garlic White Pie — pecorino, chili flake", price: "$19.95" },
  "corn": { dish: "Sweet Corn & Bacon Pizza — corn, double-smoked bacon, jalapeño", price: "$21.95" },
  "zucchini": { dish: "Ribboned Zucchini & Lemon Ricotta Pie", price: "$19.95" },
  "beets": { dish: "Roasted Beet & Goat Cheese Slice — balsamic glaze", price: "$6.50/slice" },
  "honey": { dish: "Honey-Glazed Hot Wings — finish the wing toss with local honey and chili flake instead of sauce. Limited run of 30 orders", price: "$16.00" },
  "mushrooms": { dish: "Wild Mushroom & Thyme Pizza — truffle oil drizzle", price: "$22.95" },
  "carrots": { dish: "Honey-Glazed Carrot & Goat Cheese Pie — thyme, walnut", price: "$20.95" },
  "potatoes": { dish: "Rosemary Potato & Bacon White Pie — fingerlings, scallion", price: "$21.95" },
  "potato": { dish: "Rosemary Potato & Bacon White Pie — fingerlings, scallion", price: "$21.95" },
};

function suggest(name: string): { dish: string; price: string } | null {
  const key = name.trim().toLowerCase();
  if (!key) return null;
  if (SUGGESTION_HINTS[key]) return SUGGESTION_HINTS[key];
  for (const k of Object.keys(SUGGESTION_HINTS)) {
    if (key.includes(k)) return SUGGESTION_HINTS[k];
  }
  return null;
}

const CRATE_CONTAINERS = ["Roots", "Greens", "Specialty", "Fruit", "Herbs", "Other"];

export default function AdminCoop() {
  const qc = useQueryClient();
  const { data: items, isLoading } = useListCoopCrate();
  const { data: products } = useListCoopProducts();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListCoopCrateQueryKey() });
  const create = useCreateCoopCrateItem({ mutation: { onSuccess: invalidate } });
  const update = useUpdateCoopCrateItem({ mutation: { onSuccess: invalidate } });
  const del = useDeleteCoopCrateItem({ mutation: { onSuccess: invalidate } });
  const clearAll = useClearCoopCrate({ mutation: { onSuccess: invalidate } });

  const [draft, setDraft] = useState({ name: "", qty: "", throughDate: "", crateContainer: "Specialty" });
  const [confirmClear, setConfirmClear] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, CoopCrateItem[]>();
    (items ?? []).forEach((it) => {
      const key = it.crateContainer || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    });
    const order = ["Roots", "Greens", "Specialty", "Fruit", "Herbs", "Other"];
    return Array.from(map.entries()).sort(
      ([a], [b]) => (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b)),
    );
  }, [items]);

  if (isLoading || !items) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  function addItem() {
    if (!draft.name.trim()) return;
    create.mutate({
      data: {
        name: draft.name.trim(),
        qty: draft.qty.trim(),
        throughDate: draft.throughDate.trim(),
        crateContainer: draft.crateContainer,
        source: "manual",
        sortOrder: items?.length ?? 0,
        active: true,
      },
    });
    setDraft({ name: "", qty: "", throughDate: "", crateContainer: draft.crateContainer });
  }

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif mb-2 flex items-center gap-3"><Leaf /> 807 Co-op — Thursday Receiving Dock</h2>
          <p className="text-muted-foreground max-w-3xl">
            Thursday 2pm drop. The farmer lays out the black crates and ticks each pick in the <span className="font-semibold">807 app</span> — those land here automatically with a take-it-or-leave-it special idea attached. Anything they hand you off-list, add manually below. Edit, accept, or dismiss the suggestion on each card. Optionally link a crate item to a shop product so it shows an "In stock now" badge on the storefront. When the week's done, clear the dock for the next drop.
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex flex-col items-end gap-2">
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Clear all {items.length}?</span>
                <Button variant="destructive" size="sm" onClick={() => { clearAll.mutate(); setConfirmClear(false); }}>
                  <Check size={14} className="mr-1" /> Yes
                </Button>
                <Button variant="outline" size="sm" onClick={() => setConfirmClear(false)}>
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setConfirmClear(true)}>
                <RefreshCw size={14} className="mr-2" /> Clear for new week
              </Button>
            )}
          </div>
        )}
      </div>

      <Card className="border-2 border-dashed border-primary/40 bg-primary/5">
        <CardContent className="p-6 space-y-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Add an off-list pick (manual)</div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Ingredient</Label>
              <Input placeholder="e.g. Garlic scapes" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Qty</Label>
              <Input placeholder="2 lb" value={draft.qty} onChange={(e) => setDraft({ ...draft, qty: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Crate</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={draft.crateContainer}
                onChange={(e) => setDraft({ ...draft, crateContainer: e.target.value })}
              >
                {CRATE_CONTAINERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Use by</Label>
              <Input placeholder="Use by Sat" value={draft.throughDate} onChange={(e) => setDraft({ ...draft, throughDate: e.target.value })} />
            </div>
            <div className="md:col-span-1">
              <Button onClick={addItem} disabled={create.isPending || !draft.name.trim()} className="w-full">
                <Plus size={16} />
              </Button>
            </div>
          </div>
          {draft.name && suggest(draft.name) && (
            <p className="text-xs text-primary flex items-center gap-2"><Sparkles size={12} /> Suggestion ready: <span className="font-semibold">{suggest(draft.name)!.dish}</span></p>
          )}
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-md">
          <Leaf className="mx-auto mb-3 opacity-40" size={48} />
          <p className="mb-1">Dock is empty.</p>
          <p className="text-xs">Either the farmer hasn't ticked anything in the 807 app yet, or it's not Thursday.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([crate, list]) => (
            <div key={crate} className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-border pb-2">
                <h3 className="text-2xl font-serif flex items-center gap-2"><Boxes size={20} /> {crate} crate</h3>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{list.length} item{list.length === 1 ? "" : "s"}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {list.map((it) => (
                  <CrateCard
                    key={it.id}
                    item={it}
                    products={products ?? []}
                    onSave={(patch) => update.mutate({ id: it.id, data: { ...it, ...patch } })}
                    onDelete={() => del.mutate({ id: it.id })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CrateCard({
  item, products, onSave, onDelete
}: {
  item: CoopCrateItem;
  products: Array<{ id: number; name: string; producerId: number }>;
  onSave: (p: Partial<CoopCrateItem>) => void;
  onDelete: () => void;
}) {
  const [local, setLocal] = useState(item);
  const [editingSuggestion, setEditingSuggestion] = useState(false);
  const [copied, setCopied] = useState(false);
  const dirty = JSON.stringify(local) !== JSON.stringify(item);

  React.useEffect(() => { setLocal(item); }, [item.id]);

  const isFrom807 = item.source === "807";
  const dismissed = item.suggestionDismissed;

  function copyCode() {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(item.productCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <Card className="relative">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${isFrom807 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              {isFrom807 ? "From 807 app" : "Added here"}
            </span>
            {item.productCode && (
              <button
                type="button"
                onClick={copyCode}
                className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5 flex items-center gap-1"
                title="Copy product code"
              >
                {item.productCode}
                {copied ? <Check size={10} /> : <Copy size={10} />}
              </button>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete item"><Trash2 size={16} /></Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Ingredient</Label>
            <Input value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Qty</Label>
            <Input value={local.qty} onChange={(e) => setLocal({ ...local, qty: e.target.value })} />
          </div>
        </div>

        {dismissed ? (
          <div className="border border-dashed border-border rounded-md p-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground italic">Suggestion dismissed. Ingredient is still on the floor.</p>
            <Button size="sm" variant="ghost" onClick={() => onSave({ suggestionDismissed: false })}>Bring back</Button>
          </div>
        ) : (
          <div className="border border-border rounded-md p-3 space-y-2 bg-muted/30">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Sparkles size={10} /> Suggested special · take it or leave it</Label>
              <div className="flex items-center gap-1">
                {editingSuggestion ? (
                  <Button size="sm" variant="ghost" onClick={() => setEditingSuggestion(false)}>Done</Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setEditingSuggestion(true)}>Edit</Button>
                )}
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onSave({ suggestionDismissed: true })}>Dismiss</Button>
              </div>
            </div>
            {editingSuggestion ? (
              <>
                <Textarea rows={2} value={local.suggestion} onChange={(e) => setLocal({ ...local, suggestion: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="$19.95" value={local.suggestedPrice} onChange={(e) => setLocal({ ...local, suggestedPrice: e.target.value })} />
                  <Button
                    size="sm"
                    onClick={() => {
                      onSave({ suggestion: local.suggestion, suggestedPrice: local.suggestedPrice });
                      setEditingSuggestion(false);
                    }}
                  >Accept</Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-serif leading-snug">{item.suggestion || <span className="italic text-muted-foreground">No suggestion yet — type a hint above and the software will catch up.</span>}</p>
                {item.suggestedPrice && <p className="text-xs font-mono text-muted-foreground">{item.suggestedPrice}</p>}
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Crate</Label>
            <select
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              value={local.crateContainer || "Other"}
              onChange={(e) => setLocal({ ...local, crateContainer: e.target.value })}
            >
              {CRATE_CONTAINERS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Use by</Label>
            <Input value={local.throughDate} onChange={(e) => setLocal({ ...local, throughDate: e.target.value })} />
          </div>
        </div>

        {/* Product linking */}
        <div>
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Link2 size={10} /> Link to Shop Product (shows "In stock now" on storefront)
          </Label>
          <Select
            value={local.productId != null ? String(local.productId) : "none"}
            onValueChange={(v) => setLocal({ ...local, productId: v === "none" ? null : Number(v) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="No product linked" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No product linked</SelectItem>
              {products.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Switch checked={local.active} onCheckedChange={(v) => setLocal({ ...local, active: v })} />
            <Label className="text-xs">On this week's crate</Label>
          </div>
          {dirty && <Button size="sm" onClick={() => onSave(local)}>Save</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

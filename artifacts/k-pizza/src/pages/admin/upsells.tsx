import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import {
  useListUpsells,
  getListUpsellsQueryKey,
  useCreateUpsell,
  useUpdateUpsell,
  useDeleteUpsell,
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey,
  type Upsell,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

type Pool = "front_counter" | "chef_specials";

export default function AdminUpsells() {
  const qc = useQueryClient();
  const { data: upsells, isLoading } = useListUpsells();
  const { data: settings } = useGetSettings();
  const create = useCreateUpsell({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListUpsellsQueryKey() }) } });
  const update = useUpdateUpsell({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListUpsellsQueryKey() }) } });
  const del = useDeleteUpsell({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListUpsellsQueryKey() }) } });
  const updateSettings = useUpdateSettings({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) } });

  if (isLoading || !upsells || !settings) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const renderPool = (pool: Pool, title: string, desc: string) => {
    const items = upsells.filter(u => u.pool === pool);
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-serif">{title}</h3>
          <p className="text-muted-foreground text-sm">{desc}</p>
        </div>
        <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-md border border-border">
          <Label className="whitespace-nowrap font-bold">Rotation:</Label>
          <Select
            value={settings.upsellStrategies[pool === "front_counter" ? "frontCounter" : "chefSpecials"]}
            onValueChange={(v) => updateSettings.mutate({ data: { upsellStrategies: { ...settings.upsellStrategies, [pool === "front_counter" ? "frontCounter" : "chefSpecials"]: v as "random" | "round-robin" } } })}
          >
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random per visit</SelectItem>
              <SelectItem value="round-robin">Round-robin by day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <UpsellRow key={item.id} item={item} onSave={(patch) => update.mutate({ id: item.id, data: { ...item, ...patch } })} onDelete={() => del.mutate({ id: item.id })} />
          ))}
          <Button variant="outline" className="w-full border-dashed" onClick={() => create.mutate({ data: { pool, name: "New Upsell", blurb: "", price: "", imageUrl: "", sortOrder: items.length } })}>
            <Plus size={16} className="mr-2" /> Add candidate
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12">
      <div>
        <h2 className="text-4xl font-serif mb-2">Auto-Upsells</h2>
        <p className="text-muted-foreground">Curate the pools. Let the site rotate them automatically.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {renderPool("front_counter", "Front Counter Picks", "Appears on the landing page.")}
        {renderPool("chef_specials", "Chef's Specials", "Appears on the order screen as a final upsell.")}
      </div>
    </div>
  );
}

function UpsellRow({ item, onSave, onDelete }: { item: Upsell; onSave: (p: Partial<Upsell>) => void; onDelete: () => void }) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [blurb, setBlurb] = useState(item.blurb);
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  useEffect(() => { setName(item.name); setPrice(item.price); setBlurb(item.blurb); setImageUrl(item.imageUrl); }, [item.id]);
  return (
    <Card className="relative group overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-muted flex items-center justify-center border-r border-border">
        <GripVertical size={16} className="text-muted-foreground" />
      </div>
      <Button variant="ghost" size="icon" className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-destructive z-10" onClick={onDelete}>
        <Trash2 size={16} />
      </Button>
      <CardContent className="p-0 pl-8 flex">
        <div className="w-24 h-24 bg-muted border-r border-border shrink-0">
          {imageUrl ? <img src={imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>}
        </div>
        <div className="p-4 flex-1 grid gap-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Input placeholder="Item Name" className="h-8 font-bold" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => onSave({ name })} />
            </div>
            <Input placeholder="Price" className="h-8" value={price} onChange={(e) => setPrice(e.target.value)} onBlur={() => onSave({ price })} />
          </div>
          <Input placeholder="Short blurb..." className="h-8 text-sm" value={blurb} onChange={(e) => setBlurb(e.target.value)} onBlur={() => onSave({ blurb })} />
          <Input placeholder="Image URL (optional)" className="h-8 text-xs" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onBlur={() => onSave({ imageUrl })} />
        </div>
      </CardContent>
    </Card>
  );
}

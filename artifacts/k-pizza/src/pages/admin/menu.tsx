import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  useListMenu,
  getListMenuQueryKey,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  type MenuItem,
  type Category,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminMenu() {
  const qc = useQueryClient();
  const { data, isLoading } = useListMenu();
  const inv = () => qc.invalidateQueries({ queryKey: getListMenuQueryKey() });
  const createCat = useCreateCategory({ mutation: { onSuccess: inv } });
  const updateCat = useUpdateCategory({ mutation: { onSuccess: inv } });
  const delCat = useDeleteCategory({ mutation: { onSuccess: inv } });
  const createItem = useCreateMenuItem({ mutation: { onSuccess: inv } });
  const updateItem = useUpdateMenuItem({ mutation: { onSuccess: inv } });
  const delItem = useDeleteMenuItem({ mutation: { onSuccess: inv } });

  if (isLoading || !data) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">Menu</h2>
          <p className="text-muted-foreground">Categories and items shown on the public site.</p>
        </div>
        <Button onClick={() => createCat.mutate({ data: { name: "New Category", sortOrder: data.categories.length } })}>
          <Plus size={16} className="mr-2" /> Add Category
        </Button>
      </div>

      <div className="space-y-8">
        {data.categories.map((cat) => (
          <CategoryBlock
            key={cat.id}
            cat={cat}
            items={data.items.filter(i => i.categoryId === cat.id)}
            onRenameCat={(name) => updateCat.mutate({ id: cat.id, data: { name, sortOrder: cat.sortOrder } })}
            onDeleteCat={() => {
              if (confirm(`Delete category "${cat.name}" and all items in it?`)) {
                delCat.mutate({ id: cat.id });
              }
            }}
            onAddItem={() => createItem.mutate({ data: { categoryId: cat.id, name: "New Item", description: "", price: "$0", imageUrl: "", available: true, sortOrder: data.items.filter(i => i.categoryId === cat.id).length } })}
            onUpdateItem={(item, patch) => updateItem.mutate({ id: item.id, data: { ...item, ...patch } })}
            onDeleteItem={(id) => delItem.mutate({ id })}
          />
        ))}
        {data.categories.length === 0 && (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No categories yet. Add one to get started.</CardContent></Card>
        )}
      </div>
    </div>
  );
}

function CategoryBlock({ cat, items, onRenameCat, onDeleteCat, onAddItem, onUpdateItem, onDeleteItem }: {
  cat: Category;
  items: MenuItem[];
  onRenameCat: (name: string) => void;
  onDeleteCat: () => void;
  onAddItem: () => void;
  onUpdateItem: (item: MenuItem, patch: Partial<MenuItem>) => void;
  onDeleteItem: (id: number) => void;
}) {
  const [name, setName] = useState(cat.name);
  useEffect(() => setName(cat.name), [cat.id, cat.name]);
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <Input className="text-xl font-serif h-auto py-1 border-none px-0 focus-visible:ring-0 bg-transparent" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => name !== cat.name && onRenameCat(name)} />
        <Button variant="ghost" size="icon" className="text-destructive" onClick={onDeleteCat}><Trash2 size={16} /></Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} onSave={(patch) => onUpdateItem(item, patch)} onDelete={() => onDeleteItem(item.id)} />
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={onAddItem}>
          <Plus size={16} className="mr-2" /> Add item
        </Button>
      </div>
    </section>
  );
}

function ItemRow({ item, onSave, onDelete }: { item: MenuItem; onSave: (p: Partial<MenuItem>) => void; onDelete: () => void }) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  useEffect(() => { setName(item.name); setDescription(item.description); setPrice(item.price); setImageUrl(item.imageUrl); }, [item.id]);
  return (
    <Card className={item.available ? "" : "opacity-60"}>
      <CardContent className="pt-6 grid gap-3">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7">
            <Label className="text-xs mb-1 block">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => onSave({ name })} />
          </div>
          <div className="col-span-3">
            <Label className="text-xs mb-1 block">Price</Label>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} onBlur={() => onSave({ price })} />
          </div>
          <div className="col-span-2 flex flex-col">
            <Label className="text-xs mb-1 block">Available</Label>
            <div className="flex items-center h-9 gap-2">
              <Switch checked={item.available} onCheckedChange={(c) => onSave({ available: c })} />
              <Button variant="ghost" size="icon" className="text-destructive ml-auto" onClick={onDelete}><Trash2 size={16} /></Button>
            </div>
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Description</Label>
          <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} onBlur={() => onSave({ description })} />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Image URL (optional)</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onBlur={() => onSave({ imageUrl })} placeholder="/images/..." />
        </div>
      </CardContent>
    </Card>
  );
}

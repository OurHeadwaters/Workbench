import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock, Trash2, Loader2, Plus } from "lucide-react";
import {
  useListLunchRotations,
  getListLunchRotationsQueryKey,
  useCreateLunchRotation,
  useUpdateLunchRotation,
  useDeleteLunchRotation,
  type LunchRotation,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { DAY_NAMES } from "@/lib/api";

const DAYS = [1, 2, 3, 4, 5, 6, 0];

export default function AdminLunch() {
  const qc = useQueryClient();
  const { data: items, isLoading } = useListLunchRotations();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListLunchRotationsQueryKey() });
  const create = useCreateLunchRotation({ mutation: { onSuccess: invalidate } });
  const update = useUpdateLunchRotation({ mutation: { onSuccess: invalidate } });
  const del = useDeleteLunchRotation({ mutation: { onSuccess: invalidate } });

  const [draft, setDraft] = useState({ name: "", dayOfWeek: 1, perHead: "", minHeadcount: 8 });

  if (isLoading || !items) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  function addRotation() {
    if (!draft.name.trim()) return;
    create.mutate({
      data: {
        name: draft.name.trim(),
        dayOfWeek: Number(draft.dayOfWeek) || 1,
        perHead: draft.perHead.trim(),
        minHeadcount: Number(draft.minHeadcount) || 8,
        blurb: "",
        sortOrder: items?.length ?? 0,
        active: true,
      },
    });
    setDraft({ name: "", dayOfWeek: 1, perHead: "", minHeadcount: 8 });
  }

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-serif mb-2 flex items-center gap-3"><CalendarClock /> Lunch Club Rotations</h2>
        <p className="text-muted-foreground max-w-3xl">
          The standing weekly lunch program. Each rotation card shows up on the Lunch Club section of the landing page. Edit the name, day, per-head price, and minimum headcount — changes go live instantly.
        </p>
      </div>

      <Card className="border-2 border-dashed border-primary/40 bg-primary/5">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Rotation name</Label>
              <Input placeholder="e.g. Pizza Mondays" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Day</Label>
              <select
                value={draft.dayOfWeek}
                onChange={(e) => setDraft({ ...draft, dayOfWeek: Number(e.target.value) })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-base md:text-sm"
              >
                {DAYS.map((d) => <option key={d} value={d}>{DAY_NAMES[d]}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Per head</Label>
              <Input placeholder="$12 / head" value={draft.perHead} onChange={(e) => setDraft({ ...draft, perHead: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Min headcount</Label>
              <Input type="number" value={draft.minHeadcount} onChange={(e) => setDraft({ ...draft, minHeadcount: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-1">
              <Button onClick={addRotation} disabled={create.isPending || !draft.name.trim()} className="w-full">
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-md">
          <CalendarClock className="mx-auto mb-3 opacity-40" size={48} />
          <p>No rotations yet. Add one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {items.map((it) => (
            <RotationCard
              key={it.id}
              item={it}
              onSave={(patch) => update.mutate({ id: it.id, data: { ...it, ...patch } })}
              onDelete={() => del.mutate({ id: it.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RotationCard({ item, onSave, onDelete }: { item: LunchRotation; onSave: (p: Partial<LunchRotation>) => void; onDelete: () => void }) {
  const [local, setLocal] = useState(item);
  const dirty = JSON.stringify(local) !== JSON.stringify(item);
  return (
    <Card className="relative">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Day</Label>
              <select
                value={local.dayOfWeek}
                onChange={(e) => setLocal({ ...local, dayOfWeek: Number(e.target.value) })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                {DAYS.map((d) => <option key={d} value={d}>{DAY_NAMES[d]}</option>)}
              </select>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 size={16} /></Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Per head</Label>
            <Input value={local.perHead} onChange={(e) => setLocal({ ...local, perHead: e.target.value })} />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Min headcount</Label>
            <Input type="number" value={local.minHeadcount} onChange={(e) => setLocal({ ...local, minHeadcount: Number(e.target.value) })} />
          </div>
        </div>
        <div>
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Blurb</Label>
          <Textarea rows={2} value={local.blurb} onChange={(e) => setLocal({ ...local, blurb: e.target.value })} />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Switch checked={local.active} onCheckedChange={(v) => setLocal({ ...local, active: v })} />
            <Label className="text-xs">Show on landing page</Label>
          </div>
          {dirty && <Button size="sm" onClick={() => onSave(local)}>Save</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

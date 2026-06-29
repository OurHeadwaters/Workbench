import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Sprout, Trash2, Loader2, Plus } from "lucide-react";
import {
  useListCoopProducers,
  getListCoopProducersQueryKey,
  useCreateCoopProducer,
  useUpdateCoopProducer,
  useDeleteCoopProducer,
  type CoopProducer,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

const EMPTY_DRAFT = { name: "", farmName: "", location: "", bio: "", photoUrl: "" };

export default function AdminProducers() {
  const qc = useQueryClient();
  const { data: producers, isLoading } = useListCoopProducers();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListCoopProducersQueryKey() });
  const create = useCreateCoopProducer({ mutation: { onSuccess: invalidate } });
  const update = useUpdateCoopProducer({ mutation: { onSuccess: invalidate } });
  const del = useDeleteCoopProducer({ mutation: { onSuccess: invalidate } });

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [showAdd, setShowAdd] = useState(false);

  if (isLoading || !producers) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  function addProducer() {
    if (!draft.name.trim()) return;
    create.mutate({
      data: {
        name: draft.name.trim(),
        farmName: draft.farmName.trim(),
        location: draft.location.trim(),
        bio: draft.bio.trim(),
        photoUrl: draft.photoUrl.trim(),
        sortOrder: producers?.length ?? 0,
        active: true,
      },
    });
    setDraft(EMPTY_DRAFT);
    setShowAdd(false);
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-4xl font-serif mb-2 flex items-center gap-3"><Sprout /> 807 Producers</h2>
          <p className="text-muted-foreground max-w-2xl">
            Manage the farms and producers who supply the 807 Food Coop storefront. Each producer gets a story panel on the public shop page.
          </p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2">
          <Plus size={16} /> Add Producer
        </Button>
      </div>

      {showAdd && (
        <Card className="border-2 border-dashed border-primary/40 bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-serif text-xl">New Producer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Producer / Display Name</Label>
                <Input placeholder="Sun River Farm" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Farm Name</Label>
                <Input placeholder="Sun River Organic Farm" value={draft.farmName} onChange={(e) => setDraft({ ...draft, farmName: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Location</Label>
                <Input placeholder="Dryden, ON" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Photo URL</Label>
                <Input placeholder="https://..." value={draft.photoUrl} onChange={(e) => setDraft({ ...draft, photoUrl: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bio / Story (2–3 sentences)</Label>
              <Textarea rows={3} placeholder="Their story, what they grow, what makes them distinct..." value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={addProducer} disabled={create.isPending || !draft.name.trim()}>
                {create.isPending ? <Loader2 className="animate-spin mr-2" size={14} /> : null}Save Producer
              </Button>
              <Button variant="outline" onClick={() => { setShowAdd(false); setDraft(EMPTY_DRAFT); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {producers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-md">
          <Sprout className="mx-auto mb-3 opacity-40" size={48} />
          <p>No producers yet. Add the first one above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {producers.map((p) => (
            <ProducerCard
              key={p.id}
              producer={p}
              onSave={(patch) => update.mutate({ id: p.id, data: { ...p, ...patch } })}
              onDelete={() => del.mutate({ id: p.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProducerCard({ producer, onSave, onDelete }: { producer: CoopProducer; onSave: (p: Partial<CoopProducer>) => void; onDelete: () => void }) {
  const [local, setLocal] = useState(producer);
  const [open, setOpen] = useState(false);
  const dirty = JSON.stringify(local) !== JSON.stringify(producer);

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-serif text-lg font-bold">{producer.name}</p>
            <p className="text-sm text-muted-foreground">{producer.farmName} · {producer.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={local.active} onCheckedChange={(v) => { setLocal({ ...local, active: v }); onSave({ active: v }); }} />
            <Label className="text-xs">Active</Label>
            <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>{open ? "Collapse" : "Edit"}</Button>
            <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 size={16} /></Button>
          </div>
        </div>

        {open && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Display Name</Label>
                <Input value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} />
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Farm Name</Label>
                <Input value={local.farmName} onChange={(e) => setLocal({ ...local, farmName: e.target.value })} />
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Location</Label>
                <Input value={local.location} onChange={(e) => setLocal({ ...local, location: e.target.value })} />
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Photo URL</Label>
                <Input value={local.photoUrl} onChange={(e) => setLocal({ ...local, photoUrl: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Bio</Label>
              <Textarea rows={3} value={local.bio} onChange={(e) => setLocal({ ...local, bio: e.target.value })} />
            </div>
            {dirty && (
              <Button size="sm" onClick={() => onSave(local)}>Save Changes</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

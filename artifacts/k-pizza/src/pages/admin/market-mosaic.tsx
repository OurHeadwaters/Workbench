import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sprout, Loader2, Plus, Trash2, Sparkles, Check, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey,
  useListMarketStalls,
  getListMarketStallsQueryKey,
  useCreateMarketStall,
  useUpdateMarketStall,
  useDeleteMarketStall,
  type MarketMosaicSettings,
  type MarketStall,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

type Tab = "season" | "stalls" | "local-hour";

export default function AdminMarketMosaic() {
  const [tab, setTab] = useState<Tab>("season");

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-4xl font-serif mb-2 flex items-center gap-3"><Sprout /> Market Mosaic · Days of Summer</h2>
        <p className="text-muted-foreground max-w-3xl">
          The Thursday Farmers' Market hop. Flip the season on, log this week's stalls (mark which ones land in the 807 co-op crate), and rewrite the Local Hour card. The public page is at <code className="bg-muted px-1.5 py-0.5 text-xs rounded">/market-mosaic</code>.
        </p>
      </div>

      <div className="flex border-b border-border">
        {([
          { id: "season", label: "Season" },
          { id: "stalls", label: "Stalls" },
          { id: "local-hour", label: "Local Hour" },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-3 font-sans text-sm uppercase tracking-widest border-b-2 transition-colors ${tab === t.id ? "border-primary text-foreground font-bold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "season" && <SeasonTab />}
      {tab === "stalls" && <StallsTab />}
      {tab === "local-hour" && <HappyHourTab />}
    </div>
  );
}

function useMosaicMutation() {
  const qc = useQueryClient();
  const update = useUpdateSettings({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) },
  });
  return update;
}

function SeasonTab() {
  const { data: settings, isLoading } = useGetSettings();
  const update = useMosaicMutation();
  const [local, setLocal] = useState<MarketMosaicSettings | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (settings?.marketMosaic && !local) setLocal(settings.marketMosaic);
  }, [settings, local]);

  if (isLoading || !settings || !local) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const dirty = JSON.stringify(local) !== JSON.stringify(settings.marketMosaic);

  function save() {
    if (!settings || !local) return;
    update.mutate(
      { data: { marketMosaic: local } },
      { onSuccess: () => setSavedAt(Date.now()) },
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Switch checked={local.seasonEnabled} onCheckedChange={(v) => setLocal({ ...local, seasonEnabled: v })} />
            <div>
              <p className="font-serif text-xl leading-tight">Days of Summer is {local.seasonEnabled ? "ON" : "OFF"}</p>
              <p className="text-xs text-muted-foreground font-sans">When on, the landing page shows a Thursday hook and <code className="bg-muted px-1 rounded">/market-mosaic</code> is live.</p>
            </div>
          </div>
          {savedAt && Date.now() - savedAt < 3000 && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-sans"><Check size={12} /> Saved</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Season start</Label>
            <Input type="date" value={local.seasonStart} onChange={(e) => setLocal({ ...local, seasonStart: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Season end</Label>
            <Input type="date" value={local.seasonEnd} onChange={(e) => setLocal({ ...local, seasonEnd: e.target.value })} />
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Thursday hours line</Label>
          <Input value={local.thursdayHours} onChange={(e) => setLocal({ ...local, thursdayHours: e.target.value })} />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Public page headline</Label>
          <Input value={local.daysOfSummerHeadline} onChange={(e) => setLocal({ ...local, daysOfSummerHeadline: e.target.value })} />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Public page intro</Label>
          <Textarea rows={3} value={local.daysOfSummerIntro} onChange={(e) => setLocal({ ...local, daysOfSummerIntro: e.target.value })} />
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Landing page hook</p>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Label badge</Label>
            <Input value={local.landingBannerLabel} onChange={(e) => setLocal({ ...local, landingBannerLabel: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Hook blurb</Label>
            <Textarea rows={2} value={local.landingBannerBlurb} onChange={(e) => setLocal({ ...local, landingBannerBlurb: e.target.value })} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={!dirty || update.isPending}>
            {update.isPending ? <Loader2 className="animate-spin" size={14} /> : "Save season settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StallsTab() {
  const qc = useQueryClient();
  const { data: stalls, isLoading } = useListMarketStalls();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListMarketStallsQueryKey() });
  const create = useCreateMarketStall({ mutation: { onSuccess: invalidate } });
  const update = useUpdateMarketStall({ mutation: { onSuccess: invalidate } });
  const del = useDeleteMarketStall({ mutation: { onSuccess: invalidate } });
  const [draft, setDraft] = useState({ name: "", coopMember: false });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (isLoading || !stalls) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const ordered = [...stalls].sort((a, b) => a.sortOrder - b.sortOrder);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ordered.findIndex((s) => s.id === Number(active.id));
    const newIndex = ordered.findIndex((s) => s.id === Number(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(ordered, oldIndex, newIndex);
    reordered.forEach((stall, idx) => {
      if (stall.sortOrder !== idx) {
        update.mutate({ id: stall.id, data: { ...stall, sortOrder: idx } });
      }
    });
  }

  function addStall() {
    if (!draft.name.trim()) return;
    create.mutate({
      data: {
        name: draft.name.trim(),
        blurb: "",
        coopMember: draft.coopMember,
        coopNote: "",
        imageUrl: "",
        sortOrder: stalls?.length ?? 0,
        active: true,
      },
    });
    setDraft({ name: "", coopMember: false });
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-primary/40 bg-primary/5">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-7">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Stall name</Label>
              <Input placeholder="e.g. Wabigoon Greens" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div className="md:col-span-3 flex items-center gap-2 pb-2">
              <Switch checked={draft.coopMember} onCheckedChange={(v) => setDraft({ ...draft, coopMember: v })} />
              <Label className="text-xs">807 co-op</Label>
            </div>
            <div className="md:col-span-2">
              <Button onClick={addStall} disabled={create.isPending || !draft.name.trim()} className="w-full">
                <Plus size={14} className="mr-1" /> Add
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-sans">Add the stall first, then fill in the blurb and the 807 tie-in below.</p>
        </CardContent>
      </Card>

      {ordered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border">
          <Sprout className="mx-auto mb-3 opacity-40" size={48} />
          <p>No stalls yet. Add this week's row above.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground font-sans flex items-center gap-1.5">
            <GripVertical size={12} /> Drag the handle on any card to reorder the public mosaic.
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ordered.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {ordered.map((s) => (
                  <StallCard
                    key={s.id}
                    stall={s}
                    onSave={(patch) => update.mutate({ id: s.id, data: { ...s, ...patch } })}
                    onDelete={() => del.mutate({ id: s.id })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}

function StallCard({ stall, onSave, onDelete }: { stall: MarketStall; onSave: (p: Partial<MarketStall>) => void; onDelete: () => void }) {
  const [local, setLocal] = useState(stall);
  const dirty = JSON.stringify(local) !== JSON.stringify(stall);
  useEffect(() => { setLocal(stall); }, [stall]);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stall.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <Card ref={setNodeRef} style={style}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="mt-6 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical size={18} />
          </button>
          <div className="flex-1">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Stall name</Label>
            <Input value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} />
          </div>
          <Button variant="ghost" size="icon" onClick={onDelete} className="mt-5"><Trash2 size={16} /></Button>
        </div>
        <div>
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Blurb</Label>
          <Textarea rows={2} value={local.blurb} onChange={(e) => setLocal({ ...local, blurb: e.target.value })} />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Switch checked={local.coopMember} onCheckedChange={(v) => setLocal({ ...local, coopMember: v })} />
          <Label className="text-xs flex items-center gap-1"><Sparkles size={10} className="text-primary" /> In the 807 co-op crate this week</Label>
        </div>
        {local.coopMember && (
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">807 tie-in</Label>
            <Textarea rows={2} value={local.coopNote} placeholder="e.g. salad mix → Greek slice tonight" onChange={(e) => setLocal({ ...local, coopNote: e.target.value })} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Image URL (optional)</Label>
            <Input value={local.imageUrl} placeholder="https://…" onChange={(e) => setLocal({ ...local, imageUrl: e.target.value })} />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Sort</Label>
            <Input type="number" value={local.sortOrder} onChange={(e) => setLocal({ ...local, sortOrder: Number(e.target.value) || 0 })} />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Switch checked={local.active} onCheckedChange={(v) => setLocal({ ...local, active: v })} />
            <Label className="text-xs">Show on public page</Label>
          </div>
          {dirty && <Button size="sm" onClick={() => onSave(local)}>Save</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

function HappyHourTab() {
  const { data: settings, isLoading } = useGetSettings();
  const update = useMosaicMutation();
  const [local, setLocal] = useState<MarketMosaicSettings | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (settings?.marketMosaic && !local) setLocal(settings.marketMosaic);
  }, [settings, local]);

  if (isLoading || !settings || !local) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const dirty = JSON.stringify(local) !== JSON.stringify(settings.marketMosaic);
  const hh = local.happyHour;
  const setHH = (patch: Partial<typeof hh>) => setLocal({ ...local, happyHour: { ...hh, ...patch } });

  function save() {
    if (!local) return;
    const payload: MarketMosaicSettings = local;
    update.mutate(
      { data: { marketMosaic: payload } },
      { onSuccess: () => setSavedAt(Date.now()) },
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Happy hour card — last section of /market-mosaic</p>
          {savedAt && Date.now() - savedAt < 3000 && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-sans"><Check size={12} /> Saved</span>
          )}
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Headline</Label>
          <Input value={hh.headline} onChange={(e) => setHH({ headline: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tonight's special (rewrite each Thursday)</Label>
          <Textarea rows={3} value={hh.special} onChange={(e) => setHH({ special: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Weekly rotation note</Label>
          <Textarea rows={2} value={hh.weeklyRotation} onChange={(e) => setHH({ weeklyRotation: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Hours line</Label>
            <Input value={hh.hoursLine} onChange={(e) => setHH({ hoursLine: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">CTA label</Label>
            <Input value={hh.ctaLabel} onChange={(e) => setHH({ ctaLabel: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={!dirty || update.isPending}>
            {update.isPending ? <Loader2 className="animate-spin" size={14} /> : "Save Local Hour"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

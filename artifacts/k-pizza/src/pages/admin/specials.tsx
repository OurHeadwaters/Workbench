import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { DAY_NAMES } from "@/lib/api";
import {
  useGetSpecials,
  getGetSpecialsQueryKey,
  useUpdateDailySpecial,
  useCreateSeasonalSpecial,
  useUpdateSeasonalSpecial,
  useDeleteSeasonalSpecial,
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey,
  type SeasonalSpecial,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

const SEASONS = ["winter", "spring", "summer", "fall"] as const;

export default function AdminSpecials() {
  const qc = useQueryClient();
  const { data: specials, isLoading } = useGetSpecials();
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettings({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) },
  });
  const updateDaily = useUpdateDailySpecial({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSpecialsQueryKey() }) },
  });
  const createSeasonal = useCreateSeasonalSpecial({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSpecialsQueryKey() }) },
  });
  const updateSeasonal = useUpdateSeasonalSpecial({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSpecialsQueryKey() }) },
  });
  const deleteSeasonal = useDeleteSeasonalSpecial({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSpecialsQueryKey() }) },
  });

  const [season, setSeason] = useState(settings?.currentSeason ?? "winter");
  useEffect(() => {
    if (settings) setSeason(settings.currentSeason);
  }, [settings?.currentSeason]);

  if (isLoading || !specials || !settings) {
    return (
      <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
    );
  }

  const today = new Date().getDay();
  const daily = specials.daily;
  const seasonalGroups: Record<string, SeasonalSpecial[]> = {};
  for (const s of SEASONS) seasonalGroups[s] = [];
  for (const item of specials.seasonal) (seasonalGroups[item.season] ??= []).push(item);

  const setActiveSeason = (s: string) => {
    setSeason(s);
    updateSettings.mutate({ data: { currentSeason: s } });
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12">
      <div>
        <h2 className="text-4xl font-serif mb-2">Specials Engine</h2>
        <p className="text-muted-foreground">Seasonal menus and daily specials. Changes go live instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">

          <section className="space-y-6">
            <h3 className="text-2xl font-serif border-b border-border pb-2">Seasonal Menu</h3>
            <Tabs value={season} onValueChange={setActiveSeason}>
              <TabsList className="grid grid-cols-4 mb-6">
                {SEASONS.map(s => <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>)}
              </TabsList>
              {SEASONS.map(s => (
                <TabsContent key={s} value={s} className="space-y-4">
                  {(seasonalGroups[s] ?? []).map((item) => (
                    <SeasonalRow
                      key={item.id}
                      item={item}
                      onSave={(patch) => updateSeasonal.mutate({ id: item.id, data: { ...item, ...patch } })}
                      onDelete={() => deleteSeasonal.mutate({ id: item.id })}
                    />
                  ))}
                  <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => createSeasonal.mutate({ data: { season: s, name: "New Item", price: "$0", description: "", sortOrder: (seasonalGroups[s]?.length ?? 0) } })}
                  >
                    <Plus size={16} className="mr-2" /> Add {s} item
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-serif border-b border-border pb-2">Daily Specials</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 0].map(dayNum => {
                const d = daily.find(x => x.dayOfWeek === dayNum);
                if (!d) return null;
                return (
                  <DailyRow
                    key={dayNum}
                    day={d}
                    isToday={dayNum === today}
                    onSave={(patch) => updateDaily.mutate({ day: dayNum, data: { active: d.active, name: d.name, price: d.price, description: d.description, ...patch } })}
                  />
                );
              })}
            </div>
          </section>

        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-6">
            <h3 className="text-lg font-sans font-bold uppercase tracking-widest text-muted-foreground mb-4">Live Preview</h3>
            <Card className="bg-background overflow-hidden">
              <div className="bg-muted p-4 border-b border-border">
                <p className="text-xs text-center font-bold uppercase tracking-widest opacity-50">Website Menu Section</p>
              </div>
              <CardContent className="p-6 space-y-8">
                {(() => {
                  const t = daily.find(x => x.dayOfWeek === today);
                  if (!t?.active) return null;
                  return (
                    <div>
                      <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-2">Today's Special</p>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-lg font-bold">{t.name}</h4>
                        <span className="font-serif">{t.price}</span>
                      </div>
                      <p className="text-foreground/70 text-xs">{t.description}</p>
                    </div>
                  );
                })()}
                {(seasonalGroups[season] ?? []).length > 0 && (
                  <div>
                    <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-2 capitalize">{season} Features</p>
                    <div className="space-y-4">
                      {(seasonalGroups[season] ?? []).map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="text-lg font-bold">{item.name || "Unnamed"}</h4>
                            <span className="font-serif">{item.price}</span>
                          </div>
                          <p className="text-foreground/70 text-xs">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeasonalRow({ item, onSave, onDelete }: { item: SeasonalSpecial; onSave: (p: Partial<SeasonalSpecial>) => void; onDelete: () => void }) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description);
  useEffect(() => { setName(item.name); setPrice(item.price); setDescription(item.description); }, [item.id]);
  const commit = () => onSave({ name, price, description });
  return (
    <Card className="relative group">
      <Button variant="ghost" size="icon" className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 text-destructive" onClick={onDelete}>
        <Trash2 size={16} />
      </Button>
      <CardContent className="pt-6 grid gap-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <Label className="text-xs mb-1 block">Item Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={commit} />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Price</Label>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} onBlur={commit} />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Description</Label>
          <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} onBlur={commit} />
        </div>
      </CardContent>
    </Card>
  );
}

function DailyRow({ day, isToday, onSave }: { day: { dayOfWeek: number; active: boolean; name: string; price: string; description: string }; isToday: boolean; onSave: (p: Partial<{ active: boolean; name: string; price: string; description: string }>) => void }) {
  const [name, setName] = useState(day.name);
  const [price, setPrice] = useState(day.price);
  const [description, setDescription] = useState(day.description);
  useEffect(() => { setName(day.name); setPrice(day.price); setDescription(day.description); }, [day.dayOfWeek]);
  return (
    <Card className={day.active ? "border-primary/50" : "bg-muted/30"}>
      <CardHeader className="py-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Switch checked={day.active} onCheckedChange={(c) => onSave({ active: c })} />
          <CardTitle className="text-lg font-serif">{DAY_NAMES[day.dayOfWeek]}</CardTitle>
        </div>
        {isToday && <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1">Today</span>}
      </CardHeader>
      {day.active && (
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <Label className="text-xs mb-1 block">Special Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => onSave({ name })} />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Price</Label>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} onBlur={() => onSave({ price })} />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1 block">Details</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} onBlur={() => onSave({ description })} />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

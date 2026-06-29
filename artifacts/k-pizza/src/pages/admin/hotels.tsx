import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Hotel, Plus, Trash2, ExternalLink, QrCode } from "lucide-react";
import {
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey,
  type Settings,
  type HotelGuestSettings,
  type FirstVisitPick,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminHotels() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSettings();
  const update = useUpdateSettings({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) },
  });
  const [local, setLocal] = useState<HotelGuestSettings | null>(null);

  useEffect(() => {
    if (data) setLocal(data.hotelGuest);
  }, [data]);

  if (isLoading || !local || !data) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const save = (next: HotelGuestSettings) => {
    setLocal(next);
    update.mutate({ data: { hotelGuest: next } as Partial<Settings> });
  };

  const updateField = <K extends keyof HotelGuestSettings>(k: K, v: HotelGuestSettings[K]) => {
    setLocal({ ...local, [k]: v });
  };

  const updatePick = (i: number, patch: Partial<FirstVisitPick>) => {
    const next = local.firstVisitPicks.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    setLocal({ ...local, firstVisitPicks: next });
  };

  const removePick = (i: number) => {
    const next = local.firstVisitPicks.filter((_, idx) => idx !== i);
    save({ ...local, firstVisitPicks: next });
  };

  const addPick = () => {
    save({ ...local, firstVisitPicks: [...local.firstVisitPicks, { name: "", why: "" }] });
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-serif mb-2 flex items-center gap-3"><Hotel /> Hotel Guest Page</h2>
        <p className="text-muted-foreground max-w-3xl">
          Edit the welcome blurb and what-to-order picks shown on the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/visiting-dryden</code> page. The same page is what every printed QR card points at. Changes go live as soon as you save.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/visiting-dryden" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm"><ExternalLink size={14} className="mr-1.5" /> View guest page</Button>
          </a>
          <a href="/hotel-qr-card" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm"><QrCode size={14} className="mr-1.5" /> Open printable QR card</Button>
          </a>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-serif">Welcome blurb</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs mb-1 block">Short warm welcome shown at the top of the guest page</Label>
            <Textarea
              rows={5}
              value={local.welcomeBlurb}
              onChange={(e) => updateField("welcomeBlurb", e.target.value)}
              onBlur={() => save(local)}
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">One-block-walk tagline</Label>
            <Input
              value={local.walkLine}
              onChange={(e) => updateField("walkLine", e.target.value)}
              onBlur={() => save(local)}
              placeholder="About a one-block walk from most downtown Dryden hotels."
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Map link (Google Maps URL)</Label>
            <Input
              value={local.mapUrl}
              onChange={(e) => updateField("mapUrl", e.target.value)}
              onBlur={() => save(local)}
              placeholder="https://www.google.com/maps/..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">First-visit picks</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Three to five items to point first-time visitors at. Each pick gets a short reason why.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {local.firstVisitPicks.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No picks yet. Add one below.</p>
          )}
          {local.firstVisitPicks.map((pick, i) => (
            <div key={i} className="border border-border rounded-md p-4 space-y-3 bg-background">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Pick name</Label>
                    <Input
                      value={pick.name}
                      onChange={(e) => updatePick(i, { name: e.target.value })}
                      onBlur={() => save(local)}
                      placeholder="e.g. The Classic Pepperoni"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Why this pick</Label>
                    <Textarea
                      rows={2}
                      value={pick.why}
                      onChange={(e) => updatePick(i, { why: e.target.value })}
                      onBlur={() => save(local)}
                      placeholder="Short reason — one or two sentences."
                    />
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removePick(i)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addPick} variant="outline" className="w-full"><Plus size={14} className="mr-1.5" /> Add a pick</Button>
        </CardContent>
      </Card>
    </div>
  );
}

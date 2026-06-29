import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Megaphone, Check } from "lucide-react";
import {
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey,
  type WeeklyPromo,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

type Template = WeeklyPromo;

const TEMPLATES: Template[] = [
  {
    enabled: true,
    templateId: "local_hour",
    name: "Local Hour",
    hook: "Half-price slices to break the Friday-night quiet. Walk in, grab a slice, head back out.",
    timeWindow: "Fri 6–8pm · walk-in only",
    ctaLabel: "Walk in",
    ctaHref: "#location",
    remindOptIn: true,
  },
  {
    enabled: true,
    templateId: "feed_jobsite",
    name: "Feed the Jobsite",
    hook: "Buy a large for the crew Thu/Fri lunch, get free wings. Punch card after 5 orders.",
    timeWindow: "Thu & Fri lunch · 11am–2pm",
    ctaLabel: "Reserve a spot",
    ctaHref: "/order",
    remindOptIn: true,
  },
  {
    enabled: true,
    templateId: "mystery_pie",
    name: "Mystery Pie Friday",
    hook: "$15 mystery pizza dropped every Friday 6pm. First 20 walk-ins, then it's gone.",
    timeWindow: "Fri 6pm · first 20 walk-ins",
    ctaLabel: "Walk in",
    ctaHref: "#location",
    remindOptIn: true,
  },
];

export default function AdminPromo() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useGetSettings();
  const update = useUpdateSettings({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) },
  });

  const promo = settings?.weeklyPromo;
  const [draft, setDraft] = useState<WeeklyPromo | null>(null);

  useEffect(() => {
    if (promo) setDraft(promo);
  }, [promo?.templateId, promo?.name, promo?.hook, promo?.timeWindow, promo?.ctaLabel, promo?.ctaHref, promo?.enabled, promo?.remindOptIn]);

  if (isLoading || !settings || !draft) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const save = (patch: Partial<WeeklyPromo>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    update.mutate({ data: { weeklyPromo: next } });
  };

  const applyTemplate = (t: Template) => {
    setDraft(t);
    update.mutate({ data: { weeklyPromo: { ...t, enabled: draft.enabled } } });
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-serif mb-2">This Week Promo</h2>
        <p className="text-muted-foreground max-w-2xl">
          The bold strip pinned near the top of the landing page. Pick a starter template, edit the words, or flip the whole thing off. Local Hour runs with the 807 Thursday drop — crate lands in the morning, the special hits the strip that afternoon.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Megaphone size={18} />
            </div>
            <div>
              <p className="font-serif text-lg">Show the promo strip on the landing page</p>
              <p className="text-sm text-muted-foreground">When this is off, the strip disappears for everyone. The lead inbox keeps any opt-ins you already collected.</p>
            </div>
          </div>
          <Switch checked={draft.enabled} onCheckedChange={(c) => save({ enabled: c })} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="space-y-4">
            <h3 className="text-2xl font-serif border-b border-border pb-2">Starter templates</h3>
            <p className="text-sm text-muted-foreground">Pick one to load it in. You can still edit any field after.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TEMPLATES.map((t) => {
                const active = draft.templateId === t.templateId;
                return (
                  <button
                    key={t.templateId}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    className={`text-left border p-4 transition-colors ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">{active ? "Active" : "Use this"}</span>
                      {active && <Check size={14} className="text-primary" />}
                    </div>
                    <p className="font-serif text-lg leading-tight mb-1">{t.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{t.timeWindow}</p>
                    <p className="text-sm text-foreground/75 leading-snug">{t.hook}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-serif border-b border-border pb-2">Edit the live promo</h3>
            <Card>
              <CardContent className="p-5 grid gap-4">
                <div>
                  <Label className="text-xs mb-1 block">Promo name</Label>
                  <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} onBlur={() => save({ name: draft.name })} />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">One-line hook</Label>
                  <Textarea rows={2} value={draft.hook} onChange={(e) => setDraft({ ...draft, hook: e.target.value })} onBlur={() => save({ hook: draft.hook })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-1 block">Day / time window</Label>
                    <Input value={draft.timeWindow} onChange={(e) => setDraft({ ...draft, timeWindow: e.target.value })} onBlur={() => save({ timeWindow: draft.timeWindow })} />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">CTA label</Label>
                    <Input value={draft.ctaLabel} onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })} onBlur={() => save({ ctaLabel: draft.ctaLabel })} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs mb-1 block">CTA link</Label>
                  <Input value={draft.ctaHref} onChange={(e) => setDraft({ ...draft, ctaHref: e.target.value })} onBlur={() => save({ ctaHref: draft.ctaHref })} placeholder="/order or #location" />
                  <p className="text-xs text-muted-foreground mt-1">Use <code>/order</code> for the order page, <code>#location</code> to scroll to the map, or a full URL.</p>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="font-sans text-sm font-bold">"Remind me" email opt-in</p>
                    <p className="text-xs text-muted-foreground">Adds a small email field below the promo. Opt-ins land in the Lead Inbox under "This Week Promo".</p>
                  </div>
                  <Switch checked={draft.remindOptIn} onCheckedChange={(c) => save({ remindOptIn: c })} />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-6">
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-3">Live Preview</h3>
            <Card className="overflow-hidden">
              <div className="bg-muted p-3 border-b border-border">
                <p className="text-xs text-center font-bold uppercase tracking-widest opacity-50">Landing page strip</p>
              </div>
              <CardContent className="p-0">
                <PromoPreview promo={draft} />
              </CardContent>
            </Card>
            {!draft.enabled && (
              <p className="mt-3 text-xs text-muted-foreground italic">Strip is currently hidden on the site.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PromoPreview({ promo }: { promo: WeeklyPromo }) {
  return (
    <div className="bg-primary text-white p-5 space-y-2">
      <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/80">This Week at Konstantino's</p>
      <p className="font-serif text-2xl leading-tight">{promo.name || "(no name)"}</p>
      <p className="font-sans text-sm text-white/90">{promo.hook}</p>
      <p className="text-[11px] uppercase tracking-widest font-bold text-white/80 pt-1">{promo.timeWindow}</p>
      <div className="pt-2">
        <span className="inline-block bg-white text-primary px-4 py-2 text-xs font-bold uppercase tracking-widest">
          {promo.ctaLabel || "Walk in"}
        </span>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Power, Pause, X, Plus, Trash2, Download, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import {
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey,
  type Settings,
  type HoursForDay,
  type AddonPitch,
  type FreezerShelfSettings,
  type FreezerShelfItem,
  type CateringPackage,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { DAY_NAMES } from "@/lib/api";

export default function AdminSettings() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSettings();
  const update = useUpdateSettings({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) } });
  const [local, setLocal] = useState<Settings | null>(null);
  useEffect(() => { if (data) setLocal(data); }, [data]);

  const [pdfStatus, setPdfStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [pdfError, setPdfError] = useState<string | null>(null);

  const regeneratePdf = async () => {
    setPdfStatus("busy");
    setPdfError(null);
    try {
      const res = await fetch("/api/admin/overview-pdf/regenerate", { method: "POST" });
      const body = await res.json() as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error ?? "Unknown error");
      setPdfStatus("done");
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : String(err));
      setPdfStatus("error");
    }
  };

  if (isLoading || !local) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;

  const save = (patch: Partial<Settings>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    update.mutate({ data: patch });
  };

  const setPhoneAddon = (patch: Partial<AddonPitch>) => {
    const next = { ...local.phoneAddon, ...patch };
    setLocal({ ...local, phoneAddon: next });
  };
  const savePhoneAddon = () => save({ phoneAddon: local.phoneAddon });

  const setCoopAddon = (patch: Partial<AddonPitch>) => {
    const next = { ...local.coopAddon, ...patch };
    setLocal({ ...local, coopAddon: next });
  };
  const saveCoopAddon = () => save({ coopAddon: local.coopAddon });

  const setFreezer = (patch: Partial<FreezerShelfSettings>) => {
    const next = { ...local.freezerShelf, ...patch };
    setLocal({ ...local, freezerShelf: next });
  };
  const saveFreezer = () => save({ freezerShelf: local.freezerShelf });
  const updateFreezerItem = (idx: number, patch: Partial<FreezerShelfItem>) => {
    const items = local.freezerShelf.items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    setLocal({ ...local, freezerShelf: { ...local.freezerShelf, items } });
  };
  const addFreezerItem = () => {
    const items = [
      ...local.freezerShelf.items,
      { name: "", blurb: "", imageUrl: "", link: "" },
    ];
    const next = { ...local.freezerShelf, items };
    setLocal({ ...local, freezerShelf: next });
    update.mutate({ data: { freezerShelf: next } });
  };
  const removeFreezerItem = (idx: number) => {
    const items = local.freezerShelf.items.filter((_, i) => i !== idx);
    const next = { ...local.freezerShelf, items };
    setLocal({ ...local, freezerShelf: next });
    update.mutate({ data: { freezerShelf: next } });
  };

  const setCateringPackage = (idx: number, patch: Partial<CateringPackage>) => {
    const next = local.cateringPackages.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    setLocal({ ...local, cateringPackages: next });
  };
  const saveCateringPackages = () => save({ cateringPackages: local.cateringPackages });
  const addCateringPackage = () => {
    const next = [...local.cateringPackages, { name: "New Package", headcount: "", price: "", blurb: "" }];
    setLocal({ ...local, cateringPackages: next });
    update.mutate({ data: { cateringPackages: next } });
  };
  const removeCateringPackage = (idx: number) => {
    const next = local.cateringPackages.filter((_, i) => i !== idx);
    setLocal({ ...local, cateringPackages: next });
    update.mutate({ data: { cateringPackages: next } });
  };

  const setHours = (day: number, patch: Partial<HoursForDay>) => {
    const cur = local.hours[String(day) as keyof typeof local.hours];
    const nextDay = { ...cur, ...patch };
    const nextHours = { ...local.hours, [String(day)]: nextDay };
    save({ hours: nextHours });
  };

  const StatusButton = ({ value, label, icon: Icon, color }: { value: "open" | "paused" | "closed"; label: string; icon: typeof Power; color: string }) => (
    <button
      onClick={() => save({ status: value })}
      className={`flex-1 border-2 rounded-xl p-6 text-left transition-all ${local.status === value ? `${color} text-white border-transparent` : "border-border hover:border-foreground/30 bg-background"}`}
    >
      <Icon size={24} className="mb-2" />
      <div className="font-bold text-lg">{label}</div>
    </button>
  );

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-serif mb-2">Shop Settings</h2>
        <p className="text-muted-foreground">Status, hours, branding. Changes are live immediately.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Platform Overview PDF</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            The stakeholder overview document. Regenerate it whenever new features ship so it stays current.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={regeneratePdf}
                disabled={pdfStatus === "busy"}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {pdfStatus === "busy" ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : (
                  <RefreshCw size={14} className="mr-2" />
                )}
                {pdfStatus === "busy" ? "Regenerating…" : "Regenerate PDF"}
              </Button>
              <a href="/api/admin/overview-pdf/download" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Download size={14} className="mr-2" /> Download
                </Button>
              </a>
            </div>
            {pdfStatus === "done" && (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle2 size={15} /> PDF updated — download the new version above.
              </span>
            )}
            {pdfStatus === "error" && (
              <span className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle size={15} /> {pdfError ?? "Regeneration failed."}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-serif">Right now</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <StatusButton value="open" label="Open" icon={Power} color="bg-green-600" />
            <StatusButton value="paused" label="Paused" icon={Pause} color="bg-amber-600" />
            <StatusButton value="closed" label="Closed" icon={X} color="bg-destructive" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Status message (shown on the site when paused/closed)</Label>
            <Input
              value={local.statusMessage}
              onChange={(e) => setLocal({ ...local, statusMessage: e.target.value })}
              onBlur={() => save({ statusMessage: local.statusMessage })}
              placeholder="e.g. Back at 5pm"
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Default pickup ETA (minutes)</Label>
            <Input
              type="number"
              value={local.pickupEtaMin}
              onChange={(e) => setLocal({ ...local, pickupEtaMin: Number(e.target.value) })}
              onBlur={() => save({ pickupEtaMin: local.pickupEtaMin })}
              className="max-w-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-serif">Brand & contact</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs mb-1 block">Shop name</Label>
            <Input value={local.shopName} onChange={(e) => setLocal({ ...local, shopName: e.target.value })} onBlur={() => save({ shopName: local.shopName })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs mb-1 block">Phone</Label>
              <Input value={local.phone} onChange={(e) => setLocal({ ...local, phone: e.target.value })} onBlur={() => save({ phone: local.phone })} />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Address</Label>
              <Input value={local.address} onChange={(e) => setLocal({ ...local, address: e.target.value })} onBlur={() => save({ address: local.address })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Add-on pricing</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Pitch prices shown on the landing page. Changes go live as soon as you save.</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Front-Line Phone add-on</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-1 block">Price (e.g. $29)</Label>
                <Input
                  value={local.phoneAddon.price}
                  onChange={(e) => setPhoneAddon({ price: e.target.value })}
                  onBlur={savePhoneAddon}
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Period (e.g. /mo)</Label>
                <Input
                  value={local.phoneAddon.period}
                  onChange={(e) => setPhoneAddon({ period: e.target.value })}
                  onBlur={savePhoneAddon}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Rationale line</Label>
              <Textarea
                value={local.phoneAddon.tagline}
                onChange={(e) => setPhoneAddon({ tagline: e.target.value })}
                onBlur={savePhoneAddon}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-3 border-t pt-6">
            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">807 Freezer Shelf</div>
            <p className="text-xs text-muted-foreground -mt-2">Raw pies and frozen dough sold on the 807 Food Co-op's Localline shop. Edit copy, link, and featured items.</p>
            <div>
              <Label className="text-xs mb-1 block">Localline shop URL</Label>
              <Input
                value={local.freezerShelf.locallineUrl}
                onChange={(e) => setFreezer({ locallineUrl: e.target.value })}
                onBlur={saveFreezer}
                placeholder="https://localline.ca/..."
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Section headline</Label>
              <Input
                value={local.freezerShelf.headline}
                onChange={(e) => setFreezer({ headline: e.target.value })}
                onBlur={saveFreezer}
                placeholder="Raw pies from yesterday's prep. Frozen on 807's shelf."
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Story / blurb</Label>
              <Textarea
                value={local.freezerShelf.story}
                onChange={(e) => setFreezer({ story: e.target.value })}
                onBlur={saveFreezer}
                rows={4}
                placeholder="Explain the partnership: raw pies from leftover prep, frozen dough, dual-branded Konstantino + 807."
              />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Featured items on the shelf</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFreezerItem}>
                  <Plus size={14} className="mr-1.5" /> Add item
                </Button>
              </div>
              {local.freezerShelf.items.length === 0 ? (
                <p className="text-sm text-muted-foreground italic border border-dashed border-border rounded-md p-4">
                  No items yet. Add a couple to show what's on the shelf right now.
                </p>
              ) : (
                local.freezerShelf.items.map((item, idx) => (
                  <div key={idx} className="border border-border rounded-md p-4 space-y-3 bg-muted/30">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">Item #{idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive h-8 w-8"
                        onClick={() => removeFreezerItem(idx)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs mb-1 block">Name</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateFreezerItem(idx, { name: e.target.value })}
                          onBlur={saveFreezer}
                          placeholder="Pepperoni 12"
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Image URL</Label>
                        <Input
                          value={item.imageUrl}
                          onChange={(e) => updateFreezerItem(idx, { imageUrl: e.target.value })}
                          onBlur={saveFreezer}
                          placeholder="/images/real/pepperoni.png"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Blurb</Label>
                      <Textarea
                        value={item.blurb}
                        onChange={(e) => updateFreezerItem(idx, { blurb: e.target.value })}
                        onBlur={saveFreezer}
                        rows={2}
                        placeholder="Same dough, same sauce — bake from frozen in 14 minutes."
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Direct Localline link (optional)</Label>
                      <Input
                        value={item.link}
                        onChange={(e) => updateFreezerItem(idx, { link: e.target.value })}
                        onBlur={saveFreezer}
                        placeholder="https://localline.ca/..."
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3 border-t pt-6">
            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">807 Co-op add-on</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-1 block">Price (e.g. $75)</Label>
                <Input
                  value={local.coopAddon.price}
                  onChange={(e) => setCoopAddon({ price: e.target.value })}
                  onBlur={saveCoopAddon}
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Period (e.g. /wk)</Label>
                <Input
                  value={local.coopAddon.period}
                  onChange={(e) => setCoopAddon({ period: e.target.value })}
                  onBlur={saveCoopAddon}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Tagline</Label>
              <Textarea
                value={local.coopAddon.tagline}
                onChange={(e) => setCoopAddon({ tagline: e.target.value })}
                onBlur={saveCoopAddon}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Catering SMS alert</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            When a catering quote comes in, also text Jamie so the lunch rush doesn't slow it down. Uses an SMS-via-email gateway, so enter the full carrier address (e.g. <code>8075551234@txt.bell.ca</code> or <code>8075551234@msg.telus.com</code>).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm">Text Jamie on new catering quotes</Label>
              <p className="text-xs text-muted-foreground">Email notification still goes out either way.</p>
            </div>
            <Switch
              checked={local.cateringSmsEnabled}
              onCheckedChange={(c) => save({ cateringSmsEnabled: c })}
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">SMS gateway address</Label>
            <Input
              value={local.cateringSmsPhone}
              onChange={(e) => setLocal({ ...local, cateringSmsPhone: e.target.value })}
              onBlur={() => save({ cateringSmsPhone: local.cateringSmsPhone })}
              placeholder="8075551234@txt.bell.ca"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Catering packages</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Shown on the Feed Your Team section of the landing page. Edit names, headcounts, and prices as you tune the pitch.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border border-border bg-muted/40 rounded-md p-4 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Printable one-pager</div>
              <p className="text-sm text-foreground/75 max-w-md">A clean PDF version of the 3 packages with a QR code back to the quote form — for Jamie to drop off at downtown offices.</p>
            </div>
            <a
              href={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/catering/print`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" className="bg-primary text-white hover:bg-primary/90">
                <Download size={14} className="mr-2" /> Download PDF
              </Button>
            </a>
          </div>
          {local.cateringPackages.map((pkg, idx) => (
            <div key={idx} className="border border-border rounded-md p-4 space-y-3 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive"
                onClick={() => removeCateringPackage(idx)}
                aria-label="Remove package"
              >
                <Trash2 size={16} />
              </Button>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Package {idx + 1}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Name</Label>
                  <Input
                    value={pkg.name}
                    onChange={(e) => setCateringPackage(idx, { name: e.target.value })}
                    onBlur={saveCateringPackages}
                  />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Headcount</Label>
                  <Input
                    placeholder="e.g. 10–15 people"
                    value={pkg.headcount}
                    onChange={(e) => setCateringPackage(idx, { headcount: e.target.value })}
                    onBlur={saveCateringPackages}
                  />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Price</Label>
                  <Input
                    placeholder="e.g. $13/head"
                    value={pkg.price}
                    onChange={(e) => setCateringPackage(idx, { price: e.target.value })}
                    onBlur={saveCateringPackages}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Blurb</Label>
                <Textarea
                  rows={2}
                  value={pkg.blurb}
                  onChange={(e) => setCateringPackage(idx, { blurb: e.target.value })}
                  onBlur={saveCateringPackages}
                />
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full border-dashed" onClick={addCateringPackage}>
            <Plus size={16} className="mr-2" /> Add package
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-serif">Weekly hours</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => {
            const h = local.hours[String(d) as keyof typeof local.hours];
            return (
              <div key={d} className="flex items-center gap-4">
                <div className="w-32 font-bold">{DAY_NAMES[d]}</div>
                <Switch checked={h.open} onCheckedChange={(c) => setHours(d, { open: c })} />
                {h.open ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Input type="time" value={h.start} onChange={(e) => setHours(d, { start: e.target.value })} className="w-32" />
                    <span className="text-muted-foreground">to</span>
                    <Input type="time" value={h.end} onChange={(e) => setHours(d, { end: e.target.value })} className="w-32" />
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Closed</span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

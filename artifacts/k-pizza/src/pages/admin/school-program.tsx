import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, GraduationCap, AlertTriangle, Check, ExternalLink, Leaf } from "lucide-react";
import {
  useGetSettings,
  useUpdateSettings,
  useListCoopCrate,
  getGetSettingsQueryKey,
  type Settings,
  type SchoolProgramSettings,
  type SchoolProgramRule,
  type SchoolProgramLever,
  type SchoolProgramIngredient,
  type SchoolProgramDay,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function AdminSchoolProgram() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSettings();
  const { data: coop } = useListCoopCrate({ active: true });
  const update = useUpdateSettings({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) } });
  const [local, setLocal] = useState<Settings | null>(null);
  useEffect(() => { if (data) setLocal(data); }, [data]);

  if (isLoading || !local) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;

  const sp = local.schoolProgram;

  const setSp = (patch: Partial<SchoolProgramSettings>) => {
    const next = { ...sp, ...patch };
    setLocal({ ...local, schoolProgram: next });
  };
  const saveSp = (patch?: Partial<SchoolProgramSettings>) => {
    const next: SchoolProgramSettings = patch ? { ...sp, ...patch } : sp;
    setLocal({ ...local, schoolProgram: next });
    update.mutate({ data: { schoolProgram: next } });
  };

  // Build available ingredient pool from active 807 crate + extra ingredients.
  const coopNames = (coop ?? []).map((c) => c.name);
  const extraNames = sp.extraIngredients.map((e) => e.name);
  const pool = Array.from(new Set([...coopNames, ...extraNames])).filter((n) => n.trim().length > 0);

  const matches = computeMatches(sp);
  const sourcing = computeSourcing(sp, coopNames);

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-serif mb-2 flex items-center gap-3"><GraduationCap /> School Lunch Program</h2>
        <p className="text-muted-foreground max-w-3xl">
          Owner-controlled pitch for the Ontario Student Nutrition Program. Set the operating facts, edit the OSNP rules the menu has to clear, plan the weekly menu against your 807 co-op crate, and tune the negotiation levers a coordinator can pull on. Everything here flows into the public pitch page and the printable pack.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <a href="/school-program" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            Open public pitch <ExternalLink size={12} />
          </a>
          <a href="/school-program/print" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            Open printable pack <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Toggle + facts */}
      <Card>
        <CardHeader><CardTitle className="font-serif">Pitch on / off</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border border-border p-4">
            <div>
              <p className="font-serif text-lg leading-tight">Pitch page live</p>
              <p className="text-sm text-muted-foreground">When off, /school-program shows a "not live" notice and the landing CTA is hidden.</p>
            </div>
            <Switch checked={sp.enabled} onCheckedChange={(v) => saveSp({ enabled: v })} />
          </div>
          <div>
            <Label className="text-xs">Hero line (shown at the top of the pitch)</Label>
            <Textarea rows={2} value={sp.heroLine} onChange={(e) => setSp({ heroLine: e.target.value })} onBlur={() => saveSp()} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-serif">Operating facts</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              ["capacity", "Capacity & lead time"],
              ["packaging", "Packaging"],
              ["allergens", "Allergens"],
              ["deliveryWindow", "Delivery window"],
              ["foodSafety", "Food safety"],
              ["sourcingNote", "Sourcing note (shown next to the % target)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label className="text-xs">{label}</Label>
              <Textarea rows={2} value={sp[key]} onChange={(e) => setSp({ [key]: e.target.value } as Partial<SchoolProgramSettings>)} onBlur={() => saveSp()} />
            </div>
          ))}
          <div className="max-w-xs">
            <Label className="text-xs">Local-sourcing target (%)</Label>
            <Input type="number" min={0} max={100} value={sp.sourcingTargetPct} onChange={(e) => setSp({ sourcingTargetPct: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })} onBlur={() => saveSp()} />
          </div>
        </CardContent>
      </Card>

      {/* OSNP rules */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">OSNP rules — what every week's menu must clear</CardTitle>
          <p className="text-sm text-muted-foreground">Each rule has a list of keywords. The engine scans every day's dish + ingredients for any match — if no day hits the keywords, you'll see a red gap on the pitch page.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sp.rules.map((rule, i) => {
            const m = matches[rule.id];
            const ok = m && m.daysSatisfied === sp.menu.length;
            return (
              <div key={rule.id} className={`border-2 p-4 space-y-3 ${ok ? "border-green-700/50 bg-green-50/50" : m && m.daysSatisfied > 0 ? "border-amber-500/50 bg-amber-50/50" : "border-red-600/50 bg-red-50/50"}`}>
                <div className="flex items-center gap-2">
                  {ok ? <Check size={16} className="text-green-700" /> : <AlertTriangle size={16} className="text-amber-700" />}
                  <p className="font-sans text-xs font-bold uppercase tracking-wider">
                    {ok ? "Met on all days" : m ? `Met on ${m.daysSatisfied} of ${sp.menu.length} days` : "Not met"}
                    {m && m.missingDays.length > 0 ? ` · gap on ${m.missingDays.join(", ")}` : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Label</Label>
                    <Input value={rule.label} onChange={(e) => updateRule(i, { label: e.target.value })} onBlur={() => saveSp()} />
                  </div>
                  <div>
                    <Label className="text-xs">Keywords (comma-separated, case-insensitive)</Label>
                    <Input value={rule.keywords.join(", ")} onChange={(e) => updateRule(i, { keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} onBlur={() => saveSp()} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Description (shown to the coordinator)</Label>
                  <Textarea rows={2} value={rule.description} onChange={(e) => updateRule(i, { description: e.target.value })} onBlur={() => saveSp()} />
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { const next = sp.rules.filter((_, j) => j !== i); saveSp({ rules: next }); }}>
                    <Trash2 size={14} className="mr-1.5" /> Remove rule
                  </Button>
                </div>
              </div>
            );
          })}
          <Button variant="outline" onClick={() => saveSp({ rules: [...sp.rules, { id: uid("rule"), label: "New rule", description: "", keywords: [] }] })}>
            <Plus size={14} className="mr-1.5" /> Add rule
          </Button>
        </CardContent>
      </Card>

      {/* Extra ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Pantry & off-crate ingredients</CardTitle>
          <p className="text-sm text-muted-foreground">
            The active 807 co-op crate is pulled in automatically (currently {coopNames.length} item{coopNames.length === 1 ? "" : "s"}). Add anything else you'll use this week so it shows up in the menu builder and on the sourcing report. Mark whether each is sourced through the 807 co-op.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {sp.extraIngredients.map((ing, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-end border border-border p-3">
              <div className="col-span-7">
                <Label className="text-xs">Ingredient</Label>
                <Input value={ing.name} onChange={(e) => updateExtra(i, { name: e.target.value })} onBlur={() => saveSp()} />
              </div>
              <div className="col-span-3 flex items-center gap-2 pb-2">
                <Switch checked={ing.source807} onCheckedChange={(v) => { updateExtra(i, { source807: v }); saveSp(); }} />
                <Label className="text-xs flex items-center gap-1"><Leaf size={12} className="text-green-700" /> 807 sourced</Label>
              </div>
              <div className="col-span-2 flex justify-end pb-1">
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { const next = sp.extraIngredients.filter((_, j) => j !== i); saveSp({ extraIngredients: next }); }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => saveSp({ extraIngredients: [...sp.extraIngredients, { name: "", source807: false }] })}>
            <Plus size={14} className="mr-1.5" /> Add ingredient
          </Button>
        </CardContent>
      </Card>

      {/* Weekly menu */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">This week's 5-day menu</CardTitle>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${sourcing >= sp.sourcingTargetPct ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-900"}`}>
              {sourcing}% local · target {sp.sourcingTargetPct}%
            </span>
            <p className="text-sm text-muted-foreground">Pool: {pool.length} ingredient{pool.length === 1 ? "" : "s"} ({coopNames.length} from 807, {extraNames.length} pantry).</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sp.menu.map((day, i) => (
            <div key={i} className="border border-border p-4 space-y-3">
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-3">
                  <Label className="text-xs">Day</Label>
                  <Input value={day.label} onChange={(e) => updateDay(i, { label: e.target.value })} onBlur={() => saveSp()} />
                </div>
                <div className="col-span-6">
                  <Label className="text-xs">Dish</Label>
                  <Input value={day.dish} onChange={(e) => updateDay(i, { dish: e.target.value })} onBlur={() => saveSp()} />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Price / meal</Label>
                  <Input value={day.price} onChange={(e) => updateDay(i, { price: e.target.value })} onBlur={() => saveSp()} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Ingredients (toggle to include / exclude)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {pool.map((name) => {
                    const selected = day.ingredients.includes(name);
                    const is807 = isCoop(name, coopNames) || isExtra807(name, sp.extraIngredients);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          const next = selected ? day.ingredients.filter((x) => x !== name) : [...day.ingredients, name];
                          updateDay(i, { ingredients: next });
                          saveSp();
                        }}
                        className={`text-xs px-2.5 py-1.5 border transition-colors flex items-center gap-1 ${selected ? (is807 ? "bg-green-700 text-white border-green-700" : "bg-foreground text-background border-foreground") : "bg-background text-foreground/70 border-border hover:border-foreground"}`}
                      >
                        {is807 && <Leaf size={10} />} {name}
                      </button>
                    );
                  })}
                  {pool.length === 0 && <p className="text-xs italic text-muted-foreground">No ingredients in the pool yet — add some above or activate 807 crate items.</p>}
                </div>
                {day.ingredients.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">Locked in: {day.ingredients.join(", ")}</p>
                )}
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { const next = sp.menu.filter((_, j) => j !== i); saveSp({ menu: next }); }}>
                  <Trash2 size={14} className="mr-1.5" /> Remove day
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => saveSp({ menu: [...sp.menu, { label: `Day ${sp.menu.length + 1}`, dish: "", price: "", ingredients: [] }] })}>
            <Plus size={14} className="mr-1.5" /> Add day
          </Button>
        </CardContent>
      </Card>

      {/* Negotiation levers */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Negotiation levers</CardTitle>
          <p className="text-sm text-muted-foreground">Cards a coordinator can pull on. Editable copy — these show up on the public pitch and the printable pack.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {sp.levers.map((lever, i) => (
            <div key={lever.id} className="border border-border p-4 space-y-3">
              <div>
                <Label className="text-xs">Title</Label>
                <Input value={lever.title} onChange={(e) => updateLever(i, { title: e.target.value })} onBlur={() => saveSp()} />
              </div>
              <div>
                <Label className="text-xs">Body</Label>
                <Textarea rows={3} value={lever.body} onChange={(e) => updateLever(i, { body: e.target.value })} onBlur={() => saveSp()} />
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { const next = sp.levers.filter((_, j) => j !== i); saveSp({ levers: next }); }}>
                  <Trash2 size={14} className="mr-1.5" /> Remove lever
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => saveSp({ levers: [...sp.levers, { id: uid("lever"), title: "New lever", body: "" }] })}>
            <Plus size={14} className="mr-1.5" /> Add lever
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  function updateRule(idx: number, patch: Partial<SchoolProgramRule>) {
    const next = sp.rules.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    setSp({ rules: next });
  }
  function updateExtra(idx: number, patch: Partial<SchoolProgramIngredient>) {
    const next = sp.extraIngredients.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    setSp({ extraIngredients: next });
  }
  function updateDay(idx: number, patch: Partial<SchoolProgramDay>) {
    const next = sp.menu.map((d, i) => (i === idx ? { ...d, ...patch } : d));
    setSp({ menu: next });
  }
  function updateLever(idx: number, patch: Partial<SchoolProgramLever>) {
    const next = sp.levers.map((l, i) => (i === idx ? { ...l, ...patch } : l));
    setSp({ levers: next });
  }
}

function computeMatches(sp: SchoolProgramSettings): Record<string, { daysSatisfied: number; missingDays: string[] }> {
  const out: Record<string, { daysSatisfied: number; missingDays: string[] }> = {};
  for (const rule of sp.rules) {
    let s = 0;
    const missing: string[] = [];
    for (const day of sp.menu) {
      const hay = (day.dish + " " + day.ingredients.join(" ")).toLowerCase();
      const ok = rule.keywords.some((kw) => kw && hay.includes(kw.toLowerCase()));
      if (ok) s++; else missing.push(day.label);
    }
    out[rule.id] = { daysSatisfied: s, missingDays: missing };
  }
  return out;
}

function isCoop(name: string, coopNames: string[]): boolean {
  const k = name.trim().toLowerCase();
  return coopNames.some((c) => {
    const n = c.trim().toLowerCase();
    return n === k || k.includes(n) || n.includes(k);
  });
}
function isExtra807(name: string, extras: SchoolProgramIngredient[]): boolean {
  const k = name.trim().toLowerCase();
  return extras.some((e) => e.name.trim().toLowerCase() === k && e.source807);
}

function computeSourcing(sp: SchoolProgramSettings, coopNames: string[]): number {
  const set = new Set<string>();
  for (const d of sp.menu) for (const i of d.ingredients) if (i.trim()) set.add(i.trim());
  if (set.size === 0) return 0;
  const local = Array.from(set).filter((n) => isCoop(n, coopNames) || isExtra807(n, sp.extraIngredients)).length;
  return Math.round((local / set.size) * 100);
}

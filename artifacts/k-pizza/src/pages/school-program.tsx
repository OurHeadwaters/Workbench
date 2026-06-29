import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, Check, GraduationCap, Leaf, AlertTriangle, Printer, ArrowLeft, FileText } from "lucide-react";
import {
  useGetSettings,
  useListCoopCrate,
  useCreatePhoneAddonRequest,
  type SchoolProgramSettings,
  type CoopCrateItem,
} from "@workspace/k-pizza-client-react";

export default function SchoolProgramPage() {
  const { data: settings } = useGetSettings();
  const { data: coopCrate } = useListCoopCrate({ active: true });
  const sp = settings?.schoolProgram;

  if (!settings || !sp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!sp.enabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="font-serif text-3xl">School lunch pitch isn't live right now.</p>
        <p className="font-sans text-foreground/70 max-w-md">
          The owner can turn this back on under Shop Tools → School Lunch Program.
        </p>
        <Link href="/" className="text-primary underline font-sans text-sm">Back to the shop</Link>
      </div>
    );
  }

  const match = ruleMatches(sp, coopCrate ?? []);
  const sourcing = sourcingPercent(sp);
  const targetMet = sourcing >= sp.sourcingTargetPct;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Top bar */}
      <nav className="px-6 md:px-12 py-5 border-b border-border flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 text-sm font-sans hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to the shop
        </Link>
        <div className="hidden md:flex items-center gap-3">
          <img src="/images/real/logo.jpg" alt="Konstantino Pizza & Wings" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-serif font-bold text-base tracking-tight uppercase">{settings.shopName?.split(" ")[0] ?? "Konstantino's"}</span>
        </div>
        <Link href="/school-program/print">
          <Button variant="outline" className="rounded-none font-sans uppercase tracking-wider text-xs">
            <Printer size={14} className="mr-2" /> Print pack
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-foreground text-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5">
            <GraduationCap size={14} /> Ontario Student Nutrition Program · Pitch
          </span>
          <h1 className="text-4xl md:text-6xl font-serif leading-[1.05]">
            {sp.heroLine}
          </h1>
          <p className="font-sans text-background/75 text-sm uppercase tracking-widest">
            Built for coordinators, lead agencies, and principals — not parents.
          </p>
        </div>
      </section>

      {/* Operating facts */}
      <section className="px-6 md:px-12 lg:px-24 py-16 border-b border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Fact label="Capacity & lead time" body={sp.capacity} />
          <Fact label="Packaging" body={sp.packaging} />
          <Fact label="Allergens" body={sp.allergens} />
          <Fact label="Delivery window" body={sp.deliveryWindow} />
          <Fact label="Food safety" body={sp.foodSafety} />
          <Fact label="Local-sourcing target" body={`${sp.sourcingTargetPct}% of weekly line items through the 807 Food Co-op. ${sp.sourcingNote}`} />
        </div>
      </section>

      {/* Weekly menu + rule engine */}
      <section className="px-6 md:px-12 lg:px-24 py-16 bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">This week's menu</p>
              <h2 className="text-3xl md:text-4xl font-serif leading-tight">Five hot lunches, OSNP-aligned.</h2>
            </div>
            <div className={`px-4 py-3 border-2 ${targetMet ? "border-green-700 bg-green-50 text-green-900" : "border-amber-600 bg-amber-50 text-amber-900"}`}>
              <p className="text-xs font-bold uppercase tracking-widest">Local sourcing</p>
              <p className="font-serif text-2xl leading-tight">{sourcing}% via 807 <span className="text-sm font-sans">(target {sp.sourcingTargetPct}%)</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {sp.menu.map((day, i) => (
              <div key={i} className="bg-background border border-border p-5 flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{day.label}</p>
                <p className="font-serif text-lg leading-tight mb-2">{day.dish || <span className="text-foreground/40 italic">No dish set</span>}</p>
                <p className="font-sans text-sm text-foreground/70 mb-3">{day.price}</p>
                <ul className="space-y-1 mt-auto">
                  {day.ingredients.map((ing, j) => {
                    const is807 = isSource807(sp, coopCrate ?? [], ing);
                    return (
                      <li key={j} className="font-sans text-xs flex items-center gap-1.5">
                        {is807 ? <Leaf size={11} className="text-green-700 flex-shrink-0" /> : <span className="w-[11px] flex-shrink-0" />}
                        <span className={is807 ? "text-foreground" : "text-foreground/65"}>{ing}</span>
                      </li>
                    );
                  })}
                  {day.ingredients.length === 0 && (
                    <li className="font-sans text-xs italic text-foreground/40">No ingredients yet</li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-background border border-border p-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">OSNP rule check</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sp.rules.map((rule) => {
                const m = match[rule.id];
                const ok = m && m.daysSatisfied === sp.menu.length;
                const partial = m && m.daysSatisfied > 0 && m.daysSatisfied < sp.menu.length;
                return (
                  <div key={rule.id} className={`p-4 border-2 ${ok ? "border-green-700 bg-green-50" : partial ? "border-amber-600 bg-amber-50" : "border-red-700 bg-red-50"}`}>
                    <div className="flex items-start gap-2">
                      {ok ? <Check size={16} className="text-green-700 flex-shrink-0 mt-0.5" /> : <AlertTriangle size={16} className={`flex-shrink-0 mt-0.5 ${partial ? "text-amber-700" : "text-red-700"}`} />}
                      <div className="flex-1">
                        <p className="font-serif text-base leading-tight">{rule.label}</p>
                        <p className="font-sans text-xs text-foreground/70 mt-1">{rule.description}</p>
                        <p className="font-sans text-xs font-bold mt-2 uppercase tracking-wider">
                          {m ? `Met on ${m.daysSatisfied} of ${sp.menu.length} days` : "Not met on any day"}
                          {m && m.missingDays.length > 0 && (
                            <span className="font-normal normal-case text-foreground/70"> · gap on {m.missingDays.join(", ")}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Local sourcing report summary */}
      <section className="px-6 md:px-12 lg:px-24 py-16 border-b border-border">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Local-sourcing report</p>
              <h2 className="text-3xl md:text-4xl font-serif leading-tight">Where this week's ingredients come from.</h2>
            </div>
            <Link href="/school-program/print">
              <Button variant="outline" className="rounded-none font-sans uppercase tracking-wider text-xs">
                <FileText size={14} className="mr-2" /> Print sourcing report
              </Button>
            </Link>
          </div>
          <SourcingTable sp={sp} coop={coopCrate ?? []} />
        </div>
      </section>

      {/* Negotiation levers */}
      <section className="px-6 md:px-12 lg:px-24 py-16 bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Pricing & flexibility</p>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight">Negotiation levers on the table.</h2>
            <p className="font-sans text-foreground/70 mt-2 max-w-2xl">
              Cards an OSNP coordinator can pull on while we shape the contract. These are the variables we'll bend on.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sp.levers.map((lever) => (
              <div key={lever.id} className="bg-background border border-border p-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{lever.title}</p>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">{lever.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="px-6 md:px-12 lg:px-24 py-16 bg-foreground text-background">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Coordinator contact</p>
          <h2 className="text-3xl md:text-4xl font-serif leading-tight">Start the conversation.</h2>
          <p className="font-sans text-background/80 leading-relaxed">
            For OSNP lead agency staff, school board nutrition coordinators, and principals. Drop your details — Jamie will follow up within a business day with the printable pack and a date to talk.
          </p>
          <SchoolLeadForm />
          <p className="font-sans text-xs text-background/50">
            Parents looking to order family meals — please use the regular online ordering page. This form routes only to the school program inbox.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-10 px-6 font-sans text-sm text-foreground/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© Konstantino Pizza & Wings · Dryden, ON</p>
          <Link href="/" className="hover:text-primary transition-colors">Back to the shop</Link>
        </div>
      </footer>
    </div>
  );
}

function Fact({ label, body }: { label: string; body: string }) {
  return (
    <div className="bg-background border border-border p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{label}</p>
      <p className="font-sans text-sm text-foreground/80 leading-relaxed">{body}</p>
    </div>
  );
}

function SourcingTable({ sp, coop }: { sp: SchoolProgramSettings; coop: CoopCrateItem[] }) {
  const counts = ingredientCounts(sp);
  const rows = Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    is807: isSource807(sp, coop, name),
  }));
  rows.sort((a, b) => Number(b.is807) - Number(a.is807) || b.count - a.count || a.name.localeCompare(b.name));
  const total = rows.length;
  const local = rows.filter((r) => r.is807).length;
  return (
    <div className="border border-border bg-background">
      <div className="px-5 py-3 border-b border-border bg-muted/50">
        <p className="font-sans text-sm text-foreground/80">
          {local} of {total} distinct ingredients ({total === 0 ? 0 : Math.round((local / total) * 100)}%) sourced through the 807 Food Co-op.
        </p>
      </div>
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left">
            <th className="px-5 py-2 font-bold uppercase tracking-wider text-xs text-foreground/60">Ingredient</th>
            <th className="px-5 py-2 font-bold uppercase tracking-wider text-xs text-foreground/60">Used in</th>
            <th className="px-5 py-2 font-bold uppercase tracking-wider text-xs text-foreground/60">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={3} className="px-5 py-6 text-center text-foreground/50 italic">No ingredients listed in this week's menu yet.</td></tr>
          )}
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border last:border-0">
              <td className="px-5 py-3">{r.name}</td>
              <td className="px-5 py-3 text-foreground/70">{r.count} day{r.count === 1 ? "" : "s"}</td>
              <td className="px-5 py-3">
                {r.is807 ? (
                  <span className="inline-flex items-center gap-1.5 text-green-800"><Leaf size={12} /> 807 Food Co-op</span>
                ) : (
                  <span className="text-foreground/60">Other supplier</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SchoolLeadForm() {
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [note, setNote] = React.useState("");
  const [hp, setHp] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const create = useCreatePhoneAddonRequest({
    mutation: {
      onSuccess: () => {
        setDone(true);
        setName(""); setContact(""); setNote(""); setHp("");
      },
      onError: () => setErr("Couldn't send that — try again or call the shop."),
    },
  });

  if (done) {
    return (
      <div className="space-y-2 border border-accent/40 bg-accent/10 p-5">
        <div className="flex items-center gap-2 text-accent">
          <Check size={18} />
          <p className="font-serif text-lg leading-tight">We got it.</p>
        </div>
        <p className="font-sans text-sm text-background/85">
          Jamie will reach out within a business day with the printable pack, weekly menu sample, and a time to talk.
        </p>
        <button type="button" onClick={() => setDone(false)} className="text-xs font-sans underline text-background/60 hover:text-background">
          Send another
        </button>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmed = contact.trim();
    if (!trimmed) {
      setErr("Add a phone or email so we can get back to you.");
      return;
    }
    create.mutate({ data: { kind: "school_lunch_program", name: name.trim(), contact: trimmed, note: note.trim(), website: hp } as never });
  };

  const inputCls = "bg-background/10 border border-background/20 px-3 py-2 text-sm font-sans text-background placeholder:text-background/40 focus:outline-none focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input type="text" placeholder="Your name & role (e.g. Coordinator, OSNP)" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        <input type="text" required placeholder="Phone or email" value={contact} onChange={(e) => setContact(e.target.value)} className={inputCls} />
      </div>
      <textarea rows={4} placeholder="School / board, # of meals per day, target start month, anything else" value={note} onChange={(e) => setNote(e.target.value)} className={`w-full resize-none ${inputCls}`} />
      {err && <p className="text-xs font-sans text-accent">{err}</p>}
      <button type="submit" disabled={create.isPending} className="w-full bg-accent text-foreground font-sans text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        {create.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
        {create.isPending ? "Sending…" : "Reach out to Jamie"}
      </button>
    </form>
  );
}

// --- engine helpers (shared with print page) ---
type MatchInfo = { daysSatisfied: number; missingDays: string[] };

export function ruleMatches(sp: SchoolProgramSettings, coop: CoopCrateItem[]): Record<string, MatchInfo> {
  const out: Record<string, MatchInfo> = {};
  for (const rule of sp.rules) {
    let satisfied = 0;
    const missing: string[] = [];
    for (const day of sp.menu) {
      const hay = (day.dish + " " + day.ingredients.join(" ")).toLowerCase();
      const ok = rule.keywords.some((kw) => hay.includes(kw.toLowerCase()));
      if (ok) satisfied++;
      else missing.push(day.label);
    }
    out[rule.id] = { daysSatisfied: satisfied, missingDays: missing };
  }
  return out;
}

export function isSource807(sp: SchoolProgramSettings, coop: CoopCrateItem[], ingredient: string): boolean {
  const key = ingredient.trim().toLowerCase();
  if (!key) return false;
  const fromExtra = sp.extraIngredients.find((e) => e.name.trim().toLowerCase() === key);
  if (fromExtra) return fromExtra.source807;
  const inCoop = coop.some((c) => {
    const n = c.name.trim().toLowerCase();
    return n === key || key.includes(n) || n.includes(key);
  });
  return inCoop;
}

export function ingredientCounts(sp: SchoolProgramSettings): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const day of sp.menu) {
    for (const ing of day.ingredients) {
      const k = ing.trim();
      if (!k) continue;
      counts[k] = (counts[k] ?? 0) + 1;
    }
  }
  return counts;
}

export function sourcingPercent(sp: SchoolProgramSettings, coop: CoopCrateItem[] = []): number {
  const counts = ingredientCounts(sp);
  const names = Object.keys(counts);
  if (names.length === 0) return 0;
  const local = names.filter((n) => isSource807(sp, coop, n)).length;
  return Math.round((local / names.length) * 100);
}

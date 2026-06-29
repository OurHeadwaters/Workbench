import React from "react";
import { Link } from "wouter";
import { Loader2, Printer, ArrowLeft } from "lucide-react";
import { useGetSettings, useListCoopCrate } from "@workspace/k-pizza-client-react";
import { ruleMatches, ingredientCounts, isSource807, sourcingPercent } from "./school-program";

export default function SchoolProgramPrint() {
  const { data: settings } = useGetSettings();
  const { data: coop } = useListCoopCrate({ active: true });
  const sp = settings?.schoolProgram;

  React.useEffect(() => {
    document.title = "Konstantino School Lunch Program — Weekly Pack";
  }, []);

  if (!settings || !sp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const matches = ruleMatches(sp, coop ?? []);
  const counts = ingredientCounts(sp);
  const sourcing = sourcingPercent(sp, coop ?? []);

  const rows = Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    is807: isSource807(sp, coop ?? [], name),
  }));
  rows.sort((a, b) => Number(b.is807) - Number(a.is807) || b.count - a.count || a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Screen-only toolbar */}
      <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-black/10 bg-gray-50">
        <Link href="/school-program" className="text-sm flex items-center gap-2 hover:text-black/60">
          <ArrowLeft size={16} /> Back to pitch
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <Printer size={14} /> Print or Save PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-8 md:p-12 space-y-10 font-sans">
        {/* Header */}
        <header className="pb-4 border-b-2 border-black space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/60">Konstantino Pizza & Wings · Dryden, ON</p>
          <h1 className="text-3xl font-serif leading-tight">Ontario School Lunch Program — Weekly Pack</h1>
          <p className="text-xs text-black/60">Prepared {dateStr}</p>
        </header>

        {/* Operating facts */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif border-b border-black/30 pb-1">Operating facts</h2>
          <PrintRow label="Capacity & lead time" body={sp.capacity} />
          <PrintRow label="Packaging" body={sp.packaging} />
          <PrintRow label="Allergens" body={sp.allergens} />
          <PrintRow label="Delivery window" body={sp.deliveryWindow} />
          <PrintRow label="Food safety" body={sp.foodSafety} />
          <PrintRow label="Local-sourcing target" body={`${sp.sourcingTargetPct}% via 807 Food Co-op. ${sp.sourcingNote}`} />
        </section>

        {/* Weekly menu */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif border-b border-black/30 pb-1">This week's menu</h2>
          <table className="w-full text-sm border border-black">
            <thead>
              <tr className="bg-black/5 border-b border-black">
                <th className="p-2 text-left text-xs uppercase tracking-wider">Day</th>
                <th className="p-2 text-left text-xs uppercase tracking-wider">Dish</th>
                <th className="p-2 text-left text-xs uppercase tracking-wider">Price</th>
                <th className="p-2 text-left text-xs uppercase tracking-wider">Ingredients</th>
              </tr>
            </thead>
            <tbody>
              {sp.menu.map((day, i) => (
                <tr key={i} className="border-b border-black/30 last:border-0 align-top">
                  <td className="p-2 font-bold">{day.label}</td>
                  <td className="p-2">{day.dish || <em className="text-black/40">—</em>}</td>
                  <td className="p-2">{day.price}</td>
                  <td className="p-2">
                    {day.ingredients.map((ing, j) => (
                      <span key={j} className="block text-xs">
                        {isSource807(sp, coop ?? [], ing) ? "★ " : "· "}{ing}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-black/60">★ = sourced through the 807 Food Co-op</p>
        </section>

        {/* Rule check */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif border-b border-black/30 pb-1">OSNP rule check</h2>
          <table className="w-full text-sm border border-black">
            <thead>
              <tr className="bg-black/5 border-b border-black">
                <th className="p-2 text-left text-xs uppercase tracking-wider">Rule</th>
                <th className="p-2 text-left text-xs uppercase tracking-wider">Status</th>
                <th className="p-2 text-left text-xs uppercase tracking-wider">Gaps</th>
              </tr>
            </thead>
            <tbody>
              {sp.rules.map((rule) => {
                const m = matches[rule.id];
                const ok = m && m.daysSatisfied === sp.menu.length;
                return (
                  <tr key={rule.id} className="border-b border-black/30 last:border-0 align-top">
                    <td className="p-2">
                      <p className="font-bold">{rule.label}</p>
                      <p className="text-xs text-black/60">{rule.description}</p>
                    </td>
                    <td className="p-2 font-bold">
                      {ok ? "✔ Met all days" : m ? `${m.daysSatisfied} / ${sp.menu.length}` : "Not met"}
                    </td>
                    <td className="p-2 text-xs">{m && m.missingDays.length > 0 ? m.missingDays.join(", ") : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Sourcing report */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif border-b border-black/30 pb-1">Local-sourcing report</h2>
          <p className="text-sm">
            <strong>{sourcing}%</strong> of distinct ingredients in this week's menu sourced through the 807 Food Co-op (target: {sp.sourcingTargetPct}%).
          </p>
          <table className="w-full text-sm border border-black">
            <thead>
              <tr className="bg-black/5 border-b border-black">
                <th className="p-2 text-left text-xs uppercase tracking-wider">Ingredient</th>
                <th className="p-2 text-left text-xs uppercase tracking-wider">Used in</th>
                <th className="p-2 text-left text-xs uppercase tracking-wider">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={3} className="p-2 italic text-black/50">No ingredients listed.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-black/30 last:border-0">
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.count} day{r.count === 1 ? "" : "s"}</td>
                  <td className="p-2">{r.is807 ? "807 Food Co-op" : "Other supplier"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Negotiation levers */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif border-b border-black/30 pb-1">Negotiation levers</h2>
          <ol className="space-y-2 list-decimal list-inside">
            {sp.levers.map((lever) => (
              <li key={lever.id} className="text-sm">
                <span className="font-bold">{lever.title}.</span> <span className="text-black/80">{lever.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="pt-4 border-t border-black/30 text-xs text-black/60 space-y-1">
          <p>Contact: Jamie · {settings.phone || "(807) 215-0101"} · {settings.notificationEmail || "shop email"}</p>
          <p>5 Earl Ave, Dryden, ON · konstantinopizza.example</p>
        </footer>
      </div>
    </div>
  );
}

function PrintRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="grid grid-cols-12 gap-3 text-sm">
      <div className="col-span-4 font-bold uppercase tracking-wider text-xs text-black/60 pt-0.5">{label}</div>
      <div className="col-span-8">{body}</div>
    </div>
  );
}

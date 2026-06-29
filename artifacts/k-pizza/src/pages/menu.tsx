import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useListMenu, useGetSettings, useGetSpecials } from "@workspace/k-pizza-client-react";

export default function MenuPage() {
  const { data, isLoading } = useListMenu();
  const { data: settings } = useGetSettings();
  const { data: specials } = useGetSpecials();

  if (isLoading || !data) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const today = new Date().getDay();
  const todaysDaily = specials?.daily.find(d => d.dayOfWeek === today && d.active);
  const seasonal = (specials?.seasonal ?? []).filter(s => s.season === settings?.currentSeason);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="bg-background border-b border-border p-4 sticky top-0 z-10 flex items-center gap-4">
        <Link href="/"><Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft size={20} /></Button></Link>
        <div>
          <h1 className="font-serif text-2xl font-bold">Menu</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{settings?.shopName}</p>
        </div>
        <div className="ml-auto">
          <Link href="/order"><Button>Order Now</Button></Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-12">
        {(todaysDaily || seasonal.length > 0) && (
          <section className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-6">
            {todaysDaily && (
              <div>
                <p className="text-primary font-sans uppercase tracking-[0.2em] font-bold text-xs mb-2">Today's Special</p>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-2xl font-serif">{todaysDaily.name}</h3>
                  <span className="font-serif text-xl">{todaysDaily.price}</span>
                </div>
                <p className="text-foreground/70 mt-1">{todaysDaily.description}</p>
              </div>
            )}
            {seasonal.length > 0 && (
              <div>
                <p className="text-primary font-sans uppercase tracking-[0.2em] font-bold text-xs mb-2 capitalize">{settings?.currentSeason} Features</p>
                <div className="space-y-3">
                  {seasonal.map(s => (
                    <div key={s.id}>
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold">{s.name}</h4>
                        <span className="font-serif">{s.price}</span>
                      </div>
                      <p className="text-sm text-foreground/70">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {data.categories.map(cat => {
          const items = data.items.filter(i => i.categoryId === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border pb-3">{cat.name}</h2>
              <div className="space-y-5">
                {items.map(item => (
                  <div key={item.id} className={`flex gap-4 ${!item.available ? "opacity-40" : ""}`}>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline gap-3">
                        <h4 className="font-bold text-lg">{item.name} {!item.available && <span className="text-xs uppercase tracking-widest text-muted-foreground">(86'd)</span>}</h4>
                        <div className="flex-1 border-b-2 border-dotted border-border/50 mx-2 opacity-50 relative top-[-4px]" />
                        <span className="font-serif">{item.price}</span>
                      </div>
                      <p className="text-foreground/70 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

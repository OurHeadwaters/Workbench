import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, Minus, Plus, Trash2, WifiOff } from "lucide-react";

interface Product {
  id: string;
  name: string;
  size: string;
  shelf: number;
  customer: number;
  category: "essentials" | "fresh" | "household" | "tobacco";
  subsidized: boolean;
}

const PRODUCTS: Product[] = [
  { id: "robin-hood-flour", name: "Robin Hood flour", size: "10 kg", shelf: 38.99, customer: 22.49, category: "essentials", subsidized: true },
  { id: "carnation-milk", name: "Carnation milk", size: "354 ml", shelf: 4.49, customer: 2.79, category: "essentials", subsidized: true },
  { id: "klik", name: "Klik canned meat", size: "340 g", shelf: 6.99, customer: 4.99, category: "essentials", subsidized: true },
  { id: "kraft-dinner", name: "Kraft Dinner", size: "225 g", shelf: 3.79, customer: 2.29, category: "essentials", subsidized: true },
  { id: "frozen-ground-beef", name: "Ground beef", size: "1 lb · frozen", shelf: 14.49, customer: 8.99, category: "fresh", subsidized: true },
  { id: "eggs", name: "Eggs · large", size: "1 dozen", shelf: 9.49, customer: 5.49, category: "fresh", subsidized: true },
  { id: "bread", name: "Bimbo white bread", size: "675 g", shelf: 7.49, customer: 4.49, category: "essentials", subsidized: true },
  { id: "tang", name: "Tang orange", size: "1.4 kg", shelf: 14.99, customer: 14.99, category: "household", subsidized: false },
  { id: "tide", name: "Tide laundry pods", size: "42 ct", shelf: 28.49, customer: 28.49, category: "household", subsidized: false },
  { id: "smokes", name: "Cigarettes · pack", size: "20", shelf: 19.49, customer: 19.49, category: "tobacco", subsidized: false },
];

interface BasketLine { productId: string; qty: number; }

const TAX_RATE = 0.13;
function fmt(n: number): string { return `$${n.toFixed(2)}`; }

function Row({ label, value, tone }: { label: string; value: string; tone?: "warm" }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[12px] uppercase tracking-[0.18em]" style={{ color: tone === "warm" ? "#b85a3e" : "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{label}</span>
      <span className="text-[14px]" style={{ color: tone === "warm" ? "#b85a3e" : "#18201b", fontVariantNumeric: "tabular-nums", fontFamily: "'IBM Plex Sans', sans-serif" }}>{value}</span>
    </div>
  );
}

export default function Till({ onBack }: { onBack: () => void }) {
  const [basket, setBasket] = useState<BasketLine[]>([
    { productId: "robin-hood-flour", qty: 1 },
    { productId: "carnation-milk", qty: 4 },
    { productId: "kraft-dinner", qty: 3 },
  ]);
  const [voidTip, setVoidTip] = useState(false);

  function add(productId: string) {
    setBasket((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) return prev.map((l) => l.productId === productId ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { productId, qty: 1 }];
    });
  }

  function bump(productId: string, delta: number) {
    setBasket((prev) => prev.map((l) => l.productId === productId ? { ...l, qty: l.qty + delta } : l).filter((l) => l.qty > 0));
  }

  function remove(productId: string) {
    setBasket((prev) => prev.filter((l) => l.productId !== productId));
  }

  const lines = basket.map((l) => {
    const p = PRODUCTS.find((x) => x.id === l.productId)!;
    return { ...l, product: p, lineTotal: p.customer * l.qty };
  });
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const subsidySaved = lines.reduce((s, l) => s + (l.product.subsidized ? (l.product.shelf - l.product.customer) * l.qty : 0), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <section className="px-5 sm:px-7 py-6 max-w-[1280px] mx-auto">
      <header className="mb-5 flex items-baseline justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] mb-1" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Screen 3 · the till</div>
          <h1 className="text-[34px] leading-[1.05] tracking-tight font-medium" style={{ color: "#1f3d2e", fontFamily: "'Fraunces', Georgia, serif" }}>Try it. The buttons work.</h1>
        </div>
        <button type="button" onClick={onBack} data-testid="till-back-home"
          className="text-[11px] uppercase tracking-[0.22em] px-3 py-2 rounded-md border inline-flex items-center gap-2"
          style={{ color: "#1f3d2e", borderColor: "rgba(31,61,46,0.20)", background: "rgba(31,61,46,0.04)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
        >
          <ArrowLeft size={12} /> Back to home
        </button>
      </header>

      <div className="rounded-[18px] overflow-hidden" style={{ background: "#1f3d2e", padding: "10px", boxShadow: "0 30px 80px -30px rgba(31,61,46,0.35)" }}>
        <div className="grid gap-[10px]" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)" }}>
          <div className="rounded-[12px] p-4" style={{ background: "#f4ede0" }}>
            <div className="flex items-center justify-between mb-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
              <span>Today · Tuesday morning</span>
              <span className="flex items-center gap-1.5"><WifiOff size={12} /> Offline · sales saved on this iPad</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
              {PRODUCTS.map((p) => (
                <button key={p.id} type="button" onClick={() => add(p.id)} data-testid={`till-product-${p.id}`}
                  className="rounded-[10px] p-3 text-left transition-transform hover:-translate-y-[1px] focus:outline-none focus-visible:ring-4"
                  style={{ background: "#ebe2d0", color: "#18201b", border: "1px solid rgba(31,61,46,0.16)", minHeight: "120px", outlineColor: "rgba(184,90,62,0.30)" }}
                >
                  <div className="text-[14px] font-semibold leading-tight" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>{p.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.20em] mt-[2px]" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{p.size}</div>
                  <div className="mt-3">
                    {p.subsidized && <div className="text-[12px] line-through" style={{ color: "#9c8a64" }}>{fmt(p.shelf)}</div>}
                    <div className="text-[22px] font-semibold leading-none" style={{ color: p.subsidized ? "#1f3d2e" : "#18201b", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontVariantNumeric: "tabular-nums" }}>{fmt(p.customer)}</div>
                    {p.subsidized && (
                      <div className="mt-1 inline-flex items-center text-[10px] uppercase tracking-[0.18em] px-1.5 py-[2px] rounded" style={{ background: "rgba(184,90,62,0.14)", color: "#b85a3e", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                        Federal grocery help
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] p-4 flex flex-col" style={{ background: "#ebe2d0", color: "#18201b" }}>
            <div className="flex items-center justify-between mb-2 text-[11px] uppercase tracking-[0.22em]" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
              <span>Basket · {lines.length} items</span>
              <span>Operator on till</span>
            </div>
            <div className="flex-1 min-h-0 overflow-auto pr-1 space-y-2 mb-3" data-testid="till-basket">
              {lines.length === 0 && <div className="text-[13px] py-8 text-center" style={{ color: "#6b7665" }}>Tap a product to start</div>}
              {lines.map((l) => (
                <div key={l.productId} className="rounded-[8px] p-3" style={{ background: "#f4ede0", border: "1px solid rgba(31,61,46,0.10)" }}>
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <div className="text-[14px] font-semibold leading-tight" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>{l.product.name}</div>
                    <div className="text-[14px] font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(l.lineTotal)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => bump(l.productId, -1)} data-testid={`till-decr-${l.productId}`} className="h-8 w-8 rounded-md grid place-items-center" style={{ background: "rgba(31,61,46,0.06)", color: "#1f3d2e" }}><Minus size={14} /></button>
                      <span className="text-[14px] font-semibold w-6 text-center" style={{ fontVariantNumeric: "tabular-nums" }}>{l.qty}</span>
                      <button type="button" onClick={() => bump(l.productId, 1)} data-testid={`till-incr-${l.productId}`} className="h-8 w-8 rounded-md grid place-items-center" style={{ background: "rgba(31,61,46,0.06)", color: "#1f3d2e" }}><Plus size={14} /></button>
                    </div>
                    <button type="button" onClick={() => remove(l.productId)} data-testid={`till-remove-${l.productId}`} className="h-8 w-8 rounded-md grid place-items-center" style={{ background: "rgba(184,90,62,0.10)", color: "#b85a3e" }}><Trash2 size={14} /></button>
                  </div>
                  {l.product.subsidized && (
                    <div className="mt-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: "#b85a3e", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                      shelf {fmt(l.product.shelf)} · you save {fmt(l.product.shelf - l.product.customer)}/ea
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1.5 text-[13px]" style={{ borderColor: "rgba(31,61,46,0.16)" }}>
              <Row label="Subtotal" value={fmt(subtotal)} />
              {subsidySaved > 0 && <Row label="Federal grocery help" value={`− ${fmt(subsidySaved)}`} tone="warm" />}
              <Row label={`Tax · ${(TAX_RATE * 100).toFixed(0)}%`} value={fmt(tax)} />
              <div className="flex items-baseline justify-between pt-2 mt-1" style={{ borderTop: "1px solid rgba(31,61,46,0.20)" }}>
                <span className="text-[16px] font-semibold" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Total</span>
                <span className="text-[24px] font-semibold" style={{ color: "#1f3d2e", fontVariantNumeric: "tabular-nums", fontFamily: "'IBM Plex Sans', sans-serif" }}>{fmt(total)}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" data-testid="till-pay" className="rounded-[10px] py-3 text-[15px] font-semibold flex items-center justify-center gap-2" style={{ background: "#b85a3e", color: "#f4ede0", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                <CreditCard size={18} /> Pay
              </button>
              <button type="button" data-testid="till-void"
                onMouseEnter={() => setVoidTip(true)} onMouseLeave={() => setVoidTip(false)}
                onFocus={() => setVoidTip(true)} onBlur={() => setVoidTip(false)}
                onClick={() => setVoidTip(true)} aria-disabled="true"
                className="relative rounded-[10px] py-3 text-[15px] font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                style={{ background: "rgba(31,61,46,0.10)", color: "#6b7665", fontFamily: "'IBM Plex Sans', sans-serif", border: "1px dashed rgba(31,61,46,0.25)" }}
              >
                <Lock size={16} /> Void
                {voidTip && (
                  <span role="tooltip" data-testid="till-void-tooltip" className="absolute bottom-[calc(100%+8px)] right-0 text-[11px] px-2.5 py-1.5 rounded-md whitespace-nowrap"
                    style={{ background: "#1f3d2e", color: "#f4ede0", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.04em" }}
                  >
                    Manager sign-in required over $20
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[12px] uppercase tracking-[0.22em]" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
        Built on Square POS · subsidy + offline cache · practice layer on top
      </p>
    </section>
  );
}

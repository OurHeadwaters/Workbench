import { useState, useCallback } from "react";
import {
  ShoppingCart,
  Wifi,
  WifiOff,
  Trash2,
  ChevronRight,
  Tag,
  Minus,
  Plus,
  X,
  CreditCard,
  Banknote,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

type Category = "all" | "staples" | "protein" | "produce" | "dairy" | "frozen";

interface Product {
  id: string;
  name: string;
  category: Exclude<Category, "all">;
  retailPrice: number;
  nnSubsidy: number;
  unit: string;
  color: string;
  emoji: string;
  nnEligible: boolean;
}

interface BasketItem {
  product: Product;
  qty: number;
}

type Screen = "pos" | "checkout" | "receipt";
type PayMethod = "card" | "cash";

const PRODUCTS: Product[] = [
  { id: "flour",       name: "Robin Hood Flour",  category: "staples",  retailPrice: 14.99, nnSubsidy: 7.50, unit: "10 kg",   color: "#d4a844", emoji: "🌾", nnEligible: true  },
  { id: "rice",        name: "Jasmine Rice",      category: "staples",  retailPrice: 12.49, nnSubsidy: 6.25, unit: "5 kg",    color: "#c8b89a", emoji: "🍚", nnEligible: true  },
  { id: "oats",        name: "Rolled Oats",       category: "staples",  retailPrice:  8.99, nnSubsidy: 4.50, unit: "2 kg",    color: "#b8956a", emoji: "🥣", nnEligible: true  },
  { id: "sugar",       name: "White Sugar",       category: "staples",  retailPrice:  7.49, nnSubsidy: 3.75, unit: "2 kg",    color: "#e8e0d0", emoji: "🍬", nnEligible: true  },
  { id: "chicken",     name: "Whole Chicken",     category: "protein",  retailPrice: 18.99, nnSubsidy: 9.50, unit: "~1.5 kg", color: "#d4845a", emoji: "🍗", nnEligible: true  },
  { id: "beef",        name: "Ground Beef",       category: "protein",  retailPrice: 16.49, nnSubsidy: 8.25, unit: "1 kg",    color: "#c0504a", emoji: "🥩", nnEligible: true  },
  { id: "eggs",        name: "Eggs",              category: "protein",  retailPrice:  9.99, nnSubsidy: 5.00, unit: "12 ct",   color: "#e8d4a0", emoji: "🥚", nnEligible: true  },
  { id: "pb",          name: "Peanut Butter",     category: "protein",  retailPrice: 11.49, nnSubsidy: 0,    unit: "1 kg",    color: "#c8945a", emoji: "🥜", nnEligible: false },
  { id: "cabbage",     name: "Green Cabbage",     category: "produce",  retailPrice:  6.99, nnSubsidy: 3.50, unit: "each",    color: "#5a8c5a", emoji: "🥬", nnEligible: true  },
  { id: "carrots",     name: "Carrots",           category: "produce",  retailPrice:  5.49, nnSubsidy: 2.75, unit: "2 lb",    color: "#d4773a", emoji: "🥕", nnEligible: true  },
  { id: "onions",      name: "Yellow Onions",     category: "produce",  retailPrice:  4.99, nnSubsidy: 0,    unit: "3 lb",    color: "#d4c070", emoji: "🧅", nnEligible: false },
  { id: "apples",      name: "Gala Apples",       category: "produce",  retailPrice:  7.99, nnSubsidy: 4.00, unit: "3 lb",    color: "#c04040", emoji: "🍎", nnEligible: true  },
  { id: "milk",        name: "Homo Milk",         category: "dairy",    retailPrice: 10.99, nnSubsidy: 5.50, unit: "4 L",     color: "#e8f0f0", emoji: "🥛", nnEligible: true  },
  { id: "cheese",      name: "Cheddar Block",     category: "dairy",    retailPrice: 13.99, nnSubsidy: 7.00, unit: "600 g",   color: "#e8c050", emoji: "🧀", nnEligible: true  },
  { id: "butter",      name: "Salted Butter",     category: "dairy",    retailPrice:  8.49, nnSubsidy: 4.25, unit: "454 g",   color: "#f0d870", emoji: "🧈", nnEligible: true  },
  { id: "peas",        name: "Green Peas",        category: "frozen",   retailPrice:  6.49, nnSubsidy: 3.25, unit: "750 g",   color: "#608060", emoji: "🫛", nnEligible: true  },
  { id: "fries",       name: "McCain Fries",      category: "frozen",   retailPrice:  9.49, nnSubsidy: 0,    unit: "1.5 kg",  color: "#d4b060", emoji: "🍟", nnEligible: false },
  { id: "fish",        name: "Fish Fillets",      category: "frozen",   retailPrice: 15.99, nnSubsidy: 8.00, unit: "500 g",   color: "#7090b8", emoji: "🐟", nnEligible: true  },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all",     label: "All Items" },
  { id: "staples", label: "Staples"   },
  { id: "protein", label: "Protein"   },
  { id: "produce", label: "Produce"   },
  { id: "dairy",   label: "Dairy"     },
  { id: "frozen",  label: "Frozen"    },
];

const C = {
  green:       "#1f3d2e",
  greenLight:  "#2a5240",
  paper:       "#f4ede0",
  paperDim:    "#e8dfd0",
  paperBorder: "#e0d8cc",
  sidePanel:   "#ede5d8",
  sideBorder:  "#d0c8b8",
  brick:       "#b85a3e",
  text:        "#2a2520",
  muted:       "#7a7a6e",
  faint:       "#b0a898",
  nnBlue:      "#1a5276",
  nnBlueLt:    "#aed6f1",
  offlineRed:  "#7b241c",
  successGn:   "#27ae60",
  errorRed:    "#e74c3c",
} as const;

function fmt(n: number) { return `$${n.toFixed(2)}`; }

function NNBadge() {
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold tracking-wide"
      style={{ background: C.nnBlue, color: C.nnBlueLt }}
    >
      NN
    </span>
  );
}

function OfflineBanner({ offline }: { offline: boolean }) {
  if (!offline) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium shrink-0"
      style={{ background: C.offlineRed, color: "#fadbd8" }}>
      <AlertCircle size={15} />
      Offline mode — transactions queued, will sync when connection restores
    </div>
  );
}

function Header({
  offline, onToggleOffline, onBack, title,
}: {
  offline: boolean;
  onToggleOffline: () => void;
  onBack: (() => void) | null;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: C.green }}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-1 rounded hover:opacity-70" style={{ color: C.paper }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <div className="font-bold text-base leading-tight" style={{ color: C.paper, fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>{title}</div>
          <div className="text-xs" style={{ color: "#a0b89a", fontFamily: '"IBM Plex Mono", ui-monospace, monospace' }}>
            Square for Retail · Day-1 POS · Nutrition North enabled
          </div>
        </div>
      </div>
      <button
        onClick={onToggleOffline}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
        style={{
          background: offline ? C.offlineRed : C.greenLight,
          color:      offline ? "#fadbd8"    : "#a0c8a0",
          border: `1px solid ${offline ? "#c0392b44" : "#3a7260"}`,
        }}
        title="Toggle offline mode (demo)"
      >
        {offline ? <WifiOff size={14} /> : <Wifi size={14} />}
        {offline ? "Offline" : "Online"}
      </button>
    </div>
  );
}

function CategoryBar({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <div className="flex gap-2 px-3 py-2 overflow-x-auto shrink-0" style={{ background: C.paperDim, borderBottom: `1px solid ${C.sideBorder}` }}>
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
          style={{
            background: active === c.id ? C.green  : "white",
            color:      active === c.id ? C.paper  : C.text,
            border: `1px solid ${active === c.id ? C.green : C.sideBorder}`,
          }}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

function ProductTile({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const customerPrice = product.nnEligible ? product.retailPrice - product.nnSubsidy : product.retailPrice;
  return (
    <button
      onClick={() => onAdd(product)}
      className="flex flex-col rounded-xl p-3 text-left transition-transform active:scale-95 hover:brightness-95 select-none"
      style={{ background: "white", border: `1px solid ${C.paperBorder}`, minHeight: 130 }}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-2 shrink-0"
        style={{ background: `${product.color}22` }}>
        {product.emoji}
      </div>
      <div className="font-semibold text-sm leading-tight mb-1" style={{ color: C.text }}>{product.name}</div>
      <div className="text-xs mb-2" style={{ color: C.muted }}>{product.unit}</div>
      <div className="mt-auto space-y-0.5">
        {product.nnEligible ? (
          <>
            <div className="flex items-center gap-1">
              <NNBadge />
              <span className="font-bold text-sm" style={{ color: C.green }}>{fmt(customerPrice)}</span>
            </div>
            <div className="text-xs line-through" style={{ color: C.faint }}>retail {fmt(product.retailPrice)}</div>
          </>
        ) : (
          <div className="font-bold text-sm" style={{ color: C.text }}>{fmt(product.retailPrice)}</div>
        )}
      </div>
    </button>
  );
}

function BasketRow({ item, onQty, onRemove }: {
  item: BasketItem;
  onQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  const unitPrice = item.product.nnEligible ? item.product.retailPrice - item.product.nnSubsidy : item.product.retailPrice;
  return (
    <div className="px-3 py-2 text-sm border-b" style={{ borderColor: C.sideBorder }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{item.product.name}</div>
          {item.product.nnEligible ? (
            <div className="flex items-center gap-1 mt-0.5">
              <Tag size={11} style={{ color: C.nnBlue }} />
              <span className="text-xs" style={{ color: C.nnBlue }}>{fmt(unitPrice)} ea</span>
              <span className="text-xs line-through" style={{ color: C.faint }}>{fmt(item.product.retailPrice)}</span>
            </div>
          ) : (
            <div className="text-xs" style={{ color: C.muted }}>{fmt(item.product.retailPrice)} ea</div>
          )}
        </div>
        <button onClick={() => onRemove(item.product.id)} className="hover:opacity-70 shrink-0" style={{ color: C.faint }}>
          <X size={14} />
        </button>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-2">
          <button onClick={() => onQty(item.product.id, -1)}
            className="w-6 h-6 rounded flex items-center justify-center hover:opacity-70"
            style={{ background: C.sideBorder }}>
            <Minus size={12} />
          </button>
          <span className="w-5 text-center font-semibold" style={{ color: C.text }}>{item.qty}</span>
          <button onClick={() => onQty(item.product.id, 1)}
            className="w-6 h-6 rounded flex items-center justify-center hover:opacity-70"
            style={{ background: C.sideBorder }}>
            <Plus size={12} />
          </button>
        </div>
        <span className="font-semibold text-sm" style={{ color: C.green }}>{fmt(unitPrice * item.qty)}</span>
      </div>
    </div>
  );
}

function BasketRowFull({ item }: { item: BasketItem }) {
  const unitPrice = item.product.nnEligible ? item.product.retailPrice - item.product.nnSubsidy : item.product.retailPrice;
  return (
    <div className="flex items-center justify-between p-3 rounded-xl"
      style={{ background: "white", border: `1px solid ${C.paperBorder}` }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{ background: `${item.product.color}22` }}>
          {item.product.emoji}
        </div>
        <div>
          <div className="font-medium text-sm" style={{ color: C.text }}>{item.product.name} × {item.qty}</div>
          {item.product.nnEligible ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <NNBadge />
              <span className="text-xs font-semibold" style={{ color: C.green }}>{fmt(unitPrice)} ea</span>
              <span className="text-xs line-through" style={{ color: C.faint }}>{fmt(item.product.retailPrice)}</span>
            </div>
          ) : (
            <div className="text-xs" style={{ color: C.muted }}>{fmt(item.product.retailPrice)} ea</div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-sm" style={{ color: C.green }}>{fmt(unitPrice * item.qty)}</div>
        {item.product.nnEligible && (
          <div className="text-xs line-through" style={{ color: C.faint }}>{fmt(item.product.retailPrice * item.qty)}</div>
        )}
      </div>
    </div>
  );
}

export default function SquarePOS() {
  const [category, setCategory] = useState<Category>("all");
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [offline, setOffline] = useState(false);
  const [screen, setScreen] = useState<Screen>("pos");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [cashTendered, setCashTendered] = useState("");
  const [paid, setPaid] = useState(false);

  const filtered = category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  const addToBasket = useCallback((product: Product) => {
    setBasket((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setBasket((prev) => prev.map((i) => i.product.id === id ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0));
  }, []);

  const removeItem  = useCallback((id: string) => setBasket((prev) => prev.filter((i) => i.product.id !== id)), []);
  const clearBasket = useCallback(() => setBasket([]), []);

  const subtotalRetail   = basket.reduce((s, i) => s + i.product.retailPrice * i.qty, 0);
  const totalSubsidy     = basket.reduce((s, i) => s + i.product.nnSubsidy   * i.qty, 0);
  const total            = subtotalRetail - totalSubsidy;
  const cashTenderedNum  = parseFloat(cashTendered) || 0;
  const change           = cashTenderedNum - total;

  const handleCharge = () => { if (basket.length > 0) setScreen("checkout"); };

  const handlePay = () => {
    if (payMethod === "cash" && cashTenderedNum < total) return;
    setPaid(true);
    setTimeout(() => setScreen("receipt"), 900);
  };

  const handleNewSale = () => {
    setBasket([]); setScreen("pos"); setPaid(false); setCashTendered(""); setPayMethod("card");
  };

  /* ── Receipt ─────────────────────────────────────────────── */
  if (screen === "receipt") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: C.paper, fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>
        <Header offline={offline} onToggleOffline={() => setOffline((v) => !v)} onBack={null} title="Payment Complete" />
        <OfflineBanner offline={offline} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          <div className="flex flex-col items-center gap-3">
            <CheckCircle size={64} style={{ color: C.successGn }} />
            <div className="text-2xl font-bold" style={{ color: C.green }}>Sale Complete</div>
            {offline && <div className="text-sm" style={{ color: C.muted }}>Transaction queued — will sync when online</div>}
          </div>
          <div className="w-full max-w-sm rounded-xl p-5 space-y-2 text-sm" style={{ background: "white", border: `1px solid ${C.paperBorder}` }}>
            <div className="font-semibold mb-3 text-base" style={{ color: C.text }}>Receipt Summary</div>
            {basket.map((i) => {
              const upr = i.product.nnEligible ? i.product.retailPrice - i.product.nnSubsidy : i.product.retailPrice;
              return (
                <div key={i.product.id} className="flex justify-between">
                  <span style={{ color: C.text }}>{i.product.name} × {i.qty}</span>
                  <span style={{ color: C.text }}>{fmt(upr * i.qty)}</span>
                </div>
              );
            })}
            <div className="border-t pt-2 mt-2" style={{ borderColor: C.paperBorder }}>
              <div className="flex justify-between" style={{ color: C.muted }}><span>Retail subtotal</span><span>{fmt(subtotalRetail)}</span></div>
              {totalSubsidy > 0 && (
                <div className="flex justify-between font-medium" style={{ color: C.nnBlue }}>
                  <span>Nutrition North subsidy</span><span>–{fmt(totalSubsidy)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base mt-1" style={{ color: C.green }}>
                <span>Customer paid</span><span>{fmt(total)}</span>
              </div>
              {payMethod === "cash" && change >= 0 && (
                <div className="flex justify-between" style={{ color: C.muted }}><span>Change</span><span>{fmt(change)}</span></div>
              )}
            </div>
          </div>
          <button
            onClick={handleNewSale}
            className="flex items-center gap-2 rounded-xl px-8 py-4 font-semibold text-lg hover:opacity-90 transition-opacity"
            style={{ background: C.green, color: C.paper }}
          >
            <RotateCcw size={20} /> New Sale
          </button>
        </div>
      </div>
    );
  }

  /* ── Checkout ────────────────────────────────────────────── */
  if (screen === "checkout") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: C.paper, fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>
        <Header offline={offline} onToggleOffline={() => setOffline((v) => !v)} onBack={() => setScreen("pos")} title="Checkout" />
        <OfflineBanner offline={offline} />
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Order summary */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-sm font-semibold mb-3" style={{ color: C.muted }}>ORDER SUMMARY</div>
            {basket.map((item) => <BasketRowFull key={item.product.id} item={item} />)}
            <div className="mt-4 p-4 rounded-xl space-y-2" style={{ background: "white", border: `1px solid ${C.paperBorder}` }}>
              <div className="flex justify-between text-sm" style={{ color: C.muted }}><span>Retail subtotal</span><span>{fmt(subtotalRetail)}</span></div>
              {totalSubsidy > 0 && (
                <div className="flex justify-between text-sm font-semibold" style={{ color: C.nnBlue }}>
                  <span className="flex items-center gap-2"><NNBadge /> Nutrition North subsidy</span>
                  <span>–{fmt(totalSubsidy)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-1" style={{ color: C.green, borderColor: C.paperBorder }}>
                <span>Customer total</span><span>{fmt(total)}</span>
              </div>
              <p className="text-xs" style={{ color: C.muted }}>No HST/GST on eligible groceries</p>
            </div>
          </div>
          {/* Payment */}
          <div className="lg:w-80 p-4 space-y-4 border-t lg:border-t-0 lg:border-l" style={{ background: C.sidePanel, borderColor: C.sideBorder }}>
            <div className="text-sm font-semibold" style={{ color: C.muted }}>PAYMENT METHOD</div>
            <div className="grid grid-cols-2 gap-2">
              {(["card", "cash"] as PayMethod[]).map((m) => (
                <button key={m} onClick={() => setPayMethod(m)}
                  className="flex flex-col items-center gap-2 rounded-xl py-4 font-semibold transition-all"
                  style={{
                    background: payMethod === m ? C.green : "white",
                    color:      payMethod === m ? C.paper : C.text,
                    border: `2px solid ${payMethod === m ? C.green : C.sideBorder}`,
                  }}>
                  {m === "card" ? <CreditCard size={24} /> : <Banknote size={24} />}
                  {m === "card" ? "Card / Tap" : "Cash"}
                </button>
              ))}
            </div>
            {payMethod === "cash" && (
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: C.text }}>Cash Tendered</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold" style={{ color: C.muted }}>$</span>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 rounded-lg px-3 py-2 text-lg font-semibold outline-none"
                    style={{ background: "white", border: `2px solid ${C.sideBorder}`, color: C.text }}
                  />
                </div>
                {cashTenderedNum >= total && cashTendered !== "" && (
                  <div className="flex justify-between text-sm font-semibold" style={{ color: C.successGn }}>
                    <span>Change due</span><span>{fmt(change)}</span>
                  </div>
                )}
                {cashTenderedNum > 0 && cashTenderedNum < total && (
                  <div className="text-sm" style={{ color: C.errorRed }}>Short by {fmt(total - cashTenderedNum)}</div>
                )}
              </div>
            )}
            {offline && (
              <div className="flex items-start gap-2 rounded-lg p-3 text-sm" style={{ background: "#7b241c22", color: C.offlineRed }}>
                <WifiOff size={16} className="mt-0.5 shrink-0" />
                <span>Offline transaction — will sync automatically when connection restores.</span>
              </div>
            )}
            <button
              onClick={handlePay}
              disabled={paid || (payMethod === "cash" && cashTenderedNum < total && cashTendered !== "")}
              className="w-full rounded-xl py-4 font-bold text-xl transition-opacity disabled:opacity-40"
              style={{ background: paid ? C.successGn : C.brick, color: "white" }}
            >
              {paid ? "Processing…" : payMethod === "card" ? `Charge ${fmt(total)}` : cashTenderedNum >= total ? `Confirm ${fmt(total)}` : `Charge ${fmt(total)}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main POS ────────────────────────────────────────────── */
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>
      <Header offline={offline} onToggleOffline={() => setOffline((v) => !v)} onBack={null} title="Deer Lake Community Store" />
      <OfflineBanner offline={offline} />
      <div className="flex-1 flex overflow-hidden">
        {/* Product grid */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: C.paper }}>
          <CategoryBar active={category} onChange={setCategory} />
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((p) => <ProductTile key={p.id} product={p} onAdd={addToBasket} />)}
            </div>
          </div>
        </div>
        {/* Basket panel */}
        <div className="w-72 flex flex-col border-l" style={{ background: C.sidePanel, borderColor: C.sideBorder }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: C.sideBorder }}>
            <div className="flex items-center gap-2 font-semibold" style={{ color: C.green }}>
              <ShoppingCart size={18} />
              <span>Basket</span>
              {basket.length > 0 && (
                <span className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  style={{ background: C.brick, color: "white" }}>
                  {basket.reduce((s, i) => s + i.qty, 0)}
                </span>
              )}
            </div>
            {basket.length > 0 && (
              <button onClick={clearBasket} className="p-1 rounded hover:opacity-70" style={{ color: C.muted }}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {basket.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 gap-2" style={{ color: "#b0a898" }}>
                <ShoppingCart size={28} />
                <span className="text-sm">No items yet</span>
              </div>
            )}
            {basket.map((item) => (
              <BasketRow key={item.product.id} item={item} onQty={changeQty} onRemove={removeItem} />
            ))}
          </div>
          {basket.length > 0 && (
            <div className="p-4 border-t space-y-2" style={{ borderColor: C.sideBorder }}>
              <div className="flex justify-between text-sm" style={{ color: C.muted }}>
                <span>Retail subtotal</span><span>{fmt(subtotalRetail)}</span>
              </div>
              {totalSubsidy > 0 && (
                <div className="flex justify-between text-sm font-semibold" style={{ color: C.nnBlue }}>
                  <span className="flex items-center gap-1"><NNBadge /> Subsidy</span>
                  <span>–{fmt(totalSubsidy)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base" style={{ color: C.green }}>
                <span>Customer total</span><span>{fmt(total)}</span>
              </div>
              <button
                onClick={handleCharge}
                className="w-full mt-2 rounded-xl py-3 font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ background: C.green, color: C.paper }}
              >
                Charge {fmt(total)} <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

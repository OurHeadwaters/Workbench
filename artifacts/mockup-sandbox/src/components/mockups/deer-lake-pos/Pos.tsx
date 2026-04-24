import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Beef,
  Check,
  Cigarette,
  CloudOff,
  CreditCard,
  Coffee,
  Delete,
  Lock,
  Mail,
  Milk,
  Minus,
  Plus,
  Printer,
  Receipt,
  ShieldAlert,
  ShoppingBasket,
  ShoppingCart,
  SkipForward,
  SprayCan,
  Trash2,
  Users,
  Wifi,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import "./_group.css";

type CategoryId =
  | "grocery"
  | "dairy"
  | "frozen"
  | "household"
  | "hot"
  | "tobacco";

type Item = {
  id: string;
  name: string;
  price: number;
  category: CategoryId;
  unit?: string;
  freight?: boolean;
  initials: string;
  emoji: string;
  tone: string;
};

type CartLine = Item & { qty: number };

type Screen =
  | "lock"
  | "pos"
  | "payment"
  | "cash-tender"
  | "receipt"
  | "complete";

type PaymentMethod = "cash" | "debit" | "credit" | "community";

const CATEGORIES: { id: CategoryId; label: string; sub: string; Icon: LucideIcon; tone: string }[] = [
  { id: "grocery", label: "Grocery", sub: "Pantry & dry", Icon: ShoppingBasket, tone: "#7a5a3c" },
  { id: "dairy", label: "Dairy", sub: "Milk & eggs", Icon: Milk, tone: "#3c6f9c" },
  { id: "frozen", label: "Frozen", sub: "Meat & freezer", Icon: Beef, tone: "#7d3a30" },
  { id: "household", label: "Household", sub: "Soap & paper", Icon: SprayCan, tone: "#3f7a8a" },
  { id: "hot", label: "Hot Food", sub: "Counter & coffee", Icon: Coffee, tone: "#3a2a1f" },
  { id: "tobacco", label: "Tobacco", sub: "Cigarettes & papers", Icon: Cigarette, tone: "#5a3a2a" },
];

const ITEMS: Item[] = [
  // Grocery
  { id: "g-flour", name: "Robin Hood Flour", unit: "10 kg", price: 34.99, category: "grocery", freight: true, initials: "RH", emoji: "🌾", tone: "#c2a76f" },
  { id: "g-sugar", name: "White Sugar", unit: "4 kg", price: 14.99, category: "grocery", freight: true, initials: "SG", emoji: "🍬", tone: "#e9d9b1" },
  { id: "g-tang", name: "Tang Orange", unit: "1 kg jar", price: 12.99, category: "grocery", initials: "TG", emoji: "🧃", tone: "#e08a3a" },
  { id: "g-kd", name: "Kraft Dinner", unit: "225 g box", price: 3.79, category: "grocery", initials: "KD", emoji: "🍝", tone: "#d4a23b" },
  { id: "g-klik", name: "Klik Canned Meat", unit: "340 g", price: 6.49, category: "grocery", initials: "KL", emoji: "🥫", tone: "#8a4a36" },
  { id: "g-beans", name: "Bush's Baked Beans", unit: "398 mL", price: 4.29, category: "grocery", initials: "BB", emoji: "🫘", tone: "#7a5a3c" },
  { id: "g-crackers", name: "Premium Plus Crackers", unit: "454 g", price: 7.99, category: "grocery", initials: "CR", emoji: "🍘", tone: "#c69c5d" },
  { id: "g-tea", name: "Tetley Tea", unit: "72 ct", price: 9.99, category: "grocery", initials: "TT", emoji: "🍵", tone: "#6e3e2a" },
  { id: "g-oats", name: "Quaker Oats", unit: "1 kg", price: 8.49, category: "grocery", initials: "QO", emoji: "🥣", tone: "#a87b4a" },
  { id: "g-pb", name: "Peanut Butter", unit: "1 kg", price: 11.49, category: "grocery", initials: "PB", emoji: "🥜", tone: "#8d6238" },
  { id: "g-spam", name: "Spam Classic", unit: "340 g", price: 7.99, category: "grocery", initials: "SP", emoji: "🥫", tone: "#3f5a8a" },
  { id: "g-pasta", name: "Spaghetti", unit: "900 g", price: 4.99, category: "grocery", initials: "PA", emoji: "🍝", tone: "#caa66b" },
  // Fresh produce — flown in weekly
  { id: "g-apples", name: "Apples (fresh)", unit: "3 lb bag", price: 13.99, category: "grocery", freight: true, initials: "AP", emoji: "🍎", tone: "#a8362a" },
  { id: "g-bananas", name: "Bananas (fresh)", unit: "per lb", price: 2.49, category: "grocery", freight: true, initials: "BN", emoji: "🍌", tone: "#d3b73a" },
  { id: "g-potatoes", name: "Potatoes (fresh)", unit: "5 lb bag", price: 9.49, category: "grocery", freight: true, initials: "PT", emoji: "🥔", tone: "#a07a3a" },
  { id: "g-onions", name: "Onions (fresh)", unit: "2 lb bag", price: 6.99, category: "grocery", freight: true, initials: "ON", emoji: "🧅", tone: "#c8a874" },

  // Dairy
  { id: "d-evap", name: "Carnation Evap. Milk", unit: "354 mL", price: 3.79, category: "dairy", initials: "CE", emoji: "🥛", tone: "#bfb9a4" },
  { id: "d-milk", name: "2% Milk", unit: "4 L bag", price: 11.99, category: "dairy", freight: true, initials: "ML", emoji: "🥛", tone: "#3c6f9c" },
  { id: "d-butter", name: "Butter", unit: "454 g", price: 9.49, category: "dairy", initials: "BU", emoji: "🧈", tone: "#e7c25d" },
  { id: "d-eggs", name: "Large Eggs", unit: "12 ct", price: 7.99, category: "dairy", initials: "EG", emoji: "🥚", tone: "#c79a4a" },
  { id: "d-cheese", name: "Cheddar Block", unit: "500 g", price: 13.99, category: "dairy", initials: "CH", emoji: "🧀", tone: "#cd7a26" },
  { id: "d-yogurt", name: "Plain Yogurt", unit: "750 g", price: 7.49, category: "dairy", initials: "YG", emoji: "🍶", tone: "#dcd2b6" },

  // Frozen
  { id: "f-beef", name: "Ground Beef", unit: "1 kg frozen", price: 18.99, category: "frozen", freight: true, initials: "GB", emoji: "🥩", tone: "#7d3a30" },
  { id: "f-chicken", name: "Chicken Breasts", unit: "1 kg frozen", price: 22.99, category: "frozen", freight: true, initials: "CK", emoji: "🍗", tone: "#c79a72" },
  { id: "f-pizza", name: "Frozen Pizza", unit: "12 in", price: 9.99, category: "frozen", initials: "PZ", emoji: "🍕", tone: "#a04a30" },
  { id: "f-veg", name: "Mixed Vegetables", unit: "750 g", price: 6.99, category: "frozen", initials: "VG", emoji: "🥦", tone: "#3f7a4a" },
  { id: "f-icecream", name: "Vanilla Ice Cream", unit: "1.5 L", price: 11.49, category: "frozen", initials: "IC", emoji: "🍦", tone: "#dcc6a4" },
  { id: "f-fish", name: "Fish Sticks", unit: "700 g", price: 9.99, category: "frozen", initials: "FS", emoji: "🐟", tone: "#7a8c6a" },

  // Household
  { id: "h-tp", name: "Toilet Paper", unit: "12 roll", price: 19.99, category: "household", freight: true, initials: "TP", emoji: "🧻", tone: "#e8e2d2" },
  { id: "h-tide", name: "Tide Detergent", unit: "2.95 L", price: 24.99, category: "household", freight: true, initials: "TD", emoji: "🧴", tone: "#d9803a" },
  { id: "h-bleach", name: "Bleach", unit: "3.6 L", price: 7.49, category: "household", initials: "BL", emoji: "🧴", tone: "#9bb1c8" },
  { id: "h-bags", name: "Garbage Bags", unit: "30 ct", price: 11.99, category: "household", initials: "GB", emoji: "🗑️", tone: "#3a3f3a" },
  { id: "h-paper", name: "Paper Towel", unit: "6 roll", price: 14.99, category: "household", initials: "PT", emoji: "🧻", tone: "#d9c89a" },
  { id: "h-dish", name: "Dish Soap", unit: "740 mL", price: 5.99, category: "household", initials: "DS", emoji: "🧼", tone: "#3f7a8a" },

  // Hot Food
  { id: "ht-bannock", name: "Fresh Bannock", unit: "single", price: 3.5, category: "hot", initials: "BA", emoji: "🍞", tone: "#b88a52" },
  { id: "ht-chili", name: "Chili Bowl", unit: "12 oz", price: 8.5, category: "hot", initials: "CB", emoji: "🌶️", tone: "#9a3f2a" },
  { id: "ht-sandwich", name: "Deli Sandwich", unit: "single", price: 7.5, category: "hot", initials: "SW", emoji: "🥪", tone: "#b89a6a" },
  { id: "ht-coffee", name: "Coffee — Large", unit: "16 oz", price: 2.75, category: "hot", initials: "CF", emoji: "☕", tone: "#3a2a1f" },
  { id: "ht-hotdog", name: "Hot Dog", unit: "single", price: 4.5, category: "hot", initials: "HD", emoji: "🌭", tone: "#a64a3a" },
  { id: "ht-soup", name: "Soup of the Day", unit: "12 oz", price: 6.0, category: "hot", initials: "SO", emoji: "🍲", tone: "#a87a3a" },

  // Tobacco
  { id: "t-dum", name: "du Maurier Pack", unit: "25 ct", price: 19.99, category: "tobacco", initials: "DM", emoji: "🚬", tone: "#5a3a2a" },
  { id: "t-play", name: "Players Pack", unit: "25 ct", price: 19.49, category: "tobacco", initials: "PL", emoji: "🚬", tone: "#1f3a2a" },
  { id: "t-bel", name: "Belmont Pack", unit: "25 ct", price: 20.49, category: "tobacco", initials: "BE", emoji: "🚬", tone: "#3a3a4a" },
  { id: "t-pouch", name: "Rolling Tobacco", unit: "50 g pouch", price: 34.99, category: "tobacco", initials: "RT", emoji: "🚬", tone: "#7a4a2a" },
  { id: "t-lighter", name: "Bic Lighter", unit: "single", price: 2.99, category: "tobacco", initials: "LI", emoji: "🔥", tone: "#b85a3e" },
  { id: "t-papers", name: "Rolling Papers", unit: "1 booklet", price: 3.49, category: "tobacco", initials: "PA", emoji: "📄", tone: "#dcd2b6" },
];

const QUICK_AMOUNTS = [5, 10, 20, 50] as const;

const CASHIER = {
  name: "Maria H.",
  shiftStart: "07:00",
  till: "Till 1",
};

function fmt(n: number) {
  return n.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);
  return now;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function Pos() {
  const [screen, setScreen] = useState<Screen>("lock");
  const [pin, setPin] = useState("");
  const [category, setCategory] = useState<CategoryId>("grocery");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [online, setOnline] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cashTendered, setCashTendered] = useState<string>("");
  const [managerOpen, setManagerOpen] = useState(false);
  const [signedInAt, setSignedInAt] = useState<Date | null>(null);

  const now = useClock();

  const subtotal = useMemo(
    () => cart.reduce((s, l) => s + l.price * l.qty, 0),
    [cart],
  );
  const tax = 0;
  const total = subtotal + tax;

  const tendered = parseFloat(cashTendered || "0");
  const change = Math.max(0, tendered - total);

  function addItem(item: Item) {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }
  function bumpQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );
  }
  function clearSale() {
    setCart([]);
    setPaymentMethod(null);
    setCashTendered("");
  }

  function signIn() {
    setSignedInAt(new Date());
    setScreen("pos");
    setPin("");
  }

  function lockOut() {
    setScreen("lock");
    setSignedInAt(null);
    clearSale();
    setPin("");
  }

  function startPay() {
    if (cart.length === 0) return;
    setScreen("payment");
  }

  function pickPayment(m: PaymentMethod) {
    setPaymentMethod(m);
    if (m === "cash") {
      setScreen("cash-tender");
      setCashTendered("");
    } else {
      setScreen("receipt");
    }
  }

  function tenderApply() {
    if (tendered < total) return;
    setScreen("receipt");
  }

  function finishReceipt(_action: "print" | "email" | "skip") {
    setScreen("complete");
  }

  function newSale() {
    clearSale();
    setScreen("pos");
  }

  return (
    <div
      className="w-full min-h-screen flex items-stretch justify-center"
      style={{
        background: "var(--pos-bg)",
        color: "var(--pos-text)",
        fontFamily: "var(--pos-font-sans)",
      }}
    >
      <div className="w-full max-w-[1280px] flex flex-col min-h-screen">
        <TopBar
          screen={screen}
          signedInAt={signedInAt}
          now={now}
          online={online}
          onToggleOnline={() => setOnline((o) => !o)}
          onLock={lockOut}
          onManager={() => setManagerOpen(true)}
        />
        {!online && screen !== "lock" ? <OfflineStrip /> : null}

        <div className="flex-1 flex">
          {screen === "lock" ? (
            <LockScreen
              pin={pin}
              setPin={setPin}
              onSignIn={signIn}
              now={now}
            />
          ) : screen === "pos" ? (
            <PosFrame
              category={category}
              setCategory={setCategory}
              cart={cart}
              addItem={addItem}
              bumpQty={bumpQty}
              clearSale={clearSale}
              startPay={startPay}
              subtotal={subtotal}
              tax={tax}
              total={total}
            />
          ) : screen === "payment" ? (
            <PaymentScreen
              total={total}
              cart={cart}
              onBack={() => setScreen("pos")}
              onPick={pickPayment}
            />
          ) : screen === "cash-tender" ? (
            <CashTenderScreen
              total={total}
              tendered={tendered}
              change={change}
              cashTendered={cashTendered}
              setCashTendered={setCashTendered}
              onBack={() => setScreen("payment")}
              onApply={tenderApply}
            />
          ) : screen === "receipt" ? (
            <ReceiptScreen
              total={total}
              paymentMethod={paymentMethod ?? "cash"}
              tendered={tendered}
              change={change}
              onAction={finishReceipt}
            />
          ) : (
            <CompleteScreen onNew={newSale} />
          )}
        </div>
      </div>

      {managerOpen ? (
        <ManagerOverrideModal onClose={() => setManagerOpen(false)} />
      ) : null}
    </div>
  );
}

/* ================================ TOP BAR =============================== */

function TopBar({
  screen,
  signedInAt,
  now,
  online,
  onToggleOnline,
  onLock,
  onManager,
}: {
  screen: Screen;
  signedInAt: Date | null;
  now: Date;
  online: boolean;
  onToggleOnline: () => void;
  onLock: () => void;
  onManager: () => void;
}) {
  const isLock = screen === "lock";
  return (
    <div
      className="flex items-center justify-between px-6"
      style={{
        background: "var(--pos-primary)",
        color: "#f4ede0",
        height: 72,
        borderBottom: "1px solid var(--pos-primary-deep)",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center font-bold"
          style={{
            background: "var(--pos-bg)",
            color: "var(--pos-primary)",
            fontFamily: "var(--pos-font-mono)",
            fontSize: 18,
          }}
        >
          DL
        </div>
        <div className="leading-tight">
          <div className="text-base font-semibold">Deer Lake Store</div>
          <div
            className="text-xs uppercase tracking-wider"
            style={{ color: "#cdd9c8", fontFamily: "var(--pos-font-mono)" }}
          >
            {CASHIER.till} · {formatDate(now)}
          </div>
        </div>
      </div>

      {isLock ? (
        <div
          className="text-xs uppercase tracking-wider"
          style={{ color: "#cdd9c8", fontFamily: "var(--pos-font-mono)" }}
        >
          Locked — sign in to begin
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div
            className="px-3 py-2 rounded-md text-sm leading-tight text-right"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div className="font-semibold">{CASHIER.name}</div>
            <div
              className="text-[11px] uppercase tracking-wider"
              style={{ color: "#cdd9c8", fontFamily: "var(--pos-font-mono)" }}
            >
              On since {signedInAt ? formatTime(signedInAt) : CASHIER.shiftStart} · Now {formatTime(now)}
            </div>
          </div>

          <button
            onClick={onToggleOnline}
            className="flex items-center gap-2 px-4 rounded-md font-semibold text-sm"
            style={{
              background: online ? "rgba(255,255,255,0.08)" : "var(--pos-amber)",
              color: online ? "#f4ede0" : "#1f1100",
              border: "1px solid rgba(255,255,255,0.18)",
              minWidth: 140,
              minHeight: 60,
            }}
            aria-label={online ? "Online — tap to simulate offline" : "Offline — tap to come back online"}
          >
            {online ? <Wifi size={18} /> : <CloudOff size={18} />}
            <span>{online ? "Online" : "Offline"}</span>
          </button>

          <button
            onClick={onManager}
            className="flex items-center gap-2 px-4 rounded-md font-semibold text-sm"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#f4ede0",
              border: "1px solid rgba(255,255,255,0.18)",
              minHeight: 60,
            }}
          >
            <ShieldAlert size={18} />
            Manager
          </button>

          <button
            onClick={onLock}
            className="flex items-center gap-2 px-4 rounded-md font-semibold text-sm"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#f4ede0",
              border: "1px solid rgba(255,255,255,0.18)",
              minHeight: 60,
            }}
          >
            <Lock size={18} />
            Lock
          </button>
        </div>
      )}
    </div>
  );
}

function OfflineStrip() {
  return (
    <div
      className="flex items-center gap-3 px-6"
      style={{
        background: "var(--pos-amber-soft)",
        color: "#3d2300",
        height: 44,
        borderBottom: "1px solid var(--pos-amber)",
        fontFamily: "var(--pos-font-mono)",
        fontSize: 13,
      }}
      role="status"
    >
      <CloudOff size={18} />
      <span className="font-semibold uppercase tracking-wider">
        Offline mode
      </span>
      <span className="opacity-80">
        Sales saved locally — will sync when satellite link is back.
      </span>
    </div>
  );
}

/* ================================ LOCK ================================== */

function LockScreen({
  pin,
  setPin,
  onSignIn,
  now,
}: {
  pin: string;
  setPin: (p: string) => void;
  onSignIn: () => void;
  now: Date;
}) {
  function press(d: string) {
    setPin((pin + d).slice(0, 4));
  }
  function back() {
    setPin(pin.slice(0, -1));
  }
  function clear() {
    setPin("");
  }
  const canSignIn = pin.length === 4;

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"];

  return (
    <div className="flex-1 flex items-center justify-center px-12 py-10">
      <div className="grid grid-cols-2 gap-12 w-full max-w-[920px] items-center">
        <div>
          <div
            className="text-xs uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--pos-muted)", fontFamily: "var(--pos-font-mono)" }}
          >
            {formatDate(now)} · {formatTime(now)}
          </div>
          <h1
            className="text-4xl font-semibold leading-tight mb-3"
            style={{ color: "var(--pos-primary)" }}
          >
            Sign in to start your shift
          </h1>
          <p
            className="text-lg leading-snug mb-6"
            style={{ color: "var(--pos-muted)" }}
          >
            Enter your 4-digit cashier PIN. Your name will appear on every receipt and shift report.
          </p>
          <div
            className="flex gap-3 mb-6"
            aria-label="PIN entry"
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-16 rounded-md flex items-center justify-center text-3xl font-semibold"
                style={{
                  background: "var(--pos-card)",
                  border: `2px solid ${pin.length > i ? "var(--pos-primary)" : "var(--pos-rule)"}`,
                  color: "var(--pos-primary)",
                  fontFamily: "var(--pos-font-mono)",
                }}
              >
                {pin.length > i ? "•" : ""}
              </div>
            ))}
          </div>
          <button
            onClick={onSignIn}
            disabled={!canSignIn}
            className="w-full h-20 rounded-md text-2xl font-semibold flex items-center justify-center gap-3"
            style={{
              background: canSignIn ? "var(--pos-primary)" : "var(--pos-rule)",
              color: canSignIn ? "#f4ede0" : "var(--pos-muted)",
              cursor: canSignIn ? "pointer" : "not-allowed",
            }}
          >
            Sign In
          </button>
          <div
            className="mt-4 text-sm"
            style={{ color: "var(--pos-muted)" }}
          >
            Forgot your PIN? Ask the manager to reset it from the back office.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {keys.map((k) => {
            if (k === "clear") {
              return (
                <button
                  key={k}
                  onClick={clear}
                  className="h-20 rounded-md text-base font-semibold uppercase tracking-wider"
                  style={{
                    background: "var(--pos-paper)",
                    color: "var(--pos-text)",
                    border: "1px solid var(--pos-rule)",
                    fontFamily: "var(--pos-font-mono)",
                  }}
                >
                  Clear
                </button>
              );
            }
            if (k === "back") {
              return (
                <button
                  key={k}
                  onClick={back}
                  className="h-20 rounded-md flex items-center justify-center"
                  style={{
                    background: "var(--pos-paper)",
                    color: "var(--pos-text)",
                    border: "1px solid var(--pos-rule)",
                  }}
                >
                  <Delete size={28} />
                </button>
              );
            }
            return (
              <button
                key={k}
                onClick={() => press(k)}
                className="h-20 rounded-md text-3xl font-semibold"
                style={{
                  background: "var(--pos-card)",
                  color: "var(--pos-text)",
                  border: "1px solid var(--pos-rule)",
                  fontFamily: "var(--pos-font-mono)",
                }}
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================ MAIN POS FRAME ============================ */

function PosFrame({
  category,
  setCategory,
  cart,
  addItem,
  bumpQty,
  clearSale,
  startPay,
  subtotal,
  tax,
  total,
}: {
  category: CategoryId;
  setCategory: (c: CategoryId) => void;
  cart: CartLine[];
  addItem: (i: Item) => void;
  bumpQty: (id: string, delta: number) => void;
  clearSale: () => void;
  startPay: () => void;
  subtotal: number;
  tax: number;
  total: number;
}) {
  const items = useMemo(
    () => ITEMS.filter((i) => i.category === category),
    [category],
  );
  const lineCount = cart.reduce((s, l) => s + l.qty, 0);
  return (
    <div className="flex-1 flex">
      {/* Category nav */}
      <div
        className="flex flex-col p-3 gap-2"
        style={{
          width: 196,
          background: "var(--pos-paper)",
          borderRight: "1px solid var(--pos-rule)",
        }}
      >
        <div
          className="text-[11px] uppercase tracking-[0.2em] px-2 pt-1 pb-2"
          style={{ color: "var(--pos-muted)", fontFamily: "var(--pos-font-mono)" }}
        >
          Categories
        </div>
        {CATEGORIES.map((c) => {
          const active = c.id === category;
          const Icon = c.Icon;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className="text-left px-3 py-3 rounded-md leading-tight flex items-center gap-3"
              style={{
                background: active ? "var(--pos-primary)" : "var(--pos-card)",
                color: active ? "#f4ede0" : "var(--pos-text)",
                border: `1px solid ${active ? "var(--pos-primary)" : "var(--pos-rule)"}`,
                minHeight: 72,
              }}
            >
              <div
                className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: active ? "rgba(255,255,255,0.12)" : c.tone,
                  color: "#f4ede0",
                }}
              >
                <Icon size={24} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold">{c.label}</div>
                <div
                  className="text-[11px] uppercase tracking-wider mt-0.5"
                  style={{
                    color: active ? "#cdd9c8" : "var(--pos-muted)",
                    fontFamily: "var(--pos-font-mono)",
                  }}
                >
                  {c.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Item grid */}
      <div className="flex-1 flex flex-col" style={{ background: "var(--pos-bg)" }}>
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid var(--pos-rule)" }}
        >
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ color: "var(--pos-muted)", fontFamily: "var(--pos-font-mono)" }}
            >
              {CATEGORIES.find((c) => c.id === category)?.sub}
            </div>
            <div
              className="text-2xl font-semibold leading-tight"
              style={{ color: "var(--pos-primary)" }}
            >
              {CATEGORIES.find((c) => c.id === category)?.label}
            </div>
          </div>
          <div
            className="text-xs"
            style={{
              color: "var(--pos-muted)",
              fontFamily: "var(--pos-font-mono)",
            }}
          >
            {items.length} items · tap a tile to add
          </div>
        </div>

        <div
          className="grid grid-cols-3 gap-3 p-4 overflow-auto"
          style={{ maxHeight: "calc(100vh - 240px)" }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              className="text-left rounded-lg flex gap-3 p-3 transition-transform active:scale-[0.99]"
              style={{
                background: "var(--pos-card)",
                border: "1px solid var(--pos-rule)",
                minHeight: 96,
              }}
            >
              <div
                className="w-16 h-16 rounded-md flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${item.tone}, ${item.tone}cc)`,
                  boxShadow: "inset 0 -8px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
                aria-hidden="true"
              >
                <span style={{ fontSize: 36, lineHeight: 1, filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))" }}>
                  {item.emoji}
                </span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div
                    className="text-[15px] font-semibold leading-tight truncate"
                    style={{ color: "var(--pos-text)" }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-wider mt-0.5"
                    style={{
                      color: "var(--pos-muted)",
                      fontFamily: "var(--pos-font-mono)",
                    }}
                  >
                    {item.unit}
                    {item.freight ? " · freight in" : ""}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div
                    className="text-xl font-semibold"
                    style={{
                      color: "var(--pos-primary)",
                      fontFamily: "var(--pos-font-mono)",
                    }}
                  >
                    {fmt(item.price)}
                  </div>
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{
                      background: "var(--pos-primary)",
                      color: "#f4ede0",
                    }}
                  >
                    <Plus size={18} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart panel */}
      <div
        className="flex flex-col"
        style={{
          width: 380,
          background: "var(--pos-card)",
          borderLeft: "1px solid var(--pos-rule)",
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid var(--pos-rule)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} style={{ color: "var(--pos-primary)" }} />
            <div
              className="text-base font-semibold"
              style={{ color: "var(--pos-primary)" }}
            >
              Cart
            </div>
            <div
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "var(--pos-paper)",
                color: "var(--pos-muted)",
                fontFamily: "var(--pos-font-mono)",
              }}
            >
              {lineCount} item{lineCount === 1 ? "" : "s"}
            </div>
          </div>
          {cart.length > 0 ? (
            <button
              onClick={clearSale}
              className="text-xs uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1"
              style={{
                color: "var(--pos-danger)",
                fontFamily: "var(--pos-font-mono)",
              }}
            >
              <Trash2 size={14} /> Clear
            </button>
          ) : null}
        </div>

        <div className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center px-6 py-10">
              <div>
                <div
                  className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
                  style={{ background: "var(--pos-paper)", color: "var(--pos-muted)" }}
                >
                  <ShoppingCart size={24} />
                </div>
                <div
                  className="text-sm leading-snug"
                  style={{ color: "var(--pos-muted)" }}
                >
                  Tap any item on the left to start a sale.
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--pos-rule)" }}>
              {cart.map((line) => (
                <div key={line.id} className="p-3">
                  <div className="flex gap-3 items-start">
                    <div
                      className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${line.tone}, ${line.tone}cc)`,
                        boxShadow: "inset 0 -6px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
                      }}
                      aria-hidden="true"
                    >
                      <span style={{ fontSize: 28, lineHeight: 1, filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))" }}>
                        {line.emoji}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-semibold leading-tight"
                        style={{ color: "var(--pos-text)" }}
                      >
                        {line.name}
                      </div>
                      <div
                        className="text-[11px] uppercase tracking-wider mt-0.5"
                        style={{
                          color: "var(--pos-muted)",
                          fontFamily: "var(--pos-font-mono)",
                        }}
                      >
                        {fmt(line.price)} · {line.unit}
                      </div>
                    </div>
                    <div
                      className="text-right font-semibold whitespace-nowrap"
                      style={{
                        color: "var(--pos-primary)",
                        fontFamily: "var(--pos-font-mono)",
                      }}
                    >
                      {fmt(line.price * line.qty)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 ml-[60px]">
                    <button
                      onClick={() => bumpQty(line.id, -1)}
                      className="rounded-md flex items-center justify-center"
                      style={{
                        background: "var(--pos-paper)",
                        color: "var(--pos-text)",
                        border: "1px solid var(--pos-rule)",
                        width: 60,
                        height: 60,
                      }}
                      aria-label={line.qty === 1 ? `Remove ${line.name}` : `Decrease ${line.name}`}
                    >
                      {line.qty === 1 ? <Trash2 size={20} /> : <Minus size={22} />}
                    </button>
                    <div
                      className="text-center font-semibold text-xl"
                      style={{
                        fontFamily: "var(--pos-font-mono)",
                        minWidth: 44,
                        color: "var(--pos-text)",
                      }}
                    >
                      {line.qty}
                    </div>
                    <button
                      onClick={() => bumpQty(line.id, 1)}
                      className="rounded-md flex items-center justify-center"
                      style={{
                        background: "var(--pos-primary)",
                        color: "#f4ede0",
                        width: 60,
                        height: 60,
                      }}
                      aria-label={`Increase ${line.name}`}
                    >
                      <Plus size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="px-4 py-3"
          style={{ borderTop: "1px solid var(--pos-rule)" }}
        >
          <CartTotalRow label="Subtotal" value={fmt(subtotal)} />
          <CartTotalRow
            label="Tax (status card on file — exempt)"
            value={fmt(tax)}
            muted
          />
          <CartTotalRow
            label="Freight surcharge"
            value="Included"
            muted
            mono={false}
          />
          <div
            className="flex items-baseline justify-between mt-3 pt-3"
            style={{ borderTop: "1px solid var(--pos-rule)" }}
          >
            <div
              className="text-sm uppercase tracking-wider"
              style={{
                color: "var(--pos-muted)",
                fontFamily: "var(--pos-font-mono)",
              }}
            >
              Total
            </div>
            <div
              className="text-3xl font-semibold"
              style={{
                color: "var(--pos-primary)",
                fontFamily: "var(--pos-font-mono)",
              }}
            >
              {fmt(total)}
            </div>
          </div>

          <button
            onClick={startPay}
            disabled={cart.length === 0}
            className="w-full h-16 mt-3 rounded-md text-xl font-semibold flex items-center justify-center gap-3"
            style={{
              background: cart.length === 0 ? "var(--pos-rule)" : "var(--pos-accent)",
              color: cart.length === 0 ? "var(--pos-muted)" : "#fff",
              cursor: cart.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            Pay {cart.length > 0 ? fmt(total) : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartTotalRow({
  label,
  value,
  muted,
  mono = true,
}: {
  label: string;
  value: string;
  muted?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between mb-1">
      <div
        className="text-xs uppercase tracking-wider"
        style={{
          color: "var(--pos-muted)",
          fontFamily: "var(--pos-font-mono)",
        }}
      >
        {label}
      </div>
      <div
        className="text-sm"
        style={{
          color: muted ? "var(--pos-muted)" : "var(--pos-text)",
          fontFamily: mono ? "var(--pos-font-mono)" : "var(--pos-font-sans)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ============================ PAYMENT SCREEN ============================ */

function PaymentScreen({
  total,
  cart,
  onBack,
  onPick,
}: {
  total: number;
  cart: CartLine[];
  onBack: () => void;
  onPick: (m: PaymentMethod) => void;
}) {
  const lineCount = cart.reduce((s, l) => s + l.qty, 0);
  const options: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode; tone: string }[] = [
    { id: "cash", label: "Cash", sub: "Open drawer", icon: <Banknote size={36} />, tone: "var(--pos-primary)" },
    { id: "debit", label: "Debit", sub: "Tap or insert", icon: <CreditCard size={36} />, tone: "#3a5a7a" },
    { id: "credit", label: "Credit", sub: "Tap or insert", icon: <CreditCard size={36} />, tone: "#5a4a7a" },
    { id: "community", label: "Community Account", sub: "Member ledger", icon: <Users size={36} />, tone: "var(--pos-accent)" },
  ];
  return (
    <div className="flex-1 flex flex-col px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 rounded-md text-base font-semibold"
          style={{
            background: "var(--pos-card)",
            color: "var(--pos-text)",
            border: "1px solid var(--pos-rule)",
            minHeight: 60,
          }}
        >
          <ArrowLeft size={18} /> Back to cart
        </button>
        <div className="text-right">
          <div
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--pos-muted)", fontFamily: "var(--pos-font-mono)" }}
          >
            Sale total · {lineCount} item{lineCount === 1 ? "" : "s"}
          </div>
          <div
            className="text-4xl font-semibold leading-tight"
            style={{
              color: "var(--pos-primary)",
              fontFamily: "var(--pos-font-mono)",
            }}
          >
            {fmt(total)}
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-3 mb-4">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--pos-primary)" }}
        >
          How is the customer paying?
        </h2>
        <div
          className="text-sm"
          style={{ color: "var(--pos-muted)" }}
        >
          Pick one. Big buttons — hard to miss.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            className="rounded-lg flex flex-col items-start justify-between p-6 text-left transition-transform active:scale-[0.99]"
            style={{
              background: "var(--pos-card)",
              border: "2px solid var(--pos-rule)",
              minHeight: 200,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-16 rounded-md flex items-center justify-center"
                style={{
                  background: o.tone,
                  color: "#f4ede0",
                }}
              >
                {o.icon}
              </div>
              <div>
                <div
                  className="text-3xl font-semibold leading-tight"
                  style={{ color: "var(--pos-text)" }}
                >
                  {o.label}
                </div>
                <div
                  className="text-sm uppercase tracking-wider mt-1"
                  style={{
                    color: "var(--pos-muted)",
                    fontFamily: "var(--pos-font-mono)",
                  }}
                >
                  {o.sub}
                </div>
              </div>
            </div>
            <div
              className="text-sm self-end uppercase tracking-wider"
              style={{
                color: "var(--pos-primary)",
                fontFamily: "var(--pos-font-mono)",
              }}
            >
              Tap to continue →
            </div>
          </button>
        ))}
      </div>

      <div
        className="mt-4 px-4 py-3 rounded-md text-sm"
        style={{
          background: "var(--pos-paper)",
          color: "var(--pos-muted)",
          border: "1px solid var(--pos-rule)",
        }}
      >
        <strong style={{ color: "var(--pos-text)" }}>Community Account</strong> charges the customer's
        member ledger. Settled monthly. Cashier never handles the credit decision — limit and status
        are checked automatically against the band office roster.
      </div>
    </div>
  );
}

/* ========================= CASH TENDER SCREEN =========================== */

function CashTenderScreen({
  total,
  tendered,
  change,
  cashTendered,
  setCashTendered,
  onBack,
  onApply,
}: {
  total: number;
  tendered: number;
  change: number;
  cashTendered: string;
  setCashTendered: (s: string) => void;
  onBack: () => void;
  onApply: () => void;
}) {
  function press(d: string) {
    if (d === "." && cashTendered.includes(".")) return;
    if (cashTendered === "0" && d !== ".") {
      setCashTendered(d);
      return;
    }
    setCashTendered((cashTendered + d).slice(0, 8));
  }
  function back() {
    setCashTendered(cashTendered.slice(0, -1));
  }
  function quick(amount: number) {
    setCashTendered(amount.toFixed(2));
  }
  function exact() {
    setCashTendered(total.toFixed(2));
  }

  const enough = tendered >= total && tendered > 0;

  return (
    <div className="flex-1 flex flex-col px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 rounded-md text-base font-semibold"
          style={{
            background: "var(--pos-card)",
            color: "var(--pos-text)",
            border: "1px solid var(--pos-rule)",
            minHeight: 60,
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-right">
          <div
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--pos-muted)", fontFamily: "var(--pos-font-mono)" }}
          >
            Cash payment
          </div>
          <div
            className="text-2xl font-semibold leading-tight"
            style={{
              color: "var(--pos-primary)",
              fontFamily: "var(--pos-font-mono)",
            }}
          >
            Total {fmt(total)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Left: tendered + change */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-lg p-5"
            style={{
              background: "var(--pos-card)",
              border: "1px solid var(--pos-rule)",
            }}
          >
            <div
              className="text-xs uppercase tracking-[0.2em] mb-1"
              style={{ color: "var(--pos-muted)", fontFamily: "var(--pos-font-mono)" }}
            >
              Cash tendered
            </div>
            <div
              className="text-5xl font-semibold leading-tight"
              style={{
                color: "var(--pos-text)",
                fontFamily: "var(--pos-font-mono)",
              }}
            >
              {cashTendered ? fmt(tendered) : "$0.00"}
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "var(--pos-muted)" }}
            >
              Tap a quick amount or use the keypad.
            </div>
          </div>

          <div
            className="rounded-lg p-5 flex-1 flex flex-col justify-between"
            style={{
              background: enough ? "var(--pos-primary)" : "var(--pos-paper)",
              color: enough ? "#f4ede0" : "var(--pos-text)",
              border: "1px solid var(--pos-rule)",
            }}
          >
            <div>
              <div
                className="text-xs uppercase tracking-[0.2em] mb-1"
                style={{
                  color: enough ? "#cdd9c8" : "var(--pos-muted)",
                  fontFamily: "var(--pos-font-mono)",
                }}
              >
                Change due
              </div>
              <div
                className="text-7xl font-semibold leading-none"
                style={{ fontFamily: "var(--pos-font-mono)" }}
              >
                {fmt(change)}
              </div>
              {!enough && tendered > 0 ? (
                <div
                  className="mt-3 text-sm uppercase tracking-wider"
                  style={{ color: "var(--pos-danger)", fontFamily: "var(--pos-font-mono)" }}
                >
                  Need {fmt(total - tendered)} more
                </div>
              ) : null}
            </div>
            <button
              onClick={onApply}
              disabled={!enough}
              className="h-16 rounded-md text-xl font-semibold flex items-center justify-center gap-3 mt-4"
              style={{
                background: enough ? "var(--pos-accent)" : "var(--pos-rule)",
                color: enough ? "#fff" : "var(--pos-muted)",
                cursor: enough ? "pointer" : "not-allowed",
              }}
            >
              {enough ? "Open drawer & finish" : "Not enough cash yet"}
            </button>
          </div>
        </div>

        {/* Right: quick amounts + numpad */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => quick(amt)}
                className="h-16 rounded-md text-xl font-semibold"
                style={{
                  background: "var(--pos-card)",
                  color: "var(--pos-primary)",
                  border: "2px solid var(--pos-rule)",
                  fontFamily: "var(--pos-font-mono)",
                }}
              >
                ${amt}
              </button>
            ))}
            <button
              onClick={exact}
              className="h-16 rounded-md text-base font-semibold uppercase tracking-wider col-span-2"
              style={{
                background: "var(--pos-primary)",
                color: "#f4ede0",
                fontFamily: "var(--pos-font-mono)",
              }}
            >
              Exact {fmt(total)}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 flex-1">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"].map(
              (k) => {
                if (k === "back") {
                  return (
                    <button
                      key={k}
                      onClick={back}
                      className="rounded-md flex items-center justify-center"
                      style={{
                        background: "var(--pos-paper)",
                        color: "var(--pos-text)",
                        border: "1px solid var(--pos-rule)",
                        minHeight: 64,
                      }}
                    >
                      <Delete size={26} />
                    </button>
                  );
                }
                return (
                  <button
                    key={k}
                    onClick={() => press(k)}
                    className="rounded-md text-3xl font-semibold"
                    style={{
                      background: "var(--pos-card)",
                      color: "var(--pos-text)",
                      border: "1px solid var(--pos-rule)",
                      fontFamily: "var(--pos-font-mono)",
                      minHeight: 64,
                    }}
                  >
                    {k}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ RECEIPT SCREEN ============================ */

function ReceiptScreen({
  total,
  paymentMethod,
  tendered,
  change,
  onAction,
}: {
  total: number;
  paymentMethod: PaymentMethod;
  tendered: number;
  change: number;
  onAction: (action: "print" | "email" | "skip") => void;
}) {
  const label =
    paymentMethod === "cash"
      ? "Cash"
      : paymentMethod === "debit"
        ? "Debit"
        : paymentMethod === "credit"
          ? "Credit"
          : "Community Account";
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-8">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
        style={{
          background: "var(--pos-success)",
          color: "#f4ede0",
        }}
      >
        <Check size={56} />
      </div>
      <h2
        className="text-4xl font-semibold leading-tight mb-2"
        style={{ color: "var(--pos-primary)" }}
      >
        Sale complete
      </h2>
      <div
        className="text-base mb-6"
        style={{ color: "var(--pos-muted)" }}
      >
        {label} · {fmt(total)}
        {paymentMethod === "cash" ? ` · change ${fmt(change)} from ${fmt(tendered)}` : ""}
      </div>

      <div className="w-full max-w-[820px] grid grid-cols-3 gap-4">
        <ReceiptButton
          icon={<Printer size={32} />}
          label="Print Receipt"
          sub="Counter printer"
          onClick={() => onAction("print")}
          primary
        />
        <ReceiptButton
          icon={<Mail size={32} />}
          label="Email Receipt"
          sub="Type customer's email"
          onClick={() => onAction("email")}
        />
        <ReceiptButton
          icon={<SkipForward size={32} />}
          label="Skip"
          sub="No receipt"
          onClick={() => onAction("skip")}
        />
      </div>
    </div>
  );
}

function ReceiptButton({
  icon,
  label,
  sub,
  onClick,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg flex flex-col items-center justify-center gap-3 p-6 transition-transform active:scale-[0.99]"
      style={{
        background: primary ? "var(--pos-primary)" : "var(--pos-card)",
        color: primary ? "#f4ede0" : "var(--pos-text)",
        border: `2px solid ${primary ? "var(--pos-primary)" : "var(--pos-rule)"}`,
        minHeight: 180,
      }}
    >
      <div
        className="w-16 h-16 rounded-md flex items-center justify-center"
        style={{
          background: primary ? "rgba(255,255,255,0.12)" : "var(--pos-paper)",
          color: primary ? "#f4ede0" : "var(--pos-primary)",
        }}
      >
        {icon}
      </div>
      <div className="text-2xl font-semibold leading-tight">{label}</div>
      <div
        className="text-sm uppercase tracking-wider"
        style={{
          color: primary ? "#cdd9c8" : "var(--pos-muted)",
          fontFamily: "var(--pos-font-mono)",
        }}
      >
        {sub}
      </div>
    </button>
  );
}

/* ============================ COMPLETE SCREEN =========================== */

function CompleteScreen({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{
          background: "var(--pos-paper)",
          color: "var(--pos-success)",
        }}
      >
        <Receipt size={40} />
      </div>
      <h2
        className="text-3xl font-semibold mb-2"
        style={{ color: "var(--pos-primary)" }}
      >
        Ready for the next customer
      </h2>
      <div
        className="text-base mb-8"
        style={{ color: "var(--pos-muted)" }}
      >
        Drawer will close automatically. Sale logged to today's till report.
      </div>
      <button
        onClick={onNew}
        className="h-20 px-12 rounded-md text-2xl font-semibold flex items-center justify-center gap-3"
        style={{
          background: "var(--pos-accent)",
          color: "#fff",
        }}
      >
        Start next sale
      </button>
    </div>
  );
}

/* ========================= MANAGER OVERRIDE MODAL ======================= */

function ManagerOverrideModal({ onClose }: { onClose: () => void }) {
  const [pin, setPin] = useState("");
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"];
  const actions = [
    { label: "Refund", sub: "Reverse a recent sale" },
    { label: "Void Line", sub: "Remove an item mid-sale" },
    { label: "Price Override", sub: "Match a posted price" },
    { label: "Open Drawer", sub: "No sale" },
  ];
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(15, 25, 20, 0.55)" }}
      onClick={onClose}
    >
      <div
        className="rounded-lg w-full max-w-[820px] p-6"
        style={{
          background: "var(--pos-bg)",
          border: "1px solid var(--pos-rule)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert size={20} style={{ color: "var(--pos-accent)" }} />
              <div
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--pos-accent)", fontFamily: "var(--pos-font-mono)" }}
              >
                Manager Override
              </div>
            </div>
            <h3
              className="text-2xl font-semibold leading-tight"
              style={{ color: "var(--pos-primary)" }}
            >
              Enter manager PIN to continue
            </h3>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--pos-muted)" }}
            >
              All overrides are logged with cashier name, time, and reason. Reviewed weekly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-md flex items-center justify-center"
            style={{
              background: "var(--pos-card)",
              color: "var(--pos-text)",
              border: "1px solid var(--pos-rule)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {actions.map((a) => (
                <div
                  key={a.label}
                  className="rounded-md p-3"
                  style={{
                    background: "var(--pos-card)",
                    border: "1px solid var(--pos-rule)",
                    minHeight: 80,
                  }}
                >
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--pos-text)" }}
                  >
                    {a.label}
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-wider mt-1"
                    style={{
                      color: "var(--pos-muted)",
                      fontFamily: "var(--pos-font-mono)",
                    }}
                  >
                    {a.sub}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="rounded-md p-3 flex items-start gap-2"
              style={{
                background: "var(--pos-amber-soft)",
                color: "#3d2300",
                border: "1px solid var(--pos-amber)",
              }}
            >
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <div className="text-xs leading-snug">
                Manager-only actions sit behind this PIN — refunds, voids, and price overrides never
                live in the cashier's primary flow. Locked tills can also be force-unlocked here.
              </div>
            </div>
          </div>

          <div>
            <div
              className="flex gap-2 mb-3"
              aria-label="Manager PIN"
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-12 rounded-md flex items-center justify-center text-2xl font-semibold"
                  style={{
                    background: "var(--pos-card)",
                    border: `2px solid ${pin.length > i ? "var(--pos-accent)" : "var(--pos-rule)"}`,
                    color: "var(--pos-primary)",
                    fontFamily: "var(--pos-font-mono)",
                  }}
                >
                  {pin.length > i ? "•" : ""}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {keys.map((k) => {
                if (k === "clear") {
                  return (
                    <button
                      key={k}
                      onClick={() => setPin("")}
                      className="rounded-md text-xs font-semibold uppercase tracking-wider"
                      style={{
                        background: "var(--pos-paper)",
                        color: "var(--pos-text)",
                        border: "1px solid var(--pos-rule)",
                        fontFamily: "var(--pos-font-mono)",
                        minHeight: 60,
                      }}
                    >
                      Clear
                    </button>
                  );
                }
                if (k === "back") {
                  return (
                    <button
                      key={k}
                      onClick={() => setPin(pin.slice(0, -1))}
                      className="rounded-md flex items-center justify-center"
                      style={{
                        background: "var(--pos-paper)",
                        color: "var(--pos-text)",
                        border: "1px solid var(--pos-rule)",
                        minHeight: 60,
                      }}
                    >
                      <Delete size={20} />
                    </button>
                  );
                }
                return (
                  <button
                    key={k}
                    onClick={() => setPin((pin + k).slice(0, 4))}
                    className="rounded-md text-xl font-semibold"
                    style={{
                      background: "var(--pos-card)",
                      color: "var(--pos-text)",
                      border: "1px solid var(--pos-rule)",
                      fontFamily: "var(--pos-font-mono)",
                      minHeight: 60,
                    }}
                  >
                    {k}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pos;

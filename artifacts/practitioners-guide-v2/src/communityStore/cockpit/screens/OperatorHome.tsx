import {
  ClipboardCheck,
  DoorOpen,
  Lock,
  Moon,
  Refrigerator,
  ShoppingBasket,
  Snowflake,
  Truck,
  WifiOff,
} from "lucide-react";

type Status = "done" | "next" | "later" | "overdue";

interface Tile {
  id: string;
  Icon: typeof DoorOpen;
  action: string;
  hint: string;
  status: Status;
  navigateTo?: "till";
}

const TILES: Tile[] = [
  { id: "open", Icon: DoorOpen, action: "Open the store", hint: "8:00 am", status: "done" },
  { id: "float", Icon: ClipboardCheck, action: "Count the float", hint: "before till", status: "done" },
  { id: "till", Icon: ShoppingBasket, action: "Take sales", hint: "now", status: "next", navigateTo: "till" },
  { id: "truck", Icon: Truck, action: "Receive truck", hint: "Tue · 11 am · Local Line", status: "later" },
  { id: "cooler", Icon: Refrigerator, action: "Count the cooler", hint: "by 3 pm", status: "overdue" },
  { id: "freezer", Icon: Snowflake, action: "Log freezer temp", hint: "by 3 pm", status: "later" },
  { id: "close", Icon: Moon, action: "Close the day", hint: "after 9 pm", status: "later" },
];

const STATUS: Record<Status, { dot: string; ring: string; label: string }> = {
  done: { dot: "#3b6e4a", ring: "rgba(59,110,74,0.18)", label: "done" },
  next: { dot: "#b85a3e", ring: "rgba(184,90,62,0.20)", label: "do this next" },
  later: { dot: "#c8bfa7", ring: "rgba(200,191,167,0.30)", label: "not yet" },
  overdue: { dot: "#9c2a1c", ring: "rgba(156,42,28,0.20)", label: "overdue" },
};

export default function OperatorHome({ onNavigateTill }: { onNavigateTill: () => void }) {
  const today = new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });

  return (
    <section className="px-5 sm:px-7 py-6 max-w-[1280px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] uppercase tracking-[0.24em] mb-1" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
          Screen 2 · what they see at unlock
        </div>
        <h1 className="text-[34px] leading-[1.05] tracking-tight font-medium" style={{ color: "#1f3d2e", fontFamily: "'Fraunces', Georgia, serif" }}>
          The morning home screen.
          <span style={{ color: "#b85a3e", fontStyle: "italic" }}> Big tiles. Status dots. Nothing to read.</span>
        </h1>
      </header>

      <div className="flex justify-center">
        <div className="rounded-[28px] p-3 sm:p-4" style={{ background: "#1f3d2e", boxShadow: "0 30px 80px -30px rgba(31,61,46,0.35)", width: "min(100%, 880px)" }}>
          <div className="rounded-[18px] overflow-hidden" style={{ background: "#f4ede0" }}>
            <div className="flex items-center justify-between px-5 py-2 text-[10px] uppercase tracking-[0.20em]" style={{ background: "rgba(31,61,46,0.06)", color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
              <span>Community General Store · iPad · 9:14 am</span>
              <span className="flex items-center gap-1.5"><WifiOff size={12} /> Offline · sales saved here</span>
            </div>

            <div className="px-5 sm:px-7 pt-5 pb-3 flex items-baseline justify-between gap-4">
              <div>
                <div className="text-[12px] uppercase tracking-[0.22em] mb-1" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Signed in</div>
                <div className="text-[24px] leading-tight font-medium" style={{ color: "#1f3d2e", fontFamily: "'Fraunces', Georgia, serif" }}>The operator couple</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] uppercase tracking-[0.22em] mb-1" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Today</div>
                <div className="text-[16px] font-medium" style={{ color: "#1f3d2e" }}>{today}</div>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 px-5 sm:px-7 pb-7 pt-2" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gridAutoRows: "minmax(140px, auto)" }}>
              {TILES.map((t) => {
                const status = STATUS[t.status];
                const isPrimary = t.status === "next";
                const isOverdue = t.status === "overdue";
                const isDone = t.status === "done";
                const isLater = t.status === "later";
                const bg = isPrimary ? "#1f3d2e" : isOverdue ? "#fbe7e2" : isDone ? "#e3ecdf" : "#ebe2d0";
                const ink = isPrimary ? "#f4ede0" : "#1f3d2e";
                const sub = isPrimary ? "rgba(244,237,224,0.78)" : "#6b7665";

                const inner = (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <t.Icon size={32} strokeWidth={1.6} />
                      <span className="inline-block rounded-full" aria-label={status.label} title={status.label} style={{ width: 14, height: 14, background: status.dot, boxShadow: `0 0 0 4px ${status.ring}` }} />
                    </div>
                    <div className="text-[20px] sm:text-[22px] leading-[1.1] font-semibold" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>{t.action}</div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.22em]" style={{ color: sub, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                      {isLater ? "not yet" : isOverdue ? "overdue" : isDone ? "done" : "do this next"}
                      {" · "}{t.hint}
                    </div>
                    {t.id === "till" && (
                      <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.20em]" style={{ color: sub, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                        tap to open the till →
                      </div>
                    )}
                  </>
                );

                const sharedStyle = {
                  background: bg,
                  color: ink,
                  border: `1px solid ${status.ring}`,
                  gridColumn: t.id === "till" ? "span 2 / span 2" : undefined,
                };

                return (
                  <div key={t.id} style={{ gridColumn: t.id === "till" ? "span 2 / span 2" : undefined }}>
                    {t.navigateTo === "till" ? (
                      <button type="button" data-testid={`home-tile-${t.id}`} onClick={onNavigateTill}
                        className="w-full rounded-[14px] p-4 sm:p-5 text-left transition-transform hover:-translate-y-[2px] focus:outline-none focus-visible:ring-4"
                        style={{ ...sharedStyle, outlineColor: status.dot }}
                      >
                        {inner}
                      </button>
                    ) : (
                      <div data-testid={`home-tile-${t.id}`} className="rounded-[14px] p-4 sm:p-5 text-left" style={sharedStyle}>
                        {inner}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="rounded-[14px] p-4 sm:p-5 col-span-4 flex items-center gap-4" style={{ background: "#ebe2d0", border: "1px dashed rgba(31,61,46,0.30)" }}>
                <Lock size={22} strokeWidth={1.8} color="#6b7665" />
                <div className="flex-1">
                  <div className="text-[14px] font-semibold" style={{ color: "#1f3d2e" }}>Manager-only · prices, payroll, the bank</div>
                  <div className="text-[11px] uppercase tracking-[0.20em] mt-1" style={{ color: "#6b7665", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Hidden from this screen on purpose</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-1 pt-3 pb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(244,237,224,0.78)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
            <span>iPad · home tab</span>
            <span>Big tiles by design · 60 px touch targets</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <button type="button" onClick={onNavigateTill} data-testid="home-go-till"
          className="text-[11px] uppercase tracking-[0.22em] px-3 py-2 rounded-md border"
          style={{ color: "#1f3d2e", borderColor: "rgba(31,61,46,0.20)", background: "rgba(31,61,46,0.04)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
        >
          Open the till sub-screen →
        </button>
      </div>
    </section>
  );
}

import { useState } from "react";
import {
  ArrowDown,
  Box,
  ClipboardList,
  Refrigerator,
  ShoppingBasket,
  Snowflake,
  Sparkles,
  Truck,
} from "lucide-react";

/**
 * Top-down plan of the 40 ft × 80 ft store. The shapes are to scale on
 * an 8-by-16 cell grid (one cell = 5 ft). Each operational zone is a
 * tappable hit target; clicking surfaces a small card naming the
 * on-screen tool that runs that zone and one short line of what the
 * operator couple does there. Almost no body copy. Vision-at-a-glance.
 */

type ZoneId =
  | "till"
  | "market"
  | "dry"
  | "coldwall"
  | "stock"
  | "office"
  | "receiving";

interface Zone {
  id: ZoneId;
  label: string;
  Icon: typeof Box;
  /** grid-area: row-start / col-start / row-end+1 / col-end+1 (rows 1-9, cols 1-17) */
  area: string;
  tone: "primary" | "paper" | "warm" | "cool";
  tool: string;
  doing: string;
}

const ZONES: Zone[] = [
  {
    id: "till",
    label: "Front till",
    Icon: ShoppingBasket,
    area: "7 / 1 / 10 / 5",
    tone: "primary",
    tool: "Till screen — Square",
    doing: "Take sales. Print receipts. Count the float.",
  },
  {
    id: "market",
    label: "Market table",
    Icon: Sparkles,
    area: "1 / 5 / 4 / 10",
    tone: "warm",
    tool: "Market log — Local Line catalog",
    doing: "Local food & gathered food. Producers come from the 807 cycle.",
  },
  {
    id: "dry",
    label: "Dry shelves",
    Icon: Box,
    area: "4 / 5 / 8 / 13",
    tone: "paper",
    tool: "Shelf-count sheet — Headwaters layer",
    doing: "Walk the row, tap what's empty. Reorder lifts itself.",
  },
  {
    id: "coldwall",
    label: "Cooler / freezer wall",
    Icon: Refrigerator,
    area: "1 / 13 / 8 / 17",
    tone: "cool",
    tool: "Temp + spoilage log — Headwaters layer",
    doing: "Twice a day temp. Anything tossed is logged here.",
  },
  {
    id: "stock",
    label: "Stockroom",
    Icon: Snowflake,
    area: "8 / 13 / 10 / 17",
    tone: "paper",
    tool: "Stockroom count — Headwaters layer",
    doing: "What landed yesterday. What's still on the next truck.",
  },
  {
    id: "office",
    label: "Back office",
    Icon: ClipboardList,
    area: "1 / 1 / 4 / 5",
    tone: "primary",
    tool: "Manager screen — band sign-in only",
    doing: "Books, prices, payroll. Locked to the manager.",
  },
  {
    id: "receiving",
    label: "Receiving door",
    Icon: Truck,
    area: "8 / 5 / 10 / 13",
    tone: "warm",
    tool: "Truck-in checklist — Local Line manifest",
    doing: "Crate by crate. Manifest comes in from Local Line. Operators tap to confirm.",
  },
];

const TONE: Record<
  Zone["tone"],
  { bg: string; ink: string; ring: string; rule: string }
> = {
  primary: {
    bg: "#1f3d2e",
    ink: "#f4ede0",
    ring: "rgba(244,237,224,0.2)",
    rule: "rgba(244,237,224,0.55)",
  },
  paper: {
    bg: "#ebe2d0",
    ink: "#1f3d2e",
    ring: "rgba(31,61,46,0.18)",
    rule: "rgba(31,61,46,0.40)",
  },
  warm: {
    bg: "#b85a3e",
    ink: "#f4ede0",
    ring: "rgba(244,237,224,0.25)",
    rule: "rgba(244,237,224,0.55)",
  },
  cool: {
    bg: "#cfe0d8",
    ink: "#1f3d2e",
    ring: "rgba(31,61,46,0.20)",
    rule: "rgba(31,61,46,0.40)",
  },
};

export default function FloorPlan() {
  const [active, setActive] = useState<ZoneId>("till");
  const activeZone = ZONES.find((z) => z.id === active)!;

  return (
    <section className="px-5 sm:px-7 py-6 max-w-[1280px] mx-auto">
      <header className="flex items-baseline justify-between gap-6 flex-wrap mb-5">
        <div>
          <div
            className="text-[11px] uppercase tracking-[0.24em] mb-1"
            style={{
              color: "#6b7665",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
          >
            Screen 1 · the 40 × 80 box
          </div>
          <h1
            className="text-[34px] leading-[1.05] tracking-tight font-medium"
            style={{
              color: "#1f3d2e",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            Tap a zone. See the tool that runs it.
          </h1>
        </div>
        <p
          className="max-w-[28rem] text-[14px] leading-[1.45]"
          style={{ color: "#1f3d2e" }}
        >
          The whole store on one screen. Each zone has one tool behind it.
          Operators don&rsquo;t pick from menus &mdash; they tap where they are.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-6">
        {/* Floor */}
        <div
          className="rounded-[10px] p-5"
          style={{
            background: "#ebe2d0",
            border: "1px solid rgba(31,61,46,0.16)",
          }}
        >
          <div
            className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-[0.20em]"
            style={{
              color: "#6b7665",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
          >
            <span>40 ft</span>
            <span>1 cell = 5 ft · top-down view</span>
          </div>

          {/* The grid is 16 cols (80 ft) × 9 rows: 8 store rows (40 ft) plus
              one slim row at the bottom for the front entry strip. */}
          <div
            className="relative grid w-full"
            style={{
              gridTemplateColumns: "repeat(16, minmax(0, 1fr))",
              gridTemplateRows: "repeat(9, minmax(34px, 1fr))",
              gap: "6px",
              aspectRatio: "16 / 9",
              background: "rgba(31,61,46,0.04)",
              borderRadius: "6px",
              padding: "6px",
            }}
          >
            {ZONES.map((z) => {
              const tone = TONE[z.tone];
              const isActive = z.id === active;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setActive(z.id)}
                  data-testid={`floor-zone-${z.id}`}
                  data-active={isActive ? "true" : "false"}
                  className="relative rounded-[6px] flex flex-col items-start justify-end p-2 sm:p-3 text-left transition-all focus:outline-none"
                  style={{
                    gridArea: z.area,
                    background: tone.bg,
                    color: tone.ink,
                    boxShadow: isActive
                      ? `0 0 0 3px ${tone.rule}, 0 8px 24px -10px rgba(31,61,46,0.45)`
                      : "0 1px 0 rgba(31,61,46,0.06)",
                    transform: isActive ? "translateY(-1px)" : "none",
                  }}
                >
                  <z.Icon
                    size={20}
                    strokeWidth={1.6}
                    style={{ opacity: 0.92 }}
                  />
                  <div
                    className="mt-1 text-[12px] sm:text-[13px] font-semibold leading-tight"
                    style={{
                      fontFamily:
                        "'IBM Plex Sans', system-ui, sans-serif",
                    }}
                  >
                    {z.label}
                  </div>
                </button>
              );
            })}

            {/* Entry strip at the bottom */}
            <div
              className="col-span-16 row-start-[10] flex items-center justify-center text-[10px] uppercase tracking-[0.30em]"
              style={{
                gridColumn: "1 / span 16",
                gridRow: "10",
                color: "#6b7665",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              }}
            >
              ↑ front entry · customer flow
            </div>
          </div>

          <div
            className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.20em]"
            style={{
              color: "#6b7665",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
          >
            <span className="flex items-center gap-1.5">
              <ArrowDown size={12} /> 80 ft (length)
            </span>
            <span>doors face south</span>
          </div>
        </div>

        {/* Detail card */}
        <aside
          className="rounded-[10px] p-5 sticky top-[120px] self-start"
          style={{
            background: "#1f3d2e",
            color: "#f4ede0",
            border: "1px solid rgba(31,61,46,0.4)",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{
              color: "#e9c8a8",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
            data-testid="floor-detail-zone-name"
          >
            {activeZone.label}
          </div>
          <div
            className="text-[20px] leading-tight font-medium mb-3"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {activeZone.tool}
          </div>
          <p
            className="text-[14px] leading-[1.45] opacity-95"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            {activeZone.doing}
          </p>

          <div
            className="mt-5 pt-4 border-t flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.18em]"
            style={{
              borderColor: "rgba(244,237,224,0.16)",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
          >
            {ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setActive(z.id)}
                data-testid={`floor-chip-${z.id}`}
                className="px-2 py-1 rounded-md transition-colors"
                style={{
                  background:
                    z.id === active
                      ? "rgba(233,200,168,0.18)"
                      : "rgba(244,237,224,0.06)",
                  color: z.id === active ? "#e9c8a8" : "#f4ede0",
                  opacity: z.id === active ? 1 : 0.75,
                }}
              >
                {z.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BG, SURFACE, SURFACE_2, BORDER, TEXT, TEXT_2, TEXT_3, AMBER, FONT_DISPLAY } from "@/lib/theme";

interface ZoneEntry {
  zone: number;
  name: string;
  status: "active" | "next" | "future" | "wild";
  statusLabel: string;
  acres: string;
  parcels: string[];
  intention: string;
  note?: string;
}

const ZONES: ZoneEntry[] = [
  {
    zone: 0,
    name: "The House",
    status: "active",
    statusLabel: "Active — at capacity",
    acres: "~2 ac",
    parcels: ["Residential Area (house cluster)", "Kitchen", "Chicken coop"],
    intention:
      "Everything radiates from here. Zone 0 is the home base — heat, food storage, daily rhythm. Kitchen clean, coop maintained. This is the zone that has to be running smoothly before anything else expands.",
    note: "Currently at ceiling. Nothing in Zone 1 or beyond starts until Zone 0 runs without thinking about it.",
  },
  {
    zone: 1,
    name: "Kitchen Garden",
    status: "active",
    statusLabel: "Active — started",
    acres: "~0.5 ac",
    parcels: ["Garden grid (existing beds)", "Meadow edge — south-facing"],
    intention:
      "Herbs, annuals, cold frames. High-visit, high-yield per square foot. The existing garden grid is Zone 1. The sunny southern edge of the meadow is where this expands when you have room.",
    note: "Expand into meadow edge when Zone 0 stabilizes.",
  },
  {
    zone: 2,
    name: "Orchard + Ducks",
    status: "next",
    statusLabel: "Next — when ready",
    acres: "~3 ac",
    parcels: ["Behind the barn (centre of residential parcel)"],
    intention:
      "Orchard planting along north edge of barn area. Ducks to follow the drainage feature naturally. Visits daily once established — manages itself between visits. Perennials pay back for decades.",
    note:
      "This is the right call for that location. It waits. The ducks and the drainage are a natural pairing — don't fight that.",
  },
  {
    zone: 2,
    name: "Pavilion / Lodge",
    status: "future",
    statusLabel: "Future — personal expansion",
    acres: "~20 ac",
    parcels: ["Back meadow (behind orchard zone)"],
    intention:
      "Community programming space or XL family gathering lodge. Far enough from the house that it can hold people without your kitchen being the staging area. This is where Saltbox gatherings happen in person. The physical Council Table.",
    note:
      "No daily attention required once built. When it's active it produces disproportionate return — community gatherings compound.",
  },
  {
    zone: 3,
    name: "Working Forest",
    status: "active",
    statusLabel: "Active — semi-managed",
    acres: "~250 ac",
    parcels: [
      "Trail Systems (~186 ac)",
      "Campground (~21 ac)",
      "Campground & Trails (~46 ac)",
      "Lease parcels (~40 ac each)",
    ],
    intention:
      "Trail maintenance, campground income, firewood rotation, selective harvest. Visited weekly. The lease parcels are productive middle ground. The campground is your Zone 2/3 income engine — managed, regular attention, external-facing.",
    note: "The trail systems are your zone boundaries. Flat terrain means trails do the work that drainage usually does.",
  },
  {
    zone: 4,
    name: "Backcountry",
    status: "active",
    statusLabel: "Active — low intervention",
    acres: "~340 ac",
    parcels: [
      "Parr Trail Systems (~234 ac)",
      "Public Trails & Foraging (~106 ac)",
    ],
    intention:
      "Low-intervention working forest. Harvest rotation, observation, mushroom logs. Deer Stand #1 is a Zone 4 observation node. The Public Trails & Foraging parcel transitions to Crown land — shared access, lake-facing, semi-wild.",
    note:
      "Monthly visits. You read this zone, you don't manage it hard. The deer stand is correctly placed.",
  },
  {
    zone: 5,
    name: "Crown Land Threshold",
    status: "wild",
    statusLabel: "Wild — observe only",
    acres: "~0.8 ac (threshold)",
    parcels: ["Public Lake Access (~0.8 ac)", "Crown land beyond"],
    intention:
      "You hold the door. The community uses the water. This is the Zone 5 threshold — the small triangle at the lake edge that gives public access without you claiming the water. Crown land is Zone 5 by law. Harvest sustainably (berries, mushrooms, firewood within limits) but don't manage it. Observe it.",
    note:
      "The well doesn't know who's thirsty. It just holds.",
  },
];

const STATUS_COLORS: Record<ZoneEntry["status"], { bg: string; text: string; dot: string }> = {
  active:  { bg: "rgba(74,222,128,0.1)",   text: "#4ADE80", dot: "#4ADE80" },
  next:    { bg: "rgba(249,115,22,0.1)",    text: "#FB923C", dot: "#F97316" },
  future:  { bg: "rgba(59,130,246,0.1)",    text: "#93C5FD", dot: "#3B82F6" },
  wild:    { bg: "rgba(139,92,246,0.1)",    text: "#C4B5FD", dot: "#8B5CF6" },
};

const ZONE_COLORS = ["#6B7280","#22C55E","#EAB308","#F97316","#8B5CF6","#EC4899"];

function ZoneCard({ entry }: { entry: ZoneEntry }) {
  const [open, setOpen] = useState(false);
  const sc = STATUS_COLORS[entry.status];
  const zoneColor = ZONE_COLORS[Math.min(entry.zone, 5)];

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 px-4 py-4 min-h-[60px] text-left"
      >
        <span
          className="mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: zoneColor, color: "#fff" }}
        >
          Z{entry.zone}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: TEXT }}>{entry.name}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: sc.bg, color: sc.text }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: sc.dot }}
              />
              {entry.statusLabel}
            </span>
            <span className="text-xs" style={{ color: TEXT_2 }}>{entry.acres}</span>
          </div>
        </div>
        {open ? (
          <ChevronUp size={16} className="shrink-0 mt-1" style={{ color: TEXT_2 }} />
        ) : (
          <ChevronDown size={16} className="shrink-0 mt-1" style={{ color: TEXT_2 }} />
        )}
      </button>

      {open && (
        <div className="px-4 pt-3 pb-4 space-y-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: TEXT_2 }}>Parcels</p>
            <ul className="space-y-1">
              {entry.parcels.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: TEXT }}>
                  <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: zoneColor }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEXT_2 }}>Intention</p>
            <p className="text-sm leading-relaxed" style={{ color: TEXT }}>{entry.intention}</p>
          </div>

          {entry.note && (
            <p className="text-xs italic pt-3 leading-relaxed" style={{ color: TEXT_3, borderTop: `1px solid ${BORDER}` }}>
              {entry.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const SEQUENCE = [
  { label: "Now", detail: "Zone 0 runs without thinking about it. Kitchen clean. Coop maintained." },
  { label: "Next", detail: "Orchard strip + ducks behind the barn. Zone 1 expands into south meadow edge." },
  { label: "Then", detail: "Pavilion / lodge in the back meadow. Community programming. XL gatherings." },
];

export function LandPlanPage() {
  return (
    <div className="min-h-dvh pb-28 px-4 pt-6 max-w-lg mx-auto space-y-6" style={{ backgroundColor: BG }}>
      <div>
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: FONT_DISPLAY, color: TEXT }}
        >
          Parr Land
        </h1>
        <p className="text-sm mt-1" style={{ color: TEXT_2 }}>
          Zone use plan · Wabigoon ON · ~600+ ac owned + Crown access
        </p>
      </div>

      <div className="rounded-xl px-4 py-4 space-y-3" style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}` }}>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TEXT_2 }}>Sequence</p>
        {SEQUENCE.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="mt-0.5 shrink-0 text-xs font-bold rounded-full w-10 text-center py-0.5"
              style={{ backgroundColor: AMBER, color: BG }}
            >
              {s.label}
            </span>
            <p className="text-sm leading-relaxed opacity-90" style={{ color: TEXT }}>{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide px-1" style={{ color: TEXT_2 }}>Zone by Zone</p>
        {ZONES.map((entry, i) => (
          <ZoneCard key={i} entry={entry} />
        ))}
      </div>

      <p className="text-xs text-center pb-2" style={{ color: TEXT_3 }}>
        Last updated May 2026
      </p>
    </div>
  );
}

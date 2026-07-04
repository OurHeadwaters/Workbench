import { useState } from "react";
import { BG, SURFACE, SURFACE_2, BORDER, TEXT, TEXT_2, TEXT_3, AMBER, FONT_DISPLAY } from "@/lib/theme";

type ZoneKey = "Z3" | "Z2" | "Z1" | "gate-z1z2" | "gate-z2z3" | "prohibition";

interface Item {
  id: ZoneKey;
  label: string;
  sublabel: string;
  description: string;
  detail: string;
}

const ITEMS: Item[] = [
  {
    id: "Z3",
    label: "Z3 — Community",
    sublabel: "Outermost zone",
    description:
      "Above-board organisational identity. Public-facing: XRPL wallet addresses, community roles, regulatory handles.",
    detail:
      "Zones are not ranked by importance — they are ranked by privacy exposure. Z3 is the most public layer, not the least important one.",
  },
  {
    id: "Z2",
    label: "Z2 — Workbench",
    sublabel: "Operational / practitioner layer",
    description:
      "Liminal — it has controlled crossings on both sides. Work happens here; attribution flows through it without exposing the person behind it.",
    detail:
      "A practitioner operating in Z2 will naturally brush against both Z1 context (whose work is this?) and Z3 context (what does this produce for the community?). The membrane governs what flows through, not whether the zones touch.",
  },
  {
    id: "Z1",
    label: "Z1 — Circle",
    sublabel: "Private household identity",
    description:
      "The innermost protected layer. Names, passphrases, and personal continuity live here.",
    detail:
      "Z1 is not 'more important' than Z3; it is simply more private and therefore more protected.",
  },
  {
    id: "gate-z1z2",
    label: "Z1–Z2 Gate",
    sublabel: "Household context into work",
    description:
      "Household context may cross inward in controlled form — enough to know whose work this is — but private identity does not travel outward toward Z3.",
    detail:
      "What may cross: a scoped household reference (e.g. household_id) that attributes work to a household without exposing the person behind it. What must not cross outward: name, passphrase, or any field that resolves back to the human identity.",
  },
  {
    id: "gate-z2z3",
    label: "Z2–Z3 Gate",
    sublabel: "Contractor identification at the crossing",
    description:
      "Contractor identification may appear in controlled, auditable form at the crossing, but must not persist as a stored reference inside Z2-scoped records.",
    detail:
      "The giraffe constraint: audit / regulatory visibility across this gate is permitted, but the shape of any audit query must not be composable into a Z3 → Z1 reverse lookup.",
  },
  {
    id: "prohibition",
    label: "Z1 ⟷ Z3 — Absolute Prohibition",
    sublabel: "Architectural absence — no path exists",
    description:
      "This is not a gate. It is an architectural absence — there is no form, controlled or otherwise, in which a Zone 3 identity may connect to a Zone 1 household record.",
    detail:
      "Zone 2 does not dissolve this prohibition. Any path that routes through the Workbench as an intermediate hop to achieve a Z3 → Z1 traversal is equally forbidden. The only permitted direction is Z1 → Z3 (a household voluntarily binding its own wallet, one-way, non-reversible, no reverse lookup).",
  },
];

const ZONE_FILL: Record<string, string> = {
  Z3: "#7C4E8A",
  Z2: "#3B5998",
  Z1: "#4F6E5C",
  "gate-z1z2": "#4F6E5C",
  "gate-z2z3": "#3B5998",
  prohibition: "#B45309",
};

const ZONE_BG: Record<string, string> = {
  Z3: "#F3E8FF",
  Z2: "#DBEAFE",
  Z1: "#D1FAE5",
  "gate-z1z2": "#D1FAE5",
  "gate-z2z3": "#DBEAFE",
  prohibition: "#FEF3C7",
};

export function ZoneDiagramPage() {
  const [active, setActive] = useState<ZoneKey | null>(null);
  const [pinned, setPinned] = useState<ZoneKey | null>(null);

  const focused = pinned ?? active;
  const item = focused ? ITEMS.find((i) => i.id === focused) : null;

  function handleEnter(id: ZoneKey) {
    setActive(id);
  }
  function handleLeave() {
    setActive(null);
  }
  function handleClick(id: ZoneKey) {
    setPinned((prev) => (prev === id ? null : id));
  }

  function isHighlighted(id: ZoneKey) {
    return focused === id;
  }

  const hoverProps = (id: ZoneKey) => ({
    onMouseEnter: () => handleEnter(id),
    onMouseLeave: handleLeave,
    onClick: () => handleClick(id),
    style: { cursor: "pointer" as const },
  });

  return (
    <div
      className="min-h-dvh pb-28"
      style={{ backgroundColor: BG }}
    >
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-serif mb-1" style={{ color: TEXT }}>Zone Diagram</h1>
          <p className="text-sm" style={{ color: TEXT_2 }}>
            Tap or hover a zone, gate, or the prohibition marker to explore the model.
          </p>
        </div>

        {/* Watershed context note */}
        <div 
          className="rounded-xl px-4 py-3 flex items-start gap-3"
          style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
        >
          <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4F6E5C" }} />
          <div className="min-w-0">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest mb-1" style={{ color: "#4F6E5C" }}>
              Full Headwaters Watershed
            </p>
            <p className="text-xs leading-relaxed" style={{ color: TEXT_2 }}>
              This diagram shows the Z1–Z3 privacy model — the core that North Star is built on. In the full 0–5 watershed, these are the inner zones: Lodge (Z1) → Bench (Z2) → Standby (Z3). The outer zones — Saltbox (Z0), The Clearing (Z4), and The Wild (Z5) — live in the neighbourhood map.
            </p>
            <a
              href="/map"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[10px] font-mono font-semibold uppercase tracking-wider hover:opacity-75 transition-opacity"
              style={{ color: "#4F6E5C" }}
            >
              See the full map →
            </a>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
          <svg
            viewBox="0 0 480 400"
            width="100%"
            aria-label="Zones and gates diagram"
            role="img"
          >
            <defs>
              <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#B45309" strokeWidth="1.5" strokeOpacity="0.4" />
              </pattern>
            </defs>

            {/* ── Z3 Community (outermost) ── */}
            <g {...hoverProps("Z3")}>
              <rect
                x="20" y="20" width="440" height="320" rx="28"
                fill={isHighlighted("Z3") ? "#7C4E8A20" : "#7C4E8A08"}
                stroke={isHighlighted("Z3") ? "#7C4E8A" : "#7C4E8A66"}
                strokeWidth={isHighlighted("Z3") ? 2.5 : 1.5}
                style={{ transition: "all 0.15s" }}
              />
              <text x="240" y="50" textAnchor="middle" fontSize="13" fontWeight="600" fill="#7C4E8A" opacity="0.85">
                Z3 — Community
              </text>
              <text x="240" y="67" textAnchor="middle" fontSize="10.5" fill="#7C4E8A" opacity="0.6">
                public identity · XRPL wallet · community roles
              </text>
            </g>

            {/* ── Z2 Workbench (middle) ── */}
            <g {...hoverProps("Z2")}>
              <rect
                x="80" y="95" width="320" height="220" rx="20"
                fill={isHighlighted("Z2") ? "#3B599820" : "#3B599808"}
                stroke={isHighlighted("Z2") ? "#3B5998" : "#3B599866"}
                strokeWidth={isHighlighted("Z2") ? 2.5 : 1.5}
              />
              <text x="240" y="120" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#3B5998" opacity="0.85">
                Z2 — Workbench
              </text>
              <text x="240" y="136" textAnchor="middle" fontSize="10" fill="#3B5998" opacity="0.6">
                operational · practitioner layer
              </text>
            </g>

            {/* ── Z1 Circle (innermost) ── */}
            <g {...hoverProps("Z1")}>
              <rect
                x="152" y="160" width="176" height="132" rx="16"
                fill={isHighlighted("Z1") ? "#4F6E5C20" : "#4F6E5C08"}
                stroke={isHighlighted("Z1") ? "#4F6E5C" : "#4F6E5C66"}
                strokeWidth={isHighlighted("Z1") ? 2.5 : 1.5}
              />
              <text x="240" y="218" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#4F6E5C" opacity="0.9">
                Z1 — Circle
              </text>
              <text x="240" y="234" textAnchor="middle" fontSize="10" fill="#4F6E5C" opacity="0.6">
                private household identity
              </text>
              <text x="240" y="248" textAnchor="middle" fontSize="9.5" fill="#4F6E5C" opacity="0.5">
                names · passphrases · continuity
              </text>
            </g>

            {/* ── Z1–Z2 Gate (overlap between Z1 top edge and Z2) ── */}
            <g {...hoverProps("gate-z1z2")}>
              <rect
                x="190" y="150" width="100" height="26" rx="13"
                fill={isHighlighted("gate-z1z2") ? "#4F6E5C" : "#4F6E5Ccc"}
                opacity={isHighlighted("gate-z1z2") ? 1 : 0.82}
              />
              <text x="240" y="167" textAnchor="middle" fontSize="10" fontWeight="700" fill={TEXT} letterSpacing="0.3">
                Z1–Z2 Gate
              </text>
            </g>

            {/* ── Z2–Z3 Gate (overlap between Z2 top edge and Z3) ── */}
            <g {...hoverProps("gate-z2z3")}>
              <rect
                x="190" y="82" width="100" height="26" rx="13"
                fill={isHighlighted("gate-z2z3") ? "#3B5998" : "#3B5998cc"}
                opacity={isHighlighted("gate-z2z3") ? 1 : 0.82}
              />
              <text x="240" y="99" textAnchor="middle" fontSize="10" fontWeight="700" fill={TEXT} letterSpacing="0.3">
                Z2–Z3 Gate
              </text>
            </g>

            {/* ── Z1–Z3 Prohibition (bottom of Z3, outside Z2) ── */}
            <g {...hoverProps("prohibition")}>
              {/* Background pill */}
              <rect
                x="52" y="350" width="376" height="34" rx="17"
                fill={isHighlighted("prohibition") ? "#B4530920" : "#B4530908"}
                stroke={isHighlighted("prohibition") ? "#B45309" : "#B4530966"}
                strokeWidth={isHighlighted("prohibition") ? 2 : 1.5}
                strokeDasharray="5 3"
              />
              {/* Hatch inside pill */}
              <rect x="52" y="350" width="376" height="34" rx="17" fill="url(#hatch)" opacity="0.35" />
              {/* Z1 label */}
              <text x="95" y="372" textAnchor="middle" fontSize="11" fontWeight="700" fill="#B45309">Z1</text>
              {/* Arrow left */}
              <line x1="112" y1="367" x2="174" y2="367" stroke="#B45309" strokeWidth="1.5" strokeDasharray="4 3" />
              <polygon points="174,363 182,367 174,371" fill="#B45309" opacity="0.7" />
              {/* ✗ in middle */}
              <text x="240" y="372" textAnchor="middle" fontSize="14" fontWeight="900" fill="#B45309">✕</text>
              {/* Arrow right */}
              <line x1="306" y1="367" x2="368" y2="367" stroke="#B45309" strokeWidth="1.5" strokeDasharray="4 3" />
              <polygon points="298,363 306,367 298,371" fill="#B45309" opacity="0.7" />
              {/* Z3 label */}
              <text x="385" y="372" textAnchor="middle" fontSize="11" fontWeight="700" fill="#B45309">Z3</text>
            </g>

            {/* Prohibition caption */}
            <text x="240" y="398" textAnchor="middle" fontSize="9" fill="#B45309" opacity="0.7">
              No gate · No path · Architectural absence
            </text>
          </svg>
        </div>

        {/* ── Description panel ── */}
        {item ? (
          <div
            className="rounded-2xl border p-4 space-y-2 transition-all duration-200"
            style={{
              background: SURFACE,
              borderColor: ZONE_FILL[item.id] ?? BORDER,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: ZONE_FILL[item.id] }}
                >
                  {item.label}
                </p>
                <p className="text-xs" style={{ color: TEXT_3 }}>{item.sublabel}</p>
              </div>
              {pinned === item.id && (
                <button
                  onClick={() => setPinned(null)}
                  className="shrink-0 text-xs border rounded-lg px-2 py-1 transition-colors"
                  style={{ backgroundColor: SURFACE_2, borderColor: BORDER, color: TEXT_2 }}
                >
                  Close
                </button>
              )}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: TEXT }}>{item.description}</p>
            <p className="text-xs leading-relaxed border-t pt-2" style={{ color: TEXT_2, borderTopColor: BORDER }}>
              {item.detail}
            </p>
          </div>
        ) : (
          <div 
            className="rounded-2xl border border-dashed p-4 text-center text-sm"
            style={{ borderColor: BORDER, color: TEXT_3 }}
          >
            Tap a zone, gate, or the prohibition bar to read its description.
          </div>
        )}

        {/* ── Legend ── */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: TEXT_3 }}>Legend</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { color: "#7C4E8A", label: "Z3 Community", sub: "Outermost — public" },
              { color: "#3B5998", label: "Z2 Workbench", sub: "Middle — operational" },
              { color: "#4F6E5C", label: "Z1 Circle", sub: "Innermost — private" },
              { color: "#B45309", label: "Z1↔Z3 Prohibition", sub: "No path exists" },
            ].map(({ color, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{ background: SURFACE, borderColor: color + "44" }}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                <div>
                  <p className="text-xs font-medium" style={{ color }}>{label}</p>
                  <p className="text-[10px]" style={{ color: TEXT_3 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

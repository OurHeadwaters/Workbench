/**
 * ZoneGate — visible, named gate crossing markers for the Z1–Z2 and Z2–Z3 boundaries.
 *
 * Implementation source: docs/zones-gates-reference.md
 * § "What a Gate Looks Like in Practice"
 *
 * A gate is not a wall. It is a protective, functional material positioned at the
 * overlap between two zones. Gates are always visible — you always know when you
 * are crossing one (a consent step, a role switch, a session context change, a
 * credential presented at the crossing).
 *
 * This component renders that visible moment inside the constellation picker:
 *   Z1→Z2: "A session context change that establishes 'I am now working as a practitioner'"
 *   Z2→Z3: "A credential presented at the crossing but not stored inside the operational record"
 */

interface ZoneGateProps {
  crossing: "Z1→Z2" | "Z2→Z3";
}

const GATE_COPY: Record<
  ZoneGateProps["crossing"],
  { label: string; subtitle: string; accent: string; pip: string }
> = {
  "Z1→Z2": {
    label: "Z1 → Z2  ·  Entering the Workbench",
    subtitle:
      "Work below is attributed to your household. Your private identity stays in Z1.",
    accent: "#3B5998",
    pip: "#4F6E5C",
  },
  "Z2→Z3": {
    label: "Z2 → Z3  ·  Community Crossing",
    subtitle:
      "Z3 identifiers may appear at this crossing but are not stored inside Z2 records.",
    accent: "#7C4E8A",
    pip: "#3B5998",
  },
};

export function ZoneGate({ crossing }: ZoneGateProps) {
  const { label, subtitle, accent, pip } = GATE_COPY[crossing];

  return (
    <div
      className="relative flex flex-col items-center gap-1 py-2 select-none"
      aria-label={`Gate crossing: ${crossing}`}
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex-1 h-px" style={{ background: `${accent}28` }} />

        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1 border"
          style={{
            borderColor: `${accent}30`,
            background: `${accent}0A`,
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: pip }}
          />
          <span
            className="text-[11px] font-medium tracking-wide"
            style={{ color: accent }}
          >
            {label}
          </span>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: accent }}
          />
        </div>

        <div className="flex-1 h-px" style={{ background: `${accent}28` }} />
      </div>

      <p className="text-[10px] text-center max-w-[260px]" style={{ color: `${accent}99` }}>
        {subtitle}
      </p>
    </div>
  );
}

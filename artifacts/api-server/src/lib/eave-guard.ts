// ─────────────────────────────────────────────────────────────────────────────
// Eave Guard — Capital Conversion Gate Principle
//
// The Eave is the protective overhang between Zone 0/1 (household + mutual aid)
// and Zone 2+ (operational / contracted / financial layer).
//
// Moving capital upward through the zone model is not forbidden — but it
// requires an explicit gate decision: ceremony, not market mechanism.
//
// See also: gatekeeper.ts (translation authority between Bright Side and Systems)
// See also: types.ts (Eave Rule — Z1–Z3 absolute prohibition, Z2–Z3 gate)
// ─────────────────────────────────────────────────────────────────────────────

export const CAPITAL_CONVERSION_GATE_PRINCIPLE = `
Capital Conversion Gate Principle

You cannot convert capital from a lower zone into a higher zone without an explicit gate decision — ceremony, not just market mechanism.

Rooted in the 8 Forms of Capital.
Social capital lives in Zone 1 (The Eave). Financial capital lives in Zone 3+.
The Eave Rule is the architectural enforcement of this gate.

Ramsey Corollary: Build the gate so you can cross intentionally.
`;

// ─── Zone numbers used by the guard ──────────────────────────────────────────
//   0  Saltbox   — Household / hearth
//   1  Lodge     — Mutual aid / social capital
//   2  Bench     — Operational / practitioner layer
//   3  Standby   — Community / co-op / financial capital
//   4  Territory — Land / long-horizon stewardship
//   5  Wild Edge — Public / horizon presence

export type ZoneNumber = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Returns true when capital is moving from a lower zone (closer to household)
 * to a higher zone (closer to community/market).
 *
 * Any truthy result means CAPITAL_CONVERSION_GATE_PRINCIPLE must be respected:
 * the crossing requires an explicit, recorded gate decision.
 */
export function crossingLowerToHigherZone(
  from: ZoneNumber,
  to: ZoneNumber,
): boolean {
  return to > from;
}

// ─── Named gate seams ────────────────────────────────────────────────────────
//
// g_z0_z1  The Eave Overhang   — social capital originates here (Z0 → Z1)
// g_z1_z2  The Workbench Gate  — financial conversion must pass a gate (Z1 → Z2)
// g_z2_z3  The Standby Seam    — Z1–Z3 absolute prohibition; Z2–Z3 auditable gate
//
// The g_z0_z1 and g_z1_z2 keys are the canonical crossing-gate definitions.
// The hard constraint lives in types.ts: no direct Z3 → Z1 reverse lookup,
// ever, through any intermediate hop.

export interface GateSeam {
  key: string;
  name: string;
  from: ZoneNumber;
  to: ZoneNumber;
  desc: string;
  /** If true, no crossing is permitted under any circumstances. */
  absolute: boolean;
}

export const GATE_SEAMS: Record<string, GateSeam> = {
  g_z0_z1: {
    key: "g_z0_z1",
    name: "The Eave Overhang",
    from: 0,
    to: 1,
    desc: "Household (Z0) to Mutual Aid (Z1). Social capital originates here. Any crossing requires explicit consent and ceremony.",
    absolute: false,
  },
  g_z1_z2: {
    key: "g_z1_z2",
    name: "The Workbench Gate",
    from: 1,
    to: 2,
    desc: "Moving from social/experiential capital (Z1) into operational/contracted work (Z2). Conversion to financial capital beyond this point must pass a conscious gate decision.",
    absolute: false,
  },
  g_z1_z3: {
    key: "g_z1_z3",
    name: "The Absolute Prohibition",
    from: 1,
    to: 3,
    desc: "No direct or composable path may ever connect a Zone 3 wallet address, derived identifier, zone-bind payload, or zone-bind signature to any Zone 1 household record — including any path that traverses Zone 2 as an intermediate hop.",
    absolute: true,
  },
};

/**
 * Throws if the proposed crossing violates an absolute gate prohibition.
 * Call this at any code path that would link a Z3 identity into a Z1 record.
 */
export function assertGateAllowed(from: ZoneNumber, to: ZoneNumber): void {
  for (const seam of Object.values(GATE_SEAMS)) {
    if (seam.absolute && seam.from === from && seam.to === to) {
      throw new Error(
        `[eave-guard] Absolute gate violation: ${seam.name} (Z${from} → Z${to}). ` +
          `${CAPITAL_CONVERSION_GATE_PRINCIPLE.trim()}`,
      );
    }
  }
}

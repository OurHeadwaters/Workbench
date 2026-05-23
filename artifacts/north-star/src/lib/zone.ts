import { useStore } from "@/store";
import type { ZoneId } from "@/types";

export const ZONE_SOLID: Record<ZoneId, string> = {
  Z0: "#8A6A1A",
  Z1: "#4F6E5C",
  Z2: "#3B5998",
  Z3: "#7C4E8A",
  Z4: "#B45309",
  Z5: "#4A6272",
};

export const ZONE_WASH: Record<ZoneId, string> = {
  Z0: "rgba(138,106,26,0.06)",
  Z1: "rgba(79,110,92,0.06)",
  Z2: "rgba(59,89,152,0.06)",
  Z3: "rgba(124,78,138,0.06)",
  Z4: "rgba(180,83,9,0.06)",
  Z5: "rgba(74,98,114,0.06)",
};

export const ZONE_GLOW: Record<ZoneId, string> = {
  Z0: "rgba(138,106,26,0.18)",
  Z1: "rgba(79,110,92,0.18)",
  Z2: "rgba(59,89,152,0.18)",
  Z3: "rgba(124,78,138,0.18)",
  Z4: "rgba(180,83,9,0.18)",
  Z5: "rgba(74,98,114,0.18)",
};

export function useActiveZone(): ZoneId {
  const getTodayPick = useStore((s) => s.getTodayPick);
  const constellations = useStore((s) => s.constellations);
  const pick = getTodayPick();
  if (!pick.constellationIds.length) return "Z2";
  const counts: Partial<Record<ZoneId, number>> = {};
  for (const id of pick.constellationIds) {
    const c = constellations.find((co) => co.id === id);
    if (c) counts[c.zone] = (counts[c.zone] ?? 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => (b[1] as number) - (a[1] as number))[0];
  return (top?.[0] as ZoneId) ?? "Z2";
}

import { createContext, createElement, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { constellation } from "@workspace/codetry-handbook/data/constellation";

// Zone colors are visual-only and not carried in the constellation snapshot.
const ZONE_COLORS: Record<number, string> = {
  0: "#7A4E2D",
  1: "#1f3d2e",
  2: "#1A5FA8",
  3: "#3D4A5C",
  4: "#0F766E",
  5: "#5B3E8C",
};

export type ZoneEntry = {
  number: number;
  name: string;
  color: string;
};

export type ZoneOverride = {
  name?: string;
  standby?: boolean;
};

export type ZoneStoreValue = {
  standby: boolean;
  zoneOverrides?: Partial<Record<number, ZoneOverride>>;
};

const DEFAULT_STORE: ZoneStoreValue = { standby: false };

export const ZoneStoreContext = createContext<ZoneStoreValue>(DEFAULT_STORE);

export function ZoneStoreProvider({
  children,
  standby = false,
  zoneOverrides,
}: {
  children: ReactNode;
  standby?: boolean;
  zoneOverrides?: Partial<Record<number, ZoneOverride>>;
}) {
  const value = useMemo(
    () => ({ standby, zoneOverrides }),
    [standby, zoneOverrides],
  );
  return createElement(ZoneStoreContext.Provider, { value }, children);
}

export type ResolvedZone = ZoneEntry & { standby: boolean };

export function useZone(zoneId: number): ResolvedZone {
  const store = useContext(ZoneStoreContext);
  return useMemo(() => {
    const base = ZONE_REGISTRY[zoneId] ?? {
      number: zoneId,
      name: `Zone ${zoneId}`,
      color: "#1f3d2e",
    };
    const override = store.zoneOverrides?.[zoneId];
    return {
      ...base,
      name: override?.name ?? base.name,
      standby: override?.standby ?? store.standby,
    };
  }, [zoneId, store]);
}

// ZONE_REGISTRY is derived from the constellation snapshot at module load time.
// Zone names and numbers always reflect the canonical source — update
// constellation.ts (or run the sync-constellation script) and every badge
// picks up the change automatically on next build/reload.
export const ZONE_REGISTRY: Record<number, ZoneEntry> = Object.fromEntries(
  constellation.zones.map((z) => [
    z.zone,
    {
      number: z.zone,
      name: z.name,
      color: ZONE_COLORS[z.zone] ?? "#1f3d2e",
    },
  ]),
);

export { NeighbourhoodBadge } from "./NeighbourhoodBadge";

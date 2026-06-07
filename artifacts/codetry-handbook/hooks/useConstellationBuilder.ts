import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const KEY = "codetry-handbook:constellation-builder:v1:manifest";

export const ZONE_GUIDES = [
  {
    zone: 0,
    label: "Zone 0",
    hint: "The household — what you come home to and draw from daily",
    example: "e.g. Saltbox, The Kitchen, Home Base",
  },
  {
    zone: 1,
    label: "Zone 1",
    hint: "The zone of craft, skill, and making — what you build with your hands",
    example: "e.g. The Workbench, The Studio, The Shed",
  },
  {
    zone: 2,
    label: "Zone 2",
    hint: "The operating practice — how your work is named and structured",
    example: "e.g. Headwaters, The Practice, The Operating Plan",
  },
  {
    zone: 3,
    label: "Zone 3",
    hint: "The exchange layer — how your work reaches others commercially",
    example: "e.g. The Co-op, The Market Table, The Distribution Layer",
  },
  {
    zone: 4,
    label: "Zone 4",
    hint: "The territory — the community and land your practice serves",
    example: "e.g. The Territory, The Region, The Riding",
  },
  {
    zone: 5,
    label: "Zone 5",
    hint: "The wild edge — the primary sourcing layer beyond the built world",
    example: "e.g. Edge, The Land, The Harvest Layer",
  },
];

export type ZoneEntry = {
  zone: number;
  name: string;
  domain: string;
  vocabulary: string;
};

export type ConstellationManifest = {
  practitionerName: string;
  practiceName: string;
  zones: ZoneEntry[];
};

function defaultManifest(): ConstellationManifest {
  return {
    practitionerName: "",
    practiceName: "",
    zones: ZONE_GUIDES.map(({ zone }) => ({
      zone,
      name: "",
      domain: "",
      vocabulary: "",
    })),
  };
}

export function useConstellationBuilder() {
  const [ready, setReady] = useState(false);
  const [manifest, setManifest] = useState<ConstellationManifest>(
    defaultManifest(),
  );

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const base = defaultManifest();
          base.practitionerName = parsed.practitionerName ?? "";
          base.practiceName = parsed.practiceName ?? "";
          base.zones = base.zones.map((z) => {
            const saved = (parsed.zones ?? []).find(
              (s: ZoneEntry) => s.zone === z.zone,
            );
            return saved ? { ...z, ...saved } : z;
          });
          setManifest(base);
        } catch {}
      }
      setReady(true);
    });
  }, []);

  const saveManifest = useCallback(
    async (updated: ConstellationManifest) => {
      setManifest(updated);
      await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    },
    [],
  );

  const updateField = useCallback(
    async (field: "practitionerName" | "practiceName", value: string) => {
      const updated = { ...manifest, [field]: value };
      await saveManifest(updated);
    },
    [manifest, saveManifest],
  );

  const updateZone = useCallback(
    async (zone: number, updates: Partial<ZoneEntry>) => {
      const zones = manifest.zones.map((z) =>
        z.zone === zone ? { ...z, ...updates } : z,
      );
      await saveManifest({ ...manifest, zones });
    },
    [manifest, saveManifest],
  );

  return { ready, manifest, updateField, updateZone };
}

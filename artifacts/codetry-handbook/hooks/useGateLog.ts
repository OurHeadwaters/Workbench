import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const KEY = "codetry-handbook:gate-log:v1:entries";

export type GateEntry = {
  id: string;
  brightSide: string;
  massity: string;
  context: string;
  createdAt: string;
};

export function useGateLog() {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<GateEntry[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) {
        try {
          setEntries(JSON.parse(raw));
        } catch {}
      }
      setReady(true);
    });
  }, []);

  const persist = useCallback(async (updated: GateEntry[]) => {
    setEntries(updated);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  }, []);

  const addEntry = useCallback(
    async (entry: Omit<GateEntry, "id" | "createdAt">) => {
      const newEntry: GateEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      await persist([newEntry, ...entries]);
      return newEntry;
    },
    [entries, persist],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      await persist(entries.filter((e) => e.id !== id));
    },
    [entries, persist],
  );

  return { ready, entries, addEntry, deleteEntry };
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const KEY = "codetry-handbook:rename-test:v1:tests";

export type RenameVerdict = "load-bearing" | "decorative" | "unclear";

export type RenameAlternative = {
  text: string;
  whatWasLost: string;
};

export type RenameTest = {
  id: string;
  name: string;
  description: string;
  alternatives: RenameAlternative[];
  verdict: RenameVerdict;
  savedAt: string;
};

export function useRenameTest() {
  const [ready, setReady] = useState(false);
  const [tests, setTests] = useState<RenameTest[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) {
        try {
          setTests(JSON.parse(raw));
        } catch {}
      }
      setReady(true);
    });
  }, []);

  const persist = useCallback(async (updated: RenameTest[]) => {
    setTests(updated);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  }, []);

  const addTest = useCallback(
    async (test: Omit<RenameTest, "id" | "savedAt">) => {
      const entry: RenameTest = {
        ...test,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
      };
      await persist([entry, ...tests]);
      return entry;
    },
    [tests, persist],
  );

  const deleteTest = useCallback(
    async (id: string) => {
      await persist(tests.filter((t) => t.id !== id));
    },
    [tests, persist],
  );

  return { ready, tests, addTest, deleteTest };
}

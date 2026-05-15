import { useState, useCallback, useEffect } from "react";

export const FLAG_PREFIX = "pgv2.flagged.";

export interface FlagEntry {
  sectionId: string;
  label: string;
  flaggedAt: string;
  note?: string;
}

export function readAllFlags(): FlagEntry[] {
  if (typeof window === "undefined") return [];
  const entries: FlagEntry[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(FLAG_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as FlagEntry;
      entries.push(parsed);
    } catch {
      // ignore malformed entries
    }
  }
  entries.sort(
    (a, b) => new Date(b.flaggedAt).getTime() - new Date(a.flaggedAt).getTime(),
  );
  return entries;
}

export function useSectionFlag(sectionId: string, label: string) {
  const storageKey = FLAG_PREFIX + sectionId;

  const [flagged, setFlaggedState] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(storageKey);
    } catch {
      return false;
    }
  });

  const setFlagged = useCallback(
    (note?: string) => {
      const entry: FlagEntry = {
        sectionId,
        label,
        flaggedAt: new Date().toISOString(),
        ...(note?.trim() ? { note: note.trim() } : {}),
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(entry));
        window.dispatchEvent(new StorageEvent("storage", { key: storageKey }));
      } catch {
        // ignore
      }
      setFlaggedState(true);
    },
    [storageKey, sectionId, label],
  );

  const clearFlag = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      window.dispatchEvent(new StorageEvent("storage", { key: storageKey }));
    } catch {
      // ignore
    }
    setFlaggedState(false);
  }, [storageKey]);

  const toggleFlag = useCallback(() => {
    if (flagged) {
      clearFlag();
    } else {
      setFlagged();
    }
  }, [flagged, setFlagged, clearFlag]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === storageKey) {
        setFlaggedState(!!localStorage.getItem(storageKey));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  return { flagged, setFlagged, clearFlag, toggleFlag };
}

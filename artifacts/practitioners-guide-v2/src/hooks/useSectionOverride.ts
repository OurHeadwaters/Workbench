import { useState, useCallback } from "react";

const KEY_PREFIX = "pgv2.override.";

export function useSectionOverride(sectionId: string) {
  const storageKey = KEY_PREFIX + sectionId;

  const [override, setOverrideState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  });

  const setOverride = useCallback(
    (text: string) => {
      try {
        localStorage.setItem(storageKey, text);
      } catch {
        // ignore
      }
      setOverrideState(text);
    },
    [storageKey],
  );

  const clearOverride = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setOverrideState(null);
  }, [storageKey]);

  return { override, setOverride, clearOverride };
}

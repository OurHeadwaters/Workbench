import { useState, useCallback, useEffect } from "react";

const KEY_PREFIX = "pgv2.override.";
const API_BASE = "/api/pgv2/overrides";

// Module-level cache so all hook instances share one fetch.
let serverOverrides: Record<string, string> | null = null;
let fetchPromise: Promise<Record<string, string>> | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function getServerOverrides(): Promise<Record<string, string>> {
  if (serverOverrides !== null) return Promise.resolve(serverOverrides);
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch(API_BASE)
    .then((r) => {
      if (!r.ok) throw new Error("fetch failed");
      return r.json() as Promise<Record<string, string>>;
    })
    .then((data) => {
      serverOverrides = data;
      notifyListeners();
      return data;
    })
    .catch(() => {
      fetchPromise = null;
      return {} as Record<string, string>;
    });
  return fetchPromise;
}

export function useSectionOverride(sectionId: string) {
  const storageKey = KEY_PREFIX + sectionId;

  // Seed from localStorage immediately so there's no flash on first load.
  const [override, setOverrideState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  });

  // Once the server cache is ready, let the server value win.
  useEffect(() => {
    let active = true;

    function applyServerValue() {
      if (!active || serverOverrides === null) return;
      const serverVal = serverOverrides[sectionId] ?? null;
      // Keep state in sync; also update localStorage so offline reads are fresh.
      if (serverVal !== null) {
        try {
          localStorage.setItem(storageKey, serverVal);
        } catch {
          // ignore
        }
        setOverrideState(serverVal);
      } else {
        // Server has no override — clear any stale localStorage entry.
        try {
          localStorage.removeItem(storageKey);
        } catch {
          // ignore
        }
        setOverrideState(null);
      }
    }

    if (serverOverrides !== null) {
      applyServerValue();
    } else {
      listeners.add(applyServerValue);
      void getServerOverrides();
    }

    return () => {
      active = false;
      listeners.delete(applyServerValue);
    };
  }, [sectionId, storageKey]);

  const setOverride = useCallback(
    (text: string) => {
      // Update localStorage and local state immediately for responsiveness.
      try {
        localStorage.setItem(storageKey, text);
      } catch {
        // ignore
      }
      setOverrideState(text);

      // Persist to server.
      if (serverOverrides !== null) {
        serverOverrides[sectionId] = text;
      }
      void fetch(`${API_BASE}/${encodeURIComponent(sectionId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      }).catch(() => {
        // Server write failed — localStorage still has the value as a fallback.
      });
    },
    [sectionId, storageKey],
  );

  const clearOverride = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setOverrideState(null);

    // Clear on server.
    if (serverOverrides !== null) {
      delete serverOverrides[sectionId];
    }
    void fetch(`${API_BASE}/${encodeURIComponent(sectionId)}`, {
      method: "DELETE",
    }).catch(() => {
      // ignore
    });
  }, [sectionId, storageKey]);

  return { override, setOverride, clearOverride };
}

// Persistent store for Shared Vision sessions. Writes go through the
// instrumented `storage` wrapper so the chrome's SyncStatusPill reflects
// them and the failure / ambient-failure rails can surface stalls.
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  clearAmbientFailure,
  clearFailure,
  recordAmbientFailure,
  recordFailure,
} from "@/lib/saveStatus";
import { storage } from "@/lib/storage";
import type { SharedVisionSession } from "./types";

const KEY = "codetry-handbook:v1:sharedVision:sessions";
const OP_ID = "sharedVision:sessions";

type StoreCtx = {
  ready: boolean;
  sessions: SharedVisionSession[];
  getSession: (id: string) => SharedVisionSession | undefined;
  createSession: () => SharedVisionSession;
  updateSession: (
    id: string,
    update:
      | Partial<SharedVisionSession>
      | ((prev: SharedVisionSession) => Partial<SharedVisionSession>),
  ) => void;
  renameSession: (id: string, name: string) => void;
  deleteSession: (id: string) => void;
  markHandedOff: (id: string) => void;
};

const SharedVisionContext = createContext<StoreCtx | null>(null);

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function newSession(): SharedVisionSession {
  const now = Date.now();
  return {
    id: makeId(),
    createdAt: now,
    updatedAt: now,
    metaphorId: null,
    answers: {},
  };
}

export function SharedVisionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [sessions, setSessions] = useState<SharedVisionSession[]>([]);
  const sessionsRef = useRef<SharedVisionSession[]>([]);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (cancelled) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const valid = (parsed as unknown[]).filter(
                (v): v is SharedVisionSession =>
                  !!v &&
                  typeof v === "object" &&
                  typeof (v as SharedVisionSession).id === "string",
              );
              setSessions(valid);
              sessionsRef.current = valid;
            }
          } catch {
            // Corrupt blob: start fresh.
          }
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, []);

  // Debounced write so per-keystroke edits coalesce. Uses both ambient
  // and per-op failure channels so the chrome can surface stalls.
  const flush = useCallback(async () => {
    const snapshot = sessionsRef.current;
    try {
      await storage.setItem(KEY, JSON.stringify(snapshot));
      clearFailure(OP_ID);
      clearAmbientFailure(OP_ID);
    } catch {
      recordAmbientFailure({
        id: OP_ID,
        message: "Your shared-vision draft isn't saving right now.",
      });
      recordFailure({
        id: OP_ID,
        label: "your shared-vision draft",
        retry: () => flush(),
      });
    }
  }, []);

  const scheduleWrite = useCallback(() => {
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      writeTimer.current = null;
      void flush();
    }, 250);
  }, [flush]);

  const commit = useCallback(
    (next: SharedVisionSession[]) => {
      sessionsRef.current = next;
      setSessions(next);
      scheduleWrite();
    },
    [scheduleWrite],
  );

  const getSession = useCallback(
    (id: string) => sessionsRef.current.find((s) => s.id === id),
    [],
  );

  const createSession = useCallback(() => {
    const fresh = newSession();
    commit([fresh, ...sessionsRef.current]);
    return fresh;
  }, [commit]);

  const updateSession = useCallback<StoreCtx["updateSession"]>(
    (id, update) => {
      const idx = sessionsRef.current.findIndex((s) => s.id === id);
      if (idx === -1) return;
      const prev = sessionsRef.current[idx];
      const patch = typeof update === "function" ? update(prev) : update;
      const merged: SharedVisionSession = {
        ...prev,
        ...patch,
        id: prev.id,
        createdAt: prev.createdAt,
        updatedAt: Date.now(),
        answers:
          patch.answers !== undefined
            ? { ...prev.answers, ...patch.answers }
            : prev.answers,
      };
      const next = sessionsRef.current.slice();
      next[idx] = merged;
      commit(next);
    },
    [commit],
  );

  const renameSession = useCallback(
    (id: string, name: string) => {
      updateSession(id, { name: name.trim() || undefined });
    },
    [updateSession],
  );

  const deleteSession = useCallback(
    (id: string) => {
      commit(sessionsRef.current.filter((s) => s.id !== id));
    },
    [commit],
  );

  const markHandedOff = useCallback(
    (id: string) => {
      updateSession(id, { handedOffAt: Date.now() });
    },
    [updateSession],
  );

  const value = useMemo<StoreCtx>(
    () => ({
      ready,
      sessions,
      getSession,
      createSession,
      updateSession,
      renameSession,
      deleteSession,
      markHandedOff,
    }),
    [
      ready,
      sessions,
      getSession,
      createSession,
      updateSession,
      renameSession,
      deleteSession,
      markHandedOff,
    ],
  );

  return (
    <SharedVisionContext.Provider value={value}>
      {children}
    </SharedVisionContext.Provider>
  );
}

export function useSharedVision(): StoreCtx {
  const ctx = useContext(SharedVisionContext);
  if (!ctx)
    throw new Error("useSharedVision must be used inside SharedVisionProvider");
  return ctx;
}

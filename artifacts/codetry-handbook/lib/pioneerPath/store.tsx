// Persistent local store for The Pioneer Path.
//
// Records, per station:
//   - completedAt: epoch ms when the reader marked the action done
//   - note?: optional free-text the reader wrote when marking done
//   - photoUri?: optional camera-roll URI the reader attached
// Plus a flat audioPositions map keyed by station id so the audio
// player can resume where the reader left off.
//
// Local-only on purpose. v1 does not sync, share, or report progress
// anywhere — the Path is the reader's own walk.

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { storage } from "@/lib/storage";
import { PIONEER_STATIONS } from "@/data/pioneerPath";

const KEY = "codetry-handbook:v1:pioneer-path";

export type PioneerCompletion = {
  completedAt: number;
  note?: string;
  photoUri?: string;
};

export type PioneerProgress = {
  completed: Record<string, PioneerCompletion>;
  audioPositions: Record<string, number>;
};

const DEFAULT_PROGRESS: PioneerProgress = {
  completed: {},
  audioPositions: {},
};

type StoreCtx = {
  ready: boolean;
  progress: PioneerProgress;
  isCompleted: (stationId: string) => boolean;
  isUnlocked: (stationId: string) => boolean;
  markDone: (
    stationId: string,
    extras?: { note?: string; photoUri?: string },
  ) => void;
  unmark: (stationId: string) => void;
  saveAudioPosition: (stationId: string, seconds: number) => void;
  getAudioPosition: (stationId: string) => number;
};

const PioneerCtx = createContext<StoreCtx | null>(null);

function parseProgress(raw: string | null): PioneerProgress {
  if (!raw) return DEFAULT_PROGRESS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PROGRESS;
    const p = parsed as Partial<PioneerProgress>;
    return {
      completed:
        p.completed && typeof p.completed === "object" ? p.completed : {},
      audioPositions:
        p.audioPositions && typeof p.audioPositions === "object"
          ? p.audioPositions
          : {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function PioneerPathProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<PioneerProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (cancelled) return;
        setProgress(parseProgress(raw));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: PioneerProgress) => {
    setProgress(next);
    storage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const isCompleted = useCallback(
    (stationId: string) => Boolean(progress.completed[stationId]),
    [progress.completed],
  );

  // The first station is always unlocked; subsequent stations unlock
  // only when the previous station has been marked done.
  const isUnlocked = useCallback(
    (stationId: string) => {
      const idx = PIONEER_STATIONS.findIndex((s) => s.id === stationId);
      if (idx <= 0) return true;
      const prev = PIONEER_STATIONS[idx - 1];
      return Boolean(progress.completed[prev.id]);
    },
    [progress.completed],
  );

  const markDone = useCallback(
    (stationId: string, extras?: { note?: string; photoUri?: string }) => {
      const prev = progress.completed[stationId];
      const next: PioneerProgress = {
        ...progress,
        completed: {
          ...progress.completed,
          [stationId]: {
            completedAt: prev?.completedAt ?? Date.now(),
            ...(extras?.note !== undefined ? { note: extras.note } : prev?.note ? { note: prev.note } : {}),
            ...(extras?.photoUri !== undefined
              ? { photoUri: extras.photoUri }
              : prev?.photoUri
                ? { photoUri: prev.photoUri }
                : {}),
          },
        },
      };
      persist(next);
    },
    [persist, progress],
  );

  const unmark = useCallback(
    (stationId: string) => {
      const nextCompleted = { ...progress.completed };
      delete nextCompleted[stationId];
      persist({ ...progress, completed: nextCompleted });
    },
    [persist, progress],
  );

  const saveAudioPosition = useCallback(
    (stationId: string, seconds: number) => {
      // Throttle: only persist if the new position differs by >= 4s
      // from the previously stored one. Avoids hammering AsyncStorage
      // while the audio scrubs.
      const prev = progress.audioPositions[stationId] ?? 0;
      if (Math.abs(seconds - prev) < 4 && seconds > 0) return;
      persist({
        ...progress,
        audioPositions: {
          ...progress.audioPositions,
          [stationId]: Math.max(0, Math.floor(seconds)),
        },
      });
    },
    [persist, progress],
  );

  const getAudioPosition = useCallback(
    (stationId: string) => progress.audioPositions[stationId] ?? 0,
    [progress.audioPositions],
  );

  const value = useMemo<StoreCtx>(
    () => ({
      ready,
      progress,
      isCompleted,
      isUnlocked,
      markDone,
      unmark,
      saveAudioPosition,
      getAudioPosition,
    }),
    [
      ready,
      progress,
      isCompleted,
      isUnlocked,
      markDone,
      unmark,
      saveAudioPosition,
      getAudioPosition,
    ],
  );

  return <PioneerCtx.Provider value={value}>{children}</PioneerCtx.Provider>;
}

export function usePioneerPath(): StoreCtx {
  const ctx = useContext(PioneerCtx);
  if (!ctx) {
    throw new Error("usePioneerPath must be used inside PioneerPathProvider");
  }
  return ctx;
}

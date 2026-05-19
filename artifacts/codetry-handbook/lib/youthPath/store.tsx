// Persistent local store for The Youth Odyssey.
//
// Records, per station:
//   answers:   the child's responses to each prompt (promptId → answer)
//   story:     the AI-generated story text, once produced
//   completedAt: epoch ms when the station was marked done
//
// Also stores:
//   ageTrack: the reader's selected age range (set once at entry)
//   trailMemory: per-station photo URI + note, independent of completion
//                (local-only until XRPL DID identity layer is built)
//
// Local-only on purpose. The story belongs to the child. Nothing syncs.

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
import { YOUTH_STATIONS, type AgeTrack } from "@/data/youthPath";

const KEY = "codetry-handbook:v1:youth-path";

export type YouthCompletion = {
  completedAt: number;
  answers: Record<string, string>;
  story?: string;
};

export type TrailMemory = {
  note?: string;
  photoUri?: string;
};

export type YouthProgress = {
  ageTrack: AgeTrack | null;
  completed: Record<string, YouthCompletion>;
  draftAnswers: Record<string, Record<string, string>>;
  // Independent of completion — can be set any time a station is visited
  trailMemory: Record<string, TrailMemory>;
  // TTS block index saved when the child leaves mid-read (stationId → blockIdx)
  ttsProgress: Record<string, number>;
};

const DEFAULT_PROGRESS: YouthProgress = {
  ageTrack: null,
  completed: {},
  draftAnswers: {},
  trailMemory: {},
  ttsProgress: {},
};

type StoreCtx = {
  ready: boolean;
  progress: YouthProgress;
  ageTrack: AgeTrack | null;
  setAgeTrack: (track: AgeTrack) => void;
  isCompleted: (stationId: string) => boolean;
  isUnlocked: (stationId: string) => boolean;
  getAnswers: (stationId: string) => Record<string, string>;
  saveAnswer: (stationId: string, promptId: string, value: string) => void;
  markDone: (stationId: string, story?: string) => void;
  unmark: (stationId: string) => void;
  getStory: (stationId: string) => string | undefined;
  // Trail memory
  getTrailMemory: (stationId: string) => TrailMemory;
  saveNote: (stationId: string, note: string) => void;
  savePhoto: (stationId: string, photoUri: string) => void;
  clearPhoto: (stationId: string) => void;
  // TTS reading position
  getTtsProgress: (stationId: string) => number;
  saveTtsProgress: (stationId: string, blockIndex: number) => void;
  clearTtsProgress: (stationId: string) => void;
};

const YouthCtx = createContext<StoreCtx | null>(null);

function parseProgress(raw: string | null): YouthProgress {
  if (!raw) return DEFAULT_PROGRESS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PROGRESS;
    const p = parsed as Partial<YouthProgress>;
    return {
      ageTrack: (p.ageTrack as AgeTrack) ?? null,
      completed:
        p.completed && typeof p.completed === "object" ? p.completed : {},
      draftAnswers:
        p.draftAnswers && typeof p.draftAnswers === "object"
          ? p.draftAnswers
          : {},
      trailMemory:
        p.trailMemory && typeof p.trailMemory === "object"
          ? p.trailMemory
          : {},
      ttsProgress:
        p.ttsProgress && typeof p.ttsProgress === "object"
          ? p.ttsProgress
          : {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function YouthPathProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<YouthProgress>(DEFAULT_PROGRESS);

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

  const persist = useCallback((next: YouthProgress) => {
    setProgress(next);
    storage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const setAgeTrack = useCallback(
    (track: AgeTrack) => {
      persist({ ...progress, ageTrack: track });
    },
    [persist, progress],
  );

  const isCompleted = useCallback(
    (stationId: string) => Boolean(progress.completed[stationId]),
    [progress.completed],
  );

  const isUnlocked = useCallback(
    (stationId: string) => {
      const idx = YOUTH_STATIONS.findIndex((s) => s.id === stationId);
      if (idx <= 0) return true;
      const prev = YOUTH_STATIONS[idx - 1];
      return Boolean(progress.completed[prev.id]);
    },
    [progress.completed],
  );

  const getAnswers = useCallback(
    (stationId: string): Record<string, string> => {
      if (progress.completed[stationId]) {
        return progress.completed[stationId].answers;
      }
      return progress.draftAnswers[stationId] ?? {};
    },
    [progress.completed, progress.draftAnswers],
  );

  const saveAnswer = useCallback(
    (stationId: string, promptId: string, value: string) => {
      const existing = progress.draftAnswers[stationId] ?? {};
      persist({
        ...progress,
        draftAnswers: {
          ...progress.draftAnswers,
          [stationId]: { ...existing, [promptId]: value },
        },
      });
    },
    [persist, progress],
  );

  const markDone = useCallback(
    (stationId: string, story?: string) => {
      const answers =
        progress.completed[stationId]?.answers ??
        progress.draftAnswers[stationId] ??
        {};
      const nextDraft = { ...progress.draftAnswers };
      delete nextDraft[stationId];
      persist({
        ...progress,
        draftAnswers: nextDraft,
        completed: {
          ...progress.completed,
          [stationId]: {
            completedAt:
              progress.completed[stationId]?.completedAt ?? Date.now(),
            answers,
            ...(story !== undefined ? { story } : {}),
          },
        },
      });
    },
    [persist, progress],
  );

  const unmark = useCallback(
    (stationId: string) => {
      const completion = progress.completed[stationId];
      const nextCompleted = { ...progress.completed };
      delete nextCompleted[stationId];
      persist({
        ...progress,
        completed: nextCompleted,
        draftAnswers: completion
          ? { ...progress.draftAnswers, [stationId]: completion.answers }
          : progress.draftAnswers,
      });
    },
    [persist, progress],
  );

  const getStory = useCallback(
    (stationId: string) => progress.completed[stationId]?.story,
    [progress.completed],
  );

  const getTrailMemory = useCallback(
    (stationId: string): TrailMemory =>
      progress.trailMemory[stationId] ?? {},
    [progress.trailMemory],
  );

  const saveNote = useCallback(
    (stationId: string, note: string) => {
      const existing = progress.trailMemory[stationId] ?? {};
      persist({
        ...progress,
        trailMemory: {
          ...progress.trailMemory,
          [stationId]: { ...existing, note },
        },
      });
    },
    [persist, progress],
  );

  const savePhoto = useCallback(
    (stationId: string, photoUri: string) => {
      const existing = progress.trailMemory[stationId] ?? {};
      persist({
        ...progress,
        trailMemory: {
          ...progress.trailMemory,
          [stationId]: { ...existing, photoUri },
        },
      });
    },
    [persist, progress],
  );

  const clearPhoto = useCallback(
    (stationId: string) => {
      const existing = progress.trailMemory[stationId] ?? {};
      const next = { ...existing };
      delete next.photoUri;
      persist({
        ...progress,
        trailMemory: {
          ...progress.trailMemory,
          [stationId]: next,
        },
      });
    },
    [persist, progress],
  );

  const getTtsProgress = useCallback(
    (stationId: string): number => progress.ttsProgress[stationId] ?? 0,
    [progress.ttsProgress],
  );

  const saveTtsProgress = useCallback(
    (stationId: string, blockIndex: number) => {
      persist({
        ...progress,
        ttsProgress: { ...progress.ttsProgress, [stationId]: blockIndex },
      });
    },
    [persist, progress],
  );

  const clearTtsProgress = useCallback(
    (stationId: string) => {
      const next = { ...progress.ttsProgress };
      delete next[stationId];
      persist({ ...progress, ttsProgress: next });
    },
    [persist, progress],
  );

  const value = useMemo<StoreCtx>(
    () => ({
      ready,
      progress,
      ageTrack: progress.ageTrack,
      setAgeTrack,
      isCompleted,
      isUnlocked,
      getAnswers,
      saveAnswer,
      markDone,
      unmark,
      getStory,
      getTrailMemory,
      saveNote,
      savePhoto,
      clearPhoto,
      getTtsProgress,
      saveTtsProgress,
      clearTtsProgress,
    }),
    [
      ready,
      progress,
      setAgeTrack,
      isCompleted,
      isUnlocked,
      getAnswers,
      saveAnswer,
      markDone,
      unmark,
      getStory,
      getTrailMemory,
      saveNote,
      savePhoto,
      clearPhoto,
      getTtsProgress,
      saveTtsProgress,
      clearTtsProgress,
    ],
  );

  return <YouthCtx.Provider value={value}>{children}</YouthCtx.Provider>;
}

export function useYouthPath(): StoreCtx {
  const ctx = useContext(YouthCtx);
  if (!ctx) {
    throw new Error("useYouthPath must be used inside YouthPathProvider");
  }
  return ctx;
}

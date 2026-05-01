/**
 * HandbookContentContext
 *
 * Provides handbook content to all screens.  Initial values come from the
 * bundled TypeScript data files (zero-flash, offline-safe).  On mount the
 * context fetches fresh JSON from the api-server and updates in place, so
 * content-only edits (chapter text, pioneer stations, standby items) only
 * require updating JSON in artifacts/api-server/src/data/handbook/ — no Expo
 * rebuild or app restart needed.
 *
 * Stale-while-revalidate via AsyncStorage:
 *   1. Render with bundled data immediately.
 *   2. Load cached JSON from AsyncStorage → update if found.
 *   3. Fetch from api-server → update state + persist to AsyncStorage.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  CHAPTERS as BUNDLED_CHAPTERS,
  PARTS as BUNDLED_PARTS,
} from "@/data/handbook";
import type { Block, Chapter, Part } from "@/data/handbook";
import {
  PIONEER_STATIONS as BUNDLED_PIONEER_STATIONS,
} from "@/data/pioneerPath";
import type { PioneerStation } from "@/data/pioneerPath";
import {
  ITEMS as BUNDLED_ITEMS,
  RUNGS as BUNDLED_RUNGS,
  STANDBY_PRIMITIVE_NAME as BUNDLED_STANDBY_PRIMITIVE_NAME,
  STANDBY_PRIMITIVE_SUMMARY as BUNDLED_STANDBY_PRIMITIVE_SUMMARY,
  SUB_SHELVES as BUNDLED_SUB_SHELVES,
  VOCAB as BUNDLED_VOCAB,
} from "@/data/standby";
import type { RungId, RungInfo, StandbyItem, StandbyVocab, SubShelfInfo } from "@/data/standby";

export type { Block, Chapter, Part, PioneerStation, RungId, RungInfo, StandbyItem, StandbyVocab, SubShelfInfo };

// ── API URL ─────────────────────────────────────────────────────────────────
const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api-server/api/handbook`
  : "/api-server/api/handbook";

// ── Storage keys ─────────────────────────────────────────────────────────────
const KEY_CHAPTERS = "handbook_content_chapters_v1";
const KEY_PIONEER = "handbook_content_pioneer_v1";
const KEY_STANDBY = "handbook_content_standby_v1";

// ── Context shape ─────────────────────────────────────────────────────────────
interface HandbookContent {
  PARTS: Part[];
  CHAPTERS: Chapter[];
  PIONEER_STATIONS: PioneerStation[];
  RUNGS: RungInfo[];
  SUB_SHELVES: SubShelfInfo[];
  VOCAB: StandbyVocab;
  ITEMS: StandbyItem[];
  STANDBY_PRIMITIVE_NAME: string;
  STANDBY_PRIMITIVE_SUMMARY: string;

  getChapter: (id: string | undefined) => Chapter | undefined;
  getPart: (roman: string | undefined) => Part | undefined;
  getNeighbors: (id: string) => { prev: Chapter | undefined; next: Chapter | undefined; index: number };
  getPioneerStation: (id: string | undefined) => PioneerStation | undefined;
  getPioneerNeighbors: (id: string) => { prev: PioneerStation | undefined; next: PioneerStation | undefined };
  chapterExcerpt: (text: string, max?: number) => string;
  chapterOpening: (chapter: Chapter, max?: number) => string;
}

function makeHelpers(
  chapters: Chapter[],
  parts: Part[],
  stations: PioneerStation[],
): Pick<HandbookContent, "getChapter" | "getPart" | "getNeighbors" | "getPioneerStation" | "getPioneerNeighbors" | "chapterExcerpt" | "chapterOpening"> {
  function getChapter(id: string | undefined): Chapter | undefined {
    if (!id) return undefined;
    return chapters.find((c) => c.id === id);
  }

  function getPart(roman: string | undefined): Part | undefined {
    if (!roman) return undefined;
    return parts.find((p) => p.roman === roman);
  }

  function getNeighbors(id: string): { prev: Chapter | undefined; next: Chapter | undefined; index: number } {
    const idx = chapters.findIndex((c) => c.id === id);
    return {
      prev: idx > 0 ? chapters[idx - 1] : undefined,
      next: idx < chapters.length - 1 ? chapters[idx + 1] : undefined,
      index: idx >= 0 ? idx : 0,
    };
  }

  function getPioneerStation(id: string | undefined): PioneerStation | undefined {
    if (!id) return undefined;
    return stations.find((s) => s.id === id);
  }

  function getPioneerNeighbors(id: string): { prev: PioneerStation | undefined; next: PioneerStation | undefined } {
    const idx = stations.findIndex((s) => s.id === id);
    return {
      prev: idx > 0 ? stations[idx - 1] : undefined,
      next: idx < stations.length - 1 ? stations[idx + 1] : undefined,
    };
  }

  function chapterExcerpt(text: string, max = 90): string {
    if (text.length <= max) return text;
    const cut = text.lastIndexOf(" ", max);
    return cut > 0 ? text.slice(0, cut) + "…" : text.slice(0, max) + "…";
  }

  function chapterOpening(chapter: Chapter, max = 180): string {
    for (const block of chapter.blocks ?? []) {
      if (block.kind === "para" && block.text.trim().length > 0) {
        return chapterExcerpt(block.text.trim(), max);
      }
    }
    return "";
  }

  return { getChapter, getPart, getNeighbors, getPioneerStation, getPioneerNeighbors, chapterExcerpt, chapterOpening };
}

const defaultValue: HandbookContent = {
  PARTS: BUNDLED_PARTS,
  CHAPTERS: BUNDLED_CHAPTERS,
  PIONEER_STATIONS: BUNDLED_PIONEER_STATIONS,
  RUNGS: BUNDLED_RUNGS,
  SUB_SHELVES: BUNDLED_SUB_SHELVES,
  VOCAB: BUNDLED_VOCAB,
  ITEMS: BUNDLED_ITEMS,
  STANDBY_PRIMITIVE_NAME: BUNDLED_STANDBY_PRIMITIVE_NAME,
  STANDBY_PRIMITIVE_SUMMARY: BUNDLED_STANDBY_PRIMITIVE_SUMMARY,
  ...makeHelpers(BUNDLED_CHAPTERS, BUNDLED_PARTS, BUNDLED_PIONEER_STATIONS),
};

const HandbookContentContext = createContext<HandbookContent>(defaultValue);

// ── Provider ──────────────────────────────────────────────────────────────────
export function HandbookContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<HandbookContent>(defaultValue);

  const applyChaptersPayload = useCallback(
    (payload: { PARTS: Part[]; CHAPTERS: Chapter[] }, stations: PioneerStation[]) => {
      const { PARTS: parts, CHAPTERS: chapters } = payload;
      setContent((prev) => ({
        ...prev,
        PARTS: parts,
        CHAPTERS: chapters,
        ...makeHelpers(chapters, parts, stations),
      }));
    },
    [],
  );

  const applyStationsPayload = useCallback(
    (payload: { PIONEER_STATIONS: PioneerStation[] }, chapters: Chapter[], parts: Part[]) => {
      const { PIONEER_STATIONS: stations } = payload;
      setContent((prev) => ({
        ...prev,
        PIONEER_STATIONS: stations,
        ...makeHelpers(chapters, parts, stations),
      }));
    },
    [],
  );

  const applyStandbyPayload = useCallback(
    (payload: {
      RUNGS: RungInfo[];
      SUB_SHELVES: SubShelfInfo[];
      VOCAB: StandbyVocab;
      ITEMS: StandbyItem[];
      STANDBY_PRIMITIVE_NAME: string;
      STANDBY_PRIMITIVE_SUMMARY: string;
    }) => {
      setContent((prev) => ({
        ...prev,
        RUNGS: payload.RUNGS,
        SUB_SHELVES: payload.SUB_SHELVES,
        VOCAB: payload.VOCAB,
        ITEMS: payload.ITEMS,
        STANDBY_PRIMITIVE_NAME: payload.STANDBY_PRIMITIVE_NAME,
        STANDBY_PRIMITIVE_SUMMARY: payload.STANDBY_PRIMITIVE_SUMMARY,
      }));
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAndRefresh() {
      // ── 1. Warm from AsyncStorage (instant, no network) ──────────────────
      let cachedChapters: { PARTS: Part[]; CHAPTERS: Chapter[] } | null = null;
      let cachedStations: { PIONEER_STATIONS: PioneerStation[] } | null = null;

      try {
        const raw = await AsyncStorage.getItem(KEY_CHAPTERS);
        if (raw) cachedChapters = JSON.parse(raw);
      } catch { /* ignore */ }

      try {
        const raw = await AsyncStorage.getItem(KEY_PIONEER);
        if (raw) cachedStations = JSON.parse(raw);
      } catch { /* ignore */ }

      try {
        const raw = await AsyncStorage.getItem(KEY_STANDBY);
        if (raw && !cancelled) applyStandbyPayload(JSON.parse(raw));
      } catch { /* ignore */ }

      if (!cancelled && cachedChapters) {
        applyChaptersPayload(
          cachedChapters,
          cachedStations?.PIONEER_STATIONS ?? BUNDLED_PIONEER_STATIONS,
        );
      }
      if (!cancelled && cachedStations) {
        applyStationsPayload(
          cachedStations,
          cachedChapters?.CHAPTERS ?? BUNDLED_CHAPTERS,
          cachedChapters?.PARTS ?? BUNDLED_PARTS,
        );
      }

      // ── 2. Fetch fresh from api-server (background revalidation) ─────────
      try {
        const [chaptersRes, pioneersRes, standbyRes] = await Promise.all([
          fetch(`${API_BASE}/chapters`),
          fetch(`${API_BASE}/pioneer-path`),
          fetch(`${API_BASE}/standby`),
        ]);

        if (!cancelled && chaptersRes.ok) {
          const payload: { PARTS: Part[]; CHAPTERS: Chapter[] } = await chaptersRes.json();
          const currentStations =
            (cachedStations?.PIONEER_STATIONS) ?? BUNDLED_PIONEER_STATIONS;
          applyChaptersPayload(payload, currentStations);
          AsyncStorage.setItem(KEY_CHAPTERS, JSON.stringify(payload)).catch(() => {});
        }

        if (!cancelled && pioneersRes.ok) {
          const payload: { PIONEER_STATIONS: PioneerStation[] } = await pioneersRes.json();
          setContent((prev) => {
            const updated = {
              ...prev,
              PIONEER_STATIONS: payload.PIONEER_STATIONS,
              ...makeHelpers(prev.CHAPTERS, prev.PARTS, payload.PIONEER_STATIONS),
            };
            return updated;
          });
          AsyncStorage.setItem(KEY_PIONEER, JSON.stringify(payload)).catch(() => {});
        }

        if (!cancelled && standbyRes.ok) {
          const payload = await standbyRes.json();
          applyStandbyPayload(payload);
          AsyncStorage.setItem(KEY_STANDBY, JSON.stringify(payload)).catch(() => {});
        }
      } catch {
        // Network unavailable — bundled / cached data remains active.
      }
    }

    void loadAndRefresh();
    return () => { cancelled = true; };
  }, [applyChaptersPayload, applyStationsPayload, applyStandbyPayload]);

  return (
    <HandbookContentContext.Provider value={content}>
      {children}
    </HandbookContentContext.Provider>
  );
}

// ── Consumer hook ─────────────────────────────────────────────────────────────
export function useHandbookContent(): HandbookContent {
  return useContext(HandbookContentContext);
}

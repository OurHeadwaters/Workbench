/**
 * Sarge local store.
 *
 * Keeps the current week plan in AsyncStorage so the app works offline
 * and resumes exactly where Bobbie left off.
 *
 * Sync strategy:
 *   - On open: fetch from API, merge local status changes on top (local wins for status)
 *   - On card action: PATCH immediately + update local cache
 *   - If API returns a newer week (different id), prompt a soft refresh rather than silently replacing
 */

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

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardStatus = "active" | "done" | "stuck";

export interface SargeCard {
  id: string;
  weekId: string;
  priorityId: string;
  priorityLabel: string;
  action: string;
  context: string | null;
  status: CardStatus;
  order: number;
  completedAt: string | null;
  barrierNote: string | null;
}

export interface SargePriority {
  id: string;
  label: string;
  order: number;
  isActive: boolean;
}

export interface SargeWeek {
  id: string;
  weekOf: string;
  priorities: SargePriority[];
  isLocked: boolean;
  lockedAt: string | null;
  cards: SargeCard[];
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface SargeCtx {
  ready: boolean;
  syncing: boolean;
  week: SargeWeek | null;
  cards: SargeCard[];
  activeCardIndex: number;
  weekUpdateAvailable: boolean;
  dismissWeekUpdate: () => void;
  applyWeekUpdate: () => void;
  markDone: (cardId: string) => Promise<void>;
  markStuck: (cardId: string, note: string) => Promise<void>;
  setActiveCardIndex: (i: number) => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<SargeCtx | null>(null);

// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEY_WEEK = "sarge:v1:week";
const KEY_CARDS = "sarge:v1:cards";
const KEY_ACTIVE = "sarge:v1:active-card-index";

function getApiBase(): string {
  const domain = process.env.EXPO_PUBLIC_DOMAIN ?? "";
  return domain ? `https://${domain}/api/sarge` : "/api/sarge";
}

// ─── Merge remote week with local status overrides ────────────────────────────
//
// Exported as a pure function so it can be unit-tested independently of the
// React provider.
//
// Merge rules:
//   - Local status, completedAt, barrierNote always win — Bobbie may have
//     acted on the device before a sync came back.
//   - Remote card content (action, context, order) always wins — the desktop
//     is the source of truth for those fields.
//   - The result is sorted by the server-assigned `order` field so card
//     position is stable even if the API returns rows in an arbitrary sequence.

export function mergeCards(remote: SargeCard[], local: SargeCard[]): SargeCard[] {
  const localMap = new Map(local.map((c) => [c.id, c]));
  const merged = remote.map((r) => {
    const l = localMap.get(r.id);
    if (!l) return r;
    return {
      ...r,
      status: l.status,
      completedAt: l.completedAt,
      barrierNote: l.barrierNote,
    };
  });
  return merged.sort((a, b) => a.order - b.order);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SargeProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [week, setWeek] = useState<SargeWeek | null>(null);
  const [cards, setCards] = useState<SargeCard[]>([]);
  const [activeCardIndex, setActiveCardIndexState] = useState(0);
  const [pendingWeek, setPendingWeek] = useState<SargeWeek | null>(null);
  const [weekUpdateAvailable, setWeekUpdateAvailable] = useState(false);
  const weekIdRef = useRef<string | null>(null);

  // ─── Persistence ────────────────────────────────────────────────────────

  const persistCards = useCallback((nextCards: SargeCard[]) => {
    setCards(nextCards);
    AsyncStorage.setItem(KEY_CARDS, JSON.stringify(nextCards)).catch(() => {});
  }, []);

  const persistActiveIndex = useCallback((i: number) => {
    setActiveCardIndexState(i);
    AsyncStorage.setItem(KEY_ACTIVE, String(i)).catch(() => {});
  }, []);

  // ─── Fetch from API ──────────────────────────────────────────────────────

  const fetchRemote = useCallback(async (currentCards: SargeCard[], currentWeekId: string | null) => {
    setSyncing(true);
    try {
      const res = await fetch(`${getApiBase()}/week/current`, {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { week: SargeWeek | null };
      if (!data.week) return;

      const remote = data.week;

      if (currentWeekId && remote.id !== currentWeekId) {
        // A new week was generated on desktop — prompt soft refresh
        setPendingWeek(remote);
        setWeekUpdateAvailable(true);
        return;
      }

      // Same week — merge and apply
      const merged = mergeCards(remote.cards, currentCards);
      setWeek(remote);
      weekIdRef.current = remote.id;
      persistCards(merged);
      await AsyncStorage.setItem(KEY_WEEK, JSON.stringify(remote));
    } catch {
      // Offline — silently continue with local cache
    } finally {
      setSyncing(false);
    }
  }, [persistCards]);

  // ─── Boot: load from cache, then sync ───────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const [rawWeek, rawCards, rawIdx] = await Promise.all([
          AsyncStorage.getItem(KEY_WEEK),
          AsyncStorage.getItem(KEY_CARDS),
          AsyncStorage.getItem(KEY_ACTIVE),
        ]);

        const cachedWeek = rawWeek ? (JSON.parse(rawWeek) as SargeWeek) : null;
        const cachedCards = rawCards ? (JSON.parse(rawCards) as SargeCard[]) : [];
        const cachedIdx = rawIdx ? parseInt(rawIdx, 10) : 0;

        if (!cancelled) {
          setWeek(cachedWeek);
          setCards(cachedCards);
          weekIdRef.current = cachedWeek?.id ?? null;
          setActiveCardIndexState(isNaN(cachedIdx) ? 0 : cachedIdx);
          setReady(true);
        }

        // Sync in background
        if (!cancelled) {
          await fetchRemote(cachedCards, cachedWeek?.id ?? null);
        }
      } catch {
        if (!cancelled) setReady(true);
      }
    }

    void boot();
    return () => { cancelled = true; };
  }, [fetchRemote]);

  // ─── Refresh (pull-to-refresh) ───────────────────────────────────────────

  const refresh = useCallback(async () => {
    await fetchRemote(cards, weekIdRef.current);
  }, [fetchRemote, cards]);

  // ─── Week update prompt ──────────────────────────────────────────────────

  const dismissWeekUpdate = useCallback(() => {
    setWeekUpdateAvailable(false);
    setPendingWeek(null);
  }, []);

  const applyWeekUpdate = useCallback(() => {
    if (!pendingWeek) return;
    const merged = mergeCards(pendingWeek.cards, cards);
    setWeek(pendingWeek);
    weekIdRef.current = pendingWeek.id;
    persistCards(merged);
    AsyncStorage.setItem(KEY_WEEK, JSON.stringify(pendingWeek)).catch(() => {});
    setWeekUpdateAvailable(false);
    setPendingWeek(null);
    setActiveCardIndexState(0);
    AsyncStorage.setItem(KEY_ACTIVE, "0").catch(() => {});
  }, [pendingWeek, cards, persistCards]);

  // ─── Card actions ────────────────────────────────────────────────────────

  const markDone = useCallback(async (cardId: string) => {
    const now = new Date().toISOString();
    const updated = cards.map((c) =>
      c.id === cardId ? { ...c, status: "done" as CardStatus, completedAt: now } : c,
    );
    persistCards(updated);

    // Advance past done card
    const activeCards = updated.filter((c) => c.status === "active");
    if (activeCards.length > 0) {
      const nextIdx = updated.findIndex((c) => c.id === activeCards[0]!.id);
      persistActiveIndex(Math.max(0, nextIdx));
    }

    // Sync to server
    try {
      await fetch(`${getApiBase()}/card/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      });
    } catch {
      // Offline — local state already updated
    }
  }, [cards, persistCards, persistActiveIndex]);

  const markStuck = useCallback(async (cardId: string, note: string) => {
    const updated = cards.map((c) =>
      c.id === cardId ? { ...c, status: "stuck" as CardStatus, barrierNote: note || null } : c,
    );
    persistCards(updated);

    // Advance past stuck card
    const activeCards = updated.filter((c) => c.status === "active");
    if (activeCards.length > 0) {
      const nextIdx = updated.findIndex((c) => c.id === activeCards[0]!.id);
      persistActiveIndex(Math.max(0, nextIdx));
    }

    // Sync to server
    try {
      await fetch(`${getApiBase()}/barrier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, note }),
      });
    } catch {
      // Offline — local state already updated
    }
  }, [cards, persistCards, persistActiveIndex]);

  const setActiveCardIndex = useCallback((i: number) => {
    persistActiveIndex(i);
  }, [persistActiveIndex]);

  // ─── Value ───────────────────────────────────────────────────────────────

  const value = useMemo<SargeCtx>(() => ({
    ready,
    syncing,
    week,
    cards,
    activeCardIndex,
    weekUpdateAvailable,
    dismissWeekUpdate,
    applyWeekUpdate,
    markDone,
    markStuck,
    setActiveCardIndex,
    refresh,
  }), [
    ready,
    syncing,
    week,
    cards,
    activeCardIndex,
    weekUpdateAvailable,
    dismissWeekUpdate,
    applyWeekUpdate,
    markDone,
    markStuck,
    setActiveCardIndex,
    refresh,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSarge(): SargeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSarge must be used inside SargeProvider");
  return ctx;
}

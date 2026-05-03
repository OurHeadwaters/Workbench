/**
 * useWordWalk
 *
 * Fetches the rename-map word list from GET /api/word-walk/words on mount,
 * caches it locally with AsyncStorage, computes today's 5-word soft queue,
 * and exposes a decide() function that calls POST /api/word-walk/decide then
 * updates local state optimistically.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api-server/api/word-walk`
  : "/api-server/api/word-walk";

const CACHE_KEY = "word_walk_rows_v1";
const TODAY_KEY = "word_walk_today_v1";
const DAILY_QUOTA = 5;

export type RenameStatus = "proposed" | "approved" | "rejected" | "deferred" | "applied";
export type DriftSymbol = "G" | "U" | "D" | "A";

export interface WordRow {
  id: number;
  term: string;
  whereItAppears: string;
  drift: DriftSymbol[];
  proposedReplacement: string;
  secondOrderEffects: string;
  status: RenameStatus;
}

export type Verdict = "approved" | "rejected" | "deferred";

interface TodayRecord {
  date: string;
  decided: Array<{ rowId: number; verdict: Verdict }>;
}

function todayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export interface UseWordWalkResult {
  ready: boolean;
  rows: WordRow[];
  undecided: WordRow[];
  todayQueue: WordRow[];
  todayDecided: Array<{ rowId: number; verdict: Verdict }>;
  sessionDone: boolean;
  allDone: boolean;
  counts: { proposed: number; approved: number; rejected: number; deferred: number; applied: number };
  decide: (rowId: number, verdict: Verdict) => Promise<void>;
  error: string | null;
}

export function useWordWalk(): UseWordWalkResult {
  const [rows, setRows] = useState<WordRow[]>([]);
  const [ready, setReady] = useState(false);
  const [todayDecided, setTodayDecided] = useState<Array<{ rowId: number; verdict: Verdict }>>([]);
  const [todayQueue, setTodayQueue] = useState<WordRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const buildQueue = useCallback(
    (allRows: WordRow[], alreadyDecidedToday: Array<{ rowId: number; verdict: Verdict }>) => {
      const decidedTodayIds = new Set(alreadyDecidedToday.map((d) => d.rowId));
      const undecidedToday = allRows.filter(
        (r) => r.status === "proposed" && !decidedTodayIds.has(r.id),
      );
      return undecidedToday.slice(0, DAILY_QUOTA);
    },
    [],
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    async function init() {
      const today = todayDateString();

      // 1. Load today's decision record
      let todayRec: TodayRecord = { date: today, decided: [] };
      try {
        const stored = await AsyncStorage.getItem(TODAY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as TodayRecord;
          if (parsed.date === today) {
            todayRec = parsed;
          }
        }
      } catch {}

      setTodayDecided(todayRec.decided);

      // 2. Load cached rows
      let cachedRows: WordRow[] = [];
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as { rows: WordRow[] };
          cachedRows = parsed.rows ?? [];
        }
      } catch {}

      if (cachedRows.length > 0) {
        setRows(cachedRows);
        setTodayQueue(buildQueue(cachedRows, todayRec.decided));
        setReady(true);
      }

      // 3. Fetch fresh from server
      try {
        const res = await fetch(`${API_BASE}/words`);
        if (res.ok) {
          const data = (await res.json()) as { rows: WordRow[] };
          const freshRows = data.rows ?? [];
          setRows(freshRows);
          setTodayQueue(buildQueue(freshRows, todayRec.decided));
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ rows: freshRows }));
        } else {
          if (cachedRows.length === 0) setError("Could not load word list from server.");
        }
      } catch (e) {
        if (cachedRows.length === 0) setError("Network error loading word list.");
      }

      setReady(true);
    }

    void init();
  }, [buildQueue]);

  const decide = useCallback(
    async (rowId: number, verdict: Verdict) => {
      // Optimistic update
      setRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, status: verdict } : r)),
      );

      const newDecided = [...todayDecided, { rowId, verdict }];
      setTodayDecided(newDecided);

      const todayRec: TodayRecord = { date: todayDateString(), decided: newDecided };
      await AsyncStorage.setItem(TODAY_KEY, JSON.stringify(todayRec));

      setRows((current) => {
        setTodayQueue(buildQueue(current, newDecided));
        return current;
      });

      // Server update
      try {
        const res = await fetch(`${API_BASE}/decide`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rowId, verdict }),
        });
        if (res.ok) {
          const data = (await res.json()) as { row: WordRow };
          setRows((prev) => {
            const updated = prev.map((r) => (r.id === rowId ? data.row : r));
            setTodayQueue(buildQueue(updated, newDecided));
            void AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ rows: updated }));
            return updated;
          });
        }
      } catch {}
    },
    [todayDecided, buildQueue],
  );

  const undecided = rows.filter((r) => r.status === "proposed");

  const counts = {
    proposed: rows.filter((r) => r.status === "proposed").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    deferred: rows.filter((r) => r.status === "deferred").length,
    applied: rows.filter((r) => r.status === "applied").length,
  };

  const decidedTodayIds = new Set(todayDecided.map((d) => d.rowId));
  const sessionDone =
    todayDecided.length >= DAILY_QUOTA &&
    rows.filter((r) => r.status === "proposed" && !decidedTodayIds.has(r.id)).length === 0 ||
    (todayDecided.length >= DAILY_QUOTA && undecided.filter((r) => !decidedTodayIds.has(r.id)).length === 0);

  const allDone = rows.length > 0 && undecided.length === 0;

  return {
    ready,
    rows,
    undecided,
    todayQueue,
    todayDecided,
    sessionDone: todayDecided.length >= DAILY_QUOTA || allDone,
    allDone,
    counts,
    decide,
    error,
  };
}

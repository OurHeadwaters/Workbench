import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import { storage } from "@/lib/storage";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export type Bookmark = {
  id: string;
  chapterId: string;
  chapterTitle: string;
  partLabel: string;
  excerpt: string;
  createdAt: number;
};

export type LastRead = {
  chapterId: string;
  scrollY: number;
};

const NS = "codetry-handbook:v1";
const KEYS = {
  themeMode: `${NS}:themeMode`,
  fontScale: `${NS}:fontScale`,
  bookmarks: `${NS}:bookmarks`,
  lastRead: `${NS}:lastRead`,
};

const FONT_STEPS = [0.85, 0.92, 1.0, 1.1, 1.2, 1.3, 1.45] as const;
const DEFAULT_STEP = 2;

type ReaderContextValue = {
  ready: boolean;
  themeMode: ThemeMode;
  theme: ResolvedTheme;
  setThemeMode: (m: ThemeMode) => void;
  cycleTheme: () => void;
  fontScale: number;
  fontStep: number;
  increaseFont: () => void;
  decreaseFont: () => void;
  bookmarks: Bookmark[];
  addBookmark: (b: Omit<Bookmark, "id" | "createdAt">) => void;
  removeBookmark: (id: string) => void;
  hasBookmark: (chapterId: string, excerpt: string) => boolean;
  lastRead: LastRead | null;
  setLastRead: (r: LastRead) => void;
  clearLastRead: () => void;
};

const ReaderContext = createContext<ReaderContextValue | null>(null);

export function ReaderStateProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [fontStep, setFontStep] = useState<number>(DEFAULT_STEP);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<LastRead | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tm, fs, bm, lr] = await Promise.all([
          AsyncStorage.getItem(KEYS.themeMode),
          AsyncStorage.getItem(KEYS.fontScale),
          AsyncStorage.getItem(KEYS.bookmarks),
          AsyncStorage.getItem(KEYS.lastRead),
        ]);
        if (cancelled) return;
        if (tm === "light" || tm === "dark" || tm === "system") {
          setThemeModeState(tm);
        }
        if (fs !== null) {
          const n = Number(fs);
          if (Number.isFinite(n) && n >= 0 && n < FONT_STEPS.length) {
            setFontStep(Math.floor(n));
          }
        }
        if (bm) {
          try {
            const parsed = JSON.parse(bm);
            if (Array.isArray(parsed)) setBookmarks(parsed as Bookmark[]);
          } catch {}
        }
        if (lr) {
          try {
            const parsed = JSON.parse(lr);
            if (parsed && typeof parsed.chapterId === "string") {
              setLastReadState({
                chapterId: parsed.chapterId,
                scrollY: Number(parsed.scrollY) || 0,
              });
            }
          } catch {}
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Writes route through `storage` so the SyncStatusPill reflects them.
  // Rejections stay swallowed; the pill is the failure surface.
  const setThemeMode = useCallback((m: ThemeMode) => {
    setThemeModeState(m);
    storage.setItem(KEYS.themeMode, m).catch(() => {});
  }, []);

  const cycleTheme = useCallback(() => {
    const order: ThemeMode[] = ["system", "light", "dark"];
    setThemeModeState((prev) => {
      const next = order[(order.indexOf(prev) + 1) % order.length];
      storage.setItem(KEYS.themeMode, next).catch(() => {});
      return next;
    });
  }, []);

  const writeFontStep = useCallback((step: number) => {
    setFontStep(step);
    storage.setItem(KEYS.fontScale, String(step)).catch(() => {});
  }, []);

  const increaseFont = useCallback(() => {
    setFontStep((prev) => {
      const next = Math.min(FONT_STEPS.length - 1, prev + 1);
      storage.setItem(KEYS.fontScale, String(next)).catch(() => {});
      return next;
    });
  }, []);

  const decreaseFont = useCallback(() => {
    setFontStep((prev) => {
      const next = Math.max(0, prev - 1);
      storage.setItem(KEYS.fontScale, String(next)).catch(() => {});
      return next;
    });
  }, []);

  const persistBookmarks = useCallback((next: Bookmark[]) => {
    setBookmarks(next);
    storage.setItem(KEYS.bookmarks, JSON.stringify(next)).catch(() => {});
  }, []);

  const addBookmark = useCallback(
    (b: Omit<Bookmark, "id" | "createdAt">) => {
      const id =
        Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      setBookmarks((prev) => {
        const next: Bookmark[] = [
          { ...b, id, createdAt: Date.now() },
          ...prev,
        ];
        storage.setItem(KEYS.bookmarks, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [],
  );

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      storage.setItem(KEYS.bookmarks, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const hasBookmark = useCallback(
    (chapterId: string, excerpt: string) =>
      bookmarks.some(
        (b) => b.chapterId === chapterId && b.excerpt === excerpt,
      ),
    [bookmarks],
  );

  const setLastRead = useCallback((r: LastRead) => {
    setLastReadState(r);
    storage.setItem(KEYS.lastRead, JSON.stringify(r)).catch(() => {});
  }, []);

  const clearLastRead = useCallback(() => {
    setLastReadState(null);
    storage.removeItem(KEYS.lastRead).catch(() => {});
  }, []);

  const theme: ResolvedTheme =
    themeMode === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  const fontScale = FONT_STEPS[fontStep] ?? FONT_STEPS[DEFAULT_STEP];

  const value = useMemo<ReaderContextValue>(
    () => ({
      ready,
      themeMode,
      theme,
      setThemeMode,
      cycleTheme,
      fontScale,
      fontStep,
      increaseFont,
      decreaseFont,
      bookmarks,
      addBookmark,
      removeBookmark,
      hasBookmark,
      lastRead,
      setLastRead,
      clearLastRead,
    }),
    [
      ready,
      themeMode,
      theme,
      setThemeMode,
      cycleTheme,
      fontScale,
      fontStep,
      increaseFont,
      decreaseFont,
      bookmarks,
      addBookmark,
      removeBookmark,
      hasBookmark,
      lastRead,
      setLastRead,
      clearLastRead,
    ],
  );

  return (
    <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
  );
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx)
    throw new Error("useReader must be used inside ReaderStateProvider");
  return ctx;
}

export const FONT_STEP_COUNT = FONT_STEPS.length;

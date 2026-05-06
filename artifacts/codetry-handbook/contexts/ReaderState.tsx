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
import { useColorScheme } from "react-native";

import {
  clearAmbientFailure,
  clearFailure,
  recordAmbientFailure,
  recordFailure,
} from "@/lib/saveStatus";
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
  practitionerVoice: `${NS}:practitionerVoice`,
  glossaryTerms: `${NS}:glossaryTerms`,
  lookedUpTerms: `${NS}:lookedUpTerms`,
};

// One opId per logical setting so a fresh edit replaces (not stacks on
// top of) any prior failure for the same setting. `lastRead` lives in
// the ambient channel rather than the failed-op registry.
const OP = {
  themeMode: "themeMode",
  fontScale: "fontScale",
  bookmarks: "bookmarks",
  lastRead: "lastRead",
  practitionerVoice: "practitionerVoice",
  glossaryTerms: "glossaryTerms",
  lookedUpTerms: "lookedUpTerms",
} as const;

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
  getScrollY: (chapterId: string) => number;
  saveScroll: (chapterId: string, y: number) => void;
  saveOriginScroll: (chapterId: string, y: number) => void;
  takeOriginScroll: (chapterId: string) => number | null;
  saveOriginBlockIndex: (chapterId: string, n: number) => void;
  takeOriginBlockIndex: (chapterId: string) => number | null;
  showPractitionerVoice: boolean;
  togglePractitionerVoice: () => void;
  glossaryTerms: string[];
  toggleGlossaryTerm: (term: string) => void;
  isGlossaryTermBookmarked: (term: string) => boolean;
  lookedUpTerms: string[];
  recordLookedUp: (term: string) => void;
  isLookedUp: (term: string) => boolean;
};

const ReaderContext = createContext<ReaderContextValue | null>(null);

function normalizeTerm(s: string) {
  return s.toLowerCase().replace(/['']/g, "'");
}

export function ReaderStateProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [fontStep, setFontStep] = useState<number>(DEFAULT_STEP);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<LastRead | null>(null);
  const [showPractitionerVoice, setShowPractitionerVoice] = useState<boolean>(true);
  const [glossaryTerms, setGlossaryTerms] = useState<string[]>([]);
  const [lookedUpTerms, setLookedUpTerms] = useState<string[]>([]);
  const scrollMapRef = useRef<Record<string, number>>({});
  const originScrollMapRef = useRef<Record<string, number>>({});
  const originBlockIndexMapRef = useRef<Record<string, number>>({});

  // Refs mirror state so retry callbacks re-attempt the latest intended
  // value rather than a snapshot captured at first-write time.
  const themeModeRef = useRef<ThemeMode>("system");
  const fontStepRef = useRef<number>(DEFAULT_STEP);
  const bookmarksRef = useRef<Bookmark[]>([]);
  const showPractitionerVoiceRef = useRef<boolean>(true);
  const glossaryTermsRef = useRef<string[]>([]);
  const lookedUpTermsRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tm, fs, bm, lr, pv, gt, lu] = await Promise.all([
          AsyncStorage.getItem(KEYS.themeMode),
          AsyncStorage.getItem(KEYS.fontScale),
          AsyncStorage.getItem(KEYS.bookmarks),
          AsyncStorage.getItem(KEYS.lastRead),
          AsyncStorage.getItem(KEYS.practitionerVoice),
          AsyncStorage.getItem(KEYS.glossaryTerms),
          AsyncStorage.getItem(KEYS.lookedUpTerms),
        ]);
        if (cancelled) return;
        if (tm === "light" || tm === "dark" || tm === "system") {
          setThemeModeState(tm);
          themeModeRef.current = tm;
        }
        if (fs !== null) {
          const n = Number(fs);
          if (Number.isFinite(n) && n >= 0 && n < FONT_STEPS.length) {
            const step = Math.floor(n);
            setFontStep(step);
            fontStepRef.current = step;
          }
        }
        if (bm) {
          try {
            const parsed = JSON.parse(bm);
            if (Array.isArray(parsed)) {
              setBookmarks(parsed as Bookmark[]);
              bookmarksRef.current = parsed as Bookmark[];
            }
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
        if (pv !== null) {
          const val = pv !== "false";
          setShowPractitionerVoice(val);
          showPractitionerVoiceRef.current = val;
        }
        if (gt) {
          try {
            const parsed = JSON.parse(gt);
            if (Array.isArray(parsed)) {
              setGlossaryTerms(parsed as string[]);
              glossaryTermsRef.current = parsed as string[];
            }
          } catch {}
        }
        if (lu) {
          try {
            const parsed = JSON.parse(lu);
            if (Array.isArray(parsed)) {
              setLookedUpTerms(parsed as string[]);
              lookedUpTermsRef.current = parsed as string[];
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

  // Run a write through `storage` (which goes through `trackSave`),
  // clear the per-op failure on success, record one with a retry on
  // rejection. The retry closure re-invokes the same `doWrite`, which
  // reads from refs so it always sends the latest intended state.
  const persist = useCallback(
    async (
      opId: string,
      label: string,
      doWrite: () => Promise<void>,
    ): Promise<void> => {
      try {
        await doWrite();
        clearFailure(opId);
      } catch {
        recordFailure({
          id: opId,
          label,
          retry: () => persist(opId, label, doWrite),
        });
      }
    },
    [],
  );

  const writeThemeMode = useCallback(
    (label: string) =>
      persist(OP.themeMode, label, () =>
        storage.setItem(KEYS.themeMode, themeModeRef.current),
      ),
    [persist],
  );

  const writeFontScale = useCallback(
    (label: string) =>
      persist(OP.fontScale, label, () =>
        storage.setItem(KEYS.fontScale, String(fontStepRef.current)),
      ),
    [persist],
  );

  const writeBookmarks = useCallback(
    (label: string) =>
      persist(OP.bookmarks, label, () =>
        storage.setItem(KEYS.bookmarks, JSON.stringify(bookmarksRef.current)),
      ),
    [persist],
  );

  const writePractitionerVoice = useCallback(
    (label: string) =>
      persist(OP.practitionerVoice, label, () =>
        storage.setItem(
          KEYS.practitionerVoice,
          String(showPractitionerVoiceRef.current),
        ),
      ),
    [persist],
  );

  const writeGlossaryTerms = useCallback(
    (label: string) =>
      persist(OP.glossaryTerms, label, () =>
        storage.setItem(KEYS.glossaryTerms, JSON.stringify(glossaryTermsRef.current)),
      ),
    [persist],
  );

  const writeLookedUpTerms = useCallback(
    (label: string) =>
      persist(OP.lookedUpTerms, label, () =>
        storage.setItem(KEYS.lookedUpTerms, JSON.stringify(lookedUpTermsRef.current)),
      ),
    [persist],
  );

  const togglePractitionerVoice = useCallback(() => {
    const next = !showPractitionerVoiceRef.current;
    showPractitionerVoiceRef.current = next;
    setShowPractitionerVoice(next);
    void writePractitionerVoice("your practitioner voice setting");
  }, [writePractitionerVoice]);

  const setThemeMode = useCallback(
    (m: ThemeMode) => {
      themeModeRef.current = m;
      setThemeModeState(m);
      void writeThemeMode("your theme change");
    },
    [writeThemeMode],
  );

  const cycleTheme = useCallback(() => {
    const order: ThemeMode[] = ["system", "light", "dark"];
    const next =
      order[(order.indexOf(themeModeRef.current) + 1) % order.length];
    themeModeRef.current = next;
    setThemeModeState(next);
    void writeThemeMode("your theme change");
  }, [writeThemeMode]);

  const setFontStepValue = useCallback(
    (step: number) => {
      const clamped = Math.max(0, Math.min(FONT_STEPS.length - 1, step));
      fontStepRef.current = clamped;
      setFontStep(clamped);
      void writeFontScale("your text size change");
    },
    [writeFontScale],
  );

  const increaseFont = useCallback(() => {
    setFontStepValue(fontStepRef.current + 1);
  }, [setFontStepValue]);

  const decreaseFont = useCallback(() => {
    setFontStepValue(fontStepRef.current - 1);
  }, [setFontStepValue]);

  const updateBookmarks = useCallback(
    (next: Bookmark[], label: string) => {
      bookmarksRef.current = next;
      setBookmarks(next);
      void writeBookmarks(label);
    },
    [writeBookmarks],
  );

  const addBookmark = useCallback(
    (b: Omit<Bookmark, "id" | "createdAt">) => {
      const id =
        Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const fresh: Bookmark = { ...b, id, createdAt: Date.now() };
      updateBookmarks(
        [fresh, ...bookmarksRef.current],
        `your bookmark on "${b.chapterTitle}"`,
      );
    },
    [updateBookmarks],
  );

  const removeBookmark = useCallback(
    (id: string) => {
      const target = bookmarksRef.current.find((b) => b.id === id);
      const next = bookmarksRef.current.filter((b) => b.id !== id);
      updateBookmarks(
        next,
        target
          ? `removing your bookmark on "${target.chapterTitle}"`
          : "your bookmark change",
      );
    },
    [updateBookmarks],
  );

  const hasBookmark = useCallback(
    (chapterId: string, excerpt: string) =>
      bookmarks.some(
        (b) => b.chapterId === chapterId && b.excerpt === excerpt,
      ),
    [bookmarks],
  );

  const toggleGlossaryTerm = useCallback(
    (term: string) => {
      const key = normalizeTerm(term);
      const current = glossaryTermsRef.current;
      const next = current.includes(key)
        ? current.filter((t) => t !== key)
        : [key, ...current];
      glossaryTermsRef.current = next;
      setGlossaryTerms(next);
      void writeGlossaryTerms(`your glossary bookmark for "${term}"`);
    },
    [writeGlossaryTerms],
  );

  const isGlossaryTermBookmarked = useCallback(
    (term: string) => glossaryTerms.includes(normalizeTerm(term)),
    [glossaryTerms],
  );

  const recordLookedUp = useCallback(
    (term: string) => {
      const key = normalizeTerm(term);
      if (lookedUpTermsRef.current.includes(key)) return;
      const next = [key, ...lookedUpTermsRef.current];
      lookedUpTermsRef.current = next;
      setLookedUpTerms(next);
      void writeLookedUpTerms(`viewing "${term}"`);
    },
    [writeLookedUpTerms],
  );

  const isLookedUp = useCallback(
    (term: string) => lookedUpTerms.includes(normalizeTerm(term)),
    [lookedUpTerms],
  );

  // Last-read writes fire on every scroll pause; they have nothing
  // meaningful to "retry" so we keep them outside the failed-op
  // registry. Failures still flip the pill via `trackSave`, and a
  // sustained streak surfaces a calm ambient notice (see
  // `LastReadSaveNotice`) so the writer isn't silently sent back to the
  // top of the chapter on next reload.
  const setLastRead = useCallback((r: LastRead) => {
    setLastReadState(r);
    storage
      .setItem(KEYS.lastRead, JSON.stringify(r))
      .then(() => {
        clearAmbientFailure(OP.lastRead);
      })
      .catch(() => {
        recordAmbientFailure({
          id: OP.lastRead,
          message: "Your reading position isn't saving right now.",
        });
      });
  }, []);

  const clearLastRead = useCallback(() => {
    setLastReadState(null);
    storage
      .removeItem(KEYS.lastRead)
      .then(() => {
        clearAmbientFailure(OP.lastRead);
      })
      .catch(() => {
        recordAmbientFailure({
          id: OP.lastRead,
          message: "Your reading position isn't saving right now.",
        });
      });
  }, []);

  const saveScroll = useCallback((chapterId: string, y: number) => {
    scrollMapRef.current[chapterId] = y;
  }, []);

  const getScrollY = useCallback((chapterId: string): number => {
    return scrollMapRef.current[chapterId] ?? 0;
  }, []);

  const saveOriginScroll = useCallback((chapterId: string, y: number) => {
    originScrollMapRef.current[chapterId] = y;
  }, []);

  const takeOriginScroll = useCallback((chapterId: string): number | null => {
    const y = originScrollMapRef.current[chapterId];
    if (y === undefined) return null;
    delete originScrollMapRef.current[chapterId];
    return y;
  }, []);

  const saveOriginBlockIndex = useCallback((chapterId: string, n: number) => {
    originBlockIndexMapRef.current[chapterId] = n;
  }, []);

  const takeOriginBlockIndex = useCallback((chapterId: string): number | null => {
    const n = originBlockIndexMapRef.current[chapterId];
    if (n === undefined) return null;
    delete originBlockIndexMapRef.current[chapterId];
    return n;
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
      getScrollY,
      saveScroll,
      saveOriginScroll,
      takeOriginScroll,
      saveOriginBlockIndex,
      takeOriginBlockIndex,
      showPractitionerVoice,
      togglePractitionerVoice,
      glossaryTerms,
      toggleGlossaryTerm,
      isGlossaryTermBookmarked,
      lookedUpTerms,
      recordLookedUp,
      isLookedUp,
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
      getScrollY,
      saveScroll,
      saveOriginScroll,
      takeOriginScroll,
      saveOriginBlockIndex,
      takeOriginBlockIndex,
      showPractitionerVoice,
      togglePractitionerVoice,
      glossaryTerms,
      toggleGlossaryTerm,
      isGlossaryTermBookmarked,
      lookedUpTerms,
      recordLookedUp,
      isLookedUp,
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

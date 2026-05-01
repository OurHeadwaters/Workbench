import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChapterBlock } from "@/components/ChapterBlock";
import { BottomChrome, TopChrome } from "@/components/Chrome";
import { useReader } from "@/contexts/ReaderState";
import { useHandbookContent } from "@/contexts/HandbookContentContext";
import { chapterExcerpt } from "@/data/handbook";
import { useColors } from "@/hooks/useColors";

const SERIF_BOLD = "Lora_700Bold";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const MONO = "JetBrainsMono_500Medium";

export default function ChapterScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const c = useColors();
  const insets = useSafeAreaInsets();
  const {
    fontScale,
    increaseFont,
    decreaseFont,
    cycleTheme,
    bookmarks,
    addBookmark,
    removeBookmark,
    hasBookmark,
    lastRead,
    setLastRead,
    getScrollY,
    saveScroll,
    saveDeepDiveEntryScrollY,
    takeDeepDiveEntryScrollY,
  } = useReader();
  const { CHAPTERS, getChapter, getNeighbors } = useHandbookContent();

  const chapter = getChapter(id);
  const { prev, next, index } = useMemo(() => getNeighbors(id), [id, getNeighbors]);
  const [chromeVisible, setChromeVisible] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const lastSavedY = useRef(0);
  const currentScrollYRef = useRef(0);
  const restoredFor = useRef<string | null>(null);

  // Restore scroll position when entering this chapter (once).
  // Priority order for §1.7:
  //   1. takeDeepDiveEntryScrollY() — the exact Y the reader was at when they
  //      tapped a Deep Dive link; consumed (set to null) on first read so
  //      a subsequent re-render doesn't re-trigger the scroll.
  //   2. getScrollY in-memory map — updated on every scroll pause this session.
  //   3. lastRead — persisted across sessions.
  // For all other chapters only priorities 2 and 3 apply.
  useEffect(() => {
    if (!chapter) return;
    if (restoredFor.current === chapter.id) return;
    restoredFor.current = chapter.id;

    // resolvedY stays null until a source provides a value. Keeping it
    // null (rather than 0) lets us distinguish "reader was at the very top"
    // (entryY === 0) from "no entry point was stored" (entryY === null).
    let resolvedY: number | null = null;
    if (chapter.id === "1-7") {
      resolvedY = takeDeepDiveEntryScrollY();
    }
    if (resolvedY === null) {
      const fromMap = getScrollY(chapter.id);
      const fromLastRead =
        lastRead?.chapterId === chapter.id ? lastRead.scrollY : 0;
      resolvedY = fromMap > 0 ? fromMap : fromLastRead;
    }

    if (resolvedY > 0 && scrollRef.current) {
      const target = resolvedY;
      // Seed currentScrollYRef so that if the reader taps a deep-dive link
      // before any scroll event fires, the saved entry Y is already correct.
      currentScrollYRef.current = target;
      const t = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: target, animated: false });
      }, 60);
      return () => clearTimeout(t);
    }
    return;
  }, [chapter, lastRead, getScrollY, takeDeepDiveEntryScrollY]);

  const persistPosition = useCallback(
    (y: number) => {
      if (!chapter) return;
      if (Math.abs(y - lastSavedY.current) < 80) return;
      lastSavedY.current = y;
      saveScroll(chapter.id, y);
      setLastRead({ chapterId: chapter.id, scrollY: y });
    },
    [chapter, saveScroll, setLastRead],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      currentScrollYRef.current = y;
      persistPosition(y);
    },
    [persistPosition],
  );

  const goTo = useCallback(
    (target: string) => {
      restoredFor.current = null;
      router.replace({
        pathname: "/chapter/[id]",
        params: { id: target },
      });
    },
    [],
  );

  const onPressRef = useCallback(
    (target: string) => {
      if (Platform.OS !== "web")
        Haptics.selectionAsync().catch(() => {});
      if (chapter?.id === "1-7" && getChapter(target)?.partRoman === "DD") {
        saveDeepDiveEntryScrollY(currentScrollYRef.current);
      }
      goTo(target);
    },
    [goTo, chapter, saveDeepDiveEntryScrollY],
  );

  const goPrev = useCallback(() => {
    if (prev) {
      if (Platform.OS !== "web")
        Haptics.selectionAsync().catch(() => {});
      goTo(prev.id);
    }
  }, [prev, goTo]);

  const goNext = useCallback(() => {
    if (next) {
      if (Platform.OS !== "web")
        Haptics.selectionAsync().catch(() => {});
      goTo(next.id);
    }
  }, [next, goTo]);

  // Swipe horizontal to advance / retreat. Only fires when horizontal
  // movement clearly dominates vertical scroll.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, g) => {
          return (
            Math.abs(g.dx) > 24 && Math.abs(g.dx) > Math.abs(g.dy) * 2.2
          );
        },
        onPanResponderRelease: (_, g) => {
          if (g.dx > 60) goPrev();
          else if (g.dx < -60) goNext();
        },
      }),
    [goPrev, goNext],
  );

  // Toggle chrome on tap.
  const toggleChrome = useCallback(() => {
    setChromeVisible((v) => !v);
  }, []);

  const chapterBookmark = useMemo(() => {
    if (!chapter) return undefined;
    return bookmarks.find(
      (b) => b.chapterId === chapter.id && b.excerpt === "__chapter__",
    );
  }, [bookmarks, chapter]);

  const onToggleChapterBookmark = useCallback(() => {
    if (!chapter) return;
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    if (chapterBookmark) {
      removeBookmark(chapterBookmark.id);
      return;
    }
    addBookmark({
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      partLabel: chapter.partLabel,
      excerpt: "__chapter__",
    });
  }, [addBookmark, chapterBookmark, chapter, removeBookmark]);

  const onLongPressBlock = useCallback(
    (rawText: string) => {
      if (!chapter) return;
      const excerpt = chapterExcerpt(rawText, 140);
      if (Platform.OS !== "web")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
          () => {},
        );
      const existing = bookmarks.find(
        (b) => b.chapterId === chapter.id && b.excerpt === excerpt,
      );
      if (existing) {
        removeBookmark(existing.id);
        return;
      }
      addBookmark({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        partLabel: chapter.partLabel,
        excerpt,
      });
    },
    [addBookmark, bookmarks, chapter, removeBookmark],
  );

  const onPrint = useCallback(() => {
    if (!chapter) return;
    if (Platform.OS !== "web") return;
    const g: { window?: Window } | undefined =
      typeof globalThis !== "undefined"
        ? (globalThis as unknown as { window?: Window })
        : undefined;
    const win = g?.window;
    const href = `/print/${chapter.id}`;
    let opened = false;
    try {
      const handle = win?.open(href, "_blank", "noopener,noreferrer");
      opened = !!handle;
    } catch {
      opened = false;
    }
    if (!opened) {
      router.push({ pathname: "/print/[id]", params: { id: chapter.id } });
    }
  }, [chapter]);

  const onShare = useCallback(async () => {
    if (!chapter) return;
    const opener = chapter.blocks.find((b) => b.kind === "para");
    const opening =
      opener && opener.kind === "para"
        ? chapterExcerpt(opener.text, 240)
        : "";
    const text =
      `${chapter.partLabel} · ${chapter.number} ${chapter.title}\n\n` +
      (opening ? `${opening}\n\n` : "") +
      `— Headwaters: How a Community Runs Its Own Economy`;
    try {
      if (Platform.OS === "web") {
        const nav: any =
          typeof globalThis !== "undefined" ? (globalThis as any).navigator : null;
        if (nav && typeof nav.share === "function") {
          await nav.share({ title: chapter.title, text });
        } else {
          await Clipboard.setStringAsync(text);
        }
      } else {
        await Share.share({ message: text, title: chapter.title });
      }
    } catch {}
  }, [chapter]);

  if (!chapter) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: c.background },
        ]}
      >
        <Text
          style={{
            color: c.foreground,
            fontFamily: SERIF_ITALIC,
            fontSize: 16,
          }}
        >
          Chapter not found.
        </Text>
        <Pressable
          onPress={() => router.replace("/contents")}
          style={{ marginTop: 12 }}
        >
          <Text
            style={{
              color: c.foreground,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Back to contents
          </Text>
        </Pressable>
      </View>
    );
  }

  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;
  const topPad = Math.max(insets.top, webTop) + 56;
  const bottomPad = Math.max(insets.bottom, webBottom) + 56;
  const chapterBookmarkActive = !!chapterBookmark;
  const total = CHAPTERS.length;
  const progressPct = total > 1 ? Math.round((index / (total - 1)) * 100) : 0;
  const hasPartLanding = chapter.partRoman === "V";
  const isDeepDive = chapter.partRoman === "DD";
  const goToPartLanding = useCallback(() => {
    router.push({
      pathname: "/part/[roman]",
      params: { roman: chapter.partRoman },
    });
  }, [chapter.partRoman]);
  const goToSpine = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    restoredFor.current = null;
    router.replace({
      pathname: "/chapter/[id]",
      params: { id: "1-7" },
    });
  }, []);

  return (
    <View
      style={[styles.root, { backgroundColor: c.background }]}
      {...panResponder.panHandlers}
    >
      <Pressable onPress={toggleChrome} style={styles.tapLayer}>
        <ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={120}
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: topPad,
              paddingBottom: bottomPad,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[
              styles.chapterEyebrow,
              { color: c.mutedForeground, fontFamily: MONO },
            ]}
          >
            {chapter.partLabel} · {chapter.number}
          </Text>
          <Text
            style={[
              styles.chapterTitle,
              {
                color: c.foreground,
                fontFamily: SERIF_BOLD,
                fontSize: 28 * fontScale,
                lineHeight: 28 * fontScale * 1.25,
              },
            ]}
          >
            {chapter.title}
          </Text>
          <View style={[styles.titleRule, { backgroundColor: c.rule }]} />

          {chapter.blocks.map((b, i) => {
            const text =
              b.kind === "para" || b.kind === "callout" || b.kind === "pull"
                ? b.text
                : "";
            const excerpt = text ? chapterExcerpt(text, 140) : "";
            const bookmarked =
              text.length > 0 ? hasBookmark(chapter.id, excerpt) : false;
            return (
              <ChapterBlock
                key={i}
                block={b}
                fontScale={fontScale}
                onLongPress={onLongPressBlock}
                bookmarked={bookmarked}
                onPressRef={onPressRef}
              />
            );
          })}

          <View style={{ height: 24 }} />
          <View style={[styles.endRule, { backgroundColor: c.rule }]} />
          {hasPartLanding ? (
            <Pressable
              onPress={goToPartLanding}
              hitSlop={8}
              style={({ pressed }) => [
                styles.partLandingLink,
                pressed && { opacity: 0.6 },
              ]}
              accessibilityLabel={`Back to Part ${chapter.partRoman}`}
            >
              <Text
                style={[
                  styles.partLandingText,
                  { color: c.foreground, fontFamily: MONO },
                ]}
              >
                {`← Back to ${chapter.partLabel}`}
              </Text>
            </Pressable>
          ) : null}
          {isDeepDive ? (
            <Pressable
              onPress={goToSpine}
              hitSlop={8}
              style={({ pressed }) => [
                styles.partLandingLink,
                pressed && { opacity: 0.6 },
              ]}
              accessibilityLabel="Back to §1.7 — Nearest Neighbours"
            >
              <Text
                style={[
                  styles.partLandingText,
                  { color: c.foreground, fontFamily: MONO },
                ]}
              >
                {"← Back to §1.7 — Nearest Neighbours"}
              </Text>
            </Pressable>
          ) : null}
          <Text
            style={[
              styles.endLine,
              { color: c.mutedForeground, fontFamily: MONO },
            ]}
          >
            {next
              ? `Next · ${next.number} ${next.title}`
              : `End of the handbook · ${progressPct}%`}
          </Text>
        </ScrollView>
      </Pressable>

      <TopChrome
        visible={chromeVisible}
        partLabel={chapter.partLabel}
        chapterNumber={chapter.number}
        bookmarkActive={chapterBookmarkActive}
        onBack={() =>
          hasPartLanding ? goToPartLanding() : router.push("/contents")
        }
        onToggleBookmark={onToggleChapterBookmark}
      />

      <BottomChrome
        visible={chromeVisible}
        onDecreaseFont={decreaseFont}
        onIncreaseFont={increaseFont}
        onCycleTheme={cycleTheme}
        onShare={onShare}
        onPrint={onPrint}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={!!prev}
        hasNext={!!next}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tapLayer: { flex: 1 },
  scroll: { paddingHorizontal: 28 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  chapterEyebrow: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  chapterTitle: {
    letterSpacing: -0.3,
  },
  titleRule: {
    height: 1,
    width: 56,
    marginTop: 18,
    marginBottom: 14,
    opacity: 0.7,
  },
  endRule: {
    height: 1,
    width: 56,
    marginTop: 32,
    marginBottom: 14,
    opacity: 0.6,
  },
  endLine: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  partLandingLink: {
    paddingVertical: 4,
    marginBottom: 10,
  },
  partLandingText: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});

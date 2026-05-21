import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useHandbookContent } from "@/contexts/HandbookContentContext";
import { useReader } from "@/contexts/ReaderState";
import { JournalNav } from "@/components/JournalNav";
import { J } from "@/theme/journal";

const MONO = J.font.mono;

export default function Contents() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { lastRead, bookmarks } = useReader();
  const { PARTS } = useHandbookContent();
  const webTop    = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const bookmarkedChapters = new Set(bookmarks.map((b) => b.chapterId));

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* ── Header chrome ── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, webTop) + 8,
            backgroundColor: c.chrome,
            borderBottomColor: c.chromeBorder,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={22} color={c.foreground} />
        </Pressable>

        {/* Title */}
        <View style={styles.headerCenter}>
          <Text style={[styles.headerEyebrow, { fontFamily: MONO, color: J.color.amber }]}>
            FIELD JOURNAL
          </Text>
          <Text style={[styles.headerTitle, { fontFamily: MONO, color: c.mutedForeground }]}>
            Contents
          </Text>
        </View>

        <Pressable
          onPress={() => router.replace("/")}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Home"
        >
          <Ionicons name="home-outline" size={20} color={c.foreground} />
        </Pressable>
      </View>

      {/* ── Journal navigation ── */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, webBottom) + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <JournalNav
          parts={PARTS}
          activeChapterId={lastRead?.chapterId}
          bookmarkedIds={bookmarkedChapters}
          lastReadId={lastRead?.chapterId}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerEyebrow: {
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 1,
  },
  headerTitle: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  iconBtn: {
    minWidth: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

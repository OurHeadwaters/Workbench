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
import { useReader } from "@/contexts/ReaderState";
import { PARTS } from "@/data/handbook";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function Contents() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { lastRead, bookmarks } = useReader();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const bookmarkedChapters = new Set(bookmarks.map((b) => b.chapterId));

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, webTop) + 8,
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
        <Text
          style={{
            color: c.mutedForeground,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            flex: 1,
            textAlign: "center",
          }}
        >
          Contents
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: Math.max(insets.bottom, webBottom) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {PARTS.map((p) => {
          const hasLanding = p.roman === "VI";
          const headContent = (
            <>
              <Text
                style={[
                  styles.roman,
                  { color: c.mutedForeground, fontFamily: MONO },
                ]}
              >
                {p.roman}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.partTitle,
                    { color: c.foreground, fontFamily: SERIF_BOLD },
                  ]}
                >
                  {p.title}
                </Text>
                <Text
                  style={[
                    styles.partBlurb,
                    {
                      color: c.mutedForeground,
                      fontFamily: SERIF_ITALIC,
                    },
                  ]}
                >
                  {p.blurb}
                </Text>
                {hasLanding ? (
                  <Text
                    style={[
                      styles.partLink,
                      { color: c.mutedForeground, fontFamily: MONO },
                    ]}
                  >
                    {`Open Part ${p.roman} as a set →`}
                  </Text>
                ) : null}
              </View>
            </>
          );
          return (
            <View key={p.roman} style={styles.partBlock}>
              {hasLanding ? (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/part/[roman]",
                      params: { roman: p.roman },
                    })
                  }
                  style={({ pressed }) => [
                    styles.partHead,
                    pressed && { opacity: 0.65 },
                  ]}
                  accessibilityLabel={`Open Part ${p.roman} landing page`}
                >
                  {headContent}
                </Pressable>
              ) : (
                <View style={styles.partHead}>{headContent}</View>
              )}
              <View style={[styles.rule, { backgroundColor: c.rule }]} />
              {p.chapters.map((ch) => {
                const isLast = lastRead?.chapterId === ch.id;
                const isBookmarked = bookmarkedChapters.has(ch.id);
                return (
                  <Pressable
                    key={ch.id}
                    onPress={() =>
                      router.push({
                        pathname: "/chapter/[id]",
                        params: { id: ch.id },
                      })
                    }
                    style={({ pressed }) => [
                      styles.chapterRow,
                      pressed && { opacity: 0.6 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chapterNum,
                        { color: c.mutedForeground, fontFamily: MONO },
                      ]}
                    >
                      {ch.number}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.chapterTitle,
                          { color: c.foreground, fontFamily: SERIF },
                        ]}
                      >
                        {ch.title}
                      </Text>
                    </View>
                    <View style={styles.markers}>
                      {isBookmarked ? (
                        <Ionicons
                          name="bookmark"
                          size={14}
                          color={c.foreground}
                        />
                      ) : null}
                      {isLast ? (
                        <View
                          style={[
                            styles.dot,
                            { backgroundColor: c.foreground },
                          ]}
                        />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
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
  iconBtn: {
    minWidth: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { paddingHorizontal: 24, paddingTop: 16 },
  partBlock: { marginBottom: 28 },
  partHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingTop: 8,
  },
  roman: {
    fontSize: 12,
    width: 24,
    paddingTop: 6,
    letterSpacing: 1.5,
  },
  partTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  partBlurb: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  partLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 8,
  },
  rule: {
    height: 1,
    marginTop: 14,
    marginBottom: 6,
    marginLeft: 40,
    opacity: 0.6,
  },
  chapterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 40,
    gap: 12,
  },
  chapterNum: {
    fontSize: 11,
    width: 36,
    letterSpacing: 1,
  },
  chapterTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  markers: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

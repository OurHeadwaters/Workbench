import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import {
  chapterOpening,
  chapterSmallLine,
  getPart,
} from "@/data/handbook";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function PartLanding() {
  const params = useLocalSearchParams<{ roman: string }>();
  const roman = typeof params.roman === "string" ? params.roman : "";
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { lastRead, bookmarks } = useReader();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const part = getPart(roman);

  if (!part) {
    return (
      <View
        style={[styles.center, { backgroundColor: c.background }]}
      >
        <Text
          style={{
            color: c.foreground,
            fontFamily: SERIF_ITALIC,
            fontSize: 16,
          }}
        >
          Part not found.
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
          onPress={() => router.push("/contents")}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Back to contents"
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
          Part {part.roman}
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
        <Text
          style={[
            styles.eyebrow,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          {`PART ${part.roman}`}
        </Text>
        <Text
          style={[
            styles.partTitle,
            { color: c.foreground, fontFamily: SERIF_BOLD },
          ]}
        >
          {part.title}
        </Text>
        <View style={[styles.titleRule, { backgroundColor: c.rule }]} />
        <Text
          style={[
            styles.blurb,
            { color: c.foreground, fontFamily: SERIF_ITALIC },
          ]}
        >
          {part.blurb}
        </Text>

        <Text
          style={[
            styles.sectionEyebrow,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          {`${part.chapters.length} ${
            part.chapters.length === 1 ? "QUESTION" : "QUESTIONS"
          } KEPT OPEN`}
        </Text>

        {part.chapters.map((ch, i) => {
          const isLast = lastRead?.chapterId === ch.id;
          const isBookmarked = bookmarkedChapters.has(ch.id);
          const small = chapterSmallLine(ch);
          const opening = chapterOpening(ch, 220);
          return (
            <View key={ch.id}>
              {i > 0 ? (
                <View
                  style={[styles.chapterRule, { backgroundColor: c.rule }]}
                />
              ) : null}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/chapter/[id]",
                    params: { id: ch.id },
                  })
                }
                style={({ pressed }) => [
                  styles.chapterBlock,
                  pressed && { opacity: 0.65 },
                ]}
              >
                <View style={styles.chapterHead}>
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
                        { color: c.foreground, fontFamily: SERIF_BOLD },
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
                </View>
                {small ? (
                  <Text
                    style={[
                      styles.chapterSmall,
                      { color: c.mutedForeground, fontFamily: MONO },
                    ]}
                  >
                    {small}
                  </Text>
                ) : null}
                {opening ? (
                  <Text
                    style={[
                      styles.chapterExcerpt,
                      { color: c.foreground, fontFamily: SERIF },
                    ]}
                  >
                    {opening}
                  </Text>
                ) : null}
                <Text
                  style={[
                    styles.openLink,
                    { color: c.mutedForeground, fontFamily: MONO },
                  ]}
                >
                  Read · §{ch.number} →
                </Text>
              </Pressable>
            </View>
          );
        })}

        <View style={[styles.endRule, { backgroundColor: c.rule }]} />
        <Text
          style={[
            styles.colophon,
            { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
          ]}
        >
          Returned to as the answer changes. New open questions appear here when
          the discipline meets a thing it cannot yet answer.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  scroll: { paddingHorizontal: 28, paddingTop: 24 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  partTitle: {
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.4,
  },
  titleRule: {
    height: 1,
    width: 56,
    marginTop: 18,
    marginBottom: 16,
    opacity: 0.7,
  },
  blurb: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 36,
  },
  sectionEyebrow: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 18,
  },
  chapterRule: {
    height: 1,
    marginVertical: 20,
    opacity: 0.5,
  },
  chapterBlock: {
    paddingVertical: 4,
  },
  chapterHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  chapterNum: {
    fontSize: 12,
    width: 36,
    paddingTop: 4,
    letterSpacing: 1,
  },
  chapterTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  markers: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chapterSmall: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 10,
    marginLeft: 50,
  },
  chapterExcerpt: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    marginLeft: 50,
  },
  openLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 12,
    marginLeft: 50,
  },
  endRule: {
    height: 1,
    width: 56,
    marginTop: 36,
    marginBottom: 14,
    opacity: 0.6,
  },
  colophon: {
    fontSize: 14,
    lineHeight: 22,
  },
});

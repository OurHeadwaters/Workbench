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

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function Contents() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { lastRead, bookmarks } = useReader();
  const { PARTS } = useHandbookContent();
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
        <Pressable
          onPress={() => router.replace("/")}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Home"
        >
          <Ionicons name="home-outline" size={20} color={c.foreground} />
        </Pressable>
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
        {PARTS.map((p, idx) => {
          const isBackMatter = p.kind === "backMatter";
          const prev = idx > 0 ? PARTS[idx - 1] : undefined;
          const isCoda = p.roman === "CODA";
          const showBackMatterDivider =
            isBackMatter && !isCoda && (!prev || prev.kind !== "backMatter");
          const showCodaDivider = isCoda;
          const hasLanding = p.roman === "V" || p.roman === "III";
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
              {showBackMatterDivider ? (
                <View style={styles.backMatterDivider}>
                  <View
                    style={[
                      styles.backMatterRule,
                      { backgroundColor: c.rule },
                    ]}
                  />
                  <Text
                    style={[
                      styles.backMatterLabel,
                      { color: c.mutedForeground, fontFamily: MONO },
                    ]}
                  >
                    Back Matter
                  </Text>
                  <View
                    style={[
                      styles.backMatterRule,
                      { backgroundColor: c.rule },
                    ]}
                  />
                </View>
              ) : null}
              {showCodaDivider ? (
                <View style={styles.backMatterDivider}>
                  <View
                    style={[
                      styles.backMatterRule,
                      { backgroundColor: c.rule },
                    ]}
                  />
                  <Text
                    style={[
                      styles.backMatterLabel,
                      { color: c.mutedForeground, fontFamily: MONO },
                    ]}
                  >
                    Conclusion
                  </Text>
                  <View
                    style={[
                      styles.backMatterRule,
                      { backgroundColor: c.rule },
                    ]}
                  />
                </View>
              ) : null}
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
                            { backgroundColor: c.rust },
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
  backMatterDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
    marginBottom: 18,
  },
  backMatterRule: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  backMatterLabel: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
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

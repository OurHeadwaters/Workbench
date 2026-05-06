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

import { useHandbookContent } from "@/contexts/HandbookContentContext";
import { useReader } from "@/contexts/ReaderState";
import { useColors } from "@/hooks/useColors";
import { constellation } from "@/data/constellation";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function FrontPage() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { lastRead, bookmarks } = useReader();
  const { CHAPTERS, getChapter, PARTS } = useHandbookContent();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const lastChapter = lastRead ? getChapter(lastRead.chapterId) : undefined;
  const firstChapter = CHAPTERS[0];

  const beginLabel = lastChapter
    ? `Continue · ${lastChapter.number} ${lastChapter.title}`
    : `Begin reading · ${firstChapter.number} ${firstChapter.title}`;

  const beginTarget = lastChapter ? lastChapter.id : firstChapter.id;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 24,
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
          A CODETRY HANDBOOK
        </Text>
        <Text
          style={[
            styles.title,
            { color: c.foreground, fontFamily: SERIF_BOLD },
          ]}
        >
          Headwaters
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: c.foreground, fontFamily: SERIF_ITALIC },
          ]}
        >
          How a Community Runs Its Own Economy
        </Text>
        <View style={[styles.rule, { backgroundColor: c.rule }]} />
        <Text
          style={[
            styles.epigraph,
            { color: c.pullQuote, fontFamily: SERIF_ITALIC },
          ]}
        >
          {constellation.grammar.axiom}
        </Text>
        <View
          style={[styles.lifePreserverRule, { backgroundColor: c.rule }]}
        />
        <Text
          style={[
            styles.lifePreserver,
            { color: c.foreground, fontFamily: SERIF_ITALIC },
          ]}
        >
          {"When we are underwater, we need a lifeguard to help us come up for air \u2014 this is your life preserver. Work it the best way you know how to lay it, using codetry like a stone mason."}
        </Text>
        <Text
          style={[
            styles.byline,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          {`v${constellation.version} · ${constellation.lastUpdated} · offline-readable`}
        </Text>

        <View style={{ height: 36 }} />

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/chapter/[id]",
              params: { id: beginTarget },
            })
          }
          style={({ pressed }) => [
            styles.primaryBtn,
            {
              backgroundColor: c.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text
            style={{
              color: c.primaryForeground,
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {beginLabel}
          </Text>
        </Pressable>

        <View style={styles.row}>
          <Pressable
            onPress={() => router.push("/contents")}
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                borderColor: c.foreground,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
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
              Contents
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/bookmarks")}
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                borderColor: c.foreground,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
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
              Bookmarks · {bookmarks.length}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/daily-prompt")}
          style={({ pressed }) => [
            styles.authorBtn,
            {
              borderColor: c.rule,
              backgroundColor: c.card,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: c.foreground,
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Daily Prompt
            </Text>
            <Text
              style={{
                color: c.mutedForeground,
                fontFamily: SERIF_ITALIC,
                fontSize: 13,
                marginTop: 3,
              }}
            >
              One question, drawn from the constellation
            </Text>
          </View>
          <Text
            style={{
              color: c.mutedForeground,
              fontFamily: MONO,
              fontSize: 18,
            }}
          >
            {"→"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/author")}
          style={({ pressed }) => [
            styles.authorBtn,
            {
              borderColor: c.rule,
              backgroundColor: c.card,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: c.foreground,
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {"Author\u2019s Desk"}
            </Text>
            <Text
              style={{
                color: c.mutedForeground,
                fontFamily: SERIF_ITALIC,
                fontSize: 13,
                marginTop: 3,
              }}
            >
              {"Your constellation, in your words"}
            </Text>
          </View>
          <Text
            style={{
              color: c.mutedForeground,
              fontFamily: MONO,
              fontSize: 18,
            }}
          >
            {"→"}
          </Text>
        </Pressable>


        <View style={{ height: 32 }} />

        <Text
          style={[
            styles.eyebrow,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          BEGIN — TAP ANY PART
        </Text>
        {PARTS.filter(
          (p) => p.kind !== "backMatter" && p.kind !== "frontMatter",
        ).map((p) => {
          const firstChapter = CHAPTERS.find((ch) => ch.partRoman === p.roman);
          return (
            <Pressable
              key={p.roman}
              onPress={() => {
                if (firstChapter) {
                  router.push({
                    pathname: "/chapter/[id]",
                    params: { id: firstChapter.id },
                  });
                }
              }}
              style={({ pressed }) => [
                styles.partRow,
                {
                  borderBottomColor: c.rule,
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.partRoman,
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
                    { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
                  ]}
                >
                  {p.blurb}
                </Text>
              </View>
              <Text
                style={{
                  color: c.mutedForeground,
                  fontFamily: MONO,
                  fontSize: 18,
                  paddingTop: 2,
                }}
              >
                →
              </Text>
            </Pressable>
          );
        })}

        <View style={{ height: 32 }} />
        <Text
          style={[
            styles.colophon,
            { color: c.mutedForeground, fontFamily: SERIF },
          ]}
        >
          Drawn from the constellation manifest. The discipline travels; the
          examples don't.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 28 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 30,
    marginTop: 4,
  },
  rule: {
    height: 1,
    width: 56,
    marginTop: 24,
    marginBottom: 24,
    opacity: 0.7,
  },
  epigraph: {
    fontSize: 17,
    lineHeight: 26,
  },
  lifePreserverRule: {
    height: 1,
    width: 28,
    marginTop: 22,
    marginBottom: 18,
    opacity: 0.5,
  },
  lifePreserver: {
    fontSize: 16,
    lineHeight: 25,
  },
  byline: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 18,
  },
  primaryBtn: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 4,
  },
  partRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  partRoman: {
    fontSize: 13,
    width: 28,
    paddingTop: 4,
    letterSpacing: 1,
  },
  partTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  partBlurb: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 2,
  },
  colophon: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },
  toolRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 4,
  },
  toolTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  toolBlurb: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  toolArrow: {
    fontSize: 18,
    letterSpacing: 1,
  },
  sargeRow: {
    backgroundColor: "rgba(15,118,110,0.04)",
  },
  authorBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 4,
  },
});

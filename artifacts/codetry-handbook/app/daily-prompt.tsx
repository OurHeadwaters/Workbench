import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { constellation } from "@/data/constellation";
import { useColors } from "@/hooks/useColors";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

type PromptEntry = {
  zoneName: string;
  zoneLabel: string;
  prompt: string;
};

function buildPrompts(): PromptEntry[] {
  const entries: PromptEntry[] = [];

  for (const z of constellation.zones) {
    if (z.inlinePrompt) {
      entries.push({
        zoneName: z.name,
        zoneLabel: `Zone ${z.zone} · ${z.name}`,
        prompt: z.inlinePrompt,
      });
    }
  }

  if (Array.isArray(constellation.preZone)) {
    for (const z of constellation.preZone) {
      if (z.inlinePrompt) {
        entries.push({
          zoneName: z.name,
          zoneLabel: `Pre-Zone · ${z.name}`,
          prompt: z.inlinePrompt,
        });
      }
    }
  }

  return entries;
}

function todayIndex(total: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % total;
}

const PROMPTS = buildPrompts();

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
}

export default function DailyPromptScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  if (PROMPTS.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <View
          style={[
            styles.inner,
            {
              paddingTop: Math.max(insets.top, webTop) + 24,
              paddingBottom: Math.max(insets.bottom, webBottom) + 32,
            },
          ]}
        >
          <Pressable onPress={goBack} hitSlop={12} style={{ marginBottom: 28 }}>
            <Text style={[styles.back, { color: c.mutedForeground, fontFamily: MONO }]}>
              ← Back
            </Text>
          </Pressable>
          <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
            Daily Prompt
          </Text>
          <View style={[styles.rule, { backgroundColor: c.rule }]} />
          <Text style={{ color: c.mutedForeground, fontFamily: SERIF_ITALIC, fontSize: 16, lineHeight: 26 }}>
            No prompts are available yet. Check back once the zone chapters have been populated.
          </Text>
        </View>
      </View>
    );
  }

  const defaultIndex = todayIndex(PROMPTS.length);
  const [index, setIndex] = useState(defaultIndex);

  const entry = PROMPTS[index];
  const isToday = index === defaultIndex;

  function prev() {
    setIndex((i) => (i - 1 + PROMPTS.length) % PROMPTS.length);
  }

  function next() {
    setIndex((i) => (i + 1) % PROMPTS.length);
  }

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: c.background },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            paddingTop: Math.max(insets.top, webTop) + 24,
            paddingBottom: Math.max(insets.bottom, webBottom) + 32,
          },
        ]}
      >
        <Pressable
          onPress={goBack}
          hitSlop={12}
          style={{ marginBottom: 28 }}
        >
          <Text
            style={[
              styles.back,
              { color: c.mutedForeground, fontFamily: MONO },
            ]}
          >
            ← Back
          </Text>
        </Pressable>

        <Text
          style={[
            styles.eyebrow,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          Daily Prompt
        </Text>

        <View
          style={[styles.rule, { backgroundColor: c.rule }]}
        />

        <View style={[styles.card, { borderColor: c.rule, backgroundColor: c.card }]}>
          <Text
            style={[
              styles.zoneLabel,
              { color: c.mutedForeground, fontFamily: MONO },
            ]}
          >
            {entry.zoneLabel}
          </Text>

          <Text
            style={[
              styles.prompt,
              { color: c.foreground, fontFamily: SERIF_ITALIC },
            ]}
          >
            {entry.prompt}
          </Text>

          {isToday && (
            <View style={[styles.todayBadge, { borderColor: c.primary }]}>
              <Text
                style={[
                  styles.todayText,
                  { color: c.primary, fontFamily: MONO },
                ]}
              >
                Today's prompt
              </Text>
            </View>
          )}
        </View>

        <View style={styles.dotsRow}>
          {PROMPTS.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => setIndex(i)}
              hitSlop={8}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === index
                      ? c.foreground
                      : i === defaultIndex
                        ? c.primary
                        : c.rule,
                  width: i === index ? 18 : 7,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.navRow}>
          <Pressable
            onPress={prev}
            style={({ pressed }) => [
              styles.navBtn,
              {
                borderColor: c.rule,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.navBtnText,
                { color: c.foreground, fontFamily: MONO },
              ]}
            >
              ← Prev
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setIndex(defaultIndex)}
            style={({ pressed }) => [
              styles.todayBtn,
              {
                backgroundColor: c.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.todayBtnText,
                { color: c.primaryForeground, fontFamily: MONO },
              ]}
            >
              Today
            </Text>
          </Pressable>

          <Pressable
            onPress={next}
            style={({ pressed }) => [
              styles.navBtn,
              {
                borderColor: c.rule,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.navBtnText,
                { color: c.foreground, fontFamily: MONO },
              ]}
            >
              Next →
            </Text>
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />

        <Text
          style={[
            styles.footer,
            { color: c.mutedForeground, fontFamily: SERIF },
          ]}
        >
          {`${index + 1} of ${PROMPTS.length} prompts · cycles daily`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
  },
  back: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  rule: {
    height: 1,
    width: 48,
    marginBottom: 32,
    opacity: 0.6,
  },
  card: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 24,
    marginBottom: 28,
  },
  zoneLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  prompt: {
    fontSize: 22,
    lineHeight: 34,
  },
  todayBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 20,
  },
  todayText: {
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
  },
  navBtnText: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  todayBtn: {
    flex: 1,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
  },
  todayBtnText: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footer: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 24,
    fontStyle: "italic",
  },
});

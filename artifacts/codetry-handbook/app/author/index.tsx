import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ZONE_AUTHOR_ENTRIES } from "@/data/authorPrompts";
import { useColors } from "@/hooks/useColors";
import { useAuthor } from "@/lib/authorStore";

const SERIF = "Lora_700Bold";
const SERIF_I = "Lora_400Regular_Italic";
const MONO = "JetBrainsMono_500Medium";

export default function AuthorIndex() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { countAnswers } = useAuthor();

  const webTop = typeof navigator !== "undefined" ? 67 : 0;
  const webBottom = typeof navigator !== "undefined" ? 34 : 0;

  const totalPrompts = ZONE_AUTHOR_ENTRIES.reduce(
    (sum, z) => sum + z.prompts.length,
    0,
  );
  const totalDone = ZONE_AUTHOR_ENTRIES.reduce(
    (sum, z) => sum + countAnswers(z.id, z.prompts.length),
    0,
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 24,
            paddingBottom: Math.max(insets.bottom, webBottom) + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={{ marginBottom: 20 }}
        >
          <Text style={[styles.back, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Back
          </Text>
        </Pressable>

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          Author's Desk
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF }]}>
          Your constellation,{"\n"}in your words
        </Text>
        <Text style={[styles.body, { color: c.mutedForeground, fontFamily: SERIF_I }]}>
          Each zone has a short set of prompts — questions to pull out what you know and have lived. Answer one before bed, one in the morning. Your answers stay on this device.
        </Text>

        <View style={[styles.totalRow, { borderColor: c.rule }]}>
          <Text style={[styles.totalLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
            Overall
          </Text>
          <Text style={[styles.totalCount, { color: c.foreground, fontFamily: MONO }]}>
            {totalDone} / {totalPrompts}
          </Text>
        </View>

        <View style={{ height: 8 }} />

        {ZONE_AUTHOR_ENTRIES.map((entry) => {
          const done = countAnswers(entry.id, entry.prompts.length);
          const total = entry.prompts.length;
          const pct = done / total;
          const complete = done === total;

          return (
            <Pressable
              key={entry.id}
              onPress={() =>
                router.push({
                  pathname: "/author/[zone]",
                  params: { zone: entry.id },
                })
              }
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: c.card,
                  borderColor: complete ? c.primary : c.rule,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <Text
                  style={[styles.cardName, { color: c.foreground, fontFamily: SERIF }]}
                >
                  {entry.name}
                </Text>
                <Text
                  style={[
                    styles.cardCount,
                    { color: complete ? c.primary : c.mutedForeground, fontFamily: MONO },
                  ]}
                >
                  {done}/{total}
                </Text>
              </View>
              <Text
                style={[styles.cardSub, { color: c.mutedForeground, fontFamily: MONO }]}
              >
                {entry.subtitle}
              </Text>
              <View style={[styles.bar, { backgroundColor: c.rule }]}>
                {pct > 0 && (
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: c.primary,
                        width: `${Math.round(pct * 100)}%` as any,
                      },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[styles.cardArrow, { color: c.mutedForeground, fontFamily: MONO }]}
              >
                {done === 0
                  ? "Start →"
                  : done === total
                    ? "Done · Revisit →"
                    : `${total - done} left →`}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 24 },
  back: { fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: { fontSize: 30, lineHeight: 38, marginBottom: 14 },
  body: { fontSize: 15, lineHeight: 24 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  totalLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  totalCount: { fontSize: 13, letterSpacing: 1 },
  card: {
    borderRadius: 6,
    borderWidth: 1,
    padding: 18,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardName: { fontSize: 20, lineHeight: 26 },
  cardCount: { fontSize: 11, letterSpacing: 1.2 },
  cardSub: {
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  bar: { height: 2, borderRadius: 1, overflow: "hidden", marginBottom: 12 },
  barFill: { height: 2, borderRadius: 1 },
  cardArrow: { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" },
});

// Trail journal — a retrospective view of all stations the reader has
// walked, in the order they were completed, with dates, gaps, and notes.

import { router } from "expo-router";
import React, { useMemo } from "react";
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
import { useColors } from "@/hooks/useColors";
import { usePioneerPath } from "@/lib/pioneerPath/store";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

const ROMAN: Record<number, string> = {
  1: "I",   2: "II",   3: "III",  4: "IV",   5: "V",
  6: "VI",  7: "VII",  8: "VIII", 9: "IX",   10: "X",
  11: "XI", 12: "XII", 13: "XIII",14: "XIV",  15: "XV",
  16: "XVI",17: "XVII",18: "XVIII",19: "XIX", 20: "XX",
};

function formatDate(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysBetween(a: number, b: number): number {
  return Math.round(Math.abs(b - a) / (1000 * 60 * 60 * 24));
}

export default function JournalScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { progress, ready } = usePioneerPath();
  const { PIONEER_STATIONS } = useHandbookContent();

  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const walkedEntries = useMemo(() => {
    const entries = PIONEER_STATIONS
      .map((s) => {
        const c = progress.completed[s.id];
        if (!c) return null;
        return { station: s, completion: c };
      })
      .filter(Boolean) as { station: (typeof PIONEER_STATIONS)[number]; completion: { completedAt: number; note?: string; photoUri?: string } }[];

    entries.sort((a, b) => a.completion.completedAt - b.completion.completedAt);
    return entries;
  }, [progress.completed, PIONEER_STATIONS]);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 28,
            paddingBottom: Math.max(insets.bottom, webBottom) + 48,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.push("/path")}
          accessibilityLabel="Back to trail"
          style={styles.backRow}
        >
          <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Trail
          </Text>
        </Pressable>

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          YOUR WALK
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          Trail Journal
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {!ready ? null : walkedEntries.length === 0 ? (
          <EmptyState c={c} />
        ) : (
          <>
            <Text style={[styles.countLine, { color: c.mutedForeground, fontFamily: MONO }]}>
              {walkedEntries.length === 1
                ? "1 station walked"
                : `${walkedEntries.length} stations walked`}
            </Text>

            {walkedEntries.map((entry, i) => {
              const prev = walkedEntries[i - 1];
              const gap = prev
                ? daysBetween(prev.completion.completedAt, entry.completion.completedAt)
                : null;

              return (
                <View key={entry.station.id}>
                  {gap !== null && gap > 0 ? (
                    <View style={styles.gapRow}>
                      <View style={[styles.gapLine, { backgroundColor: c.rule }]} />
                      <Text style={[styles.gapLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                        {gap === 1 ? "1 day later" : `${gap} days later`}
                      </Text>
                      <View style={[styles.gapLine, { backgroundColor: c.rule }]} />
                    </View>
                  ) : null}

                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/path/station/[id]",
                        params: { id: entry.station.id },
                      })
                    }
                    style={({ pressed }) => [
                      styles.entryCard,
                      {
                        borderColor: c.rule,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.entryOrdinal, { color: c.mutedForeground, fontFamily: MONO }]}
                    >
                      STATION {ROMAN[entry.station.ordinal] ?? entry.station.ordinal}
                    </Text>
                    <Text style={[styles.entryName, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                      {entry.station.name}
                    </Text>
                    <Text style={[styles.entrySub, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                      {entry.station.subtitle}
                    </Text>
                    <Text style={[styles.entryDate, { color: c.mutedForeground, fontFamily: MONO }]}>
                      Walked {formatDate(entry.completion.completedAt)}
                    </Text>
                    {entry.completion.note ? (
                      <View style={[styles.noteBlock, { borderLeftColor: c.rule }]}>
                        <Text style={[styles.noteText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                          "{entry.completion.note}"
                        </Text>
                      </View>
                    ) : null}
                  </Pressable>
                </View>
              );
            })}

            <View style={[styles.endRule, { backgroundColor: c.rule }]} />
            <Text style={[styles.foot, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              {walkedEntries.length < PIONEER_STATIONS.length
                ? `${PIONEER_STATIONS.length - walkedEntries.length} station${PIONEER_STATIONS.length - walkedEntries.length === 1 ? "" : "s"} still ahead.`
                : "The trail is walked. Every station is yours."}
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function EmptyState({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
        Nothing walked yet
      </Text>
      <Text style={[styles.emptyBody, { color: c.mutedForeground, fontFamily: SERIF }]}>
        Your journal fills in as you walk. Head back to the trail and open
        Station I to begin.
      </Text>
      <Pressable
        onPress={() => router.push("/path")}
        style={({ pressed }) => [styles.emptyBtn, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Text style={[styles.emptyBtnLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
          Go to the trail →
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 22,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  backRow: {
    marginBottom: 20,
  },
  backLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  rule: {
    height: 1,
    marginVertical: 18,
    opacity: 0.7,
  },
  countLine: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  gapRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  gapLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    opacity: 0.5,
  },
  gapLabel: {
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  entryCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  entryOrdinal: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  entryName: {
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  entrySub: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  entryDate: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 10,
  },
  noteBlock: {
    borderLeftWidth: 2,
    paddingLeft: 12,
    marginTop: 10,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 21,
  },
  endRule: {
    height: 1,
    marginTop: 28,
    marginBottom: 16,
    opacity: 0.6,
  },
  foot: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  empty: {
    paddingTop: 32,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.3,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 320,
    marginBottom: 24,
  },
  emptyBtn: {
    paddingVertical: 10,
  },
  emptyBtnLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});

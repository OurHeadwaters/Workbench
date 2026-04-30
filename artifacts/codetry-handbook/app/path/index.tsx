// The trail map: station list with locked/unlocked/completed markers.

import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConstellationMap } from "@/components/path/ConstellationMap";
import { useColors } from "@/hooks/useColors";
import { useReader } from "@/contexts/ReaderState";
import {
  PIONEER_STATIONS,
  pioneerPathStationExcerpt,
  type PioneerStation,
} from "@/data/pioneerPath";
import { usePioneerPath } from "@/lib/pioneerPath/store";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function PathHome() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { ready, isCompleted, isUnlocked } = usePioneerPath();
  const { theme, cycleTheme } = useReader();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  // Long-press peek: opens a card with subtitle + first sentence.
  const [peek, setPeek] = useState<PioneerStation | null>(null);
  const closePeek = useCallback(() => setPeek(null), []);
  const peekFirstSentence = useMemo(() => {
    if (!peek) return "";
    const blocks = pioneerPathStationExcerpt(peek.id);
    const para = blocks.find(
      (b) => b.kind === "para" || b.kind === "pull" || b.kind === "callout",
    );
    if (!para) return "";
    const text = (para as { text: string }).text;
    const dot = text.search(/[.!?]\s|[.!?]$/);
    if (dot > 0) return text.slice(0, dot + 1);
    return text.length > 180 ? text.slice(0, 180).trimEnd() + "…" : text;
  }, [peek]);

  const completedCount = PIONEER_STATIONS.filter((s) => isCompleted(s.id)).length;
  const total = PIONEER_STATIONS.length;
  const progressLabel = ready
    ? completedCount === 0
      ? "Five stations · the first is open"
      : completedCount === total
        ? "Five of five · the trail is walked"
        : `${completedCount} of ${total} walked`
    : "Five stations · the first is open";

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
          onPress={() => router.back()}
          accessibilityLabel="Back to the handbook"
          style={styles.backRow}
        >
          <Text
            style={[
              styles.backLink,
              { color: c.mutedForeground, fontFamily: MONO },
            ]}
          >
            ← Back to the handbook
          </Text>
        </Pressable>

        <Text
          style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}
        >
          A WALKED EDITION
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          The Pioneer Path
        </Text>
        <Text
          style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
        >
          Five stations. Listen, read, do, then unlock the next.
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        <Text
          style={[styles.openingPara, { color: c.foreground, fontFamily: SERIF }]}
        >
          The handbook is for reading. The Path is for walking. Each
          station gives you a short voiceover, a short reading from the
          chapter it draws from, and one thing to do on your own ground
          before the next station opens.
        </Text>

        <Text
          style={[styles.progressLabel, { color: c.mutedForeground, fontFamily: MONO }]}
        >
          {progressLabel}
        </Text>

        <View style={styles.trail}>
          <ConstellationMap
            stations={PIONEER_STATIONS}
            stateOf={(id) =>
              isCompleted(id)
                ? "completed"
                : isUnlocked(id)
                  ? "unlocked"
                  : "locked"
            }
            onStarPress={(station) => {
              const unlocked = isUnlocked(station.id);
              if (!unlocked) {
                // Locked stars open the peek so the reader can read a
                // one-line teaser of what's ahead — same affordance as
                // the long-press, kept reachable on tap because the
                // star itself is the only handle on the constellation.
                setPeek(station);
                return;
              }
              router.push({
                pathname: "/path/station/[id]",
                params: { id: station.id },
              });
            }}
            onStarLongPress={(station) => setPeek(station)}
          />
        </View>

        <View style={[styles.endRule, { backgroundColor: c.rule }]} />
        <Text
          style={[styles.foot, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}
        >
          The trail is yours. Nothing on the Path syncs anywhere or
          tells anyone what you walked. Mark a station done when you've
          done the thing the station asks.
        </Text>

        <Pressable onPress={cycleTheme} style={styles.themeRow} hitSlop={8}>
          <Text
            style={[styles.themeLabel, { color: c.mutedForeground, fontFamily: MONO }]}
          >
            {theme === "dark" ? "Light campsite" : "Dark campfire"}
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        transparent
        visible={peek !== null}
        animationType="fade"
        onRequestClose={closePeek}
      >
        <Pressable style={styles.peekBackdrop} onPress={closePeek}>
          {peek ? (
            <Pressable
              onPress={() => {}}
              style={[
                styles.peekCard,
                { backgroundColor: c.background, borderColor: c.foreground },
              ]}
            >
              <Text
                style={[styles.peekEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}
              >
                STATION {peek.ordinal} · PEEK
              </Text>
              <Text
                style={[styles.peekTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}
              >
                {peek.name}
              </Text>
              <Text
                style={[styles.peekSubtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
              >
                {peek.subtitle}
              </Text>
              {peekFirstSentence ? (
                <Text
                  style={[styles.peekBody, { color: c.foreground, fontFamily: SERIF }]}
                >
                  {peekFirstSentence}
                </Text>
              ) : null}
              <View style={styles.peekActions}>
                <Pressable
                  onPress={closePeek}
                  style={({ pressed }) => [
                    styles.peekClose,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <Text
                    style={[styles.peekCloseLabel, { color: c.mutedForeground, fontFamily: MONO }]}
                  >
                    Close
                  </Text>
                </Pressable>
                {isUnlocked(peek.id) ? (
                  <Pressable
                    onPress={() => {
                      const target = peek.id;
                      closePeek();
                      router.push({
                        pathname: "/path/station/[id]",
                        params: { id: target },
                      });
                    }}
                    style={({ pressed }) => [
                      styles.peekOpenBtn,
                      {
                        backgroundColor: c.foreground,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.peekOpenLabel, { color: c.background, fontFamily: MONO }]}
                    >
                      Open station
                    </Text>
                  </Pressable>
                ) : (
                  <Text
                    style={[styles.peekLockedLabel, { color: c.mutedForeground, fontFamily: MONO }]}
                  >
                    Walk the previous station first
                  </Text>
                )}
              </View>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
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
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    marginTop: 6,
  },
  rule: {
    height: 1,
    marginVertical: 18,
    opacity: 0.7,
  },
  openingPara: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  progressLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  trail: {
    marginTop: 4,
    marginBottom: 32,
  },
  endRule: {
    height: 1,
    marginBottom: 18,
    opacity: 0.6,
  },
  foot: {
    fontSize: 14,
    lineHeight: 20,
  },
  themeRow: {
    marginTop: 22,
    alignSelf: "center",
  },
  themeLabel: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  peekBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  peekCard: {
    width: "100%",
    maxWidth: 460,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 22,
    paddingHorizontal: 22,
  },
  peekEyebrow: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  peekTitle: {
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: 0.3,
  },
  peekSubtitle: {
    fontSize: 15,
    lineHeight: 21,
    marginTop: 4,
  },
  peekBody: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
  },
  peekActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  peekClose: {
    paddingVertical: 8,
    paddingRight: 4,
  },
  peekCloseLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  peekOpenBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  peekOpenLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  peekLockedLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    flexShrink: 1,
    textAlign: "right",
  },
});

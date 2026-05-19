// Youth Odyssey trail map — eight stations across four phases.
// Mirrors the Pioneer Path trail map structure and visual language.

import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

import { useColors } from "@/hooks/useColors";
import { useReader } from "@/contexts/ReaderState";
import { YOUTH_PHASES, YOUTH_STATIONS, type YouthStation } from "@/data/youthPath";
import { useYouthPath } from "@/lib/youthPath/store";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

const PHASE_ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV",
};
const STATION_ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV",
  5: "V", 6: "VI", 7: "VII", 8: "VIII",
};

const AGE_LABELS: Record<string, string> = {
  young: "Ages 6-10",
  tween: "Ages 10-14",
  older: "Ages 14-18",
};

export default function StoryPathHome() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { ready, ageTrack, isCompleted, isUnlocked, setAgeTrack } = useYouthPath();
  const { theme, cycleTheme } = useReader();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const params = useLocalSearchParams<{ just?: string }>();
  const just = typeof params.just === "string" ? params.just : null;

  const scrollViewRef = useRef<ScrollView>(null);
  const stationYMap = useRef<Record<string, number>>({});
  const phaseYMap = useRef<Record<number, number>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [ageModal, setAgeModal] = useState(!ageTrack);
  const [peek, setPeek] = useState<YouthStation | null>(null);
  const closePeek = useCallback(() => setPeek(null), []);

  useEffect(() => {
    if (ready && !ageTrack) setAgeModal(true);
  }, [ready, ageTrack]);

  useEffect(() => {
    if (!just || !ready) return;
    const completed = YOUTH_STATIONS.find((s) => s.id === just);
    if (!completed) return;
    const next = YOUTH_STATIONS.find((s) => s.ordinal === completed.ordinal + 1);
    if (!next) return;
    setHighlightedId(next.id);
    const scrollTimer = setTimeout(() => {
      const phaseY = phaseYMap.current[next.phase] ?? 0;
      const stationY = stationYMap.current[next.id] ?? 0;
      scrollViewRef.current?.scrollTo({ y: phaseY + stationY - 32, animated: true });
    }, 180);
    const clearTimer = setTimeout(() => setHighlightedId(null), 2200);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, [just, ready]);

  const completedCount = YOUTH_STATIONS.filter((s) => isCompleted(s.id)).length;
  const total = YOUTH_STATIONS.length;

  const progressLabel = ready
    ? completedCount === 0
      ? "Eight stations · the first is open"
      : completedCount === total
        ? "All eight · the path is walked"
        : `${completedCount} of ${total} walked`
    : "Eight stations · the first is open";

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        ref={scrollViewRef}
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
          onPress={() => router.replace("/")}
          accessibilityLabel="Home"
          style={styles.backRow}
        >
          <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Home
          </Text>
        </Pressable>

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          THE YOUTH ODYSSEY
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          Write Your Story
        </Text>
        <Text style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
          Eight stations. Read the story first — then answer a few questions. Your story writes itself.
        </Text>

        {ageTrack ? (
          <Pressable
            onPress={() => setAgeModal(true)}
            style={styles.ageTrackRow}
          >
            <Text style={[styles.ageTrackLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              {AGE_LABELS[ageTrack]?.toUpperCase() ?? ageTrack.toUpperCase()} · tap to change
            </Text>
          </Pressable>
        ) : null}

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        <Text style={[styles.openingPara, { color: c.foreground, fontFamily: SERIF }]}>
          Each station draws from one of the eight foundational tales. You read a passage, answer a few questions about your own life, and the station writes your parallel story — in your words, with your people, in the places you know.
        </Text>

        <Text style={[styles.progressLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
          {progressLabel}
        </Text>

        {YOUTH_PHASES.map((phase) => {
          const phaseStations = YOUTH_STATIONS.filter((s) => s.phase === phase.number);
          return (
            <View
              key={phase.number}
              style={styles.phaseBlock}
              onLayout={(e) => {
                phaseYMap.current[phase.number] = e.nativeEvent.layout.y;
              }}
            >
              <View style={[styles.phaseHeaderRow, { borderBottomColor: c.rule }]}>
                <Text style={[styles.phaseEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
                  PHASE {PHASE_ROMAN[phase.number]}
                </Text>
                <Text style={[styles.phaseLabel, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                  {phase.label}
                </Text>
                <Text style={[styles.phaseDesc, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                  {phase.description}
                </Text>
              </View>

              {phaseStations.map((station, i) => {
                const completed = isCompleted(station.id);
                const unlocked = isUnlocked(station.id);
                const isCurrent = unlocked && !completed;
                const isLast = i === phaseStations.length - 1;
                const isHighlighted = station.id === highlightedId;

                return (
                  <Pressable
                    key={station.id}
                    onLayout={(e) => {
                      stationYMap.current[station.id] = e.nativeEvent.layout.y;
                    }}
                    onPress={() => {
                      if (!unlocked) { setPeek(station); return; }
                      if (!ageTrack) { setAgeModal(true); return; }
                      router.push({
                        pathname: "/story-path/station/[id]",
                        params: { id: station.id },
                      });
                    }}
                    onLongPress={() => setPeek(station)}
                    style={({ pressed }) => [
                      styles.stationRow,
                      !isLast && styles.stationRowBorder,
                      {
                        borderBottomColor: c.rule,
                        opacity: pressed ? 0.7 : 1,
                        backgroundColor: isHighlighted ? c.rust + "12" : "transparent",
                        borderRadius: isHighlighted ? 6 : 0,
                      },
                    ]}
                  >
                    <View style={styles.stationLeft}>
                      <View
                        style={[
                          styles.stationDot,
                          completed
                            ? { backgroundColor: c.rust }
                            : isCurrent
                              ? { backgroundColor: "transparent", borderWidth: 2, borderColor: c.rust }
                              : { backgroundColor: "transparent", borderWidth: 1, borderColor: c.mutedForeground },
                        ]}
                      >
                        {completed ? (
                          <Text style={[styles.dotCheck, { color: c.background }]}>✓</Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.stationMid}>
                      <Text
                        style={[
                          styles.stationOrdinal,
                          { color: c.mutedForeground, fontFamily: MONO, opacity: unlocked ? 1 : 0.45 },
                        ]}
                      >
                        {STATION_ROMAN[station.ordinal] ?? station.ordinal}
                      </Text>
                      <Text
                        style={[
                          styles.stationName,
                          { color: c.foreground, fontFamily: isCurrent ? SERIF_BOLD : SERIF, opacity: unlocked ? 1 : 0.4 },
                        ]}
                      >
                        {station.name}
                      </Text>
                      <Text
                        style={[
                          styles.stationSub,
                          { color: c.mutedForeground, fontFamily: SERIF_ITALIC, opacity: unlocked ? 1 : 0.35 },
                        ]}
                      >
                        {station.subtitle}
                      </Text>
                    </View>

                    {unlocked && !completed ? (
                      <Text style={[styles.chevron, { color: c.mutedForeground }]}>›</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          );
        })}

        <View style={[styles.endRule, { backgroundColor: c.rule }]} />
        <Text style={[styles.foot, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          Your stories stay on this device. Nothing syncs anywhere.
          Each station opens when the one before it is walked.
        </Text>

        <Pressable onPress={cycleTheme} style={styles.themeRow} hitSlop={8}>
          <Text style={[styles.themeLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
            {theme === "dark" ? "Light campsite" : "Dark campfire"}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Age track selection modal */}
      <Modal
        transparent
        visible={ageModal}
        animationType="fade"
        onRequestClose={() => { if (ageTrack) setAgeModal(false); }}
      >
        <View style={styles.ageBackdrop}>
          <View style={[styles.ageCard, { backgroundColor: c.background, borderColor: c.foreground }]}>
            <Text style={[styles.ageTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
              Who's writing?
            </Text>
            <Text style={[styles.ageBody, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
              The questions change by age. Pick the range that fits.
            </Text>
            {(["young", "tween", "older"] as const).map((track) => (
              <Pressable
                key={track}
                onPress={() => { setAgeTrack(track); setAgeModal(false); }}
                style={({ pressed }) => [
                  styles.ageOption,
                  {
                    backgroundColor: ageTrack === track ? c.rust : c.card,
                    borderColor: c.rust,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.ageOptionLabel,
                    { color: ageTrack === track ? c.background : c.foreground, fontFamily: MONO },
                  ]}
                >
                  {AGE_LABELS[track]}
                </Text>
              </Pressable>
            ))}
            {ageTrack ? (
              <Pressable
                onPress={() => setAgeModal(false)}
                style={({ pressed }) => [styles.ageClose, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Text style={[styles.ageCloseLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                  Cancel
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* Peek modal (locked station preview) */}
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
              style={[styles.peekCard, { backgroundColor: c.background, borderColor: c.foreground }]}
            >
              <Text style={[styles.peekEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
                STATION {STATION_ROMAN[peek.ordinal] ?? peek.ordinal} · LOCKED
              </Text>
              <Text style={[styles.peekTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                {peek.name}
              </Text>
              <Text style={[styles.peekSubtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                {peek.subtitle}
              </Text>
              <Text style={[styles.peekBody, { color: c.foreground, fontFamily: SERIF }]}>
                {peek.taleExcerpt}
              </Text>
              <View style={styles.peekActions}>
                <Pressable
                  onPress={closePeek}
                  style={({ pressed }) => [styles.peekClose, { opacity: pressed ? 0.6 : 1 }]}
                >
                  <Text style={[styles.peekCloseLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                    Close
                  </Text>
                </Pressable>
                <Text style={[styles.peekLockedLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                  Walk the previous station first
                </Text>
              </View>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 22,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  backRow: { marginBottom: 20 },
  backLink: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  eyebrow: { fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 6 },
  title: { fontSize: 38, lineHeight: 42, letterSpacing: 0.5, marginTop: 2 },
  subtitle: { fontSize: 17, lineHeight: 24, marginTop: 6 },
  ageTrackRow: { marginTop: 10 },
  ageTrackLabel: { fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase" },
  rule: { height: 1, marginVertical: 18, opacity: 0.7 },
  openingPara: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  progressLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 20 },
  phaseBlock: { marginBottom: 32 },
  phaseHeaderRow: { paddingBottom: 10, marginBottom: 4, borderBottomWidth: 1 },
  phaseEyebrow: { fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 3 },
  phaseLabel: { fontSize: 18, lineHeight: 22, letterSpacing: 0.3, marginBottom: 3 },
  phaseDesc: { fontSize: 13, lineHeight: 18 },
  stationRow: { flexDirection: "row", alignItems: "center", paddingVertical: 13, gap: 12 },
  stationRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth },
  stationLeft: { width: 28, alignItems: "center" },
  stationDot: { width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  dotCheck: { fontSize: 11, lineHeight: 13, fontWeight: "700" },
  stationMid: { flex: 1 },
  stationOrdinal: { fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 1 },
  stationName: { fontSize: 16, lineHeight: 20 },
  stationSub: { fontSize: 12, lineHeight: 17, marginTop: 1 },
  chevron: { fontSize: 22, lineHeight: 24 },
  endRule: { height: 1, marginBottom: 18, opacity: 0.6 },
  foot: { fontSize: 14, lineHeight: 20 },
  themeRow: { marginTop: 22, alignSelf: "center" },
  themeLabel: { fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase" },
  ageBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  ageCard: {
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 12,
  },
  ageTitle: { fontSize: 26, lineHeight: 30, marginBottom: 2 },
  ageBody: { fontSize: 15, lineHeight: 22, marginBottom: 4 },
  ageOption: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
  },
  ageOptionLabel: { fontSize: 13, letterSpacing: 1.4, textTransform: "uppercase" },
  ageClose: { alignSelf: "center", marginTop: 4 },
  ageCloseLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
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
  peekEyebrow: { fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 8 },
  peekTitle: { fontSize: 26, lineHeight: 30, letterSpacing: 0.3 },
  peekSubtitle: { fontSize: 15, lineHeight: 21, marginTop: 4 },
  peekBody: { fontSize: 14, lineHeight: 22, marginTop: 14 },
  peekActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  peekClose: { paddingVertical: 8, paddingRight: 4 },
  peekCloseLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  peekLockedLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    flexShrink: 1,
    textAlign: "right",
  },
});

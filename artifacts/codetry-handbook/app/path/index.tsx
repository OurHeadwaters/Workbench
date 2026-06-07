// The trail map: stations grouped by phase with locked/unlocked/completed
// markers. Replaces the 5-star ConstellationMap now that the path has 20
// stations across five phases.

import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Modal,
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
import { useReader } from "@/contexts/ReaderState";
import {
  PIONEER_PHASES,
  pioneerPathStationExcerpt,
  type PioneerStation,
} from "@/data/pioneerPath";
import { usePioneerPath } from "@/lib/pioneerPath/store";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

const ROMAN: Record<number, string> = {
  1: "I",   2: "II",   3: "III",  4: "IV",   5: "V",
  6: "VI",  7: "VII",  8: "VIII", 9: "IX",   10: "X",
  11: "XI", 12: "XII", 13: "XIII",14: "XIV",  15: "XV",
  16: "XVI",17: "XVII",18: "XVIII",19: "XIX", 20: "XX",
};

const PHASE_ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
};

function openSiteLink(path: string) {
  const url =
    Platform.OS === "web" && typeof window !== "undefined"
      ? window.location.origin + path
      : "https://ourheadwaters.ca" + path;
  Linking.openURL(url);
}

export default function PathHome() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { ready, isCompleted, isUnlocked } = usePioneerPath();
  const { theme, cycleTheme } = useReader();
  const { PIONEER_STATIONS } = useHandbookContent();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const params = useLocalSearchParams<{ just?: string }>();
  const just = typeof params.just === "string" ? params.just : null;

  const scrollViewRef = useRef<ScrollView>(null);
  const phaseYMap = useRef<Record<number, number>>({});
  const stationYMap = useRef<Record<string, number>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // When arriving after marking a station done, scroll to and briefly
  // highlight the newly-unlocked next station.
  useEffect(() => {
    if (!just || !ready) return;
    const completed = PIONEER_STATIONS.find((s) => s.id === just);
    if (!completed) return;
    const next = PIONEER_STATIONS.find((s) => s.ordinal === completed.ordinal + 1);
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
  }, [just, ready, PIONEER_STATIONS]);

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
      ? "Twenty stations · the first is open"
      : completedCount === total
        ? "All twenty · the trail is walked"
        : `${completedCount} of ${total} walked`
    : "Twenty stations · the first is open";

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
          A WALKED EDITION
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          The Pioneer Path
        </Text>
        <Text style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
          Twenty stations, five phases. Listen, read, do, then unlock the next.
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        <Text style={[styles.openingPara, { color: c.foreground, fontFamily: SERIF }]}>
          The handbook is for reading. The Path is for walking. Each station
          gives you a short voiceover, a short reading from the chapter it
          draws from, and one thing to do on your own ground before the next
          station opens.
        </Text>

        {/* Neighbourhood map reference */}
        <Pressable
          onPress={() => openSiteLink("/map")}
          style={({ pressed }) => [
            styles.mapBanner,
            { backgroundColor: c.card, borderColor: c.rule, opacity: pressed ? 0.75 : 1 },
          ]}
          accessibilityLabel="Open the neighbourhood map"
        >
          <Text style={[styles.mapGlyph, { color: c.amber }]}>⌁</Text>
          <View style={styles.mapBannerText}>
            <Text style={[styles.mapBannerTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
              You are somewhere on this map.
            </Text>
            <Text style={[styles.mapBannerSub, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              The Pioneer Path runs through the neighbourhood map — five phases, each one a season of real work. Open the map to see where the trail sits inside the larger community journey.
            </Text>
          </View>
          <Text style={[styles.mapChevron, { color: c.amber, fontFamily: MONO }]}>→</Text>
        </Pressable>

        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
            {progressLabel}
          </Text>
          <Pressable
            onPress={() => router.push("/path/journal")}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            accessibilityLabel="Your trail journal"
          >
            <Text style={[styles.journalLink, { color: c.mutedForeground, fontFamily: MONO }]}>
              Journal →
            </Text>
          </Pressable>
        </View>

        {PIONEER_PHASES.map((phase) => {
          const phaseStations = PIONEER_STATIONS.filter(
            (s) => s.phase === phase.number,
          );
          return (
            <View
              key={phase.number}
              style={styles.phaseBlock}
              onLayout={(e) => {
                phaseYMap.current[phase.number] = e.nativeEvent.layout.y;
              }}
            >
              <View style={[styles.phaseHeaderRow, { borderBottomColor: c.rule }]}>
                <Text
                  style={[styles.phaseEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}
                >
                  PHASE {PHASE_ROMAN[phase.number]}
                </Text>
                <Text
                  style={[styles.phaseLabel, { color: c.foreground, fontFamily: SERIF_BOLD }]}
                >
                  {phase.label}
                </Text>
                <Text
                  style={[styles.phaseDesc, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}
                >
                  {phase.description}
                </Text>
              </View>

              {phaseStations.map((station, i) => {
                const completed = isCompleted(station.id);
                const unlocked = isUnlocked(station.id);
                const isCurrent =
                  unlocked && !completed;
                const isLast = i === phaseStations.length - 1;
                const isHighlighted = station.id === highlightedId;

                return (
                  <Pressable
                    key={station.id}
                    onLayout={(e) => {
                      stationYMap.current[station.id] = e.nativeEvent.layout.y;
                    }}
                    onPress={() => {
                      if (!unlocked) {
                        setPeek(station);
                        return;
                      }
                      router.push({
                        pathname: "/path/station/[id]",
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
                        backgroundColor: isHighlighted
                          ? c.foreground + "12"
                          : "transparent",
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
                              ? {
                                  backgroundColor: "transparent",
                                  borderWidth: 2,
                                  borderColor: c.rust,
                                }
                              : {
                                  backgroundColor: "transparent",
                                  borderWidth: 1,
                                  borderColor: c.mutedForeground,
                                },
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
                          {
                            color: c.mutedForeground,
                            fontFamily: MONO,
                            opacity: unlocked ? 1 : 0.45,
                          },
                        ]}
                      >
                        {ROMAN[station.ordinal] ?? station.ordinal}
                      </Text>
                      <Text
                        style={[
                          styles.stationName,
                          {
                            color: c.foreground,
                            fontFamily: isCurrent ? SERIF_BOLD : SERIF,
                            opacity: unlocked ? 1 : 0.4,
                          },
                        ]}
                      >
                        {station.name}
                      </Text>
                      <Text
                        style={[
                          styles.stationSub,
                          {
                            color: c.mutedForeground,
                            fontFamily: SERIF_ITALIC,
                            opacity: unlocked ? 1 : 0.35,
                          },
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

        {/* Off-ramp: shown only after all stations are walked */}
        {ready && completedCount === total && total > 0 ? (
          <View style={styles.offrampBlock}>
            <View style={[styles.offrampRule, { backgroundColor: c.amber }]} />
            <Text style={[styles.offrampEyebrow, { color: c.amber, fontFamily: MONO }]}>
              AFTER THE ODYSSEY
            </Text>
            <Text style={[styles.offrampTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
              What gets built next.
            </Text>
            <Text style={[styles.offrampIntro, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              You walked the trail knowing exactly what your community is missing. Here are the four tools practitioners commission from Codetry — each one built for the community, handed off, no lock-in.
            </Text>

            {[
              {
                name: "Kitchen Table",
                glyph: "⌁",
                tagline: "Identity & trust layer",
                desc: "Names held, credentials quiet. Kitchen Table is the root system — every zone in the community economy knows who is who without a server in the middle.",
              },
              {
                name: "Clearing",
                glyph: "⊕",
                tagline: "Exchange & settlement",
                desc: "Where community transactions are recorded and settled. Producers, households, and the co-op can see every exchange — no ledger held by someone outside the community.",
              },
              {
                name: "XBuckets",
                glyph: "⊞",
                tagline: "Non-custodial community wallet",
                desc: "A community-run wallet layer on the XRP Ledger. No bank required, no vendor holding the keys. Each household keeps its own passphrase — the community keeps the asset.",
              },
              {
                name: "The Wishing Well",
                glyph: "◇",
                tagline: "Community procurement & requests",
                desc: "A place for the community to name what it needs before it exists. Requests surface from the household level up — so what gets built next is decided by the community, not the consultant.",
              },
            ].map(({ name, glyph, tagline, desc }) => (
              <View
                key={name}
                style={[
                  styles.offrampCard,
                  { backgroundColor: c.card, borderColor: c.rule },
                ]}
              >
                <View style={styles.offrampCardHead}>
                  <Text style={[styles.offrampGlyph, { color: c.amber }]}>{glyph}</Text>
                  <Text style={[styles.offrampName, { color: c.foreground, fontFamily: MONO }]}>
                    {name.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.offrampTagline, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                  {tagline}
                </Text>
                <Text style={[styles.offrampDesc, { color: c.foreground, fontFamily: SERIF }]}>
                  {desc}
                </Text>
              </View>
            ))}

            <Text style={[styles.offrampFoot, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              Each tool is commissioned, built, and handed off — no retainer, no lock-in.
            </Text>
            <Pressable
              onPress={() => openSiteLink("/services")}
              style={({ pressed }) => [styles.offrampLink, { opacity: pressed ? 0.6 : 1 }]}
              accessibilityLabel="See The Work"
            >
              <Text style={[styles.offrampLinkLabel, { color: c.amber, fontFamily: MONO }]}>
                SEE THE WORK →
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View style={[styles.endRule, { backgroundColor: c.rule }]} />
        <Text style={[styles.foot, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          The trail is yours. Nothing on the Path syncs anywhere or tells
          anyone what you walked. Mark a station done when you've done the
          thing the station asks.
        </Text>

        <Pressable onPress={cycleTheme} style={styles.themeRow} hitSlop={8}>
          <Text style={[styles.themeLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
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
                STATION {ROMAN[peek.ordinal] ?? peek.ordinal} · PEEK
              </Text>
              <Text style={[styles.peekTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                {peek.name}
              </Text>
              <Text
                style={[styles.peekSubtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
              >
                {peek.subtitle}
              </Text>
              {peekFirstSentence ? (
                <Text style={[styles.peekBody, { color: c.foreground, fontFamily: SERIF }]}>
                  {peekFirstSentence}
                </Text>
              ) : null}
              <View style={styles.peekActions}>
                <Pressable
                  onPress={closePeek}
                  style={({ pressed }) => [styles.peekClose, { opacity: pressed ? 0.6 : 1 }]}
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
                      { backgroundColor: c.rust, opacity: pressed ? 0.7 : 1 },
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
                    style={[
                      styles.peekLockedLabel,
                      { color: c.mutedForeground, fontFamily: MONO },
                    ]}
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
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  journalLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  phaseBlock: {
    marginBottom: 32,
  },
  phaseHeaderRow: {
    paddingBottom: 10,
    marginBottom: 4,
    borderBottomWidth: 1,
  },
  phaseEyebrow: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  phaseLabel: {
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  phaseDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  stationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    gap: 12,
  },
  stationRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stationLeft: {
    width: 28,
    alignItems: "center",
  },
  stationDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  dotCheck: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "700",
  },
  stationMid: {
    flex: 1,
  },
  stationOrdinal: {
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 1,
  },
  stationName: {
    fontSize: 16,
    lineHeight: 20,
  },
  stationSub: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 1,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
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
  mapBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  mapGlyph: {
    fontSize: 20,
    lineHeight: 24,
    marginTop: 1,
  },
  mapBannerText: {
    flex: 1,
  },
  mapBannerTitle: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  mapBannerSub: {
    fontSize: 13,
    lineHeight: 19,
  },
  mapChevron: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 2,
  },
  offrampBlock: {
    marginTop: 8,
    marginBottom: 32,
  },
  offrampRule: {
    height: 2,
    width: 32,
    borderRadius: 1,
    marginBottom: 16,
    opacity: 0.7,
  },
  offrampEyebrow: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  offrampTitle: {
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  offrampIntro: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  offrampCard: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  offrampCardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  offrampGlyph: {
    fontSize: 16,
    lineHeight: 20,
  },
  offrampName: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  offrampTagline: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  offrampDesc: {
    fontSize: 14,
    lineHeight: 21,
  },
  offrampFoot: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
    marginBottom: 10,
  },
  offrampLink: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  offrampLinkLabel: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
});

import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Linking,
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
import type { Palette } from "@/hooks/useColors";
import { constellation } from "@/data/constellation";
import { PIONEER_STATIONS } from "@/data/pioneerPath";
import { TALES } from "@/data/tales";
import { usePioneerPath } from "@/lib/pioneerPath/store";
import { NorthernAtmosphere } from "@/components/NorthernAtmosphere";
import { J } from "@/theme/journal";

const SERIF        = J.font.serif;
const SERIF_ITALIC = J.font.serifItalic;
const SERIF_BOLD   = J.font.serifBold;
const MONO         = J.font.mono;

const FOREST   = J.color.forest;
const CANOPY   = J.color.canopy;
const EVERGREEN = J.color.evergreen;
const CREAM    = J.color.cream;
const AMBER    = J.color.amber;
const RUST     = J.color.rust;

export default function FrontPage() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { lastRead, bookmarks, glossaryTerms } = useReader();
  const { CHAPTERS, getChapter, PARTS } = useHandbookContent();
  const webTop    = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const { ready: pathReady, isCompleted, isUnlocked } = usePioneerPath();

  const badgePulse = useRef(new Animated.Value(1)).current;
  const prevStationId = useRef<string | undefined>(undefined);

  const PREFACE_ID = "0-0";
  const AFTER_PREFACE_ID = "0-1";

  const lastChapter  = lastRead ? getChapter(lastRead.chapterId) : undefined;
  const firstChapter = CHAPTERS[0];
  const isReturning  = !!lastChapter;
  const beginTarget  = isReturning
    ? (lastChapter!.id === PREFACE_ID ? AFTER_PREFACE_ID : lastChapter!.id)
    : firstChapter.id;

  const currentStation = pathReady
    ? (PIONEER_STATIONS.find((s) => isUnlocked(s.id) && !isCompleted(s.id)) ??
       [...PIONEER_STATIONS].reverse().find((s) => isCompleted(s.id)))
    : undefined;

  useEffect(() => {
    if (!pathReady) return;
    const id = currentStation?.id;
    if (id === prevStationId.current) return;
    prevStationId.current = id;
    if (prevStationId.current === undefined) return;
    Animated.sequence([
      Animated.timing(badgePulse, { toValue: 1.05, duration: 180, useNativeDriver: true }),
      Animated.timing(badgePulse, { toValue: 1,    duration: 260, useNativeDriver: true }),
    ]).start();
  }, [pathReady, currentStation?.id, badgePulse]);

  const mainParts = PARTS.filter(
    (p) => p.kind !== "backMatter" && p.kind !== "frontMatter",
  );

  const featuredTale =
    TALES.find((t) => t.id === "the-fish-who-stopped-trying-to-climb") ?? TALES[0];

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, webBottom) + 56 }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HERO BAND ─────────────────────────────────────────────── */}
        <View
          style={[
            styles.heroBand,
            { paddingTop: Math.max(insets.top, webTop) + 28 },
          ]}
        >
          {/* Atmospheric particle layer */}
          <NorthernAtmosphere style={{ opacity: 0.12 }} />

          {/* Landscape gradient layers */}
          {/* Sky vignette — deep at very top */}
          <View style={styles.heroGradientSky} pointerEvents="none" />
          {/* Horizon band — treeline silhouette effect */}
          <View style={styles.heroHorizon} pointerEvents="none" />
          {/* Ground fade — content transitions up from below */}
          <View style={styles.heroGradientBottom} pointerEvents="none" />

          <Text style={[styles.heroEyebrow, { fontFamily: MONO }]}>
            A FIELD JOURNAL
          </Text>
          <Text style={[styles.heroTitle, { fontFamily: SERIF_BOLD }]}>
            Headwaters
          </Text>
          <Text style={[styles.heroSubtitle, { fontFamily: SERIF_ITALIC }]}>
            How a Community Runs Its Own Economy
          </Text>
          <Text style={[styles.heroCodetry, { fontFamily: MONO }]}>
            Codetry — hands-on coding and tools for sovereignty and self-reliance.
          </Text>

          {/* Amber rule */}
          <View style={styles.heroRule} />

          <Text style={[styles.heroQuote, { fontFamily: SERIF_ITALIC }]}>
            {`\u201c${constellation.grammar.thunder}\u201d`}
          </Text>
          <Text style={[styles.heroByline, { fontFamily: MONO }]}>
            {`v${constellation.version} \u00b7 ${constellation.lastUpdated} \u00b7 offline-readable`}
          </Text>

          <Pressable
            onPress={() => Linking.openURL("/map")}
            style={({ pressed }) => [styles.zoneBadge, pressed && { opacity: 0.7 }]}
          >
            <View style={styles.zoneDot}>
              <Text style={[styles.zoneDotText, { fontFamily: MONO }]}>0</Text>
            </View>
            <Text style={[styles.zoneBadgeText, { fontFamily: MONO }]}>The Saltbox</Text>
            <Text style={[styles.zoneState, { fontFamily: MONO }]}>· Good Times</Text>
          </Pressable>
        </View>

        {/* ── BEGIN READING ─────────────────────────────────────────── */}
        <View style={styles.beginSection}>

          {/* Pioneer Path station — returning readers only */}
          {isReturning && currentStation && (
            <Animated.View style={{ transform: [{ scale: badgePulse }] }}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/path/station/[id]",
                    params: { id: currentStation.id },
                  })
                }
                style={({ pressed }) => [
                  styles.stationBadge,
                  styles.stationBadgePressable,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                accessibilityLabel={`Open station: ${currentStation.name}`}
              >
                <View style={styles.stationBadgeInner}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.stationBadgeText, { fontFamily: MONO }]}>
                      {`Station ${currentStation.ordinal} of ${PIONEER_STATIONS.length} \u00b7 ${currentStation.name}`}
                    </Text>
                    <Text style={[styles.stationBadgeSub, { fontFamily: SERIF_ITALIC }]}>
                      {currentStation.subtitle}
                    </Text>
                  </View>
                  <Text style={[styles.stationBadgeArrow, { fontFamily: MONO, color: `${AMBER}66` }]}>
                    →
                  </Text>
                </View>
                <Text style={[styles.stationBadgeCta, { fontFamily: MONO, color: `${AMBER}55` }]}>
                  TAP TO MARK DONE
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Primary CTA */}
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
                backgroundColor: isReturning ? AMBER : CANOPY,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.primaryBtnLabel, { fontFamily: SERIF_ITALIC, color: isReturning ? FOREST : CREAM }]}>
                {isReturning ? "Continue where you left off" : "Start here"}
              </Text>
              <Text style={[styles.primaryBtnEyebrow, {
                fontFamily: MONO,
                marginBottom: 0,
                marginTop: 6,
                color: isReturning ? `${FOREST}88` : "rgba(244,237,224,0.55)",
              }]}>
                {isReturning
                  ? `${lastChapter!.number} ${lastChapter!.title}`
                  : `${firstChapter.number} ${firstChapter.title}`}
              </Text>
            </View>
            <Text style={[styles.primaryBtnArrow, { fontFamily: MONO, color: isReturning ? FOREST : CREAM }]}>→</Text>
          </Pressable>

          <View style={styles.ghostRow}>
            <Pressable
              onPress={() => router.push(isReturning ? "/path" : "/contents")}
              style={({ pressed }) => [
                styles.ghostBtn,
                { borderColor: `${AMBER}40`, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.ghostBtnText, { color: AMBER, fontFamily: MONO }]}>
                {isReturning ? "Trail" : "Contents"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/bookmarks")}
              style={({ pressed }) => [
                styles.ghostBtn,
                { borderColor: `${AMBER}40`, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.ghostBtnText, { color: AMBER, fontFamily: MONO }]}>
                {bookmarks.length > 0
                  ? `Bookmarks \u00b7 ${bookmarks.length}`
                  : "Bookmarks"}
              </Text>
            </Pressable>
          </View>

          {/* Night sky entry — returning readers only */}
          {isReturning && (
            <Pressable
              onPress={() => router.push("/night-sky")}
              style={({ pressed }) => [
                styles.nightSkyBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.nightSkyDots, { fontFamily: MONO }]}>· · ·</Text>
              <Text style={[styles.nightSkyLabel, { fontFamily: MONO }]}>Look up</Text>
            </Pressable>
          )}
        </View>

        {/* ── CHILDREN'S TALES ──────────────────────────────────────── */}
        <SectionHeader label="CHILDREN'S TALES" accent={AMBER} topGap={28} />

        <Pressable
          onPress={() => router.push("/tales")}
          style={({ pressed }) => [
            styles.talesCard,
            {
              backgroundColor: c.card,
              borderColor: `${AMBER}28`,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={[styles.talesTopAccent, { backgroundColor: AMBER }]} />
          <View style={styles.talesInner}>
            <Text style={[styles.talesCount, { color: c.mutedForeground, fontFamily: MONO }]}>
              {`${TALES.length} STORIES`}
            </Text>
            <Text style={[styles.talesQuote, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
              {`\u201c${featuredTale.excerpt}\u201d`}
            </Text>
            <Text style={[styles.talesSource, { color: AMBER, fontFamily: MONO }]}>
              {`\u2014\u00a0${featuredTale.title}`}
            </Text>
            <View style={[styles.talesRule, { backgroundColor: `${AMBER}22` }]} />
            <Text style={[styles.talesDesc, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              Stories rooted in nature, seasons, and the lifecycle. For children of all ages. Each one carries what the handbook cannot say directly.
            </Text>
            <View style={[styles.talesReadBtn, { borderColor: `${AMBER}50` }]}>
              <Text style={[styles.talesReadBtnText, { color: AMBER, fontFamily: MONO }]}>
                Read the stories →
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Story Path entry — always visible */}
        <Pressable
          onPress={() => router.push("/story-path")}
          style={({ pressed }) => [
            styles.storyPathBtn,
            { borderColor: `${AMBER}50`, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.storyPathBtnText, { color: AMBER, fontFamily: MONO }]}>
            Write your own story →
          </Text>
        </Pressable>

        {/* ── NEW READER: orienting close ───────────────────────────── */}
        {!isReturning && (
          <View style={styles.orientWrap}>
            <View style={[styles.orientRule, { backgroundColor: `${AMBER}18` }]} />
            <Text style={[styles.orientText, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              Read straight through. Each chapter builds on the next.
            </Text>
          </View>
        )}

        {/* ── RETURNING READER: full dashboard ─────────────────────── */}
        {isReturning && (
          <>
            {/* Daily Prompt */}
            <Pressable
              onPress={() => router.push("/daily-prompt")}
              style={({ pressed }) => [
                styles.promptCard,
                { backgroundColor: CANOPY, opacity: pressed ? 0.92 : 1 },
              ]}
            >
              <View style={styles.promptInner}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.promptEyebrow, { fontFamily: MONO }]}>
                    TODAY
                  </Text>
                  <Text style={[styles.promptTitle, { fontFamily: SERIF_BOLD }]}>
                    Daily Prompt
                  </Text>
                  <Text style={[styles.promptSub, { fontFamily: SERIF_ITALIC }]}>
                    One question, drawn from your constellation
                  </Text>
                </View>
                <View style={styles.promptArrowWrap}>
                  <Text style={[styles.promptArrow, { fontFamily: MONO }]}>→</Text>
                </View>
              </View>
            </Pressable>

            {/* PRACTICE */}
            <SectionHeader label="PRACTICE" accent={AMBER} topGap={36} />
            <ToolRow
              label="Practice Cards"
              sub="Test what has landed, one card at a time"
              onPress={() => router.push("/stack")}
              c={c}
              accent={AMBER}
            />
            <ToolRow
              label="Rename Test"
              sub="Is this name load-bearing or decoration?"
              onPress={() => router.push("/rename-test")}
              c={c}
              accent={AMBER}
            />
            <ToolRow
              label="Gate Log"
              sub="Bright-side names and their systems translations"
              onPress={() => router.push("/gate-log")}
              c={c}
              accent={AMBER}
            />

            {/* YOUR WORK */}
            <SectionHeader label="YOUR WORK" accent={AMBER} topGap={32} />
            <ToolRow
              label="Your Constellation"
              sub="Name your six zones in your own vocabulary"
              onPress={() => router.push("/constellation-builder")}
              c={c}
              accent={AMBER}
            />
            <ToolRow
              label="Author's Desk"
              sub="Your constellation, in your words"
              onPress={() => router.push("/author")}
              c={c}
              accent={AMBER}
            />
            <ToolRow
              label={glossaryTerms.length > 0 ? `Glossary \u00b7 ${glossaryTerms.length} saved` : "Glossary"}
              sub="All formally defined terms, searchable"
              onPress={() => router.push("/glossary")}
              c={c}
              accent={AMBER}
            />

            {/* THE BOOK */}
            <SectionHeader label="THE BOOK" accent={AMBER} topGap={36} />
            {mainParts.map((p, i) => {
              const firstCh = CHAPTERS.find((ch) => ch.partRoman === p.roman);
              return (
                <Pressable
                  key={p.roman}
                  onPress={() => {
                    if (firstCh) {
                      router.push({
                        pathname: "/chapter/[id]",
                        params: { id: firstCh.id },
                      });
                    }
                  }}
                  style={({ pressed }) => [
                    styles.partRow,
                    {
                      borderBottomColor: `${AMBER}14`,
                      backgroundColor: i % 2 === 0 ? "transparent" : `${AMBER}04`,
                      opacity: pressed ? 0.65 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.partRoman, { color: AMBER, fontFamily: SERIF_BOLD }]}>
                    {p.roman}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.partTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                      {p.title}
                    </Text>
                    <Text style={[styles.partBlurb, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                      {p.blurb}
                    </Text>
                  </View>
                  <Text style={{ color: AMBER, fontFamily: MONO, fontSize: 16, opacity: 0.6, paddingTop: 3 }}>
                    →
                  </Text>
                </Pressable>
              );
            })}

            {/* Colophon */}
            <View style={styles.colophonWrap}>
              <View style={[styles.colophonRule, { backgroundColor: `${AMBER}18` }]} />
              <Text style={[styles.colophon, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                Drawn from the constellation manifest. The discipline travels; the examples don't.
              </Text>
            </View>
          </>
        )}

      </ScrollView>
    </View>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────────

function SectionHeader({
  label,
  accent,
  topGap = 0,
}: {
  label: string;
  accent: string;
  topGap?: number;
}) {
  return (
    <View style={[styles.sectionHeader, { marginTop: topGap }]}>
      <View style={[styles.sectionAccentBar, { backgroundColor: accent }]} />
      <Text style={[styles.sectionLabel, { color: accent, fontFamily: MONO }]}>
        {label}
      </Text>
      <View style={[styles.sectionLine, { backgroundColor: `${accent}22` }]} />
    </View>
  );
}

// ── Tool Row ──────────────────────────────────────────────────────────────────

function ToolRow({
  label,
  sub,
  onPress,
  c,
  accent,
}: {
  label: string;
  sub: string;
  onPress: () => void;
  c: Palette;
  accent: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.982, useNativeDriver: true, tension: 200, friction: 14 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 14 }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.toolRow,
          {
            backgroundColor: c.card,
            borderColor: `${accent}22`,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={[styles.toolAccentBar, { backgroundColor: accent }]} />
        <View style={{ flex: 1, paddingLeft: 14 }}>
          <Text style={[styles.toolLabel, { color: c.foreground, fontFamily: MONO }]}>
            {label}
          </Text>
          <Text style={[styles.toolSub, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
            {sub}
          </Text>
        </View>
        <Text style={{ color: accent, fontFamily: MONO, fontSize: 15, opacity: 0.7 }}>
          →
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  // HERO
  heroBand: {
    backgroundColor: FOREST,
    paddingHorizontal: 28,
    paddingBottom: 44,
    overflow: "hidden",
    position: "relative",
  },
  heroGradientSky: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(4,10,8,0.55)",
    pointerEvents: "none" as any,
  },
  heroHorizon: {
    position: "absolute",
    bottom: 88,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(8,18,12,0.38)",
    pointerEvents: "none" as any,
  },
  heroGradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(15,28,24,0.50)",
    pointerEvents: "none" as any,
  },
  heroEyebrow: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: `${AMBER}70`,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 60,
    lineHeight: 64,
    letterSpacing: -1.5,
    color: CREAM,
  },
  heroSubtitle: {
    fontSize: 19,
    lineHeight: 28,
    color: "rgba(244,237,224,0.72)",
    marginTop: 8,
  },
  heroRule: {
    height: 2,
    width: 44,
    backgroundColor: AMBER,
    marginTop: 26,
    marginBottom: 20,
    borderRadius: 1,
  },
  heroCodetry: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: `${AMBER}55`,
    marginTop: 10,
    lineHeight: 18,
  },
  heroQuote: {
    fontSize: 15,
    lineHeight: 24,
    color: "rgba(244,237,224,0.58)",
  },
  heroByline: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "rgba(244,237,224,0.26)",
    marginTop: 18,
  },
  zoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${AMBER}28`,
    backgroundColor: `${AMBER}08`,
  },
  zoneDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AMBER,
    alignItems: "center",
    justifyContent: "center",
  },
  zoneDotText: {
    fontSize: 9,
    color: FOREST,
    fontWeight: "700",
  },
  zoneBadgeText: {
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: `${AMBER}80`,
  },
  zoneState: {
    fontSize: 9,
    letterSpacing: 0.5,
    color: `${AMBER}42`,
  },

  // BEGIN SECTION
  beginSection: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },

  // STATION BADGE
  stationBadge: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  stationBadgePressable: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: `${AMBER}22`,
    backgroundColor: `${AMBER}06`,
  },
  stationBadgeInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stationBadgeArrow: {
    fontSize: 16,
    flexShrink: 0,
  },
  stationBadgeCta: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 6,
  },
  stationBadgeText: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: `${AMBER}99`,
    marginBottom: 2,
  },
  stationBadgeSub: {
    fontSize: 13,
    color: `${EVERGREEN}88`,
    lineHeight: 19,
  },

  // NIGHT SKY
  nightSkyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    paddingVertical: 10,
  },
  nightSkyDots: {
    fontSize: 11,
    letterSpacing: 4,
    color: `${AMBER}50`,
  },
  nightSkyLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: `${AMBER}50`,
  },

  // PRIMARY BUTTON
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: J.radius.md,
    gap: 12,
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryBtnEyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  primaryBtnLabel: {
    fontSize: 17,
    lineHeight: 22,
  },
  primaryBtnArrow: {
    fontSize: 20,
    opacity: 0.75,
  },
  ghostRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  ghostBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: J.radius.md,
  },
  ghostBtnText: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  // DAILY PROMPT
  promptCard: {
    marginHorizontal: 22,
    marginTop: 20,
    borderRadius: J.radius.md,
  },
  promptInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  promptEyebrow: {
    fontSize: 9,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: AMBER,
    marginBottom: 5,
  },
  promptTitle: {
    fontSize: 20,
    color: CREAM,
    lineHeight: 26,
    marginBottom: 3,
  },
  promptSub: {
    fontSize: 14,
    color: "rgba(244,237,224,0.58)",
    lineHeight: 20,
  },
  promptArrowWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${AMBER}18`,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  promptArrow: {
    fontSize: 16,
    color: AMBER,
  },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 22,
    marginTop: 32,
  },
  sectionAccentBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionLine: {
    flex: 1,
    height: 1,
  },

  // TALES
  talesCard: {
    marginHorizontal: 22,
    borderRadius: J.radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  talesTopAccent: {
    height: 3,
    width: "100%",
  },
  talesInner: {
    padding: 22,
  },
  talesCount: {
    fontSize: 9,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  talesQuote: {
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 10,
  },
  talesSource: {
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 18,
  },
  talesRule: {
    height: 1,
    marginBottom: 16,
  },
  talesDesc: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  talesReadBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: J.radius.sm,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  talesReadBtnText: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  storyPathBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: J.radius.sm,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginTop: 10,
    marginHorizontal: 22,
  },
  storyPathBtnText: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // TOOL ROW
  toolRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingRight: 18,
    marginHorizontal: 22,
    marginBottom: 7,
    borderRadius: J.radius.md,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  toolAccentBar: {
    width: 3,
    height: 34,
    borderRadius: 2,
    marginLeft: 3,
  },
  toolLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  toolSub: {
    fontSize: 13,
    lineHeight: 19,
  },

  // PARTS
  partRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  partRoman: {
    fontSize: 22,
    width: 40,
    paddingTop: 1,
    letterSpacing: -0.5,
    opacity: 0.22,
  },
  partTitle: {
    fontSize: 17,
    lineHeight: 23,
  },
  partBlurb: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 3,
  },

  // ORIENT (new reader close)
  orientWrap: {
    paddingHorizontal: 22,
    marginTop: 36,
    marginBottom: 8,
  },
  orientRule: {
    height: 1,
    marginBottom: 16,
  },
  orientText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.65,
    textAlign: "center",
  },

  // COLOPHON
  colophonWrap: {
    paddingHorizontal: 22,
    marginTop: 32,
  },
  colophonRule: {
    height: 1,
    marginBottom: 16,
  },
  colophon: {
    fontSize: 13,
    lineHeight: 21,
    opacity: 0.65,
  },
});

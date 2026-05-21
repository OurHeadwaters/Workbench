/**
 * JournalNav — Leather-bound journal index navigation.
 *
 * Part headers look like carved wooden/leather tab dividers.
 * Chapter rows are trail-marker entries with amber glow on the active chapter.
 * Active section has a pressed-page amber highlight.
 */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Part } from "@/data/handbook";
import { J } from "@/theme/journal";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

// ── Part icon mapping ─────────────────────────────────────────────────────────

function partIcon(roman: string): IconName {
  switch (roman) {
    case "P":   return "leaf-outline";
    case "G":   return "school-outline";
    case "I":   return "book-outline";
    case "II":  return "planet-outline";
    case "III": return "compass-outline";
    case "IV":  return "git-branch-outline";
    case "V":   return "people-circle-outline";
    case "DD":  return "code-slash-outline";
    case "OQ":  return "help-circle-outline";
    default:    return "journal-outline";
  }
}

// ── JournalNav ────────────────────────────────────────────────────────────────

export function JournalNav({
  parts,
  activeChapterId,
  bookmarkedIds = new Set(),
  lastReadId,
  onHasLanding,
}: {
  parts: Part[];
  activeChapterId?: string;
  bookmarkedIds?: Set<string>;
  lastReadId?: string;
  onHasLanding?: (roman: string) => void;
}) {
  return (
    <View>
      {parts.map((p, idx) => {
        const isBackMatter = p.kind === "backMatter";
        const isCoda       = p.roman === "CODA";
        const hasLanding   = p.roman === "V" || p.roman === "III";
        const prev         = idx > 0 ? parts[idx - 1] : undefined;
        const showDivider  =
          isBackMatter && !isCoda && (!prev || prev.kind !== "backMatter");
        const showCoda     = isCoda;

        return (
          <View key={p.roman} style={styles.partBlock}>
            {/* ── Divider between main and back matter ── */}
            {showDivider && (
              <SectionDivider label="BACK MATTER" />
            )}
            {showCoda && (
              <SectionDivider label="CONCLUSION" />
            )}

            {/* ── Part tab header ── */}
            <PartTab
              part={p}
              hasLanding={hasLanding}
              onHasLanding={onHasLanding}
            />

            {/* ── Chapter trail entries ── */}
            {p.chapters.map((ch) => {
              const isActive     = ch.id === activeChapterId;
              const isBookmarked = bookmarkedIds.has(ch.id);
              const isLastRead   = ch.id === lastReadId;
              return (
                <ChapterEntry
                  key={ch.id}
                  id={ch.id}
                  number={ch.number}
                  title={ch.title}
                  isActive={isActive}
                  isBookmarked={isBookmarked}
                  isLastRead={isLastRead}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

// ── Part Tab ──────────────────────────────────────────────────────────────────

function PartTab({
  part,
  hasLanding,
  onHasLanding,
}: {
  part: Part;
  hasLanding: boolean;
  onHasLanding?: (roman: string) => void;
}) {
  const icon = partIcon(part.roman);
  const inner = (
    <View style={styles.partTabInner}>
      <View style={styles.partTabIconWrap}>
        <Ionicons name={icon} size={15} color={J.color.amber} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.partTabTop}>
          <Text style={[styles.partTabRoman, { fontFamily: J.font.mono }]}>
            {part.roman}
          </Text>
          <Text style={[styles.partTabTitle, { fontFamily: J.font.serifBold }]}>
            {part.title}
          </Text>
        </View>
        <Text style={[styles.partTabBlurb, { fontFamily: J.font.serifItalic }]}>
          {part.blurb}
        </Text>
        {hasLanding && (
          <Text style={[styles.partTabLink, { fontFamily: J.font.mono }]}>
            {`Open Part ${part.roman} as a set →`}
          </Text>
        )}
      </View>
    </View>
  );

  if (hasLanding) {
    return (
      <Pressable
        onPress={() => {
          if (onHasLanding) {
            onHasLanding(part.roman);
          } else {
            router.push({ pathname: "/part/[roman]", params: { roman: part.roman } });
          }
        }}
        style={({ pressed }) => [styles.partTab, pressed && { opacity: 0.7 }]}
      >
        {inner}
      </Pressable>
    );
  }
  return <View style={styles.partTab}>{inner}</View>;
}

// ── Chapter Entry ─────────────────────────────────────────────────────────────

function ChapterEntry({
  id,
  number,
  title,
  isActive,
  isBookmarked,
  isLastRead,
}: {
  id: string;
  number: string;
  title: string;
  isActive: boolean;
  isBookmarked: boolean;
  isLastRead: boolean;
}) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/chapter/[id]", params: { id } })
      }
      style={({ pressed }) => [
        styles.chapterRow,
        isActive && styles.chapterRowActive,
        pressed && { opacity: 0.6 },
      ]}
      accessibilityLabel={`${number} ${title}`}
    >
      {/* Active pressed-page left strip */}
      {isActive && <View style={styles.activeStrip} />}

      {/* Trail marker */}
      <View style={[styles.trailMarker, isActive && styles.trailMarkerActive]}>
        {isActive
          ? <View style={styles.trailDiamond} />
          : <View style={styles.trailDot} />}
      </View>

      {/* Number + title */}
      <Text style={[
        styles.chapterNum,
        { fontFamily: J.font.mono },
        isActive && { color: J.color.amber },
      ]}>
        {number}
      </Text>
      <Text style={[
        styles.chapterTitle,
        { fontFamily: isActive ? J.font.serifBold : J.font.serif },
        isActive && { color: J.color.evergreen },
      ]} numberOfLines={2}>
        {title}
      </Text>

      {/* Right badges */}
      <View style={styles.badges}>
        {isBookmarked && (
          <Ionicons name="bookmark" size={13} color={J.color.amber} />
        )}
        {isLastRead && !isActive && (
          <View style={[styles.lastReadDot, { backgroundColor: J.color.amber }]} />
        )}
      </View>
    </Pressable>
  );
}

// ── Section Divider ───────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={[styles.dividerLine, { backgroundColor: `${J.color.amber}30` }]} />
      <Text style={[styles.dividerLabel, { fontFamily: J.font.mono, color: `${J.color.amber}80` }]}>
        {label}
      </Text>
      <View style={[styles.dividerLine, { backgroundColor: `${J.color.amber}30` }]} />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  partBlock: {
    marginBottom: 6,
  },

  // Part tab — dark leather look
  partTab: {
    backgroundColor: J.color.canopy,
    marginBottom: 2,
    borderRadius: J.radius.sm,
  },
  partTabInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  partTabIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${J.color.amber}18`,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  partTabTop: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    flexWrap: "wrap",
  },
  partTabRoman: {
    fontSize: 9,
    letterSpacing: 2,
    color: `${J.color.amber}70`,
    textTransform: "uppercase",
  },
  partTabTitle: {
    fontSize: 16,
    color: J.color.cream,
    lineHeight: 22,
  },
  partTabBlurb: {
    fontSize: 13,
    color: `${J.color.cream}70`,
    lineHeight: 18,
    marginTop: 2,
  },
  partTabLink: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: J.color.amber,
    textTransform: "uppercase",
    marginTop: 6,
  },

  // Chapter entry — trail-marker style
  chapterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingRight: 14,
    paddingLeft: 6,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${J.color.amber}12`,
    position: "relative",
    overflow: "hidden",
  },
  chapterRowActive: {
    backgroundColor: `${J.color.amber}0C`,
  },
  activeStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: J.color.amber,
    borderRadius: 2,
  },
  trailMarker: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  trailMarkerActive: {},
  trailDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: `${J.color.sand}60`,
  },
  trailDiamond: {
    width: 7,
    height: 7,
    backgroundColor: J.color.amber,
    transform: [{ rotate: "45deg" }],
  },
  chapterNum: {
    fontSize: 10,
    letterSpacing: 0.8,
    color: J.color.sand,
    width: 34,
    flexShrink: 0,
    textTransform: "uppercase",
  },
  chapterTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: J.color.evergreen,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  lastReadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  // Section divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 14,
    paddingHorizontal: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerLabel: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});

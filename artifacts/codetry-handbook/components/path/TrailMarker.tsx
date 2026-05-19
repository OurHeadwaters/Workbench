// A single station marker on the trail map.
//
// Three visual states:
//   - locked:    sand-colored hollow ring, dimmed label, "Walk this far first"
//   - unlocked:  ink-colored hollow ring, full-color label
//   - completed: ink-filled disk with a small notch
//
// The marker is the primary navigation element on the path index. Each
// is laid out vertically with a contour-style connector drawn between
// adjacent markers in the parent screen.

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const SERIF_BOLD = "Fraunces_700Bold";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const MONO = "JetBrainsMono_500Medium";

const ROMAN: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
};

export type TrailMarkerState = "locked" | "unlocked" | "completed";

export function TrailMarker({
  ordinal,
  name,
  subtitle,
  state,
  onPress,
  onLongPress,
}: {
  ordinal: number;
  name: string;
  subtitle: string;
  state: TrailMarkerState;
  onPress: () => void;
  // Long-press peek. Locked stations *are* allowed to peek so the
  // reader can read a one-line teaser of what's ahead without first
  // walking the previous step.
  onLongPress?: () => void;
}) {
  const c = useColors();
  const disabled = state === "locked";
  const ringColor = disabled ? c.muted : c.foreground;
  const labelColor = disabled ? c.mutedForeground : c.foreground;
  const subtitleColor = disabled ? c.muted : c.mutedForeground;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      // Locked rows still need long-press, so we don't disable the
      // Pressable itself — onPress is a no-op when locked because the
      // parent only registers a navigation handler for unlocked rows.
      delayLongPress={400}
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed && !disabled ? 0.7 : 1 },
      ]}
    >
      <View style={styles.markerCol}>
        <View
          style={[
            styles.disk,
            {
              borderColor: ringColor,
              backgroundColor: state === "completed" ? c.foreground : "transparent",
            },
          ]}
        >
          <Text
            style={[
              styles.diskNum,
              {
                color: state === "completed" ? c.background : ringColor,
                fontFamily: MONO,
              },
            ]}
          >
            {ROMAN[ordinal] ?? String(ordinal)}
          </Text>
        </View>
      </View>
      <View style={styles.labelCol}>
        <Text style={[styles.name, { color: labelColor, fontFamily: SERIF_BOLD }]}>
          {name}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: subtitleColor, fontFamily: SERIF_ITALIC },
          ]}
        >
          {subtitle}
        </Text>
        {state === "locked" ? (
          <Text
            style={[styles.lockHint, { color: c.muted, fontFamily: MONO }]}
          >
            Walk the previous station first
          </Text>
        ) : state === "completed" ? (
          <Text
            style={[styles.doneHint, { color: c.mutedForeground, fontFamily: MONO }]}
          >
            Walked
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const DISK = 56;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },
  markerCol: {
    width: DISK + 16,
    alignItems: "center",
  },
  disk: {
    width: DISK,
    height: DISK,
    borderRadius: DISK / 2,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  diskNum: {
    fontSize: 16,
    letterSpacing: 1,
  },
  labelCol: {
    flex: 1,
    paddingTop: 6,
    paddingLeft: 8,
  },
  name: {
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 2,
  },
  lockHint: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 6,
  },
  doneHint: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 6,
  },
});

export function TrailConnector({ active }: { active: boolean }) {
  const c = useColors();
  const color = active ? c.foreground : c.muted;
  return (
    <View style={connectorStyles.wrap} pointerEvents="none">
      <View style={[connectorStyles.line, { backgroundColor: color }]} />
      <View style={[connectorStyles.dot, { backgroundColor: color }]} />
      <View style={[connectorStyles.line, { backgroundColor: color }]} />
    </View>
  );
}

const connectorStyles = StyleSheet.create({
  wrap: {
    width: 56 + 16,
    alignItems: "center",
    paddingVertical: 4,
    paddingLeft: 0,
  },
  line: {
    width: 1,
    height: 14,
    opacity: 0.5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginVertical: 2,
    opacity: 0.7,
  },
});

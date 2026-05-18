import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ZONE_GUIDES, useConstellationBuilder } from "@/hooks/useConstellationBuilder";

const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

const SKY = "#0e1a14";
const CREAM = "#f4ede0";
const DIM = "rgba(244,237,224,0.22)";
const GLOW = CREAM;

// Star positions as fractions of (width, height of usable sky area).
// Arranged in a loose, natural-feeling cluster — not a grid.
const STAR_POSITIONS: { x: number; y: number }[] = [
  { x: 0.20, y: 0.24 }, // Zone 0 — upper left
  { x: 0.65, y: 0.18 }, // Zone 1 — upper right
  { x: 0.40, y: 0.42 }, // Zone 2 — center
  { x: 0.74, y: 0.50 }, // Zone 3 — center right
  { x: 0.24, y: 0.60 }, // Zone 4 — lower left
  { x: 0.56, y: 0.72 }, // Zone 5 — lower center
];

export default function NightSkyScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const { ready, manifest } = useConstellationBuilder();

  const topPad = Math.max(insets.top, webTop) + 20;
  const bottomPad = Math.max(insets.bottom, webBottom) + 20;
  const skyHeight = height - topPad - bottomPad - 56;

  return (
    <View style={[styles.root, { backgroundColor: SKY }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.backText, { fontFamily: MONO }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.eyebrow, { fontFamily: MONO }]}>YOUR CONSTELLATION</Text>
        <Text style={[styles.title, { fontFamily: SERIF_ITALIC }]}>
          {manifest.practiceName
            ? manifest.practiceName
            : "Six zones, your vocabulary"}
        </Text>
      </View>

      {/* Sky canvas */}
      <View style={[styles.sky, { width, height: skyHeight }]}>

        {/* Faint connector lines between adjacent stars */}
        {/* Zone 0 ↔ Zone 2 */}
        <ConnectorLine
          x1={STAR_POSITIONS[0].x * width}
          y1={STAR_POSITIONS[0].y * skyHeight}
          x2={STAR_POSITIONS[2].x * width}
          y2={STAR_POSITIONS[2].y * skyHeight}
        />
        {/* Zone 1 ↔ Zone 2 */}
        <ConnectorLine
          x1={STAR_POSITIONS[1].x * width}
          y1={STAR_POSITIONS[1].y * skyHeight}
          x2={STAR_POSITIONS[2].x * width}
          y2={STAR_POSITIONS[2].y * skyHeight}
        />
        {/* Zone 2 ↔ Zone 3 */}
        <ConnectorLine
          x1={STAR_POSITIONS[2].x * width}
          y1={STAR_POSITIONS[2].y * skyHeight}
          x2={STAR_POSITIONS[3].x * width}
          y2={STAR_POSITIONS[3].y * skyHeight}
        />
        {/* Zone 2 ↔ Zone 4 */}
        <ConnectorLine
          x1={STAR_POSITIONS[2].x * width}
          y1={STAR_POSITIONS[2].y * skyHeight}
          x2={STAR_POSITIONS[4].x * width}
          y2={STAR_POSITIONS[4].y * skyHeight}
        />
        {/* Zone 4 ↔ Zone 5 */}
        <ConnectorLine
          x1={STAR_POSITIONS[4].x * width}
          y1={STAR_POSITIONS[4].y * skyHeight}
          x2={STAR_POSITIONS[5].x * width}
          y2={STAR_POSITIONS[5].y * skyHeight}
        />
        {/* Zone 3 ↔ Zone 5 */}
        <ConnectorLine
          x1={STAR_POSITIONS[3].x * width}
          y1={STAR_POSITIONS[3].y * skyHeight}
          x2={STAR_POSITIONS[5].x * width}
          y2={STAR_POSITIONS[5].y * skyHeight}
        />

        {/* Stars */}
        {ZONE_GUIDES.map((guide, i) => {
          const pos = STAR_POSITIONS[i];
          const userZone = ready
            ? manifest.zones.find((z) => z.zone === guide.zone)
            : undefined;
          const named = !!(userZone?.name?.trim());
          const displayName = named ? userZone!.name : guide.label;

          return (
            <Pressable
              key={guide.zone}
              onPress={() => router.push("/constellation-builder")}
              style={({ pressed }) => [
                styles.starHitArea,
                {
                  left: pos.x * width - 40,
                  top: pos.y * skyHeight - 40,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              {/* Outer glow ring — only for named zones */}
              {named && (
                <View style={[styles.starGlowRing, { borderColor: `${CREAM}22` }]} />
              )}

              {/* Star dot */}
              <View
                style={[
                  styles.starDot,
                  {
                    backgroundColor: named ? GLOW : DIM,
                    shadowColor: named ? CREAM : "transparent",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: named ? 0.55 : 0,
                    shadowRadius: named ? 8 : 0,
                    elevation: named ? 4 : 0,
                  },
                ]}
              />

              {/* Zone number */}
              <Text
                style={[
                  styles.zoneNum,
                  { color: named ? `${CREAM}80` : `${CREAM}28`, fontFamily: MONO },
                ]}
              >
                {guide.zone}
              </Text>

              {/* Zone name */}
              <Text
                style={[
                  styles.zoneName,
                  {
                    color: named ? CREAM : `${CREAM}35`,
                    fontFamily: named ? SERIF_BOLD : MONO,
                    fontSize: named ? 13 : 10,
                    letterSpacing: named ? 0 : 1.2,
                  },
                ]}
                numberOfLines={2}
              >
                {displayName}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Footer hint */}
      <View style={[styles.footer, { paddingBottom: bottomPad }]}>
        <Text style={[styles.footerHint, { fontFamily: SERIF_ITALIC }]}>
          Tap any star to name your zone
        </Text>
      </View>
    </View>
  );
}

function ConnectorLine({
  x1, y1, x2, y2,
}: {
  x1: number; y1: number; x2: number; y2: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <View
      style={{
        position: "absolute",
        left: x1,
        top: y1,
        width: length,
        height: 1,
        backgroundColor: "rgba(244,237,224,0.07)",
        transformOrigin: "0 50%",
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: 12,
  },
  backBtn: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 12,
    letterSpacing: 1,
    color: "rgba(244,237,224,0.45)",
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: "rgba(244,237,224,0.30)",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    color: "rgba(244,237,224,0.65)",
  },
  sky: {
    position: "relative",
  },
  starHitArea: {
    position: "absolute",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  starGlowRing: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  starDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  zoneNum: {
    fontSize: 8,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  zoneName: {
    textAlign: "center",
    lineHeight: 17,
    maxWidth: 76,
  },
  footer: {
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 28,
  },
  footerHint: {
    fontSize: 13,
    color: "rgba(244,237,224,0.28)",
  },
});

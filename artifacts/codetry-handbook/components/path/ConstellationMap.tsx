// The Pioneer Path as a constellation map.
//
// A self-contained "night sky" panel that replaces the vertical trail
// list on app/path/index.tsx. Each of the five stations is a glowing
// star node positioned as a meandering ascent — Saltbox at the ground,
// Gate at the summit — connected by constellation lines. The panel
// always renders a dark sky regardless of app theme: the constellation
// is the visual plate of the screen, not its chrome.
//
// Visual states preserved from the original TrailMarker:
//   locked    → small, dim, distant; tap is a no-op (parent decides)
//   unlocked  → bright with full glow; the next-to-walk star also pulses
//   completed → filled bright; the segment leaving it is lit and solid
//
// Interaction preserved from the original screen:
//   onPress     → routes to /path/station/[id]
//   onLongPress → opens the parent's peek modal
//
// Implementation notes:
//   - SVG draws the background scatter, the constellation segments, and
//     the static layers of each star. Tap targets are absolutely
//     positioned Pressables on top of the SVG (the SVG itself is
//     non-interactive on this layer), so scroll gestures still work.
//   - The "current" pulse is a Reanimated View overlaid on the active
//     star — keeping animation off the SVG keeps it cheap on web.
//   - Star positions are normalized (0..1) and scaled to the measured
//     panel width, so the constellation lays itself out at any width.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  LinearGradient as RNLinearGradient,
  type LinearGradientProps,
} from "expo-linear-gradient";
import {
  Circle,
  Defs,
  G,
  Line,
  RadialGradient,
  Stop,
  Svg,
} from "@/lib/sharedVision/svg";

// expo-linear-gradient ships a class component whose typings predate
// the React 19 JSX runtime; same pattern as lib/sharedVision/svg.ts.
const LinearGradient =
  RNLinearGradient as unknown as React.FC<LinearGradientProps>;

import type { PioneerStation } from "@/data/pioneerPath";

const SERIF_BOLD = "Lora_700Bold";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const MONO = "JetBrainsMono_500Medium";

export type StationState = "locked" | "unlocked" | "completed";

// Normalized positions on the constellation canvas (0..1). The y axis
// grows downward, so smaller y is higher in the sky. The shape is a
// meandering ascent: Saltbox grounds the bottom-left, Gate caps the
// summit. Positions are keyed by ordinal so any station re-ordering in
// PIONEER_STATIONS (which would itself be an editorial decision)
// continues to lay out cleanly.
const POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 0.30, y: 0.92 },
  2: { x: 0.74, y: 0.74 },
  3: { x: 0.22, y: 0.55 },
  4: { x: 0.68, y: 0.36 },
  5: { x: 0.40, y: 0.14 },
};

// Hand-placed background scatter — distant stars, sized + dimmed to
// suggest depth without competing with the named constellation. The
// list is fixed (not random) so renders are deterministic across web
// hydration and re-mounts.
const SCATTER: { x: number; y: number; r: number; o: number }[] = [
  { x: 0.05, y: 0.08, r: 0.7, o: 0.45 },
  { x: 0.11, y: 0.22, r: 1.3, o: 0.6 },
  { x: 0.18, y: 0.40, r: 0.6, o: 0.4 },
  { x: 0.06, y: 0.70, r: 0.9, o: 0.5 },
  { x: 0.09, y: 0.85, r: 0.5, o: 0.35 },
  { x: 0.50, y: 0.05, r: 0.7, o: 0.5 },
  { x: 0.55, y: 0.30, r: 0.5, o: 0.35 },
  { x: 0.48, y: 0.50, r: 1.1, o: 0.55 },
  { x: 0.52, y: 0.66, r: 0.6, o: 0.4 },
  { x: 0.58, y: 0.88, r: 0.8, o: 0.45 },
  { x: 0.85, y: 0.10, r: 1.0, o: 0.55 },
  { x: 0.92, y: 0.24, r: 0.6, o: 0.4 },
  { x: 0.88, y: 0.50, r: 0.7, o: 0.45 },
  { x: 0.95, y: 0.62, r: 0.5, o: 0.35 },
  { x: 0.86, y: 0.86, r: 1.2, o: 0.55 },
  { x: 0.32, y: 0.22, r: 0.5, o: 0.35 },
  { x: 0.42, y: 0.42, r: 0.6, o: 0.4 },
  { x: 0.14, y: 0.65, r: 0.5, o: 0.35 },
  { x: 0.78, y: 0.18, r: 0.6, o: 0.4 },
  { x: 0.62, y: 0.60, r: 0.5, o: 0.35 },
  { x: 0.78, y: 0.92, r: 0.7, o: 0.45 },
  { x: 0.04, y: 0.45, r: 0.5, o: 0.35 },
  { x: 0.96, y: 0.40, r: 0.5, o: 0.35 },
  { x: 0.36, y: 0.78, r: 0.6, o: 0.4 },
  { x: 0.60, y: 0.20, r: 0.5, o: 0.35 },
];

const ROMAN: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
};

// Fixed visual height for the constellation panel. Sized to feel like
// a generous "plate" on a phone screen without forcing the rest of the
// page below the fold.
const PANEL_HEIGHT = 560;

export type ConstellationMapProps = {
  stations: PioneerStation[];
  stateOf: (id: string) => StationState;
  onStarPress: (station: PioneerStation) => void;
  onStarLongPress: (station: PioneerStation) => void;
};

export function ConstellationMap({
  stations,
  stateOf,
  onStarPress,
  onStarLongPress,
}: ConstellationMapProps) {
  const [width, setWidth] = useState(0);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  // The "current" station is the first unlocked one that isn't yet
  // completed — i.e. the next move available to the reader. We pulse
  // this one to make the affordance unmistakable.
  const currentIndex = useMemo(
    () => stations.findIndex((s) => stateOf(s.id) === "unlocked"),
    [stations, stateOf],
  );

  // Build the segments between consecutive stations. A segment "lights"
  // when the station it leaves from is completed — i.e. the constellation
  // draws itself as the path is walked.
  const segments = useMemo(() => {
    const out: {
      key: string;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      lit: boolean;
    }[] = [];
    for (let i = 1; i < stations.length; i += 1) {
      const a = POSITIONS[stations[i - 1].ordinal];
      const b = POSITIONS[stations[i].ordinal];
      if (!a || !b) continue;
      out.push({
        key: `${stations[i - 1].id}->${stations[i].id}`,
        fromX: a.x * width,
        fromY: a.y * PANEL_HEIGHT,
        toX: b.x * width,
        toY: b.y * PANEL_HEIGHT,
        lit: stateOf(stations[i - 1].id) === "completed",
      });
    }
    return out;
  }, [stations, stateOf, width]);

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {/* Base sky gradient: deep indigo bottom-right, warmer navy top-left
          (the warmer band is where the aurora overlay will sit). */}
      <LinearGradient
        colors={["#0c1336", "#15183a", "#0a0f2e"]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Aurora band — Northern Lights hint, soft green→blue across the
          mid-sky, kept low-opacity so the constellation reads first. */}
      <LinearGradient
        colors={[
          "rgba(120, 220, 180, 0)",
          "rgba(120, 220, 180, 0.20)",
          "rgba(90, 140, 230, 0.14)",
          "rgba(0, 0, 0, 0)",
        ]}
        locations={[0, 0.40, 0.58, 1]}
        start={{ x: 0.05, y: 0.15 }}
        end={{ x: 0.95, y: 0.55 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.7 }]}
      />
      {/* Subtle vignette at the bottom to ground the panel — a horizon. */}
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.35)"]}
        locations={[0.7, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {width > 0 ? (
        <Svg
          width={width}
          height={PANEL_HEIGHT}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Defs>
            <RadialGradient
              id="starGlow"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#fffbf0" stopOpacity={1} />
              <Stop offset="35%" stopColor="#ffe9b5" stopOpacity={0.7} />
              <Stop offset="100%" stopColor="#ffe9b5" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="dimStarGlow"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#aab8e0" stopOpacity={0.7} />
              <Stop offset="100%" stopColor="#aab8e0" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="completedGlow"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#fff2c8" stopOpacity={0.95} />
              <Stop offset="100%" stopColor="#fff2c8" stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* Distant background stars — depth scatter */}
          <G opacity={0.7}>
            {SCATTER.map((p, i) => (
              <Circle
                key={`bg-${i}`}
                cx={p.x * width}
                cy={p.y * PANEL_HEIGHT}
                r={p.r}
                fill="#dfe5f8"
                opacity={p.o}
              />
            ))}
          </G>

          {/* Constellation segments. Lit segments get a soft halo line
              underneath plus the bright center stroke. */}
          {segments.map((seg) =>
            seg.lit ? (
              <G key={seg.key}>
                <Line
                  x1={seg.fromX}
                  y1={seg.fromY}
                  x2={seg.toX}
                  y2={seg.toY}
                  stroke="rgba(255, 233, 181, 0.18)"
                  strokeWidth={6}
                  strokeLinecap="round"
                />
                <Line
                  x1={seg.fromX}
                  y1={seg.fromY}
                  x2={seg.toX}
                  y2={seg.toY}
                  stroke="rgba(255, 240, 200, 0.85)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                />
              </G>
            ) : (
              <Line
                key={seg.key}
                x1={seg.fromX}
                y1={seg.fromY}
                x2={seg.toX}
                y2={seg.toY}
                stroke="rgba(170, 184, 224, 0.30)"
                strokeWidth={1}
                strokeDasharray="3,5"
              />
            ),
          )}

          {/* Stars — visual layer only. Tap targets are above. */}
          {stations.map((s) => {
            const pos = POSITIONS[s.ordinal];
            if (!pos) return null;
            const cx = pos.x * width;
            const cy = pos.y * PANEL_HEIGHT;
            const st = stateOf(s.id);
            if (st === "locked") {
              return (
                <G key={s.id} opacity={0.55}>
                  <Circle
                    cx={cx}
                    cy={cy}
                    r={22}
                    fill="url(#dimStarGlow)"
                  />
                  <Circle cx={cx} cy={cy} r={3.2} fill="#aab8e0" />
                </G>
              );
            }
            if (st === "completed") {
              return (
                <G key={s.id}>
                  <Circle
                    cx={cx}
                    cy={cy}
                    r={36}
                    fill="url(#completedGlow)"
                    opacity={0.6}
                  />
                  <Circle cx={cx} cy={cy} r={9} fill="#fffbf0" />
                  <Circle cx={cx} cy={cy} r={5} fill="#ffe9b5" />
                </G>
              );
            }
            // unlocked
            return (
              <G key={s.id}>
                <Circle
                  cx={cx}
                  cy={cy}
                  r={44}
                  fill="url(#starGlow)"
                  opacity={0.85}
                />
                <Circle cx={cx} cy={cy} r={12} fill="#fffbf0" />
                <Circle cx={cx} cy={cy} r={6.5} fill="#ffe9b5" />
              </G>
            );
          })}
        </Svg>
      ) : null}

      {/* Pulse overlay for the current (next-to-walk) station. */}
      {width > 0 && currentIndex >= 0 ? (
        <CurrentPulse
          x={POSITIONS[stations[currentIndex].ordinal].x * width}
          y={POSITIONS[stations[currentIndex].ordinal].y * PANEL_HEIGHT}
        />
      ) : null}

      {/* Tap targets + labels — positioned absolutely over the SVG. */}
      {width > 0
        ? stations.map((s) => {
            const pos = POSITIONS[s.ordinal];
            if (!pos) return null;
            const left = pos.x * width;
            const top = pos.y * PANEL_HEIGHT;
            const st = stateOf(s.id);
            // Stagger labels left/right so they don't crowd each other
            // and stay within the panel at narrow widths.
            const labelOnRight = pos.x < 0.55;
            // The star host is sized to the hit area; the label is
            // nested inside the Pressable (with pointerEvents="none" so
            // it doesn't capture its own taps) and positioned absolutely
            // to one side. Nesting keeps the visible name + subtitle
            // grouped with the Pressable in the accessibility tree, so
            // screen readers announce one focusable unit per star.
            return (
              <View
                key={s.id}
                pointerEvents="box-none"
                style={[
                  styles.starHost,
                  { left: left - STAR_HIT / 2, top: top - STAR_HIT / 2 },
                ]}
              >
                <Pressable
                  onPress={() => onStarPress(s)}
                  onLongPress={() => onStarLongPress(s)}
                  delayLongPress={400}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Station ${s.ordinal}, ${s.name}. ${s.subtitle}. ${st}.`}
                  accessibilityHint={
                    st === "locked"
                      ? "Tap or long-press to peek the station ahead. Walk the previous station first to open it."
                      : st === "completed"
                        ? "Tap to revisit this station."
                        : "Tap to open this station."
                  }
                  style={({ pressed }) => [
                    styles.starHit,
                    { opacity: pressed && st !== "locked" ? 0.65 : 1 },
                  ]}
                >
                  <View
                    pointerEvents="none"
                    style={[
                      styles.starLabel,
                      labelOnRight ? styles.starLabelRight : styles.starLabelLeft,
                    ]}
                  >
                    <Text
                      style={[
                        styles.ordinal,
                        {
                          fontFamily: MONO,
                          opacity: st === "locked" ? 0.45 : 0.75,
                        },
                        labelOnRight ? styles.alignLeft : styles.alignRight,
                      ]}
                    >
                      {ROMAN[s.ordinal] ?? String(s.ordinal)}
                    </Text>
                    <Text
                      style={[
                        styles.name,
                        {
                          fontFamily: SERIF_BOLD,
                          opacity: st === "locked" ? 0.45 : 1,
                        },
                        labelOnRight ? styles.alignLeft : styles.alignRight,
                      ]}
                      numberOfLines={1}
                    >
                      {s.name}
                    </Text>
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          fontFamily: SERIF_ITALIC,
                          opacity: st === "locked" ? 0.4 : 0.85,
                        },
                        labelOnRight ? styles.alignLeft : styles.alignRight,
                      ]}
                      numberOfLines={2}
                    >
                      {s.subtitle}
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          })
        : null}
    </View>
  );
}

function CurrentPulse({ x, y }: { x: number; y: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.55, { duration: 1900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withTiming(0.15, { duration: 1900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      pointerEvents="none"
      style={[
        styles.pulseHost,
        { left: x - PULSE_SIZE / 2, top: y - PULSE_SIZE / 2 },
      ]}
    >
      <Animated.View style={[styles.pulseDot, animatedStyle]} />
    </View>
  );
}

const STAR_HIT = 64;
const PULSE_SIZE = 90;

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    height: PANEL_HEIGHT,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  starHost: {
    position: "absolute",
    width: STAR_HIT,
    height: STAR_HIT,
    alignItems: "center",
    justifyContent: "center",
  },
  starHit: {
    width: STAR_HIT,
    height: STAR_HIT,
    borderRadius: STAR_HIT / 2,
  },
  starLabel: {
    position: "absolute",
    top: 4,
    width: 138,
  },
  starLabelRight: {
    left: STAR_HIT - 4,
  },
  starLabelLeft: {
    right: STAR_HIT - 4,
  },
  alignLeft: {
    textAlign: "left",
  },
  alignRight: {
    textAlign: "right",
  },
  ordinal: {
    color: "#ffe9b5",
    fontSize: 9,
    letterSpacing: 1.6,
  },
  name: {
    color: "#fffbf0",
    fontSize: 15,
    lineHeight: 18,
    marginTop: 2,
  },
  subtitle: {
    color: "rgba(255, 251, 240, 0.85)",
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
  },
  pulseHost: {
    position: "absolute",
    width: PULSE_SIZE,
    height: PULSE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseDot: {
    width: PULSE_SIZE,
    height: PULSE_SIZE,
    borderRadius: PULSE_SIZE / 2,
    backgroundColor: "rgba(255, 233, 181, 0.32)",
  },
});

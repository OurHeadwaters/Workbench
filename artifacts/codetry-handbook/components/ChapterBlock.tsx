import React, { useEffect, useRef, useState } from "react";
import { Animated, LayoutAnimation, Linking, Platform, Pressable, StyleSheet, Text, UIManager, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useColors } from "@/hooks/useColors";
import { useReader } from "@/contexts/ReaderState";
import type { Block } from "@/data/handbook";
import { InlineText } from "./InlineText";
import { J } from "@/theme/journal";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

export function ChapterBlock({
  block,
  fontScale,
  onLongPress,
  bookmarked,
  onPressRef,
  highlighted,
  glossaryTerms,
  onPressGlossaryTerm,
}: {
  block: Block;
  fontScale: number;
  onLongPress?: (excerpt: string) => void;
  bookmarked?: boolean;
  onPressRef?: (chapterId: string) => void;
  highlighted?: boolean;
  glossaryTerms?: string[];
  onPressGlossaryTerm?: (term: string) => void;
}) {
  const c = useColors();
  const { theme } = useReader();
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const baseSize = 17 * fontScale;
  const lineHeight = baseSize * 1.8;
  const smallSize = 13 * fontScale;
  const subheadSize = 15 * fontScale;
  const pullSize = baseSize * 1.05;
  const refStyle = {
    color: c.foreground,
    fontFamily: SERIF_BOLD,
    textDecorationLine: "underline" as const,
    textDecorationColor: c.muted,
  };
  const glossaryTermStyle = {
    color: c.foreground,
    textDecorationLine: "underline" as const,
    textDecorationStyle: "dotted" as const,
    textDecorationColor: c.primary,
  };

  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!highlighted) return;
    glowAnim.setValue(0);
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(900),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [highlighted]);

  const glowColor =
    theme === "dark"
      ? "rgba(140, 200, 140, 0.18)"
      : "rgba(200, 175, 60, 0.22)";

  function wrapWithGlow(content: React.ReactNode) {
    return (
      <View style={styles.glowWrapper}>
        {content}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.glowOverlay,
            { opacity: glowAnim, backgroundColor: glowColor },
          ]}
          pointerEvents="none"
        />
      </View>
    );
  }

  switch (block.kind) {
    case "para": {
      const handleLong = onLongPress
        ? () => onLongPress(block.text)
        : undefined;
      return wrapWithGlow(
        <Pressable
          onLongPress={handleLong}
          delayLongPress={350}
          style={styles.row}
        >
          {bookmarked ? (
            <View
              style={[
                styles.bookmarkDot,
                { backgroundColor: c.foreground },
              ]}
            />
          ) : null}
          <InlineText
            text={block.text}
            style={[
              styles.body,
              {
                color: c.foreground,
                fontFamily: SERIF,
                fontSize: baseSize,
                lineHeight,
              },
            ]}
            italicStyle={{ fontFamily: SERIF_ITALIC }}
            onPressRef={onPressRef}
            refStyle={refStyle}
            glossaryTerms={glossaryTerms}
            onPressGlossaryTerm={onPressGlossaryTerm}
            glossaryTermStyle={glossaryTermStyle}
          />
        </Pressable>,
      );
    }
    case "subhead":
      return wrapWithGlow(
        <View style={styles.row}>
          <InlineText
            text={block.text}
            style={{
              color: c.foreground,
              fontFamily: SERIF_BOLD,
              fontSize: subheadSize,
              lineHeight: subheadSize * 1.4,
              marginTop: 8,
              marginBottom: 4,
              letterSpacing: 0.2,
            }}
            onPressRef={onPressRef}
            refStyle={refStyle}
            glossaryTerms={glossaryTerms}
            onPressGlossaryTerm={onPressGlossaryTerm}
            glossaryTermStyle={glossaryTermStyle}
          />
        </View>,
      );
    case "small":
      return wrapWithGlow(
        <View style={styles.smallWrap}>
          <View style={styles.smallLedge} />
          <View style={[styles.smallInner, { backgroundColor: J.color.syntaxBg }]}>
            <InlineText
              text={block.text}
              style={{
                color: J.color.syntaxGreen,
                fontFamily: MONO,
                fontSize: smallSize,
                lineHeight: smallSize * 1.6,
                letterSpacing: 0.6,
                textTransform: "uppercase",
              }}
              italicStyle={{ fontFamily: MONO }}
              boldStyle={{
                fontFamily: "JetBrainsMono_600SemiBold",
                color: J.color.syntaxGreen,
                textTransform: "uppercase",
              }}
              onPressRef={onPressRef}
              refStyle={{
                color: J.color.syntaxAmber,
                fontFamily: MONO,
                textDecorationLine: "underline",
                textDecorationColor: J.color.syntaxMuted,
              }}
            />
          </View>
        </View>,
      );
    case "pull":
      return wrapWithGlow(
        <View
          style={[
            styles.pull,
            { borderLeftColor: c.muted },
          ]}
        >
          <InlineText
            text={block.text}
            style={{
              color: c.pullQuote,
              fontFamily: SERIF_ITALIC,
              fontSize: pullSize,
              lineHeight: pullSize * 1.5,
            }}
            italicStyle={{ fontFamily: SERIF_ITALIC }}
          />
        </View>,
      );
    case "callout":
      return wrapWithGlow(
        <View style={styles.calloutWrap}>
          {/* Amber left strip — marginalia accent */}
          <View style={[styles.calloutStrip, { backgroundColor: J.color.amber }]} />
          <View style={[styles.callout, { backgroundColor: c.card }]}>
            {/* Northern field note icon */}
            <View style={styles.calloutIcon} pointerEvents="none">
              <Ionicons name="leaf-outline" size={12} color={`${J.color.amber}70`} />
            </View>
            <InlineText
              text={block.text}
              style={{
                color: c.foreground,
                fontFamily: SERIF_ITALIC,
                fontSize: baseSize,
                lineHeight,
              }}
              italicStyle={{ fontFamily: SERIF_ITALIC }}
              onPressRef={onPressRef}
              refStyle={refStyle}
              glossaryTerms={glossaryTerms}
              onPressGlossaryTerm={onPressGlossaryTerm}
              glossaryTermStyle={glossaryTermStyle}
            />
          </View>
        </View>,
      );
    case "examples": {
      const itemCount = block.items.length;
      const handleToggle = () => {
        if (Platform.OS === "android") {
          UIManager.setLayoutAnimationEnabledExperimental?.(true);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExamplesOpen((prev) => !prev);
      };
      return wrapWithGlow(
        <View style={styles.examples}>
          <Pressable
            onPress={handleToggle}
            style={[styles.examplesHeader, { borderColor: c.rule }]}
          >
            <Text
              style={{
                color: c.mutedForeground,
                fontFamily: MONO,
                fontSize: smallSize,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                flex: 1,
              }}
            >
              {`Worked examples · ${itemCount} term${itemCount === 1 ? "" : "s"}`}
            </Text>
            <Ionicons
              name={examplesOpen ? "chevron-up" : "chevron-down"}
              size={14}
              color={c.mutedForeground}
            />
          </Pressable>
          {examplesOpen
            ? block.items.map((ex, i) => {
                const handleLong = onLongPress
                  ? () => onLongPress(`${ex.name} — ${ex.rule}`)
                  : undefined;
                return (
                  <Pressable
                    key={`${ex.name}-${i}`}
                    onLongPress={handleLong}
                    delayLongPress={350}
                    style={[styles.exampleItem, { borderColor: c.rule }]}
                  >
                    <InlineText
                      text={ex.name}
                      style={{
                        color: c.foreground,
                        fontFamily: MONO,
                        fontSize: smallSize,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    />
                    <InlineText
                      text={ex.rule}
                      style={{
                        color: c.foreground,
                        fontFamily: SERIF,
                        fontSize: baseSize,
                        lineHeight,
                      }}
                      italicStyle={{ fontFamily: SERIF_ITALIC }}
                    />
                  </Pressable>
                );
              })
            : null}
        </View>,
      );
    }
    case "list":
      return wrapWithGlow(
        <View style={styles.list}>
          {block.items.map((it, i) => (
            <View key={i} style={styles.listItem}>
              <InlineText
                text="•"
                style={{
                  color: c.mutedForeground,
                  fontFamily: SERIF,
                  fontSize: baseSize,
                  lineHeight,
                  width: 18,
                }}
              />
              <InlineText
                text={it}
                style={{
                  color: c.foreground,
                  fontFamily: SERIF,
                  fontSize: baseSize,
                  lineHeight,
                  flex: 1,
                }}
                italicStyle={{ fontFamily: SERIF_ITALIC }}
                onPressRef={onPressRef}
                refStyle={refStyle}
                glossaryTerms={glossaryTerms}
                onPressGlossaryTerm={onPressGlossaryTerm}
                glossaryTermStyle={glossaryTermStyle}
              />
            </View>
          ))}
        </View>,
      );
    case "ordered":
      return wrapWithGlow(
        <View style={styles.list}>
          {block.items.map((it, i) => (
            <Pressable
              key={i}
              onLongPress={onLongPress ? () => onLongPress(it) : undefined}
              delayLongPress={350}
              style={styles.listItem}
            >
              <InlineText
                text={`${i + 1}.`}
                style={{
                  color: c.mutedForeground,
                  fontFamily: MONO,
                  fontSize: smallSize,
                  lineHeight,
                  width: 26,
                }}
              />
              <InlineText
                text={it}
                style={{
                  color: c.foreground,
                  fontFamily: SERIF,
                  fontSize: baseSize,
                  lineHeight,
                  flex: 1,
                }}
                italicStyle={{ fontFamily: SERIF_ITALIC }}
                onPressRef={onPressRef}
                refStyle={refStyle}
                glossaryTerms={glossaryTerms}
                onPressGlossaryTerm={onPressGlossaryTerm}
                glossaryTermStyle={glossaryTermStyle}
              />
            </Pressable>
          ))}
        </View>,
      );
    case "collapsible": {
      const handleCollapsibleToggle = () => {
        if (Platform.OS === "android") {
          UIManager.setLayoutAnimationEnabledExperimental?.(true);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCollapsibleOpen((prev) => !prev);
      };
      return wrapWithGlow(
        <View style={styles.examples}>
          <Pressable
            onPress={handleCollapsibleToggle}
            style={[styles.examplesHeader, { borderColor: c.rule }]}
          >
            <Text
              style={{
                color: c.mutedForeground,
                fontFamily: MONO,
                fontSize: smallSize,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                flex: 1,
              }}
            >
              {block.label}
            </Text>
            <Ionicons
              name={collapsibleOpen ? "chevron-up" : "chevron-down"}
              size={14}
              color={c.mutedForeground}
            />
          </Pressable>
          {collapsibleOpen
            ? block.blocks.map((innerBlock, i) => (
                <ChapterBlock
                  key={i}
                  block={innerBlock}
                  fontScale={fontScale}
                  onLongPress={onLongPress}
                  onPressRef={onPressRef}
                  glossaryTerms={glossaryTerms}
                  onPressGlossaryTerm={onPressGlossaryTerm}
                />
              ))
            : null}
        </View>,
      );
    }
    case "teachers":
      return wrapWithGlow(
        <View style={[styles.teachersPanel, { borderColor: c.rule, backgroundColor: c.card }]}>
          <Text style={{ color: c.mutedForeground, fontFamily: MONO, fontSize: smallSize, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>
            Meet the teachers
          </Text>
          {block.items.map((teacher, i) => (
            <Pressable
              key={teacher.name}
              onPress={teacher.url ? () => Linking.openURL(teacher.url!).catch(() => {}) : undefined}
              style={({ pressed }) => [
                styles.teacherRow,
                i < block.items.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.rule },
                pressed && teacher.url ? { opacity: 0.65 } : null,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: c.foreground, fontFamily: SERIF_BOLD, fontSize: subheadSize, lineHeight: subheadSize * 1.35 }}>
                  {teacher.name}
                </Text>
                <Text style={{ color: c.mutedForeground, fontFamily: SERIF_ITALIC, fontSize: smallSize * 1.1, lineHeight: smallSize * 1.6, marginTop: 2 }}>
                  {teacher.role}
                </Text>
              </View>
              {teacher.url ? (
                <Ionicons name="open-outline" size={14} color={c.mutedForeground} style={{ marginTop: 4 }} />
              ) : null}
            </Pressable>
          ))}
        </View>,
      );
    case "rule":
      return wrapWithGlow(
        <View
          style={[
            styles.rule,
            { backgroundColor: c.rule },
          ]}
        />,
      );
    case "tool":
      return <ToolCardBlock block={block} fontScale={fontScale} />;
  }
}

// ── Tool Card Block ───────────────────────────────────────────────────────────
// Extracted into its own component so hooks (useRef) don't live inside a
// switch-case branch (which would violate the Rules of Hooks).

function ToolCardBlock({
  block,
  fontScale,
}: {
  block: { kind: "tool"; label: string; hint: string; route: string };
  fontScale: number;
}) {
  const subheadSize = 15 * fontScale;
  const lift  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const borderColor = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [`${J.color.amber}40`, `${J.color.amber}90`],
  });
  const shadowOpacity = lift.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.24] });

  const onIn = () =>
    Animated.parallel([
      Animated.spring(lift,  { toValue: 1, useNativeDriver: false, tension: 200, friction: 12 }),
      Animated.spring(scale, { toValue: 0.984, useNativeDriver: true, tension: 200, friction: 12 }),
    ]).start();

  const onOut = () =>
    Animated.parallel([
      Animated.spring(lift,  { toValue: 0, useNativeDriver: false, tension: 200, friction: 12 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 12 }),
    ]).start();

  const isExternal = block.route.startsWith("http://") || block.route.startsWith("https://");

  return (
    <Pressable
      onPress={() => isExternal ? Linking.openURL(block.route).catch(() => {}) : router.push(block.route as any)}
      onPressIn={onIn}
      onPressOut={onOut}
    >
      <Animated.View
        style={[
          styles.toolCard,
          {
            transform: [{ scale }],
            borderColor,
            shadowColor: J.color.amber,
            shadowOpacity,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 12,
            elevation: 3,
          },
        ]}
      >
        <View style={styles.toolCardHeader}>
          <View style={styles.toolCardDot} />
          <Text style={[styles.toolCardEyebrow, { fontFamily: MONO }]}>FIELD TOOL</Text>
          <Text style={[styles.toolCardArrow,  { fontFamily: MONO }]}>→</Text>
        </View>
        <View style={styles.toolCardBody}>
          <Text style={{
            color: J.color.evergreen,
            fontFamily: SERIF_BOLD,
            fontSize: subheadSize,
            lineHeight: subheadSize * 1.35,
            marginBottom: 4,
          }}>
            {block.label}
          </Text>
          <Text style={{
            color: `${J.color.evergreen}99`,
            fontFamily: SERIF_ITALIC,
            fontSize: 14 * fontScale,
            lineHeight: 14 * fontScale * 1.55,
          }}>
            {block.hint}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// Static helper for the chrome to know what icon to show.
export function BookmarkIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <Ionicons
      name={filled ? "bookmark" : "bookmark-outline"}
      size={18}
      color={color}
    />
  );
}

const styles = StyleSheet.create({
  glowWrapper: { position: "relative" },
  glowOverlay: { borderRadius: 3 },
  row: { paddingVertical: 8 },
  body: {},
  bookmarkDot: {
    position: "absolute",
    left: -14,
    top: 18,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.65,
  },
  smallWrap: {
    flexDirection: "row",
    marginVertical: 10,
    borderRadius: J.radius.sm,
    overflow: "hidden",
  },
  smallLedge: {
    width: 2,
    backgroundColor: J.color.syntaxGreen,
    opacity: 0.5,
    flexShrink: 0,
  },
  smallInner: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopRightRadius: J.radius.sm,
    borderBottomRightRadius: J.radius.sm,
  },
  pull: {
    borderLeftWidth: 2,
    paddingLeft: 16,
    paddingVertical: 12,
    marginVertical: 12,
  },
  calloutWrap: {
    flexDirection: "row",
    marginVertical: 12,
    borderRadius: J.radius.sm,
    overflow: "hidden",
  },
  calloutStrip: {
    width: 3,
    flexShrink: 0,
  },
  calloutIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  callout: {
    flex: 1,
    padding: 16,
    paddingRight: 28,
    borderTopRightRadius: J.radius.sm,
    borderBottomRightRadius: J.radius.sm,
  },
  examples: { marginVertical: 8 },
  examplesHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 0,
  },
  exampleItem: {
    borderTopWidth: 1,
    paddingVertical: 14,
  },
  list: { marginVertical: 8 },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },
  teachersPanel: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    marginVertical: 12,
  },
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  rule: {
    height: 1,
    marginVertical: 20,
    opacity: 0.6,
  },
  toolCard: {
    borderWidth: 1,
    borderRadius: J.radius.md,
    marginVertical: 12,
    overflow: "hidden",
    backgroundColor: J.color.parchment,
  },
  toolCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: J.color.canopy,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${J.color.amber}30`,
  },
  toolCardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: J.color.amber,
  },
  toolCardEyebrow: {
    flex: 1,
    fontSize: 9,
    letterSpacing: 2,
    color: J.color.amber,
    textTransform: "uppercase",
  },
  toolCardArrow: {
    fontSize: 13,
    color: `${J.color.amber}80`,
  },
  toolCardBody: {
    padding: 14,
  },
});

import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useReader } from "@/contexts/ReaderState";
import type { Block } from "@/data/handbook";
import { InlineText } from "./InlineText";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

export function ChapterBlock({
  block,
  fontScale,
  onLongPress,
  bookmarked,
  onPressRef,
  highlighted,
}: {
  block: Block;
  fontScale: number;
  onLongPress?: (excerpt: string) => void;
  bookmarked?: boolean;
  onPressRef?: (chapterId: string) => void;
  highlighted?: boolean;
}) {
  const c = useColors();
  const { theme } = useReader();
  const baseSize = 17 * fontScale;
  const lineHeight = baseSize * 1.55;
  const smallSize = 13 * fontScale;
  const subheadSize = 15 * fontScale;
  const pullSize = baseSize * 1.05;
  const refStyle = {
    color: c.foreground,
    fontFamily: SERIF_BOLD,
    textDecorationLine: "underline" as const,
    textDecorationColor: c.muted,
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
          />
        </View>,
      );
    case "small":
      return wrapWithGlow(
        <View style={styles.row}>
          <InlineText
            text={block.text}
            style={{
              color: c.mutedForeground,
              fontFamily: MONO,
              fontSize: smallSize,
              lineHeight: smallSize * 1.5,
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
            italicStyle={{ fontFamily: MONO }}
            onPressRef={onPressRef}
            refStyle={{
              color: c.foreground,
              fontFamily: MONO,
              textDecorationLine: "underline",
              textDecorationColor: c.muted,
            }}
          />
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
        <View
          style={[
            styles.callout,
            { backgroundColor: c.card, borderColor: c.rule },
          ]}
        >
          <InlineText
            text={block.text}
            style={{
              color: c.foreground,
              fontFamily: SERIF,
              fontSize: baseSize,
              lineHeight,
            }}
            italicStyle={{ fontFamily: SERIF_ITALIC }}
            onPressRef={onPressRef}
            refStyle={refStyle}
          />
        </View>,
      );
    case "examples":
      return wrapWithGlow(
        <View style={styles.examples}>
          {block.items.map((ex, i) => {
            const handleLong = onLongPress
              ? () => onLongPress(`${ex.name} — ${ex.rule}`)
              : undefined;
            return (
              <Pressable
                key={`${ex.name}-${i}`}
                onLongPress={handleLong}
                delayLongPress={350}
                style={[
                  styles.exampleItem,
                  { borderColor: c.rule },
                ]}
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
          })}
        </View>,
      );
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
              />
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
  }
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
  pull: {
    borderLeftWidth: 2,
    paddingLeft: 16,
    paddingVertical: 12,
    marginVertical: 12,
  },
  callout: {
    borderWidth: 1,
    padding: 16,
    marginVertical: 12,
    borderRadius: 2,
  },
  examples: { marginVertical: 8 },
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
  rule: {
    height: 1,
    marginVertical: 20,
    opacity: 0.6,
  },
});

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useReader } from "@/contexts/ReaderState";

const MONO = "JetBrainsMono_500Medium";

export function TopChrome({
  visible,
  partLabel,
  chapterNumber,
  bookmarkActive,
  onBack,
  onToggleBookmark,
}: {
  visible: boolean;
  partLabel: string;
  chapterNumber: string;
  bookmarkActive: boolean;
  onBack: () => void;
  onToggleBookmark: () => void;
}) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  if (!visible) return null;
  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.top,
        {
          paddingTop: Math.max(insets.top, webTop) + 8,
          backgroundColor: c.chrome,
          borderBottomColor: c.chromeBorder,
        },
      ]}
    >
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={styles.iconBtn}
        accessibilityLabel="Back to contents"
      >
        <Ionicons name="chevron-back" size={22} color={c.foreground} />
      </Pressable>
      <View style={styles.topCenter}>
        <Text
          style={[
            styles.label,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
          numberOfLines={1}
        >
          {partLabel}
        </Text>
        <Text
          style={[
            styles.label,
            {
              color: c.foreground,
              fontFamily: MONO,
              marginTop: 2,
            },
          ]}
        >
          {chapterNumber}
        </Text>
      </View>
      <Pressable
        onPress={onToggleBookmark}
        hitSlop={12}
        style={styles.iconBtn}
        accessibilityLabel={
          bookmarkActive ? "Remove bookmark" : "Bookmark this chapter"
        }
      >
        <Ionicons
          name={bookmarkActive ? "bookmark" : "bookmark-outline"}
          size={20}
          color={c.foreground}
        />
      </Pressable>
    </View>
  );
}

export function BottomChrome({
  visible,
  onDecreaseFont,
  onIncreaseFont,
  onCycleTheme,
  onShare,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  visible: boolean;
  onDecreaseFont: () => void;
  onIncreaseFont: () => void;
  onCycleTheme: () => void;
  onShare: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const c = useColors();
  const { themeMode } = useReader();
  const insets = useSafeAreaInsets();
  const webBottom = Platform.OS === "web" ? 34 : 0;
  if (!visible) return null;

  const themeIcon =
    themeMode === "system"
      ? "contrast-outline"
      : themeMode === "dark"
      ? "moon-outline"
      : "sunny-outline";

  return (
    <View
      style={[
        styles.bottom,
        {
          paddingBottom: Math.max(insets.bottom, webBottom) + 8,
          backgroundColor: c.chrome,
          borderTopColor: c.chromeBorder,
        },
      ]}
    >
      <Pressable
        onPress={onDecreaseFont}
        hitSlop={10}
        style={styles.iconBtn}
        accessibilityLabel="Decrease font size"
      >
        <Text
          style={{
            color: c.foreground,
            fontFamily: MONO,
            fontSize: 14,
          }}
        >
          A−
        </Text>
      </Pressable>
      <Pressable
        onPress={onIncreaseFont}
        hitSlop={10}
        style={styles.iconBtn}
        accessibilityLabel="Increase font size"
      >
        <Text
          style={{
            color: c.foreground,
            fontFamily: MONO,
            fontSize: 18,
          }}
        >
          A+
        </Text>
      </Pressable>
      <View style={[styles.divider, { backgroundColor: c.chromeBorder }]} />
      <Pressable
        onPress={onCycleTheme}
        hitSlop={10}
        style={styles.iconBtn}
        accessibilityLabel="Cycle theme"
      >
        <Ionicons name={themeIcon as any} size={18} color={c.foreground} />
      </Pressable>
      <Pressable
        onPress={onShare}
        hitSlop={10}
        style={styles.iconBtn}
        accessibilityLabel="Share chapter"
      >
        <Ionicons
          name="share-outline"
          size={20}
          color={c.foreground}
        />
      </Pressable>
      <View style={[styles.divider, { backgroundColor: c.chromeBorder }]} />
      <Pressable
        onPress={onPrev}
        disabled={!hasPrev}
        hitSlop={10}
        style={[styles.iconBtn, !hasPrev && styles.disabled]}
        accessibilityLabel="Previous chapter"
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={c.foreground}
        />
      </Pressable>
      <Pressable
        onPress={onNext}
        disabled={!hasNext}
        hitSlop={10}
        style={[styles.iconBtn, !hasNext && styles.disabled]}
        accessibilityLabel="Next chapter"
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color={c.foreground}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  topCenter: {
    flex: 1,
    alignItems: "center",
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 6,
    zIndex: 10,
  },
  iconBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  disabled: { opacity: 0.3 },
  divider: { width: StyleSheet.hairlineWidth, height: 22, marginHorizontal: 6, opacity: 0.4 },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});

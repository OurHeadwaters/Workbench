import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SyncStatusPill } from "@/components/SyncStatusPill";
import { useColors } from "@/hooks/useColors";
import { useReader } from "@/contexts/ReaderState";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

function formatWhen(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `Today · ${h}:${m}`;
  }
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Bookmarks() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { bookmarks, removeBookmark } = useReader();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, webTop) + 8,
            borderBottomColor: c.chromeBorder,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={22} color={c.foreground} />
        </Pressable>
        <Text
          style={{
            color: c.mutedForeground,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            flex: 1,
            textAlign: "center",
          }}
        >
          Bookmarks
        </Text>
        <View style={styles.syncSlot}>
          <SyncStatusPill showLabel />
        </View>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="bookmark-outline"
            size={28}
            color={c.mutedForeground}
          />
          <Text
            style={[
              styles.emptyTitle,
              { color: c.foreground, fontFamily: SERIF_BOLD },
            ]}
          >
            Nothing kept yet.
          </Text>
          <Text
            style={[
              styles.emptyText,
              { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
            ]}
          >
            Long-press any paragraph in the book to keep a line. Bookmarks live
            on this device only.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingBottom: Math.max(insets.bottom, webBottom) + 32,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {bookmarks.map((b) => (
            <View key={b.id} style={styles.row}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/chapter/[id]",
                    params: { id: b.chapterId },
                  })
                }
                style={({ pressed }) => [
                  styles.rowMain,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[
                    styles.rowEyebrow,
                    { color: c.mutedForeground, fontFamily: MONO },
                  ]}
                >
                  {b.partLabel} · {b.chapterTitle}
                </Text>
                <Text
                  style={[
                    styles.rowExcerpt,
                    { color: c.foreground, fontFamily: SERIF_ITALIC },
                  ]}
                  numberOfLines={4}
                >
                  “{b.excerpt}”
                </Text>
                <Text
                  style={[
                    styles.rowMeta,
                    { color: c.mutedForeground, fontFamily: MONO },
                  ]}
                >
                  {formatWhen(b.createdAt)}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => removeBookmark(b.id)}
                hitSlop={12}
                style={styles.removeBtn}
                accessibilityLabel="Remove bookmark"
              >
                <Ionicons
                  name="close"
                  size={18}
                  color={c.mutedForeground}
                />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    minWidth: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  syncSlot: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  scroll: { paddingHorizontal: 24, paddingTop: 8 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  rowMain: { flex: 1, paddingRight: 12 },
  rowEyebrow: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  rowExcerpt: {
    fontSize: 16,
    lineHeight: 24,
  },
  rowMeta: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 8,
  },
  removeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});

import { Ionicons } from "@expo/vector-icons";
import React, { useSyncExternalStore } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import {
  dismissAmbientNotice,
  getSyncSnapshot,
  subscribeSyncStatus,
  type SyncSnapshot,
} from "@/lib/saveStatus";

const MONO = "JetBrainsMono_500Medium";

function useSyncSnapshot(): SyncSnapshot {
  return useSyncExternalStore(
    subscribeSyncStatus,
    getSyncSnapshot,
    getSyncSnapshot,
  );
}

// Calm, dismissible heads-up for ambient writes (currently just the
// last-read scroll position) that have failed enough times in a row that
// the writer would otherwise be silently sent back to the top of the
// chapter on next reload. Visually distinct from `SyncErrorBanner` —
// muted card colors, no retry action — so writers don't conflate it with
// the destructive per-action retry banner. Anchored to the bottom so it
// doesn't fight the per-action banner for the top slot.
export function LastReadSaveNotice() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const snap = useSyncSnapshot();
  const notices = snap.ambientNotices;
  if (notices.length === 0) return null;

  // Most-recently-surfaced first; we only show one at a time.
  const latest = notices.reduce((a, b) =>
    a.surfacedAt >= b.surfacedAt ? a : b,
  );

  const bottomInset = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 8);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: bottomInset + 12 }]}
    >
      <View
        accessibilityLiveRegion="polite"
        style={[
          styles.notice,
          {
            backgroundColor: c.card,
            borderColor: c.border,
            borderRadius: c.radius,
          },
        ]}
        testID="last-read-save-notice"
      >
        <Ionicons
          name="bookmark-outline"
          size={14}
          color={c.mutedForeground}
        />
        <Text
          style={[
            styles.text,
            { color: c.cardForeground, fontFamily: MONO },
          ]}
          numberOfLines={2}
        >
          {latest.message}
        </Text>
        <Pressable
          onPress={() => dismissAmbientNotice(latest.id)}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notice"
          hitSlop={10}
          style={({ pressed }) => [
            styles.dismissBtn,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          testID="last-read-save-notice-dismiss"
        >
          <Ionicons name="close" size={16} color={c.mutedForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 12,
    zIndex: 19,
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: 520,
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  text: {
    flex: 1,
    fontSize: 11,
    letterSpacing: 0.3,
    lineHeight: 15,
  },
  dismissBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});

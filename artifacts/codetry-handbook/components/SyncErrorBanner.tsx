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

// Surfaces the most recent named save failure with a one-tap retry.
// Stays visible regardless of chrome auto-hide so the writer always has
// a way to recover.
export function SyncErrorBanner() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const snap = useSyncSnapshot();
  const failed = snap.failedOps;
  if (failed.length === 0) return null;

  // Pick the most-recently-failed op explicitly, in case insertion order
  // and recency ever diverge.
  const latest = failed.reduce((a, b) => (a.failedAt >= b.failedAt ? a : b));
  const more = failed.length - 1;

  // Retry every queued failure — they're idempotent setItem calls and
  // bunching them avoids forcing the writer into a multi-tap pile-up.
  const onRetry = () => {
    for (const op of [...failed]) void op.retry();
  };

  // Match TopChrome's top-padding math so the banner sits just under it.
  const webTop = Platform.OS === "web" ? 67 : 0;
  const topInset = Math.max(insets.top, webTop);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { top: topInset + 56 }]}
    >
      <View
        accessibilityLiveRegion="polite"
        style={[
          styles.banner,
          {
            backgroundColor: c.destructive,
            borderColor: c.chromeBorder,
            borderRadius: c.radius,
          },
        ]}
        testID="sync-error-banner"
      >
        <Ionicons
          name="warning-outline"
          size={16}
          color={c.destructiveForeground}
        />
        <Text
          style={[
            styles.text,
            { color: c.destructiveForeground, fontFamily: MONO },
          ]}
          numberOfLines={2}
        >
          Couldn&rsquo;t save {latest.label}
          {more > 0 ? ` (+${more} more)` : ""}
        </Text>
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={`Retry saving ${latest.label}`}
          hitSlop={10}
          style={({ pressed }) => [
            styles.retryBtn,
            {
              borderColor: c.destructiveForeground,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          testID="sync-error-retry"
        >
          <Text
            style={[
              styles.retryText,
              { color: c.destructiveForeground, fontFamily: MONO },
            ]}
          >
            Retry
          </Text>
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
    zIndex: 20,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    maxWidth: 520,
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  text: {
    flex: 1,
    fontSize: 12,
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  retryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  retryText: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});

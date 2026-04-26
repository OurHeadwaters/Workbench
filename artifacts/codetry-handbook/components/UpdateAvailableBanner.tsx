import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const MONO = "JetBrainsMono_500Medium";
const UPDATE_EVENT = "codetry-handbook:update-available";

export function UpdateAvailableBanner() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (typeof window === "undefined") return;
    // Catch the case where the SW fired the event before this component
    // had a chance to subscribe.
    if ((window as unknown as { __codetryHandbookUpdateReady?: boolean })
      .__codetryHandbookUpdateReady) {
      setVisible(true);
    }
    const handler = () => setVisible(true);
    window.addEventListener(UPDATE_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handler as EventListener);
    };
  }, []);

  if (Platform.OS !== "web") return null;
  if (!visible) return null;

  const handleRefresh = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };
  const handleDismiss = () => setVisible(false);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: insets.bottom + 12 }]}
    >
      <View
        style={[
          styles.banner,
          {
            backgroundColor: c.primary,
            borderColor: c.chromeBorder,
            borderRadius: c.radius,
          },
        ]}
      >
        <Pressable
          onPress={handleRefresh}
          style={styles.message}
          accessibilityRole="button"
          accessibilityLabel="Refresh to load the new version"
        >
          <Text
            style={[
              styles.text,
              { color: c.primaryForeground, fontFamily: MONO },
            ]}
          >
            New version available — tap to refresh
          </Text>
        </Pressable>
        <Pressable
          onPress={handleDismiss}
          hitSlop={12}
          style={styles.dismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss update notice"
        >
          <Text
            style={[
              styles.dismissText,
              { color: c.primaryForeground, fontFamily: MONO },
            ]}
          >
            ×
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
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: 480,
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  message: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  dismiss: {
    marginLeft: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dismissText: {
    fontSize: 18,
    lineHeight: 18,
  },
});

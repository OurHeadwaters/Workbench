import { Ionicons } from "@expo/vector-icons";
import React, { useSyncExternalStore } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import {
  getSyncSnapshot,
  subscribeSyncStatus,
  type SyncSnapshot,
  type SyncStatus,
} from "@/lib/saveStatus";

const MONO = "JetBrainsMono_500Medium";

function useSyncSnapshot(): SyncSnapshot {
  return useSyncExternalStore(
    subscribeSyncStatus,
    getSyncSnapshot,
    getSyncSnapshot,
  );
}

interface PillView {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  prominent: boolean;
}

const VIEW_BY_STATUS: Record<SyncStatus, PillView> = {
  saving: {
    label: "Saving…",
    iconName: "sync-outline",
    prominent: false,
  },
  // "saved here" makes clear the data isn't endangered — bookmarks
  // already landed on the device.
  offline: {
    label: "Offline · saved here",
    iconName: "cloud-offline-outline",
    prominent: true,
  },
  error: {
    label: "Couldn't save",
    iconName: "warning-outline",
    prominent: true,
  },
  idle: {
    label: "Saved",
    iconName: "checkmark-circle-outline",
    prominent: false,
  },
};

// RN equivalent of the Wordpile web SyncStatusPill. Pass `showLabel`
// where there is room for the full text.
export function SyncStatusPill({
  showLabel = false,
}: {
  showLabel?: boolean;
}) {
  const c = useColors();
  const snap = useSyncSnapshot();
  const view = VIEW_BY_STATUS[snap.status];
  const tone = view.prominent ? c.foreground : c.mutedForeground;
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={view.label}
      testID={`sync-status-${snap.status}`}
      style={styles.row}
    >
      <Ionicons name={view.iconName} size={14} color={tone} />
      {showLabel ? (
        <Text
          style={[styles.label, { color: tone, fontFamily: MONO }]}
          numberOfLines={1}
        >
          {view.label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});

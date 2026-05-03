// Daily Driver home screen.
//
// Empty state: a single "Build your first driver" call to action.
// With drivers: a "TODAY" card showing the primary driver's action,
// then a list of all active drivers.

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

import { useColors } from "@/hooks/useColors";
import { useDailyDriver } from "@/lib/dailyDriver/store";
import { GOAL_KIND_LABELS } from "@/data/dailyDriver";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function DriverHome() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { ready, drivers, primaryDriver } = useDailyDriver();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const active = drivers.filter((d) => d.status === "active");
  const paused = drivers.filter((d) => d.status === "paused");

  if (!ready) {
    return <View style={[styles.root, { backgroundColor: c.background }]} />;
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 24,
            paddingBottom: Math.max(insets.bottom, webBottom) + 48,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.replace("/")}
          accessibilityLabel="Home"
          style={styles.backRow}
        >
          <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Home
          </Text>
        </Pressable>

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          YOUR DAILY DRIVER
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          Make dreams happen.
        </Text>
        <Text style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
          One driver per project. One action per day. Work backwards from the dream.
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {active.length === 0 && paused.length === 0 ? (
          <EmptyState c={c} />
        ) : (
          <>
            {primaryDriver && (
              <>
                <Text style={[styles.sectionLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                  TODAY
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/driver/[id]",
                      params: { id: primaryDriver.id },
                    })
                  }
                  style={({ pressed }) => [
                    styles.todayCard,
                    {
                      backgroundColor: c.card,
                      borderColor: c.foreground,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.todayKind,
                      { color: c.mutedForeground, fontFamily: MONO },
                    ]}
                  >
                    {GOAL_KIND_LABELS[primaryDriver.kind].toUpperCase()} · {primaryDriver.name.toUpperCase()}
                  </Text>
                  <Text
                    style={[styles.todayAction, { color: c.foreground, fontFamily: SERIF_BOLD }]}
                  >
                    {primaryDriver.todayAction || "Open to set today's action."}
                  </Text>
                  <Text
                    style={[styles.todayOpen, { color: c.mutedForeground, fontFamily: MONO }]}
                  >
                    Open driver →
                  </Text>
                </Pressable>
              </>
            )}

            {active.length > 0 && (
              <>
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: c.mutedForeground, fontFamily: MONO, marginTop: 28 },
                  ]}
                >
                  ACTIVE DRIVERS
                </Text>
                {active.map((d) => (
                  <Pressable
                    key={d.id}
                    onPress={() =>
                      router.push({
                        pathname: "/driver/[id]",
                        params: { id: d.id },
                      })
                    }
                    style={({ pressed }) => [
                      styles.driverRow,
                      { borderColor: c.rule, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <View style={styles.driverMid}>
                      <View style={styles.driverTop}>
                        <Text
                          style={[
                            styles.kindBadge,
                            { color: c.mutedForeground, fontFamily: MONO },
                          ]}
                        >
                          {GOAL_KIND_LABELS[d.kind].toUpperCase()}
                        </Text>
                        {d.isPrimary && (
                          <Text
                            style={[
                              styles.primaryBadge,
                              { color: c.foreground, fontFamily: MONO },
                            ]}
                          >
                            PRIMARY
                          </Text>
                        )}
                      </View>
                      <Text
                        style={[styles.driverName, { color: c.foreground, fontFamily: SERIF_BOLD }]}
                      >
                        {d.name}
                      </Text>
                      <Text
                        style={[
                          styles.driverToday,
                          { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
                        ]}
                        numberOfLines={2}
                      >
                        {d.todayAction || "No today action set yet"}
                      </Text>
                    </View>
                    <Text style={[styles.chevron, { color: c.mutedForeground }]}>›</Text>
                  </Pressable>
                ))}
              </>
            )}

            {paused.length > 0 && (
              <>
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: c.mutedForeground, fontFamily: MONO, marginTop: 28 },
                  ]}
                >
                  PAUSED
                </Text>
                {paused.map((d) => (
                  <Pressable
                    key={d.id}
                    onPress={() =>
                      router.push({
                        pathname: "/driver/[id]",
                        params: { id: d.id },
                      })
                    }
                    style={({ pressed }) => [
                      styles.driverRow,
                      {
                        borderColor: c.rule,
                        opacity: pressed ? 0.7 : 0.5,
                      },
                    ]}
                  >
                    <View style={styles.driverMid}>
                      <Text
                        style={[
                          styles.kindBadge,
                          { color: c.mutedForeground, fontFamily: MONO },
                        ]}
                      >
                        {GOAL_KIND_LABELS[d.kind].toUpperCase()}
                      </Text>
                      <Text
                        style={[styles.driverName, { color: c.foreground, fontFamily: SERIF_BOLD }]}
                      >
                        {d.name}
                      </Text>
                    </View>
                    <Text style={[styles.chevron, { color: c.mutedForeground }]}>›</Text>
                  </Pressable>
                ))}
              </>
            )}
          </>
        )}

        <View style={{ height: 24 }} />

        <Pressable
          onPress={() => router.push("/driver/new")}
          style={({ pressed }) => [
            styles.newBtn,
            { borderColor: c.foreground, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.newBtnLabel, { color: c.foreground, fontFamily: MONO }]}>
            + New driver
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function EmptyState({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={[styles.emptyTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
        No drivers yet.
      </Text>
      <Text
        style={[styles.emptyBody, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}
      >
        A driver starts with a dream and works backwards to a single daily
        action. Takes about ten minutes to build. Lasts as long as the project does.
      </Text>
      <Pressable
        onPress={() => router.push("/driver/new")}
        style={({ pressed }) => [
          styles.emptyBtn,
          { backgroundColor: c.foreground, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.emptyBtnLabel, { color: c.background, fontFamily: MONO }]}>
          Build your first driver →
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 22,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  backRow: { marginBottom: 20 },
  backLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: { fontSize: 38, lineHeight: 42, letterSpacing: 0.3 },
  subtitle: { fontSize: 16, lineHeight: 24, marginTop: 6 },
  rule: { height: 1, marginVertical: 20, opacity: 0.7 },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  todayCard: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  todayKind: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  todayAction: { fontSize: 22, lineHeight: 30, letterSpacing: 0.2 },
  todayOpen: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 14,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    gap: 10,
  },
  driverMid: { flex: 1 },
  driverTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  kindBadge: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  primaryBadge: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    opacity: 0.5,
  },
  driverName: { fontSize: 17, lineHeight: 22 },
  driverToday: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  chevron: { fontSize: 22, lineHeight: 24 },
  newBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
  newBtnLabel: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  emptyWrap: { paddingTop: 8 },
  emptyTitle: { fontSize: 26, lineHeight: 32 },
  emptyBody: { fontSize: 16, lineHeight: 25, marginTop: 12 },
  emptyBtn: {
    marginTop: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
  },
  emptyBtnLabel: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});

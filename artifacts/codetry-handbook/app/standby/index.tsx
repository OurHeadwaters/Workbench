// Z0 household Standby checklist screen.
//
// The smallest runnable instance of The Standby — the constellation-wide
// primitive whose prose hook lives in Part III. Vocabulary (rung names,
// sub-shelf names, the nouns the screen leans on) is sourced from the
// bundled constellation snapshot via data/standby.ts so it cannot drift
// from what the co-op uses.

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Alert,
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
import { useHandbookContent } from "@/contexts/HandbookContentContext";
import { itemsForRungBySubShelf, type RungId, type SubShelfInfo } from "@/data/standby";
import { useStandby } from "@/lib/standby/store";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

function formatElapsed(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    const remMins = mins - hours * 60;
    return remMins > 0 ? `${hours}h ${remMins}m ago` : `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function StandbyChecklist() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const {
    ready,
    state,
    setCurrentRung,
    toggleItem,
    isChecked,
    resetRung,
    openCall,
    closeCall,
  } = useStandby();

  const {
    CHAPTERS,
    RUNGS,
    SUB_SHELVES,
    VOCAB,
    STANDBY_PRIMITIVE_NAME,
    STANDBY_PRIMITIVE_SUMMARY,
  } = useHandbookContent();

  const standbyChapterId = useMemo(() => {
    const target = STANDBY_PRIMITIVE_NAME.toLowerCase();
    const hit = CHAPTERS.find(
      (ch) => ch.partRoman === "III" && ch.title.toLowerCase().startsWith(target),
    );
    return hit?.id ?? null;
  }, [CHAPTERS, STANDBY_PRIMITIVE_NAME]);

  const onAskReset = (rungId: RungId, rungName: string) => {
    const message = `Clear the “${rungName}” checks? Items will return to unchecked.`;
    if (Platform.OS === "web") {
      const g: { window?: Window } | undefined =
        typeof globalThis !== "undefined"
          ? (globalThis as unknown as { window?: Window })
          : undefined;
      const ok = g?.window?.confirm(message) ?? true;
      if (ok) resetRung(rungId);
      return;
    }
    Alert.alert("Reset rung", message, [
      { text: "Keep", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => resetRung(rungId),
      },
    ]);
  };

  if (!ready) {
    return (
      <View
        style={[
          styles.root,
          {
            backgroundColor: c.background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text
          style={{
            color: c.mutedForeground,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
          }}
        >
          Loading…
        </Text>
      </View>
    );
  }

  const rung = state.currentRung;
  const rungInfo = RUNGS.find((r) => r.id === rung) ?? RUNGS[0];
  const checkedCount = Object.keys(state.checks[rung] ?? {}).length;
  const totalForRung = RUNGS.reduce(
    (sum, r) =>
      r.id === rung
        ? sum +
          SUB_SHELVES.reduce(
            (s, sh) => s + itemsForRungBySubShelf(rung, sh.id).length,
            0,
          )
        : sum,
    0,
  );

  const callOpen =
    !!state.callOpenedAt &&
    (!state.callClosedAt || state.callClosedAt < state.callOpenedAt);

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
          The Standby · household
        </Text>
        <View style={styles.syncSlot}>
          <SyncStatusPill />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, webBottom) + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.eyebrow,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          Z0 SALTBOX · A COMPANION TOOL
        </Text>
        <Text
          style={[
            styles.title,
            { color: c.foreground, fontFamily: SERIF_BOLD },
          ]}
        >
          {STANDBY_PRIMITIVE_NAME}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: c.foreground, fontFamily: SERIF_ITALIC },
          ]}
        >
          The household checklist — same rungs, same nouns the co-op uses.
        </Text>

        <Text
          style={[
            styles.summary,
            { color: c.mutedForeground, fontFamily: SERIF },
          ]}
        >
          {STANDBY_PRIMITIVE_SUMMARY}
        </Text>

        {standbyChapterId ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/chapter/[id]",
                params: { id: standbyChapterId },
              })
            }
            style={({ pressed }) => [
              styles.chapterLink,
              { borderColor: c.rule, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text
              style={{
                color: c.foreground,
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Read the chapter →
            </Text>
          </Pressable>
        ) : null}

        {/* Call status strip */}
        <View
          style={[
            styles.callStrip,
            { borderColor: c.rule, backgroundColor: c.card },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.callLabel,
                { color: c.mutedForeground, fontFamily: MONO },
              ]}
            >
              {callOpen ? "Call open" : "No call open"}
            </Text>
            <Text
              style={[
                styles.callMeta,
                { color: c.foreground, fontFamily: SERIF_ITALIC },
              ]}
            >
              {callOpen && state.callOpenedAt
                ? `Opened ${formatElapsed(Date.now() - state.callOpenedAt)}`
                : state.callClosedAt
                ? `Last standdown ${formatElapsed(
                    Date.now() - state.callClosedAt,
                  )}`
                : "Standby stock sits on the shelf until a call opens."}
            </Text>
          </View>
          {callOpen ? (
            <Pressable
              onPress={closeCall}
              style={({ pressed }) => [
                styles.callBtn,
                { borderColor: c.foreground, opacity: pressed ? 0.7 : 1 },
              ]}
              accessibilityLabel="Close the call — move to standdown"
            >
              <Text
                style={{
                  color: c.foreground,
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                Standdown
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={openCall}
              style={({ pressed }) => [
                styles.callBtn,
                {
                  backgroundColor: c.primary,
                  borderColor: c.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              accessibilityLabel="Open a call — move to active"
            >
              <Text
                style={{
                  color: c.primaryForeground,
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                Open a call
              </Text>
            </Pressable>
          )}
        </View>

        {/* Rung ladder */}
        <Text
          style={[
            styles.eyebrow,
            {
              color: c.mutedForeground,
              fontFamily: MONO,
              marginTop: 24,
            },
          ]}
        >
          The four-rung ladder
        </Text>
        <View style={styles.rungRow}>
          {RUNGS.map((r) => {
            const active = r.id === rung;
            return (
              <Pressable
                key={r.id}
                onPress={() => setCurrentRung(r.id)}
                style={({ pressed }) => [
                  styles.rungChip,
                  {
                    borderColor: active ? c.foreground : c.rule,
                    backgroundColor: active ? c.foreground : "transparent",
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
                accessibilityLabel={`Switch to the ${r.name} rung`}
              >
                <Text
                  style={{
                    color: active ? c.background : c.foreground,
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  {r.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text
          style={[
            styles.rungMeaning,
            { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
          ]}
        >
          {rungInfo.meaning}
        </Text>

        {/* Progress + reset */}
        <View style={styles.progressRow}>
          <Text
            style={[
              styles.progressLabel,
              { color: c.mutedForeground, fontFamily: MONO },
            ]}
          >
            {`${checkedCount}/${totalForRung} on this rung`}
          </Text>
          {checkedCount > 0 ? (
            <Pressable
              onPress={() => onAskReset(rung, rungInfo.name)}
              hitSlop={6}
              accessibilityLabel={`Reset the ${rungInfo.name} rung`}
            >
              <Text
                style={{
                  color: c.mutedForeground,
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                Reset rung
              </Text>
            </Pressable>
          ) : null}
        </View>

        {/* Sub-shelves */}
        {SUB_SHELVES.map((shelf) => (
          <SubShelfBlock
            key={shelf.id}
            shelf={shelf}
            rung={rung}
            isChecked={isChecked}
            onToggle={(itemId) => toggleItem(rung, itemId)}
          />
        ))}

        <View style={{ height: 24 }} />
        <Text
          style={[
            styles.colophon,
            { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
          ]}
        >
          Same checklist the co-op holds for {VOCAB.standbyStock || "standby stock"} —
          read at the household scale. {VOCAB.debrief ? `${VOCAB.debrief.charAt(0).toUpperCase()}${VOCAB.debrief.slice(1)}.` : ""}
        </Text>
      </ScrollView>
    </View>
  );
}

function SubShelfBlock({
  shelf,
  rung,
  isChecked,
  onToggle,
}: {
  shelf: SubShelfInfo;
  rung: RungId;
  isChecked: (rung: RungId, itemId: string) => boolean;
  onToggle: (itemId: string) => void;
}) {
  const c = useColors();
  const items = itemsForRungBySubShelf(rung, shelf.id);

  return (
    <View style={styles.shelfBlock}>
      <View style={styles.shelfHead}>
        <Text
          style={[
            styles.shelfName,
            { color: c.foreground, fontFamily: SERIF_BOLD },
          ]}
        >
          {shelf.name}
        </Text>
        <Text
          style={[
            styles.shelfRole,
            { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
          ]}
        >
          {shelf.role}
        </Text>
      </View>

      {items.length === 0 ? (
        <Text
          style={[
            styles.shelfEmpty,
            { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
          ]}
        >
          Nothing to do on this shelf at this rung.
        </Text>
      ) : (
        items.map((item) => {
          const checked = isChecked(rung, item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => onToggle(item.id)}
              style={({ pressed }) => [
                styles.itemRow,
                { borderBottomColor: c.rule, opacity: pressed ? 0.7 : 1 },
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              accessibilityLabel={item.text}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: checked ? c.foreground : c.rule,
                    backgroundColor: checked ? c.foreground : "transparent",
                  },
                ]}
              >
                {checked ? (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={c.background}
                  />
                ) : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.itemText,
                    {
                      color: c.foreground,
                      fontFamily: SERIF,
                      textDecorationLine: checked ? "line-through" : "none",
                      opacity: checked ? 0.55 : 1,
                    },
                  ]}
                >
                  {item.text}
                </Text>
                {item.detail ? (
                  <Text
                    style={[
                      styles.itemDetail,
                      {
                        color: c.mutedForeground,
                        fontFamily: SERIF_ITALIC,
                        opacity: checked ? 0.5 : 1,
                      },
                    ]}
                  >
                    {item.detail}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })
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
  scroll: { paddingHorizontal: 24, paddingTop: 24 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  summary: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  chapterLink: {
    alignSelf: "flex-start",
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
  },
  callStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
    padding: 14,
    borderWidth: 1,
    borderRadius: 4,
  },
  callLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  callMeta: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  callBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 4,
  },
  rungRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  rungChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 999,
  },
  rungMeaning: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  shelfBlock: {
    marginTop: 20,
  },
  shelfHead: {
    marginBottom: 6,
  },
  shelfName: {
    fontSize: 18,
    lineHeight: 24,
  },
  shelfRole: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  shelfEmpty: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  itemText: {
    fontSize: 15,
    lineHeight: 22,
  },
  itemDetail: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  colophon: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 16,
  },
});

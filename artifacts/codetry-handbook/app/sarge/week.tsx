/**
 * Sarge — At-a-glance week view.
 *
 * All cards for the week, grouped by priority, colour-coded by status.
 * Not-started cards are muted. Done = green. Stuck = amber.
 */

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
import { useSarge } from "@/lib/sarge/store";
import type { SargeCard, CardStatus } from "@/lib/sarge/store";

const SERIF_BOLD = "Lora_700Bold";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const MONO = "JetBrainsMono_500Medium";

const STATUS_COLORS: Record<CardStatus, { bg: string; text: string; dot: string }> = {
  done: { bg: "rgba(16,185,129,0.10)", text: "#065F46", dot: "#10B981" },
  stuck: { bg: "rgba(245,158,11,0.10)", text: "#92400E", dot: "#F59E0B" },
  active: { bg: "transparent", text: "", dot: "" },
};

const PRIORITY_COLORS = [
  "#1F3D2E",
  "#1A5FA8",
  "#7A4E2D",
  "#3B2A6E",
  "#7A2E2E",
  "#065F46",
];

function CardChip({
  card,
  priorityColor,
  c,
}: {
  card: SargeCard;
  priorityColor: string;
  c: ReturnType<typeof useColors>;
}) {
  const sc = STATUS_COLORS[card.status];
  const isActive = card.status === "active";
  const isDone = card.status === "done";
  const isStuck = card.status === "stuck";

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: isActive ? c.card : sc.bg,
          borderLeftColor: isActive ? priorityColor : sc.dot,
          opacity: isActive ? 1 : isDone ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.chipHeader}>
        {/* Status dot */}
        <View
          style={[
            styles.dot,
            {
              backgroundColor: isActive
                ? "rgba(0,0,0,0.15)"
                : isDone
                ? "#10B981"
                : "#F59E0B",
            },
          ]}
        />
        <Text
          style={[
            styles.chipAction,
            {
              color: isActive
                ? c.foreground
                : isDone
                ? sc.text
                : sc.text,
              fontFamily: isActive ? MONO : MONO,
              textDecorationLine: isDone ? "line-through" : "none",
              opacity: isActive ? 1 : isDone ? 0.8 : 1,
            },
          ]}
          numberOfLines={3}
        >
          {card.action}
        </Text>
      </View>
      {isStuck && card.barrierNote ? (
        <Text style={[styles.chipBarrier, { color: "#92400E", fontFamily: SERIF_ITALIC }]}>
          {card.barrierNote}
        </Text>
      ) : null}
    </View>
  );
}

export default function SargeWeekView() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { week, cards } = useSarge();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const priorities = (week?.priorities ?? [])
    .filter((p) => p.isActive)
    .sort((a, b) => a.order - b.order);

  const doneCount = cards.filter((c) => c.status === "done").length;
  const stuckCount = cards.filter((c) => c.status === "stuck").length;
  const activeCount = cards.filter((c) => c.status === "active").length;

  function cardsForPriority(priorityId: string): SargeCard[] {
    return cards
      .filter((c) => c.priorityId === priorityId)
      .sort((a, b) => a.order - b.order);
  }

  function priorityColor(idx: number): string {
    return PRIORITY_COLORS[idx % PRIORITY_COLORS.length] ?? PRIORITY_COLORS[0]!;
  }

  const ungrouped = cards.filter(
    (card) => !priorities.find((p) => p.id === card.priorityId),
  );

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: c.background,
          paddingTop: Math.max(insets.top, webTop) + 8,
        },
      ]}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.back, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Back
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {week?.weekOf ?? "This Week"}
        </Text>
      </View>

      {/* Summary pills */}
      <View style={styles.pills}>
        <View style={[styles.pill, { backgroundColor: "rgba(16,185,129,0.10)" }]}>
          <Text style={[styles.pillText, { color: "#065F46", fontFamily: MONO }]}>
            ✓ {doneCount} done
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: "rgba(245,158,11,0.10)" }]}>
          <Text style={[styles.pillText, { color: "#92400E", fontFamily: MONO }]}>
            ⚑ {stuckCount} stuck
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: "rgba(0,0,0,0.05)" }]}>
          <Text style={[styles.pillText, { color: c.mutedForeground, fontFamily: MONO }]}>
            ○ {activeCount} active
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 32) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              No cards for this week yet. Generate them from the desktop.
            </Text>
          </View>
        ) : (
          <>
            {priorities.map((priority, idx) => {
              const pCards = cardsForPriority(priority.id);
              if (pCards.length === 0) return null;
              const color = priorityColor(idx);
              return (
                <View key={priority.id} style={styles.group}>
                  <View style={[styles.groupHeader, { borderLeftColor: color }]}>
                    <Text
                      style={[styles.groupLabel, { color, fontFamily: MONO }]}
                      numberOfLines={2}
                    >
                      {priority.label.split("(")[0]?.trim() ?? priority.label}
                    </Text>
                    <Text style={[styles.groupCount, { color, fontFamily: MONO }]}>
                      {pCards.filter((c) => c.status === "done").length}/{pCards.length}
                    </Text>
                  </View>
                  {pCards.map((card) => (
                    <CardChip
                      key={card.id}
                      card={card}
                      priorityColor={color}
                      c={c}
                    />
                  ))}
                </View>
              );
            })}

            {/* Ungrouped */}
            {ungrouped.length > 0 && (
              <View style={styles.group}>
                <View style={[styles.groupHeader, { borderLeftColor: c.mutedForeground }]}>
                  <Text style={[styles.groupLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                    Other
                  </Text>
                </View>
                {ungrouped.map((card) => (
                  <CardChip
                    key={card.id}
                    card={card}
                    priorityColor={c.mutedForeground}
                    c={c}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  back: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
  },
  pills: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  pillText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 24,
  },
  group: {
    gap: 8,
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 4,
    gap: 8,
  },
  groupLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    flex: 1,
  },
  groupCount: {
    fontSize: 10,
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  chip: {
    borderLeftWidth: 3,
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chipHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
    flexShrink: 0,
  },
  chipAction: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
    letterSpacing: 0.2,
  },
  chipBarrier: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    marginLeft: 14,
    fontStyle: "italic",
  },
  emptyState: {
    paddingTop: 40,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
  },
});

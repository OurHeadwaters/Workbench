import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStack } from "@/contexts/StackContext";
import { STACK_CARDS } from "@/data/stackCards";
import { useColors } from "@/hooks/useColors";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

function getCard(id: string) {
  return STACK_CARDS.find((c) => c.id === id);
}

export default function StackHome() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { ready, activeCards, doneCards, flaggedCards, skipCard, resetAll, cardStates } = useStack();
  const [confirmReset, setConfirmReset] = useState(false);
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  if (!ready) {
    return <View style={[styles.root, { backgroundColor: c.background }]} />;
  }

  const topId = activeCards[0] ?? null;
  const peekIds = activeCards.slice(1, 4);
  const topCard = topId ? getCard(topId) : null;
  const flaggedCount = flaggedCards.length;

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
          PRACTICE CARDS
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          Test what has landed.
        </Text>
        <Text style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
          One card at a time. Each card asks whether a concept from the handbook
          has been understood — not just read.
        </Text>

        {flaggedCount > 0 && (
          <View style={[styles.flaggedBanner, { backgroundColor: c.card, borderColor: c.rule }]}>
            <Text style={[styles.flaggedBannerText, { color: c.mutedForeground, fontFamily: MONO }]}>
              ⚑ {flaggedCount} {flaggedCount === 1 ? "card" : "cards"} flagged for revisit
            </Text>
          </View>
        )}

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {activeCards.length === 0 ? (
          <AllDoneState c={c} doneCount={doneCards.length} />
        ) : (
          <>
            <Text style={[styles.sectionLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              CURRENT DECK · {activeCards.length} remaining
            </Text>

            {/* Fanned deck */}
            <View style={styles.deckWrap}>
              {/* Peek cards rendered back-to-front */}
              {[...peekIds].reverse().map((peekId, ri) => {
                const depth = peekIds.length - ri;
                const card = getCard(peekId);
                return (
                  <View
                    key={peekId}
                    style={[
                      styles.peekCard,
                      {
                        backgroundColor: c.card,
                        borderColor: c.rule,
                        top: depth * 8,
                        left: depth * 4,
                        right: -depth * 4,
                        zIndex: depth,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.peekCategory,
                        { color: c.mutedForeground, fontFamily: MONO },
                      ]}
                      numberOfLines={1}
                    >
                      {card?.category?.toUpperCase() ?? ""}
                    </Text>
                  </View>
                );
              })}

              {/* Top card */}
              {topCard && topId && (
                <View
                  style={[
                    styles.topCard,
                    {
                      backgroundColor: c.background,
                      borderColor: c.foreground,
                      zIndex: 10,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.topCategory,
                      { color: c.mutedForeground, fontFamily: MONO },
                    ]}
                  >
                    {topCard.category.toUpperCase()}
                    {cardStates[topId]?.status === "flagged" ? "  ·  ⚑ REVISIT" : ""}
                  </Text>
                  <Text
                    style={[
                      styles.topQuestion,
                      { color: c.foreground, fontFamily: SERIF_BOLD },
                    ]}
                  >
                    {topCard.question}
                  </Text>
                  <Text
                    style={[
                      styles.topContext,
                      { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
                    ]}
                    numberOfLines={3}
                  >
                    {topCard.context}
                  </Text>

                  <View style={styles.cardActions}>
                    <Pressable
                      onPress={() => skipCard(topId)}
                      style={({ pressed }) => [
                        styles.skipBtn,
                        { borderColor: c.rule, opacity: pressed ? 0.6 : 1 },
                      ]}
                      accessibilityLabel="Skip for now"
                    >
                      <Text
                        style={[
                          styles.skipLabel,
                          { color: c.mutedForeground, fontFamily: MONO },
                        ]}
                      >
                        Skip for now
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: "/stack/[id]",
                          params: { id: topId },
                        })
                      }
                      style={({ pressed }) => [
                        styles.workBtn,
                        {
                          backgroundColor: c.primary,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                      accessibilityLabel="Work on this card"
                    >
                      <Text
                        style={[
                          styles.workLabel,
                          { color: c.primaryForeground, fontFamily: MONO },
                        ]}
                      >
                        Work on this →
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            {/* Remaining active cards list */}
            {activeCards.length > 1 && (
              <>
                <View style={{ height: 28 }} />
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: c.mutedForeground, fontFamily: MONO },
                  ]}
                >
                  ALL CARDS
                </Text>
                {activeCards.map((id) => {
                  const card = getCard(id);
                  if (!card) return null;
                  const isFlagged = cardStates[id]?.status === "flagged";
                  return (
                    <Pressable
                      key={id}
                      onPress={() =>
                        router.push({
                          pathname: "/stack/[id]",
                          params: { id },
                        })
                      }
                      style={({ pressed }) => [
                        styles.listRow,
                        { borderColor: c.rule, opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.listCategory,
                            { color: c.mutedForeground, fontFamily: MONO },
                          ]}
                        >
                          {card.category.toUpperCase()}
                          {isFlagged ? "  ·  ⚑ REVISIT" : ""}
                        </Text>
                        <Text
                          style={[
                            styles.listQuestion,
                            { color: c.foreground, fontFamily: SERIF_BOLD },
                          ]}
                          numberOfLines={2}
                        >
                          {card.question}
                        </Text>
                      </View>
                      <Text
                        style={[styles.listChevron, { color: c.mutedForeground }]}
                      >
                        ›
                      </Text>
                    </Pressable>
                  );
                })}
              </>
            )}
          </>
        )}

        {/* Done pile */}
        {doneCards.length > 0 && (
          <>
            <View style={{ height: 32 }} />
            <Text
              style={[
                styles.sectionLabel,
                { color: c.mutedForeground, fontFamily: MONO },
              ]}
            >
              DONE · {doneCards.length}
            </Text>
            {doneCards.map((id) => {
              const card = getCard(id);
              if (!card) return null;
              return (
                <Pressable
                  key={id}
                  onPress={() =>
                    router.push({
                      pathname: "/stack/[id]",
                      params: { id },
                    })
                  }
                  style={({ pressed }) => [
                    styles.listRow,
                    {
                      borderColor: c.rule,
                      opacity: pressed ? 0.5 : 0.5,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.listCategory,
                        { color: c.mutedForeground, fontFamily: MONO },
                      ]}
                    >
                      {card.category.toUpperCase()} · DONE ✓
                    </Text>
                    <Text
                      style={[
                        styles.listQuestion,
                        {
                          color: c.mutedForeground,
                          fontFamily: SERIF,
                          textDecorationLine: "line-through",
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {card.question}
                    </Text>
                  </View>
                  <Text
                    style={[styles.listChevron, { color: c.mutedForeground }]}
                  >
                    ›
                  </Text>
                </Pressable>
              );
            })}

            {/* Reset deck */}
            <View style={{ height: 20 }} />
            {confirmReset ? (
              <View style={[styles.confirmBox, { borderColor: c.rule }]}>
                <Text style={[styles.confirmText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                  This will clear all done marks and saved answers. Start fresh?
                </Text>
                <View style={styles.confirmActions}>
                  <Pressable
                    onPress={() => setConfirmReset(false)}
                    style={({ pressed }) => [
                      styles.confirmCancel,
                      { borderColor: c.rule, opacity: pressed ? 0.6 : 1 },
                    ]}
                    accessibilityLabel="Cancel reset"
                  >
                    <Text style={[styles.confirmCancelLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setConfirmReset(false);
                      resetAll();
                    }}
                    style={({ pressed }) => [
                      styles.confirmOk,
                      { borderColor: c.rule, opacity: pressed ? 0.6 : 1 },
                    ]}
                    accessibilityLabel="Confirm reset deck"
                  >
                    <Text style={[styles.confirmOkLabel, { color: c.foreground, fontFamily: MONO }]}>
                      Yes, reset
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setConfirmReset(true)}
                style={({ pressed }) => [
                  styles.resetBtn,
                  { borderColor: c.rule, opacity: pressed ? 0.6 : 1 },
                ]}
                accessibilityLabel="Reset deck"
              >
                <Text style={[styles.resetLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                  Reset deck
                </Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function AllDoneState({ c, doneCount }: { c: ReturnType<typeof useColors>; doneCount: number }) {
  return (
    <View style={styles.allDoneWrap}>
      <Text style={[styles.allDoneTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
        All {doneCount} cards done.
      </Text>
      <Text style={[styles.allDoneBody, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
        You've worked through the whole stack. The answers are saved in each
        card — tap any done card to review.
      </Text>
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
  flaggedBanner: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 4,
    borderWidth: 1,
  },
  flaggedBannerText: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  rule: { height: 1, marginVertical: 20, opacity: 0.7 },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  deckWrap: {
    position: "relative",
    marginBottom: 12,
    paddingBottom: 0,
  },

  peekCard: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    height: 64,
    justifyContent: "flex-end",
  },
  peekCategory: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },

  topCard: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginTop: 32,
  },
  topCategory: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  topQuestion: {
    fontSize: 20,
    lineHeight: 27,
    letterSpacing: 0.1,
    marginBottom: 10,
  },
  topContext: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
  },
  skipBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
  skipLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  workBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  workLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    gap: 10,
  },
  listCategory: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  listQuestion: { fontSize: 15, lineHeight: 20 },
  listChevron: { fontSize: 22, lineHeight: 24 },

  allDoneWrap: { paddingTop: 8 },
  allDoneTitle: { fontSize: 26, lineHeight: 32 },
  allDoneBody: { fontSize: 16, lineHeight: 25, marginTop: 12 },

  resetBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 4,
  },
  resetLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  confirmBox: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    gap: 14,
  },
  confirmText: {
    fontSize: 15,
    lineHeight: 22,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 10,
  },
  confirmCancel: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
  confirmCancelLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  confirmOk: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
  confirmOkLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});

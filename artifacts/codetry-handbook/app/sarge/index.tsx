/**
 * Sarge — Mobile card stack.
 *
 * One card at a time. Done / I'm stuck. No doom lists.
 * Progress bar at top. Swipe down to see the full week.
 * Resumes exactly where Bobbie left off.
 */

import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useSarge } from "@/lib/sarge/store";
import type { SargeCard } from "@/lib/sarge/store";

const SERIF = "Lora_400Regular";
const SERIF_BOLD = "Lora_700Bold";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const MONO = "JetBrainsMono_500Medium";

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total }: { done: number; total: number }) {
  const c = useColors();
  const pct = total > 0 ? done / total : 0;
  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: `${Math.round(pct * 100)}%`,
            backgroundColor: "#0F766E",
          },
        ]}
      />
      <Text style={[styles.progressLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
        {done}/{total}
      </Text>
    </View>
  );
}

// ─── Card stack visuals (background stacked cards) ───────────────────────────

function StackedBacking({ color }: { color: string }) {
  return (
    <>
      <View style={[styles.backing2, { backgroundColor: color, opacity: 0.2 }]} />
      <View style={[styles.backing1, { backgroundColor: color, opacity: 0.35 }]} />
    </>
  );
}

// ─── Barrier modal ────────────────────────────────────────────────────────────

function BarrierModal({
  card,
  visible,
  onClose,
  onSubmit,
}: {
  card: SargeCard | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}) {
  const c = useColors();
  const [note, setNote] = useState("");
  const insets = useSafeAreaInsets();

  function handleSubmit() {
    onSubmit(note.trim());
    setNote("");
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={[
            styles.modalSheet,
            {
              backgroundColor: c.card,
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
            What's in the way?
          </Text>
          <Text style={[styles.modalSub, { color: c.mutedForeground, fontFamily: MONO }]}>
            {card?.action ?? ""}
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Brief note (optional)…"
            placeholderTextColor={c.mutedForeground}
            style={[
              styles.barrierInput,
              {
                color: c.foreground,
                backgroundColor: c.background,
                borderColor: c.border,
                fontFamily: SERIF,
              },
            ]}
            autoFocus
            multiline
            maxLength={300}
          />
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalBtn, styles.modalBtnSecondary, { borderColor: c.border }]}
              onPress={onClose}
            >
              <Text style={[styles.modalBtnText, { color: c.mutedForeground, fontFamily: MONO }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: "#92400E" }]}
              onPress={handleSubmit}
            >
              <Text style={[styles.modalBtnText, { color: "#FFFBEB", fontFamily: MONO }]}>
                Log & continue →
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

// ─── Week update banner ───────────────────────────────────────────────────────

function WeekUpdateBanner({ onApply, onDismiss }: { onApply: () => void; onDismiss: () => void }) {
  const c = useColors();
  return (
    <View style={[styles.updateBanner, { backgroundColor: "#065F46", borderColor: "#047857" }]}>
      <Text style={[styles.updateText, { fontFamily: MONO }]}>
        Your week was updated
      </Text>
      <Pressable onPress={onApply} style={styles.updateBtn}>
        <Text style={[styles.updateBtnText, { fontFamily: MONO }]}>
          Tap to refresh
        </Text>
      </Pressable>
      <Pressable onPress={onDismiss} hitSlop={12}>
        <Text style={{ color: "#A7F3D0", fontSize: 14, fontFamily: MONO }}>✕</Text>
      </Pressable>
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.emptyRoot}>
      <Text style={[styles.emptyTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
        No cards yet
      </Text>
      <Text style={[styles.emptyBody, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
        Open the desktop morning session, set your priorities, generate the week, and lock it.
        Sarge will pick it up here.
      </Text>
    </View>
  );
}

// ─── All-done state ───────────────────────────────────────────────────────────

function AllDoneState({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.emptyRoot}>
      <Text style={[styles.emptyTitle, { color: "#0F766E", fontFamily: SERIF_BOLD }]}>
        Week complete.
      </Text>
      <Text style={[styles.emptyBody, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
        Every card is done or flagged. Come back Monday for a new week.
      </Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function SargeCardStack() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const {
    ready,
    syncing,
    week,
    cards,
    activeCardIndex,
    weekUpdateAvailable,
    dismissWeekUpdate,
    applyWeekUpdate,
    markDone,
    markStuck,
    setActiveCardIndex,
    refresh,
  } = useSarge();

  const [barrierVisible, setBarrierVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Slide-out animation
  const slideAnim = useRef(new Animated.Value(0)).current;

  const webTop = Platform.OS === "web" ? 67 : 0;

  // ─── Focus label (from week priorities, if loaded from a What's Next focus) ──

  const focusLabel: string | null =
    week?.priorities && week.priorities.length === 1
      ? (week.priorities[0]?.label ?? null)
      : null;

  // ─── Derived card state ────────────────────────────────────────────────

  const activeCards = cards.filter((c) => c.status === "active");
  const doneCount = cards.filter((c) => c.status === "done").length;
  const stuckCount = cards.filter((c) => c.status === "stuck").length;

  // Find current card: clamp to available active cards
  const currentCard: SargeCard | undefined =
    activeCards.length > 0 ? activeCards[0] : undefined;

  const hasCards = cards.length > 0;
  const allFinished = hasCards && activeCards.length === 0;

  // ─── Pull to refresh ────────────────────────────────────────────────────

  async function handleRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  // ─── Animate card away, then mark done ─────────────────────────────────

  function animateAndMarkDone(card: SargeCard) {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(0);
      void markDone(card.id);
    });
  }

  function animateAndMarkStuck(card: SargeCard, note: string) {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(slideAnim, {
      toValue: -1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(0);
      void markStuck(card.id, note);
    });
  }

  // ─── Card priority colour ───────────────────────────────────────────────

  const PRIORITY_COLORS = [
    "#1F3D2E", // ink
    "#1A5FA8", // blue
    "#7A4E2D", // warm brown
    "#3B2A6E", // deep violet
    "#7A2E2E", // deep red
    "#065F46", // teal
  ];

  function priorityColor(priorityId: string): string {
    const priorities = week?.priorities ?? [];
    const idx = priorities.findIndex((p) => p.id === priorityId);
    return PRIORITY_COLORS[idx % PRIORITY_COLORS.length] ?? PRIORITY_COLORS[0]!;
  }

  // ─── Loading ────────────────────────────────────────────────────────────

  if (!ready) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <ActivityIndicator style={{ flex: 1 }} color={c.mutedForeground} />
      </View>
    );
  }

  // ─── Translate for animation ────────────────────────────────────────────

  const cardTranslate = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-400, 0, 400],
  });
  const cardOpacity = slideAnim.interpolate({
    inputRange: [-1, -0.5, 0, 0.5, 1],
    outputRange: [0, 0.3, 1, 0.3, 0],
  });

  const color = currentCard ? priorityColor(currentCard.priorityId) : c.primary;

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: c.background,
          paddingTop: Math.max(insets.top, webTop) + 8,
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Text style={[styles.backText, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Home
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/sarge/week" as never)}
          hitSlop={12}
        >
          <Text style={[styles.weekBtn, { color: c.mutedForeground, fontFamily: MONO }]}>
            Week ↓
          </Text>
        </Pressable>
      </View>

      {/* Week update banner */}
      {weekUpdateAvailable && (
        <WeekUpdateBanner onApply={applyWeekUpdate} onDismiss={dismissWeekUpdate} />
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void handleRefresh()}
            tintColor={c.mutedForeground}
          />
        }
        scrollEnabled={false}
      >
        {/* Progress bar */}
        {hasCards && (
          <ProgressBar done={doneCount} total={cards.length} />
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
            SARGE
          </Text>
          <Text style={[styles.weekLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
            {week?.weekOf ?? ""}
          </Text>
        </View>

        {/* Focus label — shown when week was loaded from a What's Next focus */}
        {focusLabel && hasCards && (
          <View style={[styles.focusBanner, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.focusEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
              THIS WEEK'S FOCUS
            </Text>
            <Text style={[styles.focusTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
              {focusLabel}
            </Text>
          </View>
        )}

        {/* States */}
        {!hasCards && <EmptyState c={c} />}
        {allFinished && <AllDoneState c={c} />}

        {/* Card */}
        {currentCard && !allFinished && (
          <View style={styles.cardArea}>
            <StackedBacking color={color} />
            <Animated.View
              style={[
                styles.card,
                {
                  backgroundColor: c.card,
                  borderLeftColor: color,
                  transform: [{ translateX: cardTranslate }],
                  opacity: cardOpacity,
                },
              ]}
            >
              {/* Priority label */}
              <Text style={[styles.priorityTag, { color, fontFamily: MONO }]}>
                {currentCard.priorityLabel.split("(")[0]?.trim() ?? currentCard.priorityLabel}
              </Text>

              {/* Action */}
              <Text style={[styles.cardAction, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                {currentCard.action}
              </Text>

              {/* Context */}
              {currentCard.context ? (
                <Text style={[styles.cardContext, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                  {currentCard.context}
                </Text>
              ) : null}

              {/* Remaining */}
              {activeCards.length > 1 && (
                <Text style={[styles.remaining, { color: c.mutedForeground, fontFamily: MONO }]}>
                  {activeCards.length - 1} more active
                </Text>
              )}
            </Animated.View>

            {/* Buttons */}
            <View style={styles.buttons}>
              <Pressable
                style={({ pressed }) => [
                  styles.btn,
                  styles.btnStuck,
                  { opacity: pressed ? 0.7 : 1, borderColor: "#92400E" },
                ]}
                onPress={() => setBarrierVisible(true)}
                testID="sarge-stuck-btn"
              >
                <Text style={[styles.btnText, { color: "#92400E", fontFamily: MONO }]}>
                  I'm stuck
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.btn,
                  styles.btnDone,
                  { opacity: pressed ? 0.8 : 1, backgroundColor: "#0F766E" },
                ]}
                onPress={() => animateAndMarkDone(currentCard)}
                testID="sarge-done-btn"
              >
                <Text style={[styles.btnText, { color: "#ECFDF5", fontFamily: MONO }]}>
                  Done ✓
                </Text>
              </Pressable>
            </View>

            {/* Stuck count */}
            {stuckCount > 0 && (
              <Pressable
                onPress={() => router.push("/sarge/week" as never)}
                style={styles.stuckPill}
              >
                <Text style={[styles.stuckPillText, { fontFamily: MONO }]}>
                  {stuckCount} stuck — see week ↓
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      {/* Barrier modal */}
      <BarrierModal
        card={currentCard ?? null}
        visible={barrierVisible}
        onClose={() => setBarrierVisible(false)}
        onSubmit={(note) => {
          if (currentCard) animateAndMarkStuck(currentCard, note);
        }}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: {},
  backText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  weekBtn: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  progressTrack: {
    height: 5,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 3,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
    position: "absolute",
    right: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
  },
  weekLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  cardArea: {
    flex: 1,
    minHeight: 360,
  },
  backing2: {
    position: "absolute",
    left: 8,
    right: -8,
    top: 8,
    bottom: -8,
    borderRadius: 20,
  },
  backing1: {
    position: "absolute",
    left: 4,
    right: -4,
    top: 4,
    bottom: -4,
    borderRadius: 20,
  },
  card: {
    borderRadius: 20,
    borderLeftWidth: 5,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    minHeight: 280,
  },
  priorityTag: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  cardAction: {
    fontSize: 22,
    lineHeight: 30,
    marginBottom: 16,
  },
  cardContext: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 24,
  },
  remaining: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: "auto",
    paddingTop: 12,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  btn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnStuck: {
    borderWidth: 1.5,
  },
  btnDone: {},
  btnText: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
  stuckPill: {
    alignSelf: "center",
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: "rgba(146,64,14,0.08)",
  },
  stuckPillText: {
    fontSize: 11,
    color: "#92400E",
    letterSpacing: 0.5,
  },
  emptyRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
  },
  emptyBody: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
  },
  // Focus banner
  focusBanner: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  focusEyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
    opacity: 0.6,
  },
  focusTitle: {
    fontSize: 17,
    lineHeight: 23,
  },
  // Barrier modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingTop: 24,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 18,
    opacity: 0.7,
  },
  barrierInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 80,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnSecondary: {
    borderWidth: 1,
  },
  modalBtnPrimary: {},
  modalBtnText: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  // Week update banner
  updateBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  updateText: {
    flex: 1,
    fontSize: 12,
    color: "#A7F3D0",
    letterSpacing: 0.3,
  },
  updateBtn: {
    backgroundColor: "#047857",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  updateBtnText: {
    fontSize: 11,
    color: "#ECFDF5",
    letterSpacing: 0.3,
  },
});

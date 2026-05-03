import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStack } from "@/contexts/StackContext";
import { STACK_CARDS } from "@/data/stackCards";
import { useColors } from "@/hooks/useColors";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function StackCardDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { cardStates, completeCard, setStepAnswer, getStepAnswer } = useStack();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const card = STACK_CARDS.find((c) => c.id === id);
  const cardState = cardStates[id];
  const isDone = cardState?.status === "done";

  const [currentStep, setCurrentStep] = useState(0);
  const [doneAnim] = useState(() => new Animated.Value(isDone ? 1 : 0));
  const [showDone, setShowDone] = useState(isDone);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isDone) {
      doneAnim.setValue(1);
      setShowDone(true);
    }
  }, [isDone, doneAnim]);

  const handleMarkDone = useCallback(() => {
    completeCard(id);
    Animated.spring(doneAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
    setShowDone(true);
    setTimeout(() => {
      router.replace("/stack");
    }, 900);
  }, [id, completeCard, doneAnim]);

  if (!card) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <View
          style={[
            styles.scroll,
            {
              paddingTop: Math.max(insets.top, webTop) + 48,
              alignItems: "flex-start",
            },
          ]}
        >
          <Text
            style={[styles.errorText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
          >
            Card not found.
          </Text>
          <Pressable onPress={() => router.replace("/stack")} style={{ marginTop: 16 }}>
            <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
              ← The Stack
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const totalSteps = card.steps.length;
  const answeredCount = card.steps.filter(
    (s) => (getStepAnswer(id, s.id) ?? "").trim().length > 0,
  ).length;
  const allAnswered = answeredCount === totalSteps;

  const doneScale = doneAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.05, 1],
  });

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 24,
            paddingBottom: Math.max(insets.bottom, webBottom) + 48,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => router.replace("/stack")}
          accessibilityLabel="Back to Stack"
          style={styles.backRow}
        >
          <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← The Stack
          </Text>
        </Pressable>

        {/* Card header */}
        <Text style={[styles.category, { color: c.mutedForeground, fontFamily: MONO }]}>
          {card.category.toUpperCase()}
          {isDone ? "  ·  DONE ✓" : ""}
        </Text>
        <Text style={[styles.question, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {card.question}
        </Text>
        <View style={[styles.rule, { backgroundColor: c.rule }]} />
        <Text style={[styles.context, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          {card.context}
        </Text>

        <View style={{ height: 28 }} />

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
            {answeredCount}/{totalSteps} steps answered
          </Text>
          <View style={[styles.progressBar, { backgroundColor: c.rule }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: c.foreground,
                  width: `${(answeredCount / totalSteps) * 100}%` as `${number}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={{ height: 20 }} />

        {/* Steps */}
        {card.steps.map((step, i) => {
          const answer = getStepAnswer(id, step.id);
          const isCurrent = i === currentStep && !isDone;
          const hasAnswer = answer.trim().length > 0;

          return (
            <Pressable
              key={step.id}
              onPress={() => setCurrentStep(i)}
              style={[
                styles.stepCard,
                {
                  borderColor: isCurrent ? c.foreground : c.rule,
                  backgroundColor: isCurrent ? c.card : "transparent",
                },
              ]}
            >
              <View style={styles.stepHeader}>
                <View
                  style={[
                    styles.stepNumber,
                    {
                      backgroundColor: hasAnswer ? c.foreground : "transparent",
                      borderColor: hasAnswer ? c.foreground : c.rule,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumText,
                      {
                        color: hasAnswer ? c.background : c.mutedForeground,
                        fontFamily: MONO,
                      },
                    ]}
                  >
                    {hasAnswer ? "✓" : String(i + 1)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepPrompt,
                    {
                      color: c.foreground,
                      fontFamily: SERIF,
                      flex: 1,
                    },
                  ]}
                >
                  {step.prompt}
                </Text>
              </View>

              {isCurrent && (
                <TextInput
                  value={answer}
                  onChangeText={(text) => setStepAnswer(id, step.id, text)}
                  placeholder="Your answer…"
                  placeholderTextColor={c.mutedForeground}
                  multiline
                  numberOfLines={4}
                  style={[
                    styles.stepInput,
                    {
                      color: c.foreground,
                      borderColor: c.rule,
                      backgroundColor: c.background,
                      fontFamily: SERIF,
                    },
                  ]}
                  autoFocus={isCurrent}
                />
              )}

              {!isCurrent && hasAnswer && (
                <Text
                  style={[
                    styles.stepAnswerPreview,
                    { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
                  ]}
                  numberOfLines={2}
                >
                  {answer}
                </Text>
              )}

              {isCurrent && i < totalSteps - 1 && (
                <Pressable
                  onPress={() => {
                    setCurrentStep(i + 1);
                    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 100);
                  }}
                  style={({ pressed }) => [
                    styles.nextStepBtn,
                    { borderColor: c.rule, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.nextStepLabel,
                      { color: c.mutedForeground, fontFamily: MONO },
                    ]}
                  >
                    Next step →
                  </Text>
                </Pressable>
              )}
            </Pressable>
          );
        })}

        <View style={{ height: 28 }} />

        {/* Done button */}
        {!isDone ? (
          <Animated.View style={{ transform: [{ scale: doneScale }] }}>
            <Pressable
              onPress={allAnswered ? handleMarkDone : undefined}
              style={({ pressed }) => [
                styles.doneBtn,
                {
                  backgroundColor: allAnswered ? c.foreground : c.rule,
                  opacity: pressed && allAnswered ? 0.85 : 1,
                },
              ]}
              accessibilityLabel={
                allAnswered ? "Mark card done" : "Answer all steps to mark done"
              }
            >
              <Text
                style={[
                  styles.doneBtnLabel,
                  {
                    color: allAnswered ? c.background : c.mutedForeground,
                    fontFamily: MONO,
                  },
                ]}
              >
                {allAnswered
                  ? "Done — mark it complete ✓"
                  : `Answer all ${totalSteps} steps to complete`}
              </Text>
            </Pressable>
          </Animated.View>
        ) : (
          <View
            style={[
              styles.doneBtn,
              { backgroundColor: c.foreground },
            ]}
          >
            <Text
              style={[
                styles.doneBtnLabel,
                { color: c.background, fontFamily: MONO },
              ]}
            >
              Completed ✓
            </Text>
          </View>
        )}

        {showDone && (
          <Text
            style={[
              styles.doneMessage,
              { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
            ]}
          >
            Nice work. Returning to the deck…
          </Text>
        )}
      </ScrollView>
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
  errorText: { fontSize: 18 },
  category: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  question: { fontSize: 24, lineHeight: 31, letterSpacing: 0.1 },
  rule: { height: 1, marginVertical: 16, opacity: 0.6 },
  context: { fontSize: 15, lineHeight: 23 },
  progressRow: { gap: 8 },
  progressLabel: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  stepCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  stepPrompt: { fontSize: 15, lineHeight: 22 },
  stepInput: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 96,
    textAlignVertical: "top",
  },
  stepAnswerPreview: {
    fontSize: 13,
    lineHeight: 19,
    marginLeft: 36,
  },
  nextStepBtn: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 4,
  },
  nextStepLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  doneBtn: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
  },
  doneBtnLabel: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  doneMessage: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 16,
  },
});

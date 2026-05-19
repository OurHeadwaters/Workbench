// Daily Driver wizard — adaptive goal-to-action builder.
//
// One question per screen. Full-screen, serif-first, progress at top.
// Kind is selected first; that choice determines the middle questions.
// Final screen shows a summary before creating the driver.

import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useDailyDriver } from "@/lib/dailyDriver/store";
import {
  UNIVERSAL_STEPS_BEFORE,
  WIZARD_DEFAULTS,
  buildDriverFromAnswers,
  buildWizardSteps,
  type GoalKind,
  type WizardAnswers,
  type WizardStep,
  GOAL_KIND_LABELS,
  HORIZON_LABELS,
} from "@/data/dailyDriver";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function NewDriver() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { addDriver } = useDailyDriver();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const [answers, setAnswers] = useState<WizardAnswers>(WIZARD_DEFAULTS);
  const [steps, setSteps] = useState<WizardStep[]>(UNIVERSAL_STEPS_BEFORE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  // Slide animation
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    slideAnim.setValue(32);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const currentStep = steps[currentIndex];
  const isLastStep = currentIndex === steps.length - 1;

  const advance = useCallback(
    (valueOverride?: string) => {
      const value = valueOverride ?? draft.trim();
      if (!value && currentStep?.kind !== "choice") return;

      // Save answer
      const updatedAnswers = { ...answers, [currentStep.field]: value };
      setAnswers(updatedAnswers);

      // If this was the kind step, expand the full step list
      if (currentStep.field === "kind") {
        const fullSteps = buildWizardSteps(value as GoalKind);
        setSteps(fullSteps);
      }

      setDraft("");

      if (isLastStep) {
        setShowSummary(true);
      } else {
        setCurrentIndex((i) => i + 1);
        animateIn();
      }
    },
    [answers, currentStep, draft, isLastStep, animateIn],
  );

  const goBack = useCallback(() => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (currentIndex === 0) {
      router.back();
      return;
    }
    setCurrentIndex((i) => i - 1);
    // Restore draft from previous answer
    const prevStep = steps[currentIndex - 1];
    setDraft(answers[prevStep.field] ?? "");
    animateIn();
  }, [showSummary, currentIndex, steps, answers, animateIn]);

  const confirm = useCallback(() => {
    const driver = buildDriverFromAnswers(answers);
    addDriver(driver);
    router.replace({
      pathname: "/driver/[id]",
      params: { id: driver.id },
    });
  }, [answers, addDriver]);

  const pt = Math.max(insets.top, webTop) + 16;
  const pb = Math.max(insets.bottom, webBottom) + 24;

  if (showSummary) {
    return (
      <Summary
        answers={answers}
        c={c}
        pt={pt}
        pb={pb}
        onBack={goBack}
        onConfirm={confirm}
      />
    );
  }

  if (!currentStep) return null;

  const progress = currentIndex + 1;
  const total = steps.length;
  const canContinue = currentStep.kind === "choice" || draft.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: c.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.topBar, { paddingTop: pt, paddingHorizontal: 22 }]}>
        <Pressable onPress={goBack} hitSlop={8}>
          <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Back
          </Text>
        </Pressable>
        <Text style={[styles.progressLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
          {progress} / {total}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: c.rule }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: c.foreground,
              width: `${(progress / total) * 100}%` as `${number}%`,
            },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: pb + 80 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }], opacity: slideAnim.interpolate({
            inputRange: [0, 32],
            outputRange: [1, 0],
          }) }}
        >
          <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
            {currentStep.eyebrow}
          </Text>
          <Text style={[styles.question, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
            {currentStep.question}
          </Text>
          {currentStep.hint ? (
            <Text style={[styles.hint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              {currentStep.hint}
            </Text>
          ) : null}

          <View style={[styles.rule, { backgroundColor: c.rule }]} />

          {currentStep.kind === "choice" && currentStep.choices ? (
            <ChoiceInput
              choices={currentStep.choices}
              selected={answers[currentStep.field] as string}
              c={c}
              onSelect={(v) => advance(v)}
            />
          ) : (
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={currentStep.placeholder}
              placeholderTextColor={c.mutedForeground}
              style={[
                currentStep.kind === "text-lg" ? styles.inputLg : styles.inputSm,
                {
                  color: c.foreground,
                  borderColor: c.rule,
                  backgroundColor: c.card,
                  fontFamily: SERIF,
                },
              ]}
              multiline
              numberOfLines={currentStep.kind === "text-lg" ? 5 : 3}
              autoFocus
              returnKeyType="done"
            />
          )}
        </Animated.View>
      </ScrollView>

      {currentStep.kind !== "choice" && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: pb,
              paddingHorizontal: 22,
              borderTopColor: c.rule,
              backgroundColor: c.background,
            },
          ]}
        >
          <Pressable
            onPress={() => advance()}
            disabled={!canContinue}
            style={({ pressed }) => [
              styles.continueBtn,
              {
                backgroundColor: canContinue ? c.foreground : c.rule,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.continueBtnLabel,
                { color: canContinue ? c.background : c.mutedForeground, fontFamily: MONO },
              ]}
            >
              {isLastStep ? "Review →" : "Continue →"}
            </Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function ChoiceInput({
  choices,
  selected,
  c,
  onSelect,
}: {
  choices: { value: string; label: string; description: string }[];
  selected: string;
  c: ReturnType<typeof useColors>;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={styles.choicesWrap}>
      {choices.map((ch) => {
        const isActive = ch.value === selected;
        return (
          <Pressable
            key={ch.value}
            onPress={() => onSelect(ch.value)}
            style={({ pressed }) => [
              styles.choiceCard,
              {
                borderColor: isActive ? c.foreground : c.rule,
                backgroundColor: isActive ? c.card : "transparent",
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.choiceLabel,
                { color: c.foreground, fontFamily: isActive ? SERIF_BOLD : SERIF },
              ]}
            >
              {ch.label}
            </Text>
            <Text
              style={[styles.choiceDesc, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}
            >
              {ch.description}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Summary({
  answers,
  c,
  pt,
  pb,
  onBack,
  onConfirm,
}: {
  answers: WizardAnswers;
  c: ReturnType<typeof useColors>;
  pt: number;
  pb: number;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const nodes = [
    { horizon: "done" as const,  text: answers.doneState },
    { horizon: "3mo" as const,   text: answers.threeMonths },
    { horizon: "1mo" as const,   text: answers.oneMonth },
    { horizon: "2wk" as const,   text: answers.twoWeeks },
    { horizon: "today" as const, text: answers.todayAction },
  ].filter((n) => n.text.trim().length > 0);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: pt, paddingBottom: pb + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} hitSlop={8} style={styles.summaryBackRow}>
          <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Edit
          </Text>
        </Pressable>

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          YOUR DRIVER
        </Text>
        <Text style={[styles.question, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {answers.name || answers.dream.slice(0, 40)}
        </Text>
        <Text style={[styles.hint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          {GOAL_KIND_LABELS[answers.kind as GoalKind]}
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        <Text style={[styles.summarySection, { color: c.mutedForeground, fontFamily: MONO }]}>
          THE DREAM
        </Text>
        <Text style={[styles.summaryText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
          {answers.dream}
        </Text>

        <View style={{ height: 20 }} />
        <Text style={[styles.summarySection, { color: c.mutedForeground, fontFamily: MONO }]}>
          THE ROADMAP
        </Text>
        {nodes.map((n) => (
          <View key={n.horizon} style={styles.nodeRow}>
            <Text style={[styles.nodeLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              {HORIZON_LABELS[n.horizon].toUpperCase()}
            </Text>
            <Text style={[styles.nodeText, { color: c.foreground, fontFamily: SERIF }]}>
              {n.text}
            </Text>
          </View>
        ))}

        {answers.risk.trim().length > 0 && (
          <>
            <View style={{ height: 20 }} />
            <Text style={[styles.summarySection, { color: c.mutedForeground, fontFamily: MONO }]}>
              PIVOTAL INFO
            </Text>
            <View
              style={[styles.pivotCard, { backgroundColor: c.card, borderColor: c.rule }]}
            >
              <Text style={[styles.pivotLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                BIGGEST RISK
              </Text>
              <Text style={[styles.pivotValue, { color: c.foreground, fontFamily: SERIF }]}>
                {answers.risk}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: pb,
            paddingHorizontal: 22,
            borderTopColor: c.rule,
            backgroundColor: c.background,
          },
        ]}
      >
        <Pressable
          onPress={onConfirm}
          style={({ pressed }) => [
            styles.continueBtn,
            { backgroundColor: c.foreground, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={[styles.continueBtnLabel, { color: c.background, fontFamily: MONO }]}>
            Create this driver →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
  },
  backLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  progressLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  progressTrack: {
    height: 2,
    marginBottom: 0,
  },
  progressFill: {
    height: 2,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 32,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  question: {
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: 0.2,
  },
  hint: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  rule: {
    height: 1,
    marginVertical: 22,
    opacity: 0.6,
  },
  inputSm: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    lineHeight: 24,
    minHeight: 60,
    textAlignVertical: "top",
  },
  inputLg: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    lineHeight: 26,
    minHeight: 120,
    textAlignVertical: "top",
  },
  choicesWrap: { gap: 10 },
  choiceCard: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  choiceLabel: {
    fontSize: 17,
    lineHeight: 22,
  },
  choiceDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  continueBtn: {
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  continueBtnLabel: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  summaryBackRow: { marginBottom: 20 },
  summarySection: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 17,
    lineHeight: 26,
  },
  nodeRow: { marginBottom: 14 },
  nodeLabel: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  nodeText: { fontSize: 16, lineHeight: 23 },
  pivotCard: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pivotLabel: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  pivotValue: { fontSize: 15, lineHeight: 22 },
});

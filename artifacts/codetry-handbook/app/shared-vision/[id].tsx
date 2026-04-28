// Single-session screen for the Shared Vision tool. Houses the metaphor
// picker, the guided describe-it flow with the live structured/plain
// translation, the running glossary, and the handoff brief.
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { MetaphorShape } from "@/components/sharedVision/MetaphorShape";
import { SyncStatusPill } from "@/components/SyncStatusPill";
import { useColors } from "@/hooks/useColors";
import { METAPHORS } from "@/lib/sharedVision/catalog";
import { generateBrief } from "@/lib/sharedVision/markdown";
import {
  activeGlossary,
  answeredCount,
  deriveSpec,
  generatePlainSummary,
  resolveTemplate,
  sessionLabel,
  splitList,
  totalPrompts,
} from "@/lib/sharedVision/spec";
import { useSharedVision } from "@/lib/sharedVision/store";
import type {
  MetaphorPrompt,
  MetaphorTemplate,
  SharedVisionSession,
  SpecCategory,
} from "@/lib/sharedVision/types";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

type Lens = "plain" | "structured";

function leadingArticle(noun: string): "a" | "an" {
  return /^[aeiou]/i.test(noun.trim()) ? "an" : "a";
}

function joinList(items: string[]): string {
  return items.join(", ");
}

export default function SharedVisionFlow() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  // Subscribe to the full sessions list so every persisted change
  // re-renders this screen.
  const { ready, sessions, updateSession, markHandedOff } = useSharedVision();
  const session = useMemo(
    () => sessions.find((s) => s.id === id),
    [sessions, id],
  );

  // Picker visibility is derived from session.metaphorId; forcePicker
  // covers "Change metaphor" on a session that already has one.
  const [forcePicker, setForcePicker] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [lens, setLens] = useState<Lens>("structured");
  const [customDraft, setCustomDraft] = useState("");
  const [briefCopied, setBriefCopied] = useState(false);

  const template = useMemo<MetaphorTemplate | null>(
    () => (session ? resolveTemplate(session) : null),
    [session],
  );

  const total = session ? totalPrompts(session) : 0;
  const answered = session ? answeredCount(session) : 0;
  const showPicker = !session?.metaphorId || forcePicker;

  // Loading / not-found states.
  if (!ready) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
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

  if (!session) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Text
          style={{
            color: c.foreground,
            fontFamily: SERIF_ITALIC,
            fontSize: 16,
          }}
        >
          That vision is gone.
        </Text>
        <Pressable
          onPress={() => router.replace("/shared-vision")}
          style={{ marginTop: 12 }}
        >
          <Text
            style={{
              color: c.foreground,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Back to all visions
          </Text>
        </Pressable>
      </View>
    );
  }

  const goBack = () => {
    if (showHandoff) {
      setShowHandoff(false);
      return;
    }
    if (forcePicker && session.metaphorId) {
      setForcePicker(false);
      return;
    }
    router.back();
  };

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
          onPress={goBack}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={22} color={c.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text
            style={{
              color: c.mutedForeground,
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 1.4,
              textTransform: "uppercase",
            }}
            numberOfLines={1}
          >
            Shared Vision
          </Text>
          <Text
            style={{
              color: c.foreground,
              fontFamily: SERIF_BOLD,
              fontSize: 13,
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {sessionLabel(session)}
          </Text>
        </View>
        <View style={styles.syncSlot}>
          <SyncStatusPill />
        </View>
      </View>

      {showPicker ? (
        <PickerView
          session={session}
          customDraft={customDraft}
          setCustomDraft={setCustomDraft}
          onChoose={(metaphorId, customNoun) => {
            const patch: Partial<SharedVisionSession> = { metaphorId };
            if (metaphorId === "custom") {
              const noun = (customNoun ?? "").trim();
              if (!noun) return;
              patch.customNoun = noun;
              patch.customArticle = leadingArticle(noun);
            } else {
              patch.customNoun = undefined;
              patch.customArticle = undefined;
            }
            updateSession(session.id, patch);
            setPromptIndex(0);
            setForcePicker(false);
            setShowHandoff(false);
          }}
        />
      ) : null}

      {!showPicker && !showHandoff && template ? (
        <ComposeView
          session={session}
          template={template}
          promptIndex={promptIndex}
          setPromptIndex={setPromptIndex}
          lens={lens}
          setLens={setLens}
          wide={wide}
          bottomPad={Math.max(insets.bottom, webBottom) + 32}
          onChangeAnswer={(promptId, value) =>
            updateSession(session.id, {
              answers: { [promptId]: value },
            })
          }
          onChangePlainSummary={(value) =>
            updateSession(session.id, {
              plainSummaryOverride: value,
            })
          }
          onClearPlainOverride={() =>
            updateSession(session.id, { plainSummaryOverride: undefined })
          }
          onChangeMetaphor={() => setForcePicker(true)}
          onHandoff={() => setShowHandoff(true)}
          totalPrompts={total}
          answeredPrompts={answered}
        />
      ) : null}

      {!showPicker && showHandoff ? (
        <HandoffView
          session={session}
          onMarkHandedOff={() => markHandedOff(session.id)}
          onBack={() => setShowHandoff(false)}
          briefCopied={briefCopied}
          setBriefCopied={setBriefCopied}
          bottomPad={Math.max(insets.bottom, webBottom) + 32}
        />
      ) : null}
    </View>
  );
}


function PickerView({
  session,
  customDraft,
  setCustomDraft,
  onChoose,
}: {
  session: SharedVisionSession;
  customDraft: string;
  setCustomDraft: (s: string) => void;
  onChoose: (metaphorId: string, customNoun?: string) => void;
}) {
  const c = useColors();
  return (
    <KeyboardAwareScrollViewCompat
      contentContainerStyle={styles.pickerScroll}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.eyebrow,
          { color: c.mutedForeground, fontFamily: MONO },
        ]}
      >
        STEP 1 · PICK A METAPHOR
      </Text>
      <Text
        style={[
          styles.heading,
          { color: c.foreground, fontFamily: SERIF_BOLD },
        ]}
      >
        What does it feel like?
      </Text>
      <Text
        style={[
          styles.helper,
          { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
        ]}
      >
        Pick the everyday object closest to what you have in mind. You can
        change this later.
      </Text>

      <View style={styles.grid}>
        {METAPHORS.map((m) => {
          const selected = session.metaphorId === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => onChoose(m.id)}
              style={({ pressed }) => [
                styles.tile,
                {
                  borderColor: selected ? c.foreground : c.rule,
                  backgroundColor: selected ? c.card : "transparent",
                  borderRadius: c.radius * 2,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              accessibilityLabel={`Pick ${m.article} ${m.noun}`}
            >
              <View style={styles.tileShape}>
                <MetaphorShape kind={m.shape} color={c.foreground} size={56} />
              </View>
              <Text
                style={[
                  styles.tileTitle,
                  { color: c.foreground, fontFamily: SERIF_BOLD },
                ]}
              >
                {m.article === "an" ? "An" : "A"} {m.noun}
              </Text>
              <Text
                style={[
                  styles.tileBlurb,
                  {
                    color: c.mutedForeground,
                    fontFamily: SERIF_ITALIC,
                  },
                ]}
              >
                {m.blurb}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ height: 12 }} />
      <Text
        style={[
          styles.eyebrow,
          { color: c.mutedForeground, fontFamily: MONO },
        ]}
      >
        OR
      </Text>
      <View
        style={[
          styles.customCard,
          {
            borderColor: c.rule,
            borderRadius: c.radius * 2,
          },
        ]}
      >
        <View style={styles.customRow}>
          <MetaphorShape kind="custom" color={c.foreground} size={48} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                styles.tileTitle,
                { color: c.foreground, fontFamily: SERIF_BOLD },
              ]}
            >
              Describe your own object
            </Text>
            <Text
              style={[
                styles.tileBlurb,
                { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
              ]}
            >
              Type the everyday word you'd use for it.
            </Text>
          </View>
        </View>
        <TextInput
          value={customDraft}
          onChangeText={setCustomDraft}
          placeholder="e.g. lunchbox, hopper, scrapbook"
          placeholderTextColor={c.mutedForeground}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.input,
            {
              color: c.foreground,
              fontFamily: SERIF,
              borderColor: c.border,
              borderRadius: c.radius,
            },
          ]}
        />
        <Pressable
          onPress={() => onChoose("custom", customDraft)}
          disabled={customDraft.trim().length === 0}
          style={({ pressed }) => [
            styles.customBtn,
            {
              backgroundColor:
                customDraft.trim().length === 0 ? c.muted : c.primary,
              borderRadius: c.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text
            style={{
              color: c.primaryForeground,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Use this object
          </Text>
        </Pressable>
      </View>
      <View style={{ height: 40 }} />
    </KeyboardAwareScrollViewCompat>
  );
}


function ComposeView({
  session,
  template,
  promptIndex,
  setPromptIndex,
  lens,
  setLens,
  wide,
  bottomPad,
  onChangeAnswer,
  onChangePlainSummary,
  onClearPlainOverride,
  onChangeMetaphor,
  onHandoff,
  totalPrompts: total,
  answeredPrompts,
}: {
  session: SharedVisionSession;
  template: MetaphorTemplate;
  promptIndex: number;
  setPromptIndex: (n: number) => void;
  lens: Lens;
  setLens: (l: Lens) => void;
  wide: boolean;
  bottomPad: number;
  onChangeAnswer: (promptId: string, value: string) => void;
  onChangePlainSummary: (value: string) => void;
  onClearPlainOverride: () => void;
  onChangeMetaphor: () => void;
  onHandoff: () => void;
  totalPrompts: number;
  answeredPrompts: number;
}) {
  const c = useColors();
  const safePromptIndex = Math.max(0, Math.min(promptIndex, total - 1));
  const prompt = template.prompts[safePromptIndex];
  const value = session.answers[prompt.id] ?? "";
  const goPrev = () => setPromptIndex(Math.max(0, safePromptIndex - 1));
  const goNext = () =>
    setPromptIndex(Math.min(total - 1, safePromptIndex + 1));

  const plainSummary = generatePlainSummary(session);
  const usingOverride =
    typeof session.plainSummaryOverride === "string" &&
    session.plainSummaryOverride.trim().length > 0;

  return (
    <KeyboardAwareScrollViewCompat
      contentContainerStyle={[
        styles.composeScroll,
        { paddingBottom: bottomPad },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.composeChosen}>
        <View style={styles.composeChosenLeft}>
          <MetaphorShape
            kind={template.shape}
            color={c.foreground}
            size={40}
          />
          <View style={{ marginLeft: 12 }}>
            <Text
              style={[
                styles.eyebrow,
                {
                  color: c.mutedForeground,
                  fontFamily: MONO,
                  marginBottom: 2,
                },
              ]}
            >
              YOUR METAPHOR
            </Text>
            <Text
              style={[
                styles.composeChosenTitle,
                { color: c.foreground, fontFamily: SERIF_BOLD },
              ]}
            >
              {template.article === "an" ? "An" : "A"} {template.noun}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onChangeMetaphor}
          hitSlop={8}
          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          accessibilityLabel="Change metaphor"
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
            Change
          </Text>
        </Pressable>
      </View>

      <Text
        style={[
          styles.eyebrow,
          { color: c.mutedForeground, fontFamily: MONO, marginTop: 18 },
        ]}
      >
        STEP 2 · DESCRIBE IT · {safePromptIndex + 1} OF {total}
      </Text>

      {/* Progress dots */}
      <View style={styles.dots}>
        {template.prompts.map((p, i) => {
          const filled = (session.answers[p.id] ?? "").trim().length > 0;
          const here = i === safePromptIndex;
          return (
            <Pressable
              key={p.id}
              onPress={() => setPromptIndex(i)}
              hitSlop={8}
              accessibilityLabel={`Go to question ${i + 1}`}
              style={({ pressed }) => [
                styles.dot,
                {
                  borderColor: c.foreground,
                  backgroundColor: here || filled ? c.foreground : "transparent",
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            />
          );
        })}
      </View>

      <Text
        style={[
          styles.promptQ,
          { color: c.foreground, fontFamily: SERIF_BOLD },
        ]}
      >
        {prompt.question}
      </Text>
      <Text
        style={[
          styles.helper,
          { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
        ]}
      >
        {prompt.helper}
      </Text>
      <TextInput
        value={value}
        onChangeText={(t) => onChangeAnswer(prompt.id, t)}
        placeholder={prompt.example}
        placeholderTextColor={c.mutedForeground}
        multiline
        textAlignVertical="top"
        style={[
          styles.bigInput,
          {
            color: c.foreground,
            fontFamily: SERIF,
            borderColor: c.border,
            borderRadius: c.radius,
          },
        ]}
      />
      <View style={styles.composeNav}>
        <Pressable
          onPress={goPrev}
          disabled={safePromptIndex === 0}
          style={({ pressed }) => [
            styles.navBtn,
            {
              borderColor: c.foreground,
              borderRadius: c.radius,
              opacity:
                safePromptIndex === 0 ? 0.3 : pressed ? 0.6 : 1,
            },
          ]}
          accessibilityLabel="Previous question"
        >
          <Text
            style={{
              color: c.foreground,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Back
          </Text>
        </Pressable>
        <Pressable
          onPress={goNext}
          disabled={safePromptIndex === total - 1}
          style={({ pressed }) => [
            styles.navBtn,
            {
              borderColor: c.foreground,
              borderRadius: c.radius,
              opacity:
                safePromptIndex === total - 1 ? 0.3 : pressed ? 0.6 : 1,
            },
          ]}
          accessibilityLabel="Next question"
        >
          <Text
            style={{
              color: c.foreground,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Next
          </Text>
        </Pressable>
      </View>

      <View style={{ height: 28 }} />
      <Text
        style={[
          styles.eyebrow,
          { color: c.mutedForeground, fontFamily: MONO },
        ]}
      >
        STEP 3 · LIVE TRANSLATION
      </Text>

      {wide ? (
        <View style={styles.translationRow}>
          <View style={{ flex: 1 }}>
            <PlainPanel
              value={plainSummary}
              usingOverride={usingOverride}
              onChange={onChangePlainSummary}
              onResetOverride={onClearPlainOverride}
            />
          </View>
          <View style={{ width: 16 }} />
          <View style={{ flex: 1 }}>
            <StructuredPanel
              session={session}
              template={template}
              onChangeAnswer={onChangeAnswer}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={[styles.lensRow, { borderColor: c.rule }]}>
            <LensTab
              label="Structured"
              active={lens === "structured"}
              onPress={() => setLens("structured")}
            />
            <LensTab
              label="In your words"
              active={lens === "plain"}
              onPress={() => setLens("plain")}
            />
          </View>
          {lens === "plain" ? (
            <PlainPanel
              value={plainSummary}
              usingOverride={usingOverride}
              onChange={onChangePlainSummary}
              onResetOverride={onClearPlainOverride}
            />
          ) : (
            <StructuredPanel
              session={session}
              template={template}
              onChangeAnswer={onChangeAnswer}
            />
          )}
        </>
      )}

      <View style={{ height: 28 }} />
      <Text
        style={[
          styles.eyebrow,
          { color: c.mutedForeground, fontFamily: MONO },
        ]}
      >
        STEP 4 · SHARED VOCABULARY
      </Text>
      <GlossaryStrip session={session} />

      <View style={{ height: 28 }} />
      <Text
        style={[
          styles.eyebrow,
          { color: c.mutedForeground, fontFamily: MONO },
        ]}
      >
        STEP 5 · HAND OFF · {answeredPrompts} OF {total} ANSWERED
      </Text>
      <Pressable
        onPress={onHandoff}
        style={({ pressed }) => [
          styles.handoffBtn,
          {
            backgroundColor: c.primary,
            borderRadius: c.radius,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        accessibilityLabel="Hand off to the agent"
      >
        <Text
          style={{
            color: c.primaryForeground,
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Hand off to the agent
        </Text>
      </Pressable>
      <Text
        style={[
          styles.handoffHelp,
          { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
        ]}
      >
        Builds a brief in the format Replit Agent reads best. You'll be
        able to copy it{Platform.OS === "web" ? " or download it as a file" : ""}.
      </Text>
    </KeyboardAwareScrollViewCompat>
  );
}

function LensTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.lensTab,
        {
          backgroundColor: active ? c.foreground : "transparent",
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
    >
      <Text
        style={{
          color: active ? c.primaryForeground : c.foreground,
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function PlainPanel({
  value,
  usingOverride,
  onChange,
  onResetOverride,
}: {
  value: string;
  usingOverride: boolean;
  onChange: (s: string) => void;
  onResetOverride: () => void;
}) {
  const c = useColors();
  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: c.card,
          borderColor: c.border,
          borderRadius: c.radius * 2,
        },
      ]}
    >
      <View style={styles.panelHead}>
        <Text
          style={[
            styles.panelLabel,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          IN YOUR WORDS
        </Text>
        <Text
          style={[
            styles.panelLabel,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          {usingOverride ? "EDITED" : "AUTO"}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline
        textAlignVertical="top"
        placeholder="Your description will appear here as you answer the questions. Edit it directly to override the brief."
        placeholderTextColor={c.mutedForeground}
        style={[
          styles.panelText,
          {
            color: c.foreground,
            fontFamily: SERIF,
          },
        ]}
        accessibilityLabel="Plain-language summary"
      />
      {usingOverride ? (
        <Pressable
          onPress={onResetOverride}
          hitSlop={8}
          style={styles.panelResetBtn}
          accessibilityLabel="Reset to auto-generated summary"
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
            Reset to auto
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function StructuredPanel({
  session,
  template,
  onChangeAnswer,
}: {
  session: SharedVisionSession;
  template: MetaphorTemplate;
  onChangeAnswer: (promptId: string, value: string) => void;
}) {
  const c = useColors();
  // Group prompts by category so the panel reads as Entities / Actors /
  // Actions / Triggers; future-proofs catalogs that add multiple prompts
  // per category.
  const grouped = useMemo<
    Record<SpecCategory, MetaphorPrompt[]>
  >(() => {
    const out: Record<SpecCategory, MetaphorPrompt[]> = {
      entities: [],
      actors: [],
      actions: [],
      triggers: [],
    };
    for (const p of template.prompts) out[p.category].push(p);
    return out;
  }, [template]);
  const order: { key: SpecCategory; label: string }[] = [
    { key: "entities", label: "Entities" },
    { key: "actors", label: "Actors" },
    { key: "actions", label: "Actions" },
    { key: "triggers", label: "Triggers" },
  ];
  const spec = deriveSpec(session);
  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: c.card,
          borderColor: c.border,
          borderRadius: c.radius * 2,
        },
      ]}
    >
      <View style={styles.panelHead}>
        <Text
          style={[
            styles.panelLabel,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          STRUCTURED
        </Text>
      </View>
      {order.map(({ key, label }) => {
        const prompts = grouped[key];
        if (prompts.length === 0) return null;
        return (
          <View key={key} style={{ marginBottom: 14 }}>
            <Text
              style={[
                styles.specLabel,
                { color: c.foreground, fontFamily: MONO },
              ]}
            >
              {label}
            </Text>
            {prompts.map((p) => {
              const items = splitList(session.answers[p.id] ?? "");
              return (
                <View key={p.id} style={{ marginTop: 6 }}>
                  <Text
                    style={[
                      styles.specSubLabel,
                      {
                        color: c.mutedForeground,
                        fontFamily: SERIF_ITALIC,
                      },
                    ]}
                  >
                    {p.specLabel}
                  </Text>
                  <TextInput
                    value={joinList(items)}
                    onChangeText={(t) => onChangeAnswer(p.id, t)}
                    placeholder="comma-separated"
                    placeholderTextColor={c.mutedForeground}
                    style={[
                      styles.specInput,
                      {
                        color: c.foreground,
                        fontFamily: SERIF,
                        borderColor: c.border,
                        borderRadius: c.radius,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        );
      })}
      {/* Summary chip showing what's currently in the spec — useful when
          the structured fields are empty. */}
      <View
        style={[
          styles.specSummary,
          { borderColor: c.rule, borderRadius: c.radius },
        ]}
      >
        <Text
          style={[
            styles.specSummaryText,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          {spec.entities.length + spec.actors.length + spec.actions.length + spec.triggers.length}{" "}
          spec items so far
        </Text>
      </View>
    </View>
  );
}

function GlossaryStrip({ session }: { session: SharedVisionSession }) {
  const c = useColors();
  const terms = activeGlossary(session);
  if (terms.length === 0) {
    return (
      <Text
        style={[
          styles.glossaryEmpty,
          { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
        ]}
      >
        Pick a metaphor to see your shared vocabulary.
      </Text>
    );
  }
  return (
    <View style={styles.glossaryWrap}>
      {terms.map((t, i) => (
        <View
          key={`${t.metaphor}-${i}`}
          style={[
            styles.glossaryRow,
            { borderColor: c.rule, borderRadius: c.radius },
          ]}
        >
          <Text
            style={[
              styles.glossaryMetaphor,
              { color: c.foreground, fontFamily: SERIF_BOLD },
            ]}
          >
            {t.metaphor}
          </Text>
          <Text
            style={[
              styles.glossaryArrow,
              { color: c.mutedForeground, fontFamily: MONO },
            ]}
          >
            →
          </Text>
          <Text
            style={[
              styles.glossarySpec,
              { color: c.foreground, fontFamily: SERIF },
            ]}
          >
            {t.spec}
          </Text>
          <Text
            style={[
              styles.glossaryCat,
              { color: c.mutedForeground, fontFamily: MONO },
            ]}
          >
            {t.category}
          </Text>
        </View>
      ))}
    </View>
  );
}


function HandoffView({
  session,
  onMarkHandedOff,
  onBack,
  briefCopied,
  setBriefCopied,
  bottomPad,
}: {
  session: SharedVisionSession;
  onMarkHandedOff: () => void;
  onBack: () => void;
  briefCopied: boolean;
  setBriefCopied: (v: boolean) => void;
  bottomPad: number;
}) {
  const c = useColors();
  const brief = useMemo(() => generateBrief(session), [session]);

  const onCopy = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(brief);
      setBriefCopied(true);
      onMarkHandedOff();
      setTimeout(() => setBriefCopied(false), 2000);
    } catch {
      // Clipboard refusal isn't fatal — the brief is still on screen and
      // selectable for manual copy.
    }
  }, [brief, onMarkHandedOff, setBriefCopied]);

  const onDownload = useCallback(() => {
    if (Platform.OS !== "web") return;
    const g: { document?: Document; URL?: typeof URL; Blob?: typeof Blob } =
      typeof globalThis !== "undefined"
        ? (globalThis as unknown as {
            document?: Document;
            URL?: typeof URL;
            Blob?: typeof Blob;
          })
        : {};
    const doc = g.document;
    const URLref = g.URL;
    const BlobRef = g.Blob;
    if (!doc || !URLref || !BlobRef) return;
    const filename =
      sessionLabel(session)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "shared-vision";
    const blob = new BlobRef([brief], { type: "text/markdown;charset=utf-8" });
    const url = URLref.createObjectURL(blob);
    const a = doc.createElement("a");
    a.href = url;
    a.download = `${filename}.md`;
    doc.body.appendChild(a);
    a.click();
    doc.body.removeChild(a);
    setTimeout(() => URLref.revokeObjectURL(url), 1000);
    onMarkHandedOff();
  }, [brief, session, onMarkHandedOff]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.handoffScroll,
        { paddingBottom: bottomPad },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.eyebrow,
          { color: c.mutedForeground, fontFamily: MONO },
        ]}
      >
        STEP 5 · HAND OFF
      </Text>
      <Text
        style={[
          styles.heading,
          { color: c.foreground, fontFamily: SERIF_BOLD },
        ]}
      >
        Your brief for the agent
      </Text>
      <Text
        style={[
          styles.helper,
          { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
        ]}
      >
        Paste this into a fresh Replit Agent task. The headings match the
        format Agent reads best. You can keep editing the vision afterward
        — the brief regenerates from your latest answers.
      </Text>

      <View style={styles.handoffActions}>
        <Pressable
          onPress={onCopy}
          style={({ pressed }) => [
            styles.handoffBtn,
            {
              backgroundColor: c.primary,
              borderRadius: c.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          accessibilityLabel="Copy brief to clipboard"
        >
          <Text
            style={{
              color: c.primaryForeground,
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {briefCopied ? "Copied" : "Copy brief"}
          </Text>
        </Pressable>
        {Platform.OS === "web" ? (
          <Pressable
            onPress={onDownload}
            style={({ pressed }) => [
              styles.handoffBtnGhost,
              {
                borderColor: c.foreground,
                borderRadius: c.radius,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            accessibilityLabel="Download brief as markdown file"
          >
            <Text
              style={{
                color: c.foreground,
                fontFamily: MONO,
                fontSize: 13,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Download .md
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.handoffBtnGhost,
            {
              borderColor: c.foreground,
              borderRadius: c.radius,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          accessibilityLabel="Back to vision"
        >
          <Text
            style={{
              color: c.foreground,
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Back to vision
          </Text>
        </Pressable>
      </View>

      {session.handedOffAt ? (
        <Text
          style={[
            styles.handoffStamp,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          Handed off {new Date(session.handedOffAt).toLocaleString()}
        </Text>
      ) : null}

      <View
        style={[
          styles.briefCard,
          {
            backgroundColor: c.card,
            borderColor: c.border,
            borderRadius: c.radius * 2,
          },
        ]}
      >
        <Text
          selectable
          style={[
            styles.briefText,
            { color: c.foreground, fontFamily: MONO },
          ]}
        >
          {brief}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
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
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  helper: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 16,
  },
  // Picker --------------------------------------------------------
  pickerScroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
    marginTop: 8,
  },
  tile: {
    width: "50%",
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    minHeight: 160,
  },
  tileShape: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  tileTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
  },
  tileBlurb: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  customCard: {
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  customBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  // Compose -------------------------------------------------------
  composeScroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  composeChosen: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  composeChosenLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  composeChosenTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    marginBottom: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  promptQ: {
    fontSize: 22,
    lineHeight: 28,
  },
  bigInput: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 96,
    marginTop: 4,
  },
  composeNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 10,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  // Translation ---------------------------------------------------
  translationRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  lensRow: {
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    padding: 2,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  lensTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 3,
  },
  panel: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 12,
  },
  panelHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  panelLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  panelText: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 96,
    paddingVertical: 4,
  },
  panelResetBtn: {
    alignSelf: "flex-start",
    paddingTop: 8,
  },
  specLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  specSubLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  specInput: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginTop: 4,
  },
  specSummary: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  specSummaryText: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  // Glossary ------------------------------------------------------
  glossaryWrap: {
    gap: 8,
  },
  glossaryRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  glossaryMetaphor: {
    fontSize: 14,
    lineHeight: 20,
  },
  glossaryArrow: {
    fontSize: 12,
  },
  glossarySpec: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
  glossaryCat: {
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginLeft: "auto",
  },
  glossaryEmpty: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Handoff -------------------------------------------------------
  handoffBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  handoffBtnGhost: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  handoffHelp: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  handoffScroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  handoffActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  handoffStamp: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 12,
  },
  briefCard: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginTop: 16,
  },
  briefText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

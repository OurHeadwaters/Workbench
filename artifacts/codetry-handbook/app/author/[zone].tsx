import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
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

import { ZONE_AUTHOR_ENTRIES } from "@/data/authorPrompts";
import { useColors } from "@/hooks/useColors";
import { useAuthor } from "@/lib/authorStore";

const SERIF = "Fraunces_700Bold";
const SERIF_I = "Fraunces_400Regular_Italic";
const SERIF_R = "Fraunces_400Regular";
const MONO = "JetBrainsMono_500Medium";

export default function AuthorZone() {
  const params = useLocalSearchParams<{ zone: string }>();
  const zoneId = typeof params.zone === "string" ? params.zone : "";
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { getAnswer, setAnswer } = useAuthor();

  const entry = ZONE_AUTHOR_ENTRIES.find((z) => z.id === zoneId);

  const [promptIndex, setPromptIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  const prompt = entry?.prompts[promptIndex];

  useEffect(() => {
    if (prompt) {
      const existing = getAnswer(zoneId, prompt.id);
      setDraft(existing);
      setSaved(existing.length > 0);
    }
  }, [promptIndex, zoneId, prompt, getAnswer]);

  const onChangeText = useCallback(
    (text: string) => {
      setDraft(text);
      setSaved(false);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        if (prompt) {
          setAnswer(zoneId, prompt.id, text);
          setSaved(true);
        }
      }, 800);
    },
    [zoneId, prompt, setAnswer],
  );

  const goNext = useCallback(() => {
    if (!entry) return;
    Keyboard.dismiss();
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      if (prompt) setAnswer(zoneId, prompt.id, draft);
    }
    if (promptIndex < entry.prompts.length - 1) {
      setPromptIndex((i) => i + 1);
    } else {
      router.back();
    }
  }, [entry, promptIndex, zoneId, prompt, draft, setAnswer]);

  const goPrev = useCallback(() => {
    Keyboard.dismiss();
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      if (prompt) setAnswer(zoneId, prompt.id, draft);
    }
    if (promptIndex > 0) {
      setPromptIndex((i) => i - 1);
    }
  }, [promptIndex, zoneId, prompt, draft, setAnswer]);

  if (!entry || !prompt) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <Text style={{ color: c.foreground, fontFamily: SERIF_I, padding: 24 }}>
          Zone not found.
        </Text>
      </View>
    );
  }

  const isLast = promptIndex === entry.prompts.length - 1;
  const isFirst = promptIndex === 0;
  const wordCount = draft.trim().split(/\s+/).filter(Boolean).length;
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: c.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 20,
            paddingBottom: Math.max(insets.bottom, webBottom) + 32,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={[styles.back, { color: c.mutedForeground, fontFamily: MONO }]}>
              ← {entry.name}
            </Text>
          </Pressable>
          <Text style={[styles.progress, { color: c.mutedForeground, fontFamily: MONO }]}>
            {promptIndex + 1} / {entry.prompts.length}
          </Text>
        </View>

        <View style={[styles.progressBar, { backgroundColor: c.rule }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: c.rust,
                width: `${Math.round(((promptIndex + 1) / entry.prompts.length) * 100)}%` as any,
              },
            ]}
          />
        </View>

        <View style={{ height: 32 }} />

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          {entry.subtitle}
        </Text>

        <Text style={[styles.question, { color: c.foreground, fontFamily: SERIF }]}>
          {prompt.question}
        </Text>

        {prompt.hint ? (
          <Text style={[styles.hint, { color: c.mutedForeground, fontFamily: SERIF_I }]}>
            {prompt.hint}
          </Text>
        ) : null}

        <View style={[styles.inputWrap, { borderColor: c.rule, backgroundColor: c.card }]}>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={onChangeText}
            multiline
            placeholder="Write here — your words, your story."
            placeholderTextColor={c.mutedForeground}
            style={[
              styles.input,
              {
                color: c.foreground,
                fontFamily: SERIF_R,
              },
            ]}
            textAlignVertical="top"
            scrollEnabled={false}
          />
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: c.mutedForeground, fontFamily: MONO }]}>
            {draft.trim().length === 0
              ? "Not yet answered"
              : saved
                ? `Saved · ${wordCount} ${wordCount === 1 ? "word" : "words"}`
                : "Saving…"}
          </Text>
        </View>

        <View style={{ height: 24 }} />
        <View style={[styles.rule, { backgroundColor: c.rule }]} />
        <View style={{ height: 24 }} />

        <View style={styles.nav}>
          <Pressable
            onPress={goPrev}
            disabled={isFirst}
            style={({ pressed }) => [
              styles.navBtn,
              {
                borderColor: c.rule,
                opacity: isFirst ? 0.3 : pressed ? 0.6 : 1,
              },
            ]}
          >
            <Text style={[styles.navBtnText, { color: c.foreground, fontFamily: MONO }]}>
              ← Prev
            </Text>
          </Pressable>

          <Pressable
            onPress={goNext}
            style={({ pressed }) => [
              styles.navBtnPrimary,
              {
                backgroundColor: c.rust,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.navBtnText,
                { color: c.primaryForeground, fontFamily: MONO },
              ]}
            >
              {isLast ? "Done ✓" : "Next →"}
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 12 }} />

        <View style={styles.dotsRow}>
          {entry.prompts.map((p, i) => {
            const hasText = getAnswer(zoneId, p.id).trim().length > 0;
            const isCurrent = i === promptIndex;
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  Keyboard.dismiss();
                  if (saveTimer.current) {
                    clearTimeout(saveTimer.current);
                    if (prompt) setAnswer(zoneId, prompt.id, draft);
                  }
                  setPromptIndex(i);
                }}
                hitSlop={8}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isCurrent
                      ? c.rust
                      : hasText
                        ? c.accent
                        : c.rule,
                  },
                ]}
              />
            );
          })}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  back: { fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  progress: { fontSize: 11, letterSpacing: 1.4 },
  progressBar: {
    height: 2,
    borderRadius: 1,
    overflow: "hidden",
  },
  progressFill: { height: 2, borderRadius: 1 },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  question: {
    fontSize: 24,
    lineHeight: 34,
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  inputWrap: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    minHeight: 180,
  },
  input: {
    fontSize: 17,
    lineHeight: 28,
    minHeight: 148,
  },
  statusRow: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  rule: { height: 1, opacity: 0.5 },
  nav: {
    flexDirection: "row",
    gap: 12,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 4,
  },
  navBtnPrimary: {
    flex: 2,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  navBtnText: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

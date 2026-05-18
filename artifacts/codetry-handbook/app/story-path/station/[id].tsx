// Youth Odyssey station screen.
//
// Flow:
//   READ   — 2-3 line excerpt from the anchor tale
//   DO     — sequential prompts, one at a time, with a log of completed answers
//   STORY  — AI-generated story using the collected answers
//   MARK   — mark done to unlock the next station
//
// If the station is already completed, the stored story is shown directly.

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

import { useColors } from "@/hooks/useColors";
import {
  YOUTH_STATIONS,
  getYouthStation,
  getYouthNeighbors,
  type AgeTrack,
} from "@/data/youthPath";
import { useYouthPath } from "@/lib/youthPath/store";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

const STATION_ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV",
  5: "V", 6: "VI", 7: "VII", 8: "VIII",
};

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api-server/api`
  : "http://localhost:3001/api";

type ScreenPhase = "prompts" | "generating" | "story" | "done";

export default function StoryStationScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const {
    ready,
    ageTrack,
    isCompleted,
    isUnlocked,
    getAnswers,
    saveAnswer,
    markDone,
    unmark,
    getStory,
  } = useYouthPath();

  const station = useMemo(() => getYouthStation(id), [id]);
  const { prev, next } = useMemo(() => getYouthNeighbors(id), [id]);
  const completed = station ? isCompleted(station.id) : false;
  const unlocked = station ? isUnlocked(station.id) : false;

  const track = (ageTrack ?? "tween") as AgeTrack;
  const prompts = station?.prompts[track] ?? [];
  const storyInstruction = station?.storyInstruction[track] ?? "";

  const storedAnswers = station ? getAnswers(station.id) : {};
  const storedStory = station ? getStory(station.id) : undefined;

  const firstUnanswered = prompts.findIndex(
    (p) => !storedAnswers[p.id] || storedAnswers[p.id].trim() === "",
  );
  const allAnswered = firstUnanswered === -1;

  const [currentPromptIdx, setCurrentPromptIdx] = useState(
    allAnswered ? prompts.length : Math.max(0, firstUnanswered),
  );
  const [currentInput, setCurrentInput] = useState("");
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>(storedAnswers);
  const [phase, setPhase] = useState<ScreenPhase>(
    completed || (allAnswered && storedStory) ? "story" : "prompts",
  );
  const [localStory, setLocalStory] = useState<string | null>(storedStory ?? null);
  const [generating, setGenerating] = useState(false);
  const [generating_error, setGeneratingError] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const celebrateTargetRef = useRef<string | null>(null);

  const inputRef = useRef<TextInput>(null);

  // Sync hydration from store after AsyncStorage loads
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!ready || !station || hydratedRef.current) return;
    hydratedRef.current = true;
    const answers = getAnswers(station.id);
    setLocalAnswers(answers);
    const story = getStory(station.id);
    if (story) setLocalStory(story);
    const idx = prompts.findIndex(
      (p) => !answers[p.id] || answers[p.id].trim() === "",
    );
    const allDone = idx === -1;
    setCurrentPromptIdx(allDone ? prompts.length : Math.max(0, idx));
    if (isCompleted(station.id) || (allDone && story)) {
      setPhase("story");
    }
  }, [ready, station, prompts, getAnswers, getStory, isCompleted]);

  const onNext = useCallback(() => {
    if (!station) return;
    const trimmed = currentInput.trim();
    if (!trimmed) return;
    const prompt = prompts[currentPromptIdx];
    if (!prompt) return;
    const newAnswers = { ...localAnswers, [prompt.id]: trimmed };
    setLocalAnswers(newAnswers);
    saveAnswer(station.id, prompt.id, trimmed);
    setCurrentInput("");
    if (currentPromptIdx < prompts.length - 1) {
      setCurrentPromptIdx(currentPromptIdx + 1);
    } else {
      setCurrentPromptIdx(prompts.length);
    }
  }, [station, currentInput, currentPromptIdx, localAnswers, prompts, saveAnswer]);

  const generateStory = useCallback(async () => {
    if (!station || generating) return;
    setGenerating(true);
    setGeneratingError(null);
    setPhase("generating");

    try {
      const answeredPrompts = prompts
        .filter((p) => localAnswers[p.id]?.trim())
        .map((p) => ({ question: p.question, answer: localAnswers[p.id] }));

      const res = await fetch(`${API_BASE}/youth-path/generate-story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stationName: station.name,
          ageTrack: track,
          instruction: storyInstruction,
          answeredPrompts,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Story generation failed");
      }

      const data = (await res.json()) as { story: string };
      setLocalStory(data.story);
      setPhase("story");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setGeneratingError(msg);
      setPhase("prompts");
    } finally {
      setGenerating(false);
    }
  }, [station, generating, prompts, localAnswers, track, storyInstruction]);

  const onMarkDone = useCallback(() => {
    if (!station || celebrating) return;
    markDone(station.id, localStory ?? undefined);
    celebrateTargetRef.current = station.id;
    setCelebrating(true);
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 420, delay: 160, useNativeDriver: true }),
    ]).start();
  }, [celebrating, flashAnim, markDone, station, localStory]);

  useEffect(() => {
    if (!celebrating) return;
    const targetId = celebrateTargetRef.current;
    if (!targetId) return;
    const t = setTimeout(() => {
      router.replace({ pathname: "/story-path", params: { just: targetId } });
    }, 1050);
    return () => clearTimeout(t);
  }, [celebrating]);

  const onUnmark = useCallback(() => {
    if (!station) return;
    unmark(station.id);
    setPhase("story");
  }, [station, unmark]);

  if (!station) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <View style={styles.errorPad}>
          <Text style={[styles.errorTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
            That station isn't on the path.
          </Text>
          <Pressable onPress={() => router.replace("/story-path")} style={styles.errorBack}>
            <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
              ← Back to the path
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!unlocked) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <View
          style={[
            styles.errorPad,
            {
              paddingTop: Math.max(insets.top, webTop) + 60,
              paddingBottom: Math.max(insets.bottom, webBottom) + 32,
            },
          ]}
        >
          <Text style={[styles.lockedEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
            STATION {STATION_ROMAN[station.ordinal] ?? station.ordinal} · LOCKED
          </Text>
          <Text style={[styles.errorTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
            {station.name}
          </Text>
          <Text style={[styles.lockedBody, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
            Walk {prev?.name ?? "the previous station"} first. The path opens one step at a time.
          </Text>
          <Pressable
            onPress={() => router.replace("/story-path")}
            style={({ pressed }) => [
              styles.lockedBtn,
              { borderColor: c.foreground, backgroundColor: c.background, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.lockedBtnLabel, { color: c.foreground, fontFamily: MONO }]}>
              Back to the path
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentPrompt = currentPromptIdx < prompts.length ? prompts[currentPromptIdx] : null;
  const completedPrompts = prompts.slice(0, currentPromptIdx);
  const allPromptsAnswered = currentPromptIdx >= prompts.length;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.flashOverlay,
          {
            backgroundColor: c.foreground,
            opacity: flashAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.12] }),
          },
        ]}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 24,
            paddingBottom: Math.max(insets.bottom, webBottom) + 60,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.navRow}>
          <Pressable onPress={() => router.replace("/story-path")} accessibilityLabel="Back to path">
            <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
              ← Path
            </Text>
          </Pressable>
          <Pressable onPress={() => router.replace("/")} accessibilityLabel="Home">
            <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
              Home →
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          STATION {STATION_ROMAN[station.ordinal] ?? station.ordinal} OF {YOUTH_STATIONS.length}
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {station.name}
        </Text>
        <Text style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
          {station.subtitle}
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {/* READ */}
        <Text style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          READ
        </Text>
        <View style={[styles.excerptCard, { backgroundColor: c.card, borderColor: c.rule }]}>
          <Text style={[styles.excerptText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
            {station.taleExcerpt}
          </Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/tales/[id]" as never,
                params: { id: station.sourceTaleId },
              })
            }
            style={({ pressed }) => [styles.readMoreRow, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={[styles.readMoreLabel, { color: c.foreground, fontFamily: MONO }]}>
              Read the full tale →
            </Text>
          </Pressable>
        </View>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {/* DO — sequential prompts */}
        {phase === "prompts" || phase === "generating" ? (
          <>
            <Text style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
              WRITE
            </Text>

            {/* Completed answers log */}
            {completedPrompts.map((p) => (
              <View key={p.id} style={[styles.answerLog, { borderLeftColor: c.rule }]}>
                <Text style={[styles.answerLogQ, { color: c.mutedForeground, fontFamily: MONO }]}>
                  {p.question}
                </Text>
                <Text style={[styles.answerLogA, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                  {localAnswers[p.id]}
                </Text>
              </View>
            ))}

            {/* Current prompt or all-answered CTA */}
            {allPromptsAnswered ? (
              <View style={styles.generateWrap}>
                <Text style={[styles.generateIntro, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                  You've answered every question. Ready to see your story?
                </Text>
                {generating_error ? (
                  <Text style={[styles.errorNote, { color: c.foreground, fontFamily: MONO }]}>
                    {generating_error} — try again
                  </Text>
                ) : null}
                <Pressable
                  onPress={generateStory}
                  disabled={generating}
                  style={({ pressed }) => [
                    styles.generateBtn,
                    { backgroundColor: c.foreground, opacity: pressed || generating ? 0.7 : 1 },
                  ]}
                >
                  <Text style={[styles.generateBtnLabel, { color: c.background, fontFamily: MONO }]}>
                    {generating ? "Writing your story…" : "Write my story"}
                  </Text>
                </Pressable>
              </View>
            ) : currentPrompt ? (
              <View style={[styles.promptCard, { backgroundColor: c.card, borderColor: c.foreground }]}>
                <Text style={[styles.promptQ, { color: c.foreground, fontFamily: SERIF }]}>
                  {currentPrompt.question}
                </Text>
                <TextInput
                  ref={inputRef}
                  value={currentInput}
                  onChangeText={setCurrentInput}
                  placeholder={currentPrompt.placeholder}
                  placeholderTextColor={c.mutedForeground}
                  style={[
                    styles.promptInput,
                    { color: c.foreground, borderColor: c.rule, backgroundColor: c.background, fontFamily: SERIF },
                  ]}
                  multiline
                  numberOfLines={3}
                  returnKeyType="default"
                  autoFocus={false}
                />
                <Pressable
                  onPress={onNext}
                  disabled={!currentInput.trim()}
                  style={({ pressed }) => [
                    styles.nextBtn,
                    {
                      backgroundColor: currentInput.trim() ? c.foreground : c.rule,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.nextBtnLabel,
                      { color: currentInput.trim() ? c.background : c.mutedForeground, fontFamily: MONO },
                    ]}
                  >
                    {currentPromptIdx === prompts.length - 1 ? "Done answering" : "Next →"}
                  </Text>
                </Pressable>
                <Text style={[styles.promptCounter, { color: c.mutedForeground, fontFamily: MONO }]}>
                  {currentPromptIdx + 1} of {prompts.length}
                </Text>
              </View>
            ) : null}
          </>
        ) : null}

        {/* Generating indicator */}
        {phase === "generating" ? (
          <View style={styles.generatingWrap}>
            <Text style={[styles.generatingText, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              Writing your story…
            </Text>
          </View>
        ) : null}

        {/* STORY */}
        {(phase === "story" || phase === "done") && localStory ? (
          <>
            <Text style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
              YOUR STORY
            </Text>
            <View style={[styles.storyCard, { backgroundColor: c.card, borderColor: c.rule }]}>
              {localStory.split("\n\n").filter(Boolean).map((para, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.storyPara,
                    { color: c.foreground, fontFamily: SERIF },
                    idx > 0 && { marginTop: 16 },
                  ]}
                >
                  {para.trim()}
                </Text>
              ))}
            </View>

            {!completed ? (
              <>
                <View style={[styles.rule, { backgroundColor: c.rule }]} />
                <Text style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
                  MARK DONE
                </Text>
                <Text style={[styles.markIntro, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                  When you've sat with your story, mark this station. The next one opens.
                </Text>
                <Pressable
                  onPress={onMarkDone}
                  style={({ pressed }) => [
                    styles.markBtn,
                    { backgroundColor: c.foreground, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="checkmark" size={18} color={c.background} />
                  <Text style={[styles.markBtnLabel, { color: c.background, fontFamily: MONO }]}>
                    Mark this station walked
                  </Text>
                </Pressable>
              </>
            ) : (
              <Animated.View
                style={[
                  styles.markedRow,
                  celebrating && {
                    transform: [
                      {
                        scale: flashAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[styles.markedPill, { backgroundColor: c.foreground }]}>
                  <Ionicons name="checkmark" size={14} color={c.background} />
                  <Text style={[styles.markedPillLabel, { color: c.background, fontFamily: MONO }]}>
                    STATION WALKED
                  </Text>
                </View>
                {!celebrating ? (
                  <Pressable
                    onPress={onUnmark}
                    style={({ pressed }) => [styles.unmarkBtn, { opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Text style={[styles.unmarkLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                      Unmark
                    </Text>
                  </Pressable>
                ) : (
                  <Text style={[styles.unmarkLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                    Returning to path…
                  </Text>
                )}
              </Animated.View>
            )}
          </>
        ) : null}

        {/* Navigation */}
        <View style={[styles.rule, { backgroundColor: c.rule, marginTop: 28 }]} />
        <View style={styles.nextRow}>
          {prev ? (
            <Pressable
              onPress={() =>
                router.replace({ pathname: "/story-path/station/[id]", params: { id: prev.id } })
              }
              style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.navHint, { color: c.mutedForeground, fontFamily: MONO }]}>
                ← {STATION_ROMAN[prev.ordinal] ?? prev.ordinal}
              </Text>
              <Text style={[styles.navName, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                {prev.name}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.navBtn} />
          )}
          {next ? (
            completed ? (
              <Pressable
                onPress={() =>
                  router.replace({ pathname: "/story-path/station/[id]", params: { id: next.id } })
                }
                style={({ pressed }) => [styles.navBtn, styles.navBtnRight, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Text style={[styles.navHint, { color: c.mutedForeground, fontFamily: MONO }]}>
                  {STATION_ROMAN[next.ordinal] ?? next.ordinal} →
                </Text>
                <Text style={[styles.navName, styles.navNameRight, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                  {next.name}
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.navBtn, styles.navBtnRight]}>
                <Text style={[styles.navHint, { color: c.muted, fontFamily: MONO }]}>
                  {STATION_ROMAN[next.ordinal] ?? next.ordinal}
                </Text>
                <Text style={[styles.navName, styles.navNameRight, { color: c.muted, fontFamily: SERIF_ITALIC }]}>
                  Locked until you mark this one
                </Text>
              </View>
            )
          ) : completed ? (
            <View style={[styles.navBtn, styles.navBtnRight]}>
              <Text style={[styles.navHint, { color: c.foreground, fontFamily: MONO }]}>
                THE PATH IS WALKED
              </Text>
            </View>
          ) : (
            <View style={styles.navBtn} />
          )}
        </View>
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
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  errorPad: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  errorTitle: { fontSize: 26, lineHeight: 32, marginBottom: 16 },
  errorBack: { marginTop: 8 },
  lockedEyebrow: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  lockedBody: { fontSize: 17, lineHeight: 26, marginTop: 10, marginBottom: 24 },
  lockedBtn: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  lockedBtnLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backLink: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  eyebrow: { fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 6 },
  title: { fontSize: 34, lineHeight: 38, letterSpacing: 0.4, marginTop: 2 },
  subtitle: { fontSize: 17, lineHeight: 24, marginTop: 6 },
  rule: { height: 1, marginVertical: 18, opacity: 0.7 },
  sectionEyebrow: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  excerptCard: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  excerptText: { fontSize: 17, lineHeight: 28 },
  readMoreRow: { alignSelf: "flex-start" },
  readMoreLabel: { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" },
  answerLog: {
    borderLeftWidth: 2,
    paddingLeft: 14,
    marginBottom: 16,
  },
  answerLogQ: { fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 3 },
  answerLogA: { fontSize: 16, lineHeight: 23 },
  promptCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 18,
    gap: 12,
    marginBottom: 4,
  },
  promptQ: { fontSize: 18, lineHeight: 27 },
  promptInput: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 72,
    textAlignVertical: "top",
  },
  nextBtn: {
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
  },
  nextBtnLabel: { fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
  promptCounter: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    textAlign: "right",
  },
  generateWrap: { gap: 14, marginBottom: 8 },
  generateIntro: { fontSize: 17, lineHeight: 26 },
  errorNote: { fontSize: 12, letterSpacing: 0.4 },
  generateBtn: {
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
  },
  generateBtnLabel: { fontSize: 13, letterSpacing: 1.4, textTransform: "uppercase" },
  generatingWrap: {
    paddingVertical: 32,
    alignItems: "center",
  },
  generatingText: { fontSize: 17, lineHeight: 26 },
  storyCard: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  storyPara: { fontSize: 18, lineHeight: 30 },
  markIntro: { fontSize: 16, lineHeight: 24, marginBottom: 14 },
  markBtn: {
    borderRadius: 4,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  markBtnLabel: { fontSize: 13, letterSpacing: 1.4, textTransform: "uppercase" },
  markedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  markedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  markedPillLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  unmarkBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  unmarkLabel: { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" },
  nextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 4,
  },
  navBtn: { flex: 1 },
  navBtnRight: { alignItems: "flex-end" },
  navHint: { fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 2 },
  navName: { fontSize: 14, lineHeight: 20 },
  navNameRight: { textAlign: "right" },
});

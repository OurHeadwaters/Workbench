// Youth Odyssey station screen.
//
// Flow:
//   READ   — full tale from the Codetry book (collapsible inline)
//   DO     — sequential prompts, one at a time, with a log of completed answers
//   STORY  — AI-generated story using the collected answers
//   MARK   — mark done to unlock the next station
//   MEMORY — trail note + photo, always editable (local-only until XRPL DID)

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
  Image,
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
import { TALES, type TaleBlock } from "@/data/tales";
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

type ScreenPhase = "tale" | "prompts" | "generating" | "story" | "done";

// Render TaleBlock[] inline (no outer ScrollView wrapper)
function TaleBlocks({
  blocks,
  colors,
}: {
  blocks: TaleBlock[];
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === "break") {
          return (
            <View key={i} style={taleStyles.breakRow}>
              <View style={[taleStyles.ornament, { backgroundColor: colors.rule }]} />
            </View>
          );
        }
        if (block.kind === "para") {
          return (
            <Text key={i} style={[taleStyles.para, { color: colors.foreground, fontFamily: SERIF }]}>
              {block.text}
            </Text>
          );
        }
        if (block.kind === "italic") {
          return (
            <Text key={i} style={[taleStyles.italic, { color: colors.foreground, fontFamily: SERIF_ITALIC }]}>
              {block.text}
            </Text>
          );
        }
        return null;
      })}
    </>
  );
}

const taleStyles = StyleSheet.create({
  para: { fontSize: 17, lineHeight: 28, marginBottom: 18 },
  italic: { fontSize: 17, lineHeight: 28, marginBottom: 18, paddingLeft: 6 },
  breakRow: { alignItems: "center", marginVertical: 24 },
  ornament: { width: 28, height: 1, opacity: 0.45 },
});

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
    getTrailMemory,
    saveNote,
    savePhoto,
    clearPhoto,
  } = useYouthPath();

  const station = useMemo(() => getYouthStation(id), [id]);
  const { prev, next } = useMemo(() => getYouthNeighbors(id), [id]);
  const completed = station ? isCompleted(station.id) : false;
  const unlocked = station ? isUnlocked(station.id) : false;

  const track = (ageTrack ?? "tween") as AgeTrack;
  const prompts = station?.prompts[track] ?? [];
  const storyInstruction = station?.storyInstruction[track] ?? "";

  // Find the source tale
  const tale = useMemo(
    () => station ? TALES.find((t) => t.id === station.sourceTaleId) ?? null : null,
    [station],
  );

  const storedAnswers = station ? getAnswers(station.id) : {};
  const storedStory = station ? getStory(station.id) : undefined;
  const storedMemory = station ? getTrailMemory(station.id) : {};

  const firstUnanswered = prompts.findIndex(
    (p) => !storedAnswers[p.id] || storedAnswers[p.id].trim() === "",
  );
  const allAnswered = firstUnanswered === -1;

  const [currentPromptIdx, setCurrentPromptIdx] = useState(
    allAnswered ? prompts.length : Math.max(0, firstUnanswered),
  );
  const [currentInput, setCurrentInput] = useState("");
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>(storedAnswers);
  const hasStarted = Object.keys(storedAnswers).length > 0 || !!storedStory;
  const [phase, setPhase] = useState<ScreenPhase>(
    completed || (allAnswered && storedStory) ? "story" :
    hasStarted ? "prompts" : "tale",
  );
  const [localStory, setLocalStory] = useState<string | null>(storedStory ?? null);
  const [generating, setGenerating] = useState(false);
  const [generating_error, setGeneratingError] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const celebrateTargetRef = useRef<string | null>(null);

  const inputRef = useRef<TextInput>(null);

  // Tale expansion state
  const [taleExpanded, setTaleExpanded] = useState(false);

  // Trail memory state (note + photo)
  const [localNote, setLocalNote] = useState(storedMemory.note ?? "");
  const [localPhotoUri, setLocalPhotoUri] = useState(storedMemory.photoUri ?? "");
  const noteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    } else if (Object.keys(answers).length > 0) {
      setPhase("prompts");
    }
    const mem = getTrailMemory(station.id);
    setLocalNote(mem.note ?? "");
    setLocalPhotoUri(mem.photoUri ?? "");
  }, [ready, station, prompts, getAnswers, getStory, isCompleted, getTrailMemory]);

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

  // Note autosave (debounced)
  const onNoteChange = useCallback(
    (text: string) => {
      setLocalNote(text);
      if (!station) return;
      if (noteDebounceRef.current) clearTimeout(noteDebounceRef.current);
      noteDebounceRef.current = setTimeout(() => {
        saveNote(station.id, text);
      }, 800);
    },
    [station, saveNote],
  );

  // Photo picker
  const handlePickPhoto = useCallback(async () => {
    if (!station) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.75,
      });
      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setLocalPhotoUri(uri);
        savePhoto(station.id, uri);
      }
    } catch {
      // Permission denied or cancelled — silent
    }
  }, [station, savePhoto]);

  const handleClearPhoto = useCallback(() => {
    if (!station) return;
    setLocalPhotoUri("");
    clearPhoto(station.id);
  }, [station, clearPhoto]);

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
        {/* Nav row */}
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

        {/* ── TALE PHASE: full reading experience, gates the writing ─────── */}
        {phase === "tale" ? (
          <>
            <Text style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
              FROM THE CODETRY BOOK
            </Text>
            {tale ? (
              <View style={[styles.taleCard, { backgroundColor: c.card, borderColor: c.rule }]}>
                <Text style={[styles.taleBookLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                  CHILDREN'S TALE
                </Text>
                <Text style={[styles.taleTitleInline, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                  {tale.title}
                </Text>
                <Text style={[styles.taleSubtitleInline, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                  {tale.subtitle}
                </Text>
                <View style={[styles.taleRule, { backgroundColor: c.rule }]} />
                <TaleBlocks blocks={tale.body} colors={c} />
                {tale.authorNote ? (
                  <>
                    <View style={[styles.taleRule, { backgroundColor: c.rule, marginTop: 8, marginBottom: 20 }]} />
                    <Text style={[styles.authorNote, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                      {tale.authorNote}
                    </Text>
                  </>
                ) : null}
              </View>
            ) : (
              <View style={[styles.excerptCard, { backgroundColor: c.card, borderColor: c.rule }]}>
                <Text style={[styles.excerptText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                  {station.taleExcerpt}
                </Text>
              </View>
            )}
            <Pressable
              onPress={() => setPhase("prompts")}
              style={({ pressed }) => [
                styles.generateBtn,
                { backgroundColor: c.foreground, opacity: pressed ? 0.7 : 1, marginTop: 24 },
              ]}
            >
              <Text style={[styles.generateBtnLabel, { color: c.background, fontFamily: MONO }]}>
                Now write yours →
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            {/* Compact tale reference once writing has begun */}
            <Text style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
              THE STORY YOU READ
            </Text>
            <View style={[styles.excerptCard, { backgroundColor: c.card, borderColor: c.rule }]}>
              {tale ? (
                <Text style={[styles.taleTitleInline, { color: c.foreground, fontFamily: SERIF_BOLD, marginBottom: 6 }]}>
                  {tale.title}
                </Text>
              ) : null}
              <Text style={[styles.excerptText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                {station.taleExcerpt}
              </Text>
              {tale ? (
                <>
                  <Pressable
                    onPress={() => setTaleExpanded((v) => !v)}
                    style={({ pressed }) => [styles.expandBtn, { opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Text style={[styles.expandLabel, { color: c.foreground, fontFamily: MONO }]}>
                      {taleExpanded ? "Close ↑" : "Read it again ↓"}
                    </Text>
                  </Pressable>
                  {taleExpanded ? (
                    <View style={{ marginTop: 12 }}>
                      <TaleBlocks blocks={tale.body} colors={c} />
                    </View>
                  ) : null}
                </>
              ) : null}
            </View>
            <View style={[styles.rule, { backgroundColor: c.rule }]} />
          </>
        )}

        {/* ── WRITE PROMPTS ─────────────────────────────────────────────── */}
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

        {/* ── YOUR STORY ────────────────────────────────────────────────── */}
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

        {/* ── TRAIL MEMORY ──────────────────────────────────────────────── */}
        {/* Always shown once a station is unlocked — photo + note live here.  */}
        {/* Local-only now. Extension point for XRPL DID shared layer later.  */}
        <View style={[styles.rule, { backgroundColor: c.rule, marginTop: 28 }]} />
        <Text style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          YOUR TRAIL MEMORY
        </Text>
        <Text style={[styles.memoryHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          Leave a note or photo from this spot. Stays on your device for now.
        </Text>

        {/* Photo display */}
        {localPhotoUri ? (
          <View style={styles.photoWrap}>
            <Image
              source={{ uri: localPhotoUri }}
              style={styles.trailPhoto}
              resizeMode="cover"
            />
            <Pressable
              onPress={handleClearPhoto}
              style={({ pressed }) => [styles.clearPhotoBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.clearPhotoLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                Remove photo
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Photo picker button */}
        <Pressable
          onPress={handlePickPhoto}
          style={({ pressed }) => [
            styles.photoBtn,
            {
              borderColor: c.rule,
              backgroundColor: c.card,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name={localPhotoUri ? "camera-outline" : "camera-outline"} size={16} color={c.foreground} />
          <Text style={[styles.photoBtnLabel, { color: c.foreground, fontFamily: MONO }]}>
            {localPhotoUri ? "Change photo" : "Add a photo from here"}
          </Text>
        </Pressable>

        {/* Note input */}
        <TextInput
          value={localNote}
          onChangeText={onNoteChange}
          placeholder="What stayed with you at this station?"
          placeholderTextColor={c.mutedForeground}
          style={[
            styles.noteInput,
            {
              color: c.foreground,
              borderColor: c.rule,
              backgroundColor: c.card,
              fontFamily: SERIF_ITALIC,
            },
          ]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* ── NAVIGATION ────────────────────────────────────────────────── */}
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
  lockedBody: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 28,
    marginTop: 8,
  },
  lockedBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  lockedBtnLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  backLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
  },
  rule: {
    height: 1,
    marginVertical: 28,
    opacity: 0.4,
  },
  sectionEyebrow: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  // Tale card
  taleCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    padding: 20,
    marginBottom: 4,
  },
  taleBookLabel: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 10,
    opacity: 0.7,
  },
  taleTitleInline: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 4,
  },
  taleSubtitleInline: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 0,
    opacity: 0.8,
  },
  taleRule: {
    height: 1,
    width: 36,
    marginTop: 16,
    marginBottom: 20,
    opacity: 0.4,
  },
  authorNote: {
    fontSize: 14,
    lineHeight: 22,
  },
  expandBtn: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128,128,128,0.2)",
    alignItems: "center",
  },
  expandLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  // Fallback excerpt
  excerptCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    padding: 20,
  },
  excerptText: {
    fontSize: 17,
    lineHeight: 28,
  },
  // Prompts
  answerLog: {
    borderLeftWidth: 2,
    paddingLeft: 14,
    marginBottom: 20,
  },
  answerLogQ: {
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  answerLogA: {
    fontSize: 16,
    lineHeight: 24,
  },
  generateWrap: { marginTop: 8 },
  generateIntro: { fontSize: 17, lineHeight: 26, marginBottom: 20 },
  errorNote: {
    fontSize: 13,
    letterSpacing: 0.6,
    marginBottom: 12,
    opacity: 0.8,
  },
  generateBtn: {
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  generateBtnLabel: {
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  promptCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 18,
  },
  promptQ: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 14,
  },
  promptInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 72,
  },
  nextBtn: {
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  nextBtnLabel: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  promptCounter: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    textAlign: "right",
    marginTop: 8,
  },
  generatingWrap: { paddingVertical: 20, alignItems: "center" },
  generatingText: { fontSize: 16, lineHeight: 24 },
  // Story
  storyCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    padding: 20,
    marginBottom: 4,
  },
  storyPara: { fontSize: 17, lineHeight: 28 },
  // Mark done
  markIntro: { fontSize: 16, lineHeight: 24, marginBottom: 18 },
  markBtn: {
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  markBtnLabel: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  markedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
  },
  markedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  markedPillLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  unmarkBtn: { padding: 4 },
  unmarkLabel: { fontSize: 11, letterSpacing: 1, textTransform: "uppercase" },
  // Trail memory
  memoryHint: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  photoWrap: {
    marginBottom: 12,
  },
  trailPhoto: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  clearPhotoBtn: {
    alignSelf: "flex-end",
  },
  clearPhotoLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  photoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    alignSelf: "flex-start",
  },
  photoBtnLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  noteInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 26,
    minHeight: 100,
  },
  // Navigation
  nextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  navBtn: { flex: 1, maxWidth: "45%" },
  navBtnRight: { alignItems: "flex-end" },
  navHint: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  navName: {
    fontSize: 15,
    lineHeight: 20,
  },
  navNameRight: { textAlign: "right" },
});

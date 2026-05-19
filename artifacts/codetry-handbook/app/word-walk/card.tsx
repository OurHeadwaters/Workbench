// Word Walk — card screen.
//
// Presents a single rename-map row as a full-screen coloured card:
//   G = amber, U = indigo, D = rose, A = teal, none = slate.
// Three large buttons record the founder's decision and slide to the next word.
// After today's quota (or all undecided words), shows a daily summary card.

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

import { useColors } from "@/hooks/useColors";
import { useWordWalk, type DriftSymbol, type Verdict, type WordRow } from "@/hooks/useWordWalk";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

// Drift-type → background colour for the coloured block.
// Light-mode colours that read well at large scale.
const DRIFT_COLORS: Record<DriftSymbol, string> = {
  G: "#d97706", // amber-600
  U: "#4338ca", // indigo-700
  D: "#e11d48", // rose-600
  A: "#0d9488", // teal-600
};
const NO_DRIFT_COLOR = "#475569"; // slate-600

function blockColorForRow(row: WordRow): string {
  if (row.drift.length === 0) return NO_DRIFT_COLOR;
  return DRIFT_COLORS[row.drift[0]];
}

function driftLabel(drift: DriftSymbol[]): string {
  if (drift.length === 0) return "No drift";
  const labels: Record<DriftSymbol, string> = {
    G: "Generic",
    U: "UI-framework leak",
    D: "Duplicate metaphor",
    A: "Abbreviation",
  };
  return drift.map((d) => `${d} — ${labels[d]}`).join(" · ");
}

// Strip markdown bold/code/italic markers for display.
function stripMarkdown(text: string): string {
  return text.replace(/\*\*/g, "").replace(/`/g, "").replace(/\*/g, "");
}

export default function WordWalkCard() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const params = useLocalSearchParams<{ rowId?: string }>();
  const { rows, todayDecided, todayQueue, allDone, decide, counts } = useWordWalk();

  // Build the ordered list of words for this session.
  // Start from the rowId param, then continue with the remaining undecided queue.
  const [sessionWords, setSessionWords] = useState<WordRow[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionDecisions, setSessionDecisions] = useState<
    Array<{ row: WordRow; verdict: Verdict; chosenWord?: string }>
  >([]);
  const [effectsExpanded, setEffectsExpanded] = useState(false);
  const [deciding, setDeciding] = useState(false);
  const [chosenWord, setChosenWord] = useState("");
  const sessionInitialized = useRef(false);

  // Slide animation
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (sessionInitialized.current || rows.length === 0) return;
    sessionInitialized.current = true;

    const startId = params.rowId ? Number(params.rowId) : undefined;
    const decidedIds = new Set(todayDecided.map((d) => d.rowId));

    let words: WordRow[];
    if (startId) {
      const startRow = rows.find((r) => r.id === startId && r.status === "proposed");
      const rest = rows.filter(
        (r) => r.id !== startId && r.status === "proposed" && !decidedIds.has(r.id),
      );
      words = startRow ? [startRow, ...rest] : rest;
    } else {
      words = rows.filter((r) => r.status === "proposed" && !decidedIds.has(r.id));
    }

    if (words.length === 0) {
      setShowSummary(true);
    } else {
      setSessionWords(words);
    }
  }, [rows, params.rowId, todayDecided]);

  const animateOut = useCallback(
    (onDone: () => void) => {
      slideAnim.setValue(0);
      Animated.timing(slideAnim, {
        toValue: -60,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        slideAnim.setValue(60);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }).start(onDone);
      });
    },
    [slideAnim],
  );

  const handleDecide = useCallback(
    async (verdict: Verdict) => {
      if (deciding) return;
      const row = sessionWords[currentIdx];
      if (!row) return;
      setDeciding(true);

      const word = chosenWord.trim() || undefined;
      const newDecisions = [...sessionDecisions, { row, verdict, chosenWord: word }];

      animateOut(async () => {
        setEffectsExpanded(false);
        setChosenWord("");
        setSessionDecisions(newDecisions);
        await decide(row.id, verdict);
        setDeciding(false);

        const nextIdx = currentIdx + 1;
        if (nextIdx >= sessionWords.length) {
          setShowSummary(true);
        } else {
          setCurrentIdx(nextIdx);
        }
      });
    },
    [deciding, sessionWords, currentIdx, sessionDecisions, animateOut, decide],
  );

  const currentRow = sessionWords[currentIdx];
  const blockColor = currentRow ? blockColorForRow(currentRow) : NO_DRIFT_COLOR;

  if (showSummary || (!currentRow && sessionWords.length === 0 && !deciding)) {
    return (
      <SummaryScreen
        c={c}
        insets={insets}
        webTop={webTop}
        webBottom={webBottom}
        decisions={sessionDecisions}
        allDone={allDone}
        counts={counts}
      />
    );
  }

  if (!currentRow) {
    return <View style={[styles.root, { backgroundColor: c.background }]} />;
  }

  const progress = `${currentIdx + 1} of ${sessionWords.length}`;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 16,
            paddingBottom: Math.max(insets.bottom, webBottom) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Back"
            hitSlop={12}
          >
            <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
              ← Back
            </Text>
          </Pressable>
          <Text style={[styles.progressPill, { color: c.mutedForeground, fontFamily: MONO }]}>
            {progress}
          </Text>
        </View>

        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          {/* Coloured block with term */}
          <View style={[styles.colorBlock, { backgroundColor: blockColor }]}>
            <Text style={[styles.rowNum, { color: "rgba(255,255,255,0.6)", fontFamily: MONO }]}>
              #{currentRow.id}
            </Text>
            <Text
              style={[styles.termText, { color: "#ffffff", fontFamily: SERIF_BOLD }]}
              numberOfLines={4}
              adjustsFontSizeToFit
            >
              {stripMarkdown(currentRow.term)}
            </Text>
            {currentRow.drift.length > 0 && (
              <Text style={[styles.driftBadge, { color: "rgba(255,255,255,0.75)", fontFamily: MONO }]}>
                {driftLabel(currentRow.drift)}
              </Text>
            )}
          </View>

          {/* Card body */}
          <View style={[styles.cardBody, { borderColor: c.rule }]}>
            {/* Proposed replacement */}
            <View style={styles.fieldBlock}>
              <Text style={[styles.fieldLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                Proposed replacement
              </Text>
              <Text style={[styles.fieldValue, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                {stripMarkdown(currentRow.proposedReplacement)}
              </Text>
            </View>

            <View style={[styles.fieldDivider, { backgroundColor: c.rule }]} />

            {/* Where it appears */}
            <View style={styles.fieldBlock}>
              <Text style={[styles.fieldLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                Where it appears
              </Text>
              <Text style={[styles.fieldValue, { color: c.foreground, fontFamily: SERIF }]}>
                {stripMarkdown(currentRow.whereItAppears)}
              </Text>
            </View>

            {/* Second-order effects — collapsible */}
            {currentRow.secondOrderEffects ? (
              <>
                <View style={[styles.fieldDivider, { backgroundColor: c.rule }]} />
                <Pressable
                  onPress={() => setEffectsExpanded((v) => !v)}
                  style={styles.effectsToggle}
                >
                  <Text
                    style={[styles.fieldLabel, { color: c.mutedForeground, fontFamily: MONO }]}
                  >
                    Second-order effects
                  </Text>
                  <Text style={[styles.effectsChevron, { color: c.mutedForeground, fontFamily: MONO }]}>
                    {effectsExpanded ? "▲" : "▼"}
                  </Text>
                </Pressable>
                {effectsExpanded && (
                  <Text
                    style={[styles.effectsText, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}
                  >
                    {stripMarkdown(currentRow.secondOrderEffects)}
                  </Text>
                )}
              </>
            ) : null}
          </View>

          {/* Chosen word input */}
          <View style={styles.chosenWordBlock}>
            <Text style={[styles.fieldLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              Your word (optional)
            </Text>
            <TextInput
              value={chosenWord}
              onChangeText={setChosenWord}
              placeholder="Type the word you landed on…"
              placeholderTextColor={c.mutedForeground}
              style={[
                styles.chosenWordInput,
                { color: c.foreground, borderColor: c.rule, fontFamily: SERIF, backgroundColor: c.background },
              ]}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="done"
              editable={!deciding}
            />
          </View>

          {/* Decision buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => handleDecide("approved")}
              disabled={deciding}
              style={({ pressed }) => [
                styles.decideBtn,
                {
                  backgroundColor: "#166534",
                  opacity: pressed || deciding ? 0.7 : 1,
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.decideBtnText, { color: "#ffffff", fontFamily: MONO }]}>
                Approve
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleDecide("deferred")}
              disabled={deciding}
              style={({ pressed }) => [
                styles.decideBtn,
                {
                  backgroundColor: "#1e3a5f",
                  opacity: pressed || deciding ? 0.7 : 1,
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.decideBtnText, { color: "#ffffff", fontFamily: MONO }]}>
                Defer
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleDecide("rejected")}
              disabled={deciding}
              style={({ pressed }) => [
                styles.decideBtn,
                {
                  backgroundColor: "#7f1d1d",
                  opacity: pressed || deciding ? 0.7 : 1,
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.decideBtnText, { color: "#ffffff", fontFamily: MONO }]}>
                Reject
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function SummaryScreen({
  c,
  insets,
  webTop,
  webBottom,
  decisions,
  allDone,
  counts,
}: {
  c: ReturnType<typeof useColors>;
  insets: { top: number; bottom: number };
  webTop: number;
  webBottom: number;
  decisions: Array<{ row: WordRow; verdict: Verdict; chosenWord?: string }>;
  allDone: boolean;
  counts: { approved: number; rejected: number; deferred: number; proposed: number; applied: number };
}) {
  const verdictColor: Record<Verdict, string> = {
    approved: "#166534",
    rejected: "#7f1d1d",
    deferred: "#1e3a5f",
  };

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
        <Text style={[styles.summaryEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          {allDone ? "ALL DONE" : "SESSION COMPLETE"}
        </Text>
        <Text style={[styles.summaryTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {allDone
            ? "Every word has a decision."
            : decisions.length === 0
            ? "No decisions this session."
            : `${decisions.length} word${decisions.length === 1 ? "" : "s"} decided.`}
        </Text>

        {decisions.length > 0 && (
          <>
            <View style={{ height: 24 }} />
            <Text style={[styles.sectionLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              TODAY'S VERDICTS
            </Text>
            {decisions.map(({ row, verdict, chosenWord }) => (
              <View
                key={row.id}
                style={[styles.summaryRow, { borderBottomColor: c.rule }]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.summaryTerm, { color: c.foreground, fontFamily: SERIF_BOLD }]}
                    numberOfLines={1}
                  >
                    #{row.id} · {stripMarkdown(row.term).slice(0, 40)}
                  </Text>
                  {chosenWord ? (
                    <Text style={[styles.summaryChosen, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                      → {chosenWord}
                    </Text>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.summaryVerdict,
                    { color: verdictColor[verdict], fontFamily: MONO },
                  ]}
                >
                  {verdict}
                </Text>
              </View>
            ))}
          </>
        )}

        {!allDone && (
          <>
            <View style={{ height: 8 }} />
            <Text style={[styles.remainingNote, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              {counts.proposed} word{counts.proposed === 1 ? "" : "s"} still waiting. Come back tomorrow for the next five.
            </Text>
          </>
        )}

        <View style={{ height: 32 }} />
        <Pressable
          onPress={() => router.replace("/word-walk")}
          style={({ pressed }) => [
            styles.doneBtn,
            { backgroundColor: c.rust, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.doneBtnText, { color: c.primaryForeground, fontFamily: MONO }]}>
            Back to Word Walk
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  progressPill: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  colorBlock: {
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginBottom: 0,
  },
  rowNum: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  termText: {
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.5,
    minHeight: 42,
  },
  driftBadge: {
    marginTop: 14,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardBody: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  fieldBlock: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  fieldLabel: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  fieldDivider: { height: 1 },
  effectsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  effectsChevron: {
    fontSize: 10,
  },
  effectsText: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  chosenWordBlock: {
    marginBottom: 14,
  },
  chosenWordInput: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  decideBtn: {
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  decideBtnText: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  summaryEyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  summaryTitle: { fontSize: 28, lineHeight: 34 },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  summaryTerm: {
    fontSize: 15,
    lineHeight: 20,
    flex: 1,
  },
  summaryChosen: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  summaryVerdict: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  remainingNote: { fontSize: 15, lineHeight: 23 },
  doneBtn: {
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: "center",
  },
  doneBtnText: {
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});

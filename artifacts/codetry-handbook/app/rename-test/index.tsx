import { router } from "expo-router";
import React, { useState } from "react";
import {
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
  RenameAlternative,
  RenameVerdict,
  useRenameTest,
} from "@/hooks/useRenameTest";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

type Phase = "log" | "name" | "alternatives" | "verdict";

const VERDICT_OPTIONS: {
  value: RenameVerdict;
  label: string;
  description: string;
}[] = [
  {
    value: "load-bearing",
    label: "Load-bearing",
    description:
      "Something specific is lost when renamed. The name is doing structural work.",
  },
  {
    value: "decorative",
    label: "Decorative",
    description:
      "Nothing essential changes when renamed. The name is a label, not a load.",
  },
  {
    value: "unclear",
    label: "Still unclear",
    description:
      "The test was inconclusive. Try again with a sharper alternative.",
  },
];

export default function RenameTestScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;
  const { ready, tests, addTest, deleteTest } = useRenameTest();

  const [phase, setPhase] = useState<Phase>("log");
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [alternatives, setAlternatives] = useState<RenameAlternative[]>([
    { text: "", whatWasLost: "" },
  ]);
  const [verdict, setVerdict] = useState<RenameVerdict | null>(null);
  const [saving, setSaving] = useState(false);

  function resetDraft() {
    setDraftName("");
    setDraftDescription("");
    setAlternatives([{ text: "", whatWasLost: "" }]);
    setVerdict(null);
    setPhase("log");
  }

  function addAlternative() {
    if (alternatives.length < 3) {
      setAlternatives([...alternatives, { text: "", whatWasLost: "" }]);
    }
  }

  function updateAlternative(
    index: number,
    field: keyof RenameAlternative,
    value: string,
  ) {
    setAlternatives(
      alternatives.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    );
  }

  async function handleSave() {
    if (!verdict) return;
    setSaving(true);
    await addTest({
      name: draftName.trim(),
      description: draftDescription.trim(),
      alternatives: alternatives.filter((a) => a.text.trim().length > 0),
      verdict,
    });
    setSaving(false);
    resetDraft();
  }

  const canAdvanceFromName =
    draftName.trim().length > 0 && draftDescription.trim().length > 0;
  const canAdvanceFromAlternatives = alternatives.some(
    (a) => a.text.trim().length > 0,
  );

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const RUST = "#b85a3e";

  const verdictColor = (v: RenameVerdict) => {
    if (v === "load-bearing") return c.foreground;
    if (v === "decorative") return c.mutedForeground;
    return RUST;
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 20,
            paddingBottom: Math.max(insets.bottom, webBottom) + 40,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable
          onPress={() => {
            if (phase !== "log") {
              resetDraft();
            } else {
              router.back();
            }
          }}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.backText, { color: c.mutedForeground, fontFamily: MONO }]}>
            {phase !== "log" ? "← Cancel test" : "← Back"}
          </Text>
        </Pressable>

        {/* Header */}
        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          RENAME TEST
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          Does this name carry weight?
        </Text>
        <Text style={[styles.subtitle, { color: c.pullQuote, fontFamily: SERIF_ITALIC }]}>
          Try to rename it. If the rename costs nothing — if what it named still stands — the word was decoration. If the rename takes something structural with it, the word is load-bearing.
        </Text>
        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {/* ── PHASE: LOG ── */}
        {phase === "log" && (
          <>
            <Pressable
              onPress={() => setPhase("name")}
              style={({ pressed }) => [
                styles.beginBtn,
                { backgroundColor: c.rust, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={[styles.beginBtnText, { color: c.primaryForeground, fontFamily: MONO }]}>
                Begin a new test →
              </Text>
            </Pressable>

            {ready && tests.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                  PAST TESTS
                </Text>
                {tests.map((t) => (
                  <View
                    key={t.id}
                    style={[
                      styles.pastCard,
                      { borderColor: c.rule, backgroundColor: c.card },
                    ]}
                  >
                    <View style={styles.pastCardTop}>
                      <Text style={[styles.pastName, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                        {t.name}
                      </Text>
                      <View
                        style={[
                          styles.verdictBadge,
                          { borderColor: verdictColor(t.verdict) },
                        ]}
                      >
                        <Text
                          style={[
                            styles.verdictBadgeText,
                            { color: verdictColor(t.verdict), fontFamily: MONO },
                          ]}
                        >
                          {t.verdict}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.pastDesc, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                      {t.description}
                    </Text>
                    {t.alternatives.length > 0 && (
                      <View style={styles.altsList}>
                        {t.alternatives.map((a, i) => (
                          <View key={i} style={styles.altRow}>
                            <Text style={[styles.altLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                              Tried:
                            </Text>
                            <Text style={[styles.altText, { color: c.foreground, fontFamily: SERIF }]}>
                              {a.text}
                              {a.whatWasLost ? ` — "${a.whatWasLost}"` : ""}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={styles.pastCardFoot}>
                      <Text style={[styles.pastDate, { color: c.mutedForeground, fontFamily: MONO }]}>
                        {formatDate(t.savedAt)}
                      </Text>
                      <Pressable
                        onPress={() => deleteTest(t.id)}
                        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                      >
                        <Text style={[styles.deleteText, { color: c.mutedForeground, fontFamily: MONO }]}>
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </>
            )}

            {ready && tests.length === 0 && (
              <Text style={[styles.emptyText, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                No tests saved yet. Bring a name from your practice and run the test.
              </Text>
            )}
          </>
        )}

        {/* ── PHASE: NAME ── */}
        {phase === "name" && (
          <>
            <Text style={[styles.stepLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              STEP 1 OF 3 · THE NAME
            </Text>
            <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO }]}>
              What name are you testing?
            </Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="e.g. Jarista"
              placeholderTextColor={c.mutedForeground}
              style={[
                styles.input,
                {
                  borderColor: draftName ? c.rust : c.border,
                  color: c.foreground,
                  fontFamily: SERIF_BOLD,
                  backgroundColor: c.card,
                },
              ]}
              autoFocus
            />
            <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO, marginTop: 20 }]}>
              What does it belong to?
            </Text>
            <Text style={[styles.fieldHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              One sentence — what system, role, or thing this name holds.
            </Text>
            <TextInput
              value={draftDescription}
              onChangeText={setDraftDescription}
              placeholder="e.g. The practitioner who runs a jar-centred household food system"
              placeholderTextColor={c.mutedForeground}
              multiline
              style={[
                styles.inputMulti,
                {
                  borderColor: draftDescription ? c.rust : c.border,
                  color: c.foreground,
                  fontFamily: SERIF,
                  backgroundColor: c.card,
                },
              ]}
            />
            <Pressable
              onPress={() => canAdvanceFromName && setPhase("alternatives")}
              style={({ pressed }) => [
                styles.nextBtn,
                {
                  backgroundColor: canAdvanceFromName ? c.rust : c.muted,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.nextBtnText, { color: c.primaryForeground, fontFamily: MONO }]}>
                Next: try renaming it →
              </Text>
            </Pressable>
          </>
        )}

        {/* ── PHASE: ALTERNATIVES ── */}
        {phase === "alternatives" && (
          <>
            <Text style={[styles.stepLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              STEP 2 OF 3 · THE ALTERNATIVES
            </Text>
            <Text style={[styles.testingLabel, { color: c.pullQuote, fontFamily: SERIF_ITALIC }]}>
              Testing: <Text style={{ color: c.foreground, fontFamily: SERIF_BOLD }}>{draftName}</Text>
            </Text>
            <Text style={[styles.fieldHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC, marginBottom: 20 }]}>
              What would you call it instead? For each alternative, note what would be lost by using it.
            </Text>

            {alternatives.map((alt, i) => (
              <View key={i} style={styles.altBlock}>
                <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO }]}>
                  {`Alternative ${i + 1}`}
                </Text>
                <TextInput
                  value={alt.text}
                  onChangeText={(v) => updateAlternative(i, "text", v)}
                  placeholder={i === 0 ? "e.g. Food Preservationist" : "Another name to try"}
                  placeholderTextColor={c.mutedForeground}
                  style={[
                    styles.input,
                    {
                      borderColor: alt.text ? c.rust : c.border,
                      color: c.foreground,
                      fontFamily: SERIF_BOLD,
                      backgroundColor: c.card,
                    },
                  ]}
                />
                <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO, marginTop: 10 }]}>
                  What would be lost?
                </Text>
                <TextInput
                  value={alt.whatWasLost}
                  onChangeText={(v) => updateAlternative(i, "whatWasLost", v)}
                  placeholder="What does the system lose when this name replaces the original?"
                  placeholderTextColor={c.mutedForeground}
                  multiline
                  style={[
                    styles.inputMulti,
                    {
                      borderColor: alt.whatWasLost ? c.rust : c.border,
                      color: c.foreground,
                      fontFamily: SERIF,
                      backgroundColor: c.card,
                    },
                  ]}
                />
              </View>
            ))}

            {alternatives.length < 3 && (
              <Pressable
                onPress={addAlternative}
                style={({ pressed }) => [styles.addAltBtn, { borderColor: c.rule, opacity: pressed ? 0.6 : 1 }]}
              >
                <Text style={[styles.addAltText, { color: c.mutedForeground, fontFamily: MONO }]}>
                  + Add another alternative
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => canAdvanceFromAlternatives && setPhase("verdict")}
              style={({ pressed }) => [
                styles.nextBtn,
                {
                  backgroundColor: canAdvanceFromAlternatives ? c.rust : c.muted,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.nextBtnText, { color: c.primaryForeground, fontFamily: MONO }]}>
                Next: deliver the verdict →
              </Text>
            </Pressable>
          </>
        )}

        {/* ── PHASE: VERDICT ── */}
        {phase === "verdict" && (
          <>
            <Text style={[styles.stepLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              STEP 3 OF 3 · THE VERDICT
            </Text>
            <Text style={[styles.testingLabel, { color: c.pullQuote, fontFamily: SERIF_ITALIC }]}>
              Testing: <Text style={{ color: c.foreground, fontFamily: SERIF_BOLD }}>{draftName}</Text>
            </Text>
            <Text style={[styles.fieldHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC, marginBottom: 24 }]}>
              Alternatives tried. What is the finding?
            </Text>

            {VERDICT_OPTIONS.map((opt) => {
              const selected = verdict === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setVerdict(opt.value)}
                  style={({ pressed }) => [
                    styles.verdictOption,
                    {
                      borderColor: selected ? verdictColor(opt.value) : c.rule,
                      backgroundColor: selected
                        ? `${verdictColor(opt.value)}12`
                        : c.card,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <View style={[styles.radio, { borderColor: selected ? verdictColor(opt.value) : c.muted }]}>
                    {selected && (
                      <View style={[styles.radioDot, { backgroundColor: verdictColor(opt.value) }]} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.verdictLabel, { color: verdictColor(opt.value), fontFamily: MONO }]}>
                      {opt.label}
                    </Text>
                    <Text style={[styles.verdictDesc, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                      {opt.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => !saving && verdict && handleSave()}
              style={({ pressed }) => [
                styles.nextBtn,
                {
                  backgroundColor: verdict ? c.rust : c.muted,
                  opacity: pressed ? 0.85 : 1,
                  marginTop: 28,
                },
              ]}
            >
              <Text style={[styles.nextBtnText, { color: c.primaryForeground, fontFamily: MONO }]}>
                {saving ? "Saving…" : "Save the test →"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 28 },
  backBtn: { marginBottom: 24 },
  backText: { fontSize: 12, letterSpacing: 1 },
  eyebrow: { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 },
  title: { fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, lineHeight: 25, marginTop: 10 },
  rule: { height: 1, width: 48, marginTop: 24, marginBottom: 28, opacity: 0.6 },
  beginBtn: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    borderRadius: 4,
    marginBottom: 36,
  },
  beginBtnText: { fontSize: 13, letterSpacing: 1, textTransform: "uppercase" },
  sectionLabel: { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 },
  pastCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
  },
  pastCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  pastName: { fontSize: 20, flex: 1, marginRight: 12 },
  verdictBadge: { borderWidth: 1, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 3 },
  verdictBadgeText: { fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  pastDesc: { fontSize: 14, lineHeight: 22, marginBottom: 10 },
  altsList: { gap: 4, marginBottom: 10 },
  altRow: { flexDirection: "row", gap: 8 },
  altLabel: { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", paddingTop: 2 },
  altText: { fontSize: 13, lineHeight: 20, flex: 1 },
  pastCardFoot: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  pastDate: { fontSize: 11, letterSpacing: 0.5 },
  deleteText: { fontSize: 11, letterSpacing: 0.5, textDecorationLine: "underline" },
  emptyText: { fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: 20 },
  stepLabel: { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 },
  testingLabel: { fontSize: 17, lineHeight: 26, marginBottom: 4 },
  fieldLabel: { fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  fieldHint: { fontSize: 14, lineHeight: 22, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    lineHeight: 24,
  },
  inputMulti: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: "top",
  },
  nextBtn: {
    marginTop: 28,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    borderRadius: 4,
  },
  nextBtnText: { fontSize: 13, letterSpacing: 1, textTransform: "uppercase" },
  altBlock: { marginBottom: 20 },
  addAltBtn: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    marginTop: 4,
  },
  addAltText: { fontSize: 12, letterSpacing: 1 },
  verdictOption: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioDot: { width: 8, height: 8, borderRadius: 4 },
  verdictLabel: { fontSize: 13, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  verdictDesc: { fontSize: 14, lineHeight: 22 },
});

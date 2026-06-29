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
import { useRenameTest, type RenameVerdict } from "@/hooks/useRenameTest";

const SERIF = "Fraunces_400Regular";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

const VERDICTS: { value: RenameVerdict; label: string }[] = [
  { value: "load-bearing", label: "Load-bearing" },
  { value: "decorative", label: "Decorative" },
  { value: "unclear", label: "Unclear" },
];

export default function RenameTestScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;
  const { ready, tests, addTest, deleteTest } = useRenameTest();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [altText, setAltText] = useState("");
  const [altLost, setAltLost] = useState("");
  const [verdict, setVerdict] = useState<RenameVerdict>("unclear");
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(true);

  const canSave = name.trim().length > 0 && description.trim().length > 0;

  async function handleAdd() {
    if (!canSave) return;
    setSaving(true);
    await addTest({
      name: name.trim(),
      description: description.trim(),
      alternatives: altText.trim()
        ? [{ text: altText.trim(), whatWasLost: altLost.trim() }]
        : [],
      verdict,
    });
    setName("");
    setDescription("");
    setAltText("");
    setAltLost("");
    setVerdict("unclear");
    setSaving(false);
    setFormOpen(false);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

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
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.backText, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Back
          </Text>
        </Pressable>

        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          Rename Test
        </Text>
        <Text style={[styles.sub, { color: c.mutedForeground, fontFamily: MONO }]}>
          Is this name load-bearing or decoration?
        </Text>

        {formOpen ? (
          <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.label, { color: c.foreground, fontFamily: MONO }]}>Name</Text>
            <TextInput
              style={[styles.input, { color: c.foreground, borderColor: c.border, fontFamily: MONO }]}
              placeholder="The name you're testing"
              placeholderTextColor={c.mutedForeground}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: c.foreground, fontFamily: MONO }]}>
              What does this name do?
            </Text>
            <TextInput
              style={[styles.input, styles.multiline, { color: c.foreground, borderColor: c.border, fontFamily: MONO }]}
              placeholder="Describe the concept or thing it names"
              placeholderTextColor={c.mutedForeground}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.label, { color: c.foreground, fontFamily: MONO }]}>
              Alternative name tried
            </Text>
            <TextInput
              style={[styles.input, { color: c.foreground, borderColor: c.border, fontFamily: MONO }]}
              placeholder="What did you try instead?"
              placeholderTextColor={c.mutedForeground}
              value={altText}
              onChangeText={setAltText}
            />

            <Text style={[styles.label, { color: c.foreground, fontFamily: MONO }]}>
              What would be lost?
            </Text>
            <TextInput
              style={[styles.input, { color: c.foreground, borderColor: c.border, fontFamily: MONO }]}
              placeholder="If anything — leave blank if nothing"
              placeholderTextColor={c.mutedForeground}
              value={altLost}
              onChangeText={setAltLost}
            />

            <Text style={[styles.label, { color: c.foreground, fontFamily: MONO }]}>Verdict</Text>
            <View style={styles.verdictRow}>
              {VERDICTS.map((v) => (
                <Pressable
                  key={v.value}
                  onPress={() => setVerdict(v.value)}
                  style={[
                    styles.verdictBtn,
                    {
                      borderColor: verdict === v.value ? c.foreground : c.border,
                      backgroundColor: verdict === v.value ? c.foreground : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.verdictLabel,
                      {
                        color: verdict === v.value ? c.background : c.foreground,
                        fontFamily: MONO,
                      },
                    ]}
                  >
                    {v.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={handleAdd}
                disabled={!canSave || saving}
                style={({ pressed }) => [
                  styles.saveBtn,
                  {
                    backgroundColor: canSave ? c.foreground : c.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={[styles.saveBtnText, { color: c.background, fontFamily: MONO }]}>
                  {saving ? "Saving…" : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setFormOpen(true)}
            style={[styles.addBtn, { borderColor: c.border }]}
          >
            <Text style={[styles.addBtnText, { color: c.mutedForeground, fontFamily: MONO }]}>
              + New test
            </Text>
          </Pressable>
        )}

        {ready && tests.length > 0 && (
          <View style={styles.listSection}>
            <Text style={[styles.listHeader, { color: c.mutedForeground, fontFamily: MONO }]}>
              Saved tests
            </Text>
            {tests.map((t) => (
              <View
                key={t.id}
                style={[styles.entry, { backgroundColor: c.card, borderColor: c.border }]}
              >
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryName, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                    {t.name}
                  </Text>
                  <Text
                    style={[
                      styles.entryVerdict,
                      {
                        color:
                          t.verdict === "load-bearing"
                            ? "#4ade80"
                            : t.verdict === "decorative"
                              ? "#f87171"
                              : c.mutedForeground,
                        fontFamily: MONO,
                      },
                    ]}
                  >
                    {t.verdict}
                  </Text>
                </View>
                <Text style={[styles.entryDesc, { color: c.mutedForeground, fontFamily: MONO }]}>
                  {t.description}
                </Text>
                {t.alternatives.length > 0 && (
                  <Text style={[styles.entryAlt, { color: c.mutedForeground, fontFamily: MONO }]}>
                    Tried: {t.alternatives[0].text}
                    {t.alternatives[0].whatWasLost
                      ? ` — lost: ${t.alternatives[0].whatWasLost}`
                      : ""}
                  </Text>
                )}
                <View style={styles.entryFooter}>
                  <Text style={[styles.entryDate, { color: c.mutedForeground, fontFamily: MONO }]}>
                    {formatDate(t.savedAt)}
                  </Text>
                  <Pressable
                    onPress={() => deleteTest(t.id)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                  >
                    <Text style={[styles.deleteBtn, { color: c.mutedForeground, fontFamily: MONO }]}>
                      delete
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  backBtn: { marginBottom: 24 },
  backText: { fontSize: 13 },
  title: { fontSize: 26, marginBottom: 6 },
  sub: { fontSize: 13, marginBottom: 24 },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  label: { fontSize: 12, marginBottom: 2 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  multiline: { minHeight: 72, textAlignVertical: "top" },
  verdictRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  verdictBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  verdictLabel: { fontSize: 12 },
  actions: { flexDirection: "row", justifyContent: "flex-end" },
  saveBtn: { borderRadius: 6, paddingHorizontal: 20, paddingVertical: 8 },
  saveBtnText: { fontSize: 13 },
  addBtn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  addBtnText: { fontSize: 13 },
  listSection: { marginTop: 8 },
  listHeader: { fontSize: 11, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
  entry: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    gap: 6,
  },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  entryName: { fontSize: 16, flex: 1, marginRight: 8 },
  entryVerdict: { fontSize: 11 },
  entryDesc: { fontSize: 13, lineHeight: 18 },
  entryAlt: { fontSize: 12, fontStyle: "italic" },
  entryFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  entryDate: { fontSize: 11 },
  deleteBtn: { fontSize: 11 },
});

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
import { useGateLog } from "@/hooks/useGateLog";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function GateLogScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;
  const { ready, entries, addEntry, deleteEntry } = useGateLog();

  const [brightSide, setBrightSide] = useState("");
  const [systemsWord, setSystemsWord] = useState("");
  const [context, setContext] = useState("");
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(true);

  const canSave = brightSide.trim().length > 0 && systemsWord.trim().length > 0;

  async function handleAdd() {
    if (!canSave) return;
    setSaving(true);
    await addEntry({
      brightSide: brightSide.trim(),
      massity: systemsWord.trim(),
      context: context.trim(),
    });
    setBrightSide("");
    setSystemsWord("");
    setContext("");
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
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.backText, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Back
          </Text>
        </Pressable>

        {/* Header */}
        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          GATE LOG
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          The translation record.
        </Text>
        <Text style={[styles.subtitle, { color: c.pullQuote, fontFamily: SERIF_ITALIC }]}>
          Two vocabularies. One practice. Log what you say on the bright side and what you say across the Gate — so neither language loses its place.
        </Text>
        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {/* Add entry form */}
        <Pressable
          onPress={() => setFormOpen(!formOpen)}
          style={({ pressed }) => [
            styles.formToggle,
            { borderColor: c.rule, backgroundColor: c.card, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={[styles.formToggleText, { color: c.foreground, fontFamily: MONO }]}>
            {formOpen ? "− New entry" : "+ New entry"}
          </Text>
        </Pressable>

        {formOpen && (
          <View style={[styles.form, { borderColor: c.rule, backgroundColor: c.card }]}>
            <View style={styles.formColumns}>
              {/* Bright side */}
              <View style={styles.formColumn}>
                <Text style={[styles.columnLabel, { color: c.foreground, fontFamily: MONO }]}>
                  BRIGHT SIDE
                </Text>
                <Text style={[styles.columnHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                  Your constellation's name
                </Text>
                <TextInput
                  value={brightSide}
                  onChangeText={setBrightSide}
                  placeholder="e.g. Seasonal Shelf"
                  placeholderTextColor={c.mutedForeground}
                  style={[
                    styles.input,
                    {
                      borderColor: brightSide ? c.primary : c.border,
                      color: c.foreground,
                      fontFamily: SERIF_BOLD,
                      backgroundColor: c.background,
                    },
                  ]}
                />
              </View>

              {/* The systems */}
              <View style={styles.formColumn}>
                <Text style={[styles.columnLabel, { color: c.foreground, fontFamily: MONO }]}>
                  THE SYSTEMS
                </Text>
                <Text style={[styles.columnHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                  What the other side calls it
                </Text>
                <TextInput
                  value={systemsWord}
                  onChangeText={setSystemsWord}
                  placeholder="e.g. Pantry Inventory"
                  placeholderTextColor={c.mutedForeground}
                  style={[
                    styles.input,
                    {
                      borderColor: systemsWord ? c.primary : c.border,
                      color: c.foreground,
                      fontFamily: SERIF_BOLD,
                      backgroundColor: c.background,
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO, marginTop: 16 }]}>
              CONTEXT
            </Text>
            <Text style={[styles.fieldHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              Who needs the translation — funder, health unit, co-op board, lawyer, etc.
            </Text>
            <TextInput
              value={context}
              onChangeText={setContext}
              placeholder="e.g. Health unit product inspection forms"
              placeholderTextColor={c.mutedForeground}
              style={[
                styles.input,
                {
                  borderColor: context ? c.primary : c.border,
                  color: c.foreground,
                  fontFamily: SERIF,
                  backgroundColor: c.background,
                },
              ]}
            />

            <Pressable
              onPress={handleAdd}
              style={({ pressed }) => [
                styles.saveBtn,
                {
                  backgroundColor: canSave ? c.primary : c.muted,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.saveBtnText, { color: c.primaryForeground, fontFamily: MONO }]}>
                {saving ? "Adding…" : "Add to log →"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Entries */}
        {ready && entries.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              {`${entries.length} ${entries.length === 1 ? "ENTRY" : "ENTRIES"}`}
            </Text>
            {entries.map((entry) => (
              <View
                key={entry.id}
                style={[styles.entryCard, { borderColor: c.rule, backgroundColor: c.card }]}
              >
                <View style={styles.entryColumns}>
                  <View style={styles.entryCol}>
                    <Text style={[styles.entryColLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                      BRIGHT SIDE
                    </Text>
                    <Text style={[styles.entryTerm, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                      {entry.brightSide}
                    </Text>
                  </View>
                  <View style={[styles.entrySep, { backgroundColor: c.rule }]} />
                  <View style={styles.entryCol}>
                    <Text style={[styles.entryColLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                      THE SYSTEMS
                    </Text>
                    <Text style={[styles.entryTerm, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                      {entry.massity}
                    </Text>
                  </View>
                </View>
                {entry.context.length > 0 && (
                  <Text style={[styles.entryContext, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                    {entry.context}
                  </Text>
                )}
                <View style={styles.entryFoot}>
                  <Text style={[styles.entryDate, { color: c.mutedForeground, fontFamily: MONO }]}>
                    {formatDate(entry.createdAt)}
                  </Text>
                  <Pressable
                    onPress={() => deleteEntry(entry.id)}
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

        {ready && entries.length === 0 && !formOpen && (
          <Text style={[styles.emptyText, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
            No entries yet. Add your first pairing — your community's word on the left, the systems' word on the right.
          </Text>
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
  rule: { height: 1, width: 48, marginTop: 24, marginBottom: 24, opacity: 0.6 },
  formToggle: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 12,
  },
  formToggleText: { fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" },
  form: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    marginBottom: 28,
  },
  formColumns: { flexDirection: "row", gap: 12 },
  formColumn: { flex: 1 },
  columnLabel: { fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 },
  columnHint: { fontSize: 12, lineHeight: 18, marginBottom: 8 },
  fieldLabel: { fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 },
  fieldHint: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 22,
  },
  saveBtn: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 4,
  },
  saveBtnText: { fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" },
  sectionLabel: { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 },
  entryCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    marginBottom: 10,
  },
  entryColumns: { flexDirection: "row", alignItems: "flex-start", gap: 0 },
  entryCol: { flex: 1 },
  entrySep: { width: 1, marginHorizontal: 14, alignSelf: "stretch" },
  entryColLabel: { fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 },
  entryTerm: { fontSize: 17, lineHeight: 23 },
  entryContext: { fontSize: 13, lineHeight: 20, marginTop: 10 },
  entryFoot: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  entryDate: { fontSize: 11, letterSpacing: 0.5 },
  deleteText: { fontSize: 11, letterSpacing: 0.5, textDecorationLine: "underline" },
  emptyText: { fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: 20 },
});

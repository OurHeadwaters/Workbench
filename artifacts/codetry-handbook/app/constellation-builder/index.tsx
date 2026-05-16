import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  ZONE_GUIDES,
  useConstellationBuilder,
} from "@/hooks/useConstellationBuilder";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

function ZoneCard({
  guide,
  zone,
  onUpdateName,
  onUpdateDomain,
  onUpdateVocabulary,
}: {
  guide: (typeof ZONE_GUIDES)[number];
  zone: { zone: number; name: string; domain: string; vocabulary: string };
  onUpdateName: (v: string) => void;
  onUpdateDomain: (v: string) => void;
  onUpdateVocabulary: (v: string) => void;
}) {
  const c = useColors();
  const [open, setOpen] = useState(false);
  const filled = zone.name.trim().length > 0;

  return (
    <View style={[styles.zoneCard, { borderColor: filled ? c.primary : c.rule, backgroundColor: c.card }]}>
      <Pressable
        onPress={() => setOpen(!open)}
        style={({ pressed }) => [styles.zoneHeader, { opacity: pressed ? 0.75 : 1 }]}
      >
        <View style={[styles.zoneBadge, { backgroundColor: filled ? c.primary : c.muted }]}>
          <Text style={[styles.zoneBadgeText, { color: filled ? c.primaryForeground : c.mutedForeground, fontFamily: MONO }]}>
            {guide.zone}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {filled ? (
            <Text style={[styles.zoneNameFilled, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
              {zone.name}
            </Text>
          ) : (
            <Text style={[styles.zoneNameEmpty, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              {guide.hint}
            </Text>
          )}
        </View>
        <Text style={[styles.chevron, { color: c.mutedForeground, fontFamily: MONO }]}>
          {open ? "−" : "+"}
        </Text>
      </Pressable>

      {open && (
        <View style={styles.zoneBody}>
          <View style={[styles.zoneDivider, { backgroundColor: c.rule }]} />

          <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO }]}>
            ZONE NAME
          </Text>
          <Text style={[styles.fieldHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
            {guide.example}
          </Text>
          <TextInput
            value={zone.name}
            onChangeText={onUpdateName}
            placeholder={guide.hint}
            placeholderTextColor={c.mutedForeground}
            style={[
              styles.input,
              {
                borderColor: zone.name ? c.primary : c.border,
                color: c.foreground,
                fontFamily: SERIF_BOLD,
                backgroundColor: c.background,
              },
            ]}
          />

          <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO, marginTop: 18 }]}>
            WHAT THIS ZONE HOLDS
          </Text>
          <Text style={[styles.fieldHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
            One or two sentences describing the role this zone plays in your practice.
          </Text>
          <TextInput
            value={zone.domain}
            onChangeText={onUpdateDomain}
            placeholder="e.g. The household system I draw from and contribute to daily — the jar kitchen, the freezer, the seasonal shelf."
            placeholderTextColor={c.mutedForeground}
            multiline
            style={[
              styles.inputMulti,
              {
                borderColor: zone.domain ? c.primary : c.border,
                color: c.foreground,
                fontFamily: SERIF,
                backgroundColor: c.background,
              },
            ]}
          />

          <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO, marginTop: 18 }]}>
            KEY VOCABULARY
          </Text>
          <Text style={[styles.fieldHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
            The 3–5 names that belong to this zone in your practice. One per line, or comma-separated.
          </Text>
          <TextInput
            value={zone.vocabulary}
            onChangeText={onUpdateVocabulary}
            placeholder="e.g. Jarista, Seasonal Shelf, Harvest Hold"
            placeholderTextColor={c.mutedForeground}
            multiline
            style={[
              styles.inputMulti,
              {
                borderColor: zone.vocabulary ? c.primary : c.border,
                color: c.foreground,
                fontFamily: SERIF,
                backgroundColor: c.background,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

export default function ConstellationBuilderScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;
  const { ready, manifest, updateField, updateZone } = useConstellationBuilder();

  const [localPractitioner, setLocalPractitioner] = useState("");
  const [localPractice, setLocalPractice] = useState("");
  const [viewMode, setViewMode] = useState<"build" | "manifest">("build");
  const seeded = useRef(false);

  useEffect(() => {
    if (ready && !seeded.current) {
      setLocalPractitioner(manifest.practitionerName);
      setLocalPractice(manifest.practiceName);
      seeded.current = true;
    }
  }, [ready, manifest]);

  const filledZones = manifest.zones.filter((z) => z.name.trim().length > 0).length;

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
          YOUR CONSTELLATION
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          Name what you are building.
        </Text>
        <Text style={[styles.subtitle, { color: c.pullQuote, fontFamily: SERIF_ITALIC }]}>
          Six zones. Your vocabulary. Write what each zone holds in your practice — not the founding examples, yours.
        </Text>
        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {/* Mode toggle */}
        <View style={[styles.modeRow, { borderColor: c.rule }]}>
          <Pressable
            onPress={() => setViewMode("build")}
            style={({ pressed }) => [
              styles.modeBtn,
              {
                backgroundColor: viewMode === "build" ? c.primary : "transparent",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.modeBtnText,
                {
                  color: viewMode === "build" ? c.primaryForeground : c.mutedForeground,
                  fontFamily: MONO,
                },
              ]}
            >
              Build
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode("manifest")}
            style={({ pressed }) => [
              styles.modeBtn,
              {
                backgroundColor: viewMode === "manifest" ? c.primary : "transparent",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.modeBtnText,
                {
                  color: viewMode === "manifest" ? c.primaryForeground : c.mutedForeground,
                  fontFamily: MONO,
                },
              ]}
            >
              View manifest
            </Text>
          </Pressable>
        </View>

        {/* ── BUILD MODE ── */}
        {viewMode === "build" && (
          <>
            {/* Practitioner info */}
            <View style={[styles.practCard, { borderColor: c.rule, backgroundColor: c.card }]}>
              <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO }]}>
                YOUR NAME IN THIS PRACTICE
              </Text>
              <Text style={[styles.fieldHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                The bright-side name for what you are — e.g. Jarista, Steward, Founder
              </Text>
              <TextInput
                value={localPractitioner}
                onChangeText={setLocalPractitioner}
                onBlur={() => updateField("practitionerName", localPractitioner)}
                placeholder="e.g. Jarista"
                placeholderTextColor={c.mutedForeground}
                style={[
                  styles.input,
                  {
                    borderColor: localPractitioner ? c.primary : c.border,
                    color: c.foreground,
                    fontFamily: SERIF_BOLD,
                    backgroundColor: c.background,
                  },
                ]}
              />
              <Text style={[styles.fieldLabel, { color: c.foreground, fontFamily: MONO, marginTop: 18 }]}>
                YOUR PRACTICE NAME
              </Text>
              <Text style={[styles.fieldHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                The name the whole constellation runs under — e.g. Headwaters
              </Text>
              <TextInput
                value={localPractice}
                onChangeText={setLocalPractice}
                onBlur={() => updateField("practiceName", localPractice)}
                placeholder="e.g. Headwaters"
                placeholderTextColor={c.mutedForeground}
                style={[
                  styles.input,
                  {
                    borderColor: localPractice ? c.primary : c.border,
                    color: c.foreground,
                    fontFamily: SERIF_BOLD,
                    backgroundColor: c.background,
                  },
                ]}
              />
            </View>

            {/* Progress */}
            <Text style={[styles.progress, { color: c.mutedForeground, fontFamily: MONO }]}>
              {`${filledZones} / 6 ZONES NAMED`}
            </Text>

            {/* Zone cards */}
            {ZONE_GUIDES.map((guide) => {
              const zoneData = manifest.zones.find((z) => z.zone === guide.zone)!;
              return (
                <ZoneCard
                  key={guide.zone}
                  guide={guide}
                  zone={zoneData}
                  onUpdateName={(v) => updateZone(guide.zone, { name: v })}
                  onUpdateDomain={(v) => updateZone(guide.zone, { domain: v })}
                  onUpdateVocabulary={(v) => updateZone(guide.zone, { vocabulary: v })}
                />
              );
            })}
          </>
        )}

        {/* ── MANIFEST MODE ── */}
        {viewMode === "manifest" && (
          <>
            {(localPractitioner || localPractice) && (
              <View style={[styles.manifestHeader, { borderColor: c.rule }]}>
                {localPractitioner ? (
                  <Text style={[styles.manifestPractitioner, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                    {localPractitioner}
                  </Text>
                ) : null}
                {localPractice ? (
                  <Text style={[styles.manifestPractice, { color: c.pullQuote, fontFamily: SERIF_ITALIC }]}>
                    {localPractice}
                  </Text>
                ) : null}
              </View>
            )}

            {manifest.zones.map((z, i) => {
              const guide = ZONE_GUIDES[i];
              const hasContent = z.name || z.domain || z.vocabulary;
              return (
                <View
                  key={z.zone}
                  style={[
                    styles.manifestZone,
                    { borderColor: hasContent ? c.rule : c.rule, opacity: hasContent ? 1 : 0.35 },
                  ]}
                >
                  <View style={styles.manifestZoneHead}>
                    <Text style={[styles.manifestZoneNum, { color: c.mutedForeground, fontFamily: MONO }]}>
                      {`Zone ${z.zone}`}
                    </Text>
                    <Text style={[styles.manifestZoneName, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                      {z.name || guide.hint}
                    </Text>
                  </View>
                  {z.domain ? (
                    <Text style={[styles.manifestDomain, { color: c.foreground, fontFamily: SERIF }]}>
                      {z.domain}
                    </Text>
                  ) : null}
                  {z.vocabulary ? (
                    <Text style={[styles.manifestVocab, { color: c.mutedForeground, fontFamily: MONO }]}>
                      {z.vocabulary}
                    </Text>
                  ) : null}
                </View>
              );
            })}

            {filledZones === 0 && (
              <Text style={[styles.emptyText, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                Switch to Build and name your zones — the manifest will take shape here.
              </Text>
            )}

            <Pressable
              onPress={() => setViewMode("build")}
              style={({ pressed }) => [
                styles.editBtn,
                { borderColor: c.rule, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.editBtnText, { color: c.foreground, fontFamily: MONO }]}>
                ← Edit zones
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
  rule: { height: 1, width: 48, marginTop: 24, marginBottom: 24, opacity: 0.6 },
  modeRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 24,
  },
  modeBtn: { flex: 1, paddingVertical: 12, alignItems: "center" },
  modeBtnText: { fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" },
  practCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    marginBottom: 20,
  },
  fieldLabel: { fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 },
  fieldHint: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    lineHeight: 24,
  },
  inputMulti: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 72,
    textAlignVertical: "top",
  },
  progress: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 },
  zoneCard: {
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  },
  zoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
  },
  zoneBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  zoneBadgeText: { fontSize: 13, letterSpacing: 0.5 },
  zoneNameFilled: { fontSize: 18, lineHeight: 24 },
  zoneNameEmpty: { fontSize: 14, lineHeight: 20 },
  chevron: { fontSize: 18, width: 18, textAlign: "center" },
  zoneBody: { paddingHorizontal: 16, paddingBottom: 16 },
  zoneDivider: { height: 1, marginBottom: 16 },
  manifestHeader: {
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginBottom: 20,
  },
  manifestPractitioner: { fontSize: 26, lineHeight: 32, letterSpacing: -0.3 },
  manifestPractice: { fontSize: 17, lineHeight: 25, marginTop: 4 },
  manifestZone: {
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  manifestZoneHead: { flexDirection: "row", alignItems: "baseline", gap: 12, marginBottom: 6 },
  manifestZoneNum: { fontSize: 11, letterSpacing: 1.5, width: 52 },
  manifestZoneName: { fontSize: 20, flex: 1 },
  manifestDomain: { fontSize: 14, lineHeight: 22, marginLeft: 64, marginBottom: 6 },
  manifestVocab: { fontSize: 11, letterSpacing: 0.8, marginLeft: 64 },
  emptyText: { fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: 20 },
  editBtn: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 24,
  },
  editBtnText: { fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" },
});

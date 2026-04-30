// Station detail screen.
//
// Four blocks, in this order, scrolled top to bottom:
//   LISTEN — narration player (web), or a placeholder card (native)
//   READ   — chapter excerpt rendered with the same ChapterBlock used
//            by the book itself, so the prose is identical to the
//            handbook chapter the station draws from
//   DO     — the station's single tangible action prompt
//   MARK   — mark-done button (with optional one-line note); after
//            marked, the next station unlocks on the trail map
//
// The station screen never renders the next station inline — finishing
// is a deliberate action the reader does *off* the screen and then
// returns to mark.

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
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

import { ChapterBlock } from "@/components/ChapterBlock";
import { StationAudio } from "@/components/path/StationAudio";
import {
  getPioneerNeighbors,
  getPioneerStation,
  pioneerPathStationExcerpt,
} from "@/data/pioneerPath";
import { useColors } from "@/hooks/useColors";
import { usePioneerPath } from "@/lib/pioneerPath/store";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

const ROMAN: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
};

export default function StationScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { ready, isCompleted, isUnlocked, markDone, unmark, progress } = usePioneerPath();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const station = getPioneerStation(id);
  const { prev, next } = useMemo(() => getPioneerNeighbors(id), [id]);
  const excerpt = useMemo(() => pioneerPathStationExcerpt(id), [id]);

  const completed = station ? isCompleted(station.id) : false;
  const unlocked = station ? isUnlocked(station.id) : false;
  const completion = station ? progress.completed[station.id] : undefined;
  const existingNote = completion?.note ?? "";
  const existingPhoto = completion?.photoUri ?? "";
  const [noteDraft, setNoteDraft] = useState<string>(existingNote);
  const [photoDraft, setPhotoDraft] = useState<string>(existingPhoto);

  // Hydration sync: AsyncStorage loads asynchronously, so the first
  // render of this screen sees default progress. Once the store is
  // ready, copy any persisted note/photo into the local draft. Keyed
  // on station id so navigating between stations also re-syncs.
  const hydratedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!ready || !station) return;
    if (hydratedKeyRef.current === station.id) return;
    hydratedKeyRef.current = station.id;
    setNoteDraft(existingNote);
    setPhotoDraft(existingPhoto);
  }, [ready, station, existingNote, existingPhoto]);

  // Hidden file input the visible photo button forwards into.
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPickPhoto = useCallback(() => {
    if (Platform.OS !== "web") return;
    fileInputRef.current?.click();
  }, []);

  const onPhotoChosen = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      // Cap data-URL photos at 3 MB so localStorage stays sane.
      if (file.size > 3 * 1024 * 1024) {
        if (typeof window !== "undefined") {
          window.alert(
            "That photo is larger than 3 MB. Try a smaller image, or mark the station without a photo.",
          );
        }
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") setPhotoDraft(result);
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const onClearPhoto = useCallback(() => setPhotoDraft(""), []);

  const onMarkDone = useCallback(() => {
    if (!station) return;
    const trimmed = noteDraft.trim();
    const extras: { note?: string; photoUri?: string } = {};
    if (trimmed.length > 0) extras.note = trimmed;
    if (photoDraft.length > 0) extras.photoUri = photoDraft;
    markDone(
      station.id,
      Object.keys(extras).length > 0 ? extras : undefined,
    );
  }, [markDone, noteDraft, photoDraft, station]);

  const onUnmark = useCallback(() => {
    if (!station) return;
    unmark(station.id);
    setPhotoDraft("");
  }, [unmark, station]);

  if (!station) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <View style={styles.errorPad}>
          <Text style={[styles.errorTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
            That station isn't on the trail.
          </Text>
          <Pressable onPress={() => router.replace("/path")} style={styles.errorBack}>
            <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
              ← Back to the trail
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
          <Text
            style={[styles.lockedEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}
          >
            STATION {ROMAN[station.ordinal] ?? station.ordinal} · LOCKED
          </Text>
          <Text style={[styles.errorTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
            {station.name}
          </Text>
          <Text
            style={[styles.lockedBody, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
          >
            Walk {prev?.name ?? "the previous station"} first. The Path opens one step at a time.
          </Text>
          <Pressable
            onPress={() => router.replace("/path")}
            style={({ pressed }) => [
              styles.lockedBtn,
              {
                borderColor: c.foreground,
                backgroundColor: c.background,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={[styles.lockedBtnLabel, { color: c.foreground, fontFamily: MONO }]}
            >
              Back to the trail
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 24,
            paddingBottom: Math.max(insets.bottom, webBottom) + 60,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.replace("/path")}
          accessibilityLabel="Back to the trail"
          style={styles.backRow}
        >
          <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Back to the trail
          </Text>
        </Pressable>

        <Text
          style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}
        >
          STATION {ROMAN[station.ordinal] ?? station.ordinal} OF V
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {station.name}
        </Text>
        <Text
          style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
        >
          {station.subtitle}
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {/* LISTEN */}
        <StationAudio
          stationId={station.id}
          stationName={station.name}
          slug={station.narrationSlug}
        />

        {/* READ */}
        <Text
          style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}
        >
          READ
        </Text>
        <View style={styles.readWrap}>
          {excerpt.map((block, idx) => (
            <ChapterBlock
              key={`${station.id}-block-${idx}`}
              block={block}
              fontScale={1}
            />
          ))}
        </View>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/chapter/[id]",
              params: { id: station.sourceChapterId },
            })
          }
          style={({ pressed }) => [
            styles.readMoreRow,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          accessibilityLabel="Open the full chapter in the handbook"
        >
          <Text
            style={[styles.readMoreLabel, { color: c.foreground, fontFamily: MONO }]}
          >
            Open the full chapter in the handbook →
          </Text>
        </Pressable>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {/* DO */}
        <Text
          style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}
        >
          DO
        </Text>
        <View
          style={[
            styles.doCard,
            { backgroundColor: c.card, borderColor: c.foreground },
          ]}
        >
          <Text
            style={[styles.doPrompt, { color: c.foreground, fontFamily: SERIF }]}
          >
            {station.doPrompt}
          </Text>
        </View>

        {/* MARK */}
        <Text
          style={[styles.sectionEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}
        >
          MARK DONE
        </Text>
        <Text
          style={[styles.markIntro, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
        >
          When the thing is done, mark this station. Add a line about what you noticed if you want — it stays on this device.
        </Text>
        <TextInput
          value={noteDraft}
          onChangeText={setNoteDraft}
          placeholder="One line about what you noticed (optional)"
          placeholderTextColor={c.mutedForeground}
          style={[
            styles.noteInput,
            {
              color: c.foreground,
              borderColor: c.rule,
              backgroundColor: c.card,
              fontFamily: SERIF,
            },
          ]}
          multiline
          numberOfLines={2}
          editable={!completed}
        />

        {/* Optional photo (web only), stored as a local data URL. */}
        {Platform.OS === "web" ? (
          <View style={styles.photoBlock}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onPhotoChosen}
              style={{ display: "none" }}
              aria-hidden
            />
            {photoDraft ? (
              <View style={styles.photoFrame}>
                <Image
                  source={{ uri: photoDraft }}
                  style={styles.photoPreview}
                  resizeMode="cover"
                  accessibilityLabel={`Photo for ${station.name}`}
                />
                {!completed ? (
                  <Pressable
                    onPress={onClearPhoto}
                    style={({ pressed }) => [
                      styles.photoRemoveBtn,
                      {
                        backgroundColor: c.background,
                        borderColor: c.rule,
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}
                    accessibilityLabel="Remove photo"
                  >
                    <Ionicons name="close" size={14} color={c.foreground} />
                  </Pressable>
                ) : null}
              </View>
            ) : !completed ? (
              <Pressable
                onPress={onPickPhoto}
                style={({ pressed }) => [
                  styles.photoAddBtn,
                  {
                    borderColor: c.rule,
                    backgroundColor: c.card,
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
                accessibilityLabel="Attach a photo"
              >
                <Ionicons name="image-outline" size={16} color={c.foreground} />
                <Text
                  style={[
                    styles.photoAddLabel,
                    { color: c.foreground, fontFamily: MONO },
                  ]}
                >
                  Attach a photo (optional)
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {completed ? (
          <View style={styles.markedRow}>
            <View
              style={[
                styles.markedPill,
                { backgroundColor: c.foreground },
              ]}
            >
              <Ionicons name="checkmark" size={14} color={c.background} />
              <Text
                style={[styles.markedPillLabel, { color: c.background, fontFamily: MONO }]}
              >
                STATION WALKED
              </Text>
            </View>
            <Pressable
              onPress={onUnmark}
              style={({ pressed }) => [styles.unmarkBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text
                style={[styles.unmarkLabel, { color: c.mutedForeground, fontFamily: MONO }]}
              >
                Unmark
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={onMarkDone}
            style={({ pressed }) => [
              styles.markBtn,
              {
                backgroundColor: c.foreground,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="checkmark" size={18} color={c.background} />
            <Text
              style={[styles.markBtnLabel, { color: c.background, fontFamily: MONO }]}
            >
              Mark this station walked
            </Text>
          </Pressable>
        )}

        <View style={[styles.rule, { backgroundColor: c.rule, marginTop: 28 }]} />

        {/* NEXT */}
        <View style={styles.nextRow}>
          {prev ? (
            <Pressable
              onPress={() =>
                router.replace({
                  pathname: "/path/station/[id]",
                  params: { id: prev.id },
                })
              }
              style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text
                style={[styles.navHint, { color: c.mutedForeground, fontFamily: MONO }]}
              >
                ← STATION {ROMAN[prev.ordinal] ?? prev.ordinal}
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
                  router.replace({
                    pathname: "/path/station/[id]",
                    params: { id: next.id },
                  })
                }
                style={({ pressed }) => [
                  styles.navBtn,
                  styles.navBtnRight,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text
                  style={[styles.navHint, { color: c.mutedForeground, fontFamily: MONO }]}
                >
                  STATION {ROMAN[next.ordinal] ?? next.ordinal} →
                </Text>
                <Text
                  style={[
                    styles.navName,
                    styles.navNameRight,
                    { color: c.foreground, fontFamily: SERIF_ITALIC },
                  ]}
                >
                  {next.name}
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.navBtn, styles.navBtnRight]}>
                <Text
                  style={[styles.navHint, { color: c.muted, fontFamily: MONO }]}
                >
                  STATION {ROMAN[next.ordinal] ?? next.ordinal}
                </Text>
                <Text
                  style={[
                    styles.navName,
                    styles.navNameRight,
                    { color: c.muted, fontFamily: SERIF_ITALIC },
                  ]}
                >
                  Locked until you mark this one
                </Text>
              </View>
            )
          ) : completed ? (
            <View style={[styles.navBtn, styles.navBtnRight]}>
              <Text
                style={[styles.navHint, { color: c.foreground, fontFamily: MONO }]}
              >
                THE TRAIL IS WALKED
              </Text>
              <Text
                style={[
                  styles.navName,
                  styles.navNameRight,
                  { color: c.foreground, fontFamily: SERIF_ITALIC },
                ]}
              >
                Return to the handbook
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
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 22,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  errorPad: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  errorTitle: {
    fontSize: 26,
    lineHeight: 32,
    marginTop: 8,
  },
  errorBack: {
    marginTop: 18,
  },
  lockedEyebrow: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  lockedBody: {
    fontSize: 17,
    lineHeight: 26,
    marginTop: 14,
  },
  lockedBtn: {
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    alignSelf: "flex-start",
    borderRadius: 4,
  },
  lockedBtnLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  backRow: {
    marginBottom: 18,
  },
  backLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 6,
  },
  rule: {
    height: 1,
    marginVertical: 18,
    opacity: 0.7,
  },
  sectionEyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  readWrap: {
    marginBottom: 8,
  },
  readMoreRow: {
    marginTop: 10,
    marginBottom: 4,
  },
  readMoreLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  doCard: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  doPrompt: {
    fontSize: 17,
    lineHeight: 26,
  },
  markIntro: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  noteInput: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: "top",
    marginBottom: 14,
  },
  photoBlock: {
    marginBottom: 14,
  },
  photoAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "dashed",
    alignSelf: "flex-start",
  },
  photoAddLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  photoFrame: {
    position: "relative",
    width: "100%",
    maxWidth: 320,
    aspectRatio: 4 / 3,
    borderRadius: 4,
    overflow: "hidden",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
  },
  photoRemoveBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  markBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 4,
    gap: 10,
  },
  markBtnLabel: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  markedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  markedPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    gap: 6,
  },
  markedPillLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
  },
  unmarkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  unmarkLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  nextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginTop: 4,
  },
  navBtn: {
    flex: 1,
  },
  navBtnRight: {
    alignItems: "flex-end",
  },
  navHint: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  navName: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4,
  },
  navNameRight: {
    textAlign: "right",
  },
});

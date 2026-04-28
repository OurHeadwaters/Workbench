// Sessions list for the Shared Vision tool.
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SyncStatusPill } from "@/components/SyncStatusPill";
import { useColors } from "@/hooks/useColors";
import { resolveTemplate, sessionLabel } from "@/lib/sharedVision/spec";
import { useSharedVision } from "@/lib/sharedVision/store";
import type { SharedVisionSession } from "@/lib/sharedVision/types";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

function formatWhen(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `Today · ${h}:${m}`;
  }
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function metaphorBadge(session: SharedVisionSession): string {
  const t = resolveTemplate(session);
  if (!t) return "no metaphor yet";
  return `${t.article} ${t.noun}`;
}

export default function SharedVisionList() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;
  const { ready, sessions, createSession, renameSession, deleteSession } =
    useSharedVision();
  const [renameTarget, setRenameTarget] = useState<SharedVisionSession | null>(
    null,
  );
  const [renameDraft, setRenameDraft] = useState("");

  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  const onStart = useCallback(() => {
    const fresh = createSession();
    router.push({
      pathname: "/shared-vision/[id]",
      params: { id: fresh.id },
    });
  }, [createSession]);

  const onResume = useCallback((id: string) => {
    router.push({
      pathname: "/shared-vision/[id]",
      params: { id },
    });
  }, []);

  const onAskDelete = useCallback(
    (s: SharedVisionSession) => {
      const label = sessionLabel(s);
      const message = `Delete the vision “${label}”? This can't be undone.`;
      if (Platform.OS === "web") {
        const g: { window?: Window } | undefined =
          typeof globalThis !== "undefined"
            ? (globalThis as unknown as { window?: Window })
            : undefined;
        const ok = g?.window?.confirm(message) ?? true;
        if (ok) deleteSession(s.id);
        return;
      }
      Alert.alert("Delete vision", message, [
        { text: "Keep", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteSession(s.id),
        },
      ]);
    },
    [deleteSession],
  );

  const openRename = useCallback((s: SharedVisionSession) => {
    setRenameTarget(s);
    setRenameDraft(s.name ?? "");
  }, []);

  const closeRename = useCallback(() => {
    setRenameTarget(null);
    setRenameDraft("");
  }, []);

  const commitRename = useCallback(() => {
    if (!renameTarget) return;
    renameSession(renameTarget.id, renameDraft);
    closeRename();
  }, [renameTarget, renameDraft, renameSession, closeRename]);

  if (!ready) {
    return (
      <View
        style={[
          styles.root,
          {
            backgroundColor: c.background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
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
          Loading…
        </Text>
      </View>
    );
  }

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
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={22} color={c.foreground} />
        </Pressable>
        <Text
          style={{
            color: c.mutedForeground,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            flex: 1,
            textAlign: "center",
          }}
        >
          Shared Vision
        </Text>
        <View style={styles.syncSlot}>
          <SyncStatusPill />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: Math.max(insets.bottom, webBottom) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.eyebrow,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          A COMPANION TOOL
        </Text>
        <Text
          style={[
            styles.title,
            { color: c.foreground, fontFamily: SERIF_BOLD },
          ]}
        >
          Shared Vision
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: c.foreground, fontFamily: SERIF_ITALIC },
          ]}
        >
          Describe what you want like a familiar object — a bucket, a shelf,
          a jar — and hand off a clear plan to your agent.
        </Text>

        <Pressable
          onPress={onStart}
          style={({ pressed }) => [
            styles.primaryBtn,
            {
              backgroundColor: c.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          accessibilityLabel="Start a new vision"
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
            Start a new vision
          </Text>
        </Pressable>

        <View style={{ height: 28 }} />
        <Text
          style={[
            styles.eyebrow,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          IN-PROGRESS · {sorted.length}
        </Text>

        {sorted.length === 0 ? (
          <Text
            style={[
              styles.emptyText,
              { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
            ]}
          >
            Nothing yet. Start a vision and pick the object that fits what
            you have in mind.
          </Text>
        ) : (
          sorted.map((s) => (
            <View
              key={s.id}
              style={[styles.row, { borderBottomColor: c.rule }]}
            >
              <Pressable
                onPress={() => onResume(s.id)}
                style={({ pressed }) => [
                  styles.rowMain,
                  pressed && { opacity: 0.65 },
                ]}
                accessibilityLabel={`Resume ${sessionLabel(s)}`}
              >
                <Text
                  style={[
                    styles.rowEyebrow,
                    { color: c.mutedForeground, fontFamily: MONO },
                  ]}
                >
                  {metaphorBadge(s)} ·{" "}
                  {s.handedOffAt ? "handed off" : "draft"}
                </Text>
                <Text
                  style={[
                    styles.rowTitle,
                    { color: c.foreground, fontFamily: SERIF_BOLD },
                  ]}
                  numberOfLines={2}
                >
                  {sessionLabel(s)}
                </Text>
                <Text
                  style={[
                    styles.rowMeta,
                    { color: c.mutedForeground, fontFamily: MONO },
                  ]}
                >
                  Last edited {formatWhen(s.updatedAt)}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => openRename(s)}
                hitSlop={10}
                style={styles.iconBtn}
                accessibilityLabel="Rename vision"
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={c.mutedForeground}
                />
              </Pressable>
              <Pressable
                onPress={() => onAskDelete(s)}
                hitSlop={10}
                style={styles.iconBtn}
                accessibilityLabel="Delete vision"
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={c.mutedForeground}
                />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={!!renameTarget}
        transparent
        animationType="fade"
        onRequestClose={closeRename}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={closeRename}
          accessibilityLabel="Close rename dialog"
        >
          <Pressable
            style={[
              styles.modalCard,
              {
                backgroundColor: c.card,
                borderColor: c.border,
                borderRadius: c.radius,
              },
            ]}
            onPress={(e) => e.stopPropagation?.()}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: c.foreground, fontFamily: SERIF_BOLD },
              ]}
            >
              Rename vision
            </Text>
            <Text
              style={[
                styles.modalHelp,
                { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
              ]}
            >
              Give it a name you'll remember. Leave blank to fall back to
              the metaphor.
            </Text>
            <TextInput
              value={renameDraft}
              onChangeText={setRenameDraft}
              placeholder="e.g. Sunday photos bucket"
              placeholderTextColor={c.mutedForeground}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={commitRename}
              style={[
                styles.modalInput,
                {
                  color: c.foreground,
                  fontFamily: SERIF,
                  borderColor: c.border,
                  borderRadius: c.radius,
                },
              ]}
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={closeRename}
                style={({ pressed }) => [
                  styles.modalBtn,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={{
                    color: c.mutedForeground,
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={commitRename}
                style={({ pressed }) => [
                  styles.modalBtn,
                  {
                    backgroundColor: c.primary,
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
                  Save
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  scroll: { paddingHorizontal: 24, paddingTop: 24 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowMain: { flex: 1, paddingRight: 8 },
  rowEyebrow: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  rowTitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  rowMeta: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  modalHelp: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});

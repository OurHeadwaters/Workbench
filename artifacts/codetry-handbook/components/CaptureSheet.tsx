import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
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

import { useColors } from "@/hooks/useColors";

const MONO = "JetBrainsMono_500Medium";
const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";

const CONSTELLATIONS = [
  "Codetry",
  "Pioneer Path",
  "Word Walk",
  "The Gate & The Standby",
  "Headwaters Platform",
  "807 Benefits",
  "Bright Side",
  "Library",
  "Print Marketing",
  "Deer Lake",
  "Agency Operations",
  "Saltbox",
  "Practitioner's Guide V2",
  "Unsure",
] as const;

type Urgency = "now" | "next" | "later";

const URGENCY_OPTIONS: { value: Urgency; label: string }[] = [
  { value: "now", label: "Now" },
  { value: "next", label: "Next" },
  { value: "later", label: "Later" },
];

type ImportMetaWithEnv = ImportMeta & { env?: { EXPO_PUBLIC_DOMAIN?: string } };
function getCaptureBase(): string {
  const env =
    typeof process !== "undefined"
      ? process.env
      : (import.meta as unknown as ImportMetaWithEnv).env ?? {};
  const domain = (env as Record<string, string | undefined>).EXPO_PUBLIC_DOMAIN;
  return domain
    ? `https://${domain}/api-server/api/capture`
    : "/api-server/api/capture";
}

async function fetchNonce(): Promise<string> {
  const res = await fetch(`${getCaptureBase()}/nonce`);
  if (!res.ok) throw new Error(`Nonce request failed: HTTP ${res.status}`);
  const body = await res.json() as { token?: string };
  if (!body.token) throw new Error("Server returned no nonce token");
  return body.token;
}

export function CaptureSheet({
  visible,
  onClose,
  defaultConstellation,
}: {
  visible: boolean;
  onClose: () => void;
  defaultConstellation?: string;
}) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const [thought, setThought] = useState("");
  const [constellation, setConstellation] = useState<string>(
    defaultConstellation ?? "Codetry",
  );
  const [urgency, setUrgency] = useState<Urgency>("next");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const thoughtRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setThought("");
      setConstellation(defaultConstellation ?? "Codetry");
      setUrgency("next");
      setStatus("idle");
      setErrorMsg("");
      const t = setTimeout(() => thoughtRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [visible, defaultConstellation]);

  const onSubmit = useCallback(async () => {
    if (thought.trim().length === 0) return;
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    setStatus("submitting");
    setErrorMsg("");
    try {
      const base = getCaptureBase();
      const nonce = await fetchNonce();
      const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thought: thought.trim(), constellation, urgency, nonce }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      if (Platform.OS !== "web")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setStatus("done");
      const t = setTimeout(() => onClose(), 1200);
      return () => clearTimeout(t);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
    return undefined;
  }, [thought, constellation, urgency, onClose]);

  const canSubmit = thought.trim().length > 0 && status !== "submitting" && status !== "done";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
        pointerEvents="box-none"
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: c.background,
              borderTopColor: c.rule,
              paddingBottom: Math.max(insets.bottom, webBottom) + 16,
            },
          ]}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: c.rule }]} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: c.foreground, fontFamily: MONO }]}>
              CAPTURE THOUGHT
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.5 : 1 }]}
              accessibilityLabel="Close"
            >
              <Text style={[styles.closeBtnText, { color: c.mutedForeground, fontFamily: MONO }]}>
                ✕
              </Text>
            </Pressable>
          </View>

          {status === "done" ? (
            <View style={styles.doneWrap}>
              <Text style={[styles.doneText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                Captured — the planning agent will pick it up.
              </Text>
            </View>
          ) : (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Thought input */}
              <Text style={[styles.fieldLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                RAW THOUGHT
              </Text>
              <TextInput
                ref={thoughtRef}
                value={thought}
                onChangeText={setThought}
                placeholder="Exactly as it hit you — messy, incomplete, first-person."
                placeholderTextColor={c.mutedForeground}
                style={[
                  styles.thoughtInput,
                  {
                    color: c.foreground,
                    borderColor: c.rule,
                    backgroundColor: c.card,
                    fontFamily: SERIF,
                  },
                ]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                autoFocus={false}
              />

              {/* Constellation */}
              <Text
                style={[
                  styles.fieldLabel,
                  { color: c.mutedForeground, fontFamily: MONO, marginTop: 16 },
                ]}
              >
                CONSTELLATION
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
                keyboardShouldPersistTaps="handled"
              >
                {CONSTELLATIONS.map((opt) => {
                  const active = constellation === opt;
                  return (
                    <Pressable
                      key={opt}
                      onPress={() => setConstellation(opt)}
                      style={({ pressed }) => [
                        styles.chip,
                        {
                          backgroundColor: active ? c.foreground : c.card,
                          borderColor: active ? c.foreground : c.rule,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: active ? c.background : c.foreground,
                            fontFamily: MONO,
                          },
                        ]}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Urgency */}
              <Text
                style={[
                  styles.fieldLabel,
                  { color: c.mutedForeground, fontFamily: MONO, marginTop: 16 },
                ]}
              >
                URGENCY
              </Text>
              <View style={styles.urgencyRow}>
                {URGENCY_OPTIONS.map(({ value, label }) => {
                  const active = urgency === value;
                  return (
                    <Pressable
                      key={value}
                      onPress={() => setUrgency(value)}
                      style={({ pressed }) => [
                        styles.urgencyBtn,
                        {
                          backgroundColor: active ? c.foreground : c.card,
                          borderColor: active ? c.foreground : c.rule,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.urgencyBtnText,
                          {
                            color: active ? c.background : c.foreground,
                            fontFamily: MONO,
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Error */}
              {status === "error" ? (
                <Text
                  style={[
                    styles.errorText,
                    { color: c.foreground, fontFamily: SERIF_ITALIC },
                  ]}
                >
                  {errorMsg || "Something went wrong — try again."}
                </Text>
              ) : null}

              {/* Submit */}
              <Pressable
                onPress={onSubmit}
                disabled={!canSubmit}
                style={({ pressed }) => [
                  styles.submitBtn,
                  {
                    backgroundColor: c.foreground,
                    opacity: !canSubmit ? 0.4 : pressed ? 0.75 : 1,
                    marginTop: 20,
                  },
                ]}
                accessibilityLabel="Save capture entry"
              >
                {status === "submitting" ? (
                  <ActivityIndicator color={c.background} size="small" />
                ) : (
                  <Text
                    style={[
                      styles.submitBtnText,
                      { color: c.background, fontFamily: MONO },
                    ]}
                  >
                    CAPTURE
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  kav: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: "88%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  fieldLabel: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  thoughtInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 96,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  urgencyRow: {
    flexDirection: "row",
    gap: 10,
  },
  urgencyBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  urgencyBtnText: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  submitBtn: {
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  doneWrap: {
    paddingVertical: 32,
    alignItems: "center",
  },
  doneText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
});

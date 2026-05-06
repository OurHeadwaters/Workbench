import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useColors } from "@/hooks/useColors";
import { GLOSSARY_ENTRIES, type GlossaryEntry } from "@/data/glossary";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

function normalize(s: string) {
  return s.toLowerCase().replace(/['']/g, "'");
}

function findEntry(term: string): GlossaryEntry | undefined {
  const n = normalize(term);
  return GLOSSARY_ENTRIES.find((e) => normalize(e.term) === n);
}

interface Props {
  term: string | null;
  onClose: () => void;
}

export function GlossaryTermSheet({ term, onClose }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const visible = term !== null;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(300);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, term]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handleOpenGlossary = () => {
    handleClose();
    setTimeout(() => {
      router.push({ pathname: "/glossary", params: { q: term ?? "" } });
    }, 240);
  };

  if (!visible) return null;

  const entry = findEntry(term!);

  const badgeColor =
    !entry
      ? c.mutedForeground
      : entry.section === "formal"
        ? c.primary
        : entry.section === "appendix"
          ? c.mutedForeground
          : "#c2410c";

  const badgeBg =
    !entry
      ? `${c.mutedForeground}18`
      : entry.section === "formal"
        ? `${c.primary}18`
        : entry.section === "appendix"
          ? `${c.mutedForeground}18`
          : "rgba(194,65,12,0.10)";

  const webBottom = Platform.OS === "web" ? 34 : 0;
  const bottomInset = Math.max(insets.bottom, webBottom);

  return (
    <Modal
      transparent
      visible
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={handleClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: c.card,
            borderColor: c.chromeBorder,
            paddingBottom: bottomInset + 16,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: c.rule }]} />

        <View style={styles.sheetHeader}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.termText, { color: c.foreground, fontFamily: SERIF_BOLD }]}
              numberOfLines={2}
            >
              {entry?.term ?? term}
            </Text>
            {entry?.group ? (
              <Text
                style={[styles.groupText, { color: c.mutedForeground, fontFamily: MONO }]}
              >
                {entry.group} sub-term
              </Text>
            ) : null}
          </View>
          <View style={styles.headerRight}>
            {entry ? (
              <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                <Text style={[styles.badgeText, { color: badgeColor, fontFamily: MONO }]}>
                  {entry.chapter}
                </Text>
              </View>
            ) : null}
            <Pressable
              onPress={handleClose}
              hitSlop={12}
              style={styles.closeBtn}
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={20} color={c.mutedForeground} />
            </Pressable>
          </View>
        </View>

        {entry?.section === "flagged" ? (
          <View style={[styles.flagBanner, { backgroundColor: "rgba(194,65,12,0.07)" }]}>
            <Text style={[styles.flagText, { color: "#c2410c", fontFamily: MONO }]}>
              Pending definition — founder decision required
            </Text>
          </View>
        ) : null}

        {entry ? (
          <Text
            style={[styles.defText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
          >
            {entry.definition}
          </Text>
        ) : (
          <Text
            style={[styles.defText, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}
          >
            No definition found for this term.
          </Text>
        )}

        <Pressable
          onPress={handleOpenGlossary}
          hitSlop={8}
          style={({ pressed }) => [styles.glossaryLink, pressed && { opacity: 0.6 }]}
          accessibilityLabel="Open full glossary"
        >
          <Text style={[styles.glossaryLinkText, { color: c.primary, fontFamily: MONO }]}>
            Open in glossary →
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.40)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
    marginTop: 2,
  },
  termText: {
    fontSize: 20,
    lineHeight: 26,
  },
  groupText: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  flagBanner: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 10,
  },
  flagText: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  defText: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
  },
  glossaryLink: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  glossaryLinkText: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});

import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import type { Tale } from "@/data/tales";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

interface TaleReaderProps {
  tale: Tale;
  onBack?: () => void;
}

export function TaleReader({ tale, onBack }: TaleReaderProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 28,
            paddingBottom: Math.max(insets.bottom, webBottom) + 64,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {onBack ? (
          <Text
            onPress={onBack}
            style={[styles.back, { color: c.mutedForeground, fontFamily: MONO }]}
          >
            ← Tales
          </Text>
        ) : null}

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          CHILDREN'S TALES
        </Text>

        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {tale.title}
        </Text>

        <Text style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
          {tale.subtitle}
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {tale.body.map((block, i) => {
          if (block.kind === "break") {
            return (
              <View key={i} style={styles.sectionBreak}>
                <View style={[styles.ornament, { backgroundColor: c.rule }]} />
              </View>
            );
          }

          if (block.kind === "para") {
            return (
              <Text
                key={i}
                style={[styles.para, { color: c.foreground, fontFamily: SERIF }]}
              >
                {block.text}
              </Text>
            );
          }

          if (block.kind === "italic") {
            return (
              <Text
                key={i}
                style={[styles.italicPara, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
              >
                {block.text}
              </Text>
            );
          }

          return null;
        })}

        {tale.authorNote ? (
          <View style={styles.authorNoteBlock}>
            <View style={[styles.authorNoteRule, { backgroundColor: c.rule }]} />
            <Text
              style={[
                styles.authorNote,
                { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
              ]}
            >
              {tale.authorNote}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 28,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  back: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
  },
  rule: {
    height: 1,
    width: 48,
    marginTop: 24,
    marginBottom: 32,
    opacity: 0.6,
  },
  para: {
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 22,
  },
  italicPara: {
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 22,
    paddingLeft: 8,
  },
  sectionBreak: {
    alignItems: "center",
    marginVertical: 32,
  },
  ornament: {
    width: 32,
    height: 1,
    opacity: 0.5,
  },
  authorNoteBlock: {
    marginTop: 16,
  },
  authorNoteRule: {
    height: 1,
    width: 48,
    marginBottom: 20,
    opacity: 0.4,
  },
  authorNote: {
    fontSize: 15,
    lineHeight: 24,
  },
});

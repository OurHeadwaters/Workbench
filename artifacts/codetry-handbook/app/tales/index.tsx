import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { TALES } from "@/data/tales";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function TalesIndex() {
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
            paddingBottom: Math.max(insets.bottom, webBottom) + 48,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.replace("/")}
          accessibilityLabel="Home"
          style={styles.backRow}
        >
          <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Home
          </Text>
        </Pressable>

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          A LIVING LIBRARY
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          Children's Tales
        </Text>
        <Text style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
          Bedtime stories for children of all ages, on every kind of ground.
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {TALES.map((tale, i) => {
          const isLast = i === TALES.length - 1;
          return (
            <Pressable
              key={tale.id}
              onPress={() =>
                router.push({
                  pathname: "/tales/[id]",
                  params: { id: tale.id },
                })
              }
              style={({ pressed }) => [
                styles.taleRow,
                !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.rule },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.taleTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}
                >
                  {tale.title}
                </Text>
                <Text
                  style={[styles.taleExcerpt, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}
                  numberOfLines={2}
                >
                  {tale.excerpt}
                </Text>
              </View>
              <Text style={[styles.arrow, { color: c.mutedForeground, fontFamily: MONO }]}>
                →
              </Text>
            </Pressable>
          );
        })}

        <View style={[styles.endRule, { backgroundColor: c.rule }]} />
        <Text style={[styles.foot, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          Each story is a real story, told sideways. New tales are added as they
          find their shape.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 28,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  backRow: {
    marginBottom: 20,
  },
  backLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    marginTop: 6,
  },
  rule: {
    height: 1,
    marginTop: 22,
    marginBottom: 28,
    opacity: 0.6,
  },
  taleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
  },
  taleTitle: {
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  taleExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  arrow: {
    fontSize: 18,
  },
  endRule: {
    height: 1,
    marginTop: 32,
    marginBottom: 18,
    opacity: 0.5,
  },
  foot: {
    fontSize: 14,
    lineHeight: 21,
  },
});

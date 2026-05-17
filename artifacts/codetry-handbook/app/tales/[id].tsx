import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { getTale } from "@/data/tales";
import { TaleReader } from "@/components/TaleReader";

const SERIF_ITALIC = "Lora_400Regular_Italic";

export default function TaleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const tale = getTale(id);

  if (!tale) {
    return (
      <View style={[styles.notFound, { backgroundColor: c.background }]}>
        <Text style={[styles.notFoundText, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          Tale not found.
        </Text>
      </View>
    );
  }

  return (
    <TaleReader
      tale={tale}
      onBack={() => router.push("/tales")}
    />
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  notFoundText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

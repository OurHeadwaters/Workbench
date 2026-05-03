import { Stack } from "expo-router";
import React from "react";
import { SargeProvider } from "@/lib/sarge/store";

export default function SargeLayout() {
  return (
    <SargeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="week" options={{ animation: "slide_from_bottom" }} />
      </Stack>
    </SargeProvider>
  );
}

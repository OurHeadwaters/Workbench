import { Stack } from "expo-router";
import React from "react";

import { SharedVisionProvider } from "@/lib/sharedVision/store";

export default function SharedVisionLayout() {
  return (
    <SharedVisionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </SharedVisionProvider>
  );
}

import { Stack } from "expo-router";
import React from "react";
import { YouthPathProvider } from "@/lib/youthPath/store";

export default function StoryPathLayout() {
  return (
    <YouthPathProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </YouthPathProvider>
  );
}

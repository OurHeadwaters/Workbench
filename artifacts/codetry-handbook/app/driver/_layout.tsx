import { Stack } from "expo-router";
import React from "react";

import { DailyDriverProvider } from "@/lib/dailyDriver/store";

export default function DriverLayout() {
  return (
    <DailyDriverProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </DailyDriverProvider>
  );
}

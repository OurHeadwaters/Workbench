import { Stack } from "expo-router";
import React from "react";

import { StandbyProvider } from "@/lib/standby/store";

export default function StandbyLayout() {
  return (
    <StandbyProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </StandbyProvider>
  );
}

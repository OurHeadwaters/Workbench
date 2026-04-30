// Layout for The Pioneer Path. Wraps the subtree in its own progress
// provider and registers the offline service worker on web.

import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import { PioneerPathProvider } from "@/lib/pioneerPath/store";

type ImportMetaWithEnv = ImportMeta & { env?: { BASE_URL?: string } };

function registerPathServiceWorker() {
  if (Platform.OS !== "web") return;
  if (typeof window === "undefined") return;
  if (typeof navigator === "undefined" || !navigator.serviceWorker) return;
  if (
    window.location.protocol !== "https:" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return;
  }

  const meta = import.meta as ImportMetaWithEnv;
  const base = meta.env?.BASE_URL ?? "/";
  const trimmed = base.endsWith("/") ? base : base + "/";
  const swUrl = `${trimmed}sw-path.js`;

  navigator.serviceWorker.register(swUrl, { scope: trimmed }).catch(() => {});
}

export default function PathLayout() {
  useEffect(() => {
    registerPathServiceWorker();
  }, []);

  return (
    <PioneerPathProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </PioneerPathProvider>
  );
}

import {
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
} from "@expo-google-fonts/jetbrains-mono";
import {
  Lora_400Regular,
  Lora_400Regular_Italic,
  Lora_500Medium,
  Lora_700Bold,
  useFonts,
} from "@expo-google-fonts/lora";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView as RawGestureHandlerRootView } from "react-native-gesture-handler";

const GestureHandlerRootView = RawGestureHandlerRootView as React.ComponentType<{
  style?: { flex: number };
  children?: React.ReactNode;
}>;
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UpdateAvailableBanner } from "@/components/UpdateAvailableBanner";
import { ReaderStateProvider } from "@/contexts/ReaderState";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="contents" />
      <Stack.Screen name="bookmarks" />
      <Stack.Screen name="chapter/[id]" />
      <Stack.Screen name="print/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Lora_400Regular,
    Lora_400Regular_Italic,
    Lora_500Medium,
    Lora_700Bold,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <ReaderStateProvider>
                <RootLayoutNav />
                <UpdateAvailableBanner />
              </ReaderStateProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

import { Stack } from "expo-router";

export default function AuthorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[zone]" />
    </Stack>
  );
}

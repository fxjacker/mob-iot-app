import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* 탭 네비게이션을 불러옴 */}
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
    </Stack>
  );
}

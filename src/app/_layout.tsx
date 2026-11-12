
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="post-screen"
        options={{
          title: "Create a post",
          headerShown: true,
        }}
      />
    </Stack>
  );
}

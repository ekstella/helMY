
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: "Create a post",
          headerShown: true,
        }}
      />
    </Stack>
  );
}

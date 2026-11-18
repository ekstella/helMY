import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="post-screen"
          options={{
            title: "Create a post",
            headerShown: true,
          }}
        />

        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
      </Stack>
    </AuthProvider>
  );
}

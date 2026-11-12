import { ThemedView } from "@/components/themed-view";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";

export default function PostScreen() {
  const router = useRouter();

  return (
    <ThemedView>
      <ThemedText type="title">Create a post</ThemedText>
    </ThemedView>
  );
}

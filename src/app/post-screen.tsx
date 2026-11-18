import { ThemedView } from "@/components/themed-view";
import {
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { TextInput } from "react-native-paper";
import * as React from "react";
import { app } from "../firebaseConfig";
import { getDatabase, ref, push } from "firebase/database";
import { LocationObject } from "expo-location";
import { useSearchParams } from "expo-router/build/hooks/useSearchParams.js";

export default function PostScreen() {
  let searchParams = useSearchParams();
  let longitude = Number(searchParams.get("longitude"));
  let latitude = Number(searchParams.get("latitude"));

  const router = useRouter();

  type Post = {
    title: string;
    locationLongitude: number;
    locationLatitude: number;
  };

  const [post, setPost] = React.useState<Post>({
    title: "",
    locationLatitude: latitude,
    locationLongitude: longitude,
  });

  const handleSave = async () => {
    if (!post.title.trim()) {
      Alert.alert("Error", "Write a post first!");
      return;
    }

    try {
      await push(ref(database, "posts"), {
        title: post.title.trim(),
        createdAt: Date.now(),
        locationLatitude: latitude,
        locationLongitude: longitude,
      });

      Alert.alert("Success", "Your post has been saved!");

      setPost({
        title: "",
        locationLatitude: latitude,
        locationLongitude: longitude,
      });
    } catch (error) {
      console.error("Firebase save error:", error);
      Alert.alert("Error", "Could not save your post.");
    }
  };

  const database = getDatabase(app);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Create a post
        </ThemedText>
        <ThemedView>
          <TextInput
            style={styles.input}
            placeholder="Write your post here..."
            onChangeText={(text) => setPost({ ...post, title: text })}
            value={post.title}
          ></TextInput>
          <View style={styles.buttonRow}>
            <Button style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Post</Text>
            </Button>
          </View>
        </ThemedView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
    paddingBottom: 50,
  },
  code: {
    textTransform: "uppercase",
  },
  map: {
    width: 350,
    height: 430,
  },
  fab: {
    position: "absolute",
    right: 4,
    bottom: 30,
    margin: 35,
  },
  input: {
    height: 100,
    width: 250,
    borderColor: "white",
    borderWidth: 1,
    color: "black",
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    width: 60,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 40,
    gap: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});

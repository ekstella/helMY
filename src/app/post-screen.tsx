import { ThemedView } from "@/components/themed-view";
import {
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { TextInput } from "react-native-paper";
import * as React from "react";
import { app } from "./firebaseConfig";
import { getDatabase, ref, push } from "firebase/database";

export default function PostScreen() {
  const router = useRouter();

  const [text, setText] = React.useState("");

  type Post = {
    title: string;
  };

  const [post, setPost] = React.useState<Post>({
    title: "",
  });
  const [paragraph, setParagraph] = React.useState<Post[]>([]);

  const handleSave = () => {
    if (post.title) {
      push(ref(database, "items/"), post);
    } else {
      Alert.alert("Error", "Type post first");
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
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
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
    height: 60,
    width: 180,
    borderColor: "white",
    borderWidth: 1,
    color: "black",
    textAlign: "center",
  },
});

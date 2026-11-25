import { ThemedView } from "@/components/themed-view";
import {
  Alert,
  Image,
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
import { uuid } from "expo";

export default function PostScreen() {
  let searchParams = useSearchParams();
  let longitude = Number(searchParams.get("longitude"));
  let latitude = Number(searchParams.get("latitude"));

  const router = useRouter();

  type Post = {
    id: string;
    title: string;
    locationLongitude: number;
    locationLatitude: number;
  };

  const [post, setPost] = React.useState<Post>({
    title: "",
    locationLatitude: latitude,
    locationLongitude: longitude,
    id: uuid.v4(),
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
        id: uuid.v4(),
      });

      Alert.alert("Success!", "Your post is on the map! ˚⟡˖ ࣪");

      setPost({
        title: "",
        locationLatitude: latitude,
        locationLongitude: longitude,
        id: uuid.v4(),
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
        <ThemedView style={styles.titleRow}>
          <Image
            style={styles.image}
            source={require("@/assets/images/website.png")}
          ></Image>
          <ThemedText type="title" style={[styles.title, styles.shadowProp]}>
            Create a post
          </ThemedText>
        </ThemedView>
        <ThemedView>
          <TextInput
            style={[styles.input, styles.shadowProp]}
            placeholder="Write your post here..."
            onChangeText={(text) => setPost({ ...post, title: text })}
            value={post.title}
            multiline={true}
          ></TextInput>
          <View style={styles.buttonRow}>
            <Button style={[styles.button, styles.shadowProp]} onPress={handleSave}>
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
    borderColor: "#8E7DBE",
    borderWidth: 5,
    color: "black",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 20,
    paddingTop: 40,
  },
  button: {
    backgroundColor: "lightyellow",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 19,
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  titleRow: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
    gap: 50,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

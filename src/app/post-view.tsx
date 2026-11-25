import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import app from "@/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type Post = {
  title: string;
  locationLongitude: number;
  locationLatitude: number;
  createdAt: number;
  id: string;
};

export default function PostView() {
  const { firebaseKey } = useLocalSearchParams<{ firebaseKey: string }>();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseKey) {
      setLoading(false);
      return;
    }

    const database = getDatabase(app);
    const postRef = ref(database, `posts/${firebaseKey}`);

    const unsubscribe = onValue(postRef, (snapshot) => {
      console.log("Received ID:", firebaseKey);
      console.log("Looking at path:", `posts/${firebaseKey}`);
      console.log("Firebase data:", snapshot.val());
      if (snapshot.exists()) {
        setPost(snapshot.val() as Post);
      } else {
        setPost(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseKey]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
        <ThemedText style={styles.title}>Loading post...</ThemedText>
        <ThemedView style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <ThemedText style={styles.buttonText}>Go back</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    );
  }

  if (!post) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Post not found</ThemedText>
        <ThemedView style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <ThemedText style={styles.buttonText}>Go Back</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View>
        <ThemedText style={styles.details}>
          Posted: {new Date(post.createdAt).toLocaleString()}
        </ThemedText>
      </View>
      <ThemedText style={styles.title}>{post.title}</ThemedText>
      <ThemedView style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <ThemedText style={styles.buttonText}> Go back </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 20,
  },
  details: {
    gap: 10,
    fontStyle: 'italic',
    fontSize: 12,
  },
  title: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    fontSize: 25,
  },
  button: {
    backgroundColor: "#F1E3D3",
    width: 110,
    height: 55,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 19,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 40,
    gap: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});

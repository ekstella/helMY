import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router, useRoute, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import app from "@/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

type Post = {
  firebaseKey: string;
  id: string;
  title: string;
  locationLatitude: number;
  locationLongitude: number;
  createdAt: number;
};

export default function TabTwoScreen() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const database = getDatabase(app);

    const postsRef = ref(database, "posts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      console.log("Firebase snapshot exists:", snapshot.exists());
      console.log("Firebase snapshot data:", snapshot.val());
      const posts = snapshot.val();

      if (posts) {
        const postsArray = Object.entries(posts).map(([key, post]) => ({
          ...(post as Omit<Post, "firebaseKey">),
          firebaseKey: key,
        }));

        postsArray.sort((a, b) => b.createdAt - a.createdAt);

        setPosts(postsArray);
      } else {
        setPosts([]);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large"></ActivityIndicator>
        <ThemedText>Loading posts...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText style={styles.title}>All posts</ThemedText>
        {posts.length === 0 ? (
          <ThemedText>No posts yet</ThemedText>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.firebaseKey}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable
                style={styles.post}
                onPress={() =>
                  router.push({
                    pathname: "/post-view",
                    params: { firebaseKey: item.firebaseKey },
                  })
                }
              >
                <ThemedText style={styles.postTitle}>{item.title}</ThemedText>

                <ThemedText style={styles.postTitle}>
                  Posted: {new Date(item.createdAt).toLocaleString()}
                </ThemedText>

                <ThemedText style={styles.readMore}>View post</ThemedText>
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    flexDirection: "row",
  },
  centerText: {
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 20,
  },
  button: {
    backgroundColor: "lightyellow",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: "black",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  list: {
    gap: 15,
    paddingBottom: 30,
  },
  post: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#eeeeee",
    gap: 8,
  },
  readMore: {
    color: "#3366cc",
    fontWeight: "bold",
    marginTop: 5,
  },
  postTitle: {
    color: "black",
  }
});

import * as Device from "expo-device";
import { Alert, Image, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { FAB } from "react-native-paper";
import React from "react";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { useRouter } from "expo-router";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "@/firebaseConfig";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const router = useRouter();

  const db = getDatabase(app);

  type Post = {
    firebaseKey: string;
    title: string;
    locationLongitude: number;
    locationLatitude: number;
    createdAt: number;
    id: string;
  };

  const [posts, setPosts] = React.useState<Post[]>([]);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "posts"), (snapshot) => {
      const posts = snapshot.val();
      // const posts = Object.values(snapshot.val()) as Post[];
      // setPosts(posts);

      if (posts) {
        const postsArray = Object.entries(posts).map(([key, post]) => ({
          ...(post as Omit<Post, "firebaseKey">),
          firebaseKey: key,
        }));

        console.log("Posts: ", postsArray);
        setPosts(postsArray);
      } else {
        setPosts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permission to get location");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedView style={styles.titleRow}>
            <Image style={styles.titleImage} source={require("@/assets/images/sun.png")}></Image>
            <ThemedText type="title" style={[styles.title, styles.shadowProp]}>
              Welcome to&nbsp;helmy
            </ThemedText>
            <Image style={styles.titleImage} source={require("@/assets/images/sun.png")}></Image>
          </ThemedView>
          <MapView
            style={[styles.map, styles.shadowProp]}
            initialRegion={{
              latitude: 60.19083,
              longitude: 24.9675,
              latitudeDelta: 0.2,
              longitudeDelta: 0.2,
            }}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location?.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="You are here :)"
              />
            )}
            {posts &&
              posts.map((post) => {
                return (
                  <Marker
                    key={post.firebaseKey}
                    coordinate={{
                      latitude: post.locationLatitude,
                      longitude: post.locationLongitude,
                    }}
                    title={post.title}
                    onPress={() =>
                      router.push({
                        pathname: "/post-view",
                        params: { firebaseKey: post.firebaseKey },
                      })
                    }
                  >
                    <Image
                      source={require("@/assets/images/location.png")}
                      style={styles.markerImage}
                    ></Image>
                  </Marker>
                );
              })}
          </MapView>
          <FAB
            icon={({ size, color }) => (
              <FontAwesomeFreeSolid name="heart" size={size} color="#FC7A1E" />
            )}
            label="Add post"
            onPress={() =>
              router.push(
                `/post-screen?longitude=${location?.coords.longitude}&latitude=${location?.coords.latitude}`
              )
            }
            visible={true}
            style={styles.fab}
            color="#521945"
          ></FAB>
          <ThemedText>────۶ৎ────</ThemedText>
        </ThemedView>

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
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
    flexShrink: 1,
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
    borderColor: "#8E7DBE",
    borderWidth: 5,
    borderRadius: 7,
  },
  fab: {
    position: "absolute",
    right: 4,
    bottom: 10,
    margin: 35,
  },
  markerImage: {
    width: 35,
    height: 35,
  },
  titleImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
    gap: 8,
    paddingTop: 80,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

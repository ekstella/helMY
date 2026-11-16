import * as Device from "expo-device";
import { Alert, Platform, StyleSheet } from "react-native";
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
import { getDatabase, ref, onValue } from "@firebase/database";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const router = useRouter();

  const db = getDatabase();

  type Post = {
    title: string;
    locationLongitude: number;
    locationLatitude: number;
    createdAt: number;
  };

  const [posts, setPosts] = React.useState<Post[]>([]);

  useEffect(() => {
    console.log("pieru");
    const unsubscribe = onValue(ref(db, "posts"), (snapshot) => {
      const posts = Object.values(snapshot.val()) as Post[];
      console.log(posts);
      setPosts(posts);
    });
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
          <ThemedText type="title" style={styles.title}>
            Welcome to&nbsp;helMY
          </ThemedText>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 60.17083,
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
                    coordinate={{
                      latitude: post.locationLatitude,
                      longitude: post.locationLongitude,
                    }}
                    title={post.title}
                  ></Marker>
                );
              })}
          </MapView>
          <FAB
            icon={({ size, color }) => (
              <FontAwesomeFreeSolid name="heart" size={size} color={color} />
            )}
            label="Add post"
            onPress={() =>
              router.push(
                `/post-screen?longitude=${location?.coords.longitude}&latitude=${location?.coords.latitude}`
              )
            }
            visible={true}
            style={styles.fab}
          ></FAB>
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
});

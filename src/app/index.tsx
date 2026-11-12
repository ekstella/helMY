import * as Device from "expo-device";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  I18nManager,
  ScrollView,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { FAB, Title, AnimatedFAB } from "react-native-paper";
import React from "react";
import { PaperProvider } from "react-native-paper";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [isExtended, setIsExtended] = useState(true);

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
            <Marker
              coordinate={{
                latitude: 60.201373,
                longitude: 24.934041,
              }}
              title="You are here :)"
            />
          </MapView>
          <AnimatedFAB
            icon="plus"
            label="Add post"
            extended={isExtended}
            onPress={() => console.log("Pressed")}
            visible={true}
            animateFrom="right"
            iconMode="static"
            style={styles.fab}
          ></AnimatedFAB>
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
    width: "350",
    height: "430",
  },
  fab: {
    position: "absolute",
    right: 10,
    bottom: 30,
    margin: 35,
  },
});

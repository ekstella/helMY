import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { signOut, getAuth } from "firebase/auth";
import app from "@/firebaseConfig";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error("Logout error: ", error);
      alert(error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {user ? (
        <>
          <Image
            style={styles.image}
            source={require("@/assets/images/gift-box.png")}
          ></Image>
          <ThemedText style={styles.title}>Hello, {user.email}!</ThemedText>
          <ThemedView style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log out</Text>
            </Pressable>
          </ThemedView>
        </>
      ) : (
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>You are not logged in</ThemedText>
          <ThemedView style={styles.buttonRow}>
            <Pressable
              style={styles.button}
              onPress={() => router.push("/sign-up")}
            >
              <Text style={styles.buttonText}> Sign up </Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => router.push("/log-in")}
            >
              <Text style={styles.buttonText}> Log in </Text>
            </Pressable>
          </ThemedView>
          <ThemedText style={styles.decoration}>. ݁⋆ ۶ৎ ݁˖ . ݁</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 20,
    paddingBottom: 10,
  },
  button: {
    backgroundColor: "#F1E3D3",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 19,
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
    fontSize: 26,
  },
  input: {
    height: 100,
    width: 250,
    borderColor: "white",
    borderWidth: 1,
    color: "white",
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
    flexDirection: "column",
  },
  image: {
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
  decoration: {
    textAlign: "center",
    fontSize: 20,
  },
});

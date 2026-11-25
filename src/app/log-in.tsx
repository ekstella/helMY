import React, { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/firebaseConfig";
import * as SecureStore from "expo-secure-store";
import SignUp from "./sign-up";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";

type Props = {
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
};

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { user } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      await signInWithEmailAndPassword(getAuth(app), email.trim(), password);
      alert("Login successful!");
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Log in</ThemedText>
        <TextInput
          placeholder="Enter Email"
          placeholderTextColor="black"
          style={styles.input}
          onChangeText={setEmail}
          inputMode="email"
        ></TextInput>
        <TextInput
          placeholder="Enter Password"
          placeholderTextColor="black"
          style={styles.input}
          onChangeText={setPassword}
          textContentType="password"
          secureTextEntry={true}
          
        ></TextInput>
        <ThemedView style={styles.buttonRow}>
          <Pressable style={[styles.button, styles.shadowProp]} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </Pressable>
        </ThemedView>
        )
      </ThemedView>
    </TouchableWithoutFeedback>
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
  },
  button: {
    backgroundColor: "lightyellow",
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
    fontSize: 24,
  },
  input: {
    height: 100,
    width: 250,
    borderColor: "#8E7DBE",
    borderWidth: 4,
    color: "black",
    textAlign: "center",
    backgroundColor: "#F1E3D3",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
    flexDirection: "column",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

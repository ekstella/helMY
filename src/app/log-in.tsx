import React from "react";
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

export default function LogIn() {
  const [status, setStatus] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authenticated, setAuthenticated] = React.useState(false);
  const auth = getAuth(app);

  const handleLogin = () => {
    if (email == "" || password == "") {
      return alert("Password and email are required");
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;

        await SecureStore.setItemAsync("user", JSON.stringify(user));
        setAuthenticated(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        {authenticated ? (
          <ThemedView>
            <Text style={styles.title}>You are now logged in</Text>
          </ThemedView>
        ) : (
          <>
            <Text style={styles.title}>Log in Here</Text>
            <TextInput
              placeholder="Enter Email"
              style={styles.input}
              onChangeText={setEmail}
              inputMode="email"
            ></TextInput>
            <TextInput
              placeholder="Enter Password"
              style={styles.input}
              onChangeText={setPassword}
              textContentType="password"
            ></TextInput>
            <ThemedView style={styles.buttonRow}>
              <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
              </Pressable>
            </ThemedView>
          </>
        )}
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
});

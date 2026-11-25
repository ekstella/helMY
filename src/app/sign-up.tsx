import { useContext, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "@/firebaseConfig";
import { ThemedView } from "@/components/themed-view";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { getDatabase, ref, set } from "firebase/database";
import { router } from "expo-router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);
  const database = getDatabase(app);

  const handleRegister = async () => {
    if (email == "" || password == "") {
      alert("Email and password are required");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      await set(ref(database, "users/" + user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: Date.now(),
      });

      alert("User created successfully");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Sign up</ThemedText>
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
        ></TextInput>
        <ThemedView style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.shadowProp]}
            onPress={() => {
              {
                handleRegister;
              }
              router.push("/log-in");
            }}
          >
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: "center",
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
    fontSize: 25,
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

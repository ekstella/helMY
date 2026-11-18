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
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then(() => {
    //     alert("User created successfully");
    //   })
    //   .catch((e) => {
    //     alert(e.message);
    //   });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Sign Up</ThemedText>
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
          <Pressable style={styles.button} onPress={handleRegister}>
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
    fontSize: 25,
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

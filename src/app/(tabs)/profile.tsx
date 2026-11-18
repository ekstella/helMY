import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { signOut, getAuth } from 'firebase/auth';
import app from '@/firebaseConfig';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthContext';

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
                    <ThemedText style={styles.title}>
                        Hello, {user.email}!
                    </ThemedText>

                    <ThemedText>
                        Your user ID: {user.uid}
                    </ThemedText>

                    <ThemedView style={styles.buttonRow}>
                        <Pressable
                        style={styles.button}
                        onPress={handleLogout}
                        >
                            <Text style={styles.buttonText}>
                                Log out
                            </Text>
                        </Pressable>
                    </ThemedView>
                </>
            ) : (
                <ThemedText style={styles.title}>
                    You are not logged in
                </ThemedText>
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
  
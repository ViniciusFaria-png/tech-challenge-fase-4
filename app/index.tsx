import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/contexts/AuthContext";

export default function Index() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="displayMedium" style={styles.title}>
          EducaTech
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Plataforma de Ensino
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.push("/(auth)/login")}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Fazer Login
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push("/(tabs)")}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Entrar como Visitante
          </Button>

          <View style={styles.signupContainer}>
            <Text variant="bodyMedium" style={styles.signupText}>
              Não tem uma conta?
            </Text>
            <Button
              mode="text"
              onPress={() => router.push("/(auth)/signup-student")}
              compact
            >
              Criar conta
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: {
    color: '#5B7C99',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    marginBottom: 60,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  signupContainer: {
    marginTop: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#666',
  },
});

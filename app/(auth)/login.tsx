import { Link } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await login(email, senha);
    } catch {
      setError("Falha no login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text variant="displaySmall" style={styles.title}>EducaTech</Text>
          <Text variant="titleMedium" style={styles.subtitle}>Faça login para continuar</Text>
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          
          {!!error && <HelperText type="error">{error}</HelperText>}

          <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
            Entrar
          </Button>

          <View style={styles.guestContainer}>
            <Link href="/(tabs)" asChild>
              <Button mode="text">Entrar como Visitante</Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', marginBottom: 8, color: '#5B7C99', fontWeight: 'bold' },
  subtitle: { textAlign: 'center', marginBottom: 40, color: '#666' },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
  footer: { marginTop: 32, alignItems: 'center' },
  footerText: { marginBottom: 16, color: '#666' },
  footerButton: { marginBottom: 12, width: '100%' },
  guestContainer: { marginTop: 16, alignItems: 'center' },
});
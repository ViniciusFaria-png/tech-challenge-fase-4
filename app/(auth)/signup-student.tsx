import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { signUp } from "../../src/actions/auth";

export default function SignUpStudent() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await signUp({ email, senha }); 
      alert("Conta criada! Faça login.");
      router.back();
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
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
          <Text variant="headlineMedium" style={styles.title}>Cadastro de Aluno</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Preencha os dados para criar sua conta</Text>
          
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
          
          <Button 
            mode="contained" 
            onPress={handleRegister} 
            loading={loading} 
            style={styles.button}
          >
            Cadastrar
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Voltar
          </Button>
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
  subtitle: { textAlign: 'center', marginBottom: 32, color: '#666' },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
  backButton: { marginTop: 12 },
});
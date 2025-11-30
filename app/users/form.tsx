import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { Appbar, Button, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUser, updateUser } from "../../src/actions/users";

export default function UserFormScreen() {
  const { id, role } = useLocalSearchParams<{ id?: string, role: 'professor' | 'student' }>();
  const isEditing = !!id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name || !email || (!isEditing && !senha)) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (isEditing) {
        await updateUser(id, { name, email, role, ...(senha ? { senha } : {}) });
        Alert.alert("Sucesso", "Usuário atualizado!");
      } else {
        await createUser({ name, email, senha, role });
        Alert.alert("Sucesso", "Usuário criado!");
      }
      router.back();
    } catch (e) {
      setError("Erro ao salvar dados. Verifique e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={isEditing ? "Editar Usuário" : `Novo ${role === 'professor' ? 'Professor' : 'Aluno'}`} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Nome Completo"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          disabled={isEditing}
        />
        <TextInput
          label={isEditing ? "Nova Senha (opcional)" : "Senha"}
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        {!!error && <HelperText type="error" visible>{error}</HelperText>}

        <Button 
          mode="contained" 
          onPress={handleSave} 
          loading={loading} 
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          Salvar
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  input: { marginBottom: 16 },
  button: { marginTop: 10, backgroundColor: '#5B7C99' }
});
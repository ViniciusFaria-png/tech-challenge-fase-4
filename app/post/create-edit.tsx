import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createPost, getPost, updatePost } from "../../src/actions/posts";
import { useAuth } from "../../src/contexts/AuthContext";

export default function PostCreateEditScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;
  const { user } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [resumo, setResumo] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  async function loadPost() {
    setLoading(true);
    try {
      const data = await getPost(id as string);
      setTitulo(data.titulo);
      setConteudo(data.conteudo);
      setResumo(data.resumo || "");
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar post.");
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!titulo || !conteudo) {
      Alert.alert("Atenção", "Título e Conteúdo são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const payload = { 
        titulo, 
        conteudo, 
        resumo, 
        professor_id: user?.professorId || 0 
      };

      if (isEditing) {
        await updatePost(id as string, payload);
        Alert.alert("Sucesso", "Post atualizado!");
      } else {
        await createPost(payload);
        Alert.alert("Sucesso", "Post criado!");
      }
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={isEditing ? "Editar Post" : "Novo Post"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Título"
          value={titulo}
          onChangeText={setTitulo}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Resumo (Opcional)"
          value={resumo}
          onChangeText={setResumo}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Conteúdo Completo"
          value={conteudo}
          onChangeText={setConteudo}
          mode="outlined"
          multiline
          numberOfLines={10}
          style={[styles.input, styles.textArea]}
        />

        <Button 
          mode="contained" 
          onPress={handleSave} 
          loading={loading}
          style={styles.button}
        >
          {isEditing ? "Atualizar Publicação" : "Publicar"}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  input: { marginBottom: 16, backgroundColor: '#fff' },
  textArea: { minHeight: 150, textAlignVertical: 'top' },
  button: { marginTop: 8, paddingVertical: 6, backgroundColor: '#5B7C99' }
});
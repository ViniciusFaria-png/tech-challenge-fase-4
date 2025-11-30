import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { createPost, getPost, updatePost } from "../../src/actions/posts";
import { useAuth } from "../../src/contexts/AuthContext";

export default function CreateEditPost() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const isEdit = !!id;

  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getPost(id as string).then((p) => {
        setTitulo(p.titulo);
        setResumo(p.resumo || "");
        setConteudo(p.conteudo);
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!user?.professorId) return alert("Erro: ID Professor não encontrado");
    
    setLoading(true);
    try {
      const data = { titulo, resumo, conteudo };
      if (isEdit) {
        await updatePost(id as string, data);
      } else {
        await createPost({ ...data, professor_id: user.professorId });
      }
      router.back();
    } catch (e) {
      alert("Erro ao salvar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: isEdit ? "Editar Post" : "Novo Post" }} />
      <View style={styles.container}>
        <TextInput label="Título" value={titulo} onChangeText={setTitulo} mode="outlined" style={styles.input} />
        <TextInput label="Resumo" value={resumo} onChangeText={setResumo} mode="outlined" style={styles.input} />
        <TextInput 
            label="Conteúdo" 
            value={conteudo} 
            onChangeText={setConteudo} 
            mode="outlined" 
            multiline 
            numberOfLines={10} 
            style={[styles.input, { height: 200 }]} 
        />
        <Button mode="contained" onPress={handleSave} loading={loading}>
          {isEdit ? "Atualizar" : "Publicar"}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: { marginBottom: 15 },
});
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPost } from "../../src/actions/posts";
import { IPost } from "../../src/types";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPost(id as string)
        .then(setPost)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="titleLarge">Post não encontrado</Text>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Detalhes do Post",
          headerShown: true,
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Text variant="headlineMedium" style={styles.title}>
          {post.titulo}
        </Text>
        {post.resumo && (
          <Text variant="titleMedium" style={styles.summary}>
            {post.resumo}
          </Text>
        )}
        <Text variant="bodyLarge" style={styles.content}>
          {post.conteudo}
        </Text>
        <View style={styles.footer}>
          <Text variant="labelSmall" style={styles.date}>
            Publicado em: {new Date(post.created_at).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  summary: {
    marginBottom: 24,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  content: {
    lineHeight: 28,
    color: '#333',
    textAlign: 'justify',
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  date: {
    color: '#999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginTop: 16,
  },
});
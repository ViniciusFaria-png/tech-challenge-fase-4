import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, IconButton, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPosts, searchPosts } from "../../src/actions/posts";
import PostCard from "../../src/components/PostCard";
import { useAuth } from "../../src/contexts/AuthContext";
import { IPost } from "../../src/types";

export default function FeedScreen() {
  const { filter } = useLocalSearchParams();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { user, logout, isAuthenticated } = useAuth();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let data = query.length > 2 ? await searchPosts(query) : await getPosts();
      if (filter === 'my-posts' && user?.professorId) {
        data = data.filter((post: any) => post.professor_id === user.professorId);
      }
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [query, filter, user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          {filter === 'my-posts' ? 'Meus Posts' : 'Feed de Posts'}
        </Text>
        
        {isAuthenticated ? (
          <IconButton
            icon="logout"
            size={24}
            onPress={logout}
            iconColor="#d32f2f"
          />
        ) : (
          <Button 
            mode="text" 
            textColor="#5B7C99"
            onPress={() => router.push("/(auth)/login")}
          >
            Entrar
          </Button>
        )}
      </View>

      <Searchbar
        placeholder="Buscar posts..."
        onChangeText={setQuery}
        value={query}
        style={styles.search}
      />
      
      {loading ? (
        <ActivityIndicator animating={true} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              isProfessor={!!user?.isProfessor}
              currentProfessorId={user?.professorId}
              onPress={() => router.push(`/post/${item.id}`)}
              onEdit={() => router.push({ pathname: "/post/create-edit", params: { id: item.id } })}
              onDelete={() => {}}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum post encontrado</Text>
          }
          contentContainerStyle={posts.length === 0 ? styles.emptyList : undefined}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#5B7C99',
  },
  search: { margin: 16 },
  emptyList: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' },
});
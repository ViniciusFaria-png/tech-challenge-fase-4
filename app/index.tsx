import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signUp } from "../src/actions/auth";
import { deletePost, getPosts, searchPosts } from "../src/actions/posts";
import AppLayout from "../src/components/layout/AppLayout";
import LoginDialog from "../src/components/LoginModal";
import PostCard from "../src/components/PostCard";
import { useAuth } from "../src/hooks/useAuth";
import type { IPost } from "../src/types/post";

const POSTS_PER_PAGE = 5;

export default function PostPage() {
  const router = useRouter();
  const { isAuthenticated, login, logout, user } = useAuth();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const [viewAsGuest, setViewAsGuest] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const isProfessorView = user?.isProfessor && !viewAsGuest;

  useEffect(() => {
    fetchPosts();
  }, [user, viewAsGuest]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      let postsData = await getPosts();

      if (isProfessorView && user?.professorId) {
        postsData = postsData.filter(
          (post: IPost) =>
            String(post.professor_id) === String(user.professorId),
        );
      }

      const sortedPosts = postsData.sort((a: IPost, b: IPost) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      setPosts(sortedPosts);
      setCurrentPage(1);
    } catch (err) {
      setError("Erro ao carregar posts. Verifique sua conexão.");
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2 || query.length === 0) {
      try {
        setLoading(true);
        setError(null);
        let postsData =
          query.length === 0 ? await getPosts() : await searchPosts(query);

        if (isProfessorView && user?.professorId) {
          postsData = postsData.filter(
            (post: IPost) =>
              String(post.professor_id) === String(user.professorId),
          );
        }
        setPosts(postsData);
        setCurrentPage(1);
      } catch (err) {
        setError("Erro ao buscar posts. Tente novamente.");
        console.error("Erro ao buscar posts:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);

    try {
      await login(loginData.email, loginData.senha);
      setLoginOpen(false);
      setLoginData({ email: "", senha: "" });
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "Email ou senha inválidos."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignUp = async (data: { email: string; senha: string }) => {
    await signUp(data);
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeletePost = async (post: IPost) => {
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir o post "${post.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePost(post.id);
              setPosts((prevPosts) => {
                const newPosts = prevPosts.filter((p) => p.id !== post.id);
                const totalPages = Math.ceil(newPosts.length / POSTS_PER_PAGE);
                if (currentPage > totalPages && totalPages > 0) {
                  setCurrentPage(totalPages);
                }
                return newPosts;
              });
            } catch (err) {
              setError("Erro ao excluir o post. Tente novamente.");
              console.error("Erro ao excluir post:", err);
            }
          },
        },
      ]
    );
  };

  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Carregando publicações...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (posts.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {isProfessorView
              ? "Você ainda não criou nenhum post."
              : "Nenhum post encontrado."}
          </Text>
          {isAuthenticated && user?.isProfessor && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push({ pathname: "/post/create" })}
            >
              <Text style={styles.createButtonText}>Criar Primeiro Post</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.postsContainer}>
        {currentPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isProfessor={Boolean(isAuthenticated && isProfessorView)}
            currentProfessorId={user?.professorId}
            onView={(p) =>
              router.push({ pathname: "/post/[id]", params: { id: String(p.id) } })
            }
            onEdit={(p) =>
              router.push({ pathname: "/post/edit/[id]", params: { id: String(p.id) } })
            }
            onDelete={handleDeletePost}
          />
        ))}

        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <View style={styles.paginationButtons}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.pageButtonDisabled,
                ]}
                onPress={handlePrevPage}
                disabled={currentPage === 1}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    currentPage === 1 && styles.pageButtonTextDisabled,
                  ]}
                >
                  Anterior
                </Text>
              </TouchableOpacity>

              <Text style={styles.pageInfo}>
                Página {currentPage} de {totalPages}
              </Text>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.pageButtonDisabled,
                ]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    currentPage === totalPages && styles.pageButtonTextDisabled,
                  ]}
                >
                  Próxima
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.totalPosts}>
              {posts.length} {posts.length === 1 ? "post" : "posts"} no total
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      onLoginClick={() => setLoginOpen(true)}
      onLogout={handleLogout}
      onAddPostClick={() => router.push({ pathname: "/post/create" })}
      isProfessor={user?.isProfessor || false}
    >
      <ScrollView
        style={[
          styles.container,
          isProfessorView && styles.professorContainer,
        ]}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isProfessorView ? "Tela Administrativa" : "Blog EducaTech"}
          </Text>
          <Text style={styles.subtitle}>
            {isProfessorView
              ? "Bem vindo professor, aqui você pode gerenciar seus posts."
              : "Compartilhando conhecimento educacional"}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por posts"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {user?.isProfessor && (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setViewAsGuest(!viewAsGuest)}
            >
              <Text style={styles.toggleButtonText}>
                {viewAsGuest ? "Visão do Professor" : "Ver como Visitante"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {renderContent()}
      </ScrollView>

      <LoginDialog
        visible={loginOpen}
        onDismiss={() => {
          setLoginOpen(false);
          setLoginError(null);
          setLoginData({ email: "", senha: "" });
        }}
        onSubmit={handleLogin}
        loginData={loginData}
        setLoginData={setLoginData}
        loading={loginLoading}
        error={loginError}
        onSignUp={handleSignUp}
      />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  professorContainer: {
    backgroundColor: "#e0e0e0",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    color: "#333",
  },
  toggleButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1976d2",
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#1976d2",
    fontSize: 14,
    fontWeight: "600",
  },
  postsContainer: {
    paddingHorizontal: 10,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#c62828",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  paginationContainer: {
    padding: 20,
    alignItems: "center",
  },
  paginationButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  pageButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 90,
    alignItems: "center",
  },
  pageButtonDisabled: {
    backgroundColor: "#ccc",
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pageButtonTextDisabled: {
    color: "#999",
  },
  pageInfo: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  totalPosts: {
    fontSize: 14,
    color: "#666",
  },
});
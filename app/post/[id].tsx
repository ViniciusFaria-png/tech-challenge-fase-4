import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { signUp } from "../../src/actions/auth";
import { getPost } from "../../src/actions/posts";
import AppLayout from "../../src/components/layout/AppLayout";
import LoginDialog from "../../src/components/LoginModal";
import { useAuth } from "../../src/hooks/useAuth";
import { useProfessorName } from "../../src/hooks/useProfessorName";
import type { IPost } from "../../src/types/post";

export default function PostDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [loginOpen, setLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { isAuthenticated, logout, login, user } = useAuth();

  const { professorName, isLoading: professorLoading } = useProfessorName(
    post?.professor_id ?? ""
  );

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("ID do post não encontrado na URL.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const postData = await getPost(id as string);
        setPost(postData);
      } catch {
        setError(
          "Erro ao carregar o post. Ele pode não existir ou a conexão falhou."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Carregando post...</Text>
        </View>
      );
    }

    if (error || !post) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Post não encontrado."}</Text>
        </View>
      );
    }

    return (
      <View style={styles.postContainer}>
        <Text style={styles.title}>{post.titulo}</Text>

        {post.resumo && <Text style={styles.resumo}>{post.resumo}</Text>}

        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            Por{" "}
            {professorLoading ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text style={styles.bold}>{professorName}</Text>
            )}
          </Text>
          <Text style={styles.metaText}> • </Text>
          <Text style={styles.metaText}>
            Publicado em {formatDate(post.created_at)}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.content}>{post.conteudo}</Text>
      </View>
    );
  };

  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      onLoginClick={() => setLoginOpen(true)}
      onLogout={logout}
      onAddPostClick={() => router.push({ pathname: "/post/create" })}
      isProfessor={user?.isProfessor}
    >
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

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
  backButton: {
    padding: 20,
    paddingBottom: 10,
  },
  backButtonText: {
    color: "#1976d2",
    fontSize: 16,
    fontWeight: "600",
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
  },
  postContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  resumo: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
  bold: {
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
  },
});
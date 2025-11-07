import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { signUp } from "../../../src/actions/auth";
import { createPost, getPost, updatePost } from "../../../src/actions/posts";
import AppLayout from "../../../src/components/layout/AppLayout";
import LoginModal from "../../../src/components/LoginModal";
import { useAuth } from "../../../src/hooks/useAuth";

interface FormState {
  titulo: string;
  resumo: string;
  conteudo: string;
}

export default function PostCreateEditPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const isEditMode = Boolean(id);

  const { user, isAuthenticated, logout, login } = useAuth();

  const [formState, setFormState] = useState<FormState>({
    titulo: "",
    resumo: "",
    conteudo: "",
  });
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Estados para login dialog
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (!user?.isProfessor) {
      setError("Apenas professores podem criar/editar posts.");
      return;
    }

    if (!user?.professorId) {
      setError("ID do professor não encontrado. Faça login novamente.");
      return;
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isEditMode && id && user?.professorId) {
      const fetchPostData = async () => {
        try {
          setLoading(true);
          setError(null);
          setIsReadOnly(false);
          const postData = await getPost(id as string);

          setFormState({
            titulo: postData.titulo || "",
            resumo: postData.resumo || "",
            conteudo: postData.conteudo || "",
          });

          if (String(postData.professor_id) !== String(user.professorId)) {
            setError("Você não tem permissão para editar este post.");
            setIsReadOnly(true);
          }
        } catch (err) {
          console.error("Erro ao carregar post:", err);
          setError("Não foi possível carregar os dados do post para edição.");
        } finally {
          setLoading(false);
        }
      };
      fetchPostData();
    }
  }, [id, isEditMode, user?.professorId]);

  const handleChange = (name: keyof FormState, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setError("Sessão expirada. Faça login novamente.");
      setTimeout(() => {
        logout();
        router.replace("/");
      }, 2000);
      return;
    }

    if (!user?.professorId) {
      setError("ID do professor não encontrado. Faça login novamente.");
      return;
    }

    if (!user?.isProfessor) {
      setError("Apenas professores podem criar/editar posts.");
      return;
    }

    if (!formState.titulo.trim() || !formState.conteudo.trim()) {
      Alert.alert("Erro", "Título e conteúdo são obrigatórios.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isEditMode && id) {
        await updatePost(id as string, formState);
        setSuccessMessage("Post atualizado com sucesso!");
      } else {
        const postData = {
          ...formState,
          professor_id: user.professorId,
        };

        console.log("Criando post com dados:", postData);
        await createPost(postData);
        setSuccessMessage("Post criado com sucesso!");
      }

      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (err) {
      console.error("Erro ao salvar post:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(
        `Falha ao ${isEditMode ? "atualizar" : "criar"} o post: ${errorMessage}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderForm = () => {
    if (!isAuthenticated) {
      return (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            Você precisa estar logado para acessar esta página.
          </Text>
        </View>
      );
    }

    if (!user?.isProfessor) {
      return (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            Apenas professores podem criar/editar posts.
          </Text>
        </View>
      );
    }

    if (!user?.professorId) {
      return (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            ID do professor não encontrado. Faça login novamente.
          </Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Carregando dados do post...</Text>
        </View>
      );
    }

    return (
      <View style={styles.form}>
        <Text style={styles.label}>Título do Post *</Text>
        <TextInput
          style={[styles.input, isReadOnly && styles.inputDisabled]}
          value={formState.titulo}
          onChangeText={(value) => handleChange("titulo", value)}
          placeholder="Digite o título"
          placeholderTextColor="#999"
          editable={!submitting && !isReadOnly}
        />

        <Text style={styles.label}>Resumo (Opcional)</Text>
        <TextInput
          style={[styles.input, isReadOnly && styles.inputDisabled]}
          value={formState.resumo}
          onChangeText={(value) => handleChange("resumo", value)}
          placeholder="Um breve resumo do seu post"
          placeholderTextColor="#999"
          editable={!submitting && !isReadOnly}
        />

        <Text style={styles.label}>Conteúdo Completo *</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            isReadOnly && styles.inputDisabled,
          ]}
          value={formState.conteudo}
          onChangeText={(value) => handleChange("conteudo", value)}
          placeholder="Escreva o conteúdo completo do seu post"
          placeholderTextColor="#999"
          multiline
          numberOfLines={12}
          textAlignVertical="top"
          editable={!submitting && !isReadOnly}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            (submitting || isReadOnly) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting || isReadOnly}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditMode ? "Salvar Alterações" : "Publicar Post"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      onLoginClick={() => setLoginOpen(true)}
      onLogout={logout}
      onAddPostClick={() => {}}
      isProfessor={user?.isProfessor}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>

          <View style={styles.paper}>
            <Text style={styles.title}>
              {isEditMode ? "Editar Publicação" : "Criar Nova Publicação"}
            </Text>
            <Text style={styles.subtitle}>
              {isEditMode
                ? "Ajuste as informações necessárias e salve as alterações."
                : "Preencha os campos abaixo para compartilhar um novo conteúdo."}
            </Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {successMessage && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}

            {renderForm()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoginModal
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
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#1976d2",
    fontWeight: "600",
  },
  paper: {
    margin: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  alertContainer: {
    backgroundColor: "#fff3cd",
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
  },
  alertText: {
    color: "#856404",
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: "#2e7d32",
    fontSize: 14,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  form: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  inputDisabled: {
    backgroundColor: "#e0e0e0",
    color: "#999",
  },
  textArea: {
    minHeight: 200,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
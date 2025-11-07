import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';

interface LoginModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (e: any) => void;
  loginData: { email: string; senha: string };
  setLoginData: React.Dispatch<
    React.SetStateAction<{ email: string; senha: string }>
  >;
  loading: boolean;
  error: string | null;
  onSignUp?: (data: { email: string; senha: string }) => Promise<void>;
}

export default function LoginModal({
  visible,
  onDismiss,
  onSubmit,
  loginData,
  setLoginData,
  loading,
  error,
  onSignUp,
}: LoginModalProps) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpData, setSignUpData] = useState({
    email: '',
    senha: '',
    confirmSenha: '',
  });
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleClose = () => {
    setIsSignUpMode(false);
    setSignUpData({ email: '', senha: '', confirmSenha: '' });
    setSignUpError(null);
    setSignUpSuccess(false);
    onDismiss();
  };

  const handleToggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setSignUpError(null);
    setSignUpSuccess(false);
  };

  const handleSignUp = async () => {
    setSignUpError(null);

    if (signUpData.senha !== signUpData.confirmSenha) {
      setSignUpError('As senhas não coincidem');
      return;
    }

    if (signUpData.senha.length < 6) {
      setSignUpError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (!onSignUp) {
      setSignUpError('Função de cadastro não configurada');
      return;
    }

    setSignUpLoading(true);

    try {
      await onSignUp({
        email: signUpData.email,
        senha: signUpData.senha,
      });

      setSignUpSuccess(true);
      setSignUpData({ email: '', senha: '', confirmSenha: '' });

      setTimeout(() => {
        setIsSignUpMode(false);
        setSignUpSuccess(false);
      }, 2000);
    } catch (err) {
      setSignUpError(
        err instanceof Error
          ? err.message
          : 'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView>
            <Text variant="headlineSmall" style={styles.title}>
              {isSignUpMode ? 'Criar Conta de Aluno' : 'Acesso do Professor'}
            </Text>

            {!isSignUpMode ? (
              <View style={styles.form}>
                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}

                <TextInput
                  label="Email"
                  value={loginData.email}
                  onChangeText={(text) =>
                    setLoginData((prev) => ({ ...prev, email: text }))
                  }
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  disabled={loading}
                  style={styles.input}
                />

                <TextInput
                  label="Senha"
                  value={loginData.senha}
                  onChangeText={(text) =>
                    setLoginData((prev) => ({ ...prev, senha: text }))
                  }
                  mode="outlined"
                  secureTextEntry
                  disabled={loading}
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  onPress={onSubmit}
                  disabled={loading}
                  style={styles.button}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : 'Entrar'}
                </Button>

                {onSignUp && (
                  <View style={styles.linkContainer}>
                    <Text variant="bodySmall">Não tem uma conta de aluno? </Text>
                    <Button
                      mode="text"
                      onPress={handleToggleMode}
                      disabled={loading}
                      compact
                    >
                      Crie uma agora
                    </Button>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.form}>
                {signUpSuccess && (
                  <Text style={styles.successText}>
                    Conta criada com sucesso! Redirecionando para login...
                  </Text>
                )}

                {signUpError && (
                  <Text style={styles.errorText}>{signUpError}</Text>
                )}

                <Text variant="bodySmall" style={styles.infoText}>
                  Apenas alunos podem criar contas. Se você é professor, entre
                  em contato com o administrador do sistema.
                </Text>

                <TextInput
                  label="Email"
                  value={signUpData.email}
                  onChangeText={(text) =>
                    setSignUpData((prev) => ({ ...prev, email: text }))
                  }
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  disabled={signUpLoading || signUpSuccess}
                  style={styles.input}
                />

                <TextInput
                  label="Senha"
                  value={signUpData.senha}
                  onChangeText={(text) =>
                    setSignUpData((prev) => ({ ...prev, senha: text }))
                  }
                  mode="outlined"
                  secureTextEntry
                  disabled={signUpLoading || signUpSuccess}
                  style={styles.input}
                />

                <TextInput
                  label="Confirmar Senha"
                  value={signUpData.confirmSenha}
                  onChangeText={(text) =>
                    setSignUpData((prev) => ({
                      ...prev,
                      confirmSenha: text,
                    }))
                  }
                  mode="outlined"
                  secureTextEntry
                  disabled={signUpLoading || signUpSuccess}
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  onPress={handleSignUp}
                  disabled={signUpLoading || signUpSuccess}
                  style={styles.button}
                >
                  {signUpLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    'Criar Conta'
                  )}
                </Button>

                <View style={styles.linkContainer}>
                  <Text variant="bodySmall">Já tem uma conta? </Text>
                  <Button
                    mode="text"
                    onPress={handleToggleMode}
                    disabled={signUpLoading || signUpSuccess}
                    compact
                  >
                    Fazer login
                  </Button>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  form: {
    gap: 12,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 4,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  errorText: {
    color: '#f44336',
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 4,
    marginBottom: 12,
  },
  successText: {
    color: '#4caf50',
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
    marginBottom: 12,
  },
  infoText: {
    color: '#1976d2',
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    marginBottom: 12,
  },
});
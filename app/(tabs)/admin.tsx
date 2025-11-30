import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';

export default function AdminScreen() {
  const { logout, user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Painel do Professor</Title>
          <Text style={styles.welcomeText}>Bem-vindo, {user?.professorName || user?.email}</Text>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Gerenciar Posts" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => router.push("/post/create-edit")}
              style={styles.primaryButton}
            >
              Criar Novo Post
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Gerenciar Usuários" titleStyle={styles.cardTitle} />
          <Card.Content style={styles.cardContent}>
            <Button 
              mode="outlined" 
              onPress={() => router.push("/(auth)/signup-student")}
              style={styles.outlinedButton}
            >
              Cadastrar Novo Aluno
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => router.push("/(auth)/signup-professor")}
              style={styles.outlinedButton}
            >
              Cadastrar Novo Professor
            </Button>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          buttonColor="#d05252" 
          onPress={logout} 
          style={styles.logout}
          icon="logout"
        >
          Sair
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 24, padding: 16, backgroundColor: '#fff', borderRadius: 8 },
  headerTitle: { color: '#5B7C99', fontSize: 24, fontWeight: 'bold' },
  welcomeText: { marginTop: 8, color: '#666' },
  card: { marginBottom: 16, elevation: 2 },
  cardTitle: { color: '#5B7C99' },
  cardContent: { gap: 12 },
  primaryButton: { paddingVertical: 4 },
  outlinedButton: { marginBottom: 8 },
  logout: { marginTop: 20, paddingVertical: 4 }
});
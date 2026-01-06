import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';

export default function AdminScreen() {
  const { logout, user } = useAuth();

  if (user?.isProfessor === false) {
    return (
      <View style={styles.centered}>
        <Text>Acesso restrito a professores.</Text>
        <Button onPress={() => router.replace("/(tabs)")}>Voltar ao Feed</Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        <View style={styles.header}>
          <View>
            <Title style={styles.headerTitle}>Painel do Professor</Title>
            <Text style={styles.welcomeText}>Olá, {user?.professorName || user?.email}</Text>
          </View>
          <Avatar.Icon size={48} icon="account-tie" style={{ backgroundColor: '#5B7C99' }} />
        </View>

        <Card style={styles.card}>
          <Card.Title title="Conteúdo" subtitle="Gerencie as publicações" left={(props) => <Avatar.Icon {...props} icon="file-document" style={{backgroundColor: '#C17767'}} />} />
          <Card.Content>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => router.push("/post/create-edit")}
              style={styles.primaryButton}
            >
              Criar Novo Post
            </Button>
             <Button 
              mode="outlined" 
              icon="file-document-multiple"
              onPress={() => router.push({ pathname: "/(tabs)", params: { filter: 'my-posts' } })}
              style={styles.secondaryButton}
            >
              Ver Meus Posts
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Administração" subtitle="Gestão de usuários" left={(props) => <Avatar.Icon {...props} icon="account-group" style={{backgroundColor: '#5B7C99'}} />} />
          <Card.Content style={styles.cardContent}>
            <Button 
              mode="outlined" 
              icon="school"
              onPress={() => router.push({ pathname: "/users/list", params: { role: 'student' } })}
              style={styles.outlinedButton}
            >
              Gerenciar Alunos
            </Button>
            <Button 
              mode="outlined" 
              icon="human-lectern"
              onPress={() => router.push({ pathname: "/users/list", params: { role: 'professor' } })}
              style={styles.outlinedButton}
            >
              Gerenciar Professores
            </Button>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          buttonColor="#d32f2f" 
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentContainer: { padding: 16, paddingBottom: 32 },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24, padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 2 
  },
  headerTitle: { color: '#5B7C99', fontSize: 22, fontWeight: 'bold' },
  welcomeText: { marginTop: 4, color: '#666' },
  card: { marginBottom: 16, elevation: 2, backgroundColor: '#fff' },
  cardContent: { gap: 10, marginTop: 10 },
  primaryButton: { backgroundColor: '#5B7C99' },
  secondaryButton: { marginTop: 8, borderColor: '#5B7C99' },
  outlinedButton: { borderColor: '#888' },
  logout: { marginTop: 20 }
});
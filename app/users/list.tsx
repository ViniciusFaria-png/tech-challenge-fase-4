import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, FAB, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteUser, getUsers } from "../../src/actions/users";

export default function UserListScreen() {
  const { role } = useLocalSearchParams<{ role: 'professor' | 'student' }>();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const title = role === 'professor' ? 'Professores' : 'Alunos';

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUsers(role);
      const list = Array.isArray(data) ? data : (data.users || data.professors || []); 
      setUsers(list);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar a lista.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar Exclusão", "Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
          } catch (e) {
            Alert.alert("Erro", "Falha ao excluir usuário.");
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`Gerenciar ${title}`} />
      </Appbar.Header>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" /></View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <List.Item
              title={item.name || item.nome || item.professorName || "Sem Nome"}
              description={item.email}
              left={props => <List.Icon {...props} icon="account" />}
              right={props => (
                <View style={{ flexDirection: 'row' }}>
                  <Appbar.Action icon="pencil" onPress={() => router.push({ pathname: "/users/form", params: { id: item.id, role } })} />
                  <Appbar.Action icon="delete" color="red" onPress={() => handleDelete(item.id)} />
                </View>
              )}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum usuário encontrado.</Text>}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        label={`Novo ${role === 'professor' ? 'Prof.' : 'Aluno'}`}
        onPress={() => router.push({ pathname: "/users/form", params: { role } })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#5B7C99' },
});
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, Button, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteUser, getUsers } from "../../src/actions/users";

export default function UserListScreen() {
  const { role } = useLocalSearchParams<{ role: 'professor' | 'student' }>();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const title = role === 'professor' ? 'Professores' : 'Alunos';
  
  const totalPages = Math.ceil(allUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedUsers = allUsers.slice(startIndex, endIndex);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUsers(role);
      const list = Array.isArray(data) ? data : (data.users || data.professors || []); 
      setAllUsers(list);
      setCurrentPage(1);
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
            await deleteUser(id, role);
            setAllUsers(prev => prev.filter(u => u.id !== id));
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
        <Appbar.Action 
          icon="plus" 
          onPress={() => router.push({ pathname: "/users/form", params: { role } })} 
        />
      </Appbar.Header>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" /></View>
      ) : (
        <>
          <FlatList
            data={displayedUsers}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <List.Item
                title={role === 'professor' ? (item.nome || item.name || item.email) : item.email}
                description={role === 'professor' ? (item.materia || 'Sem matéria') : ''}
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
          
          {allUsers.length > ITEMS_PER_PAGE && (
            <View style={styles.pagination}>
              <Button
                mode="outlined"
                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                icon="chevron-left"
              >
                Anterior
              </Button>
              
              <View style={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    mode={page === currentPage ? "contained" : "text"}
                    onPress={() => setCurrentPage(page)}
                    compact
                  >
                    {page}
                  </Button>
                ))}
              </View>
              
              <Button
                mode="outlined"
                onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                icon="chevron-right"
              >
                Próxima
              </Button>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 4,
  },
});
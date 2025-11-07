import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Card,
  IconButton,
  Menu,
  Text,
} from 'react-native-paper';
import { useProfessorName } from '../hooks/useProfessorName';
import type { IPost } from '../types/post';

interface PostCardProps {
  post: IPost;
  isProfessor: boolean;
  onView: (post: IPost) => void;
  onEdit?: (post: IPost) => void;
  onDelete?: (post: IPost) => void;
  currentProfessorId?: number | null;
}

export default function PostCard({
  post,
  isProfessor,
  onView,
  onEdit,
  onDelete,
  currentProfessorId,
}: PostCardProps) {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { professorName, isLoading } = useProfessorName(post.professor_id);

  const isOwner =
    isProfessor &&
    currentProfessorId &&
    String(post.professor_id) === String(currentProfessorId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleAction = (action?: (post: IPost) => void) => {
    action?.(post);
    setMenuVisible(false);
  };

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            {post.titulo}
          </Text>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              leadingIcon="eye"
              onPress={() => handleAction(onView)}
              title="Ver post"
            />
            {isOwner && (
              <>
                <Menu.Item
                  leadingIcon="pencil"
                  onPress={() => handleAction(onEdit)}
                  title="Editar"
                />
                <Menu.Item
                  leadingIcon="delete"
                  onPress={() => handleAction(onDelete)}
                  title="Apagar"
                  titleStyle={{ color: '#f44336' }}
                />
              </>
            )}
          </Menu>
        </View>

        {post.resumo && (
          <Text
            variant="bodyMedium"
            style={styles.resumo}
          >
            {post.resumo}
          </Text>
        )}

        <Text
          variant="bodyMedium"
          numberOfLines={3}
          style={styles.content}
        >
          {post.conteudo}
        </Text>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.meta}>
            Criado por{' '}
            {isLoading ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text style={styles.bold}>{professorName}</Text>
            )}
          </Text>
          <Text variant="bodySmall" style={styles.meta}>
            em {formatDate(post.created_at)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  resumo: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 12,
  },
  content: {
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    marginTop: 8,
  },
  meta: {
    color: '#666',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
});
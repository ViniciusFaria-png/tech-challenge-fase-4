import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';
import { IPost } from '../types';

interface PostCardProps {
  post: IPost;
  isProfessor: boolean;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  currentProfessorId?: number;
}

export default function PostCard({ post, isProfessor, onPress, onEdit, onDelete, currentProfessorId }: PostCardProps) {
  const theme = useTheme();
  
  const isOwner = isProfessor && currentProfessorId && String(post.professor_id) == String(currentProfessorId);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>{post.titulo}</Text>
        <Text variant="bodyMedium" numberOfLines={3} style={styles.content}>
          {post.resumo || post.conteudo}
        </Text>
        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
          Data: {new Date(post.created_at).toLocaleDateString()}
        </Text>
      </Card.Content>
      {isOwner && (
        <Card.Actions>
          <IconButton icon="pencil" onPress={onEdit} />
          <IconButton icon="delete" iconColor={theme.colors.error} onPress={onDelete} />
        </Card.Actions>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, marginHorizontal: 16 },
  title: { fontWeight: 'bold', marginBottom: 8 },
  content: { marginBottom: 12 },
});
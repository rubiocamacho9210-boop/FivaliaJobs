import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '@/components/AppButton';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PostCard } from '@/components/PostCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useCreateInterestMutation } from '@/hooks/useInterests';
import { usePostDetailQuery } from '@/hooks/usePosts';
import { AppStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/utils/error';

type Props = NativeStackScreenProps<AppStackParamList, 'PostDetail'>;

export function PostDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const user = useAuthStore((state) => state.user);
  const { data: post, isLoading, isError, refetch } = usePostDetailQuery(postId);
  const createInterestMutation = useCreateInterestMutation();
  const [interestError, setInterestError] = useState<string | null>(null);

  const onPressInterest = async () => {
    if (!post) return;
    setInterestError(null);
    try {
      await createInterestMutation.mutateAsync(post.id);
    } catch (error) {
      setInterestError(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (isError || !post) {
    return (
      <ScreenContainer>
        <ErrorState message="No pudimos cargar esta publicacion." onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <PostCard
        post={post}
        onPress={() => {}}
        onPressAuthor={() => {
          if (post.user?.id) {
            navigation.navigate('PublicProfile', { userId: post.user.id });
          }
        }}
        hideInterestButton={post.userId === user?.id}
        onPressInterest={onPressInterest}
        interestLoading={createInterestMutation.isPending}
      />

      {interestError ? <Text style={styles.error}>{interestError}</Text> : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripcion completa</Text>
        <Text style={styles.sectionBody}>{post.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categoria</Text>
        <Text style={styles.sectionBody}>{post.category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo</Text>
        <Text style={styles.sectionBody}>{post.type === 'NEED' ? 'Necesita ayuda' : 'Ofrece servicio'}</Text>
      </View>

      {post.userId === user?.id ? (
        <AppButton label="Esta es tu publicacion" onPress={() => {}} disabled variant="secondary" />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
  },
});

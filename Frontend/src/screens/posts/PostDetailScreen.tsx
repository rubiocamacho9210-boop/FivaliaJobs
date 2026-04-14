import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '@/components/AppButton';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PostCard } from '@/components/PostCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useCreateInterestMutation } from '@/hooks/useInterests';
import { useAddFavoriteMutation, useMyFavoritesQuery, useRemoveFavoriteMutation } from '@/hooks/useFavorites';
import { usePostDetailQuery, useUpdatePostStatusMutation } from '@/hooks/usePosts';
import { AppStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/utils/error';
import { useI18n } from '@/i18n';
import { useTheme } from '@/context/ThemeContext';

type Props = NativeStackScreenProps<AppStackParamList, 'PostDetail'>;

export function PostDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const user = useAuthStore((state) => state.user);
  const { data: post, isLoading, isError, refetch } = usePostDetailQuery(postId);
  const createInterestMutation = useCreateInterestMutation();
  const updateStatusMutation = useUpdatePostStatusMutation(postId);
  const { t } = useI18n();
  const { colors, spacing, radius, text } = useTheme();
  const [interestError, setInterestError] = useState<string | null>(null);

  const { data: favoritesData } = useMyFavoritesQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  const isFavorite = useMemo(() => {
    return favoritesData?.some((f) => f.post?.id === postId) ?? false;
  }, [favoritesData, postId]);

  const onPressInterest = async () => {
    if (!post) return;
    setInterestError(null);
    try {
      await createInterestMutation.mutateAsync(post.id);
    } catch (error) {
      setInterestError(getApiErrorMessage(error));
    }
  };

  const onPressFavorite = async () => {
    if (isFavorite) {
      await removeFavoriteMutation.mutateAsync(postId);
    } else {
      await addFavoriteMutation.mutateAsync(postId);
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
        <ErrorState message={t.posts.couldNotLoadPost} onRetry={refetch} />
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
        onPressFavorite={onPressFavorite}
        isFavorite={isFavorite}
        favoriteLoading={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
      />

      {interestError ? (
        <Text style={[styles.error, { color: colors.danger, marginBottom: spacing.md }]}>
          {interestError}
        </Text>
      ) : null}

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, marginBottom: spacing.md, padding: spacing.md }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 6 }]}>
          {t.posts.fullDescription}
        </Text>
        <Text style={[styles.sectionBody, { color: colors.textSecondary, fontSize: text.body }]}>
          {post.description}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, marginBottom: spacing.md, padding: spacing.md }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 6 }]}>
          {t.profile.category}
        </Text>
        <Text style={[styles.sectionBody, { color: colors.textSecondary, fontSize: text.body }]}>
          {post.category}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, marginBottom: spacing.md, padding: spacing.md }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 6 }]}>
          {t.posts.type}
        </Text>
        <Text style={[styles.sectionBody, { color: colors.textSecondary, fontSize: text.body }]}>
          {post.type === 'NEED' ? t.posts.needsHelp : t.posts.offersService}
        </Text>
      </View>

      {post.user?.profile?.contact ? (
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, marginBottom: spacing.md, padding: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 6 }]}>
            {t.profile.contact}
          </Text>
          <Text style={[styles.sectionBody, { color: colors.textSecondary, fontSize: text.body }]}>
            {post.user.profile.contact}
          </Text>
        </View>
      ) : null}

      {post.userId === user?.id ? (
        <AppButton
          label={post.status === 'ACTIVE' ? t.postActions.closePost : t.postActions.reopenPost}
          onPress={() => updateStatusMutation.mutate(post.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE')}
          loading={updateStatusMutation.isPending}
          variant={post.status === 'ACTIVE' ? 'secondary' : 'ghost'}
        />
      ) : null}

      {post.userId !== user?.id && post.status === 'CLOSED' && post.user ? (
        <AppButton
          label={t.reviews.writeReview}
          onPress={() =>
            navigation.navigate('WriteReview', {
              postId: post.id,
              toUserId: post.user!.id,
              toUserName: post.user!.name,
              toUserRole: post.user!.role ?? 'WORKER',
            })
          }
          variant="secondary"
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  error: {},
  section: {},
  sectionTitle: {},
  sectionBody: {},
});

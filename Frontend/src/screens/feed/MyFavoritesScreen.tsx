import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PostCard } from '@/components/PostCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useAddFavoriteMutation, useMyFavoritesQuery, useRemoveFavoriteMutation } from '@/hooks/useFavorites';
import { useCreateInterestMutation } from '@/hooks/useInterests';
import { usePostsQuery } from '@/hooks/usePosts';
import { AppStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/i18n';

export function MyFavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const { t } = useI18n();
  const favoritesQuery = useMyFavoritesQuery();
  const { data: allPosts } = usePostsQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();
  const createInterestMutation = useCreateInterestMutation();

  const favoritePostIds = React.useMemo(() => {
    return new Set(favoritesQuery.data?.map((f) => f.post?.id).filter(Boolean) ?? []);
  }, [favoritesQuery.data]);

  const onPressFavorite = async (postId: string) => {
    if (favoritePostIds.has(postId)) {
      await removeFavoriteMutation.mutateAsync(postId);
    } else {
      await addFavoriteMutation.mutateAsync(postId);
    }
  };

  const favoritePosts = React.useMemo(() => {
    if (!allPosts || !favoritesQuery.data) return [];
    const favoriteIds = new Set(favoritesQuery.data.map((f) => f.post?.id).filter(Boolean));
    return allPosts.filter((post) => favoriteIds.has(post.id));
  }, [allPosts, favoritesQuery.data]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t.favorites.title}</Text>
      <Text style={styles.subtitle}>{t.favorites.noFavoritesDescription}</Text>

      {favoritesQuery.isLoading ? <LoadingState /> : null}
      {favoritesQuery.isError ? (
        <ErrorState message={t.errors.generic} onRetry={favoritesQuery.refetch} />
      ) : null}

      {!favoritesQuery.isLoading && !favoritesQuery.isError && (favoritesQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          title={t.favorites.noFavorites}
          description={t.favorites.noFavoritesDescription}
        />
      ) : null}

      {!favoritesQuery.isLoading && !favoritesQuery.isError && favoritesQuery.data ? (
        <FlatList
          data={favoritePosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={favoritesQuery.isFetching}
              onRefresh={favoritesQuery.refetch}
            />
          }
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
              onPressAuthor={() => {
                if (item.user?.id) {
                  navigation.navigate('PublicProfile', { userId: item.user.id });
                }
              }}
              hideInterestButton={item.userId === user?.id}
              onPressFavorite={() => onPressFavorite(item.id)}
              isFavorite={favoritePostIds.has(item.id)}
              favoriteLoading={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
            />
          )}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.title,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
    marginBottom: theme.spacing.md,
  },
  list: {
    paddingBottom: theme.spacing.xl,
  },
});

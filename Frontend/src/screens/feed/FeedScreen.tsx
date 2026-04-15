import React, { useState, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { FilterChips } from '@/components/FilterChips';
import { LoadingState } from '@/components/LoadingState';
import { PostCard } from '@/components/PostCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SearchInput } from '@/components/SearchInput';
import { useCreateInterestMutation } from '@/hooks/useInterests';
import { useAddFavoriteMutation, useMyFavoritesQuery, useRemoveFavoriteMutation } from '@/hooks/useFavorites';
import { usePostsQuery } from '@/hooks/usePosts';
import { AppStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/utils/error';
import { theme } from '@/constants/theme';
import { useI18n } from '@/i18n';
import { PostType } from '@/types/post';
import { BrandMark } from '@/components/BrandMark';

export function FeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PostType | null>(null);

  const { data: posts, isLoading, isError, refetch } = usePostsQuery({
    type: selectedType ?? undefined,
    search: searchQuery.trim() || undefined,
  });

  const { data: favoritesData } = useMyFavoritesQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  const createInterestMutation = useCreateInterestMutation();
  const [interestError, setInterestError] = useState<string | null>(null);

  const favoritePostIds = useMemo(() => {
    return new Set(favoritesData?.map((f) => f.post?.id).filter(Boolean) ?? []);
  }, [favoritesData]);

  const onPressInterest = async (postId: string) => {
    setInterestError(null);
    try {
      await createInterestMutation.mutateAsync(postId);
    } catch (error) {
      setInterestError(getApiErrorMessage(error));
    }
  };

  const onPressFavorite = async (postId: string) => {
    if (favoritePostIds.has(postId)) {
      await removeFavoriteMutation.mutateAsync(postId);
    } else {
      await addFavoriteMutation.mutateAsync(postId);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>{t.tabs.feed}</Text>
            <Text style={styles.subtitle}>
              {t.auth.welcome.replace('FivaliaJobs', '').trim()}, {user?.name ?? t.postCard.user}.
            </Text>
          </View>
          <BrandMark size="sm" />
        </View>
      </View>

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t.posts.searchPosts}
      />

      <FilterChips selectedType={selectedType} onSelectType={setSelectedType} />

      {interestError ? <Text style={styles.error}>{interestError}</Text> : null}

      {isLoading ? <LoadingState /> : null}
      {isError ? <ErrorState message={t.errors.couldNotLoadFeed} onRetry={refetch} /> : null}

      {!isLoading && !isError && (posts?.length ?? 0) === 0 ? (
        <EmptyState title={t.posts.noActivePosts} description={t.posts.noActivePosts} />
      ) : null}

      {!isLoading && !isError && posts ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading || createInterestMutation.isPending} onRefresh={refetch} />
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
              onPressInterest={() => onPressInterest(item.id)}
              interestLoading={createInterestMutation.isPending}
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
  header: {
    marginBottom: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.heading,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
  },
});

import React, { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PostCard } from '@/components/PostCard';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useAddFavoriteMutation, useMyFavoritesQuery, useRemoveFavoriteMutation } from '@/hooks/useFavorites';
import { useFollowCountsQuery, useFollowMutation, useFollowingQuery, useUnfollowMutation } from '@/hooks/useFollows';
import { usePostsByUserQuery } from '@/hooks/usePosts';
import { usePublicProfileQuery } from '@/hooks/useProfile';
import { AppStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/i18n';

type Props = NativeStackScreenProps<AppStackParamList, 'PublicProfile'>;

export function PublicProfileScreen({ route, navigation }: Props) {
  const { userId } = route.params;
  const currentUser = useAuthStore((state) => state.user);
  const profileQuery = usePublicProfileQuery(userId);
  const postsQuery = usePostsByUserQuery(userId);
  const { t } = useI18n();

  const { data: followingData } = useFollowingQuery();
  const { data: followCounts } = useFollowCountsQuery();
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();

  const isOwnProfile = currentUser?.id === userId;
  const isFollowing = useMemo(() => {
    return followingData?.some((f) => f.following.id === userId) ?? false;
  }, [followingData, userId]);

  const { data: favoritesData } = useMyFavoritesQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();
  const favoritePostIds = useMemo(() => {
    return new Set(favoritesData?.map((f) => f.post?.id).filter(Boolean) ?? []);
  }, [favoritesData]);

  const onPressFollow = async () => {
    if (isFollowing) {
      await unfollowMutation.mutateAsync(userId);
    } else {
      await followMutation.mutateAsync(userId);
    }
  };

  const onPressFavorite = async (postId: string) => {
    if (favoritePostIds.has(postId)) {
      await removeFavoriteMutation.mutateAsync(postId);
    } else {
      await addFavoriteMutation.mutateAsync(postId);
    }
  };

  if (profileQuery.isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <ScreenContainer>
        <ErrorState message={t.profile.couldNotLoadProfile} onRetry={profileQuery.refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={postsQuery.data ?? []}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={profileQuery.isFetching || postsQuery.isFetching}
            onRefresh={() => {
              profileQuery.refetch();
              postsQuery.refetch();
            }}
          />
        }
        ListHeaderComponent={
          <>
            <ProfileHeader
              profile={profileQuery.data}
              isFollowing={isFollowing}
              onPressFollow={onPressFollow}
              followLoading={followMutation.isPending || unfollowMutation.isPending}
              showFollowButton={!isOwnProfile}
              followersCount={followCounts?.followers}
              followingCount={followCounts?.following}
              onPressFollowers={() => navigation.navigate('MyFollowers')}
              onPressFollowing={() => navigation.navigate('MyFollowing')}
            />
            <Text style={styles.listTitle}>{t.profile.publications}</Text>
            {postsQuery.isLoading ? <LoadingState /> : null}
            {postsQuery.isError ? (
              <ErrorState
                message={t.profile.couldNotLoadPublications}
                onRetry={postsQuery.refetch}
              />
            ) : null}
            {!postsQuery.isLoading && !postsQuery.isError && (postsQuery.data?.length ?? 0) === 0 ? (
              <EmptyState
                title={t.profile.noPublicationsYet}
                description={t.profile.userNoPublications}
              />
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
            hideInterestButton={isOwnProfile}
            onPressFavorite={() => onPressFavorite(item.id)}
            isFavorite={favoritePostIds.has(item.id)}
            favoriteLoading={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: theme.spacing.xl,
  },
  listTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.title,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
});

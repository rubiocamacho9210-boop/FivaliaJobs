import React from 'react';
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ScreenContainer } from '@/components/ScreenContainer';
import { StarRating } from '@/components/StarRating';
import { theme } from '@/constants/theme';
import { useFollowMutation, useFollowingQuery, useUnfollowMutation } from '@/hooks/useFollows';
import { AppStackParamList } from '@/navigation/types';
import { useI18n } from '@/i18n';
import { useTheme } from '@/context/ThemeContext';

export function MyFollowingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { t } = useI18n();
  const { colors, spacing, radius } = useTheme();
  const followingQuery = useFollowingQuery();
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();

  const onPressFollow = async (userId: string, isFollowing: boolean) => {
    if (isFollowing) {
      await unfollowMutation.mutateAsync(userId);
    } else {
      await followMutation.mutateAsync(userId);
    }
  };

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{t.follows.following}</Text>

      {followingQuery.isLoading ? <LoadingState /> : null}
      {followingQuery.isError ? (
        <ErrorState message={t.errors.generic} onRetry={followingQuery.refetch} />
      ) : null}

      {!followingQuery.isLoading && !followingQuery.isError && (followingQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          title={t.follows.noFollowing}
          description={t.follows.noFollowing}
        />
      ) : null}

      {!followingQuery.isLoading && !followingQuery.isError ? (
        <FlatList
          data={followingQuery.data ?? []}
          keyExtractor={(item) => item.following.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={followingQuery.isFetching}
              onRefresh={followingQuery.refetch}
            />
          }
          renderItem={({ item }) => {
            const user = item.following;
            return (
              <Pressable
                onPress={() => navigation.navigate('PublicProfile', { userId: user.id })}
                style={[styles.userCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm }]}
              >
                <View style={styles.userRow}>
                  {user.profile?.photoUrl ? (
                    <Image source={{ uri: user.profile.photoUrl }} style={[styles.avatar, { borderRadius: radius.md }]} />
                  ) : (
                    <View style={[styles.avatar, { backgroundColor: colors.border, borderRadius: radius.md }]} />
                  )}
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: colors.textPrimary }]}>{user.name}</Text>
                    {user.ratingCount > 0 && (
                      <StarRating rating={user.rating} ratingCount={user.ratingCount} size="small" />
                    )}
                    {user.profile?.category ? (
                      <Text style={[styles.userCategory, { color: colors.textSecondary }]}>{user.profile.category}</Text>
                    ) : null}
                  </View>
                  <Pressable
                    onPress={() => onPressFollow(user.id, true)}
                    style={[styles.followButton, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}
                  >
                    <Text style={[styles.followButtonText, { color: colors.textPrimary }]}>{t.follows.unfollow}</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: theme.text.title,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  list: {
    paddingBottom: theme.spacing.xl,
  },
  userCard: {},
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userCategory: {
    fontSize: 13,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

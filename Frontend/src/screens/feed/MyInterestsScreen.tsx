import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PostCard } from '@/components/PostCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useMyInterestsQuery } from '@/hooks/useInterests';
import { AppStackParamList } from '@/navigation/types';
import { useI18n } from '@/i18n';

export function MyInterestsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const interestsQuery = useMyInterestsQuery();
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t.interests.title}</Text>
      <Text style={styles.subtitle}>{t.interests.subtitle}</Text>

      {interestsQuery.isLoading ? <LoadingState /> : null}
      {interestsQuery.isError ? (
        <ErrorState message={t.interests.couldNotLoadInterests} onRetry={interestsQuery.refetch} />
      ) : null}

      {!interestsQuery.isLoading && !interestsQuery.isError && (interestsQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          title={t.interests.noInterests}
          description={t.interests.noInterestsDescription}
        />
      ) : null}

      {!interestsQuery.isLoading && !interestsQuery.isError ? (
        <FlatList
          data={interestsQuery.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={interestsQuery.isFetching}
              onRefresh={interestsQuery.refetch}
            />
          }
          renderItem={({ item }) => (
            <PostCard
              post={{
                ...item.post,
                userId: item.post.user.id,
                description: item.post.title,
                createdAt: item.createdAt,
                updatedAt: item.createdAt,
              }}
              onPress={() => navigation.navigate('PostDetail', { postId: item.post.id })}
              onPressAuthor={() => navigation.navigate('PublicProfile', { userId: item.post.user.id })}
              hideInterestButton
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

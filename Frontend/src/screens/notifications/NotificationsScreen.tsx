import React from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useNotificationsQuery } from '@/hooks/useNotifications';
import { AppStackParamList } from '@/navigation/types';
import { useI18n } from '@/i18n';
import { useTheme } from '@/context/ThemeContext';

export function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { t } = useI18n();
  const { colors, radius, spacing } = useTheme();
  const notificationsQuery = useNotificationsQuery();

  const handlePress = (notification: any) => {
    if (notification.type === 'INTEREST' || notification.type === 'REVIEW') {
      if (notification.data?.postId) {
        navigation.navigate('PostDetail', { postId: notification.data.postId });
      }
    } else if (notification.type === 'FOLLOW') {
      if (notification.data?.userId) {
        navigation.navigate('PublicProfile', { userId: notification.data.userId });
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'INTEREST':
        return '❤️';
      case 'FOLLOW':
        return '👤';
      case 'REVIEW':
        return '⭐';
      default:
        return '🔔';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (notificationsQuery.isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (notificationsQuery.isError) {
    return (
      <ScreenContainer>
        <ErrorState message={t.errors.generic} onRetry={notificationsQuery.refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{t.notifications.title}</Text>

      {!notificationsQuery.data || notificationsQuery.data.length === 0 ? (
        <EmptyState
          title={t.notifications.noNotifications}
          description={t.notifications.noNotificationsDescription}
        />
      ) : (
        <FlatList
          data={notificationsQuery.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={notificationsQuery.isFetching}
              onRefresh={notificationsQuery.refetch}
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handlePress(item)}
              style={[styles.notificationCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm }]}
            >
              <View style={styles.notificationRow}>
                <Text style={styles.icon}>{getIcon(item.type)}</Text>
                <View style={styles.content}>
                  <Text style={[styles.message, { color: colors.textPrimary }]}>{item.message}</Text>
                  <Text style={[styles.time, { color: colors.textSecondary }]}>{getTimeAgo(item.createdAt)}</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
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
  notificationCard: {},
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
});

import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { useTheme } from '@/context/ThemeContext';
import { Post } from '@/types/post';
import { useI18n } from '@/i18n';
import { StarRating } from './StarRating';

type Props = {
  post: Post;
  onPress: () => void;
  onPressAuthor?: () => void;
  onPressInterest?: () => void;
  interestLoading?: boolean;
  hideInterestButton?: boolean;
};

export function PostCard({
  post,
  onPress,
  onPressAuthor,
  onPressInterest,
  interestLoading = false,
  hideInterestButton = false,
}: Props) {
  const { colors, radius, spacing } = useTheme();
  const { t } = useI18n();

  const userRating = post.user?.rating ?? 0;
  const userRatingCount = post.user?.ratingCount ?? 0;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.card,
      { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md },
      Platform.OS === 'ios' && pressed && { opacity: 0.92 },
    ]}>
      <View style={[styles.header, { gap: spacing.sm }]}>
        {post.user?.profile?.photoUrl ? (
          <Image source={{ uri: post.user.profile.photoUrl }} style={[styles.avatar, { borderRadius: 16 }]} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.border, borderRadius: 16 }]} />
        )}
        <View style={styles.headerTextWrap}>
          <View style={styles.authorRow}>
            <Pressable disabled={!onPressAuthor} onPress={onPressAuthor}>
              <Text style={[styles.author, { color: colors.textPrimary }]}>{post.user?.name ?? t.postCard.user}</Text>
            </Pressable>
            {userRatingCount > 0 && (
              <StarRating rating={userRating} ratingCount={userRatingCount} size="small" />
            )}
          </View>
          <Text style={[styles.category, { color: colors.textSecondary }]}>{post.category}</Text>
          {post.user?.profile?.location ? (
            <Text style={[styles.location, { color: colors.textSecondary }]}>
              {t.postCard.location}: {post.user.profile.location}
            </Text>
          ) : null}
        </View>
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{post.title}</Text>
      <Text numberOfLines={3} style={[styles.description, { color: colors.textSecondary }]}>
        {post.description}
      </Text>

      <View style={styles.meta}>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>{post.type === 'NEED' ? t.posts.need : t.posts.offer}</Text>
        <Text style={[styles.metaDot, { color: colors.textSecondary }]}>•</Text>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>{post.status === 'ACTIVE' ? t.postCard.active : t.postCard.closed}</Text>
      </View>

      {!hideInterestButton && onPressInterest ? (
        <View style={[styles.actions, { alignItems: 'flex-end' }]}>
          <AppButton
            label={t.postCard.interested}
            onPress={onPressInterest}
            loading={interestLoading}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    height: 32,
    width: 32,
  },
  headerTextWrap: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
  },
  category: {
    fontSize: 12,
  },
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  metaText: {
    fontSize: 12,
  },
  metaDot: {
    marginHorizontal: 8,
  },
  actions: {},
});

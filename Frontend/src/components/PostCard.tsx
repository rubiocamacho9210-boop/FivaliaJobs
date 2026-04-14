import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { theme } from '@/constants/theme';
import { Post } from '@/types/post';

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
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerTextWrap}>
          <Pressable disabled={!onPressAuthor} onPress={onPressAuthor}>
            <Text style={styles.author}>{post.user?.name ?? 'Usuario'}</Text>
          </Pressable>
          <Text style={styles.category}>{post.category}</Text>
          {post.user?.profile?.location ? (
            <Text style={styles.location}>Ubicacion: {post.user.profile.location}</Text>
          ) : null}
        </View>
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text numberOfLines={3} style={styles.description}>
        {post.description}
      </Text>

      <View style={styles.meta}>
        <Text style={styles.metaText}>{post.type === 'NEED' ? 'Necesito' : 'Ofrezco'}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>{post.status === 'ACTIVE' ? 'Activo' : 'Cerrado'}</Text>
      </View>

      {!hideInterestButton && onPressInterest ? (
        <View style={styles.actions}>
          <AppButton
            label="Me interesa"
            onPress={onPressInterest}
            loading={interestLoading}
            style={styles.interestButton}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
      },
    }),
  },
  cardPressed: {
    opacity: Platform.OS === 'ios' ? 0.92 : 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  avatar: {
    backgroundColor: theme.colors.border,
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  headerTextWrap: {
    flex: 1,
  },
  author: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.caption,
    fontWeight: '600',
  },
  category: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  location: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
    lineHeight: 20,
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  metaText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  metaDot: {
    color: theme.colors.textSecondary,
    marginHorizontal: 8,
  },
  actions: {
    alignItems: 'flex-end',
  },
  interestButton: {
    minHeight: 40,
  },
});

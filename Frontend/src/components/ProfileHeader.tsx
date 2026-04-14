import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n';
import { Profile } from '@/types/profile';
import { StarRating } from './StarRating';

type Props = {
  profile: Profile;
};

export function ProfileHeader({ profile }: Props) {
  const { colors, radius, spacing } = useTheme();
  const { t } = useI18n();
  const userName = profile.user?.name ?? t.postCard.user;
  const userRole = profile.user?.role ?? 'WORKER';
  const userRating = profile.user?.rating ?? 0;
  const userRatingCount = profile.user?.ratingCount ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md }]}>
      {profile.photoUrl ? (
        <Image source={{ uri: profile.photoUrl }} style={[styles.avatar, { borderRadius: 48 }]} />
      ) : (
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border, borderRadius: 48 }]}>
          <Text style={[styles.avatarInitial, { color: colors.textPrimary }]}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={[styles.name, { color: colors.textPrimary }]}>{userName}</Text>
      <Text style={[styles.role, { color: colors.textSecondary }]}>{userRole === 'WORKER' ? t.register.worker : t.register.client}</Text>

      {(userRatingCount > 0) && (
        <View style={[styles.ratingContainer, { marginTop: spacing.xs }]}>
          <StarRating rating={userRating} ratingCount={userRatingCount} size="small" />
        </View>
      )}

      {profile.bio ? <Text style={[styles.bio, { color: colors.textSecondary }]}>{profile.bio}</Text> : null}

      <View style={styles.metaWrap}>
        {profile.category ? <Text style={[styles.meta, { color: colors.textSecondary }]}>{profile.category}</Text> : null}
        {profile.location ? <Text style={[styles.meta, { color: colors.textSecondary }]}>{profile.location}</Text> : null}
        {profile.contact ? <Text style={[styles.meta, { color: colors.textSecondary }]}>{profile.contact}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  role: {
    fontSize: 15,
    marginTop: 2,
  },
  ratingContainer: {},
  bio: {
    fontSize: 15,
    marginTop: 16,
    textAlign: 'center',
  },
  metaWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
});

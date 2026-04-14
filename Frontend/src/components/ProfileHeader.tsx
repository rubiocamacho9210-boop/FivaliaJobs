import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n';
import { Profile } from '@/types/profile';

type Props = {
  profile: Profile;
};

export function ProfileHeader({ profile }: Props) {
  const { colors, radius, spacing } = useTheme();
  const { t } = useI18n();
  const userName = profile.user?.name ?? t.postCard.user;
  const userRole = profile.user?.role ?? 'WORKER';

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md }]}>
      <View style={[styles.avatar, { backgroundColor: colors.border }]} />
      <Text style={[styles.name, { color: colors.textPrimary }]}>{userName}</Text>
      <Text style={[styles.role, { color: colors.textSecondary }]}>{userRole === 'WORKER' ? t.register.worker : t.register.client}</Text>

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
    borderRadius: 36,
    height: 72,
    marginBottom: 12,
    width: 72,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  role: {
    fontSize: 15,
    marginTop: 2,
  },
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

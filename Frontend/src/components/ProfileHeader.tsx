import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { Profile } from '@/types/profile';
import { useI18n } from '@/i18n';

type Props = {
  profile: Profile;
};

export function ProfileHeader({ profile }: Props) {
  const { t } = useI18n();
  const userName = profile.user?.name ?? t.postCard.user;
  const userRole = profile.user?.role ?? 'WORKER';

  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <Text style={styles.name}>{userName}</Text>
      <Text style={styles.role}>{userRole === 'WORKER' ? t.register.worker : t.register.client}</Text>

      {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

      <View style={styles.metaWrap}>
        {profile.category ? <Text style={styles.meta}>{profile.category}</Text> : null}
        {profile.location ? <Text style={styles.meta}>{profile.location}</Text> : null}
        {profile.contact ? <Text style={styles.meta}>{profile.contact}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
      },
    }),
  },
  avatar: {
    backgroundColor: theme.colors.border,
    borderRadius: 36,
    height: 72,
    marginBottom: theme.spacing.sm,
    width: 72,
  },
  name: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  role: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
    marginTop: 2,
  },
  bio: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  metaWrap: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  meta: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
});

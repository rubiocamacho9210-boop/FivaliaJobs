import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { Profile } from '@/types/profile';

type Props = {
  profile: Profile;
};

export function ProfileHeader({ profile }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <Text style={styles.name}>{profile.user.name}</Text>
      <Text style={styles.role}>{profile.user.role === 'WORKER' ? 'Trabajador' : 'Cliente'}</Text>

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

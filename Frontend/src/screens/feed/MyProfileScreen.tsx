import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/constants/theme';

export function MyProfileScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Mi perfil</Text>
        <Text style={styles.subtitle}>Nombre: {user?.name ?? '-'}</Text>
        <Text style={styles.subtitle}>Correo: {user?.email ?? '-'}</Text>
        <Text style={styles.subtitle}>Rol: {user?.role ?? '-'}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.title,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
  },
});

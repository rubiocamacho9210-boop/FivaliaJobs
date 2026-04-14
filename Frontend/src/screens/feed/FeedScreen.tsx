import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AppButton } from '@/components/AppButton';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/constants/theme';

export function FeedScreen() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <Text style={styles.subtitle}>Hola, {user?.name ?? 'usuario'}.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Auth integrado</Text>
        <Text style={styles.cardBody}>
          Ya estas autenticado y esta pantalla se muestra despues de login/register.
        </Text>
        <Text style={styles.cardBody}>Siguiente paso: conectar listado real de /posts.</Text>
      </View>

      <AppButton label="Cerrar sesion" variant="secondary" onPress={clearSession} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.heading,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.title,
    fontWeight: '700',
  },
  cardBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { theme } from '@/constants/theme';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ message = 'No pudimos cargar esta seccion.', onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <AppButton label="Reintentar" variant="secondary" onPress={onRetry} /> : null}
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
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  message: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
    textAlign: 'center',
  },
});

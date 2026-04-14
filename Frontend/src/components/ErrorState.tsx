import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  const { colors, spacing, radius, text } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg }]}>
      <Text style={[styles.message, { color: colors.textSecondary, fontSize: text.body }]}>
        {message}
      </Text>
      {onRetry ? <AppButton label="Retry" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
  },
});

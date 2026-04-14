import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: Props) {
  const { colors, spacing, radius, text } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg }]}>
      <Text style={[styles.title, { color: colors.textPrimary, fontSize: text.title }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary, fontSize: text.body }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function LoadingState() {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: spacing.xl }]}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

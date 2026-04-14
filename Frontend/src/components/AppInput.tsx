import React from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function AppInput({ label, error, style, ...props }: Props) {
  const { colors, spacing, radius, text } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.md }]}>
      <Text style={[styles.label, { color: colors.textSecondary, fontSize: text.caption, marginBottom: spacing.xs }]}>
        {label}
      </Text>
      <TextInput
        {...props}
        autoCapitalize={props.autoCapitalize ?? 'none'}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceAlt,
            borderRadius: radius.md,
            borderWidth: Platform.OS === 'ios' ? 1 : 0,
            borderColor: colors.border,
            color: colors.textPrimary,
            fontSize: text.body,
            minHeight: Platform.select({ ios: 50, android: 56, default: 56 }),
            paddingHorizontal: spacing.md,
          },
          style,
        ]}
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    fontWeight: Platform.select({ ios: '600', android: '500', default: '500' }),
  },
  input: {},
  error: {
    fontSize: 12,
    marginTop: 6,
  },
});

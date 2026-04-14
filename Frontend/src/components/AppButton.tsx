import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}: Props) {
  const { colors, radius, spacing } = useTheme();
  const isDisabled = disabled || loading;
  const isGhost = variant === 'ghost';
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ color: `${colors.accent}24` }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: colors.accent, borderRadius: radius.lg, paddingHorizontal: spacing.lg },
        isSecondary && { backgroundColor: colors.accentSoft },
        isGhost && styles.ghost,
        isDisabled && styles.disabled,
        Platform.OS === 'ios' && pressed && styles.iosPressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary || isGhost ? colors.accent : '#FFFFFF'} />
      ) : (
        <Text style={[styles.label, (isSecondary || isGhost) && { color: colors.accent }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Platform.select({ ios: 50, android: 48, default: 48 }),
  },
  secondary: {},
  ghost: {
    backgroundColor: 'transparent',
    minHeight: 42,
  },
  disabled: {
    opacity: 0.6,
  },
  iosPressed: {
    opacity: 0.8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryLabel: {
    fontWeight: '600',
  },
});

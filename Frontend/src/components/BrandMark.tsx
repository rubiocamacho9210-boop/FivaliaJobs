import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Size = 'sm' | 'md' | 'lg';

const sizeMap = {
  sm: { box: 32, font: 13, radius: 8 },
  md: { box: 48, font: 19, radius: 12 },
  lg: { box: 72, font: 28, radius: 18 },
};

type Props = {
  size?: Size;
};

export function BrandMark({ size = 'md' }: Props) {
  const { colors, isDark } = useTheme();
  const { box, font, radius } = sizeMap[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: box,
          height: box,
          borderRadius: radius,
          backgroundColor: isDark ? colors.accentSoft : colors.accentSoft,
          borderWidth: 1.5,
          borderColor: isDark ? colors.accent + '55' : colors.accent + '33',
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.accent, fontSize: font }]}>FJ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

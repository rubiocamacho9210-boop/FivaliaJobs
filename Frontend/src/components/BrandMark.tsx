import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Size = 'sm' | 'md' | 'lg';

const sizeMap = {
  sm: { box: 66, font: 27, radius: 17 },
  md: { box: 100, font: 39, radius: 25 },
  lg: { box: 150, font: 59, radius: 38 },
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

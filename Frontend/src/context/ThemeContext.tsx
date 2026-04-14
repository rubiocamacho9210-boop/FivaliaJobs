import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useI18n, ThemeMode } from '@/i18n';
import { lightColors, darkColors, baseTheme } from '@/constants/theme';

type ThemeColors = typeof lightColors;

interface ThemeContextValue {
  colors: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
  spacing: typeof baseTheme.spacing;
  radius: typeof baseTheme.radius;
  text: typeof baseTheme.text;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeMode } = useI18n();
  const systemColorScheme = useColorScheme();

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      mode: themeMode,
      isDark,
      ...baseTheme,
    }),
    [isDark, themeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

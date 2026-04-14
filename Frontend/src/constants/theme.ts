import { Platform } from 'react-native';

export const lightColors = {
  background: Platform.select({ ios: '#F2F2F7', android: '#F7F9FC', default: '#F7F9FC' }),
  surface: '#FFFFFF',
  surfaceAlt: Platform.select({ ios: '#FFFFFF', android: '#EEF3FD', default: '#EEF3FD' }),
  textPrimary: Platform.select({ ios: '#111111', android: '#1F1F1F', default: '#1F1F1F' }),
  textSecondary: Platform.select({ ios: '#6E6E73', android: '#5F6368', default: '#5F6368' }),
  border: Platform.select({ ios: '#D1D1D6', android: '#D2DCE8', default: '#D2DCE8' }),
  accent: Platform.select({ ios: '#007AFF', android: '#0B57D0', default: '#0B57D0' }),
  accentSoft: Platform.select({ ios: '#EAF2FF', android: '#E8F0FE', default: '#E8F0FE' }),
  danger: '#B42318',
};

export const darkColors = {
  background: '#1C1C1E',
  surface: '#2C2C2E',
  surfaceAlt: '#3A3A3C',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#48484A',
  accent: '#0A84FF',
  accentSoft: '#1C3A5E',
  danger: '#FF453A',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

export const radius = {
  sm: Platform.select({ ios: 10, android: 12, default: 12 }),
  md: Platform.select({ ios: 14, android: 16, default: 16 }),
  lg: Platform.select({ ios: 18, android: 20, default: 20 }),
};

export const text = {
  heading: Platform.select({ ios: 28, android: 24, default: 24 }),
  title: Platform.select({ ios: 20, android: 20, default: 20 }),
  body: 15,
  caption: 13,
};

export const baseTheme = {
  spacing,
  radius,
  text,
};

export const theme = {
  colors: lightColors,
  spacing,
  radius,
  text,
} as const;

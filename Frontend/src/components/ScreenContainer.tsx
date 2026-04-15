import React, { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { BrandMark } from '@/components/BrandMark';

type Props = PropsWithChildren<{
  scrollable?: boolean;
  showWatermark?: boolean;
}>;

export function ScreenContainer({ children, scrollable = false, showWatermark = true }: Props) {
  const { colors, spacing } = useTheme();

  const content = scrollable ? (
    <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xl }]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg }]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        {content}
      </KeyboardAvoidingView>
      {showWatermark && (
        <View style={styles.watermark} pointerEvents="none">
          <BrandMark size="sm" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  watermark: {
    position: 'absolute',
    top: 12,
    right: 16,
    opacity: 0.18,
  },
});

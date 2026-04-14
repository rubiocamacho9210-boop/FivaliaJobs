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

type Props = PropsWithChildren<{
  scrollable?: boolean;
}>;

export function ScreenContainer({ children, scrollable = false }: Props) {
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
});

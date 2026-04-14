import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthNavigator } from '@/navigation/AuthNavigator';
import { AppNavigator } from '@/navigation/AppNavigator';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/constants/theme';

export function RootNavigator() {
  const token = useAuthStore((state) => state.token);
  const needsProfileSetup = useAuthStore((state) => state.needsProfileSetup);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  if (!hasHydrated) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return token ? <AppNavigator forceProfileSetup={needsProfileSetup} /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});

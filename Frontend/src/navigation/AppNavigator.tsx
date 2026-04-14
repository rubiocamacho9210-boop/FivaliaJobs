import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { AppTabParamList } from '@/navigation/types';
import { FeedScreen } from '@/screens/feed/FeedScreen';
import { MyInterestsScreen } from '@/screens/feed/MyInterestsScreen';
import { MyProfileScreen } from '@/screens/feed/MyProfileScreen';
import { theme } from '@/constants/theme';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.textPrimary, fontWeight: '700' },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          height: Platform.select({ ios: 82, android: 64, default: 64 }),
          paddingBottom: Platform.select({ ios: 18, android: 8, default: 8 }),
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{ title: 'Feed' }} />
      <Tab.Screen
        name="MyInterests"
        component={MyInterestsScreen}
        options={{ title: 'Intereses' }}
      />
      <Tab.Screen name="MyProfile" component={MyProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

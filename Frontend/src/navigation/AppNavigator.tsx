import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { theme } from '@/constants/theme';
import { AppStackParamList, AppTabParamList } from '@/navigation/types';
import { FeedScreen } from '@/screens/feed/FeedScreen';
import { MyInterestsScreen } from '@/screens/feed/MyInterestsScreen';
import { MyProfileScreen } from '@/screens/feed/MyProfileScreen';
import { PostDetailScreen } from '@/screens/posts/PostDetailScreen';
import { CreatePostScreen } from '@/screens/posts/CreatePostScreen';
import { ProfileSetupScreen } from '@/screens/profile/ProfileSetupScreen';
import { PublicProfileScreen } from '@/screens/profile/PublicProfileScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

function MainTabsNavigator() {
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
      <Tab.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Publicar' }} />
      <Tab.Screen name="MyInterests" component={MyInterestsScreen} options={{ title: 'Intereses' }} />
      <Tab.Screen name="MyProfile" component={MyProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.textPrimary, fontWeight: '700' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Detalle' }} />
      <Stack.Screen
        name="PublicProfile"
        component={PublicProfileScreen}
        options={{ title: 'Perfil publico' }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={({ route }) => ({ title: route.params.mode === 'create' ? 'Configurar perfil' : 'Editar perfil' })}
      />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { theme } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n';
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
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.select({ ios: 82, android: 64, default: 64 }),
          paddingBottom: Platform.select({ ios: 18, android: 8, default: 8 }),
          paddingTop: 8,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{ title: t.tabs.feed }} />
      <Tab.Screen name="CreatePost" component={CreatePostScreen} options={{ title: t.tabs.publish }} />
      <Tab.Screen name="MyInterests" component={MyInterestsScreen} options={{ title: t.tabs.interests }} />
      <Tab.Screen name="MyProfile" component={MyProfileScreen} options={{ title: t.tabs.profile }} />
    </Tab.Navigator>
  );
}

type Props = {
  forceProfileSetup?: boolean;
};

export function AppNavigator({ forceProfileSetup = false }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Stack.Navigator
      initialRouteName={forceProfileSetup ? 'ProfileSetup' : 'MainTabs'}
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.textPrimary, fontWeight: '700' },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: t.posts.fullDescription }} />
      <Stack.Screen
        name="PublicProfile"
        component={PublicProfileScreen}
        options={{ title: t.profile.myProfile }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        initialParams={{ mode: 'create' }}
        options={({ route }) => ({
          title: route.params.mode === 'create' ? t.profile.setupProfile : t.profile.editProfile,
          gestureEnabled: route.params.mode === 'edit',
        })}
      />
    </Stack.Navigator>
  );
}

import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Feed: undefined;
  CreatePost: undefined;
  MyInterests: undefined;
  MyFavorites: undefined;
  MyFollowing: undefined;
  MyProfile: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList>;
  PostDetail: { postId: string };
  PublicProfile: { userId: string };
  ProfileSetup: { mode: 'create' | 'edit' };
  MyFollowers: undefined;
};

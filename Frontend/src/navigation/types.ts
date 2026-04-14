import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Feed: undefined;
  CreatePost: undefined;
  MyInterests: undefined;
  Notifications: undefined;
  MyProfile: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList>;
  PostDetail: { postId: string };
  PublicProfile: { userId: string };
  ProfileSetup: { mode: 'create' | 'edit' };
  VerifyEmail: undefined;
  MyFollowers: undefined;
  MyFollowing: undefined;
  MyFavorites: undefined;
  WriteReview: { postId: string; toUserId: string; toUserName: string; toUserRole: 'CLIENT' | 'WORKER' };
};

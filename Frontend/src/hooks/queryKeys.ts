export const queryKeys = {
  posts: ['posts'] as const,
  postDetail: (postId: string) => ['post', postId] as const,
  postsByUser: (userId: string) => ['posts', 'user', userId] as const,
  myInterests: ['interests', 'me'] as const,
  myProfile: ['profile', 'me'] as const,
  profileByUser: (userId: string) => ['profile', userId] as const,
  favorites: ['favorites'] as const,
  following: ['follows', 'following'] as const,
  followers: ['follows', 'followers'] as const,
  followCounts: ['follows', 'counts'] as const,
};

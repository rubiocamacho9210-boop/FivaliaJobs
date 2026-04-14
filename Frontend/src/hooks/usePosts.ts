import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, getPostById, getPosts, getPostsByUserId } from '@/services/api/postsApi';
import { queryKeys } from '@/hooks/queryKeys';
import { CreatePostRequest } from '@/types/post';

export function usePostsQuery() {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: () => getPosts({ page: 1, limit: 30 }),
  });
}

export function usePostDetailQuery(postId: string) {
  return useQuery({
    queryKey: queryKeys.postDetail(postId),
    queryFn: () => getPostById(postId),
    enabled: Boolean(postId),
  });
}

export function usePostsByUserQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.postsByUser(userId),
    queryFn: () => getPostsByUserId(userId),
    enabled: Boolean(userId),
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostRequest) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });
}

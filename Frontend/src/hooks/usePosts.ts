import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, getPostById, getPosts, getPostsByUserId, updatePostStatus } from '@/services/api/postsApi';
import { queryKeys } from '@/hooks/queryKeys';
import { CreatePostRequest, PostType } from '@/types/post';

export type PostFilters = {
  type?: PostType;
  category?: string;
  search?: string;
  location?: string;
};

export function usePostsQuery(filters?: PostFilters) {
  return useQuery({
    queryKey: [...queryKeys.posts, filters],
    queryFn: () => getPosts({ page: 1, limit: 30, ...filters }),
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

export function useUpdatePostStatusMutation(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: 'ACTIVE' | 'CLOSED') => updatePostStatus(postId, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postDetail(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.postsByUser(updated.userId) });
    },
  });
}

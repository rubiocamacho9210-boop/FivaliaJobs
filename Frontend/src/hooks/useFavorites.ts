import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api/client';
import { queryKeys } from '@/hooks/queryKeys';
import { Post } from '@/types/post';

export function useMyFavoritesQuery() {
  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: async () => {
      const response = await api.get<Array<{ id: string; post: Post; createdAt: string }>>('/favorites');
      return response.data;
    },
  });
}

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.post(`/favorites/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  });
}

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.delete(`/favorites/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  });
}

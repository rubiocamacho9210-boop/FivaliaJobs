import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api/client';
import { queryKeys } from '@/hooks/queryKeys';
import { AuthUser } from '@/types/auth';

export type UserWithProfile = {
  id: string;
  name: string;
  role: 'CLIENT' | 'WORKER';
  rating: number;
  ratingCount: number;
  profile: {
    bio: string | null;
    category: string | null;
    location: string | null;
    photoUrl: string | null;
  };
};

export function useFollowingQuery() {
  return useQuery({
    queryKey: queryKeys.following,
    queryFn: async () => {
      const response = await api.get<Array<{ following: UserWithProfile }>>('/follows/following');
      return response.data;
    },
  });
}

export function useFollowersQuery() {
  return useQuery({
    queryKey: queryKeys.followers,
    queryFn: async () => {
      const response = await api.get<Array<{ follower: UserWithProfile }>>('/follows/followers');
      return response.data;
    },
  });
}

export function useFollowCountsQuery() {
  return useQuery({
    queryKey: queryKeys.followCounts,
    queryFn: async () => {
      const response = await api.get<{ following: number; followers: number }>('/follows/counts');
      return response.data;
    },
  });
}

export function useFollowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.post(`/follows/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.following });
      queryClient.invalidateQueries({ queryKey: queryKeys.followers });
      queryClient.invalidateQueries({ queryKey: queryKeys.followCounts });
    },
  });
}

export function useUnfollowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.delete(`/follows/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.following });
      queryClient.invalidateQueries({ queryKey: queryKeys.followers });
      queryClient.invalidateQueries({ queryKey: queryKeys.followCounts });
    },
  });
}

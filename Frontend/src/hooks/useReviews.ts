import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api/client';
import { queryKeys } from '@/hooks/queryKeys';

export type Review = {
  id: string;
  fromUserId: string;
  toUserId: string;
  postId: string;
  rating: number;
  comment: string | null;
  type: 'WORKER_REVIEW' | 'CLIENT_REVIEW';
  createdAt: string;
  fromUser: {
    id: string;
    name: string;
    rating: number;
    ratingCount: number;
    profile: {
      photoUrl: string | null;
    } | null;
  };
  post: {
    id: string;
    title: string;
    category: string;
  };
};

export type CreateReviewRequest = {
  postId: string;
  toUserId: string;
  rating: number;
  comment?: string;
  type: 'WORKER_REVIEW' | 'CLIENT_REVIEW';
};

export function useReviewsForUserQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.reviewsForUser(userId),
    queryFn: async () => {
      const response = await api.get<Review[]>(`/reviews/user/${userId}`);
      return response.data;
    },
  });
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewRequest) => api.post('/reviews', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews });
    },
  });
}

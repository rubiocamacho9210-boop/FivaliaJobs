import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInterest, getInterestsByPostId, getMyInterests } from '@/services/api/interestsApi';
import { queryKeys } from '@/hooks/queryKeys';

export function useMyInterestsQuery() {
  return useQuery({
    queryKey: queryKeys.myInterests,
    queryFn: () => getMyInterests({ page: 1, limit: 30 }),
  });
}

export function useInterestsByPostQuery(postId: string) {
  return useQuery({
    queryKey: ['interests', 'post', postId],
    queryFn: () => getInterestsByPostId(postId),
    enabled: Boolean(postId),
  });
}

export function useCreateInterestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => createInterest({ postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myInterests });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });
}

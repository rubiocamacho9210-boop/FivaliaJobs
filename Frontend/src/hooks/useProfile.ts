import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMyProfile, getProfileByUserId, updateProfile } from '@/services/api/profileApi';
import { queryKeys } from '@/hooks/queryKeys';
import { UpdateProfileRequest } from '@/types/profile';
import { ApiError } from '@/types/api';

export function useMyProfileQuery() {
  return useQuery({
    queryKey: queryKeys.myProfile,
    queryFn: () => getMyProfile(),
    retry: false,
  });
}

export function usePublicProfileQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.profileByUser(userId),
    queryFn: () => getProfileByUserId(userId),
    enabled: Boolean(userId),
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => updateProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.myProfile, profile);
      queryClient.invalidateQueries({ queryKey: queryKeys.profileByUser(profile.userId) });
    },
  });
}

export function isProfileNotFoundError(error: unknown): boolean {
  const axiosError = error as AxiosError<ApiError>;
  return axiosError?.response?.status === 404;
}

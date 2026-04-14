import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api/client';
import { queryKeys } from '@/hooks/queryKeys';
import { useAuthStore } from '@/store/authStore';

export function useSendVerificationCodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/email-verification/send-code'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myProfile });
    },
  });
}

export function useVerifyEmailMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation({
    mutationFn: (code: string) => api.post<{ success: boolean }>('/email-verification/verify', { code }),
    onSuccess: (response) => {
      if (response.data.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.myProfile });
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          setUser({ ...currentUser, emailVerified: true });
        }
      }
    },
  });
}

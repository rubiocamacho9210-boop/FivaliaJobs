import { useMutation } from '@tanstack/react-query';
import { login, register } from '@/services/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { LoginRequest, RegisterRequest } from '@/types/auth';

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
  });
}

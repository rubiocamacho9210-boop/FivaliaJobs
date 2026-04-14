import { api } from '@/services/api/client';
import { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return response.data;
}

export async function register(payload: RegisterRequest): Promise<void> {
  await api.post('/auth/register', payload);
}

import { api } from '@/services/api/client';
import { CreateInterestRequest, InterestWithFromUser, InterestWithPost } from '@/types/interest';

type PaginationParams = {
  page?: number;
  limit?: number;
};

export async function createInterest(payload: CreateInterestRequest): Promise<void> {
  await api.post('/interests', payload);
}

export async function getMyInterests(params: PaginationParams = {}): Promise<InterestWithPost[]> {
  const response = await api.get<InterestWithPost[]>('/interests/me', { params });
  return response.data;
}

export async function getInterestsByPostId(postId: string): Promise<InterestWithFromUser[]> {
  const response = await api.get<InterestWithFromUser[]>(`/interests/post/${postId}`);
  return response.data;
}

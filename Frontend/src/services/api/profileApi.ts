import { api } from '@/services/api/client';
import { Profile, UpdateProfileRequest } from '@/types/profile';

export async function getMyProfile(): Promise<Profile> {
  const response = await api.get<Profile>('/profile/me');
  return response.data;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<Profile> {
  const response = await api.patch<Profile>('/profile', payload);
  return response.data;
}

export async function getProfileByUserId(userId: string): Promise<Profile> {
  const response = await api.get<Profile>(`/profile/${userId}`);
  return response.data;
}

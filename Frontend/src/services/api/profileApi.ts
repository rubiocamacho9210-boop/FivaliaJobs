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

export async function uploadPhoto(localUri: string): Promise<string> {
  const filename = localUri.split('/').pop() ?? 'photo.jpg';
  const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
  const mimeMap: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
  const type = mimeMap[ext] ?? 'image/jpeg';

  const form = new FormData();
  form.append('photo', { uri: localUri, name: filename, type } as unknown as Blob);

  const response = await api.post<{ photoUrl: string }>('/profile/upload-photo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.photoUrl;
}

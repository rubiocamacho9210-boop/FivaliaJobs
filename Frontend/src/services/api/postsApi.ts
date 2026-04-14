import { api } from '@/services/api/client';
import { CreatePostRequest, Post, PostType } from '@/types/post';

type PaginationParams = {
  page?: number;
  limit?: number;
  type?: PostType;
  category?: string;
  search?: string;
  location?: string;
};

export async function getPosts(params: PaginationParams = {}): Promise<Post[]> {
  const response = await api.get<Post[]>('/posts', { params });
  return response.data;
}

export async function getPostById(postId: string): Promise<Post> {
  const response = await api.get<Post>(`/posts/${postId}`);
  return response.data;
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  const response = await api.get<Post[]>(`/posts/user/${userId}`);
  return response.data;
}

export async function createPost(payload: CreatePostRequest): Promise<Post> {
  const response = await api.post<Post>('/posts', payload);
  return response.data;
}

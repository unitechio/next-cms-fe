import { apiClient } from '@/lib/axios';
import { Post, PostFilters } from '../types';
import { ApiResponse } from '@/types';

export const postService = {
  getPosts: async (filters: PostFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.author_id) params.append('author_id', filters.author_id);

    const response = await apiClient.get<ApiResponse<Post[]>>(`/posts?${params.toString()}`);
    return response.data;
  },

  getPost: async (id: string) => {
    const response = await apiClient.get<Post>(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: Partial<Post>) => {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
  },

  updatePost: async (id: string, data: Partial<Post>) => {
    const response = await apiClient.put<Post>(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string) => {
    await apiClient.delete(`/posts/${id}`);
  },

  publishPost: async (id: string) => {
    await apiClient.post(`/posts/${id}/publish`);
  },
};

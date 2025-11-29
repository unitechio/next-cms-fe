import { apiClient } from '@/lib/axios';
import { Media, MediaFilters } from '../types';
import { ApiResponse } from '@/types';

export const mediaService = {
  getMedia: async (filters: MediaFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);

    const response = await apiClient.get<ApiResponse<Media[]>>(`/media?${params.toString()}`);
    return response.data;
  },

  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Media>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMedia: async (id: string) => {
    await apiClient.delete(`/media/${id}`);
  },

  getPresignedUrl: async (id: string) => {
    const response = await apiClient.get<{ url: string }>(`/media/${id}/presigned-url`);
    return response.data;
  },
};

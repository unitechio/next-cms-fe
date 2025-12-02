import { apiClient } from '@/lib/axios';
import { Block } from '@/features/pages/types';
import { BlockFilters } from '../types';
import { ApiResponse } from '@/types';

export const blockService = {
    getBlocks: async (filters: BlockFilters) => {
        const params = new URLSearchParams({
            page: filters.page.toString(),
            limit: filters.limit.toString(),
        });
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.type) params.append('type', filters.type);

        const response = await apiClient.get<ApiResponse<Block[]>>(`/blocks?${params.toString()}`);
        return response.data;
    },

    getBlock: async (id: string) => {
        const response = await apiClient.get<Block>(`/blocks/${id}`);
        return response.data;
    },

    createBlock: async (data: Partial<Block>) => {
        const response = await apiClient.post<Block>('/blocks', data);
        return response.data;
    },

    updateBlock: async (id: string, data: Partial<Block>) => {
        const response = await apiClient.put<Block>(`/blocks/${id}`, data);
        return response.data;
    },

    deleteBlock: async (id: string) => {
        await apiClient.delete(`/blocks/${id}`);
    },
};

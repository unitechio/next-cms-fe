import { apiClient } from '@/lib/axios';
import { Page, PageFilters, PageBlock, PageVersion } from '../types';
import { ApiResponse } from '@/types';

export const pageService = {
    getPages: async (filters: PageFilters) => {
        const params = new URLSearchParams({
            page: filters.page.toString(),
            limit: filters.limit.toString(),
        });
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);

        const response = await apiClient.get<ApiResponse<Page[]>>(`/pages?${params.toString()}`);
        return response.data;
    },

    getPage: async (id: string) => {
        const response = await apiClient.get<Page>(`/pages/${id}`);
        return response.data;
    },

    createPage: async (data: Partial<Page>) => {
        const response = await apiClient.post<Page>('/pages', data);
        return response.data;
    },

    updatePage: async (id: string, data: Partial<Page>) => {
        const response = await apiClient.put<Page>(`/pages/${id}`, data);
        return response.data;
    },

    deletePage: async (id: string) => {
        await apiClient.delete(`/pages/${id}`);
    },

    duplicatePage: async (id: string) => {
        const response = await apiClient.post<Page>(`/pages/${id}/duplicate`);
        return response.data;
    },

    publishPage: async (id: string) => {
        const response = await apiClient.post<Page>(`/pages/${id}/publish`);
        return response.data;
    },

    // Page Blocks
    addBlockToPage: async (pageId: string, data: Partial<PageBlock>) => {
        const response = await apiClient.post<PageBlock>(`/pages/${pageId}/blocks`, data);
        return response.data;
    },

    updatePageBlock: async (pageId: string, blockId: string, data: Partial<PageBlock>) => {
        const response = await apiClient.put<PageBlock>(`/pages/${pageId}/blocks/${blockId}`, data);
        return response.data;
    },

    removeBlockFromPage: async (pageId: string, blockId: string) => {
        await apiClient.delete(`/pages/${pageId}/blocks/${blockId}`);
    },

    reorderBlocks: async (pageId: string, blocks: Array<{ id: string; order: number }>) => {
        await apiClient.put(`/pages/${pageId}/blocks/reorder`, { blocks });
    },

    // Versions
    getPageVersions: async (pageId: string) => {
        const response = await apiClient.get<{ data: PageVersion[] }>(`/pages/${pageId}/versions`);
        return response.data;
    },

    revertPageVersion: async (pageId: string, versionId: string) => {
        const response = await apiClient.post<Page>(`/pages/${pageId}/versions/${versionId}/revert`);
        return response.data;
    },
};

import { apiClient } from '@/lib/axios';
import {
    Category,
    CategoryTree,
    CategoryFilters,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    ReorderCategoryRequest
} from '../types';
import { ApiResponse } from '@/types';

export const categoryService = {
    /**
     * Get paginated list of categories
     */
    getCategories: async (filters: CategoryFilters) => {
        const params = new URLSearchParams({
            page: filters.page.toString(),
            limit: filters.limit.toString(),
        });

        if (filters.search) params.append('search', filters.search);
        if (filters.type) params.append('type', filters.type);
        if (filters.status) params.append('status', filters.status);
        if (filters.parent_id !== undefined) {
            params.append('parent_id', filters.parent_id?.toString() || 'null');
        }

        const response = await apiClient.get<ApiResponse<Category[]>>(
            `/categories?${params.toString()}`
        );
        return response.data;
    },

    /**
     * Get categories in tree structure
     */
    getCategoryTree: async (type?: string) => {
        const params = type ? `?type=${type}` : '';
        const response = await apiClient.get<CategoryTree[]>(`/categories/tree${params}`);
        return response.data;
    },

    /**
     * Get single category by ID
     */
    getCategory: async (id: number) => {
        const response = await apiClient.get<Category>(`/categories/${id}`);
        return response.data;
    },

    /**
     * Create new category
     */
    createCategory: async (data: CreateCategoryRequest) => {
        const response = await apiClient.post<Category>('/categories', data);
        return response.data;
    },

    /**
     * Update existing category
     */
    updateCategory: async (id: number, data: UpdateCategoryRequest) => {
        const response = await apiClient.put<Category>(`/categories/${id}`, data);
        return response.data;
    },

    /**
     * Delete category
     */
    deleteCategory: async (id: number) => {
        await apiClient.delete(`/categories/${id}`);
    },

    /**
     * Reorder category (change parent or order)
     */
    reorderCategory: async (id: number, data: ReorderCategoryRequest) => {
        const response = await apiClient.put<Category>(`/categories/${id}/reorder`, data);
        return response.data;
    },

    /**
     * Get active categories for selection (no pagination)
     */
    getActiveCategories: async (type?: string) => {
        const params = new URLSearchParams({ status: 'active' });
        if (type) params.append('type', type);

        const response = await apiClient.get<Category[]>(
            `/categories/active?${params.toString()}`
        );
        return response.data;
    },
};

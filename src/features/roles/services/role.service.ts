import { apiClient } from '@/lib/axios';
import { Role, RoleFilters, Permission } from '../types';
import { ApiResponse } from '@/types';

export const roleService = {
  getRoles: async (filters: RoleFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    if (filters.search) params.append('search', filters.search);

    const response = await apiClient.get<ApiResponse<Role[]>>(`/roles?${params.toString()}`);
    return response.data;
  },

  getRole: async (id: string) => {
    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: Partial<Role>) => {
    const response = await apiClient.post<Role>('/roles', data);
    return response.data;
  },

  updateRole: async (id: string, data: Partial<Role>) => {
    const response = await apiClient.put<Role>(`/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string) => {
    await apiClient.delete(`/roles/${id}`);
  },

  getPermissions: async () => {
    const response = await apiClient.get<{ data: Permission[] }>('/permissions');
    return response.data;
  },
};

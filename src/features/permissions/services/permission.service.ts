import { apiClient } from '@/lib/axios';
import { Permission } from '@/features/roles/types';
import { ApiResponse } from '@/types';

export interface PermissionFilters {
  page: number;
  limit: number;
  search?: string;
  resource?: string;
  action?: string;
}

export const permissionService = {
  getPermissions: async (filters: PermissionFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    if (filters.search) params.append('search', filters.search);
    if (filters.resource) params.append('resource', filters.resource);
    if (filters.action) params.append('action', filters.action);

    const response = await apiClient.get<ApiResponse<Permission[]>>(`/permissions?${params.toString()}`);
    return response.data;
  },

  getPermission: async (id: string) => {
    const response = await apiClient.get<Permission>(`/permissions/${id}`);
    return response.data;
  },

  getAllPermissions: async () => {
    const response = await apiClient.get<{ data: Permission[] }>('/permissions/all');
    return response.data;
  },

  getPermissionsByResource: async (resource: string) => {
    const response = await apiClient.get<Permission[]>(`/permissions/resource/${resource}`);
    return response.data;
  },
};

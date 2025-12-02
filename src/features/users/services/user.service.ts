import { apiClient } from '@/lib/axios';
import { User, UserFilters } from '../types';
import { ApiResponse } from '@/types';

export const userService = {
  getUsers: async (filters: UserFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get<ApiResponse<User[]>>(`/users?${params.toString()}`);
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: Partial<User>) => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    await apiClient.delete(`/users/${id}`);
  },

  // User-Role Management
  getUserRoles: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/users/${userId}/roles`);
    return response.data;
  },

  assignRole: async (userId: string, roleId: number) => {
    const response = await apiClient.post(`/users/${userId}/roles`, { role_id: roleId });
    return response.data;
  },

  removeRole: async (userId: string, roleId: number) => {
    await apiClient.delete(`/users/${userId}/roles/${roleId}`);
  },

  // User Permissions
  getUserPermissions: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/users/${userId}/permissions`);
    return response.data;
  },
};

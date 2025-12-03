import { apiClient } from "@/lib/axios";
import { Role, RoleFilters, Permission } from "../types";
import { ApiResponse } from "@/types";

export const roleService = {
  getRoles: async (filters: RoleFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    if (filters.search) params.append("search", filters.search);

    const response = await apiClient.get<ApiResponse<Role[]>>(
      `/roles?${params.toString()}`,
    );
    return response.data;
  },

  getRole: async (id: string) => {
    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: Partial<Role>) => {
    const response = await apiClient.post<Role>("/roles", data);
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
    const response = await apiClient.get<{ data: Permission[] }>(
      "/permissions",
    );
    return response.data;
  },

  // Role-Permission Management
  getRolePermissions: async (roleId: string) => {
    const response = await apiClient.get<ApiResponse<Permission[]>>(
      `/roles/${roleId}/permissions`,
    );
    return response.data;
  },

  assignPermission: async (roleId: string, permissionId: number) => {
    const response = await apiClient.post(`/roles/${roleId}/permissions`, {
      permission_id: permissionId,
    });
    return response.data;
  },

  removePermission: async (roleId: string, permissionId: number) => {
    await apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
  },
};

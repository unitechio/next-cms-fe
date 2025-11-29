import { apiClient } from '@/lib/axios';
import { AuditLog, AuditLogFilters } from '../types';
import { ApiResponse } from '@/types';

export const auditLogService = {
  getAuditLogs: async (filters: AuditLogFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.action) params.append('action', filters.action);
    if (filters.resource) params.append('resource', filters.resource);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get<ApiResponse<AuditLog[]>>(`/audit-logs?${params.toString()}`);
    return response.data;
  },

  getAuditLog: async (id: string) => {
    const response = await apiClient.get<AuditLog>(`/audit-logs/${id}`);
    return response.data;
  },
};

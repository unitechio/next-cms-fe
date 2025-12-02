import { apiClient } from '@/lib/axios';
import { ActivityLog, ActivityLogFilter, CreateActivityLogRequest } from '../types';
import { ApiResponse } from '@/types';

export const activityLogService = {
  // Get activity logs with filters
  getActivityLogs: async (filters: ActivityLogFilter) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    
    if (filters.search) params.append('search', filters.search);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.activity) params.append('activity', filters.activity);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get<ApiResponse<ActivityLog[]>>(
      `/activity-logs?${params.toString()}`
    );
    return response.data;
  },

  // Get single activity log
  getActivityLog: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ActivityLog>>(
      `/activity-logs/${id}`
    );
    return response.data;
  },

  // Get activity logs for a specific user
  getUserActivities: async (userId: string, limit: number = 10) => {
    const response = await apiClient.get<ApiResponse<ActivityLog[]>>(
      `/users/${userId}/activities?limit=${limit}`
    );
    return response.data;
  },

  // Create activity log (usually done automatically by backend)
  createActivityLog: async (data: CreateActivityLogRequest) => {
    const response = await apiClient.post<ApiResponse<ActivityLog>>(
      '/activity-logs',
      data
    );
    return response.data;
  },

  // Get activity statistics
  getActivityStats: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await apiClient.get<ApiResponse<{
      total: number;
      by_category: Record<string, number>;
      by_user: Array<{ user_id: string; user_name: string; count: number }>;
      recent: ActivityLog[];
    }>>(`/activity-logs/stats?${params.toString()}`);
    return response.data;
  },

  // Export activity logs
  exportActivityLogs: async (filters: ActivityLogFilter) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    });
    
    if (filters.search) params.append('search', filters.search);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.activity) params.append('activity', filters.activity);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get(
      `/activity-logs/export?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};

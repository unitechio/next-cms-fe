import { apiClient } from '@/lib/axios';
import { LoginResponse, User } from './types';
import { LoginSchema } from './components/login-form';
import { z } from 'zod';

export const authService = {
  login: async (data: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
    const response = await apiClient.post<{ success: boolean; data: LoginResponse }>('/auth/login', data);
    return response.data.data; // Extract from wrapper
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data; // Extract from wrapper
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};

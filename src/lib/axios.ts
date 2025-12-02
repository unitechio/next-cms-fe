import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from cookies first, then localStorage as fallback
    let token = Cookies.get('token');
    console.log('📤 API Request:', config.url);
    console.log('🔑 Token from cookies:', token ? 'EXISTS' : 'NONE');
    
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token') || undefined;
      console.log('🔑 Token from localStorage:', token ? 'EXISTS' : 'NONE');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      console.log('❌ No token available');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Log 401 errors for debugging
    if (error.response?.status === 401) {
      console.error('❌ 401 UNAUTHORIZED ERROR - DETAILS:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        hasToken: !!Cookies.get('token'),
        error: error.response?.data
      });
    }
    
    // Handle 401 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Don't redirect if it's a notification endpoint (might be optional)
      const isNotificationEndpoint = originalRequest?.url?.includes('/notifications');
      
      if (!isNotificationEndpoint) {
        // TODO: Implement refresh token logic here if backend supports it
        // For now, just logout
        Cookies.remove('token');
        Cookies.remove('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

import { apiClient } from "@/lib/axios";
import {
  Notification,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationFilter,
  NotificationStats,
  PaginationParams,
  PaginatedResponse,
  OnlineUser,
  WebSocketStats,
  WebSocketMessage,
} from "./types";

class NotificationService {
  private readonly baseUrl = "/notifications";
  private readonly wsUrl = "/ws";

  // User Notification Operations
  async getMyNotifications(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get(`${this.baseUrl}/me`, { params });
    return response.data;
  }

  async getNotification(id: number): Promise<Notification> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async markAsRead(id: number): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${id}/read`);
  }

  async markAsUnread(id: number): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${id}/unread`);
  }

  async markAllAsRead(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/mark-all-read`);
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get(`${this.baseUrl}/unread-count`);
    return response.data.unread_count;
  }

  async getStats(): Promise<NotificationStats> {
    const response = await apiClient.get(`${this.baseUrl}/stats`);
    return response.data;
  }

  async deleteNotification(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async deleteAllMyNotifications(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/me`);
  }

  // Admin Operations
  async getAllNotifications(
    filter?: NotificationFilter,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get(this.baseUrl, {
      params: { ...filter, ...params },
    });
    return response.data;
  }

  async createNotification(
    data: CreateNotificationRequest
  ): Promise<Notification> {
    const response = await apiClient.post(this.baseUrl, data);
    return response.data;
  }

  async updateNotification(
    id: number,
    data: UpdateNotificationRequest
  ): Promise<Notification> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async broadcastNotification(
    data: CreateNotificationRequest
  ): Promise<Notification> {
    const response = await apiClient.post(`${this.baseUrl}/broadcast`, data);
    return response.data;
  }

  // WebSocket Operations
  async getOnlineUsers(): Promise<OnlineUser[]> {
    const response = await apiClient.get(`${this.wsUrl}/online-users`);
    return response.data;
  }

  async getWebSocketStats(): Promise<WebSocketStats> {
    const response = await apiClient.get(`${this.wsUrl}/stats`);
    return response.data;
  }

  async broadcastMessage(message: WebSocketMessage): Promise<void> {
    await apiClient.post(`${this.wsUrl}/broadcast`, message);
  }

  // WebSocket Connection
  getWebSocketUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";
    const wsBaseUrl = baseUrl.replace(/^https?:\/\//, "");
    return `${wsProtocol}://${wsBaseUrl}/api/v1/ws`;
  }
}

export const notificationService = new NotificationService();

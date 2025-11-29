// Notification Types
export enum NotificationType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export enum NotificationPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  link?: string;
  is_read: boolean;
  read_at?: string;
  data?: Record<string, any>;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationRequest {
  user_id?: string; // Optional for broadcast
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  link?: string;
  data?: Record<string, any>;
  expires_at?: string;
}

export interface UpdateNotificationRequest {
  title?: string;
  message?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  link?: string;
  data?: Record<string, any>;
  expires_at?: string;
}

export interface NotificationFilter {
  user_id?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  is_read?: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: Record<NotificationType, number>;
  by_priority: Record<NotificationPriority, number>;
}

export interface PaginationParams {
  after?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  next_cursor?: {
    id: number;
  };
}

// WebSocket Types
export enum WebSocketEventType {
  NOTIFICATION = "notification",
  NOTIFICATION_READ = "notification_read",
  USER_ONLINE = "user_online",
  USER_OFFLINE = "user_offline",
  SYSTEM_MESSAGE = "system_message",
  PING = "ping",
  PONG = "pong",
}

export interface WebSocketMessage {
  type: WebSocketEventType;
  payload: any;
  timestamp: string;
}

export interface OnlineUser {
  user_id: string;
  username: string;
  connection_count: number;
  last_seen: string;
}

export interface WebSocketStats {
  total_connections: number;
  unique_users: number;
  online_users: OnlineUser[];
}

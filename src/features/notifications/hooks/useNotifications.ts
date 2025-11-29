import { useState, useEffect, useCallback } from "react";
import { Notification, NotificationStats, WebSocketEventType } from "../types";
import { notificationService } from "../notification.service";
import { useWebSocket } from "./useWebSocket";
import { toast } from "sonner";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | undefined>();

  // Fetch notifications
  const fetchNotifications = useCallback(async (cursor?: number) => {
    try {
      setLoading(true);
      const response = await notificationService.getMyNotifications({
        after: cursor,
        limit: 20,
      });
      
      if (cursor) {
        // Load more - append to existing
        setNotifications((prev) => [...prev, ...response.data]);
      } else {
        // Initial load - replace
        setNotifications(response.data);
      }
      
      setHasMore(!!response.next_cursor);
      setNextCursor(response.next_cursor?.id);
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      // Only show error toast if it's not an auth error (401)
      // Auth errors will be handled by axios interceptor
      if (error?.response?.status !== 401) {
        toast.error("Failed to load notifications");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await notificationService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  // Mark as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark as read");
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  }, []);

  // Delete all notifications
  const deleteAllNotifications = useCallback(async () => {
    try {
      await notificationService.deleteAllMyNotifications();
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications deleted");
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
      toast.error("Failed to delete all notifications");
    }
  }, []);

  // Load more notifications
  const loadMore = useCallback(() => {
    if (hasMore && !loading && nextCursor) {
      fetchNotifications(nextCursor);
    }
  }, [hasMore, loading, nextCursor, fetchNotifications]);

  // WebSocket integration for real-time notifications
  const { isConnected } = useWebSocket({
    onMessage: (message) => {
      if (message.type === WebSocketEventType.NOTIFICATION) {
        const newNotification = message.payload as Notification;
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Show toast notification
        toast(newNotification.title, {
          description: newNotification.message,
          action: newNotification.link
            ? {
                label: "View",
                onClick: () => {
                  if (newNotification.link) {
                    window.location.href = newNotification.link;
                  }
                },
              }
            : undefined,
        });
      } else if (message.type === WebSocketEventType.NOTIFICATION_READ) {
        const notificationId = message.payload.notification_id;
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n
          )
        );
      }
    },
    onConnect: () => {
      console.log("WebSocket connected for notifications");
    },
    onDisconnect: () => {
      console.log("WebSocket disconnected");
    },
  });

  // Initial load
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    fetchStats();
  }, [fetchNotifications, fetchUnreadCount, fetchStats]);

  return {
    notifications,
    unreadCount,
    stats,
    loading,
    hasMore,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    loadMore,
    refresh: () => fetchNotifications(),
  };
}

"use client";

import { useNotifications } from "../hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NotificationItem } from "./notification-item";
import { CheckCheck, Trash2, Loader2, Bell } from "lucide-react";

interface NotificationListProps {
    onClose?: () => void;
}

export function NotificationList({ onClose }: NotificationListProps) {
    const {
        notifications,
        loading,
        hasMore,
        markAllAsRead,
        deleteAllNotifications,
        loadMore,
    } = useNotifications();

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const handleDeleteAll = async () => {
        if (confirm("Are you sure you want to delete all notifications?")) {
            await deleteAllNotifications();
        }
    };

    return (
        <div className="flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleMarkAllAsRead}
                            title="Mark all as read"
                        >
                            <CheckCheck className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDeleteAll}
                            title="Delete all"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Notification List */}
            <ScrollArea className="flex-1">
                {loading && notifications.length === 0 ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                        <Bell className="h-12 w-12 mb-2 opacity-20" />
                        <p className="text-sm">No notifications</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="p-4 text-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadMore}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Load More"
                            )}
                        </Button>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

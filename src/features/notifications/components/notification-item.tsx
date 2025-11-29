"use client";

import { useRouter } from "next/navigation";
import { Notification, NotificationType, NotificationPriority } from "../types";
import { useNotifications } from "../hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
    Info,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Trash2,
    Eye,
} from "lucide-react";

interface NotificationItemProps {
    notification: Notification;
    onClose?: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
    const router = useRouter();
    const { markAsRead, deleteNotification } = useNotifications();

    const getTypeIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.INFO:
                return <Info className="h-4 w-4 text-blue-500" />;
            case NotificationType.SUCCESS:
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case NotificationType.WARNING:
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case NotificationType.ERROR:
                return <XCircle className="h-4 w-4 text-red-500" />;
        }
    };

    const getPriorityColor = (priority: NotificationPriority) => {
        switch (priority) {
            case NotificationPriority.URGENT:
                return "bg-red-100 text-red-800 border-red-200";
            case NotificationPriority.HIGH:
                return "bg-orange-100 text-orange-800 border-orange-200";
            case NotificationPriority.NORMAL:
                return "bg-blue-100 text-blue-800 border-blue-200";
            case NotificationPriority.LOW:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const handleClick = async () => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }

        if (notification.link) {
            router.push(notification.link);
            onClose?.();
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteNotification(notification.id);
    };

    const handleMarkAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await markAsRead(notification.id);
    };

    return (
        <div
            className={cn(
                "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                !notification.is_read && "bg-blue-50/50"
            )}
            onClick={handleClick}
        >
            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm line-clamp-1">
                            {notification.title}
                        </h4>
                        {!notification.is_read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {notification.message}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className={cn("text-xs", getPriorityColor(notification.priority))}
                            >
                                {notification.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.created_at), {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>

                        <div className="flex gap-1">
                            {!notification.is_read && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={handleMarkAsRead}
                                    title="Mark as read"
                                >
                                    <Eye className="h-3 w-3" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={handleDelete}
                                title="Delete"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

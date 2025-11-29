'use client';

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { notificationService } from "@/features/notifications/notification.service";
import { Notification } from "@/features/notifications/types";
import { MoreVertical, Trash2, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationDialog } from "@/features/notifications/components/notification-dialog";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await notificationService.getMyNotifications({ limit: 10, after: (page - 1) * 10 });
            setNotifications(response.data || []);
            setTotalPages(response.next_cursor ? page + 1 : page);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Failed to fetch notifications");
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleSuccess = () => {
        fetchNotifications();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this notification?")) {
            try {
                await notificationService.deleteNotification(id);
                toast.success("Notification deleted successfully");
                fetchNotifications();
            } catch (error) {
                toast.error("Failed to delete notification");
            }
        }
    };
    
    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            toast.success("Notification marked as read");
            fetchNotifications();
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const handleMarkAsUnread = async (id: number) => {
        try {
            await notificationService.markAsUnread(id);
            toast.success("Notification marked as unread");
            fetchNotifications();
        } catch (error) {
            toast.error("Failed to mark as unread");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
                    <p className="text-muted-foreground">Manage your notifications.</p>
                </div>
                <NotificationDialog onSuccess={handleSuccess} />
            </div>

            <DataTable
                data={notifications}
                isLoading={isLoading}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                }}
                columns={[
                    {
                        header: "Title",
                        accessorKey: "title",
                    },
                    {
                        header: "Message",
                        accessorKey: "message",
                        cell: (notification) => <p className="truncate max-w-xs">{notification.message}</p>
                    },
                    {
                        header: "Type",
                        accessorKey: "type",
                        cell: (notification) => (
                            <Badge variant="outline" className="capitalize">{notification.type}</Badge>
                        ),
                    },
                    {
                        header: "Priority",
                        accessorKey: "priority",
                        cell: (notification) => (
                            <Badge variant="secondary" className="capitalize">{notification.priority}</Badge>
                        )
                    },
                    {
                        header: "Read",
                        accessorKey: "is_read",
                        cell: (notification) => (notification.is_read ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />),
                    },
                    {
                        header: "Created At",
                        accessorKey: "created_at",
                        cell: (notification) => (
                            <span className="text-muted-foreground text-sm">
                                {format(new Date(notification.created_at), "MMM d, yyyy")}
                            </span>
                        ),
                    },
                    {
                        header: "Actions",
                        cell: (notification) => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    {notification.is_read ? (
                                        <DropdownMenuItem onClick={() => handleMarkAsUnread(notification.id)}>
                                            Mark as unread
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                            Mark as read
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleDelete(notification.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ),
                    },
                ]}
            />
        </div>
    );
}
